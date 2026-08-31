# Global NPC AI Dialogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static default NPC `谈话` placeholder with a shared AI dialogue loop that works in any building, preserves the existing avatar -> menu -> `谈话` entry, and writes each NPC exchange into persistent memory logs.

**Architecture:** Keep the existing generic NPC interaction entry/menu, upgrade `NpcInteractionSession` into a typed AI dialogue session, add a shared NPC dialogue runtime/provider seam that is independent from concrete house modules so fallback houses also work, persist memory logs under unified `GameState.runtime`, and keep `src/main.ts` changes shell-only. Reuse TXT-style marker/parser/provider patterns where practical, but do not bind the feature to `txt-narrative-place`.

**Tech Stack:** TypeScript domain/application/ui/runtime modules, focused CommonJS tests under `.test-dist`, `tools/lint-superpowers-plans.mjs`, targeted `node --test` suites, and repository typechecks via bundled TypeScript.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-26`
- Current Focus: `Shared NPC AI dialogue still runs in-place on the existing house UI, and the latest local batches now cover four guardrails: start_talk immediately sends explicit place/player/NPC dialogue context to the model, the first-turn prompt explicitly asks the NPC to open with an in-character contextual line, hung external chat requests no longer hang forever, and the OpenAI-compatible provider now retries a configured fallback model chain before surfacing an error. Governance resync and keep-local vs commit/push remain open.`
- Next Step: `Restart localhost so the updated .env.local is loaded, then manually verify that “头像 -> 现有菜单 -> 谈话” now yields an NPC opening line through the configured proxy instead of stalling on “正在组织下一句话”; otherwise keep the batch local until governance resync or commit/push is explicitly requested.`
- Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs tests/npc-fallback-house-roster-contract.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
- Notes: `docs/superpowers/project-progress.md currently tracks a different completed-but-open tavern child. This plan executes locally in the current workspace and must remain local unless governance is intentionally resynced later. The new UI batch intentionally keeps AI dialogue out of src/main.ts business logic and reuses the existing bottom house dialogue shell. The current local workaround keeps deepseek-v3.1 as the preferred model but retries deepseek-v3 when the proxy-side chat completion path hangs from this environment.`

## Progress Log

- 2026-08-26
  - Summary: `Diagnosed the current proxy issue as model-specific rather than UI-specific: the configured OpenAI-compatible path still lists deepseek-v3.1, but chat completions from this environment hang on that model while deepseek-v3 returns normally. To keep the requested primary model without blocking gameplay, the shared provider bootstrap/runtime now accepts fallbackModels, main.ts passes Vite fallback env through shell-only wiring, and the OpenAI-compatible provider retries the fallback chain after a preferred-model timeout before surfacing an error.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs tests/npc-fallback-house-roster-contract.test.cjs (27/27); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
  - Next: `Restart localhost so the new fallback env is loaded, then verify in-browser that NPC first-turn dialogue now returns through the proxy instead of staying on the streaming placeholder.`
- 2026-08-26
  - Summary: `Tightened the first-turn shared NPC AI prompt so clicking 谈话 now tells the model to let the NPC open with an in-character contextual line, explicitly allows greeting/small-talk style openings, and forbids OOC drift while preserving the existing three-option reply contract.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs tests/npc-fallback-house-roster-contract.test.cjs (26/26); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json.`
  - Next: `Refresh localhost and confirm the NPC now opens the first turn with contextual in-character dialogue rather than a generic placeholder instruction pattern.`
