# Troop Captain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a formal troop-captain system so every newly created troop must choose a reserve captain, that captain is auto-placed in `middle-center`, legacy troops still resolve captain from the center slot, and both troop-editor surfaces plus `battle-demo` visibly mark the captain with a prominent `L`.

**Architecture:** Store captain identity on `BattleFormation` as optional `captainMemberId`, but resolve it through one shared helper that falls back to `middle-center` for legacy formations. Push captain state through the existing troop-editor selector/view-model pipeline so create-dialog validation, preview grids, management details, and battle-demo all consume the same resolved captain semantics instead of inventing separate rules.

**Tech Stack:** TypeScript domain/application/UI modules under `src/`, source-driven and `.test-dist` CommonJS tests under `tests/`, Vite build, `tsc` typecheck, and `tools/lint-superpowers-plans.mjs`.

## Global Constraints

- Every troop must have exactly one captain for new creation flows.
- Newly created troops must choose the captain from reserve before creation succeeds.
- The chosen captain must be auto-placed into `middle-center`.
- Existing troops without explicit `captainMemberId` must keep working through center-slot fallback.
- Do not replace or rename the higher-level `general` / `isCommander` systems.
- Do not add a standalone captain reassignment flow in this slice.
- Do not do an up-front save migration for old formations.
- `battle-demo` only needs the approved bridge rule and UI markers, not a full runtime refactor.

## Execution State

- Status: `running`
- Last Updated: `2026-07-22`
- Current Focus: `Feature implementation is complete in the worktree; remaining work is final build verification, localhost-facing sync if needed, and closeout/commit cleanup.`
- Next Step: `Resolve the environment-blocked Vite build, then sync the served checkout if the user wants immediate browser validation from localhost.`
- Verification: `Bundled-node tsc/typecheck passes; bundled-node captain tests pass; plan lint passes; Vite build is currently blocked by sandbox/esbuild EPERM.`
- Notes: `Creation now touches the formal troop-editor flow and battle-demo left-side detail UI.`

## Progress Log

- 2026-07-22
  - Summary: `Plan created from the approved troop-captain spec after rechecking real troop-editor creation, management, and battle-demo bridge entry points.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Execute Task 1 and establish the shared captain data contract first.`
- 2026-07-22
  - Summary: `Completed captain-aware troop creation and troop-editor UI wiring in the worktree: new troops require a reserve captain, previews/management show the captain, and remove-flow blocks deleting the captain.`
  - Verification: `Bundled node tsc -p tsconfig.test.json; bundled node require('./tests/troop-captain-domain.test.cjs'); bundled node require('./tests/troop-captain-ui.test.cjs')`
  - Next: `Bridge the same captain semantics into battle-demo and then do final verification/sync.`
