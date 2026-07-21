import type { ScriptEditorProjectDefinition } from "../../domain/script-editor-project";
import {
  generateAiModDraftFromTopic,
  type AiModDraftClientConfig,
} from "./ai-mod-draft-openai-client";
import type { AiModDraftDiagnostic } from "./ai-mod-draft-diagnostics";
import { normalizeAiModDraft } from "./ai-mod-draft-normalizer";
import { convertAiModDraftToScriptEditorProject } from "./ai-draft-to-script-editor-project";

export type AiModDraftGenerateDraft = typeof generateAiModDraftFromTopic;

export type AiModDraftTopicProjectResult = {
  project: ScriptEditorProjectDefinition;
  diagnostics: AiModDraftDiagnostic[];
};

export async function generateScriptEditorProjectFromAiTopic(input: {
  topic: string;
  config: AiModDraftClientConfig;
  generateDraft?: AiModDraftGenerateDraft | undefined;
}): Promise<AiModDraftTopicProjectResult> {
  const topic = input.topic.trim();
  if (topic.length === 0) {
    throw new Error("AI mod topic is required.");
  }

  const rawDraft = await (input.generateDraft ?? generateAiModDraftFromTopic)({
    topic,
    config: input.config,
  });
  logAiModDraftDebug("raw model JSON", rawDraft);

  const extractedDraft = extractAiModDraftPayload(rawDraft, topic);
  logAiModDraftDebug("extracted draft payload", extractedDraft);

  const normalized = normalizeAiModDraft(extractedDraft);
  logAiModDraftDebug("normalized draft", {
    diagnostics: normalized.diagnostics,
    summary:
      normalized.draft == null ? null : summarizeAiModDraft(normalized.draft),
    draft: normalized.draft,
  });
  if (normalized.draft == null) {
    throw new Error(formatBlockingDiagnostics(normalized.diagnostics));
  }

  const converted = convertAiModDraftToScriptEditorProject(normalized.draft);
  logAiModDraftDebug("converted script editor project", {
    diagnostics: converted.diagnostics,
    summary: summarizeScriptEditorProject(converted.project),
    project: converted.project,
  });
  if (
    converted.diagnostics.some((diagnostic) => diagnostic.severity === "error")
  ) {
    throw new Error(formatBlockingDiagnostics(converted.diagnostics));
  }

  return {
    project: converted.project,
    diagnostics: [...normalized.diagnostics, ...converted.diagnostics],
  };
}

const AI_MOD_DRAFT_WRAPPER_KEYS = [
  "draft",
  "aiModDraft",
  "ai_mod_draft",
  "modDraft",
  "result",
  "data",
  "output",
  "json",
] as const;

function extractAiModDraftPayload(value: unknown, topic: string): unknown {
  if (!isRecord(value)) {
    return value;
  }

  for (const key of AI_MOD_DRAFT_WRAPPER_KEYS) {
    const wrapped = value[key];
    if (!isRecord(wrapped)) {
      continue;
    }

    return withGeneratedDraftIdentity({
      schemaVersion: wrapped.schemaVersion ?? value.schemaVersion,
      kind: wrapped.kind ?? value.kind,
      id: wrapped.id ?? value.id,
      title: wrapped.title ?? value.title,
      generationScope: wrapped.generationScope ?? value.generationScope,
      ...wrapped,
    }, topic);
  }

  return withGeneratedDraftIdentity(value, topic);
}

function withGeneratedDraftIdentity(
  value: Record<string, unknown>,
  topic: string
): Record<string, unknown> {
  if (!looksLikeAiModDraft(value)) {
    return value;
  }

  return {
    ...value,
    id: readNonEmptyString(value.id) ?? `draft.${createTopicSlug(topic)}`,
    title: readNonEmptyString(value.title) ?? topic,
  };
}

function looksLikeAiModDraft(value: Record<string, unknown>): boolean {
  return (
    value.kind === "ai-mod-draft" ||
    value.schemaVersion === 1 ||
    isRecord(value.generationScope) ||
    isRecord(value.themeFrame) ||
    isRecord(value.worldScale) ||
    isRecord(value.entities) ||
    Array.isArray(value.stages) ||
    Array.isArray(value.dialogues) ||
    Array.isArray(value.events)
  );
}

function createTopicSlug(topic: string): string {
  const asciiSlug = topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (asciiSlug.length > 0) {
    return `topic-${asciiSlug}`;
  }

  return `topic-${Array.from(topic.trim())
    .map((character) => character.codePointAt(0)?.toString(36) ?? "")
    .filter(Boolean)
    .join("-")}`;
}

function readNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function formatBlockingDiagnostics(diagnostics: AiModDraftDiagnostic[]): string {
  const errors = diagnostics.filter((diagnostic) => diagnostic.severity === "error");
  if (errors.length === 0) {
    return "AI mod draft generation failed.";
  }
  return errors
    .map((diagnostic) => `${diagnostic.path}: ${diagnostic.message}`)
    .join("\n");
}

function logAiModDraftDebug(label: string, value: unknown): void {
  if (typeof window === "undefined") {
    return;
  }

  console.debug(`[AI Mod Draft] ${label}`, cloneConsoleValue(value));
}

function cloneConsoleValue(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function summarizeAiModDraft(draft: {
  id: string;
  title: string;
  worldScale: { buildings: unknown[] };
  entities: { player?: unknown; people: unknown[] };
  stages: unknown[];
  actionLoops: unknown[];
  dialogues: unknown[];
  events: unknown[];
  bindings: unknown[];
  draftResidue: unknown[];
}): Record<string, unknown> {
  return {
    id: draft.id,
    title: draft.title,
    hasPlayer: draft.entities.player != null,
    buildings: draft.worldScale.buildings.length,
    people: draft.entities.people.length,
    stages: draft.stages.length,
    actionLoops: draft.actionLoops.length,
    dialogues: draft.dialogues.length,
    events: draft.events.length,
    bindings: draft.bindings.length,
    draftResidue: draft.draftResidue.length,
  };
}

function summarizeScriptEditorProject(project: ScriptEditorProjectDefinition): Record<string, unknown> {
  return {
    id: project.id,
    title: project.title,
    people: project.people.length,
    cities: project.cities.length,
    buildings: project.buildings.length,
    events: project.events.length,
    eventBindings: project.eventBindings.length,
    dialogues: project.dialogues.length,
    textEntries: project.textEntries.length,
    storyNodes: project.storyNodes.length,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}
