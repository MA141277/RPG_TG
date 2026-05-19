/** 市场与粮价 */
const market = {
  grainPrice: 100,
  tradeMode: "buy",
};

const NPC_GREETINGS = [
  "粮价最近可不安稳。",
  "北边又闹灾了。",
  "做生意，算盘得快。",
  "这年头，粮比银子重要。",
];

const MARKET_RUMORS = [
  "凤阳粮价上涨。",
  "濠州最近缺粮。",
  "南边商队正在收粮。",
  "近来雨水不好。",
];

const GRAIN_PRICE_MIN = 80;
const GRAIN_PRICE_MAX = 160;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(items) {
  return items[randomInt(0, items.length - 1)];
}

function rollGrainPrice() {
  market.grainPrice = randomInt(GRAIN_PRICE_MIN, GRAIN_PRICE_MAX);
  return market.grainPrice;
}

function getInvestigateDialogue(price) {
  if (price > 130) {
    return "近来怕是要涨。";
  }
  if (price < 100) {
    return "如今粮路通畅，价倒是便宜。";
  }
  return "粮价还算平稳。";
}

function getTradeTotal(quantity) {
  return market.grainPrice * quantity;
}
