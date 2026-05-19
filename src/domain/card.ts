export type CardCategory = "secret-technique" | "battle";

export type CardId = string;

export type CardDefinition = {
  id: CardId;
  name: string;
  category: CardCategory;
  skillDescription: string;
  battlefieldDisplay: string;
  ammoCostText: string;
  cardImageId: string;
  logicNotes?: string;
};

export type CardInventory = {
  ownedCardIds: CardId[];
  selectedCardId: CardId | null;
};
