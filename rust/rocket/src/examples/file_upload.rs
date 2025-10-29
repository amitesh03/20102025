use rocket::data::{Data, ToByteUnit};
use rocket::fs::{relative, FileServer, TempFile};
use rocket::http::{ContentType, Header, Status};
use rocket::response::content::RawHtml;
use rocket::serde::json::Json;
use rocket::{get, post, routes, FromForm};
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use uuid::Uuid;
use crate::models::{ApiResponse, UploadedFile};

// File upload form
#[derive(FromForm)]
pub struct UploadForm {
    pub description: String,
    pub category: Option<String>,
    pub is_public: Option<bool>,
}

// File upload response
#[derive(serde::Serialize, serde::Deserialize)]
pub struct UploadResponse {
    pub id: String,
    pub filename: String,
    pub original_name: String,
    pub size: usize,
    pub content_type: String,
    pub description: String,
    pub category: Option<String>,
    pub is_public: bool,
    pub upload_time: String,
}

// File info response
#[derive(serde::Serialize, serde::Deserialize)]
pub struct FileInfo {
    pub id: String,
    pub filename: String,
    pub original_name: String,
    pub size: usize,
    pub content_type: String,
    pub upload_time: String,
    pub download_url: String,
}

// File storage
pub struct FileStorage {
    upload_dir: PathBuf,
}

impl FileStorage {
    pub fn new(upload_dir: &str) -> Self {
        let upload_dir = PathBuf::from(upload_dir);
        
        // Create upload directory if it doesn't exist
        if !upload_dir.exists() {
            fs::create_dir_all(&upload_dir).unwrap_or_else(|e| {
                eprintln!("Failed to create upload directory: {}", e);
            });
        }
        
        Self { upload_dir }
    }

    pub fn save_file(&self, original_name: &str, data: &[u8]) -> Result<String, String> {
        // Generate unique filename
        let file_id = Uuid::new_v4().to_string();
        let extension = Path::new(original_name)
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or("");
        
        let filename = if extension.is_empty() {
            format!("{}", file_id)
        } else {
            format!("{}.{}", file_id, extension)
        };
        
        let file_path = self.upload_dir.join(&filename);
        
        // Save file
        match fs::write(&file_path, data) {
            Ok(_) => Ok(filename),
            Err(e) => Err(format!("Failed to save file: {}", e)),
        }
    }

    pub fn get_file(&self, filename: &str) -> Result<Vec<u8>, String> {
        let file_path = self.upload_dir.join(filename);
        
        match fs::read(&file_path) {
            Ok(data) => Ok(data),
            Err(e) => Err(format!("Failed to read file: {}", e)),
        }
    }

    pub fn delete_file(&self, filename: &str) -> Result<(), String> {
        let file_path = self.upload_dir.join(filename);
        
        match fs::remove_file(&file_path) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to delete file: {}", e)),
        }
    }

    pub fn list_files(&self) -> Result<Vec<String>, String> {
        match fs::read_dir(&self.upload_dir) {
            Ok(entries) => {
                let files: Result<Vec<_>, _> = entries
                    .filter_map(|entry| entry.ok())
                    .filter(|entry| entry.file_type().map(|ft| ft.is_file()).unwrap_or(false))
                    .map(|entry| entry.file_name().into_string().map_err(|_| "Invalid filename".to_string()))
                    .collect();
                
                files
            }
            Err(e) => Err(format!("Failed to list files: {}", e)),
        }
    }

    pub fn get_file_info(&self, filename: &str) -> Result<FileInfo, String> {
        let file_path = self.upload_dir.join(filename);
        
        match fs::metadata(&file_path) {
            Ok(metadata) => {
                let size = metadata.len() as usize;
                let modified = metadata.modified()
                    .map(|time| chrono::DateTime::<chrono::Utc>::from(time).to_rfc3339())
                    .unwrap_or_else(|_| "Unknown".to_string());
                
                let content_type = self.guess_content_type(filename);
                
                Ok(FileInfo {
                    id: filename.split('.').next().unwrap_or(filename).to_string(),
                    filename: filename.to_string(),
                    original_name: filename.to_string(), // In a real app, store original name separately
                    size,
                    content_type,
                    upload_time: modified,
                    download_url: format!("/files/{}", filename),
                })
            }
            Err(e) => Err(format!("Failed to get file metadata: {}", e)),
        }
    }

    fn guess_content_type(&self, filename: &str) -> String {
        let extension = Path::new(filename)
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or("");
        
        match extension.to_lowercase().as_str() {
            "txt" => "text/plain".to_string(),
            "html" | "htm" => "text/html".to_string(),
            "css" => "text/css".to_string(),
            "js" => "application/javascript".to_string(),
            "json" => "application/json".to_string(),
            "xml" => "application/xml".to_string(),
            "pdf" => "application/pdf".to_string(),
            "zip" => "application/zip".to_string(),
            "png" => "image/png".to_string(),
            "jpg" | "jpeg" => "image/jpeg".to_string(),
            "gif" => "image/gif".to_string(),
            "svg" => "image/svg+xml".to_string(),
            "mp4" => "video/mp4".to_string(),
            "mp3" => "audio/mpeg".to_string(),
            _ => "application/octet-stream".to_string(),
        }
    }
}

