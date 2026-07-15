# House Primary Actor Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every special house with `HouseDefinition.defaultCharacterId` enter with primary-actor dialogue, render that actor first in the left-side roster, and show the active speaker portrait through the standard dialogue box instead of an owner-only card.

**Architecture:** Keep house behavior inside the existing `moduleId` registry lifecycle. Add one shared roster-ordering helper for application view-model assembly, migrate covered modules to use it, and keep ordinary house dialogue rendering driven by speaker metadata plus the shared dialogue-box portrait pattern rather than a separate owner surface.

**Tech Stack:** TypeScript, Vite, Node test runner, CommonJS compiled test output under `.test-dist`, existing `npm run build:test`, `npm run typecheck`, `npm test`, and `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-15`
- Current Focus: `Dialogue-box speaker portrait correction complete; closeout gates remain.`
- Next Step: `Sync project progress, prepare structured closeout, push, then mark closed only after push succeeds.`
- Verification: `npm run typecheck; npm test; npm run lint:plans; focused dialogue portrait test passed`
- Notes: `Implementation finished; do not mark closed until project-progress sync and remote push succeed.`

## Progress Log

- 2026-07-15
  - Summary: `Created the executable plan for the approved house primary actor flow design.`
  - Verification: `Pending npm run lint:plans`
  - Next: `Choose execution approach, then implement Task 1 with tests first.`
- 2026-07-15
  - Summary: `Implemented shared primary actor roster ordering, migrated temple and tavern presentation, removed ordinary right-side house owner portrait rendering, and updated shared house docs.`
  - Verification: `npm run typecheck; npm test; npm run lint:plans`
  - Next: `Perform structured closeout, synchronize project-progress, and push.`
- 2026-07-15
  - Summary: `Addressed final review findings by keeping primary actors visible during active dialogue for grain shop, tea house, market house, and medicine house, then aligned market fixed-host identity so greeting dialogue, selected actor, roster action, and fixed-host actions all use the house default character id.`
  - Verification: `npm run build:test; focused primary actor robustness tests; npm run typecheck; final fix review approved`
  - Next: `Run final local verification, then leave the plan completed-but-open until project-progress sync and remote push are handled.`
- 2026-07-15
  - Summary: `Clarified that the removed right-side portrait was the old owner-only special surface, then restored the standard dialogue-box speaker portrait for ordinary house character dialogue.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue renders speaker portrait"; npm run typecheck; npm test; npm run lint:plans`
  - Next: `Commit this correction, then leave the plan completed-but-open until project-progress sync and remote push are handled.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-15-house-primary-actor-flow-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Temple and tavern already initialize greeting dialogue on enter, but their roster and dialogue rendering do not follow the new primary actor rule.`
  - `Current worktree contains unrelated battle/layout/spine changes; this plan must not revert or edit them.`

## Implementation Scope

### In Scope

- Add a shared application helper that orders and deduplicates house standby actors with `defaultCharacterId` first.
- Add regression tests proving temple and tavern expose the primary actor first in `standbyRoster`.
- Migrate temple daily view-model assembly so the abbot stays in the left roster instead of being moved to `renderHouseIdleOwner()`.
- Migrate tavern view-model assembly so the boss stays in the left roster during greeting and open dialogue.
- Keep service-house primary actors visible in `standbyRoster` during active dialogue for grain shop, tea house, market house, and medicine house.
- Align market house fixed-host runtime identity with `HouseDefinition.defaultCharacterId` where available.
- Remove ordinary owner-only house portrait rendering while keeping standard dialogue-box speaker portraits driven by `HouseDialogueViewModel`.
- Update the house interface contract and change log.

### Still Out Of Scope

- Reworking meeting or council seating layouts.
- Changing gameplay actions, prices, rewards, stamina, time costs, gambling rules, temple work rules, or event timing.
- Changing scene/dialogue runtime outside house views.
- Adding new house modules.
- Cleaning unrelated worktree changes.

