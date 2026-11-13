import type { MatchProfile } from '@udate/shared';
import { compatibility, type Compatibility } from './compatibility.js';

export interface RankedCandidate {
  id: string;
  compatibility: Compatibility;
  /** Sortierwert. Nicht anzeigen: enthält Abzüge für Unsicherheit und grundlegende Unterschiede. */
  rank: number;
}

/**
 * Sortiert Kandidaten für den Entdecken-Bereich aus Sicht von `viewer`.
 * - Harte Filter (Suche, Alter, Radius, Ausschlusskriterien, Blockieren) in beide Richtungen werfen raus.
 * - Sortiert nach gegenseitigem Wert, nicht nach einseitigem Interesse.
 * - Unsichere Werte (wenig Daten) werden leicht nach hinten geschoben, grundlegende Unterschiede deutlich.
 * Die Vorauswahl (Geo-Abfrage, aktive Profile) macht die Datenbank. Diese Funktion bewertet nur.
 */
export function rankCandidates(viewer: MatchProfile, candidates: MatchProfile[], limit = 50): RankedCandidate[] {
  const out: RankedCandidate[] = [];
  for (const c of candidates) {
    const comp = compatibility(viewer, c);
    if (!comp.eligible) continue;
    const base = comp.mutual ?? 0.3;
    const rank = base * (0.85 + 0.15 * comp.confidence) - (comp.conflicts.length ? 0.2 : 0);
    out.push({ id: c.id, compatibility: comp, rank });
  }
  out.sort((x, y) => y.rank - x.rank || x.id.localeCompare(y.id));
  return out.slice(0, limit);
}
