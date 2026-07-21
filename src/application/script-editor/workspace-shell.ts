import type {
  ScriptEditorActivityRecord,
  ScriptEditorDialogueRecord,
  ScriptEditorEntityRecord,
  ScriptEditorEventRecord,
  ScriptEditorMinigameRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorProjectFileKey,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import {
  validateScriptEditorProjectForRuntimeExport,
  type ScriptEditorRuntimeExportDiagnostic,
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
  auxiliaryPanel: ScriptEditorWorkspaceAuxiliaryPanel;
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
  id: "project-info" | "save" | "validate" | "preview-runtime" | "export";
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

export type ScriptEditorWorkspaceAuxiliaryPanel = {
  isOpen: boolean;
  toggleLabel: string;
  previewCards: ScriptEditorWorkspaceAuxiliaryCard[];
  issues: ScriptEditorWorkspaceValidationIssue[];
  exportTargets: ScriptEditorWorkspaceExportTarget[];
  summary: {
    blockedCount: number;
    attentionCount: number;
    infoCount: number;
  };
};

export type ScriptEditorWorkspaceAuxiliaryCard = {
  id: string;
  title: string;
  body: string;
  tone: "neutral" | "warning" | "success";
};

export type ScriptEditorWorkspaceValidationIssue = {
  id: string;
  severity: "blocked" | "attention" | "info";
  title: string;
  message: string;
  actionLabel: string;
  targetFamily: ScriptEditorProjectFileKey;
  targetEntityId: string | null;
  targetTab: string | null;
};

export type ScriptEditorWorkspaceExportTarget = {
  id: string;
  label: string;
  file: string;
  status: "ready" | "blocked" | "deferred";
  body: string;
};

const FAMILY_LABELS: Record<string, string> = {
  storyPack: "剧本导出",
  people: "人物",
  cities: "城市",
  buildings: "建筑",
  events: "事件",
  quests: "任务",
  activities: "活动",
  dialogues: "对话",
  scenes: "场景",
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
    label: "项目",
    families: ["storyPack"],
  },
  {
    id: "world",
    label: "世界",
    families: ["people", "cities", "buildings"],
  },
  {
    id: "narrative",
    label: "剧情与文本",
    families: ["storyNodes", "dialogues", "scenes", "events"],
  },
  {
    id: "gameplay",
    label: "玩法",
    families: ["minigames"],
  },
  {
    id: "library",
    label: "资料库",
    families: ["textEntries"],
  },
];

const DEFERRED_SHELL_FAMILIES = new Set<ScriptEditorProjectFileKey>([
  "activities",
  "dialogues",
  "storyNodes",
  "conditionGroups",
  "effectBundles",
]);

const DEFERRED_EXPORT_TARGET_FAMILIES = new Set<ScriptEditorProjectFileKey>([
  "dialogues",
  "minigames",
  "storyNodes",
  "conditionGroups",
  "effectBundles",
]);

const ISSUE_SEVERITY_ORDER: Record<
  ScriptEditorWorkspaceValidationIssue["severity"],
  number
> = {
  blocked: 0,
  attention: 1,
  info: 2,
};

export function createScriptEditorWorkspaceShellViewModel(input: {
  project: ScriptEditorProjectDefinition;
  selection?: ScriptEditorWorkspaceSelection | undefined;
  visibleFamilies?: readonly ScriptEditorProjectFileKey[] | undefined;
  auxiliaryPanelOpen?: boolean | undefined;
}): ScriptEditorWorkspaceViewModel {
  const project = input.project;
  const exportDiagnostics = validateScriptEditorProjectForRuntimeExport(project);
  const attentionFamilies = collectAttentionFamilies(exportDiagnostics);
  const selection = resolveSelection(project, input.selection);
  const compatibilityResidueCount = countCompatibilityResidue(project);
  const badges = createBadges(project, exportDiagnostics, compatibilityResidueCount);
  const visibleFamilies = new Set(
    input.visibleFamilies ??
      (Object.keys(FAMILY_LABELS) as ScriptEditorProjectFileKey[])
  );
  const auxiliaryPanel = createAuxiliaryPanel({
    project,
    selection,
    exportDiagnostics,
    compatibilityResidueCount,
    isOpen: input.auxiliaryPanelOpen === true,
  });

  return {
    projectId: project.id,
    title: project.title,
    subtitle:
      project.description ??
      "当前工作台已经具备统一导航、对象树和按需打开的预览/校验/导出辅助区。",
    badges,
    navigationItems: createNavigationItems(selection.family),
    toolbarActions: createToolbarActions(exportDiagnostics),
    objectTreeGroups: TREE_GROUPS.map((group) => ({
      id: group.id,
      label: group.label,
      nodes: group.families
        .filter((family) => visibleFamilies.has(family))
        .map((family) =>
          createTreeNode(project, family, selection, attentionFamilies.has(family))
        ),
    })).filter((group) => group.nodes.length > 0),
    inspector: createInspector(
      project,
      selection,
      exportDiagnostics,
      compatibilityResidueCount
    ),
    handoffSummary: {
      blockedCount: auxiliaryPanel.summary.blockedCount,
      attentionCount:
        auxiliaryPanel.summary.attentionCount +
        (auxiliaryPanel.summary.infoCount > 0 ? 1 : 0),
      firstMessage: auxiliaryPanel.issues[0]?.message ?? null,
    },
    auxiliaryPanel,
    selection,
  };
}

function createBadges(
  project: ScriptEditorProjectDefinition,
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[],
  compatibilityResidueCount: number
): ScriptEditorWorkspaceBadge[] {
  void project;
  void exportDiagnostics;
  void compatibilityResidueCount;

  return [];
}

function createNavigationItems(
  family: ScriptEditorProjectFileKey
): ScriptEditorWorkspaceNavigationItem[] {
  void family;
  return [];
}

function createToolbarActions(
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[]
): ScriptEditorWorkspaceToolbarAction[] {
  return [
    {
      id: "project-info",
      label: "项目信息",
      status: "ready",
      description: "返回项目总览并配置开局视图、角色选择策略和默认角色。",
    },
    {
      id: "save",
      label: "保存项目",
      status: "ready",
      description: "复用当前的 manifest 分文件持久化接缝保存作者态项目。",
    },
    {
      id: "validate",
      label: "校验",
      status: exportDiagnostics.length === 0 ? "ready" : "attention",
      description:
        exportDiagnostics.length === 0
          ? "当前工作台未发现 runtime-pack 导出阻塞，可继续创作或预览。"
          : `当前发现 ${exportDiagnostics.length} 个导出前阻塞，需先处理后再交付。`,
    },
    {
      id: "preview-runtime",
      label: "运行预览",
      status: exportDiagnostics.length === 0 ? "ready" : "blocked",
      description:
        exportDiagnostics.length === 0
          ? "使用当前编辑器内存数据生成运行包并启动运行时预览。"
          : exportDiagnostics[0]?.message ?? "存在尚未处理的运行预览阻塞。",
    },
    {
      id: "export",
      label: "剧本导出",
      status: exportDiagnostics.length === 0 ? "ready" : "blocked",
      description:
        exportDiagnostics.length === 0
          ? "当前项目满足受限 runtime-pack 导出前提，可以进入导出交付。"
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
  const previewRecord =
    family === "storyPack" ? project.storyPack : getFamilyRecords(project, family)[0] ?? null;

  return {
    id: `node.${family}`,
    family,
    entityId: selection.family === family ? selection.entityId : null,
    label: getFamilyLabel(family),
    description:
      previewRecord == null ? "当前家族还没有对象。" : describeRecord(previewRecord),
    itemCount: count,
    isSelected: selection.family === family,
    tone: hasAttention ? "warning" : "neutral",
  };
}

function getFamilyLabel(family: ScriptEditorProjectFileKey): string {
  return FAMILY_LABELS[family] ?? family;
}

function createInspector(
  project: ScriptEditorProjectDefinition,
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  },
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[],
  compatibilityResidueCount: number
): ScriptEditorWorkspaceInspector {
  if (selection.family === "storyPack") {
    return createProjectInspector(
      project,
      exportDiagnostics,
      compatibilityResidueCount
    );
  }

  const records = getFamilyRecords(project, selection.family);
  const selectedRecord =
    selection.entityId == null
      ? records[0] ?? null
      : records.find((record) => record.id === selection.entityId) ?? records[0] ?? null;
  const title =
    selectedRecord == null
      ? `${FAMILY_LABELS[selection.family]}工作台`
      : readPrimaryLabel(selectedRecord);
  const description =
    selectedRecord == null
      ? "当前工作台已为该对象家族保留稳定入口，但项目中还没有可继续编辑的对象。"
      : `当前先对齐 ${FAMILY_LABELS[selection.family]} 的工作台框架与对象导航，具体字段 authoring 仍保持边界收敛。`;

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
        label: "当前对象",
        value: selectedRecord?.id ?? "none",
      },
      {
        label: "当前阶段",
        value: DEFERRED_SHELL_FAMILIES.has(selection.family)
          ? "占位/交接"
          : "作者面已就绪",
      },
    ],
    cards:
      selectedRecord == null
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
                ? "该家族当前只进入工作台导航和交接范围，不在本队列内实现最终 compile 或完整运行时落点。"
                : "该家族已经可以稳定承接后续 PRD 队列，不需要重复搭建工作台壳层。",
              tone: DEFERRED_SHELL_FAMILIES.has(selection.family)
                ? "warning"
                : "success",
            },
          ],
  };
}

