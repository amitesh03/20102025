use rocket::form::Form;
use rocket::http::Status;
use rocket::request::FromRequest;
use rocket::response::content::RawHtml;
use rocket::serde::json::Json;
use rocket::{Request, Outcome};
use serde::{Deserialize, Serialize};
use crate::models::{ApiResponse, QueryParams};

#[derive(Debug, Deserialize, Serialize)]
pub struct QueryParamsResponse {
    pub page: Option<usize>,
    pub per_page: Option<usize>,
    pub sort: Option<String>,
    pub order: Option<String>,
    pub received_params: Vec<String>,
}

#[get("/query-params?<page>&<per_page>&<sort>&<order>")]
pub fn query_params(
    page: Option<usize>,
    per_page: Option<usize>,
    sort: Option<String>,
    order: Option<String>,
) -> Json<ApiResponse<QueryParamsResponse>> {
    let response = QueryParamsResponse {
        page,
        per_page,
        sort,
        order,
        received_params: vec![
            format!("page: {:?}", page),
            format!("per_page: {:?}", per_page),
            format!("sort: {:?}", sort),
            format!("order: {:?}", order),
        ],
    };
    
    Json(ApiResponse::success(response))
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PathParamsResponse {
    pub id: String,
    pub category: Option<String>,
    pub item: Option<String>,
}

#[get("/path-params/<id>/<category..>?<item>")]
pub fn path_params(
    id: String,
    category: Option<Vec<String>>,
    item: Option<String>,
) -> Json<ApiResponse<PathParamsResponse>> {
    let category_str = category.map(|c| c.join("/"));
    
    let response = PathParamsResponse {
        id,
        category: category_str,
        item,
    };
    
    Json(ApiResponse::success(response))
}

#[derive(Debug, Deserialize, Serialize)]
pub struct JsonData {
    pub name: String,
    pub age: Option<u32>,
    pub email: Option<String>,
    pub interests: Option<Vec<String>>,
}

#[post("/json-body", data = "<data>")]
pub fn json_body(data: Json<JsonData>) -> Json<ApiResponse<JsonData>> {
    Json(ApiResponse::success(data.into_inner()))
}

#[derive(Debug, FromForm)]
pub struct FormData {
    pub name: String,
    pub email: String,
    pub message: String,
    pub subscribe: Option<bool>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct FormDataResponse {
    pub name: String,
    pub email: String,
    pub message: String,
    pub subscribe: bool,
}

#[post("/form-data", data = "<form>")]
pub fn form_data(form: Form<FormData>) -> Json<ApiResponse<FormDataResponse>> {
    let response = FormDataResponse {
        name: form.name.clone(),
        email: form.email.clone(),
        message: form.message.clone(),
        subscribe: form.subscribe.unwrap_or(false),
    };
    
    Json(ApiResponse::success(response))
}

// Form for testing form data submission
#[get("/form-data")]
pub fn form_data_page() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>Form Data Example</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .checkbox { display: flex; align-items: center; }
        .checkbox input { width: auto; margin-right: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Form Data Example</h1>
        <p>Fill out the form below to test form data submission:</p>
        
        <form action="/form-data" method="post">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            
            <div class="form-group">
                <div class="checkbox">
                    <input type="checkbox" id="subscribe" name="subscribe" value="true">
                    <label for="subscribe">Subscribe to newsletter</label>
                </div>
            </div>
            
            <button type="submit">Submit</button>
        </form>
    </div>
</body>
</html>
    "#)
}

// JSON body test form
#[get("/json-body")]
pub fn json_body_page() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>JSON Body Example</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        #result { margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <div class="container">
        <h1>JSON Body Example</h1>
        <p>Fill out the form below to test JSON body submission:</p>
        
        <form id="jsonForm">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="age">Age:</label>
                <input type="number" id="age" name="age">
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
            </div>
            
            <div class="form-group">
                <label for="interests">Interests (comma-separated):</label>
                <input type="text" id="interests" name="interests" placeholder="e.g. programming, reading, hiking">
            </div>
            
            <button type="submit">Submit JSON</button>
        </form>
        
        <div id="result" style="display: none;"></div>
    </div>
    
    <script>
        document.getElementById('jsonForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const interests = document.getElementById('interests').value;
            const interestsArray = interests ? interests.split(',').map(i => i.trim()) : [];
            
            const data = {
                name: document.getElementById('name').value,
                age: document.getElementById('age').value ? parseInt(document.getElementById('age').value) : null,
                email: document.getElementById('email').value || null,
                interests: interestsArray.length > 0 ? interestsArray : null
            };
            
            try {
                const response = await fetch('/json-body', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                
                const result = await response.json();
                const resultDiv = document.getElementById('result');
                
                if (result.success) {
                    resultDiv.className = 'success';
                    resultDiv.innerHTML = `
                        <h3>Success!</h3>
                        <pre>${JSON.stringify(result.data, null, 2)}</pre>
                    `;
                } else {
                    resultDiv.className = 'error';
                    resultDiv.innerHTML = `
                        <h3>Error!</h3>
                        <p>${result.message}</p>
                    `;
                }
                
                resultDiv.style.display = 'block';
            } catch (error) {
                const resultDiv = document.getElementById('result');
                resultDiv.className = 'error';
                resultDiv.innerHTML = `
                    <h3>Error!</h3>
                    <p>${error.message}</p>
                `;
                resultDiv.style.display = 'block';
            }
        });
    </script>
</body>
</html>
    "#)
}

// Custom request guard example
pub struct AdminUser {
    pub username: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AdminUser {
    type Error = ();
    
    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // Check for admin header
        match request.headers().get_one("x-admin-user") {
            Some(username) => Outcome::Success(AdminUser {
                username: username.to_string(),
            }),
            None => Outcome::Failure((Status::Unauthorized, ())),
        }
    }
}

#[get("/admin-only")]
pub fn admin_only(admin: AdminUser) -> Json<ApiResponse<String>> {
    let message = format!("Welcome, admin {}!", admin.username);
    Json(ApiResponse::success(message))
}