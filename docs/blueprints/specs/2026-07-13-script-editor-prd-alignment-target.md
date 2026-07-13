# Script Editor PRD Alignment Target

## Control Block

- version_id: `target.script-editor-prd-alignment`
- version_label: `script-editor-prd-alignment`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Align the script-editor product surface to docs/script-editor-prd.md while preserving the repository's existing runtime-compatible scenario-pack path and reusing rather than replacing current project/runtime capabilities.`

### Scope

- `align the creator-facing workspace, navigation model, and project overview flow to the PRD workbench contract`
- `align person, city, and building authoring surfaces to the PRD object responsibilities, menu-binding model, and structured editing expectations`
- `align dialogue, event, story, and condition authoring surfaces to the PRD's formal authoring/editor interaction requirements`
- `align minigame binding, preview, validation, and export surfaces to the PRD while reusing the landed script-editor persistence/import/export/shared-rule seams`
- `close the still-open gap between the current bounded implementation baseline and the broader product-facing editor behavior required by the PRD`

### Successor Handoff Contract

- `This version inherits target.script-editor-implementation as its mandatory implementation baseline and docs/script-editor-prd.md as its product requirement source.`
- `The prior implementation version already closed the bounded persistence, export, compatibility import, shared-rule task/export slice, creator shell, and first user-visible workflow seams; this successor version must consume those seams instead of pretending they do not exist.`
- `Implementation work in this version must stay compatible with the frozen authoring/mapping/compatibility/shared-rule baseline unless fresh evidence proves that baseline insufficient.`
- `If PRD alignment proves the frozen baseline or closed implementation baseline insufficient, record an explicit governance action instead of silently rewriting prior contract truth.`

### Admission Gate

- `target.script-editor-implementation must already be closed with explicit historical truth recorded`
- `docs/script-editor-prd.md must be cited as the bounded requirement source for this successor version`
- `no queue under this version may silently reopen the prior implementation version or redefine upstream contract truth without explicit governance review`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-prd-workspace-and-navigation-alignment` | `required` | `workspace shell and navigation family` | `Admit only if fresh evidence confirms that the PRD workbench, Chinese navigation model, and project-overview-first workflow remain the smallest lawful first product-surface cut.` |
| `queue.script-editor-prd-person-authoring-alignment` | `required` | `person authoring family` | `Admit only if fresh evidence confirms that the PRD person model, tabs, and structured editing flow still require one bounded implementation cut.` |
| `queue.script-editor-prd-city-building-and-menu-alignment` | `required` | `city / building / menu-binding family` | `Admit only if fresh evidence confirms that the PRD city-building container model and reusable menu-binding surface still require one bounded implementation cut.` |
| `queue.script-editor-prd-dialogue-event-story-alignment` | `required` | `dialogue / event / story family` | `Admit only if fresh evidence confirms that the PRD's formal dialogue, event, story, and structured condition authoring surface still require one bounded implementation cut.` |
| `queue.script-editor-prd-minigame-binding-alignment` | `required` | `minigame binding family` | `Admit only if fresh evidence confirms that the PRD minigame binding surface still requires one bounded configuration-first implementation cut on top of existing playable capabilities.` |
| `queue.script-editor-prd-preview-validation-export-alignment` | `required` | `preview / validation / export family` | `Admit only if fresh evidence confirms that PRD-aligned structure preview, performance preview, validation, and export handoff still require one bounded implementation cut after upstream authoring surfaces exist.` |

### Acceptance Criteria

- `the script editor exposes a PRD-aligned creator workbench rather than only the earlier bounded minimal workflow`
- `the editor remains Chinese-first and structure-first instead of defaulting creators back to raw JSON authoring`
- `person, city, building, dialogue, event, story, and minigame-binding surfaces exist as formal editor objects or bindings consistent with the PRD`
- `preview, validation, and export surfaces are built into the editor workflow and remain compatible with the repository's runtime-facing scenario-pack output`
- `alignment work continues to reuse current formal runtime/playable/building capabilities instead of inventing disconnected replacement systems`

### Non-Goals

- `do not reopen the frozen script-editor contract baseline by default`
- `do not replace the current runtime-compatible export path with a new runtime format by convenience`
- `do not implement brand-new gameplay systems when the PRD only requires configuration/binding on top of existing capabilities`
- `do not absorb unrelated runtime modernization, repository-wide cleanup, or broad product polish outside the PRD alignment surface`
- `do not silently turn the editor into a programmer-facing raw JSON tool as the default creator experience`

### Drift Guards

- `Do not treat PRD alignment as permission to discard the closed implementation baseline; consume landed seams first.`
- `Do not hardcode current city/building/menu samples as immutable authoring truth when the PRD explicitly requires configurable containers and bindings.`
- `Do not merge broad UX polish, asset-pipeline work, or runtime engine redesign into this version by convenience.`
- `Do not let host-specific screens invent new private rule dialects when the PRD only requires structured authoring on top of the shared-rule family.`
- `Do not make preview or validation a disconnected tool path when the PRD requires them as built-in editor capabilities.`

### Version Closeout Contract

- `Version may become done only after PRD-aligned acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before further queue admission or implementation resumes.`

### Archived Interpretation

- `This version is the direct successor to target.script-editor-implementation.`
- `The predecessor version proved the bounded end-to-end baseline; this successor version is responsible for aligning the broader product surface to the PRD on top of that baseline.`
- `Any later boundary correction must be handled as explicit governance rather than silent implementation drift.`
