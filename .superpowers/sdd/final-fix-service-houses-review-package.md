# Review Package Final Fix: Service Houses and Market Identity

Base: 1b44e16a
Head: 840039197300927ee515227b8f605d7aae33cff1

## Commits
84003919 fix: align market primary actor identity
45e54311 fix: apply primary actor roster to service houses

## Stat
 .../grain-shop/grain-shop-house-module.ts          |  27 +++--
 .../market-house/market-house-house-module.ts      | 104 ++++++++++++------
 .../market-house/market-house-session-state.ts     |   2 +-
 .../medicine-house/medicine-house-house-module.ts  |  27 +++--
 .../tea-house/tea-house-house-module.ts            |  27 ++---
 tests/robustness.test.cjs                          | 118 ++++++++++++++++++++-
 6 files changed, 235 insertions(+), 70 deletions(-)

## Diff
diff --git a/src/application/house-modules/grain-shop/grain-shop-house-module.ts b/src/application/house-modules/grain-shop/grain-shop-house-module.ts
index b67d8c89..8c2ea713 100644
--- a/src/application/house-modules/grain-shop/grain-shop-house-module.ts
+++ b/src/application/house-modules/grain-shop/grain-shop-house-module.ts
@@ -21,20 +21,21 @@ import { createGrainShopSnapshot } from "../../grain-shop/grain-shop-snapshot";
 import { executeGrainTrade } from "../../grain-shop/grain-trade";
 import { getQuotedGrainPrice, getTradeTotal, pickNpcDefaultLine, pickNpcGreeting } from "../../grain-shop/grain-market";
 import { investigateGrainMarket } from "../../grain-shop/investigate-grain-market";
 import { initGrainShopSession } from "../../grain-shop/init-grain-shop-session";
 import { setGrainPrice } from "../../grain-shop/grain-shop-mutations";
 import {
   convertHouseActivityDaysToSegments,
   formatHouseActivityCostLine,
   getHouseMinigameDurationDays,
 } from "../../house/house-activity-costs";
