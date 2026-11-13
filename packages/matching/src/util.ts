export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Gewichteter Mittelwert. Teile ohne Wert (null) fallen heraus, die übrigen Gewichte werden normalisiert. */
export function weightedMean(parts: { value: number | null; weight: number }[]): number | null {
  let sum = 0;
  let w = 0;
  for (const p of parts) {
    if (p.value === null || p.weight <= 0) continue;
    sum += p.value * p.weight;
    w += p.weight;
  }
  return w > 0 ? sum / w : null;
}

/** Harmonisches Mittel: bestraft einseitige Werte stärker als der Durchschnitt (90/30 -> 45 statt 60). */
export function harmonic(a: number, b: number): number {
  if (a <= 0 || b <= 0) return 0;
  return (2 * a * b) / (a + b);
}

/** Entfernung in km (Haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Symmetrische Nachschlage-Tabelle für Paare von Kategorien. */
export function pairTable<K extends string>(entries: [K, K, number][], fallback: number) {
  const m = new Map<string, number>();
  for (const [a, b, v] of entries) {
    m.set(`${a}|${b}`, v);
    m.set(`${b}|${a}`, v);
  }
  return (a: K, b: K): number => (a === b ? m.get(`${a}|${b}`) ?? 1 : m.get(`${a}|${b}`) ?? fallback);
}
