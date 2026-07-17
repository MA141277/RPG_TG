# 变更记录

用于持续记录项目结构、公共契约、功能能力和开发规则的变化。

## 2026-07-17 Campaign Vegetation Willow Grass Mix

### Added
- `campaign-vegetation-rules-v1` 的 `variants` 支持可选 `placement` 覆盖和 `shadow.enabled`，允许同一森林规则混合树木与低矮地被；未声明覆盖的旧规则继续使用全局 `placement` / `shadow` 参数。
- 新增 `willow-1..5.json`、`grass.json`、`grass-2.json`、`grass-short.json` 植被 mesh 资产，均由 `src/3dasset/obj` 中对应 OBJ/MTL 源素材转换得到。

### Changed
- 元末森林规则 profile 改为 `temperate-willow-grass`，variants 从 PineTree 替换为 Willow 为主、Grass 点缀；柳树保留树影，草丛使用独立缩放/lift 并关闭树影。
- `tools/convert-campaign-vegetation-obj.mjs` 默认转换源改为 `Willow_1..5,Grass,Grass_2,Grass_Short`，重新生成规则时会保留既有密度、LOD、海拔裁剪、避让、shader 和全局树影调参，只替换 profile 与 variants。
- 移除未再被运行时规则引用的 `pine-tree-1..5.json` 资产。

### Impact
- 该调整只改变森林格的视觉植被资产和纯表现规则，不改变 Hex `environment: "森林"`、通行、寻路、点击、探索、云洞、海拔裁剪或森林实例预算/均匀裁剪机制。

## 2026-07-16 Campaign Terrain Atlas Luma Removal

### Changed
- `campaign-terrain.frag.glsl` 移除原始地表 atlas 的亮度采样和 `atlasDetailLuma` 乘法，terrain 最终明暗不再继承旧底图自带的阴影/高光痕迹。
- `campaign-terrain-webgl.ts` 同步移除 terrain program 的 `uTexture` uniform 校验和绑定；原始地图纹理仍可作为水体贴图缺失时的 fallback 资源，但不再输入陆地表面明暗链路。

### Impact
- 该调整只改变 campaign terrain 的视觉着色来源，不改变 Hex 数据图、最终 `heightSamples`、通行、寻路、点击、探索、云洞、山脉/森林语义或材质纹理资产。

## 2026-07-16 Campaign Mountain Shape Base/Delta Split

### Changed
- `campaign-terrain-webgl.ts` 将山体高度生成拆成“山地底面”和“山体增量”：先从非山地陆地高度向山脉格扩散并平滑出 `mountainFloorHeightSamples`，再用 Hex `referenceHeight` 调节山体增量强度和高度上限。
- 山脉主形状从单 Hex 本地 relief 改为世界空间连续峰场：多个不与六边形对齐的长轴峰体生成连续山体/山脊，山脉格只负责裁剪允许出现山体的区域。
- 旧的 `createMountainCellRelief` 主路径移除，避免相邻山脉格退回“每个 Hex 一个鼓包”的结构；山脉外边缘仍使用既有边界高度因子压低。

### Impact
- 该调整只改变 CPU 派生 `heightSamples` 的山体几何形状，不改 shader 雪线、岩石/雪顶材质、通行、寻路、点击、探索、云洞或森林语义。

## 2026-07-16 Campaign Hex Reference Height Source

### Changed
- `campaign-hex-grid-v1` 的 cell 新增 `referenceHeight` 字段，生成器通过 `heightSampler` 在生成 Hex JSON 时从 `map_heights` 多点采样并固化每个格子的参考高度；世界地图原图采样到此结束。
- `campaign-terrain-webgl.ts` 在存在 `campaignHexGridUrl` 时不再把 `map_heights` 采样成覆盖整张地图的运行时高度场，而是从 Hex `referenceHeight` 展开临时渲染高度 samples，再在 `terrain: "山脉"` 格内生成程序化山体。
- 山脉和非山脉的高度生成、森林海拔裁剪、城市/玩家/marker 投影仍共享最终 `heightSamples`，但这些 samples 是 Hex 数据图派生的 renderer 临时几何输入，不是原始世界地图高度事实。

### Impact
- 运行时 campaign 地形高度的权威输入从原始 `map_heights` 图片切换为已保存 Hex 数据图；旧地图缺少 `campaignHexGridUrl` 时仍保留直接采样 `map_heights` 的回退路径。

## 2026-07-16 Campaign Mountain Eroded fBm Relief

### Changed
- `campaign-terrain-webgl.ts` 的山体高度细节改为梯度衰减 fBm：每个 octave 会读取局部噪声梯度，坡度越大的区域后续高频噪声权重越低，用近似侵蚀的方式削弱陡坡上的碎刺和针状峰。
- 山脉主脊从单段 `max()` 峰值改为多控制段连续累积，并降低碎岩/支脊高度贡献；接近高度上限的山顶会经过软压顶处理，减少尖顶像穿模一样顶出的效果。
- 山脉主体 relief 改为世界空间连续山脊场：多个方向的拉伸 ridged fBm 共同生成主脊、次脊和切沟，单格本地 relief 只保留少量局部变化，避免每个 Hex 生成一个独立鼓包。
- terrain mesh 采样步长从 2 调整为 1，法线采样半径同步收窄，降低陡坡和雪顶处的三角分面感，让山脊细节能被几何和光照读出来。

### Impact
- 该调整只改变山脉 renderer 派生高度形状，不改变 Hex `terrain: "山脉"`、岩石/雪顶语义、通行、寻路、点击、探索、云洞或森林生成规则。

## 2026-07-16 Campaign Non-Mountain Height Flattening

### Changed
- `campaign-terrain-webgl.ts` 在基础高度平滑和山脉高度生成之间新增非山脉陆地格平整化：按每个 Hex 的平均高度削弱格内起伏，并只在同一 Hex 内做小范围平滑，减少平原、草地、森林等非山地区域继承旧 `map_heights` 后出现的尖锐高低点。
- 山脉格继续走既有山体 relief、岩石和雪顶规则；非山脉平整化不会改写 Hex `terrain` / `environment`，也不影响通行、寻路、点击、探索、云洞或森林语义。

### Impact
- 该调整只改变 terrain renderer 派生的最终视觉高度场，让非山地地块更平整；森林贴地高度、城市/玩家/marker 投影和地形法线会随最终 `heightSamples` 一起读取平整化后的结果。

## 2026-07-16 Campaign Mountain Snow Caps

### Added
- 元末 campaign 地图新增 `map_snow_texture` 纯表现图层，内置地图和朱元璋 scenario pack 都注册 `campaign-snow-texture.png` 作为山脉雪顶材质输入。
- `campaign-terrain-webgl.ts` 新增雪贴图加载、canvas 数据传递和 `uSnowHeightStart` / `uSnowHeightFull` uniforms，用于在 shader 中控制雪线起点和完全积雪高度。

### Changed
- `campaign-terrain.frag.glsl` 在既有山脉岩石材质之后追加雪顶层：雪只在 `terrain: "山脉"` 对应的 `mountainAmount` 内出现，并同时受 fragment 高度、坡面朝上程度和破碎噪声控制，形成类似文明的高处山顶积雪。

### Impact
- 雪顶是纯视觉材质层，不改变 Hex `terrain`、CPU 山体高度、通行、寻路、点击、探索、云洞、森林生成或山脚岩石过渡规则。

## 2026-07-16 Campaign Vegetation Altitude Limit

### Changed
- `campaign-vegetation-rules-v1` 新增可选 `altitude.maxTerrainHeight` 视觉规则，元末森林规则当前由该字段配置海拔裁剪阈值；`tools/convert-campaign-vegetation-obj.mjs` 的默认 rules 输出同步写入该字段，避免重新转换自然景观素材时丢失海拔限制。
- `campaign-terrain-webgl.ts` 在森林格中心可见性筛选和格内候选树点生成时，使用最终派生的 `heightSamples` 判断海拔是否超过 rules 上限；超过上限的森林视觉实例不再生成，全图适用，且被高度裁掉的候选树会消耗该格目标生成名额，不再重新抽点补生成。

### Impact
- 该限制只影响森林格上的植物视觉实例，不改写 Hex 数据图中的 `environment: "森林"`，也不改变通行、寻路、点击、探索、事件或山脉材质/高度规则。

## 2026-07-15 Campaign Mountain Terrain Rock Material

### Added
- `campaign-hex-grid-v1` 生成器新增 `terrainSampler`：默认从 `map_ground_types` 进行 7 点多采样，匹配山地区域颜色后把陆地 hex 标记为 `terrain: "山脉"`，并把采样图层、颜色集合、命中阈值和 fallback terrain 写入 Hex 数据图，便于后续复现和扩展新的地形采样机制。
- 元末 campaign 地图新增 `map_rock_texture` 图层，内置地图与朱元璋 scenario pack 都注册 `campaign-rock-texture.png` 作为山脉地表材质输入。

### Changed
- 重新生成 `yuanmo-campaign-hex-grid.json`：8509 个格中保留 4033 个陆地格，`terrain` 统计变为 6904 个“平原”和 1605 个“山脉”；`environment` 的森林/草地语义保持不变。
- `uMaterialSemanticTexture` 的通道语义扩展为 R=land/water，G=mountain terrain mask，B 预留；terrain shader 读取 G 通道后在山脉格上混入岩石贴图，并用邻域采样与噪声软化山脉和普通地表之间的过渡。
- `map-view.ts` 和 `campaign-terrain-webgl.ts` 会把 `map_rock_texture` 传入 terrain shader；缺少岩石图层时仍回退到现有陆地贴图，保证旧地图可以加载。
- 山脉材质过渡改为“山脉格内部向内羽化”：当前 rounded Hex cell 不是 `terrain: "山脉"` 时岩石 mask 直接为 0；只有山脉格自身与非山脉邻格相接的边会向内侵蚀并露出普通地表，避免岩石贴图蔓延到其他地块。
- 山脉真实高度从 fragment shader 假效果升级为 CPU 派生高度场：`campaign-terrain-webgl.ts` 先从 `map_heights` 生成通用参考高度，再只在 `terrain: "山脉"` 格内覆盖生成山体高度；相邻山脉格按整体连续处理，内部邻接边不压低，整片山脉外边界向内压低以降低边缘高点概率。
- 山脉高度生成从“连续噪声抬高地表”细化为采样点级山体 relief：每个山脉 Hex 内部会按本地坐标生成多控制点主脊、支脊和碎岩噪声，`map_heights` 原始采样值直接作为山体基准高度，避免退化成每格一个随机高度或一个孤立峰值。
- 移除上一版山脉专用高度对比度拉伸：局部噪声只在原始高度上追加有限细节，并用原始高度加少量余量作为上限，避免把不同原始高度的山脉重新映射到过度拉开的高度段。
- terrain mesh 采样步长从 3 降到 2，法线采样半径同步收窄，让单个山脉 Hex 内的多个高度采样点能被真实几何和光照读出来，而不是被低密度三角面合并成粗糙山包。
- 山脉形状改为参考文明式连续山体：CPU 高度场只负责主脊、支脊和沟壑 relief，并移除按单个 Hex 边缘衰减的 body mask，避免相邻山脉格被切成独立山包；terrain shader 回到既有 `getLocalMountainEdgeInset` 岩石边缘过渡，不再另做山脚或材质 body mask。当前只处理形状，不加入雪线/积雪贴图。
- 最终 `heightSamples` 统一驱动 terrain mesh、重建法线、城市/玩家/marker/森林贴地高度和投影同步；非山脉格不执行山脉专用规则，只通过通用高度连续性与相邻高度自然衔接。

### Impact
- 山脉真实起伏和岩石贴图仍是 renderer 内视觉规则，不改变通行、寻路、点击、探索、云层 reveal 或森林造景密度。后续如果要让山脉影响移动、资源、视野或事件，应在 Hex 数据图的 `terrain` 语义上新增玩法规则，而不是让 shader 或派生高度反向驱动 gameplay。

## 2026-07-15 Campaign Vegetation Shadow Direction

### Changed
- 森林树身 shader 和树影几何改为复用 terrain shader 的相机光照输入，并把树这类实体的可投影方向限制在相机前向半平面：树身明暗继续使用 `centerToFragment`、`uTerrainCameraLightHeight` 和 `uTerrainCameraLightHorizontalPull`，树影用树根投影点计算同一受限方向的反方向并通过当前 terrain camera 矩阵反投到地图平面，避免投影围绕树 360 度旋转而与树身阴影脱节。
- 修正树影屏幕方向换算的符号：shader 显式区分 `vegetationLightDirection` 和其反向的 `vegetationShadowDirection`，CPU 投影几何只消费后者，避免投影落在树的受光面前方。
- 按当前视觉校准要求，只对树影透明层追加屏幕 Y 方向翻转；树身自阴影 shader、森林密度和 terrain 光照参数保持不变。
- 森林实例上限裁剪从“按视口中心距离排序后用满即停”改为屏幕分桶均匀预算：`maxVisibleInstances` 仍控制总实例数，但最小缩放下会在所有可见森林区域一起降密度，避免某些区域整片不显示树。

### Impact
- 该调整只影响森林树木的视觉受光和贴地投影方向。森林来源、密度、LOD、通行、寻路、点击、探索、岸线和云层语义不变。

## 2026-07-15 Campaign Cloud Reveal Plane Projection

### Changed
- 云洞 reveal mask 从地形高度锚点投影改为 terrain camera 下的固定云洞参考高度投影：`campaign-cloud-webgl.ts` 只用已探索 hex、当前相机和统一参考高度对齐云洞，不再采样 `map_heights` 或沿用旧地形高度起伏，避免已探索区内被高度/旧 hex 错落切出残云。
- `campaign-terrain-webgl.ts` 新增 `projectCampaignTerrainUvToClientPointAtCloudRevealHeight()`，专供云层 mask 等不应贴地但也不应落在最低平面的视觉层使用；原 `projectCampaignTerrainUvToClientPointAtHeightAnchor()` 保留给玩家、marker、hover 描边等需要贴地高度的交互/表现层。

### Impact
- 该调整只影响云层 reveal mask 的视觉裁切。探索状态、点击屏蔽、寻路、可踏足 hex 悬浮描边、marker/player 贴地投影和地形高度渲染不变。

## 2026-07-15 Campaign Forest Vegetation Rules

