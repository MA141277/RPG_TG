# Task 2 Report: Clean The Person Authoring Surface To Show Only Stable Creator Data

## Scope

- `src/ui/main-ui/main-ui-flow.js`
- `src/application/script-editor/person-authoring.ts`
- `tests/robustness.test.cjs`

## What Changed

- Added a person authoring-surface section model in `person-authoring.ts` with:
  - `ensurePersonAttributeGroups(...)`
  - `buildPersonAttributeEditorSections(...)`
- Kept the fixed person profile fields in the authoring surface, but filtered custom-attribute cards down to creator-authored extensions only.
- Removed the hardcoded person ability and skill editing blocks from the profile panel in `main-ui-flow.js`.
- Switched the person custom-attribute card list to read from the filtered authoring-surface model so runtime-derived `stats.*`, `skills.*`, and other hidden compatibility keys no longer surface as creator cards.
- Added regressions for both:
  - the authoring-surface model contract
  - the UI source contract that forbids hardcoded `stats.*` / `skills.*` profile inputs

## Verification

- RED:
  - `npm.cmd run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "person authoring surface"`
  - Failure reason: `buildPersonAttributeEditorSections is not a function`
- GREEN:
  - `npm.cmd run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "person authoring surface"`
  - Result: pass
- Final gate:
  - `node --test tests/robustness.test.cjs`
  - Result: pass

## Notes

- The workspace was already dirty before Task 2 started. This task layered its person authoring changes onto the existing workspace state without reverting unrelated edits.
- Task 3 runtime character detail consumption was intentionally left untouched.

## Fix Wave

- Restored editable custom-attribute keys in the person editor UI by reintroducing the `key` input and wiring the input handler back to `updateScriptEditorPersonAttribute(...)`.
- Repaired `getScriptEditorFamilyLabel()` so creator-facing headings, pagination labels, and notices use the proper Chinese labels instead of `??` / `????` placeholders.
- Removed the out-of-scope person `stage` tab and the Task-2-local person stage/progress-track binding panel, actions, and handlers from `main-ui-flow.js`.
- Kept Task 2 bounded to the authoring surface; `person-authoring.ts` already supported custom-key renames and did not need a model change for this fix wave.

## Fix Wave Verification

- `npm.cmd run build:test`
  - Result: pass
- `node --test tests/robustness.test.cjs --test-name-pattern "person authoring surface"`
  - Result: pass
- `node --test tests/robustness.test.cjs`
  - Result: pass
