import type { CharacterDefinition, CharacterId } from "./character";
import type { ActivityDefinition } from "./activity";
import type {
  ActivityFortuneBoardCell,
  ActivityFortuneBoardTripletReward,
  ActivityPachinkoBoardBall,
  ActivityPachinkoBoardEventLogEntry,
  ActivityPachinkoBoardPin,
  ActivityPachinkoBoardRewardQueueItem,
  ActivityPachinkoBoardWheelState,
} from "./activity-session";
import type { GameState } from "./game-state";
import type { HouseDefinition } from "./house";
import type { HomeHouseSessionState } from "./house-modules/home-house-session";
import type { GrainShopSessionState } from "./house-modules/grain-shop-session";
import type { KeepHouseSessionState } from "./house-modules/keep-house-session";
import type { LeaderResidenceSessionState } from "./house-modules/leader-residence-session";
import type { MarketHouseSessionState } from "./house-modules/market-house-session";
import type { MedicineHouseSessionState } from "./house-modules/medicine-house-session";
import type { TempleHouseSessionState } from "./house-modules/temple-house-session";
import type { TeaHouseSessionState } from "./house-modules/tea-house-session";
import type { TavernSessionState } from "./house-modules/tavern-session";
import type { NpcInteractionOptionViewModel } from "./npc-interaction";
import type { ReviewAssignmentRow, ReviewPolicyPanel } from "./review";

export type HouseModuleId =
  | "home-house"
  | "keep-house"
  | "leader-residence"
  | "grain-shop"
  | "market-house"
  | "medicine-house"
  | "temple-house"
  | "tea-house"
  | "tavern";

export type HouseModuleRequest =
  | {
      type: "action";
      actionId: string;
    }
  | {
      type: "field";
      fieldId: string;
      value: string;
    }
  | {
      type: "tick";
      tickId: string;
    };

export type HouseModuleSessionStateMap = {
  "home-house": HomeHouseSessionState;
  "keep-house": KeepHouseSessionState;
  "leader-residence": LeaderResidenceSessionState;
  "grain-shop": GrainShopSessionState;
  "market-house": MarketHouseSessionState;
  "medicine-house": MedicineHouseSessionState;
  "temple-house": TempleHouseSessionState;
  "tea-house": TeaHouseSessionState;
  tavern: TavernSessionState;
};

export type ActiveHouseModuleSession = {
  [ModuleId in HouseModuleId]: {
    moduleId: ModuleId;
    state: HouseModuleSessionStateMap[ModuleId];
  };
}[HouseModuleId] | null;

export type HouseModuleSessionState<ModuleId extends HouseModuleId> =
  HouseModuleSessionStateMap[ModuleId];

export type MapAutoAdvanceSnapshot = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
};

export type HouseMapAutoAdvanceCompletion =
  | {
      type: "enter-house";
      houseId: string;
    }
  | {
      type: "restore-house-session";
      houseId: string;
      houseSession: ActiveHouseModuleSession;
    };

export type HouseModuleSideEffect =
  | {
      type: "start-interval";
      intervalId: string;
      everyMs: number;
      request: HouseModuleRequest;
    }
  | {
      type: "stop-interval";
      intervalId: string;
    }
  | {
      type: "start-map-auto-advance";
      intervalId: string;
      everyMs: number;
      targetHouseId: string;
      label: string;
      snapshots?: MapAutoAdvanceSnapshot[];
      completion?: HouseMapAutoAdvanceCompletion;
    }
  | {
      type: "stop-map-auto-advance";
      intervalId: string;
    }
  | {
      type: "play-coin-reward";
      playerCharacterId: string;
      delta: number;
      source: "request-pointer";
    };

export type HouseActionViewModel = {
  id: string;
  label: string;
  disabled?: boolean;
  tone?: "default" | "accent";
  buttonSound?: "light" | "heavy";
};

export type HouseActionContainerViewModel = {
  title?: string;
  className?: string;
  buttonClassName?: string;
  actions: HouseActionViewModel[];
};

export type HouseCharacterCardLevel = 1 | 2 | 3 | 4 | 5;

