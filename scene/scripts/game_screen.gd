extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
const WATER_INTERVAL_SECONDS := 10.0
# Plots beyond the first 6 are spawned at runtime – see _expand_plot_grid().
const PLOT_SCENE = preload("res://scenes/plot.tscn")
const SHOP_PRICES := {
	"tomato": 10,
	"blueberry": 12,
	"lavender": 15,
	"sunflower": 18,
	"glass_bottle": 20,
}
const HARVEST_COINS := {
	"tomato": 6,
	"blueberry": 8,
	"sunflower": 10,
	"lavender": 12,
}

var selected_tool := "till"
var selected_crop := "tomato"
var plots: Array[Dictionary] = []
var tutorial_steps: Array[Dictionary] = []

@onready var till_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ToolButtons/TillButton
@onready var plant_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ToolButtons/PlantButton
@onready var water_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ToolButtons/WaterButton
@onready var harvest_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ToolButtons/HarvestButton
@onready var crop_row: HBoxContainer = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/SecondRow
@onready var shop_section: HBoxContainer = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ShopRow
@onready var hint_label: Label = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/SecondRow/HintLabel
@onready var crop_selector: OptionButton = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/SecondRow/CropSelector
@onready var status_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/StatusLabel
@onready var level_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/ResourcesRow/LevelLabel
@onready var map_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/MapLabel
@onready var coins_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/ResourcesRow/CoinsLabel
@onready var water_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/ResourcesRow/WaterLabel
@onready var seeds_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/ResourcesRow/SeedsLabel
@onready var buy_tomato_seed_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ShopRow/BuyTomatoSeedButton
@onready var buy_blueberry_seed_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ShopRow/BuyBlueberrySeedButton
@onready var buy_lavender_seed_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ShopRow/BuyLavenderSeedButton
@onready var buy_sunflower_seed_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ShopRow/BuySunflowerSeedButton
@onready var buy_glass_bottle_button: Button = $RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/ShopRow/BuyGlassBottleButton
@onready var tutorial_overlay: Control = $TutorialOverlay
@onready var tutorial_title_label: Label = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialTitleLabel
@onready var tutorial_message_label: Label = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialMessageLabel
@onready var tutorial_hint_label: Label = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialHintLabel
@onready var skip_tutorial_button: Button = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialButtons/SkipTutorialButton
@onready var next_tutorial_button: Button = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialButtons/NextTutorialButton

var plot_nodes: Array[Button] = []
@onready var _plot_grid: GridContainer = $RootLayout/GardenArea/GardenPanel/GardenMargin/Grid
@onready var _water_regen_timer: Timer = $WaterRegenTimer

@onready var crop_textures := {
	"wheat_seed": preload("res://assets/sprites/crops/wheat_seed.png"),
	"wheat_sprout": preload("res://assets/sprites/crops/wheat_sprout.png"),
	"wheat_mid": preload("res://assets/sprites/crops/wheat_mid.png"),
	"wheat_full": preload("res://assets/sprites/crops/wheat_full.png"),
	"tomato_full": preload("res://assets/sprites/crops/tomato_full.png"),
	"blueberry_full": preload("res://assets/sprites/crops/blueberry_full.png"),
	"lavender_full": preload("res://assets/sprites/crops/lavender_full.png"),
	"sunflower_full": preload("res://assets/sprites/crops/sunflower_full.png"),
}

func _ready() -> void:
	_apply_ui_theme()
	plots = GameState.snapshot_farm_plots()
	if plots.is_empty():
		_initialize_plots()
		_persist_state()

	selected_crop = GameState.farm_selected_crop
	_sync_crop_selector()

	_build_plot_nodes()
	for i in range(plot_nodes.size()):
		plot_nodes[i].pressed.connect(_on_plot_pressed.bind(i))

	till_button.pressed.connect(_on_tool_selected.bind("till"))
	plant_button.pressed.connect(_on_tool_selected.bind("plant"))
	water_button.pressed.connect(_on_tool_selected.bind("water"))
	harvest_button.pressed.connect(_on_tool_selected.bind("harvest"))
	buy_tomato_seed_button.pressed.connect(_on_buy_item.bind("tomato"))
	buy_blueberry_seed_button.pressed.connect(_on_buy_item.bind("blueberry"))
	buy_lavender_seed_button.pressed.connect(_on_buy_item.bind("lavender"))
	buy_sunflower_seed_button.pressed.connect(_on_buy_item.bind("sunflower"))
	buy_glass_bottle_button.pressed.connect(_on_buy_item.bind("glass_bottle"))
	crop_selector.item_selected.connect(_on_crop_selected)
	skip_tutorial_button.pressed.connect(_on_skip_tutorial)
	next_tutorial_button.pressed.connect(_on_next_tutorial)

	_update_tool_buttons()
	_refresh_all_plots()
	_refresh_resource_labels()
	_setup_tutorial()
	GameState.resources_changed.connect(_refresh_resource_labels)
	GameState.bee_hatched.connect(_on_bee_hatched)


