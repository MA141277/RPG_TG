# Temple AI Mainline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make monk-period `temple-house` mainline progression dialogue-gated so the abbot must ask, explain, or confirm before any mainline handoff executes, while all legality, review outcomes, work settlement, food submission, flags, and time mutation remain owned by the existing temple house module.

**Architecture:** Reuse the existing hidden indoor AI dialogue loop, per-turn intent gate, and `HouseConversationRoute` dispatch path instead of adding a second executor. Add a shared `dialogueGatedProgressions` capability contract to the existing house conversation snapshot, store a lightweight progression-gate state inside the current NPC AI dialogue session, block gated routes locally until confirmation is satisfied, and roll the first vertical slice out in `temple-house` by mapping current daily work, review opening, begging negotiation, and food-submission beats onto the new shared contract.

**Tech Stack:** TypeScript domain/application/runtime/house modules, CommonJS `.test-dist` suites, cached Node `tsc` / `node --test --test-isolation=none` commands, `tools/lint-superpowers-plans.mjs`, repository `tsc --noEmit`, and Vite build verification.

**Spec:** `docs/superpowers/specs/2026-08-28-dialogue-gated-mainline-progression-design.md` (primary), `docs/superpowers/specs/2026-08-28-temple-ai-mainline-design.md` (temple vertical behavior), `docs/superpowers/specs/2026-08-27-npc-ai-per-turn-intent-gate-design.md` (shared indoor intent-gate baseline)

## Global Constraints

- Follow the repository house interface contract in `docs/special-house-interface.md`.
- Follow the main-shell boundary in `docs/main-shell-contract.md`; do not add temple-specific business branches to `src/main.ts`.
- Keep `HouseConversationRoute` as the only execution handoff; `dialogueGatedProgressions` are metadata over legal routes, not a second action family.
- Keep the existing hidden indoor AI dialogue loop as the only visible surface; do not add a second visible AI console or a second mainline runtime.
- AI may not directly mutate grain, money, contribution, flags, missions, work-plan selection, review outcomes, or story success.
- Keep authored ordination, first-review, and unlock-begging scenes outside this child.
- Consume the active `Indoor House Action Memory` seam instead of redefining temple-local result memory in parallel.
- Preserve unrelated local working-tree changes.

## Execution State

- Status: `waiting`
- Last Updated: `2026-08-28`
- Current Focus: `This waiting child has been rewritten around the approved dialogue-gated progression design and still remains blocked behind the active Indoor House Action Memory child.`
- Next Step: `Keep this child waiting until docs/superpowers/project-progress.md promotes it or the user explicitly supersedes the active child, then start Task 1 from the shared progression-contract RED tests.`
- Verification: `2026-08-28: doc-only plan rewrite; cached-node tools/lint-superpowers-plans.mjs PASS.`
- Notes: `Do not start Temple AI Mainline execution while Indoor House Action Memory is still the active child or still owns prerequisite temple result-memory rollout. Recheck admission before Task 1.`

## Progress Log

- 2026-08-28
  - Summary: `Rewrote the waiting Temple AI Mainline child around the approved dialogue-gated progression design. The plan now targets a shared dialogue-first mainline contract plus the first temple vertical slice instead of the older temple-context/service-first draft.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS.`
  - Next: `Keep this child waiting until the canonical progress document admits it, then begin Task 1 from the shared progression-contract RED tests.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-28-dialogue-gated-mainline-progression-design.md`
- Supporting spec:
  - `docs/superpowers/specs/2026-08-28-temple-ai-mainline-design.md`
- Supporting spec:
  - `docs/superpowers/specs/2026-08-27-npc-ai-per-turn-intent-gate-design.md`
- Blocking active child:
  - `docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The hidden indoor AI pilot, the shared per-turn intent gate, and same-house result-memory consumption already exist, so this child must extend those seams rather than create a temple-only AI runtime.`
  - `The shared request builder already includes current house-state summary lines, so this child should build on that behavior instead of reopening the old “NPC still says 施主” problem.`
  - `Indoor House Action Memory is still the active completed-but-open child and currently owns the prerequisite temple result-memory rollout; Temple AI Mainline must stay waiting until admission is legal.`
  - `The previous waiting plan over-emphasized temple-only context/service work. The approved scope is now narrower and sharper: shared dialogue-gated progression contract first, then temple mapping onto current legal routes.`
  - `Temple already owns legal action ids, legal negotiation nodes, and local review/work/session state. This child must consume those owners rather than replace them.`