## File Map

### Existing files to modify

- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Build daily `standbyRoster` with the abbot first and keep that actor present during dialogue.
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - Build `standbyRoster` with the tavern boss first even while dialogue is visible.
- `src/ui/views/house/temple-house-view.ts`
  - Stop moving the abbot to `renderHouseIdleOwner()` in ordinary daily mode.
- `src/ui/views/house/house-shared-view.ts`
  - Render ordinary character dialogue with the shared dialogue-box speaker portrait while avoiding owner-only card markup.
- `tests/robustness.test.cjs`
  - Add focused assertions for temple/tavern primary actor roster ordering and shared dialogue speaker portrait markup.
- `docs/special-house-interface.md`
  - Document the primary actor roster and dialogue rule.
- `docs/change-log.md`
  - Record the shared house flow contract change.
- `package.json`
  - No planned change.

### Existing files expected to be deleted

- None.

### New files to create

- `src/application/house/house-primary-actor-roster.ts`
  - Shared helper for deduplicating and ordering `HouseStandbyActorViewModel[]` so the primary actor is first.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:plans`

## Task 1: Shared Primary Actor Roster Helper

**Files:**
- Create: `src/application/house/house-primary-actor-roster.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `HouseStandbyActorViewModel` from `src/domain/house-module.ts`.
- Produces: `orderHouseStandbyRoster(input: { primaryCharacterId: string | null; actors: HouseStandbyActorViewModel[] }): HouseStandbyActorViewModel[]`.

- [x] **Step 1: Write the failing helper tests**

Add this import near the other `.test-dist` imports in `tests/robustness.test.cjs`:

```js
const {
  orderHouseStandbyRoster,
} = require("../.test-dist/application/house/house-primary-actor-roster.js");
```

Add these tests near other house tests in `tests/robustness.test.cjs`:

```js
test("primary house actor roster helper places the default actor first", () => {
  const roster = orderHouseStandbyRoster({
    primaryCharacterId: "char.owner",
    actors: [
      { characterId: "char.guest", name: "Guest" },
      { characterId: "char.owner", name: "Owner", actionId: "open-owner-dialogue" },
      { characterId: "char.extra", name: "Extra" },
    ],
  });

  assert.deepEqual(
    roster.map((actor) => actor.characterId),
    ["char.owner", "char.guest", "char.extra"]
  );
  assert.equal(roster[0].actionId, "open-owner-dialogue");
});

test("primary house actor roster helper deduplicates actors without losing the first primary model", () => {
  const roster = orderHouseStandbyRoster({
    primaryCharacterId: "char.owner",
    actors: [
      { characterId: "char.owner", name: "Owner", actionId: "open-owner-dialogue" },
      { characterId: "char.guest", name: "Guest" },
      { characterId: "char.owner", name: "Owner Duplicate" },
      { characterId: "char.guest", name: "Guest Duplicate" },
    ],
  });

  assert.deepEqual(
    roster.map((actor) => actor.name),
    ["Owner", "Guest"]
  );
});
```

- [x] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"
```

Expected:

- `npm run build:test` fails because `src/application/house/house-primary-actor-roster.ts` does not exist, or the focused node test fails because `orderHouseStandbyRoster` is not exported.

- [x] **Step 3: Implement the helper**

Create `src/application/house/house-primary-actor-roster.ts`:

```ts
import type { HouseStandbyActorViewModel } from "../../domain/house-module";

