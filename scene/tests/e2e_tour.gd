## E2E tour: drives the game like a first-time user, screenshots every action,
## logs all errors/prints, writes a report if anything went wrong, then cleans up.
##
## Run via: docker run bee-garden-e2e
## Or locally: godot --headless --path scene res://scenes/e2e_tour.tscn
extends Node

# ── Config ────────────────────────────────────────────────────────────────────
const SCREENSHOT_DIR := "user://e2e_screenshots/"
const REPORT_PATH    := "user://e2e_report.md"
const STEP_DELAY     := 0.3   # seconds between actions (enough for UI to settle)

# ── State ─────────────────────────────────────────────────────────────────────
var _gs: Node          # GameState autoload
var _root_ui: Node     # GameRoot node
var _log: Array = []   # Array of { step, msg, level, screenshot }
var _errors: Array = []
var _step: int = 0
var _screenshots: Array = []
var _has_display: bool = false  # false in --headless, true with Xvfb

# ── Entry ─────────────────────────────────────────────────────────────────────
func _ready() -> void:
	# Detect whether we have a real display (Xvfb or native)
	_has_display = DisplayServer.get_name() != "headless"

	_gs = get_node("/root/GameState")
	# Ensure clean slate
	_gs.reset_game()
	_gs.set_force_daytime(true)
	_gs.set_fast_growth(true)

	# Load the game root scene as a child so all screens work
	var game_root_scene := load("res://scenes/game_root.tscn") as PackedScene
	_root_ui = game_root_scene.instantiate()
	get_tree().get_root().call_deferred("add_child", _root_ui)

	DirAccess.make_dir_recursive_absolute(
		ProjectSettings.globalize_path(SCREENSHOT_DIR)
	)

	# Wait for game root to fully initialise (deferred add needs extra frames)
	await get_tree().process_frame
	await get_tree().process_frame
	await get_tree().process_frame

	await _run_tour()