## Implementation Scope

### In Scope

- Add a shared `dialogueGatedProgressions` capability contract to the house conversation snapshot.
- Add a shared optional house-module hook that exposes current dialogue-gated progression opportunities.
- Add a session-local NPC AI dialogue progression-gate state.
- Add request-builder prompt summary for the current progression gate and the hard “no direct mainline execution before confirmation” instruction.
- Add local runtime validation that blocks gated routes until confirmation is satisfied and only then lets the existing pending-route path execute.
- Map the first temple vertical slice onto the shared contract:
  - `temple.assign-daily-work`
  - `temple.review-opening`
  - `temple.request-early-begging`
  - `temple.review-reassign-to-begging`
  - `temple.submit-begging-food`
- Update shared docs and governance records if the shared contract changes land.

### Still Out Of Scope

- Replacing authored one-shot scenes with generative scenes.
- Making every house route dialogue-gated.
- Cross-building rumor or action-memory propagation.
- Adding a second visible dialogue UI.
- Letting AI directly decide legality, persuasion success, review outcomes, or persistent mutation.
- Starting Temple AI Mainline execution before the blocking active child is legally admitted or closed.

## File Map

### Existing files to modify

- `src/domain/house-conversation.ts`
  - Add the shared dialogue-gated progression capability type to the existing house conversation contract.
- `src/domain/house-module.ts`
  - Add the optional house-module hook that exposes currently legal dialogue-gated progressions.
- `src/application/house-conversation/select-house-conversation-capability-snapshot.ts`
  - Thread `dialogueGatedProgressions` into the snapshot and filter unavailable entries fail-closed.
- `src/domain/npc-ai-dialogue.ts`
  - Add the session-local progression-gate state carried by the existing NPC AI dialogue session.
- `src/application/npc-interaction/npc-interaction.ts`
  - Seed the new progression-gate state in `createInitialNpcAiDialogueSessionState()`.
- `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
  - Print the active progression-gate summary and the confirmation guard into the prompt body/system message.
- `src/core/runtime/npc-interaction-runtime.ts`
  - Seed the gate on `start-talk`, update it after each player turn, and block gated routes until they are confirmable.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Expose the temple-owned dialogue-gated progression opportunities through the new shared hook.
- `tests/house-conversation-route-contract.test.cjs`
  - Preserve current route validation coverage while adding app-snapshot coverage for the new progression selector callback.
- `tests/npc-ai-dialogue-request-builder.test.cjs`
  - Prove prompt construction includes the progression-gate summary and hard confirmation instruction.
- `tests/npc-ai-dialogue-runtime.test.cjs`
  - Prove the runtime seeds, advances, blocks, and eventually executes dialogue-gated routes through the existing pending-route path.
- `tests/npc-ai-house-intent-gate.test.cjs`
  - Preserve the current `chat / clarify / route` behavior while verifying that gated progression routes still use the shared intent gate and remain locally blocked until confirmation.
- `docs/special-house-interface.md`
  - Document the new shared `selectDialogueGatedProgressions` hook and reaffirm that local houses still own legality and settlement.
- `docs/change-log.md`
  - Record the shared dialogue-gated mainline contract and the first temple vertical rollout.
- `docs/superpowers/project-progress.md`
  - Sync canonical status when this child is eventually promoted and when it later moves to `completed-but-open`.
- `docs/superpowers/plans/2026-08-28-temple-ai-mainline-plan.md`
  - Keep execution state, progress log, verification, and checkboxes current during implementation.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts`
  - Shared helper for selecting the initial progression gate, summarizing it for prompts, matching routes back to progressions, and applying confirmation-stage transitions.
- `src/application/house-modules/temple-house/temple-house-dialogue-gated-progressions.ts`
  - Temple-owned mapping from current monk-period state to current legal dialogue-gated progression capabilities.
- `tests/house-dialogue-gated-progression-contract.test.cjs`
  - Focused shared contract coverage for progression capability filtering and app-level snapshot wiring.
- `tests/temple-house-ai-mainline.test.cjs`
  - Focused temple coverage for progression exposure, priority order, route mapping, and first-batch rollout behavior.

## Verification Plan

