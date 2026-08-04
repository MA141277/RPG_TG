import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { MeetingActionSetDefinition } from "../../domain/meeting/meeting-action-set";
import type {
  MeetingChoiceDefinition,
  MeetingChoiceSetDefinition,
} from "../../domain/meeting/meeting-choice-set";
import type { MeetingDefinition } from "../../domain/meeting/meeting-definition";
import type { MeetingPanelDefinition } from "../../domain/meeting/meeting-panel";
import type {
  MeetingHostContext,
  MeetingRuntimeCompletion,
  MeetingSessionState,
} from "../../domain/meeting/meeting-session";
import type { MeetingStageDefinition } from "../../domain/meeting/meeting-stage";
import { runMeetingActionSet } from "./meeting-action-runtime";
import {
  createMeetingPresenterModel,
  type MeetingPresenterModel,
} from "./meeting-presenter";
import { getMeetingChoiceDisabledReason } from "./meeting-choice-evaluator";

type StickyOverlayState = {
  stageType: "policy-panel";
  panelId: string;
};

type MeetingDerivedState = Record<string, unknown> & {
  stickyOverlay?: StickyOverlayState | undefined;
  executedMeetingActionIds?: string[] | undefined;
};

export type MeetingAdvanceRequest =
  | {
      type: "advance";
    }
  | {
      type: "select-choice";
      choiceId: string;
    };

type MeetingRuntimeSharedInput = {
  meetingDefinition: MeetingDefinition;
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  meetingPanelsById?: Record<string, MeetingPanelDefinition> | undefined;
  meetingChoiceSetsById?: Record<string, MeetingChoiceSetDefinition> | undefined;
  meetingActionSetsById?: Record<string, MeetingActionSetDefinition> | undefined;
};

export type StartMeetingSessionInput = MeetingRuntimeSharedInput & {
  hostContext: MeetingHostContext;
  initialDerivedState?: Record<string, unknown> | undefined;
};

export type AdvanceMeetingSessionInput = MeetingRuntimeSharedInput & {
  sessionState: MeetingSessionState | null;
  request?: MeetingAdvanceRequest | undefined;
};

export type MeetingRuntimeResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  sessionState: MeetingSessionState | null;
  presenterModel: MeetingPresenterModel | null;
  completion?: MeetingRuntimeCompletion | undefined;
  diagnostics?: string[] | undefined;
};

function readCurrentMeetingStage(
  meetingDefinition: MeetingDefinition,
  sessionState: MeetingSessionState | null
): MeetingStageDefinition | null {
  if (sessionState == null) {
    return null;
  }

  return meetingDefinition.stagesById[sessionState.currentStageId] ?? null;
}

function withStageDerivedState(
  derivedState: MeetingDerivedState,
  stage: MeetingStageDefinition,
  options?: {
    clearStickyOverlay?: boolean | undefined;
  }
): MeetingDerivedState {
  const nextDerivedState: MeetingDerivedState = {
    ...derivedState,
  };

  if (options?.clearStickyOverlay === true) {
    delete nextDerivedState.stickyOverlay;
  }

  if (stage.type === "policy-panel" && stage.panelId != null) {
    nextDerivedState.stickyOverlay = {
      stageType: "policy-panel",
      panelId: stage.panelId,
    };
  }

  return nextDerivedState;
}

function createPresenterModel(
  input: MeetingRuntimeSharedInput & {
    sessionState: MeetingSessionState | null;
  }
): MeetingPresenterModel | null {
  return createMeetingPresenterModel({
    meetingDefinition: input.meetingDefinition,
    gameState: input.gameState,
    sessionState: input.sessionState,
    meetingPanelsById: input.meetingPanelsById,
    meetingChoiceSetsById: input.meetingChoiceSetsById,
  });
}

function createBlockedResult(
  input: MeetingRuntimeSharedInput & {
    hostContext?: MeetingHostContext | undefined;
    sessionState: MeetingSessionState | null;
    diagnostics: string[];
  }
): MeetingRuntimeResult {
  const blockedSessionState =
    input.sessionState == null
      ? input.hostContext == null
        ? null
        : ({
            meetingId: input.meetingDefinition.id,
            hostContext: input.hostContext,
            currentStageId: input.meetingDefinition.initialStageId,
            visitedStageIds: [],
            selectedChoiceIds: [],
            derivedState: {},
            status: "blocked",
          } satisfies MeetingSessionState)
      : ({
          ...input.sessionState,
          status: "blocked",
        } satisfies MeetingSessionState);

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: blockedSessionState,
    presenterModel: createPresenterModel({
      meetingDefinition: input.meetingDefinition,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: blockedSessionState,
      meetingPanelsById: input.meetingPanelsById,
      meetingChoiceSetsById: input.meetingChoiceSetsById,
      meetingActionSetsById: input.meetingActionSetsById,
    }),
    diagnostics: input.diagnostics,
  };
}

