# Playable Impact Matrix

## Low Impact

- text changes
- question deck changes
- tuning values
- local reward numbers
- local presenter copy or layout details

Examples:

- tweak `grain-accounting` score thresholds
- adjust `medicine-compounding` text or grading copy

## Medium Impact

- one playable's local session rules
- one playable's settlement logic
- one integration trigger path
- one host house launch flow

Examples:

- adjust `grain-accounting` house launch behavior without changing registry rules
- adjust `city-begging` local completion thresholds while preserving runtime contract

## High Impact

- playable session shape
- shared command contract
- shared runtime launch path
- shared integration registry behavior
- owner handoff contract
- family expansion
- `src/main.ts` playable entry behavior

Examples:

- adding a new owner return pattern
- changing how runtime resolves `integrationId`
- introducing a new playable family beyond `minigame` or `battle`

## Escalate As Shared-Contract Change When

- multiple playables must change together
- runtime request or result contracts change
- registry behavior changes
- a new owner kind or handoff pattern is introduced
- a house host must start owning lifecycle due to a missing shared seam
