# Zhu Yuanzhang Sundeya Victory Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the post-battle Zhu Yuanzhang / Guo Zixing / Sun Deya follow-up scene, a reusable scene-triggered chapter title card for `第二章 濠州从戎`, and the closing `感谢您的游玩` popup without hardcoding story business logic into `src/main.ts`.

**Architecture:** Keep the requested content in Zhu Yuanzhang story scene data, add a generic story-presentation runtime seam that stores a transient chapter-title request in runtime variables, and render that request through a shared UI overlay helper. Use only generic shell wiring for dismiss/clear behavior so the feature remains reusable for later story beats.

**Tech Stack:** TypeScript application/runtime code, JSON scenario-pack content, Node `node:test` regression suites, `pnpm run build:test`, `pnpm run typecheck`, `pnpm run build`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-31`
- Current Focus: `Implementation, changelog, and local verification are complete in the working tree; only optional commit/parent-progress sync remains if this child is promoted further.`
- Next Step: `Keep this child open unless the user requests commit/project-progress promotion.`
- Verification: `PASS - npm run build:test; node --test tests/interactive-runtime-status.test.cjs tests/story-chapter-title-overlay.test.cjs tests/story-battle-sundeya-rescue-source.test.cjs; npm run typecheck; npm run build`
- Notes: `Current docs/superpowers/project-progress.md still points at docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md as the canonical owner, so this child remains running instead of closed.`

## Progress Log

- 2026-07-31
  - Summary: `Created the implementation plan for the Sundeya rescue victory follow-up, including the reusable chapter-title overlay seam and the requested end-of-demo popup.`
  - Verification: `Not run as part of this plan-only change`
  - Next: `Choose execution mode, then start Task 1 Step 1.`
- 2026-07-31
  - Summary: `Completed the reusable chapter-title overlay seam, appended the post-battle Guo Zixing / Sun Deya / Zhu Yuanzhang follow-up, switched the player to the red-turban portrait variant after joining Guo Zixing, and added the closing thank-you popup plus changelog entry.`
  - Verification: `PASS - npm run build:test; node --test tests/interactive-runtime-status.test.cjs tests/story-chapter-title-overlay.test.cjs tests/story-battle-sundeya-rescue-source.test.cjs; npm run typecheck; npm run build`
  - Next: `Keep the child open unless commit/project-progress sync is explicitly requested.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-31-zhu-yuanzhang-sundeya-victory-followup-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The spec assumes a reusable chapter-title callback path; the current repository still keeps chapter intro presentation in src/main.ts only.`
  - `The canonical project-progress entry is currently owned by a different child plan, so this plan starts in waiting state until execution mode and governance handling are explicit.`

## Global Constraints

- Keep the implementation inside the existing story scene/runtime contract instead of adding story-specific shell logic in `src/main.ts`.
- Do not change battle runtime result rules.
- Do not move the existing initial map chapter-intro overlay out of `src/main.ts` in this batch.
- Do not add a generic new scene action type in this batch.
- Keep the Zhu Yuanzhang line as a normal `dialogue` action for `char.player`.
- Use the existing scene `reward` action node for the thank-you popup.

## Implementation Scope

### In Scope

- Reusable story callback + runtime variable seam for a scene-triggered chapter title card.
- Shared UI overlay rendering for the chapter title request.
- Generic clear/dismiss wiring for the chapter title request.
- Post-battle content updates for `scene.story.zhu_yuanzhang.haozhou_return_encounter`.
- Closing popup copy for `感谢您的游玩，请关注 funloom 了解游戏最新进展。`
- Change-log entry for the new story beat.

### Still Out Of Scope

- Refactoring the existing map-opening chapter intro implementation.
- Reworking story battle completion semantics.
- Adding credits navigation, main-menu return, or a generic endgame flow.

## File Map

### Existing files to modify

- `src/application/story/story-callbacks.ts`
  - Add the generic `story.show-chapter-title` callback path.
- `src/application/presenter/presenter-output.ts`
  - Expose chapter-title overlay text to rendering.
- `src/application/app-shell.ts`
  - Add app-level overlay state if a local transient field is needed for chapter-title lifecycle.
- `src/domain/game-state.ts`
  - Add or document the runtime-backed presentation state carrier if needed by the presenter.
- `src/ui/app-render.ts`
  - Render the chapter-title overlay alongside existing global overlays.
- `src/main.ts`
  - Only if needed for generic shell wiring: clear or dismiss the active chapter-title request without adding Zhu-specific branches.
- `src/content/story/zhu-yuanzhang-main-story.ts`
  - Append the requested post-battle dialogue / title callback / reward nodes.
- `src/content/scenario-packs/zhuyuanzhang/scenes.json`
  - Keep the authored pack scene in sync with the runtime story content.
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
  - Add the new follow-up lines and popup copy.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json`
  - Keep the builtin template aligned with the story scene structure.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json`
  - Keep the builtin template text entries aligned.
- `tests/story-battle-sundeya-rescue-source.test.cjs`
  - Lock the requested follow-up scene order and copy.
- `tests/interactive-runtime-status.test.cjs`
  - Add callback/runtime assertions if that is the lightest existing fit.
- `tests/robustness.test.cjs`
  - Extend only if a broader UI/source guard is needed by existing contract coverage.
- `docs/change-log.md`
  - Record the new post-battle follow-up and chapter-title popup.

### New files to create

- `src/domain/story-presentation.ts`
  - Shared keys/helpers for reusable story-presentation runtime variables.
- `src/ui/views/story/story-chapter-title-overlay.ts`
  - Focused renderer for the chapter-title overlay markup.
- `tests/story-chapter-title-overlay.test.cjs`
  - Targeted callback/render/source contract tests for the new reusable overlay seam.

## Verification Plan

- Targeted verification:
  - `pnpm run build:test`
  - `node --test tests/story-chapter-title-overlay.test.cjs tests/story-battle-sundeya-rescue-source.test.cjs tests/interactive-runtime-status.test.cjs`
- Required commands:
  - `pnpm run typecheck`
  - `pnpm run build`
- Optional broader regression if touched files require it:
  - `node --test --test-name-pattern "sundeya|chapter title|story battle playable runtime mirrors legacy interactive result as follow-up" tests/robustness.test.cjs`

## Task 1: Add The Reusable Chapter-Title Overlay Seam

**Files:**
- Create: `src/domain/story-presentation.ts`
- Create: `src/ui/views/story/story-chapter-title-overlay.ts`
- Create: `tests/story-chapter-title-overlay.test.cjs`
- Modify: `src/application/story/story-callbacks.ts`
- Modify: `src/application/presenter/presenter-output.ts`
- Modify: `src/application/app-shell.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes:
  - `runStoryCallback(handlerId: string, payload: Record<string, unknown> | undefined, runtime: StoryCallbackRuntime): StoryCallbackRuntime`
  - `AppPresenterOverlayOutput`
