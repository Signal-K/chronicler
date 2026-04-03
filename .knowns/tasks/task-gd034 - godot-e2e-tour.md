---
id: gd034
title: "Godot: e2e tour"
status: done
priority: high
labels:
  - godot
  - testing
  - e2e
createdAt: '2026-04-06T00:00:00Z'
updatedAt: '2026-04-06T00:00:00Z'
timeSpent: 0
---

# Godot: e2e tour

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
End-to-end tour that drives the game like a first-time user — tilling, planting, harvesting, bottling, fulfilling orders, buying from the shop, and navigating all screens. Screenshots every action, writes a failure report if anything goes wrong, then cleans up. Runs via Docker with Xvfb for display support.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `tests/e2e_tour.gd` (Node scene script)
- Created `scenes/e2e_tour.tscn`
- Created `docker/Dockerfile.e2e` and `docker/e2e-entrypoint.sh`
- Uses Xvfb so `get_viewport().get_texture()` works for screenshots
- Exits with code 1 and emits a markdown report on failure

## Source reference
- Godot: `tests/e2e_tour.gd`, `scenes/e2e_tour.tscn`
- Docker: `docker/Dockerfile.e2e`, `docker/e2e-entrypoint.sh`
