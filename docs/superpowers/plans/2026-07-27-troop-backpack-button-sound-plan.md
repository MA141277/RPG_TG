# Troop And Backpack Button Sound Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved heavy/light button sound policy to troop entry, backpack entry, backpack internals, troop-editor controls, and troop-management confirmation flows using the existing shared button-sound system, including heavy backpack equip actions and reliable playback for declarative buttons that stop click bubbling.

**Architecture:** Keep sound routing declarative at render time through `data-button-sound` and avoid adding any troop-specific or backpack-specific sound branches to `src/main.ts`. Add one troop-view-local sound policy helper for troop-editor and troop-management templates, one backpack-local action sound policy helper for equip-vs-non-equip behavior, and keep the event layer generic by resolving declarative click cues centrally before bubbling can be stopped.

**Tech Stack:** TypeScript, Vite, Node test runner, CommonJS compiled test output under `.test-dist`, existing rendered-view helpers, `npm run lint:plans`, `npm run build:test`, `node --test`, `npm run typecheck`, and `npm run build`.

## Global Constraints

- `sound choice stays declarative at the rendered button level through data-button-sound`
- `src/main.ts may keep generic event dispatch only and must not gain troop-specific or backpack-specific sound branches`
- `entry intensity and confirmation intensity are separate concerns: entering major panels can be heavy; in-panel navigation and cancellation stay light`
- `confirmation dialogs must follow one consistent rule: affirmative or forward action is heavy; cancel, close, back, and acknowledgement are light`
- `identical action ids do not imply identical sound across all contexts; context-specific markup remains authoritative`
- `only the troop-editor menu entry to open-troop-management is heavy; troop-management troop-switch buttons using the same action id remain light`

---

## Execution State

- Status: `running`
- Last Updated: `2026-07-27`
- Current Focus: `Record the backpack-equip and stopPropagation click-routing follow-up while the elevated Vite build exit code remains unresolved for final closeout.`
- Next Step: `Review or replay the broader verification sweep if the owner wants to close this child after the new backpack equip and troop-management click-routing follow-up.`
- Follow-up Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs tests/button-sound.test.cjs tests/city-button-sound-contract.test.cjs` passed with 21 tests, 21 pass, 0 fail.
- Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'tools/lint-superpowers-plans.mjs'` passed; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs` passed with 16 tests, 16 pass, 0 fail; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit -p tsconfig.json` passed; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\vite\bin\vite.js' build` printed `✓ built in 4.48s` but exited with `-1073740791` under the elevated shell.
- Notes: `This follow-up keeps cue ids and overlap rules unchanged, but adds a backpack-local equip sound policy helper and moves declarative click-sound routing onto a generic capture-phase resolver so buttons that stop bubbling still play their assigned sounds.`

## Progress Log

- 2026-07-27
  - Summary: `Created the implementation plan for the approved troop/backpack button sound spec.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'tools/lint-superpowers-plans.mjs'`
  - Next: `Choose execution approach, then start Task 1 with the failing entry/backpack contract tests.`
- 2026-07-27
  - Summary: `Wired heavy sound declarations for map troop/backpack entry and character-detail backpack entry, and wired light sound declarations for backpack filter, item, action, and close buttons.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs` passed with 9 tests, 9 pass, 0 fail.
  - Next: `Start Task 2 with the troop-editor rendered-html tests.`
- 2026-07-27
  - Summary: `Added a shared troop button-sound policy helper, wired troop-editor menu, shop, card, dismiss, confirm, and alert buttons to declarative light/heavy polarity, and stabilized the party-editor source test harness around the current template structure.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/party-editor-ui-source.test.cjs` passed with 7 tests, 7 pass, 0 fail.
  - Next: `Finish the troop-management sound policy markup on the same shared helper and rerun the party-editor suite.`
- 2026-07-27
  - Summary: `Extended the shared troop button-sound policy into troop-management, keeping browsing actions light while marking reserve assignment and confirm-side actions heavy.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/party-editor-ui-source.test.cjs` passed with 7 tests, 7 pass, 0 fail.
  - Next: `Run the final verification sweep for property, backpack, and party-editor button-sound coverage.`
