import {
  teaHouseBossDialogueTextIds,
  teaHouseBossGreetingTextIds,
  teaHouseBossIntelTextIds,
  teaHouseBossOpenTextIds,
  teaHouseBossProfile,
  teaHouseLowIntelChance,
  teaHouseTeaCost,
} from "../../../content/houses/tea-house-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type {
  TeaHouseDialoguePhase,
  TeaHouseOverlayState,
  TeaHouseSessionState,
} from "../../../domain/house-modules/tea-house-session";
import type {
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import {
  getTeaHouseIntelVariableKey,
  getTeaHouseTimeVariableKey,
  type TeaHouseActionOutcome,
  type TeaHouseDebateSummary,
  type TeaHouseTopicCard,
  TEA_HOUSE_TOPIC_CARDS,
} from "../../../domain/tea-house";
import { formatPlayableSkillActionLabel } from "../../../domain/playable-skill";
import { assertExists } from "../../../shared/assert";
import { pickRandom } from "../../../shared/random";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
import { sampleCityNpcIdsForLocation } from "../../city-npcs/city-npc-pool-state";
import {
  createTeaHouseBossActor,
  createTeaHouseGuestActors,
  type TeaHouseActor,
} from "../../tea-house/tea-house-actors";
import {
  createDebateNextRoundTimer,
  createInitialTeaHouseDebateState,
  pickTeaHouseAiTopic,
  resolveTeaHouseDebateRound,
} from "../../tea-house/tea-house-debate";
import {
  increaseTeaHouseIntel,
  increaseTeaHouseTime,
  mutatePlayerGold,
  mutatePlayerDebateLevel,
  mutateTeaHouseActorFavorability,
} from "../../tea-house/tea-house-mutations";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  canAffordActivityCost,
  spendPlayerStamina,
} from "../../player/player-stamina";
import {
  convertHouseActivityDaysToSegments,
  formatHouseActivityCostLine,
  getHouseMinigameDurationDays,
} from "../../house/house-activity-costs";
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
import { createCouncilInsufficientTimeDialogueOverride } from "../../time/council-insufficient-time-dialogue";
import { getInsufficientDaysForTimedActivity } from "../../time/council-priority";
import { createInitialTeaHouseSessionState } from "./tea-house-session-state";

