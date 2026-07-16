# Global NPC Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 1 of the global NPC interaction system: a reusable NPC pool/menu contract, arbitrary NPC character detail targets, default `角色情报 / 谈话 / 送礼` actions, and house roster integration without adding concrete house branches to `src/main.ts`.

**Architecture:** Add a small global NPC interaction state under `GameState.ui`, selectors under `src/application/npc-interaction/`, and renderer helpers under `src/ui/components/npc-interaction/`. House modules continue to own special business actions through the existing house lifecycle; the global NPC shell only owns default actions and menu composition.

**Tech Stack:** TypeScript, Vite, Node test runner through `npm test`, project type checking through `npm run typecheck`, plan governance through `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-16`
- Current Focus: `Task 5 completed and reviewed; preparing Task 6 final verification.`
- Next Step: `Start Task 6: Final Verification And Main Boundary Guard.`
- Verification: `npm run lint:plans passed for 59 files; npm test passed for 306 tests`
- Notes: `Do not mark this plan closed without structured closeout, project-progress sync, and remote push success.`

## Progress Log

- 2026-07-16
  - Summary: `Created the Phase 1 implementation plan for global NPC interaction.`
  - Verification: `npm run lint:plans passed for 59 files`
  - Next: `Choose an execution mode, then mark this plan running and start Task 1.`
- 2026-07-16
  - Summary: `Repaired four pre-existing robustness structural guards so Windows CRLF line endings and current TypeScript function return annotations do not make the baseline suite fail before NPC work starts.`
  - Verification: `npm test passed for 306 tests`
  - Next: `Start Task 1 with subagent-driven development.`
- 2026-07-16
  - Summary: `Completed Task 1 domain types and pure NPC interaction selectors; task review approved with no findings.`
  - Verification: `Implementer reported npm test passed for 309 tests and npm run typecheck passed; reviewer approved diff 0dbab8cd..bd3ad85b.`
  - Next: `Start Task 2 character detail targeting.`
- 2026-07-16
  - Summary: `Completed Task 2 character detail targeting; task review approved with one Minor scope-hygiene note about an SDD report artifact.`
  - Verification: `Implementer reported npm run typecheck and npm test passed; reviewer approved diff 3ad1f1d8..387de08a.`
  - Next: `Start Task 3 global NPC menu renderer and action handling.`
- 2026-07-16
  - Summary: `Completed Task 3 global NPC menu renderer and action handling; fixed reviewer-found HTML escaping risk and passed re-review.`
  - Verification: `Implementer reported npm test and npm run typecheck passed; fix reported focused escaping test and npm run typecheck passed; reviewer approved diff 88810ea6..e2af8ea8.`
  - Next: `Start Task 4 house roster integration and special action delegation.`
- 2026-07-16
  - Summary: `Completed Task 4 house roster integration and special action delegation; fixed reviewer-found roster context wiring and NPC session cleanup issues.`
  - Verification: `Implementer reported npm test and npm run typecheck passed; fix reported focused global NPC tests and npm run typecheck passed; reviewer approved diff 47e34913..a02bf9f1.`
  - Next: `Start Task 5 gift empty state and documentation.`
- 2026-07-16
  - Summary: `Completed Task 5 gift empty state and documentation; task review approved with no findings.`
  - Verification: `Implementer reported focused global NPC/gift/detail tests, npm run lint:plans, npm run typecheck, and git diff --check passed; reviewer approved diff 51db1a05..6dc83668.`
  - Next: `Start Task 6 final verification and main boundary guard.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-16-global-npc-interaction-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
  - `docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`
- House contract:
  - `docs/special-house-interface.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - The current code still keeps house NPC interaction inside per-house action ids such as `open-npc-dialogue`, `select-market-actor:*`, `talk`, `small-talk`, and leader residence direct `gift`.
  - `GameState.ui.overlayView` still renders character detail for the player character only.
  - `HouseModuleViewModel.standbyRoster` remains the first integration point for Phase 1.

## Implementation Scope

### In Scope

- Add global NPC interaction state, context, pool actor, menu option, and menu view-model types.
- Add pure selectors and reducers for opening/closing menus, choosing default options, disabled-state detection, menu ordering, and house-roster adaptation.
- Add arbitrary character detail targeting through `GameState.ui.detailCharacterId`.
- Render the NPC interaction menu as structured UI.
- Wire house roster actor clicks through the global NPC interaction shell.
- Keep context-specific special actions delegated through existing house module dispatch.
- Replace visible `闲谈` labels with `谈话` in Phase 1 house menus.
- Add tests for menu composition, blocked interaction, detail target selection, default talk mutation safety, and no `main.ts` concrete house branch.
- Update `docs/special-house-interface.md` and `docs/change-log.md`.

### Still Out Of Scope

- Full city/street NPC pool UI.
- Scene-declared NPC pools.
- Complete gift preference economy.
- Relationship balancing for talk and gift outcomes.
- New NPC art.
- Rewriting all house business reducers.

## File Map

### Existing files to modify

- `src/domain/global-ui.ts`
  - Add `NpcInteractionSession` and `detailCharacterId` to global UI state.
- `src/domain/game-state.ts`
  - No direct new import should be needed if `GlobalUIState` owns the new fields.
- `src/domain/house-module.ts`
  - Add optional `interactionActions` to `HouseStandbyActorViewModel`.
  - Add `npc-interaction-menu` and `gift-select` variants to `HouseOverlayViewModel` only if the UI uses the existing house overlay union for Phase 1. Prefer a global menu render path first.
