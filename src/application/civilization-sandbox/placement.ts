import {
  getSandboxHexKey,
  type CivilizationSandboxState,
  type SandboxCivilization,
  type SandboxHousehold,
  type SandboxIndividual,
  type SandboxRaceId,
  type SandboxRole,
  type SandboxSettlement,
} from "../../domain/civilization-sandbox";
import { generateSandboxChildName } from "./name-generator";
import { SANDBOX_RACE_TEMPLATES } from "./race-templates";

export type PlaceSandboxLordInput = {
  state: CivilizationSandboxState;
  raceId: SandboxRaceId;
  hex: {
    x: number;
    y: number;
  };
};

export function placeSandboxLord(
  input: PlaceSandboxLordInput
): CivilizationSandboxState {
  const race = SANDBOX_RACE_TEMPLATES[input.raceId];
  const existingCount = Object.values(input.state.civilizationsById).filter(
    (civilization) => civilization.raceId === input.raceId
  ).length;
  const index = existingCount + 1;
  const civilizationId = `civ.${input.raceId}.${index}`;
  const settlementId = `settlement.${input.raceId}.${index}`;
  const householdId = `household.${input.raceId}.${index}`;
  const lordId = `individual.${input.raceId}.${index}`;
  const helperIds = [1, 2, 3].map(
    (helperIndex) => `individual.${input.raceId}.${index}.${helperIndex}`
  );
  const claimedHexKey = getSandboxHexKey(input.hex);
  const civilization: SandboxCivilization = {
    id: civilizationId,
    raceId: input.raceId,
    colorToken: race.colorToken,
    founderIndividualId: lordId,
    lordId,
    color: race.color,
    homeHexKey: claimedHexKey,
    claimedHexKeys: [claimedHexKey],
    settlementIds: [settlementId],
    population: 4,
    stockpile: {
      food: 12,
      wood: 12,
    },
    technology: {
      progress: 0,
    },
    reservedDiplomaticStance: {},
    birthCount: 0,
    activityLog: [`${race.founderName} founded a camp.`],
  };
  const settlement: SandboxSettlement = {
    id: settlementId,
    civilizationId,
    name: `${race.founderName}营地`,
    level: "camp",
    centerHex: input.hex,
    structureIds: [],
  };
  const household: SandboxHousehold = {
    id: householdId,
    civilizationId,
    settlementId,
    memberIds: [lordId, ...helperIds],
    houseStructureId: null,
    birthCooldownTicks: 0,
  };
  const individuals: Record<string, SandboxIndividual> = {
    [lordId]: createIndividual({
      id: lordId,
      name: race.founderName,
      raceId: input.raceId,
      civilizationId,
      settlementId,
      householdId,
      role: "lord",
      birthIndex: 0,
      hex: input.hex,
      spriteVariantId: race.preferredLordSprites[0] ?? "noble1",
      sex: "male",
    }),
  };

  for (const [helperIndex, helperId] of helperIds.entries()) {
    individuals[helperId] = createIndividual({
      id: helperId,
      name: generateSandboxChildName({
        raceId: input.raceId,
        birthIndex: helperIndex,
        usedNames: Object.values(individuals).map((individual) => individual.name),
      }),
      raceId: input.raceId,
      civilizationId,
      settlementId,
      householdId,
      role: helperIndex === 0 ? "farmer" : helperIndex === 1 ? "builder" : "forager",
      birthIndex: helperIndex + 1,
      hex: input.hex,
      spriteVariantId: helperIndex === 0 ? "commoner1" : "commoner2",
      sex: helperIndex % 2 === 0 ? "female" : "male",
    });
  }

  return {
    ...input.state,
    enabled: true,
    civilizationsById: {
      ...input.state.civilizationsById,
      [civilizationId]: civilization,
    },
    householdsById: {
      ...input.state.householdsById,
      [householdId]: household,
    },
    settlementsById: {
      ...input.state.settlementsById,
      [settlementId]: settlement,
    },
    individualsById: {
      ...input.state.individualsById,
      ...individuals,
    },
    claimedHexByKey: {
      ...input.state.claimedHexByKey,
      [claimedHexKey]: civilizationId,
    },
    recentEvents: [
      ...input.state.recentEvents,
      {
        tick: input.state.tick,
        message: `${race.founderName} placed at ${claimedHexKey}.`,
      },
    ],
  };
}

function createIndividual(input: {
  id: string;
  name: string;
  raceId: SandboxRaceId;
  civilizationId: string;
  settlementId: string;
  householdId: string;
  role: SandboxRole;
  birthIndex: number;
  hex: {
    x: number;
    y: number;
  };
  spriteVariantId: string;
  sex: "male" | "female";
}): SandboxIndividual {
  return {
    id: input.id,
    civilizationId: input.civilizationId,
    raceId: input.raceId,
    name: input.name,
    birthIndex: input.birthIndex,
    settlementId: input.settlementId,
    householdId: input.householdId,
    role: input.role,
    age: input.role === "lord" ? 24 : 18,
    sex: input.sex,
    hex: input.hex,
    hexKey: getSandboxHexKey(input.hex),
    direction: "right-down",
    spriteVariantId: input.spriteVariantId,
    ageTicks: 0,
    isLeader: input.role === "lord",
    needs: {
      hunger: 0,
      stamina: 100,
    },
    traits: [],
    task: null,
  };
}
