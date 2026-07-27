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
