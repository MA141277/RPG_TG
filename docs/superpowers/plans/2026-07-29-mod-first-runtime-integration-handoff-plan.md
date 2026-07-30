# Mod First Runtime Integration Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Continue migrating runtime capabilities from `mod-first-dev` into the current UI/map/backpack baseline without overwriting the baseline experience.

**Architecture:** Treat `mod-first-dev` as a reference source, not as a branch to merge directly. Runtime compatibility and bridge behavior must be centralized in core/application runtime seams, while visible UI, entry shell, map, backpack, and current feature behavior remain owned by the `origin/codex/sync-naqishuo-721ui-to-mmz` baseline. Each future slice should be small, tested, committed, pushed, and then merged back through the agreed baseline flow.

**Tech Stack:** TypeScript, Vite, Node test runner, PowerShell git workflow, runtime contract tests under `tests/*.test.cjs`, `npm.cmd run build:test`, `npm.cmd run typecheck`, and `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-30`
- Current Focus: `The latest adjacent runtime-only child is Runtime Event Settlement Id Payload Consumption. Story-runtime settlement continuation now consumes RuntimeEventEntity.payload.settlementId through shared readRuntimeEventSettlementId(...), and story-settlement-continuation accepts a routed settlement-id override while preserving authored fallback behavior. Story-runtime direct-entry already applies pre-start routed actions from RuntimeEventEntity.payload.actions through shared readRuntimeEventActions(...) plus applyRuntimeActions(...), routed dialogue/settlement handlers already consume canonical taskInputs from RuntimeEventEntity.payload, authored runtime payload still flows through shared src/core/runtime/event-entity-projection.ts, Authored EventDefinition still accepts emitEventIds, the command-native settlement contract lives at src/core/contracts/settlement-runtime.ts with SettlementEmitter naming, runtime-settlement remains fully command-native with translateEffectsToSettlementCommands(...) plus mapCommandSettlementToEffects(...) as explicit compatibility helpers around settleRuntimeCommands(...), and the branch still keeps settleRuntimeCommands(...) as the canonical runtime-settlement entry. The shared event-chain owner from fa5e434 remains in place, Story Source Event Continuation Convergence remains pushed at fb32b99, Story Choice Event Continuation Convergence remains pushed at 5879e60, Scene Runner Start Event Convergence was pushed at 5f81978, Scene Runner Scene-End / single-seam Convergence was pushed at e875ee6, event-runtime trigger activation routes through dispatchEventRoute(...), event-binding-runtime routes binding-selected events through the same shared event-router seam, navigation.enter-house routes houseDefinition.onEnterEventId through navigation-runtime's shared router seam, story-runtime routes the former state-only binding local-start branch back through routeStoryDirectEntry(...), scene/dialogue runtime wrappers inject a shared router-owned continuation seam, continueToEvent(...) is narrowed behind the pure resolveEventContinuation(...) seam, the four owner runtimes converge routed activation on shared createEventRouteActivationHandlers(...), explicit caller-specific startEvent(...) paths are gone outside the shared seams, and settlement-authored story follow-up events continue through settlement.nextEventId on that same direct-entry seam.`
- Next Step: `Commit and push the runtime-event-settlement-id-payload-consumption checkpoint, then continue with the next runtime-only event-system migration slice.`
- Verification: `The earlier task-input child remains merged back at 91780be and the scene-runtime child remains pushed at 9acb1ae. Story Direct Event Entry Convergence was previously verified and pushed at a0eddfe. Story Source Event Continuation Convergence was committed and pushed at fb32b99. Story Choice Event Continuation Convergence was committed and pushed at 5879e60. Scene Runner Start Event Convergence was pushed at 5f81978. Scene Runner Scene-End / single-seam Convergence was pushed at e875ee6. Event Trigger Runtime Route Convergence was committed and pushed at f9cfd32. Event Binding Runtime Route Convergence was committed and pushed at 193741c. Navigation Enter House Route Convergence was committed and pushed at 54450ac. Story Runtime State-Only Binding Route Convergence was committed and pushed at 436da03. Scene Dialogue Runtime Continuation Route Convergence was committed and pushed at f4b8337. Event Continuation Contract Narrowing was committed and pushed at 3c44795. Runtime Route Activation Seam Convergence was committed and pushed at 1a14b9b. Final Explicit Event Start Seam Convergence was committed and pushed at 4f26bfc. Story Settlement Runtime Owner Convergence was committed and pushed at b0de0be. Settlement Command Runtime Phase One was committed and pushed at 0059e92. Settlement Command Money Phase Two was committed and pushed at c1eb9f2. Settlement Runtime Command Canonical Entry is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/settlement-command-runtime.test.cjs (24/24 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (441/441 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Runtime Settlement Commands Caller Phase One is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs tests/runtime-settlement-content.test.cjs (24/24 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (442/442 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Time Advance Settlement Command Direct Callers is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs (4/4 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "covered settlement path stays on shared runtime ownership|child 31 city-begging completion clears shared playable session after settlement|time advance settlement command direct callers|runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (443/443 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Runtime Settlement Effects Compatibility Optional is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs (13/13 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime result settlement payload exposes canonical settlement commands|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (444/444 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Runtime Dispatch Command Settlement Direct is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs (9/9 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (448/448 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Runtime Dispatch Effect Settlement Contract Removal is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs (9/9 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (449/449 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Runtime Settlement Effect Adapter Removal is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs (21/21 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" (450/450 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). Runtime Event Settlement Id Payload Consumption is locally verified via PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test (pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/story-settlement-continuation.test.cjs (18/18 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|story settlement runtime owner convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render" (457/457 pass), PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck (pass), boundary diff (empty), and git diff --check (empty). pnpm run lint:plans still fails only on the unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced.`
- Notes: `Current branch is codex/migration-hot-tasks and tracks origin/codex/migration-hot-tasks. Local submit/merge work no longer uses codex/mod-first-runtime-integration as the active continuation branch. Task 1 audit found no non-UI production caller of applyEventOwnedPlayableCompletion(), so caller wiring stayed deferred until the user explicitly approved a tiny main.ts slice. That approval is still only used for narrow storyContent passthrough in src/main.ts and the active runtime behavior remains in application/core seams. The first Task 4 slice closed the earlier gap where indoor-screen and house-enter timing triggers could fire settlement events without projecting city/building authored-definition changes back into app-state status layers. This second Task 4 slice now consumes eventBindings/progressTracks in shared story-runtime for orchestrated trigger-story-events plus house/indoor timing paths, and stores progression runtime state on optional gameState.runtime.progression. navigation-time-follow-up city-enter already moved through the dedicated shared story-runtime follow-up child at docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md; later handoff-document or hot-task commits may still exist only on the current branch until explicitly merged back. The runtime migration code stack was already merged into origin/codex/sync-naqishuo-721ui-to-mmz at commit 8d8e5145. The existing docs/superpowers/project-progress.md still points at an unrelated map renderer child; do not close or repoint that child unless the user explicitly asks.`

