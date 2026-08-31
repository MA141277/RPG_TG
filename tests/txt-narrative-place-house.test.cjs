const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

function loadTxtNarrativePlaceHouseModule() {
  return require("../.test-dist/application/house-modules/txt-narrative-place/txt-narrative-place-house-module.js");
}

function loadPlaceholderProvider() {
  return require("../.test-dist/application/txt-narrative/local-placeholder-txt-narrative-provider.js");
}

const playerCharacterId = "char.player";
const hostHouseDefinition = {
  id: "house.kulan.temple_txt_narrative",
  cityId: "city.kulan",
  name: "皇觉寺（文游）",
  type: "temple",
  moduleId: "txt-narrative-place",
  characterIds: [
    "char.player",
    "char.kulan_temple_abbot",
    "char.kulan_temple_senior_monk",
  ],
  defaultCharacterId: "char.kulan_temple_abbot",
  backAction: {
    label: "返回濠州",
    targetView: "city",
  },
};

function createBaseState(currentHouseId = hostHouseDefinition.id) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: {
        swordId:
          prototypeValuables.find(
            (valuableDefinition) => valuableDefinition.category === "weapon"
          )?.id ?? null,
        armorId:
          prototypeValuables.find(
            (valuableDefinition) => valuableDefinition.category === "armor"
          )?.id ?? null,
      },
    },
    currentView: "house",
  });
}

function createCharacterDefinition(id, name, houseId, title = undefined) {
  return {
    id,
    name,
    birthYear: 1330,
    age: 20,
    cityId: "city.kulan",
    houseId,
    portraitId: `portrait.${id}`,
    stats: {
      leadership: 1,
      martial: 1,
      intelligence: 1,
      politics: 1,
      charm: 1,
      fame: 1,
      gold: 0,
    },
    stamina: 100,
    availableFunctions: [],
    ...(title == null ? {} : { title }),
  };
}

function createCharacters() {
  return [
    createCharacterDefinition(
      "char.player",
      "朱重八",
      hostHouseDefinition.id,
      "游方僧人"
    ),
    createCharacterDefinition(
      "char.kulan_temple_abbot",
      "皇觉寺住持",
      "house.kulan.temple",
      "住持"
    ),
    createCharacterDefinition(
      "char.kulan_temple_senior_monk",
      "寺中师兄",
      "house.kulan.temple",
      "师兄"
    ),
  ];
}

function createOpeningCompleteEvent(requestId = "opening-request") {
  return {
    type: "complete",
    requestId,
    rawText: `
[NARRATION: 兵荒马乱，皇觉寺山门前尽是流民与饥色。]
[DIALOGUE: char.kulan_temple_abbot,皇觉寺住持,"寺里已经养不起这么多人了。你们都得外出化缘，各自寻一条活路。"]
[SET_FLAG: story.zhu.opening.in_temple]
[CHOICE: 你如何回应？]
[OPTION: option.accept_alms|应下化缘|应下化缘|mainline|true]
[OPTION: option.ask_where|询问该往何处去|询问该往何处去|recommended|true]
[OPTION: option.talk_senior_monk|和寺中师兄交谈|和寺中师兄交谈|npc_interaction|false]
[OPTION: option.exit_proactive|退出主动推演|退出主动推演|exit|false]
`,
    allSteps: [
      {
        type: "narration",
        text: "兵荒马乱，皇觉寺山门前尽是流民与饥色。",
      },
      {
        type: "dialogue",
        speakerId: "char.kulan_temple_abbot",
        speakerName: "皇觉寺住持",
        text: "寺里已经养不起这么多人了。你们都得外出化缘，各自寻一条活路。",
      },
      {
        type: "flag",
        op: "set",
        key: "story.zhu.opening.in_temple",
      },
      {
        type: "choice",
        prompt: "你如何回应？",
        options: [
          {
            id: "option.accept_alms",
            label: "应下化缘",
            actionText: "应下化缘",
            kind: "mainline",
            recommended: true,
          },
          {
            id: "option.ask_where",
            label: "询问该往何处去",
            actionText: "询问该往何处去",
            kind: "recommended",
            recommended: true,
          },
          {
            id: "option.talk_senior_monk",
            label: "和寺中师兄交谈",
            actionText: "和寺中师兄交谈",
            kind: "npc_interaction",
            recommended: false,
          },
          {
            id: "option.exit_proactive",
            label: "退出主动推演",
            actionText: "退出主动推演",
            kind: "exit",
            recommended: false,
          },
        ],
      },
    ],
  };
}

