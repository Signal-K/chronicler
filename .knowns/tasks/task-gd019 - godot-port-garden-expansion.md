---
id: gd019
title: "Godot port: garden expansion (unlock plot rows)"
status: done
priority: medium
labels:
  - godot
  - port
  - expansion
  - economy
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: garden expansion (unlock plot rows)

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the garden expansion mechanic into Godot. Players spend coins to unlock additional rows of plots. `expand_screen.gd` shows available upgrades and their costs; purchasing updates `game_state.gd` and `main.tscn` re-renders the grid. Mirrors `app/expand.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Add `unlocked_rows: int` (default 1) to `game_state.gd`
- Define expansion tiers: row 2 costs 50 coins, row 3 costs 150 coins, row 4 costs 400 coins (adjust to match RN values)
- `expand_screen.gd`: list locked rows with cost; "Buy" button calls `game_state.purchase_expansion(row)`
- `purchase_expansion(row)`: validate coins, deduct, increment `unlocked_rows`, emit `garden_expanded` signal
- `game_screen.gd` listens to `garden_expanded` and instantiates new `plot.tscn` nodes for the new row

## Source reference
- RN: `app/expand.tsx`, `hooks/useGameState.ts` (plot grid sizing)
- Godot: `scripts/expand_screen.gd`, `scripts/game_state.gd`, `scripts/game_screen.gd`