// Upload form page
#[get("/upload-form")]
pub fn upload_form() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>File Upload Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .upload-form { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], input[type="file"], select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        input[type="checkbox"] { width: auto; margin-right: 10px; }
        button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .progress { width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden; margin-top: 10px; }
        .progress-bar { height: 100%; background-color: #007bff; width: 0%; transition: width 0.3s; }
        .result { margin-top: 15px; padding: 10px; border-radius: 4px; }
        .success { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
        .file-list { margin-top: 30px; }
        .file-item { padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px; }
        .file-info { display: flex; justify-content: space-between; align-items: center; }
        .file-actions { display: flex; gap: 10px; }
        .file-actions a { color: #007bff; text-decoration: none; }
        .file-actions a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>File Upload Demo</h1>
        
        <div class="upload-form">
            <h2>Upload File</h2>
            <form id="uploadForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="file">Select File:</label>
                    <input type="file" id="file" name="file" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description:</label>
                    <input type="text" id="description" name="description" placeholder="Enter file description">
                </div>
                
                <div class="form-group">
                    <label for="category">Category:</label>
                    <select id="category" name="category">
                        <option value="">Select category</option>
                        <option value="document">Document</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="is_public" name="is_public" value="true">
                        Make file public
                    </label>
                </div>
                
                <button type="submit">Upload File</button>
                
                <div id="progress-container" style="display: none;">
                    <div class="progress">
                        <div id="progress-bar" class="progress-bar"></div>
                    </div>
                    <div id="progress-text">0%</div>
                </div>
                
                <div id="result" class="result" style="display: none;"></div>
            </form>
        </div>
        
        <div class="file-list">
            <h2>Uploaded Files</h2>
            <button onclick="loadFiles()">Refresh File List</button>
            <div id="file-list-container">
                <p>Loading files...</p>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('uploadForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            const fileInput = document.getElementById('file');
            const file = fileInput.files[0];
            
            if (!file) {
                showResult('Please select a file', 'error');
                return;
            }
            
            formData.append('file', file);
            formData.append('description', document.getElementById('description').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('is_public', document.getElementById('is_public').checked);
            
            // Show progress
            const progressContainer = document.getElementById('progress-container');
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            progressContainer.style.display = 'block';
            
            try {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressBar.style.width = percentComplete + '%';
                        progressText.textContent = Math.round(percentComplete) + '%';
                    }
                });
                
                xhr.addEventListener('load', function() {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        showResult('File uploaded successfully!', 'success');
                        loadFiles(); // Refresh file list
                        document.getElementById('uploadForm').reset();
                    } else {
                        showResult('Upload failed: ' + xhr.statusText, 'error');
                    }
                    progressContainer.style.display = 'none';
                });
                
                xhr.addEventListener('error', function() {
                    showResult('Upload failed: Network error', 'error');
                    progressContainer.style.display = 'none';
                });
                
                xhr.open('POST', '/upload');
                xhr.send(formData);
                
            } catch (error) {
                showResult('Upload failed: ' + error.message, 'error');
                progressContainer.style.display = 'none';
            }
        });
        
        function showResult(message, type) {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = message;
            resultDiv.className = 'result ' + type;
            resultDiv.style.display = 'block';
            
            setTimeout(() => {
                resultDiv.style.display = 'none';
            }, 5000);
        }
        
        async function loadFiles() {
            try {
                const response = await fetch('/files');
                const result = await response.json();
                
                const container = document.getElementById('file-list-container');
                
                if (result.success && result.data.length > 0) {
                    let html = '';
                    result.data.forEach(file => {
                        html += `
                            <div class="file-item">
                                <div class="file-info">
                                    <div>
                                        <strong>${file.original_name}</strong><br>
                                        <small>Size: ${formatFileSize(file.size)} | Type: ${file.content_type}</small>
                                    </div>
                                    <div class="file-actions">
                                        <a href="${file.download_url}" target="_blank">Download</a>
                                        <a href="#" onclick="deleteFile('${file.id}')">Delete</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<p>No files uploaded yet.</p>';
                }
            } catch (error) {
                container.innerHTML = '<p>Error loading files: ' + error.message + '</p>';
            }
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        async function deleteFile(fileId) {
            if (!confirm('Are you sure you want to delete this file?')) {
                return;
            }
            
            try {
                const response = await fetch(`/files/${fileId}`, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.success) {
                    loadFiles(); // Refresh file list
                } else {
                    alert('Failed to delete file: ' + result.message);
                }
            } catch (error) {
                alert('Error deleting file: ' + error.message);
            }
        }
        
        // Load files when page loads
        window.addEventListener('load', loadFiles);
    </script>
</body>
</html>
    "#)
}

// File upload endpoint
#[post("/upload", data = "<data>")]
pub async fn upload_file(
    mut data: Data<'_>,
    form: UploadForm,
    file_storage: &State<FileStorage>,
) -> Json<ApiResponse<UploadResponse>> {
    // Read file data (limit to 10MB)
    let file_data = match data.open(10.megabytes()).into_bytes().await {
        Ok(bytes) => bytes.to_vec(),
        Err(_) => {
            return Json(ApiResponse::error("File too large or invalid"));
        }
    };
    
    if file_data.is_empty() {
        return Json(ApiResponse::error("No file data received"));
    }
    
    // Save file
    let filename = match file_storage.save_file("uploaded_file", &file_data) {
        Ok(name) => name,
        Err(error) => {
            return Json(ApiResponse::error(&error));
        }
    };
    
    // Create response
    let response = UploadResponse {
        id: filename.split('.').next().unwrap_or(&filename).to_string(),
        filename: filename.clone(),
        original_name: "uploaded_file".to_string(), // In a real app, get from form
        size: file_data.len(),
        content_type: file_storage.guess_content_type(&filename),
        description: form.description,
        category: form.category,
        is_public: form.is_public.unwrap_or(false),
        upload_time: chrono::Utc::now().to_rfc3339(),
    };
    
    Json(ApiResponse::success(response))
}

// List files endpoint
#[get("/files")]
pub fn list_files(file_storage: &State<FileStorage>) -> Json<ApiResponse<Vec<FileInfo>>> {
    match file_storage.list_files() {
        Ok(filenames) => {
            let mut files = Vec::new();
            
            for filename in filenames {
                if let Ok(file_info) = file_storage.get_file_info(&filename) {
                    files.push(file_info);
                }
            }
            
            Json(ApiResponse::success(files))
        }
        Err(error) => Json(ApiResponse::error(&error)),
    }
}

// Serve file endpoint
#[get("/files/<filename>")]
pub fn serve_file(
    filename: &str,
    file_storage: &State<FileStorage>,
) -> Result<(ContentType, Vec<u8>), Status> {
    match file_storage.get_file(filename) {
        Ok(data) => {
            let content_type = file_storage.guess_content_type(filename);
            let ct = ContentType::parse_flexible(&content_type)
                .unwrap_or(ContentType::Binary);
            Ok((ct, data))
        }
        Err(_) => Err(Status::NotFound),
    }
}

// Delete file endpoint
#[delete("/files/<file_id>")]
pub fn delete_file(
    file_id: &str,
    file_storage: &State<FileStorage>,
) -> Json<ApiResponse<()>> {
    // In a real app, you would map file_id to actual filename
    // For this example, we'll assume file_id is the filename
    match file_storage.delete_file(file_id) {
        Ok(_) => Json(ApiResponse::success(())),
        Err(error) => Json(ApiResponse::error(&error)),
    }
}

// File info endpoint
#[get("/files/<filename>/info")]
pub fn get_file_info(
    filename: &str,
    file_storage: &State<FileStorage>,
) -> Result<Json<ApiResponse<FileInfo>>, Status> {
    match file_storage.get_file_info(filename) {
        Ok(info) => Ok(Json(ApiResponse::success(info))),
        Err(_) => Err(Status::NotFound),
    }
}

// Example file for testing
#[get("/files/example.txt")]
pub fn serve_example_file() -> (ContentType, &'static str) {
    let content = r#"This is an example text file for testing file downloads.

You can use this file to test:
- File downloads
- File serving
- Content type detection

Features demonstrated:
- Text file serving
- Proper content type headers
- File download functionality"#;
    
    (ContentType::Text, content)
}