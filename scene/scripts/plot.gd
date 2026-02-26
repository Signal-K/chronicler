extends Button

@onready var crop_sprite: TextureRect = $CropSprite
@onready var stage_label: Label = $StageLabel
@onready var status_label: Label = $StatusLabel

func set_plot_display(plot: Dictionary, crop_textures: Dictionary) -> void:
	var state: String = plot.get("state", "empty")
	var growth_stage: int = int(plot.get("growth_stage", 0))
	var crop_type: String = plot.get("crop_type", "")
	var needs_water: bool = bool(plot.get("needs_water", false))

	var base_color := Color("8b5a2b")
	if state == "empty":
		base_color = Color("a16207")
	elif state == "tilled":
		base_color = Color("92400e")
	elif growth_stage >= 5:
		base_color = Color("78350f")
	else:
		base_color = Color("92400e")

	# Keep crop sprites vivid by tinting only this button, not child nodes.
	self_modulate = base_color

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
