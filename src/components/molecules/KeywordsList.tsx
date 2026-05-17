import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormattedText from '../atoms/FormattedText';
import { useResponsive } from '../../utils/responsive';

interface KeywordsListProps {
  /** Comma-separated keywords string */
  keywords: string;
}

/**
 * KeywordsList molecule — displays a labeled list of keywords.
 * Used at the bottom of ability cards.
 */
export default function KeywordsList({ keywords }: KeywordsListProps) {
  const { scaleFont } = useResponsive();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize: scaleFont(11) }]}>Keywords</Text>
      <FormattedText
        text={keywords}
        style={[styles.value, { fontSize: scaleFont(13) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  label: {
    backgroundColor: '#A68B4D',
    color: '#2D2A24',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  value: {
    color: '#2D2A24',
    fontWeight: '600',
  },
});
