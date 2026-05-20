import type { CharacterDefinition, CharacterId } from "./character";
import type { GameState } from "./game-state";
import type { HouseDefinition } from "./house";
import type { GrainShopSessionState } from "./house-modules/grain-shop-session";

export type HouseModuleId = "grain-shop";

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
};

export type HouseDialogueViewModel = {
  mode: "narration" | "character";
  textLines: string[];
  speakerName?: string;
  characterId?: CharacterId;
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

export type HouseModuleSessionStateMap = {
  "grain-shop": GrainShopSessionState;
};

export type ActiveHouseModuleSession = {
  [ModuleId in HouseModuleId]: {
    moduleId: ModuleId;
    state: HouseModuleSessionStateMap[ModuleId];
  };
}[HouseModuleId] | null;

export type HouseModuleSessionState<ModuleId extends HouseModuleId> =
  HouseModuleSessionStateMap[ModuleId];

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
  sideEffects?: HouseModuleSideEffect[];
};

export type HouseModuleDefinition<ModuleId extends HouseModuleId = HouseModuleId> = {
  moduleId: ModuleId;
  enter(input: HouseModuleEnterInput<ModuleId>): HouseModuleTransitionResult<ModuleId>;
  dispatch(input: HouseModuleDispatchInput<ModuleId>): HouseModuleTransitionResult<ModuleId>;
  leave(input: HouseModuleLeaveInput<ModuleId>): HouseModuleTransitionResult<ModuleId>;
  selectViewModel(input: HouseModuleViewModelInput<ModuleId>): HouseModuleViewModel;
};
