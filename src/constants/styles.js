// Константы для отступов (аналогично mobile_client)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Константы для размеров шрифтов
export const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  xxlarge: 24,
  xxxlarge: 28,
};

// Цвета (следуя стилю mobile_client)
export const COLORS = {
  primary: '#FC094C',
  secondary: '#03dac6',
  error: '#b00020',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#000000',
  muted: '#666666',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  border: '#e0e0e0',
};

// Общие стили для компонентов
export const COMMON_STYLES = {
  container: {
    padding: SPACING.lg,
  },
  
  card: {
    padding: SPACING.lg,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  
  header: {
    marginBottom: SPACING.xl,
  },
  
  section: {
    marginBottom: SPACING.lg,
  },
};
