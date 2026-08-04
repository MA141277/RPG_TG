import type { CityId } from "../../domain/city";
import type {
  SettlementTradeCityGoodsProfile,
  SettlementTradeCityProfile,
  SettlementTradeGoodId,
  SettlementTradeTier,
} from "../../domain/settlement-trade";

export const settlementTradeTierMultipliers = {
  abundant: 1,
  local: 1.4,
  scarce: 2.2,
  "extreme-scarce": 3,
} as const satisfies Record<SettlementTradeTier, number>;

type SettlementTradeMatrixMultiplier = 1 | 1.4 | 2.2 | 3;

const settlementTradeDefaultInitialStockByTier = {
  abundant: 32,
  local: 20,
  scarce: 10,
  "extreme-scarce": 6,
} as const satisfies Record<SettlementTradeTier, number>;

function resolveTierFromMultiplier(
  multiplier: SettlementTradeMatrixMultiplier
): SettlementTradeTier {
  switch (multiplier) {
    case 1:
      return "abundant";
    case 1.4:
      return "local";
    case 2.2:
      return "scarce";
    case 3:
      return "extreme-scarce";
  }
}

function createGoodsProfileFromMatrixRow(
  multipliersByGoodsId: Record<SettlementTradeGoodId, SettlementTradeMatrixMultiplier>,
  overrides: Partial<
    Record<SettlementTradeGoodId, Partial<SettlementTradeCityGoodsProfile>>
  > = {}
): SettlementTradeCityProfile["goods"] {
  return Object.fromEntries(
    (Object.entries(multipliersByGoodsId) as Array<
      [SettlementTradeGoodId, SettlementTradeMatrixMultiplier]
    >).map(([goodsId, multiplier]) => {
      const tier = resolveTierFromMultiplier(multiplier);
      const override = overrides[goodsId];

      return [
        goodsId,
        {
          tier,
          initialStock:
            override?.initialStock ??
            settlementTradeDefaultInitialStockByTier[tier],
          ...(override?.routeHints == null
            ? {}
            : { routeHints: [...override.routeHints] }),
          ...(override?.demandNotes == null
            ? {}
            : { demandNotes: [...override.demandNotes] }),
        },
      ];
    })
  ) as SettlementTradeCityProfile["goods"];
}