- `src/application/state/create-initial-state.ts`
  - Initialize `detailCharacterId: null` and `npcInteractionSession: null`.
- `src/application/app-actions.ts`
  - Add helpers to open player detail, open character detail, and close overlays without losing the NPC context.
- `src/application/presenter/presenter-output.ts`
  - Surface `npcInteractionMenu` in overlay output if the presenter owns overlay composition.
- `src/application/presenter/app-presenter.ts`
  - If this file owns presenter output construction, select the NPC interaction menu view model here.
- `src/ui/app-render.ts`
  - Render detail overlay for `detailCharacterId ?? pinnedCharacterId`.
  - Render the global NPC interaction menu.
  - Adapt house module `standbyRoster` action ids to global NPC open actions where needed.
- `src/ui/views/house/house-shared-view.ts`
  - Preserve roster rendering while supporting global NPC action ids and disabled state.
- `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - Replace visible `闲谈` with `谈话`; expose contextual special actions on actors.
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - Replace visible `闲谈` with `谈话`; expose contextual special actions on the doctor.
- `src/application/house-modules/market-house/market-house-house-module.ts`
  - Normalize `small-talk` to global `谈话`; expose trade/investigation as special actions.
- `src/application/house-modules/leader-residence/leader-residence-house-module.ts`
  - Move direct gift entry behind shared default `送礼`; keep `学习` as a special action.
- `src/application/house/house-runtime.ts`
  - Clear `npcInteractionSession` when entering or leaving houses.
  - Provide a narrow dispatch path for special NPC actions if main event handling cannot reuse existing `data-house-action` dispatch.
- `src/main.ts`
  - Add only generic event handlers such as `data-npc-action` and `data-npc-target`.
  - Do not add concrete house id, module id, or NPC id business branches.
- `tests/robustness.test.cjs`
  - Add focused regression tests using `.test-dist` compiled modules.
- `docs/special-house-interface.md`
  - Document the shared NPC pool/menu contract.
- `docs/change-log.md`
  - Record the shared NPC interaction design implementation.

### Existing files expected to be deleted

- None.

### New files to create

- `src/domain/npc-interaction.ts`
  - Own stable NPC interaction context, session, pool, option, and menu view-model types.
- `src/application/npc-interaction/npc-interaction.ts`
  - Own pure selectors/reducers for menu state, default options, blocking rules, and house roster adaptation.
- `src/ui/components/npc-interaction/npc-interaction-menu.ts`
  - Render the global NPC menu from structured view data.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "global NPC interaction"`
  - `npm run typecheck`
  - `npm run lint:plans`
- Full verification:
  - `npm test`
  - `npm run build`

## Task 1: Domain Types And Pure NPC Interaction Selectors

**Files:**
- Create: `src/domain/npc-interaction.ts`
- Create: `src/application/npc-interaction/npc-interaction.ts`
- Modify: `src/domain/global-ui.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: `NpcInteractionContext`, `NpcInteractionSession`, `NpcPoolViewModel`, `NpcInteractionOptionViewModel`, `NpcInteractionMenuViewModel`.
- Produces: `NPC_INTERACTION_DEFAULT_OPTION_IDS`.
- Produces: `createNpcInteractionSession(context, targetCharacterId): NpcInteractionSession`.
- Produces: `closeNpcInteractionSession(): null`.
- Produces: `selectNpcInteractionMenu(input): NpcInteractionMenuViewModel | null`.
- Produces: `adaptHouseRosterToNpcPool(input): NpcPoolViewModel`.
- Produces: `isNpcInteractionBlocked(input): boolean`.

- [x] **Step 1: Write failing selector tests**

Append these imports near the top of `tests/robustness.test.cjs` after existing house imports:

```js
const {
  NPC_INTERACTION_DEFAULT_OPTION_IDS,
  adaptHouseRosterToNpcPool,
  createNpcInteractionSession,
  isNpcInteractionBlocked,
  selectNpcInteractionMenu,
} = require("../.test-dist/application/npc-interaction/npc-interaction.js");
```

Append these tests near the existing house roster tests:

```js
test("global NPC interaction menu keeps special actions above default actions", () => {
  const context = { type: "house", houseId: "house.test", moduleId: "tea-house" };
  const session = createNpcInteractionSession(context, "char.tea");
  const menu = selectNpcInteractionMenu({
    session,
    targetName: "茶博士",
    specialActions: [
      { id: "tea:ask-intel", label: "打听", kind: "special" },
      { id: "tea:debate", label: "舌战", kind: "special", tone: "accent" },
    ],
  });

  assert.equal(menu.type, "npc-interaction-menu");
  assert.deepEqual(
    menu.options.map((option) => option.id),
    [
      "tea:ask-intel",
      "tea:debate",
      NPC_INTERACTION_DEFAULT_OPTION_IDS.profile,
      NPC_INTERACTION_DEFAULT_OPTION_IDS.talk,
      NPC_INTERACTION_DEFAULT_OPTION_IDS.gift,
    ]
  );
  assert.deepEqual(
    menu.options.slice(-3).map((option) => option.label),
    ["角色情报", "谈话", "送礼"]
  );
});

