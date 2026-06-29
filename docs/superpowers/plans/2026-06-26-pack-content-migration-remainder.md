# Houses-Only Scenario-Pack Zero-Out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the houses-only `zhuyuanzhang` zero-out pass by migrating the remaining pack-authored scenario content out of direct house runtime consumers into scenario-pack JSON.

**Architecture:** Treat `src/content/scenario-packs/zhuyuanzhang` as the only authoring home for house-related scenario prose and structured house content. Keep `src/content/houses/**` as adapters only, and keep cleaned runtime house modules from regressing back into inline pack prose.

**Tech Stack:** TypeScript, Vite, JSON scenario-pack loader, CommonJS tests, PowerShell, ripgrep

---

## Scope Lock

This plan covers only the houses-only remainder inventory in `docs/hardcoded-text-audit.md`. It excludes map, prototype-world, historical-character, story, city-menu, story-battle, and boot-path work.

## File Structure Map

### Remaining direct runtime house consumer

- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`

### Canonical pack targets

- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`

### Verification and boundary guard

- Modify: `tests/robustness.test.cjs`
- Create: `tests/hardcoded-scenario-pack-boundary.test.cjs`
- Modify: `docs/hardcoded-text-audit.md`
- Modify: `docs/superpowers/specs/2026-06-26-pack-content-migration-remainder-spec.md`

## Execution Order

1. Refresh docs and freeze the narrowed remaining boundary
2. Migrate the remaining direct runtime consumer
3. Keep permanent boundary guards for the cleaned house files

### Task 1: Refresh Docs and Freeze the Narrowed Boundary

**Files:**
- Modify: `docs/hardcoded-text-audit.md`
- Modify: `docs/superpowers/specs/2026-06-26-pack-content-migration-remainder-spec.md`
- Modify: `docs/superpowers/plans/2026-06-26-pack-content-migration-remainder.md`

- [ ] **Step 1: Re-run the house-scoped scans and rewrite the docs to match the current checkpoint**

Run:

```powershell
rg -n --glob '!src/content/scenario-packs/**' "[\u4e00-\u9fff]{2,}" src/content/houses src/application/house-modules src/application/grain-shop
rg -n "朱元璋|皇觉寺|濠州|帅府|住持|方丈|化缘|红巾军|军议|军令" src/content/houses src/application/house-modules src/application/grain-shop --glob '!src/content/scenario-packs/**'
```

Expected:

- `src/content/houses/**` no longer appears as a reviewed pack-owned prose remainder
- `temple-house-house-module.ts` remains the only reviewed pack-specific runtime remainder
- cleaned runtime modules are listed as regression-guarded, not as active migration work

### Completed Checkpoint: `src/content/houses/**` Authoring Roots

The source-side zero-out checkpoint is complete. Do not reopen `src/content/houses/**` for new `zhuyuanzhang` prose authoring.

### Completed Checkpoint: Cleaned Runtime Consumers

These modules are already migrated and must stay clean:

- `src/application/house-modules/home-house/home-house-house-module.ts`
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`

### Task 2: Migrate the Remaining Temple Runtime Consumer

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Add failing regression tests for remaining temple runtime prose**

Use assertions shaped like:

```js
assert.equal(
  lateTempleReview.dialogueLines[0],
  "评定日期已到。你现在可以立刻去前殿听候方丈安排，也可以先不去。"
);
assert.equal(
  templeBeggingPrompt.dialogueLines[0],
  "住持已把这一轮差事定为远途化缘，你先往颍州方向走，在外地城镇求粮。"
);
```

- [ ] **Step 2: Run the targeted suite and confirm the remaining temple runtime still embeds literals**

Run:

```bash
npm test -- --runInBand robustness
```

Expected:

- FAIL or expose that required temple runtime prose is still authored inline

- [ ] **Step 3: Replace each remaining literal with text-id lookup and add the prose to pack entries**

Target runtime pattern:

```ts
return resolveTextEntry(
  input.textEntriesById ?? {},
  "runtime.zhu_yuanzhang.temple.review.late.prompt.001",
  "MISSING_TEXT:runtime.zhu_yuanzhang.temple.review.late.prompt.001"
);
```

- [ ] **Step 4: Verify**

Run:

```bash
npm run typecheck
npm test -- --runInBand robustness
```

Expected:

- temple runtime flows still render and advance
- the remaining temple scenario prose now resolves through pack text ids

### Task 3: Keep Strict Boundary Guards for Cleaned Scope

**Files:**
- Create: `tests/hardcoded-scenario-pack-boundary.test.cjs`
- Modify: `docs/hardcoded-text-audit.md`

- [ ] **Step 1: Add and keep a scan-based boundary test over the cleaned house files**

Scan targets:

```txt
src/content/houses/grain-shop-content.ts
src/content/houses/home-house-content.ts
src/content/houses/keep-house-content.ts
src/content/houses/medicine-house-content.ts
src/content/houses/tavern-content.ts
src/application/house-modules/home-house/home-house-house-module.ts
src/application/house-modules/keep-house/keep-house-house-module.ts
src/application/house-modules/grain-shop/grain-shop-house-module.ts
src/application/house-modules/medicine-house/medicine-house-house-module.ts
src/application/house-modules/tavern/tavern-house-module.ts
```

Expected assertion:

```js
assert.deepEqual(forbiddenMatches, []);
```

- [ ] **Step 2: Do not allowlist pack-authored scenario terms**

Disallowed terms include:

- `皇觉寺`
- `濠州`
- `住持`
- `方丈`
- `帅府`
- `化缘`

- [ ] **Step 3: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Expected:

- typecheck passes
- the targeted tests pass
- the boundary test prevents cleaned house files from regressing

## Success Criteria

- no reviewed `src/content/houses/**` file remains the canonical authoring source for `zhuyuanzhang` house content
- no cleaned runtime consumer reintroduces pack-specific house prose inline
- `temple-house-house-module.ts` is the only remaining reviewed runtime remainder until Task 2 is finished
- `docs/hardcoded-text-audit.md`, the spec, and this plan stay aligned
- `npm run typecheck` and `npm test` pass

## Notes for Execution

- Do not widen scope into map, prototype-world, story, or character migration.
- Do not treat generic UI copy cleanup as part of this pack-specific zero-out pass.
- Keep `text-entries.json` as the prose home and keep structured content in the owning pack tables.
