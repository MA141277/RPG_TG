export type HouseActivityConfirmOverlayState = {
  type: "activity-confirm";
  title: string;
  paragraphs: string[];
  confirmActionId: string;
  confirmLabel: string;
  cancelActionId: string;
  cancelLabel: string;
  tone?: "info" | "success" | "warning";
};
