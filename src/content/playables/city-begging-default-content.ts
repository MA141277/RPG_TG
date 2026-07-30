export type CityBeggingDefaultResult = "ji" | "xiong" | "ping";

export type CityBeggingDefaultEffect =
  | { type: "add_grain"; grainKind: "coarse" | "vegetarian"; amountSheng: number; quality?: string }
  | { type: "add_item"; itemId: string; quantity: number }
  | { type: "mod_attr"; attrId: string; delta: number; label: string }
  | { type: "add_bond"; bondId: string; delta: number; label: string }
  | { type: "set_flag"; flagId: string; value: boolean }
  | { type: "injure"; staminaDelta: number; label: string }
  | { type: "mod_weight"; key: string; result: CityBeggingDefaultResult; delta: number; label: string }
  | { type: "illness_risk"; key: string; label: string }
  | { type: "restore_stamina"; amount: number; label: string }
  | { type: "restore_stamina_full"; label: string };

export type CityBeggingDefaultOption = {
  optionId: string;
  optionText: string;
  fixedResult: CityBeggingDefaultResult;
  outcomeText: string;
  settlementText: string;
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
    title: "城东 · 米市街",
    baselineResult: "xiong",
    backgroundId: "liangpu",
    npc: {
      id: "haozhou_grain_merchant",
      name: "粮商",
    },
    encounterText:
      "你挤进米市街。粮铺前人头攒动，掌柜的算盘打得噼啪响。你这一身僧衣在铜臭里格外扎眼，几个伙计已经拿眼角剜你。街口一个挺着肚子的粮商，正指挥人搬米，见你捧钵凑近，脸一沉。",
    closingText: "〔米市街这一趟，处处碰壁。〕",
    options: [
      {
        optionId: "loud_alms_request",
        optionText: "上前合掌，朗声化缘",
        fixedResult: "xiong",
        outcomeText:
          '你话音未落，粮商把手一挥："哪来的野和尚，晦气！赶明儿都来讨，我这米铺还开不开了？"伙计一拥而上，连推带搡把你轰出老远，钵盂磕在石阶上，豁口又大了一圈。',
        settlementText:
          "〔结算〕米 +0；💢 威严 -1（当众受辱）；🩹 轻伤（被推搡跌地，体力 -1）；flag：〔米市街·恶商〕结怨。",
        effects: [
          { type: "mod_attr", attrId: "dignity", delta: -1, label: "当众受辱" },
          { type: "injure", staminaDelta: -1, label: "被推搡跌地" },
          { type: "set_flag", flagId: "flag.city_begging.dongshi_mishi.grain_merchant_grudge", value: true },
        ],
      },
      {
        optionId: "silent_wait",
        optionText: "默立铺前，垂目久候",
        fixedResult: "xiong",
        outcomeText:
          '你不出声，只低头站着。粮商起初没理会，站得久了反倒嫌你碍事："杵在这儿挡财路！"叫伙计泼了半瓢洗米水过来。你僧衣湿透，悻悻退开。',
        settlementText:
          '〔结算〕米 +0；🌊 狼狈（衣衫尽湿，本日再化缘"凶"加权）；✨ 忍辱 +1（受此一激，心性略沉）。',
        effects: [
          { type: "mod_weight", key: "city_begging.wet_clothes", result: "xiong", delta: 1, label: "衣衫尽湿" },
          { type: "mod_attr", attrId: "endurance", delta: 1, label: "受此一激，心性略沉" },
        ],
      },
      {
        optionId: "seek_small_shop",
        optionText: "转身去寻街尾小铺",
        fixedResult: "xiong",
        outcomeText:
          '你自知讨不了好，退到街尾一家冷清米铺。老板是个精瘦汉子，斜眼打量你半晌，从缸底抠出一把碎米、几乎是霉的："拿去拿去,别在门口杵着。"',
        settlementText: "〔结算〕🍚 糙米 +0.2 升（霉）；食用有小概率染病；⚙️ 机变 +1（懂得避祸另寻）。",
        effects: [
          { type: "add_grain", grainKind: "coarse", amountSheng: 0.2, quality: "moldy" },
          { type: "illness_risk", key: "city_begging.moldy_grain", label: "食用有小概率染病" },
          { type: "mod_attr", attrId: "adaptability", delta: 1, label: "懂得避祸另寻" },
        ],
      },
    ],
  },
  {
    locationId: "xicheng_guanyin",
    title: "城西 · 观音巷",
    baselineResult: "ping",
    backgroundId: "chengzhen",
    npc: {
      id: "haozhou_fisher_old_man",
      name: "补网渔叟",
    },
    encounterText:
      "你拐进观音巷，青石板缝里长着草。晌午光景，多数人家闭着门。巷尾一扇柴门半开，一个正补渔网的老汉抬头看你一眼，没赶你走，也没起身。",
    closingText: "〔观音巷人心尚软，出力者得善报。〕",
    options: [
      {
        optionId: "honest_request",
        optionText: "合掌行礼，如实相告",
        fixedResult: "ping",
        outcomeText:
          '"阿弥陀佛，小僧皇觉寺行脚僧，化一钵斋饭。"老汉"唔"了一声，进屋盛出小半碗糙米倒进你钵里："出家人不易，将就着。"话不多，米也不多，却是实打实的。',
        settlementText: "〔结算〕🍚 糙米 +0.4 升；🤝〔观音巷·渔叟〕好感 +1（浅结）。",
        effects: [
          { type: "add_grain", grainKind: "coarse", amountSheng: 0.4 },
          { type: "add_bond", bondId: "bond.city_begging.xicheng_fisher_old_man", delta: 1, label: "浅结" },
        ],
      },
      {
        optionId: "silent_wait",
        optionText: "默立门前，垂目候他发话",
        fixedResult: "ping",
        outcomeText:
          '你不言语，只静静立着。老汉手里的梭子没停，隔了好一会儿才开口："等着也是等着，锅里还有点昨儿的冷粥，端去吃了赶路吧。"',
        settlementText: "〔结算〕🥣 冷粥一碗（即时回体力 +1，不入库）；😐 好感不变（不功不过）。",
        effects: [{ type: "restore_stamina", amount: 1, label: "冷粥一碗" }],
      },
      {
        optionId: "help_mend_net",
        optionText: "主动搭话，帮他补网",
        fixedResult: "ji",
        outcomeText:
          '你放下钵盂，蹲下接过梭子——放牛时学过的手艺竟还利索。补完大半张网，老汉眉头舒开，端出半碗糙米、两条鱼干："出家人还肯下力气，难得。乱世里，能帮一把是一把。"',
        settlementText:
          "〔结算〕🍚 糙米 +0.5 升、🐟 鱼干 ×2；💪 体魄 +1；🤝〔观音巷·渔叟〕好感 +2（结缘·flag 记）；✨ 觉悟 +1。",
        effects: [
          { type: "add_grain", grainKind: "coarse", amountSheng: 0.5 },
          { type: "add_item", itemId: "fish_jerky", quantity: 2 },
          { type: "mod_attr", attrId: "physique", delta: 1, label: "体魄" },
          { type: "add_bond", bondId: "bond.city_begging.xicheng_fisher_old_man", delta: 2, label: "结缘" },
          { type: "set_flag", flagId: "flag.city_begging.xicheng_guanyin.fisher_old_man_bonded", value: true },
          { type: "mod_attr", attrId: "awakening", delta: 1, label: "觉悟" },
        ],
      },
    ],
  },
  {
    locationId: "beicheng_ciji",
    title: "城北 · 慈济庵",
    baselineResult: "ji",
    backgroundId: "temple",
    npc: {
      id: "haozhou_ciji_jinghui",
      name: "静慧",
    },
    encounterText:
      '你行至城北，慈济庵的粉墙剥落，门楣上香火冷清。一个老尼正扫着落叶，见你僧衣钵盂，双手合十念了声佛："同是佛门中人，师弟这是游方到此?"眉眼间带着几分照拂之意。',
    closingText: "〔慈济庵同门相怜，最是安稳去处。〕",
    options: [
      {
        optionId: "explain_travel_history",
        optionText: "合掌还礼，诉说游方来历",
        fixedResult: "ji",
        outcomeText:
          '你如实道来皇觉寺遣散、一路托钵的境遇。老尼听罢叹息，领你进庵，盛了满满一钵斋饭，又添两个杂面馒头："庵里也清苦，但总不忍见同门挨饿。"',
        settlementText: "〔结算〕🍚 斋饭 +0.8 升、🥟 馒头 ×2；🤝〔慈济庵·静慧〕好感 +2；🛏️ 可挂单一宿（回体力）。",
        effects: [
          { type: "add_grain", grainKind: "vegetarian", amountSheng: 0.8, quality: "temple_meal" },
          { type: "add_item", itemId: "mixed_grain_steamed_bun", quantity: 2 },
          { type: "add_bond", bondId: "bond.city_begging.beicheng_ciji_jinghui", delta: 2, label: "同门相怜" },
          { type: "set_flag", flagId: "flag.city_begging.beicheng_ciji.can_lodge", value: true },
        ],
      },
      {
        optionId: "lodge_copy_sutras",
        optionText: "请求在庵中借宿抄经",
        fixedResult: "ji",
        outcomeText: "你言愿以抄经、洒扫换一宿安歇。老尼颔首，取出旧经卷。你就着油灯抄了半夜——竟也认得大半，笔画渐熟。",
        settlementText:
          '〔结算〕🛏️ 借宿（体力全复）；📖 识字 +1（呼应老者"识得几个字多些本事"）；✨ 觉悟 +1；好感 +1。',
        effects: [
          { type: "restore_stamina_full", label: "借宿" },
          { type: "mod_attr", attrId: "literacy", delta: 1, label: '呼应老者"识得几个字多些本事"' },
          { type: "mod_attr", attrId: "awakening", delta: 1, label: "觉悟" },
          { type: "add_bond", bondId: "bond.city_begging.beicheng_ciji_jinghui", delta: 1, label: "借宿抄经" },
        ],
      },
      {
        optionId: "ask_one_bowl",
        optionText: "只求一钵便走，不愿叨扰",
        fixedResult: "ping",
        outcomeText:
          '你不愿久留，只求一钵充饥。老尼盛了饭，也不勉强："师弟既有去处，贫尼不留。路上珍重。"清清淡淡，两不相欠。',
        settlementText: "〔结算〕🍚 斋饭 +0.5 升；😐 好感 +0（守礼但缘浅）。",
        effects: [{ type: "add_grain", grainKind: "vegetarian", amountSheng: 0.5, quality: "temple_meal" }],
      },
    ],
  },
];

export function getCityBeggingDefaultLocation(locationId: string): CityBeggingDefaultLocation | null {
  return CITY_BEGGING_DEFAULT_LOCATIONS.find((location) => location.locationId === locationId) ?? null;
}