export const settlementTradeCityProfiles = [
  {
    cityId: "city.kulan",
    cityName: "Haozhou",
    goods: createGoodsProfileFromMatrixRow({
      silk_textiles: 2.2,
      ramie_cloth: 1,
      cotton_cloth: 2.2,
      tea: 2.2,
      wine: 1,
      ceramics: 1,
      copperware: 2.2,
      ironware: 2.2,
      salt: 2.2,
      paper_brush: 2.2,
      bamboo_woodware: 2.2,
      woven_goods: 1.4,
      lacquer_oil: 2.2,
      stone_goods: 1.4,
      hides: 1.4,
    }),
  },
  {
    cityId: "city.yingtian",
    cityName: "Yingtian",
    goods: {
      silk_textiles: {
        tier: "abundant",
        initialStock: 36,
        routeHints: [
          "River routes toward Yangzhou and Kaifeng keep fine silk moving.",
        ],
      },
      paper_brush: {
        tier: "local",
        initialStock: 28,
        routeHints: [
          "Scholar households and offices north of the river restock through Yingtian.",
        ],
      },
      wine: {
        tier: "local",
        initialStock: 22,
        routeHints: [
          "Banquet houses pay extra when sealed wine arrives before festival weeks.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 14,
        demandNotes: [
          "Salt stays useful here, but the margin is better when bought farther downstream.",
        ],
      },
    },
  },
  {
    cityId: "city.luzhou",
    cityName: "Luzhou",
    goods: {
      wine: {
        tier: "abundant",
        initialStock: 34,
        routeHints: [
          "River taverns and ferry docks keep sealed wine moving in volume.",
        ],
      },
      bamboo_woodware: {
        tier: "local",
        initialStock: 22,
        routeHints: [
          "Mixed river traffic favors sturdy light wares out of Luzhou.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: [
          "Inland shipping gaps make salt cargo clear quickly here.",
        ],
      },
      ironware: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Tool demand spikes whenever local workshops need a fresh lot.",
        ],
      },
    },
  },
  {
    cityId: "city.anqing",
    cityName: "Anqing",
    goods: {
      bamboo_woodware: {
        tier: "abundant",
        initialStock: 30,
        routeHints: [
          "Timber rafts and ferry routes keep wood wares liquid in Anqing.",
        ],
      },
      wine: {
        tier: "local",
        initialStock: 20,
        routeHints: ["Dockside inns take steady sealed wine deliveries."],
      },
      ironware: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "River-defense works keep hardware demand firm around Anqing.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Salt jumps once upstream transport starts slipping behind.",
        ],
      },
    },
  },
  {
    cityId: "city.taiping",
    cityName: "Taiping",
    goods: {
      ceramics: {
        tier: "abundant",
        initialStock: 28,
        routeHints: [
          "River merchants move finished wares out in planned wholesale lots.",
        ],
      },
      bamboo_woodware: {
        tier: "local",
        initialStock: 24,
        routeHints: [
          "Mixed timber traffic keeps household wood wares moving.",
        ],
      },
      ironware: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: [
          "Construction crews buy tools at a premium when repairs begin.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Staple cargo disappears fast when convoy arrivals slip behind.",
        ],
      },
    },
  },
  {
    cityId: "city.anfeng",
    cityName: "Anfeng",
    goods: {
      cotton_cloth: {
        tier: "abundant",
        initialStock: 32,
        routeHints: ["Plain-route traders turn durable cloth here in bulk lots."],
      },
      hides: {
        tier: "local",
        initialStock: 20,
        routeHints: [
          "Horse and draft-animal traffic keeps leather stock relevant.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "Salt margins stay high once the road turns deeper inland.",
        ],
      },
      ironware: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Farm and camp buyers keep iron tools expensive in Anfeng.",
        ],
      },
    },
  },
  {
    cityId: "city.runing",
    cityName: "Runing",
    goods: {
      cotton_cloth: {
        tier: "abundant",
        initialStock: 30,
        routeHints: [
          "Everyday cloth moves steadily through the plain-market relays.",
        ],
      },
      salt: {
        tier: "local",
        initialStock: 22,
        routeHints: [
          "Staple cargo holds value well in the Runing relay markets.",
        ],
      },
      hides: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Military buyers keep hide bundles from sitting long in Runing.",
        ],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Record-keeping households still pay up for writing stock.",
        ],
      },
    },
  },
  {
    cityId: "city.huaian",
    cityName: "Huaian",
    goods: {
      salt: {
        tier: "abundant",
        initialStock: 38,
        routeHints: [
          "Canal salt flows give Huaian a deep and steady staple stock.",
        ],
      },
      paper_brush: {
        tier: "local",
        initialStock: 24,
        routeHints: [
          "Clerks along the canal keep document goods turning quickly.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "Wealthier households pay for fine bolts as soon as they arrive.",
        ],
      },
      wine: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Banquet demand leaves little sealed wine idle in Huaian.",
        ],
      },
    },
  },
  {
    cityId: "city.yangzhou",
    cityName: "Yangzhou",
    goods: {
      salt: {
        tier: "abundant",
        initialStock: 40,
        routeHints: [
          "Canal salt convoys keep this market supplied more reliably than inland cities.",
        ],
      },
      ceramics: {
        tier: "local",
        initialStock: 24,
        routeHints: [
          "Finished wares travel well toward rebuilding inland markets.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: [
          "Merchant houses reopen their silk ledgers quickly when premium bolts arrive.",
        ],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Bookkeepers and shipping clerks keep buying writing stock at a premium.",
        ],
      },
    },
  },
  {
    cityId: "city.suzhou",
    cityName: "Suzhou",
    goods: {
      ramie_cloth: {
        tier: "abundant",
        initialStock: 34,
        routeHints: ["Everyday cloth turns over quickly in the canal workshops."],
      },
      silk_textiles: {
        tier: "local",
        initialStock: 26,
        routeHints: [
          "Luxury buyers compare Suzhou silk directly against Yingtian cargo.",
        ],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: [
          "Workshop scribes pay well for reliable paper bundles and brush stock.",
        ],
      },
      wine: {
        tier: "scarce",
        initialStock: 8,
        demandNotes: [
          "Feast demand keeps cellar wine from staying on shelves for long.",
        ],
      },
    },
  },
  {
    cityId: "city.wuchang",
    cityName: "Wuchang",
    goods: {
      tea: {
        tier: "abundant",
        initialStock: 34,
        routeHints: [
          "River-junction traffic makes tea cargo easy to turn in Wuchang.",
        ],
      },
      ironware: {
        tier: "local",
        initialStock: 22,
        routeHints: [
          "Repair yards and workshops absorb iron goods steadily here.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: ["Salt keeps a markup once the river convoys thin out."],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Officials and clerks still burn through paper stock at speed.",
        ],
      },
    },
  },
  {
    cityId: "city.nanchang",
    cityName: "Nanchang",
    goods: {
      bamboo_woodware: {
        tier: "abundant",
        initialStock: 30,
        routeHints: [
          "Timber and river traffic support light craft wares in Nanchang.",
        ],
      },
      paper_brush: {
        tier: "local",
        initialStock: 24,
        routeHints: [
          "Local schools and offices keep scholar goods moving steadily.",
        ],
      },
      tea: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: ["Travelers pay well for dependable tea loads at Nanchang."],
      },
      ironware: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Repair work on the frontier routes lifts ironware prices quickly.",
        ],
      },
    },
  },
  {
    cityId: "city.chongqing",
    cityName: "Chongqing",
    goods: {
      salt: {
        tier: "abundant",
        initialStock: 34,
        routeHints: [
          "Mountain-river relay trade keeps Chongqing salt cargo active.",
        ],
      },
      lacquer_oil: {
        tier: "local",
        initialStock: 22,
        routeHints: [
          "Workshop districts consume finishing supplies at a steady pace.",
        ],
      },
      tea: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: ["Tea commands a premium again after the climb inland."],
      },
      stone_goods: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Builders pay for heavy worked stone once the route opens cleanly.",
        ],
      },
    },
  },
  {
    cityId: "city.chengdu",
    cityName: "Chengdu",
    goods: {
      woven_goods: {
        tier: "abundant",
        initialStock: 30,
        routeHints: [
          "Interior caravan routes keep sturdy woven cargo moving in volume.",
        ],
      },
      lacquer_oil: {
        tier: "local",
        initialStock: 20,
        routeHints: [
          "Workshop districts buy lacquer and oil steadily when construction picks up.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Traveling merchants still pay for fine silk showpieces deep inland.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: ["Salt caravans stay profitable once the route turns inland."],
      },
    },
  },
  {
    cityId: "city.ningbo",
    cityName: "Ningbo",
    goods: {
      salt: {
        tier: "abundant",
        initialStock: 36,
        routeHints: ["Sea-salt traffic keeps the Ningbo docks reliably supplied."],
      },
      ceramics: {
        tier: "local",
        initialStock: 24,
        routeHints: [
          "Coastal merchants move finished wares through mixed sea routes.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "Merchant patrons still chase prestige bolts from inland makers.",
        ],
      },
      wine: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Harbor traffic drains sealed wine faster than it can restock.",
        ],
      },
    },
  },
  {
    cityId: "city.wenzhou",
    cityName: "Wenzhou",
    goods: {
      stone_goods: {
        tier: "abundant",
        initialStock: 26,
        routeHints: [
          "Stone and mineral cargo pays best when moved in planned wholesale lots.",
        ],
      },
      copperware: {
        tier: "local",
        initialStock: 18,
        routeHints: ["Copperware turns steadily through artisan and temple buyers."],
      },
      wine: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Harbor inns buy sealed wine quickly once fleets come in together.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 8,
        demandNotes: [
          "Shipowners still want prestige cloth for gift and patronage traffic.",
        ],
      },
    },
  },
  {
    cityId: "city.fuzhou",
    cityName: "Fuzhou",
    goods: {
      tea: {
        tier: "abundant",
        initialStock: 38,
        routeHints: [
          "Tea loads turn quickly through maritime warehouses and relay ports.",
        ],
      },
      bamboo_woodware: {
        tier: "local",
        initialStock: 24,
        routeHints: [
          "Light craft goods travel well on mixed river and coastal routes.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: [
          "Refined salt keeps a price edge here after bad weather disrupts shipping.",
        ],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "Shipping ledgers and clerks keep burning through paper stock.",
        ],
      },
    },
  },
  {
    cityId: "city.dadu",
    cityName: "Dadu",
    goods: {
      paper_brush: {
        tier: "abundant",
        initialStock: 34,
        routeHints: ["Administrative demand keeps scholar goods liquid in Dadu."],
      },
      copperware: {
        tier: "local",
        initialStock: 20,
        routeHints: [
          "Large households and workshops buy worked copper steadily.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 12,
        demandNotes: [
          "Courtly taste still drives a markup on fine cloth in Dadu.",
        ],
      },
      tea: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "Premium tea keeps moving through elite households and halls.",
        ],
      },
    },
  },
  {
    cityId: "city.kaifeng",
    cityName: "Kaifeng",
    goods: {
      cotton_cloth: {
        tier: "abundant",
        initialStock: 36,
        routeHints: [
          "Bulk buyers in the north move durable cotton through caravan lots.",
        ],
      },
      paper_brush: {
        tier: "local",
        initialStock: 30,
        routeHints: [
          "Official households and copyists keep document goods in steady demand.",
        ],
      },
      wine: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Banquet brokers pay up when dependable wine caravans arrive intact.",
        ],
      },
      silk_textiles: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Prestige clothing still commands a northern markup in Kaifeng.",
        ],
      },
    },
  },
  {
    cityId: "city.gongchang",
    cityName: "Gongchang",
    goods: {
      hides: {
        tier: "abundant",
        initialStock: 28,
        routeHints: [
          "Hide bundles and leather stock move well with frontier supply traffic.",
        ],
      },
      ironware: {
        tier: "local",
        initialStock: 18,
        routeHints: [
          "Iron tools travel steadily into towns rebuilding their workshops.",
        ],
      },
      tea: {
        tier: "scarce",
        initialStock: 10,
        demandNotes: [
          "Tea cargo sells quickly when garrisons and travelers share the same market.",
        ],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 8,
        demandNotes: [
          "Frontier clerks still need dependable paper and brush bundles.",
        ],
      },
    },
  },
  {
    cityId: "city.fengyuan",
    cityName: "Fengyuan",
    goods: {
      hides: {
        tier: "abundant",
        initialStock: 30,
        routeHints: [
          "Horse and caravan traffic keeps hide bundles useful in Fengyuan.",
        ],
      },
      ironware: {
        tier: "local",
        initialStock: 22,
        routeHints: [
          "Workshop repairs keep tools moving through Fengyuan's yards.",
        ],
      },
      salt: {
        tier: "scarce",
        initialStock: 11,
        demandNotes: [
          "Staples bring a better margin again after the route turns west.",
        ],
      },
      paper_brush: {
        tier: "scarce",
        initialStock: 9,
        demandNotes: [
          "Clerks and officials still pay for reliable writing goods here.",
        ],
      },
    },
  },
] as const satisfies readonly SettlementTradeCityProfile[];

export const settlementTradeCityProfilesByCityId = Object.fromEntries(
  settlementTradeCityProfiles.map((profile) => [profile.cityId, profile])
) as Partial<Record<CityId, SettlementTradeCityProfile>>;
