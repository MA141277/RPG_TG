import type { CharacterDefinition, CharacterId } from "./character";
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
    };

export type HouseActionViewModel = {
  id: string;
  label: string;
  disabled?: boolean;
  tone?: "default" | "accent";
};

export type HouseActionContainerViewModel = {
  title?: string;
  actions: HouseActionViewModel[];
};

export type HouseStandbyActorViewModel = {
  characterId: CharacterId;
  name: string;
  title?: string;
  actionId?: string;
  isSelected?: boolean;
  avatarImageUrl?: string | null;
  portraitImageUrl?: string | null;
  avatarArtClassName?: string;
  portraitArtClassName?: string;
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

export type HouseOverlayViewModel =
  | {
      type: "alert";
      title: string;
      paragraphs: string[];
      tone?: "info" | "success" | "warning";
      confirmActionId: string;
      confirmLabel: string;
    }
  | {
      type: "confirm";
      title: string;
      paragraphs: string[];
      confirmActionId: string;
      confirmLabel: string;
      cancelActionId: string;
      cancelLabel: string;
      tone?: "info" | "success" | "warning";
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
    }
  | {
      type: "gamble-table";
      variant: "short" | "long";
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
    }
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

export type HouseModuleBaseInput<ModuleId extends HouseModuleId = HouseModuleId> = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  houseDefinition: HouseDefinition;
  playerCharacterId: CharacterId;
  sessionState: HouseModuleSessionState<ModuleId> | null;
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
  };
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
