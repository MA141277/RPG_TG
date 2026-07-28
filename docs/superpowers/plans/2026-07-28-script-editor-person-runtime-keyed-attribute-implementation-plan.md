# Script Editor Person Runtime-Keyed Attribute Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hard-cut person authoring and runtime consumption over to the runtime-keyed attribute model, leaving only `id`, `name`, and `personType` at the person top level and moving player-character selection into scenario startup policy.

**Architecture:** Replace flat person fields and legacy stat/skill ownership with person-local `attributeGroups`, `attributeMappings`, and `attributeValues`. Route editor authoring, runtime import/export, startup character selection, and all person-facing runtime UI through runtime numeric-string `key` resolution, while `keyName` becomes the only visible attribute/group name in editor and runtime UI. No compatibility layer is allowed.

**Tech Stack:** TypeScript, Node.js, existing script-editor/runtime pack pipeline, Node test runner via `tests/robustness.test.cjs`, `npm.cmd run typecheck`, `npm.cmd run build:test`, `node --test ...`, `npm.cmd run lint:plans`.

## Global Constraints

- Person top level keeps only `id`, `name`, and `personType`.
- `role` is removed from authoring and runtime persistence.
- Default player selection moves to scenario startup policy instead of person data.
- Every person owns `attributeGroups`, `attributeMappings`, and `attributeValues`.
- Attribute/group `key` is the runtime key, must be a numeric string, and is hidden from authoring UI.
- `keyName` is the visible name for authoring UI and runtime UI, may be edited, and must be unique within one person.
- Enum options stay on the person-local attribute mapping.
- Attribute values may be omitted.
- Runtime UI must stop reading `character.title`, `character.biography`, `character.stats.*`, and `character.skills.*` directly.
- No legacy compatibility layer or fallback flat-person truth may remain after this cutover.

---

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-28`
- Current Focus: `Plan written after the runtime-keyed person spec was approved; execution has not started.`
- Next Step: `Resume from this child plan, start Task 1 with a failing contract test, and keep docs/blueprints/project-progress.md open for live repository governance while this legacy plan drives the implementation slice.`
- Verification: `Plan only; implementation verification not run yet.`
- Notes: `This legacy superpowers plan exists only because the operator explicitly advanced the just-written superpowers spec into implementation planning.`

## Progress Log

- 2026-07-28
  - Summary: `Created the implementation plan for the runtime-keyed person hard cut after the design was approved.`
  - Verification: `npm.cmd run lint:plans`
  - Next: `Start Task 1 by locking the new person contract and startup policy in targeted failing tests.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-script-editor-person-runtime-keyed-attribute-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `updated`
- Notes:
  - `The approved spec supersedes the earlier grouped-detail compatibility draft by requiring a hard cut with no legacy flat person fields.`
  - `Scenario startup already owns playerCharacterId and characterSelection; execution must revise that contract instead of inventing a new top-level owner.`

## Implementation Scope

### In Scope

- Replace `ScriptEditorPersonRecord` with the runtime-keyed group/mapping/value model.
- Remove flat person authoring fields and legacy `extendedAttributes`-driven person custom attribute ownership.
- Replace runtime person materialization so runtime consumers resolve person attributes from person-local mappings and values.
- Move player-selection ownership fully into scenario startup policy and remove residual `role` assumptions.
- Migrate editor person UI, entry-shell summary UI, and runtime detail UI to the new attribute/group model.
- Add regression coverage for the new contract, runtime export/import, and UI consumption.

### Still Out Of Scope

- City/building/event/settlement migration to the same keyed-attribute model.
- New gameplay systems beyond what is required to keep the current project functioning after the hard cut.
- Generalizing the person-local mapping model into a repository-wide attribute registry.

## File Map

### Existing files to modify

- `src/domain/script-editor-project.ts`
  - Replace flat `ScriptEditorPersonRecord` with `attributeGroups`, `attributeMappings`, and `attributeValues`.
- `src/domain/character.ts`
  - Remove flat person profile/stat/skill ownership and define the runtime person attribute surface expected after materialization.
- `src/domain/scenario-profile.ts`
  - Replace old character-selection assumptions with the approved startup policy modes.
