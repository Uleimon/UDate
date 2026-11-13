import { describe, expect, it } from 'vitest';
import { appearanceSchema, dealbreakersSchema, matchProfileSchema } from './index.js';

describe('Schemas', () => {
  it('lässt nur Werte zu, die es im Katalog gibt', () => {
    expect(appearanceSchema.safeParse({ hairColor: ['brown'] }).success).toBe(true);
    expect(appearanceSchema.safeParse({ hairColor: ['lila-kariert'] }).success).toBe(false);
    expect(appearanceSchema.safeParse({ ethnicity: ['x'] }).success).toBe(false);
  });

  it('lehnt unbekannte Ausschlusskriterien ab', () => {
    expect(dealbreakersSchema.safeParse({ smoking: ['regularly'] }).success).toBe(true);
    expect(dealbreakersSchema.safeParse({ religion: ['x'] }).success).toBe(false);
  });

  it('lässt keine Minderjährigen ins Matching', () => {
    const r = matchProfileSchema.shape.age.safeParse(17);
    expect(r.success).toBe(false);
  });
});