test("global NPC interaction blocks roster clicks while overlays or dialogue own input", () => {
  assert.equal(isNpcInteractionBlocked({ overlayView: null, modalState: null, locationDialogueState: null, hasHouseOverlay: false, hasActiveDialogueAdvance: false }), false);
  assert.equal(isNpcInteractionBlocked({ overlayView: "detail", modalState: null, locationDialogueState: null, hasHouseOverlay: false, hasActiveDialogueAdvance: false }), true);
  assert.equal(isNpcInteractionBlocked({ overlayView: null, modalState: { type: "enter-city-confirm", cityId: "city.kulan", cityName: "库兰" }, locationDialogueState: null, hasHouseOverlay: false, hasActiveDialogueAdvance: false }), true);
  assert.equal(isNpcInteractionBlocked({ overlayView: null, modalState: null, locationDialogueState: { type: "house-access-refusal", speakerCharacterId: "char.guard", textLines: ["暂不可入。"], advanceHintText: "点击继续" }, hasHouseOverlay: false, hasActiveDialogueAdvance: false }), true);
  assert.equal(isNpcInteractionBlocked({ overlayView: null, modalState: null, locationDialogueState: null, hasHouseOverlay: true, hasActiveDialogueAdvance: false }), true);
  assert.equal(isNpcInteractionBlocked({ overlayView: null, modalState: null, locationDialogueState: null, hasHouseOverlay: false, hasActiveDialogueAdvance: true }), true);
});

test("global NPC interaction adapts house standby roster into reusable NPC pool", () => {
  const pool = adaptHouseRosterToNpcPool({
    context: { type: "house", houseId: "house.market", moduleId: "market-house" },
    actors: [
      { characterId: "char.merchant", name: "行商", title: "货栈商人", actionId: "select-market-actor:char.merchant" },
    ],
    disabled: false,
  });

  assert.equal(pool.context.type, "house");
  assert.equal(pool.actors[0].characterId, "char.merchant");
  assert.equal(pool.actors[0].name, "行商");
  assert.equal(pool.actors[0].disabled, false);
});
```

- [x] **Step 2: Run the tests and verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC interaction"
```

Expected:

- `npm run build:test` fails because `src/application/npc-interaction/npc-interaction.ts` does not exist, or
- the focused node test fails with `Cannot find module '../.test-dist/application/npc-interaction/npc-interaction.js'`.

- [x] **Step 3: Add domain types**

Create `src/domain/npc-interaction.ts`:

```ts
import type { CharacterId } from "./character";
import type { HouseModuleId } from "./house-module";

export type NpcInteractionContext =
  | { type: "house"; houseId: string; moduleId?: HouseModuleId | null }
  | { type: "city"; cityId: string; locationId?: string }
  | { type: "scene"; sceneId: string };

export type NpcInteractionMode = "menu" | "dialogue" | "gift-select";

export type NpcInteractionSession = {
  context: NpcInteractionContext;
  targetCharacterId: CharacterId;
  mode: NpcInteractionMode;
} | null;

export type NpcPoolActorViewModel = {
  characterId: CharacterId;
  name: string;
  title?: string;
  avatarImageUrl?: string | null;
  isSelected?: boolean;
  disabled?: boolean;
};

export type NpcPoolViewModel = {
  context: NpcInteractionContext;
  actors: NpcPoolActorViewModel[];
};

export type NpcInteractionOptionKind = "special" | "profile" | "talk" | "gift";

export type NpcInteractionOptionViewModel = {
  id: string;
  label: string;
  kind: NpcInteractionOptionKind;
  disabled?: boolean;
  tone?: "default" | "accent";
};

export type NpcInteractionMenuViewModel = {
  type: "npc-interaction-menu";
  context: NpcInteractionContext;
  targetCharacterId: CharacterId;
  targetName: string;
  options: NpcInteractionOptionViewModel[];
};
```

Modify `src/domain/global-ui.ts`:

```ts
import type {
  NpcInteractionSession,
} from "./npc-interaction";
```

Add these fields to `GlobalUIState`:

```ts
  detailCharacterId: CharacterId | null;
  npcInteractionSession: NpcInteractionSession;
```

Modify `src/application/state/create-initial-state.ts` inside `ui`:

```ts
      detailCharacterId: null,
      npcInteractionSession: null,
```

- [x] **Step 4: Add pure selector implementation**

Create `src/application/npc-interaction/npc-interaction.ts`:

```ts
import type { CharacterId } from "../../domain/character";
import type { HouseStandbyActorViewModel } from "../../domain/house-module";
import type {
  NpcInteractionContext,
  NpcInteractionMenuViewModel,
  NpcInteractionOptionViewModel,
  NpcInteractionSession,
  NpcPoolViewModel,
} from "../../domain/npc-interaction";

export const NPC_INTERACTION_DEFAULT_OPTION_IDS = {
  profile: "npc-interaction:profile",
  talk: "npc-interaction:talk",
  gift: "npc-interaction:gift",
} as const;

export function createNpcInteractionSession(
  context: NpcInteractionContext,
  targetCharacterId: CharacterId
): NpcInteractionSession {
  return {
    context,
    targetCharacterId,
    mode: "menu",
  };
}

export function closeNpcInteractionSession(): null {
  return null;
}

export function selectNpcInteractionMenu(input: {
  session: NpcInteractionSession;
  targetName: string | null;
  specialActions?: NpcInteractionOptionViewModel[];
  giftDisabled?: boolean;
}): NpcInteractionMenuViewModel | null {
  if (input.session == null || input.session.mode !== "menu" || input.targetName == null) {
    return null;
  }

  return {
    type: "npc-interaction-menu",
    context: input.session.context,
    targetCharacterId: input.session.targetCharacterId,
    targetName: input.targetName,
    options: [
      ...(input.specialActions ?? []),
      {
        id: NPC_INTERACTION_DEFAULT_OPTION_IDS.profile,
        label: "角色情报",
        kind: "profile",
      },
      {
        id: NPC_INTERACTION_DEFAULT_OPTION_IDS.talk,
        label: "谈话",
        kind: "talk",
      },
      {
        id: NPC_INTERACTION_DEFAULT_OPTION_IDS.gift,
        label: "送礼",
        kind: "gift",
        ...(input.giftDisabled === true ? { disabled: true } : {}),
      },
    ],
  };
}

export function adaptHouseRosterToNpcPool(input: {
  context: Extract<NpcInteractionContext, { type: "house" }>;
  actors: HouseStandbyActorViewModel[];
  disabled: boolean;
}): NpcPoolViewModel {
  return {
    context: input.context,
    actors: input.actors.map((actor) => ({
      characterId: actor.characterId,
      name: actor.name,
      ...(actor.title == null ? {} : { title: actor.title }),
      ...(actor.avatarImageUrl == null ? {} : { avatarImageUrl: actor.avatarImageUrl }),
      ...(actor.isSelected == null ? {} : { isSelected: actor.isSelected }),
      disabled: input.disabled || actor.actionId == null,
    })),
  };
}

export function isNpcInteractionBlocked(input: {
  overlayView: string | null;
  modalState: unknown | null;
  locationDialogueState: unknown | null;
  hasHouseOverlay: boolean;
  hasActiveDialogueAdvance: boolean;
}): boolean {
  return (
    input.overlayView != null ||
    input.modalState != null ||
    input.locationDialogueState != null ||
    input.hasHouseOverlay ||
    input.hasActiveDialogueAdvance
  );
}
```

