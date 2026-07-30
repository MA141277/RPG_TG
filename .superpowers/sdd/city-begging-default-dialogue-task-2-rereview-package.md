# Review package

Base: 41d533d6
Head: bf9ccbed

## Commits

bf9ccbed Fix city begging default option lock
3cdc28a6 Add city begging default dialogue reducer

## Stat

 .../city-begging-default-dialogue-task-2-report.md | 102 +++++++++++++
 docs/change-log.md                                 |  14 ++
 src/application/app-shell.ts                       |   4 +-
 .../city-begging/city-begging-default-dialogue.ts  | 110 ++++++++++++++
 .../city-begging/city-begging-definition.ts        |  25 ++-
 src/core/runtime/playable-runtime.ts               |   2 +
 src/domain/city-begging-minigame.ts                |  20 +++
 tests/city-begging-default-runtime.test.cjs        | 167 +++++++++++++++++++++
 8 files changed, 438 insertions(+), 6 deletions(-)

## Diff

diff --git a/.superpowers/sdd/city-begging-default-dialogue-task-2-report.md b/.superpowers/sdd/city-begging-default-dialogue-task-2-report.md
new file mode 100644
index 00000000..a6abeec2
--- /dev/null
+++ b/.superpowers/sdd/city-begging-default-dialogue-task-2-report.md
@@ -0,0 +1,102 @@
+# Task 2 Report: Default Dialogue Runtime Reducer
+
+## Status
+
+DONE
+
+## Summary
+
+- Added the pure city-begging default-dialogue reducer/state module.
+- Added immutable state transitions for default launch, location selection, option selection, and thinking advancement.
+- Added city-begging launch support for `payload.mode === "default-dialogue"` while preserving legacy minigame launch as the default.
+- Kept action routing and settlement out of scope for Task 3.
+
+## Files Changed
+
+- `tests/city-begging-default-runtime.test.cjs`
+- `src/application/playables/city-begging/city-begging-default-dialogue.ts`
+- `src/domain/city-begging-minigame.ts`
+- `src/application/playables/city-begging/city-begging-definition.ts`
+- `src/application/app-shell.ts`
+- `src/core/runtime/playable-runtime.ts`
+
+## TDD Evidence
+
+Red check:
+
+```text
+npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
+```
+
+Expected failure observed:
+
+```text
+Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'D:\RPG_TG\src\application\playables\city-begging\city-begging-default-dialogue.ts'
+```
+
+Additional launch payload red check:
+
+```text
+AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
++ undefined
+- 'default-dialogue'
+```
+
+## Verification
+
+Targeted command:
+
+```text
+npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
+```
+
+Result:
+
+```text
+tests 6
+pass 6
+fail 0
+```
+
+## Notes
+
+- The reducer test uses the repo's established `.test-dist` import pattern after `build:test`; the initial direct `.ts` import red check proved the module was missing but conflicted with TypeScript emit for extensioned source dependencies.
+- No `src/main.ts` changes were made.
+- No Task 3 action routing or settlement behavior was implemented.
+
+## Review Fixes
+
+- Guarded `selectCityBeggingDefaultOption()` so option selection only applies from `phase === "encounter"` when a location is selected and no option/fixed result is already locked.
+- Added a focused reducer regression test covering invalid option selection and duplicate/change attempts after a fixed result is locked.
+- Added `docs/change-log.md` entry for the Task 2 default dialogue runtime/session wiring and result-lock behavior.
+
+## Review Fix TDD Evidence
+
+Red check:
+
+```text
+npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
+```
+
+Expected failure observed:
+
+```text
+AssertionError [ERR_ASSERTION]: Expected "actual" to be reference-equal to "expected":
+...
++   thinkingUntil: 3700
+-   thinkingUntil: 3600
+```
+
+Green check:
+
+```text
+npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
+```
+
+Result:
+
+```text
+tests 7
+pass 7
+fail 0
+```
diff --git a/docs/change-log.md b/docs/change-log.md
index db5b8ca8..79a7537a 100644
--- a/docs/change-log.md
+++ b/docs/change-log.md
@@ -1,14 +1,28 @@
 ﻿# 变更记录
 
 用于持续记录项目结构、公共契约、功能能力和开发规则的变化。
 
