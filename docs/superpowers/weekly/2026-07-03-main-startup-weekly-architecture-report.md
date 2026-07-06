# Main Startup Weekly Architecture Report

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


**Week Of:** `2026-07-03`

## Purpose

This report captures the architecture snapshot for the fresh startup-family extraction set.

## Architecture Summary

- The `2026-07-02` mod-first set is closed after Child 22 and remains historical truth only.
- A fresh `2026-07-03` set is now opened for one new problem type: startup-family orchestration extraction from `src/main.ts`.
- The active child is intentionally narrow: it may extract `startup / continue / restore / scenario import`, but it may not absorb render orchestration, runtime follow-up ownership, or `MainUiFlow` redesign.

## Current Queue State

- Weekly queue status: `open`
- Active executable child: `Child 23 Main Startup Orchestration Extraction`
- Immediate queued follow-up: `none currently`
- Locked follow-up child: `none currently`
- Planning rule: `No later child may be queued until Child 23 closes and a fresh review proves a different problem type remains.`

## Runtime / Content Maturity Snapshot

| Runtime / Boundary | Current Maturity | Current Production Role | Remaining Debt | Candidate Follow-Up |
| --- | --- | --- | --- | --- |
| `Mod-First Closure` | `covered-ownerized` | startup/save/restore parity is already closed after Child 22 | do not reopen this same boundary in this set | `none inside this set` |
| `Startup-Family Orchestration` | `in-progress` | `src/main.ts` still owns builtin/imported/restored entry routing | extract to one coordinator seam | `Child 23 active` |
| `Render Orchestration` | `legacy` | `main.ts` still owns final render path | explicitly outside Child 23 | `fresh review only later` |
| `MainUiFlow Contract` | `official` | supplies current start/continue/import shell actions | redesign pressure must remain outside this set | `fresh review only later` |

## Temporary Adapters Or Weak Seams

- `src/main.ts` still directly owns the startup-family decision tree
- no dedicated startup coordinator seam exists yet
- `src/content/pack-content-access.ts` remains a builtin-default adapter, but that is not the active problem in this set

## Architecture Risks

- If Child 23 drifts into render ownership, the set loses its single-problem boundary.
- If Child 23 changes `MainUiFlow` contracts, the set stops being a startup-family extraction and becomes a broader UI-shell redesign.
- If Child 23 reopens save/source persistence, it will regress the closed Child 22 boundary.

## Candidate Post-Queue Splits

- `None inside this set yet`

Any later split must be justified after Child 23 closes.

