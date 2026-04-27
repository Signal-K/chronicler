extends Control

const HiveCardScene := preload("res://scenes/hive_card.tscn")
const OrdersPanelScene := preload("res://scenes/orders_panel.tscn")

@onready var hive_list: VBoxContainer = $VBox/Scroll/ScrollVBox/HiveList
@onready var orders_container: VBoxContainer = $VBox/Scroll/ScrollVBox/OrdersPanel
@onready var build_btn: Button = $VBox/Scroll/ScrollVBox/BuildBtn

func _ready() -> void:
	GameState.hives_changed.connect(_rebuild_hives)
	GameState.inventory_changed.connect(_update_build_btn)
	GameState.report_tutorial_action("view-hives")
	build_btn.pressed.connect(_on_build_pressed)
	_rebuild_hives()
	_update_build_btn()
	var panel := OrdersPanelScene.instantiate()
	orders_container.add_child(panel)

func _rebuild_hives() -> void:
	for child in hive_list.get_children():
		child.queue_free()
	for hive in GameState.hives:
		var card := HiveCardScene.instantiate()
		card.hive_data = hive
		hive_list.add_child(card)

func _update_build_btn() -> void:
	build_btn.disabled = GameState.coins < GameState.HIVE_COST

func _on_build_pressed() -> void:
	GameState.build_hive()
