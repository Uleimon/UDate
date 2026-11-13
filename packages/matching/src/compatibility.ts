import {
  INTERESTS,
  RELATIONSHIP_GOALS,
  TRAITS,
  type InterestKey,
  type MatchProfile,
  type PillarWeights,
  type RelationshipGoal,
  type TraitKey,
} from '@udate/shared';
import { hardFilter, type FilterResult } from './filters.js';
import {
  conflictFit,
  lifestyleScore,
  personalityScore,
  relationshipScore,
  visualScore,
  type FundamentalField,
  type PillarScore,
} from './pillars.js';
import { clamp01, harmonic } from './util.js';

export type Pillar = keyof PillarWeights;
export const PILLARS: Pillar[] = ['visual', 'personality', 'relationship', 'lifestyle'];

/** Hinweis, der bei jeder Prozentzahl in der App stehen muss. */
export const SCORE_DISCLAIMER =
  'Die Prozentzahlen sind eine Orientierungshilfe auf Basis eurer eigenen Angaben, keine wissenschaftlich geprüfte Erfolgswahrscheinlichkeit.';

/** Höchstwert, wenn es einen grundlegenden Unterschied gibt, bei dem nicht beide flexibel sind. */
export const FUNDAMENTAL_CAP = 0.45;

export interface DirectionalScore {
  /** 0..1, null wenn in keinem Bereich genug Daten da sind */
  total: number | null;
  confidence: number;
  pillars: Record<Pillar, PillarScore>;
}

/**
 * Wie gut passt B aus Sicht von A? Nutzt die Gewichtung von A.
 * Bereiche ohne Daten fallen heraus. Unsichere Bereiche zählen weniger (Gewicht * (0.25 + 0.75 * Sicherheit)).
 */
export function directionalScore(a: MatchProfile, b: MatchProfile): DirectionalScore {
  const rel = relationshipScore(a, b);
  const pillars: Record<Pillar, PillarScore> = {
    visual: visualScore(a, b),
    personality: personalityScore(a, b),
    relationship: { score: rel.score, confidence: rel.confidence },
    lifestyle: (({ score, confidence }) => ({ score, confidence }))(lifestyleScore(a, b)),
  };
  let sum = 0;
  let wSum = 0;
  let baseSum = 0;
  let confSum = 0;
  for (const p of PILLARS) {
    const base = Math.max(0, a.weights[p]);
    baseSum += base;
    const { score, confidence } = pillars[p];
    if (score === null || base === 0) continue;
    const w = base * (0.25 + 0.75 * confidence);
    sum += score * w;
    wSum += w;
    confSum += base * confidence;
  }
  return {
    total: wSum > 0 ? sum / wSum : null,
    confidence: baseSum > 0 ? clamp01(confSum / baseSum) : 0,
    pillars,
  };
}

export interface Explanation {
  code: string;
  text: string;
  /** Wer diesen Satz sehen darf. Sätze über die eigenen Vorlieben sieht nur die Person selbst. */
  audience: 'both' | 'a' | 'b';
}

export interface Compatibility {
  /** false = harter Filter greift, das Paar wird nicht vorgeschlagen */
  eligible: boolean;
  filter: FilterResult;
  aToB: DirectionalScore;
  bToA: DirectionalScore;
  /** Gegenseitiger Wert 0..1 (harmonisches Mittel, ggf. gedeckelt), null wenn keine Daten */
  mutual: number | null;
  /** Gegenseitige Werte je Bereich (harmonisches Mittel beider Richtungen) */
  pillars: Record<Pillar, number | null>;
  confidence: number;
  /** Grundlegende Unterschiede, bei denen nicht beide flexibel sind. Deckeln den Wert. */
  conflicts: FundamentalField[];
  reasons: Explanation[];
  differences: Explanation[];
}

function list(labels: string[]): string {
  if (labels.length <= 1) return labels.join('');
  return `${labels.slice(0, -1).join(', ')} und ${labels[labels.length - 1]}`;
}

