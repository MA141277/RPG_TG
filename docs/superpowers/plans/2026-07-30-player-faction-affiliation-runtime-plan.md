# Player Faction Affiliation Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one global runtime source for player faction affiliation, connect the Huangjue Temple and Guo Zixing story beats to it, and make active UI readers show `皇觉寺` then `红巾军` without relying on `clanId` or ad hoc `affiliationLabel` patches.

**Architecture:** Introduce a dedicated `runtime.factionAffiliations` state plus a single `FactionAffiliationRuntime` class that owns reads, joins, leaves, and compatibility label projection. Wire temple entry through a structured scene effect and Guo Zixing recruitment through the existing story callback, then migrate active UI readers to a shared runtime-backed resolver while keeping `runtime.factionMemberships` focused on review/rank identity.

**Tech Stack:** TypeScript, Vite, Node test runner, JSON scenario-pack content, `npm run build:test`, `node --test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Global Constraints

- Do not add faction-affiliation business branches to `src/main.ts`.
- `runtime.factionAffiliations` is the single source of truth for current faction ownership.
- `runtime.factionMemberships` remains review/rank-only and must not be repurposed as visible affiliation state.
- Temple entry must switch the player affiliation to `皇觉寺`.
- Guo Zixing recruitment must switch the player affiliation to `红巾军`.
- Visible affiliation readers must prefer runtime affiliation over compatibility `character.affiliationLabel`, then `character.clanId`.
- Keep faction changes data-driven: temple entry uses a structured scene effect instead of a one-off shell or house branch.
- Do not infer faction affiliation from rank labels such as `杂役` or `亲兵`.
- Update `docs/change-log.md` because this batch changes shared runtime contracts and cross-module wiring.
- Follow TDD: write the failing test first, verify the failure, implement the minimal code, and rerun the targeted tests before moving on.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Implementation, focused verification, changelog sync, and plan sync are complete; commit steps were intentionally skipped in the shared dirty worktree.`
- Next Step: `User review, or an explicit commit request if these changes should be recorded in git history.`
- Verification: `lint:plans passed earlier; faction-affiliation-runtime/story/ui tests passed; targeted robustness regressions passed; tsc --noEmit -p tsconfig.json passed; vite build printed success output but the escalated Node/Vite process still exited with Windows code -1073740791 after completion, while sandboxed build remains blocked by spawn EPERM.`
- Notes: `This plan was executed after subagent-driven implementation became unreliable on this thread (one deployment 404 and one partial RED draft with no report/commit), so the controller completed the work inline.`

## Progress Log

- 2026-07-30
  - Summary: `Created the player faction affiliation runtime design spec and executable implementation plan.`
  - Verification: `npm run lint:plans`
  - Next: `Choose execution mode, then begin Task 1 with failing runtime-state tests.`
- 2026-07-30
  - Summary: `Implemented runtime.factionAffiliations, structured temple and Guo Zixing faction joins, active UI reader migration, focused regressions, and changelog updates.`
  - Verification: `build:test + faction-affiliation-runtime/story/ui tests passed; targeted robustness regressions passed; tsc --noEmit -p tsconfig.json passed; vite build printed success output but exited -1073740791 in the escalated environment.`
  - Next: `Await user review or an explicit commit request for the current dirty worktree.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-player-faction-affiliation-runtime-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/content/scenario-packs/zhuyuanzhang/scenes.json` is the runtime story source; `src/content/story/zhu-yuanzhang-main-story.ts` is not the active pack loader input for this child.
  - `src/content/scenario-packs/zhuyuanzhang/scenes.json` currently clears `affiliationLabel` during ordination instead of assigning a faction through shared runtime state.
  - `src/application/story/story-callbacks.ts` currently writes Guo Zixing affiliation by mutating `character.affiliationLabel` directly.
  - `src/ui/app-render.ts`, `src/application/city-entries/select-leader-residence-options.ts`, and `src/application/house-modules/leader-residence/leader-residence-house-module.ts` still read visible affiliation from `affiliationLabel ?? clanId`.
  - `runtime.factionMemberships` already exists for review/rank progression and must stay separate from the new affiliation state.

