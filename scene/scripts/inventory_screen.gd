extends Control

@onready var seeds_list: VBoxContainer = $Scroll/VBox/SeedsSection/List
@onready var harvested_list: VBoxContainer = $Scroll/VBox/HarvestedSection/List
@onready var honey_list: VBoxContainer = $Scroll/VBox/HoneySection/List
@onready var coins_label: Label = $Scroll/VBox/CoinsLabel

func _ready() -> void:
	GameState.inventory_changed.connect(_refresh)
	_refresh()

func _refresh() -> void:
	coins_label.text = "🪙 Coins: %d" % GameState.coins
	_fill_list(seeds_list, GameState.seeds, "🌱")
	_fill_list(harvested_list, GameState.harvested, "🌿")
	_fill_honey_list()

func _fill_list(container: VBoxContainer, data: Dictionary, prefix: String) -> void:
	for child in container.get_children():
		child.queue_free()
	for key in data:
		var lbl := Label.new()
		lbl.text = "%s %s: %d" % [prefix, key.capitalize(), data[key]]
		container.add_child(lbl)

func _fill_honey_list() -> void:
	for child in honey_list.get_children():
		child.queue_free()
	for entry in GameState.bottled_honey:
		var lbl := Label.new()
		lbl.text = "🍯 %s honey x%d" % [entry["type"].capitalize(), entry["amount"]]
		honey_list.add_child(lbl)
	var lbl := Label.new()
	lbl.text = "🫙 Glass bottles: %d" % GameState.glass_bottles
	honey_list.add_child(lbl)
