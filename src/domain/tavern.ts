export type TavernWorkType = "dishwashing" | "random-event";

export type TavernWorkOffer = {
  id: string;
  type: TavernWorkType;
  title: string;
  description: string;
  rewardText: string;
  maxRewardGold: number;
  minFame?: number;
  canStartImmediately?: boolean;
};

export function getTavernTimeVariableKey(houseId: string): string {
  return `${houseId}.time`;
}

export function getTavernDrinkCountVariableKey(houseId: string): string {
  return `${houseId}.drinkCount`;
}

export function getTavernCompletedWorkKey(houseId: string, offerId: string): string {
  return `${houseId}.work.${offerId}.completed`;
}

export function getTavernFailedWorkKey(houseId: string, offerId: string): string {
  return `${houseId}.work.${offerId}.failed`;
}

export function getTavernAcceptedWorkKey(houseId: string, offerId: string): string {
  return `${houseId}.work.${offerId}.accepted`;
}

export function getTavernActiveWorkIdsVariableKey(houseId: string): string {
  return `${houseId}.work.activeIds`;
}

export function getTavernWorkProgressVariableKey(
  houseId: string,
  offerId: string
): string {
  return `${houseId}.work.${offerId}.progress`;
}
