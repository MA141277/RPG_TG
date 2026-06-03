"use strict";

    const STORE_KEY = "smart-engineering-math:v1";
    const DEFAULT_BASE_URL = "https://epone.ggb.today";

    const examples = [
      {
        id: "tangent_parabola",
        title: "抛物线的切线",
        expr: "x^2",
        concept: "导数",
        focus: "切线斜率随点变化，导数是局部变化率。",
        params: { x: 1, a: -1, b: 2, scale: 42, tangent: true, integral: true, samples: false },
        concepts: ["derivative", "tangent", "function"],
        mistakes: ["把割线斜率直接等同于切线斜率", "忽略极限过程"],
        prompts: ["拖动 x，观察切线斜率如何随点改变。", "比较 x=0、x=1、x=2 时的斜率。"]
      },
      {
        id: "sin_linear",
        title: "正弦函数局部线性化",
        expr: "sin(x)",
        concept: "导数、线性近似",
        focus: "曲线在足够小的邻域里接近切线。",
        params: { x: 0.8, a: 0, b: 3.14, scale: 48, tangent: true, integral: false, samples: false },
        concepts: ["derivative", "differential", "tangent"],
        mistakes: ["把局部近似误认为全局相等"],
        prompts: ["放大观察点附近，比较曲线和切线。"]
      },
      {
        id: "sinc_limit",
        title: "sin(x)/x 的极限",
        expr: "sin(x)/x",
        concept: "极限",
        focus: "x 趋近 0 时，函数值趋近 1。",
        params: { x: 0.4, a: -2, b: 2, scale: 54, tangent: false, integral: false, samples: true },
        concepts: ["limit", "continuity", "function"],
        mistakes: ["直接把 x=0 代入造成 0/0 后停止分析"],
        prompts: ["把 x 拖近 0，观察函数值接近多少。"]
      },
      {
        id: "integral_area",
        title: "定积分面积",
        expr: "x^2",
        concept: "定积分",
        focus: "积分区间变化时曲线下方面积同步变化。",
        params: { x: 1, a: 0, b: 2, scale: 44, tangent: false, integral: true, samples: false },
        concepts: ["integral", "area", "ftc"],
        mistakes: ["把定积分只理解为公式计算，不理解面积累积"],
        prompts: ["调整 a 和 b，观察面积如何改变。"]
      },
      {
        id: "exponential_growth",
        title: "指数增长",
        expr: "exp(x)",
        concept: "增长率",
        focus: "函数值越大，瞬时增长率也越大。",
        params: { x: 0.5, a: -1, b: 1, scale: 38, tangent: true, integral: false, samples: false },
        concepts: ["derivative", "function"],
        mistakes: ["忽略指数函数导数与自身的关系"],
        prompts: ["比较 x=-1、0、1 的函数值和导数。"]
      },
      {
        id: "damped_wave",
        title: "衰减振荡",
        expr: "exp(-x)*sin(4*x)",
        concept: "极限、振荡",
        focus: "振幅逐渐收敛，局部仍保持振荡。",
        params: { x: 1.2, a: 0, b: 5, scale: 48, tangent: true, integral: false, samples: true },
        concepts: ["limit", "function", "derivative"],
        mistakes: ["看到振荡就误判没有趋近趋势"],
        prompts: ["向右观察，注意振幅包络线逐渐变小。"]
      },
      {
        id: "taylor_sin",
        title: "泰勒近似",
        expr: "sin(x)",
        concept: "级数",
        focus: "用多项式在局部逼近原函数。",
        params: { x: 0.5, a: -2, b: 2, scale: 54, tangent: true, integral: false, samples: false },
        concepts: ["series", "taylor", "derivative"],
        mistakes: ["忽略展开中心和收敛范围"],
        prompts: ["从线性近似理解泰勒展开的第一步。"]
      },
      {
        id: "critical_points",
        title: "函数极值",
        expr: "x^3-3*x",
        concept: "导数、极值",
        focus: "导数为 0 是极值候选点，不是充分条件。",
        params: { x: 1, a: -2, b: 2, scale: 42, tangent: true, integral: false, samples: false },
        concepts: ["derivative", "extreme", "monotonicity"],
        mistakes: ["认为导数为 0 一定是极值"],
        prompts: ["观察 x=-1 和 x=1 附近的单调性变化。"]
      },
      {
        id: "partial_bowl",
        title: "多元函数偏导",
        expr: "x^2+y^2",
        type: "surface",
        concept: "多元函数微分",
        focus: "三维曲面 z=x²+y² 中，x、y 两个方向的切向变化分别对应偏导数。",
        params: { x: 1, y: 1, a: -2, b: 2, scale: 46, tangent: true, integral: false, samples: true },
        concepts: ["multi", "partial", "gradient", "surface"],
        mistakes: ["把偏导数理解成只对一个变量孤立求导，而忽略曲面方向变化"],
        prompts: ["拖动 x 或 y，观察曲面上采样点与偏导数如何变化。"]
      },
      {
        id: "density_plate",
        title: "密度函数与质量",
        expr: "1+x^2+y^2",
        type: "density",
        concept: "二重积分、密度",
        focus: "用二重积分把平面薄片上的密度函数累加为总质量，并估算质心。",
        params: { x: 0.8, y: -0.6, a: -2, b: 2, scale: 50, tangent: false, integral: true, samples: true },
        concepts: ["double_integral", "density", "center_mass", "multi"],
        mistakes: ["把密度当成常数，忽略不同位置对质量和质心的权重"],
        prompts: ["比较中心附近和边缘附近的密度颜色，理解质量累积。"]
      },
      {
        id: "center_mass_shift",
        title: "非均匀薄片质心",
        expr: "3+x+0.5*y",
        type: "density",
        concept: "算中心、质心",
        focus: "密度向右上方增大时，质心会偏向高密度区域。",
        params: { x: 0.5, y: 0.5, a: -2, b: 2, scale: 50, tangent: false, integral: true, samples: true },
        concepts: ["double_integral", "density", "center_mass"],
        mistakes: ["用几何中心代替质量中心，忽略密度权重"],
        prompts: ["观察红色质心标记为什么不在几何中心。"]
      },
      {
        id: "gaussian_surface",
        title: "二维高斯曲面",
        expr: "exp(-(x^2+y^2))",
        type: "surface",
        concept: "三维绘制、二重积分",
        focus: "钟形曲面展示局部峰值、径向衰减和曲面下体积。",
        params: { x: 0.6, y: 0.6, a: -2, b: 2, scale: 58, tangent: true, integral: true, samples: true },
        concepts: ["multi", "surface", "double_integral", "gradient"],
        mistakes: ["只看等高线，不理解曲面高度和体积之间的关系"],
        prompts: ["拖动点从中心到边缘，观察高度与梯度方向的变化。"]
      }
    ];

    const knowledgeBase = [
      { id: "limit", title: "极限", keywords: ["极限", "趋近", "趋于", "lim", "收敛"], concepts: ["limit", "continuity"], snippet: "极限描述变量趋近某过程时函数值的趋势，重点是过程而不是简单代入。", mistakes: ["把极限等同于函数值"], examples: ["sinc_limit"] },
      { id: "continuity", title: "连续", keywords: ["连续", "间断", "可去间断"], concepts: ["continuity", "limit"], snippet: "连续要求函数值存在、极限存在且二者相等。解释时应同时检查这三个条件。", mistakes: ["只看图像不断开，不检查函数值"], examples: ["sinc_limit"] },
      { id: "derivative", title: "导数", keywords: ["导数", "求导", "变化率", "瞬时", "斜率"], concepts: ["derivative", "tangent"], snippet: "导数表示函数在某点的瞬时变化率，几何上是该点切线斜率，应先区分平均变化率和瞬时变化率。", mistakes: ["忽略极限过程"], examples: ["tangent_parabola", "sin_linear"] },
      { id: "tangent", title: "切线", keywords: ["切线", "切点", "线性近似"], concepts: ["tangent", "derivative", "differential"], snippet: "切线是函数在局部最好的线性近似，斜率由该点导数给出。", mistakes: ["把切线理解成只接触一次的线"], examples: ["tangent_parabola"] },
      { id: "differential", title: "微分", keywords: ["微分", "近似", "局部线性"], concepts: ["differential", "derivative"], snippet: "微分强调用线性变化量近似函数增量，在工程估算中常用于小扰动分析。", mistakes: ["把微分当作普通小量符号"], examples: ["sin_linear"] },
      { id: "monotonicity", title: "单调性", keywords: ["单调", "递增", "递减"], concepts: ["monotonicity", "derivative"], snippet: "一阶导数的符号可判断函数单调性，导数由正变负或负变正常提示极值候选。", mistakes: ["只看一个点的导数判断整段单调"], examples: ["critical_points"] },
      { id: "extreme", title: "极值", keywords: ["极值", "最大值", "最小值", "驻点"], concepts: ["extreme", "derivative"], snippet: "导数为 0 是极值候选条件，仍需结合左右导数符号或二阶导判断。", mistakes: ["导数为 0 就一定是极值"], examples: ["critical_points"] },
      { id: "integral", title: "定积分", keywords: ["积分", "定积分", "面积", "累积"], concepts: ["integral", "area", "ftc"], snippet: "定积分可理解为连续累积，几何上常表现为曲线下方面积的有符号和。", mistakes: ["忽略有符号面积"], examples: ["integral_area"] },
      { id: "ftc", title: "牛顿-莱布尼茨公式", keywords: ["牛顿", "莱布尼茨", "原函数", "变上限"], concepts: ["integral", "ftc"], snippet: "牛顿-莱布尼茨公式连接了求导和积分，是从面积累积到原函数差值的桥梁。", mistakes: ["只背公式，不理解导数与积分互逆"], examples: ["integral_area"] },
      { id: "series", title: "级数", keywords: ["级数", "收敛级数", "无穷和"], concepts: ["series", "taylor"], snippet: "级数研究无限项求和的收敛性，泰勒展开是用幂级数表达函数的重要工具。", mistakes: ["把有限多项式和无穷级数混同"], examples: ["taylor_sin"] },
      { id: "taylor", title: "泰勒展开", keywords: ["泰勒", "展开", "幂级数", "多项式逼近"], concepts: ["taylor", "series", "derivative"], snippet: "泰勒展开用函数在展开点的各阶导数构造局部多项式近似，必须关注展开中心和误差。", mistakes: ["忽略适用范围"], examples: ["taylor_sin"] },
      { id: "gradient", title: "梯度", keywords: ["梯度", "偏导", "多元函数"], concepts: ["gradient", "partial", "multi"], snippet: "梯度由多元函数各方向偏导组成，指向函数增长最快的方向。", mistakes: ["把偏导看成互不相关的数"], examples: [] },
      { id: "multi_calc", title: "多元函数微分", keywords: ["多元", "偏导", "全微分", "方向导数", "曲面"], concepts: ["multi", "partial", "gradient", "surface"], snippet: "多元函数微分关注多个变量共同变化时函数值如何改变，偏导数是沿坐标方向的局部变化率，梯度组织了所有一阶方向信息。", mistakes: ["只机械求偏导，不理解曲面上的方向变化"], examples: ["partial_bowl", "gaussian_surface"] },
      { id: "double_integral_kb", title: "二重积分", keywords: ["二重积分", "重积分", "体积", "曲面下", "区域积分"], concepts: ["double_integral", "multi", "surface"], snippet: "二重积分把二维区域上的函数值连续累加，可解释为曲面下体积，也可用于质量、质心等工程量计算。", mistakes: ["把二重积分只看作两次一元积分"], examples: ["density_plate", "gaussian_surface"] },
      { id: "density_kb", title: "密度函数", keywords: ["密度", "质量", "薄片", "面密度", "rho"], concepts: ["density", "double_integral", "center_mass"], snippet: "面密度函数 rho(x,y) 描述单位面积质量，总质量由二重积分 ∫∫rho dA 给出。", mistakes: ["把非均匀密度当成常数密度"], examples: ["density_plate", "center_mass_shift"] },
      { id: "center_mass_kb", title: "质心与算中心", keywords: ["质心", "重心", "中心", "算中心", "质量中心", "形心"], concepts: ["center_mass", "density", "double_integral"], snippet: "质心是按密度加权后的平均位置：xbar=∫∫x rho dA/M，ybar=∫∫y rho dA/M。密度不均匀时，质心通常不等于几何中心。", mistakes: ["用几何中心代替质量中心"], examples: ["center_mass_shift"] }
    ];

    const graphNodes = [
      { id: "function", label: "函数", status: "mastered", description: "研究变量之间对应关系，是极限、导数和积分的基础。" },
      { id: "limit", label: "极限", status: "learning", description: "研究变量趋近某一过程时函数值的趋势。" },
      { id: "continuity", label: "连续", status: "new", description: "函数值与极限一致，图形局部不断裂。" },
      { id: "derivative", label: "导数", status: "learning", description: "瞬时变化率，几何上对应切线斜率。" },
      { id: "tangent", label: "切线", status: "learning", description: "局部最好的线性近似。" },
      { id: "differential", label: "微分", status: "new", description: "函数增量的线性近似。" },
      { id: "monotonicity", label: "单调", status: "new", description: "由导数符号判断函数增减趋势。" },
      { id: "extreme", label: "极值", status: "review", description: "局部最大或最小，需要结合导数变化判断。" },
      { id: "integral", label: "定积分", status: "learning", description: "连续累积与有符号面积。" },
      { id: "area", label: "面积", status: "new", description: "定积分的重要几何解释。" },
      { id: "ftc", label: "微积分基本定理", status: "new", description: "连接导数、原函数与定积分。" },
      { id: "series", label: "级数", status: "new", description: "无限项求和及其收敛性。" },
      { id: "taylor", label: "泰勒", status: "new", description: "用多项式或幂级数逼近函数。" },
      { id: "multi", label: "多元函数", status: "new", description: "多个自变量共同决定函数值。" },
      { id: "partial", label: "偏导", status: "new", description: "固定其他变量时的单方向变化率。" },
      { id: "gradient", label: "梯度", status: "new", description: "函数增长最快方向。" },
      { id: "surface", label: "三维曲面", status: "new", description: "把 z=f(x,y) 绘制为空间曲面，观察高度、坡度和形状。" },
      { id: "double_integral", label: "二重积分", status: "new", description: "在二维区域上累加函数值，可表示体积、质量和平均值。" },
      { id: "density", label: "密度", status: "new", description: "位置相关的面密度函数，用于描述非均匀薄片质量分布。" },
      { id: "center_mass", label: "质心", status: "new", description: "按密度加权得到的质量中心，也可理解为算中心。" }
    ];

    const graphEdges = [
      ["function", "limit", "prerequisite"],
      ["limit", "continuity", "supports"],
      ["limit", "derivative", "prerequisite"],
      ["derivative", "tangent", "example_of"],
      ["derivative", "differential", "supports"],
      ["derivative", "monotonicity", "applies_to"],
      ["derivative", "extreme", "applies_to"],
      ["integral", "area", "example_of"],
      ["derivative", "ftc", "supports"],
      ["integral", "ftc", "supports"],
      ["series", "taylor", "supports"],
      ["derivative", "taylor", "supports"],
      ["function", "multi", "prerequisite"],
      ["multi", "partial", "prerequisite"],
      ["partial", "gradient", "supports"],
      ["multi", "surface", "applies_to"],
      ["multi", "double_integral", "prerequisite"],
      ["surface", "double_integral", "supports"],
      ["double_integral", "density", "applies_to"],
      ["density", "center_mass", "supports"],
      ["double_integral", "center_mass", "applies_to"]
    ];

    const state = loadState();
    state.activeTab = "home";
    let compiled = null;
    let compileError = "";
    let dragging = false;
    let pinchStart = null;
    let worldRunning = false;
    let worldFrame = 0;
    let worldLastTime = 0;
    let avatarPreviewFrame = 0;
    let avatarPreviewRaf = 0;
    let avatarPreviewLastAt = 0;

    const CHARACTER_LIBRARY = {
      male: {
        id: "male",
        title: "理工男穿搭的男大学生",
        sprite: "../character/理工男穿搭的男大学生/sheet.png",
        preview: "../character/理工男穿搭的男大学生/preview.png"
      },
      female: {
        id: "female",
        title: "理工穿搭的女大学生",
        sprite: "../character/理工穿搭的女大学生/sheet.png",
        preview: "../character/理工穿搭的女大学生/preview.png"
      }
    };

    const worldInput = {
      keys: Object.create(null),
      joystick: { active: false, x: 0, y: 0, pointerId: null }
    };

    const worldScene = {
      width: 420,
      height: 760,
      horizonY: 120,
      floorTop: 182,
      floorBottom: 710,
      nearScale: 1,
      farScale: 0.38,
      laneLeft: 54,
      laneRight: 366,
      gate: { x: 0, z: 0.82, w: 116, h: 132, depth: 36 },
      exhibits: [
        { side: "left", x: -0.72, z: 0.74, kind: "wave", hue: "#79dbff" },
        { side: "left", x: -0.92, z: 0.58, kind: "spiral", hue: "#5fc6ff" },
        { side: "right", x: 0.72, z: 0.74, kind: "surface", hue: "#8bf0ff" },
        { side: "right", x: 0.92, z: 0.58, kind: "integral", hue: "#63b8ff" }
      ],
      player: {
        x: 0,
        z: 0.08,
        speed: 142,
        facing: "down",
        stepTime: 0,
        moving: false
      }
    };

    const spriteSheets = {
      male: new Image(),
      female: new Image()
    };

    const previewImages = {
      male: new Image(),
      female: new Image()
    };

    spriteSheets.male.src = CHARACTER_LIBRARY.male.sprite;
    spriteSheets.female.src = CHARACTER_LIBRARY.female.sprite;
    previewImages.male.src = CHARACTER_LIBRARY.male.preview;
    previewImages.female.src = CHARACTER_LIBRARY.female.preview;
    Object.values(spriteSheets).forEach(img => {
      img.addEventListener("load", () => renderAvatarPreviews());
    });
    Object.values(previewImages).forEach(img => {
      img.addEventListener("load", () => renderAvatarPreviews());
    });

    const el = {
      worldShell: document.getElementById("worldShell"),
      worldOnboarding: document.getElementById("worldOnboarding"),
      worldStage: document.getElementById("worldStage"),
      malePreview: document.getElementById("malePreview"),
      femalePreview: document.getElementById("femalePreview"),
      playerNameInput: document.getElementById("playerNameInput"),
      avatarGrid: document.getElementById("avatarGrid"),
      startWorld: document.getElementById("startWorld"),
      changeAvatar: document.getElementById("changeAvatar"),
      worldPlayerName: document.getElementById("worldPlayerName"),
      worldCanvas: document.getElementById("worldCanvas"),
      worldStatus: document.getElementById("worldStatus"),
      worldEnter: document.getElementById("worldEnter"),
      enterAgent: document.getElementById("enterAgent"),
      joystick: document.getElementById("joystick"),
      joystickThumb: document.getElementById("joystickThumb"),
      canvas: document.getElementById("plot"),
      canvasWrap: document.getElementById("canvasWrap"),
      exprInput: document.getElementById("exprInput"),
      exprStatus: document.getElementById("exprStatus"),
      xRange: document.getElementById("xRange"),
      yRange: document.getElementById("yRange"),
      yField: document.getElementById("yField"),
      aRange: document.getElementById("aRange"),
      bRange: document.getElementById("bRange"),
      scaleRange: document.getElementById("scaleRange"),
      xValue: document.getElementById("xValue"),
      yValue: document.getElementById("yValue"),
      aValue: document.getElementById("aValue"),
      bValue: document.getElementById("bValue"),
      scaleValue: document.getElementById("scaleValue"),
      showTangent: document.getElementById("showTangent"),
      showIntegral: document.getElementById("showIntegral"),
      showSamples: document.getElementById("showSamples"),
      metricX: document.getElementById("metricX"),
      metricFx: document.getElementById("metricFx"),
      metricD: document.getElementById("metricD"),
      metricI: document.getElementById("metricI"),
      metricLabelX: document.getElementById("metricLabelX"),
      metricLabelFx: document.getElementById("metricLabelFx"),
      metricLabelD: document.getElementById("metricLabelD"),
      metricLabelI: document.getElementById("metricLabelI"),
      quickExamples: document.getElementById("quickExamples"),
      allExamples: document.getElementById("allExamples"),
      activeExampleDetails: document.getElementById("activeExampleDetails"),
      exampleDetailsFull: document.getElementById("exampleDetailsFull"),
      currentTheme: document.getElementById("currentTheme"),
      memoryPill: document.getElementById("memoryPill"),
      settingsDialog: document.getElementById("settingsDialog"),
      settingsForm: document.getElementById("settingsForm"),
      openSettings: document.getElementById("openSettings"),
      openSettings2: document.getElementById("openSettings2"),
      baseUrlInput: document.getElementById("baseUrlInput"),
      modelInput: document.getElementById("modelInput"),
      apiKeyInput: document.getElementById("apiKeyInput"),
      clearKey: document.getElementById("clearKey"),
      apiStatus: document.getElementById("apiStatus"),
      knowledgeHits: document.getElementById("knowledgeHits"),
      messages: document.getElementById("messages"),
      questionInput: document.getElementById("questionInput"),
      sendQuestion: document.getElementById("sendQuestion"),
      clearMemory: document.getElementById("clearMemory"),
      imageUpload: document.getElementById("imageUpload"),
      imagePreview: document.getElementById("imagePreview"),
      askFromGraph: document.getElementById("askFromGraph"),
      knowledgeGraph: document.getElementById("knowledgeGraph"),
      nodeDetail: document.getElementById("nodeDetail"),
      nodeCount: document.getElementById("nodeCount"),
      masteredCount: document.getElementById("masteredCount"),
      reviewCount: document.getElementById("reviewCount"),
      taskCount: document.getElementById("taskCount"),
      taskList: document.getElementById("taskList"),
      homeGraph: document.getElementById("homeGraph"),
      homeAgent: document.getElementById("homeAgent"),
      dailyChapter: document.getElementById("dailyChapter"),
      generateDaily: document.getElementById("generateDaily"),
      dailyQuestion: document.getElementById("dailyQuestion"),
      saveDailyWrong: document.getElementById("saveDailyWrong"),
      askDailyHint: document.getElementById("askDailyHint"),
      wrongBook: document.getElementById("wrongBook"),
      wrongCount: document.getElementById("wrongCount"),
      diagnoseWrong: document.getElementById("diagnoseWrong"),
      wrongDiagnosis: document.getElementById("wrongDiagnosis")
    };

    function defaultState() {
      const first = examples[0];
      return {
        activeTab: "home",
        currentExampleId: first.id,
        expr: first.expr,
        x: first.params.x,
        y: first.params.y || 0,
        a: first.params.a,
        b: first.params.b,
        scale: first.params.scale,
        showTangent: first.params.tangent,
        showIntegral: first.params.integral,
        showSamples: first.params.samples,
        api: { baseUrl: DEFAULT_BASE_URL, model: "gpt-4o-mini", key: "" },
        memory: [],
        longSummary: "",
        messages: [
          { role: "system", content: "配置 API Key 后，我会结合当前图形、知识库和学习路径回答问题。" }
        ],
        graphStatus: Object.fromEntries(graphNodes.map(n => [n.id, n.status])),
        selectedNodeId: "derivative",
        highlightedConcepts: ["derivative", "tangent"],
        pathEvents: [],
        dailyQuestion: "",
        dailyChapter: "多元函数微分学",
        playerProfile: {
          name: "",
          gender: "male"
        },
        uploadedImage: null,
        wrongBook: [
          {
            id: "wrong_default_1",
            title: "二重积分密度题",
            chapter: "重积分与密度应用",
            question: "设薄片区域 D=[-1,1]×[-1,1]，面密度 ρ(x,y)=2+x，求总质量 M 与质心横坐标。",
            mistake: "直接用几何中心 (0,0)，没有使用密度加权。",
            diagnosis: "薄弱点：二重积分的物理意义、质心公式、非均匀密度。"
          },
          {
            id: "wrong_default_2",
            title: "多元函数偏导题",
            chapter: "多元函数微分学",
            question: "z=x²y+sin(xy)，求 ∂z/∂x 与 ∂z/∂y。",
            mistake: "求 ∂z/∂y 时误把 x 当成变量一起求导。",
            diagnosis: "薄弱点：偏导时固定其他变量、链式法则。"
          },
          {
            id: "wrong_default_3",
            title: "泰勒展开误差",
            chapter: "级数与泰勒展开",
            question: "用三阶泰勒多项式近似 sin x，并说明 x=0 附近的误差阶。",
            mistake: "只写出多项式，没有说明展开中心和余项阶。",
            diagnosis: "薄弱点：泰勒公式结构、余项和适用范围。"
          }
        ]
      };
    }

    function loadState() {
      const base = defaultState();
      try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
        return {
          ...base,
          ...saved,
          api: { ...base.api, ...(saved.api || {}) },
          playerProfile: { ...base.playerProfile, ...(saved.playerProfile || {}) },
          graphStatus: { ...base.graphStatus, ...(saved.graphStatus || {}) },
          memory: Array.isArray(saved.memory) ? saved.memory.slice(-30) : [],
          messages: Array.isArray(saved.messages) && saved.messages.length ? saved.messages.slice(-60) : base.messages,
          pathEvents: Array.isArray(saved.pathEvents) ? saved.pathEvents : [],
          wrongBook: Array.isArray(saved.wrongBook) && saved.wrongBook.length ? saved.wrongBook : base.wrongBook
        };
      } catch {
        return base;
      }
    }

    function saveState() {
      const serializable = { ...state, messages: state.messages.slice(-60), memory: state.memory.slice(-30) };
      localStorage.setItem(STORE_KEY, JSON.stringify(serializable));
    }

    function activeExample() {
      return examples.find(e => e.id === state.currentExampleId) || examples[0];
    }

    function isSurfaceMode() {
      return ["surface", "density"].includes(activeExample().type);
    }

    function compileExpression(input) {
      const raw = input.trim().replace(/^f\s*\(\s*x\s*\)\s*=/i, "");
      if (!raw) throw new Error("请输入函数表达式");
      if (!/^[0-9a-zA-Z_+\-*/().,^ \t]+$/.test(raw)) throw new Error("表达式包含暂不支持的字符");
      const names = raw.match(/[A-Za-z_]+/g) || [];
      const allowed = new Set(["x", "y", "sin", "cos", "tan", "log", "ln", "exp", "sqrt", "abs", "pow", "min", "max", "pi", "e"]);
      const bad = names.find(name => !allowed.has(name.toLowerCase()));
      if (bad) throw new Error("暂不支持标识符：" + bad);
      const jsExpr = raw
        .replace(/\^/g, "**")
        .replace(/\bln\s*\(/gi, "log(")
        .replace(/\bpi\b/gi, "pi")
        .replace(/\be\b/gi, "e");
      const fn = new Function("x", "y", `
        const {sin, cos, tan, log, exp, sqrt, abs, pow, min, max} = Math;
        const pi = Math.PI;
        const e = Math.E;
        return ${jsExpr};
      `);
      fn(1, 1);
      return { raw, fn };
    }

    function evaluate(x, y = 0) {
      if (!compiled) return NaN;
      if (compiled.raw.replace(/\s+/g, "").toLowerCase() === "sin(x)/x" && Math.abs(x) < 1e-6) return 1;
      try {
        const value = compiled.fn(x, y);
        return Number.isFinite(value) ? value : NaN;
      } catch {
        return NaN;
      }
    }

    function derivative(x, y = 0, axis = "x") {
      const h = 1e-4 * Math.max(1, Math.abs(axis === "x" ? x : y));
      const y1 = axis === "x" ? evaluate(x + h, y) : evaluate(x, y + h);
      const y0 = axis === "x" ? evaluate(x - h, y) : evaluate(x, y - h);
      return Number.isFinite(y1) && Number.isFinite(y0) ? (y1 - y0) / (2 * h) : NaN;
    }

    function integral(a, b) {
      const start = Math.min(a, b);
      const end = Math.max(a, b);
      const n = 220;
      const h = (end - start) / n;
      let sum = 0;
      for (let i = 0; i <= n; i++) {
        const x = start + i * h;
        const y = evaluate(x);
        if (!Number.isFinite(y)) continue;
        const weight = i === 0 || i === n ? 0.5 : 1;
        sum += y * weight;
      }
      const sign = a <= b ? 1 : -1;
      return sum * h * sign;
    }

    function surfaceStats() {
      const lo = Math.min(state.a, state.b);
      const hi = Math.max(state.a, state.b);
      const n = 34;
      const step = (hi - lo) / n || 1;
      let mass = 0;
      let momentX = 0;
      let momentY = 0;
      let weightedZ = 0;
      let maxZ = -Infinity;
      for (let ix = 0; ix <= n; ix++) {
        for (let iy = 0; iy <= n; iy++) {
          const x = lo + ix * step;
          const y = lo + iy * step;
          const z = evaluate(x, y);
          if (!Number.isFinite(z)) continue;
          const weight = (ix === 0 || ix === n ? 0.5 : 1) * (iy === 0 || iy === n ? 0.5 : 1);
          const density = Math.max(0, z);
          const cell = step * step * weight;
          mass += density * cell;
          momentX += x * density * cell;
          momentY += y * density * cell;
          weightedZ += z * cell;
          maxZ = Math.max(maxZ, z);
        }
      }
      return {
        mass,
        centerX: mass ? momentX / mass : 0,
        centerY: mass ? momentY / mass : 0,
        average: weightedZ / ((hi - lo) * (hi - lo) || 1),
        maxZ
      };
    }

    function fmt(num) {
      if (!Number.isFinite(num)) return "不可用";
      if (Math.abs(num) >= 1000) return num.toExponential(2);
      return String(Math.round(num * 1000) / 1000);
    }

    function renderCanvas() {
      try {
        compiled = compileExpression(state.expr);
        compileError = "";
        el.exprStatus.textContent = "可绘制";
        el.exprStatus.style.color = "var(--ok)";
      } catch (err) {
        compiled = null;
        compileError = err.message;
        el.exprStatus.textContent = err.message;
        el.exprStatus.style.color = "var(--danger)";
      }

      if (isSurfaceMode()) {
        renderSurfaceCanvas();
        return;
      }

      const canvas = el.canvas;
      const rect = el.canvasWrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const s = state.scale;
      const toPx = (x, y) => [cx + x * s, cy - y * s];
      const toX = px => (px - cx) / s;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#edf4f0";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#d8d2c3";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const gridStep = s;
      for (let x = cx % gridStep; x < w; x += gridStep) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let y = cy % gridStep; y < h; y += gridStep) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "#68706d";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, cy); ctx.lineTo(w, cy);
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
      ctx.stroke();

      if (!compiled) {
        ctx.fillStyle = "#b33a32";
        ctx.font = "14px Microsoft YaHei";
        ctx.fillText(compileError || "表达式错误", 16, 30);
        updateMetrics();
        return;
      }

      if (state.showIntegral) {
        const a = Math.min(state.a, state.b);
        const b = Math.max(state.a, state.b);
        ctx.beginPath();
        let started = false;
        for (let px = Math.max(0, cx + a * s); px <= Math.min(w, cx + b * s); px += 2) {
          const x = toX(px);
          const y = evaluate(x);
          if (!Number.isFinite(y)) continue;
          const [, py] = toPx(x, y);
          if (!started) {
            ctx.moveTo(px, cy);
            ctx.lineTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        const [endPx] = toPx(b, 0);
        ctx.lineTo(endPx, cy);
        ctx.closePath();
        ctx.fillStyle = "rgba(199, 81, 44, .22)";
        ctx.fill();
      }

      ctx.strokeStyle = "#146b62";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      let drawing = false;
      const samples = [];
      for (let px = 0; px <= w; px += 1.5) {
        const x = toX(px);
        const y = evaluate(x);
        if (!Number.isFinite(y) || Math.abs(y) > 1e5) {
          drawing = false;
          continue;
        }
        const [, py] = toPx(x, y);
        if (py < -h * 3 || py > h * 4) {
          drawing = false;
          continue;
        }
        if (!drawing) {
          ctx.moveTo(px, py);
          drawing = true;
        } else {
          ctx.lineTo(px, py);
        }
        if (px % 24 < 1.5) samples.push([px, py]);
      }
      ctx.stroke();

      if (state.showSamples) {
        ctx.fillStyle = "#205d88";
        samples.forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      const y = evaluate(state.x);
      const dy = derivative(state.x);
      const [px, py] = toPx(state.x, y);
      if (Number.isFinite(y)) {
        if (state.showTangent && Number.isFinite(dy)) {
          const x1 = toX(0);
          const x2 = toX(w);
          const y1 = y + dy * (x1 - state.x);
          const y2 = y + dy * (x2 - state.x);
          const [, p1y] = toPx(x1, y1);
          const [, p2y] = toPx(x2, y2);
          ctx.strokeStyle = "#c7512c";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          ctx.moveTo(0, p1y);
          ctx.lineTo(w, p2y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.fillStyle = "#19201f";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fffdf7";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      updateMetrics();
    }

    function renderSurfaceCanvas() {
      const canvas = el.canvas;
      const rect = el.canvasWrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#edf4f0";
      ctx.fillRect(0, 0, w, h);

      if (!compiled) {
        ctx.fillStyle = "#b33a32";
        ctx.font = "14px Microsoft YaHei";
        ctx.fillText(compileError || "表达式错误", 16, 30);
        updateMetrics();
        return;
      }

      const lo = Math.min(state.a, state.b);
      const hi = Math.max(state.a, state.b);
      const span = Math.max(1, hi - lo);
      const grid = 22;
      const scale = Math.min(w, h) / 5.2;
      const zScale = scale * .62;
      const cx = w / 2;
      const cy = h * .58;
      const project = (x, y, z) => {
        const px = cx + (x - y) * scale * .62;
        const py = cy + (x + y) * scale * .34 - z * zScale;
        return [px, py];
      };
      const values = [];
      let minZ = Infinity;
      let maxZ = -Infinity;
      for (let ix = 0; ix <= grid; ix++) {
        for (let iy = 0; iy <= grid; iy++) {
          const x = lo + span * ix / grid;
          const y = lo + span * iy / grid;
          const z = evaluate(x, y);
          if (Number.isFinite(z)) {
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
          }
          values.push({ ix, iy, x, y, z });
        }
      }
      const zRange = Math.max(.001, maxZ - minZ);
      const get = (ix, iy) => values[ix * (grid + 1) + iy];
      const normZ = z => {
        if (!Number.isFinite(z)) return 0;
        const normalized = (z - minZ) / zRange;
        return Math.max(-1.4, Math.min(1.8, (z / Math.max(1, Math.abs(maxZ))) * 1.2 + normalized * .45));
      };

      for (let ix = grid - 1; ix >= 0; ix--) {
        for (let iy = grid - 1; iy >= 0; iy--) {
          const p = [get(ix, iy), get(ix + 1, iy), get(ix + 1, iy + 1), get(ix, iy + 1)];
          if (p.some(point => !Number.isFinite(point.z))) continue;
          const avg = p.reduce((sum, point) => sum + point.z, 0) / 4;
          const t = (avg - minZ) / zRange;
          const hue = activeExample().type === "density" ? 24 + t * 128 : 190 - t * 120;
          ctx.beginPath();
          p.forEach((point, index) => {
            const [px, py] = project(point.x, point.y, normZ(point.z));
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.fillStyle = `hsla(${hue}, 58%, ${46 + t * 14}%, .78)`;
          ctx.strokeStyle = "rgba(25,32,31,.18)";
          ctx.lineWidth = .6;
          ctx.fill();
          ctx.stroke();
        }
      }

      const z = evaluate(state.x, state.y);
      if (Number.isFinite(z)) {
        const [px, py] = project(state.x, state.y, normZ(z));
        ctx.fillStyle = "#19201f";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fffdf7";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const stats = surfaceStats();
      if (activeExample().type === "density" && Number.isFinite(stats.centerX) && Number.isFinite(stats.centerY)) {
        const cz = evaluate(stats.centerX, stats.centerY);
        const [cpx, cpy] = project(stats.centerX, stats.centerY, normZ(cz));
        ctx.fillStyle = "#c7512c";
        ctx.beginPath();
        ctx.arc(cpx, cpy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#19201f";
        ctx.font = "12px Microsoft YaHei";
        ctx.fillText("质心", cpx + 8, cpy - 8);
      }

      ctx.fillStyle = "rgba(255,250,240,.86)";
      ctx.fillRect(10, 10, Math.min(w - 20, 270), 42);
      ctx.fillStyle = "#19201f";
      ctx.font = "13px Microsoft YaHei";
      ctx.fillText(activeExample().type === "density" ? "密度场：颜色越暖密度越大" : "三维曲面：高度与颜色共同表示 z", 18, 28);
      ctx.fillStyle = "#68706d";
      ctx.fillText(`区域 [${fmt(lo)}, ${fmt(hi)}] × [${fmt(lo)}, ${fmt(hi)}]`, 18, 45);
      updateMetrics();
    }

    function updateMetrics() {
      if (isSurfaceMode()) {
        const z = evaluate(state.x, state.y);
        const dx = derivative(state.x, state.y, "x");
        const dy = derivative(state.x, state.y, "y");
        const stats = surfaceStats();
        el.metricLabelX.textContent = "(x,y)";
        el.metricLabelFx.textContent = "z/ρ";
        el.metricLabelD.textContent = "∂x,∂y";
        el.metricLabelI.textContent = activeExample().type === "density" ? "质量/质心" : "∬近似";
        el.metricX.textContent = `${fmt(state.x)},${fmt(state.y)}`;
        el.metricFx.textContent = fmt(z);
        el.metricD.textContent = `${fmt(dx)},${fmt(dy)}`;
        el.metricI.textContent = activeExample().type === "density"
          ? `${fmt(stats.mass)} · (${fmt(stats.centerX)},${fmt(stats.centerY)})`
          : fmt(stats.average);
      } else {
        const y = evaluate(state.x);
        const dy = derivative(state.x);
        const area = integral(state.a, state.b);
        el.metricLabelX.textContent = "x";
        el.metricLabelFx.textContent = "f(x)";
        el.metricLabelD.textContent = "f'(x)";
        el.metricLabelI.textContent = "∫近似";
        el.metricX.textContent = fmt(state.x);
        el.metricFx.textContent = fmt(y);
        el.metricD.textContent = fmt(dy);
        el.metricI.textContent = fmt(area);
      }
      el.xValue.textContent = state.x.toFixed(2);
      el.yValue.textContent = (state.y || 0).toFixed(2);
      el.aValue.textContent = state.a.toFixed(2);
      el.bValue.textContent = state.b.toFixed(2);
      el.scaleValue.textContent = String(state.scale);
      el.yField.style.display = isSurfaceMode() ? "grid" : "none";
      el.memoryPill.textContent = `记忆 ${state.memory.length}/30`;
    }

    function renderExamples() {
      const makeCard = example => {
        const btn = document.createElement("button");
        btn.className = "example-card" + (example.id === state.currentExampleId ? " active" : "");
        btn.innerHTML = `<h3>${example.title}</h3><code>f(x)=${example.expr}</code><p>${example.focus}</p>`;
        btn.addEventListener("click", () => loadExample(example.id));
        return btn;
      };
      el.quickExamples.replaceChildren(...examples.map(makeCard));
      el.allExamples.replaceChildren(...examples.map(makeCard));
      renderExampleDetails();
    }

    function renderExampleDetails() {
      const ex = activeExample();
      el.currentTheme.textContent = `${ex.title} · ${ex.concept}`;
      const details = [
        `<b>类型：</b>${isSurfaceMode() ? "数分（下）· 多元函数/三维可视化" : "数分（上）· 单变量微积分"}`,
        `<b>讲解重点：</b>${ex.focus}`,
        `<b>常见误区：</b>${ex.mistakes.join("；")}`,
        `<b>推荐追问：</b>${ex.prompts.join("；")}`
      ].map(html => {
        const div = document.createElement("div");
        div.className = "detail";
        div.innerHTML = html;
        return div;
      });
      el.activeExampleDetails.replaceChildren(...details);
      el.exampleDetailsFull.replaceChildren(...details.map(d => d.cloneNode(true)));
    }

    function loadExample(id) {
      const ex = examples.find(item => item.id === id);
      if (!ex) return;
      state.currentExampleId = id;
      state.expr = ex.expr;
      Object.assign(state, {
        x: ex.params.x, y: ex.params.y || 0, a: ex.params.a, b: ex.params.b, scale: ex.params.scale,
        showTangent: ex.params.tangent, showIntegral: ex.params.integral, showSamples: ex.params.samples,
        highlightedConcepts: ex.concepts
      });
      ex.concepts.forEach(c => markPathEvent(c, "example", `完成示例：${ex.title}`));
      syncControls();
      renderAll();
      saveState();
    }

    function matchKnowledge(text) {
      const source = `${text} ${state.expr} ${activeExample().title} ${activeExample().concept}`;
      return knowledgeBase
        .map(item => ({
          item,
          score: item.keywords.reduce((count, kw) => count + (source.includes(kw) ? 1 : 0), 0)
        }))
        .filter(hit => hit.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(hit => hit.item);
    }

    function renderKnowledgeHits(hits = []) {
      const source = hits.length ? hits : matchKnowledge("");
      if (!source.length) {
        el.knowledgeHits.innerHTML = `<span class="tag">通用辅导</span>`;
        return;
      }
      el.knowledgeHits.replaceChildren(...source.map(item => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = item.title;
        return span;
      }));
    }

    function buildSystemPrompt(question, hits) {
      const graph = state.highlightedConcepts
        .map(id => graphNodes.find(n => n.id === id))
        .filter(Boolean)
        .map(n => `${n.label}:${n.description}`)
        .join("\n");
      const memory = state.memory.map((m, i) => `${i + 1}. 学生问：${m.userMessage}\n教师答摘要：${m.agentSummary}\n知识点：${m.concepts.join(",")}`).join("\n");
      const path = computeTasks().slice(0, 3).map(t => `${t.label}:${t.reason}`).join("\n");
      const hitsText = hits.map((h, i) => `${i + 1}. ${h.title}：${h.snippet} 常见误区：${h.mistakes.join("；")}`).join("\n") || "无关键词命中，使用通用数学分析辅导策略。";
      return `你是一名工科数学教师，擅长用图形、工程直觉和分步骤推导解释数学分析。回答先讲直觉，再讲必要公式，避免只给结论。

当前函数：${isSurfaceMode() ? "z=f(x,y)" : "f(x)"}=${state.expr}
当前图形参数：x=${state.x.toFixed(3)}, y=${(state.y || 0).toFixed(3)}, a=${state.a.toFixed(3)}, b=${state.b.toFixed(3)}, ${isSurfaceMode() ? `偏导近似=(${fmt(derivative(state.x, state.y, "x"))}, ${fmt(derivative(state.x, state.y, "y"))}), 二重积分/质量近似=${fmt(surfaceStats().mass || surfaceStats().average)}` : `导数近似=${fmt(derivative(state.x))}, 积分近似=${fmt(integral(state.a, state.b))}`}
当前示例：${activeExample().title}，重点：${activeExample().focus}

知识库命中：
${hitsText}

知识图谱相关节点：
${graph || "暂无高亮节点"}

最近 30 轮记忆摘要：
${memory || "暂无"}

个性化学习路径：
${path || "暂无"}

学生问题：${question}

请给出简洁但有教学价值的中文回答，并在最后给出一个下一步操作建议。`;
    }

    function buildDailyPrompt() {
      return `请为“智能工科数学”的手机学习应用生成一道每日一题。

章节：${state.dailyChapter}
要求：
1. 面向工科数学分析学习者。
2. 输出包含【题目】【已知】【要求】【提示】【标准答案结构】。
3. 必须使用专业公式格式，公式用 LaTeX 包裹，例如 \\( ... \\) 或 \\[ ... \\]。
4. 如果章节涉及多元函数、重积分、密度或质心，请优先体现工程背景。
5. 不要过长，适合手机阅读。`;
    }

    function buildWrongDiagnosisPrompt() {
      const records = state.wrongBook.map((item, index) => `${index + 1}. ${item.title}
章节：${item.chapter}
题目：${item.question}
错误：${item.mistake}
已有诊断：${item.diagnosis}`).join("\n\n");
      return `请作为工科数学教师，对以下错题本做 AI 诊断。

${records}

请输出：
1. 主要薄弱知识点。
2. 错因分类。
3. 推荐复习顺序。
4. 2 道针对性补救练习，公式使用 LaTeX 格式。`;
    }

    async function callModel(question, hits, options = {}) {
      const baseUrl = (state.api.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
      if (!state.api.key) throw new Error("尚未配置 API Key。请先点击模型配置，在本机输入 Key。");
      const finalUserContent = options.image
        ? [
            { type: "text", text: question },
            { type: "image_url", image_url: { url: options.image.dataUrl } }
          ]
        : question;
      const messages = [
        { role: "system", content: buildSystemPrompt(question, hits) },
        ...state.memory.slice(-8).flatMap(m => [
          { role: "user", content: m.userMessage },
          { role: "assistant", content: m.agentSummary }
        ]),
        { role: "user", content: finalUserContent }
      ];
      const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.api.key}`
        },
        body: JSON.stringify({
          model: state.api.model || "gpt-4o-mini",
          messages,
          temperature: 0.35
        })
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`模型请求失败：HTTP ${resp.status}${text ? " · " + text.slice(0, 160) : ""}`);
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("模型响应为空，请检查接口是否兼容 /v1/chat/completions。");
      return content.trim();
    }

    async function sendQuestion(question) {
      const text = question.trim();
      if (!text) return;
      const hits = matchKnowledge(text);
      renderKnowledgeHits(hits);
      const concepts = Array.from(new Set(hits.flatMap(h => h.concepts).concat(activeExample().concepts || [])));
      state.highlightedConcepts = concepts.length ? concepts : state.highlightedConcepts;
      concepts.forEach(c => markPathEvent(c, "question", `提问命中：${text.slice(0, 28)}`));
      state.messages.push({ role: "user", content: text });
      el.questionInput.value = "";
      renderMessages();
      saveState();
      try {
        el.sendQuestion.disabled = true;
        el.sendQuestion.textContent = "等待";
        const image = state.uploadedImage;
        const answer = await callModel(text, hits, { image });
        state.messages.push({ role: "assistant", content: answer });
        pushMemory(text, answer, concepts, hits);
        state.uploadedImage = null;
      } catch (err) {
        state.messages.push({ role: "system", content: err.message });
      } finally {
        el.sendQuestion.disabled = false;
        el.sendQuestion.textContent = "发送";
        renderAll();
        saveState();
      }
    }

    async function generateDailyQuestion() {
      state.dailyChapter = el.dailyChapter.value;
      el.generateDaily.disabled = true;
      el.generateDaily.textContent = "生成中";
      try {
        const answer = await callModel(buildDailyPrompt(), matchKnowledge(state.dailyChapter));
        state.dailyQuestion = answer;
      } catch (err) {
        state.dailyQuestion = `生成失败：${err.message}`;
      } finally {
        el.generateDaily.disabled = false;
        el.generateDaily.textContent = "生成每日一题";
        renderHome();
        saveState();
      }
    }

    async function diagnoseWrongBook() {
      el.diagnoseWrong.disabled = true;
      el.diagnoseWrong.textContent = "诊断中";
      try {
        const answer = await callModel(buildWrongDiagnosisPrompt(), matchKnowledge("错题 诊断"));
        el.wrongDiagnosis.innerHTML = `<b>AI 诊断</b>${formatFormula(answer)}`;
        typesetMath(el.wrongDiagnosis);
      } catch (err) {
        el.wrongDiagnosis.innerHTML = `<b>AI 诊断</b><p class="note">${err.message}</p>`;
      } finally {
        el.diagnoseWrong.disabled = false;
        el.diagnoseWrong.textContent = "AI 诊断错题";
      }
    }

    function formatFormula(text) {
      const safe = escapeHtml(text || "");
      return safe
        .replace(/\\\[((?:.|\n)*?)\\\]/g, '<span class="math">\\[$1\\]</span>')
        .replace(/\\\(((?:.|\n)*?)\\\)/g, '<span class="math">\\($1\\)</span>')
        .replace(/\n/g, "<br>");
    }

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function addDailyToWrongBook() {
      const content = state.dailyQuestion || "尚未生成每日一题。";
      state.wrongBook.unshift({
        id: `wrong_${Date.now()}`,
        title: `每日一题：${state.dailyChapter}`,
        chapter: state.dailyChapter,
        question: content.slice(0, 420),
        mistake: "用户标记为需要复盘。",
        diagnosis: "等待 AI 诊断。"
      });
      markPathEvent("double_integral", "question", "每日一题加入错题本");
      renderHome();
      saveState();
    }

    function pushMemory(userMessage, answer, concepts, hits) {
      const summary = answer.length > 180 ? answer.slice(0, 180) + "..." : answer;
      state.memory.push({
        turnId: Date.now(),
        userMessage,
        agentSummary: summary,
        concepts,
        exampleId: state.currentExampleId,
        misconceptions: hits.flatMap(h => h.mistakes).slice(0, 3),
        createdAt: new Date().toISOString()
      });
      if (state.memory.length > 30) {
        const removed = state.memory.splice(0, state.memory.length - 30);
        state.longSummary = `${state.longSummary || ""}\n已压缩旧记忆：${removed.map(m => m.userMessage).join("；")}`.trim();
      }
    }

    function renderMessages() {
      if (!state.messages.length) {
        el.messages.innerHTML = `<div class="empty">配置 API Key 后开始提问。</div>`;
        return;
      }
      el.messages.replaceChildren(...state.messages.map(msg => {
        const div = document.createElement("div");
        div.className = `msg ${msg.role}`;
        div.textContent = msg.content;
        return div;
      }));
      requestAnimationFrame(() => { el.messages.scrollTop = el.messages.scrollHeight; });
      typesetMath(el.messages);
    }

    function renderHome() {
      if (!el.dailyQuestion) return;
      el.dailyChapter.value = state.dailyChapter || "多元函数微分学";
      el.dailyQuestion.innerHTML = state.dailyQuestion
        ? `<b>今日题目</b>${formatFormula(state.dailyQuestion)}`
        : `<b>今日题目</b><span class="math">选择章节后点击生成。题目会优先使用 LaTeX 公式格式，例如：\\iint_D \\rho(x,y)\\,dA。</span>`;
      el.wrongCount.textContent = `${state.wrongBook.length} 条记录`;
      el.wrongBook.replaceChildren(...state.wrongBook.map(item => {
        const div = document.createElement("div");
        div.className = "wrong-item";
        div.innerHTML = `<h3>${escapeHtml(item.title)}</h3>
          <p><b>章节：</b>${escapeHtml(item.chapter)}</p>
          <p><b>题目：</b>${formatFormula(item.question)}</p>
          <p><b>错误：</b>${escapeHtml(item.mistake)}</p>
          <p><b>诊断：</b>${escapeHtml(item.diagnosis)}</p>`;
        return div;
      }));
      if (state.uploadedImage) {
        el.imagePreview.innerHTML = `<img src="${state.uploadedImage.dataUrl}" alt="参考图片"><span>${escapeHtml(state.uploadedImage.name)} 已附加到下一次提问</span>`;
      } else {
        el.imagePreview.textContent = "可上传题目截图、板书或草稿作为 Agent 参考。";
      }
      typesetMath(el.dailyQuestion);
      typesetMath(el.wrongBook);
    }

    function typesetMath(root) {
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([root]).catch(() => {});
      }
    }

    function renderGraph() {
      const svg = el.knowledgeGraph;
      svg.innerHTML = "";
      const positions = layoutNodes();
      graphEdges.forEach(([source, target, type]) => {
        const a = positions[source];
        const b = positions[target];
        if (!a || !b) return;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", a.x);
        line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x);
        line.setAttribute("y2", b.y);
        line.setAttribute("class", "edge");
        line.setAttribute("data-type", type);
        svg.appendChild(line);
      });
      graphNodes.forEach(node => {
        const p = positions[node.id];
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const status = state.graphStatus[node.id] || node.status || "new";
        const highlighted = state.highlightedConcepts.includes(node.id) ? " highlight" : "";
        g.setAttribute("class", `node ${status}${highlighted}`);
        g.setAttribute("transform", `translate(${p.x}, ${p.y})`);
        g.addEventListener("click", () => selectNode(node.id));
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", "27");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = shortLabel(node.label);
        g.append(circle, text);
        svg.appendChild(g);
      });
      el.nodeCount.textContent = `${graphNodes.length} 个节点`;
      renderNodeDetail();
    }

    function layoutNodes() {
      const center = { x: 195, y: 178 };
      const result = {};
      const selected = state.selectedNodeId || "derivative";
      result[selected] = center;
      const neighbors = graphEdges
        .filter(([a, b]) => a === selected || b === selected)
        .flatMap(([a, b]) => [a, b])
        .filter(id => id !== selected);
      const unique = Array.from(new Set(neighbors));
      unique.forEach((id, index) => {
        const angle = (Math.PI * 2 * index) / Math.max(unique.length, 1) - Math.PI / 2;
        result[id] = { x: center.x + Math.cos(angle) * 118, y: center.y + Math.sin(angle) * 104 };
      });
      graphNodes.filter(n => !result[n.id]).forEach((node, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        result[node.id] = { x: 54 + col * 94, y: 48 + row * 72 };
      });
      return result;
    }

    function shortLabel(label) {
      return label.length > 4 ? label.slice(0, 4) : label;
    }

    function selectNode(id) {
      state.selectedNodeId = id;
      state.highlightedConcepts = Array.from(new Set([id, ...state.highlightedConcepts])).slice(0, 5);
      markPathEvent(id, "graph", "查看知识图谱节点");
      renderAll();
      saveState();
    }

    function renderNodeDetail() {
      const node = graphNodes.find(n => n.id === state.selectedNodeId) || graphNodes[0];
      const relatedExamples = examples.filter(e => e.concepts.includes(node.id));
      const related = graphEdges.filter(([a, b]) => a === node.id || b === node.id)
        .map(([a, b, type]) => `${labelOf(a === node.id ? b : a)}（${type}）`);
      const box = document.createElement("div");
      box.className = "detail";
      box.innerHTML = `<b>${node.label}</b><br>${node.description}<br><br><b>关联：</b>${related.join("；") || "暂无"}<br><b>示例：</b>${relatedExamples.map(e => e.title).join("；") || "暂无"}`;
      const actions = document.createElement("div");
      actions.className = "node-actions";
      [
        ["learning", "学习中"],
        ["mastered", "已掌握"],
        ["review", "需复习"]
      ].forEach(([status, text]) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = status === "mastered" ? "primary" : "";
        btn.addEventListener("click", () => {
          state.graphStatus[node.id] = status;
          markPathEvent(node.id, "status", `标记为${text}`);
          renderAll();
          saveState();
        });
        actions.appendChild(btn);
      });
      el.nodeDetail.replaceChildren(box, actions);
    }

    function labelOf(id) {
      return graphNodes.find(n => n.id === id)?.label || id;
    }

    function markPathEvent(conceptId, type, reason) {
      if (!conceptId || !graphNodes.some(n => n.id === conceptId)) return;
      state.pathEvents.push({ conceptId, type, reason, at: Date.now() });
      state.pathEvents = state.pathEvents.slice(-160);
      if (type === "question" && state.graphStatus[conceptId] !== "mastered") state.graphStatus[conceptId] = "review";
      if (type === "example" && state.graphStatus[conceptId] === "new") state.graphStatus[conceptId] = "learning";
    }

    function computeTasks() {
      const scores = new Map();
      state.pathEvents.forEach((event, index) => {
        const weight = event.type === "question" ? 4 : event.type === "status" ? 2 : 1.8;
        scores.set(event.conceptId, (scores.get(event.conceptId) || 0) + weight + index / 100);
      });
      graphEdges.forEach(([source, target, type]) => {
        if (type === "prerequisite" && state.graphStatus[target] !== "mastered" && state.graphStatus[source] !== "mastered") {
          scores.set(source, (scores.get(source) || 0) + 2.5);
        }
      });
      state.highlightedConcepts.forEach(id => scores.set(id, (scores.get(id) || 0) + 2));
      const tasks = graphNodes.map(node => {
        const status = state.graphStatus[node.id] || "new";
        const base = scores.get(node.id) || (status === "review" ? 4 : status === "learning" ? 2 : .5);
        const confidence = status === "mastered" ? .9 : status === "learning" ? .48 : status === "review" ? .28 : .16;
        const ex = examples.find(e => e.concepts.includes(node.id));
        const reason = status === "review"
          ? "近期提问或操作显示该知识点需要复习。"
          : status === "learning"
            ? "该知识点正在学习中，适合通过示例继续巩固。"
            : "它是后续内容的基础节点，建议先建立直觉。";
        return { id: node.id, label: node.label, status, score: base, confidence, example: ex, reason };
      }).filter(t => t.status !== "mastered")
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      return tasks;
    }

    function renderPath() {
      const statuses = Object.values(state.graphStatus);
      const mastered = statuses.filter(s => s === "mastered").length;
      const review = statuses.filter(s => s === "review").length;
      const tasks = computeTasks();
      el.masteredCount.textContent = mastered;
      el.reviewCount.textContent = review;
      el.taskCount.textContent = tasks.length;
      if (!tasks.length) {
        el.taskList.innerHTML = `<div class="empty">暂无推荐任务。先选择示例、提问或点击图谱节点。</div>`;
        return;
      }
      el.taskList.replaceChildren(...tasks.map(task => {
        const div = document.createElement("div");
        div.className = "task";
        div.innerHTML = `<h3>${task.label}</h3><p>${task.reason}<br>掌握信心：${Math.round(task.confidence * 100)}%${task.example ? ` · 推荐示例：${task.example.title}` : ""}</p>`;
        const actions = document.createElement("div");
        actions.className = "task-actions";
        const open = document.createElement("button");
        open.textContent = task.example ? "打开示例" : "查看图谱";
        open.addEventListener("click", () => {
          if (task.example) loadExample(task.example.id);
          state.selectedNodeId = task.id;
          switchTab(task.example ? "graph" : "graphmap");
          renderAll();
        });
        const ask = document.createElement("button");
        ask.className = "primary";
        ask.textContent = "问老师";
        ask.addEventListener("click", () => {
          switchTab("agent");
          el.questionInput.value = `请结合图形解释“${task.label}”这个知识点，并指出我的下一步学习方法。`;
          el.questionInput.focus();
        });
        actions.append(open, ask);
        div.appendChild(actions);
        return div;
      }));
    }

    function syncControls() {
      el.exprInput.value = state.expr;
      el.xRange.value = state.x;
      el.yRange.value = state.y || 0;
      el.aRange.value = state.a;
      el.bRange.value = state.b;
      el.scaleRange.value = state.scale;
      el.showTangent.checked = state.showTangent;
      el.showIntegral.checked = state.showIntegral;
      el.showSamples.checked = state.showSamples;
      el.baseUrlInput.value = state.api.baseUrl || DEFAULT_BASE_URL;
      el.modelInput.value = state.api.model || "gpt-4o-mini";
      el.apiKeyInput.value = state.api.key || "";
      el.apiStatus.textContent = state.api.key ? "Key 已配置" : "未配置 Key";
    }

    function selectedCharacter() {
      return CHARACTER_LIBRARY[state.playerProfile?.gender] || CHARACTER_LIBRARY.male;
    }

    function updateWorldProfileUI() {
      el.playerNameInput.value = state.playerProfile?.name || "";
      el.worldPlayerName.textContent = state.playerProfile?.name || "探索者";
      el.avatarGrid.querySelectorAll(".avatar-card").forEach(card => {
        card.classList.toggle("active", card.dataset.gender === (state.playerProfile?.gender || "male"));
      });
    }

    function enterWorldSelection() {
      worldRunning = false;
      if (worldFrame) cancelAnimationFrame(worldFrame);
      el.worldShell.hidden = false;
      el.worldOnboarding.hidden = false;
      el.worldStage.hidden = true;
      el.worldEnter.hidden = true;
      updateWorldProfileUI();
      saveState();
    }

    function showMainApp() {
      worldRunning = false;
      if (worldFrame) cancelAnimationFrame(worldFrame);
      el.worldShell.hidden = true;
      renderAll();
    }

    function startWorldStage() {
      const fallbackName = state.playerProfile?.gender === "female" ? "林知夏" : "周知行";
      const inputName = el.playerNameInput.value.trim();
      state.playerProfile.name = inputName || state.playerProfile.name || fallbackName;
      state.playerProfile.gender = state.playerProfile.gender || "male";
      worldScene.player.x = 0;
      worldScene.player.z = 0.08;
      worldScene.player.facing = "up";
      worldScene.player.stepTime = 0;
      worldScene.player.moving = false;
      el.worldPlayerName.textContent = state.playerProfile.name;
      el.worldOnboarding.hidden = true;
      el.worldStage.hidden = false;
      el.worldShell.hidden = false;
      el.worldEnter.hidden = true;
      worldRunning = true;
      worldLastTime = 0;
      saveState();
      if (worldFrame) cancelAnimationFrame(worldFrame);
      worldFrame = requestAnimationFrame(runWorldFrame);
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function projectWorld(x, z) {
      const t = clamp(z, 0, 1);
      const scale = worldScene.farScale + (worldScene.nearScale - worldScene.farScale) * t;
      const halfWidth = 38 + 140 * t;
      const screenX = worldScene.width / 2 + x * halfWidth;
      const screenY = worldScene.floorTop + (1 - t) * (worldScene.floorBottom - worldScene.floorTop);
      return { x: screenX, y: screenY, scale, t };
    }

    function getWorldIntent() {
      let x = 0;
      let y = 0;
      if (worldInput.keys.w || worldInput.keys.arrowup) y -= 1;
      if (worldInput.keys.s || worldInput.keys.arrowdown) y += 1;
      if (worldInput.keys.a || worldInput.keys.arrowleft) x -= 1;
      if (worldInput.keys.d || worldInput.keys.arrowright) x += 1;
      x += worldInput.joystick.x;
      y += worldInput.joystick.y;
      const length = Math.hypot(x, y);
      if (length > 1) {
        x /= length;
        y /= length;
      }
      return { x, y, moving: length > 0.08 };
    }

    function updateWorld(dt) {
      const intent = getWorldIntent();
      const player = worldScene.player;
      player.moving = intent.moving;
      if (intent.moving) {
        const speedScale = 0.7 + player.z * 0.7;
        player.x += intent.x * dt * 1.55 * speedScale;
        player.z += (-intent.y) * dt * 0.78;
        player.stepTime += dt * 10;
        if (Math.abs(intent.x) > Math.abs(intent.y)) {
          player.facing = intent.x > 0 ? "right" : "left";
        } else {
          player.facing = intent.y > 0 ? "down" : "up";
        }
      } else {
        player.stepTime = 0;
      }
      player.x = clamp(player.x, -1.06, 1.06);
      player.z = clamp(player.z, 0.02, 0.96);
    }

    function isNearGate() {
      const dx = Math.abs(worldScene.player.x - worldScene.gate.x);
      const dz = Math.abs(worldScene.player.z - (worldScene.gate.z - 0.08));
      return dx < 0.34 && dz < 0.12;
    }

    function drawWorldBackground(ctx) {
      ctx.clearRect(0, 0, worldScene.width, worldScene.height);
      const bg = ctx.createLinearGradient(0, 0, 0, worldScene.height);
      bg.addColorStop(0, "#071b30");
      bg.addColorStop(0.4, "#0a2b49");
      bg.addColorStop(1, "#103b63");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, worldScene.width, worldScene.height);

      ctx.fillStyle = "rgba(120, 220, 255, 0.07)";
      for (let i = 0; i < 20; i++) {
        const y = 86 + i * 26;
        ctx.fillRect(0, y, worldScene.width, 1);
      }

      ctx.fillStyle = "#0b2846";
      ctx.beginPath();
      ctx.moveTo(0, worldScene.horizonY);
      ctx.lineTo(worldScene.width, worldScene.horizonY);
      ctx.lineTo(worldScene.width, worldScene.floorTop);
      ctx.lineTo(0, worldScene.floorTop);
      ctx.closePath();
      ctx.fill();

      const floorGrad = ctx.createLinearGradient(0, worldScene.floorTop, 0, worldScene.floorBottom);
      floorGrad.addColorStop(0, "#103f67");
      floorGrad.addColorStop(0.55, "#0b2d4b");
      floorGrad.addColorStop(1, "#071a2c");
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.moveTo(0, worldScene.floorTop);
      ctx.lineTo(worldScene.width, worldScene.floorTop);
      ctx.lineTo(worldScene.width, worldScene.floorBottom);
      ctx.lineTo(0, worldScene.floorBottom);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(154, 229, 255, 0.16)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 11; i++) {
        const nx = i / 11;
        const topX = worldScene.width * (0.22 + 0.56 * nx);
        const bottomX = worldScene.width * (0.05 + 0.9 * nx);
        ctx.beginPath();
        ctx.moveTo(topX, worldScene.floorTop);
        ctx.lineTo(bottomX, worldScene.floorBottom);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const z = i / 11;
        const row = projectWorld(0, z);
        const width = 66 + z * 330;
        ctx.beginPath();
        ctx.moveTo(worldScene.width / 2 - width / 2, row.y);
        ctx.lineTo(worldScene.width / 2 + width / 2, row.y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(139, 220, 255, 0.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, worldScene.floorTop);
      ctx.lineTo(0, worldScene.floorBottom);
      ctx.moveTo(worldScene.width, worldScene.floorTop);
      ctx.lineTo(worldScene.width, worldScene.floorBottom);
      ctx.stroke();
    }

    function drawGate(ctx) {
      const { x, z, w, h, depth } = worldScene.gate;
      const anchor = projectWorld(x, z);
      const bodyW = w * anchor.scale;
      const bodyH = h * anchor.scale;
      const extrude = depth * anchor.scale;
      const left = anchor.x - bodyW / 2;
      const top = anchor.y - bodyH - 10;
      ctx.save();
      ctx.shadowColor = "rgba(124, 227, 255, 0.38)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#79dbff";
      ctx.fillRect(left, top, bodyW, bodyH);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#48a8ee";
      ctx.fillRect(left, top + bodyH, bodyW, extrude);
      ctx.fillStyle = "#2b6cb7";
      ctx.beginPath();
      ctx.moveTo(left + bodyW, top);
      ctx.lineTo(left + bodyW + extrude * 0.8, top + extrude * 0.45);
      ctx.lineTo(left + bodyW + extrude * 0.8, top + bodyH + extrude * 1.45);
      ctx.lineTo(left + bodyW, top + bodyH + extrude);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0d3559";
      ctx.beginPath();
      ctx.moveTo(left, top + bodyH);
      ctx.lineTo(left + bodyW, top + bodyH);
      ctx.lineTo(left + bodyW + extrude * 0.8, top + bodyH + extrude * 0.45);
      ctx.lineTo(left + extrude * 0.8, top + bodyH + extrude * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#dff7ff";
      ctx.font = `900 ${Math.max(12, 18 * anchor.scale)}px 'Noto Sans SC', 'Microsoft YaHei', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("AI 智能", anchor.x, top + bodyH * 0.34);
      ctx.fillText("学习空间", anchor.x, top + bodyH * 0.6);
      ctx.fillStyle = "rgba(214, 245, 255, 0.12)";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(left + bodyW * 0.08 + i * bodyW * 0.21, top + bodyH * 0.73, bodyW * 0.13, bodyH * 0.08);
      }
      ctx.restore();
    }

    function getSpriteFrame() {
      const columns = 6;
      const rows = 5;
      const sheet = spriteSheets[state.playerProfile?.gender || "male"];
      const frameWidth = sheet.naturalWidth ? sheet.naturalWidth / columns : 0;
      const frameHeight = sheet.naturalHeight ? sheet.naturalHeight / rows : 0;
      const rowMap = { left: 0, right: 1, up: 3, down: 4 };
      const row = rowMap[worldScene.player.facing] ?? 4;
      const col = worldScene.player.moving ? Math.floor(worldScene.player.stepTime) % columns : 2;
      return { sheet, frameWidth, frameHeight, row, col };
    }

    function getPreviewFrame(gender) {
      const columns = 6;
      const rows = 5;
      const sheet = spriteSheets[gender];
      const frameWidth = sheet.naturalWidth ? sheet.naturalWidth / columns : 0;
      const frameHeight = sheet.naturalHeight ? sheet.naturalHeight / rows : 0;
      const col = avatarPreviewFrame % columns;
      const row = 4;
      return { sheet, frameWidth, frameHeight, row, col };
    }

    function renderAvatarPreviews() {
      [["male", el.malePreview], ["female", el.femalePreview]].forEach(([gender, canvas]) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "#0d2742");
        grad.addColorStop(1, "#133d65");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(152, 230, 255, 0.12)";
        for (let i = 0; i < 6; i++) {
          const y = 26 + i * 22;
          ctx.beginPath();
          ctx.moveTo(14, y);
          ctx.lineTo(canvas.width - 14, y);
          ctx.stroke();
        }
        const frame = getPreviewFrame(gender);
        if (frame.sheet.complete && frame.frameWidth && frame.frameHeight) {
          const dw = 96;
          const dh = 96;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            frame.sheet,
            frame.col * frame.frameWidth,
            frame.row * frame.frameHeight,
            frame.frameWidth,
            frame.frameHeight,
            (canvas.width - dw) / 2,
            28,
            dw,
            dh
          );
        } else {
          const preview = previewImages[gender];
          if (preview?.complete && preview.naturalWidth) {
            const dw = 102;
            const dh = 102;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(preview, (canvas.width - dw) / 2, 24, dw, dh);
          }
        }
        ctx.fillStyle = "rgba(8, 22, 38, 0.34)";
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, 132, 36, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function runAvatarPreviewLoop(timestamp) {
      if (!avatarPreviewLastAt || timestamp - avatarPreviewLastAt >= 150) {
        avatarPreviewLastAt = timestamp;
        avatarPreviewFrame = (avatarPreviewFrame + 1) % 6;
        renderAvatarPreviews();
      }
      avatarPreviewRaf = requestAnimationFrame(runAvatarPreviewLoop);
    }

    function drawExhibitPedestal(ctx, projected, tint) {
      const width = 44 * projected.scale;
      const height = 18 * projected.scale;
      const left = projected.x - width / 2;
      const top = projected.y - height;
      ctx.fillStyle = tint;
      ctx.fillRect(left, top, width, height);
      ctx.fillStyle = "rgba(11, 36, 58, 0.65)";
      ctx.fillRect(left, top + height, width, 7 * projected.scale);
      ctx.fillStyle = "rgba(203, 246, 255, 0.15)";
      ctx.fillRect(left + 4 * projected.scale, top + 4 * projected.scale, width - 8 * projected.scale, 3 * projected.scale);
    }

    function drawWaveExhibit(ctx, projected, tint) {
      drawExhibitPedestal(ctx, projected, "#1a6ca2");
      ctx.save();
      ctx.translate(projected.x, projected.y - 18 * projected.scale);
      ctx.strokeStyle = tint;
      ctx.lineWidth = Math.max(1.4, 3 * projected.scale);
      ctx.beginPath();
      for (let i = -20; i <= 20; i++) {
        const x = i * projected.scale * 1.4;
        const y = Math.sin(i / 4 + worldLastTime / 260) * 8 * projected.scale;
        if (i === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawSpiralExhibit(ctx, projected, tint) {
      drawExhibitPedestal(ctx, projected, "#155a91");
      ctx.save();
      ctx.translate(projected.x, projected.y - 20 * projected.scale);
      ctx.strokeStyle = tint;
      ctx.lineWidth = Math.max(1.2, 2.6 * projected.scale);
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const t = i / 6;
        const r = (2 + i * 0.45) * projected.scale;
        const x = Math.cos(t + worldLastTime / 1100) * r;
        const y = Math.sin(t + worldLastTime / 1100) * r * 0.62 - i * 0.52 * projected.scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawSurfaceExhibit(ctx, projected, tint) {
      drawExhibitPedestal(ctx, projected, "#12517f");
      ctx.save();
      ctx.translate(projected.x, projected.y - 14 * projected.scale);
      ctx.fillStyle = tint;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const xx = (col - 1.5) * 11 * projected.scale;
          const zz = (row - 1.5) * 8 * projected.scale;
          const hh = (Math.sin(col + worldLastTime / 500) + Math.cos(row + worldLastTime / 650)) * 4 * projected.scale + 10 * projected.scale;
          ctx.fillRect(xx, zz - hh, 8 * projected.scale, hh);
        }
      }
      ctx.restore();
    }

    function drawIntegralExhibit(ctx, projected, tint) {
      drawExhibitPedestal(ctx, projected, "#1a5f97");
      ctx.save();
      ctx.translate(projected.x, projected.y - 14 * projected.scale);
      ctx.fillStyle = tint;
      for (let i = 0; i < 5; i++) {
        const h = (10 + i * 5) * projected.scale;
        const x = (i - 2) * 11 * projected.scale;
        ctx.fillRect(x, -h, 7 * projected.scale, h);
      }
      ctx.strokeStyle = "rgba(221, 248, 255, 0.75)";
      ctx.lineWidth = Math.max(1.1, 2 * projected.scale);
      ctx.beginPath();
      for (let i = -22; i <= 22; i++) {
        const x = i * projected.scale * 0.9;
        const y = -14 * projected.scale - Math.exp(-Math.abs(i) / 10) * 18 * projected.scale;
        if (i === -22) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawExhibits(ctx) {
      worldScene.exhibits
        .slice()
        .sort((a, b) => a.z - b.z)
        .forEach(exhibit => {
          const projected = projectWorld(exhibit.x, exhibit.z);
          if (exhibit.kind === "wave") drawWaveExhibit(ctx, projected, exhibit.hue);
          if (exhibit.kind === "spiral") drawSpiralExhibit(ctx, projected, exhibit.hue);
          if (exhibit.kind === "surface") drawSurfaceExhibit(ctx, projected, exhibit.hue);
          if (exhibit.kind === "integral") drawIntegralExhibit(ctx, projected, exhibit.hue);
        });
    }

    function drawPlayer(ctx) {
      const frame = getSpriteFrame();
      const projected = projectWorld(worldScene.player.x, worldScene.player.z);
      const px = projected.x;
      const py = projected.y;
      ctx.fillStyle = "rgba(3, 16, 31, 0.4)";
      ctx.beginPath();
      ctx.ellipse(px, py + 3, 16 * projected.scale, 7 * projected.scale, 0, 0, Math.PI * 2);
      ctx.fill();
      if (frame.sheet.complete && frame.frameWidth && frame.frameHeight) {
        const dw = 54 * projected.scale;
        const dh = 54 * projected.scale;
        ctx.drawImage(
          frame.sheet,
          frame.col * frame.frameWidth,
          frame.row * frame.frameHeight,
          frame.frameWidth,
          frame.frameHeight,
          px - dw / 2,
          py - dh + 8 * projected.scale,
          dw,
          dh
        );
      } else {
        ctx.fillStyle = "#d7f2ff";
        ctx.fillRect(px - 14 * projected.scale, py - 36 * projected.scale, 28 * projected.scale, 36 * projected.scale);
      }
    }

    function drawWorldScene() {
      const ctx = el.worldCanvas.getContext("2d");
      drawWorldBackground(ctx);
      drawExhibits(ctx);
      drawGate(ctx);
      drawPlayer(ctx);
      const near = isNearGate();
      el.worldEnter.hidden = !near;
      el.worldStatus.textContent = near
        ? "已抵达蓝模书本，点击进入。"
        : "前往前方发光的蓝模书本。";
    }

    function runWorldFrame(timestamp) {
      if (!worldRunning) return;
      if (!worldLastTime) worldLastTime = timestamp;
      const dt = Math.min(0.032, (timestamp - worldLastTime) / 1000);
      worldLastTime = timestamp;
      renderAvatarPreviews();
      updateWorld(dt);
      drawWorldScene();
      worldFrame = requestAnimationFrame(runWorldFrame);
    }

    function applyJoystick(clientX, clientY) {
      const rect = el.joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const radius = rect.width * 0.34;
      const distance = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(radius, distance);
      const nx = dx / distance;
      const ny = dy / distance;
      const moveX = nx * clamped;
      const moveY = ny * clamped;
      worldInput.joystick.x = moveX / radius;
      worldInput.joystick.y = moveY / radius;
      el.joystickThumb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    function resetJoystick() {
      worldInput.joystick.active = false;
      worldInput.joystick.pointerId = null;
      worldInput.joystick.x = 0;
      worldInput.joystick.y = 0;
      el.joystickThumb.style.transform = "translate(0, 0)";
    }

    function renderAll() {
      syncControls();
      renderCanvas();
      renderExamples();
      renderKnowledgeHits();
      renderMessages();
      renderHome();
      renderGraph();
      renderPath();
      updateActiveTab();
    }

    function switchTab(tab) {
      state.activeTab = tab;
      updateActiveTab();
      saveState();
      if (tab === "graph") requestAnimationFrame(renderCanvas);
    }

    function updateActiveTab() {
      document.querySelectorAll(".tab-page").forEach(page => page.classList.toggle("active", page.id === `tab-${state.activeTab}`));
      document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === state.activeTab));
    }

    function bindEvents() {
      el.avatarGrid.querySelectorAll(".avatar-card").forEach(card => {
        card.addEventListener("click", () => {
          state.playerProfile.gender = card.dataset.gender || "male";
          updateWorldProfileUI();
          saveState();
        });
      });
      el.startWorld.addEventListener("click", startWorldStage);
      el.changeAvatar.addEventListener("click", enterWorldSelection);
      el.enterAgent.addEventListener("click", showMainApp);
      el.playerNameInput.addEventListener("input", () => {
        state.playerProfile.name = el.playerNameInput.value.trim();
        el.worldPlayerName.textContent = state.playerProfile.name || "探索者";
        saveState();
      });
      window.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
          worldInput.keys[key] = true;
          if (!el.worldShell.hidden) e.preventDefault();
        }
      });
      window.addEventListener("keyup", e => {
        const key = e.key.toLowerCase();
        if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
          worldInput.keys[key] = false;
        }
      });
      el.joystick.addEventListener("pointerdown", e => {
        worldInput.joystick.active = true;
        worldInput.joystick.pointerId = e.pointerId;
        el.joystick.setPointerCapture(e.pointerId);
        applyJoystick(e.clientX, e.clientY);
        e.preventDefault();
      });
      el.joystick.addEventListener("pointermove", e => {
        if (!worldInput.joystick.active || worldInput.joystick.pointerId !== e.pointerId) return;
        applyJoystick(e.clientX, e.clientY);
      });
      const stopJoystick = e => {
        if (worldInput.joystick.pointerId != null && e.pointerId !== worldInput.joystick.pointerId) return;
        try { el.joystick.releasePointerCapture(e.pointerId); } catch {}
        resetJoystick();
      };
      el.joystick.addEventListener("pointerup", stopJoystick);
      el.joystick.addEventListener("pointercancel", stopJoystick);

      document.querySelectorAll(".nav-btn").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
      const updateFromControls = () => {
        state.expr = el.exprInput.value;
        state.x = Number(el.xRange.value);
        state.y = Number(el.yRange.value);
        state.a = Number(el.aRange.value);
        state.b = Number(el.bRange.value);
        state.scale = Number(el.scaleRange.value);
        state.showTangent = el.showTangent.checked;
        state.showIntegral = el.showIntegral.checked;
        state.showSamples = el.showSamples.checked;
        renderCanvas();
        saveState();
      };
      [el.exprInput, el.xRange, el.yRange, el.aRange, el.bRange, el.scaleRange, el.showTangent, el.showIntegral, el.showSamples]
        .forEach(input => input.addEventListener("input", updateFromControls));

      const pointerToX = clientX => {
        const rect = el.canvasWrap.getBoundingClientRect();
        const x = ((clientX - rect.left) - rect.width / 2) / state.scale;
        return Math.max(-8, Math.min(8, x));
      };
      const pointerToXY = (clientX, clientY) => {
        const rect = el.canvasWrap.getBoundingClientRect();
        const lo = Math.min(state.a, state.b);
        const hi = Math.max(state.a, state.b);
        return {
          x: lo + ((clientX - rect.left) / rect.width) * (hi - lo),
          y: hi - ((clientY - rect.top) / rect.height) * (hi - lo)
        };
      };
      el.canvasWrap.addEventListener("pointerdown", e => {
        dragging = true;
        el.canvasWrap.setPointerCapture(e.pointerId);
        if (isSurfaceMode()) {
          const point = pointerToXY(e.clientX, e.clientY);
          state.x = point.x;
          state.y = point.y;
        } else {
          state.x = pointerToX(e.clientX);
        }
        syncControls();
        renderCanvas();
      });
      el.canvasWrap.addEventListener("pointermove", e => {
        if (!dragging) return;
        if (isSurfaceMode()) {
          const point = pointerToXY(e.clientX, e.clientY);
          state.x = point.x;
          state.y = point.y;
        } else {
          state.x = pointerToX(e.clientX);
        }
        syncControls();
        renderCanvas();
      });
      el.canvasWrap.addEventListener("pointerup", e => {
        dragging = false;
        try { el.canvasWrap.releasePointerCapture(e.pointerId); } catch {}
        saveState();
      });
      el.canvasWrap.addEventListener("touchstart", e => {
        if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          pinchStart = { dist: Math.hypot(dx, dy), scale: state.scale };
        }
      }, { passive: true });
      el.canvasWrap.addEventListener("touchmove", e => {
        if (e.touches.length === 2 && pinchStart) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          state.scale = Math.max(22, Math.min(80, Math.round(pinchStart.scale * dist / pinchStart.dist)));
          syncControls();
          renderCanvas();
          saveState();
        }
      }, { passive: true });

      el.openSettings.addEventListener("click", () => el.settingsDialog.showModal());
      el.openSettings2.addEventListener("click", () => el.settingsDialog.showModal());
      el.settingsForm.addEventListener("submit", e => {
        e.preventDefault();
        state.api.baseUrl = el.baseUrlInput.value.trim() || DEFAULT_BASE_URL;
        state.api.model = el.modelInput.value.trim() || "gpt-4o-mini";
        state.api.key = el.apiKeyInput.value.trim();
        el.settingsDialog.close();
        renderAll();
        saveState();
      });
      el.clearKey.addEventListener("click", () => {
        state.api.key = "";
        el.apiKeyInput.value = "";
        renderAll();
        saveState();
      });
      el.sendQuestion.addEventListener("click", () => sendQuestion(el.questionInput.value));
      el.questionInput.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendQuestion(el.questionInput.value);
        }
      });
      el.clearMemory.addEventListener("click", () => {
        state.memory = [];
        state.messages = [{ role: "system", content: "记忆已清空。新的对话会重新累计到 30 轮。" }];
        renderAll();
        saveState();
      });
      el.homeGraph.addEventListener("click", () => switchTab("graph"));
      el.homeAgent.addEventListener("click", () => switchTab("agent"));
      el.dailyChapter.addEventListener("change", () => {
        state.dailyChapter = el.dailyChapter.value;
        saveState();
      });
      el.generateDaily.addEventListener("click", generateDailyQuestion);
      el.saveDailyWrong.addEventListener("click", addDailyToWrongBook);
      el.askDailyHint.addEventListener("click", () => {
        switchTab("agent");
        el.questionInput.value = `请提示这道每日一题的解题思路，不要直接给完整答案：\n${state.dailyQuestion || state.dailyChapter}`;
        el.questionInput.focus();
      });
      el.diagnoseWrong.addEventListener("click", diagnoseWrongBook);
      el.imageUpload.addEventListener("change", () => {
        const file = el.imageUpload.files && el.imageUpload.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          state.uploadedImage = { name: file.name, dataUrl: reader.result };
          renderHome();
          saveState();
        };
        reader.readAsDataURL(file);
      });
      el.askFromGraph.addEventListener("click", () => {
        switchTab("agent");
        el.questionInput.value = isSurfaceMode()
          ? `请解释当前多元函数 z=${state.expr} 在 (x,y)=(${state.x.toFixed(2)}, ${state.y.toFixed(2)}) 附近的三维图形意义，重点说明偏导、梯度、二重积分、密度或质心。`
          : `请解释当前函数 f(x)=${state.expr} 在 x=${state.x.toFixed(2)} 附近的图形意义，重点说明导数、切线或积分面积。`;
        el.questionInput.focus();
      });
      window.addEventListener("resize", () => requestAnimationFrame(renderCanvas));
    }

    bindEvents();
    updateWorldProfileUI();
    renderAvatarPreviews();
    avatarPreviewRaf = requestAnimationFrame(runAvatarPreviewLoop);
    renderAll();
    enterWorldSelection();
  
