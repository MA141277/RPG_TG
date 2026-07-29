import type {
  MenuInstanceDefinition,
  MenuResourceDefinition,
} from "../../../domain/menu";
import type {
  ScriptEditorBuildingArrangementRecord,
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorMenuEntry,
  ScriptEditorMenuInstanceRecord,
  ScriptEditorMenuResourceRecord,
  ScriptEditorMountRecord,
  ScriptEditorPersonRecord,
  ScriptEditorProjectDefinition,
} from "../domain/script-editor-project";
import { allocateNextScriptEditorProjectCanonicalId } from "./script-editor-id-allocation";

type ScriptEditorLocationFamily = "cities" | "buildings";
export type ScriptEditorMenuOwnerFamily = "people" | "cities" | "buildings";

type ScriptEditorLocationRecord = ScriptEditorCityRecord | ScriptEditorBuildingRecord;
type ScriptEditorMenuOwnerRecord =
  | ScriptEditorPersonRecord
  | ScriptEditorCityRecord
  | ScriptEditorBuildingRecord;

export type ScriptEditorLocationMenuBundle = {
  instanceId: string;
  instanceTitle: string;
  resourceId: string;
  resourceTitle: string;
  entries: ScriptEditorMenuEntry[];
};

export type ScriptEditorMenuModuleRecord = {
  id: string;
  title: string;
  resourceId: string;
  entries: ScriptEditorMenuEntry[];
};

export type ScriptEditorMountedMenuRecord = {
  instanceId: string;
  title: string;
  order: number;
  visible: boolean;
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
  minigame: "小游戏",
  leave: "离开",
  begging: "化缘",
};

export function normalizeScriptEditorMounts(value: unknown): ScriptEditorMountRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry, index) => normalizeScriptEditorMountRecord(entry, index))
    .filter((entry) => entry != null)
    .sort((left, right) => left.order - right.order)
    .map((entry, index) => ({ ...entry, order: index }));
}

export function listScriptEditorMenuModuleRecords(
  project: ScriptEditorProjectDefinition
): ScriptEditorMenuModuleRecord[] {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const menuResourceById = Object.fromEntries(
    (formalizedProject.menuResources ?? []).map((resource) => [resource.id, resource] as const)
  );

  return (formalizedProject.menuInstances ?? []).map((instance) => {
    const resource = menuResourceById[normalizeOptionalString(instance.resourceId)];
    const entries = normalizeMenuEntries(resource?.entries, `${instance.id}.entry`);
    const title = normalizeString(
      entries[0]?.label,
      instance.title ?? resource?.title ?? "未命名菜单项"
    );
    return {
      id: instance.id,
      title,
      resourceId: resource?.id ?? normalizeOptionalString(instance.resourceId),
      entries,
    };
  });
}

export function appendScriptEditorMenuModuleRecord(
  project: ScriptEditorProjectDefinition
): { project: ScriptEditorProjectDefinition; instanceId: string } {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const resourceId = allocateNextScriptEditorProjectCanonicalId(
    formalizedProject,
    "menuResources"
  );
  const instanceId = allocateNextScriptEditorProjectCanonicalId(
    formalizedProject,
    "menuInstances"
  );
  const title = `菜单项 ${(formalizedProject.menuInstances?.length ?? 0) + 1}`;
  const entry = createDefaultMenuEntry(`${resourceId}.entry`, "management", title);
  return {
    project: {
      ...formalizedProject,
      menuResources: [
        ...(formalizedProject.menuResources ?? []),
        {
          id: resourceId,
          title,
          entries: [entry],
        } satisfies ScriptEditorMenuResourceRecord,
      ],
      menuInstances: [
        ...(formalizedProject.menuInstances ?? []),
        {
          id: instanceId,
          title,
          resourceId,
        } satisfies ScriptEditorMenuInstanceRecord,
      ],
    },
    instanceId,
  };
}