### Added
- 新增 `campaign-vegetation-rules-v1` 森林造景规则资产：`src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-vegetation-rules.json` 绑定 `environment: "森林"`，配置 PineTree 变体、远景 / 中景 / 近景三档密度、LOD 阈值、最大可见实例数、边缘留白、marker/player/path 视觉避让半径和 vegetation shader 参数。
- 新增 `campaign-vegetation-mesh-v1` 顶点色植被 mesh 资产：`src/content/scenario-packs/zhuyuanzhang/assets/vegetation/pine-tree-1..5.json` 由 `src/3dasset/obj/PineTree_*.obj/.mtl` 离线转换得到，材质色来自 MTL `Kd` 并由转换工具提亮到世界地图可读范围，运行时不直接解析 OBJ/MTL。
- 新增 `tools/convert-campaign-vegetation-obj.mjs`，用于把自然景观 OBJ+MTL 源素材转换为可加载 mesh JSON，并生成森林 vegetation rules JSON。
- 新增 `campaign-vegetation.vert.glsl` / `campaign-vegetation.frag.glsl`，在现有 campaign terrain WebGL renderer 内绘制森林实例，支持顶点色、地形同向相机光照和 LOD 可见性/密度控制。
- 新增 `campaign-vegetation-shadow.vert.glsl` / `campaign-vegetation-shadow.frag.glsl`，按 rules 的 `shadow` 参数为每棵树绘制纯视觉贴地投影，投影方向由当前相机光照方向派生。

### Changed
- `MapDefinition` 新增 `campaignVegetationRulesUrl`；content pack loader、scenario pack URL loader 和导入目录 loader 都会解析该字段。导入目录 loader 会把 rules 内部的 `variant.meshUrl` 改写为 blob URL，保持外置包可加载。
- `map-view.ts` 会把 vegetation rules URL 写入 terrain canvas；`campaign-terrain-webgl.ts` 读取 Hex 数据图中的 `environment: "森林"`，按规则在视口内展开树实例，并按缩放 LOD 控制远景/中景/近景密度。
- 按世界地图俯视尺度修正森林模型表现：默认模型源从 `CommonTree_*.obj` 改为更接近立体体块的 `PineTree_*.obj`，`baseWorldScale` 进一步降到 `0.00105`，vegetation pass 保持不透明绘制，并移除森林树木的随风摇摆通道，避免树冠在大地图上过大、过黑或像立牌。
- 森林树体颜色和光照强度改为由 vegetation rules 的 `shader.ambient` / `shader.directional` 驱动，植被 shader 复用地形相机光照参数；renderer 会优先保留靠近视口中心的森林格，并用 polygon offset 与贴地 lift 降低俯角变化时地形 depth 裁掉树身下半部分的概率。
- 森林 LOD 从“低于中景阈值清空”改为远景保底密度；中景阈值和近景阈值在 rules 中保持可调，避免缩放时两档密度过近。
- 树影从固定世界偏移改为按当前相机光照方向计算的树干锚定长条投影：近端固定在树干位置，长轴随光照方向旋转，远端渐隐。
- 植被片元 shader 改为双面受光修正，避免关闭背面剔除后树冠朝向镜头的一面因为背面法线被反向压暗。
- Campaign terrain 历史色调层从重灰压暗改为保留原色的轻暖化与高光压制；默认地形亮度、饱和度和材质 shade 范围略微回提，避免地图失去自身地貌颜色。

### Impact
- 森林造景是纯视觉规则，不改变通行、寻路、点击、探索、事件或玩法数值。后续要调树种、密度、避让或材质可读性，应优先改 `campaign-vegetation-rules-v1` 或重新运行转换工具，而不是把内容参数硬编码进 renderer。

## 2026-07-15 Campaign Hex Grid Data Asset

### Added
- 新增 `campaign-hex-grid-v1` 大地图 Hex 数据资产：`src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json` 保存从 `map_ground_types` 采样得到的 8509 个 hex cell，并为每格写入 `land`、`terrain`、`environment`。
- 新增 `tools/generate-campaign-hex-grid.mjs`，把从原图采样到 Hex cell 的来源图层、UV/像素公式、水体判定规则和 land 规则写入 JSON，后续可复现同一张 Hex 数据图并追加新的采样机制。
- `MapDefinition` 新增 `campaignHexGridUrl`，content pack 和导入 scenario pack 的资产解析都会把该字段解析为可加载 URL。

### Changed
- 朱元璋 scenario pack 与内置元末地图都注册 `campaignHexGridUrl`；`map-view.ts` 会把该 URL 传给 terrain / actor canvas，`campaign-terrain-webgl.ts` 优先读取保存后的 Hex 数据图生成通行网格、点击通行检查、岸线链和 `uMaterialSemanticTexture`。
- `terrain` 和 `environment` 当前统一初始化为“平原”和“草地”。`map_ground_types` 仍保留为生成器输入、旧地图回退和 shader 视觉参考，不再是存在 Hex 数据图时的运行时语义事实来源。
- 修复大地图左右边缘出现草地/沙地锯齿条的问题：生成器不再把地图 UV 外的 hex center clamp 到原图边缘后标成陆地，所有地图外 cell 都写成非陆地；terrain shader 也把地图外 cell 防御性视为水侧，避免边缘 rounded hex 落到 UV 外时被混成陆地材质。
- Hex 数据生成器新增 `environmentSampler`：默认从 `map_climates` 按 7 点多采样匹配绿色色块，把命中阈值达标的陆地 cell 写成 `environment: "森林"`；本次元末 campaign 数据生成出 1056 个森林格，采样图层、颜色集合和命中阈值都写入 JSON 便于复现和后续调参。

### Impact
- 后续给每个 hex 增加地形、环境、资源、道路、危险度等机制时，应扩展同一份 Hex 数据图或其生成器，而不是在 renderer 或 gameplay 代码中重新逐帧采样原图。
- 文档同步更新了大地图语义来源边界：表现层材质图只影响视觉；陆水、寻路、点击和岸线语义优先来自 `campaignHexGridUrl` 指向的数据资产。

## 2026-07-14 Campaign Shoreline Chain Sampling

### Changed
- 大地图 terrain renderer 新增 `uMaterialSemanticTexture`：`campaign-terrain-webgl.ts` 从 `map_ground_types` 生成一次 Hex cell land/water 语义模型，并以“一格 Hex 一个 texel”的 NEAREST 语义纹理传入 shader；通行网格、点击检查、岸线链提取和 terrain shader 的水陆判断都消费同一份 Hex 语义模型。
- 大地图岸线形变改为从当前 Hex 通行语义提取陆水相邻边，并在 CPU 侧组装连续 shoreline chain 元数据；renderer 只把每条边的链上里程、链长度和稳定 seed 传给 terrain shader，不再按单条边各自 hash 出独立岸线。
- Terrain shader 的岸线层改为先把像素投影到当前 Hex 共享边，再沿 shoreline chain 的连续里程采样波浪和侵蚀噪声，让相邻边共享同一条连续波形；输出结果改为水陆分界 mask，直接决定当前像素走水侧还是陆侧材质。
- 岸线默认调参提高 `shorelineWaveFrequency` 与 `shorelineErosionFrequency`，并提高 chain 里程到波峰数量的换算密度；该调整只增加单位岸线长度内的起伏频率，不增加岸线整体内外推幅度。
- Terrain shader 新增视觉陆地来源 cell 选择：当岸线扰动把陆地推出原本 Hex 边界进入相邻水 Hex 时，推出区域的陆地材质、沙滩权重、砂粒随机种子和 atlas 细节改为继承相邻来源陆地 Hex，避免新增陆地区域与原陆地颜色脱节。

### Impact
- 岸线 chain 的来源是 `map_ground_types` 派生出的 Hex 陆水相邻关系，不是原图像素 mask，也不是独立贴图语义；shader 也必须先把当前像素归入 rounded Hex cell，再读取同一份 Hex 语义纹理判断水陆。
- 原始 `uMaterialTexture` 仍可用于 terrain shader 的地貌颜色参考，并保留浅水区、深水变化和水面内部噪声等旧视觉采样路径；但最终“当前像素属于水侧还是陆侧”的判定不得再读它，避免 WebGL LINEAR 过滤在水陆边界插值出与 CPU 通行网格不一致的结果。
- 水体 shader 保持层次分工：近岸区是贴当前岸线的窄水侧 tint，跟随 Hex semantic 派生出的当前水陆边界；浅水区是更宽的水体内部层，继续保留旧的 `uMaterialTexture` 距陆采样和 `map_water_noise` 动态效果，但浅水区最终水侧 coverage 改为读取当前岸线的 `boundaryWater`，避免旧 `map_ground_types` 采样把当前已经属于水侧的像素裁掉。岸线不再作为额外假水覆盖层绘制，也不改通行、寻路、点击或探索。

## 2026-07-13 Campaign Shoreline Visual Erosion

### Added
- 大地图 terrain shader 新增按单条邻水 hex 共享边计算的岸线视觉形变 mask：陆地靠水边会以低频波浪和高频侵蚀噪声打散原本笔直的六边形水陆分界，并在多条邻水边交汇处做圆角化软并集。
- `window.rpgTerrainBeach(...)` 调参表新增 `shorelineVisualWaterStrength`、`shorelineEdgeWidth`、`shorelineWaveStrength`、`shorelineWaveFrequency`、`shorelineErosionStrength`、`shorelineErosionFrequency` 和 `shorelineCornerRoundness`，用于调水陆边界形变强度、沿岸粗细、波浪尺度、侵蚀细节和角点圆化。

### Changed
- 岸线形变噪声从高频直接切割改为平滑 fBm 采样：大尺度波浪负责整体岸线起伏，低强度细节噪声只做边缘侵蚀，减少岸边锯齿和毛刺感。

### Impact
- 该效果只影响 terrain shader 的最终颜色混合：不改变 `map_ground_types`、寻路、点击、探索、云洞、hover 描边、建筑 marker 或地名投影；水格/陆格 gameplay 语义仍由原始地图数据决定。

## 2026-07-13 Campaign Map Zoom Camera

### Changed
- 大地图 terrain camera 的俯角改为由当前缩放 scale 派生：缩小时逐步接近俯视，放大时逐步降低视角形成更贴近地表的观察效果；terrain 投影、shader 法线光照和云层相机耦合继续读取同一份相机参数。
- 地图滚轮、缩放按钮和缩放输入改为带缓动的相机状态动画；缩放目标 offset 会补偿俯角变化带来的纵向平移比例差异，减少缩放变角时的画面漂移。
- 地图单步缩放倍率从 `1.08` 调整为 `1.16`，提高鼠标滚轮和缩放按钮的响应幅度。

### Impact
- 该变更只影响大地图表现层 camera。六边形 gameplay 网格、寻路、点击、探索、通行性、云洞语义和地图数据结构不随当前视角变化。

## 2026-07-13 Campaign Terrain Grass And Beach Materials

### Added
- 大地图 terrain renderer 新增独立草地/沙地材质输入：`yuanmo-campaign-map.ts` 与朱元璋 scenario pack 的 `maps.json` 都注册 `map_grass_texture` 与 `map_sand_texture` layer，`map-view.ts` 将其传入 terrain canvas，`campaign-terrain-webgl.ts` 作为 WebGL sampler 绑定给 terrain shader。
- Terrain shader 使用新草地贴图作为陆地主材质；靠近水体的陆地按 `map_ground_types` 邻域采样生成沙滩混合权重，并用噪声打散边界，将沙地材质叠加到陆地边缘形成海岸/湖岸过渡。
- 沙滩混合从全图最近水体距离改为相邻 hex 共享边的局部沙滩带：只在当前陆地格与相邻水格的边缘生成沙滩，并拆成靠水沉积核心与向内陆羽化的侵蚀边缘；侵蚀噪声沿共享边方向采样，避免变成等宽描边或把内陆湖之间连成长带。
- 沙滩材质增加独立高频砂粒层：砂粒只调制局部沙滩边缘和沙地颜色，沙滩带宽度同步加宽，避免视觉上退化成平滑描边。
- 沙滩主混合改为邻水边向陆地延伸的宽沙滩带：取消整格替换，沙滩主体用接近材质切换的方式显示亮黄色沙子贴图，只有外缘保留窄过渡和轻微砂粒粗糙度，避免像半透明覆盖在草地上。
- 沙滩边缘进一步拆分为沙地核心、沙地外缘和草地干化侵蚀带：相邻水边的沙滩贡献从硬 `max()` 改为柔性并集，草地侧先被干草色与砂粒噪声侵蚀再进入沙地材质，减少相邻沙滩交汇处的硬尖角和纯描边感。
- 草地侧侵蚀过渡改为真实细沙过渡：在干化草地上用独立高频砂粒 mask 混入沙地贴图；沙滩权重拆成主沙地核心与细沙连接两个通道，主沙地核心按较短的胶囊形共享边生成圆角，细沙连接只参与草地侵蚀过渡，不再把相邻边衔接层抬成亮黄色尖角，也不使用会跨格串联的局部水邻近场。
- 沙滩沿岸宽度改为运行时可调参数：terrain renderer 默认放大主沙滩与外侧细沙侵蚀带，并新增 `window.rpgTerrainBeach(...)` 控制台命令，可直接调整 `innerRadius`、`outerRadius` 等 shader uniform 后重绘地图。
- Terrain renderer 增加输入签名：当 terrain canvas 保活但底图、高度图、材质图、草地、沙地或水纹 URL 发生变化时，会 dispose 旧 WebGL renderer 并重新加载贴图，避免地图重绘后仍显示旧材质。

### Impact
- 沙滩只影响地形视觉材质：水体/陆地通行性、寻路、点击、探索、云洞和地图数据结构仍继续读取原有 `map_ground_types` 与 navigation 网格，不因草地/沙地贴图改变。

## 2026-07-10 Campaign Smooth Terrain Heightfield

