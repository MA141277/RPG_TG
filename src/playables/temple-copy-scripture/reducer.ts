import type {
  ActivePlayableSession,
  PlayableCommand,
} from "../../core/contracts/playable-runtime";
import type {
  TempleCopyScriptureCommand,
  TempleCopyScriptureCompletion,
  TempleCopyScriptureHistoryEntry,
  TempleCopyScriptureRuntimeState,
  TempleCopyScriptureSession,
} from "./contract";

function readTempleRuntimeState(
  state: ActivePlayableSession["state"]
): TempleCopyScriptureRuntimeState | null {
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return null;
  }
  const record = state as Record<string, unknown>;
  const session =
    record.session != null &&
    typeof record.session === "object" &&
    !Array.isArray(record.session)
      ? (record.session as TempleCopyScriptureSession)
      : null;
  const completion =
    record.completion != null &&
    typeof record.completion === "object" &&
    !Array.isArray(record.completion)
      ? (record.completion as TempleCopyScriptureCompletion)
      : undefined;
  return session == null ? null : { session, completion };
}

function readChoiceLabel(
  session: TempleCopyScriptureSession,
  promptIndex: number,
  choiceId: string
): string {
  const prompt = session.prompts[promptIndex];
  const choice = prompt?.choices.find((entry) => entry.id === choiceId);
  return choice?.label ?? choiceId;
}

function createCompletion(
  session: TempleCopyScriptureSession,
  outcome: TempleCopyScriptureCompletion["outcome"]
): TempleCopyScriptureCompletion {
  const completedPrompts = session.history.length;
  const summaryLines =
    outcome === "cancelled"
      ? [
          `已完成 ${completedPrompts} 段抄录。`,
          `当前得分 ${session.score}，失误 ${session.mistakes} 次。`,
        ]
      : [
          `共完成 ${completedPrompts} 段抄录。`,
          `答对 ${session.score} 段，失误 ${session.mistakes} 次。`,
          outcome === "success"
            ? "住持认可了你的字迹与耐性。"
            : "字迹尚未稳住，还需继续磨练。",
        ];
  return {
    outcome,
    score: session.score,
    mistakes: session.mistakes,
    completedPrompts,
    title: session.title,
    summaryLines,
  };
}

function reduceTempleCopyScriptureSession(
  session: TempleCopyScriptureSession,
  command: TempleCopyScriptureCommand
): {
  session: TempleCopyScriptureSession;
  completion?: TempleCopyScriptureCompletion | undefined;
} {
  if (session.phase !== "active") {
    return { session };
  }

  if (command.type === "cancel") {
    const cancelledSession = {
      ...session,
      phase: "cancelled" as const,
    };
    return {
      session: cancelledSession,
      completion: createCompletion(cancelledSession, "cancelled"),
    };
  }

  const prompt = session.prompts[session.currentPromptIndex];
  if (prompt == null) {
    const completedSession = {
      ...session,
      phase: "completed" as const,
    };
    const outcome =
      completedSession.score >= completedSession.requiredScore
        ? "success"
        : "failure";
    return {
      session: completedSession,
      completion: createCompletion(completedSession, outcome),
    };
  }

  const success = command.choiceId === prompt.expectedChoiceId;
  const historyEntry: TempleCopyScriptureHistoryEntry = {
    promptId: prompt.id,
    promptText: prompt.text,
    selectedChoiceId: command.choiceId,
    selectedChoiceLabel: readChoiceLabel(
      session,
      session.currentPromptIndex,
      command.choiceId
    ),
    expectedChoiceId: prompt.expectedChoiceId,
    expectedChoiceLabel: readChoiceLabel(
      session,
      session.currentPromptIndex,
      prompt.expectedChoiceId
    ),
    success,
  };
  const nextSession: TempleCopyScriptureSession = {
    ...session,
    currentPromptIndex: session.currentPromptIndex + 1,
    score: session.score + (success ? 1 : 0),
    mistakes: session.mistakes + (success ? 0 : 1),
    history: [...session.history, historyEntry],
  };

  if (nextSession.currentPromptIndex < nextSession.prompts.length) {
    return { session: nextSession };
  }

  const completedSession = {
    ...nextSession,
    phase: "completed" as const,
  };
  const outcome =
    completedSession.score >= completedSession.requiredScore
      ? "success"
      : "failure";
  return {
    session: completedSession,
    completion: createCompletion(completedSession, outcome),
  };
}

export function reduceTempleCopyScripture(
  session: ActivePlayableSession,
  command: PlayableCommand
): ActivePlayableSession {
  const runtimeState = readTempleRuntimeState(session.state);
  if (runtimeState == null) {
    return session;
  }

  const templeCommand =
    command.type === "cancel"
      ? ({ type: "cancel" } as const)
      : command.type === "custom" && command.actionId.trim().length > 0
        ? ({
            type: "choose",
            choiceId: command.actionId,
          } as const)
        : null;
  if (templeCommand == null) {
    return session;
  }

  const reduction = reduceTempleCopyScriptureSession(
    runtimeState.session,
    templeCommand
  );
  const nextState: TempleCopyScriptureRuntimeState =
    reduction.completion == null
      ? {
          session: reduction.session,
        }
      : {
          session: reduction.session,
          completion: reduction.completion,
        };

  return {
    ...session,
    status:
      reduction.completion == null
        ? "active"
        : reduction.completion.outcome === "cancelled"
          ? "cancelled"
          : "completed",
    state: nextState as Record<string, unknown>,
  };
}
