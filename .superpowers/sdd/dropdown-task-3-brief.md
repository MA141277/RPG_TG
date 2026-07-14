## Task 3: Run Regression Verification And Record Plan State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md`
- Read: `tests/spine-unit-context.test.cjs`
- Read: `tests/slash-fx-fade-window.test.cjs`

**Interfaces:**
- Consumes:
  - Completed implementation from Tasks 1-3
- Produces:
  - Updated execution state and verification record suitable for user review or execution handoff.

- [ ] **Step 1: Run the targeted verification commands**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\slash-fx-fade-window.test.cjs
```

Expected:

- `tools/lint-superpowers-plans.mjs` passes
- `tests/spine-unit-context.test.cjs` passes
- `tests/slash-fx-fade-window.test.cjs` passes

- [ ] **Step 2: Sync progress and governance state**

Update this plan in place:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-13`
- Current Focus: `Dropdown selector implementation and targeted verification are complete; awaiting user review.`
- Next Step: `Review the Spine editor dropdown locally, then decide whether to iterate or close out.`
- Verification: `tools/lint-superpowers-plans.mjs PASS; tests/spine-unit-context.test.cjs PASS; tests/slash-fx-fade-window.test.cjs PASS`
```

Append a new `Progress Log` entry with the implementation summary, verification results, and next explicit action.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: add spine unit dropdown selector"
```

## Exit Check

- [ ] The garbled top-right unit buttons are removed.
- [ ] The toolbar shows a single unit dropdown.
- [ ] Dropdown options are rendered from `SPINE_UNIT_CONFIGS`.
- [ ] Unavailable units appear as disabled `(unconfigured)` options.
- [ ] Switching to a different unit always requires confirmation.
- [ ] Canceled and failed switches leave the active unit and active project unchanged.
- [ ] Existing unit-specific feature groups still obey `state.currentUnitType`.
- [ ] Verification results are recorded in the plan state.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Spine Unit Dropdown`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `not-ready`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-implementation`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue from the first unchecked step in docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md.`
