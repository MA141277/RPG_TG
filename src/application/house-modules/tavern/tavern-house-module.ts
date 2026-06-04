import {
  tavernBossProfile,
  tavernDefaultWager,
  tavernDrinkPrice,
  tavernWagerStep,
  tavernWorkOffers,
} from "../../../content/houses/tavern-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { GameState } from "../../../domain/game-state";
import type {
  TavernOverlayState,
  TavernQteOverlayState,
  TavernSessionState,
} from "../../../domain/house-modules/tavern-session";
import type {
  HouseActionViewModel,
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
  acceptTavernWork,
  completeTavernWork,
  failTavernWork,
  getActiveTavernWorkIds,
  getTavernWorkProgress,
  increaseTavernDrinkCount,
  increaseTavernTime,
  isTavernWorkCompleted,
  isTavernWorkFailed,
  mutatePlayerGold,
  removeActiveTavernWork,
  setTavernWorkProgress,
} from "../../tavern/tavern-mutations";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  spendPlayerStamina,
} from "../../player/player-stamina";
import { createInitialTavernSessionState } from "./tavern-session-state";

const ACCEPT_WORK_ACTION_PREFIX = "accept-work:";
const SUBMIT_WORK_ACTION_PREFIX = "submit-work:";
const TAVERN_WORK_INTERVAL_ID = "tavern-work-qte";
const TAVERN_WORK_TOTAL_ROUNDS = 3;
const TAVERN_WORK_MARKER_STEP = 7;

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

function readNumericVariable(state: GameState, key: string, fallback: number): number {
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
  patch: Partial<TavernSessionState>,
  sideEffects?: HouseModuleTransitionResult<"tavern">["sideEffects"]
): HouseModuleTransitionResult<"tavern"> {
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

function findWorkOffer(offerId: string): TavernWorkOffer {
  const offer = tavernWorkOffers.find((candidateOffer) => candidateOffer.id === offerId);
  assertExists(offer, `Tavern work offer not found for id "${offerId}".`);
  return offer;
}

function getAcceptedWorkOffers(gameState: GameState, houseId: string): TavernWorkOffer[] {
  const activeIds = getActiveTavernWorkIds(gameState, houseId);
  return activeIds
    .map((offerId) => tavernWorkOffers.find((offer) => offer.id === offerId) ?? null)
    .filter((offer): offer is TavernWorkOffer => offer != null);
}

function getAvailableWorkOffers(
  gameState: GameState,
  houseId: string,
  playerFame: number
): TavernWorkOffer[] {
  const activeIds = new Set(getActiveTavernWorkIds(gameState, houseId));
  return tavernWorkOffers.filter((offer) => {
    if (activeIds.has(offer.id)) {
      return false;
    }
    if (isTavernWorkCompleted(gameState, houseId, offer.id)) {
      return false;
    }
    if (isTavernWorkFailed(gameState, houseId, offer.id)) {
      return false;
    }
    return offer.minFame == null || playerFame >= offer.minFame;
  });
}

function getWorkCapacity(playerFame: number): number {
  if (playerFame >= 80) {
    return 3;
  }
  if (playerFame >= 40) {
    return 2;
  }
  return 1;
}

function parseActionId(actionId: string, prefix: string): string | null {
  return actionId.startsWith(prefix) ? actionId.slice(prefix.length) : null;
}

function randomTargetStart(round: number): number {
  const seed = (round * 19 + 11) % 55;
  return 15 + seed;
}

function randomTargetWidth(round: number): number {
  return round === 3 ? 16 : round === 2 ? 18 : 22;
}

function createDishwashingOverlay(
  offer: TavernWorkOffer,
  round: number,
  successes: number,
  markerPercent = 8
): TavernQteOverlayState {
  return {
    type: "qte-bar",
    offerId: offer.id,
    taskLabel: offer.title,
    round,
    totalRounds: TAVERN_WORK_TOTAL_ROUNDS,
    successes,
    markerPercent,
    markerDirection: 1,
    targetStartPercent: randomTargetStart(round),
    targetWidthPercent: randomTargetWidth(round),
  };
}

function resolveDishwashingReward(
  offer: TavernWorkOffer,
  successes: number
): { grade: string; rewardGold: number; success: boolean } {
  if (successes <= 0) {
    return { grade: "失败", rewardGold: 0, success: false };
  }
  if (successes === 1) {
    return { grade: "勉强", rewardGold: Math.floor(offer.maxRewardGold * 0.3), success: true };
  }
  if (successes === 2) {
    return { grade: "合格", rewardGold: Math.floor(offer.maxRewardGold * 0.65), success: true };
  }
  return { grade: "利落", rewardGold: offer.maxRewardGold, success: true };
}

function refreshWorkLists(
  gameState: GameState,
  houseId: string,
  playerFame: number
): Pick<TavernSessionState, "availableOffers" | "acceptedOffers"> {
  return {
    availableOffers: getAvailableWorkOffers(gameState, houseId, playerFame),
    acceptedOffers: getAcceptedWorkOffers(gameState, houseId),
  };
}

function startDishwashingQte(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  offer: TavernWorkOffer,
  nextState: GameState
): HouseModuleTransitionResult<"tavern"> {
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );

  return withSessionState(
    {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
    },
    sessionState,
    {
      ...refreshWorkLists(nextState, input.houseDefinition.id, playerCharacter.stats.fame),
      selectedOfferId: offer.id,
      selectedSubmitOfferId: offer.id,
      workPanelMode: "submit",
      dialoguePhase: "idle",
      overlay: createDishwashingOverlay(offer, 1, 0),
    },
    [
      { type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID },
      {
        type: "start-interval",
        intervalId: TAVERN_WORK_INTERVAL_ID,
        everyMs: 90,
        request: { type: "tick", tickId: TAVERN_WORK_INTERVAL_ID },
      },
    ]
  );
}

