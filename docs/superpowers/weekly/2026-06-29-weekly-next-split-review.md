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
| `src/core/runtime` | `yes` | `partial` | `indirect` | `no` | `yes` | `high` |
| `src/core/registry` | `yes` | `partial` | `no` | `no` | `yes` | `medium` |
| `src/core/save` | `partial` | `partial` | `no` | `no` | `partial` | `medium` |
| `src/application/presenter` | `yes` | `yes` | `indirect` | `yes` | `yes` | `medium` |
| `src/ui/app-render.ts` | `yes` | `yes` | `indirect` | `yes` | `yes` | `medium` |
| `src/application/navigation/*` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `src/application/house/*` | `yes` | `partial` | `indirect` | `yes` | `yes` | `medium` |
| `src/application/story-battle/*` | `yes` | `partial` | `indirect` | `yes` | `yes` | `medium` |

## Recommended Next Split

- Module:
  - `src/core/runtime`
- Reason:
  - Child 4 batch 1 already introduced house and interactive bridge seams, so the next bottleneck is making those seams fit the shared runtime routing model instead of leaving dedicated bridge helpers as a parallel dispatch path.
- Category:
  - `needs-hardening`

## Non-Selected Candidates

- `src/core/engine`
  - Now implemented as a provisional seam; further changes should be validation-driven rather than open-ended redesign.
- `src/main.ts`
  - Still the largest black box, but Child 4 batch 1 already shrank direct interactive ownership; the next step is to keep shrinking it through runtime consolidation rather than reopening bootstrap or persistence first.
- `src/core/registry`
  - Important, but registry composition should stay thin until runtime and adapter seams prove what else is truly needed.
- `src/core/runtime`
  - This is now the recommended next split because Child 4 already touched it and the remaining question is specifically about unified routing ownership.
- `src/core/save`
  - Loader/writer/migration ownership now exists; further changes should be consumer-driven rather than another save-shape redesign.
- `src/application/house/*`
  - Covered house entry and dispatch are now behind a Child 4 bridge, so the next reduction should happen through runtime consolidation before deeper house-module redesign.
- `src/application/presenter`
  - Important for decoupling, but not the first bottleneck this week.
