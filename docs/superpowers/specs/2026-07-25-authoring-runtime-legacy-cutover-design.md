# Authoring Runtime Legacy Cutover Design

## Status

- Status: `proposed`
- Date: `2026-07-25`
- Owner: `Codex`
- Scope: `Removes creator-facing, runtime, import/export, and save/load legacy residue so the project recognizes only one canonical contract for Script Editor authoring, scenario packs, settlement/runtime consumption, and persisted state.`

---

## 1. Purpose

The current project still carries multiple forms of legacy residue:

- creator-facing fields that no longer belong to the formal contract
- old settlement attribute names that survive through alias rewrites
- import and loader paths that still accept retired shapes
- save/load code that still attempts to migrate old state
- weakly typed city/building custom attributes that do not align with runtime settlement truth

That residue creates two problems:

1. it keeps hidden transition stages alive
2. it allows authoring or data shapes that are not the real runtime truth

This design performs a canonical cutover:

- no transition period
- no compatibility import
- no legacy runtime aliasing
- no save migration compatibility
- one formal contract only

---

## 2. Design Goals

1. Remove all creator-facing legacy and transition residue from Script Editor contracts.
2. Remove runtime alias paths that allow old field names to keep working.
3. Remove import/export/loader tolerance for retired or transitional data shapes.
4. Remove save/load compatibility for retired persisted state.
5. Converge city and building custom attributes onto a typed calculable model consistent with settlement runtime consumption.
6. Keep exactly one canonical key and one canonical truth path for every authorable and persisted field.

---

## 3. Non-Goals

- phased migration
- compatibility bridges for older projects, packs, or saves
- silent rewrite of retired field names during load/import/runtime execution
- preserving creator-facing access to deprecated fields because they once existed
- keeping duplicate authoring names for the same runtime meaning

---

## 4. Canonical Contract Rules

### 4.1 Single Contract Rule

Every supported field must have exactly one formal representation across:

- Script Editor schema
- creator-facing UI
- export/import
- scenario pack loader
- runtime consumption
- persisted save/load state

If a field or key needs a runtime rewrite table to remain valid, it is legacy and must be removed unless it becomes the single formal key.

### 4.2 No Transition Rule

The repository must not preserve "temporary" acceptance paths such as:

- legacy field aliases
- compatibility import
- fallback migration of retired authoring records
- save upgrade paths for retired runtime state
- dual acceptance of both old and new field names

Retired shapes must fail fast.

### 4.3 Creator Truth Rule

The creator-facing field name must match the formal system meaning.

The editor must not expose:

- fields that runtime does not formally consume
- old names that are translated later
- technical fallback names kept only for compatibility

### 4.4 Runtime Truth Rule

Runtime must consume only canonical keys and canonical state partitions.

Runtime must not:

- accept old aliases and rewrite them internally
- dual-write old and new state shapes
- preserve compatibility mirrors after the cutover

---

## 5. Attribute Model Cutover

### 5.1 Problem

People already use typed attributes. Cities and buildings still use weak custom attribute entries while also carrying some historical base-attribute residue.

That mismatch creates fake capability:

- some fields appear authorable
- some fields appear settlement-operable
- runtime still depends on special-case key handling

### 5.2 Target Model

City and building custom attributes must converge to the same typed-authoring model family used for people:

```ts
type TypedAttributeRecord = {
  key: string;
  label?: string;
  type: "number" | "boolean" | "enum" | "string";
  value?: string | number | boolean;
  options?: string[];
};
```

Cities and buildings should use typed custom attributes rather than weak key/value entries.

### 5.3 Settlement Eligibility

Settlement may target only:

- canonical runtime fields
- typed custom attributes whose type is `number`, `boolean`, or `enum`

Settlement may not target:

- `string` typed attributes
- storage-only metadata
- retired alias keys
- creator-only descriptive fields

### 5.4 Example Consequence

Fields such as city population must not re-enter the system as hardcoded base attributes.

If population is needed, it must exist as:

- a city typed custom attribute
- with a formal type such as `number`
- using the same canonical key through authoring, export/import, runtime, and persistence

---

## 6. Settlement Contract Cutover

### 6.1 Current Residue To Remove

The current settlement path still contains historical alias-style keys such as:

- `baseAttributes.prosperity`
- `baseAttributes.security`
- `baseAttributes.level`
- `baseAttributes.outputMultiplier`
- `baseAttributes.damaged`

Some of these are later rewritten into different runtime fields.

That rewrite layer is itself legacy residue.

### 6.2 Target Rule

Settlement authoring, export/import, scenario loading, and runtime execution must all use the same canonical attribute key.

There must be no authoring key that means:

- one thing in editor
- another thing in runtime

If city runtime truth is `danger`, then settlement must use `danger`, not a translated alias such as `baseAttributes.security`.

If building runtime truth is `level`, then settlement must use `level`, not a translated alias such as `baseAttributes.level`.

### 6.3 Operator Rules

- `number` attributes: `set`, `add`, `subtract`
- `boolean` attributes: `set`
- `enum` attributes: `set`
- `string` attributes: unsupported

These rules must be enforced identically in editor validation, export/import, loader validation, and runtime execution.

---

## 7. Import, Loader, and Save/Load Policy

### 7.1 Export

Runtime pack export writes only canonical fields.

Any retired field still present in authoring state is an error.

### 7.2 Import

Runtime pack import does not perform compatibility rewriting.

If imported data uses a retired field, retired family, or retired routing shape, import fails.

### 7.3 Scenario Loader

Scenario loading accepts only canonical pack fields.

Retired or ambiguous payloads fail immediately. The loader no longer acts as a migration layer.

### 7.4 Save/Load

Save/load accepts only the current save contract.

Old save envelopes, old runtime-state mirrors, and migration-only compatibility branches are removed. Legacy saves are unsupported after the cutover.

---

## 8. Workstreams

### 8.1 Schema and Authoring Surface

- remove retired city/building base-attribute residue from Script Editor data definitions
- replace city/building weak custom attribute entries with typed attribute records
- remove creator-visible deprecated field selectors and deprecated settlement attribute options

### 8.2 Export / Import / Scenario Loading

- remove compatibility import paths
- remove retired-field tolerance
- reject old settlement routing residue
- validate only canonical typed attribute and canonical settlement key usage

### 8.3 Runtime

- remove settlement alias rewrite tables
- consume only canonical attribute keys
- write only canonical runtime state
- remove dual-shape persistence or mirror behavior

### 8.4 Save / Load

- remove legacy save migrations
- remove legacy runtime-state normalization branches
- reject retired save structures

### 8.5 Tests and Documentation

- replace compatibility tests with fail-fast tests
- update docs so the repository no longer describes compatibility stages that no longer exist
- document the canonical city/building typed-attribute model and settlement key rules

---

## 9. Acceptance Criteria

This cutover is complete only when all of the following are true:

1. Script Editor exposes no retired or alias field names.
2. City and building custom attributes are typed and settlement-eligible only when calculable.
3. Settlement runtime accepts no alias key rewrites.
4. Export/import/loader reject retired fields instead of migrating them.
5. Save/load rejects legacy save formats instead of upgrading them.
6. Tests assert rejection of retired formats rather than continued compatibility.
7. No production path requires a "legacy", "compatibility", "retired but accepted", or migration-only branch to keep canonical execution working.

---

## 10. Risks and Tradeoffs

### 10.1 Immediate Breakage Is Intentional

After this cutover:

- old packs may stop loading
- old editor projects may fail validation
- old saves may stop loading

This is expected behavior under the approved no-transition rule.

### 10.2 Scope Breadth

The change spans authoring, runtime, persistence, and tests. It must therefore be executed as one coordinated cutover rather than disconnected cleanup patches.

### 10.3 Naming Discipline

The largest regression risk is reintroducing hidden aliases after the cutover. Reviews and tests must therefore treat any new alias acceptance path as a contract violation.

---

## 11. Recommended Execution Order

1. inventory all remaining retired fields, aliases, compatibility paths, and save migrations
2. freeze the canonical field set and typed-attribute contract
3. cut over schema and creator-facing UI
4. cut over export/import and scenario loader validation
5. cut over runtime settlement and state handling
6. remove save/load migration paths
7. rewrite tests and docs to enforce the new contract

This order ensures upstream authoring truth is fixed before downstream runtime and persistence cleanup lands.