function createCompletedResult(
  input: MeetingRuntimeSharedInput & {
    sessionState: MeetingSessionState;
  }
): MeetingRuntimeResult {
  const completedSessionState: MeetingSessionState = {
    ...input.sessionState,
    status: "completed",
  };

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: completedSessionState,
    presenterModel: null,
    completion: input.meetingDefinition.completion ?? { type: "return-to-host" },
  };
}

function resolveChoice(
  meetingChoiceSetsById: Record<string, MeetingChoiceSetDefinition>,
  stage: MeetingStageDefinition,
  gameState: GameState,
  request: MeetingAdvanceRequest | undefined
): { choice: MeetingChoiceDefinition | null; diagnostics: string[] } {
  if (stage.choiceSetId == null) {
    return {
      choice: null,
      diagnostics: [`Choice stage ${stage.id} is missing choiceSetId.`],
    };
  }

  const choiceSet = meetingChoiceSetsById[stage.choiceSetId];
  if (choiceSet == null) {
    return {
      choice: null,
      diagnostics: [`Unknown choice set for stage ${stage.id}: ${stage.choiceSetId}`],
    };
  }

  if (request?.type !== "select-choice") {
    return {
      choice: null,
      diagnostics: [`Choice stage ${stage.id} requires a select-choice request.`],
    };
  }

  const choice = choiceSet.choices.find(
    (candidate) => candidate.id === request.choiceId
  );
  if (choice == null) {
    return {
      choice: null,
      diagnostics: [`Unknown meeting choice id: ${request.choiceId}`],
    };
  }

  const disabledReason = getMeetingChoiceDisabledReason(choice, gameState);
  if (disabledReason != null) {
    return {
      choice: null,
      diagnostics: [
        disabledReason === "conditions-are-not-satisfied"
          ? `Meeting choice ${choice.id} conditions are not satisfied.`
          : `Meeting choice ${choice.id} is disabled.`,
      ],
    };
  }

  return {
    choice,
    diagnostics: [],
  };
}

function moveToStage(
  input: MeetingRuntimeSharedInput & {
    sessionState: MeetingSessionState;
    nextStageId: string;
    clearStickyOverlay?: boolean | undefined;
  }
): MeetingRuntimeResult {
  const nextStage = input.meetingDefinition.stagesById[input.nextStageId];
  if (nextStage == null) {
    return createBlockedResult({
      meetingDefinition: input.meetingDefinition,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: input.sessionState,
      meetingPanelsById: input.meetingPanelsById,
      meetingChoiceSetsById: input.meetingChoiceSetsById,
      meetingActionSetsById: input.meetingActionSetsById,
      diagnostics: [`Unknown next meeting stage id: ${input.nextStageId}`],
    });
  }

  const nextSessionState: MeetingSessionState = {
    ...input.sessionState,
    currentStageId: nextStage.id,
    visitedStageIds: [...input.sessionState.visitedStageIds, nextStage.id],
    derivedState: withStageDerivedState(
      (input.sessionState.derivedState ?? {}) as MeetingDerivedState,
      nextStage,
      {
        clearStickyOverlay: input.clearStickyOverlay,
      }
    ),
    status: "running",
  };

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: nextSessionState,
    presenterModel: createPresenterModel({
      meetingDefinition: input.meetingDefinition,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: nextSessionState,
      meetingPanelsById: input.meetingPanelsById,
      meetingChoiceSetsById: input.meetingChoiceSetsById,
      meetingActionSetsById: input.meetingActionSetsById,
    }),
  };
}

export function startMeetingSession(
  input: StartMeetingSessionInput
): MeetingRuntimeResult {
  const initialStage =
    input.meetingDefinition.stagesById[input.meetingDefinition.initialStageId];
  if (initialStage == null) {
    return createBlockedResult({
      ...input,
      sessionState: null,
      diagnostics: [
        `Unknown initial meeting stage id: ${input.meetingDefinition.initialStageId}`,
      ],
    });
  }

  const sessionState: MeetingSessionState = {
    meetingId: input.meetingDefinition.id,
    hostContext: input.hostContext,
    currentStageId: initialStage.id,
    visitedStageIds: [initialStage.id],
    selectedChoiceIds: [],
    derivedState: withStageDerivedState(
      (input.initialDerivedState ?? {}) as MeetingDerivedState,
      initialStage
    ),
    status: "running",
  };

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    presenterModel: createPresenterModel({
      meetingDefinition: input.meetingDefinition,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
      meetingPanelsById: input.meetingPanelsById,
      meetingChoiceSetsById: input.meetingChoiceSetsById,
      meetingActionSetsById: input.meetingActionSetsById,
    }),
  };
}

