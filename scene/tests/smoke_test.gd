extends SceneTree

func _init() -> void:
	var pass_count := 0
	var fail_count := 0

	var scenes_to_test := [
		"res://scenes/game_root.tscn",
		"res://scenes/main.tscn",
		"res://scenes/hives.tscn",
		"res://scenes/hive_card.tscn",
		"res://scenes/plot.tscn",
		"res://scenes/inventory.tscn",
		"res://scenes/progress.tscn",
		"res://scenes/settings.tscn",
		"res://scenes/expand.tscn",
		"res://scenes/planets.tscn",
		"res://scenes/shop.tscn",
		"res://scenes/orders_panel.tscn",
	]

	for path in scenes_to_test:
		var scene := load(path) as PackedScene
		if scene == null:
			printerr("FAIL: could not load " + path)
			fail_count += 1
		else:
			print("PASS: " + path)
			pass_count += 1

	# Verify GameState autoload basics
	var gs := root.get_node_or_null("GameState")
	if gs == null:
		printerr("FAIL: GameState autoload not found")
		fail_count += 1
	else:
		assert(gs.plots.size() >= 6, "Expected at least 6 plots")
		assert(gs.hives.size() >= 1, "Expected at least 1 hive")
		assert("pumpkin" in gs.CROP_CONFIGS, "Expected pumpkin in CROP_CONFIGS")
		assert("potato" in gs.CROP_CONFIGS, "Expected potato in CROP_CONFIGS")
		assert("wildflower" in gs.HONEY_TYPE_CONFIG, "Expected wildflower in HONEY_TYPE_CONFIG")
		print("PASS: GameState autoload")
		pass_count += 1

	print("\n%d passed, %d failed" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)
