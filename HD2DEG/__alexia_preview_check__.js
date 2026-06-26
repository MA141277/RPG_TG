
    const FRAME_W = 44;
    const FRAME_H = 44;
    const SCALE = 4;
    const SHEET_PATH = "./Alexia.png";
    const ATTACK_SHEET_PATH = "./attack_s.png";
    const ATTACK_FRAME_RECTS = [
      { sx: 26, sy: 100, sw: 194, sh: 331 },
      { sx: 263, sy: 113, sw: 193, sh: 308 },
      { sx: 503, sy: 121, sw: 190, sh: 331 },
      { sx: 43, sy: 579, sw: 196, sh: 341 },
      { sx: 239, sy: 563, sw: 235, sh: 341 },
      { sx: 498, sy: 562, sw: 201, sh: 347 },
    ];

    const sections = [
      {
        id: "base",
        mount: "section-base",
        items: [
          { key: "idle-south", title: "Idle / South", desc: "Front idle set from the main Alexia sheet.", frames: [[9, 0], [9, 1], [9, 2], [9, 3]], source: "r09 c00-c03" },
          { key: "idle-north", title: "Idle / North", desc: "Back-facing idle frames stitched from nearby cells.", frames: [[9, 4], [10, 7], [10, 8], [10, 9]], source: "r09 c04 + r10 c07-c09" },
          { key: "idle-east", title: "Idle / East", desc: "Right-facing idle frames.", frames: [[9, 5], [9, 6], [9, 7], [9, 8], [9, 9]], source: "r09 c05-c09" },
          { key: "idle-west", title: "Idle / West", desc: "Mirrored from the right-facing idle set.", frames: [[9, 5], [9, 6], [9, 7], [9, 8], [9, 9]], source: "mirror of r09 c05-c09", mirror: true, inferred: true },
          { key: "walk-south", title: "Walk / South", desc: "Front walk cycle.", frames: [[10, 0], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6]], source: "r10 c00-c06" },
          { key: "walk-north", title: "Walk / North", desc: "Back walk cycle assembled across two rows.", frames: [[10, 7], [10, 8], [10, 9], [11, 0], [11, 1], [11, 2]], source: "r10 c07-c09 + r11 c00-c02" },
          { key: "walk-east", title: "Walk / East", desc: "Right-facing walk cycle.", frames: [[11, 3], [11, 4], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9]], source: "r11 c03-c09" },
          { key: "walk-west", title: "Walk / West", desc: "Mirrored from the right-facing walk cycle.", frames: [[11, 3], [11, 4], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9]], source: "mirror of r11 c03-c09", mirror: true, inferred: true }
        ]
      },
      {
        id: "lantern",
        mount: "section-lantern",
        items: [
          { key: "lantern-idle-south", title: "Lantern Idle / South", desc: "Lantern-holding idle pose, front-facing.", frames: [[16, 0], [16, 1], [16, 2]], source: "r16 c00-c02" },
          { key: "lantern-idle-north", title: "Lantern Idle / North", desc: "Lantern idle, back-facing.", frames: [[16, 3], [17, 6], [17, 7], [17, 8], [17, 9]], source: "r16 c03 + r17 c06-c09" },
          { key: "lantern-idle-east", title: "Lantern Idle / East", desc: "Lantern idle, right-facing.", frames: [[16, 4], [16, 5], [16, 6], [16, 7], [16, 8], [16, 9]], source: "r16 c04-c09" },
          { key: "lantern-idle-west", title: "Lantern Idle / West", desc: "Mirrored from the lantern right-facing set.", frames: [[16, 4], [16, 5], [16, 6], [16, 7], [16, 8], [16, 9]], source: "mirror of r16 c04-c09", mirror: true, inferred: true },
          { key: "lantern-walk-south", title: "Lantern Walk / South", desc: "Front lantern walk cycle.", frames: [[17, 0], [17, 1], [17, 2], [17, 3], [17, 4], [17, 5]], source: "r17 c00-c05" },
          { key: "lantern-walk-north", title: "Lantern Walk / North", desc: "Back lantern walk cycle assembled across rows.", frames: [[18, 0], [18, 1], [19, 4], [19, 5], [19, 6], [19, 7], [19, 8], [19, 9]], source: "r18 c00-c01 + r19 c04-c09" },
          { key: "lantern-walk-east", title: "Lantern Walk / East", desc: "Right-facing lantern walk cycle.", frames: [[18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9]], source: "r18 c02-c09" },
          { key: "lantern-walk-west", title: "Lantern Walk / West", desc: "Mirrored from the lantern right-facing walk set.", frames: [[18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9]], source: "mirror of r18 c02-c09", mirror: true, inferred: true }
        ]
      },
      {
        id: "special",
        mount: "section-special",
        items: [
          { key: "kneel-collapse", title: "Kneel / Collapse", desc: "A short kneel-to-fall motion.", frames: [[0, 3], [0, 4], [0, 5], [0, 6], [0, 7]], source: "r00 c03-c07" },
          { key: "combat-ready", title: "Combat Ready", desc: "Preparatory combat stance.", frames: [[0, 8], [0, 9], [1, 0], [1, 1]], source: "r00 c08-c09 + r01 c00-c01" },
          { key: "gesture-cast", title: "Gesture / Cast", desc: "Hand gesture or casting-like motion.", frames: [[1, 2], [1, 3], [1, 4], [1, 5], [1, 7], [13, 6], [13, 7], [13, 8]], source: "r01 c02-c05,c07 + r13 c06-c08" },
          { key: "book-swing", title: "Heavy Book Motion", desc: "Book lift or swing sequence.", frames: [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8], [3, 0], [3, 2], [3, 4]], source: "r02 even cols + r03 c00,c02,c04" },
          { key: "staff-swing", title: "Staff Motion", desc: "Rod or staff swing sequence.", frames: [[4, 0], [4, 2], [4, 4], [4, 6], [4, 8], [5, 0], [5, 2], [5, 4]], source: "r04 even cols + r05 c00,c02,c04" },
          { key: "attack-south", title: "Attack / South", desc: "Imported 6-frame attack animation from attack_s.png.", frames: [0, 1, 2, 3, 4, 5], source: "attack_s.png | 6 frames", sheetKey: "attack" }
        ]
      }
    ];

    const allAnimations = sections.flatMap((section) => {
      section.items.forEach((item) => {
        item.section = section.id;
      });
      return section.items;
    });

    const stageCanvas = document.getElementById("stageCanvas");
    const stageCtx = stageCanvas.getContext("2d");
    stageCtx.imageSmoothingEnabled = false;

    const stageTitle = document.getElementById("stageTitle");
    const stageMinor = document.getElementById("stageMinor");
    const stageDesc = document.getElementById("stageDesc");
    const speedInput = document.getElementById("speedInput");
    const toggleBtn = document.getElementById("toggleBtn");
    const resetBtn = document.getElementById("resetBtn");

    const sheets = {
      base: new Image(),
      attack: new Image(),
    };

    const derivedFrames = {
      attack: [],
    };

    let selectedKey = "idle-south";
    let frameDuration = Number(speedInput.value);
    let playing = true;
    let lastTime = 0;
    let stageFrame = 0;
    let stageAccum = 0;
    let started = false;

    function findAnimation(key) {
      return allAnimations.find((item) => item.key === key);
    }

    function loadImageElement(image, src) {
      return new Promise((resolve, reject) => {
        if (image.complete && image.naturalWidth > 0 && image.src.includes(src.replace("./", ""))) {
          resolve(image);
          return;
        }
        image.addEventListener("load", () => resolve(image), { once: true });
        image.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
        image.src = src;
      });
    }

    function buildAttackFrames(image) {
      return ATTACK_FRAME_RECTS.map((rect) => ({
        image,
        sx: rect.sx,
        sy: rect.sy,
        sw: rect.sw,
        sh: rect.sh,
      }));
    }

    function resolveFrame(animation, frameIndex) {
      if (animation.sheetKey === "attack") {
        return derivedFrames.attack[frameIndex % animation.frames.length] || null;
      }
      const [row, col] = animation.frames[frameIndex % animation.frames.length];
      return {
        image: sheets.base,
        sx: col * FRAME_W,
        sy: row * FRAME_H,
        sw: FRAME_W,
        sh: FRAME_H,
      };
    }

    function drawFrame(ctx, animation, frameIndex) {
      const frame = resolveFrame(animation, frameIndex);
      if (!frame) return;

      const fit = Math.min(ctx.canvas.width / frame.sw, ctx.canvas.height / frame.sh);
      const drawScale = fit * (animation.sheetKey === "attack" ? 0.86 : 1);
      const dw = frame.sw * drawScale;
      const dh = frame.sh * drawScale;
      const dx = (ctx.canvas.width - dw) / 2;
      const dy = (ctx.canvas.height - dh) / 2;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();

      if (animation.mirror) {
        ctx.translate(ctx.canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, dx, dy, dw, dh);
      ctx.restore();
    }

    function updateStageMeta(animation) {
      stageTitle.textContent = animation.title;
      stageMinor.textContent = `${animation.section} | ${animation.source}`;
      stageDesc.textContent = animation.desc + (animation.inferred ? " This direction is mirrored." : "");
    }

    function renderSections() {
      sections.forEach((section) => {
        const root = document.getElementById(section.mount);
        const fragment = document.createDocumentFragment();

        section.items.forEach((item) => {
          const card = document.createElement("article");
          card.className = "panel card";
          card.dataset.key = item.key;

          const canvas = document.createElement("canvas");
          canvas.className = "checker";
          canvas.width = FRAME_W * SCALE;
          canvas.height = FRAME_H * SCALE;

          const title = document.createElement("h4");
          title.textContent = item.title;

          const desc = document.createElement("p");
          desc.textContent = item.source;

          card.append(canvas, title, desc);

          if (item.inferred) {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = "Mirrored";
            card.append(badge);
          }

          fragment.append(card);

          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = false;
          item.card = card;
          item.ctx = ctx;
          item.frame = 0;
          item.accum = 0;

          card.addEventListener("click", () => {
            selectedKey = item.key;
            stageFrame = 0;
            stageAccum = 0;
            syncActive();
            updateStageMeta(item);
            drawFrame(stageCtx, item, 0);
          });
        });

        root.append(fragment);
      });
    }

    function syncActive() {
      allAnimations.forEach((item) => {
        item.card.classList.toggle("active", item.key === selectedKey);
      });
    }

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (playing) {
        stageAccum += delta;
        while (stageAccum >= frameDuration) {
          stageAccum -= frameDuration;
          const current = findAnimation(selectedKey);
          stageFrame = (stageFrame + 1) % current.frames.length;
        }

        allAnimations.forEach((item) => {
          item.accum += delta;
          while (item.accum >= frameDuration) {
            item.accum -= frameDuration;
            item.frame = (item.frame + 1) % item.frames.length;
          }
        });
      }

      const selected = findAnimation(selectedKey);
      drawFrame(stageCtx, selected, stageFrame);
      allAnimations.forEach((item) => drawFrame(item.ctx, item, item.frame));
      requestAnimationFrame(animate);
    }

    speedInput.addEventListener("input", () => {
      frameDuration = Number(speedInput.value);
    });

    toggleBtn.addEventListener("click", () => {
      playing = !playing;
      toggleBtn.textContent = playing ? "Pause" : "Resume";
    });

    resetBtn.addEventListener("click", () => {
      const current = findAnimation(selectedKey);
      stageFrame = 0;
      stageAccum = 0;
      current.frame = 0;
      current.accum = 0;
      drawFrame(stageCtx, current, 0);
    });

    async function startPreview() {
      if (started) return;
      await Promise.all([
        loadImageElement(sheets.base, SHEET_PATH),
        loadImageElement(sheets.attack, ATTACK_SHEET_PATH),
      ]);
      derivedFrames.attack = buildAttackFrames(sheets.attack);
      started = true;
      drawFrame(stageCtx, findAnimation(selectedKey), 0);
      requestAnimationFrame(animate);
    }

    renderSections();
    syncActive();
    updateStageMeta(findAnimation(selectedKey));

    startPreview().catch((error) => {
      stageTitle.textContent = "Load Failed";
      stageMinor.textContent = "asset loader";
      stageDesc.textContent = String(error && error.message ? error.message : error);
    });
  
