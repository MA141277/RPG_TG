import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(repositoryRoot, "generated", "yuanmo-person-pool");

const sourcePaths = {
  yuanmoNpcs: path.join(repositoryRoot, "generated", "yuanmo-npcs.json"),
  historySections: path.join(repositoryRoot, "generated", "history-kb", "sections.jsonl"),
  curatedCharacters: path.join(repositoryRoot, "src", "content", "zhu-yuanzhang-early-characters.ts"),
};

const factionLabels = {
  byzantium: "元廷中央",
  papal_states: "朱元璋早期集团",
  milan: "方国珍浙东",
  sicily: "明玉珍夏",
  scotland: "张士诚周",
  hre: "陕西甘肃元军",
  france: "陕西地方势力",
  moors: "辽东/东北元军",
  turks: "察罕帖木儿/扩廓帖木儿系",
  denmark: "陈友定福建",
  spain: "福建/江西势力",
  venice: "江南地方势力",
  russia: "北方元军",
  mongols: "蒙古诸王",
  portugal: "水师/海上势力",
  saxons: "地方豪强",
  aztecs: "西南地方势力",
  poland: "江淮势力",
  kazakh: "西北边军",
  england: "红巾余部",
  hungary: "地方军府",
  normans: "江南文士",
  egypt: "陈友谅汉",
  timurids: "西域/边外势力",
  maratha: "南方地方势力",
  slave: "民间/功能角色",
};

const sourceWeights = {
  curated: 100,
  mod: 70,
  historyHeading: 55,
  historyMention: 35,
};

const excludedNameParts = [
  "卷",
  "本纪",
  "列传",
  "志",
  "表",
  "序",
  "目录",
  "附",
  "忠臣",
  "两庙",
  "太祖",
  "成祖",
  "仁宗",
  "宣宗",
  "英宗",
  "代宗",
  "宪宗",
  "孝宗",
  "武宗",
  "世宗",
  "穆宗",
  "神宗",
  "光宗",
  "熹宗",
  "庄烈",
  "皇帝",
  "皇后",
  "诸王",
  "公主",
  "功臣",
  "外戚",
  "宦官",
  "儒林",
  "文苑",
  "忠义",
  "孝义",
  "隐逸",
  "方伎",
  "列女",
  "土司",
  "外国",
  "鞑靼",
  "瓦剌",
  "西域",
  "南昌",
  "云南",
  "四川",
  "河南",
  "山东",
  "浙江",
  "福建",
  "江西",
  "湖广",
  "陕西",
  "山西",
  "北平",
  "南京",
  "中书",
  "平章",
  "丞相",
  "尚书",
  "侍郎",
  "御史",
  "都督",
  "元帅",
  "知府",
  "指挥",
  "教授",
  "先生",
  "夫人",
  "氏",
  "从弟",
  "从父",
  "从孙",
  "从子",
  "从祖",
  "子",
  "弟",
  "兄",
  "父",
  "母",
  "妻",
  "女",
  "后",
  "等",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "两",
];

const commonHanSurnames = new Set([
  "赵",
  "钱",
  "孙",
  "李",
  "周",
  "吴",
  "郑",
  "王",
  "冯",
  "陈",
  "褚",
  "卫",
  "蒋",
  "沈",
  "韩",
  "杨",
  "朱",
  "秦",
  "尤",
  "许",
  "何",
  "吕",
  "施",
  "张",
  "孔",
  "曹",
  "严",
  "华",
  "金",
  "魏",
  "陶",
  "姜",
  "戚",
  "谢",
  "邹",
  "喻",
  "柏",
  "水",
  "窦",
  "章",
  "云",
  "苏",
  "潘",
  "葛",
  "奚",
  "范",
  "彭",
  "郎",
  "鲁",
  "韦",
  "昌",
  "马",
  "苗",
  "凤",
  "花",
  "方",
  "俞",
  "任",
  "袁",
  "柳",
  "鲍",
  "史",
  "唐",
  "费",
  "廉",
  "岑",
  "薛",
  "雷",
  "贺",
  "倪",
  "汤",
  "滕",
  "殷",
  "罗",
  "毕",
  "郝",
  "邬",
  "安",
  "常",
  "乐",
  "于",
  "傅",
  "皮",
  "卞",
  "齐",
  "康",
  "伍",
  "余",
  "元",
  "卜",
  "顾",
  "孟",
  "平",
  "黄",
  "和",
  "穆",
  "萧",
  "尹",
]);

