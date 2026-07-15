import type { ActionNode, SceneDefinition } from "../../domain/action";
import type {
  ScriptEditorDialogueRecord,
  ScriptEditorDialogueNodeRecord,
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
    const dialogueScenes = lowerDialogueToScenes(
      dialogue,
      dialogueIndex,
      storyNodeIds,
      textEntryIds,
      diagnostics
    );
    if (dialogueScenes == null) {
      continue;
    }

    for (const scene of dialogueScenes) {
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

function lowerDialogueToScenes(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  storyNodeIds: Set<string>,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): SceneDefinition[] | null {
  if (dialogue.storyNodeId != null && dialogue.storyNodeId.length > 0 && !storyNodeIds.has(dialogue.storyNodeId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].storyNodeId`,
      message: `Dialogue "${dialogue.id}" references missing story node "${dialogue.storyNodeId}".`,
    });
    return null;
  }

  const nodes = dialogue.nodes ?? [];
  if (nodes.length === 0) {
    const fallbackScene = lowerDialogueFallbackScene(dialogue, dialogueIndex, textEntryIds, diagnostics);
    return fallbackScene == null ? null : [fallbackScene];
  }

  const nodeSceneIds = mapDialogueNodeSceneIds(dialogue, dialogueIndex, nodes, diagnostics);
  const scenes: SceneDefinition[] = [];

  for (const [nodeIndex, node] of nodes.entries()) {
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

    const sceneId = nodeSceneIds.get(node.id);
    if (sceneId == null) {
      continue;
    }

    const actions = lowerDialogueNodeActions(
      dialogue,
      dialogueIndex,
      node,
      nodeIndex,
      nodes,
      nodeSceneIds,
      diagnostics
    );
    if (actions.length === 0) {
      continue;
    }

    scenes.push({
      id: sceneId,
      name: nodeIndex === 0 ? dialogue.title || dialogue.id : `${dialogue.title || dialogue.id} / ${node.id}`,
      actions,
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

  return scenes;
}

function lowerDialogueFallbackScene(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): SceneDefinition | null {
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

  return {
    id: `scene.${dialogue.id}`,
    name: dialogue.title || dialogue.id,
    actions: [
      {
        type: "dialogue",
        characterId: firstParticipantOrHero(dialogue),
        side: "center",
        textId: fallbackTextId,
      },
    ],
  };
}

function mapDialogueNodeSceneIds(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  nodes: ScriptEditorDialogueNodeRecord[],
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): Map<string, string> {
  const nodeSceneIds = new Map<string, string>();
  const rootSceneId = `scene.${dialogue.id}`;

  for (const [nodeIndex, node] of nodes.entries()) {
    if (typeof node.id !== "string" || node.id.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].id`,
        message: "Dialogue node export requires a non-empty id.",
      });
      continue;
    }
    if (nodeSceneIds.has(node.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].id`,
        message: `Duplicate dialogue node id "${node.id}" cannot be lowered into runtime scenes.`,
      });
      continue;
    }

    nodeSceneIds.set(
      node.id,
      nodeIndex === 0 ? rootSceneId : `${rootSceneId}.${node.id}`
    );
  }

  return nodeSceneIds;
}

function lowerDialogueNodeActions(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  node: ScriptEditorDialogueNodeRecord,
  nodeIndex: number,
  nodes: ScriptEditorDialogueNodeRecord[],
  nodeSceneIds: Map<string, string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): ActionNode[] {
  if (node.nodeType === "choice") {
    const targetSceneId = resolveDialogueNodeTargetSceneId(
      dialogueIndex,
      nodeIndex,
      "choiceTargetNodeId",
      typeof node.choiceTargetNodeId === "string" ? node.choiceTargetNodeId : "",
      nodeSceneIds,
      diagnostics
    );
    if (targetSceneId == null) {
      return [];
    }

    return [
      {
        type: "choice",
        promptTextId: node.textId,
        options: [
          {
            id: `${node.id}.choiceTarget`,
            labelTextId: node.textId,
            nextSceneId: targetSceneId,
          },
        ],
      },
    ];
  }

  const actions: ActionNode[] = [];

  if (node.nodeType === "narration") {
    actions.push({ type: "narration", textId: node.textId });
  } else {
    actions.push({
      type: "dialogue",
      characterId: node.speakerPersonId || "person.hero",
      side: "center",
      textId: node.textId,
    });
  }

  const explicitNextNodeId =
    typeof node.nextNodeId === "string" ? node.nextNodeId : "";
  const targetNodeId =
    explicitNextNodeId.length > 0 ? explicitNextNodeId : nodes[nodeIndex + 1]?.id;
  if (targetNodeId != null && targetNodeId.length > 0) {
    const targetSceneId = resolveDialogueNodeTargetSceneId(
      dialogueIndex,
      nodeIndex,
      "nextNodeId",
      targetNodeId,
      nodeSceneIds,
      diagnostics
    );
    if (targetSceneId != null) {
      actions.push({ type: "jump", nextSceneId: targetSceneId });
    }
  }

  return actions;
}

function resolveDialogueNodeTargetSceneId(
  dialogueIndex: number,
  nodeIndex: number,
  field: "nextNodeId" | "choiceTargetNodeId",
  targetNodeId: string,
  nodeSceneIds: Map<string, string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): string | null {
  const targetSceneId = nodeSceneIds.get(targetNodeId);
  if (targetSceneId == null) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].${field}`,
      message: `Dialogue node references missing dialogue node target "${targetNodeId}".`,
    });
    return null;
  }

  return targetSceneId;
}

function firstParticipantOrHero(dialogue: ScriptEditorDialogueRecord): string {
  const firstParticipant = dialogue.participantPersonIds?.find(
    (participantId) => participantId.length > 0
  );
  return firstParticipant ?? "person.hero";
}
