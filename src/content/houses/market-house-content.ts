import type { TradeGoodCategory } from "../../domain/trade-good";
import * as marketHouseContentJson from "../scenario-packs/zhuyuanzhang/house-content/market-house-content.json";

export type MarketHouseActorContent = {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
  isFixedHost: boolean;
};

type MarketHouseContent = {
  marketHouseFixedBoss: MarketHouseActorContent;
  marketHouseRandomNpcPool: MarketHouseActorContent[];
  marketHouseGreetingTextIds: string[];
  marketHouseBossOpenTextIds: string[];
  marketHouseGuestOpenTextIdsByActorId: Record<string, string[]>;
  marketHouseSmallTalkTextIds: string[];
  marketHouseRumorTextIdsByCategory: Partial<Record<TradeGoodCategory, string[]>>;
  marketHouseGeneralRumorTextIds: string[];
  marketHouseInvestigationSpecialtyTextIdByActorId: Record<string, string>;
};

const marketHouseContent =
  ((marketHouseContentJson as { default?: MarketHouseContent }).default ??
    marketHouseContentJson) as MarketHouseContent;

export const marketHouseFixedBoss = marketHouseContent.marketHouseFixedBoss;
export const marketHouseRandomNpcPool = marketHouseContent.marketHouseRandomNpcPool;
export const marketHouseGreetingTextIds = marketHouseContent.marketHouseGreetingTextIds;
export const marketHouseBossOpenTextIds = marketHouseContent.marketHouseBossOpenTextIds;
export const marketHouseGuestOpenTextIdsByActorId =
  marketHouseContent.marketHouseGuestOpenTextIdsByActorId;
export const marketHouseSmallTalkTextIds = marketHouseContent.marketHouseSmallTalkTextIds;
export const marketHouseRumorTextIdsByCategory =
  marketHouseContent.marketHouseRumorTextIdsByCategory;
export const marketHouseGeneralRumorTextIds =
  marketHouseContent.marketHouseGeneralRumorTextIds;
export const marketHouseInvestigationSpecialtyTextIdByActorId =
  marketHouseContent.marketHouseInvestigationSpecialtyTextIdByActorId;
