# Bumble v0 Agent Brief

## Purpose

Ship the next two weeks of Bumble progress through coding agents without waiting on new founder design passes. When a design decision is small, reversible, and does not change product scope, agents should use this brief as the default.

## Product Frame

- Bumble is a cosy, casual, bee-centred farming game.
- The near-term loop is: till, plant, water, harvest, attract bees, bottle honey, fulfil orders, expand.
- The current execution surface is the Godot port, with the React Native app acting as parity and reference material.
- The main value of the product right now is the bee-and-honey identity, not a broader universe reveal.

## Long-Term Ambition, Short Version

- Alternate farm sites and biome-like variation are real future directions.
- Citizen-science and ecosystem links are part of the long-term identity.
- The wider Star Sailors crossover still exists in the background.
- Simple buildings and upgrade structures are in scope over time.

## What Stays Hidden In v0

- Do not surface planets, world-hopping, or wider Star Sailors lore in normal player-facing UX.
- Do not write copy that promises deep NPC stories, long narrative arcs, or elaborate factions.
- Do not introduce honey quality tiers, rarity ladders, or heavy economy simulation.
- Do not require bespoke art or layout exploration when an existing screen, panel, or card can absorb the feature.

## Product Guardrails

- Use `Bumble` as the player-facing product name by default.
- Treat `Star Sailors: Bumble` as brand or store context only.
- NPCs are flavour names, not character-driven dialogue systems.
- Bee hatch moments should feel nice, but small.
- Levelling is a progress signal, not a celebration scene.
- Buildings should be practical and legible before they are decorative.
- Prefer one clear garden over premature feature sprawl.

## Copy And Syntax Defaults

- Use sentence case.
- Keep button labels to one to three words.
- Keep toast copy short and literal.
- Prefer direct verbs: `Till`, `Plant`, `Water`, `Harvest`, `Bottle`, `Collect`, `Build`, `Unlock`.
- Help and tutorial copy should read like a game manual, not a character narrator.
- Use warm, calm, practical language.
- If a string can be shorter without losing meaning, shorten it.

## Terms To Prefer

- Garden
- Plot
- Hive
- Honey
- Order
- Pollination
- Manual
- Build
- Unlock

## Terms To Avoid

- Planet
- Galaxy
- Captain
- Mission
- Quest
- Legendary
- Rare honey
- Honey quality
- Deep lore hooks

## Visual Defaults

- Soft garden greens, pollen gold, warm cream, and muted brown are the default palette.
- Rounded corners, low-contrast panels, and light shadows are preferred.
- Motion should be soft and short: fade, slide, slight scale, slight wobble.
- Reuse existing assets and the global Godot theme instead of inventing screen-specific styles.

## Implementation Defaults

- If the choice is between new system design and polishing the current loop, polish the current loop.
- If the React Native prototype conflicts with this v0 brief, follow this brief for player-facing behaviour and copy.
- If a feature can ship through better state logic, copy, or feedback without new art, do that first.
- Put new player-facing strings in obvious constants or data tables so later edits stay cheap.
- Split agent work by file ownership, not by vague feature wording.

## File Ownership Slices For Agents

- Core loop logic: `scene/scripts/game_state.gd`, `scene/scripts/save_manager.gd`, related tests.
- Theme and UI polish: `scene/resources/main_theme.tres`, `scene/scenes/game_root.tscn`, `scene/scripts/game_root.gd`, surface screen scripts.
- Auth and sync: `scene/scripts/supabase_manager.gd`, future `scene/scripts/auth_screen.gd`, `scene/project.godot`.
- Copy and content integration: `scene/scripts/help_screen.gd`, `scene/scripts/game_screen.gd`, `scene/scripts/orders_panel.gd`, tutorial/help content sources.

## Decision Rule

- If a decision is reversible and does not affect economy, scope, or brand positioning, choose the practical default and move.
- If a decision changes balance, public product framing, or long-term scope, stop and ask.
