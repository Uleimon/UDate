import { z } from 'zod';

/**
 * Alle Einstellungen kommen aus Umgebungsvariablen (Vorlage: .env.example).
 * Fehlt etwas oder ist es unsicher, startet der Server nicht.
 */
const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    HOST: z.string().default('0.0.0.0'),
    DATABASE_URL: z.string().url(),
    CORS_ORIGINS: z
      .string()
      .default('http://localhost:3000')
      .transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)),
    SESSION_SECRET: z.string().min(32, 'SESSION_SECRET muss mindestens 32 Zeichen lang sein'),
    AI_PROVIDER: z.enum(['none', 'anthropic']).default('none'),
    ANTHROPIC_API_KEY: z.string().optional(),
  })
  .superRefine((c, ctx) => {
    if (c.NODE_ENV === 'production' && /bitte-ersetzen|dev/i.test(c.SESSION_SECRET)) {
      ctx.addIssue({ code: 'custom', path: ['SESSION_SECRET'], message: 'In Produktion ein echtes Geheimnis setzen' });
    }
    if (c.AI_PROVIDER === 'anthropic' && !c.ANTHROPIC_API_KEY) {
      ctx.addIssue({ code: 'custom', path: ['ANTHROPIC_API_KEY'], message: 'Für AI_PROVIDER=anthropic nötig' });
    }
  });

export type Config = z.infer<typeof schema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const r = schema.safeParse(env);
  if (!r.success) {
    const lines = r.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Ungültige Konfiguration:\n${lines}`);
  }
  return r.data;
}
