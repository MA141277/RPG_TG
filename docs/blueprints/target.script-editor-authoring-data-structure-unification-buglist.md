# Script Editor Authoring Data Structure Unification Bug List

## Document Control

- document_id: `target.script-editor-authoring-data-structure-unification-buglist`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- document_role: `version-problem-ledger`
- created_at: `2026-07-15`
- active_truth_owner: `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- scheduling_effect: `none`

## Usage Rules

- This document records source-backed problems discovered while the version remains open.
- An entry in this document is not queue admission or implementation authorization.
- Candidate and execution truth remains owned by the current version plan.
- New findings should record observable behavior, current implementation evidence, governance coverage, and acceptance requirements.
- Closing an entry requires verified runtime behavior, persistence coverage, and synchronization with the owning queue or version records.

## Open Problems

### BUG-001: Custom Runtime Properties Do Not Have A Unified Mutation And Persistence Path

- status: `open`
- severity: `high`
- classification: `current-version-governance-gap`
- affected_families:
  - `character custom properties`
  - `CharacterStatus`
  - `runtime effects and mutations`
  - `house actions`
  - `browser save and startup restore`

#### Observable Behavior

- Zhu Yuanzhang starts with a configured authored money value of `120`.
- A temple donation of `100` immediately changes the materialized in-memory character value.
- After browser refresh, continuing the same saved game may restore the authored value instead of the post-donation value.
- Starting a new game and selecting Zhu Yuanzhang should restore the authored value and is not itself a defect.
- The defect applies when the same saved game is continued and the runtime mutation is not restored.

#### Current Implementation Evidence

- `CharacterStatus.statPatch` and `CharacterStatus.skillPatch` are limited to fixed `CharacterStatKey` and `SkillKey` fields.
- CharacterStatus materialization stores resolved absolute values and overlays them over authored character definitions.
- The covered city-begging settlement emits `characterStatusById` patches and participates in runtime commit, browser save, and startup restore.
- The temple donation path directly replaces the player's `characterDefinitions` entry after subtracting the donation amount.
- The temple donation result does not emit an equivalent `characterStatusById` patch.
- Multiple feature modules implement field-specific helpers such as `mutatePlayerGold`, so migration coverage depends on each consumer remembering to call the correct helper.
- The script editor can expose `customMap` authoring controls, but that does not provide a generic runtime mutation or persistence contract for those custom fields.

#### Root Cause

The repository has a bounded CharacterStatus persistence mechanism, but it does not yet have one schema-driven runtime property mutation mechanism. Runtime consumers can still modify materialized definitions directly or use feature-local fixed-field mutation helpers. As a result, adding or renaming a creator-defined field can reproduce the same persistence failure in another gameplay path.

#### Why A Gold-Specific Fix Is Insufficient

- Routing temple donation through a gold-specific helper would repair only the current field.
- A creator may replace the money field with another custom property id.
- City, building, event, task, house, and playable consumers would still be able to bypass the status store.
- Additional field-specific mutation helpers would duplicate behavior and make persistence coverage dependent on business-module implementation details.

#### Existing Governance Coverage

- `queue.script-editor-character-definition-status-convergence`
  - Completed the bounded CharacterDefinition and CharacterStatus overlay contract.
  - Covered only selected fixed stat, skill, and stamina mutation helpers.
- `queue.script-editor-character-status-save-runtime-continuation`
  - Completed AppState aggregation, save-envelope persistence, startup restore, and the covered city-begging settlement.
  - Explicitly excluded broad house and playable consumer migration.
- `queue.script-editor-character-authoring-surface-completion`
  - Covers creator-facing `customMap` controls.
  - Explicitly excludes gameplay formulas and broad runtime consumer changes.
- `queue.script-editor-event-effect-activation-convergence`
  - Covers typed effects, target resolution, receipts, and runtime mutation ownership.
  - Its recorded event-oriented boundary does not by itself guarantee house, shop, or playable mutation convergence.
- `queue.script-editor-status-overlay-generalization-review`
  - Reviews non-character runtime overlays.
  - It does not explicitly own arbitrary character custom-property mutation.

No current candidate or active queue explicitly owns the complete generic custom-property mutation, persistence, and consumer-migration problem.

#### Required Final Mechanism

- Define schema-governed runtime property ids and value types.
- Resolve feature semantics, such as the primary currency, through creator-configured property bindings instead of hardcoded field names.
- Provide one runtime mutation command supporting bounded operations such as `set`, `add`, and `subtract`.
- Validate the target entity, property definition, value type, operation, and configured constraints before applying a mutation.
- Materialize the current value from the authored default plus the runtime overlay.
- Persist the resolved final value under the canonical save/status owner.
- Keep authored character, city, and building definitions immutable during gameplay.
- Route event, house, shop, task, and playable mutations through the same mechanism rather than feature-local property writers.
- Do not create empty status records for new games or entities that have not been mutated.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-runtime-property-mutation-and-status-convergence`
- proposed_class: `required`
- proposed_goal: `Establish a schema-driven runtime property mutation and status persistence mechanism for creator-defined properties, then migrate representative direct-write consumers without creating feature-specific durable truths.`
- admission_note: `The current active queue remains the sole execution queue. This suggestion must enter version-level classification and admission review before implementation.`

#### Proposed Queue Boundary

In scope:

- Generic runtime property mutation contract.
- Character custom-property status storage and materialization.
- Semantic property binding for gameplay concepts such as primary currency.
- Canonical runtime commit and browser save/restore integration.
- Temple donation as the first failing representative consumer.
- At least one event/effect-driven representative consumer.
- Detection or tests preventing covered consumers from directly mutating authored definitions.

Out of scope:

- Inventing new gameplay systems.
- Full migration of every repository consumer in one unbounded batch.
- Non-character overlay implementation unless fresh evidence proves it is a prerequisite.
- Compatibility-only fallback that silently maps arbitrary custom properties back to `gold`.
- Editing live save status from the normal script-editor authoring surface.

#### Acceptance Criteria

- A creator-defined numeric character property can be selected through a semantic binding and changed by a runtime action.
- `set`, `add`, and `subtract` operations produce deterministic resolved values.
- The runtime result writes the resolved value to the canonical status owner.
- Browser save preserves the custom-property value.
- Continuing the same saved game restores the custom-property value after refresh.
- Starting a new game does not inherit the previous save's runtime property values.
- Authored definitions remain unchanged during mutation, save, and restore.
- Temple donation uses the generic property mechanism and restores the post-donation value when the same save is continued.
- Changing the configured primary-currency property id does not require changing temple business code.
- Invalid entity ids, property ids, value types, or unsupported operations fail closed with actionable diagnostics.
- Final end-to-end validation covers authoring, export, runtime mutation, save, refresh, continue, and restored value inspection.

#### Verification Evidence Required For Closure

- Unit tests for property definition validation and mutation operations.
- Runtime commit tests for custom-property status aggregation.
- Browser save-envelope round-trip tests.
- Startup restore tests proving authored-definition immutability.
- Temple donation regression test.
- End-to-end browser or equivalent integration test for refresh and continue behavior.
- Repository search evidence showing the covered temple path no longer directly writes the configured currency field.

