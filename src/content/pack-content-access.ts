import * as defaultZhuyuanzhangActivitiesModule from "./scenario-packs/zhuyuanzhang/activities.json";
import * as defaultZhuyuanzhangEventsModule from "./scenario-packs/zhuyuanzhang/events.json";
import * as defaultZhuyuanzhangScenesModule from "./scenario-packs/zhuyuanzhang/scenes.json";
import * as defaultZhuyuanzhangTextEntriesModule from "./scenario-packs/zhuyuanzhang/text-entries.json";
import * as grainShopContentModule from "./scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json";
import * as homeHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/home-house-content.json";
import * as keepHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/keep-house-content.json";
import * as marketHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/market-house-content.json";
import * as medicineHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/medicine-house-content.json";
import * as tavernContentModule from "./scenario-packs/zhuyuanzhang/house-content/tavern-content.json";
import * as teaHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/tea-house-content.json";

function unwrapJsonModule<T>(moduleValue: unknown): T {
  if (
    moduleValue != null &&
    typeof moduleValue === "object" &&
    "default" in moduleValue
  ) {
    return (moduleValue as { default: T }).default;
  }

  return moduleValue as T;
}

export const defaultPackActivities = unwrapJsonModule<unknown[]>(
  defaultZhuyuanzhangActivitiesModule
);
export const defaultPackEventDefinitions = unwrapJsonModule<unknown[]>(
  defaultZhuyuanzhangEventsModule
);
export const defaultPackSceneDefinitions = unwrapJsonModule<unknown[]>(
  defaultZhuyuanzhangScenesModule
);
export const defaultPackTextEntries = unwrapJsonModule<Record<string, string>>(
  defaultZhuyuanzhangTextEntriesModule
);

export const defaultGrainShopContent = unwrapJsonModule<Record<string, unknown>>(
  grainShopContentModule
);
export const defaultHomeHouseContent = unwrapJsonModule<Record<string, unknown>>(
  homeHouseContentModule
);
export const defaultKeepHouseContent = unwrapJsonModule<Record<string, unknown>>(
  keepHouseContentModule
);
export const defaultMarketHouseContent = unwrapJsonModule<Record<string, unknown>>(
  marketHouseContentModule
);
export const defaultMedicineHouseContent = unwrapJsonModule<Record<string, unknown>>(
  medicineHouseContentModule
);
export const defaultTavernContent = unwrapJsonModule<Record<string, unknown>>(
  tavernContentModule
);
export const defaultTeaHouseContent = unwrapJsonModule<Record<string, unknown>>(
  teaHouseContentModule
);
