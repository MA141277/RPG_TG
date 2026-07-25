# Generic Progression Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add first-version `阶段轨道` support that authors threshold tiers and bindings in Script Editor, exports/imports them through runtime-pack resources, and lets the Event-routing chain hand progression-emitted settlement instances into `SettlementRuntime` for target-tier convergence.

**Architecture:** Introduce a dedicated progression contract/runtime slice under `src/core`, model authored tracks and bindings as first-class project/runtime-pack resources, and keep final mutations settlement-owned. The Event-routing call chain remains the handoff seam: progression computes target-tier changes and emits settlement instances only; settlement execution performs all final writes and any later routed truth.

**Tech Stack:** TypeScript, Vite, existing `src/core/runtime/*` runtime seams, Script Editor project/runtime-pack authoring, Node test runner in `tests/robustness.test.cjs`

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-25`
- Current Focus: `Implementation, focused verification, and closeout notes are complete for the generic progression track slice.`
- Next Step: `Keep this plan as the recorded closeout artifact until repository sync is requested.`
- Verification: `npm.cmd run build:test PASS; focused progression robustness tests PASS; npm.cmd run typecheck PASS; npm.cmd test fails on unrelated tests/city-building-mount-authoring.test.cjs`
- Notes: `This legacy superpowers-governed plan was explicitly resumed for the progression-track implementation slice.`

## Progress Log

- 2026-07-25
  - Summary: `Implemented progression contracts, runtime state, runtime-pack export/import/loader support, Script Editor authoring, and event-routed settlement-instance handoff through the shared settlement runtime.`
  - Verification: `Focused progression coverage PASS; npm.cmd run typecheck PASS; full npm.cmd test still fails on unrelated city profile UI coverage.`
  - Next: `No progression-specific blocker remains; leave repository sync and any unrelated red-test cleanup to a later closeout pass.`

## Global Constraints

- `event` remains the only formal routing owner
- progression must not introduce a second router
- all final property and state changes must execute only through settlement instances
- progress-value changes must also execute only through settlement instances
- `ProgressionRuntime` may emit settlement instances only
- the current Event-routing call chain must immediately hand those settlement instances to `SettlementRuntime`
- first version supports one metric per track, optional demotion, no per-owner threshold overrides, and no multi-track linked convergence rules
- Script Editor authoring must use Chinese creator-facing labels and must not expose raw ids/keys as the primary UI language

---

## File Structure

- Create `src/core/contracts/progression-runtime.ts`
  - Canonical progression types for track definitions, bindings, runtime state, settlement payload, and runtime result.
- Create `src/core/runtime/progression-runtime.ts`
  - Threshold evaluation, repeat-policy handling, demotion support, and settlement-instance emission.
- Modify `src/core/contracts/runtime-state.ts`
  - Add progression runtime state to unified runtime state.
- Modify `src/core/contracts/runtime-result.ts`
  - Add settlement-instance receipt lane if missing from current route result contract.
- Modify `src/core/runtime/runtime-settlement.ts`
  - Accept progression settlement payload shape and apply convergence through settlement execution only.
- Modify `src/core/runtime/runtime-dispatch.ts`
  - Ensure routed progression settlement instances flow through the shared post-route settlement seam.
- Modify `src/domain/script-editor-project.ts`
  - Add project file keys, record types, and canonical file entries for progression tracks and bindings.
- Modify `src/application/script-editor/runtime-pack-export.ts`
  - Export progression tracks/bindings into runtime-pack files and validate first-version rules.
- Modify `src/application/script-editor/runtime-pack-import.ts`
  - Import progression track/binding resources from runtime-pack files.
- Modify `src/application/scenario/scenario-pack-loader.ts`
  - Hydrate runtime progression resources and validate canonical settlement references.
- Modify `src/application/script-editor/workspace-shell.ts`
  - Add workspace validation for progression resources and settlement target references.
- Modify `src/application/script-editor/minimal-workflow.ts`
  - Include progression records in workflow record creation/upsert/remove if the current workflow owns them.
- Modify `src/application/script-editor/story-dialogue-event-authoring.ts`
  - Add normalization/helpers for progression track and binding records if this is the existing authoring helper home.
- Modify `src/ui/main-ui/main-ui-flow.js`
  - Add Chinese authoring UI for `阶段轨道` and bindings without exposing raw ids as primary labels.
- Modify `tests/robustness.test.cjs`
  - Add progression contract, export/import, loader, runtime, and Script Editor UI coverage.
- Modify `docs/change-log.md`
  - Record the landed runtime/data/authoring behavior after implementation.

## Task 1: Contracts And Runtime State

**Files:**
- Create: `src/core/contracts/progression-runtime.ts`
- Modify: `src/core/contracts/runtime-state.ts`
- Modify: `src/domain/script-editor-project.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: existing runtime state contract at `src/core/contracts/runtime-state.ts`
- Produces:
  - `export type ProgressTrackDefinition`
  - `export type ProgressTrackBinding`
  - `export type ProgressTrackRuntimeState`
  - `export type RuntimeProgressState`
  - `export type ProgressionTierSettlementPayload`
  - `RuntimeState["core"]["runtime"]["progression"]`
  - `ScriptEditorProgressTrackRecord`
  - `ScriptEditorProgressTrackBindingRecord`