## Progress Log

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime event action payload application. Story-runtime direct-entry now applies pre-start routed actions from RuntimeEventEntity.payload.actions through shared readRuntimeEventActions(...) plus applyRuntimeActions(...), so routed action ownership no longer falls back to eventDefinition.actions on the shared direct-entry seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 14/14; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 456/456; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue with the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime event task input payload consumption. Story-runtime's routed dialogue/settlement handlers now read canonical taskInputs from RuntimeEventEntity.payload through shared readRuntimeEventTaskInputs(...), so routed task input ownership no longer falls back to eventDefinition.taskInputs on the shared router seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 455/455; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue with the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime event entity payload projection. Authored runtime payload now flows through one shared src/core/runtime/event-entity-projection.ts seam, and the live story/event/binding/navigation/scene wrappers no longer collapse payload to {} before dispatchEventRoute(...).`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event entity payload projection|event router runtime core|event entity emit event ids propagation|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 454/454; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue with the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for authored event multi-follow-up propagation. EventDefinition now accepts emitEventIds and the current story/event/binding/navigation/scene runtime event-entity projection seams preserve that field, so authored multi-follow-up intent no longer drops before routing.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 11/11; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event entity emit event ids propagation|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 453/453; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue with the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement-emitter rename. The command-native settlement contract now exports SettlementEmitter instead of EffectEmitter, so the remaining effect-era exported core type name is gone from the settlement runtime seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement emitter rename|settlement runtime contract rename|runtime settlement effect adapter removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 452/452; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue with the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement-runtime contract rename. The surviving command-native settlement contract moved from src/core/contracts/effect-settlement.ts to src/core/contracts/settlement-runtime.ts, runtime-settlement plus content-pack consumers now import the renamed file, and the legacy effect-era contract filename has been deleted.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement runtime contract rename|runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 451/451; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue with the next command-native settlement/test cleanup slice below the renamed contract surface.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime-settlement effect adapter removal. settleRuntimeEffects(...) plus EffectSettlementApplier / EffectSettlementInput / EffectSettlementResult are removed, and runtime-settlement-content now exercises translateEffectsToSettlementCommands(...) plus mapCommandSettlementToEffects(...) around settleRuntimeCommands(...) directly, leaving runtime settlement fully command-native.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 450/450; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue from the remaining command-native settlement/test cleanup surface instead of any effect adapter seam.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime-dispatch effect-settlement contract removal. runtime-dispatch.ts now derives its local compatibility typing from settleRuntimeCommands(...) and mapCommandSettlementToEffects(...) instead of importing EffectSettlementInput / EffectSettlementResult from src/core/contracts/effect-settlement.ts, so the compat contract is no longer part of the dispatch owner path.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 449/449; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then continue the next lower-level runtime-only cleanup beneath the remaining effect-settlement adapter seam.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime-dispatch command settlement direct. runtime-dispatch now lowers routed/task effects through settleRuntimeCommands(...) directly, while runtime-settlement exports the minimal shared translation helpers needed to preserve dispatch-side settledEffects / unsupportedEffects / warning compatibility diagnostics without duplicating effect->command mapping rules.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 448/448; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then open the next lower-level runtime-only cleanup beneath settleRuntimeEffects(...) instead of widening back into shell/UI ownership.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement.effects compatibility narrowing. RuntimeSettlementResult.effects is now optional, runtime-dispatch only carries settlement.effects when legacy settlement metadata actually provides it, and state-sync-runtime still settles explicit legacy settlement.effects payloads without treating that field as canonical required surface.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime result settlement payload exposes canonical settlement commands|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 444/444; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this compatibility-narrowing checkpoint, then choose whether the next adjacent runtime-only child removes settlement.effects fallback outright or narrows another compatibility seam first.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement.effects fallback removal. state-sync-runtime now settles only settlement.commands during runtime commit flow, commitRuntimeRequest no longer mutates app state from legacy settlement.effects payloads, and settlement.effects remains compatibility metadata only outside the lower-level adapter surfaces.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects fallback removal|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 445/445; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this fallback-removal checkpoint, then choose the next adjacent runtime-only compatibility cleanup instead of reopening runtime-flow settlement mutation.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for playable settlement compatibility narrowing. PlayableSettlement.effects is now optional, createPlayableSettlementShell(...) no longer emits default effects: [] shells, and completed flow playable results only carry compatibility effects when explicitly provided by a caller.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/flow-playable-runtime-dispatch.test.cjs` passed 2/2; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "playable settlement effects compatibility optional|runtime settlement effects fallback removal|runtime settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 446/446; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this playable-settlement compatibility checkpoint, then choose the next adjacent runtime-only compatibility cleanup below the remaining lower-level adapters.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime-settlement contract cleanup. RuntimeSettlementResult no longer exposes effects, runtime-dispatch no longer preserves settlement.effects metadata, and runtime result settlement payloads now expose only commands plus settlement diagnostics at the runtime seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects contract removal|runtime settlement effects fallback removal|playable settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 446/446; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this runtime-settlement contract-removal checkpoint, then choose the next adjacent runtime-only compatibility cleanup below the remaining lower-level adapters.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for dead wrapper removal. runtime-settlement.ts no longer exports applyEffects(...), the now-unused RuntimeState import is gone, and the module now keeps only the live settleRuntimeCommands(...) / settleRuntimeEffects(...) adapter entrypoints plus settlement content helpers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 447/447; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this dead-wrapper removal checkpoint, then decide whether to continue into runtime-dispatch's direct settleRuntimeEffects(...) dependency or stop the current compatibility cleanup batch here.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for direct time-advance settlement caller lowering. playable-runtime city-begging completion and house-runtime timeAdvanceCost settlement now call settleRuntimeCommands(...) directly with canonical time.advance commands, eliminating the last direct production advanceTime effect-level callers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "covered settlement path stays on shared runtime ownership|child 31 city-begging completion clears shared playable session after settlement|time advance settlement command direct callers|runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 443/443; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this direct caller lowering checkpoint, then choose the next adjacent runtime-only settlement/event-system child instead of widening into shell/UI ownership.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime settlement commands caller adoption. RuntimeResult.settlement now exposes canonical settlement.commands, runtime-dispatch preserves pending command payload ownership in its settlement summary, and state-sync-runtime settles settlement.commands before falling back to settlement.effects.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs tests/runtime-settlement-content.test.cjs` passed 24/24; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 442/442; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this caller-adoption checkpoint, then choose the next adjacent runtime-only settlement/event-system child instead of widening into shell/UI ownership.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement-runtime command canonical entry. Added command-oriented settlement input/result types next to the legacy Effect settlement adapter contract, exposed settleRuntimeCommands(...) as the canonical runtime-settlement entry, and rewired settleRuntimeEffects(...) into a thin compatibility adapter over that command-level path.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/settlement-command-runtime.test.cjs` passed 24/24; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 441/441; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then choose the next adjacent runtime-only settlement/event-system child instead of broadening shell/UI ownership.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement-command money phase two. Added player.money.change to the shared settlement-command contract, taught settlement-command-runtime to mutate player gold via the shared runtime property mutation seam, and rewired runtime-settlement so outer changeMoney effects now converge on the same concrete settlement-command owner instead of staying unsupported.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 22/22; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 441/441; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then choose the next adjacent runtime-only settlement/event-system child instead of broadening shell/UI ownership.`

- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for settlement-command runtime phase one. Added a canonical SettlementCommand contract plus settlement-command-runtime owner for the already-covered effect families, moved concrete flag/variable/time/character numeric mutation execution into that owner, and rewired runtime-settlement to delegate via Effect -> SettlementCommand mapping while preserving the old Effect-level unsupported/warning compatibility surface.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 19/19; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 441/441; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this checkpoint, then choose the next adjacent runtime-only settlement/event-system child instead of broadening shell/UI ownership.`

- 2026-07-29
  - Summary: `Captured the current mod-first runtime migration handoff so another Codex session can continue from the same branch, constraints, progress, verification set, and next task queue.`
  - Verification: `git status --short --branch` showed `## codex/mod-first-runtime-integration...origin/codex/mod-first-runtime-integration`; merge-base checks showed the current branch and `origin/codex/sync-naqishuo-721ui-to-mmz` contain each other; `git status --porcelain=v1` was empty before creating this document.
  - Next: `Run npm run lint:plans after saving this document, then commit and push this documentation slice if requested.`
- 2026-07-29
  - Summary: `Runtime migration stack already landed into the current baseline: dialogue compatibility, event binding start, event-owned playable start/completion, settlement effect handling, state-sync status/settlement commits, navigation access, playable registries/contributions, city-begging/grain/medicine status patches, interactive follow-up/status forwarding, flow playable kernel/dispatch/presenter, followUp aliases, runtime router/dispatch followUp handling, and source-event settlement/world continuation.`
  - Verification: `Recent recorded verification pattern: npm.cmd run build:test; node --test tests\event-owned-playable-completion.test.cjs tests\story-settlement-continuation.test.cjs tests\event-continuation-runtime.test.cjs tests\event-playable-start-runtime.test.cjs tests\runtime-settlement-content.test.cjs tests\runtime-dispatch-settlement.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs; npm.cmd run typecheck; boundary diff checks for src\main.ts, UI, map, backpack, and styles.`
  - Next: `Continue with runtime-only callers and contracts; defer shellification and UI-facing mod-first-dev diffs.`
- 2026-07-29
  - Summary: `Added explicit branch topology and merge-back flow requirements so future sessions know which branch to work on, when to commit/push, and how to return verified integration slices to the current baseline.`
  - Verification: `git status --short --branch`; `git branch -vv` filtered for mod-first runtime, migrate-scripteditor, baseline, and mod-first-dev branches.
  - Next: `After this document update is pushed, resume Task 1 on codex/mod-first-runtime-integration; merge back to the baseline only after a verified runtime slice or agreed documentation checkpoint.`
- 2026-07-29
  - Summary: `Corrected the handoff branch ownership: local continuation, submit, and merge work now runs on codex/migration-hot-tasks instead of codex/mod-first-runtime-integration.`
  - Verification: `git branch --show-current` returned `codex/migration-hot-tasks`; `git rev-parse --abbrev-ref --symbolic-full-name '@{u}'` returned `origin/codex/migration-hot-tasks`.
  - Next: `Resume Task 1 on codex/migration-hot-tasks; treat codex/mod-first-runtime-integration as historical context only unless the user explicitly asks to revive it.`
