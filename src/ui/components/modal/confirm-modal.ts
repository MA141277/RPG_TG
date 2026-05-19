export type ConfirmModalConfig = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  portraitLabel?: string;
};

export function renderConfirmModal(config: ConfirmModalConfig): string {
  return `
    <div class="c-modal-overlay">
      <div class="c-confirm-modal c-panel">
        <div class="c-confirm-modal__content">
          <p class="c-confirm-modal__eyebrow">确认</p>
          <h2 class="c-confirm-modal__title">${config.title}</h2>
          <p class="c-confirm-modal__body">${config.body}</p>
          ${
            config.portraitLabel == null
              ? ""
              : `
                <div class="c-city-portrait">
                  <span class="c-city-portrait__label">${config.portraitLabel}</span>
                </div>
              `
          }
        </div>
        <div class="c-confirm-modal__actions">
          <button class="c-button" data-modal-action="confirm">${config.confirmLabel}</button>
          <button class="c-button c-button--ghost" data-modal-action="cancel">${config.cancelLabel}</button>
        </div>
      </div>
    </div>
  `;
}
