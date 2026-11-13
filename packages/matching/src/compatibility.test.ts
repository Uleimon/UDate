import { describe, expect, it } from 'vitest';
import { DEFAULT_PILLAR_WEIGHTS, matchProfileSchema, type MatchProfile } from '@udate/shared';
import {
  compatibility,
  directionalScore,
  FUNDAMENTAL_CAP,
  hardFilter,
  harmonic,
  percent,
  preferenceConfidence,
  rankCandidates,
  viewFor,
  visualScore,
} from './index.js';

const BERLIN = { lat: 52.52, lng: 13.405 };
const POTSDAM = { lat: 52.39, lng: 13.065 };
const MUNICH = { lat: 48.137, lng: 11.575 };
const HAMBURG = { lat: 53.551, lng: 9.993 };

/** Testprofil mit vollständigen, harmlosen Standardwerten. Nur für Tests. */
function profile(id: string, over: Partial<MatchProfile> = {}): MatchProfile {
  const base: MatchProfile = {
    id,
    age: 30,
    gender: 'woman',
    seeking: ['man'],
    ageMin: 25,
    ageMax: 40,
    location: BERLIN,
    radiusKm: 50,
    relationshipGoals: ['long_term'],
    childrenPlan: 'open',
    livingPlan: 'flexible',
    smoking: 'never',
    drinking: 'sometimes',
    lifestyle: { careerFocus: 0.5, travelWish: 0.7, activityLevel: 0.6 },
    dealbreakers: {},
    flexibleOn: [],
    traits: { humor: 0.8, honesty: 0.9, empathy: 0.7, patience: 0.5, openness: 0.6 },
    traitImportance: { honesty: 0.9, humor: 0.7 },
    needs: { closeness: 0.6, space: 0.5, socialEnergy: 0.5 },
    conflictStyle: 'talk_now',
    interests: ['gaming', 'travel', 'cooking', 'nature'],
    appearance: { hairColor: ['brown'], clothingStyle: ['casual'] },
    visualPreferences: {},
    heightCm: null,
    preferredHeightCm: null,
    weights: { ...DEFAULT_PILLAR_WEIGHTS },
    blocked: [],
  };
  // Jedes Testprofil muss auch das echte Schema erfüllen.
  return matchProfileSchema.parse({ ...base, ...over });
}

const anna = (o: Partial<MatchProfile> = {}) => profile('anna', o);
const ben = (o: Partial<MatchProfile> = {}) => profile('ben', { gender: 'man', seeking: ['woman'], age: 32, ...o });

describe('harte Filter', () => {
  it('lässt ein passendes Paar durch und rundet die Entfernung', () => {
    const f = hardFilter(anna(), ben({ location: POTSDAM }));
    expect(f.ok).toBe(true);
    expect(f.distanceKm).toBeGreaterThan(20);
    expect(f.distanceKm).toBeLessThan(35);
  });

  it('prüft die Suche in beide Richtungen', () => {
    expect(hardFilter(anna(), ben({ seeking: ['man'] })).ok).toBe(false);
    expect(hardFilter(anna({ seeking: ['woman'] }), ben()).ok).toBe(false);
  });

  it('prüft Altersbereich und Radius beider Personen', () => {
    expect(hardFilter(anna({ ageMax: 31 }), ben()).ok).toBe(false);
    expect(hardFilter(anna(), ben({ ageMin: 31 })).ok).toBe(false);
    expect(hardFilter(anna(), ben({ location: MUNICH })).ok).toBe(false);
    expect(hardFilter(anna({ radiusKm: 300 }), ben({ location: HAMBURG, radiusKm: 300 })).ok).toBe(true);
  });

  it('greift bei Blockieren, egal wer blockiert hat', () => {
    expect(hardFilter(anna({ blocked: ['ben'] }), ben()).ok).toBe(false);
    expect(hardFilter(anna(), ben({ blocked: ['anna'] })).ok).toBe(false);
  });

  it('greift bei Ausschlusskriterien', () => {
    const f = hardFilter(anna({ dealbreakers: { smoking: ['regularly'] } }), ben({ smoking: 'regularly' }));
    expect(f.ok).toBe(false);
    expect(f.reasons).toContainEqual({ side: 'a', reason: 'dealbreaker', detail: 'smoking' });
  });

  it('schließt beim Beziehungsziel nur aus, wenn alle Ziele des Gegenübers ausgeschlossen sind', () => {
    const db = { relationshipGoal: ['casual' as const] };
    expect(hardFilter(anna({ dealbreakers: db }), ben({ relationshipGoals: ['casual'] })).ok).toBe(false);
    expect(hardFilter(anna({ dealbreakers: db }), ben({ relationshipGoals: ['casual', 'friendship_first'] })).ok).toBe(true);
  });

  it('schlägt ohne Standort niemanden vor', () => {
    expect(hardFilter(anna({ location: null }), ben()).ok).toBe(false);
  });
});

