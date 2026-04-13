---
id: gd005
title: "Godot port: progress screen"
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

# Godot port: progress screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the player progression/XP screen into Godot. `progress.tscn` displays level, XP bar, and progression milestones. Mirrors `app/experience.tsx` and the experience system.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `progress.tscn` (Control) with `progress_screen.gd`
- XP and level data sourced from `game_state.gd`

## Source reference
- RN: `app/experience.tsx`, `app/screens/experience/index.tsx`, `lib/experienceSystem.ts`, `hooks/usePlayerExperience.ts`, `components/ui/ExperienceBar.tsx`
- Godot: `scenes/progress.tscn`, `scripts/progress_screen.gd`
