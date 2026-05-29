# History KB

- Source directory: `D:\RPG_TG\generated\mingshi`
- Output directory: `D:\RPG_TG\generated\history-kb`
- Sources: 4
- Sections: 399
- Chunks: 3549

## Files

- `manifest.json`: corpus overview and source stats
- `sources.json`: source-level metadata
- `sections.jsonl`: normalized section records
- `chunks.jsonl`: retrieval chunks
- `heading-index.json`: heading-to-section lookup

## Search

```bash
node tools/search-history-kb.mjs 朱元璋
node tools/search-history-kb.mjs 小明王 --limit 5
```

## Sources

- 草木子: 25 sections, 60 chunks
- 国初群雄事略: 16 sections, 159 chunks
- 南村辍耕录: 25 sections, 50 chunks
- 明史: 333 sections, 3280 chunks
