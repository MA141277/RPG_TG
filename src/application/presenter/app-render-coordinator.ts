import { createAppPresenterOutput } from "./app-presenter";
import { applyRenderPrepassState } from "../runtime/render-prepass-state";
import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import type { CityDefinition } from "../../domain/city";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { MapDefinition } from "../../domain/map";
import { materializeBuildingDefinitions } from "../../domain/building-status";
import { materializeCityDefinitions } from "../../domain/city-status";
import { assertExists } from "../../shared/assert";
import { renderApp as renderAppMarkup } from "../../ui/app-render";

type FocusedScaleInputState = {
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
} | null;

export type AppRenderCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  getAppRoot(): HTMLElement;
  getPlayerCharacterId(): string;
  getActiveContentContext(): ActiveGameContentContext;
  getCurrentMapDefinition(): MapDefinition | null;
  getCurrentCityDefinition(appState: AppState): CityDefinition | null;
  getCitySceneMappingsByCityId(): Record<string, CitySceneMapping>;
  captureCampaignTerrainCanvases(root: ParentNode): HTMLCanvasElement[] | null;
  restoreCampaignTerrainCanvases(
    root: ParentNode,
    preservedCanvases: HTMLCanvasElement[] | null
  ): void;
  startInitialCampaignMapDebugAnimationIfNeeded(): void;
  syncCampaignMapDebugView(): void;
  syncCampaignTerrainStyleView(): void;
  syncCampaignCityDepthMeshTransformView(): void;
  restoreCampaignMapScaleInputFocus(
    focusedScaleInput: FocusedScaleInputState
  ): void;
  syncMapIntroOverlay(): void;
  syncActivityQteLoop(): void;
  syncHousePlayableLoop(): void;
  syncCampaignTerrainWebGl(root: HTMLElement): void;
  syncCityBeggingMiniGameOverlay(
    root: HTMLElement,
    beggingMiniGameState: AppState["beggingMiniGameState"]
  ): void;
};

function readFocusedScaleInput(): FocusedScaleInputState {
  const activeScaleInput = document.activeElement;
  return activeScaleInput instanceof HTMLInputElement &&
    activeScaleInput.hasAttribute("data-campaign-map-scale-input")
    ? {
        value: activeScaleInput.value,
        selectionStart: activeScaleInput.selectionStart,
        selectionEnd: activeScaleInput.selectionEnd,
      }
    : null;
}

export function createAppRenderCoordinator(
  dependencies: AppRenderCoordinatorDependencies
) {
  function renderFrame(focusedScaleInput: FocusedScaleInputState): void {
    const activeContentContext = dependencies.getActiveContentContext();
    dependencies.setAppState(
      applyRenderPrepassState(
        dependencies.getAppState(),
        activeContentContext.cityNpcPools
      )
    );

    const appState = dependencies.getAppState();
    const appRoot = dependencies.getAppRoot();
    const currentMapDefinition = dependencies.getCurrentMapDefinition();
    const materializedCityDefinitions = materializeCityDefinitions(
      activeContentContext.cities,
      appState.cityStatusById ?? {}
    );
    const materializedHouseDefinitions = materializeBuildingDefinitions(
      activeContentContext.houses,
      appState.buildingStatusById ?? {}
    );
    const currentCityDefinition =
      materializedCityDefinitions.find(
        (cityDefinition) =>
          cityDefinition.id === appState.gameState.world.currentCityId
      ) ??
      dependencies.getCurrentCityDefinition(appState);

    assertExists(currentMapDefinition, "Missing active map definition for render.");
    assertExists(currentCityDefinition, "Missing active city definition for render.");

    const preservedTerrainCanvases =
      appState.gameState.ui.currentView === "map"
        ? dependencies.captureCampaignTerrainCanvases(appRoot)
        : null;
    const citySceneMappingsByCityId =
      dependencies.getCitySceneMappingsByCityId();
    const presenterOutput = createAppPresenterOutput({
      appState,
      playerCharacterId: dependencies.getPlayerCharacterId(),
      cityDefinition: currentCityDefinition,
      cityDefinitions: materializedCityDefinitions,
      houseDefinitions: materializedHouseDefinitions,
      buildingArrangements: activeContentContext.buildingArrangements,
      cityEntries: activeContentContext.cityEntries,
      cityNpcPoolDefinitions: activeContentContext.cityNpcPools,
      cityNameById: activeContentContext.cityNameById,
      menuResourcesById: activeContentContext.gameContent.menuResourcesById,
      menuInstancesById: activeContentContext.gameContent.menuInstancesById,
      playableIntegrationsByEditorRecordId:
        activeContentContext.gameContent.playableIntegrationsByEditorRecordId,
      playableIntegrationsById:
        activeContentContext.gameContent.playableIntegrationsById,
      textEntriesById: activeContentContext.textEntriesById,
      citySceneMappingsByCityId,
      dialogueDefinitionsById:
        activeContentContext.storyContent.dialogueDefinitionsById,
    });

    appRoot.innerHTML = renderAppMarkup({
      appState,
      playerCharacterId: dependencies.getPlayerCharacterId(),
      mapDefinition: currentMapDefinition,
      cityDefinition: currentCityDefinition,
      cityDefinitions: materializedCityDefinitions,
      houseDefinitions: materializedHouseDefinitions,
      cityEntries: activeContentContext.cityEntries,
      cardDefinitions: activeContentContext.cards,
      cityNpcPoolDefinitions: activeContentContext.cityNpcPools,
      mapLocationProvider: activeContentContext.mapLocationProvider,
      cityNameById: activeContentContext.cityNameById,
      houseNameById: activeContentContext.houseNameById,
      characterNameById: activeContentContext.characterNameById,
      characterManager: activeContentContext.characterManager,
      textEntriesById: activeContentContext.textEntriesById,
      cityPortraits: activeContentContext.cityPortraits,
      citySceneMappingsByCityId,
      historicalCharacters: activeContentContext.historicalCharacters,
      historicalCityRosters: activeContentContext.historicalCityRosters,
      flowPlayablesById: activeContentContext.gameContent.flowPlayablesById,
      presenterOutput,
    });
    dependencies.restoreCampaignTerrainCanvases(appRoot, preservedTerrainCanvases);
    dependencies.startInitialCampaignMapDebugAnimationIfNeeded();
    dependencies.syncCampaignMapDebugView();
    dependencies.syncCampaignTerrainStyleView();
    dependencies.syncCampaignCityDepthMeshTransformView();
    dependencies.restoreCampaignMapScaleInputFocus(focusedScaleInput);
    dependencies.syncMapIntroOverlay();
    dependencies.syncActivityQteLoop();
    dependencies.syncHousePlayableLoop();
    dependencies.syncCampaignTerrainWebGl(appRoot);
    dependencies.syncCityBeggingMiniGameOverlay(
      appRoot,
      appState.beggingMiniGameState
    );
  }

  return {
    render(): void {
      renderFrame(readFocusedScaleInput());
    },
  };
}
