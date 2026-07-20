# Party Editor Stage Design

**Goal:** Add a new `party-editor` stage that opens from the campaign map, renders the first-pass team-editing screen, and establishes one shared formation-stage data entry point consumed by both the party editor and battle UI.

## Why This Design Exists

The requested feature is not just a one-off menu page. It is the first visible owner for a longer-lived formation-editing surface that will later host a live mini-board preview.

If this first slice lands as a map-local popup or overlay-only view, the repository will immediately create two problems:

- team-editing UI state will be coupled to map rendering concerns
- battle and party editing will drift into separate formation display pipelines before the shared board preview work even begins

This design therefore treats the new page as a formal stage and introduces a shared formation-stage application seam now, even though the current milestone only needs visual display.

## Current Baseline

At baseline in the current branch:

- top-level rendering already distinguishes stage types such as `map`, `city`, `house`, `scene`, and `battle`
- map-stage controls render directly from `src/ui/views/map/map-view.ts`
- card / valuable / detail screens use the existing overlay path, but that path is intentionally lighter-weight than a real stage
- `src/domain/battle-formation.ts` already defines the canonical nine-slot formation model
- battle and map do not yet consume a shared formation-stage read model

Compared with the referenced `codex/mod-first-dev-20260716-sync-worktree-5` architecture direction, the current branch still lacks a dedicated stage/data seam for team editing and still needs an explicit application-layer ownership point for shared formation presentation.

## Product Scope

### In Scope

- map-stage only entry button labeled `部队`
- new `party-editor` stage
- top resource bar with placeholder slots for `金钱`, `食物`, `马匹`, and expandable future resources
- left-side team list showing one entry: `朱重八本队`
- nine-slot team thumbnail driven from shared formation-stage data
- right-side command list showing:
  - `解散队伍`
  - `组建队伍`
  - `排序队伍`
  - `解雇单位`
  - `招兵买马`
  - `退出`
- `退出` as the only working button on the page
- one shared formation-stage data entry point consumed by both the party-editor stage and battle stage
- placeholder or demonstrative data wired through real application boundaries rather than hardcoded in the view

### Out Of Scope

- implementing team-editing business actions
- implementing resource persistence or real economy reads
- drag/drop formation editing
- live mini-board simulation behavior
- expanding the map button to city / house / scene / battle stages
- redesigning battle mechanics or battle flow

## Target Architecture

The target ownership shape for this slice is:

```text
map action -> navigation/app action -> currentView = party-editor
                                      -> shared formation-stage state

shared formation-stage state -> party-editor stage view model -> party-editor view
shared formation-stage state -> battle view model / preview adapter -> battle view
```

At end state:

- map owns only the entry control
- stage routing owns when the party editor is active
- formation display data comes from one application-owned seam
- battle and party editor do not each maintain their own thumbnail source

## Design Decisions

### 1. Party Editor Is A Real Stage

The new page will be added as a formal stage, not as an overlay.

Reasoning:

- future mini-board rendering needs a durable page lifecycle
- a real stage fits the repository's existing `map / city / house / scene / battle` ownership pattern
- this avoids promoting map-local UI into a hidden second navigation system

### 2. Shared Formation Data Gets Its Own Application Seam

The page will not read formation members directly from ad hoc view-local placeholder constants.

Instead, the implementation will add a shared formation-stage seam in the application layer that can provide:

- resource slot display data
- current team summaries
- nine-slot preview data
- future board-preview input data

This seam can initially serve demonstrative placeholder content, but the placeholder data must be injected there rather than in `ui/views`.

### 3. Battle And Party Editor Share The Same Entry Point

The battle side must be updated in this slice to consume the same formation-stage input boundary, even if battle still renders only limited formation-facing visuals.

This avoids a fake abstraction where the new page uses a “future-ready” path but battle still owns a separate implicit source.

### 4. View Files Stay Render-Only

The new party-editor view and any shared formation preview renderer must remain render-only modules.

They may format display strings and CSS classes, but must not:

- create gameplay state
- own placeholder business branches
- synthesize independent team data sources

### 5. Main Runtime Must Not Grow New Concrete UI Glue

This feature must not be implemented by dropping page-specific business branches into `src/main.ts`.

The new stage, actions, and view-model assembly must be wired through the existing application/presenter/render seams instead.

## Module Boundaries