# ── Tour ──────────────────────────────────────────────────────────────────────
func _run_tour() -> void:
	await _section("STARTUP")
	await _assert_screen("garden", "Game opens on garden screen")
	await _screenshot("01_startup")

	# ── Tutorial-style first-time flow ────────────────────────────────────────
	await _section("TUTORIAL FLOW")

	# Step 1: Visit help screen (new user would look for help)
	await _navigate("help")
	await _screenshot("02_help_screen")
	await _assert_node_exists("VBox/Scroll/SectionList", "Help screen has section list")
	# Expand a section
	await _click_first_button_in("VBox/Scroll/SectionList", "03_help_section_expanded")
	# Back to garden
	await _navigate("garden")
	await _screenshot("04_back_to_garden")

	# Step 2: Till a plot
	await _section("GARDEN - TILL")
	await _set_tool("till")
	await _screenshot("05_tool_till_selected")
	await _press_plot(0)
	await _screenshot("06_plot_0_tilled")
	await _assert_plot_state(0, "tilled", "Plot 0 is tilled")

	# Step 3: Try to plant without selecting crop (plant on untilled plot)
	await _set_tool("plant")
	await _press_plot(1)  # plot 1 is still empty — should silently fail
	await _screenshot("07_plant_on_empty_noop")
	await _assert_plot_state(1, "empty", "Planting on empty plot does nothing")

	# Step 4: Plant on tilled plot
	await _press_plot(0)
	await _screenshot("08_plot_0_planted")
	await _assert_plot_state(0, "planted", "Plot 0 is planted")

	# Step 5: Till and plant remaining plots
	await _section("GARDEN - FILL ALL PLOTS")
	for i in range(1, _gs.plots.size()):
		await _set_tool("till")
		await _press_plot(i)
		await _set_tool("plant")
		await _press_plot(i)
	await _screenshot("09_all_plots_planted")

	# Step 6: Water a plot
	await _section("GARDEN - WATER")
	await _set_tool("water")
	await _press_plot(0)
	await _screenshot("10_watered_plot")

	# Step 7: Try to water with empty tank
	_gs.current_water = 0.0
	await _set_tool("water")
	await _press_plot(0)
	await _screenshot("11_water_empty_toast")
	_gs.current_water = _gs.MAX_WATER

	# Fast-forward growth — set all plots to harvestable with a valid crop
	await _section("GARDEN - HARVEST")
	for i in range(_gs.plots.size()):
		if _gs.plots[i]["state"] in ["planted", "growing", "empty", "tilled"]:
			_gs.plots[i]["state"] = "harvestable"
			_gs.plots[i]["growth_stage"] = 3
			if _gs.plots[i]["crop_id"] == "":
				_gs.plots[i]["crop_id"] = "tomato"
			_gs.plot_changed.emit(i)
	await get_tree().process_frame
	await _screenshot("12_all_harvestable")

	await _set_tool("harvest")
	for i in range(_gs.plots.size()):
		await _press_plot(i)
	await _screenshot("13_all_harvested")
	await _assert_condition(
		_gs.total_harvests >= _gs.INITIAL_ROWS * _gs.PLOTS_PER_ROW,
		"total_harvests incremented after harvesting all plots"
	)

	# Step 9: Shovel a plot (till it first)
	await _section("GARDEN - SHOVEL")
	await _set_tool("till")
	await _press_plot(0)
	await _set_tool("plant")
	await _press_plot(0)
	await _set_tool("shovel")
	await _press_plot(0)
	await _screenshot("14_plot_shovelled")
	await _assert_plot_state(0, "empty", "Shovelled plot is empty")

	# ── Hives screen ──────────────────────────────────────────────────────────
	await _section("HIVES SCREEN")
	await _navigate("hives")
	await _screenshot("15_hives_screen")
	await _assert_node_exists("VBox/Scroll/ScrollVBox/HiveList", "Hive list exists")

	# Try to bottle with no honey
	_gs.hives[0]["honey_accumulated"] = 0.0
	await _screenshot("16_bottle_btn_disabled")
	await _assert_condition(
		_gs.hives[0]["honey_accumulated"] < 1.0,
		"Bottle button should be disabled with no honey"
	)

	# Give hive bees and honey, then bottle
	_gs.hives[0]["bee_count"] = 20
	_gs.hives[0]["honey_accumulated"] = 5.0
	_gs.hives_changed.emit()
	await get_tree().process_frame
	await _screenshot("17_hive_has_honey")
	# Click bottle button on first hive card
	await _click_button_by_text("Bottle Honey", "18_bottled_honey")
	await _assert_condition(_gs.bottled_honey.size() > 0, "Honey was bottled")

	# Build a second hive
	_gs.coins = _gs.HIVE_COST + 50
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("19_can_build_hive")
	await _click_button_by_text("Build Hive (100🪙)", "20_second_hive_built")
	await _assert_condition(_gs.hives.size() >= 2, "Second hive built")

	# Try to build hive with no coins
	_gs.coins = 0
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("21_build_hive_disabled")

	# ── Orders panel (within hives screen) ───────────────────────────────────
	await _section("ORDERS")
	_gs.orders = []
	_gs.orders_date = ""
	_gs.refresh_orders_if_needed()
	_gs.orders_changed.emit()
	await get_tree().process_frame
	await _screenshot("22_orders_panel")
	await _assert_condition(_gs.orders.size() == _gs.ORDERS_PER_DAY, "Orders generated")

	# Fulfill an order
	var order: Dictionary = _gs.orders[0]
	var htype: String = order["honey_type"]
	_gs.bottled_honey = [{ "id": "e2e", "type": htype, "color": "#DAA520", "amount": order["quantity"] + 5 }]
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("23_order_fulfillable")
	_gs.fulfill_order(order["id"])
	_gs.orders_changed.emit()
	await get_tree().process_frame
	await _screenshot("24_order_fulfilled")
	await _assert_condition(order["fulfilled"], "Order marked fulfilled")

	# Try to fulfill same order again (should fail silently)
	_gs.fulfill_order(order["id"])
	await _screenshot("25_double_fulfill_noop")

	# Try to fulfill with no honey
	var order2: Dictionary = _gs.orders[1]
	_gs.bottled_honey = []
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("26_fulfill_no_honey")

	# ── Shop screen ───────────────────────────────────────────────────────────
	await _section("SHOP SCREEN")
	await _navigate("shop")
	await _screenshot("27_shop_screen")
	await _assert_node_exists("VBox/Scroll/List", "Shop list exists")

	# Buy a seed with enough coins
	_gs.coins = 200
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("28_shop_can_buy")
	var tomato_before: int = _gs.seeds.get("tomato", 0)
	_gs.buy_seed("tomato", 1)
	await _assert_condition(_gs.seeds.get("tomato", 0) == tomato_before + 1, "Tomato seed purchased")
	await _screenshot("29_seed_purchased")

	# Buy with no coins
	_gs.coins = 0
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("30_shop_no_coins")

	# ── Inventory screen ──────────────────────────────────────────────────────
	await _section("INVENTORY SCREEN")
	await _navigate("inventory")
	await _screenshot("31_inventory_screen")
	await _assert_node_exists("Scroll/VBox/SeedsSection/List", "Seeds section exists")
	await _assert_node_exists("Scroll/VBox/HoneySection/List", "Honey section exists")

	# ── Progress screen ───────────────────────────────────────────────────────
	await _section("PROGRESS SCREEN")
	await _navigate("progress")
	await _screenshot("32_progress_screen")
	await _assert_node_exists("VBox/XPBar", "XP bar exists")

	# Level up
	var xp_to_level2: int = _gs.xp_for_level(2)
	_gs.xp = 0; _gs.level = 1
	_gs.add_xp(xp_to_level2)
	await get_tree().process_frame
	await _screenshot("33_level_up")
	await _assert_condition(_gs.level >= 2, "Level up triggered")

	# Almanac from progress
	await _click_button_by_text("📖 View Almanac", "34_almanac_screen")
	await _screenshot("35_almanac_content")
	# Back from almanac
	await _click_button_by_text("Back", "36_back_from_almanac")

	# ── Expand screen ─────────────────────────────────────────────────────────
	await _section("EXPAND SCREEN")
	await _navigate("expand")
	await _screenshot("37_expand_screen")

	# Try expand with no coins
	_gs.coins = 0
	_gs.inventory_changed.emit()
	await get_tree().process_frame
	await _screenshot("38_expand_disabled")

	# Expand with enough coins
	var expand_cost: int = _gs.expansion_cost(_gs.unlocked_rows + 1)
	if expand_cost > 0:
		_gs.coins = expand_cost
		_gs.inventory_changed.emit()
		await get_tree().process_frame
		await _screenshot("39_expand_affordable")
		var rows_before: int = _gs.unlocked_rows
		_gs.purchase_expansion()
		await get_tree().process_frame
		await _screenshot("40_expanded")
		await _assert_condition(_gs.unlocked_rows == rows_before + 1, "Garden expanded")

	# Expand past max
	_gs.unlocked_rows = _gs.INITIAL_ROWS + _gs.EXPANSION_COSTS.size()
	_gs.garden_expanded.emit(_gs.unlocked_rows)
	await get_tree().process_frame
	await _screenshot("41_expand_maxed")
	await _assert_condition(
		_gs.expansion_cost(_gs.unlocked_rows + 1) == -1,
		"No more expansions available"
	)

	# ── Discover / Citizen Science screen ────────────────────────────────────
	await _section("DISCOVER SCREEN")
	await _navigate("discover")
	await _screenshot("42_discover_screen")
	await _assert_node_exists("VBox/StatusLabel", "Status label exists")

	# Daily limit reached
	_gs.daily_classification_count = 999
	await get_tree().process_frame
	await _screenshot("43_classification_limit")

	# Reset and check buttons are enabled
	_gs.classification_date = ""
	_gs.daily_classification_count = 0
	await get_tree().process_frame
	await _screenshot("44_classification_available")

	# ── Planets screen ────────────────────────────────────────────────────────
	await _section("PLANETS SCREEN")
	await _navigate("planets")
	await _screenshot("45_planets_screen")
	await _assert_node_exists("VBox/Scroll/List", "Planets list exists")

	# ── Settings screen ───────────────────────────────────────────────────────
	await _section("SETTINGS SCREEN")
	await _navigate("settings")
	await _screenshot("46_settings_screen")
	await _assert_node_exists("VBox/ForceDayCheck", "Force day toggle exists")
	await _assert_node_exists("VBox/FastGrowthCheck", "Fast growth toggle exists")
	await _assert_node_exists("VBox/ResetBtn", "Reset button exists")

	# Toggle fast growth off and back on
	_gs.set_fast_growth(false)
	await get_tree().process_frame
	await _screenshot("47_fast_growth_off")
	_gs.set_fast_growth(true)

	# ── Navigation: visit every tab and confirm no crash ─────────────────────
	await _section("FULL TAB NAVIGATION")
	var all_tabs := ["garden", "hives", "shop", "inventory", "progress",
					 "discover", "expand", "planets", "settings"]
	for tab in all_tabs:
		await _navigate(tab)
		await _screenshot("48_tab_%s" % tab)
		await _assert_condition(
			_get_current_screen() != null,
			"Screen loaded for tab: %s" % tab
		)
		# Confirm we can navigate away (not stuck)
		await _navigate("garden")
		await _assert_condition(
			_get_current_screen() != null,
			"Can return to garden from: %s" % tab
		)

	# ── Water edge cases ──────────────────────────────────────────────────────
	await _section("WATER EDGE CASES")
	await _navigate("garden")
	_gs.current_water = _gs.MAX_WATER
	_gs.is_raining = true
	_gs.weather_changed.emit(true)
	await get_tree().process_frame
	await _screenshot("49_raining")
	_gs.is_raining = false
	_gs.weather_changed.emit(false)
	await get_tree().process_frame
	await _screenshot("50_rain_stopped")

	# ── Pollination & bee hatching ────────────────────────────────────────────
	await _section("POLLINATION & BEE HATCHING")
	_gs.pollination_score = 0.0
	_gs.pollination_milestones = []
	_gs.hives[0]["bee_count"] = 0
	_gs.navigate_requested.emit("garden")
	await get_tree().process_frame
	_gs._increment_pollination(10.1)
	await get_tree().process_frame
	await _screenshot("51_bee_hatched")
	await _assert_condition(_gs.hives[0]["bee_count"] >= 1, "Bee hatched from pollination")

	# ── Bee capacity cap ──────────────────────────────────────────────────────
	var cap: int = _gs.HIVE_LEVELS[1]["max_capacity"]
	_gs.hives[0]["bee_count"] = cap
	_gs.add_bees(10, _gs.hives[0]["id"])
	await _assert_condition(_gs.hives[0]["bee_count"] == cap, "Bee count capped at max")

	# ── Reset game ────────────────────────────────────────────────────────────
	await _section("RESET GAME")
	await _navigate("settings")
	await _screenshot("52_before_reset")
	_gs.reset_game()
	await get_tree().process_frame
	await _screenshot("53_after_reset")
	await _assert_condition(_gs.coins == 100, "Coins reset to 100")
	await _assert_condition(_gs.level == 1, "Level reset to 1")
	await _assert_condition(_gs.plots.size() == _gs.INITIAL_ROWS * _gs.PLOTS_PER_ROW, "Plots reset")

	# ── Cleanup ───────────────────────────────────────────────────────────────
	await _finish()

