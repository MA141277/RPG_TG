    const elBaseText = document.getElementById("baseUrlText");
    const pageSearchParams = new URLSearchParams(location.search);
    const isEmbeddedEngine = pageSearchParams.get("embed") === "1";
    const requestedSceneIdRaw = pageSearchParams.get("scene") || "";
    const elModel = document.getElementById("model");
    const elPrompt = document.getElementById("prompt");
    const elBtn = document.getElementById("btnGen");
    const elBtnTestMaid = document.getElementById("btnTestMaid");
    const elBtnTestHu = document.getElementById("btnTestHu");
    const elFpsHud = document.createElement("div");
    elFpsHud.id = "fpsHud";
    elFpsHud.textContent = "FPS: --";
    elFpsHud.style.position = "fixed";
    elFpsHud.style.top = "10px";
    elFpsHud.style.right = "12px";
    elFpsHud.style.zIndex = "9999";
    elFpsHud.style.padding = "4px 8px";
    elFpsHud.style.border = "1px solid rgba(255,255,255,0.3)";
    elFpsHud.style.background = "rgba(8,12,16,0.72)";
    elFpsHud.style.color = "#e6edf3";
    elFpsHud.style.fontFamily = "VT323, monospace";
    elFpsHud.style.fontSize = "18px";
    elFpsHud.style.lineHeight = "1";
    elFpsHud.style.pointerEvents = "none";
    document.body.appendChild(elFpsHud);
    const elStatus = document.getElementById("status");
    const elPanel = document.getElementById("panelOut");
    const elOut = document.getElementById("outBody");
    const elBuildingModel = document.getElementById("buildingModel");
    const elBuildingPrompt = document.getElementById("buildingPrompt");
    const elBtnGenBuilding = document.getElementById("btnGenBuilding");
    const elBuildingStatus = document.getElementById("buildingStatus");
    const elBuildingOut = document.getElementById("buildingOut");
    const elAnimatorCanvas = document.getElementById("animatorCanvas");
    const elAnimatorFxCanvas = document.getElementById("animatorFxCanvas");
    const elAnimatorFxStage = document.getElementById("animatorFxStage");
    const elAnimatorFxStageCard = document.getElementById("animatorFxStageCard");
    const elFxFullscreen = document.getElementById("fxFullscreen");
    const elFxBigCanvas = document.getElementById("fxBigCanvas");
    let elFxHotbar = document.getElementById("fxHotbar");
    const fxBtnCodex = document.getElementById("fxBtnCodex");
    const fxBtnCodexClear = document.getElementById("fxBtnCodexClear");
    const elFxCodexPanel = document.getElementById("fxCodexPanel");
    const elFxCodexBody = document.getElementById("fxCodexBody");
    const elFxInteractionMenu = document.getElementById("fxInteractionMenu");
    const elFxInteractionList = document.getElementById("fxInteractionList");
    const elFxInteractionModal = document.getElementById("fxInteractionModal");
    const elFxInteractionModalCard = document.getElementById("fxInteractionModalCard");
    const elAnimatorHotbar = document.getElementById("animatorHotbar");
    const fxBigCtx = elFxBigCanvas.getContext("2d");
    const elAnimatorInfo = document.getElementById("animatorInfo");
    const elAnimatorSheetMeta = document.getElementById("animatorSheetMeta");
    const elAnimatorDirection = document.getElementById("animatorDirection");
    const elAnimatorStageWrap = document.querySelector(".animator-stage-wrap");
    const elCtrlHorizon = document.getElementById("ctrlHorizon");
    const elCtrlCameraHeight = document.getElementById("ctrlCameraHeight");
    const elCtrlForwardScale = document.getElementById("ctrlForwardScale");
    const elCtrlSpanBase = document.getElementById("ctrlSpanBase");
    const elCtrlSpanScale = document.getElementById("ctrlSpanScale");
    const elValHorizon = document.getElementById("valHorizon");
    const elValCameraHeight = document.getElementById("valCameraHeight");
    const elValForwardScale = document.getElementById("valForwardScale");
    const elValSpanBase = document.getElementById("valSpanBase");
    const elValSpanScale = document.getElementById("valSpanScale");

    // FX 横屏游玩参数面板
    const fxCtrlHorizon = document.getElementById("fxCtrlHorizon");
    const fxCtrlCamH = document.getElementById("fxCtrlCamH");
    const fxCtrlForward = document.getElementById("fxCtrlForward");
    const fxCtrlCamDist = document.getElementById("fxCtrlCamDist");
    const fxCtrlStrength = document.getElementById("fxCtrlStrength");
    const fxCtrlWorldScale = document.getElementById("fxCtrlWorldScale");
    const fxCtrlCharPx = document.getElementById("fxCtrlCharPx");
    const fxCtrlRadius = document.getElementById("fxCtrlRadius");
    const fxCtrlSinkTiles = document.getElementById("fxCtrlSinkTiles");
    const fxValHorizon = document.getElementById("fxValHorizon");
    const fxValCamH = document.getElementById("fxValCamH");
    const fxValForward = document.getElementById("fxValForward");
    const fxValCamDist = document.getElementById("fxValCamDist");
    const fxValStrength = document.getElementById("fxValStrength");
    const fxValWorldScale = document.getElementById("fxValWorldScale");
    const fxValCharPx = document.getElementById("fxValCharPx");
    const fxValRadius = document.getElementById("fxValRadius");
    const fxValSinkTiles = document.getElementById("fxValSinkTiles");
    const fxCtrlSkew = document.getElementById("fxCtrlSkew");
    const fxValSkew = document.getElementById("fxValSkew");
    const fxCtrlViewY = document.getElementById("fxCtrlViewY");
    const fxValViewY = document.getElementById("fxValViewY");
    const fxToggleTiltShift = document.getElementById("fxToggleTiltShift");
    const fxCtrlFocusCenter = document.getElementById("fxCtrlFocusCenter");
    const fxValFocusCenter = document.getElementById("fxValFocusCenter");
    const fxCtrlFocusHalf = document.getElementById("fxCtrlFocusHalf");
    const fxValFocusHalf = document.getElementById("fxValFocusHalf");
    const fxCtrlFade = document.getElementById("fxCtrlFade");
    const fxValFade = document.getElementById("fxValFade");
    const fxCtrlTiltShiftBlur = document.getElementById("fxCtrlTiltShiftBlur");
    const fxValTiltShiftBlur = document.getElementById("fxValTiltShiftBlur");
    const fxCtrlTiltShiftRenderScale = document.getElementById("fxCtrlTiltShiftRenderScale");
    const fxValTiltShiftRenderScale = document.getElementById("fxValTiltShiftRenderScale");
    const fxCtrlTiltShiftGlow = document.getElementById("fxCtrlTiltShiftGlow");
    const fxValTiltShiftGlow = document.getElementById("fxValTiltShiftGlow");
    const fxCtrlSunX = document.getElementById("fxCtrlSunX");
    const fxValSunX = document.getElementById("fxValSunX");
    const fxCtrlSunY = document.getElementById("fxCtrlSunY");
    const fxValSunY = document.getElementById("fxValSunY");
    const fxCtrlShadowStrength = document.getElementById("fxCtrlShadowStrength");
    const fxValShadowStrength = document.getElementById("fxValShadowStrength");
    const fxCtrlShadowLength = document.getElementById("fxCtrlShadowLength");
    const fxValShadowLength = document.getElementById("fxValShadowLength");
    const fxCtrlLightContrast = document.getElementById("fxCtrlLightContrast");
    const fxValLightContrast = document.getElementById("fxValLightContrast");
    const fxCtrlWarmth = document.getElementById("fxCtrlWarmth");
    const fxValWarmth = document.getElementById("fxValWarmth");
    const fxCtrlReflection = document.getElementById("fxCtrlReflection");
    const fxValReflection = document.getElementById("fxValReflection");
    const fxCtrlGroundDepthDark = document.getElementById("fxCtrlGroundDepthDark");
    const fxValGroundDepthDark = document.getElementById("fxValGroundDepthDark");
    const fxToggleDayNight = document.getElementById("fxToggleDayNight");
    const fxToggleDayNightPause = document.getElementById("fxToggleDayNightPause");
    const fxCtrlDayDuration = document.getElementById("fxCtrlDayDuration");
    const fxValDayDuration = document.getElementById("fxValDayDuration");
    const fxCtrlNightDuration = document.getElementById("fxCtrlNightDuration");
    const fxValNightDuration = document.getElementById("fxValNightDuration");
    const fxCtrlDayWarmth = document.getElementById("fxCtrlDayWarmth");
    const fxValDayWarmth = document.getElementById("fxValDayWarmth");
    const fxCtrlNightWarmth = document.getElementById("fxCtrlNightWarmth");
    const fxValNightWarmth = document.getElementById("fxValNightWarmth");
    const fxCtrlDayShadowLength = document.getElementById("fxCtrlDayShadowLength");
    const fxValDayShadowLength = document.getElementById("fxValDayShadowLength");
    const fxCtrlNightShadowLength = document.getElementById("fxCtrlNightShadowLength");
    const fxValNightShadowLength = document.getElementById("fxValNightShadowLength");
    const fxCtrlShadowRotateRange = document.getElementById("fxCtrlShadowRotateRange");
    const fxValShadowRotateRange = document.getElementById("fxValShadowRotateRange");
    const fxCtrlDayNightTimeScale = document.getElementById("fxCtrlDayNightTimeScale");
    const fxValDayNightTimeScale = document.getElementById("fxValDayNightTimeScale");
    const fxCtrlDayNightCurrentTime = document.getElementById("fxCtrlDayNightCurrentTime");
    const fxValDayNightCurrentTime = document.getElementById("fxValDayNightCurrentTime");
    const fxDayNightStatus = document.getElementById("fxDayNightStatus");
    const fxToggleCollisionDebug = document.getElementById("fxToggleCollisionDebug");
    const fxBtnSave = document.getElementById("fxBtnSave");
    const fxBtnReset = document.getElementById("fxBtnReset");
    const fxBtnToggleHud = document.getElementById("fxBtnToggleHud");
    const fxBtnMinimizeHud = document.getElementById("fxBtnMinimizeHud");
    const fxBtnHudFab = document.getElementById("fxBtnHudFab");
    const fxBtnViewUp = document.getElementById("fxBtnViewUp");
    const fxBtnViewDown = document.getElementById("fxBtnViewDown");
    const fxNumHorizon = document.getElementById("fxNumHorizon");
    const fxNumCamH = document.getElementById("fxNumCamH");
    const fxNumForward = document.getElementById("fxNumForward");
    const fxNumCamDist = document.getElementById("fxNumCamDist");
    const fxNumStrength = document.getElementById("fxNumStrength");
    const fxNumWorldScale = document.getElementById("fxNumWorldScale");
    const fxNumCharPx = document.getElementById("fxNumCharPx");
    const fxNumRadius = document.getElementById("fxNumRadius");
    const fxNumSinkTiles = document.getElementById("fxNumSinkTiles");
    const fxNumSkew = document.getElementById("fxNumSkew");
    const fxNumViewY = document.getElementById("fxNumViewY");
    const fxNumFocusCenter = document.getElementById("fxNumFocusCenter");
    const fxNumFocusHalf = document.getElementById("fxNumFocusHalf");
    const fxNumFade = document.getElementById("fxNumFade");
    const fxNumTiltShiftBlur = document.getElementById("fxNumTiltShiftBlur");
    const fxNumTiltShiftRenderScale = document.getElementById("fxNumTiltShiftRenderScale");
    const fxNumTiltShiftGlow = document.getElementById("fxNumTiltShiftGlow");
    const fxNumSunX = document.getElementById("fxNumSunX");
    const fxNumSunY = document.getElementById("fxNumSunY");
    const fxNumShadowStrength = document.getElementById("fxNumShadowStrength");
    const fxNumShadowLength = document.getElementById("fxNumShadowLength");
    const fxNumLightContrast = document.getElementById("fxNumLightContrast");
    const fxNumWarmth = document.getElementById("fxNumWarmth");
    const fxNumReflection = document.getElementById("fxNumReflection");
    const fxNumGroundDepthDark = document.getElementById("fxNumGroundDepthDark");
    const fxNumDayDuration = document.getElementById("fxNumDayDuration");
    const fxNumNightDuration = document.getElementById("fxNumNightDuration");
    const fxNumDayWarmth = document.getElementById("fxNumDayWarmth");
    const fxNumNightWarmth = document.getElementById("fxNumNightWarmth");
    const fxNumDayShadowLength = document.getElementById("fxNumDayShadowLength");
    const fxNumNightShadowLength = document.getElementById("fxNumNightShadowLength");
    const fxNumShadowRotateRange = document.getElementById("fxNumShadowRotateRange");
    const fxNumDayNightTimeScale = document.getElementById("fxNumDayNightTimeScale");
    const fxNumDayNightCurrentTime = document.getElementById("fxNumDayNightCurrentTime");
    const fxBtnPlaceHut = document.getElementById("fxBtnPlaceHut");
    const fxBtnPlaceGenerated = document.getElementById("fxBtnPlaceGenerated");
    const fxBtnEditBuilding = document.getElementById("fxBtnEditBuilding");
    const fxBtnRenderMode = document.getElementById("fxBtnRenderMode");
    const fxBtnPlaceConfirm = document.getElementById("fxBtnPlaceConfirm");
    const fxBtnPlaceCancel = document.getElementById("fxBtnPlaceCancel");
    const fxBtnEditDelete = document.getElementById("fxBtnEditDelete");
    const fxBtnEditDone = document.getElementById("fxBtnEditDone");
    const fxPlaceHint = document.getElementById("fxPlaceHint");
    const fxSceneId = document.getElementById("fxSceneId");
    const fxSceneList = document.getElementById("fxSceneList");
    const fxBtnSceneNew = document.getElementById("fxBtnSceneNew");
    const fxBtnSceneSave = document.getElementById("fxBtnSceneSave");
    const fxBtnSceneLoad = document.getElementById("fxBtnSceneLoad");
    const fxBtnRoadRebuild = document.getElementById("fxBtnRoadRebuild");
    const fxResourceSeed = document.getElementById("fxResourceSeed");
    const fxBtnScatterResources = document.getElementById("fxBtnScatterResources");
    const fxSceneStatus = document.getElementById("fxSceneStatus");
    const fxBtnNpcBootstrap = document.getElementById("fxBtnNpcBootstrap");
    const fxBtnNpcResetState = document.getElementById("fxBtnNpcResetState");
    const fxBtnNpcResetMemory = document.getElementById("fxBtnNpcResetMemory");
    const fxBtnNpcResetAll = document.getElementById("fxBtnNpcResetAll");
    const fxBtnNpcDebugQin = document.getElementById("fxBtnNpcDebugQin");
    const fxNpcStatus = document.getElementById("fxNpcStatus");
    const fxWorldBuildingList = document.getElementById("fxWorldBuildingList");
    const fxWorldBuildingModel = document.getElementById("fxWorldBuildingModel");
    const fxBtnGenerateWorld = document.getElementById("fxBtnGenerateWorld");
    const fxWorldStatus = document.getElementById("fxWorldStatus");
    const fxWorldPlan = document.getElementById("fxWorldPlan");
    const fxModel = document.getElementById("fxModel");
    const fxPrompt = document.getElementById("fxPrompt");
    const fxBtnGenCharacter = document.getElementById("fxBtnGenCharacter");
    const fxCharacterStatus = document.getElementById("fxCharacterStatus");
    const fxCharacterPreview = document.getElementById("fxCharacterPreview");
    const fxBtnSaveCharacter = document.getElementById("fxBtnSaveCharacter");
    const fxBtnRefreshCharacters = document.getElementById("fxBtnRefreshCharacters");
    const fxCharacterLibraryStatus = document.getElementById("fxCharacterLibraryStatus");
    const fxCharacterLibrary = document.getElementById("fxCharacterLibrary");
    const fxBuildingPrompt = document.getElementById("fxBuildingPrompt");
    const fxBuildingModel = document.getElementById("fxBuildingModel");
    const fxBtnGenBuildingHud = document.getElementById("fxBtnGenBuildingHud");
    const fxBuildingStatus = document.getElementById("fxBuildingStatus");
    const fxBuildingPreview = document.getElementById("fxBuildingPreview");
    const fxBtnSaveBuilding = document.getElementById("fxBtnSaveBuilding");
    const fxBtnRefreshBuildings = document.getElementById("fxBtnRefreshBuildings");
    const fxBuildingLibraryStatus = document.getElementById("fxBuildingLibraryStatus");
    const fxBuildingLibrary = document.getElementById("fxBuildingLibrary");

    elBaseText.textContent = CONFIG.baseUrl;
    elModel.value = ls("pixelwf_model") || CONFIG.defaultModel;
    elModel.addEventListener("change", () => ls("pixelwf_model", elModel.value));
    if (fxModel) {
      fxModel.innerHTML = elModel.innerHTML;
      fxModel.value = elModel.value;
      fxModel.addEventListener("change", () => {
        elModel.value = fxModel.value;
        ls("pixelwf_model", fxModel.value);
      });
      elModel.addEventListener("change", () => {
        if (fxModel.value !== elModel.value) fxModel.value = elModel.value;
      });
    }
    if (fxPrompt && elPrompt) {
      fxPrompt.value = elPrompt.value;
      fxPrompt.addEventListener("input", () => { elPrompt.value = fxPrompt.value; });
      elPrompt.addEventListener("input", () => {
        if (fxPrompt.value !== elPrompt.value) fxPrompt.value = elPrompt.value;
      });
    }
    if (fxBuildingPrompt && elBuildingPrompt) {
      fxBuildingPrompt.value = elBuildingPrompt.value;
      fxBuildingPrompt.addEventListener("input", () => { elBuildingPrompt.value = fxBuildingPrompt.value; });
      elBuildingPrompt.addEventListener("input", () => {
        if (fxBuildingPrompt.value !== elBuildingPrompt.value) fxBuildingPrompt.value = elBuildingPrompt.value;
      });
    }
    const BUILDING_MODEL_KEY = "pixelwf_building_model";
    const BUILDING_MODELS = new Set([
      "gemini-3-pro-image-preview",
      "gemini-3.1-flash-image-preview",
      "gpt-image-2"
    ]);
    function normalizeBuildingModel(model) {
      const v = String(model || "").trim();
      return BUILDING_MODELS.has(v) ? v : "gemini-3-pro-image-preview";
    }
    function setBuildingModel(model) {
      const v = normalizeBuildingModel(model);
      if (elBuildingModel) elBuildingModel.value = v;
      if (fxBuildingModel) fxBuildingModel.value = v;
      if (fxWorldBuildingModel) fxWorldBuildingModel.value = v;
      ls(BUILDING_MODEL_KEY, v);
      return v;
    }
    function getBuildingModel() {
      const fromUi =
        (elBuildingModel && elBuildingModel.value) ||
        (fxBuildingModel && fxBuildingModel.value) ||
        (fxWorldBuildingModel && fxWorldBuildingModel.value);
      return normalizeBuildingModel(fromUi || ls(BUILDING_MODEL_KEY));
    }
    const initialBuildingModel = getBuildingModel();
    setBuildingModel(initialBuildingModel);
    elBuildingModel?.addEventListener("change", () => setBuildingModel(elBuildingModel.value));
    fxBuildingModel?.addEventListener("change", () => setBuildingModel(fxBuildingModel.value));
    fxWorldBuildingModel?.addEventListener("change", () => setBuildingModel(fxWorldBuildingModel.value));

    const animator = {
      canvas: elAnimatorCanvas,
      ctx: elAnimatorCanvas.getContext("2d"),
      fxCanvas: elAnimatorFxCanvas,
      fxCtx: elAnimatorFxCanvas.getContext("2d"),
      // 横屏游玩：离屏舞台（避免 DPR 缩放导致只渲染左上角）
      stageCanvas: document.createElement("canvas"),
      stageCtx: null,
      frameCanvas: document.createElement("canvas"),
      frameCtx: null,
      tempCanvas: document.createElement("canvas"),
      tempCtx: null,
      tilemapCanvas: document.createElement("canvas"),
      tilemapCtx: null,
      tilemapPixels: null,
      pressed: new Set(),
      image: null,
      idleSheet: null,
      sheetCanvas: null,
      label: "",
      frameWidth: 0,
      frameHeight: 0,
      columns: 6,
      rows: 5,
      frameIndex: 0,
      frameTime: 0,
      frameMs: 110,
      idleFrameMs: 1000,
      idleSquashY: 0.93,
      lastTs: 0,
      posX: 120,
      posY: 160,
      speed: 30,
      npcMoveSpeed: 12,
      scale: 1,
      lastRow: 4,
      lastFlip: false,
      directionName: "待机",
      worldX: 0,
      worldY: 0,
      // 2.5D 顶视倾斜参数（更像 RPG 的“俯视+轻透视”）
      horizonY: 0,
      cameraHeight: 60,
      forwardScale: 1310,
      spanBase: 270,
      spanScale: 1500,
      worldScale: 1.21,
      // 人物目标“瓦片尺寸”（屏幕像素）：用于自动把人物缩到和一个 tile 差不多大
      // 你后续接正方形 tilemap 时，通常 16~28px 都合理
      targetCharPx: 42,
      // 镜头聚焦：人物固定居中，移动只滚动世界
      centerOnPlayer: true,
      // 地面只渲染人物附近（世界单位半径）；越小越省、越聚焦
      renderRadiusWorld: 1500,
      // 建筑在渲染半径边缘下沉/上浮的过渡距离（tile 世界单位）
      buildingSinkTransitionWorld: 25,
      // 玩家碰撞箱（世界单位，圆形）
      enablePlayerCollision: true,
      playerCollisionRadius: 8,
      // 移动碰撞每帧做连续小步检测；性能靠近域过滤、缓存碰撞多边形与 AABB 预判控制
      collisionCheckHz: 0,
      _collisionLastCheckTs: 0,
      _collisionUncheckedTravel: 0,
      // 碰撞近域优化：远离玩家的对象不参与碰撞/交互命中计算
      collisionNearFieldEnabled: true,
      collisionNearFieldRadiusWorld: 260,
      // 玩家碰撞半径自动跟随脚底阴影尺寸（更贴合视觉）
      playerCollisionAutoFromFoot: true,
      // 调试：显示碰撞箱覆盖层
      showCollisionDebug: false,
      // 建筑渲染模态：textured=贴图壳面，flat=纯色壳面
      buildingRenderMode: "textured",
      // 调试：最近一次移动被哪个碰撞体拦截
      _collisionDebugLastBlocker: null,
      // 倾角/偏航（对应你给的 shader ground_skew）
      groundSkew: 0,
      // 透视倾角（俯仰）：越大越“俯视陡”，可见范围更短；越小越“平”，看得更远
      tilt: 0.25,
      // 与脚底阴影 Y 相加后写入透视锚点（getPivot），勿拆到 sy 上
      viewOffsetY: -133,
      // 基础 Y 轴移轴参数：center 偏移用像素，half / fade 用相对屏高比例
      tiltShiftFocusCenterOffset: 0,
      tiltShiftFocusHalfRatio: 0.12,
      tiltShiftFadeRatio: 0.18,
      /** 虚化半径倍率（1≈屏短边 1.4%） */
      tiltShiftBlurStrength: 1,
      /** 移轴后处理降采样（越小越快、边缘更易糊成块） */
      tiltShiftRenderScale: 0.5,
      /** 焦带 soft-light 高光强度 */
      tiltShiftGlowStrength: 0.18,
      // Q/E：绕 (worldX,worldY) 竖轴水平偏航（弧度），进 project / 反算；非 Canvas.rotate
      viewYaw: 0,
      viewYawRadPerSec: 1.85,
      /** 透视用世界 pivot 相对角色的绕轨半径（世界单位），随 viewYaw 在水平面画圆，模拟镜头绕看 */
      cameraOrbitWorldR: 14,
      // Hut 放置编辑（仅 FX 全屏内交互；体素实时画，非贴图烘焙）
      placement: {
        active: false,
        kind: null,
        /** kind=edit 时使用：被编辑的目标建筑 id */
        editTargetId: null,
        /** kind=edit 时使用：预览使用的建筑模型（直接引用场景对象的 model） */
        model: null,
        wx: 0,
        wy: 0,
        angle: Math.PI * 0.25,
        scale: 0.5,
        dragging: false,
        // 拖动：按下时 placement 相对地面抓取点的偏移，避免一点击就把锚点改到指尖下
        _dragOffsetWx: 0,
        _dragOffsetWy: 0,
      },
      buildingEdit: {
        armed: false,
        // 进入编辑后已选中某栋建筑，并处在 placement(edit) 状态
        active: false,
        targetId: null,
        // 退出编辑时的轻量回退（不包含模型/标签等）
        original: null,
      },
      _hutVoxelModel: null,
      _generatedCharacter: null,
      _generatedBuilding: null,
      _characterLibrary: [],
      _buildingLibrary: [],
      _nextBuildingId: 1,
      _sceneExtensions: {},
      _sceneStore: null,
      _sceneRoadVersion: 0,
      _sceneRoadNetwork: null,
      roadMaskCanvas: document.createElement("canvas"),
      roadMaskCtx: null,
      roadMaskPixels: null,
      _sceneRoadMaskMeta: null,
      sceneLightCanvas: document.createElement("canvas"),
      sceneLightCtx: null,
      _sceneLightBakeKey: "",
      _sceneLightBakeMeta: null,
      _sceneLightBakeData: null,
      _sceneLightBakeDirty: true,
      sunLighting: {
        // 固定太阳：从左上方照来，阴影向右下方延伸。
        fromX: -0.56,
        fromY: -0.83,
        shadowX: 0.56,
        shadowY: 0.83,
        ambientDarkness: 0,
        warmth: 0.14,
        shadowStrength: 0.62,
        shadowLength: 0.55,
        contrast: 1,
        reflectionStrength: 0.18,
        groundDepthDarkness: 0.18,
      },
      dayNightCycle: {
        enabled: true,
        paused: false,
        dayDurationSec: 360,
        nightDurationSec: 240,
        dayAmbientDarkness: 0.02,
        nightAmbientDarkness: 0.58,
        dayWarmth: 0.18,
        nightWarmth: 0.02,
        dayShadowLength: 0.55,
        nightShadowLength: 1.18,
        shadowRotateRangeDeg: 78,
        timeScale: 1,
        currentTimeSec: 0,
        transitionRatio: 0.15,
        _lastBakeAtMs: 0,
        _lastBakeFromX: NaN,
        _lastBakeFromY: NaN,
        _lastBakeShadowLength: NaN,
        _lastUiSyncAtMs: 0,
      },
      _tilemapBaseImageData: null,
      /** 地面缓冲：按 ""+w+"x"+h 复用像素缓冲，避免每帧 getImageData 读回 GPU */
      _snowImgMap: null,
      _sceneRenderables: [],
      _sceneTagsDirty: true,
      _sceneSortRevision: 0,
      _sceneSortCacheKey: "",
      _sceneSortOrderIds: [],
      _sceneSortIndexById: null,
      _sceneSortNextId: 1,
      sceneChunkSizeWorld: 64,
      sceneSpriteLodFarWorld: 220,
      sceneSpriteCullWorld: 420,
      _sceneChunkRevision: -1,
      _sceneChunkIndex: null,
      postFxCanvas: document.createElement("canvas"),
      postFxCtx: null,
      postFxMaskCanvas: document.createElement("canvas"),
      postFxMaskCtx: null,
      tiltShiftObjectCanvas: document.createElement("canvas"),
      tiltShiftObjectCtx: null,
      _tiltShiftFocusSubject: null,
      _tiltShiftLastCostMs: 0,
      _buildingGlRenderer: null,
      _groundGlRenderer: null,
      // GPU 地面 v2：只复刻旧版纯色噪声 tilemap，先不叠道路/阴影，便于逐项对齐。
      enableGroundWebGL: true,
      groundWebGLSupersample: 1,
      groundTileMeshMaxRadiusWorld: 72,
      enableBuildingGPUProjection: true,
      /** 脚底椭圆中心（屏幕），供透视锚点 = 网格落脚点；横屏舞台用 _footEllipseStage* */
      _footEllipseX: NaN,
      _footEllipseY: NaN,
      _footEllipseStageX: NaN,
      _footEllipseStageY: NaN,
      /** 脚底阴影接地的屏幕 Y（与 drawCharacterFootShadow 的 footY 一致）；横屏用 _footShadowStageScreenY */
      _footShadowScreenY: NaN,
      _footShadowStageScreenY: NaN,
      orbitBulletAngle: 0,
      orbitBulletBoost: 0,
      orbitBulletDirection: 1,
      orbitBulletCollisionRadiusWorld: 0.55,
      orbitBulletBounceCooldownMs: 90,
      orbitBulletLastBounceAtMs: 0,
      orbitBulletDamage: 2,
      resourceDefaultHp: 10,
      resourceHitCooldownMs: 120,
      // 移轴景深后处理：默认开启，HUD 中可切换。
      enableTiltShiftFx: true,
      // 后处理性能策略：移动/转视角时降频更新，静止后恢复满质量
      postFxDynamicQuality: true,
      postFxMovingFrameStride: 3,
      postFxIdleFrameStride: 1,
      _postFxFrameCounter: 0,
      _lastDirectionLabel: "",
      fpsHudEl: elFpsHud,
      _fpsSampleFrames: 0,
      _fpsSampleMs: 0,
      _fpsLastUiTs: 0,
      _fpsValue: 0,
      _groundPerfUntilTs: 0,
      /** 全屏 FX 底部物品栏：槽位与当前选中（可与后续拾取/使用逻辑对接） */
      hotbarSlotCount: 9,
      hotbarSelectedIndex: 0,
      hotbarSlots: (() => {
        const slots = Array(9).fill(null);
        slots[0] = { name: "草方块", icon: "./grass.png" };
        return slots;
      })(),
      // 世界交互菜单：当前仅落地 sign->阅读，后续可扩展到合成/采集等功能树
      interactionTileRange: 1,
      _interactionNearbyActions: [],
      _interactionMenuVisible: false,
      _interactionDetailText: "",
      _interactionMenuListSignature: "",
      codexOpen: false,
      activeSceneKind: "world",
      activeSceneBounds: null,
      activeSceneMeta: null,
      interiorState: {
        active: false,
        hostObjectId: 0,
        sceneId: "",
        returnSceneId: "",
        returnWorldX: 0,
        returnWorldY: 0,
        data: null,
      },
      screenFade: {
        active: false,
        elapsedMs: 0,
        outMs: 220,
        holdMs: 80,
        inMs: 220,
        midpointDone: false,
        midpointPending: false,
        onMidpoint: null,
        onComplete: null,
      },
    };
    animator.ctx.imageSmoothingEnabled = false;
    animator.fxCtx.imageSmoothingEnabled = false;
    animator.stageCtx = animator.stageCanvas.getContext("2d", { willReadFrequently: true });
    animator.frameCtx = animator.frameCanvas.getContext("2d", { willReadFrequently: true });
    animator.tempCtx = animator.tempCanvas.getContext("2d", { willReadFrequently: true });
    animator.tilemapCtx = animator.tilemapCanvas.getContext("2d", { willReadFrequently: true });
    animator.postFxCtx = animator.postFxCanvas.getContext("2d");
    animator.postFxMaskCtx = animator.postFxMaskCanvas.getContext("2d");
    animator.tiltShiftObjectCtx = animator.tiltShiftObjectCanvas.getContext("2d");
    animator.roadMaskCtx = animator.roadMaskCanvas.getContext("2d", { willReadFrequently: true });
    animator.sceneLightCtx = animator.sceneLightCanvas.getContext("2d", { willReadFrequently: true });
    animator.frameCtx.imageSmoothingEnabled = false;
    animator.tempCtx.imageSmoothingEnabled = false;
    animator.tilemapCtx.imageSmoothingEnabled = false;
    animator.stageCtx.imageSmoothingEnabled = false;
    animator.postFxCtx.imageSmoothingEnabled = true;
    animator.postFxMaskCtx.imageSmoothingEnabled = true;
    animator.tiltShiftObjectCtx.imageSmoothingEnabled = true;
    animator.roadMaskCtx.imageSmoothingEnabled = false;
    animator.sceneLightCtx.imageSmoothingEnabled = false;

    const SCENE_STORAGE_KEY = "pixelwf_world_scenes_v1";
    const DEFAULT_SCENE_ID = "default_scene";

    function finalizeVoxelModel(model) {
      if (!model) return null;
      if (typeof globalThis.ensureGreedyShellQuads === "function") {
        globalThis.ensureGreedyShellQuads(model);
      }
      if (typeof globalThis.ensureTexturedAtlases === "function") {
        globalThis.ensureTexturedAtlases(model);
      }
      return model;
    }

    function voxelSolidIndex(x, y, z, W, D) {
      return (y * D + z) * W + x;
    }

    function readCanvasRgba(canvas) {
      if (!canvas || typeof canvas.getContext !== "function") return null;
      const width = canvas.width || 0;
      const height = canvas.height || 0;
      if (!width || !height) return null;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      return { width, height, data: ctx.getImageData(0, 0, width, height).data };
    }

    function readPixelChannels(image, x, y) {
      if (!image || x < 0 || y < 0 || x >= image.width || y >= image.height) return null;
      const i = (y * image.width + x) * 4;
      return [image.data[i], image.data[i + 1], image.data[i + 2], image.data[i + 3]];
    }

    function isSimilarOpaqueColorAt(image, x, y, targetR, targetG, targetB, alphaThreshold = 8, colorToleranceSq = 42 * 42) {
      if (!image || x < 0 || y < 0 || x >= image.width || y >= image.height) return false;
      const i = (y * image.width + x) * 4;
      if (image.data[i + 3] <= alphaThreshold) return false;
      const dr = image.data[i] - targetR;
      const dg = image.data[i + 1] - targetG;
      const db = image.data[i + 2] - targetB;
      return dr * dr + dg * dg + db * db <= colorToleranceSq;
    }

    function buildQuantizedColorKey(r, g, b) {
      return ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    }

    function columnHasSimilarColorBelowCached(
      image,
      columnX,
      startY,
      targetR,
      targetG,
      targetB,
      alphaThreshold,
      colorToleranceSq,
      cache
    ) {
      if (!image || columnX < 0 || columnX >= image.width) return false;
      const colorKey = buildQuantizedColorKey(targetR, targetG, targetB);
      const key = columnX + "|" + startY + "|" + colorKey;
      if (cache.has(key)) return cache.get(key);
      let found = false;
      for (let y = startY + 1; y < image.height; y++) {
        if (isSimilarOpaqueColorAt(image, columnX, y, targetR, targetG, targetB, alphaThreshold, colorToleranceSq)) {
          found = true;
          break;
        }
      }
      cache.set(key, found);
      return found;
    }

    function rowHasSimilarColorNearby(image, centerX, y, targetR, targetG, targetB, alphaThreshold, colorToleranceSq, searchRadius = 0) {
      if (!image || y < 0 || y >= image.height) return false;
      const radius = Math.max(0, Math.floor(searchRadius));
      const x0 = Math.max(0, centerX - radius);
      const x1 = Math.min(image.width - 1, centerX + radius);
      for (let x = x0; x <= x1; x++) {
        if (isSimilarOpaqueColorAt(image, x, y, targetR, targetG, targetB, alphaThreshold, colorToleranceSq)) {
          return true;
        }
      }
      return false;
    }

    function columnBandHasSimilarColorBelowCached(
      image,
      centerX,
      startY,
      targetR,
      targetG,
      targetB,
      alphaThreshold,
      colorToleranceSq,
      searchRadius,
      cache
    ) {
      if (!image || centerX < 0 || centerX >= image.width) return false;
      const radius = Math.max(0, Math.floor(searchRadius));
      const colorKey = buildQuantizedColorKey(targetR, targetG, targetB);
      const key = centerX + "|" + startY + "|" + radius + "|" + colorKey;
      if (cache.has(key)) return cache.get(key);
      let found = false;
      for (let y = startY + 1; y < image.height; y++) {
        if (rowHasSimilarColorNearby(image, centerX, y, targetR, targetG, targetB, alphaThreshold, colorToleranceSq, radius)) {
          found = true;
          break;
        }
      }
      cache.set(key, found);
      return found;
    }

    function rebuildVoxelListFromSolid(model, shellOnly) {
      if (!model?.solid) return;
      const { solid, W, H, D } = model;
      const list = [];
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
            const i = voxelSolidIndex(x, y, z, W, D);
            if (!solid[i]) continue;
            if (!shellOnly) {
              list.push({ x, y, z });
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
              if (!solid[voxelSolidIndex(nx, ny, nz, W, D)]) {
                border = true;
                break;
              }
            }
            if (border) list.push({ x, y, z });
          }
        }
      }
      model.list = list;
      model._greedyQuads = null;
    }

    function bytesToBase64(bytes) {
      if (!bytes || !bytes.length) return "";
      let binary = "";
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode.apply(null, chunk);
      }
      return btoa(binary);
    }

    function base64ToBytes(data) {
      if (!data) return new Uint8Array(0);
      const binary = atob(String(data));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    function encodeSolidBitset(solid) {
      if (!solid || !solid.length) return null;
      const length = solid.length;
      const packed = new Uint8Array(Math.ceil(length / 8));
      for (let i = 0; i < length; i++) {
        if (solid[i]) packed[i >> 3] |= 1 << (i & 7);
      }
      return {
        encoding: "bitset-base64",
        length,
        data: bytesToBase64(packed),
      };
    }

    function decodeSolidBitset(snapshot) {
      if (!snapshot || snapshot.encoding !== "bitset-base64") return null;
      const length = Math.max(0, Number(snapshot.length) || 0);
      const packed = base64ToBytes(snapshot.data || "");
      const solid = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        solid[i] = (packed[i >> 3] & (1 << (i & 7))) ? 1 : 0;
      }
      return solid;
    }

    function formatBytesApprox(bytes) {
      const n = Math.max(0, Number(bytes) || 0);
      if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(2) + " MB";
      if (n >= 1024) return (n / 1024).toFixed(1) + " KB";
      return n + " B";
    }

    function pruneTopColorMismatchByViews(model, opts = {}) {
      if (!model?.solid || !model._atlasFront || !model._atlasSide || !model._atlasTop) return 0;
      const shellOnly = opts.shellOnly !== false;
      const alphaThreshold = Number.isFinite(opts.alphaThreshold) ? opts.alphaThreshold : 8;
      const colorTolerance = Number.isFinite(opts.colorTolerance) ? Math.max(0, opts.colorTolerance) : 42;
      const colorToleranceSq = colorTolerance * colorTolerance;
      const front = readCanvasRgba(model._atlasFront);
      const side = readCanvasRgba(model._atlasSide);
      const top = readCanvasRgba(model._atlasTop);
      if (!front || !side || !top) return 0;

      const { solid, W, H, D } = model;
      const searchRadiusFront = Number.isFinite(opts.searchRadiusFront)
        ? Math.max(0, Math.floor(opts.searchRadiusFront))
        : Math.max(1, Math.round(W * 0.025));
      const searchRadiusSide = Number.isFinite(opts.searchRadiusSide)
        ? Math.max(0, Math.floor(opts.searchRadiusSide))
        : Math.max(1, Math.round(D * 0.025));
      let removed = 0;
      const frontBelowCache = new Map();
      const sideBelowCache = new Map();

      for (let x = 0; x < W; x++) {
        for (let z = 0; z < D; z++) {
          for (let y = H - 1; y >= 0; y--) {
            const idx = voxelSolidIndex(x, y, z, W, D);
            if (!solid[idx]) continue;
            if (y + 1 < H && solid[voxelSolidIndex(x, y + 1, z, W, D)]) continue;

            const imageY = H - 1 - y;
            const imageZ = D - 1 - z;
            const topColor = readPixelChannels(top, x, imageZ);
            if (!topColor || topColor[3] <= alphaThreshold) break;
            const targetR = topColor[0];
            const targetG = topColor[1];
            const targetB = topColor[2];

            const frontMatchesHere = rowHasSimilarColorNearby(
              front, x, imageY, targetR, targetG, targetB, alphaThreshold, colorToleranceSq, searchRadiusFront
            );
            const sideMatchesHere = rowHasSimilarColorNearby(
              side, z, imageY, targetR, targetG, targetB, alphaThreshold, colorToleranceSq, searchRadiusSide
            );

            if (frontMatchesHere || sideMatchesHere) break;

            const frontHasBelow = columnBandHasSimilarColorBelowCached(
              front, x, imageY, targetR, targetG, targetB, alphaThreshold, colorToleranceSq, searchRadiusFront, frontBelowCache
            );
            const sideHasBelow = columnBandHasSimilarColorBelowCached(
              side, z, imageY, targetR, targetG, targetB, alphaThreshold, colorToleranceSq, searchRadiusSide, sideBelowCache
            );

            if (frontHasBelow && sideHasBelow) {
              solid[idx] = 0;
              removed++;
              continue;
            }
            break;
          }
        }
      }

      if (removed > 0) {
        rebuildVoxelListFromSolid(model, shellOnly);
      }
      model._trimmedTopColorMismatch = removed;
      return removed;
    }

    function ensureHutVoxelModel() {
      if (!animator._hutVoxelModel && typeof globalThis.buildHut1VoxelModel === "function") {
        try {
          animator._hutVoxelModel = finalizeVoxelModel(globalThis.buildHut1VoxelModel({}));
        } catch (err) {
          console.error(err);
        }
      }
      return animator._hutVoxelModel;
    }

    function getGeneratedBuildingModel() {
      return animator._generatedBuilding && animator._generatedBuilding.model
        ? animator._generatedBuilding.model
        : null;
    }

    function getPlacementModel(kind) {
      if (kind === "hut") return ensureHutVoxelModel();
      if (kind === "generated") return getGeneratedBuildingModel();
      if (kind === "edit") return animator.placement && animator.placement.model ? animator.placement.model : null;
      return null;
    }

    function getPlacementLabel(kind) {
      if (kind === "hut") return "Hut";
      if (kind === "generated") return "AI 建筑";
      return "建筑";
    }

    function currentGeneratedBuildingSceneAsset() {
      const building = animator._generatedBuilding;
      if (!building) return null;
      return {
        kind: "generated-building",
        id: building.id || "",
        prompt: building.prompt || "",
        originalSrc: building.originalSrc || "",
        processedSrc: building.processedSrc || "",
        views: building.views ? {
          front: building.views.front || "",
          side: building.views.side || "",
          top: building.views.top || "",
        } : null,
        voxelOptions: building.voxelOptions || null,
        normalizedViews: building.normalizedViews || null,
        widthTiles: normalizeWidthTiles(building.widthTiles),
        tags: normalizeSemanticTags(building.tags, building.prompt || ""),
        interactionTags: normalizeInteractionTags(building.interactionTags || building.tags, building.prompt || ""),
        buildingTag: building.buildingTag || primaryBuildingTagFromTags(building.tags),
        drawRoad: normalizeDrawRoad(building.drawRoad, building.tags),
        facilityProfile: sanitizeFacilityProfileLike(building.facilityProfile),
        libraryMeta: building.meta || null,
      };
    }

    function getModelLowerBandWidth(model, ratio = 1 / 8) {
      const W = Number(model?.W) || 0;
      const H = Number(model?.H) || 0;
      if (!(W > 0 && H > 0) || !Array.isArray(model?.list)) return Math.max(1, W || 1);
      const maxY = Math.max(1, H * ratio);
      let minX = Infinity;
      let maxX = -Infinity;
      for (const v of model.list) {
        if (!v || v.y >= maxY || (v.y + 1) <= 0) continue;
        minX = Math.min(minX, Number(v.x) || 0);
        maxX = Math.max(maxX, Number(v.x) || 0);
      }
      if (!(minX <= maxX)) return Math.max(1, W);
      return Math.max(1, maxX - minX + 1);
    }

    if (typeof globalThis.preloadHut1Preset === "function") {
      globalThis.preloadHut1Preset().catch(function (e) {
        console.warn("[hut] 预设预加载失败（放置前会重试）", e);
      });
    }

    function syncPlacementUi() {
      const p = animator.placement;
      const fs = elFxFullscreen.classList.contains("open");
      const editModeStarted = !!(animator.buildingEdit && (animator.buildingEdit.armed || animator.buildingEdit.active));
      const isEdit = p.active && p.kind === "edit";
      if (fxBtnPlaceHut) {
        fxBtnPlaceHut.disabled = !fs || p.active;
        fxBtnPlaceHut.hidden = !!p.active;
      }
      if (fxBtnPlaceGenerated) {
        fxBtnPlaceGenerated.disabled = !fs || p.active || !getGeneratedBuildingModel();
        fxBtnPlaceGenerated.hidden = !!p.active;
      }
      if (fxBtnEditBuilding) {
        fxBtnEditBuilding.disabled = !fs || p.active;
        fxBtnEditBuilding.hidden = !!p.active;
      }
      if (fxBtnPlaceConfirm) fxBtnPlaceConfirm.hidden = !p.active || isEdit;
      if (fxBtnPlaceCancel) fxBtnPlaceCancel.hidden = !p.active || isEdit;
      if (fxBtnEditDelete) {
        fxBtnEditDelete.hidden = !editModeStarted;
        fxBtnEditDelete.disabled = !isEdit;
      }
      if (fxBtnEditDone) fxBtnEditDone.hidden = !editModeStarted;
      if (fxBtnRenderMode) {
        fxBtnRenderMode.disabled = !fs;
        const modeLabel =
          animator.buildingRenderMode === "flat"
            ? "蓝模壳面"
            : animator.buildingRenderMode === "unified"
              ? "统一壳色"
              : "贴图壳面";
        fxBtnRenderMode.textContent = "渲染：" + modeLabel;
      }
      if (fxPlaceHint) {
        if (!fs) fxPlaceHint.textContent = "";
        else if (isEdit) {
          fxPlaceHint.textContent =
            "编辑建筑：拖动移动，滚轮缩放，Shift + Q/E 旋转。点击右上角绿色「✓」完成并退出（Esc 取消）。";
        } else if (p.active) {
          fxPlaceHint.textContent =
            "拖动：在画面上按住拖动建筑。滚轮：缩放尺寸。Shift + Q / E：旋转。点击「确认」写入场景（Esc 取消编辑）。";
        } else if (!getGeneratedBuildingModel()) {
          fxPlaceHint.textContent = "可放置预设 Hut。若要放置 AI 建筑，请先生成建筑，或从下方建筑素材库加载一个已保存建筑。";
        } else {
          fxPlaceHint.textContent = "可在预设 Hut 与 AI 建筑之间任选其一放置；也可从建筑素材库一键载入并直接进入放置。确认后建筑以实时体素形式留在世界里。";
        }
      }
    }

    function cancelPlacement() {
      const wasEdit = animator.placement && animator.placement.active && animator.placement.kind === "edit";
      animator.placement.active = false;
      animator.placement.kind = null;
      animator.placement.editTargetId = null;
      animator.placement.model = null;
      animator.placement.dragging = false;
      animator.placement.scale = 0.5;
      animator.placement._dragOffsetWx = 0;
      animator.placement._dragOffsetWy = 0;
      if (wasEdit && animator.buildingEdit) {
        animator.buildingEdit.armed = false;
        animator.buildingEdit.active = false;
        animator.buildingEdit.targetId = null;
        animator.buildingEdit.original = null;
        if (elFxBigCanvas) elFxBigCanvas.style.cursor = "";
      }
      syncPlacementUi();
    }

    function beginPlacement(kind) {
      animator.placement.active = true;
      animator.placement.kind = kind;
      animator.placement.wx = animator.worldX + 35;
      animator.placement.wy = animator.worldY - 95;
      animator.placement.angle = Math.PI * 0.25;
      if (kind === "generated") {
        const model = getGeneratedBuildingModel();
        const widthTiles = normalizeWidthTiles(animator._generatedBuilding?.widthTiles);
        const modelWidth = getModelLowerBandWidth(model, 1 / 8);
        animator.placement.scale = Math.max(0.08, Math.min(8, widthTiles / modelWidth));
      } else {
        animator.placement.scale = 0.5;
      }
      animator.placement.dragging = false;
      animator.placement._dragOffsetWx = 0;
      animator.placement._dragOffsetWy = 0;
      syncPlacementUi();
    }

    async function startPlacementHut() {
      if (!elFxFullscreen.classList.contains("open")) return;
      if (typeof globalThis.preloadHut1Preset === "function") {
        if (fxPlaceHint) fxPlaceHint.textContent = "正在解码 hut 三视图…";
        try {
          await globalThis.preloadHut1Preset();
        } catch (err) {
          console.error(err);
          if (fxPlaceHint) {
            fxPlaceHint.textContent =
              "无法加载 hut 预设：" +
              (err && err.message ? err.message : String(err)) +
              "。请用 http:// 本地服务打开，并确认 mud/hut1-preset.js 可访问。";
          }
          syncPlacementUi();
          return;
        }
      }
      const model = ensureHutVoxelModel();
      if (!model) {
        if (fxPlaceHint) {
          fxPlaceHint.textContent =
            "无法生成 hut 体素：请用本地服务（http://）打开页面，并确认 mud/hut1-preset.js 与 mud/hut-voxel-runtime.js 可加载且无控制台报错。";
        }
        syncPlacementUi();
        return;
      }
      beginPlacement("hut");
    }

    function startPlacementGenerated() {
      if (!elFxFullscreen.classList.contains("open")) return;
      const model = getGeneratedBuildingModel();
      if (!model) {
        if (fxPlaceHint) {
          fxPlaceHint.textContent = "当前还没有可放置的 AI 建筑，请先生成并切片成功。";
        }
        syncPlacementUi();
        return;
      }
      beginPlacement("generated");
    }

    function confirmPlacement() {
      const p = animator.placement;
      if (!p.active) return;
      const model = getPlacementModel(p.kind);
      if (!model) return;
      const inferredTags = normalizeSemanticTags(
        animator._generatedBuilding?.tags,
        (animator._generatedBuilding && animator._generatedBuilding.prompt) || ""
      );
      const inferredInteractionTags = normalizeInteractionTags(
        []
          .concat(animator._generatedBuilding?.interactionTags || [])
          .concat(animator._generatedBuilding?.tags || []),
        (animator._generatedBuilding && animator._generatedBuilding.prompt) || ""
      );
      const inferredTag = primaryBuildingTagFromTags(inferredTags);
      ensureSceneObjects();
      animator._sceneObjects.push({
        id: animator._nextBuildingId++,
        type: p.kind,
        wx: p.wx,
        wy: p.wy,
        angle: p.angle,
        scale: p.scale,
        model,
        label: getPlacementLabel(p.kind),
        tags: inferredTags,
        interactionTags: inferredInteractionTags,
        buildingTag: inferredTag,
        isHouse: inferredTags.includes("house"),
        drawRoad: normalizeDrawRoad(animator._generatedBuilding?.drawRoad, inferredTags),
        asset: p.kind === "generated" ? currentGeneratedBuildingSceneAsset() : { kind: "preset", preset: "hut" },
        interior: null,
        properties: buildSceneObjectPropertiesFromSemanticState({}, inferredTags, inferredInteractionTags, animator._generatedBuilding),
      });
      markSceneObjectsDirty();
      rebuildVillageRoadTilemap();
      invalidateSceneLightingBake();
      cancelPlacement();
    }

    function collapseFxOverlaysForEdit() {
      // 进入编辑界面时自动收起其它窗口：图鉴、交互菜单、交互弹窗，并确保 HUD 可见。
      animator.codexOpen = false;
      closeInteractionModal();
      animator._interactionNearbyActions = [];
      animator._interactionDetailText = "";
      renderFxInteractionMenu();
      renderFxCodexPanel();
      setFxHudState("normal");
    }

    function armBuildingEditMode() {
      if (!elFxFullscreen.classList.contains("open")) return;
      if (!animator.buildingEdit) return;
      if (animator.placement.active) cancelPlacement();
      animator.buildingEdit.armed = true;
      animator.buildingEdit.active = false;
      animator.buildingEdit.targetId = null;
      animator.buildingEdit.original = null;
      collapseFxOverlaysForEdit();
      if (elFxBigCanvas) elFxBigCanvas.style.cursor = "crosshair";
      if (fxPlaceHint) {
        fxPlaceHint.textContent = "编辑建筑：请点击场景中的任意建筑进入虚化编辑（Esc 退出）。";
      }
    }

    function disarmBuildingEditMode() {
      if (!animator.buildingEdit) return;
      animator.buildingEdit.armed = false;
      if (elFxBigCanvas) elFxBigCanvas.style.cursor = "";
      syncPlacementUi();
    }

    function pickBuildingAtWorld(worldX, worldY) {
      ensureSceneObjects();
      const objs = animator._sceneObjects || [];
      let best = null;
      let bestScore = Infinity;
      for (const o of objs) {
        if (!o || !o.model || !Number.isFinite(o.wx) || !Number.isFinite(o.wy)) continue;
        const poly = buildingFootprintWorld(o);
        if (!poly || poly.length < 3) continue;
        if (!pointInPolygon2D(worldX, worldY, poly)) continue;
        const dx = worldX - (Number(o.wx) || 0);
        const dy = worldY - (Number(o.wy) || 0);
        const score = dx * dx + dy * dy;
        if (score < bestScore) {
          best = o;
          bestScore = score;
        }
      }
      return best;
    }

    function beginEditBuilding(o) {
      if (!o || !o.model || !animator.buildingEdit) return;
      animator.buildingEdit.armed = false;
      animator.buildingEdit.active = true;
      animator.buildingEdit.targetId = o.id;
      animator.buildingEdit.original = {
        wx: Number(o.wx) || 0,
        wy: Number(o.wy) || 0,
        angle: Number.isFinite(o.angle) ? o.angle : Math.PI * 0.25,
        scale: Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1,
      };
      animator.placement.active = true;
      animator.placement.kind = "edit";
      animator.placement.editTargetId = o.id;
      animator.placement.model = o.model;
      animator.placement.wx = animator.buildingEdit.original.wx;
      animator.placement.wy = animator.buildingEdit.original.wy;
      animator.placement.angle = animator.buildingEdit.original.angle;
      animator.placement.scale = animator.buildingEdit.original.scale;
      animator.placement.dragging = false;
      animator.placement._dragOffsetWx = 0;
      animator.placement._dragOffsetWy = 0;
      collapseFxOverlaysForEdit();
      syncPlacementUi();
    }

    function confirmEditBuilding() {
      const p = animator.placement;
      if (!p || !p.active || p.kind !== "edit") return;
      ensureSceneObjects();
      const targetId = p.editTargetId;
      const objs = animator._sceneObjects || [];
      const o = objs.find((it) => it && it.id === targetId);
      if (o) {
        o.wx = Number(p.wx) || 0;
        o.wy = Number(p.wy) || 0;
        o.angle = Number.isFinite(p.angle) ? p.angle : (Number(o.angle) || 0);
        o.scale = Number.isFinite(p.scale) && p.scale > 0 ? p.scale : (Number(o.scale) || 1);
      }
      markSceneObjectsDirty();
      rebuildVillageRoadTilemap();
      invalidateSceneLightingBake();
      cancelPlacement();
    }

    function deleteEditingBuilding() {
      const p = animator.placement;
      if (!p || !p.active || p.kind !== "edit") return;
      ensureSceneObjects();
      const targetId = p.editTargetId;
      if (!targetId) return;
      const objs = animator._sceneObjects || [];
      const idx = objs.findIndex((it) => it && it.id === targetId);
      if (idx < 0) return;
      objs.splice(idx, 1);
      markSceneObjectsDirty();
      rebuildVillageRoadTilemap();
      invalidateSceneLightingBake();
      cancelPlacement();
    }

    function fxClientToStage(clientX, clientY) {
      const rect = elFxBigCanvas.getBoundingClientRect();
      const mx = ((clientX - rect.left) / Math.max(rect.width, 1)) * fxStageW;
      const my = ((clientY - rect.top) / Math.max(rect.height, 1)) * fxStageH;
      return { mx, my };
    }

    function syncFxHudFab() {
      if (!fxBtnHudFab) return;
      const hud = elFxFullscreen.querySelector(".fx-hud");
      const show =
        elFxFullscreen.classList.contains("open") &&
        !!hud?.classList.contains("is-hidden");
      fxBtnHudFab.classList.toggle("is-visible", show);
    }

    function setFxHudState(state) {
      const hud = elFxFullscreen.querySelector(".fx-hud");
      if (!hud) return;
      const hidden = state === "hidden";
      const minimized = state === "minimized";
      hud.classList.toggle("is-hidden", hidden);
      hud.classList.toggle("is-minimized", minimized);
      if (fxBtnToggleHud) fxBtnToggleHud.textContent = hidden ? "打开面板" : "隐藏";
      if (fxBtnMinimizeHud) fxBtnMinimizeHud.textContent = minimized ? "还原" : "最小化";
      ls(FX_KEYS.hudHidden, hidden ? "1" : "0");
      ls(FX_KEYS.hudMinimized, minimized ? "1" : "0");
      syncFxHudFab();
    }

    function setFxFullscreen(open) {
      if (!open) cancelPlacement();
      elFxFullscreen.classList.toggle("open", !!open);
      elFxFullscreen.setAttribute("aria-hidden", open ? "false" : "true");
      if (elAnimatorStageWrap) elAnimatorStageWrap.classList.toggle("is-hidden", !!open);
      if (open) {
        // 每次进入全屏都从干净状态开始，避免残留遮罩拦截交互。
        closeInteractionModal();
      }
      if (!open) {
        animator._interactionNearbyActions = [];
        animator._interactionDetailText = "";
        animator.codexOpen = false;
        if (animator.buildingEdit) animator.buildingEdit.armed = false;
        closeInteractionModal();
      }
      syncPlacementUi();
      syncFxHudFab();
      renderFxInteractionMenu();
      renderFxCodexPanel();
      if (open) syncFxHotbarUi();
    }

    let fxStageW = 1280;
    let fxStageH = 720;

    /** 与 drawAnimator 里横屏舞台一致：放大世界尺度，使反算地面与画面透视一致 */
    function getFxStageScaleMul() {
      const w = fxStageW || 1280;
      return Math.max(1.6, Math.min(6.0, w / 240));
    }

    function resizeFxBigCanvasToViewport() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      // 固定横屏比例：使用容器实际尺寸，避免不同窗口比例下被挤变形
      const wrap = elFxFullscreen.querySelector(".fx-wrap");
      const rect = wrap ? wrap.getBoundingClientRect() : null;
      const w = Math.max(320, Math.floor((rect ? rect.width : 1280)));
      const h = Math.max(240, Math.floor((rect ? rect.height : 720)));
      fxStageW = w;
      fxStageH = h;
      animator.stageCanvas.width = w;
      animator.stageCanvas.height = h;
      elFxBigCanvas.width = Math.floor(w * dpr);
      elFxBigCanvas.height = Math.floor(h * dpr);
      fxBigCtx.imageSmoothingEnabled = false;
      fxBigCtx.setTransform(1, 0, 0, 1, 0, 0);
    }

    const FX_KEYS = {
      horizonY: "pixelwf_fx_horizonY",
      cameraHeight: "pixelwf_fx_cameraHeight",
      forwardScale: "pixelwf_fx_forwardScale",
      spanBase: "pixelwf_fx_spanBase",
      spanScale: "pixelwf_fx_spanScale",
      worldScale: "pixelwf_fx_worldScale",
      targetCharPx: "pixelwf_fx_targetCharPx",
      renderRadiusWorld: "pixelwf_fx_renderRadiusWorld",
      buildingSinkTransitionWorld: "pixelwf_fx_buildingSinkTransitionWorld",
      buildingRenderMode: "pixelwf_fx_buildingRenderMode",
      groundSkew: "pixelwf_fx_groundSkew",
      tilt: "pixelwf_fx_tilt",
      viewOffsetY: "pixelwf_fx_viewOffsetY",
      enableTiltShiftFx: "pixelwf_fx_enableTiltShiftFx",
      tiltShiftFocusCenterOffset: "pixelwf_fx_tiltShiftFocusCenterOffset",
      tiltShiftFocusHalfRatio: "pixelwf_fx_tiltShiftFocusHalfRatio",
      tiltShiftFadeRatio: "pixelwf_fx_tiltShiftFadeRatio",
      tiltShiftBlurStrength: "pixelwf_fx_tiltShiftBlurStrength",
      tiltShiftRenderScale: "pixelwf_fx_tiltShiftRenderScale",
      tiltShiftGlowStrength: "pixelwf_fx_tiltShiftGlowStrength",
      sunFromX: "pixelwf_fx_sunFromX",
      sunFromY: "pixelwf_fx_sunFromY",
      sunShadowStrength: "pixelwf_fx_sunShadowStrength",
      sunShadowLength: "pixelwf_fx_sunShadowLength",
      sunContrast: "pixelwf_fx_sunContrast",
      sunWarmth: "pixelwf_fx_sunWarmth",
      sunReflectionStrength: "pixelwf_fx_sunReflectionStrength",
      sunGroundDepthDarkness: "pixelwf_fx_sunGroundDepthDarkness",
      dayNightEnabled: "pixelwf_fx_dayNightEnabled",
      dayNightPaused: "pixelwf_fx_dayNightPaused",
      dayNightDayDurationSec: "pixelwf_fx_dayNightDayDurationSec",
      dayNightNightDurationSec: "pixelwf_fx_dayNightNightDurationSec",
      dayNightDayWarmth: "pixelwf_fx_dayNightDayWarmth",
      dayNightNightWarmth: "pixelwf_fx_dayNightNightWarmth",
      dayNightDayShadowLength: "pixelwf_fx_dayNightDayShadowLength",
      dayNightNightShadowLength: "pixelwf_fx_dayNightNightShadowLength",
      dayNightShadowRotateRangeDeg: "pixelwf_fx_dayNightShadowRotateRangeDeg",
      dayNightTimeScale: "pixelwf_fx_dayNightTimeScale",
      dayNightCurrentTimeSec: "pixelwf_fx_dayNightCurrentTimeSec",
      showCollisionDebug: "pixelwf_fx_showCollisionDebug",
      hudHidden: "pixelwf_fx_hudHidden",
      hudMinimized: "pixelwf_fx_hudMinimized",
    };
    const RESOURCE_DROP_MODEL = "gpt-5.4-mini";
    // 资源掉落 icon：统一走火山 Ark（豆包 Seedream 5）
    const RESOURCE_DROP_ICON_ARK_MODEL = "doubao-seedream-5-0-260128";
    const _resourceDropRequestByKey = new Map();
    const _resourceIconRequestByName = new Map();
    const _facilityProfileRequestByKey = new Map();
    const _facilityRecipeRequestByKey = new Map();
    const _facilityJobTimerByKey = new Map();
    const ITEM_ICON_RETRY_BASE_MS = 60 * 1000;
    const ITEM_ICON_RETRY_MAX_MS = 10 * 60 * 1000;

    function clampNumber(v, lo, hi) {
      const n = Number(v);
      if (!Number.isFinite(n)) return lo;
      return Math.max(lo, Math.min(hi, n));
    }

    function lerpNumber(a, b, t) {
      return a + (b - a) * t;
    }

    function smoothStep01(t) {
      const x = clampNumber(t, 0, 1);
      return x * x * (3 - 2 * x);
    }

    function wrapCycleTimeSec(timeSec, totalSec) {
      const total = Math.max(0.001, Number(totalSec) || 0);
      const t = Number(timeSec) || 0;
      return ((t % total) + total) % total;
    }

    function getDayNightCycle() {
      if (!animator.dayNightCycle) {
        animator.dayNightCycle = {
          enabled: true,
          paused: false,
          dayDurationSec: 360,
          nightDurationSec: 240,
          dayAmbientDarkness: 0.02,
          nightAmbientDarkness: 0.58,
          dayWarmth: 0.18,
          nightWarmth: 0.02,
          dayShadowLength: 0.55,
          nightShadowLength: 1.18,
          shadowRotateRangeDeg: 78,
          timeScale: 1,
          currentTimeSec: 0,
          transitionRatio: 0.15,
          _lastBakeAtMs: 0,
          _lastBakeFromX: NaN,
          _lastBakeFromY: NaN,
          _lastBakeShadowLength: NaN,
          _lastUiSyncAtMs: 0,
        };
      }
      return animator.dayNightCycle;
    }

    function getDayNightTotalDurationSec(cycle = getDayNightCycle()) {
      return Math.max(30, Number(cycle.dayDurationSec) || 0) + Math.max(30, Number(cycle.nightDurationSec) || 0);
    }

    function getDayNightTimePercent(cycle = getDayNightCycle()) {
      const total = getDayNightTotalDurationSec(cycle);
      return (wrapCycleTimeSec(cycle.currentTimeSec, total) / total) * 100;
    }

    function setDayNightTimePercent(percent) {
      const cycle = getDayNightCycle();
      const total = getDayNightTotalDurationSec(cycle);
      cycle.currentTimeSec = wrapCycleTimeSec((clampNumber(percent, 0, 100) / 100) * total, total);
    }

    function applyZhuYuanzhangEmbedPlaybackPreset() {
      if (!isEmbeddedEngine) return;
      const requestedSceneId = sanitizeSceneId(requestedSceneIdRaw);
      if (requestedSceneId !== "zyz_haozhou" && !/^zyz_[a-z0-9_]+_city$/i.test(requestedSceneId)) return;

      animator.horizonY = 0;
      animator.cameraHeight = 8;
      animator.forwardScale = 1600;
      animator.spanBase = 320;
      animator.spanScale = 2000;
      animator.worldScale = 0.8;
      animator.targetCharPx = 39;
      animator.renderRadiusWorld = 120;
      animator.buildingSinkTransitionWorld = 8;
      animator.tilt = 0.25;
      animator.viewOffsetY = 24;
      animator.enableTiltShiftFx = true;
      animator.tiltShiftFocusCenterOffset = -89;
      animator.tiltShiftFocusHalfRatio = 0.35;
      animator.tiltShiftFadeRatio = 0.31;
      animator.showCollisionDebug = false;
      animator.sunLighting.shadowStrength = 4;
      animator.sunLighting.shadowLength = 0.55;
      animator.sunLighting.contrast = 1.51;
      animator.sunLighting.warmth = 0.18;
      animator.sunLighting.reflectionStrength = 1.25;
      animator.sunLighting.groundDepthDarkness = 1;

      const cycle = getDayNightCycle();
      cycle.enabled = true;
      cycle.paused = false;
      cycle.dayDurationSec = 360;
      cycle.nightDurationSec = 240;
      cycle.dayWarmth = 0.18;
      cycle.nightWarmth = 0.02;
      cycle.dayShadowLength = 0.55;
      cycle.nightShadowLength = 1.18;
      cycle.shadowRotateRangeDeg = 78;
      cycle.timeScale = 1;
      setDayNightTimePercent(49.6);
      cycle._lastBakeAtMs = 0;
      cycle._lastBakeFromX = NaN;
      cycle._lastBakeFromY = NaN;
      cycle._lastBakeShadowLength = NaN;
      invalidateSceneLightingBake();
      applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: false });
      animator.sunLighting.fromX = 0.43;
      animator.sunLighting.fromY = -0.9;
      animator.sunLighting.shadowX = -0.43;
      animator.sunLighting.shadowY = 0.9;
      invalidateSceneLightingBake();
      clampAnimatorFxParams();
    }

    function clampDayNightCycleParams() {
      const cycle = getDayNightCycle();
      cycle.enabled = !!cycle.enabled;
      cycle.paused = !!cycle.paused;
      cycle.dayDurationSec = clampNumber(cycle.dayDurationSec == null ? 360 : cycle.dayDurationSec, 30, 7200);
      cycle.nightDurationSec = clampNumber(cycle.nightDurationSec == null ? 240 : cycle.nightDurationSec, 30, 7200);
      cycle.dayAmbientDarkness = clampNumber(cycle.dayAmbientDarkness == null ? 0.02 : cycle.dayAmbientDarkness, 0, 1);
      cycle.nightAmbientDarkness = clampNumber(cycle.nightAmbientDarkness == null ? 0.58 : cycle.nightAmbientDarkness, 0, 1);
      cycle.dayWarmth = clampNumber(cycle.dayWarmth == null ? 0.18 : cycle.dayWarmth, 0, 2);
      cycle.nightWarmth = clampNumber(cycle.nightWarmth == null ? 0.02 : cycle.nightWarmth, 0, 2);
      cycle.dayShadowLength = clampNumber(cycle.dayShadowLength == null ? 0.55 : cycle.dayShadowLength, 0.05, 8);
      cycle.nightShadowLength = clampNumber(cycle.nightShadowLength == null ? 1.18 : cycle.nightShadowLength, 0.05, 8);
      cycle.shadowRotateRangeDeg = clampNumber(cycle.shadowRotateRangeDeg == null ? 78 : cycle.shadowRotateRangeDeg, 10, 170);
      cycle.timeScale = clampNumber(cycle.timeScale == null ? 1 : cycle.timeScale, 0.1, 20);
      cycle.transitionRatio = clampNumber(cycle.transitionRatio == null ? 0.15 : cycle.transitionRatio, 0.05, 0.45);
      cycle.currentTimeSec = wrapCycleTimeSec(cycle.currentTimeSec, getDayNightTotalDurationSec(cycle));
      cycle._lastBakeAtMs = Math.max(0, Number(cycle._lastBakeAtMs) || 0);
      cycle._lastUiSyncAtMs = Math.max(0, Number(cycle._lastUiSyncAtMs) || 0);
    }

    function sampleDayNightCycle(cycle = getDayNightCycle()) {
      clampDayNightCycleParams();
      const dayDur = cycle.dayDurationSec;
      const nightDur = cycle.nightDurationSec;
      const total = dayDur + nightDur;
      const timeSec = wrapCycleTimeSec(cycle.currentTimeSec, total);
      const dawnDur = Math.min(dayDur * 0.5, Math.max(1, dayDur * cycle.transitionRatio));
      const duskDur = dawnDur;
      let dayMix = 0;
      let phaseLabel = "night";
      let sunProgress = 0;

      if (timeSec < dayDur) {
        sunProgress = dayDur > 0 ? (timeSec / dayDur) : 0;
        const dawnEnd = dawnDur;
        const duskStart = Math.max(dawnEnd, dayDur - duskDur);
        if (timeSec < dawnEnd) {
          dayMix = smoothStep01(timeSec / Math.max(1, dawnEnd));
          phaseLabel = "dawn";
        } else if (timeSec < duskStart) {
          dayMix = 1;
          phaseLabel = "day";
        } else {
          dayMix = 1 - smoothStep01((timeSec - duskStart) / Math.max(1, dayDur - duskStart));
          phaseLabel = "dusk";
        }
      } else {
        const nightProgress = nightDur > 0 ? ((timeSec - dayDur) / nightDur) : 0;
        sunProgress = 1 - clampNumber(nightProgress, 0, 1);
        phaseLabel = "night";
      }

      const halfSweepDeg = cycle.shadowRotateRangeDeg * 0.5;
      const angleDeg = (-90 - halfSweepDeg) + cycle.shadowRotateRangeDeg * clampNumber(sunProgress, 0, 1);
      const angleRad = angleDeg * (Math.PI / 180);
      const fromX = Math.cos(angleRad);
      const fromY = Math.sin(angleRad);
      return {
        phaseLabel,
        dayMix,
        timePercent: getDayNightTimePercent(cycle),
        fromX,
        fromY,
        ambientDarkness: lerpNumber(cycle.nightAmbientDarkness, cycle.dayAmbientDarkness, dayMix),
        warmth: lerpNumber(cycle.nightWarmth, cycle.dayWarmth, dayMix),
        shadowLength: lerpNumber(cycle.nightShadowLength, cycle.dayShadowLength, dayMix),
      };
    }

    function syncDayNightUiState() {
      const cycle = getDayNightCycle();
      const autoEnabled = !!cycle.enabled;
      [
        fxCtrlSunX,
        fxCtrlSunY,
        fxCtrlShadowLength,
        fxCtrlWarmth,
        fxNumSunX,
        fxNumSunY,
        fxNumShadowLength,
        fxNumWarmth,
      ].forEach((el) => {
        if (el) el.disabled = autoEnabled;
      });
      if (fxToggleDayNight) fxToggleDayNight.checked = autoEnabled;
      if (fxToggleDayNightPause) fxToggleDayNightPause.checked = !!cycle.paused;
    }

    function applyDayNightCycle(ts, dt, options = {}) {
      const cycle = getDayNightCycle();
      clampDayNightCycleParams();
      if (!cycle.enabled) {
        animator.sunLighting.ambientDarkness = 0;
        if (options.syncUi) syncDayNightUiState();
        if (fxDayNightStatus) fxDayNightStatus.textContent = "manual lighting";
        return null;
      }
      if (!cycle.paused && !options.preserveTime) {
        cycle.currentTimeSec = wrapCycleTimeSec(
          cycle.currentTimeSec + (Math.max(0, Number(dt) || 0) / 1000) * cycle.timeScale,
          getDayNightTotalDurationSec(cycle)
        );
      }
      const sample = sampleDayNightCycle(cycle);
      animator.sunLighting.fromX = sample.fromX;
      animator.sunLighting.fromY = sample.fromY;
      animator.sunLighting.ambientDarkness = sample.ambientDarkness;
      animator.sunLighting.warmth = sample.warmth;
      animator.sunLighting.shadowLength = sample.shadowLength;
      animator.sunLighting.shadowX = -sample.fromX;
      animator.sunLighting.shadowY = -sample.fromY;
      clampAnimatorFxParams();

      const needBake = options.forceBake
        || !Number.isFinite(cycle._lastBakeFromX)
        || Math.abs(cycle._lastBakeFromX - animator.sunLighting.fromX) >= 0.035
        || Math.abs(cycle._lastBakeFromY - animator.sunLighting.fromY) >= 0.035
        || Math.abs(cycle._lastBakeShadowLength - animator.sunLighting.shadowLength) >= 0.04;
      if (needBake && (options.forceBake || (ts - cycle._lastBakeAtMs) >= 140)) {
        cycle._lastBakeAtMs = Math.max(0, Number(ts) || 0);
        cycle._lastBakeFromX = animator.sunLighting.fromX;
        cycle._lastBakeFromY = animator.sunLighting.fromY;
        cycle._lastBakeShadowLength = animator.sunLighting.shadowLength;
        invalidateSceneLightingBake();
      }

      if (fxDayNightStatus) {
        fxDayNightStatus.textContent = `${sample.phaseLabel} | ${sample.timePercent.toFixed(1)}% | ${cycle.currentTimeSec.toFixed(1)}s`;
      }
      if (options.syncUi || (elFxFullscreen.classList.contains("open") && (ts - cycle._lastUiSyncAtMs) >= 150)) {
        cycle._lastUiSyncAtMs = Math.max(0, Number(ts) || 0);
        applyFxPanelValuesFromAnimator();
      }
      return sample;
    }

    function perspectiveScaleAtDepth(z, baseScale, camHeight, strength, focusZ, sMin) {
      const focus = Math.max(0.0001, focusZ);
      let s = baseScale * (camHeight + focus * strength) / Math.max(0.0001, camHeight + z * strength);
      if (!Number.isFinite(s)) s = sMin;
      return Math.max(s, sMin);
    }

    function clampAnimatorFxParams() {
      // 取消“严格上限”，只保留安全上限，避免 NaN/负数/爆炸
      clampDayNightCycleParams();
      animator.horizonY = clampNumber(animator.horizonY, 0, 10000);
      animator.cameraHeight = clampNumber(animator.cameraHeight, 1, 10000);
      animator.forwardScale = clampNumber(animator.forwardScale, 1, 1e9);
      animator.spanBase = clampNumber(animator.spanBase, 1, 1e9);
      animator.spanScale = clampNumber(animator.spanScale, 0, 1e9);
      animator.worldScale = clampNumber(animator.worldScale, 0.01, 1e6);
      animator.targetCharPx = clampNumber(animator.targetCharPx, 1, 1e6);
      // 渲染半径不设硬上限，只保留最小值保护。
      animator.renderRadiusWorld = Math.max(10, Number(animator.renderRadiusWorld) || 10);
      animator.buildingSinkTransitionWorld = clampNumber(animator.buildingSinkTransitionWorld == null ? 25 : animator.buildingSinkTransitionWorld, 1, 1e6);
      animator.groundSkew = clampNumber(animator.groundSkew, -1000, 1000);
      animator.tilt = clampNumber(animator.tilt, 0.01, 1000);
      animator.viewOffsetY = clampNumber(animator.viewOffsetY, -1e6, 1e6);
      animator.tiltShiftFocusCenterOffset = clampNumber(animator.tiltShiftFocusCenterOffset, -1e6, 1e6);
      animator.tiltShiftFocusHalfRatio = clampNumber(animator.tiltShiftFocusHalfRatio, 0.001, 10);
      animator.tiltShiftFadeRatio = clampNumber(animator.tiltShiftFadeRatio, 0.001, 10);
      animator.tiltShiftBlurStrength = clampNumber(animator.tiltShiftBlurStrength == null ? 1 : animator.tiltShiftBlurStrength, 0, 4);
      animator.tiltShiftRenderScale = clampNumber(animator.tiltShiftRenderScale == null ? 0.5 : animator.tiltShiftRenderScale, 0.25, 1);
      animator.tiltShiftGlowStrength = clampNumber(animator.tiltShiftGlowStrength == null ? 0.18 : animator.tiltShiftGlowStrength, 0, 1);
      if (!animator.sunLighting) animator.sunLighting = {};
      animator.sunLighting.fromX = clampNumber(animator.sunLighting.fromX, -1, 1);
      animator.sunLighting.fromY = clampNumber(animator.sunLighting.fromY, -1, 1);
      if (Math.hypot(animator.sunLighting.fromX, animator.sunLighting.fromY) < 0.01) {
        animator.sunLighting.fromX = -0.56;
        animator.sunLighting.fromY = -0.83;
      }
      animator.sunLighting.shadowX = -animator.sunLighting.fromX;
      animator.sunLighting.shadowY = -animator.sunLighting.fromY;
      animator.sunLighting.ambientDarkness = clampNumber(animator.sunLighting.ambientDarkness == null ? 0 : animator.sunLighting.ambientDarkness, 0, 1);
      animator.sunLighting.shadowStrength = clampNumber(animator.sunLighting.shadowStrength, 0, 4);
      animator.sunLighting.shadowLength = clampNumber(animator.sunLighting.shadowLength == null ? 0.55 : animator.sunLighting.shadowLength, 0.05, 8);
      animator.sunLighting.contrast = clampNumber(animator.sunLighting.contrast == null ? 1 : animator.sunLighting.contrast, 0, 8);
      animator.sunLighting.warmth = clampNumber(animator.sunLighting.warmth, 0, 2);
      animator.sunLighting.reflectionStrength = clampNumber(animator.sunLighting.reflectionStrength, 0, 2);
      animator.sunLighting.groundDepthDarkness = clampNumber(
        animator.sunLighting.groundDepthDarkness == null ? 0.18 : animator.sunLighting.groundDepthDarkness,
        0,
        2
      );
    }

    function applyFxPanelValuesFromAnimator() {
      if (!fxCtrlHorizon) return;
      clampAnimatorFxParams();
      // 如果数值超过滑条上限，自动抬高上限（滑条不再“卡死”）
      const bumpMax = (rangeEl, value, minMax) => {
        if (!rangeEl) return;
        const cur = Number(rangeEl.max);
        if (!Number.isFinite(cur)) return;
        if (value > cur) rangeEl.max = String(Math.max(value, cur * 1.25, minMax || value));
      };

      bumpMax(fxCtrlHorizon, animator.horizonY, 360);
      bumpMax(fxCtrlCamH, animator.cameraHeight, 60);
      bumpMax(fxCtrlForward, animator.forwardScale, 1600);
      bumpMax(fxCtrlCamDist, animator.spanBase, 400);
      bumpMax(fxCtrlStrength, animator.spanScale, 2000);
      bumpMax(fxCtrlWorldScale, animator.worldScale, 1.40);
      bumpMax(fxCtrlCharPx, animator.targetCharPx, 52);
      bumpMax(fxCtrlRadius, animator.renderRadiusWorld, 2000);
      bumpMax(fxCtrlSinkTiles, animator.buildingSinkTransitionWorld, 200);
      bumpMax(fxCtrlSkew, animator.tilt, 2.5);
      bumpMax(fxCtrlViewY, Math.abs(animator.viewOffsetY), 500);
      bumpMax(fxCtrlFocusCenter, Math.abs(animator.tiltShiftFocusCenterOffset), 320);
      bumpMax(fxCtrlFocusHalf, animator.tiltShiftFocusHalfRatio, 0.48);
      bumpMax(fxCtrlFade, animator.tiltShiftFadeRatio, 0.48);
      bumpMax(fxCtrlTiltShiftBlur, animator.tiltShiftBlurStrength, 2.5);
      bumpMax(fxCtrlTiltShiftRenderScale, animator.tiltShiftRenderScale, 1);
      bumpMax(fxCtrlTiltShiftGlow, animator.tiltShiftGlowStrength, 0.5);
      bumpMax(fxCtrlShadowStrength, animator.sunLighting.shadowStrength, 1.5);
      bumpMax(fxCtrlShadowLength, animator.sunLighting.shadowLength, 2);
      bumpMax(fxCtrlLightContrast, animator.sunLighting.contrast, 2.5);
      bumpMax(fxCtrlWarmth, animator.sunLighting.warmth, 0.5);
      bumpMax(fxCtrlReflection, animator.sunLighting.reflectionStrength, 0.6);
      bumpMax(fxCtrlGroundDepthDark, animator.sunLighting.groundDepthDarkness, 0.8);
      const cycle = getDayNightCycle();
      bumpMax(fxCtrlDayDuration, cycle.dayDurationSec, 1200);
      bumpMax(fxCtrlNightDuration, cycle.nightDurationSec, 1200);
      bumpMax(fxCtrlDayWarmth, cycle.dayWarmth, 0.5);
      bumpMax(fxCtrlNightWarmth, cycle.nightWarmth, 0.5);
      bumpMax(fxCtrlDayShadowLength, cycle.dayShadowLength, 2);
      bumpMax(fxCtrlNightShadowLength, cycle.nightShadowLength, 2);
      bumpMax(fxCtrlShadowRotateRange, cycle.shadowRotateRangeDeg, 160);
      bumpMax(fxCtrlDayNightTimeScale, cycle.timeScale, 8);

      // 不做“矫正格式化”：尽量保留用户输入的精度
      fxCtrlHorizon.value = String(animator.horizonY);
      fxCtrlCamH.value = String(animator.cameraHeight);
      fxCtrlForward.value = String(animator.forwardScale);
      fxCtrlCamDist.value = String(animator.spanBase);
      fxCtrlStrength.value = String(animator.spanScale);
      fxCtrlWorldScale.value = String(animator.worldScale);
      fxCtrlCharPx.value = String(animator.targetCharPx);
      fxCtrlRadius.value = String(animator.renderRadiusWorld);
      if (fxCtrlSinkTiles) fxCtrlSinkTiles.value = String(animator.buildingSinkTransitionWorld);
      fxCtrlSkew.value = String(animator.tilt);
      fxCtrlViewY.value = String(animator.viewOffsetY);
      fxCtrlFocusCenter.value = String(animator.tiltShiftFocusCenterOffset);
      fxCtrlFocusHalf.value = String(animator.tiltShiftFocusHalfRatio);
      fxCtrlFade.value = String(animator.tiltShiftFadeRatio);
      if (fxCtrlTiltShiftBlur) fxCtrlTiltShiftBlur.value = String(animator.tiltShiftBlurStrength);
      if (fxCtrlTiltShiftRenderScale) fxCtrlTiltShiftRenderScale.value = String(animator.tiltShiftRenderScale);
      if (fxCtrlTiltShiftGlow) fxCtrlTiltShiftGlow.value = String(animator.tiltShiftGlowStrength);
      if (fxCtrlSunX) fxCtrlSunX.value = String(animator.sunLighting.fromX);
      if (fxCtrlSunY) fxCtrlSunY.value = String(animator.sunLighting.fromY);
      if (fxCtrlShadowStrength) fxCtrlShadowStrength.value = String(animator.sunLighting.shadowStrength);
      if (fxCtrlShadowLength) fxCtrlShadowLength.value = String(animator.sunLighting.shadowLength);
      if (fxCtrlLightContrast) fxCtrlLightContrast.value = String(animator.sunLighting.contrast);
      if (fxCtrlWarmth) fxCtrlWarmth.value = String(animator.sunLighting.warmth);
      if (fxCtrlReflection) fxCtrlReflection.value = String(animator.sunLighting.reflectionStrength);
      if (fxCtrlGroundDepthDark) fxCtrlGroundDepthDark.value = String(animator.sunLighting.groundDepthDarkness);
      if (fxCtrlDayDuration) fxCtrlDayDuration.value = String(cycle.dayDurationSec);
      if (fxCtrlNightDuration) fxCtrlNightDuration.value = String(cycle.nightDurationSec);
      if (fxCtrlDayWarmth) fxCtrlDayWarmth.value = String(cycle.dayWarmth);
      if (fxCtrlNightWarmth) fxCtrlNightWarmth.value = String(cycle.nightWarmth);
      if (fxCtrlDayShadowLength) fxCtrlDayShadowLength.value = String(cycle.dayShadowLength);
      if (fxCtrlNightShadowLength) fxCtrlNightShadowLength.value = String(cycle.nightShadowLength);
      if (fxCtrlShadowRotateRange) fxCtrlShadowRotateRange.value = String(cycle.shadowRotateRangeDeg);
      if (fxCtrlDayNightTimeScale) fxCtrlDayNightTimeScale.value = String(cycle.timeScale);
      if (fxCtrlDayNightCurrentTime) fxCtrlDayNightCurrentTime.value = String(getDayNightTimePercent(cycle));

      fxValHorizon.textContent = fxCtrlHorizon.value;
      fxValCamH.textContent = fxCtrlCamH.value;
      fxValForward.textContent = fxCtrlForward.value;
      fxValCamDist.textContent = fxCtrlCamDist.value;
      fxValStrength.textContent = fxCtrlStrength.value;
      fxValWorldScale.textContent = fxCtrlWorldScale.value;
      fxValCharPx.textContent = fxCtrlCharPx.value;
      fxValRadius.textContent = fxCtrlRadius.value;
      if (fxValSinkTiles) fxValSinkTiles.textContent = fxCtrlSinkTiles.value;
      fxValSkew.textContent = fxCtrlSkew.value;
      fxValViewY.textContent = fxCtrlViewY.value;
      fxValFocusCenter.textContent = fxCtrlFocusCenter.value;
      fxValFocusHalf.textContent = fxCtrlFocusHalf.value;
      fxValFade.textContent = fxCtrlFade.value;
      if (fxValTiltShiftBlur && fxCtrlTiltShiftBlur) fxValTiltShiftBlur.textContent = fxCtrlTiltShiftBlur.value;
      if (fxValTiltShiftRenderScale && fxCtrlTiltShiftRenderScale) fxValTiltShiftRenderScale.textContent = fxCtrlTiltShiftRenderScale.value;
      if (fxValTiltShiftGlow && fxCtrlTiltShiftGlow) fxValTiltShiftGlow.textContent = fxCtrlTiltShiftGlow.value;
      if (fxValSunX) fxValSunX.textContent = fxCtrlSunX.value;
      if (fxValSunY) fxValSunY.textContent = fxCtrlSunY.value;
      if (fxValShadowStrength) fxValShadowStrength.textContent = fxCtrlShadowStrength.value;
      if (fxValShadowLength) fxValShadowLength.textContent = fxCtrlShadowLength.value;
      if (fxValLightContrast) fxValLightContrast.textContent = fxCtrlLightContrast.value;
      if (fxValWarmth) fxValWarmth.textContent = fxCtrlWarmth.value;
      if (fxValReflection) fxValReflection.textContent = fxCtrlReflection.value;
      if (fxValGroundDepthDark) fxValGroundDepthDark.textContent = fxCtrlGroundDepthDark.value;
      if (fxValDayDuration) fxValDayDuration.textContent = fxCtrlDayDuration.value;
      if (fxValNightDuration) fxValNightDuration.textContent = fxCtrlNightDuration.value;
      if (fxValDayWarmth) fxValDayWarmth.textContent = fxCtrlDayWarmth.value;
      if (fxValNightWarmth) fxValNightWarmth.textContent = fxCtrlNightWarmth.value;
      if (fxValDayShadowLength) fxValDayShadowLength.textContent = fxCtrlDayShadowLength.value;
      if (fxValNightShadowLength) fxValNightShadowLength.textContent = fxCtrlNightShadowLength.value;
      if (fxValShadowRotateRange) fxValShadowRotateRange.textContent = fxCtrlShadowRotateRange.value;
      if (fxValDayNightTimeScale) fxValDayNightTimeScale.textContent = fxCtrlDayNightTimeScale.value;
      if (fxValDayNightCurrentTime) fxValDayNightCurrentTime.textContent = fxCtrlDayNightCurrentTime.value;

      if (fxNumHorizon) fxNumHorizon.value = fxCtrlHorizon.value;
      if (fxNumCamH) fxNumCamH.value = fxCtrlCamH.value;
      if (fxNumForward) fxNumForward.value = fxCtrlForward.value;
      if (fxNumCamDist) fxNumCamDist.value = fxCtrlCamDist.value;
      if (fxNumStrength) fxNumStrength.value = fxCtrlStrength.value;
      if (fxNumWorldScale) fxNumWorldScale.value = fxCtrlWorldScale.value;
      if (fxNumCharPx) fxNumCharPx.value = fxCtrlCharPx.value;
      if (fxNumRadius) fxNumRadius.value = fxCtrlRadius.value;
      if (fxNumSinkTiles) fxNumSinkTiles.value = fxCtrlSinkTiles.value;
      if (fxNumSkew) fxNumSkew.value = fxCtrlSkew.value;
      if (fxNumViewY) fxNumViewY.value = fxCtrlViewY.value;
      if (fxNumFocusCenter) fxNumFocusCenter.value = fxCtrlFocusCenter.value;
      if (fxNumFocusHalf) fxNumFocusHalf.value = fxCtrlFocusHalf.value;
      if (fxNumFade) fxNumFade.value = fxCtrlFade.value;
      if (fxNumTiltShiftBlur && fxCtrlTiltShiftBlur) fxNumTiltShiftBlur.value = fxCtrlTiltShiftBlur.value;
      if (fxNumTiltShiftRenderScale && fxCtrlTiltShiftRenderScale) fxNumTiltShiftRenderScale.value = fxCtrlTiltShiftRenderScale.value;
      if (fxNumTiltShiftGlow && fxCtrlTiltShiftGlow) fxNumTiltShiftGlow.value = fxCtrlTiltShiftGlow.value;
      if (fxNumSunX) fxNumSunX.value = fxCtrlSunX.value;
      if (fxNumSunY) fxNumSunY.value = fxCtrlSunY.value;
      if (fxNumShadowStrength) fxNumShadowStrength.value = fxCtrlShadowStrength.value;
      if (fxNumShadowLength) fxNumShadowLength.value = fxCtrlShadowLength.value;
      if (fxNumLightContrast) fxNumLightContrast.value = fxCtrlLightContrast.value;
      if (fxNumWarmth) fxNumWarmth.value = fxCtrlWarmth.value;
      if (fxNumReflection) fxNumReflection.value = fxCtrlReflection.value;
      if (fxNumGroundDepthDark) fxNumGroundDepthDark.value = fxCtrlGroundDepthDark.value;
      if (fxNumDayDuration) fxNumDayDuration.value = fxCtrlDayDuration.value;
      if (fxNumNightDuration) fxNumNightDuration.value = fxCtrlNightDuration.value;
      if (fxNumDayWarmth) fxNumDayWarmth.value = fxCtrlDayWarmth.value;
      if (fxNumNightWarmth) fxNumNightWarmth.value = fxCtrlNightWarmth.value;
      if (fxNumDayShadowLength) fxNumDayShadowLength.value = fxCtrlDayShadowLength.value;
      if (fxNumNightShadowLength) fxNumNightShadowLength.value = fxCtrlNightShadowLength.value;
      if (fxNumShadowRotateRange) fxNumShadowRotateRange.value = fxCtrlShadowRotateRange.value;
      if (fxNumDayNightTimeScale) fxNumDayNightTimeScale.value = fxCtrlDayNightTimeScale.value;
      if (fxNumDayNightCurrentTime) fxNumDayNightCurrentTime.value = fxCtrlDayNightCurrentTime.value;
      syncDayNightUiState();
      if (fxToggleTiltShift) fxToggleTiltShift.checked = !!animator.enableTiltShiftFx;
      if (fxToggleCollisionDebug) fxToggleCollisionDebug.checked = !!animator.showCollisionDebug;
    }

    function bindFxPanel() {
      if (!fxCtrlHorizon) return;
      const setSunAxis = (axis, value) => {
        if (!animator.sunLighting) animator.sunLighting = {};
        animator.sunLighting[axis] = Number(value);
        clampAnimatorFxParams();
        invalidateSceneLightingBake();
      };
      const setShadowLength = (value) => {
        if (!animator.sunLighting) animator.sunLighting = {};
        animator.sunLighting.shadowLength = Number(value);
        clampAnimatorFxParams();
        invalidateSceneLightingBake();
      };
      const setDayNightField = (field, value, opts = {}) => {
        const cycle = getDayNightCycle();
        cycle[field] = opts.boolean ? !!value : Number(value);
        clampAnimatorFxParams();
        applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: true });
      };
      const setDayNightTimeInput = (value) => {
        setDayNightTimePercent(Number(value));
        clampAnimatorFxParams();
        applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: true });
      };
      const binds = [
        [fxCtrlHorizon, fxValHorizon, (v) => animator.horizonY = Number(v)],
        [fxCtrlCamH, fxValCamH, (v) => animator.cameraHeight = Number(v)],
        [fxCtrlForward, fxValForward, (v) => animator.forwardScale = Number(v)],
        [fxCtrlCamDist, fxValCamDist, (v) => animator.spanBase = Number(v)],
        [fxCtrlStrength, fxValStrength, (v) => animator.spanScale = Number(v)],
        [fxCtrlWorldScale, fxValWorldScale, (v) => animator.worldScale = Number(v)],
        [fxCtrlCharPx, fxValCharPx, (v) => animator.targetCharPx = Number(v)],
        [fxCtrlRadius, fxValRadius, (v) => animator.renderRadiusWorld = Number(v)],
        [fxCtrlSinkTiles, fxValSinkTiles, (v) => animator.buildingSinkTransitionWorld = Number(v)],
        [fxCtrlSkew, fxValSkew, (v) => animator.tilt = Number(v)],
        [fxCtrlViewY, fxValViewY, (v) => animator.viewOffsetY = Number(v)],
        [fxCtrlFocusCenter, fxValFocusCenter, (v) => animator.tiltShiftFocusCenterOffset = Number(v)],
        [fxCtrlFocusHalf, fxValFocusHalf, (v) => animator.tiltShiftFocusHalfRatio = Number(v)],
        [fxCtrlFade, fxValFade, (v) => animator.tiltShiftFadeRatio = Number(v)],
        [fxCtrlTiltShiftBlur, fxValTiltShiftBlur, (v) => animator.tiltShiftBlurStrength = Number(v)],
        [fxCtrlTiltShiftRenderScale, fxValTiltShiftRenderScale, (v) => animator.tiltShiftRenderScale = Number(v)],
        [fxCtrlTiltShiftGlow, fxValTiltShiftGlow, (v) => animator.tiltShiftGlowStrength = Number(v)],
        [fxCtrlSunX, fxValSunX, (v) => setSunAxis("fromX", v)],
        [fxCtrlSunY, fxValSunY, (v) => setSunAxis("fromY", v)],
        [fxCtrlShadowStrength, fxValShadowStrength, (v) => animator.sunLighting.shadowStrength = Number(v)],
        [fxCtrlShadowLength, fxValShadowLength, (v) => setShadowLength(v)],
        [fxCtrlLightContrast, fxValLightContrast, (v) => animator.sunLighting.contrast = Number(v)],
        [fxCtrlWarmth, fxValWarmth, (v) => animator.sunLighting.warmth = Number(v)],
        [fxCtrlReflection, fxValReflection, (v) => animator.sunLighting.reflectionStrength = Number(v)],
        [fxCtrlGroundDepthDark, fxValGroundDepthDark, (v) => animator.sunLighting.groundDepthDarkness = Number(v)],
        [fxCtrlDayDuration, fxValDayDuration, (v) => setDayNightField("dayDurationSec", v)],
        [fxCtrlNightDuration, fxValNightDuration, (v) => setDayNightField("nightDurationSec", v)],
        [fxCtrlDayWarmth, fxValDayWarmth, (v) => setDayNightField("dayWarmth", v)],
        [fxCtrlNightWarmth, fxValNightWarmth, (v) => setDayNightField("nightWarmth", v)],
        [fxCtrlDayShadowLength, fxValDayShadowLength, (v) => setDayNightField("dayShadowLength", v)],
        [fxCtrlNightShadowLength, fxValNightShadowLength, (v) => setDayNightField("nightShadowLength", v)],
        [fxCtrlShadowRotateRange, fxValShadowRotateRange, (v) => setDayNightField("shadowRotateRangeDeg", v)],
        [fxCtrlDayNightTimeScale, fxValDayNightTimeScale, (v) => setDayNightField("timeScale", v)],
        [fxCtrlDayNightCurrentTime, fxValDayNightCurrentTime, (v) => setDayNightTimeInput(v)],
      ];
      binds.forEach(([input, label, apply]) => {
        if (!input || !label) return;
        const sync = () => {
          label.textContent = input.value;
          apply(input.value);
          clampAnimatorFxParams();
        };
        input.addEventListener("input", sync);
      });
      fxToggleTiltShift?.addEventListener("change", () => {
        animator.enableTiltShiftFx = !!fxToggleTiltShift.checked;
      });

      const bindNum = (numEl, rangeEl, apply, labelEl, minMax) => {
        if (!numEl || !rangeEl) return;
        const syncFromNum = () => {
          const vStr = String(numEl.value ?? "").trim();
          if (vStr === "") return;
          const vNum = Number(vStr);
          if (!Number.isFinite(vNum)) return;

          // 先抬高上限再赋值，避免 range 先行截断导致“被矫正”
          const curMax = Number(rangeEl.max);
          if (Number.isFinite(curMax) && vNum > curMax) {
            rangeEl.max = String(Math.max(vNum, curMax * 1.25, minMax || vNum));
          }

          // 直接写入 animator（不依赖 range 的 step/格式化）
          apply(vNum);
          clampAnimatorFxParams();

          // 更新 UI：range 跟随，label/num 保持用户输入
          rangeEl.value = vStr;
          if (labelEl) labelEl.textContent = vStr;
        };
        numEl.addEventListener("change", syncFromNum);
        numEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter") syncFromNum();
        });
      };
      bindNum(fxNumHorizon, fxCtrlHorizon, (v) => animator.horizonY = v, fxValHorizon, 360);
      bindNum(fxNumCamH, fxCtrlCamH, (v) => animator.cameraHeight = v, fxValCamH, 60);
      bindNum(fxNumForward, fxCtrlForward, (v) => animator.forwardScale = v, fxValForward, 1600);
      bindNum(fxNumCamDist, fxCtrlCamDist, (v) => animator.spanBase = v, fxValCamDist, 400);
      bindNum(fxNumStrength, fxCtrlStrength, (v) => animator.spanScale = v, fxValStrength, 2000);
      bindNum(fxNumWorldScale, fxCtrlWorldScale, (v) => animator.worldScale = v, fxValWorldScale, 1.4);
      bindNum(fxNumCharPx, fxCtrlCharPx, (v) => animator.targetCharPx = v, fxValCharPx, 52);
      bindNum(fxNumRadius, fxCtrlRadius, (v) => animator.renderRadiusWorld = v, fxValRadius, 0);
      bindNum(fxNumSinkTiles, fxCtrlSinkTiles, (v) => animator.buildingSinkTransitionWorld = v, fxValSinkTiles, 200);
      bindNum(fxNumSkew, fxCtrlSkew, (v) => animator.tilt = v, fxValSkew, 2.5);
      bindNum(fxNumViewY, fxCtrlViewY, (v) => animator.viewOffsetY = v, fxValViewY, 500);
      bindNum(fxNumFocusCenter, fxCtrlFocusCenter, (v) => animator.tiltShiftFocusCenterOffset = v, fxValFocusCenter, 320);
      bindNum(fxNumFocusHalf, fxCtrlFocusHalf, (v) => animator.tiltShiftFocusHalfRatio = v, fxValFocusHalf, 0.48);
      bindNum(fxNumFade, fxCtrlFade, (v) => animator.tiltShiftFadeRatio = v, fxValFade, 0.48);
      bindNum(fxNumTiltShiftBlur, fxCtrlTiltShiftBlur, (v) => animator.tiltShiftBlurStrength = v, fxValTiltShiftBlur, 2.5);
      bindNum(fxNumTiltShiftRenderScale, fxCtrlTiltShiftRenderScale, (v) => animator.tiltShiftRenderScale = v, fxValTiltShiftRenderScale, 1);
      bindNum(fxNumTiltShiftGlow, fxCtrlTiltShiftGlow, (v) => animator.tiltShiftGlowStrength = v, fxValTiltShiftGlow, 0.5);
      bindNum(fxNumSunX, fxCtrlSunX, (v) => setSunAxis("fromX", v), fxValSunX, 1);
      bindNum(fxNumSunY, fxCtrlSunY, (v) => setSunAxis("fromY", v), fxValSunY, 1);
      bindNum(fxNumShadowStrength, fxCtrlShadowStrength, (v) => animator.sunLighting.shadowStrength = v, fxValShadowStrength, 1.5);
      bindNum(fxNumShadowLength, fxCtrlShadowLength, (v) => setShadowLength(v), fxValShadowLength, 2);
      bindNum(fxNumLightContrast, fxCtrlLightContrast, (v) => animator.sunLighting.contrast = v, fxValLightContrast, 2.5);
      bindNum(fxNumWarmth, fxCtrlWarmth, (v) => animator.sunLighting.warmth = v, fxValWarmth, 0.5);
      bindNum(fxNumReflection, fxCtrlReflection, (v) => animator.sunLighting.reflectionStrength = v, fxValReflection, 0.6);
      bindNum(fxNumGroundDepthDark, fxCtrlGroundDepthDark, (v) => animator.sunLighting.groundDepthDarkness = v, fxValGroundDepthDark, 0.8);
      bindNum(fxNumDayDuration, fxCtrlDayDuration, (v) => setDayNightField("dayDurationSec", v), fxValDayDuration, 1200);
      bindNum(fxNumNightDuration, fxCtrlNightDuration, (v) => setDayNightField("nightDurationSec", v), fxValNightDuration, 1200);
      bindNum(fxNumDayWarmth, fxCtrlDayWarmth, (v) => setDayNightField("dayWarmth", v), fxValDayWarmth, 0.5);
      bindNum(fxNumNightWarmth, fxCtrlNightWarmth, (v) => setDayNightField("nightWarmth", v), fxValNightWarmth, 0.5);
      bindNum(fxNumDayShadowLength, fxCtrlDayShadowLength, (v) => setDayNightField("dayShadowLength", v), fxValDayShadowLength, 2);
      bindNum(fxNumNightShadowLength, fxCtrlNightShadowLength, (v) => setDayNightField("nightShadowLength", v), fxValNightShadowLength, 2);
      bindNum(fxNumShadowRotateRange, fxCtrlShadowRotateRange, (v) => setDayNightField("shadowRotateRangeDeg", v), fxValShadowRotateRange, 160);
      bindNum(fxNumDayNightTimeScale, fxCtrlDayNightTimeScale, (v) => setDayNightField("timeScale", v), fxValDayNightTimeScale, 8);
      bindNum(fxNumDayNightCurrentTime, fxCtrlDayNightCurrentTime, (v) => setDayNightTimeInput(v), fxValDayNightCurrentTime, 100);

      fxToggleDayNight?.addEventListener("change", () => {
        const cycle = getDayNightCycle();
        cycle.enabled = !!fxToggleDayNight.checked;
        clampAnimatorFxParams();
        applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: true });
        if (!cycle.enabled) applyFxPanelValuesFromAnimator();
      });
      fxToggleDayNightPause?.addEventListener("change", () => {
        const cycle = getDayNightCycle();
        cycle.paused = !!fxToggleDayNightPause.checked;
        applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: true });
      });

      fxBtnSave?.addEventListener("click", () => {
        ls(FX_KEYS.horizonY, String(animator.horizonY));
        ls(FX_KEYS.cameraHeight, String(animator.cameraHeight));
        ls(FX_KEYS.forwardScale, String(animator.forwardScale));
        ls(FX_KEYS.spanBase, String(animator.spanBase));
        ls(FX_KEYS.spanScale, String(animator.spanScale));
        ls(FX_KEYS.worldScale, String(animator.worldScale));
        ls(FX_KEYS.targetCharPx, String(animator.targetCharPx));
        ls(FX_KEYS.renderRadiusWorld, String(animator.renderRadiusWorld));
        ls(FX_KEYS.buildingSinkTransitionWorld, String(animator.buildingSinkTransitionWorld));
        ls(FX_KEYS.buildingRenderMode, String(animator.buildingRenderMode || "textured"));
        ls(FX_KEYS.groundSkew, String(animator.groundSkew));
        ls(FX_KEYS.tilt, String(animator.tilt));
        ls(FX_KEYS.viewOffsetY, String(animator.viewOffsetY));
        ls(FX_KEYS.enableTiltShiftFx, animator.enableTiltShiftFx ? "1" : "0");
        ls(FX_KEYS.tiltShiftFocusCenterOffset, String(animator.tiltShiftFocusCenterOffset));
        ls(FX_KEYS.tiltShiftFocusHalfRatio, String(animator.tiltShiftFocusHalfRatio));
        ls(FX_KEYS.tiltShiftFadeRatio, String(animator.tiltShiftFadeRatio));
        ls(FX_KEYS.tiltShiftBlurStrength, String(animator.tiltShiftBlurStrength));
        ls(FX_KEYS.tiltShiftRenderScale, String(animator.tiltShiftRenderScale));
        ls(FX_KEYS.tiltShiftGlowStrength, String(animator.tiltShiftGlowStrength));
        ls(FX_KEYS.sunFromX, String(animator.sunLighting.fromX));
        ls(FX_KEYS.sunFromY, String(animator.sunLighting.fromY));
        ls(FX_KEYS.sunShadowStrength, String(animator.sunLighting.shadowStrength));
        ls(FX_KEYS.sunShadowLength, String(animator.sunLighting.shadowLength));
        ls(FX_KEYS.sunContrast, String(animator.sunLighting.contrast));
        ls(FX_KEYS.sunWarmth, String(animator.sunLighting.warmth));
        ls(FX_KEYS.sunReflectionStrength, String(animator.sunLighting.reflectionStrength));
        ls(FX_KEYS.sunGroundDepthDarkness, String(animator.sunLighting.groundDepthDarkness));
        ls(FX_KEYS.dayNightEnabled, getDayNightCycle().enabled ? "1" : "0");
        ls(FX_KEYS.dayNightPaused, getDayNightCycle().paused ? "1" : "0");
        ls(FX_KEYS.dayNightDayDurationSec, String(getDayNightCycle().dayDurationSec));
        ls(FX_KEYS.dayNightNightDurationSec, String(getDayNightCycle().nightDurationSec));
        ls(FX_KEYS.dayNightDayWarmth, String(getDayNightCycle().dayWarmth));
        ls(FX_KEYS.dayNightNightWarmth, String(getDayNightCycle().nightWarmth));
        ls(FX_KEYS.dayNightDayShadowLength, String(getDayNightCycle().dayShadowLength));
        ls(FX_KEYS.dayNightNightShadowLength, String(getDayNightCycle().nightShadowLength));
        ls(FX_KEYS.dayNightShadowRotateRangeDeg, String(getDayNightCycle().shadowRotateRangeDeg));
        ls(FX_KEYS.dayNightTimeScale, String(getDayNightCycle().timeScale));
        ls(FX_KEYS.dayNightCurrentTimeSec, String(getDayNightCycle().currentTimeSec));
        ls(FX_KEYS.showCollisionDebug, animator.showCollisionDebug ? "1" : "0");
        const hud = elFxFullscreen.querySelector(".fx-hud");
        ls(FX_KEYS.hudHidden, hud?.classList.contains("is-hidden") ? "1" : "0");
        ls(FX_KEYS.hudMinimized, hud?.classList.contains("is-minimized") ? "1" : "0");
      });

      fxBtnReset?.addEventListener("click", () => {
        animator.horizonY = 0;
        animator.cameraHeight = 60;
        animator.forwardScale = 1310;
        animator.spanBase = 270;
        animator.spanScale = 1500;
        animator.worldScale = 1.21;
        animator.targetCharPx = 42;
        animator.renderRadiusWorld = 1500;
        animator.buildingSinkTransitionWorld = 25;
        animator.buildingRenderMode = "textured";
        animator.groundSkew = 0;
        animator.tilt = 0.25;
        animator.viewOffsetY = -133;
        animator.enableTiltShiftFx = true;
        animator.tiltShiftFocusCenterOffset = 0;
        animator.tiltShiftFocusHalfRatio = 0.12;
        animator.tiltShiftFadeRatio = 0.18;
        animator.tiltShiftBlurStrength = 1;
        animator.tiltShiftRenderScale = 0.5;
        animator.tiltShiftGlowStrength = 0.18;
        animator.sunLighting.fromX = -0.56;
        animator.sunLighting.fromY = -0.83;
        animator.sunLighting.shadowX = 0.56;
        animator.sunLighting.shadowY = 0.83;
        animator.sunLighting.ambientDarkness = 0;
        animator.sunLighting.shadowStrength = 0.62;
        animator.sunLighting.shadowLength = 0.55;
        animator.sunLighting.contrast = 1;
        animator.sunLighting.warmth = 0.14;
        animator.sunLighting.reflectionStrength = 0.18;
        animator.sunLighting.groundDepthDarkness = 0.18;
        const cycle = getDayNightCycle();
        cycle.enabled = true;
        cycle.paused = false;
        cycle.dayDurationSec = 360;
        cycle.nightDurationSec = 240;
        cycle.dayAmbientDarkness = 0.02;
        cycle.nightAmbientDarkness = 0.58;
        cycle.dayWarmth = 0.18;
        cycle.nightWarmth = 0.02;
        cycle.dayShadowLength = 0.55;
        cycle.nightShadowLength = 1.18;
        cycle.shadowRotateRangeDeg = 78;
        cycle.timeScale = 1;
        cycle.currentTimeSec = 0;
        cycle._lastBakeAtMs = 0;
        cycle._lastBakeFromX = NaN;
        cycle._lastBakeFromY = NaN;
        cycle._lastBakeShadowLength = NaN;
        invalidateSceneLightingBake();
        animator.showCollisionDebug = false;
        applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: true });
        applyFxPanelValuesFromAnimator();
        syncPlacementUi();
      });

      const toggleFxHudHidden = () => {
        const hud = elFxFullscreen.querySelector(".fx-hud");
        if (!hud) return;
        setFxHudState(hud.classList.contains("is-hidden") ? "normal" : "hidden");
      };

      fxBtnToggleHud?.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFxHudHidden();
      });
      fxBtnMinimizeHud?.addEventListener("click", (e) => {
        e.stopPropagation();
        const hud = elFxFullscreen.querySelector(".fx-hud");
        if (!hud) return;
        setFxHudState(hud.classList.contains("is-minimized") ? "normal" : "minimized");
      });

      fxBtnHudFab?.addEventListener("click", (e) => {
        e.stopPropagation();
        const hud = elFxFullscreen.querySelector(".fx-hud");
        if (!hud || !hud.classList.contains("is-hidden")) return;
        setFxHudState("normal");
      });

      const nudgeViewY = (delta) => {
        animator.viewOffsetY = Number(animator.viewOffsetY || 0) + delta;
        clampAnimatorFxParams();
        applyFxPanelValuesFromAnimator();
      };
      fxBtnViewUp?.addEventListener("click", () => nudgeViewY(-12));
      fxBtnViewDown?.addEventListener("click", () => nudgeViewY(12));
      fxBtnRenderMode?.addEventListener("click", () => {
        animator.buildingRenderMode =
          animator.buildingRenderMode === "textured"
            ? "unified"
            : animator.buildingRenderMode === "unified"
              ? "flat"
              : "textured";
        ls(FX_KEYS.buildingRenderMode, animator.buildingRenderMode);
        syncPlacementUi();
      });
      fxToggleCollisionDebug?.addEventListener("change", () => {
        animator.showCollisionDebug = !!fxToggleCollisionDebug.checked;
      });
    }

    function loadFxParamsFromStorage() {
      const num = (k, fallback) => {
        const v = ls(k);
        const n = v == null ? NaN : Number(v);
        return Number.isFinite(n) ? n : fallback;
      };
      animator.horizonY = num(FX_KEYS.horizonY, animator.horizonY);
      animator.cameraHeight = num(FX_KEYS.cameraHeight, animator.cameraHeight);
      animator.forwardScale = num(FX_KEYS.forwardScale, animator.forwardScale);
      animator.spanBase = num(FX_KEYS.spanBase, animator.spanBase);
      animator.spanScale = num(FX_KEYS.spanScale, animator.spanScale);
      animator.worldScale = num(FX_KEYS.worldScale, animator.worldScale);
      animator.targetCharPx = num(FX_KEYS.targetCharPx, animator.targetCharPx);
      animator.renderRadiusWorld = num(FX_KEYS.renderRadiusWorld, animator.renderRadiusWorld);
      animator.buildingSinkTransitionWorld = num(FX_KEYS.buildingSinkTransitionWorld, animator.buildingSinkTransitionWorld);
      const storedBuildingRenderMode = ls(FX_KEYS.buildingRenderMode);
      animator.buildingRenderMode =
        storedBuildingRenderMode === "flat" || storedBuildingRenderMode === "unified"
          ? storedBuildingRenderMode
          : "textured";
      animator.groundSkew = num(FX_KEYS.groundSkew, animator.groundSkew);
      animator.tilt = num(FX_KEYS.tilt, animator.tilt);
      animator.viewOffsetY = num(FX_KEYS.viewOffsetY, animator.viewOffsetY);
      animator.enableTiltShiftFx = ls(FX_KEYS.enableTiltShiftFx) !== "0";
      animator.tiltShiftFocusCenterOffset = num(FX_KEYS.tiltShiftFocusCenterOffset, animator.tiltShiftFocusCenterOffset);
      animator.tiltShiftFocusHalfRatio = num(FX_KEYS.tiltShiftFocusHalfRatio, animator.tiltShiftFocusHalfRatio);
      animator.tiltShiftFadeRatio = num(FX_KEYS.tiltShiftFadeRatio, animator.tiltShiftFadeRatio);
      animator.tiltShiftBlurStrength = num(FX_KEYS.tiltShiftBlurStrength, animator.tiltShiftBlurStrength);
      animator.tiltShiftRenderScale = num(FX_KEYS.tiltShiftRenderScale, animator.tiltShiftRenderScale);
      animator.tiltShiftGlowStrength = num(FX_KEYS.tiltShiftGlowStrength, animator.tiltShiftGlowStrength);
      const prevSunX = animator.sunLighting.fromX;
      const prevSunY = animator.sunLighting.fromY;
      animator.sunLighting.fromX = num(FX_KEYS.sunFromX, animator.sunLighting.fromX);
      animator.sunLighting.fromY = num(FX_KEYS.sunFromY, animator.sunLighting.fromY);
      animator.sunLighting.shadowStrength = num(FX_KEYS.sunShadowStrength, animator.sunLighting.shadowStrength);
      animator.sunLighting.shadowLength = num(FX_KEYS.sunShadowLength, animator.sunLighting.shadowLength);
      animator.sunLighting.contrast = num(FX_KEYS.sunContrast, animator.sunLighting.contrast);
      animator.sunLighting.warmth = num(FX_KEYS.sunWarmth, animator.sunLighting.warmth);
      animator.sunLighting.reflectionStrength = num(FX_KEYS.sunReflectionStrength, animator.sunLighting.reflectionStrength);
      animator.sunLighting.groundDepthDarkness = num(FX_KEYS.sunGroundDepthDarkness, animator.sunLighting.groundDepthDarkness);
      const cycle = getDayNightCycle();
      cycle.enabled = ls(FX_KEYS.dayNightEnabled) !== "0";
      cycle.paused = ls(FX_KEYS.dayNightPaused) === "1";
      cycle.dayDurationSec = num(FX_KEYS.dayNightDayDurationSec, cycle.dayDurationSec);
      cycle.nightDurationSec = num(FX_KEYS.dayNightNightDurationSec, cycle.nightDurationSec);
      cycle.dayWarmth = num(FX_KEYS.dayNightDayWarmth, cycle.dayWarmth);
      cycle.nightWarmth = num(FX_KEYS.dayNightNightWarmth, cycle.nightWarmth);
      cycle.dayShadowLength = num(FX_KEYS.dayNightDayShadowLength, cycle.dayShadowLength);
      cycle.nightShadowLength = num(FX_KEYS.dayNightNightShadowLength, cycle.nightShadowLength);
      cycle.shadowRotateRangeDeg = num(FX_KEYS.dayNightShadowRotateRangeDeg, cycle.shadowRotateRangeDeg);
      cycle.timeScale = num(FX_KEYS.dayNightTimeScale, cycle.timeScale);
      cycle.currentTimeSec = num(FX_KEYS.dayNightCurrentTimeSec, cycle.currentTimeSec);
      animator.showCollisionDebug = ls(FX_KEYS.showCollisionDebug) === "1";
      clampAnimatorFxParams();
      if (prevSunX !== animator.sunLighting.fromX || prevSunY !== animator.sunLighting.fromY) {
        invalidateSceneLightingBake();
      }
      applyDayNightCycle(performance.now(), 0, { preserveTime: true, forceBake: true, syncUi: false });
      applyZhuYuanzhangEmbedPlaybackPreset();

      const hud = elFxFullscreen.querySelector(".fx-hud");
      if (hud) {
        const hidden = ls(FX_KEYS.hudHidden) === "1";
        const minimized = !hidden && ls(FX_KEYS.hudMinimized) === "1";
        setFxHudState(hidden ? "hidden" : minimized ? "minimized" : "normal");
      }
    }

    bindFxPanel();
    applyFxPanelValuesFromAnimator();

    function openEmbeddedEngineViewport() {
      if (!isEmbeddedEngine) return;
      loadFxParamsFromStorage();
      applyFxPanelValuesFromAnimator();
      setFxFullscreen(true);
      setFxHudState("hidden");
      resizeFxBigCanvasToViewport();
    }

    // 点击右侧 FX 区域，打开/关闭大屏预览；不要只依赖 canvas 本身命中。
    function openFxWorldFromPreview() {
      const open = !elFxFullscreen.classList.contains("open");
      setFxFullscreen(open);
      if (open) {
        loadFxParamsFromStorage();
        applyFxPanelValuesFromAnimator();
        resizeFxBigCanvasToViewport();
        syncPlacementUi();
      }
    }
    [elAnimatorFxCanvas, elAnimatorFxStage, elAnimatorFxStageCard].forEach((node) => {
      if (!node) return;
      node.style.cursor = "zoom-in";
      node.title = "点击展开 FX 横屏游玩";
      node.addEventListener("click", openFxWorldFromPreview);
    });
    // 点击遮罩关闭（点舞台/菜单不关闭）
    const elFxWrap = elFxFullscreen.querySelector(".fx-wrap");
    const elFxHud = elFxFullscreen.querySelector(".fx-hud");
    elFxFullscreen.addEventListener("click", (e) => {
      if (e.target === elFxFullscreen) setFxFullscreen(false);
    });
    elFxWrap?.addEventListener("click", (e) => e.stopPropagation());
    elFxHud?.addEventListener("click", (e) => e.stopPropagation());
    elFxBigCanvas.addEventListener("click", (e) => e.stopPropagation());
    elFxInteractionMenu?.addEventListener("click", (e) => e.stopPropagation());
    elFxInteractionModalCard?.addEventListener("click", (e) => e.stopPropagation());
    elFxInteractionModal?.addEventListener("click", (e) => {
      if (e.target !== elFxInteractionModal) return;
      try {
        if (typeof elFxInteractionModalCard?.__blockCloseFn === "function" && elFxInteractionModalCard.__blockCloseFn()) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      } catch (_) {}
      closeInteractionModal();
    });

    // Track last pointer position (used by drag-like UIs like container held stack).
    if (!animator._pointerTrackInited) {
      animator._pointerTrackInited = true;
      animator._lastPointerX = 0;
      animator._lastPointerY = 0;
      const track = (ev) => {
        animator._lastPointerX = Number(ev?.clientX) || 0;
        animator._lastPointerY = Number(ev?.clientY) || 0;
      };
      window.addEventListener("pointermove", track, { passive: true, capture: true });
      window.addEventListener("mousemove", track, { passive: true, capture: true });
    }
    function handleInteractionListActivate(e) {
      const rawTarget = e.target;
      const targetEl = rawTarget && rawTarget.nodeType === 1
        ? rawTarget
        : (rawTarget && rawTarget.parentElement ? rawTarget.parentElement : null);
      const btn = targetEl && targetEl.closest ? targetEl.closest(".fx-interaction-btn") : null;
      if (!btn || !elFxInteractionList.contains(btn)) return;
      const idx = Number(btn.dataset.interactionIndex);
      if (!Number.isFinite(idx) || idx < 0) return;
      const entry = animator._interactionNearbyActions[idx];
      if (!entry) return;
      applyInteractionAction(entry);
      renderFxInteractionMenu();
      e.preventDefault();
      e.stopPropagation();
    }
    elFxInteractionList?.addEventListener("pointerdown", handleInteractionListActivate);
    elFxInteractionList?.addEventListener("click", handleInteractionListActivate);

    fxBtnPlaceHut?.addEventListener("click", (e) => {
      e.stopPropagation();
      void startPlacementHut();
    });
    fxBtnPlaceGenerated?.addEventListener("click", (e) => {
      e.stopPropagation();
      startPlacementGenerated();
    });
    fxBtnEditBuilding?.addEventListener("click", (e) => {
      e.stopPropagation();
      armBuildingEditMode();
    });
    fxBtnPlaceConfirm?.addEventListener("click", (e) => {
      e.stopPropagation();
      confirmPlacement();
    });
    fxBtnPlaceCancel?.addEventListener("click", (e) => {
      e.stopPropagation();
      cancelPlacement();
    });
    fxBtnEditDone?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (animator.placement && animator.placement.active && animator.placement.kind === "edit") confirmEditBuilding();
      else disarmBuildingEditMode();
    });
    fxBtnEditDelete?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!globalThis.confirm || globalThis.confirm("确定删除这栋建筑吗？")) {
        deleteEditingBuilding();
      }
    });
    fxBtnSceneSave?.addEventListener("click", (e) => {
      e.stopPropagation();
      void saveActiveScene(fxSceneId && fxSceneId.value);
    });
    fxBtnSceneLoad?.addEventListener("click", (e) => {
      e.stopPropagation();
      void (async () => {
        try {
          setTextStatus(fxSceneStatus, "正在加载场景…");
          await loadSceneById(fxSceneId && fxSceneId.value);
        } catch (err) {
          setTextStatus(fxSceneStatus, err.message || String(err), true);
        }
      })();
    });
    fxBtnSceneNew?.addEventListener("click", (e) => {
      e.stopPropagation();
      createNewScene(fxSceneId && fxSceneId.value);
    });
    fxBtnRoadRebuild?.addEventListener("click", (e) => {
      e.stopPropagation();
      rebuildVillageRoadTilemap();
      setTextStatus(fxSceneStatus, "已重算村路（总线+正面支线，写入 tilemap）。");
    });
    fxBtnScatterResources?.addEventListener("click", (e) => {
      e.stopPropagation();
      void (async () => {
        try {
          const activeId = sanitizeSceneId((fxSceneId && fxSceneId.value) || "") || DEFAULT_SCENE_ID;
          if (activeId !== DEFAULT_SCENE_ID) {
            throw new Error("仅支持在 default_scene 分布资源。请先加载 default_scene。");
          }
          const seedText = (fxResourceSeed && fxResourceSeed.value) || "";
          setTextStatus(fxSceneStatus, "正在按种子分布自然资源…");
          const placed = await scatterDefaultSceneResourcesBySeed(seedText);
          await saveActiveScene(activeId);
          setTextStatus(
            fxSceneStatus,
            `资源分布完成（seed=${String(seedText || "auto")}）：树 ${placed.tree || 0}，煤矿 ${placed.coal || 0}，铁矿 ${placed.iron || 0}`
          );
        } catch (err) {
          setTextStatus(fxSceneStatus, err.message || String(err), true);
        }
      })();
    });

    elFxBigCanvas.addEventListener("mousedown", (e) => {
      if (
        e.button === 0 &&
        elFxFullscreen.classList.contains("open") &&
        animator.buildingEdit &&
        animator.buildingEdit.armed &&
        !animator.placement.active
      ) {
        const { mx, my } = fxClientToStage(e.clientX, e.clientY);
        const hit = screenToWorldOnGround(mx, my, animator.stageCanvas);
        if (!hit) {
          if (fxPlaceHint) fxPlaceHint.textContent = "编辑建筑：未命中地面，请换个位置点击。";
        } else {
          const picked = pickBuildingAtWorld(hit.worldX, hit.worldY);
          if (picked) {
            beginEditBuilding(picked);
          } else {
            if (fxPlaceHint) fxPlaceHint.textContent = "编辑建筑：没点到建筑，请点击建筑底部附近。Esc 退出编辑模式。";
          }
        }
        e.preventDefault();
        return;
      }
      if (e.button === 0 && elFxFullscreen.classList.contains("open") && !animator.placement.active) {
        const { mx, my } = fxClientToStage(e.clientX, e.clientY);
        const pickedNpc = pickNpcAtScreen(mx, my, animator.stageCanvas);
        if (pickedNpc && getNpcInteractionGap(pickedNpc, animator.stageCanvas) <= Math.max(0, Number(animator.interactionTileRange) || 1)) {
          openNpcInteractionModal(pickedNpc);
          e.preventDefault();
          return;
        }
      }
      if (e.button === 0 && elFxFullscreen.classList.contains("open") && !animator.placement.active) {
        animator.orbitBulletBoost = Math.min(3.8, (Number(animator.orbitBulletBoost) || 0) + 2.4);
      }
      if (!animator.placement.active || e.button !== 0) return;
      const { mx, my } = fxClientToStage(e.clientX, e.clientY);
      const hit = screenToWorldOnGround(mx, my, animator.stageCanvas);
      if (!hit) return;
      const p = animator.placement;
      p.dragging = true;
      p._dragOffsetWx = p.wx - hit.worldX;
      p._dragOffsetWy = p.wy - hit.worldY;
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (!animator.placement.dragging || !animator.placement.active) return;
      if (!elFxFullscreen.classList.contains("open")) return;
      if ((e.buttons & 1) === 0) {
        animator.placement.dragging = false;
        return;
      }
      const { mx, my } = fxClientToStage(e.clientX, e.clientY);
      const hit = screenToWorldOnGround(mx, my, animator.stageCanvas);
      if (hit) {
        const p = animator.placement;
        p.wx = hit.worldX + p._dragOffsetWx;
        p.wy = hit.worldY + p._dragOffsetWy;
      }
    });
    window.addEventListener("mouseup", () => {
      animator.placement.dragging = false;
    });
    elFxBigCanvas.addEventListener(
      "wheel",
      (e) => {
        if (!elFxFullscreen.classList.contains("open")) return;
        // 全屏舞台内始终拦截滚轮，避免浏览器页面缩放/滚动抢输入。
        e.preventDefault();
        if (!animator.placement.active) return;
        animator.placement.scale *= (e.deltaY > 0 ? 0.94 : 1.064);
      },
      { passive: false }
    );

    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        if (elFxFullscreen.classList.contains("open") && animator.placement.active) {
          cancelPlacement();
          e.preventDefault();
          return;
        }
        if (elFxFullscreen.classList.contains("open") && animator.buildingEdit && animator.buildingEdit.armed) {
          disarmBuildingEditMode();
          e.preventDefault();
          return;
        }
        if (elFxFullscreen.classList.contains("open")) setFxFullscreen(false);
        return;
      }
      if (animator.placement.active && elFxFullscreen.classList.contains("open") && e.shiftKey) {
        const k = e.key.toLowerCase();
        if (k === "q") {
          animator.placement.angle -= 0.09;
          animator.pressed.delete("q");
          e.preventDefault();
        } else if (k === "e") {
          animator.placement.angle += 0.09;
          animator.pressed.delete("e");
          e.preventDefault();
        }
      }
    });
    window.addEventListener("resize", () => {
      if (elFxFullscreen.classList.contains("open")) resizeFxBigCanvasToViewport();
    });

    // Mode7 版本按你要求已移除（保持此页面聚焦菱形等距方案）

    const SYSTEM_PROMPT = [
      "你是一个资深的像素动画师，专门用来设计像素角色动画。",
      "必须严格遵循参考图中的 FF4 人物风格（配色、线条与明暗处理方式）。",
      "在风格严格一致的前提下，可根据用户输入的人物设定体现体型与外观特征：如小孩更矮、胖子更宽、壮汉更厚实，但仍保持 FF4 像素语言与结构。",
      "输出风格必须与参考图一致，不得改成其他像素流派。",
      "你将严格按照网格布局生成像素角色的spritesheet。",
      "你会默认把背景设置为白色。",
      "图片中不出现任何文字，不出现任何网格线和数字。",
      "画面比例1:1。",
      "每一行的 6 帧必须是同一个朝向，只允许该朝向下的动作变化，严禁同一行混入其他朝向。",
      "第一行： 向左下跑动（6帧）",
      "第二行： 向左跑动（6帧）",
      "第三行： 向左上跑动（6帧）",
      "第四行： 向上跑动（6帧）",
      "第五行： 向下跑动（6帧）"
    ].join("\n");

    const BUILDING_SYSTEM_PROMPT = [
      "你是一个资深的像素建筑设计师，专门依照用户输入的物体描述，生成符合实际物体结构的三视图。",
      "生成该物体的三视图，按从左到右的顺序，依次生成正视图、和对应的侧视图和俯视图。不要生成多余的视图",
      "背景纯白。",
      "sfc像素风格，边缘清晰。",
      "不要出现人物、阴影、地面、边框、文字、标注、数字、网格线。",
      "不要画出透视，禁止出现视角倾斜",
      "画面比例 1:1。"
    ].join("\n");
    const BUILDING_IMAGE_SIZE = "1024x1024";
    const BUILDING_IMAGE_QUALITY = "low";
    const BUILDING_META_PROMPT = [
      "你是 ai-rpg 建筑资产标注助手。",
      "请根据用户输入的建筑/物体描述，输出占地宽度与语义标签。标签描述的是物体在游戏逻辑中的属性，不是美术风格。",
      "宽度规则：基准是中等木屋正面约 15 格，用基准做参照，用目标建筑和中等木屋的比例，给出目标物体的合适尺寸，输出整数widthTiles。",
      "语义标签仅允许：house, facility, container, resource, sign, decoration（小写英文）。含义：",
      "- house：可进入且供人居住或长期起居的建筑（民居、客栈等）。",
      "- facility：可进行「物品交互」的建筑或装置——玩家用物品与之交互产生玩法结果；例如熔炉冶炼、水井用水桶打水、工作台合成等。",
      "- container：主要语义是「能装东西」——箱子、柜子、储物格等（强调盛装而非单次交互产出）。可与 facility 并存（例如带储物格的交互台）。",
      "- resource：被破坏、采集后产出资源的物体；例如树木、矿脉、可采煤矿堆等。",
      "- sign：可阅读信息的载体；例如告示牌、石碑、路牌、门匾、牌坊文字。",
      "- decoration：以上皆不符合时的默认标签；纯装饰、无上述玩法语义，例如石狮子、雕塑、纯景观构筑物。",
      "判定顺序建议：先判断是否 house；再判断是否 resource；再判断是否 facility 与/或 container；再判断是否 sign；若仍无法归入前五类，则仅输出 decoration。",
      "组合规则：",
      "1) 可进入且居住必须打 house。",
      "2) facility 与 container 可并存。",
      "3) sign 可与 house/facility/container 并存，也可单独出现。",
      "4) resource 只能单独出现，不得与 house/facility/container/sign/decoration 同现。",
      "5) decoration 只能单独出现；若存在 facility 或 container 或 house 或 resource 或 sign，不要同时输出 decoration。",
      "6) 不要输出 item:wood-source/item:ore-source/item:water-source/item:sign 这类来源或阅读标签；资源产出和阅读内容由后续结构化数据决定。",
      "如果 tags 含 facility，必须额外输出 facilityProfile，用于运行时设施面板，不要留到玩家第一次打开时再判断。",
      "facilityProfile.actionLabel 必须是 2~4 个中文动作词，例如：熔炼、合成、烹饪、提炼、汲取、锻造。",
      "facilityProfile.summary 用一句中文说明设施主要加工/交互用途。",
      "如果 tags 不含 facility，facilityProfile 可省略或为 null。",
      "只输出 JSON，不要其他文字。",
      "JSON 格式：{\"widthTiles\": number, \"tags\": string[], \"facilityProfile\": {\"actionLabel\":\"\", \"summary\":\"\"} | null}"
    ].join("\n");
    const FACILITY_PROFILE_MODEL = "gpt-5.4-mini";
    const FACILITY_RECIPE_MODEL = "gpt-5.4-mini";
    const FACILITY_LLM_TIMEOUT_MS = 30000;
    const FACILITY_STUCK_GRACE_MS = 5000;
    const LEGACY_FACILITY_PROFILE_PROMPT = [
      "你是 rpg 设施功能分析助手。",
      "你会根据设施名称、描述、标签，推断这个设施在交互面板里最自然的动作名称。",
      "只输出 JSON，不要其他文字。",
      "格式：{\"actionLabel\":\"\",\"summary\":\"\"}",
      "规则：",
      "1) actionLabel 必须是 2~4 个中文动作词，例如：熔炼、合成、烹饪、提炼、行驶、汲取、压榨、锻造。",
      "2) summary 用一句中文说明设施的主要加工用途。",
      "3) 不要输出模块名，不要输出解释段落。"
    ].join("\n");
    const LEGACY_FACILITY_RECIPE_PROMPT = [
      "你是 rpg 设施转化配方推理助手。",
      "你会根据设施的功能、玩家放入转化模块的物品、以及消耗模块的候选资源，推理该设施可能进行的产物转化。",
      "只输出 JSON，不要其他文字。",
      "格式：",
      "{\"candidates\":[{\"title\":\"\",\"summary\":\"\",\"inputs\":[{\"name\":\"\",\"count\":1}],\"consumes\":[{\"name\":\"\",\"count\":1}],\"outputs\":[{\"name\":\"\",\"count\":1,\"description\":\"\",\"tags\":[]}]}]}",
      "规则：",
      "1) candidates 最多 5 个，至少 1 个。",
      "2) 如果配方很明确，只给 1 个；如果不确定，给 2~5 个最可能候选。",
      "3) inputs 必须只使用转化模块里已经给出的物品名。",
      "4) consumes 只填写真正会被消耗的物品；若不需要消耗，返回空数组。",
      "5) outputs 至少 1 项；description 简短；tags 使用小写英文短标签。",
      "6) 不要凭空发明和当前设施完全无关的用途。"
    ].join("\n");

    const FACILITY_PROFILE_PROMPT = [
      "你是 RPG 游戏里的设施功能分析助手。",
      "只输出 JSON，不要输出 markdown，不要解释。",
      "格式：{\"actionLabel\":\"\",\"summary\":\"\"}",
      "规则：",
      "- actionLabel 必须是 2 到 4 个中文动作词。",
      "- summary 必须是一句简短中文说明。",
      "- 结合设施名称、标签、交互标签判断设施用途。",
      "- 不要照抄 schema。"
    ].join("\n");
    const FACILITY_RECIPE_PROMPT = [
      "你是 RPG 游戏里的设施配方推理助手。",
      "只输出 JSON，不要输出 markdown，不要解释。",
      "格式：{\"candidates\":[{\"title\":\"\",\"summary\":\"\",\"inputs\":[{\"name\":\"T1\",\"count\":1}],\"consumes\":[{\"name\":\"C1\",\"count\":1}],\"outputs\":[{\"name\":\"\",\"count\":1,\"description\":\"\",\"tags\":[\"\"]}]}]}",
      "规则：",
      "- 返回 1 到 3 个候选配方。",
      "- 每个 candidate 的 title 和 summary 都必须非空，建议用中文。",
      "- outputs 里的每个 name 都必须是非空真实物品名，优先使用中文名。",
      "- inputs 和 consumes 里只能使用已提供的 ASCII 别名，例如 T1、C1。",
      "- 不要输出 ???、unknown、item、material、output、product、result、example 这类占位词。",
      "- 不要照抄 schema。",
      "- 要结合设施名称、设施用途、原始物品名和材料提示，给出最合理的加工结果。"
    ].join("\n");

    function b64ToDataUrl(b64) {
      const s = (b64 || "").trim();
      if (s.startsWith("iVBOR")) return "data:image/png;base64," + s;
      if (s.startsWith("/9j/") || s.startsWith("/9j")) return "data:image/jpeg;base64," + s;
      return "data:image/png;base64," + s;
    }

    function stripJsonFence(text) {
      let s = String(text || "").trim();
      const m = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(s);
      if (m) s = m[1].trim();
      return s;
    }

    function extractChatContentText(content) {
      if (typeof content === "string") return content;
      if (!Array.isArray(content)) {
        if (content && typeof content === "object") {
          if (typeof content.text === "string") return content.text;
          if (typeof content.content === "string") return content.content;
          return JSON.stringify(content);
        }
        return "";
      }
      const chunks = [];
      for (const part of content) {
        if (!part) continue;
        if (typeof part === "string") {
          chunks.push(part);
          continue;
        }
        if (typeof part.text === "string") {
          chunks.push(part.text);
          continue;
        }
        if (typeof part.content === "string") {
          chunks.push(part.content);
        }
      }
      return chunks.join("\n").trim();
    }

    function extractJsonLikeFromText(text) {
      const s = stripJsonFence(String(text || "").trim());
      if (!s) return "";
      const firstObj = s.indexOf("{");
      const firstArr = s.indexOf("[");
      const starts = [firstObj, firstArr].filter((idx) => idx >= 0);
      if (!starts.length) return s;
      const start = Math.min(...starts);
      const endObj = s.lastIndexOf("}");
      const endArr = s.lastIndexOf("]");
      const end = Math.max(endObj, endArr);
      return end >= start ? s.slice(start, end + 1).trim() : s.slice(start).trim();
    }

    function parseJsonObjectFromChatResponse(raw) {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("LLM 响应不是 JSON");
      }
      const content = data?.choices?.[0]?.message?.content ?? data?.output_text ?? data?.content ?? "";
      const text = extractJsonLikeFromText(extractChatContentText(content));
      if (!text) throw new Error("LLM 返回为空");
      try {
        return JSON.parse(text);
      } catch {
        const m = /[\{\[][\s\S]*[\}\]]/.exec(text);
        if (m) return JSON.parse(m[0]);
      }
      throw new Error("LLM 内容不是有效 JSON");
    }

    function extractRawChatResponseText(data) {
      return extractChatContentText(data?.choices?.[0]?.message?.content ?? data?.output_text ?? data?.content ?? "");
    }

    function logFacilityLlmDebug(label, detail) {
      try {
        const payload = detail && typeof detail === "object" ? detail : { value: detail };
        if (console?.groupCollapsed) {
          console.groupCollapsed(`[facility-llm] ${label}`);
          Object.entries(payload).forEach(([key, value]) => console.log(key, value));
          console.groupEnd();
          return;
        }
        console.log(`[facility-llm] ${label}`, payload);
      } catch (_) {}
    }

    function clampInt(n, min, max, fallback) {
      const v = Math.round(Number(n));
      if (!Number.isFinite(v)) return fallback;
      return Math.max(min, Math.min(max, v));
    }

    function normalizeWidthTiles(rawWidth) {
      // 资源点/小物体需要能标到 1~3 格；房屋等仍由生成与布局逻辑自行使用合理值。
      return clampInt(rawWidth, 1, 80, 15);
    }

    function targetLongestFromWidthTiles(widthTiles) {
      const baselineTiles = 15;
      const baselineTarget = 112;
      const scaled = Math.round((normalizeWidthTiles(widthTiles) / baselineTiles) * baselineTarget);
      return clampInt(scaled, 64, 192, baselineTarget);
    }

    function normalizeSemanticTags(rawTags, promptText = "") {
      const allowed = new Set(["house", "facility", "container", "resource", "sign", "decoration"]);
      const tags = (Array.isArray(rawTags) ? rawTags : [])
        .map((v) => {
          const tag = String(v || "").trim().toLowerCase();
          return tag === "item:sign" ? "sign" : tag;
        })
        .filter((v) => allowed.has(v));
      const set = new Set(tags);
      if (set.has("resource")) return ["resource"];
      const out = [];
      if (set.has("house")) out.push("house");
      if (set.has("facility")) out.push("facility");
      if (set.has("container")) out.push("container");
      if (set.has("sign")) out.push("sign");
      if (out.length) return out;
      return ["decoration"];
    }

    function normalizeInteractionTags(rawTags, promptText = "") {
      const set = new Set();
      for (const raw of (Array.isArray(rawTags) ? rawTags : [])) {
        const v = String(raw || "").trim().toLowerCase();
        if (v === "item:sign") continue;
        if (v.startsWith("item:") && v.length > 5) set.add(v);
      }
      return Array.from(set);
    }

    function normalizeStoredBuildingTags(rawTags, promptText = "") {
      const semantic = normalizeSemanticTags(rawTags, promptText);
      const interaction = normalizeInteractionTags(rawTags, promptText);
      return semantic.concat(interaction);
    }

    function formatBuildingTagHint(tags, interactionTags, promptText = "") {
      const semantic = normalizeSemanticTags(tags, promptText);
      const interaction = normalizeInteractionTags(
        Array.isArray(interactionTags) && interactionTags.length ? interactionTags : tags,
        promptText
      );
      if (!interaction.length) return semantic.join("/");
      return `${semantic.join("/")} · 交互:${interaction.join("/")}`;
    }

    function primaryBuildingTagFromTags(tags) {
      const list = normalizeSemanticTags(tags);
      if (list.includes("house")) return "house";
      if (list.includes("resource")) return "resource";
      if (list.includes("container")) return "container";
      if (list.includes("facility")) return "facility";
      if (list.includes("sign")) return "sign";
      return "decoration";
    }

    function sanitizeFacilityProfileLike(raw) {
      if (!raw || typeof raw !== "object") return null;
      const actionLabel = String(raw.actionLabel || raw.action || raw.label || raw.动作 || raw.按钮 || raw.功能词 || "").trim();
      const summary = String(raw.summary || raw.description || raw.desc || raw.说明 || raw.用途 || raw.功能说明 || "").trim();
      if (!actionLabel && !summary) return null;
      return { actionLabel, summary };
    }

    function normalizeDrawRoad(value, tags) {
      if (value === true || value === "true" || value === "1" || value === 1) return true;
      if (value === false || value === "false" || value === "0" || value === 0) return false;
      return normalizeSemanticTags(tags).includes("house");
    }

    async function llmExtractBuildingMeta(base, key, promptText) {
      const res = await fetch(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model: "gpt-5.4-mini",
          temperature: 0.2,
          messages: [
            { role: "system", content: BUILDING_META_PROMPT },
            { role: "user", content: promptText },
          ],
        }),
      });
      const raw = await res.text();
      if (!res.ok) {
        throw new Error(`建筑语义打标 HTTP ${res.status}: ${raw.slice(0, 300)}`);
      }
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("建筑语义打标响应不是 JSON");
      }
      const content = extractChatContentText(data?.choices?.[0]?.message?.content || "");
      if (!content) throw new Error("建筑语义打标未返回 content");
      const text = stripJsonFence(content);
      let obj;
      try {
        obj = JSON.parse(text);
      } catch {
        const m = /\{[\s\S]*\}/.exec(text);
        if (!m) throw new Error("建筑语义打标内容不是 JSON");
        try {
          obj = JSON.parse(m[0]);
        } catch {
          throw new Error("建筑语义打标内容不是 JSON");
        }
      }
      return {
        widthTiles: normalizeWidthTiles(obj?.widthTiles),
        tags: normalizeSemanticTags(obj?.tags),
        interactionTags: normalizeInteractionTags(obj?.tags),
        facilityProfile: sanitizeFacilityProfileLike(obj?.facilityProfile || obj?.profile || obj?.设施功能 || obj?.设施说明),
      };
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("图片加载失败：" + src));
        img.src = src;
      });
    }

    function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("图片读取失败"));
        reader.readAsDataURL(blob);
      });
    }

    async function fetchImageAsDataUrl(src) {
      if (String(src || "").startsWith("data:")) return String(src || "");
      const data = await fetchJson(LIBRARY_API.fetchImageDataUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: src }),
        timeoutMs: 30000,
      });
      if (!data?.dataUrl) throw new Error("图片代理未返回 dataUrl");
      return String(data.dataUrl);
    }

    function relativeSpanMismatch(actual, expected) {
      const a = Math.max(1, Number(actual) || 0);
      const e = Math.max(1, Number(expected) || 0);
      return Math.abs(a - e) / Math.max(a, e);
    }

    async function rotateImageDataUrl90(src, clockwise = true) {
      const img = await loadImage(src);
      const sw = img.naturalWidth || img.width;
      const sh = img.naturalHeight || img.height;
      const canvas = document.createElement("canvas");
      canvas.width = sh;
      canvas.height = sw;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
      ctx.rotate((clockwise ? 1 : -1) * Math.PI * 0.5);
      ctx.drawImage(img, -sw * 0.5, -sh * 0.5);
      return canvas.toDataURL("image/png");
    }

    async function normalizeBuildingThreeViews({ frontUrl, sideUrl, topUrl }) {
      const [frontImg, sideImg, topImg] = await Promise.all([
        loadImage(frontUrl),
        loadImage(sideUrl),
        loadImage(topUrl),
      ]);
      const frontW = frontImg.naturalWidth || frontImg.width || 1;
      const sideW = sideImg.naturalWidth || sideImg.width || 1;
      const topW = topImg.naturalWidth || topImg.width || 1;
      const topH = topImg.naturalHeight || topImg.height || 1;
      const directScore = relativeSpanMismatch(topW, frontW) + relativeSpanMismatch(topH, sideW);
      const rotatedScore = relativeSpanMismatch(topH, frontW) + relativeSpanMismatch(topW, sideW);
      const shouldRotate =
        directScore > 0.38 &&
        rotatedScore + 0.18 < directScore &&
        rotatedScore <= directScore * 0.72;
      if (!shouldRotate) {
        return {
          frontUrl,
          sideUrl,
          topUrl,
          rotatedTop: false,
          directScore,
          rotatedScore,
        };
      }
      return {
        frontUrl,
        sideUrl,
        topUrl: await rotateImageDataUrl90(topUrl, true),
        rotatedTop: true,
        directScore,
        rotatedScore,
      };
    }

    function isEdgeBackgroundWhite(r, g, b, a) {
      if (a < 8) return true;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const avg = (r + g + b) / 3;
      return min >= 232 && avg >= 244 && (max - min) <= 24;
    }

    function shrinkOpaqueEdgeOnePixel(imageData) {
      const { data, width, height } = imageData;
      const nextAlpha = new Uint8ClampedArray(width * height);

      for (let i = 0; i < width * height; i++) {
        nextAlpha[i] = data[i * 4 + 3];
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (nextAlpha[idx] <= 8) continue;

          let touchesTransparent = false;
          for (let oy = -1; oy <= 1 && !touchesTransparent; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              if (ox === 0 && oy === 0) continue;
              const nx = x + ox;
              const ny = y + oy;
              if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
                touchesTransparent = true;
                break;
              }
              const nIdx = ny * width + nx;
              if (nextAlpha[nIdx] <= 8) {
                touchesTransparent = true;
                break;
              }
            }
          }

          if (touchesTransparent) {
            data[idx * 4 + 3] = 0;
          }
        }
      }
    }

    async function removeUnenclosedWhiteBackground(src) {
      const img = await loadImage(src);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;
      const visited = new Uint8Array(width * height);
      const queue = new Uint32Array(width * height);
      let head = 0;
      let tail = 0;

      function tryPush(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const idx = y * width + x;
        if (visited[idx]) return;
        const p = idx * 4;
        if (!isEdgeBackgroundWhite(data[p], data[p + 1], data[p + 2], data[p + 3])) return;
        visited[idx] = 1;
        queue[tail++] = idx;
      }

      for (let x = 0; x < width; x++) {
        tryPush(x, 0);
        tryPush(x, height - 1);
      }
      for (let y = 1; y < height - 1; y++) {
        tryPush(0, y);
        tryPush(width - 1, y);
      }

      while (head < tail) {
        const idx = queue[head++];
        const x = idx % width;
        const y = (idx - x) / width;
        tryPush(x - 1, y);
        tryPush(x + 1, y);
        tryPush(x, y - 1);
        tryPush(x, y + 1);
      }

      for (let idx = 0; idx < visited.length; idx++) {
        if (!visited[idx]) continue;
        data[idx * 4 + 3] = 0;
      }

      // 去掉 AI 常见的白边/杂色边：对前景再内缩 2 像素。
      shrinkOpaqueEdgeOnePixel(imageData);
      shrinkOpaqueEdgeOnePixel(imageData);

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    }

    async function removeAllWhiteBackground(src, whiteThreshold = 248, alphaThreshold = 8) {
      const img = await loadImage(src);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] <= alphaThreshold) continue;
        if (data[i] >= whiteThreshold && data[i + 1] >= whiteThreshold && data[i + 2] >= whiteThreshold) {
          data[i + 3] = 0;
        }
      }

      shrinkOpaqueEdgeOnePixel(imageData);
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    }

    async function cleanupIconWhiteFringe(src) {
      const noBg = await removeUnenclosedWhiteBackground(src);
      const img = await loadImage(noBg);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;
      const alphaCopy = new Uint8ClampedArray(width * height);
      for (let i = 0; i < alphaCopy.length; i++) alphaCopy[i] = data[i * 4 + 3];

      // 先清理“边缘连通的浅色中性背景”（白底/浅灰底/棋盘格常见形态）。
      const visited = new Uint8Array(width * height);
      const queue = new Uint32Array(width * height);
      let head = 0;
      let tail = 0;
      function isLikelyBgAt(idx) {
        const p = idx * 4;
        const a = alphaCopy[idx];
        if (a <= 24) return true;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const neutral = maxC - minC <= 22;
        const bright = minC >= 168;
        return neutral && bright;
      }
      function tryPushBg(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const idx = y * width + x;
        if (visited[idx]) return;
        if (!isLikelyBgAt(idx)) return;
        visited[idx] = 1;
        queue[tail++] = idx;
      }
      for (let x = 0; x < width; x++) {
        tryPushBg(x, 0);
        tryPushBg(x, height - 1);
      }
      for (let y = 1; y < height - 1; y++) {
        tryPushBg(0, y);
        tryPushBg(width - 1, y);
      }
      while (head < tail) {
        const idx = queue[head++];
        const x = idx % width;
        const y = (idx - x) / width;
        tryPushBg(x - 1, y);
        tryPushBg(x + 1, y);
        tryPushBg(x, y - 1);
        tryPushBg(x, y + 1);
      }
      for (let idx = 0; idx < visited.length; idx++) {
        if (visited[idx]) data[idx * 4 + 3] = 0;
      }

      // 针对白边：删除紧邻透明区的近白像素，并压低半透明白边 alpha。
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          const p = idx * 4;
          const a = alphaCopy[idx];
          if (a <= 0) continue;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const isNearWhite = r >= 236 && g >= 236 && b >= 236;
          if (!isNearWhite) continue;
          let touchesTransparent = false;
          for (let oy = -1; oy <= 1 && !touchesTransparent; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              if (ox === 0 && oy === 0) continue;
              const nx = x + ox;
              const ny = y + oy;
              if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
                touchesTransparent = true;
                break;
              }
              const nIdx = ny * width + nx;
              if (alphaCopy[nIdx] <= 8) {
                touchesTransparent = true;
                break;
              }
            }
          }
          if (!touchesTransparent) continue;
          if (a <= 180) {
            data[p + 3] = 0;
          } else {
            data[p + 3] = Math.max(0, a - 96);
          }
        }
      }

      // 去除亮色污染：低 alpha 像素把 RGB 同步为 alpha，避免渲染时出现白光晕。
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a <= 0) continue;
        if (a < 220) {
          const clamp = Math.max(0, Math.min(255, a));
          data[i] = Math.min(data[i], clamp);
          data[i + 1] = Math.min(data[i + 1], clamp);
          data[i + 2] = Math.min(data[i + 2], clamp);
        }
      }

      shrinkOpaqueEdgeOnePixel(imageData);
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    }

    async function fitIconDataUrl(src, maxSize = 256) {
      const img = await loadImage(src);
      const sw = img.naturalWidth || img.width || 1;
      const sh = img.naturalHeight || img.height || 1;
      const scale = Math.min(1, Math.max(1, maxSize) / Math.max(sw, sh));
      if (scale >= 1) return src;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(sw * scale));
      canvas.height = Math.max(1, Math.round(sh * scale));
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }

    async function prepareGeneratedItemIcon(src) {
      let dataUrl = "";
      try {
        dataUrl = await fetchImageAsDataUrl(src);
      } catch (_) {
        dataUrl = src;
      }
      const cleaned = await cleanupIconWhiteFringe(dataUrl);
      return fitIconDataUrl(cleaned, 256);
    }

    const LOCAL_ASSET_API_BASE = `${location.protocol === "file:" ? "http:" : location.protocol}//${location.hostname || "127.0.0.1"}:8766`;
    const LIBRARY_API = {
      saveCharacter: LOCAL_ASSET_API_BASE + "/api/save-character",
      saveBuilding: LOCAL_ASSET_API_BASE + "/api/save-building",
      deleteCharacter: LOCAL_ASSET_API_BASE + "/api/delete-character",
      deleteBuilding: LOCAL_ASSET_API_BASE + "/api/delete-building",
      listCharacters: LOCAL_ASSET_API_BASE + "/api/list-characters",
      listBuildings: LOCAL_ASSET_API_BASE + "/api/list-buildings",
      saveScene: LOCAL_ASSET_API_BASE + "/api/save-scene",
      updateSceneRuntime: LOCAL_ASSET_API_BASE + "/api/update-scene-runtime",
      fetchImageDataUrl: LOCAL_ASSET_API_BASE + "/api/fetch-image-data-url",
      listScenes: LOCAL_ASSET_API_BASE + "/api/list-scenes",
      loadScene: LOCAL_ASSET_API_BASE + "/api/load-scene",
      deleteScene: LOCAL_ASSET_API_BASE + "/api/delete-scene",
      health: LOCAL_ASSET_API_BASE + "/api/health",
    };

    function summarizePrompt(prompt, fallback) {
      const text = String(prompt || "").trim().replace(/\s+/g, " ");
      if (!text) return fallback;
      return text.length > 32 ? text.slice(0, 32) + "…" : text;
    }

    function bustAssetUrl(url, seed) {
      if (!url) return "";
      const suffix = "v=" + encodeURIComponent(seed || Date.now());
      return url.includes("?") ? url + "&" + suffix : url + "?" + suffix;
    }

    async function fetchJson(url, init) {
      const options = Object.assign({}, init || {});
      const timeoutMsRaw = options.timeoutMs;
      delete options.timeoutMs;
      const timeoutMs = Number.isFinite(Number(timeoutMsRaw)) ? Math.max(0, Number(timeoutMsRaw)) : 0;
      let abortController = null;
      let timeoutHandle = null;
      if (timeoutMs > 0) {
        abortController = new AbortController();
        if (options.signal) {
          const upstreamSignal = options.signal;
          if (upstreamSignal.aborted) abortController.abort(upstreamSignal.reason);
          else upstreamSignal.addEventListener("abort", () => abortController.abort(upstreamSignal.reason), { once: true });
        }
        options.signal = abortController.signal;
        timeoutHandle = setTimeout(() => {
          try {
            abortController.abort(new Error("Request timeout"));
          } catch (_) {}
        }, timeoutMs);
      }
      let res;
      try {
        res = await fetch(url, Object.assign({ cache: "no-store" }, options));
      } catch (err) {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (abortController && abortController.signal.aborted) {
          throw new Error("请求超时: " + url);
        }
        throw err;
      }
      const text = await res.text();
      if (timeoutHandle) clearTimeout(timeoutHandle);
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("接口响应不是 JSON：\n" + text.slice(0, 400));
      }
      if (!res.ok || data?.error) {
        const msg = data?.error || data?.message || text.slice(0, 400) || ("HTTP " + res.status);
        throw new Error(msg);
      }
      return data;
    }

    function setTextStatus(node, text, isError = false) {
      if (!node) return;
      node.className = "fx-gen-status" + (isError ? " err" : "");
      node.textContent = text || "";
    }

    function createLibraryAction(label, onClick, className) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      if (className) btn.className = className;
      btn.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (btn.disabled) return;
        btn.disabled = true;
        try {
          await onClick(event);
        } finally {
          btn.disabled = false;
        }
      });
      return btn;
    }

    function confirmDeleteLibraryEntryTwice(kindLabel, entry) {
      const title = (entry.title || entry.id || "").trim() || "未命名";
      const id = (entry.id || "").trim();
      if (!id) return false;
      const msg1 =
        `确定要从素材库删除${kindLabel}「${title}」吗？\n\n将永久删除磁盘上的素材文件夹及索引，无法撤销。`;
      if (!window.confirm(msg1)) return false;
      const msg2 = `再次确认：永久删除${kindLabel}「${title}」（id：${id}）？\n\n此操作不可恢复。`;
      return window.confirm(msg2);
    }

    async function deleteCharacterLibraryEntry(entry) {
      if (!confirmDeleteLibraryEntryTwice("人物", entry)) return;
      setTextStatus(fxCharacterLibraryStatus, "正在删除人物素材…");
      await fetchJson(LIBRARY_API.deleteCharacter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      await refreshCharacterLibrary();
      setTextStatus(fxCharacterLibraryStatus, "已删除人物：" + (entry.title || entry.id));
    }

    async function deleteBuildingLibraryEntry(entry) {
      if (!confirmDeleteLibraryEntryTwice("建筑", entry)) return;
      setTextStatus(fxBuildingLibraryStatus, "正在删除建筑素材…");
      await fetchJson(LIBRARY_API.deleteBuilding, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      await refreshBuildingLibrary();
      setTextStatus(fxBuildingLibraryStatus, "已删除建筑：" + (entry.title || entry.id));
    }

    function buildPreviewCard(title, src, checker) {
      const card = document.createElement("div");
      card.className = "card";
      const h3 = document.createElement("h3");
      h3.textContent = title;
      const frame = document.createElement("div");
      frame.className = "preview-frame " + (checker ? "checker" : "preview-white");
      const img = document.createElement("img");
      img.src = src;
      img.alt = title;
      frame.appendChild(img);
      card.appendChild(h3);
      card.appendChild(frame);
      return card;
    }

    function renderBeforeAfter(originalSrc, processedSrc, title) {
      elOut.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = "gallery gallery-2";
      wrap.appendChild(buildPreviewCard(title + " · 原图", originalSrc, false));
      wrap.appendChild(buildPreviewCard(title + " · 去白底后", processedSrc, true));
      elOut.appendChild(wrap);
      elPanel.hidden = false;
    }

    function renderHudPreviewGrid(container, items) {
      if (!container) return;
      container.innerHTML = "";
      for (const item of items) {
        const card = document.createElement("div");
        card.className = "fx-gen-preview-card" + (item.white ? " is-white" : "");
        const title = document.createElement("h4");
        title.textContent = item.title;
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title;
        card.appendChild(title);
        card.appendChild(img);
        container.appendChild(card);
      }
    }

    function renderBuildingWorkflowPreview(buildingState) {
      if (!elBuildingOut) return;
      elBuildingOut.innerHTML = "";
      if (!buildingState) return;
      const wrap = document.createElement("div");
      wrap.className = "gallery gallery-2";
      wrap.appendChild(buildPreviewCard("建筑三视图 · 原图", buildingState.originalSrc, false));
      wrap.appendChild(buildPreviewCard("建筑三视图 · 去白底后", buildingState.processedSrc, true));
      if (buildingState.views) {
        wrap.appendChild(buildPreviewCard("正视图", buildingState.views.front, true));
        wrap.appendChild(buildPreviewCard("侧视图", buildingState.views.side, true));
        wrap.appendChild(buildPreviewCard("俯视图", buildingState.views.top, true));
      }
      elBuildingOut.appendChild(wrap);
      const items = [
        { title: "原图", src: buildingState.originalSrc, white: false },
        { title: "去白底", src: buildingState.processedSrc, white: true },
      ];
      if (buildingState.views) {
        items.push(
          { title: "正视图", src: buildingState.views.front, white: true },
          { title: "侧视图", src: buildingState.views.side, white: true },
          { title: "俯视图", src: buildingState.views.top, white: true }
        );
      }
      renderHudPreviewGrid(fxBuildingPreview, items);
      if (buildingState.widthTiles) {
        const tip = document.createElement("div");
        tip.className = "hint";
        const profile = sanitizeFacilityProfileLike(buildingState.facilityProfile);
        const profileHint = profile?.actionLabel ? `；设施动作：${profile.actionLabel}` : "";
        tip.textContent = `宽度打标：${normalizeWidthTiles(buildingState.widthTiles)} 格；标签：${formatBuildingTagHint(buildingState.tags, buildingState.interactionTags, buildingState.prompt || "")}${profileHint}`;
        elBuildingOut.appendChild(tip);
      }
    }

    function applyCharacterLibraryEntry(entry) {
      if (!entry?.files?.sheet) throw new Error("角色条目缺少 sheet.png");
      const sheetUrl = bustAssetUrl(entry.files.sheet, entry.updatedAt || entry.createdAt || entry.id);
      return loadAnimatorSheet(sheetUrl, entry.title || entry.id || "角色库素材");
    }

    async function buildGeneratedBuildingStateFromLibraryEntry(entry) {
      if (!entry?.files?.front || !entry?.files?.side || !entry?.files?.top) {
        throw new Error("建筑条目缺少 front/side/top 三视图文件");
      }
      if (typeof globalThis.buildVoxelModelFromDataUrls !== "function") {
        throw new Error("缺少运行时体素构建器：buildVoxelModelFromDataUrls 不可用。");
      }
      if (typeof globalThis.applyTexturedAtlasesFromDataUrls !== "function") {
        throw new Error("缺少运行时贴图构建器：applyTexturedAtlasesFromDataUrls 不可用。");
      }
      const seed = entry.updatedAt || entry.createdAt || entry.id || Date.now();
      const frontUrl = bustAssetUrl(entry.files.front, seed);
      const sideUrl = bustAssetUrl(entry.files.side, seed);
      const topUrl = bustAssetUrl(entry.files.top, seed);
      const opts = Object.assign(
        {
          targetLongest: 112,
          shellOnly: true,
          frontPriority: false,
        },
        entry.voxelOptions || {}
      );
      const built = await buildPlacedBuildingModelFromViews({
        frontUrl,
        sideUrl,
        topUrl,
        voxelOptions: opts,
      });
      return {
        id: entry.id,
        prompt: entry.prompt || "",
        originalSrc: entry.files.preview ? bustAssetUrl(entry.files.preview, seed) : frontUrl,
        processedSrc: entry.files.previewProcessed ? bustAssetUrl(entry.files.previewProcessed, seed) : frontUrl,
        views: built.views,
        model: built.model,
        voxelOptions: built.voxelOptions,
        tags: normalizeSemanticTags(entry.tags, entry.prompt || entry.title || ""),
        interactionTags: normalizeInteractionTags(entry.tags, entry.prompt || entry.title || ""),
        buildingTag: primaryBuildingTagFromTags(entry.tags),
        widthTiles: normalizeWidthTiles(entry.widthTiles),
        drawRoad: normalizeDrawRoad(entry.drawRoad, entry.tags),
        facilityProfile: sanitizeFacilityProfileLike(entry.facilityProfile),
        meta: entry,
      };
    }

    async function applyBuildingLibraryEntry(entry, placeAfterLoad = false) {
      animator._generatedBuilding = await buildGeneratedBuildingStateFromLibraryEntry(entry);
      renderBuildingWorkflowPreview(animator._generatedBuilding);
      syncPlacementUi();
      if (placeAfterLoad) startPlacementGenerated();
    }

    async function buildPlacedBuildingModelFromViews({ frontUrl, sideUrl, topUrl, voxelOptions }) {
      const normalizedViews = await normalizeBuildingThreeViews({ frontUrl, sideUrl, topUrl });
      frontUrl = normalizedViews.frontUrl;
      sideUrl = normalizedViews.sideUrl;
      topUrl = normalizedViews.topUrl;
      const baseOpts = Object.assign(
        {
          targetLongest: 112,
          shellOnly: true,
          frontPriority: false,
          pruneTopColorMismatch: true,
        },
        voxelOptions || {}
      );
      async function buildOnce(opts) {
        const rawModel = await globalThis.buildVoxelModelFromDataUrls({
          frontDataUrl: frontUrl,
          sideDataUrl: sideUrl,
          topDataUrl: topUrl,
          targetLongest: opts.targetLongest,
          shellOnly: opts.shellOnly !== false,
          frontPriority: opts.frontPriority === true,
          maskSmooth: opts.maskSmooth,
          maskSmoothProfile: opts.maskSmoothProfile,
        });
        rawModel._skipRealHutTextures = true;
        await globalThis.applyTexturedAtlasesFromDataUrls(rawModel, {
          frontDataUrl: frontUrl,
          sideDataUrl: sideUrl,
          topDataUrl: topUrl,
        });
        if (opts.pruneTopColorMismatch !== false) {
          pruneTopColorMismatchByViews(rawModel, {
            shellOnly: opts.shellOnly !== false,
          });
        }
        return finalizeVoxelModel(rawModel);
      }

      let model = await buildOnce(baseOpts);
      let finalOpts = Object.assign({}, baseOpts);
      const smoothingExplicitlyOff =
        baseOpts.maskSmooth === false ||
        baseOpts.maskSmooth === "off" ||
        baseOpts.maskSmooth === "none";
      if (!model?.list?.length && !smoothingExplicitlyOff) {
        const noSmoothOpts = Object.assign({}, finalOpts, { maskSmooth: false });
        model = await buildOnce(noSmoothOpts);
        finalOpts = noSmoothOpts;
      }
      if (!model?.list?.length && finalOpts.frontPriority !== true) {
        const fallbackOpts = Object.assign({}, finalOpts, { frontPriority: true });
        model = await buildOnce(fallbackOpts);
        finalOpts = fallbackOpts;
      }
      if (!model?.list?.length) {
        throw new Error("建筑体素为空：三视图交集后没有可放置体素，请尝试让三视图结构更一致。");
      }
      return {
        model,
        voxelOptions: finalOpts,
        views: {
          front: frontUrl,
          side: sideUrl,
          top: topUrl,
        },
        normalizedViews,
      };
    }

    function renderCharacterLibrary() {
      if (!fxCharacterLibrary) return;
      fxCharacterLibrary.innerHTML = "";
      const entries = animator._characterLibrary || [];
      if (!entries.length) {
        fxCharacterLibrary.textContent = "人物库为空。保存一次当前角色后会显示在这里。";
        return;
      }
      for (const entry of entries) {
        const item = document.createElement("div");
        item.className = "fx-library-item";
        const head = document.createElement("div");
        head.className = "fx-library-item-head";
        const title = document.createElement("h4");
        title.textContent = entry.title || entry.id;
        const meta = document.createElement("div");
        meta.textContent = entry.id || "";
        head.appendChild(title);
        head.appendChild(meta);
        const info = document.createElement("p");
        info.className = "fx-library-item-meta";
        info.textContent = (entry.prompt || "").trim() || "无提示词";
        const actions = document.createElement("div");
        actions.className = "fx-library-item-actions";
        actions.appendChild(createLibraryAction("加载人物", async () => {
          try {
            setTextStatus(fxCharacterLibraryStatus, "正在加载人物库素材…");
            await applyCharacterLibraryEntry(entry);
            setTextStatus(fxCharacterLibraryStatus, "已加载人物：" + (entry.title || entry.id));
          } catch (err) {
            setTextStatus(fxCharacterLibraryStatus, err.message || String(err), true);
          }
        }));
        actions.appendChild(createLibraryAction("删除", async () => {
          try {
            await deleteCharacterLibraryEntry(entry);
          } catch (err) {
            setTextStatus(fxCharacterLibraryStatus, err.message || String(err), true);
          }
        }, "danger"));
        item.appendChild(head);
        item.appendChild(info);
        item.appendChild(actions);
        fxCharacterLibrary.appendChild(item);
      }
    }

    function renderBuildingLibrary() {
      if (!fxBuildingLibrary) return;
      fxBuildingLibrary.innerHTML = "";
      const entries = animator._buildingLibrary || [];
      if (!entries.length) {
        fxBuildingLibrary.textContent = "建筑库为空。保存一次当前建筑后会显示在这里。";
        return;
      }
      const groups = [
        { key: "facility-container", label: "容器 / 设施", match: (tags) => tags.includes("facility") || tags.includes("container") },
        { key: "house", label: "房屋", match: (tags) => tags.includes("house") },
        { key: "resource", label: "资源点", match: (tags) => tags.includes("resource") },
        { key: "sign", label: "标识 / 可阅读", match: (tags) => tags.includes("sign") },
        { key: "decoration", label: "装饰 / 其它", match: (tags) => tags.includes("decoration") },
      ];
      async function updateBuildingLibraryMeta(entry, patch) {
        const data = await fetchJson(LOCAL_ASSET_API_BASE + "/api/update-building", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({ id: entry.id }, patch)),
        });
        Object.assign(entry, data.item || patch);
        renderBuildingLibrary();
        return data;
      }
      for (const group of groups) {
        const groupEntries = entries.filter((entry) => group.match(normalizeSemanticTags(entry.tags, entry.prompt || entry.title || "")));
        if (!groupEntries.length) continue;
        const groupTitle = document.createElement("div");
        groupTitle.className = "hint";
        groupTitle.textContent = `${group.label} · ${groupEntries.length}`;
        fxBuildingLibrary.appendChild(groupTitle);
        for (const entry of groupEntries) {
        const entryTags = normalizeSemanticTags(entry.tags, entry.prompt || entry.title || "");
        const item = document.createElement("div");
        item.className = "fx-library-item";
        const head = document.createElement("div");
        head.className = "fx-library-item-head";
        const title = document.createElement("h4");
        title.textContent = entry.title || entry.id;
        const meta = document.createElement("div");
        meta.textContent = entry.id || "";
        head.appendChild(title);
        head.appendChild(meta);
        const info = document.createElement("p");
        info.className = "fx-library-item-meta";
        const promptText = (entry.prompt || "").trim() || "无提示词";
        const interactionHint = normalizeInteractionTags(entry.interactionTags || entry.tags, entry.prompt || entry.title || "");
        const mergedHint = interactionHint.length ? `${entryTags.join("/")} · 交互:${interactionHint.join("/")}` : entryTags.join("/");
        info.textContent = `${promptText} · 宽度 ${normalizeWidthTiles(entry.widthTiles)} 格 · 标签 ${mergedHint}`;
        const roadLabel = document.createElement("label");
        roadLabel.className = "fx-library-item-meta";
        const roadCheck = document.createElement("input");
        roadCheck.type = "checkbox";
        roadCheck.checked = normalizeDrawRoad(entry.drawRoad, entryTags);
        roadCheck.addEventListener("change", async () => {
          try {
            roadCheck.disabled = true;
            await updateBuildingLibraryMeta(entry, { drawRoad: roadCheck.checked });
            setTextStatus(fxBuildingLibraryStatus, (entry.title || entry.id) + (roadCheck.checked ? " 已开启道路绘制" : " 已关闭道路绘制"));
          } catch (err) {
            roadCheck.checked = !roadCheck.checked;
            setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
          } finally {
            roadCheck.disabled = false;
          }
        });
        roadLabel.appendChild(roadCheck);
        roadLabel.appendChild(document.createTextNode(" 绘制道路"));
        const widthLabel = document.createElement("label");
        widthLabel.className = "fx-library-item-meta";
        const widthInput = document.createElement("input");
        widthInput.type = "number";
        widthInput.min = "1";
        widthInput.max = "80";
        widthInput.step = "1";
        widthInput.value = String(normalizeWidthTiles(entry.widthTiles));
        widthInput.style.width = "72px";
        const widthSaveBtn = document.createElement("button");
        widthSaveBtn.type = "button";
        widthSaveBtn.textContent = "保存格子宽";
        const commitWidthChange = async () => {
          const nextWidth = normalizeWidthTiles(widthInput.value);
          if (nextWidth === normalizeWidthTiles(entry.widthTiles)) {
            widthInput.value = String(nextWidth);
            setTextStatus(fxBuildingLibraryStatus, (entry.title || entry.id) + " 格子宽未变化");
            return;
          }
          try {
            widthSaveBtn.disabled = true;
            widthInput.disabled = true;
            await updateBuildingLibraryMeta(entry, { widthTiles: nextWidth });
            if (
              animator._generatedBuilding &&
              String(animator._generatedBuilding.id || "") === String(entry.id || "")
            ) {
              animator._generatedBuilding.widthTiles = nextWidth;
              if (animator._generatedBuilding.meta) {
                animator._generatedBuilding.meta.widthTiles = nextWidth;
              }
              syncPlacementUi();
            }
            setTextStatus(fxBuildingLibraryStatus, (entry.title || entry.id) + " 格子宽已更新为 " + nextWidth);
          } catch (err) {
            setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
          } finally {
            widthInput.disabled = false;
            widthSaveBtn.disabled = false;
          }
        };
        widthSaveBtn.addEventListener("click", commitWidthChange);
        widthInput.addEventListener("keydown", (event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          void commitWidthChange();
        });
        widthLabel.appendChild(document.createTextNode("格子宽 "));
        widthLabel.appendChild(widthInput);
        widthLabel.appendChild(document.createTextNode(" "));
        widthLabel.appendChild(widthSaveBtn);
        const actions = document.createElement("div");
        actions.className = "fx-library-item-actions";
        actions.appendChild(createLibraryAction("加载建筑", async () => {
          try {
            setTextStatus(fxBuildingLibraryStatus, "正在加载建筑库素材…");
            await applyBuildingLibraryEntry(entry, false);
            setTextStatus(fxBuildingLibraryStatus, "已载入建筑：" + (entry.title || entry.id));
          } catch (err) {
            setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
          }
        }));
        actions.appendChild(createLibraryAction("放置建筑", async () => {
          try {
            setTextStatus(fxBuildingLibraryStatus, "正在载入并进入放置模式…");
            await applyBuildingLibraryEntry(entry, true);
            setTextStatus(fxBuildingLibraryStatus, "已进入建筑放置：" + (entry.title || entry.id));
          } catch (err) {
            setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
          }
        }));
        actions.appendChild(createLibraryAction("删除", async () => {
          try {
            await deleteBuildingLibraryEntry(entry);
          } catch (err) {
            setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
          }
        }, "danger"));
        item.appendChild(head);
        item.appendChild(info);
        item.appendChild(roadLabel);
        item.appendChild(widthLabel);
        item.appendChild(actions);
        fxBuildingLibrary.appendChild(item);
      }
      }
    }

    async function refreshCharacterLibrary() {
      try {
        setTextStatus(fxCharacterLibraryStatus, "正在读取人物库…");
        const data = await fetchJson(LIBRARY_API.listCharacters);
        animator._characterLibrary = Array.isArray(data.items) ? data.items : [];
        renderCharacterLibrary();
        setTextStatus(fxCharacterLibraryStatus, "人物库已刷新，共 " + animator._characterLibrary.length + " 项。");
      } catch (err) {
        animator._characterLibrary = [];
        renderCharacterLibrary();
        setTextStatus(fxCharacterLibraryStatus, err.message || String(err), true);
      }
    }

    async function refreshBuildingLibrary() {
      try {
        setTextStatus(fxBuildingLibraryStatus, "正在读取建筑库…");
        const data = await fetchJson(LIBRARY_API.listBuildings);
        animator._buildingLibrary = Array.isArray(data.items) ? data.items : [];
        renderBuildingLibrary();
        setTextStatus(fxBuildingLibraryStatus, "建筑库已刷新，共 " + animator._buildingLibrary.length + " 项。");
      } catch (err) {
        animator._buildingLibrary = [];
        renderBuildingLibrary();
        setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
      }
    }

    async function saveCurrentCharacter() {
      if (!animator._generatedCharacter?.processedSrc) {
        throw new Error("当前没有可保存的人物。请先生成人物。");
      }
      const title = summarizePrompt(animator._generatedCharacter.prompt, "角色");
      const payload = {
        title,
        prompt: animator._generatedCharacter.prompt || "",
        sourceModel: animator._generatedCharacter.model || "",
        imageSize: CONFIG.imageSize,
        columns: animator.columns,
        rows: animator.rows,
        tags: [],
        files: {
          sheetDataUrl: animator._generatedCharacter.processedSrc,
          idleDataUrl: animator.idleSheet?.sourceDataUrl || "",
          previewDataUrl: animator._generatedCharacter.originalSrc || animator._generatedCharacter.processedSrc,
        },
      };
      return fetchJson(LIBRARY_API.saveCharacter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    async function saveCurrentBuilding() {
      if (!animator._generatedBuilding?.views?.front || !animator._generatedBuilding?.views?.side || !animator._generatedBuilding?.views?.top) {
        throw new Error("当前没有可保存的建筑。请先生成建筑三视图。");
      }
      const title = summarizePrompt(animator._generatedBuilding.prompt, "建筑");
      const payload = {
        title,
        prompt: animator._generatedBuilding.prompt || "",
        sourceModel: "gemini-3-pro-image-preview",
        imageSize: CONFIG.imageSize,
        tags: normalizeStoredBuildingTags(
          []
            .concat(animator._generatedBuilding.tags || [])
            .concat(animator._generatedBuilding.interactionTags || []),
          animator._generatedBuilding.prompt || ""
        ),
        widthTiles: normalizeWidthTiles(animator._generatedBuilding.widthTiles),
        drawRoad: normalizeDrawRoad(animator._generatedBuilding.drawRoad, animator._generatedBuilding.tags),
        facilityProfile: sanitizeFacilityProfileLike(animator._generatedBuilding.facilityProfile),
        voxelOptions: Object.assign(
          {
            targetLongest: 112,
            shellOnly: true,
            frontPriority: false,
          },
          animator._generatedBuilding.voxelOptions || {}
        ),
        files: {
          previewDataUrl: animator._generatedBuilding.originalSrc || "",
          previewProcessedDataUrl: animator._generatedBuilding.processedSrc || "",
          frontDataUrl: animator._generatedBuilding.views.front,
          sideDataUrl: animator._generatedBuilding.views.side,
          topDataUrl: animator._generatedBuilding.views.top,
        },
      };
      return fetchJson(LIBRARY_API.saveBuilding, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    function getColumnColorOccupancy(imageData, alphaThreshold = 8) {
      const { width, height, data } = imageData;
      const occupancy = new Uint8Array(width);
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const i = (y * width + x) * 4;
          if (data[i + 3] <= alphaThreshold) continue;
          occupancy[x] = 1;
          break;
        }
      }
      return occupancy;
    }

    function collectColumnSegments(columnOccupancy, minGap = 1) {
      const segments = [];
      let start = -1;
      let gap = 0;

      for (let x = 0; x < columnOccupancy.length; x++) {
        if (columnOccupancy[x]) {
          if (start < 0) start = x;
          gap = 0;
          continue;
        }
        if (start < 0) continue;
        gap += 1;
        if (gap > minGap) {
          segments.push({ startX: start, endX: x - gap });
          start = -1;
          gap = 0;
        }
      }

      if (start >= 0) {
        segments.push({ startX: start, endX: columnOccupancy.length - 1 });
      }
      return segments;
    }

    function measureSegmentBounds(imageData, segment, alphaThreshold = 8) {
      const { width, height, data } = imageData;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      let area = 0;
      let sumX = 0;
      let sumY = 0;

      for (let x = segment.startX; x <= segment.endX; x++) {
        for (let y = 0; y < height; y++) {
          const i = (y * width + x) * 4;
          if (data[i + 3] <= alphaThreshold) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
          area += 1;
          sumX += x;
          sumY += y;
        }
      }

      if (maxX < minX || maxY < minY || area <= 0) return null;
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        area,
        centerX: sumX / area,
        centerY: sumY / area,
      };
    }

    function collectOpaqueComponentsInRect(imageData, startX, startY, width, height, minArea = 24) {
      const visited = new Set();
      const components = [];
      for (let y = startY; y < startY + height; y++) {
        for (let x = startX; x < startX + width; x++) {
          if (getAlphaAt(imageData, x, y) <= 8) continue;
          const key = (y - startY) * width + (x - startX);
          if (visited.has(key)) continue;
          const component = collectConnectedComponent(imageData, x, y, startX, startY, width, height, visited);
          if (component.area >= minArea) components.push(component);
        }
      }
      return components;
    }

    function splitComponentsIntoRows(components) {
      if (!components.length) return [];
      const sorted = components.slice().sort((a, b) => a.centerY - b.centerY);
      const rows = [];
      const avgHeight = sorted.reduce((sum, c) => sum + c.height, 0) / Math.max(1, sorted.length);
      const rowThreshold = Math.max(12, avgHeight * 0.55);
      for (const component of sorted) {
        const lastRow = rows[rows.length - 1];
        if (!lastRow || Math.abs(component.centerY - lastRow.centerY) > rowThreshold) {
          rows.push({ items: [component], centerY: component.centerY });
        } else {
          lastRow.items.push(component);
          lastRow.centerY =
            lastRow.items.reduce((sum, item) => sum + item.centerY, 0) / Math.max(1, lastRow.items.length);
        }
      }
      for (const row of rows) {
        row.items.sort((a, b) => a.centerX - b.centerX);
      }
      return rows;
    }

    function pickThreeViewBoundsFromComponents(components) {
      if (components.length < 3) return null;
      const picked = components
        .slice()
        .sort((a, b) => b.area - a.area)
        .slice(0, 3);
      const rows = splitComponentsIntoRows(picked);
      if (rows.length === 1) {
        const singleRow = rows[0].items.slice().sort((a, b) => a.centerX - b.centerX);
        return { front: singleRow[0], side: singleRow[1], top: singleRow[2] };
      }
      if (rows.length === 2) {
        rows.sort((a, b) => a.centerY - b.centerY);
        const topRow = rows[0].items.slice().sort((a, b) => a.centerX - b.centerX);
        const bottomRow = rows[1].items.slice().sort((a, b) => a.centerX - b.centerX);
        if (topRow.length === 2 && bottomRow.length === 1) {
          return { front: topRow[0], side: topRow[1], top: bottomRow[0] };
        }
        if (topRow.length === 1 && bottomRow.length === 2) {
          return { front: bottomRow[0], side: bottomRow[1], top: topRow[0] };
        }
      }
      return null;
    }

    function cropCanvasRegionToDataUrl(srcCanvas, bounds, pad = 2) {
      const out = document.createElement("canvas");
      out.width = bounds.width + pad * 2;
      out.height = bounds.height + pad * 2;
      const ctx = out.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        srcCanvas,
        bounds.minX,
        bounds.minY,
        bounds.width,
        bounds.height,
        pad,
        pad,
        bounds.width,
        bounds.height
      );
      return out.toDataURL("image/png");
    }

    async function extractBuildingThreeViews(processedSrc) {
      const img = await loadImage(processedSrc);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const columnOccupancy = getColumnColorOccupancy(imageData);
      const minGap = Math.max(8, Math.floor(canvas.width * 0.012));
      const horizontalSegments = collectColumnSegments(columnOccupancy, minGap)
        .map((segment) => measureSegmentBounds(imageData, segment))
        .filter(Boolean)
        .sort((a, b) => a.centerX - b.centerX);
      let segments = horizontalSegments;
      if (segments.length !== 3) {
        const components = collectOpaqueComponentsInRect(imageData, 0, 0, canvas.width, canvas.height, Math.max(36, Math.floor(canvas.width * canvas.height * 0.002)));
        const picked = pickThreeViewBoundsFromComponents(components);
        if (picked) {
          segments = [picked.front, picked.side, picked.top];
        }
      }
      if (segments.length !== 3) {
        throw new Error("建筑三视图切片失败：未识别出 3 个独立视图块。当前仅兼容横向一排或两层排版（俯视图可在第二层）。");
      }

      return {
        front: cropCanvasRegionToDataUrl(canvas, segments[0]),
        side: cropCanvasRegionToDataUrl(canvas, segments[1]),
        top: cropCanvasRegionToDataUrl(canvas, segments[2]),
      };
    }

    function getAlphaAt(imageData, x, y) {
      return imageData.data[(y * imageData.width + x) * 4 + 3];
    }

    function collectConnectedComponent(imageData, startX, startY, cellX, cellY, cellWidth, cellHeight, visited) {
      const queue = [[startX, startY]];
      const keyOf = (x, y) => (y - cellY) * cellWidth + (x - cellX);
      visited.add(keyOf(startX, startY));

      let minX = startX;
      let minY = startY;
      let maxX = startX;
      let maxY = startY;
      let area = 0;
      let sumX = 0;
      let sumY = 0;

      while (queue.length) {
        const [x, y] = queue.pop();
        area += 1;
        sumX += x;
        sumY += y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;

        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx < cellX || ny < cellY || nx >= cellX + cellWidth || ny >= cellY + cellHeight) continue;
          const key = keyOf(nx, ny);
          if (visited.has(key)) continue;
          if (getAlphaAt(imageData, nx, ny) <= 8) continue;
          visited.add(key);
          queue.push([nx, ny]);
        }
      }

      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        area,
        centerX: sumX / area,
        centerY: sumY / area,
      };
    }

    function scoreComponent(component, centerX, centerY) {
      const distance = Math.hypot(component.centerX - centerX, component.centerY - centerY);
      return component.area * 10 - distance;
    }

    function expandComponentBounds(component, startX, startY, width, height) {
      if (!component) return null;
      const marginX = Math.max(2, Math.round(width * 0.04));
      const marginTop = Math.max(2, Math.round(height * 0.04));
      const marginBottom = Math.max(1, Math.round(height * 0.02));
      const expandedMinX = Math.max(0, component.minX - startX - marginX);
      const expandedMinY = Math.max(0, component.minY - startY - marginTop);
      const expandedMaxX = Math.min(width - 1, component.maxX - startX + marginX);
      const expandedMaxY = Math.min(height - 1, component.maxY - startY + marginBottom);

      return {
        minX: expandedMinX,
        minY: expandedMinY,
        maxX: expandedMaxX,
        maxY: expandedMaxY,
        width: expandedMaxX - expandedMinX + 1,
        height: expandedMaxY - expandedMinY + 1,
        anchorX: (component.minX + component.maxX) / 2 - startX - expandedMinX,
        anchorY: component.maxY - startY - expandedMinY,
        area: component.area,
        centerX: component.centerX,
        centerY: component.centerY,
      };
    }

    function collectComponentBoundsInRegion(imageData, startX, startY, width, height, options = {}) {
      const visited = new Set();
      const out = [];
      const minArea = Math.max(1, Number(options.minArea) || 1);
      const minWidth = Math.max(1, Number(options.minWidth) || 1);
      const minHeight = Math.max(1, Number(options.minHeight) || 1);
      for (let y = startY; y < startY + height; y++) {
        for (let x = startX; x < startX + width; x++) {
          if (getAlphaAt(imageData, x, y) <= 8) continue;
          const key = (y - startY) * width + (x - startX);
          if (visited.has(key)) continue;
          const component = collectConnectedComponent(imageData, x, y, startX, startY, width, height, visited);
          if (!component) continue;
          if (component.area < minArea || component.width < minWidth || component.height < minHeight) continue;
          const expanded = expandComponentBounds(component, startX, startY, width, height);
          if (expanded) out.push(expanded);
        }
      }
      out.sort((a, b) => {
        if (Math.abs(a.minX - b.minX) > 1) return a.minX - b.minX;
        return a.minY - b.minY;
      });
      return out;
    }

    function selectLargestComponents(components, count = 6) {
      return (Array.isArray(components) ? components : [])
        .slice()
        .sort((a, b) => (b.area - a.area) || (a.centerY - b.centerY) || (a.centerX - b.centerX))
        .slice(0, Math.max(0, Number(count) || 0));
    }

    function groupIdlePoseComponents(components, expectedCounts = [2, 2, 1, 1]) {
      const sorted = (Array.isArray(components) ? components : [])
        .slice()
        .sort((a, b) => {
          if (Math.abs(a.centerY - b.centerY) > 1) return a.centerY - b.centerY;
          return a.centerX - b.centerX;
        });
      const rows = [];
      for (const component of sorted) {
        if (!component) continue;
        const current = rows[rows.length - 1];
        const rowThreshold = current
          ? Math.max(18, current.avgHeight * 0.72, component.height * 0.72)
          : 0;
        if (!current || (component.centerY - current.maxCenterY) > rowThreshold) {
          rows.push({
            items: [component],
            maxCenterY: component.centerY,
            avgHeight: component.height,
          });
          continue;
        }
        current.items.push(component);
        current.maxCenterY = Math.max(current.maxCenterY, component.centerY);
        current.avgHeight = (
          current.items.reduce((sum, item) => sum + item.height, 0) / current.items.length
        );
      }
      if (rows.length < expectedCounts.length) {
        throw new Error(`idle.png 姿态行不足：期望 ${expectedCounts.length} 行，实际 ${rows.length} 行`);
      }
      return rows.slice(0, expectedCounts.length).map((row, rowIndex) => {
        const need = expectedCounts[rowIndex];
        if (row.items.length < need) {
          throw new Error(`idle.png 第 ${rowIndex + 1} 行姿态不足：期望 ${need} 个，实际 ${row.items.length} 个`);
        }
        return row.items
          .slice()
          .sort((a, b) => a.centerX - b.centerX)
          .slice(0, need);
      });
    }

    function getMainComponentBounds(imageData, startX, startY, width, height) {
      const searchInsetX = Math.max(1, Math.floor(width * 0.16));
      const searchInsetY = Math.max(1, Math.floor(height * 0.16));
      const searchStartX = startX + searchInsetX;
      const searchEndX = startX + width - searchInsetX;
      const searchStartY = startY + searchInsetY;
      const searchEndY = startY + height - searchInsetY;
      const cellCenterX = startX + width / 2;
      const cellCenterY = startY + height / 2;
      const visited = new Set();
      let best = null;

      for (let y = searchStartY; y < searchEndY; y++) {
        for (let x = searchStartX; x < searchEndX; x++) {
          if (getAlphaAt(imageData, x, y) <= 8) continue;
          const key = (y - startY) * width + (x - startX);
          if (visited.has(key)) continue;
          const component = collectConnectedComponent(imageData, x, y, startX, startY, width, height, visited);
          const score = scoreComponent(component, cellCenterX, cellCenterY);
          if (!best || score > best.score) {
            best = { component, score };
          }
        }
      }

      if (!best) {
        // 如果中心区域没找到，退回到整格搜索，避免极端帧被漏掉。
        for (let y = startY; y < startY + height; y++) {
          for (let x = startX; x < startX + width; x++) {
            if (getAlphaAt(imageData, x, y) <= 8) continue;
            const key = (y - startY) * width + (x - startX);
            if (visited.has(key)) continue;
            const component = collectConnectedComponent(imageData, x, y, startX, startY, width, height, visited);
            const score = scoreComponent(component, cellCenterX, cellCenterY);
            if (!best || score > best.score) {
              best = { component, score };
            }
          }
        }
      }

      if (!best) return null;
      return expandComponentBounds(best.component, startX, startY, width, height);

      const c = best.component;
      const marginX = Math.max(2, Math.round(width * 0.04));
      const marginTop = Math.max(2, Math.round(height * 0.04));
      const marginBottom = Math.max(1, Math.round(height * 0.02));
      const expandedMinX = Math.max(0, c.minX - startX - marginX);
      const expandedMinY = Math.max(0, c.minY - startY - marginTop);
      const expandedMaxX = Math.min(width - 1, c.maxX - startX + marginX);
      const expandedMaxY = Math.min(height - 1, c.maxY - startY + marginBottom);

      return {
        minX: expandedMinX,
        minY: expandedMinY,
        maxX: expandedMaxX,
        maxY: expandedMaxY,
        width: expandedMaxX - expandedMinX + 1,
        height: expandedMaxY - expandedMinY + 1,
        // 锚点仍然指向角色主体的脚底中心，而不是扩展后的矩形中心。
        anchorX: (c.minX + c.maxX) / 2 - startX - expandedMinX,
        anchorY: c.maxY - startY - expandedMinY,
      };
    }

    async function normalizeSpriteSheetByAnchor(src, columns, rows) {
      const img = await loadImage(src);
      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = img.naturalWidth || img.width;
      srcCanvas.height = img.naturalHeight || img.height;
      const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
      srcCtx.drawImage(img, 0, 0);
      const sheetData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

      const roughFrameWidth = Math.floor(srcCanvas.width / columns);
      const roughFrameHeight = Math.floor(srcCanvas.height / rows);
      const cells = [];
      let maxContentWidth = 1;
      let maxContentHeight = 1;
      let maxAnchorX = 0;
      let maxAnchorY = 0;
      let maxRight = 0;
      let maxBottom = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const startX = col * roughFrameWidth;
          const startY = row * roughFrameHeight;
          const bounds = getMainComponentBounds(sheetData, startX, startY, roughFrameWidth, roughFrameHeight);
          if (!bounds) {
            cells.push({ row, col, startX, startY, bounds: null });
            continue;
          }
          cells.push({ row, col, startX, startY, bounds });
          if (bounds.width > maxContentWidth) maxContentWidth = bounds.width;
          if (bounds.height > maxContentHeight) maxContentHeight = bounds.height;
          if (bounds.anchorX > maxAnchorX) maxAnchorX = bounds.anchorX;
          if (bounds.anchorY > maxAnchorY) maxAnchorY = bounds.anchorY;
          const right = bounds.width - bounds.anchorX - 1;
          const bottom = bounds.height - bounds.anchorY - 1;
          if (right > maxRight) maxRight = right;
          if (bottom > maxBottom) maxBottom = bottom;
        }
      }

      const pad = 2;
      const normalizedFrameWidth = Math.max(
        roughFrameWidth,
        Math.ceil(maxAnchorX + maxRight + 1 + pad * 2)
      );
      const normalizedFrameHeight = Math.max(
        roughFrameHeight,
        Math.ceil(maxAnchorY + maxBottom + 1 + pad * 2)
      );
      const anchorTargetX = Math.floor(normalizedFrameWidth / 2);
      const anchorTargetY = normalizedFrameHeight - pad - 1;

      const outCanvas = document.createElement("canvas");
      outCanvas.width = normalizedFrameWidth * columns;
      outCanvas.height = normalizedFrameHeight * rows;
      const outCtx = outCanvas.getContext("2d");
      outCtx.imageSmoothingEnabled = false;

      cells.forEach((cell) => {
        const dx0 = cell.col * normalizedFrameWidth;
        const dy0 = cell.row * normalizedFrameHeight;
        if (!cell.bounds) return;
        const b = cell.bounds;
        const srcX = cell.startX + b.minX;
        const srcY = cell.startY + b.minY;
        const destX = dx0 + Math.round(anchorTargetX - b.anchorX);
        const destY = dy0 + Math.round(anchorTargetY - b.anchorY);
        outCtx.drawImage(
          srcCanvas,
          srcX,
          srcY,
          b.width,
          b.height,
          destX,
          destY,
          b.width,
          b.height
        );
      });

      return {
        dataUrl: outCanvas.toDataURL("image/png"),
        canvas: outCanvas,
        frameWidth: normalizedFrameWidth,
        frameHeight: normalizedFrameHeight,
      };
    }

    function describeDirection(row, flip, moving) {
      let name = "下";
      if (row === 0) name = flip ? "右下" : "左下";
      else if (row === 1) name = flip ? "右" : "左";
      else if (row === 2) name = flip ? "右上" : "左上";
      else if (row === 3) name = "上";
      return moving ? name + " 跑动" : name + " 待机";
    }

    function buildSparsePoseAtlas(srcCanvas, entries) {
      if (!Array.isArray(entries) || !entries.length) {
        throw new Error("idle 姿态为空");
      }

      let maxAnchorX = 0;
      let maxAnchorY = 0;
      let maxRight = 0;
      let maxBottom = 0;
      for (const entry of entries) {
        const b = entry.bounds;
        const anchorX = Number.isFinite(Number(b.anchorX)) ? Number(b.anchorX) : ((b.width - 1) / 2);
        const anchorY = Number.isFinite(Number(b.anchorY)) ? Number(b.anchorY) : (b.height - 1);
        entry.anchorX = anchorX;
        entry.anchorY = anchorY;
        if (anchorX > maxAnchorX) maxAnchorX = anchorX;
        if (anchorY > maxAnchorY) maxAnchorY = anchorY;
        const right = b.width - anchorX - 1;
        const bottom = b.height - anchorY - 1;
        if (right > maxRight) maxRight = right;
        if (bottom > maxBottom) maxBottom = bottom;
      }

      const pad = 2;
      const frameWidth = Math.max(1, Math.ceil(maxAnchorX + maxRight + 1 + pad * 2));
      const frameHeight = Math.max(1, Math.ceil(maxAnchorY + maxBottom + 1 + pad * 2));
      const anchorTargetX = Math.floor(frameWidth / 2);
      const anchorTargetY = frameHeight - pad - 1;
      const outCanvas = document.createElement("canvas");
      outCanvas.width = frameWidth * entries.length;
      outCanvas.height = frameHeight;
      const outCtx = outCanvas.getContext("2d");
      outCtx.imageSmoothingEnabled = false;
      const poses = {};

      entries.forEach((entry, index) => {
        const b = entry.bounds;
        const dx0 = index * frameWidth;
        const destX = dx0 + Math.round(anchorTargetX - entry.anchorX);
        const destY = Math.round(anchorTargetY - entry.anchorY);
        outCtx.drawImage(
          srcCanvas,
          b.minX,
          b.minY,
          b.width,
          b.height,
          destX,
          destY,
          b.width,
          b.height
        );
        poses[entry.key] = { index };
      });

      return {
        canvas: outCanvas,
        image: outCanvas,
        frameWidth,
        frameHeight,
        poses,
      };
    }

    // Legacy helper kept only so older dead code below still parses.
    function findOpaqueLineBands(imageData, axis = "row", minOpaquePerLine = 4, minBandThickness = 8) {
      const size = axis === "row" ? imageData.height : imageData.width;
      const crossSize = axis === "row" ? imageData.width : imageData.height;
      const bands = [];
      let start = -1;
      for (let line = 0; line < size; line++) {
        let opaqueCount = 0;
        for (let cross = 0; cross < crossSize; cross++) {
          const x = axis === "row" ? cross : line;
          const y = axis === "row" ? line : cross;
          if (getAlphaAt(imageData, x, y) > 8) opaqueCount += 1;
        }
        const solid = opaqueCount >= minOpaquePerLine;
        if (solid && start < 0) {
          start = line;
        } else if (!solid && start >= 0) {
          if ((line - start) >= minBandThickness) {
            bands.push({ start, end: line - 1 });
          }
          start = -1;
        }
      }
      if (start >= 0 && (size - start) >= minBandThickness) {
        bands.push({ start, end: size - 1 });
      }
      return bands;
    }

    // Canonical idle import path: remove adjacent background first, then
    // detect the six pose bodies from the cleaned image and map them by row.
    async function loadIdlePoseSheetWorkflow(src) {
      const processedSrc = await cleanupIconWhiteFringe(src);
      const img = await loadImage(processedSrc);
      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = img.naturalWidth || img.width;
      srcCanvas.height = img.naturalHeight || img.height;
      const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
      srcCtx.imageSmoothingEnabled = false;
      srcCtx.drawImage(img, 0, 0);
      const imageData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
      const components = collectComponentBoundsInRegion(
        imageData,
        0,
        0,
        srcCanvas.width,
        srcCanvas.height,
        { minArea: 48, minWidth: 8, minHeight: 12 }
      );
      const rows = groupIdlePoseComponents(selectLargestComponents(components, 6), [2, 2, 1, 1]);
      const entries = [
        { key: "front-0", bounds: rows[0]?.[0] || null },
        { key: "front-1", bounds: rows[0]?.[1] || null },
        { key: "side-0", bounds: rows[1]?.[0] || null },
        { key: "side-1", bounds: rows[1]?.[1] || null },
        { key: "back", bounds: rows[2]?.[0] || null },
        { key: "back-diag", bounds: rows[3]?.[0] || null },
      ];
      const missing = entries.filter((entry) => !entry.bounds).map((entry) => entry.key);
      if (missing.length) {
        throw new Error("idle.png missing poses: " + missing.join(", "));
      }
      const atlas = buildSparsePoseAtlas(srcCanvas, entries);
      atlas.sourceDataUrl = srcCanvas.toDataURL("image/png");
      return atlas;
    }

    // Legacy name retained for compatibility; all callers should use the
    // workflow variant above.
    async function loadIdlePoseSheet(src) {
      return loadIdlePoseSheetWorkflow(src);
      const processedSrc = await cleanupIconWhiteFringe(src);
      const img = await loadImage(processedSrc);
      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = img.naturalWidth || img.width;
      srcCanvas.height = img.naturalHeight || img.height;
      const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
      srcCtx.imageSmoothingEnabled = false;
      srcCtx.drawImage(img, 0, 0);
      const imageData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
      const rowBands = findOpaqueLineBands(imageData, "row", 6, 12);
      if (rowBands.length < 4) {
        throw new Error("idle.png 稀疏格子识别失败");
      }
      const idleRows = rowBands.slice(0, 4);
      const idleExpectedCounts = [2, 2, 1, 1];
      const idleRowComponents = idleRows.map((rowBand, rowIndex) => {
        const components = collectComponentBoundsInRegion(
          imageData,
          0,
          rowBand.start,
          srcCanvas.width,
          rowBand.end - rowBand.start + 1,
          { minArea: 48, minWidth: 8, minHeight: 12 }
        );
        if (components.length < idleExpectedCounts[rowIndex]) {
          throw new Error(`idle.png 第 ${rowIndex + 1} 行姿态不足：期望 ${idleExpectedCounts[rowIndex]} 个，实际 ${components.length} 个`);
        }
        return components;
      });
      const getIdleBoundsFromRow = (rowIndex, componentIndex) => {
        const rowBand = idleRows[rowIndex];
        const bounds = idleRowComponents[rowIndex]?.[componentIndex];
        if (!rowBand || !bounds) return null;
        return {
          minX: bounds.minX,
          minY: bounds.minY + rowBand.start,
          maxX: bounds.maxX,
          maxY: bounds.maxY + rowBand.start,
          width: bounds.width,
          height: bounds.height,
          anchorX: bounds.anchorX,
          anchorY: bounds.anchorY,
        };
      };
      const idleEntries = [
        { key: "front-open", bounds: getIdleBoundsFromRow(0, 0) },
        { key: "front-blink", bounds: getIdleBoundsFromRow(0, 1) },
        { key: "side", bounds: getIdleBoundsFromRow(1, 0) },
        { key: "front-diag", bounds: getIdleBoundsFromRow(1, 1) },
        { key: "back", bounds: getIdleBoundsFromRow(2, 0) },
        { key: "back-diag", bounds: getIdleBoundsFromRow(3, 0) },
      ];
      const idleMissing = idleEntries.filter((entry) => !entry.bounds).map((entry) => entry.key);
      if (idleMissing.length) {
        throw new Error("idle.png 缺少姿态：" + idleMissing.join(", "));
      }
      const idleAtlas = buildSparsePoseAtlas(srcCanvas, idleEntries);
      idleAtlas.sourceDataUrl = srcCanvas.toDataURL("image/png");
      return idleAtlas;
      const colBands = findOpaqueLineBands(imageData, "col", 6, 12);
      if (rowBands.length < 4 || colBands.length < 2) {
        throw new Error("idle.png 稀疏格子识别失败");
      }
      const rows = rowBands.slice(0, 4);
      const cols = colBands.slice(0, 2);
      const getBoundsFromBand = (rowIndex, colIndex) => {
        const rowBand = rows[rowIndex];
        const colBand = cols[colIndex];
        if (!rowBand || !colBand) return null;
        return getMainComponentBounds(
          imageData,
          colBand.start,
          rowBand.start,
          colBand.end - colBand.start + 1,
          rowBand.end - rowBand.start + 1
        );
      };
      const entries = [
        { key: "front-open", bounds: getBoundsFromBand(0, 0) },
        { key: "front-blink", bounds: getBoundsFromBand(0, 1) },
        { key: "side", bounds: getBoundsFromBand(1, 0) },
        { key: "front-diag", bounds: getBoundsFromBand(1, 1) },
        { key: "back", bounds: getBoundsFromBand(2, 0) },
        { key: "back-diag", bounds: getBoundsFromBand(3, 0) },
      ];
      const missing = entries.filter((entry) => !entry.bounds).map((entry) => entry.key);
      if (missing.length) {
        throw new Error("idle.png 缺少姿态：" + missing.join(", "));
      }
      return buildSparsePoseAtlas(srcCanvas, entries);
    }

    function getIdlePoseFrameFromSheet(idleSheet, ts, row, flip, options = {}) {
      if (!idleSheet || !idleSheet.poses) return null;
      const idleFrameMs = Math.max(120, Number(options.frameMs) || Number(animator.idleFrameMs) || 1000);
      const phase = (Math.floor(Math.max(0, Number(ts) || 0) / idleFrameMs) % 2) === 1 ? 1 : 0;
      const squashY = 1;
      let key = "front-0";
      let poseFlip = false;

      if (row === 4) {
        key = idleSheet.poses[`front-${phase}`] ? `front-${phase}` : "front-0";
      } else if (row === 3) {
        key = "back";
      } else if (row === 1) {
        key = idleSheet.poses[`side-${phase}`] ? `side-${phase}` : "side-0";
        poseFlip = flip === true;
      } else if (row === 0) {
        key = idleSheet.poses[`side-${phase}`] ? `side-${phase}` : "side-0";
        poseFlip = flip === true;
      } else if (row === 2) {
        key = "back-diag";
        poseFlip = flip === true;
      }

      const pose = idleSheet.poses[key];
      if (!pose) return null;
      return {
        image: idleSheet.image || idleSheet.canvas,
        sx: pose.index * idleSheet.frameWidth,
        sy: 0,
        frameWidth: idleSheet.frameWidth,
        frameHeight: idleSheet.frameHeight,
        flip: poseFlip,
        squashY,
      };
    }

    function getIdlePoseFrame(ts, row, flip) {
      return getIdlePoseFrameFromSheet(animator.idleSheet, ts, row, flip);
    }

    function ensurePlaceholderTilemap() {
      const w = 256;
      const h = 256;
      if (animator.tilemapCanvas.width === w && animator.tilemapCanvas.height === h) return;
      animator.tilemapCanvas.width = w;
      animator.tilemapCanvas.height = h;
      const ctx = animator.tilemapCtx;
      ctx.clearRect(0, 0, w, h);

      // 草地底色（轻微噪声，保证大地图有层次）
      const baseA = [156, 204, 115];
      const baseB = [110, 159, 82];
      const shade = [72, 108, 53];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const n = (x * 17 + y * 31 + ((x ^ y) * 13)) & 255;
          const t = n < 128 ? 0 : 1;
          const c = t ? baseA : baseB;
          ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // 草地阴影斑块
      ctx.fillStyle = "rgba(50,78,38,0.20)";
      for (let i = 0; i < 180; i++) {
        const x = (i * 41) % w;
        const y = (i * 97) % h;
        ctx.fillRect(x, y, 2, 1);
        ctx.fillRect((x + 11) % w, (y + 7) % h, 1, 2);
      }

      // 少量灌木/土色点（用于增加草地层次）
      ctx.fillStyle = "rgba(75,109,56,0.25)";
      for (let i = 0; i < 140; i++) {
        const x = (i * 73 + 19) % w;
        const y = (i * 53 + 7) % h;
        ctx.fillRect(x, y, 2, 1);
        if (i % 3 === 0) ctx.fillRect(x + 1, y - 1, 1, 2);
      }
      ctx.fillStyle = `rgb(${shade[0]},${shade[1]},${shade[2]})`;
      for (let i = 0; i < 110; i++) {
        const x = (i * 29 + 11) % w;
        const y = (i * 83 + 31) % h;
        ctx.fillRect(x, y, 1, 1);
      }

      animator.tilemapPixels = ctx.getImageData(0, 0, w, h).data;
    }

    function sampleTilemap(x, y) {
      const w = animator.tilemapCanvas.width;
      const h = animator.tilemapCanvas.height;
      const sx = ((Math.floor(x) % w) + w) % w;
      const sy = ((Math.floor(y) % h) + h) % h;
      const idx = (sy * w + sx) * 4;
      const data = animator.tilemapPixels;
      return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
    }

    function sanitizeSceneId(raw) {
      const base = String(raw || "").trim().toLowerCase();
      if (!base) return "";
      return base.replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
    }

    function getCurrentSceneId() {
      return getRuntimeSceneId();
    }

    function isInteriorSceneId(id) {
      return /__interior__/.test(String(id || ""));
    }

    function buildInteriorSceneId(parentSceneId, hostObjectId) {
      const parentId = sanitizeSceneId(parentSceneId) || DEFAULT_SCENE_ID;
      return sanitizeSceneId(`${parentId}__interior__house_${Number(hostObjectId) || 0}`) || `${DEFAULT_SCENE_ID}__interior__house_0`;
    }

    function cloneJsonValue(value) {
      if (value == null) return value;
      return JSON.parse(JSON.stringify(value));
    }

    function inferBuildingTag(objOrKind, maybeLabelText) {
      const kind = typeof objOrKind === "string" ? objOrKind : (objOrKind && objOrKind.type) || "";
      if (kind === "hut") return "house";
      const tags = normalizeSemanticTags(
        objOrKind && typeof objOrKind === "object" ? objOrKind.tags : [],
        [maybeLabelText || "", objOrKind?.label || "", objOrKind?.prompt || "", objOrKind?.title || "", objOrKind?.buildingTag || ""].join(" ")
      );
      return primaryBuildingTagFromTags(tags);
    }

    function markSceneObjectsDirty() {
      animator._sceneTagsDirty = true;
      animator._sceneSortRevision = (Number(animator._sceneSortRevision) || 0) + 1;
      animator._sceneSortCacheKey = "";
      animator._sceneSortOrderIds = [];
      animator._sceneSortIndexById = null;
      animator._sceneChunkRevision = -1;
      animator._sceneChunkIndex = null;
    }

    function backfillSceneBuildingTags(force = false) {
      ensureSceneObjects();
      if (!force && !animator._sceneTagsDirty) return;
      for (const o of (animator._sceneObjects || [])) {
        if (!o || !o.model) continue;
        o.interactionTags = normalizeInteractionTags(
          []
            .concat(o.interactionTags || [])
            .concat(Array.isArray(o.tags) ? o.tags : [])
        );
        o.tags = normalizeSemanticTags(o.tags);
        o.buildingTag = primaryBuildingTagFromTags(o.tags);
        o.isHouse = o.tags.includes("house");
        o.properties = buildSceneObjectPropertiesFromSemanticState(
          o.properties,
          o.tags,
          o.interactionTags,
          o
        );
      }
      animator._sceneTagsDirty = false;
    }

    function ensureDefaultSceneSignFixtures(sceneId) {
      if (String(sceneId || "") !== DEFAULT_SCENE_ID) return false;
      let changed = false;
      for (const o of (animator._sceneObjects || [])) {
        if (!o) continue;
        const promptLike = [
          o.label || "",
          o.prompt || "",
          o.asset?.id || "",
          o.asset?.prompt || "",
          o.asset?.libraryMeta?.title || "",
          o.asset?.libraryMeta?.prompt || "",
        ].join(" ");
        if (!/牌坊/.test(promptLike)) continue;
        if (String(o.label || "").trim() !== "牌坊") {
          o.label = "牌坊";
          changed = true;
        }
        const nextTags = normalizeInteractionTags([].concat(o.interactionTags || []).concat(o.tags || []), promptLike);
        if (!nextTags.includes("item:sign")) nextTags.push("item:sign");
        if (JSON.stringify(o.interactionTags || []) !== JSON.stringify(nextTags)) {
          o.interactionTags = nextTags;
          changed = true;
        }
        if (!o.properties || typeof o.properties !== "object") o.properties = {};
        if (!o.properties.sign || typeof o.properties.sign !== "object") {
          o.properties.sign = { type: "sign", text: "库兰村" };
          changed = true;
          continue;
        }
        if (String(o.properties.sign.text || "").trim() !== "库兰村") {
          o.properties.sign.text = "库兰村";
          if (!o.properties.sign.type) o.properties.sign.type = "sign";
          changed = true;
        }
      }
      if (changed) markSceneObjectsDirty();
      return changed;
    }

    function modelToSceneSnapshot(model) {
      if (!model) return null;
      const hut = ensureHutVoxelModel();
      if (hut && model === hut) return { preset: "hut" };
      const solidSnapshot = encodeSolidBitset(model.solid);
      return {
        W: Number(model.W) || 0,
        H: Number(model.H) || 0,
        D: Number(model.D) || 0,
        solid: solidSnapshot,
      };
    }

    function sceneSnapshotToModel(snapshot) {
      if (!snapshot) return null;
      if (snapshot.preset === "hut") return ensureHutVoxelModel();
      const solid = decodeSolidBitset(snapshot.solid) ||
        (Array.isArray(snapshot.solid) ? Uint8Array.from(snapshot.solid) : null);
      const model = {
        W: Number(snapshot.W) || 0,
        H: Number(snapshot.H) || 0,
        D: Number(snapshot.D) || 0,
        list: Array.isArray(snapshot.list) ? snapshot.list.map((v) => ({ x: v.x, y: v.y, z: v.z })) : [],
      };
      if (solid) model.solid = solid;
      if (Array.isArray(snapshot.colors)) model.colors = Uint8ClampedArray.from(snapshot.colors);
      if ((!model.list || !model.list.length) && model.solid) {
        rebuildVoxelListFromSolid(model, true);
      }
      return finalizeVoxelModel(model);
    }

    function interiorToSnapshot(interior) {
      if (!interior || typeof interior !== "object") return null;
      const out = {
        version: Number(interior.version) || 1,
        kind: interior.kind || "house-room",
        width: Math.max(1, Math.floor(Number(interior.width) || 15)),
        height: Math.max(1, Math.floor(Number(interior.height) || 15)),
        door: {
          side: normalizeInteriorDoorSide(interior.door?.side),
          x: Number.isFinite(Number(interior.door?.x)) ? Number(interior.door.x) : 0,
          y: Number.isFinite(Number(interior.door?.y)) ? Number(interior.door.y) : 0,
          entryX: Number.isFinite(Number(interior.door?.entryX)) ? Number(interior.door.entryX) : 0,
          entryY: Number.isFinite(Number(interior.door?.entryY)) ? Number(interior.door.entryY) : 0,
        },
        spawnX: Number.isFinite(Number(interior.spawnX)) ? Number(interior.spawnX) : 0.5,
        spawnY: Number.isFinite(Number(interior.spawnY)) ? Number(interior.spawnY) : 0.5,
        facilities: Array.isArray(interior.facilities)
          ? interior.facilities.map((facility) => ({
              id: facility?.id || "",
              x: Number(facility?.x) || 0,
              y: Number(facility?.y) || 0,
              w: Math.max(1, Number(facility?.w) || 1),
              d: Math.max(1, Number(facility?.d) || 1),
              h: Math.max(0, Number(facility?.h) || 0),
              block: facility?.block !== false,
              top: facility?.top || "",
              sideColor: facility?.sideColor || "",
            }))
          : [],
      };
      return out;
    }

    function interiorRefToSnapshot(ref) {
      if (!ref || typeof ref !== "object") return null;
      const id = sanitizeSceneId(ref.id);
      if (!id) return null;
      return {
        id,
        parentSceneId: sanitizeSceneId(ref.parentSceneId) || "",
        hostObjectId: Number(ref.hostObjectId) || 0,
        version: Number(ref.version) || 1,
      };
    }

    function sanitizeResourceCombatStateForPersistence(resourceCombat) {
      if (!resourceCombat || typeof resourceCombat !== "object") return resourceCombat;
      const next = cloneJsonValue(resourceCombat) || {};
      delete next.lastHitAtMs;
      delete next.shakeDirX;
      delete next.shakeDirY;
      delete next.shakeDurationMs;
      delete next.shakeAmpWorld;
      delete next.shakeUntilMs;
      return next;
    }

    function sanitizeSceneObjectPropertiesForPersistence(properties) {
      if (!properties || typeof properties !== "object") return properties || {};
      const next = cloneJsonValue(properties) || {};
      if (next.resourceCombat && typeof next.resourceCombat === "object") {
        next.resourceCombat = sanitizeResourceCombatStateForPersistence(next.resourceCombat);
      }
      return next;
    }

    function clearTransientResourceCombatState(resourceCombat) {
      if (!resourceCombat || typeof resourceCombat !== "object") return resourceCombat;
      delete resourceCombat.lastHitAtMs;
      delete resourceCombat.shakeDirX;
      delete resourceCombat.shakeDirY;
      delete resourceCombat.shakeDurationMs;
      delete resourceCombat.shakeAmpWorld;
      delete resourceCombat.shakeUntilMs;
      return resourceCombat;
    }

    function clearTransientSceneObjectState(object) {
      if (!object || typeof object !== "object") return object;
      if (object.properties && typeof object.properties === "object") {
        clearTransientResourceCombatState(object.properties.resourceCombat);
      }
      return object;
    }

    function buildSceneObjectPropertiesFromSemanticState(properties, tags, interactionTags, objectLike = null) {
      const next = cloneJsonValue(properties) || {};
      const semanticTags = normalizeSemanticTags(tags);
      if (semanticTags.includes("facility")) {
        next.facility = sanitizeFacilityRecord(next.facility, objectLike);
      } else if (next.facility) {
        delete next.facility;
      }
      return next;
    }

    function sceneObjectToSnapshot(o) {
      return {
        id: o.id,
        type: o.type,
        wx: o.wx,
        wy: o.wy,
        angle: o.angle,
        scale: o.scale,
        label: o.label || "",
        tags: normalizeSemanticTags(o.tags, o.label || ""),
        interactionTags: normalizeInteractionTags([].concat(o.interactionTags || []).concat(Array.isArray(o.tags) ? o.tags : []), o.label || ""),
        drawRoad: normalizeDrawRoad(o.drawRoad, o.tags),
        buildingTag: o.buildingTag || "",
        isHouse: !!o.isHouse,
        _worldGenerated: !!o._worldGenerated,
        asset: o.asset || null,
        interiorRef: interiorRefToSnapshot(o.interiorRef),
        interior: interiorToSnapshot(o.interior),
        properties: sanitizeSceneObjectPropertiesForPersistence(o.properties),
        model: o.model ? modelToSceneSnapshot(o.model) : null,
      };
    }

    function sceneSnapshotToObject(s) {
      const out = {
        id: Number(s.id) || 0,
        type: s.type || "tree",
        wx: Number(s.wx) || 0,
        wy: Number(s.wy) || 0,
        angle: Number.isFinite(Number(s.angle)) ? Number(s.angle) : Math.PI * 0.25,
        scale: Number.isFinite(Number(s.scale)) ? Number(s.scale) : 1,
        label: s.label || "",
        tags: normalizeSemanticTags(
          Array.isArray(s.tags) ? s.tags : [s.isHouse ? "house" : "", s.buildingTag || ""],
          s.label || ""
        ),
        interactionTags: normalizeInteractionTags(s.interactionTags || s.tags, s.label || ""),
        drawRoad: false,
        buildingTag: "",
        isHouse: false,
        _worldGenerated: !!s._worldGenerated,
        asset: s.asset || null,
        interiorRef: interiorRefToSnapshot(s.interiorRef),
        interior: interiorToSnapshot(s.interior),
        properties: sanitizeSceneObjectPropertiesForPersistence(s.properties),
      };
      out.buildingTag = primaryBuildingTagFromTags(out.tags);
      out.isHouse = out.tags.includes("house");
      out.drawRoad = normalizeDrawRoad(s.drawRoad, out.tags);
      out.properties = buildSceneObjectPropertiesFromSemanticState(
        out.properties,
        out.tags,
        out.interactionTags,
        out
      );
      clearTransientSceneObjectState(out);
      if (s.model) out.model = sceneSnapshotToModel(s.model);
      return out;
    }

    function getSceneObjectAssetViews(object) {
      const views = object?.asset?.views;
      if (views?.front && views?.side && views?.top) {
        return views;
      }
      const files = object?.asset?.libraryMeta?.files;
      if (files?.front && files?.side && files?.top) {
        return {
          front: bustAssetUrl(files.front, object.asset.libraryMeta.updatedAt || object.asset.libraryMeta.createdAt || object.asset.libraryMeta.id),
          side: bustAssetUrl(files.side, object.asset.libraryMeta.updatedAt || object.asset.libraryMeta.createdAt || object.asset.libraryMeta.id),
          top: bustAssetUrl(files.top, object.asset.libraryMeta.updatedAt || object.asset.libraryMeta.createdAt || object.asset.libraryMeta.id),
        };
      }
      return null;
    }

    const _sceneObjectLibraryModelBuildCache = new Map();

    function shouldRebuildSceneObjectModelFromLibrary(object) {
      if (!object?.asset?.libraryMeta?.files) return false;
      if (!object?.properties?.zhuYuanzhangBridge) return false;
      const files = object.asset.libraryMeta.files;
      if (!files.front || !files.side || !files.top) return false;
      if (!object.model) return true;
      if (object.model.preset === "hut") return true;
      if (object.model._zhuLibraryModelKey !== getSceneObjectLibraryModelKey(object)) return true;
      return false;
    }

    function getSceneObjectLibraryModelKey(object) {
      const meta = object?.asset?.libraryMeta || {};
      return [
        meta.id || "",
        meta.updatedAt || "",
        meta.createdAt || "",
        JSON.stringify(meta.voxelOptions || {}),
      ].join("|");
    }

    async function rebuildSceneObjectModelFromLibrary(object) {
      const meta = object?.asset?.libraryMeta;
      if (!meta?.files?.front || !meta.files.side || !meta.files.top) return false;
      const key = getSceneObjectLibraryModelKey(object);
      let built = _sceneObjectLibraryModelBuildCache.get(key);
      if (!built) {
        built = await buildGeneratedBuildingStateFromLibraryEntry(meta);
        _sceneObjectLibraryModelBuildCache.set(key, built);
      }
      object.model = built.model;
      object.model._zhuLibraryModelKey = key;
      object.asset = Object.assign({}, object.asset || {}, {
        views: built.views || object.asset?.views || null,
        normalizedViews: built.normalizedViews || object.asset?.normalizedViews || null,
        voxelOptions: built.voxelOptions || object.asset?.voxelOptions || null,
        widthTiles: built.widthTiles || object.asset?.widthTiles || meta.widthTiles || null,
      });
      const modelWidth = getModelLowerBandWidth(object.model, 1 / 8);
      const widthTiles = normalizeWidthTiles(built.widthTiles || meta.widthTiles || object.asset?.widthTiles);
      if (modelWidth > 0) {
        object.scale = Math.max(0.08, Math.min(8, widthTiles / modelWidth));
      }
      return true;
    }

    async function hydrateSceneObjectAssets(objects) {
      if (typeof globalThis.applyTexturedAtlasesFromDataUrls !== "function") return;
      const jobs = [];
      for (const object of (objects || [])) {
        if (shouldRebuildSceneObjectModelFromLibrary(object)) {
          jobs.push(
            rebuildSceneObjectModelFromLibrary(object).catch((err) => {
              console.warn("[scene-library-model-rebuild-failed]", object?.id, err);
            })
          );
          continue;
        }
        if (!object?.model || (object.model._atlasFront && !object.model._fallbackAtlases)) continue;
        const views = getSceneObjectAssetViews(object);
        if (!views) continue;
        object.model._skipRealHutTextures = true;
        jobs.push(
          globalThis.applyTexturedAtlasesFromDataUrls(object.model, {
            frontDataUrl: views.front,
            sideDataUrl: views.side,
            topDataUrl: views.top,
          }).then(() => {
            object.model._fallbackAtlases = false;
          }).catch((err) => {
            console.warn("[scene-asset-hydrate-failed]", object.id, err);
          })
        );
      }
      if (jobs.length) await Promise.all(jobs);
    }

    function compactSceneModelSnapshotForStorage(modelSnapshot) {
      if (!modelSnapshot || typeof modelSnapshot !== "object" || modelSnapshot.preset) return modelSnapshot;
      if (Array.isArray(modelSnapshot.solid)) {
        modelSnapshot.solid = encodeSolidBitset(Uint8Array.from(modelSnapshot.solid));
      }
      if (modelSnapshot.solid && !Array.isArray(modelSnapshot.solid)) {
        delete modelSnapshot.list;
        delete modelSnapshot.colors;
      }
      return modelSnapshot;
    }

    function compactScenePayloadForStorage(scene) {
      if (!scene || !Array.isArray(scene.objects)) return scene;
      for (const objectSnapshot of scene.objects) {
        if (objectSnapshot && objectSnapshot.model) {
          compactSceneModelSnapshotForStorage(objectSnapshot.model);
        }
      }
      return scene;
    }

    function ensureSceneEntities() {
      if (!animator._sceneEntities || typeof animator._sceneEntities !== "object") {
        animator._sceneEntities = {};
      }
      if (!Array.isArray(animator._sceneEntities.npcs)) {
        animator._sceneEntities.npcs = [];
      }
      return animator._sceneEntities;
    }

    function npcEntityToSnapshot(npc) {
      if (!npc || typeof npc !== "object") return null;
      const npcId = String(npc.npcId || "").trim();
      if (!npcId) return null;
      return {
        npcId,
        name: String(npc.name || npcId),
        homeObjectId: Number.isFinite(Number(npc.homeObjectId)) ? Number(npc.homeObjectId) : null,
        sheetCharacterId: String(npc.sheetCharacterId || "").trim() || null,
        renderScale: Number.isFinite(Number(npc.renderScale)) ? clampNpcRenderScale(npc.renderScale, 1) : null,
        heightWorld: Number.isFinite(Number(npc.heightWorld)) ? Math.max(1, Number(npc.heightWorld)) : 4,
        wx: Number(npc.wx) || 0,
        wy: Number(npc.wy) || 0,
        initialWx: Number.isFinite(Number(npc.initialWx)) ? Number(npc.initialWx) : (Number(npc.wx) || 0),
        initialWy: Number.isFinite(Number(npc.initialWy)) ? Number(npc.initialWy) : (Number(npc.wy) || 0),
        needs: npc.needs && typeof npc.needs === "object"
          ? {
              hunger: clampInt(npc.needs.hunger, 0, 100, 15),
              energy: clampInt(npc.needs.energy, 0, 100, 85),
              comfort: clampInt(npc.needs.comfort, 0, 100, 70),
              social: clampInt(npc.needs.social, 0, 100, 55),
              curiosity: clampInt(npc.needs.curiosity, 0, 100, 55),
            }
          : null,
        inventory: cloneJsonValue(
          Array.isArray(npc.inventory)
            ? npc.inventory
            : (npc.inventory && typeof npc.inventory === "object" ? npc.inventory : [])
        ) || [],
        equipment: Array.isArray(npc.equipment) ? cloneJsonValue(npc.equipment) : [],
        memory: Array.isArray(npc.memory) ? npc.memory : [],
        _initialMemory: Array.isArray(npc._initialMemory) ? npc._initialMemory : [],
        emotions: npc.emotions && typeof npc.emotions === "object"
          ? {
              mood: clampInt(npc.emotions.mood, -10, 10, 0),
              stress: clampInt(npc.emotions.stress, 0, 100, 0),
              hope: clampInt(npc.emotions.hope, 0, 100, 0),
              frustration: clampInt(npc.emotions.frustration, 0, 100, 0),
            }
          : null,
        dayPlan: npc.dayPlan && typeof npc.dayPlan === "object"
          ? cloneJsonValue(npc.dayPlan)
          : null,
        currentTask: npc.currentTask && typeof npc.currentTask === "object"
          ? cloneJsonValue(npc.currentTask)
          : null,
        recentEvents: Array.isArray(npc.recentEvents) ? cloneJsonValue(npc.recentEvents) : [],
        relationships: npc.relationships && typeof npc.relationships === "object"
          ? cloneJsonValue(npc.relationships)
          : {},
        current: npc.current && typeof npc.current === "object"
          ? {
              action: String(npc.current.action || "idle"),
              targetWx: Number.isFinite(Number(npc.current.targetWx)) ? Number(npc.current.targetWx) : null,
              targetWy: Number.isFinite(Number(npc.current.targetWy)) ? Number(npc.current.targetWy) : null,
            }
          : { action: "idle", targetWx: null, targetWy: null },
        meta: npc.meta && typeof npc.meta === "object"
          ? {
              role: String(npc.meta.role || ""),
              personality: Array.isArray(npc.meta.personality) ? npc.meta.personality : [],
              skills: Array.isArray(npc.meta.skills) ? npc.meta.skills : [],
              appearancePrompt: String(npc.meta.appearancePrompt || ""),
            }
          : {},
        anchors: npc.anchors && typeof npc.anchors === "object"
          ? cloneJsonValue(npc.anchors)
          : { home: "home", work: "", social: [], boundary: [] },
        dailyPattern: npc.dailyPattern && typeof npc.dailyPattern === "object"
          ? cloneJsonValue(npc.dailyPattern)
          : { archetype: "", wakeMin: 360, sleepMin: 1260, defaultBlocks: [] },
        activityProfile: npc.activityProfile && typeof npc.activityProfile === "object"
          ? cloneJsonValue(npc.activityProfile)
          : { primary: [], secondary: [], facilityUse: [] },
        socialProfile: npc.socialProfile && typeof npc.socialProfile === "object"
          ? cloneJsonValue(npc.socialProfile)
          : { closeTo: [], tradeWith: [], chatTopics: [] },
        emotionBias: npc.emotionBias && typeof npc.emotionBias === "object"
          ? cloneJsonValue(npc.emotionBias)
          : { baselineMood: 0, stressors: [], comforts: [] },
        storyHooks: Array.isArray(npc.storyHooks) ? cloneJsonValue(npc.storyHooks) : [],
      };
    }

    function buildScenePayload(id) {
      ensureSceneObjects();
      ensureSceneEntities();
      backfillSceneBuildingTags();
      const npcSnapshots = (animator._sceneEntities?.npcs || []).map(npcEntityToSnapshot).filter(Boolean);
      return {
        schemaVersion: 1,
        kind: animator.activeSceneKind === "interior" ? "interior" : "world",
        id,
        title: id,
        savedAt: Date.now(),
        nextBuildingId: Number(animator._nextBuildingId) || 1,
        tilemapBaseDataUrl: animator._tilemapBaseImageData ? (() => {
          const c = document.createElement("canvas");
          c.width = animator.tilemapCanvas.width;
          c.height = animator.tilemapCanvas.height;
          c.getContext("2d").putImageData(animator._tilemapBaseImageData, 0, 0);
          return c.toDataURL("image/png");
        })() : animator.tilemapCanvas.toDataURL("image/png"),
        tilemapDataUrl: animator.tilemapCanvas.toDataURL("image/png"),
        objects: (animator._sceneObjects || []).map(sceneObjectToSnapshot),
        roadNetwork: animator._sceneRoadNetwork || null,
        spawn: {
          x: Number(animator.worldX) || 0,
          y: Number(animator.worldY) || 0,
        },
        bounds: animator.activeSceneBounds ? Object.assign({}, animator.activeSceneBounds) : null,
        entities: Object.assign({}, animator._sceneEntities || {}, { npcs: npcSnapshots }),
        extensions: cloneJsonValue(animator._sceneExtensions || {}) || {},
        sceneMeta: cloneJsonValue(animator.activeSceneMeta),
      };
    }

    function sceneStoreFromSceneItems(items, activeId) {
      const scenes = {};
      for (const item of (Array.isArray(items) ? items : [])) {
        if (!item || !item.id) continue;
        scenes[sanitizeSceneId(item.id) || item.id] = item;
      }
      return { activeId: sanitizeSceneId(activeId) || DEFAULT_SCENE_ID, scenes };
    }

    function isStoredScenePayload(scene) {
      if (!scene || typeof scene !== "object") return false;
      return Array.isArray(scene.objects) || typeof scene.tilemapDataUrl === "string" || typeof scene.tilemapBaseDataUrl === "string";
    }

    function cacheScenePayloadInStore(id, scenePayload) {
      const sceneId = sanitizeSceneId(id) || DEFAULT_SCENE_ID;
      if (!scenePayload || typeof scenePayload !== "object") return null;
      if (!animator._sceneStore) animator._sceneStore = loadSceneStore();
      const snapshot = compactScenePayloadForStorage(cloneJsonValue(scenePayload) || {});
      snapshot.id = sceneId;
      snapshot.title = snapshot.title || sceneId;
      animator._sceneStore.scenes[sceneId] = snapshot;
      return snapshot;
    }

    function getCachedScenePayloadFromStore(id) {
      const sceneId = sanitizeSceneId(id) || DEFAULT_SCENE_ID;
      const scene = animator._sceneStore?.scenes?.[sceneId];
      return isStoredScenePayload(scene) ? cloneJsonValue(scene) : null;
    }

    function cacheSceneRuntimePatchInStore(id, runtimePatch) {
      const sceneId = sanitizeSceneId(id) || DEFAULT_SCENE_ID;
      if (!runtimePatch || typeof runtimePatch !== "object") return null;
      if (!animator._sceneStore) animator._sceneStore = loadSceneStore();
      const scene = animator._sceneStore?.scenes?.[sceneId];
      if (!scene || typeof scene !== "object") return null;
      if (runtimePatch.entities && typeof runtimePatch.entities === "object") {
        scene.entities = cloneJsonValue(runtimePatch.entities) || {};
      }
      if (runtimePatch.extensions && typeof runtimePatch.extensions === "object") {
        scene.extensions = cloneJsonValue(runtimePatch.extensions) || {};
      }
      scene.updatedAt = new Date().toISOString();
      return scene;
    }

    function isInteriorScenePayload(scene) {
      if (!scene || typeof scene !== "object") return false;
      return scene.kind === "interior" || scene.sceneMeta?.kind === "interior" || scene.extensions?.sceneKind === "interior";
    }

    function resolveWorldSceneId(preferredIdRaw) {
      const preferredId = sanitizeSceneId(preferredIdRaw) || DEFAULT_SCENE_ID;
      const storeScenes = animator._sceneStore?.scenes || {};
      const sceneLooksWorld = (sceneId) => {
        const id = sanitizeSceneId(sceneId) || "";
        if (!id || isInteriorSceneId(id)) return false;
        const cached = storeScenes[id];
        return !isInteriorScenePayload(cached);
      };
      if (sceneLooksWorld(preferredId)) return preferredId;
      const basePreferred = preferredId.replace(/\d+$/, "");
      const candidates = Object.keys(storeScenes)
        .filter((id) => !isInteriorSceneId(id))
        .filter((id) => sceneLooksWorld(id))
        .sort((a, b) => {
          const score = (id) => {
            if (id === preferredId) return 0;
            if (basePreferred && id.startsWith(basePreferred)) return 1;
            if (id === DEFAULT_SCENE_ID) return 2;
            if (id.startsWith(DEFAULT_SCENE_ID)) return 3;
            return 4;
          };
          const sa = score(a);
          const sb = score(b);
          if (sa !== sb) return sa - sb;
          const ta = Date.parse(storeScenes[a]?.updatedAt || "") || 0;
          const tb = Date.parse(storeScenes[b]?.updatedAt || "") || 0;
          if (ta !== tb) return tb - ta;
          return a.localeCompare(b);
        });
      return candidates[0] || preferredId;
    }

    function getRuntimeSceneId() {
      if (animator.activeSceneKind === "interior") {
        return sanitizeSceneId(
          animator.interiorState?.sceneId ||
          animator._sceneStore?.activeId ||
          (fxSceneId && fxSceneId.value) ||
          ""
        ) || DEFAULT_SCENE_ID;
      }
      return resolveWorldSceneId(
        sanitizeSceneId(
          animator._sceneStore?.activeId ||
          (fxSceneId && fxSceneId.value) ||
          ""
        ) || DEFAULT_SCENE_ID
      );
    }

    function normalizeSceneSaveTargetId(sceneIdRaw) {
      const requestedId = sanitizeSceneId(sceneIdRaw) || "";
      if (animator.activeSceneKind === "interior") {
        return sanitizeSceneId(
          (requestedId && isInteriorSceneId(requestedId) ? requestedId : "") ||
          animator.interiorState?.sceneId ||
          animator._sceneStore?.activeId ||
          requestedId ||
          DEFAULT_SCENE_ID
        ) || DEFAULT_SCENE_ID;
      }
      return resolveWorldSceneId(requestedId || getRuntimeSceneId());
    }

    function resolveResumeSceneId(sceneIdRaw) {
      const sceneId = sanitizeSceneId(sceneIdRaw) || DEFAULT_SCENE_ID;
      const cachedScene = getCachedScenePayloadFromStore(sceneId);
      if (!isInteriorSceneId(sceneId) && !isInteriorScenePayload(cachedScene)) {
        return resolveWorldSceneId(sceneId);
      }
      const parentWorldId = sanitizeSceneId(
        cachedScene?.sceneMeta?.parentSceneId ||
        cachedScene?.sceneMeta?.returnSceneId ||
        cachedScene?.extensions?.parentSceneId ||
        cachedScene?.extensions?.returnSceneId
      );
      if (isInteriorScenePayload(cachedScene) && parentWorldId) {
        return sceneId;
      }
      return resolveWorldSceneId(parentWorldId || sceneId);
    }

    const SCENE_FILE_API_TIMEOUT_MS = isEmbeddedEngine ? 20000 : 5000;

    async function loadSceneStoreFromFiles(activeId) {
      const data = await fetchJson(LIBRARY_API.listScenes, { timeoutMs: SCENE_FILE_API_TIMEOUT_MS });
      return sceneStoreFromSceneItems(data.items, activeId);
    }

    async function loadScenePayloadFromFiles(id) {
      if (isEmbeddedEngine) {
        return fetchJson("/HD2DEG/scene/" + encodeURIComponent(id) + "/scene.json", {
          timeoutMs: SCENE_FILE_API_TIMEOUT_MS,
        });
      }
      try {
        const data = await fetchJson(LIBRARY_API.loadScene + "?id=" + encodeURIComponent(id), {
          timeoutMs: SCENE_FILE_API_TIMEOUT_MS,
        });
        return data && data.scene;
      } catch (apiErr) {
        const staticUrl = "scene/" + encodeURIComponent(id) + "/scene.json";
        try {
          const scene = await fetchJson(staticUrl, {
            timeoutMs: SCENE_FILE_API_TIMEOUT_MS,
          });
          return scene;
        } catch (_) {
          throw apiErr;
        }
      }
    }

    async function saveScenePayloadToFiles(id, scenePayload) {
      return fetchJson(LIBRARY_API.saveScene, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: scenePayload.title || id, scene: compactScenePayloadForStorage(scenePayload) }),
        timeoutMs: SCENE_FILE_API_TIMEOUT_MS,
      });
    }

    async function saveSceneRuntimeToFiles(id, runtimePatch, options = {}) {
      return fetchJson(LIBRARY_API.updateSceneRuntime, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: options.keepalive === true,
        body: JSON.stringify({
          id,
          entities: runtimePatch?.entities || {},
          extensions: runtimePatch?.extensions || {},
        }),
        timeoutMs: SCENE_FILE_API_TIMEOUT_MS,
      });
    }

    function loadSceneStore() {
      const raw = ls(SCENE_STORAGE_KEY);
      if (!raw) return { activeId: DEFAULT_SCENE_ID, scenes: {} };
      try {
        const data = JSON.parse(raw);
        if (data && typeof data === "object") {
          const scenes = data.scenes && typeof data.scenes === "object" ? data.scenes : {};
          Object.keys(scenes).forEach((sceneId) => compactScenePayloadForStorage(scenes[sceneId]));
          return {
            activeId: sanitizeSceneId(data.activeId) || DEFAULT_SCENE_ID,
            scenes,
          };
        }
      } catch (_) {}
      return { activeId: DEFAULT_SCENE_ID, scenes: {} };
    }

    function persistSceneStore() {
      if (!animator._sceneStore) return;
      const payload = JSON.stringify(animator._sceneStore);
      ls(SCENE_STORAGE_KEY, payload);
      return payload.length;
    }

    function resetTilemapToDefaultGrass() {
      animator.tilemapCanvas.width = 0;
      animator.tilemapCanvas.height = 0;
      animator.tilemapPixels = null;
      animator._tilemapBaseImageData = null;
      ensurePlaceholderTilemap();
    }

    function captureTilemapBaseLayer() {
      const w = animator.tilemapCanvas.width;
      const h = animator.tilemapCanvas.height;
      if (!(w > 0 && h > 0)) return;
      animator._tilemapBaseImageData = animator.tilemapCtx.getImageData(0, 0, w, h);
    }

    function restoreTilemapBaseLayer() {
      if (!animator._tilemapBaseImageData) return;
      animator.tilemapCtx.putImageData(animator._tilemapBaseImageData, 0, 0);
    }

    function buildingFrontAccessWorld(o) {
      if (!o || !o.model) return null;
      const angle = Number.isFinite(o.angle) ? o.angle : Math.PI * 0.25;
      const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
      const halfD = Math.max(1, (Number(o.model.D) || 8) * 0.5 * scale);
      const apron = Math.max(2, Math.round(2.5 * scale));
      // 与 rotXZ 的 +z 朝向一致：facade 在前立面边界，outer 在门外
      const dirX = -Math.sin(angle);
      const dirY = Math.cos(angle);
      const facadeX = o.wx + dirX * halfD;
      const facadeY = o.wy + dirY * halfD;
      const polys = getModelCollisionPolygonsWorld(o);
      let outerX = facadeX + dirX * apron;
      let outerY = facadeY + dirY * apron;
      // 若门外接入点仍落在碰撞多边形里，则继续沿正前方推出去，直到完全离开建筑
      if (polys.length) {
        let tries = 0;
        while (tries < 48 && pointInCollisionPolygons2D(outerX, outerY, polys)) {
          outerX += dirX * 0.75;
          outerY += dirY * 0.75;
          tries++;
        }
      }
      return {
        facade: { x: facadeX, y: facadeY },
        outer: { x: outerX, y: outerY },
      };
    }

    function collectRoadObstacleBBoxes(roadHalfWidth = 2) {
      const out = [];
      for (const o of (animator._sceneObjects || [])) {
        if (!o || !o.model) continue;
        const polys = getModelCollisionPolygonsWorld(o);
        if (!polys || !polys.length) continue;
        const bb = o._collisionPolyBBox;
        if (!bb) continue;
        out.push({
          minX: bb.minX - roadHalfWidth - 1,
          minY: bb.minY - roadHalfWidth - 1,
          maxX: bb.maxX + roadHalfWidth + 1,
          maxY: bb.maxY + roadHalfWidth + 1,
        });
      }
      return out;
    }

    function axisSegmentHitsBBox(ax, ay, bx, by, bb) {
      if (Math.abs(ay - by) <= 1e-6) {
        const y = ay;
        if (y <= bb.minY || y >= bb.maxY) return false;
        const minX = Math.min(ax, bx);
        const maxX = Math.max(ax, bx);
        return !(maxX <= bb.minX || minX >= bb.maxX);
      }
      if (Math.abs(ax - bx) <= 1e-6) {
        const x = ax;
        if (x <= bb.minX || x >= bb.maxX) return false;
        const minY = Math.min(ay, by);
        const maxY = Math.max(ay, by);
        return !(maxY <= bb.minY || minY >= bb.maxY);
      }
      return false;
    }

    function axisSegmentHitsAnyBBox(ax, ay, bx, by, boxes) {
      for (const bb of boxes) {
        if (axisSegmentHitsBBox(ax, ay, bx, by, bb)) return true;
      }
      return false;
    }

    function chooseSafeBusCoordinate(points, boxes, horizontalBus, fallbackCoord, minMajor, maxMajor) {
      const candidates = new Set([fallbackCoord]);
      points.forEach((p) => candidates.add(horizontalBus ? p.y : p.x));
      boxes.forEach((bb) => {
        if (horizontalBus) {
          candidates.add(bb.minY);
          candidates.add(bb.maxY);
        } else {
          candidates.add(bb.minX);
          candidates.add(bb.maxX);
        }
      });
      let bestCoord = fallbackCoord;
      let bestScore = Infinity;
      for (const coord of candidates) {
        const intersects = horizontalBus
          ? axisSegmentHitsAnyBBox(minMajor, coord, maxMajor, coord, boxes)
          : axisSegmentHitsAnyBBox(coord, minMajor, coord, maxMajor, boxes);
        const distScore = points.reduce((sum, p) => sum + Math.abs((horizontalBus ? p.y : p.x) - coord), 0);
        const score = distScore + (intersects ? 1e7 : 0);
        if (score < bestScore) {
          bestScore = score;
          bestCoord = coord;
        }
      }
      return bestCoord;
    }

    function dedupeRouteNodes(nodes) {
      const out = [];
      for (const p of nodes) {
        if (!p) continue;
        const x = Number(p.x);
        const y = Number(p.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        if (out.some((q) => Math.abs(q.x - x) < 1e-6 && Math.abs(q.y - y) < 1e-6)) continue;
        out.push({ x, y });
      }
      return out;
    }

    function buildRectilinearRoutePoints(start, end, boxes) {
      const nodes = [start, end];
      for (const bb of boxes) {
        nodes.push(
          { x: bb.minX, y: bb.minY },
          { x: bb.minX, y: bb.maxY },
          { x: bb.maxX, y: bb.minY },
          { x: bb.maxX, y: bb.maxY }
        );
      }
      const pts = dedupeRouteNodes(nodes);
      const n = pts.length;
      const dist = new Array(n).fill(Infinity);
      const prev = new Array(n).fill(-1);
      const used = new Array(n).fill(false);
      dist[0] = 0;

      function canConnect(a, b) {
        if (Math.abs(a.x - b.x) > 1e-6 && Math.abs(a.y - b.y) > 1e-6) return false;
        return !axisSegmentHitsAnyBBox(a.x, a.y, b.x, b.y, boxes);
      }

      for (let step = 0; step < n; step++) {
        let u = -1;
        let best = Infinity;
        for (let i = 0; i < n; i++) {
          if (!used[i] && dist[i] < best) {
            best = dist[i];
            u = i;
          }
        }
        if (u < 0) break;
        if (u === 1) break;
        used[u] = true;
        for (let v = 0; v < n; v++) {
          if (u === v || used[v]) continue;
          if (!canConnect(pts[u], pts[v])) continue;
          const w = Math.abs(pts[u].x - pts[v].x) + Math.abs(pts[u].y - pts[v].y);
          const nd = dist[u] + w;
          if (nd < dist[v]) {
            dist[v] = nd;
            prev[v] = u;
          }
        }
      }

      if (!Number.isFinite(dist[1])) return [start, end];
      const path = [];
      for (let cur = 1; cur >= 0; cur = prev[cur]) {
        path.push(pts[cur]);
        if (cur === 0) break;
      }
      path.reverse();
      return path;
    }

    function buildSegmentsFromRoutePoints(points, width, role) {
      const segs = [];
      for (let i = 0; i + 1 < points.length; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6) continue;
        segs.push({
          ax: a.x,
          ay: a.y,
          bx: b.x,
          by: b.y,
          width,
          baseColor: [210, 156, 92],
          highlightColor: [232, 198, 145],
          role,
        });
      }
      return segs;
    }

    function buildBranchSegmentsToBus(start, horizontalBus, trunkMinor, boxes, width) {
      const segments = [];
      if (horizontalBus) {
        if (!axisSegmentHitsAnyBBox(start.x, start.y, start.x, trunkMinor, boxes)) {
          return [{ ax: start.x, ay: start.y, bx: start.x, by: trunkMinor, width }];
        }
        const xCandidates = [start.x];
        boxes.forEach((bb) => { xCandidates.push(bb.minX, bb.maxX); });
        let best = null;
        let bestScore = Infinity;
        for (const x of xCandidates) {
          const hit1 = axisSegmentHitsAnyBBox(start.x, start.y, x, start.y, boxes);
          const hit2 = axisSegmentHitsAnyBBox(x, start.y, x, trunkMinor, boxes);
          if (hit1 || hit2) continue;
          const score = Math.abs(x - start.x);
          if (score < bestScore) {
            bestScore = score;
            best = x;
          }
        }
        if (best != null && Math.abs(best - start.x) > 1e-6) {
          segments.push({ ax: start.x, ay: start.y, bx: best, by: start.y, width });
          segments.push({ ax: best, ay: start.y, bx: best, by: trunkMinor, width });
          return segments;
        }
        return [{ ax: start.x, ay: start.y, bx: start.x, by: trunkMinor, width }];
      }
      if (!axisSegmentHitsAnyBBox(start.x, start.y, trunkMinor, start.y, boxes)) {
        return [{ ax: start.x, ay: start.y, bx: trunkMinor, by: start.y, width }];
      }
      const yCandidates = [start.y];
      boxes.forEach((bb) => { yCandidates.push(bb.minY, bb.maxY); });
      let best = null;
      let bestScore = Infinity;
      for (const y of yCandidates) {
        const hit1 = axisSegmentHitsAnyBBox(start.x, start.y, start.x, y, boxes);
        const hit2 = axisSegmentHitsAnyBBox(start.x, y, trunkMinor, y, boxes);
        if (hit1 || hit2) continue;
        const score = Math.abs(y - start.y);
        if (score < bestScore) {
          bestScore = score;
          best = y;
        }
      }
      if (best != null && Math.abs(best - start.y) > 1e-6) {
        segments.push({ ax: start.x, ay: start.y, bx: start.x, by: best, width });
        segments.push({ ax: start.x, ay: best, bx: trunkMinor, by: best, width });
        return segments;
      }
      return [{ ax: start.x, ay: start.y, bx: trunkMinor, by: start.y, width }];
    }

    function buildBranchSegmentsToBusRoute(start, busSegments, boxes, width) {
      if (!busSegments || !busSegments.length) return [];
      const candidates = [];
      for (const seg of busSegments) {
        if (Math.abs(seg.ay - seg.by) <= 1e-6) {
          const qx = Math.max(Math.min(start.x, Math.max(seg.ax, seg.bx)), Math.min(seg.ax, seg.bx));
          candidates.push({ x: qx, y: seg.ay });
          candidates.push({ x: seg.ax, y: seg.ay }, { x: seg.bx, y: seg.by });
        } else if (Math.abs(seg.ax - seg.bx) <= 1e-6) {
          const qy = Math.max(Math.min(start.y, Math.max(seg.ay, seg.by)), Math.min(seg.ay, seg.by));
          candidates.push({ x: seg.ax, y: qy });
          candidates.push({ x: seg.ax, y: seg.ay }, { x: seg.bx, y: seg.by });
        }
      }
      const uniq = dedupeRouteNodes(candidates);
      let best = null;
      let bestScore = Infinity;
      for (const q of uniq) {
        const pts = buildRectilinearRoutePoints(start, q, boxes);
        let score = 0;
        for (let i = 0; i + 1 < pts.length; i++) {
          score += Math.abs(pts[i].x - pts[i + 1].x) + Math.abs(pts[i].y - pts[i + 1].y);
        }
        if (score < bestScore) {
          bestScore = score;
          best = pts;
        }
      }
      return buildSegmentsFromRoutePoints(best || [start], width, "branch");
    }

    function sampleSceneRoadColorAtWorld(wx, wy) {
      const meta = animator._sceneRoadMaskMeta;
      const pixels = animator.roadMaskPixels;
      if (!meta || !pixels) return null;
      if (wx < meta.minWorldX || wx > meta.maxWorldX || wy < meta.minWorldY || wy > meta.maxWorldY) return null;
      const mx = Math.floor((wx - meta.minWorldX) * meta.pixelsPerWorld);
      const my = Math.floor((wy - meta.minWorldY) * meta.pixelsPerWorld);
      if (mx < 0 || my < 0 || mx >= meta.width || my >= meta.height) return null;
      const idx = (my * meta.width + mx) * 4;
      const a = pixels[idx + 3];
      if (a < 8) return null;
      return [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
    }

    function rebuildSceneRoadMask() {
      const net = animator._sceneRoadNetwork;
      if (!net || !Array.isArray(net.segments) || !net.segments.length) {
        animator.roadMaskCanvas.width = 1;
        animator.roadMaskCanvas.height = 1;
        animator.roadMaskCtx.clearRect(0, 0, 1, 1);
        animator.roadMaskPixels = null;
        animator._sceneRoadMaskMeta = null;
        return;
      }

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const seg of net.segments) {
        minX = Math.min(minX, seg.minX);
        minY = Math.min(minY, seg.minY);
        maxX = Math.max(maxX, seg.maxX);
        maxY = Math.max(maxY, seg.maxY);
      }
      const padding = 6;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;
      const spanW = Math.max(1, maxX - minX);
      const spanH = Math.max(1, maxY - minY);
      const maxMaskDim = 1024;
      const pixelsPerWorld = Math.max(1, Math.min(4, Math.floor(Math.min(maxMaskDim / spanW, maxMaskDim / spanH))));
      const width = Math.max(2, Math.ceil(spanW * pixelsPerWorld));
      const height = Math.max(2, Math.ceil(spanH * pixelsPerWorld));
      const c = animator.roadMaskCanvas;
      const g = animator.roadMaskCtx;
      c.width = width;
      c.height = height;
      g.clearRect(0, 0, width, height);
      g.imageSmoothingEnabled = false;
      g.save();
      g.translate(-minX * pixelsPerWorld, -minY * pixelsPerWorld);
      g.scale(pixelsPerWorld, pixelsPerWorld);
      g.lineCap = "butt";
      g.lineJoin = "miter";

      for (const seg of net.segments) {
        g.strokeStyle = `rgb(${seg.baseColor[0]},${seg.baseColor[1]},${seg.baseColor[2]})`;
        g.lineWidth = seg.width;
        g.beginPath();
        g.moveTo(seg.ax, seg.ay);
        g.lineTo(seg.bx, seg.by);
        g.stroke();
        g.strokeStyle = `rgb(${seg.highlightColor[0]},${seg.highlightColor[1]},${seg.highlightColor[2]})`;
        g.lineWidth = Math.max(1, seg.width * 0.5);
        g.beginPath();
        g.moveTo(seg.ax, seg.ay);
        g.lineTo(seg.bx, seg.by);
        g.stroke();
      }

      // 建筑碰撞箱作为硬裁剪：一次性从 mask 中抠除
      for (const o of (animator._sceneObjects || [])) {
        if (!o || !o.model) continue;
        const polys = getModelCollisionPolygonsWorld(o);
        if (!polys || !polys.length) continue;
        g.save();
        g.globalCompositeOperation = "destination-out";
        for (const poly of polys) {
          if (!poly || poly.length < 3) continue;
          g.beginPath();
          g.moveTo(poly[0].x, poly[0].y);
          for (let i = 1; i < poly.length; i++) g.lineTo(poly[i].x, poly[i].y);
          g.closePath();
          g.fill();
        }
        g.restore();
      }
      g.restore();

      animator.roadMaskPixels = g.getImageData(0, 0, width, height).data;
      animator._sceneRoadMaskMeta = {
        minWorldX: minX,
        minWorldY: minY,
        maxWorldX: minX + width / pixelsPerWorld,
        maxWorldY: minY + height / pixelsPerWorld,
        pixelsPerWorld,
        width,
        height,
      };
    }

    function rebuildVillageRoadTilemap() {
      backfillSceneBuildingTags();

      const houses = (animator._sceneObjects || []).filter((o) => o && o.model && normalizeDrawRoad(o.drawRoad, o.tags));
      const frontAccesses = houses.map(buildingFrontAccessWorld).filter(Boolean);
      const frontPoints = frontAccesses.map((p) => p.outer);
      animator._sceneRoadNetwork = { points: frontPoints.slice(), segments: [], bounds: null };

      if (frontPoints.length >= 1) {
        const xs = frontPoints.map((p) => p.x);
        const ys = frontPoints.map((p) => p.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const horizontalBus = (maxX - minX) >= (maxY - minY);
        const sortedMinor = (horizontalBus ? ys : xs).slice().sort((a, b) => a - b);
        const fallbackMinor = sortedMinor[Math.floor(sortedMinor.length * 0.5)];
        const roadW = 4;
        const obstacleBoxes = collectRoadObstacleBBoxes(roadW * 0.5);
        const trunkMinor = chooseSafeBusCoordinate(
          frontPoints,
          obstacleBoxes,
          horizontalBus,
          fallbackMinor,
          horizontalBus ? minX : minY,
          horizontalBus ? maxX : maxY
        );
        const busStart = horizontalBus
          ? { x: frontPoints.length >= 2 ? minX : (minX - 28), y: trunkMinor }
          : { x: trunkMinor, y: frontPoints.length >= 2 ? minY : (minY - 28) };
        const busEnd = horizontalBus
          ? { x: frontPoints.length >= 2 ? maxX : (maxX + 28), y: trunkMinor }
          : { x: trunkMinor, y: frontPoints.length >= 2 ? maxY : (maxY + 28) };
        const trunkRoutePoints = buildRectilinearRoutePoints(busStart, busEnd, obstacleBoxes);
        const trunkSegments = buildSegmentsFromRoutePoints(trunkRoutePoints, roadW, "trunk");
        trunkSegments.forEach((seg) => animator._sceneRoadNetwork.segments.push(seg));
        for (let i = 0; i < frontPoints.length; i++) {
          const p = frontPoints[i];
          const access = frontAccesses[i];
          // 先画门前短接，只到房屋外墙正面中心，不会穿过房屋内部
          animator._sceneRoadNetwork.segments.push({
            ax: access.facade.x,
            ay: access.facade.y,
            bx: access.outer.x,
            by: access.outer.y,
            width: Math.max(2, roadW - 1),
            baseColor: [210, 156, 92],
            highlightColor: [232, 198, 145],
            role: "apron",
          });
          const branchSegs = buildBranchSegmentsToBusRoute(
            p,
            trunkSegments,
            obstacleBoxes,
            Math.max(2, roadW - 1)
          );
          for (const seg of branchSegs) {
            animator._sceneRoadNetwork.segments.push({
              ax: seg.ax,
              ay: seg.ay,
              bx: seg.bx,
              by: seg.by,
              width: seg.width,
              baseColor: [210, 156, 92],
              highlightColor: [232, 198, 145],
              role: "branch",
            });
          }
        }
        for (const seg of animator._sceneRoadNetwork.segments) {
          const halfW = Math.max(0.5, Number(seg.width) * 0.5) + 1;
          seg.minX = Math.min(seg.ax, seg.bx) - halfW;
          seg.maxX = Math.max(seg.ax, seg.bx) + halfW;
          seg.minY = Math.min(seg.ay, seg.by) - halfW;
          seg.maxY = Math.max(seg.ay, seg.by) + halfW;
        }
        let minBX = Infinity, minBY = Infinity, maxBX = -Infinity, maxBY = -Infinity;
        for (const seg of animator._sceneRoadNetwork.segments) {
          minBX = Math.min(minBX, seg.minX);
          minBY = Math.min(minBY, seg.minY);
          maxBX = Math.max(maxBX, seg.maxX);
          maxBY = Math.max(maxBY, seg.maxY);
        }
        animator._sceneRoadNetwork.bounds = { minX: minBX, minY: minBY, maxX: maxBX, maxY: maxBY };
      }
      rebuildSceneRoadMask();
      setTextStatus(
        fxSceneStatus,
        "村路 mask 已重建：房屋 " + frontPoints.length + " 个，宽度约 4 tile。"
      );
    }

    function refreshSceneListUi() {
      if (!fxSceneList) return;
      const store = animator._sceneStore || { scenes: {} };
      const ids = Object.keys(store.scenes || {}).filter((id) => !isInteriorSceneId(id)).sort();
      fxSceneList.innerHTML = "";
      ids.forEach((id) => {
        const op = document.createElement("option");
        op.value = id;
        fxSceneList.appendChild(op);
      });
    }

    async function saveActiveScene(sceneIdRaw) {
      const id = normalizeSceneSaveTargetId(sceneIdRaw);
      if (!animator._sceneStore) animator._sceneStore = loadSceneStore();
      const scenePayload = buildScenePayload(id);
      cacheScenePayloadInStore(id, scenePayload);
      animator._sceneStore.activeId = id;
      persistSceneStore();
      refreshSceneListUi();
      if (fxSceneId) fxSceneId.value = id;
      try {
        const result = await saveScenePayloadToFiles(id, scenePayload);
        const item = result.item || { id, title: id };
        if (animator._sceneStore.scenes[id] && typeof animator._sceneStore.scenes[id] === "object") {
          animator._sceneStore.scenes[id].title = item.title || animator._sceneStore.scenes[id].title || id;
        }
        persistSceneStore();
        setTextStatus(fxSceneStatus, "场景已保存到本地文件：scene/" + id + "/scene.json");
        return true;
      } catch (fileErr) {
        console.warn("[scene-file-save-failed]", fileErr);
        setTextStatus(
          fxSceneStatus,
          "场景保存失败：没有写入本地文件。请关闭旧的 python 服务并重新运行 启动本地服务.bat，然后再点保存场景。" +
            (fileErr && fileErr.message ? "（" + fileErr.message + "）" : ""),
          true
        );
        return false;
      }
    }

    function buildSceneRuntimePatchPayload() {
      ensureSceneEntities();
      const entityState = Object.assign({}, animator._sceneEntities || {});
      entityState.npcs = (animator._sceneEntities?.npcs || []).map(npcEntityToSnapshot).filter(Boolean);
      return {
        entities: cloneJsonValue(entityState) || { npcs: [] },
        extensions: cloneJsonValue(animator._sceneExtensions || {}) || {},
      };
    }

    async function saveActiveSceneRuntime(sceneIdRaw, options = {}) {
      const id = normalizeSceneSaveTargetId(sceneIdRaw);
      if (animator._sceneRuntimeSaveUnsupported === true) {
        return saveActiveScene(id);
      }
      if (!animator._sceneStore) animator._sceneStore = loadSceneStore();
      const runtimePatch = buildSceneRuntimePatchPayload();
      cacheSceneRuntimePatchInStore(id, runtimePatch);
      animator._sceneStore.activeId = id;
      if (fxSceneId) fxSceneId.value = id;
      try {
        const result = await saveSceneRuntimeToFiles(id, runtimePatch, options);
        const item = result.item || { id, title: id };
        if (animator._sceneStore.scenes[id] && typeof animator._sceneStore.scenes[id] === "object") {
          animator._sceneStore.scenes[id].title = item.title || animator._sceneStore.scenes[id].title || id;
          animator._sceneStore.scenes[id].updatedAt = item.updatedAt || new Date().toISOString();
        }
        if (!options.silent && fxSceneStatus) {
          setTextStatus(fxSceneStatus, "场景运行态已保存：" + id);
        }
        return true;
      } catch (fileErr) {
        const msg = String((fileErr && fileErr.message) || fileErr || "");
        if ((/\b404\b/.test(msg) || /Not Found/i.test(msg)) && animator._sceneRuntimeSaveUnsupported !== true) {
          animator._sceneRuntimeSaveUnsupported = true;
          console.warn("[scene-runtime-save-fallback-full-save]", fileErr);
          return saveActiveScene(id);
        }
        console.warn("[scene-runtime-save-failed]", fileErr);
        if (!options.silent && fxSceneStatus) {
          setTextStatus(
            fxSceneStatus,
            "场景运行态保存失败：" + (fileErr && fileErr.message ? fileErr.message : String(fileErr || "未知错误")),
            true
          );
        }
        return false;
      }
    }

    function scenePlacementScaleForGeneratedModel(model, widthTiles) {
      const wTiles = normalizeWidthTiles(widthTiles);
      const modelWidth = getModelLowerBandWidth(model, 1 / 8);
      return Math.max(0.08, Math.min(8, wTiles / Math.max(1e-6, modelWidth)));
    }

    function sceneGeneratedBuildingAssetFromState(state) {
      if (!state) return null;
      return {
        kind: "generated-building",
        id: state.id || "",
        prompt: state.prompt || "",
        originalSrc: state.originalSrc || "",
        processedSrc: state.processedSrc || "",
        views: state.views
          ? {
              front: state.views.front || "",
              side: state.views.side || "",
              top: state.views.top || "",
            }
          : null,
        voxelOptions: state.voxelOptions || null,
        normalizedViews: state.normalizedViews || null,
        widthTiles: normalizeWidthTiles(state.widthTiles),
        tags: normalizeSemanticTags(state.tags, state.prompt || ""),
        interactionTags: normalizeInteractionTags(state.interactionTags || state.tags, state.prompt || ""),
        buildingTag: state.buildingTag || primaryBuildingTagFromTags(state.tags),
        drawRoad: normalizeDrawRoad(state.drawRoad, state.tags),
        facilityProfile: sanitizeFacilityProfileLike(state.facilityProfile),
        libraryMeta: state.meta || null,
      };
    }

    function cloneVoxelModelInstance(model) {
      if (!model) return null;
      const out = Object.assign({}, model);
      if (Array.isArray(out.list)) out.list = out.list.map((v) => Object.assign({}, v));
      if (out.solid && typeof out.solid.slice === "function") out.solid = out.solid.slice();
      if (out.colors && typeof out.colors.slice === "function") out.colors = out.colors.slice();
      delete out._greedyQuads;
      delete out._atlasFront;
      delete out._atlasSide;
      delete out._atlasTop;
      delete out._fallbackAtlases;
      delete out._gpuVerts;
      delete out._gpuVertCount;
      delete out._gpuVertsAtlasKey;
      return out;
    }

    function hashSeedText(seedText) {
      const text = String(seedText || "").trim();
      let h = 2166136261 >>> 0;
      for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h ^ (h >>> 16)) >>> 0;
    }

    function createSeededRandom(seed) {
      let x = (seed >>> 0) || 0x9e3779b9;
      return function rand() {
        x = (x + 0x6d2b79f5) >>> 0;
        let t = x;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    async function scatterDefaultSceneResourcesBySeed(seedTextRaw) {
      ensureSceneObjects();
      const seedText = String(seedTextRaw || "").trim() || String(Date.now());
      const extRoot = animator._sceneExtensions || {};
      let items = animator._buildingLibrary || [];
      if (!items.length) {
        const data = await fetchJson(LIBRARY_API.listBuildings);
        items = Array.isArray(data.items) ? data.items : [];
        animator._buildingLibrary = items;
      }
      const byId = new Map(items.map((it) => [String(it.id || ""), it]));
      const treeEntry = byId.get("我的世界-树");
      const coalEntry = byId.get("我的世界煤矿");
      const ironEntry = byId.get("我的世界铁矿");
      if (!treeEntry || !coalEntry || !ironEntry) {
        throw new Error("缺少资源素材：需要 我的世界-树 / 我的世界煤矿 / 我的世界铁矿");
      }

      const keep = [];
      for (const o of (animator._sceneObjects || [])) {
        if (o?.properties?.mcSeededResource === true) continue;
        keep.push(o);
      }
      animator._sceneObjects = keep;
      const seed = hashSeedText(seedText);
      const rand = createSeededRandom(seed);

      const blockers = [];
      for (const o of keep) {
        if (!o || !o.model) continue;
        getModelCollisionPolygonsWorld(o);
        const bb = o._collisionPolyBBox;
        if (!bb) continue;
        blockers.push({
          minX: bb.minX - 2,
          minY: bb.minY - 2,
          maxX: bb.maxX + 2,
          maxY: bb.maxY + 2,
        });
      }
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const bb of blockers) {
        minX = Math.min(minX, bb.minX);
        minY = Math.min(minY, bb.minY);
        maxX = Math.max(maxX, bb.maxX);
        maxY = Math.max(maxY, bb.maxY);
      }
      if (!Number.isFinite(minX)) {
        const cx0 = Number(animator.worldX) || 0;
        const cy0 = Number(animator.worldY) || 0;
        minX = cx0 - 120;
        maxX = cx0 + 120;
        minY = cy0 - 120;
        maxY = cy0 + 120;
      } else {
        minX -= 70; maxX += 70; minY -= 70; maxY += 70;
      }
      const cx = (minX + maxX) * 0.5;
      const cy = (minY + maxY) * 0.5;
      const maxDist = Math.max(40, Math.hypot(maxX - minX, maxY - minY) * 0.5);
      const occupied = keep
        .filter((o) => o && Number.isFinite(Number(o.wx)) && Number.isFinite(Number(o.wy)))
        .map((o) => ({ x: Number(o.wx), y: Number(o.wy), r: 9 }));

      function collidesCircles(x, y, r) {
        for (const c of occupied) {
          const dx = x - c.x;
          const dy = y - c.y;
          const rr = r + c.r;
          if (dx * dx + dy * dy < rr * rr) return true;
        }
        return false;
      }

      function insideBlocker(x, y, r) {
        for (const bb of blockers) {
          if (x >= bb.minX - r && x <= bb.maxX + r && y >= bb.minY - r && y <= bb.maxY + r) return true;
        }
        return false;
      }

      function pickCandidate(kind, radius) {
        for (let attempt = 0; attempt < 420; attempt++) {
          const x = minX + rand() * (maxX - minX);
          const y = minY + rand() * (maxY - minY);
          const dn = Math.hypot(x - cx, y - cy) / maxDist;
          const noise = Math.sin((x + seed * 0.013) * 0.073) + Math.cos((y - seed * 0.009) * 0.067);
          let keepProb = 0.45;
          if (kind === "tree") keepProb = Math.min(0.95, 0.28 + dn * 0.75 + (noise + 2) * 0.06);
          if (kind !== "tree") keepProb = Math.max(0.18, 0.62 - Math.abs(dn - 0.52) * 0.9 + (noise + 2) * 0.03);
          if (rand() > keepProb) continue;
          if (insideBlocker(x, y, radius)) continue;
          if (collidesCircles(x, y, radius)) continue;
          return { x, y };
        }
        return null;
      }

      const plan = [];
      for (let i = 0; i < 28; i++) plan.push({ kind: "tree", entry: treeEntry, label: "我的世界 树" });
      for (let i = 0; i < 8; i++) plan.push({ kind: "coal", entry: coalEntry, label: "我的世界煤矿" });
      for (let i = 0; i < 7; i++) plan.push({ kind: "iron", entry: ironEntry, label: "我的世界铁矿" });
      for (let i = plan.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = plan[i]; plan[i] = plan[j]; plan[j] = t;
      }

      const prevGen = animator._generatedBuilding;
      const templateCache = new Map();
      const placed = { tree: 0, coal: 0, iron: 0 };
      try {
        for (const spec of plan) {
          const key = String(spec.entry.id || "");
          let template = templateCache.get(key);
          if (!template) {
            template = await buildGeneratedBuildingStateFromLibraryEntry(spec.entry);
            templateCache.set(key, template);
          }
          const model = cloneVoxelModelInstance(template.model);
          if (!model) continue;
          const scale = scenePlacementScaleForGeneratedModel(model, template.widthTiles);
          const radius = Math.max(5, (Number(model.W || 8) + Number(model.D || 8)) * 0.22 * scale);
          const p = pickCandidate(spec.kind, radius);
          if (!p) continue;
          const tags = normalizeSemanticTags(template.tags, [spec.label, template.prompt || "", spec.entry.id || ""].join(" "));
          const interactionTags = normalizeInteractionTags(template.interactionTags || template.tags, [spec.label, template.prompt || "", spec.entry.id || ""].join(" "));
          animator._sceneObjects.push({
            id: animator._nextBuildingId++,
            type: "generated",
            wx: p.x,
            wy: p.y,
            angle: rand() * Math.PI * 2,
            scale,
            model,
            label: spec.label,
            tags,
            interactionTags,
            buildingTag: primaryBuildingTagFromTags(tags),
            isHouse: tags.includes("house"),
            drawRoad: normalizeDrawRoad(template.drawRoad, tags),
            _worldGenerated: false,
            asset: sceneGeneratedBuildingAssetFromState(template),
            interior: null,
            properties: buildSceneObjectPropertiesFromSemanticState({
              mcSeededResource: true,
              mcResourceType: spec.kind,
              mcSeed: seedText,
            }, tags, interactionTags, template),
          });
          occupied.push({ x: p.x, y: p.y, r: radius });
          placed[spec.kind] = (placed[spec.kind] || 0) + 1;
        }
      } finally {
        animator._generatedBuilding = prevGen;
      }

      animator._sceneExtensions = Object.assign({}, extRoot, {
        mcResourceScatter: {
          version: 1,
          seed: seedText,
          seedHash: seed,
          savedAt: Date.now(),
          placed,
        },
      });
      markSceneObjectsDirty();
      await hydrateSceneObjectAssets(animator._sceneObjects);
      backfillSceneBuildingTags(true);
      if (animator._sceneRoadNetwork?.segments?.length) {
        rebuildSceneRoadMask();
      } else {
        rebuildVillageRoadTilemap();
      }
      invalidateSceneLightingBake();
      return placed;
    }

    async function loadSceneById(sceneIdRaw, options = {}) {
      const id = sanitizeSceneId(sceneIdRaw) || DEFAULT_SCENE_ID;
      if (!animator._sceneStore) animator._sceneStore = loadSceneStore();
      let scene = null;
      try {
        scene = await loadScenePayloadFromFiles(id);
      } catch (fileErr) {
        scene = getCachedScenePayloadFromStore(id);
      }
      if (!scene) throw new Error("场景不存在：" + id);
      animator._sceneExtensions = scene.extensions && typeof scene.extensions === "object" ? cloneJsonValue(scene.extensions) : {};
      animator._sceneEntities = scene.entities && typeof scene.entities === "object" ? scene.entities : {};
      ensureSceneEntities();
      await hydrateNpcDesignForScene(id, { autosave: false });
      // Runtime-only fields must never be loaded from disk.
      for (const npc of (animator._sceneEntities.npcs || [])) {
        if (!npc || typeof npc !== "object") continue;
        delete npc._runtime;
        // Best-effort: if NPC spawns inside a building due to older saves, nudge them out.
        const wx0 = Number(npc.wx) || 0;
        const wy0 = Number(npc.wy) || 0;
        const fixed = computeNpcSpawnFromBlueprintChar({
          homeObjectId: npc.homeObjectId,
          spawn: { offset: { x: wx0 - (Number(findSceneObjectByIdNumeric(npc.homeObjectId)?.wx) || wx0), y: wy0 - (Number(findSceneObjectByIdNumeric(npc.homeObjectId)?.wy) || wy0) } },
        });
        npc.wx = fixed.x;
        npc.wy = fixed.y;
      }
      if (Array.isArray(animator._sceneEntities?.npcs) && animator._sceneEntities.npcs.length) {
        animator._npcRuntimeEnabled = true;
        animator._npcSim = animator._npcSim || { tickMs: 450, accMs: 0, lastTs: 0 };
      } else {
        animator._npcRuntimeEnabled = false;
      }
      resetTilemapToDefaultGrass();
      if (scene.tilemapBaseDataUrl || scene.tilemapDataUrl) {
        const img = await loadImage(scene.tilemapBaseDataUrl || scene.tilemapDataUrl);
        const w = img.width || 256;
        const h = img.height || 256;
        animator.tilemapCanvas.width = w;
        animator.tilemapCanvas.height = h;
        animator.tilemapCtx.clearRect(0, 0, w, h);
        animator.tilemapCtx.drawImage(img, 0, 0, w, h);
      }
      captureTilemapBaseLayer();
      animator.tilemapPixels = animator.tilemapCtx.getImageData(
        0,
        0,
        animator.tilemapCanvas.width,
        animator.tilemapCanvas.height
      ).data;
      animator._sceneObjects = Array.isArray(scene.objects) ? scene.objects.map(sceneSnapshotToObject) : [];
      markSceneObjectsDirty();
      animator._nextBuildingId = Number(scene.nextBuildingId) || 1;
      await hydrateSceneObjectAssets(animator._sceneObjects);
      backfillSceneBuildingTags();
      let nextSceneMeta = cloneJsonValue(scene.sceneMeta) || null;
      const layoutFromScene = interiorToSnapshot(options.interiorLayout || scene.sceneMeta?.interiorLayout || scene.extensions?.interiorLayout);
      const isInteriorScene = options.runtimeKind === "interior" || scene.kind === "interior";
      if (isInteriorScene) {
        const parentSceneId = sanitizeSceneId(
          options.returnSceneId ||
          nextSceneMeta?.parentSceneId ||
          scene.extensions?.parentSceneId ||
          animator.interiorState.returnSceneId
        ) || DEFAULT_SCENE_ID;
        const hostObjectId = Number(options.hostObjectId ?? nextSceneMeta?.hostObjectId ?? scene.extensions?.hostObjectId) || 0;
        if (!nextSceneMeta || typeof nextSceneMeta !== "object") nextSceneMeta = {};
        nextSceneMeta.kind = "interior";
        nextSceneMeta.parentSceneId = parentSceneId;
        nextSceneMeta.hostObjectId = hostObjectId;
        if (layoutFromScene) nextSceneMeta.interiorLayout = cloneJsonValue(layoutFromScene);
        if (Number.isFinite(Number(options.returnWorldX))) nextSceneMeta.returnWorldX = Number(options.returnWorldX);
        if (Number.isFinite(Number(options.returnWorldY))) nextSceneMeta.returnWorldY = Number(options.returnWorldY);
        animator._sceneExtensions.sceneKind = "interior";
        animator._sceneExtensions.parentSceneId = parentSceneId;
        animator._sceneExtensions.hostObjectId = hostObjectId;
        if (layoutFromScene) animator._sceneExtensions.interiorLayout = cloneJsonValue(layoutFromScene);
        if (Number.isFinite(Number(options.returnWorldX))) animator._sceneExtensions.returnWorldX = Number(options.returnWorldX);
        if (Number.isFinite(Number(options.returnWorldY))) animator._sceneExtensions.returnWorldY = Number(options.returnWorldY);
      }
      animator.activeSceneKind = isInteriorScene ? "interior" : "world";
      animator.activeSceneBounds = scene.bounds && typeof scene.bounds === "object"
        ? {
            minX: Number(scene.bounds.minX) || 0,
            minY: Number(scene.bounds.minY) || 0,
            maxX: Number(scene.bounds.maxX) || 0,
            maxY: Number(scene.bounds.maxY) || 0,
            width: Math.max(1, Number(scene.bounds.width) || (Number(scene.bounds.maxX) - Number(scene.bounds.minX) + 1) || 1),
            height: Math.max(1, Number(scene.bounds.height) || (Number(scene.bounds.maxY) - Number(scene.bounds.minY) + 1) || 1),
          }
        : null;
      animator.activeSceneMeta = nextSceneMeta;
      if (isInteriorScene) {
        animator.interiorState.active = true;
        animator.interiorState.hostObjectId = Number(options.hostObjectId ?? nextSceneMeta?.hostObjectId ?? scene.extensions?.hostObjectId) || 0;
        animator.interiorState.sceneId = id;
        animator.interiorState.returnSceneId = sanitizeSceneId(
          options.returnSceneId ||
          nextSceneMeta?.parentSceneId ||
          scene.extensions?.parentSceneId ||
          animator.interiorState.returnSceneId
        ) || DEFAULT_SCENE_ID;
        if (Number.isFinite(Number(options.returnWorldX))) animator.interiorState.returnWorldX = Number(options.returnWorldX);
        else if (Number.isFinite(Number(nextSceneMeta?.returnWorldX))) animator.interiorState.returnWorldX = Number(nextSceneMeta.returnWorldX);
        else if (Number.isFinite(Number(scene.extensions?.returnWorldX))) animator.interiorState.returnWorldX = Number(scene.extensions.returnWorldX);
        if (Number.isFinite(Number(options.returnWorldY))) animator.interiorState.returnWorldY = Number(options.returnWorldY);
        else if (Number.isFinite(Number(nextSceneMeta?.returnWorldY))) animator.interiorState.returnWorldY = Number(nextSceneMeta.returnWorldY);
        else if (Number.isFinite(Number(scene.extensions?.returnWorldY))) animator.interiorState.returnWorldY = Number(scene.extensions.returnWorldY);
        animator.interiorState.data = layoutFromScene;
      } else {
        clearActiveInteriorState();
      }
      if (!isInteriorScene) ensureDefaultSceneSignFixtures(id);
      if (!isInteriorScene && scene.roadNetwork && Array.isArray(scene.roadNetwork.segments)) {
        animator._sceneRoadNetwork = scene.roadNetwork;
        rebuildSceneRoadMask();
      } else {
        animator._sceneRoadNetwork = null;
        rebuildSceneRoadMask();
        if (!isInteriorScene) rebuildVillageRoadTilemap();
      }
      invalidateSceneLightingBake();
      if (options.useSceneSpawn !== false && scene.spawn && typeof scene.spawn === "object") {
        animator.worldX = Number.isFinite(Number(scene.spawn.x)) ? Number(scene.spawn.x) : animator.worldX;
        animator.worldY = Number.isFinite(Number(scene.spawn.y)) ? Number(scene.spawn.y) : animator.worldY;
      }
      cacheScenePayloadInStore(id, scene);
      animator._sceneStore.activeId = id;
      try {
        persistSceneStore();
      } catch (err) {
        console.warn("[scene-active-id-persist-failed]", err);
      }
      if (fxSceneId) fxSceneId.value = id;
      if (fxResourceSeed) {
        const seeded = animator._sceneExtensions?.mcResourceScatter?.seed;
        fxResourceSeed.value = seeded ? String(seeded) : "";
      }
      refreshNearbyInteractions(getLogicCanvas());
      setTextStatus(fxSceneStatus, "场景已加载：" + id);
    }

    function createNewScene(sceneIdRaw) {
      const id = sanitizeSceneId(sceneIdRaw) || ("scene_" + Date.now().toString(36));
      resetTilemapToDefaultGrass();
      animator._sceneObjects = null;
      animator._sceneExtensions = {};
      animator._sceneEntities = { npcs: [] };
      animator._npcRuntimeEnabled = false;
      animator._nextBuildingId = 1;
      ensureSceneObjects();
      ensureSceneEntities();
      markSceneObjectsDirty();
      backfillSceneBuildingTags();
      animator.activeSceneKind = "world";
      animator.activeSceneBounds = null;
      animator.activeSceneMeta = null;
      clearActiveInteriorState();
      captureTilemapBaseLayer();
      rebuildVillageRoadTilemap();
      invalidateSceneLightingBake();
      if (!animator._sceneStore) animator._sceneStore = loadSceneStore();
      animator._sceneStore.activeId = id;
      if (fxSceneId) fxSceneId.value = id;
      refreshNearbyInteractions(getLogicCanvas());
      setTextStatus(fxSceneStatus, "已新建场景（未保存）：" + id);
    }

    function get2p5dParams() {
      const horizon = animator.horizonY;
      const cameraHeight = animator.cameraHeight;
      const forwardScale = animator.forwardScale;
      const spanBase = animator.spanBase;
      const spanScale = animator.spanScale;
      const worldScale = animator.worldScale;
      return { horizon, cameraHeight, forwardScale, spanBase, spanScale, worldScale };
    }

    function clamp01(x) { return Math.max(0, Math.min(1, x)); }

    function clamp255(x) { return Math.max(0, Math.min(255, x)); }

    function invalidateSceneLightingBake() {
      animator._sceneLightBakeKey = "";
      animator._sceneLightBakeMeta = null;
      animator._sceneLightBakeData = null;
      animator._sceneLightBakeDirty = true;
      if (animator.sceneLightCanvas) {
        animator.sceneLightCanvas.width = 0;
        animator.sceneLightCanvas.height = 0;
      }
    }

    function normalizedSunLighting() {
      const cfg = animator.sunLighting || {};
      let fromX = Number.isFinite(cfg.fromX) ? cfg.fromX : -0.56;
      let fromY = Number.isFinite(cfg.fromY) ? cfg.fromY : -0.83;
      let len = Math.hypot(fromX, fromY) || 1;
      fromX /= len;
      fromY /= len;
      let shadowX = Number.isFinite(cfg.shadowX) ? cfg.shadowX : -fromX;
      let shadowY = Number.isFinite(cfg.shadowY) ? cfg.shadowY : -fromY;
      len = Math.hypot(shadowX, shadowY) || 1;
      return {
        fromX,
        fromY,
        shadowX: shadowX / len,
        shadowY: shadowY / len,
        ambientDarkness: Number.isFinite(cfg.ambientDarkness) ? cfg.ambientDarkness : 0,
        warmth: Number.isFinite(cfg.warmth) ? cfg.warmth : 0.14,
        shadowStrength: Number.isFinite(cfg.shadowStrength) ? cfg.shadowStrength : 0.62,
        shadowLength: Number.isFinite(cfg.shadowLength) ? cfg.shadowLength : 0.55,
        contrast: Number.isFinite(cfg.contrast) ? cfg.contrast : 1,
        reflectionStrength: Number.isFinite(cfg.reflectionStrength) ? cfg.reflectionStrength : 0.18,
        groundDepthDarkness: Number.isFinite(cfg.groundDepthDarkness) ? cfg.groundDepthDarkness : 0.18,
      };
    }

    function buildingFootprintWorld(o) {
      if (!o?.model) return [];
      const W = Number(o.model.W) || 0;
      const D = Number(o.model.D) || 0;
      if (!(W > 0 && D > 0)) return [];
      const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
      const angle = Number.isFinite(o.angle) ? o.angle : Math.PI * 0.25;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      return [
        [-W * 0.5, -D * 0.5],
        [W * 0.5, -D * 0.5],
        [W * 0.5, D * 0.5],
        [-W * 0.5, D * 0.5],
      ].map(([x, z]) => {
        const lx = x * scale;
        const lz = z * scale;
        return {
          x: o.wx + (lx * cosA - lz * sinA),
          y: o.wy + (lx * sinA + lz * cosA),
        };
      });
    }

    function sceneLightingBakeSignature(objects) {
      return objects
        .filter((o) => o && o.model)
        .map((o) => {
          const m = o.model;
          return [
            o.id || 0,
            (Number(o.wx) || 0).toFixed(2),
            (Number(o.wy) || 0).toFixed(2),
            (Number(o.angle) || 0).toFixed(3),
            (Number(o.scale) || 1).toFixed(3),
            Number(m.W) || 0,
            Number(m.H) || 0,
            Number(m.D) || 0,
          ].join(":");
        })
        .join("|");
    }

    function worldToSceneLightPx(meta, wx, wy) {
      return {
        x: (wx - meta.originX) * meta.pxPerWorld,
        y: (wy - meta.originY) * meta.pxPerWorld,
      };
    }

    function drawSceneLightPolygon(ctx, meta, points) {
      if (!points || points.length < 3) return;
      const p0 = worldToSceneLightPx(meta, points[0].x, points[0].y);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < points.length; i++) {
        const p = worldToSceneLightPx(meta, points[i].x, points[i].y);
        ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fill();
    }

    function ensureBakedSceneLighting() {
      if (!animator._sceneLightBakeDirty && animator._sceneLightBakeMeta) return;
      ensureSceneObjects();
      const objects = animator._sceneObjects || [];
      const sun = normalizedSunLighting();
      const key = sceneLightingBakeSignature(objects) +
        `|sun:${sun.shadowX.toFixed(3)},${sun.shadowY.toFixed(3)},${sun.shadowLength.toFixed(3)}`;
      if (animator._sceneLightBakeKey === key && animator._sceneLightBakeMeta) {
        animator._sceneLightBakeDirty = false;
        return;
      }

      const buildings = objects.filter((o) => o && o.model);
      animator._sceneLightBakeKey = key;
      animator._sceneLightBakeMeta = null;
      animator._sceneLightBakeData = null;
      if (!buildings.length) {
        animator._sceneLightBakeMeta = { empty: true };
        animator._sceneLightBakeDirty = false;
        return;
      }

      const items = [];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const o of buildings) {
        const footprint = buildingFootprintWorld(o);
        if (footprint.length < 3) continue;
        const H = Math.max(1, Number(o.model.H) || 1);
        const W = Math.max(1, Number(o.model.W) || 1);
        const D = Math.max(1, Number(o.model.D) || 1);
        const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
        const baseShadowLen = H * scale * 1.85 + Math.max(W, D) * scale * 0.35;
        const shadowLen = Math.max(2, baseShadowLen * sun.shadowLength);
        const cast = { x: sun.shadowX * shadowLen, y: sun.shadowY * shadowLen };
        const shadowPoly = convexHull2D(footprint.concat(footprint.map((p) => ({ x: p.x + cast.x, y: p.y + cast.y }))));
        items.push({ footprint, shadowPoly });
        for (const p of footprint.concat(shadowPoly)) {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        }
      }
      if (!items.length || !Number.isFinite(minX)) {
        animator._sceneLightBakeMeta = { empty: true };
        animator._sceneLightBakeDirty = false;
        return;
      }

      const pad = 24;
      minX -= pad;
      minY -= pad;
      maxX += pad;
      maxY += pad;
      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const maxBakeDim = 1024;
      const pxPerWorld = Math.max(0.22, Math.min(1.15, maxBakeDim / Math.max(spanX, spanY)));
      const width = Math.max(1, Math.ceil(spanX * pxPerWorld));
      const height = Math.max(1, Math.ceil(spanY * pxPerWorld));
      const meta = { originX: minX, originY: minY, pxPerWorld, width, height };

      const c = animator.sceneLightCanvas;
      c.width = width;
      c.height = height;
      const ctx = animator.sceneLightCtx;
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;

      for (const item of items) {
        ctx.fillStyle = "rgba(12,22,34,0.10)";
        drawSceneLightPolygon(ctx, meta, item.shadowPoly);
        ctx.fillStyle = "rgba(10,16,24,0.13)";
        drawSceneLightPolygon(ctx, meta, item.footprint);
      }

      animator._sceneLightBakeMeta = meta;
      animator._sceneLightBakeData = ctx.getImageData(0, 0, width, height).data;
      animator._sceneLightBakeDirty = false;
      ctx.imageSmoothingEnabled = false;
    }

    function voxelFaceLightFactor(face, angleRad) {
      const sun = normalizedSunLighting();
      if (face === "py") return 1.15;
      if (face === "ny") return 0.58;
      let nx = 0, nz = 0;
      if (face === "px") nx = 1;
      else if (face === "nx") nx = -1;
      else if (face === "pz") nz = 1;
      else if (face === "nz") nz = -1;
      const cosA = Math.cos(angleRad || 0);
      const sinA = Math.sin(angleRad || 0);
      const wx = nx * cosA - nz * sinA;
      const wy = nx * sinA + nz * cosA;
      const facingSun = Math.max(0, wx * sun.fromX + wy * sun.fromY);
      const base = Math.max(0.58, Math.min(1.16, 0.70 + facingSun * 0.46));
      return Math.max(0.2, Math.min(1.8, 1 + (base - 1) * Math.max(0, Number(sun.contrast) || 0)));
    }

    function drawLitQuadOverlay(ctx, corners, light) {
      if (!corners || corners.length < 4 || Math.abs(light - 1) < 0.025) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
      ctx.closePath();
      if (light < 1) {
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = Math.min(0.42, (1 - light) * 0.72);
        ctx.fillStyle = "#24364c";
      } else {
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = Math.min(0.20, (light - 1) * 0.85);
        ctx.fillStyle = "#ffd79a";
      }
      ctx.fill();
      ctx.restore();
    }

    /** 地平线（与 screenToWorldOnGround / 雪地绘制一致） */
    function effectiveGroundHorizonForCanvas(canvas) {
      const h = canvas.height;
      return Math.max(0, Math.min(h - 1, Math.floor(animator.horizonY)));
    }

    /**
     * 透视 / 反算 / 雪地 的屏幕锚点：
     * 独立于人物实际绘制结果，避免“先读人物脚底，再把人物画到 pivot”形成回授漂移。
     */
    function getPivotForCanvas(canvas) {
      const w = canvas.width;
      const h = canvas.height;
      const off = Number(animator.viewOffsetY) || 0;
      const hz = effectiveGroundHorizonForCanvas(canvas);
      const clampY = (py) => Math.max(hz + 2, Math.min(h - 2, py));
      const isStage = canvas === animator.stageCanvas && elFxFullscreen.classList.contains("open");
      const px = animator.centerOnPlayer || isStage ? w * 0.5 : animator.posX;
      const baseY = animator.centerOnPlayer || isStage ? h * 0.72 : animator.posY;
      return { px, py: clampY(baseY + off) };
    }

    /** 世界 orbit 点：随 viewYaw 在水平面绕玩家逻辑位置 (worldX,worldY) 平移，与 Q·E 绕轨一致 */
    function pivotWorldWithOrbit() {
      const yaw = Number(animator.viewYaw) || 0;
      const R = Math.max(0, Number(animator.cameraOrbitWorldR) || 0);
      return {
        x: animator.worldX + R * Math.sin(yaw),
        y: animator.worldY + R * Math.cos(yaw),
      };
    }

    /**
     * 视图坐标系：
     * - 锁定目标：玩家逻辑位置 animator.worldX / worldY（画面始终朝向角色）
     * - orbit 点：pivotWorldWithOrbit()（镜头在世界里的绕轨位置）
     * - towardCam: 角色 -> orbit 点；right: 屏幕右方向
     */
    function getOrbitViewFrame(canvas) {
      const pivot = getPivotForCanvas(canvas);
      const targetWorldX = Number(animator.worldX) || 0;
      const targetWorldY = Number(animator.worldY) || 0;
      const orbit = pivotWorldWithOrbit();
      let towardCamX = orbit.x - targetWorldX;
      let towardCamY = orbit.y - targetWorldY;
      let orbitRadius = Math.hypot(towardCamX, towardCamY);
      if (!(orbitRadius > 1e-6)) {
        const yaw = Number(animator.viewYaw) || 0;
        towardCamX = Math.sin(yaw);
        towardCamY = Math.cos(yaw);
        orbitRadius = 0;
      } else {
        towardCamX /= orbitRadius;
        towardCamY /= orbitRadius;
      }
      return {
        pivotScreenX: pivot.px,
        pivotScreenY: pivot.py,
        targetWorldX,
        targetWorldY,
        orbitWorldX: orbit.x,
        orbitWorldY: orbit.y,
        orbitRadius,
        towardCamX,
        towardCamY,
        rightX: towardCamY,
        rightY: -towardCamX,
      };
    }

    function getLogicCanvas() {
      return elFxFullscreen.classList.contains("open") ? animator.stageCanvas : animator.canvas;
    }

    /**
     * 脚底高亮占格：与移动状态 animator.worldX / worldY 一致（角色逻辑格）。
     * 不用 screenToWorld(getPivot) 反算，避免与 pivotWorldWithOrbit 等链叠出格点漂移或「钉在原点附近」。
     */
    function footGroundWorldForCanvas(_canvas) {
      return { worldX: animator.worldX, worldY: animator.worldY };
    }

    /** 在已 putImageData 的雪地之上画脚底格（透视四边形，盖住「脚底深色带」无 tile 像素的问题） */
    function drawFootTileHighlight(ctx, canvas, fxMode) {
      const g = footGroundWorldForCanvas(canvas);
      const tx0 = Math.floor(g.worldX);
      const ty0 = Math.floor(g.worldY);
      const c0 = projectWorldToScreen(tx0, ty0, canvas);
      const c1 = projectWorldToScreen(tx0 + 1, ty0, canvas);
      const c2 = projectWorldToScreen(tx0 + 1, ty0 + 1, canvas);
      const c3 = projectWorldToScreen(tx0, ty0 + 1, canvas);
      const corners = [c0, c1, c2, c3];
      if (corners.some((p) => !p || p.scale <= 0)) return;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = fxMode ? 0.48 : 0.4;
      ctx.fillStyle = fxMode ? "rgba(255, 120, 200, 0.42)" : "rgba(255, 215, 70, 0.45)";
      ctx.beginPath();
      ctx.moveTo(corners[0].sx, corners[0].sy);
      ctx.lineTo(corners[1].sx, corners[1].sy);
      ctx.lineTo(corners[2].sx, corners[2].sy);
      ctx.lineTo(corners[3].sx, corners[3].sy);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = fxMode ? 0.92 : 0.88;
      ctx.strokeStyle = fxMode ? "rgba(255, 240, 200, 0.95)" : "rgba(255, 170, 30, 0.92)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    function projectWorldToScreen(wx, wy, canvas) {
      // 方格 tilemap 透视（对应你给的 Godot shader 单公式）
      // z = cam_dist + (pivot.y - world.y)
      // s = base_scale * cam_height / (cam_height + z * strength)
      // new_world.x = pivot.x + (world.x - pivot.x) * s + (pivot.y - world.y) * ground_skew
      // new_world.y = pivot.y + (world.y - pivot.y) * s
      const { cameraHeight, forwardScale, spanBase, spanScale, worldScale } = get2p5dParams();
      const w = canvas.width;
      const h = canvas.height;

      // 透视参数（复用现有滑杆：spanBase=cam_dist，spanScale=strength）
      const camHeight = Math.max(80, cameraHeight * 92);
      const camDist = Math.max(40, spanBase * 2.2);
      const strength = Math.max(0, (spanScale / 260) * 3.0);
      const baseScale = 4.2 * worldScale;
      const sMin = 0.06;
      const groundSkew = Number.isFinite(animator.groundSkew) ? animator.groundSkew : 0;
      const tilt = Number.isFinite(animator.tilt) ? animator.tilt : 1.0;

      const view = getOrbitViewFrame(canvas);
      const dx = wx - view.targetWorldX;
      const dy = wy - view.targetWorldY;
      const A = dx * view.rightX + dy * view.rightY;
      const B = dx * view.towardCamX + dy * view.towardCamY;

      // 角色逻辑位置固定落在 pivotScreen；orbit 半径决定“镜头退后多远”
      const z = camDist + view.orbitRadius - B;
      if (z <= 0) return { sx: -9999, sy: -9999, scale: 0, depthKey: -9999 };

      const focusZ = camDist + view.orbitRadius;
      const s = perspectiveScaleAtDepth(z, baseScale, camHeight, strength, focusZ, sMin);

      const sx = view.pivotScreenX + A * s - B * groundSkew;
      const sy = view.pivotScreenY + B * s * tilt;
      const scale = s; // 对 sprite 来说，直接用同一个 s 就够“近大远小”
      const depthKey = z;
      return { sx, sy, scale, depthKey };
    }

    function getGroundDepthFrame(canvas) {
      const { cameraHeight, forwardScale, spanBase, spanScale, worldScale } = get2p5dParams();
      const camHeight = Math.max(80, cameraHeight * 92);
      const camDist = Math.max(40, spanBase * 2.2);
      const strength = Math.max(0, (spanScale / 260) * 3.0);
      const ws = worldScale;
      const baseScale = 4.2 * ws;
      const sMin = 0.06;
      const groundSkew = Number.isFinite(animator.groundSkew) ? animator.groundSkew : 0;
      const tilt = Number.isFinite(animator.tilt) ? animator.tilt : 1.0;
      const view = getOrbitViewFrame(canvas);
      const focusZ = camDist + view.orbitRadius;

      function sFromZ(z) {
        return perspectiveScaleAtDepth(z, baseScale, camHeight, strength, focusZ, sMin);
      }

      function screenYFromZ(z) {
        const s = sFromZ(z);
        const B = camDist + view.orbitRadius - z;
        return view.pivotScreenY + B * s * tilt;
      }

      function solveZForScreenY(targetY) {
        const zLo0 = 0.0001;
        const zHi0 = camDist + view.orbitRadius + Math.max(10, forwardScale);
        let lo = zLo0;
        let hi = zHi0;
        const yLo = screenYFromZ(lo);
        const yHi = screenYFromZ(hi);
        if (targetY >= yLo) return lo;
        if (targetY <= yHi) return hi;
        for (let i = 0; i < 18; i++) {
          const mid = (lo + hi) * 0.5;
          const yMid = screenYFromZ(mid);
          if (yMid > targetY) lo = mid;
          else hi = mid;
        }
        return (lo + hi) * 0.5;
      }

      return {
        camDist,
        forwardScale,
        focusZ,
        groundSkew,
        sFromZ,
        solveZForScreenY,
        screenYFromZ,
        tilt,
        view,
      };
    }

    /** 屏幕坐标反算地面世界坐标（与 draw2p5dSnowScene / projectWorldToScreen 同一套 pivot） */
    function screenToWorldOnGround(mx, my, canvas) {
      const h = canvas.height;
      const horizon = effectiveGroundHorizonForCanvas(canvas);
      const depthFrame = getGroundDepthFrame(canvas);

      // 允许整段可 walk 的屏幕 y；勿与 pivotScreenY 绑定，否则 viewOffset 很大时反算恒为 null，snap 失败会把人「锁死」
      if (my < horizon + 2 || my > h - 2) return null;
      const z = depthFrame.solveZForScreenY(my);
      const s = depthFrame.sFromZ(z);
      const B = depthFrame.camDist + depthFrame.view.orbitRadius - z;
      const A = ((mx - depthFrame.view.pivotScreenX) + B * depthFrame.groundSkew) / Math.max(s, 1e-4);
      return {
        worldX: depthFrame.view.targetWorldX + A * depthFrame.view.rightX + B * depthFrame.view.towardCamX,
        worldY: depthFrame.view.targetWorldY + A * depthFrame.view.rightY + B * depthFrame.view.towardCamY,
      };
    }

    /** 仿射映射：纹理三角形 → 屏幕三角形（Canvas 2D，nearest 采样） */
    function drawTextureTriangle(ctx, tex, s0x, s0y, s1x, s1y, s2x, s2y, d0x, d0y, d1x, d1y, d2x, d2y) {
      const det = s0x * (s1y - s2y) + s1x * (s2y - s0y) + s2x * (s0y - s1y);
      if (Math.abs(det) < 1e-8) return;
      const id = 1 / det;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(d0x, d0y);
      ctx.lineTo(d1x, d1y);
      ctx.lineTo(d2x, d2y);
      ctx.closePath();
      ctx.clip();
      const m11 = (d0x * (s1y - s2y) + d1x * (s2y - s0y) + d2x * (s0y - s1y)) * id;
      const m12 = (d0y * (s1y - s2y) + d1y * (s2y - s0y) + d2y * (s0y - s1y)) * id;
      const m21 = (d0x * (s2x - s1x) + d1x * (s0x - s2x) + d2x * (s1x - s0x)) * id;
      const m22 = (d0y * (s2x - s1x) + d1y * (s0x - s2x) + d2y * (s1x - s0x)) * id;
      const dx =
        (d0x * (s1x * s2y - s2x * s1y) + d1x * (s2x * s0y - s0x * s2y) + d2x * (s0x * s1y - s1x * s0y)) * id;
      const dy =
        (d0y * (s1x * s2y - s2x * s1y) + d1y * (s2x * s0y - s0x * s2y) + d2y * (s0x * s1y - s1x * s0y)) * id;
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(m11, m12, m21, m22, dx, dy);
      ctx.drawImage(tex, 0, 0);
      ctx.restore();
    }

    function pickModelAtlas(model, atlasName) {
      if (atlasName === "side") return model._atlasSide;
      if (atlasName === "top") return model._atlasTop;
      return model._atlasFront;
    }

    function buildSolidAtlasCanvas(width, height, color) {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.floor(width) || 1);
      c.height = Math.max(1, Math.floor(height) || 1);
      const g = c.getContext("2d");
      g.imageSmoothingEnabled = false;
      g.fillStyle = color;
      g.fillRect(0, 0, c.width, c.height);
      return c;
    }

    function ensureFallbackBuildingAtlases(model) {
      if (!model || model._atlasFront || !(model.W > 0) || !(model.H > 0) || !(model.D > 0)) return;
      model._atlasFront = buildSolidAtlasCanvas(model.W, model.H, "#4fa0db");
      model._atlasSide = buildSolidAtlasCanvas(model.D, model.H, "#2f6d9d");
      model._atlasTop = buildSolidAtlasCanvas(model.W, model.D, "#89c8ff");
      model._fallbackAtlases = true;
    }

    function createBuildingWebGLRenderer() {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: true,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      });
      if (!gl) return null;

      const vsSource = `#version 300 es
        precision highp float;
        in vec2 a_pos;
        in vec2 a_uv;
        in float a_texIndex;
        in float a_light;
        uniform vec2 u_resolution;
        out vec2 v_uv;
        out float v_light;
        flat out int v_texIndex;
        void main() {
          vec2 clip = vec2(
            (a_pos.x / u_resolution.x) * 2.0 - 1.0,
            1.0 - (a_pos.y / u_resolution.y) * 2.0
          );
          gl_Position = vec4(clip, 0.0, 1.0);
          v_uv = a_uv;
          v_light = a_light;
          v_texIndex = int(a_texIndex + 0.5);
        }
      `;
      const fsSource = `#version 300 es
        precision highp float;
        in vec2 v_uv;
        in float v_light;
        flat in int v_texIndex;
        uniform sampler2D u_texFront;
        uniform sampler2D u_texSide;
        uniform sampler2D u_texTop;
        out vec4 outColor;
        void main() {
          vec4 color;
          if (v_texIndex == 1) {
            color = texture(u_texSide, v_uv);
          } else if (v_texIndex == 2) {
            color = texture(u_texTop, v_uv);
          } else {
            color = texture(u_texFront, v_uv);
          }
          if (color.a <= 0.001) discard;
          float light = clamp(v_light, 0.2, 1.8);
          if (light < 1.0) {
            color.rgb *= light;
            color.rgb = mix(color.rgb, color.rgb * vec3(0.78, 0.86, 1.0), 0.18);
          } else {
            color.rgb = min(vec3(1.0), color.rgb * light + vec3(1.0, 0.78, 0.42) * (light - 1.0) * 0.18);
          }
          outColor = color;
        }
      `;

      function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const info = gl.getShaderInfoLog(shader) || "unknown shader error";
          gl.deleteShader(shader);
          throw new Error("WebGL shader compile failed: " + info);
        }
        return shader;
      }

      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program) || "unknown link error";
        throw new Error("WebGL program link failed: " + info);
      }

      const vao = gl.createVertexArray();
      const vbo = gl.createBuffer();
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

      const stride = 6 * 4;
      const aPos = gl.getAttribLocation(program, "a_pos");
      const aUv = gl.getAttribLocation(program, "a_uv");
      const aTexIndex = gl.getAttribLocation(program, "a_texIndex");
      const aLight = gl.getAttribLocation(program, "a_light");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, stride, 2 * 4);
      gl.enableVertexAttribArray(aTexIndex);
      gl.vertexAttribPointer(aTexIndex, 1, gl.FLOAT, false, stride, 4 * 4);
      gl.enableVertexAttribArray(aLight);
      gl.vertexAttribPointer(aLight, 1, gl.FLOAT, false, stride, 5 * 4);
      gl.bindVertexArray(null);

      const textures = {
        front: gl.createTexture(),
        side: gl.createTexture(),
        top: gl.createTexture(),
      };
      Object.values(textures).forEach((tex) => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      });
      gl.bindTexture(gl.TEXTURE_2D, null);

      gl.useProgram(program);
      gl.uniform1i(gl.getUniformLocation(program, "u_texFront"), 0);
      gl.uniform1i(gl.getUniformLocation(program, "u_texSide"), 1);
      gl.uniform1i(gl.getUniformLocation(program, "u_texTop"), 2);
      gl.useProgram(null);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearDepth(1.0);
      gl.depthFunc(gl.LEQUAL);
      gl.disable(gl.CULL_FACE);

      return {
        canvas,
        gl,
        program,
        vao,
        vbo,
        textures,
        uResolution: gl.getUniformLocation(program, "u_resolution"),
      };
    }

    const BUILDING_FACE_CODE = { py: 0, ny: 1, px: 2, nx: 3, pz: 4, nz: 5 };

    function ensureBuildingGpuVerts(model) {
      if (!model || !model.list || !model.list.length) return null;
      if (typeof globalThis.modelCornerToAtlasUvPx !== "function") return null;
      const greedy = typeof globalThis.ensureGreedyShellQuads === "function"
        ? globalThis.ensureGreedyShellQuads(model)
        : null;
      if (!greedy || !greedy.length) return null;
      const atlasFront = model._atlasFront;
      const atlasSide = model._atlasSide;
      const atlasTop = model._atlasTop;
      if (!atlasFront || !atlasSide || !atlasTop) return null;
      const atlasKey = `${atlasFront.width}x${atlasFront.height}|${atlasSide.width}x${atlasSide.height}|${atlasTop.width}x${atlasTop.height}|${greedy.length}`;
      if (model._gpuVerts && model._gpuVertsAtlasKey === atlasKey) return model._gpuVerts;
      const W = model.W;
      const H = model.H;
      const D = model.D;
      const verts = [];
      for (const q of greedy) {
        const sample = globalThis.modelCornerToAtlasUvPx(q.face, q.c[0][0], q.c[0][1], q.c[0][2], W, H, D);
        const atlasCanvas = pickModelAtlas(model, sample.atlas);
        if (!atlasCanvas || !atlasCanvas.width || !atlasCanvas.height) continue;
        const texIndex = atlasNameToTexIndex(sample.atlas);
        const faceCode = BUILDING_FACE_CODE[q.face] != null ? BUILDING_FACE_CODE[q.face] : 0;
        const corners = [];
        for (let i = 0; i < 4; i++) {
          const px = globalThis.modelCornerToAtlasUvPx(q.face, q.c[i][0], q.c[i][1], q.c[i][2], W, H, D);
          corners.push({
            x: q.c[i][0],
            y: q.c[i][1],
            z: q.c[i][2],
            u: px.u / atlasCanvas.width,
            v: px.v / atlasCanvas.height,
          });
        }
        const order = [0, 1, 2, 0, 2, 3];
        for (const idx of order) {
          const c = corners[idx];
          verts.push(c.x, c.y, c.z, c.u, c.v, faceCode, texIndex);
        }
      }
      const data = new Float32Array(verts);
      model._gpuVerts = data;
      model._gpuVertsAtlasKey = atlasKey;
      model._gpuVertCount = verts.length / 7;
      return data;
    }

    function ensureBuildingGpuProjResources(renderer) {
      if (!renderer) return null;
      if (renderer.gpuProj) return renderer.gpuProj;
      const gl = renderer.gl;
      const vsSource = `#version 300 es
        precision highp float;
        in vec3 a_local;
        in vec2 a_uv;
        in float a_faceCode;
        in float a_texIndex;
        out vec2 v_uv;
        out float v_light;
        out float v_localY;
        flat out int v_texIndex;
        uniform vec2 u_resolution;
        uniform vec2 u_pivot;
        uniform vec2 u_targetWorld;
        uniform vec2 u_right;
        uniform vec2 u_toward;
        uniform float u_orbitRadius;
        uniform float u_camDist;
        uniform float u_camHeight;
        uniform float u_strength;
        uniform float u_baseScale;
        uniform float u_sMin;
        uniform float u_groundSkew;
        uniform float u_tilt;
        uniform vec2 u_buildingPos;
        uniform vec2 u_buildingHalf;
        uniform float u_buildingCos;
        uniform float u_buildingSin;
        uniform float u_buildingScale;
        uniform float u_sinkY;
        uniform vec2 u_sunFrom;
        uniform float u_contrast;
        uniform float u_ghost;
        void main() {
          float lx = (a_local.x - u_buildingHalf.x) * u_buildingScale;
          float lz = (a_local.z - u_buildingHalf.y) * u_buildingScale;
          float rx = lx * u_buildingCos - lz * u_buildingSin;
          float rz = lx * u_buildingSin + lz * u_buildingCos;
          vec2 gw = u_buildingPos + vec2(rx, rz);
          vec2 d = gw - u_targetWorld;
          float A = d.x * u_right.x + d.y * u_right.y;
          float B = d.x * u_toward.x + d.y * u_toward.y;
          float zDepth = u_camDist + u_orbitRadius - B;
          if (zDepth <= 0.0) {
            gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
            v_uv = a_uv;
            v_light = 1.0;
            v_localY = a_local.y;
            v_texIndex = int(a_texIndex + 0.5);
            return;
          }
          float focusZ = u_camDist + u_orbitRadius;
          float s = u_baseScale * (u_camHeight + focusZ * u_strength) / max(0.0001, u_camHeight + zDepth * u_strength);
          s = max(s, u_sMin);
          float sx = u_pivot.x + A * s - B * u_groundSkew;
          float syGround = u_pivot.y + B * s * u_tilt;
          float visibleY = a_local.y;
          float sy = syGround - (visibleY - u_sinkY) * s * u_buildingScale;
          vec2 clip = vec2(
            (sx / u_resolution.x) * 2.0 - 1.0,
            1.0 - (sy / u_resolution.y) * 2.0
          );
          float depth01 = clamp(zDepth / 2000.0 - a_local.y * 0.0005, 0.0, 1.0);
          gl_Position = vec4(clip, depth01 * 2.0 - 1.0, 1.0);
          float light;
          int face = int(a_faceCode + 0.5);
          if (face == 0) {
            light = 1.15;
          } else if (face == 1) {
            light = 0.58;
          } else {
            float nx = 0.0;
            float nz = 0.0;
            if (face == 2) nx = 1.0;
            else if (face == 3) nx = -1.0;
            else if (face == 4) nz = 1.0;
            else if (face == 5) nz = -1.0;
            float wxN = nx * u_buildingCos - nz * u_buildingSin;
            float wyN = nx * u_buildingSin + nz * u_buildingCos;
            float facingSun = max(0.0, wxN * u_sunFrom.x + wyN * u_sunFrom.y);
            float base = clamp(0.70 + facingSun * 0.46, 0.58, 1.16);
            light = clamp(1.0 + (base - 1.0) * max(0.0, u_contrast), 0.2, 1.8);
          }
          if (u_ghost > 0.5) light = 1.0;
          v_uv = a_uv;
          v_light = light;
          v_localY = a_local.y;
          v_texIndex = int(a_texIndex + 0.5);
        }
      `;
      const fsSource = `#version 300 es
        precision highp float;
        in vec2 v_uv;
        in float v_light;
        in float v_localY;
        flat in int v_texIndex;
        uniform sampler2D u_texFront;
        uniform sampler2D u_texSide;
        uniform sampler2D u_texTop;
        uniform float u_clipY;
        out vec4 outColor;
        void main() {
          if (v_localY <= u_clipY) discard;
          vec4 color;
          if (v_texIndex == 1) color = texture(u_texSide, v_uv);
          else if (v_texIndex == 2) color = texture(u_texTop, v_uv);
          else color = texture(u_texFront, v_uv);
          if (color.a <= 0.001) discard;
          float light = clamp(v_light, 0.2, 1.8);
          if (light < 1.0) {
            color.rgb *= light;
            color.rgb = mix(color.rgb, color.rgb * vec3(0.78, 0.86, 1.0), 0.18);
          } else {
            color.rgb = min(vec3(1.0), color.rgb * light + vec3(1.0, 0.78, 0.42) * (light - 1.0) * 0.18);
          }
          outColor = color;
        }
      `;
      function compile(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const info = gl.getShaderInfoLog(shader) || "compile failed";
          gl.deleteShader(shader);
          throw new Error("[building-gpu-proj] vs/fs: " + info);
        }
        return shader;
      }
      let program;
      try {
        const vs = compile(gl.VERTEX_SHADER, vsSource);
        const fs = compile(gl.FRAGMENT_SHADER, fsSource);
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const info = gl.getProgramInfoLog(program) || "link failed";
          throw new Error("[building-gpu-proj] link: " + info);
        }
      } catch (err) {
        console.warn(err);
        return null;
      }
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const stride = 7 * 4;
      const aLocal = gl.getAttribLocation(program, "a_local");
      const aUv = gl.getAttribLocation(program, "a_uv");
      const aFaceCode = gl.getAttribLocation(program, "a_faceCode");
      const aTexIndex = gl.getAttribLocation(program, "a_texIndex");
      const sharedVbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sharedVbo);
      if (aLocal >= 0) {
        gl.enableVertexAttribArray(aLocal);
        gl.vertexAttribPointer(aLocal, 3, gl.FLOAT, false, stride, 0);
      }
      if (aUv >= 0) {
        gl.enableVertexAttribArray(aUv);
        gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, stride, 3 * 4);
      }
      if (aFaceCode >= 0) {
        gl.enableVertexAttribArray(aFaceCode);
        gl.vertexAttribPointer(aFaceCode, 1, gl.FLOAT, false, stride, 5 * 4);
      }
      if (aTexIndex >= 0) {
        gl.enableVertexAttribArray(aTexIndex);
        gl.vertexAttribPointer(aTexIndex, 1, gl.FLOAT, false, stride, 6 * 4);
      }
      gl.bindVertexArray(null);
      gl.useProgram(program);
      const uTexFront = gl.getUniformLocation(program, "u_texFront");
      const uTexSide = gl.getUniformLocation(program, "u_texSide");
      const uTexTop = gl.getUniformLocation(program, "u_texTop");
      if (uTexFront) gl.uniform1i(uTexFront, 0);
      if (uTexSide) gl.uniform1i(uTexSide, 1);
      if (uTexTop) gl.uniform1i(uTexTop, 2);
      gl.useProgram(null);
      const gpuProj = {
        program,
        vao,
        sharedVbo,
        modelVboMap: new WeakMap(),
        attribs: { aLocal, aUv, aFaceCode, aTexIndex },
        uniforms: {
          resolution: gl.getUniformLocation(program, "u_resolution"),
          pivot: gl.getUniformLocation(program, "u_pivot"),
          targetWorld: gl.getUniformLocation(program, "u_targetWorld"),
          right: gl.getUniformLocation(program, "u_right"),
          toward: gl.getUniformLocation(program, "u_toward"),
          orbitRadius: gl.getUniformLocation(program, "u_orbitRadius"),
          camDist: gl.getUniformLocation(program, "u_camDist"),
          camHeight: gl.getUniformLocation(program, "u_camHeight"),
          strength: gl.getUniformLocation(program, "u_strength"),
          baseScale: gl.getUniformLocation(program, "u_baseScale"),
          sMin: gl.getUniformLocation(program, "u_sMin"),
          groundSkew: gl.getUniformLocation(program, "u_groundSkew"),
          tilt: gl.getUniformLocation(program, "u_tilt"),
          buildingPos: gl.getUniformLocation(program, "u_buildingPos"),
          buildingHalf: gl.getUniformLocation(program, "u_buildingHalf"),
          buildingCos: gl.getUniformLocation(program, "u_buildingCos"),
          buildingSin: gl.getUniformLocation(program, "u_buildingSin"),
          buildingScale: gl.getUniformLocation(program, "u_buildingScale"),
          sinkY: gl.getUniformLocation(program, "u_sinkY"),
          clipY: gl.getUniformLocation(program, "u_clipY"),
          sunFrom: gl.getUniformLocation(program, "u_sunFrom"),
          contrast: gl.getUniformLocation(program, "u_contrast"),
          ghost: gl.getUniformLocation(program, "u_ghost"),
        },
      };
      renderer.gpuProj = gpuProj;
      return gpuProj;
    }

    function getOrCreateBuildingModelVbo(renderer, model) {
      const gpuProj = renderer && renderer.gpuProj;
      if (!gpuProj) return null;
      const verts = ensureBuildingGpuVerts(model);
      if (!verts || !verts.length) return null;
      let entry = gpuProj.modelVboMap.get(model);
      const gl = renderer.gl;
      if (!entry) {
        entry = {
          vbo: gl.createBuffer(),
          atlasKey: "",
          vertCount: 0,
        };
        gpuProj.modelVboMap.set(model, entry);
      }
      if (entry.atlasKey !== model._gpuVertsAtlasKey) {
        gl.bindBuffer(gl.ARRAY_BUFFER, entry.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
        entry.atlasKey = model._gpuVertsAtlasKey;
        entry.vertCount = model._gpuVertCount || (verts.length / 7);
      }
      return entry;
    }

    function drawVoxelBuildingGpuProj(ctx, canvas, model, wx, wy, angleRad, ghost, scaleMul, sinkModelY, clipModelY, options) {
      if (!animator.enableBuildingGPUProjection) return false;
      if (!model || !model._atlasFront || !model._atlasSide || !model._atlasTop) return false;
      const renderer = ensureBuildingWebGLRenderer(canvas.width, canvas.height);
      if (!renderer) return false;
      const gpuProj = ensureBuildingGpuProjResources(renderer);
      if (!gpuProj) return false;
      const entry = getOrCreateBuildingModelVbo(renderer, model);
      if (!entry || !entry.vertCount) return false;
      const gl = renderer.gl;
      const frontTex = getCachedBuildingAtlasTexture(renderer, model._atlasFront);
      const sideTex = getCachedBuildingAtlasTexture(renderer, model._atlasSide);
      const topTex = getCachedBuildingAtlasTexture(renderer, model._atlasTop);
      if (!frontTex || !sideTex || !topTex) return false;

      const shouldClear = !options || options.clear !== false;
      const shouldComposite = !options || options.composite !== false;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
      if (shouldClear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(gpuProj.program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, frontTex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, sideTex);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, topTex);

      const { cameraHeight, spanBase, spanScale, worldScale } = get2p5dParams();
      const camHeight = Math.max(80, cameraHeight * 92);
      const camDist = Math.max(40, spanBase * 2.2);
      const strength = Math.max(0, (spanScale / 260) * 3.0);
      const baseScale = 4.2 * worldScale;
      const sMin = 0.06;
      const groundSkew = Number.isFinite(animator.groundSkew) ? animator.groundSkew : 0;
      const tilt = Number.isFinite(animator.tilt) ? animator.tilt : 1.0;
      const view = getOrbitViewFrame(canvas);
      const sun = normalizedSunLighting();
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);
      const buildingScale = Number.isFinite(scaleMul) && scaleMul > 0 ? scaleMul : 1;

      const u = gpuProj.uniforms;
      gl.uniform2f(u.resolution, renderer.canvas.width, renderer.canvas.height);
      gl.uniform2f(u.pivot, view.pivotScreenX, view.pivotScreenY);
      gl.uniform2f(u.targetWorld, view.targetWorldX, view.targetWorldY);
      gl.uniform2f(u.right, view.rightX, view.rightY);
      gl.uniform2f(u.toward, view.towardCamX, view.towardCamY);
      gl.uniform1f(u.orbitRadius, view.orbitRadius);
      gl.uniform1f(u.camDist, camDist);
      gl.uniform1f(u.camHeight, camHeight);
      gl.uniform1f(u.strength, strength);
      gl.uniform1f(u.baseScale, baseScale);
      gl.uniform1f(u.sMin, sMin);
      gl.uniform1f(u.groundSkew, groundSkew);
      gl.uniform1f(u.tilt, tilt);
      gl.uniform2f(u.buildingPos, wx, wy);
      gl.uniform2f(u.buildingHalf, model.W / 2, model.D / 2);
      gl.uniform1f(u.buildingCos, cosA);
      gl.uniform1f(u.buildingSin, sinA);
      gl.uniform1f(u.buildingScale, buildingScale);
      gl.uniform1f(u.sinkY, Math.max(0, Number(sinkModelY) || 0));
      gl.uniform1f(u.clipY, Math.max(0, Number(clipModelY) || 0));
      gl.uniform2f(u.sunFrom, sun.fromX, sun.fromY);
      gl.uniform1f(u.contrast, Math.max(0, Number(sun.contrast) || 0));
      gl.uniform1f(u.ghost, ghost ? 1 : 0);

      gl.bindVertexArray(gpuProj.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, entry.vbo);
      const stride = 7 * 4;
      if (gpuProj.attribs.aLocal >= 0) gl.vertexAttribPointer(gpuProj.attribs.aLocal, 3, gl.FLOAT, false, stride, 0);
      if (gpuProj.attribs.aUv >= 0) gl.vertexAttribPointer(gpuProj.attribs.aUv, 2, gl.FLOAT, false, stride, 3 * 4);
      if (gpuProj.attribs.aFaceCode >= 0) gl.vertexAttribPointer(gpuProj.attribs.aFaceCode, 1, gl.FLOAT, false, stride, 5 * 4);
      if (gpuProj.attribs.aTexIndex >= 0) gl.vertexAttribPointer(gpuProj.attribs.aTexIndex, 1, gl.FLOAT, false, stride, 6 * 4);
      gl.drawArrays(gl.TRIANGLES, 0, entry.vertCount);
      gl.bindVertexArray(null);
      gl.useProgram(null);
      gl.disable(gl.DEPTH_TEST);

      if (shouldComposite) {
        ctx.drawImage(renderer.canvas, 0, 0, canvas.width, canvas.height);
      }
      return true;
    }

    function ensureBuildingWebGLRenderer(width, height) {
      if (!animator._buildingGlRenderer) {
        try {
          animator._buildingGlRenderer = createBuildingWebGLRenderer();
        } catch (err) {
          console.warn("[building-webgl] init failed", err);
          animator._buildingGlRenderer = null;
        }
      }
      const renderer = animator._buildingGlRenderer;
      if (!renderer) return null;
      if (renderer.canvas.width !== width || renderer.canvas.height !== height) {
        renderer.canvas.width = width;
        renderer.canvas.height = height;
        renderer.gl.viewport(0, 0, width, height);
      }
      return renderer;
    }

    function getCachedBuildingAtlasTexture(renderer, atlasCanvas) {
      if (!renderer || !renderer.gl || !atlasCanvas) return null;
      if (!renderer.atlasTextureCache) renderer.atlasTextureCache = new WeakMap();
      const gl = renderer.gl;
      let entry = renderer.atlasTextureCache.get(atlasCanvas);
      if (!entry) {
        entry = {
          texture: gl.createTexture(),
          width: 0,
          height: 0,
        };
        gl.bindTexture(gl.TEXTURE_2D, entry.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        renderer.atlasTextureCache.set(atlasCanvas, entry);
      }
      if (entry.width !== atlasCanvas.width || entry.height !== atlasCanvas.height) {
        gl.bindTexture(gl.TEXTURE_2D, entry.texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
        entry.width = atlasCanvas.width;
        entry.height = atlasCanvas.height;
      }
      return entry.texture;
    }

    function pushWebGLTexturedTriangle(verts, p0, uv0, p1, uv1, p2, uv2, texIndex, light) {
      verts.push(p0.x, p0.y, uv0.u, uv0.v, texIndex, light);
      verts.push(p1.x, p1.y, uv1.u, uv1.v, texIndex, light);
      verts.push(p2.x, p2.y, uv2.u, uv2.v, texIndex, light);
    }

    function atlasNameToTexIndex(atlasName) {
      if (atlasName === "side") return 1;
      if (atlasName === "top") return 2;
      return 0;
    }

    function buildWebGLBuildingVertices(model, preparedQ, W, H, D, angleRad, ghost) {
      const verts = [];
      for (const item of preparedQ) {
        const q = item.q;
        const atlasSample = globalThis.modelCornerToAtlasUvPx(q.face, q.c[0][0], q.c[0][1], q.c[0][2], W, H, D);
        const atlasCanvas = pickModelAtlas(model, atlasSample.atlas);
        if (!atlasCanvas || !atlasCanvas.width || !atlasCanvas.height) continue;
        const texIndex = atlasNameToTexIndex(atlasSample.atlas);
        const uv = q.c.map((co) => {
          const px = globalThis.modelCornerToAtlasUvPx(q.face, co[0], co[1], co[2], W, H, D);
          return {
            u: px.u / atlasCanvas.width,
            v: px.v / atlasCanvas.height,
          };
        });
        const sp = item.corners.map((p) => ({ x: p.x, y: p.y }));
        if (sp.some((pt) => pt.x < -1e8)) continue;
        const light = ghost ? 1 : voxelFaceLightFactor(q.face, angleRad);
        pushWebGLTexturedTriangle(verts, sp[0], uv[0], sp[1], uv[1], sp[2], uv[2], texIndex, light);
        pushWebGLTexturedTriangle(verts, sp[0], uv[0], sp[2], uv[2], sp[3], uv[3], texIndex, light);
      }
      return new Float32Array(verts);
    }

    function clearBuildingWebGLLayer(canvas) {
      const renderer = ensureBuildingWebGLRenderer(canvas.width, canvas.height);
      if (!renderer) return null;
      const gl = renderer.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      return renderer;
    }

    function drawVoxelBuildingWebGLTextured(ctx, canvas, model, preparedQ, W, H, D, angleRad, ghost, options = null) {
      const renderer = ensureBuildingWebGLRenderer(canvas.width, canvas.height);
      if (!renderer) return false;
      const gl = renderer.gl;
      const shouldClear = !options || options.clear !== false;
      const shouldComposite = !options || options.composite !== false;
      const atlasFront = model._atlasFront;
      const atlasSide = model._atlasSide;
      const atlasTop = model._atlasTop;
      if (!atlasFront || !atlasSide || !atlasTop) return false;

      const vertexData = buildWebGLBuildingVertices(model, preparedQ, W, H, D, angleRad, ghost);
      if (!vertexData.length) return false;

      const frontTex = getCachedBuildingAtlasTexture(renderer, atlasFront);
      const sideTex = getCachedBuildingAtlasTexture(renderer, atlasSide);
      const topTex = getCachedBuildingAtlasTexture(renderer, atlasTop);
      if (!frontTex || !sideTex || !topTex) return false;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
      if (shouldClear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.useProgram(renderer.program);
      gl.uniform2f(renderer.uResolution, renderer.canvas.width, renderer.canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, frontTex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, sideTex);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, topTex);
      gl.bindVertexArray(renderer.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);
      gl.bindVertexArray(null);
      gl.useProgram(null);

      if (shouldComposite) {
        ctx.drawImage(renderer.canvas, 0, 0, canvas.width, canvas.height);
      }
      return true;
    }

    function ensureGroundWebGLRenderer(width, height) {
      const ss = Math.max(1, Math.min(3, Number(animator.groundWebGLSupersample) || 1));
      const renderW = Math.max(1, Math.floor(width * ss));
      const renderH = Math.max(1, Math.floor(height * ss));
      if (animator._groundGlRenderer && animator._groundGlRenderer.gl) {
        const renderer = animator._groundGlRenderer;
        if (renderer.canvas.width !== renderW || renderer.canvas.height !== renderH) {
          renderer.canvas.width = renderW;
          renderer.canvas.height = renderH;
          renderer.gl.viewport(0, 0, renderW, renderH);
        }
        renderer.logicalWidth = width;
        renderer.logicalHeight = height;
        renderer.supersample = ss;
        return renderer;
      }
      const canvas = document.createElement("canvas");
      canvas.width = renderW;
      canvas.height = renderH;
      const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
      if (!gl) return null;
      const vsSource = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
      const fsSource = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTileTex;
uniform sampler2D uRoadTex;
uniform sampler2D uLightTex;
uniform vec2 uTileSize;
uniform float uHasRoad;
uniform vec4 uRoadBounds;
uniform float uHasShadow;
uniform vec4 uLightMeta;
uniform vec2 uLightSize;
uniform float uShadowMult;
uniform float uWarmth;
uniform float uReflectionStrength;
uniform float uGroundDepthDarkness;
uniform float uFxBoost;
uniform vec2 uPivot;
uniform vec2 uWorldTarget;
uniform vec2 uRight;
uniform vec2 uToward;
uniform float uOrbitRadius;
uniform float uCamDist;
uniform float uForwardScale;
uniform float uCamHeight;
uniform float uStrength;
uniform float uBaseScale;
uniform float uSMin;
uniform float uGroundSkew;
uniform float uTilt;
uniform float uHorizon;
uniform float uRenderRadius;
uniform vec3 uSkyColor;
uniform vec3 uFarColor;
out vec4 outColor;
float perspectiveScale(float z, float focusZ) {
  float denom = uCamHeight + z * uStrength;
  float s = (denom > 1e-6) ? (uBaseScale * uCamHeight / denom) : uSMin;
  float focus = (uCamHeight + focusZ * uStrength) / max(uCamHeight, 1e-6);
  return max(uSMin, s * focus);
}
float screenYFromZ(float z, float focusZ) {
  float s = perspectiveScale(z, focusZ);
  float B = uCamDist + uOrbitRadius - z;
  return uPivot.y + B * s * uTilt;
}
float solveZ(float yTarget) {
  float focusZ = uCamDist + uOrbitRadius;
  float lo = 0.0001;
  float hi = uCamDist + uOrbitRadius + max(10.0, uForwardScale);
  float yLo = screenYFromZ(lo, focusZ);
  float yHi = screenYFromZ(hi, focusZ);
  if (yTarget >= yLo) return lo;
  if (yTarget <= yHi) return hi;
  for (int i = 0; i < 10; i++) {
    float mid = (lo + hi) * 0.5;
    float yMid = screenYFromZ(mid, focusZ);
    if (yMid > yTarget) lo = mid;
    else hi = mid;
  }
  return (lo + hi) * 0.5;
}
void main() {
  // 与 CPU Canvas2D 版一致：每个屏幕整数像素反算一次世界坐标。
  vec2 frag = vec2(floor(gl_FragCoord.x), floor(uResolution.y - gl_FragCoord.y));
  float y = frag.y;
  if (y < uHorizon) {
    // 天空单独由 sky pass 负责，这里只输出地面层。
    outColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }
  float z = solveZ(y);
  float focusZ = uCamDist + uOrbitRadius;
  float s = perspectiveScale(z, focusZ);
  float B = uCamDist + uOrbitRadius - z;
  float invS = 1.0 / max(s, 1e-4);
  float A = ((frag.x - uPivot.x) + B * uGroundSkew) * invS;
  vec2 w = uWorldTarget + A * uRight + B * uToward;
  float d2 = dot(w - uWorldTarget, w - uWorldTarget);
  float r2 = uRenderRadius * uRenderRadius;
  if (d2 > r2) {
    // 半径外交给底层天空，不再填“假远景色”。
    outColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }
  // 与最早 Canvas2D 地面一致：每个 1x1 world tile 取一个噪声 texel，整格纯色填充。
  vec2 tileMod = mod(floor(w), uTileSize);
  ivec2 tileCoord = ivec2(tileMod);
  vec3 color = texelFetch(uTileTex, tileCoord, 0).rgb;
  if (false && uHasRoad > 0.5 &&
      w.x >= uRoadBounds.x && w.x <= uRoadBounds.z &&
      w.y >= uRoadBounds.y && w.y <= uRoadBounds.w) {
    vec2 roadUv = vec2(
      (w.x - uRoadBounds.x) / max(1e-5, uRoadBounds.z - uRoadBounds.x),
      (w.y - uRoadBounds.y) / max(1e-5, uRoadBounds.w - uRoadBounds.y)
    );
    vec4 road = texture(uRoadTex, roadUv);
    if (road.a >= 0.031) color = road.rgb;
  }
  float shadow = 0.0;
  if (false && uHasShadow > 0.5 && uShadowMult > 0.0) {
    vec2 lightPx = vec2((w.x - uLightMeta.x) * uLightMeta.z, (w.y - uLightMeta.y) * uLightMeta.z);
    if (lightPx.x >= 0.0 && lightPx.y >= 0.0 && lightPx.x < uLightSize.x && lightPx.y < uLightSize.y) {
      vec2 lightUv = vec2(lightPx.x / max(1.0, uLightSize.x), lightPx.y / max(1.0, uLightSize.y));
      shadow = min(0.82, texture(uLightTex, lightUv).a * uShadowMult);
    }
  }
  float warm = (1.0 - shadow) * uWarmth;
  color.r = color.r * (1.0 - shadow * 0.46) + (18.0 / 255.0) * shadow + (42.0 / 255.0) * warm;
  color.g = color.g * (1.0 - shadow * 0.38) + (26.0 / 255.0) * shadow + (24.0 / 255.0) * warm;
  color.b = color.b * (1.0 - shadow * 0.24) + (42.0 / 255.0) * shadow - (10.0 / 255.0) * warm;
  if (uGroundDepthDarkness > 0.0) {
    float depthDarkEndY = uResolution.y * 0.86;
    float farGround = clamp((depthDarkEndY - y) / max(1.0, depthDarkEndY - uHorizon), 0.0, 1.0);
    float depthShade = farGround * uGroundDepthDarkness;
    color.r = color.r * (1.0 - depthShade * 0.46) + (16.0 / 255.0) * depthShade;
    color.g = color.g * (1.0 - depthShade * 0.36) + (24.0 / 255.0) * depthShade;
    color.b = color.b * (1.0 - depthShade * 0.22) + (42.0 / 255.0) * depthShade;
  }
  if (false && uReflectionStrength > 0.0) {
    float reflectionStartY = uResolution.y * 0.45;
    float nearGround = clamp((y - reflectionStartY) / max(1.0, uResolution.y * 0.55), 0.0, 1.0);
    if (nearGround > 0.0) {
      float glintBand = 0.5 + 0.5 * sin(w.x * 0.055 - w.y * 0.038 + frag.x * 0.006);
      float lowFreq = 0.5 + 0.5 * sin(w.x * 0.012 + w.y * 0.017);
      float sheen = (1.0 - shadow * 0.75) * nearGround * uReflectionStrength * (0.28 + 0.72 * glintBand * lowFreq);
      color.r += (1.0 - color.r) * sheen * 0.56 * uFxBoost;
      color.g += ((238.0 / 255.0) - color.g) * sheen * 0.48 * uFxBoost;
      color.b += ((198.0 / 255.0) - color.b) * sheen * 0.30 * uFxBoost;
    }
  }
  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;
      function compile(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const msg = gl.getShaderInfoLog(shader) || "shader compile failed";
          gl.deleteShader(shader);
          throw new Error(msg);
        }
        return shader;
      }
      let program = null;
      try {
        const vs = compile(gl.VERTEX_SHADER, vsSource);
        const fs = compile(gl.FRAGMENT_SHADER, fsSource);
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "program link failed");
        }
      } catch (_err) {
        return null;
      }
      const vao = gl.createVertexArray();
      const vbo = gl.createBuffer();
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
          1, -1,
          -1, 1,
          1, 1,
        ]),
        gl.STATIC_DRAW
      );
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);
      const tileTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tileTex);
      // 地面必须保持 tilemap 原像素精度；不启用 mip 采样，避免远处被压成粗横条。
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const roadTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, roadTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      const lightTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, lightTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      const renderer = {
        canvas,
        gl,
        program,
        vao,
        tileTex,
        roadTex,
        lightTex,
        logicalWidth: width,
        logicalHeight: height,
        supersample: ss,
        uniforms: {
          resolution: gl.getUniformLocation(program, "uResolution"),
          tileTex: gl.getUniformLocation(program, "uTileTex"),
          roadTex: gl.getUniformLocation(program, "uRoadTex"),
          lightTex: gl.getUniformLocation(program, "uLightTex"),
          tileSize: gl.getUniformLocation(program, "uTileSize"),
          hasRoad: gl.getUniformLocation(program, "uHasRoad"),
          roadBounds: gl.getUniformLocation(program, "uRoadBounds"),
          hasShadow: gl.getUniformLocation(program, "uHasShadow"),
          lightMeta: gl.getUniformLocation(program, "uLightMeta"),
          lightSize: gl.getUniformLocation(program, "uLightSize"),
          shadowMult: gl.getUniformLocation(program, "uShadowMult"),
          warmth: gl.getUniformLocation(program, "uWarmth"),
          reflectionStrength: gl.getUniformLocation(program, "uReflectionStrength"),
          groundDepthDarkness: gl.getUniformLocation(program, "uGroundDepthDarkness"),
          fxBoost: gl.getUniformLocation(program, "uFxBoost"),
          pivot: gl.getUniformLocation(program, "uPivot"),
          worldTarget: gl.getUniformLocation(program, "uWorldTarget"),
          right: gl.getUniformLocation(program, "uRight"),
          toward: gl.getUniformLocation(program, "uToward"),
          orbitRadius: gl.getUniformLocation(program, "uOrbitRadius"),
          camDist: gl.getUniformLocation(program, "uCamDist"),
          forwardScale: gl.getUniformLocation(program, "uForwardScale"),
          camHeight: gl.getUniformLocation(program, "uCamHeight"),
          strength: gl.getUniformLocation(program, "uStrength"),
          baseScale: gl.getUniformLocation(program, "uBaseScale"),
          sMin: gl.getUniformLocation(program, "uSMin"),
          groundSkew: gl.getUniformLocation(program, "uGroundSkew"),
          tilt: gl.getUniformLocation(program, "uTilt"),
          horizon: gl.getUniformLocation(program, "uHorizon"),
          renderRadius: gl.getUniformLocation(program, "uRenderRadius"),
          skyColor: gl.getUniformLocation(program, "uSkyColor"),
          farColor: gl.getUniformLocation(program, "uFarColor"),
        },
      };
      animator._groundGlRenderer = renderer;
      return renderer;
    }

    function draw2p5dGroundWebGL(ctx, canvas, fxMode) {
      if (!animator.enableGroundWebGL) return false;
      if (!animator.tilemapPixels) ensurePlaceholderTilemap();
      ensureBakedSceneLighting();
      if (!animator.tilemapCanvas || !animator.tilemapCanvas.width || !animator.tilemapCanvas.height) return false;
      const renderer = ensureGroundWebGLRenderer(canvas.width, canvas.height);
      if (!renderer) return false;
      const gl = renderer.gl;
      const { cameraHeight, forwardScale, spanBase, spanScale, worldScale } = get2p5dParams();
      const sun = normalizedSunLighting();
      const lightMeta = animator._sceneLightBakeMeta;
      const hasBakedShadow = !!(lightMeta && !lightMeta.empty && animator._sceneLightBakeData);
      const roadMeta = animator._sceneRoadMaskMeta;
      const hasRoadMask = !!(roadMeta && animator.roadMaskPixels && animator.roadMaskCanvas.width && animator.roadMaskCanvas.height);
      const camHeight = Math.max(80, cameraHeight * 92);
      const camDist = Math.max(40, spanBase * 2.2);
      const strength = Math.max(0, (spanScale / 260) * 3.0);
      const baseScale = 4.2 * worldScale;
      const sMin = 0.06;
      const groundSkew = Number.isFinite(animator.groundSkew) ? animator.groundSkew : 0;
      const tilt = Number.isFinite(animator.tilt) ? animator.tilt : 1.0;
      const view = getOrbitViewFrame(canvas);
      const horizon = effectiveGroundHorizonForCanvas(canvas);
      const rWorld = Math.max(80, animator.renderRadiusWorld || 320);
      gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(renderer.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, renderer.tileTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      const tileUploadKey = `${animator.tilemapCanvas.width}x${animator.tilemapCanvas.height}`;
      if (renderer.tileUploadKey !== tileUploadKey) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, animator.tilemapCanvas);
        renderer.tileUploadKey = tileUploadKey;
      }
      gl.uniform1i(renderer.uniforms.tileTex, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, renderer.roadTex);
      if (hasRoadMask) {
        const roadUploadKey = `${roadMeta.minWorldX},${roadMeta.minWorldY},${roadMeta.maxWorldX},${roadMeta.maxWorldY}|${animator.roadMaskCanvas.width}x${animator.roadMaskCanvas.height}`;
        if (renderer.roadUploadKey !== roadUploadKey) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, animator.roadMaskCanvas);
          renderer.roadUploadKey = roadUploadKey;
        }
      }
      gl.uniform1i(renderer.uniforms.roadTex, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, renderer.lightTex);
      if (hasBakedShadow) {
        const lightUploadKey = `${animator._sceneLightBakeKey}|${lightMeta.width}x${lightMeta.height}|${lightMeta.originX},${lightMeta.originY},${lightMeta.pxPerWorld}`;
        if (renderer.lightUploadKey !== lightUploadKey) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, animator.sceneLightCanvas);
          renderer.lightUploadKey = lightUploadKey;
        }
      }
      gl.uniform1i(renderer.uniforms.lightTex, 2);
      gl.uniform2f(renderer.uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(renderer.uniforms.tileSize, animator.tilemapCanvas.width, animator.tilemapCanvas.height);
      gl.uniform1f(renderer.uniforms.hasRoad, 0);
      gl.uniform4f(
        renderer.uniforms.roadBounds,
        hasRoadMask ? roadMeta.minWorldX : 0,
        hasRoadMask ? roadMeta.minWorldY : 0,
        hasRoadMask ? roadMeta.maxWorldX : 1,
        hasRoadMask ? roadMeta.maxWorldY : 1
      );
      gl.uniform1f(renderer.uniforms.hasShadow, 0);
      gl.uniform4f(
        renderer.uniforms.lightMeta,
        hasBakedShadow ? lightMeta.originX : 0,
        hasBakedShadow ? lightMeta.originY : 0,
        hasBakedShadow ? lightMeta.pxPerWorld : 1,
        0
      );
      gl.uniform2f(
        renderer.uniforms.lightSize,
        hasBakedShadow ? lightMeta.width : 1,
        hasBakedShadow ? lightMeta.height : 1
      );
      gl.uniform1f(renderer.uniforms.shadowMult, Math.max(0, (Number(sun.shadowStrength) || 0) * (Number(sun.contrast) || 0)));
      gl.uniform1f(renderer.uniforms.warmth, Number(sun.warmth) || 0);
      gl.uniform1f(renderer.uniforms.reflectionStrength, 0);
      gl.uniform1f(renderer.uniforms.groundDepthDarkness, Math.max(0, Number(sun.groundDepthDarkness) || 0));
      gl.uniform1f(renderer.uniforms.fxBoost, fxMode ? 1.12 : 0.86);
      gl.uniform2f(renderer.uniforms.pivot, view.pivotScreenX, view.pivotScreenY);
      gl.uniform2f(renderer.uniforms.worldTarget, view.targetWorldX, view.targetWorldY);
      gl.uniform2f(renderer.uniforms.right, view.rightX, view.rightY);
      gl.uniform2f(renderer.uniforms.toward, view.towardCamX, view.towardCamY);
      gl.uniform1f(renderer.uniforms.orbitRadius, view.orbitRadius);
      gl.uniform1f(renderer.uniforms.camDist, camDist);
      gl.uniform1f(renderer.uniforms.forwardScale, forwardScale);
      gl.uniform1f(renderer.uniforms.camHeight, camHeight);
      gl.uniform1f(renderer.uniforms.strength, strength);
      gl.uniform1f(renderer.uniforms.baseScale, baseScale);
      gl.uniform1f(renderer.uniforms.sMin, sMin);
      gl.uniform1f(renderer.uniforms.groundSkew, groundSkew);
      gl.uniform1f(renderer.uniforms.tilt, tilt);
      gl.uniform1f(renderer.uniforms.horizon, horizon);
      gl.uniform1f(renderer.uniforms.renderRadius, rWorld);
      if (fxMode) {
        gl.uniform3f(renderer.uniforms.skyColor, 135 / 255, 206 / 255, 235 / 255);
        gl.uniform3f(renderer.uniforms.farColor, 96 / 255, 164 / 255, 202 / 255);
      } else {
        gl.uniform3f(renderer.uniforms.skyColor, 135 / 255, 206 / 255, 235 / 255);
        gl.uniform3f(renderer.uniforms.farColor, 104 / 255, 172 / 255, 210 / 255);
      }
      gl.bindVertexArray(renderer.vao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindVertexArray(null);
      gl.useProgram(null);
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(renderer.canvas, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      return true;
    }

    function sampleAtlasPixelRgba(canvas, x, y, alphaThreshold = 8) {
      if (!canvas || typeof canvas.getContext !== "function") return null;
      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
      let cache = canvas._pixelWorkflowImageData;
      if (!cache || cache.width !== canvas.width || cache.height !== canvas.height) {
        const cctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!cctx) return null;
        cache = cctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas._pixelWorkflowImageData = cache;
      }
      const i = (y * cache.width + x) * 4;
      const a = cache.data[i + 3];
      if (a <= alphaThreshold) return null;
      return `rgba(${cache.data[i]},${cache.data[i + 1]},${cache.data[i + 2]},${(a / 255).toFixed(3)})`;
    }

    function sampleAtlasPixelRgbaUv(canvas, u, v, alphaThreshold = 8) {
      return sampleAtlasPixelRgba(canvas, Math.floor(u), Math.floor(v), alphaThreshold);
    }

    function getQuadBounds(q) {
      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
      for (const c of q.c) {
        if (c[0] < minX) minX = c[0];
        if (c[1] < minY) minY = c[1];
        if (c[2] < minZ) minZ = c[2];
        if (c[0] > maxX) maxX = c[0];
        if (c[1] > maxY) maxY = c[1];
        if (c[2] > maxZ) maxZ = c[2];
      }
      return { minX, minY, minZ, maxX, maxY, maxZ };
    }

    function isTopStripQuad(model, q) {
      if (!model?.solid) return false;
      if (q.face === "py") return true;
      const { minX, minY, minZ, maxX, maxY, maxZ } = getQuadBounds(q);
      if (maxY - minY !== 1) return false;
      const voxelY = minY;
      if (q.face === "pz" || q.face === "nz") {
        const voxelZ = q.face === "pz" ? minZ - 1 : minZ;
        if (voxelZ < 0 || voxelZ >= model.D) return false;
        for (let x = minX; x < maxX; x++) {
          if (voxelY + 1 < model.H && model.solid[voxelSolidIndex(x, voxelY + 1, voxelZ, model.W, model.D)]) {
            return false;
          }
        }
        return true;
      }
      if (q.face === "px" || q.face === "nx") {
        const voxelX = q.face === "px" ? minX - 1 : minX;
        if (voxelX < 0 || voxelX >= model.W) return false;
        for (let z = minZ; z < maxZ; z++) {
          if (voxelY + 1 < model.H && model.solid[voxelSolidIndex(voxelX, voxelY + 1, z, model.W, model.D)]) {
            return false;
          }
        }
        return true;
      }
      return false;
    }

    function isVoxelTopExposed(model, x, y, z) {
      if (!model?.solid) return false;
      if (x < 0 || y < 0 || z < 0 || x >= model.W || y >= model.H || z >= model.D) return false;
      if (!model.solid[voxelSolidIndex(x, y, z, model.W, model.D)]) return false;
      return y + 1 >= model.H || !model.solid[voxelSolidIndex(x, y + 1, z, model.W, model.D)];
    }

    function getUnifiedVoxelFillStyle(model, x, y, z, H, alphaThreshold = 8) {
      if (!model) return "#89c8ff";
      const key = voxelSolidIndex(x, y, z, model.W, model.D);
      let cache = model._unifiedVoxelFillCache;
      if (!cache || cache.length !== model.W * model.H * model.D) {
        cache = new Array(model.W * model.H * model.D);
        model._unifiedVoxelFillCache = cache;
      }
      const cached = cache[key];
      if (cached) return cached;

      const uTop = x + 0.5;
      const vTop = z + 0.5;
      const uFront = x + 0.5;
      const vFront = H - (y + 0.5);
      const uSide = z + 0.5;
      const vSide = H - (y + 0.5);
      const topColor = sampleAtlasPixelRgbaUv(model._atlasTop, uTop, vTop, alphaThreshold);
      const frontColor = sampleAtlasPixelRgbaUv(model._atlasFront, uFront, vFront, alphaThreshold);
      const sideColor = sampleAtlasPixelRgbaUv(model._atlasSide, uSide, vSide, alphaThreshold);

      const fill =
        isVoxelTopExposed(model, x, y, z)
          ? topColor || frontColor || sideColor || "#89c8ff"
          : frontColor || sideColor || topColor || "#4fa0db";
      cache[key] = fill;
      return fill;
    }

    function getUnifiedQuadRepresentativeVoxel(model, q) {
      const { minX, minY, minZ, maxX, maxY, maxZ } = getQuadBounds(q);
      if (q.face === "py") {
        return {
          x: Math.max(0, Math.min(model.W - 1, Math.floor((minX + maxX - 1) * 0.5))),
          y: Math.max(0, Math.min(model.H - 1, minY - 1)),
          z: Math.max(0, Math.min(model.D - 1, Math.floor((minZ + maxZ - 1) * 0.5))),
        };
      }
      if (q.face === "ny") {
        return {
          x: Math.max(0, Math.min(model.W - 1, Math.floor((minX + maxX - 1) * 0.5))),
          y: Math.max(0, Math.min(model.H - 1, minY)),
          z: Math.max(0, Math.min(model.D - 1, Math.floor((minZ + maxZ - 1) * 0.5))),
        };
      }
      if (q.face === "pz") {
        return {
          x: Math.max(0, Math.min(model.W - 1, Math.floor((minX + maxX - 1) * 0.5))),
          y: Math.max(0, Math.min(model.H - 1, Math.floor((minY + maxY - 1) * 0.5))),
          z: Math.max(0, Math.min(model.D - 1, minZ - 1)),
        };
      }
      if (q.face === "nz") {
        return {
          x: Math.max(0, Math.min(model.W - 1, Math.floor((minX + maxX - 1) * 0.5))),
          y: Math.max(0, Math.min(model.H - 1, Math.floor((minY + maxY - 1) * 0.5))),
          z: Math.max(0, Math.min(model.D - 1, minZ)),
        };
      }
      if (q.face === "px") {
        return {
          x: Math.max(0, Math.min(model.W - 1, minX - 1)),
          y: Math.max(0, Math.min(model.H - 1, Math.floor((minY + maxY - 1) * 0.5))),
          z: Math.max(0, Math.min(model.D - 1, Math.floor((minZ + maxZ - 1) * 0.5))),
        };
      }
      return {
        x: Math.max(0, Math.min(model.W - 1, minX)),
        y: Math.max(0, Math.min(model.H - 1, Math.floor((minY + maxY - 1) * 0.5))),
        z: Math.max(0, Math.min(model.D - 1, Math.floor((minZ + maxZ - 1) * 0.5))),
      };
    }

    function getUnifiedQuadFillStyle(model, q, H, alphaThreshold = 8) {
      const voxel = getUnifiedQuadRepresentativeVoxel(model, q);
      return getUnifiedVoxelFillStyle(model, voxel.x, voxel.y, voxel.z, H, alphaThreshold);
    }

    function drawVoxelBuilding(ctx, canvas, model, wx, wy, angleRad, fxMode, ghost, scaleMul = 1, sinkModelY = 0, clipModelY = 0, renderOptions = null) {
      if (!model || !model.list || !model.list.length) return;
      const W = model.W;
      const H = model.H;
      const D = model.D;
      const buildingScaleRaw = Number(scaleMul);
      const buildingScale = Number.isFinite(buildingScaleRaw) && buildingScaleRaw > 0 ? buildingScaleRaw : 1;
      const sinkOffsetModelY = Math.max(0, Number(sinkModelY) || 0);
      const groundClipModelY = Math.max(0, Number(clipModelY) || 0);
      const p0 = projectWorldToScreen(wx, wy, canvas);
      if (p0.scale <= 0) return;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);
      function rotXZ(x, z) {
        return { x: x * cosA - z * sinA, z: x * sinA + z * cosA };
      }
      // HD-2D：体素底面 (x,z) 映射到世界平面一点，与地面 tile 使用同一套 projectWorldToScreen（非单锚点等比缩放）。
      // 建筑不额外压缩竖向比例，直接按体素高度绘制。
      const kH = 1;
      const colProjCache = new Map();
      function projColumnFoot(x, z) {
        const key = x + "," + z;
        let pr = colProjCache.get(key);
        if (!pr) {
          const rxz = rotXZ((x - W / 2) * buildingScale, (z - D / 2) * buildingScale);
          const gwx = wx + rxz.x;
          const gwy = wy + rxz.z;
          pr = projectWorldToScreen(gwx, gwy, canvas);
          colProjCache.set(key, pr);
        }
        return pr;
      }
      function proj(x, y, z) {
        const pr = projColumnFoot(x, z);
        if (!pr || pr.scale <= 0) {
          return { x: -1e9, y: -1e9, d: 1e12 };
        }
        const visibleY = y;
        return {
          x: pr.sx,
          y: pr.sy - (visibleY - sinkOffsetModelY) * pr.scale * kH * buildingScale,
          d: -pr.depthKey + visibleY * 0.001,
        };
      }

      const greedy = typeof globalThis.ensureGreedyShellQuads === "function" ? globalThis.ensureGreedyShellQuads(model) : null;
      if (typeof globalThis.ensureTexturedAtlases === "function") globalThis.ensureTexturedAtlases(model);
      const renderMode = animator.buildingRenderMode || "textured";
      if ((renderMode === "textured" || renderMode === "flat") && !model._atlasFront) {
        ensureFallbackBuildingAtlases(model);
      }

      const useTexturedGreedy =
        !!(greedy &&
          greedy.length &&
          (renderMode === "textured" || (renderMode === "flat" && model._fallbackAtlases)) &&
          model._atlasFront &&
          model._atlasSide &&
          model._atlasTop &&
          typeof globalThis.modelCornerToAtlasUvPx === "function");

      if (useTexturedGreedy && !ghost && animator.enableBuildingGPUProjection) {
        ctx.save();
        if (drawVoxelBuildingGpuProj(ctx, canvas, model, wx, wy, angleRad, false, buildingScale, sinkOffsetModelY, groundClipModelY, renderOptions)) {
          ctx.restore();
          return;
        }
        ctx.restore();
      }

      const fillByFace = ghost
        ? {
            py: "rgba(130,200,255,0.82)",
            ny: "rgba(90,140,180,0.55)",
            px: "rgba(90,160,220,0.88)",
            nx: "rgba(75,130,175,0.82)",
            pz: "rgba(55,110,165,0.9)",
            nz: "rgba(45,95,145,0.86)",
          }
        : {
            py: "#89c8ff",
            ny: "#4a6e8a",
            px: "#4fa0db",
            nx: "#3d7dad",
            pz: "#2f6d9d",
            nz: "#254f6f",
          };

      ctx.save();
      if (ghost) ctx.globalAlpha = fxMode ? 0.68 : 0.74;

      if (greedy && greedy.length) {
        const preparedQ = greedy.map((q) => {
          const maxY = q.c.reduce((m, co) => Math.max(m, co[1]), -Infinity);
          if (maxY <= groundClipModelY) return null;
          const corners = q.c.map((co) => proj(co[0], co[1], co[2]));
          let depth = 0;
          for (const pt of corners) depth += pt.d;
          return { q, corners, depth: depth * 0.25 };
        }).filter(Boolean);
        preparedQ.sort((a, b) => a.depth - b.depth);
        if (useTexturedGreedy) {
          if (drawVoxelBuildingWebGLTextured(ctx, canvas, model, preparedQ, W, H, D, angleRad, ghost, renderOptions)) {
            ctx.restore();
            return;
          }
          ctx.imageSmoothingEnabled = false;
          for (const item of preparedQ) {
            const q = item.q;
            const uv0 = globalThis.modelCornerToAtlasUvPx(q.face, q.c[0][0], q.c[0][1], q.c[0][2], W, H, D);
            const tex = pickModelAtlas(model, uv0.atlas);
            if (!tex) continue;
            const su = [];
            for (let k = 0; k < 4; k++) {
              su.push(
                globalThis.modelCornerToAtlasUvPx(q.face, q.c[k][0], q.c[k][1], q.c[k][2], W, H, D)
              );
            }
            const sp = item.corners.map((p) => ({ x: p.x, y: p.y }));
            if (sp.some((pt) => pt.x < -1e8)) continue;
            drawTextureTriangle(
              ctx,
              tex,
              su[0].u,
              su[0].v,
              su[1].u,
              su[1].v,
              su[2].u,
              su[2].v,
              sp[0].x,
              sp[0].y,
              sp[1].x,
              sp[1].y,
              sp[2].x,
              sp[2].y
            );
            drawTextureTriangle(
              ctx,
              tex,
              su[0].u,
              su[0].v,
              su[2].u,
              su[2].v,
              su[3].u,
              su[3].v,
              sp[0].x,
              sp[0].y,
              sp[2].x,
              sp[2].y,
              sp[3].x,
              sp[3].y
            );
            drawLitQuadOverlay(ctx, sp, ghost ? 1 : voxelFaceLightFactor(q.face, angleRad));
          }
        } else {
          for (const item of preparedQ) {
            const q = item.q;
            const corners = item.corners;
            if (corners.some((pt) => pt.x < -1e8)) continue;
            ctx.fillStyle = ghost
              ? (fillByFace[q.face] || fillByFace.py)
              : renderMode === "unified"
                ? getUnifiedQuadFillStyle(model, q, H)
                : (fillByFace[q.face] || fillByFace.py);
            ctx.beginPath();
            const p0q = corners[0];
            ctx.moveTo(p0q.x, p0q.y);
            for (let k = 1; k < 4; k++) {
              const pq = corners[k];
              ctx.lineTo(pq.x, pq.y);
            }
            ctx.closePath();
            ctx.fill();
            drawLitQuadOverlay(ctx, corners, ghost ? 1 : voxelFaceLightFactor(q.face, angleRad));
          }
        }
      } else {
        const preparedVoxels = model.list
          .filter((v) => (v.y + 1) > groundClipModelY)
          .map((v) => ({ v, depth: proj(v.x, v.y, v.z).d }))
          .sort((a, b) => a.depth - b.depth);
        for (const item of preparedVoxels) {
          const v = item.v;
          const p000 = proj(v.x, v.y, v.z);
          const p100 = proj(v.x + 1, v.y, v.z);
          const p110 = proj(v.x + 1, v.y, v.z + 1);
          const p010 = proj(v.x, v.y, v.z + 1);
          const p001 = proj(v.x, v.y + 1, v.z);
          const p101 = proj(v.x + 1, v.y + 1, v.z);
          const p111 = proj(v.x + 1, v.y + 1, v.z + 1);
          const p011 = proj(v.x, v.y + 1, v.z + 1);
          const facePts = [p001, p101, p111, p011, p100, p110, p010];
          if (facePts.some((pt) => pt.x < -1e8)) continue;

          const unifiedVoxelFill =
            !ghost && renderMode === "unified"
              ? getUnifiedVoxelFillStyle(model, v.x, v.y, v.z, H)
              : null;

          ctx.fillStyle = ghost ? "rgba(130,200,255,0.85)" : unifiedVoxelFill || "#89c8ff";
          ctx.beginPath();
          ctx.moveTo(p001.x, p001.y);
          ctx.lineTo(p101.x, p101.y);
          ctx.lineTo(p111.x, p111.y);
          ctx.lineTo(p011.x, p011.y);
          ctx.closePath();
          ctx.fill();
          drawLitQuadOverlay(ctx, [p001, p101, p111, p011], ghost ? 1 : voxelFaceLightFactor("py", angleRad));

          ctx.fillStyle = ghost ? "rgba(90,160,220,0.9)" : unifiedVoxelFill || "#4fa0db";
          ctx.beginPath();
          ctx.moveTo(p100.x, p100.y);
          ctx.lineTo(p110.x, p110.y);
          ctx.lineTo(p111.x, p111.y);
          ctx.lineTo(p101.x, p101.y);
          ctx.closePath();
          ctx.fill();
          drawLitQuadOverlay(ctx, [p100, p110, p111, p101], ghost ? 1 : voxelFaceLightFactor("pz", angleRad));

          ctx.fillStyle = ghost ? "rgba(55,110,165,0.92)" : unifiedVoxelFill || "#2f6d9d";
          ctx.beginPath();
          ctx.moveTo(p010.x, p010.y);
          ctx.lineTo(p110.x, p110.y);
          ctx.lineTo(p111.x, p111.y);
          ctx.lineTo(p011.x, p011.y);
          ctx.closePath();
          ctx.fill();
          drawLitQuadOverlay(ctx, [p010, p110, p111, p011], ghost ? 1 : voxelFaceLightFactor("px", angleRad));
        }
      }
      ctx.restore();
    }

    function borrowSnowImageData(w, h) {
      const key = w + "x" + h;
      let m = animator._snowImgMap;
      if (!m) m = animator._snowImgMap = new Map();
      let img = m.get(key);
      if (!img || img.width !== w || img.height !== h) {
        img = new ImageData(w, h);
        m.set(key, img);
      }
      return img;
    }

    function removeGrassAtlasWhiteBorder(image) {
      if (!image || !image.naturalWidth || !image.naturalHeight) return image;
      const cols = 3;
      const rows = 3;
      const srcTileW = Math.floor(image.naturalWidth / cols);
      const srcTileH = Math.floor(image.naturalHeight / rows);
      const dstTile = 16;
      const src = document.createElement("canvas");
      src.width = image.naturalWidth;
      src.height = image.naturalHeight;
      const sg = src.getContext("2d", { willReadFrequently: true });
      if (!sg || srcTileW <= 0 || srcTileH <= 0) return image;
      sg.imageSmoothingEnabled = false;
      sg.clearRect(0, 0, src.width, src.height);
      sg.drawImage(image, 0, 0);
      const dst = document.createElement("canvas");
      dst.width = cols * dstTile;
      dst.height = rows * dstTile;
      const dg = dst.getContext("2d", { willReadFrequently: true });
      if (!dg) return image;
      dg.imageSmoothingEnabled = false;
      dg.clearRect(0, 0, dst.width, dst.height);

      function isBorderPixel(data, idx) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        const maxc = Math.max(r, g, b);
        const minc = Math.min(r, g, b);
        const saturation = maxc - minc;
        return a <= 16 || (r >= 205 && g >= 205 && b >= 205) || (maxc >= 185 && saturation <= 34);
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const sx = col * srcTileW;
          const sy = row * srcTileH;
          const tile = sg.getImageData(sx, sy, srcTileW, srcTileH);
          const data = tile.data;
          let minX = srcTileW;
          let minY = srcTileH;
          let maxX = -1;
          let maxY = -1;
          for (let y = 0; y < srcTileH; y++) {
            for (let x = 0; x < srcTileW; x++) {
              const idx = (y * srcTileW + x) * 4;
              if (isBorderPixel(data, idx)) {
                data[idx + 3] = 0;
                continue;
              }
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
          if (maxX < minX || maxY < minY) continue;
          const clean = document.createElement("canvas");
          clean.width = srcTileW;
          clean.height = srcTileH;
          const cg = clean.getContext("2d");
          if (!cg) continue;
          cg.imageSmoothingEnabled = false;
          cg.putImageData(tile, 0, 0);
          const sw = maxX - minX + 1;
          const sh = maxY - minY + 1;
          // 裁掉每个子 tile 的白边后，统一拉伸到 16x16，保证每种 tile 等大且无空隙。
          dg.drawImage(clean, minX, minY, sw, sh, col * dstTile, row * dstTile, dstTile, dstTile);
        }
      }
      return dst;
    }

    function ensureGroundTileMeshRenderer(width, height) {
      let renderer = animator._groundTileMeshRenderer;
      if (renderer && renderer.gl) {
        if (renderer.canvas.width !== width || renderer.canvas.height !== height) {
          renderer.canvas.width = width;
          renderer.canvas.height = height;
          renderer.gl.viewport(0, 0, width, height);
        }
        return renderer;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
      if (!gl) return null;
      const vsSource = `#version 300 es
precision highp float;
in vec2 a_corner;
uniform vec2 u_resolution;
uniform sampler2D u_seedMap;
uniform sampler2D u_roadTex;
uniform sampler2D u_lightTex;
uniform vec2 u_seedMapSize;
uniform float u_hasRoad;
uniform vec4 u_roadBounds;
uniform float u_hasShadow;
uniform vec4 u_lightMeta;
uniform vec2 u_lightSize;
uniform float u_shadowMult;
uniform float u_warmth;
uniform float u_reflectionStrength;
uniform float u_groundDepthDarkness;
uniform float u_fxBoost;
uniform vec2 u_originTile;
uniform int u_gridSize;
uniform float u_radius;
uniform vec2 u_playerWorld;
uniform vec2 u_pivot;
uniform vec2 u_targetWorld;
uniform vec2 u_right;
uniform vec2 u_toward;
uniform float u_orbitRadius;
uniform float u_camDist;
uniform float u_camHeight;
uniform float u_strength;
uniform float u_baseScale;
uniform float u_sMin;
uniform float u_groundSkew;
uniform float u_tilt;
out vec3 v_color;
out vec2 v_tileUv;
out vec2 v_world;
out float v_screenY;
flat out int v_tileId;
int wrapInt(int v, int size) {
  int m = v % size;
  return m < 0 ? m + size : m;
}
float perspectiveScale(float z, float focusZ) {
  float denom = u_camHeight + z * u_strength;
  float s = (denom > 1e-6) ? (u_baseScale * u_camHeight / denom) : u_sMin;
  float focus = (u_camHeight + focusZ * u_strength) / max(u_camHeight, 1e-6);
  return max(u_sMin, s * focus);
}
void main() {
  int instanceId = gl_InstanceID;
  int lx = instanceId % u_gridSize;
  int ly = instanceId / u_gridSize;
  vec2 tilePos = u_originTile + vec2(float(lx), float(ly));
  vec2 tileCenter = tilePos + vec2(0.5);
  vec2 centerDelta = tileCenter - u_playerWorld;
  float centerB = dot(tileCenter - u_targetWorld, u_toward);
  float centerZ = u_camDist + u_orbitRadius - centerB;
  bool outsideRadius = dot(centerDelta, centerDelta) > (u_radius + 1.5) * (u_radius + 1.5);
  if (outsideRadius || centerZ <= 0.0) {
    gl_Position = vec4(3.0, 3.0, 2.0, 1.0);
    v_color = vec3(0.0);
    v_tileUv = a_corner;
    v_world = tilePos;
    v_screenY = 0.0;
    v_tileId = 0;
    return;
  }
  vec2 seedTile = floor(tilePos * 0.5);
  ivec2 seedCoord = ivec2(
    wrapInt(int(seedTile.x), int(u_seedMapSize.x)),
    wrapInt(int(seedTile.y), int(u_seedMapSize.y))
  );
  vec4 seed = texelFetch(u_seedMap, seedCoord, 0);
  float lum = dot(seed.rgb, vec3(0.25, 0.55, 0.20));
  int bucket = clamp(int(floor(lum * 3.0)), 0, 2);
  float variantRaw = abs(sin(dot(tilePos, vec2(12.9898, 78.233))) * 43758.5453);
  int variant = int(floor(fract(variantRaw) * 3.0));
  vec2 world = tilePos + a_corner;
  vec2 d = world - u_targetWorld;
  float A = d.x * u_right.x + d.y * u_right.y;
  float B = d.x * u_toward.x + d.y * u_toward.y;
  float zDepth = u_camDist + u_orbitRadius - B;
  if (zDepth <= 0.0) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    v_color = seed.rgb;
    v_tileUv = fract(world * 0.5);
    v_world = world;
    v_screenY = 0.0;
    v_tileId = bucket * 3 + variant;
    return;
  }
  float focusZ = u_camDist + u_orbitRadius;
  float s = perspectiveScale(zDepth, focusZ);
  float sx = u_pivot.x + A * s - B * u_groundSkew;
  float sy = u_pivot.y + B * s * u_tilt;
  vec2 clip = vec2(
    (sx / u_resolution.x) * 2.0 - 1.0,
    1.0 - (sy / u_resolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
  v_color = seed.rgb;
  v_tileUv = fract(world * 0.5);
  v_world = world;
  v_screenY = sy;
  v_tileId = bucket * 3 + variant;
}`;
      const fsSource = `#version 300 es
precision highp float;
in vec3 v_color;
in vec2 v_tileUv;
in vec2 v_world;
in float v_screenY;
flat in int v_tileId;
uniform sampler2D u_grassAtlas;
uniform float u_useAtlas;
uniform sampler2D u_roadTex;
uniform sampler2D u_lightTex;
uniform vec2 u_resolution;
uniform float u_hasRoad;
uniform vec4 u_roadBounds;
uniform float u_hasShadow;
uniform vec4 u_lightMeta;
uniform vec2 u_lightSize;
uniform float u_shadowMult;
uniform float u_warmth;
uniform float u_reflectionStrength;
uniform float u_groundDepthDarkness;
uniform float u_fxBoost;
out vec4 outColor;
void main() {
  vec3 color = v_color;
  if (u_useAtlas > 0.5) {
    int id = clamp(v_tileId, 0, 8);
    int ax = id - (id / 3) * 3;
    int ay = id / 3;
    vec2 uv = (vec2(float(ax), float(ay)) + clamp(v_tileUv, 0.0, 0.999)) / 3.0;
    vec4 atlas = texture(u_grassAtlas, uv);
    if (atlas.a > 0.02) color = atlas.rgb;
  }
  if (u_hasRoad > 0.5 &&
      v_world.x >= u_roadBounds.x && v_world.x <= u_roadBounds.z &&
      v_world.y >= u_roadBounds.y && v_world.y <= u_roadBounds.w) {
    vec2 roadUv = vec2(
      (v_world.x - u_roadBounds.x) / max(1e-5, u_roadBounds.z - u_roadBounds.x),
      (v_world.y - u_roadBounds.y) / max(1e-5, u_roadBounds.w - u_roadBounds.y)
    );
    vec4 road = texture(u_roadTex, roadUv);
    if (road.a >= 0.031) color = road.rgb;
  }
  float shadow = 0.0;
  if (u_hasShadow > 0.5 && u_shadowMult > 0.0) {
    vec2 lightPx = vec2((v_world.x - u_lightMeta.x) * u_lightMeta.z, (v_world.y - u_lightMeta.y) * u_lightMeta.z);
    if (lightPx.x >= 0.0 && lightPx.y >= 0.0 && lightPx.x < u_lightSize.x && lightPx.y < u_lightSize.y) {
      vec2 lightUv = vec2(lightPx.x / max(1.0, u_lightSize.x), lightPx.y / max(1.0, u_lightSize.y));
      shadow = min(0.82, texture(u_lightTex, lightUv).a * u_shadowMult);
    }
  }
  float warm = (1.0 - shadow) * u_warmth;
  color.r = color.r * (1.0 - shadow * 0.46) + (18.0 / 255.0) * shadow + (42.0 / 255.0) * warm;
  color.g = color.g * (1.0 - shadow * 0.38) + (26.0 / 255.0) * shadow + (24.0 / 255.0) * warm;
  color.b = color.b * (1.0 - shadow * 0.24) + (42.0 / 255.0) * shadow - (10.0 / 255.0) * warm;
  if (u_groundDepthDarkness > 0.0) {
    float depthDarkEndY = u_resolution.y * 0.86;
    float farGround = clamp((depthDarkEndY - v_screenY) / max(1.0, depthDarkEndY), 0.0, 1.0);
    float depthShade = farGround * u_groundDepthDarkness;
    color.r = color.r * (1.0 - depthShade * 0.46) + (16.0 / 255.0) * depthShade;
    color.g = color.g * (1.0 - depthShade * 0.36) + (24.0 / 255.0) * depthShade;
    color.b = color.b * (1.0 - depthShade * 0.22) + (42.0 / 255.0) * depthShade;
  }
  if (u_reflectionStrength > 0.0) {
    float reflectionStartY = u_resolution.y * 0.45;
    float nearGround = clamp((v_screenY - reflectionStartY) / max(1.0, u_resolution.y * 0.55), 0.0, 1.0);
    if (nearGround > 0.0) {
      float glintBand = 0.5 + 0.5 * sin(v_world.x * 0.055 - v_world.y * 0.038 + gl_FragCoord.x * 0.006);
      float lowFreq = 0.5 + 0.5 * sin(v_world.x * 0.012 + v_world.y * 0.017);
      float sheen = (1.0 - shadow * 0.75) * nearGround * u_reflectionStrength * (0.28 + 0.72 * glintBand * lowFreq);
      color.r += (1.0 - color.r) * sheen * 0.56 * u_fxBoost;
      color.g += ((238.0 / 255.0) - color.g) * sheen * 0.48 * u_fxBoost;
      color.b += ((198.0 / 255.0) - color.b) * sheen * 0.30 * u_fxBoost;
    }
  }
  outColor = vec4(color, 1.0);
}`;
      function compile(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const msg = gl.getShaderInfoLog(shader) || "shader compile failed";
          gl.deleteShader(shader);
          throw new Error(msg);
        }
        return shader;
      }
      let program = null;
      try {
        const vs = compile(gl.VERTEX_SHADER, vsSource);
        const fs = compile(gl.FRAGMENT_SHADER, fsSource);
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "program link failed");
        }
      } catch (err) {
        console.warn("[ground-tile-mesh-webgl] init failed", err);
        return null;
      }
      const vao = gl.createVertexArray();
      const quadVbo = gl.createBuffer();
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
      const aCorner = gl.getAttribLocation(program, "a_corner");
      gl.enableVertexAttribArray(aCorner);
      gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 2 * 4, 0);
      gl.vertexAttribDivisor(aCorner, 0);
      gl.bindVertexArray(null);
      const seedTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, seedTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      const roadTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, roadTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      const lightTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, lightTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      const grassTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, grassTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      const grassImage = new Image();
      grassImage.onload = () => {
        renderer.grassProcessedCanvas = removeGrassAtlasWhiteBorder(grassImage);
        renderer.grassDirty = true;
      };
      grassImage.src = "./grass.png";
      renderer = {
        canvas,
        gl,
        program,
        vao,
        quadVbo,
        seedTex,
        roadTex,
        lightTex,
        grassTex,
        grassImage,
        grassProcessedCanvas: null,
        grassDirty: false,
        grassReady: false,
        uResolution: gl.getUniformLocation(program, "u_resolution"),
        uSeedMap: gl.getUniformLocation(program, "u_seedMap"),
        uRoadTex: gl.getUniformLocation(program, "u_roadTex"),
        uLightTex: gl.getUniformLocation(program, "u_lightTex"),
        uSeedMapSize: gl.getUniformLocation(program, "u_seedMapSize"),
        uHasRoad: gl.getUniformLocation(program, "u_hasRoad"),
        uRoadBounds: gl.getUniformLocation(program, "u_roadBounds"),
        uHasShadow: gl.getUniformLocation(program, "u_hasShadow"),
        uLightMeta: gl.getUniformLocation(program, "u_lightMeta"),
        uLightSize: gl.getUniformLocation(program, "u_lightSize"),
        uShadowMult: gl.getUniformLocation(program, "u_shadowMult"),
        uWarmth: gl.getUniformLocation(program, "u_warmth"),
        uReflectionStrength: gl.getUniformLocation(program, "u_reflectionStrength"),
        uGroundDepthDarkness: gl.getUniformLocation(program, "u_groundDepthDarkness"),
        uFxBoost: gl.getUniformLocation(program, "u_fxBoost"),
        uOriginTile: gl.getUniformLocation(program, "u_originTile"),
        uGridSize: gl.getUniformLocation(program, "u_gridSize"),
        uRadius: gl.getUniformLocation(program, "u_radius"),
        uPlayerWorld: gl.getUniformLocation(program, "u_playerWorld"),
        uPivot: gl.getUniformLocation(program, "u_pivot"),
        uTargetWorld: gl.getUniformLocation(program, "u_targetWorld"),
        uRight: gl.getUniformLocation(program, "u_right"),
        uToward: gl.getUniformLocation(program, "u_toward"),
        uOrbitRadius: gl.getUniformLocation(program, "u_orbitRadius"),
        uCamDist: gl.getUniformLocation(program, "u_camDist"),
        uCamHeight: gl.getUniformLocation(program, "u_camHeight"),
        uStrength: gl.getUniformLocation(program, "u_strength"),
        uBaseScale: gl.getUniformLocation(program, "u_baseScale"),
        uSMin: gl.getUniformLocation(program, "u_sMin"),
        uGroundSkew: gl.getUniformLocation(program, "u_groundSkew"),
        uTilt: gl.getUniformLocation(program, "u_tilt"),
        uGrassAtlas: gl.getUniformLocation(program, "u_grassAtlas"),
        uUseAtlas: gl.getUniformLocation(program, "u_useAtlas"),
      };
      animator._groundTileMeshRenderer = renderer;
      return renderer;
    }

    function drawGroundTileMeshWebGL(ctx, canvas, fxMode) {
      if (animator.activeSceneKind === "interior") return false;
      if (!animator.enableGroundWebGL) return false;
      if (!animator.tilemapPixels) ensurePlaceholderTilemap();
      ensureBakedSceneLighting();
      const renderer = ensureGroundTileMeshRenderer(canvas.width, canvas.height);
      if (!renderer) return false;
      const horizon = effectiveGroundHorizonForCanvas(canvas);
      const sun = normalizedSunLighting();
      const roadMeta = animator._sceneRoadMaskMeta;
      const hasRoadMask = !!(roadMeta && animator.roadMaskPixels && animator.roadMaskCanvas.width && animator.roadMaskCanvas.height);
      const lightMeta = animator._sceneLightBakeMeta;
      const hasBakedShadow = !!(lightMeta && !lightMeta.empty && animator._sceneLightBakeData);
      const radius = Math.max(10, Number(animator.renderRadiusWorld) || 320);
      // 不再对地面网格半径做实例数硬上限裁剪。
      const meshRadius = radius;
      const tx0 = Math.floor(animator.worldX - meshRadius);
      const ty0 = Math.floor(animator.worldY - meshRadius);
      const tx1 = Math.ceil(animator.worldX + meshRadius);
      const ty1 = Math.ceil(animator.worldY + meshRadius);
      const spanX = tx1 - tx0 + 1;
      const spanY = ty1 - ty0 + 1;
      if (spanX <= 0 || spanY <= 0) return true;
      const gl = renderer.gl;
      gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const instanceCount = spanX * spanY;
      if (renderer.grassDirty && renderer.grassImage.complete && renderer.grassImage.naturalWidth > 0) {
        const grassSource = renderer.grassProcessedCanvas || renderer.grassImage;
        gl.bindTexture(gl.TEXTURE_2D, renderer.grassTex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grassSource);
        renderer.grassReady = true;
        renderer.grassDirty = false;
      }
      const seedUploadKey = `${animator.tilemapCanvas.width}x${animator.tilemapCanvas.height}`;
      if (renderer.seedUploadKey !== seedUploadKey) {
        gl.bindTexture(gl.TEXTURE_2D, renderer.seedTex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, animator.tilemapCanvas);
        renderer.seedUploadKey = seedUploadKey;
      }
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, renderer.roadTex);
      if (hasRoadMask) {
        const roadUploadKey = `${roadMeta.minWorldX},${roadMeta.minWorldY},${roadMeta.maxWorldX},${roadMeta.maxWorldY}|${animator.roadMaskCanvas.width}x${animator.roadMaskCanvas.height}`;
        if (renderer.roadUploadKey !== roadUploadKey) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, animator.roadMaskCanvas);
          renderer.roadUploadKey = roadUploadKey;
        }
      }
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, renderer.lightTex);
      if (hasBakedShadow) {
        const lightUploadKey = `${animator._sceneLightBakeKey}|${lightMeta.width}x${lightMeta.height}|${lightMeta.originX},${lightMeta.originY},${lightMeta.pxPerWorld}`;
        if (renderer.lightUploadKey !== lightUploadKey) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, animator.sceneLightCanvas);
          renderer.lightUploadKey = lightUploadKey;
        }
      }
      gl.useProgram(renderer.program);
      gl.uniform2f(renderer.uResolution, canvas.width, canvas.height);
      const { cameraHeight, spanBase, spanScale, worldScale } = get2p5dParams();
      const view = getOrbitViewFrame(canvas);
      const camHeight = Math.max(80, cameraHeight * 92);
      const camDist = Math.max(40, spanBase * 2.2);
      const strength = Math.max(0, (spanScale / 260) * 3.0);
      const baseScale = 4.2 * worldScale;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, renderer.seedTex);
      gl.uniform1i(renderer.uSeedMap, 0);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, renderer.roadTex);
      gl.uniform1i(renderer.uRoadTex, 2);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, renderer.lightTex);
      gl.uniform1i(renderer.uLightTex, 3);
      gl.uniform2f(renderer.uSeedMapSize, animator.tilemapCanvas.width, animator.tilemapCanvas.height);
      gl.uniform1f(renderer.uHasRoad, hasRoadMask ? 1 : 0);
      gl.uniform4f(
        renderer.uRoadBounds,
        hasRoadMask ? roadMeta.minWorldX : 0,
        hasRoadMask ? roadMeta.minWorldY : 0,
        hasRoadMask ? roadMeta.maxWorldX : 1,
        hasRoadMask ? roadMeta.maxWorldY : 1
      );
      gl.uniform1f(renderer.uHasShadow, hasBakedShadow ? 1 : 0);
      gl.uniform4f(
        renderer.uLightMeta,
        hasBakedShadow ? lightMeta.originX : 0,
        hasBakedShadow ? lightMeta.originY : 0,
        hasBakedShadow ? lightMeta.pxPerWorld : 1,
        0
      );
      gl.uniform2f(
        renderer.uLightSize,
        hasBakedShadow ? lightMeta.width : 1,
        hasBakedShadow ? lightMeta.height : 1
      );
      gl.uniform1f(renderer.uShadowMult, Math.max(0, (Number(sun.shadowStrength) || 0) * (Number(sun.contrast) || 0)));
      gl.uniform1f(renderer.uWarmth, Number(sun.warmth) || 0);
      gl.uniform1f(renderer.uReflectionStrength, Math.max(0, Number(sun.reflectionStrength) || 0));
      gl.uniform1f(renderer.uGroundDepthDarkness, Math.max(0, Number(sun.groundDepthDarkness) || 0));
      gl.uniform1f(renderer.uFxBoost, fxMode ? 1.12 : 0.86);
      gl.uniform2f(renderer.uOriginTile, tx0, ty0);
      gl.uniform1i(renderer.uGridSize, spanX);
      gl.uniform1f(renderer.uRadius, meshRadius);
      gl.uniform2f(renderer.uPlayerWorld, animator.worldX, animator.worldY);
      gl.uniform2f(renderer.uPivot, view.pivotScreenX, view.pivotScreenY);
      gl.uniform2f(renderer.uTargetWorld, view.targetWorldX, view.targetWorldY);
      gl.uniform2f(renderer.uRight, view.rightX, view.rightY);
      gl.uniform2f(renderer.uToward, view.towardCamX, view.towardCamY);
      gl.uniform1f(renderer.uOrbitRadius, view.orbitRadius);
      gl.uniform1f(renderer.uCamDist, camDist);
      gl.uniform1f(renderer.uCamHeight, camHeight);
      gl.uniform1f(renderer.uStrength, strength);
      gl.uniform1f(renderer.uBaseScale, baseScale);
      gl.uniform1f(renderer.uSMin, 0.06);
      gl.uniform1f(renderer.uGroundSkew, Number.isFinite(animator.groundSkew) ? animator.groundSkew : 0);
      gl.uniform1f(renderer.uTilt, Number.isFinite(animator.tilt) ? animator.tilt : 1.0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, renderer.grassTex);
      gl.uniform1i(renderer.uGrassAtlas, 1);
      gl.uniform1f(renderer.uUseAtlas, renderer.grassReady ? 1 : 0);
      gl.bindVertexArray(renderer.vao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instanceCount);
      gl.bindVertexArray(null);
      gl.useProgram(null);
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(renderer.canvas, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      return true;
    }

    function drawSkyBackdrop(ctx, canvas) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      if (animator.activeSceneKind === "interior") {
        ctx.fillStyle = "#000000";
      } else {
        const sun = normalizedSunLighting();
        const dark = clampNumber(sun.ambientDarkness, 0, 1);
        const skyTop = [
          Math.round(lerpNumber(135, 16, dark)),
          Math.round(lerpNumber(206, 24, dark)),
          Math.round(lerpNumber(235, 42, dark)),
        ];
        const skyBottom = [
          Math.round(lerpNumber(198, 26, dark)),
          Math.round(lerpNumber(228, 34, dark)),
          Math.round(lerpNumber(244, 58, dark)),
        ];
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, `rgb(${skyTop[0]},${skyTop[1]},${skyTop[2]})`);
        grad.addColorStop(1, `rgb(${skyBottom[0]},${skyBottom[1]},${skyBottom[2]})`);
        ctx.fillStyle = grad;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    function drawDayNightAtmosphereOverlay(ctx, canvas) {
      if (animator.activeSceneKind === "interior") return;
      const sun = normalizedSunLighting();
      const dark = clampNumber(sun.ambientDarkness, 0, 1);
      if (!(dark > 0.01)) return;
      const w = canvas.width || 0;
      const h = canvas.height || 0;
      if (!(w > 0 && h > 0)) return;
      const horizon = effectiveGroundHorizonForCanvas(canvas);
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = Math.min(0.72, dark * 0.68);
      const globalShade = ctx.createLinearGradient(0, 0, 0, h);
      globalShade.addColorStop(0, "rgba(14, 20, 38, 1)");
      globalShade.addColorStop(Math.max(0, Math.min(1, horizon / Math.max(1, h))), "rgba(18, 24, 46, 1)");
      globalShade.addColorStop(1, "rgba(22, 30, 52, 1)");
      ctx.fillStyle = globalShade;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = Math.min(0.34, dark * 0.26);
      const moonTint = ctx.createLinearGradient(0, 0, 0, h);
      moonTint.addColorStop(0, "rgba(44, 78, 138, 1)");
      moonTint.addColorStop(0.56, "rgba(18, 34, 72, 0.55)");
      moonTint.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = moonTint;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    function drawHd2dStageVignette(ctx, canvas, focusX, focusY) {
      const w = canvas.width || 0;
      const h = canvas.height || 0;
      if (!(w > 0 && h > 0)) return;
      const cx = Number.isFinite(Number(focusX)) ? Number(focusX) : w * 0.5;
      const cy = Number.isFinite(Number(focusY)) ? Number(focusY) : h * 0.58;
      const rx = w * 0.72;
      const ry = h * 0.62;

      ctx.save();
      ctx.globalCompositeOperation = "multiply";

      const radial = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.16, cx, cy, Math.max(rx, ry));
      radial.addColorStop(0, "rgba(255,255,255,1)");
      radial.addColorStop(0.48, "rgba(245,248,250,0.98)");
      radial.addColorStop(0.78, "rgba(178,188,202,0.82)");
      radial.addColorStop(1, "rgba(72,84,104,0.58)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, w, h);

      const vertical = ctx.createLinearGradient(0, 0, 0, h);
      vertical.addColorStop(0, "rgba(62,72,92,0.62)");
      vertical.addColorStop(0.22, "rgba(210,216,222,0.94)");
      vertical.addColorStop(0.55, "rgba(255,255,255,1)");
      vertical.addColorStop(0.82, "rgba(205,210,218,0.91)");
      vertical.addColorStop(1, "rgba(48,56,72,0.55)");
      ctx.fillStyle = vertical;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
    }

    function draw2p5dSnowScene(ctx, canvas, fxMode) {
      const horizon = effectiveGroundHorizonForCanvas(canvas);
      const isInteriorScene = animator.activeSceneKind === "interior";
      const sceneBounds = animator.activeSceneBounds;
      // 室内地面使用独立 tile（interiorGround）渲染；WebGL 地面网格路径目前只适配室外 tilemap。
      // 若室内仍走 WebGL 路径，容易出现黑屏/地面不绘制，表现为“场景消失”。
      if (!isInteriorScene && drawGroundTileMeshWebGL(ctx, canvas, fxMode)) {
        drawFootTileHighlight(ctx, canvas, fxMode);
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      const { cameraHeight, forwardScale, spanBase, spanScale, worldScale } = get2p5dParams();

      // 方格 tilemap（俯视纹理）→ 单公式透视重采样
      if (!animator.tilemapPixels) ensurePlaceholderTilemap();
      if (!isInteriorScene) ensureBakedSceneLighting();
      const sun = normalizedSunLighting();
      const lightMeta = isInteriorScene ? null : animator._sceneLightBakeMeta;
      const lightData = isInteriorScene ? null : animator._sceneLightBakeData;
      const hasBakedShadow = !!(lightMeta && !lightMeta.empty && lightData);
      const lightOriginX = hasBakedShadow ? lightMeta.originX : 0;
      const lightOriginY = hasBakedShadow ? lightMeta.originY : 0;
      const lightPxPerWorld = hasBakedShadow ? lightMeta.pxPerWorld : 1;
      const lightW = hasBakedShadow ? lightMeta.width : 0;
      const lightH = hasBakedShadow ? lightMeta.height : 0;
      const shadowMult = isInteriorScene ? 0 : Math.max(0, (Number(sun.shadowStrength) || 0) * (Number(sun.contrast) || 0));
      const warmth = isInteriorScene ? 0 : (Number(sun.warmth) || 0);
      const reflectionStrength = isInteriorScene ? 0 : Math.max(0, Number(sun.reflectionStrength) || 0);
      const groundDepthDarkness = isInteriorScene ? 0 : Math.max(0, Number(sun.groundDepthDarkness) || 0);
      const reflectionStartY = h * 0.45;
      const reflectionInvRange = 1 / Math.max(1, h * 0.55);
      const fxBoost = fxMode ? 1.12 : 0.86;
      const tileW = animator.tilemapCanvas.width;
      const tileH = animator.tilemapCanvas.height;
      const tilePixels = animator.tilemapPixels;
      const roadMeta = isInteriorScene ? null : animator._sceneRoadMaskMeta;
      const roadPixels = isInteriorScene ? null : animator.roadMaskPixels;
      const hasRoadMask = !!(roadMeta && roadPixels);
      const roadMinWorldX = hasRoadMask ? roadMeta.minWorldX : 0;
      const roadMaxWorldX = hasRoadMask ? roadMeta.maxWorldX : 0;
      const roadMinWorldY = hasRoadMask ? roadMeta.minWorldY : 0;
      const roadMaxWorldY = hasRoadMask ? roadMeta.maxWorldY : 0;
      const roadPxPerWorld = hasRoadMask ? roadMeta.pixelsPerWorld : 1;
      const roadW = hasRoadMask ? roadMeta.width : 0;
      const roadH = hasRoadMask ? roadMeta.height : 0;

      const camHeight = Math.max(80, cameraHeight * 92);
      const camDist = Math.max(40, spanBase * 2.2);
      const strength = Math.max(0, (spanScale / 260) * 3.0);
      const baseScale = 4.2 * worldScale;
      const sMin = 0.06;
      const groundSkew = Number.isFinite(animator.groundSkew) ? animator.groundSkew : 0;
      const tilt = Number.isFinite(animator.tilt) ? animator.tilt : 1.0;

      const view = getOrbitViewFrame(canvas);
      const rWorld = isInteriorScene && sceneBounds
        ? Math.max(48, Math.hypot(sceneBounds.width || 0, sceneBounds.height || 0) + 18)
        : Math.max(80, animator.renderRadiusWorld || 320);
      const rWorld2 = rWorld * rWorld;
      const focusZ = camDist + view.orbitRadius;

      function sFromZ(z) {
        return perspectiveScaleAtDepth(z, baseScale, camHeight, strength, focusZ, sMin);
      }

      // 对给定 z（世界前向距离）算出它落到屏幕上的 y
      function screenYFromZ(z) {
        const s = sFromZ(z);
        const B = camDist + view.orbitRadius - z;
        return view.pivotScreenY + B * s * tilt;
      }

      // 反解：给定屏幕 y，求 z（单调，二分即可）
      function solveZForScreenY(targetY) {
        const zLo0 = 0.0001;
        // forwardScale 用作“可见纵深范围”；orbitRadius 体现镜头离角色的距离
        const zHi0 = camDist + view.orbitRadius + Math.max(10, forwardScale);
        let lo = zLo0;
        let hi = zHi0;
        let yLo = screenYFromZ(lo);
        let yHi = screenYFromZ(hi);

        // 如果 targetY 比最近点还靠下（更近），就钉在最近
        if (targetY >= yLo) return lo;
        // 如果 targetY 已经比远端还靠上，钉在最远
        if (targetY <= yHi) return hi;

        for (let i = 0; i < 18; i++) {
          const mid = (lo + hi) * 0.5;
          const yMid = screenYFromZ(mid);
          if (yMid > targetY) lo = mid; // 还不够远（y 还偏下），增大 z
          else hi = mid;
        }
        return (lo + hi) * 0.5;
      }

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      const depthDarkEndY = h * 0.86;
      const depthDarkInvRange = 1 / Math.max(1, depthDarkEndY - horizon);
      const img = borrowSnowImageData(w, h);
      const out = img.data;
      out.fill(0);

      function paintRowBlock(y, step) {
        const z = solveZForScreenY(y);
        const s = sFromZ(z);
        const B = camDist + view.orbitRadius - z;
        const invS = 1 / Math.max(s, 1e-4);
        let farGround = 0;
        if (groundDepthDarkness > 0) {
          farGround = (depthDarkEndY - y) * depthDarkInvRange;
          if (farGround < 0) farGround = 0;
          else if (farGround > 1) farGround = 1;
        }
        let nearGround = 0;
        if (reflectionStrength > 0) {
          nearGround = (y - reflectionStartY) * reflectionInvRange;
          if (nearGround < 0) nearGround = 0;
          else if (nearGround > 1) nearGround = 1;
        }

        for (let x = 0; x < w; x += step) {
          const A = ((x - view.pivotScreenX) + B * groundSkew) * invS;
          const wrx = view.targetWorldX + A * view.rightX + B * view.towardCamX;
          const wry = view.targetWorldY + A * view.rightY + B * view.towardCamY;
          const dxw = wrx - view.targetWorldX;
          const dyw = wry - view.targetWorldY;
          let rr, gg, bb;
          if ((dxw * dxw + dyw * dyw) > rWorld2) {
            continue;
          } else {
            let tileIdx = -1;
            if (isInteriorScene) {
              const tileX = Math.floor(wrx) - (Number(sceneBounds?.minX) || 0);
              const tileY = Math.floor(wry) - (Number(sceneBounds?.minY) || 0);
              if (tileX >= 0 && tileY >= 0 && tileX < tileW && tileY < tileH) {
                tileIdx = (tileY * tileW + tileX) * 4;
              }
            } else {
              const tileX = ((Math.floor(wrx) % tileW) + tileW) % tileW;
              const tileY = ((Math.floor(wry) % tileH) + tileH) % tileH;
              tileIdx = (tileY * tileW + tileX) * 4;
            }
            if (tileIdx >= 0) {
              rr = tilePixels[tileIdx];
              gg = tilePixels[tileIdx + 1];
              bb = tilePixels[tileIdx + 2];
            } else {
              rr = 0;
              gg = 0;
              bb = 0;
            }
            if (!isInteriorScene && hasRoadMask && wrx >= roadMinWorldX && wrx <= roadMaxWorldX && wry >= roadMinWorldY && wry <= roadMaxWorldY) {
              const mx = Math.floor((wrx - roadMinWorldX) * roadPxPerWorld);
              const my = Math.floor((wry - roadMinWorldY) * roadPxPerWorld);
              if (mx >= 0 && my >= 0 && mx < roadW && my < roadH) {
                const roadIdx = (my * roadW + mx) * 4;
                if (roadPixels[roadIdx + 3] >= 8) {
                  rr = roadPixels[roadIdx];
                  gg = roadPixels[roadIdx + 1];
                  bb = roadPixels[roadIdx + 2];
                }
              }
            }
            let shadow = 0;
            if (hasBakedShadow && shadowMult > 0) {
              const lx = Math.floor((wrx - lightOriginX) * lightPxPerWorld);
              const ly = Math.floor((wry - lightOriginY) * lightPxPerWorld);
              if (lx >= 0 && ly >= 0 && lx < lightW && ly < lightH) {
                shadow = Math.min(0.82, (lightData[(ly * lightW + lx) * 4 + 3] / 255) * shadowMult);
              }
            }
            const warm = (1 - shadow) * warmth;
            rr = rr * (1 - shadow * 0.46) + 18 * shadow + 42 * warm;
            gg = gg * (1 - shadow * 0.38) + 26 * shadow + 24 * warm;
            bb = bb * (1 - shadow * 0.24) + 42 * shadow - 10 * warm;

            if (groundDepthDarkness > 0) {
              if (farGround > 0) {
                const depthShade = farGround * groundDepthDarkness;
                rr = rr * (1 - depthShade * 0.46) + 16 * depthShade;
                gg = gg * (1 - depthShade * 0.36) + 24 * depthShade;
                bb = bb * (1 - depthShade * 0.22) + 42 * depthShade;
              }
            }

            if (reflectionStrength > 0) {
              if (nearGround > 0) {
                const glintBand = 0.5 + 0.5 * Math.sin(wrx * 0.055 - wry * 0.038 + x * 0.006);
                const lowFreq = 0.5 + 0.5 * Math.sin(wrx * 0.012 + wry * 0.017);
                const sheen = (1 - shadow * 0.75) * nearGround * reflectionStrength * (0.28 + 0.72 * glintBand * lowFreq);
                rr += (255 - rr) * sheen * 0.56 * fxBoost;
                gg += (238 - gg) * sheen * 0.48 * fxBoost;
                bb += (198 - bb) * sheen * 0.30 * fxBoost;
              }
            }
            rr = clamp255(rr);
            gg = clamp255(gg);
            bb = clamp255(bb);
          }
          // 写一个 step×step 小块，减少采样次数
          for (let oy = 0; oy < step && (y + oy) < h; oy++) {
            for (let ox = 0; ox < step && (x + ox) < w; ox++) {
              const i = ((y + oy) * w + (x + ox)) * 4;
              out[i] = rr;
              out[i + 1] = gg;
              out[i + 2] = bb;
              out[i + 3] = 255;
            }
          }
        }
      }

      // CPU 回退路径保持全采样。性能主要交给 GPU 路线，避免移动时粗采样导致地面闪烁。
      const ySplit = Math.floor(h * 0.55);
      const farStep = 1;
      const nearStep = 1;
      // 雪地 tile 铺满地平线以下整幅高度：条带上限不写死像素/比例，避免与 viewOffsetY 大值冲突再出半屏黑
      const maxGroundY = h;
      for (let y = horizon; y < Math.min(maxGroundY, ySplit); y += farStep) paintRowBlock(y, farStep);
      for (let y = Math.max(horizon, ySplit); y < maxGroundY; y += nearStep) paintRowBlock(y, nearStep);

      ctx.putImageData(img, 0, 0);
      ctx.restore();

      drawFootTileHighlight(ctx, canvas, fxMode);
    }

    function buildTreeSpriteCanvas() {
      if (animator._treeSpriteCanvas) return animator._treeSpriteCanvas;
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 44;
      const g = c.getContext("2d");
      g.imageSmoothingEnabled = false;
      // 树影（地面投影）
      g.fillStyle = "rgba(40,65,85,0.38)";
      g.fillRect(8, 35, 16, 5);
      // 树干
      g.fillStyle = "#6b4a2f";
      g.fillRect(14, 26, 4, 12);
      g.fillStyle = "#4d3420";
      g.fillRect(13, 28, 1, 10);
      g.fillRect(18, 28, 1, 10);
      // 雪冠（简化像素团）
      const lumps = [
        [6, 6, 8, 8], [14, 4, 10, 10], [20, 7, 8, 8],
        [8, 14, 10, 10], [16, 14, 10, 10], [12, 22, 12, 10],
      ];
      g.fillStyle = "#eaf6ff";
      lumps.forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
      g.fillStyle = "rgba(180,210,230,0.65)";
      g.fillRect(10, 10, 4, 4);
      g.fillRect(22, 12, 3, 3);
      g.fillRect(16, 20, 4, 3);
      animator._treeSpriteCanvas = c;
      return c;
    }

    function ensureSceneObjects() {
      if (animator._sceneObjects) return;
      animator._sceneObjects = [];
      markSceneObjectsDirty();
    }

    function drawSceneRenderable(ctx, canvas, fxMode, tree, item) {
      if (!item) return;
      if (item.kind === "building") {
        const o = item.object;
        drawVoxelBuilding(
          ctx,
          canvas,
          o.model,
          Number.isFinite(Number(item.renderWx)) ? Number(item.renderWx) : o.wx,
          Number.isFinite(Number(item.renderWy)) ? Number(item.renderWy) : o.wy,
          o.angle == null ? Math.PI * 0.25 : o.angle,
          fxMode,
          false,
          o.scale == null ? 1 : o.scale,
          item.sinkModelY || 0,
          item.clipModelY || 0
        );
        return;
      }
      if (item.kind === "sprite") {
        ctx.save();
        if (fxMode) {
          ctx.globalAlpha = 0.95 * (item.lodAlpha == null ? 1 : item.lodAlpha);
          ctx.filter = "contrast(1.05) saturate(1.05)";
        } else {
          ctx.globalAlpha = item.lodAlpha == null ? 1 : item.lodAlpha;
        }
        ctx.drawImage(tree, item.dx, item.dy, item.dw, item.dh);
        ctx.restore();
        return;
      }
      if (typeof item.draw === "function") item.draw();
    }

    function sceneChunkKey(cx, cy) {
      return cx + "," + cy;
    }

    function getSceneChunkIndex() {
      ensureSceneObjects();
      const rev = Number(animator._sceneSortRevision) || 0;
      if (animator._sceneChunkIndex && animator._sceneChunkRevision === rev) return animator._sceneChunkIndex;
      const chunkSize = Math.max(8, Number(animator.sceneChunkSizeWorld) || 64);
      const chunks = new Map();
      const objs = animator._sceneObjects || [];
      for (const o of objs) {
        if (!o) continue;
        const wx = Number(o.wx) || 0;
        const wy = Number(o.wy) || 0;
        const cx = Math.floor(wx / chunkSize);
        const cy = Math.floor(wy / chunkSize);
        const key = sceneChunkKey(cx, cy);
        let list = chunks.get(key);
        if (!list) {
          list = [];
          chunks.set(key, list);
        }
        list.push(o);
      }
      const index = { chunkSize, chunks };
      animator._sceneChunkIndex = index;
      animator._sceneChunkRevision = rev;
      return index;
    }

    function isProjectedAabbOutsideScreen(points, canvas, margin = 64) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let any = false;
      for (const p of points) {
        const sp = projectWorldToScreen(p.x, p.y, canvas);
        if (!sp || sp.scale <= 0) continue;
        any = true;
        minX = Math.min(minX, sp.sx);
        minY = Math.min(minY, sp.sy);
        maxX = Math.max(maxX, sp.sx);
        maxY = Math.max(maxY, sp.sy);
      }
      if (!any) return true;
      return maxX < -margin || minX > canvas.width + margin || maxY < -margin || minY > canvas.height + margin;
    }

    function getSceneObjectCandidates(canvas) {
      const index = getSceneChunkIndex();
      const chunkSize = index.chunkSize;
      const radius = Math.max(10, Number(animator.renderRadiusWorld) || 320);
      const chunkPad = chunkSize * 1.5;
      const minCx = Math.floor((animator.worldX - radius - chunkPad) / chunkSize);
      const maxCx = Math.floor((animator.worldX + radius + chunkPad) / chunkSize);
      const minCy = Math.floor((animator.worldY - radius - chunkPad) / chunkSize);
      const maxCy = Math.floor((animator.worldY + radius + chunkPad) / chunkSize);
      const out = [];
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cx = minCx; cx <= maxCx; cx++) {
          const x0 = cx * chunkSize;
          const y0 = cy * chunkSize;
          const x1 = x0 + chunkSize;
          const y1 = y0 + chunkSize;
          const nearestX = Math.max(x0, Math.min(animator.worldX, x1));
          const nearestY = Math.max(y0, Math.min(animator.worldY, y1));
          const dx = nearestX - animator.worldX;
          const dy = nearestY - animator.worldY;
          if ((dx * dx + dy * dy) > (radius + chunkPad) * (radius + chunkPad)) continue;
          if (isProjectedAabbOutsideScreen([
            { x: x0, y: y0 },
            { x: x1, y: y0 },
            { x: x1, y: y1 },
            { x: x0, y: y1 },
          ], canvas, 96)) continue;
          const list = index.chunks.get(sceneChunkKey(cx, cy));
          if (list && list.length) out.push(...list);
        }
      }
      return out;
    }

    function drawSceneBuildingBatch(ctx, canvas, fxMode, items) {
      if (!items || !items.length) return false;
      const renderer = clearBuildingWebGLLayer(canvas);
      if (!renderer) return false;
      let drewAny = false;
      for (const item of items) {
        if (!item || item.kind !== "building" || !item.object) continue;
        const o = item.object;
        drawVoxelBuilding(
          ctx,
          canvas,
          o.model,
          Number.isFinite(Number(item.renderWx)) ? Number(item.renderWx) : o.wx,
          Number.isFinite(Number(item.renderWy)) ? Number(item.renderWy) : o.wy,
          o.angle == null ? Math.PI * 0.25 : o.angle,
          fxMode,
          false,
          o.scale == null ? 1 : o.scale,
          item.sinkModelY || 0,
          item.clipModelY || 0,
          { clear: false, composite: false }
        );
        drewAny = true;
      }
      if (drewAny) {
        ctx.drawImage(renderer.canvas, 0, 0, canvas.width, canvas.height);
      }
      return drewAny;
    }

    function getSceneObjectSortId(o) {
      if (!o) return 0;
      const id = Number(o.id) || 0;
      if (id > 0) return id;
      if (!(Number(o._sceneSortId) > 0)) {
        animator._sceneSortNextId = (Number(animator._sceneSortNextId) || 1) + 1;
        o._sceneSortId = animator._sceneSortNextId;
      }
      return Number(o._sceneSortId) || 0;
    }

    function getSceneStaticSortCache(canvas) {
      ensureSceneObjects();
      const objs = animator._sceneObjects || [];
      const yawBucket = Math.round(((Number(animator.viewYaw) || 0) % (Math.PI * 2)) * 10000);
      const canvasTag = canvas === animator.stageCanvas ? "stage" : "main";
      const cacheKey = `${canvasTag}|rev:${Number(animator._sceneSortRevision) || 0}|yaw:${yawBucket}`;
      if (animator._sceneSortCacheKey === cacheKey && Array.isArray(animator._sceneSortOrderIds) && animator._sceneSortIndexById instanceof Map) {
        return {
          orderIds: animator._sceneSortOrderIds,
          indexById: animator._sceneSortIndexById,
        };
      }
      const ordered = [];
      for (const o of objs) {
        if (!o) continue;
        const p = projectWorldToScreen(Number(o.wx) || 0, Number(o.wy) || 0, canvas);
        ordered.push({
          id: getSceneObjectSortId(o),
          depthKey: Number.isFinite(p?.depthKey) ? p.depthKey : -Infinity,
        });
      }
      ordered.sort((a, b) => (b.depthKey - a.depthKey));
      const orderIds = ordered.map((it) => it.id);
      const indexById = new Map();
      for (let i = 0; i < orderIds.length; i++) indexById.set(orderIds[i], i);
      animator._sceneSortCacheKey = cacheKey;
      animator._sceneSortOrderIds = orderIds;
      animator._sceneSortIndexById = indexById;
      return { orderIds, indexById };
    }

    function insertRenderableByDepthDesc(renderables, item) {
      const targetDepth = Number(item && item.depthKey);
      if (!Number.isFinite(targetDepth)) {
        renderables.push(item);
        return;
      }
      let i = 0;
      while (i < renderables.length && Number(renderables[i].depthKey) >= targetDepth) i++;
      renderables.splice(i, 0, item);
    }

    function objectCollisionRadiusWorld(o) {
      if (!o) return 0;
      const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
      if (o.model) {
        const W = Number(o.model.W) || 0;
        const D = Number(o.model.D) || 0;
        const footprint = Math.max(W, D);
        return Math.max(0.5, footprint * scale * 0.26);
      }
      // 树等精灵较小占地，避免角色“穿树”
      return Math.max(0.5, 7 * scale);
    }

    function cross2(ax, ay, bx, by, cx, cy) {
      return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    }

    function convexHull2D(points) {
      if (!points || points.length < 3) return points ? points.slice() : [];
      const pts = points
        .map((p) => ({ x: Number(p.x) || 0, y: Number(p.y) || 0 }))
        .sort((a, b) => (a.x - b.x) || (a.y - b.y));
      const uniq = [];
      for (const p of pts) {
        const last = uniq[uniq.length - 1];
        if (!last || Math.abs(last.x - p.x) > 1e-6 || Math.abs(last.y - p.y) > 1e-6) uniq.push(p);
      }
      if (uniq.length < 3) return uniq;
      const lower = [];
      for (const p of uniq) {
        while (lower.length >= 2) {
          const a = lower[lower.length - 2];
          const b = lower[lower.length - 1];
          if (cross2(a.x, a.y, b.x, b.y, p.x, p.y) > 0) break;
          lower.pop();
        }
        lower.push(p);
      }
      const upper = [];
      for (let i = uniq.length - 1; i >= 0; i--) {
        const p = uniq[i];
        while (upper.length >= 2) {
          const a = upper[upper.length - 2];
          const b = upper[upper.length - 1];
          if (cross2(a.x, a.y, b.x, b.y, p.x, p.y) > 0) break;
          upper.pop();
        }
        upper.push(p);
      }
      lower.pop();
      upper.pop();
      return lower.concat(upper);
    }

    function pointInPolygon2D(px, py, poly) {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x, yi = poly[i].y;
        const xj = poly[j].x, yj = poly[j].y;
        const dy = yj - yi;
        if (Math.abs(dy) <= 1e-12) continue;
        const intersect = ((yi > py) !== (yj > py)) &&
          (px < (xj - xi) * (py - yi) / dy + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    function pointSegDistSq(px, py, ax, ay, bx, by) {
      const vx = bx - ax, vy = by - ay;
      const wx = px - ax, wy = py - ay;
      const vv = vx * vx + vy * vy;
      const t = vv > 1e-9 ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / vv)) : 0;
      const dx = px - (ax + vx * t);
      const dy = py - (ay + vy * t);
      return dx * dx + dy * dy;
    }

    function circleIntersectsPolygon2D(cx, cy, r, poly) {
      if (!poly || poly.length < 3) return false;
      if (pointInPolygon2D(cx, cy, poly)) return true;
      const r2 = r * r;
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        if (pointSegDistSq(cx, cy, a.x, a.y, b.x, b.y) <= r2) return true;
      }
      return false;
    }

    function pointInCollisionPolygons2D(px, py, polys) {
      if (!Array.isArray(polys)) return false;
      for (const poly of polys) {
        if (poly && poly.length >= 3 && pointInPolygon2D(px, py, poly)) return true;
      }
      return false;
    }

    function circleIntersectsCollisionPolygons2D(cx, cy, r, polys) {
      if (!Array.isArray(polys)) return false;
      for (const poly of polys) {
        if (poly && poly.length >= 3 && circleIntersectsPolygon2D(cx, cy, r, poly)) return true;
      }
      return false;
    }

    function circleOutsideBBox2D(cx, cy, r, bb) {
      return !!bb && (cx + r < bb.minX || cx - r > bb.maxX || cy + r < bb.minY || cy - r > bb.maxY);
    }

    function getModelCollisionPolygonsWorld(o) {
      if (!o?.model?.list?.length) return [];
      const model = o.model;
      const W = Number(model.W) || 0;
      const H = Number(model.H) || 0;
      const D = Number(model.D) || 0;
      if (!(W > 0 && H > 0 && D > 0)) return [];
      const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
      const angle = Number.isFinite(o.angle) ? o.angle : Math.PI * 0.25;
      const collisionHeightWorld = 6;
      const cacheKey = `${W}|${H}|${D}|${scale.toFixed(4)}|${angle.toFixed(4)}|${o.wx.toFixed(3)}|${o.wy.toFixed(3)}|singleCellGapWorldHeight:${collisionHeightWorld}`;
      if (o._collisionPolyKey === cacheKey && Array.isArray(o._collisionPolysWorld)) return o._collisionPolysWorld;

      // 只取低于 6 格 tilemap 世界高度的体素列参与碰撞。
      // 合并前只填补 1 格以内的小裂缝，超过 1 格宽的门洞/缝隙保持可通行。
      const collisionHeightModel = collisionHeightWorld / Math.max(scale, 1e-6);
      const cols = new Set();
      for (const v of model.list) {
        if (v.y < collisionHeightModel && (v.y + 1) > 0) cols.add(`${v.x},${v.z}`);
      }
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const occupied = Array.from({ length: D }, () => Array(W).fill(false));
      for (const key of cols) {
        const [xs, zs] = key.split(",");
        const x = Number(xs);
        const z = Number(zs);
        if (x >= 0 && x < W && z >= 0 && z < D) occupied[z][x] = true;
      }
      const baseOccupied = occupied.map((row) => row.slice());
      for (let z = 1; z + 1 < D; z++) {
        for (let x = 1; x + 1 < W; x++) {
          if (baseOccupied[z][x]) continue;
          const isolatedGap =
            baseOccupied[z][x - 1] &&
            baseOccupied[z][x + 1] &&
            baseOccupied[z - 1][x] &&
            baseOccupied[z + 1][x];
          if (isolatedGap) occupied[z][x] = true;
        }
      }
      const used = Array.from({ length: D }, () => Array(W).fill(false));
      const polys = [];
      function gridPointToWorld(x, z) {
        const lx = (x - W * 0.5) * scale;
        const lz = (z - D * 0.5) * scale;
        return {
          x: o.wx + (lx * cosA - lz * sinA),
          y: o.wy + (lx * sinA + lz * cosA),
        };
      }
      function rectToWorldPoly(x0, z0, x1, z1) {
        return [
          gridPointToWorld(x0, z0),
          gridPointToWorld(x1, z0),
          gridPointToWorld(x1, z1),
          gridPointToWorld(x0, z1),
        ];
      }
      function pushMergedIntervals(map, key, start, end) {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push([start, end]);
      }
      function mergeIntervals(intervals) {
        intervals.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
        const merged = [];
        for (const interval of intervals) {
          const last = merged[merged.length - 1];
          if (last && Math.abs(last[1] - interval[0]) <= 1e-9) {
            last[1] = Math.max(last[1], interval[1]);
          } else {
            merged.push(interval.slice());
          }
        }
        return merged;
      }
      function buildBoundarySegmentsWorld() {
        const horizontal = new Map();
        const vertical = new Map();
        for (let z = 0; z < D; z++) {
          for (let x = 0; x < W; x++) {
            if (!occupied[z][x]) continue;
            if (z <= 0 || !occupied[z - 1][x]) pushMergedIntervals(horizontal, z, x, x + 1);
            if (z + 1 >= D || !occupied[z + 1][x]) pushMergedIntervals(horizontal, z + 1, x, x + 1);
            if (x <= 0 || !occupied[z][x - 1]) pushMergedIntervals(vertical, x, z, z + 1);
            if (x + 1 >= W || !occupied[z][x + 1]) pushMergedIntervals(vertical, x + 1, z, z + 1);
          }
        }
        const segments = [];
        horizontal.forEach((intervals, z) => {
          for (const [x0, x1] of mergeIntervals(intervals)) {
            segments.push([gridPointToWorld(x0, z), gridPointToWorld(x1, z)]);
          }
        });
        vertical.forEach((intervals, x) => {
          for (const [z0, z1] of mergeIntervals(intervals)) {
            segments.push([gridPointToWorld(x, z0), gridPointToWorld(x, z1)]);
          }
        });
        return segments;
      }
      for (let z = 0; z < D; z++) {
        for (let x = 0; x < W; x++) {
          if (!occupied[z][x] || used[z][x]) continue;
          let rectW = 1;
          while (x + rectW < W && occupied[z][x + rectW] && !used[z][x + rectW]) rectW++;
          let rectH = 1;
          rowLoop: while (z + rectH < D) {
            for (let xx = x; xx < x + rectW; xx++) {
              if (!occupied[z + rectH][xx] || used[z + rectH][xx]) break rowLoop;
            }
            rectH++;
          }
          for (let zz = z; zz < z + rectH; zz++) {
            for (let xx = x; xx < x + rectW; xx++) used[zz][xx] = true;
          }
          polys.push(rectToWorldPoly(x, z, x + rectW, z + rectH));
        }
      }
      o._collisionPolyKey = cacheKey;
      o._collisionPolysWorld = polys;
      o._collisionDebugSegmentsWorld = buildBoundarySegmentsWorld();
      o._collisionPolyWorld = polys[0] || [];
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const poly of polys) {
        for (const p of poly) {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        }
      }
      o._collisionPolyBBox = polys.length ? { minX, minY, maxX, maxY } : null;
      return polys;
    }

    function getModelCollisionPolygonWorld(o) {
      const polys = getModelCollisionPolygonsWorld(o);
      return polys[0] || [];
    }

    function getObjectNearFieldRadiusWorld(o) {
      if (!o) return 0;
      if (o.model) {
        const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
        const W = Math.max(1, Number(o.model.W) || 1);
        const D = Math.max(1, Number(o.model.D) || 1);
        return Math.max(1, Math.hypot(W, D) * scale * 0.5);
      }
      return Math.max(0, objectCollisionRadiusWorld(o));
    }

    function isObjectWithinCollisionNearField(o, px, py, nearFieldRadius, extraRadius = 0) {
      const objRadius = getObjectNearFieldRadiusWorld(o);
      const activeR = Math.max(0, nearFieldRadius) + Math.max(0, extraRadius) + objRadius;
      if (!(activeR > 0)) return true;
      const dx = (Number(o.wx) || 0) - px;
      const dy = (Number(o.wy) || 0) - py;
      return (dx * dx + dy * dy) <= (activeR * activeR);
    }

    function getSceneObjectsNearWorldPoint(wx, wy, radiusWorld, extraPadWorld = 0, out = null) {
      ensureSceneObjects();
      const objs = animator._sceneObjects || [];
      const result = Array.isArray(out) ? out : [];
      result.length = 0;
      if (!objs.length) return result;
      const index = getSceneChunkIndex();
      const chunkSize = index.chunkSize;
      const searchRadius = Math.max(0, Number(radiusWorld) || 0) + Math.max(0, Number(extraPadWorld) || 0);
      if (!(searchRadius > 0)) {
        result.push(...objs);
        return result;
      }
      const minCx = Math.floor((wx - searchRadius) / chunkSize);
      const maxCx = Math.floor((wx + searchRadius) / chunkSize);
      const minCy = Math.floor((wy - searchRadius) / chunkSize);
      const maxCy = Math.floor((wy + searchRadius) / chunkSize);
      const token = (((animator._sceneObjectNearQueryToken || 0) + 1) & 0x7fffffff) || 1;
      animator._sceneObjectNearQueryToken = token;
      const r2 = searchRadius * searchRadius;
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cx = minCx; cx <= maxCx; cx++) {
          const x0 = cx * chunkSize;
          const y0 = cy * chunkSize;
          const x1 = x0 + chunkSize;
          const y1 = y0 + chunkSize;
          const nearestX = Math.max(x0, Math.min(wx, x1));
          const nearestY = Math.max(y0, Math.min(wy, y1));
          const dx = nearestX - wx;
          const dy = nearestY - wy;
          if ((dx * dx + dy * dy) > r2) continue;
          const list = index.chunks.get(sceneChunkKey(cx, cy));
          if (!list || !list.length) continue;
          for (const o of list) {
            if (!o || o._sceneObjectNearQueryToken === token) continue;
            o._sceneObjectNearQueryToken = token;
            result.push(o);
          }
        }
      }
      return result;
    }

    function getPlayerCollisionBlockerAt(wx, wy, canvas = getLogicCanvas()) {
      if (!animator.enablePlayerCollision) return null;
      ensureSceneObjects();
      const pr = getPlayerCollisionRadiusWorld(canvas);
      const nearFieldEnabled = !!animator.collisionNearFieldEnabled;
      const nearFieldRadius = Math.max(0, Number(animator.collisionNearFieldRadiusWorld) || 0);
      const chunkPad = Math.max(pr + 12, (Number(animator.sceneChunkSizeWorld) || 64) * 1.5);
      const baseQueryRadius = nearFieldEnabled ? (nearFieldRadius + pr) : Math.max(pr * 2, 24);
      const scratch = animator._playerCollisionScratchObjects || (animator._playerCollisionScratchObjects = []);
      const objs = getSceneObjectsNearWorldPoint(wx, wy, baseQueryRadius, chunkPad, scratch);
      for (const o of objs) {
        if (nearFieldEnabled && !isObjectWithinCollisionNearField(o, wx, wy, nearFieldRadius, pr)) {
          continue;
        }
        if (o.model) {
          const polys = getModelCollisionPolygonsWorld(o);
          if (circleOutsideBBox2D(wx, wy, pr, o._collisionPolyBBox)) continue;
          if (polys.length && circleIntersectsCollisionPolygons2D(wx, wy, pr, polys)) {
            return {
              object: o,
              objectType: "building",
              shape: "polygons",
              playerRadius: pr,
              polys,
            };
          }
          continue;
        }
        const or = objectCollisionRadiusWorld(o);
        if (or > 0) {
          const dx = wx - o.wx;
          const dy = wy - o.wy;
          const rr = pr + or;
          if ((dx * dx + dy * dy) < rr * rr) {
            return {
              object: o,
              objectType: "sprite",
              shape: "circle",
              playerRadius: pr,
              objectRadius: or,
            };
          }
        }
      }
      return null;
    }

    function isPlayerCollidingAt(wx, wy, canvas = getLogicCanvas()) {
      return !!getPlayerCollisionBlockerAt(wx, wy, canvas);
    }

    function getPlayerCollisionRadiusWorld(canvas = getLogicCanvas()) {
      const fallback = Math.max(1, Number(animator.playerCollisionRadius) || 12);
      if (!animator.playerCollisionAutoFromFoot) return fallback;
      if (!canvas || !animator.frameWidth || !animator.scale) return fallback;

      // 碰撞使用脚底核心接触点；完整脚底阴影太宽，会把 6 / scale 留出的门洞吃掉。
      const dw = animator.frameWidth * animator.scale;
      const worldScaleRef = 0.62;
      const effectiveCharPx = (animator.targetCharPx || 22) * (animator.worldScale / worldScaleRef);
      const charMul = Math.max(0.06, Math.min(4, effectiveCharPx / Math.max(1, dw)));
      const drawW = dw * charMul;
      const targetPxRadius = Math.max(0.4, drawW * 0.26 * 0.1);

      const view = getOrbitViewFrame(canvas);
      const c = projectWorldToScreen(animator.worldX, animator.worldY, canvas);
      const r = projectWorldToScreen(animator.worldX + view.rightX, animator.worldY + view.rightY, canvas);
      const pxPerWorld = Math.hypot(r.sx - c.sx, r.sy - c.sy);
      if (!(pxPerWorld > 1e-5)) return fallback;
      const autoRadius = Math.max(1, targetPxRadius / pxPerWorld);
      // 防止因投影参数波动导致碰撞半径异常放大，从而远距离误判碰撞
      return Math.max(1, Math.min(fallback * 1.9, autoRadius));
    }

    function getObjectDisplayNameForInteraction(o) {
      if (!o) return "未知物体";
      return String(
        o.asset?.libraryMeta?.title ||
        o.asset?.id ||
        o.asset?.prompt ||
        o.title ||
        o.name ||
        o.label ||
        o.type ||
        "未知物体"
      );
    }

    function getObjectPromptLikeText(o) {
      return [
        o?.label || "",
        o?.title || "",
        o?.prompt || "",
        o?.asset?.prompt || "",
        o?.asset?.libraryMeta?.prompt || "",
      ].join(" ");
    }

    function getObjectInteractionTags(o) {
      const merged = []
        .concat(o?.interactionTags || [])
        .concat(Array.isArray(o?.tags) ? o.tags : [])
        .concat(Array.isArray(o?.asset?.interactionTags) ? o.asset.interactionTags : [])
        .concat(Array.isArray(o?.asset?.tags) ? o.asset.tags : [])
        .concat(Array.isArray(o?.asset?.libraryMeta?.tags) ? o.asset.libraryMeta.tags : []);
      return normalizeInteractionTags(merged, getObjectPromptLikeText(o));
    }

    function objectHasSignFeature(o) {
      if (normalizeSemanticTags(o?.tags).includes("sign")) return true;
      const rawTags = []
        .concat(o?.interactionTags || [])
        .concat(Array.isArray(o?.tags) ? o.tags : [])
        .concat(Array.isArray(o?.asset?.interactionTags) ? o.asset.interactionTags : [])
        .concat(Array.isArray(o?.asset?.tags) ? o.asset.tags : [])
        .concat(Array.isArray(o?.asset?.libraryMeta?.tags) ? o.asset.libraryMeta.tags : []);
      if (rawTags.some((tag) => String(tag || "").trim().toLowerCase() === "item:sign")) return true;
      const tags = getObjectInteractionTags(o);
      if (tags.includes("item:sign")) return true;
      const signText = String(o?.properties?.sign?.text || o?.asset?.libraryMeta?.signText || "").trim();
      if (signText) return true;
      return false;
    }

    function getSignTextForObject(o) {
      const signText = String(o?.properties?.sign?.text || o?.asset?.libraryMeta?.signText || "").trim();
      if (signText) return signText;
      return "（暂无记录文字）";
    }

    function isHouseObject(o) {
      if (!o || !o.model) return false;
      if (o.isHouse) return true;
      if (String(o.buildingTag || "").toLowerCase() === "house") return true;
      return normalizeSemanticTags(o.tags).includes("house");
    }

    function getEmbeddedHouseBridgeSceneObjectId(o) {
      if (!o || typeof o !== "object") return "";
      return String(o.properties?.zhuYuanzhangBridge?.sceneObjectId || "").trim();
    }

    function postEmbeddedHouseBridgeMessage(o) {
      const sceneObjectId = getEmbeddedHouseBridgeSceneObjectId(o);
      if (!isEmbeddedEngine || !sceneObjectId || !window.parent || window.parent === window) return false;
      const houseId = String(o.properties?.zhuYuanzhangBridge?.houseId || "").trim();
      window.parent.postMessage(
        {
          type: "hd2deg:enter-house",
          sceneObjectId,
          houseId,
          sceneId: getCurrentSceneId(),
          engineObjectId: o.id,
        },
        window.location.origin
      );
      return true;
    }

    function isContainerObject(o) {
      if (!o || !o.model) return false;
      const semantic = normalizeSemanticTags(o.tags);
      if (semantic.includes("container")) return true;
      const tags = getObjectInteractionTags(o);
      return tags.includes("item:container");
    }

    function isFacilityObject(o) {
      if (!o || !o.model) return false;
      if (o.properties?.facility && typeof o.properties.facility === "object") return true;
      return normalizeSemanticTags(o.tags).includes("facility");
    }

    function getActiveInteriorState() {
      return animator.interiorState && animator.interiorState.active ? animator.interiorState : null;
    }

    function clearActiveInteriorState() {
      if (!animator.interiorState || typeof animator.interiorState !== "object") return;
      animator.interiorState.active = false;
      animator.interiorState.hostObjectId = 0;
      animator.interiorState.sceneId = "";
      animator.interiorState.returnSceneId = "";
      animator.interiorState.returnWorldX = 0;
      animator.interiorState.returnWorldY = 0;
      animator.interiorState.data = null;
    }

    function findSceneObjectById(id) {
      const targetId = Number(id) || 0;
      if (!(targetId > 0)) return null;
      ensureSceneObjects();
      for (const o of (animator._sceneObjects || [])) {
        if (Number(o?.id) === targetId) return o;
      }
      return null;
    }

    function normalizeInteriorDoorSide(side) {
      const v = String(side || "").toLowerCase();
      if (v === "north" || v === "south" || v === "east" || v === "west") return v;
      return "south";
    }

    function inferInteriorDoorSideFromObject(o) {
      if (!o) return "south";
      const angle = Number(o.angle);
      if (!Number.isFinite(angle)) {
        const id = Number(o.id) || 0;
        return ["south", "east", "north", "west"][((id % 4) + 4) % 4];
      }
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "east" : "west";
      return dy >= 0 ? "south" : "north";
    }

    function buildDefaultHouseInterior(o) {
      const width = 15;
      const height = 15;
      const centerX = Math.floor(width * 0.5);
      const centerY = Math.floor(height * 0.5);
      const side = normalizeInteriorDoorSide(inferInteriorDoorSideFromObject(o));
      const door = { side, x: centerX, y: height, entryX: centerX, entryY: height - 1 };
      if (side === "north") {
        door.y = -1;
        door.entryY = 0;
      } else if (side === "west") {
        door.x = -1;
        door.y = centerY;
        door.entryX = 0;
        door.entryY = centerY;
      } else if (side === "east") {
        door.x = width;
        door.y = centerY;
        door.entryX = width - 1;
        door.entryY = centerY;
      }
      return {
        version: 1,
        kind: "house-room",
        width,
        height,
        door,
        spawnX: door.entryX + 0.5,
        spawnY: door.entryY + 0.5,
        facilities: [],
      };
    }

    function ensureHouseInteriorData(o) {
      if (!o) return buildDefaultHouseInterior(null);
      if (!o.interior || typeof o.interior !== "object") {
        o.interior = buildDefaultHouseInterior(o);
        return o.interior;
      }
      const interior = o.interior;
      interior.version = Number(interior.version) || 1;
      interior.kind = interior.kind || "house-room";
      interior.width = Math.max(1, Math.floor(Number(interior.width) || 15));
      interior.height = Math.max(1, Math.floor(Number(interior.height) || 15));
      interior.door = interior.door || {};
      interior.door.side = normalizeInteriorDoorSide(interior.door.side || inferInteriorDoorSideFromObject(o));
      const fallback = buildDefaultHouseInterior(o);
      if (!Number.isFinite(Number(interior.door.x))) interior.door.x = fallback.door.x;
      if (!Number.isFinite(Number(interior.door.y))) interior.door.y = fallback.door.y;
      if (!Number.isFinite(Number(interior.door.entryX))) interior.door.entryX = fallback.door.entryX;
      if (!Number.isFinite(Number(interior.door.entryY))) interior.door.entryY = fallback.door.entryY;
      interior.spawnX = Number.isFinite(Number(interior.spawnX)) ? Number(interior.spawnX) : fallback.spawnX;
      interior.spawnY = Number.isFinite(Number(interior.spawnY)) ? Number(interior.spawnY) : fallback.spawnY;
      if (!Array.isArray(interior.facilities)) interior.facilities = [];
      return interior;
    }

    function ensureHouseInteriorRef(o, parentSceneId = getCurrentSceneId()) {
      if (!o || typeof o !== "object") return null;
      const next = interiorRefToSnapshot(o.interiorRef) || {
        id: buildInteriorSceneId(parentSceneId, o.id),
        parentSceneId: sanitizeSceneId(parentSceneId) || DEFAULT_SCENE_ID,
        hostObjectId: Number(o.id) || 0,
        version: 1,
      };
      next.parentSceneId = sanitizeSceneId(parentSceneId || next.parentSceneId) || DEFAULT_SCENE_ID;
      next.hostObjectId = Number(next.hostObjectId || o.id) || 0;
      if (!next.id) next.id = buildInteriorSceneId(next.parentSceneId, next.hostObjectId);
      o.interiorRef = next;
      return next;
    }

    function buildInteriorScenePayloadForHouse(o, parentSceneId = getCurrentSceneId()) {
      const interior = ensureHouseInteriorData(o);
      const interiorRef = ensureHouseInteriorRef(o, parentSceneId);
      const ground = buildInteriorGroundState(interior);
      const bounds = getInteriorGroundBounds(interior);
      const parentId = sanitizeSceneId(parentSceneId) || DEFAULT_SCENE_ID;
      const hostObjectId = Number(interiorRef?.hostObjectId || o?.id) || 0;
      const interiorLayout = interiorToSnapshot(interior);
      return {
        schemaVersion: 1,
        kind: "interior",
        id: interiorRef.id,
        title: interiorRef.id,
        savedAt: Date.now(),
        nextBuildingId: 1,
        tilemapBaseDataUrl: ground.canvas.toDataURL("image/png"),
        tilemapDataUrl: ground.canvas.toDataURL("image/png"),
        objects: [],
        roadNetwork: null,
        spawn: {
          x: Number(interior.spawnX) || 0.5,
          y: Number(interior.spawnY) || 0.5,
        },
        bounds,
        entities: { npcs: [] },
        extensions: {
          sceneKind: "interior",
          parentSceneId: parentId,
          hostObjectId,
          interiorLayout,
        },
        sceneMeta: {
          kind: "interior",
          parentSceneId: parentId,
          hostObjectId,
          interiorLayout,
        },
      };
    }

    async function ensureInteriorSceneExistsForHouse(o, parentSceneId = getCurrentSceneId()) {
      const interiorRef = ensureHouseInteriorRef(o, parentSceneId);
      const layout = ensureHouseInteriorData(o);
      let scene = null;
      try {
        scene = await loadScenePayloadFromFiles(interiorRef.id);
      } catch (_) {}
      if (!scene) {
        scene = buildInteriorScenePayloadForHouse(o, parentSceneId);
        await saveScenePayloadToFiles(interiorRef.id, scene);
      }
      return {
        sceneId: interiorRef.id,
        interiorRef,
        layout: interiorToSnapshot(layout),
        scene,
      };
    }

    function interiorContainsFloorTile(interior, tx, ty) {
      if (!interior) return false;
      const w = Math.max(1, Math.floor(Number(interior.width) || 15));
      const h = Math.max(1, Math.floor(Number(interior.height) || 15));
      if (tx >= 0 && tx < w && ty >= 0 && ty < h) return true;
      const door = interior.door || {};
      return tx === Math.floor(Number(door.x) || 0) && ty === Math.floor(Number(door.y) || 0);
    }

    function getInteriorBlockingFacilityAt(interior, tx, ty) {
      if (!interior || !Array.isArray(interior.facilities)) return null;
      for (const facility of interior.facilities) {
        if (!facility || !facility.block) continue;
        const x0 = Math.floor(Number(facility.x) || 0);
        const y0 = Math.floor(Number(facility.y) || 0);
        const w = Math.max(1, Math.floor(Number(facility.w) || 1));
        const d = Math.max(1, Math.floor(Number(facility.d) || 1));
        if (tx >= x0 && tx < (x0 + w) && ty >= y0 && ty < (y0 + d)) return facility;
      }
      return null;
    }

    function isInteriorWalkablePoint(interior, wx, wy) {
      const tx = Math.floor(wx);
      const ty = Math.floor(wy);
      if (!interiorContainsFloorTile(interior, tx, ty)) return false;
      return !getInteriorBlockingFacilityAt(interior, tx, ty);
    }

    function getInteriorGroundBounds(interior) {
      const w = Math.max(1, Math.floor(Number(interior?.width) || 15));
      const h = Math.max(1, Math.floor(Number(interior?.height) || 15));
      const doorX = Math.floor(Number(interior?.door?.x) || 0);
      const doorY = Math.floor(Number(interior?.door?.y) || 0);
      const minX = Math.min(0, doorX);
      const minY = Math.min(0, doorY);
      const maxX = Math.max(w - 1, doorX);
      const maxY = Math.max(h - 1, doorY);
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
      };
    }

    function buildInteriorGroundState(interior) {
      const bounds = getInteriorGroundBounds(interior);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, bounds.width);
      canvas.height = Math.max(1, bounds.height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const roomW = Math.max(1, Math.floor(Number(interior?.width) || 15));
      const roomH = Math.max(1, Math.floor(Number(interior?.height) || 15));
      const doorX = Math.floor(Number(interior?.door?.x) || 0);
      const doorY = Math.floor(Number(interior?.door?.y) || 0);
      const ox = -bounds.minX;
      const oy = -bounds.minY;
      for (let y = 0; y < roomH; y++) {
        for (let x = 0; x < roomW; x++) {
          ctx.fillStyle = "#111821";
          ctx.fillRect(x + ox, y + oy, 1, 1);
        }
      }
      ctx.fillStyle = "#35220d";
      ctx.fillRect(doorX + ox, doorY + oy, 1, 1);

      return {
        canvas,
        pixels: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
        originX: bounds.minX,
        originY: bounds.minY,
        width: canvas.width,
        height: canvas.height,
        renderRadiusWorld: Math.max(48, Math.hypot(bounds.width, bounds.height) + 18),
      };
    }

    function ensureInteriorGroundState(interior) {
      if (!interior || typeof interior !== "object") return null;
      const door = interior.door || {};
      const key = [
        Number(interior.width) || 15,
        Number(interior.height) || 15,
        Number(door.x) || 0,
        Number(door.y) || 0,
      ].join("|");
      if (interior._groundState && interior._groundStateKey === key) return interior._groundState;
      interior._groundState = buildInteriorGroundState(interior);
      interior._groundStateKey = key;
      return interior._groundState;
    }

    function distanceOutsideAxisAlignedRect(px, py, x0, y0, x1, y1) {
      const nx = Math.max(x0, Math.min(px, x1));
      const ny = Math.max(y0, Math.min(py, y1));
      return Math.hypot(px - nx, py - ny);
    }

    function collectInteriorNearbyInteractionActions(canvas = getLogicCanvas()) {
      const state = getActiveInteriorState();
      if (!state || !state.data || !elFxFullscreen.classList.contains("open")) return [];
      const px = Number(animator.worldX) || 0;
      const py = Number(animator.worldY) || 0;
      const playerRadius = getPlayerCollisionRadiusWorld(canvas);
      const triggerGap = Math.max(0, Number(animator.interactionTileRange) || 1);
      const door = state.data.door || { x: 0, y: 0 };
      const gap = distanceOutsideAxisAlignedRect(
        px,
        py,
        Number(door.x) || 0,
        Number(door.y) || 0,
        (Number(door.x) || 0) + 1,
        (Number(door.y) || 0) + 1
      ) - playerRadius;
      if (!Number.isFinite(gap) || gap > triggerGap) return [];
      return [{
        gap,
        action: {
          kind: "house-leave",
          label: "离开",
          object: findSceneObjectById(state.hostObjectId),
        },
        objectName: "门口",
        objectKey: `interior-door:${state.hostObjectId || 0}`,
      }];
    }

    function startScreenFadeTransition(onMidpoint, onComplete = null) {
      const fade = animator.screenFade;
      fade.active = true;
      fade.elapsedMs = 0;
      fade.midpointDone = false;
      fade.midpointPending = false;
      fade.onMidpoint = typeof onMidpoint === "function" ? onMidpoint : null;
      fade.onComplete = typeof onComplete === "function" ? onComplete : null;
      closeInteractionModal();
    }

    function updateScreenFadeTransition(dt) {
      const fade = animator.screenFade;
      if (!fade.active) return;
      const delta = Math.max(0, Number(dt) || 0);
      if (!fade.midpointDone) {
        fade.elapsedMs += delta;
        if (fade.elapsedMs < fade.outMs) return;
        const midpoint = fade.onMidpoint;
        fade.onMidpoint = null;
        try {
          const result = midpoint && midpoint();
          if (result && typeof result.then === "function") {
            fade.midpointPending = true;
            Promise.resolve(result).catch((err) => {
              console.warn("[screen-fade-midpoint-failed]", err);
            }).finally(() => {
              fade.midpointPending = false;
              fade.midpointDone = true;
              fade.elapsedMs = Math.max(fade.elapsedMs, fade.outMs + fade.holdMs);
            });
            return;
          }
        } catch (err) {
          console.warn("[screen-fade-midpoint-failed]", err);
        }
        fade.midpointDone = true;
        fade.elapsedMs = Math.max(fade.elapsedMs, fade.outMs + fade.holdMs);
        return;
      }
      if (fade.midpointPending) return;
      fade.elapsedMs += delta;
      const total = fade.outMs + fade.holdMs + fade.inMs;
      if (fade.elapsedMs >= total) {
        fade.active = false;
        fade.elapsedMs = total;
        try {
          fade.onComplete && fade.onComplete();
        } finally {
          fade.onComplete = null;
        }
      }
    }

    function getScreenFadeAlpha() {
      const fade = animator.screenFade;
      if (!fade.active) return 0;
      if (fade.midpointPending) return 1;
      const t = Math.max(0, Number(fade.elapsedMs) || 0);
      if (t <= fade.outMs) return clamp01(t / Math.max(1, fade.outMs));
      if (t <= (fade.outMs + fade.holdMs)) return 1;
      const inT = t - fade.outMs - fade.holdMs;
      return 1 - clamp01(inT / Math.max(1, fade.inMs));
    }

    function drawScreenFadeOverlay(ctx, canvas) {
      const alpha = getScreenFadeAlpha();
      if (!(alpha > 0.001)) return;
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${clamp01(alpha)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    function enterHouseInterior(o) {
      if (!o || animator.screenFade.active) return;
      if (postEmbeddedHouseBridgeMessage(o)) return;
      const returnSceneId = getCurrentSceneId();
      const returnWorldX = Number(animator.worldX) || 0;
      const returnWorldY = Number(animator.worldY) || 0;
      cancelPlacement();
      startScreenFadeTransition(async () => {
        const interiorScene = await ensureInteriorSceneExistsForHouse(o, returnSceneId);
        await saveActiveScene(returnSceneId);
        await loadSceneById(interiorScene.sceneId, {
          runtimeKind: "interior",
          returnSceneId,
          returnWorldX,
          returnWorldY,
          hostObjectId: Number(o.id) || 0,
          interiorLayout: interiorScene.layout,
          useSceneSpawn: true,
        });
      });
    }

    function leaveHouseInterior() {
      const state = getActiveInteriorState();
      if (!state || animator.screenFade.active) return;
      const returnWorldX = Number(state.returnWorldX) || 0;
      const returnWorldY = Number(state.returnWorldY) || 0;
      const returnSceneId = resolveWorldSceneId(state.returnSceneId || DEFAULT_SCENE_ID);
      const interiorSceneId = sanitizeSceneId(state.sceneId) || getCurrentSceneId();
      startScreenFadeTransition(async () => {
        await saveActiveScene(interiorSceneId);
        await loadSceneById(returnSceneId, {
          runtimeKind: "world",
          useSceneSpawn: false,
        });
        animator.worldX = returnWorldX;
        animator.worldY = returnWorldY;
        refreshNearbyInteractions(getLogicCanvas());
      });
    }

    function getObjectInteractionActions(o) {
      const actions = [];
      const isHouse = isHouseObject(o);
      const isFacility = isFacilityObject(o);
      const isContainer = !isFacility && isContainerObject(o);
      if (isHouse && animator.activeSceneKind !== "interior") {
        actions.push({
          kind: "house-enter",
          label: "进入",
          object: o,
        });
      }
      if (isContainer) {
        actions.push({
          kind: "container-open",
          label: "打开",
          object: o,
        });
      }
      if (isFacility) {
        actions.push({
          kind: "facility-open",
          label: "打开",
          object: o,
        });
      }
      if (objectHasSignFeature(o)) {
        actions.push({
          kind: "sign-read",
          label: "阅读",
          object: o,
        });
      }
      return actions;
    }

    function getNpcInteractionGap(npc, canvas = getLogicCanvas()) {
      if (!npc) return Infinity;
      const px = Number(animator.worldX) || 0;
      const py = Number(animator.worldY) || 0;
      const playerRadius = getPlayerCollisionRadiusWorld(canvas);
      const npcRadius = getNpcStandCollisionRadiusWorld(canvas);
      const d = Math.hypot(px - (Number(npc.wx) || 0), py - (Number(npc.wy) || 0));
      return d - (playerRadius + npcRadius);
    }

    function getNpcInteractionActions(npc) {
      if (!npc) return [];
      return [{
        kind: "npc-interact",
        label: `交互 ${String(npc.name || npc.npcId || "NPC")}`,
        npc,
      }];
    }

    function buildNpcModalShell(npc, subtitle = "") {
      const wrap = document.createElement("div");
      wrap.className = "fx-container-modal fx-npc-modal";
      wrap.__npcInteractionNpc = npc || null;
      const title = document.createElement("div");
      title.className = "fx-container-title";
      title.textContent = String(npc?.name || npc?.npcId || "NPC");
      const hint = document.createElement("div");
      hint.className = "fx-container-hint";
      hint.textContent = subtitle || String(npc?.meta?.role || "").trim() || "村民";
      const body = document.createElement("div");
      body.className = "fx-npc-modal-body";
      const footer = document.createElement("div");
      footer.className = "fx-container-actions";
      wrap.appendChild(title);
      wrap.appendChild(hint);
      wrap.appendChild(body);
      wrap.appendChild(footer);
      return { wrap, body, footer };
    }

    function buildNpcActionPickerModal(npc) {
      const clock = getNpcClockState();
      const { wrap, body, footer } = buildNpcModalShell(npc, `${String(npc?.meta?.role || "").trim()} · ${clock.timeLabel}`);
      const summary = document.createElement("div");
      summary.className = "fx-npc-summary";
      const mood = Number(npc?.emotions?.mood) || 0;
      const eventSummary = Array.isArray(npc?.recentEvents) && npc.recentEvents.length
        ? String(npc.recentEvents[npc.recentEvents.length - 1]?.summary || "").trim()
        : "";
      summary.textContent = eventSummary || `当前心情 ${mood >= 2 ? "不错" : (mood <= -2 ? "有些低落" : "平静")}。`;
      body.appendChild(summary);
      const actions = document.createElement("div");
      actions.className = "fx-npc-action-grid";
      const defs = [
        { label: "对话", onClick: () => openInteractionModal(buildNpcTalkModal(npc)) },
        { label: "赠送", onClick: () => openInteractionModal(buildNpcGiftModal(npc)) },
        { label: "交易", onClick: () => openInteractionModal(buildNpcTradeModal(npc)) },
      ];
      defs.forEach((def) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fx-container-close fx-npc-action-btn";
        btn.textContent = def.label;
        btn.addEventListener("click", def.onClick);
        actions.appendChild(btn);
      });
      body.appendChild(actions);
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "fx-container-close";
      closeBtn.textContent = "关闭";
      closeBtn.addEventListener("click", () => closeInteractionModal());
      footer.appendChild(closeBtn);
      return wrap;
    }

    function buildNpcConversationLines(container, payload, npc, partnerLabel = "玩家") {
      container.innerHTML = "";
      const lines = Array.isArray(payload?.lines) ? payload.lines : [];
      if (!lines.length) {
        container.textContent = "一时无话。";
        return;
      }
      for (const line of lines) {
        const row = document.createElement("div");
        row.className = "fx-npc-line";
        const speaker = document.createElement("strong");
        speaker.textContent = String(line?.speaker || "") === "a"
          ? String(npc?.name || npc?.npcId || "NPC")
          : partnerLabel;
        const text = document.createElement("span");
        text.textContent = String(line?.text || "").trim();
        row.appendChild(speaker);
        row.appendChild(text);
        container.appendChild(row);
      }
    }

    function buildNpcTalkModal(npc) {
      const clock = getNpcClockState();
      const { wrap, body, footer } = buildNpcModalShell(npc, `${String(npc?.meta?.role || "").trim()} · ${clock.timeLabel}`);
      const chatLog = document.createElement("div");
      chatLog.className = "fx-npc-chat-log";
      const suggestions = document.createElement("div");
      suggestions.className = "fx-npc-suggestions";
      const inputRow = document.createElement("form");
      inputRow.className = "fx-npc-input-row";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "fx-npc-input";
      input.maxLength = 120;
      const sendBtn = document.createElement("button");
      sendBtn.type = "submit";
      sendBtn.className = "fx-container-close";
      sendBtn.textContent = "发送";
      inputRow.appendChild(input);
      inputRow.appendChild(sendBtn);
      body.appendChild(chatLog);
      body.appendChild(suggestions);
      body.appendChild(inputRow);

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "fx-container-close";
      closeBtn.textContent = "关闭";
      closeBtn.addEventListener("click", () => closeInteractionModal());
      footer.appendChild(closeBtn);

      const npcId = String(npc?.npcId || "").trim();
      const session = npc._playerDialogueSession && typeof npc._playerDialogueSession === "object"
        ? npc._playerDialogueSession
        : (npc._playerDialogueSession = { history: [], suggestions: [] });
      if (!Array.isArray(session.history)) session.history = [];
      if (!Array.isArray(session.suggestions)) session.suggestions = [];

      const appendLine = (speaker, text) => {
        const cleanText = String(text || "").trim();
        if (!cleanText) return;
        session.history.push({ speaker, text: cleanText, at: Date.now() });
        if (session.history.length > 12) session.history = session.history.slice(-12);
      };
      const renderHistory = () => {
        chatLog.innerHTML = "";
        const history = session.history.length
          ? session.history
          : [{ speaker: "system", text: "..." }];
        for (const line of history) {
          const row = document.createElement("div");
          row.className = "fx-npc-chat-line";
          row.classList.toggle("is-player", line.speaker === "player");
          row.classList.toggle("is-npc", line.speaker === "npc");
          const name = document.createElement("strong");
          name.textContent = line.speaker === "player"
            ? "你"
            : (line.speaker === "npc" ? String(npc?.name || npcId || "NPC") : "系统");
          const text = document.createElement("span");
          text.textContent = String(line.text || "");
          row.appendChild(name);
          row.appendChild(text);
          chatLog.appendChild(row);
        }
        chatLog.scrollTop = chatLog.scrollHeight;
      };
      const renderSuggestions = () => {
        suggestions.innerHTML = "";
        const list = session.suggestions.slice(0, 3);
        while (list.length < 3) {
          list.push(["问问近况", "询问需要帮忙吗", "道别"][list.length]);
        }
        for (const text of list) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fx-npc-suggestion-btn";
          btn.textContent = String(text || "").trim();
          btn.addEventListener("click", () => {
            input.value = btn.textContent;
            input.focus();
          });
          btn.disabled = _npcPlayerConversationRequestByNpcId.has(npcId);
          suggestions.appendChild(btn);
        }
      };
      const setBusy = (busy) => {
        input.disabled = !!busy;
        sendBtn.disabled = !!busy;
        suggestions.querySelectorAll("button").forEach((btn) => { btn.disabled = !!busy; });
      };
      const runTurn = (playerText = "", opening = false) => {
        if (!npcId || _npcPlayerConversationRequestByNpcId.has(npcId)) return;
        const text = String(playerText || "").trim();
        if (!opening && !text) return;
        if (!opening) appendLine("player", text);
        renderHistory();
        setBusy(true);
        const task = (async () => {
          const turnClock = getNpcClockState();
          try {
            const payload = await requestNpcPlayerTurnFromLlm(npc, turnClock, session.history, opening ? "" : text);
            const finalPayload = normalizeNpcPlayerTurnPayload(payload, npc, opening);
            appendLine("npc", finalPayload.npcLine);
            session.suggestions = finalPayload.suggestions;
            applyNpcEmotionDelta(npc, finalPayload.emotionDelta || {});
            applyNpcRelationshipDelta(npc, "player", finalPayload.relationshipDelta || { affection: 1 });
            const tradeResult = applyNpcPlayerTradePayload(npc, finalPayload.trade);
            if (tradeResult?.summary) {
              appendLine("system", tradeResult.summary);
              if (tradeResult.success) applyNpcRelationshipDelta(npc, "player", { trust: 1, tension: -1 });
              else applyNpcRelationshipDelta(npc, "player", { tension: 1 });
            }
            const rel = ensureNpcRelationship(npc, "player");
            rel.lastTalkDayKey = turnClock.dayKey;
            rel.lastTalkMinute = turnClock.minuteOfDay;
            ensureNpcSimExtension().playerConversationAt[npcId] = Date.now();
            pushNpcRecentEvent(npc, {
              type: "player_conversation",
              dayKey: turnClock.dayKey,
              minuteOfDay: turnClock.minuteOfDay,
              summary: `${String(npc.name || npc.npcId)}和玩家谈到了${finalPayload.topic || "近况"}。`,
            });
            scheduleNpcSceneAutosave("npc-player-talk");
          } catch (err) {
            console.warn("[npc-player-turn-llm-failed]", npcId, err);
            const fallback = normalizeNpcPlayerTurnPayload(null, npc, opening);
            appendLine("npc", fallback.npcLine);
            session.suggestions = fallback.suggestions;
          } finally {
            _npcPlayerConversationRequestByNpcId.delete(npcId);
            setBusy(false);
            renderHistory();
            renderSuggestions();
            input.focus();
          }
        })();
        _npcPlayerConversationRequestByNpcId.set(npcId, task);
      };
      inputRow.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        input.value = "";
        runTurn(text, false);
      });
      if (!session.history.length) runTurn("", true);
      renderHistory();
      renderSuggestions();
      setTimeout(() => input.focus(), 0);
      return wrap;
    }

    function buildNpcGiftModal(npc) {
      const { wrap, body, footer } = buildNpcModalShell(npc, "从你的快捷栏赠送一件物品");
      const info = document.createElement("div");
      info.className = "fx-npc-summary";
      info.textContent = "点击一个物品，赠送 1 个给对方。";
      body.appendChild(info);
      const list = document.createElement("div");
      list.className = "fx-npc-list";
      body.appendChild(list);
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "fx-container-close";
      closeBtn.textContent = "关闭";
      closeBtn.addEventListener("click", () => closeInteractionModal());
      footer.appendChild(closeBtn);

      const render = () => {
        list.innerHTML = "";
        const hotbar = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
        hotbar.forEach((slot, idx) => {
          const clean = sanitizeHotbarSlotForStorage(slot);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fx-npc-list-btn";
          if (!clean) {
            btn.textContent = `${idx + 1}. 空`;
            btn.disabled = true;
          } else {
            btn.textContent = `${idx + 1}. ${clean.name} x${clean.count}`;
            btn.addEventListener("click", () => {
              const { taken, left } = takeFromStack(clean, 1);
              animator.hotbarSlots[idx] = left;
              const gift = hotbarSlotToNpcInventoryEntry(taken, Number(taken?.count) || 1);
              if (gift) {
                addNpcInventoryItem(npc, gift, gift.count, gift);
                applyNpcEmotionDelta(npc, { mood: 1, hope: 1, frustration: -1 });
                applyNpcRelationshipDelta(npc, "player", { affection: 1, trust: 1, tension: -1 });
                pushNpcRecentEvent(npc, {
                  type: "gift_received",
                  summary: `${String(npc.name || npc.npcId)}收到了玩家送的${gift.name || getNpcItemDisplayName(gift)}。`,
                });
                persistHotbarState();
                syncFxHotbarUi();
                scheduleNpcSceneAutosave("npc-gift");
              }
              render();
            });
          }
          list.appendChild(btn);
        });
      };
      render();
      return wrap;
    }

    function buildNpcTradeModal(npc) {
      const { wrap, body, footer } = buildNpcModalShell(npc, "简易以物易物：交换整组物品");
      const info = document.createElement("div");
      info.className = "fx-npc-summary";
      info.textContent = "先选你的物品，再选对方的物品，确认后整组交换。";
      body.appendChild(info);
      const panes = document.createElement("div");
      panes.className = "fx-npc-trade-grid";
      const playerPane = document.createElement("div");
      const npcPane = document.createElement("div");
      panes.appendChild(playerPane);
      panes.appendChild(npcPane);
      body.appendChild(panes);
      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.className = "fx-container-close";
      confirmBtn.textContent = "确认交换";
      confirmBtn.disabled = true;
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "fx-container-close";
      closeBtn.textContent = "关闭";
      closeBtn.addEventListener("click", () => closeInteractionModal());
      footer.appendChild(confirmBtn);
      footer.appendChild(closeBtn);

      let selectedHotbar = -1;
      let selectedNpc = -1;
      const render = () => {
        playerPane.innerHTML = "";
        npcPane.innerHTML = "";
        const hotbar = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
        const npcItems = ensureNpcInventoryArray(npc);
        const playerTitle = document.createElement("div");
        playerTitle.className = "fx-container-subtitle";
        playerTitle.textContent = "你的物品";
        const npcTitle = document.createElement("div");
        npcTitle.className = "fx-container-subtitle";
        npcTitle.textContent = `${String(npc.name || npc.npcId)}的物品`;
        playerPane.appendChild(playerTitle);
        npcPane.appendChild(npcTitle);
        hotbar.forEach((slot, idx) => {
          const clean = sanitizeHotbarSlotForStorage(slot);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fx-npc-list-btn";
          btn.classList.toggle("is-selected", idx === selectedHotbar);
          btn.textContent = clean ? `${idx + 1}. ${clean.name} x${clean.count}` : `${idx + 1}. 空`;
          btn.disabled = !clean;
          if (clean) {
            btn.addEventListener("click", () => {
              selectedHotbar = idx;
              render();
            });
          }
          playerPane.appendChild(btn);
        });
        npcItems.forEach((entry, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fx-npc-list-btn";
          btn.classList.toggle("is-selected", idx === selectedNpc);
          btn.textContent = `${getNpcItemDisplayName(entry)} x${entry.count}`;
          btn.addEventListener("click", () => {
            selectedNpc = idx;
            render();
          });
          npcPane.appendChild(btn);
        });
        confirmBtn.disabled = !(selectedHotbar >= 0 && selectedNpc >= 0 && sanitizeHotbarSlotForStorage(hotbar[selectedHotbar]) && npcItems[selectedNpc]);
      };
      confirmBtn.addEventListener("click", () => {
        const hotbar = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
        const offer = sanitizeHotbarSlotForStorage(hotbar[selectedHotbar]);
        const request = ensureNpcInventoryArray(npc)[selectedNpc];
        if (!offer || !request) return;
        const received = npcInventoryEntryToHotbarSlot(request);
        const removed = removeNpcInventoryItem(npc, request.itemId, request.count || 1);
        if (!removed || !received) return;
        addNpcInventoryItem(npc, hotbarSlotToNpcInventoryEntry(offer, offer.count), offer.count, offer);
        animator.hotbarSlots[selectedHotbar] = received;
        applyNpcRelationshipDelta(npc, "player", { affection: 1, trust: 1, tension: -1 });
        applyNpcEmotionDelta(npc, { mood: 1, frustration: -1 });
        pushNpcRecentEvent(npc, {
          type: "trade",
          summary: `${String(npc.name || npc.npcId)}和玩家交换了物品。`,
        });
        persistHotbarState();
        syncFxHotbarUi();
        scheduleNpcSceneAutosave("npc-trade");
        selectedNpc = -1;
        render();
      });
      render();
      return wrap;
    }

    function openNpcInteractionModal(npc) {
      if (!npc) return;
      beginPlayerNpcInteraction(npc);
      openInteractionModal(buildNpcActionPickerModal(npc));
    }

    function pickNpcAtScreen(screenX, screenY, canvas = animator.stageCanvas) {
      const list = ensureNpcEntitiesArray();
      let best = null;
      let bestDist = Infinity;
      for (const npc of list) {
        if (!npc) continue;
        const p = projectWorldToScreen(Number(npc.wx) || 0, Number(npc.wy) || 0, canvas);
        if (!p || p.scale <= 0) continue;
        const dx = screenX - p.sx;
        const dy = screenY - (p.sy - 18);
        const dist = Math.hypot(dx, dy);
        if (dist > NPC_INTERACTION_PICK_RADIUS_PX) continue;
        if (dist < bestDist) {
          bestDist = dist;
          best = npc;
        }
      }
      return best;
    }

    function minDistancePointToPolygonEdges(px, py, poly) {
      if (!Array.isArray(poly) || poly.length < 2) return Infinity;
      let minSq = Infinity;
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        minSq = Math.min(minSq, pointSegDistSq(px, py, a.x, a.y, b.x, b.y));
      }
      return Number.isFinite(minSq) ? Math.sqrt(minSq) : Infinity;
    }

    function getDistanceOutsideCollisionForObject(o, px, py, playerRadius) {
      if (!o) return Infinity;
      if (o.model) {
        const polys = getModelCollisionPolygonsWorld(o);
        if (!polys.length) return Infinity;
        let nearest = Infinity;
        for (const poly of polys) {
          if (!poly || poly.length < 3) continue;
          if (pointInPolygon2D(px, py, poly)) return -playerRadius;
          nearest = Math.min(nearest, minDistancePointToPolygonEdges(px, py, poly));
        }
        if (!Number.isFinite(nearest)) return Infinity;
        return nearest - playerRadius;
      }
      const objectRadius = objectCollisionRadiusWorld(o);
      if (!(objectRadius > 0)) return Infinity;
      const d = Math.hypot(px - (Number(o.wx) || 0), py - (Number(o.wy) || 0));
      return d - (playerRadius + objectRadius);
    }

    function collectNearbyInteractionActions(canvas = getLogicCanvas()) {
      const out = [];
      if (!elFxFullscreen.classList.contains("open")) return out;
      ensureSceneObjects();
      ensureNpcEntitiesArray();
      const px = Number(animator.worldX) || 0;
      const py = Number(animator.worldY) || 0;
      const playerRadius = getPlayerCollisionRadiusWorld(canvas);
      const triggerGap = Math.max(0, Number(animator.interactionTileRange) || 1);
      const nearFieldRadius = Math.max(0, Number(animator.collisionNearFieldRadiusWorld) || 0);
      const nearFieldEnabled = !!animator.collisionNearFieldEnabled;
      const objs = animator._sceneObjects || [];
      for (const o of objs) {
        if (!o) continue;
        if (nearFieldEnabled && !isObjectWithinCollisionNearField(o, px, py, nearFieldRadius, playerRadius + triggerGap + 2)) {
          continue;
        }
        const gap = getDistanceOutsideCollisionForObject(o, px, py, playerRadius);
        if (!Number.isFinite(gap) || gap > triggerGap) continue;
        const actions = getObjectInteractionActions(o);
        for (const action of actions) {
          out.push({
            gap,
            action,
            objectName: getObjectDisplayNameForInteraction(o),
            objectKey: String(getSceneObjectSortId(o) || o.id || ""),
          });
        }
      }
      for (const npc of (animator._sceneEntities?.npcs || [])) {
        if (!npc) continue;
        const gap = getNpcInteractionGap(npc, canvas);
        if (!Number.isFinite(gap) || gap > triggerGap) continue;
        const actions = getNpcInteractionActions(npc);
        for (const action of actions) {
          out.push({
            gap,
            action,
            objectName: String(npc.name || npc.npcId || "NPC"),
            objectKey: `npc:${String(npc.npcId || "")}`,
          });
        }
      }
      if (getActiveInteriorState()) {
        const interiorActions = collectInteriorNearbyInteractionActions(canvas);
        for (const entry of interiorActions) out.push(entry);
      }
      out.sort((a, b) => (a.gap - b.gap) || a.objectName.localeCompare(b.objectName, "zh-Hans-CN"));
      return out;
    }

    function applyInteractionAction(entry) {
      if (!entry || !entry.action) return;
      if (entry.action.kind === "house-enter") {
        enterHouseInterior(entry.action.object);
        return;
      }
      if (entry.action.kind === "house-leave") {
        leaveHouseInterior();
        return;
      }
      if (entry.action.kind === "container-open") {
        openContainerModal(entry.action.object);
        return;
      }
      if (entry.action.kind === "facility-open") {
        openFacilityModal(entry.action.object);
        return;
      }
      if (entry.action.kind === "npc-interact") {
        openNpcInteractionModal(entry.action.npc);
        return;
      }
      if (entry.action.kind === "sign-read") {
        const o = entry.action.object;
        const name = getObjectDisplayNameForInteraction(o);
        const text = getSignTextForObject(o);
        animator._interactionDetailText = `${name}\n${text}`;
        openInteractionModal(animator._interactionDetailText);
      }
    }

    function closeInteractionModal() {
      if (!elFxInteractionModal || !elFxInteractionModalCard) return;
      try {
        if (typeof elFxInteractionModalCard.__cleanupFn === "function") {
          elFxInteractionModalCard.__cleanupFn();
        }
      } catch (_) {}
      endPlayerNpcInteraction(elFxInteractionModalCard.__npcInteractionNpc);
      elFxInteractionModalCard.__npcInteractionNpc = null;
      elFxInteractionModalCard.__cleanupFn = null;
      elFxInteractionModalCard.__blockCloseFn = null;
      elFxInteractionModal.hidden = true;
      elFxInteractionModalCard.textContent = "";
      elFxInteractionModalCard.innerHTML = "";
    }

    function openInteractionModal(content) {
      if (!elFxInteractionModal || !elFxInteractionModalCard) return;
      try {
        if (typeof elFxInteractionModalCard.__cleanupFn === "function") {
          elFxInteractionModalCard.__cleanupFn();
        }
      } catch (_) {}
      endPlayerNpcInteraction(elFxInteractionModalCard.__npcInteractionNpc);
      elFxInteractionModalCard.__npcInteractionNpc = null;
      elFxInteractionModalCard.__cleanupFn = null;
      elFxInteractionModalCard.__blockCloseFn = null;
      // allow richer DOM content for complex interactions (e.g. container UI)
      elFxInteractionModalCard.textContent = "";
      elFxInteractionModalCard.innerHTML = "";
      if (typeof content === "string") {
        elFxInteractionModalCard.textContent = content;
      } else if (content && typeof content === "object" && content.nodeType === 1) {
        elFxInteractionModalCard.appendChild(content);
        elFxInteractionModalCard.__npcInteractionNpc =
          content.__npcInteractionNpc || null;
        if (elFxInteractionModalCard.__npcInteractionNpc) {
          beginPlayerNpcInteraction(elFxInteractionModalCard.__npcInteractionNpc);
        }
        elFxInteractionModalCard.__cleanupFn =
          typeof content.__cleanupFn === "function" ? content.__cleanupFn : null;
        elFxInteractionModalCard.__blockCloseFn =
          typeof content.__blockCloseFn === "function" ? content.__blockCloseFn : null;
      } else {
        elFxInteractionModalCard.textContent = String(content || "");
      }
      elFxInteractionModal.hidden = false;
    }

    function cloneSlotStack(slot) {
      if (!slot || typeof slot !== "object") return null;
      return sanitizeHotbarSlotForStorage(slot);
    }

    function toAsciiFacilityHint(text, fallback = "") {
      const raw = String(text || "").trim().toLowerCase();
      if (!raw) return fallback;
      const ascii = raw.replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
      return ascii || fallback;
    }

    function inferFacilityLabelHint(o) {
      const raw = [
        o?.label,
        o?.name,
        o?.asset?.prompt,
        o?.asset?.libraryMeta?.title,
      ].map((v) => String(v || "").trim()).filter(Boolean).join(" ");
      if (/工作台|工坊|craft|bench/i.test(raw)) return "工作台";
      if (/铁匠|锻造|熔炉|炉/.test(raw)) return "铁匠炉";
      if (/水井|井/.test(raw)) return "水井";
      if (/灶|炉灶|厨房|锅/.test(raw)) return "烹饪台";
      const interactionTags = getObjectInteractionTags(o);
      if (interactionTags.includes("item:crafting")) return "工作台";
      return raw || "设施";
    }

    function inferFacilityItemHint(name, tags = []) {
      const raw = String(name || "").trim();
      if (!raw) return "material";
      const tagText = Array.isArray(tags) ? tags.join(" ") : "";
      if (/苹果|apple/i.test(raw)) return "apple fruit";
      if (/果|fruit/i.test(raw) || /food|edible/i.test(tagText)) return "fruit food";
      if (/铁锭|iron ingot/i.test(raw)) return "iron ingot";
      if (/铁矿|iron ore/i.test(raw)) return "iron ore";
      if (/铜锭|copper ingot/i.test(raw)) return "copper ingot";
      if (/铜矿|copper ore/i.test(raw)) return "copper ore";
      if (/金锭|gold ingot/i.test(raw)) return "gold ingot";
      if (/金矿|gold ore/i.test(raw)) return "gold ore";
      if (/煤|coal/i.test(raw)) return "coal fuel";
      if (/木|wood|log|plank/i.test(raw)) return "wood";
      if (/石|stone/i.test(raw)) return "stone";
      if (/沙|sand/i.test(raw)) return "sand";
      if (/水|water/i.test(raw) || /liquid/i.test(tagText)) return "water";
      return toAsciiFacilityHint(raw, "material");
    }

    function localizeFacilityOutputName(name) {
      const key = String(name || "").trim().toLowerCase();
      if (!key) return "";
      if (key === "iron ingot") return "铁锭";
      if (key === "pig iron") return "生铁";
      if (key === "steel ingot") return "钢锭";
      if (key === "steel") return "钢";
      if (key === "copper ingot") return "铜锭";
      if (key === "gold ingot") return "金锭";
      if (key === "iron ore") return "铁矿石";
      if (key === "copper ore") return "铜矿石";
      if (key === "gold ore") return "金矿石";
      if (key === "coal") return "煤炭";
      if (key === "water") return "水";
      return String(name || "").trim();
    }

    function isFacilityPlaceholderValue(value) {
      const s = String(value || "").trim().toLowerCase();
      if (!s) return true;
      if (/^\?+$/.test(s)) return true;
      return [
        "unknown",
        "item",
        "items",
        "material",
        "materials",
        "output",
        "outputs",
        "product",
        "products",
        "result",
        "results",
        "example",
        "tbd",
        "n/a",
        "none",
      ].includes(s);
    }

    function inferFacilityProfileFromObject(o) {
      const interactionTags = getObjectInteractionTags(o);
      if (interactionTags.includes("item:crafting")) {
        return {
          actionLabel: /铁匠|锻造|熔炉|炉/.test(String(o?.label || o?.name || ""))
            ? "锻造"
            : "制作",
          summary: "将放入材料加工为新物品。",
        };
      }
      const tags = normalizeSemanticTags(o?.tags, getObjectPromptLikeText(o));
      if (tags.includes("facility")) {
        return {
          actionLabel: "加工",
          summary: "将放入材料在设施中转化为产物。",
        };
      }
      return null;
    }

    function getDefaultFacilityActionLabelForObject(o) {
      return inferSimpleFacilityProfileFromObject(o)?.actionLabel || inferFacilityProfileFromObject(o)?.actionLabel || "";
    }

    function inferSimpleFacilityProfileFromObject(o) {
      const interactionTags = getObjectInteractionTags(o);
      if (interactionTags.includes("item:crafting")) {
        return {
          actionLabel: "制作",
          summary: "将放入材料加工为新物品。",
        };
      }
      const tags = normalizeSemanticTags(o?.tags, getObjectPromptLikeText(o));
      if (tags.includes("facility")) {
        return {
          actionLabel: "加工",
          summary: "将放入材料在设施中转化为产物。",
        };
      }
      return null;
    }

    function makeFacilityCandidateId(prefix = "facility_recipe") {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    function sanitizeFacilityRequirement(raw) {
      if (typeof raw === "string") raw = { name: raw, count: 1 };
      const name = String(raw?.name || raw?.item || raw?.itemName || raw?.material || raw?.名称 || raw?.物品 || raw?.材料 || "").trim();
      if (!name) return null;
      return {
        name,
        count: Math.max(1, Math.floor(Number(raw?.count ?? raw?.数量) || 1)),
      };
    }

    function sanitizeFacilityOutputItem(raw) {
      if (typeof raw === "string") raw = { name: raw, count: 1 };
      const name = String(raw?.name || raw?.item || raw?.itemName || raw?.product || raw?.result || raw?.名称 || raw?.物品 || raw?.产物 || raw?.结果 || "").trim();
      if (!name) return null;
      return {
        name,
        count: Math.max(1, Math.floor(Number(raw?.count ?? raw?.数量) || 1)),
        description: String(raw?.description || raw?.描述 || "设施产物。"),
        tags: Array.isArray(raw?.tags || raw?.标签) ? (raw.tags || raw.标签).map((t) => String(t || "").trim()).filter(Boolean) : [],
        icon: typeof raw?.icon === "string" ? raw.icon : "",
      };
    }

    function sanitizeFacilityRecipeCandidate(raw, idx = 0) {
      if (!raw || typeof raw !== "object") return null;
      const title = String(raw?.title || raw?.标题 || raw?.名称 || "").trim() || `候选配方 ${idx + 1}`;
      const rawInputs =
        Array.isArray(raw?.inputs) ? raw.inputs :
        Array.isArray(raw?.input) ? raw.input :
        Array.isArray(raw?.输入) ? raw.输入 :
        raw?.input ? [raw.input] :
        raw?.输入 ? [raw.输入] :
        [];
      const rawConsumes =
        Array.isArray(raw?.consumes) ? raw.consumes :
        Array.isArray(raw?.consume) ? raw.consume :
        Array.isArray(raw?.消耗) ? raw.消耗 :
        raw?.consume ? [raw.consume] :
        raw?.消耗 ? [raw.消耗] :
        [];
      const rawOutputs =
        Array.isArray(raw?.outputs) ? raw.outputs :
        Array.isArray(raw?.output) ? raw.output :
        Array.isArray(raw?.products) ? raw.products :
        Array.isArray(raw?.results) ? raw.results :
        Array.isArray(raw?.产出) ? raw.产出 :
        Array.isArray(raw?.输出) ? raw.输出 :
        Array.isArray(raw?.产物) ? raw.产物 :
        Array.isArray(raw?.结果) ? raw.结果 :
        raw?.output ? [raw.output] :
        raw?.product ? [raw.product] :
        raw?.result ? [raw.result] :
        raw?.产出 ? [raw.产出] :
        raw?.输出 ? [raw.输出] :
        raw?.产物 ? [raw.产物] :
        raw?.结果 ? [raw.结果] :
        [];
      const inputs = rawInputs.map(sanitizeFacilityRequirement).filter(Boolean);
      const consumes = rawConsumes.map(sanitizeFacilityRequirement).filter(Boolean);
      const outputs = rawOutputs.map(sanitizeFacilityOutputItem).filter(Boolean);
      if (!outputs.length) return null;
      return {
        id: String(raw?.id || "").trim() || makeFacilityCandidateId("facility_recipe"),
        title,
        summary: String(raw?.summary || raw?.摘要 || raw?.说明 || "").trim(),
        inputs,
        consumes,
        outputs,
      };
    }

    function buildDefaultFacilityRecordForObject(o) {
      const seededProfile = sanitizeFacilityProfileLike(
        o?.facilityProfile ||
        o?.asset?.facilityProfile ||
        o?.asset?.libraryMeta?.facilityProfile ||
        o?.meta?.facilityProfile
      );
      const fallbackProfile = inferFacilityProfileFromObject(o);
      const seededActionLabel = String(seededProfile?.actionLabel || fallbackProfile?.actionLabel || "").trim();
      const seededSummary = String(seededProfile?.summary || fallbackProfile?.summary || "").trim();
      return {
        version: 1,
        profile: {
          status: seededActionLabel ? "ready" : "idle",
          actionLabel: seededActionLabel || getDefaultFacilityActionLabelForObject(o),
          summary: seededSummary,
          error: "",
          updatedAt: seededActionLabel ? Date.now() : 0,
        },
        modules: {
          transformSlots: Array(6).fill(null),
          consumeSlots: Array(3).fill(null),
          outputSlots: Array(6).fill(null),
        },
        recipe: {
          signature: "",
          status: "idle",
          error: "",
          candidates: [],
          selectedId: "",
          updatedAt: 0,
        },
        activeJob: {
          status: "idle",
          recipeId: "",
          actionLabel: "",
          title: "",
          startedAt: 0,
          finishAt: 0,
          batchMs: 2000,
          completedBatches: 0,
          reservation: null,
          error: "",
        },
      };
    }

    function sanitizeFacilityRecord(rec, o = null) {
      const base = buildDefaultFacilityRecordForObject(o);
      const out = rec && typeof rec === "object" ? rec : {};
      const profile = out.profile && typeof out.profile === "object" ? out.profile : {};
      const seededProfile = sanitizeFacilityProfileLike(
        o?.facilityProfile ||
        o?.asset?.facilityProfile ||
        o?.asset?.libraryMeta?.facilityProfile ||
        o?.meta?.facilityProfile
      );
      base.profile.status = String(profile.status || "idle");
      base.profile.actionLabel = String(profile.actionLabel || base.profile.actionLabel).trim() || base.profile.actionLabel;
      base.profile.summary = String(profile.summary || "").trim();
      base.profile.error = String(profile.error || "").trim();
      base.profile.updatedAt = Number(profile.updatedAt) || 0;
      const fallbackProfile = inferFacilityProfileFromObject(o);
      const readyProfile = seededProfile?.actionLabel ? seededProfile : fallbackProfile;
      if (readyProfile?.actionLabel && base.profile.status !== "ready" && !base.profile.updatedAt) {
        base.profile.status = "ready";
        base.profile.actionLabel = String(readyProfile.actionLabel).trim();
        base.profile.summary = String(readyProfile.summary || base.profile.summary || "").trim();
        base.profile.error = "";
        base.profile.updatedAt = Date.now();
      }
      const modules = out.modules && typeof out.modules === "object" ? out.modules : {};
      base.modules.transformSlots = Array(6).fill(null).map((_, i) => sanitizeContainerSlotForStorage((Array.isArray(modules.transformSlots) ? modules.transformSlots : [])[i]));
      base.modules.consumeSlots = Array(3).fill(null).map((_, i) => sanitizeContainerSlotForStorage((Array.isArray(modules.consumeSlots) ? modules.consumeSlots : [])[i]));
      base.modules.outputSlots = Array(6).fill(null).map((_, i) => sanitizeContainerSlotForStorage((Array.isArray(modules.outputSlots) ? modules.outputSlots : [])[i]));
      const recipe = out.recipe && typeof out.recipe === "object" ? out.recipe : {};
      base.recipe.signature = String(recipe.signature || "");
      base.recipe.status = String(recipe.status || "idle");
      base.recipe.error = String(recipe.error || "");
      base.recipe.candidates = (Array.isArray(recipe.candidates) ? recipe.candidates : []).map(sanitizeFacilityRecipeCandidate).filter(Boolean).slice(0, 5);
      base.recipe.selectedId = String(recipe.selectedId || base.recipe.candidates?.[0]?.id || "");
      base.recipe.updatedAt = Number(recipe.updatedAt) || 0;
      const active = out.activeJob && typeof out.activeJob === "object" ? out.activeJob : {};
      base.activeJob.status = String(active.status || "idle");
      base.activeJob.recipeId = String(active.recipeId || "");
      base.activeJob.actionLabel = String(active.actionLabel || "");
      base.activeJob.title = String(active.title || "");
      base.activeJob.startedAt = Number(active.startedAt) || 0;
      base.activeJob.finishAt = Number(active.finishAt) || 0;
      base.activeJob.batchMs = Math.max(200, Number(active.batchMs) || 2000);
      base.activeJob.completedBatches = Math.max(0, Math.floor(Number(active.completedBatches) || 0));
      base.activeJob.error = String(active.error || "");
      if (active.reservation && typeof active.reservation === "object") {
        base.activeJob.reservation = {
          transform: (Array.isArray(active.reservation.transform) ? active.reservation.transform : []).map(cloneSlotStack).filter(Boolean),
          consume: (Array.isArray(active.reservation.consume) ? active.reservation.consume : []).map(cloneSlotStack).filter(Boolean),
          outputs: (Array.isArray(active.reservation.outputs) ? active.reservation.outputs : []).map(sanitizeFacilityOutputItem).filter(Boolean),
        };
      } else {
        base.activeJob.reservation = null;
      }
      return base;
    }

    function persistFacilityStore() {
      markSceneObjectsDirty();
    }

    function getFacilityKeyForObject(o) {
      const sceneId = getCurrentSceneId();
      const objId = Number(o?.id) || 0;
      return `${sceneId}:${objId}`;
    }

    function resolveLiveFacilityObject(o) {
      const live = findSceneObjectById(Number(o?.id) || 0);
      return live || o || null;
    }

    function ensureFacilityRecordForObject(o) {
      if (!o || typeof o !== "object") return sanitizeFacilityRecord(null, o);
      if (!o.properties || typeof o.properties !== "object") o.properties = {};
      const current = o.properties.facility;
      if (
        current &&
        typeof current === "object" &&
        Number(current.version) >= 1 &&
        current.profile && typeof current.profile === "object" &&
        current.modules && typeof current.modules === "object" &&
        current.recipe && typeof current.recipe === "object" &&
        current.activeJob && typeof current.activeJob === "object"
      ) {
        return current;
      }
      const sanitized = sanitizeFacilityRecord(current, o);
      o.properties.facility = sanitized;
      return sanitized;
    }

    function aggregateSlotStacks(slots) {
      const map = new Map();
      for (const slot of (Array.isArray(slots) ? slots : [])) {
        const item = sanitizeContainerSlotForStorage(slot);
        if (!item) continue;
        const key = String(item.name || "");
        if (!map.has(key)) map.set(key, { name: key, count: 0, sample: item });
        map.get(key).count += Math.max(1, Math.floor(Number(item.count) || 1));
      }
      return Array.from(map.values()).map((entry) => ({ name: entry.name, count: entry.count, sample: entry.sample }));
    }

    function buildFacilityRecipeSignature(record) {
      const transform = aggregateSlotStacks(record?.modules?.transformSlots || [])
        .map((entry) => `${entry.name}:${entry.count}`)
        .sort();
      const consume = aggregateSlotStacks(record?.modules?.consumeSlots || [])
        .map((entry) => `${entry.name}:${entry.count}`)
        .sort();
      if (!transform.length && !consume.length) return "";
      return [
        `transform=${transform.join("|")}`,
        `consume=${consume.join("|")}`,
      ].join("||");
    }

    function summarizeFacilityCandidateForSelection(candidate) {
      if (!candidate) return "";
      const inputs = (candidate.inputs || []).map((item) => `${item.name}:${item.count}`).sort().join("|");
      const consumes = (candidate.consumes || []).map((item) => `${item.name}:${item.count}`).sort().join("|");
      const outputs = (candidate.outputs || []).map((item) => `${item.name}:${item.count}`).sort().join("|");
      return `${candidate.title || ""}::${inputs}::${consumes}::${outputs}`;
    }

    function listRequirementsSatisfied(slots, requirements) {
      const counts = new Map();
      for (const entry of aggregateSlotStacks(slots)) counts.set(entry.name, entry.count);
      for (const req of (requirements || [])) {
        const need = Math.max(1, Math.floor(Number(req?.count) || 1));
        if ((counts.get(String(req?.name || "")) || 0) < need) return false;
      }
      return true;
    }

    function removeRequirementsFromSlots(slots, requirements) {
      const arr = Array.isArray(slots) ? slots : [];
      const next = arr.map((slot) => sanitizeContainerSlotForStorage(slot));
      const removed = [];
      for (const req of (requirements || [])) {
        let need = Math.max(1, Math.floor(Number(req?.count) || 1));
        const reqName = String(req?.name || "");
        for (let i = 0; i < next.length && need > 0; i++) {
          const slot = sanitizeContainerSlotForStorage(next[i]);
          if (!slot || String(slot.name || "") !== reqName) continue;
          const takeN = Math.min(need, Math.max(1, Math.floor(Number(slot.count) || 1)));
          const { taken, left } = takeFromStack(slot, takeN);
          if (taken) removed.push(taken);
          next[i] = left;
          need -= takeN;
        }
        if (need > 0) return null;
      }
      for (let i = 0; i < arr.length; i++) arr[i] = next[i] || null;
      return removed;
    }

    function addStacksToSlots(slots, stacks) {
      const arr = Array.isArray(slots) ? slots : [];
      for (const raw of (Array.isArray(stacks) ? stacks : [])) {
        let stack = cloneSlotStack(raw);
        if (!stack) continue;
        for (let i = 0; i < arr.length && stack; i++) {
          const cur = sanitizeContainerSlotForStorage(arr[i]);
          if (!cur) continue;
          if (!stacksCompatibleForMerge(cur, stack)) continue;
          cur.count = Math.max(1, Math.floor(Number(cur.count) || 1)) + Math.max(1, Math.floor(Number(stack.count) || 1));
          arr[i] = cur;
          stack = null;
        }
        if (!stack) continue;
        const emptyIdx = arr.findIndex((it) => !sanitizeContainerSlotForStorage(it));
        if (emptyIdx < 0) return false;
        arr[emptyIdx] = stack;
      }
      return true;
    }

    function registerGeneratedItemDefinition(item) {
      const clean = sanitizeFacilityOutputItem(item);
      if (!clean) return null;
      const root = ensureDropAgentStore();
      const key = clean.name;
      if (!root.itemsByName[key]) {
        root.itemsByName[key] = {
          name: clean.name,
          icon: clean.icon || "",
          description: clean.description || "设施产物。",
          tags: Array.isArray(clean.tags) ? clean.tags.slice() : [],
          iconStatus: clean.icon ? "ok" : "idle",
        };
      } else {
        const rec = root.itemsByName[key];
        if (!rec.description) rec.description = clean.description || "设施产物。";
        if ((!Array.isArray(rec.tags) || !rec.tags.length) && Array.isArray(clean.tags)) rec.tags = clean.tags.slice();
        if (!rec.icon && clean.icon) {
          rec.icon = clean.icon;
          rec.iconStatus = "ok";
        }
      }
      return root.itemsByName[key];
    }

    function makeOutputStacksFromCandidate(candidate) {
      const out = [];
      for (const item of (candidate?.outputs || [])) {
        const rec = registerGeneratedItemDefinition(item) || item;
        out.push({
          name: String(rec.name || item.name || "").trim(),
          icon: String(rec.icon || item.icon || "").trim(),
          description: String(rec.description || item.description || "设施产物。"),
          tags: Array.isArray(rec.tags) ? rec.tags.slice() : (Array.isArray(item.tags) ? item.tags.slice() : []),
          count: Math.max(1, Math.floor(Number(item.count) || 1)),
        });
      }
      return out.filter((item) => item.name);
    }

    async function legacyRequestFacilityProfileFromLlm(o) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) throw new Error("缺少 LLM 接口配置");
      const prompt = [
        FACILITY_PROFILE_PROMPT,
        "",
        `设施名称：${getObjectDisplayNameForInteraction(o)}`,
        `标签：${normalizeSemanticTags(o?.tags, getObjectPromptLikeText(o)).join(", ")}`,
        `交互标签：${getObjectInteractionTags(o).join(", ")}`,
        `描述：${getObjectPromptLikeText(o)}`,
      ].join("\n");
      const data = await fetchJson(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        timeoutMs: FACILITY_LLM_TIMEOUT_MS,
        body: JSON.stringify({
          model: FACILITY_PROFILE_MODEL,
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const parsed = parseJsonObjectFromChatResponse(JSON.stringify(data));
      return {
        actionLabel: String(parsed?.actionLabel || "").trim(),
        summary: String(parsed?.summary || "").trim(),
      };
    }

    function isFacilityProfileUseful(profile) {
      const actionLabel = String(profile?.actionLabel || "").trim();
      const summary = String(profile?.summary || "").trim();
      if (!actionLabel || actionLabel.length < 2 || actionLabel.length > 4) return false;
      if (!summary) return false;
      return !/json|schema|template/i.test(summary);
    }

    async function requestFacilityProfileFromLlm(o) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) throw new Error("缂哄皯 LLM 鎺ュ彛閰嶇疆");
      const objectName = getObjectDisplayNameForInteraction(o);
      const prompt = [
        FACILITY_PROFILE_PROMPT,
        "",
        `设施名称：${objectName || "未命名设施"}`,
        `设施描述：${getObjectPromptLikeText(o) || ""}`,
        `语义标签：${normalizeSemanticTags(o?.tags, getObjectPromptLikeText(o)).join(", ") || "none"}`,
        `交互标签：${getObjectInteractionTags(o).join(", ") || "none"}`,
        `默认动作参考：${getDefaultFacilityActionLabelForObject(o) || "加工"}`,
      ].join("\n");
      const requestBody = {
        model: FACILITY_PROFILE_MODEL,
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }],
      };
      logFacilityLlmDebug("profile request", {
        objectName,
        url: base + "/v1/chat/completions",
        requestBody,
        prompt,
      });
      const data = await fetchJson(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        timeoutMs: FACILITY_LLM_TIMEOUT_MS,
        body: JSON.stringify(requestBody),
      });
      const responseText = extractRawChatResponseText(data);
      logFacilityLlmDebug("profile response", {
        objectName,
        responseText,
        responseJson: data,
      });
      let parsed = null;
      try {
        parsed = parseJsonObjectFromChatResponse(JSON.stringify(data));
      } catch (err) {
        logFacilityLlmDebug("profile parse failed", {
          objectName,
          error: String(err?.message ?? err ?? "").trim(),
          responseText,
          responseJson: data,
        });
        throw err;
      }
      const profile = {
        actionLabel: String(parsed?.actionLabel || "").trim(),
        summary: String(parsed?.summary || "").trim(),
      };
      logFacilityLlmDebug("profile parsed", {
        objectName,
        parsed,
        profile,
      });
      if (!isFacilityProfileUseful(profile)) {
        logFacilityLlmDebug("profile invalid", {
          objectName,
          parsed,
          profile,
        });
        throw new Error("璁炬柦鍔熻兘杩斿洖鏃犳晥");
      }
      return profile;
    }

    async function ensureFacilityProfileAsync(o) {
      o = resolveLiveFacilityObject(o);
      let rec = ensureFacilityRecordForObject(o);
      const key = getFacilityKeyForObject(o);
      if (rec.profile.status === "ready" && rec.profile.actionLabel) return rec.profile;
      if (_facilityProfileRequestByKey.has(key)) return _facilityProfileRequestByKey.get(key);
      const task = (async () => {
        o = resolveLiveFacilityObject(o);
        rec = ensureFacilityRecordForObject(o);
        rec.profile.status = "running";
        rec.profile.error = "";
        rec.profile.updatedAt = Date.now();
        persistFacilityStore();
        try {
          const profile = await requestFacilityProfileFromLlm(o);
          o = resolveLiveFacilityObject(o);
          rec = ensureFacilityRecordForObject(o);
          rec.profile.status = "ready";
          rec.profile.actionLabel = profile.actionLabel || "";
          rec.profile.summary = profile.summary || "";
          rec.profile.updatedAt = Date.now();
          logFacilityLlmDebug("profile state ready", {
            objectName: getObjectDisplayNameForInteraction(o),
            status: rec.profile.status,
            actionLabel: rec.profile.actionLabel,
            summary: rec.profile.summary,
          });
          persistFacilityStore();
          return rec.profile;
        } catch (err) {
          o = resolveLiveFacilityObject(o);
          rec = ensureFacilityRecordForObject(o);
          rec.profile.status = "error";
          const msg = String(err?.message ?? err ?? "").trim() || "设施功能分析失败（无详细描述）";
          rec.profile.error = msg;
          rec.profile.actionLabel = rec.profile.actionLabel || "";
          rec.profile.updatedAt = Date.now();
          persistFacilityStore();
          console.warn("[facility-profile-failed]", msg, err);
          return rec.profile;
        }
      })();
      _facilityProfileRequestByKey.set(key, task);
      try {
        return await task;
      } finally {
        _facilityProfileRequestByKey.delete(key);
      }
    }

    async function legacyRequestFacilityRecipesFromLlm(o, record) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) throw new Error("缺少 LLM 接口配置");
      const transformItems = aggregateSlotStacks(record?.modules?.transformSlots || []).map((entry) => ({ name: entry.name, count: entry.count }));
      const consumeItems = aggregateSlotStacks(record?.modules?.consumeSlots || []).map((entry) => ({ name: entry.name, count: entry.count }));
      const prompt = [
        FACILITY_RECIPE_PROMPT,
        "",
        `设施名称：${getObjectDisplayNameForInteraction(o)}`,
        `设施动作：${record?.profile?.actionLabel || "未命名动作"}`,
        `设施说明：${record?.profile?.summary || ""}`,
        `设施描述：${getObjectPromptLikeText(o)}`,
        `转化模块物品：${JSON.stringify(transformItems, null, 2)}`,
        `消耗模块候选：${JSON.stringify(consumeItems, null, 2)}`,
      ].join("\n");
      const data = await fetchJson(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        timeoutMs: FACILITY_LLM_TIMEOUT_MS,
        body: JSON.stringify({
          model: FACILITY_RECIPE_MODEL,
          temperature: 0.35,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const parsed = parseJsonObjectFromChatResponse(JSON.stringify(data));
      const rawCandidates =
        Array.isArray(parsed) ? parsed :
        Array.isArray(parsed?.candidates) ? parsed.candidates :
        Array.isArray(parsed?.recipes) ? parsed.recipes :
        Array.isArray(parsed?.recipeCandidates) ? parsed.recipeCandidates :
        Array.isArray(parsed?.候选配方) ? parsed.候选配方 :
        Array.isArray(parsed?.配方) ? parsed.配方 :
        parsed && typeof parsed === "object" ? [parsed] :
        [];
      const candidates = rawCandidates
        .map((item, idx) => sanitizeFacilityRecipeCandidate(item, idx))
        .filter(Boolean)
        .slice(0, 5);
      if (!candidates.length) throw new Error("设施配方推理为空");
      return candidates;
    }

    function buildFacilityAliasEntries(entries, prefix) {
      return (Array.isArray(entries) ? entries : []).map((entry, idx) => ({
        alias: `${prefix}${idx + 1}`,
        name: String(entry?.name || "").trim(),
        count: Math.max(1, Math.floor(Number(entry?.count) || 1)),
        hint: String(entry?.name || "").trim(),
      })).filter((entry) => entry.name);
    }

    function resolveFacilityRequirementName(name, aliasLookup) {
      const raw = String(name || "").trim();
      if (!raw) return "";
      if (aliasLookup.has(raw)) return aliasLookup.get(raw).name;
      for (const entry of aliasLookup.values()) {
        if (entry.name === raw) return entry.name;
      }
      return "";
    }

    function extractRawFacilityCandidates(parsed) {
      return Array.isArray(parsed) ? parsed :
        Array.isArray(parsed?.candidates) ? parsed.candidates :
        Array.isArray(parsed?.recipes) ? parsed.recipes :
        Array.isArray(parsed?.recipeCandidates) ? parsed.recipeCandidates :
        parsed && typeof parsed === "object" ? [parsed] :
        [];
    }

    function sanitizeResolvedFacilityCandidate(raw, idx, transformLookup, consumeLookup) {
      const candidate = sanitizeFacilityRecipeCandidate(raw, idx);
      if (!candidate) return null;
      const inputs = (candidate.inputs || [])
        .map((req) => {
          const name = resolveFacilityRequirementName(req?.name, transformLookup);
          return name ? { name, count: Math.max(1, Math.floor(Number(req?.count) || 1)) } : null;
        })
        .filter(Boolean);
      if (inputs.length !== (candidate.inputs || []).length) return null;
      const consumes = (candidate.consumes || [])
        .map((req) => {
          const name = resolveFacilityRequirementName(req?.name, consumeLookup);
          return name ? { name, count: Math.max(1, Math.floor(Number(req?.count) || 1)) } : null;
        })
        .filter(Boolean);
      if (consumes.length !== (candidate.consumes || []).length) return null;
      const outputs = (candidate.outputs || [])
        .map((item) => {
          const clean = sanitizeFacilityOutputItem(item);
          if (!clean || isFacilityPlaceholderValue(clean.name)) return null;
          clean.name = localizeFacilityOutputName(clean.name);
          return clean;
        })
        .filter(Boolean);
      if (!outputs.length) return null;
      const title = isFacilityPlaceholderValue(candidate.title) ? outputs[0].name : candidate.title;
      const summary = String(candidate.summary || "").trim() || `${title}。`;
      return {
        id: candidate.id,
        title,
        summary,
        inputs,
        consumes,
        outputs,
      };
    }

    async function requestFacilityRecipesFromLlm(o, record) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) throw new Error("缂哄皯 LLM 鎺ュ彛閰嶇疆");
      const objectName = getObjectDisplayNameForInteraction(o);
      const transformEntries = buildFacilityAliasEntries(aggregateSlotStacks(record?.modules?.transformSlots || []), "T");
      const consumeEntries = buildFacilityAliasEntries(aggregateSlotStacks(record?.modules?.consumeSlots || []), "C");
      const transformLookup = new Map(transformEntries.map((entry) => [entry.alias, entry]));
      const consumeLookup = new Map(consumeEntries.map((entry) => [entry.alias, entry]));
      const example = {
        title: "Smelt iron ingot",
        summary: "Smelt ore into a usable ingot with fuel.",
        inputs: transformEntries.length ? [{ name: transformEntries[0].alias, count: transformEntries[0].count }] : [],
        consumes: consumeEntries.length ? [{ name: consumeEntries[0].alias, count: Math.min(consumeEntries[0].count, 1) }] : [],
        outputs: [{ name: "iron ingot", count: 1, description: "A refined metal ingot.", tags: ["metal", "ingot"] }],
      };
      const buildPrompt = (extraRules = []) => [
        FACILITY_RECIPE_PROMPT,
        "",
        `设施名称：${getObjectDisplayNameForInteraction(o) || "未命名设施"}`,
        `设施提示：${inferFacilityLabelHint(o)}`,
        `设施动作：${String(record?.profile?.actionLabel || "").trim() || "加工"}`,
        `设施说明：${String(record?.profile?.summary || "").trim() || "将放入材料加工为产物"}`,
        `语义标签：${normalizeSemanticTags(o?.tags, getObjectPromptLikeText(o)).join(", ") || "none"}`,
        `交互标签：${getObjectInteractionTags(o).join(", ") || "none"}`,
        "转化输入别名：",
        transformEntries.length
          ? transformEntries.map((entry) => `- ${entry.alias}: 原始物品名 ${entry.name}, 数量 ${entry.count}, 材料提示 ${entry.hint}`).join("\n")
          : "- none",
        "消耗输入别名：",
        consumeEntries.length
          ? consumeEntries.map((entry) => `- ${entry.alias}: 原始物品名 ${entry.name}, 数量 ${entry.count}, 材料提示 ${entry.hint}`).join("\n")
          : "- none",
        `合法示例：${JSON.stringify(example)}`,
        extraRules.join("\n"),
      ].filter(Boolean).join("\n");
      let lastParsed = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        const prompt = buildPrompt(
          attempt === 0
            ? []
            : [
                "你上一次的回答无效。",
                "请只在 inputs 和 consumes 里使用已知别名，并给每个 output 一个真实非空物品名。",
                `上一次回答：${JSON.stringify(lastParsed).slice(0, 1200)}`,
              ]
        );
        const requestBody = {
          model: FACILITY_RECIPE_MODEL,
          temperature: 0.15,
          messages: [{ role: "user", content: prompt }],
        };
        logFacilityLlmDebug("recipe request", {
          objectName,
          attempt: attempt + 1,
          signature: buildFacilityRecipeSignature(record),
          transformEntries,
          consumeEntries,
          requestBody,
          prompt,
        });
        const data = await fetchJson(base + "/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + key,
          },
          timeoutMs: FACILITY_LLM_TIMEOUT_MS,
          body: JSON.stringify(requestBody),
        });
        const responseText = extractRawChatResponseText(data);
        logFacilityLlmDebug("recipe response", {
          objectName,
          attempt: attempt + 1,
          responseText,
          responseJson: data,
        });
        try {
          lastParsed = parseJsonObjectFromChatResponse(JSON.stringify(data));
        } catch (err) {
          logFacilityLlmDebug("recipe parse failed", {
            objectName,
            attempt: attempt + 1,
            error: String(err?.message ?? err ?? "").trim(),
            responseText,
            responseJson: data,
          });
          throw err;
        }
        const candidates = extractRawFacilityCandidates(lastParsed)
          .map((item, idx) => sanitizeResolvedFacilityCandidate(item, idx, transformLookup, consumeLookup))
          .filter(Boolean)
          .slice(0, 5);
        logFacilityLlmDebug("recipe parsed", {
          objectName,
          attempt: attempt + 1,
          parsed: lastParsed,
          candidates,
        });
        if (candidates.length) return candidates;
        logFacilityLlmDebug("recipe empty candidates", {
          objectName,
          attempt: attempt + 1,
          parsed: lastParsed,
        });
      }
      throw new Error("璁炬柦閰嶆柟鎺ㄧ悊涓虹┖");
    }

    async function ensureFacilityRecipesAsync(o, record = ensureFacilityRecordForObject(o), force = false, reason = "unknown") {
      o = resolveLiveFacilityObject(o);
      record = ensureFacilityRecordForObject(o);
      if (record.activeJob.status === "running") return record.recipe;
      const requestRecord = record;
      let signature = buildFacilityRecipeSignature(requestRecord);
      if (!signature) {
        record.recipe.signature = "";
        record.recipe.status = "idle";
        record.recipe.error = "";
        record.recipe.candidates = [];
        record.recipe.selectedId = "";
        record.recipe.updatedAt = Date.now();
        persistFacilityStore();
        return record.recipe;
      }
      if (!force && record.recipe.status === "ready" && record.recipe.signature === signature && record.recipe.candidates.length) {
        return record.recipe;
      }
      const key = `${getFacilityKeyForObject(o)}::${signature}`;
      if (_facilityRecipeRequestByKey.has(key)) {
        logFacilityLlmDebug("recipe request reused", {
          objectName: getObjectDisplayNameForInteraction(o),
          signature,
          force,
          reason,
          candidateCount: Array.isArray(record.recipe.candidates) ? record.recipe.candidates.length : 0,
          status: record.recipe.status,
        });
        return _facilityRecipeRequestByKey.get(key);
      }
      record.recipe.signature = signature;
      record.recipe.status = "running";
      record.recipe.error = "";
      record.recipe.updatedAt = Date.now();
      logFacilityLlmDebug("recipe state running", {
        objectName: getObjectDisplayNameForInteraction(o),
        signature,
        force,
        reason,
        candidateCountBefore: Array.isArray(record.recipe.candidates) ? record.recipe.candidates.length : 0,
        selectedIdBefore: String(record.recipe.selectedId || ""),
      });
      persistFacilityStore();
      const task = (async () => {
        const profile = await ensureFacilityProfileAsync(o);
        o = resolveLiveFacilityObject(o);
        record = ensureFacilityRecordForObject(o);
        if (record.recipe.signature !== signature) return record.recipe;
        if (profile.status !== "ready" || !String(profile.actionLabel || "").trim()) {
          record.recipe.status = "idle";
          record.recipe.error = "";
          record.recipe.candidates = [];
          record.recipe.selectedId = "";
          record.recipe.updatedAt = Date.now();
          persistFacilityStore();
          return record.recipe;
        }
        record.recipe.updatedAt = Date.now();
        persistFacilityStore();
        try {
          const prevSelected = String(record.recipe.selectedId || "");
          const prevCandidate = (record.recipe.candidates || []).find((item) => item && item.id === prevSelected) || null;
          const prevSummary = summarizeFacilityCandidateForSelection(prevCandidate);
          const candidates = await requestFacilityRecipesFromLlm(o, requestRecord);
          o = resolveLiveFacilityObject(o);
          record = ensureFacilityRecordForObject(o);
          if (record.recipe.signature !== signature) return record.recipe;
          record.recipe.updatedAt = Date.now();
          record.recipe.status = "ready";
          record.recipe.error = "";
          record.recipe.candidates = candidates;
          const matched = prevSummary
            ? candidates.find((item) => summarizeFacilityCandidateForSelection(item) === prevSummary)
            : null;
          if (matched) {
            record.recipe.selectedId = matched.id;
          } else if (candidates.length === 1) {
            record.recipe.selectedId = candidates[0]?.id || "";
          } else {
            record.recipe.selectedId = "";
          }
          record.recipe.updatedAt = Date.now();
          logFacilityLlmDebug("recipe state ready", {
            objectName: getObjectDisplayNameForInteraction(o),
            signature,
            candidateCount: candidates.length,
            selectedId: record.recipe.selectedId,
          });
          for (const candidate of candidates) {
            for (const output of candidate.outputs) {
              registerGeneratedItemDefinition(output);
              void ensureItemIconAsync(output.name);
            }
          }
          persistFacilityStore();
          renderFxCodexPanel();
          return record.recipe;
        } catch (err) {
          o = resolveLiveFacilityObject(o);
          record = ensureFacilityRecordForObject(o);
          if (record.recipe.signature !== signature) return record.recipe;
          record.recipe.status = "error";
          const msg = String(err?.message ?? err ?? "").trim() || "设施配方推断失败（无详细描述）";
          record.recipe.error = msg;
          record.recipe.candidates = [];
          record.recipe.selectedId = "";
          record.recipe.updatedAt = Date.now();
          persistFacilityStore();
          console.warn("[facility-recipe-failed]", msg, err);
          return record.recipe;
        }
      })();
      _facilityRecipeRequestByKey.set(key, task);
      try {
        return await task;
      } finally {
        _facilityRecipeRequestByKey.delete(key);
      }
    }

    function clearFacilityJobTimer(key) {
      const timer = _facilityJobTimerByKey.get(key);
      if (timer) clearTimeout(timer);
      _facilityJobTimerByKey.delete(key);
    }

    function expireStuckFacilityRequests(o, record) {
      const now = Date.now();
      const limit = FACILITY_LLM_TIMEOUT_MS + FACILITY_STUCK_GRACE_MS;
      const profileKey = getFacilityKeyForObject(o);
      let dirty = false;
      if (
        record?.profile?.status === "running" &&
        (now - (Number(record.profile.updatedAt) || 0)) > limit &&
        !_facilityProfileRequestByKey.has(profileKey)
      ) {
        record.profile.status = "error";
        record.profile.error = "设施功能请求超时或未返回";
        dirty = true;
        console.warn("[facility-profile-stuck-timeout]", profileKey);
      }
      const recipeKey = `${profileKey}::${String(record?.recipe?.signature || "")}`;
      if (
        record?.recipe?.status === "running" &&
        (now - (Number(record.recipe.updatedAt) || 0)) > limit &&
        !_facilityRecipeRequestByKey.has(recipeKey)
      ) {
        record.recipe.status = "error";
        record.recipe.error = "候选配方请求超时或未返回";
        dirty = true;
        console.warn("[facility-recipe-stuck-timeout]", recipeKey);
      }
      if (dirty) persistFacilityStore();
    }

    function refundFacilityReservation(record) {
      const reservation = record?.activeJob?.reservation;
      if (!reservation) return;
      addStacksToSlots(record.modules.transformSlots, reservation.transform || []);
      addStacksToSlots(record.modules.consumeSlots, reservation.consume || []);
      record.activeJob.reservation = null;
    }

    function tryStartNextFacilityBatch(o, record) {
      o = resolveLiveFacilityObject(o);
      record = ensureFacilityRecordForObject(o);
      if (!record || record.activeJob.status === "running") return false;
      const selectedId = String(record?.recipe?.selectedId || "");
      const candidates = Array.isArray(record?.recipe?.candidates) ? record.recipe.candidates : [];
      const candidate = candidates.find((item) => item && item.id === selectedId) || (candidates.length === 1 ? candidates[0] : null);
      if (!candidate) {
        record.activeJob.error = candidates.length > 1 ? "请先选择一个候选配方" : "暂无可执行配方";
        logFacilityLlmDebug("recipe start blocked", {
          objectName: getObjectDisplayNameForInteraction(o),
          reason: "missing candidate",
          selectedId,
          candidateCount: candidates.length,
        });
        persistFacilityStore();
        return false;
      }
      if (!listRequirementsSatisfied(record.modules.transformSlots, candidate.inputs || [])) {
        record.activeJob.error = `转化模块材料不满足：需要 ${formatFacilityRequirementList(candidate.inputs || []) || "无"}`;
        logFacilityLlmDebug("recipe start blocked", {
          objectName: getObjectDisplayNameForInteraction(o),
          reason: "transform requirements not satisfied",
          candidate,
          currentTransform: aggregateSlotStacks(record.modules.transformSlots || []),
        });
        persistFacilityStore();
        return false;
      }
      if (!listRequirementsSatisfied(record.modules.consumeSlots, candidate.consumes || [])) {
        record.activeJob.error = `消耗模块材料不满足：需要 ${formatFacilityRequirementList(candidate.consumes || []) || "无"}`;
        logFacilityLlmDebug("recipe start blocked", {
          objectName: getObjectDisplayNameForInteraction(o),
          reason: "consume requirements not satisfied",
          candidate,
          currentConsume: aggregateSlotStacks(record.modules.consumeSlots || []),
        });
        persistFacilityStore();
        return false;
      }
      const removedTransform = removeRequirementsFromSlots(record.modules.transformSlots, candidate.inputs || []);
      const removedConsume = removeRequirementsFromSlots(record.modules.consumeSlots, candidate.consumes || []);
      if (!removedTransform || !removedConsume) {
        if (removedTransform) addStacksToSlots(record.modules.transformSlots, removedTransform);
        if (removedConsume) addStacksToSlots(record.modules.consumeSlots, removedConsume);
        record.activeJob.error = "扣除材料时失败，模块内容可能已变化";
        logFacilityLlmDebug("recipe start blocked", {
          objectName: getObjectDisplayNameForInteraction(o),
          reason: "remove requirements failed",
          candidate,
        });
        persistFacilityStore();
        return false;
      }
      const outputs = makeOutputStacksFromCandidate(candidate);
      logFacilityLlmDebug("recipe start", {
        objectName: getObjectDisplayNameForInteraction(o),
        candidate,
        removedTransform,
        removedConsume,
        outputs,
      });
      record.activeJob.status = "running";
      record.activeJob.recipeId = candidate.id;
      record.activeJob.actionLabel = record.profile.actionLabel || "执行";
      record.activeJob.title = candidate.title;
      record.activeJob.startedAt = Date.now();
      record.activeJob.finishAt = record.activeJob.startedAt + Math.max(200, Number(record.activeJob.batchMs) || 2000);
      record.activeJob.error = "";
      record.activeJob.reservation = {
        transform: removedTransform,
        consume: removedConsume,
        outputs,
      };
      persistFacilityStore();
      const key = getFacilityKeyForObject(o);
      clearFacilityJobTimer(key);
      _facilityJobTimerByKey.set(key, setTimeout(() => {
        completeFacilityBatch(o);
      }, Math.max(50, record.activeJob.finishAt - Date.now())));
      return true;
    }

    function finishFacilityJobAsIdle(record, persist = true) {
      record.activeJob.status = "idle";
      record.activeJob.recipeId = "";
      record.activeJob.actionLabel = "";
      record.activeJob.title = "";
      record.activeJob.startedAt = 0;
      record.activeJob.finishAt = 0;
      record.activeJob.reservation = null;
      if (persist) persistFacilityStore();
    }

    function completeFacilityBatch(o) {
      o = resolveLiveFacilityObject(o);
      const record = ensureFacilityRecordForObject(o);
      const key = getFacilityKeyForObject(o);
      clearFacilityJobTimer(key);
      if (record.activeJob.status !== "running" || !record.activeJob.reservation) return false;
      const reservation = record.activeJob.reservation;
      const outputs = (Array.isArray(reservation.outputs) ? reservation.outputs : []).map(cloneSlotStack).filter(Boolean);
      const outputProbe = record.modules.outputSlots.map((slot) => cloneSlotStack(slot));
      if (!addStacksToSlots(outputProbe, outputs)) {
        refundFacilityReservation(record);
        record.activeJob.error = "产物模块空间不足，已退回本批材料。";
        finishFacilityJobAsIdle(record, true);
        return false;
      }
      record.modules.outputSlots = outputProbe;
      record.activeJob.completedBatches = Math.max(0, Number(record.activeJob.completedBatches) || 0) + 1;
      record.activeJob.reservation = null;
      finishFacilityJobAsIdle(record, false);
      const continued = tryStartNextFacilityBatch(o, record);
      persistFacilityStore();
      if (!continued) renderFxCodexPanel();
      return true;
    }

    function cancelFacilityJob(o) {
      o = resolveLiveFacilityObject(o);
      const record = ensureFacilityRecordForObject(o);
      const key = getFacilityKeyForObject(o);
      clearFacilityJobTimer(key);
      if (record.activeJob.status === "running") {
        refundFacilityReservation(record);
      }
      record.activeJob.error = "已取消，材料已退回。";
      finishFacilityJobAsIdle(record, true);
      return true;
    }

    function formatFacilityRecipeCandidate(candidate) {
      const inputs = (candidate?.inputs || []).map((item) => `${item.name}×${item.count}`).join(" + ") || "（空）";
      const consumes = (candidate?.consumes || []).map((item) => `${item.name}×${item.count}`).join(" + ");
      const outputs = (candidate?.outputs || []).map((item) => `${item.name}×${item.count}`).join(" + ") || "（空）";
      return { inputs, consumes, outputs };
    }

    function formatFacilityRequirementList(items) {
      return (Array.isArray(items) ? items : [])
        .map((item) => `${String(item?.name || "").trim() || "?"}×${Math.max(1, Math.floor(Number(item?.count) || 1))}`)
        .join(" + ");
    }

    const _legacyGetFacilityStatusText = function(o, record) {
      expireStuckFacilityRequests(o, record);
      if (!record) return "设施未初始化。";
      if (record.activeJob.status === "running") {
        const leftMs = Math.max(0, Number(record.activeJob.finishAt) - Date.now());
        return `${record.activeJob.actionLabel || "执行"}中：${record.activeJob.title || "当前批次"} · ${(leftMs / 1000).toFixed(1)}s · 已完成 ${record.activeJob.completedBatches || 0} 批`;
      }
      // 配方已进入错误状态时优先提示，避免一直处于「设施功能分析中」或默认提示而盖住具体原因。
      if (record.recipe.status === "error") {
        const detail = String(record.recipe.error || "").trim();
        return `配方分析失败：${detail || "未知原因（请打开开发者工具控制台，搜索 facility-recipe）"}`;
      }
      if (record.profile.status === "running") return "正在分析设施功能…";
      if (record.profile.status === "error") return `设施功能分析失败：${record.profile.error || "未知错误"}`;
      if (record.recipe.status === "running") return "正在分析候选配方…";
      if (record.activeJob.error) return record.activeJob.error;
      if (record.recipe.status === "ready" && record.recipe.candidates.length) {
        const n = record.recipe.candidates.length;
        return n > 1 ? `已生成 ${n} 个候选配方，选择后可开始${record.profile.actionLabel || "执行"}。` : `已生成配方，可开始${record.profile.actionLabel || "执行"}。`;
      }
      const recipeSig = buildFacilityRecipeSignature(record);
      const actionReady = record.profile.status === "ready" && String(record.profile.actionLabel || "").trim();
      if (recipeSig && actionReady && record.recipe.status === "idle" && !record.recipe.candidates?.length) {
        return `模块内已有物品但尚未得到有效候选配方。请点击底部主按钮触发「重新推断配方」（若仍为失败请查看控制台 [facility-recipe]）。`;
      }
      return "放入物品后会自动分析当前设施可用的候选配方。";
    };

    function getFacilityStatusText(o, record) {
      expireStuckFacilityRequests(o, record);
      if (!record) return "设施未初始化。";
      if (record.activeJob.status === "running") {
        const leftMs = Math.max(0, Number(record.activeJob.finishAt) - Date.now());
        return `${record.activeJob.actionLabel || "执行"}中：${record.activeJob.title || "当前批次"} · ${(leftMs / 1000).toFixed(1)}s · 已完成 ${record.activeJob.completedBatches || 0} 批`;
      }
      if (Array.isArray(record.recipe?.candidates) && record.recipe.candidates.length) {
        const n = record.recipe.candidates.length;
        return n > 1 ? `已生成 ${n} 个候选配方，选择后可开始${record.profile.actionLabel || "执行"}。` : `已生成配方，可开始${record.profile.actionLabel || "执行"}。`;
      }
      if (record.activeJob.error) return String(record.activeJob.error || "");
      if (record.recipe.status === "error") {
        const detail = String(record.recipe.error || "").trim();
        return `配方分析失败：${detail || "未知原因（请查看控制台 facility-recipe）"}`;
      }
      if (record.profile.status === "error" && !String(record.profile.actionLabel || "").trim()) {
        return `设施功能分析失败：${record.profile.error || "未知错误"}`;
      }
      if (record.profile.status === "running" && !String(record.profile.actionLabel || "").trim()) return "正在分析设施功能…";
      if (record.recipe.status === "running") return "正在分析候选配方…";
      const recipeSig = buildFacilityRecipeSignature(record);
      const actionReady = !!String(record.profile.actionLabel || "").trim();
      if (recipeSig && actionReady) return "模块内已有物品，正在等待有效候选配方。";
      return "放入物品后会自动分析当前设施可用的候选配方。";
    }

    function openFacilityModal(o) {
      o = resolveLiveFacilityObject(o);
      if (!o) return;
      const record = ensureFacilityRecordForObject(o);
      void ensureFacilityProfileAsync(o);
      void ensureFacilityRecipesAsync(o, record, false, "open modal");
      const wrap = document.createElement("div");
      wrap.className = "fx-container-modal fx-facility-modal";

      const title = document.createElement("div");
      title.className = "fx-container-title";

      const hint = document.createElement("div");
      hint.className = "fx-container-hint";
      hint.textContent = "转化模块里的物品会一起参与一次推理；消耗模块用于燃料等消耗品；默认每批转化耗时 2 秒，可在完成前取消并退回本批材料。";

      let held = null;
      const heldFloat = document.createElement("div");
      heldFloat.className = "fx-held-float";
      heldFloat.hidden = true;

      const transformTitle = document.createElement("div");
      transformTitle.className = "fx-container-subtitle";
      const transformGrid = document.createElement("div");
      transformGrid.className = "fx-container-grid fx-facility-grid";

      const consumeTitle = document.createElement("div");
      consumeTitle.className = "fx-container-subtitle";
      consumeTitle.textContent = "消耗模块";
      const consumeGrid = document.createElement("div");
      consumeGrid.className = "fx-container-hotbar fx-facility-consume";

      const outputTitle = document.createElement("div");
      outputTitle.className = "fx-container-subtitle";
      outputTitle.textContent = "产物模块";
      const outputGrid = document.createElement("div");
      outputGrid.className = "fx-container-hotbar fx-facility-output";

      const recipeHost = document.createElement("div");
      recipeHost.className = "fx-facility-recipes";

      const statusEl = document.createElement("div");
      statusEl.className = "fx-facility-status";

      const hotbarTitle = document.createElement("div");
      hotbarTitle.className = "fx-container-subtitle";
      hotbarTitle.textContent = "背包（物品栏 1-9）";
      const hotbarGrid = document.createElement("div");
      hotbarGrid.className = "fx-container-hotbar";

      const footer = document.createElement("div");
      footer.className = "fx-container-actions fx-facility-actions";
      const btnAction = document.createElement("button");
      btnAction.type = "button";
      btnAction.className = "fx-container-close fx-facility-run";
      const btnCancel = document.createElement("button");
      btnCancel.type = "button";
      btnCancel.className = "fx-container-close fx-facility-cancel";
      btnCancel.textContent = "取消";
      const btnClose = document.createElement("button");
      btnClose.type = "button";
      btnClose.className = "fx-container-close";
      btnClose.textContent = "关闭";
      footer.appendChild(btnAction);
      footer.appendChild(btnCancel);
      footer.appendChild(btnClose);

      const transformButtons = [];
      const consumeButtons = [];
      const outputButtons = [];
      const hotbarButtons = [];
      const getHotbarSlots = () => (Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : []);
      let lastMouseX = 0;
      let lastMouseY = 0;
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

      const syncPointerFromEvent = (ev) => {
        const x = Number(ev?.clientX);
        const y = Number(ev?.clientY);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
        lastMouseX = x;
        lastMouseY = y;
        animator._lastPointerX = x;
        animator._lastPointerY = y;
        return true;
      };

      const seedFromGlobalPointer = () => {
        const gx = Number(animator._lastPointerX) || 0;
        const gy = Number(animator._lastPointerY) || 0;
        if (gx || gy) {
          lastMouseX = gx;
          lastMouseY = gy;
          return;
        }
        lastMouseX = Math.floor((window.innerWidth || 0) * 0.5);
        lastMouseY = Math.floor((window.innerHeight || 0) * 0.5);
      };

      const renderHeldFloat = () => {
        heldFloat.innerHTML = "";
        if (!held) {
          heldFloat.hidden = true;
          return;
        }
        heldFloat.hidden = false;
        const iconWrap = document.createElement("span");
        iconWrap.className = "fx-held-float-icon-wrap";
        if (held.icon) {
          const img = document.createElement("img");
          img.className = "fx-held-float-icon";
          img.decoding = "async";
          img.alt = "";
          img.src = String(held.icon);
          iconWrap.appendChild(img);
        } else {
          iconWrap.textContent = "·";
        }
        heldFloat.appendChild(iconWrap);
        const c = Math.max(1, Math.floor(Number(held.count) || 1));
        if (c > 1) {
          const count = document.createElement("span");
          count.className = "fx-held-float-count";
          count.textContent = String(c);
          heldFloat.appendChild(count);
        }
      };

      const positionHeldFloat = () => {
        if (heldFloat.hidden) return;
        const pad = 12;
        const w = heldFloat.offsetWidth || 160;
        const h = heldFloat.offsetHeight || 28;
        const rect = elFxInteractionModal?.getBoundingClientRect?.();
        const hostW = Number(rect?.width) || (window.innerWidth || 0);
        const hostH = Number(rect?.height) || (window.innerHeight || 0);
        const baseX = Number(rect?.left) || 0;
        const baseY = Number(rect?.top) || 0;
        const x = clamp(lastMouseX - baseX - Math.round(w * 1.0), pad, Math.max(pad, hostW - w - pad));
        const y = clamp(lastMouseY - baseY - Math.round(h * 1.0), pad, Math.max(pad, hostH - h - pad));
        heldFloat.style.transform = `translate(${x}px, ${y}px)`;
      };

      const persistAll = () => {
        persistHotbarState();
        syncFxHotbarUi();
        persistFacilityStore();
      };

      const isBusy = () => ensureFacilityRecordForObject(o).activeJob.status === "running";

      const applyLeftClick = (getItem, setItem, ev, options = {}) => {
        const lockDuringJob = options.lockDuringJob !== false;
        const reanalyzeAfterChange = options.reanalyzeAfterChange !== false;
        if (lockDuringJob && isBusy()) return;
        syncPointerFromEvent(ev);
        const item = getItem();
        const ctrl = !!ev.ctrlKey;
        if (!held) {
          if (!item) return;
          if (ctrl && Math.max(1, Number(item.count) || 1) > 1) {
            const total = Math.max(1, Math.floor(Number(item.count) || 1));
            const takeN = Math.ceil(total / 2);
            const { taken, left } = takeFromStack(item, takeN);
            held = taken;
            setItem(left);
          } else {
            held = cloneSlotStack(item);
            setItem(null);
          }
        } else {
          if (!item) {
            setItem(held);
            held = null;
          } else if (stacksCompatibleForMerge(held, item)) {
            const merged = cloneSlotStack(item);
            merged.count = Math.max(1, Math.floor(Number(merged.count) || 1)) + Math.max(1, Math.floor(Number(held.count) || 1));
            setItem(merged);
            held = null;
          } else {
            const tmp = cloneSlotStack(item);
            setItem(held);
            held = tmp;
          }
        }
        const rec = ensureFacilityRecordForObject(o);
        rec.activeJob.error = "";
        if (reanalyzeAfterChange) {
          void ensureFacilityRecipesAsync(o, rec, true, "left click slot");
        }
        persistAll();
        refreshUi();
      };

      const applyRightClick = (getItem, setItem, ev, options = {}) => {
        const lockDuringJob = options.lockDuringJob !== false;
        const reanalyzeAfterChange = options.reanalyzeAfterChange !== false;
        if (lockDuringJob && isBusy()) return;
        ev.preventDefault();
        syncPointerFromEvent(ev);
        const item = getItem();
        if (!held) {
          if (!item) return;
          const { taken, left } = takeFromStack(item, 1);
          held = taken;
          setItem(left);
        } else {
          if (!item) {
            const { taken, left } = takeFromStack(held, 1);
            setItem(taken);
            held = left;
          } else if (stacksCompatibleForMerge(held, item)) {
            const split = takeFromStack(held, 1);
            const next = cloneSlotStack(item);
            next.count = Math.max(1, Math.floor(Number(next.count) || 1)) + 1;
            setItem(next);
            held = split.left;
          } else {
            return;
          }
        }
        const rec = ensureFacilityRecordForObject(o);
        rec.activeJob.error = "";
        if (reanalyzeAfterChange) {
          void ensureFacilityRecipesAsync(o, rec, true, "right click slot");
        }
        persistAll();
        refreshUi();
      };

      const buildSlotButtons = (host, slotCount, buttons, datasetKey, getArray, setValue, options = {}) => {
        for (let i = 0; i < slotCount; i++) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fx-container-slot";
          btn.dataset[datasetKey] = String(i);
          btn.addEventListener("click", (ev) => applyLeftClick(() => (getArray()[i] || null), (v) => setValue(i, v), ev, options));
          btn.addEventListener("contextmenu", (ev) => applyRightClick(() => (getArray()[i] || null), (v) => setValue(i, v), ev, options));
          buttons.push(btn);
          host.appendChild(btn);
        }
      };

      buildSlotButtons(
        transformGrid,
        record.modules.transformSlots.length,
        transformButtons,
        "transformIndex",
        () => ensureFacilityRecordForObject(o).modules.transformSlots,
        (i, v) => { ensureFacilityRecordForObject(o).modules.transformSlots[i] = v; },
        { lockDuringJob: true, reanalyzeAfterChange: true }
      );
      buildSlotButtons(
        consumeGrid,
        record.modules.consumeSlots.length,
        consumeButtons,
        "consumeIndex",
        () => ensureFacilityRecordForObject(o).modules.consumeSlots,
        (i, v) => { ensureFacilityRecordForObject(o).modules.consumeSlots[i] = v; },
        { lockDuringJob: true, reanalyzeAfterChange: true }
      );
      buildSlotButtons(
        outputGrid,
        record.modules.outputSlots.length,
        outputButtons,
        "outputIndex",
        () => ensureFacilityRecordForObject(o).modules.outputSlots,
        (i, v) => { ensureFacilityRecordForObject(o).modules.outputSlots[i] = v; },
        { lockDuringJob: false, reanalyzeAfterChange: false }
      );

      const hotbarCount = Math.max(1, Math.floor(Number(animator.hotbarSlotCount) || 9));
      for (let i = 0; i < hotbarCount; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fx-container-slot fx-container-slot-hotbar";
        btn.dataset.hotbarIndex = String(i);
        btn.addEventListener("click", (ev) => {
          applyLeftClick(
            () => (getHotbarSlots()[i] || null),
            (v) => {
              const hb = getHotbarSlots();
              hb[i] = v;
              animator.hotbarSlots = hb;
              animator.hotbarSelectedIndex = i;
              ls(FX_HOTBAR_SEL_KEY, String(i));
            },
            ev,
            { lockDuringJob: false, reanalyzeAfterChange: false }
          );
        });
        btn.addEventListener("contextmenu", (ev) => {
          applyRightClick(
            () => (getHotbarSlots()[i] || null),
            (v) => {
              const hb = getHotbarSlots();
              hb[i] = v;
              animator.hotbarSlots = hb;
            },
            ev,
            { lockDuringJob: false, reanalyzeAfterChange: false }
          );
        });
        hotbarButtons.push(btn);
        hotbarGrid.appendChild(btn);
      }

      btnAction.addEventListener("click", () => {
        const rec = ensureFacilityRecordForObject(o);
        if (rec.activeJob.status === "running") return;
        rec.activeJob.error = "";
        if (rec.profile.status !== "ready" || !String(rec.profile.actionLabel || "").trim()) {
          void ensureFacilityProfileAsync(o).then(() => {
            const next = ensureFacilityRecordForObject(o);
            if (next.profile.status === "ready" && buildFacilityRecipeSignature(next)) {
              void ensureFacilityRecipesAsync(o, next, true, "profile ready after action click");
            }
          });
          refreshUi();
          return;
        }
        if (rec.recipe.status !== "ready" || !rec.recipe.candidates.length) {
          void ensureFacilityRecipesAsync(o, rec, true, "action click analyze recipe");
          refreshUi();
          return;
        }
        if (!tryStartNextFacilityBatch(o, rec)) {
          if (!String(rec.activeJob.error || "").trim()) {
            rec.activeJob.error = "材料或消耗品不足，无法开始本批转化。";
          }
          persistFacilityStore();
        }
        refreshUi();
      });
      btnCancel.addEventListener("click", () => {
        cancelFacilityJob(o);
        refreshUi();
      });
      btnClose.addEventListener("click", () => closeInteractionModal());

      const refreshRecipeList = (rec) => {
        recipeHost.innerHTML = "";
        const candidates = Array.isArray(rec?.recipe?.candidates) ? rec.recipe.candidates : [];
        if (!candidates.length) {
          const empty = document.createElement("div");
          empty.className = "fx-facility-recipe-empty";
          if (rec?.recipe?.status === "running") {
            empty.textContent = "正在后台推理配方…";
          } else if (rec?.recipe?.status === "error") {
            const detail = String(rec?.recipe?.error || "").trim();
            empty.textContent = detail ? `候选配方生成失败：${detail}` : "候选配方生成失败（详情见控制台 [facility-recipe]）";
          } else if (!String(rec?.recipe?.signature || "").trim()) {
            empty.textContent = "放入物品后会自动分析候选配方";
          } else {
            empty.textContent = "等待生成候选配方";
          }
          recipeHost.appendChild(empty);
          return;
        }
        for (const candidate of candidates) {
          const row = document.createElement("label");
          row.className = "fx-facility-recipe";
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = `facilityRecipe_${getFacilityKeyForObject(o)}`;
          radio.checked = rec.recipe.selectedId === candidate.id;
          radio.disabled = rec.activeJob.status === "running";
          radio.addEventListener("change", () => {
            rec.recipe.selectedId = candidate.id;
            rec.activeJob.error = "";
            persistFacilityStore();
            refreshUi();
          });
          const body = document.createElement("div");
          body.className = "fx-facility-recipe-body";
          const titleEl = document.createElement("strong");
          titleEl.textContent = candidate.title || "未命名配方";
          const meta = document.createElement("div");
          meta.className = "fx-facility-recipe-meta";
          const text = formatFacilityRecipeCandidate(candidate);
          meta.textContent = `输入：${text.inputs}${text.consumes ? ` ｜ 消耗：${text.consumes}` : ""} ｜ 产出：${text.outputs}`;
          const summary = document.createElement("div");
          summary.className = "fx-facility-recipe-summary";
          summary.textContent = candidate.summary || "候选转化路径";
          body.appendChild(titleEl);
          body.appendChild(meta);
          body.appendChild(summary);
          row.appendChild(radio);
          row.appendChild(body);
          recipeHost.appendChild(row);
        }
      };

      const refreshUi = () => {
        o = resolveLiveFacilityObject(o);
        const rec = ensureFacilityRecordForObject(o);
        const actionLabel = String(rec.profile.actionLabel || "").trim();
        if ((rec.profile.status === "running" || rec.recipe.status === "running") && (rec.profile.actionLabel || rec.recipe.candidates.length)) {
          logFacilityLlmDebug("ui stale running state", {
            objectName: getObjectDisplayNameForInteraction(o),
            profileStatus: rec.profile.status,
            profileActionLabel: rec.profile.actionLabel,
            recipeStatus: rec.recipe.status,
            candidateCount: Array.isArray(rec.recipe.candidates) ? rec.recipe.candidates.length : 0,
            selectedId: String(rec.recipe.selectedId || ""),
          });
        }
        title.textContent = actionLabel
          ? `${getObjectDisplayNameForInteraction(o) || "设施"} · ${actionLabel}`
          : `${getObjectDisplayNameForInteraction(o) || "设施"}`;
        transformTitle.textContent = actionLabel ? `${actionLabel}模块` : "主模块";
        statusEl.textContent = getFacilityStatusText(o, rec);
        const hasRecipeCandidates = Array.isArray(rec.recipe.candidates) && rec.recipe.candidates.length > 0;
        const profileBusyWithoutLabel = rec.profile.status === "running" && !actionLabel;
        const recipeBusyWithoutCandidates = rec.recipe.status === "running" && !hasRecipeCandidates;
        if (profileBusyWithoutLabel) {
          btnAction.textContent = "分析功能中…";
        } else if (rec.profile.status === "error" && !actionLabel) {
          btnAction.textContent = "重试功能分析";
        } else if (!actionLabel) {
          btnAction.textContent = "分析设施功能";
        } else if (recipeBusyWithoutCandidates) {
          btnAction.textContent = "分析配方中…";
        } else if (rec.recipe.status === "error") {
          btnAction.textContent = "重新分析配方";
        } else {
          btnAction.textContent = actionLabel;
        }
        const hasInputSignature = !!buildFacilityRecipeSignature(rec);
        const canRetryProfile = (!actionLabel && rec.profile.status === "error") || !actionLabel;
        const canAnalyzeRecipe = !!actionLabel && hasInputSignature && (rec.recipe.status === "error" || rec.recipe.status === "idle" || !rec.recipe.candidates.length);
        const canRunRecipe = !!actionLabel && hasRecipeCandidates;
        btnAction.disabled =
          rec.activeJob.status === "running" ||
          profileBusyWithoutLabel ||
          recipeBusyWithoutCandidates ||
          (!canRetryProfile && !canAnalyzeRecipe && !canRunRecipe);
        btnCancel.disabled = rec.activeJob.status !== "running";
        for (let i = 0; i < transformButtons.length; i++) {
          setSlotButtonContent(transformButtons[i], rec.modules.transformSlots[i] || null);
          transformButtons[i].disabled = rec.activeJob.status === "running";
        }
        for (let i = 0; i < consumeButtons.length; i++) {
          setSlotButtonContent(consumeButtons[i], rec.modules.consumeSlots[i] || null);
          consumeButtons[i].disabled = rec.activeJob.status === "running";
        }
        for (let i = 0; i < outputButtons.length; i++) {
          setSlotButtonContent(outputButtons[i], rec.modules.outputSlots[i] || null);
          outputButtons[i].disabled = false;
        }
        const hb = getHotbarSlots();
        for (let i = 0; i < hotbarButtons.length; i++) {
          setSlotButtonContent(hotbarButtons[i], hb[i] || null);
          hotbarButtons[i].disabled = false;
          hotbarButtons[i].classList.toggle("is-selected", i === Math.max(0, Math.min(hotbarCount - 1, Number(animator.hotbarSelectedIndex) || 0)));
        }
        refreshRecipeList(rec);
        renderHeldFloat();
        positionHeldFloat();
      };

      wrap.appendChild(title);
      wrap.appendChild(hint);
      wrap.appendChild(transformTitle);
      wrap.appendChild(transformGrid);
      wrap.appendChild(consumeTitle);
      wrap.appendChild(consumeGrid);
      wrap.appendChild(outputTitle);
      wrap.appendChild(outputGrid);
      wrap.appendChild(statusEl);
      wrap.appendChild(recipeHost);
      wrap.appendChild(hotbarTitle);
      wrap.appendChild(hotbarGrid);
      wrap.appendChild(footer);

      seedFromGlobalPointer();
      if (elFxInteractionModal) elFxInteractionModal.style.position = "absolute";
      heldFloat.style.position = "absolute";
      if (elFxInteractionModal) elFxInteractionModal.appendChild(heldFloat);
      let heldFloatRaf = 0;
      const syncPointerFromGlobalTrack = () => {
        const gx = Number(animator._lastPointerX);
        const gy = Number(animator._lastPointerY);
        if (Number.isFinite(gx) && Number.isFinite(gy) && (gx || gy)) {
          lastMouseX = gx;
          lastMouseY = gy;
          return true;
        }
        return false;
      };
      const onMove = (ev) => {
        if (!syncPointerFromEvent(ev) && !syncPointerFromGlobalTrack()) seedFromGlobalPointer();
        positionHeldFloat();
      };
      const tickHeldFloat = () => {
        if (!heldFloat.isConnected) return;
        if (!syncPointerFromGlobalTrack()) seedFromGlobalPointer();
        positionHeldFloat();
        heldFloatRaf = requestAnimationFrame(tickHeldFloat);
      };
      window.addEventListener("pointermove", onMove, { passive: true, capture: true });
      window.addEventListener("mousemove", onMove, { passive: true, capture: true });
      heldFloatRaf = requestAnimationFrame(tickHeldFloat);
      const uiTimer = setInterval(() => refreshUi(), 160);
      wrap.__cleanupFn = () => {
        window.removeEventListener("pointermove", onMove, { capture: true });
        window.removeEventListener("mousemove", onMove, { capture: true });
        if (heldFloatRaf) cancelAnimationFrame(heldFloatRaf);
        clearInterval(uiTimer);
        heldFloat.remove();
      };
      wrap.__blockCloseFn = () => !!held;
      requestAnimationFrame(() => {
        refreshUi();
        positionHeldFloat();
      });
      openInteractionModal(wrap);
    }

    function stacksCompatibleForMerge(a, b) {
      if (!a || !b) return false;
      if (String(a.name || "") !== String(b.name || "")) return false;
      const la = a.liquid || null;
      const lb = b.liquid || null;
      if (!la && !lb) return true;
      if (!la || !lb) return false;
      return String(la.type || "") === String(lb.type || "") && Number(la.max) === Number(lb.max);
    }

    function normalizeStackCount(stack) {
      if (!stack) return null;
      stack.count = Math.max(1, Math.floor(Number(stack.count) || 1));
      return stack;
    }

    function takeFromStack(stack, n) {
      if (!stack) return { taken: null, left: null };
      const total = Math.max(1, Math.floor(Number(stack.count) || 1));
      const k = Math.max(1, Math.min(total, Math.floor(Number(n) || 1)));
      const taken = cloneSlotStack(stack);
      const left = cloneSlotStack(stack);
      if (taken) taken.count = k;
      if (left) left.count = total - k;
      return { taken: normalizeStackCount(taken), left: left && left.count > 0 ? left : null };
    }

    function getSlotRenderSignature(item) {
      const clean = sanitizeContainerSlotForStorage(item);
      if (!clean) return "__empty__";
      const liquid = clean.liquid
        ? `${String(clean.liquid.type || "")}:${Number(clean.liquid.amount) || 0}:${Number(clean.liquid.max) || 0}`
        : "";
      return [
        String(clean.name || ""),
        Math.max(1, Math.floor(Number(clean.count) || 1)),
        String(clean.icon || ""),
        liquid,
      ].join("||");
    }

    function setSlotButtonContent(btn, item) {
      if (!btn) return;
      const clean = sanitizeContainerSlotForStorage(item);
      const label = clean?.name ? String(clean.name) : "";
      const title = label ? `${label}${clean?.count > 1 ? ` ×${clean.count}` : ""}` : "空";
      const signature = getSlotRenderSignature(clean);
      if (btn.dataset.slotRenderSig === signature && btn.title === title) return;
      btn.dataset.slotRenderSig = signature;
      btn.innerHTML = "";
      btn.title = title;
      if (clean && clean.icon) {
        const img = document.createElement("img");
        img.className = "fx-container-icon";
        img.decoding = "async";
        img.alt = label;
        img.src = String(clean.icon);
        btn.appendChild(img);
      } else if (clean) {
        const token = document.createElement("span");
        token.className = "fx-container-fallback";
        token.textContent = label ? String(label).trim().slice(0, 2) : "物品";
        btn.appendChild(token);
      } else {
        const empty = document.createElement("span");
        empty.className = "fx-container-empty";
        empty.textContent = "·";
        btn.appendChild(empty);
      }
      if (clean && label) {
        const name = document.createElement("span");
        name.className = "fx-container-name";
        name.textContent = String(label).trim().slice(0, 4);
        btn.appendChild(name);
      }
      if (clean?.count > 1) {
        const count = document.createElement("span");
        count.className = "fx-container-count";
        count.textContent = String(Math.max(1, Math.floor(Number(clean.count) || 1)));
        btn.appendChild(count);
      }
    }

    function renderHeldStackBadge(held) {
      const row = document.createElement("div");
      row.className = "fx-container-held";
      const label = document.createElement("div");
      label.className = "fx-container-held-label";
      label.textContent = "手上：";
      const card = document.createElement("div");
      card.className = "fx-container-held-card";
      if (!held) {
        card.textContent = "（空）";
      } else {
        const name = document.createElement("span");
        name.className = "fx-container-held-name";
        name.textContent = String(held.name || "未命名");
        const count = document.createElement("span");
        count.className = "fx-container-held-count";
        const c = Math.max(1, Math.floor(Number(held.count) || 1));
        count.textContent = c > 1 ? `×${c}` : "";
        card.appendChild(name);
        if (count.textContent) card.appendChild(count);
      }
      row.appendChild(label);
      row.appendChild(card);
      return row;
    }

    function buildContainerModal(o, slots) {
      const wrap = document.createElement("div");
      wrap.className = "fx-container-modal";

      const title = document.createElement("div");
      title.className = "fx-container-title";
      title.textContent = `${getObjectDisplayNameForInteraction(o) || "容器"} · 2×9`;

      const hint = document.createElement("div");
      hint.className = "fx-container-hint";
      hint.textContent = "左键：拿起/放下/合并；右键：移动 1 个；Ctrl：拆半。";

      let held = null;
      // floating held stack (follows cursor)
      const heldFloat = document.createElement("div");
      heldFloat.className = "fx-held-float";
      heldFloat.hidden = true;

      const containerGrid = document.createElement("div");
      containerGrid.className = "fx-container-grid";

      const hotbarGrid = document.createElement("div");
      hotbarGrid.className = "fx-container-hotbar";

      const containerButtons = [];
      const hotbarButtons = [];

      const getHotbarSlots = () => (Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : []);

      const persistAll = () => {
        persistHotbarState();
        syncFxHotbarUi();
        saveContainerSlots(o, slots);
      };

      let lastMouseX = 0;
      let lastMouseY = 0;
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const syncPointerFromEvent = (ev) => {
        const x = Number(ev?.clientX);
        const y = Number(ev?.clientY);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
        lastMouseX = x;
        lastMouseY = y;
        animator._lastPointerX = x;
        animator._lastPointerY = y;
        return true;
      };
      const renderHeldFloat = () => {
        heldFloat.innerHTML = "";
        if (!held) {
          heldFloat.hidden = true;
          return;
        }
        heldFloat.hidden = false;
        const iconWrap = document.createElement("span");
        iconWrap.className = "fx-held-float-icon-wrap";
        if (held.icon) {
          const img = document.createElement("img");
          img.className = "fx-held-float-icon";
          img.decoding = "async";
          img.alt = "";
          img.src = String(held.icon);
          iconWrap.appendChild(img);
        } else {
          iconWrap.textContent = "·";
        }
        heldFloat.appendChild(iconWrap);
        const c = Math.max(1, Math.floor(Number(held.count) || 1));
        if (c > 1) {
          const count = document.createElement("span");
          count.className = "fx-held-float-count";
          count.textContent = String(c);
          heldFloat.appendChild(count);
        }
      };
      const positionHeldFloat = () => {
        if (heldFloat.hidden) return;
        const pad = 12;
        const w = heldFloat.offsetWidth || 160;
        const h = heldFloat.offsetHeight || 28;
        const rect = elFxInteractionModal?.getBoundingClientRect?.();
        const hostW = Number(rect?.width) || (window.innerWidth || 0);
        const hostH = Number(rect?.height) || (window.innerHeight || 0);
        const baseX = Number(rect?.left) || 0;
        const baseY = Number(rect?.top) || 0;
        const leadX = Math.round(w * 1.0);
        const leadY = Math.round(h * 1.0);
        const x = clamp(lastMouseX - baseX - leadX, pad, Math.max(pad, hostW - w - pad));
        const y = clamp(lastMouseY - baseY - leadY, pad, Math.max(pad, hostH - h - pad));
        heldFloat.style.transform = `translate(${x}px, ${y}px)`;
      };

      const refreshAllButtons = () => {
        for (let i = 0; i < containerButtons.length; i++) setSlotButtonContent(containerButtons[i], slots[i] || null);
        const hb = getHotbarSlots();
        for (let i = 0; i < hotbarButtons.length; i++) {
          setSlotButtonContent(hotbarButtons[i], hb[i] || null);
          hotbarButtons[i].classList.toggle("is-selected", i === Math.max(0, Math.min((Number(animator.hotbarSlotCount) || 9) - 1, Number(animator.hotbarSelectedIndex) || 0)));
        }
        renderHeldFloat();
        positionHeldFloat();
      };

      const applyLeftClick = (getItem, setItem, ev) => {
        syncPointerFromEvent(ev);
        const item = getItem();
        const ctrl = !!ev.ctrlKey;
        if (!held) {
          if (!item) return;
          if (ctrl && Math.max(1, Number(item.count) || 1) > 1) {
            const total = Math.max(1, Math.floor(Number(item.count) || 1));
            const takeN = Math.ceil(total / 2);
            const { taken, left } = takeFromStack(item, takeN);
            held = taken;
            setItem(left);
          } else {
            held = cloneSlotStack(item);
            setItem(null);
          }
        } else {
          if (!item) {
            setItem(held);
            held = null;
          } else if (stacksCompatibleForMerge(held, item)) {
            const merged = cloneSlotStack(item);
            merged.count = Math.max(1, Math.floor(Number(merged.count) || 1)) + Math.max(1, Math.floor(Number(held.count) || 1));
            setItem(merged);
            held = null;
          } else {
            const tmp = cloneSlotStack(item);
            setItem(held);
            held = tmp;
          }
        }
        persistAll();
        refreshAllButtons();
      };

      const applyRightClick = (getItem, setItem, ev) => {
        ev.preventDefault();
        syncPointerFromEvent(ev);
        const item = getItem();
        if (!held) {
          if (!item) return;
          const { taken, left } = takeFromStack(item, 1);
          held = taken;
          setItem(left);
        } else {
          if (!item) {
            const { taken, left } = takeFromStack(held, 1);
            setItem(taken);
            held = left;
          } else if (stacksCompatibleForMerge(held, item)) {
            const { taken, left } = takeFromStack(held, 1);
            const next = cloneSlotStack(item);
            next.count = Math.max(1, Math.floor(Number(next.count) || 1)) + 1;
            setItem(next);
            held = left;
          } else {
            return;
          }
        }
        persistAll();
        refreshAllButtons();
      };

      // container buttons (18)
      for (let i = 0; i < slots.length; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fx-container-slot";
        btn.dataset.containerIndex = String(i);
        btn.addEventListener("click", (ev) => applyLeftClick(() => slots[i] || null, (v) => { slots[i] = v; }, ev));
        btn.addEventListener("contextmenu", (ev) => applyRightClick(() => slots[i] || null, (v) => { slots[i] = v; }, ev));
        containerButtons.push(btn);
        containerGrid.appendChild(btn);
      }

      // hotbar buttons (9)
      const hotbarCount = Math.max(1, Math.floor(Number(animator.hotbarSlotCount) || 9));
      for (let i = 0; i < hotbarCount; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fx-container-slot fx-container-slot-hotbar";
        btn.dataset.hotbarIndex = String(i);
        btn.addEventListener("click", (ev) => {
          applyLeftClick(
            () => (getHotbarSlots()[i] || null),
            (v) => {
              const hb = getHotbarSlots();
              hb[i] = v;
              animator.hotbarSlots = hb;
              animator.hotbarSelectedIndex = i;
              ls(FX_HOTBAR_SEL_KEY, String(i));
            },
            ev
          );
        });
        btn.addEventListener("contextmenu", (ev) => {
          applyRightClick(
            () => (getHotbarSlots()[i] || null),
            (v) => {
              const hb = getHotbarSlots();
              hb[i] = v;
              animator.hotbarSlots = hb;
            },
            ev
          );
        });
        hotbarButtons.push(btn);
        hotbarGrid.appendChild(btn);
      }

      const footer = document.createElement("div");
      footer.className = "fx-container-actions";
      const btnClose = document.createElement("button");
      btnClose.type = "button";
      btnClose.className = "fx-container-close";
      btnClose.textContent = "关闭";
      btnClose.addEventListener("click", () => closeInteractionModal());
      footer.appendChild(btnClose);

      wrap.appendChild(title);
      wrap.appendChild(hint);
      wrap.appendChild(containerGrid);
      const hotbarTitle = document.createElement("div");
      hotbarTitle.className = "fx-container-subtitle";
      hotbarTitle.textContent = "背包（物品栏 1-9）";
      wrap.appendChild(hotbarTitle);
      wrap.appendChild(hotbarGrid);
      wrap.appendChild(footer);

      // mouse tracking (cleanup on modal close/re-render)
      const seedFromGlobalPointer = () => {
        const gx = Number(animator._lastPointerX) || 0;
        const gy = Number(animator._lastPointerY) || 0;
        if (gx || gy) {
          lastMouseX = gx;
          lastMouseY = gy;
          return;
        }
        lastMouseX = Math.floor((window.innerWidth || 0) * 0.5);
        lastMouseY = Math.floor((window.innerHeight || 0) * 0.5);
      };
      seedFromGlobalPointer();
      if (elFxInteractionModal) elFxInteractionModal.style.position = "absolute";
      heldFloat.style.position = "absolute";
      if (elFxInteractionModal) elFxInteractionModal.appendChild(heldFloat);
      let heldFloatRaf = 0;
      const syncPointerFromGlobalTrack = () => {
        const gx = Number(animator._lastPointerX);
        const gy = Number(animator._lastPointerY);
        if (Number.isFinite(gx) && Number.isFinite(gy) && (gx || gy)) {
          lastMouseX = gx;
          lastMouseY = gy;
          return true;
        }
        return false;
      };
      const onMove = (ev) => {
        if (!syncPointerFromEvent(ev) && !syncPointerFromGlobalTrack()) seedFromGlobalPointer();
        positionHeldFloat();
      };
      const tickHeldFloat = () => {
        if (!heldFloat.isConnected) return;
        if (!syncPointerFromGlobalTrack()) seedFromGlobalPointer();
        positionHeldFloat();
        heldFloatRaf = requestAnimationFrame(tickHeldFloat);
      };
      window.addEventListener("pointermove", onMove, { passive: true, capture: true });
      window.addEventListener("mousemove", onMove, { passive: true, capture: true });
      heldFloatRaf = requestAnimationFrame(tickHeldFloat);
      // hand cleanup hooks to openInteractionModal after it mounts this content
      wrap.__cleanupFn = () => {
        window.removeEventListener("pointermove", onMove, { capture: true });
        window.removeEventListener("mousemove", onMove, { capture: true });
        if (heldFloatRaf) cancelAnimationFrame(heldFloatRaf);
        heldFloat.remove();
      };
      // prevent losing held stack by clicking backdrop
      wrap.__blockCloseFn = () => !!held;

      // initial paint
      refreshAllButtons();
      requestAnimationFrame(() => {
        seedFromGlobalPointer();
        positionHeldFloat();
      });
      return wrap;
    }

    function openContainerModal(o) {
      if (!o) return;
      const slots = getOrCreateContainerSlots(o, 18);
      openInteractionModal(buildContainerModal(o, slots));
      saveContainerSlots(o, slots);
    }

    function renderFxInteractionMenu() {
      if (!elFxInteractionMenu || !elFxInteractionList) return;
      const open = elFxFullscreen.classList.contains("open");
      const items = Array.isArray(animator._interactionNearbyActions) ? animator._interactionNearbyActions : [];
      const visible = open && items.length > 0;
      elFxInteractionMenu.hidden = !visible;
      if (!visible) {
        elFxInteractionList.innerHTML = "";
        animator._interactionMenuListSignature = "";
        return;
      }
      const listSig = items.map((entry) => `${entry.action.kind}:${entry.objectKey}`).join("|");
      if (listSig !== animator._interactionMenuListSignature) {
        animator._interactionMenuListSignature = listSig;
        elFxInteractionList.innerHTML = "";
        for (let i = 0; i < items.length; i++) {
          const entry = items[i];
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fx-interaction-btn";
          btn.dataset.interactionIndex = String(i);
          btn.textContent = entry.action.label || "交互";
          const sub = document.createElement("small");
          sub.textContent = `距离 ${Math.max(0, entry.gap).toFixed(2)} tile`;
          btn.appendChild(sub);
          elFxInteractionList.appendChild(btn);
        }
      } else {
        const buttons = elFxInteractionList.querySelectorAll(".fx-interaction-btn");
        buttons.forEach((btn, i) => {
          btn.dataset.interactionIndex = String(i);
          const entry = items[i];
          if (!entry) return;
          const sub = btn.querySelector("small");
          if (sub) sub.textContent = `距离 ${Math.max(0, entry.gap).toFixed(2)} tile`;
        });
      }
    }

    function refreshNearbyInteractions(canvas = getLogicCanvas()) {
      const items = collectNearbyInteractionActions(canvas);
      animator._interactionNearbyActions = items;
      if (!items.length) {
        animator._interactionDetailText = "";
        closeInteractionModal();
      }
      renderFxInteractionMenu();
    }

    function resolveInteriorMove(fromX, fromY, toX, toY) {
      const state = getActiveInteriorState();
      const interior = state && state.data;
      if (!interior) return { x: fromX, y: fromY };
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dist = Math.hypot(dx, dy);
      if (!(dist > 1e-9)) return { x: fromX, y: fromY };
      const steps = Math.max(1, Math.ceil(dist / 0.2));
      const sx = dx / steps;
      const sy = dy / steps;
      let curX = fromX;
      let curY = fromY;
      for (let i = 0; i < steps; i++) {
        const nextX = curX + sx;
        const nextY = curY + sy;
        if (isInteriorWalkablePoint(interior, nextX, nextY)) {
          curX = nextX;
          curY = nextY;
          continue;
        }
        if (isInteriorWalkablePoint(interior, nextX, curY)) {
          curX = nextX;
          continue;
        }
        if (isInteriorWalkablePoint(interior, curX, nextY)) {
          curY = nextY;
          continue;
        }
        break;
      }
      return { x: curX, y: curY };
    }

    function resolvePlayerMoveWithCollision(fromX, fromY, toX, toY, canvas = getLogicCanvas(), nowTs = 0) {
      if (animator.activeSceneKind === "interior") return resolveInteriorMove(fromX, fromY, toX, toY);
      if (!animator.enablePlayerCollision) return { x: toX, y: toY };
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dist = Math.hypot(dx, dy);
      if (!(dist > 1e-9)) return { x: fromX, y: fromY };
      const pr = getPlayerCollisionRadiusWorld(canvas);
      animator._collisionLastCheckTs = nowTs > 0 ? nowTs : performance.now();
      animator._collisionUncheckedTravel = 0;
      animator._collisionDebugLastBlocker = null;

      // 关键：把单帧位移拆成小步，避免斜向输入时“一步跨过”薄碰撞边界
      const maxStep = Math.max(0.35, Math.min(1.2, pr * 0.3));
      const steps = Math.max(1, Math.ceil(dist / maxStep));
      const sx = dx / steps;
      const sy = dy / steps;

      let curX = fromX;
      let curY = fromY;
      for (let i = 0; i < steps; i++) {
        const nextX = curX + sx;
        const nextY = curY + sy;
        const directBlocker = getPlayerCollisionBlockerAt(nextX, nextY, canvas);
        if (!directBlocker) {
          curX = nextX;
          curY = nextY;
          continue;
        }
        // 优先保留一个轴，形成沿障碍滑动
        const xOnlyBlocker = getPlayerCollisionBlockerAt(nextX, curY, canvas);
        if (!xOnlyBlocker) {
          curX = nextX;
          animator._collisionDebugLastBlocker = {
            phase: "direct",
            testWX: nextX,
            testWY: nextY,
            blocker: directBlocker,
          };
          continue;
        }
        const yOnlyBlocker = getPlayerCollisionBlockerAt(curX, nextY, canvas);
        if (!yOnlyBlocker) {
          curY = nextY;
          animator._collisionDebugLastBlocker = {
            phase: "x-only",
            testWX: nextX,
            testWY: curY,
            blocker: xOnlyBlocker,
          };
          continue;
        }
        animator._collisionDebugLastBlocker = {
          phase: "locked",
          testWX: nextX,
          testWY: nextY,
          blocker: directBlocker,
          xOnlyBlocker,
          yOnlyBlocker,
        };
        break;
      }
      return { x: curX, y: curY };
    }

    function collisionDebugHullFromPolys(polys) {
      const points = [];
      for (const poly of (polys || [])) {
        if (!poly || poly.length < 3) continue;
        for (const p of poly) points.push(p);
      }
      return convexHull2D(points);
    }

    function collisionDebugPolysToDraw(polys, maxPolys = 24) {
      const valid = (polys || []).filter((poly) => poly && poly.length >= 3);
      if (valid.length <= maxPolys) return valid;
      return collisionDebugHullFromPolys(valid).length ? [collisionDebugHullFromPolys(valid)] : [];
    }

    function drawProjectedWorldSegments(ctx, canvas, segments) {
      if (!segments || !segments.length) return null;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      ctx.beginPath();
      for (const seg of segments) {
        if (!seg || seg.length < 2) continue;
        const a = projectWorldToScreen(seg[0].x, seg[0].y, canvas);
        const b = projectWorldToScreen(seg[1].x, seg[1].y, canvas);
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        minX = Math.min(minX, a.sx, b.sx);
        minY = Math.min(minY, a.sy, b.sy);
        maxX = Math.max(maxX, a.sx, b.sx);
        maxY = Math.max(maxY, a.sy, b.sy);
      }
      ctx.stroke();
      if (!Number.isFinite(minX)) return null;
      return { x: (minX + maxX) * 0.5, y: (minY + maxY) * 0.5 };
    }

    function drawProjectedWorldPolygon(ctx, canvas, poly, fillStyle) {
      if (!poly || poly.length < 3) return null;
      let cx = 0;
      let cy = 0;
      ctx.beginPath();
      for (let i = 0; i < poly.length; i++) {
        const sp = projectWorldToScreen(poly[i].x, poly[i].y, canvas);
        if (i === 0) ctx.moveTo(sp.sx, sp.sy);
        else ctx.lineTo(sp.sx, sp.sy);
        cx += sp.sx;
        cy += sp.sy;
      }
      ctx.closePath();
      if (fillStyle) {
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.restore();
      }
      ctx.stroke();
      return { x: cx / poly.length, y: cy / poly.length };
    }

    function drawCollisionDebugOverlay(ctx, canvas) {
      if (!animator.showCollisionDebug) return;
      ensureSceneObjects();
      const objs = animator._sceneObjects || [];
      ctx.save();
      ctx.font = "12px VT323, monospace";
      ctx.textBaseline = "top";

      for (const o of objs) {
        const p = projectWorldToScreen(o.wx, o.wy, canvas);
        if (p.scale <= 0) continue;
        ctx.strokeStyle = o.model ? "rgba(255,86,86,0.95)" : "rgba(86,200,255,0.95)";
        ctx.lineWidth = 1.5;
        let labelX = p.sx;
        let labelY = p.sy;
        let tag = `${o.model ? "B" : "T"}`;
        if (o.model) {
          const polys = getModelCollisionPolygonsWorld(o);
          if (polys.length) {
            const center = drawProjectedWorldSegments(ctx, canvas, o._collisionDebugSegmentsWorld);
            if (center) {
              labelX = center.x;
              labelY = center.y;
            }
            tag += ` edge`;
          }
        } else {
          const rWorld = objectCollisionRadiusWorld(o);
          const rPx = Math.max(2, rWorld * p.scale);
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, rPx, 0, Math.PI * 2);
          ctx.stroke();
          labelY -= rPx;
          tag += ` r=${rWorld.toFixed(1)}`;
        }
        ctx.fillStyle = "rgba(8,12,16,0.72)";
        const tw = ctx.measureText(tag).width + 6;
        ctx.fillRect(labelX - tw * 0.5, labelY - 16, tw, 12);
        ctx.fillStyle = "#e6edf3";
        ctx.fillText(tag, labelX - tw * 0.5 + 3, labelY - 15);
      }

      const pp = projectWorldToScreen(animator.worldX, animator.worldY, canvas);
      if (pp.scale > 0) {
        const prWorld = getPlayerCollisionRadiusWorld(canvas);
        const view = getOrbitViewFrame(canvas);
        const pxR = projectWorldToScreen(
          animator.worldX + view.rightX * prWorld,
          animator.worldY + view.rightY * prWorld,
          canvas
        );
        const pxT = projectWorldToScreen(
          animator.worldX + view.towardCamX * prWorld,
          animator.worldY + view.towardCamY * prWorld,
          canvas
        );
        const axisRx = Math.max(2, Math.hypot(pxR.sx - pp.sx, pxR.sy - pp.sy));
        const axisRy = Math.max(1.5, Math.hypot(pxT.sx - pp.sx, pxT.sy - pp.sy));
        const axisRot = Math.atan2(pxR.sy - pp.sy, pxR.sx - pp.sx);
        ctx.strokeStyle = "rgba(86,255,120,0.98)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(pp.sx, pp.sy, axisRx, axisRy, axisRot, 0, Math.PI * 2);
        ctx.stroke();
        const tag = `P r=${prWorld.toFixed(1)} auto=${animator.playerCollisionAutoFromFoot ? "on" : "off"}`;
        const tw = ctx.measureText(tag).width + 6;
        ctx.fillStyle = "rgba(8,12,16,0.78)";
        ctx.fillRect(pp.sx - tw * 0.5, pp.sy + axisRx + 4, tw, 12);
        ctx.fillStyle = "#f0fff4";
        ctx.fillText(tag, pp.sx - tw * 0.5 + 3, pp.sy + axisRx + 5);
      }

      const hitInfo = animator._collisionDebugLastBlocker;
      const blocker = hitInfo && (hitInfo.blocker || hitInfo.xOnlyBlocker || hitInfo.yOnlyBlocker);
      if (blocker && blocker.object) {
        const b = blocker.object;
        const cp = projectWorldToScreen(animator.worldX, animator.worldY, canvas);
        const bp = projectWorldToScreen(b.wx, b.wy, canvas);
        if (cp.scale > 0 && bp.scale > 0) {
          ctx.strokeStyle = "rgba(255,32,170,0.98)";
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(cp.sx, cp.sy);
          ctx.lineTo(bp.sx, bp.sy);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255,32,170,0.98)";
        ctx.lineWidth = 2.2;
        if (blocker.shape === "polygons" && Array.isArray(blocker.polys) && blocker.polys.length) {
          getModelCollisionPolygonsWorld(blocker.object);
          drawProjectedWorldSegments(ctx, canvas, blocker.object._collisionDebugSegmentsWorld);
        } else {
          const p = projectWorldToScreen(b.wx, b.wy, canvas);
          const rr = Math.max(3, (Number(blocker.objectRadius) || objectCollisionRadiusWorld(b)) * p.scale);
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, rr, 0, Math.PI * 2);
          ctx.stroke();
        }
        const bTag = `BLOCK ${hitInfo.phase || "?"} ${blocker.objectType || "?"}#${b.id || "?"}`;
        const p = projectWorldToScreen(b.wx, b.wy, canvas);
        const bw = ctx.measureText(bTag).width + 8;
        ctx.fillStyle = "rgba(52, 4, 36, 0.82)";
        ctx.fillRect(p.sx - bw * 0.5, p.sy - 30, bw, 13);
        ctx.fillStyle = "#ffd5f0";
        ctx.fillText(bTag, p.sx - bw * 0.5 + 4, p.sy - 29);
      }
      ctx.restore();
    }

    function easeOutCubic(t) {
      const u = 1 - clamp01(t);
      return 1 - u * u * u;
    }

    function getBuildingRenderSink(o) {
      if (!o || !o.model) return { hidden: false, sinkT: 0, sinkModelY: 0, edgeTouched: false };
      getModelCollisionPolygonsWorld(o);
      const bb = o._collisionPolyBBox;
      const scale = Number.isFinite(o.scale) && o.scale > 0 ? o.scale : 1;
      const H = Math.max(1, Number(o.model.H) || 1);
      const radius = Math.max(10, Number(animator.renderRadiusWorld) || 1500);
      const transition = Math.max(1, Number(animator.buildingSinkTransitionWorld) || 25);
      const px = animator.worldX;
      const py = animator.worldY;
      const centerDist = Math.hypot((Number(o.wx) || 0) - px, (Number(o.wy) || 0) - py);
      let nearestDist = 0;
      let farthestDist = 0;
      if (bb) {
        const nx = Math.max(bb.minX, Math.min(px, bb.maxX));
        const ny = Math.max(bb.minY, Math.min(py, bb.maxY));
        nearestDist = Math.hypot(nx - px, ny - py);
        const corners = [
          [bb.minX, bb.minY],
          [bb.maxX, bb.minY],
          [bb.maxX, bb.maxY],
          [bb.minX, bb.maxY],
        ];
        for (const [x, y] of corners) farthestDist = Math.max(farthestDist, Math.hypot(x - px, y - py));
      } else {
        nearestDist = Math.hypot((Number(o.wx) || 0) - px, (Number(o.wy) || 0) - py);
        farthestDist = nearestDist;
      }
      if (nearestDist >= radius + transition) return { hidden: true, sinkT: 1, sinkModelY: H * 1.15, edgeTouched: true };
      if (centerDist <= radius) return { hidden: false, sinkT: 0, sinkModelY: 0, edgeTouched: false };
      // 仅计算整体下沉位移；真正绘制时不做底部裁剪。
      const bboxSpan = Math.max(0, farthestDist - nearestDist);
      // 触边即开始下沉：以最远点越界量驱动，不再被 bbox 尺寸稀释到“整栋出去才明显”。
      const sinkT = clamp01((centerDist - radius) / Math.max(1e-6, transition));
      const sinkWorld = H * scale * 1.15 * easeOutCubic(sinkT);
      return {
        hidden: false,
        sinkT,
        sinkModelY: sinkWorld / Math.max(scale, 1e-6),
        edgeTouched: centerDist >= radius,
      };
    }

    function drawSceneObjects(ctx, canvas, fxMode, actorLayer, renderLayer = "all") {
      ensureSceneObjects();
      backfillSceneBuildingTags();
      const tree = buildTreeSpriteCanvas();
      const nowMs = performance.now();
      // 先按 chunk 收集屏幕附近的候选对象，再按透视深度排序（从远到近：depthKey 大的先画）
      const renderables = animator._sceneRenderables || (animator._sceneRenderables = []);
      renderables.length = 0;
      const objs = getSceneObjectCandidates(canvas);
      const radius = Math.max(10, Number(animator.renderRadiusWorld) || 320);
      const radiusCull2 = (radius + 80) * (radius + 80);
      for (const o of objs) {
        if (animator.buildingEdit && animator.buildingEdit.active && o && o.id === animator.buildingEdit.targetId) {
          // 被编辑的建筑：隐藏实体，仅显示 placement 虚化预览。
          continue;
        }
        const rp = getSceneObjectRenderWorldPos(o, nowMs);
        const owx = Number(rp.wx) || 0;
        const owy = Number(rp.wy) || 0;
        const odx = owx - animator.worldX;
        const ody = owy - animator.worldY;
        const od2 = odx * odx + ody * ody;
        if (o.model) {
          // 建筑下沉有自己的边缘过渡逻辑；不能用“中心点半径”提前硬裁剪，否则会出现突然消失。
          const sink = getBuildingRenderSink(o);
          if (sink.hidden) continue;
          const cutUnder = !!sink.edgeTouched;
          if (renderLayer === "underTilemap" && !cutUnder) continue;
          if (renderLayer === "normal" && cutUnder) continue;
          const ph = projectWorldToScreen(owx, owy, canvas);
          if (ph.sy < animator.horizonY - 4 || ph.sy > canvas.height + 160) continue;
          const approxWorldRadius = Math.max(4, objectCollisionRadiusWorld(o) * 2.2);
          const approxPxRadius = Math.max(24, approxWorldRadius * ph.scale);
          if (ph.sx + approxPxRadius < -80 || ph.sx - approxPxRadius > canvas.width + 80) continue;
          renderables.push({
            kind: "building",
            depthKey: ph.depthKey,
            object: o,
            renderWx: owx,
            renderWy: owy,
            sinkModelY: sink.sinkModelY,
            clipModelY: 0,
          });
          continue;
        }
        if (renderLayer === "underTilemap") continue;
        if (od2 > radiusCull2) continue;
        const dist = Math.sqrt(od2);
        if (dist > Math.max(radius, Number(animator.sceneSpriteCullWorld) || 420)) continue;
        const p = projectWorldToScreen(owx, owy, canvas);
        // 只渲染地平线以下、且屏幕范围内
        if (p.sy < animator.horizonY - 4 || p.sy > canvas.height + 60) continue;
        // worldScale 应该带动场景物体一起变大：去掉过小的上限，只保留安全上限
        const k = Math.min(20, Math.max(0.08, p.scale * 1.15 * o.scale));
        const dw = tree.width * k;
        const dh = tree.height * k;
        const dx = p.sx - dw / 2;
        const dy = p.sy - dh;
        if (dx > canvas.width + 40 || dx + dw < -40) continue;
        const lodFar = Math.max(1, Number(animator.sceneSpriteLodFarWorld) || 220);
        const lodAlpha = dist > lodFar ? Math.max(0.35, 1 - (dist - lodFar) / Math.max(1, radius - lodFar)) : 1;
        renderables.push({ kind: "sprite", depthKey: p.depthKey, object: o, dx, dy, dw, dh, lodAlpha });
      }
      if (Array.isArray(actorLayer && actorLayer.extraRenderables)) {
        for (const item of actorLayer.extraRenderables) {
          if (item && typeof item.draw === "function") insertRenderableByDepthDesc(renderables, item);
        }
      }

      renderables.sort((a, b) => (b.depthKey - a.depthKey));

      const actorDepth = Number(actorLayer && actorLayer.depthKey);
      const actorDraw = renderLayer === "underTilemap"
        ? null
        : (actorLayer && typeof actorLayer.draw === "function" ? actorLayer.draw : null);
      let actorDrawn = false;
      const buildingBatch = [];
      const flushBuildingBatch = () => {
        if (!buildingBatch.length) return;
        if (!drawSceneBuildingBatch(ctx, canvas, fxMode, buildingBatch)) {
          for (const item of buildingBatch) drawSceneRenderable(ctx, canvas, fxMode, tree, item);
        }
        buildingBatch.length = 0;
      };
      const maybeDrawActorBeforeNearer = (nextDepth) => {
        if (actorDrawn || !actorDraw) return;
        // 远 -> 近遍历：当即将绘制的对象已经“更近”时，先把角色插入到当前层。
        if (!Number.isFinite(actorDepth) || nextDepth < actorDepth) {
          flushBuildingBatch();
          actorDraw();
          actorDrawn = true;
        }
      };

      for (const item of renderables) {
        maybeDrawActorBeforeNearer(item.depthKey);
        if (item.kind === "building") {
          buildingBatch.push(item);
          continue;
        }
        flushBuildingBatch();
        drawSceneRenderable(ctx, canvas, fxMode, tree, item);
      }
      flushBuildingBatch();
      maybeDrawActorBeforeNearer(-Infinity);
    }

    function getPlayerOrbitBulletState(canvas, ts) {
      const orbitRadiusWorld = 3;
      const heightWorld = 1;
      const angle = Number(animator.orbitBulletAngle) || 0;
      const wx = animator.worldX + Math.cos(angle) * orbitRadiusWorld;
      const wy = animator.worldY + Math.sin(angle) * orbitRadiusWorld;
      const p = projectWorldToScreen(wx, wy, canvas);
      if (!p || p.scale <= 0) return null;
      return {
        wx,
        wy,
        sx: p.sx,
        sy: p.sy - heightWorld * p.scale,
        depthKey: p.depthKey,
        pixelUnit: Math.max(1, Math.min(4, Math.round(p.scale * 0.42))),
      };
    }

    function isResourceObject(o) {
      if (!o) return false;
      const tags = normalizeSemanticTags(o.tags, getObjectPromptLikeText(o));
      return tags.includes("resource");
    }

    function getResourceDropKey(o) {
      const mcType = String(o?.properties?.mcResourceType || "").trim().toLowerCase();
      if (mcType) return `resource:${mcType}`;
      const assetId = String(o?.asset?.id || "").trim().toLowerCase();
      if (assetId) return `resource:${assetId}`;
      const name = getObjectDisplayNameForInteraction(o).trim().toLowerCase();
      return `resource:${name || "unknown"}`;
    }

    function ensureDropAgentStore() {
      if (!animator._sceneExtensions || typeof animator._sceneExtensions !== "object") {
        animator._sceneExtensions = {};
      }
      if (!animator._sceneExtensions.itemAgent || typeof animator._sceneExtensions.itemAgent !== "object") {
        animator._sceneExtensions.itemAgent = { version: 1, resourceDrops: {}, itemsByName: {} };
      }
      const root = animator._sceneExtensions.itemAgent;
      if (!root.resourceDrops || typeof root.resourceDrops !== "object") root.resourceDrops = {};
      if (!root.itemsByName || typeof root.itemsByName !== "object") root.itemsByName = {};
      return root;
    }

    function getDropRecordForObject(o) {
      const root = ensureDropAgentStore();
      const key = getResourceDropKey(o);
      if (!root.resourceDrops[key] || typeof root.resourceDrops[key] !== "object") {
        root.resourceDrops[key] = {
          key,
          resourceName: getObjectDisplayNameForInteraction(o),
          status: "idle",
          drops: [],
          updatedAt: Date.now(),
        };
      }
      return root.resourceDrops[key];
    }

    function normalizeDropItemShape(item) {
      const name = String(item?.name || "").trim();
      if (!name) return null;
      return {
        name,
        icon: typeof item?.icon === "string" ? item.icon : "",
        description: String(item?.description || "资源掉落物。"),
        tags: Array.isArray(item?.tags) ? item.tags.map((t) => String(t || "").trim()).filter(Boolean) : [],
        tagFeatures: Array.isArray(item?.tagFeatures) ? item.tagFeatures : [],
      };
    }

    function normalizeDropEntries(rawDrops) {
      const out = [];
      const arr = Array.isArray(rawDrops) ? rawDrops : [];
      for (const d of arr) {
        const item = normalizeDropItemShape(d?.item || d);
        if (!item) continue;
        const min = Math.max(0, Math.floor(Number(d?.min) || 0));
        const max = Math.max(min, Math.floor(Number(d?.max) || 3));
        const weight = Math.max(0, Number(d?.weight) || 1);
        out.push({ item, min, max, weight });
      }
      return out;
    }

    async function requestResourceDropsFromLlm(resourceName, tags) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) throw new Error("缺少 LLM 接口配置");
      const prompt = [
        `这是一个rpg游戏里的「${resourceName}」，生成他的可能掉落物至少1种。`,
        "只输出 JSON，不要其他文字。",
        "格式：",
        "{\"drops\":[{\"item\":{\"name\":\"\",\"icon\":\"\",\"description\":\"\",\"tags\":[],\"tagFeatures\":[{\"tag\":\"\",\"details\":{}}]},\"min\":0,\"max\":3,\"weight\":1}]}",
        "要求：",
        "1) drops 至少 1 项；2) item.name 必填；3) icon 允许为空字符串；4) min/max 需为非负整数。",
        `参考标签：${Array.isArray(tags) ? tags.join(",") : ""}`,
      ].join("\n");
      const res = await fetch(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model: RESOURCE_DROP_MODEL,
          temperature: 0.3,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`掉落推理 HTTP ${res.status}: ${raw.slice(0, 240)}`);
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("掉落推理响应不是 JSON");
      }
      const text = stripJsonFence(extractChatContentText(data?.choices?.[0]?.message?.content || ""));
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = /\{[\s\S]*\}/.exec(text);
        if (m) parsed = JSON.parse(m[0]);
      }
      const drops = normalizeDropEntries(parsed?.drops);
      if (!drops.length) throw new Error("掉落推理为空");
      return drops;
    }

    async function ensureItemIconAsync(itemName) {
      const root = ensureDropAgentStore();
      const keyName = String(itemName || "").trim();
      if (!keyName) return;
      const rec = root.itemsByName[keyName];
      if (!rec || rec.icon) return;
      const now = Date.now();
      const nextRetryAt = Number(rec.iconNextRetryAt) || 0;
      if (rec.iconStatus === "error" && nextRetryAt > now) return;
      if (_resourceIconRequestByName.has(keyName)) return _resourceIconRequestByName.get(keyName);
      const task = (async () => {
        const arkUrl = String(CONFIG.arkImageApiUrl || "").trim() || "https://ark.cn-beijing.volces.com/api/v3/images/generations";
        const arkKey = String(CONFIG.arkApiKey || "").trim();
        const arkModel = String(CONFIG.arkImageModel || "").trim() || RESOURCE_DROP_ICON_ARK_MODEL;
        if (!arkUrl || !arkKey) return;
        try {
          rec.iconStatus = "running";
          rec.iconError = "";
          rec.iconNextRetryAt = 0;
          let icon = "";
          let lastErr = "";
          try {
            const res = await fetch(arkUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + arkKey,
              },
              body: JSON.stringify({
                model: arkModel,
                prompt: `像素风rpg物品图标，单个物体居中：${keyName}、白色纯底。不要画棋盘格、画布边框、阴影底板、水印、文字。`,
                sequential_image_generation: "disabled",
                response_format: "url",
                size: "2K",
                stream: false,
                watermark: true,
              }),
            });
            const text = await res.text();
            if (!res.ok) {
              lastErr = `ark http ${res.status}`;
              throw new Error(text.slice(0, 240));
            }
            let payload = null;
            try { payload = JSON.parse(text); } catch {}
            icon = String(payload?.data?.[0]?.url || payload?.data?.url || "");
            if (!icon) {
              lastErr = "ark icon empty";
              throw new Error(text.slice(0, 240));
            }
          } catch (err) {
            lastErr = String(err?.message || err || "ark icon generation failed");
          }

          if (!icon) throw new Error(lastErr || "icon empty");
          rec.icon = await prepareGeneratedItemIcon(icon);
          rec.iconStatus = "ok";
          rec.iconFailureCount = 0;
          rec.iconNextRetryAt = 0;
          const sceneId = sanitizeSceneId((fxSceneId && fxSceneId.value) || "") || DEFAULT_SCENE_ID;
          void saveActiveScene(sceneId).catch(() => {});
          syncFxHotbarUi();
          renderFxCodexPanel();
        } catch (err) {
          const failures = Math.max(1, Math.floor(Number(rec.iconFailureCount) || 0) + 1);
          const backoffMs = Math.min(ITEM_ICON_RETRY_MAX_MS, ITEM_ICON_RETRY_BASE_MS * Math.pow(2, failures - 1));
          rec.iconFailureCount = failures;
          rec.iconStatus = "error";
          rec.iconError = String(err?.message || err || "icon generation failed");
          rec.iconNextRetryAt = Date.now() + backoffMs;
          renderFxCodexPanel();
        }
      })();
      _resourceIconRequestByName.set(keyName, task);
      try {
        await task;
      } finally {
        _resourceIconRequestByName.delete(keyName);
      }
    }

    async function ensureResourceDropSpecAsync(o) {
      if (!o) return;
      const record = getDropRecordForObject(o);
      if (record.status === "ready" && Array.isArray(record.drops) && record.drops.length) return;
      const key = String(record.key || "");
      if (_resourceDropRequestByKey.has(key)) return _resourceDropRequestByKey.get(key);
      const task = (async () => {
        record.status = "running";
        record.updatedAt = Date.now();
        renderFxCodexPanel();
        try {
          const tags = normalizeSemanticTags(o.tags, getObjectPromptLikeText(o));
          const drops = await requestResourceDropsFromLlm(record.resourceName || getObjectDisplayNameForInteraction(o), tags);
          const root = ensureDropAgentStore();
          record.drops = drops.map((d) => {
            const itemName = d.item.name;
            if (!root.itemsByName[itemName]) {
              root.itemsByName[itemName] = Object.assign({ iconStatus: d.item.icon ? "ok" : "idle" }, d.item);
            } else {
              const keep = root.itemsByName[itemName];
              keep.description = keep.description || d.item.description;
              if (!Array.isArray(keep.tags) || !keep.tags.length) keep.tags = d.item.tags || [];
              if (!Array.isArray(keep.tagFeatures) || !keep.tagFeatures.length) keep.tagFeatures = d.item.tagFeatures || [];
              if (!keep.icon && d.item.icon) keep.icon = d.item.icon;
            }
            return { itemName, min: d.min, max: d.max, weight: d.weight };
          });
          record.status = "ready";
          record.error = "";
          record.updatedAt = Date.now();
          const sceneId = sanitizeSceneId((fxSceneId && fxSceneId.value) || "") || DEFAULT_SCENE_ID;
          void saveActiveScene(sceneId).catch(() => {});
          for (const entry of record.drops) {
            void ensureItemIconAsync(entry.itemName);
          }
          renderFxCodexPanel();
        } catch (err) {
          record.status = "error";
          record.error = String(err?.message || err || "drop generation failed");
          record.updatedAt = Date.now();
          renderFxCodexPanel();
        }
      })();
      _resourceDropRequestByKey.set(key, task);
      try {
        await task;
      } finally {
        _resourceDropRequestByKey.delete(key);
      }
    }

    function addItemToHotbarByName(itemName) {
      const root = ensureDropAgentStore();
      const rec = root.itemsByName[String(itemName || "").trim()];
      if (!rec) return false;
      const slots = animator.hotbarSlots || [];
      const existing = slots.find((s) => s && String(s.name || "") === rec.name);
      if (existing) {
        existing.count = Math.max(1, Number(existing.count) || 1) + 1;
        if (!existing.icon && rec.icon) existing.icon = rec.icon;
        persistHotbarState();
        syncFxHotbarUi();
        renderFxCodexPanel();
        return true;
      }
      const idx = slots.findIndex((s) => !s);
      if (idx < 0) return false;
      slots[idx] = {
        name: rec.name,
        icon: rec.icon || "",
        description: rec.description || "",
        tags: Array.isArray(rec.tags) ? rec.tags.slice() : [],
        count: 1,
      };
      persistHotbarState();
      syncFxHotbarUi();
      renderFxCodexPanel();
      return true;
    }

    function dropResourceLootIntoHotbar(o) {
      const record = getDropRecordForObject(o);
      if (record.status !== "ready" || !Array.isArray(record.drops) || !record.drops.length) return;
      for (const d of record.drops) {
        const min = Math.max(0, Math.floor(Number(d.min) || 0));
        const max = Math.max(min, Math.floor(Number(d.max) || 3));
        const n = min + Math.floor(Math.random() * (max - min + 1));
        for (let i = 0; i < n; i++) addItemToHotbarByName(d.itemName);
      }
    }

    function toggleFxCodex(forceOpen = null) {
      if (typeof forceOpen === "boolean") animator.codexOpen = forceOpen;
      else animator.codexOpen = !animator.codexOpen;
      renderFxCodexPanel();
    }

    function clearResourceCacheAndItems() {
      const root = ensureDropAgentStore();
      root.resourceDrops = {};
      root.itemsByName = {};
      _resourceDropRequestByKey.clear();
      _resourceIconRequestByName.clear();
      const slots = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
      for (let i = 0; i < slots.length; i++) slots[i] = null;
      persistHotbarState();
      syncFxHotbarUi();
      renderFxCodexPanel();
    }

    function renderFxCodexPanel() {
      if (!elFxCodexPanel || !elFxCodexBody) return;
      const root = ensureDropAgentStore();
      const dropEntries = Object.values(root.resourceDrops || {});
      const itemEntries = Object.values(root.itemsByName || {});
      const show = elFxFullscreen.classList.contains("open") && !!animator.codexOpen;
      if (fxBtnCodex) fxBtnCodex.classList.toggle("is-active", show);
      elFxCodexPanel.hidden = !show;
      if (!show) return;
      if (!dropEntries.length && !itemEntries.length) {
        elFxCodexBody.innerHTML = `<div class="fx-codex-empty">暂无图鉴记录</div>`;
        return;
      }
      const parts = [];
      if (dropEntries.length) {
        parts.push(`<div class="fx-codex-meta">资源掉落缓存 ${dropEntries.length}</div>`);
        for (const rec of dropEntries) {
          const drops = Array.isArray(rec?.drops) ? rec.drops : [];
          const dropNames = drops.slice(0, 3).map((d) => d.itemName).join(" / ");
          parts.push(
            `<div class="fx-codex-item"><strong>${String(rec?.resourceName || rec?.key || "未知资源")}</strong>` +
            `<div class="fx-codex-meta">状态: ${String(rec?.status || "idle")} · 候选: ${drops.length}</div>` +
            `<div>${dropNames || "（暂无）"}</div></div>`
          );
        }
      }
      if (itemEntries.length) {
        parts.push(`<div class="fx-codex-meta">物品图标状态 ${itemEntries.length}</div>`);
        for (const item of itemEntries.slice(0, 24)) {
          const iconState = item?.icon ? "ok" : String(item?.iconStatus || "idle");
          parts.push(
            `<div class="fx-codex-item"><strong>${String(item?.name || "未命名物品")}</strong>` +
            `<div class="fx-codex-meta">icon: ${iconState}</div></div>`
          );
        }
      }
      elFxCodexBody.innerHTML = parts.join("");
    }

    function getResourceCombatState(o) {
      if (!o) return null;
      if (!o.properties || typeof o.properties !== "object") o.properties = {};
      if (!o.properties.resourceCombat || typeof o.properties.resourceCombat !== "object") {
        const baseHp = Math.max(1, Number(animator.resourceDefaultHp) || 10);
        o.properties.resourceCombat = { hp: baseHp, maxHp: baseHp };
      }
      const st = o.properties.resourceCombat;
      if (!(Number(st.maxHp) > 0)) st.maxHp = Math.max(1, Number(animator.resourceDefaultHp) || 10);
      if (!(Number(st.hp) >= 0)) st.hp = st.maxHp;
      if (!(Number(st.hitCooldownMs) > 0)) st.hitCooldownMs = Math.max(30, Number(animator.resourceHitCooldownMs) || 120);
      return st;
    }

    function getSceneObjectRenderWorldPos(o, nowMs = performance.now()) {
      const wx = Number(o?.wx) || 0;
      const wy = Number(o?.wy) || 0;
      const st = o?.properties?.resourceCombat;
      if (!st) return { wx, wy };
      const until = Number(st.shakeUntilMs) || 0;
      if (!(until > nowMs)) return { wx, wy };
      const amp = Math.max(0, Number(st.shakeAmpWorld) || 0);
      if (!(amp > 0)) return { wx, wy };
      const left = Math.max(0, until - nowMs);
      const total = Math.max(1, Number(st.shakeDurationMs) || 120);
      const t = 1 - left / total;
      const k = Math.max(0, 1 - t);
      const wave = Math.sin(t * Math.PI * 6);
      const nx = Number(st.shakeDirX) || 0;
      const ny = Number(st.shakeDirY) || 0;
      return {
        wx: wx + nx * amp * wave * k,
        wy: wy + ny * amp * wave * k,
      };
    }

    function bounceOrbitBullet(nowMs = performance.now()) {
      const cd = Math.max(0, Number(animator.orbitBulletBounceCooldownMs) || 0);
      const last = Number(animator.orbitBulletLastBounceAtMs) || 0;
      if (nowMs - last < cd) return false;
      animator.orbitBulletDirection = -Math.sign(Number(animator.orbitBulletDirection) || 1);
      if (!Number.isFinite(animator.orbitBulletDirection) || animator.orbitBulletDirection === 0) {
        animator.orbitBulletDirection = -1;
      }
      animator.orbitBulletLastBounceAtMs = nowMs;
      return true;
    }

    function updateOrbitBulletCombat(ts, canvas, bullet) {
      if (!bullet) return;
      ensureSceneObjects();
      const br = Math.max(0.1, Number(animator.orbitBulletCollisionRadiusWorld) || 0.55);
      const objs = animator._sceneObjects || [];
      let touchedNonPlayer = false;
      for (const o of objs) {
        if (!o) continue;
        let collided = false;
        if (o.model) {
          const polys = getModelCollisionPolygonsWorld(o);
          if (!polys || !polys.length) continue;
          if (circleOutsideBBox2D(bullet.wx, bullet.wy, br, o._collisionPolyBBox)) continue;
          collided = circleIntersectsCollisionPolygons2D(bullet.wx, bullet.wy, br, polys);
        } else {
          const or = Math.max(0.1, objectCollisionRadiusWorld(o));
          const dx = bullet.wx - (Number(o.wx) || 0);
          const dy = bullet.wy - (Number(o.wy) || 0);
          const rr = br + or;
          collided = (dx * dx + dy * dy) <= rr * rr;
        }
        if (!collided) continue;
        touchedNonPlayer = true;
        if (!isResourceObject(o)) continue;
        const st = getResourceCombatState(o);
        if (!st) continue;
        const hitCd = Math.max(30, Number(st.hitCooldownMs) || 120);
        const lastHit = Number(st.lastHitAtMs) || 0;
        if (ts - lastHit < hitCd) continue;
        st.lastHitAtMs = ts;
        const dropRec = getDropRecordForObject(o);
        if (dropRec.status !== "ready") {
          void ensureResourceDropSpecAsync(o);
        }
        const dmg = Math.max(1, Number(animator.orbitBulletDamage) || 2);
        st.hp = Math.max(0, (Number(st.hp) || 0) - dmg);
        const dx = (Number(o.wx) || 0) - bullet.wx;
        const dy = (Number(o.wy) || 0) - bullet.wy;
        const len = Math.hypot(dx, dy) || 1;
        st.shakeDirX = dx / len;
        st.shakeDirY = dy / len;
        st.shakeDurationMs = 120;
        st.shakeAmpWorld = 0.65;
        st.shakeUntilMs = ts + st.shakeDurationMs;
        if (st.hp <= 0) {
          // 掉落结构未就绪前，资源不会被摧毁。
          if (dropRec.status !== "ready" || !Array.isArray(dropRec.drops) || !dropRec.drops.length) {
            st.hp = 1;
            continue;
          }
          dropResourceLootIntoHotbar(o);
          animator._sceneObjects = (animator._sceneObjects || []).filter((it) => it !== o);
          markSceneObjectsDirty();
          invalidateSceneLightingBake();
          const sceneId = sanitizeSceneId((fxSceneId && fxSceneId.value) || "") || DEFAULT_SCENE_ID;
          void saveActiveScene(sceneId).catch(() => {});
        }
      }
      if (touchedNonPlayer) bounceOrbitBullet(ts);
    }

    function drawPixelOrbitBullet(ctx, bullet) {
      if (!bullet) return;
      const u = bullet.pixelUnit;
      const cx = Math.round(bullet.sx / u) * u;
      const cy = Math.round(bullet.sy / u) * u;
      const aura = [
        "000111000",
        "001222100",
        "012333210",
        "123444321",
        "123454321",
        "123444321",
        "012333210",
        "001222100",
        "000111000",
      ];
      const colors = [
        null,
        "rgba(52, 168, 255, 0.16)",
        "rgba(42, 184, 255, 0.28)",
        "rgba(40, 156, 255, 0.62)",
        "rgba(98, 216, 255, 0.9)",
        "rgba(231, 252, 255, 1)",
      ];
      // 小球底部投影（地面接触反馈）
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + u * 4.3, Math.max(2, u * 2.2), Math.max(1, u * 1.3), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "lighter";
      for (let y = 0; y < aura.length; y++) {
        for (let x = 0; x < aura[y].length; x++) {
          const v = Number(aura[y][x]);
          if (!v) continue;
          ctx.fillStyle = colors[v];
          ctx.fillRect(cx + (x - 4) * u, cy + (y - 4) * u, u, u);
        }
      }
      ctx.restore();
    }

    function clearAnimatorStage(ctx, canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
    }

    function smoothstep01(t) {
      const u = clamp01(t);
      return u * u * (3 - 2 * u);
    }

    /**
     * 焦平面 z 区间：以当前帧「地平线上方可见扫描线」上的 z_min～z_max 为标尺，
     * focusHalf / fade 为相对该跨度的比例（与 projectWorldToScreen 的 depthKey 同源）。
     * 避免用「屏上很大一段像素」去取样 z 却把整屏都落在焦内、只剩物体层 copy 出一块模糊。
     */
    function getTiltShiftCocBands(depthFrame, focusCenter, horizon, sourceH, focusHalfRatio, fadeRatio) {
      const y0 = Math.max(0, Math.min(sourceH - 1, Math.floor(horizon) + 1));
      const y1 = sourceH;
      let zMin = Infinity;
      let zMax = -Infinity;
      const step = Math.max(2, Math.ceil((y1 - y0) / 56));
      for (let yy = y0; yy <= y1; yy += step) {
        const z = depthFrame.solveZForScreenY(yy + 0.5);
        if (Number.isFinite(z)) {
          zMin = Math.min(zMin, z);
          zMax = Math.max(zMax, z);
        }
      }
      const fallbackZ = depthFrame.solveZForScreenY(focusCenter);
      if (!Number.isFinite(zMin) || !Number.isFinite(zMax) || !(zMax > zMin)) {
        zMin = fallbackZ - 50;
        zMax = fallbackZ + 50;
      }
      const span = Math.max(1e-2, zMax - zMin);
      const halfFrac = clampNumber(Number(focusHalfRatio) || 0.12, 0.02, 0.48);
      const fadeFrac = clampNumber(Number(fadeRatio) || 0.18, 0.02, 0.48);
      const zHalf = span * halfFrac * 0.5;
      const zFade = span * fadeFrac * 0.5;
      const focusZ = Number.isFinite(fallbackZ) ? fallbackZ : depthFrame.focusZ;
      const farFocusZ = focusZ - zHalf;
      const nearFocusZ = focusZ + zHalf;
      const farFullZ = farFocusZ - zFade;
      const nearFullZ = nearFocusZ + zFade;
      return {
        focusZ,
        nearFocusZ,
        farFocusZ,
        nearFullZ,
        farFullZ,
        nearDenom: Math.max(1e-4, nearFullZ - nearFocusZ),
        farDenom: Math.max(1e-4, farFocusZ - farFullZ),
      };
    }

    function tiltShiftAlphaForDepth(z, bands) {
      if (!Number.isFinite(z) || !bands) return 1;
      // 远景（z 小于焦带远侧）：屏上方模糊；近景（z 大于焦带近侧）：屏下方模糊。
      if (z < bands.farFocusZ) {
        return smoothstep01((bands.farFocusZ - z) / bands.farDenom);
      }
      if (z > bands.nearFocusZ) {
        return smoothstep01((z - bands.nearFocusZ) / bands.nearDenom);
      }
      return 0;
    }

    /** 每行：相机空间地面深度 -> CoC 透明度（destination-in 用，越大越糊）。 */
    function drawTiltShiftCocMask(maskCtx, maskW, maskH, sourceH, depthFrame, bands, horizon) {
      maskCtx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.clearRect(0, 0, maskW, maskH);
      for (let y = 0; y < maskH; y++) {
        const sourceY = ((y + 0.5) / maskH) * sourceH;
        let alpha = 1;
        if (sourceY >= horizon) {
          const zRow = depthFrame.solveZForScreenY(sourceY);
          alpha = tiltShiftAlphaForDepth(zRow, bands);
        }
        maskCtx.fillStyle = `rgba(255,255,255,${alpha.toFixed(4)})`;
        maskCtx.fillRect(0, y, maskW, 1);
      }
    }

    function clearTiltShiftMaskWithAlpha(maskCtx, canvas, subject) {
      if (!subject || !subject.source || !(subject.dw > 0) || !(subject.dh > 0)) return;
      const sx = maskCtx.canvas.width / Math.max(1, canvas.width);
      const sy = maskCtx.canvas.height / Math.max(1, canvas.height);
      maskCtx.save();
      maskCtx.setTransform(sx, 0, 0, sy, 0, 0);
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.globalAlpha = 1;
      maskCtx.drawImage(subject.source, subject.dx, subject.dy, subject.dw, subject.dh);
      maskCtx.restore();
    }

    function ensureTiltShiftObjectMaskBuffers(w, h) {
      if (animator.tiltShiftObjectCanvas.width !== w || animator.tiltShiftObjectCanvas.height !== h) {
        animator.tiltShiftObjectCanvas.width = w;
        animator.tiltShiftObjectCanvas.height = h;
        animator.tiltShiftObjectCtx.imageSmoothingEnabled = true;
      }
    }

    function clampTiltShiftBounds(bounds, canvas) {
      if (!bounds) return null;
      const pad = Math.max(2, Number(bounds.pad) || 0);
      const x0 = Math.max(0, Math.floor((Number(bounds.x) || 0) - pad));
      const y0 = Math.max(0, Math.floor((Number(bounds.y) || 0) - pad));
      const x1 = Math.min(canvas.width, Math.ceil((Number(bounds.x) || 0) + Math.max(1, Number(bounds.w) || 1) + pad));
      const y1 = Math.min(canvas.height, Math.ceil((Number(bounds.y) || 0) + Math.max(1, Number(bounds.h) || 1) + pad));
      if (!(x1 > x0) || !(y1 > y0)) return null;
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }

    function getTiltShiftRenderableBounds(item, canvas) {
      if (!item) return null;
      if (item.kind === "sprite") {
        return clampTiltShiftBounds({ x: item.dx, y: item.dy, w: item.dw, h: item.dh, pad: 3 }, canvas);
      }
      if (item.maskSprite) {
        const m = item.maskSprite;
        return clampTiltShiftBounds({ x: m.dx, y: m.dy, w: m.dw, h: m.dh, pad: 3 }, canvas);
      }
      if (item.maskBounds && item.maskBounds.kind === "circle") {
        const m = item.maskBounds;
        const r = Math.max(1, Number(m.r) || 1);
        return clampTiltShiftBounds({ x: (Number(m.x) || 0) - r, y: (Number(m.y) || 0) - r, w: r * 2, h: r * 2, pad: 3 }, canvas);
      }
      if (item.kind === "building" && item.object) {
        const o = item.object;
        const p = projectWorldToScreen(
          Number.isFinite(Number(item.renderWx)) ? Number(item.renderWx) : Number(o.wx) || 0,
          Number.isFinite(Number(item.renderWy)) ? Number(item.renderWy) : Number(o.wy) || 0,
          canvas
        );
        if (!p || !(p.scale > 0)) return null;
        const objectScale = Math.max(0.05, Number(o.scale) || 1);
        const worldRadius = Math.max(4, objectCollisionRadiusWorld(o) * 2.8);
        const rw = Math.max(24, worldRadius * p.scale * 2.4);
        const modelH = Math.max(1, Number(o.model && o.model.H) || worldRadius);
        const rh = Math.max(24, modelH * objectScale * p.scale * 1.35 + rw * 0.22);
        return clampTiltShiftBounds({ x: p.sx - rw * 0.5, y: p.sy - rh, w: rw, h: rh, pad: 8 }, canvas);
      }
      return null;
    }

    function drawTiltShiftRenderableSilhouette(ctx, canvas, item, tree) {
      if (!item) return false;
      if (item.kind === "building" && item.object) {
        const o = item.object;
        drawVoxelBuilding(
          ctx,
          canvas,
          o.model,
          Number.isFinite(Number(item.renderWx)) ? Number(item.renderWx) : o.wx,
          Number.isFinite(Number(item.renderWy)) ? Number(item.renderWy) : o.wy,
          o.angle == null ? Math.PI * 0.25 : o.angle,
          true,
          false,
          o.scale == null ? 1 : o.scale,
          item.sinkModelY || 0,
          item.clipModelY || 0,
          { clear: true, composite: true }
        );
        return true;
      }
      if (item.kind === "sprite" && tree) {
        ctx.drawImage(tree, item.dx, item.dy, item.dw, item.dh);
        return true;
      }
      if (item.maskSprite) {
        const m = item.maskSprite;
        ctx.drawImage(m.source, m.sx || 0, m.sy || 0, m.sw, m.sh, m.dx, m.dy, m.dw, m.dh);
        return true;
      }
      if (item.maskBounds && item.maskBounds.kind === "circle") {
        const m = item.maskBounds;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(Number(m.x) || 0, Number(m.y) || 0, Math.max(1, Number(m.r) || 1), 0, Math.PI * 2);
        ctx.fill();
        return true;
      }
      return false;
    }

    function compositeTiltShiftObjectDepthMask(maskCtx, objectCanvas, bounds, alpha) {
      if (!bounds) return;
      const sx = maskCtx.canvas.width / Math.max(1, objectCanvas.width);
      const sy = maskCtx.canvas.height / Math.max(1, objectCanvas.height);
      const dx = bounds.x * sx;
      const dy = bounds.y * sy;
      const dw = bounds.w * sx;
      const dh = bounds.h * sy;
      maskCtx.save();
      maskCtx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.drawImage(objectCanvas, bounds.x, bounds.y, bounds.w, bounds.h, dx, dy, dw, dh);
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.globalAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
      maskCtx.drawImage(objectCanvas, bounds.x, bounds.y, bounds.w, bounds.h, dx, dy, dw, dh);
      maskCtx.restore();
    }

    function drawTiltShiftSimpleMaskSource(maskCtx, item, tree) {
      if (item.kind === "sprite" && tree) {
        maskCtx.drawImage(tree, item.dx, item.dy, item.dw, item.dh);
        return true;
      }
      if (item.maskSprite) {
        const m = item.maskSprite;
        maskCtx.drawImage(m.source, m.sx || 0, m.sy || 0, m.sw, m.sh, m.dx, m.dy, m.dw, m.dh);
        return true;
      }
      if (item.maskBounds && item.maskBounds.kind === "circle") {
        const m = item.maskBounds;
        maskCtx.fillStyle = "#fff";
        maskCtx.beginPath();
        maskCtx.arc(Number(m.x) || 0, Number(m.y) || 0, Math.max(1, Number(m.r) || 1), 0, Math.PI * 2);
        maskCtx.fill();
        return true;
      }
      return false;
    }

    function compositeTiltShiftSimpleDepthMask(maskCtx, canvas, item, tree, alpha) {
      const sx = maskCtx.canvas.width / Math.max(1, canvas.width);
      const sy = maskCtx.canvas.height / Math.max(1, canvas.height);
      maskCtx.save();
      maskCtx.setTransform(sx, 0, 0, sy, 0, 0);
      maskCtx.globalCompositeOperation = "destination-out";
      drawTiltShiftSimpleMaskSource(maskCtx, item, tree);
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.globalAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
      drawTiltShiftSimpleMaskSource(maskCtx, item, tree);
      maskCtx.restore();
    }

    function drawTiltShiftObjectDepthMask(maskCtx, canvas, bands) {
      const renderables = Array.isArray(animator._sceneRenderables) ? animator._sceneRenderables : [];
      if (!renderables.length) return;
      ensureTiltShiftObjectMaskBuffers(canvas.width, canvas.height);
      const objectCtx = animator.tiltShiftObjectCtx;
      const objectCanvas = animator.tiltShiftObjectCanvas;
      const tree = animator._treeSpriteCanvas || buildTreeSpriteCanvas();
      for (const item of renderables) {
        const bounds = getTiltShiftRenderableBounds(item, canvas);
        if (!bounds) continue;
        const alpha = tiltShiftAlphaForDepth(Number(item && item.depthKey), bands);
        if (item.kind !== "building") {
          compositeTiltShiftSimpleDepthMask(maskCtx, canvas, item, tree, alpha);
          continue;
        }
        objectCtx.save();
        objectCtx.setTransform(1, 0, 0, 1, 0, 0);
        objectCtx.clearRect(bounds.x, bounds.y, bounds.w, bounds.h);
        objectCtx.beginPath();
        objectCtx.rect(bounds.x, bounds.y, bounds.w, bounds.h);
        objectCtx.clip();
        const drew = drawTiltShiftRenderableSilhouette(objectCtx, canvas, item, tree);
        objectCtx.restore();
        if (!drew) continue;
        compositeTiltShiftObjectDepthMask(maskCtx, objectCanvas, bounds, alpha);
      }
    }

    function applyTiltShiftPhotoFx(ctx, canvas) {
      const startedAt = typeof performance !== "undefined" && performance.now ? performance.now() : 0;
      const w = canvas.width;
      const h = canvas.height;
      if (w < 2 || h < 2) return;

      // 只在尺寸真正变化时才重设（避免每帧重新分配 GPU 纹理缓冲）
      if (animator.tempCanvas.width !== w || animator.tempCanvas.height !== h) {
        animator.tempCanvas.width = w;
        animator.tempCanvas.height = h;
      }
      const renderScale = Math.max(0.25, Math.min(1, Number(animator.tiltShiftRenderScale) || 0.5));
      const fxW = Math.max(2, Math.round(w * renderScale));
      const fxH = Math.max(2, Math.round(h * renderScale));
      if (animator.postFxCanvas.width !== fxW || animator.postFxCanvas.height !== fxH) {
        animator.postFxCanvas.width = fxW;
        animator.postFxCanvas.height = fxH;
        animator.postFxCtx.imageSmoothingEnabled = true;
      }
      if (animator.postFxMaskCanvas.width !== fxW || animator.postFxMaskCanvas.height !== fxH) {
        animator.postFxMaskCanvas.width = fxW;
        animator.postFxMaskCanvas.height = fxH;
        animator.postFxMaskCtx.imageSmoothingEnabled = true;
      }

      animator.tempCtx.clearRect(0, 0, w, h);
      animator.tempCtx.drawImage(canvas, 0, 0);

      // 用相机几何推导焦平面屏幕位置：主角脚底所在的地面深度就是焦平面
      // view.pivotScreenY 随镜头仰角/偏转自动变化，解决固定系数随旋转失准的问题
      const depthFrame = getGroundDepthFrame(canvas);
      const focusCenter = Math.max(
        h * 0.05,
        Math.min(h * 0.95, depthFrame.screenYFromZ(depthFrame.focusZ) + (Number(animator.tiltShiftFocusCenterOffset) || 0))
      );

      const blurStrength = Math.max(0, Math.min(4, Number(animator.tiltShiftBlurStrength) || 0));
      if (blurStrength <= 0) return;
      const blurPx = Math.max(1, Math.round(Math.min(w, h) * 0.014 * blurStrength));
      const focusHalf = Math.max(20, h * Math.max(0.001, Number(animator.tiltShiftFocusHalfRatio) || 0.12));
      const fade = Math.max(28, h * Math.max(0.001, Number(animator.tiltShiftFadeRatio) || 0.18));
      const t1 = Math.max(0, focusCenter - focusHalf) / h;
      const t2 = Math.min(h, focusCenter + focusHalf) / h;

      const post = animator.postFxCtx;
      post.clearRect(0, 0, fxW, fxH);
      post.save();
      post.imageSmoothingEnabled = true;
      const blurFxPx = Math.max(1, Math.round(blurPx * renderScale));
      const edgePad = Math.max(1, Math.ceil(blurFxPx * 2));
      post.filter = `blur(${blurFxPx}px) saturate(1.04)`;
      // Canvas blur samples transparent outside the render target. Extend the source past all edges
      // so the blurred layer still covers the viewport border instead of leaving sharp seams.
      post.drawImage(animator.tempCanvas, 0, 0, w, h, -edgePad, -edgePad, fxW + edgePad * 2, fxH + edgePad * 2);
      post.drawImage(animator.tempCanvas, 0, 0, w, h, 0, 0, fxW, fxH);
      post.restore();

      post.save();
      post.globalCompositeOperation = "destination-in";
      const cocBands = getTiltShiftCocBands(
        depthFrame,
        focusCenter,
        effectiveGroundHorizonForCanvas(canvas),
        h,
        animator.tiltShiftFocusHalfRatio,
        animator.tiltShiftFadeRatio
      );
      drawTiltShiftCocMask(
        animator.postFxMaskCtx,
        fxW,
        fxH,
        h,
        depthFrame,
        cocBands,
        effectiveGroundHorizonForCanvas(canvas)
      );
      drawTiltShiftObjectDepthMask(animator.postFxMaskCtx, canvas, cocBands);
      clearTiltShiftMaskWithAlpha(animator.postFxMaskCtx, canvas, animator._tiltShiftFocusSubject);
      animator._tiltShiftLastCoc = {
        focusZ: cocBands.focusZ,
        nearFocusZ: cocBands.nearFocusZ,
        farFocusZ: cocBands.farFocusZ,
        nearFullZ: cocBands.nearFullZ,
        farFullZ: cocBands.farFullZ,
        renderScale,
      };
      post.drawImage(animator.postFxMaskCanvas, 0, 0);
      post.restore();

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(animator.postFxCanvas, 0, 0, fxW, fxH, 0, 0, w, h);
      ctx.globalCompositeOperation = "soft-light";
      ctx.globalAlpha = Math.max(0, Math.min(1, Number(animator.tiltShiftGlowStrength) || 0));
      const focusGlow = ctx.createLinearGradient(0, 0, 0, h);
      focusGlow.addColorStop(0, "rgba(255,255,255,0)");
      focusGlow.addColorStop(t1, "rgba(255,255,255,0)");
      focusGlow.addColorStop((t1 + t2) * 0.5, "rgba(255,248,232,1)");
      focusGlow.addColorStop(t2, "rgba(255,255,255,0)");
      focusGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = focusGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      if (startedAt) {
        animator._tiltShiftLastCostMs = performance.now() - startedAt;
      }
    }

    function drawCharacterToContext(ctx, sourceImage, sx, sy, sw, sh, dxDraw, dyDraw, dw, dh, flip, centerX) {
      ctx.save();
      if (flip) {
        ctx.translate(Number(dxDraw) + Number(dw), Number(dyDraw));
        ctx.scale(-1, 1);
        ctx.drawImage(sourceImage, sx, sy, sw, sh, 0, 0, dw, dh);
      } else {
        ctx.drawImage(sourceImage, sx, sy, sw, sh, dxDraw, dyDraw, dw, dh);
      }
      ctx.restore();
    }

    const _spriteLightSourceIds = new WeakMap();
    let _spriteLightNextSourceId = 1;

    function getSpriteLightSourceId(sourceImage) {
      if (!sourceImage || (typeof sourceImage !== "object" && typeof sourceImage !== "function")) return "none";
      let id = _spriteLightSourceIds.get(sourceImage);
      if (!id) {
        id = _spriteLightNextSourceId++;
        _spriteLightSourceIds.set(sourceImage, id);
      }
      return id;
    }

    function ensureSpriteLightCache() {
      if (!(animator._spriteLightCache instanceof Map)) {
        animator._spriteLightCache = new Map();
      }
      return animator._spriteLightCache;
    }

    function quantizeSpriteLightComponent(value, step = 0.5) {
      const v = Math.max(-1, Math.min(1, Number(value) || 0));
      const s = Math.max(0.05, Number(step) || 0.5);
      return Math.max(-1, Math.min(1, Math.round(v / s) * s));
    }

    function getLitSpriteFrameCanvas(sourceImage, sx, sy, sw, sh, flip, canvas = null) {
      if (!sourceImage || !(sw > 0) || !(sh > 0)) return null;
      const sun = normalizedSunLighting();
      const view = getOrbitViewFrame(canvas || getLogicCanvas());
      const sunPlanarX = sun.fromX;
      const sunPlanarY = sun.fromY;
      const rawBillboardLightX = sunPlanarX * view.rightX + sunPlanarY * view.rightY;
      const rawBillboardFront = sunPlanarX * view.towardCamX + sunPlanarY * view.towardCamY;
      const billboardLightX = quantizeSpriteLightComponent(rawBillboardLightX, 0.5);
      const billboardFront = quantizeSpriteLightComponent(rawBillboardFront, 0.5);
      const key = [
        "v2q",
        getSpriteLightSourceId(sourceImage),
        sx, sy, sw, sh, flip ? 1 : 0,
        billboardLightX.toFixed(2),
        billboardFront.toFixed(2),
        sun.contrast.toFixed(2),
        sun.warmth.toFixed(2),
      ].join("|");
      const cache = ensureSpriteLightCache();
      const cached = cache.get(key);
      if (cached?.canvas) {
        cache.delete(key);
        cache.set(key, cached);
        return cached.canvas;
      }

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = sw;
      frameCanvas.height = sh;
      const frameCtx = frameCanvas.getContext("2d", { willReadFrequently: true });
      frameCtx.imageSmoothingEnabled = false;
      drawCharacterToContext(frameCtx, sourceImage, sx, sy, sw, sh, 0, 0, sw, sh, flip, sw / 2);

      const imageData = frameCtx.getImageData(0, 0, sw, sh);
      const { data } = imageData;
      const heights = new Float32Array(sw * sh);
      const invW = sw > 1 ? 1 / (sw - 1) : 0;
      const invH = sh > 1 ? 1 / (sh - 1) : 0;
      for (let y = 0; y < sh; y++) {
        const v = y * invH;
        const topness = 1 - v;
        for (let x = 0; x < sw; x++) {
          const idx = y * sw + x;
          const p = idx * 4;
          const a = data[p + 3] / 255;
          if (a <= 0.01) continue;
          const luma = (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114) / 255;
          heights[idx] = a * 0.52 + topness * 0.28 + (1 - luma) * 0.20;
        }
      }
      const contrast = Math.max(0.25, Number(sun.contrast) || 1);
      const warmth = Math.max(0, Number(sun.warmth) || 0);
      let lx = billboardLightX * 0.92;
      let ly = 0.72;
      let lz = 0.72 + billboardFront * 0.58;
      const ll = Math.hypot(lx, ly, lz) || 1;
      lx /= ll;
      ly /= ll;
      lz /= ll;
      const ambient = 0.84;
      const diffuse = 0.28;
      const backDarken = 0.24;
      const backLight = Math.max(0, -billboardFront);
      const highlightTint = [
        255,
        230 + warmth * 12,
        190 + warmth * 18,
      ];
      const coolShadowTint = [
        64,
        92,
        144,
      ];

      for (let y = 0; y < sh; y++) {
        const v = y * invH;
        for (let x = 0; x < sw; x++) {
          const idx = y * sw + x;
          const p = idx * 4;
          const a = data[p + 3];
          if (a <= 8) continue;
          const left = heights[y * sw + Math.max(0, x - 1)];
          const right = heights[y * sw + Math.min(sw - 1, x + 1)];
          const up = heights[Math.max(0, y - 1) * sw + x];
          const down = heights[Math.min(sh - 1, y + 1) * sw + x];
          let nx = (left - right) * 1.18;
          let ny = (up - down) * 1.30;
          let nz = 1;
          const nl = Math.hypot(nx, ny, nz) || 1;
          nx /= nl;
          ny /= nl;
          nz /= nl;
          const u = x * invW;
          const luma = (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114) / 255;
          const ndotlRaw = nx * lx + ny * ly + nz * lz;
          const ndotl = Math.max(0, ndotlRaw);
          const sideSweep = 0.5 + (u - 0.5) * billboardLightX * 1.75;
          const topSweep = 0.5 + (0.42 - v) * 0.78;
          const frontSweep = 0.5 + billboardFront * 0.32;
          const lightSweep = Math.max(0, Math.min(1, sideSweep * 0.48 + topSweep * 0.32 + frontSweep * 0.20));
          const litCore = Math.max(0, Math.min(1, ndotl * 0.62 + lightSweep * 0.38));
          const shadowCore = Math.max(0, Math.min(1, (1 - litCore) * (0.52 + backLight * 0.38)));
          const backFacing = Math.max(0, -ndotlRaw);
          let lightMul = ambient + litCore * diffuse - shadowCore * backDarken - backFacing * 0.06;
          lightMul = 1 + (lightMul - 1) * contrast;
          lightMul = Math.max(0.58, Math.min(1.22, lightMul));

          let r = data[p] * lightMul;
          let g = data[p + 1] * lightMul;
          let b = data[p + 2] * lightMul;

          const highlight = Math.max(0, Math.min(1, Math.pow(litCore, 1.62) * (0.13 + warmth * 0.22) * (0.40 + (1 - luma) * 0.38)));
          r += (highlightTint[0] - r) * highlight;
          g += (highlightTint[1] - g) * highlight * 0.80;
          b += (highlightTint[2] - b) * highlight * 0.56;

          const coolShadow = Math.max(0, Math.min(1, Math.pow(shadowCore, 1.12) * (0.16 + backLight * 0.24 + contrast * 0.05)));
          r = r * (1 - coolShadow * 0.34) + coolShadowTint[0] * coolShadow * 0.18;
          g = g * (1 - coolShadow * 0.24) + coolShadowTint[1] * coolShadow * 0.16;
          b = b * (1 - coolShadow * 0.10) + coolShadowTint[2] * coolShadow * 0.22;

          data[p] = Math.max(0, Math.min(255, r));
          data[p + 1] = Math.max(0, Math.min(255, g));
          data[p + 2] = Math.max(0, Math.min(255, b));
        }
      }

      frameCtx.putImageData(imageData, 0, 0);
      cache.set(key, { canvas: frameCanvas });
      while (cache.size > 512) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey == null) break;
        cache.delete(oldestKey);
      }
      return frameCanvas;
    }

    function drawLitCharacterToContext(ctx, sourceImage, sx, sy, sw, sh, dxDraw, dyDraw, dw, dh, flip, canvas = null) {
      const litFrame = getLitSpriteFrameCanvas(sourceImage, sx, sy, sw, sh, flip, canvas);
      if (litFrame) {
        ctx.drawImage(litFrame, dxDraw, dyDraw, dw, dh);
        return;
      }
      drawCharacterToContext(ctx, sourceImage, sx, sy, sw, sh, dxDraw, dyDraw, dw, dh, flip, sw / 2);
    }

    /** 脚底落脚点：半透明黑色椭圆阴影（画在角色下方、地面之上） */
    function drawCharacterFootShadow(ctx, centerX, footY, drawW, drawH) {
      const rx = Math.max(4, drawW * 0.26);
      const ry = Math.max(2, drawH * 0.10);
      const cy = footY + ry * 0.35;
      ctx.save();
      const g = ctx.createRadialGradient(centerX, cy, 0, centerX, cy, Math.max(rx, ry));
      g.addColorStop(0, "rgba(0,0,0,0.38)");
      g.addColorStop(0.55, "rgba(0,0,0,0.16)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(centerX, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function getAnimatorMoveState() {
      const up = animator.pressed.has("w");
      const down = animator.pressed.has("s");
      const left = animator.pressed.has("a");
      const right = animator.pressed.has("d");

      let dx = 0;
      let dy = 0;
      if (left && !right) dx = -1;
      else if (right && !left) dx = 1;
      if (up && !down) dy = -1;
      else if (down && !up) dy = 1;

      return resolveActorFacingFromInputAxes(dx, dy, animator.lastRow, animator.lastFlip);
    }

    function resolveActorFacingFromInputAxes(dx, dy, lastRow = 4, lastFlip = false) {
      let row = lastRow;
      let flip = lastFlip;
      const moving = dx !== 0 || dy !== 0;
      if (dx < 0 && dy > 0) { row = 0; flip = false; }
      else if (dx < 0 && dy === 0) { row = 1; flip = false; }
      else if (dx < 0 && dy < 0) { row = 2; flip = false; }
      else if (dx === 0 && dy < 0) { row = 3; flip = false; }
      else if (dx === 0 && dy > 0) { row = 4; flip = false; }
      else if (dx > 0 && dy > 0) { row = 0; flip = true; }
      else if (dx > 0 && dy === 0) { row = 1; flip = true; }
      else if (dx > 0 && dy < 0) { row = 2; flip = true; }
      return { dx, dy, row, flip, moving };
    }

    async function loadAnimatorSheet(src, label, options = {}) {
      ensurePlaceholderTilemap();
      const normalized = await normalizeSpriteSheetByAnchor(src, animator.columns, animator.rows);
      const img = await loadImage(normalized.dataUrl);
      animator.image = img;
      animator.idleSheet = null;
      const idleSrc = options && typeof options === "object" ? options.idleSrc : "";
      if (idleSrc) {
        try {
          animator.idleSheet = await loadIdlePoseSheetWorkflow(idleSrc);
        } catch (err) {
          animator.idleSheet = null;
          console.warn("[idle-sheet-load-failed]", err);
        }
      }
      animator.sheetCanvas = normalized.canvas;
      animator.label = label;
      animator.frameWidth = normalized.frameWidth;
      animator.frameHeight = normalized.frameHeight;
      animator.scale = Math.max(
        1,
        Math.min(
          2,
          Math.floor(Math.min(96 / animator.frameWidth, 128 / animator.frameHeight)) || 1
        )
      );
      animator.posX = animator.canvas.width / 2;
      animator.posY = animator.canvas.height * 0.72;
      animator.frameIndex = 0;
      animator.frameTime = 0;
      animator.lastRow = 4;
      animator.lastFlip = false;
      animator.directionName = "下 待机";
      animator.worldX = 0;
      animator.worldY = 0;
      elAnimatorInfo.textContent = "动画器已加载：" + label;
      elAnimatorSheetMeta.textContent =
        "切片：6 列 × 5 行，已按脚底锚点重对齐；场景：tilemap 透视雪地 + 河道 + 树遮挡；每帧约 " +
        animator.frameWidth.toFixed(1) + " × " + animator.frameHeight.toFixed(1) + " px" +
        (animator.idleSheet ? "（idle 已挂载：4 行稀疏姿态）" : "");
      animator._lastDirectionLabel = "方向：" + animator.directionName;
      elAnimatorDirection.textContent = animator._lastDirectionLabel;
    }

    function drawAnimator(ts) {
      if (!animator.lastTs) animator.lastTs = ts;
      const dt = Math.min(50, ts - animator.lastTs);
      animator.lastTs = ts;
      updateScreenFadeTransition(dt);
      applyDayNightCycle(ts, dt, { syncUi: false });
      animator._fpsSampleFrames += 1;
      animator._fpsSampleMs += dt;
      if ((ts - (animator._fpsLastUiTs || 0)) >= 250) {
        if (animator._fpsSampleMs > 0) {
          animator._fpsValue = (animator._fpsSampleFrames * 1000) / animator._fpsSampleMs;
        }
        animator._fpsSampleFrames = 0;
        animator._fpsSampleMs = 0;
        animator._fpsLastUiTs = ts;
        if (animator.fpsHudEl) {
          animator.fpsHudEl.textContent = `FPS: ${Math.round(animator._fpsValue || 0)}`;
        }
      }

      const ctx = animator.ctx;
      const fxCtx = animator.fxCtx;
      const cw = animator.canvas.width;
      const ch = animator.canvas.height;
      const isFxFullscreenOpen = elFxFullscreen.classList.contains("open");

      if (!animator.image) {
        if (!isFxFullscreenOpen) {
          ctx.clearRect(0, 0, cw, ch);
          ctx.fillStyle = "#8b949e";
          ctx.font = "18px VT323";
          ctx.fillText("Loading...", 88, 120);
        }
        requestAnimationFrame(drawAnimator);
        return;
      }

      if (document.visibilityState === "hidden") {
        animator.lastTs = ts;
        requestAnimationFrame(drawAnimator);
        return;
      }

      if (animator.pressed.has("q")) {
        animator.viewYaw -= animator.viewYawRadPerSec * (dt / 1000);
      }
      if (animator.pressed.has("e")) {
        animator.viewYaw += animator.viewYawRadPerSec * (dt / 1000);
      }
      const _twoPi = Math.PI * 2;
      animator.viewYaw = ((animator.viewYaw % _twoPi) + _twoPi) % _twoPi;
      const bulletBoost = Math.max(0, Number(animator.orbitBulletBoost) || 0);
      const bulletDir = Math.sign(Number(animator.orbitBulletDirection) || 1) || 1;
      animator.orbitBulletDirection = bulletDir;
      animator.orbitBulletAngle = ((Number(animator.orbitBulletAngle) || 0) + bulletDir * (0.72 + bulletBoost) * (dt / 1000)) % _twoPi;
      animator.orbitBulletBoost = Math.max(0, bulletBoost - 1.55 * (dt / 1000));

      animator._footEllipseStageX = NaN;
      animator._footEllipseStageY = NaN;

      const state = getAnimatorMoveState();
      animator.lastRow = state.row;
      animator.lastFlip = state.flip;
      animator.directionName = describeDirection(state.row, state.flip, state.moving);
      const directionLabel = "方向：" + animator.directionName;
      if (directionLabel !== animator._lastDirectionLabel) {
        animator._lastDirectionLabel = directionLabel;
        elAnimatorDirection.textContent = directionLabel;
      }

      let dx = state.dx;
      let dy = state.dy;
      if (animator.screenFade.active) {
        dx = 0;
        dy = 0;
      }
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy) || 1;
        const ndx = dx / len;
        const ndy = dy / len;
        // WASD 与 orbit 视图坐标系一致：
        // A/D 沿屏幕右方向移动，W/S 沿角色<->镜头的纵深方向移动。
        const logicCanvas = getLogicCanvas();
        const view = getOrbitViewFrame(logicCanvas);
        const moveRight = ndx * 1.4;
        const moveTowardCam = ndy * 1.35;
        const rox = moveRight * view.rightX + moveTowardCam * view.towardCamX;
        const roy = moveRight * view.rightY + moveTowardCam * view.towardCamY;
        const sp = animator.speed * (dt / 1000);
        if (!animator.centerOnPlayer) {
          animator.posX += ndx * sp;
          animator.posY += ndy * sp;
        }
        const fromX = animator.worldX;
        const fromY = animator.worldY;
        const toX = fromX + rox * sp;
        const toY = fromY + roy * sp;
        const solved = resolvePlayerMoveWithCollision(fromX, fromY, toX, toY, logicCanvas, ts);
        animator.worldX = solved.x;
        animator.worldY = solved.y;
        animator.frameTime += dt;
        if (animator.frameTime >= animator.frameMs) {
          // 低帧率时按累计时间补帧，避免动画看起来“慢放”
          const maxAdvance = Math.max(1, animator.columns * 2);
          let advance = 0;
          while (animator.frameTime >= animator.frameMs && advance < maxAdvance) {
            animator.frameTime -= animator.frameMs;
            animator.frameIndex = (animator.frameIndex + 1) % animator.columns;
            advance++;
          }
        }
      } else {
        animator.frameIndex = 0;
        animator.frameTime = 0;
      }
      refreshNearbyInteractions(getLogicCanvas());
      updateNpcRuntimeStep(ts, dt);

      const idleFrame = !state.moving ? getIdlePoseFrame(ts, state.row, state.flip) : null;
      const activeFrameWidth = idleFrame ? idleFrame.frameWidth : animator.frameWidth;
      const activeFrameHeight = idleFrame ? idleFrame.frameHeight : animator.frameHeight;
      const activeSource = idleFrame ? idleFrame.image : animator.image;
      const activeSx = idleFrame ? idleFrame.sx : (animator.frameIndex * animator.frameWidth);
      const activeSy = idleFrame ? idleFrame.sy : (state.row * animator.frameHeight);
      const activeFlip = idleFrame ? idleFrame.flip : state.flip;
      const activeSquashY = idleFrame ? idleFrame.squashY : 1;
      const dw = activeFrameWidth * animator.scale;
      const dh = activeFrameHeight * animator.scale;
      const walkBaseDw = Math.max(1, animator.frameWidth * animator.scale);
      // 自动把人物缩到“和一个瓦片差不多大”，并随 worldScale 同步放大/缩小
      const worldScaleRef = 0.62;
      const effectiveCharPx = (animator.targetCharPx || 22) * (animator.worldScale / worldScaleRef);
      const charMul = Math.max(0.06, Math.min(4, effectiveCharPx / walkBaseDw));
      const drawW = dw * charMul;
      const drawH = dh * charMul * activeSquashY;
      const halfW = drawW / 2;
      const halfH = drawH / 2;
      if (animator.centerOnPlayer) {
        animator.posX = cw / 2;
        animator.posY = ch * 0.68;
      } else {
        animator.posX = Math.max(halfW, Math.min(cw - halfW, animator.posX));
        animator.posY = Math.max(halfH, Math.min(ch - halfH, animator.posY));
      }

      if (animator.frameCanvas.width !== activeFrameWidth || animator.frameCanvas.height !== activeFrameHeight) {
        animator.frameCanvas.width = activeFrameWidth;
        animator.frameCanvas.height = activeFrameHeight;
      }
      animator.frameCtx.clearRect(0, 0, activeFrameWidth, activeFrameHeight);
      drawLitCharacterToContext(
        animator.frameCtx,
        activeSource,
        activeSx,
        activeSy,
        activeFrameWidth,
        activeFrameHeight,
        0,
        0,
        activeFrameWidth,
        activeFrameHeight,
        activeFlip,
        getLogicCanvas()
      );
      const previewModel = animator.placement.active ? getPlacementModel(animator.placement.kind) : null;
      if (!isFxFullscreenOpen) {
        // 小预览画布仅显示占位提示，不跑场景渲染管线（节省 GPU）
        [{ c: ctx, cv: animator.canvas }, { c: fxCtx, cv: animator.fxCanvas }].forEach(({ c, cv }) => {
          c.clearRect(0, 0, cv.width, cv.height);
          const previewHorizon = Math.floor(cv.height * 0.46);
          c.fillStyle = "#68acd2";
          c.fillRect(0, 0, cv.width, cv.height);
          c.fillStyle = "#87ceeb";
          c.fillRect(0, 0, cv.width, previewHorizon);
          c.fillStyle = "#5a6370";
          c.font = `${Math.max(11, Math.round(cv.height * 0.055))}px VT323, monospace`;
          c.textAlign = "center";
          c.fillText("▶ 点击「全屏」进入", cv.width / 2, cv.height / 2);
          c.textAlign = "left";
        });
      }

      // 同步 FX 大屏画布（打开时）
      if (isFxFullscreenOpen) {
        // 横屏游玩：在大画布上重新渲染一遍场景（不是截图放大）
        const w = fxStageW || 1280;
        const h = fxStageH || 720;
        fxBigCtx.clearRect(0, 0, elFxBigCanvas.width, elFxBigCanvas.height);

        // 保留 posX / posY，仅避免影响非居中模式下的其它流程
        const savedPosX = animator.posX;
        const savedPosY = animator.posY;
        animator.posX = w / 2;
        animator.posY = h / 2;

        // 横屏舞台默认太大：用舞台比例把世界/人物一起放大（不影响小预览）
        const savedWorldScale = animator.worldScale;
        const savedTargetCharPx = animator.targetCharPx;
        const stageMul = getFxStageScaleMul();
        animator.worldScale = savedWorldScale * stageMul;
        animator.targetCharPx = savedTargetCharPx * stageMul;

        // 关键修复：先渲染到 1:1 的离屏舞台，再铺到横屏大画布
        if (animator.stageCanvas.width !== w || animator.stageCanvas.height !== h) {
          animator.stageCanvas.width = w;
          animator.stageCanvas.height = h;
        }
        const stageCtx = animator.stageCtx;
        stageCtx.clearRect(0, 0, w, h);
        stageCtx.imageSmoothingEnabled = false;

        // 角色层信息（用于按 depth 插入到场景绘制序列）
        const dwBig = activeFrameWidth * animator.scale * charMul;
        const dhBig = activeFrameHeight * animator.scale * charMul * activeSquashY;
        const stageProj = projectWorldToScreen(animator.worldX, animator.worldY, animator.stageCanvas);
        const orbitBullet = getPlayerOrbitBulletState(animator.stageCanvas, ts);
        const npcRenderables = animator._npcRuntimeEnabled ? getNpcRenderablesForCanvas(animator.stageCanvas, ts) : [];
        const debugQinRenderable = getDebugQinRenderableForCanvas(animator.stageCanvas, ts);
        const isInteriorScene = animator.activeSceneKind === "interior";
        if (!isInteriorScene) updateOrbitBulletCombat(ts, animator.stageCanvas, orbitBullet);
        const footYBig = stageProj.sy;
        const footRyBig = Math.max(2, dhBig * 0.1);
        const dxDrawBig = stageProj.sx - dwBig / 2;
        const dyDrawBig = footYBig - dhBig;
        animator._tiltShiftFocusSubject = {
          source: animator.frameCanvas,
          dx: dxDrawBig,
          dy: dyDrawBig,
          dw: dwBig,
          dh: dhBig,
        };
        const drawPlayerOnStage = () => {
          if (
            !animator.frameCanvas ||
            !(animator.frameCanvas.width > 0) ||
            !(animator.frameCanvas.height > 0) ||
            !(dwBig > 0) ||
            !(dhBig > 0)
          ) {
            return;
          }
          animator._footEllipseStageX = stageProj.sx;
          animator._footEllipseStageY = footYBig + footRyBig * 0.35;
          animator._footShadowStageScreenY = footYBig;
          drawCharacterFootShadow(stageCtx, stageProj.sx, footYBig, dwBig, dhBig);
          stageCtx.drawImage(animator.frameCanvas, dxDrawBig, dyDrawBig, dwBig, dhBig);
        };

        drawSkyBackdrop(stageCtx, animator.stageCanvas);
        drawSceneObjects(stageCtx, animator.stageCanvas, true, null, "underTilemap");
        draw2p5dSnowScene(stageCtx, animator.stageCanvas, true);
        drawSceneObjects(stageCtx, animator.stageCanvas, true, {
          depthKey: stageProj.depthKey,
          draw: drawPlayerOnStage,
          extraRenderables: npcRenderables.concat(debugQinRenderable).concat(
            !isInteriorScene && orbitBullet
              ? [{
                  depthKey: orbitBullet.depthKey,
                  kind: "bullet",
                  maskBounds: { kind: "circle", x: orbitBullet.sx, y: orbitBullet.sy, r: orbitBullet.pixelUnit * 5 },
                  draw: () => drawPixelOrbitBullet(stageCtx, orbitBullet),
                }]
              : []
          ),
        }, "normal");

        if (!isInteriorScene && animator.placement.active && previewModel) {
          drawVoxelBuilding(stageCtx, animator.stageCanvas, previewModel, animator.placement.wx, animator.placement.wy, animator.placement.angle, true, true, animator.placement.scale);
        }

        if (animator.enableTiltShiftFx) {
          applyTiltShiftPhotoFx(stageCtx, animator.stageCanvas);
        }
        drawHd2dStageVignette(stageCtx, animator.stageCanvas, stageProj.sx, stageProj.sy - dhBig * 0.42);
        drawCollisionDebugOverlay(stageCtx, animator.stageCanvas);
        drawDayNightAtmosphereOverlay(stageCtx, animator.stageCanvas);
        drawScreenFadeOverlay(stageCtx, animator.stageCanvas);

        fxBigCtx.imageSmoothingEnabled = false;
        fxBigCtx.drawImage(animator.stageCanvas, 0, 0, elFxBigCanvas.width, elFxBigCanvas.height);

        animator.worldScale = savedWorldScale;
        animator.targetCharPx = savedTargetCharPx;
        animator.posX = savedPosX;
        animator.posY = savedPosY;
      }

      requestAnimationFrame(drawAnimator);
    }

    const FX_HOTBAR_SEL_KEY = "pixelwf_fx_hotbar_sel";
    const FX_HOTBAR_STATE_KEY = "pixelwf_fx_hotbar_state_v1";
    const FX_CONTAINER_STORE_KEY = "pixelwf_fx_containers_v1";
    let _fxHotbarInited = false;

    function sanitizeHotbarSlotForStorage(slot) {
      if (!slot || typeof slot !== "object") return null;
      const itemId = String(slot.itemId || "").trim();
      const name = String(slot.name || "").trim();
      if (!name) return null;
      const icon = typeof slot.icon === "string" ? slot.icon : "";
      const description = typeof slot.description === "string" ? slot.description : "";
      const tags = Array.isArray(slot.tags) ? slot.tags.map((t) => String(t || "").trim()).filter(Boolean) : [];
      const count = Math.max(1, Math.floor(Number(slot.count) || 1));
      let liquid = null;
      if (slot.liquid && typeof slot.liquid === "object") {
        const type = String(slot.liquid.type || "").trim();
        const amount = Math.max(0, Number(slot.liquid.amount) || 0);
        const max = Math.max(0, Number(slot.liquid.max) || 0);
        if (type && max > 0) liquid = { type, amount: Math.min(amount, max), max };
      }
      const out = { name, icon, description, tags, count, liquid };
      if (itemId) out.itemId = itemId;
      return out;
    }

    function sanitizeContainerSlotForStorage(slot) {
      // same schema as hotbar slot
      return sanitizeHotbarSlotForStorage(slot);
    }

    function ensureContainerStore() {
      if (animator._containerStore && typeof animator._containerStore === "object") return animator._containerStore;
      let store = { version: 1, containers: {}, savedAt: 0 };
      try {
        const raw = ls(FX_CONTAINER_STORE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data && typeof data === "object") {
            const containers = data.containers && typeof data.containers === "object" ? data.containers : {};
            store = { version: 1, containers, savedAt: Number(data.savedAt) || 0 };
          }
        }
      } catch (err) {
        console.warn("[container-store-restore-failed]", err);
      }
      animator._containerStore = store;
      return store;
    }

    function persistContainerStore() {
      const store = ensureContainerStore();
      try {
        store.savedAt = Date.now();
        ls(FX_CONTAINER_STORE_KEY, JSON.stringify(store));
      } catch (err) {
        console.warn("[container-store-persist-failed]", err);
      }
    }

    function getContainerKeyForObject(o) {
      const sceneId = getCurrentSceneId();
      const objId = Number(o?.id) || 0;
      return `${sceneId}:${objId}`;
    }

    function getOrCreateContainerSlots(o, slotCount = 18) {
      const n = Math.max(1, Math.floor(Number(slotCount) || 18));
      const key = getContainerKeyForObject(o);
      const store = ensureContainerStore();
      if (!store.containers || typeof store.containers !== "object") store.containers = {};
      const rec = store.containers[key] && typeof store.containers[key] === "object" ? store.containers[key] : null;
      const arr = Array.isArray(rec?.slots) ? rec.slots : [];
      const next = Array(n).fill(null);
      for (let i = 0; i < n; i++) next[i] = sanitizeContainerSlotForStorage(arr[i]);
      if (!rec) store.containers[key] = { version: 1, slots: next, updatedAt: Date.now() };
      else {
        store.containers[key].slots = next;
        store.containers[key].updatedAt = Date.now();
      }
      return next;
    }

    function saveContainerSlots(o, slots) {
      const n = Math.max(1, Math.floor(Number(slots?.length) || 18));
      const key = getContainerKeyForObject(o);
      const store = ensureContainerStore();
      const compact = Array(n).fill(null);
      for (let i = 0; i < n; i++) compact[i] = sanitizeContainerSlotForStorage(slots[i]);
      store.containers[key] = { version: 1, slots: compact, updatedAt: Date.now() };
      persistContainerStore();
    }

    function persistHotbarState() {
      const n = Math.max(1, Number(animator.hotbarSlotCount) || 9);
      const slots = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
      const compactSlots = [];
      for (let i = 0; i < n; i++) compactSlots.push(sanitizeHotbarSlotForStorage(slots[i]));
      const selected = Math.max(0, Math.min(n - 1, Number(animator.hotbarSelectedIndex) || 0));
      try {
        ls(FX_HOTBAR_STATE_KEY, JSON.stringify({ version: 1, selected, slots: compactSlots, savedAt: Date.now() }));
      } catch (err) {
        console.warn("[hotbar-state-persist-failed]", err);
      }
    }

    function restoreHotbarState() {
      const n = Math.max(1, Number(animator.hotbarSlotCount) || 9);
      let restored = false;
      try {
        const raw = ls(FX_HOTBAR_STATE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          const arr = Array.isArray(data?.slots) ? data.slots : [];
          const next = Array(n).fill(null);
          for (let i = 0; i < n; i++) next[i] = sanitizeHotbarSlotForStorage(arr[i]);
          animator.hotbarSlots = next;
          const selected = Number(data?.selected);
          if (Number.isFinite(selected) && selected >= 0 && selected < n) {
            animator.hotbarSelectedIndex = selected;
          }
          restored = true;
        }
      } catch (err) {
        console.warn("[hotbar-state-restore-failed]", err);
      }
      if (!restored) {
        const saved = Number(ls(FX_HOTBAR_SEL_KEY));
        if (Number.isFinite(saved) && saved >= 0 && saved < n) {
          animator.hotbarSelectedIndex = saved;
        }
      }
      animator.hotbarSelectedIndex = Math.max(0, Math.min(n - 1, Number(animator.hotbarSelectedIndex) || 0));
    }

    function getHotbarHosts() {
      const out = [];
      if (elFxHotbar) out.push(elFxHotbar);
      if (elAnimatorHotbar) out.push(elAnimatorHotbar);
      return out;
    }

    function ensureFxHotbarInFullscreenWrap() {
      if (elFxHotbar) return;
      const wrap = elFxFullscreen && elFxFullscreen.querySelector && elFxFullscreen.querySelector(".fx-wrap");
      if (!wrap) return;
      const el = document.createElement("div");
      el.id = "fxHotbar";
      el.className = "character-hotbar";
      el.setAttribute("aria-label", "角色物品栏");
      const hud = wrap.querySelector(".fx-hud");
      if (hud) wrap.insertBefore(el, hud);
      else wrap.appendChild(el);
      elFxHotbar = el;
    }

    function isFxHotbarTypingTarget(el) {
      if (!el || el.nodeType !== 1) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return !!el.isContentEditable;
    }

    function syncFxHotbarUi() {
      const hosts = getHotbarHosts().filter((h) => h.querySelector(".fx-hotbar-slot"));
      if (!hosts.length) return;
      const itemStore = ensureDropAgentStore().itemsByName || {};
      const sel = Math.max(0, Math.min(animator.hotbarSlotCount - 1, Number(animator.hotbarSelectedIndex) || 0));
      animator.hotbarSelectedIndex = sel;
      hosts.forEach((host) => {
        const buttons = host.querySelectorAll(".fx-hotbar-slot");
        buttons.forEach((btn, i) => {
          btn.classList.toggle("is-selected", i === sel);
          const item = animator.hotbarSlots[i] || null;
          if (item && !item.icon && itemStore[item.name]?.icon) item.icon = itemStore[item.name].icon;
          const img = btn.querySelector(".fx-hotbar-icon");
          const nameEl = btn.querySelector(".fx-hotbar-name");
          if (img) {
            const src = item && item.icon ? String(item.icon).trim() : "";
            if (src) {
              img.src = src;
              img.classList.add("is-visible");
              img.alt = item && item.name ? String(item.name) : "";
            } else {
              img.removeAttribute("src");
              img.classList.remove("is-visible");
              img.alt = "";
            }
          }
          if (nameEl) {
            const base = item && item.name ? String(item.name) : "";
            const label = base || "";
            nameEl.textContent = label;
            nameEl.title = label;
          }
          const countEl = btn.querySelector(".fx-hotbar-count");
          if (countEl) {
            const count = Math.max(0, Number(item?.count) || 0);
            countEl.textContent = count > 1 ? String(count) : "";
            countEl.classList.toggle("is-visible", count > 1);
          }
        });
      });
    }

    function setFxHotbarSelectedIndex(i) {
      const n = animator.hotbarSlotCount || 9;
      const next = Math.max(0, Math.min(n - 1, Number(i) || 0));
      if (animator.hotbarSelectedIndex === next) {
        syncFxHotbarUi();
        return;
      }
      animator.hotbarSelectedIndex = next;
      ls(FX_HOTBAR_SEL_KEY, String(next));
      persistHotbarState();
      syncFxHotbarUi();
    }

    function mountHotbarInto(host) {
      if (!host || host.querySelector(".fx-hotbar-inner")) return;
      const inner = document.createElement("div");
      inner.className = "fx-hotbar-inner";
      const n = animator.hotbarSlotCount || 9;
      for (let i = 0; i < n; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fx-hotbar-slot";
        btn.dataset.hotbarIndex = String(i);
        btn.setAttribute("aria-label", "物品槽 " + (i + 1));
        btn.title = "槽位 " + (i + 1) + "（快捷键 " + (i + 1) + "）";
        const keySpan = document.createElement("span");
        keySpan.className = "fx-hotbar-key";
        keySpan.textContent = String(i + 1);
        const body = document.createElement("span");
        body.className = "fx-hotbar-body";
        const img = document.createElement("img");
        img.className = "fx-hotbar-icon";
        img.decoding = "async";
        img.addEventListener("error", () => {
          img.classList.remove("is-visible");
          img.removeAttribute("src");
        });
        const nameEl = document.createElement("span");
        nameEl.className = "fx-hotbar-name";
        const countEl = document.createElement("span");
        countEl.className = "fx-hotbar-count";
        body.appendChild(img);
        body.appendChild(nameEl);
        btn.appendChild(keySpan);
        btn.appendChild(body);
        btn.appendChild(countEl);
        inner.appendChild(btn);
      }
      host.appendChild(inner);
    }

    function onHotbarHostClick(ev) {
      const slot = ev.target.closest?.(".fx-hotbar-slot");
      if (!slot || !ev.currentTarget.contains(slot)) return;
      const idx = Number(slot.dataset.hotbarIndex);
      if (!Number.isFinite(idx)) return;
      setFxHotbarSelectedIndex(idx);
    }

    function setupFxHotbar() {
      ensureFxHotbarInFullscreenWrap();
      mountHotbarInto(elFxHotbar);
      mountHotbarInto(elAnimatorHotbar);
      if (!_fxHotbarInited) {
        _fxHotbarInited = true;
        restoreHotbarState();
        getHotbarHosts().forEach((h) => h.addEventListener("click", onHotbarHostClick));
        window.addEventListener("keydown", (event) => {
          if (isFxHotbarTypingTarget(event.target)) return;
          const code = event.code;
          let digit = 0;
          if (code.startsWith("Digit") && code.length === 6) digit = Number(code.slice(5));
          else if (code.startsWith("Numpad") && code.length === 7) digit = Number(code.slice(6));
          if (!digit || digit < 1 || digit > 9) return;
          setFxHotbarSelectedIndex(digit - 1);
          event.preventDefault();
        });
      }
      persistHotbarState();
      syncFxHotbarUi();
    }

    function bindAnimatorControls() {
      window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (!["w", "a", "s", "d", "q", "e"].includes(key)) return;
        if (
          animator.placement.active &&
          elFxFullscreen.classList.contains("open") &&
          event.shiftKey &&
          (key === "q" || key === "e")
        ) {
          // Shift+Q/E 在放置模式中保留给建筑旋转，不进入镜头偏航按键状态。
          event.preventDefault();
          return;
        }
        animator.pressed.add(key);
        event.preventDefault();
      });
      window.addEventListener("keyup", (event) => {
        const key = event.key.toLowerCase();
        if (!["w", "a", "s", "d", "q", "e"].includes(key)) return;
        animator.pressed.delete(key);
        event.preventDefault();
      });
      window.addEventListener("blur", () => animator.pressed.clear());

      const bindings = [
        [elCtrlHorizon, elValHorizon, (v) => animator.horizonY = Number(v)],
        [elCtrlCameraHeight, elValCameraHeight, (v) => animator.cameraHeight = Number(v)],
        [elCtrlForwardScale, elValForwardScale, (v) => animator.forwardScale = Number(v)],
        [elCtrlSpanBase, elValSpanBase, (v) => animator.spanBase = Number(v)],
        [elCtrlSpanScale, elValSpanScale, (v) => animator.spanScale = Number(v)],
      ];
      bindings.forEach(([input, label, apply]) => {
        const sync = () => {
          label.textContent = input.value;
          apply(input.value);
        };
        input.addEventListener("input", sync);
        sync();
      });
    }

    async function runBackgroundRemovalTest() {
      elBtn.disabled = true;
      if (fxBtnGenCharacter) fxBtnGenCharacter.disabled = true;
      elBtnTestMaid.disabled = true;
      elBtnTestHu.disabled = true;
      elStatus.className = "hint loading";
      elStatus.textContent = "正在处理 maid.png…";
      elPanel.hidden = true;
      elOut.innerHTML = "";

      try {
        const originalSrc = "./maid.png";
        const processedSrc = await removeUnenclosedWhiteBackground(originalSrc);
        animator._generatedCharacter = {
          prompt: "maid.png 测试图",
          model: "local-test",
          originalSrc,
          processedSrc,
        };
        renderBeforeAfter(originalSrc, processedSrc, "maid.png");
        renderHudPreviewGrid(fxCharacterPreview, [
          { title: "原图", src: originalSrc, white: false },
          { title: "去白底", src: processedSrc, white: true },
        ]);
        await loadAnimatorSheet(processedSrc, "maid.png（去白底后）");
        elStatus.className = "hint";
        elStatus.textContent = "maid.png 测试完成";
        if (fxCharacterStatus) {
          fxCharacterStatus.className = "fx-gen-status";
          fxCharacterStatus.textContent = elStatus.textContent;
        }
      } catch (e) {
        elStatus.className = "hint err";
        elStatus.textContent = e.message || String(e);
        if (fxCharacterStatus) {
          fxCharacterStatus.className = "fx-gen-status err";
          fxCharacterStatus.textContent = elStatus.textContent;
        }
      } finally {
        elBtn.disabled = false;
        if (fxBtnGenCharacter) fxBtnGenCharacter.disabled = false;
        elBtnTestMaid.disabled = false;
        elBtnTestHu.disabled = false;
      }
    }

    async function runHuAlignmentTest() {
      elBtn.disabled = true;
      if (fxBtnGenCharacter) fxBtnGenCharacter.disabled = true;
      elBtnTestMaid.disabled = true;
      elBtnTestHu.disabled = true;
      elStatus.className = "hint loading";
      elStatus.textContent = "正在处理 hu.jpg…";
      elPanel.hidden = true;
      elOut.innerHTML = "";

      try {
        const originalSrc = "./hu.jpg";
        const processedSrc = await removeUnenclosedWhiteBackground(originalSrc);
        animator._generatedCharacter = {
          prompt: "hu.jpg 测试图",
          model: "local-test",
          originalSrc,
          processedSrc,
        };
        renderBeforeAfter(originalSrc, processedSrc, "hu.jpg");
        renderHudPreviewGrid(fxCharacterPreview, [
          { title: "原图", src: originalSrc, white: false },
          { title: "去白底", src: processedSrc, white: true },
        ]);
        await loadAnimatorSheet(processedSrc, "hu.jpg（去白底 + 锚点重对齐）");
        elStatus.className = "hint";
        elStatus.textContent = "hu.jpg 测试完成";
        if (fxCharacterStatus) {
          fxCharacterStatus.className = "fx-gen-status";
          fxCharacterStatus.textContent = elStatus.textContent;
        }
      } catch (e) {
        elStatus.className = "hint err";
        elStatus.textContent = e.message || String(e);
        if (fxCharacterStatus) {
          fxCharacterStatus.className = "fx-gen-status err";
          fxCharacterStatus.textContent = elStatus.textContent;
        }
      } finally {
        elBtn.disabled = false;
        if (fxBtnGenCharacter) fxBtnGenCharacter.disabled = false;
        elBtnTestMaid.disabled = false;
        elBtnTestHu.disabled = false;
      }
    }

    async function buildGeneratedBuildingFromPrompt(prompt, onStatus, buildingModel) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      const model = normalizeBuildingModel(buildingModel || getBuildingModel());
      let originalSrc = "";
      let processedSrc = "";

      if (!base || !key) {
        throw new Error("缺少接口地址或 API Key（已写死在脚本里）");
      }
      if (!prompt) {
        throw new Error("请输入建筑提示词");
      }

      if (typeof globalThis.buildVoxelModelFromDataUrls !== "function") {
        throw new Error("缺少运行时体素构建器：buildVoxelModelFromDataUrls 不可用。");
      }
      if (typeof globalThis.applyTexturedAtlasesFromDataUrls !== "function") {
        throw new Error("缺少运行时贴图构建器：applyTexturedAtlasesFromDataUrls 不可用。");
      }
      if (onStatus) onStatus(`请求 ${model} 建筑三视图中…（并行语义打标）`);
      const metaPromise = llmExtractBuildingMeta(base, key, prompt).catch((err) => {
        console.warn("[building-meta-llm-failed]", err);
        return {
          widthTiles: 15,
          tags: ["decoration"],
          interactionTags: [],
          __fallback: true,
          __error: err && err.message ? String(err.message) : "unknown",
        };
      });
      const res = await fetch(base + "/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model,
          size: BUILDING_IMAGE_SIZE,
          quality: BUILDING_IMAGE_QUALITY,
          response_format: "b64_json",
          prompt: BUILDING_SYSTEM_PROMPT + "\n\n" + prompt,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("响应不是 JSON：\n" + text.slice(0, 400));
      }

      if (!res.ok || data.error) {
        const msg = data.error?.message || data.message || text.slice(0, 500);
        throw new Error(msg);
      }

      const item = data.data && data.data[0];
      if (!item || (!item.b64_json && !item.url)) {
        throw new Error("未返回 b64_json/url。\n响应片段：" + text.slice(0, 500));
      }

      originalSrc = item.b64_json ? b64ToDataUrl(item.b64_json) : String(item.url || "");
      processedSrc = await removeAllWhiteBackground(originalSrc);
      const views = await extractBuildingThreeViews(processedSrc);
      const meta = await metaPromise;
      if (meta && meta.__fallback && onStatus) {
        onStatus("语义打标失败，已回退默认宽度 15 格。请检查 /v1/chat/completions 兼容性。");
      }
      const widthTiles = normalizeWidthTiles(meta.widthTiles);
      const semanticTags = normalizeSemanticTags(meta.tags);
      const interactionTags = normalizeInteractionTags([].concat(meta.interactionTags || []).concat(meta.tags || []));
      const facilityProfile = semanticTags.includes("facility") ? sanitizeFacilityProfileLike(meta.facilityProfile) : null;
      const targetLongest = targetLongestFromWidthTiles(widthTiles);

      const built = await buildPlacedBuildingModelFromViews({
        frontUrl: views.front,
        sideUrl: views.side,
        topUrl: views.top,
        voxelOptions: {
          targetLongest,
          shellOnly: true,
          frontPriority: false,
        },
      });

      return {
        prompt,
        originalSrc,
        processedSrc,
        views: built.views,
        model: built.model,
        voxelOptions: built.voxelOptions,
        normalizedViews: built.normalizedViews,
        widthTiles,
        tags: semanticTags,
        interactionTags,
        facilityProfile,
        buildingTag: primaryBuildingTagFromTags(semanticTags),
        isHouse: semanticTags.includes("house"),
        drawRoad: normalizeDrawRoad(undefined, semanticTags),
      };
    }

    async function generateBuilding() {
      const prompt = elBuildingPrompt.value.trim();
      const model = getBuildingModel();

      elBtnGenBuilding.disabled = true;
      if (fxBtnGenBuildingHud) fxBtnGenBuildingHud.disabled = true;
      if (fxBtnGenerateWorld) fxBtnGenerateWorld.disabled = true;
      elBuildingStatus.className = "hint loading";
      elBuildingStatus.textContent = `请求 ${model} 建筑三视图中…`;
      if (elBuildingOut) elBuildingOut.innerHTML = "";

      try {
        const buildingState = await buildGeneratedBuildingFromPrompt(prompt, (text) => {
          elBuildingStatus.textContent = text;
        }, model);
        animator._generatedBuilding = buildingState;
        renderBuildingWorkflowPreview(animator._generatedBuilding);
        syncPlacementUi();
        elBuildingStatus.className = "hint";
        elBuildingStatus.textContent =
          "完成：已生成并切片为正 / 侧 / 俯三视图，可在 FX 面板里直接放置 AI 建筑。" +
          `（宽度打标 ${buildingState.widthTiles} 格；标签 ${formatBuildingTagHint(buildingState.tags, buildingState.interactionTags, buildingState.prompt)}）` +
          (buildingState.voxelOptions.frontPriority ? "（本次为避免空模型，已启用兼容回退。）" : "") +
          (buildingState.normalizedViews?.rotatedTop ? "（已自动旋转俯视图 90 度以对齐宽深。）" : "");
        if (fxBuildingStatus) {
          fxBuildingStatus.className = "fx-gen-status";
          fxBuildingStatus.textContent = elBuildingStatus.textContent;
        }
      } catch (e) {
        animator._generatedBuilding = null;
        syncPlacementUi();
        elBuildingStatus.className = "hint err";
        elBuildingStatus.textContent = e.message || String(e);
        if (String(e.message || e).toLowerCase().includes("fetch")) {
          elBuildingStatus.textContent +=
            "\n\n若因跨域失败，可在本目录运行：npx serve . 然后用 http://localhost 打开。";
        }
        if (fxBuildingStatus) {
          fxBuildingStatus.className = "fx-gen-status err";
          fxBuildingStatus.textContent = elBuildingStatus.textContent;
        }
        if (fxBuildingPreview) fxBuildingPreview.innerHTML = "";
      } finally {
        elBtnGenBuilding.disabled = false;
        if (fxBtnGenBuildingHud) fxBtnGenBuildingHud.disabled = false;
        if (fxBtnGenerateWorld) fxBtnGenerateWorld.disabled = false;
      }
    }

    function parseWorldBuildingPrompts() {
      return (fxWorldBuildingList?.value || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 12);
    }

    function angleFacingPoint(fromX, fromY, toX, toY) {
      const dx = toX - fromX;
      const dy = toY - fromY;
      return Math.atan2(-dx, dy);
    }

    function addWorldRoadSegment(net, ax, ay, bx, by, width, role) {
      net.segments.push({
        ax,
        ay,
        bx,
        by,
        width,
        baseColor: [210, 156, 92],
        highlightColor: [232, 198, 145],
        role,
      });
    }

    function finalizeWorldRoadNetwork(net) {
      let minBX = Infinity, minBY = Infinity, maxBX = -Infinity, maxBY = -Infinity;
      for (const seg of net.segments) {
        const halfW = Math.max(0.5, Number(seg.width) * 0.5) + 1;
        seg.minX = Math.min(seg.ax, seg.bx) - halfW;
        seg.maxX = Math.max(seg.ax, seg.bx) + halfW;
        seg.minY = Math.min(seg.ay, seg.by) - halfW;
        seg.maxY = Math.max(seg.ay, seg.by) + halfW;
        minBX = Math.min(minBX, seg.minX);
        minBY = Math.min(minBY, seg.minY);
        maxBX = Math.max(maxBX, seg.maxX);
        maxBY = Math.max(maxBY, seg.maxY);
      }
      net.bounds = Number.isFinite(minBX)
        ? { minX: minBX, minY: minBY, maxX: maxBX, maxY: maxBY }
        : null;
    }

    function applyLowRoadRadialVillageRoads(layoutItems, center) {
      const roadW = 3;
      const net = { points: [], segments: [], bounds: null, mode: "radial-low" };
      const bySpoke = new Map();
      for (const item of layoutItems) {
        if (!item || !item.object || !item.access) continue;
        if (!bySpoke.has(item.spoke)) bySpoke.set(item.spoke, []);
        bySpoke.get(item.spoke).push(item);
      }
      bySpoke.forEach((items) => {
        let far = null;
        let farDist = -Infinity;
        for (const item of items) {
          const d = Math.hypot(item.access.x - center.x, item.access.y - center.y);
          if (d > farDist) {
            farDist = d;
            far = item;
          }
        }
        if (!far) return;
        const dx = far.dir.x;
        const dy = far.dir.y;
        addWorldRoadSegment(
          net,
          center.x,
          center.y,
          center.x + dx * (farDist + 18),
          center.y + dy * (farDist + 18),
          roadW,
          "trunk"
        );
      });

      for (const item of layoutItems) {
        const access = buildingFrontAccessWorld(item.object);
        if (!access) continue;
        net.points.push(access.outer);
        addWorldRoadSegment(net, access.facade.x, access.facade.y, access.outer.x, access.outer.y, 2, "apron");
        addWorldRoadSegment(net, access.outer.x, access.outer.y, item.access.x, item.access.y, 2, "branch");
      }
      finalizeWorldRoadNetwork(net);
      animator._sceneRoadNetwork = net;
      rebuildSceneRoadMask();
    }

    function placeGeneratedBuildingsAsRadialVillage(buildings) {
      ensureSceneObjects();
      animator._sceneObjects = (animator._sceneObjects || []).filter((o) => !o._worldGenerated);
      markSceneObjectsDirty();
      const center = { x: animator.worldX, y: animator.worldY };
      const spokes = 4;
      const avgWidth = buildings.reduce((sum, b) => sum + normalizeWidthTiles(b.widthTiles), 0) / Math.max(1, buildings.length);
      const ringStep = Math.max(20, avgWidth * 0.95 + 12);
      const layoutItems = [];

      buildings.forEach((building, index) => {
        const spoke = index % spokes;
        const ring = Math.floor(index / spokes) + 1;
        const angle = -Math.PI * 0.5 + (Math.PI * 2 * spoke) / spokes;
        const dir = { x: Math.cos(angle), y: Math.sin(angle) };
        const tangent = { x: Math.cos(angle + Math.PI * 0.5), y: Math.sin(angle + Math.PI * 0.5) };
        const widthTiles = normalizeWidthTiles(building.widthTiles);
        const roadDistance = 28 + ring * ringStep + widthTiles * 0.2;
        const side = ring % 2 ? -1 : 1;
        const sideOffset = side * (9 + widthTiles * 0.35);
        const access = {
          x: center.x + dir.x * roadDistance,
          y: center.y + dir.y * roadDistance,
        };
        const wx = access.x + tangent.x * sideOffset;
        const wy = access.y + tangent.y * sideOffset;
        const modelWidth = getModelLowerBandWidth(building.model, 1 / 8);
        const scale = Math.max(0.08, Math.min(8, widthTiles / modelWidth));
        const object = {
          id: animator._nextBuildingId++,
          type: "generated",
          wx,
          wy,
          angle: angleFacingPoint(wx, wy, access.x, access.y),
          scale,
          model: building.model,
          label: building.prompt,
          tags: normalizeSemanticTags(building.tags, building.prompt),
          interactionTags: normalizeInteractionTags(building.interactionTags || building.tags, building.prompt),
          buildingTag: building.buildingTag || primaryBuildingTagFromTags(building.tags),
          isHouse: true,
          drawRoad: true,
          _worldGenerated: true,
          asset: {
            kind: "generated-building",
            prompt: building.prompt || "",
            originalSrc: building.originalSrc || "",
            processedSrc: building.processedSrc || "",
            views: building.views ? {
              front: building.views.front || "",
              side: building.views.side || "",
              top: building.views.top || "",
            } : null,
            voxelOptions: building.voxelOptions || null,
            normalizedViews: building.normalizedViews || null,
            widthTiles,
            tags: normalizeSemanticTags(building.tags, building.prompt),
            interactionTags: normalizeInteractionTags(building.interactionTags || building.tags, building.prompt),
            buildingTag: building.buildingTag || primaryBuildingTagFromTags(building.tags),
            drawRoad: true,
            facilityProfile: sanitizeFacilityProfileLike(building.facilityProfile),
          },
          interior: null,
          properties: buildSceneObjectPropertiesFromSemanticState({}, building.tags, building.interactionTags, building),
        };
        animator._sceneObjects.push(object);
        markSceneObjectsDirty();
        layoutItems.push({ object, access, spoke, dir, widthTiles, prompt: building.prompt });
      });

      applyLowRoadRadialVillageRoads(layoutItems, center);
      invalidateSceneLightingBake();
      return layoutItems;
    }

    function buildWorldPlanPreviewGrid(record) {
      const wrap = document.createElement("div");
      wrap.className = "fx-world-preview-grid";
      const building = record && record.building ? record.building : null;
      if (!building) return wrap;
      const items = [
        { title: "原图", src: building.originalSrc, white: false },
        { title: "去白底", src: building.processedSrc, white: true },
      ];
      if (building.views) {
        items.push(
          { title: "正视图", src: building.views.front, white: true },
          { title: "侧视图", src: building.views.side, white: true },
          { title: "俯视图", src: building.views.top, white: true }
        );
      }
      items.forEach((item) => {
        if (!item.src) return;
        const card = document.createElement("div");
        card.className = "fx-gen-preview-card" + (item.white ? " is-white" : "");
        const title = document.createElement("h4");
        title.textContent = item.title;
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title;
        card.appendChild(title);
        card.appendChild(img);
        wrap.appendChild(card);
      });
      return wrap;
    }

    function applyWorldBatchRecords(records) {
      const ok = (records || [])
        .filter((r) => r && r.status === "ok" && r.building)
        .map((r) => r.building);
      if (!ok.length) return { layoutItems: [], successCount: 0 };
      animator._generatedBuilding = ok[ok.length - 1] || null;
      renderBuildingWorkflowPreview(animator._generatedBuilding);
      const layoutItems = placeGeneratedBuildingsAsRadialVillage(ok);
      renderWorldPlan(records, layoutItems);
      syncPlacementUi();
      setTextStatus(
        fxSceneStatus,
        `已生成放射型村庄：${layoutItems.length} 栋建筑，4 条低强度放射主路。`
      );
      return { layoutItems, successCount: ok.length };
    }

    function renderWorldPlan(records, layoutItems = []) {
      if (!fxWorldPlan) return;
      fxWorldPlan.innerHTML = "";
      if (!Array.isArray(records) || !records.length) return;
      const byPrompt = new Map();
      layoutItems.forEach((item) => {
        if (!item || !item.prompt) return;
        if (!byPrompt.has(item.prompt)) byPrompt.set(item.prompt, []);
        byPrompt.get(item.prompt).push(item);
      });
      records.forEach((record, index) => {
        const details = document.createElement("details");
        details.className = "fx-world-plan-item";
        if (record.status === "error") details.open = true;
        const summary = document.createElement("summary");
        const left = document.createElement("span");
        left.textContent = `${index + 1}. ${record.prompt}`;
        const right = document.createElement("span");
        if (record.status === "ok" && record.building) {
          const candidates = byPrompt.get(record.prompt) || [];
          const picked = candidates.shift() || null;
          if (picked) byPrompt.set(record.prompt, candidates);
          right.textContent = picked
            ? `${normalizeWidthTiles(record.building.widthTiles)} tiles · spoke ${picked.spoke + 1}`
            : `${normalizeWidthTiles(record.building.widthTiles)} tiles`;
        } else if (record.status === "running") {
          right.textContent = "生成中…";
        } else {
          right.textContent = "失败";
        }
        summary.appendChild(left);
        summary.appendChild(right);
        details.appendChild(summary);

        const body = document.createElement("div");
        body.className = "fx-world-plan-body";
        const actions = document.createElement("div");
        actions.className = "fx-world-plan-actions";
        const regenBtn = document.createElement("button");
        regenBtn.type = "button";
        regenBtn.className = "secondary";
        regenBtn.textContent = record.status === "running" ? "重生中…" : "重新生成该建筑";
        regenBtn.disabled = record.status === "running";
        regenBtn.dataset.action = "regen";
        regenBtn.dataset.index = String(index);
        actions.appendChild(regenBtn);
        body.appendChild(actions);

        const status = document.createElement("p");
        status.className = "fx-gen-status";
        if (record.status === "ok" && record.building) {
          const tags = normalizeSemanticTags(record.building.tags, record.prompt || "");
          const interactionTags = normalizeInteractionTags(record.building.interactionTags || record.building.tags, record.prompt || "");
          status.textContent = `成功 · 宽度 ${normalizeWidthTiles(record.building.widthTiles)} 格 · 标签 ${formatBuildingTagHint(tags, interactionTags, record.prompt || "")}`;
        } else if (record.status === "running") {
          status.textContent = "正在生成该建筑…";
        } else {
          status.textContent = `失败 · ${record.error || "未知错误"}`;
        }
        body.appendChild(status);
        if (record.status === "ok" && record.building) {
          body.appendChild(buildWorldPlanPreviewGrid(record));
        }
        details.appendChild(body);
        fxWorldPlan.appendChild(details);
      });
    }

    async function generateRadialWorldVillage() {
      const prompts = parseWorldBuildingPrompts();
      const model = getBuildingModel();
      if (!fxWorldStatus) return;
      if (!prompts.length) {
        fxWorldStatus.className = "fx-gen-status err";
        fxWorldStatus.textContent = "请输入建筑清单：每行一栋建筑。";
        return;
      }
      fxWorldStatus.className = "fx-gen-status loading";
      fxWorldStatus.textContent = `准备并发生成 ${prompts.length} 栋建筑…（模型：${model}）`;
      if (fxWorldPlan) fxWorldPlan.innerHTML = "";
      if (fxBtnGenerateWorld) fxBtnGenerateWorld.disabled = true;
      if (elBtnGenBuilding) elBtnGenBuilding.disabled = true;
      if (fxBtnGenBuildingHud) fxBtnGenBuildingHud.disabled = true;

      try {
        const settled = await Promise.allSettled(
          prompts.map((prompt, index) =>
            buildGeneratedBuildingFromPrompt(prompt, (text) => {
              fxWorldStatus.textContent = `建筑 ${index + 1}/${prompts.length}：${text}`;
            }, model)
          )
        );
        const records = settled.map((item, index) => {
          if (item.status === "fulfilled") {
            return {
              prompt: prompts[index],
              status: "ok",
              building: item.value,
              error: "",
              model,
            };
          }
          return {
            prompt: prompts[index],
            status: "error",
            building: null,
            error: item.reason?.message || String(item.reason || "未知错误"),
            model,
          };
        });
        animator._worldBatchRecords = records;
        const applied = applyWorldBatchRecords(records);
        if (!applied.successCount) renderWorldPlan(records, []);
        fxWorldStatus.className = "fx-gen-status";
        const failedCount = records.filter((r) => r.status !== "ok").length;
        if (applied.successCount) {
          const sizes = records
            .filter((r) => r.status === "ok" && r.building)
            .map((r) => normalizeWidthTiles(r.building.widthTiles));
          fxWorldStatus.textContent =
            `完成：成功 ${applied.successCount} / ${records.length}。` +
            (failedCount ? ` 失败 ${failedCount}（可在下方逐条重生）。` : "") +
            ` 尺寸：${sizes.join(", ")} tiles。`;
        } else {
          fxWorldStatus.textContent = `本次全部失败（${records.length} 栋）。请在下方逐条重生。`;
        }
      } catch (err) {
        fxWorldStatus.className = "fx-gen-status err";
        fxWorldStatus.textContent = err.message || String(err);
      } finally {
        if (fxBtnGenerateWorld) fxBtnGenerateWorld.disabled = false;
        if (elBtnGenBuilding) elBtnGenBuilding.disabled = false;
        if (fxBtnGenBuildingHud) fxBtnGenBuildingHud.disabled = false;
      }
    }

    fxWorldPlan?.addEventListener("click", async (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("button[data-action='regen']") : null;
      if (!btn) return;
      const index = Number(btn.dataset.index);
      const records = Array.isArray(animator._worldBatchRecords) ? animator._worldBatchRecords : [];
      const record = records[index];
      if (!record || record.status === "running") return;
      const model = normalizeBuildingModel(record.model || getBuildingModel());
      records[index] = {
        prompt: record.prompt,
        status: "running",
        building: null,
        error: "",
        model,
      };
      renderWorldPlan(records, []);
      if (fxWorldStatus) {
        fxWorldStatus.className = "fx-gen-status loading";
        fxWorldStatus.textContent = `正在重生第 ${index + 1} 栋…`;
      }
      try {
        const rebuilt = await buildGeneratedBuildingFromPrompt(record.prompt, (text) => {
          if (fxWorldStatus) fxWorldStatus.textContent = `重生第 ${index + 1} 栋：${text}`;
        }, model);
        records[index] = {
          prompt: record.prompt,
          status: "ok",
          building: rebuilt,
          error: "",
          model,
        };
        const applied = applyWorldBatchRecords(records);
        if (!applied.successCount) renderWorldPlan(records, []);
        if (fxWorldStatus) {
          const failedCount = records.filter((r) => r.status !== "ok").length;
          fxWorldStatus.className = "fx-gen-status";
          fxWorldStatus.textContent = failedCount
            ? `重生完成：当前成功 ${applied.successCount}/${records.length}，仍失败 ${failedCount}。`
            : `重生完成：全部 ${records.length} 栋已成功。`;
        }
      } catch (err) {
        records[index] = {
          prompt: record.prompt,
          status: "error",
          building: null,
          error: err?.message || String(err || "未知错误"),
          model,
        };
        const applied = applyWorldBatchRecords(records);
        if (!applied.successCount) renderWorldPlan(records, []);
        if (fxWorldStatus) {
          fxWorldStatus.className = "fx-gen-status err";
          fxWorldStatus.textContent = `重生失败：第 ${index + 1} 栋 · ${records[index].error}`;
        }
      }
    });

    async function generate() {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      const chosenModel = elModel.value;
      const prompt = elPrompt.value.trim();

      if (!base || !key) {
        elStatus.textContent = "缺少接口地址或 API Key（已写死在脚本里）";
        return;
      }
      if (!prompt) {
        elStatus.textContent = "请输入提示词";
        return;
      }

      elBtn.disabled = true;
      if (fxBtnGenCharacter) fxBtnGenCharacter.disabled = true;
      elBtnTestMaid.disabled = true;
      elBtnTestHu.disabled = true;
      elStatus.textContent = "";
      elStatus.className = "hint loading";
      elStatus.textContent = "请求中…";
      elPanel.hidden = true;
      elOut.innerHTML = "";

      try {
        // 回到原先已验证的图生图链路：只保留 UI 进世界窗口，不改生成协议本身。
        let model = chosenModel;
        if (model === "nano-banana") {
          model = "gemini-3-pro-image-preview";
          elStatus.textContent = "请求中…（图生图强制使用 gemini-3-pro-image-preview）";
          if (fxCharacterStatus) {
            fxCharacterStatus.className = "fx-gen-status";
            fxCharacterStatus.textContent = elStatus.textContent;
          }
        }

        const ref = await fetch("./8direction.png", { cache: "no-store" });
        if (!ref.ok) throw new Error("无法加载参考图 8direction.png（请确认它和本 HTML 在同目录，并用本地服务打开）");
        const refBlob = await ref.blob();
        const refB64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(refBlob);
        });

        const fullPrompt = SYSTEM_PROMPT + "\n\n" + prompt;
        console.log("[character-edit-debug]", { model, promptLen: fullPrompt.length, refSize: refBlob.size });

        const res = await fetch(base + "/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + key,
          },
          body: JSON.stringify({
            model,
            max_tokens: 4096,
            messages: [
              {
                role: "user",
                content: [
                  { type: "image_url", image_url: { url: refB64 } },
                  { type: "text", text: fullPrompt },
                ],
              },
            ],
          }),
        });

        const text = await res.text();
        console.log("[character-edit-response]", {
          status: res.status,
          bodyLength: text.length,
          bodySnippet: text.slice(0, 500),
        });
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("响应不是 JSON：\n" + text.slice(0, 400));
        }

        if (!res.ok || data.error) {
          const msg = data.error?.message || data.message || text.slice(0, 500);
          throw new Error(msg);
        }

        let originalSrc = "";
        const choice = data.choices && data.choices[0];
        if (choice && choice.message) {
          const msg = choice.message;
          if (typeof msg.content === "string") {
            const m = msg.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
            if (m) originalSrc = m[0];
          }
          if (!originalSrc && Array.isArray(msg.content)) {
            for (const part of msg.content) {
              if (part.type === "image_url" && part.image_url?.url) {
                originalSrc = part.image_url.url;
                break;
              }
            }
          }
        }
        if (!originalSrc && data.data && data.data[0]) {
          const item = data.data[0];
          if (item.b64_json) originalSrc = b64ToDataUrl(item.b64_json);
          else if (item.url) originalSrc = item.url;
        }
        if (!originalSrc) {
          throw new Error(
            "未能从响应中提取图片。\n响应片段：\n" + JSON.stringify(data).slice(0, 800)
          );
        }

        const processedSrc = await removeUnenclosedWhiteBackground(originalSrc);
        animator._generatedCharacter = {
          prompt,
          model,
          originalSrc,
          processedSrc,
        };
        renderBeforeAfter(originalSrc, processedSrc, "生成结果");
        renderHudPreviewGrid(fxCharacterPreview, [
          { title: "原图", src: originalSrc, white: false },
          { title: "去白底", src: processedSrc, white: true },
        ]);
        await loadAnimatorSheet(processedSrc, "生成结果（去白底后）");
        elStatus.className = "hint";
        elStatus.textContent = "完成（已自动去除外部白底）";
        if (fxCharacterStatus) {
          fxCharacterStatus.className = "fx-gen-status";
          fxCharacterStatus.textContent = elStatus.textContent;
        }
      } catch (e) {
        elStatus.className = "hint err";
        elStatus.textContent = e.message || String(e);
        if (String(e.message || e).toLowerCase().includes("fetch")) {
          elStatus.textContent +=
            "\n\n若因跨域失败，可在本目录运行：npx serve . 然后用 http://localhost 打开。";
        }
        if (fxCharacterStatus) {
          fxCharacterStatus.className = "fx-gen-status err";
          fxCharacterStatus.textContent = elStatus.textContent;
        }
      } finally {
        elBtn.disabled = false;
        if (fxBtnGenCharacter) fxBtnGenCharacter.disabled = false;
        elBtnTestMaid.disabled = false;
        elBtnTestHu.disabled = false;
      }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // NPC blueprint → parallel character generation → persistent NPC runtime
    // ─────────────────────────────────────────────────────────────────────────────
    const NPC_BLUEPRINT_SCHEMA_VERSION = 1;
    const NPC_DESIGN_SCHEMA_VERSION = 1;
    const NPC_DEFAULT_CONCURRENCY = 3;
    const NPC_DEBUG_QIN_ID = "秦始皇";
    const NPC_IMAGE_MODEL_FALLBACK = "gemini-3-pro-image-preview";
    const NPC_LLM_MODEL = "gpt-5.4-mini";
    let _npcBlueprintCache = null;
    let _npcDesignCache = null;
    let _npcRefB64Promise = null;
    const _npcDayPlanRequestByNpcId = new Map();
    const _npcConversationRequestByKey = new Map();
    const _npcPlayerConversationRequestByNpcId = new Map();
    let _npcAutosaveTimer = null;
    let _npcAutosaveDirty = false;
    let _npcAutosaveInFlight = false;
    let _npcAutosaveLastAt = 0;
    let _npcAutosavePendingReason = "";
    let _npcAutosaveLifecycleBound = false;
    const NPC_SCENE_AUTOSAVE_DELAY_MS = 2800;
    const NPC_SCENE_AUTOSAVE_MIN_INTERVAL_MS = 12000;
    const NPC_REST_ENTER_ENERGY = 20;
    const NPC_REST_EXIT_ENERGY = 60;
    const NPC_STUCK_REPLAN_TICKS = 5;
    const NPC_TARGET_TIMEOUT_MS = 12000;
    const NPC_RECOVER_COOLDOWN_TICKS = 10;
    const NPC_STATIONARY_RESTART_TICKS = 18;
    const NPC_TASK_IDLE_MIN_MS = 900;
    const NPC_TASK_IDLE_MAX_MS = 2600;
    const NPC_ITEM_TOAST_MS = 2000;
    const NPC_SOCIAL_TRIGGER_RADIUS = 16;
    const NPC_SOCIAL_COOLDOWN_MIN = 120;
    const NPC_CONVERSATION_LINE_MS = 2200;
    const NPC_CONVERSATION_TOTAL_MS = 11000;
    const NPC_PLAYER_TALK_COOLDOWN_MS = 45000;
    const NPC_INTERACTION_PICK_RADIUS_PX = 22;
    const NPC_ACTIVITY_RADIUS_WORLD = 8;
    let _npcBootstrapRunning = false;
    let _npcDebugQin = {
      enabled: false,
      wx: null,
      wy: null,
      renderScale: 1,
      heightWorld: 4,
      faceDx: 0,
      faceDy: -1,
      frameIndex: 0,
      row: 4,
      flip: false,
      lastLookupTs: 0,
      sprite: { status: "idle", sheetId: "", canvas: null, frameW: 0, frameH: 0, error: "", renderScale: null },
    };

    function getActiveSceneIdSafe() {
      return getRuntimeSceneId();
    }

    function getNpcBlueprintUrl(sceneId) {
      const id = sanitizeSceneId(sceneId) || DEFAULT_SCENE_ID;
      return `./scene/${encodeURIComponent(id)}/npc-blueprint.json`;
    }

    function getNpcDesignUrl(sceneId) {
      const id = sanitizeSceneId(sceneId) || DEFAULT_SCENE_ID;
      return `./scene/${encodeURIComponent(id)}/npc-design.json`;
    }

    function normalizeNpcImageModel(rawModel) {
      const v = String(rawModel || "").trim();
      const low = v.toLowerCase();
      // Nano Banana family does not support image reference padding in our workflow.
      if (!v || low === "nano-banana" || low === "nanobanna" || low === "nano banana") {
        return { model: NPC_IMAGE_MODEL_FALLBACK, downgraded: !!v };
      }
      return { model: v, downgraded: false };
    }

    async function loadNpcBlueprint(sceneId) {
      const url = getNpcBlueprintUrl(sceneId);
      const data = await fetchJson(url, { cache: "no-store" });
      if (!data || typeof data !== "object") throw new Error("NPC 蓝图不是对象");
      if (Number(data.schemaVersion) !== NPC_BLUEPRINT_SCHEMA_VERSION) {
        throw new Error(`NPC 蓝图 schemaVersion 不匹配：${data.schemaVersion}（期望 ${NPC_BLUEPRINT_SCHEMA_VERSION}）`);
      }
      if (!Array.isArray(data.characters)) throw new Error("NPC 蓝图缺少 characters[]");
      _npcBlueprintCache = { sceneId, url, data, loadedAt: Date.now() };
      return data;
    }

    async function loadNpcDesign(sceneId) {
      const url = getNpcDesignUrl(sceneId);
      try {
        const data = await fetchJson(url, { cache: "no-store" });
        if (!data || typeof data !== "object") throw new Error("NPC 设计文件不是对象");
        if (Number(data.schemaVersion) !== NPC_DESIGN_SCHEMA_VERSION) {
          throw new Error(`NPC 设计 schemaVersion 不匹配：${data.schemaVersion}（期望 ${NPC_DESIGN_SCHEMA_VERSION}）`);
        }
        const byNpcId = new Map();
        for (const rec of (Array.isArray(data.npcs) ? data.npcs : [])) {
          const npcId = String(rec?.npcId || "").trim();
          if (!npcId) continue;
          byNpcId.set(npcId, rec);
        }
        _npcDesignCache = { sceneId, url, data, byNpcId, loadedAt: Date.now(), missing: false };
      } catch (err) {
        const msg = String(err?.message || err || "");
        if (!isEmbeddedEngine && !/\b404\b/.test(msg) && !/Not Found/i.test(msg)) throw err;
        _npcDesignCache = {
          sceneId,
          url,
          data: { schemaVersion: NPC_DESIGN_SCHEMA_VERSION, npcs: [], locationRefs: {}, activityResolvers: {} },
          byNpcId: new Map(),
          loadedAt: Date.now(),
          missing: true,
        };
      }
      animator._npcDesignContext = {
        sceneId,
        locationRefs: cloneJsonValue(_npcDesignCache?.data?.locationRefs || {}) || {},
        activityResolvers: cloneJsonValue(_npcDesignCache?.data?.activityResolvers || {}) || {},
        facilities: cloneJsonValue(_npcDesignCache?.data?.facilities || {}) || {},
        missing: _npcDesignCache?.missing === true,
        loadedAt: _npcDesignCache?.loadedAt || Date.now(),
      };
      return _npcDesignCache;
    }

    function normalizeNpcStringList(raw) {
      return Array.isArray(raw) ? raw.map((s) => String(s || "").trim()).filter(Boolean) : [];
    }

    function normalizeNpcInventoryList(raw) {
      if (!Array.isArray(raw)) return [];
      const out = [];
      for (const entry of raw) {
        const itemId = String(entry?.itemId || "").trim();
        if (!itemId) continue;
        const next = { itemId, count: Math.max(0, Math.round(Number(entry?.count) || 0)) };
        if (Number.isFinite(Number(entry?.countMin))) next.countMin = Math.max(0, Math.round(Number(entry.countMin) || 0));
        if (Number.isFinite(Number(entry?.countMax))) next.countMax = Math.max(next.countMin || 0, Math.round(Number(entry.countMax) || 0));
        if (Number.isFinite(Number(entry?.weight))) next.weight = Math.max(0, Math.round(Number(entry.weight) || 0));
        if (entry?.optional === true) next.optional = true;
        out.push(next);
      }
      return out;
    }

    function normalizeNpcDefaultBlocks(raw) {
      if (!Array.isArray(raw)) return [];
      const out = [];
      for (const block of raw) {
        const activityType = String(block?.activityType || "").trim();
        if (!activityType) continue;
        const startMin = Math.max(0, Math.round(Number(block?.startMin) || 0));
        const endMin = Math.max(startMin, Math.round(Number(block?.endMin) || startMin));
        const locationRef = String(block?.locationRef || "home").trim() || "home";
        const mode = String(block?.mode || "soft_do").trim() || "soft_do";
        const wanderRadius = Math.max(1, Math.round(Number(block?.wanderRadius) || 6));
        const arrivalSlackMin = Math.max(0, Math.round(Number(block?.arrivalSlackMin) || 12));
        const useFacility = String(block?.useFacility || "").trim();
        const note = String(block?.note || "").trim();
        out.push({ activityType, startMin, endMin, locationRef, mode, wanderRadius, arrivalSlackMin, useFacility, note });
      }
      return out;
    }

    function normalizeNpcDesignEntry(raw) {
      const rec = raw && typeof raw === "object" ? raw : {};
      const anchors = rec.anchors && typeof rec.anchors === "object" ? rec.anchors : {};
      const loadout = rec.loadout && typeof rec.loadout === "object" ? rec.loadout : {};
      const dailyPattern = rec.dailyPattern && typeof rec.dailyPattern === "object" ? rec.dailyPattern : {};
      const activityProfile = rec.activityProfile && typeof rec.activityProfile === "object" ? rec.activityProfile : {};
      const socialProfile = rec.socialProfile && typeof rec.socialProfile === "object" ? rec.socialProfile : {};
      const emotionBias = rec.emotionBias && typeof rec.emotionBias === "object" ? rec.emotionBias : {};
      const baselineMood = clampInt(emotionBias.baselineMood, -10, 10, 0);
      return {
        anchors: {
          home: String(anchors.home || "home").trim() || "home",
          work: String(anchors.work || "").trim(),
          social: normalizeNpcStringList(anchors.social),
          boundary: normalizeNpcStringList(anchors.boundary),
        },
        loadout: {
          equipment: normalizeNpcStringList(loadout.equipment),
          inventory: normalizeNpcInventoryList(loadout.inventory),
        },
        dailyPattern: {
          archetype: String(dailyPattern.archetype || "").trim(),
          wakeMin: Math.max(0, Math.round(Number(dailyPattern.wakeMin) || 360)),
          sleepMin: Math.max(0, Math.round(Number(dailyPattern.sleepMin) || 1260)),
          defaultBlocks: normalizeNpcDefaultBlocks(dailyPattern.defaultBlocks),
        },
        activityProfile: {
          primary: normalizeNpcStringList(activityProfile.primary),
          secondary: normalizeNpcStringList(activityProfile.secondary),
          facilityUse: normalizeNpcStringList(activityProfile.facilityUse),
        },
        socialProfile: {
          closeTo: normalizeNpcStringList(socialProfile.closeTo),
          tradeWith: normalizeNpcStringList(socialProfile.tradeWith),
          chatTopics: normalizeNpcStringList(socialProfile.chatTopics),
        },
        emotionBias: {
          baselineMood,
          stressors: normalizeNpcStringList(emotionBias.stressors),
          comforts: normalizeNpcStringList(emotionBias.comforts),
        },
        storyHooks: normalizeNpcStringList(rec.storyHooks),
        initialEmotions: {
          mood: baselineMood,
          stress: 0,
          hope: 0,
          frustration: 0,
        },
      };
    }

    function normalizeNpcBlueprintChar(raw, defaults, designEntry = null) {
      const npcId = String(raw?.npcId || "").trim();
      if (!npcId) return null;
      const displayName = String(raw?.displayName || npcId).trim() || npcId;
      const homeObjectId = Number(raw?.homeObjectId);
      const appearancePrompt = String(raw?.appearancePrompt || "").trim();
      if (!appearancePrompt) return null;
      const spawn = raw?.spawn && typeof raw.spawn === "object" ? raw.spawn : (defaults?.spawn || {});
      const sprite = raw?.sprite && typeof raw.sprite === "object" ? raw.sprite : (defaults?.sprite || {});
      const offset = spawn?.offset && typeof spawn.offset === "object" ? spawn.offset : (defaults?.spawn?.offset || {});
      const simDefaults = raw?.simDefaults && typeof raw.simDefaults === "object" ? raw.simDefaults : (defaults?.simDefaults || {});
      const needs = simDefaults?.needs && typeof simDefaults.needs === "object" ? simDefaults.needs : (defaults?.simDefaults?.needs || {});
      const design = normalizeNpcDesignEntry(designEntry);
      return {
        npcId,
        displayName,
        homeObjectId: Number.isFinite(homeObjectId) ? homeObjectId : null,
        role: String(raw?.role || "").trim(),
        personality: Array.isArray(raw?.personality) ? raw.personality.map((s) => String(s || "").trim()).filter(Boolean) : [],
        skills: Array.isArray(raw?.skills) ? raw.skills.map((s) => String(s || "").trim()).filter(Boolean) : [],
        appearancePrompt,
        initialMemories: Array.isArray(raw?.initialMemories) ? raw.initialMemories : [],
        renderScale: clampNpcRenderScale(sprite?.renderScale, 1),
        heightWorld: Math.max(1, Number(sprite?.heightWorld) || 4),
        spawn: {
          mode: String(spawn?.mode || "near_home"),
          offset: { x: Number(offset?.x) || 0, y: Number(offset?.y) || 0 },
        },
        simDefaults: {
          needs: {
            hunger: clampInt(needs?.hunger, 0, 100, 15),
            energy: clampInt(needs?.energy, 0, 100, 85),
            comfort: clampInt(needs?.comfort, 0, 100, 70),
            social: clampInt(needs?.social, 0, 100, 55),
            curiosity: clampInt(needs?.curiosity, 0, 100, 55),
          },
        },
        anchors: design.anchors,
        equipment: design.loadout.equipment,
        initialInventory: design.loadout.inventory,
        dailyPattern: design.dailyPattern,
        activityProfile: design.activityProfile,
        socialProfile: design.socialProfile,
        emotionBias: design.emotionBias,
        storyHooks: design.storyHooks,
        initialEmotions: design.initialEmotions,
      };
    }

    async function ensureNpcRefB64() {
      if (_npcRefB64Promise) return _npcRefB64Promise;
      _npcRefB64Promise = (async () => {
        const ref = await fetch("./8direction.png", { cache: "no-store" });
        if (!ref.ok) throw new Error("无法加载参考图 8direction.png");
        const refBlob = await ref.blob();
        const refB64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(refBlob);
        });
        return refB64;
      })();
      return _npcRefB64Promise;
    }

    function extractImageDataUrlFromChatCompletionsResponse(data) {
      let originalSrc = "";
      const choice = data?.choices && data.choices[0];
      if (choice?.message) {
        const msg = choice.message;
        if (typeof msg.content === "string") {
          const m = msg.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
          if (m) originalSrc = m[0];
        }
        if (!originalSrc && Array.isArray(msg.content)) {
          for (const part of msg.content) {
            if (part?.type === "image_url" && part.image_url?.url) {
              originalSrc = part.image_url.url;
              break;
            }
          }
        }
      }
      if (!originalSrc && data?.data && data.data[0]) {
        const item = data.data[0];
        if (item?.b64_json) originalSrc = b64ToDataUrl(item.b64_json);
        else if (item?.url) originalSrc = item.url;
      }
      return originalSrc;
    }

    async function generateCharacterSheetDataUrlsFromPrompt(prompt, model, onStatus) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) throw new Error("缺少接口地址或 API Key");
      const p = String(prompt || "").trim();
      if (!p) throw new Error("缺少人物提示词");

      const refB64 = await ensureNpcRefB64();
      const fullPrompt = SYSTEM_PROMPT + "\n\n" + p;
      if (typeof onStatus === "function") onStatus("请求中…");
      const res = await fetch(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: [
                { type: "image_url", image_url: { url: refB64 } },
                { type: "text", text: fullPrompt },
              ],
            },
          ],
        }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("响应不是 JSON"); }
      if (!res.ok || data?.error) {
        const msg = data?.error?.message || data?.message || text.slice(0, 500);
        throw new Error(msg);
      }
      const originalSrc = extractImageDataUrlFromChatCompletionsResponse(data);
      if (!originalSrc) throw new Error("未能从响应中提取图片");
      if (typeof onStatus === "function") onStatus("去白底…");
      const processedSrc = await removeUnenclosedWhiteBackground(originalSrc);
      return { originalSrc, processedSrc };
    }

    async function saveCharacterAssetToLibrary(params) {
      const npcId = String(params?.npcId || "").trim();
      const prompt = String(params?.prompt || "").trim();
      const model = String(params?.model || "").trim();
      const processedSrc = String(params?.processedSrc || "").trim();
      const originalSrc = String(params?.originalSrc || "").trim();
      const idleDataUrl = String(params?.idleDataUrl || "").trim();
      if (!npcId) throw new Error("缺少 npcId");
      if (!processedSrc) throw new Error("缺少 sheetDataUrl");
      const payload = {
        title: npcId,
        prompt,
        sourceModel: model,
        imageSize: CONFIG.imageSize,
        columns: animator.columns,
        rows: animator.rows,
        tags: [`npc:${npcId}`],
        files: {
          sheetDataUrl: processedSrc,
          idleDataUrl,
          previewDataUrl: originalSrc || processedSrc,
        },
      };
      const result = await fetchJson(LIBRARY_API.saveCharacter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return result?.item || null;
    }

    function indexCharacterLibraryForNpcReuse(items) {
      const byNpcId = new Map();
      for (const it of (Array.isArray(items) ? items : [])) {
        const id = String(it?.id || "").trim();
        const title = String(it?.title || "").trim();
        if (id) byNpcId.set(id, it);
        if (title) byNpcId.set(title, it);
      }
      return byNpcId;
    }

    function findSceneObjectByIdNumeric(objectId) {
      const idNum = Number(objectId);
      if (!Number.isFinite(idNum)) return null;
      for (const o of (animator._sceneObjects || [])) {
        if (!o) continue;
        if (Number(o.id) === idNum) return o;
      }
      return null;
    }

    function ensureNpcEntitiesArray() {
      ensureSceneEntities();
      return animator._sceneEntities.npcs;
    }

    function getNpcEntityById(npcId) {
      const list = ensureNpcEntitiesArray();
      return list.find((n) => String(n?.npcId || "") === String(npcId || "")) || null;
    }

    function npcInventoryHasContent(inventory) {
      if (Array.isArray(inventory)) {
        return inventory.some((entry) => String(entry?.itemId || "").trim() && (Number(entry?.count) || 0) > 0);
      }
      return !!(inventory && typeof inventory === "object" && Object.keys(inventory).length);
    }

    function applyNpcStaticSpecToEntity(entity, spec) {
      const next = entity && typeof entity === "object" ? entity : {};
      next.npcId = String(spec?.npcId || next.npcId || "").trim();
      next.name = String(spec?.displayName || next.name || next.npcId || "").trim() || next.npcId;
      next.homeObjectId = Number.isFinite(Number(spec?.homeObjectId)) ? Number(spec.homeObjectId) : null;
      next.renderScale = Number.isFinite(Number(spec?.renderScale)) ? clampNpcRenderScale(spec.renderScale, 1) : (next.renderScale ?? 1);
      next.heightWorld = Number.isFinite(Number(spec?.heightWorld)) ? Math.max(1, Number(spec.heightWorld)) : Math.max(1, Number(next.heightWorld) || 4);
      if (!(next.needs && typeof next.needs === "object")) {
        next.needs = cloneJsonValue(spec?.simDefaults?.needs || {}) || {};
      }
      if (!npcInventoryHasContent(next.inventory)) {
        next.inventory = cloneJsonValue(spec?.initialInventory || []) || [];
      }
      if (!Array.isArray(next.memory)) {
        next.memory = cloneJsonValue(spec?.initialMemories || []) || [];
      }
      if (!Array.isArray(next._initialMemory) || !next._initialMemory.length) {
        next._initialMemory = cloneJsonValue(spec?.initialMemories || []) || [];
      }
      if (!(next.current && typeof next.current === "object")) {
        next.current = { action: "idle", targetWx: null, targetWy: null };
      }
      if (!(next.dayPlan && typeof next.dayPlan === "object")) {
        next.dayPlan = null;
      }
      if (!(next.currentTask && typeof next.currentTask === "object")) {
        next.currentTask = null;
      }
      if (!Array.isArray(next.recentEvents)) {
        next.recentEvents = [];
      }
      if (!(next.relationships && typeof next.relationships === "object")) {
        next.relationships = {};
      }
      const prevMeta = next.meta && typeof next.meta === "object" ? next.meta : {};
      next.meta = Object.assign({}, prevMeta, {
        role: String(spec?.role || "").trim(),
        personality: cloneJsonValue(spec?.personality || []) || [],
        skills: cloneJsonValue(spec?.skills || []) || [],
        appearancePrompt: String(spec?.appearancePrompt || "").trim(),
      });
      next.anchors = cloneJsonValue(spec?.anchors || { home: "home", work: "", social: [], boundary: [] }) || { home: "home", work: "", social: [], boundary: [] };
      next.equipment = cloneJsonValue(spec?.equipment || []) || [];
      next.dailyPattern = cloneJsonValue(spec?.dailyPattern || { archetype: "", wakeMin: 360, sleepMin: 1260, defaultBlocks: [] }) || { archetype: "", wakeMin: 360, sleepMin: 1260, defaultBlocks: [] };
      next.activityProfile = cloneJsonValue(spec?.activityProfile || { primary: [], secondary: [], facilityUse: [] }) || { primary: [], secondary: [], facilityUse: [] };
      next.socialProfile = cloneJsonValue(spec?.socialProfile || { closeTo: [], tradeWith: [], chatTopics: [] }) || { closeTo: [], tradeWith: [], chatTopics: [] };
      next.emotionBias = cloneJsonValue(spec?.emotionBias || { baselineMood: 0, stressors: [], comforts: [] }) || { baselineMood: 0, stressors: [], comforts: [] };
      next.storyHooks = cloneJsonValue(spec?.storyHooks || []) || [];
      const emotions = next.emotions && typeof next.emotions === "object" ? next.emotions : {};
      next.emotions = {
        mood: clampInt(emotions.mood, -10, 10, clampInt(spec?.initialEmotions?.mood, -10, 10, 0)),
        stress: clampInt(emotions.stress, 0, 100, clampInt(spec?.initialEmotions?.stress, 0, 100, 0)),
        hope: clampInt(emotions.hope, 0, 100, clampInt(spec?.initialEmotions?.hope, 0, 100, 0)),
        frustration: clampInt(emotions.frustration, 0, 100, clampInt(spec?.initialEmotions?.frustration, 0, 100, 0)),
      };
      return next;
    }

    async function hydrateNpcDesignForScene(sceneId, options = {}) {
      const cache = await loadNpcDesign(sceneId);
      const byNpcId = cache?.byNpcId || new Map();
      let updated = 0;
      for (const npc of (animator._sceneEntities?.npcs || [])) {
        const npcId = String(npc?.npcId || "").trim();
        if (!npcId) continue;
        const rawDesign = byNpcId.get(npcId);
        if (!rawDesign) continue;
        const design = normalizeNpcDesignEntry(rawDesign);
        const baselineMood = clampInt(design?.emotionBias?.baselineMood, -10, 10, 0);
        npc.anchors = cloneJsonValue(design.anchors) || { home: "home", work: "", social: [], boundary: [] };
        npc.equipment = cloneJsonValue(design.loadout?.equipment || []) || [];
        if (!npcInventoryHasContent(npc.inventory)) {
          npc.inventory = cloneJsonValue(design.loadout?.inventory || []) || [];
        }
        npc.dailyPattern = cloneJsonValue(design.dailyPattern) || { archetype: "", wakeMin: 360, sleepMin: 1260, defaultBlocks: [] };
        npc.activityProfile = cloneJsonValue(design.activityProfile) || { primary: [], secondary: [], facilityUse: [] };
        npc.socialProfile = cloneJsonValue(design.socialProfile) || { closeTo: [], tradeWith: [], chatTopics: [] };
        npc.emotionBias = cloneJsonValue(design.emotionBias) || { baselineMood: 0, stressors: [], comforts: [] };
        npc.storyHooks = cloneJsonValue(design.storyHooks || []) || [];
        const emotions = npc.emotions && typeof npc.emotions === "object" ? npc.emotions : {};
        npc.emotions = {
          mood: clampInt(emotions.mood, -10, 10, baselineMood),
          stress: clampInt(emotions.stress, 0, 100, 0),
          hope: clampInt(emotions.hope, 0, 100, 0),
          frustration: clampInt(emotions.frustration, 0, 100, 0),
        };
        updated++;
      }
      if (updated > 0 && options.autosave !== false) {
        scheduleNpcSceneAutosave(options.reason || "npc-design-hydrate");
      }
      return { updated, missing: cache?.missing === true };
    }

    function upsertNpcEntity(entity) {
      const npcId = String(entity?.npcId || "").trim();
      if (!npcId) return null;
      const list = ensureNpcEntitiesArray();
      const idx = list.findIndex((n) => String(n?.npcId || "") === npcId);
      if (idx >= 0) {
        list[idx] = Object.assign({}, list[idx], entity);
        return list[idx];
      }
      list.push(Object.assign({}, entity));
      return list[list.length - 1];
    }

    function ensureNpcSimExtension() {
      if (!animator._sceneExtensions || typeof animator._sceneExtensions !== "object") {
        animator._sceneExtensions = {};
      }
      if (!animator._sceneExtensions.npcSim || typeof animator._sceneExtensions.npcSim !== "object") {
        animator._sceneExtensions.npcSim = {
          version: 2,
          dayIndex: 1,
          lastTimePercent: null,
          lastMinuteOfDay: null,
          lastDayKey: "",
          lastConversationAt: {},
          playerConversationAt: {},
        };
      }
      const sim = animator._sceneExtensions.npcSim;
      sim.version = 2;
      sim.dayIndex = Math.max(1, Math.floor(Number(sim.dayIndex) || 1));
      if (!sim.lastConversationAt || typeof sim.lastConversationAt !== "object") sim.lastConversationAt = {};
      if (!sim.playerConversationAt || typeof sim.playerConversationAt !== "object") sim.playerConversationAt = {};
      return sim;
    }

    function getNpcClockState() {
      const cycle = getDayNightCycle();
      const sim = ensureNpcSimExtension();
      const percent = clampNumber(getDayNightTimePercent(cycle), 0, 100);
      const lastPercent = Number(sim.lastTimePercent);
      if (Number.isFinite(lastPercent) && lastPercent > 90 && percent < 10) {
        sim.dayIndex = Math.max(1, Math.floor(Number(sim.dayIndex) || 1) + 1);
      }
      sim.lastTimePercent = percent;
      const minuteOfDay = Math.max(0, Math.min(1439, Math.floor((percent / 100) * 1440)));
      sim.lastMinuteOfDay = minuteOfDay;
      sim.lastDayKey = `day-${sim.dayIndex}`;
      const hour = Math.floor(minuteOfDay / 60);
      const minute = minuteOfDay % 60;
      const sample = sampleDayNightCycle(cycle);
      return {
        dayIndex: sim.dayIndex,
        dayKey: sim.lastDayKey,
        minuteOfDay,
        percent,
        phaseLabel: String(sample?.phaseLabel || "day"),
        timeLabel: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      };
    }

    const NPC_ITEM_DISPLAY_NAMES = {
      arrow: "箭",
      bow: "弓",
      knife: "小刀",
      coin_copper: "铜钱",
      coin_silver: "银钱",
      rabbit_meat: "兔肉",
      fur: "毛皮",
      small_bird: "小鸟",
      firewood: "柴火",
      vegetable: "蔬菜",
      raw_meat: "生肉",
      cooked_meal: "熟食",
      herb: "草药",
      berry: "浆果",
      wildflower: "野花",
      shiny_stone: "亮石",
      rope: "麻绳",
      snare: "套索",
      tea_leaf: "茶叶",
      small_snack: "点心",
      cloth_patch: "布补丁",
      wood_piece: "木片",
      repaired_tool: "修好的工具",
      dried_food: "干粮",
      dried_meat: "肉干",
      tea_brick: "茶砖",
      cloth_roll: "布卷",
      small_goods: "杂货",
      tray: "托盘",
      prayer_beads: "念珠",
      medicine_pouch: "药囊",
      ledger: "账本",
      key_ring: "钥匙串",
    };

    function getNpcItemDisplayName(itemLike) {
      if (itemLike && typeof itemLike === "object") {
        const name = String(itemLike.name || itemLike.displayName || "").trim();
        if (name) return name;
      }
      const key = String(itemLike?.itemId || itemLike || "").trim();
      if (!key) return "";
      return NPC_ITEM_DISPLAY_NAMES[key] || key.replace(/_/g, " ");
    }

    function makeLooseNpcItemId(text) {
      const raw = String(text || "").trim();
      if (!raw) return "";
      const ascii = raw.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
      return ascii || `item_${hashSeedText(raw).toString(16)}`;
    }

    function sanitizeNpcInventoryEntry(entry) {
      if (!entry || typeof entry !== "object") return null;
      const itemId = String(entry.itemId || entry.id || "").trim();
      const count = Math.max(0, Math.floor(Number(entry.count) || 0));
      if (!itemId || count <= 0) return null;
      const name = String(entry.name || entry.displayName || "").trim() || getNpcItemDisplayName({ itemId });
      const icon = typeof entry.icon === "string" ? entry.icon : "";
      const description = typeof entry.description === "string" ? entry.description : "";
      const tags = Array.isArray(entry.tags) ? entry.tags.map((t) => String(t || "").trim()).filter(Boolean) : [];
      return { itemId, count, name, icon, description, tags };
    }

    function ensureNpcInventoryArray(npc) {
      if (!npc || typeof npc !== "object") return [];
      const raw = Array.isArray(npc.inventory) ? npc.inventory : [];
      const next = raw.map(sanitizeNpcInventoryEntry).filter(Boolean);
      npc.inventory = next;
      return next;
    }

    function findNpcInventoryEntry(npc, itemId) {
      const want = String(itemId || "").trim();
      if (!want) return null;
      const items = ensureNpcInventoryArray(npc);
      return items.find((entry) => String(entry?.itemId || "") === want) || null;
    }

    function pushNpcInventoryToast(npc, sign, itemLike, count = 1) {
      if (!npc || typeof npc !== "object") return;
      const qty = Math.max(1, Math.floor(Number(count) || 1));
      const text = `${sign}${getNpcItemDisplayName(itemLike)}x${qty}`;
      const runtime = npc._runtime && typeof npc._runtime === "object" ? npc._runtime : (npc._runtime = {});
      const list = Array.isArray(runtime.itemToasts) ? runtime.itemToasts : (runtime.itemToasts = []);
      list.push({
        text,
        sign: String(sign || "").trim(),
        startedAtTs: performance.now(),
        endsAtTs: performance.now() + NPC_ITEM_TOAST_MS,
      });
      runtime.itemToasts = list.slice(-4);
    }

    function addNpcInventoryItem(npc, itemLike, count = null, extra = {}) {
      if (!npc || typeof npc !== "object") return null;
      const itemId = String(itemLike?.itemId || itemLike || "").trim();
      if (!itemId) return null;
      const qty = Math.max(0, Math.floor(Number(count == null ? itemLike?.count : count) || 0));
      if (qty <= 0) return null;
      const items = ensureNpcInventoryArray(npc);
      let existing = items.find((entry) => String(entry?.itemId || "") === itemId) || null;
      if (!existing) {
        existing = sanitizeNpcInventoryEntry({
          itemId,
          count: qty,
          name: String(extra.name || itemLike?.name || "").trim() || getNpcItemDisplayName({ itemId }),
          icon: typeof extra.icon === "string" ? extra.icon : (typeof itemLike?.icon === "string" ? itemLike.icon : ""),
          description: typeof extra.description === "string" ? extra.description : (typeof itemLike?.description === "string" ? itemLike.description : ""),
          tags: Array.isArray(extra.tags) ? extra.tags : itemLike?.tags,
        });
        if (!existing) return null;
        items.push(existing);
      } else {
        existing.count = Math.max(0, Math.floor(Number(existing.count) || 0) + qty);
        if (!existing.name) existing.name = getNpcItemDisplayName(existing);
        if (!existing.icon && typeof itemLike?.icon === "string") existing.icon = itemLike.icon;
      }
      if (extra?.silentToast !== true) pushNpcInventoryToast(npc, "+", existing, qty);
      return existing;
    }

    function removeNpcInventoryItem(npc, itemId, count = 1, options = {}) {
      if (!npc || typeof npc !== "object") return null;
      const want = String(itemId || "").trim();
      const qty = Math.max(1, Math.floor(Number(count) || 1));
      if (!want) return null;
      const items = ensureNpcInventoryArray(npc);
      const idx = items.findIndex((entry) => String(entry?.itemId || "") === want);
      if (idx < 0) return null;
      const entry = items[idx];
      const takeN = Math.min(qty, Math.max(0, Math.floor(Number(entry.count) || 0)));
      if (takeN <= 0) return null;
      const taken = Object.assign({}, entry, { count: takeN });
      entry.count = Math.max(0, Math.floor(Number(entry.count) || 0) - takeN);
      if (entry.count <= 0) items.splice(idx, 1);
      if (options?.silentToast !== true) pushNpcInventoryToast(npc, "-", taken, takeN);
      return taken;
    }

    function npcHasInventoryItem(npc, itemId, count = 1) {
      const entry = findNpcInventoryEntry(npc, itemId);
      return (Number(entry?.count) || 0) >= Math.max(1, Math.floor(Number(count) || 1));
    }

    function npcInventoryEntryToHotbarSlot(entry) {
      const clean = sanitizeNpcInventoryEntry(entry);
      if (!clean) return null;
      const displayName = clean.name || getNpcItemDisplayName(clean);
      const root = ensureDropAgentStore();
      const rec = root.itemsByName?.[displayName];
      if (rec?.icon && !clean.icon) clean.icon = rec.icon;
      return sanitizeHotbarSlotForStorage({
        itemId: clean.itemId,
        name: displayName,
        icon: clean.icon || "",
        description: clean.description || "",
        tags: clean.tags || [],
        count: clean.count,
      });
    }

    function hotbarSlotToNpcInventoryEntry(slot, count = 1) {
      const clean = sanitizeHotbarSlotForStorage(slot);
      if (!clean) return null;
      return sanitizeNpcInventoryEntry({
        itemId: String(slot?.itemId || "").trim() || makeLooseNpcItemId(clean.name),
        count: Math.max(1, Math.floor(Number(count) || 1)),
        name: clean.name,
        icon: clean.icon,
        description: clean.description,
        tags: clean.tags,
      });
    }

    function addStackToPlayerHotbar(stack) {
      const clean = sanitizeHotbarSlotForStorage(stack);
      if (!clean) return false;
      const slots = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : (animator.hotbarSlots = Array(9).fill(null));
      let remaining = cloneSlotStack(clean);
      for (let i = 0; i < slots.length && remaining; i++) {
        const cur = sanitizeHotbarSlotForStorage(slots[i]);
        if (!cur || !stacksCompatibleForMerge(cur, remaining)) continue;
        cur.count = Math.max(1, Math.floor(Number(cur.count) || 1)) + Math.max(1, Math.floor(Number(remaining.count) || 1));
        slots[i] = cur;
        remaining = null;
      }
      if (remaining) {
        const idx = slots.findIndex((slot) => !sanitizeHotbarSlotForStorage(slot));
        if (idx < 0) return false;
        slots[idx] = remaining;
      }
      persistHotbarState();
      syncFxHotbarUi();
      renderFxCodexPanel();
      return true;
    }

    function removePlayerHotbarItem(itemRef, count = 1) {
      const ref = String(itemRef || "").trim();
      const qty = Math.max(1, Math.floor(Number(count) || 1));
      if (!ref) return null;
      const slots = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
      for (let i = 0; i < slots.length; i++) {
        const clean = sanitizeHotbarSlotForStorage(slots[i]);
        if (!clean) continue;
        const itemId = String(clean.itemId || "").trim();
        if (itemId !== ref && String(clean.name || "").trim() !== ref) continue;
        const { taken, left } = takeFromStack(clean, qty);
        slots[i] = left;
        persistHotbarState();
        syncFxHotbarUi();
        renderFxCodexPanel();
        return taken;
      }
      return null;
    }

    function findNpcInventoryEntryByRef(npc, itemRef) {
      const ref = String(itemRef || "").trim();
      if (!ref) return null;
      return ensureNpcInventoryArray(npc).find((entry) => (
        String(entry?.itemId || "").trim() === ref ||
        String(entry?.name || "").trim() === ref
      )) || null;
    }

    function normalizeNpcPlayerTradePayload(raw) {
      const obj = raw && typeof raw === "object" ? raw : {};
      if (obj.happened !== true) return { happened: false };
      const from = String(obj.from || "").trim().toLowerCase();
      const to = String(obj.to || "").trim().toLowerCase();
      const itemRef = String(obj.itemId || obj.itemName || obj.name || "").trim();
      const count = Math.max(1, Math.floor(Number(obj.count) || 1));
      const normalizedFrom = from === "npc" || from === "player" ? from : "";
      const normalizedTo = to === "npc" || to === "player" ? to : "";
      if (!normalizedFrom || !normalizedTo || normalizedFrom === normalizedTo || !itemRef) return { happened: false };
      return {
        happened: true,
        from: normalizedFrom,
        to: normalizedTo,
        itemRef,
        count,
      };
    }

    function applyNpcPlayerTradePayload(npc, trade) {
      const t = normalizeNpcPlayerTradePayload(trade);
      if (t.happened !== true) return null;
      const npcName = String(npc?.name || npc?.npcId || "NPC");
      if (t.from === "npc" && t.to === "player") {
        const entry = findNpcInventoryEntryByRef(npc, t.itemRef);
        if (!entry) return { success: false, summary: `${npcName}没有可交换的${t.itemRef}。` };
        const moved = removeNpcInventoryItem(npc, entry.itemId, t.count, { silentToast: true });
        const slot = npcInventoryEntryToHotbarSlot(moved);
        if (!moved || !slot) return { success: false, summary: "交易物品移动失败。" };
        if (!addStackToPlayerHotbar(slot)) {
          addNpcInventoryItem(npc, moved, moved.count, Object.assign({}, moved, { silentToast: true }));
          return { success: false, summary: "你的快捷栏已满，交易没有完成。" };
        }
        pushNpcInventoryToast(npc, "-", moved, moved.count);
        return { success: true, summary: `${npcName}给了你${getNpcItemDisplayName(moved)}x${moved.count}。` };
      }
      if (t.from === "player" && t.to === "npc") {
        const moved = removePlayerHotbarItem(t.itemRef, t.count);
        if (!moved) return { success: false, summary: `你没有可交出的${t.itemRef}。` };
        const entry = hotbarSlotToNpcInventoryEntry(moved, moved.count);
        if (!entry) {
          addStackToPlayerHotbar(moved);
          return { success: false, summary: "交易物品无法识别，已退回。" };
        }
        addNpcInventoryItem(npc, entry, entry.count, entry);
        return { success: true, summary: `你给了${npcName}${entry.name}x${entry.count}。` };
      }
      return { success: false, summary: "交易方向无效。" };
    }

    function pushNpcRecentEvent(npc, eventLike) {
      if (!npc || typeof npc !== "object") return;
      if (!Array.isArray(npc.recentEvents)) npc.recentEvents = [];
      const evt = cloneJsonValue(eventLike) || {};
      npc.recentEvents.push(evt);
      if (npc.recentEvents.length > 18) {
        npc.recentEvents = npc.recentEvents.slice(-18);
      }
      if (!Array.isArray(npc.memory)) npc.memory = [];
      if (evt.summary) {
        npc.memory.push(String(evt.summary).trim());
        if (npc.memory.length > 32) npc.memory = npc.memory.slice(-32);
      }
    }

    function ensureNpcRelationship(npc, otherId) {
      if (!npc || typeof npc !== "object") return { affection: 0, trust: 0, tension: 0 };
      if (!npc.relationships || typeof npc.relationships !== "object") npc.relationships = {};
      const key = String(otherId || "").trim();
      if (!key) return { affection: 0, trust: 0, tension: 0 };
      if (!npc.relationships[key] || typeof npc.relationships[key] !== "object") {
        npc.relationships[key] = { affection: 0, trust: 0, tension: 0, lastTalkDayKey: "", lastTalkMinute: -1 };
      }
      const rec = npc.relationships[key];
      rec.affection = clampInt(rec.affection, -10, 10, 0);
      rec.trust = clampInt(rec.trust, -10, 10, 0);
      rec.tension = clampInt(rec.tension, 0, 10, 0);
      rec.lastTalkDayKey = String(rec.lastTalkDayKey || "").trim();
      rec.lastTalkMinute = Number.isFinite(Number(rec.lastTalkMinute)) ? Math.floor(Number(rec.lastTalkMinute)) : -1;
      return rec;
    }

    function applyNpcRelationshipDelta(npc, otherId, delta = {}) {
      const rec = ensureNpcRelationship(npc, otherId);
      rec.affection = clampInt(rec.affection + (Number(delta.affection) || 0), -10, 10, 0);
      rec.trust = clampInt(rec.trust + (Number(delta.trust) || 0), -10, 10, 0);
      rec.tension = clampInt(rec.tension + (Number(delta.tension) || 0), 0, 10, 0);
      return rec;
    }

    function applyNpcEmotionDelta(npc, delta = {}) {
      if (!npc || typeof npc !== "object") return;
      const emotions = npc.emotions && typeof npc.emotions === "object" ? npc.emotions : (npc.emotions = { mood: 0, stress: 0, hope: 0, frustration: 0 });
      emotions.mood = clampInt((Number(emotions.mood) || 0) + (Number(delta.mood) || 0), -10, 10, 0);
      emotions.stress = clampInt((Number(emotions.stress) || 0) + (Number(delta.stress) || 0), 0, 100, 0);
      emotions.hope = clampInt((Number(emotions.hope) || 0) + (Number(delta.hope) || 0), 0, 100, 0);
      emotions.frustration = clampInt((Number(emotions.frustration) || 0) + (Number(delta.frustration) || 0), 0, 100, 0);
    }

    function findWalkablePointNear(x, y, canvas = getLogicCanvas(), radiusStep = 5, rings = 8) {
      const fx = Number(x) || 0;
      const fy = Number(y) || 0;
      if (isNpcStandPointWalkable(fx, fy, canvas)) return { x: fx, y: fy };
      for (let ring = 1; ring <= rings; ring++) {
        const r = ring * radiusStep;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const tx = fx + Math.cos(a) * r;
          const ty = fy + Math.sin(a) * r;
          if (isNpcStandPointWalkable(tx, ty, canvas)) return { x: tx, y: ty };
        }
      }
      return { x: fx, y: fy };
    }

    function getVillageAnchorSummary() {
      const objects = Array.isArray(animator._sceneObjects) ? animator._sceneObjects : [];
      const houses = objects.filter((o) => Array.isArray(o?.tags) && o.tags.includes("house"));
      const points = houses.length ? houses : objects.slice(0, 6);
      if (!points.length) {
        return { centerX: Number(animator.worldX) || 0, centerY: Number(animator.worldY) || 0 };
      }
      let sumX = 0;
      let sumY = 0;
      for (const o of points) {
        sumX += Number(o?.wx) || 0;
        sumY += Number(o?.wy) || 0;
      }
      return { centerX: sumX / points.length, centerY: sumY / points.length };
    }

    function getSceneObjectByPredicate(predicate) {
      for (const o of (animator._sceneObjects || [])) {
        if (predicate(o)) return o;
      }
      return null;
    }

    function resolveNpcLocationRef(npc, locationRef, canvas = getLogicCanvas()) {
      const ref = String(locationRef || "home").trim() || "home";
      const home = npc?.homeObjectId != null ? findSceneObjectByIdNumeric(npc.homeObjectId) : null;
      const village = getVillageAnchorSummary();
      const well = getSceneObjectByPredicate((o) => Array.isArray(o?.interactionTags) && o.interactionTags.includes("item:water-source"));
      const forge = getSceneObjectByPredicate((o) => Array.isArray(o?.interactionTags) && o.interactionTags.includes("item:crafting"));
      const inn = findSceneObjectByIdNumeric(1);
      const yang = findSceneObjectByIdNumeric(3);
      const hunter = findSceneObjectByIdNumeric(4);
      const temple = findSceneObjectByIdNumeric(5);
      const offsets = {
        inn_backroom: { object: inn, dx: 10, dy: -2 },
        inn_counter: { object: inn, dx: 16, dy: 4 },
        inn_kitchen: { object: inn, dx: -10, dy: 12 },
        inn_hall: { object: inn, dx: 8, dy: 16 },
        inn_door: { object: inn, dx: 0, dy: 20 },
        inn_sidebed: { object: inn, dx: -14, dy: 4 },
        inn_yard: { object: inn, dx: 18, dy: 20 },
        temple_hall: { object: temple, dx: 0, dy: 10 },
        temple_courtyard: { object: temple, dx: 18, dy: 20 },
        temple_gate: { object: temple, dx: 0, dy: 24 },
        temple_guestroom: { object: temple, dx: -16, dy: 8 },
        market_spot: { x: village.centerX + 34, y: village.centerY + 2 },
        market_spot_side: { x: village.centerX + 26, y: village.centerY + 10 },
        market_road: { x: village.centerX + 20, y: village.centerY - 2 },
        yang_house_yard: { object: yang, dx: 12, dy: 18 },
        yang_house_gate: { object: yang, dx: 0, dy: 22 },
        hunter_house_yard: { object: hunter, dx: 8, dy: 20 },
        well_side: { object: well, dx: 8, dy: 6 },
        village_path: { x: village.centerX - 10, y: village.centerY + 8 },
        forest_edge_west: { x: (Number(hunter?.wx) || village.centerX) - 64, y: (Number(hunter?.wy) || village.centerY) + 6 },
        forest_edge_north: { x: (Number(hunter?.wx) || village.centerX) - 26, y: (Number(hunter?.wy) || village.centerY) - 64 },
      };
      if (ref === "home") {
        return computeNpcHomeAnchor(home, Number(npc?.wx) || village.centerX, Number(npc?.wy) || village.centerY, canvas);
      }
      if (ref === "free_roam_village") {
        const socialRefs = Array.isArray(npc?.anchors?.social) ? npc.anchors.social : [];
        const pool = socialRefs.length ? socialRefs : ["well_side", "market_road", "village_path", "home"];
        const pick = pool[Math.floor(Math.random() * pool.length)] || "home";
        return resolveNpcLocationRef(npc, pick, canvas);
      }
      const info = offsets[ref] || null;
      if (info?.object) {
        const baseX = Number(info.object.wx) || village.centerX;
        const baseY = Number(info.object.wy) || village.centerY;
        return findWalkablePointNear(baseX + (Number(info.dx) || 0), baseY + (Number(info.dy) || 0), canvas);
      }
      if (Number.isFinite(Number(info?.x)) && Number.isFinite(Number(info?.y))) {
        return findWalkablePointNear(Number(info.x), Number(info.y), canvas);
      }
      if (ref === "work" && npc?.anchors?.work) {
        return resolveNpcLocationRef(npc, npc.anchors.work, canvas);
      }
      return computeNpcHomeAnchor(home, Number(npc?.wx) || village.centerX, Number(npc?.wy) || village.centerY, canvas);
    }

    function getNpcTaskFacilityType(block) {
      const explicit = String(block?.useFacility || "").trim();
      if (explicit) return explicit;
      const activityType = String(block?.activityType || "").trim();
      if (!activityType) return "";
      if (activityType === "cook_food" || activityType === "prepare_fire" || activityType === "prepare_ingredients") return "stove";
      if (activityType === "carry_water") return "well";
      if (activityType === "repair_item" || activityType === "repair_gear") return "workbench";
      if (activityType === "restock" || activityType === "inventory_check") return "storage";
      return "";
    }

    function getNpcFacilityDefinition(type) {
      const key = String(type || "").trim();
      if (!key) return null;
      const raw = animator._npcDesignContext?.facilities?.[key];
      if (!raw || typeof raw !== "object") return null;
      return {
        type: key,
        kind: String(raw.kind || "virtual").trim(),
        objectId: raw.objectId,
        locationRef: String(raw.locationRef || "").trim(),
        actionLabel: String(raw.actionLabel || "").trim(),
        summary: String(raw.summary || "").trim(),
        possibleOutputs: normalizeNpcInventoryList(raw.possibleOutputs),
        emotionDelta: raw.emotionDelta && typeof raw.emotionDelta === "object" ? raw.emotionDelta : {},
      };
    }

    function resolveNpcFacilityContext(npc, facilityType, block, canvas = getLogicCanvas()) {
      const def = getNpcFacilityDefinition(facilityType);
      if (!def) return null;
      const object = def.objectId != null ? findSceneObjectByIdNumeric(def.objectId) : null;
      let anchor = null;
      if (object) {
        anchor = findWalkablePointNear(Number(object.wx) || 0, Number(object.wy) || 0, canvas);
      }
      if (!anchor && def.locationRef) {
        anchor = resolveNpcLocationRef(npc, def.locationRef, canvas);
      }
      if (!anchor) {
        anchor = resolveNpcLocationRef(npc, block?.locationRef || "home", canvas);
      }
      let profile = null;
      if (object) {
        const rec = ensureFacilityRecordForObject(object);
        profile = rec?.profile || null;
      }
      return {
        type: def.type,
        kind: def.kind,
        object,
        objectId: object?.id ?? def.objectId ?? null,
        anchor,
        actionLabel: String(profile?.actionLabel || def.actionLabel || "使用").trim(),
        summary: String(profile?.summary || def.summary || "").trim(),
        possibleOutputs: def.possibleOutputs,
        emotionDelta: def.emotionDelta,
      };
    }

    function getNpcActivityResolver(activityType) {
      const key = String(activityType || "").trim();
      const root = animator._npcDesignContext?.activityResolvers;
      const raw = root && typeof root === "object" ? root[key] : null;
      if (!raw || typeof raw !== "object") return null;
      return {
        consumes: normalizeNpcInventoryList(raw.consumes),
        possibleOutputs: normalizeNpcInventoryList(raw.possibleOutputs),
        energyDelta: Number(raw.energyDelta) || 0,
      };
    }

    function weightedPickEntry(entries) {
      const list = Array.isArray(entries) ? entries.filter((entry) => (Number(entry?.weight) || 0) > 0) : [];
      if (!list.length) return null;
      const total = list.reduce((sum, entry) => sum + Math.max(0, Number(entry.weight) || 0), 0);
      if (!(total > 0)) return list[0] || null;
      let roll = Math.random() * total;
      for (const entry of list) {
        roll -= Math.max(0, Number(entry.weight) || 0);
        if (roll <= 0) return entry;
      }
      return list[list.length - 1] || null;
    }

    function buildNpcTemplateDayPlan(npc, clock) {
      const pattern = npc?.dailyPattern && typeof npc.dailyPattern === "object" ? npc.dailyPattern : {};
      const sourceBlocks = normalizeNpcDefaultBlocks(pattern.defaultBlocks);
      const seedText = `${String(npc?.npcId || "")}:${String(clock?.dayKey || "")}`;
      const rand = createSeededRandom(hashSeedText(seedText));
      const blocks = sourceBlocks
        .map((block, idx) => {
          const jitter = Math.round((rand() - 0.5) * 18);
          const startMin = Math.max(0, block.startMin + jitter);
          const duration = Math.max(10, block.endMin - block.startMin);
          const endMin = Math.min(1439, Math.max(startMin + 10, startMin + duration));
          return Object.assign({}, block, {
            taskId: `${clock.dayKey}:${idx}:${block.activityType}`,
            startMin,
            endMin,
          });
        })
        .sort((a, b) => a.startMin - b.startMin);
      return {
        dayKey: clock?.dayKey || "day-1",
        dayIndex: Math.max(1, Math.floor(Number(clock?.dayIndex) || 1)),
        source: "template",
        model: "",
        generatedAt: Date.now(),
        summary: "",
        blocks,
      };
    }

    function normalizeNpcPlanPayload(payload, npc, clock) {
      const parsed = payload && typeof payload === "object" ? payload : {};
      const blocks = normalizeNpcDefaultBlocks(parsed.blocks)
        .map((block, idx) => Object.assign({}, block, {
          taskId: `${clock.dayKey}:${idx}:${block.activityType}`,
        }))
        .sort((a, b) => a.startMin - b.startMin);
      if (!blocks.length) return null;
      return {
        dayKey: clock.dayKey,
        dayIndex: clock.dayIndex,
        source: "llm",
        model: NPC_LLM_MODEL,
        generatedAt: Date.now(),
        summary: String(parsed.summary || "").trim(),
        blocks,
      };
    }

    async function requestNpcDailyPlanFromLlm(npc, clock) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) return null;
      const fallback = buildNpcTemplateDayPlan(npc, clock);
      const allowedRefs = Object.keys(animator._npcDesignContext?.locationRefs || {});
      const prompt = [
        "你在给一个像素村庄 NPC 生成当天日程。",
        "只输出 JSON，不要解释，不要 markdown。",
        "格式：",
        "{\"summary\":\"\",\"blocks\":[{\"activityType\":\"\",\"startMin\":0,\"endMin\":60,\"locationRef\":\"home\",\"mode\":\"must_do\",\"wanderRadius\":6,\"arrivalSlackMin\":12,\"useFacility\":\"\",\"note\":\"\"}]}",
        `当前日期键：${clock.dayKey}，当前时间：${clock.timeLabel}，阶段：${clock.phaseLabel}`,
        `NPC：${String(npc?.name || npc?.npcId || "").trim()}`,
        `身份：${String(npc?.meta?.role || "").trim()}`,
        `性格：${Array.isArray(npc?.meta?.personality) ? npc.meta.personality.join("、") : ""}`,
        `技能：${Array.isArray(npc?.meta?.skills) ? npc.meta.skills.join("、") : ""}`,
        `情绪基线：${String(npc?.emotionBias?.baselineMood ?? 0)}`,
        `最近记忆：${Array.isArray(npc?.memory) ? npc.memory.slice(-4).join(" | ") : ""}`,
        `最近事件：${Array.isArray(npc?.recentEvents) ? npc.recentEvents.slice(-4).map((evt) => evt.summary || evt.text || evt.type || "").join(" | ") : ""}`,
        `可用位置：${allowedRefs.join(",")}`,
        `优先活动：${Array.isArray(npc?.activityProfile?.primary) ? npc.activityProfile.primary.join(",") : ""}`,
        `次要活动：${Array.isArray(npc?.activityProfile?.secondary) ? npc.activityProfile.secondary.join(",") : ""}`,
        `设施偏好：${Array.isArray(npc?.activityProfile?.facilityUse) ? npc.activityProfile.facilityUse.join(",") : ""}`,
        `默认模板：${JSON.stringify(fallback.blocks)}`,
        "要求：",
        "1) blocks 保持 4 到 6 条；2) startMin/endMin 用 0-1439 的整数；3) locationRef 只能从可用位置里选；4) 贴近默认模板，允许小幅调整；5) 不要让时间重叠；6) 需要回家睡觉的角色把最后一段安排在 home 或 home 附近。",
      ].join("\n");
      const res = await fetch(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model: NPC_LLM_MODEL,
          temperature: 0.6,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`npc daily plan http ${res.status}: ${raw.slice(0, 240)}`);
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("npc daily plan response not json");
      }
      const text = stripJsonFence(extractChatContentText(data?.choices?.[0]?.message?.content || ""));
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = /\{[\s\S]*\}/.exec(text);
        if (m) parsed = JSON.parse(m[0]);
      }
      return normalizeNpcPlanPayload(parsed, npc, clock);
    }

    function ensureNpcDayPlanAsync(npc, clock) {
      if (!npc || typeof npc !== "object") return;
      if (npc.dayPlan && npc.dayPlan.dayKey === clock.dayKey && Array.isArray(npc.dayPlan.blocks) && npc.dayPlan.blocks.length) {
        return;
      }
      npc.dayPlan = buildNpcTemplateDayPlan(npc, clock);
      const npcId = String(npc.npcId || "").trim();
      if (!npcId || _npcDayPlanRequestByNpcId.has(npcId)) return;
      const task = (async () => {
        try {
          const llmPlan = await requestNpcDailyPlanFromLlm(npc, clock);
          if (llmPlan && npc.dayPlan?.dayKey === clock.dayKey) {
            npc.dayPlan = llmPlan;
            npc.currentTask = null;
            pushNpcRecentEvent(npc, {
              type: "daily_plan",
              dayKey: clock.dayKey,
              minuteOfDay: clock.minuteOfDay,
              summary: llmPlan.summary || `${String(npc.name || npc.npcId)}调整了今天的安排。`,
            });
            scheduleNpcSceneAutosave("npc-day-plan");
          }
        } catch (err) {
          console.warn("[npc-day-plan-llm-failed]", npcId, err);
        } finally {
          _npcDayPlanRequestByNpcId.delete(npcId);
        }
      })();
      _npcDayPlanRequestByNpcId.set(npcId, task);
    }

    function isNpcInSleepWindow(npc, clock) {
      const minute = Math.max(0, Math.floor(Number(clock?.minuteOfDay) || 0));
      const wakeMin = Math.max(0, Math.round(Number(npc?.dailyPattern?.wakeMin) || 360));
      const sleepMin = Math.max(0, Math.round(Number(npc?.dailyPattern?.sleepMin) || 1260));
      return minute < wakeMin || minute >= sleepMin;
    }

    function getNpcPlanTargetBlock(npc, clock) {
      const blocks = Array.isArray(npc?.dayPlan?.blocks) ? npc.dayPlan.blocks.slice().sort((a, b) => a.startMin - b.startMin) : [];
      const minute = Math.max(0, Math.floor(Number(clock?.minuteOfDay) || 0));
      if (!blocks.length) return isNpcInSleepWindow(npc, clock) ? { kind: "sleep", block: null } : { kind: "home", block: null };
      for (const block of blocks) {
        if (minute >= block.startMin && minute < block.endMin) return { kind: "active", block };
      }
      for (const block of blocks) {
        const slack = Math.max(0, Math.round(Number(block.arrivalSlackMin) || 0));
        if (minute >= Math.max(0, block.startMin - slack) && minute < block.startMin) {
          return { kind: "travel", block };
        }
      }
      if (isNpcInSleepWindow(npc, clock)) {
        return { kind: "sleep", block: null };
      }
      return { kind: "idle", block: blocks[blocks.length - 1] || null };
    }

    function maybeStartNpcTask(npc, block, clock) {
      const taskId = String(block?.taskId || "").trim();
      if (!taskId) return;
      const current = npc.currentTask && typeof npc.currentTask === "object" ? npc.currentTask : null;
      if (current && current.dayKey === clock.dayKey && current.taskId === taskId) return;
      npc.currentTask = {
        dayKey: clock.dayKey,
        taskId,
        activityType: String(block.activityType || "").trim(),
        locationRef: String(block.locationRef || "home").trim() || "home",
        state: "travel_to_task",
        startedMinute: clock.minuteOfDay,
        blockStartMin: Math.max(0, Math.round(Number(block.startMin) || 0)),
        blockEndMin: Math.max(0, Math.round(Number(block.endMin) || 0)),
        performed: false,
        useFacility: getNpcTaskFacilityType(block),
      };
      npc.currentTask.facilityUsePlanned = npc.currentTask.useFacility ? Math.random() < 0.5 : false;
    }

    function shouldPerformNpcActivityNow(task, block, clock) {
      if (!task || task.performed === true) return false;
      const start = Math.max(0, Math.round(Number(block?.startMin) || 0));
      const end = Math.max(start, Math.round(Number(block?.endMin) || start));
      const duration = Math.max(1, end - start);
      const triggerMin = start + Math.max(4, Math.floor(duration * 0.35));
      return Math.max(0, Math.floor(Number(clock?.minuteOfDay) || 0)) >= triggerMin;
    }

    function applyNpcActivityResult(npc, block, clock, facilityContext = null) {
      const activityType = String(block?.activityType || "").trim();
      const baseResolver = getNpcActivityResolver(activityType);
      const facilityOutputs = Array.isArray(facilityContext?.possibleOutputs) ? facilityContext.possibleOutputs : [];
      const resolver = baseResolver || (facilityContext ? {
        consumes: [],
        possibleOutputs: facilityOutputs,
        energyDelta: 0,
      } : null);
      const summaryName = String(npc?.name || npc?.npcId || "").trim() || "NPC";
      if (!resolver) {
        const summary = `${summaryName}在${getNpcItemDisplayName(activityType) || activityType}上花了一些时间。`;
        pushNpcRecentEvent(npc, {
          type: "activity",
          activityType,
          dayKey: clock.dayKey,
          minuteOfDay: clock.minuteOfDay,
          summary,
        });
        return { success: true, summary };
      }
      for (const consume of (resolver.consumes || [])) {
        if (consume.optional !== true && !npcHasInventoryItem(npc, consume.itemId, consume.count || 1)) {
          const summary = `${summaryName}想做${activityType}，但缺少${getNpcItemDisplayName(consume)}。`;
          pushNpcRecentEvent(npc, {
            type: "activity_failed",
            activityType,
            dayKey: clock.dayKey,
            minuteOfDay: clock.minuteOfDay,
            summary,
          });
          applyNpcEmotionDelta(npc, { frustration: 2, mood: -1 });
          return { success: false, summary };
        }
      }
      for (const consume of (resolver.consumes || [])) {
        if (npcHasInventoryItem(npc, consume.itemId, consume.count || 1)) {
          removeNpcInventoryItem(npc, consume.itemId, consume.count || 1);
        }
      }
      const outputPool = (Array.isArray(resolver.possibleOutputs) && resolver.possibleOutputs.length)
        ? resolver.possibleOutputs
        : facilityOutputs;
      const pick = weightedPickEntry(outputPool || []);
      const outputs = [];
      if (pick && String(pick.itemId || "").trim() && String(pick.itemId) !== "nothing") {
        const countMin = Math.max(1, Math.floor(Number(pick.countMin) || Number(pick.count) || 1));
        const countMax = Math.max(countMin, Math.floor(Number(pick.countMax) || Number(pick.count) || countMin));
        const qty = countMin + Math.floor(Math.random() * Math.max(1, countMax - countMin + 1));
        outputs.push(addNpcInventoryItem(npc, pick.itemId, qty));
        if (String(pick.itemId) === "rabbit_meat") {
          const furEntry = (resolver.possibleOutputs || []).find((entry) => String(entry?.itemId || "") === "fur");
          if (furEntry && Math.random() < 0.82) outputs.push(addNpcInventoryItem(npc, "fur", Math.max(1, Math.floor(Number(furEntry.count) || 1))));
        }
      }
      if (resolver.energyDelta) {
        const needs = npc.needs && typeof npc.needs === "object" ? npc.needs : (npc.needs = {});
        needs.energy = clampInt((Number(needs.energy) || 0) + Number(resolver.energyDelta), 0, 100, 85);
      }
      const gained = outputs.filter(Boolean).map((entry) => `${getNpcItemDisplayName(entry)}x${entry.count}`).join("、");
      const facilityText = facilityContext
        ? `在${facilityContext.actionLabel || "使用"}${facilityContext.summary ? `（${facilityContext.summary}）` : ""}时`
        : "";
      const summary = gained
        ? `${summaryName}${facilityText}完成了${activityType}，得到${gained}。`
        : `${summaryName}${facilityText}做了${activityType}，但这次没有收获。`;
      pushNpcRecentEvent(npc, {
        type: facilityContext ? "facility_activity" : "activity",
        activityType,
        facilityType: facilityContext?.type || "",
        facilityObjectId: facilityContext?.objectId ?? null,
        dayKey: clock.dayKey,
        minuteOfDay: clock.minuteOfDay,
        summary,
        outputs: outputs.filter(Boolean),
      });
      if (gained) applyNpcEmotionDelta(npc, { mood: 1, hope: 1, frustration: -1 });
      else applyNpcEmotionDelta(npc, { mood: -1, frustration: 2 });
      if (facilityContext?.emotionDelta) applyNpcEmotionDelta(npc, facilityContext.emotionDelta);
      setNpcActionCue(npc, facilityContext ? (gained ? `${facilityContext.actionLabel || "使用"}：${gained}` : `${facilityContext.actionLabel || "使用"}中`) : (gained || activityType));
      return { success: !!gained, summary, outputs: outputs.filter(Boolean) };
    }

    function buildNpcFallbackConversation(a, b, clock, topic = "") {
      const aName = String(a?.name || a?.npcId || "甲").trim();
      const bName = String(b?.name || b?.npcId || "乙").trim();
      const aTopic = Array.isArray(a?.socialProfile?.chatTopics) && a.socialProfile.chatTopics.length
        ? a.socialProfile.chatTopics[0]
        : (topic || "今天的安排");
      return {
        topic: topic || aTopic,
        lines: [
          { speaker: "a", text: `${clock.timeLabel}了，${aTopic}怎么样？` },
          { speaker: "b", text: "还在忙，不过总算有点进展。" },
          { speaker: "a", text: "等忙完再细说，别误了手上的事。" },
        ],
        relationshipDelta: {
          aToB: { affection: 1, trust: 0, tension: 0 },
          bToA: { affection: 1, trust: 0, tension: 0 },
        },
        emotionDelta: {
          a: { mood: 1, frustration: -1 },
          b: { mood: 1, frustration: -1 },
        },
        trade: { happened: false },
      };
    }

    async function requestNpcConversationFromLlm(a, b, clock, mode = "npc") {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) return null;
      const bName = mode === "player" ? "玩家" : String(b?.name || b?.npcId || "乙").trim();
      const prompt = [
        "为像素村庄角色生成一段很短的对白。",
        "只输出 JSON，不要解释。",
        "格式：",
        "{\"topic\":\"\",\"lines\":[{\"speaker\":\"a\",\"text\":\"\"},{\"speaker\":\"b\",\"text\":\"\"}],\"relationshipDelta\":{\"aToB\":{\"affection\":0,\"trust\":0,\"tension\":0},\"bToA\":{\"affection\":0,\"trust\":0,\"tension\":0}},\"emotionDelta\":{\"a\":{\"mood\":0,\"frustration\":0},\"b\":{\"mood\":0,\"frustration\":0}},\"trade\":{\"happened\":false,\"from\":\"a\",\"to\":\"b\",\"itemId\":\"\",\"count\":1}}",
        `时间：${clock.timeLabel} ${clock.phaseLabel}`,
        `甲：${String(a?.name || a?.npcId || "").trim()}，身份=${String(a?.meta?.role || "").trim()}，性格=${Array.isArray(a?.meta?.personality) ? a.meta.personality.join("、") : ""}`,
        `乙：${bName}${mode === "player" ? "（玩家）" : `，身份=${String(b?.meta?.role || "").trim()}，性格=${Array.isArray(b?.meta?.personality) ? b.meta.personality.join("、") : ""}`}`,
        `甲最近事件：${Array.isArray(a?.recentEvents) ? a.recentEvents.slice(-3).map((evt) => evt.summary || "").join(" | ") : ""}`,
        `${mode === "player" ? "" : `乙最近事件：${Array.isArray(b?.recentEvents) ? b.recentEvents.slice(-3).map((evt) => evt.summary || "").join(" | ") : ""}`}`,
        "要求：1) 3 到 5 句；2) 符合人设和当下情境；3) 不要现代网络口头禅；4) trade 除非很自然否则保持 happened=false。",
      ].filter(Boolean).join("\n");
      const res = await fetch(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model: NPC_LLM_MODEL,
          temperature: 0.7,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`npc conversation http ${res.status}: ${raw.slice(0, 240)}`);
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("npc conversation response not json");
      }
      const text = stripJsonFence(extractChatContentText(data?.choices?.[0]?.message?.content || ""));
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = /\{[\s\S]*\}/.exec(text);
        if (m) parsed = JSON.parse(m[0]);
      }
      return parsed && typeof parsed === "object" ? parsed : null;
    }

    function getPlayerDialogueContextForNpc() {
      const hotbar = Array.isArray(animator.hotbarSlots) ? animator.hotbarSlots : [];
      return {
        wx: Number(animator.worldX) || 0,
        wy: Number(animator.worldY) || 0,
        selectedSlot: Number(animator.hotbarSelectedIndex) || 0,
        hotbar: hotbar.map((slot, idx) => {
          const clean = sanitizeHotbarSlotForStorage(slot);
          if (!clean) return null;
          return {
            slot: idx + 1,
            itemId: clean.itemId || "",
            name: clean.name,
            count: clean.count,
            tags: clean.tags || [],
          };
        }).filter(Boolean),
      };
    }

    function normalizeNpcPlayerSuggestions(raw, npc) {
      const role = String(npc?.meta?.role || "村民").trim() || "村民";
      const source = Array.isArray(raw)
        ? raw
        : (typeof raw === "string" ? raw.split(/[|｜\n]/) : []);
      const out = [];
      for (const item of source) {
        const text = String(item || "").replace(/^["“”'「」\s]+|["“”'「」\s]+$/g, "").trim();
        if (text && !out.includes(text)) out.push(text.slice(0, 40));
        if (out.length >= 3) break;
      }
      const fallback = [
        "你今天过得怎么样？",
        `有什么${role}才知道的事吗？`,
        "有没有需要我帮忙的？",
      ];
      for (const text of fallback) {
        if (out.length >= 3) break;
        if (!out.includes(text)) out.push(text);
      }
      return out.slice(0, 3);
    }

    function normalizeNpcPlayerTurnPayload(raw, npc, opening = false) {
      const obj = raw && typeof raw === "object" ? raw : {};
      const npcName = String(npc?.name || npc?.npcId || "我").trim();
      const npcLine = String(obj.npcLine || obj.reply || obj.text || "").trim()
        || (opening ? `${npcName}看向你，等你先开口。` : "我听明白了。");
      const rawRel = obj.relationshipDelta && typeof obj.relationshipDelta === "object"
        ? obj.relationshipDelta
        : {};
      const relationshipDelta =
        rawRel.npcToPlayer && typeof rawRel.npcToPlayer === "object" ? rawRel.npcToPlayer :
        rawRel.toPlayer && typeof rawRel.toPlayer === "object" ? rawRel.toPlayer :
        rawRel;
      return {
        topic: String(obj.topic || "").trim(),
        npcLine: npcLine.slice(0, 180),
        suggestions: normalizeNpcPlayerSuggestions(obj.suggestions || obj.playerSuggestions || obj.replies, npc),
        emotionDelta: obj.emotionDelta && typeof obj.emotionDelta === "object" ? obj.emotionDelta : {},
        relationshipDelta: Object.keys(relationshipDelta).length ? relationshipDelta : (opening ? {} : { affection: 1, trust: 0, tension: 0 }),
        trade: normalizeNpcPlayerTradePayload(obj.trade || obj.exchange || obj.itemExchange),
      };
    }

    async function requestNpcPlayerTurnFromLlm(npc, clock, history, playerText) {
      const base = CONFIG.baseUrl.trim().replace(/\/$/, "");
      const key = (CONFIG.apiKey || "").trim();
      if (!base || !key) return null;
      const rel = ensureNpcRelationship(npc, "player");
      const playerContext = getPlayerDialogueContextForNpc();
      const compactHistory = Array.isArray(history)
        ? history.slice(-8).map((line) => ({
          speaker: line?.speaker === "player" ? "player" : "npc",
          text: String(line?.text || "").trim().slice(0, 160),
        })).filter((line) => line.text)
        : [];
      const recentEvents = Array.isArray(npc?.recentEvents)
        ? npc.recentEvents.slice(-5).map((evt) => String(evt?.summary || evt?.text || evt?.type || "").trim()).filter(Boolean)
        : [];
      const npcInventory = ensureNpcInventoryArray(npc).slice(0, 12).map((entry) => ({
        itemId: entry.itemId || "",
        name: entry.name,
        count: entry.count,
        tags: entry.tags || [],
      }));
      const prompt = [
        "你是像素村庄游戏里的 NPC 对话代理。",
        "玩家会自己输入。你只扮演 NPC，并给玩家 3 个可点击的下一句建议。",
        "只输出 JSON，不要 markdown，不要解释。",
        "格式：",
        "{\"topic\":\"\",\"npcLine\":\"\",\"suggestions\":[\"\",\"\",\"\"],\"relationshipDelta\":{\"affection\":0,\"trust\":0,\"tension\":0},\"emotionDelta\":{\"mood\":0,\"stress\":0,\"hope\":0,\"frustration\":0},\"trade\":{\"happened\":false,\"from\":\"npc|player\",\"to\":\"player|npc\",\"itemId\":\"\",\"itemName\":\"\",\"count\":1}}",
        `时间：${clock.timeLabel} ${clock.phaseLabel}`,
        `NPC：${String(npc?.name || npc?.npcId || "").trim()}，身份=${String(npc?.meta?.role || "").trim()}`,
        `性格：${Array.isArray(npc?.meta?.personality) ? npc.meta.personality.join("、") : ""}`,
        `技能：${Array.isArray(npc?.meta?.skills) ? npc.meta.skills.join("、") : ""}`,
        `当前任务：${String(npc?.currentTask?.activityType || npc?.current?.action || "idle")}`,
        `情绪：${JSON.stringify(npc?.emotions || {})}`,
        `与玩家关系：${JSON.stringify(rel)}`,
        `NPC背包：${JSON.stringify(npcInventory)}`,
        `玩家快捷栏：${JSON.stringify(playerContext.hotbar)}`,
        `最近事件：${recentEvents.join(" | ")}`,
        `对话历史：${JSON.stringify(compactHistory)}`,
        `玩家刚说：${String(playerText || "").trim() || "（玩家刚打开对话，还没说话）"}`,
        "要求：1) npcLine 只写 NPC 当前这一句回应；2) suggestions 必须恰好 3 条，都是玩家可以直接说的话；3) 建议要短，符合玩家立场；4) 不要替玩家决定行动；5) 不要生成玩家和 NPC 的整段剧本；6) 若玩家刚打开对话，先自然开场；7) trade 只有当本轮文本明确达成物品交接时才 happened=true，itemId/itemName 必须来自 NPC背包或玩家快捷栏。",
      ].join("\n");
      const res = await fetch(base + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model: NPC_LLM_MODEL,
          temperature: 0.65,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`npc player turn http ${res.status}: ${raw.slice(0, 240)}`);
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("npc player turn response not json");
      }
      const text = stripJsonFence(extractChatContentText(data?.choices?.[0]?.message?.content || ""));
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = /\{[\s\S]*\}/.exec(text);
        if (m) parsed = JSON.parse(m[0]);
      }
      return parsed && typeof parsed === "object" ? parsed : null;
    }

    function startNpcConversationState(a, b, payload, clock) {
      if (!a || !b) return;
      const lines = Array.isArray(payload?.lines) ? payload.lines.map((line) => ({
        speaker: String(line?.speaker || "").trim(),
        text: String(line?.text || "").trim(),
      })).filter((line) => line.speaker && line.text) : [];
      if (!lines.length) return;
      const convId = `conv:${Date.now()}:${String(a.npcId || "")}:${String(b.npcId || "")}`;
      const baseState = {
        id: convId,
        topic: String(payload?.topic || "").trim(),
        lines,
        lineIndex: 0,
        startedAtTs: performance.now(),
        nextLineAtTs: performance.now() + NPC_CONVERSATION_LINE_MS,
        endsAtTs: performance.now() + Math.max(NPC_CONVERSATION_TOTAL_MS, lines.length * NPC_CONVERSATION_LINE_MS),
        bubbleText: "",
      };
      a.conversation = Object.assign({}, baseState, { selfKey: "a", partnerId: b.npcId, partnerName: b.name });
      b.conversation = Object.assign({}, baseState, { selfKey: "b", partnerId: a.npcId, partnerName: a.name });
      applyNpcRelationshipDelta(a, b.npcId, payload?.relationshipDelta?.aToB || { affection: 1 });
      applyNpcRelationshipDelta(b, a.npcId, payload?.relationshipDelta?.bToA || { affection: 1 });
      applyNpcEmotionDelta(a, payload?.emotionDelta?.a || {});
      applyNpcEmotionDelta(b, payload?.emotionDelta?.b || {});
      const sim = ensureNpcSimExtension();
      sim.lastConversationAt[`${a.npcId}|${b.npcId}`] = `${clock.dayKey}:${clock.minuteOfDay}`;
      sim.lastConversationAt[`${b.npcId}|${a.npcId}`] = `${clock.dayKey}:${clock.minuteOfDay}`;
      const aRel = ensureNpcRelationship(a, b.npcId);
      aRel.lastTalkDayKey = clock.dayKey;
      aRel.lastTalkMinute = clock.minuteOfDay;
      const bRel = ensureNpcRelationship(b, a.npcId);
      bRel.lastTalkDayKey = clock.dayKey;
      bRel.lastTalkMinute = clock.minuteOfDay;
      pushNpcRecentEvent(a, { type: "conversation", dayKey: clock.dayKey, minuteOfDay: clock.minuteOfDay, summary: `${String(a.name || a.npcId)}和${String(b.name || b.npcId)}聊了聊${String(payload?.topic || "近况")}。` });
      pushNpcRecentEvent(b, { type: "conversation", dayKey: clock.dayKey, minuteOfDay: clock.minuteOfDay, summary: `${String(b.name || b.npcId)}和${String(a.name || a.npcId)}聊了聊${String(payload?.topic || "近况")}。` });
      if (payload?.trade?.happened === true) {
        const fromKey = String(payload.trade.from || "").trim();
        const toKey = String(payload.trade.to || "").trim();
        const itemId = String(payload.trade.itemId || "").trim();
        const count = Math.max(1, Math.floor(Number(payload.trade.count) || 1));
        if (itemId && (fromKey === "a" || fromKey === "b") && (toKey === "a" || toKey === "b")) {
          const fromNpc = fromKey === "a" ? a : b;
          const toNpc = toKey === "a" ? a : b;
          const moved = removeNpcInventoryItem(fromNpc, itemId, count);
          if (moved) addNpcInventoryItem(toNpc, moved, moved.count, moved);
        }
      }
    }

    function advanceNpcConversationState(npc, ts) {
      const conv = npc?.conversation;
      if (!conv || !Array.isArray(conv.lines) || !conv.lines.length) {
        if (npc) npc.conversation = null;
        return "";
      }
      if (ts >= (Number(conv.nextLineAtTs) || 0)) {
        conv.lineIndex = Math.min(conv.lines.length, (Number(conv.lineIndex) || 0) + 1);
        conv.nextLineAtTs = ts + NPC_CONVERSATION_LINE_MS;
      }
      if ((Number(conv.lineIndex) || 0) >= conv.lines.length || ts >= (Number(conv.endsAtTs) || 0)) {
        npc.conversation = null;
        return "";
      }
      const line = conv.lines[Math.max(0, Math.floor(Number(conv.lineIndex) || 0))];
      if (!line) return "";
      const speaker = String(line.speaker || "").trim();
      const selfKey = String(conv.selfKey || "").trim();
      conv.bubbleText = speaker === selfKey ? String(line.text || "").trim() : "";
      return conv.bubbleText;
    }

    function ensureNpcConversationAsync(a, b, clock) {
      const key = [String(a?.npcId || ""), String(b?.npcId || "")].sort().join("|");
      if (!key || _npcConversationRequestByKey.has(key)) return;
      const task = (async () => {
        try {
          const payload = await requestNpcConversationFromLlm(a, b, clock, "npc");
          startNpcConversationState(a, b, payload || buildNpcFallbackConversation(a, b, clock), clock);
          scheduleNpcSceneAutosave("npc-conversation");
        } catch (err) {
          console.warn("[npc-conversation-llm-failed]", key, err);
          startNpcConversationState(a, b, buildNpcFallbackConversation(a, b, clock), clock);
        } finally {
          _npcConversationRequestByKey.delete(key);
        }
      })();
      _npcConversationRequestByKey.set(key, task);
    }

    function getNpcStandCollisionRadiusWorld(canvas = getLogicCanvas()) {
      const base = getPlayerCollisionRadiusWorld(canvas);
      return Math.max(1.6, Math.min(8, base * 0.72));
    }

    function isNpcStandPointWalkable(x, y, canvas = getLogicCanvas()) {
      ensureSceneObjects();
      const r = getNpcStandCollisionRadiusWorld(canvas);
      const objs = getSceneObjectsNearWorldPoint(
        Number(x) || 0,
        Number(y) || 0,
        Math.max(18, r * 2),
        Math.max(10, r * 1.5),
        animator._npcStandPointScratchObjects || (animator._npcStandPointScratchObjects = [])
      );
      for (const o of objs) {
        if (!o) continue;
        if (o.model) {
          const polys = getModelCollisionPolygonsWorld(o);
          if (circleOutsideBBox2D(x, y, r, o._collisionPolyBBox)) continue;
          if (polys.length && circleIntersectsCollisionPolygons2D(x, y, r, polys)) {
            return false;
          }
          continue;
        }
        const or = objectCollisionRadiusWorld(o);
        if (or > 0) {
          const dx = (Number(x) || 0) - (Number(o.wx) || 0);
          const dy = (Number(y) || 0) - (Number(o.wy) || 0);
          const rr = r + or;
          if ((dx * dx + dy * dy) < rr * rr) return false;
        }
      }
      return true;
    }

    function computeNpcHomeAnchor(home, fallbackX = 0, fallbackY = 0, canvas = getLogicCanvas()) {
      const fx = Number(fallbackX) || 0;
      const fy = Number(fallbackY) || 0;
      if (!home) return { x: fx, y: fy };
      const cx = Number(home.wx) || fx;
      const cy = Number(home.wy) || fy;
      if (!home.model) {
        return isNpcStandPointWalkable(cx, cy, canvas) ? { x: cx, y: cy } : { x: fx, y: fy };
      }

      try { getModelCollisionPolygonsWorld(home); } catch {}
      const bb = home._collisionPolyBBox;
      const standR = getNpcStandCollisionRadiusWorld(canvas);
      const clearance = Math.max(standR + 3, 6);
      const halfW = bb ? Math.max(2, (bb.maxX - bb.minX) * 0.5) : 6;
      const halfH = bb ? Math.max(2, (bb.maxY - bb.minY) * 0.5) : 6;
      const candidates = [
        { x: cx, y: cy + halfH + clearance },
        { x: cx + halfW + clearance, y: cy },
        { x: cx - halfW - clearance, y: cy },
        { x: cx, y: cy - halfH - clearance },
        { x: cx + halfW + clearance, y: cy + halfH + clearance },
        { x: cx - halfW - clearance, y: cy + halfH + clearance },
        { x: cx + halfW + clearance, y: cy - halfH - clearance },
        { x: cx - halfW - clearance, y: cy - halfH - clearance },
      ];
      const prefDx = fx - cx;
      const prefDy = fy - cy;
      const prefLen = Math.hypot(prefDx, prefDy) || 0;
      const prefNx = prefLen > 1e-6 ? (prefDx / prefLen) : 0;
      const prefNy = prefLen > 1e-6 ? (prefDy / prefLen) : 0;
      const rankedCandidates = candidates.slice().sort((a, b) => {
        const adx = a.x - cx;
        const ady = a.y - cy;
        const bdx = b.x - cx;
        const bdy = b.y - cy;
        const aLen = Math.hypot(adx, ady) || 1;
        const bLen = Math.hypot(bdx, bdy) || 1;
        const aScore = (adx / aLen) * prefNx + (ady / aLen) * prefNy;
        const bScore = (bdx / bLen) * prefNx + (bdy / bLen) * prefNy;
        if (Math.abs(aScore - bScore) > 1e-6) return bScore - aScore;
        const aDist = Math.hypot(a.x - fx, a.y - fy);
        const bDist = Math.hypot(b.x - fx, b.y - fy);
        return aDist - bDist;
      });
      for (const c of rankedCandidates) {
        if (isNpcStandPointWalkable(c.x, c.y, canvas)) return c;
      }

      const baseRadius = Math.max(halfW, halfH) + clearance;
      for (let ring = 0; ring < 4; ring++) {
        const r = baseRadius + ring * Math.max(6, standR * 2);
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (isNpcStandPointWalkable(x, y, canvas)) return { x, y };
        }
      }
      return { x: fx, y: fy };
    }

    function getNpcStableHomeAnchor(npc, home, fallbackX = 0, fallbackY = 0, canvas = getLogicCanvas()) {
      const runtime = npc && typeof npc === "object"
        ? (npc._runtime && typeof npc._runtime === "object" ? npc._runtime : (npc._runtime = {}))
        : null;
      if (!runtime || !home) return computeNpcHomeAnchor(home, fallbackX, fallbackY, canvas);
      const homeId = String(home.id ?? home.objectId ?? npc.homeObjectId ?? "");
      const cached =
        runtime.homeAnchorObjectId === homeId &&
        Number.isFinite(Number(runtime.homeAnchorX)) &&
        Number.isFinite(Number(runtime.homeAnchorY))
          ? { x: Number(runtime.homeAnchorX), y: Number(runtime.homeAnchorY) }
          : null;
      if (cached && isNpcStandPointWalkable(cached.x, cached.y, canvas)) return cached;
      const anchor = computeNpcHomeAnchor(home, fallbackX, fallbackY, canvas);
      runtime.homeAnchorObjectId = homeId;
      runtime.homeAnchorX = Number(anchor.x) || 0;
      runtime.homeAnchorY = Number(anchor.y) || 0;
      return anchor;
    }

    function assignNpcTarget(npc, action, x, y, runtime = null, nowTs = 0) {
      if (!npc) return;
      const target = npc.current && typeof npc.current === "object"
        ? npc.current
        : (npc.current = { action: "idle", targetWx: null, targetWy: null });
      const rt = runtime || (npc._runtime && typeof npc._runtime === "object" ? npc._runtime : (npc._runtime = {}));
      const nextAction = String(action || "idle");
      const nextX = Number.isFinite(Number(x)) ? Number(x) : null;
      const nextY = Number.isFinite(Number(y)) ? Number(y) : null;
      const sameAction = target.action === nextAction;
      const sameX = (target.targetWx == null && nextX == null) || Math.abs((Number(target.targetWx) || 0) - (nextX || 0)) < 0.01;
      const sameY = (target.targetWy == null && nextY == null) || Math.abs((Number(target.targetWy) || 0) - (nextY || 0)) < 0.01;
      target.action = nextAction;
      target.targetWx = nextX;
      target.targetWy = nextY;
      if (!(sameAction && sameX && sameY)) {
        rt.stuckTicks = 0;
        rt.lastTargetDist = null;
        rt.targetIssuedAt = nowTs > 0 ? nowTs : performance.now();
      } else if ((Number(rt.targetIssuedAt) || 0) <= 0) {
        rt.targetIssuedAt = nowTs > 0 ? nowTs : performance.now();
      }
    }

    function clearNpcTarget(npc, runtime = null) {
      assignNpcTarget(npc, "idle", null, null, runtime);
    }

    function stopNpcMovement(npc, runtime = null) {
      const rt = runtime || (npc?._runtime && typeof npc._runtime === "object" ? npc._runtime : null);
      if (!rt) return;
      rt.moveDx = 0;
      rt.moveDy = 0;
      rt.moving = false;
      rt.stuckTicks = 0;
      rt.lastTargetDist = null;
      rt.postRecoverAction = "";
      rt.postRecoverWx = null;
      rt.postRecoverWy = null;
    }

    function isNpcRestingTaskState(npc) {
      const state = String(npc?.currentTask?.state || "").trim();
      return state === "sleeping" || state === "resting_home";
    }

    function setNpcStationaryAction(npc, action, runtime = null) {
      clearNpcTarget(npc, runtime);
      if (!npc || typeof npc !== "object") return;
      if (!(npc.current && typeof npc.current === "object")) {
        npc.current = { action: "idle", targetWx: null, targetWy: null };
      }
      npc.current.action = String(action || "idle");
      npc.current.targetWx = null;
      npc.current.targetWy = null;
      stopNpcMovement(npc, runtime);
    }

    function faceNpcTowardPlayer(npc) {
      if (!npc || typeof npc !== "object") return;
      const runtime = npc._runtime && typeof npc._runtime === "object" ? npc._runtime : (npc._runtime = {});
      const dx = (Number(animator.worldX) || 0) - (Number(npc.wx) || 0);
      const dy = (Number(animator.worldY) || 0) - (Number(npc.wy) || 0);
      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        runtime.faceDx = dx;
        runtime.faceDy = dy;
      }
    }

    function beginPlayerNpcInteraction(npc) {
      if (!npc || typeof npc !== "object") return;
      const runtime = npc._runtime && typeof npc._runtime === "object" ? npc._runtime : (npc._runtime = {});
      runtime.playerInteracting = true;
      runtime.playerInteractingSinceTs = performance.now();
      runtime.moving = false;
      runtime.moveDx = 0;
      runtime.moveDy = 0;
      runtime.stuckTicks = 0;
      runtime.lastTargetDist = null;
      runtime.postRecoverAction = "";
      runtime.postRecoverWx = null;
      runtime.postRecoverWy = null;
      runtime.stationaryTicks = 0;
      setNpcStationaryAction(npc, "player_interact", runtime);
      faceNpcTowardPlayer(npc);
    }

    function endPlayerNpcInteraction(npc) {
      if (!npc || typeof npc !== "object" || !npc._runtime) return;
      npc._runtime.playerInteracting = false;
      npc._runtime.playerInteractingSinceTs = 0;
      if (npc.current?.action === "player_interact") {
        clearNpcTarget(npc, npc._runtime);
      }
    }

    function setNpcActionCue(npc, text, durationMs = 4200) {
      if (!npc || typeof npc !== "object") return;
      const runtime = npc._runtime && typeof npc._runtime === "object" ? npc._runtime : (npc._runtime = {});
      runtime.actionCue = {
        text: String(text || "").trim(),
        endsAtTs: performance.now() + Math.max(800, Number(durationMs) || 4200),
      };
    }

    function getNpcActionCue(npc, ts) {
      const cue = npc?._runtime?.actionCue;
      if (!cue || !String(cue.text || "").trim()) return "";
      if (ts >= (Number(cue.endsAtTs) || 0)) {
        npc._runtime.actionCue = null;
        return "";
      }
      return String(cue.text || "").trim();
    }

    function formatNpcActivityStatusLabel(activityType) {
      const key = String(activityType || "").trim();
      if (!key) return "活动";
      const labels = {
        sleep: "休息",
        rest: "休息",
        hunt: "打猎",
        gather_wood: "砍柴",
        forage_small: "采集",
        cook_food: "做饭",
        prepare_fire: "生火",
        prepare_ingredients: "备料",
        run_shop: "看店",
        prepare_shop: "备货",
        close_shop: "打烊",
        walk_floor: "巡堂",
        collect_payment: "收账",
        clean_hall: "打扫",
        serve_guests: "招呼客人",
        deliver_items: "跑腿",
        pray: "祈祷",
        repair_item: "修理",
        repair_gear: "修装备",
        inventory_check: "清点",
        restock: "补货",
        carry_water: "取水",
      };
      if (labels[key]) return labels[key];
      return key.replace(/_/g, " ");
    }

    function getNpcFacilityStatusLabel(npc, task, block = null) {
      const facilityType = String(task?.useFacility || block?.useFacility || "").trim();
      if (!facilityType) return "";
      const def = getNpcFacilityDefinition(facilityType);
      return String(def?.actionLabel || "").trim() || "使用设施";
    }

    function getNpcStatusBubbleText(npc, ts) {
      if (!npc || typeof npc !== "object") return "";
      const task = npc.currentTask && typeof npc.currentTask === "object" ? npc.currentTask : null;
      const action = String(npc?.current?.action || npc?._runtime?.target?.action || "").trim();
      if (task) {
        const state = String(task.state || "").trim();
        const activity = formatNpcActivityStatusLabel(task.activityType);
        const facilityLabel = task.facilityUsePlanned ? getNpcFacilityStatusLabel(npc, task) : "";
        if (state === "travel_to_task") return facilityLabel ? `去${facilityLabel}` : `去${activity}`;
        if (state === "perform_activity") return facilityLabel ? `${facilityLabel}中` : `${activity}中`;
        if (state === "arrive_idle") return facilityLabel ? `等着${facilityLabel}` : "走走停停";
        if (state === "socialize") return "闲聊中";
        if (state === "sleeping") return "睡觉中";
        if (state === "resting_home") return "休息中";
        if (state === "return_home") return "回家";
        if (state === "recover") return "绕路";
        if (task.activityType === "sleep" || task.activityType === "rest") return "休息中";
      }
      if (action === "travel_to_task") return "赶路";
      if (action === "player_interact") return "交谈中";
      if (action === "wander") return "闲逛";
      if (action === "rest" || action === "sleep") return "休息中";
      if (action === "recover") return "找路";
      return "";
    }

    function drawNpcItemToasts(ctx, npc, sx, baseY, ts) {
      const runtime = npc?._runtime;
      const list = Array.isArray(runtime?.itemToasts) ? runtime.itemToasts : [];
      if (!list.length) return;
      const active = list.filter((toast) => ts < (Number(toast?.endsAtTs) || 0) && String(toast?.text || "").trim());
      runtime.itemToasts = active;
      if (!active.length) return;
      ctx.save();
      ctx.font = "12px VT323, monospace";
      ctx.textAlign = "center";
      for (let i = active.length - 1; i >= 0; i--) {
        const toast = active[i];
        const leftMs = Math.max(0, (Number(toast.endsAtTs) || 0) - ts);
        const ageMs = Math.max(0, ts - (Number(toast.startedAtTs) || 0));
        const alpha = Math.min(1, leftMs / 450, ageMs / 120);
        const y = baseY - 8 - (active.length - 1 - i) * 21 - (1 - leftMs / NPC_ITEM_TOAST_MS) * 8;
        const raw = String(toast.text || "").trim();
        const boxWidth = Math.min(132, Math.max(42, ctx.measureText(raw).width + 16));
        const boxHeight = 18;
        const boxX = sx - boxWidth / 2;
        const boxY = y - boxHeight;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = String(toast.sign || "") === "-"
          ? "rgba(80,42,36,0.9)"
          : "rgba(34,70,46,0.9)";
        ctx.strokeStyle = String(toast.sign || "") === "-"
          ? "rgba(255,168,132,0.88)"
          : "rgba(170,255,190,0.88)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 7);
        else ctx.rect(boxX, boxY, boxWidth, boxHeight);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.fillText(raw, sx, boxY + 13);
      }
      ctx.restore();
    }

    function pickNpcRecoveryTarget(npc, desired, canvas = getLogicCanvas()) {
      const wx = Number(npc?.wx) || 0;
      const wy = Number(npc?.wy) || 0;
      const dx = (Number(desired?.x) || wx) - wx;
      const dy = (Number(desired?.y) || wy) - wy;
      const baseAngle = Math.atan2(dy || 0, dx || 1);
      const lastRecoverX = Number(npc?._runtime?.lastRecoverWx);
      const lastRecoverY = Number(npc?._runtime?.lastRecoverWy);
      const offsets = [Math.PI * 0.5, -Math.PI * 0.5, Math.PI * 0.25, -Math.PI * 0.25, Math.PI * 0.75, -Math.PI * 0.75, Math.PI, 0];
      const radii = [16, 24, 32, 42];
      for (const r of radii) {
        for (const off of offsets) {
          const a = baseAngle + off;
          const x = wx + Math.cos(a) * r;
          const y = wy + Math.sin(a) * r;
          if (Number.isFinite(lastRecoverX) && Number.isFinite(lastRecoverY)) {
            const prevDx = x - lastRecoverX;
            const prevDy = y - lastRecoverY;
            if ((prevDx * prevDx + prevDy * prevDy) < 64) continue;
          }
          if (isNpcStandPointWalkable(x, y, canvas)) return { x, y };
        }
      }
      return null;
    }

    function computeNpcSpawnFromBlueprintChar(spec) {
      const home = spec?.homeObjectId != null ? findSceneObjectByIdNumeric(spec.homeObjectId) : null;
      const homeAnchor = computeNpcHomeAnchor(home, Number(animator.worldX) || 0, Number(animator.worldY) || 0);
      const baseX = home ? homeAnchor.x : (Number(animator.worldX) || 0);
      const baseY = home ? homeAnchor.y : (Number(animator.worldY) || 0);
      const offX = Number(spec?.spawn?.offset?.x) || 0;
      const offY = Number(spec?.spawn?.offset?.y) || 0;
      const start = { x: baseX + offX, y: baseY + offY };

      // Try to avoid spawning inside collision polygons.
      if (isNpcStandPointWalkable(start.x, start.y)) return start;
      const step = 3;
      for (let ring = 1; ring <= 24; ring++) {
        const r = ring * step;
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          const x = start.x + Math.cos(a) * r;
          const y = start.y + Math.sin(a) * r;
          if (isNpcStandPointWalkable(x, y)) return { x, y };
        }
      }
      // Fallback: keep original even if blocked.
      return start;
    }

    function bindNpcAutosaveLifecycle() {
      if (_npcAutosaveLifecycleBound || typeof window === "undefined") return;
      _npcAutosaveLifecycleBound = true;
      const flush = () => {
        if (!_npcAutosaveDirty) return;
        void flushNpcSceneAutosave("npc-lifecycle-flush", { force: true, keepalive: true });
      };
      window.addEventListener("pagehide", flush, { passive: true });
      window.addEventListener("beforeunload", flush);
      if (typeof document !== "undefined" && document?.addEventListener) {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") flush();
        });
      }
    }

    async function flushNpcSceneAutosave(reason, options = {}) {
      if (animator.activeSceneKind === "interior" || animator.screenFade?.active) return false;
      if (!_npcAutosaveDirty && !options.force) return true;
      if (_npcAutosaveInFlight) return false;
      const now = Date.now();
      const sinceLast = now - _npcAutosaveLastAt;
      if (!options.force && sinceLast < NPC_SCENE_AUTOSAVE_MIN_INTERVAL_MS) {
        scheduleNpcSceneAutosave(reason);
        return false;
      }
      _npcAutosaveInFlight = true;
      const sceneId = getActiveSceneIdSafe();
      const saveReason = reason || _npcAutosavePendingReason || "npc-runtime";
      try {
        const ok = await saveActiveSceneRuntime(sceneId, {
          silent: true,
          reason: saveReason,
          keepalive: options.keepalive === true,
        });
        if (ok) {
          _npcAutosaveDirty = false;
          _npcAutosaveLastAt = Date.now();
          _npcAutosavePendingReason = "";
        }
        return ok;
      } catch (err) {
        console.warn("[npc-autosave-failed]", saveReason, err);
        return false;
      } finally {
        _npcAutosaveInFlight = false;
        if (_npcAutosaveDirty && !_npcAutosaveTimer && !options.force) {
          scheduleNpcSceneAutosave(_npcAutosavePendingReason || saveReason);
        }
      }
    }

    function scheduleNpcSceneAutosave(reason, options = {}) {
      if (animator.activeSceneKind === "interior" || animator.screenFade?.active) return;
      bindNpcAutosaveLifecycle();
      _npcAutosaveDirty = true;
      if (reason) _npcAutosavePendingReason = reason;
      if (_npcAutosaveTimer) return;
      const now = Date.now();
      const sinceLast = now - _npcAutosaveLastAt;
      const minDelay = options.force ? 0 : Math.max(0, NPC_SCENE_AUTOSAVE_MIN_INTERVAL_MS - sinceLast);
      const delayMs = Math.max(options.force ? 0 : NPC_SCENE_AUTOSAVE_DELAY_MS, minDelay);
      _npcAutosaveTimer = setTimeout(() => {
        _npcAutosaveTimer = null;
        void flushNpcSceneAutosave(reason, options);
      }, delayMs);
    }

    async function mapLimit(list, limit, mapper) {
      const arr = Array.isArray(list) ? list : [];
      const lim = Math.max(1, Math.floor(Number(limit) || 1));
      const results = Array(arr.length);
      let cursor = 0;
      const workers = Array(Math.min(lim, arr.length)).fill(0).map(async () => {
        while (cursor < arr.length) {
          const i = cursor++;
          try {
            results[i] = await mapper(arr[i], i);
          } catch (err) {
            results[i] = { __error: true, error: err };
          }
        }
      });
      await Promise.all(workers);
      return results;
    }

    async function bootstrapNpcFromBlueprint(options = {}) {
      const sceneId = getActiveSceneIdSafe();
      if (_npcBootstrapRunning) return;
      _npcBootstrapRunning = true;
      try {
        if (fxNpcStatus) setTextStatus(fxNpcStatus, "读取 NPC 蓝图…");
        const blueprint = await loadNpcBlueprint(sceneId);
        const designCache = await loadNpcDesign(sceneId);
        const designByNpcId = designCache?.byNpcId || new Map();
        const defaults = blueprint.defaults || {};
        const normalized = blueprint.characters
          .map((c) => {
            const npcId = String(c?.npcId || "").trim();
            return normalizeNpcBlueprintChar(c, defaults, designByNpcId.get(npcId) || null);
          })
          .filter(Boolean);
        if (!normalized.length) throw new Error("NPC 蓝图为空或无有效角色");

        await refreshCharacterLibrary();
        const libItems = animator._characterLibrary || [];
        const byNpcId = indexCharacterLibraryForNpcReuse(libItems);

        // Ensure entities exist (persistent)
        const entities = ensureNpcEntitiesArray();
        let createdCount = 0;
        let upgradedCount = 0;
        for (const spec of normalized) {
          const existing = getNpcEntityById(spec.npcId);
          if (existing) {
            upsertNpcEntity(applyNpcStaticSpecToEntity(existing, spec));
            upgradedCount++;
            continue;
          }
          const spawn = computeNpcSpawnFromBlueprintChar(spec);
          const nextEntity = applyNpcStaticSpecToEntity({
            npcId: spec.npcId,
            wx: spawn.x,
            wy: spawn.y,
            initialWx: spawn.x,
            initialWy: spawn.y,
            sheetCharacterId: null,
            needs: Object.assign({}, spec.simDefaults.needs),
            inventory: cloneJsonValue(spec.initialInventory || []) || [],
            memory: Array.isArray(spec.initialMemories) ? JSON.parse(JSON.stringify(spec.initialMemories)) : [],
            _initialMemory: Array.isArray(spec.initialMemories) ? JSON.parse(JSON.stringify(spec.initialMemories)) : [],
            current: { action: "idle", targetWx: null, targetWy: null },
          }, spec);
          upsertNpcEntity(nextEntity);
          createdCount++;
        }

        // Parallel generate missing character assets.
        const toGenerate = normalized.filter((spec) => {
          const hit = byNpcId.get(spec.npcId);
          return !hit;
        });
        const reuseCount = normalized.length - toGenerate.length;
        if (fxNpcStatus) {
          setTextStatus(
            fxNpcStatus,
            `NPC 蓝图：${normalized.length} 人。复用 ${reuseCount}，需生成 ${toGenerate.length}。`,
          );
        }

        const modelPick = normalizeNpcImageModel(elModel?.value || fxModel?.value || CONFIG.defaultModel);
        const model = modelPick.model || NPC_IMAGE_MODEL_FALLBACK;
        if (modelPick.downgraded && fxNpcStatus) {
          setTextStatus(fxNpcStatus, `检测到当前模型不支持垫图，已切换到 ${model}。`);
        }
        const concurrency = Math.max(1, Math.min(6, Number(options.concurrency) || NPC_DEFAULT_CONCURRENCY));

        const genResults = await mapLimit(toGenerate, concurrency, async (spec, idx) => {
          if (fxNpcStatus) setTextStatus(fxNpcStatus, `生成中 ${idx + 1}/${toGenerate.length}：${spec.displayName}…`);
          const { originalSrc, processedSrc } = await generateCharacterSheetDataUrlsFromPrompt(
            spec.appearancePrompt,
            model,
            (t) => {
              if (fxNpcStatus) setTextStatus(fxNpcStatus, `${spec.displayName}：${t}`);
            }
          );
          const item = await saveCharacterAssetToLibrary({
            npcId: spec.npcId,
            prompt: spec.appearancePrompt,
            model,
            originalSrc,
            processedSrc,
          });
          return { spec, item };
        });

        // Refresh library & bind sheet ids
        await refreshCharacterLibrary();
        const finalByNpcId = indexCharacterLibraryForNpcReuse(animator._characterLibrary || []);

        let bound = 0;
        for (const spec of normalized) {
          const entry = finalByNpcId.get(spec.npcId);
          if (!entry?.id) continue;
          const npc = getNpcEntityById(spec.npcId);
          if (!npc) continue;
          if (npc.sheetCharacterId !== entry.id) {
            npc.sheetCharacterId = entry.id;
            upsertNpcEntity(npc);
            bound++;
          }
        }

        animator._npcRuntimeEnabled = true;
        animator._npcSim = animator._npcSim || { tickMs: 450, accMs: 0, lastTs: 0 };

        scheduleNpcSceneAutosave("npc-bootstrap");
        if (fxNpcStatus) {
          setTextStatus(
            fxNpcStatus,
            `NPC 就绪：新增实体 ${createdCount}，补齐设计 ${upgradedCount}，绑定雪碧 ${bound}。刷新后会从场景继续。`
          );
        }
      } finally {
        _npcBootstrapRunning = false;
      }
    }

    function resetNpcState(opts = {}) {
      const resetMemory = opts.resetMemory === true;
      const list = ensureNpcEntitiesArray();
      for (const npc of list) {
        if (!npc) continue;
        const x0 = Number.isFinite(Number(npc.initialWx)) ? Number(npc.initialWx) : Number(npc.wx) || 0;
        const y0 = Number.isFinite(Number(npc.initialWy)) ? Number(npc.initialWy) : Number(npc.wy) || 0;
        npc.wx = x0;
        npc.wy = y0;
        if (npc.needs && typeof npc.needs === "object") {
          npc.needs.hunger = clampInt(npc.needs.hunger, 0, 100, 15);
          npc.needs.energy = clampInt(npc.needs.energy, 0, 100, 85);
          npc.needs.comfort = clampInt(npc.needs.comfort, 0, 100, 70);
          npc.needs.social = clampInt(npc.needs.social, 0, 100, 55);
          npc.needs.curiosity = clampInt(npc.needs.curiosity, 0, 100, 55);
        }
        npc.current = { action: "idle", targetWx: null, targetWy: null };
        npc._runtime = {};
        if (resetMemory) {
          npc.memory = Array.isArray(npc._initialMemory) ? npc._initialMemory.slice() : (Array.isArray(npc.memory) ? npc.memory.slice(0, 0) : []);
        }
      }
      scheduleNpcSceneAutosave("npc-reset-state");
    }

    function resetNpcMemoryFromBlueprint() {
      const blueprint = _npcBlueprintCache?.data;
      if (!blueprint?.characters) {
        throw new Error("尚未加载 NPC 蓝图");
      }
      const defaults = blueprint.defaults || {};
      const byId = new Map(
        blueprint.characters
          .map((c) => normalizeNpcBlueprintChar(c, defaults))
          .filter(Boolean)
          .map((s) => [s.npcId, s])
      );
      const list = ensureNpcEntitiesArray();
      for (const npc of list) {
        const spec = byId.get(String(npc?.npcId || ""));
        if (!spec) continue;
        npc.memory = Array.isArray(spec.initialMemories) ? JSON.parse(JSON.stringify(spec.initialMemories)) : [];
        npc._initialMemory = Array.isArray(spec.initialMemories) ? JSON.parse(JSON.stringify(spec.initialMemories)) : [];
      }
      scheduleNpcSceneAutosave("npc-reset-memory");
    }

    function resetNpcGlobalSim() {
      if (!animator._sceneExtensions || typeof animator._sceneExtensions !== "object") {
        animator._sceneExtensions = {};
      }
      animator._sceneExtensions.npcSim = { version: 1, resetAt: Date.now() };
      scheduleNpcSceneAutosave("npc-reset-global");
    }

    async function ensureNpcSpriteCacheFor(npc) {
      const sheetId = String(npc?.sheetCharacterId || "").trim();
      if (!sheetId) return null;
      let entry = (animator._characterLibrary || []).find((it) => String(it?.id || "") === sheetId);
      if (!entry) {
        try {
          await refreshCharacterLibrary();
        } catch (_) {}
        entry = (animator._characterLibrary || []).find((it) => String(it?.id || "") === sheetId);
      }
      const idlePath = String(entry?.files?.idle || "").trim();
      const assetKey = [sheetId, String(entry?.updatedAt || entry?.createdAt || ""), idlePath].join("|");
      if (npc._runtime?.sprite && npc._runtime?.sprite?.assetKey === assetKey && npc._runtime?.sprite?.status === "ok") {
        return npc._runtime.sprite;
      }
      if (!npc._runtime) npc._runtime = {};
      if (!npc._runtime.sprite) {
        npc._runtime.sprite = { status: "idle", sheetId: "", assetKey: "", canvas: null, frameW: 0, frameH: 0, renderScale: null, idleSheet: null };
      }
      const spr = npc._runtime.sprite;
      if (spr.status === "running" && spr.assetKey === assetKey) return null;
      spr.status = "running";
      spr.sheetId = sheetId;
      spr.assetKey = assetKey;
      try {
        if (!entry?.files?.sheet) {
          if (npc?._runtime && npc._runtime.missingSheetRepairQueued !== true) {
            npc._runtime.missingSheetRepairQueued = true;
            npc.sheetCharacterId = null;
            setTimeout(() => {
              void bootstrapNpcFromBlueprint({ concurrency: 1 }).catch((err) => {
                console.warn("[npc-missing-sheet-repair-failed]", String(npc?.npcId || ""), err);
              });
            }, 60);
          }
          throw new Error("npc sprite entry missing sheet");
        }
        if (!entry?.files?.sheet) throw new Error("角色库条目缺少 sheet.png");
        const sheetUrl = bustAssetUrl(entry.files.sheet, entry.updatedAt || entry.createdAt || entry.id);
        const normalized = await normalizeSpriteSheetByAnchor(sheetUrl, animator.columns, animator.rows);
        spr.canvas = normalized.canvas;
        spr.frameW = normalized.frameWidth;
        spr.frameH = normalized.frameHeight;
        spr.renderScale = clampNpcRenderScale(entry?.renderScale, null);
        spr.idleSheet = null;
        if (idlePath) {
          try {
            const idleUrl = bustAssetUrl(idlePath, entry.updatedAt || entry.createdAt || entry.id);
            spr.idleSheet = await loadIdlePoseSheetWorkflow(idleUrl);
          } catch (idleErr) {
            spr.idleSheet = null;
            console.warn("[npc-idle-sheet-load-failed]", sheetId, idleErr);
          }
        }
        spr.status = "ok";
        spr.error = "";
        if (npc?._runtime) npc._runtime.missingSheetRepairQueued = false;
        return spr;
      } catch (err) {
        spr.status = "error";
        spr.error = String(err?.message || err || "npc sprite load failed");
        return null;
      }
    }

    function updateNpcDebugQinButtonLabel() {
      if (!fxBtnNpcDebugQin) return;
      fxBtnNpcDebugQin.textContent = _npcDebugQin.enabled ? "隐藏秦始皇调试绘制" : "显示秦始皇调试绘制";
    }

    function spawnNpcDebugQinNearPlayer() {
      _npcDebugQin.wx = (Number(animator.worldX) || 0) + 24;
      _npcDebugQin.wy = (Number(animator.worldY) || 0) + 18;
    }

    function getPlayerCharacterDrawSizePx() {
      const baseDw = Math.max(1, (Number(animator.frameWidth) || 0) * (Number(animator.scale) || 1));
      const baseDh = Math.max(1, (Number(animator.frameHeight) || 0) * (Number(animator.scale) || 1));
      const worldScaleRef = 0.62;
      const effectiveCharPx = (animator.targetCharPx || 22) * (animator.worldScale / worldScaleRef);
      const charMul = Math.max(0.06, Math.min(4, effectiveCharPx / Math.max(1, baseDw)));
      return { dw: baseDw * charMul, dh: baseDh * charMul };
    }

    function clampNpcRenderScale(value, fallback = 1) {
      const n = Number(value);
      if (!Number.isFinite(n)) return fallback;
      return Math.max(0.35, Math.min(2.5, n));
    }

    function getNpcRenderScaleMul(npcLike, spr) {
      const explicitScale = clampNpcRenderScale(npcLike?.renderScale, null);
      if (explicitScale != null) return explicitScale;
      const sheetScale = clampNpcRenderScale(spr?.renderScale, null);
      if (sheetScale != null) return sheetScale;
      return 1;
    }

    function getNpcPerspectiveScaleMul(p, playerProj) {
      // 先彻底锁死 NPC 巨大化问题：NPC 与玩家使用同一屏幕尺寸基准，
      // 不再额外乘透视比值。后续若需要景深感，再用独立参数小幅开启。
      return 1;
    }

    function getActorWorldSpriteHeightPxAt(canvas, p, renderScale = 1, heightWorld = 4) {
      const actorScale = Math.max(1e-4, Number(p?.scale) || 1);
      const worldHeight = Math.max(1, Number(heightWorld) || 4);
      return Math.max(2, worldHeight * actorScale * clampNpcRenderScale(renderScale, 1));
    }

    function resolveActorFacingFromWorldMove(vx, vy, canvas, lastRow = 4, lastFlip = false) {
      const moveLen = Math.hypot(vx, vy);
      if (!(moveLen > 0.05)) {
        return { row: lastRow, flip: lastFlip, moving: false };
      }
      const view = getOrbitViewFrame(canvas || getLogicCanvas());
      const moveRight = vx * view.rightX + vy * view.rightY;
      const moveTowardCam = vx * view.towardCamX + vy * view.towardCamY;
      const inputX = moveRight / 1.4;
      const inputY = moveTowardCam / 1.35;
      const dx = Math.abs(inputX) < 0.12 ? 0 : (inputX > 0 ? 1 : -1);
      const dy = Math.abs(inputY) < 0.12 ? 0 : (inputY > 0 ? 1 : -1);
      return resolveActorFacingFromInputAxes(dx, dy, lastRow, lastFlip);
    }

    async function ensureNpcDebugQinSpriteCache() {
      const spr = _npcDebugQin.sprite;
      if (spr?.status === "ok" && spr.canvas) return spr;
      const now = Date.now();
      if (spr?.status === "running") return null;
      if (spr?.status === "error" && now - (_npcDebugQin.lastLookupTs || 0) < 3000) return null;
      _npcDebugQin.lastLookupTs = now;
      spr.status = "running";
      spr.sheetId = NPC_DEBUG_QIN_ID;
      try {
        let entry = (animator._characterLibrary || []).find((it) => String(it?.id || "").trim() === NPC_DEBUG_QIN_ID);
        if (!entry) {
          await refreshCharacterLibrary();
          entry = (animator._characterLibrary || []).find((it) => String(it?.id || "").trim() === NPC_DEBUG_QIN_ID);
        }
        if (!entry?.files?.sheet) throw new Error("角色库里找不到 秦始皇 的 sheet.png");
        const sheetUrl = bustAssetUrl(entry.files.sheet, entry.updatedAt || entry.createdAt || entry.id);
        const normalized = await normalizeSpriteSheetByAnchor(sheetUrl, animator.columns, animator.rows);
        spr.canvas = normalized.canvas;
        spr.frameW = normalized.frameWidth;
        spr.frameH = normalized.frameHeight;
        spr.renderScale = clampNpcRenderScale(entry?.renderScale, null);
        spr.error = "";
        spr.status = "ok";
        return spr;
      } catch (err) {
        spr.status = "error";
        spr.error = String(err?.message || err || "秦始皇贴图加载失败");
        return null;
      }
    }

    function getDebugQinRenderableForCanvas(canvas, ts) {
      if (!_npcDebugQin.enabled) return [];
      if (!Number.isFinite(Number(_npcDebugQin.wx)) || !Number.isFinite(Number(_npcDebugQin.wy))) {
        spawnNpcDebugQinNearPlayer();
      }
      const wx = Number(_npcDebugQin.wx) || 0;
      const wy = Number(_npcDebugQin.wy) || 0;
      const p = projectWorldToScreen(wx, wy, canvas);
      if (!p || p.scale <= 0) return [];
      void ensureNpcDebugQinSpriteCache();
      return [{
        depthKey: p.depthKey,
        draw: () => {
          const ctx = canvas === animator.stageCanvas ? animator.stageCtx : animator.ctx;
          const spr = _npcDebugQin.sprite;
          if (spr?.status === "ok" && spr.canvas) {
            const facing = resolveActorFacingFromWorldMove(
              Number(_npcDebugQin.faceDx) || 0,
              Number(_npcDebugQin.faceDy) || -1,
              canvas,
              _npcDebugQin.row || 4,
              _npcDebugQin.flip === true
            );
            const frame = _npcDebugQin.frameIndex || 0;
            const row = facing.row;
            const flip = facing.flip === true;
            const sx = frame * spr.frameW;
            const sy = row * spr.frameH;
            const renderScale = getNpcRenderScaleMul(_npcDebugQin, spr);
            const dh = getActorWorldSpriteHeightPxAt(canvas, p, renderScale, Number(_npcDebugQin.heightWorld) || 4);
            const aspect = Math.max(0.2, Math.min(5, Math.max(1, spr.frameW) / Math.max(1, spr.frameH)));
            const dw = dh * aspect;
            const dx = p.sx - dw / 2;
            const dy = p.sy - dh;
            drawCharacterFootShadow(ctx, p.sx, p.sy, dw, dh);
            drawLitCharacterToContext(ctx, spr.canvas, sx, sy, spr.frameW, spr.frameH, dx, dy, dw, dh, flip, canvas);
          } else {
            ctx.save();
            ctx.globalAlpha = 0.95;
            ctx.fillStyle = "rgba(255,220,120,0.92)";
            ctx.beginPath();
            ctx.arc(p.sx, p.sy - 10, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          const label = "秦始皇(debug)";
          ctx.save();
          ctx.font = "12px VT323, monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(255,255,255,0.92)";
          ctx.strokeStyle = "rgba(0,0,0,0.75)";
          ctx.lineWidth = 2;
          ctx.strokeText(label, p.sx, p.sy - 18);
          ctx.fillText(label, p.sx, p.sy - 18);
          ctx.restore();
        },
      }];
    }

    function getNpcRenderablesForCanvas(canvas, ts) {
      const list = ensureNpcEntitiesArray();
      const out = [];
      for (const npc of list) {
        if (!npc) continue;
        if (npc.sheetCharacterId) {
          void ensureNpcSpriteCacheFor(npc);
        }
        const wx = Number(npc.wx) || 0;
        const wy = Number(npc.wy) || 0;
        const p = projectWorldToScreen(wx, wy, canvas);
        if (!p || p.scale <= 0) continue;
        const depthKey = p.depthKey;
        const renderable = {
          depthKey,
          draw: () => {
            const ctx = canvas === animator.stageCanvas ? animator.stageCtx : animator.ctx;
            const bubbleText = advanceNpcConversationState(npc, ts) || getNpcActionCue(npc, ts) || getNpcStatusBubbleText(npc, ts);
            let spriteTopY = p.sy - 18;
            renderable.maskSprite = null;
            // Simple sprite draw: if sprite ready use it; else fallback dot+name.
            const spr = npc._runtime?.sprite;
            if (spr?.status === "ok" && spr.canvas) {
              const faceDx = Number(npc._runtime?.faceDx) || 0;
              const faceDy = Number(npc._runtime?.faceDy) || 0;
              const facing = resolveActorFacingFromWorldMove(
                faceDx,
                faceDy,
                canvas,
                npc._runtime?.row ?? 4,
                npc._runtime?.flip ?? false
              );
              const frame = npc._runtime?.frameIndex || 0;
              const row = facing.row;
              const flip = facing.flip === true;
              const idleFrame = npc._runtime?.moving === true
                ? null
                : getIdlePoseFrameFromSheet(spr.idleSheet, ts, row, flip);
              const sx = idleFrame ? idleFrame.sx : (frame * spr.frameW);
              const sy = idleFrame ? idleFrame.sy : (row * spr.frameH);
              const frameW = idleFrame ? idleFrame.frameWidth : spr.frameW;
              const frameH = idleFrame ? idleFrame.frameHeight : spr.frameH;
              const sourceImage = idleFrame ? (idleFrame.image || spr.canvas) : spr.canvas;
              const drawFlip = idleFrame ? (idleFrame.flip === true) : flip;
              const idleSquashY = idleFrame ? Math.max(0.84, Math.min(1, Number(idleFrame.squashY) || 1)) : 1;
              const renderScale = getNpcRenderScaleMul(npc, spr);
              const dh = getActorWorldSpriteHeightPxAt(canvas, p, renderScale, Number(npc.heightWorld) || 4) * idleSquashY;
              const aspect = Math.max(0.2, Math.min(5, Math.max(1, frameW) / Math.max(1, frameH)));
              const dw = dh * aspect;
              const dx = p.sx - dw / 2;
              const dy = p.sy - dh;
              spriteTopY = dy;
              renderable.maskSprite = { source: sourceImage, sx, sy, sw: frameW, sh: frameH, dx, dy, dw, dh };
              drawCharacterFootShadow(ctx, p.sx, p.sy, dw, dh);
              drawLitCharacterToContext(ctx, sourceImage, sx, sy, frameW, frameH, dx, dy, dw, dh, drawFlip, canvas);
            } else {
              ctx.save();
              ctx.globalAlpha = 0.95;
              ctx.fillStyle = "rgba(120,220,255,0.85)";
              ctx.beginPath();
              ctx.arc(p.sx, p.sy - 10, 3.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            const label = String(npc?.name || npc?.npcId || "NPC");
            ctx.save();
            ctx.font = "12px VT323, monospace";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.strokeStyle = "rgba(0,0,0,0.78)";
            ctx.lineWidth = 2;
            ctx.strokeText(label, p.sx, spriteTopY - 6);
            ctx.fillText(label, p.sx, spriteTopY - 6);
            let mainBubbleTopY = spriteTopY - 18;
            if (bubbleText) {
              const maxWidth = 150;
              const fontSize = 12;
              ctx.font = `${fontSize}px VT323, monospace`;
              const raw = String(bubbleText || "").trim();
              const chunks = [];
              let current = "";
              for (const ch of raw) {
                const probe = current + ch;
                if (ctx.measureText(probe).width > maxWidth && current) {
                  chunks.push(current);
                  current = ch;
                } else {
                  current = probe;
                }
              }
              if (current) chunks.push(current);
              const lines = chunks.slice(0, 2);
              const boxWidth = Math.min(maxWidth + 18, Math.max(...lines.map((line) => ctx.measureText(line).width), 36) + 18);
              const boxHeight = lines.length * 16 + 12;
              const boxX = p.sx - boxWidth / 2;
              const boxY = spriteTopY - boxHeight - 18;
              mainBubbleTopY = boxY;
              ctx.fillStyle = "rgba(255,255,255,0.92)";
              ctx.strokeStyle = "rgba(28,28,28,0.92)";
              ctx.lineWidth = 2;
              ctx.beginPath();
              if (typeof ctx.roundRect === "function") {
                ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
              } else {
                ctx.rect(boxX, boxY, boxWidth, boxHeight);
              }
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(p.sx - 6, boxY + boxHeight);
              ctx.lineTo(p.sx, boxY + boxHeight + 8);
              ctx.lineTo(p.sx + 6, boxY + boxHeight);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle = "rgba(15,15,15,0.95)";
              ctx.textAlign = "center";
              for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], p.sx, boxY + 18 + i * 16);
              }
            }
            drawNpcItemToasts(ctx, npc, p.sx, mainBubbleTopY, ts);
            ctx.restore();
          },
        };
        out.push(renderable);
      }
      return out;
    }

    function pickNpcWanderTarget(npc, home) {
      const base = home
        ? computeNpcHomeAnchor(home, Number(npc.wx) || 0, Number(npc.wy) || 0)
        : { x: Number(npc.wx) || 0, y: Number(npc.wy) || 0 };
      const baseX = base.x;
      const baseY = base.y;
      const r = 38 + Math.random() * 44;
      const a = Math.random() * Math.PI * 2;
      const direct = { x: baseX + Math.cos(a) * r, y: baseY + Math.sin(a) * r };
      if (isNpcStandPointWalkable(direct.x, direct.y)) return direct;
      for (let ring = 1; ring <= 6; ring++) {
        const rr = Math.max(10, r - ring * 8);
        for (let i = 0; i < 10; i++) {
          const aa = a + (i / 10) * Math.PI * 2;
          const x = baseX + Math.cos(aa) * rr;
          const y = baseY + Math.sin(aa) * rr;
          if (isNpcStandPointWalkable(x, y)) return { x, y };
        }
      }
      return base;
    }

    function pickNpcWanderTargetAround(anchor, radius = 10) {
      const baseX = Number(anchor?.x) || 0;
      const baseY = Number(anchor?.y) || 0;
      const r = Math.max(4, Number(radius) || 8);
      const a = Math.random() * Math.PI * 2;
      const direct = { x: baseX + Math.cos(a) * r, y: baseY + Math.sin(a) * r };
      if (isNpcStandPointWalkable(direct.x, direct.y)) return direct;
      for (let ring = 1; ring <= 4; ring++) {
        const rr = Math.max(4, r - ring * 2);
        for (let i = 0; i < 10; i++) {
          const aa = a + (i / 10) * Math.PI * 2;
          const x = baseX + Math.cos(aa) * rr;
          const y = baseY + Math.sin(aa) * rr;
          if (isNpcStandPointWalkable(x, y)) return { x, y };
        }
      }
      return { x: baseX, y: baseY };
    }

    function isNpcSociallyAvailable(npc) {
      if (!npc) return false;
      if (npc.conversation && typeof npc.conversation === "object") return false;
      const taskState = String(npc?.currentTask?.state || "").trim();
      if (
        taskState === "travel_to_task" ||
        taskState === "return_home" ||
        taskState === "recover" ||
        taskState === "sleeping" ||
        taskState === "resting_home"
      ) return false;
      return !(npc._runtime?.moving === true);
    }

    function maybeTriggerNpcSocialConversation(clock) {
      const list = ensureNpcEntitiesArray();
      for (let i = 0; i < list.length; i++) {
        const a = list[i];
        if (!isNpcSociallyAvailable(a)) continue;
        for (let j = i + 1; j < list.length; j++) {
          const b = list[j];
          if (!isNpcSociallyAvailable(b)) continue;
          const dx = (Number(a.wx) || 0) - (Number(b.wx) || 0);
          const dy = (Number(a.wy) || 0) - (Number(b.wy) || 0);
          if ((dx * dx + dy * dy) > (NPC_SOCIAL_TRIGGER_RADIUS * NPC_SOCIAL_TRIGGER_RADIUS)) continue;
          const aRel = ensureNpcRelationship(a, b.npcId);
          const bRel = ensureNpcRelationship(b, a.npcId);
          const sameDay = aRel.lastTalkDayKey === clock.dayKey && bRel.lastTalkDayKey === clock.dayKey;
          const closeInTime = sameDay && Math.abs((Number(aRel.lastTalkMinute) || 0) - clock.minuteOfDay) < NPC_SOCIAL_COOLDOWN_MIN;
          if (closeInTime) continue;
          if (Math.random() > 0.22) continue;
          ensureNpcConversationAsync(a, b, clock);
          return true;
        }
      }
      return false;
    }

    function updateNpcRuntimeStep(ts, dtMs) {
      if (!animator._npcRuntimeEnabled) return;
      const sim = animator._npcSim || (animator._npcSim = { tickMs: 450, accMs: 0, lastTs: 0 });
      if (animator.activeSceneKind === "interior" || animator.screenFade?.active) {
        sim.accMs = 0;
        return;
      }
      const list = ensureNpcEntitiesArray();
      const logicCanvas = getLogicCanvas();
      const nowTs = ts > 0 ? ts : performance.now();
      const clock = getNpcClockState();
      sim.accMs += dtMs;
      const tickMs = Math.max(120, Number(sim.tickMs) || 450);
      const maxSteps = 4;
      let steps = 0;
      while (sim.accMs >= tickMs && steps < maxSteps) {
        sim.accMs -= tickMs;
        steps++;
        for (const npc of list) {
          if (!npc) continue;
          if (!npc._runtime) npc._runtime = {};
          const runtime = npc._runtime;
          ensureNpcInventoryArray(npc);
          const needs = npc.needs && typeof npc.needs === "object" ? npc.needs : (npc.needs = {});
          const home = npc.homeObjectId != null ? findSceneObjectByIdNumeric(npc.homeObjectId) : null;
          const target = npc.current && typeof npc.current === "object" ? npc.current : (npc.current = { action: "idle", targetWx: null, targetWy: null });
          const wx = Number(npc.wx) || 0;
          const wy = Number(npc.wy) || 0;
          const homeAnchor = home ? getNpcStableHomeAnchor(npc, home, wx, wy, logicCanvas) : null;
          const safeHomeAnchor = homeAnchor || findWalkablePointNear(wx, wy, logicCanvas);
          const homeDx = safeHomeAnchor ? (safeHomeAnchor.x - wx) : 0;
          const homeDy = safeHomeAnchor ? (safeHomeAnchor.y - wy) : 0;
          const atHomeAnchor = !!safeHomeAnchor && (homeDx * homeDx + homeDy * homeDy) <= 25;
          runtime.needTick = (Number(runtime.needTick) || 0) + 1;
          runtime.recoverCooldown = Math.max(0, (Number(runtime.recoverCooldown) || 0) - 1);
          if (!Number.isFinite(Number(runtime.idleUntilTs))) runtime.idleUntilTs = 0;

          if (npc.conversation && typeof npc.conversation === "object") {
            setNpcStationaryAction(npc, "socialize", runtime);
            if (npc.currentTask && typeof npc.currentTask === "object") {
              npc.currentTask.state = "socialize";
            }
            continue;
          }

          if (runtime.playerInteracting === true) {
            setNpcStationaryAction(npc, "player_interact", runtime);
            faceNpcTowardPlayer(npc);
            continue;
          }

          if (isNpcRestingTaskState(npc) && atHomeAnchor) {
            const sleepState = String(npc.currentTask?.state || "") === "sleeping";
            const shouldStayResting = sleepState
              ? isNpcInSleepWindow(npc, clock)
              : (Number(needs.energy) || 0) < NPC_REST_EXIT_ENERGY;
            if (shouldStayResting) {
              setNpcStationaryAction(npc, sleepState ? "sleep" : "rest", runtime);
              runtime.restingHome = true;
              needs.energy = clampInt((Number(needs.energy) || 0) + 6, 0, 100, 85);
              continue;
            }
            runtime.restingHome = false;
            npc.currentTask = null;
          }
          if (isNpcRestingTaskState(npc)) {
            const sleepState = String(npc.currentTask?.state || "") === "sleeping";
            const shouldStayResting = sleepState
              ? isNpcInSleepWindow(npc, clock)
              : (Number(needs.energy) || 0) < NPC_REST_EXIT_ENERGY;
            if (!shouldStayResting) {
              runtime.restingHome = false;
              npc.currentTask = null;
            }
          }

          if ((target.action === "rest" || target.action === "sleep") && atHomeAnchor) {
            needs.energy = clampInt((Number(needs.energy) || 0) + 6, 0, 100, 85);
            runtime.restingHome = (Number(needs.energy) || 0) < NPC_REST_EXIT_ENERGY;
          } else {
            if ((runtime.needTick % 3) === 0) {
              needs.hunger = clampInt((Number(needs.hunger) || 0) + 1, 0, 100, 15);
            }
            if ((runtime.needTick % 2) === 0) {
              needs.energy = clampInt((Number(needs.energy) || 0) - 1, 0, 100, 85);
            }
            needs.social = clampInt((Number(needs.social) || 0) - (Math.random() < 0.18 ? 1 : 0), 0, 100, 55);
            needs.curiosity = clampInt((Number(needs.curiosity) || 0) - (Math.random() < 0.14 ? 1 : 0), 0, 100, 55);
            runtime.restingHome = runtime.restingHome === true && (Number(needs.energy) || 0) < NPC_REST_EXIT_ENERGY;
          }

          ensureNpcDayPlanAsync(npc, clock);
          const lowEnergy = !!home && ((Number(needs.energy) || 0) <= NPC_REST_ENTER_ENERGY || runtime.restingHome === true);
          const planTarget = getNpcPlanTargetBlock(npc, clock);
          if (lowEnergy || planTarget.kind === "sleep") {
            const sleepReason = planTarget.kind === "sleep";
            const restAction = sleepReason ? "sleep" : "rest";
            const restState = atHomeAnchor ? (sleepReason ? "sleeping" : "resting_home") : "return_home";
            npc.currentTask = {
              dayKey: clock.dayKey,
              taskId: `${clock.dayKey}:${restAction}`,
              activityType: restAction,
              locationRef: "home",
              state: restState,
              startedMinute: clock.minuteOfDay,
              blockStartMin: 0,
              blockEndMin: 1439,
              performed: false,
              useFacility: "",
            };
            if (atHomeAnchor) {
              setNpcStationaryAction(npc, restAction, runtime);
              runtime.restingHome = sleepReason || (Number(needs.energy) || 0) < NPC_REST_EXIT_ENERGY;
              continue;
            }
            assignNpcTarget(npc, "rest", safeHomeAnchor.x, safeHomeAnchor.y, runtime, nowTs);
            runtime.restingHome = true;
            continue;
          }

          runtime.restingHome = false;
          if (planTarget.block) {
            maybeStartNpcTask(npc, planTarget.block, clock);
          } else if (npc.currentTask && npc.currentTask.dayKey !== clock.dayKey) {
            npc.currentTask = null;
          }

          const currentTask = npc.currentTask && typeof npc.currentTask === "object" ? npc.currentTask : null;
          if (!planTarget.block || !currentTask) {
            const idleAnchor = resolveNpcLocationRef(npc, npc?.anchors?.social?.[0] || npc?.anchors?.home || "home", logicCanvas);
            if (
              (Number(runtime.idleUntilTs) || 0) <= nowTs &&
              (
                !Number.isFinite(Number(target.targetWx)) ||
                !Number.isFinite(Number(target.targetWy)) ||
                target.action === "idle" ||
                target.action === "travel_to_task" ||
                target.action === "arrive_idle" ||
                target.action === "perform_activity"
              )
            ) {
              const p = pickNpcWanderTargetAround(idleAnchor, 10);
              assignNpcTarget(npc, "wander", p.x, p.y, runtime, nowTs);
              runtime.idleUntilTs = nowTs + NPC_TASK_IDLE_MIN_MS + Math.random() * (NPC_TASK_IDLE_MAX_MS - NPC_TASK_IDLE_MIN_MS);
            }
            continue;
          }

          const block = planTarget.block;
          const facilityContext = currentTask.facilityUsePlanned
            ? resolveNpcFacilityContext(npc, currentTask.useFacility, block, logicCanvas)
            : null;
          const anchor = facilityContext?.anchor || resolveNpcLocationRef(npc, currentTask.locationRef || block.locationRef || "home", logicCanvas);
          currentTask.anchorX = Number(anchor.x) || 0;
          currentTask.anchorY = Number(anchor.y) || 0;
          currentTask.facilityType = facilityContext?.type || "";
          currentTask.facilityObjectId = facilityContext?.objectId ?? null;
          const radius = Math.max(4, Number(block.wanderRadius) || 6);
          const distToTask = Math.hypot((Number(anchor.x) || 0) - wx, (Number(anchor.y) || 0) - wy);
          const isTravelState = planTarget.kind === "travel" || distToTask > Math.max(radius, NPC_ACTIVITY_RADIUS_WORLD);
          if (isTravelState) {
            currentTask.state = "travel_to_task";
            assignNpcTarget(npc, "travel_to_task", anchor.x, anchor.y, runtime, nowTs);
            continue;
          }

          if (shouldPerformNpcActivityNow(currentTask, block, clock)) {
            if (currentTask.performed !== true) {
              currentTask.state = "perform_activity";
              currentTask.performed = true;
              currentTask.performedAtMinute = clock.minuteOfDay;
              setNpcStationaryAction(npc, "perform_activity", runtime);
              runtime.idleUntilTs = nowTs + NPC_TASK_IDLE_MIN_MS + Math.random() * (NPC_TASK_IDLE_MAX_MS - NPC_TASK_IDLE_MIN_MS);
              applyNpcActivityResult(npc, block, clock, facilityContext);
            } else {
              setNpcStationaryAction(npc, "perform_activity", runtime);
            }
            continue;
          }

          currentTask.state = "arrive_idle";
          if ((Number(runtime.idleUntilTs) || 0) > nowTs) {
            setNpcStationaryAction(npc, "arrive_idle", runtime);
            continue;
          }
          if (!Number.isFinite(Number(target.targetWx)) || !Number.isFinite(Number(target.targetWy)) || target.action === "idle" || target.action === "arrive_idle" || target.action === "perform_activity") {
            const p = pickNpcWanderTargetAround(anchor, radius);
            assignNpcTarget(npc, "wander", p.x, p.y, runtime, nowTs);
            runtime.idleUntilTs = nowTs + NPC_TASK_IDLE_MIN_MS + Math.random() * (NPC_TASK_IDLE_MAX_MS - NPC_TASK_IDLE_MIN_MS);
          }
        }
        maybeTriggerNpcSocialConversation(clock);
      }

      const moveDtSec = Math.max(0, Number(dtMs) || 0) / 1000;
      const npcMoveSpeed = Math.max(0, Number(animator.npcMoveSpeed) || Math.max(0, Number(animator.speed) || 30) * 0.4);
      for (const npc of list) {
        if (!npc) continue;
        if (!npc._runtime) npc._runtime = {};
        const runtime = npc._runtime;
        const needs = npc.needs && typeof npc.needs === "object" ? npc.needs : (npc.needs = {});
        const home = npc.homeObjectId != null ? findSceneObjectByIdNumeric(npc.homeObjectId) : null;
        const target = npc.current && typeof npc.current === "object" ? npc.current : (npc.current = { action: "idle", targetWx: null, targetWy: null });
        const wx = Number(npc.wx) || 0;
        const wy = Number(npc.wy) || 0;
        const taskState = String(npc?.currentTask?.state || "").trim();
        const shouldFreezeForRest =
          runtime.playerInteracting !== true &&
          !(npc.conversation && typeof npc.conversation === "object") &&
          (
            ((taskState === "sleeping" || target.action === "sleep") && isNpcInSleepWindow(npc, clock)) ||
            (taskState === "resting_home" && (Number(needs.energy) || 0) < NPC_REST_EXIT_ENERGY)
          );
        if (shouldFreezeForRest) {
          setNpcStationaryAction(npc, taskState === "resting_home" ? "rest" : "sleep", runtime);
          runtime.restingHome = true;
          continue;
        }
        let moveDx = 0;
        let moveDy = 0;
        const tx = Number(target.targetWx);
        const ty = Number(target.targetWy);
        const hasTarget = Number.isFinite(tx) && Number.isFinite(ty);
        let faceSourceDx = 0;
        let faceSourceDy = 0;
        if (runtime.playerInteracting === true) {
          setNpcStationaryAction(npc, "player_interact", runtime);
          faceNpcTowardPlayer(npc);
          runtime.moveDx = 0;
          runtime.moveDy = 0;
          runtime.moving = false;
          runtime.stuckTicks = 0;
          runtime.lastTargetDist = null;
          runtime.stationaryTicks = 0;
          continue;
        }
        if (npc.conversation && typeof npc.conversation === "object") {
          setNpcStationaryAction(npc, "socialize", runtime);
          runtime.stuckTicks = 0;
          runtime.lastTargetDist = null;
        } else if (hasTarget && moveDtSec > 0) {
          const dx = tx - wx;
          const dy = ty - wy;
          faceSourceDx = dx;
          faceSourceDy = dy;
          const dist = Math.hypot(dx, dy) || 0;
          if ((Number(runtime.targetIssuedAt) || 0) <= 0) runtime.targetIssuedAt = ts > 0 ? ts : performance.now();
          const lastDist = Number(runtime.lastTargetDist);
          const progressed = Number.isFinite(lastDist) ? (lastDist - dist) : dist;
          const timedOut = ((ts > 0 ? ts : performance.now()) - (Number(runtime.targetIssuedAt) || 0)) >= NPC_TARGET_TIMEOUT_MS;
          const arrivalRadius = Math.max(1.2, npcMoveSpeed * moveDtSec * 0.8);
          if (dist <= arrivalRadius) {
            npc.wx = tx;
            npc.wy = ty;
            if (target.action === "recover" && runtime.postRecoverAction) {
              assignNpcTarget(
                npc,
                runtime.postRecoverAction,
                runtime.postRecoverWx,
                runtime.postRecoverWy,
                runtime,
                ts
              );
              runtime.postRecoverAction = "";
              runtime.postRecoverWx = null;
              runtime.postRecoverWy = null;
            } else if (target.action !== "rest" && target.action !== "travel_to_task" && target.action !== "return_home") {
              clearNpcTarget(npc, runtime);
            }
            runtime.stuckTicks = 0;
            runtime.lastTargetDist = null;
          } else {
            const step = Math.min(dist, npcMoveSpeed * moveDtSec);
            const nx = wx + (dx / dist) * step;
            const ny = wy + (dy / dist) * step;
            const solved = resolvePlayerMoveWithCollision(wx, wy, nx, ny, logicCanvas, ts);
            npc.wx = solved.x;
            npc.wy = solved.y;
            moveDx = solved.x - wx;
            moveDy = solved.y - wy;
            const moveLen = Math.hypot(moveDx, moveDy);
            const newDist = Math.hypot(tx - (Number(solved.x) || 0), ty - (Number(solved.y) || 0)) || 0;
            const distGain = dist - newDist;
            const makingProgress = distGain > 0.2;
            runtime.stuckTicks = makingProgress ? 0 : ((Number(runtime.stuckTicks) || 0) + 1);
            runtime.lastTargetDist = newDist;
            if (!makingProgress && moveLen <= 0.05) {
              runtime.stuckTicks = Math.max(runtime.stuckTicks, (Number(runtime.stuckTicks) || 0) + 1);
            }
            if ((runtime.stuckTicks >= NPC_STUCK_REPLAN_TICKS || timedOut) && (Number(runtime.recoverCooldown) || 0) <= 0) {
              const desired = target.action === "rest" && home
                ? getNpcStableHomeAnchor(npc, home, wx, wy, logicCanvas)
                : { x: tx, y: ty };
              const recovery = pickNpcRecoveryTarget(npc, desired, logicCanvas);
              if (recovery) {
                runtime.postRecoverAction = target.action === "recover"
                  ? (runtime.postRecoverAction || "wander")
                  : String(target.action || "wander");
                runtime.postRecoverWx = target.action === "recover"
                  ? runtime.postRecoverWx
                  : tx;
                runtime.postRecoverWy = target.action === "recover"
                  ? runtime.postRecoverWy
                  : ty;
                runtime.lastRecoverWx = recovery.x;
                runtime.lastRecoverWy = recovery.y;
                runtime.recoverCooldown = NPC_RECOVER_COOLDOWN_TICKS;
                assignNpcTarget(npc, "recover", recovery.x, recovery.y, runtime, ts);
              } else if (target.action === "rest" && home) {
                if (isNpcInSleepWindow(npc, clock) || runtime.restingHome === true || isNpcRestingTaskState(npc)) {
                  const nextHome = getNpcStableHomeAnchor(npc, home, wx, wy, logicCanvas);
                  assignNpcTarget(npc, "rest", nextHome.x, nextHome.y, runtime, ts);
                  runtime.restingHome = true;
                } else {
                  const p = pickNpcWanderTarget(npc, home);
                  assignNpcTarget(npc, "wander", p.x, p.y, runtime, ts);
                  runtime.restingHome = false;
                }
              } else if (home && runtime.restingHome === true) {
                const nextHome = getNpcStableHomeAnchor(npc, home, wx, wy, logicCanvas);
                assignNpcTarget(npc, "rest", nextHome.x, nextHome.y, runtime, ts);
              } else {
                if (npc.currentTask?.anchorX != null && npc.currentTask?.anchorY != null) {
                  assignNpcTarget(npc, "travel_to_task", npc.currentTask.anchorX, npc.currentTask.anchorY, runtime, ts);
                } else {
                  const p = pickNpcWanderTarget(npc, home);
                  assignNpcTarget(npc, "wander", p.x, p.y, runtime, ts);
                }
              }
            }
          }
        } else {
          runtime.stuckTicks = 0;
          runtime.lastTargetDist = null;
        }

        runtime.moveDx = moveDx;
        runtime.moveDy = moveDy;
        runtime.moving = (moveDx * moveDx + moveDy * moveDy) > 1e-6;
        runtime.stationaryTicks = runtime.moving ? 0 : ((Number(runtime.stationaryTicks) || 0) + 1);

        if (runtime.stationaryTicks >= NPC_STATIONARY_RESTART_TICKS) {
          const sleepWindow = isNpcInSleepWindow(npc, clock);
          if (sleepWindow && target.action === "rest") {
            setNpcStationaryAction(npc, "sleep", runtime);
            runtime.restingHome = true;
            runtime.stationaryTicks = 0;
          } else if (target.action === "rest" && (Number(needs.energy) || 0) >= NPC_REST_EXIT_ENERGY) {
            runtime.restingHome = false;
            const p = pickNpcWanderTarget(npc, home);
            assignNpcTarget(npc, "wander", p.x, p.y, runtime, ts);
            runtime.stationaryTicks = 0;
          } else if (target.action === "recover" || target.action === "wander" || target.action === "idle" || target.action === "travel_to_task") {
            if (npc.currentTask?.anchorX != null && npc.currentTask?.anchorY != null) {
              assignNpcTarget(npc, "travel_to_task", npc.currentTask.anchorX, npc.currentTask.anchorY, runtime, ts);
            } else {
              const p = pickNpcWanderTarget(npc, home);
              assignNpcTarget(npc, "wander", p.x, p.y, runtime, ts);
            }
            runtime.stationaryTicks = 0;
          }
        }

        const facing = resolveActorFacingFromWorldMove(
          Math.abs(faceSourceDx) > 1e-6 || Math.abs(faceSourceDy) > 1e-6 ? faceSourceDx : moveDx,
          Math.abs(faceSourceDx) > 1e-6 || Math.abs(faceSourceDy) > 1e-6 ? faceSourceDy : moveDy,
          logicCanvas,
          runtime.row ?? 4,
          runtime.flip ?? false
        );
        const moving = runtime.moving === true;
        if (moving) {
          runtime.faceDx = Math.abs(faceSourceDx) > 1e-6 || Math.abs(faceSourceDy) > 1e-6 ? faceSourceDx : moveDx;
          runtime.faceDy = Math.abs(faceSourceDx) > 1e-6 || Math.abs(faceSourceDy) > 1e-6 ? faceSourceDy : moveDy;
        }
        runtime.row = facing.row;
        runtime.flip = facing.flip;
        if (!Number.isFinite(Number(runtime.frameIndex))) runtime.frameIndex = 0;
        if (!Number.isFinite(Number(runtime.frameTime))) runtime.frameTime = 0;
        const frameMs = 110;
        if (moving) {
          runtime.frameTime += dtMs;
          while (runtime.frameTime >= frameMs) {
            runtime.frameTime -= frameMs;
            runtime.frameIndex = (Number(runtime.frameIndex) + 1) % (animator.columns || 6);
          }
        } else {
          runtime.frameIndex = 0;
          runtime.frameTime = 0;
        }
      }
      if (steps > 0) scheduleNpcSceneAutosave("npc-sim");
    }

    bindAnimatorControls();
    setupFxHotbar();
    renderFxInteractionMenu();
    (async function initSceneSystem() {
      const fallbackStore = loadSceneStore();
      try {
        animator._sceneStore = await loadSceneStoreFromFiles(fallbackStore.activeId);
        for (const sceneId of Object.keys(fallbackStore.scenes || {})) {
          if (!isStoredScenePayload(fallbackStore.scenes[sceneId])) continue;
          if (!isStoredScenePayload(animator._sceneStore.scenes?.[sceneId])) {
            animator._sceneStore.scenes[sceneId] = cloneJsonValue(fallbackStore.scenes[sceneId]);
          }
        }
      } catch (err) {
        console.warn("[scene-file-list-failed]", err);
        animator._sceneStore = fallbackStore;
      }
      refreshSceneListUi();
      const requestedSceneId = sanitizeSceneId(requestedSceneIdRaw);
      const rawWantedId = sanitizeSceneId(requestedSceneId || (fxSceneId && fxSceneId.value) || animator._sceneStore.activeId) || DEFAULT_SCENE_ID;
      const wantedId = requestedSceneId || resolveResumeSceneId(rawWantedId);
      if (wantedId !== rawWantedId) {
        animator._sceneStore.activeId = wantedId;
        try {
          persistSceneStore();
        } catch (err) {
          console.warn("[scene-resume-id-persist-failed]", err);
        }
      }
      if (fxSceneId) fxSceneId.value = wantedId;
      try {
        await loadSceneById(wantedId);
        return;
      } catch (err) {
        if (requestedSceneId) {
          setTextStatus(fxSceneStatus, "Load URL scene failed, falling back to default_scene: " + (err.message || String(err)), true);
          try {
            await loadSceneById(DEFAULT_SCENE_ID);
          } catch (fallbackErr) {
            setTextStatus(fxSceneStatus, "Load default_scene failed: " + (fallbackErr.message || String(fallbackErr)), true);
          }
          return;
        }
        if (animator._sceneStore.scenes && animator._sceneStore.scenes[wantedId]) {
          setTextStatus(fxSceneStatus, "Load scene failed, keeping current scene: " + (err.message || String(err)), true);
          return;
        }
      }
      createNewScene(wantedId);
      await saveActiveScene(wantedId);
    })();
    syncPlacementUi();
    requestAnimationFrame(drawAnimator);
    // 默认直接加载项目里的八向角色参考图（同目录 8direction.png）
    (async function () {
      try {
        const originalSrc = "./8direction.png";
        const processedSrc = await removeUnenclosedWhiteBackground(originalSrc);
        animator._generatedCharacter = {
          prompt: "8direction.png 默认角色",
          model: "local-default",
          originalSrc,
          processedSrc,
        };
        await loadAnimatorSheet(processedSrc, "8direction.png（项目角色，去白底 + 锚点重对齐）", { idleSrc: "./idle.png" });
        elAnimatorInfo.textContent = "动画器已加载：8direction.png（项目角色）";
      } catch (e) {
        // 回退到之前的测试入口，保证首次打开不空白
        runHuAlignmentTest();
      }
    })();
    elBtn.addEventListener("click", generate);
    elBtnGenBuilding?.addEventListener("click", generateBuilding);
    fxBtnGenCharacter?.addEventListener("click", generate);
    fxBtnGenBuildingHud?.addEventListener("click", generateBuilding);
    fxBtnGenerateWorld?.addEventListener("click", generateRadialWorldVillage);
    fxBtnSaveCharacter?.addEventListener("click", async () => {
      try {
        setTextStatus(fxCharacterLibraryStatus, "正在保存当前人物…");
        const result = await saveCurrentCharacter();
        setTextStatus(fxCharacterLibraryStatus, "人物已保存：" + (result.item?.title || result.item?.id || "成功"));
        await refreshCharacterLibrary();
      } catch (err) {
        setTextStatus(fxCharacterLibraryStatus, err.message || String(err), true);
      }
    });
    fxBtnRefreshCharacters?.addEventListener("click", () => {
      void refreshCharacterLibrary();
    });
    fxBtnSaveBuilding?.addEventListener("click", async () => {
      try {
        setTextStatus(fxBuildingLibraryStatus, "正在保存当前建筑…");
        const result = await saveCurrentBuilding();
        setTextStatus(fxBuildingLibraryStatus, "建筑已保存：" + (result.item?.title || result.item?.id || "成功"));
        await refreshBuildingLibrary();
      } catch (err) {
        setTextStatus(fxBuildingLibraryStatus, err.message || String(err), true);
      }
    });
    fxBtnRefreshBuildings?.addEventListener("click", () => {
      void refreshBuildingLibrary();
    });
    fxBtnNpcBootstrap?.addEventListener("click", async () => {
      try {
        if (!fxNpcStatus) return;
        setTextStatus(fxNpcStatus, "开始补全/生成 NPC…");
        await bootstrapNpcFromBlueprint({ concurrency: NPC_DEFAULT_CONCURRENCY });
      } catch (err) {
        setTextStatus(fxNpcStatus, err?.message || String(err || "NPC 启动失败"), true);
      }
    });
    fxBtnNpcResetState?.addEventListener("click", () => {
      try {
        resetNpcState({ resetMemory: false });
        if (fxNpcStatus) setTextStatus(fxNpcStatus, "已重置 NPC 状态（位置/行动/needs）。");
      } catch (err) {
        if (fxNpcStatus) setTextStatus(fxNpcStatus, err?.message || String(err || "重置失败"), true);
      }
    });
    fxBtnNpcResetMemory?.addEventListener("click", () => {
      try {
        resetNpcMemoryFromBlueprint();
        if (fxNpcStatus) setTextStatus(fxNpcStatus, "已按蓝图重置 NPC 记忆。");
      } catch (err) {
        if (fxNpcStatus) setTextStatus(fxNpcStatus, err?.message || String(err || "重置记忆失败"), true);
      }
    });
    fxBtnNpcResetAll?.addEventListener("click", () => {
      try {
        resetNpcGlobalSim();
        resetNpcState({ resetMemory: false });
        if (fxNpcStatus) setTextStatus(fxNpcStatus, "已重置 NPC 全局模拟状态。");
      } catch (err) {
        if (fxNpcStatus) setTextStatus(fxNpcStatus, err?.message || String(err || "重置失败"), true);
      }
    });
    fxBtnNpcDebugQin?.addEventListener("click", async () => {
      try {
        _npcDebugQin.enabled = !_npcDebugQin.enabled;
        if (_npcDebugQin.enabled) {
          spawnNpcDebugQinNearPlayer();
          if (fxNpcStatus) setTextStatus(fxNpcStatus, "已开启调试绘制：秦始皇（静态，无行为逻辑）。");
          await ensureNpcDebugQinSpriteCache();
          if (_npcDebugQin.sprite?.status === "error" && fxNpcStatus) {
            setTextStatus(fxNpcStatus, _npcDebugQin.sprite.error || "秦始皇贴图加载失败", true);
          }
        } else if (fxNpcStatus) {
          setTextStatus(fxNpcStatus, "已关闭调试绘制：秦始皇。");
        }
      } catch (err) {
        if (fxNpcStatus) setTextStatus(fxNpcStatus, err?.message || String(err || "调试绘制切换失败"), true);
      } finally {
        updateNpcDebugQinButtonLabel();
      }
    });
    updateNpcDebugQinButtonLabel();
    elBtnTestMaid.addEventListener("click", runBackgroundRemovalTest);
    elBtnTestHu.addEventListener("click", runHuAlignmentTest);
    fxBtnCodex?.addEventListener("click", () => toggleFxCodex());
    fxBtnCodexClear?.addEventListener("click", () => {
      clearResourceCacheAndItems();
    });
    void refreshCharacterLibrary();
    void refreshBuildingLibrary();
    if (isEmbeddedEngine) {
      openEmbeddedEngineViewport();
      window.setTimeout(openEmbeddedEngineViewport, 0);
      window.setTimeout(openEmbeddedEngineViewport, 250);
      window.requestAnimationFrame(() => {
        openEmbeddedEngineViewport();
        window.requestAnimationFrame(() => resizeFxBigCanvasToViewport());
      });
    }
