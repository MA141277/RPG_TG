# City / Building Access Condition Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the city/building enter-state freeform JSON access editor with a runtime-accurate nested picker that only exposes fields the location-access runtime can actually evaluate.

**Architecture:** Keep condition storage on the existing `ScriptEditorAccessRule.conditionExpression` shape, but drive authoring from a dedicated location-access condition registry instead of the event-binding condition registry. The UI should surface nested `all` / `any` / `not` groups, runtime-readable comparison fields, and a text-backed refusal prompt selector. Empty condition groups should normalize away so "no condition" remains a valid, fail-open enter path.

**Tech Stack:** TypeScript, existing Script Editor UI shell, `LocationAccessConditionExpression`, `runtime-pack-export`, `tests/robustness.test.cjs`, browser acceptance through the in-app browser.

---

### File Map

**Create**
- `src/application/script-editor/location-access-authoring.ts`

**Modify**
- `src/domain/location-access.ts`
- `src/domain/script-editor-project.ts`
- `src/application/script-editor/city-building-authoring.ts`
- `src/application/script-editor/city-building-runtime-materializer.ts`
- `src/application/script-editor/runtime-pack-export.ts`
- `src/ui/main-ui/main-ui-flow.js`
- `src/styles/main-ui.css`
- `tests/robustness.test.cjs`

---

### Task 1: Lock the access-condition contract in tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add the failing contract assertions**

Add assertions that the city/building access editor no longer exposes these as normal enter-condition controls:

- `拒绝原因`
- `引导说明`
- `反馈角色`

Add assertions that the editor does expose:

- the renamed `进入条件` tab label
- nested condition-group controls
- supported runtime-readable condition families only

Add assertions that an empty access condition group exports as "no condition" rather than an empty wrapper.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor city/building access condition"`

Expected: FAIL because the picker and normalization behavior are not yet implemented.

---

### Task 2: Add a dedicated location-access condition registry and draft helpers

**Files:**
- Create: `src/application/script-editor/location-access-authoring.ts`
- Modify: `src/domain/location-access.ts`
- Modify: `src/domain/script-editor-project.ts`
- Modify: `src/application/script-editor/city-building-authoring.ts`

- [ ] **Step 1: Write the failing shape first**

Add a small registry module that declares the supported enter-condition subjects for this queue:

```ts
export type LocationAccessConditionSourceFamily =
  | "world"
  | "targetCity"
  | "targetBuilding"
  | "player";
```

Include runtime-readable field options for:

- world chapter / map / city / house / time
- target city id / name / region / map node / background / travel cost / prosperity / danger / tags / special demand / house ids
- target building id / city / name / background / type / level / damaged / output multiplier / activity location / story stages / character ids
- player character id

Add draft helpers for:

- creating one default compare condition row
- adding / removing nested condition groups
- removing the last item and collapsing an empty group

Add an authoring field for the refusal prompt text entry id:

- `blockedMessageTextEntryId`

Keep the existing runtime export path string-based by resolving that text id later.

- [ ] **Step 2: Run the focused test to verify the registry does not exist yet**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor city/building access condition"`

Expected: FAIL because the registry module and normalization helpers are still missing.

- [ ] **Step 3: Implement the smallest registry and normalization seam**

Implement the registry module and wire `city-building-authoring.ts` so access rules:

- preserve supported nested expressions
- drop empty wrapper groups
- keep legacy string-freeform access data from reappearing in the UI
- keep `blockedMessageTextEntryId` compatible with existing `blockedMessage` text on import when present

- [ ] **Step 4: Re-run the focused test**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor city/building access condition"`

Expected: PASS.

---

### Task 3: Replace the city/building enter-state UI with nested pickers

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/styles/main-ui.css`

- [ ] **Step 1: Add the failing UI expectations first**

Render the city/building tab as `进入条件` and remove the old freeform fields from the main panel:

- `拒绝原因`
- `引导说明`
- `反馈角色`

Render refusal text as a select populated from `project.textEntries`, showing `标题/文本摘要 (id)` and storing the chosen text entry id.

Render condition rows as nested selects rather than a JSON textarea:

- group operator select
- source family select
- field select
- comparison operator select
- value control select/input depending on field type
- add/remove condition actions

- [ ] **Step 2: Run the browser-facing test to verify the UI still fails**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor city/building access condition"`

Expected: FAIL until the UI stops rendering the old fields and exposes the new picker.

- [ ] **Step 3: Implement the picker UI**

Update the location inspector header and panel wiring so:

- `进入态` becomes `进入条件`
- the nested group editor uses the new registry
- the refusal prompt select comes from `project.textEntries`
- no unsupported event-binding-only families appear in the city/building picker

Keep the location access UI stable for both cities and buildings.

- [ ] **Step 4: Re-run the focused test**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor city/building access condition"`

Expected: PASS.

---

### Task 4: Keep export/runtime behavior fail-open on empty conditions and resolve refusal text

**Files:**
- Modify: `src/application/script-editor/city-building-runtime-materializer.ts`
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add the export contract test**

Add tests that:

- empty access conditions do not emit an empty condition wrapper
- a supported nested condition exports into `location-access.json`
- the selected refusal text entry id resolves into the exported runtime text string

- [ ] **Step 2: Run the export test to verify it fails**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor runtime export.*location access"`

Expected: FAIL until export resolves the new text-backed refusal prompt and empty groups are omitted.

- [ ] **Step 3: Implement export normalization**

Update the city/building runtime materializer so the exported runtime pack:

- carries nested `LocationAccessConditionExpression` structures as-is
- omits empty `conditionExpression`
- resolves `blockedMessageTextEntryId` to exported runtime text content
- preserves the fail-open path when no condition exists

- [ ] **Step 4: Re-run the export test**

Run:

`npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor runtime export.*location access"`

Expected: PASS.

---

### Task 5: Verify the real editor flow in the browser

**Files:**
- Modify: `tests/robustness.test.cjs` if the browser script needs a permanent regression test

- [ ] **Step 1: Simulate the authoring flow in the in-app browser**

Use the browser to:

- open Script Editor
- select a city
- open `进入条件`
- add one supported condition group
- add one nested comparison
- select a refusal text entry
- save
- re-open the same city and confirm the picker state persists

- [ ] **Step 2: Verify runtime behavior**

Confirm that:

- no-condition cities/buildings still enter normally
- a satisfied condition still enters normally
- an unsatisfied condition blocks entry
- runtime preview still renders the green boundary frame

- [ ] **Step 3: Run the full verification bundle**

Run:

`npm run typecheck`
`npm run lint:blueprints`
`npm test`

Expected: all pass.

---

### Self-Review

- Spec coverage:
  - enter-state tab rename: covered
  - old freeform fields removed: covered
  - refusal prompt becomes text-backed select: covered
  - nested condition picker: covered
  - supported runtime-readable families only: covered
  - empty condition remains fail-open: covered
  - browser verification: covered

- Placeholder scan:
  - no TBD / TODO / fill-in markers

- Type consistency:
  - `LocationAccessConditionExpression` remains the canonical runtime shape
  - `blockedMessageTextEntryId` is the new authoring-side field name used consistently across tasks

