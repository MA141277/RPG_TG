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
| `src/core/registry/house-module-registry.ts` | `official` | Own the shared house registration seam for builtin and later mod-owned module/renderer contributions. | house module registrations, house renderer registrations | module lookup, renderer lookup, builtin fallback registry | builtin house module/render registrations | house runtime, presenter, house view registry | Landed by Child 20 to converge module and renderer lookup through one shared seam. |
| `src/application/house-modules/house-module-registry.ts` | `adapter` | Provide a backward-compatible builtin wrapper over the shared house registration seam. | builtin fallback registry | builtin module lookup helper | `src/core/registry/house-module-registry.ts` | legacy house-runtime consumers, tests | Child 20 reduced this file from the owner of a static table to a wrapper over the core seam. |
| `src/core/runtime/task-runtime.ts` | `official` | Own minimum task lifecycle, action, signal, and task result seams. | task definitions, task actions, task signals | task runtime results | `src/core/contracts/task-runtime.ts` | future mod/runtime producers | Already landed as a first slice; later Child 19 work will make it mod-facing. |
| `src/core/contracts/gameplay-contribution.ts` | `official` | Define one shared declaration/installed-registry contract for gameplay contributions. | manifest contribution declarations, activated-mod registry needs | typed gameplay contribution families | none | mod manifest/runtime contracts, tests | Landed by Child 21 to keep navigation/event/scene/task/house contribution language on one contract family. |
| `src/core/mods/mod-runtime.ts` | `official` | Own formal mod activation, selected-mod runtime state, and installed gameplay contribution registry output. | builtin/file/url/loaded mod requests | atomic activation result plus installed contribution registry | mod source loader, dependency/capability guards, contribution contract | `src/main.ts`, save restore path | Child 21 added contribution install/validation without absorbing runtime play ownership. |
| `src/core/runtime/house-runtime.ts` | `official` | Own covered house enter/dispatch/leave lifecycle and runtime follow-up seam. | house runtime requests, active app/runtime state | house-session updates and settled runtime state | shared house registration seam, runtime settlement | `src/main.ts` | Child 20 removed direct dependence on the builtin application registry. |
| `src/core/registry/content-registry.ts` | `provisional` | Provide stable pack-level registry typing for engine/bootstrap inputs. | installed content-pack registry | typed content pack lookup | `src/domain/content-pack.ts` | engine/bootstrap context | Child 21 removed the old `Record<string, unknown>` placeholder typing, but end-to-end parity still depends on Child 22. |
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
- After Child 21, which builtin/imported/save-restore shortcuts still bypass the new activation-installed gameplay contribution registry?