const weakSurnameBoundaryChars = new Set(["常", "乐", "和", "平", "安", "方", "花"]);

function slugify(value) {
  return [...value]
    .map((char) => {
      const code = char.codePointAt(0);
      if (code == null) {
        return "";
      }
      if (/[a-z0-9]/i.test(char)) {
        return char.toLowerCase();
      }
      return code.toString(16);
    })
    .filter(Boolean)
    .join("-");
}

function cleanName(name) {
  return name
    .replace(/[☆★※〖〗【】（）()·,，。；：:、\s]/g, "")
    .replace(/孛儿只斤$/, "孛儿只斤")
    .trim();
}

function isLikelyPersonName(name) {
  if (!/^[\u4e00-\u9fff·]{2,8}$/.test(name)) {
    return false;
  }
  if (name.length < 2 || name.length > 8) {
    return false;
  }
  if (name.endsWith("等")) {
    return false;
  }
  return !excludedNameParts.some((part) => name.includes(part));
}

function splitPossibleNameToken(token) {
  const cleaned = cleanName(token);
  const surnameBoundaryParts = [];
  let cursor = 0;
  for (let index = 1; index < cleaned.length; index += 1) {
    if (
      commonHanSurnames.has(cleaned[index]) &&
      !weakSurnameBoundaryChars.has(cleaned[index]) &&
      index - cursor >= 2
    ) {
      surnameBoundaryParts.push(cleaned.slice(cursor, index));
      cursor = index;
    }
  }
  if (surnameBoundaryParts.length > 0) {
    surnameBoundaryParts.push(cleaned.slice(cursor));
    return surnameBoundaryParts;
  }

  if (cleaned.length <= 4) {
    if (
      cleaned.length === 4 &&
      commonHanSurnames.has(cleaned[0]) &&
      commonHanSurnames.has(cleaned[2])
    ) {
      return [cleaned.slice(0, 2), cleaned.slice(2)];
    }
    return [cleaned];
  }

  const names = [];
  for (const size of [4, 3, 2]) {
    for (let index = 0; index <= cleaned.length - size; index += size) {
      const part = cleaned.slice(index, index + size);
      if (isLikelyPersonName(part)) {
        names.push(part);
      }
    }
    if (names.length > 0) {
      return names;
    }
  }

  return [cleaned];
}

