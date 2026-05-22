export type TavernWorkOffer = {
  id: string;
  title: string;
  description: string;
  rewardText: string;
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
