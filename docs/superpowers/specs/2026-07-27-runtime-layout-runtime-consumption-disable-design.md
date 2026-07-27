# Runtime Layout Runtime Consumption Disable Design

## Status

- Status: `proposed`
- Date: `2026-07-27`
- Owner: `Codex`
- Scope: `Temporarily removes runtime consumption of the current runtime-layout registry and building runtime layout mechanisms across all entrypoints while preserving authored layout data in Script Editor projects, exported packs, imported packs, and built-in scenario packs.`

---

## 1. Purpose

The current project has already promoted two layout systems into formal runtime truth:

- the runtime-layout registry and runtime UI layering contract
- the building runtime layout mechanism driven by arrangement layout data

The requested temporary rollback changes that runtime truth:

- all runtime entrypoints must return to the old unified shell UI
- layout data must remain in project and pack data
- runtime must ignore layout data instead of failing closed on it

This is not a data migration and not a delete-and-replace exercise.

It is a runtime-consumption rollback.

---

## 2. Requested Outcome

1. Normal startup, JSON import startup, built-in scenario startup, and Script Editor runtime preview all render through the old unified shell UI.
2. Runtime no longer consumes the current runtime-layout registry.
3. Building runtime no longer consumes arrangement layout structure for visual composition.
4. Existing layout data remains stored in authoring, export, import, and built-in content.
5. Layout data does not block loading, does not get auto-cleaned, and does not become runtime truth.

---

## 3. Design Goals

1. Re-establish one runtime UI truth: the old unified shell UI.
2. Preserve all authored layout data for future re-enable work.
3. Keep business routing on the current formal event/menu/runtime contracts.
4. Make all runtime entrypoints behave the same way.
5. Avoid `main.ts` building-specific fallback branches.

---

## 4. Non-Goals

- deleting layout data from projects, packs, or built-in content
- hiding or removing Script Editor layout authoring surfaces
- reintroducing old private routing logic for building actions, menu actions, or event continuation
- partially disabling layout only for one entrypoint
- preserving per-building visual parity from the current layout mechanism

---

## 5. Current Problem

Today the repository treats runtime layout as formal runtime truth:

- runtime screen layout resolves through the UI contract registry
- building runtime rendering resolves structure through arrangement layout
- tests and closed governance records explicitly claim building runtime rendering works without house fallback

Because of that, simply "not consuming" layout globally would otherwise cause:

- inconsistent UI between entrypoints
- broken or degraded building views
- contradiction with current formal runtime ownership

The rollback therefore needs to do one explicit thing:

- replace layout-owned runtime display structure with one deliberate old unified shell structure everywhere

---

## 6. Canonical Rollback Rule

### 6.1 Runtime Display Truth

Runtime display truth becomes:

- old unified shell UI only

Runtime display truth is no longer:

- runtime-layout registry selection
- arrangement layout node composition
- layout-template-driven building structure

### 6.2 Data Preservation Rule

Layout data remains valid stored content in:

- Script Editor project state
- runtime-pack export/import payloads
- built-in scenario content

But that data becomes runtime-inert:

- saved
- loaded
- preserved
- ignored by runtime rendering

### 6.3 Routing Ownership Rule

This rollback changes display structure ownership only.

It must not change:

- menu resource and instance routing ownership
- event-owned continuation ownership
- settlement and playable write-back ownership
- current building action event dispatch ownership

If the old unified shell needs action buttons, those actions must still be sourced from the formal menu and event chains rather than from retired hardcoded behavior.

---

## 7. Architecture

### 7.1 Global Runtime Layout Rollback

The runtime UI contract path must stop treating runtime layout as an active runtime dependency.

Runtime may still resolve:

- schema
- skin
- assets

Runtime must stop resolving:

- layout presets as active display structure truth

The runtime screen contract should therefore behave as though layout is absent at runtime, even when layout data exists in the underlying project or pack.

### 7.2 Building Runtime Layout Rollback

The building module view must stop rendering from:

- arrangement layout templates
- layout nodes
- layout-specific section composition

It must render from one fixed old-shell structure instead.

That fixed structure must support:

- building title
- optional description
- visible roster or speaker area
- action area
- leave action

The source of actions and character content remains current canonical runtime data.

Only the structure becomes fixed again.

### 7.3 Shared Entry Consistency

All entrypoints must converge onto the same display rollback path:

- normal start
- JSON import start
- built-in pack start
- Script Editor preview

No entrypoint may keep layout-on while another uses layout-off.

---

## 8. Module-Level Change Plan

### 8.1 Runtime UI Contract Layer

Primary files:

