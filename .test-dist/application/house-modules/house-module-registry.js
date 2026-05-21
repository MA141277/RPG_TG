"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.houseModuleRegistry = void 0;
exports.getHouseModule = getHouseModule;
const grain_shop_house_module_1 = require("./grain-shop/grain-shop-house-module");
const tea_house_house_module_1 = require("./tea-house/tea-house-house-module");
exports.houseModuleRegistry = {
    "grain-shop": grain_shop_house_module_1.grainShopHouseModule,
    "tea-house": tea_house_house_module_1.teaHouseHouseModule,
};
function getHouseModule(moduleId) {
    return exports.houseModuleRegistry[moduleId];
}