- 2026-08-26
  - Summary: `Added the local bugfix batch for the first-turn NPC talk hang: shared start_talk requests now inject explicit place/player/NPC/pair context into the first AI prompt, and the OpenAI-compatible external provider now aborts hung chat/completions calls with a retryable timeout error instead of leaving the dialogue session stuck in streaming forever.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\tools\lint-superpowers-plans.mjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs tests/npc-fallback-house-roster-contract.test.cjs (26/26); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "global NPC interaction renderer emits generic menu actions|global NPC default talk opens the shared AI dialogue shell and close clears the session|global NPC interaction blocks roster clicks while overlays or dialogue own input" tests/robustness.test.cjs (3/3); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
  - Next: `Refresh localhost and confirm the player now sees either a real NPC first line or a timeout error prompt, rather than an infinite “正在组织下一句话” state.`
- 2026-08-25
  - Summary: `Ran a fresh final verification pass for the in-place shared NPC AI dialogue batch after the bottom-box UI refactor. The local batch is now re-verified across plan lint, repo typecheck, production vite build, .test-dist build, the focused NPC dialogue suites, and the shared-NPC robustness selectors.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\tools\lint-superpowers-plans.mjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd run build:test; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs (24/24); PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "global NPC interaction renderer emits generic menu actions|global NPC default talk opens the shared AI dialogue shell and close clears the session|global NPC interaction blocks roster clicks while overlays or dialogue own input" tests/robustness.test.cjs (3/3).`
  - Next: `If the user wants browser-side proof, refresh localhost and click through “头像 -> 现有菜单 -> 谈话”; otherwise keep the batch local and wait for a keep-local vs commit/push decision.`
- 2026-08-25
  - Summary: `Refactored the shared NPC AI dialogue UI from a standalone center overlay into an in-place house-shell flow: NPC lines now page through the existing bottom dialogue box with punctuation-aware splitting, central house actions disappear while talk is active, reply choices only appear after the last NPC page, and custom input is now a fourth entry button that expands into a temporary composer instead of a permanent text field.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-view-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs tests/robustness.test.cjs with the shared NPC dialogue slices passing and unrelated pre-existing failures remaining elsewhere in robustness.test.cjs.`
  - Next: `Run fresh typecheck / vite build / plan lint after syncing docs, then refresh localhost for a manual browser proof if needed.`
- 2026-08-25
  - Summary: `Completed the real-provider follow-up on top of the shared NPC dialogue seam: added an OpenAI-compatible external provider mode for chat completions, added a local bootstrap helper that maps Vite env values into the shared provider config without overriding manual browser-side seams, wired src/main.ts to prime that config shell-only before creating the NPC runtime, and created a local .env.local so localhost can target the requested DeepSeek model through the proxy immediately.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\tools\lint-superpowers-plans.mjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/npc-fallback-house-roster-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-provider-bootstrap.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-name-pattern "global NPC interaction blocks roster clicks while overlays or dialogue own input" tests/robustness.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
  - Next: `Restart localhost so the new .env.local values are loaded, then verify in-browser that the existing NPC talk entry now reaches the requested OpenAI-compatible proxy end-to-end.`
- 2026-08-25
  - Summary: `Created the governed local implementation plan from the approved shared NPC AI dialogue design. The child is intentionally non-canonical because project-progress still points at the earlier tavern item, but the user explicitly approved executing this feature now in the current workspace.`
  - Verification: `Plan/spec authoring only; implementation verification not run yet.`
  - Next: `Write the RED tests for the shared NPC AI runtime, renderer contract, and fallback house trigger coverage.`
- 2026-08-25
  - Summary: `Added the RED tests for the shared NPC AI runtime, AI dialogue renderer, fallback non-module house trigger coverage, and updated the dialogue sound contract to the future AI dialogue button surface.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; FAIL (expected) - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/npc-fallback-house-roster-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs with missing src/domain/npc-ai-dialogue.ts, missing .test-dist/core/runtime/npc-interaction-runtime.js, missing .test-dist/ui/views/house/fallback-house-view.js, and ai-dialogue renderer assertions receiving empty markup from the current static implementation.`
  - Next: `Implement the shared NPC AI domain/runtime/provider files, replace the static talk renderer, and add the fallback house renderer until the targeted suites turn green.`
- 2026-08-25
  - Summary: `Completed the shared NPC AI dialogue slice locally: added the replaceable provider/runtime seam, upgraded the NPC interaction session into an AI dialogue panel with transcript/three options/custom input/exit, made fallback non-module houses emit the shared NPC trigger attributes, and synchronized the shared house/change-log docs to the new baseline talk contract.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/lint-superpowers-plans.mjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/npc-fallback-house-roster-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none --test-name-pattern "global NPC interaction blocks roster clicks while overlays or dialogue own input" tests/robustness.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; INFO - full tests/robustness.test.cjs still has unrelated existing failures in createInitialState/market/inventory coverage from other local dirty-worktree changes.`
  - Next: `Review the verified shared NPC AI dialogue diff, then decide whether to keep it local or resync governance before any commit/push.`
- 2026-08-25
  - Summary: `Applied the local follow-up fix for real in-game entry and zip-style backend compatibility: default NPC buttons rendered inside existing house action containers now preserve the shared NPC context seam so “现有菜单 -> 谈话” seeds the shared session before dispatch, and the external provider now normalizes zip SSE plain-text/body/options payloads into dialogue plus three-choice steps without requiring explicit marker syntax from the backend.`
  - Verification: `PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests/npc-ai-dialogue-house-entry.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; PASS - C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\vite\bin\vite.js build.`
  - Next: `Refresh the local client, verify the existing house menu talk button now enters the shared AI dialogue loop, then keep the batch local unless governance resync or commit/push is explicitly requested.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-25-global-npc-ai-dialogue-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The repo already has a shared NPC interaction menu and a TXT-style provider/parser seam from the local txt-narrative-place slice, so the new work can reuse those patterns.`
  - `The current default talk path is still static and fallback houses still render non-interactive roster cards, so a shared runtime + fallback roster change is still required.`
  - `Canonical project-progress remains on the tavern completed-but-open child, so this plan executes locally and must not claim canonical closeout unless governance is intentionally resynced later.`

