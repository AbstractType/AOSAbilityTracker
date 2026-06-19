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
  /** Toggle used/ready — fires on a normal tap (short press). */
  onToggleUsed: () => void;
  /**
   * Open the customization context menu — fires on long-press.
   * Optional: passed-through from the screen. When omitted, long-press is a no-op.
   */
  onLongPress?: () => void;
  /**
   * User's note for this ability (rendered as a "Notes" section below the
   * description). Null/empty/undefined = no section rendered.
   */
  note?: string | null;
  /**
   * True when the user has marked this ability as hidden. The card is only
   * rendered at all when the parent has the Show Hidden toggle on, so this
   * controls the faded "hidden" styling + the small inline badge — it does
   * NOT control visibility itself.
   */
  hidden?: boolean;
  /**
   * True when every unit that is this ability's source has been destroyed —
   * the ability can't be used, so the card is faded with a struck-through name
   * and a "source destroyed" label. Purely a visual marker; the card stays
   * tappable.
   */
  sourceDestroyed?: boolean;
}

/**
 * AbilityCard organism — the full card displaying an ability.
 * Composes: card header, casting/command badges, status badge, source, name,
 * description, keywords, and (when set) a user-written Notes section.
 *
 * Long-press opens a customization context menu instead of toggling used —
 * RN's TouchableOpacity routes `onLongPress` exclusively, so a long-press
 * never accidentally also fires `onPress`.
 */
export default function AbilityCard({
  ability,
  onToggleUsed,
  onLongPress,
  note,
  hidden,
  sourceDestroyed,
}: AbilityCardProps) {
  const { scaleFont, select } = useResponsive();

  const headerLabel = getHeaderLabel(ability);
  const keywords = getDisplayableKeywords(ability);
  const trimmedNote = note?.trim();
  const hasNote = !!trimmedNote;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: colors.phaseBorder[ability.phase] },
        ability.used && styles.cardUsed,
        hidden && styles.cardHidden,
        sourceDestroyed && styles.cardUnusable,
      ]}
      onPress={onToggleUsed}
      onLongPress={onLongPress}
      delayLongPress={400}
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

        {/* Hidden tag — small badge near the top-left so the user knows why
            this card looks faded when Show Hidden is on. */}
        {hidden ? (
          <View style={styles.hiddenTag}>
            <Text style={styles.hiddenTagText}>HIDDEN</Text>
          </View>
        ) : null}

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
          {sourceDestroyed ? (
            <Text style={styles.unusableLabel}>✕ SOURCE DESTROYED — UNUSABLE</Text>
          ) : null}
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
              sourceDestroyed && styles.nameStruck,
            ]}
          >
            {ability.name.toUpperCase()}
          </Text>
          <AbilityDescription description={ability.description} />
          {keywords ? <KeywordsList keywords={keywords} /> : null}

          {/* User note — only rendered when one is set. Visually distinct
              (italic, accent border) so it's obviously user-added not rules text. */}
          {hasNote ? (
            <View style={styles.noteBlock}>
              <Text style={styles.noteLabel}>YOUR NOTES</Text>
              <Text style={styles.noteText}>{trimmedNote}</Text>
            </View>
          ) : null}
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
  cardHidden: {
    // Faded styling when this card is rendered as a "hidden" entry (only
    // happens with the Show Hidden toggle on). Stacks with cardUsed.
    opacity: 0.55,
  },
  cardUnusable: {
    // Faded when the ability's source unit has been destroyed.
    opacity: 0.6,
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
  hiddenTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    zIndex: 5,
  },
  hiddenTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
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
  nameStruck: {
    textDecorationLine: 'line-through',
  },
  unusableLabel: {
    color: '#9E1B1B',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 5,
  },

  // ---- User-written notes section ----
  noteBlock: {
    marginTop: 12,
    paddingTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3F66D6',
    backgroundColor: 'rgba(63, 102, 214, 0.08)',
    paddingBottom: 8,
    paddingRight: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  noteLabel: {
    color: '#3F66D6',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  noteText: {
    color: colors.textCardSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
