import { isGlobalAudioMuted } from "./global-audio-settings";

type EntryShellScreen =
  | "hidden"
  | "main-menu"
  | "scenario-select"
  | "character-select"
  | "script-editor-landing"
  | "script-editor-workspace"
  | "runtime-preview";

export function resolveEntryShellAudioMutedState(input: {
  screen: EntryShellScreen | string | null | undefined;
  runtimeAudioSettings: unknown;
  scriptEditorProjectAudioSettings?: unknown;
}): boolean {
  if (
    input.screen === "script-editor-landing" ||
    input.screen === "script-editor-workspace"
  ) {
    return true;
  }

  if (input.screen === "runtime-preview") {
    return isGlobalAudioMuted(input.scriptEditorProjectAudioSettings);
  }

  return isGlobalAudioMuted(input.runtimeAudioSettings);
}
