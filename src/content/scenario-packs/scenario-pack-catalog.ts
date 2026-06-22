import type { ScenarioPackSummary } from "../../domain/scenario-pack";

export const builtInScenarioPacks: ScenarioPackSummary[] = [
  {
    id: "scenario-pack.liu_bang.pei_county_opening",
    title: "刘邦：沛县亭长开局",
    description: "从沛县县吏与乡里豪杰之间起步，先用 JSON 包驱动入口剧情。",
    url: new URL("./liu-bang-pei-county-opening.json", import.meta.url).href,
  },
];
