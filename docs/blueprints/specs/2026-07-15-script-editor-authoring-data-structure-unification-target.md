# Script Editor Authoring Data Structure Unification Target

## Control Block

- version_id: `target.script-editor-authoring-data-structure-unification`
- version_label: `script-editor-authoring-data-structure-unification`
- closeout_contract_version: `v1`
- predecessor_version: `target.script-editor-runtime-pack-unification`
- source_draft: `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`

## Human Context

### Goal

- `Unify script-editor authoring surfaces and runtime-facing data structures so creators edit the same durable structures that scenario-pack export and runtime consumption use.`
- `Replace long-lived authoring-only shadows with schema-governed character, city, building, dialogue, story, event, field-mapping, condition, launch-policy, playable-binding, and save/status structures.`
- `Keep runtime mutation in explicit save/status overlays rather than mutating authored definitions or requiring empty status objects for new games.`

### Activation Basis

- `target.script-editor-runtime-pack-unification is closed with all recorded same-version queues done and no active task.`
- `draft.script-editor-authoring-data-structure-unification already records the next-version scope, priority authoring additions, candidate queue portfolio, and first/priority queue sketches.`
- `This target promotes that draft into live Blueprint truth; the draft remains historical source material and no longer owns active pointers.`

### Scope

- `Project cache, package location, explicit save, export-time persistence, preview loading, and project completion-state gating.`
- `Unified field id and field mapping tables for authoring controls, validation, display labels, value types, ordering, and runtime mutability.`
- `Character definitions, character authoring, CharacterStatus save overlays, selectors/materializers, and covered runtime consumer migration.`
- `City/building structures, city-local placements, entry/access conditions, dialogue bindings, refusal text references, NPC assignment, and centralized runtime resolvers.`
- `Dialogue, story node, event, condition, effect, launch-policy, task-chain, and runtime handoff structures that must be exportable and runtime-consumable without private lowering.`
- `Playable/minigame binding data only through governed playable integration contracts when that queue is admitted.`
- `End-to-end validation that proves the editor can author/load, save, preview, export, runtime-load, mutate status, save, restore, and validate typed conditions for the covered happy path.`

### Non-Goals

