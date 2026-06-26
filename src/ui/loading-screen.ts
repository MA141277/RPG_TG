import loadingBaseUrl from "../../ui/yuansu/过场界面/- loading_0.png?url";
import loadingFullUrl from "../../ui/yuansu/过场界面/- loading_100.png?url";
import loadingAltBaseUrl from "../../ui/yuansu/过场界面/1- loading_0.png?url";
import loadingAltFullUrl from "../../ui/yuansu/过场界面/1- loading_100.png?url";

const LOADING_SOURCE_WIDTH = 1672;
const LOADING_SOURCE_HEIGHT = 941;

type LoadingBarMask = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type LoadingCursorPath = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  offsetX: number;
  offsetY: number;
};

export type LoadingCursorOptions = {
  cursorSize: number;
  cursorAlpha: number;
};

export type LoadingTheme = {
  name: string;
  baseImageUrl: string;
  fullImageUrl: string;
  barMask: LoadingBarMask;
  cursorPath: LoadingCursorPath;
};

export const LOADING_THEMES: LoadingTheme[] = [
  {
    name: "ink-map-default",
    baseImageUrl: loadingBaseUrl,
    fullImageUrl: loadingFullUrl,
    barMask: {
      left: 1008,
      top: 792,
      width: 538,
      height: 54,
    },
    cursorPath: {
      startX: 1008,
      startY: 819,
      endX: 1546,
      endY: 819,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    name: "ink-map-variant-1",
    baseImageUrl: loadingAltBaseUrl,
    fullImageUrl: loadingAltFullUrl,
    barMask: {
      left: 400,
      top: 800,
      width: 860,
      height: 34,
    },
    cursorPath: {
      startX: 400,
      startY: 817,
      endX: 1260,
      endY: 817,
      offsetX: 0,
      offsetY: 41,
    },
  },
];

export const DEFAULT_LOADING_CURSOR_OPTIONS: LoadingCursorOptions = {
  cursorSize: 42,
  cursorAlpha: 0.88,
};

export function selectRandomLoadingTheme(
  themes: LoadingTheme[] = LOADING_THEMES
): LoadingTheme {
  if (themes.length === 0) {
    throw new Error("No loading themes configured.");
  }

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  if (selectedTheme == null) {
    throw new Error("No loading theme selected.");
  }

  return selectedTheme;
}

function clampLoadingProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.min(Math.max(progress, 0), 1);
}

function toPercent(value: number): string {
  return `${value.toFixed(4)}%`;
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

export function getLoadingScreenStyle(
  progress: number,
  theme: LoadingTheme
): string {
  const clampedProgress = clampLoadingProgress(progress);
  const cursorOptions = DEFAULT_LOADING_CURSOR_OPTIONS;
  const barLeft = (theme.barMask.left / LOADING_SOURCE_WIDTH) * 100;
  const barTop = (theme.barMask.top / LOADING_SOURCE_HEIGHT) * 100;
  const barBottom =
    ((LOADING_SOURCE_HEIGHT - theme.barMask.top - theme.barMask.height) /
      LOADING_SOURCE_HEIGHT) *
    100;
  const barRightInset =
    ((LOADING_SOURCE_WIDTH -
      (theme.barMask.left + theme.barMask.width * clampedProgress)) /
      LOADING_SOURCE_WIDTH) *
    100;
  const cursorX =
    ((lerp(theme.cursorPath.startX, theme.cursorPath.endX, clampedProgress) +
      theme.cursorPath.offsetX) /
      LOADING_SOURCE_WIDTH) *
    100;
  const cursorY =
    ((lerp(theme.cursorPath.startY, theme.cursorPath.endY, clampedProgress) +
      theme.cursorPath.offsetY) /
      LOADING_SOURCE_HEIGHT) *
    100;
  const cursorSize = (cursorOptions.cursorSize / LOADING_SOURCE_WIDTH) * 100;

  return [
    `--loading-progress: ${clampedProgress.toFixed(4)}`,
    `--loading-full-alpha: ${clampedProgress.toFixed(4)}`,
    `--loading-bar-layer-opacity: ${(1 - clampedProgress).toFixed(4)}`,
    `--loading-bar-left: ${toPercent(barLeft)}`,
    `--loading-bar-top: ${toPercent(barTop)}`,
    `--loading-bar-right-inset: ${toPercent(barRightInset)}`,
    `--loading-bar-bottom: ${toPercent(barBottom)}`,
    `--loading-cursor-x: ${toPercent(cursorX)}`,
    `--loading-cursor-y: ${toPercent(cursorY)}`,
    `--loading-cursor-effective-opacity: ${cursorOptions.cursorAlpha.toFixed(4)}`,
    `--loading-cursor-size: ${toPercent(cursorSize)}`,
    `--loading-cursor-alpha: ${cursorOptions.cursorAlpha.toFixed(4)}`,
  ].join("; ");
}

export function renderLoadingScreen(
  progress = 0,
  theme: LoadingTheme = selectRandomLoadingTheme()
): string {
  const clampedProgress = clampLoadingProgress(progress);

  return `
    <section
      class="c-loading-screen"
      data-loading-theme="${theme.name}"
      style="${getLoadingScreenStyle(clampedProgress, theme)}"
      role="status"
      aria-live="polite"
      aria-label="加载中"
    >
      <div class="c-loading-screen__stage">
        <img class="c-loading-screen__image" src="${theme.baseImageUrl}" alt="">
        <img class="c-loading-screen__image c-loading-screen__image--full" src="${theme.fullImageUrl}" alt="">
        <div class="c-loading-screen__progress-mask-root" aria-hidden="true">
          <img class="c-loading-screen__image c-loading-screen__progress-highlight-image" src="${theme.fullImageUrl}" alt="">
        </div>
        <div class="c-loading-screen__cursor-generated" aria-hidden="true"></div>
      </div>
      <span class="c-loading-screen__sr-progress">${Math.round(clampedProgress * 100)}%</span>
    </section>
  `;
}

export function setLoadingScreenProgress(
  loadingScreenElement: HTMLElement,
  progress: number,
  selectedTheme: LoadingTheme
): void {
  const clampedProgress = clampLoadingProgress(progress);
  const styleText = getLoadingScreenStyle(clampedProgress, selectedTheme);

  for (const declaration of styleText.split("; ")) {
    const [propertyName, propertyValue] = declaration.split(": ");
    if (propertyName != null && propertyValue != null) {
      loadingScreenElement.style.setProperty(propertyName, propertyValue);
    }
  }

  const progressElement = loadingScreenElement.querySelector<HTMLElement>(
    ".c-loading-screen__sr-progress"
  );

  if (progressElement != null) {
    progressElement.textContent = `${Math.round(clampedProgress * 100)}%`;
  }
}
