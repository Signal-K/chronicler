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
| **Help / searchable docs screen** | ✅ | ✅ | help.tscn + help_screen.gd with 7 sections covering all mechanics |
| **Dark mode / theme toggle** | ✅ | ❌ | Not needed for Godot |
| **Honey quality score** | ✅ | ✅ | Quality 0–100 computed from bee count, hours, crop diversity; shown on bottle |
| **Daily quota per honey type** | ✅ | ✅ | orders_fulfilled_today: Dictionary; rewards halve after 2 of same type |

---

## What to Build Next (Priority Order)

### P1 — Core Loop Gaps ✅ DONE
- ~~Daily quota system for orders~~ — implemented (`orders_fulfilled_today`, halved rewards after 2 per type)
- ~~Honey quality score~~ — implemented (0–100 from bee count + production hours + crop diversity)
- ~~Plot grid visual feedback~~ — implemented (💧 label on watered plots, gold border on harvest-ready)
- ~~Harvest animation~~ — implemented (Tween gold flash on harvest, blue on water)
- ~~Bee count progress bar on hive cards~~ — implemented (BeeProgressBar in hive_card.tscn)
- ~~Help screen~~ — implemented (help.tscn + help_screen.gd, 7 sections, added to game_root.tscn)
- ~~Cross-screen resource sync~~ — all screens connect `GameState.resources_changed`

### P2 — Polish ✅ DONE
- ~~Bee hatching loop~~ — implemented (`POLLINATION_PER_BEE=3`, `_check_bee_hatching()`, `bee_hatched` signal)
- ~~Honey type → order pipeline~~ — full chain: crop harvest → dominant type → order fulfillment
- ~~Planet type colors and stat cards~~ — dark navy theme, per-type color panels, life badge
- ~~Warm amber UI theme~~ — UIFwk constants, styled panels/buttons across all screens

### P3 — Remaining Work
1. **Building placement system**: The RN app has Greenhouse, Silo, Water Tank, Minecart, Train Station, Track. These are drag-and-place structures on the farm view. In Godot this would require a separate placement mode in the farm screen with a structure grid overlaying the plot grid. **Large scope — not started.**

2. **Plot upgrade immediate expansion**: Buying a plot page upgrade waits up to 1s for the growth timer tick before the grid expands. Should call `_check_plot_grid_expansion()` directly from `progress_screen.gd` after purchase, or emit a dedicated signal.

3. **Nests screen**: `app/nests.tsx` is just an alias for Hives. Already handled.

4. **Godot bridge**: `app/godot.tsx` embeds Godot via `GodotHostView` for native. Once the Godot game is feature-complete, the RN app can route all non-auth screens directly to the Godot scene, keeping RN only as the auth/account wrapper.

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
