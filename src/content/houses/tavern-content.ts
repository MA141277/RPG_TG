import type { TavernWorkOffer } from "../../domain/tavern";

export const tavernBossProfile = {
  actorId: "char.kulan_innkeeper",
  name: "宿场女将",
  title: "酒馆老板",
  specialty: "门路",
};

export const tavernDrinkPrice = 100;
export const tavernDefaultWager = 50;
export const tavernWagerStep = 50;

export const tavernWorkOffers: TavernWorkOffer[] = [
  {
    id: "offer.kulan.supply_run",
    title: "货队押运",
    description: "替城里商队盯一趟短程押运，回来后可拿酬劳。",
    rewardText: "报酬 80 文",
  },
  {
    id: "offer.kulan.notice_posting",
    title: "张贴告示",
    description: "帮衙门在城里贴完几张告示，算半日杂活。",
    rewardText: "报酬 60 文",
  },
  {
    id: "offer.kulan.errand_run",
    title: "跑腿采买",
    description: "替酒馆跑一趟采买，把短缺的酒食带回来。",
    rewardText: "报酬 70 文",
  },
];
