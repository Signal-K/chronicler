---
id: gd006
title: "Godot port: settings screen"
status: done
priority: low
labels:
  - godot
  - port
  - settings
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: settings screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the settings screen into Godot. `settings.tscn` exposes game configuration options. Mirrors `app/settings.tsx` and its section components.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `settings.tscn` (Control) with `settings_screen.gd`

## Source reference
- RN: `app/settings.tsx`, `components/settings/AppearanceSection.tsx`, `components/settings/DayNightOverrideSection.tsx`, `components/settings/GrowthAlgorithmSection.tsx`, `components/settings/DebugSection.tsx`
- Godot: `scenes/settings.tscn`, `scripts/settings_screen.gd`