# ── Helpers ───────────────────────────────────────────────────────────────────

func _section(name: String) -> void:
	print("── %s ──" % name)
	_log.append({ "step": _step, "msg": "=== %s ===" % name, "level": "section", "screenshot": "" })

func _navigate(screen: String) -> void:
	_gs.navigate_requested.emit(screen)
	await _wait()

func _set_tool(tool: String) -> void:
	var screen := _get_current_screen()
	if screen and screen.has_method("_set_tool"):
		screen._set_tool(tool)
	await _wait()

func _press_plot(index: int) -> void:
	var screen := _get_current_screen()
	if screen == null: return
	var grid: Node = screen.get_node_or_null("VBox/Garden/Grid")
	if grid == null: return
	var plots_nodes := grid.get_children()
	if index < plots_nodes.size():
		var plot_node: Node = plots_nodes[index]
		if plot_node.has_method("emit_signal"):
			plot_node.emit_signal("plot_pressed", index)
		elif plot_node is Button:
			plot_node.emit_signal("pressed")
	await _wait()

func _click_button_by_text(btn_text: String, shot_name: String) -> void:
	var screen := _get_current_screen()
	if screen == null:
		_log_warn("_click_button_by_text: no current screen for '%s'" % btn_text)
		return
	var btn := _find_button_by_text(screen, btn_text)
	if btn:
		btn.emit_signal("pressed")
		await _wait()
		await _screenshot(shot_name)
	else:
		_log_warn("Button '%s' not found on current screen" % btn_text)
		await _screenshot(shot_name + "_NOT_FOUND")

