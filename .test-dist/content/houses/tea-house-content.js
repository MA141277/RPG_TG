"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teaHousePersonalityTopicWeights = exports.teaHouseTopicCounterMap = exports.teaHouseLowIntelChance = exports.teaHouseTurnTimeLimitSec = exports.teaHouseInitialSpirit = exports.teaHouseTeaCost = exports.teaHouseBossProfile = void 0;
exports.teaHouseBossProfile = {
    actorId: "char.kulan_tea_boss",
    name: "柳四",
    title: "茶馆老板",
    personality: "圆滑",
    specialty: "情报",
    favorability: 0,
    dialoguePool: [
        "客官要听热闹，还是要听真话？",
        "茶馆门口风小，消息却从不小。",
        "坐得越久，听见的事就越多。",
    ],
    intelPool: [
        "凤阳粮价上涨。",
        "最近有商队正在收马。",
        "城外来了不少流民。",
        "听说北边可能要打仗。",
        "最近官差搜查得很严。",
        "有江湖人士在暗中活动。",
    ],
};
exports.teaHouseTeaCost = 20;
exports.teaHouseInitialSpirit = 10;
exports.teaHouseTurnTimeLimitSec = 5;
exports.teaHouseLowIntelChance = 0.25;
exports.teaHouseTopicCounterMap = {
    利: "情",
    情: "名",
    名: "势",
    势: "义",
    义: "利",
};
exports.teaHousePersonalityTopicWeights = {
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