- 2026-07-27
  - Summary: `Final verification passed for plan lint, the targeted property/backpack/party-editor test suite, and TypeScript typecheck, while the elevated Vite build printed a successful build but still exited with Windows code -1073740791.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'tools/lint-superpowers-plans.mjs'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json`; `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit -p tsconfig.json`; `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\vite\bin\vite.js' build`
  - Next: `Resolve or waive the abnormal elevated Vite build exit before closing out this child plan.`
- 2026-07-27
  - Summary: `Promoted backpack equip actions to heavy via a backpack-local sound policy helper, expanded troop-management markup assertions to cover the full action list, and moved declarative click-sound routing to a generic capture-phase resolver so stopPropagation-backed troop-management buttons still play their configured sounds.`
  - Verification: `& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs tests/button-sound.test.cjs tests/city-button-sound-contract.test.cjs`
  - Next: `Replay the broader typecheck/build closeout sweep if the owner wants to close this child instead of leaving the Vite exit anomaly as the remaining open verifier.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-troop-backpack-button-sound-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `src/ui/views/map/map-view.ts` still renders `open-troop-editor` and `open-backpack` without explicit button-sound markup.
  - `src/ui/views/character/character-detail-view.ts` still renders `open-backpack` as `data-button-sound="light"`.
  - `src/ui/views/inventory/backpack-view.ts` keeps the close button on `light`, but filter chips, item selectors, and item actions still have no explicit sound assignment.
  - `src/ui/views/troop-editor/troop-editor-view.ts` and `src/ui/views/troop-editor/troop-management-view.ts` render their menu, prompt, and confirm buttons without the requested `heavy confirm / light cancel-back` polarity.
  - `tests/property-panel-button-sound-contract.test.cjs`, `tests/backpack-ui-contract.test.cjs`, and `tests/party-editor-ui-source.test.cjs` already cover these surfaces and should be extended instead of creating duplicate contract suites.
  - `docs/superpowers/project-progress.md` currently points to `docs/superpowers/plans/2026-07-21-unified-backpack-inventory-plan.md`, so this plan should not claim active-child ownership until execution actually begins.

## Implementation Scope

### In Scope

- Mark the map `部队` and `背包` entry buttons as `heavy`.
- Change the character-detail `背包` button from `light` to `heavy`.
- Keep backpack browsing controls and non-equip actions `light`, but promote equip actions to `heavy` through a backpack-local sound policy helper.
- Add a local troop button sound policy helper and use it from `troop-editor-view.ts` and `troop-management-view.ts`.
- Lock the above behavior with the existing property/backpack/party-editor test files.

### Still Out Of Scope

- Any new audio cue id, playback overlap rule, or audio-controller change.
- Any troop-specific or backpack-specific event-layer sound branch in `src/main.ts`; the click router must stay generic and declarative.
- Reclassifying unrelated city, house, dialogue, or card-library buttons outside the approved scope.
- Cleaning up the stale project-progress child unless execution of this plan is explicitly started.

## File Map

### Existing files to modify

- `src/ui/views/map/map-view.ts`
  - Add explicit heavy sound markup to the map `部队` and `背包` entry buttons.
- `src/ui/views/character/character-detail-view.ts`
  - Change the character-detail `背包` button from light to heavy while leaving card/return buttons unchanged.
- `src/ui/views/inventory/backpack-view.ts`
  - Add light button-sound markup to filter chips, item selectors, and non-equip item actions, while deferring equip action polarity to a backpack-local policy helper and keeping the overlay return button light.
- `src/ui/views/inventory/backpack-button-sound-policy.ts`
  - Export the local backpack action sound policy so equip actions stay centralized and reusable.
- `src/application/audio/button-sound.ts`
  - Add a shared declarative click-cue resolver that prioritizes enter sound, then button tone, then generic UI click fallback.
- `src/main.ts`
  - Use the shared declarative click-cue resolver from a capture-phase click listener so configured sounds still play even when later handlers stop bubbling.
- `src/ui/views/troop-editor/troop-editor-view.ts`
  - Call the troop-editor sound policy helper when rendering menu buttons, troop cards, shop buttons, prompts, confirms, and alert close.
- `src/ui/views/troop-editor/troop-management-view.ts`
  - Call the troop-management sound policy helper when rendering troop-switch buttons, management actions, reserve prompts, confirms, and alert close.
- `tests/property-panel-button-sound-contract.test.cjs`
  - Assert heavy entry sounds for map troop/backpack entry and character-detail backpack.
- `tests/backpack-ui-contract.test.cjs`
  - Assert backpack filter, item, non-equip action, and close buttons are light while equip actions are heavy.
- `tests/party-editor-ui-source.test.cjs`
  - Render troop-editor and troop-management HTML and assert the approved heavy/light polarity across the full troop-management action list.
- `tests/button-sound.test.cjs`
  - Lock the shared click-cue resolver priority between enter, button, and fallback UI click.
- `tests/city-button-sound-contract.test.cjs`
  - Lock the main click wiring onto the shared capture-phase click-cue resolver.
- `docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md`
  - Track execution state, progress log, and verification results during implementation.

### Existing files expected to be deleted

- None.

### New files to create

- `src/ui/views/troop-editor/troop-button-sound-policy.ts`
  - Export troop-editor and troop-management sound policy helpers so both views share one local, declarative rule set.
- `src/ui/views/inventory/backpack-button-sound-policy.ts`
  - Export the backpack action sound policy helper so equip and non-equip actions stay centralized.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs }`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Entry Buttons And Backpack Overlay Sounds

