import {
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
  type ScriptEditorProjectDefinition,
} from "../../domain/script-editor-project";
import { createDraftScriptEditorProjectCompletionState } from "../script-editor/project-completion-state";
import type { AiModDraft } from "./ai-mod-draft-schema";
import type { AiModDraftDiagnostic } from "./ai-mod-draft-diagnostics";
import { collectAiDraftResidue } from "./ai-draft-residue";
import {
  mapAiDraftBuildings,
  mapAiDraftCities,
  mapAiDraftPeople,
} from "./ai-draft-world-mapper";
import {
  mapAiDraftDialogues,
  mapAiDraftEventBindings,
  mapAiDraftEvents,
  mapAiDraftStoryNodes,
  mapAiDraftTextEntries,
} from "./ai-draft-narrative-mapper";

export function convertAiModDraftToScriptEditorProject(draft: AiModDraft): {
  project: ScriptEditorProjectDefinition;
  diagnostics: AiModDraftDiagnostic[];
} {
  const slug = createProjectSlug(draft.id);
  const cityId = readString(draft.worldScale.city?.id, "city.generated");
  const playerId = readString(draft.entities.player?.id, "player");
  const firstBuildingId = readString(draft.worldScale.buildings[0]?.id, "");
  const currentStageId =
    draft.generationScope.currentStageId ?? draft.stages[0]?.id ?? `chapter.${slug}`;

  return {
    diagnostics: [],
    project: {
      schemaVersion: SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
      kind: SCRIPT_EDITOR_PROJECT_KIND,
      id: `project.${slug}`,
      title: draft.title,
      description: "Generated from AI Mod Draft v1.",
      completionState: createDraftScriptEditorProjectCompletionState(),
      storyPack: {
        id: `story-pack.${slug}`,
        title: draft.title,
        description: readString(draft.themeFrame.premise, draft.title),
        aiDraftResidue: collectAiDraftResidue(draft),
        scenarioProfile: {
          id: `scenario.${slug}`,
          title: draft.title,
          playerCharacterId: playerId,
          chapterId: currentStageId,
          initialLocation: {
            mapId: "map.ai-mod-draft",
            cityId,
            ...(firstBuildingId.length === 0 ? {} : { houseId: firstBuildingId }),
            view: "city",
          },
        },
      },
      maps: [],
      people: mapAiDraftPeople(draft),
      cities: mapAiDraftCities(draft),
      buildings: mapAiDraftBuildings(draft),
      cityEntries: [],
      events: mapAiDraftEvents(draft),
      eventBindings: mapAiDraftEventBindings(draft),
      scenes: [],
      quests: [],
      activities: [],
      cards: [],
      valuables: [],
      cityNpcPools: [],
      houseAccessRefusalRules: [],
      houseModuleDefaults: {},
      cityPortraits: {},
      historicalCharacters: [],
      historicalCityRosters: [],
      historicalCharacterIdByCharacterId: {},
      dialogues: mapAiDraftDialogues(draft),
      minigames: [],
      storyNodes: mapAiDraftStoryNodes(draft),
      textEntries: mapAiDraftTextEntries(draft),
      conditionGroups: [],
      effectBundles: [],
    },
  };
}

function createProjectSlug(draftId: string): string {
  return draftId
    .replace(/^draft\./, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "ai-mod-draft";
}

function readString(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? fallback : trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}
