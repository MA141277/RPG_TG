# Zhu Yuanzhang Grain Procurement Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe Zhu Yuanzhang's week-2 temple unlock from generic alms travel into an explicit 500-wen grain-procurement errand, fire a first-foreign-city uprising broadcast on `bg.story.qiyi`, gate Haozhou grain purchase behind that broadcast, and preserve the existing return-to-Haozhou callback chain.

**Architecture:** Keep the change content-driven wherever possible. Story trigger shape, scene copy, reward settlement, and return framing stay in the `zhuyuanzhang` scenario-pack JSON and mirrored script-editor builtin template JSON. Runtime code changes stay limited to the existing background resolver plus the existing Zhu Yuanzhang grain-shortage helper boundary so `src/main.ts` does not gain new story or grain-shop business branches.

**Tech Stack:** TypeScript, scenario-pack JSON content, script-editor builtin-template JSON, Node `node:test` contract tests, `npm run build:test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-31`
- Current Focus: `Plan authored from the approved grain-procurement bridge spec; implementation has not started.`
- Next Step: `Choose execution mode, then open docs/superpowers/project-progress.md before promoting this plan into active work.`
- Verification: `Not run as part of this plan-authoring batch`
- Notes: `Current canonical project-progress entry still points at an older completed-but-open child; this plan is drafted and ready, but not yet the active governance owner.`

## Progress Log

- 2026-07-31
  - Summary: `Created the implementation plan for the Zhu Yuanzhang grain-procurement bridge from the approved spec.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Run npm run lint:plans, then choose Subagent-Driven or Inline execution before implementation starts.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-31-zhu-yuanzhang-grain-procurement-bridge-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `scope-narrowed`
- Notes:
  - `The runtime already has a Haozhou grain-shop sold-out path and a Zhu Yuanzhang begging-journey shortage helper. This child should tighten that existing helper behind a new story flag instead of inventing a second shortage mechanism.`
  - `The runtime already supports modify-character-stat and can mutate player gold through scene effects, so the 500-wen grant does not require a new effect type.`
  - `The script-editor builtin template still mirrors the same story content family, so pack JSON changes must be synchronized there to avoid template drift.`

## Global Constraints

- `Do not add new Zhu Yuanzhang-specific story or grain-shop business branches to src/main.ts.`
- `Keep persistent story progression in unified game state / runtime structures; no ad hoc globals.`
- `Use the existing begging-journey stage key unless implementation review proves a safe broad rename.`
- `Use background resource id bg.story.qiyi backed by ui/cg/qiyi.png.`
- `World-event broadcast must fire on city-enter for the first non-Haozhou city reached after the grain errand begins.`
- `Haozhou grain-shop lock must stay in existing grain-shop or Zhu Yuanzhang helper ownership, not in shell wiring.`
- `Follow TDD: every production change starts from a failing targeted test.`

## Implementation Scope

### In Scope

- Rewriting `first_temple_review`, `unlock_begging`, `runing_broadcast`, and the return-framing copy in the live `zhuyuanzhang` scenario pack.
- Adding the `bg.story.qiyi` dialogue background mapping.
- Granting 500 gold and updating the week-2 mission label through scene effects.
- Introducing a dedicated story flag so the Haozhou grain-shop shortage only activates after the uprising broadcast has fired.
- Synchronizing the mirrored script-editor builtin template story content and recording the feature update in `docs/change-log.md`.

### Still Out Of Scope

- A brand-new procurement task framework.
- Replacing the temple grain submission loop with a different delivery mechanic.
- Renaming the broad `huangjue-begging-journey` stage across all temple, story, and shop runtime owners.
- Converting the world-event line `繁荣度-2` into an actual city-prosperity numeric mutation.

## File Map

### Existing files to modify

- `src/content/scenario-packs/zhuyuanzhang/events.json`
  - Rewire `event.story.zhu_yuanzhang.runing_broadcast` from fixed `city.runing` scope to the first non-Haozhou city-enter trigger.
- `src/content/scenario-packs/zhuyuanzhang/scenes.json`
  - Update the review/unlock/world-event scenes and preserve the existing Haozhou return callback chain.
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
  - Update the affected story copy and mission-facing labels.
- `src/domain/zhu-yuanzhang-story.ts`
  - Add a dedicated broadcasted-shortage flag and tighten `isHaozhouShortageDuringBeggingJourney()`.
- `src/ui/location-backgrounds.ts`
  - Register `bg.story.qiyi` to resolve `ui/cg/qiyi.png` for scene preview/runtime rendering.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json`
  - Mirror the live story scene structure changes in builtin authoring content.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json`
  - Mirror the live story text changes in builtin authoring content.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json`
  - Mirror any renamed story event labels in builtin authoring content.
