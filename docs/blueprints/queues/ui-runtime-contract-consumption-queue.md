# UI Runtime Contract Consumption Queue

## Control Block

- queue_id: `queue.ui-runtime-contract-consumption`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-target-review`
- allowed_task_states:
  - `candidate`
  - `queued`
  - `active`
  - `blocked`
  - `done`
  - `dropped`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `future-target-candidate`
  - `out-of-scope`
  - `historical-residue`
  - `content-pipeline-item`
  - `asset-pipeline-item`
- promotion_gate:
  - `fresh_runtime_facing_ui_bypass_proven`
  - `bounded_replacement_scope_written`
- closeout_gate:
  - `all_required_tasks_done_or_dropped`
  - `queue_closeout_note_written`
  - `verification_recorded`
- must_not_expand_into:
  - `overlay_system_rewrite`
  - `presenter_architecture_rewrite`
  - `editor_or_layout_system_rework`
  - `runtime_or_save_structure_redesign`
  - `visual_redesign`

## Human Context

### Queue Goal

Close the still-live runtime-facing UI contract bypass where shared dialog behavior is implemented through multiple parallel renderers, duplicated confirm markup, and caller-specific DOM semantics instead of one bounded shared dialog component with explicit result semantics.

### Boundary

This queue covers:

- shared dialog-component extraction for the covered modal/dialogue slice only
- minimum shared input contract, output contract, and close-result semantics for that slice
- replacement of only the approved current-path dialog call sites
- minimal adapter compatibility needed so existing callers keep owning post-close business actions

This queue does not cover:

- full overlay or panel unification
- gameplay/minigame shell overlays such as qte, begging, debate, gamble, or other interaction-heavy surfaces
- global presenter redesign
- editor, layout, runtime, mod-loader, or save-envelope restructuring
- opportunistic UI cleanup outside the covered dialog slice

### Admission Evidence

- `src/ui/components/modal/confirm-modal.ts` and `src/ui/app-render.ts` still own app-level confirm modal rendering separately from other dialog surfaces.
- `src/ui/app-render.ts` still owns location dialogue rendering through a separate footer implementation.
- `src/ui/views/scene/scene-view.ts` still owns a separate scene dialogue-card implementation.
- `src/ui/views/house/house-shared-view.ts` already owns a house-local shared dialogue/confirm slice, proving the repository wants reuse but has not yet closed it at the repository-level component boundary.
- `src/ui/views/house/temple-house-view.ts` and `src/ui/views/house/tavern-house-view.ts` still duplicate confirm overlay renderers instead of consuming the shared house confirm renderer.

### Active Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.ui-runtime-contract-consumption.shared-dialog-component-and-bounded-replacement` | `done` | `Extract one bounded shared dialog component with explicit result semantics and replace only the approved dialog call sites without expanding into full overlay unification.` | `none` | `Completed on 2026-07-07 with bounded replacements only; no overlay-system or presenter-scope expansion was admitted.` |

## Task Definitions

### `task.ui-runtime-contract-consumption.shared-dialog-component-and-bounded-replacement`

#### Control Block

- task_id: `task.ui-runtime-contract-consumption.shared-dialog-component-and-bounded-replacement`
- state: `done`
- task_type: `execution`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `src/ui/components/dialog/**`
  - `src/ui/components/modal/confirm-modal.ts`
  - `src/ui/app-render.ts`
  - `src/ui/views/house/house-shared-view.ts`
  - `src/ui/views/house/temple-house-view.ts`
  - `src/ui/views/house/tavern-house-view.ts`
  - `src/ui/views/scene/scene-view.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/ui/components/modal/confirm-modal.ts`
  - `src/ui/app-render.ts`
  - `src/ui/views/house/house-shared-view.ts`
  - `src/ui/views/house/temple-house-view.ts`
  - `src/ui/views/house/tavern-house-view.ts`
  - `src/ui/views/scene/scene-view.ts`
  - `docs/frontend-conventions.md`
  - `docs/game-component-inventory.md`
  - `docs/special-house-interface.md`
- must_not_change:
  - `overlay_system_scope`
  - `editor_layout_scope`
  - `runtime_owner_line_scope`
  - `save_or_mod_loader_scope`
- done_when:
  - `a repository-level shared dialog component exists for the approved dialog slice`
  - `the covered dialog slice has minimum explicit input and result semantics`
  - `approved call sites are replaced without behavioral regression`
  - `the shared component does not hardcode post-close business flow`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run typecheck`
- if_blocked:
  - `record blocker in queue`
  - `stop rather than widening into overlay-system work`
- promote_next_if_done: `none`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `global_ui_contract_rewrite`
  - `overlay_bus_or_global_event_bus_introduction`
  - `gameplay_overlay_unification`
  - `visual_retheme`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `landing the covered dialog slice would require full overlay-system unification or presenter/runtime rewiring`

#### Human Context

- Approved in-scope replacement points:
  - `app modal confirm`
  - `app location dialogue`
  - `house alert`
  - `house confirm`
  - `house dialogue card`
  - `scene dialogue card`
  - `temple confirm duplicate`
  - `tavern confirm duplicate`
- Explicit out-of-scope examples:
  - `quantity-confirm`
  - `rest-days`
  - `qte-bar`
  - `result`
  - `debate`
  - `gamble-choice`
  - `gamble`
  - `gamble-table`
  - `city-begging`
- Failure mode:
  - `Do not let the shared dialog component become a business-flow controller; callers must keep deciding follow-up actions from the returned or encoded result semantics.`

## Closeout Decision

- Decision: `close-queue`
- Date: `2026-07-07`
- Verification status: `passed`
- Closeout basis:
  - `The repository-level shared dialog component now exists at src/ui/components/dialog/shared-dialog.ts.`
  - `Approved replacement points were consumed without expanding into overlay-system, presenter, editor, runtime, or save-structure work.`
  - `Caller-owned post-close business actions were preserved; the shared component only exposes bounded result semantics.`
- Verification record:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs tests/blueprint-governance-lint.test.cjs`
  - `npx tsc -p tsconfig.json --noEmit`
  - `npm run lint:blueprints`
- Return effect:
  - `Return to target-level review with no active queue.`
