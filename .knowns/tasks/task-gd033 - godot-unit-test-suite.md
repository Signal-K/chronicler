---
id: gd033
title: "Godot: unit test suite"
status: done
priority: high
labels:
  - godot
  - testing
createdAt: '2026-04-06T00:00:00Z'
updatedAt: '2026-04-06T00:00:00Z'
timeSpent: 0
---

# Godot: unit test suite

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Unit tests for all core GameState mechanics. Runs headless via `unit_test.tscn` with the full autoload tree available (GameState, SaveManager). Covers plots, harvest, honey production, bottling, orders, XP/levelling, expansion, shop, water, classification, and pollination/hatching.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `tests/unit_test.gd` (Node scene script)
- Created `scenes/unit_test.tscn` to run it with autoloads
- Covers 50+ assertions across all game systems
- Exits with code 1 on any failure

## Source reference
- Godot: `tests/unit_test.gd`, `scenes/unit_test.tscn`
