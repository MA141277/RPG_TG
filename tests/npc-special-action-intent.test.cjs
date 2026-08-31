const test = require("node:test");
const assert = require("node:assert/strict");

function loadMatcher() {
  return require("../.test-dist/application/npc-interaction/npc-special-action-intent.js");
}

function createAction(id, label, extra = {}) {
  return {
    id,
    label,
    kind: "special",
    ...extra,
  };
}

test("market buy intent routes generic phrase like 我想买点东西 to buy-goods", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const matchedAction = matchNpcSpecialActionByText({
    text: "我想买点东西",
    actions: [
      createAction("investigate-market", "调查行情"),
      createAction("buy-goods", "买入货物"),
      createAction("sell-goods", "卖出货物"),
    ],
  });

  assert.equal(matchedAction?.id, "buy-goods");
});

test("market sell intent routes generic phrase like 我想卖些货 to sell-goods", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const matchedAction = matchNpcSpecialActionByText({
    text: "我想卖些货",
    actions: [
      createAction("investigate-market", "调查行情"),
      createAction("buy-goods", "买入货物"),
      createAction("sell-goods", "卖出货物"),
    ],
  });

  assert.equal(matchedAction?.id, "sell-goods");
});

test("market inquiry intent routes phrase like 你这都卖什么货 to investigate-market", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const matchedAction = matchNpcSpecialActionByText({
    text: "你这都卖什么货",
    actions: [
      createAction("investigate-market", "调查行情"),
      createAction("buy-goods", "买入货物"),
      createAction("sell-goods", "卖出货物"),
    ],
  });

  assert.equal(matchedAction?.id, "investigate-market");
});

test("drink intent routes phrase like 来壶酒 to order-drink", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const matchedAction = matchNpcSpecialActionByText({
    text: "来壶酒",
    actions: [
      createAction("open-work", "工作"),
      createAction("order-drink", "喝酒"),
      createAction("open-gamble", "赌博"),
    ],
  });

  assert.equal(matchedAction?.id, "order-drink");
});

