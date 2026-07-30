export type CityBeggingDefaultResult = "ji" | "xiong" | "ping";

export type CityBeggingDefaultEffect =
  | { type: "add_grain"; grainKind: "coarse" | "vegetarian"; amountSheng: number; quality?: string }
  | { type: "add_item"; itemId: string; quantity: number }
  | { type: "mod_attr"; attrId: string; delta: number; label: string }
  | { type: "add_bond"; bondId: string; delta: number; label: string }
  | { type: "set_flag"; flagId: string; value: boolean }
  | { type: "injure"; staminaDelta: number; label: string }
  | { type: "mod_weight"; key: string; result: CityBeggingDefaultResult; delta: number; label: string }
  | { type: "restore_stamina"; amount: number; label: string }
  | { type: "restore_stamina_full"; label: string };

export type CityBeggingDefaultOption = {
  optionId: string;
  optionText: string;
  fixedResult: CityBeggingDefaultResult;
  outcomeText: string;
  effects: CityBeggingDefaultEffect[];
};

export type CityBeggingDefaultLocation = {
  locationId: "dongshi_mishi" | "xicheng_guanyin" | "beicheng_ciji";
  title: string;
  baselineResult: CityBeggingDefaultResult;
  backgroundId: "liangpu" | "chengzhen" | "temple";
  npc: {
    id: string;
    name: string;
  };
  encounterText: string;
  closingText: string;
  options: readonly CityBeggingDefaultOption[];
};

