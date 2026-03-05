# capture_screenshots.gd
# Renders every tab of game_root.tscn and saves a PNG per tab.
#
# Run via GitHub Actions workflow; see .github/workflows/godot-screenshots.yml.
# Requires a real display (Xvfb) – not compatible with --headless.
#
# Output dir priority:
#   1. SCREENSHOT_DIR environment variable
#   2. <project root>/screenshots/
#
# Usage:
#   SCREENSHOT_DIR=/tmp/shots xvfb-run godot \
#     --path scene --rendering-driver opengl3 \
#     --rendering-method gl_compatibility \
#     --script res://tests/capture_screenshots.gd
extends SceneTree

const TAB_NAMES: Array[String] = [
	"farm",
	"hives",
	"progress",
	"settings",
	"expand",
	"planets",
	"inventory",
]

# Frames to wait before the first capture (scene init + layout settle).
const FRAMES_INIT := 90
# Frames between switching to a tab and capturing it.
const FRAMES_PER_TAB := 45

var _frame := 0
var _tab_idx := 0
var _tabs: TabContainer = null
var _output_dir := ""
var _phase := "init"  # "init" | "switching" | "capturing" | "done"


func _initialize() -> void:
	# Resolve output directory.
	_output_dir = OS.get_environment("SCREENSHOT_DIR")
	if _output_dir.is_empty():
		_output_dir = ProjectSettings.globalize_path("res://") + "screenshots"
	DirAccess.make_dir_recursive_absolute(_output_dir)
	print("[screenshots] Output dir: " + _output_dir)

	# Size the viewport to match the mobile reference resolution.
	get_root().content_scale_size = Vector2i(430, 932)

	# Load and add the main game scene.
	var game: Node = load("res://scenes/game_root.tscn").instantiate()
	get_root().add_child(game)
	_tabs = game.get_node("Tabs")
	_tabs.current_tab = 0
	print("[screenshots] Loaded game_root.tscn with %d tabs" % _tabs.get_tab_count())


func _process(_delta: float) -> bool:
	_frame += 1

	match _phase:
		"init":
			if _frame >= FRAMES_INIT:
				_phase = "switching"
				_frame = 0

		"switching":
			if _tab_idx >= TAB_NAMES.size():
				_phase = "done"
				return true

			if _frame == 1:
				_tabs.current_tab = _tab_idx
				print("[screenshots] Switched to tab %d (%s)" % [_tab_idx, TAB_NAMES[_tab_idx]])

			if _frame >= FRAMES_PER_TAB:
				_phase = "capturing"
				_frame = 0

		"capturing":
			# Give one full frame after phase switch so the viewport texture is current.
			if _frame >= 2:
				_capture(TAB_NAMES[_tab_idx])
				_tab_idx += 1
				_phase = "switching"
				_frame = 0

		"done":
			print("[screenshots] All done.")
			quit(0)
			return true

	return false


func _capture(tab_name: String) -> void:
	var img: Image = get_root().get_viewport().get_texture().get_image()
	if img == null or img.is_empty():
		push_error("[screenshots] Viewport image is empty for tab: " + tab_name)
		return

	var path := _output_dir.path_join(tab_name + ".png")
	var err := img.save_png(path)
	if err == OK:
		print("[screenshots] Saved %s (%dx%d)" % [path, img.get_width(), img.get_height()])
	else:
		push_error("[screenshots] Failed to save %s (error %d)" % [path, err])
