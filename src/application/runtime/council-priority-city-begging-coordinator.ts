import { closeCityDirectory, closeCityMenu } from "../app-actions";
import type { AppState } from "../app-shell";
import { isPlayerMonkIdentity } from "../city-menu/city-menu";
import {
  CITY_BEGGING_DURATION_DAYS,
  getCityBeggingMiniGameCompletionResult,
} from "../playables/builtin/city-begging/city-begging-minigame";
import { readCityBeggingDetachedCompletionResult } from "../playables/builtin/city-begging/city-begging-runtime-controller";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  canAffordActivityCost,
} from "../player/player-stamina";
import { defaultReviewCyclePolicy } from "../review/review-cycle-provider";
import type { CharacterDefinition } from "../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../domain/city-begging-minigame";
import type { HouseDefinition } from "../../domain/house";

export type CouncilPriorityCityBeggingCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  getCurrentPlayerCharacter(): CharacterDefinition | null;
  getCouncilPriorityHouseDefinition(): HouseDefinition | null;
  getRuntimeText(textId: string): string;
  getRuntimeTemplateText(
    textId: string,
    variables: Record<string, string | number>
  ): string;
  hasHaozhouShortage(appState: AppState): boolean;
  launchCityBeggingPlayable(appState: AppState, now: number): AppState;
  settleCityBeggingResult(result: CityBeggingGameCompletionResult): void;
  stopCityBeggingMiniGameLoop(): void;
  startCityBeggingMiniGameLoop(): void;
  now(): number;
};