- 2026-07-22
  - Summary: `Completed the battle-demo captain bridge: inspected unit details now resolve captain from explicit id or center fallback, show a captain summary line, and mark the captain cell with an L badge.`
  - Verification: `Bundled node require('./tests/troop-captain-domain.test.cjs'); bundled node require('./tests/troop-captain-ui.test.cjs'); bundled node require('./tests/troop-captain-battle-demo.test.cjs'); bundled node tsc --noEmit -p tsconfig.json; bundled node tsc -p tsconfig.test.json; bundled node tools/lint-superpowers-plans.mjs`
  - Next: `Finish final build verification once sandbox/esbuild execution is unblocked, then sync the localhost-facing checkout if needed.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-22-troop-captain-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `src/application/app-actions.ts` still creates troops through `createTroopFormation(...)` with only a name; captain selection is not represented yet.
  - `src/application/troop-editor/troop-editor-selectors.ts` still emits slot occupancy only; it does not expose captain metadata or captain text to the views.
  - `src/ui/views/troop-editor/troop-editor-view.ts` still renders a name-only create dialog.
  - `src/ui/views/troop-editor/troop-management-view.ts` and `src/ui/views/troop-editor/troop-preview-grid.ts` still have no captain badge or label.
  - `prototypes/battle-demo/index.html` still needs a dedicated captain bridge for its left-side unit detail UI.

## Implementation Scope

### In Scope

- Formal `captainMemberId` storage on `BattleFormation`
- Shared captain-resolution helper with center fallback
- Captain-required troop creation flow from reserve
- Captain markers in troop preview, troop management, and battle-demo left-side detail UI
- Blocking invalid captain removal through existing troop-management remove flow

### Still Out Of Scope

- Changing captain after troop creation through a new dedicated workflow
- Adding captain gameplay bonuses or death-specific logic
- Replacing existing general/commander semantics
- Full battle-demo migration to formal troop runtime data

## File Map

### Existing files to modify

- `src/domain/battle-formation.ts`
  - Add `captainMemberId` and the shared resolution helper.
- `src/domain/troop-editor.ts`
  - Enforce captain-aware creation and block invalid captain removal.
- `src/application/app-actions.ts`
  - Require `captainReserveMemberId` for create-team actions.
- `src/application/troop-editor/troop-editor-selectors.ts`
  - Push captain metadata into shared troop snapshots.
- `src/application/troop-editor/troop-editor-stage-view-model.ts`
  - Carry captain flags through preview slots and create-dialog reserve choices.
- `src/application/troop-editor/troop-management-stage-view-model.ts`
  - Expose captain text and captain-aware battlefield/summary data.
- `src/ui/views/troop-editor/troop-preview-grid.ts`
  - Render the visible `L` badge.
- `src/ui/views/troop-editor/troop-editor-view.ts`
  - Replace the name-only create modal with name + captain selection.
- `src/ui/views/troop-editor/troop-editor-interactions.ts`
  - Validate captain selection before create and pass `captainReserveMemberId`.
- `src/ui/views/troop-editor/troop-management-view.ts`
  - Render captain text in the left-side troop-management summary.
- `src/ui/views/troop-editor/troop-management-move-interactions.ts`
  - Block captain removal through the existing remove flow with explicit alert copy.
- `src/styles/views.css`
  - Add captain badge and create-dialog selection styling.
- `prototypes/battle-demo/index.html`
  - Resolve and render captain markers in left-side unit summary + formation grid.

### New files to create

- `tests/troop-captain-domain.test.cjs`
  - Domain/app contract coverage for captain creation and fallback.
- `tests/troop-captain-ui.test.cjs`
  - Troop-editor selector/view/view-source coverage for captain badge and create flow.
- `tests/troop-captain-battle-demo.test.cjs`
  - Battle-demo captain bridge and left-side rendering coverage.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/troop-captain-domain.test.cjs tests/troop-captain-ui.test.cjs tests/troop-captain-battle-demo.test.cjs`
  - `node --test tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs tests/battle-turn-transition.test.cjs`
- Required commands:
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`

## Task 1: Add Captain State To Domain And Create Flow

**Files:**
- Modify: `src/domain/battle-formation.ts`
- Modify: `src/domain/troop-editor.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `src/application/troop-editor/troop-editor-selectors.ts`
- Create: `tests/troop-captain-domain.test.cjs`

**Interfaces:**
- Consumes:
  - `type BattleFormation`
  - `function createTroopFormation(troopRuntimeState, input)`
  - `function removeTroopFormationMember(troopRuntimeState, input)`
- Produces:
  - `captainMemberId?: BattleFormationMemberId`
  - `function getBattleFormationCaptainMember(formation: BattleFormation): BattleFormationMember | null`
  - `function createTroopFormation(troopRuntimeState: TroopRuntimeState, input: { leaderCharacterId: CharacterId; name: string; captainReserveMemberId: string; }): TroopRuntimeState`
  - `function createTroopEditorTeam(appState: AppState, input: { name: string; captainReserveMemberId: string; }): AppState`
  - shared troop snapshot fields:
    - `captainMemberId: string | null`
    - `captainName: string | null`
    - slot-level `isCaptain: boolean`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTroopFormation,
  removeTroopFormationMember,
} = require("../.test-dist/domain/troop-editor.js");
const {
  getBattleFormationCaptainMember,
} = require("../.test-dist/domain/battle-formation.js");
const {
  createTroopEditorTeam,
} = require("../.test-dist/application/app-actions.js");

