# Script Editor Runtime Pack Unification Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-runtime-pack-unification`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `classify-fresh-work`
- resume_gate: `version-plan-review`
- promotion_review_result: `none`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `none`
- intake_item_id: `none`
- intake_summary: `none`
- intake_result: `none`
- intake_feedback_mode: `none`
- closure_review_subject: `queue.script-editor-non-activities-runtime-family-export-convergence`
- closure_review_status: `routed`
- residue_candidate_id: `item.script-editor-narrative-authoring-export-convergence`
- residue_candidate_family: `cross-family`
- routing_basis: `queue.script-editor-non-activities-runtime-family-export-convergence closed after making cards, cityEntries, cityNpcPools, cityPortraits, historicalCharacterIdByCharacterId, historicalCharacters, historicalCityRosters, houseAccessRefusalRules, houseModuleDefaults, maps, scenes, and valuables first-class script-editor project/runtime families and proving the real Zhu Yuanzhang import/export path no longer depends on unresolved compatibility residue for those families. The remaining recorded blocker is the separate editor-authored dialogues/storyNodes lowering issue for newly-created minimal scenarios.`
- next_lawful_queue_recommendation: `queue.script-editor-narrative-authoring-export-convergence`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-runtime-family-authoring-convergence`
  - `queue.script-editor-runtime-pack-export-unification`
  - `queue.script-editor-base-pack-inheritance-governance`
  - `queue.script-editor-fixed-pack-consumer-deprivileging`
  - `queue.script-editor-compatibility-boundary-retirement`
  - `queue.script-editor-activities-authoring-export-convergence`
  - `queue.script-editor-non-activities-runtime-family-export-convergence`
  - `queue.script-editor-narrative-authoring-export-convergence`

## Human Context

### Admission Review Record

- Scope approval:
  - `The operator explicitly requested that Blueprint close target.script-editor-prd-alignment if no lawful same-version candidate queue remains, then inspect and activate docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md as the next version according to Blueprint governance.`
- Admission basis:
  - `target.script-editor-prd-alignment is now closed with its final same-family queue recorded as done historical evidence, so the successor-candidate admission gate that required the predecessor version to be closed is satisfied.`
  - `Fresh repository evidence still proves that runtime-pack convergence remains open after PRD alignment: src/application/script-editor/runtime-pack-import.ts still preserves unresolved imported families such as activities as compatibility residue instead of converging them into one formal runtime family contract, and src/application/script-editor/runtime-pack-export.ts still fails closed on storyPack.compatibilityImport.unresolvedFamilies rather than exporting one already-authoritative runtime pack.`
  - `Fresh repository evidence also proves that basePackId and active-content ownership remain incomplete at the final-contract layer: src/application/script-editor/runtime-pack-import.ts and src/application/script-editor/runtime-pack-export.ts currently treat basePackId largely as metadata passthrough, while src/content/pack-content-access.ts still directly imports builtin zhuyuanzhang scenario-pack files instead of routing all covered consumers through one active scenario-pack selector.`
  - `The current script-editor workspace and shell still surface compatibility residue counts as daily authoring/export truth through src/application/script-editor/workspace-shell.ts and src/ui/main-ui/main-ui-flow.js, which confirms that compatibility residue is not yet retired to migration-only duty.`
- Admission conclusion:
  - `target.script-editor-runtime-pack-unification is now the live open successor version, and queue.script-editor-runtime-family-authoring-convergence is the next admitted active queue because fresh evidence still shows editor-facing data ownership depends on long-lived authoring-only parallel families.`
  - `Execution now resumes from task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile inside the admitted queue document.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-runtime-family-contract-alignment` | `done` | `only if fresh repository evidence later disproves the frozen mandatory/inheritable/unsupported/fail-closed family contract or proves still-blocking same-family contract residue` | `Closed on 2026-07-14 after docs/scenario-pack-unified-format.md and the active version spec froze the family contract for downstream queues.` |
| `queue.script-editor-runtime-family-authoring-convergence` | `done` | `only if fresh repository evidence later proves still-blocking same-family authoring-convergence residue after the written retirement map` | `Closed on 2026-07-14 after the queue wrote the authoring parallel-structure retirement map and routed remaining residue to downstream queue families.` |
| `queue.script-editor-runtime-pack-export-unification` | `done` | `only if fresh repository evidence later proves still-blocking same-family export-contract residue after the written startup-consumable export contract map` | `Closed on 2026-07-14 after the queue wrote the formal startup-consumable export contract map and routed remaining residue to downstream queue families.` |
| `queue.script-editor-base-pack-inheritance-governance` | `done` | `only if fresh repository evidence later proves still-blocking same-family inheritance-governance residue after the written family overlay contract map` | `Closed on 2026-07-14 after the queue wrote explicit family overlay rules, inheritance sources, and fail-closed obligations for mandatory and explicitly inheritable runtime families.` |
| `queue.script-editor-fixed-pack-consumer-deprivileging` | `done` | `only if fresh repository evidence later proves still-blocking same-family consumer-routing residue after the written active-content-only route contract` | `Closed on 2026-07-14 after the queue wrote the covered consumer route contract and classified retained builtin baselines as out of scope unless they bypass active scenario-pack content resolution.` |
| `queue.script-editor-compatibility-boundary-retirement` | `done` | `only if fresh repository evidence later proves still-blocking same-family compatibility-boundary contract residue after the written migration-only retirement contract` | `Closed on 2026-07-14 after the queue wrote the migration-only compatibility boundary for import, authoring storage, UI diagnostics, export validation, and version closeout.` |
| `queue.script-editor-activities-authoring-export-convergence` | `done` | `only if fresh repository evidence later proves still-blocking same-family activities import/export residue after the written activities convergence slice` | `Closed on 2026-07-14 after activities became a first-class script-editor project family, imported pack.activities stopped entering compatibilityImport.unresolvedFamilies, workspace/export emitted activities.json, and real Zhu Yuanzhang diagnostics no longer reported Unresolved imported runtime family "activities".` |
| `queue.script-editor-non-activities-runtime-family-export-convergence` | `done` | `only if fresh repository evidence later proves still-blocking same-family residue after the 12-family first-class project/runtime ownership slice` | `Closed on 2026-07-14 after the 12 non-activities runtime families became first-class script-editor project/runtime families and real Zhu Yuanzhang import -> export -> startup-loader verification passed without unresolved compatibility residue for those families.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-runtime-pack-unification-version-open` | `current-target-item` | `none` | `version opened; first queue subsequently admitted` | `The operator explicitly requested that the successor draft become the next active Blueprint version once the PRD alignment version proved queue-complete and closeable; the version then completed admission review for its first bounded queue.` |
| `item.script-editor-runtime-family-contract-alignment` | `queue-candidate` | `queue.script-editor-runtime-family-contract-alignment` | `admitted + queue closed` | `Mandatory-vs-inheritable runtime family truth was unresolved across runtime startup, editor import, editor export, and compatibility residue handling; this queue has now frozen the contract and closed as historical evidence.` |
| `item.script-editor-runtime-family-authoring-convergence` | `queue-candidate` | `queue.script-editor-runtime-family-authoring-convergence` | `admitted + queue closed` | `Editor-owned authoring structures preserved bounded authoring-only residue; this queue has now written the retirement map and closed as historical evidence.` |
| `item.script-editor-runtime-pack-export-unification` | `queue-candidate` | `queue.script-editor-runtime-pack-export-unification` | `admitted + queue closed` | `The export path was still a bounded partial seam; this queue has now written the startup-consumable export contract map and closed as historical evidence.` |
| `item.script-editor-base-pack-inheritance-governance` | `queue-candidate` | `queue.script-editor-base-pack-inheritance-governance` | `admitted + queue closed` | `basePackId was present in import/export metadata flow without family-level inheritance semantics; this queue has now written the formal overlay and fail-closed contract map.` |
| `item.script-editor-fixed-pack-consumer-deprivileging` | `queue-candidate` | `queue.script-editor-fixed-pack-consumer-deprivileging` | `admitted + queue closed` | `src/content/pack-content-access.ts still directly imports builtin zhuyuanzhang pack files and default-pack facade consumers still bypass active scenario-pack resolution; this queue has now written the active-content-only route contract.` |
| `item.script-editor-compatibility-boundary-retirement` | `queue-candidate` | `queue.script-editor-compatibility-boundary-retirement` | `admitted + queue closed` | `The script-editor shell and workspace still surfaced compatibility residue as live authoring/export truth; this queue has now written the migration-only compatibility retirement contract.` |
| `item.script-editor-activities-authoring-export-convergence` | `queue-candidate` | `queue.script-editor-activities-authoring-export-convergence` | `admitted + queue closed` | `The final runtime-pack-unification contract declared activities mandatory, while import preserved pack.activities under compatibilityImport.unresolvedFamilies.activities and export failed closed on that residue. The queue has now landed first-class activities authoring/runtime ownership, import, workspace exposure, validation, and activities.json export.` |
| `item.script-editor-non-activities-runtime-family-export-blockers` | `queue-candidate` | `queue.script-editor-non-activities-runtime-family-export-convergence` | `admitted + queue closed` | `After activities convergence, real Zhu Yuanzhang import/export diagnostics still failed closed on 12 unresolved runtime families. The admitted queue has now made those families first-class project/runtime fields, emitted canonical split files, and verified Zhu Yuanzhang import/export/startup-load succeeds without unresolved residue for the named families.` |
| `item.script-editor-narrative-authoring-export-convergence` | `queue-candidate` | `queue.script-editor-narrative-authoring-export-convergence` | `candidate-recorded; needs promotion review` | `Creating the simplest script-editor scenario still seeds dialogues and storyNodes, but runtime export fails closed with dialogues/storyNodes deferred-export diagnostics because scenes/text-entries assembly is not implemented for editor-authored narrative data.` |

### Candidate Scope Notes

- `This version consumes the closed contract-freeze, implementation, and PRD-alignment versions as historical baseline evidence; it must not reopen their queue surfaces by convenience.`
- `queue.script-editor-runtime-family-contract-alignment is now closed historical evidence because every later convergence queue can consume one explicit answer for mandatory runtime families, inheritable families, unsupported/transitional families, and fail-closed obligations.`
- `No later queue may create a new long-lived authoring-only family, a new export-only shadow dialect, or a new builtin fallback rule as a convenience patch while this version is open.`
- `The successor version owns architecture convergence, not unrelated gameplay redesign, generic runtime cleanup, or repository-wide visual polish.`

### Activities Authoring Export Convergence Candidate Requirement

- Candidate ID: `item.script-editor-activities-authoring-export-convergence`
- Proposed Queue: `queue.script-editor-activities-authoring-export-convergence`
- Classification: `queue-candidate`
- Governance Classification: `shared playable contract change + house-hosted playable integration`
- Governing References:
  - `.codex/skills/playable-governance/SKILL.md`
  - `.codex/skills/playable-governance/references/playable-governance-core.md`
  - `.codex/skills/playable-governance/references/playable-impact-matrix.md`
  - `docs/special-house-interface.md`
- Requirement Summary:
  - `Make activities a first-class script-editor authoring/runtime family rather than compatibilityImport residue.`
  - `Import pack.activities into a typed script-editor activities authoring model, not compatibilityImport.unresolvedFamilies.activities.`
  - `Expose activities as a stable workbench family for activity/task/playable bindings, covering activity-qte and generic.qte launch metadata, houseModuleId, taskId, missionId, text references, QTE tuning, stamina/time costs, outcome variables, flags, effects, and tags.`
  - `Export project.activities back to runtime activities.json and pack.json activities manifest references in the same scenario-pack artifact consumed by startup.`
  - `Validate handlerId, fallbackHandlerId, houseModuleId, keepMinTier, QTE tuning, outcome/effects shape, and text-entry references so the current script editor can export the imported Zhu Yuanzhang activities pack without the unresolved runtime family error.`
- Acceptance Target:
  - `The current script-editor import/export path can round-trip the existing Zhu Yuanzhang activities family and complete runtime-pack export without reporting Unresolved imported runtime family "activities".`
  - `No playable-specific business branch is added to src/main.ts.`
  - `No house module privately owns playable lifecycle; house modules remain host/integration owners only.`
  - `No new top-level playable family, owner kind, or return policy is introduced unless a later admitted queue explicitly expands shared contracts.`
  - `No temporary compatibility-clearing patch is treated as sufficient closeout.`
- Non-Goals:
  - `Do not solve unrelated unsupported families in the same queue unless admission review explicitly widens the queue.`
  - `Do not redesign QTE gameplay rules beyond what is necessary to preserve and export existing activity definitions.`
  - `Do not replace basePackId inheritance, fixed-pack consumer routing, or historical migration compatibility contracts already closed by earlier queues.`

### Non-Activities Runtime Family Export Convergence Candidate Requirement

- Candidate ID: `item.script-editor-non-activities-runtime-family-export-blockers`
- Proposed Queue: `queue.script-editor-non-activities-runtime-family-export-convergence`
- Classification: `queue-candidate`
- Requirement Summary:
  - `Resolve the remaining non-activities runtime family blockers reported by the real Zhu Yuanzhang script-editor import/export diagnostic.`
  - `Bring cards, cityEntries, cityNpcPools, cityPortraits, historicalCharacterIdByCharacterId, historicalCharacters, historicalCityRosters, houseAccessRefusalRules, houseModuleDefaults, maps, scenes, and valuables out of compatibilityImport.unresolvedFamilies through formal import, project ownership, validation, export, or explicitly governed preservation semantics.`
  - `Make the imported Zhu Yuanzhang project export a runtime-pack artifact that the startup scenario-pack loader can consume without unresolved runtime-family diagnostics.`
  - `Preserve the closed activities result: activities must remain a first-class project family and must not regress to compatibility residue.`
- Acceptance Target:
  - `Real Zhu Yuanzhang import -> script-editor export -> loadScenarioPackFromFiles succeeds without unsupported-family diagnostics for the 12 named runtime families.`
  - `The emitted runtime pack preserves startup-required scenario-pack truth for the named families rather than silently dropping them.`
  - `No private export-only dialect, builtin fallback shortcut, or long-lived compatibility residue is introduced as final behavior.`
- Non-Goals:
  - `Do not reopen the closed activities convergence queue unless fresh evidence proves same-family activities regression.`
  - `Do not close the whole runtime-pack-unification version merely because this candidate is recorded; admission and execution remain separate Blueprint steps.`
  - `Do not mix unrelated PRD UI polish, asset pipeline work, or gameplay redesign into this candidate.`

### Narrative Authoring Export Convergence Candidate Requirement

- Candidate ID: `item.script-editor-narrative-authoring-export-convergence`
- Proposed Queue: `queue.script-editor-narrative-authoring-export-convergence`
- Classification: `queue-candidate`
- Requirement Summary:
  - `Make the simplest newly-created script-editor scenario export successfully instead of failing with: dialogues export is deferred in this bounded slice; scenes/text-entries assembly belongs to a later export step.`
  - `Implement formal lowering from editor-owned dialogues into runtime scenes and textEntries, preserving authored dialogue ids, titles, lines, choices, speaker references, and follow-up links where the current model provides them.`
  - `Implement formal lowering from editor-owned storyNodes into scene-flow/runtime narrative structures where required by the simplest workflow, rather than silently dropping seeded storyNodes.`
  - `Keep export fail-closed for narrative shapes that cannot yet be lowered, but replace the blanket deferred-export blocker for the minimal supported authoring path.`
- Acceptance Target:
  - `A default/minimal script-editor project created through createDefaultScriptEditorProjectDefinition exports without dialogues/storyNodes deferred-export diagnostics.`
  - `The exported runtime pack includes startup-loadable scenes and textEntries assembled from the minimal editor narrative data.`
  - `loadScenarioPackFromFiles can load the exported minimal scenario pack.`
  - `Existing activities export behavior remains first-class and does not regress.`
- Non-Goals:
  - `Do not solve the separate 12 runtime family compatibility blockers in this narrative-authoring queue unless admission review explicitly merges scope.`
  - `Do not claim full Zhu Yuanzhang round-trip support from this queue alone; this queue is about editor-authored minimal narrative export.`
  - `Do not introduce private export-only narrative dialects or silently omit dialogues/storyNodes to make export appear successful.`

### Non-Activities Runtime Family Export Convergence Admission Record

- `queue.script-editor-non-activities-runtime-family-export-convergence was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh verification shows the real Zhu Yuanzhang import/export path no longer reports activities residue, but still fails closed on 12 unresolved runtime families: cards, cityEntries, cityNpcPools, cityPortraits, historicalCharacterIdByCharacterId, historicalCharacters, historicalCityRosters, houseAccessRefusalRules, houseModuleDefaults, maps, scenes, and valuables.`
- `The separate narrative authoring export candidate remains recorded but is not selected first because dialogue/storyNode lowering depends on stable runtime scene/text-entry carrier boundaries that this queue should clarify.`

### Non-Activities Runtime Family Export Convergence Progress

- `task.script-editor-non-activities-runtime-family-export-convergence.boundary-baseline-reconcile completed on 2026-07-14 after fresh repository evidence confirmed the 12 named blockers were valid runtime pack families accepted by the startup loader and should be resolved by first-class project/runtime ownership rather than compatibility preservation.`
- `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map completed on 2026-07-14 after cards, cityEntries, cityNpcPools, cityPortraits, historicalCharacterIdByCharacterId, historicalCharacters, historicalCityRosters, houseAccessRefusalRules, houseModuleDefaults, maps, scenes, and valuables were mapped to direct script-editor project/runtime fields and exported through canonical split files.`
- `task.script-editor-non-activities-runtime-family-export-convergence.queue-closeout-and-handoff completed on 2026-07-14 after build:test and the targeted robustness test proved real Zhu Yuanzhang import -> script-editor export -> loadScenarioPackFromFiles succeeds without unresolved compatibility residue for the 12 named runtime families.`
- `The remaining recorded same-version candidate is queue.script-editor-narrative-authoring-export-convergence, which owns lowering editor-authored dialogues/storyNodes for newly-created minimal scenarios.`

### Admission Review Record

- `queue.script-editor-runtime-family-authoring-convergence was reviewed on 2026-07-14 as the next lawful queue candidate.`
- `Fresh repository evidence still shows separate authoring-only and runtime family surfaces in src/domain/script-editor-project.ts, src/application/script-editor/runtime-pack-import.ts, src/application/script-editor/runtime-pack-export.ts, src/application/script-editor/workspace-shell.ts, and src/ui/main-ui/main-ui-flow.js, so authoring convergence remains the smallest lawful next cut.`
- `The version plan now resumes from queue-level execution truth instead of keeping a live admission review subject in the Control Block.`

### Current Queue Progress

- `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile completed on 2026-07-14 after fresh repository evidence confirmed that authoring-only parallel structures still shadow runtime ownership and that this queue remains narrower than export unification, base-pack inheritance, fixed-pack consumer deprivileging, or compatibility retirement.`
- `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map completed on 2026-07-14 after the queue classified direct runtime-owned authoring surfaces, export-deferred narrative/playable surfaces, shared-rule compiler inputs, and compatibility residue into explicit retirement dispositions.`
- `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded authoring-convergence slice, classified remaining residue as cross-family, and returned control to version-level promotion review.`

### Runtime Pack Export Unification Admission Record

- `queue.script-editor-runtime-pack-export-unification was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/application/script-editor/runtime-pack-export.ts still writes empty scenes.json, omits activities from its export manifest, fails closed on dialogues/minigames/storyNodes, and blocks on compatibilityImport.unresolvedFamilies.`
- `The startup loader in src/application/scenario/scenario-pack-loader.ts can consume manifest-driven scenario packs with scenes and optional activities, so the exporter remains a bounded partial seam rather than the final startup-consumable scenario-pack truth.`

### Runtime Pack Export Unification Progress

- `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed that the exporter still writes empty scenes.json, omits activities from the manifest, fails closed on dialogues/minigames/storyNodes, and blocks on compatibilityImport residue while the startup loader can consume fuller scenario-pack truth.`
- `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map completed on 2026-07-14 after the queue wrote mandatory-family export obligations, authoring lowering obligations, fail-closed rules, and downstream boundaries for formal startup-consumable export.`
- `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded export-contract slice, classified remaining residue as cross-family, and returned control to version-level promotion review.`

### Base Pack Inheritance Governance Admission Record

- `queue.script-editor-base-pack-inheritance-governance was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/application/script-editor/runtime-pack-import.ts preserves manifest.basePackId/rawPack.basePackId only as storyPack metadata, while src/application/script-editor/runtime-pack-export.ts only copies storyPack.basePackId through pack metadata without resolving mandatory or inheritable families.`
- `The shared scenario-pack contract already requires missing mandatory/inheritable families to resolve through explicit basePackId inheritance or fail closed, so base-pack inheritance governance is now the smallest lawful next cut.`

### Base Pack Inheritance Governance Progress

- `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed basePackId remains metadata passthrough in runtime-pack import/export while the frozen family/export contracts require explicit family-level inheritance or fail-closed behavior.`
- `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map completed on 2026-07-14 after the queue wrote explicit family-level overlay rules, inheritance sources, and fail-closed obligations for mandatory and explicitly inheritable runtime families.`
- `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded inheritance-governance slice, closed same-family residue, and returned control to version-level promotion review.`

### Fixed Pack Consumer Deprivileging Admission Record

- `queue.script-editor-fixed-pack-consumer-deprivileging was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/content/pack-content-access.ts still directly imports zhuyuanzhang activities, events, scenes, text entries, home-house content, and keep-house content JSON.`
- `Downstream consumers such as src/application/house-modules/temple-house/temple-house-active-content.ts, src/content/houses/home-house-content.ts, and src/content/houses/keep-house-content.ts still consume default-pack facades instead of active scenario-pack content resolution.`
- `The closed base-pack inheritance queue already forbids treating hard-imported builtin files as inheritance fallback, so fixed-pack consumer deprivileging was the smallest lawful next cut.`

### Fixed Pack Consumer Deprivileging Progress

- `task.script-editor-fixed-pack-consumer-deprivileging.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed src/content/pack-content-access.ts still directly imports zhuyuanzhang scenario-pack JSON and downstream consumers still consume default-pack facades instead of active scenario-pack resolution.`
- `task.script-editor-fixed-pack-consumer-deprivileging.consumer-route-contract-map completed on 2026-07-14 after the queue wrote the covered consumer route map and classified default-pack facades, house-module active content helpers, and startup/UI baselines as routed or out of scope unless they bypass active scenario-pack content resolution.`
- `task.script-editor-fixed-pack-consumer-deprivileging.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded consumer-deprivileging slice, closed same-family residue, and returned control to version-level promotion review.`

### Compatibility Boundary Retirement Admission Record

- `queue.script-editor-compatibility-boundary-retirement was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/application/script-editor/workspace-shell.ts and src/ui/main-ui/main-ui-flow.js still surface compatibility residue counts as daily authoring risk and creator-facing status.`
- `src/application/script-editor/runtime-pack-export.ts still fails closed on storyPack.compatibilityImport.unresolvedFamilies, while src/application/script-editor/runtime-pack-import.ts still preserves unresolved families as compatibility residue.`
- `The closed export, inheritance, and consumer route queues now provide the necessary contract baseline, so compatibility-boundary retirement is the smallest lawful next cut.`

### Compatibility Boundary Retirement Progress

- `task.script-editor-compatibility-boundary-retirement.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed workspace shell and main UI still surface compatibility residue counts as daily authoring risk, and runtime export still fails closed on storyPack.compatibilityImport.unresolvedFamilies.`
- `task.script-editor-compatibility-boundary-retirement.retirement-contract-map completed on 2026-07-14 after the queue wrote the migration-only compatibility boundary for import, authoring storage, UI diagnostics, export validation, and version closeout.`
- `task.script-editor-compatibility-boundary-retirement.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded compatibility-retirement slice, closed same-family contract residue, and returned control to version-level promotion review.`

### Activities Authoring Export Convergence Admission Record

- `queue.script-editor-activities-authoring-export-convergence was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh user-facing evidence shows the script-editor export fails with Unresolved imported runtime family "activities" because pack.activities is preserved as compatibilityImport.unresolvedFamilies.activities by runtime-pack import and runtime-pack export fails closed on unresolved compatibility residue.`
- `The active version spec already declares activities as a mandatory runtime family, and the closed export, inheritance, fixed-consumer, and compatibility-boundary queues provide the contract baseline that forbids solving this by silent omission or compatibility-clearing workaround.`
- `The admitted queue is bounded to activities import, typed authoring storage, workbench exposure, validation, and activities.json export; it must not widen into unrelated unsupported families or playable lifecycle redesign.`

### Activities Authoring Export Convergence Progress

- `task.script-editor-activities-authoring-export-convergence.boundary-baseline-reconcile completed on 2026-07-14 after repository evidence confirmed activities was the reported mandatory-family blocker and froze the queue boundary against unrelated runtime families or playable lifecycle redesign.`
- `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import completed on 2026-07-14 after ScriptEditorProjectDefinition gained activities, project loading/defaults carried the canonical family, and runtime import mapped pack.activities into project.activities instead of compatibilityImport.unresolvedFamilies.activities.`
- `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export completed on 2026-07-14 after workspace shell exposed activities and runtime export emitted pack.json activities plus activities.json with activity validation.`
- `task.script-editor-activities-authoring-export-convergence.queue-closeout-and-handoff completed on 2026-07-14 after typecheck, full tests, blueprint lint, and real Zhu Yuanzhang import/export diagnostics proved activities no longer remains unresolved compatibility residue; the 12 remaining blockers were classified as cross-family residue for version review.`

### Current Queue Activation

- `none`
- Active task:
  - `none`

### Version Boundary Record

- `This version governs the convergence from bounded script-editor project/import/export seams toward one formal scenario-pack runtime truth.`
- `It must consume rather than silently rewrite the closed implementation and PRD-alignment baselines.`
- `If fresh evidence disproves the successor spec's final-state assumptions, record that as explicit governance rather than silently lowering back into another bounded compatibility patch.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write version-plan review truth before any queue activation or implementation begins.`
4. `Do not treat successor-version opening or scope approval as queue admission.`
5. `Do not create a queue doc for this version until one bounded runtime-pack-unification queue is formally admitted.`

