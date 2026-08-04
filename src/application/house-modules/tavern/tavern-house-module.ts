import {
  tavernBossGreetingTextIds,
  tavernBossOpenTextIds,
  tavernBossProfile,
  tavernDefaultWager,
  tavernDrinkPrice,
  tavernWagerStep,
  tavernWorkOffers,
} from "../../../content/houses/tavern-content";
import type { CharacterDefinition } from "../../../domain/character";
import type { GameState } from "../../../domain/game-state";
import type { HouseActivityConfirmOverlayState } from "../../../domain/house-activity";
import type {
  TavernAlertOverlayState,
  TavernOverlayState,
  TavernQteOverlayState,
  TavernSessionState,
  TavernShortTableDebugPresetMode,
  TavernShortTableSession,
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
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
import {
  advanceTavernGambleMeldCountdown,
  advanceTavernLongPublicReveal,
  advanceTavernGambleNpcThinking,
  canHumanLongHu,
  clearTavernGamblePlaySlot,
  confirmSelectedTavernGambleDiscards,
  confirmTavernGamblePlayGroup,
  createTavernLongGambleSession,
  declareTavernGambleMeld,
  drawForTavernGamble,
  getMeldKindLabel,
  getTavernGamblePhaseLabel,
  getTavernGambleStreetLabel,
  getTavernGambleWinners,
  getTavernMahjongTileLabel,
  passHumanLongHu,
  passTavernGamblePlayGroups,
  pushHumanLongHu,
  reorderTavernGambleHand,
  resolveTavernGambleBettingAction,
  scoreTavernGambleSessionPlayer,
  skipTavernGambleMeld,
  toggleTavernGamblePlayTile,
  TAVERN_GAMBLE_BIG_BLIND,
  TAVERN_GAMBLE_SMALL_BLIND,
  TAVERN_LONG_GAMBLE_HAND_SIZE,
  type TavernGambleActionKind,
  type TavernGambleSession,
  type TavernGambleVariant,
} from "../../../domain/tavern-gambling";
import {
  advanceTavernShortNpcAction,
  chooseTavernShortDiscardCandidate,
  claimTavernShortDiscard,
  clearTavernShortDroppingDiscardCandidate,
  clearTavernShortLiftedDiscardCandidate,
  confirmTavernShortDiscard,
  drawTavernShortIncomingCard,
  passTavernShortClaim,
  resolveTavernShortBetAction,
  type TavernShortBetActionKind,
} from "../../../domain/tavern-short-gambling";
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
  canAffordActivityCost,
  spendPlayerStamina,
} from "../../player/player-stamina";
import {
  convertHouseActivityDaysToSegments,
  formatHouseActivityCostLine,
  getHouseWorkDurationDays,
} from "../../house/house-activity-costs";
import { getInsufficientDaysForTimedActivity } from "../../time/council-priority";
import { createInitialTavernSessionState } from "./tavern-session-state";
import {
  cashOutTavernShortTableSession,
  continueTavernShortTableSession,
  createTavernShortTableSession,
  rebuyTavernShortTableSession,
  tickTavernShortClaimCountdown,
  updateTavernShortTableSession,
} from "./tavern-short-gamble-session";
import { getTavernShortClaimCountdownRemainingMs } from "./tavern-short-claim-countdown";
import { selectTavernShortGambleOverlay } from "./tavern-short-gamble-view-model";

const ACCEPT_WORK_ACTION_PREFIX = "accept-work:";
const CONFIRM_START_WORK_ACTION_PREFIX = "confirm-start-work:";
const SUBMIT_WORK_ACTION_PREFIX = "submit-work:";
const RETURN_TO_WORK_MENU_ACTION_ID = "return-to-work-menu";
const TAVERN_WORK_INTERVAL_ID = "tavern-work-qte";
const TAVERN_GAMBLE_NPC_INTERVAL_ID = "tavern-gamble-npc-thinking";
const TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID = "tavern-gamble-short-claim-timeout";
const TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID = "tavern-gamble-short-drop-clear";
const TAVERN_WORK_TOTAL_ROUNDS = 3;
const TAVERN_WORK_MARKER_STEP = 7;
const GAMBLE_MELD_ACTION_PREFIX = "gamble-meld:";
const GAMBLE_DISCARD_ACTION_PREFIX = "gamble-discard:";
const GAMBLE_REORDER_ACTION_PREFIX = "gamble-reorder:";
const GAMBLE_CLEAR_LIFTED_TILE_ACTION_PREFIX = "gamble-clear-lifted-tile:";
const GAMBLE_PLAY_TILE_ACTION_PREFIX = "gamble-play-tile:";
const SELECT_GAMBLE_VARIANT_ACTION_PREFIX = "select-gamble-variant:";
const CANCEL_ACTIVITY_CONFIRM_ACTION_ID = "cancel-activity-confirm";
const GAMBLE_SHORT_CONTINUE_ACTION_ID = "gamble-short-continue-hand";
const GAMBLE_SHORT_REBUY_ACTION_ID = "gamble-short-rebuy";
const GAMBLE_SHORT_CASH_OUT_ACTION_ID = "gamble-short-cash-out";
const TOGGLE_SHORT_DEBUG_PRESET_ACTION_ID = "toggle-short-debug-claim-cycle";
const TAVERN_WORK_ACTION_CONTAINER_CLASS_NAME =
  "c-house-red-nine-slice-actions c-tavern-work-actions";
const TAVERN_WORK_BUTTON_CLASS_NAME =
  "c-house-red-nine-slice-button c-tavern-work-button";
const TAVERN_WORK_OVERLAY_ATTRIBUTE =
  ' data-house-overlay-variant="assessment-popup"';
const TAVERN_WORK_CONFIRM_MODAL_CLASS_NAME =
  "c-assessment-popup c-house-tavern-work-popup c-house-tavern-work-confirm";
const TAVERN_WORK_CONFIRM_ACTIONS_CLASS_NAME = "c-house-red-nine-slice-actions";

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
): TavernAlertOverlayState {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function getTavernTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function resolveTavernText(
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

function resolveTavernTemplateText(
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

function pickRandomResolvedTavernText(
  textEntriesById: Record<string, string>,
  textIds: readonly string[]
): string {
  if (textIds.length === 0) {
    return "MISSING_TEXT";
  }

  const textId =
    textIds.length === 1
      ? textIds[0]!
      : textIds[Math.floor(Math.random() * textIds.length)] ?? textIds[0]!;

  return resolveTavernText(textEntriesById, textId);
}

function createLowStaminaOverlay(
  actionLabel: string,
  textEntriesById?: Record<string, string>
): TavernOverlayState {
  const entries = getTavernTextEntries(textEntriesById);
  return createAlertOverlay(
    resolveTavernText(entries, "runtime.zhu_yuanzhang.tavern.low_stamina.title"),
    [
      resolveTavernTemplateText(
        entries,
        "runtime.zhu_yuanzhang.tavern.low_stamina.001",
        { actionLabel }
      ),
      resolveTavernTemplateText(
        entries,
        "runtime.zhu_yuanzhang.tavern.low_stamina.002",
        { requiredStamina: ACTIVITY_COMPLETION_STAMINA_COST }
      ),
    ],
    "warning"
  );
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
  const durationDays = getHouseWorkDurationDays();
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
  nextState = increaseTavernTime(nextState, input.houseDefinition.id, durationDays);
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
  const sideEffects: HouseModuleTransitionResult<"tavern">["sideEffects"] = [
    { type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID },
  ];

  if (reward.rewardGold > 0) {
    sideEffects.push({
      type: "play-coin-reward",
      playerCharacterId: input.playerCharacterId,
      delta: reward.rewardGold,
      source: "request-pointer",
    });
  }

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
        ? [`你提交了${offer.title}。`, `（点过工钱）递来 ${reward.rewardGold} 文。`]
        : [`你提交了${offer.title}。`, "（看完结果，摇了摇头）这单按失败记。"],
      overlay: {
        type: "result",
        title: "提交结果",
        grade: reward.grade,
        score: Math.max(progress, 0),
        rewardLines: [
          reward.success ? "任务完成" : "任务失败",
          `报酬 ${reward.rewardGold} 文`,
          `时间 +${durationDays}天`,
          `体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`,
        ],
      },
    },
    sideEffects,
    timeAdvanceCost: convertHouseActivityDaysToSegments(durationDays),
  };
}

function beginAcceptedWorkOffer(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  offer: TavernWorkOffer
): HouseModuleTransitionResult<"tavern"> {
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const durationDays = getHouseWorkDurationDays();
  const remainingDays = getInsufficientDaysForTimedActivity(
    input.gameState,
    durationDays
  );
  if (remainingDays != null) {
    return withSessionState(input, sessionState, {
      overlay: createCouncilTimeInsufficientOverlay(
        input.textEntriesById,
        offer.title,
        durationDays,
        remainingDays
      ),
    });
  }

  const nextState = acceptTavernWork(input.gameState, input.houseDefinition.id, offer.id);
  if (offer.type === "dishwashing" && offer.canStartImmediately) {
    return startDishwashingQte(input, sessionState, offer, nextState);
  }

  const nextLists = refreshWorkLists(
    nextState,
    input.houseDefinition.id,
    playerCharacter.stats.fame
  );
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
    confirmLabel: "接下这活",
    cancelActionId: CANCEL_ACTIVITY_CONFIRM_ACTION_ID,
    cancelLabel: "再看看",
    tone: "info",
  };
}

