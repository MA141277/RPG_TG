import type {
  ScriptEditorEntityRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorProjectFileKey,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import {
  validateScriptEditorProjectForRuntimeExport,
} from "./runtime-pack-export";

export type ScriptEditorWorkspaceSelection = {
  family: ScriptEditorProjectFileKey;
  entityId?: string | null;
};

export type ScriptEditorWorkspaceViewModel = {
  projectId: string;
  title: string;
  subtitle: string;
  badges: ScriptEditorWorkspaceBadge[];
  navigationItems: ScriptEditorWorkspaceNavigationItem[];
  toolbarActions: ScriptEditorWorkspaceToolbarAction[];
  objectTreeGroups: ScriptEditorWorkspaceTreeGroup[];
  inspector: ScriptEditorWorkspaceInspector;
  handoffSummary: ScriptEditorWorkspaceHandoffSummary;
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  };
};

export type ScriptEditorWorkspaceBadge = {
  label: string;
  tone: "neutral" | "success" | "warning";
};

export type ScriptEditorWorkspaceNavigationItem = {
  id: "overview" | "authoring" | "handoff";
  label: string;
  isActive: boolean;
};

export type ScriptEditorWorkspaceToolbarAction = {
  id: "save" | "validate" | "export";
  label: string;
  status: "ready" | "attention" | "blocked";
  description: string;
};

export type ScriptEditorWorkspaceTreeGroup = {
  id: string;
  label: string;
  nodes: ScriptEditorWorkspaceTreeNode[];
};

export type ScriptEditorWorkspaceTreeNode = {
  id: string;
  family: ScriptEditorProjectFileKey;
  entityId: string | null;
  label: string;
  description: string;
  itemCount: number;
  isSelected: boolean;
  tone: "neutral" | "warning";
};

export type ScriptEditorWorkspaceInspector = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  cards: ScriptEditorWorkspaceInspectorCard[];
};

export type ScriptEditorWorkspaceInspectorCard = {
  id: string;
  title: string;
  body: string;
  tone: "neutral" | "warning" | "success";
};

export type ScriptEditorWorkspaceHandoffSummary = {
  blockedCount: number;
  attentionCount: number;
  firstMessage: string | null;
};

const FAMILY_LABELS: Record<ScriptEditorProjectFileKey, string> = {
  storyPack: "项目",
  people: "人物",
  cities: "城市",
  buildings: "建筑",
  events: "事件",
  quests: "任务",
  dialogues: "对话",
  minigames: "玩法",
  storyNodes: "剧情节点",
  textEntries: "文本",
  conditionGroups: "条件组",
  effectBundles: "效果组",
};

const TREE_GROUPS: Array<{
  id: string;
  label: string;
  families: ScriptEditorProjectFileKey[];
}> = [
  {
    id: "project",
    label: "项目骨架",
    families: ["storyPack", "people", "cities", "buildings", "events", "quests", "textEntries"],
  },
  {
    id: "narrative",
    label: "叙事骨架",
    families: ["dialogues", "storyNodes", "minigames"],
  },
  {
    id: "rules",
    label: "规则与交接",
    families: ["conditionGroups", "effectBundles"],
  },
];

const DEFERRED_SHELL_FAMILIES = new Set<ScriptEditorProjectFileKey>([
  "dialogues",
  "storyNodes",
  "minigames",
  "conditionGroups",
  "effectBundles",
]);

export function createScriptEditorWorkspaceShellViewModel(input: {
  project: ScriptEditorProjectDefinition;
  selection?: ScriptEditorWorkspaceSelection | undefined;
  visibleFamilies?: readonly ScriptEditorProjectFileKey[] | undefined;
}): ScriptEditorWorkspaceViewModel {
  const project = input.project;
  const exportDiagnostics = validateScriptEditorProjectForRuntimeExport(project);
  const attentionFamilies = collectAttentionFamilies(exportDiagnostics);
  const selection = resolveSelection(project, input.selection);
  const compatibilityResidueCount = countCompatibilityResidue(project);
  const badges = createBadges(project, exportDiagnostics, compatibilityResidueCount);
  const visibleFamilies = new Set(
    input.visibleFamilies ?? Object.keys(FAMILY_LABELS) as ScriptEditorProjectFileKey[]
  );

  return {
    projectId: project.id,
    title: project.title,
    subtitle:
      project.description ??
      "当前工作台已经具备统一导航、对象树和导出交接摘要，可在同一入口继续扩展正式创作面。",
    badges,
    navigationItems: createNavigationItems(selection.family),
    toolbarActions: createToolbarActions(exportDiagnostics),
    objectTreeGroups: TREE_GROUPS
      .map((group) => ({
        id: group.id,
        label: group.label,
        nodes: group.families
          .filter((family) => visibleFamilies.has(family))
          .map((family) =>
            createTreeNode(project, family, selection, attentionFamilies.has(family))
          ),
      }))
      .filter((group) => group.nodes.length > 0),
    inspector: createInspector(project, selection, exportDiagnostics, compatibilityResidueCount),
    handoffSummary: {
      blockedCount: exportDiagnostics.length,
      attentionCount:
        (compatibilityResidueCount > 0 ? 1 : 0) +
        Array.from(attentionFamilies).length,
      firstMessage: exportDiagnostics[0]?.message ?? null,
    },
    selection,
  };
}