const DEBATE_INTERVAL_ID = "tea-house-debate";
const MAX_TEA_HOUSE_GUESTS = 2;
const SELECT_ACTOR_ACTION_PREFIX = "select-actor:";
const DEBATE_TOPIC_ACTION_PREFIX = "debate-topic:";
const DEBATE_CONFIRM_ACTION_ID = "confirm-debate-topic";
const CONFIRM_START_DEBATE_ACTION_ID = "confirm-start-debate";
const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in tea house module.`
  );
  return playerCharacter;
}

function readNumericVariable(
  state: HouseModuleDispatchInput["gameState"],
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"tea-house">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"tea-house">>
): HouseModuleTransitionResult<"tea-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"tea-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TeaHouseSessionState | null,
  patch: Partial<TeaHouseSessionState>,
  sideEffects?: HouseModuleTransitionResult<"tea-house">["sideEffects"]
): HouseModuleTransitionResult<"tea-house"> {
  if (sessionState == null) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
      ...(sideEffects == null ? {} : { sideEffects }),
    };
  }

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      ...patch,
    },
    ...(sideEffects == null ? {} : { sideEffects }),
  };
}

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): TeaHouseOverlayState {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function withDialoguePhase(
  input: Pick<
    HouseModuleDispatchInput<"tea-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TeaHouseSessionState | null,
  dialoguePhase: TeaHouseDialoguePhase,
  dialogueLines?: string[]
): HouseModuleTransitionResult<"tea-house"> {
  if (sessionState == null) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
    };
  }

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      dialoguePhase,
      dialogueOverride: null,
      ...(dialogueLines == null ? {} : { dialogueLines }),
    },
  };
}

function withCouncilInsufficientTimeDialogue(
  input: Pick<
    HouseModuleDispatchInput<"tea-house">,
    "gameState" | "characterDefinitions" | "playerCharacterId"
  >,
  sessionState: TeaHouseSessionState | null
): HouseModuleTransitionResult<"tea-house"> {
  return withSessionState(input, sessionState, {
    dialoguePhase: "open",
    dialogueOverride: createCouncilInsufficientTimeDialogueOverride(
      input.playerCharacterId
    ),
    overlay: null,
  });
}

function createTeaHouseActors(
  gameState: HouseModuleDispatchInput["gameState"],
  houseId: string,
  cityId: string,
  sessionState: TeaHouseSessionState | null
): TeaHouseActor[] {
  const bossActor = createTeaHouseBossActor(gameState, houseId);
  const guestActors =
    sessionState == null
      ? []
      : createTeaHouseGuestActors(
          gameState,
          defaultRuntimeContent.cityNpcPools,
          cityId,
          sessionState.guestNpcIds
        );

  return [bossActor, ...guestActors];
}

function getTeaHouseTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function resolveTeaHouseText(
  textEntriesById: Record<string, string>,
  textId: string,
  fallback?: string
): string {
  return resolveTextEntry(
    textEntriesById,
    textId,
    fallback ?? `MISSING_TEXT:${textId}`
  );
}

function resolveTeaHouseTemplateText(
  textEntriesById: Record<string, string>,
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback?: string
): string {
  return resolveTextTemplateEntry(
    textEntriesById,
    textId,
    values,
    fallback ?? `MISSING_TEXT:${textId}`
  );
}

function resolveTeaHouseTextLines(
  textEntriesById: Record<string, string>,
  textIds: readonly string[]
): string[] {
  return textIds.map((textId) => resolveTeaHouseText(textEntriesById, textId));
}

function pickRandomResolvedTeaHouseText(
  textEntriesById: Record<string, string>,
  textIds: readonly string[]
): string {
  const textId = pickRandom(textIds);
  return resolveTeaHouseText(textEntriesById, textId);
}

function getSelectedActor(
  gameState: HouseModuleDispatchInput["gameState"],
  houseId: string,
  cityId: string,
  sessionState: TeaHouseSessionState | null
): TeaHouseActor | null {
  const actors = createTeaHouseActors(gameState, houseId, cityId, sessionState);
  const selectedActorId = sessionState?.selectedActorId ?? teaHouseBossProfile.actorId;

  return (
    actors.find((actor) => actor.id === selectedActorId) ??
    actors.find((actor) => actor.id === teaHouseBossProfile.actorId) ??
    null
  );
}

function pickActorDialogueLine(
  actor: TeaHouseActor,
  textEntriesById?: Record<string, string>
): string {
  if (actor.isFixedHost) {
    return pickRandomResolvedTeaHouseText(
      getTeaHouseTextEntries(textEntriesById),
      teaHouseBossDialogueTextIds
    );
  }

  return actor.dialoguePool.length > 0
    ? pickRandom(actor.dialoguePool)
    : resolveTeaHouseText(
        getTeaHouseTextEntries(textEntriesById),
        "runtime.zhu_yuanzhang.tea_house.dialogue.default"
      );
}

function getActorGreetingLines(
  actor: TeaHouseActor,
  textEntriesById?: Record<string, string>
): string[] {
  const entries = getTeaHouseTextEntries(textEntriesById);
  if (actor.isFixedHost) {
    return resolveTeaHouseTextLines(entries, teaHouseBossGreetingTextIds);
  }

  return [
    resolveTeaHouseText(
      entries,
      "runtime.zhu_yuanzhang.tea_house.greeting.guest.001"
    ),
  ];
}

function getActorOpenLines(
  actor: TeaHouseActor,
  textEntriesById?: Record<string, string>
): string[] {
  const entries = getTeaHouseTextEntries(textEntriesById);
  if (actor.isFixedHost) {
    return resolveTeaHouseTextLines(entries, teaHouseBossOpenTextIds);
  }

  return [
    resolveTeaHouseText(
      entries,
      "runtime.zhu_yuanzhang.tea_house.open.guest.001"
    ),
  ];
}

function pickActorIntelLine(
  actor: TeaHouseActor,
  textEntriesById?: Record<string, string>
): string {
  if (actor.isFixedHost) {
    return pickRandomResolvedTeaHouseText(
      getTeaHouseTextEntries(textEntriesById),
      teaHouseBossIntelTextIds
    );
  }

  return actor.intelPool.length > 0
    ? pickRandom(actor.intelPool)
    : resolveTeaHouseText(
        getTeaHouseTextEntries(textEntriesById),
        "runtime.zhu_yuanzhang.tea_house.intel.default"
      );
}

function formatOutcomeSummaryLines(outcome: TeaHouseActionOutcome): string[] {
  const lines = [
    `关系 ${outcome.relationshipChange >= 0 ? "+" : ""}${outcome.relationshipChange}`,
    `情报 +${outcome.intelGain}`,
    `金钱 ${outcome.moneyChange >= 0 ? "+" : ""}${outcome.moneyChange}`,
    `时间 +${outcome.timeCost}`,
  ];

  if (outcome.attributeChange.length > 0) {
    lines.push(
      ...outcome.attributeChange.map(
        (change) =>
          `${change.label} ${change.delta >= 0 ? "+" : ""}${change.delta}`
      )
    );
  }

  return lines;
}

function applyTeaHouseOutcome(
  input: Pick<
    HouseModuleDispatchInput<"tea-house">,
    "gameState" | "characterDefinitions" | "playerCharacterId" | "houseDefinition"
  >,
  actor: TeaHouseActor,
  outcome: TeaHouseActionOutcome
): Pick<HouseModuleTransitionResult<"tea-house">, "gameState" | "characterDefinitions"> {
  let nextState = input.gameState;
  let nextCharacterDefinitions = input.characterDefinitions;

  if (outcome.relationshipChange !== 0) {
    nextState = mutateTeaHouseActorFavorability(
      nextState,
      input.houseDefinition.id,
      input.houseDefinition.cityId,
      actor.id,
      actor.isFixedHost,
      outcome.relationshipChange
    );
  }

  if (outcome.moneyChange !== 0) {
    const goldMutation = mutatePlayerGold(
      nextState,
      nextCharacterDefinitions,
      input.playerCharacterId,
      outcome.moneyChange
    );
    nextState = goldMutation.state;
    nextCharacterDefinitions = goldMutation.characterDefinitions;
  }

  if (outcome.intelGain !== 0) {
    nextState = increaseTeaHouseIntel(
      nextState,
      input.houseDefinition.id,
      outcome.intelGain
    );
  }

  if (outcome.timeCost !== 0) {
    nextState = increaseTeaHouseTime(
      nextState,
      input.houseDefinition.id,
      outcome.timeCost
    );
  }

  if (outcome.attributeChange.length > 0) {
    for (const attributeChange of outcome.attributeChange) {
      if (attributeChange.key === "rhetoric" && attributeChange.delta !== 0) {
        const rhetoricMutation = mutatePlayerDebateLevel(
          nextState,
          nextCharacterDefinitions,
          input.playerCharacterId,
          attributeChange.delta
        );
        nextState = rhetoricMutation.state;
        nextCharacterDefinitions = rhetoricMutation.characterDefinitions;
      }
    }
  }

  return {
    gameState: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}

function finalizeInteraction(
  input: HouseModuleDispatchInput<"tea-house">,
  sessionState: TeaHouseSessionState | null,
  actor: TeaHouseActor,
  dialogueLines: string[],
  outcome: TeaHouseActionOutcome,
  title: string,
  extraParagraphs: string[] = [],
  tone?: "info" | "success" | "warning"
): HouseModuleTransitionResult<"tea-house"> {
  const mutation = applyTeaHouseOutcome(input, actor, outcome);

  return {
    gameState: mutation.gameState,
    characterDefinitions: mutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            dialogueLines,
            dialoguePhase: "open",
            overlay: createAlertOverlay(
              title,
              [...dialogueLines, ...extraParagraphs, ...formatOutcomeSummaryLines(outcome)],
              tone
            ),
          },
    timeAdvanceCost: outcome.timeCost,
  };
}

function createActivityConfirmOverlay(
  title: string,
  paragraphs: string[],
  confirmActionId: string
): HouseActivityConfirmOverlayState {
  return {
    type: "activity-confirm",
    title,
    paragraphs,
    confirmActionId,
    confirmLabel: "现在开始",
    cancelActionId: CANCEL_ACTIVITY_CONFIRM_ACTION_ID,
    cancelLabel: "改日再论",
    tone: "info",
  };
}

function parseActorActionId(actionId: string): string | null {
  return actionId.startsWith(SELECT_ACTOR_ACTION_PREFIX)
    ? actionId.slice(SELECT_ACTOR_ACTION_PREFIX.length)
    : null;
}

function parseDebateTopicActionId(actionId: string): TeaHouseTopicCard | null {
  if (!actionId.startsWith(DEBATE_TOPIC_ACTION_PREFIX)) {
    return null;
  }

  const topic = actionId.slice(DEBATE_TOPIC_ACTION_PREFIX.length);
  return TEA_HOUSE_TOPIC_CARDS.includes(topic as TeaHouseTopicCard)
    ? (topic as TeaHouseTopicCard)
    : null;
}

function buildDebateOutcomeParagraphs(
  actor: TeaHouseActor,
  outcome: TeaHouseDebateSummary,
  roundLines: string[],
  effectSummaryLines: string[]
): string[] {
  const winnerText =
    outcome.winner === "player"
      ? "你压住了对方的气势。"
      : outcome.winner === "npc"
        ? `${actor.name}在舌锋上占了上风。`
        : "双方争得难分高下。";

  return [
    ...roundLines,
    winnerText,
    `回合数：${outcome.rounds}`,
    `你剩余气势：${outcome.playerSpiritRemaining}`,
    `${actor.name}剩余气势：${outcome.npcSpiritRemaining}`,
    `超时次数：${outcome.timeoutCount}`,
    ...effectSummaryLines,
  ];
}

function createDebateOverlay(
  actor: TeaHouseActor,
  playerSpirit: number,
  npcSpirit: number,
  timeoutCount: number,
  consecutivePlayerWins: number,
  round: number,
  plannedNpcTopic: TeaHouseTopicCard,
  selectedPlayerTopic: TeaHouseTopicCard | null = null,
  lastRoundSummary: string[] = [],
  lastPlayerTopic: TeaHouseTopicCard | null = null,
  lastNpcTopic: TeaHouseTopicCard | null = null,
  lastRoundWinner: "player" | "npc" | "draw" | null = null
): TeaHouseOverlayState {
  return {
    type: "debate",
    actorId: actor.id,
    actorName: actor.name,
    round,
    secondsLeft: createDebateNextRoundTimer(),
    playerSpirit,
    npcSpirit,
    timeoutCount,
    consecutivePlayerWins,
    plannedNpcTopic,
    selectedPlayerTopic,
    lastPlayerTopic,
    lastNpcTopic,
    lastRoundWinner,
    lastRoundLines: lastRoundSummary,
  };
}

function resolveDebateTurn(
  input: HouseModuleDispatchInput<"tea-house">,
  sessionState: TeaHouseSessionState | null,
  playerTopic: TeaHouseTopicCard,
  didTimeout: boolean
): HouseModuleTransitionResult<"tea-house"> {
  const overlay = sessionState?.overlay;
  if (overlay?.type !== "debate") {
    return createTransitionResult(input);
  }

  const actor = getSelectedActor(
    input.gameState,
    input.houseDefinition.id,
    input.houseDefinition.cityId,
    sessionState
  );
  if (actor == null) {
    return createTransitionResult(input);
  }

  const roundResult = resolveTeaHouseDebateRound(
    {
      round: overlay.round,
      playerSpirit: overlay.playerSpirit,
      npcSpirit: overlay.npcSpirit,
      timeoutCount: overlay.timeoutCount,
      consecutivePlayerWins: overlay.consecutivePlayerWins,
    },
    playerTopic,
    overlay.plannedNpcTopic,
    didTimeout
  );

  if (roundResult.outcome != null) {
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const durationDays = getHouseMinigameDurationDays(
      Math.max(0, playerCharacter.skills?.rhetoric ?? 0)
    );
    const finishedOutcome =
      roundResult.outcome.winner === "player"
        ? {
            relationshipChange: 2,
            attributeChange: [{ key: "rhetoric" as const, label: "辩才", delta: 1 }],
            intelGain: Math.random() < teaHouseLowIntelChance ? 1 : 0,
            moneyChange: 0,
            timeCost: durationDays,
          }
        : roundResult.outcome.winner === "npc"
          ? {
              relationshipChange: -1,
              attributeChange: [],
              intelGain: 0,
              moneyChange: 0,
              timeCost: durationDays,
            }
          : {
              relationshipChange: 0,
              attributeChange: [],
              intelGain: 0,
              moneyChange: 0,
              timeCost: durationDays,
            };

    const mutation = applyTeaHouseOutcome(input, actor, finishedOutcome);
    const staminaMutation = spendPlayerStamina(
      mutation.gameState,
      mutation.characterDefinitions,
      input.playerCharacterId
    );
    const effectSummaryLines = [
      ...formatOutcomeSummaryLines(finishedOutcome),
      `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
    ];

    return {
      gameState: staminaMutation.state,
      characterDefinitions: staminaMutation.characterDefinitions,
      sessionState:
        sessionState == null
          ? sessionState
          : {
              ...sessionState,
              dialogueLines: roundResult.lines,
              dialoguePhase: "open",
              overlay: createAlertOverlay(
                "舌战结果",
                buildDebateOutcomeParagraphs(
                  actor,
                  roundResult.outcome,
                  roundResult.lines,
                  effectSummaryLines
                ),
                roundResult.outcome.winner === "player"
                  ? "success"
                  : roundResult.outcome.winner === "npc"
                    ? "warning"
                    : "info"
              ),
            },
      sideEffects: [{ type: "stop-interval", intervalId: DEBATE_INTERVAL_ID }],
      timeAdvanceCost: convertHouseActivityDaysToSegments(
        finishedOutcome.timeCost
      ),
    };
  }

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            dialogueLines: roundResult.lines,
            dialoguePhase: "open",
            overlay: createDebateOverlay(
              actor,
              roundResult.nextState.playerSpirit,
              roundResult.nextState.npcSpirit,
              roundResult.nextState.timeoutCount,
              roundResult.nextState.consecutivePlayerWins,
              roundResult.nextState.round,
              pickTeaHouseAiTopic(actor.personality),
              null,
              roundResult.lines,
              roundResult.playerTopic,
              roundResult.npcTopic,
              roundResult.winner
            ),
          },
  };
}

