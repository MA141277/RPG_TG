import type {
  MenuEntryDefinition,
  MenuInstanceDefinition,
  MenuResourceDefinition,
  MenuTargetFamily,
} from "../../../domain/menu";
import type {
  ScriptEditorBuildingArrangementRecord,
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorEventDestination,
  ScriptEditorEventRecord,
  ScriptEditorMinigameRecord,
  ScriptEditorProjectDefinition,
} from "../domain/script-editor-project";
import { createBuiltinScriptEditorPlayableCatalog } from "../host/script-editor-playable-catalog";
import { allocateNextScriptEditorCanonicalId } from "./script-editor-id-allocation";

type ScriptEditorLocationFamily = "cities" | "buildings";

type ScriptEditorLocationRecord = ScriptEditorCityRecord | ScriptEditorBuildingRecord;

export type ScriptEditorLocationMenuBundle = {
  instanceId: string;
  instanceTitle: string;
  resourceId: string;
  resourceTitle: string;
  entries: MenuEntryDefinition[];
};

type ScriptEditorMenuEntryEditableField =
  | "id"
  | "label"
  | "menuFamily"
  | "targetFamily"
  | "targetId"
  | "disabledHint";

const builtinScriptEditorPlayableCatalog =
  createBuiltinScriptEditorPlayableCatalog();

const DEFAULT_CITY_MENU_FAMILIES = ["overview", "intel", "locations", "management"];
const DEFAULT_BUILDING_MENU_FAMILIES = ["dialogue", "trade", "work", "rest"];
const MENU_FAMILY_LABELS: Record<string, string> = {
  overview: "概况",
  culture: "概况",
  intel: "情报",
  locations: "地点",
  management: "管理",
  dialogue: "对话",
  trade: "交易",
  work: "工作",
  rest: "休息",
  minigame: "玩法",
  leave: "离开",
  begging: "化缘",
  other: "其他",
};

export function formalizeScriptEditorProjectMenus(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  const legacyActionMenuItemsError = findLegacyArrangementActionMenuItemsError(
    project.buildingArrangements ?? []
  );
  if (legacyActionMenuItemsError != null) {
    throw new Error(legacyActionMenuItemsError);
  }
  const locationFormalizedProject = formalizeLocationProjectMenus(project);
  const arrangementFormalizedProject =
    formalizeBuildingArrangementProjectMenus(locationFormalizedProject);
  return formalizeMenuEntriesThroughEvents(arrangementFormalizedProject);
}

function formalizeLocationProjectMenus(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  const menuResources = [...(project.menuResources ?? [])];
  const menuInstances = [...(project.menuInstances ?? [])];
  let resourcesChanged = false;
  let instancesChanged = false;
  let citiesChanged = false;
  let buildingsChanged = false;

  const nextCities = project.cities.map((city) => {
    const result = formalizeLocationMenuBindings(
      city,
      "cities",
      menuResources,
      menuInstances
    );
    resourcesChanged ||= result.resourcesChanged;
    instancesChanged ||= result.instancesChanged;
    citiesChanged ||= result.locationChanged;
      return result.location;
  });

  const nextBuildings = project.buildings.map((building) => {
    const result = formalizeLocationMenuBindings(
      building,
      "buildings",
      menuResources,
      menuInstances
    );
    resourcesChanged ||= result.resourcesChanged;
    instancesChanged ||= result.instancesChanged;
    buildingsChanged ||= result.locationChanged;
    return result.location;
  });

  if (!resourcesChanged && !instancesChanged && !citiesChanged && !buildingsChanged) {
    return project;
  }

  return {
    ...project,
    ...(citiesChanged ? { cities: nextCities } : {}),
    ...(buildingsChanged ? { buildings: nextBuildings } : {}),
    ...(resourcesChanged ? { menuResources } : {}),
    ...(instancesChanged ? { menuInstances } : {}),
  };
}

function formalizeBuildingArrangementProjectMenus(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  let buildingsChanged = false;

  const nextBuildings = project.buildings.map((building) => {
    const normalizedMenuInstanceIds = readTrimmedStringArray(building.menuInstanceIds);
    if (normalizedMenuInstanceIds.length > 0) {
      const nextBuilding = stripLegacyLocationMenuEntries({
        ...building,
        menuInstanceIds: normalizedMenuInstanceIds,
      } satisfies ScriptEditorBuildingRecord);
      buildingsChanged ||= nextBuilding !== building;
      return nextBuilding;
    }

    return building;
  });

  if (!buildingsChanged) {
    return project;
  }

  return {
    ...project,
    ...(buildingsChanged ? { buildings: nextBuildings } : {}),
  };
}

export function listScriptEditorLocationMenuBundles(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorLocationFamily,
  locationId: string
): ScriptEditorLocationMenuBundle[] {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const location = getProjectLocation(formalizedProject, family, locationId);
  if (location == null) {
    return [];
  }

  const menuResourceById = Object.fromEntries(
    (formalizedProject.menuResources ?? []).map((resource) => [resource.id, resource] as const)
  );
  const menuInstanceById = Object.fromEntries(
    (formalizedProject.menuInstances ?? []).map((instance) => [instance.id, instance] as const)
  );

  return readTrimmedStringArray(location.menuInstanceIds).flatMap((instanceId) => {
    const instance = menuInstanceById[instanceId];
    if (instance == null) {
      return [];
    }
    const resource = menuResourceById[normalizeOptionalString(instance.resourceId)];
    if (resource == null) {
      return [];
    }
    const fallbackTitle = createGeneratedMenuTitle(location, family);
    return [
      {
        instanceId: instance.id,
        instanceTitle: normalizeString(instance.title, fallbackTitle),
        resourceId: resource.id,
        resourceTitle: normalizeString(resource.title, fallbackTitle),
        entries: normalizeMenuEntries(resource.entries, `${resource.id}.entry`),
      },
    ];
  });
}

export function countScriptEditorLocationMenuEntries(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorLocationFamily,
  locationId: string
): number {
  return listScriptEditorLocationMenuBundles(project, family, locationId).reduce(
    (count, bundle) => count + bundle.entries.length,
    0
  );
}

export function updateScriptEditorLocationMenuInstanceTitle(
  project: ScriptEditorProjectDefinition,
  instanceId: string,
  value: string
): ScriptEditorProjectDefinition {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  return {
    ...formalizedProject,
    menuInstances: (formalizedProject.menuInstances ?? []).map((instance) =>
      instance.id === instanceId
        ? {
            ...instance,
            title: normalizeString(value, instance.id),
          }
        : instance
    ),
  };
}

export function updateScriptEditorLocationMenuResourceTitle(
  project: ScriptEditorProjectDefinition,
  resourceId: string,
  value: string
): ScriptEditorProjectDefinition {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  return {
    ...formalizedProject,
    menuResources: (formalizedProject.menuResources ?? []).map((resource) =>
      resource.id === resourceId
        ? {
            ...resource,
            title: normalizeString(value, resource.id),
          }
        : resource
    ),
  };
}

export function appendScriptEditorLocationMenuEntry(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorLocationFamily,
  locationId: string
): ScriptEditorProjectDefinition {
  const prepared = ensurePrimaryLocationMenuBundle(project, family, locationId);
  if (prepared == null) {
    return formalizeScriptEditorProjectMenus(project);
  }
  const { project: formalizedProject, resourceId } = prepared;
  return formalizeScriptEditorProjectMenus({
    ...formalizedProject,
    menuResources: (formalizedProject.menuResources ?? []).map((resource) => {
      if (resource.id !== resourceId) {
        return resource;
      }
      const nextIndex = normalizeMenuEntries(resource.entries, `${resource.id}.entry`).length + 1;
      const nextMenuFamily = suggestLocationMenuFamily(family, nextIndex - 1);
      return {
        ...resource,
        entries: [
          ...normalizeMenuEntries(resource.entries, `${resource.id}.entry`),
          createDefaultMenuEntry(`${resource.id}.entry`, nextMenuFamily),
        ],
      };
    }),
  });
}

export function removeScriptEditorLocationMenuEntry(
  project: ScriptEditorProjectDefinition,
  instanceId: string,
  index: number
): ScriptEditorProjectDefinition {
  const resolved = resolveMenuBundleIds(project, instanceId);
  if (resolved == null) {
    return formalizeScriptEditorProjectMenus(project);
  }

  return {
    ...resolved.project,
    menuResources: (resolved.project.menuResources ?? []).map((resource) =>
      resource.id === resolved.resourceId
        ? {
            ...resource,
            entries: normalizeMenuEntries(resource.entries, `${resource.id}.entry`).filter(
              (_, entryIndex) => entryIndex !== index
            ),
          }
        : resource
    ),
  };
}

export function updateScriptEditorLocationMenuEntryField(
  project: ScriptEditorProjectDefinition,
  instanceId: string,
  index: number,
  field: ScriptEditorMenuEntryEditableField,
  value: string
): ScriptEditorProjectDefinition {
  const resolved = resolveMenuBundleIds(project, instanceId);
  if (resolved == null) {
    return formalizeScriptEditorProjectMenus(project);
  }

  return {
    ...resolved.project,
    menuResources: (resolved.project.menuResources ?? []).map((resource) =>
      resource.id === resolved.resourceId
        ? {
            ...resource,
            entries: normalizeMenuEntries(resource.entries, `${resource.id}.entry`).map(
              (entry, entryIndex) => {
                if (entryIndex !== index) {
                  return entry;
                }
                if (field === "targetFamily") {
                  return {
                    ...entry,
                    targetFamily: normalizeMenuTargetFamily(value),
                  };
                }
                if (field === "menuFamily") {
                  return syncCityPanelTargetForMenuFamily(
                    {
                      ...entry,
                      menuFamily: normalizeString(value, entry.menuFamily),
                    },
                    resolved.locationFamily
                  );
                }
                return {
                  ...entry,
                  [field]:
                    field === "id" || field === "label"
                      ? normalizeString(value, entry[field])
                      : normalizeOptionalString(value),
                };
              }
            ),
          }
        : resource
    ),
  };
}

export function toggleScriptEditorLocationMenuEntryFlag(
  project: ScriptEditorProjectDefinition,
  instanceId: string,
  index: number,
  field: "isVisible" | "isEnabled",
  checked: boolean
): ScriptEditorProjectDefinition {
  const resolved = resolveMenuBundleIds(project, instanceId);
  if (resolved == null) {
    return formalizeScriptEditorProjectMenus(project);
  }

  return {
    ...resolved.project,
    menuResources: (resolved.project.menuResources ?? []).map((resource) =>
      resource.id === resolved.resourceId
        ? {
            ...resource,
            entries: normalizeMenuEntries(resource.entries, `${resource.id}.entry`).map(
              (entry, entryIndex) =>
                entryIndex === index ? { ...entry, [field]: checked } : entry
            ),
          }
        : resource
    ),
  };
}

function formalizeLocationMenuBindings<TLocation extends ScriptEditorLocationRecord>(
  location: TLocation,
  family: ScriptEditorLocationFamily,
  menuResources: MenuResourceDefinition[],
  menuInstances: MenuInstanceDefinition[]
): {
  location: TLocation;
  locationChanged: boolean;
  resourcesChanged: boolean;
  instancesChanged: boolean;
} {
  const normalizedMenuInstanceIds = readTrimmedStringArray(location.menuInstanceIds);
  const normalizedLegacyEntries = normalizeMenuEntries(
    location.menuEntries,
    `${location.id}.menu`
  );
  if (normalizedMenuInstanceIds.length > 0) {
    const nextLocation = stripLegacyLocationMenuEntries({
      ...location,
      menuInstanceIds: normalizedMenuInstanceIds,
    } satisfies TLocation);
    const locationChanged =
      nextLocation !== location ||
      !arraysEqual(normalizedMenuInstanceIds, location.menuInstanceIds ?? []);
    return {
      location: nextLocation,
      locationChanged,
      resourcesChanged: false,
      instancesChanged: false,
    };
  }
  const nextEntries =
    normalizedLegacyEntries.length > 0
      ? normalizedLegacyEntries
      : createDefaultLocationMenuEntries(location.id, family);

  const generatedResourceId = createGeneratedMenuResourceId(location.id);
  const generatedInstanceId = createGeneratedMenuInstanceId(location.id);
  const generatedTitle = createGeneratedMenuTitle(location, family);
  const nextResource = {
    id: generatedResourceId,
    title: generatedTitle,
    entries: nextEntries,
  } satisfies MenuResourceDefinition;
  const nextInstance = {
    id: generatedInstanceId,
    title: generatedTitle,
    resourceId: generatedResourceId,
  } satisfies MenuInstanceDefinition;

  const resourcesChanged = upsertMenuResource(menuResources, nextResource);
  const instancesChanged = upsertMenuInstance(menuInstances, nextInstance);

  return {
    location: stripLegacyLocationMenuEntries({
      ...location,
      menuInstanceIds: [generatedInstanceId],
    } satisfies TLocation),
    locationChanged: true,
    resourcesChanged,
    instancesChanged,
  };
}

function ensurePrimaryLocationMenuBundle(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorLocationFamily,
  locationId: string
): {
  project: ScriptEditorProjectDefinition;
  instanceId: string;
  resourceId: string;
} | null {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const location = getProjectLocation(formalizedProject, family, locationId);
  if (location == null) {
    return null;
  }

  const existingInstanceId = readTrimmedStringArray(location.menuInstanceIds)[0];
  if (existingInstanceId != null) {
    const existingInstance = (formalizedProject.menuInstances ?? []).find(
      (instance) => instance.id === existingInstanceId
    );
    if (existingInstance != null) {
      return {
        project: formalizedProject,
        instanceId: existingInstance.id,
        resourceId: normalizeOptionalString(existingInstance.resourceId),
      };
    }
  }

  const menuResources = [...(formalizedProject.menuResources ?? [])];
  const menuInstances = [...(formalizedProject.menuInstances ?? [])];
  const resourceId = createGeneratedMenuResourceId(location.id);
  const instanceId = createGeneratedMenuInstanceId(location.id);
  const title = createGeneratedMenuTitle(location, family);
  upsertMenuResource(menuResources, {
    id: resourceId,
    title,
    entries: [],
  });
  upsertMenuInstance(menuInstances, {
    id: instanceId,
    title,
    resourceId,
  });
  const nextProject = replaceProjectLocation(
    formalizedProject,
    family,
    stripLegacyLocationMenuEntries({
      ...location,
      menuInstanceIds: [instanceId],
    } satisfies ScriptEditorLocationRecord)
  );
  return {
    project: {
      ...nextProject,
      menuResources,
      menuInstances,
    },
    instanceId,
    resourceId,
  };
}

function stripLegacyLocationMenuEntries<TLocation extends ScriptEditorLocationRecord>(
  location: TLocation
): TLocation {
  if (!("menuEntries" in location) || location.menuEntries == null) {
    return location;
  }
  const nextLocation = { ...location } as TLocation & {
    menuEntries?: ScriptEditorLocationRecord["menuEntries"];
  };
  delete nextLocation.menuEntries;
  return nextLocation;
}

function findLegacyArrangementActionMenuItemsError(
  arrangements: readonly ScriptEditorBuildingArrangementRecord[]
): string | null {
  for (const [arrangementIndex, arrangement] of arrangements.entries()) {
    for (const [containerIndex, container] of arrangement.containers.entries()) {
      if (container.type === "action-menu" && container.items != null) {
        return `script editor project buildingArrangements[${arrangementIndex}].containers[${containerIndex}].items must move into menuResources/menuInstances.`;
      }
    }
  }
  return null;
}

function resolveMenuBundleIds(
  project: ScriptEditorProjectDefinition,
  instanceId: string
): {
  project: ScriptEditorProjectDefinition;
  resourceId: string;
  locationFamily: ScriptEditorLocationFamily | null;
} | null {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const instance = (formalizedProject.menuInstances ?? []).find(
    (menuInstance) => menuInstance.id === instanceId
  );
  if (instance == null) {
    return null;
  }
  return {
    project: formalizedProject,
    resourceId: normalizeOptionalString(instance.resourceId),
    locationFamily: resolveLocationFamilyForMenuInstance(formalizedProject, instanceId),
  };
}

function resolveLocationFamilyForMenuInstance(
  project: ScriptEditorProjectDefinition,
  instanceId: string
): ScriptEditorLocationFamily | null {
  if (
    project.cities.some((city) =>
      readTrimmedStringArray(city.menuInstanceIds).includes(instanceId)
    )
  ) {
    return "cities";
  }

  if (
    project.buildings.some((building) =>
      readTrimmedStringArray(building.menuInstanceIds).includes(instanceId)
    )
  ) {
    return "buildings";
  }

  return null;
}

function replaceProjectLocation(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorLocationFamily,
  nextLocation: ScriptEditorLocationRecord
): ScriptEditorProjectDefinition {
  if (family === "cities") {
    return {
      ...project,
      cities: project.cities.map((city) =>
        city.id === nextLocation.id ? (nextLocation as ScriptEditorCityRecord) : city
      ),
    };
  }
  return {
    ...project,
    buildings: project.buildings.map((building) =>
      building.id === nextLocation.id
        ? (nextLocation as ScriptEditorBuildingRecord)
        : building
    ),
  };
}

function getProjectLocation(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorLocationFamily,
  locationId: string
): ScriptEditorLocationRecord | null {
  return family === "cities"
    ? project.cities.find((city) => city.id === locationId) ?? null
    : project.buildings.find((building) => building.id === locationId) ?? null;
}

function upsertMenuResource(
  resources: MenuResourceDefinition[],
  nextResource: MenuResourceDefinition
): boolean {
  const nextEntries = normalizeMenuEntries(nextResource.entries, `${nextResource.id}.entry`);
  const normalizedResource = {
    ...nextResource,
    id: normalizeString(nextResource.id, "menu-resource.generated"),
    title: normalizeString(nextResource.title, nextResource.id),
    entries: nextEntries,
  } satisfies MenuResourceDefinition;
  const resourceIndex = resources.findIndex((resource) => resource.id === normalizedResource.id);
  if (resourceIndex < 0) {
    resources.push(normalizedResource);
    return true;
  }
  const currentResource = resources[resourceIndex];
  if (currentResource == null) {
    resources.push(normalizedResource);
    return true;
  }
  if (
    currentResource.title === normalizedResource.title &&
    JSON.stringify(currentResource.entries) === JSON.stringify(normalizedResource.entries)
  ) {
    return false;
  }
  resources[resourceIndex] = normalizedResource;
  return true;
}

function upsertMenuInstance(
  instances: MenuInstanceDefinition[],
  nextInstance: MenuInstanceDefinition
): boolean {
  const normalizedInstance = {
    id: normalizeString(nextInstance.id, "menu-instance.generated"),
    title: normalizeString(nextInstance.title, nextInstance.id),
    resourceId: normalizeString(nextInstance.resourceId, "menu-resource.generated"),
  } satisfies MenuInstanceDefinition;
  const instanceIndex = instances.findIndex((instance) => instance.id === normalizedInstance.id);
  if (instanceIndex < 0) {
    instances.push(normalizedInstance);
    return true;
  }
  const currentInstance = instances[instanceIndex];
  if (currentInstance == null) {
    instances.push(normalizedInstance);
    return true;
  }
  if (
    currentInstance.title === normalizedInstance.title &&
    currentInstance.resourceId === normalizedInstance.resourceId
  ) {
    return false;
  }
  instances[instanceIndex] = normalizedInstance;
  return true;
}

function createGeneratedMenuResourceId(locationId: string): string {
  return `menu-resource.${locationId}.primary`;
}

function createGeneratedMenuInstanceId(locationId: string): string {
  return `menu-instance.${locationId}.primary`;
}

function createGeneratedMenuTitle(
  location: ScriptEditorLocationRecord,
  family: ScriptEditorLocationFamily
): string {
  const fallbackLabel = family === "cities" ? "城市菜单" : "建筑菜单";
  return `${normalizeString((location as { name?: string }).name, location.id)} ${fallbackLabel}`;
}

function normalizeMenuEntries(
  entries: readonly MenuEntryDefinition[] | undefined,
  idBase: string
): MenuEntryDefinition[] {
  return (entries ?? []).map((entry, index) => ({
    id: normalizeString(entry.id, `${idBase}.${index + 1}`),
    label: normalizeString(
      entry.label,
      resolveMenuFamilyLabel(
        normalizeString(
          entry.menuFamily,
          suggestMenuFamilyByIndex(index)
        ),
        index
      )
    ),
    menuFamily: normalizeString(
      entry.menuFamily,
      suggestMenuFamilyByIndex(index)
    ),
    targetFamily: normalizeMenuTargetFamily(entry.targetFamily),
    targetId: normalizeOptionalString(entry.targetId),
    isVisible: entry.isVisible !== false,
    isEnabled: entry.isEnabled !== false,
    disabledHint: normalizeOptionalString(entry.disabledHint),
  }));
}

function createDefaultMenuEntry(idBase: string, menuFamily: string): MenuEntryDefinition {
  return {
    id: `${idBase}.${slugifyMenuFamily(menuFamily)}`,
    label: resolveMenuFamilyLabel(menuFamily),
    menuFamily,
    targetFamily: "info",
    targetId: "",
    isVisible: true,
    isEnabled: true,
    disabledHint: "",
  };
}

function createDefaultLocationMenuEntries(
  locationId: string,
  family: ScriptEditorLocationFamily
): MenuEntryDefinition[] {
  const defaultFamilies =
    family === "cities"
      ? DEFAULT_CITY_MENU_FAMILIES
      : DEFAULT_BUILDING_MENU_FAMILIES;
  return defaultFamilies.map((menuFamily) =>
    createDefaultMenuEntry(`${locationId}.menu`, menuFamily)
  );
}

function suggestLocationMenuFamily(
  family: ScriptEditorLocationFamily,
  index: number
): string {
  const defaults =
    family === "cities"
      ? DEFAULT_CITY_MENU_FAMILIES
      : DEFAULT_BUILDING_MENU_FAMILIES;
  const resolvedIndex = Math.max(0, Math.min(index, defaults.length - 1));
  return defaults[resolvedIndex] ?? defaults[0] ?? "management";
}

function suggestMenuFamilyByIndex(index: number): string {
  return (
    DEFAULT_BUILDING_MENU_FAMILIES[index] ??
    DEFAULT_CITY_MENU_FAMILIES[index] ??
    "management"
  );
}

function resolveMenuFamilyLabel(menuFamily: string, index?: number): string {
  const normalizedMenuFamily = normalizeOptionalString(menuFamily);
  return (
    MENU_FAMILY_LABELS[normalizedMenuFamily] ??
    (typeof index === "number" ? `菜单项 ${index + 1}` : "菜单项")
  );
}

function slugifyMenuFamily(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
  return normalized.length > 0 ? normalized : "entry";
}

function normalizeMenuTargetFamily(value?: string): MenuTargetFamily {
  return ["dialogue", "event", "trade", "minigame", "info"].includes(value ?? "")
    ? (value as MenuTargetFamily)
    : "info";
}

function formalizeMenuEntriesThroughEvents(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  const events = [...(project.events ?? [])];
  const minigames = [...(project.minigames ?? [])];
  const projectMinigameIds = new Set(
    minigames
      .map((minigame) => normalizeOptionalString(minigame.id))
      .filter((id) => id.length > 0)
  );
  let resourcesChanged = false;
  let eventsChanged = false;
  let minigamesChanged = false;

  const nextMenuResources = (project.menuResources ?? []).map((resource) => {
    const normalizedEntries = normalizeMenuEntries(
      resource.entries,
      `${resource.id}.entry`
    );
    let entriesChanged =
      JSON.stringify(normalizedEntries) !== JSON.stringify(resource.entries ?? []);
    const nextEntries = normalizedEntries.map((entry, index) => {
      const result = formalizeMenuEntryThroughEvent(
        events,
        minigames,
        entry,
        index,
        projectMinigameIds
      );
      eventsChanged ||= result.eventsChanged;
      minigamesChanged ||= result.minigamesChanged;
      entriesChanged ||= result.entry !== entry;
      return result.entry;
    });

    if (!entriesChanged) {
      return resource;
    }
    resourcesChanged = true;
    return {
      ...resource,
      entries: nextEntries,
    };
  });

  if (!resourcesChanged && !eventsChanged && !minigamesChanged) {
    return project;
  }

  return {
    ...project,
    ...(resourcesChanged ? { menuResources: nextMenuResources } : {}),
    ...(eventsChanged ? { events } : {}),
    ...(minigamesChanged ? { minigames } : {}),
  };
}

function formalizeMenuEntryThroughEvent(
  events: ScriptEditorEventRecord[],
  minigames: ScriptEditorMinigameRecord[],
  entry: MenuEntryDefinition,
  index: number,
  projectMinigameIds: Set<string>
): {
  entry: MenuEntryDefinition;
  eventsChanged: boolean;
  minigamesChanged: boolean;
} {
  const directTargetEvent = events.find(
    (eventRecord) => entry.targetFamily === "event" && eventRecord.id === entry.targetId
  );
  if (directTargetEvent != null) {
    return {
      entry: {
        ...entry,
        targetFamily: "event",
        targetId: directTargetEvent.id,
      },
      eventsChanged: false,
      minigamesChanged: false,
    };
  }

  const existingTargetEvent = events.find(
    (eventRecord) =>
      entry.targetFamily === "event" &&
      eventRecord.id === entry.targetId &&
      eventRecord.type === "menu" &&
      eventRecord.destination?.family === "menu"
  );
  if (existingTargetEvent != null) {
    return {
      entry: {
        ...entry,
        targetFamily: "event",
        targetId: existingTargetEvent.id,
      },
      eventsChanged: false,
      minigamesChanged: false,
    };
  }

  const provisionalMenuEventId = allocateNextScriptEditorCanonicalId("events", events);
  const minigameResolution = resolveMenuEntryMinigamePrototypeDestination(
    entry,
    minigames,
    projectMinigameIds,
    provisionalMenuEventId
  );
  if (minigameResolution != null) {
    minigames.push(minigameResolution.minigame);
    projectMinigameIds.add(minigameResolution.minigame.id);
    events.push({
      id: provisionalMenuEventId,
      title: normalizeString(entry.label, resolveMenuFamilyLabel(entry.menuFamily, index)),
      type: "menu",
      destination: minigameResolution.destination,
    });
    return {
      entry: {
        ...entry,
        targetFamily: "event",
        targetId: provisionalMenuEventId,
      },
      eventsChanged: true,
      minigamesChanged: true,
    };
  }

  const destination = resolveMenuEventDestination(entry, index, projectMinigameIds);
  const existingMenuEvent = events.find(
    (eventRecord) =>
      eventRecord.type === "menu" &&
      eventRecord.destination?.family === destination.family &&
      eventRecord.destination.targetId === destination.targetId
  );
  const menuEventId = existingMenuEvent?.id ?? provisionalMenuEventId;

  if (existingMenuEvent == null) {
    events.push({
      id: menuEventId,
      title: normalizeString(entry.label, resolveMenuFamilyLabel(entry.menuFamily, index)),
      type: "menu",
      destination,
    });
  }

  const nextEntry = {
    ...entry,
    targetFamily: "event",
    targetId: menuEventId,
  } satisfies MenuEntryDefinition;

  return {
    entry: nextEntry,
    eventsChanged: existingMenuEvent == null,
    minigamesChanged: false,
  };
}

function resolveMenuEventDestination(
  entry: MenuEntryDefinition,
  index: number,
  projectMinigameIds: ReadonlySet<string>
): ScriptEditorEventDestination {
  const targetId = normalizeOptionalString(entry.targetId);
  if (entry.targetFamily === "dialogue" && targetId.length > 0) {
    return {
      family: "dialogue",
      targetId,
    };
  }
  if (
    entry.targetFamily === "minigame" &&
    targetId.length > 0 &&
    projectMinigameIds.has(targetId)
  ) {
    return {
      family: "minigame",
      targetId,
    };
  }
  if (entry.targetFamily === "info" && targetId.startsWith("city-panel.")) {
    return {
      family: "menu",
      targetId: normalizeString(targetId.slice("city-panel.".length), entry.menuFamily),
    };
  }
  return {
    family: "menu",
    targetId: normalizeString(entry.menuFamily, suggestMenuFamilyByIndex(index)),
  };
}

