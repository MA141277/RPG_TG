import type { FlowDefinition } from "../../domain/activity";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";
import {
  loadScenarioPackCatalogFromUrl,
  SCENARIO_PACK_CATALOG_PUBLIC_URL,
} from "../../application/content/catalog-loader";
import { loadScenarioPackFromUrl } from "../../application/scenario/scenario-pack-loader";

export async function loadScenarioProfiles(
  catalogUrl: string = SCENARIO_PACK_CATALOG_PUBLIC_URL
): Promise<ScenarioProfileDefinition[]> {
  const catalogEntries = await loadScenarioPackCatalogFromUrl(catalogUrl);
  return Promise.all(
    catalogEntries.map(async (entry) => {
      const scenarioPack = await loadScenarioPackFromUrl(entry.manifestUrl);
      return scenarioPack.scenarioProfile;
    })
  );
}

export const scenarioFlows: FlowDefinition[] = [
  {
    id: "flow.zhu_yuanzhang.monk_opening",
    ownerScenarioId: "scenario.zhu_yuanzhang.monk_opening",
    slots: [
      {
        slotId: "opening",
        trigger: {
          timing: "game-start",
          houseId: "house.kulan.temple",
        },
        steps: [
          {
            type: "start-event",
            eventId: "event.story.zhu_yuanzhang.village_elder_letter",
          },
        ],
      },
      {
        slotId: "default-temple-chore",
        trigger: {
          timing: "manual",
          houseId: "house.kulan.temple",
        },
        steps: [
          {
            type: "start-activity",
            activityId: "activity.zhu_yuanzhang.temple.default_chore",
          },
        ],
      },
    ],
  },
];
