import type { TavernWorkOffer } from "../../domain/tavern";
import * as tavernContentJson from "../scenario-packs/zhuyuanzhang/house-content/tavern-content.json";

type TavernContent = {
  tavernBossProfile: {
    actorId: string;
    name: string;
    title: string;
    specialty: string;
  };
  tavernBossGreetingTextIds: string[];
  tavernBossOpenTextIds: string[];
  tavernDrinkPrice: number;
  tavernDefaultWager: number;
  tavernWagerStep: number;
  tavernWorkOffers: TavernWorkOffer[];
};

const tavernContent =
  ((tavernContentJson as { default?: TavernContent }).default ??
    tavernContentJson) as TavernContent;

export const tavernBossProfile = tavernContent.tavernBossProfile;
export const tavernBossGreetingTextIds = tavernContent.tavernBossGreetingTextIds;
export const tavernBossOpenTextIds = tavernContent.tavernBossOpenTextIds;
export const tavernDrinkPrice = tavernContent.tavernDrinkPrice;
export const tavernDefaultWager = tavernContent.tavernDefaultWager;
export const tavernWagerStep = tavernContent.tavernWagerStep;
export const tavernWorkOffers = tavernContent.tavernWorkOffers;
