import { defaultRuntimeContent } from "../../content/default-runtime-content";

export function getMedicineHouseTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}