function createBadges(
  project: ScriptEditorProjectDefinition,
  exportDiagnostics: ReturnType<typeof validateScriptEditorProjectForRuntimeExport>,
  compatibilityResidueCount: number
): ScriptEditorWorkspaceBadge[] {
  const badges: ScriptEditorWorkspaceBadge[] = [
    {
      label: `项目 ${project.id}`,
      tone: "neutral",
    },
    {
      label: exportDiagnostics.length === 0 ? "导出就绪" : `导出阻塞 ${exportDiagnostics.length}`,
      tone: exportDiagnostics.length === 0 ? "success" : "warning",
    },
  ];

  if (compatibilityResidueCount > 0) {
    badges.push({
      label: `兼容残留 ${compatibilityResidueCount}`,
      tone: "warning",
    });
  }

  return badges;
}

function createNavigationItems(
  family: ScriptEditorProjectFileKey
): ScriptEditorWorkspaceNavigationItem[] {
  const activeSection = family === "storyPack"
    ? "overview"
    : DEFERRED_SHELL_FAMILIES.has(family)
      ? "handoff"
      : "authoring";

  return [
    {
      id: "overview",
      label: "项目总览",
      isActive: activeSection === "overview",
    },
    {
      id: "authoring",
      label: "对象导航",
      isActive: activeSection === "authoring",
    },
    {
      id: "handoff",
      label: "校验导出",
      isActive: activeSection === "handoff",
    },
  ];
}

function createToolbarActions(
  exportDiagnostics: ReturnType<typeof validateScriptEditorProjectForRuntimeExport>
): ScriptEditorWorkspaceToolbarAction[] {
  return [
    {
      id: "save",
      label: "保存项目",
      status: "ready",
      description: "复用已落地的 manifest 驱动项目持久化接缝。",
    },
    {
      id: "validate",
      label: "校验结构",
      status: exportDiagnostics.length === 0 ? "ready" : "attention",
      description:
        exportDiagnostics.length === 0
          ? "当前工作台已确认导出前提完整，可直接继续创作。"
          : `当前发现 ${exportDiagnostics.length} 项导出前阻塞，需要先处理后再继续交付。`,
    },
    {
      id: "export",
      label: "导出剧本包",
      status: exportDiagnostics.length === 0 ? "ready" : "blocked",
      description:
        exportDiagnostics.length === 0
          ? "当前项目满足受限 runtime-pack 导出前提，可以进入导出交接。"
          : exportDiagnostics[0]?.message ?? "存在尚未处理的导出阻塞。",
    },
  ];
}

function createTreeNode(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorProjectFileKey,
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  },
  hasAttention: boolean
): ScriptEditorWorkspaceTreeNode {
  const count = getFamilyCount(project, family);
  const previewRecord = family === "storyPack" ? project.storyPack : getFamilyRecords(project, family)[0] ?? null;

  return {
    id: `node.${family}`,
    family,
    entityId: selection.family === family ? selection.entityId : null,
    label: FAMILY_LABELS[family],
    description: previewRecord == null ? "当前家族还没有对象。" : describeRecord(previewRecord),
    itemCount: count,
    isSelected: selection.family === family,
    tone: hasAttention ? "warning" : "neutral",
  };
}

