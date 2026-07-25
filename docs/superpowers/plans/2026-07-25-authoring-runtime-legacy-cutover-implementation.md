# Authoring Runtime Legacy Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove legacy authoring/runtime/import/save residue while preserving the current canonical execution chain and converging city/building settlement handling onto one typed, non-compatibility contract.

**Architecture:** Execute a full-chain canonical cutover from Script Editor schema through runtime and save/load, but only after inventory proves which fields and paths are still the sole formal consumers. The implementation must preserve currently used canonical runtime fields, delete alias and compatibility residue, and fail closed on retired shapes instead of migrating them.

**Tech Stack:** TypeScript, Script Editor authoring/runtime modules, scenario pack validation, settlement runtime, Node test runner, repository docs, `cmd /c npm run build:test`, `node --test tests/robustness.test.cjs`, `npm run lint:plans`.

## Global Constraints

- Do not delete any field or path until inventory confirms it is residue rather than the current canonical consumer.
- Preserve the current canonical runtime fields that are still formally consumed end-to-end; delete only duplicate, alias, compatibility, or pseudo-supported paths.
- Do not introduce any new compatibility import, migration, alias, or dual-write bridge.
- City and building settlement targeting must converge to typed custom attributes plus canonical runtime fields only.
- `string` typed attributes remain non-settlement-operable.
- Old packs, old editor projects, and old saves must fail closed after the cutover; no migration layer remains.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-25`
- Current Focus: `Plan written; awaiting execution mode selection.`
- Next Step: `Execute Task 1 to inventory canonical versus residue paths before deleting any contract surface.`
- Verification: `Plan not yet executed`
- Notes: `Primary safety rule: inventory before removal to avoid deleting live canonical consumers.`

## Progress Log

- 2026-07-25
  - Summary: `Created the implementation plan for the no-transition authoring/runtime legacy cutover and encoded the do-not-overclean constraint as a global execution rule.`
  - Verification: `Plan authoring only`
  - Next: `Run the inventory task and classify every candidate as canonical-keep or safe-to-remove residue.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-25-authoring-runtime-legacy-cutover-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `scope-confirmed`
- Notes:
  - `User approved the no-transition cutover and also added a safety constraint: do not overclean and break current live chains.`
  - `Execution must classify fields and paths before deletion; runtime canonical fields are allowed to remain when they are the formal truth.`

## Implementation Scope

### In Scope

- Inventory every legacy/compatibility/alias candidate across authoring schema, editor UI, export/import, scenario loader, settlement runtime, and save/load.
- Convert city/building custom attributes from weak custom entries to typed attribute records where they participate in the formal contract.
- Remove settlement alias keys and require canonical keys in editor validation, export/import, loader, and runtime.
- Remove compatibility import and retired save migration handling.
- Rewrite tests and docs to enforce rejection of retired shapes.

### Still Out Of Scope

- New gameplay features beyond the cutover itself.
- Adding new settlement operator families beyond `number`, `boolean`, and `enum`.
- Preserving backward compatibility for old packs, old editor projects, or old saves.

## File Map

### Existing files to modify

- `src/domain/script-editor-project.ts`
  - Converge city/building custom attribute contracts and remove retired schema fields that no longer belong to the formal contract.
- `src/application/script-editor/city-building-authoring.ts`
  - Normalize city/building authoring records against the typed custom attribute contract.
- `src/application/script-editor/city-building-runtime-materializer.ts`
  - Materialize city/building runtime definitions from the canonical attribute model only.
- `src/ui/main-ui/main-ui-flow.js`
  - Remove retired settlement attribute options and creator-facing legacy field entry points.
- `src/application/script-editor/runtime-pack-export.ts`
  - Export only canonical settlement keys and typed custom attributes; reject residue.
- `src/application/script-editor/runtime-pack-import.ts`
  - Remove compatibility rewriting and reject retired pack fields.
- `src/application/scenario/scenario-pack-loader.ts`
  - Validate only canonical settlement keys and typed custom attributes; reject retired pack shapes.
- `src/core/runtime/runtime-settlement.ts`
  - Remove alias rewrite tables and apply settlement contents only through canonical keys.
- `src/core/save/save-migrations.ts`
  - Remove retired save migration acceptance paths and fail closed on unsupported save shapes.
- `tests/robustness.test.cjs`
  - Replace compatibility assertions with canonical keep/remove classification, rejection tests, and end-to-end cutover tests.
- `docs/change-log.md`
  - Record the cutover and removal of compatibility paths.

### Existing files expected to be deleted

- `none assumed at plan time`

### New files to create

- `none required unless execution discovers that typed city/building attribute helpers need a focused module split`

