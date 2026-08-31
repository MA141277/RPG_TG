# Task 2 Report: Wire The External Provider Through The Intent Gate

## Status

Implemented locally.

## Scope

- Updated `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts` so OpenAI-compatible house `select_option` and `custom_input` turns resolve the Task 1 intent gate before visible response generation.
- Routed `chat` decisions to `buildHouseConversationChatResponseRequest(...)`.
- Routed `clarify` decisions to `buildHouseConversationClarifyResponseRequest(...)`, keeping the normal three-option choice loop.
- Routed `route` decisions to `buildHouseConversationRouteTransitionRequest(...)`, preserving the existing transition-line and pending-route handoff.
- Kept legacy non-house `[ACTION]` routing behind the no-house-snapshot path.
- Failed closed when the gate remains malformed or illegal after one repair attempt.
- Did not touch `src/main.ts`.

## Tests Added Or Updated

- `tests/npc-ai-dialogue-external-provider.test.cjs`
  - Added ambiguous tavern intent coverage proving `[INTENT: clarify]` produces the exact one-question, three-option clarify response from the brief.
  - Updated the hidden house-jump route fixture to use `[INTENT: route|go-to-house|house.kulan.grain_shop]` and the exact transition text from the brief.
  - Updated the house service route fixture to use `[INTENT: route|settle-house-service|tavern-gamble]`.
  - Added chat coverage proving `[INTENT: chat]` uses the dedicated chat continuation prompt and produces ordinary choices, not handoff steps.
  - Added malformed/illegal gate coverage proving one repair attempt occurs and then the provider emits an error without falling through to visible generation.
- `tests/npc-ai-dialogue-runtime.test.cjs`
  - Added clarify runtime coverage proving the session remains `awaiting-choice` and `pendingRoute` remains `null`.
  - Added selected-option/custom-input parity coverage proving the same spoken line and house snapshot produce the same validated route result after page advance.

## RED Evidence

Command:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
```

Result: FAIL, 34 pass / 1 fail.

Failure: `external NPC AI provider clarifies ambiguous house intent instead of guessing a route` failed because after `[INTENT: clarify]`, the provider still sent the original generic visible request. The second request body did not contain the dedicated clarify instruction (`简短的追问`).

## GREEN Evidence

Command:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
```

Result: PASS.

- Focused helper/provider/runtime suites: 45 tests, 45 pass.
- Repository typecheck equivalent: PASS.
- Superpowers plan lint: PASS for 103 files.

## Notes

- `npm` is unavailable on this PowerShell PATH, so the cached Node/TypeScript equivalents were used for `npm run build:test` and `npm run typecheck`.
- The working tree remains dirty with many unrelated local files. Task 2 edits were limited to the provider, the two focused test files, the owner plan sync, project progress sync, and this report.
- `docs/change-log.md` remains for Task 3, as specified by the active plan.

## Fix Round 1

### Finding

`chat` / `clarify` gate decisions were still bypassable by visible replies that returned `[ACTION: ...]`, because the prepared chat/clarify visible response requests retained handoff-capable metadata.

### Changes

- Updated `buildHouseConversationChoiceLoopResponseRequest(...)` in `src/application/npc-interaction/npc-ai-house-intent-gate.ts` so chat/clarify response variants strip `availableSpecialActions`, `houseConversationCapabilitySnapshot`, `forcedSpecialActionId`, and `forcedHouseConversationRoute` from the visible response request metadata.
- Kept the route branch unchanged.
- Added focused external-provider regressions proving `[ACTION: open-gamble]` is rejected after both `[INTENT: chat]` and `[INTENT: clarify]`.

### RED Evidence

Command:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-external-provider.test.cjs
```

Relevant output:

```text
not ok 17 - external NPC AI provider rejects ACTION handoff after a chat gate decision
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
2 !== 3

not ok 18 - external NPC AI provider rejects ACTION handoff after a clarify gate decision
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
2 !== 3

tests 24
pass 22
fail 2
```

The two-call result showed the provider accepted the visible `[ACTION]` immediately instead of rejecting and repairing the non-route response.

### GREEN Evidence

Commands:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
```

Relevant output:

```text
tests 47
pass 47
fail 0
Superpowers plan lint passed for 103 files.
```

Repository typecheck exited 0.

### Commit Addendum

- Status: committed fix round 1.
- Commit: `845a7df3`
- Note: The commit includes the metadata-stripping helper change, the two ACTION-leak provider regressions, and the recovered fix-round report section.
