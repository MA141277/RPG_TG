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
      "当前队列只提供可复用 workspace shell、对象树框架与 handoff 摘要，不落最小可用产品闭环。",
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
      label: "概览",
      isActive: activeSection === "overview",
    },
    {
      id: "authoring",
      label: "对象树",
      isActive: activeSection === "authoring",
    },
    {
      id: "handoff",
      label: "交接状态",
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
      description: "复用已落地的 manifest-driven editor-project persistence seam。",
    },
    {
      id: "validate",
      label: "校验",
      status: exportDiagnostics.length === 0 ? "ready" : "attention",
      description:
        exportDiagnostics.length === 0
          ? "当前 shell 已能汇总 runtime export handoff 是否可达。"
          : `已发现 ${exportDiagnostics.length} 条 handoff 阻塞，后续 workflow queue 可直接复用。`,
    },
    {
      id: "export",
      label: "导出运行包",
      status: exportDiagnostics.length === 0 ? "ready" : "blocked",
      description:
        exportDiagnostics.length === 0
          ? "当前项目已满足 bounded runtime-pack export 的可达前提。"
          : exportDiagnostics[0]?.message ?? "存在未处理的 runtime export 阻塞。",
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
    description:
      previewRecord == null
        ? "当前 family 还没有对象。"
        : describeRecord(previewRecord),
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
  const title =
    selectedRecord == null
      ? `${FAMILY_LABELS[selection.family]}工作台`
      : readPrimaryLabel(selectedRecord);
  const description =
    selectedRecord == null
      ? "当前 shell 已提供 family 级对象树占位，但还没有落最小字段编辑。"
      : `当前只提供 ${FAMILY_LABELS[selection.family]} 的工作台占位与对象摘要，具体字段编辑会在后续 workflow queue 中接上。`;

  return {
    eyebrow: `${FAMILY_LABELS[selection.family]} · Workspace Scaffold`,
    title,
    description,
    stats: [
      {
        label: "对象数",
        value: String(records.length),
      },
      {
        label: "选中",
        value: selectedRecord?.id ?? "none",
      },
      {
        label: "队列边界",
        value: DEFERRED_SHELL_FAMILIES.has(selection.family) ? "占位/交接" : "可复用骨架",
      },
    ],
    cards: selectedRecord == null
      ? [
          {
            id: `empty.${selection.family}`,
            title: "尚无对象",
            body: "对象树已经为该 family 预留可复用节点，但当前项目里还没有内容可展示。",
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
              ? "该 family 目前只进入 workspace shell 占位，不在本队列中实现专用 authoring grammar 或 runtime compile。"
              : "该 family 已能在对象树里稳定承载后续最小可用 workflow，不需要再次重建 shell。"
            ,
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

  return {
    eyebrow: "Project Workspace",
    title: project.storyPack.title,
    description:
      project.storyPack.description ??
      "项目根信息、对象树骨架与 handoff 摘要已经汇聚到同一 workspace shell 中。",
    stats: [
      {
        label: "项目 ID",
        value: project.id,
      },
      {
        label: "Scenario",
        value: scenarioProfileId,
      },
      {
        label: "兼容残留",
        value: String(compatibilityResidueCount),
      },
    ],
    cards: [
      {
        id: "project.workspace.boundary",
        title: "当前队列交付",
        body:
          "本队列只交付可复用 editor shell、对象树布局和 handoff 摘要，不把主菜单入口、新建/打开/导入流程或最小字段编辑混进同一切口。",
        tone: "success",
      },
      {
        id: "project.export.handoff",
        title: exportDiagnostics.length === 0 ? "导出 handoff 已就绪" : "导出 handoff 仍阻塞",
        body:
          exportDiagnostics.length === 0
            ? "当前项目已经满足 bounded runtime export seam 的基础前提，后续 workflow queue 可以直接把 UI 触达接上。"
            : exportDiagnostics[0]?.message ??
              "存在仍待后续 workflow / shared-rule queue 解决的 export 阻塞。",
        tone: exportDiagnostics.length === 0 ? "success" : "warning",
      },
      {
        id: "project.compatibility",
        title: compatibilityResidueCount === 0 ? "无兼容残留" : "存在兼容导入残留",
        body:
          compatibilityResidueCount === 0
            ? "compatibility-import queue 的显式 residue 机制已被 shell 读取，但当前项目没有未解析残留。"
            : `storyPack.compatibilityImport 中仍保留 ${compatibilityResidueCount} 个 runtime-only residue，对应的后续解析不能在本队列里偷渡实现。`,
        tone: compatibilityResidueCount === 0 ? "neutral" : "warning",
      },
    ],
  };
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
  return readPrimaryLabel(record) ?? "已存在对象，可在后续 workflow queue 中继续细化。";
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