### Changed
- 大地图 terrain renderer 从按 hex 量化的平顶台阶 mesh 改为连续高度场 mesh：`campaign-terrain-webgl.ts` 使用原始 `map_heights` 生成平滑后的视觉高度，并用规则 UV 网格连接顶点，不再为相邻 hex 高差生成竖直墙面。
- 地形投影、玩家 actor、建筑深度 mesh、marker 和云洞高度锚点统一读取平滑后的视觉高度；双线性高度采样替代最近点高度采样，减少贴地对象随格子高度跳变的问题。
- Terrain shader 新增地形 normal 传入，用平滑高度产生轻量坡面明暗；默认 hex 格线强度降为淡格线，并将平滑 pass、mesh step、格线强度和坡面明暗作为集中常量保留在 terrain renderer 顶部。
- 可踏足 hover hex 描边改为沿六边形边缘多段采样，并让每个采样点按自身地形高度投影，避免连续地形上仍显示为悬浮平面六边形。
- Terrain shader 的坡面明暗拆成方向光、背光侧阴影和陡坡暗部三层，并通过更宽的高度采样半径计算法线；水体只继承弱阴影，避免海面被压黑。
- Terrain shader 文件改为完整独立 GLSL：`campaign-terrain-webgl.ts` 不再通过 TS 占位符拼接 shader 源码，地形高度缩放、格线强度、坡面阴影等参数改为 WebGL uniforms 传入。
- 修正坡面阴影不可见的问题：relief 阴影不再混入会被 `shadeMin/shadeMax` 默认值抵消的地形调参 shade，而是作为独立地形光照层叠加到最终地表颜色。
- 地形坡面方向光改为以当前网页视口中心为光源中心：terrain shader 直接使用 `gl_FragCoord` 与 framebuffer 尺寸计算视口中心光照，地图拖动/缩放时地形从该屏幕空间光源下经过，避免光源固定在地图世界坐标上。
- 地形视口光源降低默认高度，并将 terrain normal 旋转到当前摄像机/屏幕空间后再参与光照计算，避免屏幕空间光源和地图世界 normal 混用导致光照看起来不与地图平行。
- 大地图 terrain camera 的平移从摄像机/屏幕平面改为地表平面：矩阵顺序调整为先在地图平面应用 pan，再进入 tilt 和投影，避免拖动地图时出现摄像机平移层与地形层不平行、地图角度像在变化的问题。
- 地形摄像机拉远并收窄 FOV，确保倾斜后的真实 `map_heights` 地形面完整位于 camera/near plane 前方，避免地图下方因为摄像机过近而被裁剪；连续地形 mesh 仍只覆盖真实地图数据范围，不再做边界延展。
- 云层 renderer 的相机耦合改为读取 terrain 提供的 map-coupled camera offset，和地表平面 pan 的纵向校正保持一致；同时让 outer puff 后叠层在已开启云洞核心区随 `cloudMask` 衰减到 0，减少摄像机移动到已探索区域上方时的额外遮挡。

### Impact
- 六边形仍然是 gameplay 网格：水域/陆地通行性、点击屏蔽、探索状态和寻路继续只消费 `map_ground_types` 与 navigation 通行网格，不因视觉高度平滑而改变。

## 2026-07-10 Campaign Cloud Debug Toggle

### Added
- 新增浏览器控制台调试命令 `rpgCloud(false)` / `rpgCloud(true)` / `rpgCloud("toggle")` / `rpgCloud("status")`，用于运行时关闭、打开或查询大地图云雾 shader overlay。

### Impact
- 关闭云层时会 dispose 当前 `campaign-cloud-webgl.ts` renderer、停止云层动画帧并隐藏 `data-campaign-map-cloud` canvas；开启时重新同步当前页面云层 canvas。该开关只影响视觉云雾 renderer，不改变探索、寻路、通行、点击或地图 gameplay 状态。

## 2026-07-09 Three.js Renderer Boundary

### Added
- 新增 `three` 运行时依赖，作为后续 3D / WebGL 表现层基础库。
- `docs/architecture.md` 记录 3D renderer 依赖边界：`three` 只能直接用于 `src/ui/**` 表现层，不能进入 `content`、`domain`、`application` 或 runtime 模块。

### Impact
- 后续 3D 场景、模型、特效、拾取和后处理可以复用 three.js 的现成渲染能力；玩法状态、探索、通行、事件、任务、house 会话和资源变化仍必须通过统一 game state / runtime 结构流转，不能藏进 three.js scene graph 或 `Object3D.userData`。

## 2026-07-08 Character Select Ink Feedback

### Changed
- 角色选择界面的墨点反馈从 DOM 矩形边缘采样改为图片 alpha 轮廓采样：`main-ui-flow.js` 会优先读取目标控件自身 CSS 背景图，按当前 `background-size` / `background-position` 计算实际绘制区域，再从透明像素边界提取轮廓点和外法线生成墨点。
- 角色选择界面初始化时会预热角色卡、书签、翻页按钮、返回按钮和开始按钮的轮廓缓存；无可采样图片或图片尚未加载时仍保留旧矩形采样兜底，避免 UI 反馈完全丢失。

### Impact
- 玩家在角色选择页悬浮或键盘聚焦控件时，墨点点选效果会贴近 UI 图片自身的不规则轮廓，而不是贴住控件外接方框；视觉资产仍由现有 CSS / 布局编辑器背景图维护。

## 2026-07-08 Campaign Map Interaction Stability

### Added
- 大地图新增可踏足 hex 悬浮反馈层：`map-view.ts` 生成 `data-campaign-hover-hex` SVG overlay，`main.ts` 根据当前 terrain 投影、探索状态、地形通行判定和寻路结果绘制白色六边形描边，`prototype.css` 将其放在云层之上且不接管鼠标事件。

### Changed
- 大地图 marker 和 marker summary 增加稳定 DOM 身份，`renderAppFrame()` 在地图重绘时像保活 terrain / actor / cloud canvas 一样移植旧 marker 节点，并只同步语义属性，保留 terrain 投影产生的位置样式，减少玩家移动结束时城市/建筑标识被销毁重建造成的刷新感。
- `docs/architecture.md` 同步大地图 marker 保活、可踏足 hex hover 反馈只读寻路结果、以及 hover 描边位于云层上方的层级契约。
- 云层 reveal mask 新增上一帧探索纹理与 `uRevealTransition` 过渡；新探索格开洞时按云噪声做溶解式切换，避免云层直接消失。
- 云层 shader 在已探索空洞内进一步衰减全图空气雾层和孤立云团残留，但不改变洞口边缘云壁的语义来源。
- 大地图通行网格改为按 `map_ground_types` 的水域材质语义生成，和 terrain shader 的陆地/水体渲染判断对齐；`map_heights` 不再负责寻路通行判定，避免低矮陆地被当成水体。
- 可踏足 hex 悬浮描边改为几何角点投影、高度锚定到当前 hex 中心，避免角点误采邻格高度导致六边形端点翘起或下陷。
- 云层空洞内的次级残留层同步衰减，减少已探索核心区里额外覆盖整层薄雾或外云团残影。
- 云层 reveal mask 的 hex 多边形同样改为角点投影、中心高度锚定，避免 mask 轮廓因角点误采邻格高度而变形。
- 大地图通行性收紧为 terrain shader 同款“hex 中心材质”语义，并直接使用 `map_ground_types` 原始尺寸采样；岸边水格不再因为角点陆地样本被放行。
- 云洞核心区的 inner wisp、云影与 outer puff 后叠层统一随空气雾层 keep mask 衰减到 0，避免洞内残留独立薄层。
- 云洞边缘扰动按视觉反馈恢复旧版单向 offset 采样路径，保留此前更强的云墙撕裂和融合效果。
- 云洞流动边缘恢复使用 reveal red 通道浅云层生成 `edgeBand` / `shallowZone` / `rimAlpha`；真正的硬六边形块改为从 raw `baseClear` 迁出，核心清空、空气雾和孤立云残留都改读 offset 后的有机 clear field，避免原始 mask 块作为独立透明度分区显露。

### Impact
- 玩家移动后地图标识节点保持稳定，地图 hover 反馈只提示当前实际可抵达的已探索陆地 hex；低矮陆地按渲染材质参与寻路，云层开图仍由探索状态驱动，视觉过渡更接近云层被逐步拨开的效果。

## 2026-07-07 Campaign Viewport Cloud Shader

### Added
- 新增大地图视口级云雾 overlay renderer `src/ui/views/map/campaign-cloud-webgl.ts`，通过独立 `data-campaign-map-cloud` canvas 渲染慢速动态云层。
- 新增 `campaign-cloud.vert.glsl` 与 `campaign-cloud.frag.glsl`，使用连续程序 FBM、billow 云雾变体与 `map_fog_noise` 轻量贴图扰动生成云体密度、明暗层次和轻微自阴影质感。
- 新增视口空间探索挖空 reveal mask：`map-view.ts` 将当前地图累计 `revealedHexKeys` 传给云层 canvas，`campaign-cloud-webgl.ts` 生成 `uRevealTexture`，`campaign-cloud.frag.glsl` 用它裁切云层 alpha。
- `campaign-terrain-webgl.ts` 新增只读投影 helper，将 terrain UV 投影到当前视口 client 坐标；云层 renderer 用它在完整视口云层上对齐地图 hex 挖空。
- `travel-to-coordinate.ts` 新增 `hexToCoordinatePolygon()`，让探索挖空复用 navigation 的尖顶 axial hex 几何。

### Changed
- 大地图初始相机改为以玩家当前坐标为屏幕中心，默认缩放改为 40x；地图 reset 会回到同一 home camera。
- `campaign-terrain-webgl.ts` 新增按地图坐标生成居中相机的 helper，避免 `main.ts` 复制 terrain 投影矩阵细节。
- 未探索 campaign marker 在 view model 层标记为不可交互，渲染时不再带 `data-map-node-id`，并通过 disabled / pointer-events 屏蔽点击和 hover 详情。
- campaign 地形通行网格从 hex 中心单点高度判定改为 hex 区域多点采样：中心为明确陆地或区域内有足够陆地样本才可通行，减少低矮陆地被误判为水体导致无法寻路的问题。
- `docs/architecture.md` 收敛为地图模块责任、数据流和层级契约，不再记录云层 shader 的噪声、距离场、阈值等实现细节。
- `map-view.ts` 在 `c-campaign-map` 视口内生成云雾 canvas，并把 marker 悬浮详情拆成独立 overlay；`prototype.css` 将云层限制在地图视口中，`pointer-events: none`，层级压过地图建筑点本体，但低于 marker 悬浮详情、debug 控件、全局 UI 和确认 modal。
- `campaign-terrain-webgl.ts` 的地形投影同步不再给 marker 本体或玩家写入深度排序高层级；marker、玩家 DOM sprite 和 actor canvas 固定在云层下方，只有 marker 悬浮详情固定在云层上方。
- 云雾 shader 重构为烟雾式密度场：云体主体形状、团块边界、明暗和 reveal 边缘撕裂由连续 FBM、billow 变体与贴图扰动主导，Worley/胞体距离场只保留为低权重团块破碎，不再形成可见细胞纹。
- 云雾 shader 移除导致屏幕斜向条纹的剪切雾丝层，改用各向同性的细粒度 puff / vapor breakup 扰动补充云面细节；最终 alpha 遮挡表达保持由 shader 末端统一控制。
- 云雾主密度噪声从单个低频 `coverage` 门控改为三组独立中频 puff field 的加权密度场，低频噪声只参与域扭曲和明暗；避免 `max()` 并集把整屏填成白雾，也避免通过常量保底掩盖采样不均。云层颜色同步调回偏亮白的云体反照率。
- 云雾密度拆成连续 `overcast` 覆盖层和 `cloudHeightField()` 高度层，屏幕覆盖由连续云幕维持，云团形状不再依赖透明度空洞。
- 云雾颜色层改为基于高度场梯度的近似法线光照：通过邻近采样估算坡度，再由 `slopeLight`、`ambientOcclusion`、`selfShadow` 和 `cloudHighlight` 生成亮面与软阴影，避免“白底叠黑块”或纯白无结构。
- 云雾光照继续加入沿光照方向的高度差采样：`upwindHeight` 产生云体投影式软阴影，`downwindHeight` 产生背光侧亮边，让满屏云幕内部出现可读的明暗起伏，而不是只有均匀白色。
- 云雾 shader 提高高度场细节和阴影动态范围：`microShadow` / `microHighlight` 参与 RGB 细节，阴影色加深但最终 alpha 遮挡表达保持不变。
- `campaign-cloud.frag.glsl` 顶部新增云层调参表，集中暴露 `CLOUD_SAMPLE_SCALE`、`CLOUD_FLOW_SPEED`、`CLOUD_TEXTURE_SAMPLE_SCALE`、细节/阴影/高光强度、reveal 距离场侵蚀和浅云参数，便于后续直接调整云团大小、噪声采样区域、流速和空洞形态。
- 云层动态从单纯移动噪声 offset 改为 `buildCloudSpace()` 平流采样坐标：低频风向、缓慢 curl 和 flow warp 共同驱动云体高度场、贴图细节和 reveal 边缘，使整片云层具有连续慢速流动。
- `campaign-terrain-webgl.ts` 新增只读 `getCampaignTerrainCamera()`，`campaign-cloud-webgl.ts` 每帧将当前地图相机作为 `uMapCamera` 传入云层 shader；云层采样空间按 `offset / scale` 的有效相机平移做弱反向采样偏移、按相机 scale 做部分缩放，保持气象层自身流动的同时响应地图拖拽和缩放，并避免单纯缩放因 offset 同步变化产生额外漂移。
- 探索空洞从单一 reveal alpha 裁切改为距离场驱动：`campaign-cloud-webgl.ts` 先栅格化已探索尖顶 hex 联合区域，再用边界距离场写入 `uRevealTexture`，shader 只负责用云阻力噪声侵蚀 `clearMask`，不再额外叠加完整云墙环。
- `campaign-cloud-webgl.ts` 的 reveal mask 不再通过核心/外肩/外圈多层 polygon alpha 与 canvas blur 生成；red 通道改为洞外距离带浅云近场，green 通道改为清空 signed-distance 场，texture alpha 固定为 255 以避免 canvas 预乘 alpha 吃掉语义通道。
- 云洞外侧浅云近场改为距离场语义：`CLOUD_REVEAL_FIELD_*_RATIO` 根据当前投影 hex 半径生成内清空、外清空和浅云距离带，`REVEAL_SHALLOW_*` 在 shader 中只把它解释为浅云区，外圈之外恢复当前深云层。
- 浅云层从“深云降透明度 / RGB 染色”改为独立稀疏云体：`sampleShallowCloudLayer()` 使用更高覆盖阈值、更小 puff 采样和自身明暗来生成少量浅云团；主合成在浅云语义区降低深云保留量，再叠加浅云层，避免形成均匀浅白盘或透明度锐减的假过渡。
- 浅云到深云、浅云到空洞的过渡改为 reveal 语义场与 `cloudResistance` 云阻力共同决定云体替换比例；边界处会按云团/细节噪声破碎，而不是只依赖 smoothstep 圆滑羽化。
- 修正浅云密度场过稀的问题：浅云层改用更符合当前高度场分布的成云阈值，并新增 `puffPresence` 云团存在场与干区削减场，让浅云区出现少量可见云团，而不是完全无云或只靠 alpha 提亮。
- 云洞边缘移除独立 `cloudWall` 合成层；边界厚度现在只能来自距离场 clear mask 被云阻力噪声局部侵蚀，以及浅云层对深云层的替换，避免截图中那种预制白色厚环。
- 云洞 shader 移除低 alpha `discard`，让透明边缘继续走正常 alpha blend，避免在云洞边界重新切出像素级硬边。
- 云洞边缘从“mask 加少量噪声扰动”改为“开洞压力与云阻力对抗”：`cloudResistance` 由大团块、billow 扇贝状云缘、细节纹理和云丝纹理组成，密云会咬住边界形成残留云壁，薄云才会被打开，确保 reveal 边缘能看到实际噪声轮廓。
- reveal field 删除外肩半径和 blur 管线，避免 CPU mask 把边界预先抹成圆滑轮廓或同心厚环；自然边缘应主要来自 signed distance 与 shader 云体密度对抗。
- 云洞内部移除独立丝状残雾层，`inwardWisps` 不再增加洞内透明材质；云壁不再对 RGB 做压暗/染色，只通过较低 alpha 保留边缘厚度，避免云洞边缘发黑。
- 云层动画时间改为 renderer 启动后的相对秒数，避免直接把过大的 `performance.now()` 传入 mediump fragment shader 导致慢速流动精度下降。
- 地图重绘时保留云层 canvas，与 terrain/actor canvas 一起从旧 DOM 移植到新 DOM；`campaign-cloud-webgl.ts` 不再因玩家移动重建 WebGL program 或重载噪声贴图，只同步新的 `data-*` 属性和 reveal texture。
- `campaign-cloud-webgl.ts` 的 reveal mask 投影 root 改为每次同步时动态解析，确保保活 canvas 移植到新地图 DOM 后仍使用当前 viewport 投影。
- 云层继续保持完整视口 overlay，不移动回地图 transform；探索挖空改为屏幕空间 mask，随 terrain 相机缩放、拖拽、视口尺寸和累计探索集合重新生成。
- reveal mask 的核心区域完全透明，外侧宽羽化带由 shader 中的云噪声扰动，避免六边形硬边或规则描边感。
- 修正 reveal mask 的纹理采样方向：离屏 2D canvas 的原点在左上，fragment shader 的屏幕 UV 原点在左下，`campaign-cloud.frag.glsl` 采样 `uRevealTexture` 时翻转 Y 轴，避免挖空区域上下错位。
- 云雾合成按参考图重新拆成连续底雾、外围厚云团、洞口灰雾和稀疏浅云四个视觉层；底雾只负责基础遮挡和空气感，外围厚云团用低频圆润云包与局部梯度光照生成亮云顶、软阴影和缓慢流动。
- `campaign-cloud.frag.glsl` 新增 `sampleOuterCloudBankField()`、`sampleOuterPuffCloudLayer()` 和 `sampleApertureHazeLayer()`，让洞口附近不再只靠透明度羽化，而是由云团高度场、浅云距离带和 clear mask 共同决定参考式云洞外缘。
- `campaign-cloud-webgl.ts` 放宽 reveal 浅云距离场，给已探索区外侧提供更宽的灰雾/浅云承接区；中心清空仍由 green 通道 signed-distance field 控制，地图 UI 点击和寻路语义不变。
- 按本地专栏文章的 mask 桥接思路重做云洞路径：云层 shader 先用双向流动的云纹理场采样，再把同一份云灰度场用于扰动 reveal mask UV，最后用 `clampAndPowValue()` 分别重映射洞口边缘和核心清空区。
- 云洞合成新增轻量“投影在前、云体在后”的单 pass 模拟：偏移采样 reveal mask 生成很弱的云体厚度影，但不再形成独立黑色云墙；洞内只保留低强度、由团块噪声触发的零散 wisps，移除完整半透明膜。
- 浅云距离场从过宽外圈收回到更接近已探索区外 1-2 圈的语义范围，深云区重新由低底雾加高 alpha 团块云主导，避免整屏浅雾导致地图大面积透出或白茫茫一片。
- `main.ts` 接入 `syncCampaignCloudWebGl()`；云层只作为视觉 renderer 消费探索状态生成透明 mask，不修改点击、寻路、地形高度、水体 shader 或通行网格。
- `docs/architecture.md` 更新为当前活动的视口云雾 overlay 契约，替换此前“当前不启用云雾 shader renderer”的说明。