export const CITY_BEGGING_DEFAULT_LOCATIONS: readonly CityBeggingDefaultLocation[] = [
  {
    locationId: "dongshi_mishi",
    title: "城东米市街",
    baselineResult: "xiong",
    backgroundId: "liangpu",
    npc: {
      id: "haozhou_grain_broker",
      name: "米行牙人",
    },
    encounterText:
      "城东米市街人声逼仄，米袋压在铺门两侧，饥民挤在檐下等价。你刚合掌近前，几名伙计已经皱眉望来，像是怕你挡了买卖。",
    closingText: "米市的吆喝声重新盖过脚步声，你收紧布袋，从铺檐阴影里退了出来。",
    options: [
      {
        optionId: "loud_alms_request",
        optionText: "高声求施，盼铺户当众舍米。",
        fixedResult: "xiong",
        outcomeText:
          "你一开口，周围饥民也跟着涌上前。铺中伙计怕乱了秩序，推搡着将你赶离门口，只丢出半把碎糠，叫你莫再堵街。",
        effects: [
          { type: "add_grain", grainKind: "coarse", amountSheng: 1, quality: "broken_husk" },
          { type: "injure", staminaDelta: -6, label: "被人群推搡" },
          { type: "mod_weight", key: "city_begging.market_loud", result: "xiong", delta: 1, label: "米市喧哗惹厌" },
        ],
      },
      {
        optionId: "silent_wait",
        optionText: "默立檐下，只等有人看见。",
        fixedResult: "xiong",
        outcomeText:
          "你在檐下站了许久，雨水顺着屋角滴进袖口。掌柜最终只让伙计送来一碗冷水，说今日米价紧，谁也顾不得旁人。",
        effects: [
          { type: "mod_attr", attrId: "patience", delta: 1, label: "久候忍耐" },
          { type: "mod_weight", key: "city_begging.wet_clothes", result: "xiong", delta: 1, label: "衣衫潮冷" },
        ],
      },
      {
        optionId: "seek_small_shop",
        optionText: "避开大铺，转向巷口小店求一口余粮。",
        fixedResult: "xiong",
        outcomeText:
          "巷口小店自家也缺粮，店妇看你僧衣破旧，悄悄塞来两只裂口馒头，又低声催你快走，免得被米行的人瞧见。",
        effects: [
          { type: "add_item", itemId: "cracked_steamed_bun", quantity: 2 },
          { type: "set_flag", flagId: "flag.city_begging.dongshi_small_shop_seen", value: true },
          { type: "restore_stamina", amount: 4, label: "裂口馒头垫饥" },
        ],
      },
    ],
  },
  {
    locationId: "xicheng_guanyin",
    title: "城西观音巷",
    baselineResult: "ping",
    backgroundId: "chengzhen",
    npc: {
      id: "haozhou_fisher_woman",
      name: "补网渔嫂",
    },
    encounterText:
      "城西观音巷贴着旧水渠，几户人家把破网摊在门前。香灰味从小龛里飘出，街坊虽不宽裕，却还愿意听你把来路说完。",
    closingText: "观音巷的灯影在水渠里晃动，你把所得收好，向巷中人合掌告别。",
    options: [
      {
        optionId: "honest_request",
        optionText: "直言寺中缺粮，只求一餐接济。",
        fixedResult: "ping",
        outcomeText:
          "你把寺中情形如实说出，巷中老妇没有多问，盛出一小包粗米交给你，只叮嘱若有余力，也替路边更饿的人留一口。",
        effects: [
          { type: "add_grain", grainKind: "coarse", amountSheng: 3 },
          { type: "mod_attr", attrId: "reputation_plainspoken", delta: 1, label: "坦言求助" },
        ],
      },
      {
        optionId: "silent_wait",
        optionText: "在观音龛旁静候，不扰街坊。",
        fixedResult: "ping",
        outcomeText:
          "你在龛旁静候到暮色沉下，一名卖浆人收摊时递来半碗热浆。所得不多，却让腹中寒意慢慢散去。",
        effects: [
          { type: "restore_stamina", amount: 8, label: "热浆暖腹" },
          { type: "set_flag", flagId: "flag.city_begging.xicheng_waited_at_shrine", value: true },
        ],
      },
      {
        optionId: "help_mend_net",
        optionText: "帮渔嫂补网，再开口求些干粮。",
        fixedResult: "ji",
        outcomeText:
          "你坐下替渔嫂穿线补网，手法虽慢，却肯细做。渔嫂见你不是白讨，包了鱼干和素米给你，还说下次路过可先来歇脚。",
        effects: [
          { type: "add_item", itemId: "fish_jerky", quantity: 2 },
          { type: "add_grain", grainKind: "vegetarian", amountSheng: 4, quality: "clean" },
          { type: "add_bond", bondId: "bond.city_begging.xicheng_fisher_woman", delta: 1, label: "帮补渔网" },
          { type: "set_flag", flagId: "flag.city_begging.xicheng_guanyin.yusou_bonded", value: true },
        ],
      },
    ],
  },
  {
    locationId: "beicheng_ciji",
    title: "城北慈济庵",
    baselineResult: "ji",
    backgroundId: "temple",
    npc: {
      id: "haozhou_ciji_nun",
      name: "慈济庵尼师",
    },
    encounterText:
      "城北慈济庵门前松影清冷，粥棚旁排着几个逃荒人。尼师听见你报出皇觉寺旧处，停下木勺，示意你到廊下慢慢说。",
    closingText: "庵门外钟声低回，你在粥香与松风里重新踏上北城小路。",
    options: [
      {
        optionId: "explain_travel_history",
        optionText: "说明一路游方来历，请庵中作证接济。",
        fixedResult: "ji",
        outcomeText:
          "你把钟离、皇觉寺与一路饥荒细细说清。尼师听罢点头，让人添了一袋素粮，又写下短笺，免你在城中再被误作流贼探子。",
        effects: [
          { type: "add_grain", grainKind: "vegetarian", amountSheng: 6, quality: "temple_clean" },
          { type: "add_item", itemId: "ciji_travel_note", quantity: 1 },
          { type: "mod_attr", attrId: "credibility", delta: 1, label: "来历分明" },
        ],
      },
      {
        optionId: "lodge_copy_sutras",
        optionText: "请求留宿一夜，愿替庵中抄经。",
        fixedResult: "ji",
        outcomeText:
          "庵中收你在偏廊歇下，你替尼师抄完一卷残经。天明时粥已经温好，布袋里也多了几升素米。",
        effects: [
          { type: "restore_stamina_full", label: "庵中留宿" },
          { type: "add_grain", grainKind: "vegetarian", amountSheng: 5, quality: "temple_clean" },
          { type: "add_bond", bondId: "bond.city_begging.beicheng_ciji_nun", delta: 1, label: "留宿抄经" },
          { type: "set_flag", flagId: "flag.city_begging.beicheng_ciji.lodged", value: true },
        ],
      },
      {
        optionId: "ask_one_bowl",
        optionText: "只求一碗热粥，不多扰庵中。",
        fixedResult: "ping",
        outcomeText:
          "你只求一碗热粥，尼师便依言盛来。粥棚粮少，她没有再添，但让你坐到火盆边暖了片刻。",
        effects: [
          { type: "restore_stamina", amount: 12, label: "热粥回气" },
          { type: "mod_attr", attrId: "restraint", delta: 1, label: "知足少取" },
        ],
      },
    ],
  },
];

export function getCityBeggingDefaultLocation(locationId: string): CityBeggingDefaultLocation | null {
  return CITY_BEGGING_DEFAULT_LOCATIONS.find((location) => location.locationId === locationId) ?? null;
}
