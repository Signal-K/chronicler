---
id: gd018
title: "Godot port: experience and levelling system"
status: done
priority: medium
labels:
  - godot
  - port
  - progression
  - xp
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: experience and levelling system

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the XP and levelling system into `game_state.gd`. XP is earned from harvesting, fulfilling orders, and bee hatching. Level thresholds follow the curve defined in `experienceSystem.ts`. Mirrors `lib/experienceSystem.ts` and `hooks/usePlayerExperience.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Add `xp: int`, `level: int`, `coins: int` to `game_state.gd`
- Port `get_xp_for_level(level)` threshold formula
- `add_xp(amount)`: add XP, check for level-up, emit `level_up(new_level)` signal
- `add_coins(amount)` / `spend_coins(amount) -> bool`
- `progress_screen.gd` reads `xp`, `level`, and next-level threshold to render the XP bar
- Show level-up toast in garden screen on `level_up` signal

## Source reference
- RN: `lib/experienceSystem.ts`, `hooks/usePlayerExperience.ts`, `components/ui/ExperienceBar.tsx`
- Godot: `scripts/game_state.gd`, `scripts/progress_screen.gd`, `scenes/progress.tscn`
