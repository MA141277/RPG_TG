# 变更记录

用于持续记录项目结构、公共契约、功能能力和开发规则的变化。

## 2026-07-01 Task Runtime

### Added
- 新增 `src/core/contracts/task-runtime.ts`，定义 `TaskDefinition`、`TaskInstance`、`TaskRuntimeState`、`TaskAction`、`TaskSignal`、`TaskUpdate` 与 `TaskRuntimeResult`。
- 新增 `src/core/runtime/task-runtime.ts`，提供 `startTask()`、`applyTaskAction()`、`applyTaskSignal()` 与首版 signal-driven progression。

### Changed
- `src/core/contracts/runtime-result.ts` 现在可携带 `taskUpdates`，同时保留 legacy `RuntimeTaskAction` / `RuntimeTaskSignal` 兼容形态。

### Impact
- Task lifecycle 和 signal progression 已有 formal runtime owner；Task Runtime 返回 task updates、effects 与 follow-up signals，但不应用 effects，也不接管 Event、Scene、Interaction、Time、Save/Load 或 Presentation 边界。

## 2026-06-30 Presenter Output Render Decoupling

### Added
- 新增 `src/application/presenter/presenter-output.ts`、`app-presenter.ts`、`stage-presenters.ts` 与 `overlay-presenters.ts`，形成首版 `Presentation Bridge Runtime` / presenter output seam。

### Changed
- `src/main.ts` 现在在调用 `renderAppMarkup()` 前先组装 `createAppPresenterOutput()`，不再在 render 入参里内联组装 scene action / choice options。
- `src/ui/app-render.ts` 改为消费 `presenterOutput` 中的 stage、overlay、HUD 和 scene 选择结果，不再直接导入 `getHouseModule`、`isCityEntryVisibleForStoryStage` 或 `selectCityNpcSummariesForHouse`。

### Impact
- render-time gameplay selection 已从 UI renderer 移到 application presenter 层，`app-render.ts` 更接近纯渲染消费端；后续 Task Runtime、Mod Runtime 与 StateSync Runtime 可以在不重新扩大 presenter/render 边界的前提下继续推进。

## 2026-06-30 Minimum Unified RuntimeState Carrier

### Added
- 新增 `src/core/contracts/runtime-state.ts`，为 Child 4 的最小统一运行态补出 `RuntimeState.core`、`RuntimeState.app` 与 `RuntimeState.view` 三段式 carrier。

### Changed
- `src/core/contracts/runtime-result.ts`、`src/core/runtime/runtime-router.ts`、`src/core/runtime/runtime-dispatch.ts` 与 `src/core/runtime/runtime-settlement.ts` 现在围绕 `RuntimeState` 工作，而不是继续把 Child 4 卡在 Child 1 的 `CoreGameState` 形状上。
- `src/core/runtime/interactive-runtime.ts` 不再返回私有 `{ appState, enterHouseId }` 结果，而是返回共享 `RuntimeResult.state` 与 `RuntimeResult.interactive`；`src/main.ts` 至少已有一条覆盖中的 story-battle action 路径通过 `dispatchRuntimeRequest()` 回到共享 runtime line。
- `characterDefinitions` 本轮继续走独立兼容参数，不并入 `RuntimeState.core`；是否后续提升为 convergence step，改由 weekly promotion gate 决定。

### Impact
- Child 4 现在已经具备最小统一 runtime state/result carrier，后续可以先继续扩大 shared dispatch 覆盖和统一 signal，再决定是否需要更高成本的 `characterDefinitions` 或 Child 1 `CoreGameState` convergence。

## 2026-06-30 Interactive Runtime Bridge Extraction

### Added
- 新增 `src/core/contracts/interactive-runtime.ts`，为受控交互运行态补出统一的 kind/source/session 基础类型。
- 新增 `src/core/runtime/interactive-runtime.ts` 与 `src/core/runtime/house-runtime.ts`，提供交互启动/动作请求与 house runtime 进出/派发的 core bridge 入口。
- 新增 `src/core/adapters/legacy-house-adapter.ts` 与 `src/core/adapters/legacy-interactive-adapter.ts`，把当前 house runtime、city-begging、activity-qte、story-battle 的旧实现包进过渡适配层。

### Changed
- `src/main.ts` 不再直接导入 `application/house/house-runtime`，已覆盖的 house / city-begging / activity-qte / story-battle 入口改为先走 `src/core/runtime` 的桥接层。
- 已覆盖的交互 launch/action 入口现在先经过 `createLaunchInteractiveRequest()` / `createInteractiveActionRequest()` 和 `runInteractiveRuntime()`，而不是由 `main.ts` 直接组装并调用旧 helper。

### Impact
- 项目现在具备了第一层 production 级 `Interaction Runtime` / `House Runtime` bridge seam，后续可以继续把交互请求并入统一 runtime-router/runtime-dispatch，逐步减少 `main.ts` 作为并行交互控制器的职责，而不必立即重写现有小游戏和剧情战实现。

## 2026-06-29 Save Migration Hardening

### Added
- 新增 `src/core/save/save-migrations.ts`，为旧存档到当前 `SaveEnvelope` 的归一化提供确定性的迁移入口。
- 新增 `src/core/save/save-loader.ts`，在读取时统一执行迁移并校验 `selectedModId` 是否仍然可用。
- 新增 `src/core/save/save-writer.ts`，为当前标准化后的引擎存档提供统一序列化出口。

### Changed
- `src/core/save/save-envelope.ts` 补出当前 envelope 版本常量，使 loader / migration / writer 能围绕同一版本边界工作。
- 存档读取现在支持旧形态 `state.flags/state.variables` 迁移到 `runtimeState`，并在缺失 `engineState` 时补出默认引擎态。
- 存档读取不再静默接受缺失的 `selectedModId`；当所选 mod 不可用时，会显式抛错而不是带着损坏状态继续运行。
- 标准化后的存档写回路径会保留未知 mod 的 `modState` 负载，不会因为核心运行时不理解字段含义而丢失数据。