- Produces:
  - `STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText: string`
  - `renderStoryChapterTitleOverlay(titleText: string): string`
  - `story.show-chapter-title` callback payload shape `{ titleText: string }`

- [x] **Step 1: Write the failing callback/render/source test**

Add `tests/story-chapter-title-overlay.test.cjs` with these assertions:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  runStoryCallback,
} = require("../.test-dist/application/story/story-callbacks.js");
const {
  STORY_PRESENTATION_VARIABLE_KEYS,
} = require("../.test-dist/domain/story-presentation.js");
const {
  renderStoryChapterTitleOverlay,
} = require("../.test-dist/ui/views/story/story-chapter-title-overlay.js");

test("story show chapter title callback writes the requested title text into runtime variables", () => {
  const state = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.keep",
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "",
    mainHouseMissionText: "",
    currentView: "scene",
  });

  const result = runStoryCallback(
    "story.show-chapter-title",
    { titleText: "第二章 濠州从戎" },
    { state, characterDefinitions: [] }
  );

  assert.equal(
    result.state.runtime.variables[STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText],
    "第二章 濠州从戎"
  );
});

test("story chapter title overlay renderer emits the shared overlay hook and copy", () => {
  const markup = renderStoryChapterTitleOverlay("第二章 濠州从戎");

  assert.match(markup, /data-story-chapter-title-overlay/);
  assert.match(markup, /第二章 濠州从戎/);
});

