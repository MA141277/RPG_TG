import type {
  ActivePlayableSession,
  PlayableResult,
} from "../../core/contracts/playable-runtime";
import { resolvePlayableResultRouting } from "../../core/runtime/playable-result-routing";
import type {
  TempleCopyScriptureCompletion,
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

export function completeTempleCopyScripture(
  session: ActivePlayableSession
): PlayableResult | null {
  const runtimeState = readTempleRuntimeState(session.state);
  if (runtimeState?.completion == null) {
    return null;
  }

  return resolvePlayableResultRouting({
    session,
    outcome: runtimeState.completion.outcome,
    factResult: {
      status:
        runtimeState.completion.outcome === "success"
          ? "completed"
          : runtimeState.completion.outcome === "failure"
            ? "failed"
            : "cancelled",
      metrics: {
        score: runtimeState.completion.score,
        mistakes: runtimeState.completion.mistakes,
        completedPrompts: runtimeState.completion.completedPrompts,
      },
      detail: {
        title: runtimeState.completion.title,
      },
    },
    settlementEffects: [],
  });
}
