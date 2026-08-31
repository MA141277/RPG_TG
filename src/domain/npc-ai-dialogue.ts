import type { CharacterId } from "./character";
import type {
  HouseConversationCapabilitySnapshot,
  HouseConversationRoute,
} from "./house-conversation";
import type { HouseActionMemoryContext } from "./world-intent";

export type NpcAiDialogueProviderInputType =
  | "start_talk"
  | "select_option"
  | "custom_input";

export type NpcAiDialogueProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type NpcAiDialogueChoiceOption = {
  id: string;
  label: string;
  actionText: string;
  kind?: string;
  recommended?: boolean;
};

export type NpcAiDialogueSpecialActionMetadata = {
  id: string;
  label: string;
};

export type NpcAiDialogueNarrationStep = {
  type: "narration";
  text: string;
};

export type NpcAiDialogueDialogueStep = {
  type: "dialogue";
  speakerId: string;
  speakerName: string;
  text: string;
};

export type NpcAiDialogueChoiceStep = {
  type: "choice";
  prompt?: string;
  options: NpcAiDialogueChoiceOption[];
};

export type NpcAiDialogueActionStep = {
  type: "action";
  actionId: string;
};

export type NpcAiDialogueRouteStep = {
  type: "route";
  route: HouseConversationRoute;
};

export type NpcAiDialogueStep =
  | NpcAiDialogueNarrationStep
  | NpcAiDialogueDialogueStep
  | NpcAiDialogueChoiceStep
  | NpcAiDialogueActionStep
  | NpcAiDialogueRouteStep;

export type NpcAiDialogueProviderRequest = {
  requestId: string;
  system: string;
  messages: NpcAiDialogueProviderMessage[];
  metadata: {
    contextType: "house" | "city" | "scene";
    npcId: string;
    npcName: string;
    inputType: NpcAiDialogueProviderInputType;
    houseId?: string;
    placeName?: string;
    latestReactionMemorySummary?: string;
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    customInputText?: string;
    availableSpecialActions?: NpcAiDialogueSpecialActionMetadata[];
    forcedSpecialActionId?: string;
    houseConversationCapabilitySnapshot?: HouseConversationCapabilitySnapshot;
    forcedHouseConversationRoute?: HouseConversationRoute;
  };
};

export type NpcAiDialogueProviderEvent =
  | {
      type: "start";
      requestId: string;
    }
  | {
      type: "step";
      requestId: string;
      step: NpcAiDialogueStep;
    }
  | {
      type: "complete";
      requestId: string;
      rawText: string;
      allSteps: NpcAiDialogueStep[];
    }
  | {
      type: "error";
      requestId: string;
      message: string;
    };

export type NpcAiDialogueProvider = {
  stream(
    request: NpcAiDialogueProviderRequest,
    onEvent: (event: NpcAiDialogueProviderEvent) => void | Promise<void>
  ): void | Promise<void>;
  cancel?(requestId: string): void | Promise<void>;
};

export type NpcAiDialogueTranscriptEntry =
  | {
      id: string;
      type: "narration";
      text: string;
    }
  | {
      id: string;
      type: "dialogue";
      text: string;
      speakerId?: CharacterId | string;
      speakerName?: string;
      portraitImageUrl?: string | null;
      portraitArtClassName?: string;
    };

export type NpcAiDialogueDisplayPage =
  | {
      id: string;
      type: "narration";
      text: string;
    }
  | {
      id: string;
      type: "dialogue";
      text: string;
      speakerId?: CharacterId | string;
      speakerName?: string;
      portraitImageUrl?: string | null;
      portraitArtClassName?: string;
    };

export type NpcAiDialogueOptionStance =
  | "benevolent"
  | "neutral"
  | "hostile";

export type NpcAiDialogueOverlayOption = {
  id: string;
  label: string;
  actionText: string;
  actionId: string;
  stance: NpcAiDialogueOptionStance;
  recommended?: boolean;
  kind?: string;
};

export type NpcAiDialogueSessionStatus =
  | "idle"
  | "streaming"
  | "awaiting-advance"
  | "awaiting-action-jump"
  | "awaiting-choice"
  | "error";

