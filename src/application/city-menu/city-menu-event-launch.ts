import type { AppState } from "../app-shell";
import type { CityMenuEntryAction } from "./city-menu";
import type { EventRouteCommand } from "../../domain/event";
import { closeCityDirectory, openCityMenu } from "../app-actions";
import { createCityMenuState } from "./city-menu";
import { dispatchEventRouteCommands } from "../events/event-route-command-dispatch";
import {
  startStoryEventById,
} from "../story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";

type CityMenuEventAction = Extract<CityMenuEntryAction, { type: "event" }>;
type CityMenuStoryContent = Parameters<typeof startStoryEventById>[1];
type OpenCityMenuPanelAction = Extract<
  EventRouteCommand,
  { type: "openCityMenuPanel" }
>;

export function launchCityMenuEvent(input: {
  state: AppState;
  action: CityMenuEventAction;
  storyContent: CityMenuStoryContent;
}): AppState {
  const bridgeContent = {
    ...(input.storyContent.cityDefinitionsById == null
      ? {}
      : { cityDefinitionsById: input.storyContent.cityDefinitionsById }),
    ...(input.storyContent.houseDefinitionsById == null
      ? {}
      : { houseDefinitionsById: input.storyContent.houseDefinitionsById }),
  };
  const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
    input.state,
    bridgeContent
  );
  const storyResult = startStoryEventById(
    {
      state: input.state.gameState,
      characterDefinitions: input.state.characterDefinitions,
      ...(runtimeDefinitionContext.cityDefinitions == null
        ? {}
        : { cityDefinitions: runtimeDefinitionContext.cityDefinitions }),
      ...(runtimeDefinitionContext.houseDefinitions == null
        ? {}
        : { houseDefinitions: runtimeDefinitionContext.houseDefinitions }),
    },
    input.storyContent,
    input.action.eventId
  );

  const nextState = applyStoryRuntimeResultToAppState(
    input.state,
    bridgeContent,
    storyResult
  );
  const eventDefinition =
    input.storyContent.eventDefinitionsById[input.action.eventId] ?? null;
  const commandResult = dispatchEventRouteCommands({
    state: nextState,
    eventDefinition,
    activityDefinitionsById: input.storyContent.activityDefinitionsById,
    textEntriesById: input.storyContent.textEntriesById,
    cityDefinitionsById: input.storyContent.cityDefinitionsById,
    houseDefinitionsById: input.storyContent.houseDefinitionsById,
    buildingArrangements: input.storyContent.buildingArrangements,
    locationAccessDefinitions: input.storyContent.locationAccessDefinitions,
  });
  if (
    commandResult.handled &&
    commandResult.state.gameState.runtime.playableSession != null
  ) {
    return commandResult.state;
  }

  const panelAction = findOpenCityMenuPanelAction(commandResult.unhandledCommands);
  if (panelAction == null) {
    return commandResult.state;
  }

  const cityId = commandResult.state.gameState.world.currentCityId;
  if (cityId == null || cityId.trim().length === 0) {
    return commandResult.state;
  }
  const cityDefinition = input.storyContent.cityDefinitionsById?.[cityId] ?? null;
  const cityMenuState = createCityMenuState({
    cityId,
    cityName:
      typeof cityDefinition?.name === "string" && cityDefinition.name.trim().length > 0
        ? cityDefinition.name
        : cityId,
    currentPanelId: panelAction.panelId,
  });
  if (cityMenuState == null) {
    return commandResult.state;
  }

  return openCityMenu(closeCityDirectory(commandResult.state), cityMenuState);
}

function findOpenCityMenuPanelAction(
  commands: readonly EventRouteCommand[]
): OpenCityMenuPanelAction | null {
  return (
    commands.find(
      (action): action is OpenCityMenuPanelAction =>
        action.type === "openCityMenuPanel"
    ) ?? null
  );
}
