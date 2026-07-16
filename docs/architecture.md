# 架构设计

## 1. 分层原则

整个项目按四层拆开：

1. `content`：纯数据内容层  
   城市、人物、房屋、事件脚本、任务、物品、音乐、背景图配置都放这里。
2. `domain`：领域模型层  
   定义类型、规则、状态结构，不写页面框架耦合代码。
3. `application`：流程编排层  
   负责点击、切场景、执行 action、改属性、发任务、进小游戏。
4. `ui`：界面呈现层  
   只根据状态渲染，不直接写业务规则。

核心要求：

- 内容和逻辑分离
- 页面和数据分离
- 小游戏和主流程分离
- 模组和本体分离

## 2. 核心对象关系

```text
Map
  └─ City[]
      └─ House[]
          ├─ defaultCharacterId
          ├─ Character[]
          └─ module / event hooks

Character
  ├─ portrait / stats / flags
  ├─ availableFunctions[]
  └─ interaction scripts

FunctionEntry
  ├─ trade
  ├─ minigame
  ├─ modify-stats
  ├─ open-scene
  └─ custom

Event
  ├─ metadata(id / chapter / once or repeatable)
  ├─ trigger(timing / scope / priority)
  ├─ conditions(all / any / not)
  ├─ participants(required characters)
  └─ entrySceneId

Scene
  └─ ActionNode[]
      ├─ background
      ├─ music
      ├─ dialogue
      ├─ choice
      ├─ jump
      ├─ effect
      ├─ start-event
      └─ callback

GlobalUI
  ├─ playerCard
  ├─ activeMission
  ├─ overlayView
  └─ houseSession
```

## 3. 玩法对应的数据拆法

### House

`House` 只描述“可进入的地点”和它的默认交互状态：

- `backAction`：返回上一级
- `characterIds`：房屋中可交互角色
- `defaultCharacterId`：默认打开主角色
- `activityLocationId`：可选的城市级流动 NPC 槽位
- `moduleId`：可选的特殊 house 行为绑定
- `onEnterEventId`：进入房屋时触发的事件入口
- `onLeaveEventId`：离开房屋时触发的事件入口

不要把人物详细数据直接塞进 `House`，只保留 ID 引用，避免多人编辑时互相冲突。

对特殊 house，有额外硬约束：

- 不从 `house.id` 做业务特判
- 不在 `main.ts` 写具体 house 分支
- 统一走 `moduleId -> registry -> runtime`

详见 [special-house-interface.md](D:/RPG_TG/docs/special-house-interface.md)。

### Event / Scene / Action

你给出的：

```text
背景(评定间)
音乐(盛夏的决斗)
对话(木下藤吉郎, 右, "主公，请把这个任务交给我吧！")
对话(织田信长, 左, "噢？那你就试试看吧，猴子。")
选择肢("接受任务", "拒绝并推荐他人")
```

适合做成声明式 action 流，而不是散落在组件里的 if/else。

好处：

- 编剧和程序能分工
- 后续方便模组覆盖
- 可做回放、存档、调试
- 可插入条件跳转

但只做 `Scene -> Action[]` 还不够。更接近《太阁立志传 V DX》官方事件编辑器的做法，是把“事件入口”和“场景脚本”拆开：

- `EventDefinition`：回答“什么时候触发、谁能触发、触发几次”
- `SceneDefinition`：回答“触发后播什么内容”
- `ActionNode`：回答“每一步具体演什么、改什么”

这样后续才能稳定支持：

- 事件排查
- 剧情串联
- 一次性事件与可重复事件
- 章节差异
- 模组覆盖触发条件而不重写整段演出

### Character

角色至少拆成四块：

- 基础资料：姓名、头像、立绘、阵营、所在城市
- 属性数值：统率、武力、政务、魅力、财富、亲密度等
- 状态标签：身份、是否可招募、是否在场、是否出仕
- 交互功能：交易、小游戏、属性变化、触发剧情

### City

`City` 负责组织房屋，不直接处理角色行为：

- `houseIds`
- `travelCost`
- `neighbourCityIds`
- `tags`
- `prosperity`
- `danger`
- `specialDemand`

### Map

地图层只处理：

- 当前所在城市
- 相邻城市
- 移动消耗
- 大地图连续坐标到六边形路径的转换
- 点击城池进入

地图不要直接知道某个角色说什么，这属于 scene 层。

