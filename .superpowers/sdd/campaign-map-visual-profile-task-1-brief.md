## Task 1: Add Structure Profile Domain And Registry Contract

**Files:**
- Modify: `src/domain/map.ts`
- Create: `src/content/campaign-structure-visual-profiles.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: `MapDefinition.campaignStructureProfileId?: string`
- Produces: `CampaignStructureVisualProfile`
- Produces: `resolveCampaignStructureVisualProfile(profileId: string | undefined): CampaignStructureVisualProfile | null`

- [ ] **Step 1: Write the failing test**

Append this test block near the existing campaign map asset contract tests in `tests/robustness.test.cjs`:

```js
test("campaign structure visual profiles are engine-owned and map-selected", async () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const mapDomainSource = fs.readFileSync(
    path.join(process.cwd(), "src", "domain", "map.ts"),
    "utf8"
  );
  const yuanmoMapSource = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "yuanmo-campaign-map.ts"),
    "utf8"
  );
  const profileSourcePath = path.join(
    process.cwd(),
    "src",
    "content",
    "campaign-structure-visual-profiles.ts"
  );

  assert.match(mapDomainSource, /campaignStructureProfileId\?: string/);
  assert.match(yuanmoMapSource, /campaignStructureProfileId: "yuanmo\.campaign-structures"/);
  assert.equal(fs.existsSync(profileSourcePath), true);

  const profileSource = fs.readFileSync(profileSourcePath, "utf8");
  assert.match(profileSource, /export type CampaignStructureVisualProfile/);
  assert.match(profileSource, /resolveCampaignStructureVisualProfile/);
  assert.match(profileSource, /"yuanmo\.campaign-structures"/);
  assert.doesNotMatch(profileSource, /scenario-packs\/zhuyuanzhang/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign structure visual profiles are engine-owned and map-selected" tests/robustness.test.cjs }
```

Expected:

- `FAIL`
- Failure mentions missing `campaignStructureProfileId` or missing `campaign-structure-visual-profiles.ts`.

- [ ] **Step 3: Add the domain field**

In `src/domain/map.ts`, update `MapDefinition`:

```ts
export type MapDefinition = {
  id: MapId;
  name: string;
  backgroundId: string;
  mode?: "grid" | "campaign";
  size?: number;
  coordinateSpace?: {
    width: number;
    height: number;
  };
  displaySize?: {
    width: number;
    height: number;
  };
  primaryImageUrl?: string;
  regionOverlayImageUrl?: string;
  campaignHexGridUrl?: string;
  campaignVegetationRulesUrl?: string;
  campaignStructureProfileId?: string;
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  nodes: MapNode[];
  layers?: MapLayer[];
  stats?: MapStats;
};
```

- [ ] **Step 4: Add the engine-owned profile registry**

Create `src/content/campaign-structure-visual-profiles.ts`:

```ts
import cityDepthMeshAssetUrl from "../3dasset/city_hun/city-hun-campaign-lowpoly.json?url";
import cityDepthTextureUrl from "../3dasset/city_hun/texture_pbr_20250901.png?url";
import yuanmoHexBuildingUrl from "../../ui/yuansu/20260715-120754.png?url";

export type CampaignStructureVisualProfile = {
  id: string;
  cityDepthMeshUrl: string | null;
  cityDepthTextureUrl: string | null;
  settlementBuildingImageUrl: string | null;
};

const campaignStructureVisualProfilesById: Record<
  string,
  CampaignStructureVisualProfile
> = {
  "yuanmo.campaign-structures": {
    id: "yuanmo.campaign-structures",
    cityDepthMeshUrl: cityDepthMeshAssetUrl,
    cityDepthTextureUrl,
    settlementBuildingImageUrl: yuanmoHexBuildingUrl,
  },
};

export function resolveCampaignStructureVisualProfile(
  profileId: string | undefined
): CampaignStructureVisualProfile | null {
  if (profileId == null) {
    return null;
  }

  return campaignStructureVisualProfilesById[profileId] ?? null;
}
```

- [ ] **Step 5: Select the profile in the built-in map**

In `src/content/yuanmo-campaign-map.ts`, add this field to the `yuanmoCampaignMap` object near the other campaign URLs:

```ts
  campaignStructureProfileId: "yuanmo.campaign-structures",
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign structure visual profiles are engine-owned and map-selected" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 7: Commit Task 1**

Run:

```powershell
git add -- src/domain/map.ts src/content/campaign-structure-visual-profiles.ts src/content/yuanmo-campaign-map.ts tests/robustness.test.cjs
git commit -m "feat: add campaign structure visual profiles"
```

