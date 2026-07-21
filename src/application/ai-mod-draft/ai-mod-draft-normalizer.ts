import {
  AI_MOD_DRAFT_FIRST_STAGE_MODE,
  AI_MOD_DRAFT_KIND,
  AI_MOD_DRAFT_SCHEMA_VERSION,
  type AiModDraft,
} from "./ai-mod-draft-schema";
import {
  createAiModDraftError,
  type AiModDraftDiagnostic,
} from "./ai-mod-draft-diagnostics";

export function normalizeAiModDraft(input: unknown): {
  draft: AiModDraft | null;
  diagnostics: AiModDraftDiagnostic[];
} {
  const diagnostics: AiModDraftDiagnostic[] = [];
  if (!isRecord(input)) {
    return {
      draft: null,
      diagnostics: [
        createAiModDraftError("$", "AI Mod Draft must be a JSON object."),
      ],
    };
  }

  if (input.schemaVersion !== AI_MOD_DRAFT_SCHEMA_VERSION) {
    diagnostics.push(
      createAiModDraftError(
        "schemaVersion",
        `AI Mod Draft schemaVersion must be ${AI_MOD_DRAFT_SCHEMA_VERSION}.`
      )
    );
  }
  if (input.kind !== AI_MOD_DRAFT_KIND) {
    diagnostics.push(
      createAiModDraftError("kind", `AI Mod Draft kind must be ${AI_MOD_DRAFT_KIND}.`)
    );
  }

  const id = readRequiredString(input.id, "id", diagnostics);
  const title = readRequiredString(input.title, "title", diagnostics);
  const rawGenerationScope = isRecord(input.generationScope)
    ? input.generationScope
    : {};
  const mode = rawGenerationScope.mode;
  if (mode !== AI_MOD_DRAFT_FIRST_STAGE_MODE) {
    diagnostics.push(
      createAiModDraftError(
        "generationScope.mode",
        `AI Mod Draft generationScope.mode must be ${AI_MOD_DRAFT_FIRST_STAGE_MODE}.`
      )
    );
  }

  if (diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
    return { draft: null, diagnostics };
  }

  const worldScale = normalizeWorldScale(input.worldScale);
  const stages = readArray(input.stages) as AiModDraft["stages"];
  const entities = normalizeEntities(input.entities);
  const actionLoops = readArray(input.actionLoops) as AiModDraft["actionLoops"];
  const dialogues = readArray(input.dialogues) as AiModDraft["dialogues"];
  const events = readArray(input.events) as AiModDraft["events"];
  const bindings = readArray(input.bindings) as AiModDraft["bindings"];

  validateEditableProjectContent(
    {
      worldScale,
      stages,
      entities,
      dialogues,
      events,
      bindings,
    },
    diagnostics
  );
  if (diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
    return { draft: null, diagnostics };
  }

  return {
    draft: {
      schemaVersion: AI_MOD_DRAFT_SCHEMA_VERSION,
      kind: AI_MOD_DRAFT_KIND,
      id,
      title,
      generationScope: {
        mode: AI_MOD_DRAFT_FIRST_STAGE_MODE,
        currentStageId: readOptionalString(rawGenerationScope.currentStageId),
      },
      themeFrame: readRecord(input.themeFrame),
      statMapping: readRecord(input.statMapping) as AiModDraft["statMapping"],
      skillMapping: readArray(input.skillMapping) as AiModDraft["skillMapping"],
      worldScale,
      stages,
      entities,
      actionLoops,
      dialogues,
      events,
      bindings,
      draftResidue: readArray(input.draftResidue) as AiModDraft["draftResidue"],
    },
    diagnostics,
  };
}

function validateEditableProjectContent(
  value: {
    worldScale: AiModDraft["worldScale"];
    stages: AiModDraft["stages"];
    entities: AiModDraft["entities"];
    dialogues: AiModDraft["dialogues"];
    events: AiModDraft["events"];
    bindings: AiModDraft["bindings"];
  },
  diagnostics: AiModDraftDiagnostic[]
): void {
  if (value.worldScale.buildings.length === 0) {
    diagnostics.push(
      createAiModDraftError(
        "worldScale.buildings",
        "At least one building is required for an editable project."
      )
    );
  }
  if (value.entities.player == null) {
    diagnostics.push(
      createAiModDraftError(
        "entities.player",
        "A player entity is required for an editable project."
      )
    );
  }
  if (value.entities.people.length === 0) {
    diagnostics.push(
      createAiModDraftError(
        "entities.people",
        "At least one non-player person is required for an editable project."
      )
    );
  }
  if (value.stages.length === 0) {
    diagnostics.push(
      createAiModDraftError("stages", "At least one stage is required.")
    );
  }
  if (value.dialogues.length === 0) {
    diagnostics.push(
      createAiModDraftError("dialogues", "At least one dialogue is required.")
    );
  }
  if (value.events.length === 0) {
    diagnostics.push(
      createAiModDraftError("events", "At least one event is required.")
    );
  }
  if (value.bindings.length === 0) {
    diagnostics.push(
      createAiModDraftError(
        "bindings",
        "At least one event binding is required for editor navigation."
      )
    );
  }
}

function normalizeWorldScale(value: unknown): AiModDraft["worldScale"] {
  const record = readRecord(value);
  const city = isRecord(record.city)
    ? {
        id: readOptionalString(record.city.id) || "city.generated",
        name: readOptionalString(record.city.name) || "Generated City",
      }
    : undefined;
  return {
    city,
    buildings: readFirstArray(
      record.buildings,
      record.houses,
      record.locations,
      record.places
    ) as AiModDraft["worldScale"]["buildings"],
  };
}

function normalizeEntities(value: unknown): AiModDraft["entities"] {
  const record = readRecord(value);
  const player = readFirstRecord(
    record.player,
    record.playerCharacter,
    record.protagonist,
    record.mainCharacter
  );
  return {
    player: player == null ? undefined : (player as AiModDraft["entities"]["player"]),
    people: readFirstArray(
      record.people,
      record.npcs,
      record.nonPlayerPeople,
      record.supportingCharacters,
      record.characters
    ) as AiModDraft["entities"]["people"],
  };
}

function readRequiredString(
  value: unknown,
  path: string,
  diagnostics: AiModDraftDiagnostic[]
): string {
  const normalized = readOptionalString(value);
  if (normalized.length === 0) {
    diagnostics.push(createAiModDraftError(path, `${path} is required.`));
  }
  return normalized;
}

function readOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readFirstArray(...values: unknown[]): unknown[] {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
}

function readFirstRecord(...values: unknown[]): Record<string, unknown> | null {
  for (const value of values) {
    if (isRecord(value)) {
      return value;
    }
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}
