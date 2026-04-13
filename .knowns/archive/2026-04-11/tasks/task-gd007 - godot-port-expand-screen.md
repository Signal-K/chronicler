---
id: gd007
title: "Godot port: expand screen"
status: done
priority: medium
labels:
  - godot
  - port
  - expansion
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: expand screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the garden expansion/upgrade screen into Godot. `expand.tscn` lets players unlock additional plot rows or features. Mirrors `app/expand.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `expand.tscn` (Control) with `expand_screen.gd`
- Expansion state read/written via `game_state.gd`

## Source reference
- RN: `app/expand.tsx`
- Godot: `scenes/expand.tscn`, `scripts/expand_screen.gd`
