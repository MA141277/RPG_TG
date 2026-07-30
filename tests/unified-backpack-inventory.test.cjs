const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applyBackpackItemAction,
  filterBackpackItems,
  projectBackpackItems,
  resolveSelectedBackpackItemId,
} = require("../.test-dist/application/inventory/item-inventory.js");
const {
  getVisibleValuables,
} = require("../.test-dist/application/inventory/inventory-selection.js");
const {
  TEMPLE_TOP_RANK_REWARD,
  getRuntimeItemQuantityKey,
} = require("../.test-dist/application/review/faction-review.js");
const {
  applyPlayerItemMutations,
  getPlayerItemQuantityVariableKey,
  readPlayerItemQuantity,
} = require("../.test-dist/application/inventory/player-item-inventory.js");
const {
  PLAYER_GRAIN_RUNTIME_KEYS,
} = require("../.test-dist/application/inventory/trade-inventory.js");
const {
  getMedicineInventoryQuantityVariableKey,
} = require("../.test-dist/domain/medicine-house.js");
const {
  getTradeInventoryQuantityVariableKey,
} = require("../.test-dist/domain/market-house.js");

function createValuableInventory() {
  return {
    items: [
      {
        id: "valuable.rusty-sword",
        name: "锈刀",
        category: "weapon",
        price: 8,
        ownedCount: 1,
        kindText: "刀剑",
        itemImageId: "icon-sword",
        description: "一把还能用的旧刀。",
      },
      {
        id: "valuable.old-armor",
        name: "旧甲",
        category: "armor",
        price: 12,
        ownedCount: 1,
        kindText: "铠甲",
        itemImageId: "",
        description: "缝补过的旧甲。",
      },
    ],
    selectedItemId: "valuable.rusty-sword",
    equippedSlots: {
      weapon: null,
      armor: null,
      accessory: null,
      mount: null,
    },
  };
}

function createGameStateWithGrain(grainDou) {
  return {
    runtime: {
      variables: {
        [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: grainDou,
      },
    },
  };
}

function createFourSlotValuableInventory() {
  return {
    items: [
      {
        id: "valuable.mount",
        name: "黄骠马",
        category: "mount",
        price: 20,
        ownedCount: 1,
        sortWeight: 1,
        kindText: "坐骑",
        itemImageId: "",
        description: "test mount",
      },
      {
        id: "valuable.accessory",
        name: "香囊",
        category: "accessory",
        price: 4,
        ownedCount: 1,
        sortWeight: 1,
        kindText: "饰品",
        itemImageId: "",
        description: "test accessory",
      },
      {
        id: "valuable.armor",
        name: "旧甲",
        category: "armor",
        price: 12,
        ownedCount: 1,
        sortWeight: 1,
        kindText: "防具",
        itemImageId: "",
        description: "test armor",
      },
      {
        id: "valuable.sword",
        name: "铁刀",
        category: "weapon",
        price: 8,
        ownedCount: 1,
        sortWeight: 2,
        kindText: "武器",
        itemImageId: "",
        description: "test weapon",
      },
    ],
    selectedItemId: "valuable.sword",
    equippedSlots: {
      weapon: "valuable.sword",
      armor: null,
      accessory: "valuable.accessory",
      mount: null,
    },
  };
}

test("projects legacy valuables and shared grain into unified backpack rows", () => {
  const items = projectBackpackItems({
    valuableInventory: createValuableInventory(),
    gameState: createGameStateWithGrain(23),
  });

  assert.deepEqual(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      value: item.value,
      types: item.types,
      count: item.count,
      actionIds: item.actions.map((action) => action.id),
    })),
    [
      {
        id: "valuable.rusty-sword",
        name: "锈刀",
        icon: "icon-sword",
        value: 8,
        types: ["equipment", "weapon", "刀剑"],
        count: 1,
        actionIds: ["equip.valuable", "unequip.valuable"],
      },
      {
        id: "valuable.old-armor",
        name: "旧甲",
        icon: null,
        value: 12,
        types: ["equipment", "armor", "铠甲"],
        count: 1,
        actionIds: ["equip.valuable", "unequip.valuable"],
      },
      {
        id: "item.grain",
        name: "粮食",
        icon: null,
        value: 0,
        types: ["food", "grain"],
        count: 23,
        actionIds: ["submit.quest"],
      },
    ]
  );
});

