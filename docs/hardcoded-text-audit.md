# Hardcoded Text Audit

This audit tracks the remaining house-related `zhuyuanzhang` pack content still living outside `src/content/scenario-packs/**`.

## Baseline Scan

- Date: `2026-06-29`
- House content scan:
  `rg -n "[\u4e00-\u9fff]{2,}" src/content/houses src/application/house-modules src/application/grain-shop --glob '!src/content/scenario-packs/**'`
- Targeted scenario scan:
  `rg -n "朱元璋|皇觉寺|濠州|帅府|住持|方丈|化缘|红巾军|军议|军令" src/content/houses src/application/house-modules src/application/grain-shop --glob '!src/content/scenario-packs/**'`
- Status: houses-only scoped remainder audit

The broad scan still returns generic UI copy and pack-agnostic engine text. The inventory below is the reviewed remainder list after excluding those out-of-scope matches.

## Migration Boundary

Treat a match as in scope only when both are true:

- it belongs to a house content source under `src/content/houses/**` or a direct house runtime consumer under `src/application/house-modules/**` or `src/application/grain-shop/**`
- it is scenario-owned prose or structured house content that should be authored by the `zhuyuanzhang` pack

Treat a match as out of scope when it belongs to:

- `map` data
- `prototype-world`
- `zhu-yuanzhang-early-characters`
- `zhu-yuanzhang-main-story`
- generic UI text
- pack-agnostic engine prompts

## Completed Zero-Out Checkpoints

### P0: House content source files no longer acting as authoring roots

- `src/content/houses/grain-shop-content.ts`
- `src/content/houses/home-house-content.ts`
- `src/content/houses/keep-house-content.ts`
- `src/content/houses/market-house-content.ts`
- `src/content/houses/medicine-house-content.ts`
- `src/content/houses/tavern-content.ts`
- `src/content/houses/tea-house-content.ts`
- `src/content/houses/temple-house-content.ts`

### P1: Runtime consumers already guarded against pack prose regression

- `src/application/house-modules/home-house/home-house-house-module.ts`
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`

## Remaining House Pack Migration Inventory

### P1: Runtime consumers that still own `zhuyuanzhang` pack prose

- `src/application/house-modules/temple-house/temple-house-house-module.ts`

## Explicitly Out of Scope for This Pass

- `src/content/yuanmo-campaign-map.ts`
- `src/content/prototype-world.ts`
- `src/content/zhu-yuanzhang-early-characters.ts`
- `src/content/story/zhu-yuanzhang-main-story.ts`
- `src/application/story-battle/story-battle-runtime.ts`
- `src/application/city-menu/city-menu.ts`
- `src/main.ts`

## Zero-Out Target

For this houses-only pass, success means:

- no house-authored `zhuyuanzhang` prose remains in `src/content/houses/**`
- no direct house runtime consumer remains the canonical source of house-authored scenario prose
- house-related scenario prose and structured content move into `src/content/scenario-packs/zhuyuanzhang/**`
- cleaned modules stay protected by a permanent boundary test against pack-specific term regressions

## Scan Notes

- This file is the canonical reviewed remainder list for the houses-only migration pass.
- The inventory is intentionally scoped, not a whole-repository content audit.
- `market-house`, `tea-house`, and `leader-residence` still contain inline Chinese UI or generic interaction text, but they are not currently flagged by the targeted `zhuyuanzhang` pack-term scan.
- The only reviewed pack-specific runtime remainder in this pass is `temple-house-house-module.ts`.
- If this file and the houses-only spec disagree, update both together before resuming implementation.
