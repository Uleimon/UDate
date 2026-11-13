import { useColorScheme } from 'react-native';
import { dark, light, type ColorTokens } from './tokens';

export function useTheme(): { c: ColorTokens; isDark: boolean } {
  const isDark = useColorScheme() === 'dark';
  return { c: isDark ? dark : light, isDark };
}