func _apply_ui_theme() -> void:
	# Green farm background (matches RN #4ade80)
	UIFwk.apply_farm_bg(self)

	# Header: dark brown panel with badge-style resource labels
	UIFwk.style_header_panel($RootLayout/TopBar)
	var title_label: Label = $RootLayout/TopBar/TopBarMargin/TopBarRow/Title
	UIFwk.style_warm_title(title_label, 17)

	UIFwk.style_accent_gold(level_label)
	UIFwk.style_accent_gold(coins_label)
	UIFwk.style_accent_blue(water_label)
	UIFwk.style_accent_green(seeds_label)

	# Garden: dark-bordered panel on green BG
	var garden_panel: PanelContainer = $RootLayout/GardenArea/GardenPanel
	var garden_style := StyleBoxFlat.new()
	garden_style.bg_color = Color(0.1, 0.52, 0.18, 0.5)
	garden_style.border_color = Color(0.08, 0.39, 0.08, 0.8)
	garden_style.border_width_left = 4
	garden_style.border_width_top = 4
	garden_style.border_width_right = 4
	garden_style.border_width_bottom = 4
	garden_style.corner_radius_top_left = 12
	garden_style.corner_radius_top_right = 12
	garden_style.corner_radius_bottom_right = 12
	garden_style.corner_radius_bottom_left = 12
	garden_panel.add_theme_stylebox_override("panel", garden_style)

	# Toolbar: dark brown #92400e (matches RN SimpleToolbar)
	UIFwk.style_toolbar_panel($RootLayout/ToolbarPanel)

	# Tool buttons (matches RN toolbarConfig colors)
	UIFwk.style_button(till_button, Color("8b4513"))
	UIFwk.style_button(plant_button, Color("166534"))
	UIFwk.style_button(water_button, Color("1d4ed8"))
	UIFwk.style_button(harvest_button, Color("ca8a04"), Color("1c1917"))

	# Crop selector row
	$RootLayout/ToolbarPanel/ToolbarMargin/ToolbarContent/SecondRow/CropLabel.add_theme_color_override("font_color", UIFwk.TITLE_COLOR)

	# Shop buttons (compact emoji labels)
	UIFwk.style_button(buy_tomato_seed_button, Color("b91c1c"))
	UIFwk.style_button(buy_blueberry_seed_button, Color("1e3a8a"))
	UIFwk.style_button(buy_lavender_seed_button, Color("6d28d9"))
	UIFwk.style_button(buy_sunflower_seed_button, Color("ca8a04"), Color("1c1917"))
	UIFwk.style_button(buy_glass_bottle_button, Color("0f766e"))

	# Tutorial card
	UIFwk.style_amber_panel($TutorialOverlay/TutorialCard)
	UIFwk.style_button(skip_tutorial_button, Color("7c2d12"))
	UIFwk.style_button(next_tutorial_button, Color("0f766e"))


func _build_plot_nodes() -> void:
	plot_nodes.clear()
	for child in _plot_grid.get_children():
		if child is Button:
			plot_nodes.append(child)
	var target_count := GameState.get_plot_count()
	while plot_nodes.size() < target_count:
		var extra: Button = PLOT_SCENE.instantiate()
		_plot_grid.add_child(extra)
		plot_nodes.append(extra)


func _initialize_plots() -> void:
	plots.clear()
	var target_count := GameState.get_plot_count()
	for _i in range(target_count):
		plots.append({
			"state": "empty",
			"growth_stage": 0,
			"crop_type": "",
			"needs_water": false,
			"last_action_at": 0.0,
		})


func _on_tool_selected(tool: String) -> void:
	selected_tool = tool
	_update_tool_buttons()
	_on_tutorial_tool_selected(tool)


func _on_crop_selected(index: int) -> void:
	selected_crop = crop_selector.get_item_text(index).to_lower()
	GameState.set_farm_selected_crop(selected_crop)
	GameState.save_state()
	_refresh_resource_labels()


