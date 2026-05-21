"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisibleOwnedCards = getVisibleOwnedCards;
exports.resolveSelectedCardId = resolveSelectedCardId;
exports.getVisibleValuables = getVisibleValuables;
exports.resolveSelectedValuableId = resolveSelectedValuableId;
exports.equipValuableItem = equipValuableItem;
const assert_1 = require("../../shared/assert");
function getVisibleOwnedCards(cardDefinitions, inventory, filter) {
    const ownedIdSet = new Set(inventory.ownedCardIds);
    return cardDefinitions.filter((cardDefinition) => {
        if (!ownedIdSet.has(cardDefinition.id)) {
            return false;
        }
        return filter === "all" ? true : cardDefinition.category === filter;
    });
}
function resolveSelectedCardId(visibleCards, selectedCardId) {
    return (visibleCards.find((cardDefinition) => cardDefinition.id === selectedCardId)?.id ??
        visibleCards[0]?.id ??
        null);
}
function getVisibleValuables(items, filter) {
    if (filter === "all") {
        return items;
    }
    return items.filter((itemDefinition) => itemDefinition.category === "weapon" || itemDefinition.category === "armor");
}
function resolveSelectedValuableId(visibleItems, selectedItemId) {
    return (visibleItems.find((itemDefinition) => itemDefinition.id === selectedItemId)?.id ??
        visibleItems[0]?.id ??
        null);
}
function equipValuableItem(inventory, valuableId) {
    const selectedItem = inventory.items.find((itemDefinition) => itemDefinition.id === valuableId);
    (0, assert_1.assertExists)(selectedItem, `Valuable item not found for id "${valuableId}".`);
    const nextWeaponSet = { ...inventory.equippedWeaponSet };
    if (selectedItem.category === "weapon") {
        nextWeaponSet.swordId = valuableId;
    }
    if (selectedItem.category === "armor") {
        nextWeaponSet.armorId = valuableId;
    }
    return {
        ...inventory,
        selectedItemId: valuableId,
        equippedWeaponSet: nextWeaponSet,
    };
}
