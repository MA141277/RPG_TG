"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLedgerQuestion = generateLedgerQuestion;
exports.resolveAccountingGrade = resolveAccountingGrade;
exports.getAccountingGradeReward = getAccountingGradeReward;
exports.isLedgerAnswerCorrect = isLedgerAnswerCorrect;
const grain_shop_content_1 = require("../../content/houses/grain-shop-content");
const random_1 = require("../../shared/random");
function generateLedgerQuestion() {
    const bought = (0, random_1.randomInt)(12, 45);
    const sold = (0, random_1.randomInt)(3, bought - 1);
    const correctStock = bought - sold;
    const shouldBeCorrect = Math.random() < 0.5;
    let displayedStock = correctStock;
    if (!shouldBeCorrect) {
        const offset = (0, random_1.randomInt)(1, 3) * (Math.random() < 0.5 ? -1 : 1);
        displayedStock = correctStock + offset;
        if (displayedStock === correctStock || displayedStock < 0) {
            displayedStock = correctStock + (0, random_1.randomInt)(1, 3);
        }
    }
    return {
        bought,
        sold,
        displayedStock,
        isLedgerCorrect: displayedStock === correctStock,
    };
}
function resolveAccountingGrade(score) {
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
function getAccountingGradeReward(grade) {
    return grain_shop_content_1.accountingGradeRewards[grade];
}
function isLedgerAnswerCorrect(question, playerSaysCorrect) {
    return playerSaysCorrect === question.isLedgerCorrect;
}