export function advanceMeetingSession(
  input: AdvanceMeetingSessionInput
): MeetingRuntimeResult {
  if (input.sessionState == null) {
    return createBlockedResult({
      ...input,
      diagnostics: ["Cannot advance a meeting session that has not been started."],
    });
  }

  if (input.sessionState.status !== "running") {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: input.sessionState,
      presenterModel: createPresenterModel(input),
    };
  }

  const currentStage = readCurrentMeetingStage(
    input.meetingDefinition,
    input.sessionState
  );
  if (currentStage == null) {
    return createBlockedResult({
      ...input,
      diagnostics: [
        `Unknown current meeting stage id: ${input.sessionState.currentStageId}`,
      ],
    });
  }

  if (currentStage.type === "choice") {
    const choiceResult = resolveChoice(
      input.meetingChoiceSetsById ?? {},
      currentStage,
      input.gameState,
      input.request
    );
    if (choiceResult.choice == null) {
      return createBlockedResult({
        ...input,
        diagnostics: choiceResult.diagnostics,
      });
    }

    let nextState = input.gameState;
    let nextCharacters = input.characterDefinitions;
    let nextDerivedState = (input.sessionState.derivedState ?? {}) as MeetingDerivedState;
    const diagnostics: string[] = [];

    if (choiceResult.choice.actionSetId != null) {
      const actionSet = input.meetingActionSetsById?.[choiceResult.choice.actionSetId];
      if (actionSet == null) {
        return createBlockedResult({
          ...input,
          diagnostics: [
            `Unknown meeting action set id: ${choiceResult.choice.actionSetId}`,
          ],
        });
      }

      const actionResult = runMeetingActionSet({
        actionSet,
        gameState: nextState,
        characterDefinitions: nextCharacters,
      });
      if (actionResult.blocked) {
        return createBlockedResult({
          ...input,
          gameState: actionResult.gameState,
          characterDefinitions: actionResult.characterDefinitions,
          diagnostics: actionResult.diagnostics,
        });
      }

      nextState = actionResult.gameState;
      nextCharacters = actionResult.characterDefinitions;
      nextDerivedState = {
        ...nextDerivedState,
        executedMeetingActionIds: [
          ...(nextDerivedState.executedMeetingActionIds ?? []),
          ...actionResult.executedActionIds,
        ],
      };
      diagnostics.push(...actionResult.diagnostics);
    }

    const nextStageId = choiceResult.choice.nextStageId ?? currentStage.nextStageId;
    const nextSessionState: MeetingSessionState = {
      ...input.sessionState,
      selectedChoiceIds: [
        ...input.sessionState.selectedChoiceIds,
        choiceResult.choice.id,
      ],
      derivedState: nextDerivedState,
    };

    if (nextStageId == null) {
      return createCompletedResult({
        ...input,
        gameState: nextState,
        characterDefinitions: nextCharacters,
        sessionState: {
          ...nextSessionState,
          derivedState: withStageDerivedState(nextDerivedState, currentStage, {
            clearStickyOverlay: true,
          }),
        },
      });
    }

    return {
      ...moveToStage({
        ...input,
        gameState: nextState,
        characterDefinitions: nextCharacters,
        sessionState: nextSessionState,
        nextStageId,
        clearStickyOverlay: true,
      }),
      ...(diagnostics.length === 0 ? {} : { diagnostics }),
    };
  }

  if (currentStage.type === "action") {
    if (currentStage.actionSetId == null) {
      return createBlockedResult({
        ...input,
        diagnostics: [`Action stage ${currentStage.id} is missing actionSetId.`],
      });
    }

    const actionSet = input.meetingActionSetsById?.[currentStage.actionSetId];
    if (actionSet == null) {
      return createBlockedResult({
        ...input,
        diagnostics: [`Unknown meeting action set id: ${currentStage.actionSetId}`],
      });
    }

    const actionResult = runMeetingActionSet({
      actionSet,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    });
    if (actionResult.blocked) {
      return createBlockedResult({
        ...input,
        gameState: actionResult.gameState,
        characterDefinitions: actionResult.characterDefinitions,
        diagnostics: actionResult.diagnostics,
      });
    }

    const nextSessionState: MeetingSessionState = {
      ...input.sessionState,
      derivedState: {
        ...((input.sessionState.derivedState ?? {}) as MeetingDerivedState),
        executedMeetingActionIds: [
          ...(((input.sessionState.derivedState ?? {}) as MeetingDerivedState)
            .executedMeetingActionIds ?? []),
          ...actionResult.executedActionIds,
        ],
      },
    };
    if (currentStage.nextStageId == null) {
      return createCompletedResult({
        ...input,
        gameState: actionResult.gameState,
        characterDefinitions: actionResult.characterDefinitions,
        sessionState: nextSessionState,
      });
    }

    return {
      ...moveToStage({
        ...input,
        gameState: actionResult.gameState,
        characterDefinitions: actionResult.characterDefinitions,
        sessionState: nextSessionState,
        nextStageId: currentStage.nextStageId,
      }),
      ...(actionResult.diagnostics.length === 0
        ? {}
        : { diagnostics: actionResult.diagnostics }),
    };
  }

  const nextStageId = currentStage.nextStageId;
  if (nextStageId == null) {
    return createCompletedResult({
      ...input,
      sessionState: input.sessionState,
    });
  }

  return moveToStage({
    ...input,
    nextStageId,
    sessionState: input.sessionState,
  });
}

export { readCurrentMeetingStage };