describe('Attraktivitäts-Kompass im Matching', () => {
  it('weiß nichts, wenn keine Vorlieben da sind', () => {
    expect(visualScore(anna(), ben())).toEqual({ score: null, confidence: 0 });
  });

  it('wenige Bewertungen sind unsicher und bleiben nah an neutral', () => {
    const few = anna({ visualPreferences: { hairColor: { brown: { weight: 1, evidence: 1, source: 'learned' } } } });
    const many = anna({ visualPreferences: { hairColor: { brown: { weight: 1, evidence: 40, source: 'learned' } } } });
    const s1 = visualScore(few, ben())!;
    const s2 = visualScore(many, ben())!;
    expect(s1.score!).toBeLessThan(0.65);
    expect(s2.score!).toBeGreaterThan(0.9);
    expect(s1.confidence).toBeLessThan(s2.confidence);
  });

  it('bestätigte Vorlieben gelten als sicher', () => {
    expect(preferenceConfidence({ weight: 1, evidence: 0, source: 'confirmed' })).toBe(1);
    expect(preferenceConfidence({ weight: 1, evidence: 4, source: 'learned' })).toBe(0.5);
  });

  it('negative Vorlieben senken den Wert', () => {
    const a = anna({ visualPreferences: { clothingStyle: { casual: { weight: -1, evidence: 0, source: 'manual' } } } });
    expect(visualScore(a, ben())!.score).toBe(0);
  });

  it('berücksichtigt die gewünschte Körpergröße weich', () => {
    const a = anna({ preferredHeightCm: { min: 175, max: 190 } });
    expect(visualScore(a, ben({ heightCm: 180 }))!.score).toBe(1);
    expect(visualScore(a, ben({ heightCm: 168 }))!.score).toBeCloseTo(1 - 7 / 15);
  });
});