## Implementation Scope

### In Scope

- Add the dedicated faction-affiliation domain/runtime state.
- Add the `FactionAffiliationRuntime` class and a shared display-label resolver.
- Seed `runtime.factionAffiliations` in initial state.
- Add a structured `set-faction-affiliation` scene effect.
- Route Huangjue Temple ordination into runtime faction affiliation.
- Route Guo Zixing recruitment into runtime faction affiliation.
- Migrate active visible-affiliation readers in character detail and leader-residence flows to the shared runtime resolver.
- Preserve compatibility by synchronizing `character.affiliationLabel`.
- Add focused tests, update changelog, and keep the plan file synchronized.

### Still Out Of Scope

- Reworking `runtime.factionMemberships`, faction merit tables, or review cadence.
- Migrating dormant legacy shells in `src/ui/entry-shell/**` or `src/ui/main-ui/**` in this batch.
- Converting the inactive TS story draft into the canonical runtime source.
- Introducing a general faction content registry for every historical faction.
- Closing or rewriting the current project-progress queue for unrelated children.

## File Map

### Existing files to modify

- `src/domain/game-state.ts`
  - Add `runtime.factionAffiliations` to the canonical game state contract.
- `src/application/state/create-initial-state.ts`
  - Seed `factionAffiliations: {}` in fresh runtime state.
- `src/domain/action.ts`
  - Add the structured `set-faction-affiliation` effect contract.
- `src/application/effects/effect-applier.ts`
  - Route the new effect through `FactionAffiliationRuntime`.
- `src/application/story/story-callbacks.ts`
  - Stop treating `affiliationLabel` as the primary source of truth during Guo Zixing recruitment.
- `src/content/scenario-packs/zhuyuanzhang/scenes.json`
  - Swap the ordination affiliation clear for a structured temple-affiliation effect.
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
  - Set the Guo Zixing faction display copy to `红巾军`.
- `src/ui/app-render.ts`
  - Resolve the character detail `所属` field from the shared runtime affiliation resolver instead of `clanId`.
- `src/application/city-entries/select-leader-residence-options.ts`
  - Resolve list `factionLabel` from the shared runtime affiliation resolver.
- `src/application/house-modules/leader-residence/leader-residence-house-module.ts`
  - Resolve status-metric `阵营` from the shared runtime affiliation resolver.
- `tests/robustness.test.cjs`
  - Update existing story callback expectations and add source-level checks where direct functional access is not exposed.
- `docs/change-log.md`
  - Record the new runtime affiliation state, structured temple effect, Guo Zixing runtime join path, and UI reader migration.
- `docs/superpowers/plans/2026-07-30-player-faction-affiliation-runtime-plan.md`
  - Track execution state, progress log, checkboxes, and verification.

### Existing files expected to be deleted

- None.

### New files to create

- `src/domain/faction-affiliation.ts`
  - Shared runtime affiliation types separate from review/rank membership.
- `src/application/faction/faction-affiliation-runtime.ts`
  - The single class that owns faction-affiliation reads, joins, leaves, and visible-label resolution.
- `tests/faction-affiliation-runtime.test.cjs`
  - Focused runtime-domain tests for the new class and initial-state storage.
- `tests/faction-affiliation-story.test.cjs`
  - Focused story/effect tests for temple entry and Guo Zixing recruitment runtime transitions.
- `tests/faction-affiliation-ui-contract.test.cjs`
  - Focused UI contract tests for active readers that must stop bypassing the runtime source.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-runtime.test.cjs tests/faction-affiliation-story.test.cjs tests/faction-affiliation-ui-contract.test.cjs }`
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "story callback resolves guo zixing camp copy from text entries|ordination scene does not overwrite faction rank title with monk story title" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Shared Faction Affiliation Runtime Contract

**Files:**
- Create: `src/domain/faction-affiliation.ts`
- Create: `src/application/faction/faction-affiliation-runtime.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Create: `tests/faction-affiliation-runtime.test.cjs`

