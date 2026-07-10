import { defaultRuntimeContent } from "../../content/default-runtime-content";

export function getTavernTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}
