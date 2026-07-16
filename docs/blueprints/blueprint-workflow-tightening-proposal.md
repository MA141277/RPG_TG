# Blueprint Workflow Tightening Proposal

## Purpose

This proposal defines workflow-level safeguards for a recurring Blueprint failure mode:

> A queue completes a valid narrow slice, but the active version later treats that slice as if it satisfied a broader requirement.

The goal is not to fix one specific version. The goal is to improve the Blueprint workflow so future versions do not silently drift from version-level requirements to queue-local partial completion.

## Problem Class

This workflow issue appears when all of the following are true:

1. A version requirement is broad or multi-part.
2. A queue is admitted to implement a prerequisite or baseline slice of that requirement.
3. The queue closes correctly according to its own local `done_when`.
4. The remaining parts of the version requirement are only mentioned in prose, or are not registered at all.
5. Auto-routing or version closeout later proceeds as if the broader requirement is covered.

This is a governance failure, not just an implementation failure. The implementation can be correct for the queue while still incomplete for the version.

## Common Symptoms

### Over-Broad Queue Names

Queue names such as `convergence`, `completion`, `replacement`, `retirement`, or `final` imply broad closure. If the actual work only delivers a baseline, adapter, visibility panel, or guard, later review can mistake the queue for full coverage.

### Queue-Local Done Replaces Version-Level Done

The queue proves its local task, but closeout does not recheck the version acceptance criteria item by item.

### Prose-Only Residue

Follow-up work is written in notes, progress logs, or explanatory prose, but is not formalized in:

- version candidate queue list
- Candidate Recovery Ledger
- Queue Promotion Ledger
- acceptance matrix
- closeout blocker list

### Fail Closed Treated As Completion

Fail-closed behavior is a safety boundary. It is not feature completion unless the unsupported capability is explicitly outside the version scope.

### Visibility Mistaken For Editability

UI queues may add display or navigation, while the version requirement expects creator-facing editing, validation, import, export, or round-trip behavior.

### Adapter Baseline Mistaken For Entrypoint Coverage

Runtime queues may route one or two entrypoints through the new mechanism, while the version requirement expects every covered entrypoint family or an explicit fail-closed disposition.

## Root Cause

Blueprint currently has strong queue-local governance, but weaker cross-checking between:

- version acceptance criteria
- queue claim boundaries
- implementation evidence
- residue routing
- auto-continue decisions
- version closeout

The missing control is an explicit, machine-checkable or at least table-driven record of which queue owns each version acceptance item and whether that item is fully covered, partially covered, blocked, deferred, or unowned.

## Proposed Workflow Changes

### 1. Add A Version Acceptance Matrix

Every active version plan should include a `Version Acceptance Matrix`.

```markdown
### Version Acceptance Matrix

| Acceptance ID | Requirement | Owner Queue | Coverage Status | Verification | Residue Queue | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `ACC-...` | ... | `queue...` | `unowned / planned / active / covered / partial / blocked / deferred` | test/source/doc | `queue... / none` | ... |
```

Field rules:

- `Acceptance ID`: stable id for one atomic version requirement.
- `Requirement`: one testable behavior or governance outcome.
- `Owner Queue`: queue responsible for full or partial coverage.
- `Coverage Status`:
  - `unowned`: no owner queue exists.
  - `planned`: candidate exists, not active.
  - `active`: active queue is working on it.
  - `covered`: implemented and verified.
  - `partial`: some coverage exists, but version closeout cannot claim completion.
  - `blocked`: blocked by a concrete dependency.
  - `deferred`: explicitly deferred with a reason.
- `Verification`: command, test, source check, or document evidence.
- `Residue Queue`: required when status is `partial` or `blocked`.

Hard rules:

- Version closeout is forbidden while any row is `unowned`, `partial`, or `blocked`.
- `partial` must name a residue queue or be explicitly reclassified as non-goal.
- `covered` must cite verification evidence.

### 2. Require Queue Version Coverage Claims

Each queue document should include a `Version Coverage Claim` section.

```markdown
### Version Coverage Claim

| Version Acceptance Item | Queue Claim | Coverage | Evidence | Residue |
| --- | --- | --- | --- | --- |
| `ACC-...` | `can claim / cannot claim` | `full / partial / none` | test/source/doc | `queue... / none` |
```

Rules:

- `full` means the queue can move the version matrix item to `covered`.
- `partial` means the queue must name a residue queue.
- `none` means the queue intentionally does not claim the acceptance item.
- Queue closeout must update the version matrix accordingly.

### 3. Require Closeout Acceptance Recheck

Every queue closeout must include:

```markdown
### Closeout Acceptance Recheck

- Covered in this queue:
  - `ACC-...`
- Still partial:
  - `ACC-...` -> `queue...`
- Still unowned:
  - `ACC-...`
- Newly discovered residue:
  - `queue...`
- Next lawful queue:
  - `queue... / none`
```

Rules:

- Newly discovered residue cannot stay only in prose.
- Any `Still partial` or `Still unowned` item must update the version matrix.
- Auto-continue is allowed only after residue is formally recorded.