- [x] **Step 1: Write the failing contract/state test**

```js
test("progression runtime contract exports canonical track and settlement payload seams", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/progression-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type ProgressTrackDefinition = \{/);
  assert.match(source, /export type ProgressTrackBinding = \{/);
  assert.match(source, /export type ProgressTrackRuntimeState = \{/);
  assert.match(source, /export type ProgressionTierSettlementPayload = \{/);
  assert.match(source, /targetTierSettlementId\?: string \| null;/);
});

test("runtime state reserves a unified progression runtime partition", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-state.ts"),
    "utf8"
  );

  assert.match(source, /progression\?: RuntimeProgressState/);
});

test("script editor project definition declares progression track and binding files", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/domain/script-editor-project.ts"),
    "utf8"
  );

  assert.match(source, /"progressTracks"/);
  assert.match(source, /"progressTrackBindings"/);
  assert.match(source, /progressTracks: "\.\/progress-tracks\.json"/);
  assert.match(source, /progressTrackBindings: "\.\/progress-track-bindings\.json"/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "progression runtime contract exports canonical track and settlement payload seams|runtime state reserves a unified progression runtime partition|script editor project definition declares progression track and binding files"`

Expected: FAIL with missing contract/state declarations.

- [x] **Step 3: Write minimal implementation**

```ts
// src/core/contracts/progression-runtime.ts
export type ProgressTierDefinition = {
  id: string;
  title: string;
  threshold: number;
  onEnterRepeatPolicy?: "once-ever" | "once-per-entry";
  targetTierSettlementId?: string | null;
};

export type ProgressTrackDefinition = {
  id: string;
  title: string;
  metricLabel: string;
  ownerKind: string | "*";
  allowDemotion?: boolean;
  tiers: ProgressTierDefinition[];
};

export type ProgressTrackBinding = {
  id: string;
  trackId: string;
  owner: { ownerKind: string; ownerId?: string; ownerTag?: string };
  enabled?: boolean;
};

export type ProgressionTierSettlementPayload = {
  ownerKind: string;
  ownerId: string;
  trackId: string;
  fromTierId: string | null;
  toTierId: string | null;
  metricValue: number;
};
```

```ts
// src/core/contracts/runtime-state.ts
import type { RuntimeProgressState } from "./progression-runtime";

export type RuntimeState = {
  core: {
    runtime: {
      progression?: RuntimeProgressState;
    };
  };
};
```

```ts
// src/domain/script-editor-project.ts
export const SCRIPT_EDITOR_PROJECT_FILE_KEYS = [
  "progressTracks",
  "progressTrackBindings",
] as const;

export const SCRIPT_EDITOR_PROJECT_CANONICAL_FILES = {
  progressTracks: "./progress-tracks.json",
  progressTrackBindings: "./progress-track-bindings.json",
} as const;
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "progression runtime contract exports canonical track and settlement payload seams|runtime state reserves a unified progression runtime partition|script editor project definition declares progression track and binding files"`

Expected: PASS

- [x] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/core/contracts/progression-runtime.ts src/core/contracts/runtime-state.ts src/domain/script-editor-project.ts
git commit -m "feat: add progression runtime contracts"
```

### Task 2: Progression Runtime And Settlement Handoff

**Files:**
- Create: `src/core/runtime/progression-runtime.ts`
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ProgressTrackDefinition`
  - `ProgressTrackBinding`
  - `RuntimeProgressState`
  - `ProgressionTierSettlementPayload`
