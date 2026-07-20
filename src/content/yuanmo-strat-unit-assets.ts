import zhuYuanzhangMonkModelUrl from "../assets/yuanmo-units/zhu-yuanzhang-monk-strat.json?url";
import zhuYuanzhangMonkTextureUrl from "../assets/yuanmo-units/zhu-yuanzhang-monk-strat.jpg?url";
import zhuYuanzhangMonkLookAroundAnimationUrl from "../assets/yuanmo-unit-animations/zhu-yuanzhang-monk-strat/look_around.json?url";
import zhuYuanzhangMonkRunAnimationUrl from "../assets/yuanmo-unit-animations/zhu-yuanzhang-monk-strat/run.json?url";
import yuanInfantryModelUrl from "../assets/yuanmo-units/yuan-infantry-strat.json?url";
import yuanInfantryTextureUrl from "../assets/yuanmo-units/yuan-infantry-strat.png?url";
import stratNamedWithArmyIdleAnimationUrl from "../assets/yuanmo-unit-animations/strat_named_with_army/stand_a_idle.json?url";
import stratNamedWithArmyWalkAnimationUrl from "../assets/yuanmo-unit-animations/strat_named_with_army/walk.json?url";

export type CampaignUnitAssetDefinition = {
  id: string;
  role: "friendly" | "enemy";
  modelUrl: string;
  textureUrl: string;
  idleAnimationUrl: string;
  walkAnimationUrl: string;
};

export const campaignUnitAssets = {
  friendly: {
    id: "zhu-yuanzhang-monk-strat",
    role: "friendly",
    modelUrl: zhuYuanzhangMonkModelUrl,
    textureUrl: zhuYuanzhangMonkTextureUrl,
    idleAnimationUrl: zhuYuanzhangMonkLookAroundAnimationUrl,
    walkAnimationUrl: zhuYuanzhangMonkRunAnimationUrl,
  },
  enemy: {
    id: "yuan-infantry-strat",
    role: "enemy",
    modelUrl: yuanInfantryModelUrl,
    textureUrl: yuanInfantryTextureUrl,
    idleAnimationUrl: stratNamedWithArmyIdleAnimationUrl,
    walkAnimationUrl: stratNamedWithArmyWalkAnimationUrl,
  },
} satisfies Record<"friendly" | "enemy", CampaignUnitAssetDefinition>;