- [x] **Step 5: Run focused tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC interaction"
```

Expected:

- `npm run build:test` exits `0`.
- Focused test output reports the three new `global NPC interaction` tests as passing.

- [x] **Step 6: Commit Task 1**

Run:

```bash
git add src/domain/npc-interaction.ts src/domain/global-ui.ts src/application/state/create-initial-state.ts src/application/npc-interaction/npc-interaction.ts tests/robustness.test.cjs
git commit -m "feat: add npc interaction contract"
```

## Task 2: Character Detail Targeting For Any NPC

**Files:**
- Modify: `src/domain/global-ui.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `GlobalUIState.detailCharacterId`.
- Produces: `openPlayerDetail(appState): AppState`.
- Produces: `openCharacterDetail(appState, characterId): AppState`.
- Produces: `closeGlobalOverlay(appState): AppState`.

- [x] **Step 1: Write failing tests for detail target actions**

Add imports:

```js
const {
  closeGlobalOverlay,
  openCharacterDetail,
  openPlayerDetail,
} = require("../.test-dist/application/app-actions.js");
```

Append tests:

```js
test("global NPC interaction character detail can target a non-player NPC", () => {
  const baseAppState = createRuntimeState(createBaseState()).app;
  const opened = openCharacterDetail(
    { ...baseAppState, gameState: createBaseState() },
    "char.market_merchant"
  );

  assert.equal(opened.gameState.ui.overlayView, "detail");
  assert.equal(opened.gameState.ui.detailCharacterId, "char.market_merchant");
});

test("player detail clears the NPC detail target and uses the pinned player fallback", () => {
  const baseAppState = {
    ...createRuntimeState(createBaseState()).app,
    gameState: {
      ...createBaseState(),
      ui: {
        ...createBaseState().ui,
        overlayView: "detail",
        detailCharacterId: "char.market_merchant",
      },
    },
  };
  const opened = openPlayerDetail(baseAppState);

  assert.equal(opened.gameState.ui.overlayView, "detail");
  assert.equal(opened.gameState.ui.detailCharacterId, null);
});

test("closing global overlay clears the arbitrary character detail target", () => {
  const baseAppState = {
    ...createRuntimeState(createBaseState()).app,
    gameState: {
      ...createBaseState(),
      ui: {
        ...createBaseState().ui,
        overlayView: "detail",
        detailCharacterId: "char.market_merchant",
      },
    },
  };
  const closed = closeGlobalOverlay(baseAppState);

  assert.equal(closed.gameState.ui.overlayView, null);
  assert.equal(closed.gameState.ui.detailCharacterId, null);
});
```

- [x] **Step 2: Run tests and verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "character detail"
```

Expected:

- Failure reports missing `openCharacterDetail`, `openPlayerDetail`, or `closeGlobalOverlay`.

- [x] **Step 3: Implement detail action helpers**

Modify `src/application/app-actions.ts`:

```ts
export function openPlayerDetail(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: "detail",
        detailCharacterId: null,
      },
    },
  };
}

export function openCharacterDetail(
  appState: AppState,
  characterId: string
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: "detail",
        detailCharacterId: characterId,
      },
    },
  };
}

export function closeGlobalOverlay(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: null,
        detailCharacterId: null,
      },
    },
  };
}
```

Keep `updateOverlayView()` for existing callers, but switch player-detail and close-overlay handlers to these explicit helpers.

- [x] **Step 4: Render selected detail character**

Modify `src/ui/app-render.ts`:

```ts
function getDetailCharacter(
  appState: AppState,
  playerCharacter: CharacterDefinition
): CharacterDefinition {
  const detailCharacterId = appState.gameState.ui.detailCharacterId;
  if (detailCharacterId == null) {
    return playerCharacter;
  }

  return (
    appState.characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === detailCharacterId
    ) ?? playerCharacter
  );
}
```

Use it in `renderOverlay()`:

```ts
  if (overlayView === "detail") {
    const detailCharacter = getDetailCharacter(input.appState, playerCharacter);
    return renderCharacterDetailView(
      detailCharacter,
      buildCharacterDetailOptions(input, detailCharacter)
    );
  }
