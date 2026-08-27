## Final Review Fix Wave Report

### Status

Completed.

### What Changed

- `src/application/npc-interaction/external-npc-ai-dialogue-provider.ts`
  - Added a shared detector for house follow-up turns that require the hidden intent gate.
  - Made non-OpenAI external modes fail closed for house `select_option` / `custom_input` follow-up turns before any visible generation fetch runs.
  - Preserved the existing OpenAI-compatible route branch and hidden gate behavior.
  - Tightened choice-loop validation so `:house-clarify-response` must include at least one visible `narration` or `dialogue` step before `[CHOICE]`.
- `tests/npc-ai-dialogue-external-provider.test.cjs`
  - Added regressions proving `structured-sse` and `zip-visual-session` house follow-up turns now stop with a fail-closed error before visible generation.
  - Added a regression proving a `clarify` visible response that contains only `[CHOICE]` and `[OPTION]` entries is rejected, repaired, and retried until it includes the NPC follow-up line.

### Covering Tests

- `external NPC AI provider fails closed for non-OpenAI house follow-up turns before visible generation`
- `external NPC AI provider repairs clarify responses that omit the NPC follow-up line`

### Exact Commands

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/npc-ai-house-intent-gate.test.cjs tests/npc-ai-dialogue-external-provider.test.cjs tests/npc-ai-dialogue-runtime.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

### Relevant Output

- `tests 49`
- `pass 49`
- `fail 0`
- Both TypeScript compile steps completed with exit code `0`.

### Deferred

- The Minor route-family coverage addition for `open-house-action`, `switch-target-npc`, `leave-house`, and `negotiate-story-node` remains deferred in this wave. The provider fixes above were sufficient to close the two Important findings without widening scope.
