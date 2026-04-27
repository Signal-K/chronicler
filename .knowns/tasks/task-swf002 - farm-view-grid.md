---
id: swf002
title: "Farm view grid (core gameplay screen)"
status: todo
priority: high
labels:
  - swift
  - gameplay
  - farm
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# Farm view grid

## Description

The main game screen. A scrollable grid of plot tiles the player plants seeds into. Matches the Stitch "Farm View (Core)" design.

## Implementation Plan

1. `FarmView` — 3-column grid of `PlotTile` views inside the woodgrain panel
2. `PlotTile` — empty/planted/ready states, shows crop icon when planted
3. `PlotTile` tap → opens seed selection sheet (seeds from inventory)
4. Ready plots show a harvest indicator; tap to harvest adds to inventory
5. Floating bee sprite positioned in corner (static image for MVP)
6. Left sidebar card showing selected plot info / current action

## Acceptance Criteria

- [ ] Grid renders with correct tile count (3×4 visible, scrollable)
- [ ] Tapping empty tile opens seed selection
- [ ] Planting a seed updates tile state
- [ ] Harvesting a ready tile adds item to inventory and resets tile
- [ ] Visual matches Stitch screenshot

## Reference

- Stitch: `stitch-designs/farm-view-core.png`
- Godot reference: `reference/godot-scripts/plot.gd`, `game_state.gd`