### 4. Add A No Silent Partial Rule

If queue closeout includes any of these words, the queue must explicitly classify related version coverage:

- `baseline`
- `visibility`
- `minimal`
- `bounded`
- `adapter`
- `guard`
- `compatibility`
- `fail closed`
- `preserve`
- `residue`
- `later`
- `deferred`

Required answer:

```text
Is this full coverage of the version requirement?
- yes: cite verification
- no: mark partial and name residue queue
```

### 5. Distinguish Fail Closed From Feature Complete

Add this rule:

```text
Fail closed is a safety boundary, not feature completion.
```

If a queue closes with fail-closed behavior, it must also record one of:

- follow-up queue that implements the unsupported capability
- explicit non-goal decision
- explicit deferred decision with closeout impact

### 6. Constrain Broad Queue Names

Queues using broad terms must declare which acceptance items they fully cover:

- `convergence`
- `completion`
- `replacement`
- `retirement`
- `final`

If the queue is only a slice, use a slice name instead:

- `selector-baseline`
- `visibility-baseline`
- `adapter-cutover`
- `guard-and-delete`
- `export-lowering`
- `editor-controls`

### 7. Add Code Reality Review To Promotion Review

Promotion review must include source and test evidence, not only Blueprint prose.

```markdown
### Code Reality Review

| Claim | Source Evidence | Test Evidence | Gap |
| --- | --- | --- | --- |
| ... | `src/...` | `tests/...` | ... |
```

Minimum checks:

- Does source code implement the claim?
- Does the test verify behavior rather than only checking source strings?
- Is import/export round trip covered?
- Is UI editable or only visible?
- Are all required runtime entrypoints handled or explicitly failed closed?
- Is fail-closed behavior routed to a follow-up queue if still in scope?
- Are old paths truly deleted or only bypassed?

### 8. Add Auto-Continue Downgrade Conditions

Auto-continue must stop at promotion review when:

- new residue is discovered
- any acceptance item is `partial`, `blocked`, or `unowned`
- residue is prose-only
- broad queue name does not match actual coverage
- fail-closed behavior lacks follow-up or non-goal disposition
- code reality review finds a mismatch

### 9. Strengthen Version Closeout Gate

Version closeout requires:

```markdown
### Version Closeout Gate

- active_queue = `none`
- active_task = `none`
- all required queues = `done`
- all acceptance matrix rows = `covered` or approved `deferred`
- no `partial`, `blocked`, or `unowned` acceptance rows
- no prose-only residue
- all closeout blockers appear in candidate ledgers or are explicitly non-goal
- required old paths are removed or guarded
- full verification is recorded
```

Version closeout must be explicit. It must not be inferred from the final queue closing.

## Template Changes

### Version Plan Template

Add:

```markdown
### Version Acceptance Matrix

| Acceptance ID | Requirement | Owner Queue | Coverage Status | Verification | Residue Queue | Notes |
| --- | --- | --- | --- | --- | --- | --- |
```

### Queue Template

Add:

```markdown
### Version Coverage Claim

| Version Acceptance Item | Queue Claim | Coverage | Evidence | Residue |
| --- | --- | --- | --- | --- |

### Closeout Acceptance Recheck

- Covered in this queue:
- Still partial:
- Still unowned:
- Newly discovered residue:
- Next lawful queue:
```

## Lint Recommendations

### Short-Term Lint

Check required sections exist:

- version plan contains `### Version Acceptance Matrix`
- queue doc contains `### Version Coverage Claim`
- done queue contains `### Closeout Acceptance Recheck`

### Medium-Term Lint

Validate:

- `partial` rows must name a residue queue
- `blocked` rows must name a blocker
- `unowned` rows block version closeout
- version closeout is illegal if any matrix row is `partial`, `blocked`, or `unowned`
- broad queue names require explicit acceptance coverage rows

### Long-Term Lint

Search for risk terms in closeout prose:

- `baseline`
- `visibility`
- `fail closed`
- `residue`
- `later`
- `advanced`

If present, require matching matrix or ledger entries.

## Rollout Plan

1. Update the Blueprint workflow spec with the rules above.
2. Update version and queue templates.
3. Add short-term lint for required sections.
4. Select one active or recent version and backfill a version acceptance matrix.
5. Convert all prose-only residue in that version into formal candidates, blockers, deferred items, or non-goals.
6. Require all future queue closeouts to update the matrix before auto-continue.

## Reference Case: Event Binding Version

The event-binding version exposed this workflow issue, but the proposed rules apply to all Blueprint-governed work.

Examples from that version:

- A UI queue completed visibility and storage but not full editing.
- A runtime queue completed a selector and one adapter family but not all required entrypoint families.
- Condition support existed in some runtime paths but not as a complete editor/export/resolver workflow.
- Fail-closed export behavior was safe but still needed formal follow-up routing.

The corrective action should not be limited to event binding. The workflow should require every version to track broad requirements through an acceptance matrix and formal residue routing.