function readHistorySections() {
  const text = readFileSync(sourcePaths.historySections, "utf8").trim();
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function parseCuratedCharacters() {
  const source = readFileSync(sourcePaths.curatedCharacters, "utf8");
  const records = [];
  for (const match of source.matchAll(/id:\s*"([^"]+)"[\s\S]*?canonicalName:\s*"([^"]+)"/g)) {
    const id = match[1];
    const canonicalName = cleanName(match[2]);
    if (!isLikelyPersonName(canonicalName)) {
      continue;
    }
    records.push({
      id: `pool.curated.${id.replace(/^zyz\.character\./, "")}`,
      canonicalName,
      displayName: canonicalName,
      aliases: [],
      sourceTypes: ["curated"],
      sourceRefs: [
        {
          type: "curated",
          path: "src/content/zhu-yuanzhang-early-characters.ts",
          sourceId: id,
        },
      ],
      confidence: "high",
      importance: "core",
      eraTags: ["yuanmo-mingchu"],
      factionLabel: "项目精选人物",
      roleLabels: ["已策划角色"],
      cityHints: [],
      isPlayableNpcCandidate: true,
      isLeaderResidenceCandidate: true,
      notes: "已进入朱元璋早期精选表。",
    });
  }
  return records;
}

function roleLabelsFromModNpc(npc) {
  const labels = [];
  if (npc.isLeader) {
    labels.push("势力首领");
  }
  if (npc.isHeir) {
    labels.push("继承人");
  }
  if (npc.role?.includes("named")) {
    labels.push("具名人物");
  }
  if (npc.traits?.some((trait) => /^LEADER/i.test(trait.id))) {
    labels.push("统治者");
  }
  if (labels.length === 0) {
    labels.push("开局角色");
  }
  return labels;
}

function parseModNpcs() {
  const npcs = JSON.parse(readFileSync(sourcePaths.yuanmoNpcs, "utf8"));
  return npcs
    .filter((npc) => npc.name != null && String(npc.name).trim().length > 0)
    .map((npc) => {
      const canonicalName = cleanName(npc.name);
      return {
        id: `pool.mod.${slugify(npc.id)}`,
        canonicalName,
        displayName: canonicalName,
        aliases: [npc.sourceName, npc.epithet].filter(Boolean),
        sourceTypes: ["mod"],
        sourceRefs: [
          {
            type: "mod",
            path: "generated/yuanmo-npcs.json",
            sourceId: npc.id,
            sourceName: npc.sourceName,
          },
        ],
        confidence: npc.role === "named character" ? "high" : "medium",
        importance: npc.isLeader ? "major" : npc.isHeir ? "notable" : "ordinary",
        eraTags: ["yuanmo-mingchu"],
        factionLabel: factionLabels[npc.faction] ?? npc.faction,
        roleLabels: roleLabelsFromModNpc(npc),
        cityHints: Number.isFinite(npc.x) && Number.isFinite(npc.y) ? [{ x: npc.x, y: npc.y }] : [],
        isPlayableNpcCandidate: npc.role === "named character",
        isLeaderResidenceCandidate: npc.isLeader || npc.isHeir || npc.role === "named character",
        notes: npc.biography ?? "",
      };
    })
    .filter((record) => isLikelyPersonName(record.canonicalName));
}

function candidateNamesFromText(text) {
  const normalized = text
    .replace(/\([^)]*附[^)]*\)/g, " ")
    .replace(/\([^)]*(?:弟|养子|子|从弟|从父|从子)[^)]*\)/g, " ")
    .replace(/[《》◎、，。；：？！“”‘’（）()【】\[\]{}<>]/g, " ")
    .replace(/\s+/g, " ");
  const names = new Set();

  for (const token of normalized.split(" ")) {
    for (const name of splitPossibleNameToken(token)) {
      if (isLikelyPersonName(name)) {
        names.add(name);
      }
    }
  }

  return [...names];
}

function parseHistoryPeople() {
  const records = [];
  const sections = readHistorySections();

  for (const section of sections) {
    const mingshiSectionNumber = Number.parseInt(section.id.match(/mingshi-section-(\d+)/)?.[1] ?? "", 10);
    const isEarlyMingshiSection =
      section.sourceTitle === "明史" &&
      Number.isFinite(mingshiSectionNumber) &&
      (mingshiSectionNumber <= 2 ||
        (mingshiSectionNumber >= 122 && mingshiSectionNumber <= 146));
    const isMingshiBiography = isEarlyMingshiSection && section.heading.includes("列传");
    const isGuochuEntry = section.sourceTitle === "国初群雄事略" && section.path.length > 1;
    if (!isMingshiBiography && !isGuochuEntry) {
      continue;
    }

    const firstContentLine =
      section.content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line.length > 0) ?? "";
    const entryTitle = section.path.at(-1) ?? section.heading;
    const headingText = isMingshiBiography
      ? firstContentLine.slice(0, 220)
      : `${entryTitle} ${firstContentLine.slice(0, 160)}`;
    const headingNames = candidateNamesFromText(headingText);

    for (const name of headingNames) {
      records.push({
        id: `pool.history-heading.${slugify(section.id)}.${slugify(name)}`,
        canonicalName: name,
        displayName: name,
        aliases: [],
        sourceTypes: ["historyHeading"],
        sourceRefs: [
          {
            type: "historyHeading",
            path: "generated/history-kb/sections.jsonl",
            sourceTitle: section.sourceTitle,
            sectionId: section.id,
            heading: section.heading,
          },
        ],
        confidence: "medium",
        importance: isMingshiBiography ? "notable" : "ordinary",
        eraTags: ["yuanmo-mingchu"],
        factionLabel: "待分类",
        roleLabels: ["文献标题/篇首人物"],
        cityHints: [],
        isPlayableNpcCandidate: true,
        isLeaderResidenceCandidate: false,
        notes: `${section.sourceTitle} / ${section.path.join(" > ")}`,
      });
    }
  }

  return records;
}

