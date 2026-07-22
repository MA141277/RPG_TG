# Playable Naming And Artifact Conventions

## 1. Goal

Freeze the repository naming rules for future playable runtime work so later humans, AI, scaffold tooling, validators, and migration plans all speak the same identifiers.

This is a doc-only contract companion to:

- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`

It does not authorize implementation or queue promotion.

## 2. Naming Layers

The repository should keep four naming layers distinct:

1. `playableId`
   - reusable mechanic identity
2. `integrationId`
   - scenario-owned concrete use-site identity
3. `triggerId`
   - one trigger definition identity
4. `sessionId`
   - one runtime instance identity

They must not be collapsed into one id.

## 3. `playableId` Rules

### 3.1 Format

- lowercase ASCII only
- kebab-case
- no spaces
- no dots
- no owner or pack prefix unless the mechanic itself is intrinsically owner-specific

Recommended examples:

- `activity-qte`
- `city-begging`
- `grain-accounting`
- `medicine-compounding`
- `story-battle`

### 3.2 Meaning

`playableId` identifies the reusable mechanic, not one story scene or one house entry.

Good:

- `city-begging`
- `story-battle`

Bad:

- `haozhou-city-begging`
- `kulan-grain-shop-accounting`
- `scene-7-story-battle`

### 3.3 Stability Rule

- once published, `playableId` should be treated as stable
- do not rename it because one host flow changed
- do not encode temporary UI layout or reward semantics into `playableId`

## 4. `integrationId` Rules

### 4.1 Format

`integrationId` should be dot-separated and owner-scoped.

Recommended pattern:

```text
<pack>.<owner-kind>.<owner-local-id>.<playable-id>.<entry-key>
```

Examples:

- `zhuyuanzhang.scene.temple-begging.city-begging.default`
- `zhuyuanzhang.house.kulan-grain-shop.grain-accounting.default`
- `zhuyuanzhang.story.sundeya-rescue.story-battle.default`
- `builtin.external.debug.activity-qte.sample`

### 4.2 Meaning

`integrationId` identifies one concrete scenario-owned use site.

The same `playableId` may have many `integrationId` values.

Example:

- `city-begging`
  - `zhuyuanzhang.scene.temple-begging.city-begging.default`
  - `zhuyuanzhang.task.ration-run.city-begging.hard-mode`

### 4.3 Stability Rule

- `integrationId` must stay stable for a given content use site
- rename it only when the owning use site is materially re-authored
- do not derive it from runtime session ids or temporary UI state

## 5. `triggerId` Rules

### 5.1 Format

Recommended pattern:

```text
<integration-id>.trigger.<key>
```

Examples:

- `zhuyuanzhang.scene.temple-begging.city-begging.default.trigger.opening`
- `zhuyuanzhang.house.kulan-grain-shop.grain-accounting.default.trigger.accounting`

### 5.2 Meaning

- `triggerId` identifies one trigger definition under one integration
- it is not a replacement for `integrationId`

## 6. `sessionId` Rules

### 6.1 Format

- runtime-generated
- opaque to content authors
- unique per active launch

Recommended pattern:

```text
playable.<playable-id>.<nonce>
```

Example:

- `playable.city-begging.00012345`

### 6.2 Rule

- content authors and integration authors must not hand-author `sessionId`
- validators should reject any attempt to store session identity as a static content id

## 7. File And Artifact Naming

### 7.1 Mechanic-Facing Code

Recommended canonical targets:

- `src/domain/playables/<playableId>.ts`
- `src/application/playables/<playableId>/<playableId>-definition.ts`
- `src/application/playables/<playableId>/<playableId>-session.ts`
- `src/application/playables/<playableId>/<playableId>-presenter.ts`
- `src/application/playables/<playableId>/<playableId>-metrics.ts`
- `src/application/playables/<playableId>/<playableId>-settlement.ts`
- `src/ui/views/playables/<playableId>-view.ts`

### 7.2 Mechanic Artifacts

Recommended canonical names:

- mechanic brief:
  - `playable-mechanic.<playableId>.md`
- shared content:
  - `src/content/playables/<playableId>-content.ts`
- shared assets:
  - `src/assets/playables/<playableId>/...`

### 7.3 Integration Artifacts

Recommended canonical names:

- integration brief:
  - `playable-integration.<integrationId>.md`
- integration config:
  - `src/content/scenario-packs/<pack>/playables/<integrationId>.json`
- pack-owned assets:
  - `src/content/scenario-packs/<pack>/assets/playables/<playableId>/...`

Rule:

- file naming may be scaffolded differently later, but the artifact identity must still expose both `playableId` and `integrationId`

## 8. Family Naming

Allowed top-level `family` values today:

- `minigame`
- `battle`
- `flow`

Rules:

- use `family: "minigame"` for ordinary short-form challenge mechanics
- use `family: "battle"` for battle-family mechanics such as `story-battle`
- use `family: "flow"` for ordinary authored interaction flows such as creator-defined building functions
- do not invent `family` variants such as `qte`, `debate`, `gambling`, or `house`
- internal variants belong under mechanic detail, not top-level family

## 9. Authoring Role Labels

Use these exact role names in docs and tooling:

- `playable/mechanic author`
- `scenario/integration author`
- `framework/runtime maintainer`

Avoid mixing them into one generic “playable author” when responsibility boundaries matter.

## 10. Reserved Prefixes And Anti-Patterns

Avoid:

- `minigame-` as a mandatory prefix for every `playableId`
- `battle-` prefix when the id already clearly names the mechanic
- owner names inside `playableId`
- temporary adjectives such as `new-`, `v2-`, `temp-`
- runtime-generated ids baked into artifact filenames

Bad examples:

- `minigame-city-begging`
- `battle-story-battle`
- `temp-grain-accounting`
- `kulan-scene-3-compounding`

## 11. How Scaffolds Should Consume These Rules

Later scaffold tools should:

- require `playableId` for mechanic creation
- require `integrationId` for integration creation
- generate canonical file names from those ids
- reject malformed ids before file generation

## 12. How Validators Should Consume These Rules

Later validators should reject:

- invalid `playableId` casing
- invalid `integrationId` format
- duplicate `playableId`
- duplicate `integrationId`
- `integrationId` whose embedded playable segment does not match the referenced `playableId`

## 13. Forward Rule

Any future playable queue or scaffold/validator draft should treat this naming document as the default naming source unless a later repository-level spec explicitly supersedes it.
