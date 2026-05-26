export type HomeHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type HomeHouseRestDaysOverlayState = {
  type: "rest-days";
  inputValue: string;
};

export type HomeHouseOverlayState =
  | HomeHouseAlertOverlayState
  | HomeHouseRestDaysOverlayState
  | null;

export type HomeHouseMode = "main" | "rest-menu";

export type HomeHouseSessionState = {
  mode: HomeHouseMode;
  descriptionLines: string[];
  overlay: HomeHouseOverlayState;
};
