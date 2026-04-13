---
id: gd035
title: "Godot: CI on GitHub Actions"
status: done
priority: high
labels:
  - godot
  - testing
  - ci
createdAt: '2026-04-06T00:00:00Z'
updatedAt: '2026-04-06T00:00:00Z'
timeSpent: 0
---

# Godot: CI on GitHub Actions

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GitHub Actions workflow that runs all three Godot test suites (smoke, unit, e2e) on every push and pull request. Smoke and unit tests run headless directly; e2e runs via the Docker image built from `docker/Dockerfile.e2e`.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `.github/workflows/godot-tests.yml`
- Smoke test: `godot --headless -s tests/smoke_test.gd`
- Unit test: `godot --headless --path scene res://scenes/unit_test.tscn`
- E2E test: Docker build + run of `docker/Dockerfile.e2e`
- Uploads e2e screenshots/report as artifacts on failure

## Source reference
- CI: `.github/workflows/godot-tests.yml`
- Docker: `docker/Dockerfile.e2e`
