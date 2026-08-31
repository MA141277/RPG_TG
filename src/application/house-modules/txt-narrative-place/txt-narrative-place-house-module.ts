import type { CharacterDefinition, CharacterId } from "../../../domain/character";
import type { GameState } from "../../../domain/game-state";
import type {
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
} from "../../../domain/house-module";
import type { TxtNarrativePlaceSessionState } from "../../../domain/house-modules/txt-narrative-place-session";
import {
  createInitialTxtNarrativeRuntimeState,
  type TxtNarrativeMarkerStep,
  type TxtNarrativeOverlayOption,
  type TxtNarrativeProviderInputType,
  type TxtNarrativeProviderRequest,
  type TxtNarrativeTranscriptEntry,
} from "../../../domain/txt-narrative";
import { assertExists } from "../../../shared/assert";
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
import { buildTxtNarrativeProviderRequest } from "../../txt-narrative/txt-narrative-provider-request-builder";
import { resolveTxtNarrativePlace } from "../../txt-narrative/txt-narrative-place-resolver";

const TXT_NARRATIVE_PHASE_ID = "temple_alms_departure";
const TXT_NARRATIVE_PHASE_LABEL = "皇觉寺遣众化缘";
const TXT_NARRATIVE_SOURCE_HOUSE_ID = "house.kulan.temple";
const TXT_NARRATIVE_SOURCE_PLACE_NAME = "皇觉寺";
const TXT_NARRATIVE_TITLE = "TXT文游";
const TXT_NARRATIVE_SCENE_SUBTITLE = "兵荒与化缘";
const TXT_NARRATIVE_OPENING_REQUEST_ID = "opening-request";
const TXT_NARRATIVE_SELECT_OPTION_PREFIX = "txt-narrative-select-option:";
const TXT_NARRATIVE_REACTIVATE_ACTION_ID = "txt-narrative-reactivate";
const TXT_NARRATIVE_EXIT_ACTION_ID = "txt-narrative-exit";
const TXT_NARRATIVE_CUSTOM_INPUT_FIELD_ID = "txt-narrative-custom-input";
const TXT_NARRATIVE_CUSTOM_INPUT_SUBMIT_ACTION_ID =
  "txt-narrative-submit-custom-input";
const TXT_NARRATIVE_EXIT_OPTION_ID = "option.exit_proactive";
const TXT_NARRATIVE_PLACE_NPCS: Record<string, CharacterId[]> = {
  "house.kulan.temple": [
    "char.kulan_temple_abbot",
    "char.kulan_temple_senior_monk",
  ],
  "house.kulan.grain_shop": [],
  "house.kulan.inn": [],
};

const AUTHORED_TXT_NARRATIVE_PLACES = [
  {
    houseId: "house.kulan.temple",
    placeName: "皇觉寺",
  },
  {
    houseId: "house.kulan.grain_shop",
    placeName: "粮行",
  },
  {
    houseId: "house.kulan.inn",
    placeName: "客栈",
  },
] as const;

const PORTRAIT_ART_CLASS_BY_CHARACTER_ID: Partial<Record<CharacterId, string>> = {
  "char.player": "c-temple-house-portrait-art--player",
  "char.kulan_temple_abbot": "c-temple-house-portrait-art--abbot",
  "char.kulan_temple_senior_monk": "c-temple-house-portrait-art--senior-monk",
};

const AVATAR_ART_CLASS_BY_CHARACTER_ID: Partial<Record<CharacterId, string>> = {
  "char.player": "c-temple-house-avatar-art--player",
  "char.kulan_temple_abbot": "c-temple-house-avatar-art--abbot",
  "char.kulan_temple_senior_monk": "c-temple-house-avatar-art--senior-monk",
};

type TxtNarrativeFieldDispatchInput = HouseModuleDispatchInput<"txt-narrative-place"> & {
  request: Extract<
    HouseModuleDispatchInput<"txt-narrative-place">["request"],
    { type: "field" }
  >;
};

type TxtNarrativeProviderEventDispatchInput =
  HouseModuleDispatchInput<"txt-narrative-place"> & {
    request: Extract<
      HouseModuleDispatchInput<"txt-narrative-place">["request"],
      { type: "txt-narrative-provider-event" }
    >;
  };

