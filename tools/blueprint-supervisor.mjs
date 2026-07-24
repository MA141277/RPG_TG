import path from "node:path";
import { fileURLToPath } from "node:url";

import { inspectBlueprintWorkflow } from "./blueprint-version-governance.mjs";
import { lintBlueprintDocs } from "./lint-blueprints.mjs";

const STOP_CUE_FRAGMENTS = [
  "\u5df2\u5b8c\u6210",
  "\u5b8c\u6210",
  "\u505c\u6b62",
  "\u5148\u505c\u4e00\u4e0b",
  "\u7b49\u5f85\u786e\u8ba4",
  "summary",
  "final",
];

export async function runBlueprintSupervisor(repoRoot = process.cwd(), options = {}) {
  const mergedOptions = {
    once: false,
    maxTurns: 20,
    json: false,
    failOnIllegalStop: false,
    agentRunner: async () => ({
      channel: "none",
      text: "",
      intent: "unknown",
    }),
    ...options,
  };

  return runSupervisorLoop(repoRoot, mergedOptions);
}

async function runSupervisorLoop(repoRoot, options) {
  let turns = 0;
  let illegalStopCount = 0;
  const messages = [];

  while (turns < options.maxTurns) {
    const state = readSupervisorState(repoRoot);
    const decision = decideSupervisorAction(state);

    if (decision.action === "error") {
      return {
        ok: false,
        turns,
        stoppedLegally: false,
        illegalStopCount,
        messages: [...messages, decision.reason],
      };
    }

    if (decision.action === "stop") {
      return {
        ok: true,
        turns,
        stoppedLegally: true,
        illegalStopCount,
        messages: [...messages, `Stopped legally: ${decision.reason}`],
      };
    }

    const turn = await options.agentRunner({
      state,
      instruction: buildSupervisorInstruction(state),
    });
    const freshState = readSupervisorState(repoRoot);
    const verdict = classifyTurnVerdict(freshState, turn);

    turns += 1;

    if (verdict.verdict === "illegal-stop") {
      illegalStopCount += 1;
      messages.push("illegal_stop detected; continuing");
      if (options.failOnIllegalStop || options.once) {
        return {
          ok: !options.failOnIllegalStop,
          turns,
          stoppedLegally: false,
          illegalStopCount,
          messages,
        };
      }
      continue;
    }

    if (verdict.verdict === "accepted-stop") {
      return {
        ok: true,
        turns,
        stoppedLegally: true,
        illegalStopCount,
        messages: [...messages, "agent stop accepted by supervisor"],
      };
    }

    if (options.once) {
      return {
        ok: true,
        turns,
        stoppedLegally: false,
        illegalStopCount,
        messages,
      };
    }
  }

  return {
    ok: true,
    turns,
    stoppedLegally: false,
    illegalStopCount,
    messages: [...messages, "max turns reached"],
  };
}

function readSupervisorState(repoRoot) {
  const lintFailures = lintBlueprintDocs(repoRoot);
  const inspectResult = inspectBlueprintWorkflow(repoRoot);

  return {
    lintOk: lintFailures.length === 0,
    lintFailures,
    inspectOk: inspectResult.ok,
    recommendedAction: inspectResult.ok ? inspectResult.recommendedAction : "invalid",
    humanDecisionRequired: inspectResult.ok ? inspectResult.humanDecisionRequired : false,
    humanDecisionReason: inspectResult.ok ? inspectResult.humanDecisionReason : null,
    activeVersionPlanPath: inspectResult.ok ? inspectResult.activeVersionPlanPath : null,
    activeQueueId: inspectResult.ok ? inspectResult.activeQueueId : null,
    activeTaskId: inspectResult.ok ? inspectResult.activeTaskId : null,
    stopReason: inspectResult.ok ? inspectResult.stop.stopReason : "none",
    stopBasis: inspectResult.ok ? inspectResult.stop.stopBasis : "none",
    nextUnblockedAction: inspectResult.ok ? inspectResult.stop.nextUnblockedAction : "none",
    humanInputRequired: inspectResult.ok ? inspectResult.stop.humanInputRequired : false,
    stopAllowed: inspectResult.ok ? inspectResult.stop.stopAllowed : false,
  };
}

function decideSupervisorAction(state) {
  if (!state.lintOk) {
    return {
      action: "error",
      reason: `Blueprint lint failed:\n${state.lintFailures.join("\n")}`,
    };
  }

  if (!state.inspectOk) {
    return {
      action: "error",
      reason: "Blueprint inspect failed.",
    };
  }

  if (state.stopAllowed) {
    return {
      action: "stop",
      reason: state.stopReason,
    };
  }

  return {
    action: "continue",
    reason: state.recommendedAction,
  };
}

function classifyTurnVerdict(state, turn) {
  const triedToStop = detectAgentTriedToStop(turn);
  if (triedToStop && !state.stopAllowed) {
    return { verdict: "illegal-stop" };
  }

  if (triedToStop && state.stopAllowed) {
    return { verdict: "accepted-stop" };
  }

  return { verdict: "continue" };
}

function detectAgentTriedToStop(turn) {
  if (turn.channel === "final") {
    return true;
  }

  if (turn.intent === "stop") {
    return true;
  }

  const text = String(turn.text ?? "").toLowerCase();
  return STOP_CUE_FRAGMENTS.some((fragment) => text.includes(fragment.toLowerCase()));
}

function buildSupervisorInstruction(state) {
  switch (state.recommendedAction) {
    case "continue-active-queue":
      return `Resume active queue ${state.activeQueueId ?? "none"} and active task ${state.activeTaskId ?? "none"}.`;
    case "promote-candidate":
      return "Promote the lawful candidate queue and continue execution.";
    case "auto-route-same-family-residue":
      return "Route same-family residue to the recommended queue and continue.";
    default:
      return "Continue from current Blueprint truth.";
  }
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] != null && path.resolve(process.argv[1]) === currentFilePath) {
  const args = process.argv.slice(2);
  const once = args.includes("--once");
  const json = args.includes("--json");
  const maxTurnsIndex = args.indexOf("--max-turns");
  const maxTurns = maxTurnsIndex >= 0 ? Number(args[maxTurnsIndex + 1]) : 20;

  runBlueprintSupervisor(process.cwd(), { once, json, maxTurns }).then((result) => {
    if (json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      for (const line of result.messages) {
        console.log(line);
      }
    }
    process.exit(result.ok ? 0 : 1);
  });
}