- 2026-07-29
  - Summary: `Completed Task 1 audit and deferred caller wiring because applyEventOwnedPlayableCompletion() still has no non-UI production caller outside entry-owned paths; then completed a Task 2 local convergence slice so story runtime scene helpers preserve cityDefinitions/houseDefinitions across start and choice continuation.`
  - Verification: `rg -n "applyEventOwnedPlayableCompletion|continueStoryFromSourceEvent|cityDefinitions|houseDefinitions" src/core src/application tests`; `rg -n "applyEventOwnedPlayableCompletion\\(" src tests`; `git diff --name-status HEAD..origin/mod-first-dev -- src/application/dialogue src/application/events src/application/story src/core/runtime src/core/contracts tests`; `pnpm run build:test`; `node --test tests/event-continuation-runtime.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `If this local Task 2 slice should be kept, commit/push it with docs/change-log.md and this handoff document; otherwise continue Task 3 Step 1 from codex/migration-hot-tasks.`
- 2026-07-29
  - Summary: `Completed a Task 3 local dormant-helper slice by exporting council priority house resolution from navigation-time-follow-up and teaching it to apply city-scoped buildingArrangements/primaryNpcId overrides through canonical building owner matching.`
  - Verification: `git diff --name-status HEAD..origin/mod-first-dev -- src/application/runtime src/application/startup src/core/runtime src/main.ts`; `pnpm run build:test`; `node --test tests/navigation-time-follow-up.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `If this local Task 3 slice should be kept, commit/push it with docs/change-log.md and this handoff document; otherwise continue Task 3 by auditing for one more dormant helper that still avoids src/main.ts shellification.`
- 2026-07-29
  - Summary: `Completed another Task 3 local dormant-helper slice by adding story-runtime-state-bridge, a pure bidirectional bridge between authored city/house definitions plus app-state status layers and the runtime definition/result shape.`
  - Verification: `pnpm run build:test`; `node --test tests/story-runtime-state-bridge.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `If this local Task 3 slice should be kept, commit/push it with docs/change-log.md and this handoff document; otherwise continue Task 3 by auditing whether indoor-screen-story-follow-up can safely consume the bridge without requiring entry-shell rewiring.`
- 2026-07-29
  - Summary: `Completed another Task 3 local context-exposure slice by teaching content-pack loading and active-game-content/storyContent to retain eventBindings, settlements, progressTracks, and progressTrackBindings alongside city/house definition maps.`
  - Verification: `git rev-parse --abbrev-ref --symbolic-full-name '@{u}'`; `git merge-base --is-ancestor origin/codex/sync-naqishuo-721ui-to-mmz codex/migration-hot-tasks`; `pnpm run build:test`; `node --test tests/active-game-content-story-context.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `Commit/push this richer storyContent context slice, then decide whether any remaining Task 3 consumer can safely use it without crossing the entry/runtime wiring boundary.`
- 2026-07-29
  - Summary: `Committed and pushed the richer storyContent context slice as 2442566, then audited indoor-screen-story-follow-up and stopped Task 3 there because the remaining consumer path would require widening house-runtime/main.ts story-content wiring and broader story-runtime seam work beyond a dormant helper slice.`
  - Verification: `git status --short`; `git show --stat --oneline HEAD`; `git push`; `rg -n "getStoryContent|applyIndoorScreenStoryFollowUp|triggerStoryEvents|eventBindingsById|progressTrackDefinitionsById|settlementDefinitionsById|cityDefinitionsById|houseDefinitionsById" src/main.ts src/application/runtime src/application/story src/core/runtime/house-runtime.ts`; `sed -n '1,240p' src/application/runtime/indoor-screen-story-follow-up.ts`; `sed -n '1,260p' src/application/runtime/main-runtime-orchestrator.ts`
  - Next: `Do not extend indoor-screen-story-follow-up further under Task 3. Enter Task 4 only with explicit user approval for a tiny entry-wiring or house-runtime dependency slice, or open a new dedicated story-runtime follow-up plan if deeper seam migration is desired.`
- 2026-07-29
  - Summary: `After explicit user approval, entered Task 4 and implemented a tiny entry-wiring/runtime seam slice: indoor-screen-story-follow-up now uses story-runtime plus state-bridge world projection, story-runtime applies settlement contents on initial trigger activation, main-runtime-orchestrator projects timing-trigger settlement updates, and house-runtime projects house-enter settlement world updates.`
  - Verification: `pnpm run build:test`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 26|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `Commit/push this Task 4 slice, then decide whether remaining eventBindings/progressTrack runtime consumption belongs in this handoff or should move to a new dedicated follow-up plan.`
- 2026-07-29
  - Summary: `Completed a second Task 4 narrow story-runtime slice: story-runtime now consumes eventBindings for city-enter/house-enter/indoor-screen-shown via the shared event-binding runtime, applies progression after settlement events, stores optional runtime.progression state on GameState, and receives event/progression storyContent passthrough from indoor-screen-story-follow-up, main-runtime-orchestrator, house-runtime, and the existing tiny main.ts wiring seam.`
  - Verification: `pnpm run build:test`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned only `src/main.ts`; `git diff --check`; browser smoke on `http://localhost:5173/` reached main menu, character select, campaign map, backpack overlay, city entry prompt, and city view with no console warn/error logs.
  - Next: `Commit/push this second Task 4 slice, then decide whether navigation-time-follow-up city-enter should migrate to story-runtime here or move into a new dedicated follow-up plan.`
- 2026-07-29
  - Summary: `Created a dedicated child plan for the remaining navigation-time-follow-up city-enter migration so future work can switch that seam from scene-runtime to shared story-runtime without reopening this handoff's boundary ad hoc.`
  - Verification: `pnpm run lint:plans` was attempted and failed on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` because it is missing the required top-level title heading.`
  - Next: `If city-enter migration should proceed, execute docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md from Task 1.`
- 2026-07-29
  - Summary: `Executed the dedicated city-enter follow-up child to completed-but-open: navigation-time-follow-up now routes navigation.entered-city through shared story-runtime with eventBindings/settlement/progression inputs, shared world patches flow back through the narrowed outcome follow-up seam, and council-threshold reminders remain unchanged.`
  - Verification: `pnpm run build:test`; `node --test tests/navigation-time-follow-up.test.cjs`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned only `src/main.ts`; `git diff --check`; browser smoke on \`http://localhost:5173/\` reached main menu -> 开始游戏 -> 开始冒险 -> campaign map -> 背包 -> 濠州 -> 进入城市 with no console warn/error logs; `pnpm run lint:plans` still fails only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Use the child plan as the review/commit checkpoint; do not reopen this handoff with more city-enter seam work unless the user explicitly wants a new adjacent runtime-only slice before push.`
- 2026-07-30
  - Summary: `Promoted the next adjacent runtime-only child: runtime follow-up contract convergence. This child is scoped to runtime-result/runtime-router/runtime-dispatch and focused tests so canonical followUp ownership can be clarified before any new caller wiring is considered.`
  - Verification: `Design spec added at docs/superpowers/specs/2026-07-30-runtime-follow-up-contract-convergence-design.md and committed as fa70603; new child plan saved at docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md; pnpm run lint:plans still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue; implementation verification for the new child has not run yet.`
  - Next: `Execute docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md from Task 1, then record whether legacy outcome/interactive fields remain required or can be narrowed.`
- 2026-07-30
  - Summary: `Completed Task 1 of the runtime follow-up contract convergence child. The audit confirmed that followUp is already canonical, but the current baseline still retains live outcome/interactive compatibility fields and router handlers, so the next move is test-first narrowing rather than immediate deletion.`
  - Verification: `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '1,220p' src/core/runtime/runtime-router.ts`; `sed -n '1,320p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,220p' tests/runtime-follow-up-contract.test.cjs`; `sed -n '1,220p' tests/runtime-router-follow-up-contract.test.cjs`; `sed -n '15530,15595p' tests/robustness.test.cjs`; `sed -n '17440,17490p' tests/robustness.test.cjs`; `git status --short --branch`.`
  - Next: `Run Task 2 in docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md and write failing contract tests for canonical followUp ownership plus compatibility fallback ordering before changing runtime code.`
- 2026-07-30
  - Summary: `Completed Task 2 and the minimal Task 3 convergence in the runtime follow-up contract child. Added failing tests for explicit canonical-versus-compatibility follow-up ownership, then made the smallest runtime-only production change: runtime-result now labels canonical and retained compatibility fields explicitly, and runtime-dispatch now blocks interactive fallback when outcome handling already ran.`
  - Verification: `pnpm run build:test`; `node --test tests/runtime-follow-up-contract.test.cjs tests/runtime-router-follow-up-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs`; `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`.`
  - Next: `Rerun pnpm run lint:plans after the latest plan sync, then commit and push if the only failure remains the unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title issue.`
- 2026-07-30
  - Summary: `Re-ran pnpm run lint:plans after the latest runtime follow-up child sync. The only remaining plan-lint failure is still the unrelated pre-existing missing title in docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md.`
  - Verification: `pnpm run lint:plans` failed only on `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push the runtime follow-up contract convergence slice, then decide whether to merge the checkpoint back to the aligned baseline immediately or hold it on codex/migration-hot-tasks.`
