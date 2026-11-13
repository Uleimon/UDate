import {
  CHILDREN_PLANS,
  FREQUENCY,
  GENDERS,
  RELATIONSHIP_GOALS,
  TRAITS,
  type ChildrenPlan,
  type Frequency,
  type Gender,
  type RelationshipGoal,
  type TraitKey,
} from '@udate/shared';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ageOn, parseBirthDate } from '../lib/age';
import { STEPS, step1Errors, step2Errors, useOnboarding } from '../lib/onboarding';
import { space } from '../theme/tokens';
import { Button, Card, ChipGroup, Field, Notice, ProgressBar, Row, Screen, Stepper, Text } from '../ui';

const FLEXIBLE = { childrenPlan: 'Kinderwunsch', relationshipGoal: 'Art der Beziehung', livingPlan: 'Wohnen' } as const;

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card>
      <Text variant="heading">{title}</Text>
      {hint ? (
        <Text variant="caption" muted>
          {hint}
        </Text>
      ) : null}
      <View style={{ gap: space.md, marginTop: space.xs }}>{children}</View>
    </Card>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  const { draft, update } = useOnboarding();
  const [y0, m0, d0] = draft.birthDate?.split('-') ?? ['', '', ''];
  const [day, setDay] = useState(d0 ?? '');
  const [month, setMonth] = useState(m0 ?? '');
  const [year, setYear] = useState(y0 ?? '');
  const [showErrors, setShowErrors] = useState(false);

  const birth = parseBirthDate(day, month, year);
  const age = birth ? ageOn(birth) : null;
  const errors = step1Errors(draft, age);

  const saveBirth = (d: string, m: string, y: string) => {
    const b = parseBirthDate(d, m, y);
    update({ birthDate: b ? b.toISOString().slice(0, 10) : null });
  };

  return (
    <>
      <Section title="Wie dürfen wir dich nennen?" hint="Nur dein Vorname oder ein Anzeigename. Kein Nachname nötig.">
        <Field label="Anzeigename" value={draft.displayName} onChangeText={(t) => update({ displayName: t })} maxLength={40} autoComplete="given-name" />
      </Section>

      <Section title="Geburtsdatum" hint="UDate ist nur für Menschen ab 18. Andere sehen nur dein Alter, nie das Datum.">
        <Row>
          <View style={{ flex: 1 }}>
            <Field label="Tag" placeholder="TT" keyboardType="number-pad" maxLength={2} value={day} onChangeText={(t) => { setDay(t); saveBirth(t, month, year); }} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Monat" placeholder="MM" keyboardType="number-pad" maxLength={2} value={month} onChangeText={(t) => { setMonth(t); saveBirth(day, t, year); }} />
          </View>
          <View style={{ flex: 1.4 }}>
            <Field label="Jahr" placeholder="JJJJ" keyboardType="number-pad" maxLength={4} value={year} onChangeText={(t) => { setYear(t); saveBirth(day, month, t); }} />
          </View>
        </Row>
        {age !== null ? <Text variant="caption" muted>Du bist {age} Jahre alt.</Text> : null}
      </Section>

      <Section title="Wohnort" hint="Andere sehen nur die ungefähre Entfernung, nie deinen genauen Standort.">
        <Field label="Stadt" value={draft.city} onChangeText={(t) => update({ city: t })} maxLength={80} autoComplete="postal-address-locality" />
      </Section>

      <Section title="Ich bin">
        <ChipGroup<Gender> single options={GENDERS} selected={draft.gender ? [draft.gender] : []} onChange={(v) => update({ gender: v[0] ?? null })} />
        <Field
          label="Eigene Beschreibung (freiwillig)"
          hint="Wenn du dich mit deinen eigenen Worten beschreiben möchtest."
          value={draft.genderSelfDesc}
          onChangeText={(t) => update({ genderSelfDesc: t })}
          maxLength={60}
        />
      </Section>

      <Section title="Ich möchte kennenlernen" hint="Mehrfachauswahl möglich.">
        <ChipGroup<Gender> options={GENDERS} selected={draft.seeking} onChange={(v) => update({ seeking: v })} />
      </Section>

      <Section title="Alter und Umkreis">
        <Stepper label="Ab" value={draft.ageMin} min={18} max={draft.ageMax} onChange={(v) => update({ ageMin: v })} unit=" J." />
        <Stepper label="Bis" value={draft.ageMax} min={draft.ageMin} max={99} onChange={(v) => update({ ageMax: v })} unit=" J." />
        <Stepper label="Umkreis" value={draft.radiusKm} min={5} max={300} step={5} onChange={(v) => update({ radiusKm: v })} unit=" km" />
      </Section>

      {showErrors && errors.length ? <Notice tone="warning">{errors.join('\n')}</Notice> : null}
      <Button
        title="Weiter"
        icon="arrow_forward"
        onPress={() => {
          if (errors.length) return setShowErrors(true);
          onNext();
        }}
      />
    </>
  );
}

