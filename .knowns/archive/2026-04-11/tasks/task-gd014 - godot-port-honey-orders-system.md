---
id: gd014
title: "Godot port: honey orders system"
status: done
priority: high
labels:
  - godot
  - port
  - orders
  - economy
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: honey orders system

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the daily honey orders system into Godot. Generates 3 orders per day, each requesting a honey type and quantity. Fulfilling orders earns coins and XP. Orders refresh daily. Quota reduction applies after 2 fulfilled orders of the same type (50% coin reduction). Mirrors `useHoneyOrders.ts` and `types/honeyOrders.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Add `orders: Array` to `game_state.gd` — each entry: `{ id, honey_type, quantity, coins, xp, character_name, message, fulfilled }`
- `refresh_orders_if_needed()`: compare saved date to today; regenerate 3 orders if stale
- `generate_order(honey_type?)`: random character + message, random honey type if not forced, quantity 1–5, coins/xp from `HONEY_TYPE_CONFIG`
- `fulfill_order(order_id)`: check inventory, deduct bottles, award coins+XP, apply 50% reduction if quota exceeded for that type
- Persist orders + last-refresh date via `ConfigFile` (replaces AsyncStorage)
- Wire `orders_panel` in `hives.tscn` to display and fulfill orders (mirrors `OrdersPanel.tsx`)

## Source reference
- RN: `hooks/useHoneyOrders.ts`, `types/honeyOrders.ts`, `components/hives/OrdersPanel.tsx`
- Godot: `scripts/game_state.gd`, `scenes/hives.tscn`, `scripts/hives_screen.gd`
