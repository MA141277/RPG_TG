import type { TeaHouseTopicCard } from "../../domain/tea-house";

export const teaHouseBossProfile = {
  actorId: "char.kulan_tea_boss",
  name: "柳四",
  title: "茶馆老板",
  personality: "圆滑",
  specialty: "情报",
  favorability: 0,
  dialoguePool: [
    "最近城里不太安稳。",
    "如今这世道，银子不好挣。",
    "听说北边又在征兵。",
    "官府最近查得严。",
    "客官要听热闹，还是要听真话？",
  ],
  intelPool: [
    "濠州粮价上涨。",
    "最近有商队正在收马。",
    "城外来了不少流民。",
    "听说北边可能要打仗。",
    "最近官差搜查得很严。",
    "有江湖人士在暗中活动。",
  ],
} as const;

export const teaHouseTeaCost = 20;
export const teaHouseInitialSpirit = 10;
export const teaHouseTurnTimeLimitSec = 5;
export const teaHouseLowIntelChance = 0.25;
export const teaHouseDebateHandSize = 3;
export const teaHouseNpcThinkingTickMs = 200;
export const teaHouseNpcThinkingTicks = 4;
export const teaHouseNpcHintAccuracy = 0.7;
export const teaHouseProudRepeatChance = 0.7;
export const teaHousePredictionVisibleMs = 2000;

export const teaHouseTopicCounterMap: Record<TeaHouseTopicCard, TeaHouseTopicCard> = {
  利: "情",
  情: "名",
  名: "势",
  势: "义",
  义: "利",
};

export const teaHousePersonalityTopicWeights: Record<
  string,
  Record<TeaHouseTopicCard, number>
> = {
  精明: {
    利: 40,
    义: 15,
    名: 15,
    情: 15,
    势: 15,
  },
  傲气: {
    利: 15,
    义: 15,
    名: 40,
    情: 15,
    势: 15,
  },
  豪爽: {
    利: 15,
    义: 15,
    名: 15,
    情: 40,
    势: 15,
  },
  警惕: {
    利: 15,
    义: 15,
    名: 15,
    情: 15,
    势: 40,
  },
  圆滑: {
    利: 20,
    义: 20,
    名: 20,
    情: 20,
    势: 20,
  },
};