**Interfaces:**
- Produces:
  - `FactionAffiliationState`
  - `FactionAffiliationsState`
  - `FactionAffiliationRuntime`
  - `readActiveFaction(state: GameState, characterId: string): FactionAffiliationState | null`
  - `joinFaction(input: { state: GameState; characterDefinitions: CharacterDefinition[]; characterId: string; factionId: string; factionName: string; joinedBy: string; sourceEventId?: string; syncCharacterLabel?: boolean; }): { state: GameState; characterDefinitions: CharacterDefinition[] }`
  - `leaveFaction(input: { state: GameState; characterDefinitions: CharacterDefinition[]; characterId: string; leftBy: string; syncCharacterLabel?: boolean; }): { state: GameState; characterDefinitions: CharacterDefinition[] }`
  - `resolveCharacterFactionLabel(input: { state: GameState; character: CharacterDefinition }): string | null`
- Consumes:
  - `CharacterDefinition`
  - `GameState.calendar`
  - `GameState.runtime`

- [x] **Step 1: Write the failing runtime tests**

Create `tests/faction-affiliation-runtime.test.cjs` with the exact contract below:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  FactionAffiliationRuntime,
} = require("../.test-dist/application/faction/faction-affiliation-runtime.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.yuanmo",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "剩余 7 天",
    mainHouseMissionText: "前往寺中听候训示",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });
}

