# Campaign Fort City Model Renderer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `cyh`/`shoreamend` fort/city modeled building renderer into the current campaign map without making UI modules import scenario-pack-owned assets.

**Architecture:** Preserve the visible renderer behavior from `codex/inspect-shoreamend-cyh`: fort/city building meshes, wall mesh, instanced draw path, structure shadows, and structure ground semantics. Do not copy its production boundary exactly: move model resources to engine-owned built-in visual assets, register them through content/renderer registries, and let `map-view.ts` pass asset ids/URLs to the terrain canvas. The scenario pack may keep gameplay map/city/NPC data, but it must not be the owner of heavy building model resources.

**Tech Stack:** TypeScript, Vite JSON and URL asset imports, WebGL terrain renderer, GLSL shaders, Node test runner, Playwright/Edge runtime verification, `npm run build:test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-25`
- Current Focus: `Implementation complete locally; review/push and known unrelated baseline failure remain before closeout.`
- Next Step: `Review final diff and push when requested; do not mark closed while remote push is absent and child 27 baseline remains failing.`
- Verification: `Targeted fort/city contracts passed; lint:plans, typecheck, and build passed; browser runtime verified modeled structures on 5173; full npm test failed only known unrelated child 27 startup coordinator failure.`
- Notes: `Port kept heavy model assets engine-owned under src/assets/campaign-structures and avoided UI scenario-pack model hard imports. Runtime Yuanmo map now selects yuanmo.campaign-structures and marks fenyang as settlement-building so 5173 shows the modeled structure path.`

## Progress Log

- 2026-07-25
  - Summary: `Opened the fort/city modeled structure renderer child after confirming the prior foundation only added profile plumbing and did not port the cyh WebGL building model renderer.`
  - Verification: `Compared HEAD against codex/inspect-shoreamend-cyh for map-view, map-view-model, domain map types, campaign-terrain-webgl, shaders, and model asset paths.`
  - Next: `Execute Task 1 with TDD: prove model resources are engine-owned and UI modules do not import scenario-pack model assets.`
- 2026-07-25
  - Summary: `Completed the local fort/city model renderer port. Commits: 331e40ee plan, dc72a791 engine-owned asset registry, 34363650 terrain canvas attributes, 1eb6657c cyh modeled renderer, 8b6fb044 runtime map enablement and terrain/cloud contract reconciliation.`
  - Verification: `Targeted campaign contracts passed: campaign structure visual profiles, campaign map structures, campaign fort city model assets, campaign terrain canvas receives fort city model profile attributes, campaign fort city model renderer. Also fixed cyh overwrite regressions for water shader contract, terrain low-resolution budget, terrain DPR cap, chunk/mountain height helper layering, and vegetation shadow direction. npm run lint:plans passed; npm run typecheck passed; npm run build passed with existing Vite warnings. Edge runtime on http://127.0.0.1:5173/ started default adventure, terrain canvas was ready with data-campaign-fort-city-asset-id=builtin.yuanmo.fort-city and data-campaign-fort-wall-mesh-url=/src/assets/campaign-structures/fort-wall/fort-hex-wall.json; screenshot captured at D:\RPG_TG\.tmp\campaign-fort-city-model-renderer.png and visually shows modeled fort/city structures. Full npm test passed 355/356 and failed only known unrelated child 27 startup coordinator test: expected event.story.zhu_yuanzhang.haozhou_return_encounter, actual null.`
  - Next: `Review final diff and push when requested; keep child completed-open until push/review and the known child 27 baseline is accepted or resolved.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-25-campaign-map-visual-profile-design.md`
- Source reference:
  - `codex/inspect-shoreamend-cyh`
  - Source commit note: `a07fb3e6 性能优化`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current branch is `codex/sync-naqishuo-721ui-to-mmz`.
  - Current foundation has `campaignStructureProfileId` and city depth URL plumbing, but no fort/city instanced renderer.
  - Current runtime on `http://127.0.0.1:5173/` does not show modeled buildings because the cyh renderer path has not been ported.
  - The source branch keeps model files under `src/content/scenario-packs/zhuyuanzhang/assets/map-nodes/**`; this child must move or copy them to engine-owned visual asset paths before wiring UI.
  - The source branch's `src/ui/views/map/map-view-model.ts` directly imports scenario-pack model assets; this child must not reproduce that boundary.

## Implementation Scope

### In Scope

- Copy the cyh fort/city building mesh JSON files, fort/city rules JSON, fort wall mesh JSON, and wall textures into engine-owned built-in visual asset paths.
- Add domain types needed by the cyh renderer:
  - `CampaignFortCityRulesDefinition`
  - `CampaignMapNodeMeshDefinition`