function createCouncilTimeInsufficientOverlay(
  textEntriesById: Record<string, string> | undefined,
  offerTitle: string,
  durationDays: number,
  remainingDays: number
): TavernOverlayState {
  const entries = getTavernTextEntries(textEntriesById);
  return createAlertOverlay(
    resolveTavernText(
      entries,
      "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.title"
    ),
    remainingDays <= 0
      ? [
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.expired.001",
            { offerTitle, durationDays }
          ),
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.expired.002",
            { offerTitle, durationDays }
          ),
        ]
      : [
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.soon.001",
            { offerTitle, durationDays, remainingDays }
          ),
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.soon.002",
            { offerTitle, durationDays, remainingDays }
          ),
        ],
    "warning"
  );
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

  if (
    input.request.actionId === "open-work" ||
    input.request.actionId === RETURN_TO_WORK_MENU_ACTION_ID
  ) {
    const entries = getTavernTextEntries(input.textEntriesById);
    return withSessionState(input, sessionState, {
      ...lists,
      workPanelMode: "main",
      dialoguePhase: "open",
      dialogueLines: [
        resolveTavernText(entries, "runtime.zhu_yuanzhang.tavern.work.main.001"),
        resolveTavernText(entries, "runtime.zhu_yuanzhang.tavern.work.main.002"),
      ],
      overlay: null,
    });
  }

  if (input.request.actionId === "open-work-accept") {
    const entries = getTavernTextEntries(input.textEntriesById);
    return withSessionState(input, sessionState, {
      ...lists,
      workPanelMode: "accept",
      selectedOfferId: lists.availableOffers[0]?.id ?? null,
      dialoguePhase: "open",
      dialogueLines:
        lists.availableOffers.length === 0
          ? [
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.accept.empty.001"
              ),
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.accept.empty.002"
              ),
            ]
          : [
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.accept.available.001"
              ),
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.accept.available.002"
              ),
            ],
      overlay: null,
    });
  }

  if (input.request.actionId === "open-work-submit") {
    const entries = getTavernTextEntries(input.textEntriesById);
    return withSessionState(input, sessionState, {
      ...lists,
      workPanelMode: "submit",
      selectedSubmitOfferId: lists.acceptedOffers[0]?.id ?? null,
      dialoguePhase: "open",
      dialogueLines:
        lists.acceptedOffers.length === 0
          ? [
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.submit.empty.001"
              ),
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.submit.empty.002"
              ),
            ]
          : [
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.submit.available.001"
              ),
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.work.submit.available.002"
              ),
            ],
      overlay: null,
    });
  }

  if (input.request.actionId === CANCEL_ACTIVITY_CONFIRM_ACTION_ID) {
    return withSessionState(input, sessionState, { overlay: null });
  }

  const acceptOfferId = parseActionId(input.request.actionId, ACCEPT_WORK_ACTION_PREFIX);
  if (acceptOfferId != null) {
    if (!canAffordActivityCost(playerCharacter)) {
      return withSessionState(input, sessionState, {
        overlay: createLowStaminaOverlay("接活", input.textEntriesById),
      });
    }

    const offer = findWorkOffer(acceptOfferId);
    const capacity = getWorkCapacity(playerCharacter.stats.fame);
    if (lists.acceptedOffers.length >= capacity) {
      const entries = getTavernTextEntries(input.textEntriesById);
      return withSessionState(input, sessionState, {
        overlay: createAlertOverlay(
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.work.capacity.title"
          ),
          [
            resolveTavernTemplateText(
              entries,
              "runtime.zhu_yuanzhang.tavern.work.capacity.001",
              { capacity }
            ),
            resolveTavernText(
              entries,
              "runtime.zhu_yuanzhang.tavern.work.capacity.002"
            ),
          ],
          "warning"
        ),
      });
    }
    if (!lists.availableOffers.some((availableOffer) => availableOffer.id === offer.id)) {
      return createTransitionResult(input);
    }

    const durationDays = getHouseWorkDurationDays();
    const remainingDays = getInsufficientDaysForTimedActivity(
      input.gameState,
      durationDays
    );
    if (remainingDays != null) {
      return withSessionState(input, sessionState, {
        overlay: createCouncilTimeInsufficientOverlay(
          input.textEntriesById,
          offer.title,
          durationDays,
          remainingDays
        ),
      });
    }

    return withSessionState(input, sessionState, {
      overlay: createActivityConfirmOverlay(offer.title, [
        offer.description,
        `（抬了抬下巴）这活真接下来，少说得占你 ${durationDays} 天。`,
        formatHouseActivityCostLine(durationDays),
      ], `${CONFIRM_START_WORK_ACTION_PREFIX}${offer.id}`),
    });
  }

  const confirmOfferId = parseActionId(
    input.request.actionId,
    CONFIRM_START_WORK_ACTION_PREFIX
  );
  if (confirmOfferId != null) {
    const offer = lists.availableOffers.find(
      (availableOffer) => availableOffer.id === confirmOfferId
    );
    if (offer == null) {
      return createTransitionResult(input);
    }

    return beginAcceptedWorkOffer(input, sessionState, offer);
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
    if (!canAffordActivityCost(playerCharacter)) {
      return withSessionState(input, sessionState, {
        overlay: createLowStaminaOverlay("交活", input.textEntriesById),
      });
    }

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
    const entries = getTavernTextEntries(input.textEntriesById);
    const nextWorkPanelMode =
      lists.acceptedOffers.length > 0
        ? "submit"
        : lists.availableOffers.length > 0
          ? "accept"
          : "main";
    return withSessionState(
      input,
      sessionState,
      {
        ...lists,
        selectedOfferId: lists.availableOffers[0]?.id ?? null,
        selectedSubmitOfferId: lists.acceptedOffers[0]?.id ?? null,
        workPanelMode: nextWorkPanelMode,
        dialogueLines:
          nextWorkPanelMode === "accept"
            ? [
                resolveTavernText(
                  entries,
                  "runtime.zhu_yuanzhang.tavern.work.accept.available.001"
                ),
                resolveTavernText(
                  entries,
                  "runtime.zhu_yuanzhang.tavern.work.accept.available.002"
                ),
              ]
            : nextWorkPanelMode === "main"
              ? [
                  resolveTavernText(
                    entries,
                    "runtime.zhu_yuanzhang.tavern.work.main.001"
                  ),
                  resolveTavernText(
                    entries,
                    "runtime.zhu_yuanzhang.tavern.work.main.002"
                  ),
                ]
              : sessionState.dialogueLines,
        overlay: null,
      },
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
    const entries = getTavernTextEntries(input.textEntriesById);
    return withSessionState(input, sessionState, {
      overlay: {
        type: "drink-confirm",
        title: resolveTavernText(
          entries,
          "runtime.zhu_yuanzhang.tavern.drink.confirm.title"
        ),
        price: tavernDrinkPrice,
        paragraphs: [
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.drink.confirm.001"
          ),
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.drink.confirm.002",
            { price: tavernDrinkPrice }
          ),
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
    const entries = getTavernTextEntries(input.textEntriesById);
    return withSessionState(input, sessionState, {
      overlay: createAlertOverlay(
        resolveTavernText(
          entries,
          "runtime.zhu_yuanzhang.tavern.drink.insufficient_money.title"
        ),
        [
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.drink.insufficient_money.001"
          ),
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.drink.insufficient_money.002"
          ),
        ],
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
  const entries = getTavernTextEntries(input.textEntriesById);

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
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.drink.result.dialogue.001"
              ),
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.drink.result.dialogue.002"
              ),
            ],
            overlay: createAlertOverlay(
              resolveTavernText(
                entries,
                "runtime.zhu_yuanzhang.tavern.drink.result.title"
              ),
              [
                resolveTavernTemplateText(
                  entries,
                  "runtime.zhu_yuanzhang.tavern.drink.result.001",
                  { price: tavernDrinkPrice }
                ),
                resolveTavernText(
                  entries,
                  "runtime.zhu_yuanzhang.tavern.drink.result.002"
                ),
              ],
              "success"
            ),
          },
    timeAdvanceCost: 1,
  };
}

