# 历史文献知识库

本仓库已将 `generated/mingshi` 目录内的历史正文 `.txt` 构建为本地可检索知识库，供后续人物、事件、卷目、条目查询使用。

## 已纳入文献

- 《明史》
- 《南村辍耕录》
- 《国初群雄事略》
- 《草木子》

## 生成位置

- `generated/history-kb/manifest.json`
- `generated/history-kb/sources.json`
- `generated/history-kb/sections.jsonl`
- `generated/history-kb/chunks.jsonl`
- `generated/history-kb/heading-index.json`
- `generated/history-kb/README.md`

## 构建命令

```bash
npm run kb:history:build
```

## 检索命令

```bash
npm run kb:history:search -- 朱元璋
npm run kb:history:search -- 刘福通 --limit 5
npm run kb:history:search -- 郭子兴
```

## 当前知识库结构

- `sources.json`
  保存文献级元数据，适合先判断答案该优先查哪本书。
- `sections.jsonl`
  保存标准化章节记录，适合按卷、篇、附录等结构定位。
- `chunks.jsonl`
  保存面向检索的小片段，适合按人物、地名、事件直接搜正文。
- `heading-index.json`
  保存标题到章节的映射，适合直接跳到“卷一 本纪第一”这类结构化目标。

## 当前规模

- 文献数：4
- 章节数：399
- 检索分块数：3549

## 使用约定

后续在本仓库内回答这批历史资料相关问题时，优先使用 `generated/history-kb` 进行检索，再回到原始 `.txt` 或 `generated/mingshi/mingshi.json` 做上下文复核。
