import path from "node:path";

export const DEFAULT_TEMPLATE_REGISTERED_PACK_URL =
  "/builtin-script-editor-templates/zhuyuanzhang/pack.json";

export const LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT =
  "public/script-editor-templates/zhuyuanzhang";

export const REGISTERED_BUILTIN_TEMPLATE_ASSET_PUBLICATION_ROOT =
  "public/builtin-script-editor-templates/zhuyuanzhang";

export const REGISTERED_BUILTIN_TEMPLATE_ASSET_FILE_NAMES = Object.freeze([
  "assets/maps/HD.png",
  "assets/maps/tie1.png",
  "assets/maps/tietu.png",
  "assets/maps/yuanmo-fog-noise.png",
  "assets/maps/yuanmo-map-climates.png",
  "assets/maps/yuanmo-map-ground-types.png",
  "assets/maps/yuanmo-map-heights.png",
  "assets/maps/yuanmo-map-regions.png",
  "assets/maps/yuanmo-map-trade-routes.png",
  "assets/maps/yuanmo-water-noise.png",
]);

export const MAINTAINED_PACK_ROOTS = Object.freeze({
  builtinRuntimePack: "src/content/scenario-packs/zhuyuanzhang",
  scriptEditorTemplatePack:
    "src/modules/script-editor/builtin-templates/zhuyuanzhang",
});

export const PUBLISHED_PACK_ROOTS = Object.freeze({
  registeredBuiltinTemplatePublication:
    "public/builtin-script-editor-templates/zhuyuanzhang",
});

export const SUPPORTED_SYNC_SOURCES = Object.freeze([
  "builtin-runtime-pack",
  "script-editor-template-pack",
]);

export const PUBLIC_RETIREMENT_GATE = Object.freeze([
  "default template URL no longer points at /script-editor-templates/zhuyuanzhang/pack.json",
  "equivalent browser-loadable template coverage exists outside public/script-editor-templates/zhuyuanzhang/**",
  "legacy public manifest URL import coverage is intentionally retired",
  "legacy public folder-import compatibility is replaced by a self-contained package outside public/script-editor-templates/zhuyuanzhang/**",
]);

export const SHARED_SYNC_FILE_RULES = Object.freeze([
  Object.freeze({
    fileName: "scenario-profile.json",
    mode: "replace-whole-file",
    reason: "启动期场景配置目前必须在两包之间保持一致。",
  }),
  Object.freeze({
    fileName: "characters.json",
    mode: "startup-character-projection",
    reason: "当前只同步启动期角色身份字段，并保留模板包专属元数据。",
  }),
  Object.freeze({
    fileName: "text-entries.json",
    mode: "shared-key-overlay",
    reason: "共享文本条目需要一致，但模板包额外的编辑器/运行时辅助条目不能被覆盖掉。",
  }),
  Object.freeze({
    fileName: "activities.json",
    mode: "shared-id-overlay",
    reason: "活动记录的共享字段要同步，但需要保留包专属字段与包专属活动。",
  }),
  Object.freeze({
    fileName: "pack.json",
    mode: "pack-manifest-projection",
    reason:
      "pack manifest 现已具备 shared/runtime-only/template-only file-key 边界，应通过投影同步而不是继续完全 deferred。",
  }),
  Object.freeze({
    fileName: "cities.json",
    mode: "city-projection",
    reason:
      "cities 现已具备 shared fields、houseIds generic/runtime 映射与 template-only editor fields 边界，应通过投影同步而不是继续完全 deferred。",
  }),
  Object.freeze({
    fileName: "maps.json",
    mode: "map-projection",
    reason:
      "maps 现已具备 runtime-canonical map ids、runtime-only campaign 扩展字段与 template-preserved asset/layout surface 边界，应通过投影同步而不是继续完全 deferred。",
  }),
  Object.freeze({
    fileName: "events.json",
    mode: "event-projection",
    reason:
      "events 现已具备 runtime-canonical shared ids、template-only active event surface 与 story event template-format gap 边界，应通过投影同步而不是继续完全 deferred。",
  }),
  Object.freeze({
    fileName: "city-entries.json",
    mode: "city-entry-projection",
    reason:
      "city entries 现已具备 template-only entries 与 leader-residence targetHouseId 映射边界，应通过投影同步而不是继续完全 deferred。",
  }),
  Object.freeze({
    fileName: "houses.json",
    mode: "house-projection",
    reason:
      "houses 现已具备 runtime concrete <-> template generic/asymmetric projection 边界，应通过投影同步而不是继续完全 deferred。",
  }),
]);

export const ADDITIVE_SHARED_TEXT_ENTRY_PREFIXES = Object.freeze([
  "runtime.zhu_yuanzhang.temple.",
]);

export const DEFERRED_SYNC_FILE_RULES = Object.freeze([]);

