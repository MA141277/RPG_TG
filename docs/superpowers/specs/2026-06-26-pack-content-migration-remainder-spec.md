# Houses-Only Scenario-Pack Zero-Out Spec

## Background

The repository already supports loading `zhuyuanzhang` through the generic scenario-pack loader, but house-related content has been migrating across two authoring layers:

- `src/content/houses/**` previously owned part of the house-authored scenario content
- several direct house runtime consumers embedded `zhuyuanzhang` prose inline instead of resolving pack text ids

This spec narrows the migration pass to house-related pack content only and treats generic UI copy cleanup as a separate concern.

## Goal

Complete the remaining houses-only zero-out work so that:

- `src/content/scenario-packs/zhuyuanzhang` is the canonical authoring home for house-related `zhuyuanzhang` prose and structured house content
- `src/content/houses/**` stays adapter-only for reviewed house content
- remaining direct runtime consumers stop embedding scenario-authored house prose inline

## Non-Goals

This pass does not:

- migrate map-related content
- migrate `prototype-world` content
- migrate historical-character content
- migrate main-story content
- localize generic UI text
- redesign house mechanics or runtime architecture

## Required Boundary

The migration must preserve this ownership model:

- house-related scenario prose goes to `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- structured house content goes to the appropriate pack-owned table under `src/content/scenario-packs/zhuyuanzhang/**`
- `src/content/houses/**` may adapt pack data, but must not resume owning house-authored `zhuyuanzhang` content
- direct runtime consumers may branch, assemble view models, and select text ids, but must not remain the canonical authoring source for house-authored scenario prose

## In-Scope Files

### Completed source-side zero-out

- `src/content/houses/**` is already treated as adapter-only in this pass

### Remaining direct runtime consumer

- `src/application/house-modules/temple-house/temple-house-house-module.ts`

### Regression-guarded cleaned runtime consumers

- `src/application/house-modules/home-house/home-house-house-module.ts`
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`

## Explicitly Out of Scope

- `src/content/yuanmo-campaign-map.ts`
- `src/content/prototype-world.ts`
- `src/content/zhu-yuanzhang-early-characters.ts`
- `src/content/story/zhu-yuanzhang-main-story.ts`
- `src/application/story-battle/story-battle-runtime.ts`
- `src/application/city-menu/city-menu.ts`
- `src/main.ts`

## Acceptance Criteria

This spec is satisfied when all of the following are true:

- no reviewed `src/content/houses/**` file remains the canonical authoring source for `zhuyuanzhang` house content
- no regression-guarded runtime consumer reintroduces pack-specific `zhuyuanzhang` prose inline
- `temple-house-house-module.ts` is the only remaining reviewed runtime owner until its migration finishes
- house-related content ownership is fully represented by pack JSON plus text entries
- the audit, this spec, and the plan all describe the same houses-only scope
- verification includes `npm run typecheck` plus targeted regression and boundary coverage for the in-scope house files

## Delivery Order

Execute in this order:

1. refresh docs and freeze the narrowed remaining boundary
2. migrate the remaining temple runtime prose into pack text-id resolution
3. keep strict boundary guards for cleaned house files
