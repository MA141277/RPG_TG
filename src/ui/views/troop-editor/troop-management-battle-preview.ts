type BattlePreviewWindow = Window & {
  TroopManagementPreview?: {
    showPreview?: (config: unknown) => void;
  };
};

function parsePreviewConfig(encodedValue: string): unknown | null {
  if (encodedValue.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(encodedValue));
  } catch (_error) {
    return null;
  }
}

function pushPreviewConfig(frame: HTMLIFrameElement): void {
  const encodedConfig = frame.dataset.previewConfig ?? "";
  const previewConfig = parsePreviewConfig(encodedConfig);
  if (previewConfig == null) {
    return;
  }

  const previewWindow = frame.contentWindow as BattlePreviewWindow | null;
  previewWindow?.TroopManagementPreview?.showPreview?.(previewConfig);
}

function bindPreviewFrame(frame: HTMLIFrameElement): void {
  if (frame.dataset.previewBound === "true") {
    pushPreviewConfig(frame);
    return;
  }

  frame.dataset.previewBound = "true";
  frame.addEventListener("load", () => {
    pushPreviewConfig(frame);
  });
  pushPreviewConfig(frame);
}

export function syncTroopManagementBattlePreview(root: ParentNode): void {
  const previewFrames = root.querySelectorAll<HTMLIFrameElement>(
    "[data-troop-management-battle-preview]"
  );

  for (const frame of previewFrames) {
    bindPreviewFrame(frame);
  }
}
