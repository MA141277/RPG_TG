import type { HouseModuleRegistration } from "./house-module-registry";
import { grainShopHouseModule } from "../../application/house-modules/grain-shop/grain-shop-house-module";
import { homeHouseHouseModule } from "../../application/house-modules/home-house/home-house-house-module";
import { keepHouseHouseModule } from "../../application/house-modules/keep-house/keep-house-house-module";
import { leaderResidenceHouseModule } from "../../application/house-modules/leader-residence/leader-residence-house-module";
import { marketHouseHouseModule } from "../../application/house-modules/market-house/market-house-house-module";
import { medicineHouseHouseModule } from "../../application/house-modules/medicine-house/medicine-house-house-module";
import { tavernHouseModule } from "../../application/house-modules/tavern/tavern-house-module";
import { teaHouseHouseModule } from "../../application/house-modules/tea-house/tea-house-house-module";
import { templeHouseHouseModule } from "../../application/house-modules/temple-house/temple-house-house-module";
import { renderGrainShopHouseView } from "../../ui/views/house/grain-shop-house-view";
import { renderHomeHouseView } from "../../ui/views/house/home-house-view";
import { renderKeepHouseView } from "../../ui/views/house/keep-house-view";
import { renderLeaderResidenceHouseView } from "../../ui/views/house/leader-residence-house-view";
import { renderMarketHouseView } from "../../ui/views/house/market-house-view";
import { renderMedicineHouseHouseView } from "../../ui/views/house/medicine-house-house-view";
import { renderTavernHouseView } from "../../ui/views/house/tavern-house-view";
import { renderTeaHouseHouseView } from "../../ui/views/house/tea-house-house-view";
import { renderTempleHouseView } from "../../ui/views/house/temple-house-view";

export const builtinHouseModuleContributions: HouseModuleRegistration[] = [
  {
    moduleId: "home-house",
    module: homeHouseHouseModule,
    render: renderHomeHouseView,
  },
  {
    moduleId: "keep-house",
    module: keepHouseHouseModule,
    render: renderKeepHouseView,
  },
  {
    moduleId: "leader-residence",
    module: leaderResidenceHouseModule,
    render: renderLeaderResidenceHouseView,
  },
  {
    moduleId: "grain-shop",
    module: grainShopHouseModule,
    render: renderGrainShopHouseView,
  },
  {
    moduleId: "market-house",
    module: marketHouseHouseModule,
    render: renderMarketHouseView,
  },
  {
    moduleId: "medicine-house",
    module: medicineHouseHouseModule,
    render: renderMedicineHouseHouseView,
  },
  {
    moduleId: "temple-house",
    module: templeHouseHouseModule,
    render: renderTempleHouseView,
  },
  {
    moduleId: "tavern",
    module: tavernHouseModule,
    render: renderTavernHouseView,
  },
  {
    moduleId: "tea-house",
    module: teaHouseHouseModule,
    render: renderTeaHouseHouseView,
  },
];
