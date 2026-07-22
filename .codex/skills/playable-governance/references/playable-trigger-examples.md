# Playable Trigger Examples

## Direct Playable Requests

- `新增一个小游戏`
- `加一个新的 playable`
- `做一个新的 QTE`
- `加一个新的 story-battle`
- `改一下现有小游戏`
- `调整 city-begging 的玩法`
- `修改 grain-accounting 的结算`
- `重做 medicine-compounding 的流程`

## House-Hosted Playable Requests

- `给粮铺加一个新的小游戏`
- `在茶馆里接一个辩论小游戏`
- `把寺庙里的这个玩法改成 QTE`
- `让 keep-house 承载一个新的 playable`
- `修改某个 house 里的小游戏入口`

## Runtime Or Integration Requests

- `把这个小游戏接到 playable runtime`
- `调整 playable integration`
- `改一下小游戏的 owner handoff`
- `改小游戏返回 house 的方式`
- `把这个玩法从 house 私有逻辑迁到 shared playable`
- `统一小游戏的启动和回流`

## Indirect Or Ambiguous Requests

- `这个玩法机制想共用，不想继续写在 house 里`
- `把这个交互流程抽成共享机制`
- `这个 QTE 以后别只给一个 house 用`
- `这个战斗小玩法要走统一 runtime`
- `这个短流程更像 playable，不像普通 house action`
- `想把这段小游戏逻辑做成可复用机制`

## Governance Or Review Requests

- `这个小游戏改动会不会影响项目`
- `新增 playable 需要改哪些层`
- `这个 QTE 算局部改动还是共享契约改动`
- `小游戏接入规范是什么`
- `playable 相关规则是什么`
- `这个玩法应该新建 playable 还是复用现有 integration`

## Interpretation Rule

- If the request mentions `minigame`, `小游戏`, `QTE`, `story-battle`, `playable`, or a house-hosted short interaction that sounds reusable, trigger this skill.
- If the request sounds like shared mechanism extraction from a house-hosted interaction, trigger this skill before deciding whether the work remains house-local.