## Verification Plan

- Targeted verification:
  - `Inventory proves every removed path is residue and every kept path remains the single canonical consumer.`
  - `Settlement authoring/export/import/loader/runtime all accept the same canonical keys and reject retired aliases.`
  - `Save/load rejects legacy envelopes instead of migrating them.`
- Required commands:
  - `cmd /c npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:plans`

## Task 1: Inventory Canonical Versus Residue Paths

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/domain/script-editor-project.ts`
- Read: `src/application/script-editor/city-building-authoring.ts`
- Read: `src/application/script-editor/runtime-pack-export.ts`
- Read: `src/application/script-editor/runtime-pack-import.ts`
- Read: `src/application/scenario/scenario-pack-loader.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/core/save/save-migrations.ts`

**Interfaces:**
- Consumes: existing settlement key lists, typed attribute contracts, save migration entrypoints
- Produces: a tested classification matrix of `canonical-keep` versus `safe-to-remove` paths recorded in test fixtures and execution notes

- [ ] **Step 1: Write the failing inventory test**

Add a source-audit test that asserts known residue candidates are still present before the cutover and that live canonical fields are separately enumerated.

```js
test("legacy cutover inventory separates canonical keep fields from residue candidates", () => {
  const runtimeSettlementSource = fs.readFileSync("src/core/runtime/runtime-settlement.ts", "utf8");
  const schemaSource = fs.readFileSync("src/domain/script-editor-project.ts", "utf8");

  assert.match(runtimeSettlementSource, /baseAttributes\.security|baseAttributes\.level/);
  assert.match(schemaSource, /population\?: number/);
  assert.match(runtimeSettlementSource, /danger|level|outputMultiplier|damaged/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"
```

Expected:

- `FAIL` because the new inventory test does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Add the inventory test and, if needed, a small helper comment block in the test file that names the current candidate categories:

```js
const LEGACY_CUTOVER_RESIDUE_CANDIDATES = [
  "baseAttributes.security",
  "baseAttributes.level",
  "baseAttributes.outputMultiplier",
  "baseAttributes.damaged",
  "population?: number",
];
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs
git commit -m "test: add legacy cutover inventory guard" -m "Summary:
- add a source-audit test that separates canonical keep fields from residue candidates before the cutover
- document the inventory-first deletion rule in the test fixture"
```

## Task 2: Converge City and Building Authoring Onto Typed Attributes

**Files:**
- Modify: `src/domain/script-editor-project.ts`
- Modify: `src/application/script-editor/city-building-authoring.ts`
- Modify: `src/application/script-editor/city-building-runtime-materializer.ts`
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `ScriptEditorTypedAttributeRecord`, city/building authoring normalization helpers
- Produces:
  - `ScriptEditorCityRecord.extendedAttributes?: ScriptEditorTypedAttributeRecord[]`
  - `ScriptEditorBuildingRecord.extendedAttributes?: ScriptEditorTypedAttributeRecord[]`
  - normalized city/building authoring helpers that preserve typed metadata

- [ ] **Step 1: Write the failing authoring contract test**

Add a test that asserts city/building extended attributes are typed and that retired schema fields like `population` are absent.

```js
test("city and building authoring use typed attributes and remove retired population residue", () => {
  const source = fs.readFileSync("src/domain/script-editor-project.ts", "utf8");

  assert.match(source, /ScriptEditorCityRecord[\s\S]*extendedAttributes\?: ScriptEditorTypedAttributeRecord\[\]/);
  assert.match(source, /ScriptEditorBuildingRecord[\s\S]*extendedAttributes\?: ScriptEditorTypedAttributeRecord\[\]/);
  assert.doesNotMatch(source, /population\?: number/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "city and building authoring use typed attributes and remove retired population residue"
```

Expected:

- `FAIL` because city/building authoring still use weak custom attribute entries and the schema still contains `population`.

- [ ] **Step 3: Write minimal implementation**

Change the schema and authoring normalizers so city/building `extendedAttributes` use `ScriptEditorTypedAttributeRecord[]` and remove `population` from the city base attribute schema.

```ts
export type ScriptEditorCityRecord = ScriptEditorEntityRecord & {
  // ...
  baseAttributes?: {
    ownerFactionId?: string;
    prosperity?: number;
    security?: number;
  };
  extendedAttributes?: ScriptEditorTypedAttributeRecord[];
};
```

- [ ] **Step 4: Run the targeted tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "city and building authoring use typed attributes and remove retired population residue|script editor city/building custom attribute helpers"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/domain/script-editor-project.ts src/application/script-editor/city-building-authoring.ts src/application/script-editor/city-building-runtime-materializer.ts src/ui/main-ui/main-ui-flow.js tests/robustness.test.cjs
git commit -m "refactor: type city building custom attributes" -m "Summary:
- converge city and building authoring onto typed custom attribute records
- remove retired city population base-attribute residue from the authoring schema"
```

## Task 3: Cut Over Settlement Keys To Canonical Runtime Names

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Modify: `src/application/script-editor/runtime-pack-import.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: settlement attribute option builders, settlement validation metadata, runtime settlement application
- Produces:
  - canonical city settlement keys such as `travelCost`, `prosperity`, `danger`
  - canonical building settlement keys such as `level`, `outputMultiplier`, `damaged`
  - rejection of alias keys such as `baseAttributes.security`

- [ ] **Step 1: Write the failing canonical-key tests**

Add tests that reject alias keys and require the canonical runtime names instead.

```js
test("settlement contract rejects alias keys and accepts canonical runtime keys", () => {
  const source = fs.readFileSync("src/core/runtime/runtime-settlement.ts", "utf8");

  assert.doesNotMatch(source, /baseAttributes\.security/);
  assert.doesNotMatch(source, /baseAttributes\.level/);
  assert.match(source, /danger/);
  assert.match(source, /level/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "settlement contract rejects alias keys and accepts canonical runtime keys"
```

Expected:

- `FAIL` because alias settlement keys still exist in UI, validation tables, and runtime rewrite logic.

- [ ] **Step 3: Write minimal implementation**

Replace alias-style key lists with canonical runtime key lists and remove rewrite-table handling from settlement runtime.

```ts
const CITY_SETTLEMENT_ATTRIBUTES = {
  travelCost: { attributeType: "number" },
  prosperity: { attributeType: "number" },
  danger: { attributeType: "number" },
};
```

- [ ] **Step 4: Run the targeted tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "settlement contract rejects alias keys and accepts canonical runtime keys|runtime settlement applies UI-authored city and building baseAttributes keys|script editor runtime export rejects settlement content target value and eligibility gaps"
```

Expected:

- `PASS`
- the old alias-based test names may need to be renamed to canonical-key wording during the task.

- [ ] **Step 5: Commit**

```bash
git add src/ui/main-ui/main-ui-flow.js src/application/script-editor/runtime-pack-export.ts src/application/script-editor/runtime-pack-import.ts src/application/scenario/scenario-pack-loader.ts src/core/runtime/runtime-settlement.ts tests/robustness.test.cjs
git commit -m "refactor: cut settlement aliases to canonical keys" -m "Summary:
- require canonical runtime settlement keys across editor, export, import, loader, and runtime
- remove alias-style settlement key rewrite paths"
```

## Task 4: Remove Compatibility Import and Retired Loader Paths

**Files:**
- Modify: `src/application/script-editor/runtime-pack-import.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/application/script-editor/workspace-shell.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: pack import diagnostics, scenario loader validation, workspace risk-card surfacing
- Produces:
  - hard rejection for retired pack families and routing residue
  - no compatibility import path

- [ ] **Step 1: Write the failing rejection tests**

Add tests that assert compatibility import and legacy settlement-routing residue are rejected outright.

```js
test("runtime import and scenario loader reject compatibility paths after cutover", async () => {
  const importSource = fs.readFileSync("src/application/script-editor/runtime-pack-import.ts", "utf8");

  assert.doesNotMatch(importSource, /compatibility import/i);
  assert.doesNotMatch(importSource, /migrates legacy settlement result routing/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime import and scenario loader reject compatibility paths after cutover"
```

Expected:

- `FAIL` because compatibility and legacy-routing branches still exist.

- [ ] **Step 3: Write minimal implementation**

Delete compatibility import branches and old settlement result routing helpers so the importer/loader only accept the canonical format.

```ts
throw new Error(
  "Imported runtime pack uses a retired field or routing shape and is not supported."
);
```

- [ ] **Step 4: Run the targeted tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime import and scenario loader reject compatibility paths after cutover|scenario pack loader rejects missing nextEventId targets|script editor runtime import rejects conflicting legacy and settlement nextEventId routing"
```

Expected:

- `PASS`
- tests that previously expected migration are rewritten to expect rejection.

- [ ] **Step 5: Commit**

```bash
git add src/application/script-editor/runtime-pack-import.ts src/application/scenario/scenario-pack-loader.ts src/application/script-editor/workspace-shell.ts tests/robustness.test.cjs
git commit -m "refactor: remove compatibility import paths" -m "Summary:
- retire compatibility import and legacy settlement-routing acceptance paths
- make importer and loader fail fast on retired pack shapes"
```

## Task 5: Remove Legacy Save Migration Acceptance

**Files:**
- Modify: `src/core/save/save-migrations.ts`
- Modify: `src/core/contracts/state-sync-runtime.ts`
- Modify: `src/core/runtime/state-sync-core-seam.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: save envelope parsing, legacy runtime-state normalization hooks
- Produces:
  - a single accepted save envelope contract
  - rejection of legacy saves instead of migration

- [ ] **Step 1: Write the failing save-rejection test**

Add a test that expects legacy save envelopes to be rejected rather than upgraded.

```js
test("save loading rejects retired legacy envelopes after cutover", async () => {
  const source = fs.readFileSync("src/core/save/save-migrations.ts", "utf8");

  assert.doesNotMatch(source, /legacyState/);
  assert.doesNotMatch(source, /canonicalFromLegacyRuntimeState/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "save loading rejects retired legacy envelopes after cutover"
```

Expected:

- `FAIL` because legacy save normalization and migration code still exist.

- [ ] **Step 3: Write minimal implementation**

Remove legacy envelope migration support and fail closed when the loaded save structure is not the current contract.

```ts
if (!isCurrentSaveEnvelope(value)) {
  throw new Error("Unsupported save format.");
}
```

- [ ] **Step 4: Run the targeted tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "save loading rejects retired legacy envelopes after cutover|loadSaveEnvelope normalizes a legacy save into the current envelope|save migration upgrades legacy runtime state to the current envelope version"
```

Expected:

- `PASS`
- the legacy migration tests are renamed or rewritten to expect rejection rather than upgrade.

- [ ] **Step 5: Commit**

```bash
git add src/core/save/save-migrations.ts src/core/contracts/state-sync-runtime.ts src/core/runtime/state-sync-core-seam.ts src/core/runtime/state-sync-runtime.ts tests/robustness.test.cjs
git commit -m "refactor: remove legacy save migration support" -m "Summary:
- accept only the current save envelope and runtime state contract
- remove legacy save migration and normalization branches"
```

## Task 6: Final Verification and Documentation Sync

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-25-authoring-runtime-legacy-cutover-implementation.md`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: all prior task outcomes
- Produces:
  - updated repository documentation
  - completed plan governance fields
  - final verification evidence

- [ ] **Step 1: Update changelog and plan status**

Record the cutover in `docs/change-log.md` and update this plan's `Execution State`, `Progress Log`, `Exit Check`, and `Completion Checklist`.

```md
- Summary: `Cut over authoring/runtime/save contracts to one canonical format and removed compatibility paths.`
- Verification: `cmd /c npm run build:test && node --test tests/robustness.test.cjs`
```

- [ ] **Step 2: Run the full verification suite**

Run:

```bash
cmd /c npm run build:test
node --test tests/robustness.test.cjs
npm run lint:plans
```

Expected:

- `PASS` for build and tests
- `PASS` for plan lint

- [ ] **Step 3: Mark the plan complete**

Update the plan:

```md
- Status: `completed-but-open`
- Verification: `cmd /c npm run build:test; node --test tests/robustness.test.cjs; npm run lint:plans`
```

Then add the closeout block once repository sync is recorded.

- [ ] **Step 4: Commit**

```bash
git add docs/change-log.md docs/superpowers/plans/2026-07-25-authoring-runtime-legacy-cutover-implementation.md tests/robustness.test.cjs
git commit -m "docs: close legacy cutover plan" -m "Summary:
- record the canonical authoring/runtime cutover in the changelog and plan governance fields
- capture final verification evidence for the cutover"
```

## Exit Check

- [ ] `Inventory classified every removed path as residue and every retained path as the canonical consumer.`
- [ ] `City and building custom attributes are typed and settlement uses only canonical keys plus typed calculable attributes.`
- [ ] `Import, loader, runtime, and save/load reject retired shapes with no compatibility branch left.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `not-closed`
- Parent Task: `Authoring runtime legacy cutover`
- Parent Stage: `Explicitly resumed legacy superpowers planning`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Execute Task 1 and keep the inventory-first safety rule in force.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-25-authoring-runtime-legacy-cutover-implementation.md`
- Push Status: `not-run`
- Push Commit: `none`
- Resume From: `Open this implementation plan and start with Task 1 to classify canonical keep paths before deletion.`

`Push Commit` must point to a commit message that uses `<type>: <brief title>` plus a `Summary:` section with at least one bullet when push succeeds. If push fails, use `none`, record the failed sync result in `Progress Log`, and continue the next lawful handoff from the written governance truth.
