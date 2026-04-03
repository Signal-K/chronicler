extends Control

@onready var inat_btn: Button = $VBox/Buttons/iNatBtn
@onready var zoon_btn: Button = $VBox/Buttons/ZoonBtn
@onready var status_label: Label = $VBox/StatusLabel

func _ready() -> void:
	CitizenScienceManager.task_ready.connect(_on_task_ready)
	CitizenScienceManager.error_occurred.connect(_on_error)
	_refresh_status()

func _refresh_status() -> void:
	var max_daily: int = min(GameState.hives.size(), 2)
	var remaining: int = max_daily - GameState.daily_classification_count
	status_label.text = "Daily Classifications Left: %d / %d" % [maxi(remaining, 0), max_daily]

func _on_inat_pressed() -> void:
	if not GameState.can_make_classification():
		status_label.text = "Daily classification limit reached!"
		return
	status_label.text = "Fetching iNaturalist observation..."
	CitizenScienceManager.fetch_inaturalist_observation()

func _on_zoon_pressed() -> void:
	if not GameState.can_make_classification():
		status_label.text = "Daily classification limit reached!"
		return
	status_label.text = "Fetching Zooniverse subject..."
	CitizenScienceManager.fetch_zooniverse_subject()

func _on_task_ready(_project: String, _data: Dictionary) -> void:
	GameState.navigate_requested.emit("classification")

func _on_error(msg: String) -> void:
	status_label.text = "Error: " + msg
