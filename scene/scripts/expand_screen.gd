extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var active_map_label: Label = $Root/Summary/SummaryMargin/SummaryBody/ActiveMapLabel
@onready var coins_label: Label = $Root/Summary/SummaryMargin/SummaryBody/CoinsLabel
@onready var status_label: Label = $Root/Summary/SummaryMargin/SummaryBody/StatusLabel

@onready var map_name_labels: Array[Label] = [
	$Root/MapList/MapRow1/MapNameLabel,
	$Root/MapList/MapRow2/MapNameLabel,
	$Root/MapList/MapRow3/MapNameLabel,
	$Root/MapList/MapRow4/MapNameLabel,
	$Root/MapList/MapRow5/MapNameLabel,
]
@onready var map_desc_labels: Array[Label] = [
	$Root/MapList/MapRow1/MapDescLabel,
	$Root/MapList/MapRow2/MapDescLabel,
	$Root/MapList/MapRow3/MapDescLabel,
	$Root/MapList/MapRow4/MapDescLabel,
	$Root/MapList/MapRow5/MapDescLabel,
]
@onready var map_state_labels: Array[Label] = [
	$Root/MapList/MapRow1/MapStateLabel,
	$Root/MapList/MapRow2/MapStateLabel,
	$Root/MapList/MapRow3/MapStateLabel,
	$Root/MapList/MapRow4/MapStateLabel,
	$Root/MapList/MapRow5/MapStateLabel,
]
@onready var unlock_buttons: Array[Button] = [
	$Root/MapList/MapRow1/MapButtons/UnlockButton,
	$Root/MapList/MapRow2/MapButtons/UnlockButton,
	$Root/MapList/MapRow3/MapButtons/UnlockButton,
	$Root/MapList/MapRow4/MapButtons/UnlockButton,
	$Root/MapList/MapRow5/MapButtons/UnlockButton,
]
@onready var select_buttons: Array[Button] = [
	$Root/MapList/MapRow1/MapButtons/SelectButton,
	$Root/MapList/MapRow2/MapButtons/SelectButton,
	$Root/MapList/MapRow3/MapButtons/SelectButton,
	$Root/MapList/MapRow4/MapButtons/SelectButton,
	$Root/MapList/MapRow5/MapButtons/SelectButton,
]

var maps: Array[Dictionary] = []

func _ready() -> void:
	_apply_ui_theme()
	maps = GameState.get_map_definitions()
	for i in range(unlock_buttons.size()):
		unlock_buttons[i].pressed.connect(_on_unlock_pressed.bind(i))
		select_buttons[i].pressed.connect(_on_select_pressed.bind(i))
	_refresh_ui()


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_warm_title($Root/Title, 26)
	UIFwk.style_warm_panel($Root/Summary)
	UIFwk.style_amber_text(coins_label)
	UIFwk.style_amber_muted(status_label)

	for label in map_name_labels:
		UIFwk.style_warm_text(label)
		label.add_theme_font_size_override("font_size", 16)
	for label in map_desc_labels:
		UIFwk.style_amber_muted(label)
	for label in map_state_labels:
		UIFwk.style_amber_text(label)

	for i in range(unlock_buttons.size()):
		UIFwk.style_amber_button(unlock_buttons[i])
		unlock_buttons[i].text = "🔓 Unlock"
	for i in range(select_buttons.size()):
		UIFwk.style_amber_button(select_buttons[i])
		select_buttons[i].text = "✅ Select"


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
	coins_label.text = "Coins: %d" % GameState.coins

	for i in range(map_name_labels.size()):
		if i >= maps.size():
			continue
		var map_def := maps[i]
		var map_id := str(map_def.get("id", ""))
		var unlocked := GameState.is_map_unlocked(map_id)
		var active := GameState.active_map == map_id
		var cost := int(map_def.get("unlock_cost", 0))
		map_name_labels[i].text = "%s %s" % [str(map_def.get("icon", "")), str(map_def.get("name", map_id))]
		map_desc_labels[i].text = str(map_def.get("description", ""))
		if active:
			map_state_labels[i].text = "ACTIVE"
		elif unlocked:
			map_state_labels[i].text = "Unlocked"
		else:
			map_state_labels[i].text = "Locked (%d coins)" % cost

		unlock_buttons[i].visible = not unlocked
		unlock_buttons[i].disabled = GameState.coins < cost
		select_buttons[i].visible = unlocked
		select_buttons[i].disabled = active