### Impact
- `src/core/save` 已从“最小 envelope seam”推进到“可迁移、可校验、可回写”的 persistence boundary，后续 Child 3/4/5 可以建立在这个稳定读写合同之上，而不必再回头发明新的存档形状。

## 2026-06-29 Core Engine Runtime Boundary

### Added
- 新增首批 `src/core` 边界文件：`contracts`、`engine`、`runtime`、`save` 与 `adapters/legacy-main-adapter.ts`，把 mod manifest、EngineSession、RuntimeRequest/Result、Effect、SaveEnvelope 等最小运行时契约落到生产代码目录。
- 新增 `src/core/registry/mod-registry.ts` 与 `src/core/registry/content-registry.ts`，让引擎启动可以通过选中的 mod id 和 registry 进入统一 bootstrap seam。

### Changed
- 增加 runtime dispatch 与 effect settlement 接缝，首条 routed request 已由 `src/core/runtime` 接管并回写 `CoreGameState`。
- 增加最小 `SaveEnvelope` 契约，保存层现在有了可继续硬化的 engine/modState 边界。
- `src/main.ts` 新增 `legacy-main-adapter` handoff seam，默认启动流程会先经过 `src/core` bootstrap，再继续沿用现有主运行时逻辑。

### Impact
- 项目第一次具备了面向 mod-first 改造的生产级 `src/core` 入口边界，后续可以在不继续扩大 `main.ts` 架构职责的前提下，逐步拆分 navigation、event/task、interactive module、save hardening 和 UI presenter。

## 2026-06-26 Standalone Static Service Script

### Added
- 新增 Windows 独立服务管理脚本 `scripts/standalone-service.ps1`，支持 `start / stop / restart / status`，可在后台启动构建后的静态站点服务。
- 新增便捷包装脚本 `scripts/start-standalone-service.ps1`，用于一条命令启动独立服务。

### Changed
- README 增补独立后台服务启动说明、默认地址和运行时日志目录说明。

### Impact
- 现在可以不占用前台终端运行构建后的项目，便于局域网演示、临时部署和手工验收。

## 2026-06-18 JSON Scenario Pack Entry

### Added
- 新增 JSON scenario pack 契约 `ScenarioPackDefinition`，一个 JSON 包现在可以携带 `scenarioProfile`、`characters`、`events`、`scenes` 和 `activities`。
- 新增 scenario pack 加载/校验入口 `application/scenario/scenario-pack-loader.ts`，支持从内置 URL 或本地 JSON 文本读取并解析开局包。
- 新增内置 JSON 包 `content/scenario-packs/liu-bang-pei-county-opening.json`：刘邦作为玩家角色，从沛县亭长开局，入口剧情、人物、选择分支和默认活动 fallback 都来自 JSON。
- 开始界面新增 `JSON 开局` 入口，可选择内置“刘邦：沛县亭长开局”，也可导入本地 `.json` 开局包。

### Changed
- 主运行时的 story/event/scene/activity 内容源从固定静态表扩展为“当前激活内容注册表”。普通开局会重置为内置内容；读取 JSON 开局时会先 merge JSON 包内容，再用该包的 `entryEventId` 启动开局。
- scene 渲染、剧情推进、选项处理和 house 触发现在都读取当前激活内容注册表，因此 JSON scene 可以正常推进和选择。

### Impact
- 这一步已经形成“选择 JSON -> runtime 读取 -> 生成开局 scene”的可见闭环。当前 JSON 包仍复用现有地图/城市容器，尚未让 JSON 动态新增完整 map/city/house/content registry；下一步应把 city、house、map、resource 也纳入 scenario pack 汇总和校验。

## 2026-06-18 Modular Authoring Activity Loop

### Added
- 新增 `ScenarioProfileDefinition`，用于描述表单化/Mod 化开局档案：玩家角色、章节、初始地图/城市/house/view、初始 runtime、入口事件和 opening flow。
- 新增 `ActivityDefinition` 与 `FlowDefinition`，把“专属 function 或 fallback QTE”活动从剧情文本中拆成可注册、可校验的结构化内容。
- 新增 `ActionNode` 类型 `start-activity`，scene 可以通过稳定 `activityId` 启动活动，而不是在剧情或入口层写业务分支。
- 新增 `application/activity/activity-runner.ts`，按 `handlerId` 执行活动；当前内置 `generic.qte` fallback，会写入统一 `GameState.runtime.flags/variables` 并执行配置化 effects。
- 新增示例内容 `content/activities/scenario-activities.ts` 与 `content/scenarios/scenario-profiles.ts`，覆盖朱元璋和尚开局与秦始皇皇宫开局的表单化数据骨架。
- 新增 [docs/modular-authoring-closed-loop-plan.md](/D:/RPG_TG/docs/modular-authoring-closed-loop-plan.md)，记录从 schema、flow runner、交互式 QTE 到 Mod 包加载和编辑器 UI 的完整闭环规划。

### Changed
- `SceneRunnerContext`、`StoryContent`、`GameContent` 和 house runtime 的 story trigger 依赖现在可携带 `activityDefinitionsById`，让剧情推进链可以消费结构化活动注册表。
- `main.ts` 只传入活动注册表，不增加角色、house 或活动的专属业务分支。

### Impact
- 后续“输入一段文字生成剧情”“开局表单决定流程”“缺少专属 function 时 fallback 到 QTE”应继续走 `scenario/event/scene/flow/activity` 数据链路，运行时不得根据文本或 id 字符串临场猜语义。
- 当前 `generic.qte` 是自动结算 fallback，尚未接成可交互 overlay；下一步应抽共享 activity/minigame shell，而不是复制寺庙或酒馆 QTE 逻辑。