function clampWager(wager: number, playerGold: number): number {
  const maxAffordable = Math.max(
    tavernWagerStep,
    Math.floor(playerGold / tavernWagerStep) * tavernWagerStep
  );
  return Math.max(tavernWagerStep, Math.min(wager, maxAffordable));
}

function getGambleVariantLabel(variant: TavernGambleVariant): string {
  return variant === "long" ? "长牌" : "短牌";
}

function getShortDebugPresetToggleLabel(
  mode: TavernShortTableDebugPresetMode
): string {
  return mode === "claim-cycle"
    ? "调试预设：已开启"
    : "调试预设：已关闭";
}

function createGambleOverlayState(input: {
  variant: TavernGambleVariant;
  wager: number;
  playerGold: number;
  shortDebugPresetMode: TavernShortTableDebugPresetMode;
}): TavernOverlayState {
  return {
    type: "gamble",
    title: `${getGambleVariantLabel(input.variant)}下注`,
    variant: input.variant,
    variantLabel: getGambleVariantLabel(input.variant),
    wager: input.wager,
    options: [
      tavernWagerStep,
      Math.min(100, input.playerGold),
      Math.min(200, input.playerGold),
    ].filter(
      (value, index, values) =>
        value >= tavernWagerStep && values.indexOf(value) === index
    ),
    decrementActionId: "decrease-wager",
    incrementActionId: "increase-wager",
    confirmActionId: "confirm-gamble",
    cancelActionId: "cancel-overlay",
    debugToggle:
      input.variant !== "short"
        ? null
        : {
            actionId: TOGGLE_SHORT_DEBUG_PRESET_ACTION_ID,
            label: getShortDebugPresetToggleLabel(input.shortDebugPresetMode),
            helperText:
              "开启后，连续几手会固定给出可碰、可杠、可吃的测试牌局。",
          },
  };
}

function getHumanGamblePlayer(session: TavernGambleSession) {
  const player = session.players.find((candidate) => candidate.isHuman);
  assertExists(player, "Tavern gambling session has no human player.");
  return player;
}

function getGambleNetResult(session: TavernGambleSession): number {
  const human = getHumanGamblePlayer(session);
  if (session.showdown == null) {
    return -human.committed;
  }
  const winners = getTavernGambleWinners(session);
  if (winners.length === 0 || !winners.some((winner) => winner.playerId === human.id)) {
    return -human.committed;
  }
  return Math.floor(session.pot / winners.length) - human.committed;
}

function resolveLongGambleSettlement(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  session: TavernGambleSession
): HouseModuleTransitionResult<"tavern"> {
  const entries = getTavernTextEntries(input.textEntriesById);
  const delta = getGambleNetResult(session);
  const nextState = increaseTavernTime(input.gameState, input.houseDefinition.id, 1);
  const staminaMutation = spendPlayerStamina(
    nextState,
    input.characterDefinitions,
    input.playerCharacterId
  );
  const goldMutation =
    delta === 0
      ? staminaMutation
      : mutatePlayerGold(
          staminaMutation.state,
          staminaMutation.characterDefinitions,
          input.playerCharacterId,
          delta
        );
  return {
    gameState: goldMutation.state,
    characterDefinitions: goldMutation.characterDefinitions,
    sessionState: {
      ...sessionState,
      currentWager: tavernDefaultWager,
      gambleSession: null,
      dialoguePhase: "open",
      dialogueLines: [
        "牌局已结。",
        delta >= 0
          ? resolveTavernTemplateText(
              entries,
              "runtime.zhu_yuanzhang.tavern.gamble.settlement.dialogue.win",
              { amount: delta }
            )
          : resolveTavernTemplateText(
              entries,
              "runtime.zhu_yuanzhang.tavern.gamble.settlement.dialogue.loss",
              { amount: Math.abs(delta) }
            ),
      ],
      overlay: createAlertOverlay(
        resolveTavernText(
          entries,
          "runtime.zhu_yuanzhang.tavern.gamble.settlement.title"
        ),
        [
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.gamble.settlement.001",
            { pot: session.pot }
          ),
          delta >= 0
            ? resolveTavernTemplateText(
                entries,
                "runtime.zhu_yuanzhang.tavern.gamble.settlement.delta.win",
                { delta }
              )
            : resolveTavernTemplateText(
                entries,
                "runtime.zhu_yuanzhang.tavern.gamble.settlement.delta.loss",
                { delta }
              ),
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.gamble.settlement.002",
            { requiredStamina: ACTIVITY_COMPLETION_STAMINA_COST }
          ),
        ],
        delta >= 0 ? "success" : "warning"
      ),
    },
    sideEffects: [{ type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID }],
    timeAdvanceCost: 1,
  };
}

