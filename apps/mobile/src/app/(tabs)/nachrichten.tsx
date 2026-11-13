import { ServerGate } from '../../components/ServerGate';
import { Screen, Text } from '../../ui';

export default function Page() {
  return (
    <Screen tabs>
      <Text variant="title">Nachrichten</Text>
      <ServerGate icon="forum" title="Nachrichten" waiting="Hier schreibst du mit deinen Matches." />
    </Screen>
  );
}