export type HouseStandbyActorViewModel = {
  characterId: CharacterId;
  name: string;
  title?: string;
  actionId?: string;
  isSelected?: boolean;
  disabled?: boolean;
  cardLevel?: HouseCharacterCardLevel;
  avatarImageUrl?: string | null;
  portraitImageUrl?: string | null;
  avatarArtClassName?: string;
  portraitArtClassName?: string;
  interactionActions?: NpcInteractionOptionViewModel[];
};

export type HouseDialogueViewModel = {
  mode: "narration" | "character";
  textLines: string[];
  speakerName?: string;
  characterId?: CharacterId;
  portraitImageUrl?: string | null;
  portraitArtClassName?: string;
  position?: "left" | "right";
  advanceActionId?: string | null;
  advanceHintText?: string | null;
};

export type HouseStatusMetricViewModel = {
  label: string;
  value: string;
};

export type HouseStatusCardViewModel = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  metrics: HouseStatusMetricViewModel[];
};

type ShortGambleTableOverlay = {
  type: "gamble-table";
  variant: "short";
  title: string;
  clickawayActionId?: string;
  phase: string;
  pot: number;
  currentBet: number;
  chipLabel: string;
  publicCards: Array<{
    id: string;
    label: string;
  }>;
  handSortEnabled: boolean;
  handCards: Array<{
    id: string;
    label: string;
    selected: boolean;
    lifted?: boolean;
    dropping?: boolean;
    incoming?: boolean;
    actionId?: string;
    mouseleaveActionId?: string;
  }>;
  sidePotLabels: string[];
  pendingIncomingCard: {
    source: "draw" | "claim";
    label: string;
  } | null;
  visibleDiscard: {
    seatName: string;
    label: string;
  } | null;
  claimOptions: Array<{
    id: string;
    kind: "chow" | "pong" | "kong";
    label: string;
    actionId: string;
    flashing: boolean;
  }>;
  claimPassAction?: {
    actionId: string;
    label: string;
  } | null;
  claimCountdown?: {
    totalSeconds: number;
    remainingSeconds: number;
    remainingMs: number;
    progressPercent: number;
    label: string;
  } | null;
  availableActions: Array<
    | "check"
    | "call"
    | "raise"
    | "fold"
    | "draw"
    | "confirm-discard"
    | "continue"
    | "rebuy"
    | "cash-out"
  >;
  highlightAvailableActions: boolean;
  playerRows: Array<{
    id: string;
    name: string;
    seatIndex: number;
    tablePosition?: "bottom" | "left" | "top" | "right";
    hiddenHandTiles?: Array<{
      id: string;
      tone: "top" | "mid" | "base";
    }>;
    stack: number;
    committed: number;
    folded: boolean;
    allIn: boolean;
    autoBetPending: boolean;
    statusLabel?: string;
    meldGroups?: Array<{
      kind: "chow" | "pong" | "kong";
      cards: Array<{
        id: string;
        label: string;
      }>;
    }>;
    discardTiles?: Array<{
      id: string;
      label: string;
    }>;
    meldLabels?: string[];
    discardLabels?: string[];
  }>;
  logLines: string[];
  showdownRows: Array<{
    playerName: string;
    bestLabel: string;
    winningPotLabels: string[];
    chipDelta: number;
    folded: boolean;
    winner: boolean;
  }>;
  betweenHandActions?: {
    continueActionId?: string;
    rebuyActionId?: string;
    cashOutActionId: string;
  };
  actionIds: {
    check: string;
    call: string;
    raise: string;
    fold: string;
    draw?: string;
    confirmDiscard?: string;
    close: string;
  };
};

