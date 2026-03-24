---
id: gd022
title: "Godot port: pumpkin and potato crop configs + sprites"
status: done
priority: low
labels:
  - godot
  - port
  - assets
  - crops
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: pumpkin and potato crop configs + sprites

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Pumpkin and potato have sprite assets in the RN project (`assets/Sprites/Crops/Pumpkin/`, `assets/Sprites/Crops/Potato/`, `assets/Sprites/Crops/Tomato/`) but are not yet in `cropConfig.ts`. Import their sprites into Godot and add their crop config entries to the GDScript equivalent of `cropConfig`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Import pumpkin and potato growth-stage sprites to `res://assets/sprites/crops/`
- Add `pumpkin` and `potato` entries to the crop config dictionary in `game_state.gd` (or a dedicated `crop_config.gd` resource)
- Include nectar properties, harvest yield, and growth image paths consistent with existing crops
- Verify they appear in the shop and can be planted/harvested

## Source reference
- RN: `assets/Sprites/Crops/Pumpkin/`, `assets/Sprites/Crops/Potato/`, `assets/Sprites/Crops/Tomato/`
- Godot: `res://assets/sprites/crops/`, `scripts/game_state.gd`
