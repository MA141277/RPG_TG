import type { NpcInteractionOptionViewModel } from "../../domain/npc-interaction";

type IntentKeywordSource = "explicit" | "default" | "label";

type ActionIntentProfile = {
  aliases?: string[];
  blockers?: string[];
  score?(normalizedText: string): number;
};

const MARKET_GOODS_TERMS = [
  "货",
  "货物",
  "货品",
  "货色",
  "货样",
  "商品",
  "东西",
  "物件",
  "特产",
  "物什",
  "玩意",
] as const;

const MARKET_BUY_VERBS = [
  "买",
  "购买",
  "购置",
  "采购",
  "采买",
  "进货",
  "进",
  "拿",
  "收",
  "挑",
  "选购",
  "置办",
  "添置",
] as const;

const MARKET_SELL_VERBS = [
  "卖",
  "出售",
  "出货",
  "出掉",
  "出手",
  "销货",
  "销",
  "处理",
  "脱手",
  "甩",
  "甩掉",
  "兜售",
] as const;

const QUESTION_TERMS = [
  "什么",
  "哪些",
  "哪种",
  "啥",
  "有啥",
  "都有",
  "介绍",
  "看看",
  "瞅",
  "瞅瞅",
  "瞧瞧",
  "问问",
  "打听",
  "听听",
  "可有",
  "有无",
  "有没有",
  "想知道",
] as const;

const MEDICINE_TERMS = [
  "药",
  "药材",
  "草药",
  "药丸",
  "药粉",
  "药膏",
  "药引",
  "方子",
  "药方",
] as const;

const INJURY_TERMS = [
  "伤",
  "伤势",
  "伤口",
  "病",
  "病痛",
  "病症",
  "毛病",
  "身子",
  "身子骨",
  "不舒服",
  "不舒坦",
  "不爽利",
  "难受",
] as const;

const TEA_TERMS = ["茶", "茶水", "杯茶", "壶茶", "盏茶", "碗茶", "茶汤", "热茶"] as const;
const ALCOHOL_TERMS = ["酒", "杯酒", "壶酒", "碗酒", "盅酒", "黄汤", "小酌", "喝一杯"] as const;
const GAMBLE_VERBS = ["赌", "押", "玩", "耍", "摸", "上桌", "试试", "来", "开"] as const;
const GAMBLE_COUNTER_TERMS = ["把", "局", "手", "盘"] as const;
const GAMBLE_QUANTITY_TERMS = ["一", "两", "几", "几把", "几局", "几手", "几盘"] as const;
const WORK_TERMS = ["活计", "活路", "差事", "差使", "营生", "杂活", "搭把手"] as const;
const FOOD_HANDOVER_TERMS = ["粮", "粮食", "口粮", "米粮", "吃的", "斋粮"] as const;
const FOOD_HANDOVER_VERBS = ["交", "提交", "上交", "交回", "送回", "奉上"] as const;
const GRAIN_TERMS = ["粮", "粮食", "米", "米粮", "谷子", "杂粮", "口粮"] as const;
const PRICE_TERMS = ["价", "价格", "价钱", "市价", "行情", "米价", "粮价"] as const;
const ACCOUNTING_TERMS = [
  "账册",
  "账本",
  "算盘",
  "算账",
  "盘账",
  "清账",
  "对账",
  "拨算盘",
] as const;
const INFO_TERMS = [
  "消息",
  "风声",
  "情报",
  "见闻",
  "近况",
  "传闻",
  "事情",
  "动静",
  "说法",
] as const;

