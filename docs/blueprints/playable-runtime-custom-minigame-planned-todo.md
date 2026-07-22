# Playable Runtime And Custom Minigame Planned Todo

## Document Control

- document_id: `playable-runtime-custom-minigame-planned-todo`
- scope_context: `side-review-note`
- document_role: `planned-todo-ledger`
- plan_status: `planned`
- created_at: `2026-07-15`
- scheduling_effect: `none`
- active_truth_owner: `none`
- related_context:
  - `playable runtime governance`
  - `custom minigame future support`
  - `script editor authoring/data structure discussions`

## Usage Rules

- This document records planned playable/minigame cleanup and extension work discussed during side review.
- This document is not queue admission, not execution authorization, and not a replacement for the version plan.
- Any item here must still pass Blueprint classification and admission before implementation.
- Existing active queue truth remains unchanged.

## Goal

Move all minigame-like mechanics behind one playable registry, runtime, settlement, and handoff mechanism while reserving a path for creator-defined custom minigames in exported scenario packs.

## Current Assessment

- The repository already has playable definitions, playable integrations, `playableId`, `integrationId`, and `runPlayableRuntime`.
- Core mechanics such as `city-begging`, `grain-accounting`, `medicine-compounding`, temple `activity-qte`, and `story-battle` are partially or mostly routed through shared playable runtime.
- Some paths remain transitional or local:
  - `activity-qte` scene default actions still use legacy `interactive.activity-qte.*` commands.
  - `story-battle` actions are routed through playable actions, but story callback launch still directly calls the story-battle playable helper.
  - `city-begging` launch and settlement are routed, but `main.ts` still owns animation-frame and overlay synchronization.
  - `activity-runner.ts` directly calls `startActivityQtePlayable`.
  - `tavern` work QTE is still a house-local `qte-bar` flow and does not use `runPlayableRuntime`.

## Planned Todo List

### Planned: Normalize Builtin Playable Directory Structure

- status: `planned`
- target:
  - Move builtin playable implementations under one clear directory structure.
  - Keep each playable split into definition, runtime, presenter, and settlement responsibilities.
- planned shape:

```text
src/application/playables/
  builtin/
    activity-qte/
    city-begging/
    grain-accounting/
    medicine-compounding/
    story-battle/
  runtime/
    playable-runtime.ts
    playable-registry.ts
    playable-loader.ts
    playable-settlement.ts
    playable-handoff.ts
  custom/
    custom-playable-adapter.ts
    custom-playable-validator.ts
```

### Planned: Remove Legacy Interactive Action Entry Points

- status: `planned`
- target:
  - Replace long-term `interactive.activity-qte.*` and other legacy interactive commands with canonical `playable.<playableId>.<action>` requests.
  - Keep compatibility only as an explicitly routed migration adapter if needed.
- acceptance notes:
  - `main.ts` should not grow concrete playable business branches.
  - UI events should dispatch stable playable actions rather than owning playable behavior.

### Planned: Route Activity QTE Launch Through Shared Launch Request

- status: `planned`
- target:
  - Stop direct `activity-runner.ts -> startActivityQtePlayable()` launch.
  - Route generic QTE activity launch through `createLaunchPlayableRequest("activity-qte", ...)`.
- acceptance notes:
  - Activity launch resolves through playable registry and integration ownership.
  - Activity result and closeout still use playable settlement and handoff.

### Planned: Route Story Battle Launch Through Shared Launch Request

- status: `planned`
- target:
  - Stop direct story callback launch through `launchStoryBattlePlayable()`.
  - Route story battle launch through shared playable launch request and integration resolution.
- acceptance notes:
  - Story battle keeps `family: "battle"`.
  - Battle actions continue through playable action dispatch.
  - Completion handoff remains explicit.

### Planned: Migrate Tavern Work QTE Into Playable Runtime

- status: `planned`
- target:
  - Replace tavern-local `qte-bar` lifecycle with an `activity-qte` integration or a dedicated registered playable.
  - Move timer, action, result, settlement, and return behavior behind playable runtime.
- acceptance notes:
  - Tavern may remain the host and integration owner.
  - Tavern must not privately own reusable QTE lifecycle after migration.
  - Persistent rewards and progress must flow through unified state/settlement.

### Planned: Keep City Begging UI Driver But Runtime-Owned Actions

- status: `planned`
- target:
  - Keep browser animation-frame rendering as UI driver only.
  - Ensure launch, pointer, tick, completion, save/status mutation, and closeout remain runtime-owned.
- acceptance notes:
  - UI may synchronize canvas/overlay state.
  - UI must not settle rewards or directly mutate persistent game state.

### Planned: Define Scenario-Pack Custom Playable Format

- status: `planned`
- target:
  - Add a pack-owned custom playable declaration format.
  - Prefer JSON configuration before any script execution support.
- proposed files:

```text
scenario-pack/
  playables.json
  playable-integrations.json
  playables/
    custom-card-game.json
```

- minimum custom playable record:

```json
{
  "id": "custom.card-game.simple",
  "name": "翻牌小游戏",
  "family": "minigame",
  "ui": {
    "layout": "choice-grid",
    "title": "翻牌"
  },
  "state": {
    "score": 0,
    "turn": 1
  },
  "actions": [
    {
      "id": "pick-card",
      "label": "翻牌",
      "effects": [
        { "type": "add", "target": "state.score", "value": 1 }
      ]
    }
  ],
  "outcomes": [
    {
      "when": { "state.score": { "gte": 3 } },
      "result": "success"
    }
  ]
}
```

### Planned: Define Custom Playable Integration Format

- status: `planned`
- target:
  - Allow one custom playable to be reused by house, scene, task, or external launch sites.
  - Keep owner and return behavior explicit through integration metadata.
- minimum integration record:

```json
{
  "integrationId": "playable.custom.card-game.house.tavern",
  "playableId": "custom.card-game.simple",
  "ownerKind": "house",
  "ownerId": "house.tavern",
  "returnPolicy": "resume-owner"
}
```

### Planned: Keep HTML And Arbitrary JS Out Of The First Custom Playable Slice

- status: `planned`
- target:
  - Do not make `html + js` the first custom playable format.
  - Use JSON configuration first.
  - Reserve a later, sandboxed script layer only if configuration is insufficient.
- rationale:
  - Direct HTML/JS can bypass runtime lifecycle, UI rendering, state mutation, save/restore, and security boundaries.
  - Editor validation and preview are much easier with structured JSON.

### Planned: Reserve Advanced Custom Logic Extension

- status: `planned`
- target:
  - Reserve future support for DSL or sandboxed script files.
  - Ensure scripts can only access a bounded playable context API.
- possible future shape:

```text
scenario-pack/
  scripts/
    playables/
      custom-card-game.logic.js
```

- boundary:
  - Scripts may read and update session-scoped data through an approved API.
  - Scripts must not directly access DOM, localStorage, global app state, or persistent gameplay state.
  - Persistent changes must still go through playable settlement.

## Planned Acceptance Criteria

- All builtin minigame-like mechanics can be launched by `playableId` and `integrationId`.
- Every scenario-owned playable use site has one integration record.
- `main.ts` does not contain concrete playable business logic.
- House modules may trigger or host playables but do not privately own reusable playable lifecycle.
- Activity QTE, story battle, city begging, grain accounting, medicine compounding, and tavern work all route through the shared playable runtime.
- Custom JSON playables can be loaded from a scenario pack, validated, previewed, launched, settled, saved, and restored.
- Invalid custom playable definitions fail closed with actionable diagnostics.
- Advanced custom script support remains explicitly deferred until a sandbox and bounded API exist.