function Step2({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { draft, update } = useOnboarding();
  const [showErrors, setShowErrors] = useState(false);
  const errors = step2Errors(draft);
  const db = draft.dealbreakers;

  return (
    <>
      <Section title="Was suchst du?" hint="Mehrfachauswahl möglich. Du kannst das später jederzeit ändern.">
        <ChipGroup<RelationshipGoal> options={RELATIONSHIP_GOALS} selected={draft.relationshipGoals} onChange={(v) => update({ relationshipGoals: v })} />
      </Section>

      <Section title="Wie stellst du dir eine Beziehung vor?" hint="Ein paar Sätze in deinen Worten. Freiwillig.">
        <Field label="Deine Vorstellung" multiline maxLength={500} value={draft.relationshipVision} onChangeText={(t) => update({ relationshipVision: t })} />
      </Section>

      <Section title="Was ist dir bei einem Menschen wichtig?" hint={`Wähle bis zu 5. (${draft.importantTraits.length}/5)`}>
        <ChipGroup<TraitKey>
          options={TRAITS}
          selected={draft.importantTraits}
          onChange={(v) => update({ importantTraits: v.slice(0, 5) })}
        />
      </Section>

      <Section title="Absolute Ausschlusskriterien" hint="Menschen mit diesen Angaben werden dir nicht vorgeschlagen und du ihnen nicht. Freiwillig.">
        <Text variant="label">Raucht …</Text>
        <ChipGroup<Frequency> options={FREQUENCY} selected={db.smoking} onChange={(v) => update({ dealbreakers: { ...db, smoking: v } })} />
        <Text variant="label">Kinder</Text>
        <ChipGroup<ChildrenPlan> options={CHILDREN_PLANS} selected={db.childrenPlan} onChange={(v) => update({ dealbreakers: { ...db, childrenPlan: v } })} />
        <Text variant="label">Sucht nur …</Text>
        <ChipGroup<RelationshipGoal> options={RELATIONSHIP_GOALS} selected={db.relationshipGoal} onChange={(v) => update({ dealbreakers: { ...db, relationshipGoal: v } })} />
      </Section>

      <Section title="Darüber kann man reden" hint="Wenn ihr hier verschieden denkt, zeigt UDate das als Unterschied statt als Grund gegen ein Match. Das gilt nur, wenn ihr beide offen seid.">
        <ChipGroup<keyof typeof FLEXIBLE> options={FLEXIBLE} selected={draft.flexibleOn} onChange={(v) => update({ flexibleOn: v })} />
      </Section>

      {showErrors && errors.length ? <Notice tone="warning">{errors.join('\n')}</Notice> : null}
      <Button
        title="Speichern"
        icon="check"
        onPress={() => {
          if (errors.length) return setShowErrors(true);
          onDone();
        }}
      />
      <Button title="Zurück" kind="ghost" onPress={onBack} />
    </>
  );
}

export default function Onboarding() {
  const { draft, update } = useOnboarding();
  const step = draft.step <= 2 ? draft.step : 1;
  const current = useMemo(() => STEPS.find((s) => s.n === step)!, [step]);

  const complete = (n: number) => Array.from(new Set([...draft.completedSteps, n])).sort();

  return (
    <Screen>
      <View style={{ gap: space.sm }}>
        <Text variant="caption" muted>
          Schritt {step} von {STEPS.length}
        </Text>
        <Text variant="title">{current.title}</Text>
        <ProgressBar value={(step - 1) / STEPS.length} />
        <Text variant="caption" muted>
          Alles wird automatisch gespeichert. Du kannst jederzeit aufhören und später weitermachen.
        </Text>
      </View>

      {step === 1 ? (
        <Step1 onNext={() => update({ step: 2, completedSteps: complete(1) })} />
      ) : (
        <Step2
          onBack={() => update({ step: 1 })}
          onDone={() => {
            update({ step: 2, completedSteps: complete(2) });
            router.back();
          }}
        />
      )}

      <Notice>
        Schritte 3 bis 6 (Persönlichkeit, optische Vorlieben, Kompass, Bilder) kommen mit den nächsten App-Versionen.
      </Notice>
    </Screen>
  );
}
