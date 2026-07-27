# Troop And Backpack Button Sound Design

Date: 2026-07-27

## 1. Goal

Align troop-editor and backpack UI button sounds with the existing shared `light` and `heavy` button audio system.

This batch must classify the relevant entry buttons, in-panel actions, and confirmation buttons without:

- hardcoding sound routing in `src/main.ts`
- bypassing the shared button sound resolver
- coupling playback behavior to individual click handlers

## 2. Current Problem

The repository already has:

- centralized reusable button sound cues for `light` and `heavy`
- markup-driven resolution through `data-button-sound`
- real mp3-backed playback handled by the shared audio controller

However, the troop-editor, troop-management, backpack, and related entry buttons are still inconsistent.

Today:

- the character-detail `背包` button is still marked `light`
- the map `部队` and map `背包` entry buttons do not yet declare the required heavy sound
- backpack internal buttons do not consistently declare `light`
- troop-editor and troop-management confirmation flows do not yet encode the requested `confirm = heavy / cancel-back = light` rule in markup

That leaves the current UX out of sync with the rule set already applied in city and house flows.

## 3. Scope

This design covers:

- map entry buttons for `部队` and `背包`
- character-detail entry button for `背包`
- all interactive buttons inside the backpack overlay
- troop-editor menu buttons, selection buttons, shop buttons, and confirmation overlays
- troop-management action buttons, reserve-member flows, and confirmation overlays
- regression coverage for the above sound declarations

This design does not cover:

- changing audio playback overlap, queue semantics, or controller behavior
- introducing any new sound type beyond existing `light` and `heavy`
- changing card-library or city/house sound policy unless needed by current tests
- moving troop or backpack business logic into a new runtime module

## 4. Design Principles

The implementation must follow these rules:

1. sound choice stays declarative at the rendered button level through `data-button-sound`
2. `src/main.ts` may keep generic event dispatch only and must not gain troop-specific or backpack-specific sound branches
3. entry intensity and confirmation intensity are separate concerns:
   - entering major panels can be `heavy`
   - in-panel navigation and cancellation stay `light`
4. confirmation dialogs must follow one consistent rule:
   - affirmative or forward action is `heavy`
   - cancel, close, back, and acknowledgement are `light`
5. identical action ids do not imply identical sound across all contexts; context-specific markup remains authoritative

## 5. Recommended Design

### 5.1 Entry Buttons

The following entry points should declare `data-button-sound="heavy"`:

- map `部队` button in `src/ui/views/map/map-view.ts`
- map `背包` button in `src/ui/views/map/map-view.ts`
- character-detail `背包` button in `src/ui/views/character/character-detail-view.ts`
- troop-editor menu button whose `actionId` is `open-troop-management`

The existing character-detail `卡片` and `返回` buttons remain `light`.

### 5.2 Backpack Overlay

All interactive buttons rendered by `src/ui/views/inventory/backpack-view.ts` should declare `data-button-sound="light"`.

This includes:

- filter chips
- item selection buttons
- item action buttons
- overlay return button

Backpack is treated as a browsing/action panel, not a confirm-heavy flow.

### 5.3 Troop-Editor Sound Policy

`src/ui/views/troop-editor/troop-editor-view.ts` should adopt a local rendering policy helper that returns `light` or `heavy` for troop-editor-specific button categories.

Required behavior:

- `队伍管理` menu entry is `heavy`
- other first-level troop-editor menu entries are `light`
- troop cards are `light`
- shop offer rows are `light`
- shop prompt:
  - `buy` is `heavy`
  - `cancel` is `light`
- shop back button is `light`
- create dialog:
  - confirm is `heavy`
  - cancel/back is `light`
- dismiss member selection buttons are `light`
- dismiss prompt:
  - `dismiss` is `heavy`
  - `back` is `light`
- dismiss confirm dialog:
  - confirm is `heavy`
  - cancel is `light`
- generic disband/clear confirm dialog:
  - confirm is `heavy`
  - cancel is `light`
