import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sectionsPath = path.join(repositoryRoot, "generated", "history-kb", "sections.jsonl");
const rosterPath = path.join(repositoryRoot, "src", "content", "zhu-yuanzhang-early-characters.ts");
const outputDir = path.join(repositoryRoot, "generated", "history-reference");

const targetSectionIds = new Set([
  "mingshi-section-0001",
  "mingshi-section-0122",
  "mingshi-section-0127",
  "mingshi-section-0135",
]);

const candidatePeople = [
  {
    name: "刘继祖",
    suggestedFactionId: "temple_commoner",
    suggestedFactionName: "钟离乡里",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["commoner", "benefactor"],
    suggestedPriority: "P2",
    sourceUse: "朱元璋父母兄葬地恩人，适合早期乡里/皇觉寺线。",
  },
  {
    name: "李二",
    suggestedFactionId: "xuzhou_red_turban",
    suggestedFactionName: "徐州红巾余部",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["rebel-leader", "event-only"],
    suggestedPriority: "P3",
    sourceUse: "徐州红巾背景人物，可作为濠州外部压力传闻。",
  },
  {
    name: "彭大",
    suggestedFactionId: "xuzhou_red_turban",
    suggestedFactionName: "徐州红巾余部",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["rebel-leader", "commander"],
    suggestedPriority: "P1",
    sourceUse: "郭子兴被囚时出面救援，适合濠州军府强 NPC。",
  },
  {
    name: "赵均用",
    suggestedFactionId: "xuzhou_red_turban",
    suggestedFactionName: "徐州红巾余部",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["rebel-leader", "rival"],
    suggestedPriority: "P1",
    sourceUse: "与郭子兴、孙德崖冲突，适合濠州内斗线。",
  },
  {
    name: "彻里不花",
    suggestedFactionId: "yuan_haozhou",
    suggestedFactionName: "濠州元军",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["enemy", "general"],
    suggestedPriority: "P2",
    sourceUse: "濠州起兵时的元将，可作为城外元军压力。",
  },
  {
    name: "贾鲁",
    suggestedFactionId: "yuan_haozhou",
    suggestedFactionName: "濠州元军",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["enemy", "general"],
    suggestedPriority: "P2",
    sourceUse: "围濠州的元将，适合早期围城事件。",
  },
  {
    name: "费聚",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "与徐达、汤和同随朱元璋南略定远。",
  },
  {
    name: "张知院",
    suggestedFactionId: "yuan_dingyuan",
    suggestedFactionName: "定远元军",
    suggestedCityNodeId: "settlement.fenyang_province",
    suggestedRoleTags: ["enemy", "general"],
    suggestedPriority: "P3",
    sourceUse: "横涧山被袭元将，适合定远战斗事件。",
  },
  {
    name: "脱脱",
    suggestedFactionId: "yuan_court",
    suggestedFactionName: "元廷中央",
    suggestedCityNodeId: "settlement.shuntian_province",
    suggestedRoleTags: ["civil-official", "general", "enemy"],
    suggestedPriority: "P1",
    sourceUse: "元丞相，压制张士诚和江淮局势的高层背景。",
  },
  {
    name: "耿再成",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.luzhou_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "随朱元璋救六合、守江淮，适合将领池。",
  },
  {
    name: "俞通海",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.taiping_province",
    suggestedRoleTags: ["general", "navy"],
    suggestedPriority: "P1",
    sourceUse: "巢湖水师核心人物，渡江线需要。",
  },
  {
    name: "廖永安",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.taiping_province",
    suggestedRoleTags: ["general", "navy"],
    suggestedPriority: "P2",
    sourceUse: "巢湖水师人物，适合水军府邸。",
  },
  {
    name: "廖永忠",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.taiping_province",
    suggestedRoleTags: ["general", "navy"],
    suggestedPriority: "P2",
    sourceUse: "巢湖水师人物，后续水战线重要。",
  },
  {
    name: "冯国胜",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.nanchang_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "即冯胜，处理别名，避免后续重复建人。",
  },
  {
    name: "赵普胜",
    suggestedFactionId: "chen_youliang",
    suggestedFactionName: "天完/陈汉阵营",
    suggestedCityNodeId: "settlement.wuchang_province",
    suggestedRoleTags: ["general", "navy"],
    suggestedPriority: "P2",
    sourceUse: "天完水军强将，适合作为陈汉水战对手。",
  },
  {
    name: "缪大亨",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.luzhou_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "已有候选，用于校验证据。",
  },
  {
    name: "陈兆先",
    suggestedFactionId: "yuan_jiangnan",
    suggestedFactionName: "江南元军",
    suggestedCityNodeId: "settlement.yingtian_province",
    suggestedRoleTags: ["enemy", "general"],
    suggestedPriority: "P2",
    sourceUse: "朱元璋攻集庆前后的元军人物。",
  },
  {
    name: "邵荣",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.yingtian_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "早期军中大将，后续可接军府与内变线。",
  },
  {
    name: "康茂才",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.yingtian_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "陈友谅战线关键降将/诈降事件人物。",
  },
  {
    name: "陈野先",
    suggestedFactionId: "yuan_jiangnan",
    suggestedFactionName: "江南元军",
    suggestedCityNodeId: "settlement.taiping_province",
    suggestedRoleTags: ["enemy", "general"],
    suggestedPriority: "P2",
    sourceUse: "太平、采石一线元军人物。",
  },
  {
    name: "吴良",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.yingtian_province",
    suggestedRoleTags: ["general"],
    suggestedPriority: "P2",
    sourceUse: "早期守御与江阴线人物，可进将领池。",
  },
  {
    name: "吴祯",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.yingtian_province",
    suggestedRoleTags: ["general", "navy"],
    suggestedPriority: "P2",
    sourceUse: "吴良之弟，水军/守御线补位。",
  },
  {
    name: "谢再兴",
    suggestedFactionId: "zhu_yuanzhang",
    suggestedFactionName: "朱元璋早期集团",
    suggestedCityNodeId: "settlement.yingtian_province",
    suggestedRoleTags: ["general", "defector"],
    suggestedPriority: "P2",
    sourceUse: "早期明军将领，后有叛降风险，可做府邸风险人物。",
  },
];

