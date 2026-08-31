import type { CharacterId } from "./character";

export type TxtNarrativeProviderInputType =
  | "enter_place"
  | "select_option"
  | "free_input"
  | "reactivate_narrative";

export type TxtNarrativeProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type TxtNarrativeChoiceKind =
  | "mainline"
  | "recommended"
  | "side"
  | "freeform"
  | "system";

export type TxtNarrativeChoiceOption = {
  id: string;
  label: string;
  actionText: string;
  kind?: TxtNarrativeChoiceKind;
  recommended?: boolean;
};

export type TxtNarrativeNarrationStep = {
  type: "narration";
  text: string;
};

export type TxtNarrativeDialogueStep = {
  type: "dialogue";
  speakerId: string;
  speakerName: string;
  text: string;
};

export type TxtNarrativeFlagStep = {
  type: "flag";
  op: "set";
  key: string;
};

export type TxtNarrativeChoiceStep = {
  type: "choice";
  prompt: string;
  options: TxtNarrativeChoiceOption[];
};

export type TxtNarrativeSceneChangeStep = {
  type: "scene_change";
  sceneId: string;
  placeName?: string;
};

export type TxtNarrativeMarkerStep =
  | TxtNarrativeNarrationStep
  | TxtNarrativeDialogueStep
  | TxtNarrativeFlagStep
  | TxtNarrativeChoiceStep
  | TxtNarrativeSceneChangeStep;

export type TxtNarrativeProviderRequest = {
  requestId: string;
  system: string;
  messages: TxtNarrativeProviderMessage[];
  metadata: {
    phaseId: string;
    houseId: string;
    placeName: string;
    inputType?: TxtNarrativeProviderInputType;
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    freeInputText?: string;
  };
};

export type TxtNarrativeProviderEvent =
  | {
      type: "start";
      requestId: string;
    }
  | {
      type: "step";
      requestId: string;
      step: TxtNarrativeMarkerStep;
    }
  | {
      type: "complete";
      requestId: string;
      rawText: string;
      allSteps: TxtNarrativeMarkerStep[];
    }
  | {
      type: "error";
      requestId: string;
      message: string;
    };

export type TxtNarrativeProvider = {
  stream(
    request: TxtNarrativeProviderRequest,
    onEvent: (event: TxtNarrativeProviderEvent) => void | Promise<void>
  ): void | Promise<void>;
  cancel?(requestId: string): void | Promise<void>;
};

export type TxtNarrativeTranscriptEntry =
  | {
      id: string;
      type: "narration";
      text: string;
    }
  | {
      id: string;
      type: "dialogue";
      text: string;
      speakerId?: CharacterId | string;
      speakerName?: string;
      portraitImageUrl?: string | null;
      portraitArtClassName?: string;
    };

export type TxtNarrativeOverlayOption = {
  id: string;
  label: string;
  actionId: string;
  recommended?: boolean;
  disabled?: boolean;
  kind?: TxtNarrativeChoiceKind;
};

export type TxtNarrativeOverlayCustomInput = {
  fieldId: string;
  submitActionId: string;
  placeholder: string;
  value?: string;
};

export type TxtNarrativeOverlayControlActions = {
  exitActionId: string;
  reactivateActionId: string;
};

export type TxtNarrativeOverlayViewModel = {
  type: "txt-narrative";
  title: string;
  placeName: string;
  phaseLabel: string;
  isStreaming: boolean;
  paused: boolean;
  transcript: TxtNarrativeTranscriptEntry[];
  options: TxtNarrativeOverlayOption[];
  customInput: TxtNarrativeOverlayCustomInput;
  controlActions: TxtNarrativeOverlayControlActions;
  statusNotice?: string | null;
  errorNotice?: string | null;
};

export type TxtNarrativePlaceMatchStrategy =
  | "exact"
  | "fuzzy_existing"
  | "temporary_generated";

export type TxtNarrativePlaceResolution = {
  requestedName: string;
  resolvedHouseId?: string;
  resolvedPlaceName?: string;
  strategy: TxtNarrativePlaceMatchStrategy;
  confidence: number;
  note?: string;
};

export type TxtNarrativeRuntimeState = {
  currentPhaseId: string | null;
  currentPlaceHouseId: string | null;
  currentPlaceName: string | null;
  flags: Record<string, boolean>;
  temporaryPlaces: TxtNarrativePlaceResolution[];
};

export function createInitialTxtNarrativeRuntimeState(): TxtNarrativeRuntimeState {
  return {
    currentPhaseId: null,
    currentPlaceHouseId: null,
    currentPlaceName: null,
    flags: {},
    temporaryPlaces: [],
  };
}
