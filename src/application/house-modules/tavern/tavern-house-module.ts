import {
  tavernBossProfile,
  tavernDefaultWager,
  tavernDrinkPrice,
  tavernWagerStep,
  tavernWorkOffers,
} from "../../../content/houses/tavern-content";
import type { CharacterDefinition } from "../../../domain/character";
import type {
  TavernOverlayState,
  TavernSessionState,
} from "../../../domain/house-modules/tavern-session";
import type {
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import {
  getTavernDrinkCountVariableKey,
  getTavernTimeVariableKey,
  type TavernWorkOffer,
} from "../../../domain/tavern";
import { assertExists } from "../../../shared/assert";
import {
  completeTavernWork,
  increaseTavernDrinkCount,
  increaseTavernTime,
  isTavernWorkCompleted,
  mutatePlayerGold,
} from "../../tavern/tavern-mutations";
import { createInitialTavernSessionState } from "./tavern-session-state";

const SELECT_WORK_ACTION_PREFIX = "select-work:";

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in tavern module.`
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

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): TavernOverlayState {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"tavern">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"tavern">>
): HouseModuleTransitionResult<"tavern"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"tavern">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: TavernSessionState | null,
  patch: Partial<TavernSessionState>
): HouseModuleTransitionResult<"tavern"> {
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

function getAvailableWorkOffers(
  gameState: HouseModuleDispatchInput["gameState"],
  houseId: string
): TavernWorkOffer[] {
  return tavernWorkOffers.filter(
    (offer) => !isTavernWorkCompleted(gameState, houseId, offer.id)
  );
}

function parseSelectedWork(actionId: string): string | null {
  return actionId.startsWith(SELECT_WORK_ACTION_PREFIX)
    ? actionId.slice(SELECT_WORK_ACTION_PREFIX.length)
    : null;
}

function resolveWorkSelection(
  offers: TavernWorkOffer[],
  selectedOfferId: string | null
): TavernWorkOffer | null {
  if (selectedOfferId == null) {
    return offers[0] ?? null;
  }

  return offers.find((offer) => offer.id === selectedOfferId) ?? offers[0] ?? null;
}

function handleWorkAction(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState | null
): HouseModuleTransitionResult<"tavern"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  const offers = getAvailableWorkOffers(input.gameState, input.houseDefinition.id);
  const offerId = parseSelectedWork(input.request.actionId);

  if (offerId != null) {
    const nextOffer = offers.find((offer) => offer.id === offerId);
    if (nextOffer == null) {
      return createTransitionResult(input);
    }

    return withSessionState(input, sessionState, {
      selectedOfferId: nextOffer.id,
      dialoguePhase: "open",
      dialogueLines: [
        `老板把活计账单推到你面前。`,
        `“${nextOffer.title}，你要是肯做，现在就能接。”`,
        nextOffer.description,
        nextOffer.rewardText,
      ],
      overlay: null,
    });
  }

  if (input.request.actionId !== "take-work") {
    return createTransitionResult(input);
  }

  const selectedOffer = resolveWorkSelection(offers, sessionState?.selectedOfferId ?? null);
  if (selectedOffer == null) {
    return withSessionState(input, sessionState, {
      overlay: createAlertOverlay(
        "没有新活",
        ["老板摊了摊手。", "“眼下没别的零活了，过些日子再来吧。”"],
        "info"
      ),
    });
  }

  let nextState = completeTavernWork(
    input.gameState,
    input.houseDefinition.id,
    selectedOffer.id
  );
  nextState = increaseTavernTime(nextState, input.houseDefinition.id, 1);

  const goldMutation = mutatePlayerGold(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId,
    80
  );

  const remainingOffers = getAvailableWorkOffers(
    goldMutation.state,
    input.houseDefinition.id
  );

  return {
    gameState: goldMutation.state,
    characterDefinitions: goldMutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            availableOffers: remainingOffers,
            selectedOfferId: remainingOffers[0]?.id ?? null,
            dialoguePhase: "open",
            dialogueLines: [
              `你接下了“${selectedOffer.title}”。`,
              "忙完一圈回来，老板把报酬拍在了桌上。",
            ],
            overlay: createAlertOverlay(
              "活计完成",
              [
                selectedOffer.description,
                "你完成了这份杂活。",
                "获得 80 文。",
              ],
              "success"
            ),
          },
  };
}

function handleDrinkAction(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState | null
): HouseModuleTransitionResult<"tavern"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  if (input.request.actionId === "order-drink") {
    return withSessionState(input, sessionState, {
      overlay: {
        type: "drink-confirm",
        title: "点一杯酒",
        price: tavernDrinkPrice,
        paragraphs: [
          "老板抬手敲了敲酒坛。",
          `要花 ${tavernDrinkPrice} 文买一杯酒吗？`,
        ],
        confirmActionId: "confirm-drink",
        cancelActionId: "cancel-overlay",
      },
    });
  }

  if (input.request.actionId !== "confirm-drink") {
    return createTransitionResult(input);
  }

  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );

  if (playerCharacter.stats.gold < tavernDrinkPrice) {
    return withSessionState(input, sessionState, {
      overlay: createAlertOverlay(
        "钱不够",
        ["你摸了摸钱袋。", "这一杯酒你现在还喝不起。"],
        "warning"
      ),
    });
  }

  let nextState = increaseTavernDrinkCount(
    input.gameState,
    input.houseDefinition.id,
    1
  );
  nextState = increaseTavernTime(nextState, input.houseDefinition.id, 1);

  const goldMutation = mutatePlayerGold(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId,
    -tavernDrinkPrice
  );

  return {
    gameState: goldMutation.state,
    characterDefinitions: goldMutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            dialoguePhase: "open",
            dialogueLines: [
              "老板给你斟了一杯温热的酒。",
              "辛辣下肚，整个人也慢慢松了下来。",
            ],
            overlay: createAlertOverlay(
              "喝酒",
              [
                `你花了 ${tavernDrinkPrice} 文买酒。`,
                "当前先按单次喝酒状态结算，后续可继续接入更完整效果。",
              ],
              "success"
            ),
          },
  };
}

function clampWager(wager: number, playerGold: number): number {
  const maxAffordable = Math.max(tavernWagerStep, Math.floor(playerGold / tavernWagerStep) * tavernWagerStep);
  return Math.max(tavernWagerStep, Math.min(wager, maxAffordable));
}

function handleGambleAction(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState | null
): HouseModuleTransitionResult<"tavern"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );

  if (input.request.actionId === "open-gamble") {
    if (playerCharacter.stats.gold < tavernWagerStep) {
      return withSessionState(input, sessionState, {
        overlay: createAlertOverlay(
          "赌本不够",
          ["老板摇了摇头。", `至少要有 ${tavernWagerStep} 文，才够上桌。`],
          "warning"
        ),
      });
    }

    const currentWager = clampWager(
      sessionState?.currentWager ?? tavernDefaultWager,
      playerCharacter.stats.gold
    );

    return withSessionState(input, sessionState, {
      currentWager,
      overlay: {
        type: "gamble",
        title: "下注",
        wager: currentWager,
        options: [
          tavernWagerStep,
          Math.min(100, playerCharacter.stats.gold),
          Math.min(200, playerCharacter.stats.gold),
        ].filter((value, index, values) => value >= tavernWagerStep && values.indexOf(value) === index),
        decrementActionId: "decrease-wager",
        incrementActionId: "increase-wager",
        confirmActionId: "confirm-gamble",
        cancelActionId: "cancel-overlay",
      },
    });
  }

  if (input.request.actionId === "decrease-wager") {
    const nextWager = clampWager(
      (sessionState?.currentWager ?? tavernDefaultWager) - tavernWagerStep,
      playerCharacter.stats.gold
    );
    return withSessionState(input, sessionState, {
      currentWager: nextWager,
      overlay:
        sessionState?.overlay?.type === "gamble"
          ? { ...sessionState.overlay, wager: nextWager }
          : sessionState?.overlay ?? null,
    });
  }

  if (input.request.actionId === "increase-wager") {
    const nextWager = clampWager(
      (sessionState?.currentWager ?? tavernDefaultWager) + tavernWagerStep,
      playerCharacter.stats.gold
    );
    return withSessionState(input, sessionState, {
      currentWager: nextWager,
      overlay:
        sessionState?.overlay?.type === "gamble"
          ? { ...sessionState.overlay, wager: nextWager }
          : sessionState?.overlay ?? null,
    });
  }

  if (input.request.actionId !== "confirm-gamble") {
    return createTransitionResult(input);
  }

  const wager = clampWager(
    sessionState?.currentWager ?? tavernDefaultWager,
    playerCharacter.stats.gold
  );

  if (playerCharacter.stats.gold < wager) {
    return withSessionState(input, sessionState, {
      overlay: createAlertOverlay(
        "赌本不够",
        ["你摸了摸钱袋。", "临到上桌，才发现钱不够。"],
        "warning"
      ),
    });
  }

  const payout = Math.floor(wager * 1.1);
  const delta = payout - wager;

  let nextState = increaseTavernTime(input.gameState, input.houseDefinition.id, 1);
  const goldMutation = mutatePlayerGold(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId,
    delta
  );

  return {
    gameState: goldMutation.state,
    characterDefinitions: goldMutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            currentWager: tavernDefaultWager,
            dialoguePhase: "open",
            dialogueLines: [
              "你坐上赌桌，押下了赌本。",
              "这次先按接口占位返回，后续再接真正的赌博小游戏。",
            ],
            overlay: createAlertOverlay(
              "赌局结算",
              [
                `下注 ${wager} 文。`,
                `暂时按 1.1 倍返还，拿回 ${payout} 文。`,
                `本次金钱变化 ${delta >= 0 ? "+" : ""}${delta} 文。`,
              ],
              "success"
            ),
          },
  };
}

function selectOverlayViewModel(
  overlay: TavernSessionState["overlay"]
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

  if (overlay.type === "drink-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      confirmActionId: overlay.confirmActionId,
      confirmLabel: `花 ${overlay.price} 文买酒`,
      cancelActionId: overlay.cancelActionId,
      cancelLabel: "算了",
    };
  }

  return {
    type: "gamble",
    title: overlay.title,
    wager: overlay.wager,
    options: overlay.options,
    decrementActionId: overlay.decrementActionId,
    incrementActionId: overlay.incrementActionId,
    confirmActionId: overlay.confirmActionId,
    confirmLabel: "开始赌局",
    cancelActionId: overlay.cancelActionId,
    cancelLabel: "取消",
  };
}

export const tavernHouseModule: HouseModuleDefinition<"tavern"> = {
  moduleId: "tavern",
  enter(input) {
    const availableOffers = getAvailableWorkOffers(
      input.gameState,
      input.houseDefinition.id
    );

    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialTavernSessionState(
        availableOffers,
        input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
        ["老板抬眼看了你一眼。", "“要找活、喝酒，还是上桌赌两把？”"]
      ),
    };
  },
  dispatch(input) {
    if (input.request.type !== "action") {
      return createTransitionResult(input);
    }

    if (input.request.actionId === "advance-greeting") {
      return withSessionState(input, input.sessionState, {
        dialoguePhase: "open",
        dialogueLines: ["老板把算盘往旁边一拨。", "“说吧，你今天想干什么？”"],
      });
    }

    if (input.request.actionId === "dismiss-dialogue") {
      return withSessionState(input, input.sessionState, {
        dialoguePhase: "idle",
        overlay: null,
      });
    }

    if (input.request.actionId === "open-boss-dialogue") {
      return withSessionState(input, input.sessionState, {
        dialoguePhase: "open",
        dialogueLines: ["老板站在柜后看着你。", "“酒、活、赌，三样都明码标价。”"],
        overlay: null,
      });
    }

    if (
      input.request.actionId === "open-work" ||
      input.request.actionId === "take-work" ||
      input.request.actionId.startsWith(SELECT_WORK_ACTION_PREFIX)
    ) {
      if (input.request.actionId === "open-work") {
        const offers = getAvailableWorkOffers(input.gameState, input.houseDefinition.id);
        const selectedOffer = resolveWorkSelection(
          offers,
          input.sessionState?.selectedOfferId ?? null
        );

        return withSessionState(input, input.sessionState, {
          availableOffers: offers,
          selectedOfferId: selectedOffer?.id ?? null,
          dialoguePhase: "open",
          dialogueLines:
            selectedOffer == null
              ? ["老板翻了翻账本。", "“现在没别的零活了。”"]
              : [
                  `老板推出一页活单：“${selectedOffer.title}。”`,
                  selectedOffer.description,
                  selectedOffer.rewardText,
                ],
          overlay: null,
        });
      }

      return handleWorkAction(input, input.sessionState);
    }

    if (
      input.request.actionId === "order-drink" ||
      input.request.actionId === "confirm-drink"
    ) {
      return handleDrinkAction(input, input.sessionState);
    }

    if (
      input.request.actionId === "open-gamble" ||
      input.request.actionId === "decrease-wager" ||
      input.request.actionId === "increase-wager" ||
      input.request.actionId === "confirm-gamble"
    ) {
      return handleGambleAction(input, input.sessionState);
    }

    if (
      input.request.actionId === "cancel-overlay" ||
      input.request.actionId === "close-alert"
    ) {
      return withSessionState(input, input.sessionState, {
        overlay: null,
      });
    }

    return createTransitionResult(input);
  },
  leave(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const availableOffers = getAvailableWorkOffers(
      input.gameState,
      input.houseDefinition.id
    );
    const sessionState =
      input.sessionState ??
      createInitialTavernSessionState(
        availableOffers,
        input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
        ["老板抬眼看了你一眼。", "“要找活、喝酒，还是上桌赌两把？”"]
      );
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const selectedOffer = resolveWorkSelection(
      sessionState.availableOffers,
      sessionState.selectedOfferId
    );
    const currentTime = readNumericVariable(
      input.gameState,
      getTavernTimeVariableKey(input.houseDefinition.id),
      0
    );
    const drinkCount = readNumericVariable(
      input.gameState,
      getTavernDrinkCountVariableKey(input.houseDefinition.id),
      0
    );
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isOpen = sessionState.dialoguePhase === "open";

    return {
      moduleId: "tavern",
      houseId: input.houseDefinition.id,
      sceneTitle: "酒馆",
      sceneSubtitle: "找活 / 买酒 / 下注",
      standbyRoster: isIdle
        ? [
            {
              characterId:
                input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
              name: tavernBossProfile.name,
              title: tavernBossProfile.title,
              actionId: "open-boss-dialogue",
              isSelected: true,
            },
          ]
        : [],
      dialogue:
        isIdle
          ? null
          : {
              mode: "character",
              speakerName: tavernBossProfile.name,
              characterId:
                input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
              position: "right",
              textLines: sessionState.dialogueLines,
              advanceActionId: isGreeting ? "advance-greeting" : null,
              advanceHintText: isGreeting ? "点击继续" : null,
            },
      actionContainer:
        !isOpen
          ? null
          : {
              title: `${tavernBossProfile.name} / ${tavernBossProfile.specialty}`,
              actions: [
                {
                  id: "open-work",
                  label: selectedOffer == null ? "工作（暂无）" : "工作",
                  disabled: selectedOffer == null,
                },
                {
                  id: "order-drink",
                  label: "喝酒",
                  disabled: playerCharacter.stats.gold < tavernDrinkPrice,
                },
                {
                  id: "open-gamble",
                  label: "赌博",
                  tone: "accent",
                  disabled: playerCharacter.stats.gold < tavernWagerStep,
                },
                {
                  id: "take-work",
                  label: "接当前活",
                  disabled: selectedOffer == null,
                },
                { id: "dismiss-dialogue", label: "关闭" },
              ],
            },
      statusCard: {
        eyebrow: "屋舍",
        title: "酒馆",
        subtitle:
          selectedOffer == null
            ? "老板 / 今晚无新活"
            : `${selectedOffer.title} / ${selectedOffer.rewardText}`,
        metrics: [
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          { label: "喝酒次数", value: `${drinkCount}` },
          { label: "耗时", value: `${currentTime}` },
          { label: "当前赌本", value: `${sessionState.currentWager} 文` },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开酒馆",
        ...(isIdle ? { tone: "accent" } : {}),
      },
    };
  },
};