- `src/application/script-editor/person-authoring.ts`
  - Rebuild person normalization, default creation, update helpers, and runtime materialization around runtime-keyed attributes.
- `src/application/script-editor/runtime-pack-import.ts`
  - Import runtime pack person content into the new authoring structure.
- `src/application/script-editor/runtime-pack-export.ts`
  - Export the new person authoring truth into runtime pack form and validate the new startup policy contract.
- `src/application/character/runtime-property-mutation.ts`
  - Replace flat person stat/skill mutation ownership with keyed-person mutations.
- `src/application/grain-shop/grain-shop-snapshot.ts`
  - Replace direct gold/arithmetic reads with keyed runtime person reads.
- `src/application/grain-shop/grain-shop-mutations.ts`
  - Replace direct gold mutation with keyed runtime person mutations.
- `src/application/playables/grain-accounting/grain-accounting-definition.ts`
  - Replace direct arithmetic reads with keyed runtime person reads.
- `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`
  - Replace direct medicine reads with keyed runtime person reads.
- `src/application/medicine-house/medicine-house-mutations.ts`
  - Replace direct gold/medicine mutation with keyed runtime person mutations.
- `src/application/tea-house/tea-house-mutations.ts`
  - Replace direct rhetoric/gold mutation with keyed runtime person mutations.
- `src/application/tavern/tavern-mutations.ts`
  - Replace direct gold mutation with keyed runtime person mutations.
- `src/domain/battle-formation.ts`
  - Replace remaining flat stat/skill access with keyed runtime person accessors.
- `src/ui/main-ui/main-ui-flow.js`
  - Remove flat person authoring controls and render groups/mappings/values instead.
- `src/ui/entry-shell/entry-shell-view.js`
  - Replace hardcoded summary rows with group-driven attribute reads.
- `src/ui/views/character/character-detail-view.ts`
  - Replace hardcoded basic/ability/skill sections with group-driven rendering.
- `src/ui/app-render.ts`
  - Stop building detail options from flat fields and route runtime detail rendering through the new attribute resolver.
- `src/application/scenario/scenario-pack-loader.ts`
  - Validate the updated startup policy and new runtime person structure on load.
- `src/application/startup/startup-session-coordinator.ts`
  - Apply the new startup selection modes without reading person `role`.
- `src/application/startup/scenario-preview-sanitizer.ts`
  - Preserve the allowed startup policy modes through preview sanitization.
- `src/application/content/active-game-content.ts`
  - Update content-derived person indexing helpers if they still assume flat person fields.
- `src/ui/panels/global-player-panel.ts`
  - Replace direct player gold/fame reads with keyed runtime person reads.
- `tests/robustness.test.cjs`
  - Add contract, import/export, startup, and runtime UI regressions.
- `docs/change-log.md`
  - Record the hard cut once implementation lands.

### Existing files expected to be deleted

- `none`
  - The hard cut is schema-level; current files are expected to be rewritten rather than removed wholesale.

### New files to create