export function createCouncilPriorityCityBeggingCoordinator(
  dependencies: CouncilPriorityCityBeggingCoordinatorDependencies
) {
  function showCouncilPriorityRefusal(): void {
    const appState = dependencies.getAppState();
    const priorityHouse = dependencies.getCouncilPriorityHouseDefinition();
    const isTempleReview = priorityHouse?.moduleId === "temple-house";

    dependencies.setAppState({
      ...appState,
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId:
          priorityHouse?.defaultCharacterId ??
          (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard"),
        textLines: isTempleReview
          ? [
              dependencies.getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_refusal.temple.001",
                {
                  targetHouseName: priorityHouse?.name ?? "\u7687\u89c9\u5bfa",
                }
              ),
              dependencies.getRuntimeText(
                "runtime.zhu_yuanzhang.council_refusal.temple.002"
              ),
            ]
          : [
              dependencies.getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_refusal.keep.001",
                {
                  targetHouseName: priorityHouse?.name ?? "\u5e05\u5e9c",
                }
              ),
              dependencies.getRuntimeText(
                "runtime.zhu_yuanzhang.council_refusal.keep.002"
              ),
            ],
        advanceHintText:
          priorityHouse == null
            ? "\u77e5\u9053\u4e86"
            : `\u524d\u5f80${priorityHouse.name}`,
      },
    });
    dependencies.renderApp();
  }

  function showCouncilInsufficientTimeRefusal(input: {
    activityLabel: string;
    durationDays: number;
    remainingDays: number;
  }): void {
    const appState = dependencies.getAppState();
    const priorityHouse = dependencies.getCouncilPriorityHouseDefinition();
    const isTempleReview = priorityHouse?.moduleId === "temple-house";
    const targetName =
      priorityHouse?.name ??
      (isTempleReview ? "\u7687\u89c9\u5bfa" : "\u5e05\u5e9c");

    dependencies.setAppState({
      ...closeCityMenu(closeCityDirectory(appState)),
      beggingMiniGameState: null,
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId:
          priorityHouse?.defaultCharacterId ??
          (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard"),
        textLines: isTempleReview
          ? input.remainingDays <= 0
            ? [
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.temple.arrived.001",
                  {
                    activityLabel: input.activityLabel,
                    durationDays: input.durationDays,
                  }
                ),
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.temple.arrived.002",
                  { targetHouseName: targetName }
                ),
              ]
            : [
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.temple.remaining.001",
                  {
                    remainingDays: input.remainingDays,
                    activityLabel: input.activityLabel,
                    durationDays: input.durationDays,
                  }
                ),
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.temple.remaining.002",
                  { targetHouseName: targetName }
                ),
              ]
          : input.remainingDays <= 0
            ? [
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.001",
                  {
                    activityLabel: input.activityLabel,
                    durationDays: input.durationDays,
                  }
                ),
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.002",
                  { targetHouseName: targetName }
                ),
              ]
            : [
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.keep.remaining.001",
                  {
                    remainingDays: input.remainingDays,
                    activityLabel: input.activityLabel,
                    durationDays: input.durationDays,
                  }
                ),
                dependencies.getRuntimeTemplateText(
                  "runtime.zhu_yuanzhang.council_insufficient_time.keep.remaining.002",
                  { targetHouseName: targetName }
                ),
              ],
        advanceHintText: "\u77e5\u9053\u4e86",
      },
    });
    dependencies.renderApp();
  }

  function confirmBeggingMiniGameResult(): void {
    const result = dependencies.getAppState().beggingMiniGameState;
    const completionResult =
      getCityBeggingMiniGameCompletionResult(result) ??
      readCityBeggingDetachedCompletionResult();
    if (completionResult == null) {
      return;
    }

    dependencies.settleCityBeggingResult(completionResult);
    dependencies.stopCityBeggingMiniGameLoop();
    dependencies.setAppState({
      ...dependencies.getAppState(),
      beggingMiniGameState: null,
    });
    dependencies.renderApp();
  }

  function openBeggingMiniGame(): void {
    const appState = dependencies.getAppState();
    const playerCharacter = dependencies.getCurrentPlayerCharacter();
    if (playerCharacter == null || !isPlayerMonkIdentity(playerCharacter)) {
      return;
    }

    if (dependencies.hasHaozhouShortage(appState)) {
      dependencies.stopCityBeggingMiniGameLoop();
      dependencies.setAppState({
        ...closeCityMenu(closeCityDirectory(appState)),
        locationDialogueState: {
          type: "house-access-refusal",
          speakerCharacterId: "char.kulan_temple_abbot",
          textLines: [
            dependencies.getRuntimeText(
              "runtime.zhu_yuanzhang.haozhou_shortage.001"
            ),
            dependencies.getRuntimeText(
              "runtime.zhu_yuanzhang.haozhou_shortage.002"
            ),
          ],
          advanceHintText: dependencies.getRuntimeText(
            "runtime.zhu_yuanzhang.haozhou_shortage.advance_hint"
          ),
        },
        beggingMiniGameState: null,
      });
      dependencies.renderApp();
      return;
    }

    if (!canAffordActivityCost(playerCharacter)) {
      dependencies.stopCityBeggingMiniGameLoop();
      dependencies.setAppState({
        ...closeCityMenu(closeCityDirectory(appState)),
        locationDialogueState: {
          type: "house-access-refusal",
          speakerCharacterId: "char.kulan_temple_abbot",
          textLines: [
            dependencies.getRuntimeText(
              "runtime.zhu_yuanzhang.begging_stamina_refusal.001"
            ),
            dependencies.getRuntimeTemplateText(
              "runtime.zhu_yuanzhang.begging_stamina_refusal.002",
              {
                requiredStamina: ACTIVITY_COMPLETION_STAMINA_COST,
              }
            ),
          ],
          advanceHintText: dependencies.getRuntimeText(
            "runtime.zhu_yuanzhang.begging_stamina_refusal.advance_hint"
          ),
        },
        beggingMiniGameState: null,
      });
      dependencies.renderApp();
      return;
    }

    const remainingDays = defaultReviewCyclePolicy.getInsufficientDaysForTimedActivity(
      appState.gameState,
      CITY_BEGGING_DURATION_DAYS
    );
    if (remainingDays != null) {
      dependencies.stopCityBeggingMiniGameLoop();
      showCouncilInsufficientTimeRefusal({
        activityLabel: "\u5316\u7f18",
        durationDays: CITY_BEGGING_DURATION_DAYS,
        remainingDays,
      });
      return;
    }

    dependencies.stopCityBeggingMiniGameLoop();
    const launchState = {
      ...closeCityMenu(closeCityDirectory(appState)),
      locationDialogueState: null,
    };
    dependencies.setAppState(
      dependencies.launchCityBeggingPlayable(launchState, dependencies.now())
    );
    dependencies.renderApp();
  }

  return {
    showCouncilPriorityRefusal,
    showCouncilInsufficientTimeRefusal,
    confirmBeggingMiniGameResult,
    openBeggingMiniGame,
  };
}
