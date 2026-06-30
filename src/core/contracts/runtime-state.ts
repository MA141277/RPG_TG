import type { AppState } from "../../application/app-shell";
import type { GameState } from "../../domain/game-state";

export type RuntimeCoreState = GameState;

export type RuntimeAppState = Pick<
  AppState,
  | "beggingMiniGameState"
  | "autoAdvanceState"
  | "cityDirectoryState"
  | "locationDialogueState"
>;

export type RuntimeViewState = {};

export type RuntimeState = {
  core: RuntimeCoreState;
  app: RuntimeAppState;
  view: RuntimeViewState;
};
