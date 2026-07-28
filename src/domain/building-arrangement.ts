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
      includeNpcIds?: string[];
    }
  | {
      type: "static-records";
      recordIds: string[];
    };

export type BuildingContainerActionItem = {
  id: string;
  label: string;
  eventId: string;
  isVisible?: boolean;
  isEnabled?: boolean;
  disabledHint?: string;
};

export type BuildingLayoutTemplateId = "default-shell" | "meeting-stage";

export type BuildingLayoutNodeKind =
  | "header"
  | "description"
  | "character-seats"
  | "action-menu"
  | "leave-action"
  | "fallback-panels";

export type BuildingLayoutCharacterFilter = "all" | "primary" | "secondary";
export type BuildingLayoutActionFilter = "all" | "non-leave" | "leave-only";

export type BuildingLayoutNodeDefinition = {
  id: string;
  kind: BuildingLayoutNodeKind;
  regionId: string;
  sourceContainerId?: string;
  sourceContainerType?: BuildingContainerType;
  presentation?: string;
  characterFilter?: BuildingLayoutCharacterFilter;
  actionFilter?: BuildingLayoutActionFilter;
  previewSelectable?: boolean;
  previewDraggable?: boolean;
  previewDropTarget?: boolean;
  clickActionId?: string;
};

export type BuildingLayoutDefinition = {
  templateId: BuildingLayoutTemplateId;
  shellClassNames?: string[];
  nodes?: BuildingLayoutNodeDefinition[];
};

export type BuildingContainerDefinition = {
  id: string;
  type: BuildingContainerType;
  title?: string;
  source?: BuildingContainerSource;
  /**
   * Compatibility only. New runtime actions should come from menu resources or
   * event bindings instead of embedding behavior directly in the container.
   */
  items?: BuildingContainerActionItem[];
};

export type BuildingArrangementDefinition = {
  id: string;
  cityId: string;
  buildingId: string;
  displayName?: string;
  description?: string;
  backgroundId?: string;
  layout?: BuildingLayoutDefinition;
  mountedNpcIds: string[];
  primaryNpcId: string | null;
  containers: BuildingContainerDefinition[];
  visibleRule?: unknown;
  enterRule?: unknown;
  exitRule?: unknown;
};