function createProjectInspector(
  project: ScriptEditorProjectDefinition,
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[],
  compatibilityResidueCount: number
): ScriptEditorWorkspaceInspector {
  const scenarioProfileTitle =
    readStringField(project.storyPack, "scenarioProfile.title") ?? "未填写开场标题";
  const playerCharacterId =
    readStringField(project.storyPack, "scenarioProfile.playerCharacterId") ?? "未设置";

  return {
    eyebrow: "项目总览",
    title: project.storyPack.title,
    description:
      project.storyPack.description ??
      "项目总览负责统一回答当前项目是什么、已做到哪里、还卡在哪里，以及下一步该进入哪个作者面。",
    stats: [
      {
        label: "人物条目",
        value: String(project.people.length),
      },
      {
        label: "世界对象",
        value: String(project.cities.length + project.buildings.length),
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
        body: `当前项目以“${scenarioProfileTitle}”作为开场起点，默认主角为 ${playerCharacterId}。`,
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
        body: "继续从左侧对象树进入对应作者面；预览与校验在需要时通过右侧辅助区打开并直接回跳到问题位置。",
        tone: "neutral",
      },
    ],
  };
}

function createProjectRiskSummary(
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[],
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
    const selectedRecord = records.find(
      (record) => record.id === requestedSelection.entityId
    );
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

function createAuxiliaryPanel(input: {
  project: ScriptEditorProjectDefinition;
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  };
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[];
  compatibilityResidueCount: number;
  isOpen: boolean;
}): ScriptEditorWorkspaceAuxiliaryPanel {
  const linkedValidationIssues = collectLinkedValidationIssues(input.project);
  const exportIssues = input.exportDiagnostics.map((diagnostic, index) =>
    createIssueFromExportDiagnostic(input.project, diagnostic, index)
  );
  const issues = [...linkedValidationIssues, ...exportIssues].sort((left, right) => {
    const severityOrder =
      ISSUE_SEVERITY_ORDER[left.severity] - ISSUE_SEVERITY_ORDER[right.severity];
    if (severityOrder !== 0) {
      return severityOrder;
    }

    return left.title.localeCompare(right.title, "zh-CN");
  });
  const summary = issues.reduce(
    (counts, issue) => {
      if (issue.severity === "blocked") {
        counts.blockedCount += 1;
      } else if (issue.severity === "attention") {
        counts.attentionCount += 1;
      } else {
        counts.infoCount += 1;
      }

      return counts;
    },
    {
      blockedCount: 0,
      attentionCount: 0,
      infoCount: 0,
    }
  );

  if (summary.attentionCount === 0 && input.compatibilityResidueCount > 0) {
    summary.attentionCount = 1;
  }

  return {
    isOpen: input.isOpen,
    toggleLabel: input.isOpen ? "收起辅助区" : "打开预览与校验",
    previewCards: createPreviewCards(input.project, input.selection, issues),
    issues:
      issues.length > 0
        ? issues
        : [
            {
              id: "issue.none",
              severity: "info",
              title: "当前未发现新增问题",
              message: "结构预览、链接校验和 runtime-pack 导出检查都未发现新的阻塞项。",
              actionLabel: "回到项目总览",
              targetFamily: "storyPack",
              targetEntityId: null,
              targetTab: null,
            },
          ],
    exportTargets: createExportTargets(
      input.project,
      input.selection,
      input.exportDiagnostics
    ),
    summary,
  };
}

function createPreviewCards(
  project: ScriptEditorProjectDefinition,
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  },
  issues: ScriptEditorWorkspaceValidationIssue[]
): ScriptEditorWorkspaceAuxiliaryCard[] {
  const selectedRecord =
    selection.family === "storyPack"
      ? project.storyPack
      : getFamilyRecords(project, selection.family).find(
          (record) => record.id === selection.entityId
        ) ?? null;
  const selectionLabel =
    selection.family === "storyPack"
      ? project.storyPack.title
      : selectedRecord == null
        ? `未选择${FAMILY_LABELS[selection.family]}`
        : readPrimaryLabel(selectedRecord);
  const relatedIssueCount = issues.filter(
    (issue) =>
      issue.targetFamily === selection.family &&
      (selection.entityId == null || issue.targetEntityId === selection.entityId)
  ).length;
  const exportPreview = describeSelectionExportPreview(
    project,
    selection.family,
    selection.entityId
  );

  return [
    {
      id: "preview.selection",
      title: "当前结构预览",
      body:
        selection.family === "storyPack"
          ? `开场场景 ${readStringField(project.storyPack, "scenarioProfile.id") ?? "未设置"}，默认主角 ${readStringField(project.storyPack, "scenarioProfile.playerCharacterId") ?? "未设置"}。`
          : `${FAMILY_LABELS[selection.family]} 当前对象为 ${selectionLabel}，${createRecordPreview(selectedRecord ?? { id: "none" })}。`,
      tone: selectedRecord == null && selection.family !== "storyPack" ? "warning" : "neutral",
    },
    {
      id: "preview.links",
      title: "联动与闭环",
      body:
        relatedIssueCount > 0
          ? `当前对象命中了 ${relatedIssueCount} 条校验项，可从统一校验列表直接回跳到对应字段。`
          : describeSelectionLinkPreview(project, selection.family, selection.entityId),
      tone: relatedIssueCount > 0 ? "warning" : "success",
    },
    {
      id: "preview.export",
      title: "导出落点预估",
      body: exportPreview,
      tone: DEFERRED_EXPORT_TARGET_FAMILIES.has(selection.family) ? "warning" : "neutral",
    },
  ];
}

