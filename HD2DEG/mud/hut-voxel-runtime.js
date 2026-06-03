/* global HUT1_PRESET — 需先于本文件加载 mud/hut1-preset.js
 * 预设：① bits 三视图 ② frontDataUrl/sideDataUrl/topDataUrl（需 preloadHut1Preset）
 * 原始贴图（任选其一）：
 * - 将 PNG 放到 mud/hut1-front.png、mud/hut1-side.png、mud/hut1-top.png（透明底，与三视图透视一致）
 * - 或设 window.HUT1_TEXTURE_URLS = { front, side, top }（相对当前页面）
 * - 若预设已是 DataURL 三图，会自动用这三张做贴图，无需再放文件
 */
(function (global) {
  "use strict";

  var _hut1MaskCache = null;
  var _hut1PreloadPromise = null;

  function isLegacyHutPreset(preset) {
    return !!(
      preset &&
      preset.front &&
      preset.front.bits &&
      preset.side &&
      preset.side.bits &&
      preset.top &&
      preset.top.bits
    );
  }

  function hasDataUrlHutPreset(preset) {
    return !!(preset && preset.frontDataUrl && preset.sideDataUrl && preset.topDataUrl);
  }

  function fillMaskCacheFromLegacy() {
    var preset = global.HUT1_PRESET;
    var front = cropMaskToBounds({
      kind: "mask",
      width: preset.front.width,
      height: preset.front.height,
      mask: decodePackedMask(preset.front.bits, preset.front.width, preset.front.height),
    });
    var side = cropMaskToBounds({
      kind: "mask",
      width: preset.side.width,
      height: preset.side.height,
      mask: decodePackedMask(preset.side.bits, preset.side.width, preset.side.height),
    });
    var top = cropMaskToBounds({
      kind: "mask",
      width: preset.top.width,
      height: preset.top.height,
      mask: decodePackedMask(preset.top.bits, preset.top.width, preset.top.height),
    });
    _hut1MaskCache = { front: front, side: side, top: top };
  }

  /**
   * 将 data URL 图像解码为二值 mask（优先透明通道；几乎全不透明时用亮度区分前景）
   */
  function dataUrlToMask(dataUrl) {
    return new Promise(function (resolve, reject) {
      if (!dataUrl || typeof dataUrl !== "string") {
        reject(new Error("无效的 DataURL"));
        return;
      }
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        if (!w || !h) {
          reject(new Error("图片尺寸为 0"));
          return;
        }
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var d = ctx.getImageData(0, 0, w, h).data;
        var mask = new Uint8Array(w * h);
        var i;
        var alphaOpaque = 0;
        for (i = 0; i < w * h; i++) {
          if (d[i * 4 + 3] > 48) alphaOpaque++;
        }
        var useAlpha = alphaOpaque < w * h * 0.92;
        for (i = 0; i < w * h; i++) {
          var a = d[i * 4 + 3];
          if (useAlpha) {
            mask[i] = a > 48 ? 1 : 0;
          } else {
            var r = d[i * 4];
            var g = d[i * 4 + 1];
            var b = d[i * 4 + 2];
            var lum = (r + g + b) / 3;
            mask[i] = lum < 220 ? 1 : 0;
          }
        }
        resolve(cropMaskToBounds({ kind: "mask", width: w, height: h, mask: mask }));
      };
      img.onerror = function () {
        reject(new Error("Hut 预设图片加载失败"));
      };
      img.src = dataUrl;
    });
  }

  function preloadHut1Preset() {
    if (_hut1MaskCache) return Promise.resolve();
    if (_hut1PreloadPromise) return _hut1PreloadPromise;
    var preset = global.HUT1_PRESET;
    if (!preset) return Promise.reject(new Error("HUT1_PRESET 未加载"));
    if (isLegacyHutPreset(preset)) {
      fillMaskCacheFromLegacy();
      return Promise.resolve();
    }
    if (!hasDataUrlHutPreset(preset)) {
      return Promise.reject(
        new Error("HUT1_PRESET 缺少 bits 掩码或 frontDataUrl/sideDataUrl/topDataUrl"),
      );
    }
    _hut1PreloadPromise = Promise.all([
      dataUrlToMask(preset.frontDataUrl),
      dataUrlToMask(preset.sideDataUrl),
      dataUrlToMask(preset.topDataUrl),
    ]).then(function (triple) {
      _hut1MaskCache = { front: triple[0], side: triple[1], top: triple[2] };
    });
    return _hut1PreloadPromise;
  }

  function decodePackedMask(encoded, width, height) {
    const raw = atob(encoded);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const out = new Uint8Array(width * height);
    for (let i = 0; i < out.length; i++) {
      const byte = bytes[i >> 3];
      const bit = 7 - (i & 7);
      out[i] = (byte >> bit) & 1;
    }
    return out;
  }

  function cropMaskToBounds(source) {
    if (!source || source.kind !== "mask") return source;
    let minX = source.width;
    let minY = source.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        if (!source.mask[y * source.width + x]) continue;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < minX || maxY < minY) {
      return { kind: "mask", width: 1, height: 1, mask: new Uint8Array(1) };
    }
    const outW = maxX - minX + 1;
    const outH = maxY - minY + 1;
    const out = new Uint8Array(outW * outH);
    for (let y = 0; y < outH; y++) {
      for (let x = 0; x < outW; x++) {
        out[y * outW + x] = source.mask[(minY + y) * source.width + (minX + x)];
      }
    }
    return { kind: "mask", width: outW, height: outH, mask: out };
  }

  function computeContainPlacement(srcW, srcH, dstW, dstH, align) {
    const scale = Math.min(dstW / srcW, dstH / srcH);
    const drawW = Math.max(1, Math.round(srcW * scale));
    const drawH = Math.max(1, Math.round(srcH * scale));
    let offsetX = Math.floor((dstW - drawW) * 0.5);
    let offsetY = Math.floor((dstH - drawH) * 0.5);
    if (align === "bottom") offsetY = dstH - drawH;
    if (align === "top") offsetY = 0;
    if (align === "left") offsetX = 0;
    if (align === "right") offsetX = dstW - drawW;
    return { drawW, drawH, offsetX, offsetY };
  }

  function computeAxisPlacement(srcSpan, sharedSpan, outSpan, align) {
    const draw = Math.max(1, Math.round((srcSpan / Math.max(1, sharedSpan)) * outSpan));
    let offset = Math.floor((outSpan - draw) * 0.5);
    if (align === "bottom" || align === "right") offset = outSpan - draw;
    if (align === "top" || align === "left") offset = 0;
    return { draw, offset };
  }

  function sharedAxisLengths(frontSource, sideSource, topSource) {
    const x = Math.max(1, frontSource?.width || topSource?.width || 1);
    const yFront = frontSource?.height || 1;
    const ySide = sideSource?.height || yFront;
    // 建筑比角色更容易因为前/侧视图高度不一致而被压扁，
    // 这里改为保留更高的一侧，优先保体量，不再取平均高度。
    const y = Math.max(1, Math.max(yFront, ySide));
    const z = Math.max(1, sideSource?.width || topSource?.height || 1);
    return { x, y, z };
  }

  function projectMaskWithSharedAxes(source, sharedW, sharedH, outW, outH, alignX, alignY) {
    if (!source || source.kind !== "mask") return null;
    const out = new Uint8Array(outW * outH);
    const px = computeAxisPlacement(source.width, sharedW, outW, alignX);
    const py = computeAxisPlacement(source.height, sharedH, outH, alignY);
    for (let y = 0; y < py.draw; y++) {
      const sy = Math.min(source.height - 1, Math.floor((y / py.draw) * source.height));
      for (let x = 0; x < px.draw; x++) {
        const sx = Math.min(source.width - 1, Math.floor((x / px.draw) * source.width));
        const dx = px.offset + x;
        const dy = py.offset + y;
        out[dy * outW + dx] = source.mask[sy * source.width + sx];
      }
    }
    return out;
  }

  function sourceToMask(source, sharedW, sharedH, outW, outH, alignX, alignY) {
    if (!source) return null;
    if (source.kind === "mask") {
      return projectMaskWithSharedAxes(source, sharedW, sharedH, outW, outH, alignX, alignY);
    }
    return null;
  }

  /**
   * 三视图投影后的二值 mask 平滑（默认启用）：
   * - close：形态学闭运算（填小孔、连细缝）
   * - open：形态学开运算（去孤立噪点、细刺）
   * - majority：3×3 多数票（边缘抖动收敛）
   *
   * 可通过 opts.maskSmooth=false 关闭；或用 opts.maskSmoothProfile 分别调强度（0~3）。
   * 形态学在画布边界用「复制边缘」采样，避免贴底/贴边的建筑整行被当成洞外而蚀空。
   */
  var MASK_SMOOTH_NEI8 = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  function clampInt(n, lo, hi) {
    const v = n | 0;
    return v < lo ? lo : v > hi ? hi : v;
  }

  function morphDilate8Nei(dst, src, w, h) {
    const wm = w - 1;
    const hm = h - 1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (src[i]) {
          dst[i] = 1;
          continue;
        }
        let on = 0;
        for (let k = 0; k < MASK_SMOOTH_NEI8.length; k++) {
          const nx = x + MASK_SMOOTH_NEI8[k][0];
          const ny = y + MASK_SMOOTH_NEI8[k][1];
          const cx = nx < 0 ? 0 : nx > wm ? wm : nx;
          const cy = ny < 0 ? 0 : ny > hm ? hm : ny;
          if (src[cy * w + cx]) {
            on = 1;
            break;
          }
        }
        dst[i] = on;
      }
    }
    return dst;
  }

  function morphErode8Nei(dst, src, w, h) {
    const wm = w - 1;
    const hm = h - 1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!src[i]) {
          dst[i] = 0;
          continue;
        }
        let ok = 1;
        for (let k = 0; k < MASK_SMOOTH_NEI8.length; k++) {
          const nx = x + MASK_SMOOTH_NEI8[k][0];
          const ny = y + MASK_SMOOTH_NEI8[k][1];
          const cx = nx < 0 ? 0 : nx > wm ? wm : nx;
          const cy = ny < 0 ? 0 : ny > hm ? hm : ny;
          if (!src[cy * w + cx]) {
            ok = 0;
            break;
          }
        }
        dst[i] = ok;
      }
    }
    return dst;
  }

  function morphCloseOnce(bufA, bufB, w, h) {
    morphDilate8Nei(bufB, bufA, w, h);
    morphErode8Nei(bufA, bufB, w, h);
    return bufA;
  }

  function morphOpenOnce(bufA, bufB, w, h) {
    morphErode8Nei(bufB, bufA, w, h);
    morphDilate8Nei(bufA, bufB, w, h);
    return bufA;
  }

  function majority3x3Once(dst, src, w, h) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        let valid = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            valid++;
            sum += src[yy * w + xx] ? 1 : 0;
          }
        }
        dst[y * w + x] = valid > 0 && sum * 2 > valid ? 1 : 0;
      }
    }
    return dst;
  }

  function resolveMaskSmoothProfile(opts) {
    const raw = opts && opts.maskSmoothProfile != null ? opts.maskSmoothProfile : null;
    if (raw && typeof raw === "object") {
      return {
        close: clampInt(raw.close != null ? raw.close : 1, 0, 3),
        open: clampInt(raw.open != null ? raw.open : 1, 0, 3),
        majority: clampInt(raw.majority != null ? raw.majority : 1, 0, 3),
      };
    }
    if (raw === "off" || raw === "none" || raw === false) {
      return { close: 0, open: 0, majority: 0 };
    }
    if (raw === "aggressive" || raw === "strong") {
      return { close: 2, open: 2, majority: 2 };
    }
    // "default" / true / undefined
    return { close: 1, open: 1, majority: 1 };
  }

  function shouldApplyMaskSmoothing(opts) {
    if (!opts) return true;
    if (opts.maskSmooth === false) return false;
    if (opts.maskSmooth === "off" || opts.maskSmooth === "none") return false;
    return true;
  }

  function smoothBinaryMaskInPlace(mask, w, h, profile) {
    if (!mask || !w || !h) return mask;
    const p = profile || { close: 0, open: 0, majority: 0 };
    if (!p.close && !p.open && !p.majority) return mask;

    let a = mask;
    let b = new Uint8Array(a.length);
    let t;
    let k;

    for (k = 0; k < p.close; k++) {
      t = morphCloseOnce(a, b, w, h);
      b = a;
      a = t;
    }
    for (k = 0; k < p.open; k++) {
      t = morphOpenOnce(a, b, w, h);
      b = a;
      a = t;
    }
    for (k = 0; k < p.majority; k++) {
      majority3x3Once(b, a, w, h);
      t = b;
      b = a;
      a = t;
    }

    if (a !== mask) {
      mask.set(a);
    }
    return mask;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function snapEven(v) {
    const n = Math.max(8, Math.round(v));
    return n % 2 === 0 ? n : n + 1;
  }

  function idx3(x, y, z, W, H, D) {
    return (y * D + z) * W + x;
  }

  function buildVoxels(front, side, top, W, H, D, shellOnly, frontPriority) {
    const solid = new Uint8Array(W * H * D);
    for (let y = 0; y < H; y++) {
      for (let z = 0; z < D; z++) {
        const sy = y * D + z;
        for (let x = 0; x < W; x++) {
          const imageZ = D - 1 - z;
          const frontOn = front[y * W + x];
          const sideOn = side[sy];
          const topOn = top[imageZ * W + x];
          const modelY = H - 1 - y;
          const inUpperBand = modelY >= Math.floor(H * 0.55);
          const ok = (frontOn && sideOn && topOn) || (frontPriority && inUpperBand && frontOn && sideOn);
          if (ok) {
            solid[idx3(x, modelY, z, W, H, D)] = 1;
          }
        }
      }
    }

    const out = [];
    const dirs = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];

    for (let y = 0; y < H; y++) {
      for (let z = 0; z < D; z++) {
        for (let x = 0; x < W; x++) {
          const i = idx3(x, y, z, W, H, D);
          if (!solid[i]) continue;
          if (!shellOnly) {
            out.push({ x, y, z });
            continue;
          }
          let border = false;
          for (const [dx, dy, dz] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            const nz = z + dz;
            if (nx < 0 || nx >= W || ny < 0 || ny >= H || nz < 0 || nz >= D) {
              border = true;
              break;
            }
            if (!solid[idx3(nx, ny, nz, W, H, D)]) {
              border = true;
              break;
            }
          }
          if (border) out.push({ x, y, z });
        }
      }
    }
    return { solid, list: out };
  }

  /**
   * 在 rows×cols 二值掩膜上做经典矩形贪婪合并（清零已消费区域）。
   * @returns {{ r0: number, c0: number, rh: number, cw: number }[]}
   */
  function greedyMerge2D(maskIn, rows, cols) {
    var m = new Uint8Array(maskIn);
    var rects = [];
    var r;
    var c;
    var i;
    var cw;
    var rh;
    var t;
    var rr;
    var cc;
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        i = r * cols + c;
        if (!m[i]) continue;
        cw = 1;
        while (c + cw < cols && m[r * cols + c + cw]) cw++;
        rh = 1;
        while (true) {
          if (r + rh >= rows) break;
          var ok = true;
          for (t = 0; t < cw; t++) {
            if (!m[(r + rh) * cols + c + t]) {
              ok = false;
              break;
            }
          }
          if (!ok) break;
          rh++;
        }
        rects.push({ r0: r, c0: c, rh: rh, cw: cw });
        for (rr = 0; rr < rh; rr++) {
          for (cc = 0; cc < cw; cc++) m[(r + rr) * cols + c + cc] = 0;
        }
      }
    }
    return rects;
  }

  /**
   * 外壳共面合并：将暴露的体素面合并为大四边形，显著减少 Canvas 绘制调用。
   * @param {Uint8Array} solid
   * @returns {{ face: string, c: number[][] }[]}
   */
  function buildGreedyShellQuadsFromSolid(solid, W, H, D) {
    function at(x, y, z) {
      if (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= D) return 0;
      return solid[idx3(x, y, z, W, H, D)] ? 1 : 0;
    }
    var quads = [];
    var mask;
    var rects;
    var x;
    var y;
    var z;
    var rec;
    var y0;
    var z0;
    var hh;
    var ww;
    var x0;
    var zh;
    var xh;
    var yh;
    var yi;
    var xi;
    var zi;

    for (x = 0; x < W; x++) {
      mask = new Uint8Array(H * D);
      for (y = 0; y < H; y++) {
        for (z = 0; z < D; z++) {
          if (at(x, y, z) && !at(x + 1, y, z)) mask[y * D + z] = 1;
        }
      }
      rects = greedyMerge2D(mask, H, D);
      for (rec = 0; rec < rects.length; rec++) {
        y0 = rects[rec].r0;
        z0 = rects[rec].c0;
        hh = rects[rec].rh;
        ww = rects[rec].cw;
        xi = x + 1;
        quads.push({
          face: "px",
          c: [
            [xi, y0, z0],
            [xi, y0, z0 + ww],
            [xi, y0 + hh, z0 + ww],
            [xi, y0 + hh, z0],
          ],
        });
      }
    }

    for (x = 0; x < W; x++) {
      mask = new Uint8Array(H * D);
      for (y = 0; y < H; y++) {
        for (z = 0; z < D; z++) {
          if (at(x, y, z) && !at(x - 1, y, z)) mask[y * D + z] = 1;
        }
      }
      rects = greedyMerge2D(mask, H, D);
      for (rec = 0; rec < rects.length; rec++) {
        y0 = rects[rec].r0;
        z0 = rects[rec].c0;
        hh = rects[rec].rh;
        ww = rects[rec].cw;
        xi = x;
        quads.push({
          face: "nx",
          c: [
            [xi, y0, z0],
            [xi, y0 + hh, z0],
            [xi, y0 + hh, z0 + ww],
            [xi, y0, z0 + ww],
          ],
        });
      }
    }

    for (y = 0; y < H; y++) {
      mask = new Uint8Array(W * D);
      for (x = 0; x < W; x++) {
        for (z = 0; z < D; z++) {
          if (at(x, y, z) && !at(x, y + 1, z)) mask[x * D + z] = 1;
        }
      }
      rects = greedyMerge2D(mask, W, D);
      for (rec = 0; rec < rects.length; rec++) {
        x0 = rects[rec].r0;
        z0 = rects[rec].c0;
        xh = rects[rec].rh;
        zh = rects[rec].cw;
        yi = y + 1;
        quads.push({
          face: "py",
          c: [
            [x0, yi, z0],
            [x0 + xh, yi, z0],
            [x0 + xh, yi, z0 + zh],
            [x0, yi, z0 + zh],
          ],
        });
      }
    }

    for (y = 0; y < H; y++) {
      mask = new Uint8Array(W * D);
      for (x = 0; x < W; x++) {
        for (z = 0; z < D; z++) {
          if (at(x, y, z) && !at(x, y - 1, z)) mask[x * D + z] = 1;
        }
      }
      rects = greedyMerge2D(mask, W, D);
      for (rec = 0; rec < rects.length; rec++) {
        x0 = rects[rec].r0;
        z0 = rects[rec].c0;
        xh = rects[rec].rh;
        zh = rects[rec].cw;
        yi = y;
        quads.push({
          face: "ny",
          c: [
            [x0, yi, z0],
            [x0, yi, z0 + zh],
            [x0 + xh, yi, z0 + zh],
            [x0 + xh, yi, z0],
          ],
        });
      }
    }

    for (z = 0; z < D; z++) {
      mask = new Uint8Array(W * H);
      for (x = 0; x < W; x++) {
        for (y = 0; y < H; y++) {
          if (at(x, y, z) && !at(x, y, z + 1)) mask[x * H + y] = 1;
        }
      }
      rects = greedyMerge2D(mask, W, H);
      for (rec = 0; rec < rects.length; rec++) {
        x0 = rects[rec].r0;
        y0 = rects[rec].c0;
        xh = rects[rec].rh;
        yh = rects[rec].cw;
        zi = z + 1;
        quads.push({
          face: "pz",
          c: [
            [x0, y0, zi],
            [x0 + xh, y0, zi],
            [x0 + xh, y0 + yh, zi],
            [x0, y0 + yh, zi],
          ],
        });
      }
    }

    for (z = 0; z < D; z++) {
      mask = new Uint8Array(W * H);
      for (x = 0; x < W; x++) {
        for (y = 0; y < H; y++) {
          if (at(x, y, z) && !at(x, y, z - 1)) mask[x * H + y] = 1;
        }
      }
      rects = greedyMerge2D(mask, W, H);
      for (rec = 0; rec < rects.length; rec++) {
        x0 = rects[rec].r0;
        y0 = rects[rec].c0;
        xh = rects[rec].rh;
        yh = rects[rec].cw;
        zi = z;
        quads.push({
          face: "nz",
          c: [
            [x0, y0, zi],
            [x0, y0 + yh, zi],
            [x0 + xh, y0 + yh, zi],
            [x0 + xh, y0, zi],
          ],
        });
      }
    }

    return quads;
  }

  /**
   * 懒构建并缓存到 model._greedyQuads
   * @param {{ solid: Uint8Array, W: number, H: number, D: number, _greedyQuads?: object }} model
   */
  function ensureGreedyShellQuads(model) {
    if (!model || !model.solid) return null;
    if (model._greedyQuads) return model._greedyQuads;
    model._greedyQuads = buildGreedyShellQuadsFromSolid(model.solid, model.W, model.H, model.D);
    return model._greedyQuads;
  }

  function hslToRgb(h, s, l) {
    h = (h % 360) / 360;
    if (s < 0) s = 0;
    if (s > 1) s = 1;
    if (l < 0) l = 0;
    if (l > 1) l = 1;
    var r;
    var g;
    var b;
    if (s === 0) {
      r = g = b = l;
    } else {
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   * 由二值掩膜生成带边缘加深的像素风 RGBA 图集（与体素网格同尺寸，一号一像素便于 UV 对齐）
   */
  function buildAtlasFromMask(mask, w, h, kind) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    var img = ctx.createImageData(w, h);
    var pal = {
      front: { hue: 32, sat: 0.52, L: 0.46 },
      side: { hue: 24, sat: 0.48, L: 0.42 },
      top: { hue: 145, sat: 0.4, L: 0.5 },
    };
    var p = pal[kind] || pal.front;
    var xx;
    var yy;
    var i;
    var o;
    var n;
    var edge;
    var dx;
    var dy;
    var r;
    var g;
    var b;
    for (yy = 0; yy < h; yy++) {
      for (xx = 0; xx < w; xx++) {
        i = yy * w + xx;
        o = i * 4;
        if (!mask[i]) {
          img.data[o + 3] = 0;
          continue;
        }
        edge = 0;
        for (dy = -1; dy <= 1 && !edge; dy++) {
          for (dx = -1; dx <= 1 && !edge; dx++) {
            if (dx === 0 && dy === 0) continue;
            var nx = xx + dx;
            var ny = yy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h || !mask[ny * w + nx]) edge = 1;
          }
        }
        n = ((xx * 17) ^ (yy * 31)) & 11;
        var L = p.L + n * 0.012 - (edge ? 0.08 : 0);
        var rgb = hslToRgb(p.hue, p.sat, Math.max(0.15, Math.min(0.75, L)));
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        if (edge) {
          r = Math.floor(r * 0.72);
          g = Math.floor(g * 0.72);
          b = Math.floor(b * 0.78);
        }
        img.data[o] = r;
        img.data[o + 1] = g;
        img.data[o + 2] = b;
        img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas;
  }

  function loadImageUrl(src) {
    return new Promise(function (resolve, reject) {
      if (!src || typeof src !== "string") {
        reject(new Error("无效贴图地址"));
        return;
      }
      var im = new Image();
      im.onload = function () {
        resolve(im);
      };
      im.onerror = function () {
        reject(new Error("贴图加载失败：" + src));
      };
      im.src = src;
    });
  }

  /** 按不透明像素裁边（与剪影导出的 PNG 对齐） */
  function cropImageToOpaqueCanvas(img) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var d = ctx.getImageData(0, 0, w, h).data;
    var minX = w;
    var minY = h;
    var maxX = -1;
    var maxY = -1;
    var x;
    var y;
    var i;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        i = (y * w + x) * 4;
        if (d[i + 3] <= 8) continue;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < minX) return c;
    var ow = maxX - minX + 1;
    var oh = maxY - minY + 1;
    var out = document.createElement("canvas");
    out.width = ow;
    out.height = oh;
    out.getContext("2d").drawImage(c, minX, minY, ow, oh, 0, 0, ow, oh);
    return out;
  }

  /**
   * 与 projectMaskWithSharedAxes 相同的几何：最近邻采样，把源图投到 outW×outH（透明格保留为透明）
   */
  function projectImageWithSharedAxes(img, srcW, srcH, sharedW, sharedH, outW, outH, alignX, alignY) {
    var c = document.createElement("canvas");
    c.width = outW;
    c.height = outH;
    var ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    var px = computeAxisPlacement(srcW, sharedW, outW, alignX);
    var py = computeAxisPlacement(srcH, sharedH, outH, alignY);
    var y;
    var x;
    var sy;
    var sx;
    for (y = 0; y < py.draw; y++) {
      sy = Math.min(srcH - 1, Math.floor((y / py.draw) * srcH));
      for (x = 0; x < px.draw; x++) {
        sx = Math.min(srcW - 1, Math.floor((x / px.draw) * srcW));
        ctx.drawImage(img, sx, sy, 1, 1, px.offset + x, py.offset + y, 1, 1);
      }
    }
    return c;
  }

  /**
   * 解析 hut 三视图贴图地址：优先 window.HUT1_TEXTURE_URLS；其次预设内 DataURL；最后 mud/hut1-*.png
   */
  function resolveHutTextureUrls() {
    var u = global.HUT1_TEXTURE_URLS;
    if (u && u.front && u.side && u.top) return u;
    var preset = global.HUT1_PRESET;
    if (preset && hasDataUrlHutPreset(preset)) {
      return {
        front: preset.frontDataUrl,
        side: preset.sideDataUrl,
        top: preset.topDataUrl,
      };
    }
    return {
      front: "mud/hut1-front.png",
      side: "mud/hut1-side.png",
      top: "mud/hut1-top.png",
    };
  }

  function tryLoadRealHutTextures(model) {
    if (!model || model._skipRealHutTextures || model._realHutTexLoaded || model._realHutTexLoading) return;
    model._realHutTexLoading = true;
    var urls = resolveHutTextureUrls();
    Promise.all([loadImageUrl(urls.front), loadImageUrl(urls.side), loadImageUrl(urls.top)])
      .then(function (imgs) {
        var preset = presetToSources();
        var axes = sharedAxisLengths(preset.front, preset.side, preset.top);
        var W = model.W;
        var H = model.H;
        var D = model.D;
        var cf = cropImageToOpaqueCanvas(imgs[0]);
        var cs = cropImageToOpaqueCanvas(imgs[1]);
        var ct = cropImageToOpaqueCanvas(imgs[2]);
        model._atlasFront = projectImageWithSharedAxes(cf, cf.width, cf.height, axes.x, axes.y, W, H, "center", "bottom");
        model._atlasSide = projectImageWithSharedAxes(cs, cs.width, cs.height, axes.z, axes.y, D, H, "center", "bottom");
        model._atlasTop = projectImageWithSharedAxes(ct, ct.width, ct.height, axes.x, axes.z, W, D, "center", "center");
        model._realHutTexLoaded = true;
        model._realHutTexLoading = false;
      })
      .catch(function () {
        model._realHutTexLoading = false;
      });
  }

  function ensureTexturedAtlases(model) {
    if (!model || !model.frontMask || !model.sideMask || !model.topMask) return;
    if (!model._atlasFront) {
      model._atlasFront = buildAtlasFromMask(model.frontMask, model.W, model.H, "front");
      model._atlasSide = buildAtlasFromMask(model.sideMask, model.D, model.H, "side");
      model._atlasTop = buildAtlasFromMask(model.topMask, model.W, model.D, "top");
    }
    tryLoadRealHutTextures(model);
  }

  function applyTexturedAtlasesFromDataUrls(model, opts) {
    if (!model || !opts || !opts.frontDataUrl || !opts.sideDataUrl || !opts.topDataUrl) {
      return Promise.reject(new Error("缺少三视图贴图 DataURL"));
    }
    return Promise.all([
      loadImageUrl(opts.frontDataUrl),
      loadImageUrl(opts.sideDataUrl),
      loadImageUrl(opts.topDataUrl),
    ]).then(function (imgs) {
      var cf = cropImageToOpaqueCanvas(imgs[0]);
      var cs = cropImageToOpaqueCanvas(imgs[1]);
      var ct = cropImageToOpaqueCanvas(imgs[2]);
      var axes = sharedAxisLengths(
        { width: cf.width, height: cf.height },
        { width: cs.width, height: cs.height },
        { width: ct.width, height: ct.height },
      );
      model._skipRealHutTextures = true;
      model._atlasFront = projectImageWithSharedAxes(cf, cf.width, cf.height, axes.x, axes.y, model.W, model.H, "center", "bottom");
      model._atlasSide = projectImageWithSharedAxes(cs, cs.width, cs.height, axes.z, axes.y, model.D, model.H, "center", "bottom");
      model._atlasTop = projectImageWithSharedAxes(ct, ct.width, ct.height, axes.x, axes.z, model.W, model.D, "center", "center");
      return model;
    });
  }

  /**
   * 模型角点 → 图集像素中心（nearest 采样友好）
   * @param {string} face py|ny|pz|nz|px|nx
   * @param {number} mx,my,mz 体素角点坐标（与 greedy 四顶点一致）
   */
  function modelCornerToAtlasUvPx(face, mx, my, mz, W, H, D) {
    var u;
    var v;
    switch (face) {
      case "py":
      case "ny":
        u = mx + 0.5;
        v = mz + 0.5;
        return { atlas: "top", u: u, v: v };
      case "pz":
        u = mx + 0.5;
        v = H - 1 - my + 0.5;
        return { atlas: "front", u: u, v: v };
      case "nz":
        u = W - 1 - mx + 0.5;
        v = H - 1 - my + 0.5;
        return { atlas: "front", u: u, v: v };
      case "px":
        u = mz + 0.5;
        v = H - 1 - my + 0.5;
        return { atlas: "side", u: u, v: v };
      case "nx":
        // 对侧侧面复用同一张侧视图时保持同向，避免再做一次横向镜像。
        u = mz + 0.5;
        v = H - 1 - my + 0.5;
        return { atlas: "side", u: u, v: v };
      default:
        return { atlas: "front", u: 0.5, v: 0.5 };
    }
  }

  function presetToSources() {
    if (_hut1MaskCache) return _hut1MaskCache;
    var preset = global.HUT1_PRESET;
    if (!preset) throw new Error("HUT1_PRESET 未加载，请先引入 mud/hut1-preset.js");
    if (isLegacyHutPreset(preset)) {
      fillMaskCacheFromLegacy();
      return _hut1MaskCache;
    }
    if (hasDataUrlHutPreset(preset)) {
      throw new Error("HUT1_PRESET 为 PNG 数据格式，请先 await preloadHut1Preset()");
    }
    throw new Error("HUT1_PRESET 格式无法识别（需要 bits 掩码或 DataURL 三视图）");
  }

  /**
   * @param {{ kind: "mask", width: number, height: number, mask: Uint8Array }} front
   * @param {{ kind: "mask", width: number, height: number, mask: Uint8Array }} side
   * @param {{ kind: "mask", width: number, height: number, mask: Uint8Array }} top
   * @param {{
   *   targetLongest?: number,
   *   shellOnly?: boolean,
   *   frontPriority?: boolean,
   *   maskSmooth?: boolean | "off" | "none",
   *   maskSmoothProfile?:
   *     | "default"
   *     | "aggressive"
   *     | "strong"
   *     | "off"
   *     | "none"
   *     | false
   *     | { close?: number, open?: number, majority?: number },
   * }} opts
   */
  function buildVoxelModelFromSources(front, side, top, opts) {
    const targetLongest = opts && opts.targetLongest != null ? opts.targetLongest : 128;
    const shellOnly = opts && opts.shellOnly !== false;
    const frontPriority = opts && opts.frontPriority !== false;

    const axes = sharedAxisLengths(front, side, top);
    const longest = Math.max(axes.x, axes.y, axes.z);
    const scale = targetLongest / Math.max(1, longest);
    const W = clamp(snapEven(axes.x * scale), 8, 192);
    const H = clamp(snapEven(axes.y * scale), 8, 192);
    const D = clamp(snapEven(axes.z * scale), 8, 192);

    const frontMask = sourceToMask(front, axes.x, axes.y, W, H, "center", "bottom");
    const sideMask = sourceToMask(side, axes.z, axes.y, D, H, "center", "bottom");
    const topMask = sourceToMask(top, axes.x, axes.z, W, D, "center", "center");

    if (shouldApplyMaskSmoothing(opts)) {
      const smoothProfile = resolveMaskSmoothProfile(opts);
      smoothBinaryMaskInPlace(frontMask, W, H, smoothProfile);
      smoothBinaryMaskInPlace(sideMask, D, H, smoothProfile);
      smoothBinaryMaskInPlace(topMask, W, D, smoothProfile);
    }

    const { solid, list } = buildVoxels(frontMask, sideMask, topMask, W, H, D, shellOnly, frontPriority);
    return { W, H, D, solid, list, frontMask, sideMask, topMask };
  }

  /**
   * 从三张 DataURL 直接构建建筑体素模型，适合运行时接入 AI 生成结果。
   * @param {{
   *   frontDataUrl: string,
   *   sideDataUrl: string,
   *   topDataUrl: string,
   *   targetLongest?: number,
   *   shellOnly?: boolean,
   *   frontPriority?: boolean,
   *   maskSmooth?: boolean | "off" | "none",
   *   maskSmoothProfile?:
   *     | "default"
   *     | "aggressive"
   *     | "strong"
   *     | "off"
   *     | "none"
   *     | false
   *     | { close?: number, open?: number, majority?: number },
   * }} opts
   * @returns {Promise<{ W:number, H:number, D:number, solid:Uint8Array, list:Array, frontMask:Uint8Array, sideMask:Uint8Array, topMask:Uint8Array }>}
   */
  function buildVoxelModelFromDataUrls(opts) {
    if (!opts || !opts.frontDataUrl || !opts.sideDataUrl || !opts.topDataUrl) {
      return Promise.reject(new Error("构建体素模型需要 frontDataUrl / sideDataUrl / topDataUrl"));
    }
    return Promise.all([
      dataUrlToMask(opts.frontDataUrl),
      dataUrlToMask(opts.sideDataUrl),
      dataUrlToMask(opts.topDataUrl),
    ]).then(function (triple) {
      return buildVoxelModelFromSources(triple[0], triple[1], triple[2], opts);
    });
  }

  /**
   * @param {{ targetLongest?: number, shellOnly?: boolean, frontPriority?: boolean }} opts
   */
  function buildHut1VoxelModel(opts) {
    const { front, side, top } = presetToSources();
    const merged =
      opts && opts.maskSmooth == null ? Object.assign({ maskSmooth: false }, opts) : opts;
    return buildVoxelModelFromSources(front, side, top, merged);
  }

  global.buildHut1VoxelModel = buildHut1VoxelModel;
  global.buildVoxelModelFromSources = buildVoxelModelFromSources;
  global.buildVoxelModelFromDataUrls = buildVoxelModelFromDataUrls;
  global.applyTexturedAtlasesFromDataUrls = applyTexturedAtlasesFromDataUrls;
  global.preloadHut1Preset = preloadHut1Preset;
  global.ensureGreedyShellQuads = ensureGreedyShellQuads;
  global.buildGreedyShellQuadsFromSolid = buildGreedyShellQuadsFromSolid;
  global.ensureTexturedAtlases = ensureTexturedAtlases;
  global.modelCornerToAtlasUvPx = modelCornerToAtlasUvPx;
})(typeof window !== "undefined" ? window : globalThis);
