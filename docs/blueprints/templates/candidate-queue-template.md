# Candidate Queue Entry Template

## Control Block

- candidate_id: `queue.replace-me`
- state: `candidate | prepared | active`
- goal: `Replace with the bounded queue goal.`
- entry_conditions: `Replace with the evidence that allows direct activation.`
- artifacts_needed:
  - `artifact.replace-me`
- drop_if: `Replace with the condition that removes or absorbs this candidate without execution.`
- on_failure: `stay-candidate | absorb-into-target | transition-needed | decision_required`

## Human Context

- `candidate` means bounded but not yet executable.`
- `prepared` means bounded enough that activation no longer requires discovery work.`
- `active` means the target execution_queue now points at this queue.`
- `Prepared is not a second execution slot.`
