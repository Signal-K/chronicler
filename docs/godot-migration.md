# Bee Garden Godot Migration (Attempt 3)

## What was migrated in this pass

- Added a Godot 4.5 project at `scene/`.
- Implemented a playable farm prototype in Godot with scene-first composition:
  - `scene/scenes/main.tscn` defines layout, toolbar, and six pre-instanced plot nodes.
  - `scene/scenes/plot.tscn` defines the plot visual structure.
  - No plot/game objects are spawned from script at runtime.
- Added hives gameplay slice in Godot:
  - `scene/scenes/hives.tscn` with three pre-instanced hive cards.
  - `scene/scenes/hive_card.tscn` reusable hive card scene.
  - `scene/scenes/game_root.tscn` root tab container switching between farm and hives.
- Added Godot scripts for functionality only:
  - `scene/scripts/game_screen.gd`
  - `scene/scripts/plot.gd`
  - `scene/scripts/hives_screen.gd`
  - `scene/scripts/hive_card.gd`
- Added shared Godot persistence singleton:
  - `scene/scripts/game_state.gd` (autoloaded as `GameState`)
  - Persists farm plots, selected crop, and hives to `user://bee_garden_save.json`
- Added persisted resource economy in Godot:
  - Coins, water/max-water, seeds, harvested totals
  - Bottled honey inventory and glass bottles
  - Farm actions now consume/award resources
  - Hive bottling now consumes glass bottles and awards coins
- Copied crop sprites into Godot-local paths under `scene/assets/sprites/crops/`.
- Added React-side host entrypoints:
  - `app/godot.tsx`
  - `components/godot/GodotHostView.tsx`
  - Home toolbar route cycle now includes a `godot` screen.

## Current gameplay parity in Godot prototype

- Till -> Plant -> Wait -> Water -> Harvest/Clear loop exists.
- Crop selection includes tomato, blueberry, lavender, sunflower.
- Six fixed plots match current React flow baseline.
- Hives tab supports simulated honey accumulation and bottling actions.
- Hives tab now includes scene-authored daily orders and fulfillment actions.

## How to run this prototype in Godot Editor

1. Open `scene/project.godot` in Godot 4.5.
2. Run the project.
3. Use tabs to switch between `Farm` and `Hives`.

## How this maps to React Native / web / Electron

- React Native native shells (`ios` and `android`) can embed Godot via `@borndotcom/react-native-godot` (same pattern as Signal-K template).
- Web/Next and Electron should host a Godot Web export (`.wasm` + JS loader) in a dedicated page/view.
- Shared game logic should continue to live in GDScript; React side should be treated as host shell + bridge.
- Current app route `/godot` and Home's `godot` screen are bridge entrypoints for this embedding.

## React Native bridge note

- `components/godot/GodotHostView.tsx` attempts to load `@borndotcom/react-native-godot` at runtime.
- If the package is not installed yet, the UI shows a fallback message instead of crashing.

## Export workflow in this repo

This repo already includes `export_godot.sh` for native pack exports. Use:

```bash
./export_godot.sh --target . --project ./scene --name BeeGarden --preset iOS --platform ios
./export_godot.sh --target . --project ./scene --name BeeGarden --preset Android --platform android
```

## Godot smoke test

- Run: `yarn run test:godot:smoke`
- Script: `scene/tests/smoke_test.gd`
- Current scope: validates core `GameState` resource and mutation behavior in headless mode.

## Important migration rule applied

This pass follows the requirement to define runtime-visible content in `.tscn` where possible. The six farm plots are authored directly in `main.tscn` as scene instances.

## Attempt 4 validation + exports

Validation rerun on 2026-02-25:

- `yarn lint` passed (warnings only, no errors).
- `yarn exec tsc --noEmit` passed.
- `yarn build` passed.
- `yarn run test:godot:smoke` passed.
- Godot import sanity passed:
  - `HOME=/tmp GODOT_USER_DIR=/tmp/godot /Applications/Godot4.5.app/Contents/MacOS/Godot --headless --path scene --import`

Exports rerun:

- iOS pack export passed:
  - Artifact: `/tmp/bee-garden-export-20260225-230047/ios/BeeGarden.pck`
- Android pack export passed:
  - Artifact root: `/tmp/bee-garden-export-20260225-230047/android/app/src/main/assets/BeeGarden`

Notes:

- Godot logs still show non-blocking environment warnings in this sandbox:
  - macOS cert warning (`ret != noErr`)
  - user data/editor settings write warnings outside writable roots
- Export artifacts are generated successfully despite these warnings.

## Attempt 5 gameplay slice

- Added persisted daily honey orders to `scene/scripts/game_state.gd`:
  - deterministic per-day order generation
  - order persistence (`honey_orders`, `orders_generated_on`)
  - fulfillment API consuming bottled honey and awarding coins
