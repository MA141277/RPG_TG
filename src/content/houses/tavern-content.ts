import type { TavernWorkOffer } from "../../domain/tavern";
import { defaultTavernContent } from "../pack-content-access";

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

const tavernContent = defaultTavernContent as TavernContent;

export const tavernBossProfile = tavernContent.tavernBossProfile;
export const tavernBossGreetingTextIds = tavernContent.tavernBossGreetingTextIds;
export const tavernBossOpenTextIds = tavernContent.tavernBossOpenTextIds;
export const tavernDrinkPrice = tavernContent.tavernDrinkPrice;
export const tavernDefaultWager = tavernContent.tavernDefaultWager;
export const tavernWagerStep = tavernContent.tavernWagerStep;
export const tavernWorkOffers = tavernContent.tavernWorkOffers;