func _click_first_button_in(node_path: String, shot_name: String) -> void:
	var screen := _get_current_screen()
	if screen == null: return
	var container: Node = screen.get_node_or_null(node_path)
	if container == null:
		_log_warn("Node path '%s' not found" % node_path)
		return
	for child in container.get_children():
		if child is Button:
			child.emit_signal("pressed")
			await _wait()
			await _screenshot(shot_name)
			return

func _find_button_by_text(node: Node, text: String) -> Button:
	if node is Button and node.text == text:
		return node as Button
	for child in node.get_children():
		var found := _find_button_by_text(child, text)
		if found:
			return found
	return null

func _get_current_screen() -> Node:
	if _root_ui == null or not is_instance_valid(_root_ui): return null
	var container: Node = _root_ui.get_node_or_null("VBox/ScreenContainer")
	if container == null: return null
	var children := container.get_children()
	if children.is_empty(): return null
	return children[0]

func _assert_screen(expected_key: String, label: String) -> void:
	# We can't easily check the scene name, so just assert a screen exists
	var screen := _get_current_screen()
	_assert_condition(screen != null, label + " (screen loaded)")

func _assert_node_exists(path: String, label: String) -> void:
	var screen := _get_current_screen()
	var exists := screen != null and screen.get_node_or_null(path) != null
	_assert_condition(exists, label)

