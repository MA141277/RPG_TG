# UI Contract Reserve Spec

## 1. Goal

Define the formal `Child 12 UI Contract Reserve` boundary for the current mod-first roadmap.

Child 12 exists to reserve the future UI contract, pack UI table, and resource-layering seams needed for later UI override and Editor work, while keeping the current runtime ownerization queue and current gameplay/runtime behavior unchanged.

## 2. Basic Information

- Child name: `UI Contract Reserve`
- Child index: `Child 12`
- One-line responsibility:
  - reserve formal UI contract, pack UI split-table, and asset-layering seams without enabling Editor mode or changing the current runtime/render entry path
- Architecture position:
  - immediate post-Child-11 UI layout/interface-reserve child that preserves future UI direction and unlocks Child 13 after completion
- Primary target areas:
  - formal UI contract typing
  - pack UI split-table reserve
  - asset alias and layering reserve
  - Executor / future Editor boundary reserve

## 3. Governing Inputs

Child 12 is governed by these documents in this priority order:

1. `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
2. `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
3. `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`
4. this spec

If Child 12 work would contradict a higher-priority source, Child 12 must stop and update the governing docs before implementation continues.

## 4. Problem Statement

The repository now has:

- a formal runtime/request/router/settlement baseline
- a formal presenter/render seam
- manifest-driven content pack loading
- an existing `UiLayout` and layout editor path for a small set of screens

But the repository does not yet have:

- a formal UI contract boundary equivalent to the runtime contract boundaries
- a pack/mod-level UI split-table protocol
- a unified alias-based resource-layering rule for builtin, pack, mod, and user assets
- a formal boundary between Executor-facing UI runtime and future Editor-facing UI tooling

Without Child 12:

- future UI override work would continue to piggyback on ad hoc layout/resource structures
- future Editor work would risk redefining runtime contracts from the tool side
- pack/mod/user resource handling would continue to depend on scattered paths instead of a stable contract
- later UI override work would have no agreed safe insertion point in the mod-first architecture

## 5. Child 12 Objective

Child 12 must reserve a formal future UI boundary without changing the current executable queue.

Child 12 must:

- define the future formal UI contract types
- define the future pack UI split-table direction
- define the future asset alias and layering direction
- reserve Executor / future Editor boundaries
- keep all new loading and override seams additive and inactive by default

Child 12 must not reinterpret this objective as permission to:

- redesign the current runtime queue
- enable Editor mode
- migrate current screens onto a new renderer path
- force current packs or mods to adopt new UI fields immediately

## 6. Scope

Child 12 includes exactly these workstreams.

### 6.1 Formal UI Contract Reserve

Child 12 must reserve these future contract surfaces:

- `ScreenSchema`
- `ScreenLayoutPreset`
- `ScreenSkinPreset`
- `UiAssetCatalog`

Minimum requirements:

- the contract boundary is explicit in `src/domain/ui/**`
- the contract is additive relative to the current `UiLayout` path
- the contract does not change current runtime or render ownership by itself

### 6.2 Pack UI Split-Table Reserve

Child 12 must reserve optional future pack fields for:

- `uiLayouts`
- `uiSkins`
- `uiAssetCatalogs`

Optional future reserve:

- `uiScreenSchemas`

Minimum requirements:

- current packs remain valid if none of these fields exist
- `houses` remains a separate table from `cities`
- pack UI split tables are reserved as future content-pack inputs, not current required runtime content

### 6.3 Resource Layering Reserve

Child 12 must define the future resource layering order:

`builtin -> pack -> mod -> user`

Minimum requirements:

- UI resource references move toward alias ownership, not direct file-path ownership
- builtin remains the required fallback source
- `user` remains a future disabled reserve, not a current required load source

### 6.4 Executor / Future Editor Boundary Reserve

Child 12 must define the future relationship between:

- `Executor`
- future `Editor`

Minimum requirements:

- both remain in the same repository
- both consume the same formal UI contract
- Editor-only metadata must not enter current `GameState`
- current runtime/render behavior must not depend on Editor presence

## 7. Explicit In Scope Files

### Primary Reserve Surface

- `src/domain/content-pack.ts`
- `src/application/content/content-pack-loader.ts`
- `src/domain/ui/**` (new)
- `src/application/ui/**` (new)
- `src/content/ui/**` (new)
- `tests/robustness.test.cjs`
- `docs/change-log.md`

### Governance Surface

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- `docs/superpowers/plans/2026-07-01-ui-contract-reserve-plan.md`
- this spec

## 8. Out Of Scope

Child 12 does not include:

