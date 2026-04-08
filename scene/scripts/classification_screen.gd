extends Control

@onready var texture_rect: TextureRect = $VBox/ImageContainer/TextureRect
@onready var project_label: Label = $VBox/ProjectLabel
@onready var button_container: VBoxContainer = $VBox/Buttons
@onready var reward_label: Label = $VBox/RewardLabel

var current_task: Dictionary
var _return_timer: Timer

func _ready() -> void:
	_return_timer = Timer.new()
	_return_timer.one_shot = true
	_return_timer.timeout.connect(_return_to_discover)
	add_child(_return_timer)

	current_task = CitizenScienceManager.current_task
	_display_task()

func _display_task() -> void:
	if current_task.is_empty():
		GameState.navigate_requested.emit("discover")
		return

	project_label.text = "Project: " + current_task["project"]
	texture_rect.texture = current_task["image_texture"]
	
	# Clear existing buttons
	for child in button_container.get_children():
		child.queue_free()
	
	# Add buttons for options
	for option in current_task["options"]:
		var btn := Button.new()
		btn.text = option
		btn.pressed.connect(_on_option_selected.bind(option))
		button_container.add_child(btn)

func _on_option_selected(option: String) -> void:
	if _return_timer != null and not _return_timer.is_stopped():
		return

	var success = GameState.record_classification(
		option, 
		current_task["project"], 
		current_task["id"], 
		current_task["image_url"]
	)
	
		if success:
			reward_label.text = "Success! +10 XP rewarded."
			if current_task["project"] == "Zooniverse":
				reward_label.text += " +5 Honey bonus!"
			elif current_task["project"] == "iNaturalist":
				reward_label.text += " +1 Seed bonus!"
			
			# Feedback for iNaturalist if correct_answer is known
			if "correct_answer" in current_task:
				reward_label.text += "\nReal identification: " + current_task["correct_answer"]

	_return_timer.start(3.0)

func _return_to_discover() -> void:
	GameState.navigate_requested.emit("discover")

func _on_back_pressed() -> void:
	GameState.navigate_requested.emit("discover")

func _exit_tree() -> void:
	if _return_timer and is_instance_valid(_return_timer):
		_return_timer.stop()
