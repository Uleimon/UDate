import { NativeTabs } from 'expo-router/native-tabs';
import { useTheme } from '../../theme/useTheme';

/** Hauptnavigation unten: Home, Entdecken, Likes, Matches, Nachrichten. Kompass/Profil/Einstellungen über Home. */
export default function TabsLayout() {
  const { c } = useTheme();
  return (
    <NativeTabs backgroundColor={c.surface} indicatorColor={c.accentSoft} labelStyle={{ selected: { color: c.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="entdecken">
        <NativeTabs.Trigger.Label>Entdecken</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="explore" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="likes">
        <NativeTabs.Trigger.Label>Likes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="favorite" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="matches">
        <NativeTabs.Trigger.Label>Matches</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="handshake" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="nachrichten">
        <NativeTabs.Trigger.Label>Nachrichten</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="forum" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
