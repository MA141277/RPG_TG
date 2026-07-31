import type {
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";

type ButtonSound = "light" | "heavy";

function withDefaultLight(sound?: ButtonSound): ButtonSound {
  return sound ?? "light";
}

export function applyHouseOverlayButtonSoundPolicy(
  overlay: HouseOverlayViewModel
): HouseOverlayViewModel {
  switch (overlay.type) {
    case "alert":
      return {
        ...overlay,
        confirmButtonSound: "light",
      };
    case "confirm":
      return {
        ...overlay,
        cancelButtonSound: "light",
        confirmButtonSound: "heavy",
        ...(overlay.quickCompleteActionId == null
          ? {}
          : {
              quickCompleteButtonSound: "heavy",
            }),
      };
    case "rest-days":
      return {
        ...overlay,
        cancelButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    case "quantity-confirm":
      return {
        ...overlay,
        cancelButtonSound: "light",
        decrementButtonSound: "light",
        incrementButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    case "trade":
      return {
        ...overlay,
        cancelButtonSound: "light",
        decrementButtonSound: "light",
        incrementButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    case "market-trade":
      return {
        ...overlay,
        cancelButtonSound: "light",
        decrementButtonSound: "light",
        incrementButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    case "settlement-trade":
      return {
        ...overlay,
        cancelButtonSound: "light",
        decrementButtonSound: "light",
        incrementButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    case "medicine-buy":
      return {
        ...overlay,
        cancelButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    case "result":
      return {
        ...overlay,
        confirmButtonSound: "light",
      };
    case "gamble-choice":
      return {
        ...overlay,
        cancelButtonSound: "light",
        optionButtonSound: "light",
      };
    case "gamble":
      return {
        ...overlay,
        cancelButtonSound: "light",
        decrementButtonSound: "light",
        incrementButtonSound: "light",
        confirmButtonSound: "heavy",
      };
    default:
      return overlay;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function injectHouseActionButtonSound(
  markup: string,
  actionId: string | undefined,
  sound: ButtonSound | undefined
): string {
  if (actionId == null || actionId.length === 0 || sound == null) {
    return markup;
  }

  return markup.replace(
    new RegExp(
      `(data-house-action="${escapeRegExp(actionId)}")(?![^>]*data-button-sound=)`,
      "g"
    ),
    `$1 data-button-sound="${sound}"`
  );
}

export function applyHouseOverlayButtonSoundMarkup(
  markup: string,
  overlay: HouseOverlayViewModel | null
): string {
  if (overlay == null) {
    return markup;
  }

  switch (overlay.type) {
    case "alert":
      return injectHouseActionButtonSound(
        markup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    case "confirm": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );

      return injectHouseActionButtonSound(
        nextMarkup,
        overlay.quickCompleteActionId,
        overlay.quickCompleteButtonSound
      );
    }
    case "rest-days":
      return injectHouseActionButtonSound(
        injectHouseActionButtonSound(
          markup,
          overlay.cancelActionId,
          overlay.cancelButtonSound
        ),
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    case "quantity-confirm": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.decrementActionId,
        overlay.decrementButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.incrementActionId,
        overlay.incrementButtonSound
      );

      return injectHouseActionButtonSound(
        nextMarkup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    }
    case "trade": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.decrementActionId,
        overlay.decrementButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.incrementActionId,
        overlay.incrementButtonSound
      );

      return injectHouseActionButtonSound(
        nextMarkup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    }
    case "market-trade": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.decrementActionId,
        overlay.decrementButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.incrementActionId,
        overlay.incrementButtonSound
      );

      return injectHouseActionButtonSound(
        nextMarkup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    }
    case "settlement-trade": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.decrementActionId,
        overlay.decrementButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.incrementActionId,
        overlay.incrementButtonSound
      );

      return injectHouseActionButtonSound(
        nextMarkup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    }
    case "medicine-buy":
      return injectHouseActionButtonSound(
        injectHouseActionButtonSound(
          markup,
          overlay.cancelActionId,
          overlay.cancelButtonSound
        ),
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    case "result":
      return injectHouseActionButtonSound(
        markup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    case "gamble-choice": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );

      for (const option of overlay.options) {
        nextMarkup = injectHouseActionButtonSound(
          nextMarkup,
          option.actionId,
          overlay.optionButtonSound
        );
      }

      return nextMarkup;
    }
    case "gamble": {
      let nextMarkup = injectHouseActionButtonSound(
        markup,
        overlay.cancelActionId,
        overlay.cancelButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.decrementActionId,
        overlay.decrementButtonSound
      );
      nextMarkup = injectHouseActionButtonSound(
        nextMarkup,
        overlay.incrementActionId,
        overlay.incrementButtonSound
      );

      return injectHouseActionButtonSound(
        nextMarkup,
        overlay.confirmActionId,
        overlay.confirmButtonSound
      );
    }
    default:
      return markup;
  }
}

export function withHouseButtonSoundPolicies(
  viewModel: HouseModuleViewModel
): HouseModuleViewModel {
  return {
    ...viewModel,
    actionContainer:
      viewModel.actionContainer == null
        ? null
        : {
            ...viewModel.actionContainer,
            actions: viewModel.actionContainer.actions.map((action) => ({
              ...action,
              buttonSound: withDefaultLight(action.buttonSound),
            })),
          },
    overlay:
      viewModel.overlay == null
        ? null
        : applyHouseOverlayButtonSoundPolicy(viewModel.overlay),
    leaveAction: {
      ...viewModel.leaveAction,
      buttonSound: withDefaultLight(viewModel.leaveAction.buttonSound),
    },
  };
}
