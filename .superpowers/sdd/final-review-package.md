# Final Review Package: House Primary Actor Flow

Base: 9e4feb4cd871c2e25f8ec422d4dd05c449b65487
Head: 1b44e16a179fa6973dab72558a269d19e8732fea

## Commits
1b44e16a docs: document house primary actor flow
58535af4 fix: keep temple daily roster out of meeting layout
f74bc625 refactor: render house primary actors in roster
ff376972 fix: include temple abbot in meeting roster
6a0900ee feat: keep house primary actors in roster
b9bd39b6 test: add house primary actor roster helper

## Stat
 .superpowers/sdd/task-2-report.md                  |  92 +++++++++
 .superpowers/sdd/task-3-report.md                  |  97 ++++++++++
 docs/change-log.md                                 |   2 +
 docs/special-house-interface.md                    |  13 ++
 .../2026-07-15-house-primary-actor-flow-plan.md    |  85 +++++----
 .../house-modules/tavern/tavern-house-module.ts    |  29 +--
 .../temple-house/temple-house-house-module.ts      |  92 ++++-----
 .../house/house-primary-actor-roster.ts            |  35 ++++
 src/ui/views/house/house-shared-view.ts            |  25 +--
 src/ui/views/house/temple-house-view.ts            |  38 +---
 tests/robustness.test.cjs                          | 206 +++++++++++++++++++++
 11 files changed, 566 insertions(+), 148 deletions(-)

