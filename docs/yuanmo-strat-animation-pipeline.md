# Yuanmo Strat Animation Pipeline

## Current status

The current Zhu Yuanzhang browser actor uses real FBX animation clips exported into the
campaign actor runtime format.

What exists now:

- `src/assets/yuanmo-units/red-turban-strat.json`
- `src/assets/yuanmo-units/zhu-yuanzhang-monk-strat.json`
- `src/assets/yuanmo-units/yuan-infantry-strat.json`
- `src/assets/yuanmo-units/*.png`
- `src/assets/yuanmo-unit-animations/zhu-yuanzhang-monk-strat/look_around.json`
- `src/assets/yuanmo-unit-animations/zhu-yuanzhang-monk-strat/run.json`
- `src/ui/views/map/campaign-terrain-webgl.ts`

What the current campaign actor payload contains:

- merged static mesh
- bone hierarchy
- per-vertex bone index metadata
- per-vertex skinning influences, up to 4 bones per vertex when the source format provides them
- texture converted or copied into a browser asset format
- optional `facingOffsetDegrees` for source-specific forward-axis correction
- optional `posturePitchDegrees` for source-specific standing-pose correction after skinning
- optional per-bone `localPositions` in converted clips when the FBX stack includes local
  translation channels
- browser-native animation tracks for assets that have converted clips

The Zhu Yuanzhang monk strategic actor is imported through
`tools/import-campaign-fbx-unit.mjs` from the user-provided binary FBX export and its
`.fbm` texture directory. The import currently writes:

- `src/assets/yuanmo-units/zhu-yuanzhang-monk-strat.json`
- `src/assets/yuanmo-units/zhu-yuanzhang-monk-strat.jpg`
- `src/assets/yuanmo-unit-animations/zhu-yuanzhang-monk-strat/look_around.json`
- `src/assets/yuanmo-unit-animations/zhu-yuanzhang-monk-strat/run.json`

For the current FBX, the chosen source stacks are:

- idle / look around: `NlaTrack.001`
- movement / walk: `NlaTrack`, exported to `run.json` for the current campaign actor
  runtime binding

The selected movement stack contains authored horizontal root motion on the `Root` bone, so the
current import uses `--walkRootMotionMode in-place-horizontal --walkRootMotionAnchor end`.
This bakes the movement clip into an in-place loop fixed at the original animation's end
position while preserving vertical motion and skeletal rotation.
The full movement stack contains four steps; the current browser clip crops it to
`--walkFrameStart 0 --walkFrameEnd 29`, using the first two steps for a shorter walk loop.
Root-motion anchoring is applied before frame cropping, so `--walkRootMotionAnchor end` still
means the original full source animation's end position rather than the cropped segment's end.
The cropped clip also uses `--walkLoopMode blend-tail --walkLoopBlendFrames 2` so only the
loop point is closed instead of pulling an entire final step back into the first pose.

The OBJ import path remains available through `tools/import-campaign-obj-unit.mjs`, but OBJ
does not carry skeleton or animation clips. Treat OBJ imports as static actor fallback assets,
not as the preferred path for player-visible strategic actors.

Known runtime limitations:

- FBX skinning is evaluated on CPU into the existing actor vertex buffer rather than as GPU
  matrix palette skinning
- there is no turn-left / turn-right clip selection yet
- movement state currently blends between idle and run poses inside the browser actor runtime;
  authored start/stop clips are still not selected as separate clips
- continuous path traversal must keep the movement clip active across intermediate hex
  waypoints; only the final destination or an explicit travel cancel should transition back
  to idle, otherwise the walk cycle visibly restarts at every grid center

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

User-provided FBX actor import:

- [import-campaign-fbx-unit.mjs](/D:/WorkSpace/Html/RPG_TG/tools/import-campaign-fbx-unit.mjs:1)

This importer currently:

