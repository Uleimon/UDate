import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DisabledAiProvider } from './ai/provider.js';
import { buildApp } from './app.js';
import { loadConfig } from './config.js';
import { createDb } from './lib/db.js';

const env = {
  NODE_ENV: 'test',
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://udate:udate_dev@localhost:5432/udate',
  SESSION_SECRET: 'x'.repeat(40),
} as NodeJS.ProcessEnv;

describe('Konfiguration', () => {
  it('startet nicht ohne Session-Geheimnis', () => {
    expect(() => loadConfig({ ...env, SESSION_SECRET: 'kurz' })).toThrow(/SESSION_SECRET/);
  });
  it('verlangt in Produktion ein echtes Geheimnis', () => {
    expect(() =>
      loadConfig({ ...env, NODE_ENV: 'production', SESSION_SECRET: 'bitte-ersetzen-mindestens-32-zeichen-langes-geheimnis' }),
    ).toThrow(/echtes Geheimnis/);
  });
  it('verlangt einen Schlüssel, wenn ein KI-Anbieter gewählt ist', () => {
    expect(() => loadConfig({ ...env, AI_PROVIDER: 'anthropic' })).toThrow(/ANTHROPIC_API_KEY/);
  });
});

describe('API', () => {
  const config = loadConfig(env);
  const db = createDb(config.DATABASE_URL);
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ config, db, ai: new DisabledAiProvider() });
  });
  afterAll(async () => {
    await app.close();
    await db.$disconnect();
  });

  it('GET /health', async () => {
    const r = await app.inject('/health');
    expect(r.statusCode).toBe(200);
    expect(r.json()).toEqual({ status: 'ok' });
  });

  it('GET /health/ready prüft die Datenbank', async () => {
    const r = await app.inject('/health/ready');
    expect(r.statusCode).toBe(200);
    expect(r.json()).toEqual({ status: 'ok', db: 'ok' });
  });

  it('setzt Sicherheits-Header', async () => {
    const r = await app.inject('/health');
    expect(r.headers['x-content-type-options']).toBe('nosniff');
    expect(r.headers['strict-transport-security']).toBeDefined();
  });

  it('sagt ehrlich, dass keine KI angebunden ist', async () => {
    const r = await app.inject('/v1/ai/status');
    expect(r.json()).toMatchObject({ available: false, provider: 'none' });
    await expect(new DisabledAiProvider().conversationStarters()).rejects.toThrow(/noch nicht verfügbar/);
  });

  it('antwortet auf unbekannte Pfade mit 404 ohne Details', async () => {
    const r = await app.inject('/gibt-es-nicht');
    expect(r.statusCode).toBe(404);
    expect(r.json().error).toBe('not_found');
  });
});