function handleTavernWorkTick(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState
): HouseModuleTransitionResult<"tavern"> {
  if (
    input.request.type !== "tick" ||
    input.request.tickId !== TAVERN_WORK_INTERVAL_ID
  ) {
    return createTransitionResult(input);
  }

  const overlay = sessionState.overlay;
  if (overlay?.type !== "qte-bar") {
    return createTransitionResult(input, {
      sideEffects: [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }],
    });
  }

  const nextMarker = overlay.markerPercent + overlay.markerDirection * TAVERN_WORK_MARKER_STEP;
  if (nextMarker >= 100) {
    return withSessionState(input, sessionState, {
      overlay: { ...overlay, markerPercent: 100, markerDirection: -1 },
    });
  }

  if (nextMarker <= 0) {
    return withSessionState(input, sessionState, {
      overlay: { ...overlay, markerPercent: 0, markerDirection: 1 },
    });
  }

  return withSessionState(input, sessionState, {
    overlay: { ...overlay, markerPercent: nextMarker },
  });
}

function handleTavernWorkStop(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState
): HouseModuleTransitionResult<"tavern"> {
  const overlay = sessionState.overlay;
  if (overlay?.type !== "qte-bar") {
    return createTransitionResult(input);
  }

  const hit =
    overlay.markerPercent >= overlay.targetStartPercent &&
    overlay.markerPercent <= overlay.targetStartPercent + overlay.targetWidthPercent;
  const nextSuccesses = hit ? overlay.successes + 1 : overlay.successes;

  if (overlay.round < overlay.totalRounds) {
    const offer = findWorkOffer(overlay.offerId);
    return withSessionState(input, sessionState, {
      overlay: createDishwashingOverlay(offer, overlay.round + 1, nextSuccesses),
    });
  }

  const offer = findWorkOffer(overlay.offerId);
  const reward = resolveDishwashingReward(offer, nextSuccesses);
  const nextState = setTavernWorkProgress(
    input.gameState,
    input.houseDefinition.id,
    offer.id,
    nextSuccesses
  );

  return {
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      dialoguePhase: "open",
      workPanelMode: "submit",
      selectedSubmitOfferId: offer.id,
      dialogueLines: [
        `你把${offer.title}做完了，可以去柜台提交。`,
        reward.success
          ? `目前判定：${reward.grade}，预计可领 ${reward.rewardGold} 文。`
          : "这活干砸了，仍然可以提交，但会按失败处理。",
      ],
      overlay: {
        type: "result",
        title: "活计进度",
        grade: reward.grade,
        score: nextSuccesses,
        rewardLines: [
          `${offer.title}`,
          `命中 ${nextSuccesses} / ${overlay.totalRounds} 次`,
          reward.success ? `预计报酬 ${reward.rewardGold} 文` : "未达到最低要求，提交会失败",
        ],
      },
    },
    sideEffects: [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }],
  };
}

