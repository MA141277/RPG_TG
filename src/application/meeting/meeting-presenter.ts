import type {
  HouseActionContainerViewModel,
  HouseDialogueViewModel,
  HouseOverlayViewModel,
} from "../../domain/house-module";
import type { MeetingChoiceSetDefinition } from "../../domain/meeting/meeting-choice-set";
import type { MeetingDefinition } from "../../domain/meeting/meeting-definition";
import type { MeetingPanelDefinition } from "../../domain/meeting/meeting-panel";
import type { MeetingSessionState } from "../../domain/meeting/meeting-session";
import type { MeetingStageDefinition } from "../../domain/meeting/meeting-stage";
import type { ReviewAssignmentRow, ReviewPolicyPanel } from "../../domain/review";
import type { GameState } from "../../domain/game-state";
import { getMeetingChoiceDisabledReason } from "./meeting-choice-evaluator";

type StickyOverlayState = {
  stageType: "policy-panel";
  panelId: string;
};

type MeetingDerivedState = Record<string, unknown> & {
  stickyOverlay?: StickyOverlayState | undefined;
  reviewAssignmentRowsByPanelId?: Record<string, ReviewAssignmentRow[]> | undefined;
  stageOverlaysByStageId?: Record<string, HouseOverlayViewModel | null> | undefined;
  dialogueLinesByStageId?: Record<string, string[]> | undefined;
  actionContainersByStageId?:
    | Record<string, HouseActionContainerViewModel | null>
    | undefined;
};

export type MeetingPresenterModel = {
  stageId: string;
  stageType: MeetingStageDefinition["type"];
  status: MeetingSessionState["status"];
  overlay: HouseOverlayViewModel | null;
  dialogue: HouseDialogueViewModel | null;
  actionContainer: HouseActionContainerViewModel | null;
};

