# Generic Progression Track Design

## Goal

Add a reusable progression mechanism that supports:

- any stable runtime object as the owner
- creator-authored threshold-based tier changes
- one-time enter-tier results
- sustained current-tier effects
- optional demotion
- Event-routed follow-up content

This mechanism must align with the repository's current routing rules:

- `event` remains the only formal routing owner
- progression must not introduce a second router
- creator-facing data must be authorable in Script Editor
- runtime must consume authored data through unified state and resource structures

## Non-Goals

The first version does not include:

- arbitrary rule expressions
- multi-metric composite conditions
- custom scripting
- direct UI exposure of internal ids or keys as primary authoring labels
- feature-specific hardcoded branches in `src/main.ts`

## Core Model

The mechanism is built from four concepts:

1. `ProgressTrackDefinition`
   - A reusable threshold track such as cultivation, reputation, prosperity, or familiarity.
2. `ProgressTierDefinition`
   - A discrete tier inside one track, with a threshold, enter-tier results, and sustained effects.
3. `ProgressTrackBinding`
   - A binding that attaches a track to a concrete owner or owner selection rule.
4. `ProgressTrackRuntimeState`
   - The runtime-owned current metric value, current tier, and enter-history for one owner-track pair.

Experience and level become one authored example of this model:

- metric value = experience
- tiers = levels
- enter-tier result = level-up reward or event
- sustained effect = current level modifier or unlocked status

## Authoring Resources

The mechanism should be introduced as first-class authored resources instead of embedded special fields on character, city, or building records.

### `progress-tracks.json`

Stores reusable track templates.

Recommended shape:

```ts
type ProgressTrackDefinition = {
  id: string;
  title: string;
  description?: string;
  metricKey: string;
  ownerKind: string | "*";
  allowDemotion?: boolean;
  tiers: ProgressTierDefinition[];
};
```

### `progress-track-bindings.json`

Stores which owners use which tracks.

Recommended shape:

```ts
type ProgressOwnerSelector = {
  ownerKind: string;
  ownerId?: string;
  ownerTag?: string;
};

type ProgressTrackBinding = {
  id: string;
  trackId: string;
  owner: ProgressOwnerSelector;
  initialMetricValue?: number;
  initialTierId?: string | null;
  enabled?: boolean;
};
```

### Tier Definition

```ts
type ProgressTierDefinition = {
  id: string;
  title: string;
  threshold: number;
  onEnterRepeatPolicy?: "once-ever" | "once-per-entry";
  sustainedModifiers?: ProgressModifierDefinition[];
  onEnterEffects?: Effect[];
  onEnterEventId?: string | null;
};
```

## Authoring UX

Script Editor must present this mechanism in creator-facing Chinese language rather than raw ids or keys.

Primary labels should use business-language fields such as:

- `轨道名称`
- `指标名称`
- `阶段名称`
- `进入阈值`
- `进入本阶段时`
- `停留在本阶段时`
- `允许回退`

The primary panel must not expose raw `trackId`, `metricKey`, or `tierId` as visible authoring labels.

If internal identifiers are needed for debugging or conflict inspection, they should appear only in an advanced folded area and remain hidden by default.

Recommended authoring surfaces:

1. `阶段轨道`
   - Track name, owner family, metric name, demotion policy
2. `阶段列表`
   - Tier name, threshold, repeat policy
3. `进入阶段时`
   - One-time effects and event trigger
4. `当前阶段持续生效`
   - Sustained modifiers and capability gates
5. `挂载对象`
   - Which owner families or concrete authored objects use the track

## Runtime Boundary

Progression must become a formal runtime boundary rather than a feature-specific helper.

Recommended runtime owner:

- `src/core/runtime/progression-runtime.ts`

Recommended contract owner:

- `src/core/contracts/progression-runtime.ts`

The progression runtime owns:

- reading bound tracks for one owner
- updating metric values
- recalculating tier transitions
- recording current tier state
- producing enter-tier results
- exposing sustained tier meaning for later materialization/presentation

The progression runtime does **not** own:

- direct event routing
- direct playable routing
- ad hoc UI updates
- feature-specific object lookup rules in `main.ts`

## Runtime State

Progression state should live under unified runtime state rather than be copied into each object family.

Recommended shape:

