---
id: gd017
title: "Godot port: crop growth timer"
status: done
priority: high
labels:
  - godot
  - port
  - crops
  - garden
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: crop growth timer

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the crop growth progression into Godot. Each planted plot advances through growth stages (seeded → sprout → mid → harvestable) over time. Growth rate is configurable (normal vs fast/debug). Mirrors `usePlotActions.ts` growth logic and `GrowthAlgorithmSection.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Each plot entry in `game_state.gd` stores: `{ crop_id, stage: int (0–3), planted_at: float, growth_duration: float }`
- `_process(delta)`: advance `stage` when `Time.get_unix_time_from_system() - planted_at >= growth_duration * stage_fraction`
- Growth durations from `cropConfig` equivalents (hardcode or resource file); support a `fast_growth` debug flag that reduces duration to 5s per stage
- When stage reaches 3, mark plot as `harvestable`; emit `plot_ready(plot_index)` signal
- `plot.gd` listens to signal and updates sprite to the harvestable image

## Source reference
- RN: `hooks/usePlotActions.ts`, `lib/cropConfig.ts`, `components/settings/GrowthAlgorithmSection.tsx`
- Godot: `scripts/game_state.gd`, `scripts/plot.gd`
