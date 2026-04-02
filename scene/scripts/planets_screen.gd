extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")

@onready var discovered_count_label: Label = $Root/Summary/SummaryMargin/SummaryBody/DiscoveredCountLabel
@onready var classifications_label: Label = $Root/Summary/SummaryMargin/SummaryBody/ClassificationsLabel
@onready var level_label: Label = $Root/Summary/SummaryMargin/SummaryBody/LevelLabel
@onready var status_label: Label = $Root/Summary/SummaryMargin/SummaryBody/StatusLabel
@onready var discover_button: Button = $Root/Summary/SummaryMargin/SummaryBody/DiscoverButton
@onready var planet_list: VBoxContainer = $Root/CatalogScroll/PlanetList

func _ready() -> void:
	_apply_ui_theme()
	discover_button.pressed.connect(_on_discover_pressed)
	GameState.resources_changed.connect(_refresh_ui)
	_refresh_ui()


const PLANET_TYPE_COLORS: Dictionary = {
	"Home World":     Color("4A90E2"),
	"Forest World":   Color("27AE60"),
	"Ocean World":    Color("1A6B8A"),
	"Desert World":   Color("C0392B"),
	"Ice World":      Color("85C1E9"),
	"Volcanic World": Color("E67E22"),
}
const PLANET_TYPE_ICONS: Dictionary = {
	"Home World":     "🌍",
	"Forest World":   "🌲",
	"Ocean World":    "🌊",
	"Desert World":   "🏜️",
	"Ice World":      "❄️",
	"Volcanic World": "🌋",
}


func _apply_ui_theme() -> void:
	# Dark navy background (matches RN #0A0E1A)
	var bg: ColorRect = get_node_or_null("Background")
	if bg:
		bg.color = Color("0A0E1A")

	# Title bar
	var title_panel := get_node_or_null("Root/Summary")
	if title_panel is PanelContainer:
		var style := StyleBoxFlat.new()
		style.bg_color = Color(0.04, 0.06, 0.14, 1.0)
		style.border_color = Color("4A90E2", 0.4)
		style.border_width_bottom = 1
		(title_panel as PanelContainer).add_theme_stylebox_override("panel", style)

	$Root/Title.add_theme_color_override("font_color", Color("ffffff"))
	$Root/Title.add_theme_font_size_override("font_size", 22)
	discovered_count_label.add_theme_color_override("font_color", Color("4A90E2"))
	classifications_label.add_theme_color_override("font_color", Color("aaaacc"))
	level_label.add_theme_color_override("font_color", Color("ccccee"))
	status_label.add_theme_color_override("font_color", Color("88aacc"))

	UIFwk.style_button(discover_button, Color("4A90E2"), Color("ffffff"))
	discover_button.text = "🔭 Discover New Planet"


func _on_discover_pressed() -> void:
	var result: Dictionary = GameState.discover_planet()
	GameState.save_state()
	status_label.text = str(result.get("message", "Discovery complete."))
	_refresh_ui()


var _last_planet_count := -1

func _refresh_ui() -> void:
	var planets := GameState.get_planet_catalog()
	discovered_count_label.text = "Discovered Worlds: %d" % max(0, planets.size() - 1)
	classifications_label.text = "Classifications: %d" % GameState.classifications_completed
	level_label.text = "Level: %d" % int(GameState.get_progress_info().get("level", 1))
	if planets.size() != _last_planet_count:
		_last_planet_count = planets.size()
		_rebuild_planet_list(planets)


func _rebuild_planet_list(planets: Array[Dictionary]) -> void:
	for child in planet_list.get_children():
		child.queue_free()

	for planet in planets:
		planet_list.add_child(_make_planet_card(planet))