test("local placeholder TXT provider emits the hard-required Huangjue Temple opening and first choice set", async () => {
  const { createLocalPlaceholderTxtNarrativeProvider } = loadPlaceholderProvider();
  const provider = createLocalPlaceholderTxtNarrativeProvider();
  const events = [];

  await provider.stream(
    {
      requestId: "opening-request",
      system: "test-system",
      messages: [],
      metadata: {
        phaseId: "temple_alms_departure",
        houseId: "house.kulan.temple",
        placeName: "皇觉寺",
        inputType: "enter_place",
      },
    },
    (event) => {
      events.push(event);
    }
  );

  const completeEvent = events.find((event) => event.type === "complete");
  assert.ok(completeEvent);
  assert.match(completeEvent.rawText, /寺里已经养不起这么多人了/u);
  assert.ok(
    completeEvent.allSteps.some(
      (step) => step.type === "dialogue" && step.speakerName === "皇觉寺住持"
    )
  );
  const choiceStep = completeEvent.allSteps.find((step) => step.type === "choice");
  assert.ok(choiceStep);
  assert.deepEqual(
    choiceStep.options.map((option) => option.label),
    ["应下化缘", "询问该往何处去", "和寺中师兄交谈", "退出主动推演"]
  );
});

test("TXT narrative host enter initializes the Huangjue opening context and starts the provider stream through a side effect", () => {
  const { txtNarrativePlaceHouseModule } = loadTxtNarrativePlaceHouseModule();

  const entered = txtNarrativePlaceHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: createCharacters(),
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
  });

  const startStreamEffect = entered.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-txt-narrative-stream"
  );

  assert.ok(startStreamEffect);
  assert.equal(
    entered.gameState.runtime.txtNarrative?.currentPhaseId,
    "temple_alms_departure"
  );
  assert.equal(entered.sessionState.currentPlace.houseId, "house.kulan.temple");
  assert.equal(entered.sessionState.currentPlace.placeName, "皇觉寺");
  assert.deepEqual(
    entered.sessionState.currentPlace.npcIds,
    ["char.kulan_temple_abbot", "char.kulan_temple_senior_monk"]
  );
  assert.equal(startStreamEffect.payload.metadata.houseId, "house.kulan.temple");
  assert.equal(startStreamEffect.payload.metadata.placeName, "皇觉寺");
});

test("TXT narrative host applies provider completion steps into transcript, flags, and the next choice surface", () => {
  const { txtNarrativePlaceHouseModule } = loadTxtNarrativePlaceHouseModule();

  const entered = txtNarrativePlaceHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: createCharacters(),
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
  });

  const completed = txtNarrativePlaceHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
    sessionState: entered.sessionState,
    request: {
      type: "txt-narrative-provider-event",
      requestId: "opening-request",
      event: createOpeningCompleteEvent("opening-request"),
    },
  });

  assert.equal(
    completed.gameState.runtime.txtNarrative?.flags?.["story.zhu.opening.in_temple"],
    true
  );

  const viewModel = txtNarrativePlaceHouseModule.selectViewModel({
    gameState: completed.gameState,
    characterDefinitions: completed.characterDefinitions,
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
    sessionState: completed.sessionState,
  });

  assert.equal(viewModel.overlay?.type, "txt-narrative");
  assert.equal(viewModel.overlay?.placeName, "皇觉寺");
  assert.deepEqual(
    viewModel.overlay?.transcript.map((entry) => entry.text),
    [
      "兵荒马乱，皇觉寺山门前尽是流民与饥色。",
      "寺里已经养不起这么多人了。你们都得外出化缘，各自寻一条活路。",
    ]
  );
  assert.deepEqual(
    viewModel.overlay?.options.map((option) => option.label),
    ["应下化缘", "询问该往何处去", "和寺中师兄交谈", "退出主动推演"]
  );
});

test("TXT narrative host lets the player pause proactive narration and later reactivate it through normal house actions", () => {
  const { txtNarrativePlaceHouseModule } = loadTxtNarrativePlaceHouseModule();

  const entered = txtNarrativePlaceHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: createCharacters(),
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
  });

  const completed = txtNarrativePlaceHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
    sessionState: entered.sessionState,
    request: {
      type: "txt-narrative-provider-event",
      requestId: "opening-request",
      event: createOpeningCompleteEvent("opening-request"),
    },
  });

  const paused = txtNarrativePlaceHouseModule.dispatch({
    gameState: completed.gameState,
    characterDefinitions: completed.characterDefinitions,
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
    sessionState: completed.sessionState,
    request: {
      type: "action",
      actionId: "txt-narrative-select-option:option.exit_proactive",
    },
  });

  assert.equal(paused.sessionState.proactiveMode, "paused");

  const reactivated = txtNarrativePlaceHouseModule.dispatch({
    gameState: paused.gameState,
    characterDefinitions: paused.characterDefinitions,
    houseDefinition: hostHouseDefinition,
    playerCharacterId,
    sessionState: paused.sessionState,
    request: {
      type: "action",
      actionId: "txt-narrative-reactivate",
    },
  });

  const restartEffect = reactivated.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-txt-narrative-stream"
  );
  assert.ok(restartEffect);
  assert.equal(
    restartEffect.payload.metadata.inputType,
    "reactivate_narrative"
  );
});
