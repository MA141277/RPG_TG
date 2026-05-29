import { readFileSync } from "node:fs";

const acceptedPath = new URL("../generated/yuanmo-person-pool/accepted-person-pool.json", import.meta.url);
const reviewPath = new URL("../generated/yuanmo-person-pool/review-person-pool.json", import.meta.url);

const accepted = JSON.parse(readFileSync(acceptedPath, "utf8"));
const review = JSON.parse(readFileSync(reviewPath, "utf8"));

const blockedNameParts = [
  "本纪",
  "列传",
  "皇帝",
  "皇后",
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
  "从弟",
  "从父",
  "从子",
  "曾孙",
  "忠臣",
  "两庙",
  "南昌",
  "等",
];

const errors = [];
const names = new Set();

if (accepted.length < 500) {
  errors.push(`Accepted pool is below target: ${accepted.length} < 500.`);
}

for (const record of accepted) {
  if (names.has(record.canonicalName)) {
    errors.push(`Duplicate accepted name: ${record.canonicalName}.`);
  }
  names.add(record.canonicalName);

  if (!/^[\u4e00-\u9fff·]{2,8}$/.test(record.canonicalName)) {
    errors.push(`Invalid accepted name shape: ${record.canonicalName}.`);
  }

  if (/^[一二三四五六七八九十两]+$/.test(record.canonicalName)) {
    errors.push(`Numeral-only accepted name: ${record.canonicalName}.`);
  }

  for (const blockedPart of blockedNameParts) {
    if (record.canonicalName.includes(blockedPart)) {
      errors.push(`Accepted name contains blocked part "${blockedPart}": ${record.canonicalName}.`);
    }
  }

  if (!Array.isArray(record.sourceRefs) || record.sourceRefs.length === 0) {
    errors.push(`Accepted record lacks source refs: ${record.canonicalName}.`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Validated Yuan-Mo person pool: ${accepted.length} accepted, ${review.length} review candidates.`
);
