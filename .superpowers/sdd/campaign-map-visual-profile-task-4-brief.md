## Task 4: Emit Profile Attributes For Future Structure Renderer Loading

**Files:**
- Modify: `src/ui/views/map/map-view.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: `data-campaign-structure-profile-id`
- Produces: `data-campaign-city-mesh-url`
- Produces: `data-campaign-city-texture-url`

- [ ] **Step 1: Write the failing test**

Append:

```js
test("campaign terrain canvas receives structure profile urls as renderer attributes", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const mapViewSource = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "map-view.ts"),
    "utf8"
  );

  assert.match(mapViewSource, /data-campaign-structure-profile-id/);
  assert.match(mapViewSource, /data-campaign-city-mesh-url/);
  assert.match(mapViewSource, /data-campaign-city-texture-url/);
  assert.match(mapViewSource, /campaignStructureProfile\?\.cityDepthMeshUrl/);
  assert.match(mapViewSource, /campaignStructureProfile\?\.cityDepthTextureUrl/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign terrain canvas receives structure profile urls as renderer attributes" tests/robustness.test.cjs }
```

Expected:

- `FAIL` if Task 2 only preserved old city fields.

- [ ] **Step 3: Derive canvas attributes from `campaignStructureProfile`**

In `renderCampaignMapVisualLayer`, replace the city depth condition with:

```ts
  const campaignStructureProfile = model.campaignStructureProfile;
  const cityDepthMeshU =
    model.cityDepthMeshCoordinate == null
      ? null
      : model.cityDepthMeshCoordinate.x / model.coordinateSpace.width;
  const cityDepthMeshV =
    model.cityDepthMeshCoordinate == null
      ? null
      : 1 - model.cityDepthMeshCoordinate.y / model.coordinateSpace.height;
  const cityDepthMeshAttributes =
    campaignStructureProfile?.cityDepthMeshUrl == null ||
    campaignStructureProfile.cityDepthTextureUrl == null ||
    cityDepthMeshU == null ||
    cityDepthMeshV == null
      ? ""
      : `
          data-campaign-structure-profile-id="${campaignStructureProfile.id}"
          data-campaign-city-mesh-url="${campaignStructureProfile.cityDepthMeshUrl}"
          data-campaign-city-texture-url="${campaignStructureProfile.cityDepthTextureUrl}"
          data-campaign-city-u="${cityDepthMeshU.toFixed(5)}"
          data-campaign-city-v="${cityDepthMeshV.toFixed(5)}"
        `;
```

Remove `cityDepthMeshAssetUrl` and `cityDepthTextureUrl` from `MapViewModel` after all usages are gone.

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign terrain canvas receives structure profile urls as renderer attributes" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit Task 4**

Run:

```powershell
git add -- src/ui/views/map/map-view.ts tests/robustness.test.cjs
git commit -m "refactor: pass campaign structure profile urls to renderer"
```

