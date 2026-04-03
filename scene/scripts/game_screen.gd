extends Control

const PlotScene := preload("res://scenes/plot.tscn")

var selected_tool: String = ""  # "till" | "plant" | "water" | "harvest" | "shovel" | ""
var selected_crop: String = "tomato"

@onready var grid: GridContainer = $VBox/Garden/Grid
@onready var tool_label: Label = $VBox/Toolbar/ToolLabel
@onready var coins_label: Label = $VBox/Header/CoinsLabel
@onready var toast: Label = $Toast
@onready var modulate_node: CanvasModulate = $CanvasModulate
@onready var crop_selector: OptionButton = $VBox/CropSelector

func _ready() -> void:
	GameState.inventory_changed.connect(_refresh_header)
	GameState.inventory_changed.connect(_refresh_crop_selector)
	GameState.water_changed.connect(_refresh_header)
	GameState.weather_changed.connect(_on_weather_changed)
	GameState.bee_hatched.connect(_on_bee_hatched)
	GameState.level_up.connect(_on_level_up)
	GameState.time_changed.connect(_on_time_changed)
	GameState.garden_expanded.connect(_rebuild_grid)
	_rebuild_grid(GameState.unlocked_rows)
	_refresh_header()
	_refresh_crop_selector()
	_on_time_changed(GameState.time_of_day)

func _refresh_crop_selector() -> void:
	var prev := selected_crop
	crop_selector.clear()
	var idx := 0
	var restore_idx := 0
	for crop_id in GameState.seeds:
		var count: int = GameState.seeds.get(crop_id, 0)
		if count > 0:
			var cfg: Dictionary = GameState.CROP_CONFIGS.get(crop_id, {})
			crop_selector.add_item("%s %s (%d)" % [cfg.get("emoji", "🌱"), crop_id.capitalize(), count])
			crop_selector.set_item_metadata(idx, crop_id)
			if crop_id == prev:
				restore_idx = idx
			idx += 1
	if crop_selector.item_count > 0:
		crop_selector.select(restore_idx)
		selected_crop = crop_selector.get_item_metadata(restore_idx)
	crop_selector.visible = crop_selector.item_count > 0

func _rebuild_grid(_rows: int = 0) -> void:
	for child in grid.get_children():
		child.queue_free()
	grid.columns = GameState.PLOTS_PER_ROW
	for i in GameState.plots.size():
		var plot := PlotScene.instantiate()
		plot.plot_index = i
		plot.plot_pressed.connect(on_plot_pressed)
		grid.add_child(plot)

func on_plot_pressed(index: int) -> void:
	match selected_tool:
		"till":    GameState.till_plot(index)
		"plant":   GameState.plant_plot(index, selected_crop)
		"water":
			if GameState.use_water():
				# We can potentially add more logic here for the plot
				_show_toast("💧 Watered!")
			else:
				_show_toast("❌ Out of water!")
		"shovel":  GameState.shovel_plot(index)
		"harvest":
			var result := GameState.harvest_plot(index)
			if not result.is_empty():
				_show_toast("+%d %s  +%d seeds" % [result["crop_count"], result["emoji"], result["seed_count"]])

func _refresh_header() -> void:
	coins_label.text = "🪙 %d  💧 %d/%d" % [GameState.coins, int(GameState.current_water), int(GameState.MAX_WATER)]

func _on_weather_changed(is_raining_val: bool) -> void:
	if is_raining_val:
		_show_toast("🌧️ It's starting to rain!")
	else:
		_show_toast("☀️ The rain stopped!")

func _on_bee_hatched(_hive_id: String) -> void:
	_show_toast("🐝 A new bee hatched!")

func _on_level_up(new_level: int) -> void:
	_show_toast("⬆️ Level up! Now level %d" % new_level)

func _on_time_changed(tod: String) -> void:
	match tod:
		"dawn":  modulate_node.color = Color(0.9, 0.8, 0.7)
		"day":   modulate_node.color = Color(1, 1, 1)
		"dusk":  modulate_node.color = Color(0.8, 0.6, 0.5)
		"night": modulate_node.color = Color(0.3, 0.3, 0.5)

func _show_toast(msg: String) -> void:
	toast.text = msg
	toast.visible = true
	await get_tree().create_timer(2.5).timeout
	toast.visible = false

# ── Toolbar button callbacks ──────────────────────────────────────────────────
func _on_till_pressed() -> void:   _set_tool("till")
func _on_plant_pressed() -> void:  _set_tool("plant")
func _on_water_pressed() -> void:  _set_tool("water")
func _on_harvest_pressed() -> void: _set_tool("harvest")
func _on_shovel_pressed() -> void: _set_tool("shovel")

func _on_crop_selected(index: int) -> void:
	selected_crop = crop_selector.get_item_metadata(index)

func _set_tool(tool: String) -> void:
	selected_tool = tool
	tool_label.text = "Tool: " + tool