**Files:**
- Modify: `src/ui/views/map/map-view.ts`
- Modify: `src/ui/views/character/character-detail-view.ts`
- Modify: `src/ui/views/inventory/backpack-view.ts`
- Modify: `tests/property-panel-button-sound-contract.test.cjs`
- Modify: `tests/backpack-ui-contract.test.cjs`

**Interfaces:**
- Consumes:
  - `renderBackpackView(input: { items: BackpackItemDefinition[]; filter: BackpackItemCategoryFilter; selectedItemId: string | null; }): string`
  - `data-action="open-troop-editor"`
  - `data-action="open-backpack"`
  - `data-action="close-overlay"`
- Produces:
  - map `open-troop-editor` button with `data-button-sound="heavy"`
  - map `open-backpack` button with `data-button-sound="heavy"`
  - character-detail `open-backpack` button with `data-button-sound="heavy"`
  - backpack filter, item, action, and close buttons with `data-button-sound="light"`

- [x] **Step 1: Write the failing entry/backpack contract tests**

Extend `tests/property-panel-button-sound-contract.test.cjs` and `tests/backpack-ui-contract.test.cjs` with assertions like these:

```js
test("map and character-detail entry buttons declare heavy sounds for troop and backpack entry", () => {
  const mapSource = readSource("src/ui/views/map/map-view.ts");
  const characterDetailSource = readSource("src/ui/views/character/character-detail-view.ts");

  assert.match(
    mapSource,
    /data-action="open-troop-editor"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    mapSource,
    /data-action="open-backpack"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    characterDetailSource,
    /data-action="open-backpack"[\s\S]*data-button-sound="heavy"/
  );
});

test("backpack view marks every interactive button as light", () => {
  const html = renderBackpackView({
    filter: "all",
    selectedItemId: "item.weapon",
    items: [
      {
        id: "item.weapon",
        name: "Weapon",
        icon: "/ui/items/sword.png",
        value: 8,
        types: ["equipment", "weapon"],
        count: 1,
        description: "test",
        actions: [{ id: "equip.weapon", label: "Equip" }],
      },
    ],
  });

  assert.match(
    html,
    /<button[^>]*data-backpack-filter="equipment"[^>]*data-button-sound="light"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-backpack-item-id="item\.weapon"[^>]*data-button-sound="light"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-action="run-backpack-item-action"[^>]*data-button-sound="light"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-action="close-overlay"[^>]*data-button-sound="light"[^>]*>/
  );
});
```

- [x] **Step 2: Run the targeted tests to verify they fail**

Run:

```bash
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs }
```

Expected:

- `FAIL` because the map entry buttons are missing heavy markup, the character-detail backpack button is still light, and backpack filter/item/action buttons still have no explicit sound assignment.

- [x] **Step 3: Implement the entry and backpack markup changes**

Apply these exact markup additions:

```ts
// src/ui/views/map/map-view.ts
<button
  type="button"
  class="c-map-troop-editor-entry c-button c-grain-shop-button c-grain-shop-button--gold"
  data-action="open-troop-editor"
  data-button-sound="heavy"
>

<button
  class="c-campaign-map-actions__button"
  type="button"
  data-action="open-backpack"
  data-button-sound="heavy"
>

// src/ui/views/character/character-detail-view.ts
<button ... type="button" data-action="open-backpack" data-button-sound="heavy">

// src/ui/views/inventory/backpack-view.ts
<button
  class="c-filter-chip ${input.filter === filterKey ? "is-active" : ""}"
  type="button"
  data-backpack-filter="${filterKey}"
  data-button-sound="light"
>

<button
  class="c-library-table__select c-backpack-table__select"
  type="button"
  data-backpack-item-id="${item.id}"
  data-button-sound="light"
>

<button
  class="c-button"
  type="button"
  data-action="run-backpack-item-action"
  data-backpack-item-id="${selectedItem.id}"
  data-item-action-id="${action.id}"
  data-button-sound="light"
  ${action.disabled === true ? "disabled" : ""}
>
```

- [x] **Step 4: Run the targeted tests to verify they pass**

Run:

```bash
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 5: Sync this plan after the entry/backpack batch lands**

Update this plan in the same change set:

- mark Task 1 checkboxes complete
- set `Execution State.Status` to `running`
- set `Execution State.Current Focus` to `Implement the troop-editor sound policy helper and rendered markup.`
- set `Execution State.Next Step` to `Start Task 2 with the troop-editor rendered-html tests.`
- append a `Progress Log` entry summarizing the heavy map/character entry wiring, light backpack button wiring, and the focused test command

- [x] **Step 6: Commit the entry/backpack batch**

Run:

```bash
git add src/ui/views/map/map-view.ts src/ui/views/character/character-detail-view.ts src/ui/views/inventory/backpack-view.ts tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md
git commit -m "feat: wire troop and backpack entry sounds"
```

## Task 2: Troop-Editor Sound Policy

**Files:**
- Create: `src/ui/views/troop-editor/troop-button-sound-policy.ts`
- Modify: `src/ui/views/troop-editor/troop-editor-view.ts`
- Modify: `tests/party-editor-ui-source.test.cjs`

**Interfaces:**
- Consumes:
  - `renderTroopEditorView(model: TroopEditorStageViewModel): string`
  - `data-action="open-troop-management"`
  - `data-action="close-troop-editor"`
  - `data-troop-editor-shop-prompt-action="buy" | "cancel"`
  - `data-troop-editor-create-choice="confirm" | "cancel"`
  - `data-troop-editor-dismiss-prompt-action="dismiss" | "back"`
  - `data-troop-editor-dismiss-confirm-choice="confirm" | "cancel"`
  - `data-troop-editor-confirm-choice="confirm" | "cancel"`
- Produces:
  - `type TroopEditorButtonSoundInput = ...`
  - `getTroopEditorButtonSound(input: TroopEditorButtonSoundInput): "light" | "heavy"`
  - troop-editor rendered buttons with approved `data-button-sound` polarity

- [x] **Step 1: Write the failing troop-editor rendered-html tests**

Extend `tests/party-editor-ui-source.test.cjs` with a rendered troop-editor fixture and assertions like these:

```js
const {
  renderTroopEditorView,
} = require("../.test-dist/ui/views/troop-editor/troop-editor-view.js");

const PREVIEW_SLOTS = [
  "rear-left",
  "middle-left",
  "front-left",
  "rear-center",
  "middle-center",
  "front-center",
  "rear-right",
  "middle-right",
  "front-right",
].map((slotKey) => ({
  slotKey,
  label: slotKey,
  role: null,
  isOccupied: false,
}));

