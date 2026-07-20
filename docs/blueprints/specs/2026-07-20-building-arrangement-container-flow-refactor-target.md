# Building Arrangement Container Flow Refactor Target

## Control Block

- version_id: `target.building-arrangement-container-flow-refactor`
- version_label: `Building arrangement, generic containers, flow playable, and legacy house retirement`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Replace hardcoded special house behavior with Script Editor-authored building arrangements, generic containers, event-triggered flow playables, migrated built-in content, and full retirement of legacy house modules without compatibility fallback.`

### Version Draft Summary

- Goal:
  - `Promote MEMO-022 and the reviewed evidence draft into a formal governed implementation target for building arrangement and house-runtime retirement.`
- Required outcomes:
  - `Building templates become behavior-free definitions.`
  - `City-local buildingArrangements become the canonical concrete building instance structure.`
  - `Generic containers describe runtime building panels, including character seats and action menus.`
  - `Container item actions trigger events that can start dialogue, effects, scenes, flow playables, minigames, or battles.`
  - `A new flow playable family covers ordinary authored building functions through the shared playable lifecycle and presenter.`
  - `The Script Editor Playable/玩法 module can author flow playable definitions, nodes, launch payloads, result routes, and event-start targets as first-class content.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview consume the same building arrangement and playable contracts.`
  - `The built-in Zhu Yuanzhang pack migrates to the new structures.`
  - `Old house module contracts, module ids, house sessions, and house view/runtime paths are removed after migration, not merely bypassed.`
- Explicit non-goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer new arrangements from houses.characterIds, defaultCharacterId, cityEntries, or cityNpcPools.`
  - `Do not create one runtime branch per new building type.`
  - `Do not move gameplay logic back into building runtime shell code.`
  - `Do not use out-of-scope wording to retire unimplemented MEMO-022 capability.`
  - `Do not constrain future custom minigames with a new broad permissions/security layer in this version.`
- Must preserve:
  - `Current city/building entry from normal start, JSON runtime pack import, and Script Editor runtime preview.`
  - `Existing city/building module entry seams until replaced by the generic building shell.`
  - `EventBindingRuntime trigger discipline where event bodies and bindings remain separated.`
  - `Unified playable lifecycle, settlement, and handoff semantics.`
  - `textId/dialogueId content resolution for exported runtime packs.`
  - `Existing built-in building functions as authored data after migration, including temple work/rest/donation-like actions, grain shop trade/accounting-like actions, medicine treatment/compounding-like actions, tea/tavern interaction-like actions, and leave behavior.`
- Must replace:
  - `HouseDefinition.moduleId, characterIds, and defaultCharacterId as behavior or roster sources.`
  - `cityEntries as the canonical city building instance source.`
  - `cityNpcPools as the canonical mounted NPC source for building UI.`
  - `locationAccess building-entry portions as standalone old building gate ownership.`
  - `src/application/house-modules/*`
  - `src/application/house-modules/house-module-registry.ts`
  - `src/core/registry/house-module-*`
  - `src/core/runtime/house-runtime*`
  - `src/ui/views/house/*-house-view.ts`
  - `docs/special-house-interface.md as the active rule for new building behavior.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.building-arrangement-canonical-schema` | `required` | `Define the parent data schema for behavior-free building templates, city buildingArrangements, containers, activeBuilding, and migration validation contracts.` | `Admit first because later editor/runtime/pack queues need stable names and fail-closed validation rules.` |
