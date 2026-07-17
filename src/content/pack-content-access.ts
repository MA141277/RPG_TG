import * as defaultZhuyuanzhangActivitiesModule from "./scenario-packs/zhuyuanzhang/activities.json";
import * as defaultZhuyuanzhangEventBindingsModule from "./scenario-packs/zhuyuanzhang/event-bindings.json";
import * as defaultZhuyuanzhangEventsModule from "./scenario-packs/zhuyuanzhang/events.json";
import * as defaultZhuyuanzhangScenesModule from "./scenario-packs/zhuyuanzhang/scenes.json";
import * as defaultZhuyuanzhangTextEntriesModule from "./scenario-packs/zhuyuanzhang/text-entries.json";
import * as homeHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/home-house-content.json";
import * as keepHouseContentModule from "./scenario-packs/zhuyuanzhang/house-content/keep-house-content.json";

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
export const defaultPackEventBindings = unwrapJsonModule<unknown[]>(
  defaultZhuyuanzhangEventBindingsModule
);
export const defaultPackSceneDefinitions = unwrapJsonModule<unknown[]>(
  defaultZhuyuanzhangScenesModule
);
export const defaultPackTextEntries = unwrapJsonModule<Record<string, string>>(
  defaultZhuyuanzhangTextEntriesModule
);

export const defaultHomeHouseContent = unwrapJsonModule<Record<string, unknown>>(
  homeHouseContentModule
);
export const defaultKeepHouseContent = unwrapJsonModule<Record<string, unknown>>(
  keepHouseContentModule
);