type LongGambleTableOverlay = {
  type: "gamble-table";
  variant: "long";
  title: string;
  street: string;
  phase: string;
  pot: number;
  currentBet: number;
  wager: number;
  smallBlind: number;
  bigBlind: number;
  wallCount: number;
  publicTiles: Array<{
    id: string;
    label: string;
    selected: boolean;
    spent: boolean;
    covered?: boolean;
    actionId: string;
  }>;
  publicDiscardTiles: Array<{
    label: string;
    fromPublicTile?: boolean;
  }>;
  handTiles: Array<{
    id: string;
    label: string;
    selected: boolean;
    covered?: boolean;
    tone?: "hand" | "public";
    entering?: boolean;
    revealIndex?: number;
    actionId?: string | undefined;
  }>;
  playSlotTiles: string[];
  playedOwnTileCount: number;
  completedPlayedGroups: boolean;
  canConfirmPlayGroup: boolean;
  flowers: string[];
  melds: string[];
  logLines: string[];
  pendingDiscardsRemaining: number;
  hasPendingDraw: boolean;
  pendingHuChoice?: boolean;
  longPublicStage?: "hidden" | "centered" | "revealing" | "revealed" | undefined;
  meldCountdownTicks: number;
  meldWindowStage: "chi-pong-kong" | "pong-kong" | "kong" | null;
  playerRows: Array<{
    id: string;
    name: string;
    seatIndex: number;
    committed: number;
    remainingChips: number;
    folded: boolean;
    completedPlayedGroups: boolean;
    handCount: number;
    discardCount: number;
    lastDiscard: string | null;
    discardLabels: Array<{
      label: string;
      fromPublicTile?: boolean;
    }>;
    publicTileLabels?: string[];
    privateBackCount?: number;
    playedGroupLabels: string[];
    bestPattern: string;
    bestFan: number;
  }>;
  meldOptions: Array<{
    id: string;
    kind: "chi" | "pong" | "public-kong" | "concealed-kong";
    label: string;
    actionId: string;
    flashing: boolean;
  }>;
  showdownRows: Array<{
    playerName: string;
    totalFan: number;
    best: string;
    selectedTiles: string[];
    detailLines: string[];
    folded: boolean;
    winner: boolean;
  }>;
  actionIds: {
    check: string;
    call: string;
    raise: string;
    fold: string;
    skipMeld: string;
    draw: string;
    settle: string;
    close: string;
    clearPlay: string;
    confirmPlay: string;
    passPlay: string;
    confirmDiscard?: string;
    pushHu?: string;
    passHu?: string;
  };
};

