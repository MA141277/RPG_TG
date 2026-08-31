import type { HouseModuleId } from "../../domain/house-module";

type HouseRuntimeNpcPortraitHooks = {
  portraitArtClassName: string;
};

type HouseRuntimeNpcPortraitHookInput = {
  moduleId: HouseModuleId;
  characterId: string;
  name: string;
  title?: string | null;
};

type PortraitRoleMatcher = {
  portraitArtClassName: string;
  tokens: readonly string[];
};

const HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX =
  "c-house-runtime-npc-portrait-art--";

const ROLE_PORTRAIT_MATCHERS: readonly PortraitRoleMatcher[] = [
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}doctor`,
    tokens: ["郎中", "大夫", "药师", "药商", "医者", "医生", "药材", "行医"],
  },
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}monk`,
    tokens: ["住持", "方丈", "僧", "和尚", "禅", "沙弥", "僧人"],
  },
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}guard`,
    tokens: [
      "镖师",
      "镖头",
      "护卫",
      "护院",
      "守卫",
      "卫兵",
      "兵丁",
      "捕快",
      "差役",
      "巡检",
      "军士",
      "军汉",
      "校尉",
    ],
  },
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}grain-shopkeeper`,
    tokens: ["粮商", "米商", "米行", "粮行", "粮店", "米店", "米铺"],
  },
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}innkeeper`,
    tokens: ["店小二", "酒保", "跑堂", "客栈", "客店", "店家", "店主", "伙计"],
  },
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}merchant`,
    tokens: [
      "掌柜",
      "盐商",
      "商人",
      "客商",
      "行商",
      "货郎",
      "商贩",
      "买卖",
      "生意",
      "贩子",
      "商号",
      "商",
    ],
  },
  {
    portraitArtClassName: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}civilian`,
    tokens: [
      "秀才",
      "书生",
      "文士",
      "先生",
      "儒生",
      "士子",
      "学究",
      "百姓",
      "乡民",
      "旅人",
      "路人",
      "行脚",
      "闲汉",
      "游人",
      "访客",
      "客人",
    ],
  },
];

const MODULE_DEFAULT_PORTRAIT_CLASS_BY_ID: Partial<
  Record<HouseModuleId, string>
> = {
  "market-house": `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}merchant`,
  "tea-house": `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}civilian`,
  "grain-shop": `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}grain-shopkeeper`,
  "medicine-house": `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}doctor`,
  "temple-house": `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}monk`,
  tavern: `${HOUSE_RUNTIME_NPC_PORTRAIT_CLASS_PREFIX}innkeeper`,
};

function createLookupText(input: HouseRuntimeNpcPortraitHookInput): string {
  return [input.characterId, input.name, input.title ?? ""]
    .join(" ")
    .toLowerCase();
}

export function resolveHouseRuntimeNpcPortraitArtClassName(
  input: HouseRuntimeNpcPortraitHookInput
): string | null {
  const lookupText = createLookupText(input);

  for (const matcher of ROLE_PORTRAIT_MATCHERS) {
    if (
      matcher.tokens.some((token) => lookupText.includes(token.toLowerCase()))
    ) {
      return matcher.portraitArtClassName;
    }
  }

  return MODULE_DEFAULT_PORTRAIT_CLASS_BY_ID[input.moduleId] ?? null;
}

export function resolveHouseRuntimeNpcPortraitHooks(
  input: HouseRuntimeNpcPortraitHookInput
): Partial<HouseRuntimeNpcPortraitHooks> {
  const portraitArtClassName = resolveHouseRuntimeNpcPortraitArtClassName(input);

  return portraitArtClassName == null ? {} : { portraitArtClassName };
}