- `src/application/character/person-attribute-runtime.ts`
  - Centralize runtime person attribute/group/mapping resolution so editor UI and runtime UI share one reader.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "script editor person runtime-keyed contract|runtime person detail reads keyed groups|scenario startup character selection uses startup policy"`
- Required commands:
  - `npm.cmd run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm.cmd run typecheck`
  - `npm.cmd run lint:plans`

## Task 1: Lock The New Person And Startup Contract

**Files:**
- Modify: `src/domain/script-editor-project.ts`
- Modify: `src/domain/scenario-profile.ts`
- Test: `tests/robustness.test.cjs`
- Read: `docs/superpowers/specs/2026-07-27-script-editor-person-runtime-keyed-attribute-design.md`

**Interfaces:**
- Consumes:
  - `ScriptEditorPersonRecord`
  - `ScenarioLaunchPolicy`
- Produces:
  - `type ScriptEditorPersonAttributeGroup = { key: string; keyName: string; order: number; itemKeys: string[] }`
  - `type ScriptEditorPersonAttributeMapping = { key: string; keyName: string; type: "number" | "string" | "boolean" | "enum"; options?: string[] }`
  - `type ScriptEditorPersonAttributeValue = { key: string; value: string | number | boolean }`
  - `type ScenarioLaunchPolicy = { characterSelection?: "fixed" | "select" | "first-playable"; initialView?: ViewName; entryEventTiming?: "immediate" | "after-map-entry" }`

- [ ] **Step 1: Write the failing contract tests**

Add targeted tests in `tests/robustness.test.cjs` that assert:

```js
assert.deepEqual(Object.keys(person).sort(), [
  "attributeGroups",
  "attributeMappings",
  "attributeValues",
  "id",
  "name",
  "personType",
]);
assert.equal(policy.characterSelection, "first-playable");
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "script editor person runtime-keyed contract|scenario startup character selection uses startup policy"
```

Expected:

- `FAIL`
- Existing flat fields such as `title`, `occupation`, `role`, or legacy character-selection enums are still present.

- [ ] **Step 3: Replace the domain contracts**

Edit `src/domain/script-editor-project.ts` and `src/domain/scenario-profile.ts` so the exported types match the approved spec exactly, including:

```ts
export type ScriptEditorPersonRecord = ScriptEditorEntityRecord & {
  name: string;
  personType: "NPC" | "角色";
  attributeGroups: ScriptEditorPersonAttributeGroup[];
  attributeMappings: ScriptEditorPersonAttributeMapping[];
  attributeValues: ScriptEditorPersonAttributeValue[];
};
```

and:

```ts
export type ScenarioLaunchPolicy = {
  characterSelection?: "fixed" | "select" | "first-playable";
  initialView?: ViewName;
  entryEventTiming?: "immediate" | "after-map-entry";
};
```

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "script editor person runtime-keyed contract|scenario startup character selection uses startup policy"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the contract slice**

Run:

```bash
git add src/domain/script-editor-project.ts src/domain/scenario-profile.ts tests/robustness.test.cjs
git commit -m "feat: lock runtime-keyed person contract"
```

Commit body:

```text
Summary:
- replace flat person authoring fields with runtime-keyed group/mapping/value contracts
- switch startup characterSelection contract to fixed/select/first-playable
```

## Task 2: Rebuild Person Authoring Helpers And Runtime Import/Export

**Files:**
- Modify: `src/application/script-editor/person-authoring.ts`
- Modify: `src/application/script-editor/runtime-pack-import.ts`
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Modify: `src/application/script-editor/minimal-workflow.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ScriptEditorPersonRecord`
  - `ScenarioProfileDefinition`
- Produces:
  - `normalizeScriptEditorPersonRecord(value: Record<string, unknown>): ScriptEditorPersonRecord`
  - `materializeScriptEditorPersonRuntimeCharacter(person: ScriptEditorPersonRecord, ...): CharacterDefinition`
  - runtime export/import that preserves `attributeGroups`, `attributeMappings`, and `attributeValues`

- [ ] **Step 1: Write the failing import/export tests**

Add tests that verify:

```js
assert.equal(importedPerson.attributeMappings[0].key, "2001");
assert.equal(importedPerson.attributeMappings[0].keyName, "身份");
assert.equal(exportedPerson.attributeValues.find((entry) => entry.key === "2101").value, 75);
```

and that no imported/exported person record still owns `extendedAttributes`, `title`, `occupation`, or `skills`.

- [ ] **Step 2: Run the targeted import/export tests to verify they fail**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "person runtime-keyed import export"
```

Expected:

- `FAIL`
- current import/export still uses flat fields and `extendedAttributes`.

- [ ] **Step 3: Rebuild person helpers and pipeline**

Implement the new person pipeline:

```ts
function materializePersonAttributeRuntime(
  person: ScriptEditorPersonRecord
): ResolvedPersonAttributeRuntime
```

within `person-authoring.ts`, then route `runtime-pack-import.ts` and `runtime-pack-export.ts` through the new `attributeGroups` / `attributeMappings` / `attributeValues` truth. Update `minimal-workflow.ts` so new draft people start with only `id`, `name`, `personType`, and empty keyed attribute collections.

