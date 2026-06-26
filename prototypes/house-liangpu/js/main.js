/** 粮铺入口：按钮事件与买卖逻辑 */
function handleBuyClick() {
  openTradeModal("buy");
}

function handleSellClick() {
  openTradeModal("sell");
}

function handleInvestigateClick() {
  const price = market.grainPrice;
  const dialogue = getInvestigateDialogue(price);
  const rumor = pickRandom(MARKET_RUMORS);
  player.relationship += 1;
  player.time += 1;
  updatePlayerStatus();
  showAlert(
    "陈掌柜",
    `<p>「${dialogue}」</p><p class="rumor-line">传闻：${rumor}</p><p class="price-hint">当前粮价约 ${price} 文/石。</p>`
  );
}

function handleLeaveClick() {
  showAlert("离开粮铺", "<p>你向掌柜拱手告辞，走出了粮铺大门。</p>");
}

function handleTradeConfirm() {
  const qty = Math.max(1, parseInt(ui.tradeQuantity.value, 10) || 1);
  const total = getTradeTotal(qty);

  if (market.tradeMode === "buy") {
    if (player.money < total) {
      showAlert("银钱不足", "<p>囊中羞涩，买不起这么多粮食。</p>");
      return;
    }
    player.money -= total;
    player.food += qty;
  } else {
    if (player.food < qty) {
      showAlert("粮食不足", "<p>随身带的粮食不够这么多。</p>");
      return;
    }
    player.money += total;
    player.food -= qty;
  }

  player.time += 1;
  updatePlayerStatus();
  closeTradeModal();
  const action = market.tradeMode === "buy" ? "购入" : "卖出";
  showAlert("成交", `<p>已${action} ${qty} 石粮食，花费/收入 ${total} 文。</p>`);
}

function bindHouseEvents() {
  document.getElementById("btn-buy").addEventListener("click", handleBuyClick);
  document.getElementById("btn-sell").addEventListener("click", handleSellClick);
  document.getElementById("btn-investigate").addEventListener("click", handleInvestigateClick);
  document.getElementById("btn-accounting").addEventListener("click", startAccountingGame);
  document.getElementById("btn-leave").addEventListener("click", handleLeaveClick);

  ui.modalClose.addEventListener("click", hideAlert);
  ui.modalOverlay.addEventListener("click", (event) => {
    if (event.target === ui.modalOverlay) {
      hideAlert();
    }
  });

  document.getElementById("trade-cancel").addEventListener("click", closeTradeModal);
  document.getElementById("trade-confirm").addEventListener("click", handleTradeConfirm);
  document.getElementById("qty-minus").addEventListener("click", () => {
    ui.tradeQuantity.value = String(
      Math.max(1, (parseInt(ui.tradeQuantity.value, 10) || 1) - 1)
    );
    updateTradeDisplay();
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    ui.tradeQuantity.value = String((parseInt(ui.tradeQuantity.value, 10) || 1) + 1);
    updateTradeDisplay();
  });
  ui.tradeQuantity.addEventListener("input", updateTradeDisplay);
  ui.tradeOverlay.addEventListener("click", (event) => {
    if (event.target === ui.tradeOverlay) {
      closeTradeModal();
    }
  });

  document.getElementById("btn-ledger-correct").addEventListener("click", () => {
    handleLedgerAnswer(true);
  });
  document.getElementById("btn-ledger-wrong").addEventListener("click", () => {
    handleLedgerAnswer(false);
  });
  document.getElementById("result-close").addEventListener("click", hideResultModal);
  ui.resultOverlay.addEventListener("click", (event) => {
    if (event.target === ui.resultOverlay) {
      hideResultModal();
    }
  });
}

function initHousePage() {
  initUiRefs();
  rollGrainPrice();
  setNpcGreeting();
  updatePlayerStatus();
  bindHouseEvents();
}

document.addEventListener("DOMContentLoaded", initHousePage);
