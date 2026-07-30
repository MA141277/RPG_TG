const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function readSource(path) {
  return fs.readFileSync(path, "utf8");
}

test("sundeya rescue prototype scenario keeps only two player-controlled friendly teams and two yuan teams", () => {
  const source = readSource("prototypes/battle-demo/index.html");

  assert.match(
    source,
    /'sundeya-rescue': \{[\s\S]*\{ name: '朱重八本队', controller: 'player'[\s\S]*\{ name: '郭子兴中军', controller: 'player'/
  );
  assert.doesNotMatch(source, /name: '汤和队'/);
  assert.doesNotMatch(source, /name: '徐达队'/);
  assert.doesNotMatch(source, /name: '元军南哨'/);
});

test("sundeya rescue text entries describe the trimmed battle roster", () => {
  const source = readSource("src/content/scenario-packs/zhuyuanzhang/text-entries.json");

  assert.match(
    source,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.012": "既入我营，便先跟着走一遭。孙德崖一队在前路被元军两面围住，我与你各领一队前去解围，你去抢住南侧缺口，我来压住正面。"/
  );
  assert.match(
    source,
    /"battle\.story\.zhu_yuanzhang\.sundeya_rescue\.summary\.002": "郭子兴与朱重八各领一队压上，合力撕开包围；孙德崖残部由战场态势自行支撑。"/
  );
  assert.doesNotMatch(source, /汤和、徐达/);
  assert.doesNotMatch(source, /三支元军/);
});

test("sundeya rescue return scene appends the requested victory follow-up, chapter title, and thank-you popup", () => {
  const source = readSource("src/content/scenario-packs/zhuyuanzhang/scenes.json");
  const textEntries = readSource("src/content/scenario-packs/zhuyuanzhang/text-entries.json");

  assert.match(
    source,
    /"handlerId": "story\.zhu_yuanzhang\.start-sundeya-rescue-battle"[\s\S]*"textId": "scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.015"[\s\S]*"textId": "scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.016"[\s\S]*"textId": "scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.017"[\s\S]*"textId": "scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.018"[\s\S]*"handlerId": "story\.show-chapter-title"[\s\S]*"title": "感谢您的游玩"/
  );
  assert.match(
    textEntries,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.016": "这次大家的表现都很英勇"/
  );
  assert.match(
    textEntries,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.017": "英勇个屁，我的弟兄们都快被元军砍成臊子了，你郭子兴的人才来"/
  );
  assert.match(
    textEntries,
    /"scene\.story\.zhu_yuanzhang\.haozhou_return_encounter\.018": "看来城中义军将帅不和并非传闻啊"/
  );
});
