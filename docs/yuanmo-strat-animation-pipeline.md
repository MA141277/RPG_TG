# Yuanmo Strat Animation Pipeline

## Current status

The current browser actor is **not using original walk or idle clips**.

What exists now:

- `src/assets/yuanmo-units/red-turban-strat.json`
- `src/assets/yuanmo-units/yuan-infantry-strat.json`
- `src/assets/yuanmo-units/*.png`
- `src/ui/views/map/campaign-terrain-webgl.ts`

What the current exporter actually contains:

- merged static mesh
- bone hierarchy
- per-vertex bone index metadata
- texture converted from `.tga` to `.png`

What it does **not** contain:

- animation keyframes
- bind-pose skinning matrices
- walk clip
- idle clip
- turn clip
- runtime animation state machine

That is why the current map actor only does procedural bob/sway in
[campaign-terrain-webgl.ts](/D:/RPG_TG/src/ui/views/map/campaign-terrain-webgl.ts:624),
which visually reads as a "zombie hop" instead of the original strategic walk cycle.

## Confirmed source chain

### Strategic model definition

The Red Turban and Yuan strategic actors are linked in:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/descr_model_strat.txt`

Confirmed entries:

- `type shun_general`
  - `skeleton strat_named_with_army`
  - `model_flexi_m models_strat/chuangying.CAS`
  - texture `models_strat/textures/dashun_general.tga`
- `type menggu_general`
  - `skeleton strat_named_with_army`
  - `model_flexi_m models_strat/mongol_infantry.cas`
  - texture `models_strat/textures/mongol_infantry.tga`

### Strategic skeleton to animation mapping

The strategic actor skeleton mapping is in:

- `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/descr_skeleton.txt`

Confirmed skeleton for both target actors:

- `type strat_named_with_army`

Confirmed original strategic clips referenced there:

- `data/animations/Stratmap_General/Strat_General_stand_A_idle.cas`
- `data/animations/Stratmap_General/Strat_General_stand_A_to_walk.cas`
- `data/animations/Stratmap_General/Strat_General_walk.cas`
- `data/animations/Stratmap_General/Strat_General_walk_to_stand_A.cas`
- `data/animations/Stratmap_General/Strat_General_stand_A_turn_90_cw.cas`
- `data/animations/Stratmap_General/Strat_General_stand_A_turn_90_ccw.cas`

### Where the animation files physically live

There are two relevant animation stores:

- loose base-game animation files under:
  - `D:/RPG_TG/map/yuan mo feng yun lu/data/animations`
- mod animation packs under:
  - `D:/RPG_TG/map/yuan mo feng yun lu/mods/yuanmofengyunlu/data/animations`

Important distinction:

- base game path contains many loose `.cas` files
- mod path currently exposes packed containers:
  - `pack.dat`
  - `pack.idx`
  - `skeletons.dat`
  - `skeletons.idx`

So the current blocker is not missing animation content.
The blocker is that the browser-side pipeline does not yet unpack or convert the strategic animation clips into a runtime format.

One more constraint now confirmed in practice:

- slices extracted from `pack.dat` by `pack.idx` are not guaranteed to be the same as a loose authoring-time `.cas`
- they are usable as resolved animation payloads for a conversion pipeline
- but they still need a pack-aware decoder or converter before browser playback

## Current exporter coverage

### Implemented

Model indexing:

- [export-yuanmo-strat-model-index.mjs](/D:/RPG_TG/tools/export-yuanmo-strat-model-index.mjs:1)

Static web asset export:

- [export-yuanmo-strat-web-assets.mjs](/D:/RPG_TG/tools/export-yuanmo-strat-web-assets.mjs:1)

This exporter currently:

1. reads `descr_model_strat.txt`
2. selects target strategic actors
3. parses `models_strat/*.CAS`
4. converts TGA textures to PNG
5. merges mesh chunks into one static JSON payload

### Missing

The exporter currently does **not**:

1. parse `descr_skeleton.txt` into a clip manifest
2. resolve skeleton type -> walk/idle/turn clip set
3. unpack animation clips from packed mod animation containers
4. parse animation `.cas` transform tracks
5. write browser-native animation data such as:
   - GLB with bones + clips
   - glTF + binary + PNG
   - custom JSON clip tracks

## Reusable agent workflow

Use this workflow whenever an agent needs true strategic-map movement instead of procedural bobbing.

### Phase 1: identify actor source

1. Open `descr_model_strat.txt`.
2. Find the actor type used by the desired faction or unit.
3. Record:
   - `type`
   - `skeleton`
   - `scale`
   - `model_flexi_m`
   - faction texture path

For current campaign actors:

- friendly: `shun_general`
- enemy: `menggu_general`

### Phase 2: resolve animation set

1. Open `descr_skeleton.txt`.
2. Find the `type` matching the actor skeleton.
3. Extract at minimum:
   - `default`
   - `stand_a_idle`
   - `stand_a_to_walk`
   - `walk`
   - `walk_to_stand_a`
   - `stand_a_turn_90_cw_1`
   - `stand_a_turn_90_ccw_1`

For current targets, the skeleton is:

- `strat_named_with_army`

### Phase 3: locate physical clip files

1. Try loose file resolution first.
2. If the path is absent under the mod, inspect:
   - mod `data/animations/pack.dat`
   - mod `data/animations/pack.idx`
   - mod `data/animations/skeletons.dat`
   - mod `data/animations/skeletons.idx`
3. Fall back to base-game loose animation files when the referenced clip is unchanged and available there.

### Phase 4: convert offline

Preferred output targets:

- `glb` with skin + clips
- or `gltf + bin + png`
- or custom JSON with:
  - bind pose
  - bone names
  - parent indices
  - keyframes per bone
  - fps
  - clip duration

Recommended export bundle per actor:

- mesh
- skin
- texture
- idle clip
- walk clip
- turn-left clip
- turn-right clip

### Phase 5: browser runtime

Replace procedural deformation with a real animation state machine:

1. `idle`
2. `start_walk`
3. `walk_loop`
4. `stop_walk`
5. `turn_left`
6. `turn_right`

At runtime, movement should:

- interpolate world position over time
- rotate actor heading smoothly
- play `walk_loop` only while travelling
- return to `idle` on arrival or cancel

## Recommended next engineering task

The next useful task is not more shader tweaking.
It is:

1. add an offline animation manifest extractor from `descr_skeleton.txt`
2. inspect or unpack the relevant strategic clips from animation storage
3. export one working `strat_named_with_army` walk clip alongside `red-turban-strat`
4. switch the map actor from procedural sway to clip playback

## Practical conclusion

The original walk action already exists in the mod data.
The current implementation is only missing the **offline animation conversion pipeline**.

Until that pipeline exists, any browser actor will remain an approximation rather than the real strategic-map animation.
