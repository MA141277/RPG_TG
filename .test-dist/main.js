"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./styles/app.css");
const refresh_city_npc_pools_1 = require("./application/city-npcs/refresh-city-npc-pools");
const select_city_npcs_for_house_1 = require("./application/city-npcs/select-city-npcs-for-house");
const house_module_registry_1 = require("./application/house-modules/house-module-registry");
const inventory_selection_1 = require("./application/inventory/inventory-selection");
const enter_city_1 = require("./application/navigation/enter-city");
const travel_to_coordinate_1 = require("./application/navigation/travel-to-coordinate");
const create_initial_state_1 = require("./application/state/create-initial-state");
const prototype_world_1 = require("./content/prototype-world");
const assert_1 = require("./shared/assert");
const confirm_modal_1 = require("./ui/components/modal/confirm-modal");
const global_player_panel_1 = require("./ui/panels/global-player-panel");
const character_detail_view_1 = require("./ui/views/character/character-detail-view");
const card_library_view_1 = require("./ui/views/cards/card-library-view");
const city_view_1 = require("./ui/views/city/city-view");
const house_view_1 = require("./ui/views/house/house-view");
const grain_shop_house_view_1 = require("./ui/views/house/grain-shop-house-view");
const tea_house_house_view_1 = require("./ui/views/house/tea-house-house-view");
const map_view_1 = require("./ui/views/map/map-view");
const valuable_library_view_1 = require("./ui/views/valuables/valuable-library-view");
const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;
const appElement = document.querySelector("#app");
if (appElement == null) {
    throw new Error("Missing #app mount point.");
}
const appRoot = appElement;
syncGameViewport();
window.addEventListener("resize", syncGameViewport);
const playerCharacterId = "char.player";
const cityCoordinatesById = {
    [prototype_world_1.prototypeCity.id]: { x: 2, y: 2 },
};
const prototypeCityCoordinateCandidate = cityCoordinatesById[prototype_world_1.prototypeCity.id];
(0, assert_1.assertExists)(prototypeCityCoordinateCandidate, `Missing city coordinate for "${prototype_world_1.prototypeCity.id}".`);
const prototypeCityCoordinate = prototypeCityCoordinateCandidate;
const cityNameById = Object.fromEntries([prototype_world_1.prototypeCity].map((cityDefinition) => [cityDefinition.id, cityDefinition.name]));
const houseNameById = Object.fromEntries(prototype_world_1.prototypeHouses.map((houseDefinition) => [houseDefinition.id, houseDefinition.name]));
const characterNameById = Object.fromEntries(prototype_world_1.prototypeCharacters.map((characterDefinition) => [characterDefinition.id, characterDefinition.name]));
const intervalHandles = {};
let appState = {
    gameState: (0, refresh_city_npc_pools_1.ensureCityNpcPoolsForCurrentDay)((0, create_initial_state_1.createInitialState)({
        currentMapId: prototype_world_1.prototypeMap.id,
        currentCityId: prototype_world_1.prototypeCity.id,
        currentHouseId: null,
        playerCharacterId,
        chapterId: "chapter.prototype",
        year: 1567,
        month: 1,
        day: 1,
        pinnedCharacterId: playerCharacterId,
        reviewDateText: "距离评定 40 天",
        mainHouseMissionText: "前往评定会场",
        cards: {
            ownedCardIds: prototype_world_1.prototypeCards.map((cardDefinition) => cardDefinition.id),
            selectedCardId: prototype_world_1.prototypeCards[0]?.id ?? null,
        },
        valuables: {
            items: prototype_world_1.prototypeValuables,
            selectedItemId: prototype_world_1.prototypeValuables[0]?.id ?? null,
            equippedWeaponSet: {
                swordId: prototype_world_1.prototypeValuables.find((valuableDefinition) => valuableDefinition.category === "weapon")
                    ?.id ?? null,
                armorId: prototype_world_1.prototypeValuables.find((valuableDefinition) => valuableDefinition.category === "armor")
                    ?.id ?? null,
            },
        },
        currentView: "map",
    }), prototype_world_1.prototypeCityNpcPools),
    characterDefinitions: [...prototype_world_1.prototypeCharacters],
    playerCoordinate: { x: 0, y: 0 },
    modalState: null,
};
renderApp();
appElement.addEventListener("input", (event) => {
    const targetElement = event.target;
    if (!(targetElement instanceof HTMLInputElement)) {
        return;
    }
    const fieldId = targetElement.dataset.houseField;
    if (fieldId != null) {
        dispatchCurrentHouseRequest({
            type: "field",
            fieldId,
            value: targetElement.value,
        });
    }
});
appElement.addEventListener("click", (event) => {
    const targetElement = event.target;
    if (!(targetElement instanceof HTMLElement)) {
        return;
    }
    const modalAction = targetElement.closest("[data-modal-action]");
    if (modalAction != null && appState.modalState != null) {
        const actionType = modalAction.dataset.modalAction;
        if (actionType === "cancel") {
            appState = {
                ...appState,
                modalState: null,
            };
            renderApp();
            return;
        }
        if (actionType === "confirm") {
            handleModalConfirm();
            return;
        }
    }
    const closeOverlayButton = targetElement.closest("[data-action='close-overlay'], [data-action='close-character-detail']");
    if (closeOverlayButton != null) {
        updateOverlayView(null);
        return;
    }
    const playerCardButton = targetElement.closest("[data-action='open-player-detail']");
    if (playerCardButton != null) {
        updateOverlayView("detail");
        return;
    }
    const openCardsButton = targetElement.closest("[data-action='open-cards']");
    if (openCardsButton != null) {
        updateOverlayView("cards");
        return;
    }
    const openValuablesButton = targetElement.closest("[data-action='open-valuables']");
    if (openValuablesButton != null) {
        updateOverlayView("valuables");
        return;
    }
    const cardFilterButton = targetElement.closest("[data-card-filter]");
    if (cardFilterButton != null) {
        const filter = cardFilterButton.dataset.cardFilter;
        if (filter != null) {
            setCardFilter(filter);
        }
        return;
    }
    const cardButton = targetElement.closest("[data-card-id]");
    if (cardButton != null) {
        const cardId = cardButton.dataset.cardId;
        if (cardId != null) {
            selectCard(cardId);
        }
        return;
    }
    const valuableFilterButton = targetElement.closest("[data-valuable-filter]");
    if (valuableFilterButton != null) {
        const filter = valuableFilterButton.dataset.valuableFilter;
        if (filter != null) {
            setValuableFilter(filter);
        }
        return;
    }
    const valuableSortButton = targetElement.closest("[data-valuable-sort]");
    if (valuableSortButton != null) {
        const sortKey = valuableSortButton.dataset.valuableSort;
        if (sortKey != null) {
            setValuableSort(sortKey);
        }
        return;
    }
    const valuableButton = targetElement.closest("[data-valuable-id]");
    if (valuableButton != null) {
        const valuableId = valuableButton.dataset.valuableId;
        if (valuableId != null) {
            selectValuable(valuableId);
        }
        return;
    }
    const equipButton = targetElement.closest("[data-action='equip-valuable'][data-valuable-id]");
    if (equipButton != null) {
        const valuableId = equipButton.dataset.valuableId;
        if (valuableId != null) {
            equipValuable(valuableId);
        }
        return;
    }
    const leaveCityButton = targetElement.closest("[data-action='leave-city']");
    if (leaveCityButton != null) {
        clearAllHouseIntervals();
        appState = {
            ...appState,
            gameState: {
                ...appState.gameState,
                world: {
                    ...appState.gameState.world,
                    currentHouseId: null,
                },
                ui: {
                    ...appState.gameState.ui,
                    currentView: "map",
                    overlayView: null,
                    houseSession: null,
                },
            },
        };
        renderApp();
        return;
    }
    const houseActionButton = targetElement.closest("[data-house-action]");
    if (houseActionButton != null) {
        const actionId = houseActionButton.dataset.houseAction;
        if (actionId != null) {
            dispatchCurrentHouseRequest({
                type: "action",
                actionId,
            });
        }
        return;
    }
    const leaveHouseButton = targetElement.closest("[data-action='leave-house']");
    if (leaveHouseButton != null) {
        leaveCurrentHouse();
        return;
    }
    const houseButton = targetElement.closest("[data-house-id]");
    if (houseButton != null) {
        const houseId = houseButton.dataset.houseId;
        if (houseId == null) {
            return;
        }
        enterHouseById(houseId);
        return;
    }
    const mapCell = targetElement.closest("[data-map-x][data-map-y]");
    if (mapCell != null && appState.gameState.ui.currentView === "map") {
        const xValue = Number(mapCell.dataset.mapX);
        const yValue = Number(mapCell.dataset.mapY);
        const cityId = mapCell.dataset.cityId || null;
        const cityName = cityId == null ? null : cityNameById[cityId] ?? null;
        appState = {
            ...appState,
            modalState: {
                type: "travel-confirm",
                targetCoordinate: { x: xValue, y: yValue },
                cityId,
                cityName,
            },
        };
        renderApp();
    }
});
function getActiveHouseDefinition() {
    return (prototype_world_1.prototypeHouses.find((houseDefinition) => houseDefinition.id === appState.gameState.world.currentHouseId) ?? null);
}
function getPlayerCharacter() {
    const playerCharacter = appState.characterDefinitions.find((characterDefinition) => characterDefinition.id === playerCharacterId);
    (0, assert_1.assertExists)(playerCharacter, `Player character not found for id "${playerCharacterId}".`);
    return playerCharacter;
}
function updateOverlayView(overlayView) {
    appState = {
        ...appState,
        gameState: {
            ...appState.gameState,
            ui: {
                ...appState.gameState.ui,
                overlayView,
            },
        },
    };
    renderApp();
}
function setCardFilter(filter) {
    const visibleCards = getVisibleCards(filter);
    const selectedCardId = (0, inventory_selection_1.resolveSelectedCardId)(visibleCards, appState.gameState.cards.selectedCardId);
    appState = {
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
    renderApp();
}
function selectCard(cardId) {
    appState = {
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
    renderApp();
}
function setValuableFilter(filter) {
    const visibleItems = getVisibleValuables(filter);
    const selectedItemId = (0, inventory_selection_1.resolveSelectedValuableId)(visibleItems, appState.gameState.valuables.selectedItemId);
    appState = {
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
    renderApp();
}
function setValuableSort(sortKey) {
    const nextSortDirection = appState.gameState.ui.valuableLibrarySortKey === sortKey &&
        appState.gameState.ui.valuableLibrarySortDirection === "asc"
        ? "desc"
        : "asc";
    appState = {
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
    renderApp();
}
function selectValuable(valuableId) {
    appState = {
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
    renderApp();
}
function equipValuable(valuableId) {
    appState = {
        ...appState,
        gameState: {
            ...appState.gameState,
            valuables: (0, inventory_selection_1.equipValuableItem)(appState.gameState.valuables, valuableId),
            ui: {
                ...appState.gameState.ui,
                overlayView: "valuables",
            },
        },
    };
    renderApp();
}
function getVisibleCards(filter) {
    return (0, inventory_selection_1.getVisibleOwnedCards)(prototype_world_1.prototypeCards, appState.gameState.cards, filter);
}
function getVisibleValuables(filter) {
    return (0, inventory_selection_1.getVisibleValuables)(appState.gameState.valuables.items, filter);
}
function enterHouseById(houseId) {
    const houseDefinition = prototype_world_1.prototypeHouses.find((candidateHouse) => candidateHouse.id === houseId);
    (0, assert_1.assertExists)(houseDefinition, `House not found for id "${houseId}".`);
    clearAllHouseIntervals();
    appState = {
        ...appState,
        gameState: {
            ...appState.gameState,
            world: {
                ...appState.gameState.world,
                currentHouseId: houseId,
            },
            ui: {
                ...appState.gameState.ui,
                currentView: "house",
                overlayView: null,
                houseSession: null,
            },
        },
    };
    const moduleId = houseDefinition.moduleId;
    if (moduleId != null) {
        const houseModule = (0, house_module_registry_1.getHouseModule)(moduleId);
        const result = houseModule.enter({
            gameState: appState.gameState,
            characterDefinitions: appState.characterDefinitions,
            houseDefinition,
            playerCharacterId,
        });
        applyHouseModuleResult(houseDefinition, moduleId, result);
    }
    renderApp();
}
function leaveCurrentHouse() {
    const activeHouse = getActiveHouseDefinition();
    if (activeHouse?.moduleId != null) {
        const houseModule = (0, house_module_registry_1.getHouseModule)(activeHouse.moduleId);
        const result = houseModule.leave({
            gameState: appState.gameState,
            characterDefinitions: appState.characterDefinitions,
            houseDefinition: activeHouse,
            playerCharacterId,
            sessionState: appState.gameState.ui.houseSession?.state ?? null,
        });
        applyHouseModuleResult(activeHouse, activeHouse.moduleId, result);
    }
    else {
        clearAllHouseIntervals();
    }
    appState = {
        ...appState,
        gameState: {
            ...appState.gameState,
            world: {
                ...appState.gameState.world,
                currentHouseId: null,
            },
            ui: {
                ...appState.gameState.ui,
                currentView: "city",
                overlayView: null,
                houseSession: null,
            },
        },
    };
    renderApp();
}
function dispatchCurrentHouseRequest(request) {
    const activeHouse = getActiveHouseDefinition();
    const moduleId = activeHouse?.moduleId;
    if (activeHouse == null || moduleId == null) {
        return;
    }
    const houseModule = (0, house_module_registry_1.getHouseModule)(moduleId);
    const result = houseModule.dispatch({
        gameState: appState.gameState,
        characterDefinitions: appState.characterDefinitions,
        houseDefinition: activeHouse,
        playerCharacterId,
        sessionState: appState.gameState.ui.houseSession?.state ?? null,
        request,
    });
    applyHouseModuleResult(activeHouse, moduleId, result);
    renderApp();
}
function applyHouseModuleResult(houseDefinition, moduleId, result) {
    const nextHouseSession = result.sessionState == null
        ? null
        : {
            moduleId,
            state: result.sessionState,
        };
    appState = {
        ...appState,
        gameState: {
            ...result.gameState,
            ui: {
                ...result.gameState.ui,
                houseSession: nextHouseSession,
            },
        },
        characterDefinitions: result.characterDefinitions,
    };
    applyHouseSideEffects(houseDefinition, moduleId, result.sideEffects ?? []);
}
function applyHouseSideEffects(houseDefinition, moduleId, sideEffects) {
    sideEffects.forEach((sideEffect) => {
        if (sideEffect.type === "stop-interval") {
            stopHouseInterval(sideEffect.intervalId);
            return;
        }
        if (sideEffect.everyMs == null || sideEffect.request == null) {
            return;
        }
        stopHouseInterval(sideEffect.intervalId);
        intervalHandles[sideEffect.intervalId] = window.setInterval(() => {
            const activeHouse = getActiveHouseDefinition();
            if (activeHouse?.id !== houseDefinition.id || activeHouse.moduleId !== moduleId) {
                stopHouseInterval(sideEffect.intervalId);
                return;
            }
            dispatchCurrentHouseRequest(sideEffect.request);
        }, sideEffect.everyMs);
    });
}
function stopHouseInterval(intervalId) {
    const handle = intervalHandles[intervalId];
    if (handle != null) {
        window.clearInterval(handle);
        delete intervalHandles[intervalId];
    }
}
function clearAllHouseIntervals() {
    Object.keys(intervalHandles).forEach((intervalId) => {
        stopHouseInterval(intervalId);
    });
}
function handleModalConfirm() {
    if (appState.modalState == null) {
        return;
    }
    if (appState.modalState.type === "travel-confirm") {
        const nextCoordinate = (0, travel_to_coordinate_1.travelToCoordinate)(appState.playerCoordinate, appState.modalState.targetCoordinate);
        const didReachCity = appState.modalState.cityId === prototype_world_1.prototypeCity.id &&
            nextCoordinate.x === prototypeCityCoordinate.x &&
            nextCoordinate.y === prototypeCityCoordinate.y;
        appState = {
            ...appState,
            playerCoordinate: nextCoordinate,
            modalState: didReachCity
                ? {
                    type: "enter-city-confirm",
                    cityId: prototype_world_1.prototypeCity.id,
                    cityName: prototype_world_1.prototypeCity.name,
                }
                : null,
        };
        renderApp();
        return;
    }
    clearAllHouseIntervals();
    appState = {
        ...appState,
        gameState: (0, enter_city_1.enterCity)(appState.gameState, appState.modalState.cityId),
        modalState: null,
    };
    renderApp();
}
function renderApp() {
    appState = {
        ...appState,
        gameState: (0, refresh_city_npc_pools_1.ensureCityNpcPoolsForCurrentDay)(appState.gameState, prototype_world_1.prototypeCityNpcPools),
    };
    const currentView = appState.gameState.ui.currentView;
    const activeHouse = getActiveHouseDefinition();
    const playerCharacter = getPlayerCharacter();
    const playerPanelModel = (0, global_player_panel_1.createGlobalPlayerPanelModel)(playerCharacter, appState.gameState, null);
    let stageMarkup = "";
    if (currentView === "map") {
        const mapViewModel = (0, map_view_1.createMapViewModel)({
            mapName: prototype_world_1.prototypeMap.name,
            size: 5,
            playerCoordinate: appState.playerCoordinate,
            cityDefinitions: [prototype_world_1.prototypeCity],
            cityCoordinatesById,
        });
        stageMarkup = (0, map_view_1.renderMapView)(mapViewModel);
    }
    else if (currentView === "city") {
        stageMarkup = (0, city_view_1.renderCityView)(prototype_world_1.prototypeCity, prototype_world_1.prototypeHouses);
    }
    else if (currentView === "house" && activeHouse != null) {
        if (activeHouse.moduleId != null) {
            const houseModule = (0, house_module_registry_1.getHouseModule)(activeHouse.moduleId);
            const houseViewModel = houseModule.selectViewModel({
                gameState: appState.gameState,
                characterDefinitions: appState.characterDefinitions,
                houseDefinition: activeHouse,
                playerCharacterId,
                sessionState: appState.gameState.ui.houseSession?.state ?? null,
            });
            if (houseViewModel.moduleId === "grain-shop") {
                stageMarkup = (0, grain_shop_house_view_1.renderGrainShopHouseView)(houseViewModel);
            }
            else if (houseViewModel.moduleId === "tea-house") {
                stageMarkup = (0, tea_house_house_view_1.renderTeaHouseHouseView)(houseViewModel);
            }
        }
        else {
            const cityNpcSummaries = (0, select_city_npcs_for_house_1.selectCityNpcSummariesForHouse)(appState.gameState, activeHouse, prototype_world_1.prototypeCityNpcPools);
            const houseViewModel = (0, house_view_1.createHouseViewModel)(activeHouse, appState.characterDefinitions, cityNpcSummaries);
            stageMarkup = `
        <section class="view-house">
          <div class="c-stage-header">
            <div>
              <p class="c-stage-header__eyebrow">屋敷</p>
              <h1 class="c-stage-header__title">${houseViewModel.title}</h1>
            </div>
            <button class="c-button c-button--ghost" data-action="leave-house">${houseViewModel.backButtonLabel}</button>
          </div>
          <div class="c-house-interior">
            <div class="c-house-interior__hero c-panel">
              <strong class="c-house-interior__hero-name">
                ${houseViewModel.defaultCharacterId == null ? "无人接待" : "默认角色已展开"}
              </strong>
              <p class="c-house-interior__hero-text">
                这里是 ${houseViewModel.title}。后续可以在这里接入角色功能、事件入口和小游戏。
              </p>
            </div>
            <div class="c-house-roster">
              ${houseViewModel.characterSummaries
                .map((characterSummary) => `
                    <article class="c-roster-card c-panel">
                      <span class="c-roster-card__title">${characterSummary.title ?? "在场人物"}</span>
                      <strong class="c-roster-card__name">${characterSummary.name}</strong>
                    </article>
                  `)
                .join("")}
            </div>
          </div>
        </section>
      `;
        }
    }
    appRoot.innerHTML = `
    <div class="l-viewport">
      <div class="l-game-frame">
        <div class="l-game-screen">
        <div class="l-shell l-shell--prototype">
          <main class="l-stage">
        ${stageMarkup}
        <div class="l-overlay-ui">
          <button class="u-click-layer" data-action="open-player-detail" aria-label="打开角色详情">
            ${(0, global_player_panel_1.renderGlobalPlayerPanel)(playerPanelModel)}
          </button>
        </div>
      </main>
          ${renderModal()}
          ${renderOverlay(playerCharacter)}
        </div>
      </div>
      </div>
    </div>
  `;
}
function syncGameViewport() {
    const scale = Math.min(window.innerWidth / GAME_VIEWPORT_WIDTH, window.innerHeight / GAME_VIEWPORT_HEIGHT);
    appRoot.style.setProperty("--game-width", `${GAME_VIEWPORT_WIDTH}px`);
    appRoot.style.setProperty("--game-height", `${GAME_VIEWPORT_HEIGHT}px`);
    appRoot.style.setProperty("--game-scale", `${scale}`);
}
function renderOverlay(playerCharacter) {
    const overlayView = appState.gameState.ui.overlayView;
    if (overlayView === "detail") {
        return (0, character_detail_view_1.renderCharacterDetailView)(playerCharacter, buildCharacterDetailOptions(playerCharacter));
    }
    if (overlayView === "cards") {
        return (0, card_library_view_1.renderCardLibraryView)({
            cardDefinitions: prototype_world_1.prototypeCards,
            inventory: appState.gameState.cards,
            filter: appState.gameState.ui.cardLibraryFilter,
        });
    }
    if (overlayView === "valuables") {
        return (0, valuable_library_view_1.renderValuableLibraryView)({
            inventory: appState.gameState.valuables,
            filter: appState.gameState.ui.valuableLibraryFilter,
            sortKey: appState.gameState.ui.valuableLibrarySortKey,
            sortDirection: appState.gameState.ui.valuableLibrarySortDirection,
        });
    }
    return "";
}
function buildCharacterDetailOptions(playerCharacter) {
    const activeHouseDefinition = playerCharacter.houseId == null
        ? null
        : prototype_world_1.prototypeHouses.find((houseDefinition) => houseDefinition.id === playerCharacter.houseId) ?? null;
    const equippedWeapon = resolveEquippedItemName("weapon");
    const equippedArmor = resolveEquippedItemName("armor");
    const notorietyValue = appState.gameState.runtime.variables.notoriety;
    const options = {
        notoriety: typeof notorietyValue === "number" ? notorietyValue : 0,
        stipendText: `${playerCharacter.stats.gold} 文`,
        schoolName: "无",
        masterName: "无",
        weaponName: equippedWeapon ?? "无",
        armorName: equippedArmor ?? "无",
    };
    const cityName = cityNameById[playerCharacter.cityId];
    if (cityName != null) {
        options.cityName = cityName;
    }
    options.clanName = playerCharacter.clanId ?? "无";
    options.houseName =
        playerCharacter.houseId == null ? "无" : houseNameById[playerCharacter.houseId] ?? playerCharacter.houseId;
    options.lordName =
        activeHouseDefinition?.defaultCharacterId == null
            ? activeHouseDefinition == null
                ? "无"
                : houseNameById[activeHouseDefinition.id] ?? "无"
            : characterNameById[activeHouseDefinition.defaultCharacterId] ??
                houseNameById[activeHouseDefinition.id] ??
                "无";
    return options;
}
function resolveEquippedItemName(category) {
    const equippedId = category === "weapon"
        ? appState.gameState.valuables.equippedWeaponSet.swordId
        : appState.gameState.valuables.equippedWeaponSet.armorId;
    if (equippedId == null) {
        return null;
    }
    return (appState.gameState.valuables.items.find((itemDefinition) => itemDefinition.id === equippedId)?.name ??
        null);
}
function renderModal() {
    if (appState.modalState == null) {
        return "";
    }
    if (appState.modalState.type === "travel-confirm") {
        const title = appState.modalState.cityName == null
            ? `前往 (${appState.modalState.targetCoordinate.x}, ${appState.modalState.targetCoordinate.y})`
            : `前往 ${appState.modalState.cityName}`;
        const body = appState.modalState.cityName == null
            ? "确认移动到这个网格坐标。"
            : `这将移动到 ${appState.modalState.cityName} 所在坐标。`;
        return (0, confirm_modal_1.renderConfirmModal)({
            title,
            body,
            confirmLabel: "前往",
            cancelLabel: "取消",
        });
    }
    return (0, confirm_modal_1.renderConfirmModal)({
        title: `进入 ${appState.modalState.cityName}`,
        body: "人物与城市坐标已经重合，确认后展开城市结构。",
        confirmLabel: "进入城市",
        cancelLabel: "稍后",
        portraitLabel: prototype_world_1.prototypeCityPortraits[appState.modalState.cityId] ?? appState.modalState.cityName,
    });
}
