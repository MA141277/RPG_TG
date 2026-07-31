import type {
  RuntimeDialogueCastMember,
  RuntimeDialogueDefinition,
  RuntimeDialogueNode,
} from "../../../domain/dialogue";
import type {
  ScriptEditorDialogueCastRecord,
  ScriptEditorDialogueRecord,
  ScriptEditorDialogueNodeRecord,
  ScriptEditorDialogueOptionRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorStoryNodeRecord,
  ScriptEditorTextEntryRecord,
} from "../domain/script-editor-project";

export type ScriptEditorDialogueStoryMaterializerDiagnostic = {
  code:
    | "missing-field"
    | "invalid-field"
    | "duplicate-id"
    | "missing-reference"
    | "unsupported-lowering";
  fieldPath: string;
  message: string;
};

export type ScriptEditorDialogueStoryMaterializerInput = Pick<
  ScriptEditorProjectDefinition,
  "dialogues" | "events" | "people" | "storyNodes" | "textEntries"
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
  const eventIds = new Set(input.events.map((eventRecord) => eventRecord.id));
  const personIds = new Set(input.people.map((personRecord) => personRecord.id));
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
      eventIds,
      personIds,
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
  eventIds: Set<string>,
  personIds: Set<string>,
  storyNodeIds: Set<string>,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): RuntimeDialogueDefinition[] | null {
  if (shouldPreferSingleScreenDialogue(dialogue)) {
    const runtimeDialogue = lowerSingleScreenDialogueToRuntimeDialogue(
      dialogue,
      dialogueIndex,
      eventIds,
      personIds,
      storyNodeIds,
      textEntryIds,
      diagnostics
    );
    return runtimeDialogue == null ? null : [runtimeDialogue];
  }

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
    if (
      node.nodeType !== "background" &&
      node.nodeType !== "music" &&
      (typeof node.textId !== "string" || node.textId.length === 0)
    ) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].textId`,
        message: "Dialogue node export requires a non-empty textId.",
      });
      continue;
    }
    if (
      node.nodeType !== "background" &&
      node.nodeType !== "music" &&
      !textEntryIds.has(node.textId)
    ) {
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

function shouldPreferSingleScreenDialogue(
  dialogue: ScriptEditorDialogueRecord
): boolean {
  return (
    dialogue.mode != null ||
    dialogue.textId != null ||
    dialogue.speakerPersonId != null ||
    dialogue.cast != null ||
    dialogue.nextEventId != null ||
    dialogue.options != null ||
    (dialogue.nodes?.length ?? 0) === 0
  );
}

function lowerSingleScreenDialogueToRuntimeDialogue(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  eventIds: Set<string>,
  personIds: Set<string>,
  storyNodeIds: Set<string>,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): RuntimeDialogueDefinition | null {
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

  const mode = dialogue.mode === "choice" ? "choice" : "linear";
  const textId = typeof dialogue.textId === "string" ? dialogue.textId.trim() : "";
  const title = typeof dialogue.title === "string" ? dialogue.title.trim() : "";
  const speakerPersonId =
    typeof dialogue.speakerPersonId === "string"
      ? dialogue.speakerPersonId.trim()
      : "";
  const cast = (dialogue.cast ?? []).map(toRuntimeDialogueCastMember);
  const hasValidSpeakerReference =
    speakerPersonId.length > 0 && personIds.has(speakerPersonId);

  if (title.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.dialogues[${dialogueIndex}].title`,
      message: "Single-screen dialogue export requires a non-empty title.",
    });
  }

  if (textId.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.dialogues[${dialogueIndex}].textId`,
      message: "Single-screen dialogue export requires a non-empty textId.",
    });
  } else if (!textEntryIds.has(textId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].textId`,
      message: `Dialogue "${dialogue.id}" references missing text entry "${textId}".`,
    });
  }

  if (speakerPersonId.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.dialogues[${dialogueIndex}].speakerPersonId`,
      message: "Single-screen dialogue export requires a speakerPersonId.",
    });
  } else if (!personIds.has(speakerPersonId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].speakerPersonId`,
      message: `Dialogue "${dialogue.id}" references missing speaker person "${speakerPersonId}".`,
    });
  }

  if (cast.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.dialogues[${dialogueIndex}].cast`,
      message: "Single-screen dialogue export requires at least one cast member.",
    });
  } else {
    const sideCounts = new Set<string>();
    let speakerInCast = false;
    for (const [castIndex, member] of cast.entries()) {
      if (member.characterId.length === 0) {
        diagnostics.push({
          code: "missing-field",
          fieldPath: `project.dialogues[${dialogueIndex}].cast[${castIndex}].personId`,
          message: "Dialogue cast entries require a non-empty personId.",
        });
      } else if (!personIds.has(member.characterId)) {
        diagnostics.push({
          code: "missing-reference",
          fieldPath: `project.dialogues[${dialogueIndex}].cast[${castIndex}].personId`,
          message: `Dialogue cast references missing person "${member.characterId}".`,
        });
      }
      if (sideCounts.has(member.side)) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.dialogues[${dialogueIndex}].cast[${castIndex}].side`,
          message: "Dialogue cast side values must be unique.",
        });
      }
      sideCounts.add(member.side);
      if (member.characterId === speakerPersonId) {
        speakerInCast = true;
      }
    }
    if (cast.length > 2) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `project.dialogues[${dialogueIndex}].cast`,
        message: "Dialogue cast export currently supports at most two cast members.",
      });
    }
    if (hasValidSpeakerReference && !speakerInCast) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.dialogues[${dialogueIndex}].speakerPersonId`,
        message: "Dialogue speakerPersonId must be included in cast.",
      });
    }
  }

  const normalizedOptions = (dialogue.options ?? []).map(
    (option) => toRuntimeDialogueChoiceOption(option)
  );
  const migratedLegacyFollowUpEventId = resolveLegacyDialogueFollowUpEventId(
    dialogue,
    dialogueIndex,
    mode,
    diagnostics
  );
  if (mode === "linear" && normalizedOptions.length > 0) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.dialogues[${dialogueIndex}].options`,
      message: "Linear dialogues must not define choice options.",
    });
  }
  if (mode === "choice" && normalizedOptions.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.dialogues[${dialogueIndex}].options`,
      message: "Choice dialogues require at least one option.",
    });
  }

  for (const [optionIndex, option] of normalizedOptions.entries()) {
    if (option.labelTextId == null || option.labelTextId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].options[${optionIndex}].textId`,
        message: "Dialogue options require a non-empty textId.",
      });
      continue;
    }
    if (!textEntryIds.has(option.labelTextId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.dialogues[${dialogueIndex}].options[${optionIndex}].textId`,
        message: `Dialogue option references missing text entry "${option.labelTextId}".`,
      });
    }
    if (option.nextEventId == null || option.nextEventId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].options[${optionIndex}].nextEventId`,
        message: "Dialogue options require a nextEventId.",
      });
    } else if (!eventIds.has(option.nextEventId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.dialogues[${dialogueIndex}].options[${optionIndex}].nextEventId`,
        message: `Dialogue option references missing event "${option.nextEventId}".`,
      });
    }
  }

  if (
    mode === "linear" &&
    resolveLinearDialogueNextEventId(dialogue, migratedLegacyFollowUpEventId) != null &&
    !eventIds.has(resolveLinearDialogueNextEventId(dialogue, migratedLegacyFollowUpEventId) as string)
  ) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].nextEventId`,
      message: `Dialogue "${dialogue.id}" references missing next event "${resolveLinearDialogueNextEventId(dialogue, migratedLegacyFollowUpEventId)}".`,
    });
  }

  if (diagnostics.some((diagnostic) => diagnostic.fieldPath.startsWith(`project.dialogues[${dialogueIndex}]`))) {
    return null;
  }

  return {
    id: dialogue.id,
    name: dialogue.title || dialogue.id,
    screen:
      mode === "choice"
        ? {
            mode,
            textId,
            speakerCharacterId: speakerPersonId,
            cast,
            options: normalizedOptions,
          }
        : {
            mode,
            textId,
            speakerCharacterId: speakerPersonId,
            cast,
            ...(resolveLinearDialogueNextEventId(
              dialogue,
              migratedLegacyFollowUpEventId
            ) == null
              ? {}
              : {
                  nextEventId: resolveLinearDialogueNextEventId(
                    dialogue,
                    migratedLegacyFollowUpEventId
                  ) as string,
                }),
          },
  };
}

