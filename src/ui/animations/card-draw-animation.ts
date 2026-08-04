import type { CardDrawSoundPlayer } from "../../domain/card-draw-sound";

export type CardDrawPhase = "idle" | "shake" | "lift" | "flip" | "settle" | "done";

export type CardDrawTimings = {
  shakeMs: number;
  liftMs: number;
  flipMs: number;
  settleMs: number;
};

export type CardDrawValueResolver = (values: readonly number[]) => number;
export type CardDrawResultFormatter = (value: number) => string;
export type CardDrawResultHintFormatter = (value: number, label: string) => string;

export type CardDrawPlayInput = {
  values?: readonly number[];
  resolveValue?: CardDrawValueResolver;
  questionLabel?: string;
  clickHintText?: string;
  busyHintText?: string;
  resultFormatter?: CardDrawResultFormatter;
  resultHintFormatter?: CardDrawResultHintFormatter;
};

export type CardDrawAnimatorOptions = CardDrawPlayInput & {
  host: HTMLElement;
  stackCount?: number;
  cardWidthPx?: number;
  cardHeightPx?: number;
  timings?: Partial<CardDrawTimings>;
  random?: () => number;
  soundPlayer?: CardDrawSoundPlayer;
};

type PendingPlay = {
  value: number;
  busyHintText: string;
  resultHintText: string;
  resolve: (value: number) => void;
  reject: (reason?: unknown) => void;
};

const DEFAULT_CARD_DRAW_VALUES = Object.freeze([1, 2, 3, 4, 5, 6]) as readonly number[];
const DEFAULT_CARD_DRAW_TIMINGS: CardDrawTimings = Object.freeze({
  shakeMs: 340,
  liftMs: 280,
  flipMs: 520,
  settleMs: 420,
});
const DEFAULT_QUESTION_LABEL = "?";
const DEFAULT_CLICK_HINT = "点击抽取";
const DEFAULT_BUSY_HINT = "抽取中...";

export function formatCardDrawResultLabel(value: number): string {
  switch (value) {
    case 0:
      return "零";
    case 1:
      return "一";
    case 2:
      return "二";
    case 3:
      return "三";
    case 4:
      return "四";
    case 5:
      return "五";
    case 6:
      return "六";
    case 7:
      return "七";
    case 8:
      return "八";
    case 9:
      return "九";
    default:
      return `${value}`;
  }
}

function defaultCardDrawResultHintFormatter(value: number, label: string): string {
  return `已抽到 ${label} (${value})`;
}

function mergeCardDrawTimings(input: Partial<CardDrawTimings> | undefined): CardDrawTimings {
  return {
    shakeMs: input?.shakeMs ?? DEFAULT_CARD_DRAW_TIMINGS.shakeMs,
    liftMs: input?.liftMs ?? DEFAULT_CARD_DRAW_TIMINGS.liftMs,
    flipMs: input?.flipMs ?? DEFAULT_CARD_DRAW_TIMINGS.flipMs,
    settleMs: input?.settleMs ?? DEFAULT_CARD_DRAW_TIMINGS.settleMs,
  };
}

function selectCardDrawValue(input: {
  values: readonly number[];
  resolveValue: CardDrawValueResolver | undefined;
  random: () => number;
}): number {
  if (input.resolveValue != null) {
    const resolvedValue = input.resolveValue(input.values);
    if (Number.isFinite(resolvedValue)) {
      return resolvedValue;
    }
  }

  const nextIndex = Math.max(
    0,
    Math.min(
      input.values.length - 1,
      Math.floor(input.random() * input.values.length)
    )
  );
  return input.values[nextIndex] ?? 0;
}

function setStyleDimension(
  element: HTMLElement,
  name: string,
  valuePx: number | undefined
): void {
  if (valuePx == null || !Number.isFinite(valuePx) || valuePx <= 0) {
    return;
  }

  element.style.setProperty(name, `${Math.round(valuePx)}px`);
}