function handleTick(
  input: HouseModuleDispatchInput<"tea-house">,
  sessionState: TeaHouseSessionState | null
): HouseModuleTransitionResult<"tea-house"> {
  if (input.request.type !== "tick" || input.request.tickId !== DEBATE_INTERVAL_ID) {
    return createTransitionResult(input);
  }

  const overlay = sessionState?.overlay;
  if (overlay?.type !== "debate") {
    return createTransitionResult(input, {
      sideEffects: [{ type: "stop-interval", intervalId: DEBATE_INTERVAL_ID }],
    });
  }

  if (overlay.secondsLeft <= 1) {
    return resolveDebateTurn(
      input,
      sessionState,
      overlay.selectedPlayerTopic ?? pickRandom([...TEA_HOUSE_TOPIC_CARDS]),
      true
    );
  }

  return withSessionState(input, sessionState, {
    overlay: {
      ...overlay,
      secondsLeft: overlay.secondsLeft - 1,
    },
  });
}

function handleActorAction(
  input: HouseModuleDispatchInput<"tea-house">,
  sessionState: TeaHouseSessionState | null
): HouseModuleTransitionResult<"tea-house"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  if (
    input.request.actionId === "close-alert" ||
    input.request.actionId === CANCEL_ACTIVITY_CONFIRM_ACTION_ID
  ) {
    return withSessionState(
      input,
      sessionState,
      { overlay: null },
      [{ type: "stop-interval", intervalId: DEBATE_INTERVAL_ID }]
    );
  }

  const selectedActor = getSelectedActor(
    input.gameState,
    input.houseDefinition.id,
    input.houseDefinition.cityId,
    sessionState
  );
  const actorId = parseActorActionId(input.request.actionId);
  if (actorId != null) {
    const nextActor = createTeaHouseActors(
      input.gameState,
      input.houseDefinition.id,
      input.houseDefinition.cityId,
      sessionState
    ).find((actor) => actor.id === actorId);

    if (nextActor == null) {
      return createTransitionResult(input);
    }

    return withSessionState(input, sessionState, {
      selectedActorId: nextActor.id,
      dialogueLines: getActorOpenLines(nextActor, input.textEntriesById),
      dialoguePhase: "open",
      overlay: null,
    });
  }

  const debateTopic = parseDebateTopicActionId(input.request.actionId);
  if (debateTopic != null) {
    if (sessionState?.overlay?.type !== "debate") {
      return createTransitionResult(input);
    }

    return withSessionState(input, sessionState, {
      overlay: {
        ...sessionState.overlay,
        selectedPlayerTopic: debateTopic,
      },
    });
  }

  if (input.request.actionId === DEBATE_CONFIRM_ACTION_ID) {
    const overlay = sessionState?.overlay;
    if (overlay?.type !== "debate" || overlay.selectedPlayerTopic == null) {
      return createTransitionResult(input);
    }

    return resolveDebateTurn(input, sessionState, overlay.selectedPlayerTopic, false);
  }

  if (input.request.actionId === CONFIRM_START_DEBATE_ACTION_ID) {
    if (selectedActor == null) {
      return createTransitionResult(input);
    }

    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const durationDays = getHouseMinigameDurationDays(
      Math.max(0, playerCharacter.skills?.rhetoric ?? 0)
    );
    const remainingDays = getInsufficientDaysForTimedActivity(
      input.gameState,
      durationDays
    );
    if (remainingDays != null) {
      return withCouncilInsufficientTimeDialogue(input, sessionState);
    }

    return withSessionState(
      input,
      sessionState,
      {
        dialogueLines: [
          resolveTeaHouseText(
            getTeaHouseTextEntries(input.textEntriesById),
            "runtime.zhu_yuanzhang.tea_house.debate.opening.001"
          ),
        ],
        dialoguePhase: "open",
        overlay: createDebateOverlay(
          selectedActor,
          createInitialTeaHouseDebateState().playerSpirit,
          createInitialTeaHouseDebateState().npcSpirit,
          0,
          0,
          1,
          pickTeaHouseAiTopic(selectedActor.personality),
          null
        ),
      },
      [
        { type: "stop-interval", intervalId: DEBATE_INTERVAL_ID },
        {
          type: "start-interval",
          intervalId: DEBATE_INTERVAL_ID,
          everyMs: 1000,
          request: {
            type: "tick",
            tickId: DEBATE_INTERVAL_ID,
          },
        },
      ]
    );
  }

  if (selectedActor == null) {
    return createTransitionResult(input);
  }

  switch (input.request.actionId) {
    case "advance-greeting":
      return withDialoguePhase(
        input,
        sessionState,
        "open",
        getActorOpenLines(selectedActor, input.textEntriesById)
      );
    case "open-npc-dialogue":
      return withDialoguePhase(
        input,
        sessionState,
        "open",
        getActorOpenLines(selectedActor, input.textEntriesById)
      );
    case "dismiss-dialogue":
      return withDialoguePhase(input, sessionState, "idle");
    case "talk": {
      const intelGain = Math.random() < teaHouseLowIntelChance ? 1 : 0;
      const entries = getTeaHouseTextEntries(input.textEntriesById);
      const line = pickActorDialogueLine(selectedActor, input.textEntriesById);
      const extraLines =
        intelGain > 0
          ? [
              resolveTeaHouseText(
                entries,
                "runtime.zhu_yuanzhang.tea_house.talk.extra_intel"
              ),
            ]
          : [];

      return finalizeInteraction(
        input,
        sessionState,
        selectedActor,
        [line],
        {
          relationshipChange: 1,
          attributeChange: [],
          intelGain,
          moneyChange: 0,
          timeCost: 1,
        },
        resolveTeaHouseText(
          entries,
          "runtime.zhu_yuanzhang.tea_house.talk.overlay.title"
        ),
        extraLines
      );
    }
    case "serve-tea": {
      const playerCharacter = getPlayerCharacter(
        input.characterDefinitions,
        input.playerCharacterId
      );

      if (playerCharacter.stats.gold < teaHouseTeaCost) {
        return withSessionState(input, sessionState, {
          overlay: createAlertOverlay(
            "请喝茶",
            ["你手头不宽裕，连一壶像样的茶都点不起。"],
            "warning"
          ),
        });
      }

      return finalizeInteraction(
        input,
        sessionState,
        selectedActor,
        [
          selectedActor.isFixedHost
            ? "（亲自添茶）笑意里多了几分亲近。"
            : "（接过茶盏）神色也缓了下来。",
        ],
        {
          relationshipChange: 2,
          attributeChange: [],
          intelGain: 0,
          moneyChange: -teaHouseTeaCost,
          timeCost: 1,
        },
        "请喝茶",
        [`花费 ${teaHouseTeaCost} 文。`],
        "success"
      );
    }
    case "inquire": {
      const entries = getTeaHouseTextEntries(input.textEntriesById);
      const intelLine = pickActorIntelLine(selectedActor, input.textEntriesById);
      return finalizeInteraction(
        input,
        sessionState,
        selectedActor,
        [
          resolveTeaHouseTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tea_house.inquire.dialogue.001",
            { intelLine }
          ),
        ],
        {
          relationshipChange: 1,
          attributeChange: [],
          intelGain: 1,
          moneyChange: 0,
          timeCost: 1,
        },
        resolveTeaHouseText(
          entries,
          "runtime.zhu_yuanzhang.tea_house.inquire.overlay.title"
        ),
        [
          resolveTeaHouseText(
            entries,
            "runtime.zhu_yuanzhang.tea_house.inquire.overlay.001"
          ),
        ],
        "success"
      );
    }
    case "start-debate": {
      const playerCharacter = getPlayerCharacter(
        input.characterDefinitions,
        input.playerCharacterId
      );
      if (!canAffordActivityCost(playerCharacter)) {
        const entries = getTeaHouseTextEntries(input.textEntriesById);
        return withSessionState(input, sessionState, {
          overlay: createAlertOverlay(
            resolveTeaHouseText(
              entries,
              "runtime.zhu_yuanzhang.tea_house.debate.low_stamina.title"
            ),
            [
              resolveTeaHouseText(
                entries,
                "runtime.zhu_yuanzhang.tea_house.debate.low_stamina.001"
              ),
              resolveTeaHouseTemplateText(
                entries,
                "runtime.zhu_yuanzhang.tea_house.debate.low_stamina.002",
                { requiredStamina: ACTIVITY_COMPLETION_STAMINA_COST }
              ),
            ],
            "warning"
          ),
        });
      }

      const durationDays = getHouseMinigameDurationDays(
        Math.max(0, playerCharacter.skills?.rhetoric ?? 0)
      );
      const remainingDays = getInsufficientDaysForTimedActivity(
        input.gameState,
        durationDays
      );
      if (remainingDays != null) {
        return withCouncilInsufficientTimeDialogue(input, sessionState);
      }

      return withSessionState(input, sessionState, {
        overlay: createActivityConfirmOverlay(
          "舌战",
          [
            `（抬手压住茶盏）真要论起来，照你如今的辩才，这一场少说也要磨上 ${durationDays} 天。`,
            formatHouseActivityCostLine(durationDays),
          ],
          CONFIRM_START_DEBATE_ACTION_ID
        ),
      });
    }
    default:
      return createTransitionResult(input);
  }
}

