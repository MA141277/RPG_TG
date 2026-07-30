## Task 1: Default Content Contract

**Files:**
- Create: `tests/city-begging-default-content.test.cjs`
- Create: `src/content/playables/city-begging-default-content.ts`
- Read: `docs/superpowers/specs/2026-07-31-city-begging-default-dialogue-design.md`

**Interfaces:**
- Produces:
  - `CITY_BEGGING_DEFAULT_LOCATIONS: readonly CityBeggingDefaultLocation[]`
  - `type CityBeggingDefaultResult = "ji" | "xiong" | "ping"`
  - `type CityBeggingDefaultEffect = { type: string; [key: string]: unknown }`
  - `getCityBeggingDefaultLocation(locationId: string): CityBeggingDefaultLocation | null`

- [ ] **Step 1: Write the failing content contract test**

Add this shape to `tests/city-begging-default-content.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("city begging default content contains three fixed Haozhou locations with three options each", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  assert.equal(CITY_BEGGING_DEFAULT_LOCATIONS.length, 3);
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.locationId),
    ["dongshi_mishi", "xicheng_guanyin", "beicheng_ciji"]
  );
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.baselineResult),
    ["xiong", "ping", "ji"]
  );

  for (const location of CITY_BEGGING_DEFAULT_LOCATIONS) {
    assert.equal(location.options.length, 3, location.locationId);
    assert.ok(location.encounterText.length > 20, location.locationId);
    assert.ok(location.closingText.length > 0, location.locationId);
    assert.ok(typeof location.backgroundId === "string");
  }
});

test("city begging default options lock the requested fixed fortune table", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  const table = Object.fromEntries(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => [
      location.locationId,
      location.options.map((option) => option.fixedResult),
    ])
  );

  assert.deepEqual(table, {
    dongshi_mishi: ["xiong", "xiong", "xiong"],
    xicheng_guanyin: ["ping", "ping", "ji"],
    beicheng_ciji: ["ji", "ji", "ping"],
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-content.test.cjs }
```

Expected:

- `ERR_MODULE_NOT_FOUND` or export-not-found for `city-begging-default-content.ts`.

- [ ] **Step 3: Implement the content table**

Create `src/content/playables/city-begging-default-content.ts` with the typed location records. Preserve the exact Chinese copy from the user request. Use these result keys:

```ts
export type CityBeggingDefaultResult = "ji" | "xiong" | "ping";

export type CityBeggingDefaultEffect =
  | { type: "add_grain"; grainKind: "coarse" | "vegetarian"; amountSheng: number; quality?: string }
  | { type: "add_item"; itemId: string; quantity: number }
  | { type: "mod_attr"; attrId: string; delta: number; label: string }
  | { type: "add_bond"; bondId: string; delta: number; label: string }
  | { type: "set_flag"; flagId: string; value: boolean }
  | { type: "injure"; staminaDelta: number; label: string }
  | { type: "mod_weight"; key: string; result: CityBeggingDefaultResult; delta: number; label: string }
  | { type: "restore_stamina"; amount: number; label: string }
  | { type: "restore_stamina_full"; label: string };

export type CityBeggingDefaultOption = {
  optionId: string;
  optionText: string;
  fixedResult: CityBeggingDefaultResult;
  outcomeText: string;
  effects: CityBeggingDefaultEffect[];
};

export type CityBeggingDefaultLocation = {
  locationId: "dongshi_mishi" | "xicheng_guanyin" | "beicheng_ciji";
  title: string;
  baselineResult: CityBeggingDefaultResult;
  backgroundId: "liangpu" | "chengzhen" | "temple";
  npc: {
    id: string;
    name: string;
  };
  encounterText: string;
  closingText: string;
  options: readonly CityBeggingDefaultOption[];
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-content.test.cjs }
```

Expected:

- Both tests pass.


