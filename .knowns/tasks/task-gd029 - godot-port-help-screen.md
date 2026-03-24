---
id: gd029
title: "Godot port: help screen"
status: done
priority: low
labels:
  - godot
  - port
  - ui
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: help screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the help and guide screen into Godot. This screen provides detailed information about game mechanics, controls, bees, honey, and more. Mirrors `app/help.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `help.tscn` (Control) with `help_screen.gd`
- Implement an expandable section UI (accordion)
- Content should include all sections from `HELP_SECTIONS` in `app/help.tsx`: Basics, Navigation, Bees, Honey, Crops, Experience, Shop, Day/Night, Tips.
- Add a back button to return to the previous screen (via `game_root.gd`)

## Source reference
- RN: `app/help.tsx`
- Godot: `scenes/help.tscn`, `scripts/help_screen.gd`