+import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 import { getInsufficientDaysForTimedActivity } from "../../time/council-priority";
 import {
   ACTIVITY_COMPLETION_STAMINA_COST,
   canAffordActivityCost,
 } from "../../player/player-stamina";
 import { defaultRuntimeContent } from "../../content/default-runtime-content";
 import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
 import {
   createExitPlayableRequest,
   createLaunchPlayableRequest,
@@ -899,37 +900,41 @@ export const grainShopHouseModule: HouseModuleDefinition<"grain-shop"> = {
       input.houseDefinition.defaultCharacterId == null
         ? null
         : input.characterDefinitions.find(
             (characterDefinition) => characterDefinition.id === input.houseDefinition.defaultCharacterId
           ) ?? null;
     const snapshot = createGrainShopSnapshot(input.gameState, playerCharacter);
     const isIdle = sessionState.dialoguePhase === "idle";
     const isGreeting = sessionState.dialoguePhase === "greeting";
     const isOpen = sessionState.dialoguePhase === "open";
     const isBuyBlocked = isHaozhouShortageDuringBeggingJourney(input.gameState);
-
-    return {
-      moduleId: "grain-shop",
-      houseId: input.houseDefinition.id,
-      sceneTitle: input.houseDefinition.name,
-      sceneSubtitle: "陈记粮行 / 南北通商",
-      standbyRoster:
-        isIdle && npc != null
-          ? [
+    const standbyRoster = orderHouseStandbyRoster({
+      primaryCharacterId: input.houseDefinition.defaultCharacterId,
+      actors:
+        npc == null
+          ? []
+          : [
               {
                 characterId: npc.id,
                 name: npc.name,
                 ...(npc.title == null ? {} : { title: npc.title }),
                 actionId: "open-npc-dialogue",
               },
-            ]
-          : [],
+            ],
+    });
+
+    return {
+      moduleId: "grain-shop",
+      houseId: input.houseDefinition.id,
+      sceneTitle: input.houseDefinition.name,
+      sceneSubtitle: "陈记粮行 / 南北通商",
+      standbyRoster,
       dialogue:
         isIdle || npc == null
           ? null
           : {
               mode: "character",
               speakerName: npc.name,
               characterId: npc.id,
               position: "right",
               textLines: [isGreeting ? sessionState.npcGreeting : sessionState.npcDefaultLine],
               advanceActionId: isGreeting ? "advance-greeting" : null,
diff --git a/src/application/house-modules/market-house/market-house-house-module.ts b/src/application/house-modules/market-house/market-house-house-module.ts
index 26ead1be..96012307 100644
--- a/src/application/house-modules/market-house/market-house-house-module.ts
+++ b/src/application/house-modules/market-house/market-house-house-module.ts
@@ -41,20 +41,21 @@ import {
 import type { ShopInventoryEntry } from "../../../domain/market";
 import type {
   MarketShopType,
   TradeGoodCategory,
   TradeGoodDefinition,
 } from "../../../domain/trade-good";
 import { assertExists } from "../../../shared/assert";
 import { pickRandom, randomInt } from "../../../shared/random";
 import { defaultRuntimeContent } from "../../content/default-runtime-content";
 import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
+import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 import { ensureShopMarketData, readShopMarketData } from "../../markets/market-refresh-system";
 import { createInitialMarketHouseSessionState } from "./market-house-session-state";
 
 const AVAILABLE_MARKET_SHOPS: MarketShopType[] = [
   "grain-shop",
   "medicine-shop",
   "silk-shop",
   "smithy",
   "horse-market",
   "general-store",
@@ -89,20 +90,47 @@ type MarketHouseViewSnapshot = {
   cityDefinition: CityDefinition;
   actors: MarketHouseActor[];
   selectedActor: MarketHouseActor | null;
   bossFavorability: number;
   displayedGoods: MarketHouseGoodsSnapshot[];
   sellableGoods: MarketHouseGoodsSnapshot[];
   refreshAfterDay: number;
   totalOwnedGoods: number;
 };
 
+function getFixedHostActorId(houseDefinition: HouseDefinition): string {
+  return houseDefinition.defaultCharacterId ?? marketHouseFixedBoss.id;
+}
+
+function createFixedHostActor(state: GameState, houseDefinition: HouseDefinition): MarketHouseActor {
+  const actorId = getFixedHostActorId(houseDefinition);
+
+  return {
+    ...marketHouseFixedBoss,
+    id: actorId,
+    favorability: readActorFavorability(
+      state,
+      houseDefinition.id,
+      actorId,
+      marketHouseFixedBoss.favorability
+    ),
+  };
+}
+
+function findFixedHostActor(
+  actors: MarketHouseActor[],
+  houseDefinition: HouseDefinition
+): MarketHouseActor | null {
+  const actorId = getFixedHostActorId(houseDefinition);
+  return actors.find((actor) => actor.id === actorId) ?? null;
+}
+
 function getPlayerCharacter(
   characterDefinitions: CharacterDefinition[],
   playerCharacterId: string
 ): CharacterDefinition {
   const playerCharacter = characterDefinitions.find(
     (characterDefinition) => characterDefinition.id === playerCharacterId
   );
   assertExists(
     playerCharacter,
     `Player character not found for id "${playerCharacterId}" in market house module.`
@@ -280,44 +308,39 @@ function readActorFavorability(
   actorId: string,
   fallback: number
 ): number {
   return readNumericVariable(
     state,
     getMarketHouseFavorabilityVariableKey(houseId, actorId),
     fallback
   );
 }
 
-function createActors(state: GameState, houseId: string, guestActorIds: string[]): MarketHouseActor[] {
-  const actors: MarketHouseActor[] = [
-    {
-      ...marketHouseFixedBoss,
-      favorability: readActorFavorability(
-        state,
-        houseId,
-        marketHouseFixedBoss.id,
-        marketHouseFixedBoss.favorability
-      ),
-    },
-  ];
+function createActors(
+  state: GameState,
+  houseDefinition: HouseDefinition,
+  guestActorIds: string[]
+): MarketHouseActor[] {
+  const fixedHostActor = createFixedHostActor(state, houseDefinition);
+  const actors: MarketHouseActor[] = [fixedHostActor];
 
   guestActorIds.forEach((guestActorId) => {
     const actorDefinition = marketHouseRandomNpcPool.find((actor) => actor.id === guestActorId);
-    if (actorDefinition == null) {
+    if (actorDefinition == null || actorDefinition.id === fixedHostActor.id) {
       return;
     }
 
     actors.push({
       ...actorDefinition,
       favorability: readActorFavorability(
         state,
-        houseId,
+        houseDefinition.id,
         actorDefinition.id,
         actorDefinition.favorability
       ),
     });
   });
 
   return actors;
 }
 
 function getBuyPriceModifier(favorability: number): number {
@@ -484,39 +507,41 @@ function createSellableGoodsSnapshots(
     })
     .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
 }
 
 function createViewSnapshot(
   gameState: GameState,
   houseDefinition: HouseDefinition,
   sessionState: MarketHouseSessionState | null
 ): MarketHouseViewSnapshot {
   const runtime = ensureMarketHouseRuntime(gameState, houseDefinition);
-  const actors = createActors(runtime.state, houseDefinition.id, runtime.guestActorIds);
-  const bossFavorability = actors.find((actor) => actor.id === marketHouseFixedBoss.id)?.favorability ?? 0;
+  const actors = createActors(runtime.state, houseDefinition, runtime.guestActorIds);
+  const fixedHostActor = findFixedHostActor(actors, houseDefinition);
+  const bossFavorability = fixedHostActor?.favorability ?? marketHouseFixedBoss.favorability;
   const displayedGoods = createGoodsSnapshots(
     runtime.state,
     houseDefinition,
     runtime.cityDefinition,
     runtime.inventoryGoodsIds,
     bossFavorability
   );
   const sellableGoods = createSellableGoodsSnapshots(
     runtime.state,
     houseDefinition,
     runtime.cityDefinition,
     bossFavorability
   );
-  const selectedActorId = sessionState?.selectedActorId ?? marketHouseFixedBoss.id;
+  const fixedHostActorId = getFixedHostActorId(houseDefinition);
+  const selectedActorId = sessionState?.selectedActorId ?? fixedHostActorId;
   const selectedActor =
     actors.find((actor) => actor.id === selectedActorId) ??
-    actors.find((actor) => actor.id === marketHouseFixedBoss.id) ??
+    fixedHostActor ??
     null;
 
   return {
     state: runtime.state,
     cityDefinition: runtime.cityDefinition,
     actors,
     selectedActor,
     bossFavorability,
     displayedGoods,
     sellableGoods,
@@ -705,29 +730,30 @@ function mutateHouseStock(
     0,
     readNumericVariable(state, getMarketHouseStockVariableKey(houseId, goodsId), 0) + delta
   );
   return withVariable(state, getMarketHouseStockVariableKey(houseId, goodsId), nextQuantity);
 }
 
 function mutateActorFavorability(
   state: GameState,
   houseId: string,
   actorId: string,
+  fallbackFavorability: number,
   delta: number
 ): GameState {
   return withVariable(
     state,
     getMarketHouseFavorabilityVariableKey(houseId, actorId),
     readNumericVariable(
       state,
       getMarketHouseFavorabilityVariableKey(houseId, actorId),
-      actorId === marketHouseFixedBoss.id ? marketHouseFixedBoss.favorability : 0
+      fallbackFavorability
     ) + delta
   );
 }
 
 function increaseMarketHouseTime(state: GameState, houseId: string, delta: number): GameState {
   return withVariable(
     state,
     getMarketHouseTimeVariableKey(houseId),
     readNumericVariable(state, getMarketHouseTimeVariableKey(houseId), 1) + delta
   );
@@ -787,20 +813,21 @@ function applyActionOutcome(
     if (change.quantity < 0) {
       nextState = mutateHouseStock(nextState, input.houseDefinition.id, change.goodsId, -change.quantity);
     }
   });
 
   if (outcome.relationshipChange !== 0) {
     nextState = mutateActorFavorability(
       nextState,
       input.houseDefinition.id,
       actor.id,
+      actor.favorability,
       outcome.relationshipChange
     );
   }
 
   return {
     state: increaseMarketHouseTime(nextState, input.houseDefinition.id, outcome.timeCost),
     characterDefinitions: nextCharacterDefinitions,
   };
 }
 
@@ -814,22 +841,23 @@ function pickInvestigationMessage(
   const focusGoods = displayedGoods[0]?.goodDefinition ?? null;
   const rumorTextIds =
     focusGoods == null
       ? marketHouseGeneralRumorTextIds
       : marketHouseRumorTextIdsByCategory[focusGoods.category] ??
         marketHouseGeneralRumorTextIds;
   const specialDemandList =
     cityDefinition.specialDemand.length > 0
       ? cityDefinition.specialDemand.join(" / ")
       : "无";
+  const specialtyActorId = actor.isFixedHost ? marketHouseFixedBoss.id : actor.id;
   const specialtyTextId =
-    marketHouseInvestigationSpecialtyTextIdByActorId[actor.id] ??
+    marketHouseInvestigationSpecialtyTextIdByActorId[specialtyActorId] ??
     "runtime.zhu_yuanzhang.market_house.investigate.specialty.default";
 
   return [
     resolveMarketTemplateText(
       entries,
       "runtime.zhu_yuanzhang.market_house.investigate.city.001",
       {
         cityName: cityDefinition.name,
         prosperity: cityDefinition.prosperity,
         danger: cityDefinition.danger,
@@ -983,30 +1011,35 @@ function handleAction(
 ): HouseModuleTransitionResult<"market-house"> {
   if (input.request.type !== "action") {
     return createTransitionResult(input);
   }
 
   const snapshot = createViewSnapshot(input.gameState, input.houseDefinition, sessionState);
   const selectedActor = snapshot.selectedActor;
   const currentOverlay = sessionState?.overlay;
 
   if (input.request.actionId === "advance-greeting") {
+    const fixedHostActor = findFixedHostActor(snapshot.actors, input.houseDefinition);
+    if (fixedHostActor == null) {
+      return createTransitionResult(input, { gameState: snapshot.state });
+    }
+
     return withSessionState(
       {
         gameState: snapshot.state,
         characterDefinitions: input.characterDefinitions,
       },
       sessionState,
       {
-        selectedActorId: marketHouseFixedBoss.id,
+        selectedActorId: fixedHostActor.id,
         dialoguePhase: "open",
-        dialogueLines: getActorOpenLines(marketHouseFixedBoss, input.textEntriesById),
+        dialogueLines: getActorOpenLines(fixedHostActor, input.textEntriesById),
         overlay: null,
       }
     );
   }
 
   if (input.request.actionId === "dismiss-dialogue") {
     return withSessionState(
       {
         gameState: snapshot.state,
         characterDefinitions: input.characterDefinitions,
@@ -1394,76 +1427,79 @@ function handleAction(
     };
   }
 
   return createTransitionResult(input, { gameState: snapshot.state });
 }
 
 export const marketHouseHouseModule: HouseModuleDefinition<"market-house"> = {
   moduleId: "market-house",
   enter(input) {
     const runtime = ensureMarketHouseRuntime(input.gameState, input.houseDefinition);
+    const fixedHostActorId = getFixedHostActorId(input.houseDefinition);
 
     return {
       gameState: runtime.state,
       characterDefinitions: input.characterDefinitions,
       sessionState: createInitialMarketHouseSessionState(
         runtime.guestActorIds,
-        marketHouseFixedBoss.id,
+        fixedHostActorId,
         getInitialMarketHouseDialogueLines(input.textEntriesById)
       ),
     };
   },
   dispatch(input) {
     if (input.request.type === "field") {
       return handleField(input, input.sessionState);
     }
 
     return handleAction(input, input.sessionState);
   },
   leave(input) {
     return {
       gameState: input.gameState,
       characterDefinitions: input.characterDefinitions,
       sessionState: null,
     };
   },
   selectViewModel(input): HouseModuleViewModel {
     const runtime = ensureMarketHouseRuntime(input.gameState, input.houseDefinition);
+    const fixedHostActorId = getFixedHostActorId(input.houseDefinition);
     const sessionState =
       input.sessionState ??
       createInitialMarketHouseSessionState(
         runtime.guestActorIds,
-        marketHouseFixedBoss.id,
+        fixedHostActorId,
         getInitialMarketHouseDialogueLines(input.textEntriesById)
       );
     const snapshot = createViewSnapshot(runtime.state, input.houseDefinition, sessionState);
     const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
     const isIdle = sessionState.dialoguePhase === "idle";
     const isGreeting = sessionState.dialoguePhase === "greeting";
     const isOpen = sessionState.dialoguePhase === "open";
     const selectedActor = snapshot.selectedActor;
+    const standbyRoster = orderHouseStandbyRoster({
+      primaryCharacterId: input.houseDefinition.defaultCharacterId,
+      actors: snapshot.actors.map((actor) => ({
+        characterId: actor.id,
+        name: actor.name,
+        title: actor.title,
+        actionId: `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}`,
+        isSelected: actor.id === selectedActor?.id,
+      })),
+    });
 
     return {
       moduleId: "market-house",
       houseId: input.houseDefinition.id,
       sceneTitle: input.houseDefinition.name,
       sceneSubtitle: "跑商 / 倒卖 / 交易",
-      standbyRoster:
-        !isIdle
-          ? []
-          : snapshot.actors.map((actor) => ({
-              characterId: actor.id,
-              name: actor.name,
-              title: actor.title,
-              actionId: `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}`,
-              isSelected: actor.id === selectedActor?.id,
-            })),
+      standbyRoster,
       dialogue:
         isIdle || selectedActor == null
           ? null
           : {
               mode: "character",
               speakerName: selectedActor.name,
               characterId: selectedActor.id,
               position: "right",
               textLines: sessionState.dialogueLines,
               advanceActionId: isGreeting ? "advance-greeting" : null,
diff --git a/src/application/house-modules/market-house/market-house-session-state.ts b/src/application/house-modules/market-house/market-house-session-state.ts
index ba65e4a2..f6189425 100644
--- a/src/application/house-modules/market-house/market-house-session-state.ts
+++ b/src/application/house-modules/market-house/market-house-session-state.ts
@@ -1,15 +1,15 @@
 import type { MarketHouseSessionState } from "../../../domain/house-modules/market-house-session";
 
 export function createInitialMarketHouseSessionState(
   guestActorIds: string[] = [],
-  selectedActorId: string | null = "shopkeeper_qian",
+  selectedActorId: string | null = null,
   dialogueLines: string[] = ["市集里人声杂沓，商贩正等你开口。"]
 ): MarketHouseSessionState {
   return {
     guestActorIds,
     selectedActorId,
     dialogueLines,
     dialoguePhase: "greeting",
     overlay: null,
   };
 }
diff --git a/src/application/house-modules/medicine-house/medicine-house-house-module.ts b/src/application/house-modules/medicine-house/medicine-house-house-module.ts
index c3a7b187..dd2843ae 100644
--- a/src/application/house-modules/medicine-house/medicine-house-house-module.ts
+++ b/src/application/house-modules/medicine-house/medicine-house-house-module.ts
@@ -51,20 +51,21 @@ import {
 import {
   ACTIVITY_COMPLETION_STAMINA_COST,
   canAffordActivityCost,
   spendPlayerStamina,
 } from "../../player/player-stamina";
 import {
   convertHouseActivityDaysToSegments,
   formatHouseActivityCostLine,
   getHouseMinigameDurationDays,
 } from "../../house/house-activity-costs";
+import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 import {
   createHousePlayableRuntimeState,
   readHousePlayableSessionState,
 } from "../../playables/house-playable-runtime-bridge";
 import { getMedicineCompoundingTimeAdvanceCost } from "../../playables/medicine-compounding/medicine-compounding-definition";
 import { getInsufficientDaysForTimedActivity } from "../../time/council-priority";
 import { createInitialMedicineHouseSessionState } from "./medicine-house-session-state";
 
 const COMPOUNDING_INTERVAL_ID = "medicine-house-compounding";
 const BUY_SELECT_ACTION_PREFIX = "buy-select:";
@@ -1022,37 +1023,41 @@ export const medicineHouseHouseModule: HouseModuleDefinition<"medicine-house"> =
     const medicineInventorySummary = medicineHousePreparedMedicines
       .map(
         (medicine) =>
           `${medicine.name}×${readMedicineInventoryQuantity(input.gameState, medicine.id)}`
       )
       .join(" / ");
     const isIdle = sessionState.dialoguePhase === "idle";
     const isGreeting = sessionState.dialoguePhase === "greeting";
     const isOpen = sessionState.dialoguePhase === "open";
     const hasOverlay = sessionState.overlay != null;
-
-    return {
-      moduleId: "medicine-house",
-      houseId: input.houseDefinition.id,
-      sceneTitle: input.houseDefinition.name,
-      sceneSubtitle: "陈记药铺 / 坐堂问诊",
-      standbyRoster:
-        isIdle && npc != null
-          ? [
+    const standbyRoster = orderHouseStandbyRoster({
+      primaryCharacterId: input.houseDefinition.defaultCharacterId,
+      actors:
+        npc == null
+          ? []
+          : [
               {
                 characterId: npc.id,
                 name: npc.name,
                 ...(npc.title == null ? {} : { title: npc.title }),
                 actionId: "open-npc-dialogue",
               },
-            ]
-          : [],
+            ],
+    });
+
+    return {
+      moduleId: "medicine-house",
+      houseId: input.houseDefinition.id,
+      sceneTitle: input.houseDefinition.name,
+      sceneSubtitle: "陈记药铺 / 坐堂问诊",
+      standbyRoster,
       dialogue:
         isIdle || npc == null
           ? null
           : {
               mode: "character",
               speakerName: npc.name,
               characterId: npc.id,
               position: "right",
               textLines: [
                 isGreeting
diff --git a/src/application/house-modules/tea-house/tea-house-house-module.ts b/src/application/house-modules/tea-house/tea-house-house-module.ts
index 2bfe3399..ef44417a 100644
--- a/src/application/house-modules/tea-house/tea-house-house-module.ts
+++ b/src/application/house-modules/tea-house/tea-house-house-module.ts
@@ -55,20 +55,21 @@ import {
 import {
   ACTIVITY_COMPLETION_STAMINA_COST,
   canAffordActivityCost,
   spendPlayerStamina,
 } from "../../player/player-stamina";
 import {
   convertHouseActivityDaysToSegments,
   formatHouseActivityCostLine,
   getHouseMinigameDurationDays,
 } from "../../house/house-activity-costs";
+import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
 import { getInsufficientDaysForTimedActivity } from "../../time/council-priority";
 import { createInitialTeaHouseSessionState } from "./tea-house-session-state";
 
 const DEBATE_INTERVAL_ID = "tea-house-debate";
 const MAX_TEA_HOUSE_GUESTS = 2;
 const SELECT_ACTOR_ACTION_PREFIX = "select-actor:";
 const DEBATE_TOPIC_ACTION_PREFIX = "debate-topic:";
 const DEBATE_CONFIRM_ACTION_ID = "confirm-debate-topic";
 const CONFIRM_START_DEBATE_ACTION_ID = "confirm-start-debate";
 const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";
@@ -1211,38 +1212,40 @@ export const teaHouseHouseModule: HouseModuleDefinition<"tea-house"> = {
     );
     const currentTime = readNumericVariable(
       input.gameState,
       getTeaHouseTimeVariableKey(input.houseDefinition.id),
       0
     );
     const isIdle = sessionState.dialoguePhase === "idle";
     const isGreeting = sessionState.dialoguePhase === "greeting";
     const isOpen = sessionState.dialoguePhase === "open";
     const isDebate = sessionState.overlay?.type === "debate";
+    const standbyRoster = orderHouseStandbyRoster({
+      primaryCharacterId: input.houseDefinition.defaultCharacterId,
+      actors: actors.map((actor) => ({
+        characterId: actor.id,
+        name: actor.name,
+        title: actor.title,
+        actionId:
+          actor.id === selectedActor?.id
+            ? "open-npc-dialogue"
+            : `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}`,
+        isSelected: selectedActor?.id === actor.id,
+      })),
+    });
 
     return {
       moduleId: "tea-house",
       houseId: input.houseDefinition.id,
       sceneTitle: input.houseDefinition.name,
       sceneSubtitle: "一壶清茶 / 四方传闻",
-      standbyRoster: isIdle
-        ? actors.map((actor) => ({
-            characterId: actor.id,
-            name: actor.name,
-            title: actor.title,
-            actionId:
-              actor.id === selectedActor?.id
-                ? "open-npc-dialogue"
-                : `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}`,
-            isSelected: selectedActor?.id === actor.id,
-          }))
-        : [],
+      standbyRoster,
       dialogue:
         isIdle || selectedActor == null
           ? null
           : {
               mode: "character",
               speakerName: selectedActor.name,
               characterId: selectedActor.id,
               position: "right",
               textLines:
                 sessionState.dialogueLines.length > 0
diff --git a/tests/robustness.test.cjs b/tests/robustness.test.cjs
index cadf5e31..d6767e49 100644
--- a/tests/robustness.test.cjs
+++ b/tests/robustness.test.cjs
@@ -3929,20 +3929,125 @@ test("primary house actor appears first in tavern roster during greeting", () =>
     houseDefinition: tavernHouse,
     playerCharacterId,
     sessionState: entered.sessionState,
   });
 
   assert.equal(viewModel.dialogue?.characterId, tavernHouse.defaultCharacterId);
   assert.equal(viewModel.standbyRoster[0]?.characterId, tavernHouse.defaultCharacterId);
   assert.ok(viewModel.standbyRoster[0]?.actionId);
 });
 
+test("primary house actor appears first in grain shop roster during greeting", () => {
+  const state = createBaseState();
+  const entered = grainShopHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: grainShopHouse,
+    playerCharacterId,
+  });
+  const viewModel = grainShopHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: grainShopHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.ok(viewModel.dialogue);
+  assert.equal(viewModel.standbyRoster[0]?.characterId, grainShopHouse.defaultCharacterId);
+});
+
+test("primary house actor appears first in tea house roster during greeting", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = teaHouseHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: teaHouse,
+    playerCharacterId,
+  });
+  const viewModel = teaHouseHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: teaHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.ok(viewModel.dialogue);
+  assert.equal(viewModel.standbyRoster[0]?.characterId, teaHouse.defaultCharacterId);
+});
+
+test("primary house actor appears first in market house roster during greeting", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = marketHouseHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: marketHouse,
+    playerCharacterId,
+  });
+  const viewModel = marketHouseHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: marketHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.ok(viewModel.dialogue);
+  assert.equal(viewModel.dialogue.characterId, marketHouse.defaultCharacterId);
+  assert.equal(viewModel.standbyRoster[0]?.characterId, marketHouse.defaultCharacterId);
+  assert.equal(viewModel.standbyRoster[0]?.actionId, `select-market-actor:${marketHouse.defaultCharacterId}`);
+  assert.equal(viewModel.standbyRoster[0]?.isSelected, true);
+  assert.equal(
+    viewModel.standbyRoster.some((actor) => actor.characterId === "shopkeeper_qian"),
+    false
+  );
+});
+
+test("primary house actor appears first in medicine house roster during greeting", () => {
+  const state = createInitialState({
+    cards: prototypeCards,
+    characters: prototypeCharacters,
+    houses: prototypeHouses,
+    cityEntries: prototypeCityEntries,
+    map: prototypeMap,
+  });
+  const entered = medicineHouseHouseModule.enter({
+    gameState: state,
+    characterDefinitions: prototypeCharacters,
+    houseDefinition: medicineHouse,
+    playerCharacterId,
+  });
+  const viewModel = medicineHouseHouseModule.selectViewModel({
+    gameState: entered.gameState,
+    characterDefinitions: entered.characterDefinitions,
+    houseDefinition: medicineHouse,
+    playerCharacterId,
+    sessionState: entered.sessionState,
+  });
+
+  assert.ok(viewModel.dialogue);
+  assert.equal(viewModel.standbyRoster[0]?.characterId, medicineHouse.defaultCharacterId);
+});
+
 test("primary house actor dialogue does not render separate right-side portrait", () => {
   const state = createInitialState({
     cards: prototypeCards,
     characters: prototypeCharacters,
     houses: prototypeHouses,
     cityEntries: prototypeCityEntries,
     map: prototypeMap,
   });
   const entered = tavernHouseModule.enter({
     gameState: state,
@@ -6256,36 +6361,47 @@ test("market house inventory excludes grain and horse goods", () => {
 
 test("market house follows greeting open idle rhythm with fixed boss and guest roster", () => {
   const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
   const enterResult = marketHouseHouseModule.enter({
     gameState: state,
     characterDefinitions: prototypeCharacters,
     houseDefinition: marketHouse,
     playerCharacterId,
   });
 
-  assert.equal(enterResult.sessionState?.selectedActorId, "shopkeeper_qian");
+  assert.equal(enterResult.sessionState?.selectedActorId, marketHouse.defaultCharacterId);
   assert.equal(enterResult.sessionState?.guestActorIds.length >= 1, true);
 
+  const greetingViewModel = marketHouseHouseModule.selectViewModel({
+    gameState: enterResult.gameState,
+    characterDefinitions: enterResult.characterDefinitions,
+    houseDefinition: marketHouse,
+    playerCharacterId,
+    sessionState: enterResult.sessionState,
+  });
+
+  assert.equal(greetingViewModel.dialogue?.characterId, marketHouse.defaultCharacterId);
+
   const openResult = marketHouseHouseModule.dispatch({
     gameState: enterResult.gameState,
     characterDefinitions: enterResult.characterDefinitions,
     houseDefinition: marketHouse,
     playerCharacterId,
     sessionState: enterResult.sessionState,
     request: {
       type: "action",
       actionId: "advance-greeting",
     },
   });
 
   assert.equal(openResult.sessionState?.dialoguePhase, "open");
+  assert.equal(openResult.sessionState?.selectedActorId, marketHouse.defaultCharacterId);
   assert.equal(openResult.sessionState?.dialogueLines[0].includes("货单"), true);
 
   const idleResult = marketHouseHouseModule.dispatch({
     gameState: openResult.gameState,
     characterDefinitions: openResult.characterDefinitions,
     houseDefinition: marketHouse,
     playerCharacterId,
     sessionState: openResult.sessionState,
     request: {
       type: "action",
