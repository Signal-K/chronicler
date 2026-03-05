extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var discovered_count_label: Label = $Root/Summary/SummaryMargin/SummaryBody/DiscoveredCountLabel
@onready var classifications_label: Label = $Root/Summary/SummaryMargin/SummaryBody/ClassificationsLabel
@onready var level_label: Label = $Root/Summary/SummaryMargin/SummaryBody/LevelLabel
@onready var status_label: Label = $Root/Summary/SummaryMargin/SummaryBody/StatusLabel
@onready var discover_button: Button = $Root/Summary/SummaryMargin/SummaryBody/DiscoverButton

@onready var planet_name_labels: Array[Label] = [
	$Root/PlanetList/PlanetRow1/PlanetNameLabel,
	$Root/PlanetList/PlanetRow2/PlanetNameLabel,
	$Root/PlanetList/PlanetRow3/PlanetNameLabel,
	$Root/PlanetList/PlanetRow4/PlanetNameLabel,
	$Root/PlanetList/PlanetRow5/PlanetNameLabel,
]
@onready var planet_type_labels: Array[Label] = [
	$Root/PlanetList/PlanetRow1/PlanetTypeLabel,
	$Root/PlanetList/PlanetRow2/PlanetTypeLabel,
	$Root/PlanetList/PlanetRow3/PlanetTypeLabel,
	$Root/PlanetList/PlanetRow4/PlanetTypeLabel,
	$Root/PlanetList/PlanetRow5/PlanetTypeLabel,
]
@onready var planet_stats_labels: Array[Label] = [
	$Root/PlanetList/PlanetRow1/PlanetStatsLabel,
	$Root/PlanetList/PlanetRow2/PlanetStatsLabel,
	$Root/PlanetList/PlanetRow3/PlanetStatsLabel,
	$Root/PlanetList/PlanetRow4/PlanetStatsLabel,
	$Root/PlanetList/PlanetRow5/PlanetStatsLabel,
]

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

	for label in planet_name_labels:
		UIFwk.style_warm_text(label)
	for label in planet_type_labels:
		UIFwk.style_amber_muted(label)
	for label in planet_stats_labels:
		UIFwk.style_amber_muted(label)


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

	for i in range(planet_name_labels.size()):
		if i >= planets.size():
			planet_name_labels[i].text = "-"
			planet_type_labels[i].text = "-"
			planet_stats_labels[i].text = "-"
			continue

		var planet: Dictionary = planets[i]
		var life_tag := "🟢" if bool(planet.get("has_life", false)) else "⚪"
		planet_name_labels[i].text = "%s %s" % [life_tag, str(planet.get("name", "Planet"))]
		planet_type_labels[i].text = str(planet.get("type", "Unknown"))
		planet_stats_labels[i].text = "R %.1f | G %.1f | Orb %.0fd" % [
			float(planet.get("radius", 1.0)),
			float(planet.get("gravity", 9.8)),
			float(planet.get("orbital_period", 365.0)),
		]