export type NpcAiDialogueSessionState = {
  requestSequence: number;
  currentRequestId: string | null;
  status: NpcAiDialogueSessionStatus;
  transcript: NpcAiDialogueTranscriptEntry[];
  displayPages: NpcAiDialogueDisplayPage[];
  currentDisplayPageIndex: number;
  options: NpcAiDialogueOverlayOption[];
  customInputValue: string;
  customInputOpen: boolean;
  pendingSpecialActionId: string | null;
  pendingRoute: HouseConversationRoute | null;
  statusNotice: string | null;
  errorNotice: string | null;
};

export type NpcAiDialogueMemoryEntry = {
  id: string;
  requestId: string;
  contextType: "house" | "city" | "scene";
  houseId?: string | null;
  placeName?: string | null;
  speaker: "player" | "npc" | "narration";
  speakerId?: string;
  speakerName?: string;
  text: string;
};

export type NpcAiDialogueMemoryRecord = {
  characterId: CharacterId | string;
  entries: NpcAiDialogueMemoryEntry[];
  updatedAtRequestId: string | null;
};

export type NpcAiDialogueReactionMemoryEntry = {
  id: string;
  eventId: string;
  eventType: string;
  cityId?: string;
  houseId?: string | null;
  houseActionMemory?: HouseActionMemoryContext;
  summary: string;
};

export type NpcAiDialogueReactionMemoryRecord = {
  characterId: CharacterId | string;
  entries: NpcAiDialogueReactionMemoryEntry[];
  updatedAtEventId: string | null;
};

export type NpcAiDialogueRuntimeState = {
  memoriesByCharacterId: Record<string, NpcAiDialogueMemoryRecord>;
  reactionMemoriesByCharacterId: Record<
    string,
    NpcAiDialogueReactionMemoryRecord
  >;
};

export const NPC_AI_DIALOGUE_PAGE_MAX_CHARS = 20;

const PAGE_BREAK_PUNCTUATION = new Set([
  "，",
  "。",
  "、",
  "：",
  "；",
  "！",
  "？",
  ",",
  ".",
  ":",
  ";",
  "!",
  "?",
]);

export function splitNpcAiDialoguePages(
  text: string,
  maxChars = NPC_AI_DIALOGUE_PAGE_MAX_CHARS
): string[] {
  const normalizedText = text.trim();
  if (normalizedText.length === 0) {
    return [];
  }

  if (maxChars <= 0 || normalizedText.length <= maxChars) {
    return [normalizedText];
  }

  const pages: string[] = [];
  let remaining = normalizedText;

  while (remaining.length > maxChars) {
    const candidate = remaining.slice(0, maxChars);
    let splitIndex = -1;

    for (let index = candidate.length - 1; index >= 0; index -= 1) {
      if (PAGE_BREAK_PUNCTUATION.has(candidate[index] ?? "")) {
        splitIndex = index;
        break;
      }
    }

    const pageText = (
      splitIndex >= 0 ? remaining.slice(0, splitIndex + 1) : candidate
    ).trim();
    if (pageText.length === 0) {
      break;
    }

    pages.push(pageText);
    remaining = remaining.slice(pageText.length).trimStart();
  }

  if (remaining.length > 0) {
    pages.push(remaining);
  }

  return pages;
}

export function resolveNpcAiDialogueOptionStance(input: {
  kind?: string;
  index: number;
}): NpcAiDialogueOptionStance {
  const normalizedKind = input.kind?.trim().toLowerCase() ?? "";
  if (
    normalizedKind === "benevolent" ||
    normalizedKind === "kind" ||
    normalizedKind === "friendly" ||
    normalizedKind === "good"
  ) {
    return "benevolent";
  }

  if (normalizedKind === "neutral") {
    return "neutral";
  }

  if (
    normalizedKind === "hostile" ||
    normalizedKind === "evil" ||
    normalizedKind === "aggressive"
  ) {
    return "hostile";
  }

  if (input.index === 0) {
    return "benevolent";
  }

  if (input.index === 1) {
    return "neutral";
  }

  return "hostile";
}

export function createInitialNpcAiDialogueRuntimeState(): NpcAiDialogueRuntimeState {
  return {
    memoriesByCharacterId: {},
    reactionMemoriesByCharacterId: {},
  };
}
