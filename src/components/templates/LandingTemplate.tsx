import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Button from '../atoms/Button';
import UserButton from '../molecules/UserButton';
import { colors, radii } from '../../theme/tokens';
import { useResponsive, getContentMaxWidth } from '../../utils/responsive';
import { useJsonFileInput } from '../../lib/jsonFileInput';
import type { User } from '../../types/user';

interface LandingTemplateProps {
  jsonInput: string;
  loading: boolean;
  /** Inline message shown when input was provided but isn't a valid roster. */
  loadHint: string | null;
  onJsonInputChange: (text: string) => void;
  /** Load explicit roster text (from a dropped or browsed file). */
  onLoadFromText: (text: string) => void;
  onLoadExample: () => void;
  /** Current signed-in user (drives the header user button) */
  user: User | null;
  /** Open the global login modal */
  onOpenLogin: () => void;
}

const ACCENT = '#3F66D6';

/** Capabilities advertised on the landing page, in display order. */
const FEATURES: { glyph: string; title: string; blurb: string }[] = [
  {
    glyph: '⚔️',
    title: 'Live War Room',
    blurb:
      'Challenge a friend by username, link, or email. Both armies side by side, abilities synced live, with a shared turn & phase clock.',
  },
  {
    glyph: '👤',
    title: 'Accounts & saved lists',
    blurb: 'Sign in and keep up to three army lists ready to load in a tap.',
  },
  {
    glyph: '📊',
    title: 'Usage stats',
    blurb: 'See your most- and least-used abilities, plus the time you spend in each phase.',
  },
  {
    glyph: '✏️',
    title: 'Make it yours',
    blurb: "Add notes, hide abilities you don't need, and drag-reorder cards per phase.",
  },
  {
    glyph: '🔍',
    title: 'Fast search',
    blurb: 'Filter abilities by name or keyword in the middle of a game.',
  },
  {
    glyph: '📱',
    title: 'Installable',
    blurb: 'Add it to your home screen and keep tracking even when you go offline.',
  },
];

/**
 * LandingTemplate — page layout for the JSON input/landing screen.
 *
 * Two jobs: get a roster in (drag-and-drop a file, browse for one, or paste),
 * and show off what the app can do once it's loaded. Centered, max-width
 * content with responsive padding and a reflowing feature-card grid.
 */
export default function LandingTemplate({
  jsonInput,
  loading,
  loadHint,
  onJsonInputChange,
  onLoadFromText,
  onLoadExample,
  user,
  onOpenLogin,
}: LandingTemplateProps) {
  const responsive = useResponsive();
  const { width, scaleFont, select } = responsive;
  const contentMaxWidth = getContentMaxWidth(width);

  const { dropRef, dragActive, openFilePicker, isWeb } = useJsonFileInput(onLoadFromText);

  const cardWidth = select({ mobile: '100%', tablet: '48%', default: '31.5%' }) as any;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { padding: select({ mobile: 16, tablet: 24, default: 32 }) },
        ]}
      >
        <View style={[styles.wrapper, { maxWidth: contentMaxWidth }]}>
          {/* Top action row — aligned with the rest of the centered content
              (instead of being absolutely positioned in the viewport corner) so
              the Sign In / user button reads as part of the page composition. */}
          <View style={styles.topActions}>
            <UserButton user={user} onPress={onOpenLogin} compact />
          </View>

          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { fontSize: scaleFont(select({ mobile: 26, tablet: 30, default: 36 })) },
              ]}
            >
              AOS Ability Tracker
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: scaleFont(select({ mobile: 14, default: 16 })),
                  lineHeight: scaleFont(select({ mobile: 20, default: 24 })),
                },
              ]}
            >
              Track every ability, every phase — solo or live against an opponent.
            </Text>
          </View>

          <View style={styles.content}>
            <Text
              style={[
                styles.label,
                { fontSize: scaleFont(select({ mobile: 15, default: 16 })) },
              ]}
            >
              Load your roster
            </Text>

            {/* Drop zone: drag a file anywhere onto this dashed box (web), or
                paste into the field. The whole box highlights while a file is
                dragged over it. */}
            <View
              ref={dropRef}
              style={[styles.dropZone, dragActive && styles.dropZoneActive]}
            >
              <Text style={[styles.dropHint, dragActive && styles.dropHintActive]}>
                {dragActive
                  ? 'Drop your roster file to load'
                  : isWeb
                  ? '⬇  Drag a roster .json here, paste it, or Browse — it loads automatically'
                  : 'Paste your roster JSON — it loads automatically'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    minHeight: select({ mobile: 130, tablet: 170, default: 200 }),
                    fontSize: scaleFont(select({ mobile: 13, default: 14 })),
                  },
                ]}
                placeholder="Paste your BattleScribe roster JSON here..."
                placeholderTextColor="#6C7A90"
                value={jsonInput}
                onChangeText={onJsonInputChange}
                multiline
                editable={!loading}
              />
              <View style={styles.miniActions}>
                {isWeb && (
                  <Button
                    label="Browse file"
                    onPress={openFilePicker}
                    disabled={loading}
                    variant="secondary"
                    compact
                  />
                )}
                <Button
                  label="Load Example"
                  onPress={onLoadExample}
                  disabled={loading}
                  variant="secondary"
                  compact
                />
              </View>
            </View>

            {loadHint ? <Text style={styles.loadHint}>{loadHint}</Text> : null}

            {/* Feature showcase — reflows 1 / 2 / 3 columns by breakpoint. */}
            <Text
              style={[
                styles.sectionHeading,
                { fontSize: scaleFont(select({ mobile: 17, default: 20 })) },
              ]}
            >
              What's inside
            </Text>
            <View style={styles.featureGrid}>
              {FEATURES.map((f) => (
                <View key={f.title} style={[styles.featureCard, { width: cardWidth }]}>
                  <Text style={styles.featureGlyph}>{f.glyph}</Text>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureBlurb}>{f.blurb}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.supportedText}>
              Supported phases: Deployment, Start of Turn, Hero, Movement, Shooting, Charge,
              Combat, End of Turn.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  wrapper: {
    width: '100%',
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    color: '#E9F0FF',
    marginBottom: 8,
  },
  dropZone: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: '#22324A',
    borderStyle: 'dashed',
    padding: 12,
    marginBottom: 16,
  },
  dropZoneActive: {
    borderColor: ACCENT,
    backgroundColor: '#142146',
  },
  dropHint: {
    color: '#8FA1BC',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  dropHintActive: {
    color: '#AFC4FF',
  },
  input: {
    color: colors.textPrimary,
    textAlignVertical: 'top',
    padding: 0,
  },
  miniActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  loadHint: {
    color: '#E6B566',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginTop: -4,
    marginBottom: 4,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 12,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#15203A',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#1E2C49',
    padding: 16,
  },
  featureGlyph: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  featureBlurb: {
    color: '#C8D5E8',
    fontSize: 13,
    lineHeight: 19,
  },
  supportedText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
