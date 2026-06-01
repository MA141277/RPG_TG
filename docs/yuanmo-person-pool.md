# 元末明初时代人物池

本池用于承载“生活在元末明初时代，但未必直接和朱元璋有关”的大规模人物数据。

## 文件

- `generated/yuanmo-person-pool/accepted-person-pool.json`
  已接受的 500 人游戏可用池。
- `generated/yuanmo-person-pool/review-person-pool.json`
  待审候选池，当前不直接给运行时使用。
- `generated/yuanmo-person-pool/person-pool.json`
  accepted + review 的完整候选集合。
- `generated/yuanmo-person-pool/summary.json`
  总体统计。

## 构建与验证

```bash
npm run kb:yuanmo-person-pool:build
npm run kb:yuanmo-person-pool:validate
```

## 当前边界

当前 accepted 池固定为 500 人，来源优先级如下：

1. 项目精选人物：`src/content/zhu-yuanzhang-early-characters.ts`
2. 模组开局角色：`generated/yuanmo-npcs.json`
3. 元末明初相关文献标题人物：主要来自《明史》开国相关列传与《国初群雄事略》

这不是朱元璋早期主线表。主线表继续保持精修；城市 NPC、将领府邸、传闻、支线人物可以从本池按城市、势力、重要度、可信度筛选。

## 运行时原则

运行时不要通过中文名字符串临时猜人物身份。应读取池中已经物化的字段：

- `canonicalName`
- `sourceTypes`
- `sourceRefs`
- `confidence`
- `importance`
- `factionLabel`
- `roleLabels`
- `cityHints`
- `isPlayableNpcCandidate`
- `isLeaderResidenceCandidate`

如果要做更细的城市归属、势力归属、府邸职业分类，应在构建期扩展本池字段，再让运行时读取结构化结果。
