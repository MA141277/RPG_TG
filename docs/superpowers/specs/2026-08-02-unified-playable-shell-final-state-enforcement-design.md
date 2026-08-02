# Unified Playable Shell Final-State Enforcement Design

**Date:** 2026-08-02
**Status:** Draft for review
**Affected Mechanic:** all `playable` / `minigame` packages
**Task Classification:** `shared playable contract change`
**Change Level:** shared-contract level
**House-Hosted Contract Rules Apply:** yes, but only for authored launch/return ownership; playable lifecycle stays in shared runtime
**Governing References:**
- `AGENTS.md`
- `.codex/skills/playable-governance/SKILL.md`
- `.codex/skills/playable-governance/references/playable-doc-index.md`
- `.codex/skills/playable-governance/references/playable-governance-core.md`
- `.codex/skills/playable-governance/references/playable-change-checklist.md`
- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- `docs/superpowers/specs/2026-07-31-playable-minigame-independence-design.md`
- `docs/superpowers/specs/2026-08-02-temple-copy-scripture-independent-package-design.md`

## Goal

Define the repository's final playable packaging rule:

- all playable implementations live under one canonical path
- all playable implementations expose one mandatory shell contract
- the shared playable runtime loads only shell-compliant packages
- Script Editor and runtime both fail closed on non-compliant playables
- no intermediate adapter layer, compatibility layer, or dual-path migration is allowed

This design exists to stop the repository from producing another generation of half-retired runtime seams like the earlier `flow` residue.

## Decision

The repository adopts one final-state rule for every current and future playable:

```text
src/playables/<playable-id>/
```

Each playable must be a self-contained package that the shared playable runtime can load directly through one uniform shell contract.

No playable may depend on:

- building-local lifecycle ownership
- `main.ts` special branches
- per-playable adapter families
- compatibility re-export paths
- alternate legacy directories that remain runnable

## Why This Change Is Necessary

The repository already had the correct high-level direction: one unified playable runtime. The remaining problem is residue at the packaging and intake level.

Recent work exposed the failure mode clearly:

- one playable can be moved away from direct `main.ts` hardcoding
- but if that move introduces a bespoke adapter seam, the repository still creates a new local mechanism instead of converging on one shared mechanism
- if old and new paths coexist, cleanup is deferred and residue becomes permanent

This is the same pattern that caused old `flow` surfaces to remain alive after the visible module was already removed.

Therefore this change explicitly rejects staged architecture here. The repository must cut directly to the final packaging model.

## Final-State Architecture

The only allowed runtime line is:

```text
Script Editor/authored content
-> playable instance/integration metadata
-> shared playable registry
-> shared playable runtime
-> playable package shell
-> shared settlement/handoff
-> authored return/event continuation
```

The package shell is part of the playable runtime contract itself. It is not an extra adapter mechanism.

### Canonical Code Placement

All playable implementations must live under:

```text
src/playables/<playable-id>/
```

Typical contents:

```text
src/playables/<playable-id>/
  manifest.ts
  contract.ts
  session.ts
  reducer.ts
  presenter.ts
  settlement.ts
  index.ts
```

Exact file names may vary slightly, but the package root and public shell contract are mandatory.

### Forbidden Runnable Paths

The following may not remain as active runnable ownership paths after this change:

- `src/minigames/<id>/`
- `src/application/playables/builtin/<id>/` as the main playable implementation root
- `src/application/minigames/*` as live runtime ownership
- `src/ui/views/minigames/*` as feature-owned lifecycle seams
- any compatibility re-export that keeps old imports runnable for playables

If an old path is still needed for a playable to run, the migration is incomplete and must not be treated as accepted.

## Mandatory Playable Shell

Every playable package must expose one uniform shell surface consumable by the shared runtime.

Minimum required capabilities:

- stable `playableId`
- stable `family`
- manifest metadata
- package-local launch/session contract
- session creation
- command reduction
- presenter projection
- completion payload emission
- settlement payload declaration or normalized completion facts

One acceptable conceptual shape is:

```ts
export type PlayablePackageShell = {
  manifest: PlayableManifest;
  createSession: (input: PlayableLaunchInput) => PlayableSession;
  reduce: (session: PlayableSession, command: PlayableCommand) => PlayableSession;
  present: (session: PlayableSession) => PlayablePresenterModel;
  complete: (session: PlayableSession) => PlayableCompletionResult | null;
};
```

The exact repository type names can be refined during implementation, but the shell responsibilities are not optional.

### Shell Ownership Rule

This shell belongs to the shared playable runtime contract. It must not be split between:

- runtime-owned generic shell plus playable-specific host adapter
- package-owned reducer plus host-owned presenter translation
- package-owned mechanic plus host-owned launch/session identity translation

