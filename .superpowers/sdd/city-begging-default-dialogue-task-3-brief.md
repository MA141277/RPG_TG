## Task 3: Runtime Actions And Settlement Effects

**Files:**
- Modify: `tests/city-begging-default-runtime.test.cjs`
- Create: `src/application/playables/city-begging/city-begging-default-settlement.ts`
- Modify: `src/application/playables/city-begging/city-begging-definition.ts`
- Modify: `src/core/runtime/playable-runtime.ts`

**Interfaces:**
- Consumes:
  - `CityBeggingDefaultDialogueState`
  - selected content option effects.
- Produces:
  - `applyCityBeggingDefaultSettlement(input): { state: RuntimeState; characterDefinitions: CharacterDefinition[]; characterStatusById: CharacterStatusById }`
  - playable actions `select-location`, `select-option`, `confirm-fortune`, `tick`, `confirm-outcome`.

- [ ] **Step 1: Write the failing action/settlement test**

Extend `tests/city-begging-default-runtime.test.cjs`:

```js
test("city begging default runtime applies outcome effects once", async () => {
  const { runPlayableRuntime, createLaunchPlayableRequest, createPlayableActionRequest } =
    await import("../src/core/runtime/playable-runtime.ts");
  const { createInitialState } = await import("../src/application/state/create-initial-state.ts");

  const characterDefinitions = [{ id: "player", name: "鏈遍噸鍏?, stats: { gold: 0 } }];
  let runtimeState = {
    core: createInitialState(),
    app: {
      beggingMiniGameState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      cityCardDrawTestState: null,
    },
  };

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
    characterDefinitions,
    playerCharacterId: "player",
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-location", {
      locationId: "xicheng_guanyin",
    }),
    characterDefinitions,
    playerCharacterId: "player",
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-option", {
      optionId: "help_mend_net",
      now: 1200,
    }),
    characterDefinitions,
    playerCharacterId: "player",
  }).state;

  const result = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "confirm-outcome"),
    characterDefinitions,
    playerCharacterId: "player",
  });

  assert.equal(result.handled, true);
  assert.equal(result.session, null);
  assert.ok(result.state.core.runtime.variables["flag.city_begging.xicheng_guanyin.yusou_bonded"]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Expected:

- Launch payload mode or new actions are not handled yet.

- [ ] **Step 3: Implement playable action routing**

In `runPlayableRuntime`, for `resolvedRequest.playableId === "city-begging"`:

- If session state mode is `default-dialogue`, route `select-location`, `select-option`, `confirm-fortune`, `tick`, and `confirm-outcome`.
- Keep existing `pointer`, `tick`, and `complete` behavior for legacy arcade state.

- [ ] **Step 4: Implement supported effect applier**

Apply:

- `set_flag` into `state.core.runtime.variables[flagId]`.
- `add_bond`, `mod_attr`, `mod_weight`, and unsupported inventory effects into namespaced runtime variables.
- `add_grain` through existing grain inventory helper when it can be called without UI imports.
- stamina changes through existing player stamina helpers when the required player id and character data are present.

- [ ] **Step 5: Run targeted runtime tests**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs tests/runtime-dispatch-settlement.test.cjs }
```

Expected:

- New runtime tests pass.
- Existing city-begging legacy tests pass.


