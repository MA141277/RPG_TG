import type { EventId } from "./event";

export type StoryArcId = string;
export type StoryBeatId = string;

export type StoryArcDefinition = {
  id: StoryArcId;
  chapterId: string;
  title: string;
  summary: string;
  entryEventId: EventId;
  stageVariableKey: string;
  defaultStage: string;
  beatIds: StoryBeatId[];
  tags?: string[];
};

export type StoryBeatDefinition = {
  id: StoryBeatId;
  arcId: StoryArcId;
  title: string;
  summary: string;
  eventIds: EventId[];
  completionFlagKey?: string;
  nextBeatId?: StoryBeatId;
  tags?: string[];
};

export type StoryProgressSnapshot = {
  arcId: StoryArcId;
  currentStage: string;
  completedBeatIds: StoryBeatId[];
  lastTriggeredEventId: EventId | null;
};

export function createStoryStageVariableKey(arcId: StoryArcId): string {
  return `var.story.${arcId}.stage`;
}

export function createStoryBeatFlagKey(
  arcId: StoryArcId,
  beatId: StoryBeatId
): string {
  return `flag.story.${arcId}.${beatId}.completed`;
}
