## Task 3: Replace The Hardcoded Yuanmo Building With Node-Driven Structure Markup

**Files:**
- Modify: `src/domain/map.ts`
- Modify: `src/content/yuanmo-campaign-map.ts`
- Modify: `src/ui/views/map/map-view.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: `MapNode.visualKind?: "structure"`
- Produces: `MapNode.structureVisual?: { kind: "settlement-building" }`
- Consumes: `campaignStructureProfile.settlementBuildingImageUrl`

- [ ] **Step 1: Write the failing test**

Append:

```js
test("campaign map structures are node-driven instead of hardcoded Yuanmo building state", () => {
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
  const mapViewSource = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "map-view.ts"),
    "utf8"
  );

  assert.match(mapDomainSource, /structureVisual\?:/);
  assert.match(yuanmoMapSource, /structureVisual: \{ kind: "settlement-building" \}/);
  assert.doesNotMatch(mapViewSource, /YUANMO_HEX_BUILDING/);
  assert.doesNotMatch(mapViewSource, /renderCampaignHexBuilding/);
  assert.match(mapViewSource, /renderCampaignStructureVisuals/);
  assert.match(mapViewSource, /settlementBuildingImageUrl/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures are node-driven instead of hardcoded Yuanmo building state" tests/robustness.test.cjs }
```

Expected:

- `FAIL`
- Failure mentions `YUANMO_HEX_BUILDING` still exists or `structureVisual` is missing.

- [ ] **Step 3: Add node visual metadata types**

In `src/domain/map.ts`, update `MapNode`:

```ts
export type MapNode = {
  cityId?: CityId;
  id?: string;
  label?: string;
  x: number;
  y: number;
  kind?: "city" | "settlement" | "fort" | "landmark";
  summary?: string;
  structureVisual?: {
    kind: "settlement-building";
  };
};
```

- [ ] **Step 4: Move the Haizhou structure declaration into map data**

In `src/content/yuanmo-campaign-map.ts`, find the node with:

```ts
{"id": "settlement.fenyang_province"
```

Add:

```ts
"structureVisual": {"kind": "settlement-building"}
```

Keep the existing node id, label, coordinates, kind, summary, and city mapping unchanged.

- [ ] **Step 5: Extend the marker model**

In `src/ui/views/map/map-view.ts`, add this to `CampaignMarker`:

```ts
  structureVisual: MapNode["structureVisual"] | null;
```

In `createMapViewModel`, when returning each marker, add:

```ts
          structureVisual: node.structureVisual ?? null,
```

- [ ] **Step 6: Replace the hardcoded render function**

Delete:

```ts
const YUANMO_HEX_BUILDING = {
  mapId: "map.yuanmo_campaign",
  nodeId: "settlement.fenyang_province",
  cityId: "city.kulan",
  x: 336.6,
  y: 318.6,
  travelX: 334,
  travelY: 318,
  label: "婵犲窞",
} as const;
```

Delete `renderCampaignHexBuilding`.

Add:

```ts
function renderCampaignStructureVisuals(model: MapViewModel): string {
  const buildingImageUrl =
    model.campaignStructureProfile?.settlementBuildingImageUrl ?? null;
  if (buildingImageUrl == null) {
    return "";
  }

  return model.campaignMarkers
    .filter(
      (marker) =>
        marker.structureVisual?.kind === "settlement-building" &&
        marker.isRevealed
    )
    .map((marker) => {
      const left = (marker.x / model.coordinateSpace.width) * 100;
      const bottom = (marker.y / model.coordinateSpace.height) * 100;
      const heightU = marker.x / model.coordinateSpace.width;
      const heightV = 1 - marker.y / model.coordinateSpace.height;

      return `
        <span
          class="c-campaign-hex-building"
          style="--hex-building-left:${left.toFixed(3)}%; --hex-building-bottom:${bottom.toFixed(3)}%;"
          data-campaign-structure-kind="${marker.structureVisual.kind}"
          data-terrain-projected-point="true"
          data-map-height-u="${heightU.toFixed(5)}"
          data-map-height-v="${heightV.toFixed(5)}"
          aria-label="${escapeHtml(marker.name)}"
        >
          <img
            class="c-campaign-hex-building__image"
            src="${buildingImageUrl}"
            alt=""
            aria-hidden="true"
          >
        </span>
      `;
    })
    .join("");
}
```

Replace:

```ts
${renderCampaignHexBuilding(model)}
```

with:

```ts
${renderCampaignStructureVisuals(model)}
```

Do not add a second hotspot button in this visual function. Existing `renderCampaignMarkers` remains the semantic interaction surface.

- [ ] **Step 7: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign map structures are node-driven instead of hardcoded Yuanmo building state" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 8: Commit Task 3**

Run:

```powershell
git add -- src/domain/map.ts src/content/yuanmo-campaign-map.ts src/ui/views/map/map-view.ts tests/robustness.test.cjs
git commit -m "refactor: drive campaign structure visuals from map nodes"
```

