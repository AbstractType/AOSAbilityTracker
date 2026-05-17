import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

export type ButtonVariant =
  | 'back'
  | 'keywords'
  | 'reset'
  | 'complete'
  | 'primary'
  | 'secondary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** Use compact (header-sized) padding */
  compact?: boolean;
}

/**
 * Button atom — touchable button with variants matched to app theme.
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  compact = false,
}: ButtonProps) {
  const { scaleFont, select } = useResponsive();

  const variantStyles = VARIANT_STYLES[variant];
  const fontSize = scaleFont(
    compact ? select({ mobile: 12, default: 14 }) : select({ mobile: 14, default: 16 })
  );
  const paddingVertical = compact
    ? select({ mobile: 6, default: 8 })
    : select({ mobile: 12, default: 14 });
  const paddingHorizontal = compact
    ? select({ mobile: 10, default: 12 })
    : select({ mobile: 14, default: 18 });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        variantStyles.container,
        { paddingVertical, paddingHorizontal },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, variantStyles.text, { fontSize }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  back: {
    container: { backgroundColor: colors.buttonBack },
    text: { color: colors.textPrimary },
  },
  keywords: {
    container: { backgroundColor: colors.buttonKeywords },
    text: { color: colors.textCardSecondary },
  },
  reset: {
    container: { backgroundColor: colors.buttonReset },
    text: { color: colors.textPrimary },
  },
  complete: {
    container: {
      backgroundColor: colors.buttonComplete,
      borderWidth: 1,
      borderColor: colors.buttonCompleteBorder,
    },
    text: { color: colors.textPrimary },
  },
  primary: {
    container: { backgroundColor: '#3F66D6' },
    text: { color: colors.textPrimary },
  },
  secondary: {
    container: { backgroundColor: '#4C5775' },
    text: { color: colors.textPrimary },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
