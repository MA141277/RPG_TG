import type {
  AccountingGrade,
  AccountingGradeReward,
  LedgerQuestion,
} from "../../domain/grain-shop";
import { getGrainShopContentDefaults } from "../house-modules/grain-shop/grain-shop-content-defaults";
import { randomInt } from "../../shared/random";

export function generateLedgerQuestion(): LedgerQuestion {
  const bought = randomInt(12, 45);
  const sold = randomInt(3, bought - 1);
  const correctStock = bought - sold;
  const shouldBeCorrect = Math.random() < 0.5;
  let displayedStock = correctStock;

  if (!shouldBeCorrect) {
    const offset = randomInt(1, 3) * (Math.random() < 0.5 ? -1 : 1);
    displayedStock = correctStock + offset;
    if (displayedStock === correctStock || displayedStock < 0) {
      displayedStock = correctStock + randomInt(1, 3);
    }
  }

  return {
    bought,
    sold,
    displayedStock,
    isLedgerCorrect: displayedStock === correctStock,
  };
}

export function resolveAccountingGrade(score: number): AccountingGrade {
  if (score >= 18) {
    return "S";
  }
  if (score >= 14) {
    return "A";
  }
  if (score >= 10) {
    return "B";
  }
  if (score >= 6) {
    return "C";
  }
  return "D";
}

export function getAccountingGradeReward(
  grade: AccountingGrade
): AccountingGradeReward {
  const { accountingGradeRewards } = getGrainShopContentDefaults();
  return accountingGradeRewards[grade];
}

export function isLedgerAnswerCorrect(
  question: LedgerQuestion,
  playerSaysCorrect: boolean
): boolean {
  return playerSaysCorrect === question.isLedgerCorrect;
}
