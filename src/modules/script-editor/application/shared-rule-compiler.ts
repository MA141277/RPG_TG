import type {
  Effect,
  TaskCondition,
  TaskDefinition,
  TaskStatus,
} from "./script-editor-shared-rule-contract";
import type {
  ScriptEditorConditionGroup,
  ScriptEditorConditionNode,
  ScriptEditorEntityRecord,
  ScriptEditorProjectDefinition,
} from "../domain/script-editor-project";

export type ScriptEditorSharedRuleDiagnostic = {
  code:
    | "missing-field"
    | "invalid-field"
    | "duplicate-id"
    | "missing-reference"
    | "unsupported-lowering";
  fieldPath: string;
  message: string;
};

type SharedConditionGroupRecord = ScriptEditorConditionGroup;
type SharedConditionNode = ScriptEditorConditionNode;

type SharedEffectBundleRecord = {
  id: string;
  effects: SharedEffectNode[];
};

type SharedEffectNode =
  | {
      type: "setFlag";
      key: string;
      value: boolean;
    }
  | {
      type: "setVariable";
      key: string;
      value: string | number;
    }
  | {
      type: "advanceTime";
      hours?: number;
      days?: number;
    }
  | {
      type: "mutateCharacterNumericProperty";
      characterId: string;
      propertyId: string;
      operation: "set" | "add" | "subtract";
      value: number;
    }
  | {
      type: string;
      [key: string]: unknown;
    };

type SharedRuleTaskAuthoringRecord = {
  id: string;
  title: string;
  description?: string;
  initialState?: "inactive" | "active";
  objectives: Array<{
    id: string;
    target: number;
    signalType: string;
    description?: string;
  }>;
  startConditionGroupId?: string;
  completionConditionGroupId?: string;
  failureConditionGroupId?: string;
  onStartEffectBundleId?: string;
  onProgressEffectBundleId?: string;
  onCompleteEffectBundleId?: string;
  onFailEffectBundleId?: string;
  tags?: string[];
};

export function compileScriptEditorProjectTasks(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): TaskDefinition[] | null {
  const conditionGroupsById = indexSharedRuleRecords(
    project.conditionGroups,
    "project.conditionGroups",
    diagnostics
  );
  const effectBundlesById = indexSharedRuleRecords(
    project.effectBundles,
    "project.effectBundles",
    diagnostics
  );
  const compiledTasks = project.quests.map((questRecord, index) =>
    compileScriptEditorTaskRecord({
      record: questRecord,
      fieldPath: `project.quests[${index}]`,
      conditionGroupsById,
      effectBundlesById,
      diagnostics,
    })
  );

  return diagnostics.length === 0 ? compiledTasks : null;
}