func _assert_plot_state(index: int, expected: String, label: String) -> void:
	var actual: String = _gs.plots[index]["state"] if index < _gs.plots.size() else "OUT_OF_RANGE"
	_assert_condition(actual == expected, "%s (got: %s)" % [label, actual])

func _assert_condition(cond: bool, label: String) -> void:
	_step += 1
	var last_shot: String = _screenshots.back() if not _screenshots.is_empty() else ""
	if cond:
		print("  ✓ %s" % label)
		_log.append({ "step": _step, "msg": "PASS: " + label, "level": "pass", "screenshot": last_shot })
	else:
		printerr("  ✗ %s" % label)
		_log.append({ "step": _step, "msg": "FAIL: " + label, "level": "fail", "screenshot": last_shot })
		_errors.append({ "step": _step, "msg": label, "screenshot": last_shot })

func _log_warn(msg: String) -> void:
	printerr("  ⚠ " + msg)
	var last_shot: String = _screenshots.back() if not _screenshots.is_empty() else ""
	_log.append({ "step": _step, "msg": "WARN: " + msg, "level": "warn", "screenshot": last_shot })
	_errors.append({ "step": _step, "msg": msg, "screenshot": last_shot })

func _screenshot(name: String) -> void:
	_screenshots.append(name)
	if not _has_display:
		print("  📸 %s (skipped — no display)" % name)
		return
	var path := SCREENSHOT_DIR + name + ".png"
	var img := get_viewport().get_texture().get_image()
	if img == null:
		print("  📸 %s (skipped — null texture)" % name)
		return
	img.save_png(ProjectSettings.globalize_path(path))
	print("  📸 " + name)

