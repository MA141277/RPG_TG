# Script Editor Event-Centered Authoring, Scene Retirement, And Portrait Resource Refactor Evidence Draft

## Document Control

- document_id: `evidence-draft.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- source_memo: `docs/blueprints/version-memo.md#memo-025-script-editor-event-centered-authoring-and-portrait-resource-refactor-draft`
- proposed_version_id: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- proposed_parent_spec_role: `parent-spec-evidence-draft`
- evidence_draft_status: `promoted-to-formal-target`
- created_at: `2026-07-22`
- scheduling_effect: `none`
- active_queue_created: `no`
- implementation_authorized: `no`
- formal_target_spec: `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- formal_target_plan: `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`

## Governance Classification

- affected mechanics or contracts:
  - `script editor event-centered content authoring`
  - `dialogue / minigame / task / function routing ownership`
  - `scene formal retirement`
  - `runtime pack / loader / preview / export convergence`
  - `portrait resource authoring and rendering`
- task classification:
  - `shared authoring/runtime contract change`
- contract level:
  - `shared-contract`
- governing references:
  - `docs/blueprints/classification-rule-layer-spec.md`
  - `docs/blueprints/blueprint-workflow-spec.md`
  - `.codex/skills/playable-governance/references/playable-governance-core.md`

## Version Draft Summary

### Goal

- `Replace the current scene-centered mixed authoring/runtime truth with an event-centered creator-facing model, retire scene as a formal family without compatibility residue, preserve building-function meaning through function -> event -> dialogue/minigame/task/function, and converge portrait resources into first-class project-owned authoring/runtime records.`

### Required Outcomes

- `dialogue / function / minigame / task read as one event-centered creator-facing system.`
- `event becomes the only formal routing owner for creator-facing follow-up behavior.`
- `scene is removed from Script Editor visible families, formal project structure, runtime pack canonical families, runtime state truth, startup truth, and presenter truth.`
- `background ownership lives in city / building / building-arrangement families rather than scene.`
- `narration, speaker lines, portrait references, portrait side, and choice presentation live in dialogue authoring rather than scene.`
- `building creator-facing meaning remains function -> event -> dialogue/minigame/task/function even when implementation still travels through arrangement / event-binding / flow / playable.`
- `trigger timing and shared trigger-context contracts are frozen across building enter, building function, dialogue, minigame, and task environments.`
- `runtime export/import, runtime loading, editor preview, and reference resolution all understand the same event-centered no-scene model in the same incompatible batch.`
- `portrait resources and portrait variants become project-owned authoring families with stable resource-to-file mapping, thumbnail/preview rendering, and runtime continuity.`

### Explicit Non-Goals

- `Do not keep scene as a hidden secondary routing owner through entrySceneId, nextSceneId, scene-local callback chains, or dialogue-to-scene lowering seams.`
- `Do not implement boundary-thinning, compatibility layering, temporary shims, bridge exports, or dual-path truth for scene retirement.`
- `Do not weaken building runtime implementation seams that still travel through arrangement / event-binding / flow / playable.`
- `Do not preserve portrait selection by reverse-collecting people[].portraitId values or leaking file paths into person records.`
- `Do not split portrait resource convergence into a separate successor target/version that would leave MEMO-025 partially closed.`

### Must Preserve

- `Creator-facing building meaning remains function -> event -> dialogue/minigame/task/function.`
- `Implementation-facing building seams may still pass through arrangement / event-binding / flow / playable.`
- `Existing building function results must preserve pre-refactor meaning instead of drifting into new staged ceremony.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview must converge on the same event-centered model.`
- `Dialogue, minigame, and task follow-up behavior must stay authorable and runnable after scene retirement.`

### Must Replace

- `SceneDefinition as a formal creator-facing/runtime content family.`
- `ActionNode as the formal multi-purpose routing/presentation container.`
- `entrySceneId`
- `nextSceneId`
- `activeSceneId`
- `scene cursor / waiting-choice state as canonical cross-feature truth`
- `dialogue-story-runtime-materializer`
- `scene-runner`
- `scenes.json as a canonical runtime pack family`
- `portrait selection via reverse collection of person portrait ids`
- `person-side file-path leakage for portrait resolution`

## Draft Requirement Coverage

| Draft Requirement | Proposed Acceptance IDs | Coverage Status |
| --- | --- | --- |
| `event-centered authoring model for dialogue/function/minigame/task` | `ACC-EVENT-CENTER-001` | `mapped` |
| `event becomes the only formal routing owner with stable trigger contracts` | `ACC-EVENT-CENTER-002` | `mapped` |
| `scene family retirement and content migration without compatibility residue` | `ACC-EVENT-CENTER-003; ACC-EVENT-CENTER-007` | `mapped` |
| `building function meaning preservation under the new model` | `ACC-EVENT-CENTER-004` | `mapped` |
| `runtime pack / loader / preview / export convergence for the new model` | `ACC-EVENT-CENTER-005` | `mapped` |
| `portrait resource authoring, variant, and resource mapping convergence` | `ACC-EVENT-CENTER-006` | `mapped` |
| `cross-environment trigger proof and portrait creator-path proof` | `ACC-EVENT-CENTER-008` | `mapped` |

## Proposed Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-event-centered-authoring-model-unification` | `required` | `Unify creator-facing content ownership and destination semantics so dialogue / function / minigame / task are authored as one event-centered system.` | `Admit first because later trigger freeze, scene retirement, runtime cutover, and portrait routing all need stable creator-facing semantics and object ownership.` |
| `queue.event-router-only-trigger-contract-freeze` | `required` | `Freeze event as the only formal router and lock a shared trigger timing + trigger-context contract across building, dialogue, minigame, and task environments.` | `Admit after model unification and before scene retirement so every later queue can delete scene routing truth without redefining trigger semantics mid-flight.` |
| `queue.scene-family-retirement-and-content-migration` | `required` | `Remove scene from Script Editor/project/runtime/startup/presenter truth and migrate backgrounds, narration, speaker lines, portrait placement, choice presentation, and follow-up ownership into city/building/dialogue/event families.` | `Admit only after event-centered model and router-only contracts are frozen. This queue and runtime-pack sync must execute inside the same parent execution domain with no interleaving queue.` |
| `queue.event-centered-runtime-pack-preview-export-sync` | `required` | `Converge runtime pack export/import, loader, preview, reference resolution, and runtime reader behavior on the new no-scene event-centered model.` | `Admit immediately after scene retirement. The scene-retirement queue cannot claim completion while this queue leaves editor/runtime/export divergence or old scene compatibility truth.` |
| `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `required` | `Add first-class portrait resources/variants/mappings with shared thumbnail, preview, and runtime resolution rules that align with dialogue/person authoring under the new model.` | `Admit after the event-centered model and no-scene runtime contract are stable. It may execute last inside the same target/version, but must not be routed to a different target/version.` |

## Acceptance Matrix Draft

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-EVENT-CENTER-001` | `Script Editor creator-facing semantics unify dialogue / function / minigame / task under event-centered authoring, with clear destination families and no scene wrapper requirement.` | `queue.script-editor-event-centered-authoring-model-unification` | `editor model tests + UI/source review` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js` | `Creator-facing model still requires scene wrappers, object-to-object direct jumps, or separate routing semantics per content family.` |
| `ACC-EVENT-CENTER-002` | `event is the only formal routing owner and trigger timing / trigger-context contracts are stable across building-enter, building-function, dialogue, minigame, and task environments.` | `queue.event-router-only-trigger-contract-freeze` | `contract tests + runtime entrypoint tests + source guard` | `src/domain/event.ts; trigger-context/runtime entrypoint contracts; EventBindingRuntime anchors; tests/**` | `entrySceneId, nextSceneId, scene-local callback chains, or family-local routing truth remain formal behavior owners.` |
| `ACC-EVENT-CENTER-003` | `scene is removed from Script Editor visible families, project formal structure, runtime pack canonical families, startup truth, runtime state truth, and presenter truth.` | `queue.scene-family-retirement-and-content-migration` | `source-removal guards + migration tests` | `src/domain/action.ts; src/domain/script-editor-project.ts; src/application/scene/**; src/application/story/**; src/application/startup/**; src/ui/views/scene/**` | `Scene is only hidden in UI while remaining formal runtime/startup/export truth.` |
| `ACC-EVENT-CENTER-004` | `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation may still use arrangement / event-binding / flow / playable.` | `queue.scene-family-retirement-and-content-migration` | `building runtime tests + browser proof + source review` | `src/application/building/**; src/application/script-editor/**; src/content/scenario-packs/**; tests/**` | `Building functions lose meaning, bypass event ownership, or are forced back into scene-shaped configuration.` |
| `ACC-EVENT-CENTER-005` | `Editor preview, runtime export/import, runtime loading, and reference resolution all converge on the new event-centered no-scene model in the same incompatible batch.` | `queue.event-centered-runtime-pack-preview-export-sync` | `export/import/loader tests + preview/runtime tests + source guard` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; preview/runtime loaders; tests/**` | `Editor can write the new model while runtime still expects scene truth, or old scene families remain as compatibility bridges.` |
| `ACC-EVENT-CENTER-006` | `Portrait resources and portrait variants are first-class project-owned authoring/runtime families with stable mapping, thumbnail rendering, current preview rendering, and runtime continuity.` | `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `authoring tests + export/import tests + runtime render tests + browser proof` | `src/domain/script-editor-project.ts; portrait authoring helpers/UI; resource mapping/runtime loaders; tests/**` | `Portrait lists stay empty in new projects, file mapping remains unstable, or editor/runtime resolve portraits differently.` |
| `ACC-EVENT-CENTER-007` | `No compatibility residue remains for scene retirement, including scenes.json, SceneDefinition, ActionNode, entrySceneId, nextSceneId, activeSceneId, scene runtime session truth, or dialogue-to-scene lowering seams.` | `queue.scene-family-retirement-and-content-migration` | `source-removal guards + export/import rejection tests` | `src/domain/action.ts; src/application/script-editor/dialogue-story-runtime-materializer.ts; src/application/scene/**; src/application/content/active-game-content.ts; tests/**` | `Any compatibility reader/writer/materializer/shim survives as accepted production truth.` |
| `ACC-EVENT-CENTER-008` | `Cross-environment simulated-human proof covers building, dialogue, minigame, and task trigger environments plus the smallest usable portrait creator path.` | `future required-final acceptance queue at formal target promotion time` | `browser simulated-human + acceptance ledger` | `tests/**; browser flow; version acceptance ledger` | `The target tries to close on unit tests alone or without proving the smallest usable creator path for portraits and trigger environments.` |

## Implementation Anchors

### Current Authoring And Content Anchors

- `src/domain/script-editor-project.ts`
  - currently still exposes `project.scenes` and lacks first-class portrait resource families.
- `src/domain/event.ts`
  - still carries `entrySceneId`.
- `src/domain/action.ts`
  - still defines `SceneDefinition`, `ActionNode`, and `ChoiceOption.nextSceneId`.
- `src/application/script-editor/story-dialogue-event-authoring.ts`
  - still exposes scene-adjacent event authoring concepts.
- `src/application/script-editor/minimal-workflow.ts`
  - still includes `scenes` in visible authoring workflow families.
- `src/application/script-editor/workspace-shell.ts`
  - still includes scene tree/export ownership.
- `src/ui/main-ui/main-ui-flow.js`
  - still exposes scenes/startup scene selection and scene action authoring.

### Current Runtime And Pack Anchors

- `src/application/script-editor/runtime-pack-export.ts`
  - still resolves event entry into scene-oriented output and scene pack families.
- `src/application/script-editor/runtime-pack-import.ts`
  - still imports scene family truth and related bridge logic.
- `src/application/scenario/scenario-pack-loader.ts`
  - still accepts scene-oriented startup/runtime pack truth.
- `src/application/content/active-game-content.ts`
  - still carries scene definition lookup truth.
- `src/application/state/create-initial-state.ts`
  - still bootstraps scene-oriented runtime state.
- `src/application/state/game-store.ts`
  - still derives current choice/action from scene truth.
- `src/application/startup/**`
  - still includes startup scene ownership.
- `src/application/story/story-runtime.ts`
  - still depends on scene runtime/session concepts.
- `src/application/presenter/**`
  - still consumes scene-shaped presenter inputs.

### Current Scene Removal Targets

- `src/application/script-editor/dialogue-story-runtime-materializer.ts`
- `src/application/scene/scene-runner.ts`
- `src/application/scene/choice-resolver.ts`
- `src/core/contracts/scene-runtime.ts`
- `src/ui/views/scene/scene-view.ts`

### Current Portrait And Resource Anchors

- `people[].portraitId` and `portraitVariantId` references currently act as de facto option sources.
- portrait preview and list rendering do not yet flow through a project-owned portrait-resource mapping contract.
- runtime/export/import do not yet guarantee one shared portrait resource truth across authoring, preview, and runtime.

## Legacy Paths To Replace

- `project.scenes`
- `SceneDefinition`
- `ActionNode`
- `entrySceneId`
- `nextSceneId`
- `activeSceneId`
- `scene cursor / waiting-choice state as canonical runtime truth`
- `dialogue-story-runtime-materializer`
- `scene-runner`
- `scene-runtime` contracts
- `scenes.json`
- `initialLocation.sceneId`
- `sceneDefinitions` and `sceneDefinitionsById`
- `people-driven reverse collection as portrait option truth`
- `person-owned file-path portrait resolution`

## Compatibility Paths To Preserve

- `Building implementation seams still use arrangement / event-binding / flow / playable where appropriate.`
- `Dialogue/minigame/task/function follow-up behavior remains event-routed and runnable after migration.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview continue to converge on one shared runtime truth.`
- `Portrait references remain stable ids after authoring/export/import/runtime round-trip.`

## Candidate Queue Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.script-editor-event-centered-authoring-model-unification` | `MEMO-025; this evidence draft` | `ACC-EVENT-CENTER-001` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js` | `creator-facing scene wrappers; family-local direct jumps; minigame/function/task authoring semantics that bypass event ownership` | `building creator-facing meaning; existing content object ids where still canonical` | `The queue tries to delete runtime scene truth or portrait resource mapping in the same step.` |
| `queue.event-router-only-trigger-contract-freeze` | `MEMO-025; EventBindingRuntime governance history` | `ACC-EVENT-CENTER-002` | `src/domain/event.ts; trigger-context contracts; runtime entrypoints; tests/**` | `entrySceneId; nextSceneId; scene-local callback routing truth` | `EventBindingRuntime trigger discipline; arrangement/event-binding/flow/playable implementation path` | `The queue preserves scene routing as hidden fallback or leaves trigger timing/context under family-specific ad hoc contracts.` |
| `queue.scene-family-retirement-and-content-migration` | `MEMO-025; this evidence draft` | `ACC-EVENT-CENTER-003; ACC-EVENT-CENTER-004; ACC-EVENT-CENTER-007` | `src/domain/action.ts; src/domain/script-editor-project.ts; src/application/scene/**; src/application/story/**; src/application/startup/**; src/ui/views/scene/**` | `SceneDefinition; ActionNode; activeSceneId; scene runtime/session/presenter/startup truth` | `building meaning preservation; dialogue presentation after migration` | `The queue only hides scenes from UI, leaves dialogue-to-scene lowering, or tries to close before runtime/export/preview sync lands.` |
| `queue.event-centered-runtime-pack-preview-export-sync` | `MEMO-025; runtime pack/export/import/runtime preview contracts` | `ACC-EVENT-CENTER-005` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; preview/runtime loaders; tests/**` | `scenes.json; scene import/export bridges; scene startup pack truth` | `editor/runtime/export/import alignment under one incompatible model` | `The queue accepts editor-side new structures while runtime still consumes old scene truth or fallback bridges.` |
| `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `MEMO-025; this evidence draft` | `ACC-EVENT-CENTER-006` | `src/domain/script-editor-project.ts; portrait authoring helpers/UI; resource mapping/runtime loaders; tests/**` | `reverse-collected portrait options; unstable person-side mapping; text-only portrait selection without shared mapping rules` | `portraitId / portraitVariantId as stable references; shared runtime resolution; thumbnails/current preview continuity` | `The queue routes portrait resources to a later target/version or keeps file-path truth in people/dialogue records.` |

## Split Completeness Review

### Covered Parent Capabilities

- `event-centered creator-facing authoring model is owned by queue.script-editor-event-centered-authoring-model-unification.`
- `event-only routing and trigger contract freeze are owned by queue.event-router-only-trigger-contract-freeze.`
- `scene family retirement, content migration, and no-compatibility residue removal are owned by queue.scene-family-retirement-and-content-migration.`
- `runtime pack / loader / preview / export / reference-resolution convergence is owned by queue.event-centered-runtime-pack-preview-export-sync.`
- `portrait resources, portrait variants, resource mapping, and preview/list/thumbnail convergence are owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`

### Parent Capabilities Not Yet Owned

- `Formal target promotion must add one required-final acceptance-and-residue-guard queue before any eventual target closeout.`

### Over-Narrowing Risks

- `Model-unification queue could relabel surfaces without actually making event the creator-facing semantic center.`
- `Router-freeze queue could keep entrySceneId/nextSceneId/scene callback routing as hidden formal truth.`
- `Scene-retirement queue could only remove UI exposure while preserving runtime materializers or startup scene truth.`
- `Runtime-sync queue could let editor author the new model while runtime/export/import still consume scene compatibility paths.`
- `Portrait queue could preserve people-driven portrait option collection or leak file mapping into person/dialogue records.`
- `Any queue could weaken building creator-facing meaning or bypass arrangement / event-binding / flow / playable seams.`

### Domain Coupling Decisions

- `queue.scene-family-retirement-and-content-migration` and `queue.event-centered-runtime-pack-preview-export-sync` must belong to the same parent execution domain and the same successor target/version.`
- `Those two queues may remain split for execution clarity, but they must execute as a coupled consecutive pair with no unrelated queue interleaving and no claim of lawful completion while editor/runtime divergence remains.`
- `queue.portrait-resource-authoring-and-resource-mapping-convergence` may be sequenced last inside the same successor target/version, but it must not be deferred into a separate target/version because portrait resource convergence is part of MEMO-025's parent capability boundary.`

### Drift Risks Beyond Parent Requirement

- `Pushing all dialogue/minigame/task/function behavior into one new monolithic event object would over-couple content again and drift beyond the memo's routing clarification.`
- `Reframing scene retirement as compatibility layering or temporary shim work would violate the explicit no-compatibility-residue rule.`
- `Moving building-function routing back into building runtime business branches would violate creator-facing and implementation-path boundaries.`

### Required Follow-Up Before Formal Spec

- `Current active version target.building-arrangement-container-flow-refactor must not absorb this work; the current parent target is insufficient.`
- `Existing open targets target.city-building-module-entry-and-project-startup-authoring, target.script-editor-event-runtime-production-hardening, and target.map-review-provider-boundary-extraction are also insufficient because each would need parent-goal widening to own scene retirement plus portrait resource convergence.`
- `The minimum lawful route is a new successor target/version: target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor.`
- `Formal target promotion now exists and preserves the five proposed execution queues plus one required-final acceptance-and-residue-guard queue; no child queue has been admitted.`

## First Queue Recommendation

- queue_id: `queue.script-editor-event-centered-authoring-model-unification`
- basis:
  - `Later routing freeze, scene retirement, runtime cutover, and portrait convergence all depend on a stable creator-facing object model and destination-family contract.`
  - `Starting with scene deletion or runtime cutover first would force unstable authoring semantics and hide over-narrowing risk.`

## High-Risk Drift Points

- `entrySceneId / nextSceneId / activeSceneId are still deeply threaded through authoring, runtime, startup, and presenter code; retirement must be treated as a system refactor, not a tab removal.`
- `Building semantics must remain creator-facing function -> event -> dialogue/minigame/task/function even while implementation still routes through arrangement/event-binding/flow/playable.`
- `Portrait resources need stable id-based mapping across authoring, preview, export, import, and runtime; any temporary file-path shortcut will create new long-lived residue.`
- `Runtime pack/export/import and preview cannot lag behind scene retirement; editor/runtime divergence is not an acceptable intermediate success claim.`

## Operator Review Checklist

Review only these decisions before future child-queue admission is written:

1. `Is target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor the right successor target boundary?`
2. `Are the five proposed execution queues the right split, with scene retirement and runtime sync kept as a coupled consecutive pair?`
3. `Should queue.script-editor-event-centered-authoring-model-unification remain the first queue?`
4. `Is any MEMO-025 capability still missing from this split or from the target-level no-over-narrowing guard?`
