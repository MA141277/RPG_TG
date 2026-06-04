import type { TempleHouseTaskDefinition } from "../../domain/temple-house";

export const templeHouseGreetingLines = [
  "跨进寺门，木鱼声和香火气扑面而来，住持已经在廊下等你。",
  "庙里不问刀兵先后，但乱世中的人，总要先安定心神。",
];

export const templeHouseOpenLines = [
  "住持合十而立，示意你把近来的烦忧和打算慢慢说来。",
  "求签可问前路，布施可积香火。若心还乱，先坐下听钟声也无妨。",
];

export const templeHouseRestMenuLines = [
  "寺里钟声低缓，住持让你量力歇息。",
  "乱世行路要紧，先把体力养回来，才接得住下一桩差事。",
];

export const templeHouseMeetingIntroLines = [
  "住持召集寺中僧众，在偏殿前点起一炷清香。",
  "“今日本寺评定，不论修行深浅，先看你这段时日做了多少实事。”",
];

export const templeHouseMeetingReflectionLines = [
  "住持翻过记事木牍，缓缓说道：“乱世里守住本心，比背熟经卷更难。”",
  "“寺里缺人手，也缺米粮。你既在庙中，就该担起眼前这一份。”",
];

export const templeHouseTaskDefinitions: TempleHouseTaskDefinition[] = [
  {
    id: "copy-scripture",
    missionId: "mission.temple.copy-scripture",
    title: "抄写经卷",
    briefing: "在偏殿抄录残缺经卷，顺便替住持整理寺中的旧账与香火名册。",
    orderLines: [
      "“静坐抄经，先定你的心，再定你的字。”",
      "“这桩事不见刀光，却最考验耐性。”",
    ],
  },
  {
    id: "sweep-courtyard",
    missionId: "mission.temple.sweep-courtyard",
    title: "打扫庭院",
    briefing: "清扫前殿与山门附近的落叶尘土，让寺中与来避难的人都能有个落脚处。",
    orderLines: [
      "“眼里要有活，手脚也要勤快。寺门不能每日都乱成一堆。”",
      "“扫院看似简单，能不能撑住，就看你肯不肯吃苦。”",
    ],
  },
  {
    id: "carry-water",
    missionId: "mission.temple.carry-water",
    title: "挑水",
    briefing: "从山下汲水，供寺里煮粥、洗涤与清扫使用。这是最耗力气的活。",
    orderLines: [
      "“水担挑得稳，人才能站得住。别一上来就图快，先把步子走稳。”",
      "“争不得一口气，却能挑起半寺活路。”",
    ],
  },
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
    id: "relief-refugees",
    missionId: "mission.temple.relief-refugees",
    title: "接济灾民",
    briefing: "去山门外登记流民、分粥施药，把庙里的秩序先稳住。",
    orderLines: [
      "“寺门一开，先来的不是香客，是饥民。”",
      "“你去盯着施粥和分药，莫让人群乱起来。”",
    ],
  },
];