- Produces:
  - `export function runProgressionRuntime(input: { ... }): ProgressionRuntimeResult`
  - `ProgressionRuntimeResult["settlementInstances"]`
  - runtime-dispatch handoff from routed settlement instances to `SettlementRuntime`

- [x] **Step 1: Write the failing runtime/handoff test**

```js
test("progression runtime emits settlement instances only for target-tier convergence", async () => {
  const { runProgressionRuntime } = require("../.test-dist/core/runtime/progression-runtime.js");

  const result = runProgressionRuntime({
    state: {
      trackStatesByOwnerKey: {
        "person:char.player": {
          "track.cultivation": {
            trackId: "track.cultivation",
            ownerKind: "person",
            ownerId: "char.player",
            metricValue: 90,
            currentTierId: "tier.1",
            enteredTierHistory: ["tier.1"],
            updatedAt: "2026-07-25T00:00:00.000Z",
          },
        },
      },
    },
    track: {
      id: "track.cultivation",
      title: "修为阶段轨道",
      metricLabel: "修为值",
      ownerKind: "person",
      allowDemotion: true,
      tiers: [
        { id: "tier.1", title: "入门", threshold: 0, targetTierSettlementId: "settlement.tier.1" },
        { id: "tier.2", title: "熟练", threshold: 100, targetTierSettlementId: "settlement.tier.2" },
      ],
    },
    binding: {
      id: "binding.player.cultivation",
      trackId: "track.cultivation",
      owner: { ownerKind: "person", ownerId: "char.player" },
      enabled: true,
    },
    metricValue: 100,
    occurredAt: "2026-07-25T01:00:00.000Z",
  });

  assert.equal(result.settlementInstances.length, 1);
  assert.equal(result.settlementInstances[0].settlementId, "settlement.tier.2");
  assert.deepEqual(result.settlementInstances[0].payload, {
    ownerKind: "person",
    ownerId: "char.player",
    trackId: "track.cultivation",
    fromTierId: "tier.1",
    toTierId: "tier.2",
    metricValue: 100,
  });
  assert.equal(result.eventRequests, undefined);
});

test("runtime dispatch keeps progression settlement handoff on the shared settlement seam", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-dispatch.ts"),
    "utf8"
  );

  assert.match(source, /settleRuntimeEffects/);
  assert.match(source, /settlementInstances/);
  assert.doesNotMatch(source, /runProgressionRuntime\([^)]*\)\.state/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern "progression runtime emits settlement instances only for target-tier convergence|runtime dispatch keeps progression settlement handoff on the shared settlement seam"`

Expected: FAIL with missing runtime/handoff implementation.

- [x] **Step 3: Write minimal implementation**

```ts
// src/core/runtime/progression-runtime.ts
export function runProgressionRuntime(input: {
  state: RuntimeProgressState;
  track: ProgressTrackDefinition;
  binding: ProgressTrackBinding;
  metricValue: number;
  occurredAt: string;
}): ProgressionRuntimeResult {
  const ownerKey = `${input.binding.owner.ownerKind}:${input.binding.owner.ownerId}`;
  const current =
    input.state.trackStatesByOwnerKey[ownerKey]?.[input.track.id] ?? null;
  const nextTier = selectHighestSatisfiedTier(input.track.tiers, input.metricValue);
  const nextState = upsertTrackState(input.state, {
    trackId: input.track.id,
    ownerKind: input.binding.owner.ownerKind,
    ownerId: input.binding.owner.ownerId ?? "",
    metricValue: input.metricValue,
    currentTierId: nextTier?.id ?? null,
    enteredTierHistory: current?.enteredTierHistory ?? [],
    updatedAt: input.occurredAt,
  });

  if ((current?.currentTierId ?? null) === (nextTier?.id ?? null) || nextTier?.targetTierSettlementId == null) {
    return { state: nextState, settlementInstances: [], diagnostics: [] };
  }

  return {
    state: nextState,
    settlementInstances: [
      {
        settlementId: nextTier.targetTierSettlementId,
        payload: {
          ownerKind: input.binding.owner.ownerKind,
          ownerId: input.binding.owner.ownerId ?? "",
          trackId: input.track.id,
          fromTierId: current?.currentTierId ?? null,
          toTierId: nextTier.id,
          metricValue: input.metricValue,
        },
      },
    ],
    diagnostics: [],
  };
}
```

