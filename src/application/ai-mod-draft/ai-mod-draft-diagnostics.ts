export type AiModDraftDiagnosticSeverity = "error" | "warning";

export type AiModDraftDiagnostic = {
  severity: AiModDraftDiagnosticSeverity;
  path: string;
  message: string;
};

export function createAiModDraftError(
  path: string,
  message: string
): AiModDraftDiagnostic {
  return {
    severity: "error",
    path,
    message,
  };
}

export function createAiModDraftWarning(
  path: string,
  message: string
): AiModDraftDiagnostic {
  return {
    severity: "warning",
    path,
    message,
  };
}

