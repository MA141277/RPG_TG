const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderConfirmModal,
} = require("../.test-dist/ui/components/modal/confirm-modal.js");

test("confirm modal renders configured button sound data attributes for confirm and cancel actions", () => {
  const markup = renderConfirmModal({
    title: "进入城市",
    body: "确认后展开城市结构。",
    confirmLabel: "进入城市",
    cancelLabel: "稍后",
    confirmButtonSound: "heavy",
    cancelButtonSound: "light",
  });

  assert.match(markup, /data-modal-action="confirm" data-button-sound="heavy"/);
  assert.match(markup, /data-modal-action="cancel" data-button-sound="light"/);
});

test("confirm modal omits button sound data attributes when no sound is configured", () => {
  const markup = renderConfirmModal({
    title: "前往城市",
    body: "确认移动。",
    confirmLabel: "前往",
    cancelLabel: "取消",
  });

  assert.doesNotMatch(markup, /data-button-sound=/);
});
