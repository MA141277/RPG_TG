# Review Package Task 2 Re-Review

Base: b9bd39b6
Head: ff37697269c89ce4ea29b2c16e749ea072efeffe

## Commits
ff376972 fix: include temple abbot in meeting roster
6a0900ee feat: keep house primary actors in roster

## Stat
 .superpowers/sdd/task-2-report.md                  |  92 ++++++++++++++++++
 .../house-modules/tavern/tavern-house-module.ts    |  29 +++---
 .../temple-house/temple-house-house-module.ts      |  92 ++++++++++--------
 tests/robustness.test.cjs                          | 107 +++++++++++++++++++++
 4 files changed, 264 insertions(+), 56 deletions(-)

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
diff --git a/src/application/house-modules/tavern/tavern-house-module.ts b/src/application/house-modules/tavern/tavern-house-module.ts
index 7a5fa638..5deef3ed 100644
--- a/src/application/house-modules/tavern/tavern-house-module.ts
+++ b/src/application/house-modules/tavern/tavern-house-module.ts
@@ -23,20 +23,21 @@ import type {
   HouseModuleViewModel,
   HouseOverlayViewModel,
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
   createTavernGambleSession,
   createTavernLongGambleSession,
@@ -2076,46 +2077,46 @@ export const tavernHouseModule: HouseModuleDefinition<"tavern"> = {
     const drinkCount = readNumericVariable(
       input.gameState,
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
           ? {
               title: `${tavernBossProfile.name} / ${tavernBossProfile.specialty}`,
diff --git a/src/application/house-modules/temple-house/temple-house-house-module.ts b/src/application/house-modules/temple-house/temple-house-house-module.ts
index 93f190ff..62aadb5e 100644
--- a/src/application/house-modules/temple-house/temple-house-house-module.ts
+++ b/src/application/house-modules/temple-house/temple-house-house-module.ts
@@ -61,20 +61,21 @@ import {
 import {
   ACTIVITY_COMPLETION_STAMINA_COST,
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
 } from "../../time/council-attendance";
 import {
@@ -1629,21 +1630,22 @@ function getDailyTempleTasks(
 }
 
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
 ): Array<{
   characterId: string;
@@ -4413,75 +4415,81 @@ export const templeHouseHouseModule: HouseModuleDefinition<"temple-house"> = {
           ) ?? null;
     const meetingParticipantIds = getTempleMeetingParticipantIds(
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
               position: "right",
               textLines:
diff --git a/tests/robustness.test.cjs b/tests/robustness.test.cjs
index 0d26865a..a872675a 100644
--- a/tests/robustness.test.cjs
+++ b/tests/robustness.test.cjs
@@ -3819,20 +3819,127 @@ test("primary house actor roster helper deduplicates actors without losing the f
       { characterId: "char.guest", name: "Guest Duplicate" },
     ],
   });
 
   assert.deepEqual(
     roster.map((actor) => actor.name),
     ["Owner", "Guest"]
   );
 });
 
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
 test("house enter and leave keep session wiring and interval side effects consistent", () => {
   const state = createBaseState();
   const enterResult = grainShopHouseModule.enter({
     gameState: state,
     characterDefinitions: prototypeCharacters,
     houseDefinition: grainShopHouse,
     playerCharacterId,
   });
 
   assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
