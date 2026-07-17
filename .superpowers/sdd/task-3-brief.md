## Task 3: House Renderer Cleanup

**Files:**
- Modify: `src/ui/views/house/house-shared-view.ts`
- Modify: `src/ui/views/house/temple-house-view.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: Task 2 view models with primary actors in `standbyRoster`.
- Produces: ordinary house markup without `c-grain-shop-dialogue__npc` or right-side idle owner markup for the temple daily owner.

- [ ] **Step 1: Write failing renderer tests**

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

- [ ] **Step 2: Run the focused renderer tests to verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Expected:

- The tavern renderer test fails because shared dialogue still emits right-side portrait markup.
- The temple renderer test fails because idle mode still emits `c-grain-shop-idle-owner`.

- [ ] **Step 3: Remove the ordinary right-side portrait from shared dialogue**

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
  const ariaLabel = options.ariaLabel ?? "瀵硅瘽";

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

- [ ] **Step 4: Remove temple idle owner rendering**

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
              asideLabel: "瀵轰腑浜虹墿",
              includeSelectedState: false,
              renderSecondaryText: (actor) =>
                actor.title == null
                  ? ""
                  : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
            })
```

Remove the conditional block that calls `renderHouseIdleOwner(...)`.

- [ ] **Step 5: Run focused renderer tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Expected:

- Both renderer tests pass.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add src/ui/views/house/house-shared-view.ts src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs
git commit -m "refactor: render house primary actors in roster"
```

Expected:

- Commit succeeds and contains only Task 3 files.

