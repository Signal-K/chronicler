extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")

@onready var active_map_label: Label = $Root/Header/HeaderMargin/HeaderBody/ActiveMapLabel
@onready var coins_label: Label = $Root/Header/HeaderMargin/HeaderBody/CoinsLabel
@onready var status_label: Label = $Root/Header/HeaderMargin/HeaderBody/StatusLabel

const _ROW_BASE := "Root/ScrollArea/MapList/ListMargin/ListBody/"
@onready var map_name_labels: Array[Label] = [
	get_node(_ROW_BASE + "MapRow1/MapRow1Margin/MapRow1Body/Row1Top/MapNameLabel"),
	get_node(_ROW_BASE + "MapRow2/MapRow2Margin/MapRow2Body/Row2Top/MapNameLabel"),
	get_node(_ROW_BASE + "MapRow3/MapRow3Margin/MapRow3Body/Row3Top/MapNameLabel"),
	get_node(_ROW_BASE + "MapRow4/MapRow4Margin/MapRow4Body/Row4Top/MapNameLabel"),
	get_node(_ROW_BASE + "MapRow5/MapRow5Margin/MapRow5Body/Row5Top/MapNameLabel"),
]
@onready var map_desc_labels: Array[Label] = [
	get_node(_ROW_BASE + "MapRow1/MapRow1Margin/MapRow1Body/MapDescLabel"),
	get_node(_ROW_BASE + "MapRow2/MapRow2Margin/MapRow2Body/MapDescLabel"),
	get_node(_ROW_BASE + "MapRow3/MapRow3Margin/MapRow3Body/MapDescLabel"),
	get_node(_ROW_BASE + "MapRow4/MapRow4Margin/MapRow4Body/MapDescLabel"),
	get_node(_ROW_BASE + "MapRow5/MapRow5Margin/MapRow5Body/MapDescLabel"),
]
@onready var map_state_labels: Array[Label] = [
	get_node(_ROW_BASE + "MapRow1/MapRow1Margin/MapRow1Body/Row1Top/MapStateLabel"),
	get_node(_ROW_BASE + "MapRow2/MapRow2Margin/MapRow2Body/Row2Top/MapStateLabel"),
	get_node(_ROW_BASE + "MapRow3/MapRow3Margin/MapRow3Body/Row3Top/MapStateLabel"),
	get_node(_ROW_BASE + "MapRow4/MapRow4Margin/MapRow4Body/Row4Top/MapStateLabel"),
	get_node(_ROW_BASE + "MapRow5/MapRow5Margin/MapRow5Body/Row5Top/MapStateLabel"),
]
@onready var unlock_buttons: Array[Button] = [
	get_node(_ROW_BASE + "MapRow1/MapRow1Margin/MapRow1Body/MapButtons/UnlockButton"),
	get_node(_ROW_BASE + "MapRow2/MapRow2Margin/MapRow2Body/MapButtons/UnlockButton"),
	get_node(_ROW_BASE + "MapRow3/MapRow3Margin/MapRow3Body/MapButtons/UnlockButton"),
	get_node(_ROW_BASE + "MapRow4/MapRow4Margin/MapRow4Body/MapButtons/UnlockButton"),
	get_node(_ROW_BASE + "MapRow5/MapRow5Margin/MapRow5Body/MapButtons/UnlockButton"),
]
@onready var select_buttons: Array[Button] = [
	get_node(_ROW_BASE + "MapRow1/MapRow1Margin/MapRow1Body/MapButtons/SelectButton"),
	get_node(_ROW_BASE + "MapRow2/MapRow2Margin/MapRow2Body/MapButtons/SelectButton"),
	get_node(_ROW_BASE + "MapRow3/MapRow3Margin/MapRow3Body/MapButtons/SelectButton"),
	get_node(_ROW_BASE + "MapRow4/MapRow4Margin/MapRow4Body/MapButtons/SelectButton"),
	get_node(_ROW_BASE + "MapRow5/MapRow5Margin/MapRow5Body/MapButtons/SelectButton"),
]
@onready var map_rows: Array[PanelContainer] = [
	get_node(_ROW_BASE + "MapRow1") as PanelContainer,
	get_node(_ROW_BASE + "MapRow2") as PanelContainer,
	get_node(_ROW_BASE + "MapRow3") as PanelContainer,
	get_node(_ROW_BASE + "MapRow4") as PanelContainer,
	get_node(_ROW_BASE + "MapRow5") as PanelContainer,
]

