# Hardcoded Text Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove remaining hardcoded story, review, task, NPC dialogue, and other mod-configurable copy from code paths, and move them into the `zhuyuanzhang` scenario pack data tables.

**Architecture:** Keep runtime modules responsible only for flow control, ids, and parameter substitution. Store all mod-owned text in `src/content/scenario-packs/zhuyuanzhang/text-entries.json` first, then progressively move TS-only story and content resources to pack-owned tables where structure already exists. Explicitly do not migrate generic framework UI copy in this phase.

**Tech Stack:** TypeScript, Vite, scenario-pack JSON loader, Vitest/CommonJS test suite, ripgrep

## Execution State

- Status: `unknown`
- Last Updated: `2026-06-26`
- Current Focus: `Inspect completed checkboxes and current code state before resuming.`
- Next Step: `Resume from the first unchecked checkbox.`
- Verification: `Check latest progress entry and rerun required commands before continuing.`
- Notes: `Historical progress before this tracking block may be incomplete.`

## Progress Log

- 2026-06-26
  - Summary: `Added standardized progress-tracking sections to this plan.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Resume from the first unchecked checkbox.`

---

## Migration Inventory

### P0: Runtime fallback and mission/review text still in executable flow

**Source files:**
- `src/main.ts`
- `src/application/story/story-callbacks.ts`

**Text types:**
- Main mission fallback labels
- Council/review arrival reminders
- Council refusal text
- Insufficient-time refusal text
- Chapter intro text
- Story callback fallback title/occupation/biography text

**Target data table:**
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`

**Reason for priority:**
- These strings still live in runtime control flow.
- Pack switching can silently fall back to the wrong scenario flavor.
- This is the smallest change set with the highest architectural payoff.

### P0: Temple/keep review flow text embedded in house modules

**Source files:**
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
- `src/application/house-modules/keep-house/keep-house-house-module.ts`

**Text types:**
- Review opening dialogue
- Duty assignment lines
- Praise/penalty lines
- Work briefing text
- Review result text
- Rest/submit/donate confirmation paragraphs

**Target data table:**
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`

**Reason for priority:**
- These are story-facing system texts, not engine texts.
- Temple review is currently the main playable opening loop.
- They are the heaviest remaining source of scenario-specific copy.

### P1: Tea/tavern/market/medicine/grain-shop content pools still owned by TS modules

**Source files:**
- `src/application/house-modules/tea-house/tea-house-house-module.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`
- `src/application/house-modules/market-house/market-house-house-module.ts`
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- `src/application/grain-shop/grain-market.ts`
- `src/content/houses/tea-house-content.ts`

**Text types:**
- NPC greeting pools
- Rumor pools
- Debate/opening lines
- Trade summary phrasing
- Minigame/interaction result lines

**Target data table:**
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Existing pack tables that already own actors/NPC definitions when structure permits

**Reason for priority:**
- These strings are content, but currently masquerade as module constants.
- They should be mod-replaceable without changing code.

### P1: Story resource metadata still written in TS

**Source files:**
- `src/content/story/zhu-yuanzhang-main-story.ts`

**Text types:**
- Arc title/summary
- Beat title/summary
- Story-side biography or title changes
- Scene-level descriptive copy still held in TS metadata

**Target data table:**
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Existing `events.json` / `scenes.json` if the field already belongs there

**Reason for priority:**
- Runtime already supports text ids in many places.
- This is the next step toward a true DSL/content boundary.

### P2: Prototype and historical content still carries descriptive text in TS-only resources

**Source files:**
- `src/content/prototype-world.ts`
- `src/content/zhu-yuanzhang-early-characters.ts`
- `src/content/yuanmo-campaign-map.ts`
- `src/content/sample-scenario.ts`

**Text types:**
- Character biography
- `dialoguePool` / `intelPool`
- `shortBio`
- `gameplayUse`
- map marker `summary`
- roster `notes`

**Target data table:**
- Prefer pack-owned structured tables first:
  - `characters.json`
  - `historical-characters.json`
  - `city-npc-pools.json`
  - `maps.json`
  - `text-entries.json` for overflow text fields

**Reason for priority:**
- These are content-rich but less runtime-sensitive.
- Some of them may need schema refinement before migration.

### Out of Scope for this plan

**Do not migrate yet:**
- Generic UI chrome in `src/ui/**`
- Layout editor labels
- universal button labels such as `返回`, `关闭`, `确认`
- technical error messages not intended to be scenario-authored, unless already shown as part of opening-content UX

