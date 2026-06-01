import type { CharacterDefinition } from "../domain/character";
import changYuchunUrl from "../../ui/npc/changyuchun.png?url";
import changYuchunAvatarUrl from "../../ui/npc/changyuchun(touxiang).png?url";
import guoTianxuUrl from "../../ui/npc/guotianxu.png?url";
import guoTianxuAvatarUrl from "../../ui/npc/guotianxu(touxiang).png?url";
import guoZixingUrl from "../../ui/npc/guozixing.png?url";
import guoZixingAvatarUrl from "../../ui/npc/guozixing(touxiang).png?url";
import innkeeperUrl from "../../ui/npc/jiusilaoban.png?url";
import innkeeperAvatarUrl from "../../ui/npc/jiusilaoban(touxiang).png?url";
import liShanchangUrl from "../../ui/npc/lishanchang.png?url";
import liShanchangAvatarUrl from "../../ui/npc/lishanchang(touxiang).png?url";
import liuBowenUrl from "../../ui/npc/liubowen.png?url";
import liuBowenAvatarUrl from "../../ui/npc/liubowen(touxiang).png?url";
import marketMerchantUrl from "../../ui/npc/gudongshang.png?url";
import marketMerchantAvatarUrl from "../../ui/npc/gudongshang(touxiang).png?url";
import medicineDoctorUrl from "../../ui/npc/yisheng.png?url";
import medicineDoctorAvatarUrl from "../../ui/npc/yisheng(touxiang).png?url";
import grainShopkeeperUrl from "../../ui/npc/zhanggui.png?url";
import grainShopkeeperAvatarUrl from "../../ui/npc/zhanggui(touxiang).png?url";
import seniorMonkUrl from "../../ui/npc/shixiong.png?url";
import seniorMonkAvatarUrl from "../../ui/npc/shixiong(touxiang).png?url";
import sunDeyaUrl from "../../ui/npc/sundeya.png?url";
import sunDeyaAvatarUrl from "../../ui/npc/sundeya(touxiang).png?url";
import xiaoBingUrl from "../../ui/npc/xiaobing.png?url";
import xiaoBingAvatarUrl from "../../ui/npc/xiaobing(touxiang).png?url";
import tangHeUrl from "../../ui/npc/tanghe.png?url";
import tangHeAvatarUrl from "../../ui/npc/tanghe(touxiang).png?url";
import teaBossUrl from "../../ui/npc/chaguan.png?url";
import teaBossAvatarUrl from "../../ui/npc/chaguan(touxiang).png?url";
import templeAbbotUrl from "../../ui/npc/zhuchi.png?url";
import templeAbbotAvatarUrl from "../../ui/npc/zhuchi(touxiang).png?url";
import xuDaUrl from "../../ui/npc/xuda.png?url";
import xuDaAvatarUrl from "../../ui/npc/xuda(touxiang).png?url";
import zhuStage20Url from "../../ui/user/20.png?url";
import zhuStage25Url from "../../ui/user/25.png?url";
import zhuStage26Url from "../../ui/user/26.png?url";
import zhuStage29Url from "../../ui/user/29.png?url";
import zhuStage34To39Url from "../../ui/user/34-39.png?url";
import zhuStage40Url from "../../ui/user/40.png?url";
import dengYuUrl from "../../ui/npc/dengyu.png?url";
import dengYuAvatarUrl from "../../ui/npc/dengyu(touxiang).png?url";
import fengGuoyongUrl from "../../ui/npc/fengguoyong.png?url";
import fengGuoyongAvatarUrl from "../../ui/npc/fengguoyong(touxiang).png?url";
import fengShengUrl from "../../ui/npc/fengsheng.png?url";
import fengShengAvatarUrl from "../../ui/npc/fengsheng(touxiang).png?url";
import fuYoudeUrl from "../../ui/npc/fuyoude.png?url";
import fuYoudeAvatarUrl from "../../ui/npc/fuyoude(touxiang).png?url";
import liaoYongzhongUrl from "../../ui/npc/liaoyongzhong.png?url";
import liaoYongzhongAvatarUrl from "../../ui/npc/liaoyongzhong(touxiang).png?url";
import muYingUrl from "../../ui/npc/muying.png?url";
import muYingAvatarUrl from "../../ui/npc/muying(touxiang).png?url";
import sunMinUrl from "../../ui/npc/sunmin.png?url";
import sunMinAvatarUrl from "../../ui/npc/sunmin(touxiang).png?url";
import wangBiUrl from "../../ui/npc/wangbi.png?url";
import wangBiAvatarUrl from "../../ui/npc/wangbi(touxiang).png?url";
import zhouDexingUrl from "../../ui/npc/zhoudexing.png?url";
import zhouDexingAvatarUrl from "../../ui/npc/zhoudexing(touxiang).png?url";
import zhuLiangzuUrl from "../../ui/npc/zhuliangzu.png?url";
import zhuLiangzuAvatarUrl from "../../ui/npc/zhuliangzu(touxiang).png?url";

type PortraitAsset = {
  portraitUrl: string;
  avatarUrl: string;
};

