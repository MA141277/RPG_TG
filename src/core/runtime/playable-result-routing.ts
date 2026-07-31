import type {
  ActivePlayableSession,
  PlayableResult,
  PlayableSettlementRoute,
  PlayableFactValue,
} from "../contracts/playable-runtime";
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
  return createPlayableResultShell({
    session: input.session,
    outcome: input.outcome,
    factResult: input.factResult,
    effects: input.settlementEffects,
    followUpEventId: routedEventId,
  });
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
