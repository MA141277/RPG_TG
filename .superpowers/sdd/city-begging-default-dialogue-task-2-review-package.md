# Review package

Base: 41d533d6
Head: 3cdc28a6

## Commits

3cdc28a6 Add city begging default dialogue reducer

## Stat

 .../city-begging-default-dialogue-task-2-report.md |  65 ++++++++++++
 src/application/app-shell.ts                       |   4 +-
 .../city-begging/city-begging-default-dialogue.ts  | 103 ++++++++++++++++++
 .../city-begging/city-begging-definition.ts        |  25 ++++-
 src/core/runtime/playable-runtime.ts               |   2 +
 src/domain/city-begging-minigame.ts                |  20 ++++
 tests/city-begging-default-runtime.test.cjs        | 116 +++++++++++++++++++++
 7 files changed, 329 insertions(+), 6 deletions(-)

## Diff

diff --git a/.superpowers/sdd/city-begging-default-dialogue-task-2-report.md b/.superpowers/sdd/city-begging-default-dialogue-task-2-report.md
new file mode 100644
index 00000000..cb9e8a2d
--- /dev/null
+++ b/.superpowers/sdd/city-begging-default-dialogue-task-2-report.md
@@ -0,0 +1,65 @@
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
index 00000000..a9e95097
--- /dev/null
+++ b/src/application/playables/city-begging/city-begging-default-dialogue.ts
@@ -0,0 +1,103 @@
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
+  const location =
+    state.selectedLocationId == null
+      ? null
+      : getCityBeggingDefaultLocation(state.selectedLocationId);
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
index 00000000..5a94cc6c
--- /dev/null
+++ b/tests/city-begging-default-runtime.test.cjs
@@ -0,0 +1,116 @@
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