- `Do not reopen target.script-editor-runtime-pack-unification or admit new same-version queues under it.`
- `Do not solve this through compatibility-only adapters, projection-only export patches, or hidden runtime fallbacks as final behavior.`
- `Do not introduce save/status objects as initial data for new games when no runtime mutation exists.`
- `Do not invent new playable mechanics in this version unless a separately admitted playable-governed queue authorizes it.`
- `Do not treat broad visual polish, cloud sync, multi-user collaboration, or unrelated gameplay redesign as part of this version.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-project-cache-save-export-preview` | `required-priority` | `Project cache JSON, package path validation, create-at-save-path workflow, explicit save, export-time persistence, imported package editing, and preview loading from the active package.` | `Admit first unless fresh evidence proves a narrower prerequisite; persistence and preview boundaries must exist before broader authoring/data convergence relies on editable package truth.` |
| `queue.script-editor-project-completion-state-gating` | `required-priority` | `Project edit-complete flag, export-completion gating, unfinished-project resume prompts, and completion-state persistence.` | `Admit after or with the cache/save queue when completion-state storage can be implemented without widening into unrelated schema work.` |
| `queue.script-editor-unified-field-mapping-table-freeze` | `required` | `Field id convention, field display mapping, field definitions, UI control metadata, and value-type validation hints.` | `Admit before object-family UI convergence unless the first object-family queue owns a deliberately bounded initial mapping slice.` |
| `queue.script-editor-character-definition-status-convergence` | `required` | `CharacterDefinition, script-editor character data, CharacterStatus overlay, selectors/materializers, and runtime character consumer migration.` | `Admit when package persistence boundaries are stable enough to migrate character records without creating a second durable truth.` |
| `queue.script-editor-character-authoring-surface-completion` | `required` | `Authoring controls for baseAttributes, profileMap, statMap, skillMap, customMap, dialogueIds, eventIds, and tradeBinding.` | `Admit separately only if the UI/control work is too large to stay inside character-definition convergence.` |
| `queue.script-editor-schema-reference-and-migration-freeze` | `required` | `Formal schema reference, legacy-shape supersession rules, migration adapters, export/runtime contracts, and schema-version freeze.` | `Admit before retiring old structures or when multiple queues need one durable replacement reference.` |
| `queue.script-editor-city-building-entry-and-npc-authoring-priority` | `required-priority` | `Building dialogue binding, building/city entry conditions, refusal text references, city building selection, and NPC assignment.` | `Admit when field mapping and condition basics are sufficient for the priority city/building authoring additions.` |
| `queue.script-editor-city-building-structure-convergence` | `required` | `City/building authoring, runtime structures, entry bindings, menu entries, access rules, and runtime lookup.` | `Admit after priority authoring gaps are mapped, unless fresh evidence shows runtime structure migration must happen first.` |
| `queue.script-editor-city-building-placement-resolver-convergence` | `required` | `City-local placements, placement ids, override layering, NPC assignment ownership, access rules, dialogue inheritance, and centralized resolver seams.` | `Admit before runtime views manually stitch city/building/placement/NPC/dialogue/condition data.` |
| `queue.script-editor-dialogue-story-structure-convergence` | `required` | `Dialogue records, dialogue nodes, story nodes, participant/text references, and runtime dialogue/story consumption.` | `Admit when narrative data can move from authoring/export lowering into runtime-consumable structures.` |
| `queue.script-editor-dialogue-story-runtime-handoff-convergence` | `required` | `Dialogue node runtime handoff, story progression state, branch entry/exit semantics, and runtime materialization.` | `Admit after structure convergence exposes runtime handoff residue that cannot be closed by schema work alone.` |
| `queue.script-editor-condition-authoring-contract-freeze` | `required` | `Schema-driven condition definitions, dropdown condition selection, type-aware value controls, and fail-closed validation.` | `Admit before event/story/city/building queues depend on typed conditions at runtime scale.` |
| `queue.script-editor-condition-runtime-evaluation-convergence` | `required` | `Runtime condition context, related/trigger/player/global subjects, reference resolution, target-set evaluation, and diagnostics.` | `Admit after condition authoring contract exists and runtime evaluation is the remaining blocker.` |
| `queue.script-editor-event-structure-convergence` | `required` | `Event triggers, typed conditions, effects, related entity references, and runtime event activation.` | `Admit when condition and field contracts are stable enough to migrate event records.` |
| `queue.script-editor-event-effect-activation-convergence` | `required` | `Typed effects, ordered chains, target resolution, activation receipts, and runtime mutation ownership.` | `Admit when event records can export but effect execution remains not runtime-owned.` |
| `queue.script-editor-scenario-launch-policy-authoring` | `required-priority` | `Shell character selection vs fixed character startup, selectable character range, initial map/city/building/view, and entry event timing authoring.` | `Admit when startup policy becomes the smallest remaining blocker to editor-authored packs launching without manual JSON patching.` |
| `queue.script-editor-playable-minigame-binding-convergence` | `required` | `Editor-facing playable/minigame binding records, participants, launch conditions, payloads, settlement outputs, rewards, penalties, and return points.` | `Admit only with playable governance; do not change shared playable runtime or house-hosted flows without the required governance references.` |
| `queue.script-editor-branching-event-task-chain-convergence` | `required` | `Branching dialogue choices, event effect chains, task stages, long-running task state, completion/failure conditions, rewards, and runtime progression handoff.` | `Admit after dialogue/event/task basics exist and richer branching/task-chain residue is the smallest bounded continuation.` |
| `queue.script-editor-status-overlay-generalization-review` | `candidate-review` | `Review whether non-character overlays are required for cities, buildings, tasks, story progress, events, or global scenario state.` | `Admit only when fresh evidence proves non-character runtime mutation needs explicit save/status ownership.` |
| `queue.script-editor-legacy-structure-supersession-review` | `required` | `Inventory retained, migrated, adapter-supported, and retired script-editor structures overlapping this version.` | `Admit before deleting or invalidating prior frozen structures, or when queues disagree about old-vs-new truth.` |
| `queue.script-editor-end-to-end-authoring-runtime-flow-validation` | `required-final` | `Representative full-flow fixture covering author/load, save, preview, export, runtime load, typed conditions, status mutation, save, and restore.` | `Admit only after required object-family and runtime handoff queues have enough coverage to prove closeout honestly.` |

### Acceptance Criteria

- `The editor persists selected/imported package paths, blocks stale cache entries, supports explicit save, validates preview/export, and treats export as the only step that can mark a project complete.`
- `Covered authoring families use schema-governed fields and typed conditions rather than free-text or UI-only shadows.`
- `Character, city, building, dialogue, story, event, launch-policy, and playable-binding records admitted in this version become runtime-consumable structures or explicitly routed future residue.`
- `Runtime selectors/materializers consume unified structures for covered paths, and runtime mutations write save/status overlays rather than mutating authored definitions.`
- `Imported packages are edited in place, exported packages load through startup without manual JSON patching for covered structures, and validation fails closed for invalid references or condition values.`
- `Final validation proves an end-to-end editor-authored package can be saved, previewed, exported, loaded, played through at least one covered path, saved, restored, and inspected without compatibility-only residue on the happy path.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`
