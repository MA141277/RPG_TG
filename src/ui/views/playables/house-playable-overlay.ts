import type {
  ActivePlayableSession,
  PlayablePresenterModel,
} from "../../../core/contracts/playable-runtime";
import { readDefaultPlayableShellRegistry } from "../../../core/runtime/playable-runtime-registries";

type HouseSession = {
  moduleId: string;
  state: unknown;
};

type StoredPlayableShellOverlay = {
  type: "playable-shell-result";
  presenter: PlayablePresenterModel;
};

export function renderHousePlayableOverlay(input: {
  session: ActivePlayableSession | null | undefined;
  houseSession: HouseSession | null | undefined;
}): string {
  const shellOverlay = renderActiveShellOverlay(input.session);
  if (shellOverlay.length > 0) {
    return shellOverlay;
  }

  const activePresenter = readActivePlayablePresenter(input.session);
  if (activePresenter != null) {
    return renderPlayablePresenterOverlay(activePresenter, input.session?.playableId ?? null);
  }

  const storedOverlay = readStoredPlayableShellOverlay(input.houseSession);
  if (storedOverlay != null) {
    return renderPlayablePresenterOverlay(storedOverlay.presenter, null);
  }

  return "";
}

function renderActiveShellOverlay(
  session: ActivePlayableSession | null | undefined
): string {
  if (session == null) {
    return "";
  }

  const shell = readDefaultPlayableShellRegistry().get(session.playableId);
  if (shell?.renderOverlay == null) {
    return "";
  }

  return shell.renderOverlay(session);
}

function readActivePlayablePresenter(
  session: ActivePlayableSession | null | undefined
): PlayablePresenterModel | null {
  if (session == null) {
    return null;
  }
  const shell = readDefaultPlayableShellRegistry().get(session.playableId);
  if (shell == null) {
    return null;
  }
  return shell.present(session);
}

function readStoredPlayableShellOverlay(
  houseSession: HouseSession | null | undefined
): StoredPlayableShellOverlay | null {
  const sessionState = houseSession?.state;
  if (sessionState == null || typeof sessionState !== "object" || Array.isArray(sessionState)) {
    return null;
  }
  const overlay = (sessionState as { overlay?: unknown }).overlay;
  if (overlay == null || typeof overlay !== "object" || Array.isArray(overlay)) {
    return null;
  }
  return (overlay as { type?: string }).type === "playable-shell-result"
    ? (overlay as StoredPlayableShellOverlay)
    : null;
}

function renderPlayablePresenterOverlay(
  presenter: PlayablePresenterModel,
  playableId: string | null
): string {
  return `
    <div class="c-grain-shop-overlay" data-playable-overlay="${presenter.playableId}">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        <div class="c-stage-header">
          <div>
            <p class="c-stage-header__eyebrow">玩法</p>
            <h1 class="c-stage-header__title">${presenter.title}</h1>
          </div>
        </div>
        <div class="c-house-interior">
          <div class="c-panel">
            ${presenter.summaryLines
              .map((line) => `<p>${escapeHtml(line)}</p>`)
              .join("")}
          </div>
          <div class="c-house-roster">
            ${presenter.actions
              .map(
                (action) => `
                  <button
                    class="c-button"
                    ${playableId == null ? "" : `data-playable-id="${playableId}"`}
                    data-playable-action="${action.id}"
                  >
                    ${escapeHtml(action.label)}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