function selectOverlayViewModel(
  overlay: TeaHouseSessionState["overlay"]
): HouseOverlayViewModel | null {
  if (overlay == null) {
    return null;
  }

  if (overlay.type === "alert") {
    return {
      type: "alert",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
      confirmActionId: "close-alert",
      confirmLabel: "知道了",
    };
  }

  if (overlay.type === "activity-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      confirmActionId: overlay.confirmActionId,
      confirmLabel: overlay.confirmLabel,
      cancelActionId: overlay.cancelActionId,
      cancelLabel: overlay.cancelLabel,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
    };
  }

  if (overlay.type === "debate") {
    return {
      type: "debate",
      title: "舌战",
      actorName: overlay.actorName,
      round: overlay.round,
      secondsLeft: overlay.secondsLeft,
      playerSpirit: overlay.playerSpirit,
      npcSpirit: overlay.npcSpirit,
      timeoutCount: overlay.timeoutCount,
      topicActionIds: TEA_HOUSE_TOPIC_CARDS.map((topic) => ({
        topic,
        actionId: `${DEBATE_TOPIC_ACTION_PREFIX}${topic}`,
      })),
      selectedTopic: overlay.selectedPlayerTopic,
      confirmActionId: DEBATE_CONFIRM_ACTION_ID,
      confirmDisabled: overlay.selectedPlayerTopic == null,
      lastRoundSummary: overlay.lastRoundLines,
    };
  }

  return {
    type: "alert",
    title: overlay.title,
    paragraphs: overlay.paragraphs,
    confirmActionId: "close-alert",
    confirmLabel: "收下了",
  };
}

