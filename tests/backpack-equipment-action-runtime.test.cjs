const test = require("node:test");
const assert = require("node:assert/strict");

function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch {
    return null;
  }
}

const runtimeModule = safeRequire(
  "../.test-dist/application/inventory/backpack-equipment-action-runtime.js"
);

function createValuableInventory() {
  return {
    items: [
      {
        id: "valuable.sword",
        name: "铁刀",
        category: "weapon",
        price: 8,
        ownedCount: 1,
        kindText: "武器",
        itemImageId: "",
        description: "test weapon",
      },
      {
        id: "valuable.armor",
        name: "旧甲",
        category: "armor",
        price: 12,
        ownedCount: 1,
        kindText: "防具",
        itemImageId: "",
        description: "test armor",
      },
      {
        id: "valuable.accessory",
        name: "香囊",
        category: "accessory",
        price: 4,
        ownedCount: 1,
        kindText: "饰品",
        itemImageId: "",
        description: "test accessory",
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

test("backpack equipment action runtime projects complementary equip and unequip actions", () => {
  const runtime = runtimeModule?.defaultBackpackEquipmentActionRuntime;
  assert.ok(
    runtime,
    "backpack equipment action runtime must be exported for later player equipment flows"
  );

  const inventory = createValuableInventory();
  const equippedProjection = runtime.projectItem(inventory.items[0], inventory);
  const unequippedProjection = runtime.projectItem(inventory.items[1], inventory);

  assert.deepEqual(equippedProjection, {
    equipSlotId: "weapon",
    isEquipped: true,
    equippedLabel: "已装备",
    canEquip: true,
    actions: [
      { id: "equip.valuable", label: "装备", disabled: true },
      { id: "unequip.valuable", label: "卸除", disabled: false },
    ],
  });
  assert.deepEqual(unequippedProjection, {
    equipSlotId: "armor",
    isEquipped: false,
    equippedLabel: "",
    canEquip: true,
    actions: [
      { id: "equip.valuable", label: "装备", disabled: false },
      { id: "unequip.valuable", label: "卸除", disabled: true },
    ],
  });
});

test("backpack equipment action runtime unequips only the selected slot", () => {
  const runtime = runtimeModule?.defaultBackpackEquipmentActionRuntime;
  assert.ok(
    runtime,
    "backpack equipment action runtime must be exported for later player equipment flows"
  );

  const inventory = createValuableInventory();
  const result = runtime.applyAction({
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
  assert.equal(result.valuableInventory.selectedItemId, "valuable.sword");
});
