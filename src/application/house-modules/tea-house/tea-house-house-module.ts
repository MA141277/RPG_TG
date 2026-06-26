import {
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
import { assertExists } from "../../../shared/assert";
import { pickRandom } from "../../../shared/random";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
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
  mutatePlayerRhetoric,
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
      ...(dialogueLines == null ? {} : { dialogueLines }),
    },
  };
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

function pickActorDialogueLine(actor: TeaHouseActor): string {
  return actor.dialoguePool.length > 0
    ? pickRandom(actor.dialoguePool)
    : "（轻轻抿茶）没有立刻开口。";
}

function getActorGreetingLines(actor: TeaHouseActor): string[] {
  return [
    actor.isFixedHost
      ? "（擦着茶盏）像是已经知道你会来。"
      : "（抬眼看了你一下）像是在判断你值不值得多说两句。",
  ];
}

function getActorOpenLines(actor: TeaHouseActor): string[] {
  return [
    actor.isFixedHost
      ? "（笑着抬手）请你入座。"
      : "（看了你一眼）像是在等你先开口。",
  ];
}

function pickActorIntelLine(actor: TeaHouseActor): string {
  return actor.intelPool.length > 0
    ? pickRandom(actor.intelPool)
    : "这会儿还没什么新鲜消息。";
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
        const rhetoricMutation = mutatePlayerRhetoric(
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

function createCouncilTimeInsufficientOverlay(
  _actorName: string,
  durationDays: number,
  remainingDays: number
): TeaHouseOverlayState {
  return createAlertOverlay(
    "时日不够",
    remainingDays <= 0
      ? [
          `（抬手按住茶盏）评定日期已到，这一场少说要磨上 ${durationDays} 天，眼下已经来不及了。`,
          "先去把评定应下，改日再坐下来论。",
        ]
      : [
          `（抬手按住茶盏）离评定只剩 ${remainingDays} 天，这一场少说要磨上 ${durationDays} 天，眼下已经来不及了。`,
          "先去把评定应下，改日再坐下来论。",
        ],
    "warning"
  );
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
      Math.max(1, playerCharacter.skills?.rhetoric ?? 1)
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
      dialogueLines: getActorOpenLines(nextActor),
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
      Math.max(1, playerCharacter.skills?.rhetoric ?? 1)
    );
    const remainingDays = getInsufficientDaysForTimedActivity(
      input.gameState,
      durationDays
    );
    if (remainingDays != null) {
      return withSessionState(input, sessionState, {
        overlay: createCouncilTimeInsufficientOverlay(
          selectedActor.name,
          durationDays,
          remainingDays
        ),
      });
    }

    return withSessionState(
      input,
      sessionState,
      {
        dialogueLines: ["（放下茶盏）示意你出题。"],
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
        getActorOpenLines(selectedActor)
      );
    case "open-npc-dialogue":
      return withDialoguePhase(
        input,
        sessionState,
        "open",
        getActorOpenLines(selectedActor)
      );
    case "dismiss-dialogue":
      return withDialoguePhase(input, sessionState, "idle");
    case "talk": {
      const intelGain = Math.random() < teaHouseLowIntelChance ? 1 : 0;
      const line = pickActorDialogueLine(selectedActor);
      const extraLines =
        intelGain > 0 ? ["你从字里行间又听出了一条可用情报。"] : [];

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
        "闲谈",
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
      const intelLine = pickActorIntelLine(selectedActor);
      return finalizeInteraction(
        input,
        sessionState,
        selectedActor,
        [`（压低声音）${intelLine}`],
        {
          relationshipChange: 1,
          attributeChange: [],
          intelGain: 1,
          moneyChange: 0,
          timeCost: 1,
        },
        "打听消息",
        ["你把这条消息牢牢记下了。"],
        "success"
      );
    }
    case "start-debate": {
      const playerCharacter = getPlayerCharacter(
        input.characterDefinitions,
        input.playerCharacterId
      );
      if (!canAffordActivityCost(playerCharacter)) {
        return withSessionState(input, sessionState, {
          overlay: createAlertOverlay(
            "先缓口气",
            [
              "（放下茶盏，摇了摇头）你这会儿神浮气短，真要舌战，也只是强撑。",
              `先去歇一歇，体力攒到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点以上，再来和我论个高下。`,
            ],
            "warning"
          ),
        });
      }

      const durationDays = getHouseMinigameDurationDays(
        Math.max(1, playerCharacter.skills?.rhetoric ?? 1)
      );
      const remainingDays = getInsufficientDaysForTimedActivity(
        input.gameState,
        durationDays
      );
      if (remainingDays != null) {
        return withSessionState(input, sessionState, {
          overlay: createCouncilTimeInsufficientOverlay(
            selectedActor.name,
            durationDays,
            remainingDays
          ),
        });
      }

      return withSessionState(input, sessionState, {
        overlay: createActivityConfirmOverlay("舌战", [
          `（抬手压住茶盏）真要论起来，照你如今的辩才，这一场少说也要磨上 ${durationDays} 天。`,
          formatHouseActivityCostLine(durationDays),
        ], CONFIRM_START_DEBATE_ACTION_ID),
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
        getActorGreetingLines(bossActor)
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

    return {
      moduleId: "tea-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "一壶清茶 / 四方传闻",
      standbyRoster: isIdle
        ? actors.map((actor) => ({
            characterId: actor.id,
            name: actor.name,
            title: actor.title,
            actionId:
              actor.id === selectedActor?.id
                ? "open-npc-dialogue"
                : `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}`,
            isSelected: selectedActor?.id === actor.id,
          }))
        : [],
      dialogue:
        isIdle || selectedActor == null
          ? null
          : {
              mode: "character",
              speakerName: selectedActor.name,
              characterId: selectedActor.id,
              position: "right",
              textLines:
                sessionState.dialogueLines.length > 0
                  ? sessionState.dialogueLines
                  : ["（正端详着你的神色）"],
              advanceActionId: isGreeting ? "advance-greeting" : null,
              advanceHintText: isGreeting ? "点击继续" : null,
            },
      actionContainer:
        selectedActor == null || isDebate || !isOpen
          ? null
          : {
              title: `${selectedActor.name} / ${selectedActor.specialty}`,
              actions: [
                { id: "talk", label: "闲谈" },
                {
                  id: "serve-tea",
                  label: "请喝茶",
                  disabled: playerCharacter.stats.gold < teaHouseTeaCost,
                },
                { id: "start-debate", label: "舌战", tone: "accent" },
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