type TxtNarrativeActionDispatchInput = HouseModuleDispatchInput<"txt-narrative-place"> & {
  request: Extract<
    HouseModuleDispatchInput<"txt-narrative-place">["request"],
    { type: "action" }
  >;
};

function ensureTxtNarrativeRuntimeState(gameState: GameState): GameState {
  if (gameState.runtime.txtNarrative != null) {
    return gameState;
  }

  return {
    ...gameState,
    runtime: {
      ...gameState.runtime,
      txtNarrative: createInitialTxtNarrativeRuntimeState(),
    },
  };
}

function getTxtNarrativeRuntimeState(gameState: GameState) {
  return gameState.runtime.txtNarrative ?? createInitialTxtNarrativeRuntimeState();
}

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: CharacterId
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `TXT narrative player character "${playerCharacterId}" was not found.`
  );

  return playerCharacter;
}

function getCharacterById(
  characterDefinitions: CharacterDefinition[],
  characterId: CharacterId
): CharacterDefinition | null {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    ) ?? null
  );
}

function buildOpeningPlaceResolution(): TxtNarrativePlaceSessionState["currentPlace"] {
  return {
    requestedName: TXT_NARRATIVE_SOURCE_PLACE_NAME,
    resolvedHouseId: TXT_NARRATIVE_SOURCE_HOUSE_ID,
    resolvedPlaceName: TXT_NARRATIVE_SOURCE_PLACE_NAME,
    strategy: "exact",
    confidence: 1,
    houseId: TXT_NARRATIVE_SOURCE_HOUSE_ID,
    placeName: TXT_NARRATIVE_SOURCE_PLACE_NAME,
    npcIds: [...(TXT_NARRATIVE_PLACE_NPCS[TXT_NARRATIVE_SOURCE_HOUSE_ID] ?? [])],
  };
}

function createInitialSessionState(): TxtNarrativePlaceSessionState {
  return {
    phaseId: TXT_NARRATIVE_PHASE_ID,
    phaseLabel: TXT_NARRATIVE_PHASE_LABEL,
    proactiveMode: "active",
    status: "streaming",
    currentPlace: buildOpeningPlaceResolution(),
    transcript: [],
    pendingOptions: [],
    customInputValue: "",
    currentRequestId: TXT_NARRATIVE_OPENING_REQUEST_ID,
    requestSequence: 1,
    knownNpcIds: [...(TXT_NARRATIVE_PLACE_NPCS[TXT_NARRATIVE_SOURCE_HOUSE_ID] ?? [])],
    statusNotice: "正在继续推演……",
    errorNotice: null,
  };
}

function buildKnownPlaces() {
  return AUTHORED_TXT_NARRATIVE_PLACES.map((place) => ({
    houseId: place.houseId,
    placeName: place.placeName,
  }));
}

function buildNextRequestId(nextSequence: number): string {
  return `txt-narrative-request-${nextSequence}`;
}

function resolvePortraitArtClassName(
  speakerId?: string,
  speakerName?: string
): string | undefined {
  if (speakerId != null) {
    const knownClass = PORTRAIT_ART_CLASS_BY_CHARACTER_ID[speakerId];
    if (knownClass != null) {
      return knownClass;
    }
  }

  if (speakerName === "皇觉寺住持") {
    return PORTRAIT_ART_CLASS_BY_CHARACTER_ID["char.kulan_temple_abbot"];
  }

  if (speakerName === "寺中师兄") {
    return PORTRAIT_ART_CLASS_BY_CHARACTER_ID["char.kulan_temple_senior_monk"];
  }

  return undefined;
}

function updateRuntimeLocation(
  gameState: GameState,
  phaseId: string,
  place: TxtNarrativePlaceSessionState["currentPlace"]
): GameState {
  const nextState = ensureTxtNarrativeRuntimeState(gameState);
  const currentRuntime = getTxtNarrativeRuntimeState(nextState);
  const temporaryPlaces =
    place.strategy === "temporary_generated"
      ? [
          ...currentRuntime.temporaryPlaces.filter(
            (entry) => entry.requestedName !== place.requestedName
          ),
          {
            requestedName: place.requestedName,
            strategy: place.strategy,
            confidence: place.confidence,
            ...(place.note == null ? {} : { note: place.note }),
          },
        ]
      : currentRuntime.temporaryPlaces;

  return {
    ...nextState,
    runtime: {
      ...nextState.runtime,
      txtNarrative: {
        ...currentRuntime,
        currentPhaseId: phaseId,
        currentPlaceHouseId: place.houseId,
        currentPlaceName: place.placeName,
        temporaryPlaces,
      },
    },
  };
}