大地图移动必须由 `src/application/navigation/travel-to-coordinate.ts` 生成路径。UI 点击层只提供目标坐标，主运行时按路径分段播放；不要在视图层或 `main.ts` 临时改回起点到终点的直线插值。

Campaign 地图的水域/陆地语义来自当前地图的已保存 Hex 数据图。`MapDefinition.campaignHexGridUrl` 指向 `campaign-hex-grid-v1` JSON，包含每个 hex cell 的 `land`、`referenceHeight`、`terrain` 和 `environment` 字段，并记录它当初如何从 `map_ground_types`、`map_heights` 和 `map_climates` 采样生成；`terrain` / `environment` 是后续机制可编辑的玩法语义，`referenceHeight` 是 renderer 生成地形高度的唯一原图高度参考。当前 `terrain` 的默认值是“平原”，生成器可用 `terrainSampler` 把部分陆地格覆盖为“山脉”，`environment` 的默认值是“草地”，生成器可用 `environmentSampler` 把部分陆地格覆盖为“森林”。`campaign-terrain-webgl.ts` 必须优先读取这份 Hex 数据图，并由它生成 passable hex 网格、点击通行检查、岸线边界链、terrain shader 的 `uMaterialSemanticTexture` 和临时渲染高度网格；缺少 `campaignHexGridUrl` 的旧地图才允许回退到直接采样 `map_ground_types` / `map_heights`。`uMaterialSemanticTexture` 是一格 Hex 一个 texel 的语义纹理，shader 必须先把像素归入 rounded Hex cell 再读取它；当前 R 通道表示 land/water，G 通道表示 `terrain: "山脉"`，B 通道预留给后续语义。有 Hex 数据图时，世界地图原图采样必须在生成 Hex JSON 后结束，runtime renderer 不得把 `map_heights` 当作覆盖整张地图的真实高度场；它只能把 Hex `referenceHeight` 展开成 WebGL 绘制所需的临时细分高度 samples，并用这些 samples 统一驱动 terrain mesh、法线、地形投影、玩家/marker/城市/植被贴地高度。原始 `map_ground_types` 贴图可以继续给 shader 做地貌颜色参考、作为生成器输入和旧地图回退来源，并维持浅水区、深水变化和水面内部噪声等旧视觉采样路径，但不得作为有 Hex 数据图时最终“当前像素属于水侧还是陆侧”的判定入口。近岸区属于贴当前岸线的窄水侧 tint，应跟随 Hex semantic 派生出的当前水陆边界；浅水区属于更宽的水体内部层，继续保留旧距陆效果和旧水体噪声，但其最终水侧 coverage 必须使用当前岸线的 `boundaryWater`，不得再用旧 `map_ground_types` 采样结果裁掉当前已经属于水侧的像素。navigation 层只消费这份通行网格做寻路，不要在 gameplay 代码里手写某张地图的水格坐标或用据点白名单修补通行性。

Campaign 地图的森林造景来自可选 `MapDefinition.campaignVegetationRulesUrl`。该字段指向 `campaign-vegetation-rules-v1` JSON，由内容资产决定哪些 `environment` 触发植被、使用哪些转换后的 mesh、远景/中景/近景密度、LOD 阈值、海拔上限、边缘留白、避让半径、贴地投影和 shader 表现参数；`campaign-terrain-webgl.ts` 只能把 `campaignHexGridUrl` 中 `environment: "森林"` 的格子按规则展开为视口内视觉实例，不得把森林造景写回 Hex 数据图、通行网格、寻路、点击或 gameplay 状态。森林 `altitude.maxTerrainHeight` 使用 renderer 已派生出的最终 `heightSamples` 判断，超过上限的森林格中心和格内候选树点都不得生成植物；被海拔上限裁掉的候选点会消耗该格的目标生成名额，不得在同一格内重新抽点补生成。该限制只裁剪视觉实例，不改变 Hex `environment`、通行性、探索或事件语义。OBJ/MTL 自然景观素材属于离线源素材，必须先经 `tools/convert-campaign-vegetation-obj.mjs` 转成 `campaign-vegetation-mesh-v1` 顶点色 mesh 后再由运行时加载；浏览器 runtime 不直接解析 `src/3dasset/obj`。森林 vegetation shader 的语义层是“静态树模型顶点色 + 地形同向相机光照 + 树干锚定的动态长条阴影 + LOD 可见性/密度控制”：语义来源是 Hex environment 和 rules JSON，远景密度必须作为缩放保底而不是清空森林；当 `maxVisibleInstances` 不足以绘制所有可见目标实例时，renderer 必须按屏幕区域均匀降密度，禁止按视口中心距离截断到某些森林区域完全不显示。运动必须为 none，植被片元必须按不透明模型绘制，树身明暗必须复用 terrain shader 的 `centerToFragment` 相机光照输入和 `uTerrainCameraLightHeight` / `uTerrainCameraLightHorizontalPull` 参数，但树这类实体的可投影方向必须限制在相机前向半平面，贴地投影必须在屏幕方向换算后落到受光面的背侧并经当前 terrain camera 矩阵反投到地图平面，禁止新增 vegetation 专用光源、禁止影子围绕树 360 度旋转，也禁止影响陆水、岸线、探索、marker 交互和路径模型。

