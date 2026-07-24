import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, "..");
const packRoot = path.join(
  repositoryRoot,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang"
);
const outputDir = path.join(repositoryRoot, "generated", "blueprint");
const outputPath = path.join(
  outputDir,
  "event-canonical-reuse-first-batch-map.json"
);

const CITY_IDS = [
  "kulan",
  "yingtian",
  "luzhou",
  "anqing",
  "taiping",
  "anfeng",
  "runing",
  "huaian",
  "yangzhou",
  "suzhou",
  "wuchang",
  "nanchang",
  "chongqing",
  "chengdu",
  "ningbo",
  "wenzhou",
  "fuzhou",
  "dadu",
  "kaifeng",
  "gongchang",
  "fengyuan",
];

const EVENT_GROUPS = [
  { family: "home", action: "rest", canonicalId: "event.building.template.home.rest", expectedCopies: 20 },
  { family: "home", action: "leave", canonicalId: "event.building.template.home.leave", expectedCopies: 20 },
  { family: "leader_residence", action: "review", canonicalId: "event.building.template.house.leader_residence.review", expectedCopies: 21 },
  { family: "leader_residence", action: "leave", canonicalId: "event.building.template.house.leader_residence.leave", expectedCopies: 21 },
  { family: "temple", action: "review", canonicalId: "event.building.template.house.temple.review", expectedCopies: 21 },
  { family: "temple", action: "work", canonicalId: "event.building.template.house.temple.work", expectedCopies: 21, excludeSourceIds: ["event.building.house.kulan.temple.work"] },
  { family: "temple", action: "donate", canonicalId: "event.building.template.house.temple.donate", expectedCopies: 21 },
  { family: "temple", action: "leave", canonicalId: "event.building.template.house.temple.leave", expectedCopies: 21 },
  { family: "keep", action: "review", canonicalId: "event.building.template.house.keep.review", expectedCopies: 21 },
  { family: "keep", action: "work", canonicalId: "event.building.template.house.keep.work", expectedCopies: 21 },
  { family: "keep", action: "leave", canonicalId: "event.building.template.house.keep.leave", expectedCopies: 21 },
  { family: "tea_house", action: "talk", canonicalId: "event.building.template.house.tea_house.talk", expectedCopies: 21 },
  { family: "tea_house", action: "intel", canonicalId: "event.building.template.house.tea_house.intel", expectedCopies: 21 },
  { family: "tea_house", action: "tea", canonicalId: "event.building.template.house.tea_house.tea", expectedCopies: 21 },
  { family: "tea_house", action: "leave", canonicalId: "event.building.template.house.tea_house.leave", expectedCopies: 21 },
  { family: "market", action: "talk", canonicalId: "event.building.template.house.market.talk", expectedCopies: 21 },
  { family: "market", action: "trade", canonicalId: "event.building.template.house.market.trade", expectedCopies: 21 },
  { family: "market", action: "intel", canonicalId: "event.building.template.house.market.intel", expectedCopies: 21 },
  { family: "market", action: "leave", canonicalId: "event.building.template.house.market.leave", expectedCopies: 21 },
  { family: "grain_shop", action: "trade", canonicalId: "event.building.template.house.grain_shop.trade", expectedCopies: 21 },
  { family: "grain_shop", action: "accounting", canonicalId: "event.building.template.house.grain_shop.accounting", expectedCopies: 21 },
  { family: "grain_shop", action: "leave", canonicalId: "event.building.template.house.grain_shop.leave", expectedCopies: 21 },
  { family: "medicine_house", action: "treatment", canonicalId: "event.building.template.house.medicine_house.treatment", expectedCopies: 21 },
  { family: "medicine_house", action: "compounding", canonicalId: "event.building.template.house.medicine_house.compounding", expectedCopies: 21 },
  { family: "medicine_house", action: "leave", canonicalId: "event.building.template.house.medicine_house.leave", expectedCopies: 21 },
  { family: "inn", action: "talk", canonicalId: "event.building.template.house.inn.talk", expectedCopies: 21 },
  { family: "inn", action: "drink", canonicalId: "event.building.template.house.inn.drink", expectedCopies: 21 },
  { family: "inn", action: "gamble", canonicalId: "event.building.template.house.inn.gamble", expectedCopies: 21 },
  { family: "inn", action: "work", canonicalId: "event.building.template.house.inn.work", expectedCopies: 21 },
  { family: "inn", action: "leave", canonicalId: "event.building.template.house.inn.leave", expectedCopies: 21 },
];

