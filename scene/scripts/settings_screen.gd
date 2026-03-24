extends Control

@onready var force_day_check: CheckButton = $VBox/ForceDayCheck
@onready var fast_growth_check: CheckButton = $VBox/FastGrowthCheck
@onready var reset_btn: Button = $VBox/ResetBtn

func _ready() -> void:
	force_day_check.button_pressed = GameState.force_daytime
	fast_growth_check.button_pressed = GameState.fast_growth
	force_day_check.toggled.connect(func(v): GameState.set_force_daytime(v))
	fast_growth_check.toggled.connect(func(v): GameState.set_fast_growth(v))
	reset_btn.pressed.connect(func(): GameState.reset_game())
	
	var help_btn = get_node_or_null("VBox/HelpBtn")
	if help_btn:
		help_btn.pressed.connect(func(): GameState.navigate_requested.emit("help"))
