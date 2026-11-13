import type { AndroidSymbol } from 'expo-symbols';
import { Button, EmptyState } from '../ui';
import { useServerStatus } from '../lib/server';

/**
 * Bereiche, die echte andere Menschen brauchen (Entdecken, Likes, Matches, Chat), funktionieren nur mit Server.
 * Ohne Server sagt die App das offen. Es werden keine erfundenen Profile gezeigt.
 */
export function ServerGate({ icon, title, waiting }: { icon: AndroidSymbol; title: string; waiting: string }) {
  const { state, refresh } = useServerStatus();
  if (state === 'not_configured') {
    return (
      <EmptyState
        icon={icon}
        title={title}
        text={`${waiting} Dafür braucht die App den UDate-Server. Der ist in dieser Testversion noch nicht eingerichtet.`}
      />
    );
  }
  if (state === 'checking') return <EmptyState icon={icon} title={title} text="Verbinde mit dem Server …" />;
  if (state === 'offline') {
    return (
      <EmptyState icon="wifi_off" title="Server nicht erreichbar" text="Prüfe deine Internetverbindung und versuche es noch einmal.">
        <Button title="Erneut versuchen" kind="secondary" onPress={refresh} />
      </EmptyState>
    );
  }
  return (
    <EmptyState
      icon={icon}
      title={title}
      text="Der Server ist erreichbar. Anmeldung und Konten kommen in einer der nächsten Versionen, danach erscheint hier dein Bereich."
    />
  );
}