- Added scene-authored orders UI in `scene/scenes/hives.tscn`:
  - fixed three order rows (detail, reward, status, fulfill button)
  - no runtime-created UI nodes
- Updated `scene/scripts/hives_screen.gd`:
  - binds fulfill actions to order buttons
  - refreshes order state and date label
  - persists after fulfillment
- Extended `scene/tests/smoke_test.gd` to validate:
  - daily order generation
  - successful fulfillment
  - coin reward application and fulfilled status transitions

## Attempt 6 gameplay slice

- Added a scene-authored farm shop in `scene/scenes/main.tscn`:
  - fixed purchase buttons for tomato, blueberry, lavender, sunflower seeds, and glass bottles
  - no runtime-created shop UI nodes
- Updated `scene/scripts/game_screen.gd`:
  - wired shop purchase actions
  - enforces coin costs and updates seed/bottle resources
  - disables unaffordable shop buttons based on current coin count

## Attempt 7 progression slice

- Added Godot progression state in `scene/scripts/game_state.gd`:
  - level/XP formulas matching existing React progression curve
  - XP event APIs for harvest, pollination, classification, and sales
  - persisted progression metrics (harvest counts, unique harvests, sales, etc.)
- Wired XP gains into gameplay:
  - harvest XP via `scene/scripts/game_screen.gd`
  - sale XP on order fulfillment via `scene/scripts/game_state.gd`
- Added scene-authored Progress tab:
  - `scene/scenes/progress.tscn`
  - `scene/scripts/progress_screen.gd`
  - mounted under `scene/scenes/game_root.tscn`
- Extended smoke tests for progression behavior in `scene/tests/smoke_test.gd`.
- Added level display to Farm and Hives scene summaries for in-loop progression visibility.

## Attempt 8 tutorial slice

- Added scene-authored Farm tutorial overlay in `scene/scenes/main.tscn`:
  - onboarding card, hints, and next/skip controls
  - no runtime-generated tutorial UI nodes
- Added tutorial persistence in `scene/scripts/game_state.gd`:
  - `tutorial_completed`
  - `tutorial_step_index`
- Implemented tutorial state machine in `scene/scripts/game_screen.gd`:
  - progresses on real interactions (tool select + till/plant/water actions)
  - supports skip and completion persistence
- Extended smoke tests to validate tutorial state mutation in `scene/tests/smoke_test.gd`.

## Attempt 9 hive tutorial slice

- Added scene-authored Hive tutorial overlay in `scene/scenes/hives.tscn`:
  - onboarding card, hints, next/skip controls
  - no runtime-generated tutorial UI nodes
- Added Hive tutorial persistence in `scene/scripts/game_state.gd`:
  - `hive_tutorial_completed`
  - `hive_tutorial_step_index`
- Implemented tutorial progression in `scene/scripts/hives_screen.gd`:
  - progresses on real actions (`bottle-honey`, `fulfill-order`)
  - supports skip and completion persistence
- Extended smoke tests for Hive tutorial state mutations.

## Attempt 10 settings utilities slice

- Added scene-authored Settings tab:
  - `scene/scenes/settings.tscn`
  - `scene/scripts/settings_screen.gd`
  - mounted under `scene/scenes/game_root.tscn`
- Added migration utility actions in Godot settings:
  - add coins, refill water, add seeds, add glass bottles
  - reset farm tutorial and hive tutorial state
- Added live summary labels for key resources and tutorial status.

## Attempt 11 map expansion slice

- Added persistent map state in `scene/scripts/game_state.gd`:
  - unlocked maps and active map
  - unlock/select map APIs and growth-rate lookup
- Added scene-authored Expand tab:
  - `scene/scenes/expand.tscn`
  - `scene/scripts/expand_screen.gd`
  - mounted under `scene/scenes/game_root.tscn`
- Wired active-map effect into farm growth timing:
  - `scene/scripts/game_screen.gd` now reads map growth multiplier
  - Farm top bar now displays active map
- Extended smoke tests for map unlock/select behavior.

## Attempt 12 planets slice

- Added persisted planets state in `scene/scripts/game_state.gd`:
  - discovered planets list and next planet id
  - `discover_planet()` and catalog APIs
  - discovery currently awards classification XP
- Added scene-authored Planets tab:
  - `scene/scenes/planets.tscn`
  - `scene/scripts/planets_screen.gd`
  - mounted under `scene/scenes/game_root.tscn`
- Extended smoke tests for planet discovery and catalog behavior.

## Attempt 13 inventory slice

- Added scene-authored Inventory tab:
  - `scene/scenes/inventory.tscn`
  - `scene/scripts/inventory_screen.gd`
  - mounted under `scene/scenes/game_root.tscn`
- Inventory tab displays:
  - coins, bottled honey, glass bottles
  - per-crop seed counts
  - per-crop harvested totals
- Added periodic in-scene refresh timer for live inventory updates while running.
