# Global NPC Interaction Design

## 1. Goal

Create one reusable NPC interaction mechanism for the game.

Any character shown in an active NPC pool should be clickable when the player is not already inside another dialogue, modal, overlay, minigame, or message window. Clicking that character opens a structured interaction menu. The menu always includes the default actions `角色情报`, `谈话`, and `送礼`, while the current gameplay context may contribute special actions such as work, submit task, trade, study, ask for information, debate, or other service flows.

The system must work first for the existing house left-side role pool, and it must be shaped so city, scene, street, and other future screens can expose the same NPC pool and dialogue behavior without creating another interaction path.

## 2. Current Repository State

The repository already has several pieces that should be reused:

- `HouseModuleViewModel.standbyRoster` is the current structured left-side house actor pool.
- `renderHouseStandbyRoster()` renders clickable house actors through structured action ids.
- `GameState.ui.houseSession` stores typed house session state.
- `GameState.ui.overlayView` already controls global full-screen overlays such as character detail, cards, and valuables.
- `app-render.ts` already renders global location dialogue through `locationDialogueState`.
- `CityNpcPoolDefinition` and `GameState.runtime.cityNpcPools` already model city roaming NPCs, favorability, location, and dialogue pools.
- Existing special houses use `moduleId -> registry -> lifecycle -> view model`.

Current mismatches:

- NPC interaction is mostly house-local. Tea house, medicine house, market house, tavern, and leader residence each build their own `talk`, `small-talk`, `greeting`, `gift`, or service actions.
- The term `闲谈` appears as a hardcoded behavior label in several house modules, but it is not a stable interaction contract.
- `角色情报` cannot currently target arbitrary NPCs because the detail overlay renders the player character.
- Leader residence `送礼` mutates relation directly and does not select an item from shared inventory.
- City and scene views do not have a reusable NPC pool contract, even though city NPC runtime data already exists.

## 3. House Contract Alignment

This feature affects special house modules, so it must follow `docs/special-house-interface.md`.

Rules:

- Do not add house-specific NPC branches to `src/main.ts`.
- Do not make `main.ts` import concrete house business modules.
- Do not return HTML strings from `application/*`.
- Do not store NPC interaction state in ad hoc top-level globals.
- Do not reset player stats, money, skills, relationship values, or inventory during NPC interaction initialization.
- Persistent changes from talk, gift, trade, study, work, or task submission must flow through unified game state structures.
- Existing house modules still enter through `moduleId`, registry lookup, and the `enter / dispatch / leave / selectViewModel` lifecycle.

The global NPC system may route a context-specific special action back to the owning house module, but it must not understand that module's business rules.

## 4. Recommended Architecture

Add a global NPC interaction session and a reusable NPC pool contract.

The global session owns only the generic interaction shell:

```ts
type NpcInteractionContext =
  | { type: "house"; houseId: string; moduleId?: HouseModuleId | null }
  | { type: "city"; cityId: string; locationId?: string }
  | { type: "scene"; sceneId: string };

type NpcInteractionSession =
  | null
  | {
      context: NpcInteractionContext;
      targetCharacterId: CharacterId;
      mode: "menu" | "dialogue" | "gift-select";
    };
```

Each screen contributes the currently interactable NPC pool:

```ts
type NpcPoolViewModel = {
  context: NpcInteractionContext;
  actors: NpcPoolActorViewModel[];
};

type NpcPoolActorViewModel = {
  characterId: CharacterId;
  name: string;
  title?: string;
  avatarImageUrl?: string | null;
  isSelected?: boolean;
  disabled?: boolean;
};
```

The first implementation should adapt house `standbyRoster` into this shared pool. Later city and scene implementations should produce the same `NpcPoolViewModel` rather than copying the house roster model.

## 5. Menu Contract

Clicking an enabled NPC opens a structured menu:

```ts
type NpcInteractionMenuViewModel = {
  type: "npc-interaction-menu";
  context: NpcInteractionContext;
  targetCharacterId: CharacterId;
  targetName: string;
  options: NpcInteractionOptionViewModel[];
};

type NpcInteractionOptionKind =
  | "special"
  | "profile"
  | "talk"
  | "gift";

type NpcInteractionOptionViewModel = {
  id: string;
  label: string;
  kind: NpcInteractionOptionKind;
  disabled?: boolean;
  tone?: "default" | "accent";
};
```

Ordering:

1. Context special actions, in the order contributed by the current context.
2. `角色情报`.
3. `谈话`.
4. `送礼`.

This keeps service and task actions prominent while guaranteeing the baseline interaction vocabulary for every NPC.

## 6. Default Actions

### 6.1 角色情报

`角色情报` opens the existing character detail screen for the selected NPC.

The global overlay state should support a detail target, for example `detailCharacterId`, so `overlayView: "detail"` can render either the selected NPC or the player fallback. Closing the overlay returns to the previous screen and preserves the current NPC interaction session context.

The detail UI should remain the same component used by clicking the player attribute panel.

### 6.2 谈话

`谈话` replaces `闲谈` as the standard basic conversation behavior.

First version behavior:

- show a default greeting or one line from the target character's dialogue pool;
- do not apply relationship, stat, money, inventory, or skill changes unless a later event/effect explicitly defines them;
- close back to the current context after the player advances the dialogue.

Future behavior may evaluate event timing such as `talk`, apply relationship changes, reveal intel, or trigger scene content. These effects should be declared through structured event/effect contracts rather than hardcoded in a house action label.

### 6.3 送礼

`送礼` opens a gift selection flow backed by shared inventory.

First version may expose an empty or disabled state if giftable items are not ready, but the contract should already separate:

- giftable item id;
- item type;
- item value;
- item attributes or tags;
- target preference;
- relationship or reaction result.

Gift settlement must mutate shared inventory and relationship state through `GameState`, not through local UI state.

## 7. Special Actions

Special actions are contributed by the active context.

Examples:

- Tavern owner: `工作`, `交活`, `赌博`.
- Tea house actor: `请茶`, `打听`, `舌战`.
- Medicine house doctor: `疗伤`, `买药`, `配药`.
- Market trader: `调查`, `买入`, `卖出`.
- Leader residence target: `学习`.
- Council or keep actor: `交任务`, `接受任务`, `评定相关入口`.

The global NPC interaction shell dispatches a selected special action back to the owning context. For a house context, that means dispatching through the existing house module lifecycle. The global shell should not know how tavern work, medicine buying, debate, market trade, or study is implemented.

Existing basic-looking actions should be normalized:

- old `闲谈`, `small-talk`, and simple `talk` labels become the default `谈话`;
- old direct `送礼` actions move behind the shared gift flow;
- actions that are genuinely contextual, such as `学习`, remain special actions.

## 8. Rendering Model

The NPC pool should be a reusable UI surface. House views can continue rendering the left-side pool in their current location, but the data contract should no longer be house-only.

Rendering rules:

- NPC pool actors are disabled while another blocking overlay, dialogue, minigame, result panel, trade panel, or message window is active.
- A selected actor may be visually marked while the menu or dialogue targets that actor.
- The interaction menu is structured data, rendered by UI.
- Dialogue uses the shared dialogue-box speaker portrait pattern.
- The menu and default dialogue must not be created as HTML strings in application modules.

The existing house renderer can be migrated first. City and scene views can later render the same NPC pool component where their layouts need it.

## 9. Data Flow

Target flow for house phase one:

1. The player enters a house through existing house runtime.
2. The house module selects its normal view model, including `standbyRoster`.
3. A shared adapter exposes `standbyRoster` as an `NpcPoolViewModel`.
4. The player clicks an enabled NPC.
5. A generic NPC interaction action opens `GameState.ui.npcInteractionSession` in `mode: "menu"`.
6. The menu selector combines context special actions with default actions.
7. Default actions are handled by the global NPC interaction runtime.
8. Special actions dispatch back to the owning house module through the existing house runtime.
9. Persistent results update unified `GameState`; temporary menu/dialogue state stays in global UI session or the owning typed house session.

No new concrete house branch is required in `src/main.ts`.

## 10. Phased Scope

### Phase 1: Global Contract, House Integration

In scope:

- add global NPC interaction session type;
- add reusable NPC pool and menu view models;
- adapt house `standbyRoster` to the shared NPC pool;
- add arbitrary NPC target support to character detail overlay;
- replace visible `闲谈` labels with `谈话`;
- route default `谈话` through the global NPC interaction behavior;
- define the gift flow contract and provide a safe first version even if no giftable items exist;
- keep existing house special actions working through module dispatch;
- update `docs/special-house-interface.md` and `docs/change-log.md` when implementing shared interface changes.

Out of scope for phase 1:

- full city/street NPC pool UI;
- scene-declared NPC pools;
- complete gift preference economy;
- relationship event balancing;
- new NPC art or layout redesign;
- rewriting all house business reducers.

### Phase 2: City and Street NPC Pools

Use `CityNpcPoolDefinition` and `GameState.runtime.cityNpcPools` to expose interactable NPCs in city or street contexts. The city implementation should produce the same `NpcPoolViewModel` and use the same default actions.

### Phase 3: Scene NPC Pools

Allow scene content to declare a temporary NPC pool when a scene ends or enters a free-interaction window. Scene-declared actors use the same global default actions and can contribute scene-specific special options when needed.

## 11. Edge Cases

- If the target character id is missing from character definitions, the selector should fail closed with a generic unavailable state rather than opening a broken menu.
- If a dialogue, modal, house overlay, minigame, or global overlay is active, NPC pool actors should be disabled.
- If a context contributes no special actions, the menu still shows the three default actions.
- If the player opens character detail from the menu and closes it, the underlying context should remain unchanged.
- If giftable items are unavailable, `送礼` may be disabled or show an empty gift selector, but it should not silently mutate relationship.
- If a special action starts a minigame or trade overlay, the NPC interaction menu should close or become inactive so input ownership is unambiguous.
- If a house uses a meeting/council layout instead of the ordinary left roster, that layout can defer NPC pool exposure until the meeting reaches a free-interaction state.

## 12. Verification

Implementation should include focused checks that:

- all rendered house roster actors can open the global NPC interaction menu when no blocking UI is active;
- blocking dialogue or overlay states disable NPC pool clicks;
- menu ordering places special actions above `角色情报`, `谈话`, and `送礼`;
- `角色情报` renders the selected NPC, not always the player;
- `谈话` replaces existing `闲谈` labels in relevant house menus;
- default `谈话` does not mutate persistent player or NPC state in phase 1;
- `送礼` does not mutate inventory or relationship unless an item is selected and confirmed;
- special house actions still dispatch through module lifecycle;
- `src/main.ts` gains no concrete house or NPC business branches.

Full verification should include:

- focused unit tests for selectors and session transitions;
- focused rendering tests for menu ordering and disabled state;
- `npm run typecheck`;
- `npm test` when practical after focused tests pass.

## 13. Documentation Updates

When implementing this design, update:

- `docs/special-house-interface.md` for shared NPC pool and interaction menu contract;
- `docs/change-log.md` for the new shared NPC interaction behavior;
- any implementation plan under `docs/superpowers/plans/` according to plan governance rules.
