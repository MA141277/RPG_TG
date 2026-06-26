# 元末风云录模组地图复刻笔记

目标：快速从 `Medieval II Kingdoms` 模组中抽取适合 HTML 地图复刻的核心素材与数据来源。

模组根目录：

`D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu`

## 1. 最重要的地图文件

战役地图主目录：

`D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\base`

关键文件：

- `map_regions.tga`：`509x451`，区划色块图。最适合做 HTML 点击区或区域拾色。
- `descr_regions.txt`：区划定义表。把 `map_regions.tga` 里的 RGB 颜色映射到 `region/province`、首府名、初始归属势力、宗教等。
- `descr_strat.txt`：战役初始布局。包含城市、城堡、人物、军队、要塞等坐标。
- `map_heights.tga`：`1019x903`，高度图。适合做地形起伏、阴影、海拔数据。
- `map_ground_types.tga`：`1019x903`，地表类型图。适合做地貌分类。
- `map_climates.tga`：`1019x903`，气候图。
- `map_features.tga`：`509x451`，地表特征图。
- `map_trade_routes.tga`：`509x451`，贸易路线图。
- `map_roughness.tga`：`1018x902`，粗糙度/通行细节图。
- `map_fog.tga`：`1019x903`，迷雾图。
- `water_surface.tga`：`1019x903`，水面相关图。
- `descr_sm_resources.txt`：资源类型定义。

## 2. 坐标与尺寸关系

已确认：

- `map_regions.tga` 尺寸为 `509x451`
- `descr_strat.txt` 中人物坐标范围约为 `x=2..501`、`y=23..446`
- 这说明 `descr_strat.txt` 里的战略地图坐标基本对应 `map_regions.tga` 这套网格

因此做 HTML 复刻时，最稳妥的方式是：

1. 以 `map_regions.tga` 的坐标系作为基础逻辑坐标系。
2. 城市、人物、要塞、资源点都先按 `509x451` 放置。
3. 如果你换用更大底图显示，只做等比缩放：

```ts
const screenX = mapX * (displayWidth / 509);
const screenY = mapY * (displayHeight / 451);
```

## 3. 区域数据怎么读

文件：

`D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\base\descr_regions.txt`

格式示例：

```txt
Ryukyu_Province
    Shuri
    denmark
    Japan_Rebels
    0 246 255
    trade3
    5
    4
    religions { ... }
```

含义可按下面理解：

- 第 1 行：区域 ID
- 第 2 行：首府/城市名
- 第 3 行：初始所属派系
- 第 4 行：叛军池或反叛派系
- 第 5 行：`map_regions.tga` 中该区域对应的 RGB 颜色
- 后续几行：贸易等级、财富等级、资源/宗教等补充参数

当前模组统计到：

- 区域总数：`200`

HTML 复刻里建议直接把这份文件转成：

```ts
type RegionDef = {
  id: string;
  capital: string;
  ownerFaction: string;
  rebelFaction: string;
  color: [number, number, number];
};
```

## 4. 城市、人物、要塞坐标怎么读

文件：

`D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\campaign\imperial_campaign\descr_strat.txt`

### 4.1 城市

城市块示例：

```txt
settlement
{
    level huge_city
    region Shuntian_Province
    year_founded 0
    population 227990
    ...
}
```

这部分能提供：

- 城市所属区域
- 城市等级
- 人口
- 建筑层级
- 所属派系上下文

注意：`settlement` 块本身主要描述城市内容，真正落点要结合该派系段内的战略坐标对象一起看。

当前模组统计到：

- `settlement` 总数：`199`

### 4.2 人物/军队

人物示例：

```txt
character Ch-44C , named character, male, leader, age 34, x 347, y 305, portrait daming,battle_model minghuangdi
```

可直接抽成前端标记点：

- `name`
- `type`
- `x`
- `y`
- `portrait`
- `battle_model`

当前模组统计到：

- `character` 总数：`361`

### 4.3 要塞、据点

在 `descr_strat.txt` 的 `start of regions section` 后能看到：

```txt
fort 26 243 stone_fort_b culture middle_eastern ;坎贝
```

这类数据很适合在 HTML 地图里额外叠加：

- 要塞点
- 关卡点
- 次级城镇
- 特殊地标

## 5. 资源点怎么读

资源定义文件：

`D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\descr_sm_resources.txt`

这个文件定义了资源类型和图标，例如：

- `gold`
- `silver`
- `iron`
- `sulfur`
- `silk`
- `wine`
- `fish`
- `timber`
- `furs`

资源坐标在 `descr_strat.txt` 里，格式类似：

```txt
resource spices, 15, 330
resource sulfur, 370, 345
```

因此前端里可以拆成两部分：

1. 资源类型字典：图标、名称、价值。
2. 资源实例：`type + x + y`。

## 6. 最适合 HTML 快速复刻的做法

推荐优先级：

1. 用 `map_regions.tga` 做区域底层逻辑。
2. 用 `descr_regions.txt` 建立颜色到区域信息的映射。
3. 用 `descr_strat.txt` 解析城市、人物、要塞、资源点。
4. 需要地形质感时，再叠加 `map_heights.tga`、`map_ground_types.tga`、`map_trade_routes.tga`。

推荐前端结构：

```ts
type CampaignMapData = {
  mapSize: { width: 509; height: 451 };
  regions: RegionDef[];
  settlements: SettlementDef[];
  characters: CharacterDef[];
  forts: FortDef[];
  resources: ResourceNode[];
};
```

渲染建议：

- 底图层：静态地图图像
- 区域层：透明 canvas 或 SVG 多边形
- 标记层：城市、人物、资源、要塞图标
- 信息层：hover / click 弹窗

## 7. 文件优先级建议

如果你的目标只是“先快速做出一个可点击元末地图页面”，优先看这 3 个文件就够了：

1. `D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\base\map_regions.tga`
2. `D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\base\descr_regions.txt`
3. `D:\RPG_TG\map\yuan mo feng yun lu\yuan mo feng yun lu\yuan mo feng yun lu\mods\yuanmofengyunlu\data\world\maps\campaign\imperial_campaign\descr_strat.txt`

## 8. 一个重要判断

这个模组不是单纯“图片素材包”，而是：

- `图片 + 色块区划 + 文本配置 + 坐标系统`

所以你如果想“快速复刻”，不应该只切图，而应该先把它当成一套可解析地图数据源。

最直接的工程路径不是手工标点，而是写一个小脚本把：

- `descr_regions.txt`
- `descr_strat.txt`

解析成 `json`，然后在 HTML 里直接消费。