- 2026-07-30
  - Summary: `Committed and pushed the runtime follow-up contract convergence checkpoint as 3f70822 on codex/migration-hot-tasks. The branch now carries explicit canonical-versus-compatibility follow-up grouping, narrowed interactive fallback gating, updated contract tests, and synchronized child/handoff docs.`
  - Verification: `git commit -m "merge: converge runtime follow-up contract"` created `3f70822`; `git push` updated `origin/codex/migration-hot-tasks` from `a7591f5` to `3f70822`.`
  - Next: `Decide whether to merge this pushed runtime-only checkpoint back into the aligned baseline now or continue with another adjacent runtime-only slice first.`
- 2026-07-30
  - Summary: `Merge-back completed at 92769f3 and the next adjacent runtime-only child is now task-input contract convergence. The local receiving branch role is unified on codex/sync-naqishuo-721ui-to-mmz-followup after deleting the redundant local codex/sync-naqishuo-721ui-to-mmz mirror.`
  - Verification: `git push origin HEAD:codex/sync-naqishuo-721ui-to-mmz` updated the remote baseline to `92769f3`; `git switch codex/migration-hot-tasks`; `git merge --ff-only codex/sync-naqishuo-721ui-to-mmz-followup`; `git push` updated `origin/codex/migration-hot-tasks` to `92769f3`; `git branch -d codex/sync-naqishuo-721ui-to-mmz`; audit queries over RuntimeResult, event-runtime, event-activation, runtime-dispatch, and runtime-dispatch-settlement coverage identified taskInputs as the canonical next convergence target.`
  - Next: `Execute docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md from Task 1.`
- 2026-07-30
  - Summary: `Completed Task 1 of the runtime task-input contract convergence child. The audit confirmed that dispatch already settles canonical taskInputs, while split taskActions/taskSignals remain as compatibility-only seams in RuntimeResult, EventRuntimeCandidate, ActivatedEvent, and settleRuntimeTasks().`
  - Verification: `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '1,220p' src/core/contracts/event-runtime.ts`; `sed -n '1,220p' src/core/runtime/event-activation.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,260p' tests/runtime-dispatch-settlement.test.cjs`; `rg -n "taskActions\\?:|taskSignals\\?:|taskUpdates\\?:|taskInputs\\?:|taskInputs:|taskActions:|taskSignals:|taskUpdates:" src tests | head -n 250`.`
  - Next: `Run Task 2 in docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md and add failing tests for canonical taskInputs plus explicit split-input compatibility.`
- 2026-07-30
  - Summary: `Completed the RED/GREEN portion of Runtime Task Input Contract Convergence. dispatchRuntimeRequest() now treats split taskActions/taskSignals as fallback-only when taskInputs are present, and event-runtime / event-activation now expose taskInputs instead of taskActions.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`.`
  - Next: `Finish Task 4 verification and record the push-ready checkpoint in the child plan before opening the next runtime-only slice.`
- 2026-07-30
  - Summary: `Completed Task 4, committed the runtime task-input convergence slice as b69d361, pushed it, and merged it back to the aligned baseline at 91780be.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check`; `pnpm run lint:plans` still fails only on docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md; `git commit -m "merge: converge runtime task input contract"` created b69d361; `git push origin HEAD:codex/sync-naqishuo-721ui-to-mmz` updated the baseline to 91780be; `git push` updated origin/codex/migration-hot-tasks to 91780be.`
  - Next: `Promote the next adjacent runtime-only child for scene-runtime task input convergence.`
- 2026-07-30
  - Summary: `Opened and advanced the scene-runtime task input convergence child through RED/GREEN. SceneRuntimeResult and runStoryTriggerRuntime() now emit canonical taskInputs, making scene-runtime the next producer seam aligned with the already-converged event-runtime and dialogue-runtime task-input path.`
  - Verification: `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,220p' src/core/contracts/scene-runtime.ts`; `sed -n '1,220p' src/core/runtime/scene-runtime.ts`; `pnpm run build:test`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runtime accepts an activated event handoff|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check`; `pnpm run lint:plans` still fails only on docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md; the broader targeted robustness invocation still fails only on the unrelated runtime-router route-result alias assertion.`
  - Next: `Record Task 4 closeout details in the child plan, then decide whether to commit/push this scene-runtime convergence slice now or continue batching adjacent runtime-only work.`
- 2026-07-30
  - Summary: `Completed Task 4 for the scene-runtime child and pushed the checkpoint as 9acb1ae on codex/migration-hot-tasks.`
  - Verification: `git commit -m "merge: converge scene runtime task inputs"` created `9acb1ae`; `git push` updated origin/codex/migration-hot-tasks from `91780be` to `9acb1ae`; the same targeted build/typecheck/boundary/robustness results remain valid, with only the known unrelated runtime-router alias assertion and the unrelated plan-lint title failure still outstanding.`
  - Next: `Merge 9acb1ae back to the aligned baseline, then open the next adjacent runtime-only child if more convergence is desired.`
- 2026-07-30
  - Summary: `Promoted the next adjacent runtime-only child on top of the local Event Router Runtime Core Phase A checkpoint: Story Direct Event Entry Convergence. The approved scope is to converge startStoryEventById(...) plus the non-binding triggerStoryEvents(...) fallback onto the shared event-router seam while keeping continueStoryFromSourceEvent(...), scene-choice continuation, and broader event-chain execution out of scope.`
  - Verification: `Audit-only queries over src/application/story/story-runtime.ts, src/core/runtime/event-router.ts, src/core/runtime/runtime-dispatch.ts, tests/event-continuation-runtime.test.cjs, and tests/event-router-runtime.test.cjs confirmed the router owner already exists while direct story entry callers still applyTriggeredStoryEvent(...) locally. Plan authoring created docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md.`
  - Next: `Execute docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md from Task 1.`
- 2026-07-30
  - Summary: `Completed Task 1 audit for the active Story Direct Event Entry Convergence child. The direct-caller seam is now locked to startStoryEventById(...) plus the non-binding triggerStoryEvents(...) fallback, while continueStoryFromSourceEvent(...), chooseStorySceneOption(...), and continueToEvent(...) remain explicitly excluded continuation paths.`
  - Verification: `git status --short --branch; sed -n '1,260p' docs/superpowers/project-progress.md; sed -n '100,340p' src/application/story/story-runtime.ts; sed -n '360,520p' src/application/story/story-runtime.ts; sed -n '1,240p' src/core/runtime/event-router.ts; sed -n '1,280p' src/core/runtime/runtime-dispatch.ts; sed -n '1,320p' tests/event-continuation-runtime.test.cjs; sed -n '1,260p' tests/event-router-runtime.test.cjs; rg -n "startStoryEventById|triggerStoryEvents|applyTriggeredStoryEvent|dispatchEventRoute|continueStoryFromSourceEvent" src/application/story tests.`
  - Next: `Execute Task 2 in docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md and add RED coverage that forces the two included direct-entry callers toward the shared router seam.`
- 2026-07-30
  - Summary: `Verified the Story Direct Event Entry Convergence child as a local completed-but-open checkpoint. startStoryEventById(...) and the non-binding triggerStoryEvents(...) fallback now share one direct-entry router helper, triggerStoryEventBindings(...) stays binding-owned, continuation/choice paths remain unchanged, and protected shell/UI/map/backpack/style boundaries stayed clean.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 407/407; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Keep this child local for now unless the user explicitly wants commit/push/merge-back; the next decision is whether to preserve the checkpoint as local governance state or promote it into the branch history.`
- 2026-07-30
  - Summary: `Promoted the next adjacent runtime-only child after the pushed direct-entry checkpoint: Story Source Event Continuation Convergence. The new child narrows only continueStoryFromSourceEvent(...), leaving chooseStorySceneOption(...) and scene-runner start-event continuation for later isolated slices.`
  - Verification: `git status --short --branch`; `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,220p' docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`; `sed -n '100,470p' src/application/story/story-runtime.ts`; `sed -n '1,260p' src/application/events/event-continuation.ts`; `sed -n '1,180p' src/application/scene/choice-resolver.ts`; `sed -n '120,280p' src/application/scene/scene-runner.ts`; `sed -n '390,680p' tests/event-continuation-runtime.test.cjs`; `sed -n '15340,15530p' tests/robustness.test.cjs`; `rg -n "continueStoryFromSourceEvent|chooseStorySceneOption|continueToEvent|dispatchRuntimeRequest|dispatchEventRoute|routeStoryDirectEntry" src/application tests.`
  - Next: `Execute Task 2 in docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md and add RED coverage for router-first source-event continuation.`
