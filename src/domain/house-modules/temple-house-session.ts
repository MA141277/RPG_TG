export type TempleHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type TempleHouseDonateConfirmOverlayState = {
  type: "donate-confirm";
  title: string;
  paragraphs: string[];
  amount: number;
};

export type TempleHouseOverlayState =
  | TempleHouseAlertOverlayState
  | TempleHouseDonateConfirmOverlayState
  | null;

export type TempleHouseDialoguePhase = "greeting" | "open" | "idle";

export type TempleHouseSessionMode = "daily" | "meeting";

export type TempleHouseMeetingStage =
  | "intro"
  | "reflection"
  | "assign-duty"
  | "assigned"
  | "finished";

export type TempleHouseSessionState = {
  mode: TempleHouseSessionMode;
  meetingStage: TempleHouseMeetingStage;
  dialogueLines: string[];
  dialoguePhase: TempleHouseDialoguePhase;
  overlay: TempleHouseOverlayState;
  selectedTaskId: string | null;
};