- Add an engine/content-owned registry for built-in fort/city model assets.
- Extend the existing campaign structure visual profile to expose:
  - `fortCityAssetId`
  - `fortWallMeshUrl`
- Emit terrain canvas attributes for fort/city model assets from `map-view.ts`.
- Port the cyh terrain renderer pieces needed for:
  - fort/city instanced building models
  - settlement village models
  - fortified node walls
  - structure blob shadows
  - structure ground texture semantics if the source renderer depends on them
- Add tests that lock the boundary and prove the renderer path is present.
- Runtime verify on `5173` that modeled building assets are loaded and rendered or at minimum that renderer attributes and WebGL draw path are active.

### Still Out Of Scope

- Whole-branch merge from `shoreamend` or `codex/inspect-shoreamend-cyh`.
- Moving gameplay map/NPC/city scenario data out of scenario packs.
- Replacing the entire map view lifecycle with `cyh`'s `map-view-model.ts` split.
- Reworking cloud animation policy.
- Changing house interfaces, house runtime state, or `src/main.ts` house wiring.
- Making scenario packs provide heavy model assets.

## File Map

### Existing files to modify

- `src/domain/map.ts`
  - Add fort/city rules and map-node mesh asset types copied from the cyh renderer contract.
- `src/content/campaign-structure-visual-profiles.ts`
  - Extend `CampaignStructureVisualProfile` to include fort/city model asset id and wall mesh URL.
- `src/ui/views/map/map-view.ts`
  - Add view-model fields and terrain canvas `data-campaign-fort-city-asset-id` / `data-campaign-fort-wall-mesh-url` attributes.
  - Do not import model JSON or scenario-pack model paths here.
- `src/ui/views/map/campaign-terrain-webgl.ts`
  - Port the cyh modeled structure renderer, adapted to current file state and profile-driven attributes.
- `tests/robustness.test.cjs`
  - Add boundary and renderer presence contracts.
- `docs/superpowers/project-progress.md`
  - Point current work at this child while running.

### Existing files expected to be deleted

- None.

### New files to create

- `src/content/campaign-fort-city-visual-assets.ts`
  - Registers built-in fort/city rules and meshes using engine-owned asset imports.
- `src/ui/views/map/campaign-fort-city-asset-registry.ts`
  - Runtime registry consumed by `campaign-terrain-webgl.ts`.
- `src/ui/views/map/shaders/campaign-fort-city-instanced.vert.glsl`
  - Cyh instanced building vertex shader.
- `src/ui/views/map/shaders/campaign-fort-city.frag.glsl`
  - Cyh building fragment shader.
- `src/ui/views/map/shaders/campaign-structure-shadow.frag.glsl`
  - Cyh structure shadow fragment shader.
- `src/assets/campaign-structures/fort-city/*.json`
  - Engine-owned copies of cyh building meshes and rules.
- `src/assets/campaign-structures/fort-wall/*`
  - Engine-owned copy of fort wall mesh and texture assets.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model assets|campaign fort city model renderer|campaign modeled structures do not import scenario pack assets" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
  - `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test`
- Runtime verification:
  - Start/keep `npm run dev` on `http://127.0.0.1:5173/`.
  - Use Edge/Playwright to start adventure.
  - Verify the terrain canvas has `data-campaign-fort-city-asset-id` and `data-campaign-fort-wall-mesh-url`.
  - Verify no `.c-campaign-hex-building` old 2D settlement image is needed for the modeled structure path.
  - Capture a screenshot and inspect that modeled structures are visible near `settlement.fenyang_province`, or record exact renderer diagnostics if visual QA fails.
- Known baseline risk:
  - Full `npm test` may still fail only the known unrelated child 27 startup coordinator test. If so, record expected/actual exactly and do not mark this child `closed`.

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

- [x] **Step 1: Write the failing boundary test**

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

