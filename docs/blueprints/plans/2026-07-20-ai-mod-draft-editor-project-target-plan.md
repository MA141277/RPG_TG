# AI Mod Draft Editor Project Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.ai-mod-draft-editor-project`
- version_status: `open`
- active_phase: `phase.version-review`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `classify-fresh-work`
- resume_gate: `open-version-no-active-queue`
- post_queue_closeout_pause_policy: `pause-when-explicitly-requested`
- promotion_review_result: `none`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `none`
- intake_item_id: `none`
- intake_summary: `none`
- intake_result: `none`
- intake_feedback_mode: `none`
- closure_review_subject: `none`
- closure_review_status: `none`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `none`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.ai-mod-draft-editor-project-foundation`
  - `queue.ai-mod-draft-editor-project-ui-integration`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot: []
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `current version plan`
  - `candidate_queue_ids`
  - `Candidate Recovery Ledger`
  - `Queue Promotion Ledger`
  - `named queue docs`

## Human Context

### Activation Record

- Scope approval:
  - `The operator approved closing the prior post-closeout fixup version and starting AI Mod Draft editor-project generation as a new Blueprint target.`
- Activation basis:
  - `target.script-editor-event-binding-post-closeout-fixups is closed with version_status=done, active_queue=none, candidate_backlog_refresh_status=fresh, and candidate_backlog_snapshot empty.`
  - `The operator approved a generic AI output format that generates editor project packages rather than direct runtime packs.`
  - `A read-only subagent review confirmed the canonical Script Editor project files, minimal loadable fields, current runtime-lowering risks, and converter module boundaries.`
  - `The repository already has Script Editor save/load/export seams that can be reused deterministically.`
- Activation conclusion:
  - `target.ai-mod-draft-editor-project is the open successor version for AI-assisted mod draft generation.`
  - `queue.ai-mod-draft-editor-project-foundation is admitted as the first active queue because schema, deterministic conversion, and CLI generation are required before later UI or richer gameplay-loop generation work.`

### Evidence Draft Summary

- evidence_draft_status: `reviewed`
- acceptance_matrix_ref: `docs/blueprints/specs/2026-07-20-ai-mod-draft-editor-project-target.md#acceptance-matrix`
- operator_review_scope:
  - `The operator reviewed target intent, output kind, AI/code separation, converter approach, and first implementation boundary.`
- high_risk_drift_points:
  - `Generated AI semantics could drift into executable JS, regex, or free-form runtime logic if not blocked by schema and diagnostics.`
  - `Unsupported runtime semantics could be accidentally lowered into runtime-facing fields instead of editor-only residue.`
  - `API keys could leak through command arguments, logs, generated files, or tests if not constrained to environment variables.`
