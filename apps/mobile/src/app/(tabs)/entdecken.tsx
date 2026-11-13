import { ServerGate } from '../../components/ServerGate';
import { Screen, Text } from '../../ui';

export default function Page() {
  return (
    <Screen tabs>
      <Text variant="title">Entdecken</Text>
      <ServerGate icon="explore" title="Entdecken" waiting="Hier schlägt dir UDate Menschen vor, die gegenseitig zu dir passen." />
    </Screen>
  );
}