### Impact
- 大地图现在有独立、缓慢动态的视口气象云层，并会在玩家累计探索记录覆盖的 hex 上挖空；现有探索机制已在玩家走过的 hex 及其相邻一圈写入 `revealedHexKeys`，云层 renderer 只消费这个累计结果。

## 2026-07-07 Campaign Fog Shader Removal

### Changed
- 删除当前云雾 shader 渲染实现：移除 `campaign-fog-webgl.ts`、`campaign-volumetric-cloud.vert.glsl`、`campaign-volumetric-cloud.frag.glsl`，并停止在大地图 markup 中生成 `data-campaign-map-fog` overlay canvas。
- 保留迷雾探索功能本身：`runtime.mapExplorationByMapId`、进入新 hex 解锁周围一圈、未探索 hex 点击屏蔽和移动路径解锁逻辑继续存在。
- `map_fog_noise` 内容资产暂时保留为后续视觉重做的资源入口，但当前没有活动 fog shader 消费它。

## 2026-07-07 Campaign Fog Volumetric Cloud Adaptation

### Changed
- 大地图迷雾 shader 替换为参考式体积云模型：使用原版 procedural `hash3D`/`noise3D`/`fbm`/伪 Worley、44 步吸收式 raymarch、相位光照和 3 步自阴影生成云层质感。
- 明确“挖空”语义只属于探索可见区域：`revealHole`/`holeSoftness` 由 reveal mask 驱动，用于从云层中扣出已探索地图块和边缘羽化；未探索云层内部不再因为 hollow/noise 露出底图。
- 删除旧的 `campaign-fog.*.glsl` shader 文件，新增 `campaign-volumetric-cloud.vert.glsl` 与 `campaign-volumetric-cloud.frag.glsl`；`campaign-fog-webgl.ts` 只保留 renderer 职责并导入新的体积云 shader。
- 迷雾 renderer 从平面 `createFogSheetMesh` 改为 cube volume mesh，并向 shader 传入原版风格的 `u_time`、`u_cameraPosition`、`u_hollowness`、`u_softness`、`u_density`、`u_detail`、`u_absorption` uniforms；大地图 reveal mask 只在最终 alpha 上裁切已探索区域。
- 修正体积云空间归属：云盒顶点拆分为大地图投影坐标和体积云局部坐标，投影复用 terrain 矩阵并覆盖真实 campaign map 坐标范围，删除相机前方/屏幕空间云块矩阵。

## 2026-07-06 Campaign Fog Shader

### Added
- 新增统一迷雾噪声贴图 `map_fog_noise`，内置元末地图与朱元璋 scenario pack 都通过地图 layer 引用同一类 640x640 可平铺 PNG 资产。
- 新增独立大地图迷雾 WebGL overlay renderer 与独立 shader 文件：迷雾覆盖 terrain、城市标记和 actor/player 层，但不覆盖地图 debug UI。
- 新增 campaign 地图探索状态 `runtime.mapExplorationByMapId`：玩家所在 hex 及一圈邻居会被记录为已探索，新进入的 hex 会记录消散开始时间。
- 新增回归测试，覆盖迷雾资源 layer、content pack 路径解析、独立 fog shader 管线和探索状态解锁逻辑。

### Changed
- 大地图点击现在会先检查目标 hex 是否已探索；未探索迷雾格不会触发城市 marker 移动或空地旅行，水格不可点击/不可踏足逻辑保持由通行网格处理。
- 玩家沿六边形路径移动时会逐步解锁路径中经过的 hex 及其一圈，fog renderer 使用 reveal texture 渲染深雾、浅雾和新格子的慢速消散。
- 迷雾噪声贴图替换为用户提供的 `640x640` `noise_3.png`，内置地图与朱元璋 scenario pack 的 `map_fog_noise` layer 元数据同步为真实尺寸。
- 迷雾 renderer 改为单张连续 overlay 雾面，不再加载高度图或按单个 hex 生成雾层 mesh；hex reveal mask 只负责透明洞口、浅雾范围和消散 alpha。
- 迷雾动态改为持续、缓慢的噪声贴图 UV 平移；即使没有新格子正在消散，雾面也会保持整体漂移，不用明暗闪烁假装动态。
- 迷雾 shader 的 reveal 边界距离场改为与大地图真实竖向 hex 一致，并增强雾面主体的灰白云层密度和对比，避免远处未知区域像一层过浅白膜。
- 迷雾云层改为纯白遮挡层：噪声只驱动 alpha 厚薄和云纹，不再给云层混入灰蓝颜色；深雾区域保持高 alpha 以遮挡下方地图内容。
- 修正迷雾 alpha 合成：浅雾/深雾先各自按云纹计算遮挡强度，再由已探索透明洞口裁切；不再用深雾 mask 乘掉浅雾层，避免整张地图变成几乎不遮挡的白色薄膜。
- 删除上一版叠加式云雾公式，重建为更直接的纯白云层模型：移动噪声采样只生成 `cloudShape`，再分别映射为未知区高遮挡和边缘浅雾 alpha，降低后续视觉调参复杂度。
- 按参考图重新实现云雾视觉：fog shader 恢复使用 `map_fog_noise` 与 `uTimeSeconds` 生成缓慢移动的纯白云团；已探索区域由 reveal mask 硬切为完全透明，云雾只在未探索侧和边缘外侧出现。
- 云雾密度模型曾改为低频云团、中频云卷和高频纤维三层噪声组合；后续体积云版本已移除固定未知区 alpha 底膜，避免读成半透明白膜。
- 云雾渲染改为参考式体积云模型：fog shader 使用 FBM、伪 Worley、共享噪声贴图、吸收式步进和简化自阴影生成云体；探索区域通过 `revealHole`/`holeSoftness` 从云层中开窗，挖空只服务可见地图区域，不在未探索云体内部打洞。
- 大地图 renderer 架构继续保持语义分层：水体视觉仍在 terrain shader 内，迷雾作为独立 overlay shader 消费探索状态，不参与寻路、地形高度或水体判断。

### Impact
- 迷雾状态进入可保存 runtime 数据；旧 runtime 没有 `mapExplorationByMapId` 时按空探索状态兼容处理。
- 后续可替换 `map_fog_noise` 调整雾面质感；运行时只维护一张 compact reveal mask，不为单个格子生成独立贴图或独立雾面几何。

## 2026-07-06 Campaign Water Shader Texture

### Added
- 新增统一水体噪声贴图 `map_water_noise`，内置元末地图与朱元璋 scenario pack 都通过地图 layer 引用同一类 512x512 可平铺 PNG 资产。
- 大地图 WebGL terrain shader 新增 `uWaterTexture` 与 `uTimeSeconds`，水面在 fragment shader 中使用同一张水纹贴图双层滚动采样，形成轻微动态水纹。
- 新增回归测试，锁定 scenario pack 水纹资产路径、内置地图水纹 layer，以及 renderer 的统一水纹 texture/time uniform 契约。

### Changed
- 大地图水体颜色现在会依据周围六边形材质采样计算近岸程度：靠近陆地的水体更浅、更绿，深水保持偏蓝。
- 近岸浅色不再按完整六边形块整格铺开，而是按当前片元到陆地相邻边的距离形成边缘渐变；水纹噪声采样频率提高，避免水面退化成低频纯色块。
- 大地图 WebGL shader 已从 `campaign-terrain-webgl.ts` 的内嵌模板字符串拆到 `src/ui/views/map/shaders/*.glsl`；renderer 只负责 raw import 与少量地图常量占位符替换。
- 浅色近岸边缘范围扩大，水波采样频率、速度和明暗扰动增强，使动态水纹在大地图缩放下更明显。
- 水纹采样改为方向拉伸坐标并沿纹理长轴做轻量平滑，水面纹理从碎噪声改为更长的条状波纹。
- 近岸浅色改为近岸线、浅海线、深海线三层水色带，并采样更远的陆地邻域，使岸边浅色范围更粗、更有层次。
- 修正水体 shader 的过度拉伸噪声与圆形近岸扩散：波纹改为连续长波函数，近岸扩散改用 hex 边界距离，并明确保留近岸、浅海、中层水域三段颜色。
- 海域水体修正为完整 hex ring 采样岸线距离，并移除交叉阈值波线，避免大面积海面出现棋盘格水纹。
- 水体 shader 移除手写正弦波线，改为统一水体噪声图的方向拉伸多层采样，并增加开放海面的噪声明暗颗粒；近岸第一层改按当前水格到共享 hex 边的距离计算，后续海色边界用更宽的低频噪声扰动过渡。
- 水体 shader 的海色分层改以连续 UV 上的 12 向软联合岸线采样为主，扩大第二层浅海覆盖范围；水面 hex 网格线强度大幅降低，噪声波纹对比和明暗扰动增强，减少六边形切分导致的块内断裂。
- 水体 shader 移除了不再参与渲染的旧 hex-ring 岸线函数，避免后续维护时重新把海色分层绑定到单个六边形块。
- 水体波纹调回慢速、克制的单主方向噪声流：细节层改为同向轻扰动，降低 crest/trough 对比、表面明暗扰动和所有时间偏移速度，避免海面出现过强、过快、交叉流动的观感。
- 水体海色分界线新增独立慢变噪声漂移；近岸绿色层缩小为一格内的岸边缘效果，避免绿色浅岸带向外海过宽扩散。
- 水体岸线采样改回与真实大地图六边形 mesh 一致的 6 个邻接方向，移除导致约 30 度错位的半格方向采样；海色分界噪声改为直接扰动岸线采样半径，使浅海/深海边界形状随时间缓慢漂移。
- 水体 shader 删除海岸线噪声、近岸浅色层和浅海/中海/深海分界噪声，仅保留统一水色上的动态水波噪声；水波改用此前更明显的双层滚动噪声采样，并作为全水域表面动态效果叠加。
- 水体 shader 新增连续宽近海区：贴陆地的绿色近岸线继续按真实相邻 hex 共享边计算，不参与噪声扰动；浅海/深海的外缘改用连续 UV 多方向岸距采样，并叠加独立 `nearSeaBoundary` 粗糙撕纸状动态噪声，避免外缘被六边形格子切分。
- 水体浅海外缘采样从固定方向/固定半径的 max 命中改为连续 UV 软采样盘，并让越界 UV 不再计入陆地邻近度，修复远海点阵、射线状浅色碎片和地图边缘异常浅海带。
- 水体近岸线删除此前的实心绿色线、过渡层和 core 阈值分层，重做为单层偏鲜绿 tint：仍按真实相邻 hex 边生成范围，但从陆地边缘向水中平滑衰减，并加入轻微动态噪声位移，避免锐化描边和硬绿墙。
- 水体视觉仍只属于渲染层；水格不可点击、不可踏足、寻路避水继续由 `map_heights` passable hex 网格与 navigation 层负责。

