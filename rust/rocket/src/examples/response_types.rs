use rocket::http::{ContentType, Status};
use rocket::response::content::{RawHtml, RawJson};
use rocket::response::{Redirect, Responder, Response};
use rocket::serde::json::Json;
use rocket::{Request, Route};
use rocket_dyn_templates::{Template, context};
use std::fs;
use std::io::Cursor;
use std::path::Path;
use crate::models::ApiResponse;

#[get("/json-response")]
pub fn json_response() -> Json<ApiResponse<&'static str>> {
    Json(ApiResponse::success("This is a JSON response"))
}

#[get("/template-response")]
pub fn template_response() -> Template {
    Template::render("example", context! {
        title: "Template Response Example",
        message: "This is a template response using Rocket's templating system",
        items: vec!["Item 1", "Item 2", "Item 3"],
    })
}

#[get("/redirect-response")]
pub fn redirect_response() -> Redirect {
    Redirect::to(uri!("/json-response"))
}

#[get("/file-response")]
pub fn file_response() -> Option<RawJson<String>> {
    let file_content = r#"
{
  "message": "This is a file response",
  "source": "static JSON file",
  "timestamp": "2023-10-21T21:00:00Z"
}
"#;
    Some(RawJson(file_content.to_string()))
}

// Custom response type
pub struct CustomResponse {
    pub status: Status,
    pub content: String,
    pub content_type: ContentType,
}

impl<'r> Responder<'r, 'static> for CustomResponse {
    fn respond_to(self, _request: &'r Request<'_>) -> rocket::response::Result<'static> {
        Response::build()
            .status(self.status)
            .header(self.content_type)
            .sized_body(self.content.len(), Cursor::new(self.content))
            .ok()
    }
}

#[get("/custom-response")]
pub fn custom_response() -> CustomResponse {
    CustomResponse {
        status: Status::Ok,
        content: r#"
{
  "custom": "response",
  "type": "CustomResponse",
  "message": "This is a custom response type"
}
"#.to_string(),
        content_type: ContentType::JSON,
    }
}

// Streaming response
pub struct StreamingResponse {
    pub data: Vec<u8>,
    pub content_type: ContentType,
}

impl<'r> Responder<'r, 'static> for StreamingResponse {
    fn respond_to(self, _request: &'r Request<'_>) -> rocket::response::Result<'static> {
        Response::build()
            .header(self.content_type)
            .sized_body(self.data.len(), Cursor::new(self.data))
            .ok()
    }
}

#[get("/streaming-response")]
pub fn streaming_response() -> StreamingResponse {
    let data = b"This is a streaming response example. In a real application, this could be large data or a file.";
    StreamingResponse {
        data: data.to_vec(),
        content_type: ContentType::Plain,
    }
}

// CSV response
#[get("/csv-response")]
pub fn csv_response() -> CustomResponse {
    let csv_data = "id,name,email\n1,John Doe,john@example.com\n2,Jane Smith,jane@example.com\n3,Bob Johnson,bob@example.com";
    
    CustomResponse {
        status: Status::Ok,
        content: csv_data.to_string(),
        content_type: ContentType::new("text", "csv"),
    }
}

// XML response
#[get("/xml-response")]
pub fn xml_response() -> CustomResponse {
    let xml_data = r#"
<?xml version="1.0" encoding="UTF-8"?>
<response>
    <status>success</status>
    <message>This is an XML response</message>
    <data>
        <item id="1">First item</item>
        <item id="2">Second item</item>
    </data>
</response>
"#.trim();
    
    CustomResponse {
        status: Status::Ok,
        content: xml_data.to_string(),
        content_type: ContentType::XML,
    }
}

// Image response
#[get("/image-response")]
pub fn image_response() -> Option<StreamingResponse> {
    // This is a simple 1x1 PNG image in base64
    let png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    
    match base64::decode(png_base64) {
        Ok(data) => Some(StreamingResponse {
            data,
            content_type: ContentType::PNG,
        }),
        Err(_) => None,
    }
}

// PDF response
#[get("/pdf-response")]
pub fn pdf_response() -> Option<StreamingResponse> {
    // This is a minimal PDF header
    let pdf_data = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000209 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n312\n%%EOF";
    
    Some(StreamingResponse {
        data: pdf_data.to_vec(),
        content_type: ContentType::new("application", "pdf"),
    })
}

// Download response
#[get("/download")]
pub fn download() -> Option<StreamingResponse> {
    let file_content = b"This is a downloadable file.\nYou can save this content to your local machine.";
    
    Some(StreamingResponse {
        data: file_content.to_vec(),
        content_type: ContentType::Plain,
    })
}

// Response with headers
#[get("/response-with-headers")]
pub fn response_with_headers() -> CustomResponse {
    CustomResponse {
        status: Status::Ok,
        content: r#"
{
  "message": "This response includes custom headers",
  "headers": {
    "x-custom-header": "custom-value",
    "cache-control": "no-cache",
    "x-frame-options": "DENY"
  }
}
"#.to_string(),
        content_type: ContentType::JSON,
    }
}

// Error response
#[get("/error-response")]
pub fn error_response() -> CustomResponse {
    CustomResponse {
        status: Status::InternalServerError,
        content: r#"
{
  "error": "Internal Server Error",
  "message": "This is a simulated error response",
  "code": 500
}
"#.to_string(),
        content_type: ContentType::JSON,
    }
}

// Empty response
#[get("/empty-response")]
pub fn empty_response() -> Status {
    Status::NoContent
}

// Response with different status codes
#[get("/status/<code>")]
pub fn status_response(code: u16) -> Status {
    match code {
        200 => Status::Ok,
        201 => Status::Created,
        202 => Status::Accepted,
        204 => Status::NoContent,
        400 => Status::BadRequest,
        401 => Status::Unauthorized,
        403 => Status::Forbidden,
        404 => Status::NotFound,
        500 => Status::InternalServerError,
        _ => Status::ImATeapot,
    }
}

// HTML response with template
#[get("/html-template")]
pub fn html_template() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>HTML Template Response</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .footer { margin-top: 20px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HTML Template Response</h1>
            <p>This is an example of an HTML response from Rocket</p>
        </div>
        
        <div class="content">
            <h2>Features</h2>
            <ul>
                <li>Styled HTML content</li>
                <li>Responsive design</li>
                <li>Clean structure</li>
            </ul>
            
            <h2>Data</h2>
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th>Feature</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>JSON Responses</td>
                    <td>✓ Supported</td>
                </tr>
                <tr>
                    <td>HTML Templates</td>
                    <td>✓ Supported</td>
                </tr>
                <tr>
                    <td>File Downloads</td>
                    <td>✓ Supported</td>
                </tr>
            </table>
        </div>
        
        <div class="footer">
            <p>Generated by Rocket framework</p>
        </div>
    </div>
</body>
</html>
    "#)
}