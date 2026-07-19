# Entry Shell UI Module Extraction Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.entry-shell-ui-module-extraction`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `return-to-promotion-review`
- resume_gate: `promotion-review`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `queue-closeout-complete`
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
  - `queue.entry-shell-ui-module-extraction`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.entry-shell-ui-module-extraction`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `version-memo`
  - `previous version plan`
  - `candidate_queue_ids`
  - `Candidate Recovery Ledger`
  - `Queue Promotion Ledger`
  - `named queue docs`

## Human Context

### Activation Record

- Scope approval:
  - `The operator approved extracting the main/entry UI as a separate module and later asked to promote a new candidate queue by Blueprint rules.`
- Inherits from:
  - `target.city-building-module-entry-and-project-startup-authoring`
- Inheritance boundary:
  - `The predecessor version remains open with no active queue. This successor owns only startup/pre-game entry shell UI extraction.`
- Admission basis:
  - `MEMO-011 is broader than the city/building startup/background version and was explicitly noted as a candidate to promote after the current active queue closes.`
- Activation conclusion:
  - `target.entry-shell-ui-module-extraction is the active version.`
  - `queue.entry-shell-ui-module-extraction is active after promotion/admission review from MEMO-011.`
  - `The first active task is evidence-anchor-reconcile; implementation has not started.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `Do not change game runtime startup/load semantics in this version.`
- `Do not extract in-game map, city, building, dialogue, review/council, or Script Editor workspace internals in this version.`
- `Do not change EventBindingRuntime semantics in this version.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
4. `If the new item cannot be absorbed, record it as a candidate or route it to a successor version; do not activate a second queue.`
5. `Return to version-level review only after the current active queue closes.`

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

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.entry-shell-ui-module-extraction` | `future-target-candidate` | `queue.entry-shell-ui-module-extraction` | `admitted` | `evidence-anchor reconcile proves the queue must split before implementation` | `ACC-ENTRY-SHELL-001..005` | `src/ui/main-ui/main-ui-flow.js; src/ui/**; tests/**; browser simulated-human flow` | `startup/pre-game Entry Shell render extraction and behavior preservation` | `runtime startup semantics changes; in-game map/city/building/review extraction; Script Editor workspace extraction` | `Admitted on 2026-07-19 from MEMO-011 after the city/building background queue closed.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.entry-shell-ui-module-extraction` | `done` | `none` | `Admitted on 2026-07-19 from MEMO-011 and closed after bounded startup/pre-game entry shell render extraction, automated verification, and browser simulated-human evidence.` |

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.entry-shell-ui-module-extraction` | `MEMO-011 on 2026-07-19; operator approval to make the main UI a separate module` | `ACC-ENTRY-SHELL-001..005` | `src/ui/main-ui/main-ui-flow.js; src/ui/**; tests/**; browser simulated-human flow` | `pre-game entry markup embedded directly in MainUiFlow` | `MainUiFlow state/handler ownership; startup/load semantics; JSON import diagnostics; Script Editor workspace internals` | `Split if JSON start, Script Editor entry, or character-selection entry proves too broad for one queue after evidence review.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- |
| `ACC-ENTRY-SHELL-001` | `queue.entry-shell-ui-module-extraction` | `focused robustness source guard; src/ui/entry-shell/entry-shell-view.js` | `covered` | `none` |
| `ACC-ENTRY-SHELL-002` | `queue.entry-shell-ui-module-extraction` | `focused robustness source guard; src/ui/main-ui/main-ui-flow.js delegation calls` | `covered` | `none` |
| `ACC-ENTRY-SHELL-003` | `queue.entry-shell-ui-module-extraction` | `npm test startup and entry-shell regression coverage` | `covered` | `none` |
| `ACC-ENTRY-SHELL-004` | `queue.entry-shell-ui-module-extraction` | `npm run typecheck; npm test` | `covered` | `none` |
| `ACC-ENTRY-SHELL-005` | `queue.entry-shell-ui-module-extraction` | `tools/check-ui-encoding-integrity.mjs entry-shell surface guard` | `covered` | `none` |

### Progress Log

- `2026-07-19`: `Promotion/admission review created target.entry-shell-ui-module-extraction as a successor version and admitted queue.entry-shell-ui-module-extraction from MEMO-011 after queue.script-editor-city-building-background-authoring closed. The first active task is evidence-anchor-reconcile; implementation has not started.`
- `2026-07-19`: `Completed task.entry-shell-ui-module-extraction.evidence-anchor-reconcile. Source review confirmed MainUiFlow directly renders the main menu, JSON start selection, Script Editor landing/entry, scenario pack cards, and character-selection surfaces. MainUiFlow also owns screen state, layout sync, file picker integration, persistence/startup callbacks, and action dispatch; implementation must preserve those orchestration responsibilities and extract only bounded startup/pre-game render markup behind an Entry Shell contract. Active task is now implementation.`
- `2026-07-19`: `Completed task.entry-shell-ui-module-extraction.implementation. RED focused test failed before the Entry Shell module existed. GREEN added src/ui/entry-shell/entry-shell-view.js and delegated main menu, JSON scenario select, Script Editor landing/entry, scenario pack cards, and character selection rendering from MainUiFlow while preserving MainUiFlow state, handlers, persistence, file picker, and startup callback ownership. Verification passed: focused robustness test, npm run typecheck, npm run lint:blueprints, npm test. Active task is now queue-closeout-and-handoff.`
- `2026-07-19`: `Completed task.entry-shell-ui-module-extraction.queue-closeout-and-handoff. Guard review confirmed bounded startup/pre-game Entry Shell render ownership moved to src/ui/entry-shell/entry-shell-view.js, MainUiFlow remains the state/handler/persistence/file-picker/startup-callback owner, runtime startup/load semantics were not changed, and EventBindingRuntime semantics were not changed. Browser simulated-human evidence verified the main menu, JSON 开局 scenario selection, Script Editor landing entry, and 开始游戏 -> character selection entry surfaces on localhost:5173. Verification passed: npm run lint:blueprints. The version remains open and returns to promotion review; no version closeout was entered.`
- `2026-07-19`: `Repository sync recorded after commit 180ba5ea was pushed to origin/mod-first-dev. No active queue remains; the version remains open at promotion review and version closeout still requires explicit operator request.`
