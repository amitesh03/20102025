from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import jwt

app = FastAPI(
    title="FastAPI Example",
    description="A comprehensive FastAPI example with various features",
    version="1.0.0"
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"

# Pydantic Models
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: EmailStr
    age: int

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class Todo(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: int

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None

# In-memory database
users_db = {}
todos_db = {}
user_counter = 1
todo_counter = 1

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Example"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# User routes
@app.post("/users/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    global user_counter
    if any(u.email == user.email for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(id=user_counter, **user.dict())
    users_db[user_counter] = new_user
    user_counter += 1
    return new_user

@app.get("/users/", response_model=List[User])
async def get_users():
    return list(users_db.values())

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.put("/users/{user_id}", response_model=User)
async def update_user(user_id: int, user_update: UserUpdate):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    return user

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    del users_db[user_id]
    # Also delete user's todos
    todos_to_delete = [todo_id for todo_id, todo in todos_db.items() if todo.user_id == user_id]
    for todo_id in todos_to_delete:
        del todos_db[todo_id]
    
    return {"message": "User deleted successfully"}

# Authentication routes
@app.post("/login", response_model=Token)
async def login(username: str, password: str):
    # Simple authentication (in production, use proper password hashing)
    if username != "admin" or password != "password":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected")
async def protected_route(current_user: str = Depends(verify_token)):
    return {"message": f"Hello {current_user}, you have access to this protected route"}

# Todo routes
@app.post("/todos/", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoCreate, current_user: str = Depends(verify_token)):
    global todo_counter
    # Find user ID (simplified - in production, get from token)
    user_id = next((uid for uid, user in users_db.items() if user.name == current_user), 1)
    
    new_todo = Todo(id=todo_counter, **todo.dict(), user_id=user_id)
    todos_db[todo_counter] = new_todo
    todo_counter += 1
    return new_todo

@app.get("/todos/", response_model=List[Todo])
async def get_todos(current_user: str = Depends(verify_token)):
    # Get user ID (simplified)
    user_id = next((uid for uid, user in users_db.items() if user.name == current_user), 1)
    return [todo for todo in todos_db.values() if todo.user_id == user_id]

@app.get("/todos/{todo_id}", response_model=Todo)
async def get_todo(todo_id: int, current_user: str = Depends(verify_token)):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo = todos_db[todo_id]
    # Check if user owns this todo
    user_id = next((uid for uid, user in users_db.items() if user.name == current_user), 1)
    if todo.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this todo")
    
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_update: dict, current_user: str = Depends(verify_token)):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo = todos_db[todo_id]
    # Check if user owns this todo
    user_id = next((uid for uid, user in users_db.items() if user.name == current_user), 1)
    if todo.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this todo")
    
    for field, value in todo_update.items():
        if hasattr(todo, field):
            setattr(todo, field, value)
    
    return todo

@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: int, current_user: str = Depends(verify_token)):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo = todos_db[todo_id]
    # Check if user owns this todo
    user_id = next((uid for uid, user in users_db.items() if user.name == current_user), 1)
    if todo.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this todo")
    
    del todos_db[todo_id]
    return {"message": "Todo deleted successfully"}

# Query parameters example
@app.get("/search/")
async def search_users(q: Optional[str] = None, min_age: Optional[int] = None, max_age: Optional[int] = None):
    users = list(users_db.values())
    
    if q:
        users = [user for user in users if q.lower() in user.name.lower() or q.lower() in user.email.lower()]
    
    if min_age:
        users = [user for user in users if user.age >= min_age]
    
    if max_age:
        users = [user for user in users if user.age <= max_age]
    
    return users

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)