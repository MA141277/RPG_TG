export type BuildingContainerType =
  | "character-seats"
  | "action-menu"
  | "status-panel"
  | "text-panel"
  | "image-panel"
  | "resource-panel";

export type BuildingContainerSource =
  | {
      type: "arrangement-mounted-npcs";
      includeNpcIds?: string[] | undefined;
    }
  | {
      type: "static-records";
      recordIds: string[];
    };

export type BuildingContainerActionItem = {
  id: string;
  label: string;
  eventId: string;
  isVisible?: boolean | undefined;
  isEnabled?: boolean | undefined;
  disabledHint?: string | undefined;
};

export type BuildingContainerDefinition = {
  id: string;
  type: BuildingContainerType;
  title?: string | undefined;
  source?: BuildingContainerSource | undefined;
  items?: BuildingContainerActionItem[] | undefined;
};

export type BuildingArrangementDefinition = {
  id: string;
  cityId: string;
  buildingId: string;
  displayName?: string | undefined;
  description?: string | undefined;
  backgroundId?: string | undefined;
  mountedNpcIds: string[];
  primaryNpcId: string | null;
  containers: BuildingContainerDefinition[];
  visibleRule?: unknown;
  enterRule?: unknown;
  exitRule?: unknown;
};