## Diff
diff --git a/.superpowers/sdd/task-2-report.md b/.superpowers/sdd/task-2-report.md
new file mode 100644
index 00000000..2e204e22
--- /dev/null
+++ b/.superpowers/sdd/task-2-report.md
@@ -0,0 +1,92 @@
+# Task 2 Report: Temple And Tavern View Models
+
+## Status
+
+DONE
+
+## Scope
+
+Modified only the Task 2 implementation files:
+
+- `src/application/house-modules/temple-house/temple-house-house-module.ts`
+- `src/application/house-modules/tavern/tavern-house-module.ts`
+- `tests/robustness.test.cjs`
+
+The report file was created as requested and was not included in the original Task 2 implementation commit.
+
+## TDD Evidence
+
+Added the requested failing tests to `tests/robustness.test.cjs`:
+
+- `primary house actor appears first in temple daily roster during greeting`
+- `primary house actor appears first in tavern roster during greeting`
+
+Red run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
+```
+
+Result: build succeeded; focused test run failed as expected on Tavern because the greeting roster was empty and `viewModel.standbyRoster[0]?.characterId` was `undefined` instead of `char.kulan_innkeeper`.
+
+Green run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
+```
+
+Result: build succeeded; focused test run passed with 298 passing tests and 0 failures under the name pattern.
+
+## Implementation Notes
+
+Tavern `selectViewModel()` now imports and uses `orderHouseStandbyRoster()`, creates a stable boss actor from `defaultCharacterId ?? tavernBossProfile.actorId`, and returns that actor in `standbyRoster` during greeting/open dialogue as well as idle.
+
+Temple `selectViewModel()` now builds the standby actor list before returning, preserves meeting participant order, and applies `orderHouseStandbyRoster()` for non-meeting daily view models so the default abbot actor is first.
+
+No `main.ts` house-specific branch was added, no application HTML strings were introduced, and no persistent gameplay state was changed.
+
+## Commit
+
+Created commit:
+
+- `6a0900ee feat: keep house primary actors in roster`
+
+## Concerns
+
+None.
+
+## Reviewer Fix: Temple Meeting Primary Actor
+
+Reviewer finding addressed:
+
+- Temple meeting view models omitted the abbot/default primary actor because `getTempleMeetingParticipantIds()` filtered the abbot out and meeting mode bypassed `orderHouseStandbyRoster()`.
+
+Test coverage added:
+
+- `primary house actor appears first in temple meeting roster with player still selected`
+
+Red run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
+```
+
+Result: build succeeded; focused test run failed as expected because the meeting roster started with `char.player` instead of `char.kulan_temple_abbot`.
+
+Fix:
+
+- Temple meeting participant ids now include the abbot/default primary actor.
+- Temple `selectViewModel()` now applies `orderHouseStandbyRoster()` to meeting and daily rosters.
+- The existing meeting player selected state remains on the player actor, and non-primary meeting participants remain in the roster.
+
+Green run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
+```
+
+Result: build succeeded; focused test run passed with 299 passing tests and 0 failures under the name pattern.
diff --git a/.superpowers/sdd/task-3-report.md b/.superpowers/sdd/task-3-report.md
new file mode 100644
index 00000000..f0dd098b
--- /dev/null
+++ b/.superpowers/sdd/task-3-report.md
@@ -0,0 +1,97 @@
+# Task 3 Report: House Renderer Cleanup
+
+Status: DONE
+
+## Scope
+
+Modified only the Task 3 implementation files:
+
+- `src/ui/views/house/house-shared-view.ts`
+- `src/ui/views/house/temple-house-view.ts`
+- `tests/robustness.test.cjs`
+
+## TDD Evidence
+
+Added the focused renderer regression tests in `tests/robustness.test.cjs`:
+
+- `primary house actor dialogue does not render separate right-side portrait`
+- `temple daily view keeps abbot in left roster instead of right owner slot`
+
+Red run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
+```
+
+Result: exit 1, 299 pass / 2 fail.
+
+- Tavern failed as expected because `renderHouseDialogue()` emitted `c-grain-shop-dialogue__npc` and `c-grain-shop-portrait`.
+- Temple failed before the expected `c-grain-shop-idle-owner` assertion because the current daily idle view model keeps the abbot marked `isSelected: true`, so the renderer classified the idle daily roster as a meeting roster. This exposed a branch mismatch in the renderer's meeting heuristic.
+
+Green run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
+```
+
+Result: exit 0, 301 pass / 0 fail.
+
+Additional check:
+
+```bash
+git diff --check -- src/ui/views/house/house-shared-view.ts src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs
+```
+
+Result: exit 0. Git printed CRLF conversion warnings only.
+
+## Implementation Notes
+
+- Removed the ordinary right-side dialogue portrait block from shared house dialogue rendering.
+- Kept character speaker names inside the dialogue text block.
+- Removed temple idle owner splitting and right-side idle owner rendering.
+- Kept the non-meeting temple roster rendering against `viewModel.standbyRoster`.
+- Adjusted temple meeting detection so idle daily view models with a selected primary actor still render as daily idle roster, not meeting roster.
+
+## Concerns
+
+None after the reviewer follow-up fix. The earlier concern about daily selected primary actors has been resolved by requiring meeting-style selection state across the full roster.
+
+## Reviewer Follow-Up Fix
+
+Reviewer finding addressed:
+
+- Daily temple `open` view models still have dialogue and a selected primary actor, so the previous `!isIdle && isSelected != null` heuristic still routed them through `renderMeetingRoster()`.
+
+Implementation:
+
+- Updated `tests/robustness.test.cjs` so the temple renderer coverage uses a non-idle daily `open` view model.
+- Added an assertion that daily temple markup does not include `c-keep-house-meeting`.
+- Updated `src/ui/views/house/temple-house-view.ts` so meeting rendering requires meeting-style roster selection data: every roster actor must carry `isSelected` state and at least one actor must be selected. Daily dialogue rosters only mark the active speaker, so they now stay on `renderHouseStandbyRoster()`.
+
+Red run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
+```
+
+Result: build exited 0; focused test exited 1, 300 pass / 1 fail. The non-idle daily temple test failed because markup rendered `c-keep-house-meeting` and omitted `c-grain-shop-npc-idle`.
+
+Green run:
+
+```bash
+npm run build:test
+node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
+```
+
+Result: build exited 0; focused test exited 0, 301 pass / 0 fail.
+
+Additional check:
+
+```bash
+git diff --check -- src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs .superpowers/sdd/task-3-report.md
+```
+
+Result: exit 0. Git printed CRLF conversion warnings for the touched source/test files only.
diff --git a/docs/change-log.md b/docs/change-log.md
index 8bfefa7f..1acd63be 100644
--- a/docs/change-log.md
+++ b/docs/change-log.md
@@ -1,12 +1,14 @@
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
diff --git a/docs/special-house-interface.md b/docs/special-house-interface.md
index 0aca7ee0..c5fe3515 100644
--- a/docs/special-house-interface.md
+++ b/docs/special-house-interface.md
@@ -570,16 +570,29 @@ type HouseModuleViewModel = {
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
 
diff --git a/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md b/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
index 1c9d6af1..acc8a93a 100644
--- a/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
+++ b/docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
@@ -5,29 +5,33 @@
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
@@ -106,17 +110,17 @@
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
@@ -154,30 +158,30 @@ test("primary house actor roster helper deduplicates actors without losing the f
 
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
@@ -209,31 +213,31 @@ export function orderHouseStandbyRoster(input: {
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
 
@@ -247,17 +251,17 @@ Expected:
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
@@ -311,30 +315,30 @@ test("primary house actor appears first in tavern roster during greeting", () =>
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
@@ -357,17 +361,17 @@ Use it in the returned view model:
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
@@ -425,30 +429,30 @@ const orderedStandbyActors =
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
 
@@ -462,17 +466,17 @@ Expected:
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
@@ -534,31 +538,31 @@ test("temple daily view keeps abbot in left roster instead of right owner slot",
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
@@ -593,17 +597,17 @@ export function renderHouseDialogue(
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
@@ -620,30 +624,30 @@ Keep the non-meeting roster rendering pointed at `viewModel.standbyRoster`:
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
 
@@ -657,17 +661,17 @@ Expected:
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
 
@@ -676,53 +680,53 @@ Rules:
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
@@ -736,56 +740,55 @@ Append this progress log entry:
 
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
diff --git a/src/application/house-modules/tavern/tavern-house-module.ts b/src/application/house-modules/tavern/tavern-house-module.ts
index 7a5fa638..5deef3ed 100644
--- a/src/application/house-modules/tavern/tavern-house-module.ts
+++ b/src/application/house-modules/tavern/tavern-house-module.ts
@@ -25,16 +25,17 @@ import type {
 } from "../../../domain/house-module";
 import {
   getTavernDrinkCountVariableKey,
   getTavernTimeVariableKey,
   type TavernWorkOffer,
 } from "../../../domain/tavern";
 import { defaultRuntimeContent } from "../../content/default-runtime-content";
 import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
+import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 import {
   advanceTavernGambleMeldCountdown,
   advanceTavernLongPublicReveal,
   advanceTavernGambleNpcThinking,
   canHumanLongHu,
   clearTavernGamblePlaySlot,
   confirmSelectedTavernGambleDiscards,
   confirmTavernGamblePlayGroup,
@@ -2078,42 +2079,42 @@ export const tavernHouseModule: HouseModuleDefinition<"tavern"> = {
       getTavernDrinkCountVariableKey(input.houseDefinition.id),
       0
     );
     const capacity = getWorkCapacity(playerCharacter.stats.fame);
     const isIdle = sessionState.dialoguePhase === "idle";
     const isGreeting = sessionState.dialoguePhase === "greeting";
     const isOpen = sessionState.dialoguePhase === "open";
     const firstAvailableOffer = lists.availableOffers[0] ?? null;
+    const tavernPrimaryActorId =
+      input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId;
+    const tavernBossActor = {
+      characterId: tavernPrimaryActorId,
+      name: tavernBossProfile.name,
+      title: tavernBossProfile.title,
+      actionId: "open-boss-dialogue",
+      isSelected: !isIdle,
+    };
 
     return {
       moduleId: "tavern",
       houseId: input.houseDefinition.id,
       sceneTitle: "酒馆",
       sceneSubtitle: "找活 / 买酒 / 下注",
-      standbyRoster: isIdle
-        ? [
-            {
-              characterId:
-                input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
-              name: tavernBossProfile.name,
-              title: tavernBossProfile.title,
-              actionId: "open-boss-dialogue",
-              isSelected: true,
-            },
-          ]
-        : [],
+      standbyRoster: orderHouseStandbyRoster({
+        primaryCharacterId: tavernPrimaryActorId,
+        actors: [tavernBossActor],
+      }),
       dialogue:
         isIdle
           ? null
           : {
               mode: "character",
               speakerName: tavernBossProfile.name,
-              characterId:
-                input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
+              characterId: tavernPrimaryActorId,
               position: "right",
               textLines: sessionState.dialogueLines,
               advanceActionId: isGreeting ? "advance-greeting" : null,
               advanceHintText: isGreeting ? "点击继续" : null,
             },
       actionContainer: !isOpen
         ? null
         : sessionState.workPanelMode === "closed"
diff --git a/src/application/house-modules/temple-house/temple-house-house-module.ts b/src/application/house-modules/temple-house/temple-house-house-module.ts
index 93f190ff..62aadb5e 100644
--- a/src/application/house-modules/temple-house/temple-house-house-module.ts
+++ b/src/application/house-modules/temple-house/temple-house-house-module.ts
@@ -63,16 +63,17 @@ import {
   canAffordActivityCost,
   spendPlayerStamina,
 } from "../../player/player-stamina";
 import {
   convertHouseActivityDaysToSegments,
   formatHouseActivityCostLine,
   getHouseWorkDurationDays,
 } from "../../house/house-activity-costs";
+import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 import { HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS } from "../../house/map-auto-advance";
 import {
   createHousePlayableRuntimeState,
   readHousePlayableSessionState,
 } from "../../playables/house-playable-runtime-bridge";
 import {
   markLateCouncilAttendancePenaltyProcessed,
   resolveLateCouncilAttendance,
@@ -1631,17 +1632,18 @@ function getDailyTempleTasks(
 function getTempleMeetingParticipantIds(
   houseCharacterIds: string[],
   playerCharacterId: string,
   abbotCharacterId: string
 ): string[] {
   return Array.from(
     new Set([
       playerCharacterId,
-      ...houseCharacterIds.filter((characterId) => characterId !== abbotCharacterId),
+      abbotCharacterId,
+      ...houseCharacterIds,
     ])
   );
 }
 
 function getTempleContributionEntries(
   gameState: GameState,
   playerCharacter: CharacterDefinition,
   seniorMonkCharacter: CharacterDefinition
@@ -4415,71 +4417,77 @@ export const templeHouseHouseModule: HouseModuleDefinition<"temple-house"> = {
       input.houseDefinition.characterIds,
       input.playerCharacterId,
       abbotCharacter.id
     );
     const standbyCharacterIds =
       sessionState.mode === "meeting"
         ? meetingParticipantIds
         : input.houseDefinition.characterIds;
+    const standbyActors = standbyCharacterIds.map((characterId) => {
+      const characterDefinition = input.characterDefinitions.find(
+        (candidateCharacter) => candidateCharacter.id === characterId
+      );
+      assertExists(
+        characterDefinition,
+        `Temple standby character not found for id "${characterId}".`
+      );
+      return {
+        characterId: characterDefinition.id,
+        name: characterDefinition.name,
+        ...(sessionState.mode === "daily" &&
+        characterDefinition.id === abbotCharacter.id
+          ? { actionId: "open-abbot-dialogue" }
+          : {}),
+        ...(sessionState.mode === "meeting" &&
+        characterDefinition.id === input.playerCharacterId
+          ? { isSelected: true }
+          : sessionState.mode === "meeting"
+            ? { isSelected: false }
+            : characterDefinition.id === dialogueSpeaker.id
+              ? { isSelected: true }
+              : {}),
+        ...(characterDefinition.id === abbotCharacter.id
+          ? {
+              avatarArtClassName: "c-temple-house-avatar-art--abbot",
+              portraitArtClassName: "c-temple-house-portrait-art--abbot",
+            }
+          : characterDefinition.id === input.playerCharacterId
+            ? {
+                avatarArtClassName: "c-temple-house-avatar-art--player",
+                portraitArtClassName: "c-temple-house-portrait-art--player",
+              }
+            : {
+                avatarArtClassName: "c-temple-house-avatar-art--senior-monk",
+                portraitArtClassName: "c-temple-house-portrait-art--senior-monk",
+              }),
+        ...(characterDefinition.title == null
+          ? {}
+          : { title: characterDefinition.title }),
+      };
+    });
+    const orderedStandbyActors = orderHouseStandbyRoster({
+      primaryCharacterId: input.houseDefinition.defaultCharacterId,
+      actors: standbyActors,
+    });
 
     return {
       moduleId: "temple-house",
       houseId: input.houseDefinition.id,
       sceneTitle: input.houseDefinition.name,
       sceneSubtitle: isMonkStoryStage(nextState)
         ? resolveTempleText(
             input.textEntriesById,
             "runtime.zhu_yuanzhang.temple.scene.monk.subtitle"
           )
         : resolveTempleText(
             input.textEntriesById,
             "runtime.zhu_yuanzhang.temple.scene.daily.subtitle"
           ),
-      standbyRoster: standbyCharacterIds.map((characterId) => {
-          const characterDefinition = input.characterDefinitions.find(
-            (candidateCharacter) => candidateCharacter.id === characterId
-          );
-          assertExists(
-            characterDefinition,
-            `Temple standby character not found for id "${characterId}".`
-          );
-          return {
-            characterId: characterDefinition.id,
-            name: characterDefinition.name,
-            ...(sessionState.mode === "daily" &&
-            characterDefinition.id === abbotCharacter.id &&
-            sessionState.dialoguePhase === "idle"
-              ? { actionId: "open-abbot-dialogue" }
-              : {}),
-            ...(sessionState.mode === "meeting" &&
-            characterDefinition.id === input.playerCharacterId
-              ? { isSelected: true }
-              : sessionState.mode === "meeting"
-                ? { isSelected: false }
-                : {}),
-            ...(characterDefinition.id === abbotCharacter.id
-              ? {
-                  avatarArtClassName: "c-temple-house-avatar-art--abbot",
-                  portraitArtClassName: "c-temple-house-portrait-art--abbot",
-                }
-              : characterDefinition.id === input.playerCharacterId
-                ? {
-                    avatarArtClassName: "c-temple-house-avatar-art--player",
-                    portraitArtClassName: "c-temple-house-portrait-art--player",
-                  }
-                : {
-                    avatarArtClassName: "c-temple-house-avatar-art--senior-monk",
-                    portraitArtClassName: "c-temple-house-portrait-art--senior-monk",
-                  }),
-            ...(characterDefinition.title == null
-              ? {}
-              : { title: characterDefinition.title }),
-          };
-        }),
+      standbyRoster: orderedStandbyActors,
       dialogue:
         sessionState.dialoguePhase === "idle"
           ? null
           : {
               mode: "character",
               speakerName: dialogueSpeaker.name,
               characterId: dialogueSpeaker.id,
               portraitArtClassName: dialoguePortraitArtClassName,
diff --git a/src/application/house/house-primary-actor-roster.ts b/src/application/house/house-primary-actor-roster.ts
new file mode 100644
index 00000000..eebb6276
--- /dev/null
+++ b/src/application/house/house-primary-actor-roster.ts
@@ -0,0 +1,35 @@
+import type { HouseStandbyActorViewModel } from "../../domain/house-module";
+
+export function orderHouseStandbyRoster(input: {
+  primaryCharacterId: string | null;
+  actors: HouseStandbyActorViewModel[];
+}): HouseStandbyActorViewModel[] {
+  const seenCharacterIds = new Set<string>();
+  const dedupedActors: HouseStandbyActorViewModel[] = [];
+
+  for (const actor of input.actors) {
+    if (seenCharacterIds.has(actor.characterId)) {
+      continue;
+    }
+    seenCharacterIds.add(actor.characterId);
+    dedupedActors.push(actor);
+  }
+
+  if (input.primaryCharacterId == null) {
+    return dedupedActors;
+  }
+
+  const primaryActor = dedupedActors.find(
+    (actor) => actor.characterId === input.primaryCharacterId
+  );
+  if (primaryActor == null) {
+    return dedupedActors;
+  }
+
+  return [
+    primaryActor,
+    ...dedupedActors.filter(
+      (actor) => actor.characterId !== input.primaryCharacterId
+    ),
+  ];
+}
diff --git a/src/ui/views/house/house-shared-view.ts b/src/ui/views/house/house-shared-view.ts
index d02358b0..5f178c76 100644
--- a/src/ui/views/house/house-shared-view.ts
+++ b/src/ui/views/house/house-shared-view.ts
@@ -252,51 +252,38 @@ export function renderHouseDialogue(
 ): string {
   if (viewModel.dialogue == null) {
     return "";
   }
 
   const clickable = viewModel.dialogue.advanceActionId != null;
   const footerClassName = options.footerClassName ?? "c-grain-shop-dialogue";
   const ariaLabel = options.ariaLabel ?? "对话";
-  const isNarration = viewModel.dialogue.mode === "narration";
 
   return `
     <footer class="${footerClassName}" aria-label="${ariaLabel}">
       <div
         class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
         ${clickable ? `data-house-action="${viewModel.dialogue.advanceActionId}" role="button" tabindex="0"` : ""}
       >
