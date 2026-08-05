const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOTS = [
  "src/content/scenario-packs/zhuyuanzhang",
  "src/modules/script-editor/builtin-templates/zhuyuanzhang",
  "public/builtin-script-editor-templates/zhuyuanzhang",
];

const EXPECTED_STAGE_IDS = [
  "intro",
  "assignment-table",
  "reward",
  "personnel",
  "praise",
  "situation",
  "policy",
  "advice",
  "assign-duty",
  "complete",
];

const EXPECTED_KEEP_STAGE_IDS = [
  "intro",
  "assignment-table",
  "praise",
  "situation",
  "policy",
  "advice",
  "assign-task",
  "assigned",
  "complete",
];

function readJson(root, fileName) {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), root, fileName), "utf8")
  );
}

test("zhuyuanzhang packs declare temple review meeting families in their manifests", () => {
  for (const root of ROOTS) {
    const manifest = readJson(root, "pack.json");

    assert.equal(manifest.files.meetings, "meetings.json");
    assert.equal(manifest.files.meetingBindings, "meeting-bindings.json");
    assert.equal(manifest.files.meetingPanels, "meeting-panels.json");
    assert.equal(manifest.files.meetingChoiceSets, "meeting-choice-sets.json");
    assert.equal(manifest.files.meetingActionSets, "meeting-action-sets.json");
  }
});

test("zhuyuanzhang packs keep the same temple review meeting skeleton across runtime, template, and public mirrors", () => {
  const snapshots = ROOTS.map((root) => ({
    root,
    meetings: readJson(root, "meetings.json"),
    bindings: readJson(root, "meeting-bindings.json"),
    panels: readJson(root, "meeting-panels.json"),
    choiceSets: readJson(root, "meeting-choice-sets.json"),
    actionSets: readJson(root, "meeting-action-sets.json"),
  }));

  for (const snapshot of snapshots) {
    const meeting = snapshot.meetings.find(
      (entry) => entry.id === "meeting.temple.review"
    );
    assert.ok(meeting, `expected meeting.temple.review in ${snapshot.root}`);
    assert.deepEqual(meeting.stageIds, EXPECTED_STAGE_IDS);
    assert.equal(meeting.initialStageId, "intro");
    assert.equal(meeting.completion?.type, "return-to-host");
    assert.equal(
      meeting.stagesById["assignment-table"]?.panelId,
      "panel.temple.review.assignment"
    );
    assert.equal(
      meeting.stagesById.policy?.panelId,
      "panel.temple.review.policy"
    );
    assert.equal(
      meeting.stagesById.advice?.choiceSetId,
      "choices.temple.review.advice"
    );
    assert.equal(
      meeting.stagesById["assign-duty"]?.choiceSetId,
      "choices.temple.review.assignment"
    );
    assert.equal(
      meeting.stagesById.complete?.actionSetId,
      "actions.temple.review.complete"
    );

    const binding = snapshot.bindings.find(
      (entry) => entry.id === "binding.temple.review"
    );
    assert.ok(binding, `expected binding.temple.review in ${snapshot.root}`);
    assert.equal(binding.meetingId, "meeting.temple.review");
    assert.equal(binding.owner.family, "building");
    assert.equal(binding.owner.id, "house.kulan.temple");
    assert.equal(binding.trigger.action, "building-container-item-action");
    assert.equal(binding.trigger.itemId, "review");

    const panelIds = new Set(snapshot.panels.map((entry) => entry.id));
    assert.ok(panelIds.has("panel.temple.review.assignment"));
    assert.ok(panelIds.has("panel.temple.review.policy"));

    const choiceSetIds = new Set(snapshot.choiceSets.map((entry) => entry.id));
    assert.ok(choiceSetIds.has("choices.temple.review.advice"));
    assert.ok(choiceSetIds.has("choices.temple.review.assignment"));

    const actionSetIds = new Set(snapshot.actionSets.map((entry) => entry.id));
    assert.ok(actionSetIds.has("actions.temple.review.assign.indoor"));
    assert.ok(actionSetIds.has("actions.temple.review.assign.beg_alms"));
    assert.ok(actionSetIds.has("actions.temple.review.complete"));
  }
});

test("zhuyuanzhang packs keep the same keep review meeting skeleton across runtime, template, and public mirrors", () => {
  const snapshots = ROOTS.map((root) => ({
    root,
    meetings: readJson(root, "meetings.json"),
    bindings: readJson(root, "meeting-bindings.json"),
    panels: readJson(root, "meeting-panels.json"),
    choiceSets: readJson(root, "meeting-choice-sets.json"),
    actionSets: readJson(root, "meeting-action-sets.json"),
  }));

  for (const snapshot of snapshots) {
    const meeting = snapshot.meetings.find(
      (entry) => entry.id === "meeting.keep.review"
    );
    assert.ok(meeting, `expected meeting.keep.review in ${snapshot.root}`);
    assert.deepEqual(meeting.stageIds, EXPECTED_KEEP_STAGE_IDS);
    assert.equal(meeting.initialStageId, "intro");
    assert.equal(meeting.completion?.type, "return-to-host");
    assert.equal(
      meeting.stagesById["assignment-table"]?.panelId,
      "panel.keep.review.assignment"
    );
    assert.equal(
      meeting.stagesById.policy?.panelId,
      "panel.keep.review.policy"
    );
    assert.equal(
      meeting.stagesById.advice?.choiceSetId,
      "choices.keep.review.advice"
    );
    assert.equal(
      meeting.stagesById["assign-task"]?.choiceSetId,
      "choices.keep.review.assignment"
    );
    assert.equal(
      meeting.stagesById.assigned?.panelId,
      "panel.keep.review.assigned"
    );
    assert.equal(
      meeting.stagesById.complete?.actionSetId,
      "actions.keep.review.complete"
    );

    const binding = snapshot.bindings.find(
      (entry) => entry.id === "binding.keep.review"
    );
    assert.ok(binding, `expected binding.keep.review in ${snapshot.root}`);
    assert.equal(binding.meetingId, "meeting.keep.review");
    assert.equal(binding.owner.family, "building");
    assert.equal(binding.owner.id, "house.kulan.keep");
    assert.equal(binding.trigger.action, "building-container-item-action");
    assert.equal(binding.trigger.itemId, "review");

    const panelIds = new Set(snapshot.panels.map((entry) => entry.id));
    assert.ok(panelIds.has("panel.keep.review.assignment"));
    assert.ok(panelIds.has("panel.keep.review.policy"));
    assert.ok(panelIds.has("panel.keep.review.assigned"));

    const choiceSetIds = new Set(snapshot.choiceSets.map((entry) => entry.id));
    assert.ok(choiceSetIds.has("choices.keep.review.advice"));
    assert.ok(choiceSetIds.has("choices.keep.review.assignment"));

    const actionSetIds = new Set(snapshot.actionSets.map((entry) => entry.id));
    assert.ok(actionSetIds.has("actions.keep.review.complete"));
  }
});
