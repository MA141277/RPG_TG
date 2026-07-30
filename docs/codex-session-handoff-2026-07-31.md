# Codex Session Handoff - 2026-07-31

This document preserves the working context from a long Codex session on `RPG_TG`.
It is intended to be read by another Codex client before continuing work on another computer.

## How Another Codex Session Should Use This

1. Pull the latest `origin/mod-first-dev`.
2. Read this document first.
3. Read `AGENTS.md` before making changes.
4. Do not submit `.codex/config.toml`; it is local runtime configuration.
5. If continuing menu, event route, playable, item, inventory, or script-editor work, keep the design rules in this document as current project intent unless the user overrides them.

## Repository State At Handoff

- Workspace: `D:\workspace\project\RPG_TG`
- Branch: `mod-first-dev`
- Remote branch: `origin/mod-first-dev`
- Latest pushed commit: `83fd9e8 feat: refine script editor menu routing`
- Current untracked file after push: `.codex/config.toml`
- `.codex/config.toml` content is local Codex sandbox/runtime configuration and should not be committed.

## Important Repository Rules

The repository `AGENTS.md` rules are active and important:

- Do not add feature business logic to `src/main.ts`.
- Shared runtime, startup, render, UI action dispatch, event, dialogue, playable, house, backpack, inventory, resource, and style wiring should stay in their owning modules.
- If a change touches shell/runtime/style boundaries, follow the intent of `docs/main-shell-contract.md` even if the file is absent on a branch.
- For house work, present and follow the house interface contract before implementation.
- For gameplay loops, do mechanism-first design. Prefer reusable systems over one-off story patches.
- For creator-facing editor UI, do not expose runtime IDs.
- CSS/style changes should follow existing design tokens and avoid arbitrary one-off values when possible.

## Core Direction Established In This Session

The project is moving toward a unified event-route architecture:

- Creator modules define content assets and creator-visible relationships.
- Runtime state and runtime execution are separate from authoring definitions.
- Menu clicks, item actions, playable launches, and settlement effects should flow through event routing.
- Runtime-specific handling should happen through route commands and runtime dispatchers, not through ad hoc UI entry branches.

In short:

> Creator-facing modules define intent. Events route intent. Runtime dispatchers execute intent.

## Item, Backpack, And Inventory Design

The session began with a design discussion about whether the module should be named "item" or "asset". The conclusion was to treat items as a major content asset, but keep backpack and inventory separate.

### Three-Layer Model

1. Items are content assets.
   - Items are reusable definitions in the script editor, like buildings and people.
   - They answer: what the item is, its static properties, allowed interactions, and default presentation.

2. Backpack is a runtime container and view entry.
   - Backpack is not a heavy authoring module.
   - It displays current held items, categorizes and filters them, lets the player select items, executes item operations, and shows whether actions are currently available.

3. Inventory is runtime state.
   - Inventory records what the player currently has.
   - It owns quantity, equipped state, temporary gain/consume state, and submitted quest item state.

Relationship:

- Item defines what can exist.
- Inventory records what currently exists for the player.
- Backpack provides the player-facing interaction surface.

### Item Runtime Semantics

Item effects should not directly mutate player stats from the item definition. For example:

- Potion: using it should trigger an event, which routes to a settlement/effect runtime that increases a health-like attribute by 10.
- Fate coin: using it should trigger an event, which routes to settlement logic that randomly increases or decreases a health-like attribute.

The item itself should mainly define:

- Creator-facing name and presentation.
- Optional creator-defined custom properties.
- Optional menu group or available operations.
- Event references for behavior.

Item action execution should route through event binding, then settlement/runtime handling.

### Item Editor Constraints

- Item should be a first-level editor asset.
- Item ID must be a numeric string and hidden from creators.
- Item menu group can be empty.
- Menu group data source should come from the menu module.
- Avoid excessive fixed item fields.
- Allow creator-defined custom properties, but runtime should only interpret known semantic fields or explicit event references.
- Creator UI should not ask for JSON.