function describeSelectionLinkPreview(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorProjectFileKey,
  entityId: string | null
): string {
  if (family === "storyPack") {
    return `项目当前收录人物 ${project.people.length}、城市 ${project.cities.length}、事件 ${project.events.length}、玩法绑定 ${project.minigames.length}。`;
  }

  if (entityId == null) {
    return "当前未选择具体对象，先从对象树选中记录后再查看联动摘要。";
  }

  if (family === "people") {
    const person = project.people.find((record) => record.id === entityId);
    return `人物关联对话 ${(person?.dialogueIds ?? []).length} 条、事件 ${(person?.eventIds ?? []).length} 条。`;
  }

  if (family === "cities" || family === "buildings") {
    const location =
      family === "cities"
        ? project.cities.find((record) => record.id === entityId)
        : project.buildings.find((record) => record.id === entityId);
    return `菜单入口 ${(location?.menuEntries ?? []).length} 条，访问状态 ${location?.access?.conditionExpression == null ? "default-allow" : "configured"}。`;
  }

  if (family === "dialogues") {
    const dialogue = project.dialogues.find((record) => record.id === entityId);
    return `节点 ${(dialogue?.nodes ?? []).length} 条，后续去向 ${(dialogue?.followUps ?? []).length} 条。`;
  }

  if (family === "events") {
    const eventRecord = project.events.find((record) => record.id === entityId);
    const destination = eventRecord?.destination;
    return destination?.targetId
      ? `当前事件去向 ${destination.family}:${destination.targetId}，预览摘要已内嵌到统一辅助区。`
      : "当前事件尚未配置去向，导出前建议先补齐闭环。";
  }

  if (family === "minigames") {
    const minigame = project.minigames.find((record) => record.id === entityId);
    return `玩法绑定 outcome ${(minigame?.outcomeRoutes ?? []).length} 条，launch payload ${(minigame?.launchPayload ?? []).length} 条。`;
  }

  if (family === "storyNodes") {
    const storyNode = project.storyNodes.find((record) => record.id === entityId);
    return `剧情节点关联人物 ${(storyNode?.relatedPersonIds ?? []).length} 条、对话 ${(storyNode?.relatedDialogueIds ?? []).length} 条、事件 ${(storyNode?.relatedEventIds ?? []).length} 条。`;
  }

  return "当前对象没有额外联动摘要。";
}

function describeSelectionExportPreview(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorProjectFileKey,
  entityId: string | null
): string {
  if (family === "storyPack") {
    return "项目级信息会落到 pack.json 与 scenario-profile.json，辅助区会在导出前汇总阻塞项与兼容残留。";
  }

  if (family === "people") {
    return "人物作者态会下沉到 characters.json，并继续复用当前运行时角色装载路径。";
  }

  if (family === "cities") {
    return "城市对象会导出到 cities.json，菜单与访问态仍依附当前项目接受的配置结构。";
  }

  if (family === "buildings") {
    return "建筑对象会导出到 houses.json，入口绑定继续沿用正式建筑运行时结构。";
  }

  if (family === "events") {
    const eventRecord = project.events.find((record) => record.id === entityId);
    return eventRecord?.destination?.targetId
      ? `事件将导出到 events.json，当前去向目标 ${eventRecord.destination.targetId} 需在导出前保持可达。`
      : "事件会导出到 events.json，但当前去向尚未补齐，导出前会继续阻塞。";
  }

  if (family === "dialogues") {
    return "对话将下沉到 scenes.json 与 text-entries.json；本队列只先给出预览与阻塞提示，不补完 lowering。";
  }

  if (family === "minigames") {
    return "玩法绑定采用下沉导出原则，后续需挂到事件、对话或菜单的正式可调用结构，而不是独立新分表。";
  }

  if (family === "storyNodes") {
    return "剧情节点作为组织对象继续下沉到正式事件/场景承载结构；当前只在辅助区对齐结构预估。";
  }

  if (family === "textEntries") {
    return "文本条目会直接落到 text-entries.json，供对话与场景演出复用。";
  }

  return "当前家族尚未声明额外导出落点。";
}

