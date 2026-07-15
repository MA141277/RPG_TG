import type { HouseModuleRegistration } from "../../../core/registry/house-module-registry";
import { renderGrainShopHouseView } from "./grain-shop-house-view";
import { renderHomeHouseView } from "./home-house-view";
import { renderKeepHouseView } from "./keep-house-view";
import { renderLeaderResidenceHouseView } from "./leader-residence-house-view";
import { renderMarketHouseView } from "./market-house-view";
import { renderMedicineHouseHouseView } from "./medicine-house-house-view";
import { renderTavernHouseView } from "./tavern-house-view";
import { renderTeaHouseHouseView } from "./tea-house-house-view";
import { renderTempleHouseView } from "./temple-house-view";

export const builtinHouseRendererRegistrations: HouseModuleRegistration[] = [
  {
    moduleId: "home-house",
    render: renderHomeHouseView,
  },
  {
    moduleId: "keep-house",
    render: renderKeepHouseView,
  },
  {
    moduleId: "leader-residence",
    render: renderLeaderResidenceHouseView,
  },
  {
    moduleId: "grain-shop",
    render: renderGrainShopHouseView,
  },
  {
    moduleId: "market-house",
    render: renderMarketHouseView,
  },
  {
    moduleId: "medicine-house",
    render: renderMedicineHouseHouseView,
  },
  {
    moduleId: "temple-house",
    render: renderTempleHouseView,
  },
  {
    moduleId: "tavern",
    render: renderTavernHouseView,
  },
  {
    moduleId: "tea-house",
    render: renderTeaHouseHouseView,
  },
];
