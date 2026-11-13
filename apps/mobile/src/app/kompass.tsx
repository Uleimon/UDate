import { COMPASS_RATINGS, APPEARANCE } from '@udate/shared';
import { View } from 'react-native';
import { space } from '../theme/tokens';
import { Card, Hero, Notice, Screen, Text } from '../ui';

/**
 * Der Kompass braucht eine lizenzierte Bildsammlung (nur Erwachsene, mit Einwilligung). Die gibt es noch nicht,
 * darum erklärt diese Seite ehrlich, wie er funktionieren wird, statt ein Training vorzutäuschen.
 */
export default function Kompass() {
  return (
    <Screen>
      <Hero title="Dein Attraktivitäts-Kompass" subtitle="Lernt, welcher Stil dich anspricht. Nur für dich sichtbar, jederzeit änder- und löschbar." />
      <Notice tone="warning">
        Das Training ist noch nicht verfügbar. Es startet, sobald die lizenzierte Bildsammlung bereit ist.
      </Notice>
      <Card>
        <Text variant="heading">So wird es funktionieren</Text>
        <Text muted>Du siehst Beispielbilder von Erwachsenen, die dafür ausdrücklich zugestimmt haben, und bewertest sie:</Text>
        <View style={{ gap: space.xs }}>
          {Object.values(COMPASS_RATINGS).map((r) => (
            <Text key={r.label}>• {r.label}</Text>
          ))}
        </View>
        <Text muted>
          Daraus lernt der Kompass deine Vorlieben bei {Object.values(APPEARANCE).slice(0, 4).map((a) => a.label).join(', ')} und mehr.
          Wenige Bewertungen sind noch unsicher, das zeigt er dir offen an.
        </Text>
      </Card>
      <Card>
        <Text variant="heading">Was der Kompass nie tut</Text>
        <Text muted>• Keine Gesichtserkennung und keine Auswertung deiner Fotos.</Text>
        <Text muted>• Keine Aussage, wer „objektiv“ attraktiv ist.</Text>
        <Text muted>• Nichts heimlich speichern: Du siehst alles, was er gelernt hat, und kannst es korrigieren oder löschen.</Text>
      </Card>
    </Screen>
  );
}
