---
id: gd002
title: "Godot port: main garden screen with plot grid"
status: done
priority: high
labels:
  - godot
  - port
  - garden
  - crops
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: main garden screen with plot grid

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the main garden view into Godot. `main.tscn` renders the garden grid of plots and handles the core farming interaction loop. Each plot is an instanced `plot.tscn` scene. Mirrors `HomeView.tsx`, `HomeContent.tsx`, `GardenGrid.tsx`, and `SimplePlot.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `main.tscn` (Control) with `game_screen.gd`
- Created `plot.tscn` (Button) with `plot.gd` — handles plant/harvest interactions per plot
- Imported crop sprites: `wheat_seed`, `wheat_sprout`, `wheat_mid`, `wheat_full`, `tomato_full`, `blueberry_full`, `lavender_full`, `sunflower_full`
- Plot state (empty, seeded, growing, harvestable) driven from `game_state.gd`

## Source reference
- RN: `components/screens/HomeView.tsx`, `components/screens/HomeContent.tsx`, `components/garden/GardenGrid.tsx`, `components/placeables/SimplePlot.tsx`, `hooks/usePlotActions.ts`
- Godot: `scenes/main.tscn`, `scenes/plot.tscn`, `scripts/game_screen.gd`, `scripts/plot.gd`