## 2026-06-17 Battle Demo Formation Targeting Cleanup

### Changed
- [prototypes/battle-demo/index.html](/D:/RPG_TG/prototypes/battle-demo/index.html) 的编队对战目标锁定改为固定前排优先顺序，成员按“前排到后排、从左到右”选择目标，不再按同路/居中随机切换目标。
- 编队成员攻击继续采用“先锁定目标、再随机短延时并发出手”的演出方式，缩短同批次成员攻击之间的等待，避免退回逐个串行撞击节奏。
- 兵种克制收口为两条成员级规则：骑兵攻击远程成员伤害 +50%，长枪攻击骑兵伤害 +50%；移除冲锋对伤害的额外加成与相关技能入口。
- 棋盘单位与部署/调试摘要统一按“编队”显示，不再在战场棋子摘要里暴露具体内部兵种构成；棋盘本体继续只显示兵力条和士气条。

## 2026-06-15 Story Battle Rescue Hook

### Added
- 新增共享 `storyBattle` 运行态、剧情战视图与 story battle runtime，用于把主线 scene callback 接到可交互战斗会话，而不是从剧情硬跳单文件战斗原型。
- 朱元璋郭子兴入营段新增“救援孙德崖”剧情战：郭子兴、汤和、徐达等友军由 NPC 推进，玩家只操作朱重八本队突入缺口，胜利后回帅府评定。

### Changed
- 第四周入郭剧情从占位战斗结果扩展为“对话铺垫 -> 剧情战 -> 胜利进入评定”的可复用流程。
- 主线剧情战视图改为嵌入完整 `prototypes/battle-demo` 战斗页面，并通过 `sundeya-rescue` 场景参数加载固定救援战；原型页新增剧情场景配置、NPC 友军自动行动和胜利 `postMessage` 回调。

### Impact
- 后续主线若要接个人战、救援战、护送战等剧情战，应继续复用 `storyBattle` 会话和 battle-demo 场景参数启动方式；正式化时再把 `prototypes/battle-demo` 的战棋规则抽进共享 application/domain 模块，避免长期依赖 iframe 原型页。

## 2026-06-12 Battle Demo Isometric Formation Prototype

### Changed
- [prototypes/battle-demo/index.html](/D:/RPG_TG/prototypes/battle-demo/index.html) 的战斗原型改为等轴 2.5D 棋盘表现，地块统一使用黄色边缘圆角正方形视觉，并按等轴坐标绝对定位。
- 玩家棋盘单位从单兵种部队改为混编编队预设，地图棋子显示编队摘要，内部保留 3x3 阵位成员数据用于战斗演出。
- 玩家操作改为点击己方编队显示移动范围，点击目标格后临时移动，并显示待机、整顿、攻击、撤回行为菜单；未确认行为前支持右键撤回，确认待机/整顿/攻击后锁定行动。
- 攻击范围改为按编队最高有效射程显示，真正进入战斗时按成员射程降级兼容：距离 1 全员可攻，距离大于 1 时射程不足成员不出手。
- 攻击结算改为弹出双侧 3x3 编队演出界面，攻方全员出手、守方全员还击，攻防交换重复两轮，并把成员兵力与编队士气写回地图层。
- 修正等轴地砖自身朝向和几何生成方式，地砖改为正方形本体旋转后再压缩投影，保证上下顶点位于同一横坐标，避免像鳞片一样竖起；地图行列投影保持原方向。
- 右键撤回移动后直接清空当前选择，方便玩家改选其他编队；编队战斗弹窗改为按成员逐次撞击播放，阵亡成员不会在后续轮次继续出手。
- 统一兵种操作取消逻辑：移动范围外、移动后行动选择期间、攻击目标选择期间点击无效位置都会撤销临时移动并清空选择；点击其他可操作己方编队时会切换选择。
- 修正玩家选择攻击后无法稳定进入编队对战的问题：攻击目标选择期间保留临时移动状态，点中敌军后才提交行动；移除火攻旧范围伤害入口。
- 敌方回合改为逐个编队顺序执行，移动时按路径逐格播放，移动后再判断是否攻击；若触发编队演出，会等待玩家关闭演出界面后再执行下一个敌方编队。
- 攻击范围改为固定形状判定：含弓兵、火器等远程成员的编队可攻击十字方向两格和对角一格，纯近战编队只可攻击十字一格；范围显示与目标锁定共用同一判定，不再受高地、瞭望或森林视野修正改变形状。
- 移动选择阶段允许点击当前棋子所在格，原地进入行动选择与攻击选定状态，并保留未确认前撤回到未选中状态的逻辑。
- 地图地块不再按地形显示底色或地形文字，基础 tile 统一为透明填充的黄色边缘，地形数据仅保留给规则判定使用。
- 战场棋盘容器使用 `ui/battle/battlegroun_forest.png` 作为背景图，黄色边缘 tile 和棋子继续叠加在背景之上。
- 战斗 UI 改为参考图式叠层排布：主地图铺满战斗界面作为底层，左侧浮动显示单位详情与 3x3 编队构成，右侧浮动显示目标/战况与日志，并隐藏原右侧调试/小地图式列表。
- 棋盘 tile 尺寸上调一档，动态缩放范围从 34-58px 调整为 40-68px，使主地图上的格子和棋子整体更大。
- 行动选项从底部固定条改为跟随当前行动棋子的纵向浮动栏目；右侧战斗日志改成带标题的独立面板。
- 战斗原型页面增加统一 125% 缩放变量，字体、主要面板、顶部/底部栏与棋盘 tile 动态范围同步放大。
- “选择攻击目标”状态下行动菜单仅保留撤回按钮，隐藏待机、整顿和攻击选项，避免目标选择阶段误触其他行为。
- 编队战斗演出从居中弹窗改为全屏战斗界面：左侧固定显示我方、右侧固定显示敌方，成员按实际 3x3 阵位坐标摆放并用椭圆立绘占位，左侧下排向左错位、右侧下排向右错位。

