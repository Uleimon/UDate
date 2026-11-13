import { router } from 'expo-router';
import type { AndroidSymbol } from 'expo-symbols';
import { View } from 'react-native';
import { STEPS, useOnboarding } from '../../lib/onboarding';
import { useServerStatus } from '../../lib/server';
import { space } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { Button, Card, Hero, Icon, ProgressBar, Row, Screen, Text } from '../../ui';

function NavCard({ icon, title, text, to }: { icon: AndroidSymbol; title: string; text: string; to: '/kompass' | '/profil' | '/einstellungen' }) {
  const { c } = useTheme();
  return (
    <Card onPress={() => router.push(to)}>
      <Row>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} color={c.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="heading">{title}</Text>
          <Text variant="caption" muted>
            {text}
          </Text>
        </View>
        <Icon name="chevron_right" color={c.textMuted} />
      </Row>
    </Card>
  );
}

export default function Home() {
  const { draft } = useOnboarding();
  const server = useServerStatus();
  const readySteps = STEPS.filter((s) => s.ready);
  const done = draft.completedSteps.filter((n) => readySteps.some((s) => s.n === n)).length;
  const started = draft.displayName.length > 0 || done > 0;

  return (
    <Screen tabs>
        <Hero
          title={draft.displayName ? `Hallo ${draft.displayName}` : 'Willkommen bei UDate'}
          subtitle="Menschen, die zu dir passen. Optisch, im Charakter und in dem, was ihr euch vom Leben wünscht."
        />

        <Card>
          <Text variant="heading">Dein Profil</Text>
          <Text muted>
            {done === readySteps.length
              ? 'Die ersten Schritte sind fertig. Die weiteren kommen mit den nächsten App-Versionen.'
              : started
                ? 'Du kannst jederzeit da weitermachen, wo du aufgehört hast.'
                : 'In wenigen Minuten eingerichtet. Du kannst jederzeit pausieren.'}
          </Text>
          <ProgressBar value={done / STEPS.length} />
          <Text variant="caption" muted>
            {done} von {STEPS.length} Schritten
          </Text>
          <Button
            title={done === readySteps.length ? 'Angaben ansehen' : started ? 'Weitermachen' : 'Los geht’s'}
            icon="arrow_forward"
            onPress={() => router.push('/onboarding')}
            style={{ marginTop: space.sm }}
          />
        </Card>

        <NavCard icon="auto_awesome" title="Attraktivitäts-Kompass" text="Lerne, was dir gefällt. Nur für dich sichtbar." to="/kompass" />
        <NavCard icon="person" title="Mein Profil" text="So sehen dich andere" to="/profil" />
        <NavCard icon="settings" title="Einstellungen" text="Daten, Datenschutz, Server" to="/einstellungen" />

        <Text variant="caption" muted center>
          {server.state === 'not_configured'
            ? 'Testversion ohne Server. Deine Angaben bleiben nur auf diesem Gerät.'
            : server.state === 'online'
              ? 'Mit dem UDate-Server verbunden.'
              : server.state === 'checking'
                ? 'Verbinde mit dem Server …'
                : 'Server gerade nicht erreichbar.'}
        </Text>
    </Screen>
  );
}
