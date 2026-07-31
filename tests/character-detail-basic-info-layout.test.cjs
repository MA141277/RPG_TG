const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("character detail keeps affiliation and superior values on one line with widened primary cells", () => {
  const source = readSource("src/ui/views/character/character-detail-view.ts");
  const prototypeCss = readSource("src/styles/prototype.css");

  assert.match(
    source,
    /<div class="c-character-detail__info-row c-character-detail__info-row--paired">[\s\S]*?<span class="c-character-detail__label">所属<\/span>[\s\S]*?<strong class="c-character-detail__info-value c-character-detail__info-value--wide">\$\{options\.clanName \?\? "无"\}<\/strong>[\s\S]*?<span class="c-character-detail__label">据点<\/span>[\s\S]*?<strong class="c-character-detail__info-value">\$\{options\.cityName \?\? character\.cityId\}<\/strong>/
  );
  assert.match(
    source,
    /<div class="c-character-detail__info-row c-character-detail__info-row--paired">[\s\S]*?<span class="c-character-detail__label">上司<\/span>[\s\S]*?<strong class="c-character-detail__info-value c-character-detail__info-value--wide">\$\{options\.lordName \?\? options\.houseName \?\? "无"\}<\/strong>[\s\S]*?<span class="c-character-detail__label">俸禄<\/span>[\s\S]*?<strong class="c-character-detail__info-value">\$\{options\.stipendText \?\? `\$\{character\.stats\.gold\}贯`\}<\/strong>/
  );
  assert.match(
    prototypeCss,
    /\.c-character-detail__info-row--paired\s*\{[\s\S]*grid-template-columns:\s*16%\s+minmax\(0,\s*1\.35fr\)\s+16%\s+minmax\(0,\s*0\.9fr\);[\s\S]*gap:\s*0\s+3%;/
  );
  assert.match(
    prototypeCss,
    /\.c-character-detail__info-row--paired\s+\.c-character-detail__info-value\s*\{[\s\S]*white-space:\s*nowrap;/
  );
});
