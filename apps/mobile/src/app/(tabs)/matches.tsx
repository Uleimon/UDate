import { ServerGate } from '../../components/ServerGate';
import { Screen, Text } from '../../ui';

export default function Page() {
  return (
    <Screen tabs>
      <Text variant="title">Matches</Text>
      <ServerGate icon="handshake" title="Matches" waiting="Wenn ihr euch beide mögt, entsteht hier ein Match." />
    </Screen>
  );
}
