import type { ModSourceDescriptor } from "../contracts/mod-runtime";

export function normalizeModSource(
  input: ModSourceDescriptor
): ModSourceDescriptor {
  if (input.kind === "builtin") {
    return {
      kind: "builtin",
      modId: normalizeRequiredText(input.modId, "builtin mod id"),
    };
  }

  if (input.kind === "file") {
    return {
      kind: "file",
      name: normalizeRequiredText(input.name, "file mod name"),
      filePath: normalizeRequiredText(input.filePath, "file mod path"),
    };
  }

  return {
    kind: "url",
    name: normalizeRequiredText(input.name, "url mod name"),
    url: normalizeRequiredText(input.url, "url mod url"),
  };
}

function normalizeRequiredText(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`Missing ${label}.`);
  }

  return normalized;
}