function createTroopEditorHtml() {
  return renderTroopEditorView({
    title: "troop-editor",
    resources: [],
    troops: [{ id: "troop.a", name: "Troop A", subtitle: "", slots: PREVIEW_SLOTS }],
    reserveMembers: [{ id: "reserve.a", name: "Reserve A", roleLabel: "infantry" }],
    shopOffers: [
      {
        id: "offer.a",
        name: "Offer A",
        roleLabel: "cavalry",
        price: 100,
        priceText: "100",
        requiredFame: 0,
        requiredFameText: "0",
      },
    ],
    menu: [
      { id: "manage", label: "manage", actionId: "open-troop-management" },
      { id: "create", label: "create", actionId: null },
      { id: "exit", label: "exit", actionId: "close-troop-editor" },
    ],
    selectedTroopId: "troop.a",
    selectedMenuId: "manage",
    reserveCount: 1,
    reserveCapacity: 6,
    playerGold: 100,
    playerFame: 0,
  });
}

test("troop-editor applies heavy only to the manage entry and confirm-side actions", () => {
  const html = createTroopEditorHtml();

  assert.match(html, /data-action="open-troop-management"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-action="close-troop-editor"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-card[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-shop-offer="offer\.a"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-shop-prompt-action="buy"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-editor-shop-prompt-action="cancel"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-shop-back[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-create-choice="confirm"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-editor-create-choice="cancel"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-dismiss-member="reserve\.a"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-dismiss-prompt-action="dismiss"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-editor-dismiss-prompt-action="back"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-dismiss-confirm-choice="confirm"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-editor-dismiss-confirm-choice="cancel"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-confirm-choice="confirm"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-editor-confirm-choice="cancel"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-editor-alert-close[\s\S]*data-button-sound="light"/);
});
```

- [x] **Step 2: Run the troop-editor tests to verify they fail**

Run:

```bash
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/party-editor-ui-source.test.cjs }
```

Expected:

- `FAIL` because troop-editor buttons, prompts, and confirms do not yet emit the requested `data-button-sound` values.

- [x] **Step 3: Implement the troop-editor sound policy helper and markup**

Create `src/ui/views/troop-editor/troop-button-sound-policy.ts` with this exact first-pass API:

```ts
export type TroopEditorButtonSoundInput =
  | { kind: "menu"; menuId: string; actionId: string | null }
  | { kind: "troop-card" }
  | { kind: "shop-offer" }
  | { kind: "shop-prompt"; action: "buy" | "cancel" }
  | { kind: "shop-back" }
  | { kind: "create-choice"; choice: "confirm" | "cancel" }
  | { kind: "dismiss-member" }
  | { kind: "dismiss-prompt"; action: "dismiss" | "back" }
  | { kind: "dismiss-confirm"; choice: "confirm" | "cancel" }
  | { kind: "confirm-choice"; choice: "confirm" | "cancel" }
  | { kind: "alert-close" };

export function getTroopEditorButtonSound(
  input: TroopEditorButtonSoundInput
): "light" | "heavy" {
  if (input.kind === "menu") {
    return input.actionId === "open-troop-management" ? "heavy" : "light";
  }
  if (input.kind === "shop-prompt") {
    return input.action === "buy" ? "heavy" : "light";
  }
  if (input.kind === "create-choice") {
    return input.choice === "confirm" ? "heavy" : "light";
  }
  if (input.kind === "dismiss-prompt") {
    return input.action === "dismiss" ? "heavy" : "light";
  }
  if (input.kind === "dismiss-confirm") {
    return input.choice === "confirm" ? "heavy" : "light";
  }
  if (input.kind === "confirm-choice") {
    return input.choice === "confirm" ? "heavy" : "light";
  }
  return "light";
}
```

Then use it from `src/ui/views/troop-editor/troop-editor-view.ts` like this:

```ts
import { getTroopEditorButtonSound } from "./troop-button-sound-policy";

<button
  type="button"
  class="c-button c-troop-editor__menu-button${button.id === model.selectedMenuId ? " is-selected" : ""}"
  ${button.actionId == null ? "disabled" : ""}
  ${button.actionId == null ? "" : `data-action="${button.actionId}"`}
  data-button-sound="${getTroopEditorButtonSound({
    kind: "menu",
    menuId: button.id,
    actionId: button.actionId,
  })}"
