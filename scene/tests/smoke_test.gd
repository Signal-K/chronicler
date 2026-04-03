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

	# GameState autoload is not available in bare SceneTree mode.
	# Its mechanics are fully covered by tests/unit_test.gd (run via unit_test.tscn).
	print("SKIP: GameState autoload (covered by unit_test.tscn)")

	print("\n%d passed, %d failed" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)