```ts
// src/core/runtime/runtime-dispatch.ts
const settledProgression = finalState.settlementInstances.length === 0
  ? finalState
  : settleRuntimeEffects({
      state: finalState.state,
      settlementInstances: finalState.settlementInstances,
      emittedBy: "progression-runtime",
      appliedBy: "runtime-settlement",
    });
```

- [x] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern "progression runtime emits settlement instances only for target-tier convergence|runtime dispatch keeps progression settlement handoff on the shared settlement seam"`

Expected: PASS

- [x] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/core/runtime/progression-runtime.ts src/core/contracts/runtime-result.ts src/core/runtime/runtime-dispatch.ts src/core/runtime/runtime-settlement.ts
git commit -m "feat: add progression runtime settlement handoff"
```

### Task 3: Runtime-Pack Export, Import, And Loader

**Files:**
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Modify: `src/application/script-editor/runtime-pack-import.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/application/script-editor/workspace-shell.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ScriptEditorProgressTrackRecord[]`
  - `ScriptEditorProgressTrackBindingRecord[]`
  - `ProgressTrackDefinition[]`
  - `ProgressTrackBinding[]`
- Produces:
  - `progress-tracks.json`
  - `progress-track-bindings.json`
  - loader validation for `targetTierSettlementId`
  - workspace-shell blockers for invalid progression resources

- [x] **Step 1: Write the failing export/import/loader tests**

```js
test("script editor runtime export writes progression track and binding files", () => {
  const { exportScriptEditorProjectToScenarioPackFiles } = require("../.test-dist/application/script-editor/runtime-pack-export.js");
  const { createDefaultScriptEditorProjectDefinition } = require("../.test-dist/application/script-editor/minimal-workflow.js");

  const project = createDefaultScriptEditorProjectDefinition();
  project.progressTracks = [
    {
      id: "track.cultivation",
      title: "修为阶段轨道",
      metricLabel: "修为值",
      ownerKind: "person",
      allowDemotion: true,
      tiers: [{ id: "tier.1", title: "入门", threshold: 0, targetTierSettlementId: "settlement.tier.1" }],
    },
  ];
  project.progressTrackBindings = [
    {
      id: "binding.player.cultivation",
      trackId: "track.cultivation",
      owner: { ownerKind: "person", ownerId: "char.player" },
      enabled: true,
    },
  ];

  const files = exportScriptEditorProjectToScenarioPackFiles(project);
  assert.ok(files["progress-tracks.json"]);
  assert.ok(files["progress-track-bindings.json"]);
});

test("scenario pack loader rejects progression tiers that reference missing settlements", async () => {
  const { loadScenarioPackFromFiles } = require("../.test-dist/application/scenario/scenario-pack-loader.js");
  const files = new Map([
    ["pack.json", new File(['{"id":"pack.test","title":"test"}'], "pack.json", { type: "application/json" })],
    ["progress-tracks.json", new File([JSON.stringify([{ id: "track.cultivation", title: "修为阶段轨道", metricLabel: "修为值", ownerKind: "person", tiers: [{ id: "tier.1", title: "入门", threshold: 0, targetTierSettlementId: "settlement.missing" }] }])], "progress-tracks.json", { type: "application/json" })],
    ["progress-track-bindings.json", new File([JSON.stringify([])], "progress-track-bindings.json", { type: "application/json" })],
    ["settlements.json", new File([JSON.stringify([])], "settlements.json", { type: "application/json" })],
    ["events.json", new File([JSON.stringify([])], "events.json", { type: "application/json" })],
    ["event-bindings.json", new File([JSON.stringify([])], "event-bindings.json", { type: "application/json" })],
  ]);

  await assert.rejects(() => loadScenarioPackFromFiles(files), /targetTierSettlementId|settlement\.missing/i);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern "script editor runtime export writes progression track and binding files|scenario pack loader rejects progression tiers that reference missing settlements"`

Expected: FAIL with missing export/import/loader support.

- [x] **Step 3: Write minimal implementation**

```ts
// src/application/script-editor/runtime-pack-export.ts
files["progress-tracks.json"] = JSON.stringify(project.progressTracks ?? [], null, 2);
files["progress-track-bindings.json"] = JSON.stringify(project.progressTrackBindings ?? [], null, 2);

for (const track of project.progressTracks ?? []) {
  for (const tier of track.tiers ?? []) {
    const settlementId =
      typeof tier.targetTierSettlementId === "string"
        ? tier.targetTierSettlementId.trim()
        : "";
    if (settlementId.length > 0 && !sourceSettlementIds.has(settlementId)) {
      throw new Error(`Progress tier ${track.id}:${tier.id} references missing settlement ${settlementId}.`);
    }
  }
}
```