## ID Rule

The user explicitly required all editor IDs to follow the editor ID rule:

- IDs are numeric strings.
- IDs are runtime/internal values.
- IDs must not be visible on creator-facing surfaces.

This applies to items, menus, playables, events, and other editor records unless a legacy content-pack path still uses external identifiers internally.

## Unified Event Route Design

The user repeatedly emphasized that all project event passing and dispatching must go through event routing.

Current agreement:

- Item effects are triggered as events.
- Menu entries trigger events.
- Playable/minigame launches are triggered by events.
- Settlement/effect execution is triggered by events.
- Future runtime families should be invoked by event route destination/command dispatch, not by each caller hardcoding runtime calls.

### EventRouteCommand

The earlier name `RuntimeAction` was rejected because it sounded like the runtime itself. The selected name is:

- `EventRouteCommand`

Relevant file:

- `src/domain/event.ts`

Event definitions now support route commands.

### Route Command Dispatch

New file:

- `src/application/events/event-route-command-dispatch.ts`

Purpose:

- Dispatch route commands produced by events.
- Handle playable launches through the playable runtime.
- Preserve room for future runtime command types.

### City Menu Event Launch

New file:

- `src/application/city-menu/city-menu-event-launch.ts`

Purpose:

- Launch city menu event actions.
- Run story event handling.
- Dispatch route commands such as playable launch or open city menu panel.
- Keep city menu behavior on the event route path.

## Menu Module Design

The menu module was redesigned around creator-facing menu items rather than menu resource JSON.

### Creator-Facing Menu Item

The menu module should create menu items, not expose instance/resource internals.

Creator-visible fields should be minimal:

- Menu name.
- Target object.

Target object data source:

- Event module instances.

Creator-facing surfaces should not show:

- JSON table.
- ID.
- `menuFamily`.
- `targetFamily`.
- Runtime resource IDs.

### Event Type: Menu

Events were extended to include menu-type events. Legacy menu behavior is wrapped as event instances.

Examples:

- Menu item: `地点`
  - Event title: `地点`
  - Event type: `菜单`
  - Destination family: `菜单`
  - Destination target: `地点`

Equivalent wrapping applies to:

- `概况`
- `情报`
- `地点`
- `管理`
- `化缘`
- Other menu functions found in the project.

### City And Building Menu Groups

City menu tab was renamed to:

- `菜单组`

Concept:

- Menu module creates reusable menu items.
- City/building menu groups select menu items to form a group.
- Menu groups add/remove menu items only.
- Menu items trigger event instances.
- Events then open menu panels, launch playables, or route elsewhere.

The user stated the purpose clearly:

> Menus are only naming menu items and binding events. City menu groups only add/remove menu items to form a group. They can trigger any event type and can nest into second-level menus through events.

## Playable / Minigame Design

The user clarified that all minigames must be triggered through playable instances created in the playable module.

### Prototype Versus Instance

- Existing minigames such as `city-begging` are gameplay prototypes.
- A project should not trigger a prototype directly.
- The playable module creates a playable instance that selects a prototype.
- Events target playable instances.
- Runtime resolves the instance to the prototype and launches it.

### Script Tables

The user proposed adding script tables for:

- Menu records.
- Playable records.

The design was accepted:

- Menu table saves menu item instance data.
- Playable table saves playable instance data.
- Runtime export materializes these into executable runtime definitions.

### Playable Editor UI Changes

The event destination label `小游戏` was changed conceptually to `玩法` to avoid confusion between minigame prototype and playable instance.

The playable module authoring surface should be creator-facing:

- Move `玩法原型` into basic information.
- Remove `触发与调度`.
- Remove `结算与返回`.
- Remove `事件`.
- Do not make creators fill `触发事件`.
- Do not make creators fill `触发目标`.
- Allow binding a settlement instance in basic information.
- Remove `高级设置与系统信息`.
- Remove `备注`.
- Remove `说明`.

