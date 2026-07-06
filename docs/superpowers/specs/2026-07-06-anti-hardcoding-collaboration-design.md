# Anti-Hardcoding Collaboration Design

Date: `2026-07-06`
Branch context: `mod-first` / `mod-first-dev`
Status: `proposed`

## 1. Goal

Define a shared collaboration contract that prevents the team from reintroducing hardcoded scenario content, UI layout data, and content-owned branching into runtime code while the project is being migrated onto the mod-first structure.

This design must be light enough to adopt immediately, but strict enough to block the most common regressions during branch merges.

## 2. Problem Statement

The current repository already has partial migration from hardcoded content into JSON/content tables, but collaboration still has three active regression paths:

1. scenario prose or choice semantics drift back into `src/application/**`, `src/ui/**`, or `src/main.ts`
2. layout coordinates, asset bindings, and screen structure get patched directly in view code or CSS instead of the existing layout contract path
3. feature branches merge content-related conditions by hardcoding text names, scene names, or one-off flags into UI and runtime logic

Branch convergence increases this risk because older branches still carry pre-mod-first structure and habits.

## 3. Non-Goals

- fully eliminate every existing hardcoded string in one pass
- replace the current content/runtime architecture with a new large framework
- require AST-heavy lint infrastructure before the team can keep moving
- block generic engine copy, diagnostics, or pack-agnostic UI text that is intentionally runtime-owned

## 4. Recommended Approach

Adopt a two-layer enforcement model:

1. human-readable collaboration contract
2. lightweight fail-closed repository gate

This is recommended over documentation-only because the current merge cadence is too high to rely on memory. It is also recommended over a fully strict schema-first rollout because the repository is still in transition and should not absorb a large enforcement rewrite right now.

## 5. Collaboration Contract

The collaboration contract should be added to the main team-facing workflow docs and should define the following boundaries.

### 5.1 Content Ownership Boundary

The following content must not be newly authored inside runtime code:

- scenario prose
- option text
- scene jump targets that belong to authored story flow
- reward, requirement, and outcome parameters that are content-authored rather than engine-authored
- house- or pack-specific labels used as runtime truth

Runtime code may consume:

- ids
- typed config
- validated content tables
- generic engine messages

Runtime code must not use:

- direct Chinese prose matching as branch conditions
- scene-name string matching as business logic
- content text as the canonical source of gameplay state

### 5.2 Layout Ownership Boundary

The following UI data must not be newly authored in ad hoc screen/view/CSS logic when the screen is already on the layout path:

- component coordinates
- component sizes
- component background assets
- component/element placement
- editor-managed layout defaults

These values must be maintained through the existing layout preset / contract path.

### 5.3 Runtime Branching Boundary

When UI or gameplay conditions depend on scenario-owned content, runtime code must branch on:

- ids
- facts
- typed status fields
- validated flags or config values

Runtime code must not branch on:

- localized visible text
- handwritten story labels
- temporary content nicknames

### 5.4 Temporary Exception Rule

If a hardcoded fallback is temporarily unavoidable, the change must include:

- a nearby `TEMP-HARDCODE` marker comment
- the intended migration target
- the removal condition

Unmarked temporary hardcoding is treated as a regression.

## 6. Executable Gate

Add a lightweight script-driven gate, initially exposed as `npm run lint:hardcoding`.

### 6.1 Gate Scope

The first version should scan:

- `src/application/**`
- `src/ui/**`
- `src/main.ts`

The first version should explicitly exclude or whitelist:

- `src/content/**`
- existing content audit docs
- layout preset sources that are already the intended ownership path
- generic engine-owned copy that is already accepted by tests

### 6.2 Gate Behavior

The gate should fail when it detects likely regressions such as:

- newly introduced Chinese prose in runtime ownership zones
- direct use of scene/story prose as runtime branch logic
- suspicious layout literals in view-layer files for screens that already use layout contracts
- new `TEMP-HARDCODE` markers without required migration metadata

The gate should prefer a small number of reliable checks over a large number of noisy heuristics.

### 6.3 Gate Strategy

Phase 1 should use a simple script plus explicit allowlists.

This keeps the rule:

- easy to inspect
- easy to tune
- cheap to run in local merge validation

AST-level enforcement can be added later after the migration surface stabilizes.

## 7. Merge Workflow Integration

The merge workflow should add a short anti-hardcoding checklist for any branch that changes gameplay flow, scenario flow, or UI layout behavior.

Required review questions:

1. Did this change move authored content into runtime code?
2. Did this change bypass the layout preset / contract path?
3. Did this change introduce content-owned branching through visible text instead of ids/config/facts?
4. If there is a temporary exception, is it marked with a migration target and removal condition?

## 8. File Impact

Planned implementation targets:

- `docs/collaboration.md`
- `AGENTS.md`
- `package.json`
- a new lightweight hardcoding gate script under `tools/`
- possibly `docs/change-log.md` if the new collaboration boundary is treated as a project-level workflow change

## 9. Verification

Implementation should be considered complete only if:

- the collaboration rule is written in team-facing docs
- the gate is runnable through `npm`
- the gate passes on the current branch baseline
- existing tests still pass

## 10. Risks And Mitigations

### Risk: false positives block normal work

Mitigation:

- start with narrow scope
- use explicit allowlists
- document the intended ownership zones clearly

### Risk: rules exist but reviewers do not enforce them

Mitigation:

- place the contract in `docs/collaboration.md`
- add a short pointer in `AGENTS.md`
- make the gate part of merge validation habit

### Risk: temporary exceptions become permanent

Mitigation:

- require `TEMP-HARDCODE` markers with migration metadata
- make unmarked exceptions fail the gate

## 11. Recommended Rollout

1. write the collaboration contract into docs
2. add the lightweight gate
3. verify current baseline
4. require new branches from `mod-first-dev` to follow the rule
5. later tighten the gate only after observing real violations and noise