function collectLinkedValidationIssues(
  project: ScriptEditorProjectDefinition
): ScriptEditorWorkspaceValidationIssue[] {
  const issues: ScriptEditorWorkspaceValidationIssue[] = [];
  const addIssue = (issue: ScriptEditorWorkspaceValidationIssue) => {
    if (issues.some((entry) => entry.id === issue.id)) {
      return;
    }
    issues.push(issue);
  };
  const addMissingReferenceIssue = (input: {
    id: string;
    severity: "blocked" | "attention";
    title: string;
    message: string;
    targetFamily: ScriptEditorProjectFileKey;
    targetEntityId: string | null;
    targetTab: string | null;
  }) => {
    addIssue({
      ...input,
      actionLabel: "定位问题",
    });
  };
  const storyPack = project.storyPack as Record<string, unknown>;
  const scenarioProfile =
    storyPack.scenarioProfile != null && typeof storyPack.scenarioProfile === "object"
      ? (storyPack.scenarioProfile as Record<string, unknown>)
      : null;
  const initialLocation =
    scenarioProfile?.initialLocation != null &&
    typeof scenarioProfile.initialLocation === "object"
      ? (scenarioProfile.initialLocation as Record<string, unknown>)
      : null;
  const playerCharacterId =
    typeof scenarioProfile?.playerCharacterId === "string"
      ? scenarioProfile.playerCharacterId
      : "";
  const cityId =
    typeof initialLocation?.cityId === "string" ? initialLocation.cityId : "";
  const houseId =
    typeof initialLocation?.houseId === "string" ? initialLocation.houseId : "";

  if (playerCharacterId.length > 0 && !hasRecord(project, "people", playerCharacterId)) {
    addMissingReferenceIssue({
      id: `linked.storyPack.playerCharacter.${playerCharacterId}`,
      severity: "blocked",
      title: "开场主角缺失",
      message: `scenarioProfile.playerCharacterId 指向的人物 ${playerCharacterId} 不存在。`,
      targetFamily: "storyPack",
      targetEntityId: null,
      targetTab: null,
    });
  }

  if (cityId.length > 0 && !hasRecord(project, "cities", cityId)) {
    addMissingReferenceIssue({
      id: `linked.storyPack.city.${cityId}`,
      severity: "blocked",
      title: "开场城市缺失",
      message: `scenarioProfile.initialLocation.cityId 指向的城市 ${cityId} 不存在。`,
      targetFamily: "storyPack",
      targetEntityId: null,
      targetTab: null,
    });
  }

  if (houseId.length > 0 && !hasRecord(project, "buildings", houseId)) {
    addMissingReferenceIssue({
      id: `linked.storyPack.house.${houseId}`,
      severity: "blocked",
      title: "开场建筑缺失",
      message: `scenarioProfile.initialLocation.houseId 指向的建筑 ${houseId} 不存在。`,
      targetFamily: "storyPack",
      targetEntityId: null,
      targetTab: null,
    });
  }

  for (const person of project.people) {
    for (const dialogueId of person.dialogueIds ?? []) {
      if (!hasRecord(project, "dialogues", dialogueId)) {
        addMissingReferenceIssue({
          id: `linked.people.dialogue.${person.id}.${dialogueId}`,
          severity: "attention",
          title: "人物关联对话缺失",
          message: `人物 ${person.id} 关联的对话 ${dialogueId} 不存在。`,
          targetFamily: "people",
          targetEntityId: person.id,
          targetTab: "dialogues",
        });
      }
    }

    for (const eventId of person.eventIds ?? []) {
      if (!hasRecord(project, "events", eventId)) {
        addMissingReferenceIssue({
          id: `linked.people.event.${person.id}.${eventId}`,
          severity: "attention",
          title: "人物关联事件缺失",
          message: `人物 ${person.id} 关联的事件 ${eventId} 不存在。`,
          targetFamily: "people",
          targetEntityId: person.id,
          targetTab: "events",
        });
      }
    }
  }

  for (const family of ["cities", "buildings"] as const) {
    for (const location of project[family]) {
      for (const entry of location.menuEntries ?? []) {
        const targetFamily = resolveAuthoringTargetFamily(entry.targetFamily);
        if (targetFamily == null || entry.targetId.trim().length === 0) {
          continue;
        }

        if (!hasRecord(project, targetFamily, entry.targetId)) {
          addMissingReferenceIssue({
            id: `linked.${family}.menu.${location.id}.${entry.id}`,
            severity: "attention",
            title: "菜单入口目标缺失",
            message: `${FAMILY_LABELS[family]} ${location.id} 的菜单入口 ${entry.id} 指向的 ${entry.targetId} 不存在。`,
            targetFamily: family,
            targetEntityId: location.id,
            targetTab: "menus",
          });
        }
      }
    }
  }

  for (const dialogue of project.dialogues) {
    if (
      typeof dialogue.storyNodeId === "string" &&
      dialogue.storyNodeId.length > 0 &&
      !hasRecord(project, "storyNodes", dialogue.storyNodeId)
    ) {
      addMissingReferenceIssue({
        id: `linked.dialogues.story-node.${dialogue.id}.${dialogue.storyNodeId}`,
        severity: "attention",
        title: "对话所属剧情节点缺失",
        message: `对话 ${dialogue.id} 指向的剧情节点 ${dialogue.storyNodeId} 不存在。`,
        targetFamily: "dialogues",
        targetEntityId: dialogue.id,
        targetTab: "profile",
      });
    }

    for (const [index, followUp] of (dialogue.followUps ?? []).entries()) {
      const targetFamily = resolveAuthoringTargetFamily(followUp.targetFamily);
      if (targetFamily == null || followUp.targetId.trim().length === 0) {
        continue;
      }

      if (!hasRecord(project, targetFamily, followUp.targetId)) {
        addMissingReferenceIssue({
          id: `linked.dialogues.follow-up.${dialogue.id}.${index}`,
          severity: "attention",
          title: "对话后续去向缺失",
          message: `对话 ${dialogue.id} 的后续去向 ${followUp.targetFamily}:${followUp.targetId} 不存在。`,
          targetFamily: "dialogues",
          targetEntityId: dialogue.id,
          targetTab: "summary",
        });
      }
    }
  }

  for (const eventRecord of project.events) {
    const destination = eventRecord.destination;
    if (destination?.targetId != null && destination.targetId.length > 0) {
      const targetFamily = resolveAuthoringTargetFamily(destination.family);
      if (targetFamily != null && !hasRecord(project, targetFamily, destination.targetId)) {
        addMissingReferenceIssue({
          id: `linked.events.destination.${eventRecord.id}`,
          severity: "blocked",
          title: "事件去向缺失",
          message: `事件 ${eventRecord.id} 的去向 ${destination.family}:${destination.targetId} 不存在。`,
          targetFamily: "events",
          targetEntityId: eventRecord.id,
          targetTab: "destination",
        });
      }
    }

    if (
      eventRecord.nextEventId != null &&
      eventRecord.nextEventId.length > 0 &&
      !hasRecord(project, "events", eventRecord.nextEventId)
    ) {
      addMissingReferenceIssue({
        id: `linked.events.next-event.${eventRecord.id}`,
        severity: "blocked",
        title: "Missing next event",
        message: `Event ${eventRecord.id} references missing next event ${eventRecord.nextEventId}.`,
        targetFamily: "events",
        targetEntityId: eventRecord.id,
        targetTab: "destination",
      });
    }

    if (
      eventRecord.relations?.storyNodeId != null &&
      eventRecord.relations.storyNodeId.length > 0 &&
      !hasRecord(project, "storyNodes", eventRecord.relations.storyNodeId)
    ) {
      addMissingReferenceIssue({
        id: `linked.events.story-node.${eventRecord.id}`,
        severity: "attention",
        title: "事件关联剧情节点缺失",
        message: `事件 ${eventRecord.id} 关联的剧情节点 ${eventRecord.relations.storyNodeId} 不存在。`,
        targetFamily: "events",
        targetEntityId: eventRecord.id,
        targetTab: "relations",
      });
    }

    appendMissingRelationIssues(project, issues, eventRecord);
  }

  for (const storyNode of project.storyNodes) {
    for (const personId of storyNode.relatedPersonIds ?? []) {
      if (!hasRecord(project, "people", personId)) {
        addMissingReferenceIssue({
          id: `linked.story-nodes.person.${storyNode.id}.${personId}`,
          severity: "attention",
          title: "剧情节点关联人物缺失",
          message: `剧情节点 ${storyNode.id} 关联的人物 ${personId} 不存在。`,
          targetFamily: "storyNodes",
          targetEntityId: storyNode.id,
          targetTab: "links",
        });
      }
    }

    for (const dialogueId of storyNode.relatedDialogueIds ?? []) {
      if (!hasRecord(project, "dialogues", dialogueId)) {
        addMissingReferenceIssue({
          id: `linked.story-nodes.dialogue.${storyNode.id}.${dialogueId}`,
          severity: "attention",
          title: "剧情节点关联对话缺失",
          message: `剧情节点 ${storyNode.id} 关联的对话 ${dialogueId} 不存在。`,
          targetFamily: "storyNodes",
          targetEntityId: storyNode.id,
          targetTab: "links",
        });
      }
    }

    for (const eventId of storyNode.relatedEventIds ?? []) {
      if (!hasRecord(project, "events", eventId)) {
        addMissingReferenceIssue({
          id: `linked.story-nodes.event.${storyNode.id}.${eventId}`,
          severity: "attention",
          title: "剧情节点关联事件缺失",
          message: `剧情节点 ${storyNode.id} 关联的事件 ${eventId} 不存在。`,
          targetFamily: "storyNodes",
          targetEntityId: storyNode.id,
          targetTab: "links",
        });
      }
    }
  }

  for (const minigame of project.minigames) {
    if (
      minigame.ownerKind === "house" &&
      typeof minigame.ownerId === "string" &&
      minigame.ownerId.length > 0 &&
      !hasRecord(project, "buildings", minigame.ownerId)
    ) {
      addMissingReferenceIssue({
        id: `linked.minigames.owner.${minigame.id}`,
        severity: "attention",
        title: "玩法宿主缺失",
        message: `玩法绑定 ${minigame.id} 指向的宿主建筑 ${minigame.ownerId} 不存在。`,
        targetFamily: "minigames",
        targetEntityId: minigame.id,
        targetTab: "basics",
      });
    }
  }

  return issues;
}

