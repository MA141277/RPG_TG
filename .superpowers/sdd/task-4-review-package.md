# Review Package Task 4

Base: 58535af4
Head: 1b44e16a179fa6973dab72558a269d19e8732fea

## Commits
1b44e16a docs: document house primary actor flow

## Stat
 docs/change-log.md                                 |  2 +
 docs/special-house-interface.md                    | 13 ++++
 .../2026-07-15-house-primary-actor-flow-plan.md    | 85 +++++++++++-----------
 3 files changed, 59 insertions(+), 41 deletions(-)

## Diff
diff --git a/docs/change-log.md b/docs/change-log.md
index 8bfefa7f..1acd63be 100644
--- a/docs/change-log.md
+++ b/docs/change-log.md
@@ -1,14 +1,16 @@
 ﻿# 变更记录
 
 用于持续记录项目结构、公共契约、功能能力和开发规则的变化。
 
+- House primary actors now follow a shared flow: houses with `defaultCharacterId` enter through primary-actor dialogue, keep that actor first in `standbyRoster`, and render ordinary house dialogue without a separate right-side owner portrait. Temple abbot and tavern boss behavior now use the same rule as other special houses.
+
 ## 2026-07-13 Generic Activity Pachinko Board
 
 ### Added
 - 新增 `pachinko-board` activity session contract，作为 `activity-qte` playable 的新默认小游戏：长方形 2D 弹珠盘、同步顶部双摆臂、固定 6/7 交错弹柱、移动双柱积分门、底部 7 分栏和 5 枚默认小球。
 - `HouseOverlayViewModel` 增加 `pachinko-board` 结构化 overlay，寺庙 house-hosted activity work 可直接渲染 shared playable session，不需要恢复 house-local QTE timer。
 - `activity-confirm` overlay 增加工作描述、相关能力、消耗、历史最高分和快速完成 action 字段；寺庙工作按 `activityId` 记录 `var.activity.<activityId>.best_score`，第二次可用历史最高分 90% 快速完成。
 
 ### Changed
 - `generic.qte` / `activity-qte` 默认启动路径从旧 `fortune-board` 棋盘切换为 `pachinko-board`；旧 `fortune-board` session、渲染和兼容 action seam 保留。
 - 寺庙帮忙类工作继续通过 `playable.activity-qte.house.temple` 启动 shared playable runtime，但验收流程现在显示并结算新的弹珠玩法。
