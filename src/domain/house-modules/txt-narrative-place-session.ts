import type { CharacterId } from "../character";
import type {
  TxtNarrativeOverlayOption,
  TxtNarrativePlaceResolution,
  TxtNarrativeTranscriptEntry,
} from "../txt-narrative";

export type TxtNarrativePlaceSessionStatus =
  | "idle"
  | "streaming"
  | "awaiting-choice"
  | "error";

export type TxtNarrativePlaceSessionState = {
  phaseId: string;
  phaseLabel: string;
  proactiveMode: "active" | "paused";
  status: TxtNarrativePlaceSessionStatus;
  currentPlace: TxtNarrativePlaceResolution & {
    houseId: string | null;
    placeName: string;
    npcIds: CharacterId[];
  };
  transcript: TxtNarrativeTranscriptEntry[];
  pendingOptions: TxtNarrativeOverlayOption[];
  customInputValue: string;
  currentRequestId: string | null;
  requestSequence: number;
  knownNpcIds: CharacterId[];
  statusNotice: string | null;
  errorNotice: string | null;
};