function recordWeight(record) {
  return record.sourceTypes.reduce((sum, type) => sum + (sourceWeights[type] ?? 0), 0);
}

function mergeRecords(records) {
  const byName = new Map();
  for (const record of records) {
    const key = cleanName(record.canonicalName);
    if (!isLikelyPersonName(key)) {
      continue;
    }
    const existing = byName.get(key);
    if (existing == null) {
      byName.set(key, { ...record, canonicalName: key, displayName: key });
      continue;
    }

    existing.aliases = [...new Set([...existing.aliases, ...record.aliases].filter(Boolean))];
    existing.sourceTypes = [...new Set([...existing.sourceTypes, ...record.sourceTypes])];
    existing.sourceRefs.push(...record.sourceRefs);
    existing.roleLabels = [...new Set([...existing.roleLabels, ...record.roleLabels])];
    existing.cityHints.push(...record.cityHints);
    existing.isPlayableNpcCandidate ||= record.isPlayableNpcCandidate;
    existing.isLeaderResidenceCandidate ||= record.isLeaderResidenceCandidate;

    if (recordWeight(record) > recordWeight(existing)) {
      existing.id = record.id;
      existing.factionLabel = record.factionLabel;
      existing.importance = record.importance;
      existing.confidence = record.confidence;
      existing.notes = record.notes;
    }
  }

  return [...byName.values()].sort((left, right) => {
    const weightDelta = recordWeight(right) - recordWeight(left);
    if (weightDelta !== 0) {
      return weightDelta;
    }
    return left.canonicalName.localeCompare(right.canonicalName, "zh-Hans-CN");
  });
}

function summarize(records) {
  const bySource = {};
  const byConfidence = {};
  const byImportance = {};
  const byFaction = {};

  for (const record of records) {
    for (const type of record.sourceTypes) {
      bySource[type] = (bySource[type] ?? 0) + 1;
    }
    byConfidence[record.confidence] = (byConfidence[record.confidence] ?? 0) + 1;
    byImportance[record.importance] = (byImportance[record.importance] ?? 0) + 1;
    byFaction[record.factionLabel] = (byFaction[record.factionLabel] ?? 0) + 1;
  }

  return {
    total: records.length,
    playableNpcCandidates: records.filter((record) => record.isPlayableNpcCandidate).length,
    leaderResidenceCandidates: records.filter((record) => record.isLeaderResidenceCandidate).length,
    bySource,
    byConfidence,
    byImportance,
    topFactions: Object.entries(byFaction)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 20)
      .map(([label, count]) => ({ label, count })),
  };
}

function sortByGameReadiness(left, right) {
  const sourceScore = (record) => {
    let score = 0;
    if (record.sourceTypes.includes("curated")) {
      score += 1000;
    }
    if (record.sourceTypes.includes("mod")) {
      score += 700;
    }
    if (record.sourceTypes.includes("historyHeading")) {
      score += 400;
    }
    if (record.importance === "core") {
      score += 300;
    }
    if (record.importance === "major") {
      score += 220;
    }
    if (record.importance === "notable") {
      score += 150;
    }
    if (record.confidence === "high") {
      score += 120;
    }
    if (record.confidence === "medium") {
      score += 60;
    }
    if (record.isLeaderResidenceCandidate) {
      score += 40;
    }
    if (record.isPlayableNpcCandidate) {
      score += 20;
    }
    return score;
  };

  const scoreDelta = sourceScore(right) - sourceScore(left);
  if (scoreDelta !== 0) {
    return scoreDelta;
  }
  return left.canonicalName.localeCompare(right.canonicalName, "zh-Hans-CN");
}

