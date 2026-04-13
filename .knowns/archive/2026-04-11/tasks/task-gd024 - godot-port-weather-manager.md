---
id: gd024
title: "Godot port: weather manager"
status: done
priority: medium
labels:
  - godot
  - port
  - weather
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: weather manager

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the weather system into Godot. Specifically, managing whether it's currently raining, which affects the water system's refill rate.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `weather_manager.gd` (or integrate into `game_state.gd`)
- Tracks `is_raining` (boolean)
- Potentially integrate with a simple weather cycle or external API if the RN version does (check `hooks/useWaterSystem.ts`)
- Update rain state based on time or random chance
- Trigger visual effects (e.g., rain particles) in `main.tscn` when raining

## Source reference
- RN: `hooks/useWaterSystem.ts` (references `isRaining`)
- Godot: `scripts/weather_manager.gd`
