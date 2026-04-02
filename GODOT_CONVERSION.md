# Godot Conversion Plan
**Goal:** Replace the React Native frontend entirely with the Godot game. Every meaningful feature of the RN app should either be replicated in Godot or explicitly documented as out-of-scope.

---

## Status Overview

| Screen / Feature | RN | Godot | Notes |
|---|---|---|---|
| Farm (till/plant/water/harvest) | ✅ | ✅ | Parity |
| Hives (honey production, bottling) | ✅ | ✅ | Parity |
| Honey type system | ✅ | ✅ | Implemented — crop→type mapping, typed inventory, typed orders |
| Order characters (NPC names/messages) | ✅ | ✅ | Implemented |
| Daily orders with honey type requirements | ✅ | ✅ | Implemented |
| XP / levelling | ✅ | ✅ | Parity |
| Plot page upgrades | ✅ | ✅ | Parity |
| Map / biome unlock system | ✅ | ✅ | Parity (5 biomes) |
| Active map growth rate modifier | ✅ | ✅ | Parity |
| Planet discovery & catalog | ✅ | ✅ | Rich cards with type colors and stats |
| Bee hatching from pollination | ⚠️ planned | ✅ | Godot-only feature |
| Cross-screen resource sync | ❌ | ✅ | Godot signal-based — RN uses AsyncStorage polling |
| Tutorial (farm + hive) | ✅ | ✅ | Parity |
| Settings (debug, speed, tutorial reset) | ✅ | ✅ | Parity |
| Inventory display | ✅ | ✅ | Parity |
| Progress / stats screen | ✅ | ✅ | Parity |
| **Authentication / accounts** | ✅ | ❌ | Out of scope for Godot MVP |
| **Cloud persistence (Supabase)** | ✅ | ❌ | Out of scope — Godot uses local JSON save |
| **Animated bees / harvest fx** | ✅ | ❌ | Not yet implemented |
| **Building placement** | ✅ | ❌ | Greenhouse, silo, water tank etc — not yet |
| **Experience details screen** | ✅ | ⚠️ | Folded into progress.tscn — adequate |
| **Help / searchable docs screen** | ✅ | ❌ | Not yet — Settings has debug only |
| **Dark mode / theme toggle** | ✅ | ❌ | Not needed for Godot |
| **Honey quality score** | ✅ | ❌ | RN shows quality 0–100 per bottle — not yet in Godot |
| **Daily quota per honey type** | ✅ | ❌ | RN reduces reward after 2 orders per type per day |

---

## What to Build Next (Priority Order)

### P1 — Core Loop Gaps
1. **Daily quota system for orders**: RN reduces order rewards by 50% after 2 fulfilled orders of the same honey type per day. Add `orders_fulfilled_today: Dictionary` to GameState, check in `fulfill_honey_order`, halve reward if over quota.

2. **Honey quality score**: When bottling, compute a quality 0–100 based on: bee count in hive, whether it's production hours, number of lavender/sunflower harvested. Display on the bottled honey entry and factor into order XP reward.

3. **Plot grid visual feedback**: Watered plots should show a distinct visual state (darkened soil). Currently the color change only happens via the StyleBoxFlat but there's no "water shimmer" indicator. Add a small 💧 label overlay on watered plots.

### P2 — Polish
4. **Harvest animation**: Flash the plot green/gold when a crop is harvested. Godot `Tween` can animate `modulate` on the plot button.

5. **Bee count visible on hive cards**: Already shown in `BeeCountLabel`, but should show a progress bar toward MAX_BEES_PER_HIVE (12) so the pollination→bee loop is visible.

6. **Help screen**: Add a `help.tscn` / `help_screen.gd` with expandable sections covering the game loop, honey types, biomes, and XP events.

### P3 — Features (Larger Work)
7. **Building placement system**: The RN app has Greenhouse, Silo, Water Tank, Minecart, Train Station, Track. These are drag-and-place structures on the farm view. In Godot this would require a separate placement mode in the farm screen with a structure grid overlaying the plot grid.

8. **Nests screen**: `app/nests.tsx` is just an alias for Hives. Already handled.

9. **Godot bridge**: `app/godot.tsx` embeds Godot via `GodotHostView` for native. Once the Godot game is feature-complete, the RN app can route all non-auth screens directly to the Godot scene, keeping RN only as the auth/account wrapper.

---

## Removing the React Native Frontend

When Godot reaches feature parity on core gameplay:

1. **Keep** `app/auth.tsx` and `components/settings/AccountSection.tsx` — these handle Supabase auth which Godot cannot replicate without a plugin.
2. **Keep** `app/godot.tsx` — this is the bridge that will host the Godot scene.
3. **Delete** everything else in `app/` except `_layout.tsx`, `auth.tsx`, `godot.tsx`, `index.tsx`.
4. **Delete** `components/garden/`, `components/hives/`, `components/inventory/`, `components/placeables/`, `components/screens/`, `components/sprites/`, `components/tutorial/`.
5. **Keep** `components/godot/GodotHostView.tsx` — the native bridge component.
6. Update `_layout.tsx` to route unauthenticated users to `auth.tsx` and authenticated users to `godot.tsx`.

This leaves the RN app as a thin auth shell that embeds the Godot game for all gameplay.

---

## Save Format Notes

Current Godot save: `user://bee_garden_save.json`, version 2.

Breaking changes made in this branch:
- Added `honey_type_inventory: Dictionary` — old saves with only `bottled_honey_inventory` are migrated to `{"wildflower": N}` automatically on first load.
- Orders now include `honey_type`, `character_name`, `character_emoji`, `character_message` — old orders without these fields default to `honey_type: "wildflower"` and generic character info.

Next save version bump needed when: plot state schema changes, or hive data model changes.
