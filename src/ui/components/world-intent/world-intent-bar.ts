function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type WorldIntentBarViewModel = {
  surface: "city" | "house";
  draftText: string;
  status: "idle" | "classifying" | "awaiting-follow-up" | "error";
  placeholder: string;
  disabled: boolean;
  statusText?: string | null;
};

function resolveStatusText(input: WorldIntentBarViewModel): string {
  if (input.statusText != null && input.statusText.trim().length > 0) {
    return input.statusText;
  }

  if (input.status === "classifying") {
    return "正在分辨你想做的事……";
  }

  if (input.status === "awaiting-follow-up") {
    return "意图已识别，等待后续执行。";
  }

  if (input.status === "error") {
    return "这次没有理解清楚，你可以直接重试。";
  }

  return "输入一句话，也可以继续点现有按钮。";
}

export function renderWorldIntentBar(input: WorldIntentBarViewModel): string {
  const statusText = resolveStatusText(input);

  return `
    <div class="c-world-intent-bar" data-world-intent-bar="${input.surface}">
      <label class="c-world-intent-bar__field">
        <span class="c-world-intent-bar__label">AI意图</span>
        <input
          class="c-world-intent-bar__input"
          type="text"
          value="${escapeHtml(input.draftText)}"
          placeholder="${escapeHtml(input.placeholder)}"
          data-world-intent-input
          ${input.disabled ? "disabled" : ""}
        >
      </label>
      <div class="c-world-intent-bar__actions">
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper c-world-intent-bar__button"
          data-world-intent-action="submit"
          ${input.disabled ? "disabled" : ""}
        >
          发送
        </button>
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper c-world-intent-bar__button"
          data-world-intent-action="clear"
          ${input.disabled ? "disabled" : ""}
        >
          清空
        </button>
      </div>
      <p class="c-world-intent-bar__status" data-world-intent-status>
        ${escapeHtml(statusText)}
      </p>
    </div>
  `;
}
