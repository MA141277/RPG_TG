/** 帮忙算账 — 快速核账小游戏 */
const accountingGame = {
  isRunning: false,
  score: 0,
  secondsLeft: 30,
  timerId: null,
  currentQuestion: null,
};

const GAME_DURATION_SEC = 30;

const GRADE_REWARDS = {
  S: { math: 3, money: 80, relationship: 3, label: "S" },
  A: { math: 2, money: 50, relationship: 2, label: "A" },
  B: { math: 1, money: 30, relationship: 1, label: "B" },
  C: { math: 0, money: 10, relationship: 0, label: "C" },
  D: { math: -1, money: 0, relationship: 0, label: "D" },
};

function generateLedgerQuestion() {
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

function getGrade(score) {
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

function applyGradeRewards(gradeKey) {
  const reward = GRADE_REWARDS[gradeKey];
  player.math += reward.math;
  player.money += reward.money;
  player.relationship += reward.relationship;
  player.time += 1;
  return reward;
}

function buildResultHtml(gradeKey, score, reward) {
  const mathText =
    reward.math > 0
      ? `算术 +${reward.math}`
      : reward.math < 0
        ? `算术 ${reward.math}`
        : "算术 不变";
  const moneyText = reward.money > 0 ? `金钱 +${reward.money}` : "金钱 不变";
  const relText =
    reward.relationship > 0
      ? `与掌柜关系 +${reward.relationship}`
      : "与掌柜关系 不变";

  return `
    <p class="result-grade">评级：<strong>${gradeKey}</strong></p>
    <p>本局得分：${score} 分</p>
    <ul class="result-rewards">
      <li>${mathText}</li>
      <li>${moneyText}</li>
      <li>${relText}</li>
      <li>时间 +1</li>
    </ul>
  `;
}

function nextQuestion() {
  accountingGame.currentQuestion = generateLedgerQuestion();
  renderLedgerQuestion(accountingGame.currentQuestion);
}

function tickGameTimer() {
  if (!accountingGame.isRunning) {
    return;
  }
  accountingGame.secondsLeft -= 1;
  updateGameHud(accountingGame.secondsLeft, accountingGame.score);
  if (accountingGame.secondsLeft <= 0) {
    endAccountingGame();
  }
}

function startAccountingGame() {
  if (accountingGame.isRunning) {
    return;
  }
  accountingGame.isRunning = true;
  accountingGame.score = 0;
  accountingGame.secondsLeft = GAME_DURATION_SEC;
  updateGameHud(accountingGame.secondsLeft, accountingGame.score);
  showGameOverlay();
  nextQuestion();
  accountingGame.timerId = window.setInterval(tickGameTimer, 1000);
}

function handleLedgerAnswer(playerSaysCorrect) {
  if (!accountingGame.isRunning || !accountingGame.currentQuestion) {
    return;
  }
  const { isLedgerCorrect } = accountingGame.currentQuestion;
  if (playerSaysCorrect === isLedgerCorrect) {
    accountingGame.score += 1;
    updateGameHud(accountingGame.secondsLeft, accountingGame.score);
  }
  nextQuestion();
}

function endAccountingGame() {
  if (!accountingGame.isRunning) {
    return;
  }
  accountingGame.isRunning = false;
  window.clearInterval(accountingGame.timerId);
  accountingGame.timerId = null;
  hideGameOverlay();

  const gradeKey = getGrade(accountingGame.score);
  const reward = applyGradeRewards(gradeKey);
  updatePlayerStatus();
  showResultModal(buildResultHtml(gradeKey, accountingGame.score, reward));
}
