import type { CharacterId } from "../../domain/character";
import type { HouseStandbyActorViewModel } from "../../domain/house-module";
import type {
  NpcInteractionContext,
  NpcInteractionMenuViewModel,
  NpcInteractionOptionViewModel,
  NpcInteractionSession,
  NpcPoolViewModel,
} from "../../domain/npc-interaction";

export const NPC_INTERACTION_DEFAULT_OPTION_IDS = {
  profile: "npc-interaction:profile",
  talk: "npc-interaction:talk",
  gift: "npc-interaction:gift",
} as const;

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
      {
        id: NPC_INTERACTION_DEFAULT_OPTION_IDS.profile,
        label: "角色情报",
        kind: "profile",
      },
      {
        id: NPC_INTERACTION_DEFAULT_OPTION_IDS.talk,
        label: "谈话",
        kind: "talk",
      },
      {
        id: NPC_INTERACTION_DEFAULT_OPTION_IDS.gift,
        label: "送礼",
        kind: "gift",
        ...(input.giftDisabled !== false ? { disabled: true } : {}),
      },
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
      disabled: input.disabled || actor.actionId == null,
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
    input.actors.find((actor) => actor.characterId === input.targetCharacterId)
      ?.interactionActions ?? []
  );
}

export function isNpcInteractionBlocked(input: {
  overlayView: string | null;
  modalState: unknown | null;
  locationDialogueState: unknown | null;
  hasHouseOverlay: boolean;
  hasActiveDialogueAdvance: boolean;
}): boolean {
  return (
    input.overlayView != null ||
    input.modalState != null ||
    input.locationDialogueState != null ||
    input.hasHouseOverlay ||
    input.hasActiveDialogueAdvance
  );
}