func _on_plot_pressed(index: int) -> void:
	var plot := plots[index]
	var now := Time.get_unix_time_from_system()

	if selected_tool == "till":
		if plot["state"] == "empty":
			plot["state"] = "tilled"
			_on_tutorial_action("till-plot")
	elif selected_tool == "plant":
		if plot["state"] == "tilled":
			if not GameState.consume_seed(selected_crop, 1):
				_refresh_resource_labels()
				return
			plot["state"] = "planted"
			plot["growth_stage"] = 1
			plot["crop_type"] = selected_crop
			plot["needs_water"] = false
			plot["last_action_at"] = now
			if not GameState.tutorial_completed and str(_current_tutorial_step().get("action", "")) == "plant-seed":
				plot["needs_water"] = true
			_on_tutorial_action("plant-seed")
	elif selected_tool == "water":
		if (plot["state"] == "planted" or plot["state"] == "growing") and plot["needs_water"] and plot["growth_stage"] < 5:
			if not GameState.consume_water(1):
				_refresh_resource_labels()
				return
			plot["growth_stage"] += 1
			plot["needs_water"] = false
			plot["last_action_at"] = now
			plot["state"] = "growing"
			if not GameState.tutorial_completed and str(_current_tutorial_step().get("action", "")) == "water-plant":
				plot["growth_stage"] = 5
				plot["needs_water"] = false
			_on_tutorial_action("water-plant")
			_flash_plot(index, Color("93c5fd"))  # Blue flash on water
	elif selected_tool == "harvest":
		if plot["growth_stage"] >= 5:
			var crop_id := str(plot["crop_type"])
			var coins_earned := int(HARVEST_COINS.get(crop_id, 8))
			GameState.add_harvest(crop_id, 3)
			GameState.add_seed(crop_id, 2)
			GameState.add_coins(coins_earned)
			var xp_result := GameState.award_harvest_xp(crop_id)
			var xp_gained := int(xp_result.get("gained", 1))
			# Lavender and sunflower attract bees — award pollination XP.
			if crop_id == "lavender" or crop_id == "sunflower":
				var pol_result := GameState.award_pollination_xp()
				xp_gained += int(pol_result.get("gained", 0))
			plot["state"] = "empty"
			plot["growth_stage"] = 0
			plot["crop_type"] = ""
			plot["needs_water"] = false
			plot["last_action_at"] = 0.0
			_on_tutorial_action("harvest-crop")
			_flash_plot(index, Color("fde047"))  # Gold flash on harvest
			status_label.visible = true
			status_label.text = "🌾 +%dc  +%dXP" % [coins_earned, xp_gained]
		elif plot["state"] != "empty":
			var crop_return := str(plot["crop_type"])
			if crop_return != "":
				GameState.add_seed(crop_return, 1)
			plot["state"] = "empty"
			plot["growth_stage"] = 0
			plot["crop_type"] = ""
			plot["needs_water"] = false
			plot["last_action_at"] = 0.0

	plots[index] = plot
	_refresh_plot(index)
	_persist_state()


func _check_plot_grid_expansion() -> void:
	var target_count := GameState.get_plot_count()
	if plot_nodes.size() >= target_count:
		return
	var prev_count := plot_nodes.size()
	while plot_nodes.size() < target_count:
		var extra: Button = PLOT_SCENE.instantiate()
		_plot_grid.add_child(extra)
		plot_nodes.append(extra)
	# Grow local plots array to match — new slots start empty.
	while plots.size() < target_count:
		plots.append({
			"state": "empty",
			"growth_stage": 0,
			"crop_type": "",
			"needs_water": false,
			"last_action_at": 0.0,
		})
	for i in range(prev_count, plot_nodes.size()):
		plot_nodes[i].pressed.connect(_on_plot_pressed.bind(i))
	_refresh_all_plots()


func _on_growth_tick() -> void:
	_check_plot_grid_expansion()
	var now := Time.get_unix_time_from_system()
	var did_change := false
	for i in range(plots.size()):
		var plot := plots[i]
		if plot["state"] != "planted" and plot["state"] != "growing":
			continue
		if int(plot["growth_stage"]) >= 5:
			continue
		if bool(plot["needs_water"]):
			continue
		if float(plot["last_action_at"]) <= 0.0:
			continue

		var growth_rate: float = max(0.1, GameState.get_active_map_growth_rate())
		var interval_seconds: float = WATER_INTERVAL_SECONDS / growth_rate
		if now - float(plot["last_action_at"]) >= interval_seconds:
			plot["needs_water"] = true
			plot["state"] = "growing"
			plots[i] = plot
			_refresh_plot(i)
			did_change = true

	if did_change:
		_persist_state()
	else:
		_refresh_resource_labels()


