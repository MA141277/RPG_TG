# Shared Contract Upgrade Governance Spec

**Goal:** Define the governance rules, upgrade order, and verification gates for extending the shared `scenario-pack/content-pack` contract chain so later pack adoption work does not bypass shared runtime boundaries.

## Why This Spec Exists

The repository already has a canonical `scenario-pack` format, shared pack loaders, and active-content assembly. That makes pack-local governance possible, but it does not by itself define how new shared capabilities are allowed to enter the system.

This gap matters because several planned scenario-pack upgrades are not pack-local shape changes. They are shared contract upgrades:

- `visualAssets` as a first-class pack table
- task-facing `textId` fields instead of only direct `title/description`
- richer scene graph ownership beyond today's flat `actions` array

If these capabilities are introduced directly inside one pack before the shared chain is upgraded, the repository falls back into scenario-specific loader branches, pack-specific runtime parsing, and local drift between builtin content and future mods.

This spec exists to prevent that failure mode.

## Non-Authority And Scope Boundary

This document is a governance spec, not a live execution document.

- It does not replace Blueprint truth, queue truth, or plan truth.
- It does not authorize implementation by itself.
- It does not redefine pack-specific migration details that belong in pack-level specs.
- It does define the mandatory order and acceptance gates for any shared `scenario-pack/content-pack` capability upgrade.

## Shared Upgrade Scope

For this repository, the shared contract chain includes all of the following layers:

1. `Shared contract layer`
   - Types and manifest/file-key surfaces that define what a pack is allowed to declare.
2. `Shared loader layer`
   - Pack readers and parsers that load declared files without pack-specific branching.
3. `Shared validator layer`
   - Structural and reference validation that proves declared content is legal.
4. `Shared active-content assembly layer`
   - The path that merges activated pack content into runtime-readable registries and lookup surfaces.
5. `Shared runtime consumer layer`
   - Runtime systems and presenters that actually consume the new fields or tables.
6. `Pack adoption layer`
   - Individual packs such as `zhuyuanzhang` switching from legacy fields to the newly shared capability.
7. `Cleanup layer`
   - Removal of transitional glue, duplicate fields, and legacy fallback paths.

No capability is considered shared until it has crossed every required layer up to the consumer layer.

## Relationship To Pack Specs

Pack-level specs may define:

- why a specific pack needs a new shared capability
- how that pack should adopt the capability after the shared chain is ready
- which pack-local assets or tables move during adoption

Pack-level specs must not define:

- new shared manifest keys by themselves
- pack-exclusive loader branches to parse a new field
- pack-exclusive validator exceptions
- pack-exclusive runtime fallback semantics for a field that the shared chain does not yet support

In short: pack specs may consume shared capabilities, but they must not mint them.

## Hard Rules

1. New pack tables and new pack fields must enter the shared contract layer before any production pack uses them.
2. A pack must not introduce a field that active shared loaders or consumers cannot parse.
3. Shared capability upgrades must be additive first. Old packs must remain loadable until an explicit cleanup phase removes transitional support.
4. Do not add `zhuyuanzhang`-specific or pack-specific branches in `main.ts`, shared pack loaders, or runtime consumers just to recognize a not-yet-shared field.
5. Validator support must land before a new field or table is treated as legitimate authoring surface.
6. Runtime consumer support must land before a pack treats a new field as required truth.
7. Pack adoption must not happen in the same reasoning step as capability invention. Upstream readiness must be explicit and reviewable.
8. If a capability changes owner boundaries across multiple subsystems, the upgrade must document each layer's responsibility rather than hiding the change behind one catch-all helper.

## Capability Matrix

| Capability | Current State | Shared Prerequisites | Earliest Legal Pack Adoption Point | Illegal Shortcut |
| --- | --- | --- | --- | --- |
| `visualAssets` table | Not a shared pack file key today | manifest key, domain contract, loader parse, validator support, active-content exposure, consumer usage rules | after all shared layers recognize `visualAssets` as first-class | adding `visual-assets.json` to one pack and teaching only that pack path to read it |
| task `textId` fields | task runtime still centers `title/description` strings | shared task contract fields, loader parse, validator rules, task/UI consumers updated | after shared task consumers can read `titleTextId/descriptionTextId` without pack-specific fallback | storing only `titleTextId` in one pack while shared consumers still require raw strings |
| richer scene graph | runtime still expects `SceneDefinition`-compatible `actions` | shared scene contract redesign, loader parse, validator rules, scene runtime and presenter support | after shared scene runtime can execute the richer graph shape | replacing `actions` with pack-local nodes while shared runtime still reads flat action arrays |

