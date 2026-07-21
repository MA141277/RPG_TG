export function buildAiModDraftPrompt(topic: string): string {
  return [
    "You generate JSON only for AI Mod Draft v1.",
    "Return a single JSON object with schemaVersion: 1 and kind: ai-mod-draft.",
    "Use generationScope.mode: first-stage-only.",
    "Create a Taiko-like first-stage game framework: themeFrame, statMapping, skillMapping, worldScale, stages, entities, actionLoops, dialogues, events, bindings, and draftResidue.",
    "Use these exact editable field paths: worldScale.city, worldScale.buildings, entities.player, entities.people, stages, actionLoops, dialogues, events, bindings. Do not rename these paths.",
    "Minimum editable content: exactly 1 city, at least 3 buildings, 1 player entity, at least 3 non-player people, at least 1 stage, at least 2 actionLoops, at least 2 dialogues with 2+ nodes each, at least 2 events, and at least 2 event bindings.",
    "Every event must have an id, title, stageId, and dialogue destination content. Every binding must point to an event and a concrete building owner.",
    "Events must use dialogue content where possible.",
    "Do not generate JavaScript, regex scripts, or free-form executable runtime logic.",
    "Unsupported simulations, minigames, rankings, and dynamic systems must be preserved as draftResidue.",
    `Topic: ${topic}`,
  ].join("\n");
}