```ts
type ProgressTrackRuntimeState = {
  trackId: string;
  ownerKind: string;
  ownerId: string;
  metricValue: number;
  currentTierId: string | null;
  enteredTierHistory: string[];
  updatedAt: string;
};

type RuntimeProgressState = {
  trackStatesByOwnerKey: Record<
    string,
    Record<string, ProgressTrackRuntimeState>
  >;
};
```

This keeps the model generic:

- any owner with stable identity can host tracks
- no character/building/city-specific storage fork is needed
- state sync and save/load can stay on one runtime truth

## Execution Flow

The progression mechanism should run in this order:

1. An existing effect, settlement, task, or event changes a metric value for an owner-track pair.
2. The progression runtime recalculates the highest tier whose threshold is satisfied.
3. If the tier does not change:
   - update metric state
   - keep sustained tier meaning available
4. If the tier changes:
   - write the new current tier
   - evaluate demotion or promotion transition
   - emit one-time enter-tier results according to repeat policy
   - expose sustained current-tier meaning
5. If an enter-tier event or playable is configured:
   - emit a standard event-start request
   - hand it to the existing event runtime path

## Event Routing Alignment

This design must stay compatible with the repository's event-only routing direction.

Required routing rule:

- progression may request that an event start
- progression may not itself become a route owner
- event remains the only formal creator-facing route owner

Therefore:

- `onEnterEventId` means "request start of this event after this tier transition"
- the progression runtime emits a standard event-start request
- the existing event runtime decides actual startup and subsequent `nextEventId` continuation
- if tier entry should lead to a playable, the entered event owns that playable destination rather than progression directly routing to playable

Progression must not:

- directly jump to scenes
- privately call alternate routers
- create a separate follow-up routing layer

## Effect And Settlement Alignment

The mechanism should reuse the project's existing effect/settlement style rather than inventing a feature-specific reward system.

Recommended new effect family:

```ts
type ModifyProgressMetricEffect = {
  type: "modify-progress-metric";
  ownerKind: string;
  ownerId: string;
  trackId: string;
  delta: number;
};
```

Optional explicit recalculation effect:

```ts
type RecalculateProgressTrackEffect = {
  type: "recalculate-progress-track";
  ownerKind: string;
  ownerId: string;
  trackId: string;
};
```

In the normal case, `modify-progress-metric` may trigger recalculation implicitly so creators do not need two separate steps for common usage.

## One-Time Results Versus Sustained Effects

The design must keep permanent writes separate from current-tier meaning.

### One-Time Enter Results

Used for:

- granting permanent stats
- setting flags
- awarding items
- requesting an event

These are executed only when crossing into a tier and are controlled by:

- `once-ever`
- `once-per-entry`

### Sustained Effects

Used for:

- current-tier stat modifiers
- current-stage capability gates
- current-stage labels or presentation meaning

These should not repeatedly mutate base authored or saved values on every recalculation.

Instead:

- runtime state records the current tier
- materializers, resolvers, or presenters consume sustained modifiers from current tier state
- permanent writes remain one-time enter results only

This avoids duplicate stacking and incorrect rollback behavior during demotion.

## Demotion

The first version should support demotion when configured by the track.

If `allowDemotion` is enabled:

- the runtime recalculates the highest satisfied tier after any metric change
- a lower satisfied tier becomes the new current tier
- the new tier's sustained meaning applies
- one-time enter-tier results follow the tier's repeat policy

Demotion does not require a separate feature-specific path.

## First-Version Scope

The first production slice should support:

- threshold-based tier selection from one metric
- arbitrary stable owner identities
- creator-authored tier names and thresholds
- optional demotion
- one-time enter-tier results
- sustained tier effects
- event start requests on enter-tier
- Script Editor authoring in Chinese business labels
- save/load and runtime state sync through unified runtime state

The first production slice should not support:

- graph-based progression topologies
- branching tier trees
- creator-defined formula languages
- cross-track dependency expressions
- custom author code hooks

## Why This Fits The Current Repository

This design follows the repository's active constraints:

- it avoids building or feature-specific hardcoding in `src/main.ts`
- it keeps persistent state inside unified runtime state structures
- it treats creator-facing progression as authored data
- it leaves routing ownership to the existing event system
- it provides a reusable mechanism instead of a one-off experience-level patch

In short:

- progression owns threshold evaluation and result emission
- effects and settlements own mutation delivery
- event owns routing
- Script Editor owns creator-facing authoring
