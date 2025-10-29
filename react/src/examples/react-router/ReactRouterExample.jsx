import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate, useSearchParams, Outlet } from 'react-router-dom'
import './ReactRouterExample.css'

// Example Components for Routing
const Home = () => {
  return (
    <div className="page">
      <h2>Home Page</h2>
      <p>Welcome to our React Router example!</p>
    </div>
  )
}

const About = () => {
  return (
    <div className="page">
      <h2>About Page</h2>
      <p>This is a simple about page demonstrating basic routing.</p>
    </div>
  )
}

const Contact = () => {
  return (
    <div className="page">
      <h2>Contact Page</h2>
      <p>Contact us at: example@example.com</p>
    </div>
  )
}

// Example with URL Parameters
const User = () => {
  const { userId } = useParams()
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'profile'
  
  return (
    <div className="page">
      <h2>User Profile</h2>
      <p>User ID: {userId}</p>
      <p>Current Tab: {tab}</p>
      <div className="tabs">
        <Link to={`/users/${userId}?tab=profile`}>Profile</Link>
        <Link to={`/users/${userId}?tab=settings`}>Settings</Link>
        <Link to={`/users/${userId}?tab=posts`}>Posts</Link>
      </div>
      <div className="tab-content">
        {tab === 'profile' && <p>This is the user's profile information.</p>}
        {tab === 'settings' && <p>This is the user's settings page.</p>}
        {tab === 'posts' && <p>This is the user's posts page.</p>}
      </div>
    </div>
  )
}

// Example with Nested Routes
const Products = () => {
  return (
    <div className="page">
      <h2>Products</h2>
      <p>Browse our products:</p>
      <div className="product-nav">
        <Link to="electronics">Electronics</Link>
        <Link to="clothing">Clothing</Link>
        <Link to="books">Books</Link>
      </div>
      <Outlet />
    </div>
  )
}

const Electronics = () => {
  return (
    <div className="nested-page">
      <h3>Electronics</h3>
      <ul>
        <li>Laptops</li>
        <li>Smartphones</li>
        <li>Tablets</li>
      </ul>
    </div>
  )
}

const Clothing = () => {
  return (
    <div className="nested-page">
      <h3>Clothing</h3>
      <ul>
        <li>Shirts</li>
        <li>Pants</li>
        <li>Shoes</li>
      </ul>
    </div>
  )
}

const Books = () => {
  return (
    <div className="nested-page">
      <h3>Books</h3>
      <ul>
        <li>Fiction</li>
        <li>Non-Fiction</li>
        <li>Technical</li>
      </ul>
    </div>
  )
}

// Example with Programmatic Navigation
const LoginPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const handleLogin = (e) => {
    e.preventDefault()
    // Simulate login
    if (username && password) {
      // Navigate to dashboard after successful login
      navigate('/dashboard', { state: { username } })
    }
  }
  
  return (
    <div className="page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

const Dashboard = () => {
  const location = useLocation()
  const username = location.state?.username || 'Guest'
  
  return (
    <div className="page">
      <h2>Dashboard</h2>
      <p>Welcome, {username}!</p>
      <p>This is your personalized dashboard.</p>
    </div>
  )
}

// Example with Route Guards (Protected Routes)
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // In a real app, you would check authentication status
  // For this example, we'll simulate it with a button
  if (!isAuthenticated) {
    return (
      <div className="page">
        <h2>Access Denied</h2>
        <p>You need to be authenticated to view this page.</p>
        <button onClick={() => setIsAuthenticated(true)}>
          Simulate Login
        </button>
      </div>
    )
  }
  
  return children
}

const AdminPanel = () => {
  return (
    <div className="page">
      <h2>Admin Panel</h2>
      <p>This is a protected admin panel.</p>
    </div>
  )
}

// Navigation Component
const Navigation = () => {
  const location = useLocation()
  
  return (
    <nav className="example-nav">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/about' ? 'active' : ''}>
          <Link to="/about">About</Link>
        </li>
        <li className={location.pathname === '/contact' ? 'active' : ''}>
          <Link to="/contact">Contact</Link>
        </li>
        <li className={location.pathname.startsWith('/users') ? 'active' : ''}>
          <Link to="/users/1">User Example</Link>
        </li>
        <li className={location.pathname.startsWith('/products') ? 'active' : ''}>
          <Link to="/products">Products</Link>
        </li>
        <li className={location.pathname === '/login' ? 'active' : ''}>
          <Link to="/login">Login</Link>
        </li>
        <li className={location.pathname === '/admin' ? 'active' : ''}>
          <Link to="/admin">Admin (Protected)</Link>
        </li>
      </ul>
    </nav>
  )
}

// Main Example Component
const ReactRouterExample = () => {
  const [showRouter, setShowRouter] = useState(false)
  
  return (
    <div className="react-router-example">
      <div className="example-container">
        <div className="example-header">
          <h2>React Router Examples</h2>
          <p>Learn how to implement routing in React applications</p>
        </div>
        
        <div className="example-section">
          <h3>Basic Routing Setup</h3>
          <div className="code-block">
            <pre>{`import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>URL Parameters</h3>
          <div className="code-block">
            <pre>{`// Route definition
<Route path="/users/:userId" element={<User />} />

// Component
const User = () => {
  const { userId } = useParams()
  return <div>User ID: {userId}</div>
}`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Query Parameters</h3>
          <div className="code-block">
            <pre>{`const User = () => {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  return <div>Tab: {tab}</div>
}

// URL: /users/123?tab=profile
// Result: Tab: profile`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Nested Routes</h3>
          <div className="code-block">
            <pre>{`<Route path="/products" element={<Products />}>
  <Route path="electronics" element={<Electronics />} />
  <Route path="clothing" element={<Clothing />} />
</Route>

// Parent component
const Products = () => {
  return (
    <div>
      <h2>Products</h2>
      <Outlet /> {/* Child routes render here */}
    </div>
  )
}`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Programmatic Navigation</h3>
          <div className="code-block">
            <pre>{`const navigate = useNavigate()

const handleLogin = () => {
  // Navigate to dashboard
  navigate('/dashboard')
  
  // Navigate with state
  navigate('/dashboard', { state: { username } })
  
  // Go back
  navigate(-1)
}`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Demo</h3>
          <button 
            className="demo-toggle" 
            onClick={() => setShowRouter(!showRouter)}
          >
            {showRouter ? 'Hide' : 'Show'} Interactive Router Demo
          </button>
          
          {showRouter && (
            <div className="router-demo">
              <Router>
                <Navigation />
                <div className="route-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/users/:userId" element={<User />} />
                    <Route path="/products" element={<Products />}>
                      <Route path="electronics" element={<Electronics />} />
                      <Route path="clothing" element={<Clothing />} />
                      <Route path="books" element={<Books />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminPanel />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
              </Router>
            </div>
          )}
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a multi-page blog application with the following features:</p>
          <ul>
            <li>Home page with a list of blog posts</li>
            <li>Individual blog post pages with URL parameters</li>
            <li>Category pages with query parameters for filtering</li>
            <li>A contact form with navigation after submission</li>
            <li>A protected admin area for creating/editing posts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReactRouterExample