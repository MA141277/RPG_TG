import type {
  LocationAccessConditionExpression,
  ScriptEditorAccessRule,
  ScriptEditorBuildingArrangementRecord,
  ScriptEditorBuildingContainerRecord,
  ScriptEditorBuildingLayoutActionFilter,
  ScriptEditorBuildingLayoutCharacterFilter,
  ScriptEditorBuildingLayoutNodeKind,
  ScriptEditorBuildingLayoutNodeRecord,
  ScriptEditorBuildingLayoutRecord,
  ScriptEditorBuildingLayoutTemplateId,
  ScriptEditorBuildingContainerType,
  ScriptEditorBuildingEntryBinding,
  ScriptEditorBuildingRecord,
  ScriptEditorCityMountedBuilding,
  ScriptEditorCityRecord,
  ScriptEditorCustomAttributeEntry,
  ScriptEditorMenuEntry,
  ScriptEditorMenuTargetFamily,
  ScriptEditorProjectDefinition,
} from "../../domain/script-editor-project";
import type { HouseDefinition } from "../../domain/house";
import {
  BUILDING_LAYOUT_TEMPLATE_IDS,
  createDefaultBuildingLayoutDefinition,
  normalizeBuildingLayoutTemplateId,
  resolveBuildingLayoutDefinition,
} from "../building/building-layout-templates";
import {
  appendScriptEditorLocationAccessCondition,
  normalizeScriptEditorLocationAccessConditionExpression,
  removeScriptEditorLocationAccessCondition,
  updateScriptEditorLocationAccessConditionField,
} from "./location-access-authoring";
import { allocateNextScriptEditorProjectCanonicalId } from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_CITY_DEFAULT_MENU_FAMILIES = [
  "overview",
  "intel",
  "locations",
  "management",
] as const;

export const SCRIPT_EDITOR_BUILDING_DEFAULT_MENU_FAMILIES = [
  "dialogue",
  "trade",
  "work",
  "rest",
  "intel",
  "minigame",
  "management",
  "leave",
] as const;

export const SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES = [
  "character-seats",
  "action-menu",
  "status-panel",
  "text-panel",
  "image-panel",
  "resource-panel",
] as const satisfies readonly ScriptEditorBuildingContainerType[];

export const SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS = [
  ...BUILDING_LAYOUT_TEMPLATE_IDS,
] as const satisfies readonly ScriptEditorBuildingLayoutTemplateId[];

export const SCRIPT_EDITOR_BUILDING_LAYOUT_NODE_KINDS = [
  "header",
  "description",
  "character-seats",
  "action-menu",
  "leave-action",
  "fallback-panels",
] as const satisfies readonly ScriptEditorBuildingLayoutNodeKind[];

export const SCRIPT_EDITOR_BUILDING_LAYOUT_CHARACTER_FILTERS = [
  "all",
  "primary",
  "secondary",
] as const satisfies readonly ScriptEditorBuildingLayoutCharacterFilter[];

export const SCRIPT_EDITOR_BUILDING_LAYOUT_ACTION_FILTERS = [
  "all",
  "non-leave",
  "leave-only",
] as const satisfies readonly ScriptEditorBuildingLayoutActionFilter[];

function createDefaultAccessRule(): ScriptEditorAccessRule {
  return {};
}

function createDefaultMenuEntry(idBase: string, menuFamily: string): ScriptEditorMenuEntry {
  return {
    id: `${idBase}.${slugifyMenuFamily(menuFamily)}`,
    label: menuFamily,
    menuFamily,
    targetFamily: "info",
    targetId: "",
    isVisible: true,
    isEnabled: true,
    disabledHint: "",
  };
}

function createDefaultBuildingEntryBinding(): ScriptEditorBuildingEntryBinding {
  return {
    defaultPersonId: "",
    returnTarget: "city",
  };
}

function createDefaultBackAction(): HouseDefinition["backAction"] {
  return {
    label: "返回",
    targetView: "city",
  };
}

function createDefaultBuildingLayoutNode(nodeIndex: number): ScriptEditorBuildingLayoutNodeRecord {
  return {
    id: `node.new.${nodeIndex}`,
    kind: "action-menu",
    regionId: "body",
    sourceContainerType: "action-menu",
    actionFilter: "all",
    previewSelectable: true,
  };
}

export function createDefaultScriptEditorBuildingLayoutRecord(
  templateId: ScriptEditorBuildingLayoutTemplateId = "default-shell"
): ScriptEditorBuildingLayoutRecord {
  return toScriptEditorBuildingLayoutRecord(
    createDefaultBuildingLayoutDefinition(templateId)
  );
}

export function readScriptEditorBuildingLayoutRecord(
  layout: ScriptEditorBuildingLayoutRecord | undefined
): ScriptEditorBuildingLayoutRecord {
  return toScriptEditorBuildingLayoutRecord(
    resolveBuildingLayoutDefinition(layout)
  );
}

function toScriptEditorBuildingLayoutRecord(
  layout: ReturnType<typeof resolveBuildingLayoutDefinition>
): ScriptEditorBuildingLayoutRecord {
  return {
    templateId: layout.templateId,
    shellClassNames: [...(layout.shellClassNames ?? [])],
    nodes: (layout.nodes ?? []).map((node) => ({ ...node })),
  };
}

function isBuildingLayoutNodeKind(value: string): value is ScriptEditorBuildingLayoutNodeKind {
  return SCRIPT_EDITOR_BUILDING_LAYOUT_NODE_KINDS.includes(
    value as ScriptEditorBuildingLayoutNodeKind
  );
}

function isBuildingContainerType(value: string): value is ScriptEditorBuildingContainerType {
  return SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES.includes(
    value as ScriptEditorBuildingContainerType
  );
}

function isBuildingLayoutCharacterFilter(
  value: string
): value is ScriptEditorBuildingLayoutCharacterFilter {
  return SCRIPT_EDITOR_BUILDING_LAYOUT_CHARACTER_FILTERS.includes(
    value as ScriptEditorBuildingLayoutCharacterFilter
  );
}

function isBuildingLayoutActionFilter(
  value: string
): value is ScriptEditorBuildingLayoutActionFilter {
  return SCRIPT_EDITOR_BUILDING_LAYOUT_ACTION_FILTERS.includes(
    value as ScriptEditorBuildingLayoutActionFilter
  );
}

export function createDefaultScriptEditorCityRecord(
  indexOrId: number | string
): ScriptEditorCityRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  const id = typeof indexOrId === "string" ? indexOrId : `city.new.${suffix}`;
  const name = `New City ${suffix}`;
  return {
    id,
    name,
    mapPlacement: {
      x: 0,
      y: 0,
      label: name,
      summary: "",
      kind: "city",
    },
    baseAttributes: {},
    profileMap: { displayName: name, description: "", tags: [] },
    extendedAttributes: [],
    mountedBuildings: [],
    description: "",
    menuEntries: SCRIPT_EDITOR_CITY_DEFAULT_MENU_FAMILIES.map((family) =>
      createDefaultMenuEntry(`${id}.menu`, family)
    ),
    access: createDefaultAccessRule(),
  };
}

export function createDefaultScriptEditorBuildingRecord(
  indexOrId: number | string,
  cityId = "city.start"
): ScriptEditorBuildingRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  const id =
    typeof indexOrId === "string" ? indexOrId : `building.new.${suffix}`;
  const name = `New Building ${suffix}`;
  return {
    id,
    cityId,
    name,
    baseAttributes: {
      houseType: "custom",
      characterIds: [],
      defaultCharacterId: null,
      activityLocationId: "custom",
    },
    profileMap: { displayName: name, description: "", tags: [] },
    extendedAttributes: [],
    backAction: createDefaultBackAction(),
    description: "",
    menuEntries: SCRIPT_EDITOR_BUILDING_DEFAULT_MENU_FAMILIES.map((family) =>
      createDefaultMenuEntry(`${id}.menu`, family)
    ),
    access: createDefaultAccessRule(),
    entryBinding: createDefaultBuildingEntryBinding(),
  };
}

export function normalizeScriptEditorCityRecord(
  city: Partial<ScriptEditorCityRecord> & { id: string }
): ScriptEditorCityRecord {
  const rawCity = city as Partial<ScriptEditorCityRecord> & Record<string, unknown>;
  return {
    id: city.id,
    name: normalizeString(city.name, city.id),
    backgroundId: normalizeOptionalString(rawCity.backgroundId),
    ...(normalizeOptionalString(rawCity.regionId).length === 0
      ? {}
      : { regionId: normalizeOptionalString(rawCity.regionId) }),
    ...(normalizeOptionalString(rawCity.mapNodeId).length === 0
      ? {}
      : { mapNodeId: normalizeOptionalString(rawCity.mapNodeId) }),
    ...(normalizeCityMapPlacement(rawCity.mapPlacement, rawCity.mapNodeId, city.name) == null
      ? {}
      : {
          mapPlacement: normalizeCityMapPlacement(
            rawCity.mapPlacement,
            rawCity.mapNodeId,
            city.name
          ) as NonNullable<ScriptEditorCityRecord["mapPlacement"]>,
        }),
    houseIds: normalizeStringArray(rawCity.houseIds),
    mountedBuildings: normalizeCityMountedBuildings(rawCity.mountedBuildings),
    neighbourCityIds: normalizeStringArray(rawCity.neighbourCityIds),
    ...(typeof rawCity.travelCost === "number" ? { travelCost: rawCity.travelCost } : {}),
    baseAttributes: normalizeCityBaseAttributes(city.baseAttributes),
    profileMap: normalizeProfileMap(city.profileMap, city.description),
    extendedAttributes: normalizeCustomAttributes(city.extendedAttributes),
    description: normalizeOptionalString(city.description),
    menuEntries: normalizeMenuEntries(city.menuEntries, `${city.id}.menu`),
    access: normalizeAccessRule(city.access),
  };
}

export function normalizeScriptEditorBuildingRecord(
  building: Partial<ScriptEditorBuildingRecord> & { id: string }
): ScriptEditorBuildingRecord {
  const rawBuilding = building as Partial<ScriptEditorBuildingRecord> &
    Record<string, unknown>;
  return {
    id: building.id,
    cityId: normalizeString(building.cityId, "city.start"),
    name: normalizeString(building.name, building.id),
    backgroundId: normalizeOptionalString(rawBuilding.backgroundId),
    baseAttributes: normalizeBuildingBaseAttributes(rawBuilding),
    profileMap: normalizeProfileMap(building.profileMap, building.description),
    extendedAttributes: normalizeCustomAttributes(building.extendedAttributes),
    description: normalizeOptionalString(building.description),
    menuEntries: normalizeMenuEntries(building.menuEntries, `${building.id}.menu`),
    access: normalizeAccessRule(building.access),
    entryBinding: normalizeBuildingEntryBinding(building.entryBinding),
    backAction: normalizeBackAction(building.backAction),
  };
}

export function updateScriptEditorCityField(
  city: ScriptEditorCityRecord,
  field: "id" | "name" | "description" | "backgroundId",
  value: string
): ScriptEditorCityRecord {
  if (field === "description") {
    return normalizeScriptEditorCityRecord({ ...city, description: value });
  }
  if (field === "name") {
    return normalizeScriptEditorCityRecord(
      syncDerivedCityNameFields(city, value.trim())
    );
  }
  return normalizeScriptEditorCityRecord({ ...city, [field]: value.trim() });
}

export function appendScriptEditorCityMountedBuilding(
  city: ScriptEditorCityRecord
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: [
      ...(city.mountedBuildings ?? []),
      { buildingId: "", npcIds: [], primaryNpcId: null },
    ],
  };
}

export function removeScriptEditorCityMountedBuilding(
  city: ScriptEditorCityRecord,
  index: number
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: (city.mountedBuildings ?? []).filter(
      (_, itemIndex) => itemIndex !== index
    ),
  };
}

export function updateScriptEditorCityMountedBuilding(
  city: ScriptEditorCityRecord,
  index: number,
  buildingId: string
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: (city.mountedBuildings ?? []).map((entry, itemIndex) =>
      itemIndex === index ? { ...entry, buildingId } : entry
    ),
  };
}

export function appendScriptEditorCityMountedBuildingNpc(
  city: ScriptEditorCityRecord,
  buildingIndex: number,
  npcId = ""
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: (city.mountedBuildings ?? []).map((entry, itemIndex) =>
      itemIndex === buildingIndex
        ? { ...entry, npcIds: [...entry.npcIds, npcId] }
        : entry
    ),
  };
}

export function removeScriptEditorCityMountedBuildingNpc(
  city: ScriptEditorCityRecord,
  buildingIndex: number,
  npcIndex: number
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: (city.mountedBuildings ?? []).map((entry, itemIndex) =>
      itemIndex === buildingIndex
        ? {
            ...entry,
            npcIds: entry.npcIds.filter((_, entryNpcIndex) => entryNpcIndex !== npcIndex),
          }
        : entry
    ),
  };
}

export function updateScriptEditorCityMountedBuildingNpc(
  city: ScriptEditorCityRecord,
  buildingIndex: number,
  npcIndex: number,
  npcId: string
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: (city.mountedBuildings ?? []).map((entry, itemIndex) =>
      itemIndex === buildingIndex
        ? {
            ...entry,
            npcIds: entry.npcIds.map((entryNpcId, entryNpcIndex) =>
              entryNpcIndex === npcIndex ? npcId : entryNpcId
            ),
          }
        : entry
    ),
  };
}

export function updateScriptEditorCityMountedBuildingPrimaryNpc(
  city: ScriptEditorCityRecord,
  buildingIndex: number,
  primaryNpcId: string
): ScriptEditorCityRecord {
  return {
    ...city,
    mountedBuildings: (city.mountedBuildings ?? []).map((entry, itemIndex) =>
      itemIndex === buildingIndex ? { ...entry, primaryNpcId } : entry
    ),
  };
}

export function listScriptEditorCityBuildingArrangements(
  project: ScriptEditorProjectDefinition,
  cityId: string
): ScriptEditorBuildingArrangementRecord[] {
  return project.buildingArrangements.filter((arrangement) => arrangement.cityId === cityId);
}

export function appendScriptEditorBuildingArrangement(
  project: ScriptEditorProjectDefinition,
  cityId: string
): ScriptEditorProjectDefinition {
  const defaultBuilding =
    project.buildings.find((building) => building.cityId === cityId) ??
    project.buildings[0] ??
    null;
  if (defaultBuilding == null) {
    return project;
  }
  const nextArrangementId = allocateNextScriptEditorProjectCanonicalId(
    project,
    "buildingArrangements"
  );
  return {
    ...project,
    buildingArrangements: [
      ...project.buildingArrangements,
      {
        id: nextArrangementId,
        cityId,
        buildingId: defaultBuilding.id,
        displayName: defaultBuilding.name,
        layout: createDefaultScriptEditorBuildingLayoutRecord(),
        mountedNpcIds: [],
        primaryNpcId: null,
        containers: [],
      },
    ],
  };
}

export function removeScriptEditorBuildingArrangement(
  project: ScriptEditorProjectDefinition,
  arrangementId: string
): ScriptEditorProjectDefinition {
  return {
    ...project,
    buildingArrangements: project.buildingArrangements.filter(
      (arrangement) => arrangement.id !== arrangementId
    ),
  };
}

export function updateScriptEditorBuildingArrangementField(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  field:
    | "id"
    | "cityId"
    | "buildingId"
    | "displayName"
    | "description"
    | "backgroundId",
  value: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const normalizedValue = field === "description" ? value.trim() : value.trim();
    if (
      ["displayName", "description", "backgroundId"].includes(field) &&
      normalizedValue.length === 0
    ) {
      const nextArrangement = { ...arrangement };
      delete nextArrangement[field];
      return nextArrangement;
    }
    return {
      ...arrangement,
      [field]: normalizedValue,
    };
  });
}

export function appendScriptEditorBuildingArrangementNpc(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  npcId = ""
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => ({
    ...arrangement,
    mountedNpcIds: [...arrangement.mountedNpcIds, npcId],
  }));
}

export function removeScriptEditorBuildingArrangementNpc(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  npcIndex: number
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const mountedNpcIds = arrangement.mountedNpcIds.filter(
      (_, entryIndex) => entryIndex !== npcIndex
    );
    return {
      ...arrangement,
      mountedNpcIds,
      primaryNpcId:
        arrangement.primaryNpcId != null && mountedNpcIds.includes(arrangement.primaryNpcId)
          ? arrangement.primaryNpcId
          : null,
    };
  });
}

