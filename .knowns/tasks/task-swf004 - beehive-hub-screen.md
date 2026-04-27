---
id: swf004
title: "Beehive hub screen"
status: todo
priority: high
labels:
  - swift
  - gameplay
  - hives
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# Beehive hub screen

## Description

The Hives tab. Shows hive status (population, rainwater, production %), a production progress bar, and the Harvest Honey action.

## Implementation Plan

1. `HivesView` — list/pager of `HiveCard` views (MVP: 1 hive)
2. `HiveCard` — status badge (Active/Inactive), population %, rainwater units, production % with progress bar
3. Harvest Honey button — collects honey to inventory based on production %, resets production
4. Hive data model: `Hive(id, name, population, rainwater, production, isActive)`
5. Production ticks up over real time (simple Timer, 1% per minute for MVP)

## Acceptance Criteria

- [ ] Hive #1 renders with correct stats
- [ ] Production bar fills over time
- [ ] Harvest Honey adds honey to inventory and resets bar
- [ ] Visual matches Stitch screenshot

## Reference

- Stitch: `stitch-designs/beehive-hub.png`
- Godot reference: `reference/godot-scripts/hives_screen.gd`, `hive_card.gd`