function resolveLinearDialogueNextEventId(
  dialogue: ScriptEditorDialogueRecord,
  migratedLegacyFollowUpEventId: string | null
): string | null {
  const directNextEventId =
    typeof dialogue.nextEventId === "string" ? dialogue.nextEventId.trim() : "";
  if (directNextEventId.length > 0) {
    return directNextEventId;
  }

  return migratedLegacyFollowUpEventId;
}

function resolveLegacyDialogueFollowUpEventId(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  mode: "linear" | "choice",
  diagnostics: ScriptEditorDialogueStoryMaterializerDiagnostic[]
): string | null {
  const followUps = dialogue.followUps ?? [];
  if (followUps.length === 0) {
    return null;
  }

  const directNextEventId =
    typeof dialogue.nextEventId === "string" ? dialogue.nextEventId.trim() : "";
  const safeEventFollowUp =
    followUps.length === 1 &&
    followUps[0]?.targetFamily === "event" &&
    typeof followUps[0].targetId === "string" &&
    followUps[0].targetId.trim().length > 0
      ? followUps[0].targetId.trim()
      : null;

  if (
    mode === "linear" &&
    safeEventFollowUp != null &&
    (directNextEventId.length === 0 || directNextEventId === safeEventFollowUp)
  ) {
    return safeEventFollowUp;
  }

  diagnostics.push({
    code: "unsupported-lowering",
    fieldPath: `project.dialogues[${dialogueIndex}].followUps`,
    message:
      `Dialogue "${dialogue.id}" uses legacy followUps that cannot be safely migrated onto the single-screen main path.`,
  });
  return null;
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

  if (node.nodeType === "background") {
    const backgroundId =
      typeof node.backgroundId === "string" ? node.backgroundId.trim() : "";
    if (backgroundId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].backgroundId`,
        message: "Background dialogue node export requires a non-empty backgroundId.",
      });
      return [];
    }
    runtimeNodes.push({ type: "background", backgroundId });
  } else if (node.nodeType === "music") {
    const musicId = typeof node.musicId === "string" ? node.musicId.trim() : "";
    if (musicId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].musicId`,
        message: "Music dialogue node export requires a non-empty musicId.",
      });
      return [];
    }
    runtimeNodes.push({
      type: "music",
      musicId,
      ...(node.loop === true ? { loop: true } : {}),
    });
  } else if (node.nodeType === "narration") {
    runtimeNodes.push({ type: "narration", textId: node.textId });
  } else {
    const side = readDialogueSide(node.side);
    const portraitId =
      typeof node.portraitId === "string" ? node.portraitId.trim() : "";
    runtimeNodes.push({
      type: "dialogue",
      characterId: node.speakerPersonId || "person.hero",
      side: side ?? "center",
      ...(portraitId.length === 0 ? {} : { portraitId }),
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

function readDialogueSide(value: unknown): "left" | "right" | "center" | null {
  return value === "left" || value === "right" || value === "center"
    ? value
    : null;
}

function toRuntimeDialogueCastMember(
  member: ScriptEditorDialogueCastRecord
): RuntimeDialogueCastMember {
  return {
    characterId:
      typeof member.personId === "string" ? member.personId.trim() : "",
    side: readDialogueSide(member.side) ?? "left",
  };
}

function toRuntimeDialogueChoiceOption(
  option: ScriptEditorDialogueOptionRecord
) {
  return {
    id: typeof option.id === "string" ? option.id.trim() : "option",
    labelTextId:
      typeof option.textId === "string" ? option.textId.trim() : "",
    nextEventId:
      typeof option.nextEventId === "string" ? option.nextEventId.trim() : "",
  };
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