function resolveMenuEntryMinigamePrototypeDestination(
  entry: MenuEntryDefinition,
  minigames: readonly ScriptEditorMinigameRecord[],
  projectMinigameIds: ReadonlySet<string>,
  menuEventId: string
): { destination: ScriptEditorEventDestination; minigame: ScriptEditorMinigameRecord } | null {
  if (entry.targetFamily !== "minigame") {
    return null;
  }
  const playableId = normalizeOptionalString(entry.targetId);
  if (playableId.length === 0 || projectMinigameIds.has(playableId)) {
    return null;
  }
  const playableDefinition =
    builtinScriptEditorPlayableCatalog.getPlayableDefinition(playableId);
  if (playableDefinition == null) {
    return null;
  }

  const minigameId = allocateNextScriptEditorCanonicalId("minigames", minigames);
  const builtinIntegration =
    builtinScriptEditorPlayableCatalog
      .listPlayableIntegrations()
      .find((integration) => integration.playableId === playableId);
  const ownerKind =
    builtinIntegration?.ownerDefaults.ownerKind ??
    builtinIntegration?.trigger.ownerKind ??
    "external";
  const returnPolicy =
    (builtinIntegration?.ownerDefaults.returnPolicy ?? "close-only") as NonNullable<
      ScriptEditorMinigameRecord["returnPolicy"]
    >;

  return {
    destination: {
      family: "minigame",
      targetId: minigameId,
    },
    minigame: {
      id: minigameId,
      title: normalizeString(entry.label, playableId),
      description: "",
      playableId,
      integrationId: `playable.${playableId}.script-editor.${minigameId}`,
      ownerKind,
      ownerId:
        typeof builtinIntegration?.ownerDefaults.ownerId === "string"
          ? builtinIntegration.ownerDefaults.ownerId
          : "",
      returnPolicy,
      triggerId: `trigger.playable.${playableId}.script-editor.${minigameId}`,
      triggerSource: "event-destination",
      triggerEvent: menuEventId,
      launchPayload: [],
      outcomeRoutes: createDefaultMenuMinigameOutcomeRoutes(
        minigameId,
        returnPolicy
      ),
      notes: "由菜单中的玩法原型自动包装为玩法实例。",
    },
  };
}

function createDefaultMenuMinigameOutcomeRoutes(
  minigameId: string,
  handoffPolicy: NonNullable<ScriptEditorMinigameRecord["returnPolicy"]>
): NonNullable<ScriptEditorMinigameRecord["outcomeRoutes"]> {
  return (["success", "failure", "cancelled"] as const).map((outcome, index) => ({
    id: `${minigameId}${index + 1}`,
    outcome,
    handoffPolicy,
    summary: "",
    effectHint: "",
  }));
}

function syncCityPanelTargetForMenuFamily(
  entry: MenuEntryDefinition,
  locationFamily: ScriptEditorLocationFamily | null
): MenuEntryDefinition {
  if (locationFamily !== "cities" || entry.targetFamily === "event") {
    return entry;
  }

  const panelTargetId = resolveCityPanelTargetId(entry.menuFamily);
  if (panelTargetId == null) {
    return entry;
  }

  return {
    ...entry,
    targetFamily: "info",
    targetId: panelTargetId,
  };
}

function resolveCityPanelTargetId(menuFamily: string): string | null {
  switch (normalizeOptionalString(menuFamily).toLowerCase()) {
    case "overview":
    case "culture":
      return "city-panel.overview";
    case "intel":
      return "city-panel.intel";
    case "locations":
      return "city-panel.locations";
    case "management":
      return "city-panel.management";
    default:
      return null;
  }
}

function normalizeString(value: unknown, fallback: string): string {
  const normalized = normalizeOptionalString(value);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readTrimmedStringArray(values: readonly string[] | undefined): string[] {
  return (values ?? []).map((value) => normalizeOptionalString(value)).filter(Boolean);
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === normalizeOptionalString(right[index]));
}
