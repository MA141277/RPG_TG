const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderHouseActionContainer,
  renderHouseConfirmOverlay,
} = require("../.test-dist/ui/views/house/house-shared-view.js");

function createViewModel(overrides = {}) {
  return {
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    standbyRoster: [],
    dialogue: null,
    statusCard: null,
    overlay: null,
    leaveAction: {
      id: "leave-house",
      label: "Leave",
    },
    ...overrides,
  };
}

test("house action container appends optional action-row and button class hooks", () => {
  const html = renderHouseActionContainer(
    createViewModel({
      actionContainer: {
        title: "Tavern Work",
        className: "c-house-red-nine-slice-actions c-tavern-work-actions",
        buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
        actions: [
          { id: "open-work-submit", label: "Submit" },
          { id: "dismiss-dialogue", label: "Close" },
        ],
      },
    })
  );

  assert.match(
    html,
    /class="c-grain-shop-actions c-house-red-nine-slice-actions c-tavern-work-actions"/
  );
  assert.match(
    html,
    /class="c-button c-grain-shop-button c-grain-shop-button--paper c-house-red-nine-slice-button c-tavern-work-button"/
  );
});

test("house confirm overlay appends modal and button class hooks without dropping default sounds", () => {
  const html = renderHouseConfirmOverlay(
    {
      type: "confirm",
      title: "Submit Work",
      paragraphs: ["Confirm the submission."],
      confirmActionId: "confirm-submit-work",
      confirmLabel: "Confirm",
      confirmButtonSound: "heavy",
      cancelActionId: "cancel-submit-work",
      cancelLabel: "Later",
      cancelButtonSound: "light",
    },
    {
      overlayAttribute: ' data-house-overlay-variant="assessment-popup"',
      modalClassName:
        "c-assessment-popup c-house-tavern-work-popup c-house-tavern-work-confirm",
      actionsClassName: "c-house-red-nine-slice-actions",
      buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
    }
  );

  assert.match(html, /c-house-tavern-work-popup/);
  assert.match(html, /c-house-red-nine-slice-actions/);
  assert.match(
    html,
    /class="c-button c-grain-shop-button c-grain-shop-button--gold c-house-red-nine-slice-button c-tavern-work-button"[\s\S]*data-house-action="confirm-submit-work"/
  );
  assert.match(
    html,
    /data-house-action="cancel-submit-work"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="confirm-submit-work"[\s\S]*data-button-sound="heavy"/
  );
});
