# Review Package Task 1

Base: 9e4feb4cd871c2e25f8ec422d4dd05c449b65487
Head: b9bd39b6a3e4349db18178c1eee1fb624fd75b26

## Commits
b9bd39b6 test: add house primary actor roster helper

## Stat
 .../house/house-primary-actor-roster.ts            | 35 ++++++++++++++++++++
 tests/robustness.test.cjs                          | 37 ++++++++++++++++++++++
 2 files changed, 72 insertions(+)

## Diff
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
diff --git a/tests/robustness.test.cjs b/tests/robustness.test.cjs
index b41ea1e1..0d26865a 100644
--- a/tests/robustness.test.cjs
+++ b/tests/robustness.test.cjs
@@ -95,20 +95,23 @@ const {
   hexToCoordinate,
 } = require("../.test-dist/application/navigation/travel-to-coordinate.js");
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
   accountingGradeRewards,
 } = require("../.test-dist/content/houses/grain-shop-content.js");
@@ -3782,20 +3785,54 @@ test("grain trade fails when the player cannot afford the purchase", () => {
 
   assert.equal(result.ok, false);
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
 test("house enter and leave keep session wiring and interval side effects consistent", () => {
   const state = createBaseState();
   const enterResult = grainShopHouseModule.enter({
     gameState: state,
     characterDefinitions: prototypeCharacters,
     houseDefinition: grainShopHouse,
     playerCharacterId,
   });
 
   assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
