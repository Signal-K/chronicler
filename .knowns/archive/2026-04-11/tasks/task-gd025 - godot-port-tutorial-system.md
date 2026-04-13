---
id: gd025
title: "Godot port: tutorial system"
status: done
priority: medium
labels:
  - godot
  - port
  - tutorial
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: tutorial system

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the tutorial progress tracking and UI logic into Godot. Mirrors `hooks/useTutorial.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `tutorial_manager.gd` (singleton)
- Methods: `mark_tutorial_shown()`, `mark_tutorial_completed()`, `reset_tutorial_state()`, `report_action(action)`
- Tracks `should_show_tutorial`, `has_completed_tutorial`
- Handle tutorial actions: `till-plot`, `plant-seed`, `water-plant`, `harvest-crop`, `open-shop`, `view-hives`, `tap-hive`, `bottle-honey`, `fulfill-order`
- Persist tutorial state (mirroring `TUTORIAL_COMPLETED_KEY`, etc.)
- Integrate tutorial UI hints in `main.tscn`

## Source reference
- RN: `hooks/useTutorial.ts`, `components/tutorial/`
- Godot: `scripts/tutorial_manager.gd`
