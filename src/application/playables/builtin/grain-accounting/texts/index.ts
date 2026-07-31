export const GRAIN_ACCOUNTING_TEXT_NAMESPACE = "builtin.grain-accounting";

export const GRAIN_ACCOUNTING_TEXT = {
  eyebrow: "玩法",
  title: "粮账核算",
  describeTrade(question: {
    bought?: unknown;
    sold?: unknown;
  }): string {
    return `买入 ${String(question.bought ?? "")} 石，卖出 ${String(question.sold ?? "")} 石。`;
  },
  describeDisplayedStock(question: {
    displayedStock?: unknown;
  }): string {
    return `账面余粮 ${String(question.displayedStock ?? "")} 石。`;
  },
  describeScore(overlay: {
    score?: unknown;
    wrongCount?: unknown;
    secondsLeft?: unknown;
  }): string {
    return `得分 ${String(overlay.score ?? "")} / 错误 ${String(
      overlay.wrongCount ?? ""
    )} / 剩余 ${String(overlay.secondsLeft ?? "")} 秒`;
  },
  answerCorrect: "账目正确",
  answerWrong: "账目有误",
} as const;