export function orderHouseStandbyRoster(input: {
  primaryCharacterId: string | null;
  actors: HouseStandbyActorViewModel[];
}): HouseStandbyActorViewModel[] {
  const seenCharacterIds = new Set<string>();
  const dedupedActors: HouseStandbyActorViewModel[] = [];

  for (const actor of input.actors) {
    if (seenCharacterIds.has(actor.characterId)) {
      continue;
    }
    seenCharacterIds.add(actor.characterId);
    dedupedActors.push(actor);
  }

  if (input.primaryCharacterId == null) {
    return dedupedActors;
  }

  const primaryActor = dedupedActors.find(
    (actor) => actor.characterId === input.primaryCharacterId
  );
  if (primaryActor == null) {
    return dedupedActors;
  }

  return [
    primaryActor,
    ...dedupedActors.filter(
      (actor) => actor.characterId !== input.primaryCharacterId
    ),
  ];
}
```

- [x] **Step 4: Run the focused helper tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"
```

Expected:

- `npm run build:test` exits with code 0.
- Both focused helper tests pass.

- [x] **Step 5: Commit Task 1**

Run:

```bash
git add src/application/house/house-primary-actor-roster.ts tests/robustness.test.cjs
git commit -m "test: add house primary actor roster helper"
```

Expected:

- Commit succeeds and contains only Task 1 files.

## Task 2: Temple And Tavern View Models

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `orderHouseStandbyRoster({ primaryCharacterId, actors })` from Task 1.
- Produces: temple and tavern `HouseModuleViewModel.standbyRoster` with `defaultCharacterId` first while greeting/open dialogue is active.

- [x] **Step 1: Write failing temple and tavern view-model tests**

Add these tests to `tests/robustness.test.cjs`:

```js
test("primary house actor appears first in temple daily roster during greeting", () => {
  const state = createInitialState({
    cards: prototypeCards,
    characters: prototypeCharacters,
    houses: prototypeHouses,
    cityEntries: prototypeCityEntries,
    map: prototypeMap,
  });
  const entered = templeHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const viewModel = templeHouseHouseModule.selectViewModel({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: entered.sessionState,
  });

  assert.equal(viewModel.dialogue?.characterId, templeHouse.defaultCharacterId);
  assert.equal(viewModel.standbyRoster[0]?.characterId, templeHouse.defaultCharacterId);
  assert.ok(
    viewModel.standbyRoster.some(
      (actor) => actor.characterId === templeHouse.defaultCharacterId
    )
  );
});

test("primary house actor appears first in tavern roster during greeting", () => {
  const state = createInitialState({
    cards: prototypeCards,
    characters: prototypeCharacters,
    houses: prototypeHouses,
    cityEntries: prototypeCityEntries,
    map: prototypeMap,
  });
  const entered = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const viewModel = tavernHouseModule.selectViewModel({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: entered.sessionState,
  });

  assert.equal(viewModel.dialogue?.characterId, tavernHouse.defaultCharacterId);
  assert.equal(viewModel.standbyRoster[0]?.characterId, tavernHouse.defaultCharacterId);
  assert.ok(viewModel.standbyRoster[0]?.actionId);
});
```

- [x] **Step 2: Run the focused tests to verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
```

Expected:

- Temple or tavern focused tests fail because the owner is missing from active dialogue roster or is not first.

- [x] **Step 3: Migrate tavern `selectViewModel()`**

In `src/application/house-modules/tavern/tavern-house-module.ts`, import the helper:

```ts
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
```

Replace the `standbyRoster: isIdle ? [...] : []` expression in `selectViewModel()` with a roster that is always present:

```ts
const tavernPrimaryActorId =
  input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId;
