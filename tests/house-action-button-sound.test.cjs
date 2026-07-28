const test = require("node:test");
const assert = require("node:assert/strict");

test("house action container renders configured button sounds declaratively", () => {
  const {
    renderHouseActionContainer,
    renderHouseLeaveButton,
  } = require("../.test-dist/ui/views/house/house-shared-view.js");

  const viewModel = {
    moduleId: "temple-house",
    houseId: "house.temple",
    sceneTitle: "皇觉寺",
    standbyRoster: [],
    dialogue: null,
    actionContainer: {
      title: "寺庙事务",
      actions: [
        {
          id: "open-temple-work-menu",
          label: "工作",
          buttonSound: "light",
        },
      ],
    },
    statusCard: null,
    overlay: null,
    leaveAction: {
      id: "leave-house",
      label: "离开寺庙",
      buttonSound: "light",
    },
  };

  const actionHtml = renderHouseActionContainer(viewModel);
  const leaveHtml = renderHouseLeaveButton(viewModel);

  assert.match(
    actionHtml,
    /data-house-action="open-temple-work-menu"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    leaveHtml,
    /data-action="leave-house"[\s\S]*data-button-sound="light"/
  );
});

test("npc interaction menu renders configured option button sounds declaratively", () => {
  const {
    renderNpcInteractionMenu,
  } = require("../.test-dist/ui/components/npc-interaction/npc-interaction-menu.js");

  const html = renderNpcInteractionMenu({
    type: "npc-interaction-menu",
    context: { type: "house", houseId: "house.temple", moduleId: "temple-house" },
    targetCharacterId: "character.abbot",
    targetName: "方丈",
    options: [
      {
        id: "open-temple-work-menu",
        label: "工作",
        kind: "special",
        buttonSound: "light",
      },
    ],
  });

  assert.match(
    html,
    /data-house-action="open-temple-work-menu"[\s\S]*data-button-sound="light"/
  );
});