function setTxtNarrativeFlag(gameState: GameState, key: string): GameState {
  const nextState = ensureTxtNarrativeRuntimeState(gameState);
  const currentRuntime = getTxtNarrativeRuntimeState(nextState);

  return {
    ...nextState,
    runtime: {
      ...nextState.runtime,
      txtNarrative: {
        ...currentRuntime,
        flags: {
          ...currentRuntime.flags,
          [key]: true,
        },
      },
    },
  };
}

function appendTranscriptEntry(
  sessionState: TxtNarrativePlaceSessionState,
  entry: TxtNarrativeTranscriptEntry
): TxtNarrativePlaceSessionState {
  return {
    ...sessionState,
    transcript: [...sessionState.transcript, entry],
  };
}

function createPlayerTranscriptEntry(
  input: Pick<
    HouseModuleDispatchInput<"txt-narrative-place">,
    "characterDefinitions" | "playerCharacterId"
  >,
  text: string
): TxtNarrativeTranscriptEntry {
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const portraitArtClassName =
    PORTRAIT_ART_CLASS_BY_CHARACTER_ID[playerCharacter.id] ??
    PORTRAIT_ART_CLASS_BY_CHARACTER_ID["char.player"];

  return {
    id: `player:${text}`,
    type: "dialogue",
    text,
    speakerId: playerCharacter.id,
    speakerName: playerCharacter.name,
    ...(portraitArtClassName == null ? {} : { portraitArtClassName }),
  };
}

function applyNarrativeStep(
  sessionState: TxtNarrativePlaceSessionState,
  gameState: GameState,
  step: TxtNarrativeMarkerStep,
  requestId: string,
  stepIndex: number
): {
  sessionState: TxtNarrativePlaceSessionState;
  gameState: GameState;
} {
  if (step.type === "narration") {
    return {
      sessionState: appendTranscriptEntry(sessionState, {
        id: `${requestId}:narration:${stepIndex}`,
        type: "narration",
        text: step.text,
      }),
      gameState,
    };
  }

  if (step.type === "dialogue") {
    const portraitArtClassName = resolvePortraitArtClassName(
      step.speakerId,
      step.speakerName
    );
    return {
      sessionState: appendTranscriptEntry(sessionState, {
        id: `${requestId}:dialogue:${stepIndex}`,
        type: "dialogue",
        text: step.text,
        speakerId: step.speakerId,
        speakerName: step.speakerName,
        ...(portraitArtClassName == null ? {} : { portraitArtClassName }),
      }),
      gameState,
    };
  }

  if (step.type === "flag") {
    return {
      sessionState,
      gameState: setTxtNarrativeFlag(gameState, step.key),
    };
  }

  if (step.type === "scene_change") {
    const requestedName = step.placeName ?? sessionState.currentPlace.placeName;
    const resolvedPlace = resolveTxtNarrativePlace({
      requestedName,
      knownPlaces: buildKnownPlaces(),
    });
    const houseId = resolvedPlace.resolvedHouseId ?? null;
    const placeName = resolvedPlace.resolvedPlaceName ?? requestedName;
    const nextPlace: TxtNarrativePlaceSessionState["currentPlace"] = {
      ...resolvedPlace,
      houseId,
      placeName,
      npcIds: [...(houseId == null ? [] : TXT_NARRATIVE_PLACE_NPCS[houseId] ?? [])],
    };

    return {
      sessionState: {
        ...sessionState,
        currentPlace: nextPlace,
        knownNpcIds: [...nextPlace.npcIds],
      },
      gameState: updateRuntimeLocation(gameState, sessionState.phaseId, nextPlace),
    };
  }

  if (step.type === "choice") {
    return {
      sessionState: {
        ...sessionState,
        pendingOptions: step.options.map((option) => ({
          id: option.id,
          label: option.label,
          actionId: `${TXT_NARRATIVE_SELECT_OPTION_PREFIX}${option.id}`,
          ...(option.recommended == null
            ? {}
            : { recommended: option.recommended }),
          ...(option.kind == null ? {} : { kind: option.kind }),
        })),
      },
      gameState,
    };
  }

  return {
    sessionState,
    gameState,
  };
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"txt-narrative-place">,
    "characterDefinitions"
  > & { gameState: GameState },
  sessionState: TxtNarrativePlaceSessionState,
  sideEffects?: HouseModuleTransitionResult<"txt-narrative-place">["sideEffects"]
): HouseModuleTransitionResult<"txt-narrative-place"> {
  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    ...(sideEffects == null ? {} : { sideEffects }),
  };
}

