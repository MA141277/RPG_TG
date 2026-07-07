# Mod-First Unified Contract Roadmap Design

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

**Goal:** Move the repository from partial runtime ownerization to a mod-first architecture where builtin content and external mods enter the same runtime pipeline through stable contracts rather than scenario-specific glue.

## Why This Roadmap Exists

The `2026-07-02` weekly continuation set is already closed after Child 14, Child 15, and Child 16. Those children converged the covered navigation/time/event/scene seams that were still visibly stitched in `src/main.ts`.

That means the next roadmap must not pretend that Child 15 or Child 16 are still pending. The next roadmap must start from the remaining mod-first blockers that still keep builtin content and external contributions on different paths:

- scenario-owned content is still directly imported from `src/content/scenario-packs/zhuyuanzhang/**` in several production consumers
- `src/main.ts` still remains the largest orchestration black box even after the covered Child 15/16 reductions
- `task-runtime`, `house-runtime`, and `mod-runtime` exist only as first slices rather than one unified mod-facing contract family
- gameplay contribution registration is still split across static registries and local imports
- builtin startup, imported packs, save restore, and later gameplay execution do not yet prove one end-to-end mod-first closure

## Current State Snapshot

### Already Landed

- `src/core/runtime/navigation-runtime.ts` owns the covered `enter-city` runtime entry path.
- `src/core/runtime/time-runtime.ts` owns the covered `day-start` and `advance-segments` runtime entry paths.
- `src/core/runtime/event-runtime.ts` and `src/core/runtime/scene-runtime.ts` own the covered `triggerStoryEventsForTiming()` handoff path.
- `src/core/runtime/task-runtime.ts` provides a first formal task lifecycle and signal-processing slice.
- `src/core/mods/mod-runtime.ts` provides a first formal mod activation seam.
- `src/core/runtime/house-runtime.ts` provides a first runtime bridge around house enter/dispatch/leave.

### Remaining Structural Debt

- `src/content/story/index.ts` still imports `zhuyuanzhang` event/scene/text JSON directly.
- `src/content/houses/*.ts` and some `src/application/house-modules/**` files still import `zhuyuanzhang` pack-owned content directly.
- `src/application/house-modules/house-module-registry.ts` is still a builtin static registry rather than a mod-owned registration surface.
- `src/domain/content-pack.ts` and `src/application/content/content-pack-loader.ts` do not yet expose a stable task contribution surface.
- `src/core/registry/content-registry.ts` and `src/core/registry/mod-registry.ts` are still placeholder-grade seams rather than a unified gameplay contribution registry.
- `src/main.ts` still mixes browser shell work with runtime follow-up and activation/write-back concerns.

## End State

The target architecture is:

```text
request -> router -> sub-runtime -> settlement -> state sync -> presenter
```

At end state:

- `src/main.ts` owns browser shell input, startup wiring, and render orchestration only
- builtin content and imported mods both activate through the same mod/runtime path
- navigation, event, scene, task, and house all expose typed mod-facing contracts
- gameplay extension lands through manifests, registries, and contribution contracts rather than hardcoded scenario imports
- direct scenario-specific imports disappear from production runtime consumers

## Sequencing Rules

This roadmap uses six children because the remaining debt is not one problem type.

### Rule 1

Do not reopen Child 15 or Child 16. Treat them as completed history.

### Rule 2

Do not execute any of these children from the closed `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`.

### Rule 3

Each child must own one primary problem type:

- content decoupling
- runtime spine unification
- task mod-facing contract
- house mod registration
- contribution registry
- end-to-end closure

### Rule 4

If a child changes house shared interfaces, runtime session structure, or registry shape, update:

- `docs/special-house-interface.md`
- `docs/change-log.md`

### Rule 5

Every child must prove builtin stability before claiming external mod parity.

## Child Sequence

### Child 17: Pack Content Decoupling

Remove direct `zhuyuanzhang` imports from production content consumers and force pack-owned data access through active runtime content or registries.

### Child 18: Runtime Spine Unification

Continue shrinking `src/main.ts` by converging remaining mixed runtime entry/follow-up orchestration behind shared runtime request and settlement seams.

### Child 19: Task Runtime Mod Contract

Promote task runtime from first-slice internal subsystem to a content-pack/mod-facing contract with typed registration, load, persistence, and runtime signal ownership.

### Child 20: House Runtime Mod Registration

Promote the existing house runtime bridge and static module registry into a mod-registered house capability surface that still obeys the repository house interface contract.

### Child 21: Unified Gameplay Contribution Registry

Add one registry layer that lets mod runtime validate and install navigation/event/scene/task/house contributions with dependency and conflict rules instead of ad hoc static imports.

### Child 22: End-to-End Mod-First Runtime Closure

Prove builtin and external mod parity across startup, activation, runtime play, save, restore, and render-facing state.

## Child Boundaries And Dependencies

| Child | Must Start With | Must Not Absorb | Exit Condition |
| --- | --- | --- | --- |
| 17 | current direct-import baseline | runtime redesign | production consumers no longer hard-import pack content |
| 18 | post-Child-17 content access seams | new contribution families | `main.ts` loses remaining covered runtime glue |
| 19 | post-Child-18 runtime spine | house registration redesign | tasks are loadable and signalable through mod-facing contract |
| 20 | post-Child-19 task contract | unrelated story-system redesign | house registration and session ownership are mod-facing |
| 21 | post-Child-20 contribution surfaces | end-to-end save/render closure | one registry validates gameplay contributions |
| 22 | post-Child-21 unified registry | new gameplay systems | builtin and external paths share one verified runtime flow |

## Verification Policy

Each child must include:

- targeted robustness coverage for its own ownership claim
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` when plan/governance docs change

Children that change content-pack or manifest shapes should also add loader/parser tests.

Children that change house shared contracts must include a direct regression guard for the `docs/special-house-interface.md` boundary assumptions.

## Governance Note

These six plans may be authored ahead of promotion, but they are not allowed to execute until a fresh weekly review creates a new weekly orchestration plan and promotes one child at a time.

Do not attach these plans to the closed `2026-07-02` weekly set.

## Planned Artifact Set

- `docs/superpowers/plans/2026-07-02-child-17-pack-content-decoupling-plan.md`
- `docs/superpowers/plans/2026-07-02-child-18-runtime-spine-unification-plan.md`
- `docs/superpowers/plans/2026-07-02-child-19-task-runtime-mod-contract-plan.md`
- `docs/superpowers/plans/2026-07-02-child-20-house-runtime-mod-registration-plan.md`
- `docs/superpowers/plans/2026-07-02-child-21-unified-gameplay-contribution-registry-plan.md`
- `docs/superpowers/plans/2026-07-02-child-22-end-to-end-mod-first-runtime-closure-plan.md`