- 2026-07-30
  - Summary: `Verified Story Source Event Continuation Convergence as a local completed-but-open checkpoint. continueStoryFromSourceEvent(...) now routes the resolved follow-up event through routeStoryDirectEntry(...), preserving source-event settlement/world-definition behavior while leaving chooseStorySceneOption(...) and scene-runner start-event continuation untouched.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 10/10; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 424/424; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Decide whether to keep this source-event continuation checkpoint local or commit/push it, then open the next adjacent continuation slice for chooseStorySceneOption(...) and scene-runner start-event callers if more router convergence is desired.`
- 2026-07-30
  - Summary: `Committed and pushed Story Source Event Continuation Convergence as fb32b99, then promoted the next adjacent runtime-only child: Story Choice Event Continuation Convergence. This new child narrows only chooseStorySceneOption(...) with selectedOption.nextEventId, leaving scene-runner start-event continuation for a later isolated slice.`
  - Verification: `git commit -m "merge: converge story source event continuation"` created `fb32b99`; `git push origin HEAD:codex/migration-hot-tasks` updated the remote from `99315a2` to `fb32b99`; audit reads over story-runtime, choice-resolver, event-continuation-runtime tests, and robustness guards confirmed the next uncovered story-runtime continuation seam.`
  - Next: `Execute Task 2 in docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md and add RED coverage for router-first choice next-event continuation.`
- 2026-07-30
  - Summary: `Verified Story Choice Event Continuation Convergence as a local completed-but-open checkpoint. chooseStorySceneOption(...) now routes selectedOption.nextEventId through routeStoryDirectEntry(...), preserves choice effects/world definitions, and leaves nextSceneId/plain choice behavior plus scene-runner start-event continuation untouched.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 11/11; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 425/425; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Decide whether to keep this choice continuation checkpoint local or commit/push it, then open the next adjacent continuation slice for scene-runner start-event routing if more router convergence is desired.`
- 2026-07-30
  - Summary: `Opened and completed the next adjacent runtime-only child for scene-runner start-event convergence. scene-runner now exposes a narrow continueFromStartEvent seam, and story-runtime injects routeStoryDirectEntry(...) through that seam so scene-owned start-event actions no longer locally start follow-up events under story-runtime.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 426/426; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this scene-runner checkpoint into branch history, then open the next adjacent continuation slice for automatic scene-end continuation if router convergence should continue.`
- 2026-07-30
  - Summary: `Opened and completed the next adjacent runtime-only child for automatic scene-end continuation, and used that slice to collapse the earlier start-event-only callback into one shared continueFromSceneEvent seam. scene-runner automatic scene-end continuation now routes through the same story-runtime router-first seam as start-event continuation.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner scene-end continuation convergence|scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 427/427; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this single-seam checkpoint into branch history, then decide whether the next uncovered runtime-only scope is broader event-chain routing rather than another scene-runner-owned seam.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for event-trigger route convergence. event-runtime trigger activation now routes activated events through dispatchEventRoute(...), while scene-runtime and dialogue-runtime continue consuming the unchanged EventRuntimeResult seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|scene runner scene-end continuation convergence|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 428/428; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then decide whether event-binding-runtime or enter-house is the next narrower direct-start caller family.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for event-binding route convergence. event-binding-runtime now routes non-state-only binding-selected events through routeBindingEvent(...) -> dispatchEventRoute(...), while preserving EventBindingRuntimeResult and keeping state-only runtime actions on the no-scene path.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 429/429; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then decide whether enter-house or another narrow direct-start caller family is the next runtime-only convergence slice.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for navigation enter-house route convergence. enterHouse(...) is now state-only and navigation-runtime routes houseDefinition.onEnterEventId through routeHouseEnterEvent(...) -> dispatchEventRoute(...), preserving blocked house access behavior and the existing navigation result shape.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "navigation enter-house convergence|event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 430/430; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then choose the next remaining direct-start caller family.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for story-runtime state-only binding route convergence. applyTriggeredStoryEvent(...) now routes the not-already-started state-only binding branch through routeStoryDirectEntry(...) with actionsAlreadyApplied ownership, so triggerStoryEventBindings(...) remains binding-owned while the remaining local story-runtime event start path disappears.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 7/7; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/indoor-screen-story-runtime.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime state-only binding route convergence|story direct event entry convergence|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 431/431; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then choose whether continueToEvent(...) contract narrowing or another remaining direct-start helper is the next convergence slice.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for scene/dialogue runtime continuation route convergence. runSceneFromEvent(...) and runDialogueFromEvent(...) now inject continueFromSceneEvent and share routeSceneRuntimeContinuationEvent(...), so owner runtimes route automatic nextEvent continuation through dispatchEventRoute(...) before the generic continueToEvent(...) contract is narrowed.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene dialogue runtime continuation route convergence|scene runtime accepts an activated event handoff|scene runner scene-end continuation convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 432/432; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then continue with generic continueToEvent(...) contract narrowing.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for event continuation contract narrowing. event-continuation now exposes resolveEventContinuation(...) as the pure lookup seam, continueToEvent(...) is reduced to a compatibility wrapper, and story/scene ownerized continuation callers now route on eventDefinition data instead of depending on helper-owned state mutation.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 14/14; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event continuation contract narrowing|story source event continuation convergence|story choice event continuation convergence|scene runner start event convergence|scene runner scene-end continuation convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 433/433; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then continue with the next narrower router-handler or activation caller-family convergence slice.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for runtime route activation seam convergence. createEventRouteActivationHandlers(...) now owns the shared routed-event activation handler family, and event-runtime, event-binding-runtime, navigation-runtime, and scene-runtime all consume that seam instead of rebuilding inline dialogue/settlement startEvent(...) handlers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 8/8; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime route activation seam convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|event continuation contract narrowing|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 434/434; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then continue with the next narrower explicit local startEvent fallback family.`
- 2026-07-30
  - Summary: `Opened and completed the final explicit event-start convergence child. story-runtime direct entry now reuses createEventRouteActivationHandlers(...) with pre-start runtime action preparation, and scene-runner plus choice-resolver local non-owner fallbacks now reuse continueToEvent(...) instead of keeping caller-specific startEvent(...) branches.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 16/16; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime activation seam convergence|scene fallback continuation seam convergence|runtime route activation seam convergence|event continuation contract narrowing|scene dialogue runtime continuation route convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene runner start event convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 436/436; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then move to the next event-system plan rather than more explicit local start cleanup.`
- 2026-07-30
  - Summary: `Opened and completed the next runtime-only child for story settlement next-event convergence. story-runtime now restores the missing mod-first-dev settlement.nextEventId path by applying settlement contents first, then resolving the authored follow-up target through resolveEventContinuation(...) and routing it back through the shared direct-entry seam instead of stopping after the settlement event.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 17/17; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/story-settlement-continuation.test.cjs` passed 1/1; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement next-event convergence|story source event continuation convergence|story choice event continuation convergence|story runtime activation seam convergence|scene fallback continuation seam convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 437/437; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then continue to the next runtime-only event-system child instead of reopening settlement-authored story continuation.`
- 2026-07-30
  - Summary: `Committed and pushed the story settlement next-event convergence child as 494de4a on codex/migration-hot-tasks so the event-system branch can continue from a remote-backed checkpoint.`
  - Verification: `git show --stat --oneline 494de4a`; `git push origin codex/migration-hot-tasks`
  - Next: `Open the next runtime-only event-system child from pushed checkpoint 494de4a.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`
  - `docs/superpowers/plans/2026-07-03-main-runtime-ownerization-weekly-orchestration-plan.md`
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md`
  - `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch: `codex/migration-hot-tasks`.
  - Upstream: `origin/codex/migration-hot-tasks`.
  - Baseline branch for user-visible current app: `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Runtime migration code up through commit `8d8e5145` is present in the historical integration branch history and `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Documentation or migration hot-task commits after `8d8e5145` may exist only on `codex/migration-hot-tasks` until a deliberate merge-back step updates the baseline.
  - `codex/mod-first-runtime-integration` is now a historical predecessor branch, not the active local submit/merge branch.
  - Local `migrate-scripteditor` also points to `8d8e5145` and tracks `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Direct comparison to `origin/mod-first-dev` still shows large differences in `src/main.ts`, `src/ui/**`, `src/styles/**`, `src/application/map/**`, house modules, audio, layout editor, and presenter/runtime coordinator files. These are not safe to merge wholesale.

## Branch Topology

Use these branch roles unless the user explicitly gives a new branch name:

- Current branch: `codex/migration-hot-tasks`
- Branches involved in this migration flow:
  - `origin/codex/sync-naqishuo-721ui-to-mmz`
    - Role: remote target baseline branch.
    - Purpose: protects the current UI, map, backpack, script editor entry, and app behavior.
    - Rule: only receive verified integration slices after boundary checks pass.
  - `codex/sync-naqishuo-721ui-to-mmz-followup`
    - Role: local baseline receiving branch.
    - Upstream/remote counterpart: `origin/codex/sync-naqishuo-721ui-to-mmz`.
    - Purpose: local branch used to merge integration work back into the remote target baseline.
    - Rule: update from remote before merging an integration slice back.
  - `codex/migration-hot-tasks`
    - Role: current runtime hot-task branch.
    - Upstream: `origin/codex/migration-hot-tasks`.
    - Purpose: continue runtime-only migration work in small commits from the current handoff state.
    - Rule: all new runtime migration slices should start here or from a fresh child branch based on it.
