import type { AppState } from "../../application/app-shell";
import type { GameState } from "../../domain/game-state";

export type RuntimeCoreState = GameState;

export type RuntimeAppState = Pick<
  AppState,
  | "beggingMiniGameState"
  | "autoAdvanceState"
  | "campaignTravelState"
  | "cityDirectoryState"
  | "cityMenuState"
  | "locationDialogueState"
  | "modalState"
>;

export type RuntimeViewState = {};

export type RuntimeState = {
  core: RuntimeCoreState;
  app: RuntimeAppState;
  view: RuntimeViewState;
};

export type LegacyBridgeRuntimeState = RuntimeState;
