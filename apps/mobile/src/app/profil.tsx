import { CHILDREN_PLANS, GENDERS, RELATIONSHIP_GOALS, TRAITS } from '@udate/shared';
import { router } from 'expo-router';
import { ageOn } from '../lib/age';
import { useOnboarding } from '../lib/onboarding';
import { Button, Card, EmptyState, Hero, Screen, Text } from '../ui';

export default function Profil() {
  const { draft } = useOnboarding();
  if (!draft.displayName) {
    return (
      <Screen>
        <EmptyState icon="person" title="Noch kein Profil" text="Richte zuerst dein Profil ein. Das dauert nur ein paar Minuten.">
          <Button title="Profil einrichten" onPress={() => router.push('/onboarding')} />
        </EmptyState>
      </Screen>
    );
  }
  const age = draft.birthDate ? ageOn(new Date(draft.birthDate)) : null;
  return (
    <Screen>
      <Hero title={`${draft.displayName}${age !== null ? `, ${age}` : ''}`} subtitle={draft.city || undefined} />
      <Card>
        <Text variant="heading">Sucht</Text>
        <Text muted>{draft.relationshipGoals.map((g) => RELATIONSHIP_GOALS[g]).join(', ') || '–'}</Text>
      </Card>
      {draft.relationshipVision ? (
        <Card>
          <Text variant="heading">So stelle ich mir eine Beziehung vor</Text>
          <Text muted>{draft.relationshipVision}</Text>
        </Card>
      ) : null}
      <Card>
        <Text variant="heading">Nur für dich sichtbar</Text>
        <Text variant="caption" muted>Diese Angaben nutzt nur das Matching. Andere sehen sie nicht.</Text>
        <Text muted>Ich bin: {draft.gender ? GENDERS[draft.gender] : '–'}{draft.genderSelfDesc ? ` (${draft.genderSelfDesc})` : ''}</Text>
        <Text muted>Möchte kennenlernen: {draft.seeking.map((g) => GENDERS[g]).join(', ') || '–'}</Text>
        <Text muted>Alter {draft.ageMin}–{draft.ageMax}, Umkreis {draft.radiusKm} km</Text>
        <Text muted>Wichtig: {draft.importantTraits.map((t) => TRAITS[t]).join(', ') || '–'}</Text>
        <Text muted>Ausschluss Kinder: {draft.dealbreakers.childrenPlan.map((c) => CHILDREN_PLANS[c]).join(', ') || 'keiner'}</Text>
      </Card>
      <Button title="Angaben bearbeiten" kind="secondary" icon="edit" onPress={() => router.push('/onboarding')} />
    </Screen>
  );
}
