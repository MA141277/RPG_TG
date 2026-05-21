"use strict";
/** 粮铺纯内容配置（台词、传闻、评级奖励） */
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountingMaxWrongAnswers = exports.accountingGameDurationSec = exports.accountingGradeRewards = exports.grainShopInitialValues = exports.grainShopMarketRumors = exports.grainShopNpcDefaultLines = exports.grainShopNpcGreetings = void 0;
exports.grainShopNpcGreetings = [
    "粮价最近可不安稳。",
    "北边又闹灾了。",
    "做生意，算盘得快。",
    "这年头，粮比银子重要。",
];
exports.grainShopNpcDefaultLines = [
    "今天要买点什么？",
    "陈记杂粮，南北通商。",
    "有需要尽管开口。",
    "算盘打得快，生意才做得稳。",
];
exports.grainShopMarketRumors = [
    "凤阳粮价上涨。",
    "濠州最近缺粮。",
    "南边商队正在收粮。",
    "近来雨水不好。",
];
exports.grainShopInitialValues = {
    money: 200,
    food: 5,
    math: 1,
    relationship: 0,
    time: 1,
};
exports.accountingGradeRewards = {
    S: { math: 3, money: 80, relationship: 3 },
    A: { math: 2, money: 50, relationship: 2 },
    B: { math: 1, money: 30, relationship: 1 },
    C: { math: 0, money: 10, relationship: 0 },
    D: { math: -1, money: 0, relationship: 0 },
};
exports.accountingGameDurationSec = 30;
exports.accountingMaxWrongAnswers = 3;
