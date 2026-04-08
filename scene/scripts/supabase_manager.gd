extends Node

# ── Configuration ─────────────────────────────────────────────────────────────
const SUPABASE_URL := "https://hlufptwhzkpkkjztimzo.supabase.co"
const SUPABASE_ANON_KEY := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdWZwdHdoemtwa2tqenRpbXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyOTk3NTUsImV4cCI6MjAzMTg3NTc1NX0.v_NDVWjIU_lJQSPbJ_Y6GkW3axrQWKXfXVsBEAbFv_I"

# ── Signals ──────────────────────────────────────────────────────────────────
signal auth_completed(success: bool, error_message: String)
signal session_restored(success: bool)

# ── Auth State ───────────────────────────────────────────────────────────────
var auth_token: String = ""
var refresh_token: String = ""
var user_id: String = ""
var user_email: String = ""
var expires_at: int = 0

const SESSION_SAVE_PATH := "user://supabase_session.json"

func _ready() -> void:
	load_session()

# ── Public Methods ───────────────────────────────────────────────────────────

func sign_up(email: String, password: String) -> void:
	var endpoint := "/auth/v1/signup"
	var body := {
		"email": email,
		"password": password
	}
	_send_auth_request(endpoint, body)

func sign_in(email: String, password: String) -> void:
	var endpoint := "/auth/v1/token?grant_type=password"
	var body := {
		"email": email,
		"password": password
	}
	_send_auth_request(endpoint, body)

func sign_in_anonymously() -> void:
	# Supabase anonymous auth usually works by signing up without email/password 
	# or using a specific provider if configured.
	# For now, we'll implement a placeholder or use the GoTrue 'signup' with random credentials if needed,
	# but Supabase has a specific 'signInAnonymously' in newer JS clients.
	# The REST API for it is /auth/v1/signup with no body or specific flags.
	var endpoint := "/auth/v1/signup"
	var body := {}
	_send_auth_request(endpoint, body)

func sign_out() -> void:
	auth_token = ""
	refresh_token = ""
	user_id = ""
	user_email = ""
	expires_at = 0
	_clear_session_file()
	auth_completed.emit(true, "")

func is_logged_in() -> bool:
	if auth_token.is_empty():
		return false
	
	# Check expiration (with 60s buffer)
	var now = Time.get_unix_time_from_system()
	return now < (expires_at - 60)

# ── Internal Methods ─────────────────────────────────────────────────────────

func _send_auth_request(endpoint: String, body: Dictionary) -> void:
	var http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_auth_request_completed.bind(http_request))
	
	var url = SUPABASE_URL + endpoint
	var headers = [
		"apikey: " + SUPABASE_ANON_KEY,
		"Content-Type: application/json"
	]
	
	var json_body = JSON.stringify(body)
	var error = http_request.request(url, headers, HTTPClient.METHOD_POST, json_body)
	
	if error != OK:
		auth_completed.emit(false, "Failed to send request: " + str(error))
		http_request.queue_free()

func _on_auth_request_completed(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray, http_request: HTTPRequest) -> void:
	http_request.queue_free()
	
	if result != HTTPRequest.RESULT_SUCCESS:
		auth_completed.emit(false, "Network error")
		return
	
	var response_json = JSON.parse_string(body.get_string_from_utf8())
	
	if response_code >= 200 and response_code < 300:
		if response_json.has("access_token"):
			_save_auth_data(response_json)
			auth_completed.emit(true, "")
		else:
			# Potentially sign up success but needs email confirmation
			auth_completed.emit(true, "Check your email for confirmation")
	else:
		var error_msg = "Auth error (" + str(response_code) + ")"
		if response_json and response_json.has("error_description"):
			error_msg = response_json["error_description"]
		elif response_json and response_json.has("msg"):
			error_msg = response_json["msg"]
		auth_completed.emit(false, error_msg)

func _save_auth_data(data: Dictionary) -> void:
	auth_token = data.get("access_token", "")
	refresh_token = data.get("refresh_token", "")
	expires_at = int(Time.get_unix_time_from_system()) + int(data.get("expires_in", 3600))
	
	if data.has("user"):
		var user = data["user"]
		user_id = user.get("id", "")
		user_email = user.get("email", "")
	
	save_session()

func save_session() -> void:
	var data = {
		"auth_token": auth_token,
		"refresh_token": refresh_token,
		"user_id": user_id,
		"user_email": user_email,
		"expires_at": expires_at
	}
	var file = FileAccess.open(SESSION_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(data))
		file.close()

func load_session() -> void:
	if not FileAccess.file_exists(SESSION_SAVE_PATH):
		session_restored.emit(false)
		return
		
	var file = FileAccess.open(SESSION_SAVE_PATH, FileAccess.READ)
	if file:
		var content = file.get_as_text()
		file.close()
		var data = JSON.parse_string(content)
		if data:
			auth_token = data.get("auth_token", "")
			refresh_token = data.get("refresh_token", "")
			user_id = data.get("user_id", "")
			user_email = data.get("user_email", "")
			expires_at = data.get("expires_at", 0)
			
			if is_logged_in():
				session_restored.emit(true)
			else:
				# TODO: Implement token refresh logic here
				session_restored.emit(false)
		else:
			session_restored.emit(false)

func _clear_session_file() -> void:
	if FileAccess.file_exists(SESSION_SAVE_PATH):
		DirAccess.remove_absolute(SESSION_SAVE_PATH)
