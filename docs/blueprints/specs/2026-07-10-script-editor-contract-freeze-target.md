# Script Editor Contract Freeze Target

## Control Block

- version_id: `target.script-editor-contract-freeze`
- version_label: `script-editor-contract-freeze`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Freeze the version-level design boundary for a creator-facing script editor without committing this version to full editor implementation.`

### Scope

- `freeze the editor-native authoring contract for creator-facing scenario authoring`
- `freeze the authoring -> runtime mapping contract that compiles editor objects into runtime-facing pack data`
- `freeze the compatibility / import-export policy for existing scenario-pack adoption, editor project persistence, and runtime-facing export`
- `freeze one shared condition / effect mechanism boundary reusable across event, task, dialogue, menu, and minigame authoring`
- `identify and bound the minimum runtime contract changes required for editor landing`

### Version Deliverables

- `editor-native authoring contract package`
  - `a frozen core object set covering story_pack / person / city / building / event / quest / dialogue / minigame / story_node / text_entry / condition_group / effect_bundle`
  - `per-object responsibility boundaries`
  - `editor-only metadata rules`
  - `creator-facing naming decisions such as person owning both playable-role and NPC authoring unless a later written decision says otherwise`
- `authoring -> runtime mapping contract package`
  - `runtime export destination for each authoring object`
  - `direct-export field list`
  - `editor-project-only field list`
  - `compatibility-shim rules`
  - `one object-level mapping matrix`
  - `explicit split between mapping solved in export and mapping that requires shared-contract upgrade`
- `compatibility / import-export policy package`
  - `whether import existing pack -> edit -> export compatible pack is mandatory`
  - `legacy scenario-pack import policy`
  - `editor project persistence shape`
  - `runtime-facing export artifact policy`
  - `rule that authoring-only metadata must not leak into runtime pack output`
  - `decision on compatibility importer vs migration vs both with explicit precedence`
- `shared condition / effect mechanism package`
  - `one shared condition expression model`
  - `one shared effect expression model`
  - `reuse rules across event / task / dialogue / menu / minigame`
  - `shared primitive boundary`
  - `host-specific adapter allowance boundary`
  - `explicit prohibition on per-domain feature-local rule dialects`
- `minimum runtime contract change list`
  - `the runtime/schema changes actually required for editor landing`
  - `required / optional / out-of-scope classification for each change`
  - `additive-extension vs runtime-behavior-gap labeling`
  - `explicit list of runtime modernization work that this version must not absorb`
- `gap classification matrix`
  - `per-mismatch classification into Class A authoring-only difference, Class B additive pack/runtime extension, or Class C runtime behavior gap`
  - `rule that no new runtime table, field, loader, or consumer rewrite is justified before classification is written`
- `version-governance output`
  - `the version plan must continue to show no live candidate, no active queue, and no queue doc until fresh evidence writes a formal queue-candidate admission review`
  - `future bounded freeze queues must be created only through Blueprint-standard item.xxx + review_subject_id + review_subject_classification = queue-candidate + proposed_queue_id + review_basis + admission_status truth`
  - `the version must remain design-governed and must not silently widen into implementation-governed editor delivery`

### Must Freeze

- `editor-native authoring contract`
  - `freeze the named core object set, object responsibilities, ownership boundaries, editor-only metadata rules, and creator-facing naming decisions`
- `authoring -> runtime mapping contract`
  - `freeze runtime export destinations, direct-export fields, editor-only fields, compatibility shims, and one object-level mapping matrix`
- `compatibility / import-export policy`
  - `freeze existing pack import policy, editor project persistence policy, runtime-facing export policy, and whether compatibility round-trip is mandatory`
- `shared condition / effect mechanism`
  - `freeze one reusable condition/effect contract family shared by event, task, dialogue, menu, and minigame authoring instead of feature-local rule formats`
- `minimum runtime contract changes`
  - `freeze the minimum required runtime/schema delta for editor landing, including required/optional/out-of-scope separation and an explicit ban on opportunistic runtime modernization`

### Frozen Authoring Core Object Set

- `The first bounded authoring-contract freeze covers exactly these top-level creator-facing objects: story_pack / person / city / building / event / quest / dialogue / minigame / story_node / text_entry / condition_group / effect_bundle.`
- `city_menu_item` and `building_menu_item` are not part of this first frozen core set; they remain downstream structure choices tied to later host-schema and mapping decisions.`
- `scene` is not a separate frozen editor-native top-level object in this queue; the authoring-side progression owner is story_node, while runtime scene/table form remains downstream to mapping decisions.`
- `The frozen core set must be treated as creator-facing semantics first, not as a mirror of today's runtime split tables.`

