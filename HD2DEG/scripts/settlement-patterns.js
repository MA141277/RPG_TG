(function () {
  const STORAGE_KEY = "pixelwf_settlement_pattern_lab_v2";
  const HOUSE_W = 15;
  const HOUSE_H = 10;
  const WORK_W = 18;
  const WORK_H = 12;
  const LOT_PADDING = 2;
  const ROAD_REACH = 18;

  function ls(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (_) {}
    return val === undefined ? null : undefined;
  }

  function clamp(n, min, max, fallback) {
    const v = Number(n);
    if (!Number.isFinite(v)) return fallback;
    return Math.max(min, Math.min(max, v));
  }

  function xmur3(str) {
    str = String(str || "");
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createRng(seedText) {
    const seedFn = xmur3(seedText);
    const rand = mulberry32(seedFn());
    return {
      int(min, max) {
        return Math.floor(min + rand() * (max - min + 1));
      },
      float(min, max) {
        return min + rand() * (max - min);
      },
    };
  }

  function rect(x, y, w, h, kind, extra) {
    return Object.assign({ x, y, w, h, kind }, extra || {});
  }

  function rectCenter(r) {
    return { x: r.x + r.w * 0.5, y: r.y + r.h * 0.5 };
  }

  function rectsOverlap(a, b, padding = 0) {
    return !(
      a.x + a.w + padding <= b.x ||
      b.x + b.w + padding <= a.x ||
      a.y + a.h + padding <= b.y ||
      b.y + b.h + padding <= a.y
    );
  }

  function distance(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function segmentAabb(seg, pad = 0) {
    return {
      x: Math.min(seg.ax, seg.bx) - pad,
      y: Math.min(seg.ay, seg.by) - pad,
      w: Math.abs(seg.ax - seg.bx) + pad * 2,
      h: Math.abs(seg.ay - seg.by) + pad * 2,
    };
  }

  function nearestPointOnSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq <= 1e-6) return { x: ax, y: ay, t: 0 };
    const t = clamp(((px - ax) * dx + (py - ay) * dy) / lenSq, 0, 1, 0);
    return { x: ax + dx * t, y: ay + dy * t, t };
  }

  function makeRoad(id, role, points, width = 4) {
    const segments = [];
    for (let i = 0; i + 1 < points.length; i++) {
      segments.push({
        id: id + "_seg_" + i,
        roadId: id,
        role,
        ax: points[i].x,
        ay: points[i].y,
        bx: points[i + 1].x,
        by: points[i + 1].y,
        width,
        baseColor: [210, 156, 92],
        highlightColor: [232, 198, 145],
      });
    }
    return { id, role, points, width, segments };
  }

  function createPlan(settings) {
    const size = settings.gridSize;
    return {
      version: "0.2.0",
      mode: settings.mode,
      seed: settings.seed,
      grid: { cols: size, rows: size, tileSize: 1 },
      footprint: {
        house: { w: HOUSE_W, h: HOUSE_H },
        work: { w: WORK_W, h: WORK_H },
      },
      zones: [],
      roads: [],
      roadSegments: [],
      lots: [],
      anchors: [],
      debug: {
        rejected: [],
        attemptedLots: 0,
      },
    };
  }

  function addZone(plan, x, y, w, h, kind, role) {
    const zone = rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), kind, {
      id: "zone_" + (plan.zones.length + 1),
      role: role || kind,
    });
    plan.zones.push(zone);
    return zone;
  }

  function addRoad(plan, id, role, points, width) {
    const road = makeRoad(id, role, points, width);
    plan.roads.push(road);
    road.segments.forEach((seg) => plan.roadSegments.push(seg));
    return road;
  }

  function findNearestRoadPoint(plan, x, y) {
    let best = null;
    let bestDist = Infinity;
    for (const seg of plan.roadSegments) {
      const p = nearestPointOnSegment(x, y, seg.ax, seg.ay, seg.bx, seg.by);
      const d = distance(x, y, p.x, p.y);
      if (d < bestDist) {
        bestDist = d;
        best = { x: p.x, y: p.y, roadId: seg.roadId, segmentId: seg.id, distance: d };
      }
    }
    return best;
  }

  function facingFromVector(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? "east" : "west";
    return dy >= 0 ? "south" : "north";
  }

  function facingVector(facing) {
    if (facing === "north") return { x: 0, y: -1 };
    if (facing === "south") return { x: 0, y: 1 };
    if (facing === "east") return { x: 1, y: 0 };
    return { x: -1, y: 0 };
  }

  function buildLotCandidate(plan, cx, cy, kind, options) {
    const w = kind === "work" ? WORK_W : HOUSE_W;
    const h = kind === "work" ? WORK_H : HOUSE_H;
    const x = Math.round(cx - w * 0.5);
    const y = Math.round(cy - h * 0.5);
    const center = { x: x + w * 0.5, y: y + h * 0.5 };
    const nearest = findNearestRoadPoint(plan, center.x, center.y);
    const nomadic = !!(options && options.nomadic);
    let facing = "south";
    let roadAccess = null;
    if (nearest) {
      facing = facingFromVector(nearest.x - center.x, nearest.y - center.y);
      roadAccess = { x: nearest.x, y: nearest.y, roadId: nearest.roadId, distance: nearest.distance };
    } else if (options && options.faceTo) {
      facing = facingFromVector(options.faceTo.x - center.x, options.faceTo.y - center.y);
      roadAccess = { x: options.faceTo.x, y: options.faceTo.y, roadId: "", distance: 0 };
    }
    const fv = facingVector(facing);
    const door = {
      x: center.x + fv.x * (w * 0.5),
      y: center.y + fv.y * (h * 0.5),
    };
    return {
      id: "lot_" + (plan.lots.length + 1),
      kind,
      x,
      y,
      w,
      h,
      center,
      facing,
      door,
      roadAccess,
      roadId: roadAccess ? roadAccess.roadId : "",
      tags: kind === "house" ? ["house"] : ["facility"],
      widthTiles: w,
      depthTiles: h,
      valid: true,
      nomadic,
    };
  }

  function rectHitsRoad(plan, r) {
    for (const seg of plan.roadSegments) {
      if (rectsOverlap(r, segmentAabb(seg, seg.width * 0.5), 0)) return true;
    }
    return false;
  }

  function validateLot(plan, lot) {
    const grid = plan.grid;
    if (lot.x < 1 || lot.y < 1 || lot.x + lot.w > grid.cols - 1 || lot.y + lot.h > grid.rows - 1) {
      return "超出 tilemap 边界";
    }
    for (const zone of plan.zones) {
      if (zone.kind !== "camp" && rectsOverlap(lot, zone, LOT_PADDING)) return "压到中心/功能区";
    }
    for (const placed of plan.lots) {
      if (rectsOverlap(lot, placed, LOT_PADDING)) return "建筑占地重叠";
    }
    if (!lot.nomadic && rectHitsRoad(plan, lot)) return "压到道路";
    if (!lot.nomadic && (!lot.roadAccess || lot.roadAccess.distance > ROAD_REACH)) return "没有可接入道路";
    return "";
  }

  function addLot(plan, cx, cy, kind, options) {
    plan.debug.attemptedLots++;
    const lot = buildLotCandidate(plan, cx, cy, kind, options);
    const reason = validateLot(plan, lot);
    if (reason) {
      plan.debug.rejected.push({
        kind,
        x: Math.round(cx),
        y: Math.round(cy),
        reason,
      });
      return null;
    }
    plan.lots.push(lot);
    plan.anchors.push({
      id: "anchor_" + plan.anchors.length,
      role: kind === "house" ? "resident" : "worker",
      kind: "npc",
      lotId: lot.id,
      x: lot.door.x,
      y: lot.door.y,
    });
    plan.anchors.push({
      id: "anchor_" + plan.anchors.length,
      role: kind === "house" ? "furniture" : "work-prop",
      kind: "item",
      lotId: lot.id,
      x: lot.center.x,
      y: lot.center.y,
    });
    if (lot.roadAccess && !lot.nomadic) {
      addRoad(plan, "apron_" + lot.id, "apron", [lot.door, { x: lot.roadAccess.x, y: lot.roadAccess.y }], 3);
    }
    return lot;
  }

  function addCluster(plan, rng, cx, cy, count, spread, kind, options) {
    let placed = 0;
    const maxTries = count * 8;
    for (let i = 0; i < maxTries && placed < count; i++) {
      const buildingKind = placed % 6 === 0 && kind !== "house" ? "work" : kind;
      const lot = addLot(
        plan,
        cx + rng.float(-spread, spread),
        cy + rng.float(-spread, spread),
        buildingKind || "house",
        options
      );
      if (lot) placed++;
    }
  }

  function generateRadial(settings, rng) {
    const plan = createPlan(settings);
    const size = settings.gridSize;
    const cx = size * 0.5;
    const cy = size * 0.5;
    addZone(plan, cx - 8, cy - 8, 16, 16, "center", "plaza");
    plan.anchors.push({ id: "anchor_core", role: "plaza", kind: "center", x: cx, y: cy });
    const spokes = settings.roadStrength > 65 ? 6 : 4;
    const radius = size * (0.23 + settings.spread * 0.003);
    for (let i = 0; i < spokes; i++) {
      const angle = -Math.PI * 0.5 + (Math.PI * 2 * i) / spokes;
      const end = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
      addRoad(plan, "spoke_" + i, "trunk", [{ x: cx, y: cy }, end], 4);
    }
    const perSpoke = Math.max(2, Math.round(settings.population / spokes));
    for (let i = 0; i < spokes; i++) {
      const angle = -Math.PI * 0.5 + (Math.PI * 2 * i) / spokes;
      const tangent = angle + Math.PI * 0.5;
      for (let j = 1; j <= perSpoke; j++) {
        const t = j / (perSpoke + 1);
        const baseX = cx + Math.cos(angle) * radius * t;
        const baseY = cy + Math.sin(angle) * radius * t;
        const side = j % 2 ? -1 : 1;
        addLot(
          plan,
          baseX + Math.cos(tangent) * side * rng.float(13, 20),
          baseY + Math.sin(tangent) * side * rng.float(13, 20),
          j % 5 === 0 ? "work" : "house"
        );
      }
    }
    addCluster(plan, rng, cx, cy, 2, 12, "work");
    return plan;
  }

  function generateGrid(settings, rng) {
    const plan = createPlan(settings);
    const size = settings.gridSize;
    const cx = size * 0.5;
    const cy = size * 0.5;
    addZone(plan, cx - 9, cy - 6, 18, 12, "center", "plaza");
    const gap = Math.round(clamp(34 - settings.roadStrength / 8, 22, 36, 28));
    for (let x = gap; x < size - gap; x += gap) addRoad(plan, "grid_v_" + x, "trunk", [{ x, y: 4 }, { x, y: size - 4 }], 3);
    for (let y = gap; y < size - gap; y += gap) addRoad(plan, "grid_h_" + y, "trunk", [{ x: 4, y }, { x: size - 4, y }], 3);
    let placed = 0;
    for (let x = gap * 0.5; x < size - gap * 0.5 && placed < settings.population; x += gap) {
      for (let y = gap * 0.5; y < size - gap * 0.5 && placed < settings.population; y += gap) {
        if (Math.abs(x - cx) < 18 && Math.abs(y - cy) < 14) continue;
        const lot = addLot(plan, x + rng.int(-3, 3), y + rng.int(-3, 3), placed % 5 === 0 ? "work" : "house");
        if (lot) placed++;
      }
    }
    return plan;
  }

  function generateRing(settings, rng) {
    const plan = createPlan(settings);
    const size = settings.gridSize;
    const cx = size * 0.5;
    const cy = size * 0.5;
    const r = 24 + settings.spread * 0.24;
    addZone(plan, cx - 9, cy - 6, 18, 12, "center", "plaza");
    addRoad(plan, "ring_outer", "trunk", [
      { x: cx - r, y: cy - r },
      { x: cx + r, y: cy - r },
      { x: cx + r, y: cy + r },
      { x: cx - r, y: cy + r },
      { x: cx - r, y: cy - r },
    ], 4);
    if (settings.roadStrength > 35) {
      addRoad(plan, "ring_cross_h", "branch", [{ x: cx - r, y: cy }, { x: cx + r, y: cy }], 3);
      addRoad(plan, "ring_cross_v", "branch", [{ x: cx, y: cy - r }, { x: cx, y: cy + r }], 3);
    }
    for (let i = 0; i < settings.population; i++) {
      const side = i % 4;
      const t = (i / Math.max(1, settings.population - 1)) * r * 2;
      let x = cx;
      let y = cy;
      if (side === 0) {
        x = cx - r + t;
        y = cy - r - 13;
      } else if (side === 1) {
        x = cx + r + 13;
        y = cy - r + t;
      } else if (side === 2) {
        x = cx + r - t;
        y = cy + r + 13;
      } else {
        x = cx - r - 13;
        y = cy + r - t;
      }
      addLot(plan, x, y, i % 7 === 0 ? "work" : "house");
    }
    addCluster(plan, rng, cx, cy, 2, 12, "work");
    return plan;
  }

  function generateScatteredVillage(settings, rng) {
    const plan = createPlan(settings);
    const size = settings.gridSize;
    const baseY = size * 0.5 + rng.float(-4, 4);
    const path = [];
    for (let x = 8; x <= size - 8; x += 7) {
      path.push({ x, y: baseY + Math.sin(x * 0.16) * (2 + settings.spread * 0.035) + rng.float(-1, 1) });
    }
    if (settings.roadStrength > 12) addRoad(plan, "village_main", "trunk", path, 4);
    const clusters = Math.max(3, Math.round(settings.population / 5));
    for (let i = 0; i < clusters; i++) {
      const anchor = path[Math.floor((i + 1) * path.length / (clusters + 1))];
      const dir = i % 2 ? 1 : -1;
      if (settings.roadStrength > 35) {
        addRoad(plan, "village_branch_" + i, "branch", [
          { x: anchor.x, y: anchor.y },
          { x: anchor.x + rng.float(-4, 4), y: anchor.y + dir * rng.float(12, 20) },
        ], 3);
      }
      addCluster(plan, rng, anchor.x, anchor.y + dir * rng.float(18, 28), Math.max(1, Math.round(settings.population / clusters)), 12 + settings.spread * 0.12, "house");
      plan.anchors.push({ id: "anchor_node_" + i, role: "local-node", kind: "center", x: anchor.x, y: anchor.y });
    }
    addZone(plan, size * 0.45, baseY - 6, 18, 12, "center", "village-core");
    return plan;
  }

  function generateNomad(settings, rng) {
    const plan = createPlan(settings);
    const size = settings.gridSize;
    const camps = Math.max(2, Math.round(settings.population / 9));
    for (let i = 0; i < camps; i++) {
      const cx = rng.float(size * 0.2, size * 0.8);
      const cy = rng.float(size * 0.2, size * 0.8);
      const tents = Math.max(4, Math.round(settings.population / camps));
      const campRadius = 16 + settings.spread * 0.14;
      addZone(plan, cx - 6, cy - 4, 12, 8, "camp", "campfire");
      plan.anchors.push({ id: "anchor_camp_" + i, role: "campfire", kind: "center", x: cx, y: cy });
      for (let j = 0; j < tents; j++) {
        const a = Math.PI * 2 * j / tents + rng.float(-0.35, 0.35);
        const rr = campRadius + rng.float(-4, 4);
        addLot(
          plan,
          cx + Math.cos(a) * rr,
          cy + Math.sin(a) * rr,
          j % 6 === 0 ? "work" : "house",
          { nomadic: true, faceTo: { x: cx, y: cy } }
        );
      }
    }
    return plan;
  }

  const MODES = {
    radial: {
      label: "放射型",
      summary: "以中心广场、神殿、领主厅或市场为核心，道路像辐条一样向外生长。",
      traits: ["中心权重极高", "玩家容易识别主建筑", "外围可以按环层扩张", "适合权力或宗教中心明显的聚落"],
      promptHint: "例如：围绕神殿生长的山城、以市场为核心的商旅镇、领主大厅周围的附属居民区。",
      designHint: "道路先定义主干，再由每个 lot 自动生成门点和 apron 短接，映射主世界时可直接转 scene object。",
      generator: generateRadial,
    },
    grid: {
      label: "网状型",
      summary: "规则街区和交叉道路形成强规划感，最像新建殖民镇、工业镇或 Minecraft 村庄的规整版本。",
      traits: ["可读性最高", "扩建容易", "功能区可模块化", "但生活感需要用噪声和装饰打破"],
      promptHint: "例如：殖民前哨、工业矿镇、新垦农庄、工程师规划过的方格镇。",
      designHint: "适合玩家后续插入建筑和扩建地块。每个街区都可以转成独立 lot 或保留为后续扩建空间。",
      generator: generateGrid,
    },
    ring: {
      label: "回字 / 环带型",
      summary: "外圈道路或围墙包住核心，内外秩序清楚，适合寨、宗族村、围城和防御聚落。",
      traits: ["边界感强", "入口和门楼天然重要", "中心区可以承载宗祠/井/广场", "容易做内外阶层"],
      promptHint: "例如：有牌坊和宗祠的传统村、山寨、围墙小镇、以中央井为核心的环形聚落。",
      designHint: "适合加门禁、守卫、城墙、夜晚关闭入口等机制。外圈道路本身就是边界条件。",
      generator: generateRing,
    },
    scattered: {
      label: "散落村庄型",
      summary: "房屋顺着地形、道路、水源和耕地松散聚集，不追求几何对称，更像自然生长的村庄。",
      traits: ["生活感最强", "局部成簇", "道路可以弯曲且不完整", "适合事件、邻里关系和小型地标"],
      promptHint: "例如：河边村、山脚村、森林边缘农庄、资源点旁慢慢长出来的生活聚落。",
      designHint: "适合作为默认自然村。当前会先生成主路和支路，再用 footprint 验证把住宅簇贴到路边。",
      generator: generateScatteredVillage,
    },
    nomad: {
      label: "游牧营地型",
      summary: "没有固定路网，帐篷、营火、牲畜圈和车队围成临时节点，重点是迁徙而不是建设。",
      traits: ["几乎没有道路", "中心是营火或牲畜圈", "建筑更像可移动节点", "适合季节性刷新"],
      promptHint: "例如：草原游牧部落、商旅车队营地、战争行军营、沙漠绿洲旁的临时驻点。",
      designHint: "不强制道路接入。lot 会朝向营火，适合以后映射成临时帐篷、车队和可迁移 NPC anchor。",
      generator: generateNomad,
    },
  };

  const modeSelect = document.getElementById("modeSelect");
  const seedInput = document.getElementById("seedInput");
  const gridSizeInput = document.getElementById("gridSizeInput");
  const populationInput = document.getElementById("populationInput");
  const spreadInput = document.getElementById("spreadInput");
  const roadInput = document.getElementById("roadInput");
  const regenBtn = document.getElementById("regenBtn");
  const randomSeedBtn = document.getElementById("randomSeedBtn");
  const summaryText = document.getElementById("summaryText");
  const mapCanvas = document.getElementById("mapCanvas");
  const modeBadge = document.getElementById("modeBadge");
  const modeTitle = document.getElementById("modeTitle");
  const modeSummary = document.getElementById("modeSummary");
  const traitList = document.getElementById("traitList");
  const promptHint = document.getElementById("promptHint");
  const designHint = document.getElementById("designHint");
  const compareGrid = document.getElementById("compareGrid");
  const planJson = document.getElementById("planJson");
  const copyJsonBtn = document.getElementById("copyJsonBtn");

  function loadState() {
    const fallback = {
      mode: "scattered",
      seed: "settlement-demo",
      gridSize: 160,
      population: 12,
      spread: 45,
      roadStrength: 60,
    };
    try {
      return Object.assign(fallback, JSON.parse(ls(STORAGE_KEY) || "{}"));
    } catch (_) {
      return fallback;
    }
  }

  function readSettings() {
    return {
      mode: modeSelect.value || "scattered",
      seed: seedInput.value.trim() || "settlement-demo",
      gridSize: clamp(gridSizeInput.value, 96, 192, 160),
      population: clamp(populationInput.value, 4, 32, 12),
      spread: clamp(spreadInput.value, 0, 100, 45),
      roadStrength: clamp(roadInput.value, 0, 100, 60),
    };
  }

  function saveState(settings) {
    ls(STORAGE_KEY, JSON.stringify(settings));
  }

  function buildPlan(modeKey, settings) {
    const mode = MODES[modeKey] || MODES.scattered;
    const plan = mode.generator(settings, createRng(settings.seed + ":" + modeKey));
    plan.debug.placedLots = plan.lots.length;
    plan.debug.rejectedCount = plan.debug.rejected.length;
    return plan;
  }

  function fillRectTile(ctx, scale, item, color) {
    ctx.fillStyle = color;
    ctx.fillRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
    ctx.strokeStyle = "rgba(4, 8, 12, 0.75)";
    ctx.lineWidth = Math.max(1, scale * 0.08);
    ctx.strokeRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
  }

  function drawRoadSegment(ctx, scale, seg) {
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.strokeStyle = `rgb(${seg.baseColor[0]},${seg.baseColor[1]},${seg.baseColor[2]})`;
    ctx.lineWidth = Math.max(1.5, seg.width * scale);
    ctx.beginPath();
    ctx.moveTo(seg.ax * scale, seg.ay * scale);
    ctx.lineTo(seg.bx * scale, seg.by * scale);
    ctx.stroke();
    ctx.strokeStyle = `rgb(${seg.highlightColor[0]},${seg.highlightColor[1]},${seg.highlightColor[2]})`;
    ctx.lineWidth = Math.max(1, seg.width * scale * 0.5);
    ctx.beginPath();
    ctx.moveTo(seg.ax * scale, seg.ay * scale);
    ctx.lineTo(seg.bx * scale, seg.by * scale);
    ctx.stroke();
  }

  function drawScene(canvas, plan) {
    const ctx = canvas.getContext("2d");
    const size = plan.grid.cols;
    const scale = canvas.width / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#071018";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(125, 208, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i++) {
      const p = Math.round(i * scale) + 0.5;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(canvas.width, p);
      ctx.stroke();
    }

    for (const zone of plan.zones) {
      fillRectTile(ctx, scale, zone, zone.kind === "camp" ? "rgba(231, 111, 134, 0.25)" : "rgba(115, 199, 255, 0.25)");
    }
    for (const seg of plan.roadSegments) drawRoadSegment(ctx, scale, seg);
    for (const lot of plan.lots) {
      fillRectTile(ctx, scale, lot, lot.kind === "work" ? "#f0b25f" : "#8dda9e");
      ctx.fillStyle = "#fff8d8";
      ctx.fillRect((lot.door.x - 0.8) * scale, (lot.door.y - 0.8) * scale, Math.max(2, 1.6 * scale), Math.max(2, 1.6 * scale));
    }
    for (const anchor of plan.anchors) {
      if (anchor.kind !== "center") continue;
      ctx.fillStyle = anchor.role === "campfire" ? "#e76f86" : "#73c7ff";
      ctx.beginPath();
      ctx.arc(anchor.x * scale, anchor.y * scale, Math.max(3, scale * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderText(settings, plan) {
    const mode = MODES[settings.mode] || MODES.scattered;
    modeBadge.textContent = mode.label;
    modeTitle.textContent = mode.label;
    modeSummary.textContent = mode.summary;
    promptHint.textContent = mode.promptHint;
    designHint.textContent = mode.designHint;
    traitList.innerHTML = "";
    mode.traits.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      traitList.appendChild(li);
    });
    const roadText = settings.roadStrength < 18 ? "无路/弱路径" : settings.roadStrength < 50 ? "低密度道路" : settings.roadStrength < 78 ? "中等道路" : "强路网";
    summaryText.textContent =
      `当前：${mode.label}；${settings.gridSize}x${settings.gridSize} tile；住宅默认 15x10 tile；` +
      `已放置 ${plan.lots.length}/${plan.debug.attemptedLots}；拒绝 ${plan.debug.rejected.length}；${roadText}。`;
  }

  function planForExport(plan) {
    return {
      version: plan.version,
      mode: plan.mode,
      seed: plan.seed,
      grid: plan.grid,
      footprint: plan.footprint,
      zones: plan.zones,
      roads: plan.roads.map((r) => ({ id: r.id, role: r.role, points: r.points, width: r.width })),
      lots: plan.lots.map((lot) => ({
        id: lot.id,
        kind: lot.kind,
        x: lot.x,
        y: lot.y,
        w: lot.w,
        h: lot.h,
        center: lot.center,
        facing: lot.facing,
        door: lot.door,
        roadAccess: lot.roadAccess,
        roadId: lot.roadId,
        tags: lot.tags,
        widthTiles: lot.widthTiles,
        depthTiles: lot.depthTiles,
      })),
      anchors: plan.anchors,
      debug: plan.debug,
    };
  }

  function renderJson(plan) {
    if (!planJson) return;
    planJson.value = JSON.stringify(planForExport(plan), null, 2);
  }

  function buildCompareCard(modeKey, settings) {
    const mode = MODES[modeKey];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "compare-card" + (modeKey === settings.mode ? " is-active" : "");
    const h3 = document.createElement("h3");
    h3.textContent = mode.label;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const p = document.createElement("p");
    p.textContent = mode.summary;
    button.appendChild(h3);
    button.appendChild(canvas);
    button.appendChild(p);
    const nextSettings = Object.assign({}, settings, { mode: modeKey });
    drawScene(canvas, buildPlan(modeKey, nextSettings));
    button.addEventListener("click", () => {
      modeSelect.value = modeKey;
      render();
    });
    return button;
  }

  function renderCompare(settings) {
    compareGrid.innerHTML = "";
    Object.keys(MODES).forEach((modeKey) => {
      compareGrid.appendChild(buildCompareCard(modeKey, settings));
    });
  }

  function render() {
    const settings = readSettings();
    const plan = buildPlan(settings.mode, settings);
    saveState(settings);
    renderText(settings, plan);
    drawScene(mapCanvas, plan);
    renderJson(plan);
    renderCompare(settings);
  }

  function init() {
    Object.entries(MODES).forEach(([key, mode]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = mode.label;
      modeSelect.appendChild(option);
    });
    const saved = loadState();
    const initialGridSize = clamp(saved.gridSize, 96, 192, 160);
    const initialPopulation = clamp(saved.population, 4, 32, 12);
    modeSelect.value = MODES[saved.mode] ? saved.mode : "scattered";
    seedInput.value = saved.seed;
    gridSizeInput.value = String(initialGridSize);
    populationInput.value = String(initialPopulation);
    spreadInput.value = String(saved.spread);
    roadInput.value = String(saved.roadStrength);

    [modeSelect, seedInput, gridSizeInput, populationInput, spreadInput, roadInput].forEach((node) => {
      node.addEventListener("input", render);
      node.addEventListener("change", render);
    });
    regenBtn.addEventListener("click", render);
    randomSeedBtn.addEventListener("click", () => {
      seedInput.value = "settlement-" + Math.random().toString(36).slice(2, 8);
      render();
    });
    copyJsonBtn?.addEventListener("click", async () => {
      if (!planJson) return;
      planJson.select();
      try {
        await navigator.clipboard.writeText(planJson.value);
      } catch (_) {
        document.execCommand("copy");
      }
    });
    render();
  }

  init();
})();
