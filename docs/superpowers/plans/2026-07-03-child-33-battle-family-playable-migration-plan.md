# Child 33 Battle-Family Playable Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `story-battle` into the unified playable runtime as `family: "battle"` while preserving battle-specific command, presenter, and result semantics.

**Architecture:** Child 33 begins only after the minigame-family migration proves the top-level playable shell. It should route `story-battle` through the same registry/runtime/presenter/settlement/handoff family as other playables, but it must not flatten battle actions or battle presentation into minigame-only vocabulary. This child exists specifically to keep shared shell ownership and battle-specific semantics distinct at the same time.

**Tech Stack:** TypeScript, `src/application/story-battle`, `src/ui/views/battle`, `src/core/runtime`, `tests/robustness.test.cjs`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 33 is closed. Story-battle now launches with a shared battle-family playable session, settles through playable-runtime, and leaves interactive-runtime as a compatibility delegation layer rather than a direct battle owner.`
- Next Step: `Hold Child 34 as the remaining candidate-only closeout phase until a fresh enforcement/legacy residue recheck is recorded.`
- Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
- Notes: `This child deliberately kept the existing battle view and story-battle domain session shape. No new presenter adapter was required because the migration line was narrowed to top-level ownership, settlement, and compatibility delegation.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created for the later battle-family migration phase. Child 33 remains non-executable until earlier playable-family work proves the shared shell.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck story-battle runtime and presenter ownership after earlier playable children close.`
- 2026-07-03
  - Summary: `Completed Child 33 after a fresh battle-family recheck. Added a battle-family playable wrapper for story-battle launch/settlement, moved story callback startup onto the shared playable session carrier, routed playable-runtime settlement and main battle actions through the shared playable path, and reduced interactive-runtime to compatibility delegation for legacy story-battle action ids.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 34 candidate-only until a fresh enforcement/legacy closeout recheck confirms the remaining scope.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-33-battle-family-playable-migration-spec.md`
- Shared contract spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Child 32 already proved the shared playableSession carrier and battle-family registry identity, so Child 33 no longer needed to reopen playable taxonomy or top-level shell design.`
  - `The actual remaining work narrowed to story-battle launch/action/settlement ownership and compatibility routing. The existing battle view and domain session shape were already adequate for this migration slice.`
  - `Because the current battle view can still consume storyBattle session state directly, this child did not need to invent a thin presenter adapter just to satisfy symmetry with minigame-family migrations.`

## Implementation Scope

### In Scope

- migrate `story-battle` to the shared playable runtime
- register `story-battle` as `family: "battle"`
- preserve battle-specific commands, view model, layout, and completion facts
- move settlement and handoff ownership behind the shared playable runtime
- add battle-family regressions proving shared shell ownership without semantic flattening

### Still Out Of Scope

- redesigning battle mechanics or formation rules
- minigame-family migration already owned by earlier children
- scaffold/validator/CI closeout
- unrelated story runtime redesign beyond the battle migration seam

## File Map

### Existing files to modify

- `src/main.ts`
  - Narrow concrete `interactive.story-battle.*` action ownership after migration.
- `src/core/runtime/interactive-runtime.ts`
  - Remove or reduce direct story-battle runtime ownership once the shared playable runtime owns it.
- `src/application/story/story-callbacks.ts`
  - Align any launch or completion handoff integration that still assumes direct story-battle ownership.
- `src/core/runtime/playable-runtime.ts`
  - Own story-battle launch/action/exit settlement under the shared playable runtime.
- `tests/robustness.test.cjs`
  - Add parity regressions for battle-family migration.
- `docs/change-log.md`
  - Record the battle-family migration outcome.
- `docs/superpowers/plans/2026-07-03-child-33-battle-family-playable-migration-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/ui/app-render.ts`
- `src/styles/story-battle.css`
- `docs/battle-demo-current-design.md`
- `src/application/story-battle/story-battle-runtime.ts`

### New files to create

- `src/application/playables/story-battle/story-battle-definition.ts`
  - Battle-family playable definition wrapper around the existing story-battle runtime logic.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "story battle playable|battle family|interactive runtime no longer depends on legacy adapter-owned qte or story-battle ownership"`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Recheck Story-Battle Ownership

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-33-battle-family-playable-migration-plan.md`
- Read: `src/application/story-battle/story-battle-runtime.ts`
- Read: `src/ui/views/battle/story-battle-view.ts`
- Read: `src/core/runtime/interactive-runtime.ts`

- [x] **Step 1: Confirm that battle-family migration is the next isolated boundary**

Lock the child boundary after earlier playable children close.

- [x] **Step 2: Record any narrowed compatibility residue**

If earlier children already removed transitional glue, update this plan before execution.

## Task 2: Wrap Story-Battle In A Battle-Family Playable Definition

**Files:**
- Create: `src/application/playables/story-battle/story-battle-definition.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/main.ts`

- [x] **Step 1: Move top-level story-battle ownership onto the shared playable runtime**

Keep battle command semantics explicit rather than rewriting them into minigame-only action names.

- [x] **Step 2: Preserve battle-specific presentation**

Keep battle-specific `viewModel` and battlefield layout semantics under the shared shell.

## Task 3: Normalize Battle Settlement And Handoff

**Files:**
- Modify: `src/application/story/story-callbacks.ts`
- Modify: `src/main.ts`

- [x] **Step 1: Emit battle completion facts rather than story-local judgments**

Let integration config and shared settlement decide outcome semantics from battle facts.

- [x] **Step 2: Keep post-battle return behavior correct**

Ensure the correct owner/scene/session recovery path remains explicit through handoff.

## Task 4: Add Battle-Family Regressions And Artifact Sync

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

- [x] **Step 1: Add red-to-green battle-family regressions**

Prove story-battle now routes through the shared playable runtime while preserving battle-family semantics.

- [x] **Step 2: Run the required verification commands**

Run:

```bash
npm run lint:plans
npm run typecheck
npm test
npm run build
```

Expected:

- `PASS`

## Exit Check

- [x] `story-battle` is owned by the shared playable runtime.
- [x] `story-battle` remains `family: "battle"`.
- [x] Battle-specific command and presenter semantics remain explicit.
- [x] Post-battle return behavior remains correct.
- [x] Shared docs are updated if boundaries changed.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
