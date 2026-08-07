import {
  createInitialCivilizationSandboxState,
  type CivilizationSandboxState,
  type SandboxRaceId,
} from "../../../domain/civilization-sandbox";
import {
  coordinateToRoundedHex,
  type CoordinateSpace,
  type GridCoordinate,
  type HexCoordinateSystem,
} from "../../navigation/travel-to-coordinate";
import { placeSandboxLord } from "../../civilization-sandbox/placement";
import { tickCivilizationSandbox } from "../../civilization-sandbox/simulation";

export type CivilizationSandboxAction =
  | {
      type: "place-lord";
      raceId: SandboxRaceId;
      hex: {
        x: number;
        y: number;
      };
    }
  | { type: "tick" }
  | { type: "clear" }
  | { type: "toggle-territory-view" }
  | { type: "select"; entityId: string | null };

export type CivilizationSandboxActionInput = {
  state: CivilizationSandboxState;
  action: CivilizationSandboxAction;
};

export type CivilizationSandboxActionResult = {
  handled: boolean;
  state: CivilizationSandboxState;
};

export function createCivilizationSandboxActionFromUiInput(input: {
  actionType: string | undefined;
  raceId: string | undefined;
  entityId: string | undefined;
  coordinate: GridCoordinate;
  coordinateSpace?: CoordinateSpace | null;
  coordinateSystem?: HexCoordinateSystem | null;
}): CivilizationSandboxAction | null {
  if (input.actionType === "place-lord") {
    if (
      input.raceId !== "wu-tong" &&
      input.raceId !== "yu-qingqing" &&
      input.raceId !== "chen-yihan"
    ) {
      return null;
    }

    return {
      type: "place-lord",
      raceId: input.raceId,
      hex:
        input.coordinateSpace == null
          ? input.coordinate
          : coordinateToRoundedHex(
              input.coordinate,
              input.coordinateSpace,
              input.coordinateSystem ?? undefined
            ),
    };
  }

  if (
    input.actionType === "tick" ||
    input.actionType === "clear" ||
    input.actionType === "toggle-territory-view"
  ) {
    return {
      type: input.actionType,
    };
  }

  if (input.actionType === "select") {
    return {
      type: "select",
      entityId: input.entityId ?? null,
    };
  }

  return null;
}

export function handleCivilizationSandboxAction(
  input: CivilizationSandboxActionInput
): CivilizationSandboxActionResult {
  if (input.action.type === "place-lord") {
    return {
      handled: true,
      state: placeSandboxLord({
        state: input.state,
        raceId: input.action.raceId,
        hex: input.action.hex,
      }),
    };
  }

  if (input.action.type === "tick") {
    return {
      handled: true,
      state: tickCivilizationSandbox(input.state),
    };
  }

  if (input.action.type === "clear") {
    return {
      handled: true,
      state: createInitialCivilizationSandboxState(),
    };
  }

  if (input.action.type === "toggle-territory-view") {
    return {
      handled: true,
      state: {
        ...input.state,
        viewMode: input.state.viewMode === "territory" ? "normal" : "territory",
      },
    };
  }

  return {
    handled: true,
    state: {
      ...input.state,
      selectedEntityId: input.action.entityId,
    },
  };
}
