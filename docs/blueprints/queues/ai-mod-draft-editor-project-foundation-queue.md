# AI Mod Draft Editor Project Foundation Queue

## Control Block

- queue_id: `queue.ai-mod-draft-editor-project-foundation`
- belongs_to_version: `target.ai-mod-draft-editor-project`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-20`
- governance_sync_source: `docs/blueprints/plans/2026-07-20-ai-mod-draft-editor-project-target-plan.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `complete`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `implementation-complete`
- residue_remaining: `none`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Implementation complete; npm run lint:blueprints, npm run lint:plans, npm run typecheck, and npm test passed locally.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Build the bounded AI Mod Draft v1 foundation: schema, diagnostics, deterministic conversion to Script Editor project package, package-writing CLI, and env-only AI generation CLI.`
- Forbidden expansions:
  - `Do not build browser UI integration.`
  - `Do not generate or execute JavaScript, regex scripts, or free-form runtime logic.`
  - `Do not implement full ranking, exam, QTE, economy, or minigame runtime simulation.`
  - `Do not store API keys or accept API keys as CLI arguments.`
  - `Do not make direct runtime-pack output the primary AI artifact.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-AI-MOD-DRAFT-SCHEMA-001`
  - `ACC-AI-MOD-DRAFT-CONVERSION-001`
  - `ACC-AI-MOD-DRAFT-PACKAGE-001`
  - `ACC-AI-MOD-DRAFT-CLIENT-001`
- acceptance_not_claimed:
  - `Browser UI integration.`
  - `Full multi-stage generation.`
  - `Runtime semantic expansion for unsupported AI-only systems.`
  - `Persistent API key management.`
- minimum_verification:
  - `npm run build:test`
  - `node --test tests/ai-mod-draft.test.cjs`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-AI-MOD-DRAFT-SCHEMA-001: AI Mod Draft v1 schema and normalizer accept a minimal first-stage draft and return deterministic diagnostics for invalid input.`
- `ACC-AI-MOD-DRAFT-CONVERSION-001: A valid first-stage draft converts to a complete ScriptEditorProjectDefinition with world, people, dialogue, event, binding, and editor-only residue data.`
- `ACC-AI-MOD-DRAFT-PACKAGE-001: The conversion CLI writes a full editor project package that loadScriptEditorProjectFromFiles can open.`
- `ACC-AI-MOD-DRAFT-CLIENT-001: AI draft generation uses an OpenAI-compatible client configured only by environment variables and never commits, prints, or writes API keys.`

#### Cannot Claim

- `A browser button or in-editor UI for generation.`
- `Arbitrary AI-generated logic execution.`
- `Full Taiko-like system runtime simulation beyond draft metadata and current Script Editor export support.`
- `Runtime support for event/minigame destinations beyond existing supported paths.`

#### Legacy Paths To Replace

- `Manual-only topic decomposition as the only path to create first-stage editor project package drafts.`

#### Compatibility Paths To Preserve