- [x] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model assets are engine-owned and not imported by map UI" tests/robustness.test.cjs }
```

Expected:

- `FAIL`
- Failure mentions missing `campaign-fort-city-visual-assets.ts` or missing engine-owned assets.

- [x] **Step 3: Copy cyh model assets to engine-owned paths**

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

- [x] **Step 4: Add domain model asset types**

In `src/domain/map.ts`, add the cyh `CampaignFortCityRulesDefinition` and `CampaignMapNodeMeshDefinition` types after `CampaignVegetationRulesDefinition`.

- [x] **Step 5: Add runtime registry**

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

- [x] **Step 6: Add engine-owned asset registration**

Create `src/content/campaign-fort-city-visual-assets.ts` that imports the copied engine-owned JSON files, registers `builtin.yuanmo.fort-city`, and exports:

```ts
export const BUILTIN_YUANMO_FORT_CITY_ASSET_ID = "builtin.yuanmo.fort-city";
export const builtinYuanmoFortWallMeshUrl: string;
```

- [x] **Step 7: Extend campaign structure profile**

In `src/content/campaign-structure-visual-profiles.ts`, import `./campaign-fort-city-visual-assets`, add `fortCityAssetId` and `fortWallMeshUrl` to `CampaignStructureVisualProfile`, and set them on `"yuanmo.campaign-structures"`.

- [x] **Step 8: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model assets are engine-owned and not imported by map UI" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 9: Commit Task 1**

Run:

```powershell
git add -- src/domain/map.ts src/content/campaign-structure-visual-profiles.ts src/content/campaign-fort-city-visual-assets.ts src/ui/views/map/campaign-fort-city-asset-registry.ts src/assets/campaign-structures tests/robustness.test.cjs
git commit -m "feat: register campaign fort city model assets"
```

## Task 2: Terrain Canvas Profile Attributes

**Files:**
- Modify: `src/ui/views/map/map-view.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `CampaignStructureVisualProfile.fortCityAssetId`
- Consumes: `CampaignStructureVisualProfile.fortWallMeshUrl`
- Produces: `data-campaign-fort-city-asset-id`
- Produces: `data-campaign-fort-wall-mesh-url`

- [x] **Step 1: Write the failing test**

Add a test named:

```js
test("campaign terrain canvas receives fort city model profile attributes", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const mapViewSource = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "map-view.ts"),
    "utf8"
  );

  assert.match(mapViewSource, /data-campaign-fort-city-asset-id/);
  assert.match(mapViewSource, /data-campaign-fort-wall-mesh-url/);
  assert.match(mapViewSource, /campaignStructureProfile\?\.fortCityAssetId/);
  assert.match(mapViewSource, /campaignStructureProfile\?\.fortWallMeshUrl/);
  assert.doesNotMatch(mapViewSource, /scenario-packs\/zhuyuanzhang\/assets\/map-nodes/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign terrain canvas receives fort city model profile attributes" tests/robustness.test.cjs }
```

Expected:

- `FAIL`

- [x] **Step 3: Add the terrain canvas attributes**

In `renderCampaignMapVisualLayer`, derive:

```ts
const fortCityAssetAttributes =
  campaignStructureProfile?.fortCityAssetId == null
    ? ""
    : `data-campaign-fort-city-asset-id="${campaignStructureProfile.fortCityAssetId}"`;
const fortWallMeshAttributes =
  campaignStructureProfile?.fortWallMeshUrl == null
    ? ""
    : `data-campaign-fort-wall-mesh-url="${campaignStructureProfile.fortWallMeshUrl}"`;
```

Add both strings to the terrain `<canvas>`.

- [x] **Step 4: Run test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign terrain canvas receives fort city model profile attributes" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 5: Commit Task 2**

Run:

```powershell
git add -- src/ui/views/map/map-view.ts tests/robustness.test.cjs
git commit -m "feat: pass fort city model assets to terrain"
```

## Task 3: Port Cyh Terrain Modeled Structure Renderer

**Files:**
- Modify: `src/ui/views/map/campaign-terrain-webgl.ts`
- Create: `src/ui/views/map/shaders/campaign-fort-city-instanced.vert.glsl`
- Create: `src/ui/views/map/shaders/campaign-fort-city.frag.glsl`
- Create: `src/ui/views/map/shaders/campaign-structure-shadow.frag.glsl`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `data-campaign-fort-city-asset-id`
- Consumes: `data-campaign-fort-wall-mesh-url`
- Consumes: `getRegisteredCampaignFortCityAsset(id)`
- Produces: fort/city instanced model draw path in terrain WebGL renderer.

- [x] **Step 1: Write the failing renderer presence test**

Add a test named:

```js
test("campaign fort city model renderer ports cyh instanced draw path", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const terrainSource = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "campaign-terrain-webgl.ts"),
    "utf8"
  );

  assert.match(terrainSource, /campaignFortCityAssetId/);
  assert.match(terrainSource, /getRegisteredCampaignFortCityAsset/);
  assert.match(terrainSource, /drawCampaignFortCityInstancedModel/);
  assert.match(terrainSource, /createCampaignFortCityBuildingInstances/);
  assert.match(terrainSource, /readCampaignFortWallInstances/);
  assert.match(terrainSource, /createCampaignFortCityShadowMesh/);
  assert.match(terrainSource, /campaign-fort-city-instanced\.vert\.glsl/);
  assert.match(terrainSource, /campaign-structure-shadow\.frag\.glsl/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model renderer ports cyh instanced draw path" tests/robustness.test.cjs }
```

