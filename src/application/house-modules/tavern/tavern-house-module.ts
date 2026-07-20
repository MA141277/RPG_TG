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
  createTavernGambleSession,
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

const ACCEPT_WORK_ACTION_PREFIX = "accept-work:";
const CONFIRM_START_WORK_ACTION_PREFIX = "confirm-start-work:";
const SUBMIT_WORK_ACTION_PREFIX = "submit-work:";
const TAVERN_WORK_INTERVAL_ID = "tavern-work-qte";
const TAVERN_GAMBLE_NPC_INTERVAL_ID = "tavern-gamble-npc-thinking";
const TAVERN_WORK_TOTAL_ROUNDS = 3;
const TAVERN_WORK_MARKER_STEP = 7;
const GAMBLE_MELD_ACTION_PREFIX = "gamble-meld:";
const GAMBLE_DISCARD_ACTION_PREFIX = "gamble-discard:";
const GAMBLE_REORDER_ACTION_PREFIX = "gamble-reorder:";
const GAMBLE_PLAY_TILE_ACTION_PREFIX = "gamble-play-tile:";
const SELECT_GAMBLE_VARIANT_ACTION_PREFIX = "select-gamble-variant:";
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
    sideEffects: [{ type: "stop-interval", intervalId: TAVERN_WORK_INTERVAL_ID }],
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

  if (input.request.actionId === "open-work") {
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

function resolveGambleSettlement(
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

function getGambleSideEffects(session: TavernGambleSession): HouseModuleTransitionResult<"tavern">["sideEffects"] {
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

function withGambleSession(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState,
  gambleSession: TavernGambleSession
): HouseModuleTransitionResult<"tavern"> {
  return withSessionState(
    input,
    sessionState,
    {
      gambleSession,
      overlay: {
        type: "gamble-table",
        session: gambleSession,
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
    getGambleSideEffects(gambleSession)
  );
}

function handleGambleTick(
  input: HouseModuleDispatchInput<"tavern">,
  sessionState: TavernSessionState
): HouseModuleTransitionResult<"tavern"> {
  if (
    input.request.type !== "tick" ||
    input.request.tickId !== TAVERN_GAMBLE_NPC_INTERVAL_ID ||
    sessionState.gambleSession == null
  ) {
    return createTransitionResult(input);
  }

  const nextSession =
    (sessionState.gambleSession.longPublicRevealTicks ?? 0) > 0
      ? advanceTavernLongPublicReveal(sessionState.gambleSession)
      : sessionState.gambleSession.phase === "meld-window"
        ? advanceTavernGambleMeldCountdown(sessionState.gambleSession)
        : advanceTavernGambleNpcThinking(sessionState.gambleSession);
  return withGambleSession(input, sessionState, nextSession);
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
            description: "保留原有酒馆短牌规则。",
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
      overlay: {
        type: "gamble",
        title: `${getGambleVariantLabel(selectedVariant)}下注`,
        variant: selectedVariant,
        variantLabel: getGambleVariantLabel(selectedVariant),
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
    if (sessionState == null || sessionState.gambleSession == null) {
      return createTransitionResult(input);
    }

    const actionId = input.request.actionId;
    const gambleSession = sessionState.gambleSession;

    if (
      actionId === "gamble-check" ||
      actionId === "gamble-call" ||
      actionId === "gamble-raise" ||
      actionId === "gamble-fold"
    ) {
      const action = actionId.replace("gamble-", "") as TavernGambleActionKind;
      return withGambleSession(
        input,
        sessionState,
        resolveTavernGambleBettingAction(gambleSession, action)
      );
    }
    if (actionId === "gamble-skip-meld") {
      return withGambleSession(input, sessionState, skipTavernGambleMeld(gambleSession));
    }
    const meldId = parseActionId(actionId, GAMBLE_MELD_ACTION_PREFIX);
    if (meldId != null) {
      return withGambleSession(input, sessionState, declareTavernGambleMeld(gambleSession, meldId));
    }
    if (actionId === "gamble-draw") {
      return withGambleSession(input, sessionState, drawForTavernGamble(gambleSession));
    }
    if (actionId === "gamble-clear-play") {
      return withGambleSession(input, sessionState, clearTavernGamblePlaySlot(gambleSession));
    }
    if (actionId === "gamble-confirm-play") {
      return withGambleSession(input, sessionState, confirmTavernGamblePlayGroup(gambleSession));
    }
    if (actionId === "gamble-pass-play") {
      return withGambleSession(input, sessionState, passTavernGamblePlayGroups(gambleSession));
    }
    if (actionId === "gamble-push-hu") {
      return withGambleSession(input, sessionState, pushHumanLongHu(gambleSession));
    }
    if (actionId === "gamble-pass-hu") {
      return withGambleSession(input, sessionState, passHumanLongHu(gambleSession));
    }
    if (actionId === "gamble-confirm-discard") {
      return withGambleSession(
        input,
        sessionState,
        confirmSelectedTavernGambleDiscards(gambleSession)
      );
    }
    const playTileId = parseActionId(actionId, GAMBLE_PLAY_TILE_ACTION_PREFIX);
    if (playTileId != null) {
      return withGambleSession(
        input,
        sessionState,
        toggleTavernGamblePlayTile(gambleSession, playTileId)
      );
    }
    const discardTileId = parseActionId(actionId, GAMBLE_DISCARD_ACTION_PREFIX);
    if (discardTileId != null) {
      return withGambleSession(
        input,
        sessionState,
        toggleTavernGamblePlayTile(gambleSession, discardTileId)
      );
    }
    const reorderPayload = parseActionId(actionId, GAMBLE_REORDER_ACTION_PREFIX);
    if (reorderPayload != null) {
      const [tileId, beforeTileId] = reorderPayload.split(":");
      if (tileId == null || tileId.length === 0) {
        return createTransitionResult(input);
      }
      return withGambleSession(
        input,
        sessionState,
        reorderTavernGambleHand(
          gambleSession,
          tileId,
          beforeTileId == null || beforeTileId === "end" ? null : beforeTileId
        )
      );
    }
    if (actionId === "gamble-settle") {
      return resolveGambleSettlement(input, sessionState, gambleSession);
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
  const createSession =
    sessionState.currentGambleVariant === "long"
      ? createTavernLongGambleSession
      : createTavernGambleSession;
  return withGambleSession(
    input,
    sessionState,
    createSession({
      wager,
      seed: getGambleSessionSeed(input, wager),
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
    const human = getHumanGamblePlayer(session);
    const winners = getTavernGambleWinners(session);
    const isLong = session.variant === "long";
    const humanPublicSlots = human.publicTileSlots ?? [];
    const humanOpenPublicSlots = humanPublicSlots.filter((slot) => !slot.covered);
    const longPublicStage = !isLong
      ? undefined
      : session.street === "pre-flop"
        ? "hidden"
        : session.street === "flop" && session.phase === "betting"
          ? "centered"
          : (session.longPublicRevealTicks ?? 0) > 0
            ? "revealing"
            : "revealed";
    const longPublicInHand = isLong && (longPublicStage === "revealing" || longPublicStage === "revealed");
    const humanPublicTiles = isLong
      ? (longPublicInHand
          ? humanOpenPublicSlots.map((slot) => ({
              tile: slot.tile,
            }))
          : session.publicTiles.map((tile) => ({
              tile,
            }))).map((slot, index) => ({
          id: slot.tile.id,
          label: getTavernMahjongTileLabel(slot.tile),
          selected: session.selectedPlayTileIds.includes(slot.tile.id),
          spent: false,
          covered: false,
          actionId:
            longPublicInHand &&
            session.phase === "draw-discard" &&
            session.pendingDiscardsRemaining > 0
              ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${slot.tile.id}`
              : `gamble-long-public-preview:${index}`,
        }))
      : session.publicTiles.map((tile) => ({
          id: tile.id,
          label: getTavernMahjongTileLabel(tile),
          selected: session.selectedPlayTileIds.includes(tile.id),
          spent: (human.spentPublicTileIds ?? []).includes(tile.id),
          actionId: `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${tile.id}`,
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
            session.phase === "draw-discard" && session.pendingDiscardsRemaining > 0
              ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${handTile.id}`
              : null;
          return {
            id: handTile.id,
            label: getTavernMahjongTileLabel(handTile),
            selected: session.selectedPlayTileIds.includes(handTile.id),
            tone: "hand" as const,
            ...(actionId == null ? {} : { actionId }),
          };
        }
        const publicSlot = humanOpenPublicSlots.find((slot) => slot.tile.id === tileId);
        if (publicSlot == null) {
          return null;
        }
        const actionId =
          session.phase === "draw-discard" && session.pendingDiscardsRemaining > 0
            ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${publicSlot.tile.id}`
            : null;
        return {
          id: publicSlot.tile.id,
          label: getTavernMahjongTileLabel(publicSlot.tile),
          selected: session.selectedPlayTileIds.includes(publicSlot.tile.id),
          tone: "public" as const,
          entering: longPublicStage === "revealing",
          revealIndex: humanOpenPublicSlots.findIndex((slot) => slot.tile.id === publicSlot.tile.id),
          ...(actionId == null ? {} : { actionId }),
        };
      })
      .filter((tile): tile is NonNullable<typeof tile> => tile != null);
    return {
      type: "gamble-table",
      variant: session.variant,
      title: isLong ? "酒馆长牌" : "酒馆短牌",
      street: getTavernGambleStreetLabel(session.street),
      phase: getTavernGamblePhaseLabel(session.phase),
      pot: session.pot,
      currentBet: session.currentBet,
      wager: session.wager,
      smallBlind: TAVERN_GAMBLE_SMALL_BLIND,
      bigBlind: TAVERN_GAMBLE_BIG_BLIND,
      wallCount: session.wall.length,
      publicTiles: humanPublicTiles,
      publicDiscardTiles: session.publicDiscards.map((tile) => ({
        label: getTavernMahjongTileLabel(tile),
        fromPublicTile: (session.unclaimableDiscardTileIds ?? []).includes(tile.id),
      })),
      handTiles:
        isLong && longPublicInHand
          ? longCombinedHandTiles
          : human.hand.map((tile) => {
              const actionId =
                session.phase === "draw-discard" && session.pendingDiscardsRemaining > 0
                  ? `${GAMBLE_PLAY_TILE_ACTION_PREFIX}${tile.id}`
                  : null;
              return {
                id: tile.id,
                label: getTavernMahjongTileLabel(tile),
                selected: session.selectedPlayTileIds.includes(tile.id),
                tone: "hand" as const,
                ...(actionId == null ? {} : { actionId }),
              };
            }),
      flowers: human.flowers.map(getTavernMahjongTileLabel),
      playSlotTiles: session.selectedPlayTileIds
        .map(
          (tileId) =>
            [
              ...human.hand,
              ...(isLong ? humanOpenPublicSlots.map((slot) => slot.tile) : session.publicTiles),
            ].find((tile) => tile.id === tileId) ?? null
        )
        .filter((tile): tile is NonNullable<typeof tile> => tile != null)
        .map(getTavernMahjongTileLabel),
      playedOwnTileCount: human.playedOwnTileCount,
      completedPlayedGroups: human.playedGroups.length >= 2,
      canConfirmPlayGroup: session.selectedPlayTileIds.length === 3,
      melds: [
        ...human.exposedMelds.map(
          (meld) => `${getMeldKindLabel(meld.kind)} ${meld.tileLabel} / ${meld.fan} 番`
        ),
        ...human.playedGroups.map(
          (group) =>
            `${group.usesPublicTile ? "明" : "暗"}${group.kind === "sequence" ? "顺" : "刻"} ${group.tileLabels.join("、")} / 自牌 ${group.ownTileCount}`
        ),
      ],
      logLines: session.roundLog.slice(-5),
      pendingDiscardsRemaining: session.pendingDiscardsRemaining,
      hasPendingDraw: session.pendingDrawTile != null,
      pendingHuChoice: session.pendingHumanHu === true && canHumanLongHu(session),
      longPublicStage,
      meldCountdownTicks: session.meldCountdownTicks,
      meldWindowStage: session.meldWindow?.stage ?? null,
      playerRows: session.players.map((player) => {
        const score = scoreTavernGambleSessionPlayer(session, player).bestScore;
        const playerPublicSlots = player.publicTileSlots ?? [];
        const playerOpenPublicSlots = playerPublicSlots.filter((slot) => !slot.covered);
        const playerCoveredPublicCount = playerPublicSlots.length - playerOpenPublicSlots.length;
        return {
          id: player.id,
          name: player.name,
          seatIndex: player.seatIndex,
          committed: player.committed,
          remainingChips: Math.max(0, session.wager - player.committed),
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
            fromPublicTile: (session.unclaimableDiscardTileIds ?? []).includes(tile.id),
          })),
          publicTileLabels:
            !longPublicInHand
              ? []
              : playerOpenPublicSlots.map((slot) => getTavernMahjongTileLabel(slot.tile)),
          privateBackCount: isLong
            ? !longPublicInHand
              ? TAVERN_LONG_GAMBLE_HAND_SIZE
              : player.hand.length + playerCoveredPublicCount
            : 0,
          playedGroupLabels: player.playedGroups.map(
            (group) =>
              `${group.usesPublicTile ? "明" : "暗"}${group.kind === "sequence" ? "顺" : "刻"} ${group.tileLabels.join("、")}`
          ),
          bestPattern: score.mainPattern,
          bestFan: score.validHu ? score.totalFan : 0,
        };
      }),
      meldOptions: session.pendingMelds.map((option) => ({
        id: option.id,
        kind: option.kind,
        label: `${getMeldKindLabel(option.kind)} ${option.tileLabel} / ${option.fan} 番`,
        actionId: `${GAMBLE_MELD_ACTION_PREFIX}${option.id}`,
        flashing: session.meldWindow?.source === "discard",
      })),
      showdownRows: (session.showdown ?? []).map((row) => ({
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
      ],
    };
  },
  dispatch(input) {
    if (input.request.type === "tick") {
      if (input.sessionState == null) {
        return createTransitionResult(input);
      }
      if (input.request.tickId === TAVERN_GAMBLE_NPC_INTERVAL_ID) {
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
      input.request.actionId.startsWith(GAMBLE_MELD_ACTION_PREFIX) ||
      input.request.actionId.startsWith(GAMBLE_DISCARD_ACTION_PREFIX) ||
      input.request.actionId.startsWith(GAMBLE_REORDER_ACTION_PREFIX) ||
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
