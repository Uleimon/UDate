import type { FastifyPluginAsync } from 'fastify';

/** /health = Prozess lebt. /health/ready = Datenbank erreichbar (für Load Balancer / Deployment). */
export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', { config: { rateLimit: false } }, async () => ({ status: 'ok' }));

  app.get('/health/ready', { config: { rateLimit: false } }, async (_req, reply) => {
    try {
      await app.deps.db.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'ok' };
    } catch (err) {
      app.log.warn({ err }, 'Datenbank nicht erreichbar');
      return reply.status(503).send({ status: 'degraded', db: 'unreachable' });
    }
  });
};