function createBaseCharacters() {
  return [
    {
      id: "char.player",
      name: "朱重八",
      birthYear: 1328,
      age: 24,
      cityId: "city.kulan",
      portraitId: "portrait.zhu_yuanzhang.young",
      stats: {
        leadership: 55,
        martial: 62,
        intelligence: 63,
        politics: 41,
        charm: 46,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      clanId: "clan.old",
      affiliationLabel: "旧标签",
      availableFunctions: [],
    },
  ];
}

test("initial state seeds an empty faction affiliation runtime table", () => {
  const state = createBaseState();
  assert.deepEqual(state.runtime.factionAffiliations, {});
});

test("joining a faction records active runtime affiliation and syncs compatibility label", () => {
  const runtime = new FactionAffiliationRuntime();
  const result = runtime.joinFaction({
    state: createBaseState(),
    characterDefinitions: createBaseCharacters(),
    characterId: "char.player",
    factionId: "temple",
    factionName: "皇觉寺",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });

  assert.deepEqual(result.state.runtime.factionAffiliations["char.player"], {
    factionId: "temple",
    factionName: "皇觉寺",
    status: "active",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
    joinedOn: {
      year: 1352,
      month: 1,
      day: 1,
    },
  });
  assert.equal(result.characterDefinitions[0].affiliationLabel, "皇觉寺");
});

test("joining a second faction replaces visible ownership without touching clan fallback", () => {
  const runtime = new FactionAffiliationRuntime();
  const firstJoin = runtime.joinFaction({
    state: createBaseState(),
    characterDefinitions: createBaseCharacters(),
    characterId: "char.player",
    factionId: "temple",
    factionName: "皇觉寺",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });
  const secondJoin = runtime.joinFaction({
    state: firstJoin.state,
    characterDefinitions: firstJoin.characterDefinitions,
    characterId: "char.player",
    factionId: "red_turban",
    factionName: "红巾军",
    joinedBy: "story.zhu_yuanzhang.join-guo-zixing-camp",
  });

  assert.equal(
    secondJoin.state.runtime.factionAffiliations["char.player"].factionId,
    "red_turban"
  );
  assert.equal(secondJoin.characterDefinitions[0].clanId, "clan.old");
  assert.equal(secondJoin.characterDefinitions[0].affiliationLabel, "红巾军");
});

test("display label resolution prefers runtime faction over stale character fields", () => {
  const runtime = new FactionAffiliationRuntime();
  const joined = runtime.joinFaction({
    state: createBaseState(),
    characterDefinitions: createBaseCharacters(),
    characterId: "char.player",
    factionId: "temple",
    factionName: "皇觉寺",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });

  assert.equal(
    runtime.resolveCharacterFactionLabel({
      state: joined.state,
      character: joined.characterDefinitions[0],
    }),
    "皇觉寺"
  );
});
```

- [ ] **Step 2: Run the runtime tests and confirm they fail** (subagent only produced a partial RED draft before controller takeover)

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-runtime.test.cjs }
```

Expected:

- `FAIL` because the new faction-affiliation domain file, runtime class, and `runtime.factionAffiliations` state do not exist yet.

- [x] **Step 3: Implement the runtime domain and class**

Create `src/domain/faction-affiliation.ts` and `src/application/faction/faction-affiliation-runtime.ts` with the exact runtime-owner shape:

```ts
export type FactionAffiliationState = {
  factionId: string;
  factionName: string;
  status: "active" | "left";
  joinedBy: string;
  joinedOn: {
    year: number;
    month: number;
    day: number;
  };
  sourceEventId?: string;
};

export class FactionAffiliationRuntime {
  readActiveFaction(state: GameState, characterId: string): FactionAffiliationState | null {
    const record = state.runtime.factionAffiliations[characterId];
    return record?.status === "active" ? record : null;
  }

  joinFaction(input: JoinFactionInput): JoinFactionResult {
    const joinedOn = {
      year: input.state.calendar.year,
      month: input.state.calendar.month,
      day: input.state.calendar.day,
    };
    // write input.state.runtime.factionAffiliations[input.characterId] and mirror input.factionName into character.affiliationLabel when syncCharacterLabel !== false
  }

  resolveCharacterFactionLabel(input: {
    state: GameState;
    character: CharacterDefinition;
  }): string | null {
    return (
      this.readActiveFaction(input.state, input.character.id)?.factionName ??
      input.character.affiliationLabel ??
      input.character.clanId ??
      null
    );
  }
}

export const factionAffiliationRuntime = new FactionAffiliationRuntime();
export function resolveCharacterFactionLabel(input: {
  state: GameState;
  character: CharacterDefinition;
}): string | null {
  return factionAffiliationRuntime.resolveCharacterFactionLabel(input);
}
```

Then update `src/domain/game-state.ts` and `src/application/state/create-initial-state.ts` so new state always includes:

```ts
runtime: {
  flags: {},
  variables: {},
  factionMerit: {},
  factionMemberships: {},
  factionAffiliations: {}
}
```

- [x] **Step 4: Run the runtime tests and confirm they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-runtime.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit** (intentionally skipped in dirty shared worktree)

```bash
git add tests/faction-affiliation-runtime.test.cjs src/domain/faction-affiliation.ts src/application/faction/faction-affiliation-runtime.ts src/domain/game-state.ts src/application/state/create-initial-state.ts
git commit -m "feat: add faction affiliation runtime"
```

## Task 2: Temple And Guo Zixing Story Integration

**Files:**
- Modify: `src/domain/action.ts`
- Modify: `src/application/effects/effect-applier.ts`
- Modify: `src/application/story/story-callbacks.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenes.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Create: `tests/faction-affiliation-story.test.cjs`

**Interfaces:**
- Consumes:
  - `FactionAffiliationRuntime.joinFaction(...)`
  - `GameState.runtime.factionAffiliations`
- Produces:
  - `Effect` variant `{ type: "set-faction-affiliation"; characterId: string; factionId: string; factionName: string; joinedBy: string; sourceEventId?: string; }`
  - temple ordination scene data that emits `set-faction-affiliation`
  - Guo Zixing callback that writes runtime faction affiliation and mirrors the compatibility label

- [x] **Step 1: Write the failing story/effect tests**

Create `tests/faction-affiliation-story.test.cjs` with these exact cases:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  applyEffects,
} = require("../.test-dist/application/effects/effect-applier.js");
const {
  runStoryCallback,
} = require("../.test-dist/application/story/story-callbacks.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.yuanmo",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "剩余 7 天",
    mainHouseMissionText: "前往寺中听候训示",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });
}

function createBaseCharacters() {
  return [
    {
      id: "char.player",
      name: "朱重八",
      birthYear: 1328,
      age: 24,
      cityId: "city.kulan",
      portraitId: "portrait.zhu_yuanzhang.young",
      stats: {
        leadership: 55,
        martial: 62,
        intelligence: 63,
        politics: 41,
        charm: 46,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
    },
  ];
}

test("ordination pack scene assigns Huangjue Temple through a structured faction effect", () => {
  const scenes = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src/content/scenario-packs/zhuyuanzhang/scenes.json"),
      "utf8"
    )
  );
  const ordinationScene = scenes.find(
    (scene) => scene.id === "scene.story.zhu_yuanzhang.ordination"
  );
  const factionEffect = ordinationScene.actions
    .flatMap((action) => (Array.isArray(action.effects) ? action.effects : []))
    .find((effect) => effect.type === "set-faction-affiliation");

  assert.deepEqual(factionEffect, {
    type: "set-faction-affiliation",
    characterId: "char.player",
    factionId: "temple",
    factionName: "皇觉寺",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });
});

test("structured faction effect writes temple runtime affiliation and compatibility label", () => {
  const result = applyEffects(
    createBaseState(),
    [
      {
        type: "set-faction-affiliation",
        characterId: "char.player",
        factionId: "temple",
        factionName: "皇觉寺",
        joinedBy: "scene.story.zhu_yuanzhang.ordination",
      },
    ],
    {
      characterDefinitions: createBaseCharacters(),
    }
  );

  assert.equal(
    result.state.runtime.factionAffiliations["char.player"].factionName,
    "皇觉寺"
  );
  assert.equal(result.characterDefinitions[0].affiliationLabel, "皇觉寺");
});

test("guo zixing callback writes red turban runtime affiliation instead of only patching character text", () => {
  const result = runStoryCallback(
    "story.zhu_yuanzhang.join-guo-zixing-camp",
    undefined,
    {
      state: createBaseState(),
      characterDefinitions: createBaseCharacters(),
      textEntriesById: {
        "runtime.zhu_yuanzhang.main_mission.guo_zixing_keep": "前往帅府听候差遣",
        "runtime.zhu_yuanzhang.player.title.guo_zixing_camp": "亲兵",
        "runtime.zhu_yuanzhang.player.occupation.guo_zixing_camp": "郭营近卫",
        "runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp": "红巾军",
        "runtime.zhu_yuanzhang.player.biography.guo_zixing_camp":
          "你已被郭子兴留置左右，暂从亲兵与粮道杂务做起。",
      },
    }
  );

  assert.equal(
    result.state.runtime.factionAffiliations["char.player"].factionId,
    "red_turban"
  );
  assert.equal(
    result.state.runtime.factionAffiliations["char.player"].factionName,
    "红巾军"
  );
  assert.equal(result.characterDefinitions[0].affiliationLabel, "红巾军");
});
```

- [x] **Step 2: Run the story/effect tests and confirm they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-story.test.cjs }
```

Expected:

- `FAIL` because the effect type does not exist, the ordination scene data is not emitting it, and the Guo callback does not yet populate `runtime.factionAffiliations`.

- [x] **Step 3: Implement the structured effect and callback wiring**

Add the new effect contract to `src/domain/action.ts`:

```ts
| {
    type: "set-faction-affiliation";
    characterId: CharacterId;
    factionId: string;
    factionName: string;
    joinedBy: string;
    sourceEventId?: string;
  }