```ts
// src/application/scenario/scenario-pack-loader.ts
const progressTracks = await readOptionalJsonArrayFile(files, "progress-tracks.json");
const progressTrackBindings = await readOptionalJsonArrayFile(files, "progress-track-bindings.json");

for (const track of progressTracks ?? []) {
  for (const tier of track.tiers ?? []) {
    const settlementId =
      typeof tier.targetTierSettlementId === "string"
        ? tier.targetTierSettlementId.trim()
        : "";
    if (settlementId.length > 0 && !settlementIds.has(settlementId)) {
      throw new Error(`Progress tier "${track.id}:${tier.id}" references missing settlement "${settlementId}".`);
    }
  }
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern "script editor runtime export writes progression track and binding files|scenario pack loader rejects progression tiers that reference missing settlements"`

Expected: PASS

- [x] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/application/script-editor/runtime-pack-export.ts src/application/script-editor/runtime-pack-import.ts src/application/scenario/scenario-pack-loader.ts src/application/script-editor/workspace-shell.ts
git commit -m "feat: export and load progression resources"
```

### Task 4: Script Editor Authoring UI

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/application/script-editor/minimal-workflow.ts`
- Modify: `src/application/script-editor/story-dialogue-event-authoring.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ScriptEditorProgressTrackRecord`
  - `ScriptEditorProgressTrackBindingRecord`
  - Script Editor selection/workflow helpers
- Produces:
  - Chinese authoring panels for `阶段轨道`
  - Chinese authoring panels for track bindings
  - no raw id/key primary labels in the main panel

- [x] **Step 1: Write the failing UI/authoring helper tests**

```js
test("script editor progression authoring exposes Chinese track and binding controls", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(source, /阶段轨道/);
  assert.match(source, /进度值/);
  assert.match(source, /允许回退/);
  assert.match(source, /data-script-editor-progress-track-field="title"/);
  assert.match(source, /data-script-editor-progress-track-tier-field="threshold"/);
  assert.match(source, /data-script-editor-progress-binding-field="ownerKind"/);
  assert.doesNotMatch(source, /data-script-editor-progress-track-field="id"/);
});

test("script editor workflow helpers support progression draft upsert and remove", () => {
  const {
    createScriptEditorWorkflowRecordDraft,
    upsertScriptEditorWorkflowRecord,
    removeScriptEditorWorkflowRecord,
  } = require("../.test-dist/application/script-editor/minimal-workflow.js");
  let project = { progressTracks: [], progressTrackBindings: [] };

  const draft = createScriptEditorWorkflowRecordDraft("progressTracks", project);
  project = upsertScriptEditorWorkflowRecord(project, "progressTracks", draft);
  assert.equal(project.progressTracks.some((record) => record.id === draft.id), true);
  project = removeScriptEditorWorkflowRecord(project, "progressTracks", draft.id);
  assert.equal(project.progressTracks.some((record) => record.id === draft.id), false);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern "script editor progression authoring exposes Chinese track and binding controls|script editor workflow helpers support progression draft upsert and remove"`

Expected: FAIL with missing UI/authoring support.

- [x] **Step 3: Write minimal implementation**

```js
// src/ui/main-ui/main-ui-flow.js
progressTracks: 'data-script-editor-record-search-family="progressTracks"',
progressTrackBindings: 'data-script-editor-record-search-family="progressTrackBindings"',

renderScriptEditorProgressTrackEditor(track) {
  return `
    <h3>阶段轨道</h3>
    <label>轨道名称<input data-script-editor-progress-track-field="title" value="${escapeHtml(track.title)}" /></label>
    <label>进度值名称<input data-script-editor-progress-track-field="metricLabel" value="${escapeHtml(track.metricLabel ?? "")}" /></label>
    <label><input type="checkbox" data-script-editor-progress-track-field="allowDemotion" ${track.allowDemotion ? "checked" : ""} />允许回退</label>
  `;
}
```