const BINDING_GROUPS = [
  { family: "home", itemId: "rest", canonicalId: "binding.building.template.home.rest.container-item", expectedCopies: 20 },
  { family: "home", itemId: "leave", canonicalId: "binding.building.template.home.leave.container-item", expectedCopies: 20 },
  { family: "leader_residence", itemId: "review", canonicalId: "binding.building.template.house.leader_residence.review.container-item", expectedCopies: 21 },
  { family: "leader_residence", itemId: "leave", canonicalId: "binding.building.template.house.leader_residence.leave.container-item", expectedCopies: 21 },
  { family: "temple", itemId: "review", canonicalId: "binding.building.template.house.temple.review.container-item", expectedCopies: 21 },
  { family: "temple", itemId: "work", canonicalId: "binding.building.template.house.temple.work.container-item", expectedCopies: 21, excludeSourceIds: ["binding.building.house.kulan.temple.work.container-item"] },
  { family: "temple", itemId: "donate", canonicalId: "binding.building.template.house.temple.donate.container-item", expectedCopies: 21 },
  { family: "temple", itemId: "leave", canonicalId: "binding.building.template.house.temple.leave.container-item", expectedCopies: 21 },
  { family: "keep", itemId: "review", canonicalId: "binding.building.template.house.keep.review.container-item", expectedCopies: 21 },
  { family: "keep", itemId: "work", canonicalId: "binding.building.template.house.keep.work.container-item", expectedCopies: 21 },
  { family: "keep", itemId: "leave", canonicalId: "binding.building.template.house.keep.leave.container-item", expectedCopies: 21 },
  { family: "tea_house", itemId: "talk", canonicalId: "binding.building.template.house.tea_house.talk.container-item", expectedCopies: 21 },
  { family: "tea_house", itemId: "intel", canonicalId: "binding.building.template.house.tea_house.intel.container-item", expectedCopies: 21 },
  { family: "tea_house", itemId: "tea", canonicalId: "binding.building.template.house.tea_house.tea.container-item", expectedCopies: 21 },
  { family: "tea_house", itemId: "leave", canonicalId: "binding.building.template.house.tea_house.leave.container-item", expectedCopies: 21 },
  { family: "market", itemId: "talk", canonicalId: "binding.building.template.house.market.talk.container-item", expectedCopies: 21 },
  { family: "market", itemId: "trade", canonicalId: "binding.building.template.house.market.trade.container-item", expectedCopies: 21 },
  { family: "market", itemId: "intel", canonicalId: "binding.building.template.house.market.intel.container-item", expectedCopies: 21 },
  { family: "market", itemId: "leave", canonicalId: "binding.building.template.house.market.leave.container-item", expectedCopies: 21 },
  { family: "grain_shop", itemId: "trade", canonicalId: "binding.building.template.house.grain_shop.trade.container-item", expectedCopies: 21 },
  { family: "grain_shop", itemId: "accounting", canonicalId: "binding.building.template.house.grain_shop.accounting.container-item", expectedCopies: 21 },
  { family: "grain_shop", itemId: "leave", canonicalId: "binding.building.template.house.grain_shop.leave.container-item", expectedCopies: 21 },
  { family: "medicine_house", itemId: "treatment", canonicalId: "binding.building.template.house.medicine_house.treatment.container-item", expectedCopies: 21 },
  { family: "medicine_house", itemId: "compounding", canonicalId: "binding.building.template.house.medicine_house.compounding.container-item", expectedCopies: 21 },
  { family: "medicine_house", itemId: "leave", canonicalId: "binding.building.template.house.medicine_house.leave.container-item", expectedCopies: 21 },
  { family: "inn", itemId: "talk", canonicalId: "binding.building.template.house.inn.talk.container-item", expectedCopies: 21 },
  { family: "inn", itemId: "drink", canonicalId: "binding.building.template.house.inn.drink.container-item", expectedCopies: 21 },
  { family: "inn", itemId: "gamble", canonicalId: "binding.building.template.house.inn.gamble.container-item", expectedCopies: 21 },
  { family: "inn", itemId: "work", canonicalId: "binding.building.template.house.inn.work.container-item", expectedCopies: 21 },
  { family: "inn", itemId: "leave", canonicalId: "binding.building.template.house.inn.leave.container-item", expectedCopies: 21 },
];