- first_queue_recommendation:
  - queue_id: `queue.ai-mod-draft-editor-project-foundation`
  - basis: `No schema, converter, or CLI currently exists; this foundation queue is the prerequisite for every topic-to-editor-project workflow.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `A queue may be admitted only after version-plan admission fields are synchronized and the queue doc exists with queue_status=active plus a live active_task.`
- `User approval of the AI draft concept is scope approval plus admission evidence, but implementation authority comes from the admitted queue doc.`

### Queue Admission Startup Rules

- `On resume, read project-progress first, then blueprint.md, then this version plan, then the active queue document.`
- `If active_queue is not none, continue only through the named queue and its active_task.`
- `If active_queue is none and version_status is open, perform promotion review before admitting any queued implementation work.`
- `Do not admit a queue unless the queue document exists, exposes queue_status=active, and names one live active_task.`
- `Do not route implementation work directly from this version plan when a queue document is required.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.ai-mod-draft-editor-project-foundation` | `queue-candidate` | `queue.ai-mod-draft-editor-project-foundation` | `closed` | `only if converter boundary or Script Editor package contract changes after implementation` | `ACC-AI-MOD-DRAFT-SCHEMA-001; ACC-AI-MOD-DRAFT-CONVERSION-001; ACC-AI-MOD-DRAFT-PACKAGE-001; ACC-AI-MOD-DRAFT-CLIENT-001` | `src/application/ai-mod-draft/*; tools/*ai-mod-draft*.mjs; tests/ai-mod-draft.test.cjs` | `AI draft schema, converter, package writer, env-only AI client` | `browser UI; full game generation; arbitrary runtime code execution; direct runtime-pack output as primary artifact` | `Closed on 2026-07-20 after implementation and verification passed.` |
| `item.ai-mod-draft-editor-project-ui-integration` | `current-target-item` | `queue.ai-mod-draft-editor-project-ui-integration` | `closed` | `only if the Script Editor landing AI generation panel regresses` | `ACC-AI-MOD-DRAFT-UI-001` | `src/application/ai-mod-draft/ai-mod-draft-ui-flow.ts; src/ui/main-ui/main-ui-flow.js; src/styles/script-editor.css; tests/ai-mod-draft.test.cjs` | `Script Editor landing AI generation panel with temporary form credentials` | `persistent API keys; multi-step wizard; runtime-pack generation; arbitrary generated code execution` | `Closed on 2026-07-20 after the operator approved the recommended landing-panel approach and focused verification passed.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.ai-mod-draft-editor-project-foundation` | `closed` | `none` | `Closed after landing the bounded schema, deterministic converter, package writer, and AI generation CLI foundation.` |
| `queue.ai-mod-draft-editor-project-ui-integration` | `closed` | `none` | `Closed after landing the Script Editor landing-page AI generation panel and application helper handoff.` |

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.ai-mod-draft-editor-project-foundation` | `docs/superpowers/specs/2026-07-20-ai-mod-draft-editor-project-design.md; docs/superpowers/plans/2026-07-20-ai-mod-draft-editor-project-plan.md; subagent read-only review` | `ACC-AI-MOD-DRAFT-SCHEMA-001; ACC-AI-MOD-DRAFT-CONVERSION-001; ACC-AI-MOD-DRAFT-PACKAGE-001; ACC-AI-MOD-DRAFT-CLIENT-001` | `src/domain/script-editor-project.ts; src/application/script-editor/editor-project-save.ts; src/application/script-editor/editor-project-loader.ts; src/application/script-editor/runtime-pack-export.ts; tests/ai-mod-draft.test.cjs` | `Manual-only topic decomposition for creating editor project package drafts.` | `Existing Script Editor project save/load/export contracts and runtime fail-closed behavior.` | `Implementation requires browser UI integration, runtime semantic expansion, arbitrary generated code execution, or persistent API key storage.` |
| `queue.ai-mod-draft-editor-project-ui-integration` | `docs/superpowers/specs/2026-07-20-ai-mod-draft-ui-integration-design.md; docs/superpowers/plans/2026-07-20-ai-mod-draft-ui-integration-plan.md` | `ACC-AI-MOD-DRAFT-UI-001` | `src/application/ai-mod-draft/ai-mod-draft-ui-flow.ts; src/ui/main-ui/main-ui-flow.js; src/styles/script-editor.css; tests/ai-mod-draft.test.cjs` | `Command-line-only AI generation workflow.` | `Existing Script Editor landing, project library, workspace handoff, preview, validation, and export contracts.` | `Implementation requires persistent credentials, a multi-step wizard, runtime-pack direct generation, or generated executable logic.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-AI-MOD-DRAFT-SCHEMA-001` | `queue.ai-mod-draft-editor-project-foundation` | `tests/ai-mod-draft.test.cjs; npm run build:test` | `covered` | `none` |
| `ACC-AI-MOD-DRAFT-CONVERSION-001` | `queue.ai-mod-draft-editor-project-foundation` | `tests/ai-mod-draft.test.cjs; npm run build:test` | `covered` | `none` |
| `ACC-AI-MOD-DRAFT-PACKAGE-001` | `queue.ai-mod-draft-editor-project-foundation` | `tests/ai-mod-draft.test.cjs; loadScriptEditorProjectFromFiles` | `covered` | `none` |
| `ACC-AI-MOD-DRAFT-CLIENT-001` | `queue.ai-mod-draft-editor-project-foundation` | `tests/ai-mod-draft.test.cjs; source review` | `covered` | `none` |
| `ACC-AI-MOD-DRAFT-UI-001` | `queue.ai-mod-draft-editor-project-ui-integration` | `tests/ai-mod-draft.test.cjs; source review` | `covered` | `none` |

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
- Internal-only Blueprint work:
  - `read project-progress -> blueprint -> version plan -> active queue -> active task`
  - `attempt active-queue absorption`
  - `classify and route the intake`
  - `record candidate truth or admission truth without asking the operator to fill internal fields`
- Default operator output:

```text
处理结果：
- 加入状态：成功 / 失败 / 成功，已加入
- 加入类型：执行队列 / 候选队列 / 未加入
- 加入队列：`具体队列ID` / `none`

原因说明：
- 用 2~4 句话说明为什么进入该队列，或者为什么没有成功加入。
- 如果没有进入执行队列，要明确说明是因为当前已有 active queue，还是因为它当前只满足候选条件。

当前执行情况：
- 当前执行队列：`具体队列ID`
- 当前任务：`具体 task ID`
- 当前队列目标：一句话说明

下一步：
- 说明 Blueprint 接下来会如何处理
- 人工操作：当前不需要 / 当前需要确认 xxx
```

- Default visibility rule:
  - `默认不向人工暴露真值链细节、候选全集、Why Not The Others、Human Involvement Boundary、admission 内部字段或排序全过程，除非人工明确要求展开内部分析。`

### Progress Log

- `2026-07-20`: `Closed target.script-editor-event-binding-post-closeout-fixups after explicit operator confirmation, created target.ai-mod-draft-editor-project, and admitted queue.ai-mod-draft-editor-project-foundation as the active queue. No feature code was changed in this Blueprint activation step.`
- `2026-07-20`: `Implemented the foundation AI Mod Draft schema, deterministic editor-project conversion, package CLI, env-only OpenAI-compatible generation client, and regression coverage. Focused tests passed; full npm test resumed after repairing this plan structure.`
- `2026-07-20`: `Closed queue.ai-mod-draft-editor-project-foundation after npm run lint:blueprints, npm run lint:plans, npm run typecheck, and npm test passed locally. Version remains open with no active queue for future UI or richer semantic-generation follow-up.`
- `2026-07-20`: `Closed queue.ai-mod-draft-editor-project-ui-integration after adding the Script Editor landing AI generation panel, application helper handoff, responsive styles, and focused tests. npm run lint:blueprints, npm run lint:plans, npm run typecheck, npm run build, and npm test passed locally.`
- `2026-07-20`: `Fixed AI generation handoff staying on the landing page when model output carried non-string nested fields. Added nested-field sanitization regression coverage and verified the browser mock generation path opens the workspace.`
- `2026-07-20`: `Fixed wrapped AI JSON response extraction before normalization, covering model outputs that place the requested draft under draft/data/result and previously showed missing id/title diagnostics. npm run typecheck and npm test passed.`
- `2026-07-20`: `Fixed AI draft-shaped responses that omit top-level id/title by deriving stable identity from the requested topic. npm run typecheck, npm test, npm run build, npm run lint:blueprints, and npm run lint:plans passed.`
- `2026-07-20`: `Added browser console diagnostics for AI generation output and conversion summaries so sparse model output can be distinguished from conversion loss. npm run build:test with tests/ai-mod-draft.test.cjs and npm run typecheck passed.`
- `2026-07-20`: `Rejected AI draft shells that would create empty editor projects and strengthened the AI prompt with minimum editable content counts. RED-GREEN verified with tests/ai-mod-draft.test.cjs and npm run typecheck passed.`
- `2026-07-20`: `Accepted common model alias fields for world and entity structures while strengthening the prompt to require exact editable field paths. RED-GREEN verified with tests/ai-mod-draft.test.cjs and npm run typecheck passed.`
- `2026-07-21`: `Made AI-generated editor projects runtime-previewable by avoiding unsupported story-node relation lowering and normalizing event binding triggers to runtime-supported after:* actions. RED-GREEN verified with tests/ai-mod-draft.test.cjs; targeted script editor runtime export tests passed. npm run typecheck is currently blocked by unrelated untracked src/content/scenario-packs/er imports.`