### Impact
- 当前仍是单文件原型实现，尚未抽入 `src/application/battle`；后续正式化应把编队演出、成员结算和地图交互状态机拆到共享 battle application/domain 模块。
- 粮车、据点、守卫战、斩首战等原有战型框架继续保留，但伤害结算开始以编队成员为主，旧的直接伤害逻辑只作为粮车和范围伤害等兼容路径使用。

## 2026-06-12 Isometric Formation Battle PRD

### Added
- 新增 [docs/battle-isometric-formation-prd.md](/D:/RPG_TG/docs/battle-isometric-formation-prd.md)，把战棋改造收口为“等轴 2.5D 地图层 + 九宫格编队演出层”的详细 PRD。

### Changed
- 明确后续战斗棋盘单位应从单兵种棋子改为混编编队，兵种作为 3x3 编队内部成员参与演出层结算。
- 明确玩家交互改为“点击编队显示移动范围 -> 点击目标格临时移动 -> 显示待机/整顿/攻击与攻击范围 -> 行为确认后不可撤销”，未确认行为前支持右键回退。
- 明确攻击进入类似《战争交响曲》的双侧编队演出界面，攻方全员出手、守方全员还击，攻防交换重复两轮。
- 明确攻击参与规则采用降级兼容射程：距离 1 时所有可战斗成员都能攻击，距离大于 1 时按成员射程过滤。

### Impact
- 该 PRD 不改变当前 `prototypes/battle-demo/index.html` 行为，但为后续战斗原型重构、`src/application/battle` 模块化和编队系统接入提供验收标准。
- 后续实现应优先复用 [src/domain/battle-formation.ts](/D:/RPG_TG/src/domain/battle-formation.ts) 的 3x3 编队契约，避免继续把兵种属性硬写成棋盘单位属性。

## 2026-06-05 Battle Formation Baseline

### Added
- 新增 [src/domain/battle-formation.ts](/D:/RPG_TG/src/domain/battle-formation.ts)，定义合战编队、3x3 阵位、单位占用规模、容量公式、编队校验和兵种发挥率纯领域函数。
- 新增 [docs/battle-formation-design.md](/D:/RPG_TG/docs/battle-formation-design.md)，记录参考《战争交响曲》的编队容量、占用规模、属性换算和后续接入顺序。

### Changed
- `src/domain/index.ts` 导出编队领域模块，便于后续 `application/battle` 和 UI 统一消费。

### Impact
- 当前变更不接入 `src/main.ts`，不改变现有战棋 Demo 行为。
- 后续战斗实现应通过共享编队结构与 `src/application/battle` 服务接入，避免把编队规则写成页面层或主循环特判。

## 2026-06-12 Rest Map Playback And Auto Return

### Changed
- 自宅与皇觉寺的休息不再在 house 内直接静默跳到最终日期；现在会先生成逐日休息快照，再切到主世界地图按天播放时间流逝，让右侧全局时间面板真实显示休息期间的日期推进与体力恢复。
- 共享 `start-map-auto-advance` 契约扩展为支持 `snapshots` 与 `completion`：house module 现在可以把“世界层播放几天时间”与“播放结束后如何回到目标 house”交给共享运行时处理，而不需要在 `main.ts` 补 house 分支。
- 休息播放结束后会自动回到原场景：在自宅休息会落回自宅并显示休息结果；在皇觉寺休息若只是普通静养则回到寺庙日常，若休息途中正好撞上评定日，则会直接重进寺庙并由 `enter()` 立即切入评定流程。
- 皇觉寺第一周工作后的“休整至评定期”也接入同一套自动收口，地图时间播放到评定日后会直接回寺开评，不再停在地图层等待额外点击。

### Impact
- “多日休息/等待”现在成为共享世界层机制：后续别的 house 若也要做可见的时间快进并在结束后回场景，可以复用同一套 snapshot + completion 契约，而不是各写一条一次性跳转。
- 休息的时间表现、回场景行为和评定入场顺序现在一致收口到共享运行时，避免再次出现“日期已经过去，但玩家还停在休息前 house 画面”或“先弹提醒、再手动找回 house”的割裂感。

## 2026-06-10 Zhu Yuanzhang Week Four Return And Story Callback Hook

### Added
- 新增共享 story callback 运行接线 [src/application/story/story-callbacks.ts](/E:/RPG_TG/src/application/story/story-callbacks.ts)；scene 中原先只占位的 `callback` action 现在可以执行注册回调，用于承接“剧情里需要留接口、但暂不落完整系统”的过渡逻辑。
- 新增共享占位战斗回调 `story.placeholder-battle`：当前可按 payload 自动写入“战斗已触发 / 已获胜 / 最后战斗 id 与结果”这类运行态，先保证剧情链可测试，后续真实个人战接入时可直接替换同一接口。
- 朱元璋主线新增第四周事件 `event.story.zhu_yuanzhang.haozhou_return_encounter`，覆盖“外地化缘返程 -> 路遇盗匪 -> 入濠州被疑为谍 -> 郭子兴留置左右”的完整转轨段。