## Global Constraints

- Do not add building-specific AI branches to `src/main.ts`.
- Do not implement this as per-house copied business logic.
- Do not rely on house-module dispatch for the whole dialogue loop because fallback houses must also work.
- Keep persistent NPC memory in unified runtime state.
- Reserve the real AI integration behind a replaceable provider interface.
- Preserve the existing avatar -> menu -> `谈话` entry flow.
- The first slice persists memory logs but does not need a separate memory-log viewer UI.
- The current workspace is already dirty; do not revert unrelated local changes.

## Implementation Scope

### In Scope

- Add shared NPC AI dialogue session/provider/runtime contracts.
- Persist per-NPC dialogue memory logs under unified runtime state.
- Replace the static default NPC dialogue renderer with a real transcript/choice/custom-input panel.
- Add a deterministic placeholder provider for the new shared NPC talk seam.
- Make fallback non-module house rosters emit shared NPC interaction triggers.
- Update shared docs and relevant NPC interaction tests.

### Still Out Of Scope

- A standalone memory log viewer.
- City/street/scene NPC AI dialogue outside building contexts.
- Real internal AI client integration.
- Replacing special house actions or house business overlays.

## File Map

### Existing files to modify

- `src/domain/npc-interaction.ts`
  - Upgrade the session contract and shared NPC option/dialogue view types.
- `src/domain/game-state.ts`
  - Add the persistent NPC memory runtime branch.
- `src/application/state/create-initial-state.ts`
  - Initialize the new runtime branch.
- `src/application/app-actions.ts`
  - Stop treating `谈话` as a static mode flip and route it through shared AI dialogue state transitions.
- `src/application/npc-interaction/npc-interaction.ts`
  - Add selectors/reducers for shared AI dialogue session state.
- `src/ui/components/npc-interaction/npc-interaction-menu.ts`
  - Render the AI dialogue transcript/options/custom-input panel.
- `src/ui/app-render.ts`
  - Adapt overlay rendering and fallback house rendering to the new shared NPC dialogue contract.
- `src/main.ts`
  - Only for shell-only runtime injection and dispatch plumbing.
- `src/domain/global-ui.ts`
  - Carry the upgraded NPC session type.
- `docs/special-house-interface.md`
  - Document the new shared NPC talk boundary where relevant to standby rosters and shared shell wiring.
- `docs/change-log.md`
  - Record the new shared NPC AI dialogue capability and runtime ownership.
- `docs/superpowers/plans/2026-08-25-global-npc-ai-dialogue-plan.md`
  - Keep execution state and verification synchronized.

### New files to create

- `src/domain/npc-ai-dialogue.ts`
  - Shared provider, runtime-memory, transcript, and step contracts for NPC AI talk.
- `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
  - Provider request builder using building context, transcript summary, and memory summary.
- `src/application/npc-interaction/local-placeholder-npc-ai-dialogue-provider.ts`
  - Deterministic placeholder provider for the shared NPC talk seam.
- `src/core/runtime/npc-interaction-runtime.ts`
  - Shared async runtime bridge that owns provider start/cancel/stale-event handling.
- `tests/npc-ai-dialogue-runtime.test.cjs`
  - Shared runtime + memory-log coverage.
- `tests/npc-ai-dialogue-view-contract.test.cjs`
  - Renderer contract coverage for transcript, three choices, custom input, and exit.
- `tests/npc-fallback-house-roster-contract.test.cjs`
  - Fallback house roster trigger coverage.

## Verification Plan

- Targeted verification:
  - `谈话` opens a typed AI dialogue session and starts the provider.
  - The shared runtime ignores stale provider events after close/leave/switch.
  - Completed turns persist entries under the target NPC memory log.
  - The renderer emits transcript, three generated options, custom input, and exit controls.
  - Fallback house rosters emit the shared NPC trigger seam.
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/npc-fallback-house-roster-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## Task 1: Add RED Contracts For Shared NPC AI Runtime And View

**Files:**
- Create: `tests/npc-ai-dialogue-runtime.test.cjs`
- Create: `tests/npc-ai-dialogue-view-contract.test.cjs`
- Create: `tests/npc-fallback-house-roster-contract.test.cjs`
- Modify: `tests/dialogue-button-sound-routing.test.cjs`
- Read: `tests/robustness.test.cjs`

- [x] **Step 1: Write the failing runtime and view contract tests**

Add RED tests that prove:

- the shared NPC AI runtime seam exists,
- default `谈话` opens an AI dialogue session rather than a static placeholder,
- completed turns persist NPC memory entries,
- the renderer emits transcript, exactly three option buttons, custom input, and exit control,
- fallback house rosters now emit `data-npc-target` / `data-npc-context` triggers.

- [x] **Step 2: Run the targeted RED test batch**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/npc-fallback-house-roster-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs
```

