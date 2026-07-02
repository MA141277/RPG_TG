import type { HouseModuleRegistration } from "../../core/registry/house-module-registry";
import { grainShopHouseModule } from "./grain-shop/grain-shop-house-module";
import { homeHouseHouseModule } from "./home-house/home-house-house-module";
import { keepHouseHouseModule } from "./keep-house/keep-house-house-module";
import { leaderResidenceHouseModule } from "./leader-residence/leader-residence-house-module";
import { marketHouseHouseModule } from "./market-house/market-house-house-module";
import { medicineHouseHouseModule } from "./medicine-house/medicine-house-house-module";
import { tavernHouseModule } from "./tavern/tavern-house-module";
import { teaHouseHouseModule } from "./tea-house/tea-house-house-module";
import { templeHouseHouseModule } from "./temple-house/temple-house-house-module";

export const builtinHouseModuleRegistrations: HouseModuleRegistration[] = [
  {
    moduleId: "home-house",
    module: homeHouseHouseModule,
  },
  {
    moduleId: "keep-house",
    module: keepHouseHouseModule,
  },
  {
    moduleId: "leader-residence",
    module: leaderResidenceHouseModule,
  },
  {
    moduleId: "grain-shop",
    module: grainShopHouseModule,
  },
  {
    moduleId: "market-house",
    module: marketHouseHouseModule,
  },
  {
    moduleId: "medicine-house",
    module: medicineHouseHouseModule,
  },
  {
    moduleId: "temple-house",
    module: templeHouseHouseModule,
  },
  {
    moduleId: "tavern",
    module: tavernHouseModule,
  },
  {
    moduleId: "tea-house",
    module: teaHouseHouseModule,
  },
];
