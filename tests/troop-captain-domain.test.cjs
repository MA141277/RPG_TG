const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTroopFormation,
  removeTroopFormationMember,
  normalizeTroopRuntimeStateUnitDefinitions,
} = require("../.test-dist/domain/troop-editor.js");
const {
  getBattleFormationCaptainMember,
} = require("../.test-dist/domain/battle-formation.js");
const {
  createTroopEditorTeam,
} = require("../.test-dist/application/app-actions.js");
const {
  selectPlayerTroopSnapshots,
} = require("../.test-dist/application/troop-editor/troop-editor-selectors.js");

function createTroopState() {
  return {
    formations: [
      {
        id: "troop.main",
        name: "Main",
        leaderCharacterId: "char.player",
        members: [
          {
            id: "member.main.center",
            unitDefinitionId: "unit.infantry.demo",
            name: "Center Guard",
            role: "infantry",
            slotKey: "middle-center",
          },
        ],
      },
    ],
    reserve: {
      capacity: 10,
      members: [
        {
          id: "reserve.captain",
          unitDefinitionId: "unit.spearman.demo",
          name: "Reserve Captain",
          role: "spearman",
          sourceTroopId: "reserve.pool",
        },
        {
          id: "reserve.other",
          unitDefinitionId: "unit.archer.demo",
          name: "Reserve Archer",
          role: "archer",
          sourceTroopId: "reserve.pool",
        },
      ],
    },
    shop: {
      refreshVersion: 0,
      offers: [],
    },
  };
}

function createAppState() {
  return {
    characterDefinitions: [
      {
        id: "char.player",
        stats: {
          gold: 100,
          fame: 10,
        },
      },
    ],
    gameState: {
      player: {
        characterId: "char.player",
      },
      ui: {
        selectedTroopId: null,
      },
      runtime: {
        troops: createTroopState(),
      },
    },
  };
}

test("new troop creation consumes selected reserve captain and pins captain to middle-center", () => {
  const nextState = createTroopFormation(createTroopState(), {
    leaderCharacterId: "char.player",
    name: "Vanguard",
    captainReserveMemberId: "reserve.captain",
  });

  const createdTroop = nextState.formations.at(-1);
  assert.equal(createdTroop?.name, "Vanguard");
  assert.equal(createdTroop?.captainMemberId, "reserve.captain");
  assert.deepEqual(createdTroop?.members, [
    {
      id: "reserve.captain",
      unitDefinitionId: "unit.spearman.demo",
      name: "Reserve Captain",
      role: "spearman",
      slotKey: "middle-center",
    },
  ]);
  assert.deepEqual(
    nextState.reserve.members.map((member) => member.id),
    ["reserve.other"],
  );
});

test("legacy formations resolve captain from middle-center when explicit captainMemberId is absent", () => {
  const captain = getBattleFormationCaptainMember({
    id: "troop.legacy",
    name: "Legacy",
    leaderCharacterId: "char.player",
    members: [
      {
        id: "legacy.left",
        unitDefinitionId: "unit.spearman.demo",
        name: "Left",
        role: "spearman",
        slotKey: "middle-left",
      },
      {
        id: "legacy.center",
        unitDefinitionId: "unit.infantry.demo",
        name: "Center",
        role: "infantry",
        slotKey: "middle-center",
      },
    ],
  });

  assert.equal(captain?.id, "legacy.center");
});

test("normalization assigns a stable fallback captain when a formation has no explicit captain and no middle-center member", () => {
  const troopState = {
    formations: [
      {
        id: "troop.legacy.no-center",
        name: "No Center",
        leaderCharacterId: "char.player",
        members: [
          {
            id: "legacy.front-left",
            unitDefinitionId: "unit.spearman.demo",
            name: "Front Left",
            role: "spearman",
            slotKey: "front-left",
          },
          {
            id: "legacy.rear-right",
            unitDefinitionId: "unit.archer.demo",
            name: "Rear Right",
            role: "archer",
            slotKey: "rear-right",
          },
        ],
      },
    ],
    reserve: {
      capacity: 10,
      members: [],
    },
    shop: {
      refreshVersion: 0,
      offers: [],
    },
  };

  const normalizedOnce = normalizeTroopRuntimeStateUnitDefinitions(troopState);
  const assignedCaptainId = normalizedOnce.formations[0]?.captainMemberId ?? null;
  const captainOnce = getBattleFormationCaptainMember(normalizedOnce.formations[0]);
  const normalizedTwice = normalizeTroopRuntimeStateUnitDefinitions(normalizedOnce);
  const captainTwice = getBattleFormationCaptainMember(normalizedTwice.formations[0]);

  assert.notEqual(normalizedOnce, troopState);
  assert.notEqual(assignedCaptainId, null);
  assert.equal(captainOnce?.id, assignedCaptainId);
  assert.equal(normalizedTwice, normalizedOnce);
  assert.equal(captainTwice?.id, assignedCaptainId);
});

test("captain removal through the normal remove path is blocked", () => {
  const nextState = removeTroopFormationMember(
    {
      formations: [
        {
          id: "troop.custom.1",
          name: "Vanguard",
          leaderCharacterId: "char.player",
          captainMemberId: "captain.member",
          members: [
            {
              id: "captain.member",
              unitDefinitionId: "unit.infantry.demo",
              name: "Captain",
              role: "infantry",
              slotKey: "middle-center",
            },
          ],
        },
      ],
      reserve: {
        capacity: 10,
        members: [],
      },
      shop: {
        refreshVersion: 0,
        offers: [],
      },
    },
    {
      troopId: "troop.custom.1",
      slotKey: "middle-center",
    },
  );

  assert.equal(nextState.formations[0].members.length, 1);
  assert.equal(nextState.reserve.members.length, 0);
});

test("app action requires captainReserveMemberId when creating a troop", () => {
  const nextState = createTroopEditorTeam(createAppState(), {
    name: "Vanguard",
    captainReserveMemberId: "reserve.captain",
  });

  assert.equal(
    nextState.gameState.runtime.troops.formations.at(-1)?.captainMemberId,
    "reserve.captain",
  );
  assert.equal(nextState.gameState.ui.selectedTroopId, "troop.custom.2");
});

test("player troop snapshots expose captain fields and slot captain markers", () => {
  const troopSnapshots = selectPlayerTroopSnapshots(
    createTroopEditorTeam(createAppState(), {
      name: "Vanguard",
      captainReserveMemberId: "reserve.captain",
    }),
    "char.player",
  );

  const createdSnapshot = troopSnapshots.at(-1);
  assert.equal(createdSnapshot?.captainMemberId, "reserve.captain");
  assert.equal(createdSnapshot?.captainName, "Reserve Captain");
  assert.equal(
    createdSnapshot?.slots.find((slot) => slot.slotKey === "middle-center")?.isCaptain,
    true,
  );
  assert.equal(
    createdSnapshot?.slots.find((slot) => slot.slotKey === "front-left")?.isCaptain,
    false,
  );
});