function createStartStreamSideEffect(
  sessionState: TxtNarrativePlaceSessionState,
  input: {
    requestId: string;
    inputType: TxtNarrativeProviderInputType;
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    freeInputText?: string;
  }
): Extract<
  NonNullable<HouseModuleTransitionResult<"txt-narrative-place">["sideEffects"]>[number],
  { type: "start-txt-narrative-stream" }
> {
  const payload: TxtNarrativeProviderRequest = buildTxtNarrativeProviderRequest({
    requestId: input.requestId,
    phaseId: sessionState.phaseId,
    houseId: sessionState.currentPlace.houseId ?? TXT_NARRATIVE_SOURCE_HOUSE_ID,
    placeName: sessionState.currentPlace.placeName,
    inputType: input.inputType,
    transcript: sessionState.transcript,
    ...(input.selectedOptionId == null
      ? {}
      : { selectedOptionId: input.selectedOptionId }),
    ...(input.selectedOptionLabel == null
      ? {}
      : { selectedOptionLabel: input.selectedOptionLabel }),
    ...(input.freeInputText == null
      ? {}
      : { freeInputText: input.freeInputText }),
  });

  return {
    type: "start-txt-narrative-stream",
    requestId: input.requestId,
    payload,
  };
}

function buildEnterResult(
  input: Parameters<HouseModuleDefinition<"txt-narrative-place">["enter"]>[0]
): HouseModuleTransitionResult<"txt-narrative-place"> {
  const sessionState = createInitialSessionState();
  const nextGameState = updateRuntimeLocation(
    ensureTxtNarrativeRuntimeState(input.gameState),
    TXT_NARRATIVE_PHASE_ID,
    sessionState.currentPlace
  );

  return {
    gameState: nextGameState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    sideEffects: [
      createStartStreamSideEffect(sessionState, {
        requestId: TXT_NARRATIVE_OPENING_REQUEST_ID,
        inputType: "enter_place",
      }),
    ],
  };
}

function startFollowUpRequest(
  input: HouseModuleDispatchInput<"txt-narrative-place">,
  sessionState: TxtNarrativePlaceSessionState,
  requestInput: {
    inputType: TxtNarrativeProviderInputType;
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    freeInputText?: string;
  }
): HouseModuleTransitionResult<"txt-narrative-place"> {
  const nextSequence = sessionState.requestSequence + 1;
  const requestId = buildNextRequestId(nextSequence);
  const nextSessionState: TxtNarrativePlaceSessionState = {
    ...sessionState,
    proactiveMode:
      requestInput.inputType === "reactivate_narrative"
        ? "active"
        : sessionState.proactiveMode,
    status: "streaming",
    pendingOptions: [],
    currentRequestId: requestId,
    requestSequence: nextSequence,
    statusNotice: "正在继续推演……",
    errorNotice: null,
    ...(requestInput.inputType === "free_input" ? { customInputValue: "" } : {}),
  };

  return createTransitionResult(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    },
    nextSessionState,
    [createStartStreamSideEffect(nextSessionState, { requestId, ...requestInput })]
  );
}

function handleField(
  input: TxtNarrativeFieldDispatchInput,
  sessionState: TxtNarrativePlaceSessionState
): HouseModuleTransitionResult<"txt-narrative-place"> {
  if (input.request.fieldId !== TXT_NARRATIVE_CUSTOM_INPUT_FIELD_ID) {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState
    );
  }

  return createTransitionResult(
    {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    },
    {
      ...sessionState,
      customInputValue: input.request.value,
    }
  );
}

