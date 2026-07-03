# Child 30 Playable Runtime Skeleton And Integration Registry Spec

**Goal:** Establish the shared playable runtime skeleton, playable definition registry, and scenario-owned integration-instance registry so later playable migrations can resolve by `playableId` and exactly one `integrationId`.

## Why This Child Exists

The approved playable runtime contract is now repository-level truth, but the repository still has no concrete `playable` runtime shell that owns:

- unified playable definition lookup
- integration-instance lookup
- launch normalization to one `integrationId`
- shared session/result/handoff ownership

Current covered interactive work still routes through `src/core/runtime/interactive-runtime.ts`, while house-local mechanics and `story-battle` still keep their own launch/result seams. Without a skeleton child first, later migrations would either duplicate runtime glue or start moving concrete playables onto unstable interfaces.

## Baseline Snapshot

At baseline:

- `src/core/runtime/interactive-runtime.ts` still owns the covered runtime dispatch for `activity-qte`, `city-begging`, and `story-battle`
- `src/main.ts` still knows concrete interactive launch/action ids for those covered paths
- the repository has no first-class `PlayableIntegrationId` registry or launch-resolution seam
- house-local mechanics such as `grain-accounting` and `medicine-compounding` remain outside the covered runtime family and therefore cannot be migrated cleanly until the shared skeleton exists

Detailed current ownership mapping is recorded in:

- `docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md`

## In Scope

- one shared playable runtime contract family in code
- one shared playable definition registry
- one shared integration-instance registry centered on `integrationId`
- one minimum runtime entry that can normalize launch to one `integrationId`
- one minimum session/result/settlement/handoff shell for later children
- minimum validation and trigger-evaluation seams required by the approved playable contract

## Out Of Scope

- migrating `activity-qte` or `city-begging`
- migrating `grain-accounting` or `medicine-compounding`
- migrating `story-battle`
- deleting current compatibility paths before later children prove parity
- full scaffold / validator / CI closeout

## Expected End State

The target shape after Child 30 is:

```text
launch request -> playable integration resolution -> playable definition registry
-> playable runtime session/presenter/settlement shell -> compatibility callers
```

At end state:

- the repository has one framework-owned runtime shell for playables
- the shell can resolve one `integrationId` before session creation
- later migration children can move concrete playables onto this shell without redesigning the shell itself

## Exit Conditions

- a shared playable contract family exists in code
- a shared playable definition registry exists
- a shared integration-instance registry exists
- the runtime can normalize launch to exactly one `integrationId`
- compatibility with current production behavior remains intact for later children
- `npm run typecheck`
- `npm run build`

## Verification Story

Implementation must include:

- targeted checks that the playable registry exists
- targeted checks that the integration registry exists
- targeted checks that launch normalization resolves or rejects ambiguously rather than guessing
- targeted checks that current covered behavior remains compatible while concrete migrations are deferred

## Risk Notes

- The main risk is building too much concrete migration into the skeleton child.
- Another risk is introducing a registry shell that still depends on concrete playable naming branches in `main.ts`.