export function updateScriptEditorBuildingArrangementNpc(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  npcIndex: number,
  npcId: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const mountedNpcIds = arrangement.mountedNpcIds.map((entryNpcId, entryIndex) =>
      entryIndex === npcIndex ? npcId : entryNpcId
    );
    return {
      ...arrangement,
      mountedNpcIds,
      primaryNpcId:
        arrangement.primaryNpcId != null && mountedNpcIds.includes(arrangement.primaryNpcId)
          ? arrangement.primaryNpcId
          : null,
    };
  });
}

export function updateScriptEditorBuildingArrangementPrimaryNpc(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  primaryNpcId: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => ({
    ...arrangement,
    primaryNpcId: arrangement.mountedNpcIds.includes(primaryNpcId) ? primaryNpcId : null,
  }));
}

export function appendScriptEditorBuildingArrangementContainer(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  type: ScriptEditorBuildingContainerType = "character-seats"
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const nextIndex = arrangement.containers.length + 1;
    return {
      ...arrangement,
      containers: [
        ...arrangement.containers,
        {
          id: `${arrangement.id}.container.${nextIndex}`,
          type,
          source:
            type === "character-seats"
              ? { type: "arrangement-mounted-npcs", includeNpcIds: [] }
              : undefined,
          items: type === "action-menu" ? [] : undefined,
        },
      ],
    };
  });
}

export function removeScriptEditorBuildingArrangementContainer(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  containerIndex: number
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => ({
    ...arrangement,
    containers: arrangement.containers.filter((_, entryIndex) => entryIndex !== containerIndex),
  }));
}

export function updateScriptEditorBuildingArrangementContainerField(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  containerIndex: number,
  field: "id" | "type" | "title",
  value: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangementContainer(
    project,
    arrangementId,
    containerIndex,
    (container) => {
      if (field === "type") {
        const type = normalizeBuildingContainerType(value);
        return {
          ...container,
          type,
          source:
            type === "character-seats"
              ? container.source ?? { type: "arrangement-mounted-npcs", includeNpcIds: [] }
              : undefined,
          items: type === "action-menu" ? container.items ?? [] : undefined,
        };
      }
      const normalizedValue = value.trim();
      if (field === "title" && normalizedValue.length === 0) {
        const nextContainer = { ...container };
        delete nextContainer.title;
        return nextContainer;
      }
      return { ...container, [field]: normalizedValue };
    }
  );
}

export function updateScriptEditorBuildingArrangementLayoutField(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  field: "templateId" | "shellClassNames",
  value: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const currentLayout = readScriptEditorBuildingLayoutRecord(arrangement.layout);
    if (field === "templateId") {
      const templateId = normalizeBuildingLayoutTemplateId(value);
      const nextLayout =
        arrangement.layout?.nodes != null && arrangement.layout.nodes.length > 0
          ? { ...currentLayout, templateId }
          : {
              ...createDefaultScriptEditorBuildingLayoutRecord(templateId),
              shellClassNames: [...(currentLayout.shellClassNames ?? [])],
            };
      return {
        ...arrangement,
        layout: nextLayout,
      };
    }

    const shellClassNames = value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry, index, source) => entry.length > 0 && source.indexOf(entry) === index);

    return {
      ...arrangement,
      layout: {
        ...currentLayout,
        shellClassNames,
      },
    };
  });
}

export function appendScriptEditorBuildingArrangementLayoutNode(
  project: ScriptEditorProjectDefinition,
  arrangementId: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const currentLayout = readScriptEditorBuildingLayoutRecord(arrangement.layout);
    const nodes = currentLayout.nodes ?? [];
    return {
      ...arrangement,
      layout: {
        ...currentLayout,
        nodes: [...nodes, createDefaultBuildingLayoutNode(nodes.length + 1)],
      },
    };
  });
}

export function removeScriptEditorBuildingArrangementLayoutNode(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  nodeIndex: number
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const currentLayout = readScriptEditorBuildingLayoutRecord(arrangement.layout);
    return {
      ...arrangement,
      layout: {
        ...currentLayout,
        nodes: (currentLayout.nodes ?? []).filter((_, index) => index !== nodeIndex),
      },
    };
  });
}

export function updateScriptEditorBuildingArrangementLayoutNodeField(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  nodeIndex: number,
  field:
    | "id"
    | "kind"
    | "regionId"
    | "sourceContainerId"
    | "sourceContainerType"
    | "presentation"
    | "characterFilter"
    | "actionFilter"
    | "clickActionId",
  value: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangementLayoutNode(
    project,
    arrangementId,
    nodeIndex,
    (node) => {
      const normalizedValue = value.trim();

      if (field === "kind") {
        const kind: ScriptEditorBuildingLayoutNodeKind = isBuildingLayoutNodeKind(value)
          ? value
          : "action-menu";
        return {
          ...node,
          kind,
        };
      }

      if (field === "sourceContainerType") {
        return normalizedValue.length === 0
          ? removeOptionalLayoutNodeField(node, field)
          : {
              ...node,
              sourceContainerType: isBuildingContainerType(value)
                ? value
                : node.sourceContainerType,
            };
      }

      if (field === "characterFilter") {
        return normalizedValue.length === 0
          ? removeOptionalLayoutNodeField(node, field)
          : {
              ...node,
              characterFilter: isBuildingLayoutCharacterFilter(value)
                ? value
                : node.characterFilter,
            };
      }

      if (field === "actionFilter") {
        return normalizedValue.length === 0
          ? removeOptionalLayoutNodeField(node, field)
          : {
              ...node,
              actionFilter: isBuildingLayoutActionFilter(value)
                ? value
                : node.actionFilter,
            };
      }

      if (
        (
          field === "sourceContainerId" ||
          field === "presentation" ||
          field === "clickActionId"
        ) &&
        normalizedValue.length === 0
      ) {
        return removeOptionalLayoutNodeField(node, field);
      }

      return {
        ...node,
        [field]: normalizedValue,
      };
    }
  );
}

