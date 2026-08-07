export type ScriptEditorPersonAttributeMapping = {
  key: string;
  keyName: string;
  semanticKey?: string | undefined;
  type: "number" | "string" | "boolean" | "enum";
  options?: string[] | undefined;
};

export type ScriptEditorPersonAttributeValue = {
  key: string;
  value: string | number | boolean;
};

export type ScriptEditorPersonSemanticBinding = {
  semanticKey: string;
  keyName: string;
  type: "number" | "string" | "boolean" | "enum";
  options?: string[] | undefined;
};
