extends Control

@onready var history_list: VBoxContainer = $VBox/Scroll/HistoryList
@onready var stats_label: Label = $VBox/StatsLabel

func _ready() -> void:
	_refresh()

func _refresh() -> void:
	# Clear existing
	for child in history_list.get_children():
		child.queue_free()
	
	var history = GameState.classification_history
	var total_count = history.size()
	
	# Unique types
	var unique_types = {}
	for entry in history:
		var type = entry.get("type", "unknown")
		unique_types[type] = unique_types.get(type, 0) + 1
	
	stats_label.text = "Total Classifications: %d  |  Unique Types: %d" % [total_count, unique_types.size()]
	
	# Display history in reverse (newest first)
	for i in range(history.size() - 1, -1, -1):
		var entry = history[i]
		var row := VBoxContainer.new()
		row.add_theme_constant_override("separation", 2)
		
		var h_box := HBoxContainer.new()
		
		var type_lbl := Label.new()
		type_lbl.text = entry.get("type", "Unknown").capitalize()
		type_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var date_lbl := Label.new()
		date_lbl.text = entry.get("date", "")
		date_lbl.modulate = Color(0.7, 0.7, 0.7)
		
		h_box.add_child(type_lbl)
		h_box.add_child(date_lbl)
		row.add_child(h_box)
		
		if "project" in entry:
			var proj_lbl := Label.new()
			proj_lbl.text = "Project: " + entry["project"]
			proj_lbl.theme_override_font_sizes/font_size = 12
			proj_lbl.modulate = Color(0.6, 0.8, 1.0)
			row.add_child(proj_lbl)
		
		var sep := HSeparator.new()
		row.add_child(sep)
		
		history_list.add_child(row)

func _on_back_pressed() -> void:
	GameState.navigate_requested.emit("progress")