const ARRANGEMENT_GROUPS = [
  { groupKey: "home.standard", canonicalId: "arrangement.template.home.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan"), sourceIds: null },
  { groupKey: "temple.standard", canonicalId: "arrangement.template.house.temple.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan"), family: "temple" },
  { groupKey: "keep.standard", canonicalId: "arrangement.template.house.keep.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan"), family: "keep" },
  { groupKey: "market.standard", canonicalId: "arrangement.template.house.market.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan"), family: "market" },
  { groupKey: "grain_shop.standard", canonicalId: "arrangement.template.house.grain_shop.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan"), family: "grain_shop" },
  { groupKey: "medicine_house.standard", canonicalId: "arrangement.template.house.medicine_house.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan"), family: "medicine_house" },
  { groupKey: "tea_house.standard", canonicalId: "arrangement.template.house.tea_house.standard", includeCities: CITY_IDS.filter((cityId) => cityId !== "kulan" && cityId !== "suzhou"), family: "tea_house" },
  { groupKey: "leader_residence.civil-cluster", canonicalId: "arrangement.template.house.leader_residence.civil-cluster", includeCities: ["anqing", "anfeng", "runing", "huaian", "chongqing", "wenzhou", "fengyuan"], family: "leader_residence" },
];

const PRESERVATION_EXCEPTIONS = {
  events: ["event.building.house.kulan.temple.work"],
  bindings: ["binding.building.house.kulan.temple.work.container-item"],
  arrangements: [
    "arrangement.city.kulan.home_001",
    "arrangement.city.kulan.house.kulan.temple",
    "arrangement.city.kulan.house.kulan.keep",
    "arrangement.city.kulan.house.kulan.market",
    "arrangement.city.kulan.house.kulan.grain_shop",
    "arrangement.city.kulan.house.kulan.medicine_house",
    "arrangement.city.kulan.house.kulan.tea_house",
    "arrangement.city.suzhou.house.suzhou.tea_house",
    "arrangement.city.kulan.house.kulan.leader_residence",
    "arrangement.city.yingtian.house.yingtian.leader_residence",
    "arrangement.city.luzhou.house.luzhou.leader_residence",
    "arrangement.city.taiping.house.taiping.leader_residence",
    "arrangement.city.yangzhou.house.yangzhou.leader_residence",
    "arrangement.city.suzhou.house.suzhou.leader_residence",
    "arrangement.city.wuchang.house.wuchang.leader_residence",
    "arrangement.city.nanchang.house.nanchang.leader_residence",
    "arrangement.city.chengdu.house.chengdu.leader_residence",
    "arrangement.city.ningbo.house.ningbo.leader_residence",
    "arrangement.city.fuzhou.house.fuzhou.leader_residence",
    "arrangement.city.dadu.house.dadu.leader_residence",
    "arrangement.city.kaifeng.house.kaifeng.leader_residence",
    "arrangement.city.gongchang.house.gongchang.leader_residence",
  ],
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(packRoot, relativePath), "utf8"));
}

const events = readJson("events.json");
const bindings = readJson("event-bindings.json");
const arrangements = readJson("building-arrangements.json");

