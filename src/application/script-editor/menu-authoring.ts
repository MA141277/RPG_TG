import type {
  MenuEntryDefinition,
  MenuInstanceDefinition,
  MenuResourceDefinition,
  MenuTargetFamily,
} from "../../domain/menu";
import type {
  ScriptEditorBuildingArrangementRecord,
  ScriptEditorBuildingRecord,
  ScriptEditorBuildingContainerActionItem,
  ScriptEditorCityRecord,
  ScriptEditorProjectDefinition,
} from "../../domain/script-editor-project";

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

const DEFAULT_CITY_MENU_FAMILIES = ["overview", "intel", "locations", "management"];
const DEFAULT_BUILDING_MENU_FAMILIES = ["dialogue", "trade", "work", "rest"];

export function formalizeScriptEditorProjectMenus(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  const locationFormalizedProject = formalizeLocationProjectMenus(project);
  return formalizeBuildingArrangementProjectMenus(locationFormalizedProject);
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
  const buildingArrangements = project.buildingArrangements ?? [];
  const menuResources = [...(project.menuResources ?? [])];
  const menuInstances = [...(project.menuInstances ?? [])];
  let resourcesChanged = false;
  let instancesChanged = false;
  let buildingsChanged = false;
  let arrangementsChanged = false;

  const arrangementEntriesByBuildingId = new Map<string, MenuEntryDefinition[]>();
  const nextArrangements = buildingArrangements.map((arrangement) => {
    const actionMenuEntries = extractArrangementActionMenuEntries(arrangement);
    if (actionMenuEntries.length > 0) {
      const existingEntries = arrangementEntriesByBuildingId.get(arrangement.buildingId);
      if (existingEntries == null) {
        arrangementEntriesByBuildingId.set(arrangement.buildingId, actionMenuEntries);
      }
    }
    const nextArrangement = stripArrangementActionMenuItems(arrangement);
    arrangementsChanged ||= nextArrangement !== arrangement;
    return nextArrangement;
  });

  const nextBuildings = project.buildings.map((building) => {
    const normalizedMenuInstanceIds = readTrimmedStringArray(building.menuInstanceIds);
    const actionMenuEntries = arrangementEntriesByBuildingId.get(building.id) ?? [];
    if (actionMenuEntries.length > 0) {
      const existingInstanceId =
        normalizedMenuInstanceIds[0] ?? createGeneratedMenuInstanceId(building.id);
      const existingInstance = menuInstances.find(
        (instance) => instance.id === existingInstanceId
      );
      const resourceId =
        existingInstance?.resourceId ?? createGeneratedMenuResourceId(building.id);
      const title =
        existingInstance?.title ?? createGeneratedMenuTitle(building, "buildings");
      resourcesChanged ||= upsertMenuResource(menuResources, {
        id: resourceId,
        title,
        entries: actionMenuEntries,
      });
      instancesChanged ||= upsertMenuInstance(menuInstances, {
        id: existingInstanceId,
        title,
        resourceId,
      });
      buildingsChanged = true;
      return stripLegacyLocationMenuEntries({
        ...building,
        menuInstanceIds:
          normalizedMenuInstanceIds.length > 0
            ? normalizedMenuInstanceIds
            : [existingInstanceId],
      } satisfies ScriptEditorBuildingRecord);
    }

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

  if (!resourcesChanged && !instancesChanged && !buildingsChanged && !arrangementsChanged) {
    return project;
  }

  return {
    ...project,
    ...(buildingsChanged ? { buildings: nextBuildings } : {}),
    ...(arrangementsChanged ? { buildingArrangements: nextArrangements } : {}),
    ...(resourcesChanged ? { menuResources } : {}),
    ...(instancesChanged ? { menuInstances } : {}),
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
    return [
      {
        instanceId: instance.id,
        instanceTitle: normalizeString(instance.title, instance.id),
        resourceId: resource.id,
        resourceTitle: normalizeString(resource.title, resource.id),
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
  return {
    ...formalizedProject,
    menuResources: (formalizedProject.menuResources ?? []).map((resource) => {
      if (resource.id !== resourceId) {
        return resource;
      }
      const nextIndex = normalizeMenuEntries(resource.entries, `${resource.id}.entry`).length + 1;
      return {
        ...resource,
        entries: [
          ...normalizeMenuEntries(resource.entries, `${resource.id}.entry`),
          createDefaultMenuEntry(`${resource.id}.entry`, `entry-${nextIndex}`),
        ],
      };
    }),
  };
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
                return {
                  ...entry,
                  [field]:
                    field === "id" || field === "label" || field === "menuFamily"
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

function extractArrangementActionMenuEntries(
  arrangement: ScriptEditorBuildingArrangementRecord
): MenuEntryDefinition[] {
  const actionMenuContainer = arrangement.containers.find(
    (container) => container.type === "action-menu"
  );
  if (actionMenuContainer == null) {
    return [];
  }
  return (actionMenuContainer.items ?? []).flatMap((item) => {
    const eventId = normalizeOptionalString(item.eventId);
    if (eventId.length === 0) {
      return [];
    }
    return [toMenuEntryDefinition(item)];
  });
}

function toMenuEntryDefinition(
  item: ScriptEditorBuildingContainerActionItem
): MenuEntryDefinition {
  return {
    id: normalizeString(item.id, `menu-entry.${slugifyMenuFamily(item.label)}`),
    label: normalizeString(item.label, item.id),
    menuFamily: normalizeString(item.id, slugifyMenuFamily(item.label)),
    targetFamily: "event",
    targetId: normalizeOptionalString(item.eventId),
    isVisible: item.isVisible !== false,
    isEnabled: item.isEnabled !== false,
    disabledHint: normalizeOptionalString(item.disabledHint),
  };
}

function stripArrangementActionMenuItems(
  arrangement: ScriptEditorBuildingArrangementRecord
): ScriptEditorBuildingArrangementRecord {
  let changed = false;
  const nextContainers = arrangement.containers.map((container) => {
    if (container.type !== "action-menu" || container.items == null) {
      return container;
    }
    changed = true;
    const nextContainer = { ...container };
    delete nextContainer.items;
    return nextContainer;
  });
  return changed ? { ...arrangement, containers: nextContainers } : arrangement;
}

function resolveMenuBundleIds(
  project: ScriptEditorProjectDefinition,
  instanceId: string
): {
  project: ScriptEditorProjectDefinition;
  resourceId: string;
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
  };
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
  const fallbackLabel = family === "cities" ? "City Menu" : "Building Menu";
  return `${normalizeString((location as { name?: string }).name, location.id)} ${fallbackLabel}`;
}

function normalizeMenuEntries(
  entries: readonly MenuEntryDefinition[] | undefined,
  idBase: string
): MenuEntryDefinition[] {
  return (entries ?? []).map((entry, index) => ({
    id: normalizeString(entry.id, `${idBase}.${index + 1}`),
    label: normalizeString(entry.label, `Entry ${index + 1}`),
    menuFamily: normalizeString(
      entry.menuFamily,
      DEFAULT_BUILDING_MENU_FAMILIES[index] ??
        DEFAULT_CITY_MENU_FAMILIES[index] ??
        "management"
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
    label: menuFamily,
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