+        ${
+          viewModel.dialogue.mode === "character" &&
+          viewModel.dialogue.speakerName != null
+            ? `<p class="c-grain-shop-dialogue__speaker">${viewModel.dialogue.speakerName}</p>`
+            : ""
+        }
         ${viewModel.dialogue.textLines
           .map((line) => `<p class="c-grain-shop-dialogue__line">${line}</p>`)
           .join("")}
         ${
           viewModel.dialogue.advanceHintText == null
             ? ""
             : `<p class="c-grain-shop-dialogue__hint">${viewModel.dialogue.advanceHintText}</p>`
         }
       </div>
-      ${
-        isNarration
-          ? ""
-          : `
-            <div class="c-grain-shop-dialogue__npc">
-              <div class="c-grain-shop-portrait" aria-hidden="true">
-                ${
-                  viewModel.dialogue.portraitImageUrl == null
-                    ? `<span class="c-grain-shop-portrait__art ${viewModel.dialogue.portraitArtClassName ?? ""}"></span>`
-                    : `<img class="c-grain-shop-portrait__image" src="${viewModel.dialogue.portraitImageUrl}" alt="">`
-                }
-              </div>
-              <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
-                ${viewModel.dialogue.speakerName ?? ""}
-              </p>
-            </div>
-          `
-      }
     </footer>
   `;
 }
 
 export function renderHouseIdleOwner(
   actor: HouseStandbyActorViewModel | null,
   options: IdleOwnerOptions = {}
 ): string {
diff --git a/src/ui/views/house/temple-house-view.ts b/src/ui/views/house/temple-house-view.ts
index ebf8758d..cd16427f 100644
--- a/src/ui/views/house/temple-house-view.ts
+++ b/src/ui/views/house/temple-house-view.ts
@@ -6,17 +6,16 @@ import {
   FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
   FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
 } from "../../../domain/activity-session";
 import {
   renderHouseActionContainer,
   renderHouseAlertOverlay,
   renderHouseDialogue,
   renderHouseCharacterCard,
-  renderHouseIdleOwner,
   renderHouseLeaveButton,
   renderHouseQuantityConfirmOverlay,
   renderHouseStandbyRoster,
 } from "./house-shared-view";
 
 const templePopupOverlayAttribute =
   ' data-house-overlay-variant="temple-utility-popup"';
 const templePopupModalClassName =
@@ -520,61 +519,36 @@ function renderMeetingRoster(viewModel: HouseModuleViewModel): string {
           `;
         })
         .join("")}
     </section>
   `;
 }
 
 export function renderTempleHouseView(viewModel: HouseModuleViewModel): string {
-  const isMeeting = viewModel.standbyRoster.some(
-    (actor) => actor.isSelected != null
-  );
-  const isIdle = viewModel.dialogue == null;
-  const ownerActor =
-    viewModel.standbyRoster.find((actor) => actor.actionId != null) ?? null;
-  const idleOwnerActor = isMeeting || !isIdle ? null : ownerActor;
-  const sideActors =
-    ownerActor == null
-      ? viewModel.standbyRoster
-      : viewModel.standbyRoster.filter(
-          (actor) => actor.characterId !== ownerActor.characterId
-        );
+  const isMeeting =
+    viewModel.standbyRoster.length > 0 &&
+    viewModel.standbyRoster.every((actor) => actor.isSelected != null) &&
+    viewModel.standbyRoster.some((actor) => actor.isSelected === true);
   return `
     <section class="view-house-grain-shop view-house-temple" data-house-module="${viewModel.moduleId}">
       ${renderHouseActionContainer(viewModel)}
       ${
         isMeeting
           ? renderMeetingRoster(viewModel)
-          : renderHouseStandbyRoster(
-              {
-                ...viewModel,
-                standbyRoster: sideActors,
-              },
-              {
+          : renderHouseStandbyRoster(viewModel, {
                 asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
                 asideLabel: "寺中人物",
                 includeSelectedState: false,
                 renderSecondaryText: (actor) =>
                   actor.title == null
                     ? ""
                     : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
-              }
-            )
+            })
       }
       ${renderHouseDialogue(viewModel, {
         footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue c-temple-house-dialogue",
       })}
