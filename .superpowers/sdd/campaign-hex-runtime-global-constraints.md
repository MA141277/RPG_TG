# Global Constraints

- Runtime campaign hex size stays fixed at `hexTerrainScale = 138` and `hexMapAspect = 1.1285`.
- Editor `scale`, `step`, `offsetX`, `offsetY`, and `sourceCrop` are production-only sampling controls and must not change gameplay hex size.
- Every map3 editor/generated cell maps to exactly one runtime `CampaignHexGridCell`; no projection or merge into the old `8509`-cell grid.
- Runtime map extent must come from `campaignHexGrid.bounds` or `hexPointBounds`, not from changing `hexTerrainScale`.
- When `campaignHexGridUrl` is provided, runtime land/water, terrain, environment, height, and passability come from `campaignHexGrid.cells`.
- Legacy material-image semantic sampling is fallback-only for maps without a runtime grid.
- Shader visual layers may stylize terrain but must not redefine land/water or terrain semantics.
- Camera must start near the player/current node and must not fit the full map to screen by default.
- Do not make all cities enterable in this child.
- Do not redesign city internal content or scripts in this child.