```ts
// src/application/script-editor/minimal-workflow.ts
if (family === "progressTracks") {
  return { ...project, progressTracks: upsertById(project.progressTracks ?? [], record) };
}
if (family === "progressTrackBindings") {
  return { ...project, progressTrackBindings: upsertById(project.progressTrackBindings ?? [], record) };
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern "script editor progression authoring exposes Chinese track and binding controls|script editor workflow helpers support progression draft upsert and remove"`

Expected: PASS

- [x] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/ui/main-ui/main-ui-flow.js src/application/script-editor/minimal-workflow.ts src/application/script-editor/story-dialogue-event-authoring.ts
git commit -m "feat: add progression authoring UI"
```

### Task 5: Full-Chain Verification And Documentation

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes:
  - progression contracts/runtime
  - export/import/loader support
  - Script Editor authoring UI
- Produces:
  - end-to-end regression proof for authoring -> export/import -> loader -> Event-routing-chain handoff -> settlement execution
  - change-log entry for the landed mechanism

- [x] **Step 1: Write the failing end-to-end tests**

```js
test("progression resources round-trip through runtime-pack export import and loader", async () => {
  const {
    exportScriptEditorProjectToScenarioPackFiles,
  } = require("../.test-dist/application/script-editor/runtime-pack-export.js");
  const { loadScenarioPackFromFiles } = require("../.test-dist/application/scenario/scenario-pack-loader.js");
  const project = createProgressionFixtureProject();

  const files = exportScriptEditorProjectToScenarioPackFiles(project);
  assert.ok(files["progress-tracks.json"]);
  assert.ok(files["progress-track-bindings.json"]);

  const loaded = await loadScenarioPackFromFiles(createTextImportFilesFromRecord(files));
  assert.equal(loaded.progressTracks[0].id, "track.cultivation");
  assert.equal(loaded.progressTrackBindings[0].trackId, "track.cultivation");
});

test("event-routing call chain immediately hands progression settlement instances to settlement runtime", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const dispatchSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-dispatch.ts"),
    "utf8"
  );

  assert.match(dispatchSource, /progression/i);
  assert.match(dispatchSource, /settlementInstances/);
  assert.match(dispatchSource, /appliedBy: "runtime-settlement"/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern "progression resources round-trip through runtime-pack export import and loader|event-routing call chain immediately hands progression settlement instances to settlement runtime"`

Expected: FAIL until all chain seams are implemented.

- [x] **Step 3: Land documentation update**

```md
## 2026-07-25

- Added first-version `阶段轨道` authoring and runtime support.
- Progression now emits settlement instances only; the Event-routing chain immediately hands them to `SettlementRuntime`.
- Runtime-pack export/import and loader now understand `progress-tracks.json` and `progress-track-bindings.json`.
```

- [x] **Step 4: Run final verification**

Run: `npm.cmd run typecheck`
Expected: PASS

Run: `npm.cmd test -- --test-name-pattern "progression|settlement runtime|runtime dispatch|script editor progression"`
Expected: PASS

Run: `npm.cmd test`
Expected: PASS or a known unrelated existing failure with the failing test names recorded in the task notes before merge.

- [x] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs docs/change-log.md
git commit -m "feat: integrate progression tracks through settlement runtime"
```

## Self-Review

- Spec coverage check:
  - unified contracts/runtime state: Task 1
  - settlement-instance-only runtime behavior: Task 2
  - export/import/loader/workspace validation: Task 3
  - Chinese Script Editor authoring and hidden internal ids: Task 4
  - existing Event-routing-chain handoff and verification: Task 5
- Placeholder scan:
  - removed TODO/TBD wording
  - every task lists exact files, commands, and code snippets
- Type consistency:
  - `ProgressTrackDefinition`, `ProgressTrackBinding`, `ProgressTrackRuntimeState`, and `ProgressionTierSettlementPayload` are defined in Task 1 and reused unchanged in later tasks
  - `targetTierSettlementId` is the single tier-to-settlement field name across plan tasks

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Generic progression track implementation`
- Parent Task: `Generic progression track design`
- Parent Stage: `Legacy superpowers implementation resume`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `not-applicable`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Use the recorded plan plus repository diff for any later sync or commit closeout.`
- Next Entry Document: `docs/superpowers/plans/2026-07-25-generic-progression-track-implementation.md`
- Next Owner Document: `docs/superpowers/specs/2026-07-25-generic-progression-track-design.md`
- Push Status: `failed`
- Push Commit: `none`
- Resume From: `Re-run focused progression verification before any later repository sync or commit closeout.`
