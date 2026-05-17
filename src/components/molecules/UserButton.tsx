import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import type { User } from '../../types/user';

interface UserButtonProps {
  user: User | null;
  onPress: () => void;
  /** Use compact (header-sized) padding to match other header buttons */
  compact?: boolean;
}

/**
 * UserButton molecule — header-button that doubles as the login entrypoint and
 * the signed-in user indicator. When no user is signed in, it shows "Sign In".
 * When signed in, it shows a circular avatar with the user's email initial.
 * Tapping it opens the global LoginModal (handled by the parent).
 */
export default function UserButton({ user, onPress, compact = false }: UserButtonProps) {
  const { scaleFont, select } = useResponsive();

  const fontSize = scaleFont(
    compact ? select({ mobile: 12, default: 14 }) : select({ mobile: 14, default: 16 })
  );
  const paddingVertical = compact ? select({ mobile: 6, default: 8 }) : 12;
  const paddingHorizontal = compact ? select({ mobile: 10, default: 12 }) : 16;

  if (user) {
    // Signed-in: compact avatar pill showing the first letter of the email
    const initial = user.email.charAt(0).toUpperCase();
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityLabel={`Account: ${user.email}`}
        style={[styles.signedInButton, { paddingVertical, paddingHorizontal: paddingHorizontal - 4 }]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Signed-out: a labeled button matching the other header buttons
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="Sign in"
      style={[
        styles.signInButton,
        { paddingVertical, paddingHorizontal },
      ]}
    >
      <Text style={[styles.signInText, { fontSize }]}>Sign In</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  signInButton: {
    backgroundColor: '#3F66D6',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  signedInButton: {
    backgroundColor: 'transparent',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.command,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#22324A',
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
});