export const PACK_MANIFEST_SHARED_FILE_KEYS = Object.freeze([
  "activities",
  "buildingArrangements",
  "cards",
  "characters",
  "cities",
  "cityEntries",
  "cityNpcPools",
  "cityPortraits",
  "dialogues",
  "eventBindings",
  "events",
  "historicalCharacterIdByCharacterId",
  "historicalCharacters",
  "historicalCityRosters",
  "houseModuleDefaults",
  "houses",
  "locationAccess",
  "maps",
  "meetingActionSets",
  "meetingBindings",
  "meetingChoiceSets",
  "meetingPanels",
  "meetings",
  "menuInstances",
  "menuResources",
  "playableIntegrations",
  "playableShells",
  "playables",
  "scenarioProfile",
  "settlements",
  "textEntries",
  "valuables",
]);

export const PACK_MANIFEST_RUNTIME_ONLY_FILE_KEYS = Object.freeze([
  "houseAccessRefusalRules",
  "scenes",
]);

export const PACK_MANIFEST_TEMPLATE_ONLY_FILE_KEYS = Object.freeze([
  "portraitVariants",
  "portraits",
]);

export const CITY_ENTRY_TEMPLATE_ONLY_IDS = Object.freeze([
  "city-entry.kulan.temple",
  "city-entry.kulan.keep",
  "city-entry.kulan.tea-house",
  "city-entry.kulan.market",
  "city-entry.kulan.grain-shop",
  "city-entry.kulan.medicine-house",
  "city-entry.kulan.inn",
]);

export const CITY_ENTRY_TEMPLATE_LEADER_RESIDENCE_TARGET_HOUSE_ID =
  "house.template.leader_residence";

export const CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_PREFIX =
  "house.";

export const CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_SUFFIX =
  ".leader_residence";

export const CITY_SHARED_FIELD_KEYS = Object.freeze([
  "regionId",
  "mapNodeId",
  "neighbourCityIds",
  "travelCost",
  "tags",
  "prosperity",
  "danger",
  "specialDemand",
]);

export const CITY_TEMPLATE_ONLY_FIELD_KEYS = Object.freeze([
  "mountedBuildings",
  "mapPlacement",
  "menuInstanceIds",
]);

export const CITY_PACK_SPECIFIC_FIELD_KEYS = Object.freeze([
  "id",
]);

export const MAP_RUNTIME_CANONICAL_IDS = Object.freeze([
  "map.prototype_frontier",
  "map.yuanmo_campaign",
]);

export const MAP_RUNTIME_ONLY_FIELD_KEYS = Object.freeze([
  "campaignHexGridUrl",
  "campaignVegetationRulesUrl",
  "campaignStructureProfileId",
]);

export const MAP_TEMPLATE_PRESERVED_FIELD_KEYS = Object.freeze([
  "layers",
  "primaryImageUrl",
  "regionOverlayImageUrl",
]);

export const EVENT_RUNTIME_CANONICAL_IDS = Object.freeze([
  "event.story.zhu_yuanzhang.ordination",
  "event.story.zhu_yuanzhang.first_temple_review",
  "event.story.zhu_yuanzhang.unlock_begging",
  "event.story.zhu_yuanzhang.runing_broadcast",
  "event.story.zhu_yuanzhang.haozhou_return_encounter",
  "event.building.template.house.temple.review",
  "event.building.house.kulan.temple.copy_scripture",
  "event.building.house.kulan.temple.sweep_courtyard",
  "event.building.template.house.temple.leave",
  "event.building.template.house.temple.donate",
  "event.building.house.kulan.temple.carry_water",
]);

export const EVENT_RUNTIME_STORY_FORMAT_GAP_IDS = Object.freeze([
  "event.story.zhu_yuanzhang.ordination",
  "event.story.zhu_yuanzhang.first_temple_review",
  "event.story.zhu_yuanzhang.unlock_begging",
  "event.story.zhu_yuanzhang.runing_broadcast",
  "event.story.zhu_yuanzhang.haozhou_return_encounter",
]);

export const EVENT_RUNTIME_TEMPLATE_FORMAT_PARITY_IDS = Object.freeze([
  "event.building.template.house.temple.review",
  "event.building.house.kulan.temple.copy_scripture",
  "event.building.house.kulan.temple.sweep_courtyard",
  "event.building.template.house.temple.leave",
  "event.building.template.house.temple.donate",
  "event.building.house.kulan.temple.carry_water",
]);

