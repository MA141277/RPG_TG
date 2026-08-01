import type {
  ActivePlayableSession,
  PlayableResult,
  PlayableSettlementRoute,
  PlayableFactValue,
} from "../contracts/playable-runtime";
import type { Effect } from "../contracts/effect";
import { readDefaultPlayableIntegrationRegistry } from "./playable-runtime-registries";

export function createPlayableResultShell(input: {
  session: ActivePlayableSession;
  outcome: PlayableResult["outcome"];
  factResult: PlayableResult["factResult"];
  effects?: PlayableResult["effects"] | undefined;
  followUpEventId?: string | undefined;
}): PlayableResult {
  return {
    integrationId: input.session.integrationId,
    outcome: input.outcome,
    factResult: input.factResult,
    ...(input.followUpEventId == null
      ? {}
      : { followUpEventId: input.followUpEventId }),
    handoff: {
      type: input.session.ownerContext.returnPolicy,
      ownerKind: input.session.ownerContext.ownerKind,
      ownerId: input.session.ownerContext.ownerId,
      ...(input.session.ownerContext.sessionToken == null
        ? {}
        : { sessionToken: input.session.ownerContext.sessionToken }),
    },
    effects: input.effects ?? [],
  };
}

export function resolvePlayableResultRouting(input: {
  session: ActivePlayableSession;
  outcome: PlayableResult["outcome"];
  factResult: PlayableResult["factResult"];
  settlementEffects?: PlayableResult["effects"] | undefined;
  followUpEventId?: string | undefined;
}): PlayableResult {
  const routedEventId =
    input.followUpEventId ?? resolveSettlementRouteEventId(input);
  const contextEffects = createPlayableResultContextEffects(input);
  return createPlayableResultShell({
    session: input.session,
    outcome: input.outcome,
    factResult: input.factResult,
    effects:
      routedEventId == null
        ? [...contextEffects, ...(input.settlementEffects ?? [])]
        : contextEffects,
    followUpEventId: routedEventId,
  });
}

function createPlayableResultContextEffects(input: {
  session: ActivePlayableSession;
  outcome: PlayableResult["outcome"];
  factResult: PlayableResult["factResult"];
}): Effect[] {
  const effects: Effect[] = [
    {
      type: "setVariable",
      key: "var.playable.last.integrationId",
      value: input.session.integrationId,
    },
    {
      type: "setVariable",
      key: "var.playable.last.playableId",
      value: input.session.playableId,
    },
    {
      type: "setVariable",
      key: "var.playable.last.outcome",
      value: input.outcome,
    },
    {
      type: "setVariable",
      key: "var.playable.last.status",
      value: input.factResult.status,
    },
  ];

  const launchPayload = readLaunchPayload(input.session);
  for (const [key, value] of Object.entries(launchPayload)) {
    const normalized = normalizeContextVariableValue(value);
    if (normalized == null) {
      continue;
    }
    effects.push({
      type: "setVariable",
      key: `var.playable.last.config.${key}`,
      value: normalized,
    });
  }

  for (const [key, value] of Object.entries(input.factResult.metrics ?? {})) {
    const normalized = normalizeContextVariableValue(value);
    if (normalized == null) {
      continue;
    }
    effects.push({
      type: "setVariable",
      key: `var.playable.last.metrics.${key}`,
      value: normalized,
    });
  }

  for (const [key, value] of Object.entries(input.factResult.detail ?? {})) {
    const normalized = normalizeContextVariableValue(value);
    if (normalized == null) {
      continue;
    }
    effects.push({
      type: "setVariable",
      key: `var.playable.last.detail.${key}`,
      value: normalized,
    });
  }

  return effects;
}

function readLaunchPayload(
  session: ActivePlayableSession
): Record<string, unknown> {
  const state = session.state;
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return {};
  }
  const launchPayload = (state as Record<string, unknown>).launchPayload;
  return launchPayload != null &&
    typeof launchPayload === "object" &&
    !Array.isArray(launchPayload)
    ? (launchPayload as Record<string, unknown>)
    : {};
}

function normalizeContextVariableValue(
  value: unknown
): string | number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return null;
}

function resolveSettlementRouteEventId(input: {
  session: ActivePlayableSession;
  outcome: PlayableResult["outcome"];
  factResult: PlayableResult["factResult"];
}): string | undefined {
  const integration = readDefaultPlayableIntegrationRegistry().get(
    input.session.integrationId
  );
  const settlementRoutes = integration?.outcomeConfig.settlementRoutes ?? [];
  const matchedRoute = settlementRoutes.find((route) =>
    doesSettlementRouteMatch(route, input.outcome, input.factResult)
  );
  if (matchedRoute == null) {
    return undefined;
  }
  const targetEventId =
    typeof matchedRoute.targetEventId === "string"
      ? matchedRoute.targetEventId.trim()
      : "";
  return targetEventId.length > 0 ? targetEventId : undefined;
}

function doesSettlementRouteMatch(
  route: PlayableSettlementRoute,
  outcome: PlayableResult["outcome"],
  factResult: PlayableResult["factResult"]
): boolean {
  if (route.enabled === false) {
    return false;
  }
  const conditions = route.conditions;
  if (conditions == null) {
    return true;
  }
  if (
    Array.isArray(conditions.outcomeIn) &&
    conditions.outcomeIn.length > 0 &&
    !conditions.outcomeIn.includes(outcome)
  ) {
    return false;
  }
  const score = readNumericMetric(factResult.metrics?.score);
  if (typeof conditions.scoreMin === "number" && (score == null || score < conditions.scoreMin)) {
    return false;
  }
  if (typeof conditions.scoreMax === "number" && (score == null || score > conditions.scoreMax)) {
    return false;
  }
  for (const metricRule of conditions.metricRules ?? []) {
    const metricValue = factResult.metrics?.[metricRule.metricKey];
    if (!doesMetricRuleMatch(metricValue, metricRule.operator, metricRule.value)) {
      return false;
    }
  }
  return true;
}

function readNumericMetric(value: PlayableFactValue | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function doesMetricRuleMatch(
  actual: PlayableFactValue | undefined,
  operator: ">" | ">=" | "<" | "<=" | "=",
  expected: string | number | boolean
): boolean {
  if (actual == null) {
    return false;
  }
  if (operator === "=") {
    return actual === expected;
  }
  if (typeof actual !== "number" || typeof expected !== "number") {
    return false;
  }
  if (operator === ">") {
    return actual > expected;
  }
  if (operator === ">=") {
    return actual >= expected;
  }
  if (operator === "<") {
    return actual < expected;
  }
  return actual <= expected;
}