function appendMissingRelationIssues(
  project: ScriptEditorProjectDefinition,
  issues: ScriptEditorWorkspaceValidationIssue[],
  eventRecord: ScriptEditorEventRecord
): void {
  const relationEntries: Array<{
    family: "people" | "cities" | "buildings";
    label: string;
    values: string[];
  }> = [
    {
      family: "people",
      label: "人物",
      values: eventRecord.relations?.personIds ?? [],
    },
    {
      family: "cities",
      label: "城市",
      values: eventRecord.relations?.cityIds ?? [],
    },
    {
      family: "buildings",
      label: "建筑",
      values: eventRecord.relations?.buildingIds ?? [],
    },
  ];

  for (const entry of relationEntries) {
    for (const targetId of entry.values) {
      if (hasRecord(project, entry.family, targetId)) {
        continue;
      }

      issues.push({
        id: `linked.events.relation.${entry.family}.${eventRecord.id}.${targetId}`,
        severity: "attention",
        title: "事件关联对象缺失",
        message: `事件 ${eventRecord.id} 关联的${entry.label} ${targetId} 不存在。`,
        actionLabel: "定位问题",
        targetFamily: "events",
        targetEntityId: eventRecord.id,
        targetTab: "relations",
      });
    }
  }
}

function createIssueFromExportDiagnostic(
  project: ScriptEditorProjectDefinition,
  diagnostic: ScriptEditorRuntimeExportDiagnostic,
  index: number
): ScriptEditorWorkspaceValidationIssue {
  const target = resolveFieldPathTarget(project, diagnostic.fieldPath);

  return {
    id: `export.${diagnostic.code}.${index}`,
    severity: "blocked",
    title: createExportIssueTitle(diagnostic),
    message: diagnostic.message,
    actionLabel: "回跳作者面",
    targetFamily: target.family,
    targetEntityId: target.entityId,
    targetTab: target.tab,
  };
}

