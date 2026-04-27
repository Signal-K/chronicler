extends Control

@onready var email_input: LineEdit = $VBox/EmailInput
@onready var password_input: LineEdit = $VBox/PasswordInput
@onready var status_label: Label = $VBox/StatusLabel
@onready var sign_in_btn: Button = $VBox/HBox/SignInBtn
@onready var sign_up_btn: Button = $VBox/HBox/SignUpBtn
@onready var sign_out_btn: Button = $VBox/SignOutBtn
@onready var sync_vbox: VBoxContainer = $VBox/SyncVBox
@onready var upload_btn: Button = $VBox/SyncVBox/UploadBtn
@onready var download_btn: Button = $VBox/SyncVBox/DownloadBtn

func _ready() -> void:
	SupabaseManager.auth_completed.connect(_on_auth_completed)
	SupabaseManager.save_synced.connect(_on_save_synced)
	SupabaseManager.save_downloaded.connect(_on_save_downloaded)
	
	sign_in_btn.pressed.connect(_on_sign_in_pressed)
	sign_up_btn.pressed.connect(_on_sign_up_pressed)
	sign_out_btn.pressed.connect(_on_sign_out_pressed)
	upload_btn.pressed.connect(_on_upload_pressed)
	download_btn.pressed.connect(_on_download_pressed)
	
	_update_ui()

func _update_ui() -> void:
	var logged_in = SupabaseManager.is_logged_in()
	$VBox/HBox.visible = not logged_in
	email_input.visible = not logged_in
	password_input.visible = not logged_in
	sign_out_btn.visible = logged_in
	sync_vbox.visible = logged_in
	
	if logged_in:
		status_label.text = "Logged in as: " + SupabaseManager.user_email
	else:
		status_label.text = "Not logged in"

func _on_sign_in_pressed() -> void:
	var email = email_input.text
	var password = password_input.text
	if email.is_empty() or password.is_empty():
		status_label.text = "Enter email and password"
		return
	status_label.text = "Signing in..."
	SupabaseManager.sign_in(email, password)

func _on_sign_up_pressed() -> void:
	var email = email_input.text
	var password = password_input.text
	if email.is_empty() or password.is_empty():
		status_label.text = "Enter email and password"
		return
	status_label.text = "Signing up..."
	SupabaseManager.sign_up(email, password)

func _on_sign_out_pressed() -> void:
	SupabaseManager.sign_out()
	_update_ui()

func _on_auth_completed(success: bool, error_message: String) -> void:
	if success:
		status_label.text = "Auth success!"
		_update_ui()
	else:
		status_label.text = "Auth error: " + error_message

func _on_upload_pressed() -> void:
	status_label.text = "Uploading save..."
	var data = SaveManager.get_save_data(GameState)
	SupabaseManager.upload_save(data)

func _on_save_synced(success: bool, error_message: String) -> void:
	if success:
		status_label.text = "Save uploaded successfully!"
	else:
		status_label.text = "Upload error: " + error_message

func _on_download_pressed() -> void:
	status_label.text = "Downloading save..."
	SupabaseManager.download_save()

func _on_save_downloaded(success: bool, data: Dictionary, error_message: String) -> void:
	if success:
		SaveManager.load_from_data(GameState, data)
		status_label.text = "Save downloaded and applied!"
		# Signal other screens to refresh
		GameState.inventory_changed.emit()
		GameState.hives_changed.emit()
		GameState.plot_changed.emit(-1) # Special value to refresh all
	else:
		status_label.text = "Download error: " + error_message
