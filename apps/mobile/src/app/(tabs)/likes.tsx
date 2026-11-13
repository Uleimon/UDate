import { ServerGate } from '../../components/ServerGate';
import { Screen, Text } from '../../ui';

export default function Page() {
  return (
    <Screen tabs>
      <Text variant="title">Likes</Text>
      <ServerGate icon="favorite" title="Likes" waiting="Hier siehst du, wer dich mag und wen du magst." />
    </Screen>
  );
}
