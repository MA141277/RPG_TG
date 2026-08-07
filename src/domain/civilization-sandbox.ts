import type { CharacterId } from "./character";
import type { MapId } from "./map";

export type CivilizationSandboxMode = "validation";
export type CivilizationSandboxViewMode = "normal" | "territory";

export type CivilizationSandboxRaceId =
  | "wu-tong"
  | "yu-qingqing"
  | "chen-yihan";
export type SandboxRaceId = CivilizationSandboxRaceId;

export type CivilizationSandboxHexKey = string;
export type CivilizationSandboxIndividualId = string;
export type CivilizationSandboxCivilizationId = string;
export type SandboxHexCoordinate = {
  x: number;
  y: number;
};
export type SandboxDirection =
  | "right-up"
  | "right-down"
  | "left-up"
  | "left-down";
export type SandboxRole =
  | "lord"
  | "farmer"
  | "builder"
  | "forager"
  | "fighter"
  | "child"
  | "idle";
export type SandboxTask =
  | { type: "forage"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "build-house"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "build-farm"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "farm"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "claim-hex"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "patrol"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "idle"; progress: number };

export type CivilizationSandboxFounder = {
  raceId: CivilizationSandboxRaceId;
  name: string;
  sourceCharacterId?: CharacterId;
};

export type CivilizationSandboxCivilizationState = {
  id: CivilizationSandboxCivilizationId;
  raceId: CivilizationSandboxRaceId;
  colorToken: string;
  founderIndividualId: CivilizationSandboxIndividualId;
  lordId: CivilizationSandboxIndividualId;
  color: string;
  homeHexKey: CivilizationSandboxHexKey;
  claimedHexKeys: CivilizationSandboxHexKey[];
  settlementIds: string[];
  population: number;
  stockpile: {
    food: number;
    wood: number;
  };
  technology: {
    progress: number;
  };
  reservedDiplomaticStance: Record<string, "neutral" | "hostile" | "friendly">;
  birthCount: number;
  activityLog: string[];
};
export type SandboxCivilization = CivilizationSandboxCivilizationState;

export type CivilizationSandboxIndividualState = {
  id: CivilizationSandboxIndividualId;
  civilizationId: CivilizationSandboxCivilizationId;
  raceId: CivilizationSandboxRaceId;
  name: string;
  birthIndex: number;
  settlementId: string | null;
  householdId: string | null;
  role: SandboxRole;
  age: number;
  sex: "male" | "female";
  hex: SandboxHexCoordinate;
  hexKey: CivilizationSandboxHexKey;
  direction: SandboxDirection;
  spriteVariantId: string;
  ageTicks: number;
  isLeader: boolean;
  needs: {
    hunger: number;
    stamina: number;
  };
  traits: string[];
  task: SandboxTask | null;
};
export type SandboxIndividual = CivilizationSandboxIndividualState;

export type CivilizationSandboxClaimState = {
  civilizationId: CivilizationSandboxCivilizationId;
  raceId: CivilizationSandboxRaceId;
  claimedAtTick: number;
};
export type SandboxHousehold = {
  id: string;
  civilizationId: string;
  settlementId: string;
  memberIds: string[];
  houseStructureId: string | null;
  birthCooldownTicks: number;
};
export type SandboxSettlement = {
  id: string;
  civilizationId: string;
  name: string;
  level: "camp" | "village" | "fort" | "town";
  centerHex: SandboxHexCoordinate;
  structureIds: string[];
};
export type SandboxStructure = {
  id: string;
  kind: "rural-house" | "farm" | "storage" | "fort";
  civilizationId: string;
  settlementId: string;
  hex: SandboxHexCoordinate;
  buildProgress: number;
  workers: string[];
};
export type SandboxEvent = {
  tick: number;
  message: string;
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
  householdsById: Record<string, SandboxHousehold>;
  settlementsById: Record<string, SandboxSettlement>;
  structuresById: Record<string, SandboxStructure>;
  claimedHexByKey: Record<CivilizationSandboxHexKey, string>;
  recentEvents: SandboxEvent[];
};

export function getSandboxHexKey(hex: SandboxHexCoordinate): string {
  return `${hex.x},${hex.y}`;
}

export function createInitialCivilizationSandboxState(): CivilizationSandboxState {
  return {
    enabled: false,
    mode: "validation",
    viewMode: "normal",
    mapId: null,
    tick: 0,
    civilizationsById: {},
    individualsById: {},
    householdsById: {},
    settlementsById: {},
    structuresById: {},
    claimedHexByKey: {},
    recentEvents: [],
  };
}