- single-button alert close is `light`

The helper should remain local to troop-related rendering and should only emit markup values, not queue audio itself.

### 5.4 Troop-Management Sound Policy

`src/ui/views/troop-editor/troop-management-view.ts` should follow the same local declarative pattern.

Required behavior:

- troop list cards used to switch viewed troop are `light`
- left/right cycle buttons are `light`
- first-level management action buttons are `light`
- reserve-member buttons are `light`
- reserve prompt:
  - `assign` is `heavy`
  - `back` is `light`
- reserve close button is `light`
- remove-unit confirm dialog:
  - confirm is `heavy`
  - cancel is `light`
- single-button alert close is `light`
- action button with `data-action="close-troop-management"` remains `light`

This intentionally differs from the troop-editor menu entry to `队伍管理`: opening the management screen is heavy, but browsing inside it remains mostly light.

### 5.5 Context Beats Action Id

`open-troop-management` appears in more than one rendered context.

This design explicitly requires:

- troop-editor menu entry to `队伍管理`: `heavy`
- troop-management troop-switch cards: `light`
- troop-management left/right cycle buttons: `light`

The implementation must therefore assign sound by rendered button role, not by globally keying on action id alone.

## 6. Behavioral Contract

After this batch:

- entering `部队`, `背包`, and `队伍管理` uses the heavy button sound
- backpack internal interactions use the light button sound
- troop-editor and troop-management overlays consistently follow `confirm = heavy` and `cancel/back/close = light`
- the existing shared button sound system remains the sole playback path

## 7. File-Level Change Plan

### 7.1 `src/ui/views/map/map-view.ts`

Add explicit `data-button-sound="heavy"` to the map entry buttons for:

- `open-troop-editor`
- `open-backpack`

### 7.2 `src/ui/views/character/character-detail-view.ts`

Change the `open-backpack` button from `light` to `heavy`.

Do not change:

- `open-cards`
- `close-character-detail`

### 7.3 `src/ui/views/inventory/backpack-view.ts`

Add `data-button-sound="light"` to all rendered buttons in the backpack overlay.

### 7.4 `src/ui/views/troop-editor/troop-editor-view.ts`

Introduce a small local sound-policy helper and apply it to:

- menu buttons
- troop cards
- shop buttons
- prompt buttons
- confirmation overlays
- alert close button

### 7.5 `src/ui/views/troop-editor/troop-management-view.ts`

Introduce the matching local sound-policy helper or shared troop-view helper and apply it to:

- troop-switch cards
- cycle buttons
- action buttons
- reserve-member buttons
- reserve prompts
- confirm overlays
- alert close button

### 7.6 Tests

Update and extend:

- `tests/property-panel-button-sound-contract.test.cjs`
- `tests/backpack-ui-contract.test.cjs`
- `tests/party-editor-ui-source.test.cjs`

The tests should verify declarations in rendered source and rendered backpack HTML, not audio playback internals.

## 8. Testing Requirements

Implementation must add or update regression coverage for:

1. map `部队` and `背包` entries declare `heavy`
2. character-detail `背包` declares `heavy`
3. backpack filter, selection, action, and return buttons declare `light`
4. troop-editor `队伍管理` declares `heavy`
5. troop-editor first-level non-management buttons declare `light`
6. troop-editor secondary prompts and confirms follow `confirm = heavy / cancel-back = light`
7. troop-management browsing buttons declare `light`
8. troop-management reserve assignment confirm declares `heavy`
9. troop-management confirm dialogs and alert close follow the required polarity

Tests should stay narrowly focused on button-sound markup so they remain stable even if troop or backpack gameplay logic changes later.

## 9. Final Recommendation

Implement this batch as a declarative markup migration on top of the existing shared button sound system.

The correct shape is:

- heavy sound for major panel entry points
- light sound for routine in-panel browsing
- heavy sound for confirm/commit actions
- light sound for cancel/back/close acknowledgement
- no new event-layer routing logic
