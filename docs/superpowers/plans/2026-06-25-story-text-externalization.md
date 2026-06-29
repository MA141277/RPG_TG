# Story Text Externalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Externalize story scene text into JSON-backed text catalogs while keeping the current scene runtime and UI behavior stable.

**Architecture:** Add a small text catalog to content packs and active game content, extend scene/action rendering to resolve `textId` with `text` fallback, then migrate one existing story source from inline strings to catalog entries. Keep runtime contracts backward-compatible so existing content keeps working.

**Tech Stack:** TypeScript, Vite, Node test runner, existing content-pack loader/runtime pipeline.

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

### Task 1: Add failing tests for text catalog support

**Files:**
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\tests\robustness.test.cjs`

- [ ] **Step 1: Write the failing test for active content text catalogs**

```js
test("active game content indexes pack text entries by id", () => {
  const { createActiveGameContent } = require("../.test-dist/application/content/active-game-content.js");

  const content = createActiveGameContent({
    schemaVersion: 1,
    id: "pack.test.text",
    title: "Text pack",
    textEntries: {
      "scene.test.line.001": "第一句台词",
      "scene.test.choice.001": "接受"
    },
    scenes: [],
    events: [],
    characters: [],
    cities: [],
    houses: [],
    maps: [],
    cityEntries: [],
    activities: [],
    cards: [],
    valuables: []
  });

  assert.equal(content.textEntriesById["scene.test.line.001"], "第一句台词");
  assert.equal(content.textEntriesById["scene.test.choice.001"], "接受");
});
```

- [ ] **Step 2: Write the failing test for scene rendering with `textId`**

```js
test("scene view resolves narration, dialogue, and choice text through text ids", () => {
  const { renderSceneView } = require("../.test-dist/ui/views/scene/scene-view.js");

  const html = renderSceneView({
    currentAction: {
      type: "choice",
      promptTextId: "scene.test.prompt",
      options: [
        { id: "yes", labelTextId: "scene.test.choice.yes" },
        { id: "no", labelTextId: "scene.test.choice.no" }
      ]
    },
    activitySession: null,
    characterDefinitions: [],
    choiceOptions: [
      { id: "yes", labelTextId: "scene.test.choice.yes" },
      { id: "no", labelTextId: "scene.test.choice.no" }
    ],
    resolveText: (textId) => ({
      "scene.test.prompt": "你要如何回应？",
      "scene.test.choice.yes": "接受",
      "scene.test.choice.no": "拒绝"
    }[textId] ?? textId)
  });

  assert.match(html, /你要如何回应/);
  assert.match(html, /接受/);
  assert.match(html, /拒绝/);
});
```

- [ ] **Step 3: Run the targeted test command and verify failure**

Run: `npm test -- --test-name-pattern "text"`

Expected: FAIL because `textEntriesById`, `promptTextId`, `labelTextId`, and `resolveText` support do not exist yet.

### Task 2: Implement text catalog support in content and scene rendering

**Files:**
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\domain\content-pack.ts`
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\domain\action.ts`
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\application\content\active-game-content.ts`
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\application\scenario\scenario-pack-loader.ts`
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\ui\views\scene\scene-view.ts`

- [ ] **Step 1: Extend content-pack and action types with optional text-id fields**

```ts
export type ContentPackDefinition = {
  // existing fields...
  textEntries?: Record<string, string>;
};

export type ChoiceOption = {
  id: ChoiceId;
  label?: string;
  labelTextId?: string;
  // existing fields...
};

export type ActionNode =
  | {
      type: "narration";
      text?: string;
      textId?: string;
    }
  | {
      type: "dialogue";
      // existing fields...
      text?: string;
      textId?: string;
    }
  | {
      type: "choice";
      prompt?: string;
      promptTextId?: string;
      options: ChoiceOption[];
    };
```

- [ ] **Step 2: Index text entries in active game content and preserve override semantics**

```ts
export type ActiveGameContent = {
  // existing fields...
  textEntriesById: Record<string, string>;
};

return {
  // existing fields...
  textEntriesById: { ...(resolvedPack.textEntries ?? {}) },
};
```

- [ ] **Step 3: Parse optional `textEntries` in scenario-pack loader**

```ts
if (value.textEntries != null) {
  assertObject(value.textEntries, "scenario text entries");
}
```

- [ ] **Step 4: Teach scene rendering to resolve text ids with fallback strings**

```ts
type SceneViewInput = {
  // existing fields...
  resolveText?: (textId: string) => string;
};

function resolveOptionalText(
  inlineText: string | undefined,
  textId: string | undefined,
  resolveText: ((textId: string) => string) | undefined,
  fallback = ""
): string {
  if (textId != null && resolveText != null) {
    return resolveText(textId);
  }
  return inlineText ?? fallback;
}
```

- [ ] **Step 5: Run targeted tests and verify green**

Run: `npm test -- --test-name-pattern "text"`

Expected: PASS for the newly added text-catalog tests.

### Task 3: Migrate the Zhu Yuanzhang main-story scene text to JSON-backed entries

**Files:**
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\content\story\zhu-yuanzhang-main-story.ts`
- Modify: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\content\scenario-packs\zhuyuanzhang\pack.json`
- Create: `C:\Users\Administrator\Desktop\workspace\project\RPG_TG\src\content\scenario-packs\zhuyuanzhang\text-entries.json`

- [ ] **Step 1: Create a dedicated story text JSON file with stable ids**

```json
{
  "scene.story.zhu_yuanzhang.ordination.narration.001": "……",
  "scene.story.zhu_yuanzhang.ordination.dialogue.001": "……"
}
```

- [ ] **Step 2: Update the scenario-pack manifest to include `textEntries`**

```json
{
  "schemaVersion": 1,
  "id": "scenario.zhuyuanzhang",
  "title": "朱元璋开局",
  "files": {
    "scenarioProfile": "scenario-profile.json",
    "characters": "characters.json",
    "events": "events.json",
    "scenes": "scenes.json",
    "textEntries": "text-entries.json"
  }
}
```

- [ ] **Step 3: Replace inline scene strings with `textId` references in the TypeScript source that still feeds runtime**

```ts
{
  type: "narration",
  textId: "scene.story.zhu_yuanzhang.ordination.narration.001"
}
```

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test
npm run typecheck
```

Expected: PASS for both commands.