### Impact
- 设计侧可通过 `map_water_noise` 替换水纹资产来调整大地图水体质感；运行时不会为单个水格生成独立贴图，避免引入逐格资源开销。

## 2026-07-06 Campaign Hex Travel Path

### Added
- `src/application/navigation/travel-to-coordinate.ts` 新增 campaign 坐标到六边形路径的纯逻辑转换：点击目标会先映射到与 WebGL 地形一致的 axial hex 坐标，再生成相邻 hex 路径。
- 新增回归测试，锁定 campaign 长距离移动必须产出多步相邻六边形路径，而不是只返回起点和终点。
- 新增基于 `map_heights` 图层的 passable hex 网格：水域 hex 不进入通行集合，navigation 层通过 A* 在可通行 hex 上避开水格。
- 新增回归测试，锁定被阻塞的水格不会出现在路径中，且水面目标会被判定为不可达。

### Changed
- `src/main.ts` 的大地图点击移动改为按路径分段播放，保留原有取消、到达城市确认与移动后推进 1 个时段的行为。
- 大地图空地点击现在会先检查目标 hex 是否可通行；水格点击不会发起旅行。城市/标记移动也会通过同一 passable grid 校验，避免角色踏上水面。
- `docs/architecture.md` 明确：UI 点击层只提交目标坐标，地图路径必须由 application navigation 层生成，不能在视图层或主入口重新实现直线插值。
- `docs/architecture.md` 明确：campaign 地图通行性必须来自地形资产采样，不要在 gameplay 代码里手写水格坐标。

### Impact
- 当前大地图点击寻路会沿六边形格逐段移动并避开水域；后续接入道路、山地等通行成本时，可以继续扩展同一个 navigation 路径生成模块。

## 2026-07-07 Campaign Volumetric Fog Of War

### Added
- 大地图新增 `runtime.mapExploration` 统一探索状态，用 `revealedHexKeysByMapId` 持久记录各地图已解锁 hex。
- 新增 campaign hex 坐标工具和地图探索应用层 helper，玩家初始位置与移动落点会解锁脚下及周围一圈六边形。
- 大地图 WebGL 增加独立 fog canvas/pass，用 reveal mask texture 与分层噪声渲染体积云式战争迷雾；已探索和玩家周围一圈区域保持无云可见。

### Changed
- 地图 view model 会把当前地图探索状态传给 campaign map，渲染层不再自行决定 gameplay 可见性。
- campaign terrain canvas 保留逻辑扩展到 fog canvas，并在保留旧 canvas 时同步新的 data 属性，避免移动后 mask 不刷新。
- fog shader 调整为轻量伪体积云，使用基础形状、细节侵蚀、Beer 吸收和 powder 高光思路；fog mesh 只绘制顶面，避免重新出现六边形侧墙块状云。
- 当前暂时关闭 fog canvas 输出，保留探索状态、解锁逻辑和 shader 代码，后续可以通过 map view 开关恢复显示。

### Impact
- 战争迷雾成为共享游戏状态的一部分，后续存档接入后可以自然保存探索进度。
- 当前实现保留为独立 WebGL 方案，不依赖外部参考工程或 Unity 工具链；后续可单独替换为真正 3D 噪声 texture 或更完整的 ray march。

## 2026-07-07 Generic Activity Fortune Board Minigame

### Added
- 新增 `fortune-board` activity session contract，用于通用活动 fallback 的 5x5 棋盘落子玩法，保留 `activity-qte` playable id 与 legacy compatibility action seam。
- 新增 scene activity overlay 的棋盘 UI：开局按 `天时 / 顺意 / 周全 / 灵犀 / 奇闻 / 平` 分布棋格，玩家用左右按钮调整本轮珠数，点击游玩开始列高亮，再次点击选列落子。
- 新增 `playable.activity-qte.house.temple` integration，使寺庙 house work 可以通过 shared playable runtime 启动同一个 fallback 玩法。

### Changed
- `generic.qte` 启动路径现在默认创建 `fortune-board` session，不再创建停点式 `qte-bar` session；旧 `qte-bar` 和上一版 `work-sequence` 类型仍保留为兼容路径。
- `interactive.activity-qte.play` / `wager-minus` / `wager-plus` 现在经 shared playable runtime 推进棋盘扫描、选列、闪烁、落子、重掷和结算。
- 棋盘结算按被选中格子计算：每格基础 1 分，`天时 / 顺意 / 周全 / 平` 三连分别额外给 10 / 6 / 4 / 1 贡献，`灵犀` 每枚追加 3 枚棋子，`奇闻` 先记录为待补特殊事件。
- 选列后的动画拆为双闪、逐格高亮、随机定格和单枚落子；列扫描与列内扫描 tick 缩短到 0.5 秒，多枚棋子会重复该流程，列内空间不足时未落下的棋子返还。
- `fortune-board` session 新增 `animationTickMs`，overlay 新增“间隔”滑条，玩家可在 250-1000ms 内调整列扫描、列内扫描和阶段 tick 速度；寺庙 house-hosted fallback 会同步重启自己的 work interval，避免继续沿用旧的 1000ms。
- 开始列扫描时不再立刻点亮第一列，而是先进入 scanning 状态并等待下一次 tick 点亮，避免第一次切换视觉上比后续切换更快。
- 列内扫描现在先确定结果再播表现：2/3 概率正向到目标后停下，1/3 概率继续反向复扫；第二次同样 2/3 概率停下，否则第三次正向必定停在既定目标。
- 未选中的棋格重掷时改为棋格自身遮罩动画：旧结果柔边矩形在 1 秒内向下移出棋格，每格有 0-1 秒错峰延迟；全部移出后停半秒，新结果再以同样错峰节奏下翻进入；即使新旧品质相同也会按 `rerollCount` 播放，动画结束前不提前显示新格面。
- 棋盘重掷牌池改为扣除已选棋格后的剩余池：例如 `灵犀` 被选中后后续不再出现，`天时` 被选中一枚后后续池内只剩两枚。
- 最后一枚棋子选中后不再立即退出，先让所有已选棋格闪烁，再让未选中棋格走一次遮罩重掷动画，之后才返回结算。
- fortune board overlay tick 现在优先同步既有 DOM 节点的棋格 class、文案和按钮状态，不再为了高亮变化重建包含按钮的整块 HTML。
- 列内命中的棋格现在会在 `cell-pick` 阶段保留 4 个 tick，并通过 `pickFlashActive` 驱动两次亮起后才结算；重掷遮罩期间父格子会立即移除旧品质 class，旧品质只保留在下滑伪元素中，且伪元素铺满棋格，避免旧格面残留或动画矩形缩水。
- 寺庙帮忙类工作不再启动 house-local `qte-bar` timer；确认工作后会写入 `runtime.playableSession` / `runtime.activitySession`，由 `activity-qte` playable 推进棋盘玩法，完成后再回到寺庙模块按棋盘分数结算贡献、体力、时间和化缘解锁。
- `HouseOverlayViewModel` 增加 `fortune-board` 结构化 overlay，供 house view 渲染 shared activity session，不需要把棋盘玩法复制成寺庙私有 overlay state。

### Impact
- 后续缺少专属 handler 的场景活动会进入新的棋盘落子小游戏，而不是默认停点 QTE。
- 寺庙工作现在和场景 fallback 共享同一个玩法机制；以后改 `generic.qte` / `activity-qte` 的棋盘规则时，场景 fallback 和寺庙工作会一起受益。
- 酒馆等其他 house-local `qte-bar` overlay 尚未替换，后续若要替换应继续通过 shared playable handoff 迁移。

## 2026-07-06 Fail-Closed Progress-Driven Governance Spec

### Added
- 新增仓库级治理 spec：[docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md)，把后续执行模型从 `weekly plan / weekly set / weekly orchestration` 切换为以 `项目进度文档` 为唯一续接真相源的 fail-closed 工作流。

### Changed
- 明确规定：如果 closeout 不能唯一推出 `next child / next action / next entry document`，则当前 child 或 task 不得标记为 `closed`。
- 明确规定：child closeout 必须同时满足结构化 closeout、项目进度同步、next child recheck/none、以及远端 push 成功等硬门禁，否则只能停留在 `running`、`blocked` 或 `completed-but-open`。
- 明确规定：旧 `weekly` 治理文档后续只作为历史记录保留，不再作为当前执行入口或当前队列控制器。
- `docs/superpowers/specs/plan-governance-spec.md`、`docs/superpowers/README.md`、`docs/superpowers/plans/_plan-template.md`、`docs/superpowers/plans/_playable-plan-template.md`、`AGENTS.md` 与 `tools/lint-superpowers-plans.mjs` 已同步切到新模型，避免 spec、入口说明、模板和结构化校验继续各说各话。
- 新增 `docs/superpowers/project-progress.md` 与 `docs/superpowers/templates/project-progress-template.md`、`child-closeout-template.md`、`task-closeout-template.md`，把唯一续接真相源与标准 closeout 输出格式正式落库。
- `docs/superpowers/templates/weekly-*.md` 现已显式标记为历史模板，避免后续再被误当成当前执行入口。
- `docs/superpowers/specs/weekly-orchestration-spec.md` 已显式降级为历史 spec，避免它继续和新治理 spec 形成并列入口。
- 第三轮去歧义清扫已为仍保留旧 `weekly` 术语的历史 child plan / design spec 批量补上 `Legacy Governance Context` 头注，明确这些文件只保留技术与历史语境，不再充当现行治理入口。

### Impact
- 后续治理重构将围绕 `docs/superpowers/project-progress.md`、child plan 模板、closeout 模板与 plan governance spec 展开，而不是继续修补旧 weekly 模型。
- 这次 spec 为正式弃用 weekly plan 提供了仓库内的第一份主规范，后续 README、模板、lint 约束与历史文档定位都将按它收敛。

## 2026-07-02 Spine Plugin Workflow Contract

### Added
- 新增 `docs/spine-plugin.md`，记录 Spine 节点时间轴/绑定管理工具的启动方式、绑定编辑规则、物块图片来源和 JSON 保存交接规则。
- 新增项目内 Codex skill `.codex/skills/start-spine-plugin/SKILL.md`，用于在用户输入“启动spine插件”等请求时自动启动 `tools/spine-node-timeline-editor.html` 对应的 Vite 服务并说明用法。

### Changed
- `AGENTS.md` 新增 Spine 插件触发规则，明确该请求不属于 house work，优先使用项目内 skill。
- Spine 工具协作约定收口为：新增物块图片必须位于 `src/faxian/leg/`，JSON 保存 `leg:` 图片引用和绑定数据，不再把新上传图片内嵌为 base64。

### Impact
- 后续拉取仓库的 Codex 会话可以通过“启动spine插件”进入固定启动流程。
- 复制/导出 JSON 适合提交给 Codex 修改骨骼、绑定、物块变换和动作数据；图片文件本体仍由项目目录管理。

## 2026-07-03 Child 34 Playable Enforcement And Legacy Closeout

### Added
- 新增 `tools/scaffold-playable.mjs`、`tools/scaffold-playable-integration.mjs` 与 `tools/validate-playables.mjs`，把新 playable mechanic、scenario/integration artifact 与仓库级 fail-closed 校验收口到统一 CLI。
- 新增 `.github/workflows/validate-playables.yml`，让 playable artifact 校验在 push / pull request 时进入独立 CI gate。
- 新增 Child 34 定向回归测试，锁定 `package.json` 必须暴露 `scaffold:playable` / `scaffold:playable-integration` / `validate:playables` 三个入口，并要求 scaffold 产出 canonical artifact 与 validator 能拒绝缺失 outcome 条件的 integration 配置。