function readSections() {
  return readFileSync(sectionsPath, "utf8")
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function collectExistingNames() {
  const rosterSource = readFileSync(rosterPath, "utf8");
  return new Set(
    [...rosterSource.matchAll(/canonicalName:\s*"([^"]+)"/g)].map((match) =>
      match[1].replace(/[?？�]/g, "")
    )
  );
}

function makeSnippet(content, name) {
  const index = content.indexOf(name);
  if (index < 0) {
    return null;
  }
  return content
    .slice(Math.max(0, index - 42), Math.min(content.length, index + 74))
    .replace(/\s+/g, "");
}

function findEvidence(sections, name) {
  return sections
    .map((section) => ({
      sectionId: section.id,
      sourceTitle: section.sourceTitle,
      path: section.path.join(" > "),
      snippet: makeSnippet(section.content, name),
    }))
    .filter((evidence) => evidence.snippet != null);
}

function writeMarkdown(records) {
  const lines = [
    "# 朱元璋早期文献人物抽取",
    "",
    "来源优先级：`明史·太祖本纪`、`明史·郭子兴韩林儿传`、`明史·李善长汪广洋传`、`明史·陈遇等传`。",
    "",
    "| 人物 | 已入项目 | 建议城市 | 建议势力 | 用途 | 证据 |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const record of records) {
    const evidence = record.evidence
      .slice(0, 2)
      .map((item) => `${item.sourceTitle}/${item.path}：${item.snippet}`)
      .join("<br>");
    lines.push(
      `| ${record.name} | ${record.alreadyInRoster ? "是" : "否"} | ${record.suggestedCityNodeId} | ${record.suggestedFactionName} | ${record.sourceUse} | ${evidence} |`
    );
  }

  return `${lines.join("\n")}\n`;
}

const sections = readSections().filter((section) => targetSectionIds.has(section.id));
const existingNames = collectExistingNames();

const records = candidatePeople
  .map((candidate) => ({
    ...candidate,
    alreadyInRoster: existingNames.has(candidate.name),
    evidence: findEvidence(sections, candidate.name),
  }))
  .filter((record) => record.evidence.length > 0)
  .sort((left, right) => Number(left.alreadyInRoster) - Number(right.alreadyInRoster));

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  path.join(outputDir, "zhu-yuanzhang-reference-people.json"),
  `${JSON.stringify(records, null, 2)}\n`,
  "utf8"
);
writeFileSync(
  path.join(outputDir, "zhu-yuanzhang-reference-people.md"),
  writeMarkdown(records),
  "utf8"
);

const missingCount = records.filter((record) => !record.alreadyInRoster).length;
console.log(
  `Extracted ${records.length} referenced people from ${sections.length} sections; ${missingCount} are not in the current roster.`
);
