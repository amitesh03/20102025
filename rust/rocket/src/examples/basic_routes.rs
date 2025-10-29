use rocket::response::content::RawHtml;
use crate::models::ApiResponse;

#[get("/")]
pub fn index() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>Rocket Examples</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .example { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #333; }
        h2 { color: #555; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Rocket Framework Examples</h1>
        <p>Welcome to the Rocket framework examples! This page demonstrates various Rocket features.</p>
        
        <div class="example">
            <h2>Basic Routes</h2>
            <ul>
                <li><a href="/hello">Hello World</a></li>
                <li><a href="/hello/John">Hello with Name</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>Request Data</h2>
            <ul>
                <li><a href="/query-params?page=1&limit=10">Query Parameters</a></li>
                <li><a href="/path-params/123">Path Parameters</a></li>
                <li><a href="/json-body">JSON Body (POST)</a></li>
                <li><a href="/form-data">Form Data (POST)</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>Response Types</h2>
            <ul>
                <li><a href="/json-response">JSON Response</a></li>
                <li><a href="/template-response">Template Response</a></li>
                <li><a href="/redirect-response">Redirect Response</a></li>
                <li><a href="/file-response">File Response</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>Error Handling</h2>
            <ul>
                <li><a href="/error/not-found">404 Not Found</a></li>
                <li><a href="/error/server-error">500 Server Error</a></li>
                <li><a href="/error/custom">Custom Error</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>State Management</h2>
            <ul>
                <li><a href="/counter">Get Counter</a></li>
                <li><a href="/counter/increment">Increment Counter</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>Middleware</h2>
            <ul>
                <li><a href="/auth-required">Auth Required</a></li>
                <li><a href="/logging">Logging Example</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>WebSockets</h2>
            <ul>
                <li><a href="/websocket">WebSocket Example</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>File Upload</h2>
            <ul>
                <li><a href="/upload-form">Upload Form</a></li>
                <li><a href="/upload">Upload Endpoint</a></li>
                <li><a href="/files/example.txt">Serve File</a></li>
            </ul>
        </div>
        
        <div class="example">
            <h2>API Endpoints</h2>
            <ul>
                <li><a href="/api/hello">API Hello</a></li>
                <li><a href="/api/users">API Users</a></li>
                <li><a href="/api/posts">API Posts</a></li>
            </ul>
        </div>
    </div>
</body>
</html>
    "#)
}

#[get("/hello")]
pub fn hello() -> Json<ApiResponse<&'static str>> {
    Json(ApiResponse::success("Hello, Rocket!"))
}

#[get("/hello/<name>")]
pub fn hello_name(name: &str) -> Json<ApiResponse<String>> {
    let message = format!("Hello, {}!", name);
    Json(ApiResponse::success(message))
}