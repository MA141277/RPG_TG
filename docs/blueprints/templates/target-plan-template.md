# Version Plan Title

## Control Block

- document_role: `version-governor`
- version_id: `target.replace-me`
- version_status: `open | done | archived`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- decision_state: `active-execution | promotion-review | idle-open | blocked`
- next_decision: `queue-admission-review | queue-closeout-or-return-to-version-review | same-version-admission-or-version-closeout | version-closeout | resolve-blocker`
- next_action: `classify-fresh-work | write-admission-review | activate-admitted-queue | resume-active-queue | auto-reconcile-active-task | write-queue-closeout | return-to-promotion-review | write-version-closeout | resolve-blocker`
- resume_gate: `open-active-queue | promotion-review | idle-open | blocked`
- promotion_review_result: `admit | reject | defer | block | none`
- review_subject_id: `item.replace-me | none`
- review_subject_classification: `queue-candidate | current-target-item | uncertain-needs-review | future-target-candidate | none`
- proposed_queue_id: `queue.replace-me | none`
- review_basis: `replace-with-written-evidence | none`
- admission_status: `none | pending | admitted | rejected | deferred | blocked`
- intake_status: `none | evaluating | absorbed | candidate-recorded | admission-review`
- intake_item_id: `item.replace-me | none`
- intake_summary: `replace-with-one-line-intake-summary | none`
- intake_result: `none | absorbed-into-active-queue | queued-as-candidate | promoted-to-admission | rejected | deferred`
- intake_feedback_mode: `none | fixed-receipt`
- closure_review_subject: `queue.replace-me | none`
- closure_review_status: `none | evaluating | routed | blocked`
- residue_candidate_id: `item.replace-me | none`
- residue_candidate_family: `same-family | cross-family | accepted-residue | none`
- routing_basis: `replace-with-written-routing-evidence | none`
- next_lawful_queue_recommendation: `queue.replace-me | none`
- auto_admission_ready: `true | false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.replace-me`

## Human Context

### Admission Review Record

- Intake handling:
  - `The operator-facing intake surface is limited to 新需求 + 参考治理规范. Blueprint must internalize classification and routing work before asking the operator to manage queue mechanics.`
  - `Reset intake fields to none once intake handling is durably recorded, unless intake is still actively in progress.`
  - `Do not require the operator to provide item.xxx, classification, proposed queue id, review basis, or admission fields.`

- Scope approval:
  - `Record user scope approval here when it exists, but do not treat it as admission.`
- Admission basis:
  - `Record the evidence that justifies admit / reject / defer / block.`
- Required truth sync:
  - `Version plan admission fields must be written before implementation starts.`
  - `The admitted queue doc must exist before code implementation starts.`

### Version Lifecycle Rules

- `A current open version stays open until version closeout is explicitly confirmed and written into this version plan.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `As long as version_status = open, additional same-version queues may still be admitted.`
- `If no open version exists, version creation becomes the required next governance action before any queue admission or implementation can begin.`
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`
- `When version acceptance and closeout conditions are satisfied, ask exactly one human confirmation before changing version_status to done.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If one exists, decide whether the new item can be absorbed without widening queue scope.`
4. `Classify the item before any queue creation or implementation.`
5. `If the item is queue-candidate, write review_subject_id / review_subject_classification / proposed_queue_id / review_basis / admission_status first.`
6. `Only after version-plan admission sync may a queue doc be created and activated.`
7. `Only after the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`
8. `User scope approval is boundary approval only; it does not replace admission.`
9. `When intake does not proceed directly into implementation, return the fixed operator receipt rather than a long Blueprint internal analysis dump.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.replace-me` | `queue-candidate` | `queue.replace-me` | `deferred` | `only if new evidence invalidates the old basis or changes queue absorption` | `Use this ledger to resume admission from existing evidence rather than restarting from scratch.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.replace-me` | `candidate` | `Replace with promotion trigger.` | `Replace with the current note.` |

### Closure Routing Record

- `Queue closeout residue must be absorbed here after queue-level closeout judgement completes.`
- `This version plan owns same-family continuation routing truth; it must not create a second resume chain.`
- `If queue closeout proves one unique same-family continuation, write that continuation here instead of returning to open-ended human queue selection.`
- `If residue is cross-family or not uniquely routable, return to broader version review instead of pretending same-family continuation is already settled.`
- `Do not duplicate queue-level implementation evidence here; record routing truth only.`

Allowed `next_decision` values:

- `queue-admission-review`
- `queue-closeout-or-return-to-version-review`
- `same-version-admission-or-version-closeout`
- `version-closeout`
- `resolve-blocker`

Allowed `next_action` values:

- `classify-fresh-work`
- `write-admission-review`
- `activate-admitted-queue`
- `resume-active-queue`
- `auto-reconcile-active-task`
- `write-queue-closeout`
- `return-to-promotion-review`
- `write-version-closeout`
- `resolve-blocker`

