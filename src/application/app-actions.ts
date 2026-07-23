import type { CardDefinition } from "../domain/card";
import type { CityMenuState } from "./city-menu/city-menu";
import type {
  CityEntryDirectoryType,
  CityEntryOption,
} from "../domain/city-entry";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "../domain/global-ui";
import type { ValuableItemId } from "../domain/valuable-item";
import type { NpcInteractionContext } from "../domain/npc-interaction";
import type { BattleFormationSlotKey } from "../domain/battle-formation";
import {
  addTroopFormationMemberFromReserve,
  clearTroopFormationMembersToReserve,
  createTroopFormation,
  dismissTroopReserveMember,
  disbandTroopFormationToReserve,
  moveTroopFormationMember,
  purchaseTroopShopOffer,
  removeTroopFormationMember,
  swapTroopFormationOrder,
} from "../domain/troop-editor";
import {
  closeNpcInteractionSession,
  createNpcInteractionSession,
} from "./npc-interaction/npc-interaction";
import {
  equipValuableItem,
  getVisibleOwnedCards,
  getVisibleValuables,
  resolveSelectedCardId,
  resolveSelectedValuableId,
} from "./inventory/inventory-selection";
import type { AppState } from "./app-shell";

export function updateOverlayView(
  appState: AppState,
  overlayView: AppState["gameState"]["ui"]["overlayView"]
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView,
      },
    },
  };
}

export function openPlayerDetail(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: "detail",
        detailCharacterId: null,
      },
    },
  };
}

export function openCharacterDetail(
  appState: AppState,
  characterId: string
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: "detail",
        detailCharacterId: characterId,
      },
    },
  };
}

export function closeGlobalOverlay(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: null,
        detailCharacterId: null,
      },
    },
  };
}

export function openTroopEditor(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        currentView: "troop-editor",
      },
    },
  };
}

export function openTroopManagement(
  appState: AppState,
  input?: {
    troopId?: string | null;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        currentView: "troop-management",
        selectedTroopId: input?.troopId ?? appState.gameState.ui.selectedTroopId,
      },
    },
  };
}

export function closeTroopEditor(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        currentView: "map",
      },
    },
  };
}

export function closeTroopManagement(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        currentView: "troop-editor",
      },
    },
  };
}

export function moveTroopManagementUnit(
  appState: AppState,
  input: {
    troopId: string;
    fromSlotKey: BattleFormationSlotKey;
    toSlotKey: BattleFormationSlotKey;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: moveTroopFormationMember(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function removeTroopManagementUnit(
  appState: AppState,
  input: {
    troopId: string;
    slotKey: BattleFormationSlotKey;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: removeTroopFormationMember(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function addTroopManagementUnitFromReserve(
  appState: AppState,
  input: {
    troopId: string;
    reserveMemberId: string;
    toSlotKey: BattleFormationSlotKey;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: addTroopFormationMemberFromReserve(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function clearTroopManagementUnit(
  appState: AppState,
  input: {
    troopId: string;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: clearTroopFormationMembersToReserve(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function disbandTroopManagementUnit(
  appState: AppState,
  input: {
    troopId: string;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: disbandTroopFormationToReserve(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function createTroopEditorTeam(
  appState: AppState,
  input: {
    name: string;
    captainReserveMemberId: string;
  }
): AppState {
  const nextTroops = createTroopFormation(appState.gameState.runtime.troops, {
    leaderCharacterId: appState.gameState.player.characterId,
    name: input.name,
    captainReserveMemberId: input.captainReserveMemberId,
  });
  if (nextTroops === appState.gameState.runtime.troops) {
    return appState;
  }

  const createdTroopId = nextTroops.formations.at(-1)?.id ?? null;

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        selectedTroopId: createdTroopId,
      },
      runtime: {
        ...appState.gameState.runtime,
        troops: nextTroops,
      },
    },
  };
}

export function swapTroopEditorTeams(
  appState: AppState,
  input: {
    firstTroopId: string;
    secondTroopId: string;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: swapTroopFormationOrder(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function dismissTroopEditorReserveUnit(
  appState: AppState,
  input: {
    reserveMemberId: string;
  }
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: dismissTroopReserveMember(appState.gameState.runtime.troops, input),
      },
    },
  };
}

export function purchaseTroopEditorShopOffer(
  appState: AppState,
  input: {
    offerId: string;
  }
): AppState {
  const playerCharacterId = appState.gameState.player.characterId;
  const playerCharacter =
    appState.characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === playerCharacterId
    ) ?? null;
  if (playerCharacter == null) {
    return appState;
  }

  const offer =
    appState.gameState.runtime.troops.shop.offers.find(
      (candidate) => candidate.id === input.offerId
    ) ?? null;
  if (offer == null) {
    return appState;
  }

  if (
    appState.gameState.runtime.troops.reserve.members.length >=
    appState.gameState.runtime.troops.reserve.capacity
  ) {
    return appState;
  }

  if (playerCharacter.stats.gold < offer.price) {
    return appState;
  }

  if (playerCharacter.stats.fame < offer.requiredFame) {
    return appState;
  }

  const nextTroops = purchaseTroopShopOffer(appState.gameState.runtime.troops, {
    offerId: input.offerId,
  });
  if (nextTroops === appState.gameState.runtime.troops) {
    return appState;
  }

  return {
    ...appState,
    characterDefinitions: appState.characterDefinitions.map((characterDefinition) =>
      characterDefinition.id === playerCharacterId
        ? {
            ...characterDefinition,
            stats: {
              ...characterDefinition.stats,
              gold: characterDefinition.stats.gold - offer.price,
            },
          }
        : characterDefinition
    ),
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: nextTroops,
      },
    },
  };
}

export function openNpcInteraction(
  appState: AppState,
  context: NpcInteractionContext,
  targetCharacterId: string
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: createNpcInteractionSession(
          context,
          targetCharacterId
        ),
      },
    },
  };
}

export function closeNpcInteraction(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: closeNpcInteractionSession(),
      },
    },
  };
}

export function chooseNpcDefaultTalk(
  appState: AppState,
  targetCharacterId: string
): AppState {
  const session = appState.gameState.ui.npcInteractionSession;
  if (session == null || session.targetCharacterId !== targetCharacterId) {
    return appState;
  }

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: {
          ...session,
          mode: "dialogue",
        },
      },
    },
  };
}

