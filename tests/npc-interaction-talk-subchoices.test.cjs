const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function readSource(...segments) {
  return fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");
}

test("NPC default menu keeps gift and profile under talk", () => {
  const domainSource = readSource("src", "domain", "npc-interaction.ts");

  const defaultOptionsBlock =
    domainSource.match(
      /export const NPC_INTERACTION_DEFAULT_OPTIONS:[\s\S]*?\] as const;/
    )?.[0] ?? "";

  assert.match(defaultOptionsBlock, /NPC_INTERACTION_DEFAULT_OPTION_IDS\.talk/);
  assert.doesNotMatch(
    defaultOptionsBlock,
    /NPC_INTERACTION_DEFAULT_OPTION_IDS\.profile/
  );
  assert.doesNotMatch(
    defaultOptionsBlock,
    /NPC_INTERACTION_DEFAULT_OPTION_IDS\.gift/
  );

  const talkSubOptionsBlock =
    domainSource.match(
      /export const NPC_INTERACTION_TALK_SUB_OPTIONS:[\s\S]*?\] as const;/
    )?.[0] ?? "";
  const giftIndex = talkSubOptionsBlock.indexOf(
    "NPC_INTERACTION_DEFAULT_OPTION_IDS.gift"
  );
  const profileIndex = talkSubOptionsBlock.indexOf(
    "NPC_INTERACTION_DEFAULT_OPTION_IDS.profile"
  );

  assert.ok(giftIndex >= 0);
  assert.ok(profileIndex > giftIndex);
});

test("NPC talk branch renders only subchoices and close", () => {
  const viewSource = readSource(
    "src",
    "ui",
    "components",
    "npc-interaction",
    "npc-interaction-menu.ts"
  );
  const functionStart = viewSource.indexOf(
    "export function renderNpcInteractionDialogue"
  );
  const dialogueBlock =
    functionStart < 0 ? "" : viewSource.slice(functionStart);

  assert.match(dialogueBlock, /NPC_INTERACTION_TALK_SUB_OPTIONS\.map/);
  assert.match(dialogueBlock, /data-npc-action="\$\{optionKind\}"/);
  assert.match(dialogueBlock, /data-character-id="\$\{targetCharacterId\}"/);
  assert.doesNotMatch(dialogueBlock, /data-npc-action="continue"/);
  assert.doesNotMatch(dialogueBlock, /简短交谈/);
  assert.doesNotMatch(dialogueBlock, /c-grain-shop-dialogue__npc/);
  assert.doesNotMatch(dialogueBlock, /c-grain-shop-dialogue__speaker/);

  const subChoicesIndex = dialogueBlock.indexOf("${subChoiceActions}");
  const closeIndex = dialogueBlock.indexOf('data-npc-action="close"');

  assert.ok(subChoicesIndex >= 0);
  assert.ok(closeIndex > subChoicesIndex);
});
