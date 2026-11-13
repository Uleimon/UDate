/**
 * UDate Designsystem – Tokens.
 * Farbwelt: tiefe Beere/Pflaume mit warmem Rosé-Gold. Elegant, warm, nicht grell.
 * Jede Farbe gibt es hell und dunkel. Komponenten nutzen nur diese Tokens, nie feste Farben.
 */
export const palette = {
  berry900: '#2A0F24',
  berry800: '#3D1534',
  berry700: '#5B1F4C',
  berry600: '#7A2A66',
  berry500: '#9C3A83',
  rose400: '#E07A8F',
  rose300: '#F2A3A9',
  gold300: '#E9C39B',
  gold200: '#F4DDC4',
  ink900: '#16121A',
  ink800: '#221C27',
  ink700: '#2E2634',
  ink500: '#6E6475',
  ink300: '#B5ABBA',
  ink100: '#EFE9F1',
  cream50: '#FBF7F4',
  white: '#FFFFFF',
  success: '#3BA57A',
  warning: '#D99A2B',
  danger: '#D2465A',
} as const;

export type ColorTokens = {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  textOnAccent: string;
  accent: string;
  accentSoft: string;
  gradient: [string, string, ...string[]];
  heroGradient: [string, string, ...string[]];
  success: string;
  warning: string;
  danger: string;
};

export const light: ColorTokens = {
  bg: palette.cream50,
  surface: palette.white,
  surfaceRaised: palette.white,
  border: '#E8DFE6',
  text: palette.ink900,
  textMuted: palette.ink500,
  textOnAccent: palette.white,
  accent: palette.berry600,
  accentSoft: '#F5E6EF',
  gradient: [palette.berry600, palette.rose400],
  heroGradient: [palette.berry700, palette.berry500, palette.rose400],
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
};

export const dark: ColorTokens = {
  bg: palette.ink900,
  surface: palette.ink800,
  surfaceRaised: palette.ink700,
  border: '#3A3140',
  text: palette.ink100,
  textMuted: palette.ink300,
  textOnAccent: palette.white,
  accent: palette.rose300,
  accentSoft: '#3A2333',
  gradient: [palette.berry500, palette.rose400],
  heroGradient: [palette.berry900, palette.berry700, palette.berry500],
  success: '#5CC79A',
  warning: '#F0B54E',
  danger: '#F06A7C',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 } as const;

export const type = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
} as const;

export const motion = { fast: 150, normal: 250, slow: 400 } as const;
