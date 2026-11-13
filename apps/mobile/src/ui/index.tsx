import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import type { AndroidSymbol } from 'expo-symbols';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text as RNText,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space, type as typeScale } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

// ---------------------------------------------------------------- Text

type Variant = keyof typeof typeScale;
export function Text({
  variant = 'body',
  muted,
  color,
  center,
  style,
  children,
}: {
  variant?: Variant;
  muted?: boolean;
  color?: string;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}) {
  const { c } = useTheme();
  return (
    <RNText style={[typeScale[variant], { color: color ?? (muted ? c.textMuted : c.text) }, center && { textAlign: 'center' }, style]}>
      {children}
    </RNText>
  );
}

// ---------------------------------------------------------------- Icon (Material Symbols auf Android)

export function Icon({ name, size = 22, color }: { name: AndroidSymbol; size?: number; color?: string }) {
  const { c } = useTheme();
  return <SymbolView name={{ android: name, web: name }} size={size} tintColor={color ?? c.text} />;
}

// ---------------------------------------------------------------- Screen

export function Screen({ children, scroll = true, padded = true, tabs = false }: { children: ReactNode; scroll?: boolean; padded?: boolean; tabs?: boolean }) {
  const { c } = useTheme();
  // Im Web liegt die Tab-Leiste oben über dem Inhalt (nur Vorschau). Auf Android ist sie unten.
  const top = tabs && Platform.OS === 'web' ? 72 : 0;
  const inner = <View style={{ padding: padded ? space.lg : 0, paddingTop: (padded ? space.lg : 0) + top, gap: space.lg, paddingBottom: space.xxxl }}>{children}</View>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top', 'left', 'right']}>
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled">{inner}</ScrollView> : inner}
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------- Button

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'danger';
export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: ButtonKind;
  icon?: AndroidSymbol;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const fg = kind === 'primary' || kind === 'danger' ? c.textOnAccent : kind === 'secondary' ? c.accent : c.textMuted;
  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, minHeight: 52, paddingHorizontal: space.xl }}>
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} color={fg} size={20} /> : null}
      <Text variant="label" color={fg} style={{ fontSize: 16 }}>
        {title}
      </Text>
    </View>
  );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        { borderRadius: radius.pill, overflow: 'hidden', opacity: disabled ? 0.45 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        kind === 'secondary' && { borderWidth: 1.5, borderColor: c.accent },
        kind === 'danger' && { backgroundColor: c.danger },
        style,
      ]}
    >
      {kind === 'primary' ? (
        <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------- Card

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { c, isDark } = useTheme();
  const base: ViewStyle = {
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.sm,
    borderWidth: isDark ? 1 : 0,
    borderColor: c.border,
    shadowColor: '#3D1534',
    shadowOpacity: isDark ? 0 : 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: isDark ? 0 : 3,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.9 : 1 }, style]}>
      {children}
    </Pressable>
  );
}

/** Großer Kopfbereich mit Farbverlauf. */
export function Hero({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  const { c } = useTheme();
  return (
    <LinearGradient colors={c.heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.xl, padding: space.xl, gap: space.sm }}>
      <Text variant="display" color="#fff">
        {title}
      </Text>
      {subtitle ? (
        <Text color="rgba(255,255,255,0.85)">{subtitle}</Text>
      ) : null}
      {children}
    </LinearGradient>
  );
}

// ---------------------------------------------------------------- Chip (Mehrfachauswahl)

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={{
        paddingHorizontal: space.lg,
        paddingVertical: space.sm + 2,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: selected ? c.accent : c.border,
        backgroundColor: selected ? c.accentSoft : c.surface,
      }}
    >
      <Text variant="label" color={selected ? c.accent : c.text}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ChipGroup<K extends string>({
  options,
  selected,
  onChange,
  single,
}: {
  options: Record<K, string>;
  selected: K[];
  onChange: (next: K[]) => void;
  single?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
      {(Object.keys(options) as K[]).map((k) => (
        <Chip
          key={k}
          label={options[k]}
          selected={selected.includes(k)}
          onPress={() => {
            if (single) onChange([k]);
            else onChange(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
          }}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------- Formular

export function Field({ label, hint, error, ...input }: TextInputProps & { label: string; hint?: string; error?: string | null }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="label">{label}</Text>
      <TextInput
        placeholderTextColor={c.textMuted}
        {...input}
        style={[
          typeScale.body,
          {
            color: c.text,
            backgroundColor: c.surface,
            borderWidth: 1.5,
            borderColor: error ? c.danger : c.border,
            borderRadius: radius.md,
            paddingHorizontal: space.lg,
            paddingVertical: space.md,
            minHeight: 50,
          },
          input.multiline && { minHeight: 100, textAlignVertical: 'top' },
        ]}
      />
      {error ? (
        <Text variant="caption" color={c.danger}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" muted>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/** Zahl mit − / + (Altersbereich, Radius). */
export function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  const { c } = useTheme();
  const btn = (sym: AndroidSymbol, delta: number, disabled: boolean, a11y: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      disabled={disabled}
      onPress={() => onChange(Math.min(max, Math.max(min, value + delta)))}
      style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.accentSoft, opacity: disabled ? 0.4 : 1 }}
    >
      <Icon name={sym} color={c.accent} />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text variant="label">{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        {btn('remove', -step, value <= min, `${label} verringern`)}
        <Text variant="heading" style={{ minWidth: 64, textAlign: 'center' }}>
          {value}
          {unit}
        </Text>
        {btn('add', step, value >= max, `${label} erhöhen`)}
      </View>
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const { c } = useTheme();
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: c.accentSoft, overflow: 'hidden' }}>
      <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, height: '100%' }} />
    </View>
  );
}

// ---------------------------------------------------------------- Zustände

export function EmptyState({ icon, title, text, children }: { icon: AndroidSymbol; title: string; text: string; children?: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={34} color={c.accent} />
      </View>
      <Text variant="heading" center>
        {title}
      </Text>
      <Text muted center>
        {text}
      </Text>
      {children}
    </View>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warning'; children: ReactNode }) {
  const { c } = useTheme();
  const color = tone === 'warning' ? c.warning : c.accent;
  return (
    <View style={{ flexDirection: 'row', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: c.accentSoft, alignItems: 'flex-start' }}>
      <Icon name={tone === 'warning' ? 'warning' : 'info'} size={20} color={color} />
      <View style={{ flex: 1 }}>
        <Text variant="caption">{children}</Text>
      </View>
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: space.md }, style]}>{children}</View>;
}
