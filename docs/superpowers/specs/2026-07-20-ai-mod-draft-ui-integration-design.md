# AI Mod Draft UI Integration Design

## Goal

Expose the existing AI Mod Draft topic-to-editor-project pipeline directly inside the Script Editor landing screen, so creators can generate an editable project without using command-line tools.

## Approved UI Direction

Use the existing Script Editor landing page. Add an `AI 生成项目` panel next to the existing project creation/open/template workflow. The panel collects:

- topic text
- API key as a password field
- OpenAI-compatible base URL
- model name

The API key is read only from the current form submission. It is not saved to local storage, not written into project data, and not serialized into generated project files.

## Data Flow

```text
Script Editor landing form
-> generateScriptEditorProjectFromAiTopic()
-> generateAiModDraftFromTopic()
-> normalizeAiModDraft()
-> convertAiModDraftToScriptEditorProject()
-> MainUiFlow.commitScriptEditorProject()
-> Script Editor workspace
```

The UI layer does not lower AI semantics itself. It only collects user input, calls the application service, reports errors, and opens the generated project in the existing workspace.

## Boundaries

- In scope:
  - one landing-page generation panel
  - in-memory API key use
  - direct handoff into the editor workspace
  - source/test guards that prevent persistent API key storage
- Out of scope:
  - saving API credentials
  - multi-step generation wizard
  - runtime-pack generation from AI output
  - generated JavaScript, regex, or executable logic
  - richer runtime support for AI-only residue

## Testing

Add focused coverage in `tests/ai-mod-draft.test.cjs`:

- application helper converts injected model output into a Script Editor project
- helper result does not contain the API key
- Script Editor landing source exposes topic/key/base/model fields and generation action
- UI source does not persist the API key through local storage or project serialization

Full verification remains:

- `npm run build:test`
- `node --test tests/ai-mod-draft.test.cjs`
- `npm run typecheck`
- `npm test`

