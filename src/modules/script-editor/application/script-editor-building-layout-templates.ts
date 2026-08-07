import type {
  BuildingLayoutDefinition,
  BuildingLayoutNodeDefinition,
  BuildingLayoutTemplateId,
} from "./script-editor-building-arrangement-contract";

export type ScriptEditorBuildingLayoutTemplateDefinition = {
  id: BuildingLayoutTemplateId;
  reservedRegionIds: readonly string[];
  defaultNodes: readonly BuildingLayoutNodeDefinition[];
};

const DEFAULT_BUILDING_LAYOUT_TEMPLATE_ID: BuildingLayoutTemplateId =
  "default-shell";

const SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_DEFINITIONS: Record<
  BuildingLayoutTemplateId,
  ScriptEditorBuildingLayoutTemplateDefinition
> = {
  "default-shell": {
    id: "default-shell",
    reservedRegionIds: ["header", "hero", "body", "footer"],
    defaultNodes: [
      {
        id: "node.header",
        kind: "header",
        regionId: "header",
        previewSelectable: true,
      },
      {
        id: "node.description",
        kind: "description",
        regionId: "hero",
        previewSelectable: true,
      },
      {
        id: "node.character-seats",
        kind: "character-seats",
        regionId: "body",
        sourceContainerType: "character-seats",
        previewSelectable: true,
        previewDraggable: true,
        previewDropTarget: true,
      },
      {
        id: "node.action-menu",
        kind: "action-menu",
        regionId: "body",
        sourceContainerType: "action-menu",
        actionFilter: "non-leave",
        previewSelectable: true,
        previewDraggable: true,
        previewDropTarget: true,
      },
      {
        id: "node.leave-action",
        kind: "leave-action",
        regionId: "footer",
        sourceContainerType: "action-menu",
        actionFilter: "leave-only",
        previewSelectable: true,
      },
      {
        id: "node.fallback-panels",
        kind: "fallback-panels",
        regionId: "body",
        previewSelectable: true,
        previewDropTarget: true,
      },
    ],
  },
  "meeting-stage": {
    id: "meeting-stage",
    reservedRegionIds: [
      "actions",
      "center",
      "sidebar",
      "focus",
      "leave",
      "fallback",
    ],
    defaultNodes: [
      {
        id: "node.actions",
        kind: "action-menu",
        regionId: "actions",
        sourceContainerType: "action-menu",
        actionFilter: "non-leave",
        presentation: "gold-center-nav",
        previewSelectable: true,
        previewDraggable: true,
        previewDropTarget: true,
      },
      {
        id: "node.meeting-roster",
        kind: "character-seats",
        regionId: "center",
        sourceContainerType: "character-seats",
        characterFilter: "all",
        presentation: "meeting-grid",
        previewSelectable: true,
        previewDraggable: true,
        previewDropTarget: true,
      },
      {
        id: "node.side-roster",
        kind: "character-seats",
        regionId: "sidebar",
        sourceContainerType: "character-seats",
        characterFilter: "secondary",
        presentation: "idle-roster",
        previewSelectable: true,
        previewDraggable: true,
        previewDropTarget: true,
      },
      {
        id: "node.primary-npc",
        kind: "character-seats",
        regionId: "focus",
        sourceContainerType: "character-seats",
        characterFilter: "primary",
        presentation: "portrait-focus",
        previewSelectable: true,
        previewDropTarget: true,
        clickActionId: "open-primary-npc",
      },
      {
        id: "node.leave",
        kind: "leave-action",
        regionId: "leave",
        sourceContainerType: "action-menu",
        actionFilter: "leave-only",
        presentation: "gold-leave",
        previewSelectable: true,
        clickActionId: "leave-building",
      },
      {
        id: "node.fallback-panels",
        kind: "fallback-panels",
        regionId: "fallback",
        previewSelectable: true,
        previewDropTarget: true,
      },
    ],
  },
};

export const SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS = Object.freeze(
  Object.keys(SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_DEFINITIONS)
) as readonly BuildingLayoutTemplateId[];

export function resolveScriptEditorBuildingLayoutTemplateDefinition(
  templateId: BuildingLayoutTemplateId
): ScriptEditorBuildingLayoutTemplateDefinition {
  return (
    SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_DEFINITIONS[templateId] ??
    SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_DEFINITIONS[
      DEFAULT_BUILDING_LAYOUT_TEMPLATE_ID
    ]
  );
}

export function normalizeScriptEditorBuildingLayoutTemplateId(
  templateId: string | null | undefined
): BuildingLayoutTemplateId {
  if (templateId == null) {
    return DEFAULT_BUILDING_LAYOUT_TEMPLATE_ID;
  }

  return SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS.includes(
    templateId as BuildingLayoutTemplateId
  )
    ? (templateId as BuildingLayoutTemplateId)
    : DEFAULT_BUILDING_LAYOUT_TEMPLATE_ID;
}

export function createDefaultScriptEditorBuildingLayoutDefinition(
  templateId: BuildingLayoutTemplateId = DEFAULT_BUILDING_LAYOUT_TEMPLATE_ID
): BuildingLayoutDefinition {
  const normalizedTemplateId =
    normalizeScriptEditorBuildingLayoutTemplateId(templateId);
  return {
    templateId: normalizedTemplateId,
    shellClassNames: [],
    nodes: cloneScriptEditorBuildingLayoutNodes(
      resolveScriptEditorBuildingLayoutTemplateDefinition(normalizedTemplateId)
        .defaultNodes
    ),
  };
}

export function resolveScriptEditorBuildingLayoutDefinition(
  layout: BuildingLayoutDefinition | null | undefined
): BuildingLayoutDefinition {
  const templateId = normalizeScriptEditorBuildingLayoutTemplateId(
    layout?.templateId
  );
  const shellClassNames =
    layout?.shellClassNames?.filter(
      (className, index, source) =>
        className.trim().length > 0 && source.indexOf(className) === index
    ) ?? [];
  const nodes =
    layout?.nodes != null && layout.nodes.length > 0
      ? layout.nodes
      : resolveScriptEditorBuildingLayoutTemplateDefinition(templateId).defaultNodes;

  return {
    templateId,
    shellClassNames,
    nodes: cloneScriptEditorBuildingLayoutNodes(nodes),
  };
}

export function cloneScriptEditorBuildingLayoutNodes(
  nodes: readonly BuildingLayoutNodeDefinition[]
): BuildingLayoutNodeDefinition[] {
  return nodes.map((node) => ({ ...node }));
}