- Targeted verification:
  - shared house conversation snapshots carry only currently legal dialogue-gated progressions,
  - NPC AI dialogue sessions seed the highest-priority owned progression on `start-talk`,
  - request prompts include the active progression summary and explicit confirmation guard,
  - gated routes stay in dialogue until confirmation and only then execute through the existing pending-route path,
  - temple exposes the approved first-batch progression ids and maps them to current legal actions or current legal negotiation nodes without adding temple business to `src/main.ts`.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-dialogue-gated-progression-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-house-intent-gate.test.cjs tests/temple-house-ai-mainline.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build`

### Task 1: Shared Dialogue-Gated Progression Contract

**Files:**
- Modify: `src/domain/house-conversation.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/application/house-conversation/select-house-conversation-capability-snapshot.ts`
- Create: `tests/house-dialogue-gated-progression-contract.test.cjs`
- Modify: `tests/house-conversation-route-contract.test.cjs`

**Interfaces:**
- Produces:

```ts
export type HouseConversationDialogueGatedProgressionCapability = {
  progressionId: string;
  label: string;
  ownerCharacterId?: CharacterId | string | null;
  promptHint: string;
  priority: number;
  confirmationPolicy:
    | "explicit-choice"
    | "explicit-consent"
    | "explicit-request"
    | "explicit-submit";
  handoffRoute: HouseConversationRoute;
};
```

- Produces:

```ts
export type HouseConversationCapabilitySnapshot = {
  cityId: string;
  houseId: string;
  moduleId?: string | null;
  targetCharacterId: CharacterId | string | null;
  targetCharacterName: string | null;
  switchableNpcTargets: HouseConversationNpcTargetCapability[];
  houseActions: HouseConversationActionCapability[];
  houseServices: HouseConversationServiceCapability[];
  reachableHouses: HouseConversationReachableHouseCapability[];
  leaveAction: HouseConversationLeaveCapability | null;
  negotiableStoryNodes: HouseConversationNegotiableStoryNodeCapability[];
  dialogueGatedProgressions: HouseConversationDialogueGatedProgressionCapability[];
};
```

- Produces:

```ts
selectDialogueGatedProgressions?(
  input: HouseModuleViewModelInput<ModuleId>
): HouseConversationDialogueGatedProgressionCapability[];
```

- [ ] **Step 1: Write the failing shared progression-contract tests**

Add `tests/house-dialogue-gated-progression-contract.test.cjs` with cases like:

```js
test("house conversation snapshot keeps only legal dialogue-gated progressions", () => {
  const {
    selectHouseConversationCapabilitySnapshot,
  } = require("../.test-dist/application/house-conversation/select-house-conversation-capability-snapshot.js");

  const snapshot = selectHouseConversationCapabilitySnapshot({
    cityId: "city.kulan",
    houseId: "house.kulan.temple",
    moduleId: "temple-house",
    targetCharacterId: "char.abbot",
    targetCharacterName: "住持",
    switchableNpcTargets: [],
    houseActions: [],
    houseServices: [],
    reachableHouses: [],
    leaveAction: null,
    negotiableStoryNodes: [],
    dialogueGatedProgressions: [
      {
        progressionId: "temple.assign-daily-work",
        label: "安排今日寺务",
        ownerCharacterId: "char.abbot",
        promptHint: "先问今天领什么差事。",
        priority: 20,
        confirmationPolicy: "explicit-choice",
        handoffRoute: {
          kind: "open-house-action",
          actionId: "open-temple-work-menu",
        },
        available: true,
      },
      {
        progressionId: "temple.debug-hidden",
        label: "调试节点",
        ownerCharacterId: "char.abbot",
        promptHint: "不该暴露。",
        priority: 99,
        confirmationPolicy: "explicit-choice",
        handoffRoute: {
          kind: "open-house-action",
          actionId: "debug-action",
        },
        available: false,
      },
    ],
  });

  assert.deepEqual(
    snapshot.dialogueGatedProgressions.map((entry) => entry.progressionId),
    ["temple.assign-daily-work"]
  );
  assert.equal(
    snapshot.dialogueGatedProgressions[0]?.handoffRoute.kind,
    "open-house-action"
  );
});
```

Extend `tests/house-conversation-route-contract.test.cjs` with an app-level selector case that proves `selectHouseConversationCapabilitySnapshotForApp(...)` consumes a `selectDialogueGatedProgressions` callback and threads the result into `snapshot.dialogueGatedProgressions`.

- [ ] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-dialogue-gated-progression-contract.test.cjs tests/house-conversation-route-contract.test.cjs
```

