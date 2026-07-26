export function createValidatorPlayableSettlement() {
  return {
    outcome: "pending" as const,
    effects: [] as const,
  };
}
