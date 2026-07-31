const test = require("node:test");
const assert = require("node:assert/strict");

function createHouseViewModel(moduleId, overrides = {}) {
  return {
    moduleId,
    houseId: `house.${moduleId}`,
    sceneTitle: `House ${moduleId}`,
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: null,
    leaveAction: {
      id: "leave-house",
      label: "Leave",
    },
    ...overrides,
  };
}

function renderRegisteredHouseView(moduleId, overrides = {}) {
  const {
    builtinHouseRendererRegistrations,
  } = require("../.test-dist/ui/views/house/builtin-house-module-renderers.js");
  const render = builtinHouseRendererRegistrations.find(
    (registration) => registration.moduleId === moduleId
  )?.render;

  if (render == null) {
    throw new Error(`Missing house renderer for ${moduleId}`);
  }

  return render(createHouseViewModel(moduleId, overrides));
}

test("house npc special actions default missing button sounds to light without overriding explicit sounds", () => {
  const {
    selectHouseNpcSpecialActions,
  } = require("../.test-dist/application/npc-interaction/npc-interaction.js");

  const actions = selectHouseNpcSpecialActions({
    actors: [
      {
        characterId: "npc.host",
        name: "Host",
        interactionActions: [
          {
            id: "special.ask-tea",
            label: "Ask Tea",
            kind: "special",
          },
          {
            id: "special.start-duel",
            label: "Start Duel",
            kind: "special",
            buttonSound: "heavy",
          },
        ],
      },
    ],
    targetCharacterId: "npc.host",
  });

  assert.deepEqual(
    actions.map((action) => ({
      id: action.id,
      buttonSound: action.buttonSound ?? null,
    })),
    [
      { id: "special.ask-tea", buttonSound: "light" },
      { id: "special.start-duel", buttonSound: "heavy" },
    ]
  );
});

test("house module render defaults action container buttons and leave action to light without overriding explicit sounds", () => {
  const html = renderRegisteredHouseView("tea-house", {
    actionContainer: {
      title: "Tea House",
      actions: [
        {
          id: "serve-tea",
          label: "Serve Tea",
        },
        {
          id: "start-debate",
          label: "Start Debate",
          buttonSound: "heavy",
        },
        {
          id: "inquire",
          label: "Inquire",
        },
        {
          id: "dismiss-dialogue",
          label: "Leave",
        },
      ],
    },
    leaveAction: {
      id: "leave-house",
      label: "Leave House",
    },
  });

  assert.match(
    html,
    /data-house-action="serve-tea"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="start-debate"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-house-action="inquire"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="dismiss-dialogue"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-action="leave-house"[\s\S]*data-button-sound="light"/
  );
});

test("house module render defaults confirm overlays to light cancel and heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("grain-shop", {
      overlay: {
      type: "confirm",
      title: "Start Work",
      paragraphs: ["Confirm the action."],
      confirmActionId: "confirm-start-work",
      confirmLabel: "Start Work",
      cancelActionId: "cancel-start-work",
      cancelLabel: "Come Back Later",
      },
    });

  assert.match(
    html,
    /data-house-action="cancel-start-work"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="confirm-start-work"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults single-button alert overlays to light confirm sounds", () => {
  const html = renderRegisteredHouseView("market-house", {
    overlay: {
      type: "alert",
      title: "Intel",
      paragraphs: ["Information only."],
      confirmActionId: "close-alert",
      confirmLabel: "Got It",
    },
  });

  assert.match(
    html,
    /data-house-action="close-alert"[\s\S]*data-button-sound="light"/
  );
});

test("house module render defaults single-button result overlays to light confirm sounds", () => {
  const html = renderRegisteredHouseView("tavern", {
    overlay: {
      type: "result",
      title: "Outcome",
      grade: "A",
      score: 88,
      rewardLines: ["Reward line."],
      confirmActionId: "close-tavern-result",
      confirmLabel: "Collect",
    },
  });

  assert.match(
    html,
    /data-house-action="close-tavern-result"[\s\S]*data-button-sound="light"/
  );
});

