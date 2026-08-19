import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  iconName?: string;
  rightComponent?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({ title, subtitle, iconName, rightComponent }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.headerContainer, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          {iconName && <Icon name={iconName} size={26} color={colors.primary} style={styles.icon} />}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    // Add subtle shadow to separate from content
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    marginTop: SPACING.xs,
  },
});