### Changed
- `package.json` 现已提供 `npm run scaffold:playable`、`npm run scaffold:playable-integration` 与 `npm run validate:playables`，后续新增 playable 不再依赖人工分散找目录、文件名或校验入口。
- `src/core/runtime/interactive-runtime.ts` 删除了已无生产调用方的 `createLaunchInteractiveRequest()` helper；`activity-qte` 与 `city-begging` 的兼容 action id 仍然保留，避免在 Child 34 误删尚未退役的 compatibility seam。
- `src/main.ts` 与已有 robustness 回归已同步收窄到 Child 34 的真实 closeout 边界：只移除已废弃 launch helper，不把仍活跃的 covered compatibility path 伪装成“已完成迁移”。
- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md` 与 Child 34 / weekly orchestration 计划现已记录仓库实际采用的 artifact 目录、脚手架命令、validator 与 CI gate 路径。

### Impact
- 仓库现在对 playable 新增和迁移形成了真正闭环：创作者或 AI 不需要再决定“文件放哪、资源放哪、怎么接校验”，而是通过 framework-owned scaffold 进入统一位置，再由 validator/CI 守约。
- 第一轮 playable-runtime migration queue 至此闭合：`activity-qte`、`city-begging`、`grain-accounting`、`medicine-compounding`、`story-battle` 的统一 runtime proof 已完成，剩余兼容层只保留当前仍在生产路径上有调用方的 action seam。

## 2026-07-03 Child 33 Battle-Family Playable Migration

### Added
- 新增 `src/application/playables/story-battle/story-battle-definition.ts`，把 `story-battle` 的 battle-family launch、action、exit、settlement 与回返语义包进 shared playable wrapper，而不是继续让 `interactive-runtime` 直接持有 battle 业务。
- 新增 Child 33 定向回归测试，锁定 story callback 启动 battle 时必须写入 shared `runtime.playableSession`，并要求 story-battle 结算必须通过 playable-runtime 清空该 session 且返回正确的 keep-house reentry。

### Changed
- `src/application/story/story-callbacks.ts` 现已通过 battle-family playable wrapper 启动 `story-battle`，不再直接把 `storyBattle` 会话启动逻辑当作 story callback 的本地 owner。
- `src/core/runtime/playable-runtime.ts` 现已接管 `story-battle` 的 action/exit/settlement，并允许 battle-family completion 通过 shared runtime result 发出 `reenter-house` handoff。
- `src/core/runtime/interactive-runtime.ts` 对 `story-battle` 已收窄为 compatibility delegation layer；legacy `interactive.story-battle.action` 仍可用，但最终 owner 已切到 playable-runtime。
- `src/main.ts` 的 battle action dispatch 现已通过 `createPlayableActionRequest("story-battle", "battle-action")` 与 `runPlayableRuntime()` 进入 shared playable path，而不再把 `story-battle` 当成 interactive-runtime 专属业务分支。

### Impact
- 仓库现在已经完成 `activity-qte`、`city-begging`、`grain-accounting`、`medicine-compounding`、`story-battle` 五条既有 playable 路径的统一 runtime proof，并且明确保留了 `story-battle` 的 `family: "battle"` 边界。
- 后续 playable 迁移只剩 Child 34 的 enforcement / validator / legacy closeout；battle-family 本身不再需要继续停留在 `interactive-runtime` 的直接 owner line 上。

## 2026-07-03 Child 32 House-Local Mechanic Promotion

### Added
- 新增 `src/application/playables/house-playable-runtime-bridge.ts`，为 house module 提供 shared `gameState + houseSession -> RuntimeState` 桥接，避免 house-local playable 再造一套独立 runtime carrier。
- 新增 `src/application/playables/grain-accounting/grain-accounting-definition.ts` 与 `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`，把粮铺算账与药铺配药的 launch/action/tick/settlement 收口到 shared playable definition 层。
- 新增 Child 32 定向回归测试，锁定 `grain-accounting` 与 `medicine-compounding` 的 launch 必须写入 shared `runtime.playableSession`，settlement 后必须清空该 session 且仍返回正确的 house result overlay。

### Changed
- `src/core/registry/playable-definition-registry.ts` 与 `src/core/registry/playable-integration-registry.ts` 现已纳入 `grain-accounting` 与 `medicine-compounding`，并为两条 house-owned mechanic 建立正式 `integrationId`。
- `src/core/runtime/playable-runtime.ts` 现已接管这两个 house-local mechanic 的 launch/action/finish/exit lifecycle，不再只覆盖 covered interactive playables。
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts` 与 `src/application/house-modules/medicine-house/medicine-house-house-module.ts` 已收窄为 host integration owner：它们继续决定何时触发、何时回到本 house，但具体 mechanic state progression 与 settlement 已委托给 shared playable runtime。
- `docs/special-house-interface.md` 现已明确：house-owned reusable playables 必须通过 shared playable runtime launch/settlement，而不是继续在单个 house module 内维持永久的私有 mechanic runtime。

### Impact
- 仓库现在已经证明 shared playable runtime 不只适用于 covered interactive 路径，也能承接 house-local mechanic，而不需要把 `main.ts` 或 house runtime 重新改回 concrete house business owner。
- `grain-accounting` 与 `medicine-compounding` 迁移完成后，下一条合法 promotion 路径只剩 `story-battle` 的 battle-family child；`Child 34` 仍必须保持 enforcement/legacy closeout 边界，不能被提前打开成 battle migration 的替代品。

## 2026-07-03 Child 31 Covered Interactive Playables Migration

### Added
- 新增 `src/application/playables/activity-qte/activity-qte-definition.ts` 与 `src/application/playables/city-begging/city-begging-definition.ts`，把 `activity-qte` 与 `city-begging` 的 launch/session/result state handler 正式包进 shared playable definition wrapper。
- 在 `src/domain/game-state.ts` 与 `src/application/state/create-initial-state.ts` 增加 shared `runtime.playableSession` carrier，作为 playable-runtime 拥有的统一 active session write-back 路径。
- 新增 Child 31 定向回归测试，锁定 covered activity-qte launch、activity-qte closeout、以及 city-begging settlement 都必须经过 shared playable session 和 playable-runtime lifecycle。

### Changed
- `src/application/activity/activity-runner.ts` 现在通过 playable definition wrapper 启动 generic activity QTE，不再直接把 concrete activity session 写进旧路径。
- `src/core/runtime/playable-runtime.ts` 现已接管 `activity-qte` 与 `city-begging` 的 covered lifecycle mutation、action dispatch、exit closeout 与 city-begging settlement。
- `src/core/runtime/interactive-runtime.ts` 对 `activity-qte` 和 `city-begging` 已收窄为 compatibility delegation layer；`story-battle` 仍保持原边界，等待后续 battle-family child 处理。

### Impact
- 仓库现在已经证明 shared playable runtime 不只是 launch skeleton，而是能真实承接短流程 minigame-family 的 session ownership、action routing 与 settlement write-back。
- `grain-accounting`、`medicine-compounding` 与 `story-battle` 仍未被这轮吞并；后续必须分别按 Child 32 和 Child 33 的边界推进，而不是回头继续扩大 Child 31。

## 2026-07-03 Child 30 Playable Runtime Skeleton And Integration Registry

### Added
- 新增 `src/core/contracts/playable-runtime.ts`，正式定义 `playableId / integrationId / ownerContext / launch / session / settlement` 这一组共享 playable skeleton contract。
- 新增 `src/core/registry/playable-definition-registry.ts` 与 `src/core/registry/playable-integration-registry.ts`，提供 builtin playable definition registry 和 scenario-owned integration-instance registry 的第一版安装面。
- 新增 `src/core/runtime/playable-runtime.ts`，提供 `createLaunchPlayableRequest()`、`resolvePlayableLaunchRequest()`、legacy compatibility session shell，以及统一的 launch normalization seam。
- 新增 Child 30 定向回归测试，锁定 playable contract、definition registry、integration ambiguity fail-closed 规则，以及 `interactive-runtime` 可以通过新的 playable launch seam 启动 covered session。

### Changed
- `src/core/contracts/interactive-runtime.ts` 现已为 active interactive session 补入 `playable` session shell，并要求 launch request 携带经过规范化的 `playableLaunch`。
- `src/core/runtime/interactive-runtime.ts` 不再只靠硬编码 launch/action branch 识别 covered playables；external launch 现在先经过 playable launch normalization，再回到当前兼容路径执行具体 city-begging/activity/story-battle 行为。
- `src/main.ts` 已把 city-begging 的启动入口从 concrete `interactive.city-begging.launch` 字符串收窄到 `createLaunchPlayableRequest("city-begging")`，为后续 Child 31 的 covered playable migration 提前建立 playableId-based intake。

### Impact
- 仓库现在第一次具备了统一 playable runtime 的真实代码骨架，而不再只有文档约束；后续 Child 31-34 可以在这条 skeleton 上继续迁移 covered playables、house-local mechanics 和 `story-battle`。
- 这轮仍然保持 compatibility-first：具体 reducer/presenter/settlement 逻辑还没有迁到 definition-driven playable modules，避免 Child 30 在同一批里膨胀成全量迁移。
- 后续若要继续推进 playable runtime，必须先对 Child 31 做 fresh baseline recheck，再显式 promotion，不能直接跳到 Child 32-34 或把 concrete migration 重新塞回 Child 30。

## 2026-07-03 Child 24 Main Runtime Orchestration Ownerization

### Added
- 新增 `src/application/runtime/main-runtime-orchestrator.ts`，为 `main.ts` 提供显式 `MainRuntimeOrchestratorRequest / Result` seam，把 startup session apply、story timing follow-up、scene progression / choice、以及 passive story trigger sync 收口到一个独立 orchestration owner。
- 新增 Child 24 ownership 回归测试，锁定 `main-runtime-orchestrator` 模块必须存在、`main.ts` 不得继续直接内联 startup apply / scene choice progression / render-time passive trigger 逻辑，并把 Child 15 / 16 / 23 的结构化 guard 放宽到接受新的 orchestrator seam。

### Changed
- `src/main.ts` 现在通过 `createMainRuntimeOrchestrator()` 委托 covered startup session apply，不再在 `applyActivatedModSession()` 本地持有 `syncActivatedContentSource()` + `createAppState()` + house runtime recreation 这一段业务编排。
- `src/main.ts` 现在通过 `main-runtime-orchestrator` 委托 covered story / event / scene follow-up：`city-enter` story handoff、scene advance、scene option choice 不再直接调用 `runStoryTriggerRuntime()`、`advanceStorySceneStep()` 或 `chooseStorySceneOption()`。
- `src/main.ts` 的 `renderApp()` 现已拆成 “显式 orchestration sync + 纯 render frame” 结构；被动 `indoor-screen-shown` story trigger 不再在 presenter pre-pass 中以内联 helper 形式修改 gameplay state。
- Child 24 没有重开 `state-sync-runtime.ts` 的 covered runtime commit sink；`commitRuntimeRequest()` 仍然是 covered runtime request 的正式 write-back 路径，本轮只把 shell 侧 follow-up owner 从 `main.ts` 移到了新的 orchestrator seam。

### Impact
- Child 24 已把这轮目标中的 `main.ts` runtime 编排权显式收窄：shell 仍负责输入和 render scheduling，但 covered startup/session apply、story timing follow-up、scene progression、以及 passive trigger sync 已不再由 `main.ts` 直接主导。
- 这轮没有扩张到 presenter/render redesign、`MainUiFlow` redesign、task/house contract 扩张、或 registry/mod manifest 新族；如果后续还要继续瘦 `main.ts`，必须从 fresh weekly review 重新证明那是不同问题类型。

## 2026-07-03 Child 23 Main Startup Orchestration Extraction

### Added
- 新增 `src/application/startup/startup-session-coordinator.ts`，把 builtin startup、continue/restore、以及 scenario import/start 的 request/result contract 收口到一个显式 coordinator seam，并为 `main.ts` 提供统一的 startup session bootstrap surface。
- 新增 Child 23 ownership 回归测试，锁定 startup coordinator 模块必须存在、`main.ts` 必须改为委托 `runStartupSessionCoordinator()`、以及 Child 22 的 continue/restore/bootstrap parity guard 不能在这轮抽离中退化。

### Changed
- `src/main.ts` 现已把 startup-family 的主决策树从本地 helper 中抽离出来：builtin startup、continue、restore、scenario summary import、scenario file import 都改为通过 `runStartupSessionCoordinator()` 解析 activation/bootstrap，再由 `main.ts` 只负责 loading shell 和最终 session 应用。
- `src/main.ts` 的 activated-session bootstrap helper 现已收口为直接消费 coordinator 返回的 `playerCharacterId + appState + activationResult`，不再在多个 startup entry 函数里各自拼装 fallback player/app-state 逻辑。
- `tests/robustness.test.cjs` 现已把 Child 22 的 continue guard 放宽到允许 direct coordinator delegation，确保新的 startup owner line 不会被旧 helper 名称绑定住。

### Impact
- Child 23 已把 `startup / continue / restore / scenario import` 的 primary orchestration owner 从 `src/main.ts` 挪到独立 coordinator seam，同时保持 `renderApp()`、runtime settlement、`MainUiFlow` 和后续 runtime follow-up 边界不变。
- 这轮没有继续扩张到 render orchestration redesign、save contract 新族、或更大的 `main.ts` thin-shell 改造；若还要继续拆主入口，必须从新的 weekly review 重新证明是不同问题类型。

## 2026-07-02 Child 21 Unified Gameplay Contribution Registry

### Added
- 新增 `src/core/contracts/gameplay-contribution.ts`，正式定义 mod-facing `GameplayContributionDeclaration` 与 activation-facing `GameplayContributionRegistry`，把 navigation / event / scene / task / house contribution families 收口到同一组 contract。
- 新增 Child 21 定向回归测试，锁定 manifest 可声明 `gameplayContributions`、`ActivatedMod` 必须暴露已安装 contribution registry、以及 activation 必须从 content source 安装 navigation / event / scene / task / house / house-module 贡献。

### Changed
- `src/core/contracts/mod-manifest.ts` 现已允许 mod manifest 显式声明 `gameplayContributions`；`src/core/mods/mod-parser.ts` 会校验并规范化这一字段。
- `src/core/contracts/mod-runtime.ts` 与 `src/core/mods/mod-runtime.ts` 现已在 activation output 中携带统一 `gameplayContributions`，并在激活时校验声明的 event / scene / task / house ids 必须真实存在于当前 content source 中。
- `src/core/registry/content-registry.ts` 不再停留在 `Record<string, unknown>` 占位类型，而是收口到稳定的 `ContentPackDefinition` registry typing，避免后续 Child 22 继续建立在 placeholder registry 上。

### Impact
- Child 21 已完成：mod activation 现在不只返回 manifest/source，还会产出一份经过安装和存在性校验的统一 gameplay contribution registry，后续 Child 22 可以围绕这条 activation output 做 builtin/imported/save-restore 的端到端闭环，而不必再重开 contribution contract 讨论。
- 本轮没有把 runtime play、save round-trip 或 presenter parity 吞进来；这些仍然属于 Child 22 的 end-to-end closure 边界。

## 2026-07-02 Child 22 End-to-End Mod-First Runtime Closure

### Changed
- `src/core/save/save-migrations.ts` 现在会把 `engineState.selectedModId` 归一到 envelope 的 `selectedModId`，避免读档后 engine/runtime 对当前激活 mod 的身份判断继续分叉。
- `src/core/save/save-envelope.ts`、`src/core/save/save-migrations.ts` 与 `src/core/save/save-loader.ts` 现在会持久化并恢复 `selectedModSource`，对 builtin save 自动补齐 builtin source，对 imported file/url save 保留可恢复的 source descriptor，而不是只保存 `selectedModId`。
- `src/main.ts` 新增 shared activated-session bootstrap helper，并让 builtin startup、scenario-pack startup、以及 continue/restore 路径都通过同一条 activation-result -> active-content sync -> app-state bootstrap 线路进入会话。
- `src/main.ts` 的 continue 流程不再在 restore 之后重新覆盖回 builtin startup；当存在已保存的 `selectedModId` 时，它现在优先走 restore-first 的 loading/startup 路径。
- `src/main.ts` 的 restore 路径现在会在 fresh page load 后优先按 `selectedModSource` 重新 load builtin/file/url mod source，而不是假定 imported mod 仍然残留在内存里的 `availableModsById` 中。

