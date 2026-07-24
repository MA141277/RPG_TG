# Campaign Map Visual Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a campaign map structure visual profile seam so building/structure visuals can be renderer-owned without hardcoding Zhu Yuanzhang or Yuanmo assets in `map-view.ts`.

**Architecture:** Keep campaign map semantics in `MapDefinition` and map nodes, keep visuals in the UI renderer boundary, and resolve heavy visual resources through an engine-owned profile registry. This child is a foundation pass: it removes the current single-building hardcode and adds the profile/data handoff, but it does not port the full `shoreamend` fort/city renderer.

**Tech Stack:** TypeScript, Vite asset URL imports, Node test runner, existing `tests/robustness.test.cjs` contract tests, `npm run build:test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-25`
- Current Focus: `Plan created; waiting for explicit promotion because project-progress currently points at the faction review closeout.`
- Next Step: `Before implementation, open docs/superpowers/project-progress.md and either close/sync the current faction review child or explicitly promote this child as the current owner document.`
- Verification: `npm run lint:plans passed`
- Notes: `This plan intentionally does not mark the child running because docs/superpowers/project-progress.md currently identifies docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md as the active owner document.`

## Progress Log

- 2026-07-25
  - Summary: `Created the campaign map visual profile implementation plan from the approved spec.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for explicit execution promotion because project-progress currently points at the faction review closeout.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-25-campaign-map-visual-profile-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current branch is `codex/sync-naqishuo-721ui-to-mmz`.
  - `docs/superpowers/project-progress.md` currently points at `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`; this plan must remain `waiting` until promoted.
  - Current `src/ui/views/map/map-view.ts` still directly imports `../../../3dasset/city_hun/city-hun-campaign-lowpoly.json?url`, `../../../3dasset/city_hun/texture_pbr_20250901.png?url`, and `../../../../ui/yuansu/20260715-120754.png?url`.
  - Current `map-view.ts` still defines `YUANMO_HEX_BUILDING`, a map-specific hardcoded visual/interaction branch.

## Implementation Scope

### In Scope

- Add `campaignStructureProfileId?: string` to `MapDefinition`.
- Add a shared engine-owned campaign structure visual profile registry.
- Resolve profile URLs in the map view model without importing scenario-pack-private assets.
- Replace the hardcoded `YUANMO_HEX_BUILDING` path with data-driven map node structure visuals.
- Keep interaction identity, city ids, map coordinates, and exploration gating driven by normal map node data.
- Add tests proving `map-view.ts` no longer imports scenario-pack-private resources or hardcodes `YUANMO_HEX_BUILDING`.

### Still Out Of Scope

- Porting the full `shoreamend` fort/city/wall renderer.
- Moving existing vegetation mesh support out of scenario packs.
- Reworking Hex terrain generation, navigation, exploration, cloud reveal, water, mountain, or vegetation semantics.
- Changing house interfaces, house runtime state, or `src/main.ts` house wiring.
- Replacing the current WebGL renderer with Three.js.

## File Map

### Existing files to modify

- `src/domain/map.ts`
  - Add `campaignStructureProfileId?: string` to `MapDefinition`.
  - Add optional map node visual metadata only if needed for node-level structure rendering.
- `src/content/yuanmo-campaign-map.ts`
  - Declare the built-in campaign structure profile id on the Yuanmo campaign map.
  - Represent the current special Haizhou building through normal `MapNode` data instead of `YUANMO_HEX_BUILDING`.
- `src/ui/views/map/map-view.ts`
  - Remove direct hardcoded building imports and the `YUANMO_HEX_BUILDING` constant.
  - Add profile-derived fields to `MapViewModel`.
  - Render structure visual markup from `campaignMarkers` / node metadata, not from a single hardcoded constant.
  - Emit `data-campaign-structure-*` attributes for renderer-owned resources.
- `src/ui/views/map/campaign-terrain-webgl.ts`
  - Only add profile URL reading if the foundation needs canvas attributes; do not add the full renderer path yet.
- `tests/robustness.test.cjs`
  - Add/update contract tests for profile id, profile registry, map view imports, and removal of the hardcoded building path.

### Existing files expected to be deleted

- None.

### New files to create

- `src/content/campaign-structure-visual-profiles.ts`
  - Engine-owned registry for built-in campaign structure visual profiles and asset URL imports.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign structure visual profile|hardcoded Yuanmo building|scenario pack structure import" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
  - `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test`
- Known baseline risk:
  - Full `npm test` may still hit the pre-existing unrelated child 27 startup coordinator failure. If it appears unchanged, record exact expected/actual output and do not mark this child `closed` unless the project accepts that baseline.

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
  label: "濠州",
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

## Task 5: Final Verification And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-25-campaign-map-visual-profile-plan.md`
- Modify if this child is promoted/running: `docs/superpowers/project-progress.md`
- Read: `docs/superpowers/specs/2026-07-25-campaign-map-visual-profile-design.md`

- [ ] **Step 1: Run targeted contract verification**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign structure visual profile|hardcoded Yuanmo building|scenario pack structure import|campaign terrain canvas receives structure profile" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 2: Run required baseline commands**

Run:

```powershell
npm run lint:plans
npm run typecheck
npm run build
```

Expected:

- All commands exit `0`.

- [ ] **Step 3: Run full suite with known baseline tracking**

Run:

```powershell
$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test
```

Expected:

- `PASS`, or only the pre-existing unrelated child 27 startup coordinator failure. If the child 27 failure appears, record exact test name, expected value, actual value, and that it predates this child.

- [ ] **Step 4: Update plan execution state**

If all implementation tasks passed but remote push/closeout is not complete, set:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-25`
- Current Focus: `Implementation complete; awaiting review, push, and structured closeout.`
- Next Step: `Review final diff, push if requested, then close this child only after project-progress is synchronized.`
- Verification: `Record exact commands and outcomes from Steps 1-3.`
- Notes: `Do not mark closed until remote push succeeds and project-progress points at the correct next action.`
```

Append a `Progress Log` entry with the same verification summary.

- [ ] **Step 5: Commit governance updates**

Run:

```powershell
git add -- docs/superpowers/plans/2026-07-25-campaign-map-visual-profile-plan.md docs/superpowers/project-progress.md
git commit -m "docs: update campaign visual profile plan progress"
```

Only include `docs/superpowers/project-progress.md` if this child was promoted to the active owner document.

## Exit Check

- [ ] `MapDefinition` can declare `campaignStructureProfileId`.
- [ ] The Yuanmo campaign map selects `yuanmo.campaign-structures`.
- [ ] The structure profile registry is outside `scenario-packs`.
- [ ] `map-view.ts` does not import scenario-pack-private paths.
- [ ] `YUANMO_HEX_BUILDING` no longer exists.
- [ ] Structure visuals are driven by map node data and profile URLs.
- [ ] Marker interaction remains semantic and exploration-gated.
- [ ] `npm run lint:plans` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Full-suite result is recorded, including any unchanged known unrelated failure.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Campaign Map Visual Profile`
- Parent Task: `Campaign Map Visual Profile Foundation`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `promote-or-execute-plan`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-25-campaign-map-visual-profile-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md; if this child is promoted, continue from the first unchecked task in docs/superpowers/plans/2026-07-25-campaign-map-visual-profile-plan.md.`
