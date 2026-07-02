# Mod-First Weekly Module Map

**Week Of:** `2026-07-02`

## Purpose

This file is the readable module map for the fresh mod-first continuation set.

If a module cannot be summarized here, it is still acting like a black box.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/application/content/active-game-content.ts` | `official` | Assemble active content into runtime-facing lookup tables. | base pack, override pack | lookup maps and normalized content tables | content-pack definitions | `src/main.ts`, runtime consumers | Still the main active content assembly line; Child 17 did not redesign its merge semantics. |
| `src/application/content/default-runtime-content.ts` | `provisional` | Provide builtin runtime content defaults during startup and fallback content reads. | base game content pack | default cities, houses, npc pools, text entries | `src/content/base-game-content-pack.ts` | `src/main.ts`, house/content consumers | No longer the direct-import hotspot for Child 17, but still keeps builtin startup assumptions that later Child 18 may revisit. |
| `src/content/pack-content-access.ts` | `adapter` | Centralize builtin default pack-owned story, house-content, activities, and text imports behind one shared seam. | default zhuyuanzhang pack tables | normalized default pack payloads | `src/content/scenario-packs/zhuyuanzhang/**` | `src/content/story/index.ts`, `src/content/houses/*.ts`, application content adapters | Landed by Child 17 so covered consumers no longer import scenario-pack files directly. |
| `src/content/story/index.ts` | `adapter` | Export story events, scenes, and text for current runtime consumers. | shared default pack-content seam | story definitions and text lookup | `src/content/pack-content-access.ts` | story consumers | No longer a direct scenario-pack coupling hotspot after Child 17. |
| `src/content/houses/*.ts` | `adapter` | Provide house-content adapters for current house modules. | shared default pack-content seam | house-content objects | `src/content/pack-content-access.ts` | house modules | Covered adapters no longer import scenario-pack files directly after Child 17. |
| `src/application/house-modules/house-module-registry.ts` | `provisional` | Bind builtin house module ids to application implementations. | builtin module imports | static house module registry | house module implementations | application/core house runtime | Stable enough for builtin use, not yet mod-facing. |
| `src/core/runtime/task-runtime.ts` | `official` | Own minimum task lifecycle, action, signal, and task result seams. | task definitions, task actions, task signals | task runtime results | `src/core/contracts/task-runtime.ts` | future mod/runtime producers | Already landed as a first slice; later Child 19 work will make it mod-facing. |
| `src/core/mods/mod-runtime.ts` | `official` | Own formal mod activation and selected-mod runtime state. | builtin/file/url/loaded mod requests | atomic activation result | mod source loader, dependency/capability guards | `src/main.ts`, save restore path | Strong enough for activation, not yet a unified gameplay contribution installer. |
| `src/core/runtime/house-runtime.ts` | `official` | Own covered house enter/dispatch/leave lifecycle and runtime follow-up seam. | house runtime requests, active app/runtime state | house-session updates and settled runtime state | house registry, runtime settlement | `src/main.ts` | Not the first blocker, but still builtin-registry oriented and later Child 20 work will widen registration. |
| `src/core/registry/content-registry.ts` | `legacy` | Placeholder registry seam for content installation. | registry typing only | placeholder type alias | none | later mod/runtime registry work | Still too weak for unified gameplay contribution installation. |
| `src/main.ts` | `legacy` | Browser-shell assembly, activation/startup wiring, render orchestration, and remaining mixed runtime glue. | DOM events, activation output, runtime outputs, presenter input | runtime requests, render calls, save/load actions | content loaders, runtime seams, presenter, adapters | browser UI | Child 15/16 removed covered runtime stitching, but `main.ts` still dominates startup and content wiring. |

## Status Legend

- `official`
  - stable intended module boundary
- `adapter`
  - transition-only compatibility seam
- `provisional`
  - likely to change after more integration
- `legacy`
  - old module not yet migrated into the current boundary

## Questions Raised This Week

- How far should the shared pack-content access seam remain builtin-default only before later work promotes it into a true active-pack selector?
- How much builtin startup coupling can remain in `default-runtime-content.ts` before Child 18 needs to treat it as runtime-spine debt?
- When Child 20 arrives, should house registration live under `src/core/registry/*` or remain a wrapped application registry with a promoted shared contract?
