# Unified Equipment Slot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded weapon/armor equipment model with one reusable four-slot equipment system for weapon, armor, accessory, and mount, and connect that shared system to backpack actions, valuables presentation, and character detail.

**Architecture:** Introduce a registry-driven equipment contract under shared domain/application inventory seams, migrate valuables state from `equippedWeaponSet` to a unified `equippedSlots` loadout, and make backpack/valuables/character-detail UI read projected equipment metadata instead of slot-specific branches. Keep the current branch's shell and visible UI ownership, and do not copy `origin/mod-first-dev` implementations wholesale.

**Tech Stack:** TypeScript, Vite, Node test runner, existing backpack/valuables/character-detail UI surfaces, `npm run build:test`, `node --test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Global Constraints

- Use `weapon / armor / accessory / mount` with the same slot registration and equip path.
- Do not add equipment business branches to `src/main.ts`.
- Use the current branch as the UI baseline; do not merge or copy `origin/mod-first-dev` `src/main.ts`, `src/ui/**`, `src/styles/**`, or valuables implementation wholesale.
- `equippedSlots` is the only long-term source of truth; do not keep `equippedWeaponSet` as an active dual model.
- Backpack equipment rows must use one unified equip action id: `equip.valuable`.
- Character detail must render `饰品 / 坐骑 / 装备武器 / 装备防具` from shared equipment state.
- Backpack `equipment` rows must pin equipped items to the top and then order slot groups `weapon -> armor -> accessory -> mount`.
- Update `docs/change-log.md` because this batch changes shared inventory and equipment contracts.
- Follow TDD: write the failing test first, verify the failure, implement the minimal code, and rerun the targeted tests before moving on.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-30`
- Current Focus: `Plan authored and waiting for execution mode selection.`
- Next Step: `Choose execution mode, then start Task 1 with failing equipment-slot contract tests.`
- Verification: `node tools/lint-superpowers-plans.mjs`
- Notes: `This plan is newly authored from docs/superpowers/specs/2026-07-30-unified-equipment-slot-design.md and has not been promoted into the canonical project-progress queue yet.`

## Progress Log

- 2026-07-30
  - Summary: `Created the unified equipment slot design spec and executable implementation plan for the requested four-slot equipment system.`
  - Verification: `node tools/lint-superpowers-plans.mjs`
  - Next: `Choose execution mode, then begin Task 1 with failing tests for the new equipment registry and loadout service.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-unified-equipment-slot-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/domain/valuable-item.ts` still hardcodes `ValuableItemCategory = "weapon" | "armor"` and `equippedWeaponSet`.
  - `src/application/inventory/inventory-selection.ts` still equips by explicit `weapon` vs `armor` branches.
  - `src/application/inventory/item-inventory.ts` still emits `equip.weapon` and `equip.armor`.
  - `src/ui/app-render.ts` still fills `schoolName` and `masterName` with `无` while only resolving weapon/armor names.
  - `src/ui/views/character/character-detail-view.ts` still renders `所属流派` and `武艺师傅`.
  - `src/main.ts` already has a generic `run-backpack-item-action` dispatch path, so this child should not need new top-level shell branches.

## Implementation Scope

### In Scope

- Create a reusable equipment slot registry and loadout service.
- Expand valuables categories from two equipment kinds to four.
- Replace `equippedWeaponSet` with `equippedSlots`.
- Route backpack equipment actions through one unified equip action.
- Project equipped metadata into backpack rows and sort equipment rows with equipped-first slot ordering.
- Render four-slot equipment summaries in valuables UI and character-detail UI.
- Update tests, fixtures, and shared state constructors to the new loadout shape.

### Still Out Of Scope

- New unequip buttons or manual unequip UX.
- Stat bonuses or gameplay effects from equipped accessory/mount items.
- New backpack top-level filters.
- Full content-pack or scenario authoring workflow redesign.
- Promotion of this child into project-progress or child closeout work in this same plan-authoring batch.

## File Map

### Existing files to modify

- `src/domain/valuable-item.ts`
  - Replace hardcoded two-category item typing and `equippedWeaponSet` with generalized equipment slot/loadout typing.
- `src/domain/item.ts`
  - Add unified backpack item action/id metadata for slot-aware equipment rows.
- `src/domain/game-state.ts`
  - Keep `valuables` wired to the new generalized inventory shape.
- `src/application/state/create-initial-state.ts`
  - Seed the new `equippedSlots` shape.
- `src/application/state/game-store-example.ts`
  - Keep the example store aligned with the new loadout contract.
- `src/application/inventory/inventory-selection.ts`
  - Route all equip operations through the shared loadout service and remove slot-specific branches.
- `src/application/inventory/item-inventory.ts`
  - Project slot-aware backpack metadata, unify equip action ids, and sort equipped equipment rows.
- `src/application/app-actions.ts`
  - Keep `runBackpackItemAction()` wired to the shared inventory mutation path with the new action id.
- `src/ui/app-render.ts`
  - Resolve weapon/armor/accessory/mount names through shared equipment helpers and stop filling placeholder school/master values.
- `src/ui/views/inventory/backpack-view.ts`
  - Render equipped markers and consume the new projected row metadata.
- `src/ui/views/valuables/valuable-library-view.ts`
  - Render a four-slot equipment summary and use shared equipment helpers instead of hardcoded weapon/armor checks.
- `src/ui/views/character/character-detail-view.ts`
  - Replace `所属流派 / 武艺师傅` with `饰品 / 坐骑` and render the new equipment-backed values.
- `src/content/scenario-packs/zhuyuanzhang/valuables.json`
  - Add at least one visible `accessory` item and one visible `mount` item if the current startup content has none, so the new slots can be exercised in the running game.
- `tests/unified-backpack-inventory.test.cjs`
  - Lock new slot typing, unified equip action dispatch, equipped metadata, and equipment ordering.
- `tests/backpack-ui-contract.test.cjs`
  - Lock equipped markers and backpack UI contract changes.
- `tests/robustness.test.cjs`
  - Update the existing character-detail source assertions to match the new labels and remove the old ones.
- `docs/change-log.md`
  - Record the four-slot equipment system migration.

### Existing files expected to be deleted

- None in this migration batch.

### New files to create

- `src/domain/equipment/equipment-slot-registry.ts`
  - Own slot definition registration, lookup, and category acceptance rules.
- `src/domain/equipment/equipment-loadout-service.ts`
  - Own loadout creation, normalization, equip/unequip, equipped-id lookup, and equipped-item detection.
- `tests/equipment-slot-domain.test.cjs`
  - Lock the slot registry and loadout service contract independently from the backpack/UI layers.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/equipment-slot-domain.test.cjs tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "character detail source declares the new ability and reputation field labels and no longer hardcodes old skill icon rows|opening and closing character detail resets the ability detail popup state" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Shared Equipment Slot Domain Contract

**Files:**
- Create: `src/domain/equipment/equipment-slot-registry.ts`
- Create: `src/domain/equipment/equipment-loadout-service.ts`
- Create: `tests/equipment-slot-domain.test.cjs`
- Modify: `src/domain/valuable-item.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `src/application/state/game-store-example.ts`

**Interfaces:**
- Consumes:
  - `ValuableItemId` and `ValuableItemInventory` from `src/domain/valuable-item.ts`
- Produces:
  - `EquipmentSlotId = "weapon" | "armor" | "accessory" | "mount"`
  - `EquipmentLoadout = Record<EquipmentSlotId, ValuableItemId | null>`
  - `EquipmentSlotRegistry`
  - `EquipmentLoadoutService`
  - `createDefaultEquipmentLoadout(): EquipmentLoadout`
  - `normalizeEquipmentLoadout(input?: Partial<EquipmentLoadout> | null): EquipmentLoadout`

- [ ] **Step 1: Write the failing domain tests**

Add a new `tests/equipment-slot-domain.test.cjs` that requires:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  EquipmentSlotRegistry,
} = require("../.test-dist/domain/equipment/equipment-slot-registry.js");
const {
  EquipmentLoadoutService,
  createDefaultEquipmentLoadout,
  normalizeEquipmentLoadout,
} = require("../.test-dist/domain/equipment/equipment-loadout-service.js");

test("default equipment loadout contains all four slots", () => {
  assert.deepEqual(createDefaultEquipmentLoadout(), {
    weapon: null,
    armor: null,
    accessory: null,
    mount: null,
  });
});

test("registry resolves slot labels and categories", () => {
  const registry = new EquipmentSlotRegistry([
    { slotId: "weapon", label: "武器", acceptedCategories: ["weapon"], sortOrder: 0 },
    { slotId: "armor", label: "防具", acceptedCategories: ["armor"], sortOrder: 1 },
    { slotId: "accessory", label: "饰品", acceptedCategories: ["accessory"], sortOrder: 2 },
    { slotId: "mount", label: "坐骑", acceptedCategories: ["mount"], sortOrder: 3 },
  ]);

  assert.equal(registry.getSlotForCategory("accessory")?.slotId, "accessory");
  assert.equal(registry.get("mount").label, "坐骑");
  assert.equal(registry.acceptsCategory("armor", "weapon"), false);
});
```

Also add a failing equip test that requires the service to equip `accessory` and `mount` items into the correct slots while preserving other slots.

- [ ] **Step 2: Run the targeted domain tests and confirm they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/equipment-slot-domain.test.cjs }
```

Expected:

- `FAIL` because the new equipment domain modules and four-slot loadout shape do not exist yet.

- [ ] **Step 3: Implement the shared slot registry and loadout service**

Create the new domain modules with the exact contracts above, update `src/domain/valuable-item.ts` to:

```ts
export type ValuableItemCategory =
  | "weapon"
  | "armor"
  | "accessory"
  | "mount";

export type ValuableItemInventory = {
  items: ValuableItemDefinition[];
  selectedItemId: ValuableItemId | null;
  equippedSlots: EquipmentLoadout;
};
```

Then update the state constructors/examples to seed:

```ts
equippedSlots: createDefaultEquipmentLoadout(),
```

or a normalized explicit loadout where initial weapon/armor defaults are needed.

- [ ] **Step 4: Run the targeted domain tests and confirm they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/equipment-slot-domain.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/equipment-slot-domain.test.cjs src/domain/equipment/equipment-slot-registry.ts src/domain/equipment/equipment-loadout-service.ts src/domain/valuable-item.ts src/domain/game-state.ts src/application/state/create-initial-state.ts src/application/state/game-store-example.ts
git commit -m "feat: add unified equipment slot domain"
```

## Task 2: Unified Inventory Equip Application And Backpack Projection

**Files:**
- Modify: `src/domain/item.ts`
- Modify: `src/application/inventory/inventory-selection.ts`
- Modify: `src/application/inventory/item-inventory.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `tests/unified-backpack-inventory.test.cjs`
- Read: `src/domain/equipment/equipment-loadout-service.ts`

**Interfaces:**
- Consumes:
  - `EquipmentLoadoutService`
  - `ValuableItemInventory.equippedSlots`
- Produces:
  - `equipValuableItem(inventory: ValuableItemInventory, valuableId: ValuableItemId): ValuableItemInventory`
  - unified backpack item action id `equip.valuable`
  - backpack row metadata fields:
    - `equipSlotId?: EquipmentSlotId`
    - `isEquipped?: boolean`
    - `equippedLabel?: string`
    - `canEquip?: boolean`

- [ ] **Step 1: Write the failing inventory and projection tests**

Extend `tests/unified-backpack-inventory.test.cjs` with failing assertions like:

```js
test("dispatches a unified valuable equip action across all four equipment slots", () => {
  const inventory = {
    items: [
      { id: "valuable.sword", category: "weapon", ownedCount: 1, name: "铁刀", price: 8, kindText: "刀剑", itemImageId: "", description: "test" },
      { id: "valuable.armor", category: "armor", ownedCount: 1, name: "旧甲", price: 12, kindText: "铠甲", itemImageId: "", description: "test" },
      { id: "valuable.accessory", category: "accessory", ownedCount: 1, name: "香囊", price: 4, kindText: "饰品", itemImageId: "", description: "test" },
      { id: "valuable.mount", category: "mount", ownedCount: 1, name: "黄骠马", price: 20, kindText: "坐骑", itemImageId: "", description: "test" },
    ],
    selectedItemId: "valuable.sword",
    equippedSlots: { weapon: null, armor: null, accessory: null, mount: null },
  };

  const result = applyBackpackItemAction({
    valuableInventory: inventory,
    itemId: "valuable.accessory",
    actionId: "equip.valuable",
  });

  assert.equal(result.valuableInventory.equippedSlots.accessory, "valuable.accessory");
  assert.equal(result.status, "applied");
});
```

Add a second failing test that requires the projected `equipment` rows to list equipped items first and to expose `isEquipped === true` for equipped rows.

- [ ] **Step 2: Run the targeted projection tests and confirm they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs }
```

Expected:

- `FAIL` because backpack actions still use `equip.weapon / equip.armor` and the projection has no slot-aware equipped metadata.

- [ ] **Step 3: Implement unified equip application and slot-aware backpack projection**

Update `inventory-selection.ts` so `equipValuableItem()` delegates to `EquipmentLoadoutService`.

Update `item-inventory.ts` so equipment rows project:

```ts
actions: [{ id: "equip.valuable", label: "装备" }]
```

and so projected rows compute:

```ts
equipSlotId,
isEquipped,
equippedLabel: isEquipped ? "已装备" : "",
canEquip: true,
```

Then sort `equipment` rows by:

```ts
isEquipped desc,
slotDefinition.sortOrder asc,
item.sortWeight asc when present,
item.name locale order
```

Keep non-equipment filters unchanged.

Update `src/domain/item.ts` so the shared backpack contract can represent:

```ts
export type ItemActionId = "equip.valuable" | "consume.food" | "consume.medicine" | "submit.quest" | string;

export type BackpackItemDefinition = {
  // existing fields...
  equipSlotId?: EquipmentSlotId;
  isEquipped?: boolean;
  equippedLabel?: string;
  canEquip?: boolean;
};
```

- [ ] **Step 4: Run the targeted projection tests and confirm they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/application/inventory/inventory-selection.ts src/application/inventory/item-inventory.ts src/application/app-actions.ts tests/unified-backpack-inventory.test.cjs
git commit -m "feat: unify equipment actions and backpack projection"
```

## Task 3: Valuables And Character Detail Equipment Presentation

**Files:**
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/valuables/valuable-library-view.ts`
- Modify: `src/ui/views/character/character-detail-view.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/valuables.json` if accessory/mount items are absent from the startup content
- Modify: `tests/robustness.test.cjs`
- Read: `src/domain/equipment/equipment-loadout-service.ts`

**Interfaces:**
- Consumes:
  - `getEquippedItemId(...)`
  - `isItemEquipped(...)`
  - slot labels from `EquipmentSlotRegistry`
- Produces:
  - four-slot equipment summary in valuables UI
  - character-detail fields backed by `weapon / armor / accessory / mount`

- [ ] **Step 1: Write the failing character-detail and valuables source tests**

Extend `tests/robustness.test.cjs` with failing source assertions that require:

```js
test("character detail source renders 饰品 and 坐骑 equipment labels", () => {
  const source = readSource("src/ui/views/character/character-detail-view.ts");

  assert.match(source, />饰品</);
  assert.match(source, />坐骑</);
  assert.doesNotMatch(source, />所属流派</);
  assert.doesNotMatch(source, />武艺师傅</);
});
```

Also add a failing valuables-source assertion that requires the valuables summary to render all four slot labels and to read equipped state through the shared loadout rather than direct `swordId / armorId` strings.

- [ ] **Step 2: Run the targeted UI/source tests and confirm they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "character detail source renders 饰品 and 坐骑 equipment labels|valuable library renders four-slot equipment summary" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the source still renders `所属流派 / 武艺师傅` and valuables only knows weapon/armor.

- [ ] **Step 3: Implement four-slot valuables and character-detail presentation**

Update `src/ui/app-render.ts` so it resolves equipped item names through shared equipment helpers and passes:

```ts
accessoryName: resolvedAccessory ?? "无",
mountName: resolvedMount ?? "无",
weaponName: resolvedWeapon ?? "无",
armorName: resolvedArmor ?? "无",
```

Update `character-detail-view.ts` to render:

```html
<span class="c-character-detail__label">饰品</span>
<span class="c-character-detail__label">坐骑</span>
<span class="c-character-detail__label">装备武器</span>
<span class="c-character-detail__label">装备防具</span>
```

Update `valuable-library-view.ts` to render summary rows for `武器 / 防具 / 饰品 / 坐骑`, to display `未装备` for empty slots, and to use `isItemEquipped(...)` and `getEquippedItemId(...)` instead of direct `weapon`/`armor` field branching.

If the startup content still has no `accessory` or `mount` valuables after the state migration, add one visible testable item of each type to `src/content/scenario-packs/zhuyuanzhang/valuables.json` so the running game can exercise backpack equip behavior for all four slots.

- [ ] **Step 4: Run the targeted UI/source tests and confirm they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "character detail source renders 饰品 and 坐骑 equipment labels|valuable library renders four-slot equipment summary" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/app-render.ts src/ui/views/valuables/valuable-library-view.ts src/ui/views/character/character-detail-view.ts tests/robustness.test.cjs
git commit -m "feat: render unified equipment slots in ui"
```

## Task 4: Backpack UI Contract And Change Log

**Files:**
- Modify: `src/ui/views/inventory/backpack-view.ts`
- Modify: `tests/backpack-ui-contract.test.cjs`
- Modify: `docs/change-log.md`
- Read: `src/application/inventory/item-inventory.ts`

**Interfaces:**
- Consumes:
  - projected row fields `isEquipped`, `equippedLabel`, `equipSlotId`, `canEquip`
- Produces:
  - backpack HTML contract with `已装备` markers and unified equip action ids

- [ ] **Step 1: Write the failing backpack UI contract tests**

Extend `tests/backpack-ui-contract.test.cjs` with a failing case like:

```js
test("backpack view marks equipped equipment rows and uses the unified equip action id", () => {
  const html = renderBackpackView({
    filter: "equipment",
    selectedItemId: "valuable.accessory",
    items: [
      {
        id: "valuable.accessory",
        name: "香囊",
        icon: null,
        value: 4,
        types: ["equipment", "accessory"],
        count: 1,
        description: "test",
        actions: [{ id: "equip.valuable", label: "装备" }],
        equipSlotId: "accessory",
        isEquipped: true,
        equippedLabel: "已装备",
        canEquip: true,
      },
    ],
  });

  assert.match(html, /已装备/);
  assert.match(html, /data-item-action-id="equip\.valuable"/);
});
```

Add a second failing assertion that the equipped marker appears in the rendered row or detail block without requiring a separate valuables overlay.

- [ ] **Step 2: Run the targeted backpack UI tests and confirm they fail**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/backpack-ui-contract.test.cjs }
```

Expected:

- `FAIL` because the backpack view does not yet render slot-aware equipped markers or the new action id.

- [ ] **Step 3: Implement the backpack UI contract and record the migration**

Update `backpack-view.ts` so equipped rows render `已装备` from projected metadata and continue using the shared `run-backpack-item-action` event path with:

```html
data-item-action-id="equip.valuable"
```

Then append a `docs/change-log.md` entry that records:

- the new four-slot equipment registry/loadout
- the `equippedWeaponSet` to `equippedSlots` migration
- backpack equipped markers and equipped-first equipment ordering
- character-detail `饰品 / 坐骑` presentation

- [ ] **Step 4: Run the targeted backpack UI tests and confirm they pass**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/backpack-ui-contract.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/inventory/backpack-view.ts tests/backpack-ui-contract.test.cjs docs/change-log.md
git commit -m "feat: show equipped state in backpack ui"
```

## Task 5: Full Verification And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-30-unified-equipment-slot-plan.md`
- Modify: `docs/superpowers/project-progress.md` only if this child is promoted into the active queue during execution

- [ ] **Step 1: Run the full targeted verification bundle**

Run:

```bash
npm run lint:plans
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/equipment-slot-domain.test.cjs tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "character detail source renders 饰品 and 坐骑 equipment labels|valuable library renders four-slot equipment summary|opening and closing character detail resets the ability detail popup state" tests/robustness.test.cjs }
npm run typecheck
npm run build
```

Expected:

- `PASS`

- [ ] **Step 2: Update the plan execution state and progress log**

Set:

- `Status` to `completed-but-open` when implementation is done but push/closeout is still pending
- `Verification` to the exact command set that passed
- append a dated `Progress Log` entry summarizing the completed equipment-slot migration

- [ ] **Step 3: Commit the governance/documentation sync**

```bash
git add docs/superpowers/plans/2026-07-30-unified-equipment-slot-plan.md docs/superpowers/project-progress.md
git commit -m "docs: update equipment slot plan execution state"
```

## Exit Check

- [ ] `weapon / armor / accessory / mount` all use the same slot registry and loadout service.
- [ ] `equippedWeaponSet` is removed from active code paths.
- [ ] Backpack equipment rows use `equip.valuable` and render `已装备`.
- [ ] Character detail renders `饰品 / 坐骑 / 装备武器 / 装备防具` from shared equipment state.
- [ ] Valuables summary renders all four slots from shared loadout state.
- [ ] TDD evidence is recorded in the task steps and targeted verification passes.
- [ ] `docs/change-log.md` is updated.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `none`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `waiting`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Choose execution mode and begin Task 1.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-unified-equipment-slot-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md only if this child is promoted into the active queue; otherwise resume directly from this plan and start Task 1.`