Expected:

- `FAIL` because the snapshot and house-module contracts do not yet expose dialogue-gated progression data.

- [ ] **Step 3: Implement the shared progression contract**

Add the new capability type to `src/domain/house-conversation.ts`, extend `HouseConversationCapabilitySnapshot` with `dialogueGatedProgressions`, add the optional `selectDialogueGatedProgressions` hook to `src/domain/house-module.ts`, and update `select-house-conversation-capability-snapshot.ts` so:

```ts
dialogueGatedProgressions: input.dialogueGatedProgressions
  .filter(isAvailable)
  .map((progression) => {
    const { available: _available, ...rest } = progression;
    return rest;
  }),
```

Also add the corresponding app-level callback to `SelectHouseConversationCapabilitySnapshotForAppInput` and thread it through the existing selector path so runtime callers can ask active house modules for current progression opportunities.

- [ ] **Step 4: Run the focused GREEN verification**

Run the same compile/test commands again and confirm:

- `tests/house-dialogue-gated-progression-contract.test.cjs` passes
- `tests/house-conversation-route-contract.test.cjs` passes

- [ ] **Step 5: Commit**

```bash
git add src/domain/house-conversation.ts src/domain/house-module.ts src/application/house-conversation/select-house-conversation-capability-snapshot.ts tests/house-dialogue-gated-progression-contract.test.cjs tests/house-conversation-route-contract.test.cjs
git commit -m "feat: add dialogue-gated house progression contract"
```

### Task 2: Session-Local Progression Gate And Prompt Summary

**Files:**
- Create: `src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts`
- Modify: `src/domain/npc-ai-dialogue.ts`
- Modify: `src/application/npc-interaction/npc-interaction.ts`
- Modify: `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
- Modify: `src/core/runtime/npc-interaction-runtime.ts`
- Modify: `tests/npc-ai-dialogue-request-builder.test.cjs`
- Modify: `tests/npc-ai-dialogue-runtime.test.cjs`

**Interfaces:**
- Produces:

```ts
export type NpcAiDialogueProgressionGateStage =
  | "idle"
  | "opening"
  | "awaiting-player-answer"
  | "clarifying"
  | "awaiting-confirmation"
  | "ready-to-handoff";
```

- Produces:

```ts
export type NpcAiDialogueProgressionGateState = {
  activeProgressionId: string | null;
  stage: NpcAiDialogueProgressionGateStage;
  awaitingRoute: HouseConversationRoute | null;
  askedCount: number;
  lastPlayerAnswer: string | null;
  lastResolvedProgressionId: string | null;
};
```

- Produces:

```ts
export function createInitialNpcAiDialogueProgressionGateState(): NpcAiDialogueProgressionGateState;
export function selectInitialNpcAiDialogueProgressionGate(input: {
  snapshot: HouseConversationCapabilitySnapshot | null;
  targetCharacterId: string | null;
}): NpcAiDialogueProgressionGateState;
export function summarizeNpcAiDialogueProgressionGate(input: {
  snapshot: HouseConversationCapabilitySnapshot | null;
  gateState: NpcAiDialogueProgressionGateState;
}): string[];
```

- [ ] **Step 1: Write the failing gate-state and prompt-summary tests**

Extend `tests/npc-ai-dialogue-request-builder.test.cjs` with:

```js
test("NPC AI dialogue request builder prints the active dialogue-gated progression and confirmation guard", () => {
  const { buildNpcAiDialogueProviderRequest } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-request-builder.js");

  const request = buildNpcAiDialogueProviderRequest({
    requestId: "npc-ai-dialogue-request-1",
    contextType: "house",
    npcId: "char.abbot",
    npcName: "住持",
    playerName: "朱重八",
    inputType: "start_talk",
    placeName: "皇觉寺",
    houseId: "house.kulan.temple",
    houseConversationCapabilitySnapshot: {
      cityId: "city.kulan",
      houseId: "house.kulan.temple",
      moduleId: "temple-house",
      targetCharacterId: "char.abbot",
      targetCharacterName: "住持",
      switchableNpcTargets: [],
      houseActions: [],
      houseServices: [],
      reachableHouses: [],
      leaveAction: null,
      negotiableStoryNodes: [],
      dialogueGatedProgressions: [
        {
          progressionId: "temple.assign-daily-work",
          label: "安排今日寺务",
          ownerCharacterId: "char.abbot",
          promptHint: "先问今天领什么差事。",
          priority: 20,
          confirmationPolicy: "explicit-choice",
          handoffRoute: {
            kind: "open-house-action",
            actionId: "open-temple-work-menu",
          },
        },
      ],
    },
    progressionGateState: {
      activeProgressionId: "temple.assign-daily-work",
      stage: "opening",
      awaitingRoute: null,
      askedCount: 1,
      lastPlayerAnswer: null,
      lastResolvedProgressionId: null,
    },
  });

  assert.match(request.system, /未确认前禁止直接执行主线 route/u);
  assert.match(request.messages[0].content, /当前主线对话门：安排今日寺务/u);
  assert.match(request.messages[0].content, /当前主线门阶段：opening/u);
});
```

Extend `tests/npc-ai-dialogue-runtime.test.cjs` with a `start-talk` case proving the runtime seeds the highest-priority owned progression into `dialogue.progressionGate`.

- [ ] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
```