test("current built-in NPC special actions all accept at least one natural-language phrase", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const scenarios = [
    {
      text: "你这都卖什么货",
      expectedActionId: "investigate-market",
      actions: [
        createAction("investigate-market", "调查行情"),
        createAction("buy-goods", "买入货物"),
        createAction("sell-goods", "卖出货物"),
      ],
    },
    {
      text: "我想买点东西",
      expectedActionId: "buy-goods",
      actions: [
        createAction("investigate-market", "调查行情"),
        createAction("buy-goods", "买入货物"),
        createAction("sell-goods", "卖出货物"),
      ],
    },
    {
      text: "我想卖些货",
      expectedActionId: "sell-goods",
      actions: [
        createAction("investigate-market", "调查行情"),
        createAction("buy-goods", "买入货物"),
        createAction("sell-goods", "卖出货物"),
      ],
    },
    {
      text: "我来治治伤",
      expectedActionId: "heal",
      actions: [
        createAction("heal", "疗伤"),
        createAction("open-buy", "买药"),
        createAction("start-compounding", "配药"),
      ],
    },
    {
      text: "给我抓点药",
      expectedActionId: "open-buy",
      actions: [
        createAction("heal", "疗伤"),
        createAction("open-buy", "买药"),
        createAction("start-compounding", "配药"),
      ],
    },
    {
      text: "我想配副药",
      expectedActionId: "start-compounding",
      actions: [
        createAction("heal", "疗伤"),
        createAction("open-buy", "买药"),
        createAction("start-compounding", "配药"),
      ],
    },
    {
      text: "来壶茶",
      expectedActionId: "serve-tea",
      actions: [
        createAction("serve-tea", "请茶"),
        createAction("inquire", "打听"),
        createAction("start-debate", "舌战"),
      ],
    },
    {
      text: "打听点消息",
      expectedActionId: "inquire",
      actions: [
        createAction("serve-tea", "请茶"),
        createAction("inquire", "打听"),
        createAction("start-debate", "舌战"),
      ],
    },
    {
      text: "我想跟你辩上一场",
      expectedActionId: "start-debate",
      actions: [
        createAction("serve-tea", "请茶"),
        createAction("inquire", "打听"),
        createAction("start-debate", "舌战"),
      ],
    },
    {
      text: "给我找点活干",
      expectedActionId: "open-work",
      actions: [
        createAction("open-work", "工作"),
        createAction("order-drink", "喝酒"),
        createAction("open-gamble", "赌博"),
      ],
    },
    {
      text: "来壶酒",
      expectedActionId: "order-drink",
      actions: [
        createAction("open-work", "工作"),
        createAction("order-drink", "喝酒"),
        createAction("open-gamble", "赌博"),
      ],
    },
    {
      text: "我来赌几把",
      expectedActionId: "open-gamble",
      actions: [
        createAction("open-work", "工作"),
        createAction("order-drink", "喝酒"),
        createAction("open-gamble", "赌博"),
      ],
    },
    {
      text: "请先生指点我一下",
      expectedActionId: "leader-residence:learn",
      actions: [createAction("leader-residence:learn", "学习")],
    },
    {
      text: "借宿休息一晚",
      expectedActionId: "open-temple-rest-menu",
      actions: [
        createAction("open-temple-work-menu", "工作"),
        createAction("open-temple-rest-menu", "休息"),
        createAction("open-donate", "捐香火"),
      ],
    },
    {
      text: "寺里有什么活干",
      expectedActionId: "open-temple-work-menu",
      actions: [
        createAction("open-temple-work-menu", "工作"),
        createAction("open-temple-rest-menu", "休息"),
        createAction("open-donate", "捐香火"),
      ],
    },
    {
      text: "我想添点香火",
      expectedActionId: "open-donate",
      actions: [
        createAction("open-temple-work-menu", "工作"),
        createAction("open-temple-rest-menu", "休息"),
        createAction("open-donate", "捐香火"),
      ],
    },
    {
      text: "把粮食交上",
      expectedActionId: "submit-temple-begging-food",
      actions: [createAction("submit-temple-begging-food", "提交粮食：10石")],
    },
  ];

  scenarios.forEach((scenario) => {
    const matchedAction = matchNpcSpecialActionByText({
      text: scenario.text,
      actions: scenario.actions,
    });

    assert.equal(
      matchedAction?.id,
      scenario.expectedActionId,
      `expected "${scenario.text}" to route to ${scenario.expectedActionId}, got ${matchedAction?.id ?? "null"}`
    );
  });
});