```

Route it in `src/application/effects/effect-applier.ts`:

```ts
case "set-faction-affiliation": {
  const result = factionAffiliationRuntime.joinFaction({
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
    characterId: effect.characterId,
    factionId: effect.factionId,
    factionName: effect.factionName,
    joinedBy: effect.joinedBy,
    sourceEventId: effect.sourceEventId,
  });
  nextState = result.state;
  nextCharacterDefinitions = result.characterDefinitions;
  break;
}
```

Update ordination scene content in `src/content/scenario-packs/zhuyuanzhang/scenes.json` so the player effect list contains:

```json
{
  "type": "set-faction-affiliation",
  "characterId": "char.player",
  "factionId": "temple",
  "factionName": "皇觉寺",
  "joinedBy": "scene.story.zhu_yuanzhang.ordination"
}
```

Update `src/application/story/story-callbacks.ts` so `story.zhu_yuanzhang.join-guo-zixing-camp` calls the runtime class:

```ts
const affiliationLabel = getStoryCallbackText(
  runtime,
  "runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp"
);
const joinedFaction = factionAffiliationRuntime.joinFaction({
  state: runtime.state,
  characterDefinitions: runtime.characterDefinitions,
  characterId: runtime.state.player.characterId,
  factionId: "red_turban",
  factionName: affiliationLabel,
  joinedBy: "story.zhu_yuanzhang.join-guo-zixing-camp",
  sourceEventId: runtime.state.scene.activeEventId ?? undefined,
});
```

Then change `src/content/scenario-packs/zhuyuanzhang/text-entries.json` so:

```json
"runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp": "红巾军"
```

- [x] **Step 4: Run the story/effect tests and confirm they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-story.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit** (intentionally skipped in dirty shared worktree)

```bash
git add tests/faction-affiliation-story.test.cjs src/domain/action.ts src/application/effects/effect-applier.ts src/application/story/story-callbacks.ts src/content/scenario-packs/zhuyuanzhang/scenes.json src/content/scenario-packs/zhuyuanzhang/text-entries.json
git commit -m "feat: route story faction changes through runtime"
```

## Task 3: Active UI Readers And Documentation

**Files:**
- Modify: `src/ui/app-render.ts`
- Modify: `src/application/city-entries/select-leader-residence-options.ts`
- Modify: `src/application/house-modules/leader-residence/leader-residence-house-module.ts`
- Create: `tests/faction-affiliation-ui-contract.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes:
  - `resolveCharacterFactionLabel(input: { state: GameState; character: CharacterDefinition }): string | null`
