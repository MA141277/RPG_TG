# City Layout Auto Place Design

## 1. Goal

Add a city-layout-level auto placement action that fills in missing enterable buildings for the current city without disturbing already placed instances.

The tool must:

- only operate in `City Layout`
- only place prefabs whose `entry.type !== "none"`
- place each eligible prefab at most once
- skip any prefab that already has an instance in the current city
- choose positions automatically with a lightweight scoring model
- preserve the existing prefab/city ownership split

This feature is meant to accelerate first-pass city authoring, not replace manual polishing.

## 2. Problem Statement

The editor already supports:

- reusable prefab editing
- per-city instance placement
- street-cell exclusion
- footprint-aware placement

But it still requires the user to manually add each enterable building one by one.

That is slow for initial city setup and makes it harder to get a usable baseline layout before hand-tuning offsets and local composition.

The user wants:

- one-click filling of missing enterable buildings
- no duplicate placement of buildings that are already present
- reasonable space usage
- a result that feels more intentional than naive left-to-right packing

## 3. Scope

This design covers:

- one-click auto placement of missing enterable prefabs
- candidate scoring for layout positions
- editor UI and status reporting
- validation and failure reporting

This design does not cover:

- automatic placement of non-enterable decoration prefabs
- city-specific overrides of prefab footprint or visual values
- procedural district semantics
- building rotation as part of auto placement
- post-placement beautification passes

## 4. Design Principles

The implementation must follow these rules:

1. prefab data remains reusable truth
2. auto placement only creates or positions city instances
3. existing user-placed instances are preserved
4. invalid placements must fail closed
5. scoring must stay simple enough to reason about and debug

## 5. User-Level Behavior

### 5.1 Feature Entry

Add a `一键补齐可进入建筑` action in `City Layout`.

The action is unavailable or no-ops in `Prefab Editor`.

### 5.2 Placement Population

When triggered, the editor must:

1. scan the prefab library
2. keep only prefabs with `entry.type !== "none"`
3. remove any prefab that already has an instance in the current city layout
4. sort the remaining prefabs by descending footprint area
5. place each prefab at most once

`footprint area` means:

```ts
area = prefab.footprint.cols * prefab.footprint.rows
```

If areas tie, use a deterministic fallback:

1. larger `cols`
2. larger `rows`
3. stable prefab id lexicographic order

### 5.3 Existing Instance Policy

Existing instances remain untouched.

The auto placement flow only adds missing prefabs. It never:

- deletes existing instances
- repositions existing instances
- rewrites prefab visual data

## 6. Hard Placement Constraints

A candidate placement is valid only if all of the following are true:

1. footprint stays inside board bounds
2. footprint does not overlap street-forbidden cells
3. footprint does not overlap any existing instance footprint

The implementation must reuse existing board and street validation helpers where possible.

## 7. Candidate Search

For each missing prefab:

1. iterate candidate top-left footprint grid positions over the current board
2. evaluate only valid candidates
3. compute a score for each valid candidate
4. choose the highest-scoring candidate
5. create one new city instance there

If a prefab has no valid candidate, it is reported as unplaced and skipped.

Search order must be deterministic so repeated runs on the same input produce the same result.

## 8. Scoring Model

The scoring model should stay lightweight and explainable.

For each valid candidate, compute a total score from these components:

### 8.1 Built-Cluster Proximity

Prefer positions closer to already placed buildings.

Intent:

- avoid scattering new buildings into distant corners first
- encourage a coherent urban cluster

Recommended implementation:

- measure distance from candidate footprint center to the nearest existing instance center
- nearer is better, within a capped range

### 8.2 Compactness

Prefer placements that reduce fragmented leftover space.

Intent:

- improve space utilization
- avoid boxing out future large placements with awkward gaps

Recommended implementation:

- reward candidates that touch or nearly touch existing occupied footprints
- modestly penalize isolated placements

### 8.3 Center Bias

Prefer moderate centrality over extreme edge hugging.

Intent:

- produce more natural first-pass layouts
- avoid packing everything against boundaries unless necessary

Recommended implementation:

- compute distance from candidate center to board center
- apply a small bonus to more central positions

This must remain a weak signal, not a dominant one.

### 8.4 Spacing Sanity

Avoid both excessive isolation and overly cramped packing.

Intent:

- leave a little breathing room
- still allow dense urban layouts

Recommended implementation:

- reward candidates with a small number of nearby neighbors
- penalize candidates that create overly tight local congestion

This is not a street-generation mechanic. It is only a tie-break quality signal.

## 9. UI Behavior

### 9.1 Button Placement

Add the action to the `City Layout` workflow near existing layout operations, not inside prefab editing controls.

### 9.2 Status Reporting

After one run, the status output must report:

- how many prefabs were already present and skipped
- how many missing prefabs were placed
- which prefabs could not be placed because no valid space was found

The message should make it clear that only the current city layout changed.

### 9.3 Save Model

Auto placement updates the current in-memory `City Layout`.

It does not auto-save to disk.

The user must still explicitly save the current city layout file after reviewing the result.

## 10. Data Ownership

Auto placement may create:

- `CityStageInstance`

Auto placement must not mutate:

- prefab `asset.*`
- prefab `footprint.*`
- prefab `interaction.*`
- prefab `entry.*`

New instances should inherit normal default render metadata:

- `visible: true`
- `locked: false`
- `zIndexMode: "y-sort"`
- `zIndex: null`

## 11. Failure Handling

If there are no missing enterable prefabs:

- do nothing
- report that nothing needed placement

If some prefabs fit and others do not:

- place the ones that fit
- report the ones that failed

If no valid candidates exist for any missing prefab:

- leave layout unchanged
- report that no valid space was found

## 12. Verification Requirements

Implementation must verify:

1. the action only appears or runs in `City Layout`
2. only `entry.type !== "none"` prefabs are considered
3. each eligible prefab is placed at most once
4. existing instances are preserved
5. placements never enter street-forbidden cells
6. placements never overlap occupied footprints
7. larger footprints are processed before smaller footprints
8. status reporting distinguishes placed, skipped, and failed prefabs
9. saving still writes only the city layout file, not the prefab library

## 13. Final Recommendation

Implement auto placement as a deterministic, score-guided helper for `City Layout`.

Do not make it a generic procedural city generator.

The correct first version is:

- constrained
- explainable
- non-destructive
- easy to rerun after manual edits