func _update_tool_buttons() -> void:
	till_button.button_pressed = selected_tool == "till"
	plant_button.button_pressed = selected_tool == "plant"
	water_button.button_pressed = selected_tool == "water"
	harvest_button.button_pressed = selected_tool == "harvest"


func _refresh_all_plots() -> void:
	for i in range(plots.size()):
		_refresh_plot(i)


func _refresh_plot(index: int) -> void:
	if index < plot_nodes.size():
		plot_nodes[index].set_plot_display(plots[index], crop_textures)


func _sync_crop_selector() -> void:
	for i in range(crop_selector.item_count):
		if crop_selector.get_item_text(i).to_lower() == selected_crop:
			crop_selector.select(i)
			return


func _persist_state() -> void:
	GameState.set_farm_plots(plots)
	GameState.set_farm_selected_crop(selected_crop)
	GameState.save_state()
	_refresh_resource_labels()


func _refresh_resource_labels() -> void:
	_check_plot_grid_expansion()
	var progress_info: Dictionary = GameState.get_progress_info()
	level_label.text = "Lv.%d" % int(progress_info.get("level", 1))
	coins_label.text = "🪙%d" % GameState.coins
	water_label.text = "💧%d/%d" % [GameState.water, GameState.max_water]
	seeds_label.text = "🌱%d %s" % [GameState.get_seed_count(selected_crop), selected_crop.capitalize()]
	# Show active map when it's not the default.
	if GameState.active_map != "default":
		var map_icon := ""
		for map_def in GameState.get_map_definitions():
			if str(map_def.get("id", "")) == GameState.active_map:
				map_icon = "%s %s" % [str(map_def.get("icon", "")), str(map_def.get("name", ""))]
				break
		map_label.text = map_icon
		map_label.visible = not map_icon.is_empty()
	else:
		map_label.visible = false
	_update_shop_button_states()


func _on_bee_hatched(hive_name: String) -> void:
	status_label.visible = true
	status_label.text = "🐝 A bee hatched in %s!" % hive_name
	GameState.save_state()


func _update_shop_button_states() -> void:
	buy_tomato_seed_button.disabled = GameState.coins < int(SHOP_PRICES["tomato"])
	buy_blueberry_seed_button.disabled = GameState.coins < int(SHOP_PRICES["blueberry"])
	buy_lavender_seed_button.disabled = GameState.coins < int(SHOP_PRICES["lavender"])
	buy_sunflower_seed_button.disabled = GameState.coins < int(SHOP_PRICES["sunflower"])
	buy_glass_bottle_button.disabled = GameState.coins < int(SHOP_PRICES["glass_bottle"])


func _on_buy_item(item_id: String) -> void:
	var price := int(SHOP_PRICES.get(item_id, 0))
	if price <= 0:
		return
	if GameState.coins < price:
		_refresh_resource_labels()
		return
	GameState.add_coins(-price)
	if item_id == "glass_bottle":
		GameState.add_glass_bottle(1)
	else:
		GameState.add_seed(item_id, 1)
	GameState.save_state()
	_refresh_resource_labels()


func _on_water_regen_tick() -> void:
	var amount := max(1, roundi(GameState.growth_speed_multiplier))
	GameState.refill_water(amount)
	# Adjust timer interval so faster growth = faster water regen.
	_water_regen_timer.wait_time = max(0.5, 2.0 / GameState.growth_speed_multiplier)
	GameState.save_state()


func _setup_tutorial() -> void:
	_ensure_tutorial_resources()
	tutorial_steps = [
		{"title": "Quick Start", "message": "You only need four actions to run the farm loop.", "hint": "Press Next to begin.", "type": "info"},
		{"title": "1. Till", "message": "Tap any empty plot to till it.", "hint": "Use the Till tool, then tap a plot.", "type": "require_action", "action": "till-plot"},
		{"title": "2. Plant", "message": "Tap the tilled plot to plant your seed.", "hint": "Use the Plant tool.", "type": "require_action", "action": "plant-seed"},
		{"title": "3. Water", "message": "Water your planted crop once.", "hint": "Use the Water tool.", "type": "require_action", "action": "water-plant"},
		{"title": "4. Harvest", "message": "Now harvest the ripe crop.", "hint": "Use the Harvest tool and tap that plot.", "type": "require_action", "action": "harvest-crop"},
		{"title": "Farm Tutorial Complete", "message": "Great start. Continue the guided flow in Hives.", "hint": "You can always reset tutorials in Settings.", "type": "complete"},
	]
	_refresh_tutorial_ui()


