import {
  APPEARANCE_ATTRIBUTES,
  LIFESTYLE_SCALE_KEYS,
  TRAIT_KEYS,
  type ChildrenPlan,
  type ConflictStyle,
  type Frequency,
  type LivingPlan,
  type MatchProfile,
  type RelationshipGoal,
  type VisualPreference,
} from '@udate/shared';
import { clamp01, pairTable, weightedMean } from './util.js';

/**
 * Ergebnis eines Bereichs (Säule) aus Sicht einer Person.
 * score: 0..1, null = zu wenig Daten für eine Aussage
 * confidence: 0..1, wie sicher die Aussage ist (abhängig von der Datenmenge)
 */
export interface PillarScore {
  score: number | null;
  confidence: number;
}

const UNKNOWN: PillarScore = { score: null, confidence: 0 };

// ================================================================ Optik

/**
 * Ab wie vielen Bewertungen eine gelernte Vorliebe halb sicher ist.
 * Mit 4 gilt: 1 Bewertung = 20 %, 4 = 50 %, 12 = 75 %, 36 = 90 %. Wenige Bewertungen zählen also wenig.
 */
export const EVIDENCE_HALF = 4;

export function preferenceConfidence(p: VisualPreference): number {
  if (p.source !== 'learned') return 1;
  return p.evidence / (p.evidence + EVIDENCE_HALF);
}

/**
 * Wie gut passt das (selbst angegebene) Aussehen von B zu den Vorlieben von A?
 * Pro Merkmal wird nur geschaut, ob A zu den Werten von B eine Vorliebe hat. Unsichere Vorlieben werden
 * Richtung neutral (0.5) gezogen. Merkmale ohne Daten zählen nicht.
 */
export function visualScore(a: MatchProfile, b: MatchProfile): PillarScore {
  const parts: { value: number; weight: number }[] = [];

  for (const attr of APPEARANCE_ATTRIBUTES) {
    const prefs = a.visualPreferences[attr];
    const values = b.appearance[attr];
    if (!prefs || !values?.length) continue;
    let wSum = 0;
    let cMax = 0;
    let n = 0;
    for (const v of values) {
      const p = prefs[v];
      if (!p) continue;
      const c = preferenceConfidence(p);
      wSum += p.weight * c;
      cMax = Math.max(cMax, c);
      n++;
    }
    if (n === 0) continue;
    parts.push({ value: clamp01((1 + wSum / n) / 2), weight: cMax });
  }

  if (a.preferredHeightCm && b.heightCm) {
    const { min, max } = a.preferredHeightCm;
    const off = b.heightCm < min ? min - b.heightCm : b.heightCm > max ? b.heightCm - max : 0;
    parts.push({ value: clamp01(1 - off / 15), weight: 1 });
  }

  if (parts.length === 0) return UNKNOWN;
  const score = weightedMean(parts)!;
  // Sicherheit: durchschnittliche Sicherheit der genutzten Merkmale, gedämpft wenn nur wenige Merkmale vergleichbar sind.
  const avgConf = parts.reduce((s, p) => s + p.weight, 0) / parts.length;
  const coverage = Math.min(1, parts.length / 4);
  return { score, confidence: clamp01(avgConf * (0.5 + 0.5 * coverage)) };
}

// ================================================================ Persönlichkeit

export const conflictFit = pairTable<ConflictStyle>(
  [
    ['talk_now', 'talk_now', 1],
    ['cool_down', 'cool_down', 1],
    ['talk_now', 'cool_down', 0.7],
    ['cool_down', 'avoid', 0.55],
    ['avoid', 'avoid', 0.6],
    ['talk_now', 'avoid', 0.35],
  ],
  0.5,
);

/**
 * Persönlichkeit aus Sicht von A:
 * - Wunsch: Hat B die Eigenschaften, die A wichtig sind? (stärkster Teil, darum gerichtet)
 * - Ähnlichkeit: Wie ähnlich beschreiben sich beide?
 * - Bedürfnisse: Nähe, Freiraum, Ausgehen, Struktur ähnlich?
 * - Streitkultur: Passen die Konfliktstile?
 */
