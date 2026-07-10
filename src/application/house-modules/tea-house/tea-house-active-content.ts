import { defaultRuntimeContent } from "../../content/default-runtime-content";

export function getTeaHouseCityNpcPools() {
  return defaultRuntimeContent.cityNpcPools;
}

export function getTeaHouseTextEntries(input: {
  textEntriesById?: Record<string, string> | undefined;
}): Record<string, string> {
  return input.textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}