Campaign 地图的水体视觉来自可选 `map_water_noise` 图层。该图层是纯表现资产：`map-view.ts` 只把它作为 terrain canvas 的 `data-map-water-texture-url` 传给 WebGL renderer；水体表现不得改变点击、投影、通行性或 navigation 路径模型。

Campaign 地图的陆地表面材质可以通过 `map_grass_texture`、`map_sand_texture`、`map_rock_texture`、`map_snow_texture` 等纯表现图层传给 terrain shader。此类图层只能影响地表颜色、纹理和海岸/地貌过渡表现；陆地/水体语义、寻路、点击、探索和云洞仍必须以 `campaignHexGridUrl` 指向的 Hex 数据图与 runtime 状态为准。`map_rock_texture` 必须由 Hex 数据图中的 `terrain: "山脉"` 驱动，shader 只能在当前 rounded Hex cell 已经是山脉时显示岩石材质，并在山脉格内部沿非山脉邻边向内羽化；不得把山脉 mask 平均、膨胀或扩散到非山脉格，也不得反向从岩石贴图或 shader 颜色推断 gameplay terrain。`map_snow_texture` 是叠加在山脉岩石上的高处雪顶表现层，必须同时受山脉 mask、最终 `heightSamples` 派生的 fragment 高度、坡面朝上程度和细节噪声控制；雪线只能在山脉格内部形成类似文明的山顶积雪与破碎雪缘，不得扩散到非山脉格、低山山脚或水陆/海岸语义层。真实山脉起伏由 CPU 派生高度生成：山脉格的基准层必须来自普通陆地高度连续性，也就是从非山地陆地高度扩散并平滑得到山地底面；Hex `referenceHeight` 只能作为山体增量强度和高度上限的参考输入，不得直接作为整片山地基准层把山脉格整体抬高，也不得做山脉专用对比度拉伸。最终山体必须按 terrain 网格采样点生成连续山脉内部的世界空间峰体、主脊、次脊和沟壑，山峰/山脊中心不得绑定到单个 Hex 本地坐标；细节噪声可以使用基于局部梯度幅值衰减 octave 权重的 fBm 辅助侵蚀感，但不能取代 CPU 几何主形状。山体不能退化成每个 Hex 一个随机高度、一个孤立峰值、按格断开的山包、针状尖峰、整格高原块或只是皱褶化的鼓包；山脚与岩石材质过渡仍由既有 `getLocalMountainEdgeInset` 负责，山体形状规则不得另起一套山脚过渡或材质 body mask。相邻山脉格必须作为整体连续处理，内部山脉邻接边不压低，只有整片山脉外边界按边界距离和噪声向内压低；非山脉陆地格在进入山脉高度生成前必须按单格平均高度做内部平整化，并只在同一 Hex 内做小范围平滑，削弱 Hex `referenceHeight` 在平原、草地、森林等格之间留下的尖锐起伏；非山脉格不执行山脉专用高度规则，只通过通用地形连续性与相邻高度自然衔接。Campaign terrain renderer 会在地形光照之后应用统一的历史色调层：保留材质原本色相，轻微暖化并压住过亮高光，避免单个材质或植被资产以高亮度破坏大地图厚重感，也不得把整体压成失去地貌颜色的灰图。