export function updateScriptEditorBuildingArrangementLayoutNodeFlag(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  nodeIndex: number,
  field: "previewSelectable" | "previewDraggable" | "previewDropTarget",
  checked: boolean
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangementLayoutNode(
    project,
    arrangementId,
    nodeIndex,
    (node) =>
      checked
        ? { ...node, [field]: true }
        : removeOptionalLayoutNodeField(node, field)
  );
}

export function appendScriptEditorBuildingArrangementContainerActionItem(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  containerIndex: number
): ScriptEditorProjectDefinition {
  const defaultEvent = project.events[0] ?? null;
  if (defaultEvent == null) {
    return project;
  }
  return updateScriptEditorBuildingArrangementContainer(
    project,
    arrangementId,
    containerIndex,
    (container) => {
      const nextIndex = (container.items ?? []).length + 1;
      return {
        ...container,
        items: [
          ...(container.items ?? []),
          {
            id: `${container.id}.action.${nextIndex}`,
            label: defaultEvent.id,
            eventId: defaultEvent.id,
            isVisible: true,
            isEnabled: true,
          },
        ],
      };
    }
  );
}

export function removeScriptEditorBuildingArrangementContainerActionItem(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  containerIndex: number,
  actionIndex: number
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangementContainer(
    project,
    arrangementId,
    containerIndex,
    (container) => ({
      ...container,
      items: (container.items ?? []).filter((_, entryIndex) => entryIndex !== actionIndex),
    })
  );
}

export function updateScriptEditorBuildingArrangementContainerActionItemField(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  containerIndex: number,
  actionIndex: number,
  field: "id" | "label" | "eventId" | "disabledHint",
  value: string
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangementContainer(
    project,
    arrangementId,
    containerIndex,
    (container) => ({
      ...container,
      items: (container.items ?? []).map((item, entryIndex) => {
        if (entryIndex !== actionIndex) {
          return item;
        }
        const normalizedValue = value.trim();
        if (field === "disabledHint" && normalizedValue.length === 0) {
          const nextItem = { ...item };
          delete nextItem.disabledHint;
          return nextItem;
        }
        return { ...item, [field]: normalizedValue };
      }),
    })
  );
}

function updateScriptEditorBuildingArrangement(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  updateArrangement: (
    arrangement: ScriptEditorBuildingArrangementRecord
  ) => ScriptEditorBuildingArrangementRecord
): ScriptEditorProjectDefinition {
  return {
    ...project,
    buildingArrangements: project.buildingArrangements.map((arrangement) =>
      arrangement.id === arrangementId ? updateArrangement(arrangement) : arrangement
    ),
  };
}

function updateScriptEditorBuildingArrangementContainer(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  containerIndex: number,
  updateContainer: (
    container: ScriptEditorBuildingContainerRecord
  ) => ScriptEditorBuildingContainerRecord
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => ({
    ...arrangement,
    containers: arrangement.containers.map((container, entryIndex) =>
      entryIndex === containerIndex ? updateContainer(container) : container
    ),
  }));
}

function updateScriptEditorBuildingArrangementLayoutNode(
  project: ScriptEditorProjectDefinition,
  arrangementId: string,
  nodeIndex: number,
  updateNode: (
    node: ScriptEditorBuildingLayoutNodeRecord
  ) => ScriptEditorBuildingLayoutNodeRecord
): ScriptEditorProjectDefinition {
  return updateScriptEditorBuildingArrangement(project, arrangementId, (arrangement) => {
    const currentLayout = readScriptEditorBuildingLayoutRecord(arrangement.layout);
    return {
      ...arrangement,
      layout: {
        ...currentLayout,
        nodes: (currentLayout.nodes ?? []).map((node, index) =>
          index === nodeIndex ? updateNode(node) : node
        ),
      },
    };
  });
}

function removeOptionalLayoutNodeField<
  TField extends
    | "sourceContainerId"
    | "sourceContainerType"
    | "presentation"
    | "characterFilter"
    | "actionFilter"
    | "clickActionId"
    | "previewSelectable"
    | "previewDraggable"
    | "previewDropTarget",
>(node: ScriptEditorBuildingLayoutNodeRecord, field: TField): ScriptEditorBuildingLayoutNodeRecord {
  const nextNode = { ...node };
  delete nextNode[field];
  return nextNode;
}

export function updateScriptEditorBuildingField(
  building: ScriptEditorBuildingRecord,
  field: "id" | "cityId" | "name" | "description" | "backgroundId",
  value: string
): ScriptEditorBuildingRecord {
  if (field === "description") {
    return normalizeScriptEditorBuildingRecord({ ...building, description: value });
  }
  return normalizeScriptEditorBuildingRecord({ ...building, [field]: value.trim() });
}

export function appendScriptEditorLocationAttribute<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord): TRecord {
  return {
    ...record,
    extendedAttributes: [
      ...normalizeEditableCustomAttributes(record.extendedAttributes),
      { key: "", label: "", value: "" },
    ],
  };
}

export function removeScriptEditorLocationAttribute<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord, index: number): TRecord {
  return {
    ...record,
    extendedAttributes: normalizeEditableCustomAttributes(
      record.extendedAttributes
    ).filter((_, entryIndex) => entryIndex !== index),
  };
}

