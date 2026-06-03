import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const sceneRoot = path.join(rootDir, "HD2DEG", "scene");

const citySpecs = [
  { id: "city.kulan", slug: "kulan", title: "濠州" },
  { id: "city.yingtian", slug: "yingtian", title: "集庆路" },
  { id: "city.luzhou", slug: "luzhou", title: "庐州路" },
  { id: "city.anqing", slug: "anqing", title: "安庆路" },
  { id: "city.taiping", slug: "taiping", title: "太平路" },
  { id: "city.anfeng", slug: "anfeng", title: "安丰路" },
  { id: "city.runing", slug: "runing", title: "颍州" },
  { id: "city.huaian", slug: "huaian", title: "高邮府" },
  { id: "city.yangzhou", slug: "yangzhou", title: "扬州路" },
  { id: "city.suzhou", slug: "suzhou", title: "平江路" },
  { id: "city.wuchang", slug: "wuchang", title: "武昌路" },
  { id: "city.nanchang", slug: "nanchang", title: "龙兴路" },
  { id: "city.chongqing", slug: "chongqing", title: "重庆路" },
  { id: "city.chengdu", slug: "chengdu", title: "成都路" },
  { id: "city.ningbo", slug: "ningbo", title: "庆元路" },
  { id: "city.wenzhou", slug: "wenzhou", title: "温州路" },
  { id: "city.fuzhou", slug: "fuzhou", title: "福州路" },
  { id: "city.dadu", slug: "dadu", title: "大都路" },
  { id: "city.kaifeng", slug: "kaifeng", title: "汴梁路" },
  { id: "city.gongchang", slug: "gongchang", title: "巩昌路" },
  { id: "city.fengyuan", slug: "fengyuan", title: "奉元路" },
];

const houseTemplates = [
  { key: "leader_residence", moduleId: "leader-residence", name: "将领府邸", type: "residence" },
  { key: "temple", moduleId: "temple-house", name: "寺庙", type: "temple" },
  { key: "home", moduleId: "home-house", name: "自宅", type: "residence" },
  { key: "keep", moduleId: "keep-house", name: "帅府", type: "castle" },
  { key: "tea_house", moduleId: "tea-house", name: "茶馆", type: "tea-house" },
  { key: "market", moduleId: "market-house", name: "货栈", type: "merchant" },
  { key: "grain_shop", moduleId: "grain-shop", name: "粮铺", type: "merchant" },
  { key: "medicine_house", moduleId: "medicine-house", name: "药铺", type: "medicine-house" },
  { key: "inn", moduleId: "tavern", name: "客栈", type: "inn" },
];

const buildingAssets = {
  marshall: "HD2DEG/building/中国风像素建筑-明朝红巾军帅府",
  house1: "HD2DEG/building/中国风像素建筑-元末明初平民住宅1",
  house2: "HD2DEG/building/中国风像素建筑-元末明初平民住宅2",
  grain: "HD2DEG/building/中国风像素建筑-粮食店",
  restaurant: "HD2DEG/building/二层酒楼",
  temple: "HD2DEG/building/故宫大殿",
};

const characterAssets = {
  general: "HD2DEG/character/红巾军将领",
  soldier: "HD2DEG/character/红巾军小兵",
  scholar: "HD2DEG/character/淮西文人",
  monk: "HD2DEG/character/npc_temple_monk",
  innkeeper: "HD2DEG/character/npc_inn_bosslady",
  merchant: "HD2DEG/character/npc_merchants_husband",
};

function getHouseId(slug, houseKey) {
  if (slug === "kulan" && houseKey === "home") return "home_001";
  if (houseKey === "home") return `home.${slug}`;
  return `house.${slug}.${houseKey}`;
}

function getBuildingAssetForModule(moduleId) {
  switch (moduleId) {
    case "keep-house":
    case "leader-residence":
      return buildingAssets.marshall;
    case "grain-shop":
      return buildingAssets.grain;
    case "tavern":
    case "tea-house":
      return buildingAssets.restaurant;
    case "temple-house":
      return buildingAssets.temple;
    case "market-house":
      return buildingAssets.house2;
    case "medicine-house":
    case "home-house":
    default:
      return buildingAssets.house1;
  }
}

function getCharacterAssetForModule(moduleId) {
  switch (moduleId) {
    case "keep-house":
    case "leader-residence":
      return characterAssets.general;
    case "temple-house":
      return characterAssets.monk;
    case "tavern":
    case "tea-house":
      return characterAssets.innkeeper;
    case "market-house":
    case "grain-shop":
    case "medicine-house":
      return characterAssets.merchant;
    default:
      return characterAssets.soldier;
  }
}

