# RPG_TG Agent Rules

This repository uses Script Editor-authored building arrangements and event-triggered playable flows for building behavior.

## AI Collaboration Governance

AI collaborators must follow `docs/ai-collaboration-governance.md` before changing scenario packs, Script Editor import/export/runtime preview, event routing, building arrangements, navigation, playable/minigame/QTE/story-battle behavior, scenario-specific UI/code, or shipped assets/resources.

This is an execution-time rule, not a human-facing suggestion. If a request is not explicitly about changing the mod framework, Script Editor capability, shared runtime, shared UI renderer, or shared playable contract, default to treating the work as scenario-pack data authoring.

The governing hard rules include:

- Default-To-Scenario-Pack Rule
- Scenario Pack Mirror Rule
- Unified Event Route Rule
- Playable / Minigame Governance
- Asset / Resource Governance
- Schema / Contract Version Rule
- ID Stability Rule
- Deletion / Migration Rule
- Runtime Preview Acceptance Rule
- Round-Trip Rule
- Reference Integrity Rule
- Ownership Rule
- No Silent Duplication Rule
- Acceptance Evidence Rule
- Localization / Text Rule
- Ordering / Determinism Rule
- Backward Compatibility Policy Rule
- Asset Size / Format Rule
- Security / External Resource Rule
- No Hidden Base-Pack Dependency Rule
- No Scenario Branch Rule
- Export / Import / Preview Symmetry
- Fail-Closed Rule
- Persistent State Rule
- Verification Rule

## Mandatory Trigger

If a user asks to add or change building behavior, first inspect whether the behavior belongs in:

- Script Editor building arrangements and containers
- event bindings
- event-triggered playable flow definitions
- shared runtime mechanisms

## Hard Constraints For Building Work

When implementing building behavior:

1. Do not hardcode building-specific business branches in `src/main.ts`.
2. Do not make `main.ts` import concrete building business modules directly unless the user explicitly asks for a temporary prototype-only exception.
3. Do not return HTML strings from `application/*` modules.
4. Do not store persistent building gameplay data in ad hoc top-level globals.
5. Do not overwrite player base stats, money, skills, or inventory as part of building-session initialization.
6. All persistent gameplay changes must flow through unified game state structures.
7. Building behavior must be authored as arrangement containers, events, playable flows, or reusable shared runtime mechanisms.

## Required Response Pattern

For any request to add or change building behavior, the first response must:

1. Say that building behavior must follow the Script Editor arrangement/event/playable-flow path.
2. Summarize the affected authoring surfaces.
3. State any current mismatch in the codebase if relevant.
4. Only then proceed with design or implementation.

## Documentation Update Rule

If building arrangements, container contracts, event trigger wiring, playable flow contracts, runtime session structure, or cross-module wiring change, update:

- `docs/change-log.md`

## Repository Commit Message Rule

For every git commit in this repository:

1. The commit message must use a typed subject in the form `<type>: <brief title>`.
2. The message body must contain a `Summary:` section after a blank line.
3. `Summary:` must contain at least one bullet describing the actual content landed by that commit.
4. Merge commits are not exempt. They must also carry a real content summary.
5. Generic one-line messages without body summary are invalid, even if the diff itself is small.

Repository enforcement for this rule lives in:

- `tools/validate-commit-message.mjs`
- `.githooks/commit-msg`
- `.github/workflows/validate-commit-messages.yml`

## Mechanism-First Design Rule

For gameplay loop, progression, review/council flow, timed skip, assignment, minigame, or story-driven system work:

1. Do not treat the current request as a one-off scene or one-off building patch by default.
2. First inspect whether the repo already has a similar mechanism, cadence, or lifecycle that should be extracted and reused.
3. Prefer refining a reusable mechanism component, shared state machine, or shared runtime contract over copying a flow into another module.
4. If an implementation feels like a temporary story insert, hand-written special branch, or duplicated house logic, stop and redesign the shared mechanism first.
5. When a feature is intentionally stage-specific, keep the stage-specific part in data/content, and keep the flow skeleton reusable.

Typical examples that should be treated this way include:

- periodic review / council flows
- contribution ranking and praise
- policy / strategy announcement
- work assignment and execution-cycle handoff
- map-based time skip / fast-forward
- reusable QTE or other minigame shells

## Genre Reference Rule

This project is a Taiko-like historical simulation game. Agents must not invent core gameplay concepts from scratch when established genre patterns already exist.

Before proposing or implementing a new gameplay loop, system concept, or pacing structure:

1. Check the existing repo for a corresponding mechanic first.
2. Align with classic Taiko-style and other proven historical simulation design patterns where applicable.
3. Reuse known genre concepts, cadence, and terminology unless the user explicitly asks for a deliberate deviation.
4. Only invent a new mechanic when existing repo structures and genre precedents both fail to fit the requirement.

In short:

- prefer extraction over duplication
- prefer reusable systems over temporary patches
- prefer genre-proven design over ad hoc invention

## Playable Governance Trigger

If a user asks to:

- add a new minigame
- add a new playable
- modify an existing minigame or playable
- integrate a playable into a building, scene, task, or external flow
- change QTE / city-begging / grain-accounting / medicine-compounding / story-battle behavior
- discuss playable runtime, playable integration, playable settlement, or playable handoff

you must first use:

- `.codex/skills/playable-governance/SKILL.md`

If the playable is hosted from a building, route it through Script Editor authored events and playable flow definitions.

## Spine Plugin Trigger

If the user says "启动spine插件", "启动 Spine 插件", "打开骨骼绑定工具", or asks to start the spine/binding editor, use the project skill:

- `.codex/skills/start-spine-plugin/SKILL.md`

The tool and collaboration rules are documented in:

- `docs/spine-plugin.md`

Do not treat this as building work. Start the dev server if needed and explain the tool's save rules, especially that new piece images must live under `src/faxian/leg/` and JSON stores `leg:` references rather than image bytes.

## Superpowers Plan Governance

For work tracked under `docs/superpowers/plans/`:

1. New plan files must follow `docs/superpowers/plans/_plan-template.md`.
2. Plan structure and lifecycle rules must follow `docs/superpowers/specs/plan-governance-spec.md`.
3. Before resuming governed work, inspect `docs/superpowers/project-progress.md` first, then open the referenced owner document.
4. After each completed work batch, update:
   - checkbox state
   - `Execution State`
   - `Progress Log`
5. Do not mark a child plan `closed` if required verification has not passed.
6. Do not mark a child or task `closed` unless structured closeout, project-progress sync, next-step sync, and repository sync result are all recorded. Remote push failure must be recorded as sync result, but must not block child/task closeout or the next lawful queue/child handoff.
7. Do not leave a `blocked` plan without recording the blocker in `Progress Log`.
8. When creating or materially restructuring a plan, run `npm run lint:plans`.