test("house module render forces two-button confirm overlays to keep non-exit actions heavy", () => {
  const html = renderRegisteredHouseView("temple-house", {
    overlay: {
      type: "confirm",
      title: "Donate",
      paragraphs: ["Temple donation."],
      confirmActionId: "confirm-donate",
      confirmLabel: "Donate",
      cancelActionId: "close-temple-overlay",
      cancelLabel: "Later",
      confirmButtonSound: "light",
      cancelButtonSound: "light",
    },
  });

  assert.match(
    html,
    /data-house-action="close-temple-overlay"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="confirm-donate"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render forces quantity-confirm overlays to keep non-exit actions heavy", () => {
  const html = renderRegisteredHouseView("temple-house", {
    overlay: {
      type: "quantity-confirm",
      title: "Submit Food",
      paragraphs: ["Submit grain."],
      quantityLabel: "Amount",
      quantity: 2,
      maxQuantity: 9,
      quantityFieldId: "submit-qty",
      decrementActionId: "qty-minus",
      incrementActionId: "qty-plus",
      confirmActionId: "qty-confirm",
      confirmLabel: "Submit",
      cancelActionId: "qty-cancel",
      cancelLabel: "Later",
      confirmButtonSound: "light",
      cancelButtonSound: "light",
      decrementButtonSound: "light",
      incrementButtonSound: "light",
    },
  });

  assert.match(
    html,
    /data-house-action="qty-minus"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="qty-plus"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="qty-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="qty-confirm"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render forces rest overlays to keep non-exit actions heavy", () => {
  const html = renderRegisteredHouseView("temple-house", {
    overlay: {
      type: "rest-days",
      title: "Rest",
      paragraphs: ["Rest for a few days."],
      dayCount: "2",
      quantityFieldId: "rest-days",
      confirmActionId: "rest-confirm",
      confirmLabel: "Start Rest",
      cancelActionId: "rest-cancel",
      cancelLabel: "Back",
      confirmButtonSound: "light",
      cancelButtonSound: "light",
    },
  });

  assert.match(
    html,
    /data-house-action="rest-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="rest-confirm"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults grain trade overlays to light adjust and cancel sounds plus heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("grain-shop", {
      overlay: {
      type: "trade",
      title: "Grain Trade",
      mode: "buy",
      grainPrice: 12,
      quantity: 3,
      tradeTotal: 36,
      quantityFieldId: "trade-quantity",
      decrementActionId: "trade-decrement",
      incrementActionId: "trade-increment",
      confirmActionId: "trade-confirm",
      confirmLabel: "Buy Grain",
      cancelActionId: "trade-cancel",
      cancelLabel: "Come Back Later",
      },
    });

  assert.match(
    html,
    /data-house-action="trade-decrement"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="trade-increment"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="trade-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="trade-confirm"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults market trade overlays to light adjust and cancel sounds plus heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("market-house", {
      overlay: {
      type: "market-trade",
      title: "Market Trade",
      mode: "buy",
      quantity: 2,
      quantityFieldId: "market-quantity",
      decrementActionId: "market-decrement",
      incrementActionId: "market-increment",
      confirmActionId: "market-confirm",
      confirmLabel: "Buy Goods",
      cancelActionId: "market-cancel",
      cancelLabel: "Come Back Later",
      rows: [
        {
          goodsId: "goods.tea",
          name: "Tea",
          categoryLabel: "Drink",
          currentPrice: 21,
          referencePrice: 18,
          unit: "box",
          quantityLabel: "Per Box",
          priceTone: "neutral",
          isSelected: true,
        },
      ],
      selectedSummary: {
        goodsId: "goods.tea",
        name: "Tea",
        categoryLabel: "Drink",
        currentPrice: 21,
        referencePrice: 18,
        unit: "box",
        availableQuantity: 9,
        quantityLabel: "Per Box",
        tradeTotal: 42,
        priceTone: "neutral",
      },
      helperLines: ["Selected goods summary."],
      },
    });

  assert.match(
    html,
    /data-house-action="market-decrement"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="market-increment"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="market-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="market-confirm"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults settlement trade overlays to light adjust and cancel sounds plus heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("market-house", {
      overlay: {
      type: "settlement-trade",
      title: "City Specialty Trade",
      mode: "buy",
      quantity: 2,
      quantityFieldId: "settlement-trade-quantity",
      decrementActionId: "settlement-trade-qty-minus",
      incrementActionId: "settlement-trade-qty-plus",
      confirmActionId: "confirm-settlement-trade",
      confirmLabel: "Buy Goods",
      cancelActionId: "close-settlement-trade",
      cancelLabel: "Come Back Later",
      rows: [
        {
          goodsId: "silk_textiles",
          name: "Silk Textiles",
          categoryLabel: "Textiles",
          unit: "bolt",
          tierLabel: "Abundant",
          buyPrice: 120,
          sellPrice: 100,
          basePrice: 100,
          priceMultiplier: 1,
          stockQuantity: 6,
          ownedQuantity: 0,
          daysUntilReset: 30,
          priceTone: "neutral",
          isSelected: true,
        },
      ],
      selectedSummary: {
        goodsId: "silk_textiles",
        name: "Silk Textiles",
        unit: "bolt",
        tierLabel: "Abundant",
        buyPrice: 120,
        sellPrice: 100,
        stockQuantity: 6,
        ownedQuantity: 0,
        tradeTotal: 240,
        daysUntilReset: 30,
        nextStepHint: "Ship it north.",
        supplyHint: "Local craft guilds keep this stocked.",
      },
      helperLines: ["Trade pressure moves by 0.01 per 10 units."],
      },
    });

  assert.match(
    html,
    /data-house-action="settlement-trade-qty-minus"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="settlement-trade-qty-plus"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="close-settlement-trade"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="confirm-settlement-trade"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults medicine buy overlays to light cancel and heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("medicine-house", {
      overlay: {
      type: "medicine-buy",
      title: "Buy Medicine",
      items: [
        {
          id: "item.ginseng",
          name: "Ginseng",
          price: 35,
          typeLabel: "Herb",
          actionId: "select-ginseng",
          isSelected: true,
        },
      ],
      confirmActionId: "medicine-buy-confirm",
      confirmLabel: "Buy Medicine",
      cancelActionId: "medicine-buy-cancel",
      cancelLabel: "Come Back Later",
      },
    });

  assert.match(
    html,
    /data-house-action="medicine-buy-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="medicine-buy-confirm"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults gamble overlays to light adjust and cancel sounds plus heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("tavern", {
      overlay: {
      type: "gamble",
      title: "Start Gamble",
      wager: 20,
      options: [10, 20, 30],
      decrementActionId: "gamble-decrement",
      incrementActionId: "gamble-increment",
      confirmActionId: "gamble-confirm",
      confirmLabel: "Start Gamble",
      cancelActionId: "gamble-cancel",
      cancelLabel: "Come Back Later",
      },
    });

  assert.match(
    html,
    /data-house-action="gamble-decrement"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="gamble-increment"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="gamble-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="gamble-confirm"[\s\S]*data-button-sound="heavy"/
  );
});

test("house module render defaults rest overlays to light cancel and heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("home-house", {
      overlay: {
      type: "rest-days",
      title: "Rest",
      paragraphs: ["Take a break."],
      dayCount: "3",
      quantityFieldId: "rest-days",
      confirmActionId: "rest-confirm",
      confirmLabel: "Start Rest",
      cancelActionId: "rest-cancel",
      cancelLabel: "Come Back Later",
      },
    });

  assert.match(
    html,
    /data-house-action="rest-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="rest-confirm"[\s\S]*data-button-sound="heavy"/
  );
});
