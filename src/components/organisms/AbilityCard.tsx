import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Ability } from '../../types';
import AbilityCardHeader from '../molecules/AbilityCardHeader';
import AbilityDescription from '../molecules/AbilityDescription';
import KeywordsList from '../molecules/KeywordsList';
import Badge, { getCastingBadgeVariant } from '../atoms/Badge';
import { colors, radii, shadows } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import { universalKeywords } from '../../data/universalKeywords';

interface AbilityCardProps {
  ability: Ability;
  onToggleUsed: () => void;
}

/**
 * AbilityCard organism — the full card displaying an ability.
 * Composes: card header, casting/command badges, status badge, source, name, description, keywords.
 */
export default function AbilityCard({ ability, onToggleUsed }: AbilityCardProps) {
  const { scaleFont, select } = useResponsive();

  const headerLabel = getHeaderLabel(ability);
  const keywords = getDisplayableKeywords(ability);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: colors.phaseBorder[ability.phase] },
        ability.used && styles.cardUsed,
      ]}
      onPress={onToggleUsed}
      activeOpacity={0.85}
    >
      <View style={styles.wrapper}>
        <AbilityCardHeader phase={ability.phase} label={headerLabel} />

        {/* Casting value badge (top-right cutout) */}
        {ability.castingValue !== undefined && (
          <Badge
            label="Casting"
            value={ability.castingValue}
            variant={getCastingBadgeVariant(ability.castingValue)}
            cornerCutout
          />
        )}

        {/* Command cost badge (top-right cutout) */}
        {ability.commandCost !== undefined && (
          <Badge
            label="Command"
            value={ability.commandCost}
            variant="command"
            cornerCutout
          />
        )}

        {/* Status badge (Ready / Used) - vertically centered on right */}
        <View style={[styles.statusBadgeWrapper, ability.isSpell && styles.statusBadgeSpell]}>
          <Badge
            value={ability.used ? 'Used' : 'Ready'}
            variant={ability.used ? 'used' : 'ready'}
          />
        </View>

        {/* Card body */}
        <View
          style={[
            styles.body,
            {
              paddingVertical: select({ mobile: 12, default: 14 }),
              paddingHorizontal: select({ mobile: 12, default: 14 }),
            },
          ]}
        >
          {ability.source ? (
            <Text
              style={[
                styles.source,
                { fontSize: scaleFont(select({ mobile: 11, default: 12 })) },
              ]}
            >
              {ability.source}
            </Text>
          ) : null}
          <Text
            style={[
              styles.name,
              {
                fontSize: scaleFont(select({ mobile: 16, default: 18 })),
                paddingRight: select({ mobile: 60, default: 80 }),
              },
            ]}
          >
            {ability.name.toUpperCase()}
          </Text>
          <AbilityDescription description={ability.description} />
          {keywords ? <KeywordsList keywords={keywords} /> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Determines the header label for an ability card.
 * Spells show "Your Hero Phase", passives show "Passive", others show their timing or phase.
 */
function getHeaderLabel(ability: Ability): string {
  if (ability.isSpell) return 'Your Hero Phase';
  if (ability.isPassive) return 'Passive';
  return ability.timing || ability.phase;
}

/**
 * Filters out universal keywords (already shown in modal) from an ability's keyword list.
 */
function getDisplayableKeywords(ability: Ability): string {
  if (!ability.keyword || ability.keyword.toLowerCase() === 'passive' || ability.keyword.toLowerCase() === 'activated') {
    return '';
  }

  const keywords = new Set<string>();
  const universalKeywordNames = universalKeywords.map(k => k.name.toLowerCase());
  const rawKeywords = ability.keyword.split(',').map(k => k.trim()).filter(k => k.length > 0);

  rawKeywords.forEach(k => {
    if (k && k.toLowerCase() !== 'passive' && k.toLowerCase() !== 'activated') {
      const baseKeyword = k.replace(/\*\*/g, '').toLowerCase();
      const isUniversal = universalKeywordNames.includes(baseKeyword);
      if (!isUniversal) {
        keywords.add(k);
      }
    }
  });

  return Array.from(keywords).join(', ');
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    // In a masonry column the card takes its natural height — no flex/stretch needed.
    // alignSelf ensures the card spans the column width when its content is shorter.
    alignSelf: 'stretch',
    ...shadows.card,
  },
  cardUsed: {
    opacity: 0.5,
  },
  wrapper: {
    position: 'relative',
  },
  statusBadgeWrapper: {
    position: 'absolute',
    top: '50%',
    right: 12,
    transform: [{ translateY: 16 }],
    zIndex: 5,
  },
  statusBadgeSpell: {
    transform: [{ translateY: 32 }],
  },
  body: {
    backgroundColor: colors.bgCard,
  },
  source: {
    color: colors.textCardMuted,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  name: {
    fontWeight: '900',
    color: colors.textCardPrimary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
