export function createTestPlayableSettlement() {
  return {
    outcome: "pending" as const,
    effects: [] as const,
  };
}
