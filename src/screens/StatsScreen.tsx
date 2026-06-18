import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { SavedArmy } from '../types/army';
import { getUsageStats, type UsageStats } from '../utils/stats';
import { colors, radii } from '../theme/tokens';
import { useResponsive, getContentMaxWidth } from '../utils/responsive';

interface StatsScreenProps {
  /** The user's saved armies — used to find abilities fielded but never used. */
  savedArmies: SavedArmy[];
  onBack: () => void;
}

const TOP_N = 12;

/**
 * StatsScreen — war-room usage analytics across all your games: most-used
 * abilities and abilities you field but have never used. (Time-per-phase is
 * intentionally not here yet — it needs a turn/phase clock the room doesn't
 * have.)
 */
export default function StatsScreen({ savedArmies, onBack }: StatsScreenProps) {
  const { width, select } = useResponsive();
  const contentMaxWidth = Math.min(getContentMaxWidth(width), 720);
  const padding = select({ mobile: 16, default: 24 });

  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getUsageStats(savedArmies).then((s) => {
      if (cancelled) return;
      setStats(s);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [savedArmies]);

  const topUsed = stats?.mostUsed.slice(0, TOP_N) ?? [];
  const neverUsed = stats?.neverUsed ?? [];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { maxWidth: contentMaxWidth, paddingHorizontal: padding },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Your Stats</Text>
          <TouchableOpacity onPress={onBack} accessibilityLabel="Close stats">
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subhead}>War-room ability usage across all your games.</Text>

        {loading ? (
          <Text style={styles.dim}>Loading…</Text>
        ) : (
          <>
            {/* Games played */}
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats?.gamesPlayed ?? 0}</Text>
              <Text style={styles.statLabel}>
                war room{(stats?.gamesPlayed ?? 0) === 1 ? '' : 's'} played
              </Text>
            </View>

            {/* Most used */}
            <Text style={styles.sectionTitle}>Most-used abilities</Text>
            {topUsed.length === 0 ? (
              <Text style={styles.dim}>
                No ability usage recorded yet. Mark abilities used in a war room and they'll show up here.
              </Text>
            ) : (
              topUsed.map((a, i) => (
                <View key={a.abilityKey} style={styles.row}>
                  <Text style={styles.rank}>{i + 1}</Text>
                  <View style={styles.rowText}>
                    <Text style={styles.abilityName} numberOfLines={1}>
                      {a.name}
                    </Text>
                    {a.source ? (
                      <Text style={styles.abilitySource} numberOfLines={1}>
                        {a.source}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.countBadge}>
                    {a.count} game{a.count === 1 ? '' : 's'}
                  </Text>
                </View>
              ))
            )}

            {/* Never used */}
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Never used</Text>
            <Text style={styles.sectionHint}>
              Abilities in your saved armies you've never marked used in a game.
            </Text>
            {neverUsed.length === 0 ? (
              <Text style={styles.dim}>
                {savedArmies.length === 0
                  ? 'Save an army to your account to see which of its abilities go unused.'
                  : "You've used everything in your saved armies — nice."}
              </Text>
            ) : (
              neverUsed.map((a) => (
                <View key={a.abilityKey} style={[styles.row, styles.rowMuted]}>
                  <View style={styles.rowText}>
                    <Text style={styles.abilityNameMuted} numberOfLines={1}>
                      {a.name}
                    </Text>
                    {a.source ? (
                      <Text style={styles.abilitySource} numberOfLines={1}>
                        {a.source}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 20,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 24,
    fontWeight: '700',
  },
  subhead: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  dim: {
    color: colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  statCard: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  statNumber: {
    color: '#5BA9FF',
    fontSize: 36,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionHint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  rowMuted: {
    opacity: 0.75,
  },
  rank: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '800',
    width: 20,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  abilityName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  abilityNameMuted: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  abilitySource: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 1,
  },
  countBadge: {
    color: '#9DBDFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
