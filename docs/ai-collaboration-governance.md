# AI Collaboration Governance

This document defines execution-time rules for AI collaborators working in this repository. It is not a style guide or onboarding note. AI must apply these rules while performing tasks, and verification must fail when these boundaries are bypassed.

## Execution Trigger

AI must follow this governance before changing any of these areas:

- scenario packs
- Script Editor import, export, authoring data, runtime preview, or builtin templates
- events, event-bindings, event routing, and authored route actions
- building arrangements, containers, city entries, location access, or building behavior
- navigation, scene transition, city-to-building routing, or return routing
- playable, minigame, QTE, story-battle creation or modification
- playable launch, action, exit, settlement, owner return, handoff, or runtime session behavior
- scenario-specific UI labels, controls, panels, route behavior, or code behavior
- shipped assets or resources such as portraits, backgrounds, audio, sprites, spine assets, scene assets, and playable assets

If a task touches a house-hosted playable, AI must also apply playable governance before design or implementation.

## Default-To-Scenario-Pack Rule

Unless the user explicitly asks to modify the mod framework, Script Editor capability, shared runtime, shared UI renderer, or shared playable contract, AI must treat the work as scenario-pack authoring.

Examples that must default to JSON/data authoring:

- adding a building
- adding a dialogue
- adding an event or event binding
- adding a building menu, action, or container
- adding a city entry or location access rule
- adding NPC placement
- adding text or content
- adding a minigame entry point
- adding scenario-specific UI labels or route behavior
- adding scenario-owned assets or resource references

AI must not implement these as scenario-specific branches in application code. If current JSON/data contracts cannot express the request, AI must stop and identify the missing shared mechanism before changing code.

## Scenario Pack Mirror Rule

When modifying a built-in scenario pack, AI must update the corresponding Script Editor builtin template in the same change.

Runtime scenario pack:

- `src/content/scenario-packs/<pack-id>/...`

Script Editor builtin template:

- `src/modules/script-editor/builtin-templates/<pack-id>/...`

This applies to JSON data that Script Editor can load, preview, import, or export, including:

- events
- event-bindings
- dialogues
- buildings
- building arrangements
- city entries
- playable shells and playable integrations
- text entries
- location access
- scenario startup/profile data
- resource manifests and scenario-owned resource references

AI must not update only one side unless the task explicitly targets only runtime content or only editor-template content. The reason must be recorded in the response and, when the repository changes, in the relevant change log or governance record.

## Unified Event Route Rule

All authored navigation must route through an event action `navigate` -> `navigation-runtime`.

Allowed authored navigation forms include:

- `navigate -> city`
- `navigate -> building`
- `navigate -> leaveBuilding`
- `navigate -> map`

AI must not reintroduce retired routing actions such as `closeBuilding` or `launchFlow`. AI must not make event binding, dialogue, playable, or story runtimes directly write navigation state such as `currentView`, `currentHouseId`, or `houseSession`.

Navigation-runtime must remain independent from event, dialogue, playable, and story systems. Events express where to go; navigation-runtime performs the state transition.

## Playable / Minigame Governance

All minigame-like mechanics are governed as `playable`.

AI must:

- use the existing playable governance skill before adding, modifying, integrating, or reviewing minigames, QTEs, story-battles, or playable runtime paths
- treat playable work as shared mechanism work by default
- route launch, action, exit, settlement, owner return, and handoff through shared playable runtime contracts
- keep house-hosted playables on Script Editor-authored event or playable-flow paths
- keep persistent gameplay effects on unified state, settlement, task, or progression structures

AI must not:

- add playable-specific business branches in `src/main.ts`
- let house-local code privately own playable lifecycle
- encode host identity or scenario identity into `playableId`
- bypass shared registries, shells, runtime requests, settlement, or owner return contracts

## Asset / Resource Governance

When adding or changing assets, AI must treat assets as scenario-pack or shared-runtime resources, not as hardcoded application paths.

AI must:

- use stable resource ids in JSON/manifests; AI must use stable resource ids for shipped asset references
- avoid local absolute paths such as `C:\...`, `D:\...`, temporary directories, or external download locations
- update runtime scenario pack and Script Editor builtin template together
- update import, export, materializer, loader, and preview paths when the editor must preserve the asset
- verify referenced files exist
- verify no dangling references remain after moving or deleting assets
- route minigame assets through playable shell, playable integration, or resource manifest contracts

AI must not:

- hardcode scenario-specific asset paths in `src/main.ts` or shared renderers; AI must not hardcode scenario-specific asset paths
- add assets that only runtime can see but Script Editor cannot preserve
- reference external temporary files as shipped content
- scatter direct resource paths through code when a stable resource id or manifest entry can represent the asset

## Schema / Contract Version Rule

Any new JSON field, resource manifest field, playable field, event action shape, runtime request shape, or authored-data family is a schema or contract decision unless proven otherwise.

When a schema or contract changes, AI must identify whether the change is:

- scenario-pack content only
- Script Editor authoring/export/import contract
- shared runtime contract
- shared playable contract
- resource manifest contract

If it is a contract change, AI must update the relevant loader, validator, materializer, import/export path, runtime preview path, builtin template, and focused tests. AI must not let runtime quietly accept a field that Script Editor cannot preserve.

## ID Stability Rule

New buildings, events, event bindings, dialogues, playables, integrations, cities, characters, resources, and authored containers must use stable semantic ids.

AI must not use temporary IDs, UI labels, array indexes, timestamps, random suffixes, or local file names as durable ids. If an id changes, AI must update all references and verify no dangling references remain.

## Deletion / Migration Rule

Deleting scenario-pack data, resources, fields, playables, events, dialogues, buildings, or editor-facing contracts requires a reference audit first.

AI must check:

- runtime scenario pack references
- Script Editor builtin template references
- import/export preservation
- runtime preview loading
- playable/runtime settlement references
- asset/resource manifest references

If deleted data may appear in existing authored packs, AI must choose an explicit fail-closed error, a migration script, or a documented compatibility boundary. AI must not only delete files while leaving references unresolved.

## Runtime Preview Acceptance Rule

Changes involving Script Editor, scenario packs, resources, playables, navigation, building behavior, or authored UI must include runtime preview evidence when practical.

If runtime preview is not run, AI must state why static guard coverage is sufficient for that change. Static schema checks do not automatically prove the Script Editor "use template -> run preview" path works.

## Round-Trip Rule

Scenario-pack data must preserve the full authoring loop:

`runtime pack -> Script Editor import -> export -> runtime preview`

AI must not optimize only for the source JSON running in game. If an authored pack cannot survive import/export and still run in preview, the change is incomplete unless the task explicitly limits scope to a non-editor runtime-only experiment.

## Reference Integrity Rule

All id references introduced or changed by AI must resolve inside the active content graph or through an explicit shared/base-pack contract.

References include:

- eventId
- dialogueId
- bindingId
- buildingId
- cityId
- characterId
- playableId
- integrationId
- flowId
- settlementId
- taskId
- resourceId

AI must not rely on runtime fallback to hide missing references.

## Ownership Rule

Every behavior or state change must have one clear owner:

- scenario content owner: scenario pack JSON
- editor authoring owner: Script Editor data/import/export
- navigation owner: navigation-runtime
- playable lifecycle owner: playable runtime
- persistent gameplay effects owner: settlement/effect/task/progression state
- resource owner: scenario/shared resource manifest
- render-facing presentation owner: shared UI renderer or playable shell presenter

AI must not move ownership into a convenient local component. UI components must not own playable lifecycle, event bindings must not own navigation mutation, and building hosts must not own persistent playable state.

## No Silent Duplication Rule

AI must not silently duplicate an existing building, event, playable, UI flow, runtime mechanism, or resource-loading path to bypass a constraint.

If the requested behavior resembles an existing mechanism, AI must reuse, parameterize, or extend the shared mechanism. If duplication is unavoidable, AI must state why and add guard coverage so the duplicate does not become a hidden alternate architecture.

AI must not silently duplicate owned mechanisms; AI must not silently duplicate scenario-specific logic as a shortcut.

## Acceptance Evidence Rule

