import type {
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorPersonRecord,
} from "../../domain/script-editor-project";
import type { AiModDraft } from "./ai-mod-draft-schema";

export function mapAiDraftPeople(draft: AiModDraft): ScriptEditorPersonRecord[] {
  const player = readRecord(draft.entities.player) ?? {
    id: "player",
    name: "Player",
    role: "Player",
  };
  const people = [player, ...draft.entities.people.map(readRecord).filter(isPresent)];
  const seen = new Set<string>();

  return people
    .filter((person) => {
      const personId = readString(person.id, "");
      if (personId.length === 0 || seen.has(personId)) {
        return false;
      }
      seen.add(personId);
      return true;
    })
    .map((person, index) => ({
      id: readString(person.id, index === 0 ? "player" : `person.generated.${index}`),
      name: readString(person.name, index === 0 ? "Player" : `NPC ${index}`),
      personType: index === 0 ? "\u89d2\u8272" : "NPC",
      role: readString(person.role, ""),
      ...(person.buildingId == null ? {} : { houseId: readString(person.buildingId, "") }),
      extendedAttributes: Object.entries(readRecord(person.initialStats) ?? {}).map(
        ([key, value]) => ({
          key: `stat.${key}`,
          label: key,
          value: String(value),
        })
      ),
      dialogueIds: [],
      eventIds: [],
      tradeBinding: {
        enabled: false,
        entryId: "",
      },
    }));
}

export function mapAiDraftCities(draft: AiModDraft): ScriptEditorCityRecord[] {
  const city = readRecord(draft.worldScale.city) ?? {
    id: "city.generated",
    name: "Generated City",
  };
  const cityId = readString(city.id, "city.generated");
  const cityName = readString(city.name, "Generated City");

  return [
    {
      id: cityId,
      name: cityName,
      houseIds: draft.worldScale.buildings
        .map(readRecord)
        .filter(isPresent)
        .map((building, index) =>
          readString(building.id, `building.generated.${index + 1}`)
        ),
      mountedBuildings: [],
      neighbourCityIds: [],
      profileMap: {
        displayName: cityName,
        description: draft.title,
        tags: ["ai-mod-draft"],
      },
      extendedAttributes: [],
      menuEntries: [],
    },
  ];
}

export function mapAiDraftBuildings(draft: AiModDraft): ScriptEditorBuildingRecord[] {
  const cityId = readString(readRecord(draft.worldScale.city)?.id, "city.generated");

  return draft.worldScale.buildings
    .map(readRecord)
    .filter(isPresent)
    .map((building, index) => {
      const buildingId = readString(building.id, `building.generated.${index + 1}`);
      const buildingName = readString(building.name, `Building ${index + 1}`);
      return {
        id: buildingId,
        cityId,
        name: buildingName,
        profileMap: {
          displayName: buildingName,
          description: readString(building.role, ""),
          tags: ["ai-mod-draft"],
        },
        extendedAttributes: [],
        menuEntries: [],
        entryBinding: {
          defaultPersonId: "",
          onEnterEventId: "",
          onLeaveEventId: "",
          returnTarget: "city",
        },
      };
    });
}

function readString(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? fallback : trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value != null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function isPresent<T>(value: T | null): value is T {
  return value != null;
}
