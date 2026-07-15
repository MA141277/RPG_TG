export const screenSchemaComponentKinds = [
  "panel",
  "button",
  "label",
  "portrait",
  "list",
  "progress",
] as const;

export type ScreenSchemaComponentKind =
  (typeof screenSchemaComponentKinds)[number];

export type ScreenSchemaComponent = {
  id: string;
  kind: ScreenSchemaComponentKind;
  required: boolean;
  defaultVisible: boolean;
};

export type ScreenSchema = {
  id: string;
  version: number;
  components: ScreenSchemaComponent[];
};

export function isScreenSchemaComponentKind(
  value: unknown
): value is ScreenSchemaComponentKind {
  return (
    typeof value === "string" &&
    screenSchemaComponentKinds.includes(value as ScreenSchemaComponentKind)
  );
}

export function isScreenSchema(value: unknown): value is ScreenSchema {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.version === "number" &&
    Array.isArray(candidate.components)
  );
}