For any task that triggers this governance, the final response must state:

- whether the change was scenario-pack data, shared mechanism, editor capability, or resource work
- whether the runtime scenario pack and Script Editor builtin template were both updated, or why only one side changed
- whether import/export/runtime preview paths were affected
- whether playable governance applied
- what guard or runtime preview verification ran
- what was not verified

The final response must state this evidence instead of only saying that tests passed.

## Localization / Text Rule

Scenario-specific text, labels, dialogue lines, menu labels, hints, and UI copy must default to text entries, dialogue JSON, or other authored data.

AI must not hardcode scenario text in shared UI/render/runtime code unless implementing a reusable generic label with no scenario ownership.

## Ordering / Determinism Rule

Generated or edited JSON must use stable ordering where the repository has an existing pattern.

AI must avoid nondeterministic object key order, random array order, timestamp churn, and formatter-only rewrites. Stable ordering reduces collaboration conflicts and keeps scenario-pack diffs reviewable.

## Backward Compatibility Policy Rule

The default compatibility policy is fail-closed, not silent rescue.

If the user explicitly asks to support old packs, AI must define the compatibility boundary, migration path, version gate, and tests. AI must not add hidden compatibility fallbacks that reconstruct retired behavior.

## Asset Size / Format Rule

New shipped assets must use repository-appropriate formats, names, directories, and sizes.

AI must consider package size, browser loading behavior, runtime preview loading, and editor preservation before adding assets. Large or unusual assets need an explicit reason and, when practical, a lighter preview-safe form.

## Security / External Resource Rule

AI must not load remote scripts or uncontrolled external resources from scenario packs by default.

External assets must be imported into project or pack-owned resources and referenced through manifests. Remote URLs require an explicit shared policy and validation boundary.

AI must not load remote scripts through authored content.

## No Hidden Base-Pack Dependency Rule

Scenario packs must not implicitly depend on private data from another pack.

If inheritance is required, it must flow through explicit `basePackId`, manifest, loader, or shared contract rules. AI must not add runtime logic that says, in effect, "if this field is missing, look in the Zhu Yuanzhang pack" or another private pack.

## No Scenario Branch Rule

AI must not add concrete scenario id, building id, event id, character id, playable id, or asset path business branches to `src/main.ts` or shared runtime code.

If scenario-specific behavior is required, encode the scenario-specific part in data/content and keep the flow skeleton reusable. If a new capability is missing, implement the shared mechanism first, then let scenario data configure it.

## Export / Import / Preview Symmetry

When a data contract changes, AI must update every relevant part of the chain:

- scenario pack data
- Script Editor builtin template
- Script Editor import
- Script Editor export
- Script Editor runtime preview
- runtime loaders/materializers
- startup/default content assembly
- focused tests

AI must not make runtime accept a field that Script Editor cannot preserve, and must not make Script Editor export a field that runtime preview cannot execute.

## Fail-Closed Rule

Retired fields, illegal actions, malformed route targets, unknown runtime families, and unsupported compatibility shapes must fail closed at import, export, validation, or runtime intake.

AI must not silently rescue unsupported data into old behavior or compatibility branches unless the user explicitly asks for a temporary prototype-only exception and the response records the risk.

## Persistent State Rule

Scenario packs, building behavior, assets, and playables must not store persistent gameplay state in ad hoc top-level globals.

Persistent gameplay changes must flow through unified game state, settlement, effect, task, progression, or other shared runtime structures. Building-session initialization must not overwrite player base stats, money, skills, inventory, or other persistent player data outside those structures.

## Verification Rule

Any change that triggers this governance must include or update focused guard coverage when practical.

Minimum guard targets include:

- no retired route actions in shipped scenario/template data
- scenario-pack and builtin-template mirror coverage for affected files
- navigation-runtime independence from event/dialogue/playable/story systems
- no concrete scenario/building/playable business branches in `src/main.ts`
- playable lifecycle does not bypass shared playable runtime
- asset/resource references are portable and editor-preservable
- import/export/preview symmetry for changed data contracts

Run `npm run lint:ai-collaboration-governance` after editing these governance rules or the focused guard itself.
