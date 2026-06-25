import type { HouseActivityConfirmOverlayState } from "../house-activity";
import type {
  TeaHouseDebateEmotion,
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
  phase: "selecting" | "npc-thinking";
  secondsLeft: number;
  playerSpirit: number;
  npcSpirit: number;
  timeoutCount: number;
  consecutivePlayerWins: number;
  playerHand: TeaHouseTopicCard[];
  npcHand: TeaHouseTopicCard[];
  npcEmotion: TeaHouseDebateEmotion;
  selectedPlayerHandIndex: number | null;
  pendingPlayerHandIndex: number | null;
  pendingNpcHandIndex: number | null;
  pendingDidTimeout: boolean;
  hintedNpcTopic: TeaHouseTopicCard | null;
  predictionTicksRemaining: number;
  thinkingTicksRemaining: number;
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
  dialoguePhase: TeaHouseDialoguePhase;
  overlay: TeaHouseOverlayState;
};