Campaign 地图的岸线边界表现必须从当前 Hex 地图的陆水相邻关系派生。岸线可以在 terrain shader 中用连续 chain 里程噪声扰动水陆交界 mask，并由该 mask 直接决定当前像素走水侧还是陆侧材质；当扰动把陆地视觉区域推出原本 Hex 边界时，推出区域的陆地材质、沙滩权重和 atlas 细节必须继承相邻来源陆地 Hex，而不是继续读取当前水 Hex 的材质语境；不得把原图像素 mask 当作岸线来源，不得在岸线上叠加额外假水内容，也不得替代或重写 `map_water_noise`、近水区、深浅水等水体内部 shader 职责。

Campaign 地图 camera 的缩放、平移和由缩放派生的俯角都属于 terrain renderer 的表现层参数。`main.ts` 只能同步当前视口调试状态和动画化 camera 输入；gameplay 网格、路径、探索、点击判定和地图数据结构不得依赖当前俯角。

Campaign 地图的迷雾探索状态来自 `runtime.mapExplorationByMapId`。未探索 hex 的点击屏蔽、marker 交互屏蔽必须在应用交互层完成，和水格通行检查保持独立；视觉云雾 renderer 只能消费探索状态生成遮罩，不得修改探索、寻路、地形高度、水体材质或通行网格。`campaign-terrain-webgl.ts` 负责地形投影、相机、通行网格和投影点同步；`campaign-cloud-webgl.ts` 负责视口级云雾 overlay，并通过 `campaign-terrain-webgl.ts` 的只读固定云洞高度投影 helper 对齐累计已探索 hex。云洞 reveal mask 必须跟随当前 terrain camera 的平移、缩放和视口尺寸，但不得采样 `map_heights` 或使用逐格高度锚点投影；玩家、marker、hover 描边等贴地对象仍可使用高度锚点投影。地图重绘时必须保留 terrain、actor、cloud canvas，并保留带稳定身份的 marker / summary DOM 节点，同时同步新 markup 的语义 `data-*` 属性，避免移动或探索状态更新导致 WebGL program、贴图、动画时间或地图标识节点重建。可踏足 hex 的悬浮描边属于地图视口内的临时表现反馈，只能读取地形投影、探索状态和 navigation 寻路结果，不得写入 gameplay 状态。层级契约是：地图底图、建筑点本体、玩家 DOM sprite 和 actor canvas 在云层下方；可踏足 hex 悬浮描边、marker 悬浮详情、地图 debug 控件、全局 UI 和确认 modal 在云层上方。视觉算法细节属于 renderer 源码和 changelog，不应写入架构文档。

Campaign 地图 WebGL renderer 的 GPU 程序资源应放在 `src/ui/views/map/shaders/*.glsl` 中，并由 renderer 通过 raw import 加载；不要把大型 GPU 程序作为模板字符串内嵌在 TypeScript renderer 文件里。

### 3D Renderer 依赖边界

项目可以使用 `three` 作为 3D / WebGL 表现层基础库，但它只属于 `ui` 渲染边界：

- `three` 只能由 `src/ui/**` 下的 renderer、view 或表现层 helper 直接导入。
- `content`、`domain`、`application` 和 runtime 模块不得依赖 `three` 类型、对象实例或 scene graph。
- `THREE.Scene`、`Object3D`、`Mesh.userData`、材质、相机、raycast 命中结果等只能表达画面状态或输入拾取结果，不得成为持久玩法状态来源。
- 玩法状态、探索、通行、事件、任务、house 会话和资源变化必须继续通过统一 game state / runtime 结构流转。
- renderer 可以消费 view model、asset URL、camera / viewport 参数和只读 gameplay projection helper，但不得直接修改 gameplay 状态。
- 现有裸 WebGL 地图 renderer 不要求一次性迁移到 `three`；后续新增 3D 场景、模型、特效、拾取或后处理时，优先在新的 `src/ui/**` renderer 边界内使用 `three`。

### 全局栏目

常驻 UI 独立建模，不挂在某个页面组件下面：

- 左上角角色卡
- 主任务追踪
- 通用资源条
- 通知/提示
- 全屏浮层
- house 会话态

这样地图、城市、房屋、剧情页都能共享同一套全局面板。

## 4. 当前推荐状态结构