function toSceneKey(value) {
  return value
    .replace(/^house\./, "")
    .replace(/^home[._]/, "home.")
    .replaceAll(".", "_")
    .replaceAll("-", "_");
}

function readAssetMeta(assetDir) {
  const metaPath = path.join(rootDir, assetDir, "meta.json");
  return JSON.parse(fs.readFileSync(metaPath, "utf8"));
}

function makeGroundDataUrl() {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGklEQVR4nGNk+M9QzwAEYBxVSF+F5lQBALeQAhHvhXesAAAAAElFTkSuQmCC";
}

function makeInterior(houseTemplate) {
  const hasTable = houseTemplate.moduleId !== "temple-house";
  return {
    version: 1,
    kind: "house-room",
    width: 15,
    height: 15,
    door: { side: "south", x: 7, y: 15, entryX: 7, entryY: 14 },
    spawnX: 7.5,
    spawnY: 14.5,
    facilities: hasTable
      ? [
          { id: "table", x: 6, y: 6, w: 3, d: 2, h: 0.8, block: true, top: "#8f6140", sideColor: "#4a2f1c" },
          { id: "cabinet", x: 11, y: 9, w: 2, d: 1, h: 1.35, block: true, top: "#72513a", sideColor: "#321d12" },
        ]
      : [
          { id: "altar", x: 6, y: 3, w: 3, d: 2, h: 1.1, block: true, top: "#9a7c45", sideColor: "#4a3218" },
        ],
  };
}

function makeNpc(npcId, name, homeObjectId, assetDir, wx, wy, role) {
  const characterMeta = readAssetMeta(assetDir);
  return {
    npcId,
    name,
    homeObjectId,
    sheetCharacterId: characterMeta.id,
    renderScale: 0.82,
    heightWorld: 4,
    wx,
    wy,
    initialWx: wx,
    initialWy: wy,
    needs: { hunger: 20, energy: 85, comfort: 70, social: 50, curiosity: 45 },
    inventory: [],
    equipment: [],
    memory: [],
    _initialMemory: [],
    emotions: { mood: 0, stress: 0, hope: 0, frustration: 0 },
    dayPlan: null,
    currentTask: null,
    recentEvents: [],
    relationships: {},
    current: { action: "idle", targetWx: null, targetWy: null },
    meta: { role, personality: [], skills: [], appearancePrompt: characterMeta.prompt || characterMeta.title || name },
    anchors: { home: `house:${homeObjectId}`, work: `house:${homeObjectId}:front`, social: ["town-square"], boundary: [] },
    dailyPattern: { archetype: role, wakeMin: 360, sleepMin: 1260, defaultBlocks: [] },
    activityProfile: { primary: ["stand_guard", "receive_guest"], secondary: ["chat"], facilityUse: [] },
    socialProfile: { closeTo: [], tradeWith: [], chatTopics: ["军情", "市井", "粮价"] },
    emotionBias: { baselineMood: 0, stressors: [], comforts: [] },
    storyHooks: [],
  };
}