Expected:

- `FAIL` because NPC AI dialogue sessions do not yet have progression-gate state and the request builder does not yet print the summary.

- [ ] **Step 3: Implement the gate state and prompt summary**

Create `src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts` with:

```ts
export function selectInitialNpcAiDialogueProgressionGate(input: {
  snapshot: HouseConversationCapabilitySnapshot | null;
  targetCharacterId: string | null;
}): NpcAiDialogueProgressionGateState {
  const ownedProgressions =
    input.snapshot?.dialogueGatedProgressions
      .filter((entry) => entry.ownerCharacterId == null || entry.ownerCharacterId === input.targetCharacterId)
      .sort((left, right) => left.priority - right.priority) ?? [];

  const activeProgression = ownedProgressions[0] ?? null;
  return activeProgression == null
    ? createInitialNpcAiDialogueProgressionGateState()
    : {
        activeProgressionId: activeProgression.progressionId,
        stage: "opening",
        awaitingRoute: null,
        askedCount: 0,
        lastPlayerAnswer: null,
        lastResolvedProgressionId: null,
      };
}
```

Then:

- add `progressionGate: NpcAiDialogueProgressionGateState` to `NpcAiDialogueSessionState`,
- seed it from `createInitialNpcAiDialogueSessionState()`,
- have `createNpcInteractionRuntimeBridge` select the initial progression gate on `start-talk`,
- print the gate summary and confirmation guard in `buildNpcAiDialogueProviderRequest(...)`.

- [ ] **Step 4: Run the focused GREEN verification**

Run the same compile/test commands again and confirm:

- `tests/npc-ai-dialogue-request-builder.test.cjs` passes
- `tests/npc-ai-dialogue-runtime.test.cjs` passes the gate-seeding slice

- [ ] **Step 5: Commit**

```bash
git add src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts src/domain/npc-ai-dialogue.ts src/application/npc-interaction/npc-interaction.ts src/application/npc-interaction/npc-ai-dialogue-request-builder.ts src/core/runtime/npc-interaction-runtime.ts tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
git commit -m "feat: seed NPC dialogue progression gate state"
```

### Task 3: Block Gated Routes Until Confirmation

**Files:**
- Modify: `src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts`
- Modify: `src/core/runtime/npc-interaction-runtime.ts`
- Modify: `tests/npc-ai-dialogue-runtime.test.cjs`
- Modify: `tests/npc-ai-house-intent-gate.test.cjs`

**Interfaces:**
- Produces:

```ts
export function findDialogueGatedProgressionByRoute(input: {
  snapshot: HouseConversationCapabilitySnapshot | null;
  route: HouseConversationRoute | null;
}): HouseConversationDialogueGatedProgressionCapability | null;
```

- Produces:

```ts
export function isDialogueGatedProgressionConfirmationSatisfied(input: {
  confirmationPolicy: HouseConversationDialogueGatedProgressionCapability["confirmationPolicy"];
  playerTurnText: string | null;
}): boolean;
```

- Produces:

```ts
export function reduceNpcAiDialogueProgressionGateAfterPlayerTurn(input: {
  gateState: NpcAiDialogueProgressionGateState;
  matchedProgression: HouseConversationDialogueGatedProgressionCapability | null;
  matchedRoute: HouseConversationRoute | null;
  playerTurnText: string | null;
}): NpcAiDialogueProgressionGateState;
```

- [ ] **Step 1: Write the failing confirmation-gate tests**

Add runtime cases like:

```js
test("shared NPC AI dialogue runtime blocks a dialogue-gated route before confirmation", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  const dispatchedRoutes = [];
  const routeSnapshot = {
    cityId: "city.kulan",
    houseId: "house.kulan.temple",
    moduleId: "temple-house",
    targetCharacterId: "char.abbot",
    targetCharacterName: "住持",
    switchableNpcTargets: [],
    houseActions: [],
    houseServices: [],
    reachableHouses: [],
    leaveAction: null,
    negotiableStoryNodes: [
      {
        nodeId: "temple.request-early-begging",
        label: "请求提前化缘",
        allowedApproaches: ["plea"],
        targetCharacterId: "char.abbot",
      },
    ],
    dialogueGatedProgressions: [
      {
        progressionId: "temple.request-early-begging",
        label: "请求提前化缘",
        ownerCharacterId: "char.abbot",
        promptHint: "先问是否当真要请命。",
        priority: 10,
        confirmationPolicy: "explicit-request",
        handoffRoute: {
          kind: "negotiate-story-node",
          nodeId: "temple.request-early-begging",
          approach: "plea",
          targetCharacterId: "char.abbot",
        },
      },
    ],
  };

  // First player turn is concrete intent but not yet confirmed.
  // Runtime should keep pendingRoute null and stage awaiting-confirmation.

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.pendingRoute,
    null
  );
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.progressionGate.stage,
    "awaiting-confirmation"
  );
  assert.deepEqual(dispatchedRoutes, []);
});
```

Add a second case proving a later explicit request such as `住持，我当真想请你准我出去化缘。` moves the gate to `ready-to-handoff`, leaves the matched route in `pendingRoute`, and only dispatches after the transition line finishes.