export type CreateMeetingPresenterModelInput = {
  meetingDefinition: MeetingDefinition;
  sessionState: MeetingSessionState | null;
  gameState?: GameState | undefined;
  meetingPanelsById?: Record<string, MeetingPanelDefinition> | undefined;
  meetingChoiceSetsById?: Record<string, MeetingChoiceSetDefinition> | undefined;
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

function readPanelTextValue(
  panel: MeetingPanelDefinition | null,
  index: number
): string {
  const section = panel?.sections[index];
  if (section == null) {
    return "";
  }

  if (section.value != null) {
    return section.value;
  }

  return section.textLineIds?.join("\n") ?? "";
}

function createPolicyPanel(panel: MeetingPanelDefinition | null): ReviewPolicyPanel {
  return {
    overallGoal: readPanelTextValue(panel, 0),
    phaseGoal: readPanelTextValue(panel, 1),
    executionPlan: readPanelTextValue(panel, 2),
  };
}

function createPanelParagraphs(panel: MeetingPanelDefinition | null): string[] {
  if (panel == null) {
    return [];
  }

  return panel.sections
    .map((section) => readPanelTextValue(panel, panel.sections.indexOf(section)))
    .filter((paragraph) => paragraph.trim().length > 0);
}

function createStageOverlay(input: {
  stage: MeetingStageDefinition;
  panel: MeetingPanelDefinition | null;
  derivedState: MeetingDerivedState;
}): HouseOverlayViewModel | null {
  if (
    input.derivedState.stageOverlaysByStageId != null &&
    Object.hasOwn(input.derivedState.stageOverlaysByStageId, input.stage.id)
  ) {
    return input.derivedState.stageOverlaysByStageId[input.stage.id] ?? null;
  }

  if (input.stage.type === "assignment-table") {
    return {
      type: "review-assignment-table",
      title: input.panel?.title ?? input.stage.title ?? "委任",
      rows:
        input.stage.panelId == null
          ? []
          : input.derivedState.reviewAssignmentRowsByPanelId?.[input.stage.panelId] ?? [],
      confirmActionId: "close-review-assignment-table",
      confirmLabel: "继续",
    };
  }

  if (input.stage.type === "policy-panel") {
    return {
      type: "review-policy-panel",
      title: input.panel?.title ?? input.stage.title ?? "方略",
      policy: createPolicyPanel(input.panel),
      closeActionId: "close-review-policy-panel",
      closeLabel: "关闭",
    };
  }

  if (input.stage.type === "summary") {
    return {
      type: "alert",
      title: input.panel?.title ?? input.stage.title ?? "摘要",
      paragraphs: createPanelParagraphs(input.panel),
      confirmActionId: "advance-meeting-stage",
      confirmLabel: "继续",
    };
  }

  return null;
}

function createStickyOverlay(input: {
  stickyOverlay: StickyOverlayState | null;
  meetingPanelsById: Record<string, MeetingPanelDefinition>;
}): HouseOverlayViewModel | null {
  if (input.stickyOverlay == null || input.stickyOverlay.stageType !== "policy-panel") {
    return null;
  }

  const panel = input.meetingPanelsById[input.stickyOverlay.panelId] ?? null;
  return {
    type: "review-policy-panel",
    title: panel?.title ?? "方略",
    policy: createPolicyPanel(panel),
    closeActionId: "close-review-policy-panel",
    closeLabel: "关闭",
  };
}

function createDialogueModel(
  stage: MeetingStageDefinition,
  derivedState: MeetingDerivedState
): HouseDialogueViewModel | null {
  const overrideTextLines = derivedState.dialogueLinesByStageId?.[stage.id];
  if (
    stage.type !== "dialogue" &&
    stage.textLineIds == null &&
    overrideTextLines == null
  ) {
    return null;
  }

  const textLines =
    overrideTextLines != null
      ? [...overrideTextLines]
      : stage.textLineIds != null && stage.textLineIds.length > 0
      ? [...stage.textLineIds]
      : stage.dialogueId != null
        ? [stage.dialogueId]
        : [];
  if (textLines.length === 0) {
    return null;
  }

  return {
    mode: "narration",
    textLines,
    advanceActionId: "advance-meeting-stage",
    advanceHintText: "继续",
  };
}

function createActionContainerModel(
  stage: MeetingStageDefinition,
  derivedState: MeetingDerivedState,
  meetingChoiceSetsById: Record<string, MeetingChoiceSetDefinition>,
  gameState: GameState | undefined
): HouseActionContainerViewModel | null {
  if (
    derivedState.actionContainersByStageId != null &&
    Object.hasOwn(derivedState.actionContainersByStageId, stage.id)
  ) {
    return derivedState.actionContainersByStageId[stage.id] ?? null;
  }

  if (stage.type !== "choice" || stage.choiceSetId == null) {
    return null;
  }

  const choiceSet = meetingChoiceSetsById[stage.choiceSetId];
  if (choiceSet == null) {
    return null;
  }

  return {
    actions: choiceSet.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      disabled:
        gameState == null
          ? false
          : getMeetingChoiceDisabledReason(choice, gameState) != null,
    })),
    ...(choiceSet.title == null ? {} : { title: choiceSet.title }),
  };
}

export function createMeetingPresenterModel(
  input: CreateMeetingPresenterModelInput
): MeetingPresenterModel | null {
  const stage = readCurrentMeetingStage(input.meetingDefinition, input.sessionState);
  if (stage == null || input.sessionState == null) {
    return null;
  }

  const derivedState = (input.sessionState.derivedState ?? {}) as MeetingDerivedState;
  const meetingPanelsById = input.meetingPanelsById ?? {};
  const panel = stage.panelId == null ? null : meetingPanelsById[stage.panelId] ?? null;
  const stageOverlay = createStageOverlay({ stage, panel, derivedState });
  const stickyOverlay = createStickyOverlay({
    stickyOverlay: derivedState.stickyOverlay ?? null,
    meetingPanelsById,
  });

  return {
    stageId: stage.id,
    stageType: stage.type,
    status: input.sessionState.status,
    overlay: stageOverlay ?? stickyOverlay,
    dialogue: createDialogueModel(stage, derivedState),
    actionContainer: createActionContainerModel(
      stage,
      derivedState,
      input.meetingChoiceSetsById ?? {},
      input.gameState
    ),
  };
}