function createTroopState() {
  return {
    formations: [
      {
        id: "troop.main",
        name: "主队",
        leaderCharacterId: "char.player",
        members: [
          {
            id: "member.main.center",
            unitDefinitionId: "unit.infantry.demo",
            name: "中军甲",
            role: "infantry",
            slotKey: "middle-center",
          },
        ],
      },
    ],
    reserve: {
      capacity: 10,
      members: [
        {
          id: "reserve.captain",
          unitDefinitionId: "unit.spearman.demo",
          name: "预备队长",
          role: "spearman",
          sourceTroopId: "reserve.pool",
        },
        {
          id: "reserve.other",
          unitDefinitionId: "unit.archer.demo",
          name: "预备弓手",
          role: "archer",
          sourceTroopId: "reserve.pool",
        },
      ],
    },
    shop: {
      refreshVersion: 0,
      offers: [],
    },
  };
}

test("new troop creation consumes selected reserve captain and pins captain to middle-center", () => {
  const nextState = createTroopFormation(createTroopState(), {
    leaderCharacterId: "char.player",
    name: "先锋队",
    captainReserveMemberId: "reserve.captain",
  });

  const createdTroop = nextState.formations.at(-1);
  assert.equal(createdTroop?.name, "先锋队");
  assert.equal(createdTroop?.captainMemberId, "reserve.captain");
  assert.deepEqual(createdTroop?.members, [
    {
      id: "reserve.captain",
      unitDefinitionId: "unit.spearman.demo",
      name: "预备队长",
      role: "spearman",
      slotKey: "middle-center",
    },
  ]);
  assert.deepEqual(
    nextState.reserve.members.map((member) => member.id),
    ["reserve.other"],
  );
});

test("legacy formations resolve captain from middle-center when explicit captainMemberId is absent", () => {
  const captain = getBattleFormationCaptainMember({
    id: "troop.legacy",
    name: "旧队",
    leaderCharacterId: "char.player",
    members: [
      {
        id: "legacy.left",
        unitDefinitionId: "unit.spearman.demo",
        name: "左翼",
        role: "spearman",
        slotKey: "middle-left",
      },
      {
        id: "legacy.center",
        unitDefinitionId: "unit.infantry.demo",
        name: "中军",
        role: "infantry",
        slotKey: "middle-center",
      },
    ],
  });

  assert.equal(captain?.id, "legacy.center");
});

test("captain removal through the normal remove path is blocked", () => {
  const nextState = removeTroopFormationMember(
    {
      formations: [
        {
          id: "troop.custom.1",
          name: "先锋队",
          leaderCharacterId: "char.player",
          captainMemberId: "captain.member",
          members: [
            {
              id: "captain.member",
              unitDefinitionId: "unit.infantry.demo",
              name: "队长甲",
              role: "infantry",
              slotKey: "middle-center",
            },
          ],
        },
      ],
      reserve: {
        capacity: 10,
        members: [],
      },
      shop: {
        refreshVersion: 0,
        offers: [],
      },
    },
    {
      troopId: "troop.custom.1",
      slotKey: "middle-center",
    },
  );

  assert.equal(nextState.formations[0].members.length, 1);
  assert.equal(nextState.reserve.members.length, 0);
});