export function removeScriptEditorMenuModuleRecord(
  project: ScriptEditorProjectDefinition,
  instanceId: string
): ScriptEditorProjectDefinition {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const trimmedInstanceId = normalizeOptionalString(instanceId);
  if (trimmedInstanceId.length === 0) {
    return formalizedProject;
  }

  const instance = (formalizedProject.menuInstances ?? []).find(
    (entry) => entry.id === trimmedInstanceId
  );
  const resourceId = normalizeOptionalString(instance?.resourceId);
  const nextInstances = (formalizedProject.menuInstances ?? []).filter(
    (entry) => entry.id !== trimmedInstanceId
  );
  const resourceStillReferenced = nextInstances.some(
    (entry) => normalizeOptionalString(entry.resourceId) === resourceId
  );

  return syncMenuOwnerBindings({
    ...formalizedProject,
    menuInstances: nextInstances,
    menuResources:
      resourceId.length === 0 || resourceStillReferenced
        ? formalizedProject.menuResources
        : (formalizedProject.menuResources ?? []).filter(
            (entry) => entry.id !== resourceId
          ),
  });
}

export function listScriptEditorMountedMenus(
  project: ScriptEditorProjectDefinition,
  ownerFamily: ScriptEditorMenuOwnerFamily,
  ownerId: string
): ScriptEditorMountedMenuRecord[] {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const owner = getProjectMenuOwner(formalizedProject, ownerFamily, ownerId);
  if (owner == null) {
    return [];
  }
  const menuModuleById = Object.fromEntries(
    listScriptEditorMenuModuleRecords(formalizedProject).map((record) => [record.id, record] as const)
  );

  return normalizeScriptEditorMounts(owner.mounts)
    .filter((mount) => mount.kind === "menu")
    .map((mount) => {
      const menuRecord = menuModuleById[mount.target.menuInstanceId];
      return {
        instanceId: mount.target.menuInstanceId,
        title: normalizeString(mount.title, menuRecord?.title ?? "未命名菜单"),
        order: mount.order,
        visible: mount.visible !== false,
      };
    });
}

export function appendScriptEditorOwnerMenuMount(
  project: ScriptEditorProjectDefinition,
  ownerFamily: ScriptEditorMenuOwnerFamily,
  ownerId: string,
  menuInstanceId: string
): ScriptEditorProjectDefinition {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const owner = getProjectMenuOwner(formalizedProject, ownerFamily, ownerId);
  const trimmedMenuInstanceId = normalizeOptionalString(menuInstanceId);
  if (owner == null || trimmedMenuInstanceId.length === 0) {
    return formalizedProject;
  }

  const nextMounts = normalizeScriptEditorMounts(owner.mounts);
  if (
    nextMounts.some(
      (mount) => mount.kind === "menu" && mount.target.menuInstanceId === trimmedMenuInstanceId
    )
  ) {
    return formalizedProject;
  }

  return replaceProjectMenuOwner(
    formalizedProject,
    ownerFamily,
    {
      ...owner,
      mounts: [
        ...nextMounts,
        {
          kind: "menu",
          order: nextMounts.length,
          target: {
            kind: "menu",
            menuInstanceId: trimmedMenuInstanceId,
          },
        },
      ],
    } satisfies ScriptEditorMenuOwnerRecord
  );
}

