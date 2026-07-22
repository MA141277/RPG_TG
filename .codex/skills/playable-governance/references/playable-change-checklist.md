# Playable Change Checklist

## A. Add New Playable

1. Decide whether this is truly a new mechanic or only a new integration of an existing mechanic.
2. If an existing mechanic already fits, prefer a new integration over a new `playableId`.
3. Assign a stable `playableId`.
4. Choose a valid `family`.
5. Define integration ownership:
   - `house`
   - `scene`
   - `task`
   - `external`
6. Identify:
   - launch path
   - presenter path
   - settlement path
   - handoff path
7. Verify no new `src/main.ts` business branch is required.
8. Verify any house host only launches or consumes and does not own lifecycle.
9. Add or update tests for launch, active session, settlement, and owner return.
10. State whether shared runtime or registry changes are required.

## B. Modify Existing Playable

1. Identify the affected `playableId` and integrations.
2. Classify the change:
   - content or rules only
   - session shape
   - command contract
   - presenter model
   - settlement logic
   - owner handoff
3. Determine whether the change is:
   - local-only
   - shared-contract
4. Check impact on:
   - runtime
   - registry
   - owner integrations
   - house host flow
   - tests
5. Verify no duplicate local lifecycle is introduced.
6. Verify naming and artifact conventions still hold.
7. Escalate if a supposedly local change alters launch identity, owner return, or session persistence.

## C. House-Hosted Playable Work

1. Confirm the host house follows `docs/special-house-interface.md`.
2. Keep the house responsible only for:
   - launch trigger
   - host-side session or overlay consumption
   - post-playable branch consumption already allowed by shared seams
3. Escalate if the house must start owning lifecycle because a shared seam is missing.

## D. Shared-Contract Escalation Signals

Escalate to shared-contract work when any of these are true:

- multiple playables or integrations must change together
- runtime request or result shapes change
- registry lookup behavior changes
- owner handoff semantics change
- the playable can no longer be described as one host-local adjustment