+## 2026-07-31 City Begging Default Dialogue Runtime
+
+### Added
+- 新增城中默认化缘 `default-dialogue` runtime reducer，用于纯状态方式启动默认化缘、选择地点、锁定固定吉凶选项并推进思考阶段。
+- 城中化缘 playable launch payload 现在支持 `mode: "default-dialogue"`，同时保留旧 minigame 默认启动路径。
+- 新增默认化缘 runtime 覆盖测试，锁定地点选择、固定结果锁定、启动 payload 接线，以及结果锁定后不能重复或改选选项。
+
+### Changed
+- `beggingMiniGameState` 的 runtime 形状扩展为 `CityBeggingPlayableState`，可以承载旧 minigame 状态或新的默认化缘 dialogue 状态。
+- 默认化缘选项选择现在只允许在 `encounter` 阶段、已有地点且尚未存在选项/固定结果时执行，避免已锁定结果被重复选择覆盖。
+
+### Impact
+- Task 3 可以在不改 `src/main.ts` 的前提下继续接入默认化缘动作路由与结算；当前切片只建立 runtime session 状态与 launch wiring。
+
 ## 2026-07-31 City Begging Default Content Contract
 
 ### Added
 - 新增 `src/content/playables/city-begging-default-content.ts`，以结构化 content table 保存濠州城默认化缘地点、固定吉凶结果、选项、结算文案与结构化 effects。
 - 新增 `tests/city-begging-default-content.test.cjs`，覆盖三处默认化缘地点、固定结果表、原始中文文案保真，以及 `getCityBeggingDefaultLocation()` 命中/缺失查询。
 
 ### Changed
 - 城中默认化缘文案已按原始交接稿恢复 encounter / option / outcome / settlement copy，不再使用概述性改写文本。
 
 ### Impact
diff --git a/src/application/app-shell.ts b/src/application/app-shell.ts
index 1d088daf..909fe842 100644
--- a/src/application/app-shell.ts
+++ b/src/application/app-shell.ts
@@ -1,12 +1,12 @@
 import type { CharacterDefinition } from "../domain/character";
-import type { CityBeggingMiniGameState } from "../domain/city-begging-minigame";
+import type { CityBeggingPlayableState } from "../domain/city-begging-minigame";
 import type { CityEntryDirectoryType, CityEntryOption } from "../domain/city-entry";
 import type {
   HouseMapAutoAdvanceCompletion,
   MapAutoAdvanceSnapshot,
 } from "../domain/house-module";
 import type {
   LayoutEditorState,
   UiLayoutByTargetId,
 } from "../domain/ui-layout";
 import type { CityMenuState } from "./city-menu/city-menu";
@@ -58,21 +58,21 @@ export type AppState = {
   };
   campaignTravelState:
     | {
         targetCoordinate: GridCoordinate;
         cityId: string | null;
         cityName: string | null;
       }
     | null;
   modalState: AppModalState;
   locationDialogueState: AppLocationDialogueState;
-  beggingMiniGameState: CityBeggingMiniGameState | null;
+  beggingMiniGameState: CityBeggingPlayableState | null;
   cityCardDrawTestState: AppCityCardDrawTestState | null;
   cityMenuState: CityMenuState | null;
   cityDirectoryState:
     | {
         type: CityEntryDirectoryType;
         title: string;
         targetHouseId: string;
         options: CityEntryOption[];
       }
     | null;
