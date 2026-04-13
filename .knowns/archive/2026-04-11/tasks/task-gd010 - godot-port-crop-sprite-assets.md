---
id: gd010
title: "Godot port: crop sprite assets imported"
status: done
priority: medium
labels:
  - godot
  - port
  - assets
  - crops
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: crop sprite assets imported

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Imported crop sprite assets from the React Native project into the Godot scene project. All imported and compiled as `CompressedTexture2D` resources.
<!-- SECTION:DESCRIPTION:END -->

## What was done

Imported to `res://assets/sprites/crops/`:
- `wheat_seed.png`
- `wheat_sprout.png`
- `wheat_mid.png`
- `wheat_full.png`
- `tomato_full.png`
- `blueberry_full.png`
- `lavender_full.png`
- `sunflower_full.png`

## Source reference
- RN: `assets/Sprites/Crops/`, `lib/cropConfig.ts`
- Godot: `assets/sprites/crops/`, `.godot/imported/`
