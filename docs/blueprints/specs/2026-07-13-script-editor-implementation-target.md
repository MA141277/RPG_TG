# Script Editor Implementation Target

## Control Block

- version_id: `target.script-editor-implementation`
- version_label: `script-editor-implementation`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Implement the script-editor delivery path on top of the frozen script-editor contract baseline without reopening authoring, mapping, compatibility, shared-rule, or minimum-runtime-delta boundaries.`

### Scope

- `implement editor-project import / load / validate / save flow on top of the frozen authoring contract`
- `implement authoring -> runtime export flow on top of the frozen mapping contract`
- `implement compatibility import path for existing scenario packs according to the frozen compatibility/import-export policy`
- `implement the shared condition / effect authoring and validation path on top of the frozen shared-rule contract`
- `implement the bounded runtime-facing adapters, validators, and export pipeline required by the frozen minimum runtime delta`
- `implement creator-facing script-editor UI on top of the frozen authoring model and export contract`
- `prove one bounded end-to-end flow: import or create project -> edit -> validate -> export -> runtime-compatible pack output`

### Successor Handoff Contract

- `This version inherits target.script-editor-contract-freeze as its mandatory contract baseline.`
- `The frozen authoring contract, mapping contract, compatibility/import-export policy, shared condition/effect mechanism, and minimum runtime delta are the admission basis for implementation work in this successor version.`
- `Implementation work in this version must stay inside those frozen boundaries unless fresh evidence proves the frozen baseline is insufficient.`
- `If fresh evidence proves the frozen baseline is insufficient, record an explicit governance action instead of silently changing contract truth inside implementation work.`

### Admission Gate

- `target.script-editor-contract-freeze must already be closed with explicit frozen outputs recorded`
- `the successor version must cite the frozen baseline as its implementation input`
- `no queue under this version may redefine upstream contract truth without explicit new governance review`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.editor-project-load-save-foundation` | `required` | `editor project persistence family` | `Admit only if fresh evidence confirms that one bounded editor-project load/save and validation foundation is the smallest lawful first implementation cut on top of the frozen authoring contract.` |
| `queue.authoring-runtime-export-pipeline` | `required` | `runtime export family` | `Admit only if fresh evidence confirms that one bounded export pipeline and validator assembly cut is required to make the frozen mapping contract executable.` |
| `queue.compatibility-import-adapter` | `required` | `compatibility import family` | `Admit only if fresh evidence confirms that existing scenario-pack compatibility import still needs one bounded implementation cut under the frozen compatibility/import-export policy.` |
| `queue.shared-condition-effect-authoring-integration` | `required` | `shared rule integration family` | `Admit only if fresh evidence confirms that one bounded shared condition/effect authoring and validation integration cut is required under the frozen shared-rule contract.` |
| `queue.script-editor-ui-shell-and-core-workflow` | `required` | `creator workflow family` | `Admit only if fresh evidence confirms that one bounded creator-facing UI shell and core edit/validate/export workflow cut is the smallest lawful next implementation surface.` |

### Acceptance Criteria

- `a creator-facing script-editor flow exists on top of the frozen baseline`
- `editor project data can be loaded, edited, validated, and exported through the frozen contract path`
- `runtime-facing export conforms to the frozen mapping and compatibility policy`
- `shared condition/effect authoring uses the frozen shared mechanism rather than host-local rule dialects`
- `implementation evidence no longer depends on reopening the prior freeze version for core boundary questions`
- `one bounded end-to-end script-editor workflow is demonstrated on current source truth`

### Non-Goals

- `do not reopen the frozen authoring object model by default`
- `do not redefine authoring -> runtime mapping by UI convenience`
- `do not replace the frozen compatibility/import-export policy with a new policy inside implementation work`
- `do not invent feature-local condition/effect dialects outside the frozen shared mechanism`
- `do not absorb broad runtime modernization, unrelated refactors, or repository-wide cleanup into this version`
- `do not treat full product polish, broad UX exploration, or non-essential editor ergonomics as the default closeout gate`

### Drift Guards

- `Do not reopen authoring object definitions, object responsibilities, or naming rules by default inside implementation queues.`
- `Do not change mapping rules, export destinations, or compatibility precedence because a temporary UI flow feels inconvenient.`
- `Do not let host-specific editor screens grow private condition/effect rule dialects outside the frozen shared mechanism.`
- `Do not absorb broad runtime/schema modernization unless the frozen minimum-runtime-delta baseline is explicitly proven insufficient.`
- `Do not merge unrelated repository cleanup, shell refactor, or hardcode migration into this version by convenience.`
- `Do not treat visual polish, broad UX iteration, or optional tooling ergonomics as the default blocker for proving the core end-to-end script-editor workflow.`
- `If implementation evidence disproves the frozen baseline, stop and record explicit governance review instead of silently rewriting contract truth in code.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `This version is the direct successor to target.script-editor-contract-freeze.`
- `The predecessor version froze the contract boundary; this successor version is responsible for implementation on top of that frozen baseline rather than boundary rediscovery.`
- `Any later boundary correction must be handled as explicit governance, not silent implementation drift.`
