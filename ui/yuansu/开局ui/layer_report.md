# Spine Layer Export Report

- PSD: `未命名作品.psd`
- Canvas: `2048 x 1152`
- Layer order: bottom to top, following the current PSD visible layer order.
- Original PSD was not modified.
- Export mode: each visible layer is exported as a full-canvas transparent PNG to preserve registration for Spine.
- Base color layer: `bg/base_FFFBF2.png` = `#FFFBF2`

| Order | Original layer name | Opacity | Alpha bounds `(left, top, right, bottom)` | Export file | Spine animation suggestion |
|---:|---|---:|---|---|---|
| 1 | `图层 13` | 163/255 (63.92%) | `(486, 176, 1386, 500)` | `cloud_mid_gray.png` | 缓慢横向漂移，轻微 alpha 呼吸；可作为远景云层循环。 |
| 2 | `已插入图像` | 255/255 (100.0%) | `(1, 735, 929, 1146)` | `cloud_left_bottom.png` | 低速左/右漂移，幅度小于中景；适合做远景遮罩感。 |
| 3 | `图层 16` | 255/255 (100.0%) | `(789, 62, 1772, 741)` | `dragon_gold.png` | 建议回 PSD 继续拆分；至少拆头、身段、爪、须、尾与云气后再做游动和呼吸。 |
| 4 | `图层 11` | 180/255 (70.59%) | `(1107, 15, 1850, 637)` | `emperor_back.png` | 保持整层，做轻微透明度起伏或 1-2px 纵向呼吸，避免大幅形变。 |
| 5 | `图层 6` | 255/255 (100.0%) | `(637, 354, 2048, 1035)` | `landscape_city_mountain.png` | 作为主远景，建议低速视差或静态；不要做局部扭曲。 |
| 6 | `图层 14` | 205/255 (80.39%) | `(1386, 275, 2032, 513)` | `cloud_right_mid.png` | 中景云层可做慢速横移，与 cloud_mid_gray 错开速度。 |
| 7 | `已插入图像` | 255/255 (100.0%) | `(1352, 0, 2048, 397)` | `cloud_right_top.png` | 远景云层可做最慢横移和淡入淡出循环。 |
| 8 | `已插入图像` | 255/255 (100.0%) | `(817, 869, 924, 953)` | `boat_far_01.png` | 远船轻微横移加 1-2px 上下浮动，循环周期较长。 |
| 9 | `图层 8` | 255/255 (100.0%) | `(881, 888, 1063, 1144)` | `boat_mid_01.png` | 中景船可做比远船稍大的上下浮动和缓慢横移。 |
| 10 | `图层 9` | 255/255 (100.0%) | `(1116, 979, 1251, 1104)` | `boat_mid_02.png` | 中景船可与 boat_mid_01 错开相位，避免同步感。 |
| 11 | `图层 10` | 255/255 (100.0%) | `(743, 791, 847, 894)` | `boat_far_02.png` | 远船保持很小位移和很慢速度，增强空间深度。 |
| 12 | `已插入图像` | 255/255 (100.0%) | `(1062, 403, 2048, 1152)` | `foreground_monk_cliff_flag.png` replaced by split layers below | 人物、衣摆、旗帜、山石已开始拆分；继续精细动画时可在拆分层基础上再回 PSD 细拆。 |
| 12.1 | `已插入图像 / split` | 255/255 (100.0%) | `(1062, 403, 2048, 1152)` | `img_v3_0212i_b3059506-4159-44f0-8999-76a1503c02dg.png` | Tag: `bottom_monk_cliff_poles`; 三张替代图中的最底层，保持静态基底。 |
| 12.2 | `已插入图像 / split` | 255/255 (100.0%) | `(1567, 634, 1839, 941)` | `img_v3_0212i_f48ccfbb-4486-407d-af1b-9dd5d60fa73g.png` | Tag: `mid_cloak`; 可用于衣摆/披风轻微摆动。 |
| 12.3 | `已插入图像 / split` | 255/255 (100.0%) | `(1859, 626, 2045, 888)` | `img_v3_0212i_315f714c-4df7-4412-a3e3-30becea0115g.png` | Tag: `top_red_flags`; 红旗在三张替代图中位于最上层。 |
| 13 | `图层 12` | 255/255 (100.0%) | `(48, 188, 865, 746)` | `title_dazu_lizhizhuan.png` | 建议回 PSD 继续拆分；按字、墨迹飞白和印章/笔触拆层后再做入场动画。 |

## Notes

- No visible layers were merged during export.
- Detailed animation targets such as the lower-right character, gold dragon, and title are intentionally kept as single exported layers here; the report marks them for further PSD splitting instead of inventing sublayers.
- Bounds are measured from the exported PNG alpha channel, not from the PSD layer record, because the PSD layer records occupy the full canvas.