Expected:

- `FAIL`

- [x] **Step 3: Copy cyh shaders**

Copy these shader contents from `codex/inspect-shoreamend-cyh`:

- `src/ui/views/map/shaders/campaign-fort-city-instanced.vert.glsl`
- `src/ui/views/map/shaders/campaign-fort-city.frag.glsl`
- `src/ui/views/map/shaders/campaign-structure-shadow.frag.glsl`

- [x] **Step 4: Port terrain renderer in focused chunks**

Port from `codex/inspect-shoreamend-cyh:src/ui/views/map/campaign-terrain-webgl.ts` only the pieces required by fort/city structures:

- new imports for fort/city shaders and registry
- input fields for `campaignFortCityAssetId` and `campaignFortWallMeshUrl`
- asset loading:
  - `loadCampaignFortCityAsset`
  - `createRegisteredCampaignFortCityAsset`
  - `loadCampaignFortWallMeshAsset`
  - validation helpers
- render model state and cache:
  - structure building cache
  - fort/city instanced variant resources
  - fort wall mesh state
  - structure shadow mesh state
- marker readers:
  - `readCampaignFortWallInstances`
  - fort/city instance readers for `city`, `fort`, and settlement village nodes
- model builders:
  - `createCampaignFortCityBuildingInstances`
  - `createCampaignFortCityInstancedRenderModel`
  - `createCampaignFortCityShadowMesh`
- draw calls:
  - `drawCampaignFortCityInstancedModel`
  - `drawCampaignStructureShadowMesh`
  - fort wall draw path

Do not port unrelated `main.ts` lifecycle rewrites or cloud behavior from cyh.

- [x] **Step 5: Run targeted test to verify it passes**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model renderer ports cyh instanced draw path" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 6: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected:

- `PASS`

- [x] **Step 7: Commit Task 3**

Run:

```powershell
git add -- src/ui/views/map/campaign-terrain-webgl.ts src/ui/views/map/shaders/campaign-fort-city-instanced.vert.glsl src/ui/views/map/shaders/campaign-fort-city.frag.glsl src/ui/views/map/shaders/campaign-structure-shadow.frag.glsl tests/robustness.test.cjs
git commit -m "feat: render campaign fort city models"
```

## Task 4: Runtime Visual Verification

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md`

- [x] **Step 1: Run complete targeted contracts**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign fort city model assets|campaign fort city model renderer|campaign modeled structures do not import scenario pack assets|campaign terrain canvas receives fort city model profile attributes" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 2: Run baseline commands**

Run:

```powershell
npm run lint:plans
npm run typecheck
npm run build
```

Expected:

- All commands exit `0`, except existing Vite warnings may remain warnings only.

- [x] **Step 3: Verify in browser on 5173**

Use Edge/Playwright:

1. Navigate to `http://127.0.0.1:5173/`.
2. Click `data-main-ui-action="open-character-select"`.
3. Click `data-main-ui-action="start-adventure"`.
4. Wait for terrain.
5. Inspect terrain canvas attributes:
   - `data-campaign-fort-city-asset-id`
   - `data-campaign-fort-wall-mesh-url`
6. Capture screenshot to `.tmp/campaign-fort-city-model-renderer.png`.
7. Record whether modeled structures are visible near `settlement.fenyang_province`.

- [x] **Step 4: Record verification in plan**

Append a progress log entry with:

- targeted contracts result
- typecheck result
- build result
- browser result and screenshot path
- full suite result if run

- [x] **Step 5: Commit verification docs**

Run:

```powershell
git add -- docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md docs/superpowers/project-progress.md .superpowers/sdd/progress.md
git commit -m "docs: record fort city model renderer verification"
```

## Exit Check

- [x] Fort/city model assets live under `src/assets/campaign-structures/**`, not under scenario-pack ownership for this renderer.
- [x] `map-view.ts` does not import scenario-pack model assets.
- [x] `campaign-terrain-webgl.ts` consumes fort/city asset ids or URLs from canvas attributes.
- [x] Cyh instanced building, wall, and structure shadow renderer paths are present.
- [x] Modeled structures are visible or renderer diagnostics are recorded on `5173`.
- [x] `npm run lint:plans` passes.
- [x] `npm run typecheck` passes.
- [x] `npm run build` passes.
- [x] Full-suite result is recorded, including any unchanged known unrelated failure.
- [x] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Campaign Fort City Model Renderer`
- Parent Task: `Campaign Fort City Model Renderer`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `not-closed`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-and-push-campaign-fort-city-model-renderer`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-07-25-campaign-fort-city-model-renderer-plan.md; do not close until push succeeds and the child 27 baseline is accepted or resolved.`