diff --git a/src/application/playables/city-begging/city-begging-default-dialogue.ts b/src/application/playables/city-begging/city-begging-default-dialogue.ts
new file mode 100644
index 00000000..0347ead8
--- /dev/null
+++ b/src/application/playables/city-begging/city-begging-default-dialogue.ts
@@ -0,0 +1,110 @@
+import {
+  getCityBeggingDefaultLocation,
+  type CityBeggingDefaultResult,
+} from "../../../content/playables/city-begging-default-content";
+
+export type CityBeggingDefaultDialoguePhase =
+  | "location-select"
+  | "encounter"
+  | "fortune-draw"
+  | "thinking"
+  | "outcome"
+  | "completed";
+
+export type CityBeggingDefaultDialogueState = {
+  mode: "default-dialogue";
+  phase: CityBeggingDefaultDialoguePhase;
+  selectedLocationId: string | null;
+  selectedOptionId: string | null;
+  fixedResult: CityBeggingDefaultResult | null;
+  thinkingUntil: number | null;
+  settlementApplied: boolean;
+};
+
+const DEFAULT_THINKING_DELAY_MS = 2400;
+
+export function createCityBeggingDefaultDialogueState(
+  _now: number
+): CityBeggingDefaultDialogueState {
+  return {
+    mode: "default-dialogue",
+    phase: "location-select",
+    selectedLocationId: null,
+    selectedOptionId: null,
+    fixedResult: null,
+    thinkingUntil: null,
+    settlementApplied: false,
+  };
+}
+
+export function selectCityBeggingDefaultLocation(
+  state: CityBeggingDefaultDialogueState,
+  locationId: string
+): CityBeggingDefaultDialogueState {
+  if (getCityBeggingDefaultLocation(locationId) == null) {
+    return state;
+  }
+
+  return {
+    ...state,
+    phase: "encounter",
+    selectedLocationId: locationId,
+    selectedOptionId: null,
+    fixedResult: null,
+    thinkingUntil: null,
+    settlementApplied: false,
+  };
+}
+
+export function selectCityBeggingDefaultOption(
+  state: CityBeggingDefaultDialogueState,
+  optionId: string,
+  now: number
+): CityBeggingDefaultDialogueState {
+  if (
+    state.phase !== "encounter" ||
+    state.selectedLocationId == null ||
+    state.selectedOptionId != null ||
+    state.fixedResult != null
+  ) {
+    return state;
+  }
+
+  const location =
+    getCityBeggingDefaultLocation(state.selectedLocationId);
+  const option =
+    location?.options.find((candidate) => candidate.optionId === optionId) ??
+    null;
+
+  if (location == null || option == null) {
+    return state;
+  }
+
+  return {
+    ...state,
+    phase: "fortune-draw",
+    selectedOptionId: optionId,
+    fixedResult: option.fixedResult,
+    thinkingUntil: now + DEFAULT_THINKING_DELAY_MS,
+    settlementApplied: false,
+  };
+}
+
+export function advanceCityBeggingDefaultThinking(
+  state: CityBeggingDefaultDialogueState,
+  now: number
+): CityBeggingDefaultDialogueState {
+  if (
+    state.thinkingUntil == null ||
+    state.phase !== "thinking" ||
+    now < state.thinkingUntil
+  ) {
+    return state;
+  }
+
+  return {
+    ...state,
+    phase: "outcome",
+    thinkingUntil: null,
+  };
+}
diff --git a/src/application/playables/city-begging/city-begging-definition.ts b/src/application/playables/city-begging/city-begging-definition.ts
index 2e8790c7..4529b797 100644
--- a/src/application/playables/city-begging/city-begging-definition.ts
+++ b/src/application/playables/city-begging/city-begging-definition.ts
@@ -1,25 +1,42 @@
 import type { CharacterDefinition } from "../../../domain/character";
 import type { CharacterStatusById } from "../../../domain/character-status";
-import type { CityBeggingGameCompletionResult } from "../../../domain/city-begging-minigame";
+import type {
+  CityBeggingGameCompletionResult,
+  CityBeggingMiniGameState,
+  CityBeggingPlayableState,
+} from "../../../domain/city-begging-minigame";
 import type { RuntimeState } from "../../../core/contracts/runtime-state";
+import { createCityBeggingDefaultDialogueState } from "./city-begging-default-dialogue";
 import {
   applyCityBeggingMiniGameCompletion,
   createCityBeggingMiniGameState,
   setCityBeggingMiniGamePointer,
   updateCityBeggingMiniGameState,
 } from "../../minigames/city-begging-minigame";
 
