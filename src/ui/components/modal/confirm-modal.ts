type ConfirmModalButtonSound = "light" | "heavy";

export type ConfirmModalConfig = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmButtonSound?: ConfirmModalButtonSound;
  cancelButtonSound?: ConfirmModalButtonSound;
  eyebrow?: string;
  className?: string;
  portraitLabel?: string;
  portraitImageUrl?: string | null;
};

export function renderConfirmModal(config: ConfirmModalConfig): string {
  const confirmButtonSoundAttribute =
    config.confirmButtonSound == null
      ? ""
      : ` data-button-sound="${config.confirmButtonSound}"`;
  const cancelButtonSoundAttribute =
    config.cancelButtonSound == null
      ? ""
      : ` data-button-sound="${config.cancelButtonSound}"`;

  return `
    <div class="c-modal-overlay">
      <div class="c-confirm-modal c-panel${config.className == null ? "" : ` ${config.className}`}">
        <div class="c-confirm-modal__content">
          <p class="c-confirm-modal__eyebrow">${config.eyebrow ?? "确认"}</p>
          <h2 class="c-confirm-modal__title">${config.title}</h2>
          <p class="c-confirm-modal__body">${config.body}</p>
          ${
            config.portraitLabel == null
              ? ""
              : `
                <div class="c-city-portrait">
                  ${
                    config.portraitImageUrl == null
                      ? ""
                      : `<img class="c-city-portrait__image" src="${config.portraitImageUrl}" alt="${config.portraitLabel}">`
                  }
                  <span class="c-city-portrait__label">${config.portraitLabel}</span>
                </div>
              `
          }
        </div>
        <div class="c-confirm-modal__actions">
          <button class="c-button" data-modal-action="confirm"${confirmButtonSoundAttribute}>${config.confirmLabel}</button>
          ${
            config.cancelLabel == null
              ? ""
              : `<button class="c-button c-button--ghost" data-modal-action="cancel"${cancelButtonSoundAttribute}>${config.cancelLabel}</button>`
          }
        </div>
      </div>
    </div>
  `;
}