### Impact
- Child 22 现已完成：builtin startup、imported activation、save envelope、fresh restore 以及 covered runtime spine 现在组成一条更完整的 mod-first closure path，不再要求 imported mod restore 依赖旧内存中的 activation residue。
- 这轮没有继续扩到 editor/tooling/UI redesign；后续如果还要继续拆分，只能通过新的 weekly review 打开不同问题类型，而不是继续在 Child 22 上追加同类闭环 work。

## 2026-07-02 Child 20 House Runtime Mod Registration

### Added
- 新增 `src/core/registry/house-module-registry.ts`，定义共享 `HouseModuleRegistration` / `HouseModuleRegistry` seam，并提供 builtin fallback registry 装配点。
- 新增 `src/application/house-modules/builtin-house-module-registrations.ts` 与 `src/ui/views/house/builtin-house-module-renderers.ts`，把 builtin house module 与 renderer 贡献改为通过共享 registration seam 装配，而不是由 runtime / presenter / view 各自维护静态表。
- 新增 Child 20 定向回归测试，锁定 shared house registry seam、core runtime / presenter / renderer lookup 不再依赖 application 静态 registry，以及 `docs/special-house-interface.md` 必须明确 builtin 与 mod-owned house 共用同一条 registration path。

### Changed
- `src/core/runtime/house-runtime.ts` 与 `src/application/house/house-runtime.ts` 现已通过共享 `HouseModuleRegistry` 解析 house module，并支持后续以依赖注入方式替换 builtin registry。
- `src/application/presenter/stage-presenters.ts` 现已通过共享 `HouseModuleRegistry` 解析 house module view-model，而不再直接依赖 `src/application/house-modules/house-module-registry.ts`。
- `src/ui/views/house/house-module-view-registry.ts` 现已通过共享 `HouseModuleRegistry` 解析 renderer，而不再保留本地静态 renderer 表。
- `docs/special-house-interface.md` 现已明确：builtin houses 与 mod-owned houses 必须通过同一条 shared registration seam 进入 runtime / presenter / renderer 路径。

### Impact
- Child 20 当前批次已完成基线复核和 shared registry seam 首次落地；house runtime owner line 不再被 builtin application registry 直接绑定。
- 后续 Child 20 剩余工作应继续停留在 house registration boundary 内，避免把这轮实现扩张成 Child 21 的 generalized gameplay contribution registry redesign。

## 2026-07-02 Unified Minigame Contract Spec

### Added
- 新增仓库级 spec：[docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md)，统一定义小游戏的 registry、launch、session、command、presenter、result、settlement 与 owner handoff contract。

### Changed
- 明确后续小游戏工作不再视为 house-local 或 overlay-local 约定，而是统一纳入仓库级 runtime/presenter/settlement 边界。
- 明确现有 `activity-qte`、`city-begging`、`grain-accounting` 与 `medicine-compounding` 的渐进迁移顺序，以及“完成后必须回到正确 owner/session”的硬性要求。
- 明确 `story-battle` 不属于这套小游戏 taxonomy；它必须与小游戏 registry/runtime 作为并列 interactive family 区分，而不是被收进统一小游戏注册面。

### Impact
- 后续新增或改造小游戏时，启动、渲染、结算与回跳将有统一 contract 可依，不再继续把接线逻辑扩散到 `main.ts`、house module 或局部 overlay 分支中。
- 这份 spec 为后续 implementation plan 提供了正式边界；下一步应基于该 spec 写可执行迁移计划，而不是直接散点重构。
- 后续若整理 `story-battle`，应单独走 battle/combat 方向的 spec，而不是复用本小游戏 spec 直接改名套用。

## 2026-07-03 Unified Playable Runtime Contract Spec

### Added
- 新增仓库级 spec：[docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md)，把统一 runtime 的顶层 taxonomy 从 `minigame` 提升为 `playable`，并以 `family: "minigame" | "battle"` 约束具体子类。
- 新增 candidate-only 的 fresh weekly orchestration 计划：[docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md)，为 playable runtime 迁移预先建立独立队列，而不是把该问题类型附着到当前进行中的 `main-shell-ownerization` weekly set 上。
- 新增未来阶段用的独立 child plan：
  - [docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-31-covered-interactive-playables-migration-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-31-covered-interactive-playables-migration-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-32-house-local-mechanic-promotion-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-32-house-local-mechanic-promotion-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-33-battle-family-playable-migration-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-33-battle-family-playable-migration-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md)
- 新增轻量 queued child specs：
  - [docs/superpowers/specs/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-31-covered-interactive-playables-migration-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-31-covered-interactive-playables-migration-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-32-house-local-mechanic-promotion-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-32-house-local-mechanic-promotion-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-33-battle-family-playable-migration-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-33-battle-family-playable-migration-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-spec.md)
- 新增当前 playable 盘点文档：[docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md)，记录首轮 playable queue 的 current-state ownership matrix 以及未纳入 Child 30-34 的后续 playable-like 候选。
- 新增四份 playable companion docs：
  - [docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md)
  - [docs/superpowers/specs/2026-07-03-playable-scaffold-and-validator-io-draft.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-scaffold-and-validator-io-draft.md)
  - [docs/superpowers/specs/2026-07-03-playable-ai-authoring-protocol.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-ai-authoring-protocol.md)
  - [docs/superpowers/specs/2026-07-03-playable-test-strategy.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-test-strategy.md)

### Changed
- 明确 `story-battle` 现纳入统一 playable runtime 范围，不再被排除在顶层 registry/runtime/presenter/settlement/handoff contract 之外。
- 明确 `story-battle` 必须保留 `family: "battle"` 的边界，不能为了统一 runtime 而被压平成普通小游戏语义。
- 将 [docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md) 降为 superseded 历史文档。
- 为 playable spec 补充“创作者责任边界”和“统一接入/目录归位/资源放置规则”，明确后续新增 playable 时，内容作者只关心玩法内容，不负责工程接线与资源管理策略。
- 将 playable spec 的结果模型进一步收紧为“玩法产出 fact result，剧本/集成层提供 outcome config，runtime 按配置判断胜负/取消并发放奖励”，避免把剧情语义硬编码回 playable 机制层。
- 为 playable spec 补充“缺失配置语义”规则，明确触发信息、owner 信息、outcome 条件缺失时必须 fail-closed，而奖励和 handoff 仅在文档明确允许时才可走显式 fallback。
- 继续将 playable spec 从“原则性 contract”收紧为“可执行闭环 contract”：新增 `integrationId` 这一层 scenario-owned playable use-site identity，明确同一 `playableId` 被多处复用时，触发、结算、奖励与回跳都必须绑定到唯一 integration instance。
- 为 playable spec 新增 trigger evaluation contract，明确“触发由谁配置”之外，还要求 framework-owned trigger evaluator 负责把命中的 trigger 规约为唯一的 `integrationId + playableId + ownerContext` launch request。
- 为 playable spec 新增 owner session recovery contract，明确 `sessionToken` 的签发、恢复、失效和 fallback 语义，防止统一结算后再次退回到 view/shell 猜测回跳目标。
- 为 playable spec 新增 scaffold / validator / CI enforcement 要求，明确该 spec 后续必须通过脚手架、schema/typed validator 和 CI 门禁执行，而不是只靠文档约定。
- 新增 [docs/superpowers/plans/_playable-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/_playable-plan-template.md)，作为后续新增 playable、迁移 legacy playable、以及从 house/scene 流程中剥离 playable 的统一 active-plan 骨架。
- 在 playable spec 的 follow-up 中明确：后续 playable 相关执行计划应从 `_playable-plan-template.md` 起步，同时仍受通用 `_plan-template.md` 与 `plan-governance-spec.md` 约束。
- 将 playable runtime 迁移进一步拆成多 child 的阶段式候选队列，而不是预设成一个超大 child：当前 candidate 队列先记录 Child 30（runtime skeleton 与 integration registry）、Child 31（`activity-qte` / `city-begging` 迁移）、以及更后的 Child 32-34 候选阶段。
- 将 Child 30-34 全部预写成独立 future plan 文件，但明确保持为 non-executable；它们现在只是后续 fresh weekly promotion 的候选执行载体，不改变当前 active weekly set 的执行权。
- 将 Child 30-34 的计划文档 `Based On Spec` 回补为各自独立 child spec，而不再只引用顶层 playable contract spec，便于后续按 child 做 baseline recheck 与 promote。
- 为 playable runtime 这条线继续补齐实施前文档：冻结 `playableId / integrationId / triggerId / sessionId` 命名规则，预写 scaffold/validator 命令的输入输出草案，定义 AI 创作时的角色分工与提示协议，并按 Child 30-34 规划测试策略。

### Impact
- 后续 runtime 规划和迁移不再围绕“小游戏是否包含战斗”反复分叉，而是统一围绕 playable runtime 展开。
- 后续实现 plan 需要以 playable registry/runtime 为主线，同时对 `minigame` 与 `battle` 两类保留不同内部语义与 presenter/layout 约束。
- 后续若框架仍要求新增玩法的人手动决定代码目录、资产归位、注册点或 glue 路径，应视为 framework 缺口，而不是让内容创作者承担该复杂度。
- 后续同一 playable 可以被不同剧本以不同胜负条件、奖励和回跳方式复用，机制实现与剧本结算配置不再强耦合。
- 后续 runtime / editor / validator 在面对缺失配置时不能再各自猜默认行为，必须遵守 spec 里定义的 fail-closed 与 explicit fallback 规则。
- 这份 playable spec 现在不再只回答“该怎么设计”，而是开始回答“触发如何归一、结算如何唯一定位、回跳如何恢复、门禁如何执行”；后续实现 plan 可以直接围绕这些强制节点展开，而不是再次补概念口子。
- 后续不管是“新增 playable”、还是“把分散在 house / scene / local flow 的玩法剥离出来”，都可以沿同一份 plan 模板落地，减少每次重新定义迁移骨架的成本，也降低 AI/多人协作时的 plan 漂移。
- 后续 playable runtime 工作现在既不会破坏“同一时间只允许一个 active executable child”的治理规则，也不会因为前置拆分不足而把多个机制问题揉进一个难以验证的大迁移批次。
- 当前在不触碰 active weekly set 的前提下，playable runtime 这条线已经具备“candidate queue + queued child spec + future child plan + ownership inventory”四层前置文档，后续只需等当前 active set 关闭后从 Child 30 做正式 baseline recheck 即可。
- 当前这条线又向前补成“candidate queue + queued child spec + future child plan + ownership inventory + naming rules + scaffold/validator I/O draft + AI protocol + test strategy”的前置文档组合；后续 promote 时不需要再从零发明命名、输入输出或 AI 协作规则。

## 2026-07-02 Child 19 Task Runtime Mod Contract

### Added
- 新增 Child 19 回归测试，明确要求 `src/domain/content-pack.ts` 暴露可选 `tasks` contribution surface，`src/application/content/content-pack-loader.ts` 能从 shared manifest path 加载 `tasks.json`，并且 `src/application/scenario/scenario-pack-loader.ts` 把 `tasks` 视为正式可校验的 optional split-table。

### Changed
- `src/domain/content-pack.ts` 现已增加 `tasks?: TaskDefinition[]`，使 content-pack / scenario-pack 都能通过同一条 pack contract 携带 task definitions。
- `src/application/content/content-pack-loader.ts` 现已把 `tasks` 纳入 shared `CONTENT_PACK_FILE_KEYS`，使 manifest-driven content pack 可以加法式加载 task contribution，而不影响不提供该文件的旧 pack。
- `src/application/scenario/scenario-pack-loader.ts` 现已显式声明 `tasks?: string` manifest file slot，并在 parse 阶段校验 `tasks` 必须是数组，避免 scenario pack 对 task contribution 继续停留在隐式透传状态。
- `src/application/content/active-game-content.ts` 现已把 task definitions 纳入 active content assembly，导出 `taskDefinitions` 与 `taskDefinitionsById`，使已激活 pack 的 task contribution 能进入统一 lookup surface。
- `src/domain/game-state.ts` 与 `src/application/state/create-initial-state.ts` 现已把 `TaskRuntimeState` 落入 `gameState.runtime.tasks`，让任务运行态通过统一游戏状态结构保存，而不是停留在外部临时容器。
- `src/core/runtime/runtime-dispatch.ts` 现已新增 shared task settlement pass：当 routed runtime result 返回 `taskActions` / `taskSignals` 且 commit context 提供 `taskDefinitionsById` 时，dispatch 会调用 task runtime、写回 `gameState.runtime.tasks`、合并 `taskUpdates`，并继续通过 runtime settlement 应用 task effects。
- `src/main.ts` 现已维护 active task definition 索引，并为 covered runtime commit context 提供该索引，使 shared runtime dispatch 具备消费已激活 task contributions 的注册面。

### Impact
- Child 19 已完成：task definitions 现在可以通过 shared pack contract 声明、进入 active content lookup、并由 shared runtime dispatch 通过 typed task actions/signals 驱动 task runtime progression。
- 这次收口没有重开 house registration、general contribution registry、或完整 task authoring DSL；后续边界应转向 Child 20 的 house runtime mod registration baseline recheck，而不是把 Child 19 扩成更大的 registry redesign。

## 2026-07-02 Child 14 Interactive Remaining Legacy Convergence

## 2026-07-02 Child 17 Pack Content Decoupling

## 2026-07-02 Child 18 Runtime Spine Unification

### Added
- 新增 Child 18 回归测试，明确要求 `src/core/runtime/state-sync-runtime.ts` 导出共享 `commitRuntimeRequest()`，并要求 `src/main.ts` 的 covered `day-start`、`advance-segments`、`enter-city`、`story-battle`、`city-begging` 与 `activity-qte` 路径不再手工重复 runtime bridge create/apply write-back。

### Changed
- `src/core/runtime/state-sync-runtime.ts` 新增 `commitRuntimeRequest()`，把 `createRuntimeBridgeState()` -> `dispatchRuntimeRequest()` -> `applyRuntimeBridgeState()` 这一条 shared runtime commit 链收口为一个正式 helper。
- `src/main.ts` 的 covered `day-start`、`advance-segments`、`enter-city` 与 `story-battle` dispatch 路径，现已统一通过 `commitRuntimeRequest()` 提交 runtime request，而不再各自手写 bridge create/apply glue。
- `src/main.ts` 的 covered `city-begging` 与 `activity-qte` interactive write-back 路径，也已统一改为通过 `commitRuntimeRequest()` 提交到 interactive runtime route，不再直接组合 `createInteractiveRuntimeState()` / `applyInteractiveRuntimeResult()`。