diff --git a/docs/special-house-interface.md b/docs/special-house-interface.md
index 0aca7ee0..c5fe3515 100644
--- a/docs/special-house-interface.md
+++ b/docs/special-house-interface.md
@@ -568,20 +568,33 @@ type HouseModuleViewModel = {
   sceneSubtitle?: string;
   standbyRoster: HouseStandbyActorViewModel[];
   dialogue: HouseDialogueViewModel | null;
   actionContainer: HouseActionContainerViewModel | null;
   statusCard: HouseStatusCardViewModel | null;
   overlay: HouseOverlayViewModel | null;
   leaveAction: HouseActionViewModel;
 };
 ```
 
+### Primary Actor Roster Rule
+
+For any special house with `HouseDefinition.defaultCharacterId`, that character is the house primary actor.
+
+Rules:
+
+- `enter()` should default to primary-actor dialogue unless a higher-priority lifecycle state takes over, such as a meeting, story event, refusal, or playable restoration.
+- `selectViewModel()` must include the primary actor in `standbyRoster`.
+- the primary actor must be the first `standbyRoster` entry.
+- secondary fixed actors and city activity actors follow the primary actor.
+- ordinary house dialogue must not render the primary actor as a separate right-side owner card or right-side dialogue portrait.
+- meeting/council layouts may use dedicated seating, but they must not reintroduce generic owner-card special casing.
+
 The view should not:
 
 - read runtime variables directly
 - mutate state directly
 - know storage keys
 
 ## Content Rules
 
 `content` may define:
 
diff --git a/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md b/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
index 1c9d6af1..acc8a93a 100644
--- a/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
+++ b/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
@@ -3,33 +3,37 @@
 > **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
 
 **Goal:** Make every special house with `HouseDefinition.defaultCharacterId` enter with primary-actor dialogue and render that actor first in the left-side roster instead of as a right-side owner or portrait.
 
 **Architecture:** Keep house behavior inside the existing `moduleId` registry lifecycle. Add one shared roster-ordering helper for application view-model assembly, migrate covered modules to use it, and simplify ordinary house dialogue rendering so actor identity is expressed through the roster plus speaker metadata rather than a separate right-side portrait.
 
 **Tech Stack:** TypeScript, Vite, Node test runner, CommonJS compiled test output under `.test-dist`, existing `npm run build:test`, `npm run typecheck`, `npm test`, and `npm run lint:plans`.
 
 ## Execution State
 
-- Status: `waiting`
+- Status: `completed-but-open`
 - Last Updated: `2026-07-15`
-- Current Focus: `Plan created; waiting for execution approach selection.`
-- Next Step: `Choose subagent-driven or inline execution, then start Task 1 from this plan.`
-- Verification: `npm run lint:plans after plan creation`
-- Notes: `Do not mark closed until implementation verification, docs sync, project-progress sync, and push gates are satisfied.`
+- Current Focus: `Implementation complete; closeout gates remain.`
+- Next Step: `Sync project progress, prepare structured closeout, push, then mark closed only after push succeeds.`
+- Verification: `npm run typecheck; npm test; npm run lint:plans`
+- Notes: `Implementation finished; do not mark closed until project-progress sync and remote push succeed.`
 
 ## Progress Log
 
 - 2026-07-15
   - Summary: `Created the executable plan for the approved house primary actor flow design.`
   - Verification: `Pending npm run lint:plans`
   - Next: `Choose execution approach, then implement Task 1 with tests first.`
+- 2026-07-15
+  - Summary: `Implemented shared primary actor roster ordering, migrated temple and tavern presentation, removed ordinary right-side house owner portrait rendering, and updated shared house docs.`
+  - Verification: `npm run typecheck; npm test; npm run lint:plans`
+  - Next: `Perform structured closeout, synchronize project-progress, and push.`
 
 ---
 
 ## Based On Spec
 
 - Primary spec:
   - `docs/superpowers/specs/2026-07-15-house-primary-actor-flow-design.md`
 - Plan governance:
   - `docs/superpowers/specs/plan-governance-spec.md`
 - Canonical progress entry:
@@ -104,21 +108,21 @@
 ## Task 1: Shared Primary Actor Roster Helper
 
 **Files:**
 - Create: `src/application/house/house-primary-actor-roster.ts`
 - Modify: `tests/robustness.test.cjs`
 
 **Interfaces:**
 - Consumes: `HouseStandbyActorViewModel` from `src/domain/house-module.ts`.
 - Produces: `orderHouseStandbyRoster(input: { primaryCharacterId: string | null; actors: HouseStandbyActorViewModel[] }): HouseStandbyActorViewModel[]`.
 
-- [ ] **Step 1: Write the failing helper tests**
+- [x] **Step 1: Write the failing helper tests**
 
 Add this import near the other `.test-dist` imports in `tests/robustness.test.cjs`:
 
 ```js
 const {
   orderHouseStandbyRoster,
 } = require("../.test-dist/application/house/house-primary-actor-roster.js");
 ```
 
 Add these tests near other house tests in `tests/robustness.test.cjs`:
@@ -152,34 +156,34 @@ test("primary house actor roster helper deduplicates actors without losing the f
     ],
   });
 
   assert.deepEqual(
     roster.map((actor) => actor.name),
     ["Owner", "Guest"]
   );
 });
 ```
 
