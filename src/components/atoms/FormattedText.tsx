import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { parseBold } from '../../utils/textFormatter';
import { colors } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

interface FormattedTextProps {
  /** Raw text containing **bold** and *italic* markdown markers */
  text: string;
  /** Base text style */
  style?: StyleProp<TextStyle>;
  /** Override for bold parts */
  boldStyle?: StyleProp<TextStyle>;
  /** Override for italic parts */
  italicStyle?: StyleProp<TextStyle>;
}

/**
 * FormattedText atom — renders text with markdown bold (**) and italic (*) formatting.
 * Automatically handles HTML `<b>` tags and strips out `^^` emphasis markers from BattleScribe JSON.
 */
export default function FormattedText({
  text,
  style,
  boldStyle,
  italicStyle,
}: FormattedTextProps) {
  const { scaleFont, select } = useResponsive();
  const baseSize = scaleFont(select({ mobile: 13, default: 14 }));
  const lineHeight = scaleFont(select({ mobile: 19, default: 21 }));

  return (
    <Text
      style={[
        styles.base,
        { fontSize: baseSize, lineHeight },
        style,
      ]}
    >
      {parseBold(text)
        .filter(part => part.text.length > 0)
        .map((part, index) => {
          if (part.bold) {
            return (
              <Text
                key={index}
                style={[
                  styles.bold,
                  { fontSize: baseSize, lineHeight },
                  boldStyle,
                ]}
              >
                {part.text}
              </Text>
            );
          }
          if (part.italic) {
            return (
              <Text
                key={index}
                style={[
                  styles.italic,
                  { fontSize: baseSize, lineHeight },
                  italicStyle,
                ]}
              >
                {part.text}
              </Text>
            );
          }
          return part.text;
        })}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.textCardSecondary,
  },
  bold: {
    color: colors.textCardPrimary,
    fontWeight: 'bold',
  },
  italic: {
    color: colors.textCardSecondary,
    fontStyle: 'italic',
  },
});