```

- [x] **Step 5: Update generic main handlers**

Modify imports in `src/main.ts` from `src/application/app-actions.ts` to include:

```ts
  closeGlobalOverlay,
  openCharacterDetail,
  openPlayerDetail,
```

Change the close handler to call `closeGlobalOverlay(appState)`.

Change the player detail handler to call `openPlayerDetail(appState)`.

Add a generic NPC detail handler:

```ts
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const detailButton = target.closest("[data-npc-action='profile'][data-character-id]");
    if (!(detailButton instanceof HTMLElement)) {
      return;
    }
    const characterId = detailButton.dataset.characterId;
    if (characterId == null || characterId.length === 0) {
      return;
    }
    appState = openCharacterDetail(appState, characterId);
    renderApp();
  });
```

This handler is generic and must not inspect house ids, module ids, or NPC ids.

- [x] **Step 6: Run focused tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "character detail"
```

Expected:

- Focused tests pass.

- [x] **Step 7: Commit Task 2**

Run:

```bash
git add src/application/app-actions.ts src/ui/app-render.ts src/main.ts tests/robustness.test.cjs
git commit -m "feat: target character detail overlays"
```

## Task 3: Global NPC Menu Renderer And Action Handling

**Files:**
- Create: `src/ui/components/npc-interaction/npc-interaction-menu.ts`
- Modify: `src/application/npc-interaction/npc-interaction.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `src/application/presenter/presenter-output.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `NpcInteractionMenuViewModel`.
- Produces: `renderNpcInteractionMenu(menu: NpcInteractionMenuViewModel): string`.
- Produces: `openNpcInteraction(appState, context, targetCharacterId): AppState`.
- Produces: `closeNpcInteraction(appState): AppState`.
- Produces: `chooseNpcDefaultTalk(appState, targetCharacterId): AppState`.

- [x] **Step 1: Write failing renderer and state tests**

Append tests:

```js
test("global NPC interaction renderer emits generic menu actions", () => {
  const {
    renderNpcInteractionMenu,
  } = require("../.test-dist/ui/components/npc-interaction/npc-interaction-menu.js");
  const menu = {
    type: "npc-interaction-menu",
    context: { type: "house", houseId: "house.tea", moduleId: "tea-house" },
    targetCharacterId: "char.tea",
    targetName: "茶博士",
    options: [
      { id: "tea:ask-intel", label: "打听", kind: "special" },
      { id: "npc-interaction:profile", label: "角色情报", kind: "profile" },
      { id: "npc-interaction:talk", label: "谈话", kind: "talk" },
      { id: "npc-interaction:gift", label: "送礼", kind: "gift", disabled: true },
    ],
  };
  const html = renderNpcInteractionMenu(menu);

  assert.match(html, /data-npc-menu="interaction"/);
  assert.match(html, /data-npc-action="special"/);
  assert.match(html, /data-house-action="tea:ask-intel"/);
  assert.match(html, /data-npc-action="profile"/);
  assert.match(html, /data-character-id="char\.tea"/);
  assert.match(html, /disabled/);
});

test("global NPC default talk opens dialogue without mutating runtime state", () => {
  const {
    chooseNpcDefaultTalk,
    openNpcInteraction,
  } = require("../.test-dist/application/app-actions.js");
  const baseGameState = createBaseState();
  const baseAppState = {
    ...createRuntimeState(baseGameState).app,
    gameState: baseGameState,
  };
  const opened = openNpcInteraction(
    baseAppState,
    { type: "house", houseId: "house.tea", moduleId: "tea-house" },
    "char.tea"
  );
  const talked = chooseNpcDefaultTalk(opened, "char.tea");

  assert.equal(talked.gameState.ui.npcInteractionSession?.mode, "dialogue");
  assert.deepEqual(talked.gameState.runtime.variables, baseGameState.runtime.variables);
  assert.deepEqual(talked.gameState.runtime.flags, baseGameState.runtime.flags);
});
```

- [x] **Step 2: Run tests and verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC"
```

Expected:

- Failure reports missing renderer or app action exports.

- [x] **Step 3: Implement menu renderer**

Create `src/ui/components/npc-interaction/npc-interaction-menu.ts`:

```ts
import type { NpcInteractionMenuViewModel } from "../../../domain/npc-interaction";

export function renderNpcInteractionMenu(
  menu: NpcInteractionMenuViewModel | null
): string {
  if (menu == null) {
    return "";
  }

  return `
    <div class="c-npc-interaction-overlay" data-npc-menu="interaction">
      <section class="c-npc-interaction-menu" role="dialog" aria-modal="true" aria-label="${menu.targetName}">
        <h2 class="c-npc-interaction-menu__title">${menu.targetName}</h2>
        <div class="c-npc-interaction-menu__actions">
          ${menu.options
            .map((option) => {
              if (option.kind === "special") {
                return `
                  <button
                    type="button"
                    class="c-button c-grain-shop-button ${option.tone === "accent" ? "c-grain-shop-button--gold" : "c-grain-shop-button--paper"}"
                    data-npc-action="special"
                    data-house-action="${option.id}"
                    ${option.disabled === true ? "disabled" : ""}
                  >
                    ${option.label}
                  </button>
                `;
              }

              return `
                <button
                  type="button"
                  class="c-button c-grain-shop-button ${option.tone === "accent" ? "c-grain-shop-button--gold" : "c-grain-shop-button--paper"}"
                  data-npc-action="${option.kind}"
                  data-character-id="${menu.targetCharacterId}"
                  ${option.disabled === true ? "disabled" : ""}
                >
                  ${option.label}
                </button>
              `;
            })
            .join("")}
        </div>
        <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-npc-action="close">
          关闭
        </button>
      </section>
    </div>
  `;
}
```

- [x] **Step 4: Implement app action helpers**

Add to `src/application/app-actions.ts`:

```ts
import type {
  NpcInteractionContext,
} from "../domain/npc-interaction";
import {
  closeNpcInteractionSession,
  createNpcInteractionSession,
} from "./npc-interaction/npc-interaction";