Expected:

- `FAIL`
- failures should point at the missing shared runtime seam, missing memory runtime state, and the old static talk renderer.

- [x] **Step 3: Sync the plan after RED**

Update this plan's `Progress Log` and `Execution State` with the failing evidence before production edits begin.

## Task 2: Implement Shared NPC AI Dialogue Runtime, Session State, And Renderer

**Files:**
- Create: `src/domain/npc-ai-dialogue.ts`
- Create: `src/application/npc-interaction/npc-ai-dialogue-request-builder.ts`
- Create: `src/application/npc-interaction/local-placeholder-npc-ai-dialogue-provider.ts`
- Create: `src/core/runtime/npc-interaction-runtime.ts`
- Modify: `src/domain/npc-interaction.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `src/application/npc-interaction/npc-interaction.ts`
- Modify: `src/ui/components/npc-interaction/npc-interaction-menu.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/domain/global-ui.ts`
- Modify: `src/main.ts`

- [x] **Step 1: Implement the minimal shared runtime and session contracts**

Add the new provider, memory-runtime, request-builder, and session-state code with the smallest
changes needed to satisfy the RED runtime tests.

- [x] **Step 2: Replace the static default talk panel with the typed AI dialogue panel**

Render transcript, three generated options, custom input, and exit from the new session data while
preserving the existing menu entry flow.

- [x] **Step 3: Make fallback houses emit NPC interaction triggers**

Ensure non-module house roster actors are also clickable through the shared NPC interaction seam.

- [x] **Step 4: Re-run the targeted test batch**

Run the same commands from Task 1 Step 2.

Expected:

- `PASS`
- the shared NPC AI runtime, renderer, and fallback roster trigger coverage should all turn green.

## Task 3: Sync Docs, Existing Contracts, And Full Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-25-global-npc-ai-dialogue-plan.md`

- [x] **Step 1: Update shared docs**

Record the new shared NPC AI dialogue boundary, runtime ownership, and any shared roster contract
changes that matter to house work.

- [x] **Step 2: Run full targeted verification**

Run:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-dialogue-runtime.test.cjs tests/npc-ai-dialogue-view-contract.test.cjs tests/npc-fallback-house-roster-contract.test.cjs tests/dialogue-button-sound-routing.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

Expected:

- `PASS`
- the feature stays locally verified even if canonical governance remains on another child.

- [x] **Step 3: Record resulting local governance state**

If the implementation is complete and locally verified but not governance-resynced or pushed, set:

- `Execution State.Status` to `completed-but-open`
- `Execution State.Current Focus` to `Implementation finished locally; governance resync and keep-local vs commit/push decision remain open.`
- `Execution State.Next Step` to `Review the verified shared NPC AI dialogue diff, decide whether to keep it local or resync governance, and only commit/push if requested.`

Append the verification results to `Progress Log`.

## Exit Check

- [x] `Any building roster NPC can open the shared AI talk flow through the existing menu.`
- [x] `The dialogue panel renders transcript, three generated options, custom input, and explicit exit.`
- [x] `Completed exchanges persist into the target NPC memory log.`
- [x] `Fallback non-module houses are covered.`
- [x] `The internal AI seam is reserved behind a replaceable provider interface.`
- [x] `No new building-specific business branch lands in src/main.ts.`
- [x] `Shared docs and plan state are synchronized.`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `not closed`
- Parent Task: `Global NPC AI Dialogue`
- Parent Stage: `Shared House NPC Interaction`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the verified local NPC AI dialogue batch, decide whether to keep it local or promote/resync governance, and only then commit/push.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-25-global-npc-ai-dialogue-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm whether this local NPC AI dialogue child should become the active governed item, then review docs/superpowers/plans/2026-08-25-global-npc-ai-dialogue-plan.md.`