export const teaHouseHouseModule: HouseModuleDefinition<"tea-house"> = {
  moduleId: "tea-house",
  enter(input) {
    const guestNpcIds = sampleCityNpcIdsForLocation(
      input.gameState,
      defaultRuntimeContent.cityNpcPools,
      input.houseDefinition.cityId,
      "tea-house",
      MAX_TEA_HOUSE_GUESTS
    );
    const bossActorId =
      input.houseDefinition.defaultCharacterId ?? teaHouseBossProfile.actorId;
    const bossActor = createTeaHouseBossActor(
      input.gameState,
      input.houseDefinition.id
    );

    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialTeaHouseSessionState(
        guestNpcIds,
        bossActorId,
        getActorGreetingLines(bossActor, input.textEntriesById)
      ),
      sideEffects: [{ type: "stop-interval", intervalId: DEBATE_INTERVAL_ID }],
    };
  },
  dispatch(input) {
    if (input.request.type === "tick") {
      return handleTick(input, input.sessionState);
    }

    return handleActorAction(input, input.sessionState);
  },
  leave(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
      sideEffects: [{ type: "stop-interval", intervalId: DEBATE_INTERVAL_ID }],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const sessionState =
      input.sessionState ??
      createInitialTeaHouseSessionState([], teaHouseBossProfile.actorId, [
        "茶馆里水声轻响，客人三三两两地坐着。",
      ]);
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const actors = createTeaHouseActors(
      input.gameState,
      input.houseDefinition.id,
      input.houseDefinition.cityId,
      sessionState
    );
    const selectedActor =
      getSelectedActor(
        input.gameState,
        input.houseDefinition.id,
        input.houseDefinition.cityId,
        sessionState
      ) ?? actors[0] ?? null;
    const currentIntel = readNumericVariable(
      input.gameState,
      getTeaHouseIntelVariableKey(input.houseDefinition.id),
      0
    );
    const currentTime = readNumericVariable(
      input.gameState,
      getTeaHouseTimeVariableKey(input.houseDefinition.id),
      0
    );
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isOpen = sessionState.dialoguePhase === "open";
    const isDebate = sessionState.overlay?.type === "debate";
    const dialogueOverrideSpeaker =
      sessionState.dialogueOverride == null
        ? null
        : input.characterDefinitions.find(
            (characterDefinition) =>
              characterDefinition.id ===
              sessionState.dialogueOverride?.speakerCharacterId
          ) ?? null;
    const dialogueSpeaker = dialogueOverrideSpeaker ?? selectedActor;
    const standbyRoster = orderHouseStandbyRoster({
      primaryCharacterId: input.houseDefinition.defaultCharacterId,
      actors: actors.map((actor) => ({
        characterId: actor.id,
        name: actor.name,
        title: actor.title,
        actionId:
          actor.id === selectedActor?.id
            ? "open-npc-dialogue"
            : `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}`,
        isSelected: selectedActor?.id === actor.id,
        interactionActions: [
          {
            id: "serve-tea",
            label: "请茶",
            kind: "special",
            disabled: playerCharacter.stats.gold < teaHouseTeaCost,
          },
          { id: "inquire", label: "打听", kind: "special" },
          {
            id: "start-debate",
            label: formatPlayableSkillActionLabel(
              "舌战",
              playerCharacter,
              "debate"
            ),
            kind: "special",
            tone: "accent",
          },
        ],
      })),
    });

    return {
      moduleId: "tea-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "一壶清茶 / 四方传闻",
      standbyRoster,
      dialogue:
        isIdle || dialogueSpeaker == null
          ? null
          : {
              mode: "character",
              speakerName: dialogueSpeaker.name,
              characterId: dialogueSpeaker.id,
              position: "right",
              textLines:
                sessionState.dialogueOverride?.textLines ??
                (sessionState.dialogueLines.length > 0
                  ? sessionState.dialogueLines
                  : ["（正端详着你的神色）"]),
              advanceActionId:
                sessionState.dialogueOverride?.advanceActionId ??
                (isGreeting ? "advance-greeting" : null),
              advanceHintText:
                sessionState.dialogueOverride?.advanceHintText ??
                (isGreeting ? "点击继续" : null),
            },
      actionContainer:
        selectedActor == null || isDebate || !isOpen
          ? null
          : {
              title: `${selectedActor.name} / ${selectedActor.specialty}`,
              actions: [
                {
                  id: "serve-tea",
                  label: "请喝茶",
                  disabled: playerCharacter.stats.gold < teaHouseTeaCost,
                },
                {
                  id: "start-debate",
                  label: formatPlayableSkillActionLabel(
                    "舌战",
                    playerCharacter,
                    "debate"
                  ),
                  tone: "accent",
                },
                { id: "inquire", label: "打听消息" },
                { id: "dismiss-dialogue", label: "离开" },
              ],
            },
      statusCard: {
        eyebrow: "屋敷",
        title: input.houseDefinition.name,
        subtitle:
          selectedActor == null
            ? "客流往来"
            : `${selectedActor.title} / ${selectedActor.personality}`,
        metrics: [
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          { label: "情报", value: `${currentIntel}` },
          { label: "耗时", value: `${currentTime}` },
          {
            label: selectedActor == null ? "交情" : `${selectedActor.name} 好感`,
            value: `${selectedActor?.favorability ?? 0}`,
          },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开茶馆",
        ...(isIdle ? { tone: "accent" } : {}),
      },
    };
  },
};
