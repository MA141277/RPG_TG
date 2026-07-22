import { defaultRuntimeContent } from "./default-runtime-content";

// These exports are live mutable views into defaultRuntimeContent.
// Do not derive module-top-level cached snapshots from them.
export const defaultPackActivities = defaultRuntimeContent.activityDefinitions;
export const defaultPackTextEntries = defaultRuntimeContent.textEntriesById;