export type HouseOverlayViewModel =
  | {
      type: "alert";
      title: string;
      paragraphs: string[];
      tone?: "info" | "success" | "warning";
      confirmActionId: string;
      confirmLabel: string;
      confirmButtonSound?: "light" | "heavy";
    }
  | {
      type: "review-assignment-table";
      title: string;
      rows: ReviewAssignmentRow[];
      confirmActionId: string;
      confirmLabel: string;
    }
  | {
      type: "review-policy-panel";
      title: string;
      policy: ReviewPolicyPanel;
      closeActionId?: string;
      closeLabel?: string;
    }
  | {
      type: "confirm";
      title: string;
      paragraphs: string[];
      overlayAttribute?: string;
      modalClassName?: string;
      actionsClassName?: string;
      buttonClassName?: string;
      workDescriptionLines?: string[];
      relatedAbilityLines?: string[];
      costLines?: string[];
      bestScore?: number;
      quickCompleteScore?: number;
      quickCompleteActionId?: string;
      quickCompleteLabel?: string;
      quickCompleteButtonSound?: "light" | "heavy";
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      tone?: "info" | "success" | "warning";
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
    }
  | {
      type: "rest-days";
      title: string;
      paragraphs: string[];
      dayCount: string;
      quantityFieldId: string;
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
    }
  | {
      type: "quantity-confirm";
      title: string;
      paragraphs: string[];
      quantityLabel: string;
      quantity: number;
      maxQuantity: number;
      quantityFieldId: string;
      decrementActionId: string;
      incrementActionId: string;
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
      decrementButtonSound?: "light" | "heavy";
      incrementButtonSound?: "light" | "heavy";
    }
  | {
      type: "trade";
      title: string;
      mode: "buy" | "sell";
      grainPrice: number;
      quantity: number;
      tradeTotal: number;
      quantityFieldId: string;
      decrementActionId: string;
      incrementActionId: string;
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
      decrementButtonSound?: "light" | "heavy";
      incrementButtonSound?: "light" | "heavy";
    }
  | {
      type: "market-trade";
      title: string;
      mode: "buy" | "sell";
      quantity: number;
      quantityFieldId: string;
      decrementActionId: string;
      incrementActionId: string;
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      rows: Array<{
        goodsId: string;
        name: string;
        categoryLabel: string;
        currentPrice: number;
        referencePrice: number;
        unit: string;
        quantityLabel: string;
        priceTone: "low" | "high" | "neutral";
        isSelected: boolean;
      }>;
      selectedSummary: {
        goodsId: string;
        name: string;
        categoryLabel: string;
        currentPrice: number;
        referencePrice: number;
        unit: string;
        availableQuantity: number;
        quantityLabel: string;
        tradeTotal: number;
        priceTone: "low" | "high" | "neutral";
      } | null;
      helperLines: string[];
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
      decrementButtonSound?: "light" | "heavy";
      incrementButtonSound?: "light" | "heavy";
    }
  | {
      type: "grain-price-report";
      title: string;
      subtitle: string;
      rows: Array<{
        cityId: string;
        cityName: string;
        directionLabel: string;
        grainUnit: string;
        sellPrice: number;
        buyPrice: number;
        comparisonLabel: string;
        priceTone: "low" | "high" | "neutral";
        isCurrentCity: boolean;
      }>;
      confirmActionId: string;
      confirmLabel: string;
    }
  | {
      type: "minigame";
      title: string;
      secondsLeft: number;
      score: number;
      wrongsLeft: number;
      ledgerRows: HouseStatusMetricViewModel[];
      correctActionId: string;
      wrongActionId: string;
    }
  | {
      type: "result";
      title: string;
      grade: string;
      score: number;
      rewardLines: string[];
      confirmActionId: string;
      confirmLabel: string;
      confirmButtonSound?: "light" | "heavy";
    }
  | {
      type: "debate";
      title: string;
      actorName: string;
      round: number;
      secondsLeft: number;
      playerSpirit: number;
      npcSpirit: number;
      timeoutCount: number;
      topicActionIds: Array<{
        topic: string;
        actionId: string;
      }>;
      selectedTopic: string | null;
      confirmActionId: string;
      confirmDisabled?: boolean;
      lastRoundSummary: string[];
    }
  | {
      type: "gamble-choice";
      title: string;
      options: Array<{
        id: string;
        label: string;
        description: string;
        actionId: string;
      }>;
      cancelActionId: string;
      cancelLabel: string;
      optionButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
    }
  | {
      type: "gamble";
      title: string;
      variantLabel?: string;
      wager: number;
      options: number[];
      decrementActionId: string;
      incrementActionId: string;
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
      decrementButtonSound?: "light" | "heavy";
      incrementButtonSound?: "light" | "heavy";
      debugToggle?: {
        actionId: string;
        label: string;
        helperText: string;
      } | null;
    }
  | ShortGambleTableOverlay
  | LongGambleTableOverlay
  | {
      type: "medicine-buy";
      title: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        typeLabel: string;
        actionId: string;
        isSelected: boolean;
        disabled?: boolean;
      }>;
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      confirmButtonSound?: "light" | "heavy";
      cancelButtonSound?: "light" | "heavy";
    }
  | {
      type: "medicine-compounding";
      title: string;
      ailmentName: string;
      coldRequired: number;
      healRequired: number;
      maxPoison: number;
      secondsLeft: number;
      selectionsLeft: number;
      herbs: Array<{
        id: string;
        name: string;
        cold: number;
        heat: number;
        poison: number;
        heal: number;
        actionId: string;
      }>;
      selectionSummary: string[];
      clearActionId: string;
      clearLabel: string;
      finishActionId: string;
      finishLabel: string;
    }
  | {
      type: "fortune-board";
      title: string;
      taskLabel: string;
      board: ActivityFortuneBoardCell[];
      remainingPieces: number;
      wager: number;
      phase: string;
      highlightedColumn: number | null;
      selectedColumn: number | null;
      flashActive: boolean;
      pickFlashActive: boolean;
      highlightedCellKey: string | null;
      pickedCellKey: string | null;
      selectedCellKeys: string[];
      score: number;
      baseScore: number;
      tripletRewards: ActivityFortuneBoardTripletReward[];
      resonanceCount: number;
      rumorCount: number;
      rerollCount: number;
      animationTickMs: number;
      speedFieldId: string;
      playActionId: string;
      decreaseWagerActionId: string;
      increaseWagerActionId: string;
    }
  | {
      type: "pachinko-board";
      title: string;
      taskLabel: string;
      boardWidth: number;
      boardHeight: number;
      remainingBalls: number;
      totalBalls: number;
      phase: string;
      activeBall: ActivityPachinkoBoardBall | null;
      activeBalls: ActivityPachinkoBoardBall[];
      pins: ActivityPachinkoBoardPin[];
      movingGatePins: [ActivityPachinkoBoardPin, ActivityPachinkoBoardPin];
      gatePassCount: number;
      eventCharge: number;
      eventLog: ActivityPachinkoBoardEventLogEntry[];
      score: number;
      lastSlotIndex: number | null;
      slotValues: Array<number | "wheel">;
      rewardQueue: ActivityPachinkoBoardRewardQueueItem[];
      wheelState: ActivityPachinkoBoardWheelState;
      flipperAngle: number;
      movingGateX: number;
      layoutRefreshElapsedMs: number;
      layoutRefreshPeriodMs: number;
      layoutVersion: number;
      playActionId: string;
    }
  | {
      type: "qte-bar";
      title: string;
      taskLabel: string;
      round: number;
      totalRounds: number;
      successes: number;
      markerPercent: number;
      targetStartPercent: number;
      targetWidthPercent: number;
      helperLines: string[];
      stopActionId: string;
    };

