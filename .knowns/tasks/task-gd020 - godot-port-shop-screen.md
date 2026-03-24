---
id: gd020
title: "Godot port: shop screen"
status: done
priority: medium
labels:
  - godot
  - port
  - shop
  - economy
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: shop screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the shop screen into Godot. Players spend coins to buy seeds. Mirrors `app/screens/shop.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `scenes/shop.tscn` (Control) with `scripts/shop_screen.gd`
- List purchasable seeds with name, emoji, cost, and current inventory count
- "Buy" button calls `game_state.buy_seed(crop_id, quantity)`: deduct coins, add to `inventory.seeds`
- Add shop as a navigable screen from `game_root.tscn` tab bar
- Disable buy button when insufficient coins

## Source reference
- RN: `app/screens/shop.tsx`, `components/ui/ShopIcons.tsx`
- Godot: `scenes/shop.tscn`, `scripts/shop_screen.gd`, `scripts/game_state.gd`