function familyFromEventId(eventId) {
  const houseMatch = /^event\.building\.house\.([^.]+)\.([^.]+)\.([^.]+)$/.exec(eventId);
  if (houseMatch) {
    return { cityId: houseMatch[1], family: houseMatch[2], action: houseMatch[3] };
  }
  const homeMatch = /^event\.building\.home\.([^.]+)\.([^.]+)$/.exec(eventId);
  if (homeMatch) {
    return { cityId: homeMatch[1], family: "home", action: homeMatch[2] };
  }
  return null;
}

function familyFromBinding(binding) {
  const ownerId = String(binding?.owner?.id ?? "");
  const itemId = String(binding?.trigger?.extra?.itemId ?? "");
  const houseMatch = /^house\.([^.]+)\.(.+)$/.exec(ownerId);
  if (houseMatch) {
    return { cityId: houseMatch[1], family: houseMatch[2], itemId };
  }
  const homeMatch = /^home\.([^.]+)$/.exec(ownerId);
  if (homeMatch) {
    return { cityId: homeMatch[1], family: "home", itemId };
  }
  return null;
}

function arrangementIdFor(cityId, family) {
  if (family === "home") {
    return `arrangement.city.${cityId}.home.${cityId}`;
  }
  return `arrangement.city.${cityId}.house.${cityId}.${family}`;
}

function assertCount(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} expected ${expected} records but found ${actual}.`);
  }
}

const eventMappings = [];
for (const group of EVENT_GROUPS) {
  const sourceIds = events
    .map((event) => event.id)
    .filter((eventId) => {
      const parsed = familyFromEventId(eventId);
      return parsed != null && parsed.family === group.family && parsed.action === group.action;
    })
    .filter((eventId) => !new Set(group.excludeSourceIds ?? []).has(eventId))
    .sort();
  assertCount(`event group ${group.canonicalId}`, sourceIds.length, group.expectedCopies - (group.excludeSourceIds?.length ?? 0));
  eventMappings.push({
    family: group.family,
    action: group.action,
    canonicalId: group.canonicalId,
    sourceIds,
  });
}

const bindingMappings = [];
for (const group of BINDING_GROUPS) {
  const sourceIds = bindings
    .filter((binding) => binding?.trigger?.action === "building-container-item-action")
    .filter((binding) => {
      const parsed = familyFromBinding(binding);
      return parsed != null && parsed.family === group.family && parsed.itemId === group.itemId;
    })
    .map((binding) => binding.id)
    .filter((bindingId) => !new Set(group.excludeSourceIds ?? []).has(bindingId))
    .sort();
  assertCount(`binding group ${group.canonicalId}`, sourceIds.length, group.expectedCopies - (group.excludeSourceIds?.length ?? 0));
  bindingMappings.push({
    family: group.family,
    itemId: group.itemId,
    canonicalId: group.canonicalId,
    sourceIds,
  });
}

const arrangementMappings = [];
for (const group of ARRANGEMENT_GROUPS) {
  const sourceIds = group.includeCities
    .map((cityId) => arrangementIdFor(cityId, group.family ?? "home"))
    .filter((arrangementId) => arrangements.some((arrangement) => arrangement.id === arrangementId))
    .sort();
  arrangementMappings.push({
    groupKey: group.groupKey,
    canonicalId: group.canonicalId,
    sourceIds,
  });
}

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: "target.event-follow-up-routing-settlement-and-canonical-reuse-convergence",
  queueId: "queue.event-and-building-instance-canonical-reuse",
  activeTask: "task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline",
  packId: "zhuyuanzhang",
  eventMappings,
  bindingMappings,
  arrangementMappings,
  preservationExceptions: PRESERVATION_EXCEPTIONS,
  summary: {
    canonicalEventGroups: eventMappings.length,
    canonicalEventSources: eventMappings.reduce((count, entry) => count + entry.sourceIds.length, 0),
    canonicalBindingGroups: bindingMappings.length,
    canonicalBindingSources: bindingMappings.reduce((count, entry) => count + entry.sourceIds.length, 0),
    canonicalArrangementGroups: arrangementMappings.length,
    canonicalArrangementSources: arrangementMappings.reduce((count, entry) => count + entry.sourceIds.length, 0),
  },
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