### Frozen Object Responsibility Boundaries

| Object | Frozen Responsibility Boundary | Must Not Absorb In This Queue |
| --- | --- | --- |
| `story_pack` | `Owns editor-project identity, opening setup ownership, authoring-wide registries, and cross-object composition boundaries for one authored scenario project.` | `Runtime export table layout, compatibility importer policy, or pack file split implementation.` |
| `person` | `Owns one creator-facing character authoring surface for both playable-role and NPC configuration, including profile, role mode, availability, tags, relation references, and bindings to authored content by stable ids.` | `A split playable-vs-NPC top-level object model or runtime-only character table accidents.` |
| `city` | `Owns city metadata, city-level function toggles, local building roster references, and city-host authoring references.` | `Detailed runtime menu serialization or house-level local service behavior.` |
| `building` | `Owns one creator-facing place/service node under a city or broader world scope, including local open conditions, host bindings, and attached authored content references.` | `Runtime house table shape or city/building menu export policy.` |
| `event` | `Owns a triggerable authored progression unit, including entry conditions, follow-up references, and effect references through shared authoring objects.` | `A domain-local rule dialect or runtime event executor behavior.` |
| `quest` | `Owns authored objective lifecycle, including trigger references, completion references, failure or timeout references, and reward/effect references.` | `Runtime task table shape, settlement implementation, or compatibility importer behavior.` |
| `dialogue` | `Owns conversation structure, speaker participation, branch topology, and text_entry references as one creator-facing conversation object.` | `Runtime scene-vs-dialogue table split decisions or inline runtime text duplication rules.` |
| `minigame` | `Owns authored playable entry, availability, host attachment, and settlement reference boundaries as one reusable creator-facing playable object.` | `The full minigame rule grammar or shared condition/effect primitive contract.` |
| `story_node` | `Owns high-level authored progression graph routing, prerequisite gates, and references to event/dialogue/quest/minigame/menu entry surfaces.` | `Runtime scene storage layout or low-level callback orchestration.` |
| `text_entry` | `Owns display text and stable copy identifiers only.` | `Gameplay state, branching logic, or editor-only note storage.` |
| `condition_group` | `Owns reusable authoring-level boolean gating references shared across multiple object families.` | `The final shared condition expression grammar or runtime primitive evaluation model.` |
| `effect_bundle` | `Owns reusable authoring-level outcome/effect references shared across multiple object families.` | `The final shared effect expression grammar or runtime mutation implementation details.` |

### Frozen Creator-Facing Naming Decisions

- `person` remains the single top-level creator-facing object for both playable-role and NPC authoring; the repository must not split them into separate first-class editor object families unless a later written decision explicitly reopens that boundary.
- `building` remains the creator-facing authoring term even if v1 compatibility export later targets runtime `houses` data.
- `story_node` is the creator-facing authored progression node for this queue; runtime scene/table layout remains a later mapping concern.
- `dialogue` remains a distinct creator-facing authoring object even though its eventual runtime export form is still deferred.
- `condition_group` and `effect_bundle` are frozen as shared cross-domain authoring objects, not as per-feature local fragments.

### Frozen Editor-Only Metadata Rules

- `Author notes, draft status, grouping hints, review markers, unresolved import notes, sort/display order hints, and other editor workflow metadata may exist in the editor project only.`
- `Editor-only metadata must never be required by runtime consumers, loaders, validators, or runtime-facing pack output.`
- `Stable authored references must use object ids, not visible labels, notes, or UI-only grouping text.`
- `Display copy belongs in text_entry or later dedicated text/asset surfaces, not in editor-only metadata fields.`
- `This queue freezes the metadata boundary only; concrete editor-project persistence shape remains downstream to compatibility / import-export policy work.`

### Frozen Mapping Contract Principles

