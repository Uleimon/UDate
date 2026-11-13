import Constants from 'expo-constants';

/**
 * Adresse des UDate-Servers. Kommt aus app.json → expo.extra.apiUrl (beim Build setzen).
 * Leer = noch kein Server eingerichtet. Die App zeigt das dann offen an, statt etwas vorzutäuschen.
 */
export const API_URL: string | null = ((Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ?? '').trim() || null;
