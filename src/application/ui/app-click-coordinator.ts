import type { CardDefinition } from "../../domain/card";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { CardLibraryFilter, ValuableLibraryFilter, ValuableLibrarySortKey } from "../../domain/global-ui";
import type { HouseDefinition } from "../../domain/house";
import type { ValuableItemId } from "../../domain/valuable-item";
import {
  closeCityDirectory,
  closeCityMenu,
  equipValuable,
  openCityMenu,
  selectCard,
  selectValuable,
  setCardFilter,
  setValuableFilter,
  setValuableSort,
  updateOverlayView,
} from "../app-actions";
import type { AppState } from "../app-shell";
import { createCityMenuState, isPlayerMonkIdentity, type CityMenuPanelId } from "../city-menu/city-menu";

type CurrentCityUiContext = {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinition: CityNpcPoolDefinition | null;
};

export type AppClickCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  getCardDefinitions(): CardDefinition[];
  getCurrentPlayerCharacter(): CharacterDefinition | null;
  getCurrentCityUiContext(): CurrentCityUiContext | null;
  openBeggingMiniGame(): void;
};

export function createAppClickCoordinator(
  dependencies: AppClickCoordinatorDependencies
) {
  function setAppState(appState: AppState): void {
    dependencies.setAppState(appState);
  }

  function commitAppState(appState: AppState): void {
    setAppState(appState);
    dependencies.renderApp();
  }

  function openCityMenuPanel(panelId: CityMenuPanelId): void {
    const playerCharacter = dependencies.getCurrentPlayerCharacter();
    if (playerCharacter == null) {
      return;
    }

    if (panelId === "begging" && !isPlayerMonkIdentity(playerCharacter)) {
      return;
    }

    if (panelId === "begging") {
      dependencies.openBeggingMiniGame();
      return;
    }

    const appState = dependencies.getAppState();
    const cityContext = dependencies.getCurrentCityUiContext();
    if (cityContext == null) {
      return;
    }

    commitAppState(
      openCityMenu(
        closeCityDirectory(appState),
        createCityMenuState({
          panelId,
          cityDefinition: cityContext.cityDefinition,
          houseDefinitions: cityContext.houseDefinitions,
          cityEntries: cityContext.cityEntries,
          cityNpcPoolDefinition: cityContext.cityNpcPoolDefinition,
          calendar: appState.gameState.calendar,
        })
      )
    );
  }

  function handleClick(targetElement: EventTarget | null): boolean {
    if (!(targetElement instanceof HTMLElement)) {
      return false;
    }

    const appState = dependencies.getAppState();
    const modalAction = targetElement.closest<HTMLElement>("[data-modal-action]");
    if (modalAction != null && appState.modalState != null) {
      const actionType = modalAction.dataset.modalAction;
      if (actionType === "cancel") {
        commitAppState({
          ...appState,
          modalState: null,
        });
        return true;
      }

      if (actionType === "confirm") {
        return false;
      }
    }

    const locationDialogueAction = targetElement.closest<HTMLElement>(
      "[data-action='close-location-dialogue']"
    );
    if (locationDialogueAction != null) {
      commitAppState({
        ...appState,
        locationDialogueState: null,
      });
      return true;
    }

    const closeOverlayButton = targetElement.closest<HTMLElement>(
      "[data-action='close-overlay'], [data-action='close-character-detail']"
    );
    if (closeOverlayButton != null) {
      commitAppState(updateOverlayView(appState, null));
      return true;
    }

    const playerCardButton = targetElement.closest<HTMLElement>(
      "[data-action='open-player-detail']"
    );
    if (playerCardButton != null) {
      commitAppState(updateOverlayView(appState, "detail"));
      return true;
    }

    const openCardsButton = targetElement.closest<HTMLElement>(
      "[data-action='open-cards']"
    );
    if (openCardsButton != null) {
      commitAppState(updateOverlayView(appState, "cards"));
      return true;
    }

    const openValuablesButton = targetElement.closest<HTMLElement>(
      "[data-action='open-valuables']"
    );
    if (openValuablesButton != null) {
      commitAppState(updateOverlayView(appState, "valuables"));
      return true;
    }

    const cardFilterButton = targetElement.closest<HTMLElement>(
      "[data-card-filter]"
    );
    if (cardFilterButton != null) {
      const filter = cardFilterButton.dataset.cardFilter as
        | CardLibraryFilter
        | undefined;
      if (filter != null) {
        commitAppState(
          setCardFilter(appState, filter, dependencies.getCardDefinitions())
        );
      }
      return true;
    }

    const cardButton = targetElement.closest<HTMLElement>("[data-card-id]");
    if (cardButton != null) {
      const cardId = cardButton.dataset.cardId;
      if (cardId != null) {
        commitAppState(selectCard(appState, cardId));
      }
      return true;
    }

    const valuableFilterButton = targetElement.closest<HTMLElement>(
      "[data-valuable-filter]"
    );
    if (valuableFilterButton != null) {
      const filter = valuableFilterButton.dataset.valuableFilter as
        | ValuableLibraryFilter
        | undefined;
      if (filter != null) {
        commitAppState(setValuableFilter(appState, filter));
      }
      return true;
    }

    const valuableSortButton = targetElement.closest<HTMLElement>(
      "[data-valuable-sort]"
    );
    if (valuableSortButton != null) {
      const sortKey = valuableSortButton.dataset.valuableSort as
        | ValuableLibrarySortKey
        | undefined;
      if (sortKey != null) {
        commitAppState(setValuableSort(appState, sortKey));
      }
      return true;
    }

    const valuableButton = targetElement.closest<HTMLElement>(
      "[data-valuable-id]"
    );
    if (valuableButton != null) {
      const valuableId = valuableButton.dataset.valuableId;
      if (valuableId != null) {
        commitAppState(selectValuable(appState, valuableId as ValuableItemId));
      }
      return true;
    }

    const equipButton = targetElement.closest<HTMLElement>(
      "[data-action='equip-valuable'][data-valuable-id]"
    );
    if (equipButton != null) {
      const valuableId = equipButton.dataset.valuableId;
      if (valuableId != null) {
        commitAppState(equipValuable(appState, valuableId as ValuableItemId));
      }
      return true;
    }

    const closeCityDirectoryButton = targetElement.closest<HTMLElement>(
      "[data-action='close-city-directory']"
    );
    if (closeCityDirectoryButton != null) {
      commitAppState(closeCityDirectory(appState));
      return true;
    }

    const closeCityMenuButton = targetElement.closest<HTMLElement>(
      "[data-action='close-city-menu']"
    );
    if (closeCityMenuButton != null) {
      commitAppState(closeCityMenu(appState));
      return true;
    }

    const startBeggingMiniGameButton = targetElement.closest<HTMLElement>(
      "[data-action='start-begging-minigame']"
    );
    if (startBeggingMiniGameButton != null) {
      dependencies.openBeggingMiniGame();
      return true;
    }

    const cityMenuOpenButton = targetElement.closest<HTMLElement>(
      "[data-city-menu-open]"
    );
    if (cityMenuOpenButton != null) {
      const panelId = cityMenuOpenButton.dataset.cityMenuOpen;
      if (
        panelId === "culture" ||
        panelId === "intel" ||
        panelId === "locations" ||
        panelId === "management" ||
        panelId === "begging"
      ) {
        openCityMenuPanel(panelId);
      }
      return true;
    }

    return false;
  }

  return {
    handleClick,
  };
}
