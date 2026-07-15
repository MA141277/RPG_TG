# Playable Scaffold And Validator I/O Draft

## 1. Goal

Define a repository-realistic input/output draft for later playable scaffold and validator tooling before any production implementation starts.

This document is doc-only and candidate-only. It does not add commands or tooling yet.

## 2. Planned Commands

Later repository-owned commands should include:

- `npm run scaffold:playable`
- `npm run scaffold:playable-integration`
- `npm run validate:playables`

## 3. `scaffold:playable` Draft

### 3.1 Purpose

Create the mechanic-facing repository skeleton for one new playable.

### 3.2 Required Inputs

- `playableId`
- `family`
- `kind`
- `title`

Recommended CLI shape:

```bash
npm run scaffold:playable -- ^
  --playable-id city-begging ^
  --family minigame ^
  --kind pointer-runner ^
  --title "City Begging"
```

### 3.3 Optional Inputs

- `description`
- `shared-content`
- `ui-layout`
- `with-tests`

### 3.4 Expected Outputs

Minimum generated paths:

- `src/application/playables/<playableId>/<playableId>-definition.ts`
- `src/application/playables/<playableId>/<playableId>-session.ts`
- `src/application/playables/<playableId>/<playableId>-presenter.ts`
- `src/application/playables/<playableId>/<playableId>-metrics.ts`
- `src/application/playables/<playableId>/<playableId>-settlement.ts`
- `src/ui/views/playables/<playableId>-view.ts`
- `tests/playables/<playableId>.test.ts`
- `src/content/playables/<playableId>-content.ts`

Optional generated artifact stubs:

- `docs/superpowers/authoring/playable-mechanic.<playableId>.md`

### 3.5 What It Must Not Ask The Author To Decide

- registry install location
- asset root location
- `main.ts` glue points
- scenario reward logic
- owner return policy
- trigger wiring

## 4. `scaffold:playable-integration` Draft

### 4.1 Purpose

Create one scenario-owned integration artifact for an existing playable.

### 4.2 Required Inputs

- `integrationId`
- `playableId`
- `pack`
- `ownerKind`
- `ownerId`

Recommended CLI shape:

```bash
npm run scaffold:playable-integration -- ^
  --integration-id zhuyuanzhang.house.kulan-grain-shop.grain-accounting.default ^
  --playable-id grain-accounting ^
  --pack zhuyuanzhang ^
  --owner-kind house ^
  --owner-id house.kulan.grain_shop
```

### 4.3 Optional Inputs

- `return-policy`
- `entry-key`
- `trigger-kind`
- `with-brief`

### 4.4 Expected Outputs

Minimum generated paths:

- `src/content/scenario-packs/<pack>/playables/<integrationId>.json`

Optional generated artifact stubs:

- `docs/superpowers/authoring/playable-integration.<integrationId>.md`

### 4.5 Generated Stub Shape

Recommended JSON draft:

```json
{
  "integrationId": "zhuyuanzhang.house.kulan-grain-shop.grain-accounting.default",
  "playableId": "grain-accounting",
  "owner": {
    "ownerKind": "house",
    "ownerId": "house.kulan.grain_shop",
    "returnPolicy": "reenter-owner"
  },
  "trigger": {
    "triggerId": "zhuyuanzhang.house.kulan-grain-shop.grain-accounting.default.trigger.default",
    "when": []
  },
  "outcomeConfig": {
    "successWhen": [],
    "failureWhen": [],
    "cancelWhen": [],
    "rewardsByOutcome": {
      "success": [],
      "failure": [],
      "cancelled": []
    },
    "handoffByOutcome": {}
  }
}
```

Rule:

- empty arrays are scaffold placeholders only
- validator must reject shipping this unchanged when the spec requires real values

## 5. `validate:playables` Draft

### 5.1 Purpose

Validate mechanic artifacts, integration artifacts, and cross-reference correctness before runtime launch or merge.

### 5.2 Minimum Inputs

- repository filesystem
- playable definition registry inputs
- integration artifact files
- optional pack manifests when integration artifacts are pack-owned

### 5.3 Minimum Outputs

- exit code `0` on success
- non-zero exit code on failure
- human-readable grouped errors
- machine-stable error codes if possible

Recommended output groups:

- `id-errors`
- `registry-errors`
- `integration-errors`
- `trigger-errors`
- `outcome-errors`
- `handoff-errors`
- `placement-errors`

## 6. Validator Rules Draft

### 6.1 Mechanic Artifact Checks

- `playableId` format is valid
- `family` is valid
- required definition files exist
- required exported definition symbol exists
- duplicate `playableId` does not exist

### 6.2 Integration Artifact Checks

- `integrationId` format is valid
- referenced `playableId` exists
- `ownerKind` is valid
- `ownerId` presence matches owner requirements
- duplicate `integrationId` does not exist

### 6.3 Trigger Checks

- trigger artifact exists when the integration path requires one
- trigger ids are unique
- trigger definitions do not omit required owner linkage

### 6.4 Outcome Checks

- `successWhen`, `failureWhen`, and `cancelWhen` are not all absent
- forbidden empty placeholder config is rejected
- reward fallback use is explicit rather than inferred
- ambiguous or contradictory outcome config is rejected

### 6.5 Handoff Checks

- allowed handoff policies only
- missing handoff config follows spec fallback rules only where permitted
- `resume-owner` requires recoverable owner semantics

### 6.6 Placement Checks

- mechanic files use repository-owned canonical locations
- integration files use repository-owned canonical locations
- assets are not scattered into unrelated house folders

## 7. Example Validator Failures

### 7.1 Duplicate Playable Id

```text
[playable-id-duplicate] playableId "city-begging" is declared more than once.
```

### 7.2 Missing Integration Outcome Config

```text
[integration-outcome-missing] integrationId "zhuyuanzhang.house.kulan-grain-shop.grain-accounting.default" has no valid success/failure/cancel rule set.
```

### 7.3 Illegal Owner Omission

```text
[owner-context-missing] integrationId "zhuyuanzhang.scene.temple-begging.city-begging.default" requires ownerId for ownerKind "scene".
```

## 8. Draft Validator Modes

Recommended later modes:

- `validate:playables -- --mode strict`
- `validate:playables -- --mode scaffold`

Meaning:

- `strict`
  - merge-ready validation
- `scaffold`
  - allows fresh scaffold placeholders but marks them clearly as incomplete

## 9. Planned Relationship To CI

Later CI should at minimum run:

```bash
npm run validate:playables
```

And fail the merge when:

- ids are malformed
- required artifacts are missing
- integration config is invalid
- forbidden placeholder state remains in a claimed ready artifact

## 10. Non-Goals

This draft does not yet define:

- exact parser implementation language
- exact schema library
- exact JSON vs TS artifact split

It only defines the repository-owned I/O contract that later implementation should satisfy.