export const EVENT_TEMPLATE_ONLY_IDS = Object.freeze([
  "event.building.house.kulan.leader_residence.enter",
  "event.building.template.house.leader_residence.leave",
  "event.building.template.house.leader_residence.review",
  "event.building.house.kulan.temple.enter",
  "event.building.house.kulan.temple.work",
  "event.building.house.kulan.keep.enter",
  "event.building.template.house.keep.review",
  "event.building.template.house.keep.work",
  "event.building.template.house.keep.leave",
  "event.building.house.kulan.tea_house.enter",
  "event.building.template.house.tea_house.talk",
  "event.building.template.house.tea_house.intel",
  "event.building.template.house.tea_house.tea",
  "event.building.template.house.tea_house.leave",
  "event.building.house.kulan.market.enter",
  "event.building.template.house.market.talk",
  "event.building.template.house.market.trade",
  "event.building.template.house.market.intel",
  "event.building.template.house.market.leave",
  "event.building.house.kulan.grain_shop.enter",
  "event.building.template.house.grain_shop.trade",
  "event.building.template.house.grain_shop.accounting",
  "event.building.template.house.grain_shop.leave",
  "event.building.house.kulan.medicine_house.enter",
  "event.building.template.house.medicine_house.treatment",
  "event.building.template.house.medicine_house.compounding",
  "event.building.template.house.medicine_house.leave",
  "event.building.house.kulan.inn.enter",
  "event.building.template.house.inn.leave",
  "event.building.template.house.inn.work",
  "event.building.template.house.inn.talk",
  "event.building.template.house.temple.work",
  "event.building.template.house.inn.drink",
  "event.building.template.home.rest",
  "event.building.template.home.leave",
  "event.playable.grain_accounting.failure_reward",
  "event.playable.medicine_compounding.failure_reward",
  "event.building.template.house.inn.gamble",
]);

export const HOUSE_TEMPLATE_GENERIC_IDS = Object.freeze([
  "house.template.leader_residence",
  "house.template.keep",
  "house.template.tea_house",
  "house.template.market",
  "house.template.grain_shop",
  "house.template.medicine_house",
  "house.template.inn",
  "house.template.temple",
  "home.template",
]);

export const HOUSE_TEMPLATE_CONCRETE_SCENARIO_IDS = Object.freeze([
  "house.kulan.temple",
]);

export const HOUSE_RUNTIME_HOME_ID_PREFIX = "home.";

export const HOUSE_RUNTIME_HOME_SPECIAL_IDS = Object.freeze(["home_001"]);

export const HOUSE_RUNTIME_CITY_SCOPED_SUFFIXES = Object.freeze([
  ".leader_residence",
  ".temple",
  ".keep",
  ".tea_house",
  ".market",
  ".grain_shop",
  ".medicine_house",
  ".inn",
]);

export const HOUSE_SHARED_FIELD_KEYS = Object.freeze([
  "name",
  "type",
  "moduleId",
  "activityLocationId",
  "visibleStoryStages",
  "enterableStoryStages",
  "requiresPlayerCurrentCityMatch",
]);

export const HOUSE_TEMPLATE_ONLY_FIELD_KEYS = Object.freeze([
  "menuInstanceIds",
]);

export const HOUSE_RUNTIME_ONLY_FIELD_KEYS = Object.freeze([
  "onEnterEventId",
]);

export const HOUSE_PACK_SPECIFIC_FIELD_KEYS = Object.freeze([
  "id",
  "cityId",
  "characterIds",
  "defaultCharacterId",
  "backAction",
]);

export const BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS = Object.freeze([]);

export const PLAYABLE_FAMILY_FILE_NAMES = Object.freeze([
  "playables.json",
  "playable-integrations.json",
  "playable-shells.json",
]);

export const RUNTIME_BUILDING_SUPPORT_FILE_NAMES = Object.freeze([
  "building-arrangements.json",
  "dialogues.json",
  "event-bindings.json",
  "house-module-defaults.json",
  "location-access.json",
  "menu-instances.json",
  "menu-resources.json",
  "settlements.json",
]);

export const RUNTIME_SAFE_EVENT_MIRROR_IDS = Object.freeze([
  "event.building.template.house.temple.review",
  "event.building.house.kulan.temple.copy_scripture",
  "event.building.house.kulan.temple.sweep_courtyard",
  "event.building.template.house.temple.leave",
  "event.building.template.house.temple.donate",
  "event.building.house.kulan.temple.carry_water",
]);

export const PLAYABLE_FAMILY_OWNERSHIP = Object.freeze({
  canonicalMaintainedOwner: "scriptEditorTemplatePack",
  runtimePackMirrorMode: "derived-from-script-editor-template-pack",
  publicPublicationFile: "playable-shells.json",
  publicPublicationDerivedFrom: "playable-shells.json",
});

export const PUBLICATION_ONLY_EVENT_IDS = Object.freeze([]);

export const PUBLICATION_ONLY_DIALOGUE_IDS = Object.freeze([]);

export const BUILTIN_ONLY_EVENT_IDS = Object.freeze([]);

export const PUBLICATION_OMITTED_EVENT_IDS = BUILTIN_ONLY_EVENT_IDS;