function createExportIssueTitle(
  diagnostic: ScriptEditorRuntimeExportDiagnostic
): string {
  switch (diagnostic.code) {
    case "missing-field":
      return "必填字段缺失";
    case "invalid-field":
      return "字段格式非法";
    case "duplicate-id":
      return "对象 ID 冲突";
    case "missing-reference":
      return "导出引用缺失";
    case "unsupported-lowering":
      return "导出 lowering 未补齐";
    case "runtime-pack-contract":
      return "运行时导出契约失败";
    case "unsupported-family":
    default:
      return "当前导出路径仍受限";
  }
}

function resolveFieldPathTarget(
  project: ScriptEditorProjectDefinition,
  fieldPath: string
): {
  family: ScriptEditorProjectFileKey;
  entityId: string | null;
  tab: string | null;
} {
  const match =
    /^project\.([a-zA-Z]+)(?:\[(\d+)\])?(?:\.(.+))?$/u.exec(fieldPath);
  if (match == null) {
    return {
      family: "storyPack",
      entityId: null,
      tab: null,
    };
  }

  const rawFamily = match[1];
  const rawIndex = match[2];
  const remainder = match[3];
  if (rawFamily == null) {
    return {
      family: "storyPack",
      entityId: null,
      tab: null,
    };
  }
  if (!(rawFamily in FAMILY_LABELS)) {
    return {
      family: "storyPack",
      entityId: null,
      tab: null,
    };
  }

  const family = rawFamily as ScriptEditorProjectFileKey;
  if (family === "storyPack") {
    return {
      family,
      entityId: null,
      tab: null,
    };
  }

  const index = rawIndex == null ? -1 : Number.parseInt(rawIndex, 10);
  const record = index >= 0 ? getFamilyRecords(project, family)[index] ?? null : null;

  return {
    family,
    entityId: record?.id ?? null,
    tab: resolveIssueTab(family, remainder ?? ""),
  };
}

function resolveIssueTab(
  family: ScriptEditorProjectFileKey,
  remainder: string
): string | null {
  if (family === "people") {
    if (remainder.startsWith("dialogueIds")) {
      return "dialogues";
    }
    if (remainder.startsWith("eventIds")) {
      return "events";
    }
    return "profile";
  }

  if (family === "cities" || family === "buildings") {
    if (remainder.startsWith("menuEntries")) {
      return "menus";
    }
    if (remainder.startsWith("access")) {
      return "access";
    }
    if (family === "buildings" && remainder.startsWith("entryBinding")) {
      return "entry";
    }
    return "profile";
  }

  if (family === "dialogues") {
    if (remainder.startsWith("followUps")) {
      return "summary";
    }
    if (remainder.startsWith("nodes")) {
      return "nodes";
    }
    return "profile";
  }

  if (family === "events") {
    if (remainder.startsWith("destination")) {
      return "destination";
    }
    if (remainder.startsWith("relations")) {
      return "relations";
    }
    if (remainder.startsWith("previewSummary")) {
      return "preview";
    }
    if (remainder.startsWith("conditionGroups")) {
      return "conditions";
    }
    return "basics";
  }

  if (family === "minigames") {
    if (remainder.startsWith("launchPayload")) {
      return "launch";
    }
    if (remainder.startsWith("outcomeRoutes")) {
      return "settlement";
    }
    return "basics";
  }

  if (family === "storyNodes") {
    return remainder.startsWith("related") ? "links" : "profile";
  }

  return null;
}