### Dialogue Ownership Rule Retired

Old runtime/export validation required:

> 玩法绑定需要填写所属对话，才能运行预览或导出剧本。

The user identified this as an old rule. It was retired.

For menu/event-launched playable instances:

- `ownerKind: "external"`
- `ownerId: ""` or null after export.
- `returnPolicy: "close-only"`

### Outcome Route Rule

There was a preview/export error:

> Minigame binding requires at least one outcome route.

For event-launched external playables, empty outcome routes should default to close-only:

- success -> close-only
- failure -> close-only
- cancelled -> close-only

### Direct Prototype Reference Rejected

There was an error:

> Event "460005" references missing minigame "city-begging".

Root cause:

- An event/menu pointed directly to minigame prototype `city-begging`.

Resolved design:

- Built-in template import wraps `city-begging` as a playable instance.
- Events point to playable instance IDs, not prototype IDs.
- Runtime export rejects direct prototype target IDs and tells the creator/system to create a playable instance first.

## City Menu Runtime Fixes

### Menu Clicks Not Launching Playables

Observed issue:

- User configured `概况` to launch a playable.
- City menu click reached event route but did not start the playable.
- The UI flickered or did nothing.

Root cause:

- City menu launch code only handled story event and open city menu panel.
- It did not consume `launchPlayable` commands.

Fix:

- City menu event launch now routes through event command dispatch.
- `launchPlayable` is handled by shared event route command dispatch.

### `化缘` Menu Missing

User asked why `化缘` did not display.

Browser reproduction:

- Editor city menu group had `概况` and `化缘`.
- Runtime preview entered `濠州`.
- Runtime only displayed `概况`.

Root cause:

- `src/application/city-menu/city-menu.ts` had hardcoded filtering:
  - if `menuFamily` is begging
  - and player is not monk
  - hide the menu entry

The current preview player showed `无官职`, so `化缘` was filtered.

This conflicts with creator-configured menu groups. Runtime should not silently hide configured menu items based on hardcoded identity unless an explicit condition system says so.

Fix:

- Removed the hardcoded begging/non-monk filter.
- Menu visibility now follows creator configuration (`isVisible`) and menu group data.

Verification:

- Runtime preview entered `濠州`.
- City menu displayed:
  - `概况`
  - `情报`
  - `地点`
  - `管理`
  - `化缘`
- Clicking `化缘` opened the begging minigame UI with score/combo/food/time indicators.

Added regression test:

- `city menu runtime keeps configured begging entries visible for non-monk players`

## Script Editor UI Work Completed

The session included extensive creator-facing script editor UI work. The high-level direction was:

- Hide runtime IDs.
- Remove JSON editing surfaces.
- Reduce technical fields.
- Keep creator forms direct and named by domain language.
- Stabilize list/card heights and pagination.

### Left Navigation

Removed visible group labels at different points:

- `世界`
- `剧本与文本`
- `玩法`
- `资产库`

The user later requested adding the menu module under the gameplay/playable area of the left navigation. The menu module is now present as `菜单`.

Removed:

- `剧情节点` module from creator navigation.

### Item Module

Implemented or discussed:

- Move item module under world, same level as building.
- Item module should only retain secondary list and item workbench.
- Remove display name field.
- Icon resource should be a dropdown.
- Icon resource data source should come from portrait/resource instances.
- Menu group should follow city add/remove method.
- Item module should not expose JSON.
- Creator-facing item design still likely needs more refinement later.

### Person Module

Completed or discussed UI changes:

- Remove trading tab.
- Remove event tab.
- Remove dialogue tab.
- Rename attributes tab to `基础`.
- New person should not default-add `身份` and `职业/定位` custom properties.
- Remove IDs from all dropdown display labels in the person basic tab.
- Merge portrait ID and portrait variant into one field:
  - label: `人物立绘`
  - options directly read portrait names
  - if no name exists, display image relative path
