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
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
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
  assert.equal(result.pauseScene, true);
});

test("story chapter title overlay renderer emits the shared overlay hook and copy without a dismiss button", () => {
  const markup = renderStoryChapterTitleOverlay("第二章 濠州从戎");

  assert.match(markup, /data-story-chapter-title-overlay/);
  assert.match(markup, /第二章 濠州从戎/);
  assert.doesNotMatch(markup, /dismiss-story-chapter-title/);
});

test("main keeps chapter title clear logic generic instead of hardcoding the new title copy", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /clearStoryChapterTitle/);
  assert.doesNotMatch(source, /第二章 濠州从戎/);
  assert.doesNotMatch(source, /story\.show-chapter-title/);
});