- `Script Editor project save/load/export contracts.`
- `serializeScriptEditorProjectToFiles output shape.`
- `loadScriptEditorProjectFromFiles compatibility.`
- `validateScriptEditorProjectForRuntimeExport fail-closed behavior.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `docs/superpowers/specs/2026-07-20-ai-mod-draft-editor-project-design.md`
  - `docs/superpowers/plans/2026-07-20-ai-mod-draft-editor-project-plan.md`
- Must modify:
  - `src/application/ai-mod-draft/*`
  - `tools/convert-ai-mod-draft.mjs`
  - `tools/generate-ai-mod-draft.mjs`
  - `tools/generate-script-editor-project-from-topic.mjs`
  - `tests/ai-mod-draft.test.cjs`
- Must preserve:
  - `Existing Script Editor project package canonical files.`
  - `Existing runtime-pack export ownership.`
  - `API keys never written to repository files or generated project packages.`

#### Verification Coverage

- `Focused tests cover schema diagnostics, conversion, CLI package writing, loader compatibility, prompt constraints, and missing env handling.`
- `Full verification runs npm run typecheck and npm test before closeout.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-ai-mod-draft-editor-project-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-ai-mod-draft-editor-project-target-plan.md`

### Queue Snapshot

- queue_goal: `Build the first AI Mod Draft schema/converter/CLI foundation for generating Script Editor project packages.`
- task_count: `1`
- completed_task_count: `1`
- remaining_task_count: `0`
- active_task_summary: `none`
- task_briefs:
  - `task.ai-mod-draft-editor-project-foundation.implementation: Execute the approved TDD plan for AI Mod Draft editor-project package generation.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.ai-mod-draft-editor-project-foundation.implementation` | `complete` | `Implemented the schema, converter, package writer CLI, AI client, and tests from the approved plan.` | `none` | `TDD complete; tests do not contact external API.` |

### Task Definitions

#### `task.ai-mod-draft-editor-project-foundation.implementation`

##### Control Block

- task_id: `task.ai-mod-draft-editor-project-foundation.implementation`
- state: `complete`
- task_kind: `execution`
- scope:
  - `src/application/ai-mod-draft/*`
  - `tools/convert-ai-mod-draft.mjs`
  - `tools/generate-ai-mod-draft.mjs`
  - `tools/generate-script-editor-project-from-topic.mjs`
  - `tests/ai-mod-draft.test.cjs`
- must_inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `docs/superpowers/specs/2026-07-20-ai-mod-draft-editor-project-design.md`
  - `docs/superpowers/plans/2026-07-20-ai-mod-draft-editor-project-plan.md`
- must_modify:
  - `src/application/ai-mod-draft/*`
  - `tools/convert-ai-mod-draft.mjs`
  - `tools/generate-ai-mod-draft.mjs`
  - `tools/generate-script-editor-project-from-topic.mjs`
  - `tests/ai-mod-draft.test.cjs`
- must_replace:
  - `Manual-only first-stage editor project package creation for AI-generated topic drafts.`
- must_preserve:
  - `Existing Script Editor project save/load/export behavior.`
  - `Runtime fail-closed behavior for unsupported semantics.`
  - `No API key persistence or logging.`
- must_not_change:
  - `Do not change main menu or Script Editor browser UI in this queue.`
  - `Do not add runtime support for AI-only residue systems.`
  - `Do not add generated JavaScript or regex execution.`
  - `Do not hardcode the operator-provided API key.`
- done_when:
  - `AI Mod Draft v1 normalizer returns deterministic diagnostics.`
  - `Valid first-stage draft converts to a complete ScriptEditorProjectDefinition.`
  - `Conversion CLI writes a loadable editor project package.`
  - `AI client and generation CLI read env vars and fail safely when config is missing.`
  - `Unsupported semantics are preserved as editor-only residue.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/ai-mod-draft.test.cjs`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record execution blockers in this queue doc and do not widen scope.`
  - `Do not turn unsupported runtime semantics into executable code.`
- promote_next_if_done: `none`
- stop_if:
  - `Implementation requires browser UI integration.`
  - `Implementation requires runtime semantic expansion.`
  - `Implementation requires storing API keys.`

##### Human Context

- task_brief:
  - `Implement the deterministic AI Mod Draft to Script Editor project package pipeline from the approved plan.`
- task_outcome_summary:
  - `Expected outcome is a tested schema/converter/CLI foundation that can produce a loadable editor project package from a first-stage draft.`
- Purpose:
  - `Give AI topic generation a safe, testable bridge into the existing Script Editor project package workflow.`
- Failure mode:
  - `Letting AI-generated free-form logic bypass deterministic validation or runtime fail-closed boundaries.`

### Verification Record

- `npm run build:test`: `passed`
- `node --test tests/ai-mod-draft.test.cjs`: `passed`
- `npm run lint:blueprints`: `passed`
- `npm run lint:plans`: `passed`
- `npm run typecheck`: `passed`
- `npm test`: `passed`

### Queue Closeout

- closeout_result: `complete`
- closed_at: `2026-07-20`
- residue_remaining: `none`
- next_effect: `return-to-version-review`
- summary:
  - `AI Mod Draft v1 schema, normalizer, converter, package writer CLI, env-only AI client, and one-shot topic-to-project CLI landed with focused and full regression coverage.`
