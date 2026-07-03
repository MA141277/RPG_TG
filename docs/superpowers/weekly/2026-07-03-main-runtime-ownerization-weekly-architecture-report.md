# Main Runtime Ownerization Weekly Architecture Report

**Week Of:** `2026-07-03`

## Purpose

This report captures the architecture snapshot for the fresh main-runtime ownerization set.

## Architecture Summary

- The `2026-07-03-main-startup` set is closed after Child 23 and remains historical truth only.
- A fresh `2026-07-03-main-runtime-ownerization` set is now opened for one new problem type: removing covered runtime-business orchestration ownership from `src/main.ts`.
- The active child is intentionally narrow: it may extract covered startup session apply, story / event / scene follow-up, and passive render-time trigger logic, but it may not absorb presenter/render redesign, `MainUiFlow` redesign, or contract-family expansion.

## Current Queue State

- Weekly queue status: `open`
- Active executable child: `Child 24 Main Runtime Orchestration Ownerization`
- Immediate queued follow-up: `none currently`
- Locked follow-up child: `none currently`
- Planning rule: `No later child may be queued until Child 24 closes and a fresh review proves a different problem type remains.`

## Runtime / Content Maturity Snapshot

| Runtime / Boundary | Current Maturity | Current Production Role | Remaining Debt | Candidate Follow-Up |
| --- | --- | --- | --- | --- |
| `Startup-Family Request Selection` | `covered-ownerized` | startup coordinator owns builtin/imported/restored startup-family request routing | do not reopen in this set | `none inside this set` |
| `Main Runtime Orchestration` | `in-progress` | `src/main.ts` still owns covered runtime-business follow-up and some session apply orchestration | move to one explicit orchestration seam | `Child 24 active` |
| `State Write-Back Sink` | `official` | `state-sync-runtime.ts` already bridges runtime/app state | keep one sink while ownerization proceeds | `inside Child 24 only if narrowed` |
| `Render Orchestration` | `legacy` | `main.ts` still owns final render scheduling and presenter/render path | explicitly outside Child 24 except for removing passive gameplay mutation from pre-pass | `fresh review only later` |
| `Task / House / Registry Contracts` | `partial` | first-slice runtime contracts exist | still outside this weekly boundary | `fresh review only later` |

## Temporary Adapters Or Weak Seams

- `src/main.ts` still directly owns covered story / event / scene follow-up in several call chains
- `src/main.ts` still performs active content sync inside startup session apply
- `renderApp()` still performs passive gameplay mutation through `syncPassiveStoryTriggers()`
- `src/content/pack-content-access.ts` remains a builtin-default adapter, but that is not the active problem in this set

## Fixed Boundary Answers Required By This Set

At Child 24 close, the weekly artifact bundle must be able to answer:

1. where requests enter the covered business flow
2. which orchestration owner decides the covered runtime path
3. who owns covered follow-up
4. where state write-back is finalized

If any of those answers still rely on ad hoc `main.ts` helpers, the child is not complete.

## Architecture Risks

- If Child 24 drifts into presenter/render redesign, the set loses its single-problem boundary.
- If Child 24 creates multiple unrelated orchestration seams, ownerization debt will be redistributed instead of removed.
- If Child 24 reopens task, house, or registry contract work, the set will blur into later roadmap phases.

## Candidate Post-Queue Splits

- `None inside this set yet`

Any later split must be justified after Child 24 closes.
