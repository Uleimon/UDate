/**
 * Gemeinsames Vokabular von UDate.
 *
 * Alles, was Nutzer angeben oder was die Matching-Engine vergleicht, ist hier als fester Schlüssel definiert.
 * Labels sind deutsch, weil die App zuerst für den deutschsprachigen Raum gebaut wird.
 *
 * Regeln:
 * - Nur Dinge, die Nutzer selbst und freiwillig angeben. Nichts davon wird aus Bildern erraten.
 * - Keine sensiblen Kategorien (Herkunft, Religion, Gesundheit, sexuelle Orientierung über die Suche hinaus usw.)
 *   als Matching-Merkmal. Geschlecht/Suche ist nötig für die Grundfunktion und wird nie öffentlich angezeigt, wenn der Nutzer das nicht will.
 */

const keys = <T extends Record<string, string>>(o: T) => Object.keys(o) as (keyof T & string)[];

// ---------------------------------------------------------------- Persönlichkeit

/** Eigenschaften, die ein Nutzer im Persönlichkeitstest über sich angibt (0..1) und an Partnern gewichten kann. */
export const TRAITS = {
  // Charakter
  humor: 'Humor',
  honesty: 'Ehrlichkeit',
  loyalty: 'Treue',
  empathy: 'Empathie',
  confidence: 'Selbstbewusstsein',
  joy: 'Lebensfreude',
  patience: 'Geduld',
  responsibility: 'Verantwortungsbewusstsein',
  // Kommunikation
  openness: 'Offenheit',
  talkativeness: 'Gesprächsbereitschaft',
  criticism: 'Umgang mit Kritik',
  // Beziehung
  trust: 'Vertrauen',
  tenderness: 'Zärtlichkeit',
  romance: 'Romantik',
  compromise: 'Kompromissbereitschaft',
  emotionalAvailability: 'Emotionale Verfügbarkeit',
} as const;
export type TraitKey = keyof typeof TRAITS;
export const TRAIT_KEYS = keys(TRAITS);

/**
 * Bedürfnisse, bei denen nicht "mehr ist besser" gilt, sondern ähnliche Werte gut zusammenpassen.
 * Große Unterschiede werden als Unterschied angezeigt, nicht als Ausschluss.
 */
export const NEEDS = {
  closeness: 'Bedürfnis nach Nähe',
  space: 'Bedürfnis nach Freiraum',
  socialEnergy: 'Lust auf Ausgehen und Leute',
  routine: 'Wunsch nach Struktur im Alltag',
} as const;
export type NeedKey = keyof typeof NEEDS;
export const NEED_KEYS = keys(NEEDS);

/** Wie jemand mit Streit umgeht (aus Situationsfragen). Kein Typ ist "besser". */
export const CONFLICT_STYLES = {
  talk_now: 'spricht Probleme sofort an',
  cool_down: 'braucht erst etwas Abstand, dann ein Gespräch',
  avoid: 'geht Streit lieber aus dem Weg',
} as const;
export type ConflictStyle = keyof typeof CONFLICT_STYLES;
export const CONFLICT_STYLE_KEYS = keys(CONFLICT_STYLES);

// ---------------------------------------------------------------- Interessen

export const INTERESTS = {
  gaming: 'Gaming',
  sport: 'Sport',
  fitness: 'Fitness',
  music: 'Musik',
  concerts: 'Konzerte',
  travel: 'Reisen',
  going_out: 'Ausgehen',
  nature: 'Natur',
  hiking: 'Wandern',
  cooking: 'Kochen',
  family: 'Familie',
  activities: 'Unternehmungen',
  reading: 'Lesen',
  film: 'Filme & Serien',
  art: 'Kunst & Kultur',
  photography: 'Fotografie',
  dancing: 'Tanzen',
  animals: 'Tiere',
  tech: 'Technik',
  volunteering: 'Ehrenamt',
} as const;
export type InterestKey = keyof typeof INTERESTS;
export const INTEREST_KEYS = keys(INTERESTS);

// ---------------------------------------------------------------- Beziehung & Lebensziele

export const RELATIONSHIP_GOALS = {
  long_term: 'Langfristige Beziehung',
  committed: 'Feste Partnerschaft',
  casual: 'Unverbindliches Kennenlernen',
  friendship_first: 'Freundschaft mit Entwicklungspotenzial',
  activity_partner: 'Gemeinsame Freizeitgestaltung',
} as const;
export type RelationshipGoal = keyof typeof RELATIONSHIP_GOALS;
export const RELATIONSHIP_GOAL_KEYS = keys(RELATIONSHIP_GOALS);

export const CHILDREN_PLANS = {
  wants: 'möchte Kinder',
  open: 'offen für Kinder',
  does_not_want: 'möchte keine Kinder',
  has_wants_more: 'hat Kinder und möchte weitere',
  has_no_more: 'hat Kinder, keine weiteren geplant',
} as const;
export type ChildrenPlan = keyof typeof CHILDREN_PLANS;
export const CHILDREN_PLAN_KEYS = keys(CHILDREN_PLANS);

export const LIVING_PLANS = {
  move_in_soon: 'möchte bald zusammenziehen',
  own_place: 'möchte lieber getrennt wohnen',
  flexible: 'flexibel',
} as const;
export type LivingPlan = keyof typeof LIVING_PLANS;
export const LIVING_PLAN_KEYS = keys(LIVING_PLANS);