func _current_tutorial_step() -> Dictionary:
	if GameState.tutorial_step_index < 0 or GameState.tutorial_step_index >= tutorial_steps.size():
		return {}
	return tutorial_steps[GameState.tutorial_step_index]


func _refresh_tutorial_ui() -> void:
	if GameState.tutorial_completed:
		tutorial_overlay.visible = false
		_apply_tutorial_simplified_layout(false, {})
		return
	if tutorial_steps.is_empty() or GameState.tutorial_step_index >= tutorial_steps.size():
		GameState.complete_tutorial()
		GameState.save_state()
		tutorial_overlay.visible = false
		_apply_tutorial_simplified_layout(false, {})
		return

	var step := _current_tutorial_step()
	_apply_tutorial_simplified_layout(true, step)
	tutorial_overlay.visible = true
	var step_number := GameState.tutorial_step_index + 1
	tutorial_title_label.text = "Farm Tutorial %d/%d: %s" % [step_number, tutorial_steps.size(), str(step.get("title", "Tutorial"))]
	tutorial_message_label.text = str(step.get("message", ""))
	tutorial_hint_label.text = str(step.get("hint", ""))
	var step_type := str(step.get("type", "info"))
	next_tutorial_button.disabled = step_type == "require_tool" or step_type == "require_action"


func _advance_tutorial_step() -> void:
	GameState.set_tutorial_step(GameState.tutorial_step_index + 1)
	if GameState.tutorial_step_index >= tutorial_steps.size():
		GameState.complete_tutorial()
	GameState.save_state()
	_refresh_tutorial_ui()


func _on_next_tutorial() -> void:
	if GameState.tutorial_completed:
		return
	var step := _current_tutorial_step()
	var step_type := str(step.get("type", "info"))
	if step_type == "require_tool" or step_type == "require_action":
		return
	_advance_tutorial_step()


func _on_skip_tutorial() -> void:
	GameState.complete_tutorial()
	GameState.save_state()
	_refresh_tutorial_ui()


func _on_tutorial_tool_selected(tool: String) -> void:
	if GameState.tutorial_completed:
		return
	var step := _current_tutorial_step()
	if str(step.get("type", "")) != "require_tool":
		return
	if str(step.get("tool", "")) == tool:
		_advance_tutorial_step()


func _on_tutorial_action(action_id: String) -> void:
	if GameState.tutorial_completed:
		return
	var step := _current_tutorial_step()
	if str(step.get("type", "")) != "require_action":
		return
	if str(step.get("action", "")) == action_id:
		_advance_tutorial_step()


func _ensure_tutorial_resources() -> void:
	if GameState.tutorial_completed:
		return
	var changed := false
	if GameState.get_seed_count("tomato") < 3:
		GameState.add_seed("tomato", 3 - GameState.get_seed_count("tomato"))
		changed = true
	if GameState.water < 5:
		GameState.water = 5
		changed = true
	if changed:
		GameState.save_state()


func _apply_tutorial_simplified_layout(is_active: bool, step: Dictionary) -> void:
	crop_row.visible = not is_active
	shop_section.visible = not is_active
	if is_active:
		selected_crop = "tomato"
		_sync_crop_selector()
		var expected_tool := _expected_tool_for_step(step)
		_apply_tool_gating(expected_tool)
		if expected_tool != "" and selected_tool != expected_tool:
			selected_tool = expected_tool
			_update_tool_buttons()
	else:
		_apply_tool_gating("")


func _expected_tool_for_step(step: Dictionary) -> String:
	if str(step.get("type", "")) != "require_action":
		return ""
	match str(step.get("action", "")):
		"till-plot": return "till"
		"plant-seed": return "plant"
		"water-plant": return "water"
		"harvest-crop": return "harvest"
		_: return ""


func _apply_tool_gating(only_tool: String) -> void:
	if only_tool == "":
		till_button.disabled = false
		plant_button.disabled = false
		water_button.disabled = false
		harvest_button.disabled = false
		return
	till_button.disabled = only_tool != "till"
	plant_button.disabled = only_tool != "plant"
	water_button.disabled = only_tool != "water"
	harvest_button.disabled = only_tool != "harvest"


func _flash_plot(index: int, flash_color: Color) -> void:
	if index >= plot_nodes.size():
		return
	var node := plot_nodes[index]
	var tween := create_tween()
	tween.tween_property(node, "modulate", flash_color, 0.08)
	tween.tween_property(node, "modulate", Color.WHITE, 0.25)
