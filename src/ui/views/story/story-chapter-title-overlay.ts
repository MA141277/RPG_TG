export function renderStoryChapterTitleOverlay(titleText: string): string {
  return `
    <section class="c-map-intro-overlay c-story-chapter-title-overlay" data-story-chapter-title-overlay>
      <h2 class="c-map-intro-overlay__title c-story-chapter-title-overlay__title is-animating">${titleText}</h2>
    </section>
  `;
}