- [ ] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-house-intent-gate.test.cjs
```

Expected:

- `FAIL` because gated routes still flow straight into the existing pending-route path without confirmation-stage blocking.

- [ ] **Step 3: Implement local route blocking and gate-stage advancement**

Extend `src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts` so:

```ts
export function findDialogueGatedProgressionByRoute(input: {
  snapshot: HouseConversationCapabilitySnapshot | null;
  route: HouseConversationRoute | null;
}): HouseConversationDialogueGatedProgressionCapability | null {
  if (input.snapshot == null || input.route == null) {
    return null;
  }

  return (
    input.snapshot.dialogueGatedProgressions.find((progression) => {
      const handoffRoute = progression.handoffRoute;
      if (handoffRoute.kind !== input.route.kind) {
        return false;
      }

      if (handoffRoute.kind === "open-house-action" && input.route.kind === "open-house-action") {
        return handoffRoute.actionId === input.route.actionId;
      }
      if (handoffRoute.kind === "negotiate-story-node" && input.route.kind === "negotiate-story-node") {
        return handoffRoute.nodeId === input.route.nodeId;
      }
      if (handoffRoute.kind === "leave-house" && input.route.kind === "leave-house") {
        return true;
      }
      return JSON.stringify(handoffRoute) === JSON.stringify(input.route);
    }) ?? null
  );
}
```

Use a simple local confirmation helper:

```ts
export function isDialogueGatedProgressionConfirmationSatisfied(input: {
  confirmationPolicy: HouseConversationDialogueGatedProgressionCapability["confirmationPolicy"];
  playerTurnText: string | null;
}): boolean {
  const text = (input.playerTurnText ?? "").trim();
  if (text.length === 0) {
    return false;
  }
  if (input.confirmationPolicy === "explicit-submit") {
    return /交|提交|交上|奉上/u.test(text);
  }
  if (input.confirmationPolicy === "explicit-consent") {
    return /好|可以|照办|就这么办|同意/u.test(text);
  }
  if (input.confirmationPolicy === "explicit-request") {
    return /请|求|准我|容我|我要|我想/u.test(text);
  }
  return true;
}
```

Then update the runtime so matched gated routes:

- clear `pendingRoute` and stay in dialogue when confirmation is not yet satisfied,
- move `progressionGate.stage` to `awaiting-confirmation`,
- only store `pendingRoute` when confirmation is satisfied,
- set `lastResolvedProgressionId` after execution so the same progression does not auto-open again in the same conversation.

- [ ] **Step 4: Run the focused GREEN verification**

Run the same compile/test commands again and confirm:

- `tests/npc-ai-dialogue-runtime.test.cjs` passes the blocking/confirming slice
- `tests/npc-ai-house-intent-gate.test.cjs` still passes the shared `chat / clarify / route` behavior

- [ ] **Step 5: Commit**

```bash
git add src/application/npc-interaction/npc-ai-dialogue-progression-gate.ts src/core/runtime/npc-interaction-runtime.ts tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-house-intent-gate.test.cjs
git commit -m "feat: gate mainline routes behind confirmation"
```

### Task 4: Temple Dialogue-Gated Progression Mapping

**Files:**
- Create: `src/application/house-modules/temple-house/temple-house-dialogue-gated-progressions.ts`
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Create: `tests/temple-house-ai-mainline.test.cjs`

**Interfaces:**
- Produces:

```ts
export const TEMPLE_DIALOGUE_GATED_PROGRESSION_IDS = {
  assignDailyWork: "temple.assign-daily-work",
  reviewOpening: "temple.review-opening",
  requestEarlyBegging: "temple.request-early-begging",
  reviewReassignToBegging: "temple.review-reassign-to-begging",
  submitBeggingFood: "temple.submit-begging-food",
} as const;
```

- Produces:

```ts
export function selectTempleDialogueGatedProgressions(input: {
  gameState: GameState;
  houseDefinition: HouseDefinition;
  playerCharacterId: string;
  sessionState: TempleHouseSessionState | null;
  textEntriesById?: Record<string, string>;
}): HouseConversationDialogueGatedProgressionCapability[];
```

- [ ] **Step 1: Write the failing temple progression tests**

Create `tests/temple-house-ai-mainline.test.cjs` with cases like:

```js
test("temple daily state exposes submit-food before assign-daily-work when grain is ready", () => {
  const { selectTempleDialogueGatedProgressions } = require("../.test-dist/application/house-modules/temple-house/temple-house-dialogue-gated-progressions.js");

  const progressions = selectTempleDialogueGatedProgressions({
    gameState: createTempleGameState({
      currentHouseId: "house.kulan.temple",
      beggingFood: 6,
      beggingUnlocked: false,
    }),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: createTempleDailySessionState(),
    textEntriesById: {},
  });

  assert.deepEqual(
    progressions.map((entry) => entry.progressionId),
    [
      "temple.submit-begging-food",
      "temple.assign-daily-work",
      "temple.request-early-begging",
    ]
  );
  assert.deepEqual(progressions[0]?.handoffRoute, {
    kind: "open-house-action",
    actionId: "submit-temple-begging-food",
  });
});
```

Add a second case proving meeting-time reassignment maps to the current legal negotiation node:

```js
assert.deepEqual(
  progressions.find((entry) => entry.progressionId === "temple.review-reassign-to-begging")?.handoffRoute,
  {
    kind: "negotiate-story-node",
    nodeId: "temple.review-work-plan-negotiation",
    approach: "plea",
    targetCharacterId: "char.abbot",
  }
);
```

- [ ] **Step 2: Run the focused RED verification**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/temple-house-ai-mainline.test.cjs
```

Expected:

- `FAIL` because temple does not yet expose dialogue-gated progression capabilities.

- [ ] **Step 3: Implement the temple progression selector**

Create `src/application/house-modules/temple-house/temple-house-dialogue-gated-progressions.ts` and map current temple state to the approved first-batch progression ids:

```ts
[
  {
    progressionId: TEMPLE_DIALOGUE_GATED_PROGRESSION_IDS.reviewOpening,
    label: "评定开场",
    ownerCharacterId: "char.abbot",
    promptHint: "先宣布评定已到，再问玩家如何应对。",
    priority: 10,
    confirmationPolicy: "explicit-choice",
    handoffRoute: { kind: "continue-dialogue" },
  },
  {
    progressionId: TEMPLE_DIALOGUE_GATED_PROGRESSION_IDS.submitBeggingFood,
    label: "交回化缘粮食",
    ownerCharacterId: "char.abbot",
    promptHint: "先问这趟化缘收成如何，再确认是否交粮。",
    priority: 20,
    confirmationPolicy: "explicit-submit",
    handoffRoute: {
      kind: "open-house-action",
      actionId: "submit-temple-begging-food",
    },
  },
  {
    progressionId: TEMPLE_DIALOGUE_GATED_PROGRESSION_IDS.assignDailyWork,
    label: "安排今日寺务",
    ownerCharacterId: "char.abbot",
    promptHint: "先问今天领什么差事或直接交代寺务。",
    priority: 30,
    confirmationPolicy: "explicit-choice",
    handoffRoute: {
      kind: "open-house-action",
      actionId: "open-temple-work-menu",
    },
  },
]
```

