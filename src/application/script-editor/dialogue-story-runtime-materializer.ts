import type { ActionNode, SceneDefinition } from "../../domain/action";
import type {
  ScriptEditorDialogueRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorStoryNodeRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";

export type ScriptEditorDialogueStoryMaterializerDiagnostic = {
  code:
    | "missing-field"
    | "duplicate-id"
    | "missing-reference"
    | "unsupported-lowering";
  fieldPath: string;
  message: string;
};

export type ScriptEditorDialogueStoryMaterializerInput = Pick<
  ScriptEditorProjectDefinition,
  "dialogues" | "storyNodes" | "scenes" | "textEntries"
>;

export type ScriptEditorDialogueStoryMaterializerResult = {
  scenes: SceneDefinition[] | null;
  textEntries: Record<string, string> | null;
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[];
};

export function materializeScriptEditorDialogueStoryRuntime(
  input: ScriptEditorDialogueStoryMaterializerInput
): ScriptEditorDialogueStoryMaterializerResult {
  const diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[] = [];
  const textEntries = mapTextEntries(input.textEntries, diagnostics);
  const scenes = materializeScenes(input, diagnostics);

  return {
    scenes: diagnostics.length === 0 ? scenes : null,
    textEntries: diagnostics.length === 0 ? textEntries : null,
    diagnostics,
  };
}

function mapTextEntries(
  textEntries: ScriptEditorTextEntryRecord[],
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): Record<string, string> {
  const exportedTextEntries: Record<string, string> = {};

  for (const [index, entry] of textEntries.entries()) {
    if (typeof entry.text !== "string" || entry.text.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.textEntries[${index}].text`,
        message: "Runtime export requires every text entry to provide a non-empty text string.",
      });
      continue;
    }

    if (Object.hasOwn(exportedTextEntries, entry.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.textEntries[${index}].id`,
        message: `Duplicate text entry id "${entry.id}" cannot be lowered into text-entries.json.`,
      });
      continue;
    }

    exportedTextEntries[entry.id] = entry.text;
  }

  return exportedTextEntries;
}

function materializeScenes(
  input: ScriptEditorDialogueStoryMaterializerInput,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): SceneDefinition[] {
  const storyNodeIds = new Set(input.storyNodes.map((storyNode) => storyNode.id));
  const textEntryIds = new Set(input.textEntries.map((entry) => entry.id));
  const loweredScenes: SceneDefinition[] = [];
  const sceneIds = new Set<string>();

  for (const [index, scene] of input.scenes.entries()) {
    if (typeof scene.id !== "string" || scene.id.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.scenes[${index}].id`,
        message: "Runtime scene export requires every imported scene to provide a non-empty id.",
      });
      continue;
    }
    if (sceneIds.has(scene.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.scenes[${index}].id`,
        message: `Duplicate scene id "${scene.id}" cannot be exported.`,
      });
      continue;
    }
    sceneIds.add(scene.id);
    loweredScenes.push(scene as unknown as SceneDefinition);
  }

  for (const [index, storyNode] of input.storyNodes.entries()) {
    appendUnsupportedStoryNodeDiagnostics(storyNode, index, diagnostics);
  }

  for (const [dialogueIndex, dialogue] of input.dialogues.entries()) {
    const scene = lowerDialogueToScene(
      dialogue,
      dialogueIndex,
      storyNodeIds,
      textEntryIds,
      diagnostics
    );
    if (scene == null) {
      continue;
    }
    if (sceneIds.has(scene.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.dialogues[${dialogueIndex}].id`,
        message: `Dialogue "${dialogue.id}" lowers to duplicate scene id "${scene.id}".`,
      });
      continue;
    }
    sceneIds.add(scene.id);
    loweredScenes.push(scene);
  }

  return loweredScenes;
}

function appendUnsupportedStoryNodeDiagnostics(
  storyNode: ScriptEditorStoryNodeRecord,
  index: number,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): void {
  const relatedDialogueIds = storyNode.relatedDialogueIds ?? [];
  const relatedEventIds = storyNode.relatedEventIds ?? [];
  const relatedPersonIds = storyNode.relatedPersonIds ?? [];
  if (relatedDialogueIds.length > 0 || relatedEventIds.length > 0 || relatedPersonIds.length > 0) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.storyNodes[${index}]`,
      message:
        "Story node relation lowering is not supported in this minimal narrative export slice.",
    });
  }
}

function lowerDialogueToScene(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  storyNodeIds: Set<string>,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): SceneDefinition | null {
  if (dialogue.storyNodeId != null && dialogue.storyNodeId.length > 0 && !storyNodeIds.has(dialogue.storyNodeId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].storyNodeId`,
      message: `Dialogue "${dialogue.id}" references missing story node "${dialogue.storyNodeId}".`,
    });
    return null;
  }

  const actions: ActionNode[] = [];
  const nodes = dialogue.nodes ?? [];
  for (const [nodeIndex, node] of nodes.entries()) {
    if (node.nodeType === "choice") {
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}]`,
        message:
          "Choice dialogue nodes require a later branching narrative lowering step before runtime export.",
      });
      continue;
    }
    if (typeof node.textId !== "string" || node.textId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].textId`,
        message: "Dialogue node export requires a non-empty textId.",
      });
      continue;
    }
    if (!textEntryIds.has(node.textId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].textId`,
        message: `Dialogue node references missing text entry "${node.textId}".`,
      });
      continue;
    }

    if (node.nodeType === "narration") {
      actions.push({ type: "narration", textId: node.textId });
      continue;
    }

    actions.push({
      type: "dialogue",
      characterId: node.speakerPersonId || "person.hero",
      side: "center",
      textId: node.textId,
    });
  }

  if (actions.length === 0) {
    const fallbackTextId = `text.${dialogue.id.replace(/^dialogue\./, "")}`;
    if (!textEntryIds.has(fallbackTextId)) {
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes`,
        message:
          `Dialogue "${dialogue.id}" has no lowerable nodes and no matching fallback text entry "${fallbackTextId}".`,
      });
      return null;
    }
    actions.push({
      type: "dialogue",
      characterId: firstParticipantOrHero(dialogue),
      side: "center",
      textId: fallbackTextId,
    });
  }

  if ((dialogue.followUps ?? []).length > 0) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.dialogues[${dialogueIndex}].followUps`,
      message:
        "Dialogue follow-up lowering is not supported in this minimal narrative export slice.",
    });
  }

  return {
    id: `scene.${dialogue.id}`,
    name: dialogue.title || dialogue.id,
    actions,
  };
}

function firstParticipantOrHero(dialogue: ScriptEditorDialogueRecord): string {
  const firstParticipant = dialogue.participantPersonIds?.find(
    (participantId) => participantId.length > 0
  );
  return firstParticipant ?? "person.hero";
}
