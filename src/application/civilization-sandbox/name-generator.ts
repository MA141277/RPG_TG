import type { CivilizationSandboxRaceId } from "../../domain/civilization-sandbox";
import { SANDBOX_RACE_TEMPLATES } from "./race-templates";

const WU_COMMON_MIDDLE_NAMES = [
  "安",
  "明",
  "成",
  "德",
  "良",
  "正",
  "文",
  "武",
  "志",
  "兴",
] as const;

const YU_REDuplicated_NAMES = [
  "晶晶",
  "臭臭",
  "晴晴",
  "甜甜",
  "苗苗",
  "圆圆",
  "宁宁",
  "欣欣",
  "田田",
  "蓉蓉",
] as const;

const CHINESE_GENERATION_SUFFIXES = [
  "二世",
  "三世",
  "四世",
  "五世",
  "六世",
  "七世",
  "八世",
  "九世",
  "十世",
] as const;

type GenerateSandboxChildNameInput = {
  raceId: CivilizationSandboxRaceId;
  birthIndex: number;
  usedNames: readonly string[];
};

function createFallbackName(
  raceId: CivilizationSandboxRaceId,
  usedNames: readonly string[]
): string {
  const founderName = SANDBOX_RACE_TEMPLATES[raceId].founderName;
  const usedNameSet = new Set(usedNames);

  for (const suffix of CHINESE_GENERATION_SUFFIXES) {
    const candidate = `${founderName}${suffix}`;
    if (!usedNameSet.has(candidate)) {
      return candidate;
    }
  }

  return `${founderName}${usedNames.length + 2}世`;
}

function findUnusedCandidate(
  candidates: readonly string[],
  birthIndex: number,
  usedNames: readonly string[]
): string | null {
  const usedNameSet = new Set(usedNames);

  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidate = candidates[(birthIndex + offset) % candidates.length];
    if (candidate != null && !usedNameSet.has(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function generateSandboxChildName(
  input: GenerateSandboxChildNameInput
): string {
  if (input.raceId === "wu-tong") {
    const candidate = findUnusedCandidate(
      WU_COMMON_MIDDLE_NAMES.map((middleName) => `吴${middleName}同`),
      input.birthIndex,
      input.usedNames
    );
    return candidate ?? createFallbackName(input.raceId, input.usedNames);
  }

  if (input.raceId === "yu-qingqing") {
    const candidate = findUnusedCandidate(
      YU_REDuplicated_NAMES.map((childName) => `于${childName}`),
      input.birthIndex,
      input.usedNames
    );
    return candidate ?? createFallbackName(input.raceId, input.usedNames);
  }

  const candidate = findUnusedCandidate(
    Array.from({ length: 99 }, (_, index) => `陈${index + 1}晗`),
    input.birthIndex,
    input.usedNames
  );
  if (candidate != null) {
    return candidate;
  }

  return createFallbackName(input.raceId, input.usedNames);
}