### Impact
- Child 18 已完成：covered runtime entry 与 covered interactive write-back 现在共享一条更明确的 commit spine，`src/main.ts` 在这些路径上不再持有重复的 runtime bridge write-back 逻辑。
- 这次收敛没有吸收 task contract、house registration、manifest/registry policy redesign；下一个后续项应回到 Child 19 的 task-runtime mod-facing baseline recheck，而不是继续扩张 Child 18 边界。

### Added
- 新增 Child 17 回归测试，明确要求 `src/content/story/index.ts`、`src/content/houses/*.ts`、以及 covered `keep-house` / `temple-house` house module 消费端不再直接 hard-import `scenario-packs/zhuyuanzhang/**`。
- 新增 `src/content/pack-content-access.ts`，把默认 builtin `zhuyuanzhang` pack 的 story / house-content / activities / text JSON 读取集中到一个共享内容访问接缝。
- 新增 `src/application/content/pack-content-access.ts`，给 application 层消费端提供 pack-content access re-export seam。

### Changed
- `src/content/story/index.ts` 现在通过 `src/content/pack-content-access.ts` 获取默认 story events/scenes/text entries，不再直接导入 `zhuyuanzhang` pack 文件。
- `src/content/houses/home-house-content.ts`、`grain-shop-content.ts`、`keep-house-content.ts`、`market-house-content.ts`、`medicine-house-content.ts`、`tavern-content.ts` 与 `tea-house-content.ts` 现在通过共享 pack-content access seam 读取默认 house content，不再各自直接导入 `zhuyuanzhang` house-content JSON。
- `src/application/house-modules/keep-house/keep-house-house-module.ts` 与 `src/application/house-modules/temple-house/temple-house-house-module.ts` 现在通过共享 pack-content access seam 读取默认 activities / text entries，不再直接导入 `zhuyuanzhang` pack 表。

### Impact
- Child 17 已完成：covered production consumers 不再通过 scenario-specific 源码路径直接读取 `zhuyuanzhang` pack 内容，后续 mod-first 工作可以建立在共享 content access seam 上，而不是继续扩散 direct-import coupling。
- 这次收敛没有重开 Child 15/16 的 runtime handoff 设计，也没有改动 task/house/registry 的共享 contract 边界；下一个后续项应回到 Child 18 的 runtime spine baseline recheck。

### Added
- 新增 Child 14 回归测试，明确要求 `src/core/runtime/interactive-runtime.ts` 不再依赖 `legacy-interactive-adapter.ts` 持有 covered `activity-qte` / `story-battle` 生命周期，并要求 `src/main.ts` 关闭 `activity-qte` 结果面板时必须通过 `createExitInteractiveRequest("activity-qte")` 回到 interactive runtime。

### Changed
- `src/core/runtime/interactive-runtime.ts` 现在直接调用 `advanceActivityQteMarker()`、`stopActivityQte()` 与 `dispatchStoryBattleAction()`，不再通过 legacy interactive adapter 持有 covered `activity-qte` tick/stop 和 `story-battle` action dispatch ownership。
- `src/main.ts` 的 `closeCurrentActivityResult()` 不再直接调用 `clearActivityResult()`；该关闭路径现在通过 interactive runtime exit request 完成。
- `src/core/adapters/legacy-interactive-adapter.ts` 已降为历史占位文件，不再作为 covered 生产路径的实际 owner。

### Impact
- Child 14 已完成：remaining same-type covered interactive legacy tails 已从 adapter/shell 侧收口到 runtime owner line，后续 weekly continuation 不需要再把 interactive family 作为下一优先收敛边界。
- 当前后续 priority 已转向 Child 15 的 navigation/time mixed entry convergence；Child 16 仍保留为 event/scene handoff 的锁定后续项。

## 2026-07-02 Child 15 Navigation + Time Runtime Convergence

### Added
- 新增 Child 15 回归测试，明确要求 `src/main.ts` 在 covered `enter-city`、`day-start`、`advance-segments` 生产路径上不再直接调用 `runNavigationRuntime()` / `runTimeRuntime()`，而必须通过 shared `dispatchRuntimeRequest()` 收口。

### Changed
- `src/core/runtime/navigation-runtime.ts` 新增 `routeNavigationRuntime()`，把 navigation runtime 接入 shared `RuntimeState` / `RuntimeResult` dispatch 语言。
- `src/core/runtime/time-runtime.ts` 新增 `routeTimeRuntime()`，把 covered 时间推进入口接入 shared `RuntimeState` / `RuntimeResult` dispatch 语言。
- `src/core/runtime/state-sync-runtime.ts` 新增通用 bridge helper：`createRuntimeBridgeState()`、`applyRuntimeBridgeState()` 与 `applyRuntimeBridgeResult()`；原 interactive helper 改为委托给这些通用桥接函数。
- `src/main.ts` 的 covered `enter-city`、`day-start` 与 `advance-segments` 入口已改为 shared dispatch + runtime bridge write-back，不再直接把 shell 绑定到 navigation/time helper。

### Impact
- Child 15 已完成：covered navigation/time mixed entry 已收口到 shared runtime dispatch line，`src/main.ts` 只保留 bounded shell residue：`triggerStoryEventsForTiming("city-enter")` 与 `syncCouncilPriorityAfterGameStateChange()`。
- 下一个应审查的边界不再是同类 navigation/time 入口，而是 Child 16 的 event/scene handoff；是否还需要进一步处理 bounded residue，必须在 Child 16 baseline recheck 后再决定。

## 2026-07-02 Child 16 Event + Scene Handoff Convergence

### Added
- 新增 Child 16 回归测试，明确要求 `src/main.ts` 的 covered `triggerStoryEventsForTiming()` helper 不再直接 stitch `runEventRuntime()` 与 `runSceneFromEvent()`，同时锁定 covered `city-enter` 与 `indoor-screen-shown` 路径继续通过同一条 shared story-trigger seam 收口。

### Changed
- `src/core/runtime/event-runtime.ts` 新增 `runStoryEventRuntime()`，把基于 `EventTriggerTiming` 的 story trigger request 和 trigger input 组装收口到 event runtime 内。
- `src/core/runtime/scene-runtime.ts` 新增 `runStoryTriggerRuntime()`，把 covered story trigger 的 event activation 与 event -> scene handoff 串接收口到 runtime family 内，而不是继续由 `src/main.ts` 手工拼接。
- `src/main.ts` 的 `triggerStoryEventsForTiming()` 现在只调用 `runStoryTriggerRuntime()` 并做结果写回，不再自己直接调用 `runEventRuntime()` / `runSceneFromEvent()`。

### Impact
- Child 16 已完成：covered `city-enter` 与 `indoor-screen-shown` story handoff 已收口到一个 runtime-owned seam；本周这条 same-type event/scene handoff debt 不再保留 queued child。
- `2026-07-02` weekly set 已消费完 visible queue 并关闭。后续如果还要继续抽取，必须以新的 weekly review 重新证明它是不同的问题类型，而不是继续追加同类 child。

## 2026-07-02 Child 13 Shared Dispatch Reentry Convergence

### Added
- 新增 Child 13 回归测试，明确要求 `src/main.ts` 不再内联处理 `reenter-house` follow-up，且 `HouseRuntimeBridge` 必须能直接接管该 shared-dispatch reentry 收口路径。

### Changed
- `src/core/runtime/house-runtime.ts` 现在导出 `applyInteractiveFollowUp()` bridge seam，可在不额外触发浏览器层 render 分支的前提下，把 `reenter-house` follow-up 直接收口到 house runtime 自身。
- `src/main.ts` 的 `dispatchCurrentStoryBattleAction()` 不再自己判断 `interactive.houseId` 或维护 `followUpRendered` 分支；story-battle action 的剩余 Bucket A reentry 路径现在通过 shared dispatch follow-up -> `houseRuntime.applyInteractiveFollowUp()` 完成。
- `tests/robustness.test.cjs` 新增 Child 13 red-to-green coverage，锁定 `main.ts` 的 branch removal 和 `HouseRuntimeBridge` 的 reentry ownership。

### Impact
- Child 13 已完成：剩余同类 post-Child-11 Bucket A follow-up/reentry 路径已全部收口到 shared dispatch line 下，不再留下新的同类 Bucket A remainder。
- 本次审计没有发现 Bucket B 的 Child 11 backfill 问题，也没有发现 Bucket C 的新边界 follow-up；后续若还要继续 runtime continuation，必须先经过新的 weekly review/spec/plan，而不是继续扩写 Child 13。

## 2026-07-02 UI Contract Reserve

### Added
- 新增 `src/domain/ui/*` 未来 UI contract reserve 类型：`screen-schema`、`screen-layout`、`screen-skin`、`asset-catalog` 与组合后的 `ui-screen-contract`。
- 新增 `src/application/ui/*` 纯 UI reserve seam：validator、layout/skin resolver、asset layered alias resolver 与 builtin registry。
- 新增 `src/content/ui/*` builtin reserve 数据，覆盖当前 layout editor 的四个 screen target，并提供 alias-based UI asset catalog。

### Changed
- `src/domain/content-pack.ts` 增加可选 `uiScreenSchemas`、`uiLayouts`、`uiSkins`、`uiAssetCatalogs` reserve 字段。
- `src/application/content/content-pack-loader.ts` 以加法方式支持对应的 optional UI split-table file keys，不要求现有 pack 提供这些文件。
- `tests/robustness.test.cjs` 增加 UI contract reserve、builtin reserve seed、optional pack UI reserve、以及 inactive-by-default 保护测试。
- `tsconfig.test.json` 现在覆盖 `src/content/ui/**/*.ts`，使 Child 12 reserve 模块进入测试编译；同时避免把依赖 `import.meta.glob` 的现有 layout-editor runtime 文件误纳入 CommonJS 测试构建。

### Impact
- Child 12 已完成：future UI contract reserve、pack UI split-table reserve 与 explicit asset layering rules 均已落地，但当前 `src/main.ts`、现有 layout editor 路径和默认 runtime/render 行为保持不变。
- 这次落地没有启用 Editor mode，也没有把 reserve registry 接进当前生产运行时；后续 UI override / schema-driven renderer 工作仍需新的 child 明确接手。

## 2026-07-01 Runtime Contract Hardening

### Added
- 新增 `src/core/contracts/effect-settlement.ts`，定义 effect settlement 的 emitter/applier、输入、输出、unsupported-effects 与 warnings seam。
- 新增 `src/core/contracts/house-runtime.ts`，定义 house runtime 的 core-owned `enter / leave / dispatch` request contract。

### Changed
- `src/core/contracts/runtime-request.ts` 现在导出显式 typed request families；`src/core/runtime/runtime-router.ts` 由函数别名升级为正式 router seam；`src/core/runtime/runtime-dispatch.ts` 改为通过 formal router 和 formal settlement entrypoint 工作。
- `src/core/contracts/interactive-runtime.ts` 与 `src/core/runtime/interactive-runtime.ts` 现在定义 launch/action/exit/result/session seam，并通过一个 normalizer 统一覆盖 `activity-qte`、`city-begging`、`story-battle` 的公开 dispatch 语言。
- `src/core/runtime/runtime-settlement.ts` 现在显式报告 settled/unsupported effects 和 warnings，而不是静默忽略未覆盖 effect kinds。
- `src/core/runtime/house-runtime.ts` 不再把 domain `HouseModuleRequest` 作为 shared public contract 暴露；legacy adapter 仍在内部兼容层保留。

### Impact
- Child 9 已完成 shared contract baseline：后续 ownerization 可以围绕正式的 request/router、interactive dispatch、effect settlement 和 house runtime request seams 进行，而不必再依赖隐式 bridge 行为。
- Child 9 没有移除 legacy house/interactive adapters，也没有吸收 UI/layout 或 runtime ownerization 工作；这些明确递延到 Child 10 / Child 11。

## 2026-07-01 StateSync Runtime

### Added
- 新增 `src/core/contracts/state-sync-runtime.ts`，定义 `CanonicalRuntimeState`、`AppStateBridge`、`SaveState`、`PresentationInput`、`StateSyncTrigger`、`StateSyncResult` 与 `StateSyncRuntime`。
- 新增 `src/core/runtime/state-sync-*` 首版 StateSync Runtime seam，覆盖 validation、normalization、hydration、app bridge、pre-save snapshot、mod activation rebuild 与 presentation input preparation。

### Changed
- `src/main.ts` 不再直接声明 interactive RuntimeState creation/write-back helpers；这些 bridge-period helpers 已移入 StateSync runtime boundary。
- `src/core/contracts/runtime-state.ts` 和 `src/core/contracts/core-state.ts` 增加 legacy/bridge-period alias，避免继续把旧 `RuntimeState` 名称误认为 canonical authority。

### Impact
- StateSync Runtime 已有 formal runtime owner；Child 8 不接管 gameplay dispatch、save IO、mod activation、presenter/render 或 feature-specific business logic。

## 2026-07-01 Mod Runtime

### Added
- 新增 `src/core/contracts/mod-runtime.ts`，定义 `ModSourceDescriptor`、`LoadedMod`、`ActivatedMod`、`ModRuntimeState`、`ModRuntimeRequest`、`ModRuntimeFailure` 与 `ModActivationResult`。
- 新增 `src/core/mods/*` 首版 Mod Runtime seam，覆盖 source normalization/loading/parsing、dependency/capability validation 与 atomic activation rollback。
- 新增 `src/core/adapters/mod-runtime-main-adapter.ts`，把 `ModActivationResult` 转为当前 bootstrap/content assembly 可消费的兼容输入。

### Changed
- `src/main.ts` 的 builtin、file import、url import 与 restore selected-mod activation 现在先经过 Mod Runtime，再继续走现有 content assembly / bootstrap 路径。
- `src/core/contracts/mod-manifest.ts` 增加 `schemaVersion`、dependency/conflict/capability 和 default start 字段，供 Mod Runtime validation 与 startup handoff 使用。

### Impact
- Mod activation/startup 已有 formal runtime owner；Child 7 不接管最终内容合成、save/load IO、gameplay runtime execution、UI/menu/loading-screen、hot reload 或 sandboxing。

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