test("main keeps chapter title dismissal generic instead of hardcoding Zhu Yuanzhang story ids", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /dismiss-story-chapter-title|clearStoryChapterTitle/);
  assert.doesNotMatch(source, /第二章 濠州从戎/);
  assert.doesNotMatch(source, /story\.zhu_yuanzhang/);
});
```

- [x] **Step 2: Run the new test to verify it fails**

Run:

```bash
pnpm run build:test
node --test tests/story-chapter-title-overlay.test.cjs
```

Expected:

- `FAIL` because `../.test-dist/domain/story-presentation.js` does not exist yet and `story.show-chapter-title` is not handled.

- [x] **Step 3: Write the minimal implementation**

Add the runtime key helper:

```ts
export const STORY_PRESENTATION_VARIABLE_KEYS = {
  chapterTitleText: "var.story.presentation.chapter_title_text",
} as const;
```

Add the callback case:

```ts
case "story.show-chapter-title": {
  const titleText = readStringPayloadValue(payload, "titleText");
  if (titleText == null || titleText.length === 0) {
    return runtime;
  }

  return {
    state: {
      ...runtime.state,
      runtime: {
        ...runtime.state.runtime,
        variables: {
          ...runtime.state.runtime.variables,
          [STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText]: titleText,
        },
      },
    },
    characterDefinitions: runtime.characterDefinitions,
  };
}
```

Add the focused renderer:

```ts
export function renderStoryChapterTitleOverlay(titleText: string): string {
  return `
    <section class="c-story-chapter-title-overlay" data-story-chapter-title-overlay>
      <div class="c-story-chapter-title-overlay__backdrop"></div>
      <h2 class="c-story-chapter-title-overlay__title">${titleText}</h2>
      <button
        type="button"
        class="c-story-chapter-title-overlay__dismiss"
        data-action="dismiss-story-chapter-title"
      >
        继续
      </button>
    </section>
  `;
}
```

Expose the presenter overlay text and render it in `src/ui/app-render.ts`:

```ts
storyChapterTitleText:
  typeof input.appState.gameState.runtime.variables[
    STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText
  ] === "string"
    ? String(
        input.appState.gameState.runtime.variables[
          STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText
        ]
      )
    : ""
```

```ts
${input.presenterOutput.overlay.storyChapterTitleText.length === 0
  ? ""
  : renderStoryChapterTitleOverlay(
      input.presenterOutput.overlay.storyChapterTitleText
    )}
