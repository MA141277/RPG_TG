# Event Router First Runtime Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the current branch onto an event-router-first runtime shape where event-triggered functionality continues through the shared router/runtime-settlement pipeline, and the remaining direct caller / payload / authoring gaps are reduced to explicit, testable seams.

**Architecture:** Build on the existing `dispatchEventRoute(...)`, `continueEventChain(...)`, `dispatchRuntimeRequest(...)`, and `runtime-settlement` owners instead of inventing a second runtime. The next child should formalize which event-triggered capabilities stay modeled as event payload actions versus which require new runtime event kinds, then converge the remaining direct-entry callers and Script Editor/runtime-pack contracts onto that canonical shape.

**Tech Stack:** TypeScript runtime/application/domain modules, Script Editor import/export materializers, Node contract tests under `tests/*.test.cjs`, `pnpm run build:test`, targeted `node --test`, `pnpm run typecheck`, `pnpm run build`, `pnpm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-06`
- Current Focus: `Payload-first fourteenth slice landed: script-editor project parsing now normalizes settlements through the shared settlement authoring seam, so settlement ids/titles, nextEventId, and settlement content targets/values are canonicalized at project-entry time instead of relying on later export/runtime validation.`
- Next Step: `Continue payload-first convergence after settlement entry normalization: likely sweep remaining pack-level entry seams or shift from authoring-entry cleanup to the next runtime caller family that still bypasses router/runtime-dispatch.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs` passed 32/32; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "script-editor project parse keeps settlement normalization on one entry seam" tests/robustness.test.cjs` passed 1/1; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` passed.`
- Notes: `This is a branch-local follow-up plan. It should not overwrite docs/superpowers/project-progress.md until the branch owner explicitly promotes the current state to canonical governance.`

## Progress Log

- 2026-08-05
  - Summary: `Plan created after the generic meeting convergence line reached a branch-local closeout boundary. Initial audit confirmed the current branch already owns shared event-router, event-chain, runtime-dispatch, and runtime-settlement seams, so the next work is not greenfield runtime creation but convergence of remaining caller families, payload shape, and authoring contracts onto those existing owners.`
  - Verification: `sed -n '1,240p' src/core/runtime/event-router.ts; sed -n '1,220p' src/core/runtime/event-chain-runtime.ts; sed -n '1,260p' src/core/runtime/runtime-dispatch.ts; sed -n '1,260p' src/core/runtime/runtime-settlement.ts; sed -n '1,260p' src/core/runtime/event-entity-projection.ts; sed -n '1,260p' src/domain/event.ts; sed -n '160,240p' src/application/story/story-runtime.ts; rg -n "dispatchEventRoute|runEventBindingRuntime|event-router|runtime-settlement" src tests.`
  - Next: `Write down the concrete gap inventory and pick the first runtime-only convergence slice so implementation can resume without re-auditing.`
- 2026-08-05
  - Summary: `Completed Task 1 planning audit and chose the first slice. Concrete gap inventory: live runtime already centralizes routing, event chaining, task settlement, and runtime-settlement, but authored EventDefinition is still dialogue/settlement-first; RuntimeEventEntity projection only emits dialogue/settlement kinds from authored events; story runtime only registers dialogue/settlement handlers; and Script Editor round-trip currently centers `dialogueId / settlementId / nextEventId` rather than a fuller action-first payload surface. Because EventRouteCommand already carries `launchPlayable`, `launchFlow`, `openCityMenuPanel`, and `closeBuilding`, the narrowest first slice is `payload-first`: extend the existing event payload/authoring path instead of adding new runtime event kinds up front.`
  - Verification: `sed -n '1,260p' src/domain/event.ts; sed -n '1,260p' src/core/contracts/event-router.ts; sed -n '1,260p' src/core/runtime/event-entity-projection.ts; sed -n '160,240p' src/application/story/story-runtime.ts; sed -n '1,240p' src/modules/script-editor/application/story-dialogue-event-authoring.ts; sed -n '430,560p' src/modules/script-editor/application/runtime-pack-import.ts; sed -n '1980,2060p' src/modules/script-editor/application/runtime-pack-export.ts.`
  - Next: `Add RED tests for the payload-first contract: one behavior test for routed action payload survival and one ownership/source-level guard proving the chosen action-first seam stays on shared runtime owners.`
- 2026-08-05
  - Summary: `Completed the first payload-first RED/GREEN slice. Added a round-trip regression proving `launchFlow` event actions must survive runtime-pack export/import without degrading into raw `launchPlayable`, added a source-level ownership guard for dedicated action rehydration, and implemented `runtime-pack-import` flow-integration rehydration so derived `playable.<flow>.default` runtime actions map back onto authored `launchFlow` payload actions.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack round trip preserves launchFlow event actions as flow-owned payload actions" tests/script-editor-runtime-preview-compat.test.cjs` first failed because round-trip returned `launchPlayable` with `integrationId`, then passed after import-side rehydration; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack import keeps derived flow launch actions on a dedicated rehydration seam" tests/robustness.test.cjs` passed after the source-level guard update; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack import keeps derived flow launch actions on a dedicated rehydration seam|runtime event action payload helper reads canonical actions from the routed event payload|runtime event entity payload projection preserves authored runtime payload" tests/robustness.test.cjs tests/event-router-runtime.test.cjs` passed 3/3.`
  - Next: `Pick the next payload-first asymmetry to converge: menu/playable destination round-trip, action normalization/validation in story-dialogue-event-authoring, or another remaining direct caller family outside Script Editor authoring.`
- 2026-08-06
  - Summary: `Completed the second payload-first RED/GREEN slice. Added a round-trip regression showing explicit authored \`launchPlayable\` actions must stay on the event payload seam even when their integrationId matches a Script Editor minigame instance, added a source-level guard for dedicated minigame-destination rehydration, and changed runtime-pack export/import so only destination-derived minigame launch lowerings carry a reserved \`scriptEditorSource\` marker and get rehydrated back into \`destination.family = "minigame"\`.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack round trip keeps explicit launchPlayable actions on the payload seam" tests/script-editor-runtime-preview-compat.test.cjs` first failed because import rehydrated the action into `destination.family = "minigame"`, then passed after the import/export marker seam landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack import keeps playable action rehydration off the destination seam" tests/robustness.test.cjs` first failed on the old `importedPlayableAction` heuristic, then passed after dedicated destination detection was introduced; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack round trip preserves launchFlow event actions as flow-owned payload actions|runtime-pack round trip keeps explicit launchPlayable actions on the payload seam|event authoring normalization preserves runtime payload actions and task inputs" tests/script-editor-runtime-preview-compat.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack import keeps derived flow launch actions on a dedicated rehydration seam|runtime-pack import keeps playable action rehydration off the destination seam" tests/robustness.test.cjs` passed 2/2.`
  - Next: `Pick the next payload-first asymmetry after playable-destination disambiguation: likely mixed destination/action validation for menu+playable combinations, broader action normalization in authoring, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the third payload-first RED/GREEN slice. Added a round-trip regression showing explicit authored \`openCityMenuPanel\` actions must stay on the event payload seam instead of being downgraded into menu destination routing, added a source-level guard for dedicated menu-destination rehydration, and changed runtime-pack export/import so only destination-derived city-menu actions carry the reserved Script Editor source marker while explicit menu actions export/import as ordinary payload actions.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack round trip keeps explicit openCityMenuPanel actions on the payload seam" tests/script-editor-runtime-preview-compat.test.cjs` first failed because export rejected authored menu actions entirely, then passed after `openCityMenuPanel` payload export and dedicated destination marking were added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack import keeps menu action rehydration off the destination seam" tests/robustness.test.cjs` first failed on the old `importedMenuAction` heuristic, then passed after dedicated menu destination detection was introduced; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack round trip preserves menu destinations for retained template events|runtime-pack round trip keeps explicit openCityMenuPanel actions on the payload seam" tests/script-editor-runtime-preview-compat.test.cjs` passed 2/2; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack import keeps playable action rehydration off the destination seam|runtime-pack import keeps menu action rehydration off the destination seam" tests/robustness.test.cjs` passed 2/2.`
  - Next: `Pick the next payload-first asymmetry after playable/menu destination disambiguation: likely mixed destination/action validation for menu+playable combinations, broader action normalization in authoring, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the fourth payload-first RED/GREEN slice. Added export-side regressions showing Script Editor must reject a single event that simultaneously authors \`destination.family = "menu"\` plus explicit \`openCityMenuPanel\` actions, or \`destination.family = "minigame"\` plus explicit \`launchPlayable\` actions, then introduced fail-closed validation in runtime-pack export so same-family destination and payload seams cannot silently lower together.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export rejects mixed menu destination and menu action authoring|runtime-pack export rejects mixed minigame destination and playable action authoring" tests/script-editor-runtime-preview-compat.test.cjs` first failed because export accepted both ambiguous shapes, then passed after exclusive seam validation landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` first failed because the expected fail-closed diagnostics were absent, then passed after the export guard was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after destination/action fail-closed validation: likely broader action normalization in authoring, mixed launchFlow/playable validation, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the fifth payload-first RED/GREEN slice. Added export-side regressions showing Script Editor must reject a dialogue destination that is authored together with route-owning payload actions such as \`openCityMenuPanel\` or \`launchFlow\`, then extended the exclusive seam validation so export no longer silently erases the dialogue destination whenever those actions are present.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export rejects mixed dialogue destination and menu action authoring|runtime-pack export rejects mixed dialogue destination and flow action authoring" tests/script-editor-runtime-preview-compat.test.cjs` first failed because export still accepted both ambiguous dialogue mixes, then passed after dialogue/action exclusive seam validation landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` first failed because the dialogue fail-closed message was absent from the export seam, then passed after the guard was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after dialogue/action fail-closed validation: likely broader action normalization in authoring, mixed launchFlow/playable validation inside payload actions, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the sixth payload-first RED/GREEN slice. Added a round-trip regression proving dialogue destinations must remain intact when an event only carries non-route-owning payload actions such as \`closeBuilding\`, then narrowed the export-side dialogue suppression check from "any actions" to only route-owning actions so side-effect payloads no longer silently erase authored dialogue destinations.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack round trip preserves dialogue destination when actions are non-route-owning" tests/script-editor-runtime-preview-compat.test.cjs` first failed because import/export returned `destination.family = "event"` instead of the authored dialogue target, then passed after the route-owning action helper replaced the blanket `hasRuntimeEventActions` gate; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` first failed because the new helper was absent and the old blanket action gate remained, then passed after the helper landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after dialogue preservation: likely broader action normalization in authoring, mixed launchFlow/playable validation inside payload actions, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the seventh payload-first RED/GREEN slice. Added export-side regression coverage proving explicit \`launchFlow\` actions must fail closed when they target a nonexistent flow record, then threaded the authored flow-id set into event action lowering so missing flow references are rejected before they can lower into dangling \`playable.<flow>.default\` integrations.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export rejects launchFlow actions that reference missing flows" tests/script-editor-runtime-preview-compat.test.cjs` first failed because export accepted the missing flow reference with no diagnostics, then passed after flow existence validation landed in event action lowering; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` first failed because the missing-flow guard text was absent from the export seam, then passed after the new diagnostic was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after missing-flow validation: likely broader action normalization in authoring, panel/action value normalization, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the eighth payload-first RED/GREEN slice. Added export-side regression coverage proving explicit \`openCityMenuPanel\` actions must reject unsupported panel ids such as \`begging\`, then aligned payload-action lowering with the same city-menu panel normalization used by destination lowering so malformed panel values now fail closed during runtime-pack export.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export rejects openCityMenuPanel actions with unsupported panel ids" tests/script-editor-runtime-preview-compat.test.cjs` first failed because export accepted the invalid panel id without diagnostics, then passed after explicit menu-action panel validation/normalization landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` first failed because the unsupported-panel diagnostic text was absent from the export seam, then passed after the guard was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after panel-id validation: likely broader action normalization in authoring, explicit launchPlayable/integration validation, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the ninth payload-first RED/GREEN slice. Added export-side regression coverage proving explicit \`launchPlayable\` actions must fail closed when they reference a missing playable integration or when the referenced integration resolves to a different `playableId`, then threaded a supported integration->playable map through event action lowering so explicit launch payloads can only target integrations that the current project will actually export.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export rejects launchPlayable actions that reference missing integrations|runtime-pack export rejects launchPlayable actions whose integration does not match playableId" tests/script-editor-runtime-preview-compat.test.cjs` first failed because export accepted both dangling and mismatched launchPlayable payloads with no diagnostics, then passed after integration existence/match validation landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` first failed because the new missing-integration/mismatched-playable diagnostics were absent from the export seam, then passed after the guard text landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after launchPlayable integration validation: likely broader action normalization in authoring, ownerContext value normalization, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the tenth payload-first RED/GREEN slice. Preserved the explicit `launchPlayable` integration validation, then reconciled imported template compatibility by recognizing explicit minigame integration ids during exportable integration collection and by silently deduplicating flow default integrations when an imported playable-integration shadow already owns the same `playable.<flow>.default` id. This keeps template round-trip export stable while still failing closed for dangling or mismatched launchPlayable payloads.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "imported zhuyuanzhang script-editor template stays exportable for runtime preview|runtime-pack round trip preserves menu destinations for retained template events|template runtime-pack export preserves aligned zhuyuanzhang startup profile fields|runtime-pack export rejects launchPlayable actions that reference missing integrations|runtime-pack export rejects launchPlayable actions whose integration does not match playableId" tests/script-editor-runtime-preview-compat.test.cjs` first failed because template-exported event actions referenced preserved minigame integration ids that were not yet part of the supported integration map, then failed again because round-trip export reported duplicate flow default integrations after those explicit ids were admitted, and finally passed after explicit minigame integration ids were collected and flow-shadow duplicates were skipped; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` passed after the new launchPlayable diagnostics remained present; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed.`
  - Next: `Pick the next payload-first asymmetry after launchPlayable integration validation and flow-shadow dedupe: likely broader action normalization in authoring, ownerContext value normalization, or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the eleventh payload-first RED/GREEN slice. Script Editor event authoring now trims and normalizes payload-route actions (`launchFlow`, `launchPlayable`, `openCityMenuPanel`), ownerContext strings, destination/nextEvent ids, and task-input strings at the authoring seam, and `parseScriptEditorProject(...)` now applies that normalization to every imported or loaded event instead of leaving the cleanup to runtime-pack export.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "event authoring normalization preserves runtime payload actions and task inputs|script-editor project parse normalizes routed event payload authoring at the entry seam" tests/script-editor-runtime-preview-compat.test.cjs` first failed because `normalizeScriptEditorEventRecord(...)` preserved whitespace-padded action/task-input fields and `parseScriptEditorProject(...)` left `events` untouched, then passed after event action/task-input normalization and loader-side event normalization landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "script-editor project parse keeps event authoring normalization on one entry seam|runtime-pack export fails closed on mixed destination and same-family payload actions" tests/robustness.test.cjs` passed after the loader seam guard and existing fail-closed guard remained green; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs` passed 25/25; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` passed.`
  - Next: `Pick the next payload-first asymmetry after event-entry normalization: likely remaining trigger/binding value normalization in authoring or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the twelfth payload-first RED/GREEN slice. `parseScriptEditorProject(...)` now runs `eventBindings` through `normalizeScriptEditorEventBindingRecord(...)`, so whitespace-padded event ids, owner ids/families, trigger timing/action values, and payloadSchemaId fields are canonicalized at the same project-entry seam as event payload actions.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "event binding normalization preserves canonical trigger and owner contract fields|script-editor project parse normalizes event binding authoring at the entry seam" tests/script-editor-runtime-preview-compat.test.cjs` first failed because `parseScriptEditorProject(...)` still passed raw `eventBindings` through unchanged, then passed after loader-side event-binding normalization landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "script-editor project parse keeps event binding normalization on one entry seam" tests/robustness.test.cjs` passed after the loader seam guard was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs` passed 27/27; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` passed.`
  - Next: `Pick the next payload-first asymmetry after event-binding entry normalization: likely progress-track / progress-binding entry normalization or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the thirteenth payload-first RED/GREEN slice. `parseScriptEditorProject(...)` now runs both `progressTracks` and `progressTrackBindings` through their shared authoring normalizers, so track ids/titles, hostFamily, tier thresholds, target settlement ids, binding host ids, and bound track ids all stabilize at the same project-entry seam as events and bindings.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "progress track normalization preserves canonical threshold and target fields|progress track binding normalization preserves canonical host fields|script-editor project parse normalizes progress authoring at the entry seam" tests/script-editor-runtime-preview-compat.test.cjs` first failed because `parseScriptEditorProject(...)` still passed raw `progressTracks` / `progressTrackBindings` through unchanged, then passed after loader-side progress normalization landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "script-editor project parse keeps progress normalization on one entry seam" tests/robustness.test.cjs` passed after the loader seam guard was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs` passed 30/30; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` passed.`
  - Next: `Pick the next payload-first asymmetry after progress entry normalization: likely remaining settlement/pack entry normalization or the next non-router direct caller family.`
