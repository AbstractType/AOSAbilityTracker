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
import type { User } from '../../types/user';

interface LandingTemplateProps {
  jsonInput: string;
  loading: boolean;
  onJsonInputChange: (text: string) => void;
  onLoadJson: () => void;
  onLoadExample: () => void;
  /** Current signed-in user (drives the header user button) */
  user: User | null;
  /** Open the global login modal */
  onOpenLogin: () => void;
}

/**
 * LandingTemplate — page layout for the JSON input/landing screen.
 * Centered, max-width content with responsive padding and button layouts.
 */
export default function LandingTemplate({
  jsonInput,
  loading,
  onJsonInputChange,
  onLoadJson,
  onLoadExample,
  user,
  onOpenLogin,
}: LandingTemplateProps) {
  const responsive = useResponsive();
  const { width, scaleFont, select } = responsive;
  const contentMaxWidth = getContentMaxWidth(width);

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
              Paste your BattleScribe roster JSON to load abilities and track their usage.
            </Text>
          </View>

          <View style={styles.content}>
            <Text
              style={[
                styles.label,
                { fontSize: scaleFont(select({ mobile: 15, default: 16 })) },
              ]}
            >
              Paste Roster JSON
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  minHeight: select({ mobile: 140, tablet: 180, default: 220 }),
                  fontSize: scaleFont(select({ mobile: 13, default: 14 })),
                },
              ]}
              placeholder="Paste your JSON here..."
              placeholderTextColor="#888"
              value={jsonInput}
              onChangeText={onJsonInputChange}
              multiline
              editable={!loading}
            />

            <View
              style={[
                styles.buttonRow,
                {
                  flexDirection: select({ mobile: 'column', default: 'row' }) as
                    | 'row'
                    | 'column',
                },
              ]}
            >
              <Button
                label={loading ? 'Loading...' : 'Load Abilities'}
                onPress={onLoadJson}
                disabled={loading}
                variant="primary"
                style={[
                  styles.button,
                  {
                    flex: select({ mobile: undefined, default: 1 }) as any,
                    width: select({ mobile: '100%' as any, default: undefined }),
                  },
                ]}
              />
              <Button
                label="Load Example"
                onPress={onLoadExample}
                disabled={loading}
                variant="secondary"
                style={[
                  styles.button,
                  {
                    flex: select({ mobile: undefined, default: 1 }) as any,
                    width: select({ mobile: '100%' as any, default: undefined }),
                  },
                ]}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>How to use:</Text>
              <Text style={styles.infoText}>
                1. Export your army list as JSON from BattleScribe
              </Text>
              <Text style={styles.infoText}>2. Copy and paste the entire JSON file above</Text>
              <Text style={styles.infoText}>
                3. Click "Load Abilities" to extract your army's abilities
              </Text>
              <Text style={styles.infoText}>4. Track ability usage during your game</Text>
            </View>

            <View style={styles.supportedBox}>
              <Text style={styles.supportedTitle}>Supported Phases:</Text>
              <Text style={styles.supportedText}>
                Deployment Phase, Start of Turn, Hero Phase, Movement Phase, Shooting Phase,
                Charge Phase, Combat Phase, End of Turn
              </Text>
            </View>
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
    marginBottom: 32,
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
  input: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    padding: 12,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  buttonRow: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    minWidth: 0,
  },
  infoBox: {
    backgroundColor: '#15203A',
    borderRadius: radii.md,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 15,
  },
  infoText: {
    color: '#C8D5E8',
    marginBottom: 4,
    fontSize: 14,
  },
  supportedBox: {
    backgroundColor: '#15203A',
    borderRadius: radii.md,
    padding: 16,
  },
  supportedTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 15,
  },
  supportedText: {
    color: '#C8D5E8',
    fontSize: 14,
    lineHeight: 21,
  },
});