var maps: Array[Dictionary] = []

func _ready() -> void:
	_apply_ui_theme()
	maps = GameState.get_map_definitions()
	for i in range(unlock_buttons.size()):
		unlock_buttons[i].pressed.connect(_on_unlock_pressed.bind(i))
		select_buttons[i].pressed.connect(_on_select_pressed.bind(i))
	GameState.resources_changed.connect(_refresh_ui)
	_refresh_ui()


func _apply_ui_theme() -> void:
	# Green background (matches RN expand screen gradient)
	var bg: ColorRect = $Background
	bg.color = UIFwk.FARM_BG

	# Header: dark brown
	UIFwk.style_header_panel($Root/Header)
	var title: Label = $Root/Header/HeaderMargin/HeaderBody/Title
	UIFwk.style_warm_title(title, 22)
	UIFwk.style_amber_text(active_map_label)
	UIFwk.style_accent_gold(coins_label)
	UIFwk.style_amber_muted(status_label)

	# Map cards
	for row in map_rows:
		UIFwk.style_warm_panel(row)
	for label in map_name_labels:
		UIFwk.style_warm_title(label, 15)
	for label in map_desc_labels:
		UIFwk.style_amber_muted(label)
	for label in map_state_labels:
		UIFwk.style_warm_section(label)
	for btn in unlock_buttons:
		UIFwk.style_button(btn, Color("b91c1c"))
		btn.text = "🔓 Unlock"
	for btn in select_buttons:
		UIFwk.style_amber_button(btn)
		btn.text = "✅ Select"


func _on_unlock_pressed(index: int) -> void:
	if index < 0 or index >= maps.size():
		return
	var map_id := str(maps[index].get("id", ""))
	var result: Dictionary = GameState.unlock_map(map_id)
	GameState.save_state()
	status_label.text = str(result.get("message", "Map update complete."))
	_refresh_ui()


func _on_select_pressed(index: int) -> void:
	if index < 0 or index >= maps.size():
		return
	var map_id := str(maps[index].get("id", ""))
	var result: Dictionary = GameState.set_active_map(map_id)
	GameState.save_state()
	status_label.text = str(result.get("message", "Map selected."))
	_refresh_ui()


func _refresh_ui() -> void:
	maps = GameState.get_map_definitions()
	active_map_label.text = "Active Map: %s" % GameState.active_map.capitalize()
	coins_label.text = "🪙 %d" % GameState.coins

	for i in range(map_name_labels.size()):
		if i >= maps.size():
			map_rows[i].visible = false
			continue
		map_rows[i].visible = true
		var map_def := maps[i]
		var map_id := str(map_def.get("id", ""))
		var unlocked := GameState.is_map_unlocked(map_id)
		var active := GameState.active_map == map_id
		var cost := int(map_def.get("unlock_cost", 0))
		map_name_labels[i].text = "%s %s" % [str(map_def.get("icon", "")), str(map_def.get("name", map_id))]
		map_desc_labels[i].text = str(map_def.get("description", ""))
		if active:
			map_state_labels[i].text = "✅ Active"
		elif unlocked:
			map_state_labels[i].text = "Unlocked"
		else:
			map_state_labels[i].text = "🔒 %d coins" % cost

		unlock_buttons[i].visible = not unlocked
		unlock_buttons[i].disabled = GameState.coins < cost
		select_buttons[i].visible = unlocked
		select_buttons[i].disabled = active