- 2026-08-06
  - Summary: `Completed the fourteenth payload-first RED/GREEN slice. `parseScriptEditorProject(...)` now runs `settlements` through `normalizeScriptEditorSettlementRecord(...)`, so settlement ids/titles, nextEventId, and settlement content target/value fields stabilize at the same project-entry seam as events, bindings, and progress records.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "settlement normalization preserves canonical next-event and content fields|script-editor project parse normalizes settlement authoring at the entry seam" tests/script-editor-runtime-preview-compat.test.cjs` first failed because `parseScriptEditorProject(...)` still passed raw settlements through unchanged, then passed after loader-side settlement normalization landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "script-editor project parse keeps settlement normalization on one entry seam" tests/robustness.test.cjs` passed after the loader seam guard was added; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs` passed 32/32; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` passed.`
  - Next: `Pick the next payload-first asymmetry after settlement entry normalization: likely remaining pack-level entry seams or the next non-router direct caller family.`

---

## Based On Spec

- Primary specs:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/scenario-pack-unified-format.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-trigger-runtime-route-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Current working branch is merage-mod2ui-1, not the historical codex/migration-hot-tasks branch referenced by older runtime children.`
  - `The current branch already contains live event-router, event-chain-runtime, runtime-dispatch, and runtime-settlement owners; the next child must converge onto those assets instead of replaying historical route-convergence slices.`
  - `Current EventDefinition -> RuntimeEventEntity projection still effectively maps authored events to dialogue/settlement-first runtime entities, even though EventRouteCommand already carries launchPlayable / launchFlow / menu actions.`
  - `Story runtime currently registers only dialogue/settlement router handlers; the next slice must decide whether richer functionality should stay action-payload-driven or require new runtime event kinds.`

## Implementation Scope

### In Scope

- Audit and converge remaining event-triggered caller families onto the shared event-router/runtime-dispatch seam.
- Formalize the canonical boundary between runtime event kinds and event payload actions.
- Extend the minimum Script Editor/runtime-pack contracts needed to author and round-trip the chosen event-router-first shape.
- Keep settlement application on shared runtime-settlement ownership.

### Still Out Of Scope

- Redesigning generic meeting / temple review again.
- Reworking `src/main.ts` into a new gameplay owner.
- Canonical `project-progress.md` promotion unless explicitly requested.
- Broad house/module feature migration unrelated to event-triggered entry.
- One-off scenario content rewrites that bypass the shared runtime contract decision.

## File Map

### Existing files to modify

- `src/domain/event.ts`
  - Define the canonical authored event surface that the router-first runtime will consume.
- `src/core/contracts/event-router.ts`
  - Expand or clarify runtime event entity shape only if the first slice requires additional routed kinds.
- `src/core/runtime/event-entity-projection.ts`
  - Keep the single projection seam from authored event definitions into runtime event entities/payload.
- `src/core/runtime/event-router.ts`
  - Preserve the single runtime route owner while extending handler dispatch only if needed.
- `src/core/runtime/runtime-dispatch.ts`
  - Keep event follow-up chain + settlement/task settlement orchestration centralized.
- `src/application/story/story-runtime.ts`
  - Continue using the shared router/runtime-dispatch seam and remove any newly identified direct payload ownership drift.
- `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
  - Align event authoring fields with the chosen router-first payload contract.