- `The mapping contract freezes authoring-to-runtime destination families against the current runtime-facing pack surface first: pack.json, scenario-profile.json, characters.json, cities.json, houses.json, events.json, scenes.json, text-entries.json, activities.json, tasks.json, and the already-supported auxiliary mapping files exposed through ContentPackDefinition and scenario-pack loader truth.`
- `This queue freezes destination names, direct-export boundaries, editor-project-only boundaries, and required compile-step boundaries; it does not itself decide compatibility round-trip policy, importer precedence, or minimum runtime delta landing.`
- `Where the current runtime already has a canonical destination family, prefer compiling into that family instead of inventing a new runtime table in the mapping queue.`
- `Candidate additive runtime tables such as dialogues.json, minigames.json, story-nodes.json, city-menu-items.json, and house-menu-items.json remain downstream options only if the mapping matrix proves current destinations cannot carry the frozen authoring semantics cleanly.`
- `Shared authoring objects such as condition_group and effect_bundle may be routed through host exports, but their canonical runtime expression grammar remains downstream to the shared-condition-effect-mechanism queue.`

### Frozen Object-Level Mapping Matrix

| Authoring Object | Frozen Runtime Export Destination | Direct-Export Boundary | Editor-Project-Only Boundary | Compatibility / Downstream Notes |
| --- | --- | --- | --- | --- |
| `story_pack` | `pack.json` + `scenario-profile.json` + `pack.json.files` registry | `Pack id/title/description, opening scenarioProfile fields, and the registry of emitted split tables belong to runtime-facing export.` | `Workspace grouping, review state, author notes, unresolved import markers, and export-draft metadata stay editor-project-only.` | `The exact editor-project persistence shape and import/export round-trip rules stay downstream to compatibility policy freeze.` |
| `person` | `characters.json` with optional historical mapping support through already-supported historical character files when the authored pack uses them | `Stable character id, role mode, profile fields, authored relations by id, availability, and runtime-facing bindings to scenes/events/tasks/minigames export directly through the character surface.` | `Author notes, grouping tags, draft checkpoints, portrait review hints, and editor-only organization fields stay out of runtime export.` | `Any richer reusable rule grammar for conditions/effects or a reopened person split belongs downstream; historical compatibility precedence stays with compatibility policy.` |
| `city` | `cities.json` | `Stable city id, display metadata, map linkage, building roster refs, city-level function toggles, and runtime-facing host references export directly.` | `Author annotations, sorting/grouping aids, review status, and map-layout editing metadata stay editor-project-only.` | `City-menu materialization and broader import/export compatibility rules stay downstream.` |
| `building` | `houses.json` | `Stable building id, city/world linkage, house module id, open gates expressible through current runtime-facing refs, and attached authored content refs export directly.` | `Author notes, editor grouping, design placeholders, and local workflow metadata stay editor-project-only.` | `city_menu_item / building_menu_item materialization and any new host-schema tables remain downstream until later queues justify them.` |
| `event` | `events.json` | `Stable event id, trigger identity, follow-up refs, host bindings, and runtime-facing condition/effect references that can be carried without inventing a new rule dialect export through the event surface.` | `Draft markers, explanation text, internal review notes, and editor-only categorization stay editor-project-only.` | `Canonical condition/effect grammar and executor semantics stay downstream to shared-rule freeze.` |
| `quest` | `tasks.json` as the frozen runtime-facing task destination when authored objective lifecycle must survive export | `Stable task id, trigger refs, objective lifecycle fields, completion/failure routing refs, and reward/effect refs that fit the existing task runtime contract export through the task surface.` | `Authoring checklist state, internal design commentary, and editor-only pacing notes stay out of runtime export.` | `Compatibility expectations for packs without tasks.json and any missing runtime task fields stay downstream to compatibility and runtime-delta queues.` |
| `dialogue` | `scenes.json` plus `text-entries.json` as the default current-runtime mapping | `Branch topology, speaker refs, action ordering, text ids, and next-step refs already representable by the current scene runtime export through scenes + text entries.` | `Outline grouping, conversation review markers, staging notes, and editor-only drafting metadata stay editor-project-only.` | `A separate runtime dialogue table is not frozen here; dialogues.json remains a downstream additive option only if later queues prove scenes.json is insufficient.` |
| `minigame` | `activities.json` for launch anchors and host-facing playable entry data that can compile into the current runtime/playable seams | `Stable minigame id, availability refs, host attachment refs, entry hooks, and settlement references that can already compile into current activity/playable entry points export through the activity-facing surface.` | `Tuning notes, author presets, debug seeds, and editor-only design scaffolding stay editor-project-only.` | `A dedicated minigames.json table, expanded playable grammar, or broader playable runtime changes remain downstream to playable governance plus runtime-delta review.` |
| `story_node` | `scenes.json` as the default current-runtime progression container | `Stable node id, entry/next refs, branching topology, and links to event/dialogue/minigame/task surfaces export through compiled scene flow.` | `Canvas layout, graph grouping, review flags, and authoring-only navigation helpers stay editor-project-only.` | `story-nodes.json remains a downstream additive option only if later runtime-delta review proves explicit node records are required.` |
| `text_entry` | `text-entries.json` | `Stable text id and display copy export directly.` | `Copy review comments, author notes, localization workflow hints, and editor-only grouping stay out of runtime export.` | `Localization pipeline or richer asset/text systems remain downstream.` |
| `condition_group` | `No standalone runtime table is frozen in this queue; export stays as host-level references or compile-time expansion points only.` | `Only stable ids and host attachment references may cross the mapping boundary at this stage.` | `Author labels, notes, grouping, and incomplete-rule metadata stay editor-project-only.` | `The canonical condition expression grammar and any shared runtime primitive surface stay downstream to queue.shared-condition-effect-mechanism-freeze.` |
| `effect_bundle` | `No standalone runtime table is frozen in this queue; export stays as host-level references or compile-time expansion points only.` | `Only stable ids and host attachment references may cross the mapping boundary at this stage.` | `Author labels, notes, grouping, and incomplete-rule metadata stay editor-project-only.` | `The canonical effect expression grammar and runtime mutation surface stay downstream to queue.shared-condition-effect-mechanism-freeze.` |

