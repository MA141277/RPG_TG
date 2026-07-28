export type MenuTargetFamily =
  | "dialogue"
  | "event"
  | "trade"
  | "minigame"
  | "info";

export type MenuEntryDefinition = {
  id: string;
  label: string;
  menuFamily: string;
  targetFamily: MenuTargetFamily;
  targetId: string;
  isVisible: boolean;
  isEnabled: boolean;
  disabledHint: string;
};

export type MenuResourceDefinition = {
  id: string;
  title: string;
  entries: MenuEntryDefinition[];
};

export type MenuInstanceDefinition = {
  id: string;
  title: string;
  resourceId: string;
};
