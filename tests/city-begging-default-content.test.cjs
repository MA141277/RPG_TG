const test = require("node:test");
const assert = require("node:assert/strict");

test("city begging default content contains three fixed Haozhou locations with three options each", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  assert.equal(CITY_BEGGING_DEFAULT_LOCATIONS.length, 3);
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.locationId),
    ["dongshi_mishi", "xicheng_guanyin", "beicheng_ciji"]
  );
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.baselineResult),
    ["xiong", "ping", "ji"]
  );

  for (const location of CITY_BEGGING_DEFAULT_LOCATIONS) {
    assert.equal(location.options.length, 3, location.locationId);
    assert.ok(location.encounterText.length > 20, location.locationId);
    assert.ok(location.closingText.length > 0, location.locationId);
    assert.ok(typeof location.backgroundId === "string");
  }
});

test("city begging default options lock the requested fixed fortune table", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  const table = Object.fromEntries(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => [
      location.locationId,
      location.options.map((option) => option.fixedResult),
    ])
  );

  assert.deepEqual(table, {
    dongshi_mishi: ["xiong", "xiong", "xiong"],
    xicheng_guanyin: ["ping", "ping", "ji"],
    beicheng_ciji: ["ji", "ji", "ping"],
  });
});

test("city begging default content preserves exact requested Chinese copy", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  const [dongshi, xicheng, beicheng] = CITY_BEGGING_DEFAULT_LOCATIONS;

  assert.equal(
    dongshi.encounterText,
    "你挤进米市街。粮铺前人头攒动，掌柜的算盘打得噼啪响。你这一身僧衣在铜臭里格外扎眼，几个伙计已经拿眼角剜你。街口一个挺着肚子的粮商，正指挥人搬米，见你捧钵凑近，脸一沉。"
  );
  assert.equal(dongshi.options[0].optionText, "上前合掌，朗声化缘");
  assert.equal(
    dongshi.options[0].outcomeText,
    '你话音未落，粮商把手一挥："哪来的野和尚，晦气！赶明儿都来讨，我这米铺还开不开了？"伙计一拥而上，连推带搡把你轰出老远，钵盂磕在石阶上，豁口又大了一圈。'
  );
  assert.equal(
    dongshi.options[0].settlementText,
    "〔结算〕米 +0；💢 威严 -1（当众受辱）；🩹 轻伤（被推搡跌地，体力 -1）；flag：〔米市街·恶商〕结怨。"
  );
  assert.equal(dongshi.closingText, "〔米市街这一趟，处处碰壁。〕");

  assert.equal(
    xicheng.encounterText,
    "你拐进观音巷，青石板缝里长着草。晌午光景，多数人家闭着门。巷尾一扇柴门半开，一个正补渔网的老汉抬头看你一眼，没赶你走，也没起身。"
  );
  assert.equal(xicheng.options[2].optionText, "主动搭话，帮他补网");
  assert.equal(
    xicheng.options[2].outcomeText,
    '你放下钵盂，蹲下接过梭子——放牛时学过的手艺竟还利索。补完大半张网，老汉眉头舒开，端出半碗糙米、两条鱼干："出家人还肯下力气，难得。乱世里，能帮一把是一把。"'
  );
  assert.equal(
    xicheng.options[2].settlementText,
    "〔结算〕🍚 糙米 +0.5 升、🐟 鱼干 ×2；💪 体魄 +1；🤝〔观音巷·渔叟〕好感 +2（结缘·flag 记）；✨ 觉悟 +1。"
  );
  assert.equal(xicheng.closingText, "〔观音巷人心尚软，出力者得善报。〕");

  assert.equal(
    beicheng.encounterText,
    '你行至城北，慈济庵的粉墙剥落，门楣上香火冷清。一个老尼正扫着落叶，见你僧衣钵盂，双手合十念了声佛："同是佛门中人，师弟这是游方到此?"眉眼间带着几分照拂之意。'
  );
  assert.equal(beicheng.options[1].optionText, "请求在庵中借宿抄经");
  assert.equal(
    beicheng.options[1].outcomeText,
    "你言愿以抄经、洒扫换一宿安歇。老尼颔首，取出旧经卷。你就着油灯抄了半夜——竟也认得大半，笔画渐熟。"
  );
  assert.equal(
    beicheng.options[1].settlementText,
    '〔结算〕🛏️ 借宿（体力全复）；📖 识字 +1（呼应老者"识得几个字多些本事"）；✨ 觉悟 +1；好感 +1。'
  );
  assert.equal(beicheng.closingText, "〔慈济庵同门相怜，最是安稳去处。〕");
});

test("getCityBeggingDefaultLocation returns a matching location or null", async () => {
  const { getCityBeggingDefaultLocation } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  assert.equal(getCityBeggingDefaultLocation("xicheng_guanyin")?.title, "城西 · 观音巷");
  assert.equal(getCityBeggingDefaultLocation("missing_location"), null);
});
