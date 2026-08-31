const test = require("node:test");
const assert = require("node:assert/strict");

function loadRenderer() {
  return require("../.test-dist/ui/views/house/fallback-house-view.js");
}

test("fallback non-module house renderer emits shared NPC interaction target/context attributes for every roster actor", () => {
  const { renderFallbackHouseView } = loadRenderer();

  const markup = renderFallbackHouseView({
    houseId: "house.fallback",
    title: "旧屋",
    backButtonLabel: "返回濠州",
    roster: [
      {
        characterId: "char.fallback.old-zhou",
        name: "老周",
        title: "掌柜",
      },
      {
        characterId: "char.fallback.ashun",
        name: "阿顺",
      },
    ],
  });

  assert.match(markup, /data-npc-target="char\.fallback\.old-zhou"/u);
  assert.match(markup, /data-npc-target="char\.fallback\.ashun"/u);
  assert.match(
    markup,
    /data-npc-context="\{&quot;type&quot;:&quot;house&quot;,&quot;houseId&quot;:&quot;house\.fallback&quot;\}"/u
  );
  assert.match(markup, /aria-label="与 老周 交谈"/u);
  assert.match(markup, /aria-label="与 阿顺 交谈"/u);
});
