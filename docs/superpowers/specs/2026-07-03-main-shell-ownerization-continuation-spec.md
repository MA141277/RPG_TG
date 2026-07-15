# Main Shell Ownerization Continuation Spec

**Goal:** Continue post-Child-24 shell-boundary convergence so `src/main.ts` moves closer to a pure shell while remaining work is routed into explicit runtime owners.

## Why This Spec Exists

`Child 24` closed the first main-runtime ownerization seam, but it intentionally did not exhaust all remaining shell-boundary debt. A fresh continuation set is required so later work stays bounded, queue-controlled, and split by problem type instead of collapsing back into one open-ended `main.ts` cleanup stream.

The target of this continuation set is not to make `src/main.ts` smaller for its own sake. The target is to keep `src/main.ts` inside a fixed shell contract:

- browser lifecycle and DOM mount
- loading and visibility wiring
- UI event collection
- request construction and dispatch
- presenter invocation
- render invocation
- canvas / WebGL / overlay synchronization
- consumption of already-settled state and content context

Everything outside that shell contract must belong to an explicit runtime owner.

## Queue Covered By This Spec

- Child 25: navigation/time follow-up de-shell
- Child 26: render purity contract
- Child 27: startup story bootstrap ownership
- Child 28: active content ownership convergence
- Child 29: legacy startup seam retirement

## Architectural Constraints

- `main-runtime-orchestrator` may exist as a migration facade, but it must not become a permanent universal gameplay center.
- Each extracted responsibility must land in an explicit owner, not in a new anonymous helper layer.
- Builtin and mod-first paths must converge rather than diverge.
- Render must not mutate gameplay state.
- Weekly queue depth must remain controlled so continuation work does not expand without a fresh review.

## Queue Policy

- only one child may be executable at a time
- one immediate queued follow-up may be visible
- one locked follow-up may be visible
- anything beyond that remains candidate-only until a later weekly review promotes it

## Success Conditions

This continuation set is successful only when:

- `src/main.ts` no longer owns the covered post-settlement follow-up addressed by the active child
- render is treated as a display phase rather than a gameplay mutation phase
- startup/bootstrap and content ownership continue moving toward explicit runtime owners
- later startup convergence no longer depends on legacy primary-path seams
- each boundary claim is documented through child-level verification
