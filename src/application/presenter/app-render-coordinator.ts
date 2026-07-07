import { createAppPresenterOutput } from "./app-presenter";
import { applyRenderPrepassState } from "../runtime/render-prepass-state";
import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import type { CityDefinition } from "../../domain/city";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { MapDefinition } from "../../domain/map";
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
    const currentCityDefinition = dependencies.getCurrentCityDefinition(appState);

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
      cityDefinitions: activeContentContext.cities,
      houseDefinitions: activeContentContext.houses,
      cityEntries: activeContentContext.cityEntries,
      cityNpcPoolDefinitions: activeContentContext.cityNpcPools,
      cityNameById: activeContentContext.cityNameById,
      textEntriesById: activeContentContext.textEntriesById,
      citySceneMappingsByCityId,
      sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    });

    appRoot.innerHTML = renderAppMarkup({
      appState,
      playerCharacterId: dependencies.getPlayerCharacterId(),
      mapDefinition: currentMapDefinition,
      cityDefinition: currentCityDefinition,
      cityDefinitions: activeContentContext.cities,
      houseDefinitions: activeContentContext.houses,
      cityEntries: activeContentContext.cityEntries,
      cardDefinitions: activeContentContext.cards,
      cityNpcPoolDefinitions: activeContentContext.cityNpcPools,
      cityCoordinatesById: activeContentContext.cityCoordinatesById,
      cityNameById: activeContentContext.cityNameById,
      houseNameById: activeContentContext.houseNameById,
      characterNameById: activeContentContext.characterNameById,
      textEntriesById: activeContentContext.textEntriesById,
      cityPortraits: activeContentContext.cityPortraits,
      citySceneMappingsByCityId,
      historicalCharacters: activeContentContext.historicalCharacters,
      historicalCityRosters: activeContentContext.historicalCityRosters,
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
