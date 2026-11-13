import type { Dealbreakers, MatchProfile } from '@udate/shared';
import { distanceKm } from './util.js';

/**
 * Harte Filter. Wenn einer greift, wird das Paar gar nicht vorgeschlagen.
 * Das sind nur Dinge, die eine Person selbst ausdrücklich festgelegt hat (Suche, Alter, Radius, Ausschlusskriterien, Blockieren).
 */
export type ExclusionReason =
  | 'self'
  | 'blocked'
  | 'gender'
  | 'age'
  | 'distance'
  | 'no_location'
  | 'dealbreaker';

export interface FilterResult {
  ok: boolean;
  /** Gründe, getrennt nach Richtung. "a" = aus Sicht von A passt B nicht. Nur intern, wird nie angezeigt. */
  reasons: { side: 'a' | 'b' | 'both'; reason: ExclusionReason; detail?: string }[];
  distanceKm: number | null;
}

function dealbreakerHit(db: Dealbreakers, other: MatchProfile): string | null {
  if (other.smoking && db.smoking?.includes(other.smoking)) return 'smoking';
  if (other.drinking && db.drinking?.includes(other.drinking)) return 'drinking';
  if (other.childrenPlan && db.childrenPlan?.includes(other.childrenPlan)) return 'childrenPlan';
  if (db.relationshipGoal?.length && other.relationshipGoals.length) {
    // Ausschluss nur, wenn ALLE Ziele des Gegenübers ausgeschlossen sind.
    if (other.relationshipGoals.every((g) => db.relationshipGoal!.includes(g))) return 'relationshipGoal';
  }
  return null;
}

/** Prüft eine Richtung: Passt B in die festen Vorgaben von A? */
function oneWay(a: MatchProfile, b: MatchProfile, side: 'a' | 'b', dist: number | null, out: FilterResult['reasons']) {
  if (!a.seeking.includes(b.gender)) out.push({ side, reason: 'gender' });
  if (b.age < a.ageMin || b.age > a.ageMax) out.push({ side, reason: 'age' });
  if (dist !== null && dist > a.radiusKm) out.push({ side, reason: 'distance' });
  const hit = dealbreakerHit(a.dealbreakers, b);
  if (hit) out.push({ side, reason: 'dealbreaker', detail: hit });
}

export function hardFilter(a: MatchProfile, b: MatchProfile): FilterResult {
  const reasons: FilterResult['reasons'] = [];
  if (a.id === b.id) reasons.push({ side: 'both', reason: 'self' });
  if (a.blocked.includes(b.id) || b.blocked.includes(a.id)) reasons.push({ side: 'both', reason: 'blocked' });

  let dist: number | null = null;
  if (a.location && b.location) dist = distanceKm(a.location, b.location);
  else reasons.push({ side: 'both', reason: 'no_location' });

  oneWay(a, b, 'a', dist, reasons);
  oneWay(b, a, 'b', dist, reasons);
  return { ok: reasons.length === 0, reasons, distanceKm: dist === null ? null : Math.round(dist) };
}