export function removeScriptEditorOwnerMenuMount(
  project: ScriptEditorProjectDefinition,
  ownerFamily: ScriptEditorMenuOwnerFamily,
  ownerId: string,
  index: number
): ScriptEditorProjectDefinition {
  const formalizedProject = formalizeScriptEditorProjectMenus(project);
  const owner = getProjectMenuOwner(formalizedProject, ownerFamily, ownerId);
  if (owner == null) {
    return formalizedProject;
  }

  return replaceProjectMenuOwner(
    formalizedProject,
    ownerFamily,
    {
      ...owner,
      mounts: normalizeScriptEditorMounts(owner.mounts).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    } satisfies ScriptEditorMenuOwnerRecord
  );
}

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
  return syncMenuOwnerBindings(
    formalizeMenuModuleItemRecords(
      formalizeBuildingArrangementProjectMenus(locationFormalizedProject)
    )
  );
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
      syncLocationMenuMounts(city),
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
      syncLocationMenuMounts(building),
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
  const resolved = resolveMenuBundleIds(formalizedProject, instanceId);
  const nextTitle = normalizeString(value, "未命名菜单项");
  return {
    ...formalizedProject,
    menuInstances: (formalizedProject.menuInstances ?? []).map((instance) =>
      instance.id === instanceId
        ? {
            ...instance,
            title: nextTitle,
          }
        : instance
    ),
    ...(resolved == null
      ? {}
      : {
          menuResources: (formalizedProject.menuResources ?? []).map((resource) =>
            resource.id === resolved.resourceId
              ? {
                  ...resource,
                  title: nextTitle,
                  entries: normalizeMenuEntries(resource.entries, `${resource.id}.entry`).map(
                    (entry, entryIndex) =>
                      entryIndex === 0
                        ? {
                            ...entry,
                            label: nextTitle,
                          }
                        : entry
                  ),
                }
              : resource
          ),
        }),
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
      const nextMenuFamily = suggestLocationMenuFamily(family, nextIndex - 1);
      return {
        ...resource,
        entries: [
          ...normalizeMenuEntries(resource.entries, `${resource.id}.entry`),
          createDefaultMenuEntry(`${resource.id}.entry`, nextMenuFamily),
        ],
      };
    }),
  };
}

