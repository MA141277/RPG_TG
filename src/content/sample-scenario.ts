import type {
  CharacterDefinition,
  CityDefinition,
  EventDefinition,
  HouseDefinition,
  MapDefinition,
  MissionDefinition,
} from "../domain";
import type {
  RuntimeDialogueChoiceOption,
  RuntimeDialogueDefinition,
  RuntimeDialogueNode,
} from "../domain/dialogue";

export const sampleMap: MapDefinition = {
  id: "map.central_japan",
  name: "Central Map",
  backgroundId: "bg.map.central_japan",
  nodes: [{ cityId: "city.gifu", x: 412, y: 268 }],
};

export const sampleCity: CityDefinition = {
  id: "city.gifu",
  name: "Gifu",
  regionId: "region.mino",
  mapNodeId: "map-node.gifu",
  mapPlacement: {
    mapNodeId: "map-node.gifu",
    x: 412,
    y: 268,
    kind: "city",
    label: "Gifu",
    summary: "",
  },
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
  name: "Gifu Castle",
  type: "castle",
  characterIds: ["char.oda_nobunaga", "char.kinoshita_tokichiro"],
  defaultCharacterId: "char.oda_nobunaga",
  backAction: {
    label: "Return To City",
    targetView: "city",
  },
};

export const sampleCharacters: CharacterDefinition[] = [
  {
    id: "char.oda_nobunaga",
    name: "Oda Nobunaga",
    birthYear: 1534,
    deathYear: null,
    age: 33,
    clanId: "clan.oda",
    title: "Lord",
    occupation: "Samurai",
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
    biography: "Young lord of the Oda clan.",
    availableFunctions: [
      {
        id: "func.oda.assign_mission",
        label: "Assign Mission",
        type: "open-event",
        eventId: "event.gifu.council_001",
      },
    ],
  },
  {
    id: "char.kinoshita_tokichiro",
    name: "Kinoshita Tokichiro",
    birthYear: 1536,
    deathYear: null,
    age: 31,
    clanId: "clan.oda",
    title: "Retainer",
    occupation: "Samurai",
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
    biography: "A quick-witted rising retainer.",
    availableFunctions: [
      {
        id: "func.kinoshita.trade",
        label: "Trade",
        type: "trade",
      },
      {
        id: "func.kinoshita.tea_minigame",
        label: "Tea Minigame",
        type: "minigame",
        minigameId: "minigame.tea_ceremony",
      },
    ],
    onTalkDialogueId: "scene.gifu.council_001",
  },
];

export const sampleMission: MissionDefinition = {
  id: "mission.unify_mino",
  title: "Unify Mino",
  description: "Advance regional unification.",
  issuerCharacterId: "char.oda_nobunaga",
  statusText: "Handle local and diplomatic work.",
  rewardText: "Raise reputation and status.",
};

export const sampleTextEntries: Record<string, string> = {
  "scene.gifu.council_001.001": "My lord, please leave this mission to me.",
  "scene.gifu.council_001.002": "Then prove it.",
  "scene.gifu.council_001.prompt": "How will you respond?",
  "scene.gifu.council_001.choice.accept": "Accept mission",
  "scene.gifu.council_001.choice.reject": "Decline and recommend another",
};

export const sampleEvent: EventDefinition = {
  id: "event.gifu.council_001",
  chapterId: "chapter.rising_sun",
  name: "Council Request",
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
  dialogueId: "scene.gifu.council_001",
  tags: ["main", "mission"],
};

export const sampleDialogue: RuntimeDialogueDefinition = {
  id: "scene.gifu.council_001",
  name: "Council Request",
  nodes: [
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

export const sampleDialoguesById: Record<string, RuntimeDialogueDefinition> = {
  [sampleDialogue.id]: sampleDialogue,
};

export const sampleEventsById: Record<string, EventDefinition> = {
  [sampleEvent.id]: sampleEvent,
};

export function getSampleChoiceOptions(): RuntimeDialogueChoiceOption[] | null {
  const choiceNode = (sampleDialogue.nodes ?? []).find(
    (
      node
    ): node is Extract<RuntimeDialogueNode, { type: "choice" }> =>
      node.type === "choice"
  );

  return choiceNode?.options ?? null;
}