const tavernBossActor = {
  characterId: tavernPrimaryActorId,
  name: tavernBossProfile.name,
  title: tavernBossProfile.title,
  actionId: "open-boss-dialogue",
  isSelected: !isIdle,
};
```

Use it in the returned view model:

```ts
standbyRoster: orderHouseStandbyRoster({
  primaryCharacterId: tavernPrimaryActorId,
  actors: [tavernBossActor],
}),
```

Keep the existing dialogue, action container, status card, overlay, and leave action behavior unchanged.

- [x] **Step 4: Migrate temple daily `standbyRoster` ordering**

In `src/application/house-modules/temple-house/temple-house-house-module.ts`, import the helper:

```ts
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
```

After `const standbyCharacterIds = ...`, add a daily roster actor list before the `return`:

```ts
const standbyActors = standbyCharacterIds.map((characterId) => {
  const characterDefinition = input.characterDefinitions.find(
    (candidateCharacter) => candidateCharacter.id === characterId
  );
  assertExists(
    characterDefinition,
    `Temple standby character not found for id "${characterId}".`
  );
  return {
    characterId: characterDefinition.id,
    name: characterDefinition.name,
    ...(sessionState.mode === "daily" &&
    characterDefinition.id === abbotCharacter.id
      ? { actionId: "open-abbot-dialogue" }
      : {}),
    ...(sessionState.mode === "meeting" &&
    characterDefinition.id === input.playerCharacterId
      ? { isSelected: true }
      : sessionState.mode === "meeting"
        ? { isSelected: false }
        : characterDefinition.id === dialogueSpeaker.id
          ? { isSelected: true }
          : {}),
    ...(characterDefinition.id === abbotCharacter.id
      ? {
          avatarArtClassName: "c-temple-house-avatar-art--abbot",
          portraitArtClassName: "c-temple-house-portrait-art--abbot",
        }
      : characterDefinition.id === input.playerCharacterId
        ? {
            avatarArtClassName: "c-temple-house-avatar-art--player",
            portraitArtClassName: "c-temple-house-portrait-art--player",
          }
        : {
            avatarArtClassName: "c-temple-house-avatar-art--senior-monk",
            portraitArtClassName: "c-temple-house-portrait-art--senior-monk",
          }),
    ...(characterDefinition.title == null
      ? {}
      : { title: characterDefinition.title }),
  };
});
const orderedStandbyActors =
  sessionState.mode === "meeting"
    ? standbyActors
    : orderHouseStandbyRoster({
        primaryCharacterId: input.houseDefinition.defaultCharacterId,
        actors: standbyActors,
      });
```

Replace the existing inline `standbyRoster: standbyCharacterIds.map(...)` expression with:

```ts
standbyRoster: orderedStandbyActors,
```

- [x] **Step 5: Run the focused view-model tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
```

Expected:

- Both focused tests pass.

- [x] **Step 6: Commit Task 2**

Run:

```bash
git add src/application/house-modules/temple-house/temple-house-house-module.ts src/application/house-modules/tavern/tavern-house-module.ts tests/robustness.test.cjs
git commit -m "feat: keep house primary actors in roster"
```

Expected:

- Commit succeeds and contains only Task 2 files.

## Task 3: House Renderer Cleanup

**Files:**
- Modify: `src/ui/views/house/house-shared-view.ts`
- Modify: `src/ui/views/house/temple-house-view.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: Task 2 view models with primary actors in `standbyRoster`.
- Produces: ordinary house markup without `c-grain-shop-dialogue__npc` or right-side idle owner markup for the temple daily owner.

- [x] **Step 1: Write failing renderer tests**

Add this import near existing render imports in `tests/robustness.test.cjs`:

```js
const {
  renderTavernHouseView,
} = require("../.test-dist/ui/views/house/tavern-house-view.js");
```

Add these tests:

```js
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
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const viewModel = tavernHouseModule.selectViewModel({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: entered.sessionState,
  });
  const markup = renderTavernHouseView(viewModel);

  assert.match(markup, /c-grain-shop-dialogue__text/u);
  assert.doesNotMatch(markup, /c-grain-shop-dialogue__npc/u);
  assert.doesNotMatch(markup, /c-grain-shop-portrait/u);
});