function selectAcceptedPool(records, targetCount) {
  const accepted = [];
  const seen = new Set();
  const sorted = [...records].sort(sortByGameReadiness);

  for (const record of sorted) {
    if (accepted.length >= targetCount) {
      break;
    }
    if (seen.has(record.canonicalName)) {
      continue;
    }
    if (
      !record.sourceTypes.includes("curated") &&
      !record.sourceTypes.includes("mod") &&
      !record.sourceTypes.includes("historyHeading")
    ) {
      continue;
    }
    accepted.push({
      ...record,
      poolStatus: "accepted",
    });
    seen.add(record.canonicalName);
  }

  const review = sorted
    .filter((record) => !seen.has(record.canonicalName))
    .map((record) => ({
      ...record,
      poolStatus: "review",
    }));

  return { accepted, review };
}

function writeMarkdown(records, summary) {
  const lines = [
    "# 元末明初时代人物池",
    "",
    "这个文件是作者期/生成期人物池，不是运行时按字符串猜测人物。运行时应读取这里已经物化的字段。",
    "",
    `- 总人数：${summary.total}`,
    `- 城市 NPC 候选：${summary.playableNpcCandidates}`,
    `- 将领府邸/府邸候选：${summary.leaderResidenceCandidates}`,
    "",
    "## 来源统计",
    "",
    ...Object.entries(summary.bySource).map(([source, count]) => `- ${source}: ${count}`),
    "",
    "## 势力/类别 Top 20",
    "",
    ...summary.topFactions.map((item) => `- ${item.label}: ${item.count}`),
    "",
    "## 前 120 人预览",
    "",
    "| 人物 | 重要度 | 可信度 | 势力/类别 | 角色标签 | 来源 |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const record of records.slice(0, 120)) {
    lines.push(
      `| ${record.canonicalName} | ${record.importance} | ${record.confidence} | ${record.factionLabel} | ${record.roleLabels.join("、")} | ${record.sourceTypes.join("、")} |`
    );
  }

  return `${lines.join("\n")}\n`;
}

const records = mergeRecords([
  ...parseCuratedCharacters(),
  ...parseModNpcs(),
  ...parseHistoryPeople(),
]);
const summary = summarize(records);
const { accepted, review } = selectAcceptedPool(records, 500);
const acceptedSummary = summarize(accepted);
const reviewSummary = summarize(review);

mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "person-pool.json"), `${JSON.stringify(records, null, 2)}\n`, "utf8");
writeFileSync(path.join(outputDir, "accepted-person-pool.json"), `${JSON.stringify(accepted, null, 2)}\n`, "utf8");
writeFileSync(path.join(outputDir, "review-person-pool.json"), `${JSON.stringify(review, null, 2)}\n`, "utf8");
writeFileSync(path.join(outputDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(path.join(outputDir, "accepted-summary.json"), `${JSON.stringify(acceptedSummary, null, 2)}\n`, "utf8");
writeFileSync(path.join(outputDir, "review-summary.json"), `${JSON.stringify(reviewSummary, null, 2)}\n`, "utf8");
writeFileSync(path.join(outputDir, "README.md"), writeMarkdown(records, summary), "utf8");

console.log(`Built Yuan-Mo person pool: ${summary.total} people.`);
console.log(`Accepted game-ready pool: ${acceptedSummary.total} people.`);
console.log(`Review pool: ${reviewSummary.total} people.`);
console.log(`Playable NPC candidates: ${summary.playableNpcCandidates}.`);
console.log(`Leader residence candidates: ${summary.leaderResidenceCandidates}.`);
