# 元末风云录 HTML 项目 Agent 知识库

这份文档给后续 agent 作为入口：目标不是完整复刻 Medieval II 引擎，而是把元末模组拆成可被 HTML/WebGL 项目消费的地图、地点、角色、事件、剧情和素材数据。

## 当前模组根目录

当前有效目录是：

```text
D:\RPG_TG\map\yuan mo feng yun lu\mods\yuanmofengyunlu
```

不要再使用旧的三层嵌套路径：

```text
D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu
```

## 已生成的数据文件

- `generated/yuanmo-npcs.json`：361 个开局角色，含中文名、坐标、派系、身份、年龄、画像、战斗模型、traits、列传和称号。
- `generated/yuanmo-npc-summary.json`：NPC 统计和大都/顺天附近样本。
- `generated/yuanmo-events.json`：历史事件调用、标题正文、触发 monitor、脚本片段、刷兵/控制台命令/计数器摘要。
- `generated/yuanmo-event-summary.json`：事件统计、章节分布和前 20 个样例。

重新生成：

```powershell
node tools\extract-yuanmo-npcs.mjs
node tools\extract-yuanmo-events.mjs
```

## 地图素材和坐标

核心源目录：

```text
D:\RPG_TG\map\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\base
```

优先使用：

- `map_regions.tga`：509x451 区划色块图，是逻辑坐标和区域拾取的核心。
- `descr_regions.txt`：区域定义表，把 RGB 颜色映射到 region、capital、初始归属、宗教等。
- `descr_strat.txt`：开局城市、角色、军队、要塞、资源点、派系归属和坐标。
- `map_heights.tga`：1019x903 高度图。蓝色水域应直接视为最低高度；非水域颜色越浅越高。
- `map_ground_types.tga`：1019x903 地表类型图，可用于分类材质或地貌着色。
- `water_surface.tga`、`map_roughness.tga`、`map_climates.tga`：后续做水面、粗糙度、气候过渡时再接入。

坐标约定：

- 前端地点逻辑坐标优先按 `map_regions.tga` 的 509x451 网格处理。
- `descr_strat.txt` 中人物和地点坐标基本落在这个坐标系内。
- 当前 WebGL 版本里，点位已经验证应使用同一个 3D 投影矩阵转成百分比 `left/bottom`。不要回退到像素级 `top/left`，否则真 3D 透视下会偏移。

## 当前 HTML/WebGL 地图实现要点

主要文件：

- `src/ui/views/map/campaign-terrain-webgl.ts`
- `src/ui/views/map/map-view.ts`
- `src/main.ts`
- `src/styles/prototype.css`
- `src/styles/views.css`

已验证的方向：

- 地图是满屏背景组件，不再保留旁边 atlas 分栏。
- 使用 `HD.png` 作为主地表贴图。
- 使用 `yuanmo-map-heights.png` 做起伏。
- 使用 `tie1.png` 作为第二采样纹理做地表分类/材质参考，但不要再叠加强烈油亮的后期暗化。
- 真 3D 透视相机已接入，拖动/缩放时地图有透视变化。
- 地点标识大小和字体不要随地图缩放而放大；tooltip 也应自适应屏幕。
- 顺天府目前代替旧的测试城市入口，点击后仍进入原型城市/宅邸流程。

## NPC 数据来源

NPC 抽取脚本：

```text
tools/extract-yuanmo-npcs.mjs
```

关键源文件：

- `data/world/maps/campaign/imperial_campaign/descr_strat.txt`
- `data/text/names.txt`
- `data/export_descr_character_traits.txt`
- `data/text/export_vnvs.txt`
- `data/export_descr_ancillaries.txt`
- `data/text/export_ancillaries.txt`

当前统计：

- 角色总数：361
- 中文名覆盖：361
- 有列传/描述：296
- 有称号：164
- 主要身份：named character 291，general 65，另有 admiral、spy、diplomat、merchant。

使用建议：

- 地图上的人物点位直接用 `x/y`。
- 人物详情页可展示 `name`、`epithet`、`biography`、`age`、`faction`、`portrait`。
- `traits` 里有能力、性格、民族、宗教、官职等信息，适合后续做语义标签，但不要直接把所有 trait 文本当人物列传。

## 事件和剧情数据来源

事件抽取脚本：

```text
tools/extract-yuanmo-events.mjs
```

关键源文件：

- `data/world/maps/campaign/imperial_campaign/campaign_script.txt`
- `data/text/historic_events.txt`
- `data/text/event_strings.txt`
- `data/text/event_titles.txt`
- `data/text/missions.txt`
- `data/text/campaign_descriptions.txt`

当前统计：

- `campaign_script.txt` 约 30940 行。
- `monitor_event` / `monitor_conditions` 解析出 370 个监听块。
- 含 `historic_event` 的监听块：79 个。
- `historic_event` 调用：82 次。
- 唯一事件 ID：73 个。
- 有标题：48 个。
- 有正文：47 个。
- `declare_counter`：286 个。

重要事件类型：

- 开局介绍：`DESCR`、`DESCRT`、`DESMUGHAL`、`YIZHIYAN`。
- 正史演绎：`lishizhengshi` 选择后触发 `WUGUOGONG`、`WUSHANGFA`、`SONGJIANGXIANG` 等。
- 名城易主：`LOST_YINGTIAN`、`LOST_SHUNTIAN` 等，适合做城市状态弹窗。
- 战役剧情：朱元璋北伐、王保保力挽大元、鄱阳湖之战、蒙古定河北等章节。
- 脚本行为：部分事件伴随 `console_command`、`spawn_army`、`set_counter`，不是单纯文本。

前端接入建议：

- 第一阶段：只读 `title/body`，做历史事件弹窗和剧情日志。
- 第二阶段：按 `calls[].monitor.section` 把事件分组，做时间线或章节筛选。
- 第三阶段：解析 `calls[].monitor.script` 中的条件和动作，将刷兵、改城、派系合并等转成项目自己的规则。

## 编码规则

- `campaign_script.txt` 应按 GB18030 解码，否则中文注释章节会乱码。
- `data/text/*.txt` 中许多文件是 UTF-16LE，脚本会按 BOM 或 null byte 自动判断。
- 文本表格式基本是 `{KEY}value`，事件标题/正文常用 `${id}_TITLE` 和 `${id}_BODY`。

## 给后续 Agent 的注意点

- 先读这份文档，再按任务读取 `docs/yuanmo-npc-extraction-notes.md` 或 `docs/yuanmo-event-extraction-notes.md`。
- 地图点位投影不要改回 2.5D 平面算法，用户已确认真 3D 百分比投影对齐是正确方向。
- 若继续做材质，优先使用高度图和地表分类色，而不是盲目叠油亮噪声。
- 事件脚本里的派系 ID 仍是 Medieval II 原始 id，例如 `byzantium`、`turks`、`papal_states`，需要单独建立元末势力中文映射。
- 生成数据来自本地模组文件；改模组文件后必须重新运行抽取脚本。
