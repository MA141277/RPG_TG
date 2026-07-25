# Generic Progression Track Design

## Goal

Add a reusable progression mechanism that supports:

- any stable runtime object as the owner
- creator-authored threshold-based tier changes
- one-time enter-tier results
- sustained current-tier effects
- optional demotion
- settlement-instance-driven target-tier convergence

This mechanism must align with the repository's current routing rules:

- `event` remains the only formal routing owner
- progression must not introduce a second router
- creator-facing data must be authorable in Script Editor
- runtime must consume authored data through unified state and resource structures
- all final property and state changes must execute only through settlement instances
- progress-value changes must also execute only through settlement instances

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

Recommended creator-facing Chinese terminology:

- mechanism name = `阶段轨道`
- metric name = `进度值`
- tier name = `阶段`

These terms should remain stable across authoring, documentation, and implementation.

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

First-version bindings should not support partial per-owner overrides of track thresholds or tier templates.

If one owner needs different thresholds or tier behavior, create a distinct track definition rather than mixing local override semantics into bindings.

### Tier Definition

```ts
type ProgressTierDefinition = {
  id: string;
  title: string;
  threshold: number;
  onEnterRepeatPolicy?: "once-ever" | "once-per-entry";
  targetTierSettlementId?: string | null;
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
   - Enter-tier settlement policy
4. `当前阶段持续生效`
   - Target-tier settlement meaning and capability gates
5. `挂载对象`
   - Which owner families or concrete authored objects use the track

First-version authoring should not support:

- per-owner tier threshold overrides
- cross-track linked conditions
- creator-authored composite rule expressions

## Creator-Facing Script Editor Layout Patch

The Script Editor should present this feature as one creator-facing module instead of exposing the underlying rule/binding split as two parallel first-level entries.

Required creator-facing module name:

- `闃舵閰嶇疆`

This module name is the primary creator-facing term for navigation and page titles.

The following terms remain valid as internal/resource language, but should not remain parallel first-level creator modules:

- `闃舵杞ㄩ亾`
- `杞ㄩ亾缁戝畾`

### Layout Rules

The module must use the Script Editor's standard content layout:

- left record list
- right editor panel

The workbench-style summary header area from the earlier draft must not remain.

Specifically, the creator-facing page must not keep a large summary band that mixes:

- oversized workbench title
- current object summary cards
- status snapshot cards
- handoff or queue summary cards

This feature should read like the editor's other authoring modules instead of a separate workbench surface.

### Primary Creator View

The left list should be organized by concrete authored usage targets rather than by reusable rule templates.

Required list perspective:

- `搴旂敤瀵硅薄`

Reason:

- creators usually think "I want to configure stage logic for this person/city/building"
- creators do not naturally start from the reusable rule table
- the used object is the main authored subject, while the track is the rule it references

Each left-list item should display creator-facing summary information such as:

- object name
- object type
- current rule name
- enabled state

Required left-list actions:

- search objects
- create stage configuration
- delete stage configuration

`create stage configuration` is the creator-facing action label. The underlying data creation may still land as a `ProgressTrackBinding`, but the editor should not require the creator to reason in that term.

### Right-Side Editor Structure

The right editor panel should be arranged in creator task order and should keep object configuration and rule editing on the same page.

Required sections:

1. `閰嶇疆瀵硅薄`
   - object type
   - object identifier
   - enabled state
2. `浣跨敤瑙勫垯`
   - current rule
   - switch rule
   - create rule
   - duplicate rule
   - edit current rule
3. `闃舵瑙勫垯`
   - rule name
   - metric source
   - allow demotion
   - tier rows
   - threshold
   - target-tier settlement

This structure should let the creator complete the full workflow on one page:

1. choose the object
2. confirm or switch the rule used by that object
3. edit the rule details directly

The creator should not need to bounce between a "track page" and a separate "binding page" to finish one coherent authoring task.

### Help Entry

The module should include a creator-facing help button.

Required button label:

- `甯姪`

Placement rule:

- place it in the module's internal editor header, top-right
- do not place it in the global top bar
- keep its visual style aligned with the existing Script Editor button treatment

Clicking the help button should open a modal titled:

- `闃舵閰嶇疆浣跨敤璇存槑`

The help modal should include two sections:

1. `鍔熻兘璇存槑`
   - explains that stage configuration assigns threshold-based rule progression to people, cities, or buildings
   - explains that each object uses one rule
   - explains that threshold hits emit settlement instances and those instances are handled by settlement runtime for final state change
2. `鎿嶄綔娴佺▼`
   - choose or create a stage configuration
   - choose the object
   - choose the rule
   - configure tier names, thresholds, and target-tier settlements
   - save so runtime can consume the authored configuration

Required close action label:

- `鎴戠煡閬撲簡`

### Creator Terminology Rules

Creator-facing labels should prefer business-language wording over contract wording.

Recommended creator-facing mappings:

- module name = `闃舵閰嶇疆`
- track term in-page = `瑙勫垯`
- `metricKey` = `杩涘害鍊兼潵婧?`
- `ownerKind` = `瀵硅薄绫诲瀷`
- `ownerId` = `瀵硅薄鏍囪瘑`
- `targetTierSettlementId` = `闃舵鐩爣缁撶畻`

Raw keys, ids, or contract field names must not become the primary visible panel language.

If internal identifiers are shown for debugging or conflict inspection, they should stay secondary and not dominate the creator-facing surface.

### Boundary Reminder

This creator-facing page reorganization does not change the underlying resource or runtime boundaries.

The following remain unchanged:

- `progress-tracks.json` remains the reusable rule resource
- `progress-track-bindings.json` remains the object-to-rule usage resource
- `ProgressionRuntime` still evaluates convergence and emits settlement instances only
- `SettlementRuntime` still owns all final property/state mutation
- event routing remains the only formal routing owner

This patch changes how creators understand and operate the feature, not how runtime truth is partitioned internally.

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
- producing settlement instances for tier convergence
- exposing progression diagnostics for later debugging

The progression runtime does **not** own:

- direct settlement execution
- direct event routing
- direct playable routing
- ad hoc UI updates
- feature-specific object lookup rules in `main.ts`

The progression runtime's only execution-facing output is settlement instances.

The current Event-routing call chain must immediately hand those settlement instances to `SettlementRuntime` for formal execution.

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

Recommended state boundary:

- `metricValue` changes are formal gameplay mutations and therefore must execute through settlement instances
- final business-facing property and state changes must execute through settlement instances
- `currentTierId` and `enteredTierHistory` belong to progression-owned runtime state
- if external runtime families need a formal mirrored current-tier field, that mirror must be written through settlement rather than by directly reading and mutating progression internals ad hoc

## Execution Flow

The progression mechanism should run in this order:

1. An existing effect, settlement, task, or event changes a metric value for an owner-track pair.
2. The progression runtime recalculates the highest tier whose threshold is satisfied.
3. If the tier does not change:
   - update metric state
   - emit no execution-side mutation directly
4. If the tier changes:
   - write the new current tier
   - evaluate demotion or promotion transition
   - emit settlement instances that describe target-tier convergence
   - rely on settlement execution to perform all final property and state changes
5. If later content routing is needed:
   - settlement execution owns the formal write-back and any resulting routed truth
   - progression does not emit standalone event-start requests
6. The current Event-routing call chain must immediately submit emitted settlement instances to `SettlementRuntime`.

In the first version, the progression runtime must not evaluate cross-track coupled requirements while performing this flow.

## Settlement Alignment

This design must stay compatible with the repository's settlement boundary.

Required execution rule:

- progression may only emit settlement instances
- settlement runtime may only consume settlement instances
- progression may not directly execute effects, state writes, or routed content requests
- the current Event-routing call chain is the required handoff point between progression output and settlement execution

Therefore:

- `targetTierSettlementId` means "use this settlement template when converging onto this tier"
- the progression runtime emits settlement instances only
- the settlement runtime performs all final state mutation, reward delivery, and follow-up write-back
- the current Event-routing call chain must immediately forward progression-emitted settlement instances into `SettlementRuntime`

Progression must not:

- directly jump to scenes
- directly emit effect execution
- directly emit event-start requests
- privately call alternate routers
- create a separate follow-up routing layer

## Event Routing Alignment

This design must still stay compatible with the repository's event-only routing direction.

Required routing rule:

- event remains the only formal creator-facing route owner
- if tier convergence should lead to later event content, that routed truth must arise from formal settlement execution output rather than from progression directly
- progression must not become a second routing owner

If later routed content should happen because a tier changed, settlement-owned formal output must feed the next routed truth. Progression itself still does not emit standalone event-start requests.

## Settlement Instance Payload

The target-tier settlement handoff should carry enough canonical context for settlement execution to converge correctly.

Recommended settlement-instance payload:

```ts
type ProgressionTierSettlementPayload = {
  ownerKind: string;
  ownerId: string;
  trackId: string;
  fromTierId: string | null;
  toTierId: string | null;
  metricValue: number;
};
```

This payload lets settlement execution reason about:

- who changed
- which track changed
- what the previous tier was
- what the target tier is
- what the latest canonical progress value is

Settlement templates should not need progression-specific hidden globals or ad hoc side channels to determine convergence meaning.

## Target-Tier Convergence

The design must converge by target tier instead of direct modifier execution inside progression.

This means:

- progression determines which tier is now correct
- progression emits settlement instances representing convergence onto that target tier
- settlement execution applies the final mutations and canonical write-back
- leaving one tier and entering another is handled by convergence semantics in settlement, not by progression directly applying and undoing modifiers

This avoids:

- duplicated modifier stacking
- progression-owned direct state mutation
- drift between progression state and settlement-owned final state

## Repeat Policy

Repeat policy must be explicit when a tier is re-entered after demotion.

Required semantics:

- transition `A -> B` triggers B-tier entry once
- transition `B -> A -> B` behaves by policy
- `once-ever` means B-tier entry content does not trigger a second time after re-entry
- `once-per-entry` means B-tier entry content triggers again each time the runtime re-enters B

These semantics must remain the same across Script Editor authoring, export/import, runtime preview, and production startup.

## Demotion

The first version should support demotion when configured by the track.

If `allowDemotion` is enabled:

- the runtime recalculates the highest satisfied tier after any metric change
- a lower satisfied tier becomes the new current tier
- the new tier emits its target-tier settlement instance
- settlement runtime converges final state onto the demoted tier outcome

Demotion does not require a separate feature-specific path.

## First-Version Scope

The first production slice should support:

- threshold-based tier selection from one metric
- arbitrary stable owner identities
- creator-authored tier names and thresholds
- optional demotion
- settlement-instance-driven target-tier convergence
- no direct progression-owned mutation path
- Script Editor authoring in Chinese business labels
- save/load and runtime state sync through unified runtime state
- existing Event-routing-chain handoff into settlement runtime
- canonical settlement payload carrying owner, track, previous tier, target tier, and progress value

The first production slice should not support:

- graph-based progression topologies
- branching tier trees
- creator-defined formula languages
- cross-track dependency expressions
- custom author code hooks
- per-owner partial track-template overrides
- multi-track linked convergence rules

## Existing Chain Integration

The first-version landing should explicitly cover these chain seams:

1. Script Editor authoring for `阶段轨道` and bindings
2. runtime-pack export/import for track and binding resources
3. loader hydration into active content/runtime lookup structures
4. Event-routing-chain handoff from progression output to `SettlementRuntime`
5. settlement execution consuming canonical progression settlement payload

The mechanism must not land editor-only. Preview, export/import, loader, and runtime handoff must all understand the same progression resource truth.

## Why This Fits The Current Repository

This design follows the repository's active constraints:

- it avoids building or feature-specific hardcoding in `src/main.ts`
- it keeps persistent state inside unified runtime state structures
- it treats creator-facing progression as authored data
- it leaves final mutation ownership to settlement runtime
- it leaves routing ownership to the existing event system
- it uses the existing Event-routing call chain as the formal handoff path instead of introducing a new orchestrator
- it provides a reusable mechanism instead of a one-off experience-level patch

In short:

- progression owns threshold evaluation and settlement-instance emission
- settlement owns final mutation delivery
- event owns routing
- Script Editor owns creator-facing authoring
