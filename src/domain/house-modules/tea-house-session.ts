import type { HouseActivityConfirmOverlayState } from "../house-activity";
import type { HouseDialogueOverrideState } from "../house-module";
import type {
  TeaHouseDebateSummary,
  TeaHouseDebateWinner,
  TeaHouseTopicCard,
} from "../tea-house";

export type TeaHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type TeaHouseDebateOverlayState = {
  type: "debate";
  actorId: string;
  actorName: string;
  round: number;
  secondsLeft: number;
  playerSpirit: number;
  npcSpirit: number;
  timeoutCount: number;
  consecutivePlayerWins: number;
  plannedNpcTopic: TeaHouseTopicCard;
  selectedPlayerTopic: TeaHouseTopicCard | null;
  lastPlayerTopic: TeaHouseTopicCard | null;
  lastNpcTopic: TeaHouseTopicCard | null;
  lastRoundWinner: TeaHouseDebateWinner | null;
  lastRoundLines: string[];
};

export type TeaHouseResultOverlayState = {
  type: "result";
  title: string;
  paragraphs: string[];
  outcome: TeaHouseDebateSummary;
};

export type TeaHouseOverlayState =
  | TeaHouseAlertOverlayState
  | HouseActivityConfirmOverlayState
  | TeaHouseDebateOverlayState
  | TeaHouseResultOverlayState
  | null;

export type TeaHouseDialoguePhase = "greeting" | "open" | "idle";

export type TeaHouseSessionState = {
  guestNpcIds: string[];
  selectedActorId: string | null;
  dialogueLines: string[];
  dialogueOverride?: HouseDialogueOverrideState | null;
  dialoguePhase: TeaHouseDialoguePhase;
  overlay: TeaHouseOverlayState;
};