export function openNpcInteraction(
  appState: AppState,
  context: NpcInteractionContext,
  targetCharacterId: string
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: createNpcInteractionSession(context, targetCharacterId),
      },
    },
  };
}

export function closeNpcInteraction(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: closeNpcInteractionSession(),
      },
    },
  };
}

export function chooseNpcDefaultTalk(
  appState: AppState,
  targetCharacterId: string
): AppState {
  const session = appState.gameState.ui.npcInteractionSession;
  if (session == null || session.targetCharacterId !== targetCharacterId) {
    return appState;
  }

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: {
          ...session,
          mode: "dialogue",
        },
      },
    },
  };
}
```

- [x] **Step 5: Render the global menu**

In `src/ui/app-render.ts`, import:

```ts
import {
  selectNpcInteractionMenu,
} from "../application/npc-interaction/npc-interaction";
import { renderNpcInteractionMenu } from "./components/npc-interaction/npc-interaction-menu";
```

Add a helper:

```ts
function renderNpcInteractionOverlay(input: AppRenderInput): string {
  const session = input.appState.gameState.ui.npcInteractionSession;
  const targetName =
    session == null
      ? null
      : input.appState.characterDefinitions.find(
          (characterDefinition) => characterDefinition.id === session.targetCharacterId
        )?.name ?? null;

  return renderNpcInteractionMenu(
    selectNpcInteractionMenu({
      session,
      targetName,
      specialActions: [],
      giftDisabled: true,
    })
  );
}
```

Render it after `renderModal(...)` and before global full-screen overlays:

```ts
            ${renderNpcInteractionOverlay(input)}
```

- [x] **Step 6: Add generic main handlers**

In `src/main.ts`, import:

```ts
  chooseNpcDefaultTalk,
  closeNpcInteraction,
  openNpcInteraction,
```

Add generic handlers:

```ts
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const openButton = target.closest("[data-npc-target][data-npc-context]");
    if (openButton instanceof HTMLElement) {
      const characterId = openButton.dataset.npcTarget;
      const rawContext = openButton.dataset.npcContext;
      if (characterId == null || rawContext == null) {
        return;
      }
      const context = JSON.parse(rawContext) as { type: "house"; houseId: string; moduleId?: string | null };
      appState = openNpcInteraction(appState, context, characterId);
      renderApp();
      return;
    }

    const npcAction = target.closest("[data-npc-action]");
    if (!(npcAction instanceof HTMLElement)) {
      return;
    }

    const action = npcAction.dataset.npcAction;
    if (action === "close") {
      appState = closeNpcInteraction(appState);
      renderApp();
      return;
    }

    if (action === "talk") {
      const characterId = npcAction.dataset.characterId;
      if (characterId == null) {
        return;
      }
      appState = chooseNpcDefaultTalk(appState, characterId);
      renderApp();
    }
  });
```

If using JSON in a data attribute creates escaping issues, replace `data-npc-context` with explicit `data-npc-context-type`, `data-house-id`, and `data-house-module-id`.

- [x] **Step 7: Run focused tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC"
```

Expected:

- Focused tests pass.

- [x] **Step 8: Commit Task 3**

Run:

```bash
git add src/ui/components/npc-interaction/npc-interaction-menu.ts src/application/npc-interaction/npc-interaction.ts src/application/app-actions.ts src/application/presenter/presenter-output.ts src/ui/app-render.ts src/main.ts tests/robustness.test.cjs
git commit -m "feat: render npc interaction menu"
```

## Task 4: House Roster Integration And Special Action Delegation

**Files:**
- Modify: `src/domain/house-module.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Modify: `src/application/house/house-runtime.ts`
- Modify: `src/application/house-modules/tea-house/tea-house-house-module.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/application/house-modules/market-house/market-house-house-module.ts`
- Modify: `src/application/house-modules/leader-residence/leader-residence-house-module.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `NpcInteractionMenuViewModel`.
- Produces: optional `interactionActions?: NpcInteractionOptionViewModel[]` on `HouseStandbyActorViewModel`.
- Produces: house roster buttons with generic `data-npc-target` attributes.
- Produces: special menu actions that continue to dispatch existing `data-house-action` ids.

- [x] **Step 1: Write failing house integration tests**

Append tests:

```js
test("global NPC interaction house roster exposes generic NPC target buttons", () => {
  const enterResult = teaHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });
  const viewModel = teaHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });
  const html = renderTeaHouseHouseView(viewModel);

  assert.match(html, /data-npc-target=/);
  assert.match(html, /data-npc-context-type="house"/);
});

test("global NPC interaction removes visible idle small-talk labels from tea and medicine menus", () => {
  const teaEnter = teaHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });
  const teaView = teaHouseHouseModule.selectViewModel({
    gameState: teaEnter.gameState,
    characterDefinitions: teaEnter.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: { ...teaEnter.sessionState, dialoguePhase: "idle" },
  });

  const medicineEnter = medicineHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });
  const medicineView = medicineHouseHouseModule.selectViewModel({
    gameState: medicineEnter.gameState,
    characterDefinitions: medicineEnter.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: { ...medicineEnter.sessionState, dialoguePhase: "idle" },
  });

  assert.equal(
    JSON.stringify(teaView.actionContainer?.actions ?? []).includes("闲谈"),
    false
  );
  assert.equal(
    JSON.stringify(medicineView.actionContainer?.actions ?? []).includes("闲谈"),
    false
  );
});
```

