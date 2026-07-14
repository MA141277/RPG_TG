# Script Editor Runtime Pack Unification Target

## Control Block

- version_id: `target.script-editor-runtime-pack-unification`
- version_label: `script-editor-runtime-pack-unification`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Converge the script editor, runtime startup path, and scenario-pack content model onto one formal scenario-pack truth so script-editor export is itself the production runtime pack rather than a separate project artifact plus long-lived compatibility lowering path.`

### Scope

- `define the final scenario-pack family contract that the editor and runtime must share, including which families are mandatory at runtime and which may resolve through explicit base-pack inheritance`
- `converge editor-owned authoring structures toward runtime family ownership instead of maintaining long-lived authoring-only parallel data families`
- `replace the current bounded runtime-export shortcut with one formal runtime-pack export path whose output is the same scenario-pack artifact the startup loader consumes`
- `turn basePackId into an explicit inheritance contract rather than a silent export-gap patch`
- `remove fixed-pack hard imports and other builtin-content privilege paths that bypass active scenario-pack content resolution`
- `shrink compatibility import/export to historical migration duty only, not daily authoring/export duty`

### Successor Handoff Contract

- `This version is a successor-candidate to target.script-editor-prd-alignment and consumes the already-landed contract freeze, implementation baseline, creator workbench baseline, and PRD-aligned authoring surfaces rather than reopening them by convenience.`
- `The earlier script-editor contract-freeze and implementation versions already proved a bounded authoring model, project persistence path, compatibility import path, and first-cut runtime export path; this successor version must reinterpret those as historical baseline evidence, not as the permanent final architecture.`
- `No queue under this version may introduce a new long-lived authoring-only family, a new private lowering dialect, or a new export-only shadow format just to avoid converging on scenario-pack truth.`
- `This document became live governance truth on 2026-07-14 after explicit Blueprint pointer updates closed target.script-editor-prd-alignment and promoted target.script-editor-runtime-pack-unification as the active successor version.`

### Admission Gate

- `target.script-editor-prd-alignment must be closed or explicitly superseded before this version becomes active governance truth`
- `current repository evidence must still prove that scenario-pack family convergence, hardcoded scenario content deprivileging, and compatibility retirement remain open after PRD alignment closes`
- `no queue under this version may be admitted until the version plan records which family contract is final, which editor structures are transitional only, and which inheritance rules are lawful`
- `basePackId inheritance must be treated as explicit contract truth; builtin fallback by convenience is not a lawful substitute`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-runtime-family-contract-alignment` | `required` | `final scenario-pack family contract and mandatory-vs-inheritable truth` | `Admit only if fresh evidence confirms that the repository still lacks one explicit final answer for which families are formal runtime truth, which are mandatory at startup, and which may resolve only through explicit base-pack inheritance.` |
| `queue.script-editor-runtime-family-authoring-convergence` | `required` | `editor-owned family convergence and transitional-structure retirement` | `Admit only after the final family contract is frozen and fresh evidence confirms that editor-facing data ownership still depends on long-lived authoring-only parallel structures.` |
| `queue.script-editor-runtime-pack-export-unification` | `required` | `formal runtime-pack export path and startup-consumable pack assembly` | `Admit only after family contract truth exists and fresh evidence confirms that the current export entrypoint still emits bounded or wrong-type output instead of the formal startup-consumable scenario-pack artifact.` |
| `queue.script-editor-base-pack-inheritance-governance` | `required` | `explicit basePackId inheritance semantics and family-level overlay rules` | `Admit only after formal family contract truth exists and fresh evidence confirms that base-pack inheritance behavior remains implicit, inconsistent, or treated as an export-gap patch rather than a declared contract.` |
| `queue.script-editor-fixed-pack-consumer-deprivileging` | `required` | `active-content-only runtime consumption and hardcoded pack bypass removal` | `Admit only if fresh evidence confirms that runtime/application consumers still hard-import fixed scenario-pack files or otherwise bypass active scenario-pack resolution.` |
| `queue.script-editor-compatibility-boundary-retirement` | `required` | `legacy-only compatibility import/export boundary` | `Admit only after the formal runtime-pack export path exists and fresh evidence confirms that compatibility logic still participates in daily authoring/export truth instead of historical migration-only duty.` |

### Final Runtime Family Contract

#### Mandatory Runtime Families