function handleProviderEvent(
  input: TxtNarrativeProviderEventDispatchInput,
  sessionState: TxtNarrativePlaceSessionState
): HouseModuleTransitionResult<"txt-narrative-place"> {
  if (
    sessionState.currentRequestId != null &&
    input.request.requestId !== sessionState.currentRequestId
  ) {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState
    );
  }

  if (input.request.event.type === "start") {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      {
        ...sessionState,
        status: "streaming",
        statusNotice: "正在继续推演……",
        errorNotice: null,
      }
    );
  }

  if (input.request.event.type === "error") {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      {
        ...sessionState,
        status: "error",
        currentRequestId: null,
        statusNotice: null,
        errorNotice: input.request.event.message,
      }
    );
  }

  const steps =
    input.request.event.type === "complete"
      ? input.request.event.allSteps
      : [input.request.event.step];
  let nextSessionState: TxtNarrativePlaceSessionState = {
    ...sessionState,
    pendingOptions: [],
  };
  let nextGameState = input.gameState;
  steps.forEach((step: TxtNarrativeMarkerStep, index: number) => {
    const applied = applyNarrativeStep(
      nextSessionState,
      nextGameState,
      step,
      input.request.requestId,
      index
    );
    nextSessionState = applied.sessionState;
    nextGameState = applied.gameState;
  });

  if (input.request.event.type === "complete") {
    nextSessionState = {
      ...nextSessionState,
      status:
        nextSessionState.pendingOptions.length > 0 ? "awaiting-choice" : "idle",
      currentRequestId: null,
      statusNotice: null,
      errorNotice: null,
    };
  }

  return createTransitionResult(
    {
      gameState: nextGameState,
      characterDefinitions: input.characterDefinitions,
    },
    nextSessionState
  );
}

function handleAction(
  input: TxtNarrativeActionDispatchInput,
  sessionState: TxtNarrativePlaceSessionState
): HouseModuleTransitionResult<"txt-narrative-place"> {
  if (input.request.actionId === TXT_NARRATIVE_REACTIVATE_ACTION_ID) {
    return startFollowUpRequest(input, sessionState, {
      inputType: "reactivate_narrative",
    });
  }

  if (input.request.actionId === TXT_NARRATIVE_EXIT_ACTION_ID) {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      {
        ...sessionState,
        proactiveMode: "paused",
        status: "idle",
        currentRequestId: null,
        pendingOptions: [],
        statusNotice: "主动推演已暂停。",
        errorNotice: null,
      }
    );
  }

  if (input.request.actionId === TXT_NARRATIVE_CUSTOM_INPUT_SUBMIT_ACTION_ID) {
    const customInputValue = sessionState.customInputValue.trim();
    if (customInputValue.length === 0) {
      return createTransitionResult(
        {
          gameState: input.gameState,
          characterDefinitions: input.characterDefinitions,
        },
        {
          ...sessionState,
          statusNotice: "请先输入你的回应。",
        }
      );
    }

    const nextSessionState = appendTranscriptEntry(
      sessionState,
      createPlayerTranscriptEntry(input, customInputValue)
    );
    return startFollowUpRequest(
      {
        ...input,
        gameState: input.gameState,
      },
      nextSessionState,
      {
        inputType: "free_input",
        freeInputText: customInputValue,
      }
    );
  }

  if (
    !input.request.actionId.startsWith(TXT_NARRATIVE_SELECT_OPTION_PREFIX)
  ) {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState
    );
  }

  const optionId = input.request.actionId.slice(
    TXT_NARRATIVE_SELECT_OPTION_PREFIX.length
  );
  if (optionId === TXT_NARRATIVE_EXIT_OPTION_ID) {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      {
        ...sessionState,
        proactiveMode: "paused",
        status: "idle",
        currentRequestId: null,
        pendingOptions: [],
        statusNotice: "主动推演已暂停，可稍后继续。",
        errorNotice: null,
      }
    );
  }

  const selectedOption =
    sessionState.pendingOptions.find((option) => option.id === optionId) ?? null;
  if (selectedOption == null) {
    return createTransitionResult(
      {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState
    );
  }

  const nextSessionState = appendTranscriptEntry(
    sessionState,
    createPlayerTranscriptEntry(input, selectedOption.label)
  );
  return startFollowUpRequest(input, nextSessionState, {
    inputType: "select_option",
    selectedOptionId: selectedOption.id,
    selectedOptionLabel: selectedOption.label,
  });
}

