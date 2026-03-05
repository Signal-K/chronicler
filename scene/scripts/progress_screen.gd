extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var level_label: Label = $ScrollRoot/Root/Overview/OverviewMargin/OverviewBody/LevelLabel
@onready var xp_label: Label = $ScrollRoot/Root/Overview/OverviewMargin/OverviewBody/XPLabel
@onready var progress_bar: ProgressBar = $ScrollRoot/Root/Overview/OverviewMargin/OverviewBody/XPProgressBar
@onready var harvests_label: Label = $ScrollRoot/Root/Stats/StatsMargin/StatsBody/HarvestsLabel
@onready var unique_harvests_label: Label = $ScrollRoot/Root/Stats/StatsMargin/StatsBody/UniqueHarvestsLabel
@onready var pollination_label: Label = $ScrollRoot/Root/Stats/StatsMargin/StatsBody/PollinationLabel
@onready var sales_label: Label = $ScrollRoot/Root/Stats/StatsMargin/StatsBody/SalesLabel
@onready var classifications_label: Label = $ScrollRoot/Root/Stats/StatsMargin/StatsBody/ClassificationsLabel
@onready var status_label: Label = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/StatusLabel

@onready var pollination_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ActionButtons/AwardPollinationButton
@onready var classification_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ActionButtons/AwardClassificationButton

@onready var plot_pages_label: Label = $ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/PlotPagesLabel
@onready var upgrade_status_label: Label = $ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeStatusLabel
@onready var upgrade_buttons: Array[Button] = [
	$ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeRow1/Upgrade1Button,
	$ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeRow2/Upgrade2Button,
	$ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeRow3/Upgrade3Button,
]
@onready var upgrade_labels: Array[Label] = [
	$ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeRow1/Upgrade1Label,
	$ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeRow2/Upgrade2Label,
	$ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradeRow3/Upgrade3Label,
]

func _ready() -> void:
	_apply_ui_theme()
	pollination_button.pressed.connect(_on_award_pollination)
	classification_button.pressed.connect(_on_award_classification)
	for i in range(upgrade_buttons.size()):
		var target_page := i + 2
		upgrade_buttons[i].pressed.connect(_on_upgrade_pressed.bind(target_page))
	_refresh_ui()


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_warm_title($ScrollRoot/Root/Title, 26)
	# Section panels
	UIFwk.style_warm_panel($ScrollRoot/Root/Overview)
	UIFwk.style_warm_panel($ScrollRoot/Root/Stats)
	UIFwk.style_warm_panel($ScrollRoot/Root/Actions)
	# Labels
	UIFwk.style_warm_section($ScrollRoot/Root/Overview/OverviewMargin/OverviewBody/LevelLabel)
	UIFwk.style_warm_text(xp_label)
	UIFwk.style_warm_text(harvests_label)
	UIFwk.style_warm_text(unique_harvests_label)
	UIFwk.style_warm_text(pollination_label)
	UIFwk.style_warm_text(sales_label)
	UIFwk.style_warm_text(classifications_label)
	UIFwk.style_warm_muted(status_label)
	# Buttons
	UIFwk.style_button(pollination_button, Color("0f766e"))
	UIFwk.style_button(classification_button, Color("1d4ed8"))
	# Upgrades panel
	UIFwk.style_warm_panel($ScrollRoot/Root/Upgrades)
	UIFwk.style_warm_section($ScrollRoot/Root/Upgrades/UpgradesMargin/UpgradesBody/UpgradesTitle)
	UIFwk.style_amber_muted(plot_pages_label)
	UIFwk.style_amber_muted(upgrade_status_label)
	for lbl in upgrade_labels:
		UIFwk.style_warm_text(lbl)
	for btn in upgrade_buttons:
		UIFwk.style_amber_button(btn)


func _on_award_pollination() -> void:
	var event: Dictionary = GameState.award_pollination_xp()
	GameState.save_state()
	status_label.text = "Awarded +%d pollination XP" % int(event.get("gained", 0))
	_refresh_ui()


func _on_award_classification() -> void:
	var event: Dictionary = GameState.award_classification_xp()
	GameState.save_state()
	status_label.text = "Awarded +%d classification XP" % int(event.get("gained", 0))
	_refresh_ui()


func _refresh_ui() -> void:
	var info: Dictionary = GameState.get_progress_info()
	level_label.text = "Level: %d" % int(info.get("level", 1))
	xp_label.text = "XP: %d / %d (Total: %d)" % [
		int(info.get("xp_in_level", 0)),
		int(info.get("xp_needed", 1)),
		int(info.get("total_xp", 0)),
	]
	progress_bar.value = float(info.get("progress", 0.0)) * 100.0

	harvests_label.text = "Harvests: %d" % GameState.harvests_count
	unique_harvests_label.text = "Unique Harvests: %d" % GameState.unique_harvests.size()
	pollination_label.text = "Pollination Events: %d" % GameState.pollination_events
	sales_label.text = "Sales Completed: %d" % GameState.sales_completed
	classifications_label.text = "Classifications: %d" % GameState.classifications_completed
	_refresh_upgrades_ui()


func _refresh_upgrades_ui() -> void:
	var current_pages := GameState.plot_pages
	var total_plots := GameState.get_plot_count()
	plot_pages_label.text = "Plot pages: %d / %d (%d plots active)" % [current_pages, GameState.MAX_PLOT_PAGES, total_plots]
	for i in range(upgrade_buttons.size()):
		var upgrade: Dictionary = GameState.PLOT_PAGE_UPGRADES[i]
		var target_page := int(upgrade.get("page", 0))
		var req_level := int(upgrade.get("required_level", 1))
		var cost := int(upgrade.get("cost", 0))
		var current_level := int(GameState.get_progress_info().get("level", 1))
		var purchased := current_pages >= target_page
		var can_afford := GameState.coins >= cost
		var meets_level := current_level >= req_level
		if purchased:
			upgrade_labels[i].text = "Page %d ✓ Unlocked" % target_page
			upgrade_buttons[i].text = "Owned"
			upgrade_buttons[i].disabled = true
		else:
			upgrade_labels[i].text = "Page %d — Lv.%d · %dc" % [target_page, req_level, cost]
			upgrade_buttons[i].text = "Unlock"
			upgrade_buttons[i].disabled = not (can_afford and meets_level)


func _on_upgrade_pressed(target_page: int) -> void:
	var result: Dictionary = GameState.unlock_plot_page(target_page)
	GameState.save_state()
	upgrade_status_label.text = str(result.get("message", "Upgrade action complete."))
	_refresh_ui()