### Candidate Recovery Rule

- `Use this version plan's queue promotion ledger as the default recovery source for future runtime-pack-unification queue candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the recorded successor boundary or admission basis.`

### Candidate Recovery Rule Addendum

- `This successor version opened with no active queue and a fully recorded candidate portfolio; queue.script-editor-runtime-family-contract-alignment has since been admitted as the single active queue while the remaining five queue families stay candidate-recorded.`
- `Resume from this version plan's recorded candidate ledger unless new material evidence invalidates the final runtime-pack convergence boundary or proves a different smaller lawful first cut.`
- `Any evidence that the repository should keep bounded compatibility residue or builtin privileged content as permanent daily truth must be treated as explicit governance disagreement, not silent queue-local convenience.`

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
- Internal-only Blueprint work:
  - `read project-progress -> blueprint -> version plan -> active queue -> active task`
  - `attempt active-queue absorption`
  - `classify and route the intake`
  - `record candidate truth or admission truth without asking the operator to fill internal fields`
- Default operator output:

```text
处理结果：
- 加入状态：成功 / 失败 / 成功，已加入
- 加入类型：执行队列 / 候选队列 / 未加入
- 加入队列：`具体队列ID` / `none`

原因说明：
- 用 2~4 句话说明为什么进入该队列，或者为什么没有成功加入。
- 如果没有进入执行队列，要明确说明是因为当前已有 active queue，还是因为它当前只满足候选条件。

当前执行情况：
- 当前执行队列：`具体队列ID`
- 当前任务：`具体 task ID`
- 当前队列目标：一句话说明

下一步：
- 说明 Blueprint 接下来会如何处理
- 人工操作：当前不需要 / 当前需要确认 xxx
```

- Default visibility rule:
  - `默认不向人工暴露真值链细节、候选全集、Why Not The Others、Human Involvement Boundary、admission 内部字段或排序全过程，除非人工明确要求展开内部分析。`

### Version Lifecycle Rules

- `A current open version stays open until version closeout is explicitly confirmed and written into this version plan.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `As long as version_status = open, additional same-version queues may still be admitted.`
- `If no open version exists, version creation becomes the required next governance action before any queue admission or implementation can begin.`

### Prior Promotion Record

- `2026-07-14: target.script-editor-prd-alignment closed after its final same-family queue, queue.script-editor-prd-workbench-ui-visual-alignment, landed as done historical evidence with no remaining lawful same-version continuation recorded inside that version.`
- `2026-07-14: the operator explicitly requested successor-version activation if no PRD-alignment candidate queue remained, so target.script-editor-runtime-pack-unification is now opened as the live successor version.`
- `2026-07-14: the successor version initially opened with a candidate-recorded queue portfolio only and no active queue, making admission review for queue.script-editor-runtime-family-contract-alignment the next lawful step at that point.`
- `2026-07-14: admission review then promoted queue.script-editor-runtime-family-contract-alignment as the single active queue and exposed task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile as the live execution entry.`