If a playable cannot be loaded directly by the shared shell, that playable is not valid under the final contract.

## Fail-Closed Intake Rule

The repository must reject any playable that does not satisfy the unified shell.

Enforcement is required at three layers:

1. Registry install  
   A playable without the required shell export shape cannot be registered.

2. Runtime launch  
   A playable id without a valid registered shell cannot launch. Runtime must fail closed rather than guessing, translating, or falling back.

3. Script Editor / export diagnostics  
   Authoring surfaces must not present or export a playable instance as valid if its target playable is not backed by a compliant shell package.

This means "no shell, no load" is a repository rule, not only a documentation guideline.

## Authoring And Creator Constraint Rules

New playable creators must follow one constrained workflow:

1. Create a package only under `src/playables/<playable-id>/`
2. Implement the mandatory shell contract
3. Register it through the shared playable registry
4. Use Script Editor/content records only for instance configuration, launch, settlement routing, and authored follow-up

Creators must not:

- add a new per-playable adapter concept
- route launch through house-local custom lifecycle code
- add a `main.ts` branch
- pick a custom code path outside `src/playables/<playable-id>/`
- bypass registry install
- bypass runtime shell validation
- invent a custom completion or exit protocol outside the shared contract

## Host Boundary

Buildings, scenes, tasks, and other owners may only do the following:

- launch a playable through authored event/playable definitions
- receive normalized completion and settlement continuation
- continue with authored post-playable event logic

Hosts may not:

- own playable session lifecycle
- translate playable-specific command sets
- render custom lifecycle-driving overlays outside the shared shell
- patch return behavior in `main.ts`

This keeps house-hosted playables aligned with the Script Editor arrangement/event/playable path and prevents another hidden owner chain from forming.

## Explicit Prohibition On Intermediate States

For this migration, the following are explicitly disallowed:

- intermediate adapter seams
- temporary compatibility re-export layers
- dual runnable directories
- "migrate one package now, keep old registry path for later"
- "keep the host adapter for now, unify it later"
- runtime fallbacks that accept legacy playable packages

This is a direct final-state conversion.

If a change requires both old and new playable loading paths to coexist, the design is invalid and must be rewritten before implementation.

## Impact On Current Temple Direction

The earlier 2026-08-02 temple package direction is no longer the target architecture.

Specifically, the previously proposed split:

- package under `src/minigames/temple-copy-scripture/`
- host adapter under `src/application/playables/builtin/temple-copy-scripture/`

is rejected as a final repository pattern because it creates a new long-lived adapter seam.

The corrected target is:

- `temple-copy-scripture` moves into `src/playables/temple-copy-scripture/`
- its runtime-facing shell is consumed directly by shared playable runtime
- any remaining host-specific behavior must be expressed through existing shared runtime/settlement/handoff contracts, not a bespoke adapter family

## Required Repository Cleanup In The Same Batch

This change must remove, not preserve:

- old flow-owned playable continue shells already identified as residue
- old playable directory roots that remain runnable
- playable-specific runtime branches
- playable-specific `main.ts` command/exit branches
- compatibility exports kept only to soften migration

The cleanup is part of the acceptance boundary, not follow-up work.

## Allowed Layers To Change

- `src/core/contracts/playable-runtime.ts`
- `src/core/runtime/**` where shared playable loading/session ownership is defined
- `src/core/registry/**` for direct shell-based playable registration
- `src/playables/**`
- Script Editor playable validation/export surfaces
- scenario-pack and builtin-template playable records if normalization is required
- `tests/**` for source guards, intake guards, runtime guards, browser acceptance
- `docs/change-log.md`

## Acceptance Criteria

1. Every runnable playable implementation lives under `src/playables/<playable-id>/`.
2. Shared playable runtime consumes one unified shell contract directly from those packages.
3. No playable requires a bespoke adapter, compatibility re-export, or alternate runnable directory.
4. `main.ts` contains no playable-specific business branch for lifecycle, command routing, closeout, or return behavior.
5. Script Editor and export/runtime diagnostics fail closed on non-shell-compliant playables.
6. A new playable cannot become runnable unless it satisfies the canonical path plus shell rules.
7. Existing retained playables still launch, play, settle, and return through the authored event/playable path after the cleanup.
8. Repository tests include source guards that block reintroduction of adapter seams, compatibility loading, or non-canonical playable paths.

## Implementation Direction

Implementation must proceed as one final-state batch:

1. lock the forbidden residue with failing source/runtime tests
2. define the unified shell contract under shared playable runtime
3. move runnable playable implementations into `src/playables/<id>/`
4. delete old runnable paths and any adapter/compat residue
5. add fail-closed registry/runtime/editor enforcement
6. verify authored browser flows still work end to end

No step in the implementation plan may rely on temporary compatibility.
