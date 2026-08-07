export type RenderScriptEditorLandingViewOptions = {
  hasSession: boolean;
  noticeMarkup: string;
  projectLibraryMarkup?: string;
  fileInputsMarkup: string;
};

export function renderScriptEditorLandingView({
  hasSession,
  noticeMarkup,
  projectLibraryMarkup = "",
  fileInputsMarkup,
}: RenderScriptEditorLandingViewOptions): string {
  return `
    <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器入口">
      <div class="c-script-editor-landing">
        ${noticeMarkup}

        <div class="c-script-editor-landing__actions">
          <button type="button" class="c-main-ui-json-text-button c-main-ui-json-text-button--accent" data-script-editor-action="new-project">
            新建剧本
          </button>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="open-project">
            打开草稿
          </button>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="import-pack">
            使用模板
          </button>
          ${
            hasSession
              ? `
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="continue-session">
                  继续当前项目
                </button>
              `
              : ""
          }
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="back-to-menu">
            返回
          </button>
          <button
            type="button"
            class="c-script-editor-landing__help-button"
            aria-label="帮助"
            title="帮助"
          >
            ?
          </button>
        </div>

        ${projectLibraryMarkup}
        ${fileInputsMarkup}
      </div>
    </section>
  `;
}
