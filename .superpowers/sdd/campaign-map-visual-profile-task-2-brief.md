## Task 2: Pass Structure Profile Through The Map View Model

**Files:**
- Modify: `src/ui/views/map/map-view.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `resolveCampaignStructureVisualProfile(profileId)`
- Produces: `MapViewModel.campaignStructureProfile`

- [ ] **Step 1: Write the failing test**

Append this test near Task 1's test in `tests/robustness.test.cjs`:

```js
test("campaign map view resolves structure profiles without scenario pack imports", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const mapViewSource = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "map-view.ts"),
    "utf8"
  );

  assert.match(mapViewSource, /resolveCampaignStructureVisualProfile/);
  assert.match(mapViewSource, /campaignStructureProfile:/);
  assert.match(mapViewSource, /input\.mapDefinition\.campaignStructureProfileId/);
  assert.doesNotMatch(mapViewSource, /scenario-packs\/zhuyuanzhang/);
  assert.doesNotMatch(mapViewSource, /content\/scenario-packs/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map view resolves structure profiles without scenario pack imports" tests/robustness.test.cjs }
```

Expected:

- `FAIL`
- Failure mentions missing `resolveCampaignStructureVisualProfile` or `campaignStructureProfile`.

- [ ] **Step 3: Import and type the profile in `map-view.ts`**

In `src/ui/views/map/map-view.ts`, add:

```ts
import {
  resolveCampaignStructureVisualProfile,
  type CampaignStructureVisualProfile,
} from "../../../content/campaign-structure-visual-profiles";
```

Remove these imports from `map-view.ts`:

```ts
import cityDepthMeshAssetUrl from "../../../3dasset/city_hun/city-hun-campaign-lowpoly.json?url";
import cityDepthTextureUrl from "../../../3dasset/city_hun/texture_pbr_20250901.png?url";
import yuanmoHexBuildingUrl from "../../../../ui/yuansu/20260715-120754.png?url";
```

Update `MapViewModel`:

```ts
  campaignStructureProfile: CampaignStructureVisualProfile | null;
```

Keep existing `cityDepthMeshAssetUrl`, `cityDepthTextureUrl`, and marker fields for this task; remove them in Task 3 after rendering is migrated.

- [ ] **Step 4: Resolve the profile in `createMapViewModel`**

In the returned object from `createMapViewModel`, add:

```ts
    campaignStructureProfile: resolveCampaignStructureVisualProfile(
      input.mapDefinition.campaignStructureProfileId
    ),
```

Temporarily set existing city depth fields from the profile:

```ts
    cityDepthMeshAssetUrl:
      resolveCampaignStructureVisualProfile(input.mapDefinition.campaignStructureProfileId)
        ?.cityDepthMeshUrl ?? null,
    cityDepthTextureUrl:
      resolveCampaignStructureVisualProfile(input.mapDefinition.campaignStructureProfileId)
        ?.cityDepthTextureUrl ?? null,
```

During implementation, refactor to avoid calling the resolver three times:

```ts
  const campaignStructureProfile = resolveCampaignStructureVisualProfile(
    input.mapDefinition.campaignStructureProfileId
  );
```

Then return `campaignStructureProfile` and derive city fields from that local constant.

- [ ] **Step 5: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map view resolves structure profiles without scenario pack imports" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 6: Commit Task 2**

Run:

```powershell
git add -- src/ui/views/map/map-view.ts tests/robustness.test.cjs
git commit -m "feat: resolve campaign structure profiles in map view"
```

