const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("NPC AI dialogue provider bootstrap derives an OpenAI-compatible config from env-style values", () => {
  const {
    buildNpcAiDialogueExternalConfigFromEnv,
    primeNpcAiDialogueConfigFromEnv,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-provider-bootstrap.js");

  const env = {
    mode: "openai-compatible",
    baseUrl: "https://epone.ggb.today/",
    model: "deepseek-v3.1",
    fallbackModels: " deepseek-v3 , gpt-4o-mini ",
    authToken: "secret-token",
    stream: "false",
    temperature: "0.4",
  };

  assert.deepEqual(buildNpcAiDialogueExternalConfigFromEnv(env), {
    mode: "openai-compatible",
    baseUrl: "https://epone.ggb.today/",
    model: "deepseek-v3.1",
    fallbackModels: ["deepseek-v3", "gpt-4o-mini"],
    authToken: "secret-token",
    stream: false,
    temperature: 0.4,
  });

  const globalObject = {
    localStorage: {
      getItem() {
        return null;
      },
    },
  };

  primeNpcAiDialogueConfigFromEnv({
    env,
    globalObject,
  });

  assert.deepEqual(globalObject.__RPG_TG_NPC_AI_CONFIG__, {
    mode: "openai-compatible",
    baseUrl: "https://epone.ggb.today/",
    model: "deepseek-v3.1",
    fallbackModels: ["deepseek-v3", "gpt-4o-mini"],
    authToken: "secret-token",
    stream: false,
    temperature: 0.4,
  });
});

test("NPC AI dialogue provider bootstrap preserves an existing manual config seam", () => {
  const {
    primeNpcAiDialogueConfigFromEnv,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-provider-bootstrap.js");

  const globalObject = {
    __RPG_TG_NPC_AI_CONFIG__: {
      mode: "structured-sse",
      streamUrl: "https://example.com/stream",
    },
    localStorage: {
      getItem() {
        return null;
      },
    },
  };

  primeNpcAiDialogueConfigFromEnv({
    env: {
      mode: "openai-compatible",
      baseUrl: "https://epone.ggb.today/",
      model: "deepseek-v3.1",
      authToken: "secret-token",
    },
    globalObject,
  });

  assert.deepEqual(globalObject.__RPG_TG_NPC_AI_CONFIG__, {
    mode: "structured-sse",
    streamUrl: "https://example.com/stream",
  });
});

test("main shell primes NPC AI dialogue provider config from local Vite env values", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /primeNpcAiDialogueConfigFromEnv/u);
  assert.match(source, /VITE_NPC_AI_PROVIDER_MODE/u);
  assert.match(source, /VITE_NPC_AI_BASE_URL/u);
  assert.match(source, /VITE_NPC_AI_MODEL/u);
  assert.match(source, /VITE_NPC_AI_FALLBACK_MODELS/u);
  assert.match(source, /VITE_NPC_AI_API_KEY/u);
});