function generateScene(city) {
  const sceneId = `zyz_${city.slug}_city`;
  const now = new Date().toISOString();
  const objects = [];
  const npcs = [
    makeNpc(`npc.${city.slug}.player_shadow`, "朱元璋", null, characterAssets.soldier, 0, 10, "player-anchor"),
  ];
  const npcDesignEntries = [];
  const locationRefs = { "town-square": { wx: 0, wy: 0, radius: 14 } };
  const roadNetwork = { points: [], segments: [], bounds: null, mode: "zhu-city-grid-streets" };
  const houseLayoutByKey = {
    leader_residence: { wx: 0, wy: -118, angle: Math.PI * 0.5, frontX: 0, frontY: -92 },
    keep: { wx: -58, wy: -82, angle: Math.PI * 0.5, frontX: -58, frontY: -56 },
    temple: { wx: 86, wy: -78, angle: Math.PI * 0.5, frontX: 86, frontY: -52 },
    market: { wx: -84, wy: -8, angle: 0, frontX: -58, frontY: -8 },
    grain_shop: { wx: 84, wy: -8, angle: Math.PI, frontX: 58, frontY: -8 },
    tea_house: { wx: -84, wy: 54, angle: 0, frontX: -58, frontY: 54 },
    inn: { wx: 84, wy: 54, angle: Math.PI, frontX: 58, frontY: 54 },
    medicine_house: { wx: -42, wy: 112, angle: -Math.PI * 0.5, frontX: -42, frontY: 86 },
    home: { wx: 42, wy: 112, angle: -Math.PI * 0.5, frontX: 42, frontY: 86 },
  };
  const streetSegments = [
    { ax: 0, ay: 128, bx: 0, by: -96, width: 6, role: "main-street" },
    { ax: -92, ay: -8, bx: 92, by: -8, width: 5, role: "market-street" },
    { ax: -92, ay: 54, bx: 92, by: 54, width: 4, role: "inn-street" },
    { ax: -52, ay: 86, bx: 52, by: 86, width: 4, role: "south-residence-street" },
    { ax: -58, ay: -56, bx: 86, by: -52, width: 4, role: "north-civic-street" },
  ];
  for (const seg of streetSegments) {
    roadNetwork.segments.push({
      ...seg,
      baseColor: [210, 156, 92],
      highlightColor: [232, 198, 145],
      minX: Math.min(seg.ax, seg.bx) - seg.width,
      minY: Math.min(seg.ay, seg.by) - seg.width,
      maxX: Math.max(seg.ax, seg.bx) + seg.width,
      maxY: Math.max(seg.ay, seg.by) + seg.width,
    });
  }

  houseTemplates.forEach((houseTemplate, index) => {
    const houseId = getHouseId(city.slug, houseTemplate.key);
    const objectId = index + 1;
    const sceneObjectId = `zyz.${toSceneKey(houseId)}`;
    const layout = houseLayoutByKey[houseTemplate.key];
    const wx = layout.wx;
    const wy = layout.wy;
    const angle = layout.angle;
    const frontX = layout.frontX;
    const frontY = layout.frontY;
    const assetDir = getBuildingAssetForModule(houseTemplate.moduleId);
    const meta = readAssetMeta(assetDir);
    const widthTiles = Number(meta.widthTiles) || 15;

    objects.push({
      id: objectId,
      type: "generated",
      wx,
      wy,
      angle,
      scale: 0.14,
      label: `${city.title} ${houseTemplate.name}`,
      tags: ["house"],
      interactionTags: ["house"],
      drawRoad: true,
      buildingTag: "house",
      isHouse: true,
      _worldGenerated: true,
      asset: {
        kind: "generated-building",
        prompt: meta.prompt || meta.title || houseTemplate.name,
        widthTiles,
        tags: ["house"],
        interactionTags: ["house"],
        buildingTag: "house",
        drawRoad: true,
        voxelOptions: meta.voxelOptions || null,
        libraryMeta: meta,
      },
      interiorRef: {
        id: `${sceneId}__interior__house_${objectId}`,
        parentSceneId: sceneId,
        hostObjectId: objectId,
        version: 1,
      },
      interior: makeInterior(houseTemplate),
      properties: {
        zhuYuanzhangBridge: {
          version: 2,
          sceneObjectId,
          houseId,
          cityId: city.id,
          label: houseTemplate.name,
          source: "house-card-scene-generator",
        },
        zhuStopPoint: {
          wx: frontX,
          wy: frontY,
          radius: 10,
        },
      },
      model: null,
    });

    roadNetwork.points.push({ x: frontX, y: frontY });
    const nearestStreet = streetSegments.reduce((best, seg) => {
      const midX = (seg.ax + seg.bx) * 0.5;
      const midY = (seg.ay + seg.by) * 0.5;
      const d = Math.hypot(frontX - midX, frontY - midY);
      return d < best.d ? { seg, d } : best;
    }, { seg: streetSegments[0], d: Infinity }).seg;
    const horizontal = Math.abs(nearestStreet.ax - nearestStreet.bx) >= Math.abs(nearestStreet.ay - nearestStreet.by);
    const joinX = horizontal ? frontX : nearestStreet.ax;
    const joinY = horizontal ? nearestStreet.ay : frontY;
    roadNetwork.segments.push({
      ax: joinX,
      ay: joinY,
      bx: frontX,
      by: frontY,
      width: 3,
      baseColor: [210, 156, 92],
      highlightColor: [232, 198, 145],
      role: "house-front-access",
      minX: Math.min(joinX, frontX) - 3,
      minY: Math.min(joinY, frontY) - 3,
      maxX: Math.max(joinX, frontX) + 3,
      maxY: Math.max(joinY, frontY) + 3,
    });

    const npcCount = houseTemplate.moduleId === "keep-house" ? 2 : 1;
    for (let npcIndex = 0; npcIndex < npcCount; npcIndex += 1) {
      const npcAsset = getCharacterAssetForModule(houseTemplate.moduleId);
      const offset = npcIndex === 0 ? -4 : 4;
      const npcId = `npc.${city.slug}.${houseTemplate.key}.${npcIndex + 1}`;
      npcs.push(
        makeNpc(
          npcId,
          npcIndex === 0 ? `${houseTemplate.name}管事` : `${houseTemplate.name}随从`,
          objectId,
          npcAsset,
          frontX + offset,
          frontY + 2,
          houseTemplate.name
        )
      );
      npcDesignEntries.push({
        npcId,
        anchors: {
          home: `house:${objectId}`,
          work: `${sceneObjectId}:front`,
          social: ["town-square"],
          boundary: [],
        },
        dailyPattern: {
          archetype: houseTemplate.name,
          wakeMin: 360,
          sleepMin: 1260,
          defaultBlocks: [
            {
              activityType: "standby",
              startMin: 360,
              endMin: 1260,
              locationRef: `${sceneObjectId}:front`,
              mode: "soft_do",
              wanderRadius: 4,
              arrivalSlackMin: 8,
              note: "stand near mapped house",
            },
          ],
        },
        activityProfile: { primary: ["standby"], secondary: ["chat"], facilityUse: [] },
        socialProfile: { closeTo: [], tradeWith: [], chatTopics: ["军情", "市井"] },
        emotionBias: { baselineMood: 0, stressors: [], comforts: [] },
        storyHooks: [],
      });
    }

    locationRefs[`${sceneObjectId}:front`] = {
      wx: frontX,
      wy: frontY,
      radius: 8,
      houseId,
      sceneObjectId,
    };
  });

  const bounds = { minX: -140, minY: -150, maxX: 140, maxY: 150 };
  roadNetwork.bounds = bounds;

  const scene = {
    schemaVersion: 1,
    kind: "world",
    id: sceneId,
    title: `${city.title} 3D 城市`,
    savedAt: Date.now(),
    nextBuildingId: objects.length + 1,
    tilemapBaseDataUrl: makeGroundDataUrl(),
    tilemapDataUrl: makeGroundDataUrl(),
    objects,
    roadNetwork,
    spawn: { x: 0, y: 0 },
    bounds,
    entities: { npcs },
    extensions: {
      sceneKind: "world",
      zhuYuanzhangCityScene: {
        version: 1,
        cityId: city.id,
        generatedFrom: "city-house-cards",
        usesOnlyLibraryAssets: true,
      },
    },
    sceneMeta: {
      kind: "world",
      cityId: city.id,
      generatedFrom: "city-house-cards",
    },
    updatedAt: now,
  };

  const npcDesign = {
    schemaVersion: 1,
    npcs: npcDesignEntries,
    locationRefs,
    activityResolvers: {},
    facilities: {},
  };

  return { sceneId, scene, npcDesign };
}

