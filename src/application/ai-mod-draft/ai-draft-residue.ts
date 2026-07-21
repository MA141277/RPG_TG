import type { AiModDraft } from "./ai-mod-draft-schema";

export function collectAiDraftResidue(draft: AiModDraft): unknown[] {
  return [
    ...draft.draftResidue,
    ...draft.actionLoops.map((loop) => ({
      id: loop.id,
      type: "action-loop",
      summary: loop.label,
      source: loop,
    })),
    {
      id: "residue.theme-frame",
      type: "theme-frame",
      summary: "Original AI Mod Draft topic frame and system mappings.",
      themeFrame: draft.themeFrame,
      statMapping: draft.statMapping,
      skillMapping: draft.skillMapping,
      stages: draft.stages,
    },
  ];
}