### Frozen Mapping Boundary Rules

- `Direct-export fields are limited to fields that runtime consumers, validators, loaders, or emitted runtime pack files can actually own; author workflow metadata must stay editor-project-only even when it is convenient to serialize.`
- `dialogue` and `story_node` currently compile into the scene/text-entry family by default because today's runtime and documented pack shape already center on scenes.json plus text-entries.json for flow and text delivery.`
- `quest` is frozen onto the tasks surface because ContentPackDefinition and scenario-pack loader truth already expose tasks as a runtime-facing family even though the older scenario-pack format doc has not fully caught up.`
- `minigame` is frozen onto current activity/playable entry seams only as far as current runtime-facing launch anchors can carry it; new runtime playable tables or grammar are not admitted by this queue.`
- `condition_group` and `effect_bundle` are explicitly prevented from inventing queue-local runtime mini-formats; they may only cross this queue as stable references pending the later shared rule contract.`

### Frozen Compatibility And Import-Export Direction

- `The v1 direction is compatibility-first rather than replacement-first.`
- `The required creator loop is import existing pack -> edit in authoring model -> validate -> export compatible runtime pack -> verify in game.`
- `Existing scenario packs must be importable into the editor through a compatibility importer; authoring work must not require destructive in-place migration as the only legal entry path.`
- `The first runtime-facing export target remains the current manifest-driven runtime pack family where possible: one pack.json entry plus stable split-table keys already recognized by docs/scenario-pack-unified-format.md, ContentPackDefinition, and scenario-pack loader truth.`
- `The editor project may be richer than the runtime pack, but that richer authoring surface must compile back into the frozen runtime-facing export policy without leaking editor-only metadata.`

### Frozen Editor-Project Persistence Policy

- `The editor project persists as one authoring project manifest plus referenced split authoring tables, not as one monolithic opaque blob and not as a direct mirror of today's runtime pack tables.`
- `The project manifest owns project identity, authoring-wide settings, and the registry of authoring-side split tables in the same general shape as pack.json owns runtime-facing split-table discovery.`
- `Authoring-side split tables may carry richer creator metadata, draft state, grouping, review markers, and unresolved import annotations than runtime export is allowed to carry.`
- `The editor project remains the canonical home for authoring-only metadata, unresolved import residue, and richer creator workflow structure even when export compiles the gameplay subset into current runtime-facing tables.`

### Frozen Runtime-Facing Export Artifact Policy

- `The first required export artifact is a manifest-driven runtime-compatible scenario pack rooted at pack.json with stable file keys and current canonical split-table families.`
- `Export may omit authoring-only metadata, draft markers, review comments, and unresolved import notes even when those fields exist in the editor project.`
- `When the mapping contract already targets a current runtime family, export should compile into that family rather than invent a replacement table by convenience.`
- `Candidate additive export families such as dialogues.json, minigames.json, story-nodes.json, city-menu-items.json, and house-menu-items.json remain downstream options only after later runtime-delta and compatibility evidence proves they are necessary.`
- `Runtime-facing export remains the game-consumable artifact; the richer editor project is not itself the runtime pack.`