export const FREQUENCY = {
  never: 'nie',
  sometimes: 'manchmal',
  regularly: 'regelmäßig',
} as const;
export type Frequency = keyof typeof FREQUENCY;
export const FREQUENCY_KEYS = keys(FREQUENCY);

/** Lebensstil-Skalen 0..1, bei denen Ähnlichkeit zählt. */
export const LIFESTYLE_SCALES = {
  careerFocus: 'Karriere-Fokus',
  travelWish: 'Reiselust',
  activityLevel: 'Aktivität im Alltag',
} as const;
export type LifestyleScaleKey = keyof typeof LIFESTYLE_SCALES;
export const LIFESTYLE_SCALE_KEYS = keys(LIFESTYLE_SCALES);

// ---------------------------------------------------------------- Optik (nur selbst angegeben, nur Stil)

/**
 * Optische Merkmale für den Attraktivitäts-Kompass.
 * Sie beschreiben Stil und Präsentation, die eine Person selbst angibt. Sie werden NICHT automatisch
 * aus Profilbildern erkannt. Beispielbilder im Kompass-Training sind redaktionell mit denselben Schlüsseln getaggt.
 */
export const APPEARANCE = {
  hairColor: {
    label: 'Haarfarbe',
    values: { blond: 'blond', brown: 'braun', black: 'schwarz', red: 'rot', grey: 'grau/silber', colorful: 'bunt gefärbt' },
  },
  hairLength: {
    label: 'Haarlänge',
    values: { none: 'Glatze/rasiert', short: 'kurz', medium: 'mittel', long: 'lang' },
  },
  hairStyle: {
    label: 'Frisur',
    values: { loose: 'offen/natürlich', tied: 'zusammengebunden', styled: 'gestylt', undercut: 'Undercut/Sidecut' },
  },
  clothingStyle: {
    label: 'Kleidungsstil',
    values: {
      casual: 'lässig', elegant: 'elegant', sporty: 'sportlich', alternative: 'alternativ',
      streetwear: 'Streetwear', natural: 'natürlich/boho', classic: 'klassisch',
    },
  },
  makeupStyle: {
    label: 'Make-up-Stil',
    values: { none: 'kein Make-up', natural: 'natürlich', glam: 'glamourös', artistic: 'kreativ' },
  },
  overallStyle: {
    label: 'Erscheinungsstil',
    values: { natural: 'natürlich', polished: 'sehr gepflegt', edgy: 'markant', playful: 'verspielt', sophisticated: 'stilvoll' },
  },
  presence: {
    label: 'Ausstrahlung',
    values: { calm: 'ruhig', warm: 'herzlich', energetic: 'energiegeladen', mysterious: 'geheimnisvoll', cheerful: 'fröhlich' },
  },
  bodyType: {
    label: 'Statur (freiwillig)',
    values: { slim: 'schlank', athletic: 'sportlich', average: 'durchschnittlich', curvy: 'kurvig', muscular: 'muskulös', strong: 'kräftig' },
  },
  facialHair: {
    label: 'Bart',
    values: { none: 'kein Bart', stubble: 'Dreitagebart', beard: 'Bart' },
  },
  accessories: {
    label: 'Besonderheiten',
    values: { glasses: 'Brille', tattoos: 'Tattoos', piercings: 'Piercings', none: 'nichts davon' },
  },
} as const satisfies Record<string, { label: string; values: Record<string, string> }>;
export type AppearanceAttribute = keyof typeof APPEARANCE;
export const APPEARANCE_ATTRIBUTES = Object.keys(APPEARANCE) as AppearanceAttribute[];
/** Merkmale, bei denen eine Person mehrere Werte haben kann (z. B. Brille UND Tattoos). */
export const MULTI_VALUE_APPEARANCE: ReadonlySet<AppearanceAttribute> = new Set(['accessories', 'clothingStyle']);

export function appearanceValues(attr: AppearanceAttribute): string[] {
  return Object.keys(APPEARANCE[attr].values);
}

export function appearanceLabel(attr: AppearanceAttribute, value: string): string {
  const values = APPEARANCE[attr].values as Record<string, string>;
  return values[value] ?? value;
}

// ---------------------------------------------------------------- Geschlecht

/** Grobe Kategorie für die Suche. Die Selbstbeschreibung ist ein freies Feld im Profil. */
export const GENDERS = {
  woman: 'Frau',
  man: 'Mann',
  nonbinary: 'Nicht-binär',
} as const;
export type Gender = keyof typeof GENDERS;
export const GENDER_KEYS = keys(GENDERS);

// ---------------------------------------------------------------- Bewertung im Kompass-Training

/** Die fünf Antworten im Kompass-Training und ihr Zahlenwert für das Lernen. */
export const COMPASS_RATINGS = {
  very_attractive: { label: 'Sehr attraktiv', value: 1 },
  attractive: { label: 'Attraktiv', value: 0.5 },
  neutral: { label: 'Neutral', value: 0 },
  less_attractive: { label: 'Weniger attraktiv', value: -0.5 },
  not_my_type: { label: 'Überhaupt nicht mein Typ', value: -1 },
} as const;
export type CompassRating = keyof typeof COMPASS_RATINGS;
export const COMPASS_RATING_KEYS = Object.keys(COMPASS_RATINGS) as CompassRating[];

/** Mindestalter für die Plattform. */
export const MIN_AGE = 18;