export function updateScriptEditorLocationAttribute<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  index: number,
  field: keyof ScriptEditorCustomAttributeEntry | "key",
  value: string
): TRecord {
  return {
    ...record,
    extendedAttributes: normalizeEditableCustomAttributes(
      record.extendedAttributes
    ).map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry
    ),
  };
}

export function appendScriptEditorMenuEntry<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord): TRecord {
  const nextIndex = (record.menuEntries?.length ?? 0) + 1;
  return {
    ...record,
    menuEntries: [
      ...(record.menuEntries ?? []),
      createDefaultMenuEntry(`${record.id}.menu`, `entry-${nextIndex}`),
    ],
  };
}

export function removeScriptEditorMenuEntry<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord, index: number): TRecord {
  return {
    ...record,
    menuEntries: (record.menuEntries ?? []).filter((_, itemIndex) => itemIndex !== index),
  };
}

export function updateScriptEditorMenuEntryField<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  index: number,
  field:
    | "id"
    | "label"
    | "menuFamily"
    | "targetFamily"
    | "targetId"
    | "disabledHint",
  value: string
): TRecord {
  return {
    ...record,
    menuEntries: (record.menuEntries ?? []).map((entry, itemIndex) => {
      if (itemIndex !== index) {
        return entry;
      }
      if (field === "targetFamily") {
        return {
          ...entry,
          targetFamily: normalizeMenuTargetFamily(value),
        };
      }
      return {
        ...entry,
        [field]: value.trim(),
      };
    }),
  };
}

export function toggleScriptEditorMenuEntryFlag<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  index: number,
  field: "isVisible" | "isEnabled",
  checked: boolean
): TRecord {
  return {
    ...record,
    menuEntries: (record.menuEntries ?? []).map((entry, itemIndex) =>
      itemIndex === index ? { ...entry, [field]: checked } : entry
    ),
  };
}

export function updateScriptEditorAccessField<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  field: keyof ScriptEditorAccessRule | "state" | "blockedSpeaker",
  value: string
): TRecord {
  const access = normalizeAccessRule(record.access);
  if (field === "state") {
    return {
      ...record,
      access: {
        ...access,
        ...(value === "visible-disabled" || value === "hidden"
          ? { conditionExpression: { type: "literal", value: false } as const }
          : {}),
      },
    };
  }
  if (field === "conditionExpression") {
    const conditionExpression = parseLocationAccessConditionExpression(value);
    return {
      ...record,
      access: {
        ...omitAccessField(access, "conditionExpression"),
        ...(conditionExpression == null ? {} : { conditionExpression }),
      },
    };
  }
  return {
    ...record,
    access: {
      ...access,
      [field === "blockedSpeaker" ? "blockedSpeakerId" : field]: value,
    },
  };
}

export function appendScriptEditorAccessCondition<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord): TRecord {
  const access = normalizeAccessRule(record.access);
  return {
    ...record,
    access: {
      ...access,
      conditionExpression: appendScriptEditorLocationAccessCondition(
        access.conditionExpression
      ),
    },
  };
}

export function removeScriptEditorAccessCondition<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(record: TRecord, index: number): TRecord {
  const access = normalizeAccessRule(record.access);
  const conditionExpression = removeScriptEditorLocationAccessCondition(
    access.conditionExpression,
    index
  );
  return {
    ...record,
    access: {
      ...omitAccessField(access, "conditionExpression"),
      ...(conditionExpression == null ? {} : { conditionExpression }),
    },
  };
}

export function updateScriptEditorAccessConditionField<
  TRecord extends ScriptEditorCityRecord | ScriptEditorBuildingRecord,
>(
  record: TRecord,
  index: number,
  field:
    | "factor"
    | "eventId"
    | "eventState"
    | "personId"
    | "personField"
    | "timeField"
    | "operator"
    | "literalValue"
    | "sourceField",
  value: string
): TRecord {
  const access = normalizeAccessRule(record.access);
  const conditionExpression = updateScriptEditorLocationAccessConditionField(
    access.conditionExpression,
    index,
    field,
    value
  );
  return {
    ...record,
    access: {
      ...omitAccessField(access, "conditionExpression"),
      ...(conditionExpression == null ? {} : { conditionExpression }),
    },
  };
}

export function updateScriptEditorBuildingEntryBindingField(
  building: ScriptEditorBuildingRecord,
  field: keyof ScriptEditorBuildingEntryBinding,
  value: string
): ScriptEditorBuildingRecord {
  return {
    ...building,
    entryBinding: {
      ...normalizeBuildingEntryBinding(building.entryBinding),
      [field]: value.trim(),
    },
  };
}

function normalizeCityMountedBuildings(value: unknown): ScriptEditorCityMountedBuilding[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const rawEntry = entry as Partial<ScriptEditorCityMountedBuilding> &
      Record<string, unknown>;
    const npcIds = normalizeStringArray(rawEntry.npcIds);
    const primaryNpcId = normalizeNullableString(rawEntry.primaryNpcId);
    return {
      buildingId: normalizeOptionalString(rawEntry.buildingId).trim(),
      npcIds,
      primaryNpcId:
        primaryNpcId != null && npcIds.includes(primaryNpcId) ? primaryNpcId : null,
    };
  });
}

function syncDerivedCityNameFields(
  city: ScriptEditorCityRecord,
  nextName: string
): ScriptEditorCityRecord {
  const previousName = normalizeString(city.name, city.id);
  const currentMapPlacement =
    city.mapPlacement != null && typeof city.mapPlacement === "object"
      ? city.mapPlacement
      : null;
  const currentLabel = normalizeOptionalString(currentMapPlacement?.label).trim();
  const shouldSyncMapLabel =
    currentMapPlacement != null &&
    currentLabel.length > 0 &&
    currentLabel === previousName;

  return {
    ...city,
    name: nextName,
    ...(shouldSyncMapLabel
      ? {
          mapPlacement: {
            ...currentMapPlacement,
            label: nextName,
          },
        }
      : {}),
  };
}