test("temple daily view keeps abbot in left roster instead of right owner slot", () => {
  const state = createInitialState({
    cards: prototypeCards,
    characters: prototypeCharacters,
    houses: prototypeHouses,
    cityEntries: prototypeCityEntries,
    map: prototypeMap,
  });
  const entered = templeHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const viewModel = templeHouseHouseModule.selectViewModel({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...entered.sessionState,
      dialoguePhase: "idle",
    },
  });
  const markup = renderTempleHouseView(viewModel);

  assert.match(markup, /c-grain-shop-npc-idle/u);
  assert.doesNotMatch(markup, /c-grain-shop-idle-owner/u);
});
```

- [x] **Step 2: Run the focused renderer tests to verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Expected:

- The tavern renderer test fails because shared dialogue still emits right-side portrait markup.
- The temple renderer test fails because idle mode still emits `c-grain-shop-idle-owner`.

- [x] **Step 3: Remove the ordinary right-side portrait from shared dialogue**

In `src/ui/views/house/house-shared-view.ts`, update `renderHouseDialogue()` so the footer returns only text content for ordinary house dialogue:

```ts
export function renderHouseDialogue(
  viewModel: HouseModuleViewModel,
  options: DialogueOptions = {}
): string {
  if (viewModel.dialogue == null) {
    return "";
  }

  const clickable = viewModel.dialogue.advanceActionId != null;
  const footerClassName = options.footerClassName ?? "c-grain-shop-dialogue";
  const ariaLabel = options.ariaLabel ?? "对话";

  return `
    <footer class="${footerClassName}" aria-label="${ariaLabel}">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-house-action="${viewModel.dialogue.advanceActionId}" role="button" tabindex="0"` : ""}
      >
        ${
          viewModel.dialogue.mode === "character" &&
          viewModel.dialogue.speakerName != null
            ? `<p class="c-grain-shop-dialogue__speaker">${viewModel.dialogue.speakerName}</p>`
            : ""
        }
        ${viewModel.dialogue.textLines
          .map((line) => `<p class="c-grain-shop-dialogue__line">${line}</p>`)
          .join("")}
        ${
          viewModel.dialogue.advanceHintText == null
            ? ""
            : `<p class="c-grain-shop-dialogue__hint">${viewModel.dialogue.advanceHintText}</p>`
        }
      </div>
    </footer>
  `;
}
```

If the exact Chinese default aria label must stay byte-for-byte compatible with the existing mojibake source, keep the existing `ariaLabel` fallback string and only remove the portrait block.

- [x] **Step 4: Remove temple idle owner rendering**

In `src/ui/views/house/temple-house-view.ts`, remove `renderHouseIdleOwner` from the import list and replace the owner-splitting block:

```ts
  const isMeeting = viewModel.standbyRoster.some(
    (actor) => actor.isSelected != null
  );
  const isIdle = viewModel.dialogue == null;
```

Keep the non-meeting roster rendering pointed at `viewModel.standbyRoster`:

```ts
          : renderHouseStandbyRoster(viewModel, {
              asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
              asideLabel: "寺中人物",
              includeSelectedState: false,
              renderSecondaryText: (actor) =>
                actor.title == null
                  ? ""
                  : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
            })
```

Remove the conditional block that calls `renderHouseIdleOwner(...)`.

- [x] **Step 5: Run focused renderer tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Expected:

- Both renderer tests pass.

- [x] **Step 6: Commit Task 3**

Run:

```bash
git add src/ui/views/house/house-shared-view.ts src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs
git commit -m "refactor: render house primary actors in roster"
```

Expected:

- Commit succeeds and contains only Task 3 files.

## Task 4: Documentation And Full Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md`

**Interfaces:**
- Consumes: implementation from Tasks 1-3.
- Produces: updated shared house contract documentation, change log, and plan execution state.

- [x] **Step 1: Update the house interface contract**

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

- [x] **Step 2: Update the change log**

Add this entry at the top of `docs/change-log.md` under the current heading/list:

```md
- House primary actors now follow a shared flow: houses with `defaultCharacterId` enter through primary-actor dialogue, keep that actor first in `standbyRoster`, and render ordinary house dialogue without a separate right-side owner portrait. Temple abbot and tavern boss behavior now use the same rule as other special houses.
```