- Produces:
  - character-detail `所属` value derived from runtime affiliation
  - leader-residence option `factionLabel` derived from runtime affiliation
  - leader-residence status metric `阵营` derived from runtime affiliation

- [x] **Step 1: Write the failing UI contract tests**

Create `tests/faction-affiliation-ui-contract.test.cjs` with a behavior test for the exported selector and source-level checks for internal readers:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  selectLeaderResidenceOptions,
} = require("../.test-dist/application/city-entries/select-leader-residence-options.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.yuanmo",
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "剩余 7 天",
    mainHouseMissionText: "前往寺中听候训示",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });
}

test("leader residence options prefer runtime faction affiliation over stale character fields", () => {
  const baseState = createBaseState();
  const state = {
    ...baseState,
    runtime: {
      ...baseState.runtime,
      factionAffiliations: {
        "char.lord": {
          factionId: "red_turban",
          factionName: "红巾军",
          status: "active",
          joinedBy: "test",
          joinedOn: {
            year: 1352,
            month: 1,
            day: 1,
          },
        },
      },
    },
  };
  const options = selectLeaderResidenceOptions(
    state,
    [
      {
        id: "char.lord",
        name: "郭子兴",
        birthYear: 1306,
        age: 46,
        cityId: "city.kulan",
        portraitId: "portrait.guo_zixing",
        stats: {
          leadership: 70,
          martial: 65,
          intelligence: 45,
          politics: 42,
          charm: 52,
          fame: 0,
          gold: 0,
        },
        stamina: 100,
        clanId: "clan.legacy",
        affiliationLabel: "旧标签",
        isHistoricalFigure: true,
        leaderResidenceEligible: true,
        leaderResidenceStatus: "available",
        availableFunctions: [],
      },
    ],
    {
      id: "entry.leader-residence",
      cityId: "city.kulan",
      houseId: "house.kulan.keep",
      label: "帅府",
      actionId: "open-leader-residence",
    }
  );

  assert.equal(options[0].factionLabel, "红巾军");
});