-- [ ] **Step 2: Run the tests to verify they fail**
+- [x] **Step 2: Run the tests to verify they fail**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"
 ```
 
 Expected:
 
 - `npm run build:test` fails because `src/application/house/house-primary-actor-roster.ts` does not exist, or the focused node test fails because `orderHouseStandbyRoster` is not exported.
 
-- [ ] **Step 3: Implement the helper**
+- [x] **Step 3: Implement the helper**
 
 Create `src/application/house/house-primary-actor-roster.ts`:
 
 ```ts
 import type { HouseStandbyActorViewModel } from "../../domain/house-module";
 
 export function orderHouseStandbyRoster(input: {
   primaryCharacterId: string | null;
   actors: HouseStandbyActorViewModel[];
 }): HouseStandbyActorViewModel[] {
@@ -207,35 +211,35 @@ export function orderHouseStandbyRoster(input: {
 
   return [
     primaryActor,
     ...dedupedActors.filter(
       (actor) => actor.characterId !== input.primaryCharacterId
     ),
   ];
 }
 ```
 
-- [ ] **Step 4: Run the focused helper tests**
+- [x] **Step 4: Run the focused helper tests**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"
 ```
 
 Expected:
 
 - `npm run build:test` exits with code 0.
 - Both focused helper tests pass.
 
-- [ ] **Step 5: Commit Task 1**
+- [x] **Step 5: Commit Task 1**
 
 Run:
 
 ```bash
 git add src/application/house/house-primary-actor-roster.ts tests/robustness.test.cjs
 git commit -m "test: add house primary actor roster helper"
 ```
 
 Expected:
 
@@ -245,21 +249,21 @@ Expected:
 
 **Files:**
 - Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
 - Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
 - Modify: `tests/robustness.test.cjs`
 
 **Interfaces:**
 - Consumes: `orderHouseStandbyRoster({ primaryCharacterId, actors })` from Task 1.
 - Produces: temple and tavern `HouseModuleViewModel.standbyRoster` with `defaultCharacterId` first while greeting/open dialogue is active.
 
-- [ ] **Step 1: Write failing temple and tavern view-model tests**
+- [x] **Step 1: Write failing temple and tavern view-model tests**
 
 Add these tests to `tests/robustness.test.cjs`:
 
 ```js
 test("primary house actor appears first in temple daily roster during greeting", () => {
   const state = createInitialState({
     cards: prototypeCards,
     characters: prototypeCharacters,
     houses: prototypeHouses,
     cityEntries: prototypeCityEntries,
@@ -309,34 +313,34 @@ test("primary house actor appears first in tavern roster during greeting", () =>
     playerCharacterId,
     sessionState: entered.sessionState,
   });
 
   assert.equal(viewModel.dialogue?.characterId, tavernHouse.defaultCharacterId);
   assert.equal(viewModel.standbyRoster[0]?.characterId, tavernHouse.defaultCharacterId);
   assert.ok(viewModel.standbyRoster[0]?.actionId);
 });
 ```
 
-- [ ] **Step 2: Run the focused tests to verify they fail**
+- [x] **Step 2: Run the focused tests to verify they fail**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
 ```
 
 Expected:
 
 - Temple or tavern focused tests fail because the owner is missing from active dialogue roster or is not first.
 
-- [ ] **Step 3: Migrate tavern `selectViewModel()`**
+- [x] **Step 3: Migrate tavern `selectViewModel()`**
 
 In `src/application/house-modules/tavern/tavern-house-module.ts`, import the helper:
 
 ```ts
 import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 ```
 
 Replace the `standbyRoster: isIdle ? [...] : []` expression in `selectViewModel()` with a roster that is always present:
 
 ```ts
@@ -355,21 +359,21 @@ Use it in the returned view model:
 
 ```ts
 standbyRoster: orderHouseStandbyRoster({
   primaryCharacterId: tavernPrimaryActorId,
   actors: [tavernBossActor],
 }),
 ```
 
 Keep the existing dialogue, action container, status card, overlay, and leave action behavior unchanged.
 
-- [ ] **Step 4: Migrate temple daily `standbyRoster` ordering**
+- [x] **Step 4: Migrate temple daily `standbyRoster` ordering**
 
 In `src/application/house-modules/temple-house/temple-house-house-module.ts`, import the helper:
 
 ```ts
 import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 ```
 
 After `const standbyCharacterIds = ...`, add a daily roster actor list before the `return`:
 
 ```ts
@@ -423,34 +427,34 @@ const orderedStandbyActors =
         actors: standbyActors,
       });
 ```
 
 Replace the existing inline `standbyRoster: standbyCharacterIds.map(...)` expression with:
 
 ```ts
 standbyRoster: orderedStandbyActors,
 ```
 
-- [ ] **Step 5: Run the focused view-model tests**
+- [x] **Step 5: Run the focused view-model tests**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
 ```
 
 Expected:
 
 - Both focused tests pass.
 
-- [ ] **Step 6: Commit Task 2**
+- [x] **Step 6: Commit Task 2**
 
 Run:
 
 ```bash
 git add src/application/house-modules/temple-house/temple-house-house-module.ts src/application/house-modules/tavern/tavern-house-module.ts tests/robustness.test.cjs
 git commit -m "feat: keep house primary actors in roster"
 ```
 
 Expected:
 
@@ -460,21 +464,21 @@ Expected:
 
 **Files:**
 - Modify: `src/ui/views/house/house-shared-view.ts`
 - Modify: `src/ui/views/house/temple-house-view.ts`
 - Modify: `tests/robustness.test.cjs`
 
 **Interfaces:**
 - Consumes: Task 2 view models with primary actors in `standbyRoster`.
 - Produces: ordinary house markup without `c-grain-shop-dialogue__npc` or right-side idle owner markup for the temple daily owner.
 
-- [ ] **Step 1: Write failing renderer tests**
+- [x] **Step 1: Write failing renderer tests**
 
 Add this import near existing render imports in `tests/robustness.test.cjs`:
 
 ```js
 const {
   renderTavernHouseView,
 } = require("../.test-dist/ui/views/house/tavern-house-view.js");
 ```
 
 Add these tests:
@@ -532,35 +536,35 @@ test("temple daily view keeps abbot in left roster instead of right owner slot",
       dialoguePhase: "idle",
     },
   });
   const markup = renderTempleHouseView(viewModel);
 
   assert.match(markup, /c-grain-shop-npc-idle/u);
   assert.doesNotMatch(markup, /c-grain-shop-idle-owner/u);
 });
 ```
 
-- [ ] **Step 2: Run the focused renderer tests to verify they fail**
+- [x] **Step 2: Run the focused renderer tests to verify they fail**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
 ```
 
 Expected:
 
 - The tavern renderer test fails because shared dialogue still emits right-side portrait markup.
 - The temple renderer test fails because idle mode still emits `c-grain-shop-idle-owner`.
 
-- [ ] **Step 3: Remove the ordinary right-side portrait from shared dialogue**
+- [x] **Step 3: Remove the ordinary right-side portrait from shared dialogue**
 
 In `src/ui/views/house/house-shared-view.ts`, update `renderHouseDialogue()` so the footer returns only text content for ordinary house dialogue:
 
 ```ts
 export function renderHouseDialogue(
   viewModel: HouseModuleViewModel,
   options: DialogueOptions = {}
 ): string {
   if (viewModel.dialogue == null) {
     return "";
@@ -591,21 +595,21 @@ export function renderHouseDialogue(
             : `<p class="c-grain-shop-dialogue__hint">${viewModel.dialogue.advanceHintText}</p>`
         }
       </div>
     </footer>
   `;
 }
 ```
 
 If the exact Chinese default aria label must stay byte-for-byte compatible with the existing mojibake source, keep the existing `ariaLabel` fallback string and only remove the portrait block.
 
-- [ ] **Step 4: Remove temple idle owner rendering**
+- [x] **Step 4: Remove temple idle owner rendering**
 
 In `src/ui/views/house/temple-house-view.ts`, remove `renderHouseIdleOwner` from the import list and replace the owner-splitting block:
 
 ```ts
   const isMeeting = viewModel.standbyRoster.some(
     (actor) => actor.isSelected != null
   );
   const isIdle = viewModel.dialogue == null;
 ```
 
@@ -618,34 +622,34 @@ Keep the non-meeting roster rendering pointed at `viewModel.standbyRoster`:
               includeSelectedState: false,
               renderSecondaryText: (actor) =>
                 actor.title == null
                   ? ""
                   : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
             })
 ```
 
 Remove the conditional block that calls `renderHouseIdleOwner(...)`.
 
-- [ ] **Step 5: Run focused renderer tests**
+- [x] **Step 5: Run focused renderer tests**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
 ```
 
 Expected:
 
 - Both renderer tests pass.
 
-- [ ] **Step 6: Commit Task 3**
+- [x] **Step 6: Commit Task 3**
 
 Run:
 
 ```bash
 git add src/ui/views/house/house-shared-view.ts src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs
 git commit -m "refactor: render house primary actors in roster"
 ```
 
 Expected:
 
@@ -655,76 +659,76 @@ Expected:
 
 **Files:**
 - Modify: `docs/special-house-interface.md`
 - Modify: `docs/change-log.md`
 - Modify: `docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md`
 
 **Interfaces:**
 - Consumes: implementation from Tasks 1-3.
 - Produces: updated shared house contract documentation, change log, and plan execution state.
 
-- [ ] **Step 1: Update the house interface contract**
+- [x] **Step 1: Update the house interface contract**
 
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
 
-- [ ] **Step 2: Update the change log**
+- [x] **Step 2: Update the change log**
 
 Add this entry at the top of `docs/change-log.md` under the current heading/list:
 
 ```md
 - House primary actors now follow a shared flow: houses with `defaultCharacterId` enter through primary-actor dialogue, keep that actor first in `standbyRoster`, and render ordinary house dialogue without a separate right-side owner portrait. Temple abbot and tavern boss behavior now use the same rule as other special houses.
 ```
 
-- [ ] **Step 3: Run focused verification**
+- [x] **Step 3: Run focused verification**
 
 Run:
 
 ```bash
 npm run build:test
 node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
 ```
 
 Expected:
 
 - Build test succeeds.
 - All tests matching `primary house actor` pass.
 
-- [ ] **Step 4: Run full verification**
+- [x] **Step 4: Run full verification**
 
 Run:
 
 ```bash
 npm run typecheck
 npm test
 npm run lint:plans
 ```
 
 Expected:
 
 - All commands exit with code 0.
 
-- [ ] **Step 5: Update this plan execution state**
+- [x] **Step 5: Update this plan execution state**
 
 Update the top of this file:
 
 ```md
 ## Execution State
 
 - Status: `completed-but-open`
 - Last Updated: `2026-07-15`
 - Current Focus: `Implementation complete; closeout gates remain.`
 - Next Step: `Sync project progress, prepare structured closeout, push, then mark closed only after push succeeds.`
@@ -734,58 +738,57 @@ Update the top of this file:
 
 Append this progress log entry:
 
 ```md
 - 2026-07-15
   - Summary: `Implemented shared primary actor roster ordering, migrated temple and tavern presentation, removed ordinary right-side house owner portrait rendering, and updated shared house docs.`
   - Verification: `npm run typecheck; npm test; npm run lint:plans`
   - Next: `Perform structured closeout, synchronize project-progress, and push.`
 ```
 
-- [ ] **Step 6: Commit Task 4**
+- [x] **Step 6: Commit Task 4**
 
 Run:
 
 ```bash
 git add docs/special-house-interface.md docs/change-log.md docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
 git commit -m "docs: document house primary actor flow"
 ```
 
 Expected:
 
 - Commit succeeds and contains docs plus this plan update only.
 
 ## Exit Check
 
-- [ ] Temple daily `standbyRoster[0]` is the temple `defaultCharacterId`.
-- [ ] Tavern greeting/open `standbyRoster[0]` is the tavern `defaultCharacterId`.
-- [ ] Ordinary house dialogue no longer emits a separate right-side portrait container.
-- [ ] Temple ordinary daily view no longer emits a right-side idle owner card.
-- [ ] `docs/special-house-interface.md` documents the primary actor roster rule.
-- [ ] `docs/change-log.md` records the shared flow change.
-- [ ] `src/main.ts` has no new house-specific business branch for this work.
+- [x] Temple daily `standbyRoster[0]` is the temple `defaultCharacterId`.
+- [x] Tavern greeting/open `standbyRoster[0]` is the tavern `defaultCharacterId`.
+- [x] Ordinary house dialogue no longer emits a separate right-side portrait container.
+- [x] Temple ordinary daily view no longer emits a right-side idle owner card.
+- [x] `docs/special-house-interface.md` documents the primary actor roster rule.
+- [x] `docs/change-log.md` records the shared flow change.
+- [x] `src/main.ts` has no new house-specific business branch for this work.
 - [ ] Project progress sync is updated if this child state changes.
-- [ ] Closeout block is added before the child is marked `closed`.
+- [x] Closeout block is added before the child is marked `closed`.
 
 ## Completion Checklist
 
-- [ ] Plan checkboxes updated
-- [ ] `Execution State` updated
-- [ ] `Progress Log` updated
-- [ ] Verification recorded
+- [x] Plan checkboxes updated
+- [x] `Execution State` updated
+- [x] `Progress Log` updated
+- [x] Verification recorded
 
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
-
