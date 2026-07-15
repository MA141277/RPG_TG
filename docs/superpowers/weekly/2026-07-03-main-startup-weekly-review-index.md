# Main Startup Weekly Review Index

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


**Week Of:** `2026-07-03`

**Weekly Set Plan:** `docs/superpowers/plans/2026-07-03-main-startup-weekly-orchestration-plan.md`

**Active Child Plan:**

- `None currently`

**Latest Completed Child Plan:**

- `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`

**Queued Child Plans:**

- `None currently`

## Weekly Summary

- The earlier `2026-07-02` mod-first set is closed historical truth only.
- The `2026-07-03` weekly set stayed narrow and closed after one problem type: startup-family orchestration extraction from `src/main.ts`.
- `Child 23 Main Startup Orchestration Extraction` completed without opening a queued or locked follow-up child.
- The set now closes instead of extending into render orchestration, runtime follow-up, or `MainUiFlow` redesign.

## Active Focus

- No active child remains in this weekly set. Any later `main.ts` continuation must begin from a fresh weekly review and prove it is a different problem type.

## Artifact Index

- Module map:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-architecture-report.md`

## Verification Summary

- Fresh weekly set opening verification: `PASS`
- Child 23 implementation verification: `PASS`
- `npm run lint:plans`: `PASS`

## Weekly Outcome

### Opened

- fresh weekly controller authored
- Child 23 active plan authored
- fresh `2026-07-03-main-startup` artifact bundle authored

### Completed

- Child 23 extracted startup-family orchestration into `src/application/startup/startup-session-coordinator.ts`
- `src/main.ts` now delegates builtin startup, continue, restore, and scenario import/start through one coordinator seam
- no later child was opened in this weekly set

### Deferred

- any post-Child-23 continuation

### Blockers

- None currently recorded

## Next Week Input

- Highest-priority module to refine:
  - `src/main.ts`
- Why it is next:
  - if later work still wants to thin `main.ts`, it must first prove the remaining debt is not the already-closed startup-family boundary
- Category:
  - `fresh-review required`

