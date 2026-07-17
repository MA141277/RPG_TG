# Review Package Task 3 Re-Review

Base: ff376972
Head: 58535af41931454ebf4a1fd793fde0f7170ce568

## Commits
58535af4 fix: keep temple daily roster out of meeting layout
f74bc625 refactor: render house primary actors in roster

## Stat
 .superpowers/sdd/task-3-report.md       | 97 +++++++++++++++++++++++++++++++++
 src/ui/views/house/house-shared-view.ts | 25 ++-------
 src/ui/views/house/temple-house-view.ts | 38 ++-----------
 tests/robustness.test.cjs               | 62 +++++++++++++++++++++
 4 files changed, 171 insertions(+), 51 deletions(-)

## Diff
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
diff --git a/src/ui/views/house/house-shared-view.ts b/src/ui/views/house/house-shared-view.ts
index d02358b0..5f178c76 100644
--- a/src/ui/views/house/house-shared-view.ts
+++ b/src/ui/views/house/house-shared-view.ts
@@ -250,55 +250,42 @@ export function renderHouseDialogue(
   viewModel: HouseModuleViewModel,
   options: DialogueOptions = {}
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
   if (actor == null) {
     return "";
diff --git a/src/ui/views/house/temple-house-view.ts b/src/ui/views/house/temple-house-view.ts
index ebf8758d..cd16427f 100644
--- a/src/ui/views/house/temple-house-view.ts
+++ b/src/ui/views/house/temple-house-view.ts
@@ -4,21 +4,20 @@ import type {
 } from "../../../domain/house-module";
 import {
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
   " c-house-contribution-settlement c-house-temple-utility-popup";
 
@@ -518,63 +517,38 @@ function renderMeetingRoster(viewModel: HouseModuleViewModel): string {
               })}
             </article>
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
index a872675a..cadf5e31 100644
--- a/tests/robustness.test.cjs
+++ b/tests/robustness.test.cjs
@@ -36,20 +36,23 @@ const {
 } = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
 const {
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
 } = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
 const {
@@ -3926,20 +3929,79 @@ test("primary house actor appears first in tavern roster during greeting", () =>
     houseDefinition: tavernHouse,
     playerCharacterId,
     sessionState: entered.sessionState,
   });
 
   assert.equal(viewModel.dialogue?.characterId, tavernHouse.defaultCharacterId);
   assert.equal(viewModel.standbyRoster[0]?.characterId, tavernHouse.defaultCharacterId);
   assert.ok(viewModel.standbyRoster[0]?.actionId);
 });
 
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
 
   assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
