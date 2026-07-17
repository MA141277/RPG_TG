const TYPEWRITER_CHAR_MS = 32;
const TYPEWRITER_LINE_GAP_MS = 120;
const TYPEWRITER_HINT_GAP_MS = 160;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTypewriterCharacters(text: string, startDelayMs: number): string {
  return Array.from(text)
    .map((character, index) => {
      const delayMs = startDelayMs + index * TYPEWRITER_CHAR_MS;

      return `<span class="c-dialogue-typewriter__char" style="animation-delay:${delayMs}ms">${escapeHtml(character)}</span>`;
    })
    .join("");
}

export function renderDialogueTypewriterLines(
  lines: string[],
  lineClassName = "c-grain-shop-dialogue__line"
): { markup: string; totalDurationMs: number } {
  let nextLineDelayMs = 0;
  const markup = lines
    .map((line) => {
      const lineDelayMs = nextLineDelayMs;
      const characters = Array.from(line);
      nextLineDelayMs += characters.length * TYPEWRITER_CHAR_MS + TYPEWRITER_LINE_GAP_MS;

      return `<p class="${lineClassName} c-dialogue-typewriter-line" aria-label="${escapeHtml(line)}"><span class="c-dialogue-typewriter__chars" aria-hidden="true">${renderTypewriterCharacters(line, lineDelayMs)}</span></p>`;
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
  return `<p class="${hintClassName} c-dialogue-typewriter-hint" style="animation-delay:${textDurationMs + TYPEWRITER_HINT_GAP_MS}ms">${escapeHtml(hintText)}</p>`;
}