- `tests/story-special-item-opening.test.cjs`
  - Extend story-pack contract coverage for the new grain-procurement flow.
- `tests/robustness.test.cjs`
  - Extend the existing grain-shop sold-out / shortage regression to prove the new post-broadcast gate.
- `docs/change-log.md`
  - Record the feature-level story and grain-shop behavior change after implementation is verified.

### Existing files expected to be deleted

- `none`

### New files to create

- `docs/superpowers/plans/2026-07-31-zhu-yuanzhang-grain-procurement-bridge-plan.md`
  - Executable plan for this slice.

## Verification Plan

- Targeted verification:
  - `node --test tests/story-special-item-opening.test.cjs --test-name-pattern "grain procurement|runing broadcast|qiyi|temple review|unlock_begging"`
  - `node --test tests/robustness.test.cjs --test-name-pattern "grain shop sold out|Haozhou shortage"`
- Required commands:
  - `npm run build:test`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`

## Task 1: Rewire The World-Event Broadcast And Qiyi Background

**Files:**
- Modify: `tests/story-special-item-opening.test.cjs`
- Modify: `src/content/scenario-packs/zhuyuanzhang/events.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenes.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Modify: `src/ui/location-backgrounds.ts`

**Interfaces:**
- Consumes: `resolveDialogueBackgroundPreviewImageUrl(backgroundId: string | null | undefined): string | null`
- Produces: `event.story.zhu_yuanzhang.runing_broadcast` as a once-only `city-enter` event with no fixed `cityId` scope, a negative `city.kulan` location guard, and a scene using `backgroundId: "bg.story.qiyi"`

- [ ] **Step 1: Write the failing test**

Add these assertions to `tests/story-special-item-opening.test.cjs`:

```js
test("grain procurement world event uses qiyi background and triggers outside Haozhou", () => {
  const events = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/events.json", "utf8")
  );
  const scenes = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/scenes.json", "utf8")
  );
  const texts = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/text-entries.json", "utf8")
  );
  const backgroundSource = fs.readFileSync("src/ui/location-backgrounds.ts", "utf8");

  const worldEvent = events.find(
    (event) => event.id === "event.story.zhu_yuanzhang.runing_broadcast"
  );
  const scene = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.runing_broadcast"
  );

  assert.equal(worldEvent?.trigger?.timing, "city-enter");
  assert.equal(worldEvent?.trigger?.scope?.cityId, undefined);
  assert.equal(
    worldEvent?.conditions?.some(
      (condition) =>
        condition.type === "group" &&
        condition.operator === "not" &&
        condition.conditions?.[0]?.type === "location" &&
        condition.conditions?.[0]?.cityId === "city.kulan"
    ),
    true
  );
  assert.equal(scene?.actions?.[0]?.type, "background");
  assert.equal(scene?.actions?.[0]?.backgroundId, "bg.story.qiyi");
  assert.equal(
    texts["scene.story.zhu_yuanzhang.runing_broadcast.001"],
    "世界事件：濠州爆发红巾起义。繁荣度-2"
  );
  assert.equal(
    texts["scene.story.zhu_yuanzhang.runing_broadcast.002"],
    "不知寺内情况如何，买了粮食就回去吧。"
  );
  assert.match(backgroundSource, /bg\\.story\\.qiyi/);
  assert.match(backgroundSource, /ui\\/cg\\/qiyi\\.png\\?url/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/story-special-item-opening.test.cjs --test-name-pattern "grain procurement world event uses qiyi background and triggers outside Haozhou"
```

Expected:

- `FAIL`
- missing `bg.story.qiyi`
- `event.story.zhu_yuanzhang.runing_broadcast` still scoped to `city.runing`

- [ ] **Step 3: Write minimal implementation**

Update `src/content/scenario-packs/zhuyuanzhang/events.json` so the world-event entry looks like:

```json
{
  "id": "event.story.zhu_yuanzhang.runing_broadcast",
  "chapterId": "chapter.zhu-yuanzhang-rise",
  "name": "外路闻变",
  "occurrence": "once",
  "trigger": {
    "timing": "city-enter",
    "priority": 160
  },
  "conditions": [
    {
      "type": "flag",
      "key": "flag.story.zhu_yuanzhang.begging_unlocked",
      "expected": true
    },
    {
      "type": "variable",
      "key": "var.story.zhu_yuanzhang.stage",
      "operator": "==",
      "value": "huangjue-begging-journey"
    },
    {
      "type": "group",
      "operator": "not",
      "conditions": [
        {
          "type": "location",
          "cityId": "city.kulan"
        }
      ]
    }
  ],
  "entrySceneId": "scene.story.zhu_yuanzhang.runing_broadcast",
  "tags": ["main-story", "city-enter", "world-event"]
}
```

Update `src/content/scenario-packs/zhuyuanzhang/scenes.json` so the scene starts with a background and two narration nodes:

```json
{
  "id": "scene.story.zhu_yuanzhang.runing_broadcast",
  "name": "外路闻变",
  "actions": [
    { "type": "background", "backgroundId": "bg.story.qiyi" },
    { "type": "narration", "textId": "scene.story.zhu_yuanzhang.runing_broadcast.001" },
    { "type": "narration", "textId": "scene.story.zhu_yuanzhang.runing_broadcast.002" }
  ]
}
```

Update `src/ui/location-backgrounds.ts` like this:

```ts
import storyBackgroundQiyiUrl from "../../ui/cg/qiyi.png?url";

const DIALOGUE_BACKGROUND_PREVIEW_IMAGE_URLS: Record<string, string> = {
  "bg.temple.courtyard": buildingBackgroundTempleUrl,
  "bg.temple.hall": buildingBackgroundTempleUrl,
  "bg.pei_county.office": buildingBackgroundJiangshuaizhaidiUrl,
  "bg.story.qiyi": storyBackgroundQiyiUrl,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/story-special-item-opening.test.cjs --test-name-pattern "grain procurement world event uses qiyi background and triggers outside Haozhou"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/story-special-item-opening.test.cjs src/content/scenario-packs/zhuyuanzhang/events.json src/content/scenario-packs/zhuyuanzhang/scenes.json src/content/scenario-packs/zhuyuanzhang/text-entries.json src/ui/location-backgrounds.ts
git commit -m "feat: rewire zhu yuanzhang uprising broadcast"
```

## Task 2: Rewrite The Temple Review And Grain-Errand Unlock Copy