>

<article
  class="c-troop-editor__troop-card${troop.id === model.selectedTroopId ? " is-selected" : ""}"
  data-troop-editor-card
  data-troop-id="${troop.id}"
  data-button-sound="${getTroopEditorButtonSound({ kind: "troop-card" })}"
  role="button"
  tabindex="0"
>
```

Apply the same helper to the shop offer buttons, shop prompt buttons, create dialog buttons, dismiss member/prompt/confirm buttons, generic confirm buttons, and alert close button.

- [x] **Step 4: Run the troop-editor tests to verify they pass**

Run:

```bash
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/party-editor-ui-source.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 5: Sync this plan after the troop-editor batch lands**

Update this plan in the same change set:

- mark Task 2 checkboxes complete
- keep `Execution State.Status` as `running`
- set `Execution State.Current Focus` to `Implement the troop-management sound policy helper and rendered markup.`
- set `Execution State.Next Step` to `Start Task 3 with the troop-management rendered-html tests.`
- append a `Progress Log` entry summarizing the new troop-editor policy helper, rendered markup assignments, and focused test command

- [ ] **Step 6: Commit the troop-editor batch**

Run:

```bash
git add src/ui/views/troop-editor/troop-button-sound-policy.ts src/ui/views/troop-editor/troop-editor-view.ts tests/party-editor-ui-source.test.cjs docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md
git commit -m "feat: add troop editor button sounds"
```

## Task 3: Troop-Management Sound Policy

**Files:**
- Modify: `src/ui/views/troop-editor/troop-button-sound-policy.ts`
- Modify: `src/ui/views/troop-editor/troop-management-view.ts`
- Modify: `tests/party-editor-ui-source.test.cjs`

**Interfaces:**
- Consumes:
  - `renderTroopManagementView(model: TroopManagementStageViewModel): string`
  - `getTroopEditorButtonSound(input: TroopEditorButtonSoundInput): "light" | "heavy"`
  - `data-troop-management-reserve-prompt-action="assign" | "back"`
  - `data-troop-management-remove-confirm-choice="confirm" | "cancel"`
  - `data-action="close-troop-management"`
- Produces:
  - `type TroopManagementButtonSoundInput = ...`
  - `getTroopManagementButtonSound(input: TroopManagementButtonSoundInput): "light" | "heavy"`
  - troop-management rendered buttons with approved `data-button-sound` polarity

- [x] **Step 1: Write the failing troop-management rendered-html tests**

Extend `tests/party-editor-ui-source.test.cjs` with a rendered troop-management fixture and assertions like these:

```js
const {
  renderTroopManagementView,
} = require("../.test-dist/ui/views/troop-editor/troop-management-view.js");

const PREVIEW_SLOTS = [
  "rear-left",
  "middle-left",
  "front-left",
  "rear-center",
  "middle-center",
  "front-center",
  "rear-right",
  "middle-right",
  "front-right",
].map((slotKey, index) => ({
  slotKey,
  label: slotKey,
  role: null,
  isOccupied: false,
  row: Math.floor(index / 3),
  column: index % 3,
}));

function createTroopManagementHtml() {
  return renderTroopManagementView({
    title: "troop-management",
    resources: [],
    troops: [{ id: "troop.a", name: "Troop A", subtitle: "", slots: PREVIEW_SLOTS }],
    previousTroopId: "troop.b",
    nextTroopId: "troop.b",
    canCycleTroops: true,
    selectedTroopId: "troop.a",
    troopName: "Troop A",
    previewSlots: PREVIEW_SLOTS.map(({ row, column, ...slot }) => slot),
    actions: [
      { id: "move", label: "move", actionId: null },
      { id: "add", label: "add", actionId: null },
      { id: "remove", label: "remove", actionId: null },
      { id: "clear", label: "clear", actionId: null },
      { id: "disband", label: "disband", actionId: null },
      { id: "back", label: "back", actionId: "close-troop-management" },
    ],
    summaryFields: [],
    battlefieldSlots: PREVIEW_SLOTS,
    battlefieldUnits: [],
    battlePreview: {
      id: "troop.a",
      name: "Troop A",
      side: "player",
      generalName: "General",
      morale: 80,
      members: [],
    },
    reserveMembers: [{ id: "reserve.a", name: "Reserve A", roleLabel: "infantry" }],
    reserveCapacity: 6,
  });
}

test("troop-management keeps browsing light and only makes reserve/confirm commit actions heavy", () => {
  const html = createTroopManagementHtml();

  assert.match(html, /data-action="open-troop-management"[\s\S]*data-button-sound="light"/);
  assert.match(html, /c-troop-management__cycle-button--left[\s\S]*data-button-sound="light"/);
  assert.match(html, /c-troop-management__cycle-button--right[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-management-action="move"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-action="close-troop-management"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-management-reserve-member="reserve\.a"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-management-reserve-prompt-action="assign"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-management-reserve-prompt-action="back"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-management-reserve-close[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-management-remove-confirm-choice="confirm"[\s\S]*data-button-sound="heavy"/);
  assert.match(html, /data-troop-management-remove-confirm-choice="cancel"[\s\S]*data-button-sound="light"/);
  assert.match(html, /data-troop-management-alert-close[\s\S]*data-button-sound="light"/);
});
```

