import type {
  ActionNode,
  ChoiceOption,
  CharacterDefinition,
  CityDefinition,
  EventDefinition,
  HouseDefinition,
  MapDefinition,
  MissionDefinition,
  SceneDefinition,
} from "../domain";

export const sampleMap: MapDefinition = {
  id: "map.central_japan",
  name: "中央地图",
  backgroundId: "bg.map.central_japan",
  nodes: [{ cityId: "city.gifu", x: 412, y: 268 }],
};

export const sampleCity: CityDefinition = {
  id: "city.gifu",
  name: "岐阜",
  regionId: "region.mino",
  mapNodeId: "map-node.gifu",
  houseIds: ["house.gifu.castle"],
  neighbourCityIds: [],
  travelCost: 1,
  tags: ["castle-town", "capital"],
  prosperity: 75,
  danger: 35,
  specialDemand: [],
};

export const sampleHouse: HouseDefinition = {
  id: "house.gifu.castle",
  cityId: "city.gifu",
  name: "岐阜城",
  type: "castle",
  characterIds: ["char.oda_nobunaga", "char.kinoshita_tokichiro"],
  defaultCharacterId: "char.oda_nobunaga",
  backAction: {
    label: "返回城下町",
    targetView: "city",
  },
};

export const sampleCharacters: CharacterDefinition[] = [
  {
    id: "char.oda_nobunaga",
    name: "织田信长",
    birthYear: 1534,
    deathYear: null,
    age: 33,
    clanId: "clan.oda",
    title: "家主",
    occupation: "武士",
    cityId: "city.gifu",
    houseId: "house.gifu.castle",
    portraitId: "portrait.oda_nobunaga",
    defaultSide: "left",
    stats: {
      leadership: 98,
      martial: 87,
      intelligence: 92,
      politics: 94,
      charm: 86,
      fame: 100,
      gold: 5000,
    },
    stamina: 92,
    biography: "织田家的年轻家督，正处于势力扩张的关键阶段。",
    availableFunctions: [
      {
        id: "func.oda.assign_mission",
        label: "发布任务",
        type: "open-event",
        eventId: "event.gifu.council_001",
      },
    ],
  },
  {
    id: "char.kinoshita_tokichiro",
    name: "木下藤吉郎",
    birthYear: 1536,
    deathYear: null,
    age: 31,
    clanId: "clan.oda",
    title: "足轻大将",
    occupation: "武士",
    cityId: "city.gifu",
    houseId: "house.gifu.castle",
    portraitId: "portrait.kinoshita_tokichiro",
    defaultSide: "right",
    stats: {
      leadership: 72,
      martial: 65,
      intelligence: 85,
      politics: 81,
      charm: 95,
      fame: 55,
      gold: 120,
    },
    stamina: 88,
    biography: "足轻出身，善于随机应变，正在争取更多军功与信任。",
    availableFunctions: [
      {
        id: "func.kinoshita.trade",
        label: "交易",
        type: "trade",
      },
      {
        id: "func.kinoshita.tea_minigame",
        label: "茶席小游戏",
        type: "minigame",
        minigameId: "minigame.tea_ceremony",
      },
    ],
    onTalkSceneId: "scene.gifu.council_001",
  },
];

export const sampleMission: MissionDefinition = {
  id: "mission.unify_mino",
  title: "整合美浓",
  description: "接受主命，推进美浓地区统一。",
  issuerCharacterId: "char.oda_nobunaga",
  statusText: "前往相关城池处理内政与外交。",
  rewardText: "提升名声与家中地位。",
};

export const sampleTextEntries: Record<string, string> = {
  "scene.gifu.council_001.001": "主公，请把这个任务交给我吧！",
  "scene.gifu.council_001.002": "噢？那你就试试看吧，猴子。",
  "scene.gifu.council_001.prompt": "你要如何回应？",
  "scene.gifu.council_001.choice.accept": "接受任务",
  "scene.gifu.council_001.choice.reject": "拒绝并推荐他人",
};

export const sampleEvent: EventDefinition = {
  id: "event.gifu.council_001",
  chapterId: "chapter.rising_sun",
  name: "评定间请命事件",
  occurrence: "once",
  participants: [
    {
      role: "primary",
      characterId: "char.oda_nobunaga",
      required: true,
    },
    {
      role: "secondary",
      characterId: "char.kinoshita_tokichiro",
      required: true,
    },
  ],
  entrySceneId: "scene.gifu.council_001",
  tags: ["main", "mission"],
};

export const sampleScene: SceneDefinition = {
  id: "scene.gifu.council_001",
  name: "评定间请命",
  actions: [
    {
      type: "background",
      backgroundId: "bg.council_room",
    },
    {
      type: "music",
      musicId: "bgm.midsummer_duel",
      loop: true,
    },
    {
      type: "dialogue",
      characterId: "char.kinoshita_tokichiro",
      side: "right",
      textId: "scene.gifu.council_001.001",
    },
    {
      type: "dialogue",
      characterId: "char.oda_nobunaga",
      side: "left",
      textId: "scene.gifu.council_001.002",
    },
    {
      type: "choice",
      promptTextId: "scene.gifu.council_001.prompt",
      options: [
        {
          id: "choice.accept",
          labelTextId: "scene.gifu.council_001.choice.accept",
          effects: [{ type: "start-mission", missionId: "mission.unify_mino" }],
        },
        {
          id: "choice.reject",
          labelTextId: "scene.gifu.council_001.choice.reject",
        },
      ],
    },
  ],
};

export const sampleScenesById: Record<string, SceneDefinition> = {
  [sampleScene.id]: sampleScene,
};

export const sampleEventsById: Record<string, EventDefinition> = {
  [sampleEvent.id]: sampleEvent,
};

export function getSampleChoiceOptions(): ChoiceOption[] | null {
  const choiceAction = sampleScene.actions.find(
    (actionNode): actionNode is Extract<ActionNode, { type: "choice" }> =>
      actionNode.type === "choice"
  );

  return choiceAction?.options ?? null;
}
