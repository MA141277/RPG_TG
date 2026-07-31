import type { GameState } from "../../domain/game-state";
import type { HouseActionViewModel } from "../../domain/house-module";

export type ReviewAdviceOption = {
  id: string;
  label: string;
  playerLine: string;
};

export const REVIEW_ADVICE_EMPTY_FALLBACK_LINE =
  "我还没有想法呢（通过游历获得意见）";

export function getAvailableReviewAdviceOptions(_input: {
  gameState: GameState;
  playerCharacterId: string;
}): ReviewAdviceOption[] {
  return [];
}

export function createReviewAdviceActionViewModels(input: {
  actionPrefix: string;
  options: ReviewAdviceOption[];
}): HouseActionViewModel[] {
  return input.options.map((option) => ({
    id: `${input.actionPrefix}${option.id}`,
    label: option.label,
    buttonSound: "light",
  }));
}

export function findSelectedReviewAdviceOption(input: {
  actionId: string;
  actionPrefix: string;
  options: ReviewAdviceOption[];
}): ReviewAdviceOption | null {
  if (!input.actionId.startsWith(input.actionPrefix)) {
    return null;
  }

  const optionId = input.actionId.slice(input.actionPrefix.length);
  return input.options.find((option) => option.id === optionId) ?? null;
}