- [ ] **Step 2: Run the troop-management tests to verify they fail**

Run:

```bash
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/party-editor-ui-source.test.cjs }
```

Expected:

- `FAIL` because troop-management buttons still render without the required sound polarity.

- [x] **Step 3: Implement the troop-management sound policy helper and markup**

Extend `src/ui/views/troop-editor/troop-button-sound-policy.ts` with this exact second export:

```ts
export type TroopManagementButtonSoundInput =
  | { kind: "troop-card" }
  | { kind: "cycle" }
  | { kind: "action"; actionId: string; dataAction: string | null }
  | { kind: "reserve-member" }
  | { kind: "reserve-prompt"; action: "assign" | "back" }
  | { kind: "reserve-close" }
  | { kind: "remove-confirm"; choice: "confirm" | "cancel" }
  | { kind: "alert-close" };

export function getTroopManagementButtonSound(
  input: TroopManagementButtonSoundInput
): "light" | "heavy" {
  if (input.kind === "reserve-prompt") {
    return input.action === "assign" ? "heavy" : "light";
  }
  if (input.kind === "remove-confirm") {
    return input.choice === "confirm" ? "heavy" : "light";
  }
  return "light";
}
```

Then use it from `src/ui/views/troop-editor/troop-management-view.ts` like this:

```ts
import { getTroopManagementButtonSound } from "./troop-button-sound-policy";

<article
  class="c-troop-editor__troop-card${troop.id === model.selectedTroopId ? " is-selected" : ""}"
  data-action="open-troop-management"
  data-troop-id="${troop.id}"
  data-button-sound="${getTroopManagementButtonSound({ kind: "troop-card" })}"
  role="button"
  tabindex="0"
>

<button
  type="button"
  class="c-troop-management__cycle-button c-troop-management__cycle-button--left"
  ${
    model.canCycleTroops && model.previousTroopId != null
      ? `data-action="open-troop-management" data-troop-id="${model.previousTroopId}" data-button-sound="${getTroopManagementButtonSound({ kind: "cycle" })}"`
      : "disabled"
  }
>

<button
  type="button"
  class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button"
  data-troop-management-reserve-prompt-action="assign"
  data-button-sound="${getTroopManagementButtonSound({
    kind: "reserve-prompt",
    action: "assign",
  })}"
>
```

Apply the same helper to the management action list, reserve-member buttons, reserve close button, remove-confirm buttons, and alert close button.

- [x] **Step 4: Run the troop-management tests to verify they pass**

Run:

```bash
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/party-editor-ui-source.test.cjs }
```

Expected:

- `PASS`

- [x] **Step 5: Sync this plan after the troop-management batch lands**

Update this plan in the same change set:

