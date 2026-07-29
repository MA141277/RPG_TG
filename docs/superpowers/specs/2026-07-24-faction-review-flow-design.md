# Faction Review Flow Design

## 1. Goal

Normalize the in-game review flow for any faction the player currently belongs to.

The flow should match a Taiko-style periodic council cadence: the faction leader opens the meeting, prior assignments are reviewed in a table, the top contributors are praised, the next policy is announced, the player may speak or stay silent, and the next assignment is selected through faction-rank-gated choices.

This is mechanism work, not a one-off temple or keep patch.

## 2. Current Repository State

The current branch has reusable pieces, but the full review flow is still split across individual house modules.

- `src/application/time/council-priority.ts`, `src/application/time/council-attendance.ts`, and `src/application/time/time-progression.ts` already own review-date timing, late attendance, and status text.
- `src/application/house-modules/temple-house/temple-house-house-module.ts` owns the temple meeting stages, contribution report, praise, policy, and assignment choice.
- `src/application/house-modules/keep-house/keep-house-house-module.ts` owns the keep meeting stages, contribution report, praise, strategy, and task choice.
- `src/domain/house-modules/temple-house-session.ts` and `src/domain/house-modules/keep-house-session.ts` already model meeting-stage session state, but their stages and overlays differ.
- `src/domain/keep-house.ts` stores keep contribution and task tier definitions, but the task gate is `runner / officer / commander`, derived from player fame, not faction merit rank.
- `src/ui/views/house/house-shared-view.ts` has a skin for assessment-style modal panels, but contribution settlement currently relies on paragraph detection rather than a structured table model.
- The current branch does not contain the `origin/dev` review-cycle seam at `src/application/review/review-cycle.ts` and `src/application/review/review-cycle-provider.ts`; those files should be used as the reference direction for decoupling review schedule policy from house-local business flow.

Current mismatches:

- Temple and keep review flows duplicate a similar cadence in different module-local stages.
- The review contribution list is not represented as a structured assignment table with `人物 / 委任 / 完成情况`.
- Keep review UI still contains English copy such as `Contribution Report`, `Current Orders`, and `Continue`.
- Completion grades are contribution-point lines instead of the requested five tier descriptions.
- The keep task gate is based on character fame and generic tier names, not faction-internal merit and faction-specific rank names.
- There is no stable extension point for special story tasks before ordinary assignment choices.

## 3. Non-House Boundary

This change does not create a new house and does not implement a new special house module. The mandatory special-house interface contract is therefore not the primary gate.

The implementation must still respect existing house module boundaries:

- Do not add review-flow business branches to `src/main.ts`.
- Do not make `src/main.ts` import concrete review business modules.
- Do not return HTML strings from `application/*` modules.
- Do not store persistent review or faction-rank data in ad hoc top-level globals.
- Do not reset player base stats, money, skills, inventory, or unrelated character fields during review entry.
- Persistent gameplay changes must flow through `GameState.runtime` or existing unified state structures.

## 4. Recommended Architecture

Add a shared faction review layer under `src/application/review/` and domain contracts under `src/domain/review.ts`.

The shared layer should own the reusable review semantics:

- contribution ranking
- assignment-table rows
- completion-grade labels
- praise line construction inputs
- policy panel view model
- faction merit rank lookup
- ordinary task filtering by minimum faction rank
- special task hook selection

Temple and keep modules should remain the place where house-specific session state is stored and where module-specific assignments are committed. They should consume shared review view models and helpers instead of each module building a separate table, ranking, and task-gate rule.

The `origin/dev` `ReviewCyclePolicy` pattern should be reintroduced or adapted so review schedule compatibility mirrors are centralized. This spec does not require all timing helpers to be renamed, but new code should avoid adding another house-local countdown implementation.

## 5. Review Flow Contract

Every faction review should follow this sequence:

1. **Leader opening**
   - The current faction leader speaks first.
   - Default line intent: `这段时间大家辛苦了。看看大家这期间的进展吧。`
   - Faction and personality variants may replace the exact text later, but the flow position stays the same.

2. **Assignment table**
   - A panel appears with title `委任`.
   - The table columns are `人物`, `委任`, `完成情况`.
   - The panel replaces the old `主命` wording.
   - Completion text must use only these five labels:
     - `赫赫之功`
     - `尽职尽责`
     - `差强人意`
     - `不尽人意`
     - `碌碌无为`

3. **Top-contributor praise**
   - The assignment table disappears.
   - The leader says:
     - `看来，这段时间{人物}贡献最大。大家要以他们为表率。`
     - `其次是{分数第二的人物}。`
   - If fewer than two contributors exist, the missing second line is omitted.

4. **Situation statement**
   - The leader describes the current situation in a data-driven line group.
   - This is the `{用来描述当前形势}` segment.

5. **Policy panel**
   - The next dialogue advances to `{所以接下来的计划如下}`.
   - A policy panel appears and remains visible through the next prompt.
   - The policy panel fields are:
     - `总目标`
     - `阶段目标`
     - `执行计划`

6. **Advice prompt**
   - While the policy panel remains visible, the leader asks: `有谁要进言吗`
   - Choices appear:
     - `发表意见`
     - `一言不发`