```

Keep `src/main.ts` generic by clearing only the shared variable key:

```ts
if (actionId === "dismiss-story-chapter-title") {
  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        variables: {
          ...appState.gameState.runtime.variables,
          [STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText]: "",
        },
      },
    },
  };
  renderAppState();
  return;
}
```

- [x] **Step 4: Run the targeted test to verify it passes**

Run:

```bash
pnpm run build:test
node --test tests/story-chapter-title-overlay.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/domain/story-presentation.ts src/application/story/story-callbacks.ts src/application/presenter/presenter-output.ts src/application/app-shell.ts src/ui/views/story/story-chapter-title-overlay.ts src/ui/app-render.ts src/main.ts tests/story-chapter-title-overlay.test.cjs
git commit -m "feat: add story chapter title overlay seam"
```

## Task 2: Append The Sundeya Rescue Follow-up Scene Content

**Files:**
- Modify: `src/content/story/zhu-yuanzhang-main-story.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenes.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json`
- Modify: `tests/story-battle-sundeya-rescue-source.test.cjs`

**Interfaces:**
- Consumes:
  - `scene.story.zhu_yuanzhang.haozhou_return_encounter`
  - `story.show-chapter-title` callback payload `{ titleText: string }`
- Produces:
  - New follow-up text ids `.016` through `.018`
  - One chapter-title callback action
  - One `reward` action with `感谢您的游玩`

- [x] **Step 1: Write the failing source/content regression**

Extend `tests/story-battle-sundeya-rescue-source.test.cjs` with a new assertion:

```js
test("sundeya rescue return scene appends the requested victory follow-up, chapter title, and thank-you popup", () => {
  const source = readSource("src/content/scenario-packs/zhuyuanzhang/scenes.json");
  const textEntries = readSource("src/content/scenario-packs/zhuyuanzhang/text-entries.json");

  assert.match(
    source,
    /"handlerId": "story\\.zhu_yuanzhang\\.start-sundeya-rescue-battle"[\s\S]*"textId": "scene\\.story\\.zhu_yuanzhang\\.haozhou_return_encounter\\.015"[\s\S]*"textId": "scene\\.story\\.zhu_yuanzhang\\.haozhou_return_encounter\\.016"[\s\S]*"textId": "scene\\.story\\.zhu_yuanzhang\\.haozhou_return_encounter\\.017"[\s\S]*"textId": "scene\\.story\\.zhu_yuanzhang\\.haozhou_return_encounter\\.018"[\s\S]*"handlerId": "story\\.show-chapter-title"[\s\S]*"title": "感谢您的游玩"/
  );
  assert.match(
    textEntries,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.016": "这次大家的表现都很英勇"/
  );
  assert.match(
    textEntries,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.017": "英勇个屁，我的弟兄们都快被元军砍成臊子了，你郭子兴的人才来"/
  );
  assert.match(
    textEntries,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.018": "看来城中义军将帅并非传闻啊"/
  );
});
```

- [x] **Step 2: Run the source test to verify it fails**

Run:

```bash
node --test tests/story-battle-sundeya-rescue-source.test.cjs
```

Expected:

- `FAIL` because the scene currently stops after `.015` and has no title callback or thank-you reward.

- [x] **Step 3: Write the minimal story/content updates**

Append these actions after the existing `.015` narration in `src/content/story/zhu-yuanzhang-main-story.ts`:

```ts
{
  type: "dialogue",
  characterId: "char.kulan_lord",
  side: "left",
  textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.016",
},
{
  type: "dialogue",
  characterId: "char.sun_deya",
  side: "right",
  textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.017",
},
{
  type: "dialogue",
  characterId: "char.player",
  side: "right",
  textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.018",
},
{
  type: "callback",
  handlerId: "story.show-chapter-title",
  payload: {
    titleText: "第二章 濠州从戎",
  },
},
{
  type: "reward",
  title: "感谢您的游玩",
  lines: ["请关注 funloom 了解游戏最新进展。"],
},
```

Mirror the same action order in:

- `src/content/scenario-packs/zhuyuanzhang/scenes.json`
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json`

Add these text entries to:

- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json`

```json
"scene.story.zhu_yuanzhang.haozhou_return_encounter.016": "这次大家的表现都很英勇",
"scene.story.zhu_yuanzhang.haozhou_return_encounter.017": "英勇个屁，我的弟兄们都快被元军砍成臊子了，你郭子兴的人才来",
"scene.story.zhu_yuanzhang.haozhou_return_encounter.018": "看来城中义军将帅并非传闻啊"
```

- [x] **Step 4: Run the targeted source/content tests to verify they pass**

Run:

```bash
pnpm run build:test
node --test tests/story-battle-sundeya-rescue-source.test.cjs tests/story-chapter-title-overlay.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/content/story/zhu-yuanzhang-main-story.ts src/content/scenario-packs/zhuyuanzhang/scenes.json src/content/scenario-packs/zhuyuanzhang/text-entries.json src/modules/script-editor/builtin-templates/zhuyuanzhang/dialogues.json src/modules/script-editor/builtin-templates/zhuyuanzhang/text-entries.json tests/story-battle-sundeya-rescue-source.test.cjs
git commit -m "feat: add sundeya rescue victory follow-up story"
```

## Task 3: Document And Verify The End-to-End Story Beat

**Files:**
- Modify: `tests/interactive-runtime-status.test.cjs`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes:
  - `story.show-chapter-title`
  - `scene.story.zhu_yuanzhang.haozhou_return_encounter`
- Produces:
  - Callback-level regression for the reusable title seam
  - Human-readable changelog entry for the new post-battle beat

- [x] **Step 1: Write the failing regression/doc assertions**

Extend `tests/interactive-runtime-status.test.cjs` with:

```js
test("story show chapter title callback leaves the story battle runtime untouched while only writing presentation state", () => {
  const state = createRuntimeState().core;

  const result = runStoryCallback(
    "story.show-chapter-title",
    { titleText: "第二章 濠州从戎" },
    {
      state,
      characterDefinitions: prototypeCharacters,
    }
  );

  assert.equal(result.state.storyBattle.session, null);
  assert.equal(
    result.state.runtime.variables["var.story.presentation.chapter_title_text"],
    "第二章 濠州从戎"
  );
});
```

Add a pending changelog line target in `docs/change-log.md` under the newest relevant batch.

- [ ] **Step 2: Run the regression to verify it fails before the implementation is complete**

Run:

```bash
pnpm run build:test
node --test tests/interactive-runtime-status.test.cjs
```

Expected:

- `FAIL` before Task 1 implementation is complete, then `PASS` once the callback seam exists.

- [x] **Step 3: Add the changelog entry and final regression update**

Add a concise changelog bullet such as:

```md
- 朱元璋“救援孙德崖”战斗胜利后新增郭子兴、孙德崖、朱元璋三句续接对白，并通过通用 story chapter-title 覆盖层接出“第二章 濠州从戎”；之后会弹出“感谢您的游玩，请关注 funloom 了解游戏最新进展。”结束弹窗。
```

Keep the callback regression from Step 1 green.

- [x] **Step 4: Run the full targeted verification set**

Run:

```bash
pnpm run build:test
node --test tests/story-chapter-title-overlay.test.cjs tests/story-battle-sundeya-rescue-source.test.cjs tests/interactive-runtime-status.test.cjs
pnpm run typecheck
pnpm run build
```

Expected:

- `PASS` on all three targeted test files
- `PASS` on `pnpm run typecheck`
- `PASS` on `pnpm run build`

- [ ] **Step 5: Commit**

```bash
git add tests/interactive-runtime-status.test.cjs docs/change-log.md
git commit -m "docs: record sundeya victory follow-up"
```

## Exit Check

- [x] The requested post-battle Guo Zixing / Sun Deya / Zhu Yuanzhang follow-up appears in the Zhu Yuanzhang return scene.
- [x] A reusable `story.show-chapter-title` seam exists and does not hardcode Zhu Yuanzhang copy into `src/main.ts`.
- [x] The scene ends with the requested thank-you popup using the existing `reward` action type.
- [x] Targeted verification is recorded.
- [ ] Project progress sync is updated if this child is promoted to running or completed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `2026-07-31-zhu-yuanzhang-sundeya-victory-followup-plan`
- Parent Task: `User-requested Zhu Yuanzhang story follow-up`
- Parent Stage: `Ad hoc story/runtime follow-up`
- Closeout Status: `closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `none`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then decide whether this ad hoc child should be synchronized into the canonical queue before closure.`