- [x] **Step 2: Run tests and verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC interaction"
```

Expected:

- The roster markup assertion fails because house roster buttons still use only `data-house-action`.
- The label assertion fails until visible `闲谈` labels are removed.

- [x] **Step 3: Add interaction actions to house actor view model**

Modify `src/domain/house-module.ts`:

```ts
import type {
  NpcInteractionOptionViewModel,
} from "./npc-interaction";
```

Add to `HouseStandbyActorViewModel`:

```ts
  interactionActions?: NpcInteractionOptionViewModel[];
```

- [x] **Step 4: Render house roster as global NPC targets**

Modify `src/ui/views/house/house-shared-view.ts` inside `renderHouseStandbyRoster()`:

```ts
              data-npc-target="${actor.characterId}"
              data-npc-context-type="house"
              ${actor.actionId == null ? "" : `data-house-action="${actor.actionId}"`}
```

Keep `data-house-action` for compatibility during this phase. If a blocking state disables the actor, add `disabled` from the adapted NPC pool in `app-render.ts` rather than making the house renderer infer state.

- [x] **Step 5: Select special actions from the active actor**

Add to `src/application/npc-interaction/npc-interaction.ts`:

```ts
export function selectHouseNpcSpecialActions(input: {
  actors: HouseStandbyActorViewModel[];
  targetCharacterId: string | null;
}): NpcInteractionOptionViewModel[] {
  if (input.targetCharacterId == null) {
    return [];
  }

  return (
    input.actors.find((actor) => actor.characterId === input.targetCharacterId)
      ?.interactionActions ?? []
  );
}
```

Use this in `src/ui/app-render.ts` when `stage.type === "house"` and `stage.moduleViewModel != null` to pass `specialActions` into `selectNpcInteractionMenu()`.

- [x] **Step 6: Migrate visible basic labels**

Modify these action labels:

```ts
// src/application/house-modules/tea-house/tea-house-house-module.ts
{ id: "talk", label: "谈话" }

// src/application/house-modules/medicine-house/medicine-house-house-module.ts
{ id: "talk", label: "谈话" }
```

For `market-house`, keep the reducer case for `"small-talk"` if needed for compatibility, but do not expose a visible `闲谈` or `small-talk` special label. If market talk remains visible in the menu, expose it through the global default `谈话`.

- [x] **Step 7: Add context special actions to module actors**

For tea house actor view models, add:

```ts
interactionActions: [
  { id: "order-tea", label: "请茶", kind: "special" },
  { id: "ask-intel", label: "打听", kind: "special" },
  { id: "start-debate", label: "舌战", kind: "special", tone: "accent" },
],
```

For medicine house doctor:

```ts
interactionActions: [
  { id: "heal", label: "疗伤", kind: "special" },
  { id: "buy-medicine", label: "买药", kind: "special" },
  { id: "start-compounding", label: "配药", kind: "special", tone: "accent" },
],
```

For market actors:

```ts
interactionActions: [
  { id: "investigate-market", label: "调查", kind: "special" },
  { id: "buy-goods", label: "买入", kind: "special" },
  { id: "sell-goods", label: "卖出", kind: "special" },
],
```

For leader residence:

```ts
interactionActions: [
  { id: ACTION_LEARN, label: "学习", kind: "special", disabled: teachableSkillKeys.length === 0, tone: "accent" },
],
```

Do not expose leader residence direct `ACTION_GIFT` in `interactionActions`.

- [x] **Step 8: Clear NPC session on house transitions**

Modify `src/application/house/house-runtime.ts` in `enterHouseById()`, `leaveCurrentHouse()`, and `applyMapAutoAdvanceCompletion()` UI patches:

```ts
          npcInteractionSession: null,
```

- [x] **Step 9: Run focused house integration tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC interaction"
```

Expected:

- Roster markup test passes.
- Visible label test passes.
- Selector tests from Task 1 and renderer tests from Task 3 still pass.

- [x] **Step 10: Commit Task 4**

Run:

```bash
git add src/domain/house-module.ts src/ui/app-render.ts src/ui/views/house/house-shared-view.ts src/application/house/house-runtime.ts src/application/house-modules/tea-house/tea-house-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/market-house/market-house-house-module.ts src/application/house-modules/leader-residence/leader-residence-house-module.ts tests/robustness.test.cjs
git commit -m "feat: route house rosters through npc interaction"
```

## Task 5: Gift Empty State And Documentation

**Files:**
- Modify: `src/application/npc-interaction/npc-interaction.ts`
- Modify: `src/ui/components/npc-interaction/npc-interaction-menu.ts`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `NPC_INTERACTION_DEFAULT_OPTION_IDS.gift`.
- Produces: disabled or empty-state gift menu behavior with no persistent mutation.

- [x] **Step 1: Write failing gift safety test**

Append:

```js
test("global NPC gift default is safe when no giftable items exist", () => {
  const session = createNpcInteractionSession(
    { type: "house", houseId: "house.test", moduleId: "leader-residence" },
    "char.leader"
  );
  const menu = selectNpcInteractionMenu({
    session,
    targetName: "将领",
    specialActions: [],
    giftDisabled: true,
  });
  const gift = menu.options.find((option) => option.id === NPC_INTERACTION_DEFAULT_OPTION_IDS.gift);

  assert.equal(gift.label, "送礼");
  assert.equal(gift.disabled, true);
});
```

