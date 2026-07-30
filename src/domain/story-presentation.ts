import type { GameState } from "./game-state";

export const STORY_PRESENTATION_VARIABLE_KEYS = {
  chapterTitleText: "var.story.presentation.chapter_title_text",
} as const;

export function readStoryChapterTitleText(state: GameState): string {
  const value = state.runtime.variables[STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText];
  return typeof value === "string" ? value : "";
}
