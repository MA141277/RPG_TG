## Task 2: Default Dialogue Runtime Reducer

**Files:**
- Create: `tests/city-begging-default-runtime.test.cjs`
- Create: `src/application/playables/city-begging/city-begging-default-dialogue.ts`
- Modify: `src/domain/city-begging-minigame.ts`
- Modify: `src/application/playables/city-begging/city-begging-definition.ts`

**Interfaces:**
- Consumes:
  - `CITY_BEGGING_DEFAULT_LOCATIONS`
- Produces:
  - `type CityBeggingDefaultDialogueState`
  - `createCityBeggingDefaultDialogueState(now: number): CityBeggingDefaultDialogueState`
  - `selectCityBeggingDefaultLocation(state, locationId): CityBeggingDefaultDialogueState`
  - `selectCityBeggingDefaultOption(state, optionId, now): CityBeggingDefaultDialogueState`
  - `advanceCityBeggingDefaultThinking(state, now): CityBeggingDefaultDialogueState`

- [ ] **Step 1: Write the failing reducer test**

Add a test that creates the default state, selects `xicheng_guanyin`, then selects the `help_mend_net` option and asserts `fixedResult === "ji"` and `phase === "fortune-draw"`.

```js
test("city begging default dialogue selects a location and locks a fixed option result", async () => {
  const {
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import("../src/application/playables/city-begging/city-begging-default-dialogue.ts");

  const launched = createCityBeggingDefaultDialogueState(1000);
  assert.equal(launched.mode, "default-dialogue");
  assert.equal(launched.phase, "location-select");

  const atLocation = selectCityBeggingDefaultLocation(launched, "xicheng_guanyin");
  assert.equal(atLocation.phase, "encounter");
  assert.equal(atLocation.selectedLocationId, "xicheng_guanyin");

  const afterOption = selectCityBeggingDefaultOption(atLocation, "help_mend_net", 1200);
  assert.equal(afterOption.phase, "fortune-draw");
  assert.equal(afterOption.selectedOptionId, "help_mend_net");
  assert.equal(afterOption.fixedResult, "ji");
  assert.equal(afterOption.settlementApplied, false);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Expected:

- Missing module or missing exported functions.

- [ ] **Step 3: Implement the reducer**

Create the reducer with immutable state transitions. Use a deterministic 2400 ms thinking delay unless a caller supplies a different timestamp.

```ts
export type CityBeggingDefaultDialoguePhase =
  | "location-select"
  | "encounter"
  | "fortune-draw"
  | "thinking"
  | "outcome"
  | "completed";

export type CityBeggingDefaultDialogueState = {
  mode: "default-dialogue";
  phase: CityBeggingDefaultDialoguePhase;
  selectedLocationId: string | null;
  selectedOptionId: string | null;
  fixedResult: CityBeggingDefaultResult | null;
  thinkingUntil: number | null;
  settlementApplied: boolean;
};
```

- [ ] **Step 4: Update the playable launch path**

Modify `launchCityBeggingPlayable()` so city launches can pass `mode: "default-dialogue"` in payload later. Keep legacy minigame launch available for tests that still use it.

- [ ] **Step 5: Run targeted runtime tests**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Expected:

- New default runtime test passes.
- Existing city-begging legacy status tests still pass.


