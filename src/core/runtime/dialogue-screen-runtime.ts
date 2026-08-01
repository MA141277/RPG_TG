import type { CharacterDefinition } from "../../domain/character";
import type {
  RuntimeDialogueDefinition,
  RuntimeDialogueScreenDefinition,
} from "../../domain/dialogue";

export type DialogueScreenViewModelCastMember = {
  characterId: string;
  characterName: string;
  side: "left" | "right" | "center";
  isSpeaker: boolean;
};

export type DialogueScreenViewModelOption = {
  id: string;
  text: string;
};

export type DialogueScreenViewModel = {
  dialogueId: string;
  title: string;
  text: string;
  speakerCharacterId: string;
  speakerName: string;
  mode: "linear" | "choice";
  cast: DialogueScreenViewModelCastMember[];
  options: DialogueScreenViewModelOption[];
};

export type DialogueScreenResult =
  | {
      type: "close";
      nextEventId: string | null;
    }
  | {
      type: "choice";
      optionId: string;
      nextEventId: string | null;
    };

export type DialogueScreenRuntimeInput = {
  dialogue: RuntimeDialogueDefinition;
  textEntriesById?: Record<string, string>;
  characterDefinitions?: CharacterDefinition[];
};

function requireDialogueScreen(
  dialogue: RuntimeDialogueDefinition
): RuntimeDialogueScreenDefinition {
  if (dialogue.screen == null) {
    throw new Error(
      `Dialogue "${dialogue.id}" does not provide a single-screen definition.`
    );
  }
  return dialogue.screen;
}

function resolveText(
  textEntriesById: Record<string, string>,
  textId: string
): string {
  return textEntriesById[textId] ?? textId;
}

function resolveCharacterName(
  characterDefinitionsById: Map<string, CharacterDefinition>,
  characterId: string
): string {
  return characterDefinitionsById.get(characterId)?.name ?? characterId;
}

export function createDialogueScreenViewModel(
  input: DialogueScreenRuntimeInput
): DialogueScreenViewModel {
  const textEntriesById = input.textEntriesById ?? {};
  const characterDefinitionsById = new Map(
    (input.characterDefinitions ?? []).map((character) => [character.id, character])
  );
  const screen = requireDialogueScreen(input.dialogue);

  return {
    dialogueId: input.dialogue.id,
    title: input.dialogue.name,
    text: resolveText(textEntriesById, screen.textId),
    speakerCharacterId: screen.speakerCharacterId,
    speakerName: resolveCharacterName(
      characterDefinitionsById,
      screen.speakerCharacterId
    ),
    mode: screen.mode,
    cast: screen.cast.map((member) => ({
      characterId: member.characterId,
      characterName: resolveCharacterName(
        characterDefinitionsById,
        member.characterId
      ),
      side: member.side,
      isSpeaker: member.characterId === screen.speakerCharacterId,
    })),
    options:
      screen.mode === "choice"
        ? screen.options.map((option) => ({
            id: option.id,
            text: resolveText(textEntriesById, option.labelTextId ?? option.id),
          }))
        : [],
  };
}

export function continueDialogueScreen(
  dialogue: RuntimeDialogueDefinition
): DialogueScreenResult {
  const screen = requireDialogueScreen(dialogue);
  return {
    type: "close",
    nextEventId:
      screen.mode === "linear" ? screen.nextEventId ?? null : null,
  };
}

export function selectDialogueScreenOption(
  dialogue: RuntimeDialogueDefinition,
  optionId: string
): DialogueScreenResult {
  const screen = requireDialogueScreen(dialogue);
  if (screen.mode !== "choice") {
    throw new Error(
      `Dialogue "${dialogue.id}" is not a choice dialogue and cannot select options.`
    );
  }

  const option = screen.options.find((entry) => entry.id === optionId);
  if (option == null) {
    throw new Error(
      `Dialogue "${dialogue.id}" does not define option "${optionId}".`
    );
  }

  return {
    type: "choice",
    optionId,
    nextEventId: option.nextEventId ?? null,
  };
}