### Frozen Importer Precedence And Metadata Non-Leak Rules

- `Compatibility importer precedence is frozen as importer-first: existing runtime-facing packs must be interpreted into the authoring model through a compatibility importer before editing, rather than requiring immediate source-file migration in place.`
- `Optional later migration utilities may exist, but they are subordinate to the compatibility importer contract and must not replace it as the only legal v1 path.`
- `Authoring-only metadata such as notes, draft state, grouping, review markers, unresolved import annotations, and editor workflow hints must not leak into runtime-facing pack output by default.`
- `Runtime-facing export may preserve only gameplay-relevant fields, stable ids, and runtime-consumable references that the frozen mapping contract explicitly allows.`
- `If a field exists only to support creator workflow, audit, or unresolved import recovery, it belongs in the editor project and not in runtime pack output.`

### Frozen Shared Condition Expression Model

- `condition_group` is frozen as the single reusable creator-facing condition container shared across event, task, dialogue/scene, menu, and minigame authoring.`
- `The shared condition core must support boolean grouping through all / any / not composition rather than forcing each host to reinvent grouping semantics.`
- `The shared primitive family is frozen around current reusable repository evidence: flag/value checks, variable comparisons, event/task progression checks, date/chapter/location checks, character/clan/world-state checks, elapsed-time checks, and signal-based gates where the host can lawfully emit those signals.`
- `Host-specific trigger timing, trigger scope, objective progress counters, and scene/menu/playable entry ownership are not themselves shared condition primitives; they remain host adapters that attach a host to the shared condition core.`
- `A host may only extend the shared condition surface through explicit adapter ids or bounded shared primitive upgrades, not by inventing a feature-local condition DSL.`

### Frozen Shared Effect Expression Model

- `effect_bundle` is frozen as the single reusable creator-facing effect container shared across event, task, dialogue/scene, menu, and minigame authoring.`
- `The shared effect core is frozen around current reusable repository evidence: flag mutation, variable mutation, time advance, runtime-facing task lifecycle actions, money/resource mutation, and bounded character/world patch primitives that already exist as repeatable gameplay outcomes.`
- `Host-specific launch or settlement mechanics such as scene jumps, event triggering, playable launch ownership, and menu navigation are not shared effect primitives by default; they remain host adapters or downstream runtime-delta candidates.`
- `Where multiple existing effect contracts already overlap, the shared authoring model must converge on one authoring-side vocabulary and let hosts compile into current runtime consumers rather than letting each host keep separate authoring verbs forever.`
- `A host may only extend the shared effect surface through explicit adapter ids or bounded shared primitive upgrades, not by inventing a feature-local effect DSL.`

### Frozen Host Reuse And Adapter Boundary

- `event`, `quest/task`, `dialogue/scene`, `menu`, and `minigame` authoring must all reference the same shared condition_group and effect_bundle objects rather than embedding separate host-local rule languages as the default authoring path.`
- `event` keeps ownership of trigger timing and trigger scope while delegating reusable gate and outcome logic to shared condition/effect objects.`
- `quest/task` keeps ownership of objective progress, signal collection, and lifecycle checkpoints while delegating reusable start/completion/failure gates and outcome logic to shared condition/effect objects.`
- `dialogue/scene`, menu, and minigame hosts keep ownership of branch topology, entry/exit hooks, and host presentation or launch semantics while delegating reusable gate and outcome logic to shared condition/effect objects.`
- `If a host requires behavior that cannot be expressed by the frozen shared primitives plus bounded host adapters, that gap belongs to the later minimum-runtime-contract-change audit rather than becoming an immediate new host-local dialect.`

### Frozen Rule-Dialect Prohibitions

- `Do not let event authoring, task authoring, dialogue/scene authoring, menu authoring, and minigame authoring each grow a separate default condition grammar.`
- `Do not let those same hosts each grow a separate default effect grammar.`
- `Do not use current codebase fragmentation such as EventConditionNode, scene/action Condition/Effect, task conditions, or ad hoc callback/custom seams as justification for preserving multiple authoring-side dialects.`
- `Current runtime or legacy host seams may survive temporarily as compile/export targets or compatibility adapters, but the frozen creator-facing contract is one shared condition/effect family.`

