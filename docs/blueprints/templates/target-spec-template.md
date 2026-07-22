# Version Title

## Control Block

- version_id: `target.replace-me`
- version_label: `replace-me`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Replace with the version goal.`

### Version Draft Summary

- Goal:
  - `Replace with the one-sentence operator draft goal.`
- Required outcomes:
  - `Replace with required outcome 1.`
  - `Replace with required outcome 2.`
- Explicit non-goals:
  - `Replace with non-goal 1.`
  - `Replace with non-goal 2.`
- Must preserve:
  - `Replace with compatibility path or behavior to preserve.`
- Must replace:
  - `Replace with legacy structure or behavior to replace.`
- Reference material:
  - `Replace with memo, PRD, bug, prior queue, or code reference.`

### Evidence Draft Review

- evidence_draft_status: `reviewed | pending`
- reviewed_by_operator: `yes | no`
- review_summary:
  - `Replace with the short operator-reviewed summary of target coverage, queue split, high-risk drift points, and first queue recommendation.`

### Draft Requirement Coverage

| Draft Requirement | Acceptance IDs | Status |
| --- | --- | --- |
| `Replace with draft requirement.` | `ACC-REPLACE-001` | `covered | unmapped` |

### Scope

- `Replace with in-scope item 1.`
- `Replace with in-scope item 2.`

### Non-Goals

- `Replace with out-of-scope item 1.`
- `Replace with out-of-scope item 2.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.replace-me` | `required` | `required evidence family` | `Replace with the contract admission rule.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-REPLACE-001` | `Replace with a testable requirement.` | `queue.replace-me` | `unit | integration | source-removal | coverage-review` | `src/or/tests/path` | `Replace with what blocks closeout if this remains uncovered.` |

### Acceptance Criteria

- `Replace with acceptance criterion 1.`
- `Replace with acceptance criterion 2.`

### Final Acceptance Coverage Contract

- `Final validation must review the Acceptance Matrix rather than only running a representative happy path.`
- `Every required acceptance must be covered, blocked, or explicitly accepted as non-blocking residue before version closeout.`
- `Final validation must not become the primary owner for implementation acceptance unless the acceptance is itself a validation-only requirement.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `Replace with a short historical interpretation only when needed.`
