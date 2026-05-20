import type { CardDefinition, CardId, CardInventory } from "../../domain/card";
import type {
  ValuableItemDefinition,
  ValuableItemId,
  ValuableItemInventory,
} from "../../domain/valuable-item";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
} from "../../domain/global-ui";
import { assertExists } from "../../shared/assert";

export function getVisibleOwnedCards(
  cardDefinitions: CardDefinition[],
  inventory: CardInventory,
  filter: CardLibraryFilter
): CardDefinition[] {
  const ownedIdSet = new Set(inventory.ownedCardIds);

  return cardDefinitions.filter((cardDefinition) => {
    if (!ownedIdSet.has(cardDefinition.id)) {
      return false;
    }

    return filter === "all" ? true : cardDefinition.category === filter;
  });
}

export function resolveSelectedCardId(
  visibleCards: CardDefinition[],
  selectedCardId: CardId | null
): CardId | null {
  return (
    visibleCards.find((cardDefinition) => cardDefinition.id === selectedCardId)?.id ??
    visibleCards[0]?.id ??
    null
  );
}

export function getVisibleValuables(
  items: ValuableItemDefinition[],
  filter: ValuableLibraryFilter
): ValuableItemDefinition[] {
  if (filter === "all") {
    return items;
  }

  return items.filter(
    (itemDefinition) =>
      itemDefinition.category === "weapon" || itemDefinition.category === "armor"
  );
}

export function resolveSelectedValuableId(
  visibleItems: ValuableItemDefinition[],
  selectedItemId: ValuableItemId | null
): ValuableItemId | null {
  return (
    visibleItems.find((itemDefinition) => itemDefinition.id === selectedItemId)?.id ??
    visibleItems[0]?.id ??
    null
  );
}

export function equipValuableItem(
  inventory: ValuableItemInventory,
  valuableId: ValuableItemId
): ValuableItemInventory {
  const selectedItem = inventory.items.find(
    (itemDefinition) => itemDefinition.id === valuableId
  );
  assertExists(selectedItem, `Valuable item not found for id "${valuableId}".`);

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
