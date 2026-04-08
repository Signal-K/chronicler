# Bumble Two-Week Agent Plan

## Goal

Create two weeks of agent-ready work that moves Bumble forward without waiting for more design passes. The rule is simple: finish the active Godot foundation, harden the core loop, then do the release-facing polish pass.

## Current Ground Truth

- The core Godot loop and most major screens are already ported.
- The repo already contains local work in progress for theme setup, screen transitions, XP refinement, and Supabase auth scaffolding.
- The product guardrails now live in `bumble-v0-agent-brief.md`.
- Default copy and lightweight content decisions now live in `bumble-v0-content-defaults.md`.

## Lane 1: Finish Active Foundation Work

These should be completed first because they already have code movement in the worktree.

1. `gd-ui-01` `Godot port: Universal 'Cosy' Theme`
   Files: `scene/resources/main_theme.tres`, `scene/scenes/game_root.tscn`, theme-sensitive screens
2. `gd-ui-02` `Godot port: Screen transitions & feedback`
   Files: `scene/scripts/game_root.gd`, modal and toast surfaces
3. `gd-logic-01` `Godot port: XP system refinement`
   Files: `scene/scripts/game_state.gd`, `scene/scripts/save_manager.gd`, progress UI and tests
4. `gd032` `Godot port: supabase integration`
   Files: `scene/scripts/supabase_manager.gd`, `scene/project.godot`

## Lane 2: Harden The Core Loop

These are the best code-first tasks once Lane 1 has settled.

1. `gd-logic-02` `Godot port: Honey & crop logic deepening`
   Outcome: honey types feel more meaningful without new assets
2. `gd-logic-03` `Godot port: Persistence & state management`
   Outcome: save data is safer, clearer, and more future-proof
3. `gd-logic-04` `Godot port: Order variation & NPC flavour`
   Outcome: daily orders feel more alive using the content defaults doc

## Lane 3: Player-Facing Polish And Release Prep

Do these after the core systems above are stable.

1. `gd031` `Godot port: auth screen`
   Depends on `gd032`
2. `gd-ui-03` `Godot port: Interactive Juice`
   Keep effects subtle and asset-light
3. `b2q9lu` `Ecosystem v0 release readiness for Bumble`
   Use this as the final polish and early-tester pass

## Completed Content And Direction Work

These no longer need founder design time before implementation proceeds.

- `54r0m4` creative brief and scope guardrails
- `fv23m3` microcopy pack for the core loop
- `dpkjr5` manual-style help and tutorial rewrite
- `idddd3` simple building concepts
- `p27lx1` short NPC order lines
- `yfdpli` creative direction and content handoff umbrella

## Deferred Or Blocked

- `gd021` remains blocked because the tile set and tile painting work require manual Godot editor work.
- `xqm080` is useful future ecosystem research, but it is not needed to unblock the next two weeks of coding.

## Parallelism Rules

- One agent owns `scene/scripts/game_state.gd` at a time.
- One agent owns `scene/scripts/game_root.gd` and `scene/resources/main_theme.tres` at a time.
- Auth work stays isolated to Supabase and auth-screen files until it is ready to integrate.
- Copy integration should follow `bumble-v0-content-defaults.md` instead of inventing new voice on the fly.

## Default Escalation Rule

- If a task can be finished with code, copy, or polish inside the existing screens, do it.
- If it requires net-new art direction, new lore, or a large economy decision, leave a note and ask.
