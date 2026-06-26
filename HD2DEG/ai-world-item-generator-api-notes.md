# AI世界物品生成 - 豆包生图接口记录

> 用于项目内临时记录。后续建议把密钥移到本地环境变量或后端代理，不直接写在前端代码中。

## 接口信息

- URL: `https://ark.cn-beijing.volces.com/api/v3/images/generations`
- Method: `POST`
- Content-Type: `application/json`
- Authorization: `Bearer <ARK_API_KEY>`

## 当前使用信息（按你提供内容记录）

- 模型: `doubao-seedream-5-0-260128`
- Key（原始记录）: `ark-1b0dbad2-561e-447a-b109-10aab9acd4c0-04673`

## 请求体格式

```json
{
  "model": "doubao-seedream-5-0-260128",
  "prompt": "星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，抢视觉冲击力，电影大片，末日既视感，动感，对比色，oc渲染，光线追踪，动态模糊，景深，超现实主义，深蓝，画面通过细腻的丰富的色彩层次塑造主体与场景，质感真实，暗黑风背景的光影效果营造出氛围，整体兼具艺术幻想感，夸张的广角透视效果，耀光，反射，极致的光影，强引力，吞噬",
  "sequential_image_generation": "disabled",
  "response_format": "url",
  "size": "2K",
  "stream": false,
  "watermark": true
}
```

## cURL 示例

```bash
curl -X POST "https://ark.cn-beijing.volces.com/api/v3/images/generations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ark-1b0dbad2-561e-447a-b109-10aab9acd4c0-04673" \
  -d '{
    "model": "doubao-seedream-5-0-260128",
    "prompt": "星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，抢视觉冲击力，电影大片，末日既视感，动感，对比色，oc渲染，光线追踪，动态模糊，景深，超现实主义，深蓝，画面通过细腻的丰富的色彩层次塑造主体与场景，质感真实，暗黑风背景的光影效果营造出氛围，整体兼具艺术幻想感，夸张的广角透视效果，耀光，反射，极致的光影，强引力，吞噬",
    "sequential_image_generation": "disabled",
    "response_format": "url",
    "size": "2K",
    "stream": false,
    "watermark": true
  }'
```

## LLM（Demo）配置

- Base URL: `https://epone.ggb.today/v1`
- Model: `gpt-5.4-mini`
- API Key（原始记录）: `sk-CNzjubL7xVCdLzw3VF9lPrBMqUqjTwhon4CRy5qDiJOeAm2f`

> 建议在实际代码里通过环境变量注入，例如 `LLM_BASE_URL`、`LLM_MODEL`、`LLM_API_KEY`，避免明文出现在前端仓库中。