-      ${
-        isMeeting || !isIdle
-          ? ""
-          : renderHouseIdleOwner(idleOwnerActor, {
-              renderSecondaryText: (actor) =>
-                actor.title == null
-                  ? ""
-                  : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
-            })
-      }
       ${isMeeting ? "" : renderHouseLeaveButton(viewModel)}
       ${renderOverlay(viewModel.overlay)}
     </section>
   `;
 }
diff --git a/tests/robustness.test.cjs b/tests/robustness.test.cjs
index b41ea1e1..cadf5e31 100644
--- a/tests/robustness.test.cjs
+++ b/tests/robustness.test.cjs
@@ -38,16 +38,19 @@ const {
   keepHouseHouseModule,
 } = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
 const {
   templeHouseHouseModule,
 } = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
 const {
   renderTempleHouseView,
 } = require("../.test-dist/ui/views/house/temple-house-view.js");
+const {
+  renderTavernHouseView,
+} = require("../.test-dist/ui/views/house/tavern-house-view.js");
 const {
   marketHouseHouseModule,
 } = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
 const {
   medicineHouseHouseModule,
 } = require("../.test-dist/application/house-modules/medicine-house/medicine-house-house-module.js");
 const {
   teaHouseHouseModule,
@@ -97,16 +100,19 @@ const {
 const {
   getCampaignMapFogViewState,
   isCampaignMapCoordinateRevealed,
   revealCampaignMapAroundCoordinate,
 } = require("../.test-dist/application/navigation/campaign-map-exploration.js");
 const {
   createInitialGrainShopSessionState,
 } = require("../.test-dist/application/house-modules/grain-shop/grain-shop-session-state.js");
+const {
+  orderHouseStandbyRoster,
+} = require("../.test-dist/application/house/house-primary-actor-roster.js");
 const {
   equipValuableItem,
   getVisibleOwnedCards,
   getVisibleValuables,
   resolveSelectedCardId,
   resolveSelectedValuableId,
 } = require("../.test-dist/application/inventory/inventory-selection.js");
 const {
@@ -3784,16 +3790,216 @@ test("grain trade fails when the player cannot afford the purchase", () => {
   if (result.ok) {
     return;
   }
 
   assert.equal(result.errorTitle.length > 0, true);
   assert.equal(result.errorMessage.length > 0, true);
 });
 
+test("primary house actor roster helper places the default actor first", () => {
+  const roster = orderHouseStandbyRoster({
+    primaryCharacterId: "char.owner",
+    actors: [
+      { characterId: "char.guest", name: "Guest" },
+      { characterId: "char.owner", name: "Owner", actionId: "open-owner-dialogue" },
+      { characterId: "char.extra", name: "Extra" },
+    ],
+  });
+
+  assert.deepEqual(
+    roster.map((actor) => actor.characterId),
+    ["char.owner", "char.guest", "char.extra"]
+  );
+  assert.equal(roster[0].actionId, "open-owner-dialogue");
+});
+
+test("primary house actor roster helper deduplicates actors without losing the first primary model", () => {
+  const roster = orderHouseStandbyRoster({
+    primaryCharacterId: "char.owner",
+    actors: [
+      { characterId: "char.owner", name: "Owner", actionId: "open-owner-dialogue" },
+      { characterId: "char.guest", name: "Guest" },
+      { characterId: "char.owner", name: "Owner Duplicate" },
+      { characterId: "char.guest", name: "Guest Duplicate" },
+    ],
+  });
+
+  assert.deepEqual(
+    roster.map((actor) => actor.name),
+    ["Owner", "Guest"]
+  );
+});
+
+test("primary house actor appears first in temple daily roster during greeting", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = templeHouseHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: templeHouse,
+    playerCharacterId,
+  });
+  const viewModel = templeHouseHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: templeHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.equal(viewModel.dialogue?.characterId, templeHouse.defaultCharacterId);
+  assert.equal(viewModel.standbyRoster[0]?.characterId, templeHouse.defaultCharacterId);
+  assert.ok(
+    viewModel.standbyRoster.some(
+      (actor) => actor.characterId === templeHouse.defaultCharacterId
+    )
+  );
+});
+
+test("primary house actor appears first in temple meeting roster with player still selected", () => {
+  const monkCharacters = createPrototypeCharactersForStoryStage(
+    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
+  );
+  const baseState = createMonkStageState();
+  const entered = templeHouseHouseModule.enter({
+    gameState: {
+      ...baseState,
+      runtime: {
+        ...baseState.runtime,
+        variables: {
+          ...baseState.runtime.variables,
+          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
+        },
+      },
+    },
+    characterDefinitions: monkCharacters,
+    houseDefinition: templeHouse,
+    playerCharacterId,
+  });
+  const viewModel = templeHouseHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: templeHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.equal(entered.sessionState?.mode, "meeting");
+  assert.equal(viewModel.standbyRoster[0]?.characterId, templeHouse.defaultCharacterId);
+  assert.ok(
+    viewModel.standbyRoster.some(
+      (actor) => actor.characterId === templeHouse.defaultCharacterId
+    )
+  );
+  assert.equal(
+    viewModel.standbyRoster.find((actor) => actor.characterId === playerCharacterId)
+      ?.isSelected,
+    true
+  );
+  assert.ok(
+    viewModel.standbyRoster.some(
+      (actor) =>
+        actor.characterId !== templeHouse.defaultCharacterId &&
+        actor.characterId !== playerCharacterId
+    )
+  );
+});
+
+test("primary house actor appears first in tavern roster during greeting", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = tavernHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: tavernHouse,
+    playerCharacterId,
+  });
+  const viewModel = tavernHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: tavernHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.equal(viewModel.dialogue?.characterId, tavernHouse.defaultCharacterId);
+  assert.equal(viewModel.standbyRoster[0]?.characterId, tavernHouse.defaultCharacterId);
+  assert.ok(viewModel.standbyRoster[0]?.actionId);
+});
+
+test("primary house actor dialogue does not render separate right-side portrait", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = tavernHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: tavernHouse,
+    playerCharacterId,
+  });
+  const viewModel = tavernHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: tavernHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+  const markup = renderTavernHouseView(viewModel);
+
+  assert.match(markup, /c-grain-shop-dialogue__text/u);
+  assert.doesNotMatch(markup, /c-grain-shop-dialogue__npc/u);
+  assert.doesNotMatch(markup, /c-grain-shop-portrait/u);
+});
+
+test("temple daily view keeps abbot in left roster instead of meeting layout", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = templeHouseHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: templeHouse,
+    playerCharacterId,
+  });
+  const viewModel = templeHouseHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: templeHouse,
+    playerCharacterId,
+    sessionState: {
+      ...entered.sessionState,
+      dialoguePhase: "open",
+    },
+  });
+  const markup = renderTempleHouseView(viewModel);
+
+  assert.match(markup, /c-grain-shop-npc-idle/u);
+  assert.doesNotMatch(markup, /c-keep-house-meeting/u);
+  assert.doesNotMatch(markup, /c-grain-shop-idle-owner/u);
+});
+
 test("house enter and leave keep session wiring and interval side effects consistent", () => {
   const state = createBaseState();
   const enterResult = grainShopHouseModule.enter({
     gameState: state,
     characterDefinitions: prototypeCharacters,
     houseDefinition: grainShopHouse,
     playerCharacterId,
   });