- `src/modules/script-editor/application/runtime-pack-import.ts`
  - Preserve round-trip import for the same canonical event shape.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Preserve round-trip export for the same canonical event shape.
- `tests/event-router-runtime.test.cjs`
  - Add RED/GREEN coverage for the chosen router-first runtime slice.
- `tests/robustness.test.cjs`
  - Add ownership assertions so the new event-router-first seam cannot regress.

### Existing files expected to be deleted

- `None expected initially.`

### New files to create

- `None required for the first audit-driven slice unless a new narrow runtime helper proves necessary.`

## Verification Plan

- Targeted verification:
  - The chosen event-triggered caller family routes through the shared event-router/runtime-dispatch seam.
  - Settlement application remains centralized under `runtime-settlement`.
  - The authored event payload chosen for the slice round-trips through Script Editor import/export without hidden fallback ownership.
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/robustness.test.cjs --test-name-pattern "event router runtime core|event binding runtime route convergence|runtime event settlement id payload consumption|navigation enter-house convergence|story settlement runtime owner convergence"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Lock The First Router-First Slice

**Files:**
- Read: `src/domain/event.ts`
- Read: `src/core/contracts/event-router.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Read: `src/core/runtime/event-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
- Read: `src/modules/script-editor/application/runtime-pack-import.ts`
- Read: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `docs/superpowers/plans/2026-08-05-event-router-first-runtime-convergence-plan.md`

