import Constants from 'expo-constants';
import { useState } from 'react';
import { API_URL } from '../lib/config';
import { useOnboarding } from '../lib/onboarding';
import { useServerStatus } from '../lib/server';
import { Button, Card, Notice, Screen, Text } from '../ui';

export default function Einstellungen() {
  const { reset } = useOnboarding();
  const { state, refresh } = useServerStatus();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const label = { not_configured: 'nicht eingerichtet', checking: 'wird geprüft …', online: 'erreichbar', offline: 'nicht erreichbar' }[state];

  return (
    <Screen>
      <Card>
        <Text variant="heading">Deine Daten</Text>
        <Text muted>
          In dieser Testversion bleiben alle Angaben nur auf diesem Gerät. Es wird nichts an einen Server geschickt.
        </Text>
        {done ? <Notice>Alle Angaben auf diesem Gerät wurden gelöscht.</Notice> : null}
        {confirm ? (
          <>
            <Notice tone="warning">Wirklich alles löschen? Das kann nicht rückgängig gemacht werden.</Notice>
            <Button
              title="Ja, alles löschen"
              kind="danger"
              icon="delete"
              onPress={async () => {
                await reset();
                setConfirm(false);
                setDone(true);
              }}
            />
            <Button title="Abbrechen" kind="ghost" onPress={() => setConfirm(false)} />
          </>
        ) : (
          <Button title="Alle Angaben löschen" kind="secondary" icon="delete" onPress={() => { setDone(false); setConfirm(true); }} />
        )}
      </Card>
      <Card>
        <Text variant="heading">Server</Text>
        <Text muted>Status: {label}</Text>
        {API_URL ? <Text variant="caption" muted>{API_URL}</Text> : null}
        {API_URL ? <Button title="Erneut prüfen" kind="secondary" onPress={refresh} /> : null}
      </Card>
      <Text variant="caption" muted center>
        UDate {Constants.expoConfig?.version ?? ''} · Testversion
      </Text>
    </Screen>
  );
}
