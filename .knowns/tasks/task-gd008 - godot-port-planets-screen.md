---
id: gd008
title: "Godot port: planets screen"
status: done
priority: medium
labels:
  - godot
  - port
  - planets
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: planets screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the planets/map selection screen into Godot. `planets.tscn` displays available planets/zones the player can navigate to. Mirrors `app/planets.tsx` and `hooks/usePlanets.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `planets.tscn` (Control) with `planets_screen.gd`
- Planet data sourced from `game_state.gd`

## Source reference
- RN: `app/planets.tsx`, `hooks/usePlanets.ts`, `components/PlanetIcon.tsx`
- Godot: `scenes/planets.tscn`, `scripts/planets_screen.gd`
