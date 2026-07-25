# Script Editor Settlement Structured Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Script Editor settlement result editor with structured settlement content authoring, settlement-level follow-up routing, and typed calculable-attribute support for person custom attributes.

**Architecture:** Keep `event` as the only routing owner and treat settlement as a structured write-back resource. The implementation should converge the project/domain shape, Script Editor helpers and UI, export/import validation, and runtime settlement consumption on one typed `contents[] + nextEventId` model while keeping hidden technical ids internal and creator-facing binding title-driven.

**Tech Stack:** TypeScript, Script Editor authoring helpers under `src/application/script-editor`, UI rendering in `src/ui/main-ui/main-ui-flow.js`, runtime/export seams in `src/application/script-editor` and `src/core/runtime`, regression coverage in `tests/robustness.test.cjs`, verification via `npm run build:test` and targeted `node --test`.

## Global Constraints

- Keep Script Editor settlement authoring in the same visual style as the rest of the workspace.
- Remove creator-visible ids and other technical fields from settlement authoring.
- Make settlement content directly executable by runtime without free-text interpretation.
- Keep `event` as the only routing owner and keep settlement follow-up at settlement level rather than content-row level.
- Support an extensible target-family model while limiting this round to `人物 / 城市 / 建筑`.
- Restrict settlement authoring to calculable attributes only.
- Keep hidden technical identity available for storage/export/runtime while presenting creator-facing title-based binding.
- Do not introduce resolver, selector, or intermediate routing layers.
- Do not expose strings or storage-only attributes as settlement-operable targets.
- Boolean and enum settlement operations in this round are `设为` only.
- Person custom-attribute creator-facing labels must use `数值 / 开关 / 选项 / 文本`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-25`
- Current Focus: `Plan approved and waiting for execution mode selection.`
- Next Step: `Choose Subagent-Driven or Inline Execution, then start Task 1 with tests first.`
- Verification: `Not run as part of this plan-only change`
- Notes: `Current repository execution truth still lives under docs/blueprints/**; this plan is an implementation artifact derived from the approved settlement structured authoring spec.`

## Progress Log

- 2026-07-25
  - Summary: `Created the implementation plan for settlement structured authoring, typed person custom attributes, migration, and runtime consumption.`
  - Verification: `Not run as part of this plan-only change`
  - Next: `Select execution mode and begin Task 1 with failing regression coverage.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-25-script-editor-settlement-structured-authoring-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/blueprints/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current repo already exposes settlement authoring, but it still uses creator-visible settlement/result ids, settlement description, and result-local nextEventId.`
  - `Person custom attributes are still plain key/value rows without creator-facing type selection.`
  - `Runtime/export validation still assumes settlement results[] rather than settlement contents[] plus settlement-level nextEventId.`

## Implementation Scope

### In Scope

- Converge settlement domain types from `description + results[]` to `nextEventId + contents[]`.
- Add typed person custom-attribute authoring using `数值 / 开关 / 选项 / 文本`.
- Replace settlement UI with title-only creator-facing authoring and structured settlement content rows.
- Keep event-side settlement selection creator-facing by title while preserving hidden technical ids underneath.
- Add export/import/workspace validation and fail-closed migration for the retired settlement-result model.
- Add runtime consumption for structured settlement content over `人物 / 城市 / 建筑`.
- Update regression coverage and `docs/change-log.md`.

### Still Out Of Scope

- New settlement target families beyond `人物 / 城市 / 建筑`
- Non-`设为` boolean or enum operations
- Free-text compatibility settlement interpretation
- Broader Blueprint queue/version rewriting unrelated to this feature batch
- Generalized arbitrary custom-attribute support for runtime fields outside the explicit calculable settlement contract

## File Map

### Existing files to modify

- `src/domain/script-editor-project.ts`
  - Replace settlement/result records with typed settlement content and typed custom-attribute metadata.
- `src/application/script-editor/story-dialogue-event-authoring.ts`
  - Update settlement defaults, normalization, append/remove/update helpers, and event settlement field handling.
- `src/application/script-editor/person-authoring.ts`
  - Add typed custom-attribute helpers, default metadata, and runtime-readable calculable attribute selection support.
- `src/application/script-editor/minimal-workflow.ts`
  - Keep settlement draft/upsert/remove flows aligned with the new domain shape.
- `src/application/script-editor/runtime-pack-export.ts`
  - Validate typed settlement contents, duplicate titles, migration rules, and settlement-level nextEventId.
- `src/application/script-editor/runtime-pack-import.ts`
  - Import the new settlement shape and reject unsupported legacy ambiguity.
- `src/application/script-editor/workspace-shell.ts`
  - Surface new settlement validation blockers and title-uniqueness checks.
- `src/application/scenario/scenario-pack-loader.ts`
  - Keep loader fail-closed on settlement event reference integrity if exported runtime pack semantics change.
- `src/core/runtime/runtime-settlement.ts`
  - Apply structured settlement content through typed target-family handlers.
- `src/ui/main-ui/main-ui-flow.js`
  - Redesign person attribute UI and settlement editor UI, including creator-facing type/value controls.
- `tests/robustness.test.cjs`
  - Replace old settlement-result assertions and add new typed settlement/runtime regressions.
- `docs/change-log.md`
  - Record the creator-visible settlement and typed-attribute behavior changes.

### Existing files expected to be deleted

- `none`

### New files to create

- `none required by default`
  - Prefer keeping the first implementation slice inside existing authoring/runtime seams unless one file becomes too large during execution.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "settlement|person custom attribute|runtime settlement"`
- Required commands:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "settlement|person custom attribute|runtime settlement"`

## Task 1: Converge Domain Shape And Typed Person Attributes

**Files:**
- Modify: `src/domain/script-editor-project.ts`
- Modify: `src/application/script-editor/person-authoring.ts`
- Modify: `src/application/script-editor/story-dialogue-event-authoring.ts`
- Modify: `src/application/script-editor/minimal-workflow.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `createDefaultScriptEditorSettlementRecord(indexOrId)`, `normalizeScriptEditorSettlementRecord(record)`, `appendScriptEditorPersonAttribute(person)`, `updateScriptEditorPersonAttribute(person, index, field, value)`
- Produces:
  - `type ScriptEditorSettlementContentRecord`
  - `type ScriptEditorTypedAttributeRecord`
  - `updateScriptEditorSettlementField(record, field, value)`
  - `appendScriptEditorSettlementContent(record)`
  - `removeScriptEditorSettlementContent(record, index)`
  - `updateScriptEditorSettlementContentField(record, index, field, value)`
  - `appendScriptEditorPersonAttribute(person, type?)`
  - `updateScriptEditorPersonAttribute(person, index, field, value)`

- [ ] **Step 1: Write the failing tests for the new settlement and typed-attribute shape**

Add or replace regressions in `tests/robustness.test.cjs` so they assert the new helpers normalize a settlement like this:

```js
let settlementRecord = createDefaultScriptEditorSettlementRecord(0);
settlementRecord = updateScriptEditorSettlementField(
  settlementRecord,
  "title",
  "开场结算"
);
settlementRecord = updateScriptEditorSettlementField(
  settlementRecord,
  "nextEventId",
  "event.followup"
);
settlementRecord = updateScriptEditorSettlementContentField(
  settlementRecord,
  0,
  "targetFamily",
  "person"
);
settlementRecord = updateScriptEditorSettlementContentField(
  settlementRecord,
  0,
  "attributeType",
  "number"
);
settlementRecord = updateScriptEditorSettlementContentField(
  settlementRecord,
  0,
  "operation",
  "add"
);
```

And assert person custom-attribute helpers preserve:

```js
person = appendScriptEditorPersonAttribute(person, "number");
person = updateScriptEditorPersonAttribute(person, 0, "label", "忠诚");
person = updateScriptEditorPersonAttribute(person, 0, "type", "number");
```

- [ ] **Step 2: Run the focused regression to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "settlement|person custom attribute"
```

Expected:

- `FAIL`
- errors mentioning missing settlement content helpers, unexpected `results`, or missing typed attribute fields

- [ ] **Step 3: Update the domain types and helper seams with the minimal typed shape**

Modify `src/domain/script-editor-project.ts`, `src/application/script-editor/person-authoring.ts`, and `src/application/script-editor/story-dialogue-event-authoring.ts` so the minimal model is:

```ts
export type ScriptEditorTypedAttributeType = "number" | "boolean" | "enum" | "string";

export type ScriptEditorTypedAttributeRecord = {
  key: string;
  label?: string | undefined;
  type: ScriptEditorTypedAttributeType;
  value?: string | number | boolean | undefined;
  options?: string[] | undefined;
};

export type ScriptEditorSettlementContentRecord = {
  targetFamily: "person" | "city" | "building";
  targetId: string;
  attributeKey: string;
  attributeType: "number" | "boolean" | "enum";
  operation: "add" | "subtract" | "set";
  value: string | number | boolean;
};

export type ScriptEditorSettlementRecord = ScriptEditorEntityRecord & {
  title: string;
  nextEventId?: string;
  contents?: ScriptEditorSettlementContentRecord[];
};
```

Use the helper names from the `Interfaces` block and remove write paths that still manufacture `description` or `results`.

- [ ] **Step 4: Run the focused regression to verify the helper layer passes**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "settlement|person custom attribute"
```

Expected:

- `PASS` for the updated helper tests

- [ ] **Step 5: Commit the bounded helper/domain slice**

Run:

```bash
git add tests/robustness.test.cjs src/domain/script-editor-project.ts src/application/script-editor/person-authoring.ts src/application/script-editor/story-dialogue-event-authoring.ts src/application/script-editor/minimal-workflow.ts
git commit -m "feat: converge settlement domain shape" -m "Summary:
- replace settlement result rows with typed settlement contents and settlement-level nextEventId
- add typed person custom-attribute helpers for calculable settlement integration"
```

## Task 2: Replace The Script Editor UI With Typed Creator-Facing Controls

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/application/script-editor/story-dialogue-event-authoring.ts`
- Modify: `src/application/script-editor/person-authoring.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `normalizeScriptEditorSettlementRecord(record)`
  - `appendScriptEditorSettlementContent(record)`
  - `updateScriptEditorSettlementContentField(record, index, field, value)`
  - `appendScriptEditorPersonAttribute(person, type?)`
- Produces:
  - settlement editor fields using `data-script-editor-settlement-field="title"` and `data-script-editor-settlement-field="nextEventId"`
  - settlement content row fields using `data-script-editor-settlement-content-field="..."`
  - person attribute type controls using `data-script-editor-person-attribute-field="type"`

- [ ] **Step 1: Write failing UI-source assertions for the new creator-facing controls**

Update `tests/robustness.test.cjs` to assert that `src/ui/main-ui/main-ui-flow.js`:

```js
assert.doesNotMatch(source, /data-script-editor-settlement-field="description"/);
assert.doesNotMatch(source, /data-script-editor-settlement-result-field="id"/);
assert.match(source, /data-script-editor-settlement-field="nextEventId"/);
assert.match(source, /结算内容/);
assert.match(source, /data-script-editor-settlement-content-field="targetFamily"/);
assert.match(source, /data-script-editor-settlement-content-field="operation"/);
assert.match(source, /data-script-editor-person-attribute-field="type"/);
assert.match(source, /数值/);
assert.match(source, /开关/);
assert.match(source, /选项/);
assert.match(source, /文本/);
```

- [ ] **Step 2: Run the focused UI regression to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "settlement authoring|person attribute"
```

Expected:

- `FAIL`
- assertions still finding settlement description/result fields or missing typed person controls

- [ ] **Step 3: Rewrite the settlement and person authoring UI with creator-facing controls only**

Modify `src/ui/main-ui/main-ui-flow.js` so the settlement editor layout looks like:

```js
<label class="c-script-editor-form-field">
  <span>结算标题</span>
  <input data-script-editor-settlement-field="title" />
</label>
<label class="c-script-editor-form-field">
  <span>后续事件</span>
  <select data-script-editor-settlement-field="nextEventId"></select>
</label>
<section>
  <h3>结算内容</h3>
  <select data-script-editor-settlement-content-field="targetFamily"></select>
  <select data-script-editor-settlement-content-field="targetId"></select>
  <select data-script-editor-settlement-content-field="attributeKey"></select>
  <select data-script-editor-settlement-content-field="operation"></select>
  <input data-script-editor-settlement-content-field="value" />
</section>
```

And update person custom-attribute rows to include:

```js
<select data-script-editor-person-attribute-field="type">
  <option value="number">数值</option>
  <option value="boolean">开关</option>
  <option value="enum">选项</option>
  <option value="string">文本</option>
</select>
```

Do not render creator-visible settlement id, result id, or settlement description fields.

- [ ] **Step 4: Run the focused UI regression to verify it passes**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "settlement authoring|person attribute"
```

Expected:

- `PASS` for the new UI-source assertions

- [ ] **Step 5: Commit the UI slice**

Run:

```bash
git add src/ui/main-ui/main-ui-flow.js src/application/script-editor/story-dialogue-event-authoring.ts src/application/script-editor/person-authoring.ts tests/robustness.test.cjs
git commit -m "feat: redesign settlement editor controls" -m "Summary:
- replace creator-visible settlement result fields with structured settlement content controls
- add creator-facing typed person custom-attribute controls using 数值 开关 选项 文本"
```

## Task 3: Add Validation, Import/Export, And Fail-Closed Migration

**Files:**
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Modify: `src/application/script-editor/runtime-pack-import.ts`
- Modify: `src/application/script-editor/workspace-shell.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ScriptEditorSettlementRecord`
  - `ScriptEditorSettlementContentRecord`
  - settlement title uniqueness rule
- Produces:
  - export diagnostics for duplicate settlement titles and invalid content rows
  - import normalization for `contents[] + nextEventId`
  - fail-closed migration on ambiguous legacy `results[]`

- [ ] **Step 1: Write failing validation and migration regressions**

Add tests covering:

```js
assert.throws(() => exportScriptEditorRuntimePack(project), /duplicate settlement title/i);
assert.throws(() => exportScriptEditorRuntimePack(project), /attribute type|operation/i);
assert.throws(() => importScriptEditorRuntimePack(files), /legacy settlement result|ambiguous nextEventId/i);
```

Include one positive migration case where all old result rows point to the same `nextEventId` and the importer lowers it to settlement-level `nextEventId`.

- [ ] **Step 2: Run the targeted validation regression to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "duplicate settlement title|legacy settlement result|settlement content"
```

Expected:

- `FAIL`
- exporter/importer/workspace-shell still accepting retired settlement-result ambiguity

- [ ] **Step 3: Implement fail-closed validation and the one safe migration path**

Update export/import/workspace validation to enforce:

```ts
if (duplicateSettlementTitle) {
  diagnostics.push({ code: "duplicate-id", fieldPath, message: "Duplicate settlement title." });
}
if (content.attributeType === "boolean" || content.attributeType === "enum") {
  assert(content.operation === "set");
}
if (legacyResultsHaveDifferentNextEventIds) {
  throw new Error("Ambiguous legacy settlement result routing must fail closed.");
}
```

Also remove export/load assumptions that settlement records always carry `results[]`.

- [ ] **Step 4: Run the targeted validation regression to verify it passes**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "duplicate settlement title|legacy settlement result|settlement content"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the validation and migration slice**

Run:

```bash
git add src/application/script-editor/runtime-pack-export.ts src/application/script-editor/runtime-pack-import.ts src/application/script-editor/workspace-shell.ts src/application/scenario/scenario-pack-loader.ts tests/robustness.test.cjs
git commit -m "feat: enforce structured settlement validation" -m "Summary:
- add fail-closed validation for structured settlement contents and duplicate creator-facing settlement titles
- allow only the safe legacy result-routing migration path and reject ambiguous retired settlement rows"
```

## Task 4: Consume Structured Settlement Content In Runtime And Close Out Docs

**Files:**
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes:
  - exported settlement `contents[]`
  - typed target families `person | city | building`
- Produces:
  - runtime applicators for numeric add/subtract/set
  - runtime applicators for boolean and enum `set`
  - final change-log entry and end-to-end regression proof

- [ ] **Step 1: Write failing runtime settlement regressions**

Add tests that expect:

```js
const result = applySettlementContents(gameState, settlement, context);
assert.equal(result.people["person.hero"].stamina, 130);
assert.equal(result.cities["city.start"].prosperity, 90);
assert.equal(result.buildings["building.home"].isOpen, false);
assert.equal(result.people["person.hero"].mood, "inspired");
```

Use one case each for numeric `增加`, numeric `减少`, numeric `设为`, boolean `设为`, and enum `设为`.

- [ ] **Step 2: Run the targeted runtime regression to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement"
```

Expected:

- `FAIL`
- runtime settlement still ignoring structured settlement content

- [ ] **Step 3: Implement typed runtime settlement application and document the behavior**

Update `src/core/runtime/runtime-settlement.ts` with a narrow typed applicator seam such as:

```ts
function applySettlementContent(
  state: RuntimeState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext
): RuntimeState {
  if (content.attributeType === "number" && content.operation === "add") {
    return applyNumericDelta(state, content, Number(content.value));
  }
  if (content.attributeType === "number" && content.operation === "subtract") {
    return applyNumericDelta(state, content, -Number(content.value));
  }
  return applyTypedSet(state, content);
}
```

Then append a `docs/change-log.md` entry describing the creator-visible settlement editor rewrite, typed person attributes, and runtime structured settlement execution.

- [ ] **Step 4: Run the full verification pass**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "settlement|person custom attribute|runtime settlement"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the runtime and docs closeout slice**

Run:

```bash
git add src/core/runtime/runtime-settlement.ts src/application/script-editor/runtime-pack-export.ts tests/robustness.test.cjs docs/change-log.md
git commit -m "feat: execute structured settlement contents" -m "Summary:
- teach runtime settlement to apply typed person city and building settlement contents
- document the creator-facing settlement editor rewrite and typed person custom-attribute support"
```

## Exit Check

- [ ] `Settlement editor no longer shows creator-visible settlement id, result id, or settlement description.`
- [ ] `Settlement authoring uses settlement-level nextEventId and structured contents[].`
- [ ] `Only calculable attributes appear in settlement content pickers.`
- [ ] `Person custom attributes require creator-facing type selection using 数值 / 开关 / 选项 / 文本.`
- [ ] `Runtime can consume structured settlement content directly without free-text interpretation.`
- [ ] `Legacy ambiguous settlement-result data fails closed.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
