export const AI_MOD_DRAFT_KIND = "ai-mod-draft";
export const AI_MOD_DRAFT_SCHEMA_VERSION = 1;
export const AI_MOD_DRAFT_FIRST_STAGE_MODE = "first-stage-only";

export type AiModDraftGenerationScope = {
  mode: typeof AI_MOD_DRAFT_FIRST_STAGE_MODE;
  currentStageId?: string | undefined;
};

export type AiModDraftTextMap = {
  [key: string]: unknown;
};

export type AiModDraftStatMapping = Record<
  string,
  {
    label: string;
    meaning?: string | undefined;
  }
>;

export type AiModDraftSkillMapping = {
  id: string;
  label: string;
  mapsTo?: string | undefined;
  hidden?: boolean | undefined;
  meaning?: string | undefined;
};

export type AiModDraftWorldBuilding = {
  id: string;
  name: string;
  role?: string | undefined;
};

export type AiModDraftWorldScale = {
  city?: {
    id: string;
    name: string;
  } | undefined;
  buildings: AiModDraftWorldBuilding[];
};

export type AiModDraftStage = {
  id: string;
  title: string;
  goal?: string | undefined;
  reviewCycle?: Record<string, unknown> | undefined;
};

export type AiModDraftPerson = {
  id: string;
  name: string;
  role?: string | undefined;
  buildingId?: string | undefined;
  initialStats?: Record<string, number> | undefined;
};

export type AiModDraftEntities = {
  player?: AiModDraftPerson | undefined;
  people: AiModDraftPerson[];
};

export type AiModDraftActionLoop = {
  id: string;
  label: string;
  buildingId?: string | undefined;
  [key: string]: unknown;
};

export type AiModDraftDialogueNode = {
  id: string;
  speaker: string;
  text: string;
};

export type AiModDraftDialogue = {
  id: string;
  title: string;
  nodes: AiModDraftDialogueNode[];
};

export type AiModDraftEvent = {
  id: string;
  title: string;
  stageId?: string | undefined;
  content?: {
    type: "dialogue";
    dialogueId: string;
  } | undefined;
  effects?: unknown[] | undefined;
};

export type AiModDraftBinding = {
  id: string;
  eventId: string;
  owner: {
    family: string;
    id?: string | undefined;
  };
  trigger: {
    timing: string;
    action: string;
  };
  conditions?: unknown;
  priority?: number | undefined;
  enabled?: boolean | undefined;
};

export type AiModDraftResidue = {
  id: string;
  type?: string | undefined;
  summary: string;
  [key: string]: unknown;
};

export type AiModDraft = {
  schemaVersion: typeof AI_MOD_DRAFT_SCHEMA_VERSION;
  kind: typeof AI_MOD_DRAFT_KIND;
  id: string;
  title: string;
  generationScope: AiModDraftGenerationScope;
  themeFrame: AiModDraftTextMap;
  statMapping: AiModDraftStatMapping;
  skillMapping: AiModDraftSkillMapping[];
  worldScale: AiModDraftWorldScale;
  stages: AiModDraftStage[];
  entities: AiModDraftEntities;
  actionLoops: AiModDraftActionLoop[];
  dialogues: AiModDraftDialogue[];
  events: AiModDraftEvent[];
  bindings: AiModDraftBinding[];
  draftResidue: AiModDraftResidue[];
};