const portraitAssetById: Record<string, PortraitAsset> = {
  "portrait.player": { portraitUrl: zhuStage20Url, avatarUrl: zhuStage20Url },
  "portrait.player.stage.20": { portraitUrl: zhuStage20Url, avatarUrl: zhuStage20Url },
  "portrait.player.stage.25": { portraitUrl: zhuStage25Url, avatarUrl: zhuStage25Url },
  "portrait.player.stage.26": { portraitUrl: zhuStage26Url, avatarUrl: zhuStage26Url },
  "portrait.player.stage.29": { portraitUrl: zhuStage29Url, avatarUrl: zhuStage29Url },
  "portrait.player.stage.34_39": { portraitUrl: zhuStage34To39Url, avatarUrl: zhuStage34To39Url },
  "portrait.player.stage.40": { portraitUrl: zhuStage40Url, avatarUrl: zhuStage40Url },
  "portrait.kulan_lord": { portraitUrl: guoZixingUrl, avatarUrl: guoZixingAvatarUrl },
  "portrait.kulan_guard": { portraitUrl: sunDeyaUrl, avatarUrl: sunDeyaAvatarUrl },
  "portrait.kulan_soldier": { portraitUrl: xiaoBingUrl, avatarUrl: xiaoBingAvatarUrl },
  "portrait.kulan_xu_da": { portraitUrl: xuDaUrl, avatarUrl: xuDaAvatarUrl },
  "portrait.kulan_tang_he": { portraitUrl: tangHeUrl, avatarUrl: tangHeAvatarUrl },
  "portrait.kulan_chang_yuchun": { portraitUrl: changYuchunUrl, avatarUrl: changYuchunAvatarUrl },
  "portrait.kulan_liu_bowen": { portraitUrl: liuBowenUrl, avatarUrl: liuBowenAvatarUrl },
  "portrait.kulan_li_shanchang": { portraitUrl: liShanchangUrl, avatarUrl: liShanchangAvatarUrl },
  "portrait.kulan_temple_abbot": { portraitUrl: templeAbbotUrl, avatarUrl: templeAbbotAvatarUrl },
  "portrait.kulan_temple_senior_monk": { portraitUrl: seniorMonkUrl, avatarUrl: seniorMonkAvatarUrl },
  "portrait.kulan_tea_boss": { portraitUrl: teaBossUrl, avatarUrl: teaBossAvatarUrl },
  "portrait.kulan_grain_shopkeeper": { portraitUrl: grainShopkeeperUrl, avatarUrl: grainShopkeeperAvatarUrl },
  "portrait.kulan_medicine_doctor": { portraitUrl: medicineDoctorUrl, avatarUrl: medicineDoctorAvatarUrl },
  "portrait.kulan_merchant": { portraitUrl: marketMerchantUrl, avatarUrl: marketMerchantAvatarUrl },
  "portrait.kulan_innkeeper": { portraitUrl: innkeeperUrl, avatarUrl: innkeeperAvatarUrl },
  "portrait.yuanmo.guo_tianxu": { portraitUrl: guoTianxuUrl, avatarUrl: guoTianxuAvatarUrl },
  "portrait.yuanmo.sun_deya": { portraitUrl: sunDeyaUrl, avatarUrl: sunDeyaAvatarUrl },
  "portrait.yuanmo.deng_yu": { portraitUrl: dengYuUrl, avatarUrl: dengYuAvatarUrl },
  "portrait.yuanmo.feng_guoyong": { portraitUrl: fengGuoyongUrl, avatarUrl: fengGuoyongAvatarUrl },
  "portrait.yuanmo.feng_sheng": { portraitUrl: fengShengUrl, avatarUrl: fengShengAvatarUrl },
  "portrait.yuanmo.fu_youde": { portraitUrl: fuYoudeUrl, avatarUrl: fuYoudeAvatarUrl },
  "portrait.yuanmo.liao_yongzhong": { portraitUrl: liaoYongzhongUrl, avatarUrl: liaoYongzhongAvatarUrl },
  "portrait.yuanmo.mu_ying": { portraitUrl: muYingUrl, avatarUrl: muYingAvatarUrl },
  "portrait.yuanmo.sun_min": { portraitUrl: sunMinUrl, avatarUrl: sunMinAvatarUrl },
  "portrait.yuanmo.wang_bi": { portraitUrl: wangBiUrl, avatarUrl: wangBiAvatarUrl },
  "portrait.yuanmo.zhou_dexing": { portraitUrl: zhouDexingUrl, avatarUrl: zhouDexingAvatarUrl },
  "portrait.yuanmo.zhu_liangzu": { portraitUrl: zhuLiangzuUrl, avatarUrl: zhuLiangzuAvatarUrl },
};

function resolveCharacterPortraitAsset(character: CharacterDefinition): PortraitAsset | null {
  const activeVariantPortraitId =
    character.portraitVariants?.find(
      (variant) => variant.id === character.portraitVariantId
    )?.portraitId ?? null;

  return (
    (activeVariantPortraitId == null
      ? null
      : portraitAssetById[activeVariantPortraitId]) ??
    portraitAssetById[character.portraitId] ??
    null
  );
}

export function resolveCharacterPortraitImageUrl(
  character: CharacterDefinition
): string | null {
  return resolveCharacterPortraitAsset(character)?.portraitUrl ?? null;
}

export function resolveCharacterAvatarImageUrl(
  character: CharacterDefinition
): string | null {
  return resolveCharacterPortraitAsset(character)?.avatarUrl ?? null;
}