7. **Assignment selection**
   - `发表意见` is an extension point for later advice mechanics. In this slice it may show a not-yet-implemented response and then continue to the same assignment-selection step.
   - `一言不发` enters character/task selection.
   - If a special story task is available, the leader describes it and the player chooses `接取` or `不接取`.
   - If no special story task is available, ordinary available tasks appear.
   - Ordinary task choice labels must append the minimum identity requirement:
     - `任务名（最低身份：身份名）`

## 6. Faction Merit And Rank Contract

Faction merit is faction-internal persistent gameplay data.

Rules:

- Merit is tracked separately per faction.
- Leaving a faction clears that faction's merit for the player unless a later story explicitly migrates or preserves it.
- Merit is similar in purpose to the current contribution value, but it is not a base stat, money, skill, or inventory value.
- Review completion may update merit through shared runtime structures.
- Task access checks use the player's current faction merit rank, not global fame.

The initial rank tables are:

### Temple

| Rank | Merit | Stipend |
| --- | ---: | --- |
| 杂役 | 0 | 0（管饭） |
| 沙弥 | 30 | 1 斗米 |
| 云游僧 | 200 | 化缘所得 |
| 比丘 | 500 | 3 斗米 |
| 知客僧 | 1000 | 5 斗米 |
| 监院 | 1800 | 8 斗米 |

### Red Turban Army

| Rank | Merit |
| --- | ---: |
| 亲兵 | 0 |
| 亲兵队长 | 200 |
| 镇抚 | 600 |
| 管军总管 | 1400 |
| 总兵官 | 3000 |
| （左副）元帅 | 4500 |
| 自立·吴国公 / 下克上 | 10000 |

Rank lookup returns the highest rank whose threshold is less than or equal to the current merit.

## 7. Data Contracts

The shared review domain should expose stable types equivalent to:

```ts
export type ReviewCompletionGrade =
  | "outstanding"
  | "fulfilled"
  | "acceptable"
  | "poor"
  | "idle";

export type ReviewAssignmentRow = {
  characterId: string;
  characterName: string;
  assignmentTitle: string;
  contribution: number;
  grade: ReviewCompletionGrade;
};

export type ReviewPolicyPanel = {
  overallGoal: string;
  phaseGoal: string;
  executionPlan: string;
};

export type FactionMeritRank = {
  id: string;
  label: string;
  minMerit: number;
  stipendLabel?: string;
};

export type ReviewTaskChoice = {
  id: string;
  label: string;
  minRankId: string;
  minRankLabel: string;
  disabled?: boolean;
};
```

The exact final names may change during implementation, but the semantics must remain stable.

## 8. UI Contract

The assignment-table panel should be a structured overlay or panel, not paragraph text that only looks like a table.

Requirements:

- Title text is `委任`.
- Header cells are `人物`, `委任`, `完成情况`.
- Rows are aligned in three columns and visually close to the provided reference image.
- The panel disappears before top-contributor praise.
- The policy panel uses the same assessment/council visual family, but it remains visible while the leader asks for advice.
- Text must fit on desktop and mobile without overlap.
- `application/*` modules may return typed view models only; table HTML belongs in `ui/views/*`.

## 9. Special Task Hook

This slice should add the interface but not implement story-specific special tasks.

The hook should answer:

- whether a special task is available for the current faction review
- leader description lines
- accept action id
- decline action id

If no special task is available, the flow immediately shows ordinary task choices.

If a special task is declined, the flow should continue to ordinary task choices unless the hook explicitly says the review ends.

## 10. Testing Requirements

Add focused tests before production code.

Required coverage:

- assignment rows map numeric contribution to the five completion labels
- rank lookup returns the correct temple and Red Turban rank at threshold boundaries
- ordinary task choices are filtered by faction merit rank and display `（最低身份：...）`
- review flow advances in the required order
- the assignment table view model renders with `委任`, `人物`, `委任`, and `完成情况`
- the policy panel remains visible during `有谁要进言吗`
- keep review no longer derives ordinary task access from player fame
- no new `main.ts` review business branch is introduced

Verification commands:

- targeted Node tests for review domain and house UI contracts
- `npm run typecheck`
- `npm test`
- `npm run build`

## 11. Documentation Requirements

If implementation changes shared review interfaces, runtime session structure, registry shape, or cross-module wiring, update:

- `docs/change-log.md`
- the implementation plan under `docs/superpowers/plans/`

If the implementation adds new executable plan work, it must follow:

- `docs/superpowers/plans/_plan-template.md`
- `docs/superpowers/specs/plan-governance-spec.md`

## 12. Out Of Scope

This spec does not implement:

- a full advice/debate/minigame system for `发表意见`
- story-specific special task content
- new faction recruitment or faction-leaving story logic beyond clearing merit when an existing departure path is touched
- a full mod contribution surface for review definitions
- a redesign of all house layouts outside the review/council panels

## 13. Exit Criteria

- Temple and keep review flows share the same review semantics for table rows, grades, ranking, policy, and task-rank gating.
- The visible flow follows the sequence in section 5.
- Assignment table and policy panel are typed view models rendered in UI code.
- Temple and Red Turban rank tables are implemented and tested.
- Ordinary task choices show minimum identity labels.
- Special task hook exists and cleanly falls back to ordinary task choices when empty.
- No new review business logic is added to `src/main.ts`.
- Required tests and verification commands pass.
