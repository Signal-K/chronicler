---
id: swf005
title: "Migros market screen"
status: todo
priority: high
labels:
  - swift
  - economy
  - market
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# Migros market screen

## Description

The Shop tab. Players sell harvested crops and honey for gold. Shows quantity in inventory, price per unit, and Sell / Sell All actions.

## Implementation Plan

1. `MarketView` — 2-column grid of `MarketItemCard` views
2. `MarketItemCard` — icon, quantity badge, item name, gold price, SELL button
3. SELL ALL button at bottom sells all sellable inventory
4. Selling updates gold balance and removes items from inventory
5. MVP items: Wheat, Honey, Carrots, Berries

## Acceptance Criteria

- [ ] All inventory items with quantity > 0 appear
- [ ] SELL button sells one unit and updates gold
- [ ] SELL ALL sells full stock
- [ ] Gold counter in header updates immediately
- [ ] Visual matches Stitch screenshot

## Reference

- Stitch: `stitch-designs/migros-market.png`
- Godot reference: `reference/godot-scripts/shop_screen.gd`
