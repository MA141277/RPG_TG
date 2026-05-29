import redTurbanModelUrl from "../assets/yuanmo-units/red-turban-strat.json?url";
import redTurbanTextureUrl from "../assets/yuanmo-units/red-turban-strat.png?url";
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
    id: "red-turban-strat",
    role: "friendly",
    modelUrl: redTurbanModelUrl,
    textureUrl: redTurbanTextureUrl,
    idleAnimationUrl: stratNamedWithArmyIdleAnimationUrl,
    walkAnimationUrl: stratNamedWithArmyWalkAnimationUrl,
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