### Changed
- 皇觉寺和尚期新增第四周评定语义：第三周远途化缘结束后的下一轮评定，仍由方丈强制派发“外地化缘”，不再回退成普通“寺内帮忙 / 外出化缘”自由选工。
- 第四周主线转折由共享进城触发链承接：玩家完成第四周外路化缘后，第一次回到濠州城就会切入“路遇盗匪 -> 城门被疑为谍 -> 郭子兴留置左右”scene。
- 朱元璋从和尚期切入郭子兴帐下的身份变更，改由共享 story callback 统一处理：包括 `stage -> guo-zixing-camp`、玩家身份改为亲兵、清空寺庙差事残留、重置帅府评定倒计时与主任务文案。
- scene 对话视图不再只吃寺庙 CSS 占位立绘；现在会优先走共享 portrait asset 解析，朱元璋、小兵、郭子兴等剧情角色都能直接显示各自 UI 目录中的真实立绘。

### Impact
- scene `callback` 终于成为真实可复用机制，后续如果还要做“剧情中先留个人战/辩论/审讯接口，系统稍后再接”，可以继续复用同一条 story callback 链。
- 第四周现在能在不引入临时 house、也不在 `main.ts` 硬写剧情分支的前提下，于返程路上完成和尚期到郭子兴线的正式转轨。
- 共享 scene 渲染拿到真实立绘后，后续新增非寺庙剧情时不必再为每个角色补一套一次性的 CSS 立绘特判。

## 2026-06-08 Temple Third Week Long-Distance Begging

### Changed
- 朱元璋和尚期开局新增第三周目大阶段 `huangjue-begging-journey`：在外出化缘解锁后的下一轮评定中，皇觉寺会强制把本轮差事定为“远途化缘”，不再让玩家在寺内帮忙和化缘之间自由切换。
- 第二周目恢复为过渡周：刚解锁化缘后的这一轮评定仍保留“寺内帮忙 / 外出化缘”自由分配，只有完整走完这一轮后，下一次评定才会切进第三周目的强制远途化缘。
- 皇觉寺第三周目的任务文本、评定方针、差事分派和出发提示改为围绕“北上颍州求粮”展开，但本轮结算仍继续复用现有寺庙交粮与贡献评价机制，只按带回寺里的粮食结算，不把传言本身做成评分项。
- 第三周目在濠州本地新增“缺粮封口”约束：城中化缘入口会明确提示“濠州近来已讨不出米”，濠州粮铺的“买粮”动作也会临时断供，从玩法上把玩家继续推向外地求粮，而不是留在本城磨时间。
- 评定优先级共享判断改为按“和尚期阶段”而不是单一 `huangjue-temple` 阶段识别寺庙评定；第三周目休息、时间推进和到期提醒不再误跳到帅府/郭子兴线，而会继续回到皇觉寺评定。
- 主线内容新增 `city-enter` 事件 `event.story.zhu_yuanzhang.runing_broadcast`：玩家在第三周第一次进入颍州时，会播报汝颍红巾、韩林儿名号与濠州郭子兴起兵的风声，用作世界铺垫和后续周目的钩子。
- `main.ts` 新增共享 `city-enter` 剧情触发接线，城市进入后会统一走现有 `triggerStoryEvents` 链，不再只能依赖 `house-enter` / `indoor-screen-shown` 两种时机承接主线。

### Impact
- 第三周目现在成为一个完整的“评定派发 -> 离寺远行 -> 外地求粮 -> 回寺交粮 -> 下轮再评”的共享循环，没有把周目推进写成 `main.ts` 的一次性剧情分支。
- “第三周必须离开濠州求粮”现在由共享阶段判断分别接入城市化缘入口、粮铺购买入口和评定优先级，不再依赖临时剧情台词硬推，也避免寺庙休息流程串到帅府逻辑。
- 后续如果别的主线也要做“进城即触发广播、街谈或阶段播报”，可以继续复用同一条 `city-enter` 触发链，而不用再给入口层补临时判断。

## 2026-06-05 Council Reminder Without Forced Return

### Changed
- 评定日期首次到达时，共享提醒现在只弹 NPC 提示，不再在点掉提示后强制把玩家送回寺庙或帅府；玩家可继续在城中或各 house 自行活动，天数也会照常推进。
- 但到评定日及逾期后，小游戏、工作、寺庙交粮和城中化缘依旧会被统一拦下，相关 NPC 会明确提示应先去参加评定。
- 顶部时间面板的评定状态改为按实际日期显示 `距离评定 X 天 / 今日评定 / 评定逾期 X 天`，不再只停留在“今日评定”。

### Impact
- 评定提醒和正式赴会彻底分离后，玩家可以自由决定何时动身赴会，同时仍被共享时长守卫限制，避免继续接长时工作把逾期拖得失控。
- 评定逾期天数现在成为稳定可见的全局信息，后续若继续扩展迟到处罚或逾期事件，可以直接复用同一状态文案。

## 2026-06-05 Timed Activity Review Guard

### Changed
- 共享评定日期 helper 新增“剩余天数不足以完整做完本轮活动”的开始前校验；粮铺算账、药铺配药、茶馆舌战、酒肆接活、寺庙寺务/交粮，以及城中化缘现在都会在入口先检查时日是否足够。
- 若离评定剩余天数少于该活动所需总天数，系统会直接禁止开始，并由当前场景 NPC 明确提示“时间不够，应先去评定”，不再让玩家先开做，也不再偷偷把时间自动快进到评定日。

### Impact
- “多天活动是否还能开做”收口成统一规则后，后续新增会耗数天的小游戏或工作时，只要复用共享时长 helper，就能自动接入评定前的时长守卫。
- 评定日前的节奏从“可能被系统半路切断”改成“开始前就说明来不及”，玩家决策会更稳定，也更符合太阁类的日程管理预期。

## 2026-06-05 Temple Review Timing Guard And Reminder Sequencing

