# Script Editor Event-Centered Authoring, Scene Retirement, And Portrait Resource Refactor Target

## Control Block

- version_id: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- version_label: `Event-centered authoring, scene retirement, and portrait resource convergence`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Turn Script Editor authoring into an event-centered creator-facing system, retire scene as a formal creator-facing/runtime family without compatibility residue, preserve building function meaning through function -> event -> dialogue/minigame/task/function, and add project-level portrait resources with stable authoring/preview/runtime mapping.`

### Version Draft Summary

- Goal:
  - `Promote MEMO-025 and its evidence draft into a governed successor target for event-centered authoring, no-scene routing truth, event-only routing-family convergence, runtime-pack/runtime-state convergence, and portrait resource ownership.`
- Required outcomes:
  - `dialogue / function / minigame / task become one event-centered creator-facing model.`
  - `event becomes the only formal routing owner.`
  - `scene is removed from Script Editor visible families, project formal structure, runtime pack canonical families, runtime state truth, startup truth, and presenter truth.`
  - `backgrounds move to city / building / building-arrangement ownership.`
  - `narration, speaker lines, portrait references, portrait side, and choice presentation move to dialogue authoring.`
  - `building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation may still route through arrangement / event-binding / flow / playable.`
  - `trigger timing and shared trigger-context contracts are frozen across building, dialogue, minigame, and task environments.`
  - `editor preview, runtime export/import, runtime loading, and reference resolution converge on the same no-scene event-centered model.`
  - `building-function, task, and flow do not survive as alternate routing owners next to event once their orchestration duties are formally replaced.`
  - `flow-originated event/reference semantics are replaced by first-class event/event-binding ownership across editor-visible references, export/import, loader resolution, preview behavior, and runtime behavior.`
  - `event-owned minigame/playable destinations lower to runnable runtime truth rather than stopping at dialogue-only export support.`
  - `building arrangement action interactions converge on one canonical event truth and do not require duplicate hidden binding truth or dead event selectors to remain runnable.`
  - `portrait resources and portrait variants become first-class project-owned authoring/runtime families with stable mapping, thumbnail, preview, and runtime continuity.`
- Explicit non-goals:
  - `Do not keep scene as hidden compatibility truth through SceneDefinition, ActionNode, scenes.json, entrySceneId, nextSceneId, activeSceneId, scene-local callback chains, or dialogue-to-scene lowering seams.`
  - `Do not implement compatibility layering, temporary shims, bridge exports, or dual-path truth for scene retirement.`
  - `Do not preserve building-function, task, or flow as thin hidden routing wrappers once event-only routing replacement is claimed.`
  - `Do not move building business meaning back into hardcoded runtime branches.`
  - `Do not split portrait resource convergence into a different target/version.`
- Must preserve:
  - `Creator-facing building meaning function -> event -> dialogue/minigame/task/function.`
  - `Implementation-facing building path arrangement / event-binding / flow / playable where appropriate.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview convergence.`
  - `Dialogue/minigame/task follow-up behavior after scene retirement.`
  - `Stable id-based portrait references across authoring/export/import/runtime.`
- Must replace:
  - `SceneDefinition`
  - `ActionNode`
  - `project.scenes`
  - `entrySceneId`
  - `nextSceneId`
  - `activeSceneId`
  - `scenes.json`
  - `dialogue-story-runtime-materializer`
  - `scene-runner`
  - `scene runtime/session truth as canonical owner`
  - `people-driven portrait option discovery`
  - `person-owned portrait file-path truth`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-event-centered-authoring-model-unification` | `required` | `Unify creator-facing content ownership and event-centered destination semantics across dialogue / function / minigame / task.` | `Admit first because all later trigger, retirement, runtime, and portrait queues need stable creator-facing semantics.` |