const ACTION_INTENT_PROFILES: Readonly<Record<string, ActionIntentProfile>> = {
  "investigate-market": {
    aliases: [
      "你这都有什么货",
      "你这里都有什么货",
      "这儿都有什么货",
      "都卖什么货",
      "卖什么货",
      "有什么特产",
      "看看货",
      "看看货色",
      "给我介绍下货物",
      "问问行情",
      "打听行情",
      "看看商品",
      "先让我瞅瞅你这儿都压着啥货",
      "让我瞅瞅你这儿都有什么货",
      "先瞅瞅你这摊子上都有什么玩意",
    ],
    score(normalizedText) {
      return Math.max(
        scoreQuestionObjectIntent(normalizedText, QUESTION_TERMS, MARKET_GOODS_TERMS, 21_000),
        scorePhraseSet(normalizedText, ["行情", "货单", "货色", "特产"], 18_000)
      );
    },
  },
  "buy-goods": {
    aliases: [
      "我想买点东西",
      "想买点东西",
      "买点东西",
      "买些东西",
      "我想买些货",
      "想买货",
      "买货",
      "进货",
      "采购货物",
      "置办些货",
      "挑点商品",
      "选购货物",
      "我想收点货回去",
      "收点货回去",
      "收些货回去",
      "想添置点货",
    ],
    blockers: ["不买", "先不买", "暂时不买", "不是来买"],
    score(normalizedText) {
      return scoreVerbObjectIntent(
        normalizedText,
        MARKET_BUY_VERBS,
        MARKET_GOODS_TERMS,
        24_000
      );
    },
  },
  "sell-goods": {
    aliases: [
      "我想卖点东西",
      "想卖点东西",
      "卖点东西",
      "卖些东西",
      "我想卖些货",
      "想卖货",
      "卖货",
      "出货",
      "处理些货",
      "脱手些货",
      "出售货物",
      "销货",
      "把这批货出掉",
      "手头这批货想出掉",
      "甩点货",
      "把货甩掉",
    ],
    blockers: ["不卖", "先不卖", "暂时不卖", "不是来卖"],
    score(normalizedText) {
      return scoreVerbObjectIntent(
        normalizedText,
        MARKET_SELL_VERBS,
        MARKET_GOODS_TERMS,
        24_000
      );
    },
  },
  heal: {
    aliases: [
      "我来疗伤",
      "我想疗伤",
      "看看伤",
      "治治伤",
      "治伤",
      "医伤",
      "疗伤",
      "看病",
      "治病",
      "调养伤势",
      "包扎伤口",
      "治下病痛",
      "这身子骨不太爽利劳你给看看",
      "身子不舒坦劳你给看看",
      "给我瞧瞧这毛病",
    ],
    score(normalizedText) {
      return Math.max(
        scoreVerbObjectIntent(
          normalizedText,
          ["疗", "疗伤", "治", "医", "看", "包扎", "调养"],
          INJURY_TERMS,
          23_000
        ),
        scorePhraseSet(normalizedText, ["看病", "治病"], 20_000)
      );
    },
  },
  "open-buy": {
    aliases: [
      "我想买药",
      "想买药",
      "买药",
      "抓药",
      "配点药",
      "来点药",
      "看看药材",
      "买些药材",
      "买点药",
      "买点东西",
      "想置办药材",
      "给我拿点药",
      "给我拣几味药材带走",
      "拣几味药材带走",
      "给我开点药",
      "捎几味药材",
    ],
    blockers: ["不买", "先不买", "暂时不买", "不是来买"],
    score(normalizedText) {
      return Math.max(
        scoreVerbObjectIntent(
          normalizedText,
          ["买", "购买", "拿", "抓", "配", "置办", "拣", "开", "捎"],
          MEDICINE_TERMS,
          23_000
        ),
        scorePhraseSet(normalizedText, ["买点东西", "买些东西"], 17_000)
      );
    },
  },
  "start-compounding": {
    aliases: [
      "我想配药",
      "想配药",
      "配药",
      "制药",
      "炼药",
      "熬药",
      "调药",
      "配些药",
      "想炼些药",
      "做点药",
      "配副药",
      "试试配药",
      "我想自己炮制一副药",
      "炮制一副药",
      "调制一副药",
      "想捣鼓副药",
    ],
    score(normalizedText) {
      return scoreVerbObjectIntent(
        normalizedText,
        ["配", "配药", "制", "制药", "炼", "炼药", "熬", "调", "调制", "炮制", "捣鼓"],
        MEDICINE_TERMS,
        22_000
      );
    },
  },
  "serve-tea": {
    aliases: [
      "来杯茶",
      "来壶茶",
      "喝茶",
      "喝杯茶",
      "上茶",
      "请茶",
      "沏壶茶",
      "泡壶茶",
      "来点茶",
      "给我上杯茶",
      "给我续上一盏茶",
      "续上一盏茶润润喉",
      "给我续杯茶",
      "斟盏茶来",
    ],
    score(normalizedText) {
      return Math.max(
        scoreVerbObjectIntent(
          normalizedText,
          ["喝", "饮", "来", "上", "泡", "沏", "续", "斟"],
          TEA_TERMS,
          22_000
        ),
        scorePhraseSet(normalizedText, ["请茶"], 19_000)
      );
    },
  },
  inquire: {
    aliases: [
      "我想打听消息",
      "想打听消息",
      "打听消息",
      "打探消息",
      "探听消息",
      "问点消息",
      "问问近况",
      "打听近况",
      "想知道些风声",
      "问点风声",
      "打探点事",
      "问问见闻",
      "近来外头有什么动静",
      "最近外边有什么说法",
      "城里近来有什么动静",
    ],
    score(normalizedText) {
      return scoreQuestionObjectIntent(
        normalizedText,
        ["打听", "打探", "探听", "问", "问问", "想知道"],
        INFO_TERMS,
        22_000
      );
    },
  },
  "start-debate": {
    aliases: [
      "我想舌战",
      "想舌战",
      "舌战",
      "论战",
      "辩论",
      "斗嘴",
      "争个高下",
      "和你辩辩",
      "辩上一场",
      "较量口才",
      "想跟你掰扯掰扯这个理",
      "跟你说道说道",
      "和你讲讲理",
    ],
    score(normalizedText) {
      return scorePhraseSet(
        normalizedText,
        [
          "舌战",
          "论战",
          "辩论",
          "斗嘴",
          "较量口才",
          "争个高下",
          "掰扯",
          "说道说道",
          "讲讲理",
        ],
        22_000
      );
    },
  },
  "open-work": {
    aliases: [
      "我想工作",
      "想找点活",
      "找点活干",
      "有活干吗",
      "接点活",
      "找份差事",
      "做工",
      "干活",
      "工作",
      "接个差事",
      "谋个活路",
      "想赚点钱",
      "想寻个营生",
      "寻个营生",
      "谋个差使",
      "让我搭把手干点活",
      "给我派点杂活",
    ],
    score(normalizedText) {
      return Math.max(
        scorePhraseSet(
          normalizedText,
          ["工作", "做工", "干活", "接活", "差事", "活路", ...WORK_TERMS],
          21_000
        ),
        scorePhraseSet(normalizedText, ["赚钱", "赚点钱"], 17_000)
      );
    },
  },
  "order-drink": {
    aliases: [
      "我想喝酒",
      "想喝酒",
      "喝酒",
      "来杯酒",
      "来壶酒",
      "上酒",
      "小酌一杯",
      "来点酒",
      "整点酒",
      "给我来杯酒",
      "喝一杯",
      "饮两口",
      "劳驾给我筛碗酒来",
      "给我温一壶酒",
      "来盅酒",
    ],
    score(normalizedText) {
      return scoreVerbObjectIntent(
        normalizedText,
        ["喝", "饮", "来", "上", "整", "小酌", "筛", "温"],
        ALCOHOL_TERMS,
        23_000
      );
    },
  },
  "open-gamble": {
    aliases: [
      "我想赌博",
      "想赌两把",
      "我来赌几把",
      "我来赌两把",
      "赌两把",
      "赌几把",
      "赌一把",
      "赌钱",
      "玩两把",
      "玩几把",
      "押一手",
      "押两手试试",
      "推两把",
      "俺也去赌两把",
      "上桌玩两把",
      "我想来几局",
      "我想来几局牌",
      "我想来几局短局",
      "我想来几局短局牌",
      "来几局",
      "来几局牌",
      "来几局短局",
      "来几局短局牌",
      "来两局",
      "来两局牌",
      "来两局短局",
      "玩两盘",
      "开几局",
      "来局赌局",
      "试试手气",
      "俺也去耍两把",
      "耍两把",
      "耍几把",
      "摸两手试试",
    ],
    score(normalizedText) {
      return Math.max(
        scorePhraseSet(
          normalizedText,
          [
            "赌博",
            "赌钱",
            "赌两把",
            "赌几把",
            "赌一把",
            "玩两把",
            "玩几把",
            "来几局",
            "来几局牌",
            "来几局短局",
            "来几局短局牌",
            "来两局",
            "来两局牌",
            "来两局短局",
            "开几局",
            "短局牌",
            "试试手气",
            "赌局",
          ],
          22_000
        ),
        scoreVerbCounterIntent(
          normalizedText,
          GAMBLE_VERBS,
          GAMBLE_COUNTER_TERMS,
          GAMBLE_QUANTITY_TERMS,
          21_000
        ),
        scorePhraseSet(
          normalizedText,
          ["上桌", "押注", "下注"],
          16_000
        )
      );
    },
  },
  "leader-residence:learn": {
    aliases: [
      "我想学习",
      "想学习",
      "学习",
      "请教",
      "受教",
      "求教",
      "想学点本事",
      "指点我一下",
      "教教我",
      "学些东西",
      "学点门道",
      "请您指教",
      "想跟先生讨教几招",
      "请先生点拨两句",
      "望先生赐教",
    ],
    score(normalizedText) {
      return scorePhraseSet(
        normalizedText,
        [
          "学习",
          "请教",
          "受教",
          "求教",
          "指教",
          "讨教",
          "点拨",
          "赐教",
          "学点本事",
          "学点门道",
        ],
        21_000
      );
    },
  },
  "open-temple-rest-menu": {
    aliases: [
      "我想休息",
      "想休息",
      "休息",
      "歇歇脚",
      "歇息",
      "借宿",
      "住一宿",
      "留宿",
      "睡一觉",
      "找个地方歇会",
      "打尖住店",
      "住下休息",
      "今儿想在庙里落个脚",
      "想在庙里投个宿",
      "借个地方挂单",
      "在庙里栖身一晚",
    ],
    score(normalizedText) {
      return scorePhraseSet(
        normalizedText,
        [
          "休息",
          "歇歇脚",
          "歇息",
          "借宿",
          "住一宿",
          "留宿",
          "睡一觉",
          "落脚",
          "投宿",
          "挂单",
          "栖身",
        ],
        21_000
      );
    },
  },
  "open-temple-work-menu": {
    aliases: [
      "我想做工",
      "寺里有什么活",
      "我想干活",
      "给寺里帮忙",
      "做点寺里的活",
      "帮庙里做工",
      "工作",
      "干活",
      "做工",
      "帮忙",
      "庙里可有差使让我搭把手",
      "给寺里出把力",
      "做些庙里的杂活",
      "俺也去帮衬一二",
    ],
    score(normalizedText) {
      return scorePhraseSet(
        normalizedText,
        [
          "工作",
          "干活",
          "做工",
          "帮忙",
          "寺里有什么活",
          "帮庙里做工",
          "差使",
          "搭把手",
          "出把力",
          "杂活",
          "帮衬",
        ],
        20_000
      );
    },
  },
  "open-donate": {
    aliases: [
      "我想捐香火",
      "捐香火",
      "上香",
      "添香火",
      "布施",
      "供奉香火",
      "捐点香火钱",
      "添点香火",
      "捐些香火",
      "上柱香",
      "想给佛前添点灯油钱",
      "添点灯油钱",
      "捐点香油钱",
      "供点功德钱",
    ],
    score(normalizedText) {
      return scorePhraseSet(
        normalizedText,
        [
          "捐香火",
          "上香",
          "添香火",
          "布施",
          "供奉香火",
          "香火钱",
          "灯油钱",
          "香油钱",
          "功德钱",
        ],
        21_000
      );
    },
  },
  "submit-temple-begging-food": {
    aliases: [
      "提交粮食",
      "交粮",
      "交粮食",
      "把粮食交上",
      "把吃的交上",
      "上交粮食",
      "把粮交了",
      "化来的口粮我这就交回寺里",
      "把化来的粮交回寺里",
      "把口粮送回寺里",
    ],
    score(normalizedText) {
      return Math.max(
        scorePhraseSet(
          normalizedText,
          ["提交粮食", "交粮", "交粮食", "上交粮食", "把粮交了"],
          21_000
        ),
        scoreVerbObjectIntent(
          normalizedText,
          FOOD_HANDOVER_VERBS,
          FOOD_HANDOVER_TERMS,
          22_000
        )
      );
    },
  },
  "grain-buy": {
    aliases: [
      "我想买粮",
      "想买粮",
      "买粮",
      "买米",
      "买点米",
      "买些米粮",
      "买些粮食",
      "称些米",
      "打些米",
      "给我来点粮",
      "我来买点口粮",
      "想添些口粮",
    ],
    blockers: ["不买", "先不买", "暂时不买", "不是来买"],
    score(normalizedText) {
      return scoreVerbObjectIntent(
        normalizedText,
        MARKET_BUY_VERBS,
        GRAIN_TERMS,
        23_000
      );
    },
  },
  "grain-sell": {
    aliases: [
      "我想卖粮",
      "想卖粮",
      "卖粮",
      "卖米",
      "出手些米粮",
      "出点粮食",
      "把这些米卖了",
      "我来卖点粮",
      "想把口粮换钱",
      "卖些粮食",
    ],
    blockers: ["不卖", "先不卖", "暂时不卖", "不是来卖"],
    score(normalizedText) {
      return scoreVerbObjectIntent(
        normalizedText,
        MARKET_SELL_VERBS,
        GRAIN_TERMS,
        23_000
      );
    },
  },
  "grain-intel": {
    aliases: [
      "打听米价",
      "问米价",
      "问问米价",
      "粮价怎么样",
      "近来米价如何",
      "打听粮价",
      "看看粮价",
      "问问各地粮价",
      "粮食什么价",
      "如今米价几何",
    ],
    score(normalizedText) {
      return Math.max(
        scoreQuestionObjectIntent(
          normalizedText,
          QUESTION_TERMS,
          [...GRAIN_TERMS, ...PRICE_TERMS],
          22_000
        ),
        scorePhraseSet(
          normalizedText,
          ["米价", "粮价", "各地粮价", "粮食什么价"],
          19_000
        )
      );
    },
  },
  "grain-accounting": {
    aliases: [
      "帮你算账",
      "我来算账",
      "算账",
      "盘盘账",
      "对对账",
      "清清账",
      "拨算盘",
      "我来帮忙看账",
      "我来帮你盘账",
      "让我试试这本账册",
    ],
    score(normalizedText) {
      return scorePhraseSet(
        normalizedText,
        ACCOUNTING_TERMS,
        21_000
      );
    },
  },
};