func _make_planet_card(planet: Dictionary) -> PanelContainer:
	var planet_type: String = str(planet.get("type", "Unknown World"))
	var is_earth: bool = int(planet.get("id", -1)) == 0
	var has_life: bool = bool(planet.get("has_life", false))

	var type_color: Color = PLANET_TYPE_COLORS.get(planet_type, Color("4A90E2"))
	var type_icon: String = PLANET_TYPE_ICONS.get(planet_type, "🪐")

	# Card panel
	var card := PanelContainer.new()
	var card_style := StyleBoxFlat.new()
	card_style.bg_color = Color(type_color.r, type_color.g, type_color.b, 0.12)
	card_style.border_color = Color(type_color.r, type_color.g, type_color.b, is_earth ? 0.6 : 0.35)
	card_style.border_width_left = 1 if not is_earth else 2
	card_style.border_width_top = 1 if not is_earth else 2
	card_style.border_width_right = 1 if not is_earth else 2
	card_style.border_width_bottom = 1 if not is_earth else 2
	card_style.corner_radius_top_left = 12
	card_style.corner_radius_top_right = 12
	card_style.corner_radius_bottom_right = 12
	card_style.corner_radius_bottom_left = 12
	card.add_theme_stylebox_override("panel", card_style)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 16)
	margin.add_theme_constant_override("margin_top", 14)
	margin.add_theme_constant_override("margin_right", 16)
	margin.add_theme_constant_override("margin_bottom", 14)
	card.add_child(margin)

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 14)
	margin.add_child(row)

	# Planet icon circle
	var icon_container := PanelContainer.new()
	icon_container.custom_minimum_size = Vector2(64, 64)
	var icon_style := StyleBoxFlat.new()
	icon_style.bg_color = Color(type_color.r, type_color.g, type_color.b, 0.3)
	icon_style.corner_radius_top_left = 32
	icon_style.corner_radius_top_right = 32
	icon_style.corner_radius_bottom_right = 32
	icon_style.corner_radius_bottom_left = 32
	icon_container.add_theme_stylebox_override("panel", icon_style)
	var icon_margin := MarginContainer.new()
	icon_container.add_child(icon_margin)
	var icon_label := Label.new()
	icon_label.text = type_icon
	icon_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	icon_label.add_theme_font_size_override("font_size", 28)
	icon_margin.add_child(icon_label)
	row.add_child(icon_container)

	# Info column
	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 6)
	row.add_child(info)

	# Name row
	var name_row := HBoxContainer.new()
	name_row.add_theme_constant_override("separation", 6)
	info.add_child(name_row)

	var name_lbl := Label.new()
	name_lbl.text = str(planet.get("name", "Unknown"))
	name_lbl.add_theme_color_override("font_color", Color("ffffff"))
	name_lbl.add_theme_font_size_override("font_size", 16)
	name_row.add_child(name_lbl)

	if has_life:
		var life_badge := Label.new()
		life_badge.text = "🌱"
		life_badge.add_theme_font_size_override("font_size", 13)
		name_row.add_child(life_badge)

	var type_lbl := Label.new()
	type_lbl.text = planet_type
	type_lbl.add_theme_color_override("font_color", type_color)
	type_lbl.add_theme_font_size_override("font_size", 12)
	info.add_child(type_lbl)

	# Stats row
	var stats_row := HBoxContainer.new()
	stats_row.add_theme_constant_override("separation", 16)
	info.add_child(stats_row)

	var stats := [
		["Radius", "%.1f🌍" % float(planet.get("radius", 1.0))],
		["Gravity", "%.1f m/s²" % float(planet.get("gravity", 9.8))],
		["Orbit", "%.0fd" % float(planet.get("orbital_period", 365.0))],
	]
	for stat in stats:
		var stat_col := VBoxContainer.new()
		stats_row.add_child(stat_col)
		var lbl_key := Label.new()
		lbl_key.text = stat[0]
		lbl_key.add_theme_color_override("font_color", Color("7788aa"))
		lbl_key.add_theme_font_size_override("font_size", 10)
		stat_col.add_child(lbl_key)
		var lbl_val := Label.new()
		lbl_val.text = stat[1]
		lbl_val.add_theme_color_override("font_color", Color("ffffff"))
		lbl_val.add_theme_font_size_override("font_size", 12)
		stat_col.add_child(lbl_val)

	return card
