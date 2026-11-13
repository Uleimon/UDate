import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  childrenPlanSchema,
  frequencySchema,
  genderSchema,
  MIN_AGE,
  relationshipGoalSchema,
  traitKeySchema,
} from '@udate/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { z } from 'zod';

/**
 * Zwischenstand des Onboardings. Liegt NUR auf diesem Gerät, bis es ein Konto und einen Server gibt
 * (dann wird er an OnboardingState im Backend übertragen). So kann man jederzeit pausieren und weitermachen.
 */
export const draftSchema = z.object({
  version: z.literal(1),
  step: z.number().int().min(1).max(6),
  // Schritt 1
  displayName: z.string().trim().max(40),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  city: z.string().trim().max(80),
  gender: genderSchema.nullable(),
  genderSelfDesc: z.string().trim().max(60),
  seeking: z.array(genderSchema),
  ageMin: z.number().int().min(MIN_AGE).max(99),
  ageMax: z.number().int().min(MIN_AGE).max(99),
  radiusKm: z.number().int().min(5).max(300),
  // Schritt 2
  relationshipGoals: z.array(relationshipGoalSchema),
  relationshipVision: z.string().trim().max(500),
  importantTraits: z.array(traitKeySchema).max(5),
  dealbreakers: z.object({
    smoking: z.array(frequencySchema),
    childrenPlan: z.array(childrenPlanSchema),
    relationshipGoal: z.array(relationshipGoalSchema),
  }),
  flexibleOn: z.array(z.enum(['childrenPlan', 'relationshipGoal', 'livingPlan'])),
  completedSteps: z.array(z.number().int()),
  updatedAt: z.string(),
});
export type Draft = z.infer<typeof draftSchema>;

export const emptyDraft = (): Draft => ({
  version: 1,
  step: 1,
  displayName: '',
  birthDate: null,
  city: '',
  gender: null,
  genderSelfDesc: '',
  seeking: [],
  ageMin: 25,
  ageMax: 40,
  radiusKm: 50,
  relationshipGoals: [],
  relationshipVision: '',
  importantTraits: [],
  dealbreakers: { smoking: [], childrenPlan: [], relationshipGoal: [] },
  flexibleOn: [],
  completedSteps: [],
  updatedAt: new Date().toISOString(),
});

const KEY = 'udate.onboarding.v1';

/** Die sechs Schritte aus dem Auftrag. `ready` = in dieser App-Version schon bedienbar. */
export const STEPS = [
  { n: 1, title: 'Über dich', ready: true },
  { n: 2, title: 'Was du suchst', ready: true },
  { n: 3, title: 'Interessen & Persönlichkeit', ready: false },
  { n: 4, title: 'Optische Vorlieben', ready: false },
  { n: 5, title: 'Attraktivitäts-Kompass', ready: false },
  { n: 6, title: 'Bilder & Profiltext', ready: false },
] as const;

interface Ctx {
  draft: Draft;
  loaded: boolean;
  update: (patch: Partial<Draft>) => void;
  reset: () => Promise<void>;
}
const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = draftSchema.safeParse(JSON.parse(raw));
          if (parsed.success) setDraft(parsed.data);
        }
      } catch {
        // Kaputter Speicher: mit leerem Stand weitermachen statt abzustürzen.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      void AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setDraft(emptyDraft());
  }, []);

  const value = useMemo(() => ({ draft, loaded, update, reset }), [draft, loaded, update, reset]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): Ctx {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding außerhalb von OnboardingProvider');
  return ctx;
}

/** Fehler in Schritt 1, oder leere Liste wenn alles passt. */
export function step1Errors(d: Draft, age: number | null): string[] {
  const e: string[] = [];
  if (d.displayName.trim().length < 2) e.push('Bitte gib einen Namen mit mindestens 2 Zeichen an.');
  if (age === null) e.push('Bitte gib ein gültiges Geburtsdatum an.');
  else if (age < MIN_AGE) e.push('UDate ist nur für Menschen ab 18 Jahren.');
  if (!d.city.trim()) e.push('Bitte gib deinen Wohnort an.');
  if (!d.gender) e.push('Bitte wähle, wie du dich beschreibst.');
  if (!d.seeking.length) e.push('Bitte wähle, wen du kennenlernen möchtest.');
  if (d.ageMin > d.ageMax) e.push('Das Mindestalter ist höher als das Höchstalter.');
  return e;
}

export function step2Errors(d: Draft): string[] {
  const e: string[] = [];
  if (!d.relationshipGoals.length) e.push('Bitte wähle mindestens eine Sache, die du suchst.');
  if (d.importantTraits.length === 0) e.push('Bitte wähle bis zu 5 Eigenschaften, die dir wichtig sind.');
  return e;
}
