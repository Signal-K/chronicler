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
	_refresh_ui()


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_warm_title($Root/Title, 26)
	UIFwk.style_warm_panel($Root/Summary)
	UIFwk.style_amber_text(discovered_count_label)
	UIFwk.style_amber_muted(classifications_label)
	UIFwk.style_warm_text(level_label)
	UIFwk.style_amber_muted(status_label)
	UIFwk.style_amber_button(discover_button)
	discover_button.text = "🪐 Discover New Planet"


func _on_discover_pressed() -> void:
	var result: Dictionary = GameState.discover_planet()
	GameState.save_state()
	status_label.text = str(result.get("message", "Discovery complete."))
	_refresh_ui()


func _refresh_ui() -> void:
	var planets := GameState.get_planet_catalog()
	discovered_count_label.text = "Discovered Worlds: %d" % max(0, planets.size() - 1)
	classifications_label.text = "Classifications: %d" % GameState.classifications_completed
	level_label.text = "Level: %d" % int(GameState.get_progress_info().get("level", 1))
	_rebuild_planet_list(planets)


func _rebuild_planet_list(planets: Array[Dictionary]) -> void:
	# Planet rows are spawned at runtime because the catalog grows dynamically.
	for child in planet_list.get_children():
		child.queue_free()

	for planet in planets:
		var row := PanelContainer.new()
		UIFwk.style_warm_panel(row)

		var margin := MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 10)
		margin.add_theme_constant_override("margin_top", 8)
		margin.add_theme_constant_override("margin_right", 10)
		margin.add_theme_constant_override("margin_bottom", 8)
		row.add_child(margin)

		var body := VBoxContainer.new()
		body.add_theme_constant_override("separation", 2)
		margin.add_child(body)

		var life_tag := "🟢" if bool(planet.get("has_life", false)) else "⚪"

		var name_label := Label.new()
		name_label.text = "%s %s — %s" % [life_tag, str(planet.get("name", "Planet")), str(planet.get("type", "Unknown"))]
		UIFwk.style_warm_text(name_label)
		name_label.add_theme_font_size_override("font_size", 14)
		body.add_child(name_label)

		var stats_label := Label.new()
		stats_label.text = "Radius %.1f  Gravity %.1f  Orbit %.0fd" % [
			float(planet.get("radius", 1.0)),
			float(planet.get("gravity", 9.8)),
			float(planet.get("orbital_period", 365.0)),
		]
		UIFwk.style_amber_muted(stats_label)
		stats_label.add_theme_font_size_override("font_size", 12)
		body.add_child(stats_label)

		planet_list.add_child(row)
