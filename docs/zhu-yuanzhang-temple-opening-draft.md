# 朱元璋主线草案：皇觉寺开场

这份草案把“碎片化灵感”转换为仓库可落地的主线结构。

## 原始输入的叙事核心

- 朱重八来到濠州皇觉寺
- 剃度时香碰头即灭
- 师兄以“不祥”为名想把他赶走，潜台词是怕多分口粮
- 方丈在乱年里不忍逐人，决定留他帮工
- 第一周只能寺内帮忙
- 工作分为整理经文、打扫庭院、挑水
- 三种工作先共用默认 QTE
- 累计 30 贡献后，方丈认可，解锁外出化缘

## 历史与演义边界

更接近史实主干的部分：

- 皇觉寺起点
- 乱年饥困
- 先在寺中求存，后走向外出化缘

更适合作为演义化桥段的部分：

- 香碰头即灭
- 师兄借“不祥”驱人
- 师兄担心分走口粮的内心话

建议这类桥段在角色资料或文案注释中标为：

- `sourceType: "fictionalized"`
- 或 `sourceType: "composite"`

## Beat 拆分

### 1. 剃度与收留

- 进入皇觉寺时触发
- 负责建立朱重八当前身份和处境
- 结束后直接切入首轮评定

### 2. 首轮评定

- 方丈明确“维持寺院”的方针
- 第一周只开放寺内帮忙
- 这是寺庙玩法和主线循环的教学段

### 3. 积功得准

- 玩家在寺内反复打工
- 贡献达到阈值后触发认可剧情
- 解锁外出化缘

## 推荐状态键

已写入代码常量的键：

- `var.story.zhu_yuanzhang.stage`
- `var.story.zhu_yuanzhang.temple_contribution`
- `var.story.zhu_yuanzhang.temple_week`
- `flag.story.zhu_yuanzhang.ordination.completed`
- `flag.story.zhu_yuanzhang.first_temple_review.completed`
- `flag.story.zhu_yuanzhang.temple_work_unlocked`
- `flag.story.zhu_yuanzhang.begging_unlocked`

## 推荐事件链

### `event.story.zhu_yuanzhang.ordination`

- 触发：首次进入皇觉寺
- 内容：剃度、香灭、师兄驱人、方丈收留
- 结果：
  - 初始化寺庙期变量
  - 自动启动 `first_temple_review`

### `event.story.zhu_yuanzhang.first_temple_review`

- 触发：由前一段剧情直接串起
- 内容：方丈宣布“维持寺院”，限定第一周只能寺内帮忙
- 结果：
  - 开启寺内工作入口
  - 仍未开启化缘

### `event.story.zhu_yuanzhang.unlock_begging`

- 触发：寺中界面显示时检查
- 条件：
  - 已开启寺内帮忙
  - 尚未开启化缘
  - `temple_contribution >= 30`
- 结果：
  - 方丈认可
  - 周数推进
  - 开启化缘

## 工作循环建议

第一周只允许三种寺内工作：

- `copy-scripture`
- `sweep-courtyard`
- `carry-water`

这三种工作应先共用一个 minigame 壳：

- 类型：横条来回移动
- 每轮随机命中区
- 玩家点击停止
- 共判定 3 次

结算规则：

- 0 到 1 次成功：责骂，+5 贡献
- 2 次成功：表扬，+10 贡献
- 3 次成功：表扬，+15 贡献

## 与当前实现的差距

当前 `temple-house` 里已有的寺务定义仍是：

- `beg-alms`
- `copy-scripture`
- `relief-refugees`

这和本草案的“第一周只能寺内帮忙”不一致。

后续实现时建议这样调整：

1. 将寺庙任务拆成“阶段限定工作池”
2. 和尚期第一周使用：
   - `copy-scripture`
   - `sweep-courtyard`
   - `carry-water`
3. `beg-alms` 保留到 `begging_unlocked === true` 后再开放
4. `relief-refugees` 放到更后面的寺庙阶段或乱局阶段

## 实现顺序建议

1. 先把寺庙工作池改成按 story flag/stage gating
2. 再补统一 QTE minigame overlay
3. 再接贡献值累计与 30 点阈值事件
4. 最后把自动快进到下次评定接回寺庙模块
