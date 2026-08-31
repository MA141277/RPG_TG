import type { CharacterId } from "../../domain/character";
import type { HouseStandbyActorViewModel } from "../../domain/house-module";
import {
  resolveNpcAiDialogueOptionStance,
  type NpcAiDialogueSessionState,
} from "../../domain/npc-ai-dialogue";
import type {
  NpcInteractionContext,
  NpcInteractionMenuViewModel,
  NpcInteractionOptionViewModel,
  NpcInteractionSession,
  NpcPoolViewModel,
} from "../../domain/npc-interaction";
import { NPC_INTERACTION_DEFAULT_OPTIONS } from "../../domain/npc-interaction";

export { NPC_INTERACTION_DEFAULT_OPTION_IDS } from "../../domain/npc-interaction";

export const NPC_AI_DIALOGUE_SELECT_OPTION_ACTION_PREFIX =
  "npc-ai-dialogue-select-option:";
export const NPC_AI_DIALOGUE_CUSTOM_INPUT_FIELD_ID =
  "npc-ai-dialogue-custom-input";
export const NPC_AI_DIALOGUE_CUSTOM_INPUT_PLACEHOLDER = "输入你想说的话";
export const NPC_AI_DIALOGUE_CUSTOM_OPEN_ACTION = "open-custom-input";
export const NPC_AI_DIALOGUE_CUSTOM_SUBMIT_ACTION = "submit-custom";
export const NPC_AI_DIALOGUE_CUSTOM_CANCEL_ACTION = "cancel-custom-input";
export const NPC_AI_DIALOGUE_REQUEST_ID_PREFIX = "npc-ai-dialogue-request-";
export const NPC_AI_DIALOGUE_ADVANCE_PAGE_ACTION = "advance-page";

export type NpcInteractionBlockState = {
  overlayView: string | null;
  modalState: unknown | null;
  locationDialogueState: unknown | null;
  hasHouseOverlay: boolean;
  hasActiveDialogueAdvance: boolean;
  hasNpcInteractionSession: boolean;
};

export function createNpcInteractionSession(
  context: NpcInteractionContext,
  targetCharacterId: CharacterId
): NpcInteractionSession {
  return {
    context,
    targetCharacterId,
    mode: "menu",
  };
}

export function closeNpcInteractionSession(): null {
  return null;
}

export function createInitialNpcAiDialogueSessionState(): NpcAiDialogueSessionState {
  return {
    requestSequence: 0,
    currentRequestId: null,
    status: "idle",
    transcript: [],
    displayPages: [],
    currentDisplayPageIndex: 0,
    options: [],
    customInputValue: "",
    customInputOpen: false,
    pendingSpecialActionId: null,
    pendingRoute: null,
    statusNotice: null,
    errorNotice: null,
  };
}

export function getNpcAiDialogueOptionStanceLabel(
  stance: ReturnType<typeof resolveNpcAiDialogueOptionStance>
): string {
  if (stance === "benevolent") {
    return "善意";
  }

  if (stance === "neutral") {
    return "中立";
  }

  return "恶意";
}

export function selectNpcInteractionMenu(input: {
  session: NpcInteractionSession;
  targetName: string | null;
  specialActions?: NpcInteractionOptionViewModel[];
  giftDisabled?: boolean;
}): NpcInteractionMenuViewModel | null {
  if (input.session == null || input.session.mode !== "menu" || input.targetName == null) {
    return null;
  }

  return {
    type: "npc-interaction-menu",
    context: input.session.context,
    targetCharacterId: input.session.targetCharacterId,
    targetName: input.targetName,
    options: [
      ...(input.specialActions ?? []),
      ...NPC_INTERACTION_DEFAULT_OPTIONS.map((option) => ({
        ...option,
        ...(option.kind === "gift" && input.giftDisabled !== false
          ? { disabled: true }
          : {}),
      })),
    ],
  };
}

export function adaptHouseRosterToNpcPool(input: {
  context: Extract<NpcInteractionContext, { type: "house" }>;
  actors: HouseStandbyActorViewModel[];
  disabled: boolean;
}): NpcPoolViewModel {
  return {
    context: input.context,
    actors: input.actors.map((actor) => ({
      characterId: actor.characterId,
      name: actor.name,
      ...(actor.title == null ? {} : { title: actor.title }),
      ...(actor.avatarImageUrl == null ? {} : { avatarImageUrl: actor.avatarImageUrl }),
      ...(actor.isSelected == null ? {} : { isSelected: actor.isSelected }),
      disabled: input.disabled || actor.disabled === true,
    })),
  };
}

export function selectHouseNpcSpecialActions(input: {
  actors: HouseStandbyActorViewModel[];
  targetCharacterId: string | null;
}): NpcInteractionOptionViewModel[] {
  if (input.targetCharacterId == null) {
    return [];
  }

  return (
    input.actors
      .find((actor) => actor.characterId === input.targetCharacterId)
      ?.interactionActions?.map((action) => ({
        ...action,
        buttonSound: action.buttonSound ?? "light",
      })) ?? []
  );
}

export function selectNpcInteractionBlockState(input: {
  overlayView: string | null;
  modalState: unknown | null;
  locationDialogueState: unknown | null;
  houseOverlay?: unknown | null;
  houseDialogue?: unknown | null;
  beggingMiniGameState?: unknown | null;
  activitySession?: unknown | null;
  messageState?: unknown | null;
  npcInteractionSession?: NpcInteractionSession;
}): NpcInteractionBlockState {
  return {
    overlayView: input.overlayView,
    modalState: input.modalState,
    locationDialogueState: input.locationDialogueState,
    hasHouseOverlay:
      input.houseOverlay != null ||
      input.beggingMiniGameState != null ||
      input.activitySession != null ||
      input.messageState != null,
    hasActiveDialogueAdvance: input.houseDialogue != null,
    hasNpcInteractionSession: input.npcInteractionSession != null,
  };
}

export function isNpcInteractionBlocked(input: NpcInteractionBlockState): boolean {
  return Boolean(
    input.overlayView != null ||
      input.modalState != null ||
      input.locationDialogueState != null ||
      input.hasHouseOverlay ||
      input.hasActiveDialogueAdvance ||
      input.hasNpcInteractionSession
  );
}
