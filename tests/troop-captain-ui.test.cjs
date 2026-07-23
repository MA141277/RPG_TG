const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createTroopEditorStageViewModel,
} = require("../.test-dist/application/troop-editor/troop-editor-stage-view-model.js");
const {
  createTroopManagementStageViewModel,
} = require("../.test-dist/application/troop-editor/troop-management-stage-view-model.js");

test("troop preview view-model marks the captain slot and exposes reserve captain options for creation", () => {
  const model = createTroopEditorStageViewModel({
    resources: [],
    troopSnapshots: [
      {
        id: "troop.custom.1",
        name: "Vanguard",
        subtitle: "",
        captainMemberId: "member.center",
        captainName: "Captain Zhang",
        slots: [
          {
            slotKey: "middle-center",
            occupantName: "Captain Zhang",
            occupantRole: "infantry",
            isOccupied: true,
            isCaptain: true,
          },
        ],
      },
    ],
    reserveMembers: [
      {
        id: "reserve.captain",
        name: "Reserve Li",
        role: "spearman",
        sourceTroopId: "reserve.pool",
      },
    ],
    shopOffers: [],
    reserveCount: 1,
    reserveCapacity: 10,
    selectedTroopId: "troop.custom.1",
    playerGold: 0,
    playerFame: 0,
  });

  assert.equal(
    model.troops[0].slots.find((slot) => slot.slotKey === "middle-center")?.isCaptain,
    true
  );
  assert.deepEqual(model.createCaptainOptions, [
    { id: "reserve.captain", name: "Reserve Li", roleLabel: "枪兵" },
  ]);
});

test("troop-management view-model exposes captain text and slot key for the selected troop", () => {
  const model = createTroopManagementStageViewModel({
    resources: [],
    troopSnapshots: [
      {
        id: "troop.custom.1",
        name: "Vanguard",
        subtitle: "",
        captainMemberId: "member.center",
        captainName: "Captain Zhang",
        slots: [
          {
            slotKey: "middle-center",
            occupantName: "Captain Zhang",
            occupantRole: "infantry",
            isOccupied: true,
            isCaptain: true,
          },
        ],
      },
    ],
    selectedTroopSnapshot: {
      id: "troop.custom.1",
      name: "Vanguard",
      subtitle: "",
      captainMemberId: "member.center",
      captainName: "Captain Zhang",
      slots: [
        {
          slotKey: "middle-center",
          occupantName: "Captain Zhang",
          occupantRole: "infantry",
          isOccupied: true,
          isCaptain: true,
        },
      ],
    },
    reserveMembers: [],
    reserveCapacity: 10,
    summary: {
      threatLevelText: "low",
      movementText: "4",
      moraleText: "80",
      scaleText: "1/9",
      leaderTraitText: "none",
    },
  });

  assert.equal(model.captainName, "Captain Zhang");
  assert.equal(model.captainSlotKey, "middle-center");
  assert.equal(model.previewSlots.some((slot) => slot.isCaptain), true);
});

test("troop editor sources render captain selection and prominent L badge", () => {
  const editorSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-editor-view.ts",
    "utf8"
  );
  const gridSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-preview-grid.ts",
    "utf8"
  );
  const interactionSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-editor-interactions.ts",
    "utf8"
  );
  const managementSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-management-view.ts",
    "utf8"
  );

  assert.match(editorSource, /data-troop-editor-create-captain-list/);
  assert.match(editorSource, /data-troop-editor-create-member=/);
  assert.match(gridSource, /c-troop-preview-grid__captain-badge/);
  assert.match(interactionSource, /captainReserveMemberId: string/);
  assert.match(interactionSource, /selectedCreateCaptainId/);
  assert.match(managementSource, /data-captain-slot-key/);
});

test("troop-management move interactions block removing the current captain", () => {
  const source = fs.readFileSync(
    "src/ui/views/troop-editor/troop-management-move-interactions.ts",
    "utf8"
  );
  assert.match(source, /captainRemoveForbidden/);
  assert.match(source, /captainSlotKey/);
});
