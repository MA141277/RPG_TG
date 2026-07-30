const test = require("node:test");
const assert = require("node:assert/strict");

const {
  EquipmentSlotRegistry,
  defaultEquipmentSlotRegistry,
} = require("../.test-dist/domain/equipment/equipment-slot-registry.js");
const {
  EquipmentLoadoutService,
  createDefaultEquipmentLoadout,
  defaultEquipmentLoadoutService,
  normalizeEquipmentLoadout,
} = require("../.test-dist/domain/equipment/equipment-loadout-service.js");

test("default equipment loadout contains all four slots", () => {
  assert.deepEqual(createDefaultEquipmentLoadout(), {
    weapon: null,
    armor: null,
    accessory: null,
    mount: null,
  });
});

test("registry resolves slot labels and categories", () => {
  const registry = new EquipmentSlotRegistry([
    { slotId: "weapon", label: "武器", acceptedCategories: ["weapon"], sortOrder: 0 },
    { slotId: "armor", label: "防具", acceptedCategories: ["armor"], sortOrder: 1 },
    { slotId: "accessory", label: "饰品", acceptedCategories: ["accessory"], sortOrder: 2 },
    { slotId: "mount", label: "坐骑", acceptedCategories: ["mount"], sortOrder: 3 },
  ]);

  assert.equal(registry.getSlotForCategory("accessory")?.slotId, "accessory");
  assert.equal(registry.get("mount").label, "坐骑");
  assert.equal(registry.acceptsCategory("armor", "weapon"), false);
  assert.deepEqual(
    registry.getAll().map((slot) => slot.label),
    ["武器", "防具", "饰品", "坐骑"]
  );
});

test("default registry exposes all four shared equipment slots in sort order", () => {
  assert.deepEqual(
    defaultEquipmentSlotRegistry.getAll().map((slot) => ({
      slotId: slot.slotId,
      label: slot.label,
      acceptedCategories: slot.acceptedCategories,
    })),
    [
      { slotId: "weapon", label: "武器", acceptedCategories: ["weapon"] },
      { slotId: "armor", label: "防具", acceptedCategories: ["armor"] },
      { slotId: "accessory", label: "饰品", acceptedCategories: ["accessory"] },
      { slotId: "mount", label: "坐骑", acceptedCategories: ["mount"] },
    ]
  );
});

test("normalizes partial loadouts without dropping known equipped slots", () => {
  assert.deepEqual(
    normalizeEquipmentLoadout({
      weapon: "valuable.rusty-sword",
      mount: "valuable.old-horse",
    }),
    {
      weapon: "valuable.rusty-sword",
      armor: null,
      accessory: null,
      mount: "valuable.old-horse",
    }
  );
});

test("loadout service equips accessory and mount items while preserving other slots", () => {
  const service = new EquipmentLoadoutService(
    new EquipmentSlotRegistry([
      { slotId: "weapon", label: "武器", acceptedCategories: ["weapon"], sortOrder: 0 },
      { slotId: "armor", label: "防具", acceptedCategories: ["armor"], sortOrder: 1 },
      { slotId: "accessory", label: "饰品", acceptedCategories: ["accessory"], sortOrder: 2 },
      { slotId: "mount", label: "坐骑", acceptedCategories: ["mount"], sortOrder: 3 },
    ])
  );

  const initialLoadout = {
    weapon: "valuable.rusty-sword",
    armor: "valuable.old-armor",
    accessory: null,
    mount: null,
  };

  const withAccessory = service.equip(initialLoadout, {
    id: "valuable.lucky-charm",
    category: "accessory",
  });
  const withMount = service.equip(withAccessory, {
    id: "valuable.old-horse",
    category: "mount",
  });

  assert.deepEqual(withMount, {
    weapon: "valuable.rusty-sword",
    armor: "valuable.old-armor",
    accessory: "valuable.lucky-charm",
    mount: "valuable.old-horse",
  });
});

test("default loadout service exposes callable inventory slot operations", () => {
  const inventory = {
    items: [
      {
        id: "valuable.rusty-sword",
        name: "旧刀",
        category: "weapon",
        price: 10,
        ownedCount: 1,
        kindText: "武器",
        itemImageId: "",
        description: "旧刀。",
      },
      {
        id: "valuable.lucky-charm",
        name: "护符",
        category: "accessory",
        price: 15,
        ownedCount: 1,
        kindText: "饰品",
        itemImageId: "",
        description: "护符。",
      },
    ],
    selectedItemId: null,
    equippedSlots: defaultEquipmentLoadoutService.createDefaultLoadout(),
  };

  const equippedWeapon = defaultEquipmentLoadoutService.equipItem(
    inventory,
    inventory.items[0]
  );
  const equippedAccessory = defaultEquipmentLoadoutService.equipItem(
    equippedWeapon,
    inventory.items[1]
  );

  assert.equal(
    defaultEquipmentLoadoutService.getEquippedItemId(equippedAccessory, "weapon"),
    "valuable.rusty-sword"
  );
  assert.equal(
    defaultEquipmentLoadoutService.getEquippedItemId(equippedAccessory, "accessory"),
    "valuable.lucky-charm"
  );
  assert.equal(
    defaultEquipmentLoadoutService.isItemEquipped(
      equippedAccessory,
      "valuable.lucky-charm"
    ),
    true
  );

  const unequippedAccessory = defaultEquipmentLoadoutService.unequipSlot(
    equippedAccessory,
    "accessory"
  );

  assert.deepEqual(unequippedAccessory.equippedSlots, {
    weapon: "valuable.rusty-sword",
    armor: null,
    accessory: null,
    mount: null,
  });
  assert.equal(
    defaultEquipmentLoadoutService.isItemEquipped(
      unequippedAccessory,
      "valuable.lucky-charm"
    ),
    false
  );
});