function createInspector(
  project: ScriptEditorProjectDefinition,
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  },
  exportDiagnostics: ReturnType<typeof validateScriptEditorProjectForRuntimeExport>,
  compatibilityResidueCount: number
): ScriptEditorWorkspaceInspector {
  if (selection.family === "storyPack") {
    return createProjectInspector(project, exportDiagnostics, compatibilityResidueCount);
  }

  const records = getFamilyRecords(project, selection.family);
  const selectedRecord = selection.entityId == null
    ? records[0] ?? null
    : records.find((record) => record.id === selection.entityId) ?? records[0] ?? null;
  const title = selectedRecord == null
    ? `${FAMILY_LABELS[selection.family]}工作台`
    : readPrimaryLabel(selectedRecord);
  const description = selectedRecord == null
    ? "当前工作台已经给该家族预留导航位置，但正式字段编辑还未在本队列展开。"
    : `当前先提供 ${FAMILY_LABELS[selection.family]} 的导航入口与对象摘要，具体深度编辑会在后续对象家族队列中继续落地。`;

  return {
    eyebrow: `${FAMILY_LABELS[selection.family]}工作台`,
    title,
    description,
    stats: [
      {
        label: "对象数",
        value: String(records.length),
      },
      {
        label: "当前选中",
        value: selectedRecord?.id ?? "none",
      },
      {
        label: "当前阶段",
        value: DEFERRED_SHELL_FAMILIES.has(selection.family) ? "占位/交接" : "导航已就绪",
      },
    ],
    cards: selectedRecord == null
      ? [
          {
            id: `empty.${selection.family}`,
            title: "尚无对象",
            body: "对象树已经为该家族预留稳定入口，但当前项目里还没有可继续编辑的对象。",
            tone: "neutral",
          },
        ]
      : [
          {
            id: `record.${selectedRecord.id}`,
            title: "记录摘要",
            body: createRecordPreview(selectedRecord),
            tone: "neutral",
          },
          {
            id: `handoff.${selection.family}`,
            title: "后续队列交接",
            body: DEFERRED_SHELL_FAMILIES.has(selection.family)
              ? "该家族当前只进入工作台导航和交接范围，不在本队列内实现正式作者语法或 runtime compile。"
              : "该家族已经可以稳定承接后续 PRD 队列，不需要再次重建工作台壳层。",
            tone: DEFERRED_SHELL_FAMILIES.has(selection.family) ? "warning" : "success",
          },
        ],
  };
}

function createProjectInspector(
  project: ScriptEditorProjectDefinition,
  exportDiagnostics: ReturnType<typeof validateScriptEditorProjectForRuntimeExport>,
  compatibilityResidueCount: number
): ScriptEditorWorkspaceInspector {
  const scenarioProfileId =
    readStringField(project.storyPack, "scenarioProfile.id") ?? "none";
  const playerCharacterId =
    readStringField(project.storyPack, "scenarioProfile.playerCharacterId") ?? "未设置";

  return {
    eyebrow: "项目总览",
    title: project.storyPack.title,
    description:
      project.storyPack.description ??
      "项目总览负责统一回答当前项目是什么、已经做到哪里、还卡在哪里，以及下一步该先进入哪个创作面。",
    stats: [
      {
        label: "项目 ID",
        value: project.id,
      },
      {
        label: "开场场景",
        value: scenarioProfileId,
      },
      {
        label: "兼容残留",
        value: String(compatibilityResidueCount),
      },
    ],
    cards: [
      {
        id: "project.status",
        title: "项目状态",
        body: `当前项目 ${project.id} 以 ${scenarioProfileId} 作为开场场景，默认主角为 ${playerCharacterId}。`,
        tone: "success",
      },
      {
        id: "project.progress",
        title: "创作进度",
        body: `当前已收录人物 ${project.people.length} 条、文本 ${project.textEntries.length} 条、剧情节点 ${project.storyNodes.length} 条、事件 ${project.events.length} 条。`,
        tone: "neutral",
      },
      {
        id: "project.risk",
        title: "风险与阻塞",
        body: createProjectRiskSummary(exportDiagnostics, compatibilityResidueCount),
        tone:
          exportDiagnostics.length === 0 && compatibilityResidueCount === 0
            ? "success"
            : "warning",
      },
      {
        id: "project.next-step",
        title: "下一步建议",
        body:
          "继续从左侧对象导航进入正式作者面；当前优先进入人物作者面与关系入口，城市、建筑、菜单与更深剧情编辑保持后续队列处理。",
        tone: "neutral",
      },
    ],
  };
}

function createProjectRiskSummary(
  exportDiagnostics: ReturnType<typeof validateScriptEditorProjectForRuntimeExport>,
  compatibilityResidueCount: number
): string {
  if (exportDiagnostics.length > 0) {
    return exportDiagnostics[0]?.message ?? "当前仍存在需要先处理的导出阻塞。";
  }

  if (compatibilityResidueCount > 0) {
    return `当前没有导出阻塞，但仍有 ${compatibilityResidueCount} 条兼容残留需要后续语义队列承接。`;
  }

  return "当前没有导出前阻塞，项目可以继续细化对象内容。";
}

