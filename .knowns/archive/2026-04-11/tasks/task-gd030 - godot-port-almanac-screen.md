---
id: gd030
title: "Godot port: almanac screen"
status: done
priority: medium
labels:
  - godot
  - port
  - progression
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: almanac screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create an Almanac screen in Godot to display the classification history and achievements. This follows the backend logic implemented in `gd027`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `almanac.tscn` (Control) with `almanac_screen.gd`
- Display classification history from `GameState.classification_history`
- Show stats: Total classifications, unique types found, etc.
- Integrate into the `progress.tscn` or as a separate tab in `game_root.tscn`

## Source reference
- RN: `lib/classificationTracking.ts` (data source)
- Godot: `scenes/almanac.tscn`, `scripts/almanac_screen.gd`
