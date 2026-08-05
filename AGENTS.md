# RPG_TG Agent Rules

This repository uses strict module-boundary rules for any new `house` implementation.

## Immediate Execution Workflow Governance

AI collaborators must read and follow `docs/agent-immediate-execution-workflow.md` for repository tasks that are executable in the current workspace.

Core rule:

- once the next executable slice is identified, do not stop and report it as a final answer
- execute that slice immediately unless a documented blocker applies
- only use final answer when no executable next slice remains, or a real blocker prevents further execution

Final Answer Precheck Summary:

- before any final answer, run a precheck: if a clear and safe next slice still exists, especially one the agent has already proposed or recommended in the current reply, do not answer finally and continue execution instead
- if that slice is not executed, record the blocker explicitly

This workflow constraint does not override a user request to stop at discussion, planning, review, or explanation only.

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

If a user asks to:

- create a new house
- implement a house instance
- clone or prototype a house
- add a special house feature
- extend an existing house with minigame / trade / dialogue / service flow

you must stop and present the house interface contract first.

Do this before writing code, editing files, or proposing a concrete implementation.

The contract to present is defined in:

- `docs/special-house-interface.md`

## Hard Constraints For House Work

When implementing any special house module:

1. Do not hardcode house-specific business branches in `src/main.ts`.
2. Do not make `main.ts` import a concrete house business module directly unless the user explicitly asks for a temporary prototype-only exception.
3. Do not return HTML strings from `application/*` modules.
4. Do not store persistent house gameplay data in ad hoc top-level globals.
5. Do not overwrite player base stats, money, skills, or inventory as part of house-session initialization.
6. All persistent gameplay changes must flow through unified game state structures.
7. All house modules must conform to the interface and lifecycle rules in `docs/special-house-interface.md`.

## Required Response Pattern

For any request to add or build a house instance, the first response must:

1. Say that the house must follow the repository house interface contract.
2. Summarize the required interface sections.
3. State any current mismatch in the codebase if relevant.
4. Only then proceed with design or implementation.

## Documentation Update Rule

If a house module changes shared interfaces, runtime session structure, registry shape, or cross-module wiring, update:

- `docs/special-house-interface.md`
- `docs/change-log.md`

## Mechanism-First Design Rule

For gameplay loop, progression, review/council flow, timed skip, assignment, minigame, or story-driven system work:

1. Do not treat the current request as a one-off scene or one-off house patch by default.
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

## Main Shell / Resource / Style Governance

If a task touches any of the following areas:

- `src/main.ts`
- top-level app bootstrapping
- runtime / startup / render coordinators
- UI action dispatch
- map interaction wiring
- backpack or inventory actions
- house action wiring
- event / dialogue / playable runtime wiring
- resource imports or resource paths
- layout presenter / layout view boundaries
- CSS / style files / design tokens

the agent must read and follow:

- `docs/main-shell-contract.md`

Before editing these areas, the agent must check whether the change belongs in:

- an existing feature module
- a runtime coordinator
- a startup coordinator
- a render coordinator
- a presenter
- a transition / compat layer

Do not add new feature business logic to `src/main.ts`.

If the correct owner is unclear, do not put the logic in `src/main.ts`; place it in the documented transition layer and record the target owner and cleanup condition.

For styles, new CSS should use design tokens. Do not add hardcoded colors, z-index values, arbitrary spacing, or viewport-scaled font sizes unless the exception is documented as described in `docs/main-shell-contract.md`.

When modifying `src/main.ts`, resource wiring, layout boundaries, or styles, update or add guard tests where practical.

## Spine Plugin Trigger

If the user says "启动spine插件", "启动 Spine 插件", "打开骨骼绑定工具", or asks to start the spine/binding editor, use the project skill:

- `.codex/skills/start-spine-plugin/SKILL.md`

The tool and collaboration rules are documented in:

- `docs/spine-plugin.md`

Do not treat this as house work. Start the dev server if needed and explain the tool's save rules, especially that new piece images must live under `src/faxian/leg/` and JSON stores `leg:` references rather than image bytes.

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
6. Do not mark a child or task `closed` unless structured closeout, project-progress sync, next-step sync, and remote push success are all recorded.
7. Do not leave a `blocked` plan without recording the blocker in `Progress Log`.
8. When creating or materially restructuring a plan, run `npm run lint:plans`.