function normalizeCityMapPlacement(
  value: unknown,
  legacyMapNodeId: unknown,
  fallbackLabel: unknown
): ScriptEditorCityRecord["mapPlacement"] | undefined {
  const rawValue =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  const x =
    rawValue != null && typeof rawValue.x === "number" && Number.isFinite(rawValue.x)
      ? rawValue.x
      : null;
  const y =
    rawValue != null && typeof rawValue.y === "number" && Number.isFinite(rawValue.y)
      ? rawValue.y
      : null;

  if (x == null || y == null) {
    return undefined;
  }

  const kind = normalizeOptionalString(rawValue?.kind);
  return {
    x,
    y,
    ...(normalizeOptionalString(rawValue?.mapId).length === 0
      ? {}
      : { mapId: normalizeOptionalString(rawValue?.mapId) }),
    ...(normalizeOptionalString(rawValue?.mapNodeId ?? legacyMapNodeId).length === 0
      ? {}
      : { mapNodeId: normalizeOptionalString(rawValue?.mapNodeId ?? legacyMapNodeId) }),
    ...(kind === "city" || kind === "settlement" || kind === "fort" ? { kind } : {}),
    ...(normalizeOptionalString(rawValue?.label).length === 0
      ? { label: normalizeString(fallbackLabel, "") }
      : { label: normalizeOptionalString(rawValue?.label) }),
    ...(normalizeOptionalString(rawValue?.summary).length === 0
      ? {}
      : { summary: normalizeOptionalString(rawValue?.summary) }),
  };
}

function normalizeAccessRule(access?: ScriptEditorAccessRule): ScriptEditorAccessRule {
  const rawAccess = access as (ScriptEditorAccessRule & Record<string, unknown>) | undefined;
  const conditionExpression =
    normalizeLocationAccessConditionExpression(rawAccess?.conditionExpression) ??
    normalizeLegacyAccessCondition(rawAccess?.state);
  return {
    ...(conditionExpression == null ? {} : { conditionExpression }),
    ...pickOptionalString("blockedReason", rawAccess?.blockedReason),
    ...pickOptionalString("blockedTitle", rawAccess?.blockedTitle),
    ...pickOptionalString("blockedMessage", rawAccess?.blockedMessage),
    ...pickOptionalString(
      "blockedDialogueId",
      rawAccess?.blockedDialogueId ?? rawAccess?.blockedMessageTextEntryId
    ),
    ...pickOptionalString("blockedSpeakerId", rawAccess?.blockedSpeakerId ?? rawAccess?.blockedSpeaker),
    ...pickOptionalString("guidance", rawAccess?.guidance),
  };
}

function normalizeLegacyAccessCondition(
  value: unknown
): LocationAccessConditionExpression | undefined {
  return value === "visible-disabled" || value === "hidden"
    ? { type: "literal", value: false }
    : undefined;
}

function normalizeMenuEntries(
  entries: readonly ScriptEditorMenuEntry[] | undefined,
  idBase: string
): ScriptEditorMenuEntry[] {
  return (entries ?? []).map((entry, index) => ({
    id: normalizeString(entry.id, `${idBase}.${index + 1}`),
    label: normalizeString(entry.label, `Entry ${index + 1}`),
    menuFamily: normalizeString(entry.menuFamily, "management"),
    targetFamily: normalizeMenuTargetFamily(entry.targetFamily),
    targetId: normalizeOptionalString(entry.targetId),
    isVisible: entry.isVisible !== false,
    isEnabled: entry.isEnabled !== false,
    disabledHint: normalizeOptionalString(entry.disabledHint),
  }));
}

function normalizeBuildingEntryBinding(
  binding?: ScriptEditorBuildingEntryBinding
): ScriptEditorBuildingEntryBinding {
  return {
    defaultPersonId: normalizeOptionalString(binding?.defaultPersonId),
    returnTarget: normalizeString(binding?.returnTarget, "city"),
  };
}

function normalizeCityBaseAttributes(
  value: ScriptEditorCityRecord["baseAttributes"]
): NonNullable<ScriptEditorCityRecord["baseAttributes"]> {
  return {
    ...pickOptionalString("ownerFactionId", value?.ownerFactionId),
    ...(typeof value?.prosperity === "number" ? { prosperity: value.prosperity } : {}),
    ...(typeof value?.security === "number" ? { security: value.security } : {}),
    ...(typeof value?.population === "number" ? { population: value.population } : {}),
  };
}

function normalizeBuildingBaseAttributes(
  building: Partial<ScriptEditorBuildingRecord> & Record<string, unknown>
): NonNullable<ScriptEditorBuildingRecord["baseAttributes"]> {
  const base = (building.baseAttributes ?? {}) as Partial<
    NonNullable<ScriptEditorBuildingRecord["baseAttributes"]>
  >;
  return {
    houseType: normalizeHouseType(base.houseType ?? building.type),
    activityLocationId: normalizeActivityLocationId(
      base.activityLocationId ?? building.activityLocationId
    ),
    ...pickHouseModuleId(base.moduleId ?? building.moduleId),
    characterIds: normalizeStringArray(base.characterIds ?? building.characterIds),
    defaultCharacterId: normalizeNullableString(
      base.defaultCharacterId ?? building.defaultCharacterId
    ),
    ...(typeof base.level === "number" ? { level: base.level } : {}),
    ...(typeof base.damaged === "boolean" ? { damaged: base.damaged } : {}),
    ...(typeof base.outputMultiplier === "number"
      ? { outputMultiplier: base.outputMultiplier }
      : {}),
    visibleStoryStages: normalizeStringArray(
      base.visibleStoryStages ?? building.visibleStoryStages
    ),
    enterableStoryStages: normalizeStringArray(
      base.enterableStoryStages ?? building.enterableStoryStages
    ),
    requiresPlayerCurrentCityMatch:
      base.requiresPlayerCurrentCityMatch === true ||
      building.requiresPlayerCurrentCityMatch === true,
  };
}

