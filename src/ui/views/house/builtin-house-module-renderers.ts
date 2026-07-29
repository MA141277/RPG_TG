import type { HouseModuleRegistration } from "../../../core/registry/house-module-registry";
import type { HouseModuleViewRenderer } from "../../../domain/house-module";
import { renderGrainShopHouseView } from "./grain-shop-house-view";
import { renderHomeHouseView } from "./home-house-view";
import {
  applyHouseOverlayButtonSoundMarkup,
  withHouseButtonSoundPolicies,
} from "./house-button-sound-policy";
import { renderKeepHouseView } from "./keep-house-view";
import { renderLeaderResidenceHouseView } from "./leader-residence-house-view";
import { renderMarketHouseView } from "./market-house-view";
import { renderMedicineHouseHouseView } from "./medicine-house-house-view";
import { renderTavernHouseView } from "./tavern-house-view";
import { renderTeaHouseHouseView } from "./tea-house-house-view";
import { renderTempleHouseView } from "./temple-house-view";

function withHouseButtonSoundPolicy(
  render: HouseModuleViewRenderer
): HouseModuleViewRenderer {
  return (viewModel) => {
    const nextViewModel = withHouseButtonSoundPolicies(viewModel);
    return applyHouseOverlayButtonSoundMarkup(
      render(nextViewModel),
      nextViewModel.overlay
    );
  };
}

export const builtinHouseRendererRegistrations: HouseModuleRegistration[] = [
  {
    moduleId: "home-house",
    render: withHouseButtonSoundPolicy(renderHomeHouseView),
  },
  {
    moduleId: "keep-house",
    render: withHouseButtonSoundPolicy(renderKeepHouseView),
  },
  {
    moduleId: "leader-residence",
    render: withHouseButtonSoundPolicy(renderLeaderResidenceHouseView),
  },
  {
    moduleId: "grain-shop",
    render: withHouseButtonSoundPolicy(renderGrainShopHouseView),
  },
  {
    moduleId: "market-house",
    render: withHouseButtonSoundPolicy(renderMarketHouseView),
  },
  {
    moduleId: "medicine-house",
    render: withHouseButtonSoundPolicy(renderMedicineHouseHouseView),
  },
  {
    moduleId: "temple-house",
    render: withHouseButtonSoundPolicy(renderTempleHouseView),
  },
  {
    moduleId: "tavern",
    render: withHouseButtonSoundPolicy(renderTavernHouseView),
  },
  {
    moduleId: "tea-house",
    render: withHouseButtonSoundPolicy(renderTeaHouseHouseView),
  },
];
