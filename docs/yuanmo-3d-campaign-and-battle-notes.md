# Yuanmo 3D Campaign And Battle Notes

## Current conclusion

The Yuanmo mod already contains enough source material to support:

- 3D strategic-map actors
- directional movement and idle/walk state switching
- battle-unit data extraction
- projectile, engine, mount, and skeleton animation pipelines

What is missing in the current front end is not art content. It is the browser-side asset pipeline for the Medieval II style formats used by the mod.

## Confirmed strategic-map 3D sources

Primary linkage file:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/descr_model_strat.txt`

Confirmed strategic model files:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/models_strat/chuangying.CAS`
- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/models_strat/daming_shibing.cas`
- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/models_strat/dayuanjiangjun.cas`
- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/models_strat/mingjiangjun.cas`
- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/models_strat/mongol_infantry.cas`

Supporting textures live under:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/models_strat/textures`

This means the campaign layer can eventually use true 3D actors instead of sprite markers.

## Confirmed battle and animation sources

Core unit definition:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/export_descr_unit.txt`

Battle model registry:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/unit_models/battle_models.modeldb`

Skeleton and animation registry:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/descr_skeleton.txt`

Other battle-relevant data already present:

- `descr_mount.txt`
- `descr_mounted_engines.txt`
- `descr_projectile.txt`
- `descr_arrow_trail_effects.txt`
- `descr_sm_resources.txt`

Animation files are referenced as `.cas` and exist in bulk under:

- `D:/RPG_TG/map/yuan mo feng yun lu/data/animations`

Previously confirmed counts:

- unit definitions: `424`
- meshes: `764`
- textures: `1567`
- animations: `1502`

## Practical implementation path

### Phase 1: campaign actor system

Goal:

- smooth map movement
- heading rotation
- idle/walk state
- future-ready actor abstraction

Status:

- now implemented as a 2.5D actor shell over the campaign terrain projection
- current player actor can move over time, rotate to travel direction, and show walk gait

### Phase 2: strategic-model conversion

Needed:

- parse `descr_model_strat.txt`
- map faction -> texture variant
- convert `models_strat/*.cas` into a browser runtime format such as `glb`
- keep per-actor metadata: scale, pivot, lod, default facing

Best output target:

- prebuilt `glb` or `gltf + png`

Why:

- browser engines do not natively load `.cas`
- converting once offline is much cheaper than decoding every session in the browser

### Phase 3: battle-ready content graph

Needed extracted structures:

- unit roster
- soldier model family
- skeleton id
- animation set id
- mount id
- weapon class
- missile class
- armor / morale / mass / speed
- formation footprint
- faction ownership

These should be exported to a normalized JSON/TS content layer before any battle UI work.

## Recommended next engineering tasks

1. Build an offline `models_strat` exporter.
2. Export one Red Turban strategic actor and one Yuan strategic actor to `glb`.
3. Add a minimal WebGL actor renderer on the campaign map for one movable unit.
4. Export battle-unit metadata from `export_descr_unit.txt` plus skeleton references.
5. Define a battle scene schema:
   - unit id
   - side
   - world position
   - facing
   - state
   - animation clip
   - hp / morale / formation spacing

## What battle mode will likely need later

- terrain sampling from campaign or battle map height source
- formation placement and frontage depth control
- unit pathing and local avoidance
- animation state machine:
  - idle
  - walk
  - run
  - ready
  - attack
  - hit
  - rout
- projectile simulation
- melee contact resolution
- morale model
- unit banner / faction marker layer
- simplified LOD for large armies

## Constraint to keep in mind

If we want true 3D fast, the correct move is not to hand-build models in the browser. The correct move is:

- offline parse and convert mod assets
- load browser-native runtime assets in the game

That is the shortest path to real 3D movement and eventual battle scenes.