function normalizeProfileMap<T extends { displayName?: string; description?: string; tags?: string[] }>(
  value: T | undefined,
  legacyDescription?: string
): T {
  return {
    ...pickOptionalString("displayName", value?.displayName),
    description:
      normalizeOptionalString(value?.description).length > 0
        ? normalizeOptionalString(value?.description)
        : normalizeOptionalString(legacyDescription),
    tags: normalizeStringArray(value?.tags),
  } as T;
}

function normalizeCustomAttributes(
  entries: readonly ScriptEditorCustomAttributeEntry[] | undefined
): ScriptEditorCustomAttributeEntry[] {
  return (entries ?? [])
    .map((entry) => ({
      key: normalizeOptionalString(entry.key),
      ...pickOptionalString("label", entry.label),
      value: normalizeCustomAttributeValue(entry.value),
    }))
    .filter((entry) => entry.key.length > 0);
}

function normalizeEditableCustomAttributes(
  entries: readonly ScriptEditorCustomAttributeEntry[] | undefined
): ScriptEditorCustomAttributeEntry[] {
  return (entries ?? []).map((entry) => ({
    key: normalizeOptionalString(entry.key),
    ...pickOptionalString("label", entry.label),
    value: normalizeCustomAttributeValue(entry.value),
  }));
}

function normalizeCustomAttributeValue(
  value: ScriptEditorCustomAttributeEntry["value"]
): ScriptEditorCustomAttributeEntry["value"] {
  if (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : null;
}

function normalizeLocationAccessConditionExpression(
  value: unknown
): LocationAccessConditionExpression | undefined {
  return normalizeScriptEditorLocationAccessConditionExpression(value);
}

function parseLocationAccessConditionExpression(
  value: string
): LocationAccessConditionExpression | undefined {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return undefined;
  }
  try {
    return normalizeLocationAccessConditionExpression(JSON.parse(trimmedValue));
  } catch {
    return undefined;
  }
}

function omitAccessField<K extends keyof ScriptEditorAccessRule>(
  access: ScriptEditorAccessRule,
  field: K
): Omit<ScriptEditorAccessRule, K> {
  const nextAccess = { ...access };
  delete nextAccess[field];
  return nextAccess;
}

function readBackAction(value: unknown): HouseDefinition["backAction"] | undefined {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (record.targetView === "city") {
      return {
        label: normalizeString(record.label, "返回"),
        targetView: "city",
      };
    }
  }
  return undefined;
}

function normalizeBackAction(value: unknown): HouseDefinition["backAction"] {
  return readBackAction(value) ?? createDefaultBackAction();
}

function normalizeHouseType(value: unknown): HouseDefinition["type"] {
  switch (value) {
    case "castle":
    case "merchant":
    case "inn":
    case "dojo":
    case "tea-house":
    case "temple":
    case "medicine-house":
    case "residence":
    case "custom":
      return value;
    default:
      return "custom";
  }
}

function normalizeActivityLocationId(
  value: unknown
): HouseDefinition["activityLocationId"] {
  if (value === null) {
    return null;
  }
  switch (value) {
    case "tea-house":
    case "tavern":
    case "market":
    case "street":
    case "custom":
      return value as NonNullable<HouseDefinition["activityLocationId"]>;
    default:
      return "custom";
  }
}

function normalizeHouseModuleId(value: unknown): HouseDefinition["moduleId"] {
  switch (value) {
    case "home-house":
    case "keep-house":
    case "leader-residence":
    case "grain-shop":
    case "market-house":
    case "tea-house":
    case "tavern":
    case "temple-house":
    case "medicine-house":
      return value;
    default:
      return null;
  }
}

function pickHouseModuleId(value: unknown): Pick<
  NonNullable<ScriptEditorBuildingRecord["baseAttributes"]>,
  "moduleId"
> {
  const moduleId = normalizeHouseModuleId(value);
  return moduleId == null ? {} : { moduleId };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => normalizeOptionalString(entry).trim())
    .filter((entry) => entry.length > 0);
}

function normalizeNullableString(value: unknown): string | null {
  const normalized = normalizeOptionalString(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeMenuTargetFamily(value?: string): ScriptEditorMenuTargetFamily {
  return ["dialogue", "event", "trade", "minigame", "info"].includes(value ?? "")
    ? (value as ScriptEditorMenuTargetFamily)
    : "info";
}

function normalizeBuildingContainerType(value: string): ScriptEditorBuildingContainerType {
  return SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES.includes(
    value as ScriptEditorBuildingContainerType
  )
    ? (value as ScriptEditorBuildingContainerType)
    : "character-seats";
}

function normalizeString(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickOptionalString<TKey extends string>(
  key: TKey,
  value: unknown
): Partial<Record<TKey, string>> {
  const normalized = normalizeOptionalString(value);
  return normalized.length === 0 ? {} : { [key]: normalized } as Partial<Record<TKey, string>>;
}

function slugifyMenuFamily(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || "menu"
  );
}
