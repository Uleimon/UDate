import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProvider, useOnboarding } from '../lib/onboarding';
import { useTheme } from '../theme/useTheme';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { c, isDark } = useTheme();
  const { loaded } = useOnboarding();
  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ title: 'Dein Profil einrichten' }} />
        <Stack.Screen name="kompass" options={{ title: 'Attraktivitäts-Kompass' }} />
        <Stack.Screen name="profil" options={{ title: 'Mein Profil' }} />
        <Stack.Screen name="einstellungen" options={{ title: 'Einstellungen' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <Root />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