- [ ] **Step 4: Run the targeted import/export tests to verify they pass**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "person runtime-keyed import export"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the authoring pipeline slice**

Run:

```bash
git add src/application/script-editor/person-authoring.ts src/application/script-editor/runtime-pack-import.ts src/application/script-editor/runtime-pack-export.ts src/application/script-editor/minimal-workflow.ts tests/robustness.test.cjs
git commit -m "feat: route person authoring through runtime-keyed attributes"
```

Commit body:

```text
Summary:
- rebuild person normalization and runtime materialization over person-local keyed attributes
- migrate runtime pack import/export away from flat person fields and extendedAttributes
```

## Task 3: Replace Startup Character Selection Ownership

**Files:**
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/application/startup/scenario-preview-sanitizer.ts`
- Modify: `src/application/script-editor/runtime-pack-export.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ScenarioLaunchPolicy.characterSelection`
  - runtime pack `scenario-profile.json`
- Produces:
  - startup flow that resolves `fixed`, `select`, and `first-playable` without person `role`

- [ ] **Step 1: Write the failing startup tests**

Add tests that verify:

```js
assert.equal(profile.launchPolicy.characterSelection, "first-playable");
assert.equal(resolvedPlayerCharacterId, firstPlayablePerson.id);
```

and that selecting the startup character never reads `person.role`.

- [ ] **Step 2: Run the targeted startup tests to verify they fail**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "scenario startup character selection uses startup policy"
```

Expected:

- `FAIL`
- startup still expects `shell` or infers the player through legacy assumptions.

- [ ] **Step 3: Update loader, export, and coordinator**

Replace character-selection handling so:

```ts
characterSelection?: "fixed" | "select" | "first-playable"
```

is accepted end-to-end, `fixed` uses `playerCharacterId`, `select` opens the picker, and `first-playable` resolves the first `personType === "角色"` person in the loaded pack.

- [ ] **Step 4: Run the targeted startup tests to verify they pass**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "scenario startup character selection uses startup policy"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the startup slice**

Run:

```bash
git add src/application/scenario/scenario-pack-loader.ts src/application/startup/startup-session-coordinator.ts src/application/startup/scenario-preview-sanitizer.ts src/application/script-editor/runtime-pack-export.ts tests/robustness.test.cjs
git commit -m "feat: move player selection fully into startup policy"
```

Commit body:

```text
Summary:
- replace legacy character selection enums with fixed/select/first-playable
- resolve startup player ownership without person role fields
```

## Task 4: Rebuild Script Editor Person UI Over Keyed Groups

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/application/script-editor/person-authoring.ts`
- Create: `src/application/character/person-attribute-runtime.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `ScriptEditorPersonRecord.attributeGroups`
  - `ScriptEditorPersonRecord.attributeMappings`
  - `ScriptEditorPersonRecord.attributeValues`
- Produces:
  - editor-side group rendering and keyed attribute editing with hidden runtime keys and visible `keyName`

- [ ] **Step 1: Write the failing editor UI tests**

Add tests that assert the person editor:

```js
assert.match(source, /attributeGroups/);
assert.match(source, /attributeMappings/);
assert.doesNotMatch(source, /extendedAttributes/);
assert.doesNotMatch(source, /person\\.title/);
```

and verifies visible names come from `keyName` while runtime `key` stays hidden.

