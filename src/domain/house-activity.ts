export type HouseActivityConfirmOverlayState = {
  type: "activity-confirm";
  title: string;
  paragraphs: string[];
  workDescriptionLines?: string[];
  relatedAbilityLines?: string[];
  costLines?: string[];
  bestScore?: number;
  quickCompleteScore?: number;
  quickCompleteActionId?: string;
  quickCompleteLabel?: string;
  confirmActionId: string;
  confirmLabel: string;
  cancelActionId: string;
  cancelLabel: string;
  tone?: "info" | "success" | "warning";
};
