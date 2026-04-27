extends Control

const PlotScene := preload("res://scenes/plot.tscn")

var selected_tool: String = ""
var selected_crop: String = "tomato"
var _toast_timer: Timer

@onready var grid: GridContainer        = $VBox/Garden/Grid
@onready var garden: ScrollContainer   = $VBox/Garden
@onready var tool_label: Label         = $VBox/BottomBar/Toolbar/ToolLabel
@onready var toast: Label              = $Toast
@onready var modulate_node: CanvasModulate = $CanvasModulate
@onready var crop_selector: OptionButton   = $VBox/BottomBar/CropSelector

func _ready() -> void:
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.timeout.connect(_hide_toast)
	add_child(_toast_timer)

	GameState.inventory_changed.connect(_refresh_crop_selector)
	GameState.weather_changed.connect(_on_weather_changed)
	GameState.bee_hatched.connect(_on_bee_hatched)
	GameState.level_up.connect(_on_level_up)
	GameState.time_changed.connect(_on_time_changed)
	GameState.garden_expanded.connect(_rebuild_grid)
	garden.resized.connect(_fit_plots)
	_rebuild_grid(GameState.unlocked_rows)
	_refresh_crop_selector()
	_on_time_changed(GameState.time_of_day)

func _fit_plots() -> void:
	var cols := GameState.PLOTS_PER_ROW
	var rows := ceili(float(GameState.plots.size()) / float(cols))
	if cols == 0 or rows == 0: return
	var cell := minf(garden.size.x / cols, garden.size.y / rows)
	cell = maxf(cell, 80.0)
	for child in grid.get_children():
		child.custom_minimum_size = Vector2(cell, cell)

func _refresh_crop_selector() -> void:
	var prev := selected_crop
	crop_selector.clear()
	var idx := 0
	var restore_idx := 0
	for crop_id in GameState.seeds:
		var count: int = GameState.seeds.get(crop_id, 0)
		var cfg: Dictionary = GameState.CROP_CONFIGS.get(crop_id, {})
		var unlocked: bool = cfg.get("required_level", 1) <= GameState.level
		if count > 0 and unlocked:
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
	call_deferred("_fit_plots")

func on_plot_pressed(index: int) -> void:
	match selected_tool:
		"till":    GameState.till_plot(index)
		"plant":   GameState.plant_plot(index, selected_crop)
		"water":
			if GameState.use_water():
				_show_toast("💧 Watered!")
			else:
				_show_toast("❌ Out of water!")
		"shovel":  GameState.shovel_plot(index)
		"harvest":
			var result := GameState.harvest_plot(index)
			if not result.is_empty():
				_show_toast("+%d %s  +%d seeds" % [result["crop_count"], result["emoji"], result["seed_count"]])

func _on_weather_changed(is_raining_val: bool) -> void:
	if is_raining_val: _show_toast("🌧️ It's starting to rain!")
	else:              _show_toast("☀️ The rain stopped!")

func _on_bee_hatched(_hive_id: String) -> void: _show_toast("🐝 A new bee hatched!")
func _on_level_up(new_level: int) -> void:      _show_toast("⬆️ Level up! Now level %d" % new_level)

func _on_time_changed(tod: String) -> void:
	match tod:
		"dawn":  modulate_node.color = Color(0.9, 0.8, 0.7)
		"day":   modulate_node.color = Color(1, 1, 1)
		"dusk":  modulate_node.color = Color(0.8, 0.6, 0.5)
		"night": modulate_node.color = Color(0.3, 0.3, 0.5)

func _show_toast(msg: String) -> void:
	toast.text = msg
	toast.visible = true
	_toast_timer.start(2.5)

func _hide_toast() -> void:
	toast.visible = false

func _exit_tree() -> void:
	if _toast_timer and is_instance_valid(_toast_timer):
		_toast_timer.stop()

func _on_till_pressed() -> void:    _set_tool("till")
func _on_plant_pressed() -> void:   _set_tool("plant")
func _on_water_pressed() -> void:   _set_tool("water")
func _on_harvest_pressed() -> void: _set_tool("harvest")
func _on_shovel_pressed() -> void:  _set_tool("shovel")

func _on_crop_selected(index: int) -> void:
	selected_crop = crop_selector.get_item_metadata(index)

func _set_tool(t: String) -> void:
	selected_tool = t
	tool_label.text = "Tool: " + t