- Historical predecessor branch: `codex/mod-first-runtime-integration`
  - Role: previous local integration branch used before the handoff moved to `codex/migration-hot-tasks`.
  - Rule: do not use it for new local submit/merge flow unless the user explicitly asks.
- Source reference branch: `origin/mod-first-dev`
  - Role: read-only source for runtime ideas, existing shellification direction, and mod-first contracts.
  - Rule: do not merge this branch directly into the current baseline or integration branch.
- Older integration checkpoint: `codex/mod-first-dev-block-integration`
  - Role: historical checkpoint that brought in script editor entry baseline work.
  - Rule: do not continue new work there unless the user explicitly asks.

Historical final synchronized state after the `8d8e5145` runtime-stack merge-back:

- `origin/codex/sync-naqishuo-721ui-to-mmz`
- `origin/codex/mod-first-runtime-integration`
- `codex/sync-naqishuo-721ui-to-mmz-followup`
- `codex/mod-first-runtime-integration`

At that checkpoint, these branches had no remaining runtime migration differences. Later documentation-only commits, such as this handoff document, or newer migration hot-task commits can make the current working branch `codex/migration-hot-tasks` lead the baseline until they are intentionally merged back. The current local receiving branch for future merge-back is `codex/sync-naqishuo-721ui-to-mmz-followup`; the redundant local branch `codex/sync-naqishuo-721ui-to-mmz` has been deleted.

Before starting any slice, run:

```powershell
git fetch origin
git status --short --branch
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name '@{u}'
```

Expected:

- Current branch is `codex/migration-hot-tasks` or a clearly named child branch based on it.
- Worktree is clean before migration edits begin.
- Upstream is known.

## Merge Back Flow

Use this flow after each verified runtime slice or agreed documentation checkpoint:

1. Work on `codex/migration-hot-tasks` or a child branch created from it.
2. Implement one narrow runtime slice only.
3. Update this handoff document with checkbox state, `Execution State`, `Progress Log`, verification result, branch/baseline status if changed, and the exact next unchecked task.
4. Run targeted runtime tests and `npm.cmd run typecheck`.
5. Run the boundary proof:

```powershell
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
```

Expected:

- Empty output unless the user explicitly approved that slice to touch one of these paths.

6. Commit on the current runtime branch with a runtime-specific message.
7. Push the current runtime branch:

```powershell
git push
```

8. Decide whether this is a merge-back checkpoint:
   - Merge back immediately for completed, verified slices that should become part of the current baseline.
   - Defer merge-back for exploratory or incomplete slices.
9. When merging back to the baseline, use the local baseline receiving branch:

```powershell
git switch codex/sync-naqishuo-721ui-to-mmz-followup
git pull --ff-only
git merge --no-ff codex/migration-hot-tasks
```

10. Re-run the boundary proof and the relevant verification on `codex/sync-naqishuo-721ui-to-mmz-followup`.
11. Push the baseline:

```powershell
git push origin codex/sync-naqishuo-721ui-to-mmz-followup:codex/sync-naqishuo-721ui-to-mmz
```

12. Switch back to the current runtime branch and sync it from the updated baseline if needed:

```powershell
git switch codex/migration-hot-tasks
git merge --ff-only origin/codex/sync-naqishuo-721ui-to-mmz
git push
```

If `--ff-only` fails in step 12, stop and inspect the graph before merging. Do not rewrite either branch unless the user explicitly asks.

## Recorded Merge Back: Runtime Stack To Baseline

This is the completed merge-back flow that synchronized the runtime migration stack into the target baseline before this handoff document was added:

1. Checked the current integration branch:

```powershell
git switch codex/mod-first-runtime-integration
git status --short --branch
```

2. Found the integration branch was ahead of the target baseline by one runtime-support commit:

```text
db50ef1c chore: ignore local brainstorm notes
```

3. Switched to the local receiving baseline branch:

```powershell
git switch migrate-scripteditor
```

4. Aligned `migrate-scripteditor` with the remote target baseline:

```powershell
git fetch origin
git pull --ff-only
```

5. Merged the remote integration branch into the local receiving baseline:

```powershell
git merge --no-ff origin/codex/mod-first-runtime-integration
```

6. Created merge commit:

```text
8d8e5145 Merge remote-tracking branch 'origin/codex/mod-first-runtime-integration' into migrate-scripteditor
```

7. Ran the lightweight merge check:

```powershell
git diff --check
```

8. Pushed the local receiving branch back to the remote target baseline:

```powershell
git push origin migrate-scripteditor:codex/sync-naqishuo-721ui-to-mmz
```

9. Re-synced local `migrate-scripteditor` to the latest remote target baseline.

10. Switched back to the current integration branch:

```powershell
git switch codex/mod-first-runtime-integration
```

11. Fast-forwarded the integration branch to the latest target baseline.

12. Pushed the integration branch:

```powershell
git push origin codex/mod-first-runtime-integration
```

13. Final confirmation at that checkpoint:

```text
origin/codex/sync-naqishuo-721ui-to-mmz ... origin/codex/mod-first-runtime-integration = 0 0
origin/codex/sync-naqishuo-721ui-to-mmz ... migrate-scripteditor = 0 0
```

Result:

- No remaining runtime-stack commits needed to be merged into the target baseline.
- The last synchronized runtime-stack merge point was `8d8e5145`.

## Commit And Reporting Rules

- Commit once per completed runtime slice or documentation checkpoint.
- Push the active integration branch after each commit.
- Merge back to `origin/codex/sync-naqishuo-721ui-to-mmz` only after the slice is verified and the user-visible boundary check is clean.
- After merge-back, report:
  - active branch and commit
  - baseline branch and commit
  - what was implemented
  - verification commands and results
  - boundary diff result
  - whether baseline was updated
  - next task to run

## Migration Reason

The current branch needs selected `mod-first-dev` runtime capabilities because script-editor-authored content, event-owned playables, structured settlement, runtime follow-up, state-sync commits, playable registries, and mod-contributed playables need to execute through stable runtime contracts instead of ad hoc entry code.

The current baseline also contains newer UI, map, backpack, script editor, entry, and feature work that `mod-first-dev` does not own. A whole-branch merge from `mod-first-dev` would delete or replace many of those files, including newer map renderer paths, backpack UI, house views, styles, and `src/main.ts` entry behavior. The migration must therefore port runtime seams in slices while preserving the current baseline UI and behavior.

## Global Constraints

- Do not direct-merge `mod-first-dev` into this branch.
- Do not copy `mod-first-dev` versions of `src/main.ts`, `src/ui/**`, `src/styles/**`, map modules/assets, backpack modules, or house view files.
- Do not modify UI, UI behavior, map behavior, backpack behavior, script editor entry, or entry shell unless the user explicitly scopes that slice.
- Keep compatibility logic centralized in runtime/compatibility modules. Do not scatter compatibility branches across unrelated callers.
- Prefer tests first for every behavior-changing runtime slice.
- Preserve old compatibility fields until the current entry path has fully migrated. For example, keep old `interactive` fallbacks while introducing `followUp`.
- Commit after each completed slice with a message that states the runtime capability migrated.
- After each slice, report what was implemented, what verification ran, and what the next slice is.
- After each plan task or migration slice, update this document before commit so another session can resume without reading chat history. Required updates are: checkbox state, `Execution State`, `Progress Log`, verification result, current branch/baseline status if it changed, and the exact next unchecked task.
- Before merging back to the baseline, run the boundary diff check that proves UI/map/backpack/main-shell files were not unintentionally changed.
- If a future task involves special house work, first present the house interface contract from `docs/special-house-interface.md` as required by `AGENTS.md`.

## Implementation Scope

### Already Migrated

- Script editor and script editor entry baseline are present in the current baseline.
- Script editor template loading has been fixed so built-in template packs resolve through packaged assets.
- `.gitignore` ignores local `tmp/` and `.superpowers/brainstorm/`.
- Main shell governance contract has been documented to prevent unsafe direct shellification.
- Dialogue runtime compatibility seam.
- Event binding runtime seam and event binding start runtime seam.
- Event-owned playable start runtime.
- Event-owned playable completion seam.
- Runtime settlement effect seam and runtime dispatch settlement carry.
- State-sync runtime status patch and runtime commit settlement effects.
- Navigation access runtime seam, with access checks only when explicit access data is supplied.
- Default playable registry seam and scenario-pack playable contribution projection.
- City begging, grain accounting, and medicine compounding status patches.
- Interactive runtime status patch forwarding.
- Flow playable runtime kernel, dispatch, and presenter model.
- `PlayableResult` and `RuntimeFollowUp` compatibility aliases.
- Runtime router follow-up contract and runtime dispatch `handleFollowUp()` priority with legacy fallback.
- Story-battle/playable/interactive runtime forwarding of both `interactive` and `followUp`.
- Event-owned playable source event continuation.
- Settlement continuation through source event `nextEventId`.
- Story settlement continuation helper under `src/application/story/story-settlement-continuation.ts`.
- Event-owned playable completion can carry `cityDefinitions` and `houseDefinitions` through story settlement continuation.