1. reads binary FBX 7.x files
2. extracts mesh geometry, UVs, normals, skeleton hierarchy and up to 4 skin weights per vertex
3. extracts named FBX animation stacks into browser-native JSON clips
4. can bake a selected movement clip's horizontal root motion into an in-place loop via
   `--walkRootMotionMode in-place-horizontal`, with `--walkRootMotionAnchor start|end`
   selecting whether the fixed root position comes from the source clip's first or last frame
5. can crop a selected movement clip frame range via `--walkFrameStart` and `--walkFrameEnd`
6. can close a movement clip loop via `--walkLoopMode blend-tail --walkLoopBlendFrames N`,
   which blends the authored tail frames back into the first frame for seamless wraparound
7. copies the selected texture into `src/assets/yuanmo-units`
8. writes the campaign actor model JSON and idle / run clip JSON files

Static OBJ fallback import:

- [import-campaign-obj-unit.mjs](/D:/WorkSpace/Html/RPG_TG/tools/import-campaign-obj-unit.mjs:1)

This importer is only for static model fallback because OBJ has no skeleton or animation
clip data.

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

The original CAS exporter currently does **not**:

1. parse `descr_skeleton.txt` into a clip manifest
2. resolve skeleton type -> walk/idle/turn clip set
3. unpack animation clips from packed mod animation containers
4. parse animation `.cas` transform tracks
5. write browser-native animation data such as:
   - GLB with bones + clips
   - glTF + binary + PNG
   - custom JSON clip tracks

## Reusable agent workflow

Use the FBX workflow whenever a user provides a replacement actor with authored animation
clips. Use the CAS workflow only when converting actors directly from the original Yuanmo
strategic model data.

### FBX replacement workflow

1. Inspect the source directory and confirm there is a binary `.fbx` and a texture under the
   `.fbm` directory.
2. Inspect the FBX animation stack names. For the current Zhu Yuanzhang actor:
   - idle / look around: `NlaTrack.001`
   - movement / walk: `NlaTrack`
3. Run `tools/import-campaign-fbx-unit.mjs` with explicit `--idleStack`, `--walkStack`,
   `--walkFrameStart`, `--walkFrameEnd`, `--walkRootMotionMode`,
   `--walkRootMotionAnchor`, `--walkLoopMode`, `--walkLoopBlendFrames`, `--scale`,
   `--facingOffsetDegrees`, and `--posturePitchDegrees` when the exported actor needs a
   whole-model pitch correction to stand upright, a movement clip must be cropped, baked into
   an in-place loop, or tail-blended to loop cleanly.
4. Update `src/assets/yuanmo-units/manifest.json` with the source directory, model file,
   texture file, animation directory and asset counts.
5. Bind the generated animation URLs in
   [yuanmo-strat-unit-assets.ts](/D:/WorkSpace/Html/RPG_TG/src/content/yuanmo-strat-unit-assets.ts:1).
6. Verify typecheck / build, then visually confirm idle playback, movement playback, opacity
   and facing direction.

### CAS source workflow

Use this workflow whenever an agent needs to convert original strategic-map movement from the
Yuanmo source data.

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

For user-provided actor replacements, the next useful task is improving runtime fidelity:

1. move actor skinning from CPU mesh rebuild to a GPU matrix-palette path if the actor count or
   mesh size grows
2. add optional start / stop / turn clips when assets provide them
3. add a small visual inspection page for campaign actor assets and facing offsets

For original Yuanmo CAS strategic actors, the next useful task remains:

1. add an offline animation manifest extractor from `descr_skeleton.txt`
2. inspect or unpack the relevant strategic clips from animation storage
3. export one working `strat_named_with_army` walk clip alongside `red-turban-strat`

## Practical conclusion

The current Zhu Yuanzhang map actor no longer depends on procedural animation fallback. It is
driven by the user-provided FBX skeleton and the converted `look_around` / `run` clips.

The original Yuanmo strategic walk actions still exist in the mod data, but those CAS clips
need a separate pack-aware conversion pipeline before they can replace the imported FBX clips
for legacy actors.
