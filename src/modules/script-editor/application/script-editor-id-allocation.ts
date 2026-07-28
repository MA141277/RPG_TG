import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";

const SCRIPT_EDITOR_CANONICAL_ID_SEQUENCE_WIDTH = 4;

const SCRIPT_EDITOR_CANONICAL_ID_FAMILY_CODE = {
  people: 11,
  portraits: 12,
  portraitVariants: 13,
  cities: 21,
  buildings: 22,
  buildingArrangements: 23,
  settlements: 24,
  progressTracks: 25,
  progressTrackBindings: 26,
  quests: 31,
  dialogues: 41,
  minigames: 42,
  flows: 43,
  textEntries: 44,
  storyNodes: 45,
  events: 46,
  eventBindings: 47,
} as const;

export type ScriptEditorCanonicalIdFamily =
  keyof typeof SCRIPT_EDITOR_CANONICAL_ID_FAMILY_CODE;

type EntityLike = { id: string };

export function createDefaultScriptEditorCanonicalId(
  family: ScriptEditorCanonicalIdFamily,
  index: number
): string {
  const familyCode = SCRIPT_EDITOR_CANONICAL_ID_FAMILY_CODE[family];
  const sequenceBase = familyCode * 10 ** SCRIPT_EDITOR_CANONICAL_ID_SEQUENCE_WIDTH;
  return String(sequenceBase + index + 1);
}

export function allocateNextScriptEditorCanonicalId(
  family: ScriptEditorCanonicalIdFamily,
  records: readonly EntityLike[]
): string {
  const familyCode = SCRIPT_EDITOR_CANONICAL_ID_FAMILY_CODE[family];
  const sequenceBase = familyCode * 10 ** SCRIPT_EDITOR_CANONICAL_ID_SEQUENCE_WIDTH;
  let nextNumericId = sequenceBase + 1;

  for (const record of records) {
    const numericId = readCanonicalNumericId(record.id);
    if (numericId == null) {
      continue;
    }

    const numericFamilyCode = Math.floor(
      numericId / 10 ** SCRIPT_EDITOR_CANONICAL_ID_SEQUENCE_WIDTH
    );
    if (numericFamilyCode !== familyCode) {
      continue;
    }

    nextNumericId = Math.max(nextNumericId, numericId + 1);
  }

  return String(nextNumericId);
}

export function allocateNextScriptEditorProjectCanonicalId(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorCanonicalIdFamily
): string {
  switch (family) {
    case "people":
      return allocateNextScriptEditorCanonicalId(family, project.people);
    case "portraits":
      return allocateNextScriptEditorCanonicalId(family, project.portraits);
    case "portraitVariants":
      return allocateNextScriptEditorCanonicalId(family, project.portraitVariants);
    case "cities":
      return allocateNextScriptEditorCanonicalId(family, project.cities);
    case "buildings":
      return allocateNextScriptEditorCanonicalId(family, project.buildings);
    case "buildingArrangements":
      return allocateNextScriptEditorCanonicalId(
        family,
        project.buildingArrangements
      );
    case "settlements":
      return allocateNextScriptEditorCanonicalId(family, project.settlements);
    case "progressTracks":
      return allocateNextScriptEditorCanonicalId(family, project.progressTracks ?? []);
    case "progressTrackBindings":
      return allocateNextScriptEditorCanonicalId(
        family,
        project.progressTrackBindings ?? []
      );
    case "quests":
      return allocateNextScriptEditorCanonicalId(family, project.quests);
    case "dialogues":
      return allocateNextScriptEditorCanonicalId(family, project.dialogues);
    case "minigames":
      return allocateNextScriptEditorCanonicalId(family, project.minigames);
    case "flows":
      return allocateNextScriptEditorCanonicalId(family, project.flows);
    case "textEntries":
      return allocateNextScriptEditorCanonicalId(family, project.textEntries);
    case "storyNodes":
      return allocateNextScriptEditorCanonicalId(family, project.storyNodes);
    case "events":
      return allocateNextScriptEditorCanonicalId(family, project.events);
    case "eventBindings":
      return allocateNextScriptEditorCanonicalId(family, project.eventBindings);
  }
}

function readCanonicalNumericId(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const numericId = Number(value);
  return Number.isSafeInteger(numericId) ? numericId : null;
}