- current runtime ownerization work
- boot/startup redesign
- Mod Runtime redesign
- Save / Load Runtime redesign
- StateSync Runtime redesign
- presenter/render redesign
- enabling Editor mode
- changing current `src/main.ts` render entry
- changing current layout editor interaction flow
- migrating current screens to schema-driven rendering
- opening schema extension to ordinary packs or mods
- `ui.action.rebind`
- direct user-content runtime loading

## 9. Current Runtime Protection Rules

Child 12 must preserve these runtime guarantees:

- current default game boot still works without any UI split tables
- current builtin screen rendering still works without any new UI contract consumer
- current layout editor path still works through the existing `UiLayout` path
- current pack and mod manifests remain valid without any UI reserve fields
- current weekly executable child remains Child 11 until Child 11 completes
- Child 12 remains the immediate post-Child-11 UI layout/interface-reserve child in queue order
- Child 12 completion is the governance gate that unlocks Child 13 for later runtime convergence review

## 10. Reserve Contract Direction

### 10.1 ScreenSchema

Future role:

- declare the allowed component set for a screen
- declare which components are required
- declare which layout and skin capabilities each component supports
- declare which data bindings are legal

### 10.2 ScreenLayoutPreset

Future role:

- hold position, size, z-index, visibility, and element rect data only

Must not own:

- direct file paths
- gameplay behavior
- action semantics

### 10.3 ScreenSkinPreset

Future role:

- hold backgrounds, frames, icons, text styles, variants, and slice data only

Must not own:

- gameplay behavior
- action semantics

### 10.4 UiAssetCatalog

Future role:

- map alias to runtime asset URL
- enable resource layering and fallback

## 11. Pack And Mod Reserve Rules

### 11.1 Pack Reserve

Future content-pack manifests may include:

- `uiLayouts`
- `uiSkins`
- `uiAssetCatalogs`

But Child 12 must keep them:

- optional
- additive
- backward-compatible

### 11.2 Mod Reserve

Future mod capabilities may include:

- `ui.layout.override`
- `ui.skin.override`
- `ui.asset.override`

Child 12 must not enable:

- `ui.schema.extend`
- `ui.action.rebind`

### 11.3 `cities` vs `houses`

Child 12 must preserve `houses` as an independent pack table.

Reason:

- `cities` act as region/container definitions
- `houses` act as enterable runtime/business nodes
- current repository behavior already treats house definitions as independent runtime entities rather than nested display-only city children

## 12. Resource Layering Rules

Child 12 must define the future precedence order:

`user > mod > pack > builtin`

And the storage/ownership expectations:

- builtin assets are the mandatory fallback
- pack assets define pack-owned defaults
- mod assets define activation-owned overrides
- user assets remain a future local override layer and are not enabled in Child 12

## 13. Future Executor / Editor Boundary

Future Editor work may:

- edit layout
- edit skin
- edit asset alias mapping within allowed scopes

Future Editor work must not:

- redefine gameplay logic
- redefine action contracts
- widen screen schema behavior casually
- write editor metadata into runtime gameplay state

Child 12 itself must only reserve this boundary and must not implement Editor mode.

## 14. Acceptance Criteria

Child 12 is acceptable only if:

- the future UI contract boundary is explicit
- pack UI split-table reserve is explicit and backward-compatible
- resource layering order is explicit
- `houses` remains distinct from `cities`
- current runtime behavior remains unchanged by default
- current layout editor path remains on the existing flow
- Child 12 remains the immediate post-Child-11 UI layout/interface-reserve child and does not reorder the queue behind Child 13

## 15. Verification Requirements

Child 12 completion requires:

- structural tests for the new UI contract exports
- backward-compatible content-pack loader tests
- no-op/default-path tests proving current behavior does not require the new UI reserve fields
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans`

## 16. Escalation Rules

Child 12 must stop and update the governing docs before continuing if a change would:

- alter Child 11 execution order
- require current `src/main.ts` UI/render redesign
- require current layout editor redesign
- force existing packs or mods to adopt UI reserve fields
- enable Editor mode during Child 12
- move UI/resource planning back into Child 11 scope

Required docs to update before continuing:

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- this spec
- the Child 12 plan

## 17. Done-Enough Exit Condition

Child 12 is done enough only when:

- the repository has explicit future UI contract types and reserve seams
- the repository has backward-compatible optional pack UI reserve fields
- the repository has explicit resource layering rules
- the repository has explicit Executor / future Editor boundaries
- all of the above land without changing current default runtime behavior

If those answers remain ambiguous, Child 12 is not complete.
