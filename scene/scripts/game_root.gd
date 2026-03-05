extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")

@onready var tabs: TabContainer = $Tabs

func _ready() -> void:
	UIFwk.apply_warm_tab_theme(tabs)
	_apply_tab_titles()


func _apply_tab_titles() -> void:
	var titles := [
		"🌾 Farm",
		"🐝 Hives",
		"📈 Progress",
		"⚙️ Settings",
		"🗺️ Expand",
		"🪐 Planets",
		"📦 Inventory",
	]
	for i in range(min(titles.size(), tabs.get_tab_count())):
		tabs.set_tab_title(i, titles[i])
