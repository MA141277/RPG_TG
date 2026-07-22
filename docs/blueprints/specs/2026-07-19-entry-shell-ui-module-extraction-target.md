# Entry Shell UI Module Extraction Target

## Control Block

- version_id: `target.entry-shell-ui-module-extraction`
- version_label: `Entry shell UI module extraction`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Extract the pre-game entry shell UI from MainUiFlow into a bounded reusable module while preserving current startup, JSON import, Script Editor entry, and character-selection behavior.`

### Version Draft Summary

- Goal:
  - `Promote MEMO-011 into a governed successor version after the city/building startup and background queues closed.`
- Required outcomes:
  - `Main menu rendering is owned by an Entry Shell module instead of being embedded directly in src/ui/main-ui/main-ui-flow.js.`
  - `JSON scenario start selection rendering is delegated to the Entry Shell module through a narrow contract.`
  - `Script Editor entry screens are delegated to the Entry Shell module without changing Script Editor workspace internals.`
  - `Character-selection entry presentation and action ids remain stable and continue to route through existing startup handlers.`
  - `MainUiFlow remains responsible for app state, persistence, file picker calls, startup callbacks, and invoking existing handlers.`
  - `Normal start, continue, JSON start, Script Editor entry, and character-selection entry visible behavior is preserved.`
- Explicit non-goals:
  - `Do not change game runtime startup/load semantics.`
  - `Do not extract in-game map, city, building, dialogue, review/council, or Script Editor workspace internals.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not introduce a new routing framework or rewrite MainUiFlow state ownership.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.entry-shell-ui-module-extraction` | `required` | `entry-shell render contract extraction and behavior preservation` | `Admit first because it owns evidence review, extraction, tests, and browser smoke proof for the startup/pre-game UI boundary.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-ENTRY-SHELL-001` | `Main menu render code is delegated to an Entry Shell module and action ids remain stable.` | `queue.entry-shell-ui-module-extraction` | `source guard + tests` | `src/ui/main-ui/main-ui-flow.js; new entry-shell view/contract module` | `MainUiFlow still owns main menu markup directly after extraction.` |
| `ACC-ENTRY-SHELL-002` | `JSON scenario start selection render code is delegated without changing import/startup semantics.` | `queue.entry-shell-ui-module-extraction` | `source guard + tests + browser smoke` | `MainUiFlow JSON start screen rendering; entry-shell module` | `JSON start works only through a new private shortcut or loses current diagnostics.` |
| `ACC-ENTRY-SHELL-003` | `Script Editor entry screens are delegated while Script Editor workspace internals stay out of scope.` | `queue.entry-shell-ui-module-extraction` | `source guard + tests + browser smoke` | `Script Editor landing/entry render path; entry-shell module` | `The extraction absorbs Script Editor workspace/editor behavior.` |
| `ACC-ENTRY-SHELL-004` | `Character-selection entry presentation and action contract are preserved.` | `queue.entry-shell-ui-module-extraction` | `tests + browser smoke` | `character selection entry view and MainUiFlow handlers` | `Character-selection startup behavior changes or required action ids drift.` |
| `ACC-ENTRY-SHELL-005` | `Startup/pre-game visible behavior is preserved for start game, continue game, JSON start, Script Editor entry, and character selection.` | `queue.entry-shell-ui-module-extraction` | `automated tests + simulated-human browser flow` | `tests/**; browser simulated-human flow` | `Tests pass by narrowing or hiding one of the entry flows.`

### Acceptance Criteria

- `The version may close only after every acceptance id is covered, blocked, or explicitly waived with reason.`
- `Browser/simulated-human evidence must distinguish render preservation from startup runtime behavior.`
- `MainUiFlow may orchestrate state and handlers, but it must not continue to own the extracted entry-shell markup.`
- `Final validation must run npm run typecheck, npm run lint:blueprints, and npm test.`