+function isCityBeggingMiniGameState(
+  state: CityBeggingPlayableState | null
+): state is CityBeggingMiniGameState {
+  return state != null && "variantId" in state;
+}
+
 export function launchCityBeggingPlayable(input: {
   state: RuntimeState;
   now: number;
+  mode?: "minigame" | "default-dialogue";
 }): RuntimeState {
+  const beggingState =
+    input.mode === "default-dialogue"
+      ? createCityBeggingDefaultDialogueState(input.now)
+      : createCityBeggingMiniGameState(input.now);
+
   return {
     ...input.state,
     core: {
       ...input.state.core,
       runtime: {
         ...input.state.core.runtime,
         playableSession: {
           sessionId: "playable.city-begging",
           playableId: "city-begging",
           integrationId: "playable.city-begging.external.default",
@@ -28,52 +45,52 @@ export function launchCityBeggingPlayable(input: {
             ownerKind: "external",
             ownerId: null,
             returnPolicy: "close-only",
           },
           status: "active",
         },
       },
     },
     app: {
       ...input.state.app,
-      beggingMiniGameState: createCityBeggingMiniGameState(input.now),
+      beggingMiniGameState: beggingState,
     },
   };
 }
 
 export function updateCityBeggingPointerPlayable(input: {
   state: RuntimeState;
   pointerX: number;
 }): RuntimeState {
   const currentState = input.state.app.beggingMiniGameState;
-  if (currentState == null) {
+  if (!isCityBeggingMiniGameState(currentState)) {
     return input.state;
   }
 
   return {
     ...input.state,
     app: {
       ...input.state.app,
       beggingMiniGameState: setCityBeggingMiniGamePointer(
         currentState,
         input.pointerX
       ),
     },
   };
 }
 
 export function tickCityBeggingPlayable(input: {
   state: RuntimeState;
   now: number;
 }): RuntimeState {
   const currentState = input.state.app.beggingMiniGameState;
-  if (currentState == null) {
+  if (!isCityBeggingMiniGameState(currentState)) {
     return input.state;
   }
 
   return {
     ...input.state,
     app: {
       ...input.state.app,
       beggingMiniGameState: updateCityBeggingMiniGameState(currentState, input.now),
     },
   };
diff --git a/src/core/runtime/playable-runtime.ts b/src/core/runtime/playable-runtime.ts
index ff309a13..7a73a5df 100644
--- a/src/core/runtime/playable-runtime.ts
+++ b/src/core/runtime/playable-runtime.ts
@@ -318,23 +318,25 @@ export function runPlayableRuntime(input: {
       return {
         state: nextState,
         effects: [],
         handled: true,
         session: getActivePlayableSession(nextState, "activity-qte"),
       };
     }
 
     if (resolvedRequest.launch.launch.playableId === "city-begging") {
       const now = resolvedRequest.launch.launch.payload?.now;
+      const mode = resolvedRequest.launch.launch.payload?.mode;
       const nextState = launchCityBeggingPlayable({
         state: input.state,
         now: typeof now === "number" ? now : performance.now(),
+        mode: mode === "default-dialogue" ? "default-dialogue" : "minigame",
       });
 
       return {
         state: nextState,
         effects: [],
         handled: true,
         session: getActivePlayableSession(nextState, "city-begging"),
       };
     }
 
diff --git a/src/domain/city-begging-minigame.ts b/src/domain/city-begging-minigame.ts
index c170696d..8356b7a3 100644
--- a/src/domain/city-begging-minigame.ts
+++ b/src/domain/city-begging-minigame.ts
@@ -21,10 +21,30 @@ export type CityBeggingMiniGameVariantId =
 
 export type CityBeggingMiniGameState =
   | {
       variantId: "village-catching";
       variantState: CityBeggingVillageState;
     }
   | {
       variantId: "granary-escort";
       variantState: CityBeggingGranaryEscortState;
     };
+
+export type CityBeggingDefaultDialogueRuntimeState = {
+  mode: "default-dialogue";
+  phase:
+    | "location-select"
+    | "encounter"
+    | "fortune-draw"
+    | "thinking"
+    | "outcome"
+    | "completed";
+  selectedLocationId: string | null;
+  selectedOptionId: string | null;
+  fixedResult: "ji" | "xiong" | "ping" | null;
+  thinkingUntil: number | null;
+  settlementApplied: boolean;
+};
+
+export type CityBeggingPlayableState =
+  | CityBeggingMiniGameState
+  | CityBeggingDefaultDialogueRuntimeState;
diff --git a/tests/city-begging-default-runtime.test.cjs b/tests/city-begging-default-runtime.test.cjs
new file mode 100644
index 00000000..a0f116ce
--- /dev/null
+++ b/tests/city-begging-default-runtime.test.cjs
@@ -0,0 +1,167 @@
+const test = require("node:test");
+const assert = require("node:assert/strict");
+
+const {
+  createInitialState,
+} = require("../.test-dist/application/state/create-initial-state.js");
+const {
+  createLaunchPlayableRequest,
+  runPlayableRuntime,
+} = require("../.test-dist/core/runtime/playable-runtime.js");
+const {
+  prototypeCards,
+  prototypeHouses,
+  prototypeMap,
+  prototypeValuables,
+} = require("../.test-dist/content/prototype-world.js");
+
+const playerCharacterId = "char.player";
+
+function createRuntimeState() {
+  const grainShopHouse = prototypeHouses.find(
+    (houseDefinition) => houseDefinition.moduleId === "grain-shop"
+  );
+
+  return {
+    core: createInitialState({
+      currentMapId: prototypeMap.id,
+      currentCityId: "city.kulan",
+      currentHouseId: grainShopHouse.id,
+      playerCharacterId,
+      chapterId: "chapter.prototype",
+      year: 1567,
+      month: 1,
+      day: 1,
+      pinnedCharacterId: playerCharacterId,
+      reviewDateText: "test",
+      mainHouseMissionText: "test",
+      cards: {
+        ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
+        selectedCardId: prototypeCards[0]?.id ?? null,
+      },
+      valuables: {
+        items: prototypeValuables,
+        selectedItemId: prototypeValuables[0]?.id ?? null,
+        equippedWeaponSet: {
+          swordId:
+            prototypeValuables.find(
+              (valuableDefinition) => valuableDefinition.category === "weapon"
+            )?.id ?? null,
+          armorId:
+            prototypeValuables.find(
+              (valuableDefinition) => valuableDefinition.category === "armor"
+            )?.id ?? null,
+        },
+      },
+      currentView: "house",
+    }),
+    app: {
+      beggingMiniGameState: null,
+      autoAdvanceState: null,
+      campaignTravelState: null,
+      cityDirectoryState: null,
+      cityMenuState: null,
+      locationDialogueState: null,
+      modalState: null,
+    },
+    view: {},
+  };
+}
+
+test("city begging default dialogue selects a location and locks a fixed option result", async () => {
+  const {
+    createCityBeggingDefaultDialogueState,
+    selectCityBeggingDefaultLocation,
+    selectCityBeggingDefaultOption,
+  } = await import(
+    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
+  );
+
+  const launched = createCityBeggingDefaultDialogueState(1000);
+  assert.equal(launched.mode, "default-dialogue");
+  assert.equal(launched.phase, "location-select");
+
+  const atLocation = selectCityBeggingDefaultLocation(
+    launched,
+    "xicheng_guanyin"
+  );
+  assert.equal(atLocation.phase, "encounter");
+  assert.equal(atLocation.selectedLocationId, "xicheng_guanyin");
+
+  const afterOption = selectCityBeggingDefaultOption(
+    atLocation,
+    "help_mend_net",
+    1200
+  );
+  assert.equal(afterOption.phase, "fortune-draw");
+  assert.equal(afterOption.selectedOptionId, "help_mend_net");
+  assert.equal(afterOption.fixedResult, "ji");
+  assert.equal(afterOption.settlementApplied, false);
+});
+
+test("city begging default dialogue ignores invalid and duplicate option selection", async () => {
+  const {
+    createCityBeggingDefaultDialogueState,
+    selectCityBeggingDefaultLocation,
+    selectCityBeggingDefaultOption,
+  } = await import(
+    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
+  );
+
+  const launched = createCityBeggingDefaultDialogueState(1000);
+  const atLocation = selectCityBeggingDefaultLocation(
+    launched,
+    "xicheng_guanyin"
+  );
+
+  const afterInvalidOption = selectCityBeggingDefaultOption(
+    atLocation,
+    "not_a_real_option",
+    1100
+  );
+  assert.strictEqual(afterInvalidOption, atLocation);
+  assert.equal(afterInvalidOption.phase, "encounter");
+  assert.equal(afterInvalidOption.selectedOptionId, null);
+  assert.equal(afterInvalidOption.fixedResult, null);
+
+  const afterOption = selectCityBeggingDefaultOption(
+    atLocation,
+    "help_mend_net",
+    1200
+  );
+  assert.equal(afterOption.phase, "fortune-draw");
+  assert.equal(afterOption.selectedOptionId, "help_mend_net");
+  assert.equal(afterOption.fixedResult, "ji");
+
+  const afterDuplicateOption = selectCityBeggingDefaultOption(
+    afterOption,
+    "help_mend_net",
+    1300
+  );
+  assert.strictEqual(afterDuplicateOption, afterOption);
+
+  const afterChangedOption = selectCityBeggingDefaultOption(
+    afterOption,
+    "honest_request",
+    1400
+  );
+  assert.strictEqual(afterChangedOption, afterOption);
+  assert.equal(afterChangedOption.selectedOptionId, "help_mend_net");
+  assert.equal(afterChangedOption.fixedResult, "ji");
+});
+
+test("city begging launch payload can start the default dialogue mode", () => {
+  const launched = runPlayableRuntime({
+    state: createRuntimeState(),
+    request: createLaunchPlayableRequest("city-begging", {
+      payload: { mode: "default-dialogue", now: 1000 },
+    }),
+  });
+
+  assert.equal(launched.handled, true);
+  assert.equal(launched.state.app.beggingMiniGameState?.mode, "default-dialogue");
+  assert.equal(
+    launched.state.app.beggingMiniGameState?.phase,
+    "location-select"
+  );
+});
