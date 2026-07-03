# Main Runtime Ownerization Weekly Architecture Report

**Week Of:** `2026-07-03`

## Purpose

This report captures the architecture snapshot for the fresh main-runtime ownerization set.

## Architecture Summary

- The `2026-07-03-main-startup` set is closed after Child 23 and remains historical truth only.
- The fresh `2026-07-03-main-runtime-ownerization` set is now closed after one new problem type: removing covered runtime-business orchestration ownership from `src/main.ts`.
- Child 24 stayed narrow: it extracted covered startup session apply, story / event / scene follow-up, and passive render-time trigger logic, and did not absorb presenter/render redesign, `MainUiFlow` redesign, or contract-family expansion.

## Current Queue State

- Weekly queue status: `closed`
- Active executable child: `none currently`
- Immediate queued follow-up: `none currently`
- Locked follow-up child: `none currently`
- Planning rule: `Any later main.ts continuation now requires a fresh review that proves a different problem type remains.`

## Runtime / Content Maturity Snapshot

| Runtime / Boundary | Current Maturity | Current Production Role | Remaining Debt | Candidate Follow-Up |
| --- | --- | --- | --- | --- |
| `Startup-Family Request Selection` | `covered-ownerized` | startup coordinator owns builtin/imported/restored startup-family request routing | do not reopen in this set | `none inside this set` |
| `Main Runtime Orchestration` | `covered-ownerized` | `src/application/runtime/main-runtime-orchestrator.ts` now owns covered startup apply, story timing, scene progression, and passive trigger orchestration | later main.ts work must prove a different problem type | `fresh review only later` |
| `State Write-Back Sink` | `official` | `state-sync-runtime.ts` already bridges runtime/app state | keep one sink while ownerization proceeds | `inside Child 24 only if narrowed` |
| `Render Orchestration` | `legacy` | `main.ts` still owns final render scheduling and presenter/render path | explicitly outside Child 24 except for removing passive gameplay mutation from pre-pass | `fresh review only later` |
| `Task / House / Registry Contracts` | `partial` | first-slice runtime contracts exist | still outside this weekly boundary | `fresh review only later` |

## Temporary Adapters Or Weak Seams

- `src/main.ts` still owns shell wiring and final render scheduling, but no longer owns the covered startup apply / story timing / scene progression / passive trigger seams that Child 24 targeted
- `src/content/pack-content-access.ts` remains a builtin-default adapter, but that is not the active problem in this set

## Fixed Boundary Answers Required By This Set

At Child 24 close, the weekly artifact bundle can answer:

1. requests enter from shell-owned `MainUiFlow`, DOM, and timer callbacks
2. `src/application/runtime/main-runtime-orchestrator.ts` is the covered runtime-business decision owner for the Child 24 boundary
3. covered startup apply, story timing, scene progression, and passive trigger sync are now owned by `main-runtime-orchestrator`
4. covered runtime request write-back still settles through the existing `state-sync-runtime.ts` commit path; Child 24 did not fork a second covered runtime commit sink

This is enough to close the set. Any later ownerization claim must prove a different residual boundary.

## Architecture Risks

- Child 24 is closed; the main remaining risk is that later work might silently reopen this same boundary under a different name instead of starting from a fresh review.
- Presenter/render redesign, task/house contract expansion, and registry work remain distinct later problem types and must stay outside this closed set.

## Candidate Post-Queue Splits

- `None inside this set yet`

Any later split must be justified after Child 24 closes.
