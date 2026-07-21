# AI Mod Draft Editor Project Target

## Control Block

- version_id: `target.ai-mod-draft-editor-project`
- version_label: `AI Mod Draft editor project generation`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Create a deterministic AI-assisted pipeline that turns a topic prompt into a validated AI Mod Draft, converts that draft into a full Script Editor project package, and keeps the existing Script Editor responsible for preview and runtime-pack export.`

### Version Draft Summary

- Goal:
  - `Build the first generic AI Mod Draft format and converter for topic-driven, Taiko-like first-stage Script Editor project generation.`
- Required outcomes:
  - `Define AI Mod Draft v1 schema and validation diagnostics.`
  - `Convert a valid first-stage draft into a complete Script Editor project package.`
  - `Provide CLI entrypoints for draft conversion, AI draft generation, and topic-to-editor-project generation.`
  - `Expose the same generation pipeline in the Script Editor landing UI without command-line use.`
  - `Keep API keys out of code, logs, generated files, and persistent browser storage.`
- Explicit non-goals:
  - `No generated JavaScript, regex scripts, or executable free-form runtime logic.`
  - `No multi-step browser wizard beyond the Script Editor landing-page generation panel.`
  - `No full multi-stage game generation.`
  - `No direct runtime-pack generation as the primary AI output.`
- Must preserve:
  - `Existing Script Editor project save/load/export contracts.`
  - `Existing runtime export fail-closed behavior for unsupported semantics.`
  - `User ability to open generated output through 剧本编辑器 -> 打开草稿.`
- Must replace:
  - `Conversation-only topic decomposition as the only way to produce editor project packages.`
  - `Ad hoc manual project package creation for the first generated topic slice.`
- Reference material:
  - `docs/superpowers/specs/2026-07-20-ai-mod-draft-editor-project-design.md`
  - `docs/superpowers/plans/2026-07-20-ai-mod-draft-editor-project-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`

### Evidence Draft Review

- evidence_draft_status: `reviewed`
- reviewed_by_operator: `yes`
- review_summary:
  - `The operator approved the generic AI Mod Draft direction, clarified that the desired output is an editor project package rather than a runtime package, and approved starting implementation after closing the prior Blueprint fixup version.`

### Draft Requirement Coverage

| Draft Requirement | Acceptance IDs | Status |
| --- | --- | --- |
| `AI generates a bounded draft rather than executable code.` | `ACC-AI-MOD-DRAFT-SCHEMA-001` | `covered` |
| `Code converts the draft into a complete Script Editor project package.` | `ACC-AI-MOD-DRAFT-CONVERSION-001` | `covered` |
| `Generated packages can be opened by the existing Script Editor loader.` | `ACC-AI-MOD-DRAFT-PACKAGE-001` | `covered` |
| `AI client reads only environment variables and does not expose keys.` | `ACC-AI-MOD-DRAFT-CLIENT-001` | `covered` |
| `Script Editor UI can invoke the same AI generation pipeline without command-line use.` | `ACC-AI-MOD-DRAFT-UI-001` | `covered` |

### Scope

- `AI Mod Draft v1 TypeScript schema and diagnostics.`
- `Deterministic normalization and conversion to ScriptEditorProjectDefinition.`
- `Full canonical Script Editor project package serialization.`
- `OpenAI-compatible topic-to-draft client using environment variables.`
- `Node CLI tools for conversion and generation.`
- `Script Editor landing-page AI generation panel using temporary form credentials.`
- `Focused tests proving conversion and package loadability.`

### Non-Goals

- `No arbitrary AI-generated code execution.`
- `No regex-based business logic execution.`
- `No browser UI beyond the landing-page generation panel.`
- `No persistent API key storage.`
- `No full ranking/exam/minigame runtime simulation in this version.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.ai-mod-draft-editor-project-foundation` | `required-priority` | `schema, converter, CLI, and AI client foundation` | `Admit first because no AI Mod Draft schema or converter exists and every later topic-generation workflow depends on a deterministic editor-project package output.` |
| `queue.ai-mod-draft-editor-project-ui-integration` | `required-priority` | `Script Editor landing-page generation panel` | `Admit only after the foundation converter/client exists so UI work can reuse the deterministic application service rather than duplicating semantic conversion.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-AI-MOD-DRAFT-SCHEMA-001` | `AI Mod Draft v1 schema and normalizer accept a minimal first-stage draft and return deterministic diagnostics for invalid input.` | `queue.ai-mod-draft-editor-project-foundation` | `unit` | `src/application/ai-mod-draft/*; tests/ai-mod-draft.test.cjs` | `No schema/normalizer exists or invalid drafts do not produce deterministic diagnostics.` |
| `ACC-AI-MOD-DRAFT-CONVERSION-001` | `A valid first-stage draft converts to a complete ScriptEditorProjectDefinition with world, people, dialogue, event, binding, and editor-only residue data.` | `queue.ai-mod-draft-editor-project-foundation` | `unit` | `src/application/ai-mod-draft/ai-draft-to-script-editor-project.ts; tests/ai-mod-draft.test.cjs` | `Converted project omits canonical families or lowers unsupported semantics into runtime-facing fields.` |
| `ACC-AI-MOD-DRAFT-PACKAGE-001` | `The conversion CLI writes a full editor project package that loadScriptEditorProjectFromFiles can open.` | `queue.ai-mod-draft-editor-project-foundation` | `integration` | `tools/convert-ai-mod-draft.mjs; src/application/script-editor/editor-project-loader.ts; tests/ai-mod-draft.test.cjs` | `Generated files cannot be loaded by the existing Script Editor project loader.` |
| `ACC-AI-MOD-DRAFT-CLIENT-001` | `AI draft generation uses an OpenAI-compatible client configured only by environment variables and never commits, prints, or writes API keys.` | `queue.ai-mod-draft-editor-project-foundation` | `unit + source-review` | `src/application/ai-mod-draft/ai-mod-draft-openai-client.ts; tools/generate-ai-mod-draft.mjs; tests/ai-mod-draft.test.cjs` | `The client accepts key CLI args, stores keys, prints keys, or lacks missing-env failure coverage.` |
| `ACC-AI-MOD-DRAFT-UI-001` | `The Script Editor landing page can generate an editor project from a topic using temporary form credentials and open it in the workspace.` | `queue.ai-mod-draft-editor-project-ui-integration` | `unit + source-review` | `src/application/ai-mod-draft/ai-mod-draft-ui-flow.ts; src/ui/main-ui/main-ui-flow.js; src/styles/script-editor.css; tests/ai-mod-draft.test.cjs` | `Generation remains command-line only, UI duplicates converter logic, or API keys are persisted.` |

### Acceptance Criteria

- `A checked-in test fixture or inline fixture representing "学渣在二中逆袭" can convert to a loadable Script Editor project package without network access.`
- `Unsupported AI-only semantics are preserved under storyPack.aiDraftResidue or equivalent editor-only metadata, not exported as executable runtime logic.`
- `The AI generation path is optional and guarded by missing-env diagnostics.`
- `Existing Script Editor save/load/export tests continue to pass.`

### Final Acceptance Coverage Contract

- `Final validation must review the Acceptance Matrix rather than only running a representative happy path.`
- `Every required acceptance must be covered, blocked, or explicitly accepted as non-blocking residue before version closeout.`
- `Final validation must not become the primary owner for implementation acceptance unless the acceptance is itself a validation-only requirement.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`
