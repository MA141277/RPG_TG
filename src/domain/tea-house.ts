export const TEA_HOUSE_TOPIC_CARDS = ["义", "利", "名", "情", "势"] as const;

export type TeaHouseTopicCard = (typeof TEA_HOUSE_TOPIC_CARDS)[number];

export type TeaHouseDebateEmotion = "冷静" | "得意" | "愤怒";

export type TeaHouseActionAttributeChange = {
  key: "rhetoric";
  label: string;
  delta: number;
};

export type TeaHouseActionOutcome = {
  relationshipChange: number;
  attributeChange: TeaHouseActionAttributeChange[];
  intelGain: number;
  moneyChange: number;
  timeCost: number;
};

export type TeaHouseDebateWinner = "player" | "npc" | "draw";

export type TeaHouseDebateSummary = {
  winner: TeaHouseDebateWinner;
  rounds: number;
  playerSpiritRemaining: number;
  npcSpiritRemaining: number;
  timeoutCount: number;
};

export function getTeaHouseIntelVariableKey(houseId: string): string {
  return `${houseId}.intel`;
}

export function getTeaHouseTimeVariableKey(houseId: string): string {
  return `${houseId}.time`;
}

export function getTeaHouseFixedNpcFavorabilityVariableKey(
  houseId: string,
  actorId: string
): string {
  return `${houseId}.${actorId}.favorability`;
}
