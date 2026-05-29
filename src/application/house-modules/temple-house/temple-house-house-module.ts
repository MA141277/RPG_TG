import {
  templeHouseGreetingLines,
  templeHouseMeetingIntroLines,
  templeHouseMeetingReflectionLines,
  templeHouseOpenLines,
  templeHouseTaskDefinitions,
} from "../../../content/houses/temple-house-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { CalendarDate, GameState } from "../../../domain/game-state";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type {
  TempleHouseOverlayState,
  TempleHouseSessionState,
} from "../../../domain/house-modules/temple-house-session";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../../domain/keep-house";
import { TEMPLE_HOUSE_VARIABLE_KEYS } from "../../../domain/temple-house";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  readZhuYuanzhangStoryStage,
} from "../../../domain/zhu-yuanzhang-story";
import { assertExists } from "../../../shared/assert";
import { createInitialTempleHouseSessionState } from "./temple-house-session-state";

const DONATION_AMOUNT = 50;
const ASSIGN_TEMPLE_TASK_ACTION_PREFIX = "assign-temple-task:";

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in temple house module.`
  );
  return playerCharacter;
}

function getAbbotCharacter(
  characterDefinitions: CharacterDefinition[],
  abbotCharacterId: string | null
): CharacterDefinition {
  assertExists(abbotCharacterId, "Temple house is missing a default abbot character.");
  const abbotCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === abbotCharacterId
  );
  assertExists(
    abbotCharacter,
    `Abbot character not found for id "${abbotCharacterId}" in temple house module.`
  );
  return abbotCharacter;
}

function replaceCharacter(
  characterDefinitions: CharacterDefinition[],
  nextCharacter: CharacterDefinition
): CharacterDefinition[] {
  return characterDefinitions.map((characterDefinition) =>
    characterDefinition.id === nextCharacter.id ? nextCharacter : characterDefinition
  );
}

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function getCurrentDate(state: GameState): CalendarDate {
  return {
    year: state.calendar.year,
    month: state.calendar.month,
    day: state.calendar.day,
  };
}

function addDaysToDate(date: CalendarDate, days: number): CalendarDate {
  const currentNumber = date.year * 360 + (date.month - 1) * 30 + date.day;
  const nextNumber = currentNumber + days;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;
  const nextMonth = Math.floor((dayOfYear - 1) / 30) + 1;
  const nextDay = ((dayOfYear - 1) % 30) + 1;

  return {
    year: nextYear,
    month: nextMonth,
    day: nextDay,
  };
}

function formatReviewDateText(daysLeft: number): string {
  return daysLeft <= 0 ? "今日评定" : `距离评定 ${daysLeft} 天`;
}

function ensureTempleRuntimeState(gameState: GameState): GameState {
  const nextVariables = { ...gameState.runtime.variables };

  if (typeof nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] !== "number") {
    nextVariables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] = 0;
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal] !== "number") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal] = 0;
  }

  if (typeof nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId] !== "string") {
    nextVariables[TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId] = "";
  }

  return {
    ...gameState,
    ui: {
      ...gameState.ui,
      reviewDateText: formatReviewDateText(
        readNumericVariable(
          {
            ...gameState,
            runtime: {
              ...gameState.runtime,
              variables: nextVariables,
            },
          },
          KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
          0
        )
      ),
    },
    runtime: {
      ...gameState.runtime,
      variables: nextVariables,
    },
  };
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"temple-house">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"temple-house">>
): HouseModuleTransitionResult<"temple-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"temple-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TempleHouseSessionState | null,
  patch: Partial<TempleHouseSessionState>
): HouseModuleTransitionResult<"temple-house"> {
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
      ...patch,
    },
  };
}

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): NonNullable<TempleHouseOverlayState> {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function isMonkStoryStage(gameState: GameState): boolean {
  return (
    readZhuYuanzhangStoryStage(gameState) ===
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
}

function resolveFortuneLines(
  gameState: GameState,
  playerCharacter: CharacterDefinition
): {
  title: string;
  paragraphs: string[];
  tone: "info" | "success" | "warning";
} {
  const seed =
    (gameState.calendar.year +
      gameState.calendar.month * 3 +
      gameState.calendar.day +
      playerCharacter.stats.fame) %
    3;

  if (seed === 0) {
    return {
      title: "上签",
      paragraphs: [
        "签纸一展开，墨痕清正，住持说你近来的路虽绕，终究有人相助。",
        isMonkStoryStage(gameState)
          ? "“你眼下还在寺门之内，可真正的去处，已经在寺门之外等你。”"
          : "“兵尘未定，但你若守得住节制，前路反倒比旁人更稳。”",
      ],
      tone: "success",
    };
  }

  if (seed === 1) {
    return {
      title: "中签",
      paragraphs: [
        "住持将签纸放回案上，只道凡事莫急，急则生岔。",
        "“眼前未必有捷径，但一步一步走，未必比旁人慢。”",
      ],
      tone: "info",
    };
  }

  return {
    title: "下签",
    paragraphs: [
      "签文并不吉利。住持却摇头说，凶签不是坏事，是让人知道哪里该避。",
      "“少争一口闲气，多护一分性命。先熬过去，才谈得上转机。”",
    ],
    tone: "warning",
  };
}

function parseTempleTaskActionId(actionId: string): string | null {
  return actionId.startsWith(ASSIGN_TEMPLE_TASK_ACTION_PREFIX)
    ? actionId.slice(ASSIGN_TEMPLE_TASK_ACTION_PREFIX.length)
    : null;
}

function assignTempleTask(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  taskId: string
): HouseModuleTransitionResult<"temple-house"> {
  const taskDefinition = templeHouseTaskDefinitions.find(
    (candidateTask) => candidateTask.id === taskId
  );
  assertExists(
    taskDefinition,
    `Temple house task not found for id "${taskId}".`
  );

  const nextState = {
    ...input.gameState,
    world: {
      ...input.gameState.world,
      schedule: {
        ...input.gameState.world.schedule,
        councilDate: addDaysToDate(getCurrentDate(input.gameState), 30),
      },
    },
    missions: {
      ...input.gameState.missions,
      activeMissionId: taskDefinition.missionId,
    },
    ui: {
      ...input.gameState.ui,
      activeMissionId: taskDefinition.missionId,
      reviewDateText: formatReviewDateText(30),
      mainHouseMissionText: taskDefinition.title,
    },
    runtime: {
      ...input.gameState.runtime,
      variables: {
        ...input.gameState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.lastAssignedTaskId]: taskDefinition.id,
      },
    },
  };

  return {
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      mode: "meeting",
      meetingStage: "assigned",
      dialoguePhase: "open",
      selectedTaskId: taskDefinition.id,
      dialogueLines: [
        ...taskDefinition.orderLines,
        `“${taskDefinition.title}这份寺务，就由你去办。”`,
      ],
      overlay: createAlertOverlay(
        "寺务已定",
        [
          taskDefinition.briefing,
          "本次寺中评定结束，下次评定倒计时已重置为 30 天。",
        ],
        "success"
      ),
    },
  };
}

function handleAction(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState | null
): HouseModuleTransitionResult<"temple-house"> {
  if (input.request.type !== "action" || sessionState == null) {
    return createTransitionResult(input);
  }

  const abbotCharacter = getAbbotCharacter(
    input.characterDefinitions,
    input.houseDefinition.defaultCharacterId
  );
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const nextState = ensureTempleRuntimeState(input.gameState);

  if (input.request.actionId === "advance-temple-dialogue") {
    if (sessionState.mode === "meeting") {
      switch (sessionState.meetingStage) {
        case "intro":
          return withSessionState(
            {
              gameState: nextState,
              characterDefinitions: input.characterDefinitions,
            },
            sessionState,
            {
              meetingStage: "reflection",
              dialoguePhase: "open",
              dialogueLines: templeHouseMeetingReflectionLines,
            }
          );
        case "reflection":
          return withSessionState(
            {
              gameState: nextState,
              characterDefinitions: input.characterDefinitions,
            },
            sessionState,
            {
              meetingStage: "assign-duty",
              dialoguePhase: "open",
              dialogueLines: [
                `${abbotCharacter.name}抬手点了点案前几块木牌，示意你自己挑一份寺务。`,
                "“修行不是空坐，先把眼前该做的事情做完。”",
              ],
            }
          );
        default:
          return createTransitionResult(input, {
            gameState: nextState,
          });
      }
    }

    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        meetingStage: "finished",
        dialoguePhase: "open",
        dialogueLines: templeHouseOpenLines,
      }
    );
  }

  if (input.request.actionId === "dismiss-dialogue") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "idle",
      }
    );
  }

  if (input.request.actionId === "open-abbot-dialogue") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "open",
        dialogueLines: templeHouseOpenLines,
      }
    );
  }

  if (input.request.actionId === "ask-fortune") {
    const fortune = resolveFortuneLines(nextState, playerCharacter);
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          fortune.title,
          fortune.paragraphs,
          fortune.tone
        ),
      }
    );
  }

  if (input.request.actionId === "open-donate") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          type: "donate-confirm",
          title: "布施香火",
          paragraphs: [
            `寺中正缺米面灯油。本次布施 ${DONATION_AMOUNT} 文，是否愿意捐下？`,
            "住持说，布施贵在心诚，多少都该量力而行。",
          ],
          amount: DONATION_AMOUNT,
        },
      }
    );
  }

  if (input.request.actionId === "confirm-donate") {
    const donationAmount =
      sessionState.overlay?.type === "donate-confirm"
        ? sessionState.overlay.amount
        : DONATION_AMOUNT;
    if (playerCharacter.stats.gold < donationAmount) {
      return withSessionState(
        {
          gameState: nextState,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "香火钱不够",
            [
              `你身上只剩 ${playerCharacter.stats.gold} 文，还不够这次布施。`,
              "住持并不催促，只让你先把日子过稳。",
            ],
            "warning"
          ),
        }
      );
    }

    const currentDonationTotal = readNumericVariable(
      nextState,
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal,
      0
    );
    const nextDonationTotal = currentDonationTotal + donationAmount;
    const fameGain = nextDonationTotal % 200 === 0 ? 1 : 0;
    const nextPlayerCharacter: CharacterDefinition = {
      ...playerCharacter,
      stats: {
        ...playerCharacter.stats,
        gold: playerCharacter.stats.gold - donationAmount,
        fame: playerCharacter.stats.fame + fameGain,
      },
    };
    const nextCharacterDefinitions = replaceCharacter(
      input.characterDefinitions,
      nextPlayerCharacter
    );

    return {
      gameState: {
        ...nextState,
        runtime: {
          ...nextState.runtime,
          variables: {
            ...nextState.runtime.variables,
            [TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal]: nextDonationTotal,
          },
        },
      },
      characterDefinitions: nextCharacterDefinitions,
      sessionState: {
        ...sessionState,
        overlay: createAlertOverlay(
          "香火已受",
          fameGain > 0
            ? [
                `你捐下 ${donationAmount} 文香火，寺里暂且能多撑几日。`,
                `香火累计已到 ${nextDonationTotal} 文，乡里对你的名声也多了一分敬重。`,
              ]
            : [
                `你捐下 ${donationAmount} 文香火，寺里账上总算又添了一笔。`,
                `目前累计香火 ${nextDonationTotal} 文。`,
              ],
          fameGain > 0 ? "success" : "info"
        ),
      },
    };
  }

  if (
    input.request.actionId === "close-temple-overlay" &&
    sessionState.meetingStage === "assigned"
  ) {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        mode: "daily",
        meetingStage: "finished",
        dialoguePhase: "idle",
        overlay: null,
      }
    );
  }

  if (input.request.actionId === "close-temple-overlay") {
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: null,
      }
    );
  }

  const selectedTaskId = parseTempleTaskActionId(input.request.actionId);
  if (selectedTaskId != null) {
    return assignTempleTask(
      {
        ...input,
        gameState: nextState,
      },
      sessionState,
      selectedTaskId
    );
  }

  return createTransitionResult(input, {
    gameState: nextState,
  });
}

function selectOverlayViewModel(
  overlay: TempleHouseOverlayState
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
      confirmActionId: "close-temple-overlay",
      confirmLabel: "收下",
    };
  }

  return {
    type: "confirm",
    title: overlay.title,
    paragraphs: overlay.paragraphs,
    confirmActionId: "confirm-donate",
    confirmLabel: `捐 ${overlay.amount} 文`,
    cancelActionId: "close-temple-overlay",
    cancelLabel: "暂缓",
    tone: "info",
  };
}

export const templeHouseHouseModule: HouseModuleDefinition<"temple-house"> = {
  moduleId: "temple-house",
  enter(input) {
    const nextState = ensureTempleRuntimeState(input.gameState);
    const shouldStartMeeting =
      isMonkStoryStage(nextState) &&
      readNumericVariable(nextState, KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown, 0) <= 0;

    return {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      sessionState: shouldStartMeeting
        ? createInitialTempleHouseSessionState(
            "meeting",
            "intro",
            templeHouseMeetingIntroLines
          )
        : createInitialTempleHouseSessionState(
            "daily",
            "finished",
            templeHouseGreetingLines
          ),
    };
  },
  dispatch(input) {
    return handleAction(input, input.sessionState);
  },
  leave(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const nextState = ensureTempleRuntimeState(input.gameState);
    const abbotCharacter = getAbbotCharacter(
      input.characterDefinitions,
      input.houseDefinition.defaultCharacterId
    );
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const sessionState =
      input.sessionState ??
      createInitialTempleHouseSessionState(
        "daily",
        "finished",
        templeHouseGreetingLines
      );
    const donationTotal = readNumericVariable(
      nextState,
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal,
      0
    );
    const countdown = readNumericVariable(
      nextState,
      KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown,
      0
    );
    const shouldShowDailyActions =
      sessionState.mode === "daily" &&
      sessionState.overlay == null &&
      sessionState.dialoguePhase !== "greeting";
    const shouldShowMeetingTasks =
      sessionState.mode === "meeting" &&
      sessionState.meetingStage === "assign-duty" &&
      sessionState.overlay == null;
    const selectedTask =
      sessionState.selectedTaskId == null
        ? null
        : templeHouseTaskDefinitions.find(
            (taskDefinition) => taskDefinition.id === sessionState.selectedTaskId
          ) ?? null;

    return {
      moduleId: "temple-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: isMonkStoryStage(nextState)
        ? "皇觉寺 / 挂单修行 / 寺中评定"
        : "古寺清修 / 卜签 / 香火",
      standbyRoster: input.houseDefinition.characterIds
        .filter((characterId) => characterId !== abbotCharacter.id)
        .map((characterId) => {
          const characterDefinition = input.characterDefinitions.find(
            (candidateCharacter) => candidateCharacter.id === characterId
          );
          assertExists(
            characterDefinition,
            `Temple standby character not found for id "${characterId}".`
          );
          return {
            characterId: characterDefinition.id,
            name: characterDefinition.name,
            ...(characterDefinition.title == null
              ? {}
              : { title: characterDefinition.title }),
          };
        }),
      dialogue:
        sessionState.dialoguePhase === "idle"
          ? null
          : {
              mode: "character",
              speakerName: abbotCharacter.name,
              characterId: abbotCharacter.id,
              position: "right",
              textLines: sessionState.dialogueLines,
              advanceActionId:
                sessionState.overlay == null &&
                ((sessionState.mode === "daily" &&
                  sessionState.dialoguePhase === "greeting") ||
                  (sessionState.mode === "meeting" &&
                    ["intro", "reflection"].includes(sessionState.meetingStage)))
                  ? "advance-temple-dialogue"
                  : null,
              advanceHintText:
                sessionState.overlay == null &&
                ((sessionState.mode === "daily" &&
                  sessionState.dialoguePhase === "greeting") ||
                  (sessionState.mode === "meeting" &&
                    ["intro", "reflection"].includes(sessionState.meetingStage)))
                  ? "点击继续"
                  : null,
            },
      actionContainer: shouldShowMeetingTasks
        ? {
            title: "本次寺中差事",
            actions: templeHouseTaskDefinitions.map<HouseActionViewModel>(
              (taskDefinition) => ({
                id: `${ASSIGN_TEMPLE_TASK_ACTION_PREFIX}${taskDefinition.id}`,
                label: taskDefinition.title,
              })
            ),
          }
        : shouldShowDailyActions
          ? {
              title: "寺中事务",
              actions: [
                { id: "ask-fortune", label: "测运势", tone: "accent" },
                { id: "open-donate", label: "捐香火" },
                { id: "dismiss-dialogue", label: "先退下" },
              ],
            }
          : sessionState.mode === "daily" && sessionState.dialoguePhase === "idle"
            ? {
                title: "寺中事务",
                actions: [
                  { id: "open-abbot-dialogue", label: "与住持说话", tone: "accent" },
                ],
              }
            : null,
      statusCard: {
        eyebrow: "皇觉寺",
        title: isMonkStoryStage(nextState) ? "寺中评定" : "清修香火",
        subtitle: sessionState.mode === "meeting" ? "住持主持 / 寺中差事" : "住持接待 / 问签布施",
        metrics: [
          { label: "住持", value: abbotCharacter.name },
          { label: "评定倒计时", value: `${countdown} 天` },
          { label: "香火累计", value: `${donationTotal} 文` },
          {
            label: "当前差事",
            value:
              selectedTask?.title ??
              (nextState.ui.mainHouseMissionText === ""
                ? "暂无"
                : nextState.ui.mainHouseMissionText),
          },
          { label: "玩家金钱", value: `${playerCharacter.stats.gold} 文` },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开寺庙",
        tone: "accent",
      },
    };
  },
};