function createExportTargets(
  project: ScriptEditorProjectDefinition,
  selection: {
    family: ScriptEditorProjectFileKey;
    entityId: string | null;
  },
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[]
): ScriptEditorWorkspaceExportTarget[] {
  const family = selection.family;
  const relevantDiagnostics = exportDiagnostics.filter((diagnostic) => {
    const target = resolveFieldPathTarget(project, diagnostic.fieldPath);
    return target.family === family || family === "storyPack";
  });

  const buildTarget = (
    id: string,
    label: string,
    file: string,
    body: string,
    status: "ready" | "blocked" | "deferred"
  ): ScriptEditorWorkspaceExportTarget => ({
    id,
    label,
    file,
    body,
    status,
  });

  const blockedStatus =
    relevantDiagnostics.length > 0 ? "blocked" : "ready";

  switch (family) {
    case "storyPack":
      return [
        buildTarget(
          "export.pack",
          "项目元信息",
          "pack.json",
          "项目标题、版本与 canonical 文件索引由 pack.json 承接。",
          blockedStatus
        ),
        buildTarget(
          "export.scenario-profile",
          "开局配置",
          "scenario-profile.json",
          "开场角色、章节与初始位置由 scenario-profile.json 承接。",
          blockedStatus
        ),
      ];
    case "people":
      return [
        buildTarget(
          "export.characters",
          "人物落点",
          "characters.json",
          "人物基本资料直接映射到角色正式分表。",
          blockedStatus
        ),
      ];
    case "cities":
      return [
        buildTarget(
          "export.cities",
          "城市落点",
          "cities.json",
          "城市配置和菜单入口沿用正式城市分表。",
          blockedStatus
        ),
      ];
    case "buildings":
      return [
        buildTarget(
          "export.houses",
          "建筑落点",
          "houses.json",
          "建筑与入口绑定沿用正式 house 分表。",
          blockedStatus
        ),
      ];
    case "events":
      return [
        buildTarget(
          "export.events",
          "事件落点",
          "events.json",
          "事件对象会直接落到 events.json，去向与关系需在导出前保持可达。",
          blockedStatus
        ),
      ];
    case "activities":
      return [
        buildTarget(
          "export.activities",
          "活动落点",
          "activities.json",
          "活动、house 任务与 QTE 配置直接进入正式 activities.json 分表。",
          blockedStatus
        ),
      ];
    case "dialogues":
      return [
        buildTarget(
          "export.scenes",
          "对话演出",
          "scenes.json",
          "对话演出内容未来会下沉到 scenes.json。",
          "deferred"
        ),
        buildTarget(
          "export.text-entries",
          "对话文案",
          "text-entries.json",
          "文案条目会与 scenes lowering 一起进入正式文本分表。",
          "deferred"
        ),
      ];
    case "scenes":
      return [
        buildTarget(
          "export.authored-scenes",
          "场景落点",
          "scenes.json",
          "场景记录会直接进入 scenes.json，便于建筑进入演出与后续作者面预览统一消费。",
          blockedStatus
        ),
      ];
    case "minigames":
      return [
        buildTarget(
          "export.minigames",
          "玩法调用落点",
          "events/scenes/menu bindings",
          "玩法绑定采用下沉导出，不会生成新的独立 runtime 分表。",
          "deferred"
        ),
      ];
    case "storyNodes":
      return [
        buildTarget(
          "export.story-nodes",
          "剧情承载落点",
          "events/scenes/runtime config",
          "剧情节点继续作为组织对象下沉到正式事件/场景承载结构。",
          "deferred"
        ),
      ];
    case "textEntries":
      return [
        buildTarget(
          "export.text-entries-only",
          "文本落点",
          "text-entries.json",
          "文本条目直接进入 text-entries.json。",
          blockedStatus
        ),
      ];
    default:
      return [
        buildTarget(
          "export.pending",
          "待补齐导出落点",
          "pending",
          "当前家族仍属于后续队列的导出收口范围。",
          DEFERRED_EXPORT_TARGET_FAMILIES.has(family) ? "deferred" : blockedStatus
        ),
      ];
  }
}

function collectAttentionFamilies(
  exportDiagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Set<ScriptEditorProjectFileKey> {
  const families = new Set<ScriptEditorProjectFileKey>();

  for (const diagnostic of exportDiagnostics) {
    const target = /^project\.([^.]+)/u.exec(diagnostic.fieldPath)?.[1];
    if (target != null && target in FAMILY_LABELS) {
      families.add(target as ScriptEditorProjectFileKey);
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
): ScriptEditorEntityRecord[] | ScriptEditorTextEntryRecord[] | ScriptEditorActivityRecord[] {
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
    case "activities":
      return project.activities;
    case "dialogues":
      return project.dialogues;
    case "scenes":
      return project.scenes;
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
    default:
      return [];
  }
}

function hasRecord(
  project: ScriptEditorProjectDefinition,
  family: Exclude<ScriptEditorProjectFileKey, "storyPack">,
  id: string
): boolean {
  return getFamilyRecords(project, family).some((record) => record.id === id);
}

function resolveAuthoringTargetFamily(
  family:
    | "dialogue"
    | "event"
    | "person"
    | "city"
    | "building"
    | "minigame"
    | "trade"
    | "info"
): Exclude<ScriptEditorProjectFileKey, "storyPack"> | null {
  switch (family) {
    case "person":
      return "people";
    case "dialogue":
      return "dialogues";
    case "event":
      return "events";
    case "city":
      return "cities";
    case "building":
      return "buildings";
    case "minigame":
      return "minigames";
    default:
      return null;
  }
}

function describeRecord(record: Record<string, unknown>): string {
  return readPrimarySummary(record) ?? "对象已创建，可继续补齐创作信息。";
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
    .map(([key, value]) => `${localizePreviewKey(key)}: ${formatPreviewValue(value)}`);

  if (lines.length === 0) {
    return "当前对象尚未填写可供创作参考的摘要字段。";
  }

  return lines.join(" | ");
}

function readPrimarySummary(record: Record<string, unknown>): string | null {
  for (const key of [
    "description",
    "biography",
    "summary",
    "title",
    "name",
    "label",
    "text",
  ]) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
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

function localizePreviewKey(key: string): string {
  switch (key) {
    case "name":
      return "名称";
    case "title":
      return "标题";
    case "description":
      return "说明";
    case "summary":
      return "摘要";
    case "biography":
      return "简介";
    case "personType":
      return "人物类型";
    case "occupation":
      return "职责";
    case "cityId":
      return "所属城市";
    case "triggerTiming":
      return "触发时机";
    case "playableId":
      return "玩法模板";
    case "notes":
      return "备注";
    default:
      return key;
  }
}

function countCompatibilityResidue(project: ScriptEditorProjectDefinition): number {
  const compatibilityImport = (
    project.storyPack as Record<string, unknown>
  ).compatibilityImport;
  if (compatibilityImport == null || typeof compatibilityImport !== "object") {
    return 0;
  }

  const unresolvedFamilies = (compatibilityImport as Record<string, unknown>)
    .unresolvedFamilies;
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