**Files:**
- Modify: `tests/story-special-item-opening.test.cjs`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenes.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`

**Interfaces:**
- Consumes: scene effect `{ type: "modify-character-stat"; characterId: "char.player"; stat: "gold"; delta: 500 }`
- Produces: updated `scene.story.zhu_yuanzhang.first_temple_review` and `scene.story.zhu_yuanzhang.unlock_begging` text, plus unlock settlement that grants 500 gold and sets `ui.mainHouseMissionText` to `前往附近城市买粮`

- [ ] **Step 1: Write the failing test**

Add these assertions to `tests/story-special-item-opening.test.cjs`:

```js
test("temple review and unlock scenes now frame the grain errand explicitly", () => {
  const scenes = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/scenes.json", "utf8")
  );
  const texts = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/text-entries.json", "utf8")
  );
  const firstReview = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.first_temple_review"
  );
  const unlock = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.unlock_begging"
  );
  const unlockEffects =
    unlock?.actions?.find((action) => action.type === "effect")?.effects ?? [];

  assert.equal(
    texts["scene.story.zhu_yuanzhang.first_temple_review.001"],
    "往后这段时日，寺里的方针以保全自身为主。"
  );
  assert.equal(
    texts["scene.story.zhu_yuanzhang.first_temple_review.002"],
    "你初来乍到，外面也兵荒马乱，姑且在寺内帮忙吧。"
  );
  assert.equal(
    texts["scene.story.zhu_yuanzhang.unlock_begging.002"],
    "这是500文。濠州近日断粮，你去附近的城市买些粮带回来吧，尽量多买，也好施舍。"
  );
  assert.equal(
    unlockEffects.some(
      (effect) =>
        effect.type === "modify-character-stat" &&
        effect.characterId === "char.player" &&
        effect.stat === "gold" &&
        effect.delta === 500
    ),
    true
  );
  assert.equal(
    unlockEffects.some(
      (effect) =>
        effect.type === "set-main-mission-text" &&
        effect.text === "前往附近城市买粮"
    ),
    true
  );
  assert.equal(firstReview?.actions?.length > 0, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/story-special-item-opening.test.cjs --test-name-pattern "temple review and unlock scenes now frame the grain errand explicitly"
```

Expected:

- `FAIL`
- old review/unlock copy is still present
- unlock effects do not yet grant 500 gold or set the new mission text

- [ ] **Step 3: Write minimal implementation**

Update `src/content/scenario-packs/zhuyuanzhang/text-entries.json`:

```json
"scene.story.zhu_yuanzhang.first_temple_review.001": "往后这段时日，寺里的方针以保全自身为主。",
"scene.story.zhu_yuanzhang.first_temple_review.002": "你初来乍到，外面也兵荒马乱，姑且在寺内帮忙吧。",
"scene.story.zhu_yuanzhang.unlock_begging.001": "你这一个月来倒算踏实，杂活虽苦，竟也都做下来了。",
"scene.story.zhu_yuanzhang.unlock_begging.002": "这是500文。濠州近日断粮，你去附近的城市买些粮带回来吧，尽量多买，也好施舍。"
```

Update the unlock effect block in `src/content/scenario-packs/zhuyuanzhang/scenes.json`:

```json
{
  "type": "effect",
  "effects": [
    { "type": "set-variable", "key": "var.story.zhu_yuanzhang.temple_week", "value": 2 },
    { "type": "set-flag", "key": "flag.story.zhu_yuanzhang.begging_unlocked", "value": true },
    { "type": "modify-character-stat", "characterId": "char.player", "stat": "gold", "delta": 500 },
    { "type": "set-main-mission-text", "text": "前往附近城市买粮" }
  ]
}
```

Also adjust the first return-facing lines in `src/content/scenario-packs/zhuyuanzhang/text-entries.json`:

```json
"scene.story.zhu_yuanzhang.haozhou_return_encounter.001": "你自外地买粮折返，布袋里压着几把零碎米粮。离濠州尚有一程时，路旁枯林里忽然窜出数名持棍短刃的盗伙，见你背袋鼓起，便喝骂着扑了上来。",
"scene.story.zhu_yuanzhang.haozhou_return_encounter.005": "我自外地买粮回来，只想入城换口热汤，再寻处歇脚。袋里不过几把米，没替谁探什么路。"
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/story-special-item-opening.test.cjs --test-name-pattern "temple review and unlock scenes now frame the grain errand explicitly"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/story-special-item-opening.test.cjs src/content/scenario-packs/zhuyuanzhang/scenes.json src/content/scenario-packs/zhuyuanzhang/text-entries.json
git commit -m "feat: turn temple unlock into grain errand"
```

## Task 3: Gate Haozhou Grain Shortage Behind The Uprising Broadcast

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/domain/zhu-yuanzhang-story.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenes.json`

**Interfaces:**
- Consumes: `isHaozhouShortageDuringBeggingJourney(state: GameState): boolean`
- Produces: `flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted` and helper logic that returns `true` only when the player is in `city.kulan`, is in `huangjue-begging-journey`, and the world-event flag has already been set by the broadcast scene

- [ ] **Step 1: Write the failing test**

Update the sold-out regression in `tests/robustness.test.cjs` to require the new flag:

```js
test("Haozhou grain shop shortage only blocks buying after the uprising broadcast flag is set", () => {
  const soldOutEntries = {
    "runtime.zhu_yuanzhang.grain_shop.sold_out.title": "自定义今日无米可买",
    "runtime.zhu_yuanzhang.grain_shop.sold_out.001": "自定义濠州断粮。",
    "runtime.zhu_yuanzhang.grain_shop.sold_out.002": "自定义去外地碰碰运气。",
  };
  const baseRuntime = {
    ...createBaseState().runtime,
    variables: {
      ...createBaseState().runtime.variables,
      [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
        ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
    },
  };
  const beforeFlagEnter = grainShopHouseModule.enter({
    gameState: { ...createBaseState(), runtime: baseRuntime },
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    textEntriesById: soldOutEntries,
  });
  const beforeFlagBuy = grainShopHouseModule.dispatch({
    gameState: beforeFlagEnter.gameState,
    characterDefinitions: beforeFlagEnter.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: beforeFlagEnter.sessionState,
    request: { type: "action", actionId: "buy" },
    textEntriesById: soldOutEntries,
  });

  assert.notEqual(beforeFlagBuy.sessionState?.overlay?.title, "自定义今日无米可买");

  const afterFlagEnter = grainShopHouseModule.enter({
    gameState: {
      ...createBaseState(),
      runtime: {
        ...baseRuntime,
        flags: {
          ...createBaseState().runtime.flags,
          "flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted": true,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    textEntriesById: soldOutEntries,
  });
  const afterFlagBuy = grainShopHouseModule.dispatch({
    gameState: afterFlagEnter.gameState,
    characterDefinitions: afterFlagEnter.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: afterFlagEnter.sessionState,
    request: { type: "action", actionId: "buy" },
    textEntriesById: soldOutEntries,
  });

  assert.equal(afterFlagBuy.sessionState?.overlay?.title, "自定义今日无米可买");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "Haozhou grain shop shortage only blocks buying after the uprising broadcast flag is set"
```

Expected:

- `FAIL`
- buy is already blocked before the new flag is present

- [ ] **Step 3: Write minimal implementation**

Add the new flag key in `src/domain/zhu-yuanzhang-story.ts`:

```ts
haozhouUprisingBroadcasted:
  "flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted",
```

Tighten `isHaozhouShortageDuringBeggingJourney()`:

```ts
export function isHaozhouShortageDuringBeggingJourney(
  state: GameState
): boolean {
  return (
    isZhuYuanzhangBeggingJourneyStage(state) &&
    state.world.currentCityId === "city.kulan" &&
    state.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.haozhouUprisingBroadcasted
    ] === true
  );
}
```

Append a flag-set effect to the world-event scene in `src/content/scenario-packs/zhuyuanzhang/scenes.json`:

```json
{
  "type": "effect",
  "effects": [
    {
      "type": "set-flag",
      "key": "flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted",
      "value": true
    }
  ]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "Haozhou grain shop shortage only blocks buying after the uprising broadcast flag is set"
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/robustness.test.cjs src/domain/zhu-yuanzhang-story.ts src/content/scenario-packs/zhuyuanzhang/scenes.json
git commit -m "fix: gate haozhou grain shortage behind uprising broadcast"
```

## Task 4: Sync Builtin Templates And Record The Change

**Files:**
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes: live pack story ids `scene.story.zhu_yuanzhang.first_temple_review`, `scene.story.zhu_yuanzhang.unlock_begging`, `scene.story.zhu_yuanzhang.runing_broadcast`, `event.story.zhu_yuanzhang.runing_broadcast`
- Produces: builtin-template authoring content that matches live pack story semantics plus a durable change-log entry for the bridge slice

- [ ] **Step 1: Write the failing test**

Add this mirror assertion to `tests/story-special-item-opening.test.cjs`:

```js
test("builtin template mirrors the live grain procurement bridge story copy", () => {
  const liveTexts = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/text-entries.json", "utf8")
  );
  const builtinTexts = JSON.parse(
    fs.readFileSync("src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json", "utf8")
  );
  const builtinDialogues = JSON.parse(
    fs.readFileSync("src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json", "utf8")
  );
  const builtinEvents = JSON.parse(
    fs.readFileSync("src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json", "utf8")
  );

  assert.equal(
    builtinTexts["scene.story.zhu_yuanzhang.unlock_begging.002"],
    liveTexts["scene.story.zhu_yuanzhang.unlock_begging.002"]
  );
  assert.equal(
    builtinTexts["scene.story.zhu_yuanzhang.runing_broadcast.001"],
    liveTexts["scene.story.zhu_yuanzhang.runing_broadcast.001"]
  );
  assert.equal(
    builtinDialogues.some(
      (entry) => entry.id === "scene.story.zhu_yuanzhang.runing_broadcast"
    ),
    true
  );
  assert.equal(
    builtinEvents.some(
      (entry) =>
        entry.id === "event.story.zhu_yuanzhang.runing_broadcast" &&
        entry.name === "外路闻变"
    ),
    true
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/story-special-item-opening.test.cjs --test-name-pattern "builtin template mirrors the live grain procurement bridge story copy"
```

Expected:

- `FAIL`
- builtin-template text or event labels still reflect the old story state

- [ ] **Step 3: Write minimal implementation**

Mirror the live content updates into the builtin-template files:

```json
// src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json
"scene.story.zhu_yuanzhang.first_temple_review.001": "往后这段时日，寺里的方针以保全自身为主。",
"scene.story.zhu_yuanzhang.first_temple_review.002": "你初来乍到，外面也兵荒马乱，姑且在寺内帮忙吧。",
"scene.story.zhu_yuanzhang.unlock_begging.002": "这是500文。濠州近日断粮，你去附近的城市买些粮带回来吧，尽量多买，也好施舍。",
"scene.story.zhu_yuanzhang.runing_broadcast.001": "世界事件：濠州爆发红巾起义。繁荣度-2",
"scene.story.zhu_yuanzhang.runing_broadcast.002": "不知寺内情况如何，买了粮食就回去吧。"
```

```json
// src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json
{
  "id": "event.story.zhu_yuanzhang.runing_broadcast",
  "name": "外路闻变"
}
```

```json
// src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json
{
  "id": "scene.story.zhu_yuanzhang.runing_broadcast",
  "nodes": [
    { "type": "background", "backgroundId": "bg.story.qiyi" },
    { "type": "narration", "textId": "scene.story.zhu_yuanzhang.runing_broadcast.001" },
    { "type": "narration", "textId": "scene.story.zhu_yuanzhang.runing_broadcast.002" },
    {
      "type": "effect",
      "effects": [
        {
          "type": "set-flag",
          "key": "flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted",
          "value": true
        }
      ]
    }
  ]
}
```

Append a change-log entry like:

```md
## 2026-07-31 Zhu Yuanzhang Grain Procurement Bridge

### Changed
- 朱元璋皇觉寺第二周主线从泛化“外出化缘”改成方丈发给 500 文、委托玩家去附近城市买粮回寺的明确差事。
- 首次进入外地城市后的主线播报现在改为 `bg.story.qiyi` 世界事件场景，并在此后才锁定濠州粮铺的断粮不可买状态。
- 返濠州的主线文案现在明确承接“外地买粮返城”而不是泛化化缘返程。

### Impact
- 本片复用既有 temple grain loop、grain-shop sold-out path 和 Haozhou return callback chain，没有把朱元璋专属逻辑加回 `src/main.ts`。
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/story-special-item-opening.test.cjs --test-name-pattern "builtin template mirrors the live grain procurement bridge story copy"
npm run lint:plans
```

Expected:

- first command: `PASS`
- second command: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json docs/change-log.md docs/superpowers/plans/2026-07-31-zhu-yuanzhang-grain-procurement-bridge-plan.md
git commit -m "docs: sync grain procurement bridge templates"
```

## Exit Check

- [ ] `The week-2 temple unlock now explicitly grants 500 wen and sends the player to buy grain from nearby cities.`
- [ ] `The first foreign-city broadcast uses bg.story.qiyi and cannot trigger in Haozhou.`
- [ ] `Haozhou grain purchase is blocked only after the uprising broadcast flag is active.`
- [ ] `The Haozhou return callback chain still remains intact.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