```ts
type GameState = {
  world: {
    currentMapId: MapId;
    currentCityId: CityId;
    currentHouseId: HouseId | null;
    timeOfDay: "morning" | "afternoon" | "night";
    schedule: {
      councilDate: {
        year: number;
        month: number;
        day: number;
      };
    };
  };
  player: {
    characterId: CharacterId;
  };
  calendar: {
    chapterId: string;
    year: number;
    month: number;
    day: number;
  };
  scene: {
    activeEventId: EventId | null;
    activeSceneId: SceneId | null;
    cursor: number;
    status: "idle" | "playing" | "waiting-choice";
  };
  ui: {
    currentView: "map" | "city" | "house" | "scene" | "minigame";
    visiblePanels: GlobalPanelType[];
    pinnedCharacterId: CharacterId;
    activeMissionId: MissionId | null;
    reviewDateText: string;
    mainHouseMissionText: string;
    overlayView: "detail" | "cards" | "valuables" | null;
    cardLibraryFilter: CardLibraryFilter;
    valuableLibraryFilter: ValuableLibraryFilter;
    valuableLibrarySortKey: ValuableLibrarySortKey;
    valuableLibrarySortDirection: "asc" | "desc";
    houseSession: ActiveHouseModuleSession;
  };
  missions: {
    activeMissionId: MissionId | null;
    completedMissionIds: MissionId[];
  };
  cards: CardInventory;
  valuables: ValuableItemInventory;
  runtime: {
    flags: Record<string, boolean>;
    variables: Record<string, number | string>;
    cityNpcPools: Record<CityId, CityNpcPoolRuntimeState>;
    cityMarkets: Record<CityId, CityMarketData>;
    eventHistory: Record<
      EventId,
      { firedCount: number; lastTriggeredOn: string | null }
    >;
  };
};
```

关键边界：

- `calendar` 和 `runtime.eventHistory` 是事件系统必须的基础字段
- `runtime.cityNpcPools` 是城市共享流动 NPC 的统一运行态
- `runtime.cityMarkets` 是跨 city 的统一市场运行态
- `ui.houseSession` 是特殊 house 的统一临时会话态
- `cards` / `valuables` 属于统一玩家运行态，不允许 house 私自重置

## 5. 特殊 House 运行规则

特殊 house 不属于普通静态房屋展示，它们是挂在统一 house runtime 上的业务模块。

当前约束：

- `HouseDefinition.moduleId` 负责行为绑定
- `src/application/house-modules/house-module-registry.ts` 负责模块注册
- `src/ui/views/house/house-module-view-registry.ts` 负责视图注册
- `src/application/house/house-runtime.ts` 负责统一 enter / dispatch / leave 调度

禁止：

- 在 `main.ts` 写 `if (isGrainShopHouse(...))`
- 在 `application` 返回 HTML 字符串
- 在 house 模块外写顶层会话全局变量
- 在进入 house 时覆盖玩家金钱、技能、库存等基础数据

## 6. 事件触发规则设计

推荐把触发规则分成三段，不要把所有判断都塞进一个 `if`：

1. `trigger`  
   定义检查时机，例如 `house-enter`、`talk`、`travel-complete`、`indoor-screen-shown`。
2. `conditions`  
   定义必须满足的世界状态，例如章节、日期、人物存在、家势关系、城池归属、事件前置。
3. `participants`  
   定义本事件要求谁必须可参加。

### 触发时机

建议首批内建这些时机：

- `manual`
- `game-start`
- `date-change`
- `turn-end`
- `travel-complete`
- `city-enter`
- `house-enter`
- `indoor-screen-shown`
- `talk`

注意：`trigger` 只负责“何时检查”，不负责“能否通过”。

### 条件表达

条件不要只做扁平数组，必须支持组合逻辑：

- `all`
- `any`
- `not`

否则后面做历史事件、势力事件、分支剧情时会迅速爆炸。

建议内建条件：

- `flag`
- `variable`
- `event-fired`
- `event-fired-count`
- `months-since-event`
- `chapter`
- `date`
- `location`
- `character-exists`
- `character-available`
- `character-in-clan`
- `character-in-city`
- `clan-exists`
- `clan-relation`
- `city-owner`
- `mission-status`
- `custom`

### 事件优先级

同一时机可能满足多个事件，所以 `trigger.priority` 必须存在。否则：

- 同地点多个事件会抢触发
- 模组追加事件时顺序不可控
- 调试时无法解释“为什么触发的是 B 不是 A”

### 一次性与连锁

官方事件设计天然很依赖前置事件和一次性属性，所以 HTML 版也要把这两类规则放进领域模型，而不是交给页面层偷偷处理：

