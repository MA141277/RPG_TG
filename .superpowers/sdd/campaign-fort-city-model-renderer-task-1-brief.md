## Task 1: Engine-Owned Model Asset Registry And Boundary Tests

**Files:**
- Create: `src/assets/campaign-structures/fort-city/*.json`
- Create: `src/assets/campaign-structures/fort-wall/*`
- Create: `src/content/campaign-fort-city-visual-assets.ts`
- Create: `src/ui/views/map/campaign-fort-city-asset-registry.ts`
- Modify: `src/domain/map.ts`
- Modify: `src/content/campaign-structure-visual-profiles.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: `CampaignFortCityRulesDefinition`
- Produces: `CampaignMapNodeMeshDefinition`
- Produces: `registerCampaignFortCityAsset(id, asset)`
- Produces: `getRegisteredCampaignFortCityAsset(id)`
- Produces: `CampaignStructureVisualProfile.fortCityAssetId`
- Produces: `CampaignStructureVisualProfile.fortWallMeshUrl`

- [ ] **Step 1: Write the failing boundary test**

Add a `tests/robustness.test.cjs` test named:

```js
test("campaign fort city model assets are engine-owned and not imported by map UI", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const registryPath = path.join(
    process.cwd(),
    "src",
    "content",
    "campaign-fort-city-visual-assets.ts"
  );
  const runtimeRegistryPath = path.join(
    process.cwd(),
    "src",
    "ui",
    "views",
    "map",
    "campaign-fort-city-asset-registry.ts"
  );
  const mapViewSource = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "map-view.ts"),
    "utf8"
  );
  const profileSource = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "campaign-structure-visual-profiles.ts"),
    "utf8"
  );

  assert.equal(fs.existsSync(registryPath), true);
  assert.equal(fs.existsSync(runtimeRegistryPath), true);
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src",
        "assets",
        "campaign-structures",
        "fort-city",
        "fort-city-rules.json"
      )
    ),
    true
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src",
        "assets",
        "campaign-structures",
        "fort-wall",
        "fort-hex-wall.json"
      )
    ),
    true
  );
  assert.match(profileSource, /fortCityAssetId: "builtin\.yuanmo\.fort-city"/);
  assert.match(profileSource, /fortWallMeshUrl:/);
  assert.doesNotMatch(mapViewSource, /scenario-packs\/zhuyuanzhang\/assets\/map-nodes/);
  assert.doesNotMatch(mapViewSource, /fort-city\/building-/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model assets are engine-owned and not imported by map UI" tests/robustness.test.cjs }
```

Expected:

- `FAIL`
- Failure mentions missing `campaign-fort-city-visual-assets.ts` or missing engine-owned assets.

- [ ] **Step 3: Copy cyh model assets to engine-owned paths**

Copy these files from `codex/inspect-shoreamend-cyh`:

```powershell
New-Item -ItemType Directory -Force src/assets/campaign-structures/fort-city
New-Item -ItemType Directory -Force src/assets/campaign-structures/fort-wall
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/fort-city-rules.json > src/assets/campaign-structures/fort-city/fort-city-rules.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-01-9352cd035676.json > src/assets/campaign-structures/fort-city/building-01-9352cd035676.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-03-e1e0e8793236.json > src/assets/campaign-structures/fort-city/building-03-e1e0e8793236.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-04-part-01-front-segment.json > src/assets/campaign-structures/fort-city/building-04-part-01-front-segment.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-10-25d33f33ab0d.json > src/assets/campaign-structures/fort-city/building-10-25d33f33ab0d.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-35-eab9d92f772c.json > src/assets/campaign-structures/fort-city/building-35-eab9d92f772c.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-42-126e96a0f4c9.json > src/assets/campaign-structures/fort-city/building-42-126e96a0f4c9.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-45-part-01-main-building.json > src/assets/campaign-structures/fort-city/building-45-part-01-main-building.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-city/building-46-1b59f0c93fa9.json > src/assets/campaign-structures/fort-city/building-46-1b59f0c93fa9.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-wall/fort-hex-wall.json > src/assets/campaign-structures/fort-wall/fort-hex-wall.json
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-wall/Brick.jpg > src/assets/campaign-structures/fort-wall/Brick.jpg
git show codex/inspect-shoreamend-cyh:src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-wall/brick1.jpg > src/assets/campaign-structures/fort-wall/brick1.jpg
```

- [ ] **Step 4: Add domain model asset types**

In `src/domain/map.ts`, add the cyh `CampaignFortCityRulesDefinition` and `CampaignMapNodeMeshDefinition` types after `CampaignVegetationRulesDefinition`.

- [ ] **Step 5: Add runtime registry**

Create `src/ui/views/map/campaign-fort-city-asset-registry.ts` with:

```ts
import type {
  CampaignFortCityRulesDefinition,
  CampaignVegetationMeshDefinition,
} from "../../../domain/map";

export type RegisteredCampaignFortCityAsset = {
  rules: CampaignFortCityRulesDefinition;
  meshesByVariantId: Record<string, CampaignVegetationMeshDefinition>;
};

const campaignFortCityAssetsById = new Map<string, RegisteredCampaignFortCityAsset>();

export function registerCampaignFortCityAsset(
  id: string,
  asset: RegisteredCampaignFortCityAsset
): void {
  campaignFortCityAssetsById.set(id, asset);
}

export function getRegisteredCampaignFortCityAsset(
  id: string
): RegisteredCampaignFortCityAsset | null {
  return campaignFortCityAssetsById.get(id) ?? null;
}
```

- [ ] **Step 6: Add engine-owned asset registration**

Create `src/content/campaign-fort-city-visual-assets.ts` that imports the copied engine-owned JSON files, registers `builtin.yuanmo.fort-city`, and exports:

```ts
export const BUILTIN_YUANMO_FORT_CITY_ASSET_ID = "builtin.yuanmo.fort-city";
export const builtinYuanmoFortWallMeshUrl: string;
```

- [ ] **Step 7: Extend campaign structure profile**

In `src/content/campaign-structure-visual-profiles.ts`, import `./campaign-fort-city-visual-assets`, add `fortCityAssetId` and `fortWallMeshUrl` to `CampaignStructureVisualProfile`, and set them on `"yuanmo.campaign-structures"`.

- [ ] **Step 8: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model assets are engine-owned and not imported by map UI" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 9: Commit Task 1**

Run:

```powershell
git add -- src/domain/map.ts src/content/campaign-structure-visual-profiles.ts src/content/campaign-fort-city-visual-assets.ts src/ui/views/map/campaign-fort-city-asset-registry.ts src/assets/campaign-structures tests/robustness.test.cjs
git commit -m "feat: register campaign fort city model assets"
```

