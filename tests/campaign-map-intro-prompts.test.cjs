const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveInitialCampaignMapIntroTitle,
} = require("../.test-dist/application/runtime/campaign-map-intro-prompts.js");

test("campaign map intro prompt centralizes the huai xi begging chapter title", () => {
  assert.equal(
    resolveInitialCampaignMapIntroTitle({
      textEntriesById: {
        "runtime.zhu_yuanzhang.chapter_intro.huai_xi_begging":
          "第一章·淮西托钵",
      },
    }),
    "第一章·淮西托钵"
  );
});