export function personalityScore(a: MatchProfile, b: MatchProfile): PillarScore {
  let wish: number | null = null;
  {
    const parts: { value: number; weight: number }[] = [];
    for (const k of TRAIT_KEYS) {
      const imp = a.traitImportance[k];
      const has = b.traits[k];
      if (imp === undefined || imp <= 0 || has === undefined) continue;
      parts.push({ value: has, weight: imp });
    }
    wish = weightedMean(parts);
  }

  const simParts: number[] = [];
  for (const k of TRAIT_KEYS) {
    const x = a.traits[k];
    const y = b.traits[k];
    if (x !== undefined && y !== undefined) simParts.push(1 - Math.abs(x - y));
  }
  const similarity = simParts.length ? simParts.reduce((s, v) => s + v, 0) / simParts.length : null;

  const needParts: number[] = [];
  for (const k of Object.keys(a.needs) as (keyof typeof a.needs)[]) {
    const x = a.needs[k];
    const y = b.needs[k];
    if (x !== undefined && y !== undefined) needParts.push(1 - Math.abs(x - y));
  }
  const needs = needParts.length ? needParts.reduce((s, v) => s + v, 0) / needParts.length : null;

  const conflict = a.conflictStyle && b.conflictStyle ? conflictFit(a.conflictStyle, b.conflictStyle) : null;

  const score = weightedMean([
    { value: wish, weight: 0.45 },
    { value: similarity, weight: 0.25 },
    { value: needs, weight: 0.2 },
    { value: conflict, weight: 0.1 },
  ]);
  if (score === null) return UNKNOWN;
  const coverage = simParts.length / TRAIT_KEYS.length;
  const confidence = clamp01(0.3 * (wish !== null ? 1 : 0) + 0.4 * coverage + 0.2 * (needs !== null ? 1 : 0) + 0.1 * (conflict !== null ? 1 : 0));
  return { score, confidence };
}

// ================================================================ Beziehung & Lebensziele

export const goalFit = pairTable<RelationshipGoal>(
  [
    ['long_term', 'committed', 0.95],
    ['long_term', 'friendship_first', 0.6],
    ['committed', 'friendship_first', 0.55],
    ['casual', 'activity_partner', 0.6],
    ['friendship_first', 'activity_partner', 0.65],
    ['casual', 'friendship_first', 0.4],
    ['long_term', 'activity_partner', 0.3],
    ['committed', 'activity_partner', 0.3],
    ['long_term', 'casual', 0.1],
    ['committed', 'casual', 0.15],
  ],
  0.3,
);

export const childrenFit = pairTable<ChildrenPlan>(
  [
    ['wants', 'open', 0.75],
    ['wants', 'has_wants_more', 0.9],
    ['wants', 'does_not_want', 0],
    ['wants', 'has_no_more', 0.1],
    ['open', 'does_not_want', 0.55],
    ['open', 'has_wants_more', 0.7],
    ['open', 'has_no_more', 0.7],
    ['does_not_want', 'has_wants_more', 0.05],
    ['does_not_want', 'has_no_more', 0.6],
    ['has_wants_more', 'has_no_more', 0.3],
  ],
  0.5,
);

export const livingFit = pairTable<LivingPlan>(
  [
    ['move_in_soon', 'own_place', 0.3],
    ['move_in_soon', 'flexible', 0.8],
    ['own_place', 'flexible', 0.8],
  ],
  0.5,
);

/** Unter diesem Wert gilt ein Unterschied bei Beziehungsziel oder Kinderwunsch als grundlegend. */
export const FUNDAMENTAL_THRESHOLD = 0.2;

export type FundamentalField = 'relationshipGoal' | 'childrenPlan';

