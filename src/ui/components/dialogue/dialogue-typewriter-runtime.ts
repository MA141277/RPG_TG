import { DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE } from "../../dialogue-typewriter";

type DialogueTypewriterRuntimeHandle = {
  destroy(): void;
};

type DialogueTypewriterTimingApi = {
  setTimeout: typeof globalThis.setTimeout;
  clearTimeout: typeof globalThis.clearTimeout;
  matchMedia?: (
    query: string
  ) => {
    matches: boolean;
  };
};

const TYPEWRITER_CHAR_SELECTOR = `.c-dialogue-typewriter__char[${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}]`;
const TYPEWRITER_HINT_SELECTOR = `.c-dialogue-typewriter-hint[${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}]`;
const TYPEWRITER_VISIBLE_CLASS_NAME = "is-visible";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

function createNoopHandle(): DialogueTypewriterRuntimeHandle {
  return {
    destroy() {
      // No scheduled work to clear.
    },
  };
}

function readDelayMs(element: Element): number {
  const rawValue = element.getAttribute(DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE);
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

function shouldRevealImmediately(timingApi: DialogueTypewriterTimingApi): boolean {
  return timingApi.matchMedia?.(REDUCED_MOTION_MEDIA_QUERY).matches ?? false;
}

export function syncDialogueTypewriterRuntime(
  root: ParentNode,
  timingApi: DialogueTypewriterTimingApi = globalThis
): DialogueTypewriterRuntimeHandle {
  const characters = Array.from(
    root.querySelectorAll<HTMLElement>(TYPEWRITER_CHAR_SELECTOR)
  );
  const hints = Array.from(
    root.querySelectorAll<HTMLElement>(TYPEWRITER_HINT_SELECTOR)
  );
  const nodes = [...characters, ...hints];

  if (nodes.length === 0) {
    return createNoopHandle();
  }

  const revealImmediately = shouldRevealImmediately(timingApi);
  const timeoutIds: Array<ReturnType<typeof globalThis.setTimeout>> = [];

  for (const node of nodes) {
    node.classList.remove(TYPEWRITER_VISIBLE_CLASS_NAME);

    if (revealImmediately) {
      node.classList.add(TYPEWRITER_VISIBLE_CLASS_NAME);
      continue;
    }

    const delayMs = readDelayMs(node);
    if (delayMs === 0) {
      node.classList.add(TYPEWRITER_VISIBLE_CLASS_NAME);
      continue;
    }

    const timeoutId = timingApi.setTimeout(() => {
      if (!node.isConnected) {
        return;
      }

      node.classList.add(TYPEWRITER_VISIBLE_CLASS_NAME);
    }, delayMs);
    timeoutIds.push(timeoutId);
  }

  return {
    destroy() {
      for (const timeoutId of timeoutIds) {
        timingApi.clearTimeout(timeoutId);
      }
    },
  };
}