function updateSceneIndex(generatedItems) {
  const indexPath = path.join(sceneRoot, "index.json");
  const existing = fs.existsSync(indexPath)
    ? JSON.parse(fs.readFileSync(indexPath, "utf8"))
    : { items: [] };
  const byId = new Map((existing.items || []).map((item) => [item.id, item]));
  for (const item of generatedItems) {
    byId.set(item.id, item);
  }
  const items = Array.from(byId.values()).sort((a, b) => {
    const az = String(a.id || "").startsWith("zyz_") ? 0 : 1;
    const bz = String(b.id || "").startsWith("zyz_") ? 0 : 1;
    if (az !== bz) return az - bz;
    return String(a.id || "").localeCompare(String(b.id || ""));
  });
  fs.writeFileSync(
    indexPath,
    JSON.stringify({ updatedAt: new Date().toISOString(), count: items.length, items }, null, 2) + "\n",
    "utf8"
  );
}

const generatedItems = [];
for (const city of citySpecs) {
  const { sceneId, scene, npcDesign } = generateScene(city);
  const sceneDir = path.join(sceneRoot, sceneId);
  fs.mkdirSync(sceneDir, { recursive: true });
  fs.writeFileSync(path.join(sceneDir, "scene.json"), JSON.stringify(scene, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(sceneDir, "npc-design.json"), JSON.stringify(npcDesign, null, 2) + "\n", "utf8");
  generatedItems.push({
    id: sceneId,
    kind: "scene",
    title: scene.title,
    createdAt: scene.updatedAt,
    updatedAt: scene.updatedAt,
    schemaVersion: 1,
    objectCount: scene.objects.length,
    buildingCount: scene.objects.length,
    npcCount: scene.entities.npcs.length,
    files: { scene: `scene/${sceneId}/scene.json` },
  });
}

updateSceneIndex(generatedItems);
console.log(`Generated ${generatedItems.length} HD2DEG city scenes.`);
