import type { ActionNode, ChoiceOption } from "../../domain/action";

export type TextResolutionContext = {
  textEntriesById: Record<string, string>;
};

export type TextTemplateValues = Record<
  string,
  string | number | boolean | null | undefined
>;

export function resolveTextEntry(
  textEntriesById: Record<string, string>,
  textId?: string,
  fallback?: string
): string {
  if (textId != null && textEntriesById[textId] != null) {
    return textEntriesById[textId];
  }

  if (fallback != null) {
    return fallback;
  }

  return textId ?? "";
}

export function resolveTextTemplateEntry(
  textEntriesById: Record<string, string>,
  textId: string | undefined,
  values: TextTemplateValues,
  fallback?: string
): string {
  const template = resolveTextEntry(textEntriesById, textId, fallback);

  return template.replace(/\{([a-zA-Z0-9_.-]+)\}/g, (match, key: string) => {
    const value = values[key];
    return value == null ? match : String(value);
  });
}

export function resolveChoiceOptionText(
  option: ChoiceOption,
  context: TextResolutionContext
): ChoiceOption & { label: string } {
  return {
    ...option,
    label: resolveTextEntry(
      context.textEntriesById,
      option.labelTextId,
      option.label
    ),
  };
}

export function resolveActionNodeText(
  action: ActionNode,
  context: TextResolutionContext
): ActionNode {
  if (action.type === "narration" || action.type === "dialogue") {
    return {
      ...action,
      text: resolveTextEntry(context.textEntriesById, action.textId, action.text),
    };
  }

  if (action.type === "choice") {
    return {
      ...action,
      prompt: resolveTextEntry(
        context.textEntriesById,
        action.promptTextId,
        action.prompt
      ),
      options: action.options.map((option) => resolveChoiceOptionText(option, context)),
    };
  }

  return action;
}
