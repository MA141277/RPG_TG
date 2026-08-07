import {
  getSandboxHexKey,
  type CivilizationSandboxState,
  type SandboxCivilization,
  type SandboxIndividual,
  type SandboxStructure,
} from "../../domain/civilization-sandbox";
import { generateSandboxChildName } from "./name-generator";
import { SANDBOX_RACE_TEMPLATES } from "./race-templates";

const ADJACENT_HEXES = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
] as const;

export function tickCivilizationSandbox(
  state: CivilizationSandboxState
): CivilizationSandboxState {
  if (!state.enabled) {
    return state;
  }

  let nextState: CivilizationSandboxState = {
    ...state,
    tick: state.tick + 1,
  };

  for (const civilization of Object.values(nextState.civilizationsById)) {
    let currentCivilization =
      nextState.civilizationsById[civilization.id] ?? civilization;

    nextState = ensureCivilizationHouse(nextState, currentCivilization);
    currentCivilization =
      nextState.civilizationsById[civilization.id] ?? currentCivilization;

    nextState = ensureCivilizationFarm(nextState, currentCivilization);
    currentCivilization =
      nextState.civilizationsById[civilization.id] ?? currentCivilization;

    nextState = claimNextAdjacentHex(nextState, currentCivilization);
    currentCivilization =
      nextState.civilizationsById[civilization.id] ?? currentCivilization;

    nextState = moveCivilizationIndividuals(nextState, currentCivilization);
    currentCivilization =
      nextState.civilizationsById[civilization.id] ?? currentCivilization;

    nextState = reproduceIfReady(nextState, currentCivilization);
  }

  return nextState;
}

function ensureCivilizationHouse(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  if (
    Object.values(state.structuresById).some(
      (structure) =>
        structure.civilizationId === civilization.id &&
        structure.kind === "rural-house"
    )
  ) {
    return state;
  }

  return addStructure(state, civilization, {
    kind: "rural-house",
    hex: getCivilizationCenterHex(state, civilization),
    event: "built a rural house",
  });
}

function ensureCivilizationFarm(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  if (
    Object.values(state.structuresById).some(
      (structure) =>
        structure.civilizationId === civilization.id && structure.kind === "farm"
    )
  ) {
    return state;
  }

  const centerHex = getCivilizationCenterHex(state, civilization);
  return addStructure(state, civilization, {
    kind: "farm",
    hex: { x: centerHex.x + 1, y: centerHex.y },
    event: "opened a farm",
  });
}

function claimNextAdjacentHex(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  const centerHex = getCivilizationCenterHex(state, civilization);
  const claimLimit =
    SANDBOX_RACE_TEMPLATES[civilization.raceId].behavior.expansion + 1;

  if (civilization.claimedHexKeys.length >= claimLimit) {
    return state;
  }

  for (const offset of ADJACENT_HEXES) {
    const hex = { x: centerHex.x + offset.x, y: centerHex.y + offset.y };
    const key = getSandboxHexKey(hex);
    if (state.claimedHexByKey[key] == null) {
      return {
        ...state,
        civilizationsById: {
          ...state.civilizationsById,
          [civilization.id]: {
            ...civilization,
            claimedHexKeys: [...civilization.claimedHexKeys, key],
          },
        },
        claimedHexByKey: {
          ...state.claimedHexByKey,
          [key]: civilization.id,
        },
        recentEvents: [
          ...state.recentEvents,
          {
            tick: state.tick,
            message: `${civilization.id} claimed ${key}.`,
          },
        ],
      };
    }
  }

  return state;
}

function reproduceIfReady(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  if (state.tick < 6 || state.tick % 2 !== 0) {
    return state;
  }

  const centerHex = getCivilizationCenterHex(state, civilization);
  const existingNames = Object.values(state.individualsById)
    .filter((individual) => individual.civilizationId === civilization.id)
    .map((individual) => individual.name);
  const childName = generateSandboxChildName({
    raceId: civilization.raceId,
    birthIndex: civilization.birthCount,
    usedNames: existingNames,
  });
  const childId = `individual.${civilization.raceId}.child.${
    civilization.birthCount + 1
  }`;
  const householdId =
    Object.values(state.householdsById).find(
      (household) => household.civilizationId === civilization.id
    )?.id ?? null;
  const household =
    householdId == null ? null : state.householdsById[householdId] ?? null;
  const child: SandboxIndividual = {
    id: childId,
    civilizationId: civilization.id,
    raceId: civilization.raceId,
    name: childName,
    birthIndex: civilization.birthCount,
    settlementId: civilization.settlementIds[0] ?? null,
    householdId,
    role: "child",
    age: 0,
    sex: civilization.birthCount % 2 === 0 ? "female" : "male",
    hex: centerHex,
    hexKey: getSandboxHexKey(centerHex),
    direction: "right-down",
    spriteVariantId: "commoner1",
    ageTicks: 0,
    isLeader: false,
    needs: {
      hunger: 0,
      stamina: 100,
    },
    traits: [],
    task: null,
  };

  return {
    ...state,
    individualsById: {
      ...state.individualsById,
      [childId]: child,
    },
    civilizationsById: {
      ...state.civilizationsById,
      [civilization.id]: {
        ...civilization,
        birthCount: civilization.birthCount + 1,
        population: civilization.population + 1,
      },
    },
    householdsById:
      household == null
        ? state.householdsById
        : {
            ...state.householdsById,
            [household.id]: {
              ...household,
              memberIds: [...household.memberIds, childId],
            },
          },
    recentEvents: [
      ...state.recentEvents,
      {
        tick: state.tick,
        message: `${childName} was born.`,
      },
    ],
  };
}

