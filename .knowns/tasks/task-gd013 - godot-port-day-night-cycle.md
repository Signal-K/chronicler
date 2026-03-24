---
id: gd013
title: "Godot port: day/night cycle"
status: done
priority: medium
labels:
  - godot
  - port
  - time
  - visuals
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: day/night cycle

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the day/night cycle into Godot. Tracks current hour and derives `time_of_day` (dawn/day/dusk/night) and `is_daytime`. Drives honey production windows and visual tinting. Mirrors `useDayNightCycle.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Add `time_of_day: String` and `is_daytime: bool` to `game_state.gd`
- Update state every 60s via a `Timer` node
- Implement `get_time_of_day(hour)` → `"dawn" | "day" | "dusk" | "night"` (dawn 5–7, day 7–18, dusk 18–20, night otherwise)
- Respect `force_daytime` setting flag (from settings screen / saved config)
- Emit `time_changed` signal when `time_of_day` transitions
- In `main.tscn`, modulate background `CanvasModulate` colour based on `time_of_day`

## Source reference
- RN: `hooks/useDayNightCycle.ts`, `components/settings/DayNightOverrideSection.tsx`
- Godot: `scripts/game_state.gd`, `scenes/main.tscn`