function resolveSelection(
  project: ScriptEditorProjectDefinition,
  requestedSelection: ScriptEditorWorkspaceSelection | undefined
): {
  family: ScriptEditorProjectFileKey;
  entityId: string | null;
} {
  const family = requestedSelection?.family ?? "storyPack";
  if (family === "storyPack") {
    return {
      family,
      entityId: null,
    };
  }

  const records = getFamilyRecords(project, family);
  if (records.length === 0) {
    return {
      family,
      entityId: null,
    };
  }

  if (requestedSelection?.entityId != null) {
    const selectedRecord = records.find((record) => record.id === requestedSelection.entityId);
    if (selectedRecord != null) {
      return {
        family,
        entityId: selectedRecord.id,
      };
    }
  }

  return {
    family,
    entityId: records[0]?.id ?? null,
  };
}

function collectAttentionFamilies(
  exportDiagnostics: ReturnType<typeof validateScriptEditorProjectForRuntimeExport>
): Set<ScriptEditorProjectFileKey> {
  const families = new Set<ScriptEditorProjectFileKey>();

  for (const diagnostic of exportDiagnostics) {
    const [, family] = diagnostic.fieldPath.match(/^project\.([^.]+)/u) ?? [];
    if (family != null && family in FAMILY_LABELS) {
      families.add(family as ScriptEditorProjectFileKey);
      continue;
    }

    families.add("storyPack");
  }

  return families;
}

function getFamilyCount(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorProjectFileKey
): number {
  return family === "storyPack" ? 1 : getFamilyRecords(project, family).length;
}

function getFamilyRecords(
  project: ScriptEditorProjectDefinition,
  family: Exclude<ScriptEditorProjectFileKey, "storyPack">
): ScriptEditorEntityRecord[] | ScriptEditorTextEntryRecord[];
function getFamilyRecords(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorProjectFileKey
): ScriptEditorEntityRecord[] | ScriptEditorTextEntryRecord[] {
  switch (family) {
    case "storyPack":
      return [];
    case "people":
      return project.people;
    case "cities":
      return project.cities;
    case "buildings":
      return project.buildings;
    case "events":
      return project.events;
    case "quests":
      return project.quests;
    case "dialogues":
      return project.dialogues;
    case "minigames":
      return project.minigames;
    case "storyNodes":
      return project.storyNodes;
    case "textEntries":
      return project.textEntries;
    case "conditionGroups":
      return project.conditionGroups;
    case "effectBundles":
      return project.effectBundles;
  }
}

function describeRecord(record: Record<string, unknown>): string {
  return readPrimaryLabel(record) ?? "对象已存在，可在后续 PRD 队列中继续细化。";
}

function readPrimaryLabel(record: Record<string, unknown>): string {
  for (const key of ["title", "name", "label", "text", "id"]) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return "未命名对象";
}

function createRecordPreview(record: Record<string, unknown>): string {
  const lines = Object.entries(record)
    .filter(([key]) => key !== "id")
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${formatPreviewValue(value)}`);

  if (lines.length === 0) {
    return `id: ${record.id ?? "unknown"}`;
  }

  return [`id: ${record.id ?? "unknown"}`, ...lines].join(" | ");
}

function formatPreviewValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `${value.length} items`;
  }

  if (value != null && typeof value === "object") {
    return `${Object.keys(value).length} fields`;
  }

  return "empty";
}

function countCompatibilityResidue(project: ScriptEditorProjectDefinition): number {
  const compatibilityImport = (
    project.storyPack as Record<string, unknown>
  ).compatibilityImport;
  if (compatibilityImport == null || typeof compatibilityImport !== "object") {
    return 0;
  }

  const unresolvedFamilies = (compatibilityImport as Record<string, unknown>).unresolvedFamilies;
  if (unresolvedFamilies == null || typeof unresolvedFamilies !== "object") {
    return 0;
  }

  return Object.values(unresolvedFamilies as Record<string, unknown>).reduce<number>(
    (count, familyEntries) => {
      return count + (Array.isArray(familyEntries) ? familyEntries.length : 0);
    },
    0
  );
}

function readStringField(
  record: Record<string, unknown>,
  dottedPath: string
): string | null {
  const pathSegments = dottedPath.split(".");
  let currentValue: unknown = record;

  for (const segment of pathSegments) {
    if (currentValue == null || typeof currentValue !== "object") {
      return null;
    }

    currentValue = (currentValue as Record<string, unknown>)[segment];
  }

  return typeof currentValue === "string" && currentValue.length > 0
    ? currentValue
    : null;
}
