const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applyBackpackItemAction,
  filterBackpackItems,
  projectBackpackItems,
  resolveSelectedBackpackItemId,
} = require("../.test-dist/application/inventory/item-inventory.js");
const {
  PLAYER_GRAIN_RUNTIME_KEYS,
} = require("../.test-dist/application/inventory/trade-inventory.js");

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
    equippedWeaponSet: {
      swordId: null,
      armorId: null,
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
        actionIds: ["equip.weapon"],
      },
      {
        id: "valuable.old-armor",
        name: "旧甲",
        icon: null,
        value: 12,
        types: ["equipment", "armor", "铠甲"],
        count: 1,
        actionIds: ["equip.armor"],
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
  const weaponResult = applyBackpackItemAction({
    valuableInventory: createValuableInventory(),
    itemId: "valuable.rusty-sword",
    actionId: "equip.weapon",
  });

  assert.equal(
    weaponResult.valuableInventory.equippedWeaponSet.swordId,
    "valuable.rusty-sword"
  );
  assert.equal(weaponResult.status, "applied");

  const armorResult = applyBackpackItemAction({
    valuableInventory: weaponResult.valuableInventory,
    itemId: "valuable.old-armor",
    actionId: "equip.armor",
  });

  assert.equal(
    armorResult.valuableInventory.equippedWeaponSet.armorId,
    "valuable.old-armor"
  );
  assert.equal(armorResult.status, "applied");
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
