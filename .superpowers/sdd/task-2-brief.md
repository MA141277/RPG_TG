## Task 2: Temple And Tavern View Models

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `orderHouseStandbyRoster({ primaryCharacterId, actors })` from Task 1.
- Produces: temple and tavern `HouseModuleViewModel.standbyRoster` with `defaultCharacterId` first while greeting/open dialogue is active.

- [ ] **Step 1: Write failing temple and tavern view-model tests**

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

- [ ] **Step 2: Run the focused tests to verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
```

Expected:

- Temple or tavern focused tests fail because the owner is missing from active dialogue roster or is not first.

- [ ] **Step 3: Migrate tavern `selectViewModel()`**

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

- [ ] **Step 4: Migrate temple daily `standbyRoster` ordering**

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

- [ ] **Step 5: Run the focused view-model tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
```

Expected:

- Both focused tests pass.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add src/application/house-modules/temple-house/temple-house-house-module.ts src/application/house-modules/tavern/tavern-house-module.ts tests/robustness.test.cjs
git commit -m "feat: keep house primary actors in roster"
```

Expected:

- Commit succeeds and contains only Task 2 files.

