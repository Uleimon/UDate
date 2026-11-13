import { createAiProvider } from './ai/provider.js';
import { buildApp } from './app.js';
import { loadConfig } from './config.js';
import { createDb } from './lib/db.js';

const config = loadConfig();
const db = createDb(config.DATABASE_URL);
const app = await buildApp({ config, db, ai: createAiProvider(config.AI_PROVIDER) });

const shutdown = async (signal: string) => {
  app.log.info({ signal }, 'Fahre herunter');
  await app.close();
  await db.$disconnect();
  process.exit(0);
};
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

await app.listen({ port: config.PORT, host: config.HOST });