Also expose:

- `temple.request-early-begging` -> `negotiate-story-node` `temple.request-early-begging`
- `temple.review-reassign-to-begging` -> `negotiate-story-node` `temple.review-work-plan-negotiation`

Wire `temple-house-house-module.ts` to return this data from `selectDialogueGatedProgressions(input)` without changing current review/work/negotiation settlement owners.

- [ ] **Step 4: Run the focused GREEN verification**

Run the same compile/test commands again and confirm `tests/temple-house-ai-mainline.test.cjs` passes.

- [ ] **Step 5: Commit**

```bash
git add src/application/house-modules/temple-house/temple-house-dialogue-gated-progressions.ts src/application/house-modules/temple-house/temple-house-house-module.ts tests/temple-house-ai-mainline.test.cjs
git commit -m "feat: map temple mainline to dialogue-gated progressions"
```

### Task 5: Shared Docs Sync And Final Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-28-temple-ai-mainline-plan.md`

**Interfaces:**
- Consumes: `selectDialogueGatedProgressions?(...)`
- Consumes: `dialogueGatedProgressions: HouseConversationDialogueGatedProgressionCapability[]`
- Produces: canonical governance state showing whether this child is still `running`, `blocked`, or `completed-but-open`

- [ ] **Step 1: Update the shared docs and governance records**

Update:

- `docs/special-house-interface.md` with the new optional `selectDialogueGatedProgressions` hook and the rule that gated progressions are metadata over legal routes, not a second executor.
- `docs/change-log.md` with a concise entry for the shared dialogue-gated mainline contract and the first temple rollout.
- `docs/superpowers/project-progress.md` and this plan file so the active child/task/next step fields remain explicit when Temple AI Mainline is eventually promoted or completed.

- [ ] **Step 2: Run the structural plan lint**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
```

Expected:

- `PASS`

- [ ] **Step 3: Run the full final verification batch**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/house-dialogue-gated-progression-contract.test.cjs tests/house-conversation-route-contract.test.cjs tests/npc-ai-dialogue-request-builder.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-house-intent-gate.test.cjs tests/temple-house-ai-mainline.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build
```

Expected:

- `PASS`

- [ ] **Step 4: Record verification and leave the child `completed-but-open` until push gates pass**

Update this plan’s `Execution State`, `Progress Log`, `Exit Check`, and `Completion Checklist`, then sync `docs/superpowers/project-progress.md` so:

- `Current Child Status` becomes `completed-but-open`,
- `Next Required Action` names the push/closeout gate,
- `Resume From` points back to `docs/superpowers/project-progress.md`.

- [ ] **Step 5: Commit**

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-08-28-temple-ai-mainline-plan.md
git commit -m "docs: record dialogue-gated temple mainline rollout"
```

## Exit Check

- [ ] Shared house conversation snapshots expose only currently legal `dialogueGatedProgressions`.
- [ ] The NPC AI dialogue session carries a progression-gate state and seeds the highest-priority owned progression on `start-talk`.
- [ ] Request prompts include the active progression summary and the hard confirmation guard.
- [ ] Dialogue-gated routes stay in dialogue until confirmation and then execute through the existing pending-route path.
- [ ] Temple exposes the approved first-batch progression ids and route mappings without new temple business in `src/main.ts`.
- [ ] Shared docs and governance records are updated.
- [ ] Verification is recorded.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Temple AI Mainline`
- Parent Task: `House Local Gameplay`
- Parent Stage: `House Local Gameplay`
- Closeout Status: `waiting`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `promote-or-continue-this-child-only-after-the-active-indoor-house-action-memory-owner-clears-admission`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-28-indoor-house-action-memory-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm whether Indoor House Action Memory still blocks admission, and only then promote or continue this plan.`