export class CardDrawAnimator {
  private readonly root: HTMLElement;
  private readonly triggerButton: HTMLButtonElement;
  private readonly hint: HTMLElement;
  private readonly frontLabel: HTMLElement;
  private readonly backLabel: HTMLElement;
  private readonly random: () => number;
  private readonly defaultValues: readonly number[];
  private readonly defaultResultFormatter: CardDrawResultFormatter;
  private readonly defaultResultHintFormatter: CardDrawResultHintFormatter;
  private readonly defaultQuestionLabel: string;
  private readonly defaultClickHintText: string;
  private readonly defaultBusyHintText: string;
  private readonly timings: CardDrawTimings;
  private readonly soundPlayer: CardDrawSoundPlayer | null;
  private readonly scheduledTimeouts = new Set<ReturnType<typeof globalThis.setTimeout>>();
  private pendingPlay: PendingPlay | null = null;
  private busy = false;
  private destroyed = false;
  private sequenceToken = 0;

  constructor(input: CardDrawAnimatorOptions) {
    this.random = input.random ?? Math.random;
    this.defaultValues = input.values ?? DEFAULT_CARD_DRAW_VALUES;
    this.defaultResultFormatter = input.resultFormatter ?? formatCardDrawResultLabel;
    this.defaultResultHintFormatter =
      input.resultHintFormatter ?? defaultCardDrawResultHintFormatter;
    this.defaultQuestionLabel = input.questionLabel ?? DEFAULT_QUESTION_LABEL;
    this.defaultClickHintText = input.clickHintText ?? DEFAULT_CLICK_HINT;
    this.defaultBusyHintText = input.busyHintText ?? DEFAULT_BUSY_HINT;
    this.timings = mergeCardDrawTimings(input.timings);
    this.soundPlayer = input.soundPlayer ?? null;

    const document = input.host.ownerDocument;
    this.root = document.createElement("div");
    this.root.className = "c-card-draw";
    this.root.dataset.cardDrawPhase = "idle";

    setStyleDimension(this.root, "--card-draw-width", input.cardWidthPx);
    setStyleDimension(this.root, "--card-draw-height", input.cardHeightPx);

    this.triggerButton = document.createElement("button");
    this.triggerButton.className = "c-card-draw__stack";
    this.triggerButton.type = "button";
    this.triggerButton.disabled = true;
    this.triggerButton.setAttribute("aria-label", this.defaultClickHintText);
    this.triggerButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.trigger();
    });

    const deck = document.createElement("div");
    deck.className = "c-card-draw__deck";
    this.triggerButton.appendChild(deck);

    const stackCount = Math.max(3, Math.round(input.stackCount ?? 5));
    for (let index = 0; index < stackCount - 1; index += 1) {
      const stackCard = document.createElement("span");
      stackCard.className = "c-card-draw__card c-card-draw__card--stack";
      stackCard.dataset.cardLayer = `${index + 1}`;
      stackCard.style.setProperty("--card-layer-index", `${index + 1}`);
      deck.appendChild(stackCard);
    }

    const topCard = document.createElement("span");
    topCard.className = "c-card-draw__card c-card-draw__card--top";

    const frontFace = document.createElement("span");
    frontFace.className = "c-card-draw__card-face c-card-draw__card-face--front";
    frontFace.textContent = this.defaultQuestionLabel;
    topCard.appendChild(frontFace);

    const backFace = document.createElement("span");
    backFace.className = "c-card-draw__card-face c-card-draw__card-face--back";
    backFace.textContent = "";
    topCard.appendChild(backFace);

    deck.appendChild(topCard);

    this.hint = document.createElement("p");
    this.hint.className = "c-card-draw__hint";
    this.hint.setAttribute("aria-live", "polite");
    this.hint.textContent = this.defaultClickHintText;

    this.root.appendChild(this.triggerButton);
    this.root.appendChild(this.hint);
    input.host.appendChild(this.root);

    this.frontLabel = frontFace;
    this.backLabel = backFace;
  }

  play(input: CardDrawPlayInput = {}): Promise<number> {
    if (this.destroyed) {
      return Promise.reject(new Error("Cannot start a card draw after destroy()."));
    }
    if (this.pendingPlay != null || this.busy) {
      return Promise.reject(new Error("Card draw is already waiting or animating."));
    }

    const values =
      input.values == null || input.values.length === 0
        ? this.defaultValues
        : input.values;
    const resultFormatter = input.resultFormatter ?? this.defaultResultFormatter;
    const value = selectCardDrawValue({
      values,
      resolveValue: input.resolveValue,
      random: this.random,
    });
    const label = resultFormatter(value);
    const resultHintText = (
      input.resultHintFormatter ?? this.defaultResultHintFormatter
    )(value, label);

    this.clearScheduledSteps();
    this.sequenceToken += 1;
    this.busy = false;
    this.applyPhase("idle");
    this.applyFrontLabel(input.questionLabel ?? this.defaultQuestionLabel);
    this.applyBackLabel(label);
    this.applyHint(input.clickHintText ?? this.defaultClickHintText);
    this.triggerButton.disabled = false;
    this.triggerButton.setAttribute(
      "aria-label",
      input.clickHintText ?? this.defaultClickHintText
    );

    return new Promise<number>((resolve, reject) => {
      this.pendingPlay = {
        value,
        busyHintText: input.busyHintText ?? this.defaultBusyHintText,
        resultHintText,
        resolve,
        reject,
      };
    });
  }

  trigger(): void {
    if (this.destroyed || this.pendingPlay == null || this.busy) {
      return;
    }

    const currentPlay = this.pendingPlay;
    const token = ++this.sequenceToken;
    this.busy = true;
    this.triggerButton.disabled = true;
    this.applyHint(currentPlay.busyHintText);
    this.applyPhase("shake");
    this.playSound("shuffle");

    this.scheduleStep(token, this.timings.shakeMs, () => {
      this.applyPhase("lift");
      this.playSound("pull");
      this.scheduleStep(token, this.timings.liftMs, () => {
        this.applyPhase("flip");
        this.playSound("flip");
        this.scheduleStep(token, this.timings.flipMs, () => {
          this.applyPhase("settle");
          this.playSound("return");
          this.scheduleStep(token, this.timings.settleMs, () => {
            this.busy = false;
            this.pendingPlay = null;
            this.applyPhase("done");
            this.applyHint(currentPlay.resultHintText);
            currentPlay.resolve(currentPlay.value);
          });
        });
      });
    });
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.sequenceToken += 1;
    this.clearScheduledSteps();

    if (this.pendingPlay != null) {
      this.pendingPlay.reject(new Error("Card draw destroyed before completion."));
      this.pendingPlay = null;
    }

    this.root.remove();
  }

  private applyPhase(phase: CardDrawPhase): void {
    this.root.dataset.cardDrawPhase = phase;
  }

  private applyFrontLabel(label: string): void {
    this.frontLabel.textContent = label;
  }

  private applyBackLabel(label: string): void {
    this.backLabel.textContent = label;
  }

  private applyHint(label: string): void {
    this.hint.textContent = label;
  }

  private playSound(event: "shuffle" | "pull" | "flip" | "return"): void {
    this.soundPlayer?.play(event);
  }

  private clearScheduledSteps(): void {
    this.scheduledTimeouts.forEach((timeoutId) => globalThis.clearTimeout(timeoutId));
    this.scheduledTimeouts.clear();
  }

  private scheduleStep(
    token: number,
    delayMs: number,
    callback: () => void
  ): void {
    const timeoutId = globalThis.setTimeout(() => {
      this.scheduledTimeouts.delete(timeoutId);
      if (this.destroyed || token !== this.sequenceToken) {
        return;
      }

      callback();
    }, Math.max(0, delayMs));

    this.scheduledTimeouts.add(timeoutId);
  }
}