### Changed
- 皇觉寺本轮贡献现在在每次新评定派发差事时重置，不再把上一轮累计值直接带进下一轮，避免“寺内帮忙看起来总是 45 点贡献”这类跨轮残留。
- 寺庙内多日工作、交粮回寺和城中化缘在开始前都会先检查“离评定还剩几天”；若剩余天数不足以完整做完这一轮，就不会先开做再被中途切断，而是直接把余下天数推进到评定日，再走共享评定提醒。
- 评定提醒与评定入场改为顺序触发：先显示提醒 NPC 面板，玩家点掉提醒后，才正式进入评定 house 并显示评定开场，不再出现两个 NPC 面板重叠。

### Impact
- “活动时长是否足够跨到下一次评定”现在统一在开始入口判定，寺庙工作和化缘不会再出现开始后被硬切去评定的跳变感。
- 评定提醒和正式评定台词分成两步显示后，后续如果别的阵营也要加到期提醒，可以继续复用同一条共享触发链。

## 2026-06-05 Immediate Review Trigger On Due Date

### Changed
- 共享评定触发改为“到日即触发”：只要任意时间推进让日期首次到达评定日，运行时就会立刻进入当前阶段对应的评定 house；如果玩家当时已经在该 house 内，则会直接重进当前 house 并切入评定流程。
- 这条规则现在同时覆盖 house 内活动结算、休息结算、外部化缘和地图移动后的时间推进，不再要求玩家手动再走一次“进 house”。
- 评定日真正到来时，系统现在会先弹出 NPC 提醒对话，再把玩家带入评定场所；若是休息被评定打断，对话里会一并说明本次已休息多久，以及体力恢复到了多少。

### Impact
- “评定触发”从原先偏依赖下次进入 `keep-house` / `temple-house`，收口成统一的到日触发机制；后续新增会推进时间的玩法时，只要走共享运行时，就会自动接入评定切换。
- 休息中断结算不再被自动进评定直接吞掉，后续其他“等待到某个截止日”的系统也可以复用同一条提醒通道补充结果摘要。

## 2026-06-05 Late Council Attendance And Rest Interruption

### Added
- 新增共享评定迟到 helper [src/application/time/council-attendance.ts](/E:/RPG_TG/src/application/time/council-attendance.ts)，统一计算迟到天数、五天内/五天外两档贡献处罚，以及五天外的逐出概率。

### Changed
- 自宅与寺庙的休息结果现在会明确提示：评定日一到就会中断休息，玩家可以立刻去评定，也可以先不去；若迟到赴会，会按当前阶段扣贡献并挨训。
- `main.ts` 不再把评定日做成全局硬锁；评定到期后仍可继续移动、进出其他地点或做别的事，但真正进入评定 house 时，会按迟到天数补结算处罚。
- 帅府评定现在会在迟到入场时先扣个人功劳并追加斥责开场；超过五天时有概率直接逐出郭子兴阵营。寺庙评定也会在迟到入场时先扣寺中贡献并追加斥责，但未把寺庙阶段做成随机逐出，以免直接踢断当前主线。

## 2026-06-05 Council Date Priority For Rest And Travel

### Added
- 新增共享评定日优先 helper [src/application/time/council-priority.ts](/E:/RPG_TG/src/application/time/council-priority.ts)，统一判断“是否已到评定日”以及当前阶段对应的评定场所模块。

### Changed
- 自宅与寺庙的休息流程现在都以评定日为最高优先级：无论是休息一日、指定天数，还是休至体力恢复，只要评定日期先到，就会立即中断，并按已休天数结算恢复量。
- 已进入评定场所后仍不能半途离开，必须先把当期评定处理完；但评定日不再把全局移动和其他地点硬锁死。

### Impact
- “休息推进时间”“评定日中断”和“迟到赴会处罚”现在进入同一套共享判断，不再由自宅、寺庙和 `main.ts` 各自散写不同标准。
- 评定日当天的流程优先级被抬到全局层级，后续如果继续扩展评定玩法，只需要复用同一套优先级判断即可。

## 2026-06-05 House Minigame And Work Day Costs

### Added
- 新增共享活动耗时 helper [src/application/house/house-activity-costs.ts](/E:/RPG_TG/src/application/house/house-activity-costs.ts)，统一提供“小游戏按等级递增天数”“工作固定 3 天”“天数转世界时间段数”和开始前提示文案。
- 新增共享 `activity-confirm` session overlay 数据形态，供多个 house 在正式进入小游戏 / 工作前先给出耗时与体力提示。

### Changed
- 粮铺算账、药铺配药、茶馆舌战改为按对应技能等级结算耗时：基础 10 天，等级越高耗时越长；完成后统一消耗 15 点体力，并把实际天数同步到 house-local 耗时和全局 world time。
- 酒馆工作、寺庙寺务与化缘工作统一改为耗时 3 天；开始前会由 NPC 明确提示耗时与 15 点体力消耗，结算时再同步推进世界时间。
- 粮铺、药铺、茶馆、酒馆、寺庙的相关开始入口不再直接跳进小游戏 / 工作，而是先经过确认 overlay，避免“点下去就开做”而看不到真实成本。

### Impact
- 现在 house 内“训练型小游戏”和“工作型事务”有了统一的时间刻度，不再继续沿用零散的 `时间 +1` 时段结算。
- 后续如果再加新的技能训练或工作流程，只需要复用共享 helper 并在开始入口挂 `activity-confirm`，不必重新散写天数公式和提示文案。

## 2026-06-04 Shared Time Progression For Movement And House Activities

