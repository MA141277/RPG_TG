const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveScenarioProfileStartupDefaults,
} = require("../.test-dist/domain/scenario-profile.js");

test("scenario profile startup defaults preserve authored calendar and ui values", () => {
  const profile = {
    id: "scenario.authored",
    title: "Authored Scenario",
    playerCharacterId: "char.player",
    chapterId: "chapter.authored",
    initialCalendar: {
      year: 1567,
      month: 1,
      day: 1,
    },
    initialLocation: {
      mapId: "map.test",
      cityId: "city.test",
      houseId: null,
      view: "map",
    },
    initialUi: {
      reviewDateText: "今日评定",
      mainHouseMissionText: "前往皇觉寺听候住持训示",
    },
  };

  assert.deepEqual(
    resolveScenarioProfileStartupDefaults(profile, {
      fallbackMissionText: "Fallback Mission",
    }),
    {
      calendar: {
        year: 1567,
        month: 1,
        day: 1,
      },
      reviewDateText: "今日评定",
      mainHouseMissionText: "前往皇觉寺听候住持训示",
    }
  );
});

test("scenario profile startup defaults provide centralized fallback values when scenario metadata is missing", () => {
  const profile = {
    id: "scenario.fallback",
    title: "Fallback Scenario",
    playerCharacterId: "char.player",
    chapterId: "chapter.fallback",
    initialLocation: {
      mapId: "map.test",
      cityId: "city.test",
      houseId: null,
      view: "map",
    },
  };

  assert.deepEqual(
    resolveScenarioProfileStartupDefaults(profile, {
      fallbackMissionText: "Fallback Mission",
    }),
    {
      calendar: {
        year: 1,
        month: 1,
        day: 1,
      },
      reviewDateText: "JSON 开局",
      mainHouseMissionText: "Fallback Mission",
    }
  );
});