function explain(a: MatchProfile, b: MatchProfile, aToB: DirectionalScore, bToA: DirectionalScore) {
  const reasons: Explanation[] = [];
  const differences: Explanation[] = [];

  // Gemeinsame Interessen
  const { shared } = lifestyleScore(a, b);
  if (shared.length) {
    const labels = shared.slice(0, 3).map((k) => INTERESTS[k as InterestKey]);
    reasons.push({ code: 'shared_interests', text: `Ihr mögt beide ${list(labels)}.`, audience: 'both' });
  } else if (a.interests.length && b.interests.length) {
    differences.push({ code: 'different_interests', text: 'Eure Freizeitgestaltung unterscheidet sich teilweise.', audience: 'both' });
  }

  // Werte, die beiden wichtig sind
  const bothImportant = (Object.keys(TRAITS) as TraitKey[]).filter(
    (k) => (a.traitImportance[k] ?? 0) >= 0.7 && (b.traitImportance[k] ?? 0) >= 0.7,
  );
  if (bothImportant.length) {
    reasons.push({
      code: 'shared_values',
      text: `Ihr legt beide großen Wert auf ${list(bothImportant.slice(0, 2).map((k) => TRAITS[k]))}.`,
      audience: 'both',
    });
  }

  // Ähnlicher Humor (beide beschreiben sich mit viel Humor)
  if ((a.traits.humor ?? 0) >= 0.7 && (b.traits.humor ?? 0) >= 0.7) {
    reasons.push({ code: 'humor', text: 'Ihr habt beide viel Humor.', audience: 'both' });
  }

  // Beziehungsziele
  const sharedGoals = a.relationshipGoals.filter((g) => b.relationshipGoals.includes(g));
  if (sharedGoals.length) {
    reasons.push({
      code: 'shared_goal',
      text: `Ihr sucht beide: ${list(sharedGoals.map((g: RelationshipGoal) => RELATIONSHIP_GOALS[g]))}.`,
      audience: 'both',
    });
  }
  const rel = relationshipScore(a, b);
  if (rel.goals !== null && rel.goals < 0.5) {
    differences.push({ code: 'goal_differs', text: 'Ihr sucht nicht ganz dasselbe. Sprecht früh darüber, was ihr euch wünscht.', audience: 'both' });
  }
  if (rel.children !== null) {
    if (rel.children >= 0.9 && a.childrenPlan) {
      reasons.push({ code: 'children_fit', text: 'Eure Vorstellungen zum Thema Kinder passen zusammen.', audience: 'both' });
    } else if (rel.children < 0.5) {
      differences.push({ code: 'children_differs', text: 'Eure Vorstellungen zum Thema Kinder unterscheiden sich.', audience: 'both' });
    }
  }
  if (rel.living !== null && rel.living < 0.5) {
    differences.push({ code: 'living_differs', text: 'Ihr stellt euch das Wohnen unterschiedlich vor.', audience: 'both' });
  }

  // Bedürfnisse
  const diff = (k: keyof MatchProfile['needs']) => {
    const x = a.needs[k];
    const y = b.needs[k];
    return x === undefined || y === undefined ? 0 : Math.abs(x - y);
  };
  if (diff('space') >= 0.35) {
    differences.push({ code: 'space_differs', text: 'Eine Person braucht mehr persönlichen Freiraum.', audience: 'both' });
  }
  if (diff('closeness') >= 0.35) {
    differences.push({ code: 'closeness_differs', text: 'Ihr habt ein unterschiedliches Bedürfnis nach Nähe.', audience: 'both' });
  }
  if (diff('socialEnergy') >= 0.4) {
    differences.push({ code: 'social_differs', text: 'Eine Person ist lieber unterwegs, die andere eher gern zu Hause.', audience: 'both' });
  }

  // Streitkultur
  if (a.conflictStyle && b.conflictStyle) {
    const fit = conflictFit(a.conflictStyle, b.conflictStyle);
    if (fit >= 0.9) reasons.push({ code: 'conflict_fit', text: 'Ihr geht ähnlich mit Meinungsverschiedenheiten um.', audience: 'both' });
    else if (fit < 0.5) differences.push({ code: 'conflict_differs', text: 'Ihr geht unterschiedlich mit Streit um.', audience: 'both' });
  }

  // Optik: nur über die EIGENEN Vorlieben, nur für die Person selbst. Nie verraten, was das Gegenüber optisch mag.
  const va = aToB.pillars.visual;
  if (va.score !== null && va.score >= 0.7 && va.confidence >= 0.3) {
    reasons.push({ code: 'visual_fit_self', text: 'Das Profil passt zu dem, was dein Attraktivitäts-Kompass über deine Vorlieben gelernt hat.', audience: 'a' });
  }
  const vb = bToA.pillars.visual;
  if (vb.score !== null && vb.score >= 0.7 && vb.confidence >= 0.3) {
    reasons.push({ code: 'visual_fit_self', text: 'Das Profil passt zu dem, was dein Attraktivitäts-Kompass über deine Vorlieben gelernt hat.', audience: 'b' });
  }

  return { reasons, differences };
}