### Frozen Minimum Runtime Contract Change List

- `Required now`
  - `One shared authoring-rule compile/adapter seam is required so condition_group and effect_bundle can lower into current event, task, dialogue/scene, menu, and minigame runtime consumers without each host preserving a separate authoring dialect forever.`
  - `That required change is contract/runtime-behavior scoped, not a mandate to invent new runtime pack tables first.`
  - `No additional mandatory runtime-facing split table is justified today beyond the already-supported manifest-driven families and optional task support already present in current repository truth.`
- `Optional only if later implementation evidence proves current contracts insufficient`
  - `dialogues.json`
  - `minigames.json`
  - `story-nodes.json`
  - `city-menu-items.json`
  - `house-menu-items.json`
  - `narrow additive field/table growth for richer task, menu, playable, or shared-rule settlement only where compile/export cannot stay compatible with current runtime truth`
- `Out of scope for this version`
  - `destructive replacement of the current scenario-pack format`
  - `broad runtime modernization or consumer rewrites not strictly required for script-editor landing`
  - `schema growth admitted only because a richer editor UI would prefer it`
  - `repository-wide migration work unrelated to the bounded script-editor contract freeze`

### Frozen Gap Classification Matrix

| Mismatch Family | Current Evidence | Classification | Frozen Disposition |
| --- | --- | --- | --- |
| `person / city / building / story_pack authoring semantics exceed current runtime naming` | `Current mapping already compiles these objects into characters / cities / houses / pack manifest families while authoring-only metadata stays outside runtime export.` | `Class A` | `Solve in authoring model plus export mapping; no new runtime table or field is justified.` |
| `dialogue and story_node are creator-facing objects while current runtime still centers on scenes + textEntries` | `Current runtime already has scenes.json plus text-entries.json and the mapping queue froze dialogue/story_node onto that family by default.` | `Class A` | `Keep compatibility-first export onto current scene/text families unless later evidence proves they are insufficient.` |
| `authoring-only notes, draft state, grouping, review markers, unresolved import residue` | `These are creator workflow concerns, not runtime consumption requirements.` | `Class A` | `Persist only in the editor project; do not leak into runtime-facing export.` |
| `quest/task authoring requires a runtime-facing task family` | `Current repository truth already supports optional tasks.json through ContentPackDefinition and scenario-pack loader validation.` | `Class A` | `Use the existing task family; no new mandatory task table redesign is justified by current evidence.` |
| `dedicated runtime tables for dialogue / minigame / story_node / city-menu-item / house-menu-item` | `Authoring plan records them as candidate additive export families, but current compatibility-first freeze does not yet prove they are required.` | `Class B` | `Keep as optional additive candidates only; admit later only if implementation proves existing runtime families cannot carry the semantics cleanly.` |
| `one reusable shared rule family across event / task / dialogue/scene / menu / minigame` | `Current code still shows multiple host-specific condition/effect contracts such as EventConditionNode, scene/action Condition/Effect, task conditions/signals, and host-local custom/callback seams.` | `Class C` | `Require one shared authoring-rule compile/adapter seam before implementation-governed editor landing.` |
| `host-local custom/callback/playable/menu adapters that exceed frozen shared primitives` | `Current repository still uses bounded custom/callback and host trigger seams on covered paths.` | `Class C` | `Treat these as runtime-behavior gaps only when shared primitives plus host adapters cannot express them; do not silently expand the shared core without evidence.` |

### Explicit Downstream Routing From This Queue

- `Minimum required runtime/schema delta classification is now frozen on current version truth and must not be silently reopened without fresh evidence.`
- `Any proof that dialogues.json, minigames.json, story-nodes.json, city-menu-items.json, or house-menu-items.json must become runtime-facing tables belongs to the later runtime-delta and compatibility families rather than this mapping queue by itself.`
- `Compatibility round-trip policy, importer precedence, editor-project persistence shape, runtime-facing export artifact guarantees, and metadata non-leak policy are now frozen on current version truth and must not be silently reopened without fresh evidence.`
- `Shared condition/effect expression grammar, primitive boundary, host reuse rules, and host-specific adapter allowance are now frozen on current version truth and must not be silently reopened without fresh evidence.`
- `city/building menu schema shape and any promotion of city_menu_item or building_menu_item into runtime-facing structures remain downstream until mapping work proves they are necessary`