### Added
- 新增共享时间推进 helper [src/application/time/time-progression.ts](/E:/RPG_TG/src/application/time/time-progression.ts)，统一处理 `morning -> afternoon -> night -> next day morning` 的时段推进，以及跨日时的评定倒计时、日期和文案更新。
- `HouseModuleTransitionResult` 新增共享 `timeAdvanceCost` 契约，并在 [docs/special-house-interface.md](/E:/RPG_TG/docs/special-house-interface.md) 记录用途：house 完成一次真实活动后，应通过共享运行时推进世界时间，而不是各模块自行散写 `calendar` / `timeOfDay`。

### Changed
- 地图移动完成后现在会统一推进 1 个时段；共享 map auto-advance 仍保留按天推进，用于“休整到评定日”这类整段快进。
- 粮铺调查/成交/算账结算、将领府邸问候/送礼/学习、货栈闲谈/调查/交易、药铺闲谈/疗伤/买药/配药、茶馆闲谈/请茶/打听/舌战、酒馆喝酒/交活/赌局结算、寺庙测运势/布施/交粮/寺务结算，现都会通过共享 house runtime 推进时段。
- 自宅的“过一天”改为复用共享按天推进 helper，不再继续维护一份独立的日期换算逻辑。
- 全局 HUD 日期文本改为显示“日期 + 当前时段”，让时段推进在非自宅场景中也可见。

### Impact
- 现在“移动”和“在 house 里做事”进入同一条 world time 机制，不再只有少数模块记录 house-local `time` 变量而不影响全局时间。
- 后续如果新 house 有“做一件事耗一个时段”的需求，只需要在模块返回 `timeAdvanceCost`，不需要再给 `main.ts` 增加特判或复制日期推进逻辑。

## 2026-06-04 Battle Branch Selective Integration

### Added
- 新增共享玩家粮食运行时库存 `var.player_inventory.grain_dou`，用斗作为统一单位承接粮店、城市化缘和寺庙交粮。
- 新增共享粮食单位换算 helper 与玩家体力消耗 helper，避免寺庙、粮店和化缘结果各自复制资源变更逻辑。
- `HouseOverlayViewModel` 新增结构化 `quantity-confirm` overlay，用于寺庙提交化缘粮食这类带上限的数量确认流程。
- 皇觉寺日常事务新增休息面板和本轮化缘交粮流程：可提交随身粮食、结算寺中贡献、记录本轮交粮评价并扣除活动体力。