export interface RelationshipScore extends PillarScore {
  goals: number | null;
  children: number | null;
  living: number | null;
  /** Grundlegende Unterschiede, unabhängig davon, ob jemand flexibel ist. */
  fundamental: FundamentalField[];
}

export function bestGoalFit(a: RelationshipGoal[], b: RelationshipGoal[]): number | null {
  if (!a.length || !b.length) return null;
  let best = 0;
  for (const x of a) for (const y of b) best = Math.max(best, goalFit(x, y));
  return best;
}

/** Symmetrisch: beide Richtungen ergeben denselben Wert. Flexibilität wird erst beim gegenseitigen Ergebnis berücksichtigt. */
export function relationshipScore(a: MatchProfile, b: MatchProfile): RelationshipScore {
  const goals = bestGoalFit(a.relationshipGoals, b.relationshipGoals);
  const children = a.childrenPlan && b.childrenPlan ? childrenFit(a.childrenPlan, b.childrenPlan) : null;
  const living = a.livingPlan && b.livingPlan ? livingFit(a.livingPlan, b.livingPlan) : null;

  const fundamental: FundamentalField[] = [];
  if (goals !== null && goals <= FUNDAMENTAL_THRESHOLD) fundamental.push('relationshipGoal');
  if (children !== null && children <= FUNDAMENTAL_THRESHOLD) fundamental.push('childrenPlan');

  const score = weightedMean([
    { value: goals, weight: 0.5 },
    { value: children, weight: 0.3 },
    { value: living, weight: 0.2 },
  ]);
  const confidence = (goals !== null ? 0.5 : 0) + (children !== null ? 0.3 : 0) + (living !== null ? 0.2 : 0);
  return { score, confidence, goals, children, living, fundamental };
}

// ================================================================ Interessen & Lebensstil

export const habitFit = pairTable<Frequency>(
  [
    ['never', 'sometimes', 0.6],
    ['never', 'regularly', 0.2],
    ['sometimes', 'regularly', 0.7],
  ],
  0.5,
);

/** Kosinus-Überlappung: 3 gemeinsame von 5 und 5 Interessen = 0.6. Unterschiedlich lange Listen werden fair behandelt. */
export function interestOverlap(a: string[], b: string[]): { score: number | null; shared: string[] } {
  if (!a.length || !b.length) return { score: null, shared: [] };
  const set = new Set(b);
  const shared = [...new Set(a)].filter((x) => set.has(x));
  return { score: shared.length / Math.sqrt(new Set(a).size * set.size), shared };
}

export function lifestyleScore(a: MatchProfile, b: MatchProfile): PillarScore & { shared: string[] } {
  const { score: interests, shared } = interestOverlap(a.interests, b.interests);
  // Ein bisschen Gemeinsamkeit reicht schon für einen guten Wert: 0.5 Überlappung ≈ 0.85.
  const interestValue = interests === null ? null : clamp01(Math.sqrt(interests) * 1.2);

  const habits: number[] = [];
  if (a.smoking && b.smoking) habits.push(habitFit(a.smoking, b.smoking));
  if (a.drinking && b.drinking) habits.push(habitFit(a.drinking, b.drinking));
  const habitValue = habits.length ? habits.reduce((s, v) => s + v, 0) / habits.length : null;

  const scales: number[] = [];
  for (const k of LIFESTYLE_SCALE_KEYS) {
    const x = a.lifestyle[k];
    const y = b.lifestyle[k];
    if (x !== undefined && y !== undefined) scales.push(1 - Math.abs(x - y));
  }
  const scaleValue = scales.length ? scales.reduce((s, v) => s + v, 0) / scales.length : null;

  const score = weightedMean([
    { value: interestValue, weight: 0.5 },
    { value: habitValue, weight: 0.25 },
    { value: scaleValue, weight: 0.25 },
  ]);
  const confidence =
    (interestValue !== null ? 0.5 : 0) + (habitValue !== null ? 0.25 : 0) + (scales.length / LIFESTYLE_SCALE_KEYS.length) * 0.25;
  return { score, confidence, shared };
}
