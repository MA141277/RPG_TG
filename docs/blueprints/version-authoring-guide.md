# Blueprint Version Authoring Guide

## Purpose

This guide explains how an operator should draft a new Blueprint version before AI turns it into formal Blueprint governance documents.

The operator should not hand-write the full version spec, version plan, queue matrix, task plan, or Control Blocks. The operator provides intent and boundary. AI expands that draft into evidence-bound governance, then asks the operator to review a short summary before execution begins.

## Operator Workflow

### Step 1: Write A Version Draft

Create a short draft with these sections:

```md
# Version Draft

## Goal

One sentence describing the mechanism this version should converge.

## Required Outcomes

- 3 to 7 outcomes that must be true when this version closes.

## Explicit Non-Goals

- 3 to 7 things this version must not do.

## Must Preserve

- Compatibility paths, old behaviors, data paths, or user experiences that must not break.

## Must Replace

- Old structures, wrong mechanisms, hardcoded branches, or legacy behavior that should no longer be relied on.

## Reference Material

- Memos, bugs, PRDs, previous queues, screenshots, or optional code paths.
```

Keep the draft short. Do not try to assign every task, owner queue, test, or implementation file yourself.

### Step 2: Ask AI For An Evidence Draft

Ask AI to generate a Version Evidence Draft from the operator draft.

AI must produce:

- draft requirement coverage
- acceptance matrix
- candidate queue split
- implementation anchors
- legacy paths to replace
- compatibility paths to preserve
- queue claim boundaries
- first queue recommendation
- high-risk drift points

AI must not create an active execution queue or start implementation from the rough draft directly.

### Step 3: Review The Short Summary

The operator reviews only four things:

- whether the goal and required outcomes were preserved
- whether non-goals, must-preserve, and must-replace boundaries were understood correctly
- whether the candidate queue split matches the intended mechanism boundaries
- whether the recommended first queue is acceptable

The operator does not need to review every Control Block field, task command, test path, or markdown detail.

Allowed responses:

- `confirm`
- `adjust goal: ...`
- `adjust queues: ...`
- `adjust first queue: ...`
- equivalent plain-language instructions

### Step 4: Let AI Write Formal Documents

After the Evidence Draft is confirmed, AI writes the formal documents:

- `docs/blueprints/specs/YYYY-MM-DD-<version>-target.md`
- `docs/blueprints/plans/YYYY-MM-DD-<version>-target-plan.md`

The formal version spec must include:

- Version Draft Summary
- Evidence Draft Review
- Draft Requirement Coverage
- Queue Contract Portfolio
- Acceptance Matrix
- Final Acceptance Coverage Contract

The formal version plan must include:

- Evidence Draft Summary
- Evidence Lock Rule
- Candidate Recovery Ledger with acceptance refs and implementation anchors
- Candidate Evidence Matrix
- Acceptance Coverage Ledger

### Step 5: Require Evidence Lock Before Execution

Before a candidate queue becomes active, AI must run an Evidence Lock review.

Evidence Lock must confirm:

- which acceptance ids the queue can claim
- which related acceptance ids it cannot claim
- which code paths must be inspected
- which code paths must be modified
- which legacy paths must be replaced
- which compatibility paths must be preserved
- which verification proves the queue's claim

If a queue has already started without this evidence, AI must add an `evidence-anchor-reconcile` task before further implementation.

## Review Checklist

Use this quick checklist when approving an Evidence Draft:

```text
1. Are all required outcomes represented?
2. Are non-goals still excluded?
3. Are must-preserve items protected?
4. Are must-replace items assigned to candidate queues?
5. Does each candidate queue have a clear can-claim / cannot-claim boundary?
6. Does the first queue make sense as the first implementation step?
```

If any answer is unclear, ask AI to revise the Evidence Draft before formal documents are written.

## Adding A Candidate Queue Mid-Version

Use this flow when a new requirement appears while a version is already open.

The operator should not ask AI to implement the new requirement directly. The operator should submit it as a candidate intake item.

### Operator Input

Use this short format:

```md
# Candidate Intake

## Requirement

One or two sentences describing the new requirement.

## Why Now

Why this matters during the current version.

## Must Preserve

- Optional compatibility behavior that must not break.

## Must Not Do

- Optional scope boundaries.

## Reference Material

- Optional memo, bug, screenshot, prior queue, or code path.
```

### AI Intake Steps

AI must:

1. Read the current truth chain:
   - `project-progress`
   - `blueprint`
   - current version plan
   - active queue, if one exists
   - active task, if one exists
2. Check whether an active queue exists.
3. If an active queue exists, decide whether the intake can be absorbed without widening that queue's claim boundary.
4. If it cannot be absorbed, record it as a candidate instead of activating a second queue.
5. If no active queue exists, still route through version-plan admission review before execution.
6. Classify the item as one of:
   - current-target-item
   - queue-candidate
   - future-target-candidate
   - content-pipeline-item
   - asset-pipeline-item
   - uncertain-needs-review
   - out-of-scope
7. If it is a queue-candidate, update the version plan with candidate evidence:
   - candidate id
   - proposed queue id
   - acceptance refs
   - implementation anchors
   - legacy paths to replace
   - compatibility paths to preserve
   - can-claim acceptance refs
   - cannot-claim acceptance refs
   - reject or split conditions
8. Return the fixed operator receipt unless the operator explicitly asks for internal analysis.

### Operator Review

The operator only reviews:

- whether the new requirement belongs in the current version
- whether it should be absorbed into the active queue or remain a later candidate
- whether the proposed queue boundary is too broad or too narrow

The operator does not need to review all Control Block fields.

### Hard Rules

- Do not activate a second queue while `execution_mode = single-active-task` and `allow_parallel = false`.
- Do not treat operator scope approval as queue admission.
- Do not implement the candidate until the version plan records admission truth and the admitted queue doc exists.
- Do not let a mid-version candidate expand the current queue's `Can Claim` list unless the queue evidence is updated and the expansion remains inside the current queue boundary.
- Do not use push success or failure as a reason to admit, reject, block, or close a candidate.

### Fixed Operator Receipt

For normal candidate intake, AI should answer with:

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

### When It Can Become An Execution Queue

A mid-version candidate can become active only when:

- there is no conflicting active queue
- the version plan records admission review truth
- the queue has an Evidence Lock
- implementation anchors are confirmed
- the queue states `Can Claim` and `Cannot Claim`
- the admitted queue doc exposes `queue_status = active` and a live `active_task`

## Failure Signs

Stop and request a revised Evidence Draft if:

- a candidate queue has no implementation anchors
- final validation is the primary owner of normal implementation acceptance
- a queue title is broad but its can-claim boundary is vague
- compatibility behavior is listed in prose but not assigned to a proof
- a must-replace legacy path is not owned by any queue
- the first queue would start implementation before prerequisites are proven

## Rule Of Thumb

The operator owns intent and boundaries. AI owns evidence expansion and formal governance structure.

Do not make the operator write the full Blueprint version. Do not let AI execute from an unreviewed broad draft.