### Changed
- 城市“化缘”按钮继续只在玩家 `title` / `occupation` 具备僧人/和尚身份时显示；皇觉寺开局不再提前赋予和尚身份，改由剃度剧情通过结构化 `patch-character` 效果写入 `挂单僧 / 皇觉寺僧人`。
- 粮店买卖粮食改为读写共享玩家粮食库存，并在进入粮店时迁移旧的粮店/市场米粮变量。
- 城市化缘小游戏完成后会将获得粮食写入共享库存，记录最近一次化缘结果，并消耗一次活动体力。
- 粮行算账、药铺配药、茶馆舌战、酒馆交活、酒馆赌局结算、寺庙寺务和化缘交粮统一接入活动体力消耗；体力不足时会在对应 house 或城市化缘入口提示先休息。
- 寺庙状态栏展示随身粮食、体力和本轮交粮结果；寺庙业务仍保留在 `temple-house` module 内，入口层只处理通用小游戏完成回调。
- [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 补充共享运行时库存和 `quantity-confirm` overlay 契约。

### Impact
- 没有直接合并 `origin/战斗`，避免覆盖本地酒馆长牌、城市 UI 和其他未提交改动。
- 后续若战斗分支继续推进体力、化缘奖励或寺庙评定，可继续扩展共享库存/体力 helper 和 typed overlay，而不是在 `src/main.ts` 写 house 特判。

## 2026-06-04 Character Select Layout Editor Target

### Added
- 新增 `character-select-screen` 布局编辑目标，选择人物界面现在可通过 live layout editor 直接拖拽调整真实界面组件。
- 选择人物界面新增默认布局预设，覆盖整体布局、左侧标题栏、人物名册面板、分页签、人物卡片网格、详情面板、底部操作区、返回按钮、分页文字和开始冒险按钮。

### Changed
- `LayoutEditorTargetId` 和 `UiLayoutByTargetId` 增加选择人物界面目标，`src/main.ts` 的编辑器打开逻辑会根据当前主界面自动选择 `start-screen` 或 `character-select-screen`。
- `docs/ui-layout-alignment-workflow.md` 补充 live target 扩展边界，并将资源扫描范围对齐为当前实际目录：`src/assets`、`ui`、`map`。

### Impact
- 后续继续接入其他真实界面时，应复用 `UiLayout`、`layout-editor-target-registry.ts`、默认 preset 和 `applyLiveLayoutBindings` 这条链路，不新增界面专属编辑器协议。
- 本次属于 UI 布局协作流程扩展，不改变 house 模块接口，也不在 `src/main.ts` 增加 house 业务分支。

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
## 2026-06-18 JSON World Data And Generic Activity QTE

### Added
- `ScenarioPackDefinition` now accepts optional `cities` and `houses` arrays, so a JSON start pack can materialize world entities instead of only swapping character/event/scene/activity data.
- Added shared `GameState.runtime.activitySession` plus a reusable `generic.qte` activity session runner. Scene `start-activity` now opens an interactive QTE overlay and settles configured outcome effects only after the player clicks through the rounds.
- Liu Bang's JSON opening pack now defines `city.pei_county` and starts Liu Bang, Xiao He, and Lu Wan in that city.

## 2026-06-29 Navigation Time Event Runtime Extraction

### Added
- 在 `src/core/contracts/` 新增 `event-runtime.ts` 与 `scene-runtime.ts`，明确 Child 3 的事件候选、事件激活、scene handoff、task action、task signal 这些过渡期合同。
- 在 `src/core/runtime/` 新增 `navigation-runtime.ts`、`time-runtime.ts`、`event-runtime.ts`、`event-candidate-selector.ts`、`event-condition-evaluator.ts`、`event-activation.ts`、`scene-runtime.ts`、`scene-session.ts`、`scene-choice-resolution.ts`，把导航入口、时间推进入口、事件候选选择、事件激活、scene 会话接力拆成独立 seam。

### Changed
- `src/main.ts` 不再在对应入口点直接内联 `enterCity()`、`advanceGameStateOneDay()`、`advanceGameStateTimeSegments()` 和 `triggerStoryEvents()` 作为唯一控制路径，而是先创建 typed runtime request，再经由 Child 3 的 runtime wrapper 进入导航、时间、事件、scene seam。
- `src/core/contracts/runtime-request.ts` 的 `tick` 请求现在支持可选 `payload`，以便时间推进 seam 携带段数等最小 runtime 输入。
- `src/core/contracts/runtime-result.ts` 现在可以携带 `scene`、`taskActions` 与 `taskSignals`，为后续 Task Runtime / Interactive Runtime 抽离预留统一返回通道。

### Impact
- Child 3 让 `main.ts` 第一次从“直接控制导航/时间/剧情触发”转成“创建 request 并交给 runtime seam”，后续 Child 4 可以在这个基础上继续把 interactive/minigame/story-battle 接到统一 runtime。
- 事件系统和 scene 系统现在已经有第一层明确的 core-runtime 接缝，但仍然是过渡实现：具体剧情播放和任务状态机还没有被完全抽离，后续要继续通过 Child 4/后续 task runtime work 收口。

### Changed
- Runtime city and house registries in `main.ts` are now resettable and scenario-pack aware, rather than fixed startup constants.
- `generic.qte` no longer auto-completes activities. Missing specialized handlers now fall back to the same click-bar interaction shape used by the Zhu Yuanzhang temple work QTE.

### Impact
- JSON packs are closer to the intended “runtime input JSON -> new opening/game variant” loop: world location data can be carried by the pack and consumed by the existing runtime.
- Activity results remain schema-driven through `ActivityDefinition.outcome`; runtime does not infer behavior from activity labels or scene text.

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

## 2026-06-04 Temple Grain Submission And Shared Grain Inventory

### Added
- 为 shared house overlay 契约补入“数量确认浮层”约束，用于“从背包里选择提交数量”这类结构化交互。
- 皇觉寺第二周外出化缘新增正式交粮浮层：点击住持后可输入本轮实际上交的粮食数量，再按该数量评级与结算贡献。

### Changed
- 粮食持久存储从粮铺私有 `var.grain_shop.food` 收口到共享背包库存路径，粮铺买粮与城中化缘小游戏都会把粮食写入同一份玩家库存；旧的粮铺粮食变量会在读取或变动时迁入共享库存。
- 粮食数量的底层基准单位统一改为“斗”，并补入共享换算规则 `1 石 = 10 斗`；粮铺继续按“石”交易和报价，寺庙按“斗”提交，但两边都经过同一套换算与格式化函数。
- 皇觉寺化缘线路不再依赖“小游戏未领取粮食”这种来源专属状态；只要背包里有粮，就可以回寺向住持提交，提交后才进入“静候下次评定”。
- [docs/special-house-interface.md](/E:/RPG_TG/docs/special-house-interface.md) 补充了“同一资源不得分裂成多套 house 私有库存”和“数量确认浮层”的共享规则。

### Impact
- 后续如果其他 house 也要消耗、上交或拆分同一类商品，可以直接复用共享库存与数量确认浮层，而不必再做来源特判或会话态临时结算。
- 寺庙第二周“化缘 / 买粮 / 回寺交粮 / 等待评定”的闭环现在按同一份背包数据运行，任务推进不再受粮食来源限制。

## 2026-06-04 Activity Stamina Cost

### Added
- 新增共享玩家体力结算 helper，统一处理小游戏和工作完成后的体力扣减。

### Changed
- 所有内置小游戏完成一次后都会扣除 15 点体力，结算不区分成功、失败或评级高低。
- 酒馆提交工作、寺庙寺务 QTE 结算、寺庙化缘交粮等工作完成点也统一扣除 15 点体力。
- 粮行算账、药铺配药、茶馆舌战、寺庙工作、酒馆工作等结果面板补入 `体力 -15` 提示。

### Impact
- 体力消耗从单点规则改为共享机制，后续新增小游戏或工作流时只需接入统一结算 helper，不必各自复制扣体力逻辑。

## 2026-06-04 Temple House Rest Flow

### Added
- 皇觉寺 `temple-house` 新增与自宅同结构的休息菜单：`休息一天 / 休息指定天数 / 休息到评定日期 / 休息到恢复体力`。
- 寺庙会话态补入 `rest-days` 输入浮层与 `rest` 日常面板，用于寺内静修的 typed overlay 与菜单切换。

### Changed
- 寺庙模块现在可在屋内直接推进日期、递减评定倒计时并恢复玩家 `stamina`，仍然完全走 `temple-house` 生命周期与结构化 overlay，不向 `src/main.ts` 添加寺庙休息分支。
- 若在寺中休息时正好推进到评定日，寺庙会从日常模式自然切回自身评定流程，而不是停留在一个与评定日期脱节的日常会话态。

### Impact
- 皇觉寺获得了与自宅接近的“歇脚 -> 恢复体力 -> 等待评定”节奏，但没有把自宅私有 `var.home.*` 恢复数据直接硬绑到寺庙模块。
- 2026-06-04：体力不足时，禁止开始会消耗体力的内置小游戏与工作流程，并在城市场景、粮行算账、药铺配药、茶馆舌战、酒馆接活/交活、寺庙寺务/化缘交粮入口统一改为 NPC 劝玩家先休息后再来。
