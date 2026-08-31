import type { AppState } from "../app-shell";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";
import type {
  WorldNegotiationApproach,
  WorldStoryNegotiationCapability,
} from "../../domain/world-intent";
import { ZHU_YUANZHANG_STORY_FLAG_KEYS } from "../../domain/zhu-yuanzhang-story";
import {
  HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS,
  buildHaozhouWorldIntentNegotiationActionId,
  createKeepAssignmentNegotiationNode,
  createTempleRequestEarlyBeggingNegotiationNode,
  createTempleReviewWorkPlanNegotiationNode,
} from "./haozhou-story-negotiation-nodes";

type NegotiationRegistryInput = {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
};

type HaozhouHouseSession =
  | {
      moduleId: "temple-house";
      state: {
        mode: "daily" | "meeting";
        meetingStage: string;
      };
    }
  | {
      moduleId: "keep-house";
      state: {
        mode: "audience" | "meeting";
        meetingStage: string;
      };
    }
  | null;

function readHaozhouHouseSession(appState: AppState): HaozhouHouseSession {
  const session = appState.gameState.ui.houseSession;
  if (session == null) {
    return null;
  }

  if (session.moduleId === "temple-house" || session.moduleId === "keep-house") {
    return session as HaozhouHouseSession;
  }

  return null;
}

function isInHaozhouHouseStage(
  input: NegotiationRegistryInput
): input is NegotiationRegistryInput & {
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>;
} {
  return (
    input.appState.gameState.world.currentCityId === "city.kulan" &&
    input.stageOutput.type === "house"
  );
}

export function selectHaozhouWorldIntentNegotiationNodes(
  input: NegotiationRegistryInput
): WorldStoryNegotiationCapability[] {
  if (!isInHaozhouHouseStage(input)) {
    return [];
  }

  const session = readHaozhouHouseSession(input.appState);
  if (session == null) {
    return [];
  }

  if (session.moduleId === "temple-house") {
    if (
      session.state.mode === "daily" &&
      input.appState.gameState.runtime.flags[
        ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked
      ] !== true
    ) {
      return [
        createTempleRequestEarlyBeggingNegotiationNode({
          targetCharacterId: input.stageOutput.activeHouse.defaultCharacterId,
        }),
      ];
    }

    if (
      session.state.mode === "meeting" &&
      session.state.meetingStage === "assign-duty"
    ) {
      return [
        createTempleReviewWorkPlanNegotiationNode({
          targetCharacterId: input.stageOutput.activeHouse.defaultCharacterId,
        }),
      ];
    }

    return [];
  }

  if (
    session.state.mode === "meeting" &&
    session.state.meetingStage === "assign-task"
  ) {
    return [
      createKeepAssignmentNegotiationNode({
        targetCharacterId: input.stageOutput.activeHouse.defaultCharacterId,
      }),
    ];
  }

  return [];
}

export function resolveHaozhouWorldIntentNegotiationAction(input: {
  nodeId: string;
  approach: WorldNegotiationApproach;
  targetCharacterId?: string | null;
}): {
  actionId: string;
} | null {
  const actionId = buildHaozhouWorldIntentNegotiationActionId({
    nodeId: input.nodeId,
    approach: input.approach,
  });
  if (actionId == null) {
    return null;
  }

  if (
    input.nodeId !==
      HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.templeRequestEarlyBegging &&
    input.nodeId !==
      HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.templeReviewWorkPlanNegotiation &&
    input.nodeId !==
      HAOZHOU_WORLD_INTENT_NEGOTIATION_NODE_IDS.keepAssignmentNegotiation
  ) {
    return null;
  }

  return {
    actionId,
  };
}
