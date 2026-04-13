# Bumble MVP Audit

Date: 2026-04-11
Primary target assessed: Godot port in `scene/`
Required delivery target: installed PWA

## Executive read

The project is beyond prototype stage, but it is not yet at MVP. The core farming loop, hives, inventory, expansion, progression, and orders all exist in some form. The biggest gap is not raw feature count. The gap is product discipline plus deployment readiness.

Right now the game exposes too many surfaces with uneven readiness. The garden and hives loop is the only part that feels close to MVP. Several other screens feel placeholder-heavy, over-scoped, or misaligned with the stated Bumble v0 brief. In addition, the repo does not currently show a Godot web export/PWA pipeline, which is now a hard MVP requirement.

## MVP judgement

Current MVP readiness: `not ready`

Estimated readiness by area:

| Area | Rating | Notes |
| --- | --- | --- |
| Core loop completeness | 7/10 | Till, plant, water, harvest, honey, orders, expansion, and progression are present. |
| UX clarity | 5/10 | The player can act, but the why and what-next signals are weak. |
| Visual consistency | 4/10 | Screens vary between functional, placeholder, and more polished surfaces. |
| Navigation consistency | 5/10 | Navigation exists, but the information architecture is too broad for MVP. |
| Responsiveness | 7/10 | The current implementation is light enough to feel mechanically responsive. |
| Feedback quality | 5/10 | Toasts and state changes exist, but they are inconsistent and sometimes too raw. |
| Onboarding/help | 5/10 | Help exists, but the product still relies on the player understanding too much from labels alone. |
| Auth and backup readiness | 3/10 | Required for MVP by scope, but the Godot flow is still incomplete. |
| PWA delivery readiness | 2/10 | The repo currently shows Expo web export, not a verified Godot web/PWA export path. |
| Performance confidence | 5/10 | Build and lint pass cleanly for Expo web, but the required Godot PWA runtime was not validated. |

## What is required for MVP

The MVP should be narrowed to one coherent loop:

1. Garden screen: till, plant, water, harvest, and crop state clarity.
2. Hives screen: bee count, honey accumulation, bottle-ready state, and build-hive CTA clarity.
3. Orders: simple, readable reasons to produce and bottle honey.
4. Inventory: clear counts for seeds, crops, honey, and bottles.
5. Progress: level, XP, and pollination explained in plain terms.
6. Save/load: local persistence must feel dependable.
7. Auth and backup: account, restore, and ecosystem integration must work because they are in MVP scope.
8. Help/settings: one practical manual-style help route and only essential toggles.
9. Godot web export: the Godot build must actually ship as an installable PWA.

Everything else should either be hidden, explicitly marked future-facing, or removed from the main navigation for MVP:

- `planets`
- `almanac`
- non-essential side surfaces that do not improve the main loop

Citizen science remains conditionally in scope for MVP, but only if:

- it is visually consistent with the rest of the game
- the value to the player is explained clearly
- the flow does not feel like a disconnected mini-app

## Current UX findings

### What already works

- The game has a real playable structure, not just a mock flow.
- The Godot port centralizes state in `scene/scripts/game_state.gd`, which is good for MVP convergence.
- Navigation and scene loading are already established in `scene/scripts/game_root.gd`.
- Orders, inventory, expansion, and progress are all represented instead of being empty promises.
- The game already has discrete screens for discover/classification if the citizen-science flow is retained.

### What currently hurts the product

- The game exposes too many tabs and side features relative to the strength of the core loop.
- Placeholder or low-fidelity screens weaken confidence, especially `planets`, `discover`, `classification`, and some help/settings surfaces.
- Copy is inconsistent with the v0 brief in a few places and still reads more like prototype copy than product copy.
- UI hierarchy is often list-first instead of decision-first. Important actions are present, but not always legible.
- The product identity is split between cosy farm, bee classification, and wider ecosystem concepts. MVP needs one dominant promise.
- Required MVP auth and ecosystem backup are not yet visibly production-ready in the Godot path.
- The packaging story for Godot-to-PWA is not yet represented in the repository.

## Consistency audit

Consistency is the weakest area.

- `scene/scripts/game_screen.gd` is direct and loop-focused, but uses raw toast text and a utilitarian layout.
- `scene/scripts/hives_screen.gd` and `scene/scripts/orders_panel.gd` are functional, but still look like generated panels rather than product surfaces.
- `scene/scripts/planets_screen.gd` is openly placeholder content.
- `scene/scripts/discover_screen.gd` and `scene/scripts/classification_screen.gd` are functional but currently too bare to call MVP-ready without a UI pass.
- `scene/scripts/help_screen.gd` is long-form and inconsistent with the newer manual-style content defaults.
- `scene/scripts/settings_screen.gd` is minimal and functional, but not yet a designed settings surface.

## Responsiveness audit

Responsiveness appears acceptable for MVP from code and build signal.

- Godot screens are simple scene swaps with lightweight animation.
- Expo web builds into a single 2.62 MB entry bundle, which is reasonable but not especially lean for a small game.
- No runtime profiler trace was collected in this pass.

## Performance and PWA simulation result

Installed-PWA-in-container result:

- Skipped by instruction because the setup cost would likely exceed the 500 MB limit.
- A real installed-PWA simulation would require a browser-capable container, not just the existing Node or Godot containers.
- Local evidence supports skipping:
  - `node_modules` alone is `498 MB`
  - existing browser-related images on this machine are already `894 MB` and `4.09 GB`
  - existing `bee-garden-e2e` images are `429 MB` to `452 MB`, but they are Godot runtime images, not browser-installed PWA containers

Additional packaging finding:

- The repo currently includes Expo web export for the React app, but I did not find a checked-in `export_presets.cfg` or other verified Godot web export configuration.
- `export_godot.sh` currently targets `ios` and `android` pack export, not web.

Because of that, there is no honest installed-PWA UX rating from a containerized run in this pass, and the Godot web export path should be treated as missing MVP work.

## Provisional product ratings

| Dimension | Rating | Why |
| --- | --- | --- |
| UX | 5/10 | Playable, but too many weak surfaces dilute the core loop. |
| Consistency | 4/10 | Theme, copy, and surface fidelity are uneven. |
| Responsiveness | 7/10 | Interactions should feel fast enough in the current architecture. |
| MVP focus | 5/10 | Scope is clearer after clarification, but the repo does not yet match that scope. |
| Release confidence | 4/10 | The product can get there, but auth and Godot-to-PWA delivery are still unresolved. |

## Design elements needed before MVP

- Unified top header treatment for water, coins, level, and time-of-day status.
- Stronger tool/primary-action bar for the garden loop.
- A clearer plot state system for empty, tilled, planted, growing, and ready-to-harvest states.
- Designed hive cards with clearer capacity, honey readiness, and bottling actions.
- Designed order cards with stronger reward readability and completion state.
- Designed inventory rows or cards instead of plain label lists.
- A clearer progress panel for level, XP, pollination, and unlock expectations.
- Empty-state and locked-state components for inventory, orders, expansion, and deferred screens.
- A proper help/manual screen using the newer copy defaults instead of prototype FAQ text.
- A tighter tab/navigation model that removes or hides non-MVP destinations.
- A designed auth/backup entry surface and clear connected/disconnected account states.
- A designed citizen-science entry and completion flow if that feature remains visible in MVP.

## Recommended MVP cut

Ship:

- Garden
- Hives
- Inventory
- Progress
- Shop
- Expand
- Settings
- Help
- Auth and backup
- Citizen science, but only after UI cohesion and player value are made clear

Hide for MVP:

- Planets
- Almanac