These can be handled later under a separate localization/UI-copy plan.

## Target Boundary Rules

- Runtime code may keep text ids, variable interpolation, and generic engine errors.
- Scenario flavor text must not remain in `src/main.ts` or `src/application/house-modules/**`.
- If a string references a scenario-specific place, faction, NPC, task, chapter, review cadence, or narrative framing, it belongs to pack data.
- Prefer one canonical text source: `text-entries.json`.
- Only create new JSON tables when the text is actually structured domain data rather than free text.

## Task 1: Freeze Scope and Add a Repeatable Audit

**Files:**
- Create: `docs/hardcoded-text-audit.md`
- Modify: `docs/superpowers/plans/2026-06-26-hardcoded-text-migration.md`

- [ ] **Step 1: Create the audit document with fixed categories**

Add sections:

```md
# Hardcoded Text Audit

## P0 Runtime Fallback
## P0 Temple/Keep Review
## P1 House Dialogue Pools
## P1 Story TS Resources
## P2 Prototype/Historical TS Content
## Excluded UI Copy
```

- [ ] **Step 2: Run the baseline scan and paste exact findings into the audit**

Run:

```powershell
rg -n --glob '!src/content/scenario-packs/**' --glob '!dist/**' --glob '!node_modules/**' '(评定|剧情|对白|对话|台词|任务|化缘|方丈|亲兵|chapter|mission|review|dialogue|rumor|biography)' src
```

Expected:
- command exits `0`
- the audit doc records files grouped under the categories above

- [ ] **Step 3: Mark every entry with a migration target**

Use only these values in the audit:

```md
- target: text-entries.json
- target: characters.json
- target: city-npc-pools.json
- target: maps.json
- target: keep-in-code
```

- [ ] **Step 4: Commit the frozen audit**

```bash
git add docs/hardcoded-text-audit.md docs/superpowers/plans/2026-06-26-hardcoded-text-migration.md
git commit -m "docs: add hardcoded text migration audit"
```

## Task 2: Migrate Runtime Fallback Text Out of `main.ts` and Story Callbacks

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/story/story-callbacks.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Add missing runtime text ids to the pack**

Append entries shaped like:

```json
{
  "runtime.zhu_yuanzhang.prototype.main_mission.review_hall": "前往评定会场",
  "runtime.zhu_yuanzhang.prototype.main_mission.temple_review": "前往皇觉寺听候住持训示",
  "runtime.zhu_yuanzhang.main_mission.haozhou_return": "返濠州听候盘查",
  "runtime.zhu_yuanzhang.chapter_intro.huai_xi_begging": "第一章·淮西托钵"
}
```

- [ ] **Step 2: Replace scenario-specific fallback literals with pack-first lookup**

Pattern to keep:

```ts
getRuntimeText("runtime.some.id", "legacy fallback")
```

Pattern to end with:

```ts
getRuntimeText("runtime.some.id")
```

or, if the helper requires a fallback:

```ts
getRuntimeText("runtime.some.id", "MISSING_TEXT:runtime.some.id")
```

- [ ] **Step 3: Apply the same rule to story callback titles and biography fallback**

Ensure these ids are pack-owned:

```ts
"runtime.zhu_yuanzhang.player.title.guo_zixing_camp"
"runtime.zhu_yuanzhang.player.occupation.guo_zixing_camp"
"runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp"
"runtime.zhu_yuanzhang.player.biography.guo_zixing_camp"
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Expected:
- no TypeScript errors
- no regression in JSON pack loading or story callback tests

- [ ] **Step 5: Commit**

```bash
git add src/main.ts src/application/story/story-callbacks.ts src/content/scenario-packs/zhuyuanzhang/text-entries.json tests/robustness.test.cjs
git commit -m "refactor: move runtime fallback text into scenario pack"
```

## Task 3: Extract Temple and Keep Review Text

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Group temple review text by function before moving it**

Use these buckets:

```md
- temple.review.arrival
- temple.review.penalty
- temple.review.assignment
- temple.review.result
- temple.review.overlay
- temple.review.refusal
```

- [ ] **Step 2: Move literal dialogue arrays and paragraph arrays into `text-entries.json`**

For sequential lines, use numbered ids:

```json
{
  "runtime.zhu_yuanzhang.temple.review.assignment.indoor.001": "这一轮评定，先以寺内帮忙为主。",
  "runtime.zhu_yuanzhang.temple.review.assignment.indoor.002": "评定到此为止，回到寺中事务里，再挑具体杂务去做。"
}
```

- [ ] **Step 3: Keep module code responsible only for choosing ids and interpolating variables**

Refactor from:

```ts
dialogueLines: ["这一轮评定，先以寺内帮忙为主。", "评定到此为止，回到寺中事务里，再挑具体杂务去做。"]
```

to:

```ts
dialogueLines: getPackTextLines(runtime, [
  "runtime.zhu_yuanzhang.temple.review.assignment.indoor.001",
  "runtime.zhu_yuanzhang.temple.review.assignment.indoor.002",
])
```

- [ ] **Step 4: Repeat for keep-house review task assignment and praise text**

Cover:
- audience greeting
- strategy announcement
- task assignment
- praise/result lines

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Expected:
- house view models still render
- review flows still advance

- [ ] **Step 6: Commit**

```bash
git add src/application/house-modules/temple-house/temple-house-house-module.ts src/application/house-modules/keep-house/keep-house-house-module.ts src/content/scenario-packs/zhuyuanzhang/text-entries.json tests/robustness.test.cjs
git commit -m "refactor: externalize temple and keep review text"
```

## Task 4: Extract House Dialogue Pools and Economy Rumors

**Files:**
- Modify: `src/application/house-modules/tea-house/tea-house-house-module.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `src/application/house-modules/market-house/market-house-house-module.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/application/grain-shop/grain-market.ts`
- Modify: `src/content/houses/tea-house-content.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`

- [ ] **Step 1: Move static greeting and rumor pools into pack text ids**

Use id families:

```txt
runtime.zhu_yuanzhang.tea_house.greeting.*
runtime.zhu_yuanzhang.tavern.greeting.*
runtime.zhu_yuanzhang.market.rumor.*
runtime.zhu_yuanzhang.medicine.dialogue.*
runtime.zhu_yuanzhang.grain_market.investigate.*
```

- [ ] **Step 2: Keep weighted selection in code, but select from ids rather than raw strings**

Refactor from:

```ts
pickRandom(grainShopMarketRumors)
```

to:

```ts
pickRandomTextId(grainShopMarketRumorIds, runtime)
```

- [ ] **Step 3: Convert price-dependent investigation text to id-based branching**

Refactor from:

```ts
if (price > 130) return "近来粮价怕是要涨。";
```

to:

```ts
if (price > 130) return getRuntimeText("runtime.zhu_yuanzhang.grain_market.investigate.high");
```

- [ ] **Step 4: Verify each module still opens and resolves dialogue**

Manual checklist:
- tea house opens NPC greeting
- tavern can open work panel
- market can investigate rumor
- medicine house can talk
- grain shop can investigate price

- [ ] **Step 5: Run automated verification**

Run:

```bash
npm run typecheck
npm test
```

- [ ] **Step 6: Commit**

```bash
git add src/application/house-modules/tea-house/tea-house-house-module.ts src/application/house-modules/tavern/tavern-house-module.ts src/application/house-modules/market-house/market-house-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/grain-shop/grain-market.ts src/content/houses/tea-house-content.ts src/content/scenario-packs/zhuyuanzhang/text-entries.json
git commit -m "refactor: externalize house dialogue pools and rumors"
```

## Task 5: Move Story Metadata Out of TS-Only Resources

**Files:**
- Modify: `src/content/story/zhu-yuanzhang-main-story.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/events.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenes.json`

- [ ] **Step 1: Inventory all remaining direct prose in `zhu-yuanzhang-main-story.ts`**

Search:

```powershell
rg -n 'title: |summary: |biography: ' src/content/story/zhu-yuanzhang-main-story.ts
```

- [ ] **Step 2: For free text, move content to `text-entries.json` and leave ids in TS**

Use id patterns:

```txt
story.zhu_yuanzhang.arc.main.title
story.zhu_yuanzhang.arc.main.summary
story.zhu_yuanzhang.beat.first_temple_review.title
story.zhu_yuanzhang.beat.first_temple_review.summary
```

- [ ] **Step 3: Where the data already belongs to pack scene/event rows, move it out of TS entirely**

Preferred destination:
- event-facing names -> `events.json`
- scene-facing names -> `scenes.json`
- prose blocks -> `text-entries.json`

- [ ] **Step 4: Verify story load and opening progression**

Manual checklist:
- opening scene loads
- first temple review still triggers
- unlock begging still resolves text ids

- [ ] **Step 5: Commit**

