export const SCRIPT_EDITOR_PROJECT_KIND = "script-editor-project";
export const SCRIPT_EDITOR_PROJECT_MANIFEST_FILE = "project.json";

export const SCRIPT_EDITOR_PROJECT_FILE_KEYS = [
  "storyPack",
  "people",
  "cities",
  "buildings",
  "events",
  "quests",
  "dialogues",
  "minigames",
  "storyNodes",
  "textEntries",
  "conditionGroups",
  "effectBundles",
] as const;

export type ScriptEditorProjectFileKey =
  (typeof SCRIPT_EDITOR_PROJECT_FILE_KEYS)[number];

export const SCRIPT_EDITOR_PROJECT_CANONICAL_FILES: Record<
  ScriptEditorProjectFileKey,
  string
> = {
  storyPack: "./story-pack.json",
  people: "./people.json",
  cities: "./cities.json",
  buildings: "./buildings.json",
  events: "./events.json",
  quests: "./quests.json",
  dialogues: "./dialogues.json",
  minigames: "./minigames.json",
  storyNodes: "./story-nodes.json",
  textEntries: "./text-entries.json",
  conditionGroups: "./condition-groups.json",
  effectBundles: "./effect-bundles.json",
};

export type ScriptEditorEntityRecord = {
  id: string;
  [key: string]: unknown;
};

export type ScriptEditorStoryPackRecord = {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
};

export type ScriptEditorTextEntryRecord = ScriptEditorEntityRecord & {
  text?: string;
};

export type ScriptEditorProjectManifest = {
  schemaVersion: 1;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  files: Record<ScriptEditorProjectFileKey, string>;
};

export type ScriptEditorProjectDefinition = {
  schemaVersion: 1;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  storyPack: ScriptEditorStoryPackRecord;
  people: ScriptEditorEntityRecord[];
  cities: ScriptEditorEntityRecord[];
  buildings: ScriptEditorEntityRecord[];
  events: ScriptEditorEntityRecord[];
  quests: ScriptEditorEntityRecord[];
  dialogues: ScriptEditorEntityRecord[];
  minigames: ScriptEditorEntityRecord[];
  storyNodes: ScriptEditorEntityRecord[];
  textEntries: ScriptEditorTextEntryRecord[];
  conditionGroups: ScriptEditorEntityRecord[];
  effectBundles: ScriptEditorEntityRecord[];
};
