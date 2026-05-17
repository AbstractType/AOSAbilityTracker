import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

interface DividerProps {
  /** Padding on the right side (useful when divider is in a card with badges on the right) */
  rightInset?: number;
  /** Custom color (defaults to subtle gold) */
  color?: string;
  /** Margin around the divider */
  marginVertical?: number;
  /** Opacity of the divider */
  opacity?: number;
}

/**
 * Divider atom — a thin horizontal separator line.
 * Used between sections of an ability card (e.g., Declare/Effect).
 */
export default function Divider({
  rightInset = 0,
  color = colors.dividerSubtle,
  marginVertical = 10,
  opacity = 0.3,
}: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          opacity,
          marginVertical,
          marginRight: rightInset,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});
