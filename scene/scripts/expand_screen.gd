extends Control

@onready var info_label: Label = $VBox/InfoLabel
@onready var expand_btn: Button = $VBox/ExpandBtn
@onready var coins_label: Label = $VBox/CoinsLabel

func _ready() -> void:
	GameState.inventory_changed.connect(_refresh)
	GameState.garden_expanded.connect(func(_r): _refresh())
	expand_btn.pressed.connect(_on_expand_pressed)
	_refresh()

func _refresh() -> void:
	coins_label.text = "🪙 %d" % GameState.coins
	var next_row := GameState.unlocked_rows + 1
	var cost := GameState.expansion_cost(next_row)
	if cost < 0:
		info_label.text = "Garden fully expanded!"
		expand_btn.visible = false
	else:
		info_label.text = "Unlock row %d" % next_row
		expand_btn.text = "Expand (%d🪙)" % cost
		expand_btn.visible = true
		expand_btn.disabled = GameState.coins < cost

func _on_expand_pressed() -> void:
	GameState.purchase_expansion()
