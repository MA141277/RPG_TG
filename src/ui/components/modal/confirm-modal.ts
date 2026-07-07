import {
  renderSharedDialog,
  type SharedDialogAction,
} from "../dialog/shared-dialog";

export type ConfirmModalConfig = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  eyebrow?: string;
  className?: string;
  portraitLabel?: string;
  portraitImageUrl?: string | null;
};

export function renderConfirmModal(config: ConfirmModalConfig): string {
  const actions: SharedDialogAction[] = [
    {
      id: "confirm",
      label: config.confirmLabel,
      result: "confirm",
      className: "c-button",
      attributes: {
        "data-modal-action": "confirm",
      },
    },
    ...(config.cancelLabel == null
      ? []
      : [
          {
            id: "cancel",
            label: config.cancelLabel,
            result: "cancel" as const,
            className: "c-button c-button--ghost",
            attributes: {
              "data-modal-action": "cancel",
            },
          },
        ]),
  ];

  return renderSharedDialog({
    layout: "modal",
    title: config.title,
    body: [config.body],
    bodyTag: "p",
    eyebrow: config.eyebrow ?? "确认",
    panelClassName: `c-confirm-modal c-panel${config.className == null ? "" : ` ${config.className}`}`,
    portrait:
      config.portraitLabel == null
        ? undefined
        : {
            label: config.portraitLabel,
            imageUrl: config.portraitImageUrl,
          },
    actions,
  });
}