function moveCivilizationIndividuals(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  const claimedHexes = civilization.claimedHexKeys
    .map(parseSandboxHexKey)
    .filter((hex): hex is { x: number; y: number } => hex != null);

  if (claimedHexes.length <= 1) {
    return state;
  }

  const walkingHexes = claimedHexes.filter(
    (hex) => getSandboxHexKey(hex) !== civilization.homeHexKey
  );

  if (walkingHexes.length <= 0) {
    return state;
  }

  const nextIndividuals = { ...state.individualsById };
  let changed = false;
  const members = Object.values(state.individualsById)
    .filter(
      (individual) =>
        individual.civilizationId === civilization.id && !individual.isLeader
    )
    .sort((left, right) => left.id.localeCompare(right.id));

  for (const [memberIndex, individual] of members.entries()) {
    const currentWalkingIndex = walkingHexes.findIndex(
      (hex) => getSandboxHexKey(hex) === individual.hexKey
    );
    const targetIndex =
      currentWalkingIndex < 0
        ? memberIndex % walkingHexes.length
        : (currentWalkingIndex + 1) % walkingHexes.length;
    const targetHex = walkingHexes[targetIndex];
    if (targetHex == null || getSandboxHexKey(targetHex) === individual.hexKey) {
      continue;
    }

    nextIndividuals[individual.id] = {
      ...individual,
      hex: targetHex,
      hexKey: getSandboxHexKey(targetHex),
      direction: getDirectionBetweenHexes(individual.hex, targetHex),
      task: {
        type: individual.role === "farmer" ? "farm" : "patrol",
        targetHex,
        progress: 1,
      },
    };
    changed = true;
  }

  return changed
    ? {
        ...state,
        individualsById: nextIndividuals,
      }
    : state;
}

function addStructure(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization,
  input: {
    kind: SandboxStructure["kind"];
    hex: {
      x: number;
      y: number;
    };
    event: string;
  }
): CivilizationSandboxState {
  const settlementId = civilization.settlementIds[0];
  if (settlementId == null) {
    return state;
  }

  const structureId = `structure.${civilization.id}.${input.kind}`;
  const settlement = state.settlementsById[settlementId];
  const structure: SandboxStructure = {
    id: structureId,
    kind: input.kind,
    civilizationId: civilization.id,
    settlementId,
    hex: input.hex,
    buildProgress: 1,
    workers: Object.values(state.individualsById)
      .filter((individual) => individual.civilizationId === civilization.id)
      .slice(0, 2)
      .map((individual) => individual.id),
  };

  return {
    ...state,
    structuresById: {
      ...state.structuresById,
      [structureId]: structure,
    },
    settlementsById:
      settlement == null
        ? state.settlementsById
        : {
            ...state.settlementsById,
            [settlementId]: {
              ...settlement,
              level: "village",
              structureIds: [...settlement.structureIds, structureId],
            },
          },
    recentEvents: [
      ...state.recentEvents,
      {
        tick: state.tick,
        message: `${civilization.id} ${input.event}.`,
      },
    ],
  };
}

function getCivilizationCenterHex(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): {
  x: number;
  y: number;
} {
  const settlement = state.settlementsById[civilization.settlementIds[0] ?? ""];
  return settlement?.centerHex ?? { x: 0, y: 0 };
}

function parseSandboxHexKey(hexKey: string): { x: number; y: number } | null {
  const parts = hexKey.split(",");
  const x = Number(parts[0]);
  const y = Number(parts[1]);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

function getDirectionBetweenHexes(
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  if (to.x >= from.x && to.y <= from.y) {
    return "right-up";
  }

  if (to.x >= from.x) {
    return "right-down";
  }

  if (to.y <= from.y) {
    return "left-up";
  }

  return "left-down";
}
