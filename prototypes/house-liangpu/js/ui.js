/** DOM 引用与界面刷新 */
const ui = {
  statusRoot: null,
  npcLine: null,
  modalOverlay: null,
  modalTitle: null,
  modalBody: null,
  modalClose: null,
  tradeOverlay: null,
  tradeTitle: null,
  tradePrice: null,
  tradeQuantity: null,
  tradeTotal: null,
  tradeConfirm: null,
  gameOverlay: null,
  gameTimer: null,
  gameScore: null,
  ledgerBought: null,
  ledgerSold: null,
  ledgerStock: null,
  resultOverlay: null,
  resultBody: null,
};

function initUiRefs() {
  ui.statusRoot = document.getElementById("player-status");
  ui.npcLine = document.getElementById("npc-line");
  ui.modalOverlay = document.getElementById("modal-overlay");
  ui.modalTitle = document.getElementById("modal-title");
  ui.modalBody = document.getElementById("modal-body");
  ui.modalClose = document.getElementById("modal-close");
  ui.tradeOverlay = document.getElementById("trade-overlay");
  ui.tradeTitle = document.getElementById("trade-title");
  ui.tradePrice = document.getElementById("trade-price");
  ui.tradeQuantity = document.getElementById("trade-quantity");
  ui.tradeTotal = document.getElementById("trade-total");
  ui.tradeConfirm = document.getElementById("trade-confirm");
  ui.gameOverlay = document.getElementById("game-overlay");
  ui.gameTimer = document.getElementById("game-timer");
  ui.gameScore = document.getElementById("game-score");
  ui.ledgerBought = document.getElementById("ledger-bought");
  ui.ledgerSold = document.getElementById("ledger-sold");
  ui.ledgerStock = document.getElementById("ledger-stock");
  ui.resultOverlay = document.getElementById("result-overlay");
  ui.resultBody = document.getElementById("result-body");
}

function updatePlayerStatus() {
  if (!ui.statusRoot) {
    return;
  }
  const fields = ["money", "food", "math", "relationship", "time"];
  fields.forEach((field) => {
    const el = ui.statusRoot.querySelector(`[data-field="${field}"]`);
    if (el) {
      el.textContent = String(player[field]);
    }
  });
}

function setNpcGreeting() {
  if (ui.npcLine) {
    ui.npcLine.textContent = pickRandom(NPC_GREETINGS);
  }
}

function showOverlay(overlay) {
  overlay.classList.remove("is-hidden");
}

function hideOverlay(overlay) {
  overlay.classList.add("is-hidden");
}

function showAlert(title, html) {
  ui.modalTitle.textContent = title;
  ui.modalBody.innerHTML = html;
  showOverlay(ui.modalOverlay);
}

function hideAlert() {
  hideOverlay(ui.modalOverlay);
}

function updateTradeDisplay() {
  const qty = Math.max(1, parseInt(ui.tradeQuantity.value, 10) || 1);
  ui.tradeQuantity.value = String(qty);
  ui.tradePrice.textContent = `当前粮价：1石 = ${market.grainPrice}文`;
  const total = getTradeTotal(qty);
  ui.tradeTotal.textContent = `合计：${total}文`;
  const isBuy = market.tradeMode === "buy";
  ui.tradeTitle.textContent = isBuy ? "买粮" : "卖粮";
  ui.tradeConfirm.textContent = isBuy ? "确认购买" : "确认卖出";
}

function openTradeModal(mode) {
  market.tradeMode = mode;
  rollGrainPrice();
  ui.tradeQuantity.value = "1";
  updateTradeDisplay();
  showOverlay(ui.tradeOverlay);
}

function closeTradeModal() {
  hideOverlay(ui.tradeOverlay);
}

function renderLedgerQuestion(question) {
  ui.ledgerBought.textContent = `购入：${question.bought}石`;
  ui.ledgerSold.textContent = `卖出：${question.sold}石`;
  ui.ledgerStock.textContent = `库存：${question.displayedStock}石`;
}

function updateGameHud(secondsLeft, score) {
  ui.gameTimer.textContent = String(secondsLeft);
  ui.gameScore.textContent = String(score);
}

function showGameOverlay() {
  showOverlay(ui.gameOverlay);
}

function hideGameOverlay() {
  hideOverlay(ui.gameOverlay);
}

function showResultModal(html) {
  ui.resultBody.innerHTML = html;
  showOverlay(ui.resultOverlay);
}

function hideResultModal() {
  hideOverlay(ui.resultOverlay);
}
