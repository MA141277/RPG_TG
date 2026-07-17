## Task 4: Documentation And Full Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md`

**Interfaces:**
- Consumes: implementation from Tasks 1-3.
- Produces: updated shared house contract documentation, change log, and plan execution state.

- [ ] **Step 1: Update the house interface contract**

In `docs/special-house-interface.md`, add this rule under `## View Model Contract` after the `HouseModuleViewModel` shape:

```md
### Primary Actor Roster Rule

For any special house with `HouseDefinition.defaultCharacterId`, that character is the house primary actor.

Rules:

- `enter()` should default to primary-actor dialogue unless a higher-priority lifecycle state takes over, such as a meeting, story event, refusal, or playable restoration.
- `selectViewModel()` must include the primary actor in `standbyRoster`.
- the primary actor must be the first `standbyRoster` entry.
- secondary fixed actors and city activity actors follow the primary actor.
- ordinary house dialogue must not render the primary actor as a separate right-side owner card or right-side dialogue portrait.
- meeting/council layouts may use dedicated seating, but they must not reintroduce generic owner-card special casing.
```

- [ ] **Step 2: Update the change log**

Add this entry at the top of `docs/change-log.md` under the current heading/list:

```md
- House primary actors now follow a shared flow: houses with `defaultCharacterId` enter through primary-actor dialogue, keep that actor first in `standbyRoster`, and render ordinary house dialogue without a separate right-side owner portrait. Temple abbot and tavern boss behavior now use the same rule as other special houses.
```

- [ ] **Step 3: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
```

Expected:

- Build test succeeds.
- All tests matching `primary house actor` pass.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run lint:plans
```

Expected:

- All commands exit with code 0.

- [ ] **Step 5: Update this plan execution state**

Update the top of this file:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-15`
- Current Focus: `Implementation complete; closeout gates remain.`
- Next Step: `Sync project progress, prepare structured closeout, push, then mark closed only after push succeeds.`
- Verification: `npm run typecheck; npm test; npm run lint:plans`
- Notes: `Implementation finished; do not mark closed until project-progress sync and remote push succeed.`
```

Append this progress log entry:

```md
- 2026-07-15
  - Summary: `Implemented shared primary actor roster ordering, migrated temple and tavern presentation, removed ordinary right-side house owner portrait rendering, and updated shared house docs.`
  - Verification: `npm run typecheck; npm test; npm run lint:plans`
  - Next: `Perform structured closeout, synchronize project-progress, and push.`
```

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
git commit -m "docs: document house primary actor flow"
```

Expected:

- Commit succeeds and contains docs plus this plan update only.

## Exit Check

- [ ] Temple daily `standbyRoster[0]` is the temple `defaultCharacterId`.
- [ ] Tavern greeting/open `standbyRoster[0]` is the tavern `defaultCharacterId`.
- [ ] Ordinary house dialogue no longer emits a separate right-side portrait container.
- [ ] Temple ordinary daily view no longer emits a right-side idle owner card.
- [ ] `docs/special-house-interface.md` documents the primary actor roster rule.
- [ ] `docs/change-log.md` records the shared flow change.
- [ ] `src/main.ts` has no new house-specific business branch for this work.
- [ ] Project progress sync is updated if this child state changes.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `House Primary Actor Flow`
- Parent Task: `House Flow Normalization`
- Parent Stage: `House Interface Standardization`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `execute-implementation-plan`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then execute this plan after the user chooses an execution approach.`
