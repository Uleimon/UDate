import type { FastifyPluginAsync } from 'fastify';

/** Zeigt der App, ob KI-Funktionen verfügbar sind, damit sie ehrlich "noch nicht verfügbar" anzeigen kann. */
export const aiRoutes: FastifyPluginAsync = async (app) => {
  app.get('/ai/status', async () => {
    const { ai } = app.deps;
    return { available: ai.available, provider: ai.name, reason: ai.available ? null : ai.unavailableReason ?? null };
  });
};
