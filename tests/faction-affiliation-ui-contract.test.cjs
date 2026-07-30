const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  selectLeaderResidenceOptions,
} = require("../.test-dist/application/city-entries/select-leader-residence-options.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.yuanmo",
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });
}

test("leader residence options prefer runtime faction affiliation over stale character fields", () => {
  const baseState = createBaseState();
  const state = {
    ...baseState,
    runtime: {
      ...baseState.runtime,
      factionAffiliations: {
        "char.lord": {
          factionId: "red_turban",
          factionName: "\u7ea2\u5dfe\u519b",
          status: "active",
          joinedBy: "test",
          joinedOn: {
            year: 1352,
            month: 1,
            day: 1,
          },
        },
      },
    },
  };
  const options = selectLeaderResidenceOptions(
    state,
    [
      {
        id: "char.lord",
        name: "\u90ed\u5b50\u5174",
        birthYear: 1306,
        age: 46,
        cityId: "city.kulan",
        portraitId: "portrait.guo_zixing",
        stats: {
          leadership: 70,
          martial: 65,
          intelligence: 45,
          politics: 42,
          charm: 52,
          fame: 0,
          gold: 0,
        },
        stamina: 100,
        clanId: "clan.legacy",
        affiliationLabel: "\u65e7\u6807\u7b7e",
        isHistoricalFigure: true,
        leaderResidenceEligible: true,
        leaderResidenceStatus: "available",
        availableFunctions: [],
      },
    ],
    {
      id: "entry.leader-residence",
      cityId: "city.kulan",
      houseId: "house.kulan.keep",
      label: "\u5e05\u5e9c",
      actionId: "open-leader-residence",
    }
  );

  assert.equal(options[0].factionLabel, "\u7ea2\u5dfe\u519b");
});

test("app-render and leader-residence readers stop bypassing the runtime affiliation resolver", () => {
  const appRenderSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );
  const selectorSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/city-entries/select-leader-residence-options.ts"),
    "utf8"
  );
  const leaderResidenceSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/leader-residence/leader-residence-house-module.ts"
    ),
    "utf8"
  );

  assert.match(appRenderSource, /resolveCharacterFactionLabel/);
  assert.doesNotMatch(
    appRenderSource,
    /options\.clanName\s*=\s*playerCharacter\.clanId/
  );
  assert.match(selectorSource, /resolveCharacterFactionLabel/);
  assert.doesNotMatch(selectorSource, /affiliationLabel\s*\?\?/);
  assert.match(leaderResidenceSource, /resolveCharacterFactionLabel/);
  assert.doesNotMatch(leaderResidenceSource, /affiliationLabel\s*\?\?/);
});
