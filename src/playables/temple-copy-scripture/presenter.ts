import type {
  ActivePlayableSession,
  PlayablePresenterModel,
} from "../../core/contracts/playable-runtime";
import type {
  TempleCopyScriptureCompletion,
  TempleCopyScripturePresenterModel,
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

function presentTempleCopyScriptureSession(
  session: TempleCopyScriptureSession
): TempleCopyScripturePresenterModel {
  const prompt = session.prompts[session.currentPromptIndex] ?? null;
  const lastHistory = session.history[session.history.length - 1] ?? null;
  const summaryLines = [
    session.briefing,
    `当前得分 ${session.score} / ${session.requiredScore}，失误 ${session.mistakes} 次。`,
  ];
  return {
    title: session.title,
    briefing: session.briefing,
    summaryLines,
    progressLabel: `第 ${Math.min(
      session.currentPromptIndex + 1,
      session.prompts.length
    )} / ${session.prompts.length} 段`,
    promptText: prompt?.text ?? "本轮抄录已完成。",
    choices: prompt?.choices ?? [],
    feedbackLine:
      lastHistory == null
        ? "静心观字，选出最合适的抄录手法。"
        : lastHistory.success
          ? `上一段已用「${lastHistory.selectedChoiceLabel}」稳稳落笔。`
          : `上一段错选了「${lastHistory.selectedChoiceLabel}」，正确应为「${lastHistory.expectedChoiceLabel}」。`,
  };
}

export function presentTempleCopyScripture(
  session: ActivePlayableSession
): PlayablePresenterModel {
  const runtimeState = readTempleRuntimeState(session.state);
  if (runtimeState == null) {
    return {
      playableId: session.playableId,
      layout: "panel",
      title: "寺庙抄经",
      summaryLines: [],
      actions: [],
    };
  }

  if (runtimeState.completion != null) {
    return {
      playableId: session.playableId,
      layout: "panel",
      title: runtimeState.completion.title,
      summaryLines: [
        `评语：${
          runtimeState.completion.outcome === "success"
            ? "字迹稳成"
            : runtimeState.completion.outcome === "failure"
              ? "仍需磨练"
              : "中途搁笔"
        }`,
        `结果：${runtimeState.completion.outcome}`,
        `得分：${runtimeState.completion.score}`,
        ...runtimeState.completion.summaryLines,
      ],
      actions: [],
      detail: {
        overlayVariant: "result",
      },
    };
  }

  const presenter = presentTempleCopyScriptureSession(runtimeState.session);
  return {
    playableId: session.playableId,
    layout: "panel",
    title: presenter.title,
    summaryLines: [
      presenter.briefing,
      presenter.progressLabel,
      presenter.promptText,
      ...presenter.summaryLines,
      presenter.feedbackLine,
    ],
    actions: [
      ...presenter.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        commandType: "custom" as const,
      })),
      {
        id: "cancel",
        label: "暂停抄录",
        commandType: "cancel" as const,
      },
    ],
    detail: {
      overlayVariant: "active",
    },
  };
}
