import type {
  TxtNarrativeChoiceOption,
  TxtNarrativeMarkerStep,
} from "../../domain/txt-narrative";

export type ParsedPipeDelimitedChoiceOption = {
  id: string;
  label: string;
  actionText: string;
  kind?: string;
  recommended?: boolean;
};

export function parsePipeDelimitedChoiceOption(
  rawValue: string,
  optionIndex: number
): ParsedPipeDelimitedChoiceOption | null {
  const normalizedRawValue = rawValue.trim();
  if (
    normalizedRawValue.length === 0 ||
    normalizedRawValue.includes("|") !== true
  ) {
    return null;
  }

  const segments = normalizedRawValue
    .split("|")
    .map((segment) => segment.trim());
  if (segments.length < 3) {
    return null;
  }

  const optionId = segments[0] ?? "";
  const optionLabel = segments[1] ?? "";
  const optionText = segments[2] ?? "";
  const optionKind = segments[3] ?? "";
  const recommendedValue = (segments[4] ?? "").toLowerCase();
  const recommended =
    recommendedValue.length === 0 ? undefined : recommendedValue === "true";

  return {
    id: optionId || `option.${optionIndex + 1}`,
    label: optionLabel || optionText || `选项${optionIndex + 1}`,
    actionText: optionText || optionLabel || `选项${optionIndex + 1}`,
    ...(optionKind.length === 0 ? {} : { kind: optionKind }),
    ...(recommended == null ? {} : { recommended }),
  };
}

function parseOptionLine(
  rawValue: string,
  optionIndex: number
): TxtNarrativeChoiceOption {
  const parsedPipeOption = parsePipeDelimitedChoiceOption(rawValue, optionIndex);
  if (parsedPipeOption != null) {
    return {
      id: parsedPipeOption.id,
      label: parsedPipeOption.label,
      actionText: parsedPipeOption.actionText,
      ...(parsedPipeOption.kind == null || parsedPipeOption.kind.length === 0
        ? {}
        : {
            kind:
              parsedPipeOption.kind as NonNullable<TxtNarrativeChoiceOption["kind"]>,
          }),
      ...(parsedPipeOption.recommended == null
        ? {}
        : { recommended: parsedPipeOption.recommended }),
    };
  }

  const label = rawValue.trim();
  return {
    id: `option.${optionIndex + 1}`,
    label,
    actionText: label,
  };
}