test("app action requires captainReserveMemberId when creating a troop", () => {
  const appState = {
    gameState: {
      player: {
        characterId: "char.player",
      },
      ui: {
        selectedTroopId: null,
      },
      runtime: {
        troops: createTroopState(),
      },
    },
  };

  const nextState = createTroopEditorTeam(appState, {
    name: "先锋队",
    captainReserveMemberId: "reserve.captain",
  });

  assert.equal(nextState.gameState.runtime.troops.formations.at(-1)?.captainMemberId, "reserve.captain");
  assert.equal(nextState.gameState.ui.selectedTroopId, "troop.custom.2");
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/troop-captain-domain.test.cjs
```

Expected:

- `FAIL`
- missing `getBattleFormationCaptainMember`
- or `createTroopFormation` does not accept `captainReserveMemberId`
- or captain removal is not blocked yet

- [x] **Step 3: Write minimal implementation**

```ts
// src/domain/battle-formation.ts
export type BattleFormation = {
  id: BattleFormationId;
  name: string;
  leaderCharacterId: CharacterId;
  members: BattleFormationMember[];
  captainMemberId?: BattleFormationMemberId;
  rankCapacityBonus?: number;
  traitCapacityBonus?: number;
};

export function getBattleFormationCaptainMember(
  formation: BattleFormation
): BattleFormationMember | null {
  if (formation.captainMemberId != null) {
    const explicitCaptain =
      formation.members.find((member) => member.id === formation.captainMemberId) ?? null;
    if (explicitCaptain != null) {
      return explicitCaptain;
    }
  }

  return (
    formation.members.find((member) => member.slotKey === "middle-center") ?? null
  );
}
```

```ts
// src/domain/troop-editor.ts
export function createTroopFormation(
  troopRuntimeState: TroopRuntimeState,
  input: {
    leaderCharacterId: CharacterId;
    name: string;
    captainReserveMemberId: string;
  }
): TroopRuntimeState {
  const normalizedName = input.name.trim().slice(0, 10);
  if (normalizedName.length === 0) {
    return troopRuntimeState;
  }

  const reserveCaptain =
    troopRuntimeState.reserve.members.find(
      (member) => member.id === input.captainReserveMemberId
    ) ?? null;
  if (reserveCaptain == null) {
    return troopRuntimeState;
  }

  const nextFormation = {
    id: nextId,
    name: normalizedName,
    leaderCharacterId: input.leaderCharacterId,
    captainMemberId: reserveCaptain.id,
    members: [
      {
        id: reserveCaptain.id,
        unitDefinitionId: reserveCaptain.unitDefinitionId,
        name: reserveCaptain.name,
        role: reserveCaptain.role,
        slotKey: "middle-center",
        ...(reserveCaptain.characterId == null
          ? {}
          : { characterId: reserveCaptain.characterId }),
        ...(reserveCaptain.capacityCost == null
          ? {}
          : { capacityCost: reserveCaptain.capacityCost }),
      },
    ],
  };

  return {
    ...troopRuntimeState,
    formations: [...troopRuntimeState.formations, nextFormation],
    reserve: {
      ...troopRuntimeState.reserve,
      members: troopRuntimeState.reserve.members.filter(
        (member) => member.id !== reserveCaptain.id
      ),
    },
  };
}

export function removeTroopFormationMember(
  troopRuntimeState: TroopRuntimeState,
  input: {
    troopId: string;
    slotKey: BattleFormationSlotKey;
  }
): TroopRuntimeState {
  const formation =
    troopRuntimeState.formations.find((candidate) => candidate.id === input.troopId) ?? null;
  if (formation == null) {
    return troopRuntimeState;
  }

  const captain = getBattleFormationCaptainMember(formation);
  if (captain?.slotKey === input.slotKey) {
    return troopRuntimeState;
  }

  // keep existing reserve transfer behavior
}
```

```ts
// src/application/app-actions.ts
export function createTroopEditorTeam(
  appState: AppState,
  input: {
    name: string;
    captainReserveMemberId: string;
  }
): AppState {
  const nextTroops = createTroopFormation(appState.gameState.runtime.troops, {
    leaderCharacterId: appState.gameState.player.characterId,
    name: input.name,
    captainReserveMemberId: input.captainReserveMemberId,
  });
  // keep existing selectedTroopId logic
}
```

```ts
// src/application/troop-editor/troop-editor-selectors.ts
function createTroopSlots(appState: AppState, troopId: string): SharedTroopSlotSnapshot[] {
  const formation =
    appState.gameState.runtime.troops.formations.find((entry) => entry.id === troopId) ?? null;
  const captainId = formation == null ? null : getBattleFormationCaptainMember(formation)?.id ?? null;

  return BATTLE_FORMATION_SLOT_KEYS.map((slotKey) => {
    const occupant = formation?.members.find((member) => member.slotKey === slotKey) ?? null;
    return {
      slotKey,
      occupantName: occupant?.name ?? null,
      occupantRole: occupant?.role ?? null,
      isOccupied: occupant != null,
      isCaptain: occupant?.id === captainId,
    };
  });
}
```

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build:test
node --test tests/troop-captain-domain.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/troop-captain-domain.test.cjs src/domain/battle-formation.ts src/domain/troop-editor.ts src/application/app-actions.ts src/application/troop-editor/troop-editor-selectors.ts
git commit -m "feat: add troop captain domain contract"
```

## Task 2: Carry Captain Metadata Through Troop Editor UI And Enforce Create-Dialog Selection

**Files:**
- Modify: `src/application/troop-editor/troop-editor-stage-view-model.ts`
- Modify: `src/application/troop-editor/troop-management-stage-view-model.ts`
- Modify: `src/ui/views/troop-editor/troop-preview-grid.ts`
- Modify: `src/ui/views/troop-editor/troop-editor-view.ts`
- Modify: `src/ui/views/troop-editor/troop-editor-interactions.ts`
- Modify: `src/ui/views/troop-editor/troop-management-view.ts`
- Modify: `src/ui/views/troop-editor/troop-management-move-interactions.ts`
- Modify: `src/styles/views.css`
- Create: `tests/troop-captain-ui.test.cjs`

**Interfaces:**
- Consumes:
  - slot-level `isCaptain`
  - troop-level `captainName`
  - `createTroopEditorTeam(appState, { name, captainReserveMemberId })`
- Produces:
  - `type TroopPreviewSlotViewModel = { slotKey; label; role; isOccupied; isCaptain; }`
  - create-dialog reserve option view model:
    - `type TroopCreateCaptainOptionViewModel = { id: string; name: string; roleLabel: string; }`
  - troop-management summary field or label text for `队长`
  - create-dialog callback shape:
    - `onCreateTeam(input: { name: string; captainReserveMemberId: string }): void`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createTroopEditorStageViewModel,
} = require("../.test-dist/application/troop-editor/troop-editor-stage-view-model.js");
const {
  createTroopManagementStageViewModel,
} = require("../.test-dist/application/troop-editor/troop-management-stage-view-model.js");

test("troop preview view-model marks the captain slot and exposes reserve captain options for creation", () => {
  const model = createTroopEditorStageViewModel({
    resources: [],
    troopSnapshots: [
      {
        id: "troop.custom.1",
        name: "先锋队",
        subtitle: "",
        captainMemberId: "member.center",
        captainName: "张三",
        slots: [
          {
            slotKey: "middle-center",
            occupantName: "张三",
            occupantRole: "infantry",
            isOccupied: true,
            isCaptain: true,
          },
        ],
      },
    ],
    reserveMembers: [
      { id: "reserve.captain", name: "李四", role: "spearman", sourceTroopId: "reserve.pool" },
    ],
    shopOffers: [],
    reserveCount: 1,
    reserveCapacity: 10,
    selectedTroopId: "troop.custom.1",
    playerGold: 0,
    playerFame: 0,
  });

  assert.equal(model.troops[0].slots.find((slot) => slot.slotKey === "middle-center")?.isCaptain, true);
  assert.deepEqual(model.createCaptainOptions, [
    { id: "reserve.captain", name: "李四", roleLabel: "枪兵" },
  ]);
});

test("troop-management view-model exposes captain text for the selected troop", () => {
  const model = createTroopManagementStageViewModel({
    resources: [],
    troopSnapshots: [
      {
        id: "troop.custom.1",
        name: "先锋队",
        subtitle: "",
        captainMemberId: "member.center",
        captainName: "张三",
        slots: [
          {
            slotKey: "middle-center",
            occupantName: "张三",
            occupantRole: "infantry",
            isOccupied: true,
            isCaptain: true,
          },
        ],
      },
    ],
    selectedTroopSnapshot: {
      id: "troop.custom.1",
      name: "先锋队",
      subtitle: "",
      captainMemberId: "member.center",
      captainName: "张三",
      slots: [
        {
          slotKey: "middle-center",
          occupantName: "张三",
          occupantRole: "infantry",
          isOccupied: true,
          isCaptain: true,
        },
      ],
    },
    reserveMembers: [],
    reserveCapacity: 10,
    summary: {
      threatLevelText: "低",
      movementText: "4",
      moraleText: "80",
      scaleText: "1/9",
      leaderTraitText: "无",
    },
  });

  assert.equal(model.captainName, "张三");
  assert.equal(model.previewSlots[0].isCaptain, true);
});

test("troop editor sources render captain selection and prominent L badge", () => {
  const editorSource = fs.readFileSync("src/ui/views/troop-editor/troop-editor-view.ts", "utf8");
  const gridSource = fs.readFileSync("src/ui/views/troop-editor/troop-preview-grid.ts", "utf8");
  const interactionSource = fs.readFileSync("src/ui/views/troop-editor/troop-editor-interactions.ts", "utf8");
  const managementSource = fs.readFileSync("src/ui/views/troop-editor/troop-management-view.ts", "utf8");

  assert.match(editorSource, /data-troop-editor-create-captain-list/);
  assert.match(editorSource, /data-troop-editor-create-member=/);
  assert.match(gridSource, /c-troop-preview-grid__captain-badge/);
  assert.match(interactionSource, /captainReserveMemberId: string/);
  assert.match(interactionSource, /selectedCreateCaptainId/);
  assert.match(managementSource, /队长/);
});

test("troop-management move interactions block removing the current captain", () => {
  const source = fs.readFileSync(
    "src/ui/views/troop-editor/troop-management-move-interactions.ts",
    "utf8",
  );
  assert.match(source, /captainRemoveForbidden/);
  assert.match(source, /data-captain-slot-key/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/troop-captain-ui.test.cjs
```

Expected:

- `FAIL`
- missing `createCaptainOptions`
- or missing `isCaptain`
- or source files still only render name-only create UI

- [x] **Step 3: Write minimal implementation**

```ts
// src/application/troop-editor/troop-editor-stage-view-model.ts
export type TroopPreviewSlotViewModel = {
  slotKey: BattleFormationSlotKey;
  label: string;
  role: string | null;
  isOccupied: boolean;
  isCaptain: boolean;
};

export type TroopCreateCaptainOptionViewModel = {
  id: string;
  name: string;
  roleLabel: string;
};

export type TroopEditorStageViewModel = {
  // existing fields...
  createCaptainOptions: TroopCreateCaptainOptionViewModel[];
};

return {
  // existing fields...
  createCaptainOptions: input.reserveMembers.map((member) => ({
    id: member.id,
    name: member.name,
    roleLabel: getTroopRoleLabel(member.role),
  })),
};
```

```ts
// src/application/troop-editor/troop-management-stage-view-model.ts
export type TroopManagementStageViewModel = {
  // existing fields...
  captainName: string | null;
};

return {
  // existing fields...
  captainName: input.selectedTroopSnapshot.captainName,
};
```

```ts
// src/ui/views/troop-editor/troop-preview-grid.ts
return `
  <article
    class="c-troop-preview-grid__slot${slot.isOccupied ? " is-occupied" : ""}${slot.isCaptain ? " is-captain" : ""}"
    data-slot-key="${slot.slotKey}"
  >
    ${slot.isCaptain ? '<span class="c-troop-preview-grid__captain-badge">L</span>' : ""}
    <span class="c-troop-preview-grid__slot-key">${slot.slotKey}</span>
    <strong class="c-troop-preview-grid__slot-label">${displayLabel}</strong>
  </article>
`;
```

```ts
// src/ui/views/troop-editor/troop-editor-view.ts
<div class="c-troop-editor__create-captain-list" data-troop-editor-create-captain-list>
  ${model.createCaptainOptions.map((member) => `
    <button
      type="button"
      class="c-button c-troop-editor__create-captain-option"
      data-troop-editor-create-member="${member.id}"
    >
      <strong>${member.name}</strong>
      <span>${member.roleLabel}</span>
      <span class="c-troop-editor__create-captain-flag">队长</span>
    </button>
  `).join("")}
</div>
```

```ts
// src/ui/views/troop-editor/troop-editor-interactions.ts
type SyncTroopEditorInteractionsInput = {
  onCreateTeam: (input: { name: string; captainReserveMemberId: string }) => void;
  // existing callbacks...
};

type InteractionState = {
  // existing fields...
  selectedCreateCaptainId: string | null;
};

const CREATE_ERROR_TEXT = {
  emptyName: "队伍名称不能为空",
  duplicateName: "队伍名称不能重复",
  missingCaptain: "必须先从预备队中选择一名士兵作为队长",
} as const;

if (state.selectedCreateCaptainId == null) {
  state.createErrorText = CREATE_ERROR_TEXT.missingCaptain;
  syncUi();
  return;
}

input.onCreateTeam({
  name: normalizedName,
  captainReserveMemberId: state.selectedCreateCaptainId,
});
```

```ts
// src/ui/views/troop-editor/troop-management-view.ts
<section class="c-troop-management__summary">
  <div class="c-troop-management__summary-nameplate">${model.troopName}</div>
  <div class="c-troop-management__captain-line">
    <span class="c-troop-management__captain-label">队长</span>
    <strong class="c-troop-management__captain-value">${model.captainName ?? "暂无"}</strong>
  </div>
  <div class="c-troop-management__summary-grid">
```

```ts
// src/ui/views/troop-editor/troop-management-move-interactions.ts
const ALERT_TEXT = {
  // existing alerts...
  captainRemoveForbidden: "当前队长不可直接移出队伍",
} as const;

const captainSlotKey =
  root.dataset.captainSlotKey as BattleFormationSlotKey | undefined;

if (state.mode === "remove-select" && slotKey === captainSlotKey) {
  resetToIdle();
  showAlert(ALERT_TEXT.captainRemoveForbidden);
  return;
}
```

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build:test
node --test tests/troop-captain-ui.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Run troop-editor regression checks**

Run:

```bash
npm run build:test
node --test tests/troop-captain-domain.test.cjs tests/troop-captain-ui.test.cjs tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 6: Commit**

```bash
git add tests/troop-captain-ui.test.cjs src/application/troop-editor/troop-editor-stage-view-model.ts src/application/troop-editor/troop-management-stage-view-model.ts src/ui/views/troop-editor/troop-preview-grid.ts src/ui/views/troop-editor/troop-editor-view.ts src/ui/views/troop-editor/troop-editor-interactions.ts src/ui/views/troop-editor/troop-management-view.ts src/ui/views/troop-editor/troop-management-move-interactions.ts src/styles/views.css
git commit -m "feat: surface troop captains in troop editor"
```

## Task 3: Bridge Captain Markers Into Battle Demo And Run Final Verification

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Create: `tests/troop-captain-battle-demo.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-22-troop-captain.md`

**Interfaces:**
- Consumes:
  - battle unit left-side detail rendering in `prototypes/battle-demo/index.html`
  - legacy fallback rule: `middle-center`
- Produces:
  - `function getFormationCaptainMember(unit)`
  - captain summary line in the inspected unit panel
  - `L` badge on the captain cell in the inspected formation grid

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) throw new Error(`Missing signature: ${signature}`);
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(bodyStart + 1, index);
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadCaptainBridge() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const body = extractFunctionBody(source, "function getFormationCaptainMember(unit)");
  const getFormationCaptainMember = new Function(
    `return function getFormationCaptainMember(unit) {${body}};`,
  )();
  return { source, getFormationCaptainMember };
}

test("battle demo resolves captain from explicit member id first and middle-center second", () => {
  const { getFormationCaptainMember } = loadCaptainBridge();

  assert.equal(
    getFormationCaptainMember({
      captainMemberId: "member.right",
      formationMembers: [
        { id: "member.center", slot: "middle-center", name: "中军" },
        { id: "member.right", slot: "middle-right", name: "右翼" },
      ],
    })?.name,
    "右翼",
  );

  assert.equal(
    getFormationCaptainMember({
      formationMembers: [
        { id: "member.center", slot: "middle-center", name: "中军" },
      ],
    })?.name,
    "中军",
  );
});

test("battle demo source renders captain text and L badge in the left-side detail panel", () => {
  const { source } = loadCaptainBridge();
  assert.match(source, /队长/);
  assert.match(source, /formation-slot__captain-badge/);
  assert.match(source, /getFormationCaptainMember\(selectedUnit\)/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/troop-captain-battle-demo.test.cjs
```

Expected:

- `FAIL`
- missing `getFormationCaptainMember(unit)`
- or missing captain text / badge rendering in the inspected unit UI

- [x] **Step 3: Write minimal implementation**

```js
// prototypes/battle-demo/index.html
function getFormationCaptainMember(unit) {
  if (!unit || !Array.isArray(unit.formationMembers)) {
    return null;
  }

  if (unit.captainMemberId) {
    const explicitCaptain =
      unit.formationMembers.find((member) => member.id === unit.captainMemberId) ?? null;
    if (explicitCaptain) {
      return explicitCaptain;
    }
  }

  return (
    unit.formationMembers.find((member) => member.slot === "middle-center") ?? null
  );
}
```

```js
const captain = getFormationCaptainMember(selectedUnit);
captainSummary.innerHTML = captain
  ? `<span class="unit-detail-label">队长</span><strong>${captain.name}</strong>`
  : `<span class="unit-detail-label">队长</span><strong>暂无</strong>`;
```

```js
return `
  <div class="formation-slot ${member ? "occupied" : "empty"}">
    ${member && captain && member.id === captain.id ? '<span class="formation-slot__captain-badge">L</span>' : ""}
    <span class="slot-name">${slotLabel}</span>
    <span class="member-name">${member ? member.name : "空位"}</span>
  </div>
`;
```

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/troop-captain-battle-demo.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Run final verification and sync governance**

Run:

```bash
npm run build:test
node --test tests/troop-captain-domain.test.cjs tests/troop-captain-ui.test.cjs tests/troop-captain-battle-demo.test.cjs tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs tests/battle-turn-transition.test.cjs
npm run typecheck
npm run build
npm run lint:plans
```

Expected:

- `PASS` for all targeted tests
- `PASS` for `typecheck`
- Vite production build completes successfully
- plan lint passes after updating this plan's checkboxes, `Execution State`, and `Progress Log`

- [ ] **Step 6: Commit**

```bash
git add tests/troop-captain-battle-demo.test.cjs prototypes/battle-demo/index.html docs/superpowers/plans/2026-07-22-troop-captain.md
git commit -m "feat: bridge troop captain markers into battle demo"
```

## Exit Check

- [x] `New troop creation requires selecting a reserve captain before success.`
- [x] `Newly created troops store and render exactly one captain.`
- [x] `Legacy troops without captainMemberId still resolve captain from middle-center.`
- [x] `Troop-editor preview, troop-management, and battle-demo all show the captain with a prominent L.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`

## Self-Review

- Spec coverage: the plan covers explicit captain storage, center-slot fallback, reserve-based captain selection at creation time, captain removal blocking, troop-editor `L` markers, troop-management captain text, and battle-demo left-side captain rendering.
- Placeholder scan: no `TODO`/`TBD` placeholders remain in executable steps; each task names concrete files, commands, and interface names.
- Type consistency: the same captain fields flow through the plan from domain to UI: `captainMemberId`, `captainName`, `isCaptain`, and `captainReserveMemberId`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-22-troop-captain.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