- `scenarioProfile`
- `characters`
- `cities`
- `houses`
- `events`
- `scenes`
- `activities`
- `tasks`
- `textEntries`

Rules:

- `These families define the minimum formal runtime scenario-pack surface for script-editor-owned gameplay/startup truth.`
- `By version closeout, these families must resolve through the same scenario-pack contract the startup loader consumes.`
- `They may be authored locally or inherited from an explicit base pack where the contract allows it, but they must not disappear through silent empty-array lowering, silent default injection, or compatibility-only reconstruction.`

#### Explicitly Inheritable Runtime Families

- `maps`
- `cityEntries`
- `cityNpcPools`
- `houseModuleDefaults`
- `houseAccessRefusalRules`
- `cards`
- `valuables`
- `historicalCharacters`
- `historicalCityRosters`
- `cityPortraits`
- `historicalCharacterIdByCharacterId`

Rules:

- `These families may remain absent from the local pack only when basePackId inheritance explicitly resolves them.`
- `If a family is neither exported locally nor resolved from the declared base pack, export must fail closed rather than emit a seemingly valid but runtime-incomplete pack.`
- `Inheritance semantics must be written per family as contract truth rather than inferred from whichever builtin pack currently happens to exist.`

### Transitional Authoring Structures To Retire

- `script-editor project export treated as a runtime-pack surrogate`
- `bounded direct-mapping export assumptions that leak queue-local direct-export shortcuts into long-term runtime truth`
- `compatibilityImport residue used as normal authoring storage rather than historical import evidence`
- `authoring-only shadow families that duplicate runtime ownership without a clear temporary retirement plan`
- `unsupported-family lowering that writes empty arrays or missing files while still presenting the result as an exportable runtime pack`
- `fixed-pack hard imports such as direct scenario-pack file imports in shared runtime/content access code`
- `implicit builtin fallback behavior that resolves missing content without explicit basePackId contract truth`

### Acceptance Criteria

- `the script editor exports one formal scenario-pack artifact that the startup loader can ingest directly without treating it as a different project/export class`
- `the repository has one explicit answer for which scenario-pack families are mandatory, which are inheritable, and which are unsupported`
- `editor-owned data structures converge on runtime family ownership instead of preserving a permanent authoring-only parallel truth layer`
- `basePackId inheritance is formalized as content inheritance contract, including fail-closed behavior when required families do not resolve`
- `runtime/application consumers stop hard-importing fixed scenario-pack content and instead read through active content resolution`
- `compatibility import/export remains available for historical migration, but daily authoring/export no longer depends on it`

### Non-Goals

- `do not treat this version as permission to do one more temporary export patch just to make the current package appear runnable`
- `do not create new private authoring families, one-off queue-local mapping rules, or startup-only reconstruction logic as convenience shortcuts`
- `do not widen this version into unrelated gameplay redesign, broad repository cleanup, or asset-pipeline work outside scenario-pack convergence`
- `do not remove basePackId inheritance entirely; the goal is to formalize it, not to force all content into one physical pack`
- `do not break historical import support while the repository still needs legacy package migration`

### Drift Guards

- `Do not allow compatibility layers to become the place where new runtime data first lands.`
- `Do not allow export success when mandatory runtime families still depend on silent omission or empty-array placeholders.`
- `Do not keep two durable truths for the same family once a runtime family contract has been declared.`
- `Do not let builtin scenario content remain privileged through direct imports once active content resolution can own that path.`
- `Do not let basePackId become a vague fallback label; every inheritable family must name explicit contract behavior.`

### Version Closeout Contract

- `Version may become done only after the editor/export/startup path shares one formal scenario-pack truth, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new same-version convergence queue may still be admitted through version-plan promotion review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If current active Blueprint truth never promotes this successor candidate, this document remains historical design inventory only and must not be treated as live execution authority.`

### Archived Interpretation

- `This is a successor-candidate version spec authored from the desired post-state backward: one formal scenario-pack content system, one runtime-consumable export artifact, explicit base-pack inheritance, and compatibility confined to historical migration.`
- `It is intentionally stricter than the earlier bounded implementation/export path so future work is constrained by final-state architecture instead of temporary convenience patches.`
- `Explicit Blueprint pointer updates on 2026-07-14 promoted this document from governed candidate to live successor version truth after the PRD-alignment version closed.`
