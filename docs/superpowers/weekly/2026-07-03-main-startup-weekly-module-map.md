# Main Startup Weekly Module Map

**Week Of:** `2026-07-03`

## Purpose

This file maps the modules relevant to the fresh startup-family extraction set.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `legacy` | Browser shell, loading screen, render orchestration, and current startup-family entry ownership. | DOM events, `MainUiFlow`, activation results | render calls, runtime requests, session startup effects | content loaders, mod runtime, presenter, runtime seams | browser UI | Child 23 targets only its startup-family orchestration residue. |
| `src/application/startup/startup-session-coordinator.ts` | `planned` | Own startup / continue / restore / scenario import orchestration after extraction. | startup-family requests, save data, activation helpers | narrow bootstrap result for `main.ts` | mod runtime, startup-bound bootstrap helpers | `src/main.ts` | This is the intended new seam for Child 23. |
| `src/core/mods/mod-runtime.ts` | `official` | Own formal mod activation for builtin/imported/restored sources. | builtin/file/url activation requests | activation result | source loaders, manifest validation | `src/main.ts`, planned startup coordinator | Child 23 consumes this seam and must not redesign it. |
| `src/application/content/active-game-content.ts` | `official` | Assemble active content into runtime-facing lookup tables. | base pack, override pack | active lookup tables | content pack definitions | `src/main.ts`, planned startup coordinator | Child 23 may consume existing helpers but should not redesign merge semantics. |
| `src/ui/main-ui/main-ui-flow.js` | `official` | Surface main-menu start / continue / scenario import actions. | UI actions, save data loader callback | shell callbacks | browser UI | `src/main.ts` | Child 23 must consume the current contract rather than redesign it. |

## Questions Raised This Week

- Can startup-family routing move out of `main.ts` without forcing any `MainUiFlow` contract redesign?
- Can Child 23 consume existing bootstrap helpers without reopening render orchestration?
- Does the startup-family extraction need one coordinator file or a coordinator plus a small contract file?
