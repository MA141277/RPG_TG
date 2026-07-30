const TYPEWRITER_CHAR_MS = 32;
const TYPEWRITER_LINE_GAP_MS = 120;
const TYPEWRITER_HINT_GAP_MS = 160;
export const DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE =
  "data-dialogue-typewriter-delay-ms";

type DialogueInlineSegment = {
  text: string;
  emphasized: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripDialogueInlineMarkup(text: string): string {
  return text.replace(/\*\*/g, "");
}

function parseDialogueInlineSegments(text: string): DialogueInlineSegment[] {
  const segments: DialogueInlineSegment[] = [];
  let buffer = "";
  let emphasized = false;

  for (let index = 0; index < text.length; ) {
    if (text[index] === "*" && text[index + 1] === "*") {
      if (buffer.length > 0) {
        segments.push({ text: buffer, emphasized });
        buffer = "";
      }

      emphasized = !emphasized;
      index += 2;
      continue;
    }

    buffer += text[index] ?? "";
    index += 1;
  }

  if (buffer.length > 0) {
    segments.push({ text: buffer, emphasized });
  }

  return segments;
}

function renderTypewriterCharacters(text: string, startDelayMs: number): string {
  return Array.from(text)
    .map((character, index) => {
      const delayMs = startDelayMs + index * TYPEWRITER_CHAR_MS;

      return `<span class="c-dialogue-typewriter__char" ${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}="${delayMs}">${escapeHtml(character)}</span>`;
    })
    .join("");
}

function renderTypewriterInlineText(
  text: string,
  startDelayMs: number
): { markup: string; visibleCharacters: number } {
  let nextDelayMs = startDelayMs;
  let visibleCharacters = 0;
  const markup = parseDialogueInlineSegments(text)
    .map((segment) => {
      const segmentMarkup = renderTypewriterCharacters(segment.text, nextDelayMs);
      const segmentLength = Array.from(segment.text).length;

      nextDelayMs += segmentLength * TYPEWRITER_CHAR_MS;
      visibleCharacters += segmentLength;

      return segment.emphasized
        ? `<strong class="c-dialogue-typewriter__strong">${segmentMarkup}</strong>`
        : segmentMarkup;
    })
    .join("");

  return {
    markup,
    visibleCharacters,
  };
}

export function renderDialogueTypewriterLines(
  lines: string[],
  lineClassName = "c-grain-shop-dialogue__line"
): { markup: string; totalDurationMs: number } {
  let nextLineDelayMs = 0;
  const markup = lines
    .map((line) => {
      const lineDelayMs = nextLineDelayMs;
      const visibleLine = stripDialogueInlineMarkup(line);
      const renderedLine = renderTypewriterInlineText(line, lineDelayMs);

      nextLineDelayMs +=
        renderedLine.visibleCharacters * TYPEWRITER_CHAR_MS + TYPEWRITER_LINE_GAP_MS;

      return `<p class="${lineClassName} c-dialogue-typewriter-line" aria-label="${escapeHtml(visibleLine)}"><span class="c-dialogue-typewriter__chars" aria-hidden="true">${renderedLine.markup}</span></p>`;
    })
    .join("");

  return {
    markup,
    totalDurationMs: Math.max(0, nextLineDelayMs - TYPEWRITER_LINE_GAP_MS),
  };
}

export function renderDialogueTypewriterHint(
  hintText: string,
  textDurationMs: number,
  hintClassName = "c-grain-shop-dialogue__hint"
): string {
  return `<p class="${hintClassName} c-dialogue-typewriter-hint" ${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}="${textDurationMs + TYPEWRITER_HINT_GAP_MS}">${escapeHtml(hintText)}</p>`;
}
