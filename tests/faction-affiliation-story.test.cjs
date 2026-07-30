const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  applyEffects,
} = require("../.test-dist/application/effects/effect-applier.js");
const {
  runStoryCallback,
} = require("../.test-dist/application/story/story-callbacks.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.yuanmo",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
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

function createBaseCharacters() {
  return [
    {
      id: "char.player",
      name: "\u6731\u91cd\u516b",
      birthYear: 1328,
      age: 24,
      cityId: "city.kulan",
      portraitId: "portrait.zhu-yuanzhang.young",
      stats: {
        leadership: 55,
        martial: 62,
        intelligence: 63,
        politics: 41,
        charm: 46,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
    },
  ];
}

test("ordination pack scene assigns Huangjue Temple through a structured faction effect", () => {
  const scenes = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src/content/scenario-packs/zhuyuanzhang/scenes.json"),
      "utf8"
    )
  );
  const ordinationScene = scenes.find(
    (scene) => scene.id === "scene.story.zhu_yuanzhang.ordination"
  );
  const factionEffect = ordinationScene.actions
    .flatMap((action) => (Array.isArray(action.effects) ? action.effects : []))
    .find((effect) => effect.type === "set-faction-affiliation");

  assert.deepEqual(factionEffect, {
    type: "set-faction-affiliation",
    characterId: "char.player",
    factionId: "temple",
    factionName: "\u7687\u89c9\u5bfa",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });
});

test("structured faction effect writes temple runtime affiliation and compatibility label", () => {
  const result = applyEffects(
    createBaseState(),
    [
      {
        type: "set-faction-affiliation",
        characterId: "char.player",
        factionId: "temple",
        factionName: "\u7687\u89c9\u5bfa",
        joinedBy: "scene.story.zhu_yuanzhang.ordination",
      },
    ],
    {
      characterDefinitions: createBaseCharacters(),
    }
  );

  assert.equal(
    result.state.runtime.factionAffiliations["char.player"].factionName,
    "\u7687\u89c9\u5bfa"
  );
  assert.equal(result.characterDefinitions[0].affiliationLabel, "\u7687\u89c9\u5bfa");
});

test("guo zixing callback writes red turban runtime affiliation instead of only patching character text", () => {
  const result = runStoryCallback(
    "story.zhu_yuanzhang.join-guo-zixing-camp",
    undefined,
    {
      state: createBaseState(),
      characterDefinitions: createBaseCharacters(),
      textEntriesById: {
        "runtime.zhu_yuanzhang.main_mission.guo_zixing_keep": "\u524d\u5f80\u5e05\u5e9c\u5f85\u547d",
        "runtime.zhu_yuanzhang.player.title.guo_zixing_camp": "\u4eb2\u5175",
        "runtime.zhu_yuanzhang.player.occupation.guo_zixing_camp": "\u90ed\u8425\u8fd1\u536b",
        "runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp": "\u7ea2\u5dfe\u519b",
        "runtime.zhu_yuanzhang.player.biography.guo_zixing_camp":
          "\u4f60\u5df2\u88ab\u90ed\u5b50\u5174\u7559\u7f6e\u5de6\u53f3\uff0c\u6682\u4ece\u4eb2\u5175\u4e0e\u7cae\u9053\u6742\u52a1\u505a\u8d77\u3002",
      },
    }
  );

  assert.equal(
    result.state.runtime.factionAffiliations["char.player"].factionId,
    "red_turban"
  );
  assert.equal(
    result.state.runtime.factionAffiliations["char.player"].factionName,
    "\u7ea2\u5dfe\u519b"
  );
  assert.equal(result.characterDefinitions[0].affiliationLabel, "\u7ea2\u5dfe\u519b");
});
