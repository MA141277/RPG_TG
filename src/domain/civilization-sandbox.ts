import type { CharacterId } from "./character";
import type { MapId } from "./map";

export type CivilizationSandboxMode = "validation";
export type CivilizationSandboxViewMode = "normal" | "territory";

export type CivilizationSandboxRaceId =
  | "wu-tong"
  | "yu-qingqing"
  | "chen-yihan";

export type CivilizationSandboxHexKey = string;
export type CivilizationSandboxIndividualId = string;
export type CivilizationSandboxCivilizationId = string;

export type CivilizationSandboxFounder = {
  raceId: CivilizationSandboxRaceId;
  name: string;
  sourceCharacterId?: CharacterId;
};

export type CivilizationSandboxCivilizationState = {
  id: CivilizationSandboxCivilizationId;
  raceId: CivilizationSandboxRaceId;
  founderIndividualId: CivilizationSandboxIndividualId;
  color: string;
  homeHexKey: CivilizationSandboxHexKey;
  claimedHexKeys: CivilizationSandboxHexKey[];
  population: number;
};

export type CivilizationSandboxIndividualState = {
  id: CivilizationSandboxIndividualId;
  civilizationId: CivilizationSandboxCivilizationId;
  raceId: CivilizationSandboxRaceId;
  name: string;
  birthIndex: number;
  hexKey: CivilizationSandboxHexKey;
  ageTicks: number;
  isLeader: boolean;
};

export type CivilizationSandboxClaimState = {
  civilizationId: CivilizationSandboxCivilizationId;
  raceId: CivilizationSandboxRaceId;
  claimedAtTick: number;
};

export type CivilizationSandboxState = {
  enabled: boolean;
  mode: CivilizationSandboxMode;
  viewMode: CivilizationSandboxViewMode;
  mapId: MapId | null;
  tick: number;
  civilizationsById: Record<
    CivilizationSandboxCivilizationId,
    CivilizationSandboxCivilizationState
  >;
  individualsById: Record<
    CivilizationSandboxIndividualId,
    CivilizationSandboxIndividualState
  >;
  claimedHexByKey: Record<
    CivilizationSandboxHexKey,
    CivilizationSandboxClaimState
  >;
};

export function createInitialCivilizationSandboxState(): CivilizationSandboxState {
  return {
    enabled: false,
    mode: "validation",
    viewMode: "normal",
    mapId: null,
    tick: 0,
    civilizationsById: {},
    individualsById: {},
    claimedHexByKey: {},
  };
}
