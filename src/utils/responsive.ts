import { useWindowDimensions, Platform } from 'react-native';

/**
 * Breakpoints for responsive design
 * - mobile: < 600px (phones, small portrait tablets)
 * - tablet: 600-1024px (tablets, large phones in landscape)
 * - desktop: >= 1024px (PCs, large tablets)
 */
export const BREAKPOINTS = {
  mobile: 600,
  tablet: 1024,
};

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  isLandscape: boolean;
  isPortrait: boolean;
  isWeb: boolean;
  isNative: boolean;
  /** Pick a value based on the current breakpoint. Falls back through desktop -> tablet -> mobile. */
  select: <T>(values: { mobile?: T; tablet?: T; desktop?: T; default: T }) => T;
  /** Scale a base size proportionally, clamped to reasonable min/max */
  scale: (size: number) => number;
  /** Scale a font size with a gentler ramp (so text doesn't get tiny or huge) */
  scaleFont: (size: number) => number;
}

/**
 * Hook that returns reactive responsive information for the current viewport.
 * Use in any component that needs to adapt to screen size.
 */
export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;

  const deviceType: DeviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  const isLandscape = width > height;
  const isPortrait = !isLandscape;

  const isWeb = Platform.OS === 'web';
  const isNative = !isWeb;

  function select<T>(values: { mobile?: T; tablet?: T; desktop?: T; default: T }): T {
    if (isDesktop && values.desktop !== undefined) return values.desktop;
    if (isTablet && values.tablet !== undefined) return values.tablet;
    if (isMobile && values.mobile !== undefined) return values.mobile;
    return values.default;
  }

  // Base width for proportional scaling (designed for ~390px iPhone)
  const baseWidth = 390;
  const ratio = width / baseWidth;

  function scale(size: number): number {
    // Clamp between 0.85x and 1.6x of base to avoid extreme scaling
    const factor = Math.max(0.85, Math.min(1.6, ratio));
    return Math.round(size * factor);
  }

  function scaleFont(size: number): number {
    // Gentler scale for fonts: only scale 50% of the ratio difference
    const factor = 1 + (Math.max(0.85, Math.min(1.5, ratio)) - 1) * 0.5;
    return Math.round(size * factor);
  }

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    isLandscape,
    isPortrait,
    isWeb,
    isNative,
    select,
    scale,
    scaleFont,
  };
}

/**
 * Returns the maximum content width to use for a centered layout.
 * Uses more screen real-estate on larger displays while keeping a sensible cap on ultra-wide.
 *
 * Tuning rationale:
 * - Mobile: full width — no constraint.
 * - Small tablets / large phones (≥600): 720 to keep prose readable.
 * - Small desktops / large tablets (≥1024): up to 1100 with a small viewport margin.
 * - Standard desktops (≥1280): up to 1400.
 * - Wide desktops (≥1600): cap at 1700.
 * - Ultra-wide (≥1920): cap at 1900 — beyond this gaps would look excessive.
 */
export function getContentMaxWidth(width: number): number {
  if (width >= 1920) return 1900;
  if (width >= 1600) return 1700;
  if (width >= 1280) return 1400;
  if (width >= BREAKPOINTS.tablet) return Math.min(width - 64, 1100);
  if (width >= BREAKPOINTS.mobile) return 720;
  return width;
}

/**
 * Returns how many columns of ability cards to show side-by-side based on viewport width.
 * Cards need enough room to remain readable — minimum ~480px per card.
 *
 * - <1280: 1 column (cards full width)
 * - 1280–1799: 2 columns
 * - ≥1800: 3 columns
 */
export function getCardColumns(width: number): number {
  if (width >= 1800) return 3;
  if (width >= 1280) return 2;
  return 1;
}
