import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";

export type CityMenuPanelId =
  | "culture"
  | "intel"
  | "locations"
  | "management"
  | "begging";

export type CityMenuState = {
  panelId: CityMenuPanelId;
  intelItems: string[];
};

export type CityCultureViewModel = {
  cityName: string;
  description: string;
  economyLevel: "富饶" | "繁荣" | "普通" | "萧条" | "民不聊生";
  economyValue: number;
  population: number | null;
  security: number | null;
};

export type CityManagementViewModel = {
  canManageTown: boolean;
  townLevel: number | null;
  buildingList: string[];
  taxRate: number | null;
};

const CITY_DESCRIPTION_BY_ID: Record<string, string> = {
  "city.kulan":
    "濠州地处淮西，近钟离旧里与皇觉寺一带。元末灾荒兵乱相逼，流民、僧侣、盐粮商旅与郭子兴部红巾军在此交错，朱元璋早年投身乱世的起点也在这一片淮河城镇之间。",
  "city.yingtian":
    "集庆路治所在上元、江宁之间，是江南财赋与水陆交通重镇。元末朱元璋攻取后改为应天府，城中士人、工匠、军府与商旅汇聚，逐渐成为吴军经营江南的根基。",
  "city.luzhou":
    "庐州路以合肥为治，扼江淮之间，北通淮右、南接江南。元末此地屡为诸军争夺，城中军屯、粮道和市集并重，是从濠州转入大江南北战局的要冲。",
  "city.anqing":
    "安庆路治怀宁，临大江而控皖西，是江淮通往江西、湖广的门户。元末兵锋往来，舟师、粮运和城防都格外要紧，民间风气兼有江口商埠与前线军镇的紧张。",
  "city.taiping":
    "太平路在当涂一带，夹江而立，是由采石、姑孰进入江南腹地的跳板。朱元璋集团南下后此地成为沿江经营的重要支点，城中多见舟师、军匠与商贩往来。",
  "city.anfeng":
    "安丰路地处淮北平原，元末曾为小明王韩林儿政权的重要据点。刘福通等红巾军在此聚众抗元，城中军屯、粮草和流亡士民混杂，名义上的宋政权气象仍在。",
  "city.runing":
    "颍州一带靠近颍水与淮北平原，是红巾军早期活动频繁之地。刘福通、韩林儿势力影响在民间流传，乡村堡寨与州城守军并存，局势比江南更动荡。",
  "city.huaian":
    "高邮、淮安一线倚靠运河与盐运，元末为张士诚集团兴起的重要区域。盐徒、漕运船户、粮商和军寨相互依存，富庶水道背后也藏着割据势力的军需压力。",
  "city.yangzhou":
    "扬州路治江都，承运河、盐利与江淮商路之便，历来繁华。元末张士诚势力盘踞淮东，城中盐商、文士、船户与军府往来密切，繁荣中带着割据边境的戒备。",
  "city.suzhou":
    "平江路治吴县，是江南丝织、粮赋和园林文风汇聚之地。张士诚据有苏州后，城中商贾、士人和手工业更加兴盛，也因财赋丰厚而成为朱元璋东进必须面对的重镇。",
  "city.wuchang":
    "武昌路治江夏，扼长江中游与湖广水陆交通。陈友谅集团以此为核心经营陈汉，舟师、铁冶、粮仓和军府气息浓厚，是朱元璋西线最强劲的对手所在。",
  "city.nanchang":
    "龙兴路即南昌一带，临赣江而通鄱阳湖，是江西门户。后来的洪都之战使此地名重一时，朱文正、花云等守城故事使城中风土兼有江右文脉与前线坚城气质。",
  "city.chongqing":
    "重庆路治巴县，依山临江，控嘉陵江与长江汇流之处。元末四川诸路山川阻隔，商旅多循水道，城中药材、木材、盐货与山地军寨往来频密。",
  "city.chengdu":
    "成都路居四川平原腹心，沃野富庶，蜀锦、药材与粮食素称殷实。元末虽远离江淮主战场，却因盆地形胜自成一方，市井繁华而城防相对稳固。",
  "city.ningbo":
    "庆元路治鄞县，面向东海，兼有海船、盐场和海外贸易气息。元末方国珍势力活动于浙东沿海，渔户、海商与水军相杂，城中风土较江南内陆更重海潮之利。",
  "city.wenzhou":
    "温州路治永嘉，山海相逼，港湾、木材和盐渔贸易构成地方生计。元末浙东沿海势力往来频繁，乡兵、水寨与海商消息灵通，民风较为坚韧机警。",
  "city.fuzhou":
    "福州路治闽县，临闽江入海之口，是福建沿海商贸和山海货物流通之地。元末地方官军与海上势力并存，茶、木材、鱼盐与远航消息在城中汇聚。",
  "city.dadu":
    "大都路是元廷中枢所在，宫城、官署、驿路和各族商旅云集。作为北方都城，城中制度气象仍盛，蒙古、色目、汉人工匠与士民杂处，繁华背后依赖庞大的漕运供给。",
  "city.dingyuan":
    "定远在淮西腹地，邻近濠州、钟离等朱元璋早年活动区域。此地多村社田畴与小城军寨，灾荒年间流民往来频繁，是由乡里走向州城与寺院的过渡地带。",
  "city.kaifeng":
    "汴梁旧为北宋故都，元代为河南江北行省重镇之一。城中保留中原大城的市井与官府格局，粮马、铁器和驿路往来密集，元末仍是北方军事与交通要地。",
  "city.gongchang":
    "巩昌路治陇西，处关陇通道，西接陇右、东望关中。元末此地多边军、马市与屯田，城镇风土带有西北驿路的粗粝和军镇色彩。",
  "city.fengyuan":
    "奉元路以咸宁、长安故地为核心，承关中形胜与旧都遗脉。元末陕西行省仍为西北军政重地，粮马、铁器、驿站和关塞守备共同塑造了厚重的关中风土。",
  "city.huangcun":
    "荒村只是淮西路边残破村落，田地荒芜，屋舍零落。灾荒与徭役过后，留下的多是饥民、旧井、破祠和难以久留的乡土记忆。",
};