## Upgrade Order

Every shared capability upgrade must follow this order:

### Phase 1: Capability Definition

- Name the capability and the exact repository problem it solves.
- Identify whether the capability is a new table, a new field family, or a new consumer semantic.
- Prove that the capability is genuinely shared rather than one pack's local content detail.

### Phase 2: Shared Contract Introduction

- Extend shared manifest keys, domain contracts, and typed definitions.
- Define whether the capability is required, optional, or transitional.
- Define compatibility rules with older packs.

### Phase 3: Shared Loader Introduction

- Teach shared pack loaders to parse the capability without pack-specific branching.
- Fail closed on malformed values instead of silently ignoring them.
- Keep old packs loadable if the capability is optional during transition.

### Phase 4: Shared Validator Introduction

- Add structural validation for the new table or field family.
- Add reference validation for ids introduced by the capability.
- Reject authoring shapes that would require pack-specific runtime guessing.

### Phase 5: Shared Active-Content Introduction

- Expose the capability through shared active-content assembly and lookup surfaces.
- Ensure activated content can be consumed without direct imports from one pack's files.
- Keep ownership explicit: the assembly layer should register data, not invent semantics.

### Phase 6: Shared Runtime Consumer Introduction

- Update the runtime systems and presenter-facing paths that need to consume the capability.
- Remove any assumption that only legacy fields exist when that assumption is no longer true.
- Do not declare the capability ready until at least one real consumer path proves it.

### Phase 7: Pack Adoption

- Only now may packs such as `zhuyuanzhang` author against the new shared capability.
- Adoption should prefer one pack first, with bounded migration scope and explicit verification.
- Transitional dual-write or dual-read is allowed only when the shared chain documents it clearly.

### Phase 8: Cleanup

- Remove obsolete adapter fields, legacy local glue, and duplicate pack-private truth.
- Tighten validators once the transitional window is officially closed.
- Update pack-level specs and repository docs so the shared capability becomes the new normal rather than a half-migrated option.

## Verification Contract

Each phase must prove something different.

### Contract Verification

- The shared type/domain surface exposes the new capability explicitly.
- The capability's optionality and compatibility rules are documented.
- No pack-specific type carve-out is required.

### Loader Verification

- Shared loaders can parse valid data for the capability.
- Shared loaders reject malformed data for the capability.
- Packs that do not use the capability still load correctly when the feature is optional.

### Validator Verification

- Missing required references are rejected.
- Unsupported field combinations are rejected.
- Validation errors identify the shared rule being violated rather than pointing to pack-specific behavior.

### Active-Content Verification

- Activated content exposes the new capability through shared lookup surfaces.
- Production consumers no longer need direct file imports from one scenario-pack in order to see the capability.

### Runtime Consumer Verification

- At least one real runtime path consumes the capability through shared seams.
- No pack-specific branch is required in `main.ts` or another shared consumer to make the capability work.

### Pack Adoption Verification

- A real pack can adopt the capability through the shared chain only.
- The adoption does not regress old packs or shared baseline content.
- The adoption does not leave duplicate truth permanently split across old and new fields.

## Failure Patterns To Reject

The following are governance failures, even if a local demo appears to work:

- adding a new pack file and only teaching one pack path to load it
- adding a new field to pack JSON while validators still ignore it
- teaching `main.ts` or a pack-specific runtime helper to special-case a new field
- declaring a capability "shared" before any shared runtime consumer can read it
- removing old fields from a pack before shared consumers are ready for the replacement
- using one helper module to hide a cross-layer redesign without updating the actual shared contracts

## Acceptance Criteria

This governance spec is being followed only when all of the following are true:

- a new shared capability is introduced through `contract -> loader -> validator -> active-content -> consumer -> pack adoption -> cleanup`
- pack-level specs adopt shared capabilities instead of inventing them
- builtin content and future mod content stay on the same declared authoring path
- no production path requires pack-specific logic in order to consume the shared capability
- transitional compatibility is explicit, bounded, and later removable

## Immediate Application To Current Repository Work

Under the repository's current scenario-pack direction:

- `visualAssets` remains a planned shared upgrade, not a legal pack-level shortcut
- task `textId` adoption remains blocked until shared task contracts and consumers are upgraded
- richer scene graph ownership remains blocked until shared scene runtime and presenter consumers are upgraded

That means any pack-level spec, including `zhuyuanzhang` integration work, must continue to honor the currently supported shared contract surface until these upstream gates are completed.