test("projects review runtime items into unified backpack rows", () => {
  const items = projectBackpackItems({
    valuableInventory: {
      items: [],
      selectedItemId: null,
      equippedSlots: { weapon: null, armor: null, accessory: null, mount: null },
    },
    gameState: {
      runtime: {
        variables: {
          [getRuntimeItemQuantityKey(TEMPLE_TOP_RANK_REWARD.itemId)]: 1,
        },
      },
    },
  });

  const rewardItem = items.find(
    (item) => item.id === "item.temple.scripture_copy"
  );

  assert.deepEqual(rewardItem?.types, ["other", "quest"]);
  assert.equal(rewardItem?.count, 1);
  assert.deepEqual(rewardItem?.actions, []);
});

test("backpack projection reads unified player items and exposes the required shop item fields", () => {
  const items = projectBackpackItems({
    valuableInventory: createValuableInventory(),
    gameState: {
      runtime: {
        variables: {
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 12,
          [getPlayerItemQuantityVariableKey("medicine_heal_001")]: 2,
          [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 1,
          [getPlayerItemQuantityVariableKey("silk")]: 1,
          [getTradeInventoryQuantityVariableKey("silk")]: 2,
          [getTradeInventoryQuantityVariableKey("rice")]: 7,
          "var.medicine_inventory.missing_legacy_id": 5,
          "var.trade_inventory.missing_legacy_id": 4,
        },
      },
    },
  });

  const medicineItem = items.find(
    (item) => item.id === "item.medicine.medicine_heal_001"
  );
  const tradeItem = items.find((item) => item.id === "item.trade.silk");

  assert.equal(items.filter((item) => item.id === "item.grain").length, 1);
  assert.equal(items.some((item) => item.id === "item.trade.rice"), false);
  assert.equal(
    items.some((item) => item.id === "item.medicine.missing_legacy_id"),
    false
  );
  assert.equal(
    items.some((item) => item.id === "item.trade.missing_legacy_id"),
    false
  );

  assert.deepEqual(medicineItem?.types, ["other", "prepared-medicine"]);
  assert.equal(medicineItem?.count, 3);
  assert.equal(medicineItem?.icon, null);
  assert.equal(typeof medicineItem?.name, "string");
  assert.equal(typeof medicineItem?.value, "number");
  assert.equal(typeof medicineItem?.description, "string");
  assert.deepEqual(medicineItem?.actions, []);

  assert.deepEqual(tradeItem?.types, ["other", "trade", "silk"]);
  assert.equal(tradeItem?.count, 3);
  assert.equal(tradeItem?.icon, null);
  assert.equal(typeof tradeItem?.name, "string");
  assert.equal(typeof tradeItem?.value, "number");
  assert.equal(typeof tradeItem?.description, "string");
  assert.deepEqual(tradeItem?.actions, []);
});

test("player item helper merges unified and legacy quantities by source", () => {
  const state = {
    runtime: {
      variables: {
        [getPlayerItemQuantityVariableKey("medicine_heal_001")]: 1,
        [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 2,
        [getTradeInventoryQuantityVariableKey("silk")]: 3,
      },
    },
  };

  assert.equal(
    readPlayerItemQuantity(state, "medicine_heal_001", ["medicine-house"]),
    3
  );
  assert.equal(readPlayerItemQuantity(state, "silk", ["market-house"]), 3);
  assert.equal(readPlayerItemQuantity(state, "silk"), 0);
});

test("player item helper writes unified quantities and clears touched legacy keys", () => {
  const state = {
    runtime: {
      variables: {
        [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 2,
        [getTradeInventoryQuantityVariableKey("silk")]: 4,
      },
    },
  };

  const nextState = applyPlayerItemMutations(state, [
    {
      itemId: "medicine_heal_001",
      delta: 1,
      legacySources: ["medicine-house"],
    },
    {
      itemId: "silk",
      delta: -1,
      legacySources: ["market-house"],
    },
  ]);

  assert.equal(
    nextState.runtime.variables[
      getPlayerItemQuantityVariableKey("medicine_heal_001")
    ],
    3
  );
  assert.equal(
    nextState.runtime.variables[
      getMedicineInventoryQuantityVariableKey("medicine_heal_001")
    ],
    0
  );
  assert.equal(
    nextState.runtime.variables[getPlayerItemQuantityVariableKey("silk")],
    3
  );
  assert.equal(
    nextState.runtime.variables[getTradeInventoryQuantityVariableKey("silk")],
    0
  );
});

test("player item helper clamps invalid runtime values to zero", () => {
  const state = {
    runtime: {
      variables: {
        [getPlayerItemQuantityVariableKey("broken")]: -4,
        [getTradeInventoryQuantityVariableKey("broken")]: "oops",
      },
    },
  };

  assert.equal(readPlayerItemQuantity(state, "broken", ["market-house"]), 0);
});

test("filters backpack rows by top-level category", () => {
  const items = [
    { id: "a", types: ["equipment", "weapon"] },
    { id: "b", types: ["food"] },
    { id: "c", types: ["quest"] },
  ];

  assert.deepEqual(filterBackpackItems(items, "all").map((item) => item.id), [
    "a",
    "b",
    "c",
  ]);
  assert.deepEqual(
    filterBackpackItems(items, "equipment").map((item) => item.id),
    ["a"]
  );
  assert.deepEqual(filterBackpackItems(items, "food").map((item) => item.id), [
    "b",
  ]);
  assert.deepEqual(filterBackpackItems(items, "other").map((item) => item.id), [
    "c",
  ]);
});

test("resolves selected backpack item to the current visible item or first fallback", () => {
  const items = [{ id: "first" }, { id: "second" }];

  assert.equal(resolveSelectedBackpackItemId(items, "second"), "second");
  assert.equal(resolveSelectedBackpackItemId(items, "missing"), "first");
  assert.equal(resolveSelectedBackpackItemId([], "missing"), null);
});

test("dispatches declared equipment item actions through safe handlers", () => {
  const inventory = createFourSlotValuableInventory();

  for (const [itemId, slotId] of [
    ["valuable.sword", "weapon"],
    ["valuable.armor", "armor"],
    ["valuable.accessory", "accessory"],
    ["valuable.mount", "mount"],
  ]) {
    const result = applyBackpackItemAction({
      valuableInventory: inventory,
      itemId,
      actionId: "equip.valuable",
    });

    assert.equal(result.valuableInventory.equippedSlots[slotId], itemId);
    assert.equal(result.status, "applied");
  }
});

test("dispatches declared equipment unequip actions without clearing other slots", () => {
  const inventory = createFourSlotValuableInventory();
  const result = applyBackpackItemAction({
    valuableInventory: inventory,
    itemId: "valuable.sword",
    actionId: "unequip.valuable",
  });

  assert.equal(result.status, "applied");
  assert.deepEqual(result.valuableInventory.equippedSlots, {
    weapon: null,
    armor: null,
    accessory: "valuable.accessory",
    mount: null,
  });
});

test("valuable equipment filtering includes accessory and mount items", () => {
  const visibleItems = getVisibleValuables(
    createFourSlotValuableInventory().items,
    "equipment"
  );

  assert.deepEqual(
    visibleItems.map((item) => item.category),
    ["mount", "accessory", "armor", "weapon"]
  );
});

test("projects equipment rows with slot metadata and equipped-first ordering", () => {
  const items = filterBackpackItems(
    projectBackpackItems({
      valuableInventory: createFourSlotValuableInventory(),
      gameState: createGameStateWithGrain(0),
    }),
    "equipment"
  );

  assert.deepEqual(
    items.map((item) => item.id),
    [
      "valuable.sword",
      "valuable.accessory",
      "valuable.armor",
      "valuable.mount",
    ]
  );

  assert.deepEqual(
    items.map((item) => ({
      id: item.id,
      actionIds: item.actions.map((action) => action.id),
      actionLabels: item.actions.map((action) => action.label),
      equipSlotId: item.equipSlotId,
      isEquipped: item.isEquipped,
      equippedLabel: item.equippedLabel,
      canEquip: item.canEquip,
    })),
    [
      {
        id: "valuable.sword",
        actionIds: ["equip.valuable", "unequip.valuable"],
        actionLabels: ["装备", "卸除"],
        equipSlotId: "weapon",
        isEquipped: true,
        equippedLabel: "已装备",
        canEquip: true,
      },
      {
        id: "valuable.accessory",
        actionIds: ["equip.valuable", "unequip.valuable"],
        actionLabels: ["装备", "卸除"],
        equipSlotId: "accessory",
        isEquipped: true,
        equippedLabel: "已装备",
        canEquip: true,
      },
      {
        id: "valuable.armor",
        actionIds: ["equip.valuable", "unequip.valuable"],
        actionLabels: ["装备", "卸除"],
        equipSlotId: "armor",
        isEquipped: false,
        equippedLabel: "",
        canEquip: true,
      },
      {
        id: "valuable.mount",
        actionIds: ["equip.valuable", "unequip.valuable"],
        actionLabels: ["装备", "卸除"],
        equipSlotId: "mount",
        isEquipped: false,
        equippedLabel: "",
        canEquip: true,
      },
    ]
  );
});

test("does not execute unsupported item actions", () => {
  const inventory = createValuableInventory();
  const result = applyBackpackItemAction({
    valuableInventory: inventory,
    itemId: "valuable.rusty-sword",
    actionId: "script.freeform",
  });

  assert.equal(result.status, "unsupported");
  assert.deepEqual(result.valuableInventory, inventory);
});
