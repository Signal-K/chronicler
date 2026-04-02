extends Button

@onready var crop_sprite: TextureRect = $CropSprite
@onready var stage_label: Label = $StageLabel
@onready var status_label: Label = $StatusLabel

func _make_plot_style(bg: Color, border: Color) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = bg
	s.border_color = border
	s.border_width_left = 4
	s.border_width_top = 4
	s.border_width_right = 4
	s.border_width_bottom = 4
	s.corner_radius_top_left = 12
	s.corner_radius_top_right = 12
	s.corner_radius_bottom_right = 12
	s.corner_radius_bottom_left = 12
	return s

func set_plot_display(plot: Dictionary, crop_textures: Dictionary) -> void:
	var state: String = plot.get("state", "empty")
	var growth_stage: int = int(plot.get("growth_stage", 0))
	var crop_type: String = plot.get("crop_type", "")
	var needs_water: bool = bool(plot.get("needs_water", false))

	var bg_color: Color
	var border_color := Color("451a03")
	if state == "empty":
		bg_color = Color("a16207")
	elif state == "tilled":
		if plot.get("watered", false):
			bg_color = Color("2d1508")
			border_color = Color("0c0a09")
		else:
			bg_color = Color("92400e")
	elif growth_stage >= 5:
		bg_color = Color("78350f")
	else:
		bg_color = Color("92400e")

	var style := _make_plot_style(bg_color, border_color)
	var hover_style := _make_plot_style(bg_color.lightened(0.1), border_color)
	var pressed_style := _make_plot_style(bg_color.darkened(0.1), border_color)
	add_theme_stylebox_override("normal", style)
	add_theme_stylebox_override("hover", hover_style)
	add_theme_stylebox_override("pressed", pressed_style)
	add_theme_stylebox_override("focus", style)

	var label_color := Color("fde047") if growth_stage >= 5 else Color("fef9c3")
	stage_label.add_theme_color_override("font_color", label_color)
	status_label.add_theme_color_override("font_color", label_color)

	if state == "empty":
		crop_sprite.visible = false
		stage_label.text = "Empty"
		status_label.text = "Till"
		return

	if state == "tilled":
		crop_sprite.visible = false
		stage_label.text = "Tilled"
		status_label.text = "Plant"
		return

	crop_sprite.visible = true
	var texture_key := "wheat_seed"
	if growth_stage >= 5:
		texture_key = "%s_full" % crop_type
	elif growth_stage == 4:
		texture_key = "wheat_full"
	elif growth_stage == 3:
		texture_key = "wheat_mid"
	elif growth_stage == 2:
		texture_key = "wheat_sprout"

	crop_sprite.texture = crop_textures.get(texture_key, null)
	stage_label.text = "Stage %d" % growth_stage

	if growth_stage >= 5:
		status_label.text = "Harvest"
	elif needs_water:
		status_label.text = "Needs Water"
	else:
		status_label.text = "Growing"