- [x] **Step 3: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
```

Expected:

- Build test succeeds.
- All tests matching `primary house actor` pass.

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run lint:plans
```

Expected:

- All commands exit with code 0.

- [x] **Step 5: Update this plan execution state**

Update the top of this file:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-15`
- Current Focus: `Implementation complete; closeout gates remain.`
- Next Step: `Sync project progress, prepare structured closeout, push, then mark closed only after push succeeds.`
- Verification: `npm run typecheck; npm test; npm run lint:plans`
- Notes: `Implementation finished; do not mark closed until project-progress sync and remote push succeed.`
```

Append this progress log entry:

```md
- 2026-07-15
  - Summary: `Implemented shared primary actor roster ordering, migrated temple and tavern presentation, removed ordinary right-side house owner portrait rendering, and updated shared house docs.`
  - Verification: `npm run typecheck; npm test; npm run lint:plans`
  - Next: `Perform structured closeout, synchronize project-progress, and push.`
```

- [x] **Step 6: Commit Task 4**

Run:

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md
git commit -m "docs: document house primary actor flow"
```

Expected:

- Commit succeeds and contains docs plus this plan update only.

## Task 5: Dialogue-Box Speaker Portrait Correction

**Files:**
- Modify: `src/ui/views/house/house-shared-view.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/specs/2026-07-15-house-primary-actor-flow-design.md`
- Modify: `docs/superpowers/plans/2026-07-15-house-primary-actor-flow-plan.md`

**Interfaces:**
- Consumes: `HouseDialogueViewModel.mode`, `speakerName`, `portraitImageUrl`, and `portraitArtClassName`.
- Produces: shared house character dialogue markup with `c-grain-shop-dialogue__npc` and `c-grain-shop-portrait` as the standard dialogue-box speaker portrait, while keeping `c-grain-shop-idle-owner` out of ordinary dialogue.

- [x] **Step 1: Write the failing dialogue portrait test**

Updated `tests/robustness.test.cjs` so `primary house actor dialogue renders speaker portrait on the dialogue box` expects:

```js
assert.match(markup, /c-grain-shop-dialogue__npc/u);
assert.match(markup, /c-grain-shop-portrait/u);
assert.match(markup, /c-grain-shop-portrait__image/u);
assert.doesNotMatch(markup, /c-grain-shop-idle-owner/u);
```

- [x] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue renders speaker portrait"
```

Observed:

- The focused test failed because the rendered tavern house markup did not contain `c-grain-shop-dialogue__npc`.

- [x] **Step 3: Restore the standard speaker portrait in shared dialogue**

Updated `renderHouseDialogue()` in `src/ui/views/house/house-shared-view.ts` to render the active character speaker portrait from `HouseDialogueViewModel` after the text box, matching the scene dialogue structure.

- [x] **Step 4: Run the focused test to verify it passes**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue renders speaker portrait"
```

Observed:

- `npm run build:test` exited with code 0.
- The focused test passed.

- [x] **Step 5: Update shared contract docs**

Updated the spec, interface contract, change log, and this plan so the rule distinguishes owner-only portrait cards from standard dialogue-box speaker portraits.

## Exit Check

- [x] Temple daily `standbyRoster[0]` is the temple `defaultCharacterId`.
- [x] Tavern greeting/open `standbyRoster[0]` is the tavern `defaultCharacterId`.
- [x] Ordinary house dialogue emits the standard dialogue-box speaker portrait.
- [x] Ordinary house dialogue does not emit a separate owner-only portrait card.
- [x] Temple ordinary daily view no longer emits a right-side idle owner card.
- [x] `docs/special-house-interface.md` documents the primary actor roster rule.
- [x] `docs/change-log.md` records the shared flow change.
- [x] `src/main.ts` has no new house-specific business branch for this work.
- [ ] Project progress sync is updated if this child state changes.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

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