/** Gegenseitige Kompatibilität von A und B inklusive Erklärung. Reihenfolge von A/B ist egal (bis auf "audience"). */
export function compatibility(a: MatchProfile, b: MatchProfile): Compatibility {
  const filter = hardFilter(a, b);
  const aToB = directionalScore(a, b);
  const bToA = directionalScore(b, a);

  const pillars = {} as Record<Pillar, number | null>;
  for (const p of ['visual', 'personality', 'relationship', 'lifestyle'] as Pillar[]) {
    const x = aToB.pillars[p].score;
    const y = bToA.pillars[p].score;
    pillars[p] = x !== null && y !== null ? harmonic(x, y) : (x ?? y);
  }

  const rel = relationshipScore(a, b);
  const conflicts = rel.fundamental.filter((f) => !(a.flexibleOn.includes(f) && b.flexibleOn.includes(f)));

  let mutual: number | null = null;
  if (aToB.total !== null && bToA.total !== null) {
    mutual = harmonic(aToB.total, bToA.total);
    if (conflicts.length) mutual = Math.min(mutual, FUNDAMENTAL_CAP);
  }

  const { reasons, differences } = explain(a, b, aToB, bToA);
  return {
    eligible: filter.ok,
    filter,
    aToB,
    bToA,
    mutual,
    pillars,
    confidence: Math.min(aToB.confidence, bToA.confidence),
    conflicts,
    reasons,
    differences,
  };
}

/** Prozentwert für die Anzeige (ganze Zahl) oder null. */
export function percent(x: number | null): number | null {
  return x === null ? null : Math.round(clamp01(x) * 100);
}

/**
 * Was eine Person über ein Paar sehen darf.
 * Enthält nur gegenseitige Werte und Sätze für "both" oder die Person selbst. Gerichtete Werte werden
 * absichtlich NICHT herausgegeben, auch nicht der eigene: aus eigenem Wert + gegenseitigem Wert ließe sich
 * sonst ausrechnen, wie das Gegenüber einen selbst bewertet.
 */
export function viewFor(c: Compatibility, side: 'a' | 'b') {
  return {
    mutualPercent: percent(c.mutual),
    pillarsPercent: Object.fromEntries(PILLARS.map((p) => [p, percent(c.pillars[p])])) as Record<Pillar, number | null>,
    lowConfidence: c.confidence < 0.4,
    hasFundamentalDifference: c.conflicts.length > 0,
    reasons: c.reasons.filter((r) => r.audience === 'both' || r.audience === side).map((r) => r.text),
    differences: c.differences.filter((r) => r.audience === 'both' || r.audience === side).map((r) => r.text),
    disclaimer: SCORE_DISCLAIMER,
  };
}