export function parseTxtNarrativeMarkerScript(
  script: string
): TxtNarrativeMarkerStep[] {
  const lines = script.split(/\r?\n/u);
  const steps: TxtNarrativeMarkerStep[] = [];
  let pendingChoice: {
    title: string;
    options: TxtNarrativeChoiceOption[];
  } | null = null;
  let pendingNarrationLines: string[] | null = null;

  function flushPendingChoice(): void {
    if (pendingChoice == null || pendingChoice.options.length === 0) {
      pendingChoice = null;
      return;
    }

    steps.push({
      type: "choice",
      prompt: pendingChoice.title,
      options: pendingChoice.options,
    });
    pendingChoice = null;
  }

  function flushPendingNarration(): void {
    if (pendingNarrationLines == null) {
      return;
    }

    const text = pendingNarrationLines.join("\n").trim();
    pendingNarrationLines = null;
    if (text.length === 0) {
      return;
    }

    steps.push({
      type: "narration",
      text,
    });
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0) {
      continue;
    }

    const narrationMatch = line.match(/^\[NARRATION:\s*([\s\S]+?)\]$/u);
    if (narrationMatch != null) {
      flushPendingNarration();
      steps.push({
        type: "narration",
        text: (narrationMatch[1] ?? "").trim(),
      });
      continue;
    }

    const inlineBareNarrationMatch = line.match(/^\[NARRATION\]\s*([\s\S]+?)$/u);
    if (inlineBareNarrationMatch != null) {
      flushPendingNarration();
      steps.push({
        type: "narration",
        text: (inlineBareNarrationMatch[1] ?? "").trim(),
      });
      continue;
    }

    if (line === "[NARRATION]") {
      flushPendingNarration();
      pendingNarrationLines = [];
      continue;
    }

    const dialogueMatch = line.match(
      /^\[DIALOGUE:\s*([^,\]]*?)\s*,\s*([^,\]]*?)\s*,\s*"([\s\S]*?)"\s*\]$/u
    );
    if (dialogueMatch != null) {
      flushPendingNarration();
      const speakerId = (dialogueMatch[1] ?? "").trim();
      const speakerName = (dialogueMatch[2] ?? "").trim();
      const text = (dialogueMatch[3] ?? "").trim();
      if (speakerId.length === 0 || speakerName.length === 0) {
        steps.push({
          type: "narration",
          text,
        });
      } else {
        steps.push({
          type: "dialogue",
          speakerId,
          speakerName,
          text,
        });
      }
      continue;
    }

    const shortDialogueMatch = line.match(
      /^\[DIALOGUE:\s*([^,\]]+?)\s*,\s*"([\s\S]*?)"\s*\]$/u
    );
    if (shortDialogueMatch != null) {
      flushPendingNarration();
      const speakerId = (shortDialogueMatch[1] ?? "").trim();
      const text = (shortDialogueMatch[2] ?? "").trim();
      steps.push({
        type: "dialogue",
        speakerId,
        speakerName: speakerId,
        text,
      });
      continue;
    }

    const setFlagMatch = line.match(/^\[(?:SET_FLAG|FLAG):\s*([\w.:-]+)\s*\]$/u);
    if (setFlagMatch != null) {
      flushPendingNarration();
      steps.push({
        type: "flag",
        op: "set",
        key: (setFlagMatch[1] ?? "").trim(),
      });
      continue;
    }

    const choiceMatch = line.match(/^\[CHOICE:\s*([\s\S]+?)\]$/u);
    if (choiceMatch != null) {
      flushPendingNarration();
      flushPendingChoice();

      pendingChoice = {
        title: (choiceMatch[1] ?? "").trim(),
        options: [],
      };
      continue;
    }

    if (line === "[CHOICE]") {
      flushPendingNarration();
      flushPendingChoice();
      pendingChoice = {
        title: "你想怎么接话？",
        options: [],
      };
      continue;
    }

    const optionMatch = line.match(/^\[OPTION:\s*([\s\S]+?)\]$/u);
    if (optionMatch != null && pendingChoice != null) {
      pendingChoice.options.push(
        parseOptionLine(
          (optionMatch[1] ?? "").trim(),
          pendingChoice.options.length
        )
      );
      continue;
    }

    if (pendingChoice != null) {
      const barePipeOption = parsePipeDelimitedChoiceOption(
        line,
        pendingChoice.options.length
      );
      if (barePipeOption != null) {
        pendingChoice.options.push({
          id: barePipeOption.id,
          label: barePipeOption.label,
          actionText: barePipeOption.actionText,
          ...(barePipeOption.kind == null || barePipeOption.kind.length === 0
            ? {}
            : {
                kind:
                  barePipeOption.kind as NonNullable<TxtNarrativeChoiceOption["kind"]>,
              }),
          ...(barePipeOption.recommended == null
            ? {}
            : { recommended: barePipeOption.recommended }),
        });
        continue;
      }
    }

    if (line === "[END_CHOICE]") {
      flushPendingNarration();
      flushPendingChoice();
      continue;
    }

    const sceneChangeMatch = line.match(
      /^\[SCENE_CHANGE:\s*([^|\]]+?)(?:\|([\s\S]+?))?\]$/u
    );
    if (sceneChangeMatch != null) {
      flushPendingNarration();
      const sceneId = (sceneChangeMatch[1] ?? "").trim();
      const placeName = sceneChangeMatch[2]?.trim() ?? "";
      steps.push({
        type: "scene_change",
        sceneId,
        ...(placeName.length === 0 ? {} : { placeName }),
      });
      continue;
    }

    if (pendingNarrationLines != null) {
      pendingNarrationLines.push(line);
      continue;
    }

    steps.push({
      type: "narration",
      text: line,
    });
  }

  flushPendingNarration();
  flushPendingChoice();

  return steps;
}
