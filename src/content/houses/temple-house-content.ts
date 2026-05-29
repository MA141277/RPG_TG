import type { TempleHouseTaskDefinition } from "../../domain/temple-house";

export const templeHouseGreetingLines = [
  "跨进寺门，木鱼声和香火气扑面而来，住持已在廊下等你。",
  "庙里不问刀兵先后，但乱世中的人，总要先安定心神。",
];

export const templeHouseOpenLines = [
  "住持合十而立，示意你把近来的烦忧和打算慢慢说来。",
  "求签可问前路，布施可积香火。若心还乱，先坐下听钟声也无妨。",
];

export const templeHouseMeetingIntroLines = [
  "住持召集寺中僧众，在偏殿前点起一炉清香。",
  "“今日本寺评定，不论修行深浅，先看你这段时日做了多少实事。”",
];

export const templeHouseMeetingReflectionLines = [
  "住持翻过记事木牍，缓缓说道：“乱世里守住本心，比背熟经卷更难。”",
  "“寺里缺人手，也缺米粮。你既在庙中，就该担起眼前这一份。”",
];

export const templeHouseTaskDefinitions: TempleHouseTaskDefinition[] = [
  {
    id: "beg-alms",
    missionId: "mission.temple.beg-alms",
    title: "下乡化缘",
    briefing: "跟着寺中老僧去周边乡里化缘，换些米面回来接济寺众与灾民。",
    orderLines: [
      "“先去化缘，不是替自己求食，是替庙里和乡民留一口活路。”",
      "“记着言语谦和，能求一升是一升，莫起争心。”",
    ],
  },
  {
    id: "copy-scripture",
    missionId: "mission.temple.copy-scripture",
    title: "抄写经卷",
    briefing: "在偏殿抄录残缺经卷，顺便替住持整理寺中旧账与香火名册。",
    orderLines: [
      "“静坐抄经，先定你的心，再定你的字。”",
      "“这桩事不见刀光，却最考验耐性。”",
    ],
  },
  {
    id: "relief-refugees",
    missionId: "mission.temple.relief-refugees",
    title: "接济灾民",
    briefing: "去山门外登记流民、分粥施药，把庙里的秩序稳住。",
    orderLines: [
      "“寺门一开，先来的不是香客，是饥民。”",
      "“你去盯着施粥和分药，莫让人群乱起来。”",
    ],
  },
];