function submitWork(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  offer: TavernWorkOffer
): HouseModuleTransitionResult<"tavern"> {
  const progress = getTavernWorkProgress(
    input.gameState,
    input.houseDefinition.id,
    offer.id
  );
  const reward =
    offer.type === "dishwashing"
      ? resolveDishwashingReward(offer, progress)
      : { grade: "失败", rewardGold: 0, success: false };

  let nextState = removeActiveTavernWork(
    input.gameState,
    input.houseDefinition.id,
    offer.id
  );
  nextState = increaseTavernTime(nextState, input.houseDefinition.id, 1);
  nextState = reward.success
    ? completeTavernWork(nextState, input.houseDefinition.id, offer.id)
    : failTavernWork(nextState, input.houseDefinition.id, offer.id);

  const staminaMutation = spendPlayerStamina(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId
  );
  const goldMutation =
    reward.rewardGold === 0
      ? staminaMutation
      : mutatePlayerGold(
          staminaMutation.state,
          staminaMutation.characterDefinitions,
          input.playerCharacterId,
          reward.rewardGold
        );
  const playerCharacter = getPlayerCharacter(
    goldMutation.characterDefinitions,
    input.playerCharacterId
  );
  const lists = refreshWorkLists(
    goldMutation.state,
    input.houseDefinition.id,
    playerCharacter.stats.fame
  );

  return {
    gameState: goldMutation.state,
    characterDefinitions: goldMutation.characterDefinitions,
    sessionState: {
      ...sessionState,
      ...lists,
      selectedOfferId: lists.availableOffers[0]?.id ?? null,
      selectedSubmitOfferId: lists.acceptedOffers[0]?.id ?? null,
      workPanelMode: "submit",
      dialoguePhase: "open",
      dialogueLines: reward.success
        ? [`你提交了${offer.title}。`, `老板点过工钱，递来 ${reward.rewardGold} 文。`]
        : [`你提交了${offer.title}。`, "老板看完结果摇了摇头，这单按失败记。"],
      overlay: {
        type: "result",
        title: "提交结果",
        grade: reward.grade,
        score: Math.max(progress, 0),
        rewardLines: [
          reward.success ? "任务完成" : "任务失败",
          `报酬 ${reward.rewardGold} 文`,
          `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
        ],
      },
    },
    sideEffects: [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }],
  };
}

function handleWorkAction(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState | null
): HouseModuleTransitionResult<"tavern"> {
  if (input.request.type !== "action" || sessionState == null) {
    return createTransitionResult(input);
  }

  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const houseId = input.houseDefinition.id;
  const lists = refreshWorkLists(input.gameState, houseId, playerCharacter.stats.fame);

  if (input.request.actionId === "open-work") {
    return withSessionState(input, sessionState, {
      ...lists,
      workPanelMode: "main",
      dialoguePhase: "open",
      dialogueLines: ["老板把活计牌翻了出来。", "你可以先接取，也可以提交已经接下的活。"],
      overlay: null,
    });
  }

  if (input.request.actionId === "open-work-accept") {
    return withSessionState(input, sessionState, {
      ...lists,
      workPanelMode: "accept",
      selectedOfferId: lists.availableOffers[0]?.id ?? null,
      dialoguePhase: "open",
      dialogueLines:
        lists.availableOffers.length === 0
          ? ["老板翻了翻账本。", "眼下没有适合你接的新活。"]
          : ["这些是当前酒馆还能接的活。", "前期只能接一个主命以外的任务，名声高了才会放宽。"],
      overlay: null,
    });
  }

  if (input.request.actionId === "open-work-submit") {
    return withSessionState(input, sessionState, {
      ...lists,
      workPanelMode: "submit",
      selectedSubmitOfferId: lists.acceptedOffers[0]?.id ?? null,
      dialoguePhase: "open",
      dialogueLines:
        lists.acceptedOffers.length === 0
          ? ["老板看了你一眼。", "你在这家酒馆还没有接下的活。"]
          : ["提交只显示当前酒馆已经接取的任务。", "没做完也能交，但会按失败算。"],
      overlay: null,
    });
  }

  const acceptOfferId = parseActionId(input.request.actionId, ACCEPT_WORK_ACTION_PREFIX);
  if (acceptOfferId != null) {
    const offer = findWorkOffer(acceptOfferId);
    const capacity = getWorkCapacity(playerCharacter.stats.fame);
    if (lists.acceptedOffers.length >= capacity) {
      return withSessionState(input, sessionState, {
        overlay: createAlertOverlay(
          "接不了更多活",
          [`你当前最多能同时接 ${capacity} 个主命以外的任务。`, "名声高了以后，老板才会把更多活交给你。"],
          "warning"
        ),
      });
    }
    if (!lists.availableOffers.some((availableOffer) => availableOffer.id === offer.id)) {
      return createTransitionResult(input);
    }

    const nextState = acceptTavernWork(input.gameState, houseId, offer.id);
    if (offer.type === "dishwashing" && offer.canStartImmediately) {
      return startDishwashingQte(input, sessionState, offer, nextState);
    }

    const nextLists = refreshWorkLists(nextState, houseId, playerCharacter.stats.fame);
    return withSessionState(
      {
        gameState: nextState,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        ...nextLists,
        selectedOfferId: nextLists.availableOffers[0]?.id ?? null,
        selectedSubmitOfferId: offer.id,
        workPanelMode: "submit",
        dialoguePhase: "open",
        dialogueLines: [
          `你接下了${offer.title}。`,
          offer.type === "random-event"
            ? "这类活的随机事件接口已经预留，当前提交会按失败处理。"
            : "做完后回来提交。",
        ],
        overlay: null,
      }
    );
  }

  const submitOfferId = parseActionId(input.request.actionId, SUBMIT_WORK_ACTION_PREFIX);
  if (submitOfferId != null) {
    const offer = lists.acceptedOffers.find((acceptedOffer) => acceptedOffer.id === submitOfferId);
    if (offer == null) {
      return createTransitionResult(input);
    }

    const progress = getTavernWorkProgress(input.gameState, houseId, offer.id);
    return withSessionState(input, sessionState, {
      selectedSubmitOfferId: offer.id,
      overlay: {
        type: "submit-confirm",
        offerId: offer.id,
        title: `提交${offer.title}`,
        paragraphs: [
          offer.description,
          progress < 0
            ? "这个任务还没有完成记录，现在提交会按失败处理。"
            : `当前完成度 ${progress} / ${TAVERN_WORK_TOTAL_ROUNDS}。`,
          "确认提交后，这个任务会从当前接取列表移除。",
        ],
        confirmActionId: "confirm-submit-work",
        cancelActionId: "cancel-overlay",
      },
    });
  }

  if (input.request.actionId === "confirm-submit-work") {
    const offerId = sessionState.selectedSubmitOfferId;
    if (offerId == null) {
      return createTransitionResult(input);
    }
    const offer = lists.acceptedOffers.find((acceptedOffer) => acceptedOffer.id === offerId);
    if (offer == null) {
      return createTransitionResult(input);
    }
    return submitWork(input, sessionState, offer);
  }

  if (input.request.actionId === "tavern-work-stop") {
    return handleTavernWorkStop(input, sessionState);
  }

  if (input.request.actionId === "close-tavern-result") {
    return withSessionState(
      input,
      sessionState,
      { overlay: null },
      [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }]
    );
  }

  return createTransitionResult(input);
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
        paragraphs: ["老板抬手敲了敲酒坛。", `要花 ${tavernDrinkPrice} 文买一杯酒吗？`],
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

  let nextState = increaseTavernDrinkCount(input.gameState, input.houseDefinition.id, 1);
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
            dialogueLines: ["老板给你斟了一杯温酒。", "辛辣下肚，整个人也慢慢松了下来。"],
            overlay: createAlertOverlay(
              "喝酒",
              [`你花了 ${tavernDrinkPrice} 文买酒。`, "当前先按单次喝酒状态结算。"],
              "success"
            ),
          },
  };
}

function clampWager(wager: number, playerGold: number): number {
  const maxAffordable = Math.max(
    tavernWagerStep,
    Math.floor(playerGold / tavernWagerStep) * tavernWagerStep
  );
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
          ["老板摇了摇头。", `至少要有 ${tavernWagerStep} 文，才能上桌。`],
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

  const nextState = increaseTavernTime(input.gameState, input.houseDefinition.id, 1);
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
            dialogueLines: ["你坐上赌桌，押下了赌本。", "这次先按接口占位返回。"],
            overlay: createAlertOverlay(
              "赌局结算",
              [
                `下注 ${wager} 文。`,
                `暂时按 1.1 倍返回，拿回 ${payout} 文。`,
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

  if (overlay.type === "submit-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      confirmActionId: overlay.confirmActionId,
      confirmLabel: "确认提交",
      cancelActionId: overlay.cancelActionId,
      cancelLabel: "再等等",
      tone: "warning",
    };
  }

  if (overlay.type === "qte-bar") {
    return {
      type: "qte-bar",
      title: "刷盘子",
      taskLabel: overlay.taskLabel,
      round: overlay.round,
      totalRounds: overlay.totalRounds,
      successes: overlay.successes,
      markerPercent: overlay.markerPercent,
      targetStartPercent: overlay.targetStartPercent,
      targetWidthPercent: overlay.targetWidthPercent,
      helperLines: [
        "指针会来回移动，点击“停手”将其停下。",
        "停在金色区间内算成功，共判定三次。",
      ],
      stopActionId: "tavern-work-stop",
    };
  }

  if (overlay.type === "result") {
    return {
      type: "result",
      title: overlay.title,
      grade: overlay.grade,
      score: overlay.score,
      rewardLines: overlay.rewardLines,
      confirmActionId: "close-tavern-result",
      confirmLabel: "收下",
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

function createWorkActions(
  sessionState: TavernSessionState,
  capacity: number
): HouseActionViewModel[] {
  if (sessionState.workPanelMode === "accept") {
    return [
      ...sessionState.availableOffers.map((offer) => ({
        id: `${ACCEPT_WORK_ACTION_PREFIX}${offer.id}`,
        label: `${offer.title} / ${offer.rewardText}`,
        disabled: sessionState.acceptedOffers.length >= capacity,
      })),
      { id: "open-work", label: "返回" },
      { id: "dismiss-dialogue", label: "关闭" },
    ];
  }

  if (sessionState.workPanelMode === "submit") {
    return [
      ...sessionState.acceptedOffers.map((offer) => ({
        id: `${SUBMIT_WORK_ACTION_PREFIX}${offer.id}`,
        label: `提交：${offer.title}`,
      })),
      { id: "open-work", label: "返回" },
      { id: "dismiss-dialogue", label: "关闭" },
    ];
  }

  return [
    { id: "open-work-accept", label: "接取" },
    { id: "open-work-submit", label: "提交" },
    { id: "dismiss-dialogue", label: "关闭" },
  ];
}

export const tavernHouseModule: HouseModuleDefinition<"tavern"> = {
  moduleId: "tavern",
  enter(input) {
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const lists = refreshWorkLists(
      input.gameState,
      input.houseDefinition.id,
      playerCharacter.stats.fame
    );

    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialTavernSessionState(
        lists.availableOffers,
        lists.acceptedOffers,
        input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
        ["老板抬眼看了你一眼。", "“要找活、喝酒，还是上桌赌两把？”"]
      ),
      sideEffects: [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }],
    };
  },
  dispatch(input) {
    if (input.request.type === "tick") {
      return input.sessionState == null
        ? createTransitionResult(input)
        : handleTavernWorkTick(input, input.sessionState);
    }

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
        workPanelMode: "closed",
        overlay: null,
      });
    }

    if (input.request.actionId === "open-boss-dialogue") {
      return withSessionState(input, input.sessionState, {
        dialoguePhase: "open",
        workPanelMode: "closed",
        dialogueLines: ["老板站在柜后看着你。", "“酒、活、赌，三样都明码标价。”"],
        overlay: null,
      });
    }

    if (
      input.request.actionId === "open-work" ||
      input.request.actionId === "open-work-accept" ||
      input.request.actionId === "open-work-submit" ||
      input.request.actionId === "confirm-submit-work" ||
      input.request.actionId === "tavern-work-stop" ||
      input.request.actionId === "close-tavern-result" ||
      input.request.actionId.startsWith(ACCEPT_WORK_ACTION_PREFIX) ||
      input.request.actionId.startsWith(SUBMIT_WORK_ACTION_PREFIX)
    ) {
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
      sideEffects: [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }],
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const lists = refreshWorkLists(
      input.gameState,
      input.houseDefinition.id,
      playerCharacter.stats.fame
    );
    const sessionState =
      input.sessionState ??
      createInitialTavernSessionState(
        lists.availableOffers,
        lists.acceptedOffers,
        input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId,
        ["老板抬眼看了你一眼。", "“要找活、喝酒，还是上桌赌两把？”"]
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
    const capacity = getWorkCapacity(playerCharacter.stats.fame);
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isOpen = sessionState.dialoguePhase === "open";
    const firstAvailableOffer = lists.availableOffers[0] ?? null;

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
      actionContainer: !isOpen
        ? null
        : sessionState.workPanelMode === "closed"
          ? {
              title: `${tavernBossProfile.name} / ${tavernBossProfile.specialty}`,
              actions: [
                {
                  id: "open-work",
                  label: "工作",
                  disabled:
                    lists.availableOffers.length === 0 &&
                    lists.acceptedOffers.length === 0,
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
                { id: "dismiss-dialogue", label: "关闭" },
              ],
            }
          : {
              title: `酒馆活计 / 已接 ${lists.acceptedOffers.length}/${capacity}`,
              actions: createWorkActions(
                {
                  ...sessionState,
                  availableOffers: lists.availableOffers,
                  acceptedOffers: lists.acceptedOffers,
                },
                capacity
              ),
            },
      statusCard: {
        eyebrow: "屋舍",
        title: "酒馆",
        subtitle:
          firstAvailableOffer == null
            ? `已接 ${lists.acceptedOffers.length}/${capacity}`
            : `${firstAvailableOffer.title} / ${firstAvailableOffer.rewardText}`,
        metrics: [
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          { label: "喝酒次数", value: `${drinkCount}` },
          { label: "耗时", value: `${currentTime}` },
          { label: "接活上限", value: `${capacity}` },
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
