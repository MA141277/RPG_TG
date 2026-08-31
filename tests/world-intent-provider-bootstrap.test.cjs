const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("world-intent provider bootstrap derives an OpenAI-compatible config from env-style values", () => {
  const {
    buildWorldIntentExternalConfigFromEnv,
    primeWorldIntentConfigFromEnv,
  } = require("../.test-dist/application/world-intent/world-intent-provider-bootstrap.js");

  const env = {
    mode: "openai-compatible",
    baseUrl: "https://epone.ggb.today/",
    model: "deepseek-v3.1",
    fallbackModels: " deepseek-v3 , gpt-4o-mini ",
    authToken: "secret-token",
    temperature: "0.4",
  };

  assert.deepEqual(buildWorldIntentExternalConfigFromEnv(env), {
    mode: "openai-compatible",
    baseUrl: "https://epone.ggb.today/",
    model: "deepseek-v3.1",
    fallbackModels: ["deepseek-v3", "gpt-4o-mini"],
    authToken: "secret-token",
    temperature: 0.4,
  });

  const globalObject = {
    localStorage: {
      getItem() {
        return null;
      },
    },
  };

  primeWorldIntentConfigFromEnv({
    env,
    globalObject,
  });

  assert.deepEqual(globalObject.__RPG_TG_WORLD_INTENT_CONFIG__, {
    mode: "openai-compatible",
    baseUrl: "https://epone.ggb.today/",
    model: "deepseek-v3.1",
    fallbackModels: ["deepseek-v3", "gpt-4o-mini"],
    authToken: "secret-token",
    temperature: 0.4,
  });
});

test("main shell primes and instantiates the world-intent provider from local Vite env values", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /primeWorldIntentConfigFromEnv/u);
  assert.match(source, /createConfiguredWorldIntentProvider/u);
  assert.match(source, /VITE_WORLD_INTENT_PROVIDER_MODE/u);
  assert.match(source, /VITE_WORLD_INTENT_BASE_URL/u);
  assert.match(source, /VITE_WORLD_INTENT_MODEL/u);
  assert.match(source, /VITE_WORLD_INTENT_FALLBACK_MODELS/u);
  assert.match(source, /VITE_WORLD_INTENT_API_KEY/u);
  assert.match(source, /VITE_NPC_AI_BASE_URL/u);
  assert.match(source, /VITE_NPC_AI_MODEL/u);
  assert.match(source, /VITE_NPC_AI_API_KEY/u);
});