### Still In Scope

- Runtime-only application callers that can pass `cityDefinitions` and `houseDefinitions` into `applyEventOwnedPlayableCompletion()` without touching UI or `src/main.ts`.
- Additional event/dialogue/playable completion convergence where it stays inside `src/core/**` or `src/application/**` runtime seams.
- Canonical result naming cleanup that keeps old fields as compatibility aliases.
- Runtime coordinator helpers under `src/application/runtime/**` only if they can be added without replacing current entry/UI behavior.
- Tests that lock runtime behavior before any call-site wiring is changed.

### Still Out Of Scope

- Full `src/main.ts` shellification.
- Replacing current UI with `mod-first-dev` UI.
- Replacing current map renderer, map assets, map shaders, map styles, or map interaction behavior.
- Replacing current backpack/inventory UI or behavior.
- Deleting current house views or replacing them with `mod-first-dev` house module removals.
- Retiring legacy runtime fields before current entry code is safely migrated.
- Mod-first-dev audio/layout/editor deletion waves unless the user starts a dedicated slice.

## File Map

### Key files already changed by runtime migration

- `src/application/events/event-playable-runtime.ts`
  - Owns event-owned playable start/completion and source event continuation input.
- `src/application/story/story-runtime.ts`
  - Owns story event continuation and delegates settlement application.
- `src/application/story/story-settlement-continuation.ts`
  - Central helper for applying story settlement target changes to person/city/building definitions.
- `src/core/runtime/runtime-dispatch.ts`
  - Owns runtime dispatch result handling, including `followUp` priority and settlement carry.
- `src/core/runtime/runtime-router.ts`
  - Owns routed result and follow-up handler compatibility contract.
- `src/core/runtime/playable-runtime.ts`
  - Owns playable launch/action resolution, default registries, and flow playable dispatch.
- `src/core/runtime/interactive-runtime.ts`
  - Owns interactive-to-playable forwarding and status/followUp result propagation.
- `src/core/runtime/runtime-settlement.ts`
  - Owns runtime settlement effect application.
- `src/core/runtime/state-sync-runtime.ts`
  - Owns runtime result commit into shared app state.
- `src/core/contracts/runtime-result.ts`
  - Owns typed runtime result, settlement, and follow-up compatibility contracts.

### Tests that describe migrated behavior

- `tests/event-owned-playable-completion.test.cjs`
- `tests/event-continuation-runtime.test.cjs`
- `tests/story-settlement-continuation.test.cjs`
- `tests/event-playable-start-runtime.test.cjs`
- `tests/runtime-settlement-content.test.cjs`
- `tests/runtime-dispatch-settlement.test.cjs`
- `tests/runtime-router-follow-up-contract.test.cjs`
- `tests/runtime-follow-up-contract.test.cjs`
- `tests/interactive-runtime-status.test.cjs`
- `tests/flow-playable-runtime.test.cjs`
- `tests/flow-playable-runtime-dispatch.test.cjs`
- `tests/flow-playable-presenter.test.cjs`
- `tests/city-begging-runtime-status.test.cjs`
- `tests/grain-accounting-runtime-status.test.cjs`
- `tests/medicine-compounding-runtime-status.test.cjs`
- `tests/state-sync-runtime-commit.test.cjs`
- `tests/state-sync-core-seam.test.cjs`
- `tests/playable-runtime-registries.test.cjs`
- `tests/mod-runtime-contribution.test.cjs`

### Files to avoid unless explicitly scoped

- `src/main.ts`
- `src/ui/**`
- `src/styles/**`
- `src/components/**`
- `src/application/map/**`
- `src/domain/map/**`
- `src/application/backpack/**`
- `src/domain/backpack/**`
- `src/ui/views/inventory/**`
- `src/ui/views/map/**`
- `src/ui/views/house/**`

## Verification Plan

- Runtime slice verification:
  - `npm.cmd run build:test`
  - `node --test tests\event-owned-playable-completion.test.cjs tests\story-settlement-continuation.test.cjs tests\event-continuation-runtime.test.cjs tests\event-playable-start-runtime.test.cjs tests\runtime-settlement-content.test.cjs tests\runtime-dispatch-settlement.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs`
  - `npm.cmd run typecheck`
- Boundary proof before commit:
  - `git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles`
  - Expected: empty unless the current slice was explicitly approved to touch one of these areas.
- Hygiene:
  - `git diff --check`
  - Existing LF/CRLF working-copy warnings may appear; new whitespace errors should be fixed.
- Plan/document verification:
  - `npm run lint:plans`
- Browser/UI smoke only when the user asks or when a runtime slice could affect visible behavior:
  - Start or reuse `http://127.0.0.1:5173/`.
  - Check startup, map visibility, backpack entry, city/house navigation, script editor entry, and no console errors.

## Task 1: World Definition Caller Wiring Audit

**Files:**
- Read: `src/application/events/event-playable-runtime.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/content/active-game-content.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/state-sync-runtime.ts`
- Test: `tests/event-owned-playable-completion.test.cjs`
- Test: `tests/event-continuation-runtime.test.cjs`

- [x] **Step 1: Find non-UI callers of event-owned playable completion**

Run:

```powershell
rg -n "applyEventOwnedPlayableCompletion|continueStoryFromSourceEvent|cityDefinitions|houseDefinitions" src\core src\application tests
```

Expected:

- Identify whether any caller outside `src/main.ts`, UI, map, backpack, and house view files can pass active city/house definitions into `applyEventOwnedPlayableCompletion()`.
- If all real callers are entry/UI-owned, record that the wiring is deferred rather than touching `src/main.ts` in this task.

- [ ] **Step 2: Add or extend a focused test for the caller seam**

If a non-UI runtime caller exists, extend the nearest test so it proves:

- the caller supplies `cityDefinitions` and `houseDefinitions`
- event-owned playable completion returns updated world definitions
- old character-only behavior still works when world definitions are omitted

Run the test first and confirm the new assertion fails before implementation.

Status note:

- Audit result: all current production callers remain entry/UI-owned; `applyEventOwnedPlayableCompletion()` is referenced directly only by tests in this branch.
- Therefore Task 1 caller wiring is intentionally deferred until a runtime/application-owned caller exists or the user explicitly approves a tiny `src/main.ts` slice.

- [ ] **Step 3: Implement minimal caller wiring**

Only modify runtime/application files from the audited caller path. Do not modify `src/main.ts`, UI, map, backpack, or styles in this task.

- [ ] **Step 4: Run verification**

Run:

```powershell
npm.cmd run build:test
node --test tests\event-owned-playable-completion.test.cjs tests\event-continuation-runtime.test.cjs tests\story-settlement-continuation.test.cjs
npm.cmd run typecheck
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
git diff --check
```

Expected:

- Targeted tests pass.
- Typecheck passes.
- Boundary diff is empty.

- [ ] **Step 5: Commit and report**

Run:

```powershell
git status --short
git add <changed-runtime-files> <changed-tests> docs\change-log.md docs\superpowers\plans\2026-07-29-mod-first-runtime-integration-handoff-plan.md
git commit -m "merge: wire event-owned playable world definitions"
git push
```

Report:

- What was implemented.
- Verification commands and results.
- Whether boundary diff was empty.
- Next task to execute.
- Confirmation that this handoff document was updated with the current resume point.

## Task 2: Dialogue And Event Completion Convergence Audit

**Files:**
- Read: `src/application/dialogue/**`
- Read: `src/application/events/**`
- Read: `src/application/story/**`
- Read: `src/core/runtime/**`
- Test: `tests/event-continuation-runtime.test.cjs`
- Test: `tests/runtime-router-follow-up-contract.test.cjs`
- Test: `tests/runtime-follow-up-contract.test.cjs`

- [x] **Step 1: Compare remaining runtime-only diffs against mod-first-dev**

Run:

```powershell
git diff --name-status HEAD..origin/mod-first-dev -- src\application\dialogue src\application\events src\application\story src\core\runtime src\core\contracts tests
```

Expected:

- Extract runtime-only candidates.
- Exclude renames or deletions that drag UI/main shell changes into the current branch.

- [x] **Step 2: Select one isolated completion/follow-up gap**

Choose one gap that:

- can be tested in existing Node tests
- does not require visible UI changes
- preserves old compatibility fields
- keeps compatibility in a shared runtime helper or contract module

