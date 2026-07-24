import type { AppState } from "../app-shell";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "../content/text-resolution";
import { defaultReviewCyclePolicy } from "../review/review-cycle-provider";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { RuntimeState } from "../../core/contracts/runtime-state";

export type NavigationTimeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  handled: boolean;
};

export type CouncilArrivalNotice = {
  speakerCharacterId?: string;
  textLines?: string[];
  advanceHintText?: string;
};

export function applyCouncilPriorityFollowUp(input: {
  previousGameState?: GameState;
  state: RuntimeState;
  houseDefinitions: HouseDefinition[];
  textEntriesById: Record<string, string>;
  councilArrivalNotice?: CouncilArrivalNotice;
}): NavigationTimeFollowUpResult {
  if (
    input.previousGameState != null &&
    (defaultReviewCyclePolicy.hasReachedReviewDate(input.previousGameState) ||
      !defaultReviewCyclePolicy.hasReachedReviewDate(input.state.core))
  ) {
    return {
      handled: false,
      state: input.state,
    };
  }

  const priorityHouse = getCouncilPriorityHouseDefinition(
    input.state.core,
    input.houseDefinitions
  );
  if (priorityHouse == null) {
    return {
      handled: false,
      state: input.state,
    };
  }

  return {
    handled: true,
    state: {
      ...input.state,
      app: {
        ...input.state.app,
        modalState: null,
        locationDialogueState: createCouncilArrivalDialogue({
          gameState: input.state.core,
          houseDefinitions: input.houseDefinitions,
          textEntriesById: input.textEntriesById,
          ...(input.councilArrivalNotice == null
            ? {}
            : { councilArrivalNotice: input.councilArrivalNotice }),
        }),
        beggingMiniGameState: null,
        cityMenuState: null,
        cityDirectoryState: null,
        autoAdvanceState: null,
        campaignTravelState: null,
      },
    },
  };
}

function getCouncilPriorityHouseDefinition(
  gameState: GameState,
  houseDefinitions: HouseDefinition[]
): HouseDefinition | null {
  const priorityModuleId = defaultReviewCyclePolicy.getPriorityHouseModuleId(gameState);
  const currentCityId = gameState.world.currentCityId;

  return (
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.moduleId === priorityModuleId &&
        houseDefinition.cityId === currentCityId
    ) ??
    houseDefinitions.find(
      (houseDefinition) => houseDefinition.moduleId === priorityModuleId
    ) ??
    null
  );
}

function createCouncilArrivalDialogue(input: {
  gameState: GameState;
  houseDefinitions: HouseDefinition[];
  textEntriesById: Record<string, string>;
  councilArrivalNotice?: CouncilArrivalNotice;
}): NonNullable<AppState["locationDialogueState"]> | null {
  const priorityHouse = getCouncilPriorityHouseDefinition(
    input.gameState,
    input.houseDefinitions
  );
  if (priorityHouse == null) {
    return null;
  }

  const isTempleReview = priorityHouse.moduleId === "temple-house";
  const defaultSpeakerCharacterId =
    priorityHouse.defaultCharacterId ??
    (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard");
  const defaultTextLines = isTempleReview
    ? [
        resolveTextTemplateEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.temple.001",
          { targetHouseName: priorityHouse.name }
        ),
        resolveTextEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.temple.002"
        ),
      ]
    : [
        resolveTextTemplateEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.keep.001",
          { targetHouseName: priorityHouse.name }
        ),
        resolveTextEntry(
          input.textEntriesById,
          "runtime.zhu_yuanzhang.council_arrival.keep.002"
        ),
      ];

  return {
    type: "council-arrival-reminder",
    speakerCharacterId:
      input.councilArrivalNotice?.speakerCharacterId ??
      defaultSpeakerCharacterId,
    textLines: [
      ...defaultTextLines,
      ...(input.councilArrivalNotice?.textLines ?? []),
    ],
    advanceHintText:
      input.councilArrivalNotice?.advanceHintText ?? "\u77e5\u9053\u4e86",
    targetHouseId: priorityHouse.id,
  };
}