export const PUBLICATION_OMITTED_MENU_RESOURCE_ENTRY_IDS = Object.freeze([]);

export const PUBLICATION_OMITTED_PLAYABLE_INTEGRATION_IDS = Object.freeze([]);

export const LEGACY_PUBLICATION_FILE_RULES = Object.freeze([]);

export const PUBLICATION_ONLY_MANIFEST_FILE_KEYS = Object.freeze(
  LEGACY_PUBLICATION_FILE_RULES.map((rule) => rule.manifestKey)
);

export const PUBLICATION_SYNC_FILE_RULES = Object.freeze([
  Object.freeze({
    fileName: "pack.json",
    mode: "public-manifest-projection",
    reason: "public 发布层清单应由 builtin 模板清单投影生成，并保留当前遗留发布专属键。",
  }),
  Object.freeze({
    fileName: "playables.json",
    mode: "public-derived-playables-projection",
    reason:
      "public 发布层中的 playables.json 应直接派生自 builtin template，避免默认模板导入在玩法定义上再缺一层。",
  }),
  Object.freeze({
    fileName: "playable-integrations.json",
    mode: "public-editor-safe-playable-integrations-projection",
    reason:
      "public 发布层中的 playable-integrations.json 应直接由 builtin template 派生，保持默认模板导入导出与运行预览使用同一份 integration family。",
  }),
  Object.freeze({
    fileName: "playable-shells.json",
    mode: "public-playable-shells-projection",
    reason:
      "public 发布层应同步暴露 canonical 的 playable-shells.json，默认模板导入不再依赖旧的 flow-playables 兼容文件。",
  }),
  Object.freeze({
    fileName: "settlements.json",
    mode: "public-derived-settlements-projection",
    reason:
      "public 发布层中的 settlements.json 应直接派生自 builtin template shared runtime support，避免默认模板导入再缺 settlement authored family。",
  }),
  Object.freeze({
    fileName: "events.json",
    mode: "public-derived-event-projection",
    reason:
      "public 发布层中的 events.json 应完全派生自 builtin template authored events，避免 settlement-route targetEventId 在默认模板导入时指向 public 未发布事件。",
  }),
  Object.freeze({
    fileName: "dialogues.json",
    mode: "public-derived-dialogue-projection",
    reason:
      "public 发布层中的 dialogues.json 应完全派生自 builtin template，避免第三套手维护 authored dialogue owner。",
  }),
  Object.freeze({
    fileName: "event-bindings.json",
    mode: "public-derived-event-binding-projection",
    reason:
      "public 发布层中的 event-bindings.json 应完全派生自 builtin template，避免 bindings 继续滞留在 public-only authored surface。",
  }),
  Object.freeze({
    fileName: "menu-resources.json",
    mode: "public-derived-menu-resource-projection",
    reason:
      "public 发布层中的 menu-resources.json 应以 builtin template 为 maintained owner，并只显式过滤当前 public 不支持的 minigame 菜单入口。",
  }),
  Object.freeze({
    fileName: "house-module-defaults.json",
    mode: "public-derived-house-module-defaults-projection",
    reason:
      "public 发布层中的 house-module-defaults.json 应直接派生自 builtin template，避免 house support defaults 继续滞留在历史拷贝里。",
  }),
]);

export function resolveZhuyuanzhangPackRoots(repoRoot) {
  return {
    runtimeRoot: path.join(repoRoot, MAINTAINED_PACK_ROOTS.builtinRuntimePack),
    builtinTemplateRoot: path.join(
      repoRoot,
      MAINTAINED_PACK_ROOTS.scriptEditorTemplatePack
    ),
    legacyPublicTemplateRoot: path.join(
      repoRoot,
      LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT
    ),
    registeredBuiltinTemplateRoot: path.join(
      repoRoot,
      PUBLISHED_PACK_ROOTS.registeredBuiltinTemplatePublication
    ),
  };
}

export function resolveZhuyuanzhangSyncDirection(
  repoRoot,
  source = "script-editor-template-pack"
) {
  if (!SUPPORTED_SYNC_SOURCES.includes(source)) {
    throw new Error(
      `Unsupported zhuyuanzhang sync source "${source}". Expected one of: ${SUPPORTED_SYNC_SOURCES.join(
        ", "
      )}`
    );
  }

  const {
    runtimeRoot,
    builtinTemplateRoot,
    registeredBuiltinTemplateRoot,
  } =
    resolveZhuyuanzhangPackRoots(repoRoot);

  if (source === "script-editor-template-pack") {
    return {
      sourceRoot: builtinTemplateRoot,
      targetRoots: [runtimeRoot, registeredBuiltinTemplateRoot],
    };
  }

  return {
    sourceRoot: runtimeRoot,
    targetRoots: [builtinTemplateRoot, registeredBuiltinTemplateRoot],
  };
}