- [x] **Step 3: Write failing test and implement**

Use the nearest existing runtime test file. Keep the slice narrow enough for one commit.

- [x] **Step 4: Run verification and boundary proof**

Run:

```powershell
npm.cmd run build:test
node --test tests\event-continuation-runtime.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs
npm.cmd run typecheck
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
git diff --check
```

Expected:

- Tests and typecheck pass.
- Boundary diff is empty.

Local slice completed:

- Selected gap: `story-runtime` scene helpers were dropping `cityDefinitions` / `houseDefinitions` outside the continuation helper path.
- Implemented slice: `startStoryEventById()`, `triggerStoryEvents()`, `advanceStorySceneStep()`, and `chooseStorySceneOption()` now keep the incoming world-definition context.
- Added/updated coverage: `tests/event-continuation-runtime.test.cjs` now proves story runtime keeps world definitions across scene start and choice continuation.

- [ ] **Step 5: Commit and report**

Use a commit message of the form:

```powershell
git commit -m "merge: converge <runtime-area> follow-up completion"
```

Report the implementation, verification, and next task.
Before committing, update this handoff document with completed checkboxes, `Execution State`, `Progress Log`, and the exact next resume point.

## Task 3: Runtime Coordinator Reference Slice

**Files:**
- Read: `src/application/runtime/**`
- Read: `src/core/runtime/**`
- Read: `src/main.ts`
- Test: choose focused tests under `tests/*.test.cjs`

- [x] **Step 1: Audit mod-first-dev application runtime coordinators**

Run:

```powershell
git diff --name-status HEAD..origin/mod-first-dev -- src\application\runtime src\application\startup src\core\runtime src\main.ts
```

Expected:

- Identify coordinator helpers that can be added as dormant or test-only application modules without changing visible entry flow.
- Explicitly list any helper that would require `src/main.ts` shellification and defer it.

- [x] **Step 2: Pick only a dormant/testable helper**

Allowed examples:

- a pure runtime input adapter
- a presenter-neutral runtime transition helper
- a typed follow-up continuation helper

Rejected examples:

- direct render coordinator replacement
- startup shell takeover
- map travel UI animation coordinator replacement
- city/house transition rewrite that changes current behavior

- [x] **Step 3: Test first and implement**

Add a Node test that imports the helper directly and validates pure behavior.

- [x] **Step 4: Run verification**

Run:

```powershell
npm.cmd run build:test
node --test <new-or-targeted-test-file>
npm.cmd run typecheck
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
git diff --check
```

Expected:

- No UI/main/map/backpack diff unless explicitly approved before this task.

Local slice completed:

- Selected helper: council priority house resolution inside `src/application/runtime/navigation-time-follow-up.ts`.
- Why this fit Task 3: it is a pure runtime/application helper, it can be imported directly by a Node test, and it does not require entry-shell takeover or visible transition rewrites.
- Implemented behavior: exported `resolveCouncilPriorityHouseDefinition()` now accepts optional `buildingArrangements` and uses canonical owner matching to project current-city and `primaryNpcId` overrides onto the resolved priority house.
- Added coverage: `tests/navigation-time-follow-up.test.cjs`.

Additional local helper slice completed:

- Selected helper: `src/application/story/story-runtime-state-bridge.ts`.
- Why this fit Task 3: it is a pure runtime/application helper, directly testable in Node, and it stays dormant until a runtime caller chooses to consume authored city/house definition context.
- Implemented behavior: `createStoryRuntimeDefinitionContext()` materializes authored world definitions through app-state status layers, and `applyStoryRuntimeResultToAppState()` maps runtime world-definition results back into `cityStatusById` / `buildingStatusById`.
- Added coverage: `tests/story-runtime-state-bridge.test.cjs`.

Additional local context slice completed:

- Selected helper seam: `src/application/content/active-game-content.ts` plus content/scenario pack manifest loading.
- Why this fit Task 3: it stays inside content/runtime context preparation, is directly testable in Node, and does not require `src/main.ts`, UI, map, backpack, or visible flow rewiring.
- Implemented behavior: content packs now explicitly accept `eventBindings`, `settlements`, `progressTracks`, and `progressTrackBindings`; `createActiveGameContent()` builds arrays plus `ById` maps for them; `createActiveGameContentContext()` exposes those maps together with `cityDefinitionsById` / `houseDefinitionsById` on `storyContent`.
- Added coverage: `tests/active-game-content-story-context.test.cjs`.

- [x] **Step 5: Commit and report**

Use a commit message of the form:

```powershell
git commit -m "merge: add <runtime-helper> coordinator seam"
```

Report the implementation, verification, and next task.
Before committing, update this handoff document with completed checkboxes, `Execution State`, `Progress Log`, and the exact next resume point.

## Task 4: Main Shellification Decision Gate

**Files:**
- Read: `src/main.ts`
- Read: `docs/superpowers/specs/2026-07-03-main-startup-orchestration-extraction-design.md`
- Read: `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`
- Read: `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`
- Read: `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`

- [x] **Step 1: Do not start this task until runtime-only slices are stable**

Expected:

- Tasks 1-3 are complete or explicitly deferred with reasons.
- User has explicitly approved considering `src/main.ts`.

- [x] **Step 2: Decide whether a tiny entry-wiring slice is needed**

If `src/main.ts` is the only remaining caller for an already-tested runtime helper, propose a tiny wiring slice that:

- changes only one call path
- does not replace the entry shell
- includes targeted tests or browser smoke
- has an explicit rollback boundary

- [x] **Step 3: Reject full shellification in this plan**

Local Task 4 slice completed:

- Approved boundary: one narrow `src/main.ts` wiring expansion plus runtime/application seam changes only; no UI/map/backpack shell rewrite.
- Implemented behavior: `indoor-screen-story-follow-up` now routes timing-trigger settlement world updates through `story-runtime` + `story-runtime-state-bridge`; `story-runtime` applies settlement contents on initial trigger activation; `main-runtime-orchestrator` and `house-runtime` both project resulting city/building definition deltas back into app-state status layers.
- Added coverage: `tests/indoor-screen-story-runtime.test.cjs` plus the existing child 25/26 robustness subset.

Additional local Task 4 slice completed:

- Approved boundary: keep the same tiny `src/main.ts` passthrough seam and continue only inside shared runtime/application story modules.
- Implemented behavior: `story-runtime` now consumes `eventBindingsById` for `city-enter`, `house-enter`, and `indoor-screen-shown`, runs settlement-triggered progression evaluation plus settlement emission, persists optional `gameState.runtime.progression`, and receives `eventBindings/progressTrack` storyContent passthrough from `indoor-screen-story-follow-up`, `main-runtime-orchestrator`, and `house-runtime`.
- Added coverage: `tests/indoor-screen-story-runtime.test.cjs` now also proves main runtime orchestrator consumes event binding plus progression settlement output, and browser smoke confirmed current localhost startup -> map -> backpack -> city flow without console warn/error logs.

Record any need for full shellification as a new dedicated plan. Do not borrow `mod-first-dev` shellification wholesale inside this runtime migration handoff.

## Exit Check

- [ ] Current branch `codex/migration-hot-tasks` remains based on the current UI/map/backpack baseline.
- [ ] Every runtime slice has a focused test.
- [ ] Every runtime slice has a commit and push.
- [ ] This handoff document is updated after every completed plan task or migration slice.
- [ ] Each slice reports implemented behavior, verification, boundary diff, and next task.
- [ ] Compatibility fields remain available until entry and caller paths are fully migrated.
- [ ] No direct merge from `mod-first-dev` was used.
- [ ] No unapproved changes landed in `src/main.ts`, `src/ui/**`, `src/styles/**`, map, or backpack paths.
- [ ] `origin/codex/sync-naqishuo-721ui-to-mmz` is updated after approved integration points.

## Completion Checklist

- [x] Handoff reason recorded.
- [x] Handoff goal recorded.
- [x] Hard requirements recorded.
- [x] Current branch/upstream/baseline recorded.
- [x] Branch topology recorded.
- [x] Merge-back flow recorded.
- [x] Completed migration progress recorded.
- [x] Remaining safe migration tasks recorded.
- [x] Verification and boundary commands recorded.
- [ ] Future runtime slices completed.
- [ ] Final merge-back and push recorded.

## Child Closeout

- Closed Child: `Mod First Runtime Integration Handoff`
- Parent Task: `Mod First Runtime Migration`
- Parent Stage: `Runtime Migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `Story Choice Event Continuation Convergence`
- Next Child Status: `completed-but-open`
- Next Required Action: `Decide whether to keep docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md as a local verified checkpoint or commit/push it from codex/migration-hot-tasks before opening the next continuation child.`
- Next Entry Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks at the verified local choice-event continuation checkpoint, then either commit/push it or open the next adjacent continuation child for scene-runner start-event routing without widening into UI/map/backpack/main shell work.`
