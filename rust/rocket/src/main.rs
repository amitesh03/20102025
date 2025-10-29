#[macro_use] extern crate rocket;

mod models;
mod handlers;
mod examples;
mod middleware;

use rocket::{Build, Rocket};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
async fn rocket() -> _ {
    // Initialize state
    let (counter, session_store, cache, chat_room, file_storage) = rocket_examples::init_state();
    
    // Initialize middleware
    let (request_logger, response_logger, request_timer, rate_limiter, request_id, security_headers, size_limiter, custom_headers) = rocket_examples::init_middleware();
    
    rocket::build()
        .attach(Template::fairing())
        .attach(CORS)
        .attach(request_logger)
        .attach(response_logger)
        .attach(request_timer)
        .attach(rate_limiter)
        .attach(request_id)
        .attach(security_headers)
        .attach(size_limiter)
        .attach(custom_headers)
        .manage(counter)
        .manage(session_store)
        .manage(cache)
        .manage(chat_room)
        .manage(file_storage)
        .mount("/api", routes![
            handlers::hello,
            handlers::get_users,
            handlers::create_user,
            handlers::get_user,
            handlers::update_user,
            handlers::delete_user,
            handlers::get_posts,
            handlers::create_post,
            handlers::get_post,
            handlers::update_post,
            handlers::delete_post,
            handlers::get_comments,
            handlers::create_comment,
            handlers::get_comment,
            handlers::update_comment,
            handlers::delete_comment,
            handlers::get_activity_logs,
            handlers::create_activity_log,
            handlers::get_activity_log,
            handlers::update_activity_log,
            handlers::delete_activity_log,
        ])
        .mount("/", routes![
            examples::basic_routes::index,
            examples::basic_routes::hello,
            examples::basic_routes::hello_name,
            examples::request_data::query_params,
            examples::request_data::path_params,
            examples::request_data::json_body,
            examples::request_data::form_data,
            examples::request_data::form_data_page,
            examples::request_data::json_body_page,
            examples::response_types::json_response,
            examples::response_types::template_response,
            examples::response_types::redirect_response,
            examples::response_types::file_response,
            examples::response_types::custom_response,
            examples::response_types::streaming_response,
            examples::response_types::csv_response,
            examples::response_types::xml_response,
            examples::response_types::image_response,
            examples::response_types::pdf_response,
            examples::response_types::download,
            examples::response_types::response_with_headers,
            examples::response_types::error_response,
            examples::response_types::empty_response,
            examples::response_types::status_response,
            examples::response_types::html_template,
            examples::error_handling::not_found,
            examples::error_handling::server_error,
            examples::error_handling::custom_error,
            examples::error_handling::bad_request,
            examples::error_handling::unauthorized,
            examples::error_handling::forbidden,
            examples::error_handling::error_with_context,
            examples::error_handling::conditional_error,
            examples::error_handling::validation_error,
            examples::error_handling::external_service_error,
            examples::error_handling::error_with_recovery,
            examples::error_handling::error_logging,
            examples::error_handling::error_formats,
            examples::error_handling::error_with_stack_trace,
            examples::error_handling::detailed_error,
            examples::error_handling::retryable_error,
            examples::state_management::get_counter,
            examples::state_management::increment_counter,
            examples::state_management::reset_counter,
            examples::state_management::create_session,
            examples::state_management::get_session,
            examples::state_management::delete_session,
            examples::state_management::get_active_sessions,
            examples::state_management::protected_route,
            examples::state_management::cache_set,
            examples::state_management::cache_get,
            examples::state_management::cache_delete,
            examples::state_management::cache_clear,
            examples::state_management::cache_cleanup,
            examples::state_management::state_demo,
            examples::middleware::auth_required,
            examples::middleware::logging,
            examples::middleware::timing,
            examples::middleware::rate_limited,
            examples::middleware::secure,
            examples::middleware::custom_headers,
            examples::middleware::middleware_status,
            examples::middleware::middleware_demo,
            examples::websockets::websocket_page,
            examples::websockets::websocket_api,
            examples::websockets::websocket_status,
            examples::websockets::websocket_echo_page,
            examples::file_upload::upload_form,
            examples::file_upload::list_files,
            examples::file_upload::serve_file,
            examples::file_upload::delete_file,
            examples::file_upload::get_file_info,
            examples::file_upload::serve_example_file,
        ])
        .mount("/static", FileServer::from(relative!("static")))
}