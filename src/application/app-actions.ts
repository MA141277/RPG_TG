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
