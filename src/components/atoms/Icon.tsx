import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

/**
 * Icon atom — renders a unicode glyph as an icon.
 * Common AOS icons: '✦' (ability), '✓' (complete), '←' (back), '✕' (close).
 */
interface IconProps {
  name: '✦' | '✓' | '←' | '✕' | string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 15, color = colors.textCream }: IconProps) {
  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: '900',
  },
});
