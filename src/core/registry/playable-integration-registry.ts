import type {
  PlayableId,
  PlayableIntegrationDefinition,
  PlayableIntegrationId,
} from "../contracts/playable-runtime";

export type PlayableIntegrationRegistry = {
  register(integration: PlayableIntegrationDefinition): void;
  get(integrationId: PlayableIntegrationId): PlayableIntegrationDefinition | null;
  findByPlayableId(playableId: PlayableId): PlayableIntegrationDefinition[];
  entries(): PlayableIntegrationDefinition[];
};

export function createPlayableIntegrationRegistry(
  integrations: PlayableIntegrationDefinition[] = []
): PlayableIntegrationRegistry {
  const integrationsById = new Map<
    PlayableIntegrationId,
    PlayableIntegrationDefinition
  >();
  const integrationsByPlayableId = new Map<
    PlayableId,
    PlayableIntegrationDefinition[]
  >();

  const register = (integration: PlayableIntegrationDefinition): void => {
    integrationsById.set(integration.integrationId, integration);
    const existing = integrationsByPlayableId.get(integration.playableId) ?? [];
    integrationsByPlayableId.set(integration.playableId, [
      ...existing.filter(
        (candidate) => candidate.integrationId !== integration.integrationId
      ),
      integration,
    ]);
  };

  integrations.forEach(register);

  return {
    register,
    get(integrationId) {
      return integrationsById.get(integrationId) ?? null;
    },
    findByPlayableId(playableId) {
      return integrationsByPlayableId.get(playableId) ?? [];
    },
    entries() {
      return Array.from(integrationsById.values());
    },
  };
}