export function appendScriptEditorMenuModuleEntry(
  project: ScriptEditorProjectDefinition,
  instanceId: string
): ScriptEditorProjectDefinition {
  return formalizeScriptEditorProjectMenus(project);
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
  const currentResource = (resolved.project.menuResources ?? []).find(
    (resource) => resource.id === resolved.resourceId
  );
  if (normalizeMenuEntries(currentResource?.entries, `${resolved.resourceId}.entry`).length <= 1) {
    return resolved.project;
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
                    ...normalizeMenuEntryRouteTarget(entry, value, ""),
                  };
                }
                if (field === "targetId") {
                  return {
                    ...entry,
                    ...normalizeMenuEntryRouteTarget(entry, undefined, value),
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

function formalizeMenuModuleItemRecords(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  const resourceById = Object.fromEntries(
    (project.menuResources ?? []).map((resource) => [normalizeOptionalString(resource.id), resource] as const)
  );
  const usedResourceIds = new Set<string>();
  const usedInstanceIds = new Set<string>();
  const nextResources: ScriptEditorMenuResourceRecord[] = [];
  const nextInstances: ScriptEditorMenuInstanceRecord[] = [];
  const replacementInstanceIds = new Map<string, string[]>();

  (project.menuInstances ?? []).forEach((instance, instanceIndex) => {
    const instanceId = normalizeString(
      instance.id,
      `menu-instance.generated.${instanceIndex + 1}`
    );
    const resource = resourceById[normalizeOptionalString(instance.resourceId)];
    const resourceIdBase = normalizeString(
      resource?.id,
      `menu-resource.generated.${instanceIndex + 1}`
    );
    const baseTitle = normalizeString(
      instance.title,
      resource?.title ?? `菜单项 ${instanceIndex + 1}`
    );
    const normalizedEntries = normalizeMenuEntries(
      resource?.entries,
      `${resourceIdBase}.entry`
    );
    const effectiveEntries =
      normalizedEntries.length > 0
        ? normalizedEntries
        : [createDefaultMenuEntry(`${resourceIdBase}.entry`, "management", baseTitle)];
    const nextIds: string[] = [];

    effectiveEntries.forEach((entry, entryIndex) => {
      const itemTitle = normalizeString(
        entry.label,
        effectiveEntries.length === 1 ? baseTitle : `${baseTitle} ${entryIndex + 1}`
      );
      const nextInstanceId = claimUniqueId(
        entryIndex === 0 ? instanceId : `${instanceId}.item.${entryIndex + 1}`,
        usedInstanceIds,
        "menu-instance.generated"
      );
      const nextResourceId = claimUniqueId(
        entryIndex === 0 ? resourceIdBase : `${resourceIdBase}.item.${entryIndex + 1}`,
        usedResourceIds,
        "menu-resource.generated"
      );
      nextResources.push({
        id: nextResourceId,
        title: itemTitle,
        entries: [
          {
            ...entry,
            label: itemTitle,
          },
        ],
      });
      nextInstances.push({
        id: nextInstanceId,
        title: itemTitle,
        resourceId: nextResourceId,
      });
      nextIds.push(nextInstanceId);
    });

    replacementInstanceIds.set(instanceId, nextIds);
  });

  const nextResourcesWithTargets = nextResources.map((resource) => ({
    ...resource,
    entries: resource.entries.map((entry) => {
      if (entry.authoringTarget?.kind !== "menu") {
        return entry;
      }
      const nextTargetId = resolveReplacementMenuInstanceId(
        replacementInstanceIds,
        entry.authoringTarget.menuInstanceId
      );
      return nextTargetId === entry.authoringTarget.menuInstanceId
        ? entry
        : {
            ...entry,
            ...normalizeMenuEntryRouteTarget(entry, "menu", nextTargetId),
          };
    }),
  }));

  const nextPeople = project.people.map((person) =>
    replaceMenuOwnerReferences(person, replacementInstanceIds)
  );
  const nextCities = project.cities.map((city) =>
    replaceMenuOwnerReferences(city, replacementInstanceIds)
  );
  const nextBuildings = project.buildings.map((building) =>
    replaceMenuOwnerReferences(building, replacementInstanceIds)
  );

  if (
    JSON.stringify(nextResourcesWithTargets) === JSON.stringify(project.menuResources ?? []) &&
    JSON.stringify(nextInstances) === JSON.stringify(project.menuInstances ?? []) &&
    JSON.stringify(nextPeople) === JSON.stringify(project.people) &&
    JSON.stringify(nextCities) === JSON.stringify(project.cities) &&
    JSON.stringify(nextBuildings) === JSON.stringify(project.buildings)
  ) {
    return project;
  }

  return {
    ...project,
    menuResources: nextResourcesWithTargets,
    menuInstances: nextInstances,
    people: nextPeople,
    cities: nextCities,
    buildings: nextBuildings,
  };
}

function claimUniqueId(
  preferredId: string,
  usedIds: Set<string>,
  fallbackBase: string
): string {
  const baseId = normalizeString(preferredId, fallbackBase);
  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return baseId;
  }

  let suffix = 2;
  while (usedIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }
  const nextId = `${baseId}-${suffix}`;
  usedIds.add(nextId);
  return nextId;
}

function resolveReplacementMenuInstanceId(
  replacementInstanceIds: ReadonlyMap<string, string[]>,
  instanceId: string
): string {
  const normalizedInstanceId = normalizeOptionalString(instanceId);
  if (normalizedInstanceId.length === 0) {
    return "";
  }
  return replacementInstanceIds.get(normalizedInstanceId)?.[0] ?? normalizedInstanceId;
}

function replaceMenuOwnerReferences<TOwner extends ScriptEditorMenuOwnerRecord>(
  owner: TOwner,
  replacementInstanceIds: ReadonlyMap<string, string[]>
): TOwner {
  const nextMounts = normalizeScriptEditorMounts(owner.mounts).flatMap((mount) => {
    if (mount.kind !== "menu") {
      return [mount];
    }
    const nextIds = replacementInstanceIds.get(mount.target.menuInstanceId) ?? [
      mount.target.menuInstanceId,
    ];
    return nextIds.map((menuInstanceId) => ({
      ...mount,
      target: {
        kind: "menu" as const,
        menuInstanceId,
      },
    }));
  });

  const hasMenuInstanceIds = "menuInstanceIds" in owner;
  const nextMenuInstanceIds = hasMenuInstanceIds
    ? readTrimmedStringArray(
        ((owner as ScriptEditorLocationRecord).menuInstanceIds ?? []).flatMap(
          (menuInstanceId) => replacementInstanceIds.get(menuInstanceId) ?? [menuInstanceId]
        )
      )
    : undefined;

  return {
    ...owner,
    mounts: nextMounts,
    ...(hasMenuInstanceIds ? { menuInstanceIds: nextMenuInstanceIds } : {}),
  } as TOwner;
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
  entries: readonly ScriptEditorMenuEntry[] | undefined,
  idBase: string
): ScriptEditorMenuEntry[] {
  return (entries ?? []).map((entry, index) => ({
    ...entry,
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
    ...normalizeMenuEntryRouteTarget(entry),
    isVisible: entry.isVisible !== false,
    isEnabled: entry.isEnabled !== false,
    disabledHint: normalizeOptionalString(entry.disabledHint),
  }));
}

function createDefaultMenuEntry(
  idBase: string,
  menuFamily: string,
  labelOverride?: string
): ScriptEditorMenuEntry {
  return {
    id: `${idBase}.${slugifyMenuFamily(menuFamily)}`,
    label: normalizeString(labelOverride, resolveMenuFamilyLabel(menuFamily)),
    menuFamily,
    targetFamily: "event",
    targetId: "",
    authoringTarget: {
      kind: "event",
      eventId: "",
    },
    isVisible: true,
    isEnabled: true,
    disabledHint: "",
  };
}

function createDefaultLocationMenuEntries(
  locationId: string,
  family: ScriptEditorLocationFamily
): ScriptEditorMenuEntry[] {
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

function normalizeMenuEntryRouteTarget(
  entry: Partial<ScriptEditorMenuEntry>,
  nextKind?: string,
  nextTargetId?: string
): Pick<ScriptEditorMenuEntry, "authoringTarget" | "targetFamily" | "targetId"> {
  const explicitTargetId =
    nextTargetId === undefined ? undefined : normalizeOptionalString(nextTargetId);
  const authoringTarget = entry.authoringTarget;
  const rawTargetFamily = normalizeOptionalString(entry.targetFamily);
  const rawTargetId = normalizeOptionalString(entry.targetId);
  if (nextKind === undefined) {
    if (authoringTarget?.kind === "menu") {
      const menuInstanceId =
        explicitTargetId ?? normalizeOptionalString(authoringTarget.menuInstanceId);
      return {
        authoringTarget: {
          kind: "menu",
          menuInstanceId,
        },
        targetFamily: "info",
        targetId: menuInstanceId,
      };
    }

    if (authoringTarget?.kind === "event" || rawTargetFamily === "event") {
      const eventId =
        explicitTargetId ??
        (authoringTarget?.kind === "event"
          ? normalizeOptionalString(authoringTarget.eventId)
          : rawTargetId);
      return {
        authoringTarget: {
          kind: "event",
          eventId,
        },
        targetFamily: "event",
        targetId: eventId,
      };
    }

    return {
      authoringTarget: undefined,
      targetFamily: rawTargetFamily || "event",
      targetId: explicitTargetId ?? rawTargetId,
    };
  }

  const currentKind =
    nextKind ??
    (authoringTarget?.kind === "menu"
      ? "menuInstance"
      : authoringTarget?.kind === "event"
        ? "event"
        : entry.targetFamily === "event"
          ? "event"
          : "menuInstance");

  if (currentKind === "menuInstance" || currentKind === "menu") {
    const menuInstanceId =
      explicitTargetId ??
      (authoringTarget?.kind === "menu"
        ? normalizeOptionalString(authoringTarget.menuInstanceId)
        : normalizeOptionalString(entry.targetId));
    return {
      authoringTarget: {
        kind: "menu",
        menuInstanceId,
      },
      targetFamily: "info",
      targetId: menuInstanceId,
    };
  }

  const eventId =
    explicitTargetId ??
    (authoringTarget?.kind === "event"
      ? normalizeOptionalString(authoringTarget.eventId)
      : normalizeOptionalString(entry.targetId));
  return {
    authoringTarget: {
      kind: "event",
      eventId,
    },
    targetFamily: "event",
    targetId: eventId,
  };
}

function normalizeString(value: unknown, fallback: string): string {
  const normalized = normalizeOptionalString(value);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeScriptEditorMountRecord(
  value: unknown,
  index: number
): ScriptEditorMountRecord | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const rawValue = value as Record<string, unknown>;
  const kind = normalizeOptionalString(rawValue.kind);
  const order = Number.isFinite(rawValue.order) ? Number(rawValue.order) : index;
  const title = normalizeOptionalString(rawValue.title);
  const visible = rawValue.visible !== false;
  const target =
    rawValue.target != null && typeof rawValue.target === "object" && !Array.isArray(rawValue.target)
      ? (rawValue.target as Record<string, unknown>)
      : {};

  if (kind === "menu") {
    const menuInstanceId = normalizeOptionalString(target.menuInstanceId);
    if (menuInstanceId.length === 0) {
      return null;
    }
    return {
      kind: "menu",
      ...(title.length === 0 ? {} : { title }),
      order,
      visible,
      target: {
        kind: "menu",
        menuInstanceId,
      },
    };
  }

  if (kind === "city") {
    const cityId = normalizeOptionalString(target.cityId);
    if (cityId.length === 0) {
      return null;
    }
    return {
      kind: "city",
      ...(title.length === 0 ? {} : { title }),
      order,
      visible,
      target: {
        kind: "city",
        cityId,
      },
    };
  }

  if (kind === "building") {
    const buildingId = normalizeOptionalString(target.buildingId);
    if (buildingId.length === 0) {
      return null;
    }
    return {
      kind: "building",
      ...(title.length === 0 ? {} : { title }),
      order,
      visible,
      target: {
        kind: "building",
        buildingId,
      },
    };
  }

  if (kind === "event") {
    const eventId = normalizeOptionalString(target.eventId);
    if (eventId.length === 0) {
      return null;
    }
    return {
      kind: "event",
      ...(title.length === 0 ? {} : { title }),
      order,
      visible,
      target: {
        kind: "event",
        eventId,
      },
    };
  }

  return null;
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

function getProjectMenuOwner(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMenuOwnerFamily,
  ownerId: string
): ScriptEditorMenuOwnerRecord | null {
  if (family === "people") {
    return project.people.find((record) => record.id === ownerId) ?? null;
  }
  if (family === "cities") {
    return project.cities.find((record) => record.id === ownerId) ?? null;
  }
  return project.buildings.find((record) => record.id === ownerId) ?? null;
}

function replaceProjectMenuOwner(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMenuOwnerFamily,
  nextOwner: ScriptEditorMenuOwnerRecord
): ScriptEditorProjectDefinition {
  if (family === "people") {
    return syncMenuOwnerBindings({
      ...project,
      people: project.people.map((record) =>
        record.id === nextOwner.id ? (nextOwner as ScriptEditorPersonRecord) : record
      ),
    });
  }
  if (family === "cities") {
    return syncMenuOwnerBindings({
      ...project,
      cities: project.cities.map((record) =>
        record.id === nextOwner.id ? (nextOwner as ScriptEditorCityRecord) : record
      ),
    });
  }
  return syncMenuOwnerBindings({
    ...project,
    buildings: project.buildings.map((record) =>
      record.id === nextOwner.id ? (nextOwner as ScriptEditorBuildingRecord) : record
    ),
  });
}

function syncMenuOwnerBindings(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition {
  return {
    ...project,
    people: project.people.map((person) => ({
      ...person,
      mounts: normalizeScriptEditorMounts(person.mounts),
    })),
    cities: project.cities.map((city) => syncLocationMenuMounts(city)),
    buildings: project.buildings.map((building) => syncLocationMenuMounts(building)),
  };
}

function syncLocationMenuMounts<TLocation extends ScriptEditorLocationRecord>(
  location: TLocation
): TLocation {
  const normalizedMounts = normalizeScriptEditorMounts(location.mounts);
  const normalizedMenuInstanceIds = readTrimmedStringArray(location.menuInstanceIds);
  const effectiveMounts =
    normalizedMounts.length > 0
      ? normalizedMounts
      : normalizedMenuInstanceIds.map((menuInstanceId, index) => ({
          kind: "menu" as const,
          order: index,
          target: {
            kind: "menu" as const,
            menuInstanceId,
          },
        }));

  return {
    ...location,
    mounts: effectiveMounts,
    menuInstanceIds:
      effectiveMounts.length > 0
        ? effectiveMounts
            .filter((mount) => mount.kind === "menu")
            .map((mount) => mount.target.menuInstanceId)
        : normalizedMenuInstanceIds,
  };
}