test("app-render and leader-residence readers stop bypassing the runtime affiliation resolver", () => {
  const appRenderSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );
  const selectorSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/city-entries/select-leader-residence-options.ts"),
    "utf8"
  );
  const leaderResidenceSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/house-modules/leader-residence/leader-residence-house-module.ts"),
    "utf8"
  );

  assert.match(appRenderSource, /resolveCharacterFactionLabel/);
  assert.doesNotMatch(appRenderSource, /options\\.clanName\\s*=\\s*playerCharacter\\.clanId/);
  assert.match(selectorSource, /resolveCharacterFactionLabel/);
  assert.doesNotMatch(selectorSource, /affiliationLabel\\s*\\?\\?/);
  assert.match(leaderResidenceSource, /resolveCharacterFactionLabel/);
  assert.doesNotMatch(leaderResidenceSource, /affiliationLabel\\s*\\?\\?/);
});
```

Also update the existing `tests/robustness.test.cjs` story callback expectation so the injected affiliation text is `红巾军` and the callback assertion matches that player-facing value.

- [x] **Step 2: Run the UI contract tests and confirm they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-ui-contract.test.cjs }
```

Expected:

- `FAIL` because the active readers still derive visible affiliation directly from `affiliationLabel ?? clanId`, and the Guo callback fixture in `tests/robustness.test.cjs` still expects the old label.

- [x] **Step 3: Implement the reader migration and changelog**

Import the shared resolver into the active readers:

```ts
import { resolveCharacterFactionLabel } from "../application/faction/faction-affiliation-runtime";
```

Then replace direct field fallbacks with runtime-backed reads:

```ts
options.clanName =
  resolveCharacterFactionLabel({
    state: input.appState.gameState,
    character: playerCharacter,
  }) ?? "无";
```

```ts
factionLabel:
  resolveCharacterFactionLabel({
    state,
    character: characterDefinition,
  }) ?? "无所属",
```

```ts
value:
  resolveCharacterFactionLabel({
    state: input.gameState,
    character: visitedCharacter,
  }) ?? "无所属",
```

Then append a focused changelog entry to `docs/change-log.md` describing:

- the new `GameState.runtime.factionAffiliations`
- ordination now joining `皇觉寺` through structured runtime state
- Guo Zixing recruitment now joining `红巾军` through the shared runtime class
- character detail and leader-residence surfaces now reading the shared affiliation source

- [x] **Step 4: Run the UI contract tests and the updated regression assertions**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-affiliation-ui-contract.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "story callback resolves guo zixing camp copy from text entries|ordination scene does not overwrite faction rank title with monk story title" tests/robustness.test.cjs }
npm run typecheck
npm run build
```

Expected:

- `PASS` for the new UI contract tests
- `PASS` for the targeted robustness assertions
- `PASS` for `npm run typecheck`
- `PASS` for `npm run build`

- [ ] **Step 5: Commit** (intentionally skipped in dirty shared worktree)

```bash
git add tests/faction-affiliation-ui-contract.test.cjs tests/robustness.test.cjs src/ui/app-render.ts src/application/city-entries/select-leader-residence-options.ts src/application/house-modules/leader-residence/leader-residence-house-module.ts docs/change-log.md
git commit -m "feat: migrate active readers to faction affiliation runtime"
```

## Exit Check

- [x] `runtime.factionAffiliations` exists and is seeded in initial state.
- [ ] Temple ordination joins the player to `皇觉寺` through structured runtime state.
- [ ] Guo Zixing recruitment joins the player to `红巾军` through `FactionAffiliationRuntime`.
- [x] Character detail and leader-residence readers resolve visible affiliation from the runtime source.
- [x] `runtime.factionMemberships` remains review/rank-only.
- [x] Changelog updated with the shared runtime contract change.
- [x] Project progress remains untouched unless this child is explicitly promoted.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
