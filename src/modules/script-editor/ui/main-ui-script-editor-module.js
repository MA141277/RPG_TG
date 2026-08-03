import {
  renderEntryShellScriptEditorLanding,
} from "../../../ui/entry-shell/entry-shell-view";
import {
  BUILDING_DEFAULT_BACKGROUND_OPTIONS,
  CITY_DEFAULT_BACKGROUND_OPTIONS,
} from "../../../ui/location-backgrounds";
import { loadScenarioPackFromFiles } from "../../../application/scenario/scenario-pack-loader";
import * as scriptEditorMainUiBridge from "../main-ui-bridge";

const {
  DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL,
  SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES,
  SCRIPT_EDITOR_BUILDING_LAYOUT_ACTION_FILTERS,
  SCRIPT_EDITOR_BUILDING_LAYOUT_CHARACTER_FILTERS,
  SCRIPT_EDITOR_BUILDING_LAYOUT_NODE_KINDS,
  SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS,
  SCRIPT_EDITOR_DIALOGUE_MODES,
  appendScriptEditorDialogueCast,
  SCRIPT_EDITOR_EVENT_BINDING_CONDITION_GROUP_OPERATORS,
  SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES,
  SCRIPT_EDITOR_EVENT_TYPES,
  SCRIPT_EDITOR_MINIGAME_OUTCOMES,
  SCRIPT_EDITOR_MINIGAME_OWNER_KINDS,
  SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES,
  SCRIPT_EDITOR_MINIGAME_TRIGGER_SOURCES,
  SCRIPT_EDITOR_STORY_PROGRESS_MODES,
  allocateNextScriptEditorProjectCanonicalId,
  appendScriptEditorItemCustomProperty,
  appendScriptEditorAccessCondition,
  appendScriptEditorBuildingArrangement,
  appendScriptEditorBuildingArrangementContainer,
  appendScriptEditorBuildingArrangementLayoutNode,
  appendScriptEditorBuildingArrangementNpc,
  appendScriptEditorCityMountedBuilding,
  appendScriptEditorCityMountedBuildingNpc,
  appendScriptEditorDialogueOption,
  appendScriptEditorEventBindingConditionItem,
  appendScriptEditorEventRelationEntry,
  appendScriptEditorLocationAttribute,
  appendScriptEditorMenuModuleEntry,
  appendScriptEditorMenuModuleRecord,
  appendScriptEditorOwnerMenuMount,
  appendScriptEditorMinigameLaunchPayloadEntry,
  appendScriptEditorMinigameOutcomeRoute,
  appendScriptEditorPersonAttribute,
  appendScriptEditorPersonAttributeGroup,
  appendScriptEditorPersonRelation,
  appendScriptEditorProgressTrackTier,
  appendScriptEditorSettlementContent,
  appendScriptEditorStoryNodeRelation,
  canContinueScriptEditorProjectEntry,
  countScriptEditorLocationMenuEntries,
  createDefaultScriptEditorEventBindingRecord,
  createDefaultScriptEditorPortraitRecord,
  createDefaultScriptEditorPortraitVariantRecord,
  createDefaultScriptEditorProjectDefinition,
  createDefaultScriptEditorProgressTrackBindingRecord,
  createDefaultScriptEditorProgressTrackRecord,
  createScriptEditorWorkflowController,
  createScriptEditorWorkspaceShellViewModel,
  createScriptEditorWorkflowRecordDraft,
  createTextImportFilesFromRecord,
  exportScriptEditorProjectToScenarioPackFiles,
  createScriptEditorProjectLibraryEntry,
  formalizeScriptEditorProjectMenus,
  getScriptEditorWorkflowVisibleFamilies,
  isScriptEditorMinimalWorkflowFamily,
  listScriptEditorBuiltinMinigameIntegrationOptions,
  listScriptEditorBuiltinMinigamePlayableOptions,
  listScriptEditorCityBuildingArrangements,
  listScriptEditorEventBindingConditionFieldOptions,
  listScriptEditorLocationAccessConditionFieldOptions,
  listScriptEditorLocationMenuBundles,
  listScriptEditorMenuModuleRecords,
  listScriptEditorMountedMenus,
  listScriptEditorWorkflowFamilyRecords,
  loadScriptEditorProjectFromFiles,
  loadScriptEditorProjectFromScenarioPackUrl,
  markScriptEditorProjectCompleteForExport,
  normalizeScriptEditorBuildingRecord,
  normalizeScriptEditorCityRecord,
  normalizeScriptEditorDialogueRecord,
  normalizeScriptEditorEventBindingRecord,
  normalizeScriptEditorEventRecord,
  normalizeScriptEditorMinigameRecord,
  normalizeScriptEditorPersonRecord,
  normalizeScriptEditorPortraitRecord,
  normalizeScriptEditorPortraitVariantRecord,
  normalizeScriptEditorProgressTrackBindingRecord,
  normalizeScriptEditorProgressTrackRecord,
  normalizeScriptEditorSettlementRecord,
  normalizeScriptEditorStoryNodeRecord,
  pickScriptEditorDirectory,
  readEditableScriptEditorLocationAccessConditions,
  readFilesFromDirectoryHandle,
  readScriptEditorBuildingLayoutRecord,
  readScriptEditorPersonTypedAttributes,
  removeScriptEditorAccessCondition,
  removeScriptEditorBuildingArrangement,
  removeScriptEditorBuildingArrangementContainer,
  removeScriptEditorBuildingArrangementLayoutNode,
  removeScriptEditorBuildingArrangementNpc,
  removeScriptEditorCityMountedBuilding,
  removeScriptEditorCityMountedBuildingNpc,
  removeScriptEditorDialogueCast,
  removeScriptEditorDialogueOption,
  removeScriptEditorEventBindingConditionItem,
  removeScriptEditorEventRelationEntry,
  removeScriptEditorItemCustomProperty,
  findScriptEditorProjectLibraryEntry,
  removeScriptEditorLocationAttribute,
  removeScriptEditorLocationMenuEntry,
  removeScriptEditorMenuModuleRecord,
  removeScriptEditorOwnerMenuMount,
  removeScriptEditorMinigameLaunchPayloadEntry,
  removeScriptEditorMinigameOutcomeRoute,
  removeScriptEditorPersonAttribute,
  removeScriptEditorPersonAttributeGroup,
  removeScriptEditorPersonRelation,
  removeScriptEditorProgressTrackTier,
  removeScriptEditorProjectLibraryEntry,
  removeScriptEditorSettlementContent,
  removeScriptEditorStoryNodeRelation,
  removeScriptEditorWorkflowRecord,
  renderScriptEditorWorkspaceView,
  serializeScriptEditorProjectToFiles,
  toggleScriptEditorEventRepeatable,
  toggleScriptEditorLocationMenuEntryFlag,
  toggleScriptEditorPersonAttributeGroupItem,
  toggleScriptEditorPersonTradeEnabled,
  updateScriptEditorAccessConditionField,
  updateScriptEditorAccessField,
  updateScriptEditorBuildingArrangementContainerField,
  updateScriptEditorBuildingArrangementField,
  updateScriptEditorBuildingArrangementLayoutField,
  updateScriptEditorBuildingArrangementLayoutNodeField,
  updateScriptEditorBuildingArrangementLayoutNodeFlag,
  updateScriptEditorBuildingArrangementNpc,
  updateScriptEditorBuildingArrangementPrimaryNpc,
  updateScriptEditorBuildingEntryBindingField,
  updateScriptEditorBuildingField,
  updateScriptEditorCityField,
  updateScriptEditorCityMapPlacementField,
  updateScriptEditorCityMountedBuilding,
  updateScriptEditorCityMountedBuildingNpc,
  updateScriptEditorCityMountedBuildingPrimaryNpc,
  updateScriptEditorDialogueCastField,
  updateScriptEditorDialogueField,
  updateScriptEditorDialogueOptionField,
  updateScriptEditorEventBindingConditionItemField,
  updateScriptEditorEventBindingConditionOperator,
  updateScriptEditorEventBindingField,
  updateScriptEditorEventBindingOwnerField,
  updateScriptEditorEventBindingTriggerField,
  updateScriptEditorEventDestinationField,
  updateScriptEditorEventField,
  updateScriptEditorEventPreviewSummaryField,
  updateScriptEditorEventRelationField,
  updateScriptEditorLocationAttribute,
  updateScriptEditorItemCustomProperty,
  updateScriptEditorItemDisplayField,
  updateScriptEditorItemField,
  updateScriptEditorItemStackField,
  updateScriptEditorLocationMenuEntryField,
  updateScriptEditorLocationMenuInstanceTitle,
  updateScriptEditorLocationMenuResourceTitle,
  updateScriptEditorMinigameField,
  updateScriptEditorMinigameIntegration,
  updateScriptEditorMinigameLaunchPayloadField,
  updateScriptEditorMinigameOutcomeRouteField,
  updateScriptEditorPersonAttribute,
  updateScriptEditorPersonAttributeGroupField,
  updateScriptEditorPersonField,
  updateScriptEditorPersonRelation,
  updateScriptEditorPortraitField,
  updateScriptEditorPortraitVariantField,
  updateScriptEditorProgressTrackBindingField,
  updateScriptEditorProgressTrackField,
  updateScriptEditorProgressTrackTierField,
  updateScriptEditorSettlementContentField,
  updateScriptEditorSettlementField,
  updateScriptEditorStoryNodeField,
  updateScriptEditorStoryNodeRelation,
  updateScriptEditorWorkflowStoryPack,
  upsertScriptEditorProjectLibraryEntry,
  upsertScriptEditorWorkflowRecord,
  validateScriptEditorProjectForRuntimeExport,
  writeTextFilesWithDirectoryPicker,
} = scriptEditorMainUiBridge;

const SCRIPT_EDITOR_EVENT_BINDING_CONDITION_TYPE_OPTIONS = [
  { value: "flag", label: "标记条件" },
  { value: "variable", label: "变量条件" },
  { value: "expression", label: "表达式条件" },
  { value: "custom", label: "自定义条件" },
  { value: "binding-context", label: "触发上下文条件" },
];

const SCRIPT_EDITOR_EVENT_BINDING_CONDITION_OPERATOR_LABELS = {
  all: "满足全部",
  any: "满足任一",
  not: "全部不满足",
  "==": "等于",
  "!=": "不等于",
  ">=": "大于等于",
  "<=": "小于等于",
  ">": "大于",
  "<": "小于",
  contains: "包含",
};

const SCRIPT_EDITOR_EVENT_BINDING_SOURCE_FAMILY_OPTIONS = [
  { value: "flag", label: "标记来源" },
  { value: "variable", label: "变量来源" },
  { value: "person", label: "人物属性" },
  { value: "city", label: "城市属性" },
  { value: "building", label: "建筑属性" },
  { value: "payload", label: "触发载荷" },
  { value: "binding-context", label: "触发上下文" },
  { value: "resolver", label: "解析器来源" },
  { value: "custom", label: "自定义来源" },
];

const SCRIPT_EDITOR_EVENT_BINDING_VALUE_TYPE_LABELS = {
  boolean: "布尔值",
  number: "数字",
  string: "文本",
  enum: "枚举",
  json: "结构数据",
};

const SCRIPT_EDITOR_EVENT_BINDING_OWNER_FAMILY_OPTIONS = [
  { value: "person", label: "人物" },
  { value: "city", label: "城市" },
  { value: "building", label: "建筑" },
  { value: "minigame", label: "小游戏" },
  { value: "story", label: "剧情节点" },
];

const SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER = {
  person: [
    { timing: "after", action: "custom", label: "人物自定义触发" },
  ],
  city: [
    { timing: "after", action: "city-enter", label: "进入城市后" },
  ],
  building: [
    { timing: "after", action: "building-enter", label: "进入后" },
    { timing: "before", action: "building-leave", label: "离开前" },
  ],
  minigame: [
    { timing: "after", action: "minigame-settled", label: "小游戏结算后" },
  ],
  story: [
    { timing: "after", action: "story-progress", label: "剧情推进后" },
  ],
};

const SCRIPT_EDITOR_PERSON_ATTRIBUTE_TYPE_OPTIONS = [
  { value: "number", label: "数值" },
  { value: "boolean", label: "开关" },
  { value: "enum", label: "选项" },
  { value: "string", label: "文本" },
];

const SCRIPT_EDITOR_SETTLEMENT_TARGET_FAMILY_OPTIONS = [
  { value: "person", label: "人物" },
  { value: "city", label: "城市" },
  { value: "building", label: "建筑" },
];

const SCRIPT_EDITOR_SETTLEMENT_NUMERIC_OPERATION_OPTIONS = [
  { value: "set", label: "设为" },
  { value: "add", label: "增加" },
  { value: "subtract", label: "减少" },
];

const SCRIPT_EDITOR_SETTLEMENT_SET_ONLY_OPERATION_OPTIONS = [
  { value: "set", label: "设为" },
];

const SCRIPT_EDITOR_PROGRESS_OWNER_KIND_OPTIONS = [
  { value: "person", label: "人物" },
  { value: "city", label: "城市" },
  { value: "building", label: "建筑" },
  { value: "*", label: "全部对象" },
];

const SCRIPT_EDITOR_PROGRESS_TIER_REPEAT_POLICY_OPTIONS = [
  { value: "once-ever", label: "仅首次进入触发" },
  { value: "once-per-entry", label: "每次进入都触发" },
];

const SCRIPT_EDITOR_SETTLEMENT_PERSON_BASE_ATTRIBUTE_OPTIONS = [
  { value: "age", label: "年龄", attributeType: "number" },
  { value: "stamina", label: "体力", attributeType: "number" },
  { value: "stats.leadership", label: "统率", attributeType: "number" },
  { value: "stats.martial", label: "武勇", attributeType: "number" },
  { value: "stats.intelligence", label: "智略", attributeType: "number" },
  { value: "stats.politics", label: "政务", attributeType: "number" },
  { value: "stats.charm", label: "魅力", attributeType: "number" },
  { value: "stats.fame", label: "名声", attributeType: "number" },
];

const SCRIPT_EDITOR_SETTLEMENT_CITY_BASE_ATTRIBUTE_OPTIONS = [
  { value: "travelCost", label: "移动成本", attributeType: "number" },
  { value: "prosperity", label: "繁荣", attributeType: "number" },
  { value: "danger", label: "治安", attributeType: "number" },
];

const SCRIPT_EDITOR_SETTLEMENT_BUILDING_BASE_ATTRIBUTE_OPTIONS = [
  { value: "level", label: "等级", attributeType: "number" },
  { value: "outputMultiplier", label: "产出倍率", attributeType: "number" },
  { value: "damaged", label: "损坏状态", attributeType: "boolean" },
];

const characterCardLayoutElements = [
  {
    elementId: "portrait",
    selector: ":scope > .c-main-ui-character-card__portrait",
  },
  { elementId: "meta", selector: ".c-main-ui-character-card__meta" },
  { elementId: "name", selector: ".c-main-ui-character-card__name" },
  { elementId: "bio", selector: ".c-main-ui-character-card__bio" },
  {
    elementId: "placeholder-label",
    selector: ".c-main-ui-character-card__placeholder-label",
  },
  {
    elementId: "placeholder-index",
    selector: ".c-main-ui-character-card__placeholder-index",
  },
];

const characterCardLayoutBindings = Array.from({ length: 8 }, (_, index) => ({
  componentId: `character-card-${index + 1}`,
  selector: `.c-main-ui-character-grid > .c-main-ui-character-card:nth-child(${index + 1})`,
  offsetComponentId: "character-grid",
  elements: characterCardLayoutElements,
}));

const characterSelectLayoutBindings = [
  { componentId: "character-layout", selector: ".c-main-ui-character-layout" },
  {
    componentId: "character-hero",
    selector: ".c-main-ui-character-layout__hero",
    offsetComponentId: "character-layout",
    elements: [
      { elementId: "era", selector: ".c-main-ui-character-layout__era" },
      { elementId: "poem", selector: ".c-main-ui-character-layout__poem" },
    ],
  },
  {
    componentId: "character-book",
    selector: ".c-main-ui-character-book",
    offsetComponentId: "character-layout",
  },
  {
    componentId: "character-tabs",
    selector: ".c-main-ui-character-book__tabs",
    offsetComponentId: "character-book",
  },
  {
    componentId: "character-tab-characters",
    selector: ".c-main-ui-book-tab--characters",
    offsetComponentId: "character-tabs",
  },
  {
    componentId: "character-tab-roster",
    selector: ".c-main-ui-book-tab--roster",
    offsetComponentId: "character-tabs",
  },
  {
    componentId: "character-tab-ministers",
    selector: ".c-main-ui-book-tab--ministers",
    offsetComponentId: "character-tabs",
  },
  {
    componentId: "character-book-content",
    selector: ".c-main-ui-character-book__content",
    offsetComponentId: "character-book",
  },
  {
    componentId: "character-grid",
    selector: ".c-main-ui-character-grid",
    offsetComponentId: "character-book-content",
  },
  ...characterCardLayoutBindings,
  {
    componentId: "character-detail",
    selector: ".c-main-ui-character-detail",
    offsetComponentId: "character-book-content",
  },
  {
    componentId: "character-detail-paper",
    selector: ".c-main-ui-character-detail__paper",
    offsetComponentId: "character-detail",
    elements: [
      { elementId: "eyebrow", selector: ".c-main-ui-character-detail__eyebrow" },
      { elementId: "name", selector: ".c-main-ui-character-detail__name" },
      { elementId: "subtitle", selector: ".c-main-ui-character-detail__subtitle" },
      { elementId: "badge", selector: ".c-main-ui-character-detail__badge" },
      { elementId: "stats", selector: ".c-main-ui-character-detail__stats" },
      { elementId: "section-title", selector: ".c-main-ui-character-detail__section-title" },
      { elementId: "bio", selector: ".c-main-ui-character-detail__bio" },
      { elementId: "empty", selector: ".c-main-ui-character-detail__empty" },
    ],
  },
  {
    componentId: "character-footer",
    selector: ".c-main-ui-character-book__footer",
    offsetComponentId: "character-book",
  },
  {
    componentId: "character-back-button",
    selector: ".c-main-ui-page-button",
    offsetComponentId: "character-footer",
  },
  {
    componentId: "character-pagination",
    selector: ".c-main-ui-book-pagination",
    offsetComponentId: "character-footer",
    elements: [
      {
        elementId: "left-ornament",
        selector: ":scope > .c-main-ui-book-pagination__ornament:nth-child(1)",
      },
      { elementId: "text", selector: ":scope > span:nth-child(2)" },
      {
        elementId: "right-ornament",
        selector: ":scope > .c-main-ui-book-pagination__ornament:nth-child(3)",
      },
    ],
  },
  {
    componentId: "character-choose-button",
    selector: ".c-main-ui-image-button--choose",
    offsetComponentId: "character-footer",
  },
  {
    componentId: "character-previous-page-button",
    selector: ".c-main-ui-page-turn-button--previous",
    offsetComponentId: "character-footer",
  },
  {
    componentId: "character-next-page-button",
    selector: ".c-main-ui-page-turn-button--next",
    offsetComponentId: "character-footer",
  },
];

const SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE = 6;
const SCRIPT_EDITOR_MENU_MODULE_ENTRY_PAGE_SIZE = 3;
const SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_PAGE_SIZE = 6;
const SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_NPC_PAGE_SIZE = 12;
const SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY = "stageConfiguration";
const SCRIPT_EDITOR_VISIBLE_WORKFLOW_FAMILIES = new Set(
  getScriptEditorWorkflowVisibleFamilies()
);
const SCRIPT_EDITOR_RECORD_SEARCH_FAMILY_ATTRIBUTES = {
  people: 'data-script-editor-record-search-family="people"',
  portraits: 'data-script-editor-record-search-family="portraits"',
  portraitVariants: 'data-script-editor-record-search-family="portraitVariants"',
  cities: 'data-script-editor-record-search-family="cities"',
  buildings: 'data-script-editor-record-search-family="buildings"',
  quests: 'data-script-editor-record-search-family="quests"',
  storyNodes: 'data-script-editor-record-search-family="storyNodes"',
  dialogues: 'data-script-editor-record-search-family="dialogues"',
  settlements: 'data-script-editor-record-search-family="settlements"',
  menuResources: 'data-script-editor-record-search-family="menuResources"',
  stageConfiguration: 'data-script-editor-record-search-family="stageConfiguration"',
  progressTracks: 'data-script-editor-record-search-family="progressTracks"',
  progressTrackBindings: 'data-script-editor-record-search-family="progressTrackBindings"',
  events: 'data-script-editor-record-search-family="events"',
  minigames: 'data-script-editor-record-search-family="minigames"',
  textEntries: 'data-script-editor-record-search-family="textEntries"',
};

function isScriptEditorVisibleWorkflowFamily(family) {
  if (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) {
    return (
      SCRIPT_EDITOR_VISIBLE_WORKFLOW_FAMILIES.has("progressTracks") &&
      SCRIPT_EDITOR_VISIBLE_WORKFLOW_FAMILIES.has("progressTrackBindings")
    );
  }
  return family === "storyPack" || SCRIPT_EDITOR_VISIBLE_WORKFLOW_FAMILIES.has(family);
}

// Internal flow/playable bodies remain implementation-only seams and do not复用 minigame 绑定。


// 不复用 minigame 绑定。
// 涓嶅鐢?minigame 缁戝畾銆?

const SCRIPT_EDITOR_MODULE_METHOD_NAMES = [
  "showScriptEditorLanding",
  "captureScriptEditorScrollPosition",
  "restoreScriptEditorScrollPosition",
  "renderLegacyScriptEditorLanding",
  "renderScriptEditorLanding",
  "renderScriptEditorWorkspaceContent",
  "renderScriptEditorWorkspace",
  "refreshScriptEditorWorkspace",
  "renderRuntimePreviewOverlay",
  "renderRuntimePreviewSessionBanner",
  "renderScriptEditorEditorPanel",
  "renderScriptEditorItemEditor",
  "renderScriptEditorTextEntryEditor",
  "getScriptEditorRecordListPage",
  "resetScriptEditorRecordListPages",
  "resetScriptEditorRecordSearch",
  "resetScriptEditorPersonAttributePage",
  "setScriptEditorRecordListPage",
  "syncScriptEditorRecordListPageToRecord",
  "getScriptEditorRecordSearchValue",
  "setScriptEditorRecordSearchValue",
  "getScriptEditorCityMountedBuildingUiKey",
  "getScriptEditorCityMountedBuildingListUiKey",
  "getScriptEditorCityMountedBuildingListUiState",
  "setScriptEditorCityMountedBuildingListUiState",
  "getScriptEditorCityMountedBuildingUiState",
  "setScriptEditorCityMountedBuildingUiState",
  "setScriptEditorCityMountedBuildingExpanded",
  "setScriptEditorCityMountedBuildingSearchValue",
  "getScriptEditorMenuModuleItemPageState",
  "changeScriptEditorMenuModuleItemPage",
  "getFilteredScriptEditorCityMountedBuildingNpcEntries",
  "getScriptEditorCityMountedBuildingNpcPageState",
  "getScriptEditorCityMountedBuildingListPageState",
  "changeScriptEditorCityMountedBuildingNpcPage",
  "changeScriptEditorCityMountedBuildingListPage",
  "filterScriptEditorRecords",
  "renderScriptEditorRecordListSearch",
  "getScriptEditorPaginatedRecordListState",
  "renderScriptEditorRecordPagination",
  "renderScriptEditorPaginatedRecordList",
  "renderScriptEditorPeopleEditor",
  "renderScriptEditorPersonTabButton",
  "renderScriptEditorUnusedLegacyPersonTabList",
  "renderScriptEditorUnusedLegacyPersonSummaryAttributes",
  "getScriptEditorPersonAttributePaginationState",
  "renderScriptEditorPersonAttributePagination",
  "renderScriptEditorSelectOptions",
  "getScriptEditorProjectRecordOptions",
  "getScriptEditorCreatorRecordOptions",
  "getScriptEditorMenuInstanceOptions",
  "getScriptEditorSettlementTargetOptions",
  "getScriptEditorProgressOwnerKindLabel",
  "getScriptEditorProgressBindingLabel",
  "getScriptEditorProgressBindingOwnerDisplay",
  "getScriptEditorProgressTrackTitleById",
  "getScriptEditorStageConfigurationOwnerOptions",
  "getScriptEditorSettlementAttributeOptions",
  "createScriptEditorSettlementTypedAttributeOptions",
  "resolveScriptEditorSettlementAttributeType",
  "getScriptEditorSettlementEnumValueOptions",
  "getScriptEditorSettlementOperationOptions",
  "getScriptEditorLocationMenuTargetOptions",
  "getScriptEditorLocationMenuPurposeOptions",
  "getScriptEditorLocationMenuTargetFamilyOptions",
  "getScriptEditorMenuAuthoringTargetFamily",
  "getScriptEditorLocationMenuOptionsWithFallback",
  "getScriptEditorPersonCityOptions",
  "getScriptEditorPersonHouseOptions",
  "getScriptEditorPersonPortraitOptions",
  "getScriptEditorPersonPortraitVariantOptions",
  "renderScriptEditorUnusedLegacyPersonTabPanel",
  "renderScriptEditorLegacyPersonMappedFieldGroups",
  "renderScriptEditorUnusedPersonMappedFieldControl",
  "getScriptEditorPersonMappedFieldValue",
  "renderScriptEditorPersonTabList",
  "getScriptEditorEditablePersonAttributes",
  "getScriptEditorPersonAttributeGroups",
  "getScriptEditorPersonAttributeGroupPaginationState",
  "getScriptEditorPersonAttributeGroupItemPaginationState",
  "getScriptEditorPersonAttributeGroupEntries",
  "getScriptEditorPersonAttributeGroupAvailableAttributes",
  "renderScriptEditorPersonAttributeGroupPagination",
  "renderScriptEditorPersonAttributeGroupItemPagination",
  "renderScriptEditorLegacyPersonSummaryAttributes",
  "renderScriptEditorPersonAttributeGroupPanel",
  "renderScriptEditorPersonAttributeGroupPanel",
  "renderScriptEditorPersonTabPanel",
  "renderScriptEditorPersonRelationPanel",
  "renderScriptEditorPersonRelationSelect",
  "renderScriptEditorOwnerMenuMountPanel",
  "renderScriptEditorPortraitEditor",
  "renderScriptEditorPortraitVariantEditor",
  "renderScriptEditorLocationEditor",
  "renderScriptEditorLocationTabButton",
  "renderScriptEditorLocationTabPanel",
  "renderScriptEditorLocationProfilePanel",
  "renderScriptEditorBuildingArrangementPanel",
  "renderScriptEditorCityBuildingArrangementPlanner",
  "renderScriptEditorCityMountedBuildingsPanel",
  "renderScriptEditorLocationMountedContent",
  "renderScriptEditorLocationCustomAttributes",
  "renderScriptEditorMenuModuleEditor",
  "renderScriptEditorLocationMenuPanel",
  "renderScriptEditorLocationAccessPanel",
  "renderScriptEditorLocationAccessConditionEditor",
  "renderScriptEditorLocationAccessConditionRow",
  "renderScriptEditorLocationAccessEventConditionControls",
  "renderScriptEditorLocationAccessPersonConditionControls",
  "renderScriptEditorLocationAccessTimeConditionControls",
  "renderScriptEditorLocationAccessOperatorSelect",
  "getScriptEditorLocationAccessPersonFieldOptions",
  "renderScriptEditorBuildingEntryPanel",
  "renderScriptEditorStoryNodeEditor",
  "renderScriptEditorDialogueEditor",
  "renderScriptEditorEventEditor",
  "renderScriptEditorSettlementEditor",
  "renderScriptEditorSettlementContentRows",
  "renderScriptEditorSettlementContentValueControl",
  "renderScriptEditorProgressTrackEditor",
  "renderScriptEditorProgressTrackTierRows",
  "renderScriptEditorProgressTrackBindingEditor",
  "renderScriptEditorStageConfigurationEditor",
  "renderScriptEditorMinigameEditor",
  "renderScriptEditorNarrativeTabButton",
  "renderScriptEditorMinigameTabButton",
  "renderScriptEditorStoryNodeTabPanel",
  "renderScriptEditorDialogueTabPanel",
  "renderScriptEditorDialogueCastPanel",
  "renderScriptEditorDialogueRoutePanel",
  "renderScriptEditorDialogueReferenceSelect",
  "createScriptEditorPersonReferenceOptions",
  "createScriptEditorTextEntryReferenceOptions",
  "createScriptEditorDialogueReferenceOptions",
  "createScriptEditorEventReferenceOptions",
  "createScriptEditorActivityReferenceOptions",
  "createScriptEditorTradeBindingReferenceOptions",
  "createScriptEditorEventDestinationFamilyOptions",
  "createScriptEditorEventDestinationTargetOptions",
  "getScriptEditorEventNextEventOptions",
  "getScriptEditorMinigamePlayableLabel",
  "getScriptEditorMinigameIntegrationLabel",
  "getScriptEditorMinigameTriggerSourceLabel",
  "getScriptEditorMinigameOwnerKindLabel",
  "getScriptEditorMinigameReturnPolicyLabel",
  "getScriptEditorMinigameOutcomeLabel",
  "getScriptEditorEventBindingOwnerFamilyLabel",
  "describeScriptEditorEventBindingTrigger",
  "renderScriptEditorEventTabPanel",
  "renderScriptEditorEventBindingSummary",
  "renderScriptEditorMinigameTabPanel",
  "renderScriptEditorEventBindingsEditor",
  "renderScriptEditorOwnerLocalEventBindingsPanel",
  "renderScriptEditorEventBindingEditor",
  "getScriptEditorEventBindingEventOptions",
  "getScriptEditorEventBindingTriggerOptions",
  "renderScriptEditorEventBindingConditionItem",
  "renderScriptEditorOptionList",
  "getScriptEditorConditionOperatorOptions",
  "renderScriptEditorEventBindingConditionValueControl",
  "renderScriptEditorEventBindingAdvancedConditionSurface",
  "collectScriptEditorMinigameReferences",
  "renderScriptEditorStringRelationPanel",
  "renderScriptEditorField",
  "renderScriptEditorStartupSelect",
  "renderScriptEditorSystemDetails",
  "renderScriptEditorOverviewCard",
  "describeScriptEditorProjectRisk",
  "countScriptEditorCompatibilityResidue",
  "describeScriptEditorPersonListSummary",
  "describeScriptEditorLocationListSummary",
  "describeScriptEditorStoryNodeListSummary",
  "describeScriptEditorDialogueListSummary",
  "describeScriptEditorMinigameListSummary",
  "renderScriptEditorNotice",
  "renderScriptEditorNoticeTimeline",
  "resetScriptEditorNoticeTimeline",
  "recordScriptEditorNotice",
  "formatScriptEditorNoticeTimestamp",
  "renderScriptEditorFileInputs",
  "renderScriptEditorProjectLibrary",
  "renderScriptEditorProjectCard",
  "handleScriptEditorAction",
  "selectScriptEditorFamily",
  "selectScriptEditorRecord",
  "changeScriptEditorRecordListPage",
  "goToScriptEditorRecordListPage",
  "selectScriptEditorPersonTab",
  "changeScriptEditorPersonAttributePage",
  "selectScriptEditorLocationTab",
  "selectScriptEditorNarrativeTab",
  "selectScriptEditorEventTab",
  "selectScriptEditorMinigameTab",
  "toggleScriptEditorAuxiliaryPanel",
  "jumpToScriptEditorIssue",
  "addScriptEditorRecord",
  "removeScriptEditorRecord",
  "applyScriptEditorRecordJson",
  "applyScriptEditorTextEntryText",
  "applyScriptEditorProjectField",
  "applyScriptEditorPersonField",
  "applyScriptEditorPortraitField",
  "applyScriptEditorPortraitVariantField",
  "applyScriptEditorPersonTradeEnabled",
  "addScriptEditorPersonAttribute",
  "removeScriptEditorPersonAttribute",
  "applyScriptEditorPersonAttributeField",
  "addScriptEditorPersonAttributeGroup",
  "removeScriptEditorPersonAttributeGroup",
  "applyScriptEditorPersonAttributeGroupField",
  "applyScriptEditorPersonAttributeGroupItem",
  "toggleScriptEditorPersonAttributeGroupPicker",
  "changeScriptEditorPersonAttributeGroupPage",
  "changeScriptEditorPersonAttributeGroupItemPage",
  "addScriptEditorPersonAttributeGroupItem",
  "removeScriptEditorPersonAttributeGroupItem",
  "addScriptEditorPersonRelation",
  "removeScriptEditorPersonRelation",
  "applyScriptEditorPersonRelationField",
  "applyScriptEditorStoryField",
  "addScriptEditorStoryRelation",
  "removeScriptEditorStoryRelation",
  "applyScriptEditorStoryRelationField",
  "applyScriptEditorDialogueField",
  "addScriptEditorDialogueCast",
  "removeScriptEditorDialogueCast",
  "applyScriptEditorDialogueCastField",
  "addScriptEditorDialogueOption",
  "removeScriptEditorDialogueOption",
  "applyScriptEditorDialogueOptionField",
  "applyScriptEditorSettlementField",
  "addScriptEditorSettlementContent",
  "removeScriptEditorSettlementContent",
  "applyScriptEditorSettlementContentField",
  "applyScriptEditorEventField",
  "applyScriptEditorEventRepeatable",
  "addScriptEditorEventBinding",
  "removeScriptEditorEventBinding",
  "replaceScriptEditorEventBinding",
  "applyScriptEditorEventBindingField",
  "applyScriptEditorEventBindingOwnerField",
  "applyScriptEditorEventBindingTriggerField",
  "applyScriptEditorEventBindingConditionOperator",
  "addScriptEditorEventBindingConditionItem",
  "removeScriptEditorEventBindingConditionItem",
  "applyScriptEditorEventBindingConditionItemField",
  "applyScriptEditorEventDestinationField",
  "applyScriptEditorEventStoryNodeId",
  "addScriptEditorEventRelation",
  "removeScriptEditorEventRelation",
  "applyScriptEditorEventRelationField",
  "applyScriptEditorEventPreviewField",
  "applyScriptEditorMinigameField",
  "applyScriptEditorMinigameIntegration",
  "addScriptEditorMinigameLaunchPayloadEntry",
  "removeScriptEditorMinigameLaunchPayloadEntry",
  "applyScriptEditorMinigameLaunchField",
  "addScriptEditorMinigameOutcomeRoute",
  "removeScriptEditorMinigameOutcomeRoute",
  "applyScriptEditorMinigameOutcomeField",
  "getSelectedScriptEditorItem",
  "replaceSelectedScriptEditorItem",
  "applyScriptEditorItemField",
  "applyScriptEditorItemDisplayField",
  "applyScriptEditorItemStackField",
  "addScriptEditorItemCustomProperty",
  "removeScriptEditorItemCustomProperty",
  "applyScriptEditorItemCustomPropertyField",
  "applyScriptEditorLocationField",
  "applyScriptEditorLocationMenuField",
  "applyScriptEditorLocationMenuInstanceField",
  "applyScriptEditorLocationMenuResourceField",
  "applyScriptEditorLocationMenuFlag",
  "addScriptEditorOwnerMenuMount",
  "removeScriptEditorOwnerMenuMount",
  "addScriptEditorLocationAttribute",
  "removeScriptEditorLocationAttribute",
  "applyScriptEditorLocationAttributeField",
  "addScriptEditorCityMountedBuilding",
  "removeScriptEditorCityMountedBuilding",
  "applyScriptEditorCityMountedBuilding",
  "addScriptEditorCityMountedBuildingNpc",
  "findNextScriptEditorCityMountedNpcId",
  "removeScriptEditorCityMountedBuildingNpc",
  "applyScriptEditorCityMountedBuildingNpc",
  "applyScriptEditorCityMountedBuildingPrimaryNpc",
  "addScriptEditorBuildingArrangement",
  "removeScriptEditorBuildingArrangement",
  "applyScriptEditorBuildingArrangementField",
  "addScriptEditorBuildingArrangementNpc",
  "findNextScriptEditorBuildingArrangementNpcId",
  "removeScriptEditorBuildingArrangementNpc",
  "applyScriptEditorBuildingArrangementNpc",
  "applyScriptEditorBuildingArrangementPrimaryNpc",
  "applyScriptEditorBuildingLayoutField",
  "addScriptEditorBuildingLayoutNode",
  "removeScriptEditorBuildingLayoutNode",
  "applyScriptEditorBuildingLayoutNodeField",
  "applyScriptEditorBuildingLayoutNodeFlag",
  "addScriptEditorBuildingArrangementContainer",
  "removeScriptEditorBuildingArrangementContainer",
  "applyScriptEditorBuildingContainerField",
  "applyScriptEditorLocationAccessField",
  "addScriptEditorLocationAccessCondition",
  "removeScriptEditorLocationAccessCondition",
  "clearScriptEditorLocationAccessConditions",
  "applyScriptEditorLocationAccessConditionField",
  "applyScriptEditorBuildingEntryField",
  "addScriptEditorLocationMenuEntry",
  "removeScriptEditorLocationMenuEntry",
  "runScriptEditorValidation",
  "handleScriptEditorBlockedRuntimeAction",
  "saveScriptEditorProject",
  "createScriptEditorProjectAtSavePath",
  "exportScriptEditorProject",
  "captureScriptEditorRuntimePreviewReturnContext",
  "restoreScriptEditorRuntimePreviewReturnContext",
  "exitScriptEditorRuntimePreview",
  "enterScriptEditorRuntimePreviewSession",
  "previewScriptEditorProjectRuntime",
  "openScriptEditorProjectFromDirectory",
  "handleScriptEditorProjectFileImport",
  "handleScriptEditorTemplateImport",
  "getScriptEditorFamilyLabel",
  "ensureScriptEditorVisibleSelection",
  "getScriptEditorRecordLabel",
  "getScriptEditorStageConfigurationBindings",
  "addScriptEditorStageConfigurationBinding",
  "removeScriptEditorStageConfigurationBinding",
  "addScriptEditorStageConfigurationTrack",
  "removeScriptEditorStageConfigurationTrack",
  "getSelectedScriptEditorPerson",
  "replaceSelectedScriptEditorPerson",
  "getSelectedScriptEditorPortrait",
  "replaceSelectedScriptEditorPortrait",
  "getSelectedScriptEditorPortraitVariant",
  "replaceSelectedScriptEditorPortraitVariant",
  "getScriptEditorLocationMenuBundles",
  "getScriptEditorLocationMenuEntryCount",
  "commitScriptEditorMenuProject",
  "getSelectedScriptEditorLocation",
  "replaceSelectedScriptEditorLocation",
  "getSelectedScriptEditorStoryNode",
  "replaceSelectedScriptEditorStoryNode",
  "getSelectedScriptEditorDialogue",
  "replaceSelectedScriptEditorDialogue",
  "getSelectedScriptEditorSettlement",
  "replaceSelectedScriptEditorSettlement",
  "getSelectedScriptEditorProgressTrack",
  "replaceSelectedScriptEditorProgressTrack",
  "applyScriptEditorProgressTrackField",
  "addScriptEditorProgressTrackTier",
  "removeScriptEditorProgressTrackTier",
  "applyScriptEditorProgressTrackTierField",
  "getSelectedScriptEditorProgressTrackBinding",
  "replaceSelectedScriptEditorProgressTrackBinding",
  "applyScriptEditorProgressTrackBindingField",
  "getSelectedScriptEditorEvent",
  "replaceSelectedScriptEditorEvent",
  "getSelectedScriptEditorMinigame",
  "replaceSelectedScriptEditorMinigame",
  "resolveScriptEditorStoryRelationField",
  "resolveScriptEditorEventRelationField",
  "getScriptEditorProjectLibraryEntries",
  "getScriptEditorProjectSourceLabel",
  "getCachedScriptEditorExportDiagnostics",
  "refreshScriptEditorExportDiagnostics",
  "invalidateScriptEditorExportDiagnostics",
  "commitScriptEditorProject",
  "rememberScriptEditorProjectPackageLocation",
  "continueScriptEditorProject",
  "deleteScriptEditorProject"
];

export function installMainUiFlowScriptEditorModule(host, options) {
  void options;
    host.scriptEditorProject = null;
    host.scriptEditorSelection = {
      family: "storyPack",
      entityId: null,
    };
    host.scriptEditorNotice = null;
    host.scriptEditorNoticeEntries = [];
    host.scriptEditorNoticeSequence = 0;
    host.scriptEditorProjectDirectoryHandle = null;
    host.scriptEditorExportDirectoryHandle = null;
    host.scriptEditorProjectLibrary = [];
    host.scriptEditorProjectSource = "new";
    host.scriptEditorPendingDeleteProjectId = null;
    host.scriptEditorAuxiliaryPanelOpen = false;
    host.scriptEditorPersonTab = "profile";
    host.scriptEditorLocationTab = "profile";
    host.scriptEditorNarrativeTab = "profile";
    host.scriptEditorEventTab = "basics";
    host.scriptEditorMinigameTab = "basics";
    host.scriptEditorPersonAttributePage = 1;
    host.scriptEditorPersonAttributeVisibleIndices = null;
    host.scriptEditorPersonAttributeScrollLeft = 0;
    host.scriptEditorPersonAttributeGroupPage = 1;
    host.scriptEditorPersonAttributeGroupItemPageById = {};
    host.scriptEditorPersonAttributeGroupOpenPickerId = null;
    host.scriptEditorMenuModuleItemPageById = {};
    host.scriptEditorRecordListPages = {};
    host.scriptEditorRecordSearch = {
      people: "",
      portraits: "",
      portraitVariants: "",
      settlements: "",
      stageConfiguration: "",
      progressTracks: "",
      progressTrackBindings: "",
    };
    host.scriptEditorCityMountedBuildingUiState = {};
    host.scriptEditorScrollTop = 0;
    host.scriptEditorRuntimePreviewSession = null;
    host.scriptEditorStageConfigurationHelpOpen = false;
    host.scriptEditorDialogueHelpOpen = false;
    host.scriptEditorExportDiagnosticsCache = null;

  const module = new MainUiFlowScriptEditorModule();
  for (const methodName of SCRIPT_EDITOR_MODULE_METHOD_NAMES) {
    host[methodName] = module[methodName].bind(host);
  }
}

class MainUiFlowScriptEditorModule {
  showScriptEditorLanding() {
    this.setScreen("script-editor-landing");
  }

  captureScriptEditorScrollPosition() {
    const scriptEditorScreen = this.overlayRoot.querySelector(
      ".c-main-ui-screen--script-editor-flow"
    );
    if (scriptEditorScreen instanceof globalThis.HTMLElement) {
      this.scriptEditorScrollTop = scriptEditorScreen.scrollTop;
    }

    const personAttributeList = this.overlayRoot.querySelector(
      ".c-script-editor-person-summary__list"
    );
    if (personAttributeList instanceof globalThis.HTMLElement) {
      this.scriptEditorPersonAttributeScrollLeft = personAttributeList.scrollLeft;
    }

  }

  restoreScriptEditorScrollPosition() {
    const scriptEditorScreen = this.overlayRoot.querySelector(
      ".c-main-ui-screen--script-editor-flow"
    );
    if (scriptEditorScreen instanceof globalThis.HTMLElement) {
      scriptEditorScreen.scrollTop = this.scriptEditorScrollTop;
    }

    const personAttributeList = this.overlayRoot.querySelector(
      ".c-script-editor-person-summary__list"
    );
    if (personAttributeList instanceof globalThis.HTMLElement) {
      personAttributeList.scrollLeft = this.scriptEditorPersonAttributeScrollLeft;
    }

  }

  renderLegacyScriptEditorLanding() {
    const hasSession = this.scriptEditorProject != null;

    return renderEntryShellScriptEditorLanding({
      hasSession,
      noticeMarkup: this.renderScriptEditorNotice(),
      fileInputsMarkup: this.renderScriptEditorFileInputs(),
    });
  }

  renderScriptEditorLanding() {
    const projectLibraryEntries = this.getScriptEditorProjectLibraryEntries();

    return renderEntryShellScriptEditorLanding({
      hasSession: false,
      noticeMarkup: this.renderScriptEditorNotice(),
      projectLibraryMarkup: this.renderScriptEditorProjectLibrary(projectLibraryEntries),
      fileInputsMarkup: this.renderScriptEditorFileInputs(),
    });
  }

  renderScriptEditorWorkspaceContent() {
    this.ensureScriptEditorVisibleSelection();

    const workspace = createScriptEditorWorkspaceShellViewModel({
      project: this.scriptEditorProject,
      selection: this.scriptEditorSelection,
      visibleFamilies: getScriptEditorWorkflowVisibleFamilies(),
      auxiliaryPanelOpen: this.scriptEditorAuxiliaryPanelOpen,
      exportDiagnostics: this.getCachedScriptEditorExportDiagnostics(),
      projectIsFormalized: true,
    });

    return `
        ${this.renderScriptEditorFileInputs()}
        ${this.renderScriptEditorNotice()}
        ${renderScriptEditorWorkspaceView(
          workspace,
          this.renderScriptEditorEditorPanel()
        )}
    `;
  }

  renderScriptEditorWorkspace() {
    if (this.scriptEditorProject == null) {
      this.currentScreen = "script-editor-landing";
      return this.renderScriptEditorLanding();
    }

    return `
      <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器工作流">
        ${this.renderScriptEditorWorkspaceContent()}
      </section>
    `;
  }

  refreshScriptEditorWorkspace() {
    if (this.currentScreen !== "script-editor-workspace" || this.scriptEditorProject == null) {
      this.render();
      return;
    }

    const scriptEditorScreen = this.overlayRoot.querySelector(
      ".c-main-ui-screen--script-editor-flow"
    );
    if (!(scriptEditorScreen instanceof globalThis.HTMLElement)) {
      this.render();
      return;
    }

    this.captureScriptEditorScrollPosition();
    scriptEditorScreen.innerHTML = this.renderScriptEditorWorkspaceContent();
    this.restoreScriptEditorScrollPosition();
  }

  renderRuntimePreviewOverlay() {
    return `
      <section class="c-main-ui-screen c-main-ui-screen--runtime-preview" aria-label="运行预览">
      </section>
    `;
  }

  renderRuntimePreviewSessionBanner() {
    const hint =
      this.currentScreen === "runtime-preview"
        ? "运行预览已进入游戏，会话仍由编辑器托管。"
        : "请完成角色选择后继续进入游戏。";
    return `
      <aside class="c-main-ui-runtime-preview-session-banner" aria-label="运行预览提示">
        <div class="c-main-ui-runtime-preview-session-banner__text">
          <span class="c-main-ui-runtime-preview-session-banner__title">运行预览中</span>
          <span class="c-main-ui-runtime-preview-session-banner__hint">${hint}</span>
        </div>
        <div class="c-main-ui-runtime-preview-session-banner__text" hidden aria-hidden="true" style="display:none !important">
          <span class="c-main-ui-runtime-preview-session-banner__title">运行预览中</span>
          <span class="c-main-ui-runtime-preview-session-banner__hint">请完成角色选择后继续进入游戏。</span>
        </div>
        <button class="c-runtime-preview-exit c-runtime-preview-exit--session" type="button" data-script-editor-action="exit-runtime-preview">
          退出预览
        </button>
      </aside>
    `;
  }

  renderScriptEditorEditorPanel() {
    if (this.scriptEditorProject == null) {
      return "";
    }

    if (this.scriptEditorSelection.family === "storyPack") {
      const storyPack = this.scriptEditorProject.storyPack;
      const scenarioProfile = storyPack.scenarioProfile ?? {};
      const initialLocation = scenarioProfile.initialLocation ?? {};
      const launchPolicy = scenarioProfile.launchPolicy ?? {};
      const createRecordOption = (record) => ({
        value: record.id,
        label: `${record.title ?? record.name ?? record.label ?? record.id} (${record.id})`,
      });
      const initialViewOptions = [
        { value: "map", label: "地图" },
        { value: "city", label: "城市" },
        { value: "house", label: "建筑" },
      ];
      const legacyCharacterSelectionOptions = [
        { value: "shell", label: "开局时选择角色" },
        { value: "fixed", label: "使用默认角色直接开局" },
      ];
      const characterSelectionOptions = [
        { value: "select", label: "开局时选择角色" },
        { value: "fixed", label: "使用默认角色直接开局" },
        { value: "first-playable", label: "使用第一个可操作角色开局" },
      ];
      const defaultRoleOptions = this.scriptEditorProject.people
        .filter((person) => person.personType === "角色")
        .map(createRecordOption);
      const cityOptions = this.scriptEditorProject.cities.map(createRecordOption);
      const buildingOptions = this.scriptEditorProject.buildings.map(createRecordOption);
      const exportDiagnostics = this.getCachedScriptEditorExportDiagnostics();
      const compatibilityResidueCount = this.countScriptEditorCompatibilityResidue();

      return `
        <div class="c-script-editor-editor-card">
          <header class="c-script-editor-editor-card__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">项目总览</p>
              <h2 class="c-script-editor-editor-card__title">项目根信息</h2>
            </div>
            <div class="c-script-editor-editor-card__actions">
              <button
                type="button"
                class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
                data-script-editor-action="save"
              >
                保存项目
              </button>
            </div>
          </header>
          <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
          <div class="c-script-editor-shell__cards c-script-editor-editor-card__overview">
            ${this.renderScriptEditorOverviewCard(
              "项目状态",
              `当前项目 ${this.scriptEditorProject.id} 以 ${scenarioProfile.id ?? "未设置"} 作为开场场景，默认主角为 ${scenarioProfile.playerCharacterId ?? "未设置"}。`,
              "success"
            )}
            ${this.renderScriptEditorOverviewCard(
              "创作进度",
              `当前已收录人物 ${this.scriptEditorProject.people.length} 条、文本 ${this.scriptEditorProject.textEntries.length} 条、事件 ${this.scriptEditorProject.events.length} 条。`,
              "neutral"
            )}
            ${this.renderScriptEditorOverviewCard(
              "风险与阻塞",
              this.describeScriptEditorProjectRisk(exportDiagnostics, compatibilityResidueCount),
              exportDiagnostics.length === 0 && compatibilityResidueCount === 0 ? "success" : "warning"
            )}
            ${this.renderScriptEditorOverviewCard(
              "下一步建议",
              "继续从左侧对象导航进入正式作者面；当前优先推进人物作者面与关系入口，城市、建筑、菜单和更深剧情编辑保持后续队列承接。",
              "neutral"
            )}
          </div>
          <div class="c-script-editor-form-grid">
            ${this.renderScriptEditorField("project.title", "项目标题", this.scriptEditorProject.title)}
            ${this.renderScriptEditorField("project.description", "项目说明", this.scriptEditorProject.description ?? "")}
            ${this.renderScriptEditorField("storyPack.title", "剧本包标题", storyPack.title)}
            ${this.renderScriptEditorField("storyPack.description", "剧本包说明", storyPack.description ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.title", "开场场景标题", scenarioProfile.title ?? "")}
            ${this.renderScriptEditorStartupSelect("initialView", "开局视图", initialViewOptions, launchPolicy.initialView ?? initialLocation.view ?? "", "未设置开局视图")}
            ${this.renderScriptEditorStartupSelect("cityId", "开局城市", cityOptions, initialLocation.cityId ?? "", "未设置开局城市")}
            ${this.renderScriptEditorStartupSelect("houseId", "开局建筑", buildingOptions, initialLocation.houseId ?? "", "未设置开局建筑")}
            ${this.renderScriptEditorField("scenarioProfile.entryEventId", "入口事件 ID", scenarioProfile.entryEventId ?? "")}
            ${this.renderScriptEditorStartupSelect("characterSelection", "角色选择策略", characterSelectionOptions, launchPolicy.characterSelection ?? "", "未设置角色选择策略")}
            ${this.renderScriptEditorStartupSelect("playerCharacterId", "默认角色", defaultRoleOptions, scenarioProfile.playerCharacterId ?? "", "未设置默认角色")}
            ${this.renderScriptEditorField("scenarioProfile.launchPolicy.entryEventTiming", "入口事件时机", launchPolicy.entryEventTiming ?? "")}
          </div>
          ${this.renderScriptEditorSystemDetails(
            "高级设置与系统信息",
            "项目标识、开场目标和底层定位字段默认折叠，避免首屏被工程字段占满。",
            `
              <div class="c-script-editor-form-grid">
                ${this.renderScriptEditorField("project.id", "项目 ID", this.scriptEditorProject.id)}
                ${this.renderScriptEditorField("storyPack.id", "剧本包 ID", storyPack.id)}
                ${this.renderScriptEditorField("scenarioProfile.id", "开场场景 ID", scenarioProfile.id ?? "")}
                ${this.renderScriptEditorField("scenarioProfile.chapterId", "章节 ID", scenarioProfile.chapterId ?? "")}
                ${this.renderScriptEditorField("scenarioProfile.initialLocation.mapId", "初始地图 ID", initialLocation.mapId ?? "")}
              </div>
            `
          )}
        </div>
      `;
    }

    const family = this.scriptEditorSelection.family;
    if (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) {
      return this.renderScriptEditorStageConfigurationEditor();
    }
    const records = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    const selectedRecord =
      records.find((record) => record.id === this.scriptEditorSelection.entityId) ??
      records[0] ??
      null;
    const selectedRecordJson =
      selectedRecord == null ? "{}" : JSON.stringify(selectedRecord, null, 2);
    const isDeferredFamily = family === "storyNodes";

    if (family === "people") {
      return this.renderScriptEditorPeopleEditor(records, selectedRecord);
    }

    if (family === "portraits") {
      return this.renderScriptEditorPortraitEditor(records, selectedRecord);
    }

    if (family === "portraitVariants") {
      return this.renderScriptEditorPortraitVariantEditor(records, selectedRecord);
    }

    if (family === "cities" || family === "buildings") {
      return this.renderScriptEditorLocationEditor(family, records, selectedRecord);
    }

    if (family === "storyNodes") {
      return this.renderScriptEditorStoryNodeEditor(records, selectedRecord);
    }

    if (family === "dialogues") {
      return this.renderScriptEditorDialogueEditor(records, selectedRecord);
    }

    if (family === "settlements") {
      return this.renderScriptEditorSettlementEditor(records, selectedRecord);
    }

    if (family === "menuResources") {
      return this.renderScriptEditorMenuModuleEditor(records, selectedRecord);
    }

    if (family === "progressTracks") {
      return this.renderScriptEditorProgressTrackEditor(records, selectedRecord);
    }

    if (family === "progressTrackBindings") {
      return this.renderScriptEditorProgressTrackBindingEditor(records, selectedRecord);
    }

    if (family === "events") {
      return this.renderScriptEditorEventEditor(records, selectedRecord);
    }

    if (family === "eventBindings") {
      return this.renderScriptEditorEventBindingsEditor(records, selectedRecord);
    }

    if (family === "minigames") {
      return this.renderScriptEditorMinigameEditor(records, selectedRecord);
    }

    if (family === "textEntries") {
      return this.renderScriptEditorTextEntryEditor(records, selectedRecord);
    }

    if (family === "items") {
      return this.renderScriptEditorItemEditor(records, selectedRecord);
    }

    return `
      <div class="c-script-editor-editor-card">
        <header class="c-script-editor-editor-card__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">对象作者面</p>
            <h2 class="c-script-editor-editor-card__title">${escapeHtml(this.getScriptEditorFamilyLabel(family))}</h2>
          </div>
          <div class="c-script-editor-editor-card__actions">
            <button
              type="button"
              class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
              data-script-editor-action="apply-record-json"
              ${selectedRecord == null ? "disabled" : ""}
            >
              应用 JSON
            </button>
          </div>
        </header>

        ${
          isDeferredFamily
            ? `
              <p class="c-script-editor-editor-card__hint">
                剧情节点当前仍是受边界约束的占位作者面。可以继续编辑，但在后续队列补齐编译路径前，运行时导出仍会保持失败关闭。
              </p>
            `
            : ""
        }

        <div class="c-script-editor-record-layout">
          ${this.renderScriptEditorPaginatedRecordList({
            family,
            records,
            ariaLabel: "对象列表",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${selectedRecord == null ? "disabled" : ""}
                >
                  删除
                </button>
              </div>
            `,
            renderRecord: (record) => `
              <button
                type="button"
                class="c-script-editor-record-list__item ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                data-script-editor-record-id="${escapeHtml(record.id)}"
              >
                <strong>${escapeHtml(this.getScriptEditorRecordLabel(record))}</strong>
                <span>${escapeHtml(record.id)}</span>
              </button>
            `,
          })}
          <div class="c-script-editor-record-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <textarea
              class="c-script-editor-record-editor__textarea"
              data-script-editor-record-json
              spellcheck="false"
            >${escapeHtml(selectedRecordJson)}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorItemEditor(records, selectedRecord) {
    const portraitOptions = (this.scriptEditorProject?.portraits ?? []).map((portrait) => ({
      value: portrait.id,
      label: portrait.label ?? portrait.id,
    }));
    const customProperties = Array.isArray(selectedRecord?.customProperties)
      ? selectedRecord.customProperties
      : [];

    return `
      <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
      <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "items",
            records,
            ariaLabel: "道具列表",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增道具
                </button>
              </div>
            `,
            renderRecord: (record) => `
              <button
                type="button"
                class="c-script-editor-record-list__item ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                data-script-editor-record-id="${escapeHtml(record.id)}"
              >
                <strong>${escapeHtml(this.getScriptEditorRecordLabel(record))}</strong>
              </button>
            `,
          })}
          <section class="c-script-editor-record-editor" aria-label="道具工作台">
            <div class="c-script-editor-editor-card__header">
              <div>
                <p class="c-script-editor-editor-card__eyebrow">道具</p>
                <h2 class="c-script-editor-editor-card__title">道具工作台</h2>
              </div>
            </div>
            ${
              selectedRecord == null
                ? `<p class="c-script-editor-editor-card__hint">当前还没有道具，先从左侧新增道具。</p>`
                : `
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>道具名称</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(selectedRecord.name ?? "")}" data-script-editor-item-field="name" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>道具说明</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(selectedRecord.description ?? "")}" data-script-editor-item-field="description" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>图标资源</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-item-display-field="iconId">
                        ${this.renderScriptEditorSelectOptions(
                          portraitOptions,
                          selectedRecord.display?.iconId ?? "",
                          "未选择图标资源"
                        )}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>是否可堆叠</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-item-stack-field="stackable">
                        <option value="false" ${selectedRecord.stack?.stackable === true ? "" : "selected"}>否</option>
                        <option value="true" ${selectedRecord.stack?.stackable === true ? "selected" : ""}>是</option>
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>最大堆叠数量</span>
                      <input class="c-script-editor-form-field__input" type="number" min="1" step="1" value="${escapeHtml(String(selectedRecord.stack?.maxStack ?? ""))}" data-script-editor-item-stack-field="maxStack" />
                    </label>
                  </div>

                  ${this.renderScriptEditorOwnerMenuMountPanel(
                    "items",
                    selectedRecord.id,
                    "菜单组",
                    "这里引用菜单模块中的实例。道具的使用、销毁等操作应先在菜单模块维护，再添加到当前道具。"
                  )}

                  <section class="c-script-editor-narrative-panel" aria-label="自定义属性">
                    <div class="c-script-editor-narrative-panel__header">
                      <div>
                        <p class="c-script-editor-editor-card__eyebrow">自定义属性</p>
                        <h3 class="c-script-editor-editor-card__title">自定义属性</h3>
                      </div>
                      <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-item-custom-property">
                        新增属性
                      </button>
                    </div>
                    <div class="c-script-editor-narrative-list">
                      ${
                        customProperties.length === 0
                          ? `<p class="c-script-editor-editor-card__hint">没有自定义属性。需要给运行时识别的通用字段时，再新增属性。</p>`
                          : customProperties
                              .map(
                                (property, index) => `
                                  <div class="c-script-editor-narrative-inline">
                                    <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(property.key ?? "")}" placeholder="属性名" data-script-editor-item-custom-property-field="key" data-script-editor-item-custom-property-index="${index}" />
                                    <select class="c-script-editor-form-field__input" data-script-editor-item-custom-property-field="type" data-script-editor-item-custom-property-index="${index}">
                                      <option value="string" ${property.type === "string" ? "selected" : ""}>文本</option>
                                      <option value="number" ${property.type === "number" ? "selected" : ""}>数字</option>
                                      <option value="boolean" ${property.type === "boolean" ? "selected" : ""}>开关</option>
                                    </select>
                                    <input class="c-script-editor-form-field__input" type="${property.type === "number" ? "number" : "text"}" value="${escapeHtml(String(property.value ?? ""))}" placeholder="值" data-script-editor-item-custom-property-field="value" data-script-editor-item-custom-property-index="${index}" />
                                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-item-custom-property" data-script-editor-item-custom-property-index="${index}">
                                      删除
                                    </button>
                                  </div>
                                `
                              )
                              .join("")
                      }
                    </div>
                  </section>

                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>作者备注</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(selectedRecord.internalNote ?? "")}" data-script-editor-item-field="internalNote" />
                    </label>
                  </div>
                `
            }
          </section>
        </div>
      </div>
    `;
  }

  renderScriptEditorTextEntryEditor(records, selectedRecord) {
    const selectedText = typeof selectedRecord?.text === "string" ? selectedRecord.text : "";
    const filteredRecords = this.filterScriptEditorRecords("textEntries", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "textEntries",
            records: filteredRecords,
            ariaLabel: "文本列表",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("textEntries", "搜索文本", "按文本标题、内容或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${selectedRecord == null ? "disabled" : ""}
                >
                  删除
                </button>
              </div>
            `,
            renderRecord: (record) => `
              <button
                type="button"
                class="c-script-editor-record-list__item c-script-editor-record-list__item--text-entry ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                data-script-editor-record-id="${escapeHtml(record.id)}"
                title="${escapeHtml(this.getScriptEditorRecordLabel(record))}"
              >
                <strong class="c-script-editor-record-list__title c-script-editor-record-list__title--clamp-2">${escapeHtml(this.getScriptEditorRecordLabel(record))}</strong>
              </button>
            `,
          })}
          <div class="c-script-editor-record-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            <template data-script-editor-inspector-header-slot>
              <div class="c-script-editor-editor-card__actions c-script-editor-editor-card__actions--end">
                <button
                  type="button"
                  class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
                  data-script-editor-action="apply-text-entry-text"
                  ${selectedRecord == null ? "disabled" : ""}
                >
                  应用文本
                </button>
              </div>
            </template>
            <textarea
              class="c-script-editor-record-editor__textarea"
              data-script-editor-text-entry-text
              spellcheck="false"
              placeholder="请输入文本内容"
            >${escapeHtml(selectedText)}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  getScriptEditorRecordListPage(family) {
    if (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) {
      return this.scriptEditorRecordListPages[family] ?? 1;
    }

    if (!isScriptEditorMinimalWorkflowFamily(family) || family === "storyPack") {
      return 1;
    }

    return this.scriptEditorRecordListPages[family] ?? 1;
  }

  resetScriptEditorRecordListPages() {
    this.scriptEditorRecordListPages = {};
  }

  resetScriptEditorRecordSearch() {
    this.scriptEditorRecordSearch = {
      people: "",
      portraits: "",
      portraitVariants: "",
      cities: "",
      buildings: "",
      quests: "",
      storyNodes: "",
      dialogues: "",
      settlements: "",
      menuResources: "",
      stageConfiguration: "",
      progressTracks: "",
      progressTrackBindings: "",
      events: "",
      minigames: "",
      textEntries: "",
    };
  }

  resetScriptEditorPersonAttributePage() {
  }

  setScriptEditorRecordListPage(family, nextPage) {
    if (this.scriptEditorProject == null) {
      return 1;
    }

    const records =
      family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
        ? this.getScriptEditorStageConfigurationBindings()
        : !isScriptEditorMinimalWorkflowFamily(family) || family === "storyPack"
          ? null
          : listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    if (records == null) {
      return 1;
    }
    const totalPages = Math.max(
      1,
      Math.ceil(records.length / SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE)
    );
    const resolvedPage = Math.min(
      Math.max(Number.isInteger(nextPage) ? nextPage : 1, 1),
      totalPages
    );

    this.scriptEditorRecordListPages = {
      ...this.scriptEditorRecordListPages,
      [family]: resolvedPage,
    };

    return resolvedPage;
  }

  syncScriptEditorRecordListPageToRecord(family, recordId, records = null) {
    if (this.scriptEditorProject == null) {
      return 1;
    }

    const resolvedRecords =
      records ??
      (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
        ? this.getScriptEditorStageConfigurationBindings()
        : !isScriptEditorMinimalWorkflowFamily(family) || family === "storyPack"
          ? null
          : listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family));
    if (resolvedRecords == null) {
      return 1;
    }
    const recordIndex = resolvedRecords.findIndex((record) => record.id === recordId);

    if (recordIndex < 0) {
      return this.setScriptEditorRecordListPage(family, 1);
    }

    return this.setScriptEditorRecordListPage(
      family,
      Math.floor(recordIndex / SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE) + 1
    );
  }

  getScriptEditorRecordSearchValue(family) {
    return this.scriptEditorRecordSearch[family] ?? "";
  }

  setScriptEditorRecordSearchValue(family, value) {
    this.scriptEditorRecordSearch = {
      ...this.scriptEditorRecordSearch,
      [family]: value,
    };
    this.setScriptEditorRecordListPage(family, 1);
    this.refreshScriptEditorWorkspace();
  }

  getScriptEditorCityMountedBuildingUiKey(buildingIndex) {
    if (
      this.scriptEditorSelection.family !== "cities" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    return `${this.scriptEditorSelection.entityId}:${buildingIndex}`;
  }

  getScriptEditorCityMountedBuildingListUiKey() {
    return this.getScriptEditorCityMountedBuildingUiKey("__list__");
  }

  getScriptEditorCityMountedBuildingListUiState() {
    const key = this.getScriptEditorCityMountedBuildingListUiKey();
    if (key == null) {
      return {
        page: 1,
      };
    }

    return {
      page: 1,
      ...(this.scriptEditorCityMountedBuildingUiState[key] ?? {}),
    };
  }

  setScriptEditorCityMountedBuildingListUiState(nextState) {
    const key = this.getScriptEditorCityMountedBuildingListUiKey();
    if (key == null) {
      return;
    }

    this.scriptEditorCityMountedBuildingUiState = {
      ...this.scriptEditorCityMountedBuildingUiState,
      [key]: {
        ...this.getScriptEditorCityMountedBuildingListUiState(),
        ...nextState,
      },
    };
  }

  getScriptEditorCityMountedBuildingUiState(buildingIndex) {
    const key = this.getScriptEditorCityMountedBuildingUiKey(buildingIndex);
    if (key == null) {
      return {
        expanded: false,
        search: "",
        page: 1,
      };
    }

    return {
      expanded: false,
      search: "",
      page: 1,
      ...(this.scriptEditorCityMountedBuildingUiState[key] ?? {}),
    };
  }

  setScriptEditorCityMountedBuildingUiState(buildingIndex, nextState) {
    const key = this.getScriptEditorCityMountedBuildingUiKey(buildingIndex);
    if (key == null) {
      return;
    }

    this.scriptEditorCityMountedBuildingUiState = {
      ...this.scriptEditorCityMountedBuildingUiState,
      [key]: {
        ...this.getScriptEditorCityMountedBuildingUiState(buildingIndex),
        ...nextState,
      },
    };
  }

  setScriptEditorCityMountedBuildingExpanded(buildingIndex, expanded) {
    this.setScriptEditorCityMountedBuildingUiState(buildingIndex, { expanded });
    this.refreshScriptEditorWorkspace();
  }

  setScriptEditorCityMountedBuildingSearchValue(buildingIndex, value) {
    this.setScriptEditorCityMountedBuildingUiState(buildingIndex, {
      search: value,
      page: 1,
    });
    this.refreshScriptEditorWorkspace();
  }

  getScriptEditorMenuModuleItemPageState(instanceId, entries) {
    const normalizedInstanceId = String(instanceId ?? "").trim();
    const normalizedEntries = Array.isArray(entries) ? entries : [];
    const totalPages = Math.max(
      1,
      Math.ceil(normalizedEntries.length / SCRIPT_EDITOR_MENU_MODULE_ENTRY_PAGE_SIZE)
    );
    const rawPage =
      this.scriptEditorMenuModuleItemPageById?.[normalizedInstanceId] ?? 1;
    const currentPage = Math.min(Math.max(rawPage, 1), totalPages);
    if (rawPage !== currentPage) {
      this.scriptEditorMenuModuleItemPageById = {
        ...this.scriptEditorMenuModuleItemPageById,
        [normalizedInstanceId]: currentPage,
      };
    }
    const startIndex =
      (currentPage - 1) * SCRIPT_EDITOR_MENU_MODULE_ENTRY_PAGE_SIZE;
    return {
      currentPage,
      totalPages,
      visibleEntries: normalizedEntries.slice(
        startIndex,
        startIndex + SCRIPT_EDITOR_MENU_MODULE_ENTRY_PAGE_SIZE
      ),
      startIndex,
    };
  }

  changeScriptEditorMenuModuleItemPage(instanceId, delta) {
    const normalizedInstanceId = String(instanceId ?? "").trim();
    if (normalizedInstanceId.length === 0 || this.scriptEditorProject == null) {
      return;
    }
    const menuRecord = listScriptEditorMenuModuleRecords(this.scriptEditorProject).find(
      (record) => record.id === normalizedInstanceId
    );
    if (menuRecord == null) {
      return;
    }
    const { currentPage, totalPages } = this.getScriptEditorMenuModuleItemPageState(
      normalizedInstanceId,
      menuRecord.entries
    );
    this.scriptEditorMenuModuleItemPageById = {
      ...this.scriptEditorMenuModuleItemPageById,
      [normalizedInstanceId]: Math.min(Math.max(currentPage + delta, 1), totalPages),
    };
    this.render();
  }

  getFilteredScriptEditorCityMountedBuildingNpcEntries(entry, searchValue) {
    const npcOptionsById = new Map(
      (this.scriptEditorProject?.people ?? [])
        .map((person) => normalizeScriptEditorPersonRecord(person))
        .map((person) => [person.id, person])
    );
    const query = searchValue.trim().toLowerCase();
    const npcIds = entry.npcIds ?? [];

    return npcIds
      .map((npcId, npcIndex) => ({
        npcId,
        npcIndex,
        npcRecord: npcOptionsById.get(npcId) ?? null,
      }))
      .filter((npcEntry) => {
        if (query.length === 0) {
          return true;
        }

        return [npcEntry.npcRecord?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  }

  getScriptEditorCityMountedBuildingNpcPageState(entry, buildingIndex) {
    const uiState = this.getScriptEditorCityMountedBuildingUiState(buildingIndex);
    const filteredEntries = this.getFilteredScriptEditorCityMountedBuildingNpcEntries(
      entry,
      uiState.search
    );
    const totalPages = Math.max(
      1,
      Math.ceil(
        filteredEntries.length / SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_NPC_PAGE_SIZE
      )
    );
    const currentPage = Math.min(Math.max(uiState.page, 1), totalPages);
    const startIndex =
      (currentPage - 1) * SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_NPC_PAGE_SIZE;

    return {
      uiState,
      filteredEntries,
      totalPages,
      currentPage,
      visibleEntries: filteredEntries.slice(
        startIndex,
        startIndex + SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_NPC_PAGE_SIZE
      ),
    };
  }

  getScriptEditorCityMountedBuildingListPageState(city) {
    const mountedBuildings = city.mountedBuildings ?? [];
    const uiState = this.getScriptEditorCityMountedBuildingListUiState();
    const totalPages = Math.max(
      1,
      Math.ceil(mountedBuildings.length / SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_PAGE_SIZE)
    );
    const currentPage = Math.min(Math.max(uiState.page, 1), totalPages);
    const startIndex = (currentPage - 1) * SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_PAGE_SIZE;

    return {
      uiState,
      totalPages,
      currentPage,
      totalEntries: mountedBuildings.length,
      visibleEntries: mountedBuildings
        .slice(startIndex, startIndex + SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_PAGE_SIZE)
        .map((entry, offset) => ({
          entry,
          buildingIndex: startIndex + offset,
        })),
    };
  }

  changeScriptEditorCityMountedBuildingNpcPage(buildingIndex, delta) {
    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    const entry = city.mountedBuildings?.[buildingIndex] ?? null;
    if (entry == null) {
      return;
    }

    const { currentPage, totalPages } =
      this.getScriptEditorCityMountedBuildingNpcPageState(entry, buildingIndex);
    this.setScriptEditorCityMountedBuildingUiState(buildingIndex, {
      page: Math.min(Math.max(currentPage + delta, 1), totalPages),
    });
    this.render();
  }

  changeScriptEditorCityMountedBuildingListPage(delta) {
    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    const { currentPage, totalPages } =
      this.getScriptEditorCityMountedBuildingListPageState(city);
    this.setScriptEditorCityMountedBuildingListUiState({
      page: Math.min(Math.max(currentPage + delta, 1), totalPages),
    });
    this.render();
  }

  filterScriptEditorRecords(family, records) {
    const searchValue = this.getScriptEditorRecordSearchValue(family).trim().toLowerCase();
    if (searchValue.length === 0) {
      return records;
    }

    if (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) {
      return records.filter((record) => {
        const binding = normalizeScriptEditorProgressTrackBindingRecord(record);
        const candidateText = [
          this.getScriptEditorProgressBindingOwnerDisplay(binding),
          this.getScriptEditorProgressTrackTitleById(binding.trackId),
          this.getScriptEditorProgressOwnerKindLabel(binding.host?.family ?? ""),
        ]
          .filter((value) => typeof value === "string" && value.trim().length > 0)
          .join(" ")
          .toLowerCase();
        return candidateText.includes(searchValue);
      });
    }

    if (family === "people") {
      return records.filter((record) => {
        const person = normalizeScriptEditorPersonRecord(record);
        return [
          person.name,
          person.id,
          person.title ?? "",
          person.occupation ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);
      });
    }

    return records.filter((record) => {
      const candidateText = [
        record?.id,
        record?.name,
        record?.title,
        record?.text,
        record?.description,
        record?.summary,
        this.getScriptEditorRecordLabel(record),
      ]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join(" ")
        .toLowerCase();
      return candidateText.includes(searchValue);
    });
  }

  renderScriptEditorRecordListSearch(family, label, placeholder) {
    const familyAttribute =
      SCRIPT_EDITOR_RECORD_SEARCH_FAMILY_ATTRIBUTES[family] ??
      `data-script-editor-record-search-family="${escapeHtml(family)}"`;

    return `
      <label class="c-script-editor-record-list__search">
        <span>${escapeHtml(label)}</span>
        <input
          class="c-script-editor-form-field__input"
          type="search"
          value="${escapeHtml(this.getScriptEditorRecordSearchValue(family))}"
          placeholder="${escapeHtml(placeholder)}"
          ${familyAttribute}
        />
      </label>
    `;
  }

  getScriptEditorPaginatedRecordListState(family, records) {
    const totalPages = Math.max(
      1,
      Math.ceil(records.length / SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE)
    );
    const currentPage = Math.min(
      Math.max(this.getScriptEditorRecordListPage(family), 1),
      totalPages
    );
    const startIndex = (currentPage - 1) * SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE;

    if (this.getScriptEditorRecordListPage(family) !== currentPage) {
      this.scriptEditorRecordListPages = {
        ...this.scriptEditorRecordListPages,
        [family]: currentPage,
      };
    }

    return {
      currentPage,
      totalPages,
      visibleRecords: records.slice(
        startIndex,
        startIndex + SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE
      ),
    };
  }

  renderScriptEditorRecordPagination(family, currentPage, totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    return `
      <nav class="c-script-editor-record-pagination" aria-label="${escapeHtml(this.getScriptEditorFamilyLabel(family))} 分页">
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="record-page-prev"
          aria-label="上一页"
          ${currentPage <= 1 ? "disabled" : ""}
        >
          ‹
        </button>
        <span class="c-script-editor-record-pagination__status">第 ${currentPage} / ${totalPages} 页</span>
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="record-page-next"
          aria-label="下一页"
          ${currentPage >= totalPages ? "disabled" : ""}
        >
          ›
        </button>
      </nav>
    `;
  }

  renderScriptEditorPaginatedRecordList({
    family,
    records,
    ariaLabel,
    modifierClass = "",
    toolbar = "",
    renderRecord,
  }) {
    const { visibleRecords, currentPage, totalPages } =
      this.getScriptEditorPaginatedRecordListState(family, records);
    const listClassName = ["c-script-editor-record-list", modifierClass]
      .filter((className) => className.length > 0)
      .join(" ");

    return `
      <aside class="${listClassName}" aria-label="${escapeHtml(ariaLabel)}">
        ${toolbar}
        ${
          visibleRecords.length === 0
            ? '<p class="c-script-editor-record-list__empty">暂无可编辑对象。</p>'
            : visibleRecords.map((record) => renderRecord(record)).join("")
        }
        ${this.renderScriptEditorRecordPagination(family, currentPage, totalPages)}
      </aside>
    `;
  }

  renderScriptEditorPeopleEditor(records, selectedRecord) {
    const person = selectedRecord == null ? null : normalizeScriptEditorPersonRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("people", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--people">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "people",
            records: filteredRecords,
            ariaLabel: "人物列表",
            modifierClass: "c-script-editor-record-list--people",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("people", "搜索人物", "按人物名、身份 / 职位搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增人物
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${person == null ? "disabled" : ""}
                >
                  删除人物
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedPerson = normalizeScriptEditorPersonRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--person ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedPerson.name)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorPersonListSummary(normalizedPerson))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-person-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              person == null
                ? `
                  <p class="c-script-editor-editor-card__hint">
                    请选择一个人物后继续编辑。人物作者面负责统一人物资料、关系入口和能力绑定，不在这里展开正式对话或事件页。
                  </p>
                `
                : `
                  <template data-script-editor-inspector-header-slot>
                    ${this.renderScriptEditorPersonTabList()}
                  </template>
                  ${this.renderScriptEditorPersonTabPanel(person)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorPersonTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-person-editor__tab ${this.scriptEditorPersonTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-person-tab"
        data-script-editor-person-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorPersonTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorUnusedLegacyPersonTabList() {
    return `
      <div class="c-script-editor-person-editor__tabs" role="tablist" aria-label="人物详情分栏">
        ${this.renderScriptEditorPersonTabButton("profile", "属性")}
        ${this.renderScriptEditorPersonTabButton("dialogues", "对话")}
        ${this.renderScriptEditorPersonTabButton("trade", "交易")}
        ${this.renderScriptEditorPersonTabButton("events", "事件")}
      </div>
    `;
  }

  renderScriptEditorUnusedLegacyPersonSummaryAttributes(person) {
    const {
      currentPage,
      totalPages,
      visibleEntries,
    } = this.getScriptEditorPersonAttributePaginationState(
      readScriptEditorPersonTypedAttributes(person)
    );

    return `
      <section class="c-script-editor-person-summary" aria-label="已有属性">
        <header class="c-script-editor-person-summary__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">自定义属性</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" ${`data-script-editor-action="add-person` + `-attribute"`}>
            新增属性
          </button>
        </header>
        <div class="c-script-editor-person-summary__list">
          ${visibleEntries
            .map(
              ({ entry, index }) => `
                <article class="c-script-editor-person-summary__item">
                  <button
                    type="button"
                    class="${`c-script-editor-person-summary__` + `remove`}"
                    ${`data-script-editor-action="remove-person` + `-attribute"`}
                    data-script-editor-person-attribute-index="${index}"
                    aria-label="删除属性"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.key)}"
                    placeholder="隐藏属性键"
                    ${`data-script-editor-person-attribute-field="` + `unused-key-name"`}
                    data-script-editor-person-attribute-index="${index}"
                  />
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.label ?? "")}"
                    placeholder="属性名"
                    ${`data-script-editor-person-attribute-field="` + `label"`}
                    data-script-editor-person-attribute-index="${index}"
                  />
                  <select
                    class="c-script-editor-form-field__input"
                    ${`data-script-editor-person-attribute-field="` + `type"`}
                    data-script-editor-person-attribute-index="${index}"
                  >
                    ${this.renderScriptEditorSelectOptions(
                      SCRIPT_EDITOR_PERSON_ATTRIBUTE_TYPE_OPTIONS,
                      entry.type ?? "string",
                      "鏂囨湰"
                    )}
                  </select>
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.value)}"
                    placeholder="属性值"
                    ${`data-script-editor-person-attribute-field="` + `value"`}
                    data-script-editor-person-attribute-index="${index}"
                  />
                </article>
              `
            )
            .join("")}
        </div>
        ${this.renderScriptEditorPersonAttributePagination(currentPage, totalPages)}
      </section>
    `;
  }

  getScriptEditorPersonAttributePaginationState(entries) {
    const totalPages = Math.max(
      1,
      Math.ceil(entries.length / 10)
    );
    const currentPage = Math.min(
      Math.max(this.scriptEditorPersonAttributePage, 1),
      totalPages
    );
    const pageChanged = this.scriptEditorPersonAttributePage !== currentPage;

    if (pageChanged) {
      this.scriptEditorPersonAttributePage = currentPage;
      this.scriptEditorPersonAttributeVisibleIndices = null;
    }

    const defaultVisibleIndices = Array.from(
      {
        length: Math.max(
          0,
          Math.min(
            10,
            entries.length - (currentPage - 1) * 10
          )
        ),
      },
      (_, offset) =>
        (currentPage - 1) * 10 + offset
    );
    const visibleIndices =
      this.scriptEditorPersonAttributeVisibleIndices == null
        ? defaultVisibleIndices
        : this.scriptEditorPersonAttributeVisibleIndices.filter(
            (index) => Number.isInteger(index) && index >= 0 && index < entries.length
          );

    this.scriptEditorPersonAttributeVisibleIndices = visibleIndices;

    return {
      currentPage,
      totalPages,
      visibleEntries: visibleIndices
        .map((index) => {
          const entry = entries[index];
          if (entry == null) {
            return null;
          }

          return {
            entry,
            index,
          };
        })
        .filter((entry) => entry != null),
    };
  }

  renderScriptEditorPersonAttributePagination(currentPage, totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    return `
      <nav class="c-script-editor-record-pagination" aria-label="人物 JSON 属性分页">
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          ${`data-script-editor-action="person-attribute-page` + `-prev"`}
          ${currentPage <= 1 ? "disabled" : ""}
        >
          ‹
        </button>
        <span class="c-script-editor-record-pagination__status">第 ${currentPage} / ${totalPages} 页</span>
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          ${`data-script-editor-action="person-attribute-page` + `-next"`}
          ${currentPage >= totalPages ? "disabled" : ""}
        >
          ›
        </button>
      </nav>
    `;
  }

  renderScriptEditorSelectOptions(options, selectedValue, emptyLabel) {
    const normalizedSelectedValue =
      typeof selectedValue === "string" ? selectedValue : "";
    const normalizedOptions = Array.isArray(options) ? options : [];
    const hasSelectedOption = normalizedOptions.some(
      (option) => option?.value === normalizedSelectedValue
    );
    const fallbackOptions =
      normalizedSelectedValue.length > 0 && !hasSelectedOption
        ? [
            {
              value: normalizedSelectedValue,
              label: `当前值：${normalizedSelectedValue}`,
            },
          ]
        : [];

    return [
      `<option value="">${escapeHtml(emptyLabel)}</option>`,
      ...fallbackOptions.map(
        (option) =>
          `<option value="${escapeHtml(option.value)}" selected>${escapeHtml(option.label)}</option>`
      ),
      ...normalizedOptions.map(
        (option) => `
          <option
            value="${escapeHtml(option.value)}"
            ${option.value === normalizedSelectedValue ? "selected" : ""}
          >
            ${escapeHtml(option.label)}
          </option>
        `
      ),
    ].join("");
  }

  getScriptEditorProjectRecordOptions(family) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    if (family === "menuResources") {
      return listScriptEditorMenuModuleRecords(this.scriptEditorProject).map((record) => ({
        value: record.id,
        label: record.title,
      }));
    }

    const records = listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    return records.map((record) => ({
      value: record.id,
      label: `${this.getScriptEditorRecordLabel(record)} (${record.id})`,
    }));
  }

  getScriptEditorCreatorRecordOptions(family) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    if (family === "menuResources") {
      return listScriptEditorMenuModuleRecords(this.scriptEditorProject).map((record) => ({
        value: record.id,
        label: record.title,
      }));
    }

    const records = listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    return records.map((record) => ({
      value: record.id,
      label: this.getScriptEditorRecordLabel(record),
    }));
  }

  getScriptEditorMenuInstanceOptions(selectedValue = "", excludedInstanceIds = []) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return this.getScriptEditorLocationMenuOptionsWithFallback(
      listScriptEditorMenuModuleRecords(this.scriptEditorProject)
        .filter((record) => !excludedInstanceIds.includes(record.id))
        .map((record) => ({
          value: record.id,
          label: record.title,
        })),
      selectedValue,
      "当前菜单引用已失效"
    );
  }

  getScriptEditorSettlementTargetOptions(targetFamily) {
    const familyByTargetFamily = {
      person: "people",
      city: "cities",
      building: "buildings",
    };
    const family = familyByTargetFamily[targetFamily] ?? "";
    return family.length === 0 ? [] : this.getScriptEditorCreatorRecordOptions(family);
  }

  getScriptEditorProgressOwnerKindLabel(ownerKind) {
    return (
      SCRIPT_EDITOR_PROGRESS_OWNER_KIND_OPTIONS.find((option) => option.value === ownerKind)
        ?.label ?? ownerKind ?? "未设置对象"
    );
  }

  getScriptEditorProgressBindingLabel(binding) {
    const ownerKindLabel = this.getScriptEditorProgressOwnerKindLabel(
      binding.host?.family ?? ""
    );
    const ownerId = binding.host?.id?.trim?.() ?? "";
    return ownerId.length > 0 ? `${ownerKindLabel} / ${ownerId}` : ownerKindLabel;
  }

  getScriptEditorProgressBindingOwnerDisplay(binding) {
    const ownerKind = binding?.host?.family ?? "";
    const ownerId = binding?.host?.id?.trim?.() ?? "";
    const familyByOwnerKind = {
      person: "people",
      city: "cities",
      building: "buildings",
    };
    const ownerFamily = familyByOwnerKind[ownerKind] ?? "";
    const ownerLabel =
      ownerFamily.length === 0 || this.scriptEditorProject == null
        ? ""
        : this.getScriptEditorCreatorRecordOptions(ownerFamily).find(
            (option) => option.value === ownerId
          )?.label ?? "";
    const ownerKindLabel = this.getScriptEditorProgressOwnerKindLabel(ownerKind);

    if (ownerLabel.length > 0) {
      return ownerLabel;
    }

    if (ownerId.length > 0) {
      return `${ownerKindLabel} / ${ownerId}`;
    }

    return ownerKindLabel;
  }

  getScriptEditorProgressTrackTitleById(trackId) {
    const normalizedTrackId = typeof trackId === "string" ? trackId.trim() : "";
    if (normalizedTrackId.length === 0) {
      return "";
    }

    const track = (this.scriptEditorProject?.progressTracks ?? []).find(
      (record) => record.id === normalizedTrackId
    );
    return track == null
      ? ""
      : normalizeScriptEditorProgressTrackRecord(track).title;
  }

  getScriptEditorStageConfigurationOwnerOptions(ownerKind) {
    const familyByOwnerKind = {
      person: "people",
      city: "cities",
      building: "buildings",
    };
    const ownerFamily = familyByOwnerKind[ownerKind] ?? "";
    return ownerFamily.length === 0
      ? []
      : this.getScriptEditorCreatorRecordOptions(ownerFamily);
  }

  getScriptEditorSettlementAttributeOptions(content) {
    const targetFamily = content?.targetFamily ?? "person";
    const targetId = content?.targetId ?? "";
    if (targetFamily === "city") {
      const city = (this.scriptEditorProject?.cities ?? []).find(
        (record) => record.id === targetId
      );
      return [
        ...SCRIPT_EDITOR_SETTLEMENT_CITY_BASE_ATTRIBUTE_OPTIONS,
        ...this.createScriptEditorSettlementTypedAttributeOptions(city?.extendedAttributes),
      ];
    }
    if (targetFamily === "building") {
      const building = (this.scriptEditorProject?.buildings ?? []).find(
        (record) => record.id === targetId
      );
      return [
        ...SCRIPT_EDITOR_SETTLEMENT_BUILDING_BASE_ATTRIBUTE_OPTIONS,
        ...this.createScriptEditorSettlementTypedAttributeOptions(
          building?.extendedAttributes
        ),
      ];
    }

    const person = (this.scriptEditorProject?.people ?? []).find(
      (record) => record.id === targetId
    );
    return [
      ...SCRIPT_EDITOR_SETTLEMENT_PERSON_BASE_ATTRIBUTE_OPTIONS,
      ...this.createScriptEditorSettlementTypedAttributeOptions(person?.extendedAttributes),
    ];
  }

  createScriptEditorSettlementTypedAttributeOptions(attributes) {
    return (attributes ?? [])
      .filter((attribute) =>
        attribute.type === "number" ||
        attribute.type === "boolean" ||
        attribute.type === "enum"
      )
      .map((attribute) => ({
        value: attribute.key,
        label: attribute.label?.trim() || attribute.key,
        attributeType: attribute.type,
        options: attribute.type === "enum" ? attribute.options ?? [] : undefined,
      }));
  }

  resolveScriptEditorSettlementAttributeType(content, attributeKey) {
    const option = this.getScriptEditorSettlementAttributeOptions({
      ...content,
      attributeKey,
    }).find((entry) => entry.value === attributeKey);
    return option?.attributeType ?? "number";
  }

  getScriptEditorSettlementEnumValueOptions(content) {
    const option = this.getScriptEditorSettlementAttributeOptions(content).find(
      (entry) => entry.value === content.attributeKey
    );
    const options = Array.isArray(option?.options) ? option.options : [];
    return options.map((value) => ({
      value,
      label: value,
    }));
  }

  getScriptEditorSettlementOperationOptions(attributeType) {
    return attributeType === "number"
      ? SCRIPT_EDITOR_SETTLEMENT_NUMERIC_OPERATION_OPTIONS
      : SCRIPT_EDITOR_SETTLEMENT_SET_ONLY_OPERATION_OPTIONS;
  }

  getScriptEditorLocationMenuTargetOptions(
    targetFamily,
    selectedValue = "",
    currentInstanceId = ""
  ) {
    const familyByTargetFamily = {
      event: "events",
      menu: "menuResources",
      menuInstance: "menuResources",
    };
    const family = familyByTargetFamily[targetFamily] ?? "";
    const baseOptions =
      family.length === 0
        ? []
        : family === "menuResources"
          ? this.getScriptEditorMenuInstanceOptions(selectedValue, [currentInstanceId])
          : this.getScriptEditorCreatorRecordOptions(family);
    return this.getScriptEditorLocationMenuOptionsWithFallback(
      baseOptions,
      selectedValue,
      "当前目标引用已失效"
    );
  }

  getScriptEditorLocationMenuPurposeOptions(locationFamily, selectedValue = "") {
    const baseOptions =
      locationFamily === "cities"
        ? [
            { value: "overview", label: "概况" },
            { value: "intel", label: "情报" },
            { value: "locations", label: "地点" },
            { value: "management", label: "管理" },
            { value: "begging", label: "化缘" },
          ]
        : [
            { value: "dialogue", label: "对话" },
            { value: "trade", label: "交易" },
            { value: "work", label: "工作" },
            { value: "rest", label: "休息" },
            { value: "intel", label: "情报" },
            { value: "minigame", label: "小游戏" },
            { value: "management", label: "管理" },
            { value: "leave", label: "离开" },
          ];
    return this.getScriptEditorLocationMenuOptionsWithFallback(
      baseOptions,
      selectedValue,
      "当前用途待整理"
    );
  }

  getScriptEditorLocationMenuTargetFamilyOptions(selectedValue = "") {
    return this.getScriptEditorLocationMenuOptionsWithFallback(
      [
        { value: "event", label: "事件" },
        { value: "menu", label: "菜单" },
      ],
      selectedValue,
      "当前类型待整理"
    );
  }

  getScriptEditorMenuAuthoringTargetFamily(entry) {
    return entry?.authoringTarget?.kind === "menu" ? "menu" : "event";
  }

  getScriptEditorLocationMenuOptionsWithFallback(
    options,
    selectedValue,
    missingLabel
  ) {
    const normalizedSelectedValue =
      typeof selectedValue === "string" ? selectedValue.trim() : "";
    const normalizedOptions = Array.isArray(options) ? options : [];
    if (
      normalizedSelectedValue.length === 0 ||
      normalizedOptions.some((option) => option?.value === normalizedSelectedValue)
    ) {
      return normalizedOptions;
    }

    return [
      {
        value: normalizedSelectedValue,
        label: missingLabel,
      },
      ...normalizedOptions,
    ];
  }

  getScriptEditorPersonCityOptions() {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return this.scriptEditorProject.cities
      .map((city) => normalizeScriptEditorCityRecord(city))
      .map((city) => ({
        value: city.id,
        label: `${city.name} (${city.id})`,
      }));
  }

  getScriptEditorPersonHouseOptions(cityId) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return this.scriptEditorProject.buildings
      .map((building) => normalizeScriptEditorBuildingRecord(building))
      .filter((building) => cityId.trim().length === 0 || building.cityId === cityId)
      .map((building) => ({
        value: building.id,
        label: `${building.name} (${building.id})`,
      }));
  }

  getScriptEditorPersonPortraitOptions() {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return this.scriptEditorProject.portraits
      .map((record) => normalizeScriptEditorPortraitRecord(record))
      .map((record) => ({
        value: record.id,
        label:
          typeof record.label === "string" && record.label.trim().length > 0
            ? `${record.label.trim()} (${record.id})`
            : record.id,
      }));
  }

  getScriptEditorPersonPortraitVariantOptions(person) {
    const optionsByValue = new Map();
    const normalizedPortraitId =
      typeof person?.portraitId === "string" ? person.portraitId.trim() : "";

    (this.scriptEditorProject?.portraitVariants ?? [])
      .map((record) => normalizeScriptEditorPortraitVariantRecord(record))
      .forEach((variant) => {
        if (
          normalizedPortraitId.length > 0 &&
          variant.parentPortraitId !== normalizedPortraitId
        ) {
          return;
        }

        if (variant.id.length === 0 || optionsByValue.has(variant.id)) {
          return;
        }

        const label =
          typeof variant.label === "string" && variant.label.trim().length > 0
            ? variant.label.trim()
            : variant.id;
        optionsByValue.set(variant.id, {
          value: variant.id,
          label: `${label} (${variant.portraitId})`,
        });
      });

    return [...optionsByValue.values()];
  }

  renderScriptEditorUnusedLegacyPersonTabPanel(person) {
    if (this.scriptEditorPersonTab === "dialogues") {
      return this.renderScriptEditorPersonRelationPanel(
        "对话分栏",
        "该分栏只负责组织人物与对话的关联入口，不负责完整对话内容编辑。",
        "dialogueIds",
        person.dialogueIds ?? [],
        "add-person-dialogue-link",
        "remove-person-dialogue-link"
      );
    }

    if (this.scriptEditorPersonTab === "trade") {
      return `
        <section class="c-script-editor-person-panel" aria-label="交易分栏">
          <p class="c-script-editor-editor-card__hint">
            交易分栏只声明人物是否具备交易能力以及绑定哪个入口，不负责商店库存或价格体系。
          </p>
          <label class="c-script-editor-person-editor__toggle">
            <input
              type="checkbox"
              data-script-editor-person-trade-enabled
              ${person.tradeBinding?.enabled ? "checked" : ""}
            />
            <span>启用交易入口</span>
          </label>
          <label class="c-script-editor-form-field">
            <span>交易入口 ID</span>
            <select
              class="c-script-editor-form-field__input"
              data-script-editor-person-field="tradeBinding.entryId"
            >
              ${this.renderScriptEditorSelectOptions(
                this.createScriptEditorTradeBindingReferenceOptions(),
                person.tradeBinding?.entryId ?? "",
                "未选择交易入口"
              )}
            </select>
          </label>
        </section>
      `;
    }

    if (this.scriptEditorPersonTab === "events") {
      return `
        ${this.renderScriptEditorPersonRelationPanel(
          "事件分栏",
          "该分栏保留人物相关事件引用；真实触发配置请使用下方事件绑定。",
          "eventIds",
          person.eventIds ?? [],
          "add-person-event-link",
          "remove-person-event-link"
        )}
        ${this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "person", ownerId: person.id })}
      `;
    }

    const cityOptions = this.getScriptEditorPersonCityOptions();
    const houseOptions = this.getScriptEditorPersonHouseOptions(person.cityId ?? "");
    const portraitOptions = this.getScriptEditorPersonPortraitOptions();
    const portraitVariantOptions =
      this.getScriptEditorPersonPortraitVariantOptions(person);

    return `
      <section class="c-script-editor-person-panel" aria-label="属性分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>人物名称</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.name)}" data-script-editor-person-field="name" />
          </label>
          <label class="c-script-editor-form-field">
            <span>人物类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="personType">
              <option value="角色" ${person.personType === "角色" ? "selected" : ""}>角色</option>
              <option value="NPC" ${person.personType !== "角色" ? "selected" : ""}>NPC</option>
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>正式身份</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.title ?? "")}" data-script-editor-person-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>职业/定位</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.occupation ?? "")}" data-script-editor-person-field="occupation" />
          </label>
          <label class="c-script-editor-form-field">
            <span>所属城市</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="cityId">
              ${this.renderScriptEditorSelectOptions(cityOptions, person.cityId ?? "", "未设置所属城市")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>所属建筑</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="houseId">
              ${this.renderScriptEditorSelectOptions(houseOptions, person.houseId ?? "", "未设置所属建筑")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>立绘 ID</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="portraitId">
              ${this.renderScriptEditorSelectOptions(portraitOptions, person.portraitId ?? "", "未设置立绘")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>立绘变体</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="portraitVariantId">
              ${this.renderScriptEditorSelectOptions(portraitVariantOptions, person.portraitVariantId ?? "", "未设置立绘变体")}
            </select>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>人物简介</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-person-field="biography" spellcheck="false">${escapeHtml(person.biography ?? "")}</textarea>
          </label>
        </div>
      </section>
      ${this.renderScriptEditorLegacyPersonSummaryAttributes(person)}
    `;
  }

  renderScriptEditorLegacyPersonMappedFieldGroups(person) {
    const groupLabels = {
      base: "基础",
      profile: "履历",
      stat: "能力",
      skill: "技能",
    };
    void person;
    const definitions = [];

    return `
      <section class="c-script-editor-person-panel" aria-label="人物映射字段">
        <div class="c-script-editor-person-attributes__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">映射字段</p>
            <h3 class="c-script-editor-editor-card__title">角色资料字段</h3>
          </div>
        </div>
        <div class="c-script-editor-person-mapped-fields">
          ${Object.entries(groupLabels)
            .map(([group, label]) => {
              const groupDefinitions = definitions.filter(
                (definition) => definition.group === group
              );
              return `
                <section class="c-script-editor-person-mapped-fields__group">
                  <h4>${escapeHtml(label)}</h4>
                  <div class="c-script-editor-form-grid">
                    ${groupDefinitions
                      .map((definition) =>
                        this.renderScriptEditorUnusedPersonMappedFieldControl(person, definition)
                      )
                      .join("")}
                  </div>
                </section>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorUnusedPersonMappedFieldControl(person, definition) {
    const value = this.getScriptEditorPersonMappedFieldValue(person, definition.canonicalKey);
    const dataAttribute = `${"data-script-editor-person"}-${"mapped-field"}="${escapeHtml(definition.canonicalKey)}"`;

    if (definition.valueType === "enum") {
      return `
        <label class="c-script-editor-form-field">
          <span>${escapeHtml(definition.label)}</span>
          <select class="c-script-editor-form-field__input" ${dataAttribute}>
            ${this.renderScriptEditorSelectOptions(
              definition.enumOptions ?? [],
              value,
              `未设置${definition.label}`
            )}
          </select>
        </label>
      `;
    }

    if (definition.valueType === "reference") {
      const options =
        definition.referenceFamily === "cities"
          ? this.getScriptEditorPersonCityOptions()
          : definition.referenceFamily === "buildings"
            ? this.getScriptEditorPersonHouseOptions(person.cityId ?? "")
            : definition.referenceFamily === "portraits"
              ? this.getScriptEditorPersonPortraitOptions()
              : definition.referenceFamily === "portraitVariants"
                ? this.getScriptEditorPersonPortraitVariantOptions(person)
                : [];
      return `
        <label class="c-script-editor-form-field">
          <span>${escapeHtml(definition.label)}</span>
          <select class="c-script-editor-form-field__input" ${dataAttribute}>
            ${this.renderScriptEditorSelectOptions(options, value, `未设置${definition.label}`)}
          </select>
        </label>
      `;
    }

    if (definition.valueType === "boolean") {
      return `
        <label class="c-script-editor-person-editor__toggle">
          <input
            type="checkbox"
            ${value === "true" ? "checked" : ""}
            ${dataAttribute}
          />
          <span>${escapeHtml(definition.label)}</span>
        </label>
      `;
    }

    if (definition.valueType === "text") {
      return `
        <label class="c-script-editor-form-field c-script-editor-form-field--wide">
          <span>${escapeHtml(definition.label)}</span>
          <textarea
            class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact"
            spellcheck="false"
            ${dataAttribute}
          >${escapeHtml(value)}</textarea>
        </label>
      `;
    }

    return `
      <label class="c-script-editor-form-field">
        <span>${escapeHtml(definition.label)}</span>
        <input
          class="c-script-editor-form-field__input"
          type="${definition.valueType === "number" ? "number" : "text"}"
          value="${escapeHtml(value)}"
          ${dataAttribute}
        />
      </label>
    `;
  }

  getScriptEditorPersonMappedFieldValue(person, canonicalKey) {
    return String(
      canonicalKey.split(".").reduce((currentValue, segment) => {
        if (
          currentValue == null ||
          typeof currentValue !== "object" ||
          Array.isArray(currentValue)
        ) {
          return undefined;
        }

        return currentValue[segment];
      }, person) ?? ""
    );
  }

  renderScriptEditorPersonTabList() {
    return `
      <div class="c-script-editor-person-editor__tabs" role="tablist" aria-label="人物详情分栏">
        ${this.renderScriptEditorPersonTabButton("profile", "属性")}
        ${this.renderScriptEditorPersonTabButton("attribute-group", "属性组")}
        ${this.renderScriptEditorPersonTabButton("dialogues", "对话")}
        ${this.renderScriptEditorPersonTabButton("menus", "菜单组")}
        ${this.renderScriptEditorPersonTabButton("trade", "交易")}
        ${this.renderScriptEditorPersonTabButton("events", "事件")}
      </div>
    `;
  }

  getScriptEditorEditablePersonAttributes(person) {
    return readScriptEditorPersonTypedAttributes(person);
  }

  getScriptEditorPersonAttributeGroups(person) {
    return Object.entries(person.attributeGroup ?? {}).sort(
      ([, left], [, right]) => (left?.order ?? 0) - (right?.order ?? 0)
    );
  }

  getScriptEditorPersonAttributeGroupPaginationState(groups) {
    const totalPages = Math.max(1, Math.ceil(groups.length / 3));
    const currentPage = Math.min(
      Math.max(this.scriptEditorPersonAttributeGroupPage, 1),
      totalPages
    );

    if (this.scriptEditorPersonAttributeGroupPage !== currentPage) {
      this.scriptEditorPersonAttributeGroupPage = currentPage;
    }

    const startIndex = (currentPage - 1) * 3;
    return {
      currentPage,
      totalPages,
      visibleEntries: groups.slice(startIndex, startIndex + 3),
    };
  }

  getScriptEditorPersonAttributeGroupItemPaginationState(groupId, items) {
    const totalPages = Math.max(1, Math.ceil(items.length / 10));
    const rawPage = this.scriptEditorPersonAttributeGroupItemPageById[groupId] ?? 1;
    const currentPage = Math.min(Math.max(rawPage, 1), totalPages);

    if (rawPage !== currentPage) {
      this.scriptEditorPersonAttributeGroupItemPageById = {
        ...this.scriptEditorPersonAttributeGroupItemPageById,
        [groupId]: currentPage,
      };
    }

    const startIndex = (currentPage - 1) * 10;
    return {
      currentPage,
      totalPages,
      visibleEntries: items.slice(startIndex, startIndex + 10),
    };
  }

  getScriptEditorPersonAttributeGroupEntries(attributes, group) {
    const attributeByKey = new Map(
      attributes.map((attribute) => [attribute.key, attribute])
    );
    return (group.attributeKeys ?? [])
      .map((attributeKey) => attributeByKey.get(attributeKey) ?? null)
      .filter((attribute) => attribute != null);
  }

  getScriptEditorPersonAttributeGroupAvailableAttributes(attributes, group) {
    const selectedKeys = new Set(group.attributeKeys ?? []);
    return attributes.filter((attribute) => !selectedKeys.has(attribute.key));
  }

  renderScriptEditorPersonAttributeGroupPagination(currentPage, totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    return `
      <nav class="c-script-editor-record-pagination" aria-label="人物属性组分页">
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="person-attribute-group-page-prev"
          ${currentPage <= 1 ? "disabled" : ""}
        >
          上一页
        </button>
        <span class="c-script-editor-record-pagination__status">第 ${currentPage} / ${totalPages} 页</span>
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="person-attribute-group-page-next"
          ${currentPage >= totalPages ? "disabled" : ""}
        >
          下一页
        </button>
      </nav>
    `;
  }

  renderScriptEditorPersonAttributeGroupItemPagination(
    groupId,
    currentPage,
    totalPages
  ) {
    if (totalPages <= 1) {
      return "";
    }

    return `
      <nav class="c-script-editor-record-pagination c-script-editor-person-attribute-group__item-pagination" aria-label="人物属性组成员分页">
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="person-attribute-group-item-page-prev"
          data-script-editor-person-attribute-group-id="${groupId}"
          ${currentPage <= 1 ? "disabled" : ""}
        >
          上一页
        </button>
        <span class="c-script-editor-record-pagination__status">第 ${currentPage} / ${totalPages} 页</span>
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="person-attribute-group-item-page-next"
          data-script-editor-person-attribute-group-id="${groupId}"
          ${currentPage >= totalPages ? "disabled" : ""}
        >
          下一页
        </button>
      </nav>
    `;
  }

  renderScriptEditorLegacyPersonSummaryAttributes(person) {
    const entries = this.getScriptEditorEditablePersonAttributes(person);
    const { currentPage, totalPages, visibleEntries } =
      this.getScriptEditorPersonAttributePaginationState(entries);

    return `
      <section class="c-script-editor-person-summary" aria-label="已有属性">
        <header class="c-script-editor-person-summary__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">自定义属性</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-person-attribute">
            新增属性
          </button>
        </header>
        <div class="c-script-editor-person-summary__list">
          ${visibleEntries
            .map(
              ({ entry, index }) => `
                <article class="c-script-editor-person-summary__item">
                  <button
                    type="button"
                    class="c-script-editor-person-summary__remove"
                    data-script-editor-action="remove-person-attribute"
                    data-script-editor-person-attribute-index="${index}"
                    aria-label="删除属性"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.label ?? "")}"
                    placeholder="属性名"
                    data-script-editor-person-attribute-field="key-name"
                    data-script-editor-person-attribute-index="${index}"
                  />
                  <select
                    class="c-script-editor-form-field__input"
                    data-script-editor-person-attribute-field="type"
                    data-script-editor-person-attribute-index="${index}"
                  >
                    ${this.renderScriptEditorSelectOptions(
                      SCRIPT_EDITOR_PERSON_ATTRIBUTE_TYPE_OPTIONS,
                      entry.type ?? "string",
                      "选择类型"
                    )}
                  </select>
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.value ?? "")}"
                    placeholder="属性值"
                    data-script-editor-person-attribute-field="value"
                    data-script-editor-person-attribute-index="${index}"
                  />
                </article>
              `
            )
            .join("")}
        </div>
        ${this.renderScriptEditorPersonAttributePagination(currentPage, totalPages)}
      </section>
    `;
  }

  renderScriptEditorPersonAttributeGroupPanel(person) {
    const attributes = this.getScriptEditorEditablePersonAttributes(person);
    const groups = this.getScriptEditorPersonAttributeGroups(person);
    const { currentPage, totalPages, visibleEntries } =
      this.getScriptEditorPersonAttributeGroupPaginationState(groups);

    return `
      <section class="c-script-editor-person-panel" aria-label="属性组分栏">
        <div class="c-script-editor-person-attributes__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">属性组</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-person-attribute-group">
            新增属性组
          </button>
        </div>
        <div class="c-script-editor-person-attributes__list">
          ${groups
            .map(
              ([groupId, group]) => `
                <section class="c-script-editor-person-attributes__item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>组名</span>
                      <input
                        class="c-script-editor-form-field__input"
                        type="text"
                        value="${escapeHtml(group.title ?? "")}"
                        data-script-editor-person-attribute-group-id="${groupId}"
                        data-script-editor-person-attribute-group-field="title"
                      />
                    </label>
                    <div class="c-script-editor-form-field c-script-editor-form-field--wide">
                      <span>包含属性</span>
                      <div class="c-script-editor-person-attributes__list">
                        ${attributes
                          .map(
                            (attribute) => `
                              <label class="c-script-editor-person-editor__toggle">
                                <input
                                  type="checkbox"
                                  data-script-editor-person-attribute-group-id="${groupId}"
                                  data-script-editor-person-attribute-group-legacy-attribute-key="${attribute.key}"
                                  ${group.attributeKeys?.includes(attribute.key) ? "checked" : ""}
                                />
                                <span>${escapeHtml(attribute.label?.trim() || attribute.key)}</span>
                              </label>
                            `
                          )
                          .join("")}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="c-main-ui-json-text-button"
                    data-script-editor-action="remove-person-attribute-group"
                    data-script-editor-person-attribute-group-id="${groupId}"
                  >
                    删除属性组
                  </button>
                </section>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorPersonAttributeGroupPanel(person) {
    const attributes = this.getScriptEditorEditablePersonAttributes(person);
    const groups = this.getScriptEditorPersonAttributeGroups(person);
    const { currentPage, totalPages, visibleEntries } =
      this.getScriptEditorPersonAttributeGroupPaginationState(groups);

    return `
      <section class="c-script-editor-person-panel" aria-label="人物属性组">
        <div class="c-script-editor-person-attributes__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">属性组</h3>
          </div>
          <button
            type="button"
            class="c-main-ui-json-text-button"
            data-script-editor-action="add-person-attribute-group"
          >
            新增属性组
          </button>
        </div>
        <div class="c-script-editor-person-attributes__viewport">
          <div class="c-script-editor-person-attributes__list">
            ${visibleEntries.length === 0
              ? `
                <p class="c-script-editor-person-attribute-group__empty">
                  暂无属性组，可先创建一个分组。
                </p>
              `
              : visibleEntries
                  .map(([groupId, group]) => {
                    const groupAttributes =
                      this.getScriptEditorPersonAttributeGroupEntries(
                        attributes,
                        group
                      );
                    const availableAttributes =
                      this.getScriptEditorPersonAttributeGroupAvailableAttributes(
                        attributes,
                        group
                      );
                    const itemPagination =
                      this.getScriptEditorPersonAttributeGroupItemPaginationState(
                        groupId,
                        groupAttributes
                      );
                    const pickerOpen =
                      this.scriptEditorPersonAttributeGroupOpenPickerId === groupId;

                    return `
                      <section class="c-script-editor-person-attribute-group__card">
                        <div class="c-script-editor-person-attribute-group__header">
                          <label class="c-script-editor-form-field">
                            <span>组名</span>
                            <input
                              class="c-script-editor-form-field__input"
                              type="text"
                              value="${escapeHtml(group.title ?? "")}"
                              data-script-editor-person-attribute-group-id="${groupId}"
                              data-script-editor-person-attribute-group-field="title"
                            />
                          </label>
                          <div class="c-script-editor-person-attribute-group__actions">
                            <button
                              type="button"
                              class="c-main-ui-json-text-button"
                              data-script-editor-action="open-person-attribute-group-picker"
                              data-script-editor-person-attribute-group-id="${groupId}"
                            >
                              ${pickerOpen ? "收起属性" : "添加属性"}
                            </button>
                            <button
                              type="button"
                              class="c-main-ui-json-text-button"
                              data-script-editor-action="remove-person-attribute-group"
                              data-script-editor-person-attribute-group-id="${groupId}"
                            >
                              删除属性组
                            </button>
                          </div>
                        </div>
                        ${pickerOpen
                          ? `
                            <div class="c-script-editor-person-attribute-group__picker">
                              ${availableAttributes.length === 0
                                ? `
                                  <p class="c-script-editor-person-attribute-group__picker-empty">
                                    无可添加属性
                                  </p>
                                `
                                : availableAttributes
                                    .map(
                                      (attribute) => `
                                        <button
                                          type="button"
                                          class="c-script-editor-person-attribute-group__picker-item"
                                          data-script-editor-action="add-person-attribute-group-item"
                                          data-script-editor-person-attribute-group-id="${groupId}"
                                          data-script-editor-person-attribute-key="${attribute.key}"
                                        >
                                          ${escapeHtml(
                                            attribute.label?.trim() || attribute.key
                                          )}
                                        </button>
                                      `
                                    )
                                    .join("")}
                            </div>
                          `
                          : ""}
                        <div class="c-script-editor-person-attribute-group__items-viewport">
                          <div class="c-script-editor-person-attribute-group__items">
                            ${itemPagination.visibleEntries.length === 0
                              ? `
                                <p class="c-script-editor-person-attribute-group__items-empty">
                                  当前属性组还没有属性。
                                </p>
                              `
                              : itemPagination.visibleEntries
                                  .map(
                                    (attribute) => `
                                      <article class="c-script-editor-person-attribute-group__item-card">
                                        <button
                                          type="button"
                                          class="c-script-editor-person-summary__remove"
                                          data-script-editor-action="remove-person-attribute-group-item"
                                          data-script-editor-person-attribute-group-id="${groupId}"
                                          data-script-editor-person-attribute-key="${attribute.key}"
                                          aria-label="移出属性组"
                                        >
                                          <span aria-hidden="true">×</span>
                                        </button>
                                        <div class="c-script-editor-person-attribute-group__item-name">
                                          ${escapeHtml(
                                            attribute.label?.trim() || attribute.key
                                          )}
                                        </div>
                                      </article>
                                    `
                                  )
                                  .join("")}
                          </div>
                        </div>
                        ${this.renderScriptEditorPersonAttributeGroupItemPagination(
                          groupId,
                          itemPagination.currentPage,
                          itemPagination.totalPages
                        )}
                      </section>
                    `;
                  })
                  .join("")}
          </div>
        </div>
        ${this.renderScriptEditorPersonAttributeGroupPagination(
          currentPage,
          totalPages
        )}
      </section>
    `;
  }

  renderScriptEditorPersonTabPanel(person) {
    if (this.scriptEditorPersonTab === "attribute-group") {
      return this.renderScriptEditorPersonAttributeGroupPanel(person);
    }

    if (this.scriptEditorPersonTab === "dialogues") {
      return this.renderScriptEditorPersonRelationPanel(
        "对话分栏",
        "该分栏只负责组织人物与对话的关联入口，不负责完整对话内容编辑。",
        "dialogueIds",
        person.dialogueIds ?? [],
        "add-person-dialogue-link",
        "remove-person-dialogue-link"
      );
    }

    if (this.scriptEditorPersonTab === "menus") {
      return this.renderScriptEditorOwnerMenuMountPanel(
        "people",
        person.id,
        "人物菜单组",
        "这里只挂接人物可用的菜单项；具体功能绑定与下级菜单跳转统一在“菜单”模块维护。"
      );
    }

    if (this.scriptEditorPersonTab === "trade") {
      return `
        <section class="c-script-editor-person-panel" aria-label="交易分栏">
          <p class="c-script-editor-editor-card__hint">
            交易分栏只声明人物是否具备交易能力以及绑定哪个入口，不负责商店库存或价格体系。
          </p>
          <label class="c-script-editor-person-editor__toggle">
            <input
              type="checkbox"
              data-script-editor-person-trade-enabled
              ${person.tradeBinding?.enabled ? "checked" : ""}
            />
            <span>启用交易入口</span>
          </label>
          <label class="c-script-editor-form-field">
            <span>交易入口 ID</span>
            <select
              class="c-script-editor-form-field__input"
              data-script-editor-person-field="tradeBinding.entryId"
            >
              ${this.renderScriptEditorSelectOptions(
                this.createScriptEditorTradeBindingReferenceOptions(),
                person.tradeBinding?.entryId ?? "",
                "未选择交易入口"
              )}
            </select>
          </label>
        </section>
      `;
    }

    if (this.scriptEditorPersonTab === "events") {
      return `
        ${this.renderScriptEditorPersonRelationPanel(
          "事件分栏",
          "该分栏保留人物相关事件引用；真实触发配置请使用下方事件绑定。",
          "eventIds",
          person.eventIds ?? [],
          "add-person-event-link",
          "remove-person-event-link"
        )}
        ${this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "person", ownerId: person.id })}
      `;
    }

    const cityOptions = this.getScriptEditorPersonCityOptions();
    const houseOptions = this.getScriptEditorPersonHouseOptions(person.cityId ?? "");
    const portraitOptions = this.getScriptEditorPersonPortraitOptions();
    const portraitVariantOptions =
      this.getScriptEditorPersonPortraitVariantOptions(person);

    return `
      <section class="c-script-editor-person-panel" aria-label="属性分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>人物名称</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.name)}" data-script-editor-person-field="name" />
          </label>
          <label class="c-script-editor-form-field">
            <span>人物类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="personType">
              <option value="角色" ${person.personType === "角色" ? "selected" : ""}>角色</option>
              <option value="NPC" ${person.personType !== "角色" ? "selected" : ""}>NPC</option>
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>正式身份</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.title ?? "")}" data-script-editor-person-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>职业/定位</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.occupation ?? "")}" data-script-editor-person-field="occupation" />
          </label>
          <label class="c-script-editor-form-field">
            <span>所属城市</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="cityId">
              ${this.renderScriptEditorSelectOptions(cityOptions, person.cityId ?? "", "未设置所属城市")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>所属建筑</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="houseId">
              ${this.renderScriptEditorSelectOptions(houseOptions, person.houseId ?? "", "未设置所属建筑")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>立绘 ID</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="portraitId">
              ${this.renderScriptEditorSelectOptions(portraitOptions, person.portraitId ?? "", "未设置立绘")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>立绘变体</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="portraitVariantId">
              ${this.renderScriptEditorSelectOptions(portraitVariantOptions, person.portraitVariantId ?? "", "未设置立绘变体")}
            </select>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>人物简介</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-person-field="biography" spellcheck="false">${escapeHtml(person.biography ?? "")}</textarea>
          </label>
        </div>
      </section>
      ${this.renderScriptEditorLegacyPersonSummaryAttributes(person)}
    `;
  }

  renderScriptEditorPersonRelationPanel(title, hint, family, entries, addAction, removeAction) {
    return `
      <section class="c-script-editor-person-panel" aria-label="${title}">
        <div class="c-script-editor-person-attributes__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">${title}</p>
            <h3 class="c-script-editor-editor-card__title">${title}</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${addAction}">
            新增关联
          </button>
        </div>
        <p class="c-script-editor-editor-card__hint">${hint}</p>
        <div class="c-script-editor-person-attributes__list">
          ${entries
            .map(
              (entry, index) => `
                <div class="c-script-editor-person-attributes__item">
                  ${
                    family === "dialogueIds"
                      ? this.renderScriptEditorPersonRelationSelect({
                          family,
                          index,
                          value: entry,
                          emptyLabel: "未选择对话",
                          options: this.createScriptEditorDialogueReferenceOptions(),
                        })
                      : family === "eventIds"
                        ? this.renderScriptEditorPersonRelationSelect({
                            family,
                            index,
                            value: entry,
                            emptyLabel: "未选择事件",
                            options: this.createScriptEditorEventReferenceOptions(),
                          })
                      : `<input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry)}" placeholder="event.id" data-script-editor-person-relation-family="${family}" data-script-editor-person-relation-index="${index}" />`
                  }
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${removeAction}" data-script-editor-person-relation-index="${index}">
                    删除
                  </button>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorPersonRelationSelect({
    family,
    index,
    value,
    emptyLabel,
    options,
  }) {
    const currentValue = value ?? "";
    const hasCurrentOption =
      currentValue.length === 0 || options.some((option) => option.value === currentValue);

    return `
      <select
        class="c-script-editor-form-field__input"
        data-script-editor-person-relation-family="${escapeHtml(family)}"
        data-script-editor-person-relation-index="${index}"
      >
        <option value="" ${currentValue.length === 0 ? "selected" : ""}>${escapeHtml(emptyLabel)}</option>
        ${
          hasCurrentOption
            ? ""
            : `<option value="${escapeHtml(currentValue)}" selected>${escapeHtml(currentValue)}（未收录）</option>`
        }
        ${options
          .map(
            (option) => `
              <option value="${escapeHtml(option.value)}" ${currentValue === option.value ? "selected" : ""}>
                ${escapeHtml(option.label)}
              </option>
            `
          )
          .join("")}
      </select>
    `;
  }

  renderScriptEditorPortraitEditor(records, selectedRecord) {
    const portrait =
      selectedRecord == null ? null : normalizeScriptEditorPortraitRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("portraits", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--people">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "portraits",
            records: filteredRecords,
            ariaLabel: "立绘资源列表",
            modifierClass: "c-script-editor-record-list--people",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("portraits", "搜索立绘资源", "按资源标签或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增立绘资源
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${portrait == null ? "disabled" : ""}
                >
                  删除当前资源
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorPortraitRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--person ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${record.id}"
                >
                  <strong>${escapeHtml(normalizedRecord.label || normalizedRecord.id)}</strong>
                  <span>${escapeHtml(normalizedRecord.id)}</span>
                </button>
              `;
            },
          })}
          <section class="c-script-editor-person-panel" aria-label="立绘资源编辑器">
            ${
              portrait == null
                ? `<p class="c-script-editor-editor-card__hint">当前还没有立绘资源，请先新增资源记录。</p>`
                : `
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>资源 ID</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(portrait.id)}" data-script-editor-portrait-field="id" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>资源标签</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(portrait.label ?? "")}" data-script-editor-portrait-field="label" />
                    </label>
                    <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                      <span>立绘资源键</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(portrait.portraitImage ?? "")}" data-script-editor-portrait-field="portraitImage" placeholder="builtin:npc/xuda.png" />
                    </label>
                    <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                      <span>头像资源键</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(portrait.avatarImage ?? "")}" data-script-editor-portrait-field="avatarImage" placeholder="builtin:npc/xuda(touxiang).png" />
                    </label>
                  </div>
                `
            }
          </section>
        </div>
      </div>
    `;
  }

  renderScriptEditorPortraitVariantEditor(records, selectedRecord) {
    const variant =
      selectedRecord == null
        ? null
        : normalizeScriptEditorPortraitVariantRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("portraitVariants", records);
    const portraitOptions = this.getScriptEditorPersonPortraitOptions();

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--people">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "portraitVariants",
            records: filteredRecords,
            ariaLabel: "立绘变体列表",
            modifierClass: "c-script-editor-record-list--people",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("portraitVariants", "搜索立绘变体", "按变体标签或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增立绘变体
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${variant == null ? "disabled" : ""}
                >
                  删除当前变体
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorPortraitVariantRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--person ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${record.id}"
                >
                  <strong>${escapeHtml(normalizedRecord.label || normalizedRecord.id)}</strong>
                  <span>${escapeHtml(normalizedRecord.id)}</span>
                </button>
              `;
            },
          })}
          <section class="c-script-editor-person-panel" aria-label="立绘变体编辑器">
            ${
              variant == null
                ? `<p class="c-script-editor-editor-card__hint">当前还没有立绘变体，请先新增变体记录。</p>`
                : `
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>变体 ID</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(variant.id)}" data-script-editor-portrait-variant-field="id" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>变体标签</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(variant.label ?? "")}" data-script-editor-portrait-variant-field="label" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>所属立绘</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-portrait-variant-field="parentPortraitId">
                        ${this.renderScriptEditorSelectOptions(portraitOptions, variant.parentPortraitId ?? "", "未设置所属立绘")}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>目标资源</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-portrait-variant-field="portraitId">
                        ${this.renderScriptEditorSelectOptions(portraitOptions, variant.portraitId ?? "", "未设置目标资源")}
                      </select>
                    </label>
                  </div>
                `
            }
          </section>
        </div>
      </div>
    `;
  }

  renderScriptEditorLocationEditor(family, records, selectedRecord) {
    const isCityFamily = family === "cities";
    const filteredRecords = this.filterScriptEditorRecords(family, records);
    const location = selectedRecord == null
      ? null
      : isCityFamily
        ? normalizeScriptEditorCityRecord(selectedRecord)
        : normalizeScriptEditorBuildingRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--location">
          ${this.renderScriptEditorPaginatedRecordList({
            family,
            records: filteredRecords,
            ariaLabel: isCityFamily ? "城市列表" : "建筑列表",
            modifierClass: "c-script-editor-record-list--location",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch(
                  family,
                  isCityFamily ? "搜索城市" : "搜索建筑",
                  isCityFamily ? "按城市名称或 ID 搜索" : "按建筑名称或 ID 搜索"
                )}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  ${isCityFamily ? "新增城市" : "新增建筑"}
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${location == null ? "disabled" : ""}
                >
                  ${isCityFamily ? "删除城市" : "删除建筑"}
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = isCityFamily
                ? normalizeScriptEditorCityRecord(record)
                : normalizeScriptEditorBuildingRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--location ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.name)}</strong>
                  <span class="c-script-editor-record-list__summary ${isCityFamily ? "is-hidden" : ""}">${escapeHtml(this.describeScriptEditorLocationListSummary(family, normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-location-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              location == null
                ? `
                  <p class="c-script-editor-editor-card__hint">
                    请选择一个${isCityFamily ? "城市" : "建筑"}后继续编辑。该作者面只负责容器、菜单、进入态与入口挂接，不在这里展开正式剧情、对话或事件编辑项。
                  </p>
                `
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-location-editor__tabs" role="tablist" aria-label="${isCityFamily ? "城市详情分栏" : "建筑详情分栏"}">
                      ${this.renderScriptEditorLocationTabButton("profile", "基础")}
                      ${
                        !isCityFamily
                          ? ""
                          : this.renderScriptEditorLocationTabButton("mounted", "挂载")
                      }
                      ${
                        !isCityFamily
                          ? ""
                          : this.renderScriptEditorLocationTabButton("arrangements", "建筑编排")
                      }
                      ${this.renderScriptEditorLocationTabButton("menus", "菜单组")}
                      ${this.renderScriptEditorLocationTabButton("access", "进入条件")}
                      ${this.renderScriptEditorLocationTabButton("events", "事件")}
                      ${
                        isCityFamily
                          ? ""
                          : this.renderScriptEditorLocationTabButton("entry", "入口")
                      }
                    </div>
                  </template>
                  ${this.renderScriptEditorLocationTabPanel(family, location)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorLocationTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-location-editor__tab ${this.scriptEditorLocationTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-location-tab"
        data-script-editor-location-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorLocationTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorLocationTabPanel(family, location) {
    if (this.scriptEditorLocationTab === "mounted" && family === "cities") {
      return this.renderScriptEditorLocationMountedContent(location);
    }

    if (this.scriptEditorLocationTab === "arrangements" && family === "cities") {
      return this.renderScriptEditorBuildingArrangementPanel(location);
    }

    if (this.scriptEditorLocationTab === "menus") {
      return this.renderScriptEditorLocationMenuPanel(family, location);
    }

    if (this.scriptEditorLocationTab === "access") {
      return this.renderScriptEditorLocationAccessPanel(location);
    }

    if (this.scriptEditorLocationTab === "entry" && family === "buildings") {
      return this.renderScriptEditorBuildingEntryPanel(location);
    }

    if (this.scriptEditorLocationTab === "events") {
      return family === "cities"
        ? this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "city", ownerId: location.id })
        : this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "building", ownerId: location.id });
    }

    return this.renderScriptEditorLocationProfilePanel(family, location);
  }

  renderScriptEditorLocationProfilePanel(family, location) {
    const isCityFamily = family === "cities";
    const backgroundOptions = isCityFamily
      ? CITY_DEFAULT_BACKGROUND_OPTIONS
      : BUILDING_DEFAULT_BACKGROUND_OPTIONS;
    const mapPlacement =
      isCityFamily && location.mapPlacement != null && typeof location.mapPlacement === "object"
        ? location.mapPlacement
        : null;
    return `
      <section class="c-script-editor-location-panel" aria-label="${isCityFamily ? "城市基础分栏" : "建筑基础分栏"}">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>${isCityFamily ? "城市名称" : "建筑名称"}</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(location.name ?? "")}" data-script-editor-location-field="name" />
          </label>
          <label class="c-script-editor-form-field">
            <span>默认背景</span>
            <select class="c-script-editor-form-field__input" data-script-editor-location-field="backgroundId">
              ${backgroundOptions
                .map(
                  (option) => `
                    <option value="${escapeHtml(option.value)}" ${option.value === (location.backgroundId ?? "") ? "selected" : ""}>
                      ${escapeHtml(option.label)}
                    </option>
                  `
                )
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>${isCityFamily ? "城市说明" : "建筑说明"}</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-location-field="description" spellcheck="false">${escapeHtml(location.description ?? "")}</textarea>
          </label>
          ${
            !isCityFamily
              ? ""
              : `
                <label class="c-script-editor-form-field">
                  <span>位置标签</span>
                  <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(mapPlacement?.label ?? location.name ?? "")}" data-script-editor-location-field="mapPlacement.label" />
                </label>
                <label class="c-script-editor-form-field">
                  <span>位置 X</span>
                  <input class="c-script-editor-form-field__input" type="number" step="any" value="${escapeHtml(String(mapPlacement?.x ?? 0))}" data-script-editor-location-field="mapPlacement.x" />
                </label>
                <label class="c-script-editor-form-field">
                  <span>位置 Y</span>
                  <input class="c-script-editor-form-field__input" type="number" step="any" value="${escapeHtml(String(mapPlacement?.y ?? 0))}" data-script-editor-location-field="mapPlacement.y" />
                </label>
                <label class="c-script-editor-form-field">
                  <span>位置类型</span>
                  <select class="c-script-editor-form-field__input" data-script-editor-location-field="mapPlacement.placementMode">
                    ${this.renderScriptEditorSelectOptions(
                      [
                        { value: "coordinate", label: "坐标" },
                        { value: "grid-index", label: "格子索引" },
                      ],
                      mapPlacement?.placementMode === "grid-index" ? "grid-index" : "coordinate",
                      "坐标"
                    )}
                  </select>
                </label>
                <label class="c-script-editor-form-field">
                  <span>位置索引</span>
                  <input class="c-script-editor-form-field__input" type="number" step="1" value="${escapeHtml(String(mapPlacement?.gridIndex ?? 0))}" data-script-editor-location-field="mapPlacement.gridIndex" />
                </label>
              `
          }
        </div>
        ${isCityFamily ? "" : this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          isCityFamily
            ? "城市内部标识默认折叠，主视图只保留创作描述。"
            : "建筑内部标识与所属城市标识默认折叠，主视图优先展示创作描述。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>${isCityFamily ? "城市 ID" : "建筑 ID"}</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(location.id)}" data-script-editor-location-field="id" />
              </label>
              ${
                isCityFamily
                  ? ""
                  : `
                    <label class="c-script-editor-form-field">
                      <span>所属城市</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-location-field="cityId">
                        ${this.renderScriptEditorSelectOptions(
                          this.getScriptEditorProjectRecordOptions("cities"),
                          location.cityId ?? "",
                          "未选择所属城市"
                        )}
                      </select>
                    </label>
                  `
              }
            </div>
          `
        )}
        ${this.renderScriptEditorLocationCustomAttributes(location)}
      </section>
    `;
  }

  renderScriptEditorBuildingArrangementPanel(city) {
    const project = this.scriptEditorProject;
    if (project == null) {
      return "";
    }
    return this.renderScriptEditorCityBuildingArrangementPlanner(city, project);
    const arrangements = listScriptEditorCityBuildingArrangements(project, city.id);
    const buildingOptions = (project.buildings ?? []).map((building) =>
      normalizeScriptEditorBuildingRecord(building)
    );
    const npcOptions = (project.people ?? [])
      .map((person) => normalizeScriptEditorPersonRecord(person))
      .filter((person) => person.personType !== "瑙掕壊");
    const renderBuildingOptions = (selectedBuildingId) => `
      <option value="">未选择建筑</option>
      ${buildingOptions
        .map(
          (building) => `
            <option value="${escapeHtml(building.id)}" ${building.id === selectedBuildingId ? "selected" : ""}>
              ${escapeHtml(building.name)} (${escapeHtml(building.id)})
            </option>
          `
        )
        .join("")}
    `;
    const renderNpcOptions = (selectedNpcId, allowEmpty = true, allowedNpcIds = null) => `
      ${allowEmpty ? `<option value="">未选择人物</option>` : ""}
      ${npcOptions
        .filter((person) => allowedNpcIds == null || allowedNpcIds.includes(person.id))
        .map(
          (person) => `
            <option value="${escapeHtml(person.id)}" ${person.id === selectedNpcId ? "selected" : ""}>
              ${escapeHtml(person.name)} (${escapeHtml(person.id)})
            </option>
          `
        )
        .join("")}
    `;
    const renderContainerTypeOptions = (selectedType) =>
      SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES.map(
        (type) => `
          <option value="${escapeHtml(type)}" ${type === selectedType ? "selected" : ""}>${escapeHtml(type)}</option>
        `
      ).join("");
    const renderLayoutTemplateOptions = (selectedTemplateId) =>
      SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS.map(
        (templateId) => `
          <option value="${escapeHtml(templateId)}" ${templateId === selectedTemplateId ? "selected" : ""}>${escapeHtml(templateId)}</option>
        `
      ).join("");
    const renderOptionalContainerTypeOptions = (selectedType = "") => `
      <option value="">自动</option>
      ${renderContainerTypeOptions(selectedType)}
    `;
    const renderLayoutNodeKindOptions = (selectedKind) =>
      SCRIPT_EDITOR_BUILDING_LAYOUT_NODE_KINDS.map(
        (kind) => `
          <option value="${escapeHtml(kind)}" ${kind === selectedKind ? "selected" : ""}>${escapeHtml(kind)}</option>
        `
      ).join("");
    const renderLayoutCharacterFilterOptions = (selectedFilter = "") => `
      <option value="">未设置</option>
      ${SCRIPT_EDITOR_BUILDING_LAYOUT_CHARACTER_FILTERS.map(
        (filter) => `
          <option value="${escapeHtml(filter)}" ${filter === selectedFilter ? "selected" : ""}>${escapeHtml(filter)}</option>
        `
      ).join("")}
    `;
    const renderLayoutActionFilterOptions = (selectedFilter = "") => `
      <option value="">未设置</option>
      ${SCRIPT_EDITOR_BUILDING_LAYOUT_ACTION_FILTERS.map(
        (filter) => `
          <option value="${escapeHtml(filter)}" ${filter === selectedFilter ? "selected" : ""}>${escapeHtml(filter)}</option>
        `
      ).join("")}
    `;

    return `
      <section class="c-script-editor-location-attributes" aria-label="城市建筑编排">
        <header class="c-script-editor-location-menu__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">建筑编排</h3>
            <p class="c-script-editor-editor-card__hint">
              这里只定义建筑内部布局、容器和动作，不会自动把建筑加入城市地点列表。城市地点入口由“挂载”分栏负责。
            </p>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-arrangement">
            新增编排
          </button>
        </header>
        <div class="c-script-editor-location-menu__list">
          ${arrangements
            .map(
              (arrangement) => `
                <article class="c-script-editor-location-menu__item" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>编排 ID</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(arrangement.id)}" data-script-editor-building-arrangement-field="id" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>建筑</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-building-arrangement-field="buildingId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                        ${renderBuildingOptions(arrangement.buildingId)}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>显示名称</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(arrangement.displayName ?? "")}" data-script-editor-building-arrangement-field="displayName" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>主人物</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-building-arrangement-primary-npc data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                        ${renderNpcOptions(arrangement.primaryNpcId ?? "", true, arrangement.mountedNpcIds)}
                      </select>
                    </label>
                  </div>
                  <div class="c-script-editor-location-menu__list">
                    ${arrangement.mountedNpcIds
                      .map(
                        (npcId, npcIndex) => `
                          <div class="c-script-editor-form-grid">
                            <label class="c-script-editor-form-field">
                              <span>挂载人物</span>
                              <select class="c-script-editor-form-field__input" data-script-editor-building-arrangement-npc data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-arrangement-npc-index="${npcIndex}">
                                ${renderNpcOptions(npcId)}
                              </select>
                            </label>
                            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-arrangement-npc" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-arrangement-npc-index="${npcIndex}">
                              删除人物
                            </button>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                  <div class="c-script-editor-location-menu__toggles">
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-arrangement-npc" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                      新增人物
                    </button>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-layout-node" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                      新增布局节点
                    </button>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-arrangement-container" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                      新增容器
                    </button>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-arrangement" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                      删除编排
                    </button>
                  </div>
                  ${(() => {
                    const layout = readArrangementLayout(arrangement);
                    return `
                      <article class="c-script-editor-location-menu__item">
                        <header class="c-script-editor-location-menu__header">
                          <div>
                            <h4 class="c-script-editor-editor-card__title">布局</h4>
                          </div>
                        </header>
                        <div class="c-script-editor-form-grid">
                          <label class="c-script-editor-form-field">
                            <span>模板</span>
                            <select class="c-script-editor-form-field__input" data-script-editor-building-layout-field="templateId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                              ${renderLayoutTemplateOptions(layout.templateId)}
                            </select>
                          </label>
                          <label class="c-script-editor-form-field">
                            <span>外壳类名</span>
                            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml((layout.shellClassNames ?? []).join(", "))}" data-script-editor-building-layout-field="shellClassNames" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" />
                          </label>
                        </div>
                        <div class="c-script-editor-location-menu__list">
                          ${(layout.nodes ?? [])
                            .map(
                              (node, nodeIndex) => `
                                <article class="c-script-editor-location-menu__item">
                                  <div class="c-script-editor-form-grid">
                                    <label class="c-script-editor-form-field">
                                      <span>节点 ID</span>
                                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.id)}" data-script-editor-building-layout-node-field="id" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>节点类型</span>
                                      <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="kind" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                                        ${renderLayoutNodeKindOptions(node.kind)}
                                      </select>
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>区域 ID</span>
                                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.regionId)}" data-script-editor-building-layout-node-field="regionId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>来源容器类型</span>
                                      <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="sourceContainerType" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                                        ${renderOptionalContainerTypeOptions(node.sourceContainerType ?? "")}
                                      </select>
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>来源容器 ID</span>
                                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.sourceContainerId ?? "")}" data-script-editor-building-layout-node-field="sourceContainerId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>表现标识</span>
                                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.presentation ?? "")}" data-script-editor-building-layout-node-field="presentation" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>人物过滤</span>
                                      <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="characterFilter" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                                        ${renderLayoutCharacterFilterOptions(node.characterFilter ?? "")}
                                      </select>
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>动作过滤</span>
                                      <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="actionFilter" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                                        ${renderLayoutActionFilterOptions(node.actionFilter ?? "")}
                                      </select>
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>点击动作 ID</span>
                                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.clickActionId ?? "")}" data-script-editor-building-layout-node-field="clickActionId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                  </div>
                                  <div class="c-script-editor-location-menu__toggles">
                                    <label class="c-script-editor-form-field">
                                      <span>预览可选中</span>
                                      <input type="checkbox" ${node.previewSelectable === true ? "checked" : ""} data-script-editor-building-layout-node-flag="previewSelectable" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>预览可拖拽</span>
                                      <input type="checkbox" ${node.previewDraggable === true ? "checked" : ""} data-script-editor-building-layout-node-flag="previewDraggable" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <label class="c-script-editor-form-field">
                                      <span>预览可放置</span>
                                      <input type="checkbox" ${node.previewDropTarget === true ? "checked" : ""} data-script-editor-building-layout-node-flag="previewDropTarget" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                                    </label>
                                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-layout-node" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                                      删除布局节点
                                    </button>
                                  </div>
                                </article>
                              `
                            )
                            .join("")}
                        </div>
                      </article>
                    `;
                  })()}
                  <div class="c-script-editor-location-menu__list">
                    ${arrangement.containers
                      .map(
                        (container, containerIndex) => `
                          <article class="c-script-editor-location-menu__item">
                            <div class="c-script-editor-form-grid">
                              <label class="c-script-editor-form-field">
                                <span>容器 ID</span>
                                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(container.id)}" data-script-editor-building-container-field="id" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}" />
                              </label>
                              <label class="c-script-editor-form-field">
                                <span>容器类型</span>
                                <select class="c-script-editor-form-field__input" data-script-editor-building-container-field="type" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}">
                                  ${renderContainerTypeOptions(container.type)}
                                </select>
                              </label>
                              <label class="c-script-editor-form-field">
                                <span>标题</span>
                                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(container.title ?? "")}" data-script-editor-building-container-field="title" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}" />
                              </label>
                            </div>
                            ${
                              container.type === "action-menu"
                                ? `
                                  <p class="c-script-editor-editor-card__hint">
                                    Action menus now come from menu resources and menu instances in the Menus tab. Arrangement editing only keeps the layout container shell.
                                  </p>
                                `
                                : ""
                            }
                            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-arrangement-container" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}">
                              删除容器
                            </button>
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorCityBuildingArrangementPlanner(city, project) {
    const arrangements = listScriptEditorCityBuildingArrangements(project, city.id);
    const mountedBuildings = city.mountedBuildings ?? [];
    const buildingById = new Map(
      (project.buildings ?? [])
        .map((building) => normalizeScriptEditorBuildingRecord(building))
        .map((building) => [building.id, building])
    );
    const mountedBuildingIds = new Set(
      mountedBuildings.map((mountedBuilding) => mountedBuilding.buildingId).filter(Boolean)
    );
    const renderContainerTypeOptions = (selectedType) =>
      SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES.map(
        (type) => `
          <option value="${escapeHtml(type)}" ${type === selectedType ? "selected" : ""}>${escapeHtml(type)}</option>
        `
      ).join("");
    const renderLayoutTemplateOptions = (selectedTemplateId) =>
      SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS.map(
        (templateId) => `
          <option value="${escapeHtml(templateId)}" ${templateId === selectedTemplateId ? "selected" : ""}>${escapeHtml(templateId)}</option>
        `
      ).join("");
    const renderOptionalContainerTypeOptions = (selectedType = "") => `
      <option value="">自动</option>
      ${renderContainerTypeOptions(selectedType)}
    `;
    const renderLayoutNodeKindOptions = (selectedKind) =>
      SCRIPT_EDITOR_BUILDING_LAYOUT_NODE_KINDS.map(
        (kind) => `
          <option value="${escapeHtml(kind)}" ${kind === selectedKind ? "selected" : ""}>${escapeHtml(kind)}</option>
        `
      ).join("");
    const renderLayoutCharacterFilterOptions = (selectedFilter = "") => `
      <option value="">未设置</option>
      ${SCRIPT_EDITOR_BUILDING_LAYOUT_CHARACTER_FILTERS.map(
        (filter) => `
          <option value="${escapeHtml(filter)}" ${filter === selectedFilter ? "selected" : ""}>${escapeHtml(filter)}</option>
        `
      ).join("")}
    `;
    const renderLayoutActionFilterOptions = (selectedFilter = "") => `
      <option value="">未设置</option>
      ${SCRIPT_EDITOR_BUILDING_LAYOUT_ACTION_FILTERS.map(
        (filter) => `
          <option value="${escapeHtml(filter)}" ${filter === selectedFilter ? "selected" : ""}>${escapeHtml(filter)}</option>
        `
      ).join("")}
    `;
    const renderArrangementEditor = (arrangement, building) => {
      const layout = readScriptEditorBuildingLayoutRecord(arrangement.layout);
      return `
        <article class="c-script-editor-location-menu__item c-script-editor-location-menu__item--arrangement" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
          <header class="c-script-editor-location-menu__header">
            <div>
              <h4 class="c-script-editor-editor-card__title">${escapeHtml(
                arrangement.displayName ?? building.name
              )}</h4>
              <p class="c-script-editor-editor-card__hint">
                这里只编排室内布局、容器和动作。建筑入口、挂载人物和主人物请回“挂载”分栏维护。
              </p>
            </div>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-arrangement" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
              删除编排
            </button>
          </header>
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>室内名称</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(arrangement.displayName ?? "")}" data-script-editor-building-arrangement-field="displayName" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" />
            </label>
            <label class="c-script-editor-form-field">
              <span>室内背景</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(arrangement.backgroundId ?? "")}" data-script-editor-building-arrangement-field="backgroundId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" />
            </label>
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>室内说明</span>
              <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-building-arrangement-field="description" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" spellcheck="false">${escapeHtml(arrangement.description ?? "")}</textarea>
            </label>
          </div>
          <article class="c-script-editor-location-menu__item c-script-editor-location-menu__item--nested">
            <header class="c-script-editor-location-menu__header">
              <div>
                <h5 class="c-script-editor-editor-card__title">布局</h5>
                <p class="c-script-editor-editor-card__hint">定义室内区域、节点和点击逻辑。</p>
              </div>
              <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-layout-node" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                新增布局节点
              </button>
            </header>
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>布局模板</span>
                <select class="c-script-editor-form-field__input" data-script-editor-building-layout-field="templateId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                  ${renderLayoutTemplateOptions(layout.templateId)}
                </select>
              </label>
              <label class="c-script-editor-form-field">
                <span>外壳类名</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml((layout.shellClassNames ?? []).join(", "))}" data-script-editor-building-layout-field="shellClassNames" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" />
              </label>
            </div>
            <div class="c-script-editor-location-menu__list">
              ${(layout.nodes ?? [])
                .map(
                  (node, nodeIndex) => `
                    <article class="c-script-editor-location-menu__item c-script-editor-location-menu__item--nested">
                      <div class="c-script-editor-form-grid">
                        <label class="c-script-editor-form-field">
                          <span>节点类型</span>
                          <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="kind" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                            ${renderLayoutNodeKindOptions(node.kind)}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>区域标识</span>
                          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.regionId)}" data-script-editor-building-layout-node-field="regionId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>来源容器类型</span>
                          <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="sourceContainerType" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                            ${renderOptionalContainerTypeOptions(node.sourceContainerType ?? "")}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>来源容器标识</span>
                          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.sourceContainerId ?? "")}" data-script-editor-building-layout-node-field="sourceContainerId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>表现标识</span>
                          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.presentation ?? "")}" data-script-editor-building-layout-node-field="presentation" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>人物过滤</span>
                          <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="characterFilter" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                            ${renderLayoutCharacterFilterOptions(node.characterFilter ?? "")}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>动作过滤</span>
                          <select class="c-script-editor-form-field__input" data-script-editor-building-layout-node-field="actionFilter" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                            ${renderLayoutActionFilterOptions(node.actionFilter ?? "")}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>点击动作标识</span>
                          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.clickActionId ?? "")}" data-script-editor-building-layout-node-field="clickActionId" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                      </div>
                      <div class="c-script-editor-location-menu__toggles">
                        <label class="c-script-editor-form-field">
                          <span>预览可选中</span>
                          <input type="checkbox" ${node.previewSelectable === true ? "checked" : ""} data-script-editor-building-layout-node-flag="previewSelectable" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>预览可拖拽</span>
                          <input type="checkbox" ${node.previewDraggable === true ? "checked" : ""} data-script-editor-building-layout-node-flag="previewDraggable" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>预览可放置</span>
                          <input type="checkbox" ${node.previewDropTarget === true ? "checked" : ""} data-script-editor-building-layout-node-flag="previewDropTarget" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}" />
                        </label>
                        <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-layout-node" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-layout-node-index="${nodeIndex}">
                          删除节点
                        </button>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </article>
          <article class="c-script-editor-location-menu__item c-script-editor-location-menu__item--nested">
            <header class="c-script-editor-location-menu__header">
              <div>
                <h5 class="c-script-editor-editor-card__title">容器与动作</h5>
                <p class="c-script-editor-editor-card__hint">定义人物席位、动作菜单和信息容器。</p>
              </div>
              <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-arrangement-container" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}">
                新增容器
              </button>
            </header>
            <div class="c-script-editor-location-menu__list">
              ${arrangement.containers
                .map(
                  (container, containerIndex) => `
                    <article class="c-script-editor-location-menu__item c-script-editor-location-menu__item--nested">
                      <div class="c-script-editor-form-grid">
                        <label class="c-script-editor-form-field">
                          <span>容器标识</span>
                          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(container.id)}" data-script-editor-building-container-field="id" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}" />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>容器类型</span>
                          <select class="c-script-editor-form-field__input" data-script-editor-building-container-field="type" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}">
                            ${renderContainerTypeOptions(container.type)}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>标题</span>
                          <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(container.title ?? "")}" data-script-editor-building-container-field="title" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}" />
                        </label>
                      </div>
                      ${
                        container.type === "action-menu"
                          ? `
                            <p class="c-script-editor-editor-card__hint">
                              Action menus now come from menu resources and menu instances in the Menus tab. Arrangement editing only keeps the layout container shell.
                            </p>
                          `
                          : ""
                      }
                      <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-building-arrangement-container" data-script-editor-building-arrangement-id="${escapeHtml(arrangement.id)}" data-script-editor-building-container-index="${containerIndex}">
                        删除容器
                      </button>
                    </article>
                  `
                )
                .join("")}
            </div>
          </article>
        </article>
      `;
    };
    const unmountedArrangements = arrangements.filter(
      (arrangement) => !mountedBuildingIds.has(arrangement.buildingId)
    );

    return `
      <section class="c-script-editor-location-attributes" aria-label="城市建筑编排">
        <header class="c-script-editor-location-menu__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">建筑编排</h3>
            <p class="c-script-editor-editor-card__hint">
              这里只编排已挂载建筑的室内内容。建筑入口、挂载人物和主人物统一在“挂载”分栏维护，这里不再重复配置。
            </p>
          </div>
        </header>
        <div class="c-script-editor-location-menu__list">
          ${
            mountedBuildings.length === 0
              ? `
                <article class="c-script-editor-location-menu__item">
                  <p class="c-script-editor-editor-card__hint">
                    请先到“挂载”分栏添加城市入口建筑，再回来编排室内内容。
                  </p>
                </article>
              `
              : mountedBuildings
                  .map((mountedBuilding) => {
                    const building = buildingById.get(mountedBuilding.buildingId) ?? null;
                    const buildingArrangements = arrangements.filter(
                      (arrangement) => arrangement.buildingId === mountedBuilding.buildingId
                    );
                    if (building == null) {
                      return `
                        <article class="c-script-editor-location-menu__item">
                          <header class="c-script-editor-location-menu__header">
                            <div>
                              <h4 class="c-script-editor-editor-card__title">挂载建筑数据无效</h4>
                              <p class="c-script-editor-editor-card__hint">
                                当前挂载记录指向的建筑已不存在，请先回“挂载”分栏清理。
                              </p>
                            </div>
                          </header>
                        </article>
                      `;
                    }
                    return `
                      <article class="c-script-editor-location-menu__item c-script-editor-location-menu__item--arrangement-group">
                        <header class="c-script-editor-location-menu__header">
                          <div>
                            <h4 class="c-script-editor-editor-card__title">${escapeHtml(
                              building.name
                            )}</h4>
                            <p class="c-script-editor-editor-card__hint">
                              ${
                                buildingArrangements.length === 0
                                  ? "还没有室内编排，可以先新建一套。"
                                  : "当前建筑的室内编排如下。"
                              }
                            </p>
                          </div>
                          ${
                            buildingArrangements.length === 0
                              ? `
                                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-building-arrangement" data-script-editor-building-id="${escapeHtml(building.id)}">
                                  新建编排
                                </button>
                              `
                              : ""
                          }
                        </header>
                        ${
                          buildingArrangements.length === 0
                            ? ""
                            : `
                              <div class="c-script-editor-location-menu__list">
                                ${buildingArrangements
                                  .map((arrangement) =>
                                    renderArrangementEditor(arrangement, building)
                                  )
                                  .join("")}
                              </div>
                            `
                        }
                      </article>
                    `;
                  })
                  .join("")
          }
          ${
            unmountedArrangements.length === 0
              ? ""
              : `
                <article class="c-script-editor-location-menu__item">
                  <header class="c-script-editor-location-menu__header">
                    <div>
                      <h4 class="c-script-editor-editor-card__title">未挂载的旧编排</h4>
                      <p class="c-script-editor-editor-card__hint">
                        这些编排不会出现在进城后的地点列表里。若仍需使用，请先回“挂载”分栏把对应建筑挂到城市入口。
                      </p>
                    </div>
                  </header>
                  <div class="c-script-editor-location-menu__list">
                    ${unmountedArrangements
                      .map((arrangement) => {
                        const building =
                          buildingById.get(arrangement.buildingId) ??
                          {
                            id: arrangement.buildingId,
                            name: arrangement.displayName ?? arrangement.buildingId,
                          };
                        return renderArrangementEditor(arrangement, building);
                      })
                      .join("")}
                  </div>
                </article>
              `
          }
        </div>
      </section>
    `;
  }

  renderScriptEditorCityMountedBuildingsPanel(city) {
    const mountedBuildings = city.mountedBuildings ?? [];
    const buildingOptions = (this.scriptEditorProject?.buildings ?? []).map((building) =>
      normalizeScriptEditorBuildingRecord(building)
    );
    const npcOptions = (this.scriptEditorProject?.people ?? [])
      .map((person) => normalizeScriptEditorPersonRecord(person))
      .filter((person) => person.personType !== "角色");
    const renderBuildingOptions = (selectedBuildingId) => `
      <option value="">未选择建筑</option>
      ${buildingOptions
        .map(
          (building) => `
            <option value="${escapeHtml(building.id)}" ${building.id === selectedBuildingId ? "selected" : ""}>
              ${escapeHtml(building.name)} (${escapeHtml(building.id)})
            </option>
          `
        )
        .join("")}
    `;
    const renderNpcOptions = (selectedNpcId, allowEmpty = true, allowedNpcIds = null) => `
      ${allowEmpty ? `<option value="">未选择人物</option>` : ""}
      ${npcOptions
        .filter((person) => allowedNpcIds == null || allowedNpcIds.includes(person.id))
        .map(
          (person) => `
            <option value="${escapeHtml(person.id)}" ${person.id === selectedNpcId ? "selected" : ""}>
              ${escapeHtml(person.name)} (${escapeHtml(person.id)})
            </option>
          `
        )
        .join("")}
    `;

    return `
      <section class="c-script-editor-location-attributes" aria-label="城市挂载建筑与人物">
        <header class="c-script-editor-location-menu__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">挂载建筑与人物</h3>
            <p class="c-script-editor-editor-card__hint">
              这里决定城市地点列表会出现哪些建筑入口；仅添加建筑编排不会自动出现在进城后的地点选择里。
            </p>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-city-mounted-building">
            新增挂载建筑
          </button>
        </header>
        <div class="c-script-editor-location-menu__list">
          ${mountedBuildings
            .map(
              (entry, buildingIndex) => `
                <article class="c-script-editor-location-menu__item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>挂载建筑</span>
                      <select
                        class="c-script-editor-form-field__input"
                        data-script-editor-city-mounted-building
                        data-script-editor-city-mounted-building-index="${buildingIndex}"
                      >
                        ${renderBuildingOptions(entry.buildingId)}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>主 NPC</span>
                      <select
                        class="c-script-editor-form-field__input"
                        data-script-editor-city-primary-npc
                        data-script-editor-city-mounted-building-index="${buildingIndex}"
                      >
                        ${renderNpcOptions(entry.primaryNpcId ?? "", true, entry.npcIds)}
                      </select>
                    </label>
                  </div>
                  <div class="c-script-editor-location-menu__list">
                    ${entry.npcIds
                      .map(
                        (npcId, npcIndex) => `
                          <div class="c-script-editor-form-grid">
                            <label class="c-script-editor-form-field">
                              <span>挂载 NPC</span>
                              <select
                                class="c-script-editor-form-field__input"
                                data-script-editor-city-mounted-building-npc
                                data-script-editor-city-mounted-building-index="${buildingIndex}"
                                data-script-editor-city-mounted-building-npc-index="${npcIndex}"
                              >
                                ${renderNpcOptions(npcId)}
                              </select>
                            </label>
                            <button
                              type="button"
                              class="c-main-ui-json-text-button"
                              data-script-editor-action="remove-city-mounted-building-npc"
                              data-script-editor-city-mounted-building-index="${buildingIndex}"
                              data-script-editor-city-mounted-building-npc-index="${npcIndex}"
                            >
                              删除 NPC
                            </button>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                  <div class="c-script-editor-location-menu__toggles">
                    <button
                      type="button"
                      class="c-main-ui-json-text-button"
                      data-script-editor-action="add-city-mounted-building-npc"
                      data-script-editor-city-mounted-building-index="${buildingIndex}"
                    >
                      新增 NPC
                    </button>
                    <button
                      type="button"
                      class="c-main-ui-json-text-button"
                      data-script-editor-action="remove-city-mounted-building"
                      data-script-editor-city-mounted-building-index="${buildingIndex}"
                    >
                      删除挂载建筑
                    </button>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorLocationMountedContent(city) {
    const mountedBuildings = city.mountedBuildings ?? [];
    const {
      visibleEntries: visibleMountedBuildings,
      currentPage: currentBuildingPage,
      totalPages: totalBuildingPages,
      totalEntries: totalMountedBuildings,
    } = this.getScriptEditorCityMountedBuildingListPageState(city);
    const buildingOptions = (this.scriptEditorProject?.buildings ?? []).map((building) =>
      normalizeScriptEditorBuildingRecord(building)
    );
    const npcOptions = (this.scriptEditorProject?.people ?? [])
      .map((person) => normalizeScriptEditorPersonRecord(person))
      .filter((person) => person.personType !== "瑙掕壊");
    const npcOptionsById = new Map(npcOptions.map((person) => [person.id, person]));
    const renderBuildingOptions = (selectedBuildingId) => `
      <option value="">未选择建筑</option>
      ${buildingOptions
        .map(
          (building) => `
            <option value="${escapeHtml(building.id)}" ${building.id === selectedBuildingId ? "selected" : ""}>
              ${escapeHtml(building.name)}
            </option>
          `
        )
        .join("")}
    `;
    const renderNpcOptions = (selectedNpcId, allowEmpty = true, allowedNpcIds = null) => `
      ${allowEmpty ? `<option value="">未选择人物</option>` : ""}
      ${npcOptions
        .filter((person) => allowedNpcIds == null || allowedNpcIds.includes(person.id))
        .map(
          (person) => `
            <option value="${escapeHtml(person.id)}" ${person.id === selectedNpcId ? "selected" : ""}>
              ${escapeHtml(person.name)}
            </option>
          `
        )
        .join("")}
    `;
    const resolveNpcSummaryLabel = (npcId) => {
      if (npcId == null || npcId.length === 0) {
        return "未选择主 NPC";
      }

      const npc = npcOptionsById.get(npcId) ?? null;
      return npc == null ? npcId : npc.name;
    };
    const renderMountedNpcCard = (entry, buildingIndex, npcEntry) => `
      <article class="c-script-editor-city-mounted-building-npc-card">
        <button
          type="button"
          class="c-script-editor-person-summary__remove"
          aria-label="删除挂载 NPC"
          data-script-editor-action="remove-city-mounted-building-npc"
          data-script-editor-city-mounted-building-index="${buildingIndex}"
          data-script-editor-city-mounted-building-npc-index="${npcEntry.npcIndex}"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div class="c-script-editor-person-summary__field">
          <strong class="c-script-editor-person-summary__value">
            ${escapeHtml(resolveNpcSummaryLabel(npcEntry.npcId))}
          </strong>
        </div>
        <label class="c-script-editor-form-field">
          <select
            class="c-script-editor-form-field__input"
            aria-label="选择人物"
            data-script-editor-city-mounted-building-npc
            data-script-editor-city-mounted-building-index="${buildingIndex}"
            data-script-editor-city-mounted-building-npc-index="${npcEntry.npcIndex}"
          >
            ${renderNpcOptions(npcEntry.npcId)}
          </select>
        </label>
      </article>
    `;

    return `
      <section class="c-script-editor-location-attributes" aria-label="城市挂载建筑与人物">
        <header class="c-script-editor-location-menu__header">
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-city-mounted-building">
            新增挂载建筑
          </button>
        </header>
        <div class="c-script-editor-location-menu__list c-script-editor-city-mounted-building-list">
          ${visibleMountedBuildings
            .map(({ entry, buildingIndex }) => {
              const { uiState, filteredEntries, visibleEntries, currentPage, totalPages } =
                this.getScriptEditorCityMountedBuildingNpcPageState(entry, buildingIndex);

              return `
                <article
                  class="c-script-editor-location-menu__item c-script-editor-city-mounted-building-card${uiState.expanded ? " is-expanded" : ""}"
                  data-script-editor-city-mounted-building-panel
                >
                  <button
                    type="button"
                    class="c-script-editor-person-summary__remove c-script-editor-city-mounted-building-card__remove"
                    aria-label="删除挂载建筑"
                    data-script-editor-action="remove-city-mounted-building"
                    data-script-editor-city-mounted-building-index="${buildingIndex}"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <div class="c-script-editor-city-mounted-building-card__summary-wrap">
                    <div
                      class="c-script-editor-form-grid c-script-editor-city-mounted-building-card__summary"
                      data-script-editor-city-mounted-building-summary
                    >
                      <label class="c-script-editor-form-field">
                        <span>挂载建筑</span>
                        <select
                          class="c-script-editor-form-field__input"
                          data-script-editor-city-mounted-building
                          data-script-editor-city-mounted-building-index="${buildingIndex}"
                        >
                          ${renderBuildingOptions(entry.buildingId)}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>主 NPC</span>
                        <select
                          class="c-script-editor-form-field__input"
                          data-script-editor-city-primary-npc
                          data-script-editor-city-mounted-building-index="${buildingIndex}"
                        >
                          ${renderNpcOptions(entry.primaryNpcId ?? "", true, entry.npcIds)}
                        </select>
                      </label>
                    </div>
                    <button
                      type="button"
                      class="c-main-ui-json-text-button c-script-editor-city-mounted-building-card__toggle"
                      aria-expanded="${uiState.expanded ? "true" : "false"}"
                      data-script-editor-action="toggle-city-mounted-building-expanded"
                      data-script-editor-city-mounted-building-index="${buildingIndex}"
                    >
                      ${uiState.expanded ? "收起" : "展开"}
                    </button>
                  </div>
                  ${
                    uiState.expanded
                      ? `
                        <div class="c-script-editor-city-mounted-building-card__details">
                          <div class="c-script-editor-location-menu__header c-script-editor-city-mounted-building-card__toolbar">
                            <label class="c-script-editor-record-list__search c-script-editor-city-mounted-building-card__search">
                              <span>搜索建筑里的 NPC</span>
                              <input
                                class="c-script-editor-form-field__input"
                                type="search"
                                value="${escapeHtml(uiState.search)}"
                                placeholder="按 NPC 名称搜索"
                                data-script-editor-city-mounted-building-search
                                data-script-editor-city-mounted-building-index="${buildingIndex}"
                              />
                            </label>
                          </div>
                          ${
                            visibleEntries.length === 0
                              ? `
                                <p class="c-script-editor-record-list__empty">
                                  ${
                                    filteredEntries.length === 0 && uiState.search.trim().length > 0
                                      ? "没有命中的已挂载 NPC。"
                                      : "当前建筑还没有已挂载 NPC。"
                                  }
                                </p>
                              `
                              : `
                                <div class="c-script-editor-city-mounted-building-npc-grid">
                                  ${visibleEntries
                                    .map((npcEntry) =>
                                      renderMountedNpcCard(entry, buildingIndex, npcEntry)
                                    )
                                    .join("")}
                                </div>
                              `
                          }
                          <div class="c-script-editor-location-menu__toggles c-script-editor-city-mounted-building-card__actions">
                            <button
                              type="button"
                              class="c-main-ui-json-text-button"
                              data-script-editor-action="add-city-mounted-building-npc"
                              data-script-editor-city-mounted-building-index="${buildingIndex}"
                            >
                              新增 NPC
                            </button>
                          </div>
                          <nav class="c-script-editor-record-pagination" aria-label="挂载 NPC 分页">
                            <button
                              type="button"
                              class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
                              data-script-editor-action="city-mounted-building-page-prev"
                              data-script-editor-city-mounted-building-index="${buildingIndex}"
                              ${currentPage <= 1 ? "disabled" : ""}
                            >
                              ‹
                            </button>
                            <span class="c-script-editor-record-pagination__status">
                              第 ${currentPage} / ${totalPages} 页 · 共 ${filteredEntries.length} 个
                            </span>
                            <button
                              type="button"
                              class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
                              data-script-editor-action="city-mounted-building-page-next"
                              data-script-editor-city-mounted-building-index="${buildingIndex}"
                              ${currentPage >= totalPages ? "disabled" : ""}
                            >
                              ›
                            </button>
                          </nav>
                        </div>
                      `
                      : ""
                  }
                </article>
              `;
            })
            .join("")}
        </div>
        <nav class="c-script-editor-record-pagination" aria-label="挂载建筑分页">
          <button
            type="button"
            class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
            data-script-editor-action="city-mounted-building-list-page-prev"
            ${currentBuildingPage <= 1 ? "disabled" : ""}
          >
            ‹
          </button>
          <span class="c-script-editor-record-pagination__status">
            第 ${currentBuildingPage} / ${totalBuildingPages} 页 · 共 ${totalMountedBuildings} 个
          </span>
          <button
            type="button"
            class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
            data-script-editor-action="city-mounted-building-list-page-next"
            ${currentBuildingPage >= totalBuildingPages ? "disabled" : ""}
          >
            ›
          </button>
        </nav>
      </section>
    `;
  }

  renderScriptEditorLocationCustomAttributes(location) {
    const entries = location.extendedAttributes ?? [];
    return `
      <section class="c-script-editor-location-attributes" aria-label="自定义属性">
        <header class="c-script-editor-location-menu__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">自定义属性</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-location-attribute">
            新增属性
          </button>
        </header>
        <div class="c-script-editor-location-menu__list">
          ${entries
            .map(
              (entry, index) => `
                <article class="c-script-editor-location-menu__item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>属性键</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.key)}" data-script-editor-location-attribute-field="key" data-script-editor-location-attribute-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>属性名</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.label ?? "")}" data-script-editor-location-attribute-field="label" data-script-editor-location-attribute-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>属性类型</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-location-attribute-field="type" data-script-editor-location-attribute-index="${index}">
                        ${this.renderScriptEditorSelectOptions(
                          SCRIPT_EDITOR_PERSON_ATTRIBUTE_TYPE_OPTIONS,
                          entry.type ?? "string",
                          "鏂囨湰"
                        )}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                      <span>属性值</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(String(entry.value ?? ""))}" data-script-editor-location-attribute-field="value" data-script-editor-location-attribute-index="${index}" />
                    </label>
                    ${
                      entry.type === "enum"
                        ? `
                          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                            <span>鏋氫妇閫夐」</span>
                            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml((entry.options ?? []).join(", "))}" data-script-editor-location-attribute-field="options" data-script-editor-location-attribute-index="${index}" />
                          </label>
                        `
                        : ""
                    }
                  </div>
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-location-attribute" data-script-editor-location-attribute-index="${index}">
                    删除属性
                  </button>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorMenuModuleEditor(records, selectedRecord) {
    const menuRecord =
      selectedRecord == null
        ? null
        : listScriptEditorMenuModuleRecords(this.scriptEditorProject ?? {}).find(
            (record) => record.id === selectedRecord.id
          ) ?? null;
    const filteredRecords = this.filterScriptEditorRecords("menuResources", records);
    const menuEntry = menuRecord?.entries?.[0] ?? null;
    const targetFamily =
      menuEntry == null
        ? "event"
        : this.getScriptEditorMenuAuthoringTargetFamily(menuEntry);

    return `
      <div class="c-script-editor-editor-card">
        <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
        <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
        <div class="c-script-editor-record-layout">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "menuResources",
            records: filteredRecords,
            ariaLabel: "菜单项列表",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("menuResources", "搜索菜单项", "按菜单项名称搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增菜单项
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${menuRecord == null ? "disabled" : ""}
                >
                  删除菜单项
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord =
                listScriptEditorMenuModuleRecords(this.scriptEditorProject ?? {}).find(
                  (entry) => entry.id === record.id
                ) ?? record;
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title ?? "未命名菜单项")}</strong>
                  <span>单条菜单项</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-location-editor">
            ${
              menuRecord == null
                ? `
                  <p class="c-script-editor-editor-card__hint">
                    请选择一个菜单项后继续编辑。这里只维护菜单项名称和功能绑定，不展示内部标识。
                  </p>
                `
                : `
                  <section class="c-script-editor-location-panel" aria-label="菜单项">
                    <div class="c-script-editor-location-menu__header">
                      <div>
                        <h3 class="c-script-editor-editor-card__title">菜单项</h3>
                      </div>
                    </div>
                    <p class="c-script-editor-editor-card__hint">
                      菜单项本身不是事件。这里定义它跳转到事件还是下一级菜单；人物、城市、建筑里的“菜单组”只负责组合菜单项。
                    </p>
                    <article class="c-script-editor-location-menu__item">
                      <div class="c-script-editor-form-grid">
                        <label class="c-script-editor-form-field">
                          <span>菜单项名称</span>
                          <input
                            class="c-script-editor-form-field__input"
                            type="text"
                            value="${escapeHtml(menuRecord.title ?? "")}"
                            data-script-editor-location-menu-instance-field="title"
                            data-script-editor-location-menu-instance-id="${escapeHtml(menuRecord.id)}"
                          />
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>功能绑定</span>
                          <select
                            class="c-script-editor-form-field__input"
                            data-script-editor-location-menu-field="targetFamily"
                            data-script-editor-location-menu-index="0"
                            data-script-editor-location-menu-instance-id="${escapeHtml(menuRecord.id)}"
                          >
                            ${this.renderScriptEditorSelectOptions(
                              this.getScriptEditorLocationMenuTargetFamilyOptions(
                                targetFamily
                              ),
                              targetFamily,
                              "未设置功能绑定"
                            )}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field">
                          <span>目标</span>
                          <select
                            class="c-script-editor-form-field__input"
                            data-script-editor-location-menu-field="targetId"
                            data-script-editor-location-menu-index="0"
                            data-script-editor-location-menu-instance-id="${escapeHtml(menuRecord.id)}"
                          >
                            ${this.renderScriptEditorSelectOptions(
                              this.getScriptEditorLocationMenuTargetOptions(
                                targetFamily,
                                menuEntry?.targetId ?? "",
                                menuRecord.id
                              ),
                              menuEntry?.targetId ?? "",
                              "未选择目标"
                            )}
                          </select>
                        </label>
                        <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                          <span>不可用提示</span>
                          <input
                            class="c-script-editor-form-field__input"
                            type="text"
                            value="${escapeHtml(menuEntry?.disabledHint ?? "")}"
                            data-script-editor-location-menu-field="disabledHint"
                            data-script-editor-location-menu-index="0"
                            data-script-editor-location-menu-instance-id="${escapeHtml(menuRecord.id)}"
                          />
                        </label>
                      </div>
                      <div class="c-script-editor-location-menu__toggles">
                        <label class="c-script-editor-person-editor__toggle">
                          <input
                            type="checkbox"
                            data-script-editor-location-menu-flag="isVisible"
                            data-script-editor-location-menu-index="0"
                            data-script-editor-location-menu-instance-id="${escapeHtml(menuRecord.id)}"
                            ${menuEntry?.isVisible !== false ? "checked" : ""}
                          />
                          <span>显示</span>
                        </label>
                        <label class="c-script-editor-person-editor__toggle">
                          <input
                            type="checkbox"
                            data-script-editor-location-menu-flag="isEnabled"
                            data-script-editor-location-menu-index="0"
                            data-script-editor-location-menu-instance-id="${escapeHtml(menuRecord.id)}"
                            ${menuEntry?.isEnabled !== false ? "checked" : ""}
                          />
                          <span>可用</span>
                        </label>
                      </div>
                    </article>
                  </section>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorOwnerMenuMountPanel(ownerFamily, ownerId, title, hint) {
    if (this.scriptEditorProject == null) {
      return "";
    }

    const mountedMenus = listScriptEditorMountedMenus(
      this.scriptEditorProject,
      ownerFamily,
      ownerId
    );
    const mountOptions = this.getScriptEditorMenuInstanceOptions(
      "",
      mountedMenus.map((entry) => entry.instanceId)
    );

    return `
      <section
        class="c-script-editor-location-panel"
        aria-label="${escapeHtml(title)}"
        data-script-editor-owner-menu-panel
        data-script-editor-owner-family="${escapeHtml(ownerFamily)}"
        data-script-editor-owner-id="${escapeHtml(ownerId)}"
      >
        <div class="c-script-editor-location-menu__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">${escapeHtml(title)}</p>
            <h3 class="c-script-editor-editor-card__title">${escapeHtml(title)}</h3>
          </div>
        </div>
        <p class="c-script-editor-editor-card__hint">${escapeHtml(hint)}</p>
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>挂载菜单项</span>
            <select
              class="c-script-editor-form-field__input"
              data-script-editor-owner-menu-picker
            >
              ${this.renderScriptEditorSelectOptions(
                mountOptions,
                "",
                "选择一个菜单项"
              )}
            </select>
          </label>
        </div>
        <div class="c-script-editor-location-menu__toggles">
          <button
            type="button"
            class="c-main-ui-json-text-button"
            data-script-editor-action="add-owner-menu-mount"
            data-script-editor-owner-family="${escapeHtml(ownerFamily)}"
            data-script-editor-owner-id="${escapeHtml(ownerId)}"
          >
            添加菜单项
          </button>
        </div>
        <div class="c-script-editor-location-menu__list">
          ${
            mountedMenus.length === 0
              ? `
                <article class="c-script-editor-location-menu__item">
                  <p class="c-script-editor-editor-card__hint">
                    当前菜单组还没有挂载菜单项。
                  </p>
                </article>
              `
              : mountedMenus
                  .map(
                    (entry, index) => `
                      <article class="c-script-editor-location-menu__item">
                        <div class="c-script-editor-location-menu__header">
                          <div>
                            <h4 class="c-script-editor-editor-card__title">${escapeHtml(entry.title)}</h4>
                          </div>
                          <button
                            type="button"
                            class="c-main-ui-json-text-button"
                            data-script-editor-action="remove-owner-menu-mount"
                            data-script-editor-owner-family="${escapeHtml(ownerFamily)}"
                            data-script-editor-owner-id="${escapeHtml(ownerId)}"
                            data-script-editor-owner-menu-mount-index="${index}"
                          >
                            移除
                          </button>
                        </div>
                      </article>
                    `
                  )
                  .join("")
          }
        </div>
      </section>
    `;
  }

  renderScriptEditorLocationMenuPanel(family, location) {
    const isCityFamily = family === "cities";
    return this.renderScriptEditorOwnerMenuMountPanel(
      family === "cities" ? "cities" : "buildings",
      location.id,
      isCityFamily ? "城市菜单组" : "建筑菜单组",
      isCityFamily
        ? "这里只组合城市可见的菜单项；具体功能绑定与下级菜单跳转统一在“菜单”模块维护。"
        : "这里只组合建筑可见的菜单项；具体功能绑定与下级菜单跳转统一在“菜单”模块维护。"
    );
  }

  renderScriptEditorLocationAccessPanel(location) {
    const access = location.access ?? {
      conditionExpression: null,
      leaveConditionExpression: null,
      blockedDialogueId: "",
    };
    const dialogueOptions = (this.scriptEditorProject?.dialogues ?? []).map((dialogue) => ({
      value: dialogue.id,
      label: `${dialogue.title ?? dialogue.id} (${dialogue.id})`,
    }));
    return `
      <section class="c-script-editor-location-panel" aria-label="进入条件分栏">
        <p class="c-script-editor-editor-card__hint">
          这里配置进入城市或建筑前的条件；没有条件时运行时默认允许进入。
        </p>
        <div class="c-script-editor-location-access-section">
          <label class="c-script-editor-form-field">
            <span>拒绝提示</span>
            <select class="c-script-editor-form-field__input" data-script-editor-location-access-field="blockedDialogueId">
              <option value="">不弹出拒绝对话</option>
              ${dialogueOptions
                .map(
                  (dialogue) => `
                    <option value="${escapeHtml(dialogue.value)}" ${dialogue.value === (access.blockedDialogueId ?? "") ? "selected" : ""}>
                      ${escapeHtml(dialogue.label)}
                    </option>
                  `
                )
                .join("")}
            </select>
          </label>
        </div>
        <div class="c-script-editor-location-access-section">
          <label class="c-script-editor-form-field">
            <span>进入条件</span>
            ${this.renderScriptEditorLocationAccessConditionEditor(access.conditionExpression, "conditionExpression")}
          </label>
        </div>
        <div class="c-script-editor-location-access-section">
          <label class="c-script-editor-form-field">
            <span>绂诲紑鏉′欢</span>
            ${this.renderScriptEditorLocationAccessConditionEditor(access.leaveConditionExpression, "leaveConditionExpression")}
          </label>
        </div>
      </section>
    `;
  }

  renderScriptEditorLocationAccessConditionEditor(conditionExpression, conditionField = "conditionExpression") {
    const conditions = readEditableScriptEditorLocationAccessConditions(
      conditionExpression
    );
    const conditionRows =
      conditions.length === 0
        ? `<p class="c-script-editor-editor-card__hint">没有条件时，运行时默认允许进入。</p>`
        : conditions
            .map((condition, index) =>
              this.renderScriptEditorLocationAccessConditionRow(condition, index, conditionField)
            )
            .join("");
    return `
      <div class="c-script-editor-location-access-condition" data-script-editor-location-access-condition-scope="${conditionField}">
        <div class="c-script-editor-location-access-condition__rows">
          ${conditionRows}
        </div>
        <div class="c-script-editor-record-editor__actions">
          <button type="button" class="c-script-editor-record-editor__action" data-script-editor-action="add-location-access-condition" data-script-editor-location-access-condition-action="add">新增条件</button>
          <button type="button" class="c-script-editor-record-editor__action" data-script-editor-action="clear-location-access-conditions" data-script-editor-location-access-condition-action="clear">清空条件</button>
        </div>
      </div>
    `;
  }

  renderScriptEditorLocationAccessConditionRow(condition, index, conditionField = "conditionExpression") {
    const compareCondition =
      condition.type === "compare"
        ? condition
        : {
            type: "compare",
            left: { type: "field", subject: "event", entityId: "", fieldId: "completed" },
            operator: "equals",
            right: { type: "literal", value: true },
          };
    const factor =
      compareCondition.left?.type === "field" &&
      ["event", "person", "time"].includes(compareCondition.left.subject)
        ? compareCondition.left.subject
        : "event";
    const literalValue =
      compareCondition.right?.type === "literal" && compareCondition.right.value != null
        ? String(compareCondition.right.value)
        : "";
    const factorControls =
      factor === "person"
        ? this.renderScriptEditorLocationAccessPersonConditionControls(compareCondition, index, literalValue)
        : factor === "time"
          ? this.renderScriptEditorLocationAccessTimeConditionControls(compareCondition, index, literalValue)
          : this.renderScriptEditorLocationAccessEventConditionControls(compareCondition, index);
    return `
      <div class="c-script-editor-location-access-condition__row">
        <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="factor">
          <option value="event" ${factor === "event" ? "selected" : ""}>事件</option>
          <option value="person" ${factor === "person" ? "selected" : ""}>人物</option>
          <option value="time" ${factor === "time" ? "selected" : ""}>时间</option>
        </select>
        ${factorControls}
        <button type="button" class="c-script-editor-record-editor__action" data-script-editor-action="remove-location-access-condition" data-script-editor-location-access-condition-action="remove" data-script-editor-location-access-condition-index="${index}">移除</button>
      </div>
    `;
  }

  renderScriptEditorLocationAccessEventConditionControls(condition, index) {
    const selectedEventId =
      condition.left?.type === "field" && condition.left.subject === "event"
        ? condition.left.entityId ?? ""
        : "";
    const eventState =
      condition.right?.type === "literal" && condition.right.value === false
        ? "incomplete"
        : "completed";
    const eventOptions = this.getScriptEditorProjectRecordOptions("events");
    return `
      <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="eventId">
        ${this.renderScriptEditorSelectOptions(eventOptions, selectedEventId, "未选择事件")}
      </select>
      <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="eventState">
        <option value="completed" ${eventState === "completed" ? "selected" : ""}>完成</option>
        <option value="incomplete" ${eventState === "incomplete" ? "selected" : ""}>未完成</option>
      </select>
    `;
  }

  renderScriptEditorLocationAccessPersonConditionControls(condition, index, literalValue) {
    const selectedPersonId =
      condition.left?.type === "field" && condition.left.subject === "person"
        ? condition.left.entityId ?? ""
        : "";
    const selectedField =
      condition.left?.type === "field" && condition.left.subject === "person"
        ? condition.left.fieldId
        : "stats.politics";
    const personOptions = this.getScriptEditorProjectRecordOptions("people");
    const personFieldOptions = this.getScriptEditorLocationAccessPersonFieldOptions(selectedPersonId);
    return `
      <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="personId">
        ${this.renderScriptEditorSelectOptions(personOptions, selectedPersonId, "未选择人物")}
      </select>
      <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="personField">
        ${personFieldOptions
          .map(
            (option) => `
              <option value="${escapeHtml(option.value)}" ${option.value === selectedField ? "selected" : ""}>
                ${escapeHtml(option.label)}
              </option>
            `
          )
          .join("")}
      </select>
      ${this.renderScriptEditorLocationAccessOperatorSelect(condition.operator, index)}
      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(literalValue)}" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="literalValue" />
    `;
  }

  renderScriptEditorLocationAccessTimeConditionControls(condition, index, literalValue) {
    const selectedTimeField =
      condition.left?.type === "field" && condition.left.subject === "time"
        ? condition.left.fieldId
        : "year";
    return `
      <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="timeField">
        ${[
          ["year", "年份"],
          ["month", "月份"],
          ["day", "日期"],
          ["timeOfDay", "时段"],
        ]
          .map(
            ([value, label]) => `
              <option value="${value}" ${value === selectedTimeField ? "selected" : ""}>${label}</option>
            `
          )
          .join("")}
      </select>
      ${this.renderScriptEditorLocationAccessOperatorSelect(condition.operator, index)}
      <input class="c-script-editor-form-field__input" type="${selectedTimeField === "timeOfDay" ? "text" : "number"}" value="${escapeHtml(literalValue)}" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="literalValue" />
    `;
  }

  renderScriptEditorLocationAccessOperatorSelect(selectedOperator, index) {
    return `
        <select class="c-script-editor-form-field__input" data-script-editor-location-access-condition-index="${index}" data-script-editor-location-access-condition-field="operator">
          ${[
            ["equals", "等于"],
            ["not-equals", "不等于"],
            ["greater-than", "大于"],
            ["greater-than-or-equal", "大于等于"],
            ["less-than", "小于"],
            ["less-than-or-equal", "小于等于"],
            ["includes", "包含"],
            ["exists", "存在"],
          ]
            .map(
              ([value, label]) => `
                <option value="${value}" ${value === compareCondition.operator ? "selected" : ""}>${label}</option>
              `
            )
            .join("")}
        </select>
    `;
  }

  getScriptEditorLocationAccessPersonFieldOptions(personId) {
    const selectedPerson = (this.scriptEditorProject?.people ?? []).find(
      (person) => person.id === personId
    );
    const baseOptions = [
      { value: "stats.politics", label: "基础属性 / 政务" },
      { value: "stats.war", label: "基础属性 / 武力" },
      { value: "stats.intelligence", label: "基础属性 / 智谋" },
      { value: "personType", label: "基础属性 / 类型" },
      { value: "role", label: "基础属性 / 角色定位" },
      { value: "cityId", label: "基础属性 / 所在城市" },
      { value: "houseId", label: "基础属性 / 所在建筑" },
    ];
    const customOptions = (selectedPerson?.extendedAttributes ?? []).map((attribute) => ({
      value: `customProperties.${attribute.key}`,
      label: `自定义属性 / ${attribute.label ?? attribute.key}`,
    }));
    return [...baseOptions, ...customOptions];
  }

  renderScriptEditorBuildingEntryPanel(location) {
    const entryBinding = location.entryBinding ?? {
      defaultPersonId: "",
      returnTarget: "city",
    };
    const personOptions = this.getScriptEditorProjectRecordOptions("people");
    return `
      <section class="c-script-editor-location-panel" aria-label="建筑入口分栏">
        <p class="c-script-editor-editor-card__hint">
          建筑入口分栏只声明默认落点和返回目标；进入建筑后的剧情/功能触发统一改由 arrangement / eventBindings 处理，不再保留 building-local 入口事件字段。
        </p>
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>默认落点人物</span>
            <select class="c-script-editor-form-field__input" data-script-editor-building-entry-field="defaultPersonId">
              ${this.renderScriptEditorSelectOptions(personOptions, entryBinding.defaultPersonId, "未选择默认落点人物")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>返回目标层级</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entryBinding.returnTarget)}" data-script-editor-building-entry-field="returnTarget" />
          </label>
        </div>
      </section>
    `;
  }

  renderScriptEditorStoryNodeEditor(records, selectedRecord) {
    const storyNode =
      selectedRecord == null ? null : normalizeScriptEditorStoryNodeRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("storyNodes", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "storyNodes",
            records: filteredRecords,
            ariaLabel: "剧情列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("storyNodes", "搜索剧情", "按剧情标题或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增剧情
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${storyNode == null ? "disabled" : ""}
                >
                  删除剧情
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorStoryNodeRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorStoryNodeListSummary(normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              storyNode == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个剧情后继续编辑。剧情负责组织人物、对话与事件的归属关系，不在这里承担底层执行逻辑。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-narrative-editor__tabs" role="tablist" aria-label="剧情详情分栏">
                      ${this.renderScriptEditorNarrativeTabButton("profile", "基础")}
                      ${this.renderScriptEditorNarrativeTabButton("links", "关联")}
                      ${this.renderScriptEditorNarrativeTabButton("summary", "摘要")}
                      ${this.renderScriptEditorNarrativeTabButton("events", "事件")}
                    </div>
                  </template>
                  ${this.renderScriptEditorStoryNodeTabPanel(storyNode)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorDialogueEditor(records, selectedRecord) {
    const dialogue =
      selectedRecord == null ? null : normalizeScriptEditorDialogueRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("dialogues", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "dialogues",
            records: filteredRecords,
            ariaLabel: "对话列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("dialogues", "搜索对话", "按对话标题或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增对话
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${dialogue == null ? "disabled" : ""}
                >
                  删除对话
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorDialogueRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorDialogueListSummary(normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              dialogue == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个对话后继续编辑。当前作者面只负责演出结构、参与人物和后续动作入口，不在这里落 minigame / runtime 机制。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-narrative-editor__tabs" role="tablist" aria-label="对话详情分栏">
                      ${this.renderScriptEditorNarrativeTabButton("profile", "基础")}
                    </div>
                  </template>
                  ${this.renderScriptEditorDialogueTabPanel(dialogue)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorEventEditor(records, selectedRecord) {
    const eventRecord =
      selectedRecord == null ? null : normalizeScriptEditorEventRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("events", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "events",
            records: filteredRecords,
            ariaLabel: "事件列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("events", "搜索事件", "按事件标题或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增事件
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${eventRecord == null ? "disabled" : ""}
                >
                  删除事件
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorEventRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              eventRecord == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个事件后继续编辑。事件页会收口为稳定区块，而不是散乱大表单或分步向导。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-narrative-editor__tabs" role="tablist" aria-label="事件详情分栏">
                      <button
                        type="button"
                        class="c-main-ui-json-text-button c-script-editor-narrative-editor__tab is-active"
                        role="tab"
                        aria-selected="true"
                      >
                        事件信息
                      </button>
                    </div>
                  </template>
                  ${this.renderScriptEditorEventTabPanel(eventRecord)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorSettlementEditor(records, selectedRecord) {
    const settlement =
      selectedRecord == null ? null : normalizeScriptEditorSettlementRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("settlements", records);
    const nextEventOptions = this.getScriptEditorCreatorRecordOptions("events");

    return `
      <div class="c-script-editor-editor-card">
        <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
        <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "settlements",
            records: filteredRecords,
            ariaLabel: "结算列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("settlements", "搜索结算", "按结算标题搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增结算
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${settlement == null ? "disabled" : ""}
                >
                  删除结算
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorSettlementRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>结构化结算</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            ${
              settlement == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个结算以继续编辑。</p>`
                : `
                  <section class="c-script-editor-narrative-panel" aria-label="结算编辑面板">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>结算标题</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(settlement.title)}" data-script-editor-settlement-field="title" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>后续事件</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-settlement-field="nextEventId">
                          ${this.renderScriptEditorSelectOptions(
                            nextEventOptions,
                            settlement.nextEventId ?? "",
                            "空表示直接关闭"
                          )}
                        </select>
                      </label>
                    </div>
                    <section class="c-script-editor-minigame-list">
                      <div class="c-script-editor-narrative-panel__header">
                        <div>
                          <p class="c-script-editor-editor-card__eyebrow">结算</p>
                          <h3 class="c-script-editor-editor-card__title">结算内容</h3>
                        </div>
                        <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-settlement-content">
                          新增结算内容
                        </button>
                      </div>
                      ${this.renderScriptEditorSettlementContentRows(settlement)}
                    </section>
                  </section>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorSettlementContentRows(settlement) {
    return (settlement.contents ?? [])
      .map((content, index) => {
        const targetOptions = this.getScriptEditorSettlementTargetOptions(content.targetFamily);
        const attributeOptions = this.getScriptEditorSettlementAttributeOptions(content);
        const operationOptions = this.getScriptEditorSettlementOperationOptions(
          content.attributeType
        );
        return `
          <article class="c-script-editor-minigame-list__route">
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>目标类型</span>
                <select class="c-script-editor-form-field__input" data-script-editor-settlement-content-field="targetFamily" data-script-editor-settlement-content-index="${index}">
                  ${this.renderScriptEditorSelectOptions(
                    SCRIPT_EDITOR_SETTLEMENT_TARGET_FAMILY_OPTIONS,
                    content.targetFamily,
                    "选择目标类型"
                  )}
                </select>
              </label>
              <label class="c-script-editor-form-field">
                <span>目标</span>
                <select class="c-script-editor-form-field__input" data-script-editor-settlement-content-field="targetId" data-script-editor-settlement-content-index="${index}">
                  ${this.renderScriptEditorSelectOptions(
                    targetOptions,
                    content.targetId,
                    "选择目标"
                  )}
                </select>
              </label>
              <label class="c-script-editor-form-field">
                <span>属性</span>
                <select class="c-script-editor-form-field__input" data-script-editor-settlement-content-field="attributeKey" data-script-editor-settlement-content-index="${index}">
                  ${this.renderScriptEditorSelectOptions(
                    attributeOptions,
                    content.attributeKey,
                    "选择可计算属性"
                  )}
                </select>
              </label>
              <label class="c-script-editor-form-field">
                <span>操作</span>
                <select class="c-script-editor-form-field__input" data-script-editor-settlement-content-field="operation" data-script-editor-settlement-content-index="${index}">
                  ${this.renderScriptEditorSelectOptions(
                    operationOptions,
                    content.operation,
                    "选择操作"
                  )}
                </select>
              </label>
              <label class="c-script-editor-form-field">
                <span>值</span>
                ${this.renderScriptEditorSettlementContentValueControl(content, index)}
              </label>
            </div>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-settlement-content" data-script-editor-settlement-content-index="${index}">
              删除结算内容
            </button>
          </article>
        `;
      })
      .join("");
  }

  renderScriptEditorSettlementContentValueControl(content, index) {
    if (content.attributeType === "boolean") {
      return `
        <select class="c-script-editor-form-field__input" data-script-editor-settlement-content-field="value" data-script-editor-settlement-content-index="${index}">
          ${this.renderScriptEditorSelectOptions(
            [
              { value: "true", label: "true" },
              { value: "false", label: "false" },
            ],
            String(content.value === true),
            "Select boolean value"
          )}
        </select>
      `;
    }

    if (content.attributeType === "enum") {
      return `
        <select class="c-script-editor-form-field__input" data-script-editor-settlement-content-field="value" data-script-editor-settlement-content-index="${index}">
          ${this.renderScriptEditorSelectOptions(
            this.getScriptEditorSettlementEnumValueOptions(content),
            String(content.value ?? ""),
            "Select enum value"
          )}
        </select>
      `;
    }

    return `<input class="c-script-editor-form-field__input" type="number" step="any" value="${escapeHtml(String(content.value ?? ""))}" data-script-editor-settlement-content-field="value" data-script-editor-settlement-content-index="${index}" />`;
  }

  renderScriptEditorProgressTrackEditor(records, selectedRecord) {
    const track =
      selectedRecord == null ? null : normalizeScriptEditorProgressTrackRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("progressTracks", records);
    const settlementOptions = this.getScriptEditorCreatorRecordOptions("settlements");

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "progressTracks",
            records: filteredRecords,
            ariaLabel: "阶段轨道列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("progressTracks", "搜索阶段轨道", "按阶段轨道名称搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增阶段轨道
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${track == null ? "disabled" : ""}
                >
                  删除阶段轨道
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorProgressTrackRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.getScriptEditorProgressOwnerKindLabel(normalizedRecord.hostFamily))} / ${escapeHtml(normalizedRecord.metricLabel)}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            ${
              track == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个阶段轨道后继续编辑。</p>`
                : `
                  <section class="c-script-editor-narrative-panel" aria-label="阶段轨道编辑面板">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>阶段轨道</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(track.title)}" data-script-editor-progress-track-field="title" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>进度值</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(track.metricLabel ?? "")}" data-script-editor-progress-track-field="metricLabel" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>进度取值字段</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(track.metricKey ?? "")}" data-script-editor-progress-track-field="metricKey" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>适用对象</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-progress-track-field="hostFamily">
                          ${this.renderScriptEditorSelectOptions(
                            SCRIPT_EDITOR_PROGRESS_OWNER_KIND_OPTIONS,
                            track.hostFamily ?? "",
                            "未设置适用对象"
                          )}
                        </select>
                      </label>
                      <label class="c-script-editor-person-editor__toggle">
                        <input type="checkbox" data-script-editor-progress-track-field="allowDemotion" ${track.allowDemotion === true ? "checked" : ""} />
                        <span>允许回退</span>
                      </label>
                    </div>
                    <section class="c-script-editor-minigame-list">
                      <div class="c-script-editor-narrative-panel__header">
                        <div>
                          <p class="c-script-editor-editor-card__eyebrow">阶段</p>
                          <h3 class="c-script-editor-editor-card__title">阶段设置</h3>
                        </div>
                        <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-progress-track-tier">
                          新增阶段
                        </button>
                      </div>
                      ${this.renderScriptEditorProgressTrackTierRows(track, settlementOptions)}
                    </section>
                  </section>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorProgressTrackTierRows(track, settlementOptions) {
    return (track.tiers ?? [])
      .map(
        (tier, index) => `
          <article class="c-script-editor-minigame-list__route">
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>阶段</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(tier.title ?? "")}" data-script-editor-progress-track-tier-field="title" data-script-editor-progress-track-tier-index="${index}" />
              </label>
              <label class="c-script-editor-form-field">
                <span>进度值门槛</span>
                <input class="c-script-editor-form-field__input" type="number" value="${escapeHtml(String(tier.threshold ?? 0))}" data-script-editor-progress-track-tier-field="threshold" data-script-editor-progress-track-tier-index="${index}" />
              </label>
              <label class="c-script-editor-form-field">
                <span>进入结算</span>
                <select class="c-script-editor-form-field__input" data-script-editor-progress-track-tier-field="targetTierSettlementId" data-script-editor-progress-track-tier-index="${index}">
                  ${this.renderScriptEditorSelectOptions(
                    settlementOptions,
                    tier.targetTierSettlementId ?? "",
                    "不触发结算"
                  )}
                </select>
              </label>
              <label class="c-script-editor-form-field">
                <span>重复策略</span>
                <select class="c-script-editor-form-field__input" data-script-editor-progress-track-tier-field="onEnterRepeatPolicy" data-script-editor-progress-track-tier-index="${index}">
                  ${this.renderScriptEditorSelectOptions(
                    SCRIPT_EDITOR_PROGRESS_TIER_REPEAT_POLICY_OPTIONS,
                    tier.onEnterRepeatPolicy ?? "once-ever",
                    "仅首次进入触发"
                  )}
                </select>
              </label>
            </div>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-progress-track-tier" data-script-editor-progress-track-tier-index="${index}">
              删除阶段
            </button>
          </article>
        `
      )
      .join("");
  }

  renderScriptEditorProgressTrackBindingEditor(records, selectedRecord) {
    const binding =
      selectedRecord == null
        ? null
        : normalizeScriptEditorProgressTrackBindingRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("progressTrackBindings", records);
    const trackOptions = this.getScriptEditorCreatorRecordOptions("progressTracks");

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "progressTrackBindings",
            records: filteredRecords,
            ariaLabel: "阶段轨道绑定列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("progressTrackBindings", "搜索绑定", "按绑定对象或轨道搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增轨道绑定
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${binding == null ? "disabled" : ""}
                >
                  删除轨道绑定
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorProgressTrackBindingRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(this.getScriptEditorProgressBindingLabel(normalizedRecord))}</strong>
                  <span>${escapeHtml(normalizedRecord.trackId || "未绑定阶段轨道")}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            ${
              binding == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个阶段轨道绑定后继续编辑。</p>`
                : `
                  <section class="c-script-editor-narrative-panel" aria-label="阶段轨道绑定编辑面板">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>阶段轨道</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-progress-binding-field="trackId">
                          ${this.renderScriptEditorSelectOptions(
                            trackOptions,
                            binding.trackId ?? "",
                            "未选择阶段轨道"
                          )}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>绑定对象类型</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-progress-binding-field="hostFamily">
                          ${this.renderScriptEditorSelectOptions(
                            SCRIPT_EDITOR_PROGRESS_OWNER_KIND_OPTIONS.filter((option) => option.value !== "*"),
                            binding.host?.family ?? "",
                            "未设置对象类型"
                          )}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>对象标识</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(binding.host?.id ?? "")}" data-script-editor-progress-binding-field="hostId" />
                      </label>
                      <label class="c-script-editor-person-editor__toggle">
                        <input type="checkbox" data-script-editor-progress-binding-field="enabled" ${binding.enabled !== false ? "checked" : ""} />
                        <span>启用绑定</span>
                      </label>
                    </div>
                  </section>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorStageConfigurationEditor() {
    const bindings = this.filterScriptEditorRecords(
      SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
      this.getScriptEditorStageConfigurationBindings()
    );
    const binding = this.getSelectedScriptEditorProgressTrackBinding();
    const track = this.getSelectedScriptEditorProgressTrack();
    const trackOptions = this.getScriptEditorCreatorRecordOptions("progressTracks");
    const ownerOptions = this.getScriptEditorStageConfigurationOwnerOptions(
      binding?.host?.family ?? "person"
    );

    return `
      <div class="c-script-editor-editor-card">
        <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
        <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
        <header class="c-script-editor-editor-card__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">阶段配置</p>
            <h2 class="c-script-editor-editor-card__title">按应用对象配置阶段规则</h2>
          </div>
          <div class="c-script-editor-editor-card__actions">
            <button
              type="button"
              class="c-main-ui-json-text-button"
              data-script-editor-action="open-stage-configuration-help"
            >
              帮助
            </button>
          </div>
        </header>
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
            records: bindings,
            ariaLabel: "应用对象列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch(
                  SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
                  "搜索应用对象",
                  "按应用对象或规则名称搜索"
                )}
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="add-stage-configuration-binding"
                >
                  新增应用对象
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-stage-configuration-binding"
                  ${binding == null ? "disabled" : ""}
                >
                  删除应用对象
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord =
                normalizeScriptEditorProgressTrackBindingRecord(record);
              const ownerDisplay =
                this.getScriptEditorProgressBindingOwnerDisplay(normalizedRecord);
              const trackTitle = this.getScriptEditorProgressTrackTitleById(
                normalizedRecord.trackId
              );
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === binding?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(ownerDisplay)}</strong>
                  <span>${escapeHtml(trackTitle || "未绑定规则")}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-stage-configuration-editor">
            ${
              binding == null
                ? `
                  <p class="c-script-editor-editor-card__hint">
                    先新增一个应用对象，再为它绑定阶段规则。这里产出的只是配置；最终属性和状态变化会在结算时生成结算实例，再交给结算运行时处理。
                  </p>
                `
                : `
                  <section class="c-script-editor-stage-configuration-panel" aria-label="配置对象">
                    <div class="c-script-editor-narrative-panel__header">
                      <div>
                        <p class="c-script-editor-editor-card__eyebrow">配置对象</p>
                        <h3 class="c-script-editor-editor-card__title">${escapeHtml(
                          this.getScriptEditorProgressBindingOwnerDisplay(binding)
                        )}</h3>
                      </div>
                    </div>
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>对象类型</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-progress-binding-field="hostFamily">
                          ${this.renderScriptEditorSelectOptions(
                            SCRIPT_EDITOR_PROGRESS_OWNER_KIND_OPTIONS.filter(
                              (option) => option.value !== "*"
                            ),
                            binding.host?.family ?? "",
                            "未选择对象类型"
                          )}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>应用对象</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-progress-binding-field="hostId">
                          ${this.renderScriptEditorSelectOptions(
                            ownerOptions,
                            binding.host?.id ?? "",
                            "未选择应用对象"
                          )}
                        </select>
                      </label>
                      <label class="c-script-editor-person-editor__toggle">
                        <input
                          type="checkbox"
                          data-script-editor-progress-binding-field="enabled"
                          ${binding.enabled !== false ? "checked" : ""}
                        />
                        <span>启用这个应用对象</span>
                      </label>
                    </div>
                  </section>

                  <section class="c-script-editor-stage-configuration-panel" aria-label="使用规则">
                    <div class="c-script-editor-narrative-panel__header">
                      <div>
                        <p class="c-script-editor-editor-card__eyebrow">使用规则</p>
                        <h3 class="c-script-editor-editor-card__title">${escapeHtml(
                          track?.title ?? "未绑定规则"
                        )}</h3>
                      </div>
                      <div class="c-script-editor-stage-configuration-panel__actions">
                        <button
                          type="button"
                          class="c-main-ui-json-text-button"
                          data-script-editor-action="add-stage-configuration-track"
                        >
                          新建规则
                        </button>
                        <button
                          type="button"
                          class="c-main-ui-json-text-button"
                          data-script-editor-action="remove-stage-configuration-track"
                          ${track == null ? "disabled" : ""}
                        >
                          删除当前规则
                        </button>
                      </div>
                    </div>
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                        <span>阶段规则</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-progress-binding-field="trackId">
                          ${this.renderScriptEditorSelectOptions(
                            trackOptions,
                            binding.trackId ?? "",
                            "未选择阶段规则"
                          )}
                        </select>
                      </label>
                    </div>
                    <p class="c-script-editor-editor-card__hint">
                      一个应用对象只能绑定一套阶段规则；同一套规则可以复用到多个对象。阶段变化不会在这里直接执行，而是生成结算实例，交给结算运行时统一处理。
                    </p>
                  </section>

                  ${
                    track == null
                      ? `
                        <p class="c-script-editor-editor-card__hint">
                          当前应用对象还没有绑定阶段规则。你可以先选择已有规则，或点击“新建规则”创建一套新的规则后自动绑定到当前对象。
                        </p>
                      `
                      : `
                        <section class="c-script-editor-stage-configuration-panel" aria-label="阶段规则">
                          <div class="c-script-editor-narrative-panel__header">
                            <div>
                              <p class="c-script-editor-editor-card__eyebrow">阶段规则</p>
                              <h3 class="c-script-editor-editor-card__title">${escapeHtml(
                                track.title
                              )}</h3>
                            </div>
                            <button
                              type="button"
                              class="c-main-ui-json-text-button"
                              data-script-editor-action="add-progress-track-tier"
                            >
                              新增阶段
                            </button>
                          </div>
                          <div class="c-script-editor-form-grid">
                            <label class="c-script-editor-form-field">
                              <span>规则名称</span>
                              <input
                                class="c-script-editor-form-field__input"
                                type="text"
                                value="${escapeHtml(track.title)}"
                                data-script-editor-progress-track-field="title"
                              />
                            </label>
                            <label class="c-script-editor-form-field">
                              <span>经验名称</span>
                              <input
                                class="c-script-editor-form-field__input"
                                type="text"
                                value="${escapeHtml(track.metricLabel ?? "")}"
                                data-script-editor-progress-track-field="metricLabel"
                              />
                            </label>
                            <label class="c-script-editor-form-field">
                              <span>经验字段</span>
                              <input
                                class="c-script-editor-form-field__input"
                                type="text"
                                value="${escapeHtml(track.metricKey ?? "")}"
                                data-script-editor-progress-track-field="metricKey"
                              />
                            </label>
                            <label class="c-script-editor-form-field">
                              <span>适用对象类型</span>
                              <select class="c-script-editor-form-field__input" data-script-editor-progress-track-field="ownerKind">
                                ${this.renderScriptEditorSelectOptions(
                                  SCRIPT_EDITOR_PROGRESS_OWNER_KIND_OPTIONS,
                                  track.hostFamily ?? "",
                                  "未设置适用对象类型"
                                )}
                              </select>
                            </label>
                            <label class="c-script-editor-person-editor__toggle">
                              <input
                                type="checkbox"
                                data-script-editor-progress-track-field="allowDemotion"
                                ${track.allowDemotion === true ? "checked" : ""}
                              />
                              <span>允许回退到更低阶段</span>
                            </label>
                          </div>
                          <div class="c-script-editor-minigame-list">
                            ${this.renderScriptEditorProgressTrackTierRows(
                              track,
                              this.getScriptEditorCreatorRecordOptions("settlements")
                            )}
                          </div>
                        </section>
                      `
                  }
                `
            }
          </div>
        </div>
        ${
          this.scriptEditorStageConfigurationHelpOpen
            ? `
              <section class="c-script-editor-stage-configuration-help" role="dialog" aria-modal="true" aria-label="阶段配置帮助">
                <button
                  type="button"
                  class="c-script-editor-stage-configuration-help__backdrop"
                  data-script-editor-action="close-stage-configuration-help"
                  aria-label="关闭帮助"
                ></button>
                <div class="c-script-editor-stage-configuration-help__panel">
                  <div class="c-script-editor-narrative-panel__header">
                    <div>
                      <p class="c-script-editor-editor-card__eyebrow">功能说明</p>
                      <h3 class="c-script-editor-editor-card__title">阶段配置怎么用</h3>
                    </div>
                    <button
                      type="button"
                      class="c-main-ui-json-text-button"
                      data-script-editor-action="close-stage-configuration-help"
                    >
                      关闭
                    </button>
                  </div>
                  <div class="c-script-editor-stage-configuration-help__body">
                    <p>这个模块面向创作者配置“谁在用规则”和“规则本身长什么样”。左侧先选应用对象，右侧再配置对象、绑定规则和阶段阈值。</p>
                    <p>推荐流程：1. 新增应用对象。2. 选择人物、城市或建筑。3. 绑定已有规则，或新建一套规则。4. 在阶段规则里填写经验字段、阶段阈值，以及进入阶段后要触发的结算。</p>
                    <p>注意：这里不会直接改人物、城市或建筑状态。所有最终属性变化、状态变化都会生成结算实例，并通过事件路由交给结算运行时统一执行。</p>
                  </div>
                </div>
              </section>
            `
            : ""
        }
      </div>
    `;
  }

  renderScriptEditorMinigameEditor(records, selectedRecord) {
    const minigame =
      selectedRecord == null ? null : normalizeScriptEditorMinigameRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("minigames", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "minigames",
            records: filteredRecords,
            ariaLabel: "玩法绑定列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                ${this.renderScriptEditorRecordListSearch("minigames", "搜索玩法", "按玩法标题或 ID 搜索")}
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增玩法绑定
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${minigame == null ? "disabled" : ""}
                >
                  删除玩法绑定
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorMinigameRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-minigame-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              minigame == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个玩法条目后继续编辑。本页集中整理玩法入口、触发时机与结算回流设置。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-minigame-editor__tabs" role="tablist" aria-label="玩法绑定详情分栏">
                      ${this.renderScriptEditorMinigameTabButton("basics", "基础信息")}
                      ${this.renderScriptEditorMinigameTabButton("launch", "触发与调度")}
                      ${this.renderScriptEditorMinigameTabButton("settlement", "结算与返回")}
                      ${this.renderScriptEditorMinigameTabButton("events", "事件")}
                    </div>
                  </template>
                  ${this.renderScriptEditorMinigameTabPanel(minigame)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorNarrativeTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-narrative-editor__tab ${this.scriptEditorNarrativeTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-narrative-tab"
        data-script-editor-narrative-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorNarrativeTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorMinigameTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-minigame-editor__tab ${this.scriptEditorMinigameTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-minigame-tab"
        data-script-editor-minigame-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorMinigameTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorStoryNodeTabPanel(storyNode) {
    if (this.scriptEditorNarrativeTab === "events") {
      return this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "story", ownerId: storyNode.id });
    }

    if (this.scriptEditorNarrativeTab === "links") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="剧情关联分栏">
          ${this.renderScriptEditorStringRelationPanel("关联人物", "story-related-people", storyNode.relatedPersonIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联对话", "story-related-dialogues", storyNode.relatedDialogueIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联事件", "story-related-events", storyNode.relatedEventIds ?? [])}
        </section>
      `;
    }

    if (this.scriptEditorNarrativeTab === "summary") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="剧情摘要分栏">
          <p class="c-script-editor-editor-card__hint">
            当前剧情属于章节 ${escapeHtml(storyNode.chapterId ?? "未设置")}，推进策略为 ${escapeHtml(storyNode.progressMode ?? "block")}。这里先收口为组织摘要，后续预览链路由后续队列承接。
          </p>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("人物归属", `已关联 ${storyNode.relatedPersonIds?.length ?? 0} 个人物。`, "neutral")}
            ${this.renderScriptEditorOverviewCard("对话归属", `已关联 ${storyNode.relatedDialogueIds?.length ?? 0} 段对话。`, "neutral")}
            ${this.renderScriptEditorOverviewCard("事件归属", `已关联 ${storyNode.relatedEventIds?.length ?? 0} 个事件。`, "neutral")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-narrative-panel" aria-label="剧情基础分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>剧情标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(storyNode.title)}" data-script-editor-story-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>推进策略</span>
            <select class="c-script-editor-form-field__input" data-script-editor-story-field="progressMode">
              ${SCRIPT_EDITOR_STORY_PROGRESS_MODES.map(
                (mode) => `<option value="${mode}" ${storyNode.progressMode === mode ? "selected" : ""}>${mode}</option>`
              ).join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>剧情摘要</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-story-field="summary" spellcheck="false">${escapeHtml(storyNode.summary ?? "")}</textarea>
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          "剧情内部标识与章节挂接默认折叠，首屏优先展示创作标题、推进方式和摘要。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>剧情 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(storyNode.id)}" data-script-editor-story-field="id" />
              </label>
              <label class="c-script-editor-form-field">
                <span>章节 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(storyNode.chapterId ?? "")}" data-script-editor-story-field="chapterId" />
              </label>
            </div>
          `
        )}
      </section>
    `;
  }

  renderScriptEditorDialogueTabPanel(dialogue) {
    return `
      <section class="c-script-editor-narrative-panel" aria-label="对话基础分栏">
        <div class="c-script-editor-narrative-panel__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">对话基础</p>
            <h3 class="c-script-editor-editor-card__title">基础</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="open-dialogue-help">
            帮助
          </button>
        </div>
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>对话标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(dialogue.title)}" data-script-editor-dialogue-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>对话类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-dialogue-field="mode">
              ${SCRIPT_EDITOR_DIALOGUE_MODES.map(
                (mode) => `
                  <option value="${mode}" ${dialogue.mode === mode ? "selected" : ""}>
                    ${mode === "choice" ? "有选择对话" : "无选择对话"}
                  </option>
                `
              ).join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>对话文本</span>
            ${this.renderScriptEditorDialogueReferenceSelect({
              field: "textId",
              value: dialogue.textId ?? "",
              emptyLabel: "未选择文本",
              options: this.createScriptEditorTextEntryReferenceOptions(),
            })}
          </label>
          <label class="c-script-editor-form-field">
            <span>当前发言人物</span>
            ${this.renderScriptEditorDialogueReferenceSelect({
              field: "speakerPersonId",
              value: dialogue.speakerPersonId ?? "",
              emptyLabel: "未选择人物",
              options: this.createScriptEditorPersonReferenceOptions(),
            })}
          </label>
        </div>
        ${this.renderScriptEditorDialogueCastPanel(dialogue)}
        ${this.renderScriptEditorDialogueRoutePanel(dialogue)}
        ${
          this.scriptEditorDialogueHelpOpen
            ? `
              <section class="c-script-editor-stage-configuration-help" role="dialog" aria-modal="true" aria-label="对话模块帮助">
                <button
                  type="button"
                  class="c-script-editor-stage-configuration-help__backdrop"
                  data-script-editor-action="close-dialogue-help"
                  aria-label="关闭帮助"
                ></button>
                <div class="c-script-editor-stage-configuration-help__panel">
                  <div class="c-script-editor-narrative-panel__header">
                    <div>
                      <p class="c-script-editor-editor-card__eyebrow">功能说明</p>
                      <h3 class="c-script-editor-editor-card__title">对话模块怎么用</h3>
                    </div>
                    <button
                      type="button"
                      class="c-main-ui-json-text-button"
                      data-script-editor-action="close-dialogue-help"
                    >
                      关闭
                    </button>
                  </div>
                  <div class="c-script-editor-stage-configuration-help__body">
                    <p>这个模块只编辑一屏对话实例。事件负责进入对话，对话负责展示内容，结束后再把结果回交给事件继续路由。</p>
                    <p>适用场景：短对白、接任务提示、单次选择分支。复杂连续演出不要在这里堆节点，而是拆成多条事件链和多屏对话。</p>
                    <p>填写顺序建议：1. 先选对话类型。2. 绑定对话文本和当前发言人物。3. 配置出场人物左右站位。4. 最后填写后续事件或选项路由。</p>
                    <p>示例：无选择对话。方丈说“今日先去化缘”，模式选“无选择对话”，对话文本指向该句文本，后续事件指向“外出化缘”。</p>
                    <p>示例：有选择对话。住持问“是否愿意接下差事”，模式选“有选择对话”，为“愿意/改日再说”分别配置选项文本和各自后续事件。</p>
                  </div>
                </div>
              </section>
            `
            : ""
        }
      </section>
    `;
  }

  renderScriptEditorDialogueCastPanel(dialogue) {
    return `
      <section class="c-script-editor-narrative-panel" aria-label="出场人物">
        <div class="c-script-editor-narrative-panel__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">出场人物</p>
            <h3 class="c-script-editor-editor-card__title">出场人物</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-dialogue-cast">
            新增人物
          </button>
        </div>
        <div class="c-script-editor-narrative-list">
          ${(dialogue.cast ?? [])
            .map(
              (entry, index) => `
                <article class="c-script-editor-narrative-item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>人物 ID</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-dialogue-cast-field="personId" data-script-editor-dialogue-cast-index="${index}">
                        ${this.renderScriptEditorSelectOptions(
                          this.createScriptEditorPersonReferenceOptions(),
                          entry.personId,
                          "未选择人物"
                        )}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>位置</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-dialogue-cast-field="side" data-script-editor-dialogue-cast-index="${index}">
                        ${this.renderScriptEditorSelectOptions(
                          [
                            { value: "left", label: "左" },
                            { value: "right", label: "右" },
                          ],
                          entry.side,
                          "选择站位"
                        )}
                      </select>
                    </label>
                  </div>
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-dialogue-cast" data-script-editor-dialogue-cast-index="${index}">
                    删除人物
                  </button>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorDialogueRoutePanel(dialogue) {
    if (dialogue.mode === "choice") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="后续路由">
          <div class="c-script-editor-narrative-panel__header">
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-dialogue-option">
              新增选项
            </button>
          </div>
          <div class="c-script-editor-narrative-list">
            ${(dialogue.options ?? [])
              .map(
                (option, index) => `
                  <article class="c-script-editor-narrative-item">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>选项 ID</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(option.id ?? "")}" data-script-editor-dialogue-option-field="id" data-script-editor-dialogue-option-index="${index}" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>选项文案</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-dialogue-option-field="textId" data-script-editor-dialogue-option-index="${index}">
                          ${this.renderScriptEditorSelectOptions(
                            this.createScriptEditorTextEntryReferenceOptions(),
                            option.textId ?? "",
                            "未选择文本"
                          )}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>后续事件</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-dialogue-option-field="nextEventId" data-script-editor-dialogue-option-index="${index}">
                          ${this.renderScriptEditorSelectOptions(
                            this.createScriptEditorEventReferenceOptions(),
                            option.nextEventId ?? "",
                            "未选择事件"
                          )}
                        </select>
                      </label>
                    </div>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-dialogue-option" data-script-editor-dialogue-option-index="${index}">
                      删除选项
                    </button>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-narrative-panel" aria-label="后续路由">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>后续事件</span>
            ${this.renderScriptEditorDialogueReferenceSelect({
              field: "nextEventId",
              value: dialogue.nextEventId ?? "",
              emptyLabel: "无后续事件",
              options: this.createScriptEditorEventReferenceOptions(),
            })}
          </label>
        </div>
      </section>
    `;
  }

  renderScriptEditorDialogueReferenceSelect({
    field,
    value,
    emptyLabel,
    options,
  }) {
    return `
      <select class="c-script-editor-form-field__input" data-script-editor-dialogue-field="${escapeHtml(field)}">
        ${this.renderScriptEditorSelectOptions(options, value ?? "", emptyLabel)}
      </select>
    `;
  }

  createScriptEditorPersonReferenceOptions() {
    return (this.scriptEditorProject?.people ?? []).map((person) => ({
      value: person.id,
      label: `${person.name ?? person.title ?? person.id} (${person.id})`,
    }));
  }

  createScriptEditorTextEntryReferenceOptions() {
    return (this.scriptEditorProject?.textEntries ?? []).map((entry) => ({
      value: entry.id,
      label:
        typeof entry.text === "string" && entry.text.length > 0
          ? `${entry.id} / ${entry.text.slice(0, 32)}`
          : entry.id,
    }));
  }

  createScriptEditorDialogueReferenceOptions() {
    return (this.scriptEditorProject?.dialogues ?? []).map((dialogue) => ({
      value: dialogue.id,
      label: `${dialogue.title ?? dialogue.name ?? dialogue.id} (${dialogue.id})`,
    }));
  }

  createScriptEditorEventReferenceOptions() {
    return (this.scriptEditorProject?.events ?? []).map((eventRecord) => ({
      value: eventRecord.id,
      label: `${eventRecord.title ?? eventRecord.name ?? eventRecord.id} (${eventRecord.id})`,
    }));
  }

  createScriptEditorActivityReferenceOptions() {
    return (this.scriptEditorProject?.activities ?? []).map((activity) => ({
      value: activity.id,
      label: `${activity.label ?? activity.name ?? activity.id} (${activity.id})`,
    }));
  }

  createScriptEditorTradeBindingReferenceOptions() {
    return (this.scriptEditorProject?.buildings ?? []).map((building) => ({
      value: building.id,
      label: `${building.name ?? building.id} (${building.id})`,
    }));
  }

  createScriptEditorEventDestinationFamilyOptions() {
    const labelsByFamily = {
      dialogue: "对话",
      event: "事件",
      menuInstance: "菜单",
      minigame: "小游戏",
      task: "任务",
    };

    return SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES.map((family) => ({
      value: family,
      label: labelsByFamily[family] ?? family,
    }));
  }

  createScriptEditorEventDestinationTargetOptions(family) {
    const project = this.scriptEditorProject ?? {
      people: [],
      cities: [],
      buildings: [],
      events: [],
      quests: [],
      dialogues: [],
      minigames: [],
      menuInstances: [],
    };

    if (family === "event") {
      return project.events.map((event) => ({
        value: event.id,
        label: event.title ?? event.name ?? event.id,
      }));
    }

    if (family === "dialogue") {
      return project.dialogues.map((dialogue) => ({
        value: dialogue.id,
        label: dialogue.title ?? dialogue.name ?? dialogue.id,
      }));
    }

    if (family === "minigame") {
      return project.minigames.map((minigame) => ({
        value: minigame.id,
        label: minigame.title ?? minigame.name ?? minigame.id,
      }));
    }

    if (family === "menuInstance") {
      return listScriptEditorMenuModuleRecords(project).map((record) => ({
        value: record.id,
        label: record.title,
      }));
    }

    if (family === "task") {
      return project.quests.map((quest) => ({
        value: quest.id,
        label: quest.title ?? quest.name ?? quest.id,
      }));
    }

    return [];
  }

  getScriptEditorEventNextEventOptions(currentEventId = "") {
    return this.getScriptEditorProjectRecordOptions("events").filter(
      (option) => option.value !== currentEventId
    );
  }

  getScriptEditorMinigamePlayableLabel(playableId) {
    const labels = {
      "activity-qte": "互动问答",
      "city-begging": "城市乞讨",
      "grain-accounting": "粮账核算",
      "medicine-compounding": "药材炼制",
      "story-battle": "剧情战斗",
      "building-flow": "建筑流程",
    };

    return labels[playableId] ?? playableId ?? "未设置";
  }

  getScriptEditorMinigameIntegrationLabel(integrationId) {
    const labels = {
      "playable.city-begging.external.default": "城市乞讨 / 外部入口",
      "playable.activity-qte.dialogue.default": "互动问答 / 对话接入",
      "playable.activity-qte.house.temple": "互动问答 / 寺庙接入",
      "playable.grain-accounting.house.grain-shop": "粮账核算 / 粮铺接入",
      "playable.medicine-compounding.house.medicine-house": "药材炼制 / 药铺接入",
      "playable.story-battle.dialogue.default": "剧情战斗 / 对话接入",
      "playable.building-flow.house.default": "建筑流程 / 建筑接入",
    };

    return labels[integrationId] ?? integrationId ?? "未设置";
  }

  getScriptEditorMinigameTriggerSourceLabel(triggerSource) {
    const labels = {
      manual: "手动触发",
      "dialogue-follow-up": "对话后续",
      "event-destination": "事件去向",
      "location-menu": "地点菜单",
      other: "其他来源",
    };

    return labels[triggerSource] ?? triggerSource ?? "未设置";
  }

  getScriptEditorMinigameOwnerKindLabel(ownerKind) {
    const labels = {
      house: "建筑",
      dialogue: "对话",
      task: "任务",
      external: "外部",
    };

    return labels[ownerKind] ?? ownerKind ?? "未设置";
  }

  getScriptEditorMinigameReturnPolicyLabel(returnPolicy) {
    const labels = {
      "resume-owner": "返回原界面",
      "reenter-owner": "重新进入原界面",
      "close-only": "仅关闭玩法",
    };

    return labels[returnPolicy] ?? returnPolicy ?? "未设置";
  }

  getScriptEditorMinigameOutcomeLabel(outcome) {
    const labels = {
      success: "成功",
      failure: "失败",
      cancelled: "取消",
    };

    return labels[outcome] ?? outcome ?? "未设置";
  }

  getScriptEditorEventBindingOwnerFamilyLabel(ownerFamily) {
    const labels = {
      person: "人物",
      city: "城市",
      building: "建筑",
      dialogue: "对话",
      minigame: "玩法",
      story: "剧情节点",
      manual: "手动",
    };

    return labels[ownerFamily] ?? ownerFamily ?? "未设置";
  }

  describeScriptEditorEventBindingTrigger(binding) {
    const ownerFamily =
      typeof binding.owner?.family === "string" ? binding.owner.family : "story";
    const triggerTiming =
      typeof binding.trigger?.timing === "string" ? binding.trigger.timing : "";
    const triggerAction =
      typeof binding.trigger?.action === "string" ? binding.trigger.action : "";
    const options =
      SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER[ownerFamily] ??
      SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER.story;
    const matched = options.find(
      (option) => option.timing === triggerTiming && option.action === triggerAction
    );

    if (matched != null) {
      return matched.label;
    }

    if (triggerTiming.length === 0 && triggerAction.length === 0) {
      return "未设置触发";
    }

    return [triggerTiming, triggerAction].filter(Boolean).join(" / ");
  }

  renderScriptEditorEventTabPanel(eventRecord) {
    if (this.scriptEditorEventTab !== "basics") {
      this.scriptEditorEventTab = "basics";
    }

    const eventType = eventRecord.type ?? "";
    const eventTypeOptions = [
      { value: "", label: "普通事件" },
      ...SCRIPT_EDITOR_EVENT_TYPES.map((type) => ({
        value: type,
        label: type === "settlement" ? "结算" : type,
      })),
    ];
    const settlementOptions = this.getScriptEditorProjectRecordOptions("settlements");
    const nextEventOptions = this.getScriptEditorEventNextEventOptions(eventRecord.id);
    const currentDestinationFamily = eventRecord.destination?.family ?? "dialogue";
    const currentDestinationTargetId = eventRecord.destination?.targetId ?? "";
    const destinationFamilyOptions = this.createScriptEditorEventDestinationFamilyOptions();
    const destinationTargetOptions =
      this.createScriptEditorEventDestinationTargetOptions(currentDestinationFamily);
    const selectedDestinationTargetId = destinationTargetOptions.some(
      (option) => option.value === currentDestinationTargetId
    )
      ? currentDestinationTargetId
      : "";
    const unsupportedDestinationNotice =
      currentDestinationFamily !== "dialogue"
        ? `
          <p class="c-script-editor-editor-card__hint">
            当前去向类型暂不支持导出为可运行事件；只有对话去向会导出为可运行入口。
          </p>
        `
        : "";

    if (this.scriptEditorEventTab === "destination") {
      const currentDestinationFamily = eventRecord.destination?.family ?? "dialogue";
      const currentDestinationTargetId = eventRecord.destination?.targetId ?? "";
      const destinationFamilyOptions = this.createScriptEditorEventDestinationFamilyOptions();
      const destinationTargetOptions =
        this.createScriptEditorEventDestinationTargetOptions(currentDestinationFamily);
      const selectedDestinationTargetId = destinationTargetOptions.some(
        (option) => option.value === currentDestinationTargetId
      )
        ? currentDestinationTargetId
        : "";
      const unsupportedDestinationNotice =
        currentDestinationFamily !== "dialogue"
          ? `
            <p class="c-script-editor-editor-card__hint">
              当前去向类型暂不支持导出为可运行事件；只有对话去向会导出为可运行入口。
            </p>
          `
          : "";
      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件去向分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>去向类型</span>
              <select class="c-script-editor-form-field__input" data-script-editor-event-destination-field="family">
                ${this.renderScriptEditorSelectOptions(
                  destinationFamilyOptions,
                  currentDestinationFamily,
                  "请选择去向类型"
                )}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>去向目标</span>
              <select class="c-script-editor-form-field__input" data-script-editor-event-destination-field="targetId">
                ${this.renderScriptEditorSelectOptions(
                  destinationTargetOptions,
                  selectedDestinationTargetId,
                  "请选择去向目标"
                )}
              </select>
            </label>
          </div>
          ${unsupportedDestinationNotice}
        </section>
      `;
    }

    if (this.scriptEditorEventTab === "relations") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件关联对象分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>所属剧情 ID</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(eventRecord.relations?.storyNodeId ?? "")}" data-script-editor-event-story-node-id />
            </label>
          </div>
          ${this.renderScriptEditorStringRelationPanel("关联人物", "event-related-people", eventRecord.relations?.personIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联城市", "event-related-cities", eventRecord.relations?.cityIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联建筑", "event-related-buildings", eventRecord.relations?.buildingIds ?? [])}
        </section>
      `;
    }

    if (this.scriptEditorEventTab === "bindings") {
      const eventBindings = (this.scriptEditorProject?.eventBindings ?? []).filter(
        (binding) => binding.eventId === eventRecord.id
      );

      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件关联分栏">
          <div class="c-script-editor-narrative-panel__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">事件关联</p>
              <h3 class="c-script-editor-editor-card__title">引用当前事件的安排</h3>
            </div>
          </div>
          <div class="c-script-editor-narrative-list">
            ${
              eventBindings.length === 0
                ? `<p class="c-script-editor-editor-card__hint">当前还没有条目会在这里接续这个事件。</p>`
                : eventBindings
                    .map(
                      (binding) => `
                        <article class="c-script-editor-narrative-item" data-script-editor-event-binding-id="${escapeHtml(binding.id)}">
                          ${this.renderScriptEditorEventBindingSummary(binding)}
                        </article>
                      `
                    )
                    .join("")
            }
          </div>
        </section>
      `;
    }

    if (this.scriptEditorEventTab === "preview") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件预览与校验分栏">
          <p class="c-script-editor-editor-card__hint">
            当前先提供 bounded 摘要与人工预览备注：创作者可以直接描述事件去向、条件摘要和校验关注点，后续真正的预览联动与问题跳回由更后面的预览校验队列承接。
          </p>
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>预览摘要</span>
              <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-event-preview-field="previewNotes" spellcheck="false">${escapeHtml(eventRecord.previewSummary?.previewNotes ?? "")}</textarea>
            </label>
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>校验关注点</span>
              <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-event-preview-field="validationNotes" spellcheck="false">${escapeHtml(eventRecord.previewSummary?.validationNotes ?? "")}</textarea>
            </label>
          </div>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("去向", `当前去向 ${eventRecord.destination?.family ?? "未设置"}:${eventRecord.destination?.targetId ?? "未设置"}`, "neutral")}
            ${this.renderScriptEditorOverviewCard("关联对象", `人物 ${eventRecord.relations?.personIds?.length ?? 0} / 城市 ${eventRecord.relations?.cityIds?.length ?? 0} / 建筑 ${eventRecord.relations?.buildingIds?.length ?? 0}`, "neutral")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-narrative-panel" aria-label="事件基础信息分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>事件标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(eventRecord.title)}" data-script-editor-event-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>事件类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-field="type">
              ${this.renderScriptEditorSelectOptions(eventTypeOptions, eventType, "普通事件")}
            </select>
          </label>
          <label class="c-script-editor-person-editor__toggle">
            <input type="checkbox" data-script-editor-event-repeatable ${eventRecord.repeatable ? "checked" : ""} />
            <span>允许重复触发</span>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>事件说明</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-event-field="description" spellcheck="false" placeholder="填写这个事件的用途、触发结果或创作备注。">${escapeHtml(eventRecord.description ?? "")}</textarea>
          </label>
          <label class="c-script-editor-form-field">
            <span>后续事件</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-field="nextEventId">
              ${this.renderScriptEditorSelectOptions(nextEventOptions, eventRecord.nextEventId ?? "", "空表示直接关闭")}
            </select>
          </label>
          ${
            eventType === "settlement"
              ? `
                <label class="c-script-editor-form-field">
                  <span>结算模块</span>
                  <select class="c-script-editor-form-field__input" data-script-editor-event-field="settlementId">
                    ${this.renderScriptEditorSelectOptions(
                      settlementOptions,
                      eventRecord.settlementId ?? "",
                      "请选择结算"
                    )}
                  </select>
                </label>
              `
              : ""
          }
          <label class="c-script-editor-form-field">
            <span>去向类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-destination-field="family">
              ${this.renderScriptEditorSelectOptions(
                destinationFamilyOptions,
                currentDestinationFamily,
                "请选择去向类型"
              )}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>去向目标</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-destination-field="targetId">
              ${this.renderScriptEditorSelectOptions(
                destinationTargetOptions,
                selectedDestinationTargetId,
                "请选择去向目标"
              )}
            </select>
          </label>
        </div>
        ${unsupportedDestinationNotice}
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>所属剧情 ID</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(eventRecord.relations?.storyNodeId ?? "")}" data-script-editor-event-story-node-id />
          </label>
        </div>
        ${this.renderScriptEditorStringRelationPanel("关联人物", "event-related-people", eventRecord.relations?.personIds ?? [])}
        ${this.renderScriptEditorStringRelationPanel("关联城市", "event-related-cities", eventRecord.relations?.cityIds ?? [])}
        ${this.renderScriptEditorStringRelationPanel("关联建筑", "event-related-buildings", eventRecord.relations?.buildingIds ?? [])}
      </section>
    `;
  }

  renderScriptEditorEventBindingSummary(binding) {
    const ownerFamily =
      typeof binding.owner?.family === "string" ? binding.owner.family : "unknown";
    const ownerId = typeof binding.owner?.id === "string" ? binding.owner.id : "";
    const priority =
      typeof binding.priority === "number" && Number.isFinite(binding.priority)
        ? binding.priority
        : 0;
    const enabledLabel = binding.enabled !== false ? "已启用" : "已停用";
    const ownerFamilyLabel = this.getScriptEditorEventBindingOwnerFamilyLabel(ownerFamily);
    const triggerLabel = this.describeScriptEditorEventBindingTrigger(binding);

    return `
      <div class="c-script-editor-narrative-panel__header">
        <div>
          <p class="c-script-editor-editor-card__eyebrow">${escapeHtml(enabledLabel)} / 优先级 ${priority}</p>
          <h3 class="c-script-editor-editor-card__title">${escapeHtml(binding.id)}</h3>
        </div>
      </div>
      <p class="c-script-editor-editor-card__hint">
        ${escapeHtml(ownerFamilyLabel)}：${escapeHtml(ownerId)} -> ${escapeHtml(triggerLabel)}
      </p>
    `;
  }

  renderScriptEditorMinigameTabPanel(minigame) {
    if (!["basics", "launch", "settlement", "references", "events"].includes(this.scriptEditorMinigameTab)) {
      this.scriptEditorMinigameTab = "basics";
    }

    if (this.scriptEditorMinigameTab === "events") {
      return this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "minigame", ownerId: minigame.id });
    }

    if (this.scriptEditorMinigameTab === "launch") {
      const playableOptions = listScriptEditorBuiltinMinigamePlayableOptions();
      const integrationOptions = listScriptEditorBuiltinMinigameIntegrationOptions(
        minigame.playableId
      );
      return `
        <section class="c-script-editor-minigame-panel" aria-label="玩法绑定触发与调度分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>玩法原型</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="playableId">
                ${playableOptions
                  .map(
                    (option) => `<option value="${option.id}" ${minigame.playableId === option.id ? "selected" : ""}>${this.getScriptEditorMinigamePlayableLabel(option.id)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>接入方案</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-integration>
                ${integrationOptions
                  .map(
                    (option) => `<option value="${option.integrationId}" ${minigame.integrationId === option.integrationId ? "selected" : ""}>${this.getScriptEditorMinigameIntegrationLabel(option.integrationId)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>触发来源</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="triggerSource">
                ${SCRIPT_EDITOR_MINIGAME_TRIGGER_SOURCES.map(
                  (triggerSource) => `<option value="${triggerSource}" ${minigame.triggerSource === triggerSource ? "selected" : ""}>${this.getScriptEditorMinigameTriggerSourceLabel(triggerSource)}</option>`
                ).join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>触发目标</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.triggerId ?? "")}" data-script-editor-minigame-field="triggerId" />
            </label>
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>触发事件</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.triggerEvent ?? "")}" data-script-editor-minigame-field="triggerEvent" />
            </label>
          </div>
        </section>
      `;
    }

    if (this.scriptEditorMinigameTab === "settlement") {
      return `
        <section class="c-script-editor-minigame-panel" aria-label="玩法绑定结算与返回分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>归属对象类型</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="ownerKind">
                ${SCRIPT_EDITOR_MINIGAME_OWNER_KINDS.map(
                  (ownerKind) => `<option value="${ownerKind}" ${minigame.ownerKind === ownerKind ? "selected" : ""}>${ownerKind}</option>`
                ).join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>归属对象 ID</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.ownerId ?? "")}" data-script-editor-minigame-field="ownerId" />
            </label>
            <label class="c-script-editor-form-field">
              <span>默认返回策略</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="returnPolicy">
                ${SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES.map(
                  (returnPolicy) => `<option value="${returnPolicy}" ${minigame.returnPolicy === returnPolicy ? "selected" : ""}>${returnPolicy}</option>`
                ).join("")}
              </select>
            </label>
          </div>
          <section class="c-script-editor-minigame-list">
            <div class="c-script-editor-narrative-panel__header">
              <div>
                <p class="c-script-editor-editor-card__eyebrow">结算去向</p>
                <h3 class="c-script-editor-editor-card__title">结果路由</h3>
              </div>
              <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-minigame-outcome-route">
                新增 outcome route
              </button>
            </div>
            ${(minigame.outcomeRoutes ?? [])
              .map(
                (route, index) => `
                  <article class="c-script-editor-minigame-list__route">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>路由 ID</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(route.id)}" data-script-editor-minigame-outcome-field="id" data-script-editor-minigame-outcome-index="${index}" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>结果类型</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-minigame-outcome-field="outcome" data-script-editor-minigame-outcome-index="${index}">
                          ${SCRIPT_EDITOR_MINIGAME_OUTCOMES.map(
                            (outcome) => `<option value="${outcome}" ${route.outcome === outcome ? "selected" : ""}>${outcome}</option>`
                          ).join("")}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>交接策略</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-minigame-outcome-field="handoffPolicy" data-script-editor-minigame-outcome-index="${index}">
                          ${SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES.map(
                            (returnPolicy) => `<option value="${returnPolicy}" ${route.handoffPolicy === returnPolicy ? "selected" : ""}>${returnPolicy}</option>`
                          ).join("")}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                        <span>结果摘要</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(route.summary)}" data-script-editor-minigame-outcome-field="summary" data-script-editor-minigame-outcome-index="${index}" />
                      </label>
                      <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                        <span>效果提示</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(route.effectHint)}" data-script-editor-minigame-outcome-field="effectHint" data-script-editor-minigame-outcome-index="${index}" />
                      </label>
                    </div>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-minigame-outcome-route" data-script-editor-minigame-outcome-index="${index}">
                      删除 outcome route
                    </button>
                  </article>
                `
              )
              .join("")}
          </section>
        </section>
      `;
    }

    if (this.scriptEditorMinigameTab === "references") {
      const references = this.collectScriptEditorMinigameReferences(minigame.id);
      return `
        <section class="c-script-editor-minigame-panel" aria-label="玩法绑定引用关系分栏">
          <p class="c-script-editor-editor-card__hint">
            这里汇总哪些条目会进入当前玩法，便于核对入口安排。
          </p>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("引用数", String(references.length), references.length === 0 ? "neutral" : "success")}
            ${this.renderScriptEditorOverviewCard("玩法原型", minigame.playableId || "未设置", "neutral")}
            ${this.renderScriptEditorOverviewCard("接入方案", minigame.integrationId || "未设置", "neutral")}
          </div>
          <div class="c-script-editor-minigame-list">
            ${references.length === 0
              ? `<p class="c-script-editor-editor-card__hint">当前还没有作者面条目接到这个玩法。</p>`
              : references
                  .map(
                    (reference) => `
                      <article class="c-script-editor-minigame-list__route">
                        <strong>${escapeHtml(reference.label)}</strong>
                        <span>${escapeHtml(reference.summary)}</span>
                      </article>
                    `
                  )
                  .join("")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-minigame-panel" aria-label="玩法绑定基础信息分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>绑定标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.title)}" data-script-editor-minigame-field="title" />
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>说明</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-minigame-field="description" spellcheck="false">${escapeHtml(minigame.description ?? "")}</textarea>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>备注</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-minigame-field="notes" spellcheck="false">${escapeHtml(minigame.notes ?? "")}</textarea>
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          "玩法绑定内部标识默认折叠，首屏先保留创作标题、描述与备注。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>绑定 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.id)}" data-script-editor-minigame-field="id" />
              </label>
            </div>
          `
        )}
      </section>
    `;
  }

  renderScriptEditorEventBindingsEditor(records, selectedRecord) {
    const binding =
      selectedRecord == null ? null : normalizeScriptEditorEventBindingRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "eventBindings",
            records,
            ariaLabel: "事件安排列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-event-binding">
                  新增安排
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-event-binding"
                  data-script-editor-event-binding-id="${escapeHtml(binding?.id ?? "")}"
                  ${binding == null ? "disabled" : ""}
                >
                  删除安排
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedBinding = normalizeScriptEditorEventBindingRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedBinding.id)}</strong>
                  <span>${escapeHtml(this.getScriptEditorEventBindingOwnerFamilyLabel(normalizedBinding.owner.family))} / ${escapeHtml(normalizedBinding.owner.id ?? "未设置")} / ${escapeHtml(normalizedBinding.eventId || "未选择事件")}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            ${
              binding == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个安排后继续编辑事件接续。</p>`
                : `<section class="c-script-editor-narrative-panel" aria-label="事件接续编辑区">${this.renderScriptEditorEventBindingEditor(selectedRecord)}</section>`
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily, ownerId }) {
    const bindings = (this.scriptEditorProject?.eventBindings ?? []).filter((binding) => {
      const normalizedBinding = normalizeScriptEditorEventBindingRecord(binding);
      return normalizedBinding.owner.family === ownerFamily && normalizedBinding.owner.id === ownerId;
    });

    return `
      <section class="c-script-editor-narrative-panel" aria-label="事件绑定" data-script-editor-owner-local-event-bindings data-script-editor-owner-family="${escapeHtml(ownerFamily)}">
        <div class="c-script-editor-narrative-panel__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">事件绑定</p>
            <h3 class="c-script-editor-editor-card__title">${escapeHtml(ownerFamily)}:${escapeHtml(ownerId)}</h3>
          </div>
          <button
            type="button"
            class="c-main-ui-json-text-button"
            data-script-editor-action="add-owner-local-event-binding"
            data-script-editor-owner-family="${escapeHtml(ownerFamily)}"
            data-script-editor-owner-id="${escapeHtml(ownerId)}"
          >
            新增绑定
          </button>
        </div>
        <div class="c-script-editor-narrative-list">
          ${
            bindings.length === 0
              ? `<p class="c-script-editor-editor-card__hint">当前对象还没有事件绑定。</p>`
              : bindings
                  .map(
                    (binding) => `
                      <article class="c-script-editor-narrative-item" data-script-editor-event-binding-id="${escapeHtml(binding.id)}">
                        ${this.renderScriptEditorEventBindingEditor(binding, { lockOwner: true })}
                        <button
                          type="button"
                          class="c-script-editor-record-editor__action"
                          data-script-editor-action="remove-owner-local-event-binding"
                          data-script-editor-event-binding-id="${escapeHtml(binding.id)}"
                        >
                          移除绑定
                        </button>
                      </article>
                    `
                  )
                  .join("")
          }
        </div>
      </section>
    `;
  }

  renderScriptEditorEventBindingEditor(binding, options = {}) {
    const normalizedBinding = normalizeScriptEditorEventBindingRecord(binding);
    const lockOwner = options.lockOwner === true;
    const conditions =
      normalizedBinding.conditions &&
      typeof normalizedBinding.conditions === "object" &&
      !Array.isArray(normalizedBinding.conditions)
        ? normalizedBinding.conditions
        : { operator: "all", conditions: [] };
    const conditionItems = Array.isArray(conditions.conditions)
      ? conditions.conditions
      : [];
    const eventOptions = this.getScriptEditorEventBindingEventOptions();
    const triggerOptions = this.getScriptEditorEventBindingTriggerOptions(
      normalizedBinding.owner.family
    );
    const selectedTriggerKey = `${normalizedBinding.trigger.timing}:${normalizedBinding.trigger.action}`;

    return `
      ${this.renderScriptEditorEventBindingSummary(normalizedBinding)}
      <div class="c-script-editor-form-grid">
        <label class="c-script-editor-form-field">
          <span>绑定事件</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-field="eventId">
            ${this.renderScriptEditorSelectOptions(eventOptions, normalizedBinding.eventId, "未选择绑定事件")}
          </select>
        </label>
        ${!lockOwner ? `
          <label class="c-script-editor-form-field">
            <span>绑定对象类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-owner-field="family">
              ${this.renderScriptEditorOptionList(SCRIPT_EDITOR_EVENT_BINDING_OWNER_FAMILY_OPTIONS, normalizedBinding.owner.family)}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>绑定对象 ID</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(normalizedBinding.owner.id ?? "")}" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-owner-field="id" />
          </label>
        ` : ""}
        <label class="c-script-editor-form-field">
          <span>触发时机</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-trigger-field="timing">
            ${this.renderScriptEditorOptionList(
              triggerOptions.map((option) => ({
                value: `${option.timing}:${option.action}`,
                label: option.label,
              })),
              selectedTriggerKey
            )}
          </select>
        </label>
        <label class="c-script-editor-form-field">
          <span>优先级</span>
          <input class="c-script-editor-form-field__input" type="number" value="${escapeHtml(String(normalizedBinding.priority ?? 0))}" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-field="priority" />
        </label>
        <label class="c-script-editor-person-editor__toggle">
          <input type="checkbox" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-enabled ${normalizedBinding.enabled !== false ? "checked" : ""} />
          <span>启用</span>
        </label>
        <label class="c-script-editor-form-field">
          <span>条件组合</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-condition-operator>
            ${SCRIPT_EDITOR_EVENT_BINDING_CONDITION_GROUP_OPERATORS.map(
              (operator) => `<option value="${operator}" ${conditions.operator === operator ? "selected" : ""}>${SCRIPT_EDITOR_EVENT_BINDING_CONDITION_OPERATOR_LABELS[operator] ?? operator}</option>`
            ).join("")}
          </select>
        </label>
      </div>
      <div class="c-script-editor-narrative-list">
        ${conditionItems
          .map((condition, index) =>
            this.renderScriptEditorEventBindingConditionItem(normalizedBinding.id, condition, index)
          )
          .join("")}
      </div>
      <div class="c-script-editor-narrative-inline">
        <button class="c-script-editor-record-editor__action" type="button" data-script-editor-action="add-event-binding-condition-item" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}">新增条件</button>
        <button class="c-script-editor-record-editor__action" type="button" data-script-editor-action="remove-event-binding" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}">删除绑定</button>
      </div>
    `;
  }

  getScriptEditorEventBindingEventOptions() {
    return (this.scriptEditorProject?.events ?? [])
      .map((eventRecord) => normalizeScriptEditorEventRecord(eventRecord))
      .map((eventRecord) => ({
        value: eventRecord.id,
        label: `${eventRecord.title} (${eventRecord.id})`,
      }));
  }

  getScriptEditorEventBindingTriggerOptions(ownerFamily) {
    return (
      SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER[ownerFamily] ??
      SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER.story
    );
  }

  renderScriptEditorEventBindingConditionItem(bindingId, condition, index) {
    const fieldOptions = listScriptEditorEventBindingConditionFieldOptions();
    const selectedSourceFamily =
      condition.sourceFamily ??
      (condition.type === "flag" || condition.type === "variable"
        ? condition.type
        : condition.type === "binding-context"
          ? "binding-context"
          : "variable");
    const visibleFieldOptions = fieldOptions.filter(
      (option) => option.sourceFamily === selectedSourceFamily
    );
    const selectedFieldOption =
      visibleFieldOptions.find((option) => option.path === condition.field) ??
      fieldOptions.find((option) => option.path === condition.field) ??
      visibleFieldOptions[0] ??
      null;
    const valueType = condition.valueType ?? selectedFieldOption?.valueType ?? (condition.type === "flag" ? "boolean" : "string");
    const operatorOptions = this.getScriptEditorConditionOperatorOptions(valueType);
    const valueControl = this.renderScriptEditorEventBindingConditionValueControl(
      bindingId,
      condition,
      index,
      valueType,
      selectedFieldOption
    );
    return `
      <div class="c-script-editor-narrative-panel" data-script-editor-event-binding-condition-field-registry>
        <div class="c-script-editor-narrative-inline">
          <label class="c-script-editor-form-field">
            <span>条件类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="type">
              ${this.renderScriptEditorOptionList(SCRIPT_EDITOR_EVENT_BINDING_CONDITION_TYPE_OPTIONS, condition.type)}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>字段来源</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="sourceFamily">
              ${this.renderScriptEditorOptionList(SCRIPT_EDITOR_EVENT_BINDING_SOURCE_FAMILY_OPTIONS, selectedSourceFamily)}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>字段</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="field">
              ${visibleFieldOptions
                .map((option) => `<option value="${escapeHtml(option.path)}" ${condition.field === option.path ? "selected" : ""} data-script-editor-event-binding-condition-value-type="${escapeHtml(option.valueType)}" data-script-editor-event-binding-condition-resolver="${escapeHtml(option.resolverId ?? "")}">${escapeHtml(option.label)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>值类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="valueType" data-script-editor-event-binding-condition-value-type>
              ${Object.entries(SCRIPT_EDITOR_EVENT_BINDING_VALUE_TYPE_LABELS)
                .map(([type, label]) => `<option value="${escapeHtml(type)}" ${valueType === type ? "selected" : ""}>${escapeHtml(label)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>判断方式</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="operator">
              ${operatorOptions
                .map((operator) => `<option value="${escapeHtml(operator)}" ${condition.operator === operator ? "selected" : ""}>${escapeHtml(SCRIPT_EDITOR_EVENT_BINDING_CONDITION_OPERATOR_LABELS[operator] ?? operator)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>目标值</span>
            ${valueControl}
          </label>
          <button class="c-script-editor-record-editor__action" type="button" data-script-editor-action="remove-event-binding-condition-item" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}">移除</button>
        </div>
        ${this.renderScriptEditorEventBindingAdvancedConditionSurface(bindingId, condition, index)}
      </div>
    `;
  }

  renderScriptEditorOptionList(options, selectedValue) {
    const hasSelectedValue = options.some((option) => option.value === selectedValue);
    return `${hasSelectedValue || selectedValue == null || selectedValue === "" ? "" : `<option value="${escapeHtml(selectedValue)}" selected>${escapeHtml(selectedValue)}</option>`}${options
      .map(
        (option) =>
          `<option value="${escapeHtml(option.value)}" ${selectedValue === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`
      )
      .join("")}`;
  }

  getScriptEditorConditionOperatorOptions(valueType) {
    if (valueType === "boolean") {
      return ["==", "!="];
    }
    if (valueType === "number") {
      return ["==", "!=", ">=", "<=", ">", "<"];
    }
    return ["==", "!=", "contains"];
  }

  renderScriptEditorEventBindingConditionValueControl(
    bindingId,
    condition,
    index,
    valueType,
    fieldOption
  ) {
    const baseAttributes = `data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="value"`;
    const currentValue = String(condition.value ?? "");
    if (valueType === "boolean") {
      return `<select class="c-script-editor-form-field__input" ${baseAttributes}><option value="true" ${condition.value !== false ? "selected" : ""}>是</option><option value="false" ${condition.value === false ? "selected" : ""}>否</option></select>`;
    }
    if (valueType === "enum" && Array.isArray(fieldOption?.enumOptions)) {
      return `<select class="c-script-editor-form-field__input" ${baseAttributes}>${fieldOption.enumOptions
        .map((option) => `<option value="${escapeHtml(option.value)}" ${currentValue === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
        .join("")}</select>`;
    }
    if (valueType === "number") {
      return `<input class="c-script-editor-form-field__input" type="number" value="${escapeHtml(currentValue)}" ${baseAttributes} />`;
    }
    return `<input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(currentValue)}" ${baseAttributes} />`;
  }

  renderScriptEditorEventBindingAdvancedConditionSurface(bindingId, condition, index) {
    if (condition.type === "expression") {
      return `
        <div class="c-script-editor-narrative-inline" data-script-editor-event-binding-condition-expression>
          <span class="c-script-editor-editor-card__hint">表达式条件会保存为作者配置，导出阶段对未支持表达式保持关闭。</span>
        </div>
      `;
    }
    if (condition.type === "custom") {
      return `
        <div class="c-script-editor-narrative-inline" data-script-editor-event-binding-condition-custom>
          <label class="c-script-editor-form-field">
            <span>自定义处理器</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(condition.handlerId ?? "")}" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="handlerId" />
          </label>
          <label class="c-script-editor-form-field">
            <span>自定义参数</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(condition.payload ?? "")}" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="payload" />
          </label>
        </div>
      `;
    }
    if (condition.type === "binding-context") {
      return `
        <div class="c-script-editor-narrative-inline" data-script-editor-event-binding-condition-binding-context>
          <span class="c-script-editor-editor-card__hint">触发上下文条件读取当前绑定触发入口提供的字段。</span>
        </div>
      `;
    }
    return "";
  }

  collectScriptEditorMinigameReferences(minigameId) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    const eventRefs = this.scriptEditorProject.events
      .filter(
        (eventRecord) =>
          eventRecord.destination?.family === "minigame" &&
          eventRecord.destination?.targetId === minigameId
      )
      .map((eventRecord) => ({
        label: `Event / ${eventRecord.title || eventRecord.id}`,
        summary: `${eventRecord.id} destination -> ${minigameId}`,
      }));

    const locationRefs = [
      ...this.scriptEditorProject.cities.map((location) => ({
        family: "cities",
        location,
      })),
      ...this.scriptEditorProject.buildings.map((location) => ({
        family: "buildings",
        location,
      })),
    ].flatMap(({ family, location }) =>
      this.getScriptEditorLocationMenuBundles(family, location.id).flatMap((bundle) =>
        bundle.entries
          .filter(
            (entry) =>
              entry.targetFamily === "minigame" && entry.targetId === minigameId
          )
          .map((entry) => ({
            label: `Location Menu / ${location.name || location.id}`,
            summary: `${location.id}:${bundle.instanceId}:${entry.id} -> ${minigameId}`,
          }))
      )
    );

    return [...eventRefs, ...locationRefs];
  }

  renderScriptEditorStringRelationPanel(title, relationKind, entries) {
    const addAction = `add-${relationKind}`;
    const removeAction = `remove-${relationKind}`;
    return `
      <section class="c-script-editor-narrative-panel" aria-label="${title}">
        <div class="c-script-editor-narrative-panel__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">${title}</p>
            <h3 class="c-script-editor-editor-card__title">${title}</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${addAction}">
            新增关联
          </button>
        </div>
        <div class="c-script-editor-narrative-list">
          ${entries
            .map(
              (entry, index) => `
                <div class="c-script-editor-narrative-inline">
                  <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry)}" data-script-editor-relation-kind="${relationKind}" data-script-editor-relation-index="${index}" />
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${removeAction}" data-script-editor-relation-index="${index}">
                    删除
                  </button>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorField(field, label, value) {
    return `
      <label class="c-script-editor-form-field">
        <span>${escapeHtml(label)}</span>
        <input
          class="c-script-editor-form-field__input"
          type="text"
          value="${escapeHtml(value)}"
          data-script-editor-project-field="${field}"
        />
      </label>
    `;
  }

  renderScriptEditorStartupSelect(field, label, options, selectedValue, emptyLabel) {
    return `
      <label class="c-script-editor-form-field">
        <span>${escapeHtml(label)}</span>
        <select
          class="c-script-editor-form-field__input"
          data-script-editor-startup-field="${escapeHtml(field)}"
        >
          ${this.renderScriptEditorSelectOptions(options, selectedValue, emptyLabel)}
        </select>
      </label>
    `;
  }

  renderScriptEditorSystemDetails(title, hint, body) {
    return `
      <details class="c-script-editor-system-details">
        <summary class="c-script-editor-system-details__summary">${escapeHtml(title)}</summary>
        <div class="c-script-editor-system-details__body">
          <p class="c-script-editor-editor-card__hint">${escapeHtml(hint)}</p>
          ${body}
        </div>
      </details>
    `;
  }

  renderScriptEditorOverviewCard(title, body, tone) {
    return `
      <article class="c-script-editor-shell__card c-script-editor-shell__card--${tone}">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
      </article>
    `;
  }

  describeScriptEditorProjectRisk(exportDiagnostics, compatibilityResidueCount) {
    if (exportDiagnostics.length > 0) {
      return exportDiagnostics[0]?.message ?? "当前仍存在需要先处理的导出阻塞。";
    }

    if (compatibilityResidueCount > 0) {
      return `当前没有导出阻塞，但仍有 ${compatibilityResidueCount} 条兼容残留需要后续语义队列承接。`;
    }

    return "当前没有导出前阻塞，项目可以继续细化对象内容。";
  }

  countScriptEditorCompatibilityResidue() {
    return 0;
  }

  getCachedScriptEditorExportDiagnostics() {
    if (this.scriptEditorProject == null) {
      return [];
    }

    if (Array.isArray(this.scriptEditorExportDiagnosticsCache)) {
      return this.scriptEditorExportDiagnosticsCache;
    }

    return this.refreshScriptEditorExportDiagnostics();
  }

  refreshScriptEditorExportDiagnostics() {
    if (this.scriptEditorProject == null) {
      this.scriptEditorExportDiagnosticsCache = [];
      return this.scriptEditorExportDiagnosticsCache;
    }

    this.scriptEditorExportDiagnosticsCache =
      validateScriptEditorProjectForRuntimeExport(this.scriptEditorProject);
    return this.scriptEditorExportDiagnosticsCache;
  }

  invalidateScriptEditorExportDiagnostics() {
    this.scriptEditorExportDiagnosticsCache = null;
  }

  describeScriptEditorPersonListSummary(person) {
    return (
      [person.personType, person.title, person.occupation]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .slice(0, 2)
        .join(" / ") || "待补人物设定"
    );
  }

  describeScriptEditorLocationListSummary(family, location) {
    if (family === "cities") {
      const description = String(location.description ?? "").trim();
      return description.length > 0
        ? description.slice(0, 20)
        : `菜单 ${this.getScriptEditorLocationMenuEntryCount(family, location.id)} 项`;
    }

    const summary = [
      String(location.cityId ?? "").trim(),
      (location.description ?? "").trim(),
    ].filter((value) => value.length > 0)[0];
    return summary?.slice(0, 20) || `入口 ${location.entryBinding ? "已配置" : "待补齐"}`;
  }

  describeScriptEditorStoryNodeListSummary(storyNode) {
    return (
      [storyNode.chapterId, storyNode.progressMode]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join(" / ") || "待补剧情组织信息"
    );
  }

  describeScriptEditorDialogueListSummary(dialogue) {
    return dialogue.mode === "choice"
      ? `选项 ${dialogue.options?.length ?? 0} / 出场 ${dialogue.cast?.length ?? 0}`
      : `单屏对话 / 出场 ${dialogue.cast?.length ?? 0}`;
  }

  describeScriptEditorMinigameListSummary(minigame) {
    return (
      [minigame.playableId, minigame.triggerSource]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join(" / ") || "待补玩法绑定信息"
    );
  }

  renderScriptEditorNotice() {
    if (this.scriptEditorNotice == null) {
      return "";
    }

    return `
      <div class="c-script-editor-workflow__notice c-script-editor-workflow__notice--${this.scriptEditorNotice.tone}">
        ${escapeHtml(this.scriptEditorNotice.message)}
      </div>
    `;
  }

  renderScriptEditorNoticeTimeline() {
    if (this.scriptEditorNoticeEntries.length === 0) {
      return `
        <section class="c-script-editor-shell__notice-rail" aria-label="操作记录">
          <header class="c-script-editor-shell__notice-header">
            <p class="c-script-editor-shell__handoff-eyebrow">操作记录</p>
            <span>当前还没有新的工作台提示</span>
          </header>
        </section>
      `;
    }

    return `
        <section class="c-script-editor-shell__notice-rail" aria-label="操作记录">
        <header class="c-script-editor-shell__notice-header">
          <p class="c-script-editor-shell__handoff-eyebrow">操作记录</p>
          <span>按最近操作时间排序</span>
        </header>
        <div class="c-script-editor-shell__notice-list">
          ${this.scriptEditorNoticeEntries
            .map(
              (entry) => `
                <article class="c-script-editor-shell__notice-card c-script-editor-shell__notice-card--${entry.tone}">
                  <div class="c-script-editor-shell__notice-meta">
                    <strong>${escapeHtml(entry.label)}</strong>
                    <time datetime="${entry.isoTimestamp}">${entry.timestampLabel}</time>
                  </div>
                  <p>${escapeHtml(entry.message)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  resetScriptEditorNoticeTimeline() {
    this.scriptEditorNotice = null;
    this.scriptEditorNoticeEntries = [];
  }

  recordScriptEditorNotice(notice) {
    this.scriptEditorNotice = notice;
    if (notice == null) {
      return;
    }

    const createdAt = new Date();
    this.scriptEditorNoticeEntries = [
      {
        id: `script-editor-notice-${++this.scriptEditorNoticeSequence}`,
        tone: notice.tone,
        message: notice.message,
        label: notice.tone === "warning" ? "异常" : "完成",
        timestampLabel: this.formatScriptEditorNoticeTimestamp(createdAt),
        isoTimestamp: createdAt.toISOString(),
      },
      ...this.scriptEditorNoticeEntries,
    ].slice(0, 8);
  }

  formatScriptEditorNoticeTimestamp(value) {
    const pad = (input) => String(input).padStart(2, "0");
    return `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }

  renderScriptEditorFileInputs() {
    return `
      <input
        type="file"
        accept="application/json,.json"
        data-script-editor-project-file
        webkitdirectory
        directory
        multiple
        hidden
      >
    `;
  }

  renderScriptEditorProjectLibrary(projectLibraryEntries) {
    if (projectLibraryEntries.length === 0) {
      return `
        <section class="c-script-editor-project-library" aria-label="项目选择与管理">
          <header class="c-script-editor-project-library__header">
            <div>
              <p class="c-script-editor-landing__eyebrow">项目选择与管理</p>
              <h2 class="c-script-editor-editor-card__title">当前还没有可继续的项目</h2>
            </div>
            <p class="c-script-editor-landing__description">
              这一阶段将项目选择与当前项目编辑拆开处理。先创建、打开或导入项目，再进入工作台继续编辑。
            </p>
          </header>
        </section>
      `;
    }

    return `
        <section class="c-script-editor-project-library" aria-label="项目选择与管理">
        <header class="c-script-editor-project-library__header">
          <div>
            <p class="c-script-editor-landing__eyebrow">项目选择与管理</p>
            <h2 class="c-script-editor-editor-card__title">从项目列表继续进入工作台</h2>
          </div>
          <p class="c-script-editor-landing__description">
            这里只负责选择、继续编辑和删除项目，不在入口页展开对象族编辑，保持与当前蓝图队列一致。
          </p>
        </header>
        <div class="c-script-editor-project-library__grid">
          ${projectLibraryEntries
            .map((entry) => this.renderScriptEditorProjectCard(entry))
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorProjectCard(entry) {
    const isCurrentProject = this.scriptEditorProject?.id === entry.projectId;
    const isPendingDelete =
      this.scriptEditorPendingDeleteProjectId === entry.projectId;

    return `
      <article class="c-script-editor-project-card${isPendingDelete ? " is-pending-delete" : ""}">
        <header class="c-script-editor-project-card__header">
          <div>
            <p class="c-script-editor-project-card__eyebrow">${escapeHtml(
              this.getScriptEditorProjectSourceLabel(entry.source)
            )}</p>
            <h3 class="c-script-editor-project-card__title">${escapeHtml(entry.title)}</h3>
          </div>
          ${
            isCurrentProject
              ? '<span class="c-script-editor-project-card__badge">当前项目</span>'
              : ""
          }
        </header>
        <dl class="c-script-editor-project-card__meta">
          <div>
            <dt>项目 ID</dt>
            <dd>${escapeHtml(entry.projectId)}</dd>
          </div>
          <div>
            <dt>故事包 ID</dt>
            <dd>${escapeHtml(entry.project.storyPack.id)}</dd>
          </div>
        </dl>
        <p class="c-script-editor-project-card__description">
          ${escapeHtml(entry.description || "尚未填写项目说明，当前仅保留工作台骨架与项目级元数据。")}
        </p>
        ${
          isPendingDelete
            ? `
              <div class="c-script-editor-project-card__danger">
                <p>确认删除</p>
                <span>删除后会从当前入口项目列表移除；本阶段只管理当前会话中的项目记录。</span>
              </div>
            `
            : ""
        }
        <div class="c-script-editor-project-card__actions">
          <button
            type="button"
            class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
            data-script-editor-action="continue-project"
            data-script-editor-project-id="${escapeHtml(entry.projectId)}"
          >
            继续编辑
          </button>
          ${
            isPendingDelete
              ? `
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="confirm-delete-project"
                  data-script-editor-project-id="${escapeHtml(entry.projectId)}"
                >
                  确认删除
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="cancel-delete-project"
                  data-script-editor-project-id="${escapeHtml(entry.projectId)}"
                >
                  取消
                </button>
              `
              : `
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="request-delete-project"
                  data-script-editor-project-id="${escapeHtml(entry.projectId)}"
                >
                  删除项目
                </button>
              `
          }
        </div>
      </article>
    `;
  }

  async handleScriptEditorAction(action, actionElement = null) {
    const projectId = actionElement?.dataset.scriptEditorProjectId ?? null;
    const personTab = actionElement?.dataset.scriptEditorPersonTab ?? null;
    const personAttributeIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorPersonAttributeIndex ?? "-1",
      10
    );
    const personRelationIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorPersonRelationIndex ?? "-1",
      10
    );
    const locationTab = actionElement?.dataset.scriptEditorLocationTab ?? null;
    const locationMenuIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorLocationMenuIndex ?? "-1",
      10
    );
    const locationAccessConditionIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorLocationAccessConditionIndex ?? "-1",
      10
    );
    const narrativeTab = actionElement?.dataset.scriptEditorNarrativeTab ?? null;
    const eventTab = actionElement?.dataset.scriptEditorEventTab ?? null;
    const minigameTab = actionElement?.dataset.scriptEditorMinigameTab ?? null;
    const targetTab = actionElement?.dataset.scriptEditorTargetTab ?? null;
    const dialogueCastIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorDialogueCastIndex ?? "-1",
      10
    );
    const dialogueOptionIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorDialogueOptionIndex ?? "-1",
      10
    );
    const eventBindingId = actionElement?.dataset.scriptEditorEventBindingId ?? null;
    const ownerFamily = actionElement?.dataset.scriptEditorOwnerFamily ?? null;
    const ownerId = actionElement?.dataset.scriptEditorOwnerId ?? null;
    const eventBindingConditionItemIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorEventBindingConditionItemIndex ?? "-1",
      10
    );
    const relationIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorRelationIndex ?? "-1",
      10
    );
    const minigameLaunchIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorMinigameLaunchIndex ?? "-1",
      10
    );
    const minigameOutcomeIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorMinigameOutcomeIndex ?? "-1",
      10
    );
    const itemCustomPropertyIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorItemCustomPropertyIndex ?? "-1",
      10
    );
    const buildingId = actionElement?.dataset.scriptEditorBuildingId ?? null;
    const targetFamily = actionElement?.dataset.scriptEditorFamily ?? null;
    const targetEntityId = actionElement?.dataset.scriptEditorEntityId ?? null;

    if (action === "new-project") {
      try {
        await this.createScriptEditorProjectAtSavePath();
      } catch (error) {
        this.recordScriptEditorNotice({
          tone: "warning",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create script editor project.",
        });
        this.render();
        return;
      }
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorExportDirectoryHandle = null;
      this.scriptEditorPendingDeleteProjectId = null;
      this.resetScriptEditorNoticeTimeline();
      this.recordScriptEditorNotice({
        tone: "success",
        message: "已新建剧本项目。",
      });
      this.setScreen("script-editor-workspace");
      return;
    }

    if (action === "open-project") {
      await this.openScriptEditorProjectFromDirectory();
      return;
    }

    if (action === "import-pack") {
      await this.handleScriptEditorTemplateImport();
      return;
    }

    if (action === "continue-session") {
      if (this.scriptEditorProject != null) {
        this.scriptEditorNotice = null;
        this.setScreen("script-editor-workspace");
      }
      return;
    }

    if (action === "continue-project") {
      if (projectId != null) {
        this.continueScriptEditorProject(projectId);
      }
      return;
    }

    if (action === "request-delete-project") {
      if (projectId != null) {
        this.scriptEditorPendingDeleteProjectId = projectId;
        this.render();
      }
      return;
    }

    if (action === "cancel-delete-project") {
      if (
        projectId == null ||
        this.scriptEditorPendingDeleteProjectId === projectId
      ) {
        this.scriptEditorPendingDeleteProjectId = null;
        this.render();
      }
      return;
    }

    if (action === "confirm-delete-project") {
      if (projectId != null) {
        this.deleteScriptEditorProject(projectId);
      }
      return;
    }

    if (action === "back-to-landing") {
      this.showScriptEditorLanding();
      return;
    }

    if (action === "back-to-menu") {
      this.showMainMenu();
      return;
    }

    if (action === "project-info") {
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.render();
      return;
    }

    if (action === "save") {
      await this.saveScriptEditorProject();
      return;
    }

    if (action === "validate") {
      this.runScriptEditorValidation();
      return;
    }

    if (action === "preview-runtime") {
      if (this.handleScriptEditorBlockedRuntimeAction()) {
        return;
      }
      await this.previewScriptEditorProjectRuntime();
      return;
    }

    if (action === "exit-runtime-preview") {
      this.exitScriptEditorRuntimePreview();
      return;
    }

    if (action === "export") {
      if (this.handleScriptEditorBlockedRuntimeAction()) {
        return;
      }
      await this.exportScriptEditorProject();
      return;
    }

    if (action === "toggle-preview-panel") {
      this.toggleScriptEditorAuxiliaryPanel();
      return;
    }

    if (action === "jump-to-preview-issue") {
      if (targetFamily != null) {
        this.jumpToScriptEditorIssue(targetFamily, targetEntityId, targetTab);
      }
      return;
    }

    if (action === "open-stage-configuration-help") {
      this.scriptEditorStageConfigurationHelpOpen = true;
      this.render();
      return;
    }

    if (action === "close-stage-configuration-help") {
      this.scriptEditorStageConfigurationHelpOpen = false;
      this.render();
      return;
    }

    if (action === "open-dialogue-help") {
      this.scriptEditorDialogueHelpOpen = true;
      this.render();
      return;
    }

    if (action === "close-dialogue-help") {
      this.scriptEditorDialogueHelpOpen = false;
      this.render();
      return;
    }

    if (action === "add-stage-configuration-binding") {
      this.addScriptEditorStageConfigurationBinding();
      return;
    }

    if (action === "remove-stage-configuration-binding") {
      this.removeScriptEditorStageConfigurationBinding();
      return;
    }

    if (action === "add-stage-configuration-track") {
      this.addScriptEditorStageConfigurationTrack();
      return;
    }

    if (action === "remove-stage-configuration-track") {
      this.removeScriptEditorStageConfigurationTrack();
      return;
    }

    if (action === "add-record") {
      this.addScriptEditorRecord();
      return;
    }

    if (action === "remove-record") {
      this.removeScriptEditorRecord();
      return;
    }

    if (action === "add-item-custom-property") {
      this.addScriptEditorItemCustomProperty();
      return;
    }

    if (action === "remove-item-custom-property") {
      if (Number.isInteger(itemCustomPropertyIndex) && itemCustomPropertyIndex >= 0) {
        this.removeScriptEditorItemCustomProperty(itemCustomPropertyIndex);
      }
      return;
    }

    if (action === "add-progress-track-tier") {
      this.addScriptEditorProgressTrackTier();
      return;
    }

    if (action === "remove-progress-track-tier") {
      const tierIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorProgressTrackTierIndex ?? "-1",
        10
      );
      if (Number.isInteger(tierIndex) && tierIndex >= 0) {
        this.removeScriptEditorProgressTrackTier(tierIndex);
      }
      return;
    }

    if (action === "apply-record-json") {
      this.applyScriptEditorRecordJson();
      return;
    }

    if (action === "apply-text-entry-text") {
      this.applyScriptEditorTextEntryText();
      return;
    }

    if (action === "record-page-prev") {
      this.changeScriptEditorRecordListPage(-1);
      return;
    }

    if (action === "record-page-next") {
      this.changeScriptEditorRecordListPage(1);
      return;
    }

    if (action === "menu-module-item-page-prev") {
      const instanceId =
        actionElement?.dataset.scriptEditorLocationMenuInstanceId ?? "";
      this.changeScriptEditorMenuModuleItemPage(instanceId, -1);
      return;
    }

    if (action === "menu-module-item-page-next") {
      const instanceId =
        actionElement?.dataset.scriptEditorLocationMenuInstanceId ?? "";
      this.changeScriptEditorMenuModuleItemPage(instanceId, 1);
      return;
    }

    if (action === "select-person-tab") {
      if (personTab != null) {
        this.selectScriptEditorPersonTab(personTab);
      }
      return;
    }

    if (action === "add-person-attribute") {
      this.addScriptEditorPersonAttribute();
      return;
    }

    if (action === "person-attribute-page-prev") {
      this.changeScriptEditorPersonAttributePage(-1);
      return;
    }

    if (action === "person-attribute-page-next") {
      this.changeScriptEditorPersonAttributePage(1);
      return;
    }

    if (action === "remove-person-attribute") {
      if (Number.isInteger(personAttributeIndex) && personAttributeIndex >= 0) {
        this.removeScriptEditorPersonAttribute(personAttributeIndex);
      }
      return;
    }

    if (action === "add-person-attribute-group") {
      this.addScriptEditorPersonAttributeGroup();
      return;
    }

    if (action === "remove-person-attribute-group") {
      const groupId =
        actionElement?.dataset.scriptEditorPersonAttributeGroupId ?? "";
      if (groupId.length > 0) {
        this.removeScriptEditorPersonAttributeGroup(groupId);
      }
      return;
    }

    if (action === "open-person-attribute-group-picker") {
      const groupId =
        actionElement?.dataset.scriptEditorPersonAttributeGroupId ?? "";
      if (groupId.length > 0) {
        this.toggleScriptEditorPersonAttributeGroupPicker(groupId);
      }
      return;
    }

    if (action === "add-person-attribute-group-item") {
      const groupId =
        actionElement?.dataset.scriptEditorPersonAttributeGroupId ?? "";
      const attributeKey =
        actionElement?.dataset.scriptEditorPersonAttributeKey ?? "";
      if (groupId.length > 0 && attributeKey.length > 0) {
        this.addScriptEditorPersonAttributeGroupItem(groupId, attributeKey);
      }
      return;
    }

    if (action === "remove-person-attribute-group-item") {
      const groupId =
        actionElement?.dataset.scriptEditorPersonAttributeGroupId ?? "";
      const attributeKey =
        actionElement?.dataset.scriptEditorPersonAttributeKey ?? "";
      if (groupId.length > 0 && attributeKey.length > 0) {
        this.removeScriptEditorPersonAttributeGroupItem(groupId, attributeKey);
      }
      return;
    }

    if (action === "person-attribute-group-page-prev") {
      this.changeScriptEditorPersonAttributeGroupPage(-1);
      return;
    }

    if (action === "person-attribute-group-page-next") {
      this.changeScriptEditorPersonAttributeGroupPage(1);
      return;
    }

    if (action === "person-attribute-group-item-page-prev") {
      const groupId =
        actionElement?.dataset.scriptEditorPersonAttributeGroupId ?? "";
      if (groupId.length > 0) {
        this.changeScriptEditorPersonAttributeGroupItemPage(groupId, -1);
      }
      return;
    }

    if (action === "person-attribute-group-item-page-next") {
      const groupId =
        actionElement?.dataset.scriptEditorPersonAttributeGroupId ?? "";
      if (groupId.length > 0) {
        this.changeScriptEditorPersonAttributeGroupItemPage(groupId, 1);
      }
      return;
    }

    if (action === "add-person-dialogue-link") {
      this.addScriptEditorPersonRelation("dialogueIds");
      return;
    }

    if (action === "remove-person-dialogue-link") {
      if (Number.isInteger(personRelationIndex) && personRelationIndex >= 0) {
        this.removeScriptEditorPersonRelation("dialogueIds", personRelationIndex);
      }
      return;
    }

    if (action === "add-person-event-link") {
      this.addScriptEditorPersonRelation("eventIds");
      return;
    }

    if (action === "remove-person-event-link") {
      if (Number.isInteger(personRelationIndex) && personRelationIndex >= 0) {
        this.removeScriptEditorPersonRelation("eventIds", personRelationIndex);
      }
      return;
    }

    if (action === "add-owner-menu-mount") {
      if (ownerFamily != null && ownerId != null) {
        this.addScriptEditorOwnerMenuMount(ownerFamily, ownerId, actionElement);
      }
      return;
    }

    if (action === "remove-owner-menu-mount") {
      const mountIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorOwnerMenuMountIndex ?? "-1",
        10
      );
      if (
        ownerFamily != null &&
        ownerId != null &&
        Number.isInteger(mountIndex) &&
        mountIndex >= 0
      ) {
        this.removeScriptEditorOwnerMenuMount(ownerFamily, ownerId, mountIndex);
      }
      return;
    }

    if (action === "select-location-tab") {
      if (locationTab != null) {
        this.selectScriptEditorLocationTab(locationTab);
      }
      return;
    }

    if (action === "add-location-menu-entry") {
      this.addScriptEditorLocationMenuEntry();
      return;
    }

    if (action === "remove-location-menu-entry") {
      const instanceId =
        actionElement?.dataset.scriptEditorLocationMenuInstanceId ?? "";
      if (Number.isInteger(locationMenuIndex) && locationMenuIndex >= 0) {
        this.removeScriptEditorLocationMenuEntry(instanceId, locationMenuIndex);
      }
      return;
    }

    if (action === "add-location-access-condition") {
      const conditionField =
        actionElement
          ?.closest("[data-script-editor-location-access-condition-scope]")
          ?.dataset.scriptEditorLocationAccessConditionScope ??
        "conditionExpression";
      this.addScriptEditorLocationAccessCondition(conditionField);
      return;
    }

    if (action === "clear-location-access-conditions") {
      const conditionField =
        actionElement
          ?.closest("[data-script-editor-location-access-condition-scope]")
          ?.dataset.scriptEditorLocationAccessConditionScope ??
        "conditionExpression";
      this.clearScriptEditorLocationAccessConditions(conditionField);
      return;
    }

    if (action === "remove-location-access-condition") {
      if (
        Number.isInteger(locationAccessConditionIndex) &&
        locationAccessConditionIndex >= 0
      ) {
        const conditionField =
          actionElement
            ?.closest("[data-script-editor-location-access-condition-scope]")
            ?.dataset.scriptEditorLocationAccessConditionScope ??
          "conditionExpression";
        this.removeScriptEditorLocationAccessCondition(
          locationAccessConditionIndex,
          conditionField
        );
      }
      return;
    }

    if (action === "add-location-attribute") {
      this.addScriptEditorLocationAttribute();
      return;
    }

    if (action === "remove-location-attribute") {
      const locationAttributeIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorLocationAttributeIndex ?? "-1",
        10
      );
      if (Number.isInteger(locationAttributeIndex) && locationAttributeIndex >= 0) {
        this.removeScriptEditorLocationAttribute(locationAttributeIndex);
      }
      return;
    }

    if (action === "add-city-mounted-building") {
      this.addScriptEditorCityMountedBuilding();
      return;
    }

    if (action === "toggle-city-mounted-building-expanded") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        const expanded = this.getScriptEditorCityMountedBuildingUiState(
          mountedBuildingIndex
        ).expanded;
        this.setScriptEditorCityMountedBuildingExpanded(
          mountedBuildingIndex,
          !expanded
        );
      }
      return;
    }

    if (action === "remove-city-mounted-building") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        this.removeScriptEditorCityMountedBuilding(mountedBuildingIndex);
      }
      return;
    }

    if (action === "add-city-mounted-building-npc") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        this.addScriptEditorCityMountedBuildingNpc(mountedBuildingIndex);
      }
      return;
    }

    if (action === "remove-city-mounted-building-npc") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      const mountedNpcIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingNpcIndex ?? "-1",
        10
      );
      if (
        Number.isInteger(mountedBuildingIndex) &&
        mountedBuildingIndex >= 0 &&
        Number.isInteger(mountedNpcIndex) &&
        mountedNpcIndex >= 0
      ) {
        this.removeScriptEditorCityMountedBuildingNpc(
          mountedBuildingIndex,
          mountedNpcIndex
        );
      }
      return;
    }

    if (action === "city-mounted-building-page-prev") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        this.changeScriptEditorCityMountedBuildingNpcPage(mountedBuildingIndex, -1);
      }
      return;
    }

    if (action === "city-mounted-building-list-page-prev") {
      this.changeScriptEditorCityMountedBuildingListPage(-1);
      return;
    }

    if (action === "city-mounted-building-list-page-next") {
      this.changeScriptEditorCityMountedBuildingListPage(1);
      return;
    }

    if (action === "city-mounted-building-page-next") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        this.changeScriptEditorCityMountedBuildingNpcPage(mountedBuildingIndex, 1);
      }
      return;
    }

    if (action === "add-building-arrangement") {
      this.addScriptEditorBuildingArrangement(buildingId);
      return;
    }

    if (action === "remove-building-arrangement") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      if (arrangementId.length > 0) {
        this.removeScriptEditorBuildingArrangement(arrangementId);
      }
      return;
    }

    if (action === "add-building-arrangement-npc") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      if (arrangementId.length > 0) {
        this.addScriptEditorBuildingArrangementNpc(arrangementId);
      }
      return;
    }

    if (action === "remove-building-arrangement-npc") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      const npcIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorBuildingArrangementNpcIndex ?? "-1",
        10
      );
      if (arrangementId.length > 0 && Number.isInteger(npcIndex) && npcIndex >= 0) {
        this.removeScriptEditorBuildingArrangementNpc(arrangementId, npcIndex);
      }
      return;
    }

    if (action === "add-building-layout-node") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      if (arrangementId.length > 0) {
        this.addScriptEditorBuildingLayoutNode(arrangementId);
      }
      return;
    }

    if (action === "remove-building-layout-node") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      const nodeIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorBuildingLayoutNodeIndex ?? "-1",
        10
      );
      if (arrangementId.length > 0 && Number.isInteger(nodeIndex) && nodeIndex >= 0) {
        this.removeScriptEditorBuildingLayoutNode(arrangementId, nodeIndex);
      }
      return;
    }

    if (action === "add-building-arrangement-container") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      if (arrangementId.length > 0) {
        this.addScriptEditorBuildingArrangementContainer(arrangementId);
      }
      return;
    }

    if (action === "remove-building-arrangement-container") {
      const arrangementId = actionElement?.dataset.scriptEditorBuildingArrangementId ?? "";
      const containerIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorBuildingContainerIndex ?? "-1",
        10
      );
      if (
        arrangementId.length > 0 &&
        Number.isInteger(containerIndex) &&
        containerIndex >= 0
      ) {
        this.removeScriptEditorBuildingArrangementContainer(arrangementId, containerIndex);
      }
      return;
    }

    if (action === "select-narrative-tab") {
      if (narrativeTab != null) {
        this.selectScriptEditorNarrativeTab(narrativeTab);
      }
      return;
    }

    if (action === "select-event-tab") {
      if (eventTab != null) {
        this.selectScriptEditorEventTab(eventTab);
      }
      return;
    }

    if (action === "select-minigame-tab") {
      if (minigameTab != null) {
        this.selectScriptEditorMinigameTab(minigameTab);
      }
      return;
    }

    if (action === "add-story-related-people") {
      this.addScriptEditorStoryRelation("relatedPersonIds");
      return;
    }

    if (action === "remove-story-related-people") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorStoryRelation("relatedPersonIds", relationIndex);
      }
      return;
    }

    if (action === "add-story-related-dialogues") {
      this.addScriptEditorStoryRelation("relatedDialogueIds");
      return;
    }

    if (action === "remove-story-related-dialogues") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorStoryRelation("relatedDialogueIds", relationIndex);
      }
      return;
    }

    if (action === "add-story-related-events") {
      this.addScriptEditorStoryRelation("relatedEventIds");
      return;
    }

    if (action === "remove-story-related-events") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorStoryRelation("relatedEventIds", relationIndex);
      }
      return;
    }

    if (action === "add-dialogue-cast") {
      this.addScriptEditorDialogueCast();
      return;
    }

    if (action === "remove-dialogue-cast") {
      if (Number.isInteger(dialogueCastIndex) && dialogueCastIndex >= 0) {
        this.removeScriptEditorDialogueCast(dialogueCastIndex);
      }
      return;
    }

    if (action === "add-dialogue-option") {
      this.addScriptEditorDialogueOption();
      return;
    }

    if (action === "remove-dialogue-option") {
      if (Number.isInteger(dialogueOptionIndex) && dialogueOptionIndex >= 0) {
        this.removeScriptEditorDialogueOption(dialogueOptionIndex);
      }
      return;
    }

    if (action === "add-settlement-content") {
      this.addScriptEditorSettlementContent();
      return;
    }

    if (action === "remove-settlement-content") {
      const settlementContentIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorSettlementContentIndex ?? "-1",
        10
      );
      if (Number.isInteger(settlementContentIndex) && settlementContentIndex >= 0) {
        this.removeScriptEditorSettlementContent(settlementContentIndex);
      }
      return;
    }

    if (action === "add-event-binding") {
      this.addScriptEditorEventBinding();
      return;
    }

    if (action === "add-owner-local-event-binding") {
      if (ownerFamily != null && ownerId != null) {
        this.addScriptEditorEventBinding({ ownerFamily, ownerId });
      }
      return;
    }

    if (action === "remove-event-binding") {
      if (eventBindingId != null) {
        this.removeScriptEditorEventBinding(eventBindingId);
      }
      return;
    }

    if (action === "remove-owner-local-event-binding") {
      if (eventBindingId != null) {
        this.removeScriptEditorEventBinding(eventBindingId);
      }
      return;
    }

    if (action === "add-event-binding-condition-item") {
      if (eventBindingId != null) {
        this.addScriptEditorEventBindingConditionItem(eventBindingId);
      }
      return;
    }

    if (action === "remove-event-binding-condition-item") {
      if (
        eventBindingId != null &&
        Number.isInteger(eventBindingConditionItemIndex) &&
        eventBindingConditionItemIndex >= 0
      ) {
        this.removeScriptEditorEventBindingConditionItem(
          eventBindingId,
          eventBindingConditionItemIndex
        );
      }
      return;
    }

    if (action === "add-event-related-people") {
      this.addScriptEditorEventRelation("personIds");
      return;
    }

    if (action === "remove-event-related-people") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorEventRelation("personIds", relationIndex);
      }
      return;
    }

    if (action === "add-event-related-cities") {
      this.addScriptEditorEventRelation("cityIds");
      return;
    }

    if (action === "remove-event-related-cities") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorEventRelation("cityIds", relationIndex);
      }
      return;
    }

    if (action === "add-event-related-buildings") {
      this.addScriptEditorEventRelation("buildingIds");
      return;
    }

    if (action === "remove-event-related-buildings") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorEventRelation("buildingIds", relationIndex);
      }
      return;
    }

    if (action === "add-minigame-launch-payload-entry") {
      this.addScriptEditorMinigameLaunchPayloadEntry();
      return;
    }

    if (action === "remove-minigame-launch-payload-entry") {
      if (Number.isInteger(minigameLaunchIndex) && minigameLaunchIndex >= 0) {
        this.removeScriptEditorMinigameLaunchPayloadEntry(minigameLaunchIndex);
      }
      return;
    }

    if (action === "add-minigame-outcome-route") {
      this.addScriptEditorMinigameOutcomeRoute();
      return;
    }

    if (action === "remove-minigame-outcome-route") {
      if (Number.isInteger(minigameOutcomeIndex) && minigameOutcomeIndex >= 0) {
        this.removeScriptEditorMinigameOutcomeRoute(minigameOutcomeIndex);
      }
      return;
    }
  }

  selectScriptEditorFamily(family, entityId = null) {
    if (
      this.scriptEditorProject == null ||
      (family !== SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY &&
        !isScriptEditorMinimalWorkflowFamily(family))
    ) {
      return;
    }

    if (!isScriptEditorVisibleWorkflowFamily(family)) {
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorStageConfigurationHelpOpen = false;
      this.scriptEditorDialogueHelpOpen = false;
      this.scriptEditorNotice = null;
      this.refreshScriptEditorWorkspace();
      return;
    }

    if (family === "storyPack") {
      this.scriptEditorSelection = {
        family,
        entityId: null,
      };
      this.scriptEditorStageConfigurationHelpOpen = false;
      this.scriptEditorDialogueHelpOpen = false;
      this.scriptEditorNotice = null;
      this.refreshScriptEditorWorkspace();
      return;
    }

    const records =
      family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
        ? this.getScriptEditorStageConfigurationBindings()
        : listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    const resolvedEntityId =
      records.find((record) => record.id === entityId)?.id ??
      records[0]?.id ??
      null;

    this.scriptEditorSelection = {
      family,
      entityId: resolvedEntityId,
    };
    if (resolvedEntityId == null) {
      this.setScriptEditorRecordListPage(family, 1);
    } else {
      this.syncScriptEditorRecordListPageToRecord(family, resolvedEntityId, records);
    }
    if (family === "people") {
      this.scriptEditorPersonTab = "profile";
      this.resetScriptEditorPersonAttributePage();
    }
    if (family === "cities" || family === "buildings") {
      this.scriptEditorLocationTab = "profile";
    }
    if (family === "storyNodes" || family === "dialogues") {
      this.scriptEditorNarrativeTab = "profile";
    }
    if (family === "events") {
      this.scriptEditorEventTab = "basics";
    }
    if (family === "minigames") {
      this.scriptEditorMinigameTab = "basics";
    }
    this.scriptEditorStageConfigurationHelpOpen = false;
    this.scriptEditorDialogueHelpOpen = false;
    this.scriptEditorNotice = null;
    this.refreshScriptEditorWorkspace();
  }

  selectScriptEditorRecord(recordId) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    const records =
      family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
        ? this.getScriptEditorStageConfigurationBindings()
        : listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    if (!records.some((record) => record.id === recordId)) {
      return;
    }

    this.scriptEditorSelection = {
      family,
      entityId: recordId,
    };
    this.syncScriptEditorRecordListPageToRecord(family, recordId, records);
    if (family === "people") {
      this.scriptEditorPersonTab = "profile";
      this.resetScriptEditorPersonAttributePage();
    }
    if (family === "cities" || family === "buildings") {
      this.scriptEditorLocationTab = "profile";
    }
    if (family === "storyNodes" || family === "dialogues") {
      this.scriptEditorNarrativeTab = "profile";
    }
    if (family === "events") {
      this.scriptEditorEventTab = "basics";
    }
    if (family === "minigames") {
      this.scriptEditorMinigameTab = "basics";
    }
    this.scriptEditorStageConfigurationHelpOpen = false;
    this.scriptEditorDialogueHelpOpen = false;
    this.scriptEditorNotice = null;
    this.refreshScriptEditorWorkspace();
  }

  changeScriptEditorRecordListPage(delta) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    this.setScriptEditorRecordListPage(
      family,
      this.getScriptEditorRecordListPage(family) + delta
    );
    this.refreshScriptEditorWorkspace();
  }

  goToScriptEditorRecordListPage(page) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    this.setScriptEditorRecordListPage(this.scriptEditorSelection.family, page);
    this.refreshScriptEditorWorkspace();
  }

  selectScriptEditorPersonTab(tab) {
    if (this.scriptEditorSelection.family !== "people") {
      return;
    }

    if (
      !["profile", "attribute-group", "dialogues", "menus", "trade", "events"].includes(
        tab
      )
    ) {
      return;
    }

    this.scriptEditorPersonTab = tab;
    this.refreshScriptEditorWorkspace();
  }

  changeScriptEditorPersonAttributePage(delta) {
    if (this.scriptEditorSelection.family !== "people") {
      return;
    }

    const person = this.getSelectedScriptEditorPerson();
    const totalPages = Math.max(
      1,
      Math.ceil(
        (person?.attributeMappings?.length ?? 0) / 10
      )
    );
    this.scriptEditorPersonAttributePage = Math.min(
      Math.max(this.scriptEditorPersonAttributePage + delta, 1),
      totalPages
    );
    this.scriptEditorPersonAttributeVisibleIndices = null;
    this.scriptEditorPersonAttributeScrollLeft = 0;
    this.refreshScriptEditorWorkspace();
  }

  selectScriptEditorLocationTab(tab) {
    if (
      this.scriptEditorSelection.family !== "cities" &&
      this.scriptEditorSelection.family !== "buildings"
    ) {
      return;
    }

    const allowedTabs = this.scriptEditorSelection.family === "cities"
      ? ["profile", "mounted", "arrangements", "menus", "access", "events"]
      : ["profile", "menus", "access", "entry", "events"];
    if (!allowedTabs.includes(tab)) {
      return;
    }

    this.scriptEditorLocationTab = tab;
    this.refreshScriptEditorWorkspace();
  }

  selectScriptEditorNarrativeTab(tab) {
    if (
      this.scriptEditorSelection.family !== "storyNodes" &&
      this.scriptEditorSelection.family !== "dialogues"
    ) {
      return;
    }

    const allowedTabs =
      this.scriptEditorSelection.family === "storyNodes"
        ? ["profile", "links", "summary", "events"]
        : ["profile", "nodes", "summary", "events"];
    if (!allowedTabs.includes(tab)) {
      return;
    }

    this.scriptEditorNarrativeTab = tab;
    this.refreshScriptEditorWorkspace();
  }

  selectScriptEditorEventTab(tab) {
    if (this.scriptEditorSelection.family !== "events") {
      return;
    }

    if (!["basics"].includes(tab)) {
      return;
    }

    this.scriptEditorEventTab = tab;
    this.refreshScriptEditorWorkspace();
  }

  selectScriptEditorMinigameTab(tab) {
    if (this.scriptEditorSelection.family !== "minigames") {
      return;
    }

    if (!["basics", "launch", "settlement", "references", "events"].includes(tab)) {
      return;
    }

    this.scriptEditorMinigameTab = tab;
    this.refreshScriptEditorWorkspace();
  }

  toggleScriptEditorAuxiliaryPanel(forceValue) {
    this.scriptEditorAuxiliaryPanelOpen =
      typeof forceValue === "boolean"
        ? forceValue
        : !this.scriptEditorAuxiliaryPanelOpen;
    this.render();
  }

  jumpToScriptEditorIssue(family, entityId, targetTab = null) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.scriptEditorAuxiliaryPanelOpen = true;
    this.selectScriptEditorFamily(family, entityId);

    if (family === "people" && targetTab != null) {
      this.selectScriptEditorPersonTab(targetTab);
      return;
    }

    if ((family === "cities" || family === "buildings") && targetTab != null) {
      this.selectScriptEditorLocationTab(targetTab);
      return;
    }

    if ((family === "storyNodes" || family === "dialogues") && targetTab != null) {
      this.selectScriptEditorNarrativeTab(targetTab);
      return;
    }

    if (family === "events" && targetTab != null) {
      this.selectScriptEditorEventTab(targetTab);
      return;
    }

    if (family === "minigames" && targetTab != null) {
      this.selectScriptEditorMinigameTab(targetTab);
    }
  }

  addScriptEditorRecord() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    if (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) {
      this.addScriptEditorStageConfigurationBinding();
      return;
    }

    if (family === "menuResources") {
      const result = appendScriptEditorMenuModuleRecord(this.scriptEditorProject);
      this.scriptEditorRecordSearch = {
        ...this.scriptEditorRecordSearch,
        [family]: "",
      };
      this.commitScriptEditorMenuProject(result.project);
      const nextRecords = listScriptEditorWorkflowFamilyRecords(
        this.scriptEditorProject,
        family
      );
      this.scriptEditorSelection = {
        family,
        entityId: result.instanceId,
      };
      this.syncScriptEditorRecordListPageToRecord(
        family,
        result.instanceId,
        nextRecords
      );
      this.recordScriptEditorNotice({
        tone: "success",
        message: "已新增一条菜单项草稿。",
      });
      this.render();
      return;
    }

    this.scriptEditorRecordSearch = {
      ...this.scriptEditorRecordSearch,
      [family]: "",
    };
    const draft = createScriptEditorWorkflowRecordDraft(
      family,
      this.scriptEditorProject
    );

    this.commitScriptEditorProject(
      upsertScriptEditorWorkflowRecord(this.scriptEditorProject, family, draft)
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    this.scriptEditorSelection = {
      family,
      entityId: draft.id,
    };
    this.syncScriptEditorRecordListPageToRecord(family, draft.id, nextRecords);
    if (family === "people") {
      this.scriptEditorPersonTab = "profile";
    }
    if (family === "cities" || family === "buildings") {
      this.scriptEditorLocationTab = "profile";
    }
    if (family === "storyNodes" || family === "dialogues") {
      this.scriptEditorNarrativeTab = "profile";
    }
    if (family === "events") {
      this.scriptEditorEventTab = "basics";
    }
    if (family === "minigames") {
      this.scriptEditorMinigameTab = "basics";
    }
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已新增一条${this.getScriptEditorFamilyLabel(family)}记录草稿。`,
    });
    this.render();
  }

  removeScriptEditorRecord() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    if (family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) {
      this.removeScriptEditorStageConfigurationBinding();
      return;
    }

    if (family === "menuResources") {
      const removedId = this.scriptEditorSelection.entityId;
      this.commitScriptEditorMenuProject(
        removeScriptEditorMenuModuleRecord(this.scriptEditorProject, removedId)
      );
      const nextRecords = listScriptEditorWorkflowFamilyRecords(
        this.scriptEditorProject,
        family
      );
      this.scriptEditorSelection = {
        family,
        entityId: nextRecords[0]?.id ?? null,
      };
      if (this.scriptEditorSelection.entityId != null) {
        this.syncScriptEditorRecordListPageToRecord(
          family,
          this.scriptEditorSelection.entityId,
          nextRecords
        );
      } else {
        this.setScriptEditorRecordListPage(family, 1);
      }
      this.recordScriptEditorNotice({
        tone: "success",
        message: "已删除当前菜单项。",
      });
      this.render();
      return;
    }

    this.commitScriptEditorProject(
      removeScriptEditorWorkflowRecord(
        this.scriptEditorProject,
        family,
        this.scriptEditorSelection.entityId
      )
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    this.scriptEditorSelection = {
      family,
      entityId: nextRecords[0]?.id ?? null,
    };
    if (nextRecords[0]?.id != null) {
      this.syncScriptEditorRecordListPageToRecord(family, nextRecords[0].id, nextRecords);
    } else {
      this.setScriptEditorRecordListPage(family, 1);
    }
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已删除当前选中的${this.getScriptEditorFamilyLabel(family)}记录。`,
    });
    this.render();
  }

  applyScriptEditorRecordJson() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack" ||
      this.scriptEditorSelection.family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
    ) {
      return;
    }

    const textarea = this.overlayRoot.querySelector("[data-script-editor-record-json]");
    if (!(textarea instanceof globalThis.HTMLTextAreaElement)) {
      return;
    }

    try {
      const parsed = JSON.parse(textarea.value);
      if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Record JSON must be a single object.");
      }
      if (typeof parsed.id !== "string" || parsed.id.trim().length === 0) {
        throw new Error("Record JSON must include a non-empty string id.");
      }

      const family = this.scriptEditorSelection.family;
      this.commitScriptEditorProject(
        upsertScriptEditorWorkflowRecord(this.scriptEditorProject, family, parsed)
      );
      const nextRecords = listScriptEditorWorkflowFamilyRecords(
        this.scriptEditorProject,
        family
      );
      this.scriptEditorSelection = {
        family,
        entityId: parsed.id,
      };
      this.syncScriptEditorRecordListPageToRecord(family, parsed.id, nextRecords);
      this.recordScriptEditorNotice({
        tone: "success",
        message: `已将 JSON 修改应用到${this.getScriptEditorFamilyLabel(family)}：${parsed.id}。`,
      });
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error
            ? error.message
            : "Failed to apply record JSON.",
      });
    }

    this.render();
  }

  applyScriptEditorTextEntryText() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "textEntries" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    const textarea = this.overlayRoot.querySelector("[data-script-editor-text-entry-text]");
    if (!(textarea instanceof globalThis.HTMLTextAreaElement)) {
      return;
    }

    const text = textarea.value;
    const recordId = this.scriptEditorSelection.entityId;
    const nextRecord = {
      ...(this.scriptEditorProject.textEntries.find((record) => record.id === recordId) ?? {
        id: recordId,
      }),
      id: recordId,
      text,
    };

    this.commitScriptEditorProject(
      upsertScriptEditorWorkflowRecord(this.scriptEditorProject, "textEntries", nextRecord)
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      "textEntries"
    );
    this.scriptEditorSelection = {
      family: "textEntries",
      entityId: recordId,
    };
    this.syncScriptEditorRecordListPageToRecord("textEntries", recordId, nextRecords);
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已应用文本修改：${recordId}。`,
    });
    this.render();
  }

  applyScriptEditorProjectField(field, value) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const normalizedValue = value.trim();
    const scenarioProfile = {
      ...(this.scriptEditorProject.storyPack.scenarioProfile ?? {}),
      initialLocation: {
        ...(this.scriptEditorProject.storyPack.scenarioProfile?.initialLocation ?? {}),
      },
      launchPolicy: {
        ...(this.scriptEditorProject.storyPack.scenarioProfile?.launchPolicy ?? {}),
      },
    };

    let nextProject = this.scriptEditorProject;

    switch (field) {
      case "project.id":
        nextProject = {
          ...nextProject,
          id: normalizedValue,
        };
        break;
      case "project.title":
        nextProject = {
          ...nextProject,
          title: value,
        };
        break;
      case "project.description":
        nextProject = {
          ...nextProject,
          description: normalizedValue.length === 0 ? undefined : value,
        };
        break;
      case "storyPack.id":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          id: normalizedValue,
        });
        break;
      case "storyPack.title":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          title: value,
        });
        break;
      case "storyPack.description":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          description: normalizedValue.length === 0 ? undefined : value,
        });
        break;
      case "scenarioProfile.id":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            id: normalizedValue,
          },
        });
        break;
      case "scenarioProfile.title":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            title: value,
          },
        });
        break;
      case "scenarioProfile.playerCharacterId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            playerCharacterId: normalizedValue,
          },
        });
        break;
      case "scenarioProfile.chapterId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            chapterId: normalizedValue,
          },
        });
        break;
      case "scenarioProfile.initialLocation.mapId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              mapId: normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.cityId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              cityId: normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.houseId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              houseId: normalizedValue.length === 0 ? null : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.view":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              view: normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.entryEventId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            entryEventId: normalizedValue.length === 0 ? undefined : normalizedValue,
          },
        });
        break;
      case "scenarioProfile.launchPolicy.characterSelection":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            launchPolicy: {
              ...scenarioProfile.launchPolicy,
              characterSelection:
                normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.launchPolicy.initialView":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            launchPolicy: {
              ...scenarioProfile.launchPolicy,
              initialView: normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.launchPolicy.entryEventTiming":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            launchPolicy: {
              ...scenarioProfile.launchPolicy,
              entryEventTiming:
                normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      default:
        return;
    }

    this.commitScriptEditorProject(nextProject);
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorPersonField(field, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonField(person, field, value)
    );
  }

  applyScriptEditorPortraitField(field, value) {
    const portrait = this.getSelectedScriptEditorPortrait();
    if (portrait == null) {
      return;
    }

    this.replaceSelectedScriptEditorPortrait(
      updateScriptEditorPortraitField(portrait, field, value)
    );
  }

  applyScriptEditorPortraitVariantField(field, value) {
    const variant = this.getSelectedScriptEditorPortraitVariant();
    if (variant == null) {
      return;
    }

    this.replaceSelectedScriptEditorPortraitVariant(
      updateScriptEditorPortraitVariantField(variant, field, value)
    );
  }

  applyScriptEditorPersonTradeEnabled(enabled) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      toggleScriptEditorPersonTradeEnabled(person, enabled)
    );
  }

  addScriptEditorPersonAttribute() {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const nextPerson = appendScriptEditorPersonAttribute(person);
    this.scriptEditorPersonAttributePage = Math.max(
      1,
      Math.ceil((nextPerson.attributeMappings?.length ?? 0) / 10)
    );
    this.scriptEditorPersonAttributeVisibleIndices = null;
    this.scriptEditorPersonAttributeScrollLeft = 0;
    this.replaceSelectedScriptEditorPerson(nextPerson);
  }

  removeScriptEditorPersonAttribute(index) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const nextPerson = removeScriptEditorPersonAttribute(person, index);
    const nextAttributeCount = nextPerson.attributeMappings?.length ?? 0;
    const nextTotalPages = Math.max(1, Math.ceil(nextAttributeCount / 10));

    if (this.scriptEditorPersonAttributePage > nextTotalPages) {
      this.scriptEditorPersonAttributePage = nextTotalPages;
      this.scriptEditorPersonAttributeVisibleIndices = null;
      this.scriptEditorPersonAttributeScrollLeft = 0;
    } else if (Array.isArray(this.scriptEditorPersonAttributeVisibleIndices)) {
      this.scriptEditorPersonAttributeVisibleIndices =
        this.scriptEditorPersonAttributeVisibleIndices
          .filter((visibleIndex) => visibleIndex !== index)
          .map((visibleIndex) =>
            visibleIndex > index ? visibleIndex - 1 : visibleIndex
          )
          .filter(
            (visibleIndex) =>
              visibleIndex >= 0 && visibleIndex < nextAttributeCount
          );
    }

    this.replaceSelectedScriptEditorPerson(nextPerson);
  }

  applyScriptEditorPersonAttributeField(index, field, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonAttribute(person, index, field, value)
    );
  }

  addScriptEditorPersonAttributeGroup() {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const nextPerson = appendScriptEditorPersonAttributeGroup(person);
    const totalGroups = Object.keys(nextPerson.attributeGroup ?? {}).length;
    this.scriptEditorPersonAttributeGroupPage = Math.max(
      1,
      Math.ceil(totalGroups / 3)
    );
    this.replaceSelectedScriptEditorPerson(nextPerson);
  }

  removeScriptEditorPersonAttributeGroup(groupId) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const nextPerson = removeScriptEditorPersonAttributeGroup(person, groupId);
    const totalGroups = Object.keys(nextPerson.attributeGroup ?? {}).length;
    const totalPages = Math.max(1, Math.ceil(totalGroups / 3));
    this.scriptEditorPersonAttributeGroupPage = Math.min(
      this.scriptEditorPersonAttributeGroupPage,
      totalPages
    );
    this.scriptEditorPersonAttributeGroupOpenPickerId =
      this.scriptEditorPersonAttributeGroupOpenPickerId === groupId
        ? null
        : this.scriptEditorPersonAttributeGroupOpenPickerId;
    const nextItemPages = {
      ...this.scriptEditorPersonAttributeGroupItemPageById,
    };
    delete nextItemPages[groupId];
    this.scriptEditorPersonAttributeGroupItemPageById = nextItemPages;
    this.replaceSelectedScriptEditorPerson(nextPerson);
  }

  applyScriptEditorPersonAttributeGroupField(groupId, field, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonAttributeGroupField(person, groupId, field, value)
    );
  }

  applyScriptEditorPersonAttributeGroupItem(groupId, attributeKey, enabled) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      toggleScriptEditorPersonAttributeGroupItem(
        person,
        groupId,
        attributeKey,
        enabled
      )
    );
  }

  toggleScriptEditorPersonAttributeGroupPicker(groupId) {
    if (this.scriptEditorPersonAttributeGroupOpenPickerId === groupId) {
      return;
    }

    this.scriptEditorPersonAttributeGroupOpenPickerId = groupId;
    this.render();
  }

  changeScriptEditorPersonAttributeGroupPage(delta) {
    if (this.scriptEditorSelection.family !== "people") {
      return;
    }

    const person = this.getSelectedScriptEditorPerson();
    const totalPages = Math.max(
      1,
      Math.ceil(Object.keys(person?.attributeGroup ?? {}).length / 3)
    );
    this.scriptEditorPersonAttributeGroupPage = Math.min(
      Math.max(this.scriptEditorPersonAttributeGroupPage + delta, 1),
      totalPages
    );
    this.render();
  }

  changeScriptEditorPersonAttributeGroupItemPage(groupId, delta) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const group = person.attributeGroup?.[groupId];
    const totalPages = Math.max(
      1,
      Math.ceil((group?.attributeKeys?.length ?? 0) / 10)
    );
    this.scriptEditorPersonAttributeGroupItemPageById = {
      ...this.scriptEditorPersonAttributeGroupItemPageById,
      [groupId]: Math.min(
        Math.max(
          (this.scriptEditorPersonAttributeGroupItemPageById[groupId] ?? 1) + delta,
          1
        ),
        totalPages
      ),
    };
    this.render();
  }

  addScriptEditorPersonAttributeGroupItem(groupId, attributeKey) {
    this.applyScriptEditorPersonAttributeGroupItem(groupId, attributeKey, true);
    this.scriptEditorPersonAttributeGroupOpenPickerId = null;
  }

  removeScriptEditorPersonAttributeGroupItem(groupId, attributeKey) {
    this.applyScriptEditorPersonAttributeGroupItem(groupId, attributeKey, false);
  }

  addScriptEditorPersonRelation(family) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      appendScriptEditorPersonRelation(person, family)
    );
  }

  removeScriptEditorPersonRelation(family, index) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      removeScriptEditorPersonRelation(person, family, index)
    );
  }

  applyScriptEditorPersonRelationField(index, family, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonRelation(person, family, index, value)
    );
  }

  applyScriptEditorStoryField(field, value) {
    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(updateScriptEditorStoryNodeField(storyNode, field, value));
  }

  addScriptEditorStoryRelation(field) {
    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(
      appendScriptEditorStoryNodeRelation(storyNode, field)
    );
  }

  removeScriptEditorStoryRelation(field, index) {
    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(
      removeScriptEditorStoryNodeRelation(storyNode, field, index)
    );
  }

  applyScriptEditorStoryRelationField(relationKind, index, value) {
    const field = this.resolveScriptEditorStoryRelationField(relationKind);
    if (field == null) {
      return;
    }

    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(
      updateScriptEditorStoryNodeRelation(storyNode, field, index, value)
    );
  }

  applyScriptEditorDialogueField(field, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(updateScriptEditorDialogueField(dialogue, field, value));
  }

  addScriptEditorDialogueCast() {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(appendScriptEditorDialogueCast(dialogue));
  }

  removeScriptEditorDialogueCast(index) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(removeScriptEditorDialogueCast(dialogue, index));
  }

  applyScriptEditorDialogueCastField(index, field, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(
      updateScriptEditorDialogueCastField(dialogue, index, field, value)
    );
  }

  addScriptEditorDialogueOption() {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(appendScriptEditorDialogueOption(dialogue));
  }

  removeScriptEditorDialogueOption(index) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(removeScriptEditorDialogueOption(dialogue, index));
  }

  applyScriptEditorDialogueOptionField(index, field, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(
      updateScriptEditorDialogueOptionField(dialogue, index, field, value)
    );
  }

  applyScriptEditorSettlementField(field, value) {
    const settlement = this.getSelectedScriptEditorSettlement();
    if (settlement == null) {
      return;
    }

    this.replaceSelectedScriptEditorSettlement(
      updateScriptEditorSettlementField(settlement, field, value)
    );
  }

  addScriptEditorSettlementContent() {
    const settlement = this.getSelectedScriptEditorSettlement();
    if (settlement == null) {
      return;
    }

    this.replaceSelectedScriptEditorSettlement(
      appendScriptEditorSettlementContent(settlement)
    );
  }

  removeScriptEditorSettlementContent(index) {
    const settlement = this.getSelectedScriptEditorSettlement();
    if (settlement == null) {
      return;
    }

    this.replaceSelectedScriptEditorSettlement(
      removeScriptEditorSettlementContent(settlement, index)
    );
  }

  applyScriptEditorSettlementContentField(index, field, value) {
    const settlement = this.getSelectedScriptEditorSettlement();
    if (settlement == null) {
      return;
    }

    let nextSettlement = updateScriptEditorSettlementContentField(
      settlement,
      index,
      field,
      value
    );
    if (field === "targetFamily") {
      nextSettlement = updateScriptEditorSettlementContentField(
        nextSettlement,
        index,
        "targetId",
        ""
      );
      nextSettlement = updateScriptEditorSettlementContentField(
        nextSettlement,
        index,
        "attributeKey",
        ""
      );
      nextSettlement = updateScriptEditorSettlementContentField(
        nextSettlement,
        index,
        "attributeType",
        "number"
      );
    } else if (field === "targetId") {
      nextSettlement = updateScriptEditorSettlementContentField(
        nextSettlement,
        index,
        "attributeKey",
        ""
      );
      nextSettlement = updateScriptEditorSettlementContentField(
        nextSettlement,
        index,
        "attributeType",
        "number"
      );
    } else if (field === "attributeKey") {
      const nextContent = nextSettlement.contents?.[index];
      const attributeType = this.resolveScriptEditorSettlementAttributeType(
        nextContent,
        value
      );
      nextSettlement = updateScriptEditorSettlementContentField(
        nextSettlement,
        index,
        "attributeType",
        attributeType
      );
    }

    this.replaceSelectedScriptEditorSettlement(nextSettlement);
  }

  applyScriptEditorEventField(field, value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(updateScriptEditorEventField(eventRecord, field, value));
  }

  applyScriptEditorEventRepeatable(checked) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(toggleScriptEditorEventRepeatable(eventRecord, checked));
  }

  addScriptEditorEventBinding(defaults = {}) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const selectedEventId =
      this.scriptEditorSelection.family === "events"
        ? this.scriptEditorSelection.entityId ?? ""
        : "";
    const defaultTrigger =
      defaults.ownerFamily == null
        ? null
        : this.getScriptEditorEventBindingTriggerOptions(defaults.ownerFamily)[0] ?? null;
    const draft = {
      ...createDefaultScriptEditorEventBindingRecord(
        allocateNextScriptEditorProjectCanonicalId(
          this.scriptEditorProject,
          "eventBindings"
        )
      ),
      eventId: selectedEventId,
      ...(defaultTrigger == null
        ? {}
        : {
            trigger: {
              timing: defaultTrigger.timing,
              action: defaultTrigger.action,
            },
          }),
      ...(defaults.ownerFamily != null || defaults.ownerId != null
        ? {
            owner: {
              family: defaults.ownerFamily ?? "unknown",
              id: defaults.ownerId ?? "",
            },
          }
        : {}),
    };

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      eventBindings: [...this.scriptEditorProject.eventBindings, draft],
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  removeScriptEditorEventBinding(bindingId) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      eventBindings: this.scriptEditorProject.eventBindings.filter(
        (binding) => binding.id !== bindingId
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  replaceScriptEditorEventBinding(bindingId, updateBinding) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      eventBindings: this.scriptEditorProject.eventBindings.map((binding) =>
        binding.id === bindingId
          ? normalizeScriptEditorEventBindingRecord(updateBinding(binding))
          : binding
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorEventBindingField(bindingId, field, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingField(binding, field, value)
    );
  }

  applyScriptEditorEventBindingOwnerField(bindingId, field, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingOwnerField(binding, field, value)
    );
  }

  applyScriptEditorEventBindingTriggerField(bindingId, field, value) {
    if (field === "timing" && typeof value === "string" && value.includes(":")) {
      const [timing, action] = value.split(":");
      this.replaceScriptEditorEventBinding(bindingId, (binding) =>
        updateScriptEditorEventBindingTriggerField(
          updateScriptEditorEventBindingTriggerField(binding, "timing", timing),
          "action",
          action
        )
      );
      return;
    }

    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingTriggerField(binding, field, value)
    );
  }

  applyScriptEditorEventBindingConditionOperator(bindingId, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingConditionOperator(binding, value)
    );
  }

  addScriptEditorEventBindingConditionItem(bindingId) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      appendScriptEditorEventBindingConditionItem(binding)
    );
  }

  removeScriptEditorEventBindingConditionItem(bindingId, index) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      removeScriptEditorEventBindingConditionItem(binding, index)
    );
  }

  applyScriptEditorEventBindingConditionItemField(bindingId, index, field, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingConditionItemField(binding, index, field, value)
    );
  }

  applyScriptEditorEventDestinationField(field, value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventDestinationField(eventRecord, field, value)
    );
  }

  applyScriptEditorEventStoryNodeId(value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventRelationField(eventRecord, "storyNodeId", value)
    );
  }

  addScriptEditorEventRelation(field) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      appendScriptEditorEventRelationEntry(eventRecord, field)
    );
  }

  removeScriptEditorEventRelation(field, index) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      removeScriptEditorEventRelationEntry(eventRecord, field, index)
    );
  }

  applyScriptEditorEventRelationField(relationKind, index, value) {
    const field = this.resolveScriptEditorEventRelationField(relationKind);
    if (field == null) {
      return;
    }

    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventRelationField(eventRecord, field, index, value)
    );
  }

  applyScriptEditorEventPreviewField(field, value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventPreviewSummaryField(eventRecord, field, value)
    );
  }

  applyScriptEditorMinigameField(field, value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameField(minigame, field, value)
    );
  }

  applyScriptEditorMinigameIntegration(value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameIntegration(minigame, value)
    );
  }

  addScriptEditorMinigameLaunchPayloadEntry() {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      appendScriptEditorMinigameLaunchPayloadEntry(minigame)
    );
  }

  removeScriptEditorMinigameLaunchPayloadEntry(index) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      removeScriptEditorMinigameLaunchPayloadEntry(minigame, index)
    );
  }

  applyScriptEditorMinigameLaunchField(index, field, value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameLaunchPayloadField(minigame, index, field, value)
    );
  }

  addScriptEditorMinigameOutcomeRoute() {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      appendScriptEditorMinigameOutcomeRoute(minigame)
    );
  }

  removeScriptEditorMinigameOutcomeRoute(index) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      removeScriptEditorMinigameOutcomeRoute(minigame, index)
    );
  }

  applyScriptEditorMinigameOutcomeField(index, field, value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameOutcomeRouteField(minigame, index, field, value)
    );
  }

  getSelectedScriptEditorItem() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "items" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    return (
      this.scriptEditorProject.items.find(
        (item) => item.id === this.scriptEditorSelection.entityId
      ) ?? null
    );
  }

  replaceSelectedScriptEditorItem(nextItem) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "items" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      items: this.scriptEditorProject.items.map((item) =>
        item.id === this.scriptEditorSelection.entityId ? nextItem : item
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorItemField(field, value) {
    const item = this.getSelectedScriptEditorItem();
    if (item == null || !["name", "description", "internalNote"].includes(field)) {
      return;
    }

    this.replaceSelectedScriptEditorItem(
      updateScriptEditorItemField(item, field, value)
    );
  }

  applyScriptEditorItemDisplayField(field, value) {
    const item = this.getSelectedScriptEditorItem();
    if (item == null || !["title", "iconId", "imageId"].includes(field)) {
      return;
    }

    this.replaceSelectedScriptEditorItem(
      updateScriptEditorItemDisplayField(item, field, value)
    );
  }

  applyScriptEditorItemStackField(field, value) {
    const item = this.getSelectedScriptEditorItem();
    if (item == null || !["stackable", "maxStack", "unit"].includes(field)) {
      return;
    }

    this.replaceSelectedScriptEditorItem(
      updateScriptEditorItemStackField(item, field, value)
    );
  }

  addScriptEditorItemCustomProperty() {
    const item = this.getSelectedScriptEditorItem();
    if (item == null) {
      return;
    }

    this.replaceSelectedScriptEditorItem(appendScriptEditorItemCustomProperty(item));
  }

  removeScriptEditorItemCustomProperty(index) {
    const item = this.getSelectedScriptEditorItem();
    if (item == null) {
      return;
    }

    this.replaceSelectedScriptEditorItem(
      removeScriptEditorItemCustomProperty(item, index)
    );
  }

  applyScriptEditorItemCustomPropertyField(index, field, value) {
    const item = this.getSelectedScriptEditorItem();
    if (
      item == null ||
      !["key", "label", "type", "value"].includes(field) ||
      !Number.isInteger(index) ||
      index < 0
    ) {
      return;
    }

    this.replaceSelectedScriptEditorItem(
      updateScriptEditorItemCustomProperty(item, index, field, value)
    );
  }

  applyScriptEditorLocationField(field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    if (this.scriptEditorSelection.family === "cities") {
      if (
        field === "mapPlacement.label" ||
        field === "mapPlacement.x" ||
        field === "mapPlacement.y" ||
        field === "mapPlacement.kind" ||
        field === "mapPlacement.placementMode" ||
        field === "mapPlacement.gridIndex"
      ) {
        this.replaceSelectedScriptEditorLocation(
          updateScriptEditorCityMapPlacementField(
            location,
            field.slice("mapPlacement.".length),
            value
          )
        );
        return;
      }
      if (field === "id" || field === "name" || field === "description" || field === "backgroundId") {
        this.replaceSelectedScriptEditorLocation(
          updateScriptEditorCityField(location, field, value)
        );
      }
      return;
    }

    if (
      field === "id" ||
      field === "cityId" ||
      field === "name" ||
      field === "description" ||
      field === "backgroundId"
    ) {
      this.replaceSelectedScriptEditorLocation(
        updateScriptEditorBuildingField(location, field, value)
      );
    }
  }

  applyScriptEditorLocationMenuField(instanceId, index, field, value) {
    if (this.scriptEditorProject == null) {
      return;
    }

    if (field === "targetFamily") {
      const nextProject = updateScriptEditorLocationMenuEntryField(
        this.scriptEditorProject,
        instanceId,
        index,
        field,
        value
      );
      const nextEntry =
        nextProject == null
          ? null
          : this.scriptEditorSelection.family === "menuResources"
            ? listScriptEditorMenuModuleRecords(nextProject).find(
                (record) => record.id === instanceId
              )?.entries?.[index] ?? null
            : listScriptEditorLocationMenuBundles(
                nextProject,
                this.scriptEditorSelection.family,
                this.scriptEditorSelection.entityId
              ).find((bundle) => bundle.instanceId === instanceId)?.entries?.[index] ?? null;
      const targetOptions = this.getScriptEditorLocationMenuTargetOptions(value);
      if (
        nextEntry != null &&
        nextEntry.targetId.length > 0 &&
        !targetOptions.some((option) => option.value === nextEntry.targetId)
      ) {
        this.commitScriptEditorMenuProject(
          updateScriptEditorLocationMenuEntryField(
            nextProject,
            instanceId,
            index,
            "targetId",
            ""
          )
        );
        return;
      }

      this.commitScriptEditorMenuProject(nextProject);
      return;
    }

    this.commitScriptEditorMenuProject(
      updateScriptEditorLocationMenuEntryField(
        this.scriptEditorProject,
        instanceId,
        index,
        field,
        value
      )
    );
  }

  applyScriptEditorLocationMenuInstanceField(instanceId, value) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorMenuProject(
      updateScriptEditorLocationMenuInstanceTitle(
        this.scriptEditorProject,
        instanceId,
        value
      )
    );
  }

  applyScriptEditorLocationMenuResourceField(resourceId, value) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorMenuProject(
      updateScriptEditorLocationMenuResourceTitle(
        this.scriptEditorProject,
        resourceId,
        value
      )
    );
  }

  applyScriptEditorLocationMenuFlag(instanceId, index, field, checked) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorMenuProject(
      toggleScriptEditorLocationMenuEntryFlag(
        this.scriptEditorProject,
        instanceId,
        index,
        field,
        checked
      )
    );
  }

  addScriptEditorOwnerMenuMount(ownerFamily, ownerId, actionElement = null) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const selectedMenuInstanceId =
      actionElement
        ?.closest("[data-script-editor-owner-menu-panel]")
        ?.querySelector("[data-script-editor-owner-menu-picker]")?.value ?? "";
    if (selectedMenuInstanceId.trim().length === 0) {
      return;
    }

    this.commitScriptEditorMenuProject(
      appendScriptEditorOwnerMenuMount(
        this.scriptEditorProject,
        ownerFamily,
        ownerId,
        selectedMenuInstanceId
      )
    );
  }

  removeScriptEditorOwnerMenuMount(ownerFamily, ownerId, index) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorMenuProject(
      removeScriptEditorOwnerMenuMount(
        this.scriptEditorProject,
        ownerFamily,
        ownerId,
        index
      )
    );
  }

  addScriptEditorLocationAttribute() {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      appendScriptEditorLocationAttribute(location)
    );
  }

  removeScriptEditorLocationAttribute(index) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      removeScriptEditorLocationAttribute(location, index)
    );
  }

  applyScriptEditorLocationAttributeField(index, field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorLocationAttribute(location, index, field, value)
    );
  }

  addScriptEditorCityMountedBuilding() {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    const nextCity = appendScriptEditorCityMountedBuilding(city);
    const nextBuildingCount = nextCity.mountedBuildings?.length ?? 0;
    this.setScriptEditorCityMountedBuildingUiState(
      Math.max(nextBuildingCount - 1, 0),
      {
        expanded: false,
        search: "",
        page: 1,
      }
    );
    this.setScriptEditorCityMountedBuildingListUiState({
      page: Math.max(
        1,
        Math.ceil(nextBuildingCount / SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_PAGE_SIZE)
      ),
    });
    this.replaceSelectedScriptEditorLocation(nextCity);
  }

  removeScriptEditorCityMountedBuilding(index) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    const { currentPage } = this.getScriptEditorCityMountedBuildingListPageState(city);
    const nextCity = removeScriptEditorCityMountedBuilding(city, index);
    const nextBuildingCount = nextCity.mountedBuildings?.length ?? 0;
    this.setScriptEditorCityMountedBuildingListUiState({
      page: Math.min(
        currentPage,
        Math.max(
          1,
          Math.ceil(nextBuildingCount / SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_PAGE_SIZE)
        )
      ),
    });
    this.replaceSelectedScriptEditorLocation(nextCity);
  }

  applyScriptEditorCityMountedBuilding(index, buildingId) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorCityMountedBuilding(city, index, buildingId)
    );
  }

  addScriptEditorCityMountedBuildingNpc(buildingIndex) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }
    const nextNpcId = this.findNextScriptEditorCityMountedNpcId(city, buildingIndex);

    const nextCity = appendScriptEditorCityMountedBuildingNpc(
      city,
      buildingIndex,
      nextNpcId
    );
    const nextNpcCount = nextCity.mountedBuildings?.[buildingIndex]?.npcIds?.length ?? 0;
    this.setScriptEditorCityMountedBuildingUiState(buildingIndex, {
      expanded: true,
      page: Math.max(
        1,
        Math.ceil(nextNpcCount / SCRIPT_EDITOR_CITY_MOUNTED_BUILDING_NPC_PAGE_SIZE)
      ),
    });
    this.replaceSelectedScriptEditorLocation(nextCity);
  }

  findNextScriptEditorCityMountedNpcId(city, buildingIndex) {
    const mountedBuilding = city.mountedBuildings?.[buildingIndex] ?? null;
    const selectedNpcIds = new Set(mountedBuilding?.npcIds ?? []);
    return (
      (this.scriptEditorProject?.people ?? [])
        .map((person) => normalizeScriptEditorPersonRecord(person))
        .find((person) => person.personType !== "角色" && !selectedNpcIds.has(person.id))
        ?.id ?? ""
    );
  }

  removeScriptEditorCityMountedBuildingNpc(buildingIndex, npcIndex) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    const nextCity = removeScriptEditorCityMountedBuildingNpc(city, buildingIndex, npcIndex);
    const nextEntry = nextCity.mountedBuildings?.[buildingIndex] ?? { npcIds: [] };
    const { totalPages } = this.getScriptEditorCityMountedBuildingNpcPageState(
      nextEntry,
      buildingIndex
    );
    this.setScriptEditorCityMountedBuildingUiState(buildingIndex, {
      expanded: true,
      page: totalPages,
    });
    this.replaceSelectedScriptEditorLocation(nextCity);
  }

  applyScriptEditorCityMountedBuildingNpc(buildingIndex, npcIndex, npcId) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorCityMountedBuildingNpc(city, buildingIndex, npcIndex, npcId)
    );
  }

  applyScriptEditorCityMountedBuildingPrimaryNpc(buildingIndex, npcId) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorCityMountedBuildingPrimaryNpc(city, buildingIndex, npcId)
    );
  }

  addScriptEditorBuildingArrangement(buildingId = null) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "cities" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject(
      appendScriptEditorBuildingArrangement(
        this.scriptEditorProject,
        this.scriptEditorSelection.entityId,
        typeof buildingId === "string" && buildingId.length > 0 ? buildingId : undefined
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  removeScriptEditorBuildingArrangement(arrangementId) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      removeScriptEditorBuildingArrangement(this.scriptEditorProject, arrangementId)
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingArrangementField(arrangementId, field, value) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementField(
        this.scriptEditorProject,
        arrangementId,
        field,
        value
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  addScriptEditorBuildingArrangementNpc(arrangementId) {
    if (this.scriptEditorProject == null) {
      return;
    }
    const nextNpcId = this.findNextScriptEditorBuildingArrangementNpcId(arrangementId);
    this.commitScriptEditorProject(
      appendScriptEditorBuildingArrangementNpc(
        this.scriptEditorProject,
        arrangementId,
        nextNpcId
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  findNextScriptEditorBuildingArrangementNpcId(arrangementId) {
    const arrangement =
      this.scriptEditorProject?.buildingArrangements.find((entry) => entry.id === arrangementId) ??
      null;
    const selectedNpcIds = new Set(arrangement?.mountedNpcIds ?? []);
    return (
      (this.scriptEditorProject?.people ?? [])
        .map((person) => normalizeScriptEditorPersonRecord(person))
        .find((person) => person.personType !== "瑙掕壊" && !selectedNpcIds.has(person.id))
        ?.id ?? ""
    );
  }

  removeScriptEditorBuildingArrangementNpc(arrangementId, npcIndex) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      removeScriptEditorBuildingArrangementNpc(
        this.scriptEditorProject,
        arrangementId,
        npcIndex
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingArrangementNpc(arrangementId, npcIndex, npcId) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementNpc(
        this.scriptEditorProject,
        arrangementId,
        npcIndex,
        npcId
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingArrangementPrimaryNpc(arrangementId, npcId) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementPrimaryNpc(
        this.scriptEditorProject,
        arrangementId,
        npcId
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingLayoutField(arrangementId, field, value) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementLayoutField(
        this.scriptEditorProject,
        arrangementId,
        field,
        value
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  addScriptEditorBuildingLayoutNode(arrangementId) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      appendScriptEditorBuildingArrangementLayoutNode(
        this.scriptEditorProject,
        arrangementId
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  removeScriptEditorBuildingLayoutNode(arrangementId, nodeIndex) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      removeScriptEditorBuildingArrangementLayoutNode(
        this.scriptEditorProject,
        arrangementId,
        nodeIndex
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingLayoutNodeField(arrangementId, nodeIndex, field, value) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementLayoutNodeField(
        this.scriptEditorProject,
        arrangementId,
        nodeIndex,
        field,
        value
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingLayoutNodeFlag(arrangementId, nodeIndex, field, checked) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementLayoutNodeFlag(
        this.scriptEditorProject,
        arrangementId,
        nodeIndex,
        field,
        checked
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  addScriptEditorBuildingArrangementContainer(arrangementId) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      appendScriptEditorBuildingArrangementContainer(this.scriptEditorProject, arrangementId)
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  removeScriptEditorBuildingArrangementContainer(arrangementId, containerIndex) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      removeScriptEditorBuildingArrangementContainer(
        this.scriptEditorProject,
        arrangementId,
        containerIndex
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorBuildingContainerField(
    arrangementId,
    containerIndex,
    field,
    value
  ) {
    if (this.scriptEditorProject == null) {
      return;
    }
    this.commitScriptEditorProject(
      updateScriptEditorBuildingArrangementContainerField(
        this.scriptEditorProject,
        arrangementId,
        containerIndex,
        field,
        value
      )
    );
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorLocationAccessField(field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorAccessField(location, field, value)
    );
  }

  addScriptEditorLocationAccessCondition(conditionField = "conditionExpression") {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      appendScriptEditorAccessCondition(location, conditionField)
    );
  }

  removeScriptEditorLocationAccessCondition(index, conditionField = "conditionExpression") {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      removeScriptEditorAccessCondition(location, index, conditionField)
    );
  }

  clearScriptEditorLocationAccessConditions(conditionField = "conditionExpression") {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorAccessField(location, conditionField, "")
    );
  }

  applyScriptEditorLocationAccessConditionField(
    index,
    field,
    value,
    conditionField = "conditionExpression"
  ) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorAccessConditionField(
        location,
        index,
        field,
        value,
        conditionField
      )
    );
  }

  applyScriptEditorBuildingEntryField(field, value) {
    if (this.scriptEditorSelection.family !== "buildings") {
      return;
    }

    const building = this.getSelectedScriptEditorLocation();
    if (building == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorBuildingEntryBindingField(building, field, value)
    );
  }

  addScriptEditorLocationMenuEntry() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "menuResources" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    const instanceId = this.scriptEditorSelection.entityId;
    const nextProject = appendScriptEditorMenuModuleEntry(
      this.scriptEditorProject,
      instanceId
    );
    const nextEntryCount =
      listScriptEditorMenuModuleRecords(nextProject).find(
        (record) => record.id === instanceId
      )?.entries.length ?? 0;
    this.scriptEditorMenuModuleItemPageById = {
      ...this.scriptEditorMenuModuleItemPageById,
      [instanceId]: Math.max(
        1,
        Math.ceil(nextEntryCount / SCRIPT_EDITOR_MENU_MODULE_ENTRY_PAGE_SIZE)
      ),
    };
    this.commitScriptEditorMenuProject(nextProject);
  }

  removeScriptEditorLocationMenuEntry(instanceId, index) {
    if (this.scriptEditorProject == null || instanceId.length === 0) {
      return;
    }

    const nextProject = removeScriptEditorLocationMenuEntry(
      this.scriptEditorProject,
      instanceId,
      index
    );
    const nextEntryCount =
      listScriptEditorMenuModuleRecords(nextProject).find(
        (record) => record.id === instanceId
      )?.entries.length ?? 0;
    const totalPages = Math.max(
      1,
      Math.ceil(nextEntryCount / SCRIPT_EDITOR_MENU_MODULE_ENTRY_PAGE_SIZE)
    );
    const currentPage =
      this.scriptEditorMenuModuleItemPageById?.[instanceId] ?? 1;
    this.scriptEditorMenuModuleItemPageById = {
      ...this.scriptEditorMenuModuleItemPageById,
      [instanceId]: Math.min(currentPage, totalPages),
    };
    this.commitScriptEditorMenuProject(nextProject);
  }

  runScriptEditorValidation() {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.scriptEditorAuxiliaryPanelOpen = true;
    const diagnostics = this.refreshScriptEditorExportDiagnostics();
    this.recordScriptEditorNotice(
      diagnostics.length === 0
        ? {
            tone: "success",
            message: "剧本包导出校验已通过。",
          }
        : {
            tone: "warning",
            message: diagnostics[0]?.message ?? "剧本包导出校验失败。",
          }
    );
    this.render();
  }

  handleScriptEditorBlockedRuntimeAction() {
    if (this.scriptEditorProject == null) {
      return false;
    }

    const diagnostics = this.refreshScriptEditorExportDiagnostics();
    if (diagnostics.length === 0) {
      return false;
    }

    this.runScriptEditorValidation();
    return true;
  }

  async saveScriptEditorProject() {
    return this.scriptEditorWorkflowController.saveProject();
  }

  async createScriptEditorProjectAtSavePath() {
    this.invalidateScriptEditorExportDiagnostics();
    return this.scriptEditorWorkflowController.createProjectAtSavePath();
  }

  async exportScriptEditorProject() {
    this.refreshScriptEditorExportDiagnostics();
    return this.scriptEditorWorkflowController.exportProject();
  }

  captureScriptEditorRuntimePreviewReturnContext() {
    this.captureScriptEditorScrollPosition();
    return {
      screen: this.currentScreen,
      selection: { ...this.scriptEditorSelection },
      personTab: this.scriptEditorPersonTab,
      locationTab: this.scriptEditorLocationTab,
      narrativeTab: this.scriptEditorNarrativeTab,
      eventTab: this.scriptEditorEventTab,
      minigameTab: this.scriptEditorMinigameTab,
      scrollTop: this.scriptEditorScrollTop,
      personAttributeScrollLeft: this.scriptEditorPersonAttributeScrollLeft,
    };
  }

  restoreScriptEditorRuntimePreviewReturnContext(returnContext) {
    if (returnContext == null) {
      return;
    }

    this.scriptEditorSelection = { ...returnContext.selection };
    this.scriptEditorPersonTab = returnContext.personTab;
    this.scriptEditorLocationTab = returnContext.locationTab;
    this.scriptEditorNarrativeTab = returnContext.narrativeTab;
    this.scriptEditorEventTab = returnContext.eventTab;
    this.scriptEditorMinigameTab = returnContext.minigameTab;
    this.scriptEditorScrollTop = returnContext.scrollTop;
    this.scriptEditorPersonAttributeScrollLeft =
      returnContext.personAttributeScrollLeft ?? 0;
    this.setScreen(returnContext.screen ?? "script-editor-workspace");
  }

  exitScriptEditorRuntimePreview() {
    return this.scriptEditorWorkflowController.exitRuntimePreviewSession();
  }

  enterScriptEditorRuntimePreviewSession() {
    return this.scriptEditorWorkflowController.enterRuntimePreviewSession();
  }

  async previewScriptEditorProjectRuntime() {
    this.refreshScriptEditorExportDiagnostics();
    return this.scriptEditorWorkflowController.previewProjectRuntime();
  }

  async openScriptEditorProjectFromDirectory() {
    this.invalidateScriptEditorExportDiagnostics();
    return this.scriptEditorWorkflowController.openProjectFromDirectory();
  }

  async handleScriptEditorProjectFileImport(files) {
    this.invalidateScriptEditorExportDiagnostics();
    return this.scriptEditorWorkflowController.importProjectFiles(files);
  }

  async handleScriptEditorTemplateImport() {
    this.invalidateScriptEditorExportDiagnostics();
    return this.scriptEditorWorkflowController.importTemplateProject();
  }

  getScriptEditorFamilyLabel(family) {
    switch (family) {
      case "storyPack":
        return "项目";
      case "people":
        return "人物";
      case "portraits":
        return "立绘资源";
      case "portraitVariants":
        return "立绘变体";
      case "cities":
        return "城市";
      case "buildings":
        return "建筑";
      case "settlements":
        return "结算";
      case "menuResources":
        return "菜单";
      case "quests":
        return "任务";
      case "dialogues":
        return "对话";
      case "textEntries":
        return "文本";
      case "storyNodes":
        return "剧情节点";
      case "events":
        return "事件";
      case "minigames":
        return "玩法";
      case SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY:
        return "阶段配置";
      case "progressTracks":
        return "阶段轨道";
      case "progressTrackBindings":
        return "轨道绑定";
      default:
        return family;
    }
  }

  ensureScriptEditorVisibleSelection() {
    if (
      this.scriptEditorProject == null ||
      isScriptEditorVisibleWorkflowFamily(this.scriptEditorSelection.family)
    ) {
      return;
    }

    this.scriptEditorSelection = {
      family: "storyPack",
      entityId: null,
    };
  }

  getScriptEditorRecordLabel(record) {
    if (typeof record.name === "string" && record.name.length > 0) {
      return record.name;
    }
    if (typeof record.title === "string" && record.title.length > 0) {
      return record.title;
    }
    if (typeof record.label === "string" && record.label.length > 0) {
      return record.label;
    }
    if (typeof record.text === "string" && record.text.length > 0) {
      return record.text.slice(0, 40);
    }
    return record.id;
  }

  getScriptEditorStageConfigurationBindings() {
    return (this.scriptEditorProject?.progressTrackBindings ?? []).map((bindingRecord) =>
      normalizeScriptEditorProgressTrackBindingRecord(bindingRecord)
    );
  }

  addScriptEditorStageConfigurationBinding() {
    if (this.scriptEditorProject == null) {
      return;
    }

    const draft = createDefaultScriptEditorProgressTrackBindingRecord(
      (this.scriptEditorProject.progressTrackBindings ?? []).length
    );
    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      progressTrackBindings: [...(this.scriptEditorProject.progressTrackBindings ?? []), draft],
    });
    this.scriptEditorSelection = {
      family: SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
      entityId: draft.id,
    };
    this.scriptEditorRecordSearch = {
      ...this.scriptEditorRecordSearch,
      [SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY]: "",
    };
    this.syncScriptEditorRecordListPageToRecord(
      SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
      draft.id,
      this.getScriptEditorStageConfigurationBindings()
    );
    this.scriptEditorStageConfigurationHelpOpen = false;
    this.recordScriptEditorNotice({
      tone: "success",
      message: "已新增一个应用对象配置。",
    });
    this.render();
  }

  removeScriptEditorStageConfigurationBinding() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    const nextBindings = (this.scriptEditorProject.progressTrackBindings ?? []).filter(
      (bindingRecord) => bindingRecord.id !== this.scriptEditorSelection.entityId
    );
    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      progressTrackBindings: nextBindings,
    });
    const normalizedBindings = nextBindings.map((bindingRecord) =>
      normalizeScriptEditorProgressTrackBindingRecord(bindingRecord)
    );
    this.scriptEditorSelection = {
      family: SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
      entityId: normalizedBindings[0]?.id ?? null,
    };
    if (normalizedBindings[0]?.id == null) {
      this.setScriptEditorRecordListPage(SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY, 1);
    } else {
      this.syncScriptEditorRecordListPageToRecord(
        SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY,
        normalizedBindings[0].id,
        normalizedBindings
      );
    }
    this.scriptEditorStageConfigurationHelpOpen = false;
    this.recordScriptEditorNotice({
      tone: "success",
      message: "已删除当前应用对象配置。",
    });
    this.render();
  }

  addScriptEditorStageConfigurationTrack() {
    const binding = this.getSelectedScriptEditorProgressTrackBinding();
    if (this.scriptEditorProject == null || binding == null) {
      return;
    }

    const nextTrack = {
      ...createDefaultScriptEditorProgressTrackRecord(
        (this.scriptEditorProject.progressTracks ?? []).length
      ),
      hostFamily: binding.host?.family ?? "person",
    };
    const nextBinding = {
      ...binding,
      trackId: nextTrack.id,
    };

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      progressTracks: [...(this.scriptEditorProject.progressTracks ?? []), nextTrack],
      progressTrackBindings: (this.scriptEditorProject.progressTrackBindings ?? []).map(
        (bindingRecord) =>
          bindingRecord.id === binding.id ? nextBinding : bindingRecord
      ),
    });
    this.scriptEditorStageConfigurationHelpOpen = false;
    this.recordScriptEditorNotice({
      tone: "success",
      message: "已新建阶段规则，并绑定到当前应用对象。",
    });
    this.render();
  }

  removeScriptEditorStageConfigurationTrack() {
    const track = this.getSelectedScriptEditorProgressTrack();
    if (this.scriptEditorProject == null || track == null) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      progressTracks: (this.scriptEditorProject.progressTracks ?? []).filter(
        (trackRecord) => trackRecord.id !== track.id
      ),
      progressTrackBindings: (this.scriptEditorProject.progressTrackBindings ?? []).map(
        (bindingRecord) =>
          bindingRecord.trackId === track.id
            ? {
                ...bindingRecord,
                trackId: "",
              }
            : bindingRecord
      ),
    });
    this.scriptEditorStageConfigurationHelpOpen = false;
    this.recordScriptEditorNotice({
      tone: "success",
      message: "已删除当前阶段规则，并清空相关应用对象的规则绑定。",
    });
    this.render();
  }

  getSelectedScriptEditorPerson() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "people" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedPerson = this.scriptEditorProject.people.find(
      (person) => person.id === this.scriptEditorSelection.entityId
    );
    if (selectedPerson == null) {
      return null;
    }

    return normalizeScriptEditorPersonRecord(selectedPerson);
  }

  replaceSelectedScriptEditorPerson(nextPerson) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "people" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      people: this.scriptEditorProject.people.map((person) =>
        person.id === this.scriptEditorSelection.entityId ? nextPerson : person
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorPortrait() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "portraits" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedPortrait = this.scriptEditorProject.portraits.find(
      (portrait) => portrait.id === this.scriptEditorSelection.entityId
    );
    return selectedPortrait == null
      ? null
      : normalizeScriptEditorPortraitRecord(selectedPortrait);
  }

  replaceSelectedScriptEditorPortrait(nextPortrait) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "portraits" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      portraits: this.scriptEditorProject.portraits.map((portrait) =>
        portrait.id === this.scriptEditorSelection.entityId ? nextPortrait : portrait
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorPortraitVariant() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "portraitVariants" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedVariant = this.scriptEditorProject.portraitVariants.find(
      (variant) => variant.id === this.scriptEditorSelection.entityId
    );
    return selectedVariant == null
      ? null
      : normalizeScriptEditorPortraitVariantRecord(selectedVariant);
  }

  replaceSelectedScriptEditorPortraitVariant(nextVariant) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "portraitVariants" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      portraitVariants: this.scriptEditorProject.portraitVariants.map((variant) =>
        variant.id === this.scriptEditorSelection.entityId ? nextVariant : variant
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getScriptEditorLocationMenuBundles(family, locationId) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return listScriptEditorLocationMenuBundles(
      this.scriptEditorProject,
      family,
      locationId
    );
  }

  getScriptEditorLocationMenuEntryCount(family, locationId) {
    if (this.scriptEditorProject == null) {
      return 0;
    }

    return countScriptEditorLocationMenuEntries(
      this.scriptEditorProject,
      family,
      locationId
    );
  }

  commitScriptEditorMenuProject(project) {
    this.commitScriptEditorProject(project);
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorLocation() {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "cities" &&
        this.scriptEditorSelection.family !== "buildings") ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    if (this.scriptEditorSelection.family === "cities") {
      const selectedCity = this.scriptEditorProject.cities.find(
        (city) => city.id === this.scriptEditorSelection.entityId
      );
      return selectedCity == null ? null : normalizeScriptEditorCityRecord(selectedCity);
    }

    const selectedBuilding = this.scriptEditorProject.buildings.find(
      (building) => building.id === this.scriptEditorSelection.entityId
    );
    return selectedBuilding == null
      ? null
      : normalizeScriptEditorBuildingRecord(selectedBuilding);
  }

  replaceSelectedScriptEditorLocation(nextLocation) {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "cities" &&
        this.scriptEditorSelection.family !== "buildings") ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    if (this.scriptEditorSelection.family === "cities") {
      this.commitScriptEditorProject({
        ...this.scriptEditorProject,
        cities: this.scriptEditorProject.cities.map((city) =>
          city.id === this.scriptEditorSelection.entityId ? nextLocation : city
        ),
      });
    } else {
      this.commitScriptEditorProject({
        ...this.scriptEditorProject,
        buildings: this.scriptEditorProject.buildings.map((building) =>
          building.id === this.scriptEditorSelection.entityId ? nextLocation : building
        ),
      });
    }
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorStoryNode() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "storyNodes" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedStoryNode = this.scriptEditorProject.storyNodes.find(
      (storyNode) => storyNode.id === this.scriptEditorSelection.entityId
    );
    return selectedStoryNode == null
      ? null
      : normalizeScriptEditorStoryNodeRecord(selectedStoryNode);
  }

  replaceSelectedScriptEditorStoryNode(nextStoryNode) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "storyNodes" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      storyNodes: this.scriptEditorProject.storyNodes.map((storyNode) =>
        storyNode.id === this.scriptEditorSelection.entityId ? nextStoryNode : storyNode
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorDialogue() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "dialogues" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedDialogue = this.scriptEditorProject.dialogues.find(
      (dialogue) => dialogue.id === this.scriptEditorSelection.entityId
    );
    return selectedDialogue == null ? null : normalizeScriptEditorDialogueRecord(selectedDialogue);
  }

  replaceSelectedScriptEditorDialogue(nextDialogue) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "dialogues" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      dialogues: this.scriptEditorProject.dialogues.map((dialogue) =>
        dialogue.id === this.scriptEditorSelection.entityId ? nextDialogue : dialogue
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorSettlement() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "settlements" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedSettlement = this.scriptEditorProject.settlements.find(
      (settlementRecord) => settlementRecord.id === this.scriptEditorSelection.entityId
    );
    return selectedSettlement == null
      ? null
      : normalizeScriptEditorSettlementRecord(selectedSettlement);
  }

  replaceSelectedScriptEditorSettlement(nextSettlement) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "settlements" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      settlements: this.scriptEditorProject.settlements.map((settlementRecord) =>
        settlementRecord.id === this.scriptEditorSelection.entityId
          ? nextSettlement
          : settlementRecord
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorProgressTrack() {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "progressTracks" &&
        this.scriptEditorSelection.family !== SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedTrackId =
      this.scriptEditorSelection.family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
        ? this.getSelectedScriptEditorProgressTrackBinding()?.trackId ?? ""
        : this.scriptEditorSelection.entityId;
    const selectedTrack = this.scriptEditorProject.progressTracks?.find(
      (trackRecord) => trackRecord.id === selectedTrackId
    );
    return selectedTrack == null
      ? null
      : normalizeScriptEditorProgressTrackRecord(selectedTrack);
  }

  replaceSelectedScriptEditorProgressTrack(nextTrack) {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "progressTracks" &&
        this.scriptEditorSelection.family !== SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY)
    ) {
      return;
    }

    const selectedTrackId =
      this.scriptEditorSelection.family === SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY
        ? this.getSelectedScriptEditorProgressTrackBinding()?.trackId ?? ""
        : this.scriptEditorSelection.entityId ?? "";
    if (selectedTrackId.length === 0) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      progressTracks: (this.scriptEditorProject.progressTracks ?? []).map((trackRecord) =>
        trackRecord.id === selectedTrackId ? nextTrack : trackRecord
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorProgressTrackField(field, value) {
    const track = this.getSelectedScriptEditorProgressTrack();
    if (track == null) {
      return;
    }

    this.replaceSelectedScriptEditorProgressTrack(
      updateScriptEditorProgressTrackField(track, field, value)
    );
  }

  addScriptEditorProgressTrackTier() {
    const track = this.getSelectedScriptEditorProgressTrack();
    if (track == null) {
      return;
    }

    this.replaceSelectedScriptEditorProgressTrack(
      appendScriptEditorProgressTrackTier(track)
    );
  }

  removeScriptEditorProgressTrackTier(index) {
    const track = this.getSelectedScriptEditorProgressTrack();
    if (track == null) {
      return;
    }

    this.replaceSelectedScriptEditorProgressTrack(
      removeScriptEditorProgressTrackTier(track, index)
    );
  }

  applyScriptEditorProgressTrackTierField(index, field, value) {
    const track = this.getSelectedScriptEditorProgressTrack();
    if (track == null) {
      return;
    }

    this.replaceSelectedScriptEditorProgressTrack(
      updateScriptEditorProgressTrackTierField(track, index, field, value)
    );
  }

  getSelectedScriptEditorProgressTrackBinding() {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "progressTrackBindings" &&
        this.scriptEditorSelection.family !== SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedBinding = this.scriptEditorProject.progressTrackBindings?.find(
      (bindingRecord) => bindingRecord.id === this.scriptEditorSelection.entityId
    );
    return selectedBinding == null
      ? null
      : normalizeScriptEditorProgressTrackBindingRecord(selectedBinding);
  }

  replaceSelectedScriptEditorProgressTrackBinding(nextBinding) {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "progressTrackBindings" &&
        this.scriptEditorSelection.family !== SCRIPT_EDITOR_STAGE_CONFIGURATION_FAMILY) ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      progressTrackBindings: (this.scriptEditorProject.progressTrackBindings ?? []).map(
        (bindingRecord) =>
          bindingRecord.id === this.scriptEditorSelection.entityId
            ? nextBinding
            : bindingRecord
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorProgressTrackBindingField(field, value) {
    const binding = this.getSelectedScriptEditorProgressTrackBinding();
    if (binding == null) {
      return;
    }

    this.replaceSelectedScriptEditorProgressTrackBinding(
      updateScriptEditorProgressTrackBindingField(binding, field, value)
    );
  }

  getSelectedScriptEditorEvent() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "events" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedEvent = this.scriptEditorProject.events.find(
      (eventRecord) => eventRecord.id === this.scriptEditorSelection.entityId
    );
    return selectedEvent == null ? null : normalizeScriptEditorEventRecord(selectedEvent);
  }

  replaceSelectedScriptEditorEvent(nextEvent) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "events" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      events: this.scriptEditorProject.events.map((eventRecord) =>
        eventRecord.id === this.scriptEditorSelection.entityId ? nextEvent : eventRecord
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorMinigame() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "minigames" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedMinigame = this.scriptEditorProject.minigames.find(
      (minigame) => minigame.id === this.scriptEditorSelection.entityId
    );
    return selectedMinigame == null
      ? null
      : normalizeScriptEditorMinigameRecord(selectedMinigame);
  }

  replaceSelectedScriptEditorMinigame(nextMinigame) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "minigames" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      minigames: this.scriptEditorProject.minigames.map((minigame) =>
        minigame.id === this.scriptEditorSelection.entityId ? nextMinigame : minigame
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  resolveScriptEditorStoryRelationField(relationKind) {
    switch (relationKind) {
      case "story-related-people":
        return "relatedPersonIds";
      case "story-related-dialogues":
        return "relatedDialogueIds";
      case "story-related-events":
        return "relatedEventIds";
      default:
        return null;
    }
  }

  resolveScriptEditorEventRelationField(relationKind) {
    switch (relationKind) {
      case "event-related-people":
        return "personIds";
      case "event-related-cities":
        return "cityIds";
      case "event-related-buildings":
        return "buildingIds";
      default:
        return null;
    }
  }

  getScriptEditorProjectLibraryEntries() {
    return this.scriptEditorProjectLibrary;
  }

  getScriptEditorProjectSourceLabel(source) {
    switch (source) {
      case "opened":
        return "本地打开";
      case "imported":
        return "运行时导入";
      case "new":
      default:
        return "新建项目";
    }
  }

  commitScriptEditorProject(project) {
    this.scriptEditorProject = formalizeScriptEditorProjectMenus(project);
    this.scriptEditorProjectLibrary = upsertScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      createScriptEditorProjectLibraryEntry(
        this.scriptEditorProject,
        this.scriptEditorProjectSource
      )
    );
  }

  rememberScriptEditorProjectPackageLocation(result) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const existingEntry = findScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      this.scriptEditorProject.id
    );
    const entry =
      existingEntry ??
      createScriptEditorProjectLibraryEntry(
        this.scriptEditorProject,
        this.scriptEditorProjectSource
      );
    const directoryName =
      typeof result.directoryHandle?.name === "string"
        ? result.directoryHandle.name
        : "";
    const displayPath =
      directoryName.trim() !== "" ? directoryName : this.scriptEditorProject.id;

    this.scriptEditorProjectLibrary = upsertScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      {
        ...entry,
        project: this.scriptEditorProject,
        title: this.scriptEditorProject.title,
        description: this.scriptEditorProject.description ?? "",
        source: this.scriptEditorProjectSource,
        packageLocation: {
          locationKind: result.mode === "directory" ? "directory" : "download",
          displayPath,
          durable: result.mode === "directory",
        },
        validity: {
          state: "valid",
        },
      }
    );
  }

  continueScriptEditorProject(projectId) {
    const projectEntry = findScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectId
    );
    if (projectEntry == null) {
      return;
    }

    if (!canContinueScriptEditorProjectEntry(projectEntry)) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message: projectEntry.validity.reason,
      });
      this.render();
      return;
    }

    const isCurrentProject = this.scriptEditorProject?.id === projectId;
    this.scriptEditorProjectSource = projectEntry.source;
    this.scriptEditorProject = projectEntry.project;
    this.scriptEditorProjectLibrary = upsertScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectEntry
    );
    this.scriptEditorPendingDeleteProjectId = null;
    this.scriptEditorNotice = null;
    if (!isCurrentProject) {
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.resetScriptEditorPersonAttributePage();
      this.resetScriptEditorNoticeTimeline();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
    }
    this.scriptEditorAuxiliaryPanelOpen = false;
    this.setScreen("script-editor-workspace");
  }

  deleteScriptEditorProject(projectId) {
    const projectEntry = findScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectId
    );
    if (projectEntry == null) {
      return;
    }

    this.scriptEditorProjectLibrary = removeScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectId
    );
    if (this.scriptEditorProject?.id === projectId) {
      this.scriptEditorProject = null;
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorProjectDirectoryHandle = null;
      this.scriptEditorExportDirectoryHandle = null;
    }
    this.scriptEditorPendingDeleteProjectId = null;
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已将 ${projectEntry.title} 从当前项目列表移除。`,
    });
    this.render();
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStatValue(value) {
  return typeof value === "number" ? String(value) : "0";
}