- Person custom properties:
  - one row per page, not two rows
  - visible pagination controls should not hide
  - square `+` add button
  - title placed in parent container with person name/intro style
  - card height fixed
  - card content centered
  - custom property container border/background removed
  - current page should be filled from following pages if current visible set is under 5 and more entries exist
  - person intro textarea height adjusted to absorb blank space
  - bottom of custom property container aligned with pagination controls

There was a bug where person module buttons could not be clicked; it was investigated/fixed during the session.

### City And Building Modules

City:

- Menu tab renamed to `菜单组`.
- City menu radio buttons removed.
- Menu items per page changed several times; final user request set city/building menu items to 3 per page.
- Parent height fixed.
- Pagination buttons and page text fixed at bottom and always visible.
- Remove labels in the red-marked areas of menu tab.
- Remove menu usage/type authoring labels from city/building menu group UI.
- Delete button for menu instances changed to top-right red `X`.
- Remove unavailable hint field.
- Remove ID subtitles from instance lists.
- Instance list top and bottom distance to parent container made consistent.
- Avoid scrollbars by fitting content to height.

Building:

- Same menu group cleanup as city.
- Remove radio buttons from building instance menu tab.
- Basic tab layout adjusted to remove blank area.
- Remove `高级设置与系统信息`.
- Rename `建筑说明` to `描述`.

### Project Info Page

Completed:

- Remove labels/sections:
  - `项目总览`
  - `项目说明`
  - `剧本包说明`
  - `入口事件ID`
  - `高级设置与系统信息`
- Remove `项目根信息` header label.
- Move save button to bottom center.
- Adjust save button height.

### Global Layout And Notices

Completed or discussed:

- Move notice label from top to the user-marked green position.
- Notice disappears after 3 seconds.
- Notice and button should be in one row, not separate rows.
- Header height fixed and should not change when notice appears.
- Remove second-layer background in selected editor container.
- Move top horizontal nav upward.
- User briefly asked for fixed overall layout that does not scale with window resizing, then cancelled and requested reverting to original responsive style.

## Performance Work

The user repeatedly reported the script editor felt slow:

- "为什么感觉很卡"
- "没有变化，还是很卡"
- "还能再优化么？让剧本编辑器再快一些"

Some UI/render optimizations were made during the session, mostly in:

- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- `src/styles/script-editor.css`

If continuing performance work, do not guess. Measure first:

- Check whether full workspace re-renders on every input.
- Check large dropdown option recomputation.
- Check person/resource/text list rendering costs.
- Check repeated event binding or duplicated listeners.
- Cache creator record options where safe.
- Prefer local re-render boundaries where possible.

## Branch And Git History In This Session

Branches viewed/switched during the session:

- `origin/codex/sync-naqishuo-721ui-to-mmz`
- `mod-first-dev`

The final branch is:

- `mod-first-dev`

Final pushed commit:

```text
83fd9e8 feat: refine script editor menu routing
```

Commit summary:

- route city menu entries through event commands
- keep configured city menu items visible in runtime
- simplify creator-facing playable and menu authoring

## Browser Verification Record

Browser URL:

- `http://127.0.0.1:5173/`

Latest successful browser test:

1. Open main menu.
2. Enter script editor.
3. Use built-in Zhu Yuanzhang template.
4. Run preview.
5. Select Zhu Yuanzhang and start adventure.
6. Click `濠州`.
7. Click `进入城市`.
8. City menu shows:
   - `概况`
   - `情报`
   - `地点`
   - `管理`
   - `化缘`
9. Click `化缘`.
10. Begging minigame UI appears with:
    - score
    - combo
    - converted food
    - timer

## Verification Commands Run Before Latest Commit

Commands:

```powershell
npm.cmd run typecheck
npm.cmd run build:test
node --test --test-name-pattern "city menu runtime resolves formal menu resource|configured begging entries visible|city menu runtime prioritizes explicit event targets|city menu runtime resolves script editor minigame bindings|does not require dialogue ownership|runtime export launches city menu minigames|derives menu minigame launch|direct first-phase default creators" tests\robustness.test.cjs
```

Results:

- Typecheck passed.
- Test build passed.
- 8 targeted regression tests passed.

Known old/wider test issue:

- Test name: `city stage app render mounts activity overlay for city-menu launched activity playables`
- It failed during a wider run because the assertion expected city rendering to return only `activityOverlay`.
- Current code also renders `housePlayableOverlay`.
- This is not caused by the `化缘` visibility fix.
- If this area is touched later, update the old assertion to match current render composition.

## Important Files Changed In Latest Commit

New files:

- `src/application/city-menu/city-menu-event-launch.ts`
- `src/application/events/event-route-command-dispatch.ts`
- `src/ui/views/playables/house-playable-overlay.ts`

Important modified files:

- `src/application/city-menu/city-menu.ts`
- `src/application/ui/app-click-coordinator.ts`
- `src/domain/event.ts`
- `src/modules/script-editor/application/menu-authoring.ts`
- `src/modules/script-editor/application/minigame-binding-authoring.ts`
- `src/modules/script-editor/application/minimal-workflow.ts`
- `src/modules/script-editor/application/person-authoring.ts`
- `src/modules/script-editor/application/runtime-pack-export.ts`
- `src/modules/script-editor/application/runtime-pack-import.ts`
- `src/modules/script-editor/application/script-editor-id-allocation.ts`
- `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
- `src/modules/script-editor/application/workspace-shell.ts`
- `src/modules/script-editor/domain/script-editor-project.ts`
- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- `src/styles/script-editor.css`
- `src/ui/app-render.ts`
- `src/ui/main-ui/main-ui-flow.js`
- `tests/robustness.test.cjs`
- `tsconfig.test.json`

## Useful Search Terms For Future Work

Use these search terms to find relevant logic:

- `EventRouteCommand`
- `dispatchEventRouteCommands`
- `launchCityMenuEvent`
- `resolveCityMenuEntries`
- `formalizeScriptEditorProjectMenus`
- `menuItems`
- `targetFamily === "event"`
- `triggerSource: "event-destination"`
- `ownerKind: "external"`
- `returnPolicy: "close-only"`
- `configured begging entries visible`

## Likely Next Work Areas

### If Continuing Playable Template Work

The user said:

> 我感觉小游戏没模板不完整

Do not patch only one minigame UI. First define:

- playable prototype
- playable instance
- playable template
- creator-visible fields
- runtime-hidden fields
- settlement binding
- outcome/return policy
- how event routes launch it

Then implement the creator-facing template flow.

### If Continuing Item Module Work

Follow the three-layer model:

- item as content asset
- inventory as runtime state
- backpack as runtime UI/container

Item action behavior should trigger events, which can route to settlement runtime, playable runtime, dialogue runtime, menu runtime, or future runtimes.

### If Continuing Menu Work

Keep the module creator-facing:

- menu item name
- target event
- no ID display
- no JSON display
- no menuFamily/targetFamily editing on creator surface

City/building menu groups should compose menu items only.

### If Continuing Event Route Architecture

Avoid adding special branches per entry point.

Preferred shape:

1. UI/interaction chooses an event.
2. Event route resolves commands.
3. Command dispatcher selects runtime.
4. Runtime owns execution.

Future runtime types should be added by extending route command dispatch and destination normalization, not by hardcoding each caller.

## Open Cautions

- `src/main.ts` was modified in the long session before this handoff. Avoid adding more business logic there. If more main wiring is required, consider moving it to a coordinator or transition layer first.
- Some docs mentioned by governance may be missing on this branch; follow their intent anyway.
- `.codex/config.toml` is untracked and local.
- The working tree should otherwise be clean after pulling latest `origin/mod-first-dev`.
