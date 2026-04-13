---
id: gd026
title: "Godot port: hovering bees system"
status: done
priority: medium
labels:
  - godot
  - port
  - bees
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: hovering bees system

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the "hovering bees" visual system into Godot. Bees should spawn near planted crops during the day and hover around them. Mirrors `hooks/useHoveringBees.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Implement `bee_spawner.gd` or similar in `main.tscn`
- Spawns bee sprites that "hover" near growing plots
- Only spawn if it's daytime (`is_daytime` from `day_night_cycle.gd`)
- Only spawn near plots with `growth_stage >= 1`
- Mirroring logic: Max 2 hives spawn bees for hovering
- Bee identities (A1, B1, etc.) can be persisted or generated

## Source reference
- RN: `hooks/useHoveringBees.ts`, `components/sprites/BeeSprite.tsx`
- Godot: `scripts/bee_spawner.gd` (or integrated into `garden_grid.gd`)
- Asset: `res://assets/Sprites/Bee.png`