### Candidate Recovery Rule

- `If a queue-candidate is already recorded in the version plan or candidate recovery ledger, resume from that record by default.`
- `Only restart a full re-audit when new material evidence invalidates the prior classification or review basis.`
- `Do not use prose-only memory as the recovery source when structured admission truth already exists.`

### Evidence Search Priority

- `For execution truth, routing, admission, closeout, task status, and next action, read project-progress -> blueprint -> version plan -> active queue -> active task first.`
- `For implementation truth, existing mechanisms, interfaces, call flows, data shapes, and actual runtime behavior, search src/ and tests/ first.`
- `For historical explanation, use compact active governance records first; open closed queues, old plans, docs/superpowers/**, or docs/change-log.md only when explicitly cited or when code evidence is insufficient.`
- `Do not use docs/change-log.md as the default search target for Blueprint routing, admission, closeout, scheduling, or implementation truth.`

### Closure Judgement And Residue Routing Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `Queue docs own execution_closeout_status / topic_closure_status / closure_basis / residue_remaining / residue_family / residue_routing_status / next_family_candidate / auto_continue_eligible.`
- `This version plan owns closure_review_subject / closure_review_status / residue_candidate_id / residue_candidate_family / routing_basis / next_lawful_queue_recommendation / auto_admission_ready.`
- `If same-family residue is uniquely routable, write the continuation here and avoid asking the operator which queue should come next.`
- `If multiple lawful residue continuations remain genuinely unresolved, route to human choice only then.`

### Single-Active-Queue Rule

- `When execution_mode=single-active-task and allow_parallel=false, an active queue blocks live admission review for a second queue.`
- `If a fresh item cannot be absorbed by the current active queue, record it as a candidate for later rather than activating a second queue.`
- `Return to version-level review only after the current active queue closes.`
- `If an active queue exists and intake or questioning depends on that queue state, expose a queue snapshot before asking the operator to choose.`

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

### Post-Task Auto-Reconcile

1. `Run verify_with.`
2. `Check done_when.`
3. `Write the task after-state, queue truth, and any required version truth before any repository sync begins.`
4. `Re-evaluate queue closeout.`
5. `Scan governance owners.`
6. `Scan residue.`
7. `If queue closeout leaves residue, absorb same-family or cross-family routing truth here before repository sync begins.`
8. `Record local repository sync state after the docs are updated.`
9. `Defer commit, push, and baseline merge until the bounded task or tightly related task group reaches closeout, unless remote collaboration or an explicit queue/version contract requires earlier sync.`
10. `If the next legal step is unique, continue directly into closeout, same-family routing, or version review once the local-record step or any attempted repository sync returns a result.`
11. `Update docs/change-log.md only when code, runtime, compatibility, shared interface, or user-visible behavior changed.`

### Human Confirmation Constraint

- `At most one human-confirmation question may be asked per task.`
- `If docs/code can decide, do not ask.`
- `If only one legal branch exists, do not ask.`
- `Scope approval does not replace admission.`
- `Do not ask whether to perform closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Do not ask which queue should come next when same-family residue routing is already uniquely supported by current closeout truth.`
- `Do not raise decision_required merely because repository sync failed.`
- `Do not ask about a merge conflict when current version truth already uniquely decides the legal resolution.`
- `Ask only when the baseline is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current version truth cannot decide alone.`
- `Exception: version closeout requires explicit human confirmation before version_status changes from open to done.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, version truth, candidate truth, or transition truth.`
- `push / merge must not become a queue closeout gate.`
- `push / merge must not become a version closeout gate.`
- `Task execution conclusions are written first; repository sync state is recorded second.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `remote-sync runs only when requested, when collaboration requires remote visibility, or when a queue/version closeout contract explicitly requires it.`
- `Avoid process-only commits for minor field synchronization unless that synchronization is the bounded task itself.`
- `A failed sync attempt is recorded only as repository sync result in the queue-local sync record.`
- `Remote sync failure must not block task closeout, queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation.`
- `A merge conflict is a repository sync event; it must not rewrite the already-recorded task, queue, or version conclusion.`
- `If current version truth uniquely decides the merge conflict direction, resolve it without asking.`
- `Version scheduling must not read sync_status, sync_scope, or sync_summary as live truth.`

### Repository Sync Levels

1. `local-record: write local docs/code and queue-local sync state without creating a commit.`
2. `branch-commit: draft the commit message as <type>: <brief title> plus a Summary: block with real bullets, run commit-message validation, and create one semantic commit for the completed bounded task or task group.`
3. `remote-sync: push the working branch and, only when explicitly required, merge/push the baseline.`
4. `Resume from the written Blueprint truth after local-record or any attempted sync returns success or failure; failed remote-sync is not a closeout or admission blocker.`

### Prior Promotion Record

- `Keep this section short in active plans. Summarize long promotion chains here and leave full evidence in closed queue docs or commit history.`
