---
id: swf003
title: "Seed pouch / planting screen"
status: todo
priority: high
labels:
  - swift
  - gameplay
  - seeds
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# Seed pouch / planting screen

## Description

The Seeds tab (and sheet used from the farm view). Shows available seeds with type badge (Sweet/Hard), grow time, and lets the player select one to plant.

## Implementation Plan

1. `SeedPouchView` — 2-column grid of `SeedCard` views
2. `SeedCard` — icon, name, Sweet/Hard badge, grow time
3. Tapping a seed (when triggered from farm plot) plants it and dismisses
4. Tapping a seed from the Seeds tab shows seed detail (grow time, pollen type, value)
5. Seed data model: `Seed(id, name, icon, pollenType, growDuration, value)`

## Acceptance Criteria

- [ ] All 4 MVP seeds display (Lavender, Sunflower, Poppy, Clover)
- [ ] Sweet/Hard badge renders correctly
- [ ] Selecting from farm context plants the seed
- [ ] Visual matches Stitch screenshot

## Reference

- Stitch: `stitch-designs/planting-pollen-selection.png`