describe('gegenseitige Kompatibilität', () => {
  it('ist für ähnliche Profile hoch und erklärt warum', () => {
    const c = compatibility(anna(), ben());
    expect(c.eligible).toBe(true);
    expect(c.mutual!).toBeGreaterThan(0.75);
    const texts = c.reasons.map((r) => r.text).join(' ');
    expect(texts).toContain('Gaming');
    expect(texts).toContain('Ehrlichkeit');
    expect(texts).toContain('Langfristige Beziehung');
  });

  it('nutzt das harmonische Mittel: einseitiges Interesse zieht stark runter', () => {
    expect(harmonic(0.92, 0.87)).toBeCloseTo(0.894, 2);
    expect(harmonic(0.9, 0.3)).toBeCloseTo(0.45, 5);
  });

  it('Persönlichkeit ist gerichtet: was A wichtig ist, zählt für A', () => {
    const a = anna({ traitImportance: { patience: 1 } });
    const b = ben({ traits: { patience: 0.1, humor: 0.8, honesty: 0.9 } });
    const ab = directionalScore(a, b).pillars.personality.score!;
    const ba = directionalScore(b, a).pillars.personality.score!;
    expect(ab).toBeLessThan(ba);
  });

  it('deckelt bei grundlegend verschiedenen Beziehungszielen, auch wenn alles andere passt', () => {
    const c = compatibility(anna({ relationshipGoals: ['long_term'] }), ben({ relationshipGoals: ['casual'] }));
    expect(c.eligible).toBe(true); // Unterschied ist kein Ausschluss ...
    expect(c.conflicts).toEqual(['relationshipGoal']);
    expect(c.mutual!).toBeLessThanOrEqual(FUNDAMENTAL_CAP); // ... aber kein hohes Match
    expect(c.differences.map((d) => d.code)).toContain('goal_differs');
  });

  it('deckelt bei Kinderwunsch gegen kein Kinderwunsch', () => {
    const c = compatibility(anna({ childrenPlan: 'wants' }), ben({ childrenPlan: 'does_not_want' }));
    expect(c.conflicts).toEqual(['childrenPlan']);
    expect(c.mutual!).toBeLessThanOrEqual(FUNDAMENTAL_CAP);
  });

  it('hebt den Deckel nur auf, wenn BEIDE flexibel sind', () => {
    const one = compatibility(anna({ childrenPlan: 'wants', flexibleOn: ['childrenPlan'] }), ben({ childrenPlan: 'does_not_want' }));
    expect(one.conflicts).toEqual(['childrenPlan']);
    const both = compatibility(
      anna({ childrenPlan: 'wants', flexibleOn: ['childrenPlan'] }),
      ben({ childrenPlan: 'does_not_want', flexibleOn: ['childrenPlan'] }),
    );
    expect(both.conflicts).toEqual([]);
    expect(both.mutual!).toBeGreaterThan(FUNDAMENTAL_CAP);
  });

  it('macht Unterschiede bei Freiraum sichtbar, ohne zu sagen wer', () => {
    const c = compatibility(anna({ needs: { space: 0.1 } }), ben({ needs: { space: 0.9 } }));
    const d = c.differences.find((x) => x.code === 'space_differs');
    expect(d?.text).toBe('Eine Person braucht mehr persönlichen Freiraum.');
  });

  it('lässt Bereiche ohne Daten heraus statt sie als 0 zu zählen', () => {
    const bare = { traits: {}, traitImportance: {}, needs: {}, conflictStyle: null };
    const c = compatibility(anna(bare), ben(bare));
    expect(c.pillars.personality).toBeNull();
    expect(c.mutual).not.toBeNull();
    expect(c.confidence).toBeLessThan(0.7);
  });

  it('respektiert eine eigene Gewichtung', () => {
    const lovesVisual = { visualPreferences: { hairColor: { brown: { weight: 1, evidence: 0, source: 'confirmed' as const } } } };
    const visOnly = { ...lovesVisual, weights: { visual: 1, personality: 0, relationship: 0, lifestyle: 0 } };
    expect(directionalScore(anna(visOnly), ben()).total).toBe(1);
  });
});

describe('Anzeige und Datenschutz', () => {
  it('zeigt Sätze über die eigene Optik-Vorliebe nur der Person selbst', () => {
    const prefs = { hairColor: { brown: { weight: 1, evidence: 0, source: 'confirmed' as const } } };
    const c = compatibility(anna({ visualPreferences: prefs }), ben());
    const forAnna = viewFor(c, 'a');
    const forBen = viewFor(c, 'b');
    expect(forAnna.reasons.some((r) => r.includes('Attraktivitäts-Kompass'))).toBe(true);
    expect(forBen.reasons.some((r) => r.includes('Attraktivitäts-Kompass'))).toBe(false);
  });

  it('gibt keine gerichteten Werte heraus und hat immer den Hinweis dabei', () => {
    const v = viewFor(compatibility(anna(), ben()), 'a');
    expect(Object.keys(v)).not.toContain('aToB');
    expect(Object.keys(v)).not.toContain('ownViewPercent');
    expect(v.disclaimer).toMatch(/Orientierungshilfe/);
    expect(v.mutualPercent).toBe(percent(compatibility(anna(), ben()).mutual));
  });
});

describe('Ranking für Entdecken', () => {
  it('filtert raus, sortiert nach gegenseitigem Wert und stellt Grundkonflikte nach hinten', () => {
    const viewer = anna();
    const ranked = rankCandidates(viewer, [
      profile('far', { gender: 'man', seeking: ['woman'], location: MUNICH }),
      profile('casual', { gender: 'man', seeking: ['woman'], relationshipGoals: ['casual'] }),
      profile('good', { gender: 'man', seeking: ['woman'] }),
      profile('woman', { gender: 'woman', seeking: ['woman'] }),
      viewer,
    ]);
    expect(ranked.map((r) => r.id)).toEqual(['good', 'casual']);
  });
});