function buildStandbyRoster(
  characterDefinitions: CharacterDefinition[],
  sessionState: TxtNarrativePlaceSessionState,
  houseDefinitionDefaultCharacterId: CharacterId | null
) {
  const actors = sessionState.currentPlace.npcIds
    .map((characterId) => getCharacterById(characterDefinitions, characterId))
    .filter((characterDefinition): characterDefinition is CharacterDefinition =>
      characterDefinition != null
    )
    .map((characterDefinition) => ({
      characterId: characterDefinition.id,
      name: characterDefinition.name,
      ...(characterDefinition.title == null
        ? {}
        : { title: characterDefinition.title }),
      ...(AVATAR_ART_CLASS_BY_CHARACTER_ID[characterDefinition.id] == null
        ? {}
        : {
            avatarArtClassName:
              AVATAR_ART_CLASS_BY_CHARACTER_ID[characterDefinition.id],
          }),
      ...(PORTRAIT_ART_CLASS_BY_CHARACTER_ID[characterDefinition.id] == null
        ? {}
        : {
            portraitArtClassName:
              PORTRAIT_ART_CLASS_BY_CHARACTER_ID[characterDefinition.id],
          }),
    }));

  return orderHouseStandbyRoster({
    primaryCharacterId: houseDefinitionDefaultCharacterId,
    actors,
  });
}

function buildViewModel(
  input: Parameters<HouseModuleDefinition<"txt-narrative-place">["selectViewModel"]>[0],
  sessionState: TxtNarrativePlaceSessionState
): HouseModuleViewModel {
  const standbyRoster = buildStandbyRoster(
    input.characterDefinitions,
    sessionState,
    input.houseDefinition.defaultCharacterId
  );

  return {
    moduleId: "txt-narrative-place",
    houseId: input.houseDefinition.id,
    sceneTitle: input.houseDefinition.name,
    sceneSubtitle: TXT_NARRATIVE_SCENE_SUBTITLE,
    standbyRoster,
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "txt-narrative",
      title: TXT_NARRATIVE_TITLE,
      placeName: sessionState.currentPlace.placeName,
      phaseLabel: sessionState.phaseLabel,
      isStreaming: sessionState.status === "streaming",
      paused: sessionState.proactiveMode === "paused",
      transcript: sessionState.transcript,
      options: sessionState.pendingOptions,
      customInput: {
        fieldId: TXT_NARRATIVE_CUSTOM_INPUT_FIELD_ID,
        submitActionId: TXT_NARRATIVE_CUSTOM_INPUT_SUBMIT_ACTION_ID,
        placeholder: "输入你的回应",
        value: sessionState.customInputValue,
      },
      controlActions: {
        exitActionId: TXT_NARRATIVE_EXIT_ACTION_ID,
        reactivateActionId: TXT_NARRATIVE_REACTIVATE_ACTION_ID,
      },
      statusNotice: sessionState.statusNotice,
      errorNotice: sessionState.errorNotice,
    },
    leaveAction: {
      id: "leave-house",
      label: input.houseDefinition.backAction.label,
      tone: "accent",
    },
  };
}

export const txtNarrativePlaceHouseModule: HouseModuleDefinition<"txt-narrative-place"> =
  {
    moduleId: "txt-narrative-place",
    enter(input) {
      return buildEnterResult(input);
    },
    dispatch(input) {
      const sessionState = input.sessionState ?? createInitialSessionState();
      if (input.request.type === "field") {
        return handleField(input as TxtNarrativeFieldDispatchInput, sessionState);
      }

      if (input.request.type === "txt-narrative-provider-event") {
        return handleProviderEvent(
          input as TxtNarrativeProviderEventDispatchInput,
          sessionState
        );
      }

      return handleAction(input as TxtNarrativeActionDispatchInput, sessionState);
    },
    leave(input) {
      const sessionState = input.sessionState;
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: null,
        ...(sessionState?.currentRequestId == null
          ? {}
          : {
              sideEffects: [
                {
                  type: "cancel-txt-narrative-stream" as const,
                  requestId: sessionState.currentRequestId,
                },
              ],
            }),
      };
    },
    selectViewModel(input): HouseModuleViewModel {
      const sessionState = input.sessionState ?? createInitialSessionState();
      return buildViewModel(input, sessionState);
    },
  };
