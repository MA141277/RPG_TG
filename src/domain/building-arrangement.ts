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

export type BuildingLayoutTemplateId =
  | "default-shell"
  | "meeting-stage";

export type BuildingLayoutNodeKind =
  | "header"
  | "description"
  | "character-seats"
  | "action-menu"
  | "leave-action"
  | "fallback-panels";

export type BuildingLayoutCharacterFilter =
  | "all"
  | "primary"
  | "secondary";

export type BuildingLayoutActionFilter =
  | "all"
  | "non-leave"
  | "leave-only";

export type BuildingLayoutNodeDefinition = {
  id: string;
  kind: BuildingLayoutNodeKind;
  regionId: string;
  sourceContainerId?: string | undefined;
  sourceContainerType?: BuildingContainerType | undefined;
  presentation?: string | undefined;
  characterFilter?: BuildingLayoutCharacterFilter | undefined;
  actionFilter?: BuildingLayoutActionFilter | undefined;
  previewSelectable?: boolean | undefined;
  previewDraggable?: boolean | undefined;
  previewDropTarget?: boolean | undefined;
  clickActionId?: string | undefined;
};

export type BuildingLayoutDefinition = {
  templateId: BuildingLayoutTemplateId;
  shellClassNames?: string[] | undefined;
  nodes?: BuildingLayoutNodeDefinition[] | undefined;
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
  layout?: BuildingLayoutDefinition | undefined;
  mountedNpcIds: string[];
  primaryNpcId: string | null;
  containers: BuildingContainerDefinition[];
  visibleRule?: unknown;
  enterRule?: unknown;
  exitRule?: unknown;
};
