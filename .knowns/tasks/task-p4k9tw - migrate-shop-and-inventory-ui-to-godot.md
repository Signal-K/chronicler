---
id: p4k9tw
title: "Migrate shop and inventory UI to Godot"
status: todo
priority: high
labels:
  - godot
  - economy
  - inventory
createdAt: '2026-02-25T23:05:00Z'
updatedAt: '2026-02-25T23:05:00Z'
timeSpent: 0
---

# Migrate shop and inventory UI to Godot

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port inventory tabs and shop purchase flows from React (`Shop`, `InventoryTabs`, `SeedsTab`, `CropsTab`, `InventoryExtras`) into scene-authored Godot UI.

Acceptance criteria:
- Godot has inventory tabs for seeds/crops/items/honey with persisted counts.
- Shop supports seed and bottle purchases with coin checks and persistence.
- Visible inventory/shop nodes are authored in `.tscn` files.
<!-- SECTION:DESCRIPTION:END -->
