# Script Editor Event Binding Post-Closeout Fixups Target

## Control Block

- version_id: `target.script-editor-event-binding-post-closeout-fixups`
- version_label: `Script Editor event binding post-closeout fixups`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Handle submit/merge blockers discovered after target.script-editor-event-binding-runtime-replacement was legally closed, without reopening that closed version.`

### Version Draft Summary

- Goal:
  - `Complete the event destination authoring selector and then runtime preview-from-memory so post-closeout browser validation can configure and run current Script Editor data through supported runtime paths.`
- Required outcomes:
  - `Event destination family authoring exposes only the currently runnable-supported dialogue path as the main route, with Chinese labels.`
  - `Event destination targetId authoring uses project.dialogues-backed selection instead of free-text target id entry.`
  - `Runtime preview starts from current in-memory Script Editor project data through the official export/load/startup path, without requiring a saved project directory.`
- Explicit non-goals:
  - `Do not reopen or change target.script-editor-event-binding-runtime-replacement version_status=done.`
  - `Do not expand EventBindingRuntime semantics.`
  - `Do not claim non-dialogue event destinations as runnable support unless a later admitted queue explicitly implements that runtime support.`
- Must preserve:
  - `Closed event-binding runtime replacement outcomes, including EventDefinition trigger/conditions retirement and EventBinding/event-bindings.json ownership.`
  - `Fail-closed behavior for unsupported destinations and unsupported advanced conditions.`
- Must replace:
  - `Event destination authoring free-text targetId main path.`
  - `Saved-directory-only Script Editor runtime preview path.`
- Reference material:
  - `target.script-editor-event-binding-runtime-replacement closed version evidence.`
  - `docs/script-editor-event-trigger-binding-design.md`
  - `Browser/post-closeout validation findings recorded by the operator on 2026-07-17.`

### Evidence Draft Review

- evidence_draft_status: `reviewed`
- reviewed_by_operator: `yes`
- review_summary:
  - `The operator identified two submit/merge blockers after closeout: event destination selector completion and runtime preview from in-memory editor data. Destination selector completion must run first because preview validation needs a reliable UI path for configuring a runnable dialogue target.`

### Draft Requirement Coverage

| Draft Requirement | Acceptance IDs | Status |
| --- | --- | --- |
| `Destination family and target authoring uses supported dialogue selector controls.` | `ACC-POST-CLOSEOUT-DESTINATION-SELECTOR-001` | `covered` |
| `Runtime preview starts from current in-memory Script Editor data through the official runtime pack loading path.` | `ACC-POST-CLOSEOUT-RUNTIME-PREVIEW-001` | `covered` |

### Scope

- `Fix event destination selector authoring for supported dialogue destinations.`
- `Add runtime preview-from-memory after destination selector completion closes.`

### Non-Goals

- `No reopening of the closed event-binding runtime replacement version.`
- `No EventBindingRuntime semantic expansion.`
- `No non-dialogue event destination runnable support in the destination selector queue.`
- `No commit, push, or merge as part of admission.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-event-destination-selector-completion` | `required-priority` | `post-closeout blocker fix` | `Admit first because UI destination selection gates browser validation and runtime preview target configuration.` |
| `queue.script-editor-runtime-preview-from-memory` | `required-follow-up` | `post-closeout blocker fix` | `Admit only after destination selector completion closes, because preview must run against reliably configurable supported destinations.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-POST-CLOSEOUT-DESTINATION-SELECTOR-001` | `Event page destination family main path is Chinese-labeled dialogue-only runnable support, and targetId is selected from project.dialogues with title plus id while saving dialogue.id.` | `queue.script-editor-event-destination-selector-completion` | `unit + browser acceptance` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/story-dialogue-event-authoring.ts; src/application/script-editor/runtime-pack-export.ts; tests/robustness.test.cjs` | `Event page still exposes raw English destination family enums or targetId free text as the main authoring route.` |
| `ACC-POST-CLOSEOUT-RUNTIME-PREVIEW-001` | `Script Editor runtime preview starts from unsaved in-memory project data through the official export/load/startup path, blocks on export diagnostics, shows exit preview, and restores editor context.` | `queue.script-editor-runtime-preview-from-memory` | `unit + browser acceptance` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/workspace-shell.ts; tests/robustness.test.cjs` | `Preview still requires scriptEditorProjectDirectoryHandle or saved disk package before runtime launch.` |

### Acceptance Criteria

- `Destination selector queue closes before runtime preview-from-memory is admitted.`
- `Final version closeout may only happen after both required queues are closed or explicitly dispositioned.`
- `Unsupported paths remain visibly bounded and fail closed rather than presenting as runnable support.`

### Final Acceptance Coverage Contract

- `Final validation must review the Acceptance Matrix rather than only running a representative happy path.`
- `Every required acceptance must be covered, blocked, or explicitly accepted as non-blocking residue before version closeout.`
- `Browser runtime proof must distinguish successful UI interaction from successful runtime trigger/effect proof.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
