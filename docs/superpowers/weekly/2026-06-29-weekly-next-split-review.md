# Weekly Next Split Review

**Week Of:** `2026-06-29`

## Purpose

Use fixed criteria to decide which module should be refined next.

Do not decide the next split only from intuition.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `yes` | `yes` | `yes` | `yes` | `yes` | `high` |
| `src/core/engine` | `yes` | `partial` | `no` | `no` | `yes` | `medium` |
| `src/core/runtime` | `yes` | `partial` | `no` | `no` | `yes` | `medium` |
| `src/core/registry` | `yes` | `partial` | `no` | `no` | `yes` | `medium` |
| `src/core/save` | `partial` | `partial` | `no` | `no` | `partial` | `medium` |
| `src/application/presenter` | `yes` | `yes` | `indirect` | `yes` | `yes` | `medium` |
| `src/ui/app-render.ts` | `yes` | `yes` | `indirect` | `yes` | `yes` | `medium` |
| `src/application/navigation/*` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `src/application/house/*` | `yes` | `yes` | `indirect` | `yes` | `yes` | `high` |
| `src/application/story-battle/*` | `yes` | `yes` | `indirect` | `yes` | `yes` | `high` |

## Recommended Next Split

- Module:
  - `src/application/house/*`
- Reason:
  - Child 3 finished the first navigation/time/event extraction, so the next bottleneck is house-owned interactive launch and completion logic that still bypasses a unified interactive runtime.
- Category:
  - `needs-migration`

## Non-Selected Candidates

- `src/core/engine`
  - Now implemented as a provisional seam; further changes should be validation-driven rather than open-ended redesign.
- `src/main.ts`
  - Still the largest black box, but Child 3 already peeled one real navigation/time/event slice out through dedicated seams; the next step is to keep shrinking it by moving interactive ownership, not by reopening bootstrap or persistence first.
- `src/core/registry`
  - Important, but registry composition should stay thin until runtime and adapter seams prove what else is truly needed.
- `src/core/runtime`
  - Now implemented as a broader provisional seam; Child 4 should extend it only where interactive launch and completion truly need core-owned routing.
- `src/core/save`
  - Loader/writer/migration ownership now exists; further changes should be consumer-driven rather than another save-shape redesign.
- `src/application/presenter`
  - Important for decoupling, but not the first bottleneck this week.
