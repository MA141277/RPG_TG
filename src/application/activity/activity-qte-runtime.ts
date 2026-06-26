import type { ActivityDefinition, ActivityHandlerId } from "../../domain/activity";
import type { ActivityQteSession } from "../../domain/activity-session";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import { advanceGameStateTimeSegments } from "../time/time-progression";

const QTE_MARKER_STEP = 7;

export type ActivityQteCompletionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function createActivityQteSession(
  activityDefinition: ActivityDefinition,
  handlerId: ActivityHandlerId
): ActivityQteSession {
  const totalRounds = Math.max(1, activityDefinition.qte?.totalRounds ?? 1);
  const requiredSuccesses = Math.max(
    1,
    Math.min(totalRounds, activityDefinition.qte?.requiredSuccesses ?? 1)
  );

  return {
    type: "qte-bar",
    activityId: activityDefinition.id,
    handlerId,
    title: activityDefinition.label,
    taskLabel: activityDefinition.label,
    round: 1,
    totalRounds,
    requiredSuccesses,
    successes: 0,
    markerPercent: 0,
    markerDirection: 1,
    targetStartPercent: resolveTargetStartPercent(1),
    targetWidthPercent: resolveTargetWidthPercent(1, totalRounds),
    timeAdvanceCost: Math.max(0, activityDefinition.timeAdvanceCost ?? 0),
    ...(activityDefinition.outcome?.completedFlagKey == null
      ? {}
      : { completedFlagKey: activityDefinition.outcome.completedFlagKey }),
    ...(activityDefinition.outcome?.gradeVariableKey == null
      ? {}
      : { gradeVariableKey: activityDefinition.outcome.gradeVariableKey }),
    ...(activityDefinition.outcome?.scoreVariableKey == null
      ? {}
      : { scoreVariableKey: activityDefinition.outcome.scoreVariableKey }),
  };
}

export function advanceActivityQteMarker(state: GameState): GameState {
  const session = state.runtime.activitySession;
  if (session?.type !== "qte-bar") {
    return state;
  }

  const nextMarker = session.markerPercent + session.markerDirection * QTE_MARKER_STEP;
  const boundedMarker = Math.max(0, Math.min(100, nextMarker));
  const nextDirection: 1 | -1 =
    nextMarker >= 100 ? -1 : nextMarker <= 0 ? 1 : session.markerDirection;

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        markerPercent: boundedMarker,
        markerDirection: nextDirection,
      },
    },
  };
}

export function stopActivityQte(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[]
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type !== "qte-bar" || session.activityId !== activityDefinition.id) {
    return {
      state,
      characterDefinitions,
    };
  }

  const hit =
    session.markerPercent >= session.targetStartPercent &&
    session.markerPercent <= session.targetStartPercent + session.targetWidthPercent;
  const nextSuccesses = session.successes + (hit ? 1 : 0);

  if (session.round < session.totalRounds) {
    const nextRound = session.round + 1;
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            round: nextRound,
            successes: nextSuccesses,
            markerPercent: 0,
            markerDirection: 1,
            targetStartPercent: resolveTargetStartPercent(nextRound),
            targetWidthPercent: resolveTargetWidthPercent(
              nextRound,
              session.totalRounds
            ),
          },
        },
      },
      characterDefinitions,
    };
  }

  const grade = nextSuccesses >= session.requiredSuccesses ? "success" : "failed";
  const effectResult =
    grade === "success"
      ? applyEffects(state, activityDefinition.outcome?.effects ?? [], {
          characterDefinitions,
        })
      : { state, characterDefinitions };
  const nextState =
    session.timeAdvanceCost <= 0
      ? effectResult.state
      : advanceGameStateTimeSegments(effectResult.state, session.timeAdvanceCost);

  return {
    state: {
      ...nextState,
      runtime: {
        ...nextState.runtime,
        flags: {
          ...nextState.runtime.flags,
          [`flag.${activityDefinition.id}.completed`]: true,
          ...(session.completedFlagKey == null
            ? {}
            : { [session.completedFlagKey]: true }),
        },
        variables: {
          ...nextState.runtime.variables,
          "var.activity.last_id": activityDefinition.id,
          "var.activity.last_handler": session.handlerId,
          [`var.${activityDefinition.id}.last_grade`]: grade,
          [`var.${activityDefinition.id}.last_score`]: nextSuccesses,
          ...(session.gradeVariableKey == null
            ? {}
            : { [session.gradeVariableKey]: grade }),
          ...(session.scoreVariableKey == null
            ? {}
            : { [session.scoreVariableKey]: nextSuccesses }),
        },
        activitySession: {
          type: "result",
          activityId: activityDefinition.id,
          title: activityDefinition.label,
          grade: grade === "success" ? "成功" : "失手",
          score: nextSuccesses,
          rewardLines:
            grade === "success"
              ? ["差事办妥，相关收益已经写入运行时状态。"]
              : ["差事未能办稳，本次不会写入成功收益。"],
        },
      },
    },
    characterDefinitions: effectResult.characterDefinitions,
  };
}

export function clearActivityResult(state: GameState): GameState {
  if (state.runtime.activitySession?.type !== "result") {
    return state;
  }

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: null,
    },
  };
}

function resolveTargetStartPercent(round: number): number {
  return 15 + ((round * 17 + 13) % 55);
}

function resolveTargetWidthPercent(round: number, totalRounds: number): number {
  if (round >= totalRounds) {
    return 16;
  }

  return round === totalRounds - 1 ? 18 : 22;
}
