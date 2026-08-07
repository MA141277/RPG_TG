import type {
  CivilizationSandboxState,
  SandboxDirection,
  SandboxStructure,
} from "../../domain/civilization-sandbox";

export type CivilizationSandboxMapOverlay = {
  enabled: boolean;
  viewMode: "normal" | "territory";
  selectedEntityId: string | null;
  individuals: Array<{
    id: string;
    name: string;
    civilizationId: string;
    hex: {
      x: number;
      y: number;
    };
    direction: SandboxDirection;
    spriteResourceId: string;
    role: string;
    taskLabel: string;
  }>;
  structures: Array<{
    id: string;
    kind: SandboxStructure["kind"];
    civilizationId: string;
    hex: {
      x: number;
      y: number;
    };
    progress: number;
  }>;
  claimedHexes: Array<{
    hex: {
      x: number;
      y: number;
    };
    civilizationId: string;
    colorToken: string;
  }>;
};

export function createCivilizationSandboxMapOverlay(
  state: CivilizationSandboxState
): CivilizationSandboxMapOverlay {
  return {
    enabled: state.enabled,
    viewMode: state.viewMode,
    selectedEntityId: null,
    individuals: Object.values(state.individualsById).map((individual) => ({
      id: individual.id,
      name: individual.name,
      civilizationId: individual.civilizationId,
      hex: individual.hex,
      direction: individual.direction,
      spriteResourceId: `sandbox.walker.${individual.spriteVariantId}.${individual.direction}`,
      role: individual.role,
      taskLabel: individual.task?.type ?? "idle",
    })),
    structures: Object.values(state.structuresById).map((structure) => ({
      id: structure.id,
      kind: structure.kind,
      civilizationId: structure.civilizationId,
      hex: structure.hex,
      progress: structure.buildProgress,
    })),
    claimedHexes: Object.entries(state.claimedHexByKey).flatMap(
      ([hexKey, civilizationId]) => {
        const civilization = state.civilizationsById[civilizationId];
        if (civilization == null) {
          return [];
        }

        const parts = hexKey.split(",");
        const x = Number(parts[0]);
        const y = Number(parts[1]);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return [];
        }

        return [
          {
            hex: { x, y },
            civilizationId,
            colorToken: civilization.colorToken,
          },
        ];
      }
    ),
  };
}
