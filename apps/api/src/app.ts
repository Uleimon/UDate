import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import type { AiProvider } from './ai/provider.js';
import { AiUnavailableError } from './ai/provider.js';
import type { Config } from './config.js';
import type { Db } from './lib/db.js';
import { AppError } from './lib/errors.js';
import { aiRoutes } from './routes/ai.js';
import { healthRoutes } from './routes/health.js';

export interface AppDeps {
  config: Config;
  db: Db;
  ai: AiProvider;
}

declare module 'fastify' {
  interface FastifyInstance {
    deps: AppDeps;
  }
}

export async function buildApp(deps: AppDeps): Promise<FastifyInstance> {
  const { config } = deps;
  const app = Fastify({
    logger:
      config.NODE_ENV === 'test'
        ? false
        : {
            level: config.NODE_ENV === 'production' ? 'info' : 'debug',
            // Nie Passwörter, Cookies oder Tokens loggen.
            redact: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.token'],
          },
    trustProxy: config.NODE_ENV === 'production',
    bodyLimit: 1024 * 1024, // 1 MB JSON. Bilder laufen später über direkte, signierte Uploads.
  });
  app.decorate('deps', deps);

  await app.register(helmet, { contentSecurityPolicy: false }); // reine JSON-API, CSP macht das Web-Frontend
  await app.register(cors, { origin: config.CORS_ORIGINS, credentials: true });
  await app.register(rateLimit, { max: 300, timeWindow: '1 minute' });

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof AppError) return reply.status(err.status).send({ error: err.code, message: err.message });
    if (err instanceof ZodError) {
      return reply.status(400).send({ error: 'validation', message: 'Ungültige Eingabe', issues: err.issues });
    }
    if (err instanceof AiUnavailableError) return reply.status(503).send({ error: err.code, message: err.message });
    const status = (err as { statusCode?: number }).statusCode;
    if (status && status >= 400 && status < 500) {
      return reply.status(status).send({ error: 'request', message: (err as Error).message });
    }
    req.log.error({ err }, 'Unbehandelter Fehler');
    return reply.status(500).send({ error: 'internal', message: 'Interner Fehler' });
  });

  app.setNotFoundHandler((_req, reply) => reply.status(404).send({ error: 'not_found', message: 'Unbekannter Pfad' }));

  await app.register(healthRoutes);
  await app.register(aiRoutes, { prefix: '/v1' });
  return app;
}
