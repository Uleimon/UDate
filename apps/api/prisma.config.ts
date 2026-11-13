import { existsSync } from 'node:fs';
import { defineConfig, env } from 'prisma/config';

// DATABASE_URL kommt aus der Umgebung oder aus apps/api/.env (Vorlage: .env.example im Hauptordner).
if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