- [ ] **Step 2: Run the targeted editor tests to verify they fail**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "person editor uses runtime-keyed groups"
```

Expected:

- `FAIL`
- current UI still renders flat fields and `extendedAttributes`.

- [ ] **Step 3: Rebuild the editor surface**

Move person editing to:

```ts
resolvePersonAttributeGroupView(person)
resolvePersonAttributeValue(person, key)
updatePersonAttributeValue(person, key, value)
```

using the new `person-attribute-runtime.ts` helper. `main-ui-flow.js` must render only visible `keyName` labels and grouped values; runtime keys remain hidden.

- [ ] **Step 4: Run the targeted editor tests to verify they pass**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "person editor uses runtime-keyed groups"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the editor UI slice**

Run:

```bash
git add src/ui/main-ui/main-ui-flow.js src/application/script-editor/person-authoring.ts src/application/character/person-attribute-runtime.ts tests/robustness.test.cjs
git commit -m "feat: rebuild person editor over keyed attribute groups"
```

Commit body:

```text
Summary:
- replace flat person field editing with keyed attribute group rendering and updates
- centralize person attribute resolution so runtime keys stay hidden from authors
```

## Task 5: Rebuild Runtime Person Summary And Detail Surfaces

**Files:**
- Modify: `src/ui/entry-shell/entry-shell-view.js`
- Modify: `src/ui/views/character/character-detail-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/application/content/active-game-content.ts`
- Read: `src/application/character/person-attribute-runtime.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - resolved person group/mapping/value runtime helper
- Produces:
  - runtime summary/detail rendering that uses `keyName` and resolved keyed values instead of flat field paths

- [ ] **Step 1: Write the failing runtime UI tests**

Add tests that verify:

```js
assert.doesNotMatch(characterDetailSource, /character\\.stats\\./);
assert.doesNotMatch(characterDetailSource, /DETAIL_SKILLS/);
assert.doesNotMatch(entryShellSource, /getCharacterStatItems/);
assert.match(characterDetailMarkup, /基本情报/);
assert.match(characterDetailMarkup, /统率/);
```

- [ ] **Step 2: Run the targeted runtime UI tests to verify they fail**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime person detail reads keyed groups|entry shell summary reads keyed groups"
```

Expected:

- `FAIL`
- current UI still depends on flat person paths and hardcoded detail lists.

- [ ] **Step 3: Replace runtime UI reads**

Update runtime person summary/detail rendering to:

```ts
const groups = resolveRuntimePersonGroups(person);
const items = resolveRuntimePersonGroupItems(person, group.key);
```

Use each item’s `keyName` as the visible label and the resolved value as the rendered content. Remove the hardcoded `DETAIL_SKILLS`, `STAT_LABELS`, and fixed summary row source of truth.

- [ ] **Step 4: Run the targeted runtime UI tests to verify they pass**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime person detail reads keyed groups|entry shell summary reads keyed groups"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the runtime UI slice**

Run:

```bash
git add src/ui/entry-shell/entry-shell-view.js src/ui/views/character/character-detail-view.ts src/ui/app-render.ts src/application/content/active-game-content.ts tests/robustness.test.cjs
git commit -m "feat: drive runtime person ui from keyed attributes"
```

Commit body:

```text
Summary:
- remove hardcoded person summary/detail field lists in favor of keyed group resolution
- render runtime person labels from keyName and values from person-local keyed data
```

## Task 6: Migrate Gameplay And Runtime Consumers Off Flat Person Fields

**Files:**
- Modify: `src/application/character/runtime-property-mutation.ts`
- Modify: `src/application/grain-shop/grain-shop-snapshot.ts`
- Modify: `src/application/grain-shop/grain-shop-mutations.ts`
- Modify: `src/application/playables/grain-accounting/grain-accounting-definition.ts`
- Modify: `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`
- Modify: `src/application/medicine-house/medicine-house-mutations.ts`
- Modify: `src/application/tea-house/tea-house-mutations.ts`
- Modify: `src/application/tavern/tavern-mutations.ts`
- Modify: `src/domain/battle-formation.ts`
- Modify: `src/ui/panels/global-player-panel.ts`
- Read: `src/application/character/person-attribute-runtime.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - keyed person runtime reader and mutation helpers
- Produces:
  - gameplay/runtime consumers that no longer read or mutate flat `stats.*` / `skills.*`

- [ ] **Step 1: Write the failing gameplay consumer tests**

Add tests that assert the affected sources no longer match direct flat reads:

```js
assert.doesNotMatch(source, /characterDefinition\.stats\./);
assert.doesNotMatch(source, /characterDefinition\.skills\./);
assert.doesNotMatch(source, /playerCharacter\.stats\./);
assert.doesNotMatch(source, /playerCharacter\.skills\./);
```

Cover at least:

- runtime property mutation
- grain shop
- grain accounting
- medicine compounding
- medicine house mutation
- tea house mutation
- tavern mutation
- battle formation
- global player panel

