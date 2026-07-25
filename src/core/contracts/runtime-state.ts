import type { AppState } from "../../application/app-shell";
import type { GameState } from "../../domain/game-state";
import type { RuntimeProgressState } from "./progression-runtime";

export type RuntimeCoreState = GameState & {
  runtime: GameState["runtime"] & {
    progression?: RuntimeProgressState;
  };
};

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
