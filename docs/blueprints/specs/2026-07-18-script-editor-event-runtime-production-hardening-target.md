# Script Editor Event Runtime Production Hardening Target

## Control Block

- version_id: `target.script-editor-event-runtime-production-hardening`
- version_label: `Script Editor event runtime production hardening`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Make the new EventBindingRuntime/event-bindings.json system the only production event trigger path by removing old event trigger/condition residues, migrating the Liu Bang built-in pack to the new format, and proving real Script Editor authoring plus runtime triggering through simulated human flows.`

### Version Draft Summary

- Goal:
  - `Harden event runtime production readiness after the event-binding replacement and post-closeout fixup versions by cleaning remaining old event-system code/data residues and proving creator-facing event authoring works end-to-end.`
- Required outcomes:
  - `EventDefinition remains content-only and does not regain trigger or conditions ownership.`
  - `event-bindings.json remains the only long-term trigger configuration source.`
  - `Old trigger scanners, old event-body condition evaluators, storyPack.runtimeEvents side channels, and old event-body trigger/conditions data are deleted or explicitly blocked.`
  - `The Liu Bang built-in scenario pack follows the same event-bindings.json runtime-pack format and remains playable through a simulated human flow.`
  - `Script Editor owner-local event binding authoring is validated by real/simulated author operations across person, city, building, dialogue, minigame, and story-node surfaces.`
  - `Runtime effectiveness is proven for every supported trigger entrypoint claimed by this version, with browser proof recorded separately from automated runtime proof.`
- Explicit non-goals:
  - `Do not reopen target.script-editor-event-binding-runtime-replacement.`
  - `Do not reopen target.script-editor-event-binding-post-closeout-fixups.`
  - `Do not change EventBindingRuntime semantics except where a later admitted queue explicitly owns a semantic expansion.`
  - `Do not count unsupported owner, trigger, destination, or advanced condition authoring as runtime support.`
  - `Do not implement new dialogue/minigame/story-node runtime entrypoints unless this version explicitly admits that expansion after evidence review.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `required` | `production hardening plus acceptance proof` | `Admit first because it owns the complete source/data residue cleanup, Liu Bang pack migration, Script Editor simulated-human authoring acceptance, runtime effectiveness proof, and fail-closed guard review requested by the operator.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-EVENT-RUNTIME-PRODUCTION-001` | `Old event trigger/condition production residues are removed or explicitly fail closed, while EventDefinition remains content-only.` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `source guard + tests` | `src/application/events/condition-evaluator.ts; src/domain/event.ts; src/application/scenario/scenario-pack-loader.ts; tests/robustness.test.cjs` | `Old condition evaluator, EventDefinition trigger/conditions, storyPack.runtimeEvents, or loader acceptance of old event-body trigger/conditions remains unclassified.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-002` | `Script Editor simulated-human authoring covers person, city, building, dialogue, minigame, and story-node owner-local event binding surfaces.` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `browser/simulated human + automated UI guard` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/story-dialogue-event-authoring.ts; tests/**` | `Source-string-only checks exist without proving real creator operation on all owner-local surfaces.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-003` | `Supported runtime entrypoints trigger events through EventBindingRuntime from editor authoring through export, loader, TriggerContext, active event/scene handoff, and eventHistory.` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `automated runtime effectiveness + browser proof where stable` | `src/core/runtime/event-binding-runtime.ts; src/application/story/story-runtime.ts; src/application/script-editor/runtime-pack-export.ts; tests/**` | `Runtime success is inferred from saved binding data without observing activeEventId, activeSceneId, scene handoff, or eventHistory.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-004` | `Unsupported owners, triggers, destinations, and advanced/custom/binding-context conditions remain fail closed and are not presented as runnable support.` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `export/loader diagnostics + UI/source guard` | `src/application/script-editor/runtime-pack-export.ts; src/ui/main-ui/main-ui-flow.js; tests/**` | `Unsupported authoring silently exports as runnable or is counted as runtime support.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-005` | `The Liu Bang built-in scenario pack uses event-bindings.json for trigger configuration and no longer stores trigger/conditions inside events.json.` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `content migration + loader/runtime tests` | `src/content/scenario-packs/liu-bang-pei-county-opening/**; src/content/pack-content-access.ts; tests/**` | `Liu Bang events.json still contains trigger/conditions or pack.json lacks eventBindings when the scenario needs trigger data.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-006` | `A real or browser-backed flow proves an author can configure entering a city to open a dialogue, run through the unified game entry flow, enter the city, and observe the event/dialogue trigger result; Liu Bang remains playable after migration.` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `browser/simulated human acceptance + waiver log where browser runtime proof is inconclusive` | `Script Editor runtime preview; JSON runtime pack import; normal start flow` | `Only automated unit tests pass while real editor and runtime flows are unverified or waived without reason.` |

### Acceptance Criteria

- `The version may close only after every acceptance id is covered, blocked, or explicitly waived with reason.`
- `Browser acceptance must separate creator UI proof from actual runtime trigger proof.`
- `A fail-closed diagnostic is not runtime support.`
- `Final validation must run npm run typecheck, npm run lint:blueprints, and npm test.`
