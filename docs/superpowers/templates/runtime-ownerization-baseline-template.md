# Runtime Ownerization Baseline Template

> **Purpose:** Use this template when a follow-up child must not start implementation until the repository's current architecture, runtime boundaries, core contracts, bridge/adapter status, and target flow have been re-audited and written down as a stable execution baseline.

**Date:** `YYYY-MM-DD`

**Baseline Title:** `Replace with the concrete baseline name`

**Unlocks:** `docs/superpowers/plans/YYYY-MM-DD-child-plan.md`

**Related Weekly Plan:** `docs/superpowers/plans/YYYY-MM-DD-weekly-orchestration-plan.md`

**Related Parent Plan Or Spec:** `path/to/parent-plan-or-spec.md`

## 1. Goal

State why this baseline exists.

This section must answer:

- what blocked safe implementation without a fresh review
- which later child this document is intended to unlock
- why the later child must not decide its scope ad hoc during production code work

## 2. Baseline Scope

### In Scope

- Replace with the runtime, module, or contract families reviewed here.

### Out Of Scope

- Replace with the systems that are explicitly deferred.

### Unlock Rule

The target child must remain `candidate` / `not-started` until this baseline is complete and explicitly referenced by that child's spec and plan.

## 3. Current State Summary

Summarize the repository's current architecture state in concise prose.

This section should describe at minimum:

- current weekly queue state
- current `src/main.ts` coupling level
- current runtime maturity level
- which completed children established the present boundary
- whether the current problem is missing runtime ownership, missing contracts, bridge debt, or a mix

## 4. Current Runtime Inventory

| Runtime / Boundary | Current Status | Current Owner | Entry Path | Primary Dependencies | Notes |
| --- | --- | --- | --- | --- | --- |
| `Runtime or module name` | `owner` / `bridge` / `adapter-backed` / `provisional` | `module path` | `entry seam` | `dependency list` | `important limitations` |

Required rows should include any runtime or boundary that materially affects the target child, for example:

- shared dispatch / router
- navigation runtime
- time runtime
- event runtime
- scene runtime
- interaction runtime
- house runtime
- task runtime
- effect settlement runtime
- state sync runtime
- save / load runtime
- presentation bridge runtime
- mod runtime

## 5. Current Core Contract Inventory

| Contract | Current Status | Used By | Known Gaps | Freeze Decision |
| --- | --- | --- | --- | --- |
| `src/core/contracts/...` | `stable` / `minimal` / `needs-hardening` | `consumers` | `gap summary` | `freeze` / `extend before unlock` |

This section should explicitly review contracts that can change the target child's scope, for example:

- `RuntimeRequest`
- `RuntimeResult`
- `RuntimeState`
- `Interactive Runtime` contracts
- `Task Runtime` contracts
- `Effect` contracts
- `StateSync Runtime` contracts
- any target-child-specific request/result contracts

## 6. Current Bridge / Adapter Inventory

| Bridge / Adapter | Purpose Today | Backing Legacy Owner | Remove In Target Child | Keep Through Target Child | Reason |
| --- | --- | --- | --- | --- | --- |
| `path/to/adapter.ts` | `why it exists` | `legacy owner` | `yes/no` | `yes/no` | `decision rationale` |

Rules:

- every listed bridge/adapter must get an explicit keep/remove decision
- if a bridge/adapter remains after the target child, say why
- if removal is deferred, identify the later child or boundary that must absorb it

## 7. Current `main.ts` Coupling Audit

| Coupling Area | Current Path | Should Move Into Target Child | May Remain In Shell | Reason |
| --- | --- | --- | --- | --- |
| `runtime entry` | `summary` | `yes/no` | `yes/no` | `rationale` |

This section must identify:

- which runtime entry paths still bypass shared dispatch
- which browser-only concerns should remain in shell ownership
- which `main.ts` branches are illegal to carry forward into the target child

## 8. Target State Summary

Describe the post-target-child architecture in concise prose.

This section must answer:

- what becomes a formal runtime owner
- what stops being a bridge
- what remains intentionally deferred
- what the acceptable post-child legacy residue is

## 9. Target Flow

Write the intended target flow for the child this baseline unlocks.

Recommended structure:

```text
input/request
  -> shared dispatch/router
  -> target sub-runtime owner
  -> effect settlement
  -> state sync
  -> presenter output
  -> UI render
```

Add one or more concrete examples if needed.

## 10. Runtime Boundary Decisions

Use this section to record the must-follow boundary decisions for the target child.

For each relevant runtime, answer:

- what it owns
- what it must not own
- what it may call downstream
- what may call into it

Recommended format:

### `Runtime Name`

- Owns:
  - `...`
- Must not own:
  - `...`
- Allowed downstream dependencies:
  - `...`
- Required entry seam:
  - `...`

## 11. Contract Freeze Surface

List the interfaces that are considered frozen for the target child unless this baseline is revised first.

| Contract | Freeze Level | Allowed Changes During Target Child | Not Allowed Without Baseline Revision |
| --- | --- | --- | --- |
| `contract name` | `hard` / `soft` | `allowed edits` | `forbidden edits` |

Use this section to stop scope drift.

## 12. Target Child Batch Plan

This is not the executable child plan, but it must define the intended implementation sequence that the executable child plan will follow.

| Batch | Goal | Runtime / Module Focus | Expected Output | Verification Focus |
| --- | --- | --- | --- | --- |
| `1` | `...` | `...` | `...` | `...` |

Rules:

- batch order must be explicit
- a later child plan may refine tasks, but must not violate this ordering without updating the baseline first

## 13. Target Child Acceptance Requirements

List the concrete conditions that must be true before the target child can be marked `completed`.

Recommended examples:

- target runtime no longer routes through the deprecated adapter
- `main.ts` no longer directly orchestrates named runtime entry paths
- core contracts remain within the approved freeze surface
- settlement, sync, and presenter handoff follow the target flow
- required bridges/adapters are removed or intentionally retained per this baseline

## 14. Unlock Criteria

The target child is unlocked only when all of the following are true:

- [ ] current runtime inventory is reviewed and recorded
- [ ] current core contract inventory is reviewed and recorded
- [ ] bridge/adapter keep-remove decisions are explicit
- [ ] `main.ts` coupling audit is explicit
- [ ] target state summary is explicit
- [ ] target flow is explicit
- [ ] target child batch order is explicit
- [ ] target child acceptance requirements are explicit
- [ ] related weekly artifacts are updated
- [ ] `npm run lint:plans` passes if plan-governance files changed

## 15. Required Weekly Artifact Sync

List the weekly artifacts that must be updated together with this baseline.

- `docs/superpowers/weekly/YYYY-MM-DD-weekly-review-index.md`
- `docs/superpowers/weekly/YYYY-MM-DD-weekly-module-map.md`
- `docs/superpowers/weekly/YYYY-MM-DD-weekly-call-flows.md`
- `docs/superpowers/weekly/YYYY-MM-DD-weekly-next-split-review.md`
- `docs/superpowers/weekly/YYYY-MM-DD-weekly-architecture-report.md`

If a repo uses a different artifact set, replace the list explicitly.

## 16. Verification Record

Record the commands or justification used for this baseline.

### For Doc-Only Baselines

- `Not run as part of this doc-only change`

### When Code/Plan Files Also Change

- `npm run lint:plans`
- add any targeted validation needed for the updated governance or supporting docs

## 17. Completion Checklist

- [ ] Current state summary written
- [ ] Runtime inventory table completed
- [ ] Core contract inventory table completed
- [ ] Bridge/adapter inventory table completed
- [ ] `main.ts` coupling audit completed
- [ ] Target state summary written
- [ ] Target flow recorded
- [ ] Runtime boundary decisions recorded
- [ ] Contract freeze surface recorded
- [ ] Target child batch order recorded
- [ ] Target child acceptance requirements recorded
- [ ] Unlock checklist completed
- [ ] Weekly artifacts updated
- [ ] Verification recorded