- [x] **Step 2: Run test and verify it fails if gift disabled state is missing**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "gift default"
```

Expected:

- The test fails if the gift option is enabled without a giftable inventory path.

- [x] **Step 3: Keep Phase 1 gift disabled by selector input**

Ensure all Phase 1 calls to `selectNpcInteractionMenu()` pass:

```ts
giftDisabled: true,
```

Do not mutate inventory or favorability from the gift option in Phase 1.

- [x] **Step 4: Update house contract docs**

Add this section to `docs/special-house-interface.md` under `View Model Contract`:

```md
### Shared NPC Interaction Rule

Any actor exposed in a normal house NPC pool should be eligible for the shared NPC interaction menu when no blocking dialogue, modal, overlay, minigame, or message window is active.

The shared menu owns default actions:

- `角色情报`
- `谈话`
- `送礼`

House modules may contribute special actions for the selected actor, but the generic NPC shell must not understand house-specific business rules. Special actions dispatch back through the owning house module lifecycle. Default `谈话` replaces visible `闲谈` labels as the baseline conversation behavior. Default `送礼` must use shared inventory and must not mutate relationship or inventory until an item is selected and confirmed.
```

- [x] **Step 5: Update change log**

Add near the top of `docs/change-log.md`:

```md
## 2026-07-16 Global NPC Interaction Contract

- Added the Phase 1 global NPC interaction contract for house roster actors: NPC clicks open a structured menu with context special actions above the default `角色情报 / 谈话 / 送礼` actions.
- Character detail can now target an arbitrary NPC through global UI state instead of always rendering the player.
- Existing visible `闲谈` entry points are normalized toward the default `谈话` action; Phase 1 keeps `送礼` safe until shared gift inventory settlement is implemented.
```

- [x] **Step 6: Run focused tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "global NPC|gift default|character detail"
```

Expected:

- Focused tests pass.

- [x] **Step 7: Commit Task 5**

Run:

```bash
git add src/application/npc-interaction/npc-interaction.ts src/ui/components/npc-interaction/npc-interaction-menu.ts docs/special-house-interface.md docs/change-log.md tests/robustness.test.cjs
git commit -m "docs: document npc interaction contract"
```

## Task 6: Final Verification And Main Boundary Guard

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-16-global-npc-interaction-plan.md`
- Read: `src/main.ts`

**Interfaces:**
- Produces: final evidence that generic handlers do not introduce concrete house/NPC branches.

- [ ] **Step 1: Add boundary regression test**

Append to `tests/robustness.test.cjs`:

```js
test("global NPC interaction does not add concrete house business branches to main", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );

  assert.doesNotMatch(mainSource, /isTeaHouse|isMarketHouse|isMedicineHouse|isTavern|isLeaderResidence/);
  assert.doesNotMatch(mainSource, /moduleId\s*===\s*["']tea-house["']/);
  assert.doesNotMatch(mainSource, /moduleId\s*===\s*["']market-house["']/);
  assert.doesNotMatch(mainSource, /moduleId\s*===\s*["']medicine-house["']/);
  assert.doesNotMatch(mainSource, /moduleId\s*===\s*["']tavern["']/);
  assert.match(mainSource, /data-npc-action/);
});
```

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
npm run lint:plans
```

Expected:

- `npm run typecheck` exits `0`.
- `npm test` exits `0`.
- `npm run build` exits `0`.
- `npm run lint:plans` exits `0`.

- [ ] **Step 3: Update plan execution state**

Update this plan:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-16`
- Current Focus: `Implementation complete; closeout, project-progress sync, and push remain.`
- Next Step: `Prepare structured child closeout after remote push succeeds.`
- Verification: `npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `Do not mark closed until project-progress sync and push success are recorded.`
```

Append progress log:

```md
- 2026-07-16
  - Summary: `Completed Phase 1 global NPC interaction implementation.`
  - Verification: `npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Sync project-progress, push, and add structured closeout.`
```

- [ ] **Step 4: Commit Task 6**

Run:

```bash
git add tests/robustness.test.cjs docs/superpowers/plans/2026-07-16-global-npc-interaction-plan.md
git commit -m "test: guard npc interaction boundaries"
```

## Exit Check

- [ ] Global `NpcInteractionSession` is stored in unified `GameState.ui`.
- [ ] House roster actors can open a shared NPC menu when no blocking UI owns input.
- [ ] Menu ordering is special actions first, then `角色情报`, `谈话`, `送礼`.
- [ ] `角色情报` can render a selected NPC, not only the player.
- [ ] Visible `闲谈` labels are removed from Phase 1 house menus and replaced by `谈话`.
- [ ] Phase 1 `谈话` does not mutate persistent player or NPC state.
- [ ] Phase 1 `送礼` is disabled or empty-state safe and does not mutate inventory or relationship.
- [ ] Context special actions still dispatch through existing house module lifecycle.
- [ ] `src/main.ts` contains no concrete house/NPC business branch.
- [ ] `docs/special-house-interface.md` is updated.
- [ ] `docs/change-log.md` is updated.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run lint:plans` passes.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Global NPC Interaction Phase 1`
- Parent Task: `Global NPC Interaction`
- Parent Stage: `NPC Interaction Standardization`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `choose-execution-mode`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-16-global-npc-interaction-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then this plan; choose execution mode before starting Task 1.`