const ACTION_INTENT_PROFILE_ALIASES: Readonly<Record<string, string>> = {
  "market-buy": "buy-goods",
  "market-sell": "sell-goods",
  "market-investigate": "investigate-market",
  "medicine-heal": "heal",
  "medicine-buy": "open-buy",
  "medicine-compound": "start-compounding",
  "tea-serve": "serve-tea",
  "tea-inquire": "inquire",
  "tea-debate": "start-debate",
  "tavern-work": "open-work",
  "tavern-drink": "order-drink",
  "tavern-gamble": "open-gamble",
};

function normalizeIntentText(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s\u3000]+/gu, "")
    .replace(/[，。！？、；：,.!?;:~"'`“”‘’（）()\[\]{}<>《》「」【】]/gu, "");
}

function getNormalizedMatches(
  normalizedText: string,
  candidates: readonly string[]
): string[] {
  return candidates
    .map((candidate) => normalizeIntentText(candidate))
    .filter(
      (normalizedCandidate) =>
        normalizedCandidate.length > 0 &&
        normalizedText.includes(normalizedCandidate)
    );
}

function getLongestNormalizedMatchLength(
  normalizedText: string,
  candidates: readonly string[]
): number {
  return getNormalizedMatches(normalizedText, candidates).reduce(
    (longestLength, normalizedCandidate) =>
      Math.max(longestLength, normalizedCandidate.length),
    0
  );
}

function scorePhraseSet(
  normalizedText: string,
  phrases: readonly string[],
  baseScore: number
): number {
  const matchedPhrases = getNormalizedMatches(normalizedText, phrases);
  if (matchedPhrases.length === 0) {
    return 0;
  }

  const longestLength = matchedPhrases.reduce(
    (longest, matchedPhrase) => Math.max(longest, matchedPhrase.length),
    0
  );
  const exactMatchBonus = matchedPhrases.some(
    (matchedPhrase) => matchedPhrase === normalizedText
  )
    ? 20_000
    : 0;

  return baseScore + longestLength * 100 + exactMatchBonus;
}

function scoreVerbObjectIntent(
  normalizedText: string,
  verbs: readonly string[],
  objects: readonly string[],
  baseScore: number
): number {
  const longestVerbLength = getLongestNormalizedMatchLength(
    normalizedText,
    verbs
  );
  const longestObjectLength = getLongestNormalizedMatchLength(
    normalizedText,
    objects
  );

  if (longestVerbLength === 0 || longestObjectLength === 0) {
    return 0;
  }

  return (
    baseScore +
    longestVerbLength * 100 +
    longestObjectLength * 80 +
    Math.min(5_000, normalizedText.length * 10)
  );
}

function scoreQuestionObjectIntent(
  normalizedText: string,
  questions: readonly string[],
  objects: readonly string[],
  baseScore: number
): number {
  const longestQuestionLength = getLongestNormalizedMatchLength(
    normalizedText,
    questions
  );
  const longestObjectLength = getLongestNormalizedMatchLength(
    normalizedText,
    objects
  );

  if (longestQuestionLength === 0 || longestObjectLength === 0) {
    return 0;
  }

  return (
    baseScore +
    longestQuestionLength * 100 +
    longestObjectLength * 80 +
    Math.min(4_000, normalizedText.length * 10)
  );
}

function scoreVerbCounterIntent(
  normalizedText: string,
  verbs: readonly string[],
  counters: readonly string[],
  quantities: readonly string[],
  baseScore: number
): number {
  const longestVerbLength = getLongestNormalizedMatchLength(
    normalizedText,
    verbs
  );
  const longestCounterLength = getLongestNormalizedMatchLength(
    normalizedText,
    counters
  );

  if (longestVerbLength === 0 || longestCounterLength === 0) {
    return 0;
  }

  const longestQuantityLength = getLongestNormalizedMatchLength(
    normalizedText,
    quantities
  );

  return (
    baseScore +
    longestVerbLength * 100 +
    longestCounterLength * 80 +
    longestQuantityLength * 60 +
    Math.min(4_000, normalizedText.length * 10)
  );
}

function resolveActionIntentProfile(
  actionId: string
): ActionIntentProfile | null {
  const directProfile = ACTION_INTENT_PROFILES[actionId];
  if (directProfile != null) {
    return directProfile;
  }

  const aliasedProfileId = ACTION_INTENT_PROFILE_ALIASES[actionId];
  return aliasedProfileId == null
    ? null
    : ACTION_INTENT_PROFILES[aliasedProfileId] ?? null;
}

function collectActionTriggerKeywords(
  action: NpcInteractionOptionViewModel
): Array<{
  keyword: string;
  source: IntentKeywordSource;
  order: number;
}> {
  const seen = new Set<string>();
  const keywords: Array<{
    keyword: string;
    source: IntentKeywordSource;
    order: number;
  }> = [];
  const profile = resolveActionIntentProfile(action.id);

  (action.triggerKeywords ?? []).forEach((keyword, index) => {
    const normalizedKeyword = normalizeIntentText(keyword);
    if (normalizedKeyword.length === 0 || seen.has(normalizedKeyword)) {
      return;
    }

    seen.add(normalizedKeyword);
    keywords.push({
      keyword,
      source: "explicit",
      order: index,
    });
  });

  (profile?.aliases ?? []).forEach((keyword) => {
    const normalizedKeyword = normalizeIntentText(keyword);
    if (normalizedKeyword.length === 0 || seen.has(normalizedKeyword)) {
      return;
    }

    seen.add(normalizedKeyword);
    keywords.push({
      keyword,
      source: "default",
      order: keywords.length,
    });
  });

  const normalizedLabel = normalizeIntentText(action.label);
  if (normalizedLabel.length > 0 && !seen.has(normalizedLabel)) {
    keywords.push({
      keyword: action.label,
      source: "label",
      order: keywords.length,
    });
  }

  return keywords;
}

function isBlockedByIntentProfile(
  normalizedText: string,
  action: NpcInteractionOptionViewModel
): boolean {
  const blockers = resolveActionIntentProfile(action.id)?.blockers ?? [];
  return blockers.some((blocker) =>
    normalizedText.includes(normalizeIntentText(blocker))
  );
}

function scoreDirectKeywordMatch(input: {
  normalizedText: string;
  action: NpcInteractionOptionViewModel;
}): number {
  let bestScore = 0;

  collectActionTriggerKeywords(input.action).forEach((trigger) => {
    const normalizedKeyword = normalizeIntentText(trigger.keyword);
    if (
      normalizedKeyword.length === 0 ||
      !input.normalizedText.includes(normalizedKeyword)
    ) {
      return;
    }

    const exactScore =
      input.normalizedText === normalizedKeyword ? 100_000 : 0;
    const sourceScore =
      trigger.source === "explicit"
        ? 35_000
        : trigger.source === "default"
          ? 25_000
          : 10_000;
    const lengthScore = normalizedKeyword.length * 100;
    const orderScore = Math.max(0, 199 - trigger.order);
    const nextScore = exactScore + sourceScore + lengthScore + orderScore;

    if (nextScore > bestScore) {
      bestScore = nextScore;
    }
  });

  return bestScore;
}

function scoreIntentProfile(
  normalizedText: string,
  action: NpcInteractionOptionViewModel
): number {
  return resolveActionIntentProfile(action.id)?.score?.(normalizedText) ?? 0;
}

export function matchNpcSpecialActionByText(input: {
  actions: NpcInteractionOptionViewModel[];
  text: string;
}): NpcInteractionOptionViewModel | null {
  const normalizedText = normalizeIntentText(input.text);
  if (normalizedText.length === 0) {
    return null;
  }

  let bestAction: NpcInteractionOptionViewModel | null = null;
  let bestScore = -1;

  input.actions.forEach((action) => {
    if (action.kind !== "special" || action.disabled === true) {
      return;
    }

    if (isBlockedByIntentProfile(normalizedText, action)) {
      return;
    }

    const nextScore = Math.max(
      scoreDirectKeywordMatch({
        normalizedText,
        action,
      }),
      scoreIntentProfile(normalizedText, action)
    );

    if (nextScore > bestScore) {
      bestAction = action;
      bestScore = nextScore;
    }
  });

  if (bestScore <= 0 || bestAction == null) {
    return null;
  }

  return bestAction;
}