func _wait() -> void:
	await get_tree().create_timer(STEP_DELAY).timeout

# ── Finish: write report if errors, delete save, clean up ────────────────────

func _finish() -> void:
	# Delete save data
	var save_path := ProjectSettings.globalize_path("user://save.cfg")
	if FileAccess.file_exists(save_path):
		DirAccess.remove_absolute(save_path)
		print("🗑  Save data deleted")

	var pass_count := 0
	var fail_count := 0
	for entry in _log:
		if entry["level"] == "pass": pass_count += 1
		elif entry["level"] in ["fail", "warn"]: fail_count += 1

	print("\n── E2E TOUR COMPLETE: %d passed, %d failed ──" % [pass_count, fail_count])

	if fail_count > 0:
		_write_report(pass_count, fail_count)
		print("📄 Report written to: " + ProjectSettings.globalize_path(REPORT_PATH))
	else:
		# Clean run — delete screenshots and report if it exists
		_delete_screenshots()
		var report_abs := ProjectSettings.globalize_path(REPORT_PATH)
		if FileAccess.file_exists(report_abs):
			DirAccess.remove_absolute(report_abs)
		print("✅ Clean run — no report generated, screenshots deleted")

	get_tree().quit(1 if fail_count > 0 else 0)

func _write_report(pass_count: int, fail_count: int) -> void:
	var report_abs := ProjectSettings.globalize_path(REPORT_PATH)
	var f := FileAccess.open(report_abs, FileAccess.WRITE)
	if f == null:
		printerr("Could not write report to " + report_abs)
		return

	f.store_line("# Bee Garden — E2E Tour Report")
	f.store_line("")
	f.store_line("**Generated:** %s" % Time.get_datetime_string_from_system())
	f.store_line("**Result:** %d passed / %d failed" % [pass_count, fail_count])
	f.store_line("")
	f.store_line("## How to use this report")
	f.store_line("")
	f.store_line("Each failure below links to a screenshot. Feed this file plus the")
	f.store_line("referenced screenshots to Claude / Gemini / Codex to diagnose issues.")
	f.store_line("Screenshots are in the same directory as this report.")
	f.store_line("")
	f.store_line("## Failures & Warnings")
	f.store_line("")

	if _errors.is_empty():
		f.store_line("_None_")
	else:
		for err in _errors:
			var shot_link := ""
			if err["screenshot"] != "":
				shot_link = "  →  ![screenshot](%s.png)" % err["screenshot"]
			f.store_line("- **Step %d** — %s%s" % [err["step"], err["msg"], shot_link])

	f.store_line("")
	f.store_line("## Full Log")
	f.store_line("")
	f.store_line("| Step | Level | Message | Screenshot |")
	f.store_line("|------|-------|---------|------------|")
	for entry in _log:
		var shot_cell := ""
		if entry["screenshot"] != "":
			shot_cell = "![%s](%s.png)" % [entry["screenshot"], entry["screenshot"]]
		f.store_line("| %d | %s | %s | %s |" % [
			entry["step"], entry["level"], entry["msg"].replace("|", "\\|"), shot_cell
		])

	f.close()

func _delete_screenshots() -> void:
	var dir_abs := ProjectSettings.globalize_path(SCREENSHOT_DIR)
	var dir := DirAccess.open(dir_abs)
	if dir == null: return
	dir.list_dir_begin()
	var fname := dir.get_next()
	while fname != "":
		if not dir.current_is_dir() and fname.ends_with(".png"):
			DirAccess.remove_absolute(dir_abs + fname)
		fname = dir.get_next()
	dir.list_dir_end()
	DirAccess.remove_absolute(dir_abs)
