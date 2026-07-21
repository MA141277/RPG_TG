import { buildAiModDraftPrompt } from "./ai-mod-draft-prompts";

export type AiModDraftClientConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export function readAiModDraftClientConfigFromEnv(env: NodeJS.ProcessEnv): {
  config: AiModDraftClientConfig | null;
  missing: string[];
} {
  const apiKey = env.AI_MOD_DRAFT_API_KEY?.trim() ?? "";
  const baseUrl = env.AI_MOD_DRAFT_BASE_URL?.trim() ?? "";
  const model = env.AI_MOD_DRAFT_MODEL?.trim() ?? "";
  const missing: string[] = [];
  if (apiKey.length === 0) {
    missing.push("AI_MOD_DRAFT_API_KEY");
  }
  if (baseUrl.length === 0) {
    missing.push("AI_MOD_DRAFT_BASE_URL");
  }
  if (model.length === 0) {
    missing.push("AI_MOD_DRAFT_MODEL");
  }

  return {
    config:
      missing.length === 0
        ? {
            apiKey,
            baseUrl,
            model,
          }
        : null,
    missing,
  };
}

export async function generateAiModDraftFromTopic(input: {
  topic: string;
  config: AiModDraftClientConfig;
}): Promise<unknown> {
  const endpoint = new URL(
    "v1/chat/completions",
    input.config.baseUrl.endsWith("/")
      ? input.config.baseUrl
      : `${input.config.baseUrl}/`
  );
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: input.config.model,
      messages: [
        {
          role: "system",
          content:
            "You are a deterministic game authoring assistant. Output JSON only.",
        },
        {
          role: "user",
          content: buildAiModDraftPrompt(input.topic),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI Mod Draft request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("AI Mod Draft response did not include JSON content.");
  }

  return JSON.parse(stripJsonFence(content));
}

function stripJsonFence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
