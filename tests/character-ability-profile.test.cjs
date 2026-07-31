const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const {
  buildCharacterDetailAbilityValues,
} = require("../.test-dist/application/character/character-ability-profile.js");
const {
  prototypeCharacters,
} = require("../.test-dist/content/prototype-world.js");

function getPlayerCharacter() {
  const player = prototypeCharacters.find((character) => character.id === "char.player");
  assert.ok(player, "expected prototype player character");
  return player;
}

test("zhu yuanzhang starts with low early-game core abilities and zero reputation", () => {
  const player = getPlayerCharacter();

  assert.deepEqual(
    {
      martial: player.stats.martial,
      intelligence: player.stats.intelligence,
      politics: player.stats.politics,
      charm: player.stats.charm,
      fame: player.stats.fame,
    },
    {
      martial: 54,
      intelligence: 58,
      politics: 38,
      charm: 59,
      fame: 0,
    }
  );
});

test("zhu yuanzhang ability detail values come from semantic minor attributes", () => {
  const player = getPlayerCharacter();

  assert.deepEqual(buildCharacterDetailAbilityValues(player), {
    martial: 54,
    strength: 18,
    physique: 20,
    agility: 16,
    intelligence: 58,
    adaptability: 22,
    judgment: 17,
    awareness: 19,
    politics: 38,
    governance: 10,
    livelihood: 15,
    finance: 13,
    charm: 59,
    presence: 21,
    learning: 16,
    eloquence: 22,
  });
});

test("app render passes semantic minor ability values into the character detail view", () => {
  const source = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(source, /buildCharacterDetailAbilityValues/);
  assert.match(
    source,
    /abilityValues:\s*buildCharacterDetailAbilityValues\(playerCharacter\)/
  );
});
