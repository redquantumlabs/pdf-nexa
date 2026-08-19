export const COLORS = {
  light: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    primary: '#0066CC',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    card: '#FFFFFF',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    primary: '#0A84FF',
    text: '#FFFFFF',
    textSecondary: '#EBEBF599',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    card: '#1C1C1E',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body1: { fontSize: 16, fontWeight: '400' as const },
  body2: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};