- [ ] **Step 2: Run the targeted gameplay tests to verify they fail**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "gameplay consumers use keyed person attributes|runtime person mutation uses keyed attributes"
```

Expected:

- `FAIL`
- one or more consumers still read flat `stats.*` or `skills.*`.

- [ ] **Step 3: Replace the gameplay/runtime reads and writes**

Implement keyed reads and mutations, for example:

```ts
readRequiredNumericPersonAttribute(character, "2102")
mutateNumericPersonAttribute(character, "2107", delta)
```

Do not reintroduce a flat compatibility shell; each consumer must move to keyed reads/writes directly.

- [ ] **Step 4: Run the targeted gameplay tests to verify they pass**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "gameplay consumers use keyed person attributes|runtime person mutation uses keyed attributes"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit the gameplay consumer slice**

Run:

```bash
git add src/application/character/runtime-property-mutation.ts src/application/grain-shop/grain-shop-snapshot.ts src/application/grain-shop/grain-shop-mutations.ts src/application/playables/grain-accounting/grain-accounting-definition.ts src/application/playables/medicine-compounding/medicine-compounding-definition.ts src/application/medicine-house/medicine-house-mutations.ts src/application/tea-house/tea-house-mutations.ts src/application/tavern/tavern-mutations.ts src/domain/battle-formation.ts src/ui/panels/global-player-panel.ts tests/robustness.test.cjs
git commit -m "feat: migrate gameplay consumers to keyed person attributes"
```

Commit body:

```text
Summary:
- replace flat person stat and skill reads with keyed runtime attribute access in gameplay consumers
- migrate keyed person mutations into shared runtime consumer paths
```

## Task 7: Final Validation And Documentation Sync

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-28-script-editor-person-runtime-keyed-attribute-implementation-plan.md`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Update the repository change log**

Append a concise entry to `docs/change-log.md` summarizing:

```text
- hard-cut person authoring to runtime-keyed groups/mappings/values
- removed role and flat stats/skills/title-style person runtime reads
- moved player selection ownership to startup policy
```

- [ ] **Step 2: Run the full verification set**

Run:

```bash
npm.cmd run build:test
node --test tests/robustness.test.cjs
npm.cmd run typecheck
npm.cmd run lint:plans
```

Expected:

- `PASS`

- [ ] **Step 3: Sync plan governance state**

Update this plan file:

- mark completed checkboxes
- set `Execution State` to `completed-but-open` after verification passes
- append a `Progress Log` entry with the verification command results

- [ ] **Step 4: Commit the closeout slice**

Run:

```bash
git add docs/change-log.md docs/superpowers/plans/2026-07-28-script-editor-person-runtime-keyed-attribute-implementation-plan.md
git commit -m "docs: record runtime-keyed person cutover"
```

Commit body:

```text
Summary:
- document the person runtime-keyed cutover and its verification
- sync the legacy execution plan state after the hard cut lands
```

## Exit Check

- [ ] `ScriptEditorPersonRecord` no longer exposes flat person fields beyond `id`, `name`, and `personType`.
- [ ] Startup character selection is owned entirely by scenario startup policy.
- [ ] Script editor person UI renders visible `keyName`-driven groups and values over hidden runtime keys.
- [ ] Runtime person summary/detail UI resolves through keyed groups and values only.
- [ ] Gameplay/runtime consumers no longer read or mutate flat `stats.*` / `skills.*` person fields.
- [ ] No runtime consumer in the landed slice still reads `character.title`, `character.stats.*`, or `character.skills.*`.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Runtime-keyed person attribute hard cut`
- Parent Task: `Script Editor person runtime-keyed attribute implementation`
- Parent Stage: `Historical Governance Migration`
- Closeout Status: `waiting`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Choose an execution mode and begin Task 1 from this plan.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-script-editor-person-runtime-keyed-attribute-implementation-plan.md`
- Push Status: `none`
- Push Commit: `none`
- Resume From: `Open this plan, start Task 1, and keep docs/blueprints/project-progress.md visible for live repository governance context.`
