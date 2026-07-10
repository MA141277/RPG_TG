# Script Editor Contract Freeze Target

## Control Block

- version_id: `target.script-editor-contract-freeze`
- version_label: `script-editor-contract-freeze`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Freeze the version-level design boundary for a creator-facing script editor without committing this version to full editor implementation.`

### Scope

- `freeze the editor-native authoring contract for creator-facing scenario authoring`
- `freeze the authoring -> runtime mapping contract that compiles editor objects into runtime-facing pack data`
- `freeze the compatibility / import-export policy for existing scenario-pack adoption, editor project persistence, and runtime-facing export`
- `freeze one shared condition / effect mechanism boundary reusable across event, task, dialogue, menu, and minigame authoring`
- `identify and bound the minimum runtime contract changes required for editor landing`

### Must Freeze

- `editor-native authoring contract`
  - `freeze the named core object set, object responsibilities, ownership boundaries, editor-only metadata rules, and creator-facing naming decisions`
- `authoring -> runtime mapping contract`
  - `freeze runtime export destinations, direct-export fields, editor-only fields, compatibility shims, and one object-level mapping matrix`
- `compatibility / import-export policy`
  - `freeze existing pack import policy, editor project persistence policy, runtime-facing export policy, and whether compatibility round-trip is mandatory`
- `shared condition / effect mechanism`
  - `freeze one reusable condition/effect contract family shared by event, task, dialogue, menu, and minigame authoring instead of feature-local rule formats`
- `minimum runtime contract changes`
  - `freeze the minimum required runtime/schema delta for editor landing, including required/optional/out-of-scope separation and an explicit ban on opportunistic runtime modernization`

### Required Decisions

- `whether person remains the single top-level authoring object for both playable-role and NPC configuration`
- `whether the editor project persists as one authoring manifest or multiple split authoring tables`
- `whether scene and dialogue export as separate runtime tables or one combined typed runtime table`
- `whether minigame rule authoring uses a generic graph, a bounded block system, or a hybrid preset-plus-extension model`
- `whether city/building menu authoring shares one host-parameterized schema or two separate schemas`
- `whether compatibility round-trip is mandatory: import existing pack -> edit -> export compatible pack`
- `whether old packs are handled by compatibility importer, migration, or both with explicit precedence`
- `which mismatches classify as Class A authoring-only difference, Class B additive pack/runtime extension, or Class C runtime behavior gap`

### Deferred Work

- `full script-editor UI delivery`
- `page layout, component decomposition, interaction polish, and temporary editor wiring`
- `repository-wide script hardcode migration`
- `large-scale runtime consumer rewrites or broad sub-runtime refactors`
- `modularization residue that is not strictly required to freeze the editor contract boundary`
- `non-essential runtime pack schema expansion beyond the frozen minimum delta list`

### Drift Guards

- `Do not widen this version from design-governed freeze into implementation-governed editor delivery without an explicit future version-boundary change.`
- `Do not change the authoring model merely because one provisional UI flow or component tree is inconvenient.`
- `Do not add runtime tables, fields, or loaders before the mapping matrix and mismatch classification justify them.`
- `Do not let editor-only metadata leak into runtime-facing pack output by convenience.`
- `Do not let event/task/dialogue/menu/minigame authoring grow separate condition/effect dialects without explicit shared-mechanism approval.`
- `Do not treat recorded queue families as live candidate truth or admission-ready implementation scope by default.`
- `Do not absorb shell closure, runtime modernization, or unrelated residue cleanup into this version unless later written evidence proves they are strictly required for the frozen contract boundary.`

### Non-Goals

- `main.ts pure shell closure by itself`
- `large-scale sub-runtimes refactor`
- `repository-wide migration of script-related hardcoded paths`
- `full script-editor UI delivery`
- `non-essential runtime pack schema expansion`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.editor-native-authoring-contract-freeze` | `required` | `authoring contract family` | `Admit only if fresh evidence proves the creator-facing editor object model, ownership boundary, or authoring lifecycle still lacks one frozen contract surface.` |
| `queue.authoring-runtime-mapping-contract-freeze` | `required` | `mapping contract family` | `Admit only if fresh evidence proves authoring objects still lack one explicit export or compile contract into the runtime-facing pack surface.` |
| `queue.compatibility-import-export-policy-freeze` | `required` | `compatibility policy family` | `Admit only if fresh evidence proves existing pack import, editor project persistence, or runtime export policy remains unfrozen.` |
| `queue.shared-condition-effect-mechanism-freeze` | `required` | `shared rule mechanism family` | `Admit only if fresh evidence proves condition or effect authoring still depends on feature-local branching rather than one reusable shared mechanism contract.` |
| `queue.minimal-runtime-contract-change-audit` | `required` | `runtime delta family` | `Admit only if fresh evidence proves editor landing requires runtime contract or schema changes and the minimum lawful delta is not yet explicitly bounded.` |

### Acceptance Criteria

- `editor-native authoring contract is frozen with named core objects, ownership boundaries, and editor-only metadata rules`
- `authoring -> runtime mapping contract is frozen with explicit compile/export rules and allowed compatibility shims`
- `compatibility / import-export policy is frozen for existing scenario packs, editor project data, and runtime-facing export artifacts`
- `shared condition / effect mechanism is frozen as one reusable contract family rather than feature-specific patches`
- `minimum runtime contract change list is explicit, bounded, and excludes non-required runtime or schema expansion`
- `the version remains design-governed through bounded contract-freeze queue admission and only leaves design-governed scope after a future explicit version-boundary change authorizes implementation-governed work`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `This version was opened on 2026-07-10 as the successor to target.project-complete-modularization after the prior modularization version was explicitly closed.`
- `The opening action intentionally separates script-editor design and contract freeze from modularization residue, runtime ownerization follow-up, and full editor implementation pressure.`