function compileScriptEditorTaskRecord(input: {
  record: ScriptEditorEntityRecord;
  fieldPath: string;
  conditionGroupsById: Record<string, ScriptEditorEntityRecord>;
  effectBundlesById: Record<string, ScriptEditorEntityRecord>;
  diagnostics: ScriptEditorSharedRuleDiagnostic[];
}): TaskDefinition {
  if (!hasSharedRuleTaskReferences(input.record)) {
    return parseDirectTaskDefinition(input.record, input.fieldPath, input.diagnostics);
  }

  const taskRecord = parseSharedRuleTaskAuthoringRecord(
    input.record,
    input.fieldPath,
    input.diagnostics
  );

  return {
    id: taskRecord.id,
    title: taskRecord.title,
    ...(taskRecord.description == null ? {} : { description: taskRecord.description }),
    ...(taskRecord.initialState == null ? {} : { initialState: taskRecord.initialState }),
    objectives: taskRecord.objectives,
    ...(taskRecord.startConditionGroupId == null
      ? {}
      : {
          startConditions: compileConditionGroupReference({
            referenceId: taskRecord.startConditionGroupId,
            fieldPath: `${input.fieldPath}.startConditionGroupId`,
            conditionGroupsById: input.conditionGroupsById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.completionConditionGroupId == null
      ? {}
      : {
          completionConditions: compileConditionGroupReference({
            referenceId: taskRecord.completionConditionGroupId,
            fieldPath: `${input.fieldPath}.completionConditionGroupId`,
            conditionGroupsById: input.conditionGroupsById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.failureConditionGroupId == null
      ? {}
      : {
          failureConditions: compileConditionGroupReference({
            referenceId: taskRecord.failureConditionGroupId,
            fieldPath: `${input.fieldPath}.failureConditionGroupId`,
            conditionGroupsById: input.conditionGroupsById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.onStartEffectBundleId == null
      ? {}
      : {
          onStartEffects: compileEffectBundleReference({
            referenceId: taskRecord.onStartEffectBundleId,
            fieldPath: `${input.fieldPath}.onStartEffectBundleId`,
            effectBundlesById: input.effectBundlesById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.onProgressEffectBundleId == null
      ? {}
      : {
          onProgressEffects: compileEffectBundleReference({
            referenceId: taskRecord.onProgressEffectBundleId,
            fieldPath: `${input.fieldPath}.onProgressEffectBundleId`,
            effectBundlesById: input.effectBundlesById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.onCompleteEffectBundleId == null
      ? {}
      : {
          onCompleteEffects: compileEffectBundleReference({
            referenceId: taskRecord.onCompleteEffectBundleId,
            fieldPath: `${input.fieldPath}.onCompleteEffectBundleId`,
            effectBundlesById: input.effectBundlesById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.onFailEffectBundleId == null
      ? {}
      : {
          onFailEffects: compileEffectBundleReference({
            referenceId: taskRecord.onFailEffectBundleId,
            fieldPath: `${input.fieldPath}.onFailEffectBundleId`,
            effectBundlesById: input.effectBundlesById,
            diagnostics: input.diagnostics,
          }),
        }),
    ...(taskRecord.tags == null ? {} : { tags: taskRecord.tags }),
  };
}

function compileConditionGroupReference(input: {
  referenceId: string;
  fieldPath: string;
  conditionGroupsById: Record<string, ScriptEditorEntityRecord>;
  diagnostics: ScriptEditorSharedRuleDiagnostic[];
}): TaskCondition[] {
  const conditionGroupRecord = input.conditionGroupsById[input.referenceId];
  if (conditionGroupRecord == null) {
    input.diagnostics.push({
      code: "missing-reference",
      fieldPath: input.fieldPath,
      message: `Shared condition group "${input.referenceId}" does not exist.`,
    });
    return [];
  }

  const parsedGroup = parseSharedConditionGroupRecord(
    conditionGroupRecord,
    `${input.fieldPath}#${input.referenceId}`,
    input.diagnostics
  );
  return compileTaskConditionGroup(
    parsedGroup,
    `${input.fieldPath}#${input.referenceId}`,
    input.diagnostics
  );
}

function compileEffectBundleReference(input: {
  referenceId: string;
  fieldPath: string;
  effectBundlesById: Record<string, ScriptEditorEntityRecord>;
  diagnostics: ScriptEditorSharedRuleDiagnostic[];
}): Effect[] {
  const effectBundleRecord = input.effectBundlesById[input.referenceId];
  if (effectBundleRecord == null) {
    input.diagnostics.push({
      code: "missing-reference",
      fieldPath: input.fieldPath,
      message: `Shared effect bundle "${input.referenceId}" does not exist.`,
    });
    return [];
  }

  const parsedBundle = parseSharedEffectBundleRecord(
    effectBundleRecord,
    `${input.fieldPath}#${input.referenceId}`,
    input.diagnostics
  );

  return parsedBundle.effects.flatMap((effectNode, index) =>
    compileTaskEffectNode(
      effectNode,
      `${input.fieldPath}#${input.referenceId}.effects[${index}]`,
      input.diagnostics
    )
  );
}

function compileTaskConditionGroup(
  conditionGroup: SharedConditionGroupRecord,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): TaskCondition[] {
  if (conditionGroup.operator !== "all") {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `${fieldPath}.operator`,
      message:
        `Task shared-rule lowering currently supports only "all" condition groups, but received "${conditionGroup.operator}".`,
    });
    return [];
  }

  return conditionGroup.conditions.flatMap((conditionNode, index) =>
    compileTaskConditionNode(
      conditionNode,
      `${fieldPath}.conditions[${index}]`,
      diagnostics
    )
  );
}

function compileTaskConditionNode(
  conditionNode: SharedConditionNode,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): TaskCondition[] {
  if (conditionNode.type === "group") {
    const childConditions = Array.isArray(conditionNode.conditions)
      ? (conditionNode.conditions as SharedConditionNode[])
      : null;
    if (childConditions == null) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.conditions`,
        message: "Nested shared condition group must provide a conditions array.",
      });
      return [];
    }

    if (conditionNode.operator !== "all") {
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `${fieldPath}.operator`,
        message:
          `Task shared-rule lowering currently supports only nested "all" groups, but received "${conditionNode.operator}".`,
      });
      return [];
    }

    return childConditions.flatMap((childNode, index) =>
      compileTaskConditionNode(
        childNode,
        `${fieldPath}.conditions[${index}]`,
        diagnostics
      )
    );
  }

  if (conditionNode.type === "flag") {
    if (
      typeof conditionNode.key !== "string" ||
      typeof conditionNode.expected !== "boolean"
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message: "Shared task flag condition requires string key and boolean expected.",
      });
      return [];
    }

    return [
      {
        type: "flag",
        flag: conditionNode.key,
        value: conditionNode.expected,
      },
    ];
  }

  if (conditionNode.type === "task-status") {
    if (
      typeof conditionNode.taskId !== "string" ||
      !["inactive", "active", "completed", "failed"].includes(
        String(conditionNode.status)
      )
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message:
          "Shared task-status condition requires string taskId and one valid task status.",
      });
      return [];
    }

    return [
      {
        type: "task-status",
        taskId: conditionNode.taskId,
        status: conditionNode.status as TaskStatus,
      },
    ];
  }

  if (conditionNode.type === "signal") {
    if (typeof conditionNode.signalType !== "string") {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message: "Shared signal condition requires a string signalType.",
      });
      return [];
    }

    return [
      {
        type: "signal",
        signalType: conditionNode.signalType,
      },
    ];
  }

  if (conditionNode.type === "elapsed-time") {
    if (
      typeof conditionNode.since !== "string" ||
      typeof conditionNode.atLeastDays !== "number" ||
      !Number.isFinite(conditionNode.atLeastDays)
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message:
          "Shared elapsed-time condition requires string since and finite numeric atLeastDays.",
      });
      return [];
    }

    return [
      {
        type: "elapsed-time",
        since: conditionNode.since,
        atLeastDays: conditionNode.atLeastDays,
      },
    ];
  }

  diagnostics.push({
    code: "unsupported-lowering",
    fieldPath: `${fieldPath}.type`,
    message:
      `Shared condition type "${conditionNode.type}" cannot yet lower into the current task runtime contract.`,
  });
  return [];
}

function compileTaskEffectNode(
  effectNode: SharedEffectNode,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): Effect[] {
  if (effectNode.type === "setFlag") {
    if (
      typeof effectNode.key !== "string" ||
      typeof effectNode.value !== "boolean"
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message: "Shared setFlag effect requires string key and boolean value.",
      });
      return [];
    }

    return [{ type: "setFlag", key: effectNode.key, value: effectNode.value }];
  }

  if (effectNode.type === "setVariable") {
    if (
      typeof effectNode.key !== "string" ||
      (typeof effectNode.value !== "string" && typeof effectNode.value !== "number")
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message:
          "Shared setVariable effect requires string key and string-or-number value.",
      });
      return [];
    }

    return [{ type: "setVariable", key: effectNode.key, value: effectNode.value }];
  }

  if (effectNode.type === "advanceTime") {
    const hours =
      effectNode.hours == null
        ? undefined
        : typeof effectNode.hours === "number" && Number.isFinite(effectNode.hours)
          ? effectNode.hours
          : null;
    const days =
      effectNode.days == null
        ? undefined
        : typeof effectNode.days === "number" && Number.isFinite(effectNode.days)
          ? effectNode.days
          : null;

    if (hours === null || days === null) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message: "Shared advanceTime effect requires finite numeric hours/days when provided.",
      });
      return [];
    }

    return [{ type: "advanceTime", ...(hours == null ? {} : { hours }), ...(days == null ? {} : { days }) }];
  }

  if (effectNode.type === "mutateCharacterNumericProperty") {
    if (
      typeof effectNode.characterId !== "string" ||
      typeof effectNode.propertyId !== "string" ||
      !["set", "add", "subtract"].includes(String(effectNode.operation)) ||
      typeof effectNode.value !== "number" ||
      !Number.isFinite(effectNode.value)
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message:
          "Shared mutateCharacterNumericProperty effect requires string characterId/propertyId, set/add/subtract operation, and finite numeric value.",
      });
      return [];
    }

    return [
      {
        type: "mutateCharacterNumericProperty",
        characterId: effectNode.characterId,
        propertyId: effectNode.propertyId,
        operation: effectNode.operation as "set" | "add" | "subtract",
        value: effectNode.value,
      },
    ];
  }

  diagnostics.push({
    code: "unsupported-lowering",
    fieldPath: `${fieldPath}.type`,
    message:
      `Shared effect type "${effectNode.type}" cannot yet lower into the current runtime effect settlement path.`,
  });
  return [];
}

function indexSharedRuleRecords(
  records: readonly ScriptEditorEntityRecord[],
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): Record<string, ScriptEditorEntityRecord> {
  return records.reduce<Record<string, ScriptEditorEntityRecord>>((indexed, record, index) => {
    if (indexed[record.id] != null) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `${fieldPath}[${index}].id`,
        message: `Duplicate shared-rule record id "${record.id}" is not allowed.`,
      });
      return indexed;
    }

    indexed[record.id] = record;
    return indexed;
  }, {});
}

function hasSharedRuleTaskReferences(record: ScriptEditorEntityRecord): boolean {
  return [
    "startConditionGroupId",
    "completionConditionGroupId",
    "failureConditionGroupId",
    "onStartEffectBundleId",
    "onProgressEffectBundleId",
    "onCompleteEffectBundleId",
    "onFailEffectBundleId",
  ].some((key) => typeof record[key] === "string");
}

function parseDirectTaskDefinition(
  record: ScriptEditorEntityRecord,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): TaskDefinition {
  const title = readNonEmptyString(record.title, `${fieldPath}.title`, diagnostics) ?? record.id;
  const objectives = readDirectTaskObjectives(
    record.objectives,
    `${fieldPath}.objectives`,
    diagnostics
  );

  return {
    id: record.id,
    title,
    ...(typeof record.description === "string" ? { description: record.description } : {}),
    ...(record.initialState === "inactive" || record.initialState === "active"
      ? { initialState: record.initialState }
      : {}),
    objectives,
    ...(Array.isArray(record.startConditions)
      ? { startConditions: record.startConditions as TaskCondition[] }
      : {}),
    ...(Array.isArray(record.completionConditions)
      ? { completionConditions: record.completionConditions as TaskCondition[] }
      : {}),
    ...(Array.isArray(record.failureConditions)
      ? { failureConditions: record.failureConditions as TaskCondition[] }
      : {}),
    ...(Array.isArray(record.onStartEffects)
      ? { onStartEffects: record.onStartEffects as Effect[] }
      : {}),
    ...(Array.isArray(record.onProgressEffects)
      ? { onProgressEffects: record.onProgressEffects as Effect[] }
      : {}),
    ...(Array.isArray(record.onCompleteEffects)
      ? { onCompleteEffects: record.onCompleteEffects as Effect[] }
      : {}),
    ...(Array.isArray(record.onFailEffects)
      ? { onFailEffects: record.onFailEffects as Effect[] }
      : {}),
    ...(Array.isArray(record.tags) &&
    record.tags.every((value) => typeof value === "string")
      ? { tags: record.tags as string[] }
      : {}),
  };
}

function parseSharedRuleTaskAuthoringRecord(
  record: ScriptEditorEntityRecord,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedRuleTaskAuthoringRecord {
  return {
    id: record.id,
    title: readNonEmptyString(record.title, `${fieldPath}.title`, diagnostics) ?? record.id,
    ...(typeof record.description === "string" ? { description: record.description } : {}),
    ...(record.initialState === "inactive" || record.initialState === "active"
      ? { initialState: record.initialState }
      : {}),
    objectives: readSharedRuleTaskObjectives(
      record.objectives,
      `${fieldPath}.objectives`,
      diagnostics
    ),
    ...readOptionalReference(
      record.startConditionGroupId,
      `${fieldPath}.startConditionGroupId`,
      "startConditionGroupId",
      diagnostics
    ),
    ...readOptionalReference(
      record.completionConditionGroupId,
      `${fieldPath}.completionConditionGroupId`,
      "completionConditionGroupId",
      diagnostics
    ),
    ...readOptionalReference(
      record.failureConditionGroupId,
      `${fieldPath}.failureConditionGroupId`,
      "failureConditionGroupId",
      diagnostics
    ),
    ...readOptionalReference(
      record.onStartEffectBundleId,
      `${fieldPath}.onStartEffectBundleId`,
      "onStartEffectBundleId",
      diagnostics
    ),
    ...readOptionalReference(
      record.onProgressEffectBundleId,
      `${fieldPath}.onProgressEffectBundleId`,
      "onProgressEffectBundleId",
      diagnostics
    ),
    ...readOptionalReference(
      record.onCompleteEffectBundleId,
      `${fieldPath}.onCompleteEffectBundleId`,
      "onCompleteEffectBundleId",
      diagnostics
    ),
    ...readOptionalReference(
      record.onFailEffectBundleId,
      `${fieldPath}.onFailEffectBundleId`,
      "onFailEffectBundleId",
      diagnostics
    ),
    ...(Array.isArray(record.tags) &&
    record.tags.every((value) => typeof value === "string")
      ? { tags: record.tags as string[] }
      : {}),
  };
}

function parseSharedConditionGroupRecord(
  record: ScriptEditorEntityRecord,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedConditionGroupRecord {
  const operator = readString(record.operator, `${fieldPath}.operator`, diagnostics);
  const conditions = readConditionNodes(record.conditions, `${fieldPath}.conditions`, diagnostics);

  return {
    id: record.id,
    operator:
      operator === "all" || operator === "any" || operator === "not"
        ? operator
        : "all",
    conditions,
  };
}

function parseSharedEffectBundleRecord(
  record: ScriptEditorEntityRecord,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedEffectBundleRecord {
  return {
    id: record.id,
    effects: readEffectNodes(record.effects, `${fieldPath}.effects`, diagnostics),
  };
}

function readDirectTaskObjectives(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedRuleTaskAuthoringRecord["objectives"] {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: "Task objectives must be an array when present.",
    });
    return [];
  }

  return readTaskObjectiveEntries(value, fieldPath, diagnostics);
}

function readSharedRuleTaskObjectives(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedRuleTaskAuthoringRecord["objectives"] {
  if (!Array.isArray(value)) {
    diagnostics.push({
      code: "missing-field",
      fieldPath,
      message: "Shared-rule task authoring requires a non-empty objectives array.",
    });
    return [];
  }

  if (value.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath,
      message: "Shared-rule task authoring requires a non-empty objectives array.",
    });
    return [];
  }

  return readTaskObjectiveEntries(value, fieldPath, diagnostics);
}

function readTaskObjectiveEntries(
  value: readonly unknown[],
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedRuleTaskAuthoringRecord["objectives"] {
  return value.flatMap((entry, index) => {
    if (entry == null || typeof entry !== "object" || Array.isArray(entry)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}[${index}]`,
        message: "Task objective must be an object.",
      });
      return [];
    }

    const candidate = entry as Record<string, unknown>;
    const id = readNonEmptyString(candidate.id, `${fieldPath}[${index}].id`, diagnostics);
    const signalType = readNonEmptyString(
      candidate.signalType,
      `${fieldPath}[${index}].signalType`,
      diagnostics
    );
    const target = readFiniteNumber(candidate.target, `${fieldPath}[${index}].target`, diagnostics);

    if (id == null || signalType == null || target == null) {
      return [];
    }

    return [
      {
        id,
        signalType,
        target,
        ...(typeof candidate.description === "string"
          ? { description: candidate.description }
          : {}),
      },
    ];
  });
}

function readConditionNodes(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedConditionNode[] {
  if (!Array.isArray(value)) {
    diagnostics.push({
      code: "missing-field",
      fieldPath,
      message: "Shared condition group must provide a conditions array.",
    });
    return [];
  }

  return value.flatMap((entry, index) => {
    if (entry == null || typeof entry !== "object" || Array.isArray(entry)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}[${index}]`,
        message: "Shared condition node must be an object.",
      });
      return [];
    }

    return [entry as SharedConditionNode];
  });
}

function readEffectNodes(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): SharedEffectNode[] {
  if (!Array.isArray(value)) {
    diagnostics.push({
      code: "missing-field",
      fieldPath,
      message: "Shared effect bundle must provide an effects array.",
    });
    return [];
  }

  return value.flatMap((entry, index) => {
    if (entry == null || typeof entry !== "object" || Array.isArray(entry)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}[${index}]`,
        message: "Shared effect node must be an object.",
      });
      return [];
    }

    return [entry as SharedEffectNode];
  });
}

function readOptionalReference(
  value: unknown,
  fieldPath: string,
  propertyName: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): Partial<Record<typeof propertyName, string>> {
  if (value == null) {
    return {};
  }

  const resolved = readNonEmptyString(value, fieldPath, diagnostics);
  return resolved == null ? {} : { [propertyName]: resolved };
}

function readNonEmptyString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  diagnostics.push({
    code: "missing-field",
    fieldPath,
    message: `${fieldPath} must be a non-empty string.`,
  });
  return null;
}

function readString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): string | null {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  diagnostics.push({
    code: "missing-field",
    fieldPath,
    message: `${fieldPath} must be a non-empty string.`,
  });
  return null;
}

function readFiniteNumber(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorSharedRuleDiagnostic[]
): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  diagnostics.push({
    code: "invalid-field",
    fieldPath,
    message: `${fieldPath} must be a finite number.`,
  });
  return null;
}