- [ ] **Step 1: Record the concrete gap inventory**

Summarize which of these are true in live code:

- authored events are still dialogue/settlement-first
- richer functionality already exists as payload actions
- some caller families still bypass router/runtime-dispatch
- Script Editor cannot yet round-trip the chosen payload surface cleanly

- [ ] **Step 2: Choose the narrowest first implementation slice**

Decide one of:

- `payload-first`: keep runtime kinds narrow and extend payload action authoring/consumption
- `kind-first`: add a new runtime event kind with explicit router handler support
- `caller-first`: converge one remaining direct-entry caller family onto the existing router/runtime-dispatch seam

Record the decision and explicitly list what stays out of scope for the first code batch.

- [ ] **Step 3: Sync progress and governance state**

Append the decision to `Progress Log`, update `Execution State`, and record the exact next code entrypoint so implementation can resume without another audit.

## Task 2: Add RED Coverage For The Chosen Slice

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Read: `src/core/runtime/event-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/event-entity-projection.ts`

- [ ] **Step 1: Add a focused behavior test for the chosen runtime seam**

Add one RED test that proves the chosen slice currently fails without the new router-first convergence.

- [ ] **Step 2: Add one ownership/source-level guard**

Lock the new seam in `tests/robustness.test.cjs` so direct fallback ownership cannot quietly return.

- [ ] **Step 3: Run the targeted RED commands**

Run the smallest relevant test commands and record the expected failing assertion/output in `Progress Log`.

## Task 3: Implement The Minimal Router-First Convergence

**Files:**
- Modify: `src/domain/event.ts`
- Modify: `src/core/contracts/event-router.ts`
- Modify: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/core/runtime/event-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify only if required by the chosen slice: `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
- Modify only if required by the chosen slice: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify only if required by the chosen slice: `src/modules/script-editor/application/runtime-pack-export.ts`

- [ ] **Step 1: Implement the minimal code change that makes the RED test pass**

Keep the change inside the chosen slice boundary and reuse the existing router/runtime-dispatch/runtime-settlement owners.

- [ ] **Step 2: Re-run targeted tests**

Run the focused event-router/runtime tests first, then the narrow robustness subset.

- [ ] **Step 3: Run required verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans
```

Expected:

- `PASS`

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
