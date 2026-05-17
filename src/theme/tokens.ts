/**
 * Design tokens for the AOS Ability Tracker.
 * Centralizes colors, spacing, typography, and other design constants.
 */

import type { Phase } from '../types';

// ============================================================
// COLORS
// ============================================================
export const colors = {
  // Backgrounds
  bgPrimary: '#0B1220',
  bgSecondary: '#1a2a3a',
  bgTertiary: '#19243A',
  bgCard: '#E9DFC6',
  bgCardActive: '#2D3E6F',

  // Text on dark surfaces
  textPrimary: '#F8F9FB',
  textSecondary: '#A3B1C2',
  textMuted: '#677793',
  textDim: '#7A8BA4',

  // Text on card (parchment)
  textCardPrimary: '#1B1B1B',
  textCardSecondary: '#2D2A24',
  textCardMuted: '#5A4A2F',

  // Cream text (on dark card headers)
  textCream: '#F5EFE0',
  textCreamMuted: '#E8E8E8',

  // Phase colors (button backgrounds)
  phase: {
    'Deployment Phase': '#2D5F3F',
    'Start of Turn': '#111111',
    'Hero Phase': '#B8974F',
    'Movement Phase': '#7D7D7D',
    'Shooting Phase': '#1E6F8C',
    'Charge Phase': '#B5622A',
    'Combat Phase': '#8B1C1C',
    'End of Turn': '#5D3E84',
  } satisfies Record<Phase, string>,

  // Phase border colors (slightly darker)
  phaseBorder: {
    'Deployment Phase': '#1F4029',
    'Start of Turn': '#333333',
    'Hero Phase': '#A9832F',
    'Movement Phase': '#5F5F5F',
    'Shooting Phase': '#16566E',
    'Charge Phase': '#8F4A1F',
    'Combat Phase': '#621414',
    'End of Turn': '#3F2D5C',
  } satisfies Record<Phase, string>,

  // Phase banner colors (used on ability card headers)
  phaseBanner: {
    'Deployment Phase': '#1F4029',
    'Start of Turn': '#222222',
    'Hero Phase': '#8A6D2A',
    'Movement Phase': '#5E5E5E',
    'Shooting Phase': '#1B6075',
    'Charge Phase': '#9E5424',
    'Combat Phase': '#7C1A1A',
    'End of Turn': '#4F3470',
  } satisfies Record<Phase, string>,

  // Status / semantic
  castingGreen: '#2D8A5B',
  castingAmber: '#D4A138',
  castingRed: '#A53B3B',
  command: '#7B5FA3',
  commandBorder: '#3F2D5C',

  // UI element colors
  buttonBack: '#384B6F',
  buttonKeywords: '#A68B4D',
  buttonReset: '#6F384F',
  buttonComplete: '#2D5F3F',
  buttonCompleteBorder: '#1F4029',

  // Used / status flags
  readyBg: '#3A4A6A',
  usedBg: '#D4C5A9',
  usedText: '#5A4A2F',

  // Dividers
  dividerSubtle: '#A68B4D',

  // Overlays
  overlayDark: 'rgba(0, 0, 0, 0.5)',
};

// ============================================================
// SPACING
// ============================================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// ============================================================
// BORDER RADII
// ============================================================
export const radii = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 12,
  pill: 999,
};

// ============================================================
// TYPOGRAPHY (base sizes - use scaleFont for responsive)
// ============================================================
export const typography = {
  sizes: {
    xs: 9,
    sm: 11,
    base: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    display: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  lineHeights: {
    tight: 18,
    base: 20,
    relaxed: 22,
  },
};

// ============================================================
// SHADOWS
// ============================================================
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  badge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};