- `occurrence: "once" | "repeatable" | "once-per-chapter"`
- `nextEventId`
- `eventHistory`

## 7. 对齐官方模组工具后的约束

如果后面想保留“可导出为类似官方事件脚本”的可能性，当前工程应提前遵守这些约束：

- 所有事件必须有稳定字符串 ID
- 事件入口和演出内容要分离
- 事件脚本必须能串联其他事件，而不是只能跳 scene
- 文本内容、资源调用、数据修改都要声明式记录
- 事件触发不能依赖组件生命周期副作用
- 内容层必须可序列化，不能塞函数闭包

换句话说，浏览器版不要直接模仿官方脚本语法，但要模仿它的“结构化约束”。

## 8. 模组化要求

后续一开始就按可模组覆盖来设计：

- 所有核心内容对象都必须有稳定 ID
- 内容文件只做追加或覆盖，不依赖硬编码数组顺序
- 场景脚本引用对象统一走 ID
- 资源路径统一走资源注册表
- 自定义行为统一走 `custom` action / function handler 扩展点

建议约束：

- 本体数据：`src/content/base`
- 模组数据：`mods/<mod-id>/content`
- 加载顺序：本体 -> DLC/官方扩展 -> 用户模组
- 同 ID 后加载覆盖前加载

## 9. CSS 拆分原则

CSS 不按页面随便堆，按责任拆：

- `tokens.css`：颜色、字号、间距、层级、阴影、动画时长
- `base.css`：reset、元素默认样式、排版基线
- `layout.css`：页面骨架、全局栏位、主舞台布局
- `components.css`：按钮、面板、头像卡、对话框、选项框
- `views.css`：地图页、城市页、房屋页、剧情页的专属布局

命名规则：

- `l-`：layout，如 `l-shell`
- `c-`：component，如 `c-dialog`
- `view-`：页面，如 `view-map`
- `u-`：utility，如 `u-hidden`
- `is-` / `has-`：状态，如 `is-active`

不要这样写：

- `left-box`
- `big-button`
- `page2-panel`

因为多人协作时这些名字很快会失控。

## 10. 并行开发切分建议

适合拆给不同成员同时开发的模块：

1. 地图与移动系统
2. 城市与房屋导航
3. 角色资料与角色功能系统
4. 剧情 action 执行器
5. 全局 UI 面板
6. 交易系统
7. 小游戏接入层

公共约束：

- `domain` 类型改动必须先更新文档
- 内容配置不得直接调用 DOM
- UI 组件不得写死剧情台词和人物属性逻辑
- 小游戏只通过标准输入输出接口接入主流程
## 0. 开发原则补充

### 机制优先，不写一次性流程

项目中的玩法开发优先提炼为可复用机制，而不是把当前需求写成一次性剧情插片、一次性 house 特判或一次性 UI 流程。

遇到以下需求时，应先判断是否已经存在可抽象的共享骨架：

- 评定 / 议事 / 周期推进
- 贡献统计、排名、嘉奖
- 方针宣布、任务分派
- 时间快进、等待截止日、自动回场
- 通用小游戏外壳

如果当前实现方式看起来像：

- 某个 house 的临时专属分支
- 剧情推进中的手工拼接节点
- 另一套已有机制的复制版本

则优先回退一步，先抽取共享状态机、共享 runtime contract 或共享组件，再落回具体内容数据。

### 内容变化放数据，流程骨架做共享

同类玩法的差异优先放在 `content` / 配置层，不要把流程差异硬编码在 `application` 分支里。

例如：

- 第一次寺庙评定和第二次寺庙评定，可以共用同一评定流程骨架，只替换贡献榜、嘉奖词、方针文本和可选工作列表。
- 帅府评定、寺庙评定、未来其他阵营评定，应优先共用同类阶段推进机制，而不是各写一套“看起来差不多”的逻辑。

### 参考成熟历史模拟设计，不从零编造概念

本项目是太阁类历史模拟玩法，不应在已有成熟范式存在时从头发明核心玩法概念。

开发新系统前，优先按以下顺序思考：

1. 仓内是否已经有类似机制。
2. 太阁系与其他经典历史模拟游戏是否已有成熟节奏和结构。
3. 是否可以在既有 genre 设计上做本项目语义化落地。

只有在“仓内没有、经典范式也不适配”的情况下，才考虑新增完全原创机制。