const HOUSE_INTEL_BY_MODULE_ID: Partial<Record<string, string>> = {
  "leader-residence": "府邸之中似乎正在筛选可用之人。",
  "temple-house": "寺院近日香火未断，僧众似乎仍在筹措米粮。",
  "home-house": "自宅一带近来少见外人走动，倒适合静心歇脚。",
  "keep-house": "帅府似乎正在整理军务，或许正缺能办事的人。",
  "tea-house": "茶馆里似乎有人正在议论时局。",
  "market-house": "城中商铺正在张罗一批新货。",
  "grain-shop": "粮铺掌柜最近正盯着米价起落。",
  "medicine-house": "药铺郎中正在留心懂药理的帮手。",
  tavern: "酒肆中似乎有人正在进行舌战。",
};

function hashString(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function pickRotatedItems<T>(
  items: readonly T[],
  count: number,
  offset: number
): T[] {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  const uniqueCount = Math.min(count, items.length);
  const startIndex = ((offset % items.length) + items.length) % items.length;

  return Array.from({ length: uniqueCount }, (_, index) => {
    const resolvedIndex = (startIndex + index) % items.length;
    return items[resolvedIndex] as T;
  });
}

function buildDefaultCityDescription(cityDefinition: CityDefinition): string {
  const regionText = cityDefinition.tags.includes("jiangnan")
    ? "江南水陆交汇"
    : cityDefinition.tags.includes("jianghuai")
      ? "江淮要冲"
      : cityDefinition.tags.includes("river-port")
        ? "江港水埠"
        : cityDefinition.tags.includes("coastal")
          ? "沿海商埠"
          : "兵商往来的城池";
  const tradeText = cityDefinition.tags.includes("commercial")
    ? "商旅来往密集"
    : cityDefinition.tags.includes("market")
      ? "市井交易颇为活跃"
      : "市井买卖维持着城中生计";
  const securityText =
    cityDefinition.danger >= 50
      ? "只是世道未宁，街头巷尾始终带着几分戒备。"
      : "城中秩序尚可，百姓也还留着些许安稳气。";

  return `${cityDefinition.name}位于${regionText}之地，${tradeText}。此地风土杂糅，行旅、军士与本地居民各有来路，${securityText}`;
}

export function isPlayerMonkIdentity(playerCharacter: CharacterDefinition): boolean {
  const identityText = [
    playerCharacter.title ?? "",
    playerCharacter.occupation ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return (
    identityText.includes("僧") ||
    identityText.includes("和尚") ||
    identityText.includes("monk")
  );
}

export function getCityEconomyLevel(
  prosperity: number
): CityCultureViewModel["economyLevel"] {
  if (prosperity >= 90) {
    return "富饶";
  }

  if (prosperity >= 80) {
    return "繁荣";
  }

  if (prosperity >= 60) {
    return "普通";
  }

  if (prosperity >= 40) {
    return "萧条";
  }

  return "民不聊生";
}

export function createCityCultureViewModel(
  cityDefinition: CityDefinition
): CityCultureViewModel {
  return {
    cityName: cityDefinition.name,
    description:
      CITY_DESCRIPTION_BY_ID[cityDefinition.id] ??
      buildDefaultCityDescription(cityDefinition),
    economyLevel: getCityEconomyLevel(cityDefinition.prosperity),
    economyValue: cityDefinition.prosperity,
    population: null,
    security: null,
  };
}

function createMockEventIntel(cityDefinition: CityDefinition): string[] {
  const items = [
    cityDefinition.prosperity >= 80
      ? `城中商队近日活络，${cityDefinition.name}的买卖声势似乎比往常更盛。`
      : `${cityDefinition.name}的街市近来显得谨慎，买卖双方都在观望风向。`,
    cityDefinition.danger >= 45
      ? "近来有陌生武人在城中走动，几处热闹地带都在议论他们的来历。"
      : "城中近来未见大乱，几处热闹地带反而更适合打听消息。",
    `听说${cityDefinition.name}近日又起了新的传闻，若去人多之处，也许能摸到线头。`,
  ];

  return items;
}

export function createCityIntelItems(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinition: CityNpcPoolDefinition | null;
  calendar: {
    year: number;
    month: number;
    day: number;
  };
}): string[] {
  const houseIntel = input.houseDefinitions
    .map((houseDefinition) =>
      houseDefinition.moduleId == null
        ? null
        : HOUSE_INTEL_BY_MODULE_ID[houseDefinition.moduleId] ?? null
    )
    .filter((text): text is string => text != null);
  const entryIntel = input.cityEntries.map(
    (cityEntry) => `${cityEntry.name}一带似乎有人在等合适的来客。`
  );
  const npcIntel =
    input.cityNpcPoolDefinition?.residents.flatMap((residentDefinition) =>
      residentDefinition.intelPool.slice(0, 1)
    ) ?? [];
  const mockEventIntel = createMockEventIntel(input.cityDefinition);
  const uniqueItems = Array.from(
    new Set([...houseIntel, ...entryIntel, ...npcIntel, ...mockEventIntel])
  );
  const rotationOffset =
    input.calendar.year * 372 +
    input.calendar.month * 31 +
    input.calendar.day +
    hashString(input.cityDefinition.id);

  return pickRotatedItems(uniqueItems, 4, rotationOffset);
}

export function createCityManagementViewModel(): CityManagementViewModel {
  return {
    canManageTown: false,
    townLevel: null,
    buildingList: [],
    taxRate: null,
  };
}

export function createCityMenuState(input: {
  panelId: CityMenuPanelId;
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinition: CityNpcPoolDefinition | null;
  calendar: {
    year: number;
    month: number;
    day: number;
  };
}): CityMenuState {
  return {
    panelId: input.panelId,
    intelItems:
      input.panelId === "intel"
        ? createCityIntelItems(input)
        : [],
  };
}
