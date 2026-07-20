const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDemoFormationStageState,
} = require("../.test-dist/application/formation/formation-stage.js");
const {
  createPartyEditorStageViewModel,
  createBattleFormationPreviewViewModel,
} = require("../.test-dist/application/formation/formation-stage-view-model.js");

test("shared formation-stage seam exposes one selected team for both party-editor and battle consumers", () => {
  const state = createDemoFormationStageState();
  const partyEditorModel = createPartyEditorStageViewModel(state);
  const battlePreviewModel = createBattleFormationPreviewViewModel(state);

  assert.equal(partyEditorModel.teams.length, 1);
  assert.equal(partyEditorModel.teams[0].name, "朱重八本队");
  assert.equal(partyEditorModel.resources[0].label, "金钱");
  assert.equal(partyEditorModel.resources[1].label, "食物");
  assert.equal(partyEditorModel.resources[2].label, "马匹");
  assert.equal(partyEditorModel.teams[0].slots.length, 9);
  assert.equal(battlePreviewModel.teamName, "朱重八本队");
  assert.equal(battlePreviewModel.slots.length, 9);
  assert.deepEqual(
    partyEditorModel.teams[0].slots.map((slot) => slot.slotKey),
    battlePreviewModel.slots.map((slot) => slot.slotKey)
  );
});