- `src/application/ui/ui-contract-registry.ts`
- `src/application/ui/ui-layout-resolver.ts`
- any runtime presenter/view consumers that currently require `resolvedScreenContract.layout`

Required change:

- runtime layout resolution becomes inactive for runtime consumption
- layout-presence in data remains tolerated
- runtime falls back to fixed old-shell structure rather than registry-owned layout

### 8.2 Building Runtime Display Layer

Primary files:

- `src/ui/views/building/building-module-view.ts`
- `src/application/building/building-module-entry.ts`
- any presenter output that exists only to support layout-node rendering

Required change:

- stop calling layout-template-based structural rendering as the primary runtime view path
- restore one fixed building shell renderer
- continue consuming canonical building arrangement metadata where still needed for non-layout meaning such as:
  - display name
  - description
  - mounted NPC roster
  - action-menu actions

### 8.3 Data Preservation Layer

Primary files for guard adjustment only, not data removal:

- project loader and serializer
- runtime-pack export/import
- built-in pack loading

Required change:

- no fail-closed rejection just because layout data exists
- no auto-cleaning or migration-out of layout data
- no runtime assumption that persisted layout must be consumed

### 8.4 Preview and Startup Consistency Layer

Primary files:

- preview startup path
- scenario startup path
- runtime app-state bootstrap seams

Required change:

- all startup and preview paths point to the same old-shell renderer and screen-structure behavior

---

## 9. Old Unified Shell Contract

The rollback requires a single explicit shell contract instead of implicit "whatever survives after layout is removed".

For building runtime, the fallback shell should include:

1. a stable outer building section
2. a header with building name and back/leave action
3. a description block when authored
4. a roster or focus section for present NPCs
5. an action list sourced from current menu resource and instance truth

For non-building runtime screens, the shell should similarly use fixed structure rather than layout-registry ownership.

This means the rollback is allowed to reduce visual richness, but it must not produce:

- empty pages
- missing actions
- entrypoint-specific structure drift

---

## 10. Testing Strategy

This rollback must invert the current proof model.

### 10.1 Tests To Replace

Existing assertions that require runtime layout consumption must be rewritten from:

- "layout is formal runtime truth"

to:

- "layout data may exist, but runtime ignores it and still renders the old unified shell"

### 10.2 Required New Coverage

1. Runtime ignores registry layout across all covered runtime entrypoints.
2. Building runtime ignores arrangement layout and still renders the old building shell.
3. Menu actions still work through the current formal menu/event chain under the old shell.
4. Script Editor preview matches normal startup and JSON import behavior.
5. Export/import/load preserve layout data without requiring runtime to consume it.

### 10.3 Browser Acceptance

Browser proof must cover at least:

1. built-in startup
2. JSON import startup
3. Script Editor preview
4. entering at least one building with visible actions
5. leave-path recovery

The acceptance question is not "does layout render?"

It becomes:

- "does every entrypoint show the same old-shell UI while preserving runtime functionality?"

---

## 11. Risks

### 11.1 Governance Contradiction

The active Blueprint version currently records runtime layout as closed formal runtime truth.

This rollback is therefore not a small patch.

It is an intentional reversal of part of the current runtime ownership model and should be routed as:

- either a same-version contradiction repair inside the active required-final queue
- or a new governed rollback queue if current acceptance ownership cannot absorb it honestly

### 11.2 Visual Regression

Buildings and other runtime surfaces will lose the current layout-driven visual structure.

This is accepted by the requested goal, but it must be deliberate and uniform rather than accidental.

### 11.3 Hidden Runtime Dependencies

Some current views may depend on layout-derived structure more deeply than they appear to.

The rollback must therefore start with failing tests that prove:

- old shell renders enough structure
- action reachability still works
- no entrypoint goes blank

---

## 12. Recommended Implementation Direction

The recommended implementation sequence is:

1. add failing tests proving runtime must ignore layout while preserving function reachability
2. restore fixed old unified shell building rendering
3. disable runtime screen-layout consumption
4. unify normal startup, JSON import, built-in pack, and preview onto the same rollback path
5. update acceptance and governance evidence to reflect the deliberate runtime rollback

This is safer than deleting data or adding loader rejection because it preserves future re-enable options while meeting the temporary rollback goal.

---

## 13. Open Governance Note

This design is compatible with the user-requested behavior, but it conflicts with the currently closed ACC-FORMAT-005 ownership claim that runtime layout is formal runtime truth.

Before implementation starts, the next planning step must explicitly route one of these:

1. absorb the rollback into the active `ACC-FORMAT-006` contradiction-repair path
2. reopen or supersede the runtime-layout ownership truth through a new governed queue

Implementation should not start until that routing is written into the governed plan.
