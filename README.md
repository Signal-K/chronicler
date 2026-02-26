# Asset Credits

Summer crops - [Itsumi Len](https://jinhzaki.itch.io/)

## Godot Migration Prototype

A Godot 4.5 gameplay prototype now exists in [`scene/`](/Users/scroobz/Navigation/bee-garden/scene).

- Main scene: [`scene/scenes/main.tscn`](/Users/scroobz/Navigation/bee-garden/scene/scenes/main.tscn)
- Root scene (tabs): [`scene/scenes/game_root.tscn`](/Users/scroobz/Navigation/bee-garden/scene/scenes/game_root.tscn)
- Hives scene: [`scene/scenes/hives.tscn`](/Users/scroobz/Navigation/bee-garden/scene/scenes/hives.tscn)
- Plot scene: [`scene/scenes/plot.tscn`](/Users/scroobz/Navigation/bee-garden/scene/scenes/plot.tscn)
- Logic scripts: [`scene/scripts/game_screen.gd`](/Users/scroobz/Navigation/bee-garden/scene/scripts/game_screen.gd), [`scene/scripts/plot.gd`](/Users/scroobz/Navigation/bee-garden/scene/scripts/plot.gd)

The prototype follows the scene-first rule: plot objects are authored directly in `.tscn`, while `.gd` scripts handle behavior.

### Export Commands

```bash
./export_godot.sh --target . --project ./scene --name BeeGarden --preset iOS --platform ios
./export_godot.sh --target . --project ./scene --name BeeGarden --preset Android --platform android
yarn run test:godot:smoke
```