| `queue.event-router-only-trigger-contract-freeze` | `required` | `Freeze event as the only formal router and lock the shared trigger timing + trigger-context contract.` | `Admit after model unification and before any queue deletes scene truth.` |
| `queue.scene-family-retirement-and-content-migration` | `required` | `Remove scene from authoring/project/runtime/startup/presenter truth and migrate its content responsibilities into dialogue and location ownership.` | `Admit only after event-centered model and router-only contracts are frozen.` |
| `queue.event-centered-runtime-pack-preview-export-sync` | `required` | `Converge preview/export/import/loader/reference-resolution/runtime behavior onto the no-scene event-centered model.` | `Admit immediately after scene retirement; no unrelated queue may interleave before runtime/editor/export convergence is proven.` |
| `queue.event-only-routing-family-retirement-and-reference-replacement` | `required` | `Retire building-function/task/flow as alternate routing owners and replace flow-originated event/reference truth with first-class event/event-binding ownership without merging into existing queue boundaries.` | `Admit only after queue.event-centered-runtime-pack-preview-export-sync closes; it must remain a distinct same-target queue and must execute before portrait convergence or final acceptance.` |
| `queue.event-playable-destination-and-building-action-event-truth-convergence` | `required` | `Converge event-owned minigame/playable destination lowering and building action event selection onto one runnable event truth across authoring, export/import, loader, preview, and runtime.` | `Admit only if post-closeout audit proves event->minigame/playable routing or building action event truth still diverges after the earlier routing-family replacement queue closed; it must remain distinct and must not be hidden inside final acceptance.` |
| `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `required` | `Introduce portrait resources/variants/mappings with shared authoring, preview, thumbnail, export/import, and runtime resolution rules.` | `Admit after no-scene event-centered model is stable; it must remain inside this target/version.` |
| `queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard` | `required-final` | `Run final no-over-narrowing acceptance, source-removal guards, and simulated-human proof across trigger environments and portrait creator flow.` | `Admit last; it cannot be the primary owner for implementation.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-EVENT-CENTER-001` | `Script Editor creator-facing semantics unify dialogue / function / minigame / task under event-centered authoring without requiring scene wrappers.` | `queue.script-editor-event-centered-authoring-model-unification` | `editor model tests + UI/source review` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js` | `Creators still route through scene wrappers or object-to-object direct jumps.` |
| `ACC-EVENT-CENTER-002` | `event is the only formal routing owner and the trigger timing / trigger-context contract is stable across supported environments.` | `queue.event-router-only-trigger-contract-freeze` | `contract tests + runtime entrypoint tests + source guard` | `src/domain/event.ts; EventBindingRuntime entrypoints; trigger-context contracts; tests/**` | `entrySceneId, nextSceneId, or scene callback chains remain formal routing truth.` |
| `ACC-EVENT-CENTER-003` | `scene is removed from Script Editor visible families, project formal structure, runtime pack canonical families, runtime state truth, startup truth, and presenter truth.` | `queue.scene-family-retirement-and-content-migration` | `source-removal guards + migration tests` | `src/domain/action.ts; src/domain/script-editor-project.ts; src/application/scene/**; src/application/story/**; src/application/startup/**; src/ui/views/scene/**` | `Scene is only hidden in UI while still remaining canonical runtime/export/startup truth.` |
| `ACC-EVENT-CENTER-004` | `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation may still use arrangement / event-binding / flow / playable.` | `queue.scene-family-retirement-and-content-migration` | `building runtime tests + browser proof + source review` | `src/application/building/**; src/application/script-editor/**; src/content/scenario-packs/**; tests/**` | `Building meaning drifts, bypasses event ownership, or falls back to scene-shaped configuration.` |
| `ACC-EVENT-CENTER-005` | `Editor preview, runtime export/import, runtime loading, and reference resolution converge on the same no-scene event-centered model in the same incompatible batch.` | `queue.event-centered-runtime-pack-preview-export-sync` | `export/import/loader tests + preview/runtime tests + source guard` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; preview/runtime loaders; tests/**` | `Editor can write new structures while runtime still expects old scene truth or bridge compatibility paths.` |
| `ACC-EVENT-ONLY-ROUTING-001` | `Script Editor no longer presents building-function or task as independent creator-facing routing systems parallel to event.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `UI/source review + authoring tests` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js` | `Creators can still author follow-up routing through extra module families instead of event.` |
| `ACC-EVENT-ONLY-ROUTING-002` | `Flow is removed as creator-facing routing family, runtime canonical routing family, pack canonical routing family, preview routing truth, and follow-up orchestration owner.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `source-removal guards + export/import/runtime tests` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; src/application/runtime/**; tests/**` | `Flow remains canonical truth in any editor-visible, pack, loader, preview, or runtime routing surface.` |
| `ACC-EVENT-ONLY-ROUTING-003` | `All effective flow-produced event semantics are replaced by first-class event/event-binding ownership without broken follow-up chains.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `runtime tests + preview tests + source review` | `src/application/building/**; src/application/story/**; src/application/runtime/**; tests/**` | `Deleting flow breaks trigger reachability, follow-up routing, return routing, or result dispatch.` |
| `ACC-EVENT-ONLY-ROUTING-004` | `Editor-visible references, exported references, imported references, loader resolution, preview behavior, and runtime behavior all align on the same event-only routing truth.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `round-trip tests + preview/runtime tests` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; preview/runtime loaders; tests/**` | `Editor writes event truth while export/import/loader/runtime still consume flow truth or compatibility reconstruction.` |
| `ACC-EVENT-ONLY-ROUTING-005` | `Building interaction meaning remains interaction -> event -> dialogue/minigame/task/module after creator-facing family cleanup and flow retirement.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `building runtime tests + browser proof + source review` | `src/application/building/**; arrangement-hosted interaction dispatch paths; tests/**` | `Building interactions become placeholder-only, lose meaning, or bypass event ownership.` |
| `ACC-EVENT-ONLY-ROUTING-006` | `No compatibility residue remains for flow/building-function/task routing truth once the replacement is claimed complete.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `source-removal guards + rejection tests` | `src/application/script-editor/**; src/application/runtime/**; tests/**` | `Bridge exports, loader-side reconstruction, hidden callback chains, or dual-path routing truth survive as production behavior.` |
| `ACC-EVENT-ONLY-ROUTING-007` | `Event destination family "minigame" lowers to runnable event-owned playable launch truth across editor-visible references, export/import, loader resolution, preview, and runtime rather than stopping at dialogue-only export support.` | `queue.event-playable-destination-and-building-action-event-truth-convergence` | `authoring/export/runtime tests + preview/runtime proof + source review` | `src/application/script-editor/runtime-pack-export.ts; src/domain/event.ts; src/application/building/**; src/core/runtime/playable-runtime.ts; tests/**` | `Minigame destination remains selectable in authoring but non-runnable in export, preview, or runtime.` |
| `ACC-EVENT-ONLY-ROUTING-008` | `Building arrangement action event selection and runtime trigger activation converge on one canonical event truth, so creator-facing event selection is not dead metadata and does not require duplicate hidden binding truth to stay runnable.` | `queue.event-playable-destination-and-building-action-event-truth-convergence` | `building authoring/runtime tests + browser proof + source review` | `src/application/script-editor/city-building-authoring.ts; src/application/building/**; src/core/runtime/event-binding-runtime.ts; src/main.ts; tests/**` | `Building action event selectors remain non-authoritative, dead, or duplicated by a second hidden runtime truth.` |
| `ACC-EVENT-CENTER-006` | `Portrait resources and portrait variants are first-class project-owned authoring/runtime families with stable mapping, thumbnails, current preview, and runtime continuity.` | `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `authoring tests + export/import tests + runtime render tests + browser proof` | `src/domain/script-editor-project.ts; portrait authoring/UI helpers; resource mapping/runtime loaders; tests/**` | `Portrait lists stay empty in new projects, mapping stays unstable, or editor/runtime resolve portraits differently.` |
| `ACC-EVENT-CENTER-007` | `No compatibility residue remains for scene retirement, including scenes.json, SceneDefinition, ActionNode, entrySceneId, nextSceneId, activeSceneId, scene runtime/session truth, or dialogue-to-scene lowering seams.` | `queue.scene-family-retirement-and-content-migration` | `source-removal guards + export/import rejection tests` | `src/domain/action.ts; src/application/script-editor/dialogue-story-runtime-materializer.ts; src/application/scene/**; src/application/content/active-game-content.ts; tests/**` | `Any compatibility reader/writer/materializer/shim survives as production truth.` |
| `ACC-EVENT-CENTER-008` | `Final acceptance proves supported trigger environments and the smallest usable portrait creator path through real or simulated-human browser evidence.` | `queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard` | `browser simulated-human + acceptance ledger` | `tests/**; browser flow; source guards; version acceptance ledger` | `The target tries to close on unit tests alone or without creator-path proof.` |

### Acceptance Criteria

- `The version may close only after every acceptance id is covered, blocked, or explicitly waived with reason.`
- `No child queue may weaken MEMO-025 by reframing scene retirement as compatibility layering, boundary-thinning, or dual-path truth.`
- `queue.scene-family-retirement-and-content-migration` and `queue.event-centered-runtime-pack-preview-export-sync` must be treated as a coupled consecutive pair inside this same target/version.`
- `queue.event-only-routing-family-retirement-and-reference-replacement` must remain a distinct same-target queue and must not be merged into queue.scene-family-retirement-and-content-migration, queue.event-centered-runtime-pack-preview-export-sync, or queue.portrait-resource-authoring-and-resource-mapping-convergence.`
- `queue.event-playable-destination-and-building-action-event-truth-convergence` must remain a distinct same-target queue if fresh audit shows authoring/runtime truth still diverges on event->minigame/playable lowering or building action event selection; final acceptance must not absorb that implementation-bearing gap.`
- `The version must not claim event-only routing if building-function/task/flow still survive as alternate routing owners or if editor/export/import/loader/preview/runtime still diverge on flow-originated references.`
- `The version must not close while event-owned minigame/playable destinations remain non-runnable or while building action event selection still diverges from runtime trigger truth.`
- `Portrait resource convergence may execute last, but it must remain inside this target/version and may not be routed to another target.`
- `Every completed child queue must perform a no-over-narrowing completeness review before handoff.`
- `Final validation must run npm run typecheck, npm run lint:blueprints, and npm test.`
