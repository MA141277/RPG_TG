import type { TradeGoodCategory } from "../../domain/trade-good";

export type MarketHouseActorContent = {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
  isFixedHost: boolean;
};

export const marketHouseFixedBoss: MarketHouseActorContent = {
  id: "shopkeeper_qian",
  name: "钱掌柜",
  title: "货栈老板",
  personality: "精明",
  specialty: "交易",
  favorability: 0,
  isFixedHost: true,
};

export const marketHouseRandomNpcPool: MarketHouseActorContent[] = [
  {
    id: "horse_merchant",
    name: "韩书商",
    title: "书画贩子",
    personality: "豪爽",
    specialty: "书画",
    favorability: 0,
    isFixedHost: false,
  },
  {
    id: "medicine_merchant",
    name: "孙药商",
    title: "药材商",
    personality: "谨慎",
    specialty: "药材",
    favorability: 0,
    isFixedHost: false,
  },
  {
    id: "silk_merchant",
    name: "沈老板",
    title: "丝商",
    personality: "圆滑",
    specialty: "丝绸",
    favorability: 0,
    isFixedHost: false,
  },
  {
    id: "traveler_merchant",
    name: "罗行商",
    title: "行脚商人",
    personality: "健谈",
    specialty: "外地见闻",
    favorability: 0,
    isFixedHost: false,
  },
];

export const marketHouseGreetingLines = [
  "（拨了拨算盘，抬眼便笑）",
  "“货栈刚开门，南来北往的货都在这里。想跑商，先看准价。”",
];

export const marketHouseBossOpenLines = [
  "（抬手）请你靠近货单。",
  "“想买想卖都行，先把价看明白，商路上吃亏的都是心急人。”",
];

export const marketHouseGuestOpenLineBySpecialty: Record<string, string> = {
  书画: "（抖了抖衣袖）像是在等你先问哪座城的行情。",
  药材: "（把药包压得更紧了些）话里透着几分试探。",
  丝绸: "（笑而不语，用指尖轻轻点了点货箱）",
  外地见闻: "（一坐下就压低了嗓音）像是肚里装满了路上消息。",
};

export const marketHouseSmallTalkLines = [
  "最近生意不好做。",
  "跑商最怕遇上乱兵。",
  "今年粮价有些邪门。",
  "如今银子越来越难赚了。",
];

export const marketHouseRumorsByCategory: Partial<Record<TradeGoodCategory, string[]>> = {
  grain: [
    "最近粮价不太稳定。",
    "北边路上驿站缺粮，米麦怕是还要再涨。",
  ],
  medicine: [
    "近来疫气未散，药材价钱多半还要往上拱。",
    "山路断了几段，药材入城慢了不少。",
  ],
  silk: [
    "江南丝绸最近价格不错。",
    "绸缎铺子这阵子收货勤，怕是富户宴席多了。",
  ],
  arms: [
    "最近北边战事频繁，火药铁器怕是还要涨。",
    "军中采买一动，铁货就难有低价。",
  ],
  horses: [
    "草场今年风紧，马价恐怕还要往上走。",
    "边城买马的人多，战马一到手就有人抢。",
  ],
  special: [
    "古玩字画这东西，看的是眼力，也看的是门路。",
    "外地豪客近来多，稀罕货出手比平日快。",
  ],
};

export const marketHouseGeneralRumors = [
  "最近北边战事频繁，火药价格怕是还要涨。",
  "江南丝绸最近价格不错。",
  "最近粮价不太稳定。",
];