- mark Task 3 checkboxes complete
- keep `Execution State.Status` as `running`
- set `Execution State.Current Focus` to `Run final verification and record closeout-ready state for the troop/backpack button sound batch.`
- set `Execution State.Next Step` to `Start Task 4 with the final verification sweep.`
- append a `Progress Log` entry summarizing the shared troop button sound policy helper, troop-management markup assignments, and focused test command

- [ ] **Step 6: Commit the troop-management batch**

Run:

```bash
git add src/ui/views/troop-editor/troop-button-sound-policy.ts src/ui/views/troop-editor/troop-management-view.ts tests/party-editor-ui-source.test.cjs docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md
git commit -m "feat: add troop management button sounds"
```

## Task 4: Final Verification And Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md`

**Interfaces:**
- Consumes:
  - heavy map/troop/backpack entry markup from Task 1
  - `getTroopEditorButtonSound(input: TroopEditorButtonSoundInput): "light" | "heavy"`
  - `getTroopManagementButtonSound(input: TroopManagementButtonSoundInput): "light" | "heavy"`
  - updated contract tests in `tests/property-panel-button-sound-contract.test.cjs`
  - updated contract tests in `tests/backpack-ui-contract.test.cjs`
  - updated rendered-html tests in `tests/party-editor-ui-source.test.cjs`
- Produces:
  - final `Execution State`, `Progress Log`, `Completion Checklist`, and `Child Closeout` updates for a `completed-but-open` plan

- [ ] **Step 1: Run the final verification sweep**

Run:

```bash
npm run lint:plans
npm run build:test
if ($LASTEXITCODE -eq 0) { node --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs }
npm run typecheck
npm run build
```

Expected:

- `PASS`

- [ ] **Step 2: Finalize this plan's governance state**

If the verification sweep passes, update `docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md` with these exact end-state values:

```md
- Status: `completed-but-open`
- Last Updated: `2026-07-27`
- Current Focus: `Implementation complete; awaiting review, repository sync, and an owner decision on whether to promote this child into project-progress.`
- Next Step: `Review the troop/backpack sound diff, decide whether to sync this child into docs/superpowers/project-progress.md, and push before marking the child closed.`
- Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/property-panel-button-sound-contract.test.cjs tests/backpack-ui-contract.test.cjs tests/party-editor-ui-source.test.cjs }`; `npm run typecheck`; `npm run build`
- Notes: `This batch only changes button-sound declarations for troop and backpack surfaces; it does not change playback overlap, cue ids, or event-layer sound routing.`
```

Append a final `Progress Log` entry with the verification output and set the `Completion Checklist` checkboxes to checked.

Then fill the `Child Closeout` block with:

```md
- Closed Child: `Troop And Backpack Button Sound`
- Parent Task: `UI Button Sound Assignment`
- Parent Stage: `UI Audio Integration`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-sync-and-push`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue from this plan if the owner wants repository sync or follow-up button assignment work.`
```

- [ ] **Step 3: Commit the final verification state**

Run:

```bash
git add docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md
git commit -m "docs: record troop backpack button sound verification"
```

## Exit Check

- [x] Map `open-troop-editor` and map `open-backpack` are explicitly `heavy`.
- [x] Character-detail `open-backpack` is explicitly `heavy`.
- [x] Backpack filter, item, non-equip action, and close buttons are explicitly `light`, and equip actions are explicitly `heavy`.
- [x] Troop-editor `队伍管理` is `heavy` and all other browsing buttons remain `light`.
- [x] Troop-editor confirm-side actions are `heavy` and cancel/back/alert-close remain `light`.
- [x] Troop-management browsing buttons remain `light`.
- [x] Troop-management reserve assign and remove-confirm actions are `heavy`; cancel/back/close remain `light`.
- [ ] `npm run lint:plans`, the targeted test suite, `npm run typecheck`, and `npm run build` all pass.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Troop And Backpack Button Sound`
- Parent Task: `UI Button Sound Assignment`
- Parent Stage: `UI Audio Integration`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `resolve-final-build-verification`
- Next Entry Document: `docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-27-troop-backpack-button-sound-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Resume from Task 4 Step 1 after deciding whether to debug or waive the elevated Vite build exit code -1073740791.`
