---
id: gd021
title: "Godot port: tileset and terrain sprites"
status: blocked
priority: medium
labels:
  - godot
  - port
  - assets
  - tileset
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: tileset and terrain sprites

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Import the terrain sprite assets (grass, sand, water, bush) into the Godot project and set up a `TileSet` resource for use in the garden background. Assets are already sliced into individual tiles. Mirrors the tileset assets in `assets/Sprites/`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Import to `res://assets/sprites/terrain/`: `Grass/`, `Sand/`, `Water/`, `Bush/`, `Garden-TileSet.png`
- Create `resources/garden_tileset.tres` (`TileSet`) with terrain layers for grass, sand, water, bush
- Add a `TileMapLayer` node to `main.tscn` using `garden_tileset.tres` as the background
- Paint a default garden layout (grass field with a border)

## Blocker

TileSet resources (`.tres`) and TileMapLayer paint data must be authored in the Godot editor — they cannot be generated as plain text files. This ticket requires opening the project in Godot 4.5, importing the terrain PNGs, and painting the tilemap manually.
- RN: `assets/Sprites/Grass/`, `assets/Sprites/Sand/`, `assets/Sprites/Water/`, `assets/Sprites/Bush/`, `assets/Sprites/Garden-TileSet.png`
- Godot: `res://assets/sprites/terrain/`, `res://resources/garden_tileset.tres`, `scenes/main.tscn`
