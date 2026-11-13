import { z } from 'zod';
import {
  APPEARANCE,
  APPEARANCE_ATTRIBUTES,
  CHILDREN_PLAN_KEYS,
  CONFLICT_STYLE_KEYS,
  FREQUENCY_KEYS,
  GENDER_KEYS,
  INTEREST_KEYS,
  LIFESTYLE_SCALE_KEYS,
  LIVING_PLAN_KEYS,
  MIN_AGE,
  NEED_KEYS,
  RELATIONSHIP_GOAL_KEYS,
  TRAIT_KEYS,
  type AppearanceAttribute,
} from './catalog.js';

const unit = z.number().min(0).max(1);
const enumOf = <T extends string>(values: readonly T[]) => z.enum(values as [T, ...T[]]);

export const genderSchema = enumOf(GENDER_KEYS);
export const traitKeySchema = enumOf(TRAIT_KEYS);
export const needKeySchema = enumOf(NEED_KEYS);
export const interestSchema = enumOf(INTEREST_KEYS);
export const relationshipGoalSchema = enumOf(RELATIONSHIP_GOAL_KEYS);
export const childrenPlanSchema = enumOf(CHILDREN_PLAN_KEYS);
export const livingPlanSchema = enumOf(LIVING_PLAN_KEYS);
export const frequencySchema = enumOf(FREQUENCY_KEYS);
export const conflictStyleSchema = enumOf(CONFLICT_STYLE_KEYS);
export const appearanceAttributeSchema = enumOf(APPEARANCE_ATTRIBUTES);

/** Nur Werte, die es für das Merkmal wirklich gibt. */
function appearanceValueSchema(attr: AppearanceAttribute) {
  return enumOf(Object.keys(APPEARANCE[attr].values));
}

/** Selbst angegebenes Aussehen: je Merkmal ein oder mehrere Werte. Alles optional. */
export const appearanceSchema = z
  .object(
    Object.fromEntries(
      APPEARANCE_ATTRIBUTES.map((a) => [a, z.array(appearanceValueSchema(a)).max(4).optional()]),
    ) as { [K in AppearanceAttribute]: z.ZodOptional<z.ZodArray<z.ZodEnum>> },
  )
  .strict();
export type Appearance = Partial<Record<AppearanceAttribute, string[]>>;

/**
 * Eine gelernte oder angegebene optische Vorliebe.
 * weight: -1 (spricht mich nicht an) .. +1 (gefällt mir sehr)
 * evidence: Anzahl Bewertungen, auf denen der Wert beruht (für Unsicherheit)
 * source: woher der Wert kommt. Bestätigte/manuelle Werte gelten als sicher.
 */
export const visualPreferenceSchema = z.object({
  weight: z.number().min(-1).max(1),
  evidence: z.number().int().min(0),
  source: z.enum(['learned', 'confirmed', 'manual']),
});
export type VisualPreference = z.infer<typeof visualPreferenceSchema>;

export const visualPreferencesSchema = z.partialRecord(
  appearanceAttributeSchema,
  z.record(z.string(), visualPreferenceSchema),
);
export type VisualPreferences = Partial<Record<AppearanceAttribute, Record<string, VisualPreference>>>;

/** Gewichtung der vier Bereiche. Muss nicht 1 ergeben, die Engine normalisiert. */
export const pillarWeightsSchema = z.object({
  visual: unit,
  personality: unit,
  relationship: unit,
  lifestyle: unit,
});
export type PillarWeights = z.infer<typeof pillarWeightsSchema>;
export const DEFAULT_PILLAR_WEIGHTS: PillarWeights = {
  visual: 0.25,
  personality: 0.35,
  relationship: 0.25,
  lifestyle: 0.15,
};

/** Ausschlusskriterien. Jedes Feld ist eine Liste von Werten, die beim Gegenüber NICHT vorkommen dürfen. */
export const dealbreakersSchema = z
  .object({
    smoking: z.array(frequencySchema).optional(),
    drinking: z.array(frequencySchema).optional(),
    childrenPlan: z.array(childrenPlanSchema).optional(),
    relationshipGoal: z.array(relationshipGoalSchema).optional(),
  })
  .strict();
export type Dealbreakers = z.infer<typeof dealbreakersSchema>;

/**
 * Alles, was die Matching-Engine über eine Person braucht.
 * Wird serverseitig aus der Datenbank zusammengesetzt und verlässt den Server nie in dieser Form.
 */
export const matchProfileSchema = z.object({
  id: z.string().min(1),
  age: z.number().int().min(MIN_AGE).max(120),
  gender: genderSchema,
  seeking: z.array(genderSchema).min(1),
  ageMin: z.number().int().min(MIN_AGE).max(120),
  ageMax: z.number().int().min(MIN_AGE).max(120),
  /** Gerundete Koordinaten (ca. 1 km). Genaue Standorte werden nicht gespeichert. */
  location: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).nullable(),
  radiusKm: z.number().min(1).max(500),

  relationshipGoals: z.array(relationshipGoalSchema),
  childrenPlan: childrenPlanSchema.nullable(),
  livingPlan: livingPlanSchema.nullable(),
  smoking: frequencySchema.nullable(),
  drinking: frequencySchema.nullable(),
  lifestyle: z.partialRecord(enumOf(LIFESTYLE_SCALE_KEYS), unit),
  dealbreakers: dealbreakersSchema,
  /** Was die Person beim Gegenüber für verhandelbar hält, obwohl es abweicht (z. B. Kinderwunsch "offen"). */
  flexibleOn: z.array(z.enum(['childrenPlan', 'relationshipGoal', 'livingPlan'])),

  /** Selbstbeschreibung aus dem Persönlichkeitstest, 0..1. Fehlende Schlüssel = unbekannt. */
  traits: z.partialRecord(traitKeySchema, unit),
  /** Wie wichtig der Person eine Eigenschaft beim Gegenüber ist, 0..1. */
  traitImportance: z.partialRecord(traitKeySchema, unit),
  needs: z.partialRecord(needKeySchema, unit),
  conflictStyle: conflictStyleSchema.nullable(),

  interests: z.array(interestSchema),

  appearance: appearanceSchema,
  visualPreferences: visualPreferencesSchema,
  /** Größe in cm (freiwillig) und gewünschter Bereich beim Gegenüber (freiwillig). */
  heightCm: z.number().int().min(100).max(250).nullable(),
  preferredHeightCm: z.object({ min: z.number().int(), max: z.number().int() }).nullable(),

  weights: pillarWeightsSchema,
  /** Ids, die diese Person blockiert hat oder von denen sie blockiert wurde. */
  blocked: z.array(z.string()),
});
export type MatchProfile = z.infer<typeof matchProfileSchema>;
