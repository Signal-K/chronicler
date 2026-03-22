---
id: gd004
title: "Godot port: inventory screen"
status: done
priority: medium
labels:
  - godot
  - port
  - inventory
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: inventory screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the inventory screen into Godot. `inventory.tscn` displays the player's crops, seeds, and honey. Mirrors `app/Inventory.tsx` and `components/inventory/inventory.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `inventory.tscn` (Control) with `inventory_screen.gd`
- Inventory data sourced from `game_state.gd`

## Source reference
- RN: `app/Inventory.tsx`, `components/inventory/inventory.tsx`, `components/inventory/CropsTab.tsx`, `components/inventory/SeedsTab.tsx`
- Godot: `scenes/inventory.tscn`, `scripts/inventory_screen.gd`
