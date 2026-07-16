# City Building Mount NPC Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add city-owned authoring for mounting buildings, mounting NPCs under each mounted building, and selecting one primary NPC per mounted building.

**Architecture:** Keep the new data on `ScriptEditorCityRecord` so the authoring surface stays city-owned. Reuse the existing script-editor record normalization and selection flow, add a focused city-profile panel for mount editing, and preserve save/load by flowing through the existing project serialization path.

**Tech Stack:** TypeScript, existing script-editor UI helpers, `tests/city-building-mount-authoring.test.cjs`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-16`
- Current Focus: `Closed after operator-reported mounted NPC add-row regression fix.`
- Next Step: `Resume Blueprint promotion review from the version plan.`
- Verification: `Original queue verification passed; regression verification passed with npm run build:test and node --test tests/city-building-mount-authoring.test.cjs.`
- Notes: `Blueprint queue truth remains under docs/blueprints/queues/script-editor-city-building-mount-npc-authoring-queue.md; export/runtime conversion remains a separate candidate.`

## Progress Log

- 2026-07-16
  - Summary: `Plan created for queue.script-editor-city-building-mount-npc-authoring implementation after the operator approved the city-owned mountedBuildings slice.`
  - Verification: `RED confirmed with node --test tests/city-building-mount-authoring.test.cjs before implementation; GREEN confirmed after implementation; npm run typecheck and npm test passed.`
  - Next: `Run remaining governance verification and write Blueprint queue after-state.`
- 2026-07-16
  - Summary: `Operator regression evidence reopened the mounted-building/NPC authoring queue because add NPC had no effect and delete mounted building was reported ineffective. Fixed the add-NPC editing helper and UI action so the button inserts the first available unmounted NPC id, and added mounted-building deletion coverage.`
  - Verification: `RED confirmed for add-NPC row preservation; GREEN confirmed with npm run build:test and node --test tests/city-building-mount-authoring.test.cjs.`
  - Next: `Return to Blueprint version promotion review.`

---

### Task 1: Add city mount data helpers

**Files:**
- Modify: `src/domain/script-editor-project.ts`
- Modify: `src/application/script-editor/city-building-authoring.ts`
- Test: `tests/city-building-mount-authoring.test.cjs`

- [x] **Step 1: Write the failing test**

```js
test("script editor city authoring normalizes mounted buildings with npc and primary npc selection", () => {
  const { normalizeScriptEditorCityRecord } = require("../.test-dist/application/script-editor/city-building-authoring.js");
  const city = normalizeScriptEditorCityRecord({
    id: "city.start",
    name: "Start City",
    mountedBuildings: [{ buildingId: "building.market", npcIds: ["person.host", "", "person.guard"], primaryNpcId: "person.host" }],
  });
  assert.deepEqual(city.mountedBuildings, [{ buildingId: "building.market", npcIds: ["person.host", "person.guard"], primaryNpcId: "person.host" }]);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/city-building-mount-authoring.test.cjs`
Expected: FAIL because `mountedBuildings` is not modeled yet.

- [x] **Step 3: Write minimal implementation**

Add `mountedBuildings` to the city record, normalize the array, and keep the values trimmed and deduplicated at the city layer only.

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/city-building-mount-authoring.test.cjs`
Expected: PASS

### Task 2: Expose mounted-building controls in the city authoring UI

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Test: `tests/city-building-mount-authoring.test.cjs`

- [x] **Step 1: Write the failing test**

```js
test("script editor city profile UI exposes mounted building and npc controls", () => {
  const mainUiSource = fs.readFileSync(path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"), "utf8");
  assert.match(mainUiSource, /data-script-editor-city-mounted-building/);
  assert.match(mainUiSource, /data-script-editor-city-mounted-building-npc/);
  assert.match(mainUiSource, /data-script-editor-city-primary-npc/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/city-building-mount-authoring.test.cjs`
Expected: FAIL because the controls do not exist yet.

- [x] **Step 3: Write minimal implementation**

Add a city profile subsection that lists mounted buildings, lets the editor select buildings and NPCs from project data, and lets the editor choose one primary NPC per mounted building.

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/city-building-mount-authoring.test.cjs`
Expected: PASS
