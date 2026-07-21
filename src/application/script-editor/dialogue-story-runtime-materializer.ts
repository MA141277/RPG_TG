import type {
  RuntimeDialogueDefinition,
  RuntimeDialogueNode,
} from "../../domain/dialogue";
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
  "dialogues" | "storyNodes" | "textEntries"
>;

export type ScriptEditorDialogueStoryMaterializerResult = {
  dialogues: RuntimeDialogueDefinition[] | null;
  textEntries: Record<string, string> | null;
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[];
};

export function materializeScriptEditorDialogueStoryRuntime(
  input: ScriptEditorDialogueStoryMaterializerInput
): ScriptEditorDialogueStoryMaterializerResult {
  const diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[] = [];
  const textEntries = mapTextEntries(input.textEntries, diagnostics);
  const dialogues = materializeDialogues(input, diagnostics);

  return {
    dialogues: diagnostics.length === 0 ? dialogues : null,
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

function materializeDialogues(
  input: ScriptEditorDialogueStoryMaterializerInput,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): RuntimeDialogueDefinition[] {
  const storyNodeIds = new Set(input.storyNodes.map((storyNode) => storyNode.id));
  const textEntryIds = new Set(input.textEntries.map((entry) => entry.id));
  const loweredDialogues: RuntimeDialogueDefinition[] = [];
  const dialogueIds = new Set<string>();

  for (const [index, storyNode] of input.storyNodes.entries()) {
    appendUnsupportedStoryNodeDiagnostics(storyNode, index, diagnostics);
  }

  for (const [dialogueIndex, dialogue] of input.dialogues.entries()) {
    const runtimeDialogues = lowerDialogueToRuntimeDialogues(
      dialogue,
      dialogueIndex,
      storyNodeIds,
      textEntryIds,
      diagnostics
    );
    if (runtimeDialogues == null) {
      continue;
    }

    for (const runtimeDialogue of runtimeDialogues) {
      if (dialogueIds.has(runtimeDialogue.id)) {
        diagnostics.push({
          code: "duplicate-id",
          fieldPath: `project.dialogues[${dialogueIndex}].id`,
          message: `Dialogue "${dialogue.id}" lowers to duplicate runtime dialogue id "${runtimeDialogue.id}".`,
        });
        continue;
      }
      dialogueIds.add(runtimeDialogue.id);
      loweredDialogues.push(runtimeDialogue);
    }
  }

  return loweredDialogues;
}

function appendUnsupportedStoryNodeDiagnostics(
  storyNode: ScriptEditorStoryNodeRecord,
  index: number,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): void {
  const relatedDialogueIds = storyNode.relatedDialogueIds ?? [];
  const relatedEventIds = storyNode.relatedEventIds ?? [];
  const relatedPersonIds = storyNode.relatedPersonIds ?? [];
  if (
    relatedDialogueIds.length > 0 ||
    relatedEventIds.length > 0 ||
    relatedPersonIds.length > 0
  ) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.storyNodes[${index}]`,
      message:
        "Story node relation lowering is not supported in this bounded dialogue export slice.",
    });
  }
}

function lowerDialogueToRuntimeDialogues(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  storyNodeIds: Set<string>,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): RuntimeDialogueDefinition[] | null {
  if (
    dialogue.storyNodeId != null &&
    dialogue.storyNodeId.length > 0 &&
    !storyNodeIds.has(dialogue.storyNodeId)
  ) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].storyNodeId`,
      message: `Dialogue "${dialogue.id}" references missing story node "${dialogue.storyNodeId}".`,
    });
    return null;
  }

  const nodes = dialogue.nodes ?? [];
  if (nodes.length === 0) {
    const fallbackDialogue = lowerDialogueFallbackRuntimeDialogue(
      dialogue,
      dialogueIndex,
      textEntryIds,
      diagnostics
    );
    return fallbackDialogue == null ? null : [fallbackDialogue];
  }

  const nodeDialogueIds = mapDialogueNodeRuntimeIds(
    dialogue,
    dialogueIndex,
    nodes,
    diagnostics
  );
  const runtimeDialogues: RuntimeDialogueDefinition[] = [];

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

    const runtimeDialogueId = nodeDialogueIds.get(node.id);
    if (runtimeDialogueId == null) {
      continue;
    }

    const runtimeNodes = lowerDialogueNodeRuntimeNodes(
      dialogueIndex,
      node,
      nodeIndex,
      nodes,
      nodeDialogueIds,
      diagnostics
    );
    if (runtimeNodes.length === 0) {
      continue;
    }

    runtimeDialogues.push({
      id: runtimeDialogueId,
      name:
        nodeIndex === 0
          ? dialogue.title || dialogue.id
          : `${dialogue.title || dialogue.id} / ${node.id}`,
      nodes: runtimeNodes,
    });
  }

  if ((dialogue.followUps ?? []).length > 0) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.dialogues[${dialogueIndex}].followUps`,
      message:
        "Dialogue follow-up lowering is not supported in this bounded dialogue export slice.",
    });
  }

  return runtimeDialogues;
}

function lowerDialogueFallbackRuntimeDialogue(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): RuntimeDialogueDefinition | null {
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
    id: dialogue.id,
    name: dialogue.title || dialogue.id,
    nodes: [
      {
        type: "dialogue",
        characterId: firstParticipantOrHero(dialogue),
        side: "center",
        textId: fallbackTextId,
      },
    ],
  };
}

function mapDialogueNodeRuntimeIds(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  nodes: ScriptEditorDialogueNodeRecord[],
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): Map<string, string> {
  const nodeDialogueIds = new Map<string, string>();
  const rootDialogueId = dialogue.id;

  for (const [nodeIndex, node] of nodes.entries()) {
    if (typeof node.id !== "string" || node.id.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].id`,
        message: "Dialogue node export requires a non-empty id.",
      });
      continue;
    }
    if (nodeDialogueIds.has(node.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].id`,
        message: `Duplicate dialogue node id "${node.id}" cannot be lowered into runtime dialogues.`,
      });
      continue;
    }

    nodeDialogueIds.set(
      node.id,
      nodeIndex === 0 ? rootDialogueId : `${rootDialogueId}.${node.id}`
    );
  }

  return nodeDialogueIds;
}

function lowerDialogueNodeRuntimeNodes(
  dialogueIndex: number,
  node: ScriptEditorDialogueNodeRecord,
  nodeIndex: number,
  nodes: ScriptEditorDialogueNodeRecord[],
  nodeDialogueIds: Map<string, string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): RuntimeDialogueNode[] {
  if (node.nodeType === "choice") {
    const targetDialogueId = resolveDialogueNodeTargetDialogueId(
      dialogueIndex,
      nodeIndex,
      "choiceTargetNodeId",
      typeof node.choiceTargetNodeId === "string" ? node.choiceTargetNodeId : "",
      nodeDialogueIds,
      diagnostics
    );
    if (targetDialogueId == null) {
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
            nextDialogueId: targetDialogueId,
          },
        ],
      },
    ];
  }

  const runtimeNodes: RuntimeDialogueNode[] = [];

  if (node.nodeType === "narration") {
    runtimeNodes.push({ type: "narration", textId: node.textId });
  } else {
    runtimeNodes.push({
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
    const targetDialogueId = resolveDialogueNodeTargetDialogueId(
      dialogueIndex,
      nodeIndex,
      "nextNodeId",
      targetNodeId,
      nodeDialogueIds,
      diagnostics
    );
    if (targetDialogueId != null) {
      runtimeNodes.push({ type: "jump", nextDialogueId: targetDialogueId });
    }
  }

  return runtimeNodes;
}

function resolveDialogueNodeTargetDialogueId(
  dialogueIndex: number,
  nodeIndex: number,
  field: "nextNodeId" | "choiceTargetNodeId",
  targetNodeId: string,
  nodeDialogueIds: Map<string, string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): string | null {
  const targetDialogueId = nodeDialogueIds.get(targetNodeId);
  if (targetDialogueId == null) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].${field}`,
      message: `Dialogue node references missing dialogue node target "${targetNodeId}".`,
    });
    return null;
  }

  return targetDialogueId;
}

function firstParticipantOrHero(dialogue: ScriptEditorDialogueRecord): string {
  const firstParticipant = dialogue.participantPersonIds?.find(
    (participantId) => participantId.length > 0
  );
  return firstParticipant ?? "person.hero";
}