```bash
git add src/content/story/zhu-yuanzhang-main-story.ts src/content/scenario-packs/zhuyuanzhang/text-entries.json src/content/scenario-packs/zhuyuanzhang/events.json src/content/scenario-packs/zhuyuanzhang/scenes.json
git commit -m "refactor: move zhu yuanzhang story metadata into pack content"
```

## Task 6: Clean Up Prototype and Historical TS Content

**Files:**
- Modify: `src/content/prototype-world.ts`
- Modify: `src/content/zhu-yuanzhang-early-characters.ts`
- Modify: `src/content/yuanmo-campaign-map.ts`
- Modify: `src/content/sample-scenario.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/characters.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/historical-characters.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/city-npc-pools.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/maps.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`

- [ ] **Step 1: Stop generating scenario-facing biography by concatenating TS prose**

Eliminate patterns like:

```ts
biography: `${characterRecord.shortBio} ${characterRecord.gameplayUse}`.trim()
```

- [ ] **Step 2: Move playable character biography into `characters.json` and historical description into `historical-characters.json`**

Rule:
- player-facing current-state biography -> `characters.json`
- encyclopedia/reference biography -> `historical-characters.json`

- [ ] **Step 3: Move NPC talk pools into `city-npc-pools.json`**

Move:
- `dialoguePool`
- `intelPool`

Do not keep fallback pools in `prototype-world.ts` after migration.

- [ ] **Step 4: Move map marker summaries to structured fields first, free text second**

Preferred split:

```json
{
  "narrativeRole": "朱元璋和尚时期起点",
  "factionLabel": "红巾军/小明王宋",
  "ownerLabel": "郭子兴部",
  "notesTextId": "map.zhu_yuanzhang.haozhou.notes"
}
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Manual spot-check:
- default pack still opens correctly
- character detail page still shows biography
- map tooltip still shows summary

- [ ] **Step 6: Commit**

```bash
git add src/content/prototype-world.ts src/content/zhu-yuanzhang-early-characters.ts src/content/yuanmo-campaign-map.ts src/content/sample-scenario.ts src/content/scenario-packs/zhuyuanzhang/characters.json src/content/scenario-packs/zhuyuanzhang/historical-characters.json src/content/scenario-packs/zhuyuanzhang/city-npc-pools.json src/content/scenario-packs/zhuyuanzhang/maps.json src/content/scenario-packs/zhuyuanzhang/text-entries.json
git commit -m "refactor: migrate prototype and historical text into pack data"
```

## Task 7: Add Regression Guards So Text Does Not Drift Back into Code

**Files:**
- Create: `tests/hardcoded-text-guard.test.cjs`
- Modify: `package.json`

- [ ] **Step 1: Add a scan-based regression test for forbidden locations**

Test should fail if scenario-authored Chinese prose remains in:

```txt
src/main.ts
src/application/story/
src/application/house-modules/
src/application/grain-shop/
```

- [ ] **Step 2: Whitelist allowed exceptions**

Allowed examples:
- generic engine errors
- `MISSING_TEXT:*` sentinels
- pure UI text outside the audited directories

- [ ] **Step 3: Add an executable scan in the test**

Expected assertion shape:

```js
expect(forbiddenMatches).toEqual([]);
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm test
```

Expected:
- test passes only when audited directories contain no scenario-owned hardcoded prose

- [ ] **Step 5: Commit**

```bash
git add tests/hardcoded-text-guard.test.cjs package.json
git commit -m "test: guard against scenario text drifting back into code"
```

## Execution Order

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5
6. Task 6
7. Task 7

## Success Criteria

- `src/main.ts` no longer contains zhuyuanzhang-specific mission/review/chapter fallback prose.
- `src/application/story/story-callbacks.ts` no longer owns scenario-facing fallback prose.
- review and house dialogue text is resolved from pack-owned ids rather than inline arrays.
- pack-owned playable text lives in scenario-pack JSON rather than TS constants.
- runtime still boots with `zhuyuanzhang` as default pack.
- `npm run typecheck` and `npm test` pass.

## Risks and Controls

- **Risk:** encoded or garbled JSON text gets committed.
  **Control:** open edited JSON in UTF-8-aware tooling and validate before commit.
- **Risk:** text id sprawl becomes unmanageable.
  **Control:** enforce prefix families by subsystem.
- **Risk:** structured content gets flattened into one giant text table.
  **Control:** only use `text-entries.json` for prose; keep domain fields in their owning tables.
- **Risk:** UI copy work gets mixed into scenario-content migration.
  **Control:** keep `src/ui/**` out of this plan except for manual spot-checking.