export function openCityDirectory(
  appState: AppState,
  input: {
    type: CityEntryDirectoryType;
    title: string;
    targetHouseId: string;
    options: CityEntryOption[];
  }
): AppState {
  return {
    ...appState,
    cityDirectoryState: {
      type: input.type,
      title: input.title,
      targetHouseId: input.targetHouseId,
      options: input.options,
    },
  };
}

export function openCityMenu(
  appState: AppState,
  cityMenuState: CityMenuState
): AppState {
  return {
    ...appState,
    cityMenuState,
  };
}

export function closeCityMenu(appState: AppState): AppState {
  return {
    ...appState,
    cityMenuState: null,
  };
}

export function closeCityDirectory(appState: AppState): AppState {
  return {
    ...appState,
    cityDirectoryState: null,
  };
}

export function setCardFilter(
  appState: AppState,
  filter: CardLibraryFilter,
  cardDefinitions: CardDefinition[]
): AppState {
  const visibleCards = getVisibleOwnedCards(
    cardDefinitions,
    appState.gameState.cards,
    filter
  );
  const selectedCardId = resolveSelectedCardId(
    visibleCards,
    appState.gameState.cards.selectedCardId
  );

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      cards: {
        ...appState.gameState.cards,
        selectedCardId,
      },
      ui: {
        ...appState.gameState.ui,
        cardLibraryFilter: filter,
        overlayView: "cards",
      },
    },
  };
}

export function selectCard(appState: AppState, cardId: string): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      cards: {
        ...appState.gameState.cards,
        selectedCardId: cardId,
      },
      ui: {
        ...appState.gameState.ui,
        overlayView: "cards",
      },
    },
  };
}

export function setValuableFilter(
  appState: AppState,
  filter: ValuableLibraryFilter
): AppState {
  const visibleItems = getVisibleValuables(
    appState.gameState.valuables.items,
    filter
  );
  const selectedItemId = resolveSelectedValuableId(
    visibleItems,
    appState.gameState.valuables.selectedItemId
  );

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      valuables: {
        ...appState.gameState.valuables,
        selectedItemId,
      },
      ui: {
        ...appState.gameState.ui,
        valuableLibraryFilter: filter,
        overlayView: "valuables",
      },
    },
  };
}

export function setValuableSort(
  appState: AppState,
  sortKey: ValuableLibrarySortKey
): AppState {
  const nextSortDirection =
    appState.gameState.ui.valuableLibrarySortKey === sortKey &&
    appState.gameState.ui.valuableLibrarySortDirection === "asc"
      ? "desc"
      : "asc";

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        valuableLibrarySortKey: sortKey,
        valuableLibrarySortDirection: nextSortDirection,
        overlayView: "valuables",
      },
    },
  };
}

export function selectValuable(
  appState: AppState,
  valuableId: ValuableItemId
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      valuables: {
        ...appState.gameState.valuables,
        selectedItemId: valuableId,
      },
      ui: {
        ...appState.gameState.ui,
        overlayView: "valuables",
      },
    },
  };
}

export function equipValuable(
  appState: AppState,
  valuableId: ValuableItemId
): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      valuables: equipValuableItem(appState.gameState.valuables, valuableId),
      ui: {
        ...appState.gameState.ui,
        overlayView: "valuables",
      },
    },
  };
}
