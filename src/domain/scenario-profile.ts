import type { CharacterId } from "./character";
import type { CityId } from "./city";
import type { DialogueId } from "./dialogue";
import type { ChapterId, EventId } from "./event";
import type { ViewName, CalendarDate, GameState } from "./game-state";
import type { HouseId } from "./house";
import type { MapId } from "./map";

export type ScenarioRuntimeBootstrap = {
  flags?: Record<string, boolean>;
  variables?: Record<string, string | number>;
};

export type ScenarioLaunchPolicy = {
  characterSelection?: "fixed" | "select" | "first-playable";
  initialView?: ViewName;
  entryEventTiming?: "immediate" | "after-map-entry";
};

export type ScenarioCharacterStartupOverride = {
  characterId: CharacterId;
  initialCalendar?: CalendarDate;
  initialLocation?: {
    mapId?: MapId;
    cityId?: CityId;
    houseId?: HouseId | null;
    dialogueId?: DialogueId | null;
    view?: ViewName;
  };
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  initialUi?: {
    reviewDateText?: string;
    mainHouseMissionText?: string;
  };
  initialRuntime?: ScenarioRuntimeBootstrap;
  launchPolicy?: Omit<ScenarioLaunchPolicy, "characterSelection">;
  entryEventId?: EventId | null;
  openingFlowId?: string | null;
};

export type ScenarioProfileDefinition = {
  id: string;
  title: string;
  playerCharacterId: CharacterId;
  chapterId: ChapterId;
  initialCalendar?: CalendarDate;
  initialLocation: {
    mapId: MapId;
    cityId: CityId;
    houseId: HouseId | null;
    dialogueId?: DialogueId;
    view: ViewName;
  };
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  initialUi?: {
    reviewDateText?: string;
    mainHouseMissionText?: string;
  };
  initialRuntime?: ScenarioRuntimeBootstrap;
  characterStartups?: ScenarioCharacterStartupOverride[];
  launchPolicy?: ScenarioLaunchPolicy;
  entryEventId?: EventId;
  openingFlowId?: string;
  tags?: string[];
};

export type ScenarioProfileId = ScenarioProfileDefinition["id"];
export type ScenarioProfileRuntimeFlags = GameState["runtime"]["flags"];
export type ScenarioProfileRuntimeVariables = GameState["runtime"]["variables"];

export type ScenarioProfileStartupPresentation = {
  currentView: ViewName;
  currentHouseId: HouseId | null;
  activeDialogueId: DialogueId | null;
};

export function resolveScenarioProfileForCharacter(
  profile: ScenarioProfileDefinition,
  selectedCharacterId?: CharacterId | null
): ScenarioProfileDefinition {
  if (selectedCharacterId == null) {
    return profile;
  }

  const override = profile.characterStartups?.find(
    (record) => record.characterId === selectedCharacterId
  );
  if (override == null) {
    return profile;
  }

  const mergedInitialRuntime =
    override.initialRuntime == null && profile.initialRuntime == null
      ? undefined
      : {
          ...(profile.initialRuntime?.flags == null &&
          override.initialRuntime?.flags == null
            ? {}
            : {
                flags: {
                  ...(profile.initialRuntime?.flags ?? {}),
                  ...(override.initialRuntime?.flags ?? {}),
                },
              }),
          ...(profile.initialRuntime?.variables == null &&
          override.initialRuntime?.variables == null
            ? {}
            : {
                variables: {
                  ...(profile.initialRuntime?.variables ?? {}),
                  ...(override.initialRuntime?.variables ?? {}),
                },
              }),
        };

  const withEntryEvent =
    override.entryEventId === undefined
      ? profile
      : override.entryEventId == null
        ? (() => {
            const { entryEventId: _entryEventId, ...rest } = profile;
            return rest;
          })()
        : { ...profile, entryEventId: override.entryEventId };

  const withOpeningFlow =
    override.openingFlowId === undefined
      ? withEntryEvent
      : override.openingFlowId == null
        ? (() => {
            const { openingFlowId: _openingFlowId, ...rest } = withEntryEvent;
            return rest;
          })()
        : { ...withEntryEvent, openingFlowId: override.openingFlowId };

  return {
    ...withOpeningFlow,
    ...(override.initialCalendar == null
      ? {}
      : { initialCalendar: override.initialCalendar }),
    initialLocation:
      override.initialLocation == null
        ? profile.initialLocation
        : {
            ...(() => {
              const mergedLocation = {
                ...profile.initialLocation,
                ...override.initialLocation,
              };
              if (override.initialLocation.dialogueId === null) {
                const { dialogueId: _dialogueId, ...rest } = mergedLocation;
                return rest;
              }
              if (typeof mergedLocation.dialogueId === "string") {
                return mergedLocation;
              }
              const { dialogueId: _dialogueId, ...rest } = mergedLocation;
              return rest;
            })(),
          },
    ...(override.initialPlayerCoordinate == null
      ? {}
      : { initialPlayerCoordinate: override.initialPlayerCoordinate }),
    ...(override.initialUi == null
      ? {}
      : {
          initialUi: {
            ...(profile.initialUi ?? {}),
            ...override.initialUi,
          },
        }),
    ...(mergedInitialRuntime == null
      ? {}
      : { initialRuntime: mergedInitialRuntime }),
    ...(override.launchPolicy == null
      ? {}
      : {
          launchPolicy: {
            ...(profile.launchPolicy ?? {}),
            ...override.launchPolicy,
          },
        }),
  };
}

export function resolveScenarioProfileStartupPresentation(
  profile: ScenarioProfileDefinition
): ScenarioProfileStartupPresentation {
  const currentView =
    profile.launchPolicy?.initialView ?? profile.initialLocation.view;

  return {
    currentView,
    currentHouseId:
      currentView === "house" ? profile.initialLocation.houseId : null,
    activeDialogueId:
      currentView === "dialogue"
        ? profile.initialLocation.dialogueId ?? null
        : null,
  };
}