### Domain

Add a dedicated domain module for party-editor-facing data types, for example:

- `PartyEditorStageState`
- `PartyEditorResourceSlot`
- `PartyEditorTeamSummary`
- `PartyEditorCommandItem`

The nine-slot formation content should reuse `BattleFormation`, `BattleFormationMember`, and `BattleFormationSlotKey` from `src/domain/battle-formation.ts` rather than duplicating slot concepts.

### Application

Add a shared formation-stage application seam, for example under:

- `src/application/formation/formation-stage.ts`
- `src/application/formation/formation-stage-view-model.ts`

Responsibilities:

- own the placeholder formation-stage source for this milestone
- expose one shared read-model entry point
- shape output for both party-editor and battle consumers
- leave room for later replacement with real persisted or runtime-controlled formation data

### Presenter

Extend presenter stage output with:

- `type: "party-editor"`

The presenter should resolve stage ownership from the same top-level view routing that already selects `map`, `city`, `house`, `scene`, and `battle`.

### UI

Add a new render-only party-editor stage view under:

- `src/ui/views/party/party-editor-view.ts`

If useful, extract a render-only shared preview module such as:

- `src/ui/views/party/formation-preview-grid.ts`

Battle UI should consume the shared formation-stage read model through an adapter/view-model seam rather than constructing formation preview input ad hoc inside the battle view.

## UI Structure

### Map Entry

The map stage shows one new left-bottom button:

- label: `部队`
- visible only when the active stage is `map`

Selecting it switches the active stage to `party-editor`.

### Party Editor Layout

The page is divided into three primary regions plus a top strip:

#### Top Resource Bar

- renders resource slots from a resource-slot array
- current first-pass labels: `金钱`, `食物`, `马匹`
- includes at least one reserved slot shape for future expansion
- values may be demonstrative placeholders in this milestone

#### Left Team Column

- renders a list shell, even though current story state only exposes one team
- current single visible team: `朱重八本队`
- team card includes:
  - title
  - optional subtext / summary line
  - nine-slot formation thumbnail

#### Right Command Column

- renders the full command list as buttons
- only `退出` is interactive
- all other buttons remain display-only and visually non-active

#### Exit Behavior

- `退出` is the only working close control
- it returns the player to the map stage
- no backdrop close, ESC close, or extra corner back button should be added in this slice

## Data Model Direction

The shared formation-stage seam should be able to express at least:

- visible resources
- active team collection
- selected team id
- formation preview per team
- future board-preview input

A minimal first-pass shape can look like:

```ts
type FormationStageState = {
  resources: PartyEditorResourceSlot[];
  teams: {
    id: string;
    name: string;
    summary: string;
    formation: BattleFormation;
  }[];
  selectedTeamId: string;
};
```

This is intentionally read-model-friendly and future-safe for:

- replacing placeholder resources with real economy data
- adding more teams later
- feeding a richer real-time board preview later

## Interaction Rules

### Implemented Now

- map `部队` button opens party-editor stage
- `退出` button returns to map stage

### Explicitly Not Implemented Now

- team switching logic beyond single-team display
- command execution for non-exit actions
- formation editing
- resource mutation
- recruitment / dismissal / sorting flows

## Testing Strategy

Implementation should add targeted coverage for the new ownership claims.

### Required Contract Checks

- map-stage rendering includes the `部队` button only on the map stage
- stage routing can enter `party-editor`
- `party-editor` renders:
  - top resource bar
  - `朱重八本队`
  - nine-slot preview
  - six command items
- only `退出` emits the close action
- battle and party-editor consumers both read through the same formation-stage data entry point

### Required Commands

- `npm run typecheck`
- `npm test`
- `npm run build`

## Risks

- The biggest risk is faking “shared data” by duplicating the same placeholder constants in two UI modules.
- Another risk is making party-editor a stage in name only while still routing entry/exit through overlay-specific assumptions.
- A third risk is letting battle continue to own a hidden private formation source, which would force rework when the real-time board preview arrives.

## Exit Conditions

- `party-editor` exists as a formal stage
- map stage exposes the `部队` entry button and no other stage does
- party-editor renders the required visual layout
- `退出` is the only working button on the page
- party-editor and battle consume one shared formation-stage data entry point
- placeholder data is owned by application/domain seams, not embedded inside render-only views