### Required Decisions

- `whether the editor project persists as one authoring manifest or multiple split authoring tables`
- `whether scene and dialogue export as separate runtime tables or one combined typed runtime table`
- `whether minigame rule authoring uses a generic graph, a bounded block system, or a hybrid preset-plus-extension model`
- `whether city/building menu authoring shares one host-parameterized schema or two separate schemas`
- `whether compatibility round-trip is mandatory: import existing pack -> edit -> export compatible pack`
- `whether old packs are handled by compatibility importer, migration, or both with explicit precedence`
- `which mismatches classify as Class A authoring-only difference, Class B additive pack/runtime extension, or Class C runtime behavior gap`

### Deferred Work

- `full script-editor UI delivery`
- `page layout, component decomposition, interaction polish, and temporary editor wiring`
- `repository-wide script hardcode migration`
- `large-scale runtime consumer rewrites or broad sub-runtime refactors`
- `modularization residue that is not strictly required to freeze the editor contract boundary`
- `non-essential runtime pack schema expansion beyond the frozen minimum delta list`

### Drift Guards

- `Do not widen this version from design-governed freeze into implementation-governed editor delivery without an explicit future version-boundary change.`
- `Do not change the authoring model merely because one provisional UI flow or component tree is inconvenient.`
- `Do not add runtime tables, fields, or loaders before the mapping matrix and mismatch classification justify them.`
- `Do not let editor-only metadata leak into runtime-facing pack output by convenience.`
- `Do not let event/task/dialogue/menu/minigame authoring grow separate condition/effect dialects without explicit shared-mechanism approval.`
- `Do not treat Queue Contract Portfolio entries as live candidate truth or admission-ready implementation scope by default.`
- `Do not absorb shell closure, runtime modernization, or unrelated residue cleanup into this version unless later written evidence proves they are strictly required for the frozen contract boundary.`

### Non-Goals

- `main.ts pure shell closure by itself`
- `large-scale sub-runtimes refactor`
- `repository-wide migration of script-related hardcoded paths`
- `full script-editor UI delivery`
- `non-essential runtime pack schema expansion`

### Queue Contract Portfolio

- `This portfolio preserves only the lawful queue IDs and contract roles that may be used if a later admission review produces fresh evidence.`
- `Portfolio presence is not a pending backlog, not a live candidate set, and not queue execution authorization by itself.`

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.editor-native-authoring-contract-freeze` | `required` | `authoring contract family` | `Admit only if fresh evidence proves the creator-facing editor object model, ownership boundary, or authoring lifecycle still lacks one frozen contract surface.` |
| `queue.authoring-runtime-mapping-contract-freeze` | `required` | `mapping contract family` | `Admit only if fresh evidence proves authoring objects still lack one explicit export or compile contract into the runtime-facing pack surface.` |
| `queue.compatibility-import-export-policy-freeze` | `required` | `compatibility policy family` | `Admit only if fresh evidence proves existing pack import, editor project persistence, or runtime export policy remains unfrozen.` |
| `queue.shared-condition-effect-mechanism-freeze` | `required` | `shared rule mechanism family` | `Admit only if fresh evidence proves condition or effect authoring still depends on feature-local branching rather than one reusable shared mechanism contract.` |
| `queue.minimal-runtime-contract-change-audit` | `required` | `runtime delta family` | `Admit only if fresh evidence proves editor landing requires runtime contract or schema changes and the minimum lawful delta is not yet explicitly bounded.` |

### Acceptance Criteria

- `editor-native authoring contract is frozen with named core objects, ownership boundaries, and editor-only metadata rules`
- `authoring -> runtime mapping contract is frozen with explicit compile/export rules and allowed compatibility shims`
- `compatibility / import-export policy is frozen for existing scenario packs, editor project data, and runtime-facing export artifacts`
- `shared condition / effect mechanism is frozen as one reusable contract family rather than feature-specific patches`
- `minimum runtime contract change list is explicit, bounded, and excludes non-required runtime or schema expansion`
- `the version remains design-governed through bounded contract-freeze queue admission and only leaves design-governed scope after a future explicit version-boundary change authorizes implementation-governed work`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `This version was opened on 2026-07-10 as the successor to target.project-complete-modularization after the prior modularization version was explicitly closed.`
- `The opening action intentionally separates script-editor design and contract freeze from modularization residue, runtime ownerization follow-up, and full editor implementation pressure.`