function getLongGambleSideEffects(
  session: TavernGambleSession
): HouseModuleTransitionResult<"tavern">["sideEffects"] {
  return session.phase !== "npc-thinking" &&
    session.phase !== "meld-window" &&
    (session.longPublicRevealTicks ?? 0) <= 0
    ? [{ type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID }]
    : [
        { type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
        {
          type: "start-interval",
          intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID,
          everyMs: 1000,
          request: { type: "tick", tickId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
        },
      ];
}

function getShortTablePlayerChips(table: TavernShortTableSession): number {
  return (
    table.currentHand?.players.find((player) => player.seatId === table.playerSeatId)?.stack ??
    table.bankrollBySeatId[table.playerSeatId] ??
    0
  );
}

function getShortTableDialogueLines(
  input: HouseModuleDispatchInput<"tavern">,
  table: TavernShortTableSession
): string[] {
  const entries = getTavernTextEntries(input.textEntriesById);
  const playerChips = getShortTablePlayerChips(table);
  if (table.prompt === "rebuy-or-cashout") {
    return [
      resolveTavernText(
        entries,
        "runtime.zhu_yuanzhang.tavern.gamble.short.prompt.rebuy.001",
        "桌上的筹码已经见底。"
      ),
      resolveTavernTemplateText(
        entries,
        "runtime.zhu_yuanzhang.tavern.gamble.short.prompt.rebuy.002",
        { chips: playerChips },
        `你桌上还剩 ${playerChips} 筹码，可以补码或退桌。`
      ),
    ];
  }
  if (table.prompt === "continue-or-cashout") {
    return [
      resolveTavernText(
        entries,
        "runtime.zhu_yuanzhang.tavern.gamble.short.prompt.continue.001",
        "这一手已经打完。"
      ),
      resolveTavernTemplateText(
        entries,
        "runtime.zhu_yuanzhang.tavern.gamble.short.prompt.continue.002",
        { chips: playerChips },
        `你桌上还剩 ${playerChips} 筹码，继续还是退桌？`
      ),
    ];
  }
  return [
    resolveTavernText(
      entries,
      "runtime.zhu_yuanzhang.tavern.gamble.short.start.001",
      "你把赌本换成筹码，坐上了短牌桌。"
    ),
    resolveTavernText(
      entries,
      "runtime.zhu_yuanzhang.tavern.gamble.short.start.002",
      "盲注固定 100 / 200，继续下一手不会再额外耗体力。"
    ),
  ];
}

function getShortGambleSideEffects(
  table: TavernShortTableSession
): HouseModuleTransitionResult<"tavern">["sideEffects"] {
  const stopEffects: HouseModuleTransitionResult<"tavern">["sideEffects"] = [
    { type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
    { type: "stop-interval", intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID },
    { type: "stop-interval", intervalId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID },
  ];
  const hand = table.currentHand;
  if (hand == null) {
    return stopEffects;
  }
  const actingSeatId = hand.players[hand.actingSeatIndex]?.seatId ?? null;
  const claimSeatId = hand.claimChain?.options[0]?.seatId ?? null;
  const requiresNpcTick =
    hand.phase === "showdown" ||
    (hand.phase === "claim-window" &&
      claimSeatId != null &&
      claimSeatId !== table.playerSeatId) ||
    ((hand.phase === "betting" ||
      hand.phase === "draw-discard" ||
      hand.phase === "npc-thinking") &&
      actingSeatId != null &&
      actingSeatId !== table.playerSeatId);
  const requiresClaimCountdownTick = table.claimCountdown != null;
  const claimCountdownDelayMs =
    table.claimCountdown == null
      ? null
      : Math.max(16, getTavernShortClaimCountdownRemainingMs(table.claimCountdown));
  const requiresDropClearTick = hand.droppingDiscardCardId != null;
  return [
    ...stopEffects,
    ...(requiresNpcTick
      ? [
          {
            type: "start-interval" as const,
            intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID,
            everyMs: 1000,
            request: { type: "tick" as const, tickId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
          },
        ]
      : []),
    ...(requiresClaimCountdownTick && claimCountdownDelayMs != null
      ? [
          {
            type: "start-interval" as const,
            intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
            everyMs: claimCountdownDelayMs,
            request: {
              type: "tick" as const,
              tickId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
            },
          },
        ]
      : []),
    ...(requiresDropClearTick
      ? [
          {
            type: "start-interval" as const,
            intervalId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID,
            everyMs: 180,
            request: {
              type: "tick" as const,
              tickId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID,
            },
          },
        ]
      : []),
  ];
}

function withLongGambleSession(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  gambleSession: TavernGambleSession
): HouseModuleTransitionResult<"tavern"> {
  return withSessionState(
    input,
    sessionState,
    {
      gambleSession: {
        variant: "long",
        session: gambleSession,
      },
      overlay: {
        type: "gamble-table",
        session: {
          variant: "long",
          session: gambleSession,
        },
      },
      dialoguePhase: "open",
      dialogueLines: [
        resolveTavernText(
          getTavernTextEntries(input.textEntriesById),
          "runtime.zhu_yuanzhang.tavern.gamble.start.001"
        ),
        resolveTavernText(
          getTavernTextEntries(input.textEntriesById),
          "runtime.zhu_yuanzhang.tavern.gamble.start.002"
        ),
      ],
    },
    getLongGambleSideEffects(gambleSession)
  );
}

function withShortGambleSession(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  table: TavernShortTableSession
): HouseModuleTransitionResult<"tavern"> {
  return withSessionState(
    input,
    sessionState,
    {
      gambleSession: {
        variant: "short",
        table,
      },
      overlay: {
        type: "gamble-table",
        session: {
          variant: "short",
          table,
        },
      },
      dialoguePhase: "open",
      dialogueLines: getShortTableDialogueLines(input, table),
    },
    getShortGambleSideEffects(table)
  );
}

function handleGambleTick(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState
): HouseModuleTransitionResult<"tavern"> {
  if (input.request.type !== "tick" || sessionState.gambleSession == null) {
    return createTransitionResult(input);
  }

  if (sessionState.gambleSession.variant === "short") {
    if (input.request.tickId === TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID) {
      if (sessionState.gambleSession.table.claimCountdown == null) {
        return createTransitionResult(input, {
          sideEffects: [
            {
              type: "stop-interval",
              intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
            },
          ],
        });
      }
      return withShortGambleSession(
        input,
        sessionState,
        tickTavernShortClaimCountdown(sessionState.gambleSession.table)
      );
    }
    if (input.request.tickId === TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID) {
      const currentHand = sessionState.gambleSession.table.currentHand;
      if (currentHand == null || currentHand.droppingDiscardCardId == null) {
        return createTransitionResult(input, {
          sideEffects: [
            {
              type: "stop-interval",
              intervalId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID,
            },
          ],
        });
      }
      return withShortGambleSession(
        input,
        sessionState,
        updateTavernShortTableSession(
          sessionState.gambleSession.table,
          clearTavernShortDroppingDiscardCandidate(
            currentHand,
            sessionState.gambleSession.table.playerSeatId,
            currentHand.droppingDiscardCardId
          )
        )
      );
    }
    if (input.request.tickId !== TAVERN_GAMBLE_NPC_INTERVAL_ID) {
      return createTransitionResult(input);
    }
    const currentHand = sessionState.gambleSession.table.currentHand;
    if (currentHand == null) {
      return createTransitionResult(input, {
        sideEffects: [
          { type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
          {
            type: "stop-interval",
            intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
          },
          {
            type: "stop-interval",
            intervalId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID,
          },
        ],
      });
    }
    return withShortGambleSession(
      input,
      sessionState,
      updateTavernShortTableSession(
        sessionState.gambleSession.table,
        advanceTavernShortNpcAction(currentHand)
      )
    );
  }

  if (input.request.tickId !== TAVERN_GAMBLE_NPC_INTERVAL_ID) {
    return createTransitionResult(input);
  }
  const longSession = sessionState.gambleSession.session;
  const nextSession =
    (longSession.longPublicRevealTicks ?? 0) > 0
      ? advanceTavernLongPublicReveal(longSession)
      : longSession.phase === "meld-window"
        ? advanceTavernGambleMeldCountdown(longSession)
        : advanceTavernGambleNpcThinking(longSession);
  return withLongGambleSession(input, sessionState, nextSession);
}

function getGambleSessionSeed(
  input: HouseModuleDispatchInput<"tavern">,
  wager: number
): number {
  const tavernTime = readNumericVariable(
    input.gameState,
    getTavernTimeVariableKey(input.houseDefinition.id),
    0
  );
  const playerGold = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  ).stats.gold;
  const timeSeed = Math.floor(Date.now() % 2147483647);
  const randomSeed = Math.floor(Math.random() * 2147483647);
  return Math.max(
    1,
    ((tavernTime * 4099 +
      playerGold * 37 +
      wager * 101 +
      input.houseDefinition.id.length +
      timeSeed) ^
      randomSeed) >>>
      0
  );
}

function withUpdatedShortTableHand(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  table: TavernShortTableSession,
  nextHand: Parameters<typeof updateTavernShortTableSession>[1]
): HouseModuleTransitionResult<"tavern"> {
  return withShortGambleSession(
    input,
    sessionState,
    updateTavernShortTableSession(table, nextHand)
  );
}

function resolveTavernAlertClose(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState | null
): HouseModuleTransitionResult<"tavern"> {
  const deferredReward =
    sessionState?.overlay?.type === "alert"
      ? sessionState.overlay.deferredReward
      : undefined;

  if (
    deferredReward?.type !== "coin-reward" ||
    deferredReward.delta <= 0
  ) {
    return withSessionState(input, sessionState, {
      overlay: null,
    });
  }

  const rewardMutation = mutatePlayerGold(
    input.gameState,
    input.characterDefinitions,
    deferredReward.playerCharacterId,
    deferredReward.delta
  );

  return {
    gameState: rewardMutation.state,
    characterDefinitions: rewardMutation.characterDefinitions,
    sessionState:
      sessionState == null
        ? sessionState
        : {
            ...sessionState,
            overlay: null,
          },
    sideEffects: [
      {
        type: "play-coin-reward",
        playerCharacterId: deferredReward.playerCharacterId,
        delta: deferredReward.delta,
        source: deferredReward.source,
      },
    ],
  };
}

function resolveShortTableCashOut(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  table: TavernShortTableSession
): HouseModuleTransitionResult<"tavern"> {
  const entries = getTavernTextEntries(input.textEntriesById);
  const { goldDelta, leftoverChips } = cashOutTavernShortTableSession(table);
  const cashOutOverlay = createAlertOverlay(
    resolveTavernText(
      entries,
      "runtime.zhu_yuanzhang.tavern.gamble.short.cash_out.title",
      "短牌退桌"
    ),
    [
      resolveTavernTemplateText(
        entries,
        "runtime.zhu_yuanzhang.tavern.gamble.short.cash_out.001",
        { goldDelta },
        `你把桌上的筹码兑回了 ${goldDelta} 文。`
      ),
      resolveTavernTemplateText(
        entries,
        "runtime.zhu_yuanzhang.tavern.gamble.short.cash_out.002",
        { leftoverChips },
        leftoverChips > 0
          ? `有 ${leftoverChips} 筹码不足整兑，直接作废。`
          : "桌上的筹码已经全部兑清。"
      ),
    ],
    goldDelta > 0 ? "success" : "info"
  );
  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      currentWager: tavernDefaultWager,
      gambleSession: null,
      dialoguePhase: "open",
      dialogueLines: [
        resolveTavernText(
          entries,
          "runtime.zhu_yuanzhang.tavern.gamble.short.cash_out.dialogue.001",
          "你离开了短牌桌。"
        ),
        resolveTavernTemplateText(
          entries,
          "runtime.zhu_yuanzhang.tavern.gamble.short.cash_out.dialogue.002",
          { goldDelta, leftoverChips },
          `兑回 ${goldDelta} 文，余下 ${leftoverChips} 筹码作废。`
        ),
      ],
      overlay:
        goldDelta > 0
          ? {
              ...cashOutOverlay,
              deferredReward: {
                type: "coin-reward",
                playerCharacterId: input.playerCharacterId,
                delta: goldDelta,
                source: "request-pointer",
              },
            }
          : cashOutOverlay,
    },
    sideEffects: [
      { type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
      {
        type: "stop-interval",
        intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
      },
    ],
  };
}

function handleShortGambleTableAction(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  table: TavernShortTableSession,
  playerGold: number
): HouseModuleTransitionResult<"tavern"> {
  const actionId = input.request.type === "action" ? input.request.actionId : "";
  if (actionId === GAMBLE_SHORT_CASH_OUT_ACTION_ID || actionId === "gamble-close") {
    return resolveShortTableCashOut(input, sessionState, table);
  }
  if (actionId === GAMBLE_SHORT_CONTINUE_ACTION_ID) {
    return withShortGambleSession(
      input,
      sessionState,
      continueTavernShortTableSession(
        table,
        getGambleSessionSeed(input, sessionState.currentWager)
      )
    );
  }
  if (actionId === GAMBLE_SHORT_REBUY_ACTION_ID) {
    const rebuyGold = clampWager(
      sessionState.currentWager ?? tavernDefaultWager,
      playerGold
    );
    if (playerGold < rebuyGold) {
      const entries = getTavernTextEntries(input.textEntriesById);
      return withSessionState(input, sessionState, {
        overlay: createAlertOverlay(
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.title"
          ),
          [
            resolveTavernTemplateText(
              entries,
              "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.001",
              { minimumWager: rebuyGold }
            ),
            resolveTavernText(
              entries,
              "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.002"
            ),
          ],
          "warning"
        ),
      });
    }
    const goldMutation = mutatePlayerGold(
      input.gameState,
      input.characterDefinitions,
      input.playerCharacterId,
      -rebuyGold
    );
    return withShortGambleSession(
      {
        ...input,
        gameState: goldMutation.state,
        characterDefinitions: goldMutation.characterDefinitions,
      },
      sessionState,
      rebuyTavernShortTableSession(
        table,
        rebuyGold,
        getGambleSessionSeed(input, rebuyGold)
      )
    );
  }

  const currentHand = table.currentHand;
  if (currentHand == null) {
    return createTransitionResult(input);
  }
  if (
    actionId === "gamble-check" ||
    actionId === "gamble-call" ||
    actionId === "gamble-raise" ||
    actionId === "gamble-fold"
  ) {
    const action = actionId.replace("gamble-", "") as TavernShortBetActionKind;
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      resolveTavernShortBetAction(currentHand, table.playerSeatId, { kind: action })
    );
  }
  if (actionId === "gamble-draw") {
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      drawTavernShortIncomingCard(currentHand, table.playerSeatId)
    );
  }
  if (actionId === "gamble-confirm-discard") {
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      confirmTavernShortDiscard(currentHand, table.playerSeatId)
    );
  }
  if (actionId === "gamble-skip-meld") {
    if (currentHand.phase !== "claim-window") {
      return createTransitionResult(input);
    }
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      passTavernShortClaim(currentHand, table.playerSeatId)
    );
  }
  const meldId = parseActionId(actionId, GAMBLE_MELD_ACTION_PREFIX);
  if (meldId != null) {
    if (currentHand.phase !== "claim-window") {
      return createTransitionResult(input);
    }
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      claimTavernShortDiscard(currentHand, meldId)
    );
  }
  const clearLiftedTileId = parseActionId(
    actionId,
    GAMBLE_CLEAR_LIFTED_TILE_ACTION_PREFIX
  );
  if (clearLiftedTileId != null) {
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      clearTavernShortLiftedDiscardCandidate(
        currentHand,
        table.playerSeatId,
        clearLiftedTileId
      )
    );
  }
  const playTileId = parseActionId(actionId, GAMBLE_PLAY_TILE_ACTION_PREFIX);
  if (playTileId != null) {
    return withUpdatedShortTableHand(
      input,
      sessionState,
      table,
      chooseTavernShortDiscardCandidate(currentHand, table.playerSeatId, playTileId)
    );
  }
  return createTransitionResult(input);
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
      const entries = getTavernTextEntries(input.textEntriesById);
      return withSessionState(input, sessionState, {
        overlay: createAlertOverlay(
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.title"
          ),
          [
            resolveTavernTemplateText(
              entries,
              "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.001",
              { minimumWager: tavernWagerStep }
            ),
            resolveTavernText(
              entries,
              "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.002"
            ),
          ],
          "warning"
        ),
      });
    }
    return withSessionState(input, sessionState, {
      overlay: {
        type: "gamble-choice",
        title: "选择牌局",
        options: [
          {
            id: "long",
            label: "长牌",
            description: "5 暗牌 + 9 公共牌，按轮下注，再进入传统麻将摸打。",
            actionId: `${SELECT_GAMBLE_VARIANT_ACTION_PREFIX}long`,
          },
          {
            id: "short",
            label: "短牌",
            description: "5 手牌 + 2 公共牌，下注沿用德州，弃牌可被吃碰杠抢走。",
            actionId: `${SELECT_GAMBLE_VARIANT_ACTION_PREFIX}short`,
          },
        ],
        cancelActionId: "cancel-overlay",
      },
    });
  }

  const selectedVariant = parseActionId(
    input.request.actionId,
    SELECT_GAMBLE_VARIANT_ACTION_PREFIX
  );
  if (selectedVariant === "short" || selectedVariant === "long") {
    const currentWager = clampWager(
      sessionState?.currentWager ?? tavernDefaultWager,
      playerCharacter.stats.gold
    );
    return withSessionState(input, sessionState, {
      currentWager,
      currentGambleVariant: selectedVariant,
      overlay: createGambleOverlayState({
        variant: selectedVariant,
        wager: currentWager,
        playerGold: playerCharacter.stats.gold,
        shortDebugPresetMode: sessionState?.shortDebugPresetMode ?? "off",
      }),
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
          ? createGambleOverlayState({
              variant: sessionState.currentGambleVariant,
              wager: nextWager,
              playerGold: playerCharacter.stats.gold,
              shortDebugPresetMode: sessionState.shortDebugPresetMode,
            })
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
          ? createGambleOverlayState({
              variant: sessionState.currentGambleVariant,
              wager: nextWager,
              playerGold: playerCharacter.stats.gold,
              shortDebugPresetMode: sessionState.shortDebugPresetMode,
            })
          : sessionState?.overlay ?? null,
    });
  }

  if (input.request.actionId === TOGGLE_SHORT_DEBUG_PRESET_ACTION_ID) {
    const nextMode: TavernShortTableDebugPresetMode =
      sessionState?.shortDebugPresetMode === "claim-cycle" ? "off" : "claim-cycle";
    return withSessionState(input, sessionState, {
      shortDebugPresetMode: nextMode,
      overlay:
        sessionState?.overlay?.type === "gamble"
          ? createGambleOverlayState({
              variant: sessionState.currentGambleVariant,
              wager: sessionState.currentWager,
              playerGold: playerCharacter.stats.gold,
              shortDebugPresetMode: nextMode,
            })
          : sessionState?.overlay ?? null,
    });
  }

  if (input.request.actionId !== "confirm-gamble") {
    if (sessionState == null || sessionState.gambleSession == null) {
      return createTransitionResult(input);
    }

    const actionId = input.request.actionId;
    const gambleSession = sessionState.gambleSession;

    if (gambleSession.variant === "short") {
      return handleShortGambleTableAction(
        input,
        sessionState,
        gambleSession.table,
        playerCharacter.stats.gold
      );
    }

    const longSession = gambleSession.session;

    if (
      actionId === "gamble-check" ||
      actionId === "gamble-call" ||
      actionId === "gamble-raise" ||
      actionId === "gamble-fold"
    ) {
      const action = actionId.replace("gamble-", "") as TavernGambleActionKind;
      return withLongGambleSession(
        input,
        sessionState,
        resolveTavernGambleBettingAction(longSession, action)
      );
    }
    if (actionId === "gamble-skip-meld") {
      return withLongGambleSession(input, sessionState, skipTavernGambleMeld(longSession));
    }
    const meldId = parseActionId(actionId, GAMBLE_MELD_ACTION_PREFIX);
    if (meldId != null) {
      return withLongGambleSession(
        input,
        sessionState,
        declareTavernGambleMeld(longSession, meldId)
      );
    }
    if (actionId === "gamble-draw") {
      return withLongGambleSession(input, sessionState, drawForTavernGamble(longSession));
    }
    if (actionId === "gamble-clear-play") {
      return withLongGambleSession(
        input,
        sessionState,
        clearTavernGamblePlaySlot(longSession)
      );
    }
    if (actionId === "gamble-confirm-play") {
      return withLongGambleSession(
        input,
        sessionState,
        confirmTavernGamblePlayGroup(longSession)
      );
    }
    if (actionId === "gamble-pass-play") {
      return withLongGambleSession(
        input,
        sessionState,
        passTavernGamblePlayGroups(longSession)
      );
    }
    if (actionId === "gamble-push-hu") {
      return withLongGambleSession(input, sessionState, pushHumanLongHu(longSession));
    }
    if (actionId === "gamble-pass-hu") {
      return withLongGambleSession(input, sessionState, passHumanLongHu(longSession));
    }
    if (actionId === "gamble-confirm-discard") {
      return withLongGambleSession(
        input,
        sessionState,
        confirmSelectedTavernGambleDiscards(longSession)
      );
    }
    const playTileId = parseActionId(actionId, GAMBLE_PLAY_TILE_ACTION_PREFIX);
    if (playTileId != null) {
      return withLongGambleSession(
        input,
        sessionState,
        toggleTavernGamblePlayTile(longSession, playTileId)
      );
    }
    const discardTileId = parseActionId(actionId, GAMBLE_DISCARD_ACTION_PREFIX);
    if (discardTileId != null) {
      return withLongGambleSession(
        input,
        sessionState,
        toggleTavernGamblePlayTile(longSession, discardTileId)
      );
    }
    const reorderPayload = parseActionId(actionId, GAMBLE_REORDER_ACTION_PREFIX);
    if (reorderPayload != null) {
      const [tileId, beforeTileId] = reorderPayload.split(":");
      if (tileId == null || tileId.length === 0) {
        return createTransitionResult(input);
      }
      return withLongGambleSession(
        input,
        sessionState,
        reorderTavernGambleHand(
          longSession,
          tileId,
          beforeTileId == null || beforeTileId === "end" ? null : beforeTileId
        )
      );
    }
    if (actionId === "gamble-settle") {
      return resolveLongGambleSettlement(input, sessionState, longSession);
    }
    if (actionId === "gamble-close") {
      return withSessionState(
        input,
        sessionState,
        {
          gambleSession: null,
          overlay: null,
        },
        [{ type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID }]
      );
    }
    return createTransitionResult(input);
  }

  const wager = clampWager(
    sessionState?.currentWager ?? tavernDefaultWager,
    playerCharacter.stats.gold
  );

  if (playerCharacter.stats.gold < wager) {
    const entries = getTavernTextEntries(input.textEntriesById);
    return withSessionState(input, sessionState, {
      overlay: createAlertOverlay(
        resolveTavernText(
          entries,
          "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.title"
        ),
        [
          resolveTavernTemplateText(
            entries,
            "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.001",
            { minimumWager: wager }
          ),
          resolveTavernText(
            entries,
            "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.002"
          ),
        ],
        "warning"
      ),
    });
  }
  if (!canAffordActivityCost(playerCharacter)) {
    return withSessionState(input, sessionState, {
      overlay: createLowStaminaOverlay("上桌", input.textEntriesById),
    });
  }
  if (sessionState == null) {
    return createTransitionResult(input);
  }
  const seed = getGambleSessionSeed(input, wager);
  if (sessionState.currentGambleVariant === "short") {
    const nextState = increaseTavernTime(input.gameState, input.houseDefinition.id, 1);
    const staminaMutation = spendPlayerStamina(
      nextState,
      input.characterDefinitions,
      input.playerCharacterId
    );
    const goldMutation = mutatePlayerGold(
      staminaMutation.state,
      staminaMutation.characterDefinitions,
      input.playerCharacterId,
      -wager
    );
    return withShortGambleSession(
      {
        ...input,
        gameState: goldMutation.state,
        characterDefinitions: goldMutation.characterDefinitions,
      },
      sessionState,
      createTavernShortTableSession({
        playerName: playerCharacter.name,
        buyInGold: wager,
        seed,
        debugPresetMode: sessionState.shortDebugPresetMode,
      })
    );
  }
  return withLongGambleSession(
    input,
    sessionState,
    createTavernLongGambleSession({
      wager,
      seed,
      playerName: playerCharacter.name,
      limitMode: "no-limit",
    })
  );
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

  if (overlay.type === "activity-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      overlayAttribute: TAVERN_WORK_OVERLAY_ATTRIBUTE,
      modalClassName: TAVERN_WORK_CONFIRM_MODAL_CLASS_NAME,
      actionsClassName: TAVERN_WORK_CONFIRM_ACTIONS_CLASS_NAME,
      buttonClassName: TAVERN_WORK_BUTTON_CLASS_NAME,
      confirmActionId: overlay.confirmActionId,
      confirmLabel: overlay.confirmLabel,
      cancelActionId: overlay.cancelActionId,
      cancelLabel: overlay.cancelLabel,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
    };
  }

  if (overlay.type === "submit-confirm") {
    return {
      type: "confirm",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      overlayAttribute: TAVERN_WORK_OVERLAY_ATTRIBUTE,
      modalClassName: TAVERN_WORK_CONFIRM_MODAL_CLASS_NAME,
      actionsClassName: TAVERN_WORK_CONFIRM_ACTIONS_CLASS_NAME,
      buttonClassName: TAVERN_WORK_BUTTON_CLASS_NAME,
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

  if (overlay.type === "gamble-choice") {
    return {
      type: "gamble-choice",
      title: overlay.title,
      options: overlay.options,
      cancelActionId: overlay.cancelActionId,
      cancelLabel: "取消",
    };
  }

  if (overlay.type === "gamble-table") {
    const session = overlay.session;
    if (session.variant === "short") {
      return selectTavernShortGambleOverlay(session.table);
    }

    const longSession = session.session;
    const human = getHumanGamblePlayer(longSession);
    const winners = getTavernGambleWinners(longSession);
    const isLong = longSession.variant === "long";
    const humanPublicSlots = human.publicTileSlots ?? [];
    const humanOpenPublicSlots = humanPublicSlots.filter((slot) => !slot.covered);
    const longPublicStage = !isLong
      ? undefined
      : longSession.street === "pre-flop"
        ? "hidden"
        : longSession.street === "flop" && longSession.phase === "betting"
          ? "centered"
          : (longSession.longPublicRevealTicks ?? 0) > 0
            ? "revealing"
            : "revealed";
    const longPublicInHand = isLong && (longPublicStage === "revealing" || longPublicStage === "revealed");
    const humanPublicTiles = (longPublicInHand
      ? humanOpenPublicSlots.map((slot) => ({
          tile: slot.tile,
        }))
      : longSession.publicTiles.map((tile) => ({
          tile,
        }))).map((slot, index) => ({
      id: slot.tile.id,
      label: getTavernMahjongTileLabel(slot.tile),
      selected: longSession.selectedPlayTileIds.includes(slot.tile.id),
      spent: false,
      covered: false,
      actionId:
        longPublicInHand &&
        longSession.phase === "draw-discard" &&
        longSession.pendingDiscardsRemaining > 0
          ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${slot.tile.id}`
          : `gamble-long-public-preview:${index}`,
    }));
    const longVisibleTileIds = [
      ...human.hand.map((tile) => tile.id),
      ...humanOpenPublicSlots.map((slot) => slot.tile.id),
    ];
    const preferredLongOrder = human.longTileOrder ?? [];
    const longTileOrder = preferredLongOrder
      .filter((tileId) => longVisibleTileIds.includes(tileId))
      .concat(longVisibleTileIds.filter((tileId) => !preferredLongOrder.includes(tileId)));
    const longCombinedHandTiles = longTileOrder
      .map((tileId) => {
        const handTile = human.hand.find((tile) => tile.id === tileId);
        if (handTile != null) {
          const actionId =
            longSession.phase === "draw-discard" &&
            longSession.pendingDiscardsRemaining > 0
              ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${handTile.id}`
              : null;
          return {
            id: handTile.id,
            label: getTavernMahjongTileLabel(handTile),
            selected: longSession.selectedPlayTileIds.includes(handTile.id),
            tone: "hand" as const,
            ...(actionId == null ? {} : { actionId }),
          };
        }
        const publicSlot = humanOpenPublicSlots.find((slot) => slot.tile.id === tileId);
        if (publicSlot == null) {
          return null;
        }
        const actionId =
          longSession.phase === "draw-discard" &&
          longSession.pendingDiscardsRemaining > 0
            ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${publicSlot.tile.id}`
            : null;
        return {
          id: publicSlot.tile.id,
          label: getTavernMahjongTileLabel(publicSlot.tile),
          selected: longSession.selectedPlayTileIds.includes(publicSlot.tile.id),
          tone: "public" as const,
          entering: longPublicStage === "revealing",
          revealIndex: humanOpenPublicSlots.findIndex(
            (slot) => slot.tile.id === publicSlot.tile.id
          ),
          ...(actionId == null ? {} : { actionId }),
        };
      })
      .filter((tile): tile is NonNullable<typeof tile> => tile != null);
    return {
      type: "gamble-table",
      variant: "long",
      title: "酒馆长牌",
      street: getTavernGambleStreetLabel(longSession.street),
      phase: getTavernGamblePhaseLabel(longSession.phase),
      pot: longSession.pot,
      currentBet: longSession.currentBet,
      wager: longSession.wager,
      smallBlind: TAVERN_GAMBLE_SMALL_BLIND,
      bigBlind: TAVERN_GAMBLE_BIG_BLIND,
      wallCount: longSession.wall.length,
      publicTiles: humanPublicTiles,
      publicDiscardTiles: longSession.publicDiscards.map((tile) => ({
        label: getTavernMahjongTileLabel(tile),
        fromPublicTile: (longSession.unclaimableDiscardTileIds ?? []).includes(tile.id),
      })),
      handTiles:
        isLong && longPublicInHand
          ? longCombinedHandTiles
          : human.hand.map((tile) => {
              const actionId =
                longSession.phase === "draw-discard" &&
                longSession.pendingDiscardsRemaining > 0
                  ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${tile.id}`
                  : null;
              return {
                id: tile.id,
                label: getTavernMahjongTileLabel(tile),
                selected: longSession.selectedPlayTileIds.includes(tile.id),
                tone: "hand" as const,
                ...(actionId == null ? {} : { actionId }),
              };
            }),
      flowers: human.flowers.map(getTavernMahjongTileLabel),
      playSlotTiles: longSession.selectedPlayTileIds
        .map(
          (tileId) =>
            [
              ...human.hand,
              ...humanOpenPublicSlots.map((slot) => slot.tile),
            ].find((tile) => tile.id === tileId) ?? null
        )
        .filter((tile): tile is NonNullable<typeof tile> => tile != null)
        .map(getTavernMahjongTileLabel),
      playedOwnTileCount: human.playedOwnTileCount,
      completedPlayedGroups: human.playedGroups.length >= 2,
      canConfirmPlayGroup: longSession.selectedPlayTileIds.length === 3,
      melds: [
        ...human.exposedMelds.map(
          (meld) => `${getMeldKindLabel(meld.kind)} ${meld.tileLabel} / ${meld.fan} 番`
        ),
        ...human.playedGroups.map(
          (group) =>
            `${group.usesPublicTile ? "明" : "暗"}${group.kind === "sequence" ? "顺" : "刻"} ${group.tileLabels.join("、")} / 自牌 ${group.ownTileCount}`
        ),
      ],
      logLines: longSession.roundLog.slice(-5),
      pendingDiscardsRemaining: longSession.pendingDiscardsRemaining,
      hasPendingDraw: longSession.pendingDrawTile != null,
      pendingHuChoice: longSession.pendingHumanHu === true && canHumanLongHu(longSession),
      longPublicStage,
      meldCountdownTicks: longSession.meldCountdownTicks,
      meldWindowStage: longSession.meldWindow?.stage ?? null,
      playerRows: longSession.players.map((player) => {
        const score = scoreTavernGambleSessionPlayer(longSession, player).bestScore;
        const playerPublicSlots = player.publicTileSlots ?? [];
        const playerOpenPublicSlots = playerPublicSlots.filter((slot) => !slot.covered);
        const playerCoveredPublicCount =
          playerPublicSlots.length - playerOpenPublicSlots.length;
        return {
          id: player.id,
          name: player.name,
          seatIndex: player.seatIndex,
          committed: player.committed,
          remainingChips: Math.max(0, longSession.wager - player.committed),
          folded: player.folded,
          completedPlayedGroups: player.playedGroups.length >= 2,
          handCount:
            isLong && longPublicInHand
              ? player.hand.length + playerOpenPublicSlots.length
              : player.hand.length,
          discardCount: player.discarded.length,
          lastDiscard:
            player.discarded.length === 0
              ? null
              : getTavernMahjongTileLabel(player.discarded[player.discarded.length - 1]!),
          discardLabels: player.discarded.map((tile) => ({
            label: getTavernMahjongTileLabel(tile),
            fromPublicTile: (longSession.unclaimableDiscardTileIds ?? []).includes(tile.id),
          })),
          publicTileLabels:
            !longPublicInHand
              ? []
              : playerOpenPublicSlots.map((slot) => getTavernMahjongTileLabel(slot.tile)),
          privateBackCount: !longPublicInHand
            ? TAVERN_LONG_GAMBLE_HAND_SIZE
            : player.hand.length + playerCoveredPublicCount,
          playedGroupLabels: player.playedGroups.map(
            (group) =>
              `${group.usesPublicTile ? "明" : "暗"}${group.kind === "sequence" ? "顺" : "刻"} ${group.tileLabels.join("、")}`
          ),
          bestPattern: score.mainPattern,
          bestFan: score.validHu ? score.totalFan : 0,
        };
      }),
      meldOptions: longSession.pendingMelds.map((option) => ({
        id: option.id,
        kind: option.kind,
        label: `${getMeldKindLabel(option.kind)} ${option.tileLabel} / ${option.fan} 番`,
        actionId: `${GAMBLE_MELD_ACTION_PREFIX}${option.id}`,
        flashing: longSession.meldWindow?.source === "discard",
      })),
      showdownRows: (longSession.showdown ?? []).map((row) => ({
        playerName: row.playerName,
        totalFan: row.totalFan,
        best: `${row.bestScore.mainPattern} ${row.bestScore.totalFan} 番`,
        selectedTiles: row.bestScore.selectedTiles,
        detailLines: row.bestScore.detailLines,
        folded: row.folded,
        winner: winners.some((winner) => winner.playerId === row.playerId),
      })),
      actionIds: {
        check: "gamble-check",
        call: "gamble-call",
        raise: "gamble-raise",
        fold: "gamble-fold",
        skipMeld: "gamble-skip-meld",
        draw: "gamble-draw",
        settle: "gamble-settle",
        close: "gamble-close",
        clearPlay: "gamble-clear-play",
        confirmPlay: "gamble-confirm-play",
        passPlay: "gamble-pass-play",
        confirmDiscard: "gamble-confirm-discard",
        pushHu: "gamble-push-hu",
        passHu: "gamble-pass-hu",
      },
    };
  }

  return {
    type: "gamble",
    title: overlay.title,
    variantLabel: overlay.variantLabel,
    wager: overlay.wager,
    options: overlay.options,
    decrementActionId: overlay.decrementActionId,
    incrementActionId: overlay.incrementActionId,
    confirmActionId: overlay.confirmActionId,
    confirmLabel: "开始赌局",
    cancelActionId: overlay.cancelActionId,
    cancelLabel: "取消",
    ...(overlay.debugToggle == null ? {} : { debugToggle: overlay.debugToggle }),
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
      { id: RETURN_TO_WORK_MENU_ACTION_ID, label: "返回" },
    ];
  }

  if (sessionState.workPanelMode === "submit") {
    return [
      ...sessionState.acceptedOffers.map((offer) => ({
        id: `${SUBMIT_WORK_ACTION_PREFIX}${offer.id}`,
        label: `提交：${offer.title}`,
      })),
      { id: RETURN_TO_WORK_MENU_ACTION_ID, label: "返回" },
    ];
  }

  return [
    { id: "open-work-accept", label: "接取" },
    { id: "open-work-submit", label: "提交" },
    { id: "open-boss-dialogue", label: "返回" },
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
        [
          pickRandomResolvedTavernText(
            getTavernTextEntries(input.textEntriesById),
            tavernBossGreetingTextIds
          ),
        ]
      ),
      sideEffects: [
        { type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID },
        { type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
        {
          type: "stop-interval",
          intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
        },
        {
          type: "stop-interval",
          intervalId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID,
        },
      ],
    };
  },
  dispatch(input) {
    if (input.request.type === "tick") {
      if (input.sessionState == null) {
        return createTransitionResult(input);
      }
      if (
        input.request.tickId === TAVERN_GAMBLE_NPC_INTERVAL_ID ||
        input.request.tickId === TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID ||
        input.request.tickId === TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID
      ) {
        return handleGambleTick(input, input.sessionState);
      }
      return handleTavernWorkTick(input, input.sessionState);
    }

    if (input.request.type !== "action") {
      return createTransitionResult(input);
    }

    if (input.request.actionId === "advance-greeting") {
      return withSessionState(input, input.sessionState, {
        dialoguePhase: "open",
        dialogueLines: [
          resolveTavernText(
            getTavernTextEntries(input.textEntriesById),
            "runtime.zhu_yuanzhang.tavern.open.001"
          ),
        ],
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
        dialogueLines: [
          resolveTavernText(
            getTavernTextEntries(input.textEntriesById),
            "runtime.zhu_yuanzhang.tavern.open.002"
          ),
        ],
        overlay: null,
      });
    }

    if (
      input.request.actionId === "open-work" ||
      input.request.actionId === RETURN_TO_WORK_MENU_ACTION_ID ||
      input.request.actionId === "open-work-accept" ||
      input.request.actionId === "open-work-submit" ||
      input.request.actionId === "confirm-submit-work" ||
      input.request.actionId === "tavern-work-stop" ||
      input.request.actionId === "close-tavern-result" ||
      input.request.actionId.startsWith(ACCEPT_WORK_ACTION_PREFIX) ||
      input.request.actionId.startsWith(CONFIRM_START_WORK_ACTION_PREFIX) ||
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
      input.request.actionId === TOGGLE_SHORT_DEBUG_PRESET_ACTION_ID ||
      input.request.actionId === "confirm-gamble" ||
      input.request.actionId.startsWith(SELECT_GAMBLE_VARIANT_ACTION_PREFIX) ||
      input.request.actionId === "gamble-check" ||
      input.request.actionId === "gamble-call" ||
      input.request.actionId === "gamble-raise" ||
      input.request.actionId === "gamble-fold" ||
      input.request.actionId === "gamble-skip-meld" ||
      input.request.actionId === "gamble-draw" ||
      input.request.actionId === "gamble-clear-play" ||
      input.request.actionId === "gamble-confirm-play" ||
      input.request.actionId === "gamble-pass-play" ||
      input.request.actionId === "gamble-settle" ||
      input.request.actionId === "gamble-close" ||
      input.request.actionId === GAMBLE_SHORT_CONTINUE_ACTION_ID ||
      input.request.actionId === GAMBLE_SHORT_REBUY_ACTION_ID ||
      input.request.actionId === GAMBLE_SHORT_CASH_OUT_ACTION_ID ||
      input.request.actionId.startsWith(GAMBLE_MELD_ACTION_PREFIX) ||
      input.request.actionId.startsWith(GAMBLE_DISCARD_ACTION_PREFIX) ||
      input.request.actionId.startsWith(GAMBLE_REORDER_ACTION_PREFIX) ||
      input.request.actionId.startsWith(GAMBLE_CLEAR_LIFTED_TILE_ACTION_PREFIX) ||
      input.request.actionId.startsWith(GAMBLE_PLAY_TILE_ACTION_PREFIX) ||
      input.request.actionId === "gamble-confirm-discard" ||
      input.request.actionId === "gamble-push-hu" ||
      input.request.actionId === "gamble-pass-hu"
    ) {
      return handleGambleAction(input, input.sessionState);
    }

    if (
      input.request.actionId === "cancel-overlay" ||
      input.request.actionId === "close-alert"
    ) {
      if (input.request.actionId === "close-alert") {
        return resolveTavernAlertClose(input, input.sessionState);
      }
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
      sideEffects: [
        { type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID },
        { type: "stop-interval", intervalId: TAVERN_GAMBLE_NPC_INTERVAL_ID },
        {
          type: "stop-interval",
          intervalId: TAVERN_GAMBLE_SHORT_CLAIM_TIMEOUT_INTERVAL_ID,
        },
        {
          type: "stop-interval",
          intervalId: TAVERN_GAMBLE_SHORT_DROP_CLEAR_INTERVAL_ID,
        },
      ],
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
        [
          pickRandomResolvedTavernText(
            getTavernTextEntries(input.textEntriesById),
            tavernBossGreetingTextIds
          ),
        ]
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
    const tavernPrimaryActorId =
      input.houseDefinition.defaultCharacterId ?? tavernBossProfile.actorId;
    const tavernBossActor = {
      characterId: tavernPrimaryActorId,
      name: tavernBossProfile.name,
      title: tavernBossProfile.title,
      actionId: "open-boss-dialogue",
      isSelected: !isIdle,
      interactionActions: [
        {
          id: "open-work",
          label: "工作",
          kind: "special" as const,
          disabled:
            lists.availableOffers.length === 0 &&
            lists.acceptedOffers.length === 0,
        },
        {
          id: "order-drink",
          label: "喝酒",
          kind: "special" as const,
          disabled: playerCharacter.stats.gold < tavernDrinkPrice,
        },
        {
          id: "open-gamble",
          label: "赌博",
          kind: "special" as const,
          tone: "accent" as const,
          disabled: playerCharacter.stats.gold < tavernWagerStep,
        },
      ],
    };

    return {
      moduleId: "tavern",
      houseId: input.houseDefinition.id,
      sceneTitle: "酒馆",
      sceneSubtitle: "找活 / 买酒 / 下注",
      standbyRoster: orderHouseStandbyRoster({
        primaryCharacterId: tavernPrimaryActorId,
        actors: [tavernBossActor],
      }),
      dialogue:
        isIdle
          ? null
          : {
              mode: "character",
              speakerName: tavernBossProfile.name,
              characterId: tavernPrimaryActorId,
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
              className: TAVERN_WORK_ACTION_CONTAINER_CLASS_NAME,
              buttonClassName: TAVERN_WORK_BUTTON_CLASS_NAME,
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