export type HouseModuleViewModel = {
  moduleId: HouseModuleId;
  houseId: string;
  sceneTitle: string;
  sceneSubtitle?: string;
  standbyRoster: HouseStandbyActorViewModel[];
  dialogue: HouseDialogueViewModel | null;
  actionContainer: HouseActionContainerViewModel | null;
  statusCard: HouseStatusCardViewModel | null;
  overlay: HouseOverlayViewModel | null;
  leaveAction: HouseActionViewModel;
};

export type HouseModuleViewRenderer = (
  viewModel: HouseModuleViewModel
) => string;

export type HouseModuleBaseInput<ModuleId extends HouseModuleId = HouseModuleId> = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  houseDefinition: HouseDefinition;
  playerCharacterId: CharacterId;
  sessionState: HouseModuleSessionState<ModuleId> | null;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

export type HouseModuleEnterInput<ModuleId extends HouseModuleId = HouseModuleId> =
  Omit<HouseModuleBaseInput<ModuleId>, "sessionState">;

export type HouseModuleDispatchInput<ModuleId extends HouseModuleId = HouseModuleId> =
  HouseModuleBaseInput<ModuleId> & {
  request: HouseModuleRequest;
};

export type HouseModuleLeaveInput<ModuleId extends HouseModuleId = HouseModuleId> =
  HouseModuleBaseInput<ModuleId>;

export type HouseModuleViewModelInput<ModuleId extends HouseModuleId = HouseModuleId> =
  HouseModuleBaseInput<ModuleId>;

export type HouseModuleTransitionResult<ModuleId extends HouseModuleId = HouseModuleId> = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  sessionState: HouseModuleSessionState<ModuleId> | null;
  timeAdvanceCost?: number;
  councilArrivalNotice?: {
    speakerCharacterId?: string;
    textLines: string[];
    advanceHintText?: string;
  } | undefined;
  sideEffects?: HouseModuleSideEffect[];
  navigation?: { type: "stay-in-house" };
};

export type HouseModuleDefinition<ModuleId extends HouseModuleId = HouseModuleId> = {
  moduleId: ModuleId;
  enter(input: HouseModuleEnterInput<ModuleId>): HouseModuleTransitionResult<ModuleId>;
  dispatch(input: HouseModuleDispatchInput<ModuleId>): HouseModuleTransitionResult<ModuleId>;
  leave(input: HouseModuleLeaveInput<ModuleId>): HouseModuleTransitionResult<ModuleId>;
  selectViewModel(input: HouseModuleViewModelInput<ModuleId>): HouseModuleViewModel;
};
