export function renderStoryChapterTitleOverlay(titleText: string): string {
  return `
    <section class="c-map-intro-overlay c-story-chapter-title-overlay" data-story-chapter-title-overlay>
      <div class="c-story-chapter-title-overlay__panel">
        <h2 class="c-map-intro-overlay__title c-story-chapter-title-overlay__title">${titleText}</h2>
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--gold c-story-chapter-title-overlay__dismiss"
          data-action="dismiss-story-chapter-title"
        >
          继续
        </button>
      </div>
    </section>
  `;
}
