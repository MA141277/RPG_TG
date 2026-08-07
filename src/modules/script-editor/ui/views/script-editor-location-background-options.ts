export type ScriptEditorLocationBackgroundOption = {
  value: string;
  label: string;
};

export const SCRIPT_EDITOR_CITY_DEFAULT_BACKGROUND_OPTIONS: ScriptEditorLocationBackgroundOption[] =
  [
    { value: "", label: "未设置默认背景" },
    { value: "chengzhen", label: "城镇背景" },
    { value: "cheng", label: "城市背景" },
    { value: "xiangcun", label: "乡村背景" },
    { value: "shijing", label: "市井背景" },
  ];

export const SCRIPT_EDITOR_BUILDING_DEFAULT_BACKGROUND_OPTIONS: ScriptEditorLocationBackgroundOption[] =
  [
    { value: "", label: "未设置默认背景" },
    { value: "zizhai", label: "自宅背景" },
    { value: "home", label: "民居背景" },
    { value: "home1", label: "居所背景" },
    { value: "shuaifu", label: "帅府背景" },
    { value: "dangpu", label: "当铺背景" },
    { value: "lianghang", label: "粮行背景" },
    { value: "jiusi", label: "酒肆背景" },
    { value: "chalou", label: "茶楼背景" },
    { value: "huichuntang", label: "回春堂背景" },
    { value: "tiejiangpu", label: "铁匠铺背景" },
    { value: "wuguan", label: "武馆背景" },
    { value: "qinfang", label: "琴房背景" },
    { value: "mingjiaofentan", label: "名教访坛背景" },
    { value: "hanlinyuan", label: "翰林院背景" },
    { value: "gudongfang", label: "古董房背景" },
    { value: "junying", label: "军营背景" },
    { value: "temple", label: "寺庙背景" },
    { value: "biaoju", label: "镖局背景" },
  ];
