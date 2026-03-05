# Godot Save Format

File: `user://bee_garden_save.json`
Current version: `2` (`CURRENT_SAVE_VERSION` in `game_state.gd`)

---

## Versioning

`save_version` is written on every save.
When the schema changes in a breaking way, increment `CURRENT_SAVE_VERSION` and add a
migration block in `load_state()` (similar to `_migrate_tutorial_flow_if_needed()`).

| Version | Change |
|---|---|
| 1 | Initial schema (farm plots, hives, resources, orders, progression) |
| 2 | Added `plot_pages` (purchasable farm plot expansion) |

---

## Schema Reference

```json
{
  "save_version": 2,

  // Farm
  "farm_selected_crop": "tomato",
  "farm_plots": [
    {
      "state": "empty | tilled | planted | growing",
      "growth_stage": 0,
      "crop_type": "tomato | blueberry | lavender | sunflower | \"\"",
      "needs_water": false,
      "last_action_at": 0.0
    }
  ],
  "plot_pages": 1,

  // Resources
  "coins": 100,
  "water": 100,
  "max_water": 100,
  "seeds": {
    "tomato": 5,
    "blueberry": 5,
    "lavender": 5,
    "sunflower": 5
  },
  "harvested": {
    "tomato": 0,
    "blueberry": 0,
    "lavender": 0,
    "sunflower": 0
  },

  // Hives
  "hives": [
    {
      "id": "hive-1",
      "name": "Starter Hive",
      "bee_count": 5,
      "honey_bottles": 3
    }
  ],
  "bottled_honey_inventory": 0,
  "glass_bottles": 10,

  // Orders
  "honey_orders": [
    {
      "id": "order-1-2026-01-01",
      "title": "Daily Order 1",
      "required_bottles": 2,
      "reward_coins": 18,
      "fulfilled": false
    }
  ],
  "orders_generated_on": "2026-01-01",

  // Progression / XP
  "total_xp": 0,
  "harvests_count": 0,
  "unique_harvests": { "tomato": true },
  "pollination_events": 0,
  "sales_completed": 0,
  "classifications_completed": 0,

  // Tutorial state
  "tutorial_completed": false,
  "tutorial_step_index": 0,
  "hive_tutorial_completed": false,
  "hive_tutorial_step_index": 0,
  "tutorial_version": 4,

  // Maps / Worlds
  "unlocked_maps": ["default"],
  "active_map": "default",

  // Planets
  "discovered_planets": [
    {
      "id": 1,
      "name": "Aru-001",
      "type": "Desert World",
      "radius": 0.9,
      "gravity": 7.1,
      "orbital_period": 220.0,
      "has_life": false
    }
  ],
  "next_planet_id": 2
}
```

---

## AsyncStorage Migration Path

The React Native app stores equivalent data in AsyncStorage under these keys:

| AsyncStorage key | Godot save field(s) |
|---|---|
| `plots` | `farm_plots` |
| `inventory` | `coins`, `water`, `max_water`, `seeds`, `harvested`, `glass_bottles`, `bottled_honey_inventory` |
| `hives` | `hives` |
| `honeyOrders` | `honey_orders`, `orders_generated_on` |
| `experience` | `total_xp`, `harvests_count`, `unique_harvests`, `pollination_events`, `sales_completed`, `classifications_completed` |
| `activeFarm` | `active_map` |
| `discoveredPlanets` | `discovered_planets`, `next_planet_id` |

A migration bridge should:
1. Read AsyncStorage values via the React host shell before first Godot launch.
2. POST them to a Godot-readable URL or write them as a staging JSON file at a
   known path.
3. On first launch, Godot detects the staging file, imports values, then deletes it.

This path is not yet implemented; a host shell bridge (see `task-m8q2ps`) is required.
