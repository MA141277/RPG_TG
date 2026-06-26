# Zhuyuanzhang Pack Loader Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `zhuyuanzhang` into a pure manifest-driven scenario pack and make default/base content use the same shared loader path as other scenario packs.

**Architecture:** Move all remaining `zhuyuanzhang` content into JSON split tables, replace pack-private TypeScript assembly with a shared content-pack loader, and switch scenario registration to catalog-driven manifest loading. Keep runtime consumers reading `ContentPackDefinition` / `ActiveGameContent` rather than pack-specific sources.

**Tech Stack:** TypeScript, JSON content packs, Node test runner, existing `createActiveGameContent` merge pipeline

---

## File Map

### Existing files to modify

- `tests/robustness.test.cjs`
  - Add red/green regression tests for historical split tables, catalog loading, shared loader behavior, and removal of pack-private assembly.
- `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - Declare all pack-owned split tables, including historical tables.
- `src/content/scenario-packs/zhuyuanzhang/maps.json`
  - Replace `imageAssetId` style fields with relative asset URLs.
- `src/content/base-game-content-pack.ts`
  - Stop assembling `zhuyuanzhang` via `base-content-pack.ts`; use shared manifest loader or pack JSON import path instead.
- `src/content/scenarios/scenario-profiles.ts`
  - Replace pack-private profile import path with catalog-driven data.
- `src/application/scenario/scenario-pack-loader.ts`
  - Extract or extend shared manifest hydration logic for `ContentPackDefinition`.
- `tsconfig.json`
  - Keep shared JSON / asset typing aligned with new loader path if needed.
- `tsconfig.test.json`
  - Ensure test compile includes any new shared loader / declarations.

### Existing files expected to be deleted

- `src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts`

### New files to create

- `src/content/scenario-packs/zhuyuanzhang/historical-characters.json`
- `src/content/scenario-packs/zhuyuanzhang/historical-city-rosters.json`
- `src/content/scenario-packs/zhuyuanzhang/historical-character-id-map.json`
- `src/content/scenario-packs/catalog.json`
- `src/application/content/content-pack-loader.ts`
  - Shared content-pack loader returning `ContentPackDefinition` from a manifest + split tables.
- `src/application/content/catalog-loader.ts`
  - Shared catalog parsing / default pack lookup.
- `src/content/scenario-packs/zhuyuanzhang/assets/maps/*`
  - Pack-local copied map assets referenced by relative path in `maps.json`.

## Task 1: Add failing tests for remaining pack-owned historical data

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/content/base-game-content-pack.ts`
- Read: `src/content/prototype-world.ts`
- Read: `src/content/zhu-yuanzhang-early-characters.ts`
- Read: `src/content/scenario-packs/zhuyuanzhang/pack.json`

- [ ] **Step 1: Write the failing tests**

Add tests covering:

```js
test("zhuyuanzhang pack manifest includes historical split tables", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const packManifest = JSON.parse(
    fs.readFileSync(path.join(packRoot, "pack.json"), "utf8")
  );

  assert.equal(
    packManifest.files.historicalCharacters,
    "historical-characters.json"
  );
  assert.equal(
    packManifest.files.historicalCityRosters,
    "historical-city-rosters.json"
  );
  assert.equal(
    packManifest.files.historicalCharacterIdByCharacterId,
    "historical-character-id-map.json"
  );
});

test("zhuyuanzhang pack-local historical tables contain zhu yuanzhang records", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const historicalCharacters = JSON.parse(
    fs.readFileSync(path.join(packRoot, "historical-characters.json"), "utf8")
  );
  const historicalCityRosters = JSON.parse(
    fs.readFileSync(path.join(packRoot, "historical-city-rosters.json"), "utf8")
  );
  const historicalCharacterMap = JSON.parse(
    fs.readFileSync(path.join(packRoot, "historical-character-id-map.json"), "utf8")
  );

  assert.equal(
    historicalCharacters.some((entry) => entry.id === "zyz.character.zhu_yuanzhang"),
    true
  );
  assert.equal(
    historicalCityRosters.some((entry) => entry.cityNodeId === "city.kulan"),
    true
  );
  assert.equal(
    typeof historicalCharacterMap["char.yuanmo.zhu_yuanzhang"],
    "string"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- --test-name-pattern "zhuyuanzhang pack manifest includes historical split tables|zhuyuanzhang pack-local historical tables contain zhu yuanzhang records"
```

Expected:

- `FAIL`
- Missing manifest keys and/or missing JSON files

- [ ] **Step 3: Write minimal implementation**

Create the three JSON files from existing `zhu-yuanzhang-early-characters` / prototype-backed data, then update `src/content/scenario-packs/zhuyuanzhang/pack.json`:

```json
{
  "files": {
    "historicalCharacters": "historical-characters.json",
    "historicalCityRosters": "historical-city-rosters.json",
    "historicalCharacterIdByCharacterId": "historical-character-id-map.json"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- --test-name-pattern "zhuyuanzhang pack manifest includes historical split tables|zhuyuanzhang pack-local historical tables contain zhu yuanzhang records"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/content/scenario-packs/zhuyuanzhang/pack.json src/content/scenario-packs/zhuyuanzhang/historical-characters.json src/content/scenario-packs/zhuyuanzhang/historical-city-rosters.json src/content/scenario-packs/zhuyuanzhang/historical-character-id-map.json
git commit -m "refactor: move zhuyuanzhang historical data into pack tables"
```

## Task 2: Add failing tests for shared loader ownership of base/default pack content

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/content/base-game-content-pack.ts`
- Read: `src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts`

- [ ] **Step 1: Write the failing tests**

Add tests that lock the new boundary:

```js
test("base game content no longer imports zhuyuanzhang base-content-pack", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "base-game-content-pack.ts"),
    "utf8"
  );

  assert.equal(source.includes("scenario-packs/zhuyuanzhang/base-content-pack"), false);
});

test("zhuyuanzhang pack directory has no TypeScript assembly entrypoint", () => {
  const packDir = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const tsFiles = fs
    .readdirSync(packDir)
    .filter((fileName) => fileName.endsWith(".ts"));

  assert.deepEqual(tsFiles, []);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- --test-name-pattern "base game content no longer imports zhuyuanzhang base-content-pack|zhuyuanzhang pack directory has no TypeScript assembly entrypoint"
```

Expected:

- `FAIL`
- Current import and current `base-content-pack.ts` presence are detected

- [ ] **Step 3: Write minimal implementation**

Implement only enough to break the dependency:

- move any remaining data ownership out of `base-content-pack.ts`
- switch `base-game-content-pack.ts` to the new shared loader / pack data path
- delete `src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts`

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- --test-name-pattern "base game content no longer imports zhuyuanzhang base-content-pack|zhuyuanzhang pack directory has no TypeScript assembly entrypoint"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/content/base-game-content-pack.ts
git rm src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts
git commit -m "refactor: remove zhuyuanzhang pack assembly entrypoint"
```

## Task 3: Move map resource hydration into pure pack data + shared loader

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/content/scenario-packs/zhuyuanzhang/maps.json`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/HD.png`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/tie1.png`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-map-regions.png`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-map-heights.png`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-map-ground-types.png`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-map-trade-routes.png`
- Create: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-map-climates.png`
- Create: `src/application/content/content-pack-loader.ts`

- [ ] **Step 1: Write the failing tests**

Add tests:

```js
test("zhuyuanzhang maps use relative pack asset urls instead of imageAssetId", () => {
  const maps = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "maps.json"
      ),
      "utf8"
    )
  );
  const firstMap = maps[0];

  assert.equal(firstMap.primaryImageAssetId == null, true);
  assert.equal(firstMap.primaryImageUrl.startsWith("./assets/maps/"), true);
});
```

and a loader-path test:

```js
test("content pack loader resolves zhuyuanzhang map asset urls", async () => {
  const { loadContentPackFromManifestText } = await import(
    "../.test-dist/application/content/content-pack-loader.js"
  );
  const manifestText = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang",
      "pack.json"
    ),
    "utf8"
  );

  const pack = await loadContentPackFromManifestText(
    manifestText,
    "file:///virtual/scenario-packs/zhuyuanzhang/pack.json"
  );

  assert.equal(typeof pack.maps?.[0]?.primaryImageUrl, "string");
  assert.equal(pack.maps?.[0]?.primaryImageUrl.includes("/assets/maps/HD.png"), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- --test-name-pattern "zhuyuanzhang maps use relative pack asset urls instead of imageAssetId|content pack loader resolves zhuyuanzhang map asset urls"
```

Expected:

- `FAIL`
- Map JSON still uses asset ids and/or shared loader does not exist yet

- [ ] **Step 3: Write minimal implementation**

Implement:

- copy pack-owned map assets under `src/content/scenario-packs/zhuyuanzhang/assets/maps/`
- replace `primaryImageAssetId`, `regionOverlayImageAssetId`, and `layers[*].imageAssetId` with relative URL strings
- create `src/application/content/content-pack-loader.ts` with shared map URL normalization

Core helper shape:

```ts
function resolvePackRelativeUrl(
  manifestUrl: string,
  value: string | undefined
): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (/^(https?:|file:|\/)/.test(value)) {
    return value;
  }
  return new URL(value, manifestUrl).href;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- --test-name-pattern "zhuyuanzhang maps use relative pack asset urls instead of imageAssetId|content pack loader resolves zhuyuanzhang map asset urls"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/content/scenario-packs/zhuyuanzhang/maps.json src/content/scenario-packs/zhuyuanzhang/assets/maps src/application/content/content-pack-loader.ts
git commit -m "refactor: move pack map hydration into shared loader"
```

## Task 4: Switch default/base content assembly to the shared loader

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/content/base-game-content-pack.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/application/content/default-runtime-content.ts`
- Modify: `tsconfig.json`
- Modify: `tsconfig.test.json`

- [ ] **Step 1: Write the failing tests**

Add tests covering:

```js
test("base game content pack is sourced from zhuyuanzhang manifest tables", async () => {
  const { createBaseGameContentPack } = await import(
    "../.test-dist/content/base-game-content-pack.js"
  );

  const pack = await createBaseGameContentPack();

  assert.equal(pack.id, "scenario-pack.zhu_yuanzhang.monk_opening");
  assert.equal(
    pack.historicalCharacters?.some((entry) => entry.id === "zyz.character.zhu_yuanzhang"),
    true
  );
});
```

and:

```js
test("default runtime content reads from shared base game content path", async () => {
  const { defaultRuntimeContent } = await import(
    "../.test-dist/application/content/default-runtime-content.js"
  );

  assert.equal(defaultRuntimeContent.cities.some((city) => city.id === "city.kulan"), true);
  assert.equal(defaultRuntimeContent.cityNpcPools.some((pool) => pool.cityId === "city.kulan"), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- --test-name-pattern "base game content pack is sourced from zhuyuanzhang manifest tables|default runtime content reads from shared base game content path"
```

Expected:

- `FAIL`
- Current default content path is still hardwired to old assembly

- [ ] **Step 3: Write minimal implementation**

Implement the shared path:

```ts
export async function createBaseGameContentPack(): Promise<ContentPackDefinition> {
  return loadContentPackFromManifestUrl(
    new URL("../content/scenario-packs/zhuyuanzhang/pack.json", import.meta.url).href
  );
}
```

If runtime still needs a sync adapter for existing tests, keep the adapter thin and manifest-driven rather than pack-private.

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- --test-name-pattern "base game content pack is sourced from zhuyuanzhang manifest tables|default runtime content reads from shared base game content path"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/content/base-game-content-pack.ts src/application/content/active-game-content.ts src/application/content/default-runtime-content.ts tsconfig.json tsconfig.test.json
git commit -m "refactor: route default content through shared pack loader"
```

## Task 5: Replace scenario registration with catalog-driven loading

**Files:**
- Modify: `tests/robustness.test.cjs`
- Create: `src/content/scenario-packs/catalog.json`
- Create: `src/application/content/catalog-loader.ts`
- Modify: `src/content/scenarios/scenario-profiles.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`

- [ ] **Step 1: Write the failing tests**

Add tests:

```js
test("scenario pack catalog declares default zhuyuanzhang and liu bang manifests", () => {
  const catalog = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "catalog.json"
      ),
      "utf8"
    )
  );

  assert.equal(catalog.some((entry) => entry.id === "scenario-pack.zhu_yuanzhang.monk_opening"), true);
  assert.equal(catalog.some((entry) => entry.id === "scenario-pack.liu_bang.pei_county_opening"), true);
  assert.equal(
    catalog.find((entry) => entry.id === "scenario-pack.zhu_yuanzhang.monk_opening")?.isDefault,
    true
  );
});

test("scenario profiles source no longer imports zhuyuanzhangScenarioProfile", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "scenarios", "scenario-profiles.ts"),
    "utf8"
  );

  assert.equal(source.includes("zhuyuanzhangScenarioProfile"), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- --test-name-pattern "scenario pack catalog declares default zhuyuanzhang and liu bang manifests|scenario profiles source no longer imports zhuyuanzhangScenarioProfile"
```

Expected:

- `FAIL`
- No catalog yet and old import still exists

- [ ] **Step 3: Write minimal implementation**

Implement:

- `catalog.json` with both pack manifests
- `catalog-loader.ts` with parser + default-pack lookup
- update `scenario-profiles.ts` to consume catalog / hydrated pack profile data instead of private imports

Target catalog entry shape:

```json
{
  "id": "scenario-pack.zhu_yuanzhang.monk_opening",
  "title": "朱元璋：皇觉寺开局",
  "manifestPath": "./zhuyuanzhang/pack.json",
  "sort": 10,
  "isDefault": true
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- --test-name-pattern "scenario pack catalog declares default zhuyuanzhang and liu bang manifests|scenario profiles source no longer imports zhuyuanzhangScenarioProfile"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/content/scenario-packs/catalog.json src/application/content/catalog-loader.ts src/content/scenarios/scenario-profiles.ts src/application/scenario/scenario-pack-loader.ts
git commit -m "refactor: drive scenario registration from pack catalog"
```

## Task 6: Run full verification and clean remaining direct pack assembly references

**Files:**
- Modify: `tests/robustness.test.cjs`
- Search: `src/**/*.ts`
- Search: `tests/**/*.cjs`

- [ ] **Step 1: Write the final failing tests / assertions**

Add one final architecture lock:

```js
test("repo no longer references zhuyuanzhang base-content-pack assembly", () => {
  const filesToCheck = [
    path.join(process.cwd(), "src", "content", "base-game-content-pack.ts"),
    path.join(process.cwd(), "src", "content", "scenarios", "scenario-profiles.ts"),
    path.join(process.cwd(), "tests", "robustness.test.cjs"),
  ];

  filesToCheck.forEach((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    assert.equal(source.includes("base-content-pack"), false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails or is meaningful**

Run:

```bash
npm test -- --test-name-pattern "repo no longer references zhuyuanzhang base-content-pack assembly"
```

Expected:

- Before cleanup: `FAIL`
- After cleanup: `PASS`

- [ ] **Step 3: Write minimal implementation**

Search and remove any remaining direct references:

```bash
rg -n "base-content-pack|zhuyuanzhangScenarioProfile|createZhuyuanzhangBaseContentPackCore" src tests
```

Then update the remaining files until the search returns no pack-private assembly references.

- [ ] **Step 4: Run all verification**

Run:

```bash
npm run typecheck
npm test
```

Expected:

- `typecheck` passes
- all tests pass

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/content/scenario-packs/catalog.json src/application/content/content-pack-loader.ts src/application/content/catalog-loader.ts src/content/base-game-content-pack.ts src/content/scenarios/scenario-profiles.ts src/application/scenario/scenario-pack-loader.ts src/content/scenario-packs/zhuyuanzhang
git commit -m "refactor: unify zhuyuanzhang with manifest-driven scenario packs"
```

## Self-Review

### Spec coverage

- Historical tables moved into pack data: covered by Task 1
- Map resources converted to pack-relative URLs: covered by Task 3
- Shared content-pack loader: covered by Tasks 3 and 4
- Default/base content uses shared loader: covered by Task 4
- Catalog-driven scenario registration: covered by Task 5
- Deletion of `zhuyuanzhang/base-content-pack.ts`: covered by Task 2
- Final removal of direct assembly references and full verification: covered by Task 6

No spec gaps remain.

### Placeholder scan

- No `TODO`, `TBD`, or “similar to Task N” placeholders remain
- Each task includes explicit files, commands, expected outcomes, and target code shapes

### Type consistency

- Historical table keys consistently use:
  - `historicalCharacters`
  - `historicalCityRosters`
  - `historicalCharacterIdByCharacterId`
- Shared loader naming consistently uses:
  - `content-pack-loader.ts`
  - `catalog-loader.ts`
- Final deletion target consistently uses:
  - `src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts`
