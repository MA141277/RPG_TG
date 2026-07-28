import * as scenarioPackCatalogJsonModule from "./catalog.json";
import type { ScenarioPackSummary } from "../../domain/scenario-pack";
import {
  parseScenarioPackCatalog,
  SCENARIO_PACK_CATALOG_PUBLIC_URL,
  resolveScenarioPackSummaries,
} from "../../application/content/catalog-loader";

const scenarioPackCatalog = parseScenarioPackCatalog(
  (scenarioPackCatalogJsonModule as { default?: unknown }).default ??
    scenarioPackCatalogJsonModule
);

export const builtInScenarioPacks: ScenarioPackSummary[] =
  resolveScenarioPackSummaries(
    scenarioPackCatalog,
    SCENARIO_PACK_CATALOG_PUBLIC_URL
  );
