import cityBackgroundChengUrl from "../../ui/background/cheng.png?url";
import cityBackgroundChengzhenUrl from "../../ui/background/chengzhen.png?url";
import cityBackgroundShijingUrl from "../../ui/background/shijing.png?url";
import cityBackgroundXiangcunUrl from "../../ui/background/xiangcun.png?url";
import buildingBackgroundBiaojuUrl from "../../ui/background/biaoju.png?url";
import buildingBackgroundChalouUrl from "../../ui/background/chalou.png?url";
import buildingBackgroundDangpuUrl from "../../ui/background/dangpu.png?url";
import buildingBackgroundGudongfangUrl from "../../ui/background/gudongfang.png?url";
import buildingBackgroundHanlinyuanUrl from "../../ui/background/hanlinyuan.png?url";
import buildingBackgroundHomeUrl from "../../ui/background/home.png?url";
import buildingBackgroundHome1Url from "../../ui/background/home1.png?url";
import buildingBackgroundHuichuntangUrl from "../../ui/background/huichuntang.png?url";
import buildingBackgroundJiusiUrl from "../../ui/background/jiusi.png?url";
import buildingBackgroundJunyingUrl from "../../ui/background/junying.png?url";
import buildingBackgroundLianghangUrl from "../../ui/background/lianghang.png?url";
import buildingBackgroundMingjiaofentanUrl from "../../ui/background/mingjiaofentan.png?url";
import buildingBackgroundQinfangUrl from "../../ui/background/qinfang.png?url";
import buildingBackgroundShuaifuUrl from "../../ui/background/shuaifu.png?url";
import buildingBackgroundTempleUrl from "../../ui/background/temple.jpg?url";
import buildingBackgroundTiejiangpuUrl from "../../ui/background/tiejiangpu.png?url";
import buildingBackgroundWuguanUrl from "../../ui/background/wuguan.png?url";
import buildingBackgroundZizhaiUrl from "../../ui/background/zizhai.png?url";

export type LocationBackgroundOption = {
  value: string;
  label: string;
};

export const CITY_DEFAULT_BACKGROUND_OPTIONS: LocationBackgroundOption[] = [
  { value: "", label: "未设置默认背景" },
  { value: "chengzhen", label: "城镇背景" },
  { value: "cheng", label: "城市背景" },
  { value: "xiangcun", label: "乡村背景" },
  { value: "shijing", label: "市井背景" },
];

export const BUILDING_DEFAULT_BACKGROUND_OPTIONS: LocationBackgroundOption[] = [
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

const LOCATION_BACKGROUND_IMAGE_URLS: Record<string, string> = {
  cheng: cityBackgroundChengUrl,
  chengzhen: cityBackgroundChengzhenUrl,
  shijing: cityBackgroundShijingUrl,
  xiangcun: cityBackgroundXiangcunUrl,
  biaoju: buildingBackgroundBiaojuUrl,
  chalou: buildingBackgroundChalouUrl,
  dangpu: buildingBackgroundDangpuUrl,
  gudongfang: buildingBackgroundGudongfangUrl,
  hanlinyuan: buildingBackgroundHanlinyuanUrl,
  home: buildingBackgroundHomeUrl,
  home1: buildingBackgroundHome1Url,
  huichuntang: buildingBackgroundHuichuntangUrl,
  jiusi: buildingBackgroundJiusiUrl,
  junying: buildingBackgroundJunyingUrl,
  lianghang: buildingBackgroundLianghangUrl,
  mingjiaofentan: buildingBackgroundMingjiaofentanUrl,
  qinfang: buildingBackgroundQinfangUrl,
  shuaifu: buildingBackgroundShuaifuUrl,
  temple: buildingBackgroundTempleUrl,
  tiejiangpu: buildingBackgroundTiejiangpuUrl,
  wuguan: buildingBackgroundWuguanUrl,
  zizhai: buildingBackgroundZizhaiUrl,
};

export function resolveLocationBackgroundImageUrl(
  backgroundId: string | null | undefined
): string | null {
  if (backgroundId == null || backgroundId.length === 0) {
    return null;
  }

  return LOCATION_BACKGROUND_IMAGE_URLS[backgroundId] ?? null;
}