test("current built-in NPC special actions accept more colloquial and roundabout phrases", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const scenarios = [
    {
      text: "先让我瞅瞅你这儿都压着啥货",
      expectedActionId: "investigate-market",
      actions: [
        createAction("investigate-market", "调查行情"),
        createAction("buy-goods", "买入货物"),
        createAction("sell-goods", "卖出货物"),
      ],
    },
    {
      text: "我想收点货回去",
      expectedActionId: "buy-goods",
      actions: [
        createAction("investigate-market", "调查行情"),
        createAction("buy-goods", "买入货物"),
        createAction("sell-goods", "卖出货物"),
      ],
    },
    {
      text: "手头这批货想在你这儿出掉",
      expectedActionId: "sell-goods",
      actions: [
        createAction("investigate-market", "调查行情"),
        createAction("buy-goods", "买入货物"),
        createAction("sell-goods", "卖出货物"),
      ],
    },
    {
      text: "这身子骨不太爽利，劳你给看看",
      expectedActionId: "heal",
      actions: [
        createAction("heal", "疗伤"),
        createAction("open-buy", "买药"),
        createAction("start-compounding", "配药"),
      ],
    },
    {
      text: "给我拣几味药材带走",
      expectedActionId: "open-buy",
      actions: [
        createAction("heal", "疗伤"),
        createAction("open-buy", "买药"),
        createAction("start-compounding", "配药"),
      ],
    },
    {
      text: "我想自己炮制一副药",
      expectedActionId: "start-compounding",
      actions: [
        createAction("heal", "疗伤"),
        createAction("open-buy", "买药"),
        createAction("start-compounding", "配药"),
      ],
    },
    {
      text: "给我续上一盏茶润润喉",
      expectedActionId: "serve-tea",
      actions: [
        createAction("serve-tea", "请茶"),
        createAction("inquire", "打听"),
        createAction("start-debate", "舌战"),
      ],
    },
    {
      text: "近来外头有什么动静",
      expectedActionId: "inquire",
      actions: [
        createAction("serve-tea", "请茶"),
        createAction("inquire", "打听"),
        createAction("start-debate", "舌战"),
      ],
    },
    {
      text: "想跟你掰扯掰扯这个理",
      expectedActionId: "start-debate",
      actions: [
        createAction("serve-tea", "请茶"),
        createAction("inquire", "打听"),
        createAction("start-debate", "舌战"),
      ],
    },
    {
      text: "最近手头紧，想寻个营生",
      expectedActionId: "open-work",
      actions: [
        createAction("open-work", "工作"),
        createAction("order-drink", "喝酒"),
        createAction("open-gamble", "赌博"),
      ],
    },
    {
      text: "劳驾给我筛碗酒来",
      expectedActionId: "order-drink",
      actions: [
        createAction("open-work", "工作"),
        createAction("order-drink", "喝酒"),
        createAction("open-gamble", "赌博"),
      ],
    },
    {
      text: "俺也去耍两把",
      expectedActionId: "open-gamble",
      actions: [
        createAction("open-work", "工作"),
        createAction("order-drink", "喝酒"),
        createAction("open-gamble", "赌博"),
      ],
    },
    {
      text: "想跟先生讨教几招",
      expectedActionId: "leader-residence:learn",
      actions: [createAction("leader-residence:learn", "学习")],
    },
    {
      text: "今儿想在庙里落个脚",
      expectedActionId: "open-temple-rest-menu",
      actions: [
        createAction("open-temple-work-menu", "工作"),
        createAction("open-temple-rest-menu", "休息"),
        createAction("open-donate", "捐香火"),
      ],
    },
    {
      text: "庙里可有差使让我搭把手",
      expectedActionId: "open-temple-work-menu",
      actions: [
        createAction("open-temple-work-menu", "工作"),
        createAction("open-temple-rest-menu", "休息"),
        createAction("open-donate", "捐香火"),
      ],
    },
    {
      text: "想给佛前添点灯油钱",
      expectedActionId: "open-donate",
      actions: [
        createAction("open-temple-work-menu", "工作"),
        createAction("open-temple-rest-menu", "休息"),
        createAction("open-donate", "捐香火"),
      ],
    },
    {
      text: "化来的口粮我这就交回寺里",
      expectedActionId: "submit-temple-begging-food",
      actions: [createAction("submit-temple-begging-food", "提交粮食：10石")],
    },
  ];

  scenarios.forEach((scenario) => {
    const matchedAction = matchNpcSpecialActionByText({
      text: scenario.text,
      actions: scenario.actions,
    });

    assert.equal(
      matchedAction?.id,
      scenario.expectedActionId,
      `expected "${scenario.text}" to route to ${scenario.expectedActionId}, got ${matchedAction?.id ?? "null"}`
    );
  });
});

test("house conversation service ids reuse the same local intent matcher profiles as their action counterparts", () => {
  const { matchNpcSpecialActionByText } = loadMatcher();

  const scenarios = [
    {
      text: "我想买点东西",
      expectedActionId: "market-buy",
      actions: [createAction("market-buy", "买货")],
    },
    {
      text: "我来赌几把",
      expectedActionId: "tavern-gamble",
      actions: [createAction("tavern-gamble", "开赌局")],
    },
    {
      text: "打听米价",
      expectedActionId: "grain-intel",
      actions: [createAction("grain-intel", "打听米价")],
    },
    {
      text: "帮你算算账",
      expectedActionId: "grain-accounting",
      actions: [createAction("grain-accounting", "帮忙算账")],
    },
    {
      text: "给我抓点药",
      expectedActionId: "medicine-buy",
      actions: [createAction("medicine-buy", "买药")],
    },
    {
      text: "我想自己炮制一副药",
      expectedActionId: "medicine-compound",
      actions: [createAction("medicine-compound", "配药")],
    },
  ];

  scenarios.forEach((scenario) => {
    const matchedAction = matchNpcSpecialActionByText({
      text: scenario.text,
      actions: scenario.actions,
    });

    assert.equal(
      matchedAction?.id,
      scenario.expectedActionId,
      `expected "${scenario.text}" to route to ${scenario.expectedActionId}, got ${matchedAction?.id ?? "null"}`
    );
  });
});
