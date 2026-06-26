export type LeaderResidenceOverlayState =
  | {
      type: "alert";
      title: string;
      paragraphs: string[];
      tone?: "info" | "success" | "warning";
    }
  | null;

export type LeaderResidenceMode = "idle" | "learning";

export type LeaderResidenceSessionState = {
  selectedCharacterId: string;
  dialogueLines: string[];
  mode: LeaderResidenceMode;
  overlay: LeaderResidenceOverlayState;
};