| `queue.script-editor-building-arrangement-authoring-ux` | `required` | `Expose 建筑编排, arrangement mounted NPCs, container authoring, and no-empty-data display behavior in Script Editor.` | `Admit after canonical schema exists and no earlier than schema validation tests.` |
| `queue.runtime-building-shell-and-container-rendering` | `required` | `Render generic building shell from arrangements/containers, support system leave, enter/exit rules, and activeBuilding save/restore.` | `Admit after schema and enough editor/export data exist to provide runtime fixtures.` |
| `queue.building-container-event-trigger-integration` | `required` | `Wire container item actions to event trigger context and event actions such as dialogue/effects/scene/playable/closeBuilding.` | `Admit after runtime shell exposes container dispatch points.` |
| `queue.flow-playable-runtime-and-presenter` | `required` | `Add family=flow, building owner kind, flow nodes, presenter layouts, settlement, and handoff through shared playable runtime.` | `Admit as shared-contract queue after schema identifies owner/context and before migrated building functions rely on flow.` |
| `queue.script-editor-flow-playable-authoring-ux` | `required` | `Expose first-class Script Editor authoring for flow playables, including node details, launch payloads, outcome routes, event-start targets, import/export validation, and preview data.` | `Admit after the flow runtime contract is defined and before migrated building functions require authored flow data.` |
| `queue.zhuyuanzhang-building-arrangement-pack-migration` | `required` | `Migrate built-in Zhu Yuanzhang buildings/functions/NPC seats/action menus into arrangements, containers, events, and playables without old fallback.` | `Admit after editor/export/runtime shell and flow contracts can consume migrated data.` |
| `queue.legacy-house-runtime-retirement` | `required` | `Delete old house modules, registries, session types, view modules, deprecated data fields, and superseded docs/governance.` | `Admit only after migration and runtime acceptance prove replacement behavior is complete.` |
| `queue.building-arrangement-final-acceptance-and-removal-guard` | `required-final` | `Run final cross-entrypoint browser/automated acceptance plus source guards proving no over-narrowing or old-house residue remains.` | `Admit last; it cannot be the primary owner for implementation acceptance.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-BUILDING-FLOW-001` | `Building templates carry only presentation/category/default-art metadata and no NPCs, module ids, menus, functions, or behavior binding.` | `queue.building-arrangement-canonical-schema` | `schema tests + source guard` | `src/domain/script-editor-project.ts; runtime pack contracts; scenario loader/export tests` | `Any new or retained building template behavior field remains canonical.` |
| `ACC-BUILDING-FLOW-002` | `City-local buildingArrangements own concrete city building instances, mounted NPCs, primary NPC, containers, visible/enter/exit rules, and city-local display/background values.` | `queue.building-arrangement-canonical-schema` | `schema/export/import tests` | `src/domain/script-editor-project.ts; src/application/script-editor/city-building-authoring.ts; runtime pack materializer/export/import` | `cityEntries, cityNpcPools, or house fields remain canonical authoring truth.` |
| `ACC-BUILDING-FLOW-003` | `Generic containers support at least character-seats, action-menu, status-panel, text-panel, image-panel, and resource-panel entry points without hardcoding business-specific house UI.` | `queue.script-editor-building-arrangement-authoring-ux` | `UI tests + browser proof` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/**; runtime shell view model` | `Seat/menu UI works only for a named building or removes future container type entry points.` |
| `ACC-BUILDING-FLOW-004` | `Container item actions emit buildingContainerItemAction context and event actions can start dialogue, effects, scenes, flow/minigame/battle playables, or closeBuilding.` | `queue.building-container-event-trigger-integration` | `runtime tests + event export/import tests` | `src/domain/event.ts; src/application/script-editor/runtime-pack-export.ts; EventBindingRuntime entrypoints; runtime dispatch` | `Container actions bypass event runtime or require per-building runtime code.` |
| `ACC-BUILDING-FLOW-005` | `flow is a first-class playable family using unified launch/session/presenter/reduce/settlement/handoff, with building owner kind and minimum flow nodes.` | `queue.flow-playable-runtime-and-presenter` | `shared contract tests + presenter tests` | `src/core/contracts/playable-runtime.ts; src/core/runtime/playable-runtime.ts; playable registries; presenter/view modules` | `Flow is implemented as hardcoded building menu logic or bypasses playable runtime.` |
| `ACC-BUILDING-FLOW-006` | `Runtime building shell renders from arrangement containers, preserves activeBuilding save/restore, supports system leave, and applies enter/exit rules without crashing on empty mounted data.` | `queue.runtime-building-shell-and-container-rendering` | `runtime/state/browser tests` | `src/application/building/**; src/ui/views/building/**; state save/restore paths; navigation/runtime entry` | `Runtime still depends on HouseRuntime session or crashes when no NPC/container exists.` |
| `ACC-BUILDING-FLOW-007` | `Built-in Zhu Yuanzhang pack migrates existing building behavior and rosters to buildingArrangements, containers, events, and playables with no compatibility fallback.` | `queue.zhuyuanzhang-building-arrangement-pack-migration` | `pack migration tests + browser proof` | `src/content/scenario-packs/zhuyuanzhang/**; tests/**` | `Template behavior depends on old house modules or old inferred roster data.` |
| `ACC-BUILDING-FLOW-008` | `Old house module code, registries, session types, view modules, and deprecated data fields are removed after migration; docs/AGENTS governance is superseded.` | `queue.legacy-house-runtime-retirement` | `source-removal guards + docs lint` | `src/application/house-modules/**; src/core/registry/house-module-*; src/core/runtime/house-runtime*; src/ui/views/house/**; docs/special-house-interface.md; AGENTS.md` | `Old code remains as active fallback, moduleId survives, or docs still require new house modules.` |
| `ACC-BUILDING-FLOW-009` | `Final acceptance proves normal start, JSON import, Script Editor runtime preview, empty/no-display behavior, populated seats, action menus, flow launch, leave behavior, and no over-narrowing across all required queues.` | `queue.building-arrangement-final-acceptance-and-removal-guard` | `browser simulated-human + acceptance coverage review` | `tests/**; browser flow; source guards; version acceptance ledger` | `The version passes only by narrowing away MEMO-022 capability or accepting unrouted same-family residue.` |
| `ACC-BUILDING-FLOW-010` | `Script Editor can create, edit, validate, import, export, and preview first-class flow playable records, including generic node details, launch payloads, outcome routes, owner context, and event-start target selection without treating flow as a minigame-only binding.` | `queue.script-editor-flow-playable-authoring-ux` | `editor unit tests + export/import tests + browser proof` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js; runtime-pack export/import; workspace validation` | `Flow authoring is hidden inside minigame binding UI, cannot export runtime data, or lacks event target wiring.` |

### Acceptance Criteria

- `The version may close only after every acceptance id is covered, blocked, or explicitly waived with reason.`
- `Every child queue must inherit the parent spec and record an over-narrowing guard before implementation.`
- `No child queue may shrink the total spec, delete an unimplemented capability as unsupported, or write out-of-scope as retired without first updating this target spec and every affected queue.`
- `Every completed child queue must perform a completion completeness review, with at most one high-priority gap-fill pass before routing remaining gaps.`
- `Final validation must include automated checks, source-removal guards, and browser/simulated-human evidence across normal start, JSON import, and Script Editor runtime preview.`
