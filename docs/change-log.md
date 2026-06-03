# 变更记录

用于持续记录项目结构、公共契约、功能能力和开发规则的变化。

## 2026-06-03 Tavern Long Gambling Variant

### Added
- 酒馆“赌博”入口新增结构化 `gamble-choice` overlay，先选择“长牌 / 短牌”，再进入对应下注配置；短牌继续走原有规则。
- `TavernGambleSession` 新增 `variant`，玩家状态新增长牌专用个人公开牌槽 `publicTileSlots`，公开槽支持 `covered` 状态。
- 新增长牌牌局：每名玩家开局 `5` 张暗牌与 `9` 张个人明牌，合计符合麻将 `14` 张胡型基础，下注后按轮摸 `3` 打 `3`，长牌吃/碰/杠响应窗口为 `10s`。
- 长牌新增核心 14 张胡牌评分骨架，先覆盖四组一对、七对、清一色、混一色、幺九、字牌刻、花牌和杠番，后续可继续补全完整国标 81 番。

### Changed
- 打出长牌个人明牌时，该玩家的公开槽会变为盖牌，且该弃牌标记为不可被其他玩家吃/碰/杠；每个玩家的公开槽只影响自己。
- `gamble-table` overlay 的公共牌视图新增 `covered` 字段，玩家摘要可携带个人公开牌展示字段；渲染层仍只消费 typed view model。
- 长牌牌桌 UI 隐藏短牌专用出牌槽与“打出顺/刻”相关按钮，只保留个人明牌、暗牌、下注、摸牌、弃牌和响应操作。
- [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 补充了 table mode picker 与 per-player public tile slot 的 overlay 契约要求。

### Impact
- 酒馆赌博继续通过 `tavern` house module 与 registry 接入，没有给 `src/main.ts` 增加赌博分支。
- 后续扩展长牌 AI、完整国标番种、抢杠/点炮等规则时，可以继续在 `domain/tavern-gambling.ts` 与结构化 overlay 契约内迭代。

## 2026-06-03 Tavern Gambling Discard Response

### Added
- 酒馆赌博弃牌后新增 3 秒响应窗口，按“吃/碰/杠 -> 碰/杠 -> 杠”的阶段递进；可用动作通过 `gamble-table` overlay 的结构化字段暴露给 UI，按钮可按规则闪烁。
- `TavernGambleSession` 新增弃牌响应窗口状态与已处理弃牌记录，仍保存在统一 house session 分支。
- 弃牌响应的吃/碰/杠判定现在会合并玩家手牌与该玩家未锁定公共牌，公共牌可补成顺、对子或刻子来响应他人弃牌。
- 酒馆牌桌 overlay 现在展示入场筹码、盲注、每名玩家本局下注和剩余筹码。

### Changed
- 酒馆赌博的入场数额改为总筹码语义，盲注固定为小盲 10 文、大盲 20 文，下注和加注不再把入场数额当作大盲。
- 酒馆赌博开局 seed 增加运行时熵，避免同条件第一局重复发牌。

### Fixed
- NPC 自动打出顺/刻时增加两组上限保护，避免同一名 AI 在一轮中打出超过两组。

## 2026-06-01 Tavern Mahjong Gambling Interface

### Added
- 新增酒馆赌博纯规则模块 [src/domain/tavern-gambling.ts](/D:/RPG_TG/src/domain/tavern-gambling.ts)，定义 144 张国标牌、2-6 人牌局结构、四轮下注、公共牌、摸打、碰/杠、花牌补牌和摊牌评分接口。
- `tavern` house 会话新增 `gambleSession`，赌局临时状态继续保存在统一 `GameState.ui.houseSession` 分支，不使用模块级全局变量。
- `HouseOverlayViewModel` 新增结构化 `gamble-table` overlay，用于呈现公共牌、玩家手牌、玩家下注、当前最高组合、碰杠选项、摸打动作和摊牌结果。
- `gamble-table` 玩家摘要新增可见弃牌历史字段，左侧玩家列表可以动态显示每名玩家每轮打出的牌。

### Changed
- 酒馆“赌博”从旧的 1.1 倍占位返还改为创建牌局 session，并通过 `tavern` 模块的 `dispatch` 处理下注、碰/杠、摸牌、弃牌、摊牌和最终金钱结算。
- 酒馆赌博 UI 改为消费结构化 view model 渲染牌桌，不向 application 层返回 HTML，也不向 `src/main.ts` 增加酒馆分支。
- 酒馆赌博规则调整为每人 4 张暗牌、9 张公共牌，摊牌时从 13 张里选最佳 6 张；公共牌按 5 / 2 / 2 翻开。
- 酒馆赌局流程调整为开局下注决定是否入局，随后每轮开牌后由庄家开始依次摸 2 张、杠判定、摸后跟/加/弃、弃 2 张；NPC 逐个 1-3 秒思考后执行同样流程。
- 公共牌发出后如果玩家没有可碰/杠选项，会自动跳过碰杠窗口直接下注；存在可碰/杠选项时显示 5 秒倒计时，到时自动不接。
- 酒馆赌博 UI 将“我的手牌”移入绿色牌桌下缘，玩家弃牌以麻将卡牌形式排列在对应座位区域，左侧玩家列表继续动态显示最高组合和每轮出牌。
- 酒馆赌博手牌支持拖拽重排，用于玩家自行码牌和计算组合。
- 酒馆赌博结算区展示每名玩家最终入选的 6 张牌与番数明细，便于核对系统评分。
- 清一色、混一色评分改为必须先形成有效 6 张结构：两副顺/刻，或三对子；散牌同门不再单独成立清/混一色。
- 清幺九评分同样改为必须先形成有效 6 张结构；散的幺九牌/字牌不再单独成立清幺九。
- 酒馆赌博短局番值改为“成型即有效，番数只排名”：基础结构先识别双顺、一顺一刻、三对将、双刻、四喜雏形和六字不靠，再叠加喜相逢、连六、步步高、老少副、清一色、混一色、全大/全中/全小/全双、幺九/字牌组、暗刻、花牌和杠番。
- 碰不再直接加番；明杠保留 +2、暗杠保留 +4，杠在摊牌结构中仍按刻子参与成型。
- 酒馆摸牌后弃牌流程改为先尝试打出顺/刻组：玩家可从手牌与未锁定公共牌选择 3 张移入出牌槽，确认后按自己贡献牌数补牌；用到公共牌则记为明打，公共牌变为已消耗不可再选，无法继续出组后仍需弃 2 张。
- 公共牌消耗改为玩家私有：对方打出顺/刻时使用过的公共牌只会锁定对方自己的后续选择，不会占用我的公共牌池。
- 打出自己牌数改为结算加成而非直接胜利：5 张 +2，6 张起算提前胡 +2，7 张及以上再 +1；NPC 同样按摸牌、自动出组、弃牌流程执行。
- 玩家或 NPC 打出两组顺/刻后，本局后续行动会被跳过，直接等待最终结算；仍保留其打出组和加番信息参与摊牌比较。
- 摊牌结算改为优先使用已打出的顺/刻：打出两组时直接用这 6 张结算；只打出一组时固定这 3 张，再从剩余手牌、公共牌和杠中补最佳 3 张。
- `gamble-table` overlay 新增完成等待字段，玩家或 NPC 打出两组顺/刻后 UI 会显示“等待结算”并禁用后续下注、摸牌、选牌和碰杠入口。
- 酒馆赌博弹窗改为内部滚动，结算区提升为牌局弹窗内的高层结果面板，避免被绿色牌桌区域遮住。

### Impact
- 后续要补更完整的国标番型识别、AI 行动或下注模式时，可以继续扩展 `domain/tavern-gambling.ts` 与 `gamble-table` overlay，不需要破坏 special-house 生命周期契约。

## 2026-05-30 House Access Refusal Dialogue

### Added
- 新增通用 house 进入拒绝规则：内容层可按剧情阶段、目标 `moduleId` 与 runtime flag 返回结构化拒绝对话。
- 朱元璋皇觉寺阶段补入两条拒绝对话：第一次寺庙评定前点击非寺庙地点由玩家自言“既然答应了主持，就先不要离开寺院吧。”；和尚期点击帅府由小兵提示“军机要出，请阁下回避。”
- `HouseModuleTransitionResult` 新增 `navigation: { type: "stay-in-house" }`，用于 house 模块拒绝通用离开动作并继续显示结构化对话。

### Changed
- 城市地点点击改为先走 `selectHouseEntryAccess`，符合规则时才进入 house runtime；拒绝时显示带说话人立绘的对话组件，不向 `src/main.ts` 写入具体 house 业务原因。
- 皇觉寺第一次评定期间点击右下角离开，会留在寺庙 house 内并显示玩家立绘对话“既然答应了主持，就先不要离开寺院吧。”
- [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 补充可见地点的拒绝进入对话规则。

### Impact
- 后续阶段性封锁地点、门卫拦截、自我约束类提示都可复用同一套规则，不需要在入口层增加特判。

## 2026-05-30 Tea House Debate UI And Grain Accounting UI Merge

### Added
- 合并 `shezhan` 分支中的舌战专属美术资源目录 `舌战UI/`，茶馆辩论改为“选题牌 -> 确认出牌”的 staged overlay 交互。
- 合并 `算术UI` 分支中的算账美术资源目录 `算术UI/`，粮行算账小游戏新增整屏账册式结算与答题界面。

### Changed
- `tea-house` 模块会话态新增舌战选牌字段，`HouseOverlayViewModel` 的 `debate` 结构新增 `selectedTopic`、`confirmActionId`、`confirmDisabled`，并在 [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 记录 staged overlay 的共享扩展规则。
- 茶馆模块、粮行模块及对应 house 视图中的乱码文案统一恢复为可读 UTF-8 文本。
- 本次只前移茶馆舌战玩法与粮行算账界面，不合并 `origin/算术UI` 里对 `src/main.ts` 的粮行专属 BGM 分支，以保持 special-house 合同不被入口层特判破坏。

### Impact
- 茶馆舌战和粮行算账都获得了分支中的主要界面升级，但仍然继续走 `module session -> typed overlay -> renderer` 的共享 special-house 路径。
- 后续如果其他特殊 house 也需要“先选再确认”的同类玩法，可以直接复用这次扩展后的共享 overlay 契约，而不必回到 DOM 特判或 `main.ts` 分支。

## 2026-05-30 Temple Opening Scene And Indoor Trigger Wiring

### Added
- 将皇觉寺开场剃度段整理为正式的 `旁白 -> 对话 -> 心里话 -> 方丈裁断` 演出序列，统一继续走 scene/dialog 契约。
- 在共享 house/story 运行时约定中补入 `indoor-screen-shown` 这类屋内界面展示时机的说明，明确它属于通用事件时机，不属于具体 house 私有逻辑。

### Changed
- 重写 [src/content/story/zhu-yuanzhang-main-story.ts](/D:/RPG_TG/src/content/story/zhu-yuanzhang-main-story.ts) 的寺庙开场文本，显式加入师兄“怕分走口粮”的一拍可见演出。
- 修正化缘解锁剧情中的方丈角色引用，统一改回 `char.kulan_temple_abbot`。
- 在 [src/main.ts](/D:/RPG_TG/src/main.ts) 增加通用被动剧情触发同步：当玩家停留在屋内界面且当前没有激活 scene 时，会统一评估 `indoor-screen-shown` 事件。

### Impact
- 皇觉寺开场现在可以直接承接文案碎片，不需要另写临时演出面板，也不会把心里话埋成不可见注释。
- 寺庙贡献达到阈值后的“准其外出化缘”剧情不再依赖手动点补触发；后续其他 house 若也需要屋内展示时机事件，可以复用同一条共享运行时路径。

## 2026-05-30 Tavern Work Intake Flow

### Added
- 酒馆工作改为“工作 -> 接取 / 提交”两段式流程，移除旧的“接当前活”即时完成 action。
- 新增酒馆任务持久状态键：当前已接任务、任务进度、完成标记和失败标记都写入 `GameState.runtime`。
- 新增刷盘子任务，复用 shared `qte-bar` overlay 与 `tick + stop-interval` 生命周期，三次判定后按完成度结算金钱。
- 为护送商队、跑腿采买等随机事件类酒馆任务保留 `random-event` 类型接口；当前未接入事件执行时，提交会按失败处理。

### Changed
- 酒馆会话状态新增工作面板模式、提交选择和已接任务列表，仍通过统一 `GameState.ui.houseSession` 管理。
- 提交任务前会弹出二次确认；未完成或失败任务允许提交，但结算为失败并从当前酒馆已接列表移除。

### Impact
- 后续扩展酒馆随机事件、声望解锁和多任务容量时，可以继续在 tavern module 内扩展，不需要给 `src/main.ts` 加 house 特判。
- 特殊 house 的任务状态示例进一步明确：接受/完成/失败这类持久状态必须进入统一 runtime，而不是模块级全局变量。

## 2026-05-29 Main Story Data Contract

### Added
- 新增共享主线领域合同 [src/domain/story.ts](/D:/RPG_TG/src/domain/story.ts)，定义 `StoryArcDefinition`、`StoryBeatDefinition`、剧情阶段变量键与节拍完成标记键。
- 新增朱元璋主线样例内容 [src/content/story/zhu-yuanzhang-main-story.ts](/D:/RPG_TG/src/content/story/zhu-yuanzhang-main-story.ts)，演示 `arc -> beat -> event -> scene` 的推荐组织方式。
- 新增主线数据合同文档 [docs/story-mainline-data-contract.md](/D:/RPG_TG/docs/story-mainline-data-contract.md)。

### Changed
- 将“主线剧情如何驱动游戏”的建议从口头约定收口为仓库内可复用合同，明确继续复用现有事件系统，而不是另起一套剧情运行时。
- 为现有 `zhu-yuanzhang-story` 阶段变量补上与 `var.story.<arcId>.stage` 命名规则一致的内容样例。

### Impact
- 后续新增主线、支线或人物剧情时，可以按统一内容合同组织，不需要把剧情推进逻辑塞进 `main.ts`、house 模块或页面层。
- 剧情阶段、节拍完成和事件触发历史的责任边界更清楚，便于后续扩存档、回放与调试。

## 2026-05-30 Story Fragment Intake Rule

### Added
- 在 [docs/story-mainline-data-contract.md](/D:/RPG_TG/docs/story-mainline-data-contract.md) 中补入“输入约定”“自然语言转剧情内容工作流”和“皇觉寺碎片示例”。
- 新增 [docs/zhu-yuanzhang-temple-opening-draft.md](/D:/RPG_TG/docs/zhu-yuanzhang-temple-opening-draft.md)，把皇觉寺开场桥段拆成 beat、事件链、状态键和当前实现差距。

### Changed
- 明确主线协作方式允许文案作者直接提供碎片化灵感，不要求其预先写成结构化模板。
- 将“碎片输入 -> 历史判断 -> beat / event / scene / state”收口为代理应承担的标准转换职责。
- 将 [src/content/story/zhu-yuanzhang-main-story.ts](/D:/RPG_TG/src/content/story/zhu-yuanzhang-main-story.ts) 从示例主线改为贴合当前设计方向的皇觉寺开场草案，并为 [src/domain/zhu-yuanzhang-story.ts](/D:/RPG_TG/src/domain/zhu-yuanzhang-story.ts) 补入寺庙期变量键和 flag 常量。
- 扩展 [src/domain/house-module.ts](/D:/RPG_TG/src/domain/house-module.ts) 的共享 overlay typed contract，新增 `qte-bar` 结构，用于寺庙等特殊 house 的默认停点小游戏。
- 将 [src/application/house-modules/temple-house/temple-house-house-module.ts](/D:/RPG_TG/src/application/house-modules/temple-house/temple-house-house-module.ts) 从纯寺务分配扩展为按剧情阶段开放寺内帮忙、累计贡献并解锁化缘的实际玩法流。

### Impact
- 后续剧情创作可以更贴近文案工作习惯，不需要作者替系统做事件建模。
- 代理在把自然语言落成代码时有了明确的中间转换规则，能减少反复来回补格式。
- 皇觉寺开场现在已经有了仓库内的正式剧情草案，后续寺庙玩法改造、QTE 接入和化缘解锁可以直接对照实现。
- 统一 QTE overlay 进入 shared contract 后，后续其他特殊 house 若也需要同类停点玩法，可以继续复用同一套 `tick + overlay + renderer` 路径，而不用再写入口特判。

## 2026-05-29 Temple House And Story-Stage Routing

### Added
- 新增 `temple-house` 特殊 house 模块，提供住持接待、测运势、捐香火，以及和尚时期的寺中评定与差事派发流程。
- 新增朱元璋早期剧情阶段键：`huangjue-temple` 与 `guo-zixing-camp`，统一写入 `GameState.runtime.variables`。
- 新增寺庙持久变量键与寺庙会话类型，用于累计香火与记录最近一次寺务派发。

### Changed
- `HouseDefinition` 与 `CityEntryDefinition` 扩展 story-stage 可见性/可进入元数据，并通过通用 selector 接管城市卡片与 house 入口过滤。
- 和尚时期的评定从帅府迁到寺庙，但不移除各城帅府；帅府仍可进入，只是不再对未入郭子兴阵营的主角触发评定。
- 原型世界补入各城寺庙 house，并把和尚类历史人物的默认驻所从茶馆改为寺庙；和尚期主角也会改驻皇觉寺。
- `docs/special-house-interface.md` 同步补入 stage-gating 元数据与 `temple-house` 示例，保持 shared contract 与实现一致。

### Impact
- “和尚期寺庙评定 / 入营后帅府评定”现在通过统一运行态和 registry 生效，不需要在 `src/main.ts` 为剧情阶段追加 house 特判。
- 后续如果还要扩展其他人物阶段、门派据点或阶段性城市入口，可以复用同一套 story-stage selector，而不是继续堆入口分支。

## 2026-05-27 Documentation Alignment

### Changed
- 对齐 [architecture.md](D:/RPG_TG/docs/architecture.md) 与当前代码实现，修正 `House` 入口字段、统一 `GameState` 结构，并补入特殊 house runtime、城市 NPC 池和市场运行态说明。
- 对齐 [special-house-interface.md](D:/RPG_TG/docs/special-house-interface.md) 与 `src/domain/house-module.ts` 当前契约，统一 `HouseModuleTransitionResult`、`HouseModuleRequest`、`HouseModuleSideEffect` 与 `tick` 驱动约束。
- 为 [development-plan-2026-05-25.md](D:/RPG_TG/docs/development-plan-2026-05-25.md) 增加“历史计划”说明，避免继续把阶段计划误用为现行接口规范。
- 清理本文件中的编码异常与失真段落，恢复可读的 Market System Merge 记录。

### Impact
- 后续开发可以直接以文档为准核对当前实现，不会再因 `onEnterSceneId`、旧 `GameState` 示例或过期 house 返回结构产生误导。
- 特殊 house 的开发、评审和扩展规则现在和代码现状一致，能减少“文档允许、实现不支持”或“实现已有、文档没写”的偏差。

## 2026-05-28 Medicine House UI Merge

### Added
- 为药铺配药浮层补入结构化清盘动作：`medicine-compounding` overlay 新增 `clearActionId` 与 `clearLabel`，药铺模块新增“清空药盘”处理。
- 合并 `yaopuui` 分支中的药铺专属美术资源与新版配药界面布局。

### Changed
- 药铺模块文案、购买浮层与配药结算改为清晰 UTF-8 文本，移除旧实现中的乱码输出。
- 药铺配药界面改为继续走统一 `data-house-action` 点击分发，不把 `yaopuui` 里的药铺专属拖拽逻辑并入 `src/main.ts`。
- `docs/special-house-interface.md` 补充共享 overlay 扩展规则，明确 richer overlay control 也必须先进入 typed contract。

### Impact
- 药铺现在获得了 `yaopuui` 的主要视觉升级和清盘玩法，同时保持 special-house 合同，不会为了单个 house 污染入口层。
- 后续如果其他特殊 house 也需要 overlay 级附加动作，可以按同一 typed contract 方式扩展，而不是再引入 DOM 特判。

## 2026-05-27 Leader Residence Directory Entry

### Added
- 新增 `leader-residence` 特殊 house 模块，用于承接“将领府邸 -> 选人 -> 拜访”的统一人物拜访流程。
- 新增城市目录入口模型：城市卡片可以先打开本城人物列表，再选中目标角色进入共享 special house。
- 原型内容新增“将领府邸”入口卡与两名乡贤样例人物：刘伯温、李善长。

### Changed
- 城市页从“所有卡片都直接进入 house”扩展为同时支持“直接进 house”与“先开目录再进入目标 house”的两级入口模式。
- `special-house-interface.md` 补充 grouped city entry 规则，明确目录选择属于城市导航层，但最终仍必须落回 `moduleId + registry + lifecycle`。
- “将领府邸”从静态房屋概念收敛为“本城可拜访历史人物列表”入口，并明确排除主帅与其他 house 固定工作 NPC。

### Impact
- 后续如果还要做市场分铺、官署分房间、人物目录类入口，可以复用同一套城市目录入口模式，而不必在 `main.ts` 里追加特判。
- 人物拜访系统现在可以按“本城人物列表 + 参数化拜访模块”扩展，不需要为每个历史人物单独造一栋真实 house。

## 2026-05-26 UI Layout Alignment Workflow

### Added
- 新建 `docs/ui-layout-alignment-workflow.md`，固定当前 UI 布局对齐的协作方式、参数格式和源码回写规则。

### Changed
- 明确布局编辑器当前采用“复制完整布局参数 -> 用户粘贴给代理 -> 代理回写 `src/content/layout-editor-presets.ts`”的工作流，而不是下载文件再导入。
- 在 `docs/collaboration.md` 增加了这套工作流的文档入口，后续涉及布局对齐流程变更时需要同步更新。

### Impact
- UI 微调不再依赖口头说明，后续 HUD、面板和其他可视化布局的对齐方式有了稳定协作协议。
- 布局编辑器与源码默认配置之间的责任边界更清楚，能减少“编辑器改了但默认值没落地”的反复。

## 2026-05-26 Home House Recovery Loop

### Added
- 新增 `home-house` 特殊 house 模块，为 `home_001` 提供休息、查看状态、整理道具、结束当天四类据点流程。
- 新增自宅持久数据结构与 Hook 预留：配偶接口、住宅成长字段、休息中断检查，以及“指定天数静养”输入浮层。

### Changed
- `GameState.world` 增加统一的 `timeOfDay` 与 `schedule.councilDate`，让自宅休息与评定日期能走共享运行态，而不是 house 私有全局。
- `keep-house` 在评定派发差事后会同步写入下次评定日期；特殊 house 共享 overlay 契约扩展为支持静养天数输入。
- 原型城市新增房屋 `home_001`（自宅），主角默认驻所改为自宅，形成“外出 -> 回家静养 -> 再外出”的循环入口。

### Impact
- 项目现在具备了第一个偏生活节奏的长期据点，玩家能在统一 house 合同下推进日期、恢复状态、查看行囊，而不需要在入口层加自宅特判。
- 后续若要接入妻子支援、家具升级、家庭事件或仓储扩建，可以继续沿用已有的自宅持久结构与 Hook，而不用推翻当前 house 接口。

## 2026-05-25 Medicine House Module

### Added
- 新增 `medicine-house` 特殊 house 模块，为 `house.kulan.medicine_house` 提供问诊、疗伤、买药与配药小游戏流程。
- 新增药馆持久状态键与配药纯逻辑：成药库存写入 `var.medicine_inventory.*`，疲劳恢复走统一运行时变量，配药小游戏支持按药材组合结算评级。
- 原型城市新增药馆房屋、郎中角色，以及药馆专属视图与模块注册接线。

### Changed
- 药馆沿用现有 special-house 契约接入 `moduleId + registry + sessionState + viewModel`，没有向 `main.ts` 添加 house 特判。
- 茶馆与药馆对齐为一致的 `greeting -> open -> idle` 交互节奏，药馆相关测试并入统一 `robustness` 回归集。
- 合并药馆时保留当前 `提交版本` 的城市命名，相关返回文案继续使用“濠州”而不是旧分支中的“应天府”。

### Impact
- 当前原型城内已经具备生活恢复链路中的医疗据点，玩家可以在统一 house runtime 下完成治疗、购药与轻量玩法，而不依赖单独入口逻辑。
- 后续若要扩展药方、伤病状态、医术成长或更多医馆 NPC，可以继续沿用已有模块边界与统一状态结构。

## 2026-05-22 Market House Trade Logic

### Added
- 新建 `src/content/houses/market-house-content.ts` 与 `src/domain/market-house.ts`，集中定义货栈 NPC 池、跑商库存刷新键和交易结果结构。
- 为 `market-house` 增加专用商品交易浮层，支持货单选择、数量输入和买卖差价结算。

### Changed
- `market-house` 从“城市店铺总览”改为真正的货栈交易屋舍：进入时固定钱掌柜打招呼，再按 `greeting -> open -> idle` 节奏展开、收起与重开。
- 货栈会按 3 到 7 天刷新随机商人和货单，玩家商品库存与 NPC 好感统一落在 `GameState.runtime.variables`，不再依赖临时视图态。
- 原型内容中的 `house.kulan.market` 改名为“货栈”，默认驻场角色文案同步调整为钱掌柜。

### Impact
- 货栈现在可以承接低买高卖、跨城倒卖和行情打听这类跑商循环，同时继续遵守 special-house 契约与统一 house runtime。
- 通用 house overlay 契约扩展后，后续当铺、商会、黑市等屋舍也可以复用同一套结构化交易浮层，而不需要把 HTML 塞回 application。

## 2026-05-22 Market System Merge

### Added
- 新建 `src/domain/trade-good.ts` 与 `src/domain/market.ts`，补齐统一贸易货物和城市市场数据模型。
- 新建 `src/content/markets/global-goods-pool.ts` 与 `src/application/markets/*`，提供全局货池和城市市场刷新逻辑。
- 在 `GameState.runtime` 中增加 `cityMarkets`，统一保存各城市市场运行态。

### Changed
- `CityDefinition` 扩展 `tags`、`prosperity`、`danger`、`specialDemand`，让市场刷新和需求差异走城市静态配置而不是硬编码。
- `create-initial-state` 改为初始化 `cityMarkets`，让市场系统从统一状态工厂进入运行时。
- 市场相关逻辑改为复用 special house 与统一 house runtime，而不是追加入口层特判或独立市场全局。
- `HouseDefinition.activityLocationId` 开始承接 market / street 等地点的流动 NPC 槽位声明。

### Impact
- 市场系统和 special house、城市 NPC、统一 runtime 结构完成对接，后续不需要为不同商业地点再开一套状态体系。
- 后续新增市场类屋舍时，可以继续沿用 `cityMarkets` 和 `MarketShopType`，减少重复建模。

## 2026-05-22 Market House Wiring

### Added
- Added `market-house` as a special-house module with its own session state and renderer.
- Added market-house tests covering enter flow, shop switching, and unified city market inventory display.

### Changed
- Upgraded `house.kulan.market` to use `moduleId: "market-house"` instead of the generic house path.
- Reused unified `runtime.cityMarkets` data for city market browsing instead of adding new market globals.

### Impact
- `house.kulan.market` now follows the repository special-house contract and no longer depends on plain house fallback behavior.
- Market browsing is now attached through `moduleId + registry`, which keeps `src/main.ts` free of market-specific branches.

## 2026-05-22 Keep House Meeting Flow

### Added
- Added `keep-house` as a special-house module for `house.kulan.keep`, including audience dialogue, review meeting flow, contribution ranking, strategy briefing, and task assignment.
- Added Guo Zixing-aligned prototype generals so the keep meeting can render a left-side roster and review contribution board.
- Added keep-house tests covering countdown-zero entry, meeting progression, and resetting the review countdown to `60` after task assignment.

### Changed
- Upgraded `house.kulan.keep` to use `moduleId: "keep-house"` instead of the generic static house path.
- Updated the prototype debug scenario so the player already serves under Guo Zixing and the unified review countdown starts at `0`, which forces the meeting to trigger immediately when entering the keep.
- Keep meeting task assignment now updates shared mission state, shared UI mission text, and unified runtime countdown data rather than using keep-specific globals.

### Impact
- The city lord house now follows the repository special-house contract and no longer depends on plain fallback house rendering.
- Review timing, meeting contribution data, and assigned work all flow through unified game state plus `ui.houseSession`, keeping `src/main.ts` free of keep-specific business branches.

## 2026-05-22 Global Status Bar Layout Refresh

### Changed
- Rebuilt the global player panel into a single top-left status board that uses `yuansu/1_002_top_status_bar_1.0.png` as its main frame instead of the earlier split card layout.
- Corrected the panel data mapping so the board now shows current city, player gold, stamina, fame, review countdown, and current mission text from unified state instead of temporary placeholder fields.

### Impact
- The always-visible top-left HUD now matches the project reference composition more closely without introducing new entrypoint branches or house-specific UI wiring.
- Global player summary data continues to flow through shared `GameState` and panel view-model wiring, keeping the renderer contract stable while updating presentation.

## 2026-05-21 City NPC Pool Template

### Added
- 新建城市级 NPC 池领域模型：`src/domain/city-npc.ts`
- 新建城市 NPC 每日刷新与 House 选择器骨架：`src/application/city-npcs/*`
- 为库兰城补充城市共享 NPC 池样例，以及可承接流动 NPC 的茶馆模板。
- 新建茶馆特殊 house 模块：`domain/tea-house`、`domain/house-modules/tea-house-session`、`application/house-modules/tea-house/*`、`ui/views/house/tea-house-house-view`
- 新建酒馆特殊 house 模块：`domain/tavern`、`domain/house-modules/tavern-session`、`application/house-modules/tavern/*`、`ui/views/house/tavern-house-view`

### Changed
- `GameState.runtime` 新增 `cityNpcPools`，用于统一保存“按城市共享、按日期刷新”的 NPC 位置与好感度运行态。
- `HouseDefinition` 新增可选 `activityLocationId`，用于声明某个 House 对应的城市活动地点槽位，而不是各自维护独立 NPC 池。
- 普通 House 视图改为可叠加显示“固定驻场角色 + 当日流动城市 NPC”。
- `HouseModuleId` 扩展为支持 `tea-house`，库兰城茶馆改为通过统一 registry 接入，而不是普通 House 静态展示。
- `HouseModuleId` 扩展为支持 `tavern`，库兰城客栈入口提升为酒馆 special house，通过统一 registry 接入工作 / 喝酒 / 赌博三类流程。
- 茶馆进入逻辑改为“固定老板 + 当日茶馆地点中至多 2 名城市流动 NPC”，并在模块内实现闲谈、请喝茶、打听消息、舌战四类交互。
- 特殊 house 视图注册表补入 `tea-house` renderer，茶馆现在可以通过 `moduleId -> view registry` 正常渲染。
- 粮铺与茶馆共享的 action/dialogue/status/leave/alert 视图块抽入 `src/ui/views/house/house-shared-view.ts`，特殊 house 视图层开始复用统一 renderer 而不是互相复制模板。
- 酒馆新增工作 / 喝酒 / 赌博三条流程：工作按支线活计即时结算，喝酒确认后扣 100 文，赌博先按接口占位以 1.1 倍返还赌本，后续再接真正小游戏。

### Impact
- 同一座城的流动 NPC 不再绑定到单个 House，而是通过城市共享池按日刷新，后续茶馆、酒馆、集市等地点都可复用同一模板。
- NPC 位置在同一天内保持稳定，只会在日期变化后重新刷新，能更自然地营造“城里的人在流动”的感觉。
- 茶馆现在成为第一个基于“城市共享 NPC 池 + 特殊 house 合同”实现的社交型屋舍，后续酒馆、道场、情报点可以沿同样模式扩展。

## 2026-05-20 Special House Contract

### Added
- 新建仓库级代理约束文件：`AGENTS.md`
- 新建特殊 `house` 接口规范：`docs/special-house-interface.md`

### Changed
- 将“新增 house 实例”明确设为一个强触发场景：任何代理在实现前都必须先展示并遵守特殊 house 接口合同。
- 把特殊 house 的硬约束从分散的分层原则，收紧为可执行的架构规则：禁止在 `main.ts` 写具体 house 分支、禁止在 `application` 返回 HTML、禁止用全局变量保存 house 会话态、禁止在进入 house 时重置玩家基础属性。

### Impact
- 以后任何人或代理再提“开发一个新的 house 实例”，都会先看到接口规范，而不是直接开始写特例代码。
- 特殊 house 的接入方式从“约定俗成”升级为仓库级合同，便于多人协作和代码审查。

## 2026-05-20 Demo Follow-up Plan

### Added
- 新建 2026-05-25 开发计划文档：`docs/development-plan-2026-05-25.md`

### Changed
- 明确 demo 阶段暂不做大规模拆分，但将 2026-05-25 设为结构收口节点。
- 将后续工作聚焦为三项基础建设：特殊 `house` 接口、玩家运行态边界、存档结构。

### Impact
- 后续开发从“继续堆 demo 功能”转为“先稳住接口，再扩功能”。
- 团队可以按同一时间表准备 5 月 25 日之后的架构收口工作。

## 2026-05-20 Grain Shop Refactor

### Added
- 新建特殊 house 共享领域契约：`src/domain/house-module.ts`
- 新建特殊 house 注册表：`src/application/house-modules/house-module-registry.ts`
- 新建粮行模块会话态与生命周期实现：`src/application/house-modules/grain-shop/*`

### Changed
- `src/domain/house.ts` 为 `HouseDefinition` 增加 `moduleId`，明确 house 的行为绑定不再依赖 `id` 字符串特判。
- `src/domain/global-ui.ts` 与 `src/application/state/create-initial-state.ts` 增加统一 `ui.houseSession`，替代入口层游离的 house 会话全局变量。
- `src/main.ts` 改为通用 `moduleId + registry` 分发，不再直接导入或分支处理粮行业务。
- `src/ui/views/house/grain-shop-house-view.ts` 改为消费结构化 `HouseModuleViewModel`，保留全局 UI 覆盖层，场景切换不再重绘全局组件容器。
- `src/application/grain-shop/init-grain-shop-session.ts` 停止在进入粮行时重置玩家金钱和算术。
- 删除旧的粮行专用入口控制与旧会话 UI 类型：`src/application/grain-shop/grain-shop-interactions.ts`、`src/application/grain-shop/accounting-timer.ts`、`src/application/grain-shop/grain-shop-session-ui.ts`、`src/ui/views/house/grain-shop-ui-state.ts`

### Impact
- 粮行成为第一个严格走仓库 house 合同的特殊 house，实现了统一状态传递、统一会话存放、统一副作用调度。
- 以后新增茶屋、道场、锻冶屋时可以直接按 `moduleId + registry + sessionState + viewModel` 方式接入。
- `main.ts` 从“原型特例堆叠”收口为稳定入口，后续继续扩 house 时冲突会小很多。

## 2026-05-20 Robustness Baseline

### Added
- 新建库存纯逻辑模块：`src/application/inventory/inventory-selection.ts`
- 新建最小纯逻辑测试基线：`tests/robustness.test.mjs`
- 新增测试构建配置与脚本：`tsconfig.test.json`、`npm test`

### Changed
- `src/domain/house-module.ts` 将 `houseSession` 从宽泛 `unknown` 收紧为按 `moduleId` 区分的联合类型。
- 粮行 house 模块、主入口与粮行纯逻辑中的关键查找从静默兜底改为显式断言失败。
- `eslint` 排除旧 `prototypes/**` 原型目录与 `.test-dist/**`，避免历史演示代码干扰主工程校验线。

### Impact
- 后续 house 模块可以沿着 `moduleId -> sessionState` 的稳定契约扩展，不需要再在入口层做裸转型。
- 内容配置缺失会更早暴露，避免运行时静默落到错误角色或错误房屋。
- 项目现在具备最小可执行的纯逻辑回归线，可先守住粮行交易、算账结算、house session 和库存选择一致性。

## 2026-05-20 Main Assembly Split

### Added
- 新建入口层共享状态类型：`src/application/app-shell.ts`
- 新建 UI 状态动作模块：`src/application/app-actions.ts`
- 新建特殊 house 运行时装配模块：`src/application/house/house-runtime.ts`
- 新建页面拼装渲染模块：`src/ui/app-render.ts`

### Changed
- `src/main.ts` 从业务中心收口为装配层，只保留事件监听、初始化、modal confirm 和渲染调用。
- `enter/leave/dispatch/applySideEffects/interval` 相关逻辑迁入 `house-runtime`。
- 卡牌、贵重物与 overlay 的 UI 状态修改迁入 `app-actions`。
- stage / modal / overlay / character detail 相关渲染拼装迁入 `app-render`。

### Impact
- 入口文件不再直接承担 house 生命周期、库存状态修改和大段 HTML 拼装。
- 后续继续做 house renderer 收口或增加 overlay 时，可以在独立模块内改动，降低 `main.ts` 冲突面。
- 第 1 次小重构已经为后续第 2 次 house 模块收口提供了更稳定的装配边界。

## 2026-05-20 House View Registry

### Added
- 新建特殊 house 视图注册表：`src/ui/views/house/house-module-view-registry.ts`

### Changed
- `src/ui/app-render.ts` 不再直接导入或分支处理粮行 renderer，改为通过 `moduleId -> renderer` 注册表渲染。
- `docs/special-house-interface.md` 明确要求特殊 house 的视图层也通过稳定 registry wiring 接入。

### Impact
- 入口层和页面拼装层都不再需要知道具体房屋名，剩余的特殊 house 视图耦合被压缩到稳定 registry。
- 后续新增茶馆、武馆、当铺时，只需注册模块行为和视图，不必继续污染装配层。

## 2026-05-19

- 粮铺算账小游戏：累计答错 3 次立即结束并进入结算，HUD 显示剩余可错次数。
- 粮铺 UI：去掉顶部状态条；底部左对话框、右大立绘分开展示，左下角场景名称卡片。
- 将粮铺原型按四层架构接入主项目：`content` 配置、`domain/grain-shop` 类型、`application/grain-shop` 流程、`ui/views/house/grain-shop-house-view` 视图。
- 在库兰城新增房屋 `house.kulan.grain_shop` 与掌柜角色 `char.kulan_grain_shopkeeper`。
- 主循环：地图 -> 库兰城 -> 粮铺 -> 买卖 / 调查 / 算账小游戏 -> 属性变化 -> 返回城市。

## 2026-05-19 Main Loop

### Added
- 新建 `effect-applier`，统一处理 flag、变量、任务、角色属性变化。
- 新建 `scene-runner`，用于推进场景 action 执行。
- 新建 `choice-resolver`，用于处理选择肢结果。
- 新建 `game-store`，用于统一保存与推进 `GameState`。
- 新建 `create-initial-state`，用于生成运行时初始状态。
- 新建 `game-store-example`，用于跑通示例事件流程。

### Changed
- 示例运行状态从内容文件内联假数据，改为通过状态工厂函数生成。
- 项目从“可定义事件”推进到“可执行事件主循环”。

### Impact
- 事件现在不只可声明，还能暂停、推进、选择、改状态。
- UI 接入时可以直接读取 store 快照，不需要再从零设计执行模型。

## 2026-05-19 Prototype Map

### Added
- 新建 Vite 前端运行入口：`index.html`、`src/main.ts`
- 新建地图移动原型内容：`prototype-world.ts`
- 新建地图移动命令：`travel-to-coordinate.ts`
- 新建城市进入命令：`enter-city.ts`
- 新建二次确认弹窗组件：`confirm-modal.ts`
- 新建地图视图与城市视图：`map-view.ts`、`city-view.ts`
- 新建原型样式文件：`prototype.css`
- 新建全局主角栏组件：`global-player-panel.ts`
- 新建角色详情全屏页：`character-detail-view.ts`
- 扩展人物数据结构：立绘差分、姓名年龄职位、人物简介、生卒年、体力、技能表。
- 扩展全局 UI 状态：距离评定日期、主家任务。

### Changed
- 项目从纯架构骨架推进到可交互页面原型。
- 新增地图 -> 二次确认 -> 移动 -> 城市进入 -> house 展开的基础流程。
- CSS 规则从单前缀模式调整为兼容 BEM 的命名，适配原型层的元素与修饰符。

### Impact
- 现在可以直接在浏览器里验证网格移动与城市进入逻辑。
- 后续地图、城市、house、事件 UI 可以在同一前端入口上继续迭代。
- 原型层可以在不破坏规范的前提下使用 `block__element--modifier`。
- 左上角主角栏已按目标布局接入原型。
- 点击主角栏可进入全屏角色详情。

## 2026-05-19 Character Detail Layout

### Changed
- 重构 `character-detail-view.ts`，将人物详情页整理为头部信息、左侧立绘与简介、右侧属性 / 装备 / 技能的全屏布局。
- 调整 `prototype.css` 中的人物详情页样式，使其更接近目标原型，并补上关闭按钮样式。
- 更新 `main.ts` 与 `game-store-example.ts` 的初始化数据，补齐 `cards` / `valuables` 输入，为人物详情提供据点、上司、装备等展示文本。
- 修正 `create-initial-state.ts` 的类型输入方式，保证 lint 与 typecheck 正常运行。

### Impact
- 人物详情页现在具备稳定的全屏展示结构，后续继续补按钮、贵重物、卡片时不需要再推翻页面骨架。
- 项目当前 `typecheck`、`build`、`lint` 可以作为后续扩展前的基础校验线。

## 2026-05-19 Inventory Overlay

### Added
- 新建卡库全屏视图：`src/ui/views/cards/card-library-view.ts`
- 新建贵重物全屏视图：`src/ui/views/valuables/valuable-library-view.ts`
- 新增卡库筛选状态、贵重物筛选 / 排序状态，以及武具装备槽位展示逻辑。

### Changed
- `src/main.ts` 从独立的 `characterDetailOpen` 分支改为统一使用 `ui.overlayView` 驱动人物详情、卡库、贵重物三个浮层。
- `src/domain/global-ui.ts` 扩展了卡库和贵重物列表的筛选 / 排序 UI 状态。
- `src/domain/valuable-item.ts` 扩展了贵重物详情字段，为后续装备 / 业务逻辑保留余量。
- `src/application/state/create-initial-state.ts` 补齐库存相关默认状态。
- `src/application/navigation/enter-city.ts` 在进入城市时清理 overlay，避免地图浮层残留。
- `src/ui/views/character/character-detail-view.ts` 的“卡 / 贵重品”按钮改为真实跳转库存页。
- `src/styles/prototype.css` 新增统一的全屏藏品页布局样式。

### Impact
- 角色详情、卡库、贵重物现在共用一套全屏浮层切换规则，后续新增日志页、任务页、背包页时可以直接复用。
- 贵重物列表已经具备筛选、排序、详情展示和单槽装备的基础交互，后续只需继续补业务规则。
- 全局主角栏到库存系统的用户路径已经打通，可直接在浏览器里验证交互。

## 记录规则

以下改动必须记录：

- 新增功能
- 删除功能
- 修改 `src/domain` 公共类型
- 修改 `src/application` / `src/ui` 的模块边界
- 修改内容配置格式
- 修改存档结构
- 修改事件触发规则
- 新增或调整样式分层规范
- 新建跨容器目录
- 修改“容器之外”的结构

这里的“容器之外”指：

- 新建或修改 `src` 一级目录
- 新建或修改 `docs` 一级规则文档
- 新增公共运行入口
- 新增跨模块共享服务

不强制记录的改动：

- 纯文案错字修正
- 不影响契约的小样式微调
- 局部实现细节重构且外部接口不变

## 模板

```md
## YYYY-MM-DD

### Added
- 新增了什么

### Changed
- 改了什么边界或结构

### Impact
- 对协作、配置、运行流程的影响
```

## 2026-05-27 Server Deployment Scripts

### Added
- Added [docs/server-deployment.md](/D:/RPG_TG/docs/server-deployment.md) to document localhost development and no-port production deployment.
- Added [scripts/serve-static.mjs](/D:/RPG_TG/scripts/serve-static.mjs) as the production static server for the built `dist/` output.
- Added [scripts/start-dev-localhost.ps1](/D:/RPG_TG/scripts/start-dev-localhost.ps1) and Linux deployment helpers in [scripts/server](/D:/RPG_TG/scripts/server).
- Added Windows Server IIS deployment scripts: [publish-iis-dist.ps1](/D:/RPG_TG/scripts/server/publish-iis-dist.ps1), [install-iis-site.ps1](/D:/RPG_TG/scripts/server/install-iis-site.ps1), and [manage-iis-site.ps1](/D:/RPG_TG/scripts/server/manage-iis-site.ps1).

### Changed
- Updated [package.json](/D:/RPG_TG/package.json) with `dev:localhost` and `serve:prod`.
- Replaced [README.md](/D:/RPG_TG/README.md) with a readable startup and deployment overview.
- Switched [docs/server-deployment.md](/D:/RPG_TG/docs/server-deployment.md) to make Windows Server + IIS the default production deployment path.

### Impact
- Local debugging remains on `http://localhost:5173` while production can be exposed on `http://159.75.153.83` through `nginx` on port `80`.
- The built game can now run as a managed background process behind `systemd` instead of depending on a manually attached shell session.
- On Windows Server, the built game can now be hosted directly by IIS on port `80`, with `W3SVC` acting as the daemonized service manager.
## 2026-05-30 Mechanism-First Gameplay Guidance

### Added
- 在 [AGENTS.md](/D:/RPG_TG/AGENTS.md) 新增“机制优先设计规则”与“类型参考规则”，明确后续代理在做玩法开发时，必须优先提炼可复用机制组件，而不是继续写一次性剧情插片、house 特判或复制流程。
- 在 [docs/architecture.md](/D:/RPG_TG/docs/architecture.md) 补入同名开发原则，要求把同类玩法差异尽量留在 `content` 数据层，把流程骨架收口为共享状态机、共享 runtime contract 或共享组件。

### Changed
- 将“优先参考太阁系与其他经典历史模拟设计，不从零编造核心玩法概念”正式收口为仓库内开发规则，不再只作为口头协作偏好。
- 明确周期评定、贡献排名、方针宣布、工作分派、地图时间快进、通用小游戏外壳这类需求，默认都应先检查现有机制并考虑抽象复用。

### Impact
- 后续代理在处理评定、剧情推进、周期执行和类似系统时，会优先寻找共享骨架和 genre 参考，减少“临时补一段能跑的流程”这类扩展性差的实现。
- 玩法设计讨论会更稳定地对齐太阁类和经典历史模拟的成熟节奏，避免仓内继续积累概念漂移和重复机制。

## 2026-05-30 Temple Review Flow And Shared Map Auto-Advance

### Added
- 为 shared `HouseModuleSideEffect` 增加 `start-map-auto-advance` / `stop-map-auto-advance`，并在 [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 记录其用途：当 house 需要把流程交回地图层做通用时间推进时，必须走共享 side-effect，而不是把快进逻辑硬写进 `main.ts` 的 house 特判。
- 为皇觉寺工作结算补入“达到阈值后自动休整至下次评定”的共享 map 快进接线，后续其他地点若也需要“快进到评定/议事/约定日”，可以复用同一路径。

### Changed
- 皇觉寺评定改为更接近正式评定骨架的流程：`开场 -> 贡献展示 -> 嘉奖 -> 方针 -> 选工`，不再把第二次评定写成临时剧情插片。
- 朱元璋寺庙主线不再在剃度 scene 尾部强行续接 `first_temple_review` scene，而是回到 temple house 后继续走正式评定流程。
- 第一次寺庙评定在提交本轮工作方向时即写入 `firstTempleReviewCompleted` 与 `templeWorkUnlocked`，第二次评定则通过共享倒计时和自动回寺触发，自然开放 `外出化缘` 选项。
- 第一次评定后的新手寺内工作期新增 `firstTempleWorkLockCompleted` 进度标记：只在这一个教程周期内拒绝离开寺庙，后续再次选择寺内帮忙不会复用禁离规则；评定席期间也不再展示右下角离开按钮。

### Impact
- 寺庙前两次评定现在不再依赖“scene 插片 + house 临时续接”的混合实现，主线推进更接近固定节奏的阵营评定系统。
- 时间快进首次从单个 house 内部需求提升为共享 world/map 能力，后续更容易扩到帅府、其他阵营据点和类似“等待截止日”的玩法场景。
