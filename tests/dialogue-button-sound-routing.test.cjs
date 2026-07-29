const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("story dialogue advance surfaces no longer declare a page-turn button sound", () => {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/scene/scene-view.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    html,
    /data-scene-action="\$\{options\.advanceActionId\}" role="button" tabindex="0" data-button-sound=/
  );
  assert.match(
    html,
    /data-scene-action="\$\{options\.advanceActionId\}" role="button" tabindex="0" data-ui-click-sound="none"/
  );
});

test("house dialogue advance surfaces no longer declare a page-turn button sound", () => {
  const { renderHouseDialogue } = require("../.test-dist/ui/views/house/house-shared-view.js");

  const html = renderHouseDialogue({
    moduleId: "test-module",
    houseId: "house.test",
    sceneTitle: "测试场景",
    standbyRoster: [],
    actionContainer: null,
    statusCard: null,
    overlay: null,
    leaveAction: { id: "leave-house", label: "离开" },
    dialogue: {
      mode: "character",
      speakerName: "测试人物",
      textLines: ["测试台词"],
      advanceActionId: "advance-dialogue",
      advanceHintText: "点击继续",
    },
  });

  assert.doesNotMatch(
    html,
    /data-house-action="advance-dialogue" role="button" tabindex="0" data-button-sound=/
  );
  assert.match(
    html,
    /data-house-action="advance-dialogue" role="button" tabindex="0" data-ui-click-sound="none"/
  );
});

test("location dialogue advance surfaces no longer declare a page-turn button sound", () => {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    html,
    /data-action="close-location-dialogue"[\s\S]*data-button-sound=/
  );
  assert.match(
    html,
    /data-action="close-location-dialogue"[\s\S]*data-ui-click-sound="none"/
  );
});

test("npc dialogue actions stay silent instead of falling back to the generic ui click cue", () => {
  const {
    renderNpcInteractionDialogue,
  } = require("../.test-dist/ui/components/npc-interaction/npc-interaction-menu.js");

  const html = renderNpcInteractionDialogue({
    session: { mode: "dialogue", targetCharacterId: "character.test" },
    targetName: "测试人物",
  });

  assert.doesNotMatch(
    html,
    /data-npc-action="continue"[\s\S]*data-button-sound=/
  );
  assert.match(
    html,
    /data-npc-action="continue"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    html,
    /data-npc-action="close"[\s\S]*data-ui-click-sound="none"/
  );
});
