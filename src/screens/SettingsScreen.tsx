import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer } from '../components/ScreenContainer';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

export const SettingsScreen = () => {
  const { colors, themeType, setThemeType } = useTheme();
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);

  const ThemeOption = ({ label, value, isLast = false }: { label: string, value: ThemeType, isLast?: boolean }) => {
    const isSelected = themeType === value;
    return (
      <TouchableOpacity 
        style={[styles.subOptionRow, !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]} 
        onPress={() => setThemeType(value)}
      >
        <Text style={[styles.optionText, { color: colors.text }]}>{label}</Text>
        {isSelected && <Icon name="check" size={20} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <PageHeader title="Settings" iconName="settings" />
      <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
        
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 0 }]}>APPEARANCE</Text>
        <Card style={styles.cardContainer}>
          <TouchableOpacity 
            style={[styles.optionRow, isThemeExpanded ? { borderBottomWidth: 0 } : { borderBottomColor: colors.border }]} 
            onPress={() => setIsThemeExpanded(!isThemeExpanded)}
          >
            <View style={styles.rowLeft}>
              <Icon name="moon" size={20} color={colors.text} style={styles.rowIcon} />
              <Text style={[styles.optionText, { color: colors.text }]}>Theme</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.currentValueText, { color: colors.textSecondary }]}>
                {themeType === 'system' ? 'System Default' : themeType === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Icon name={isThemeExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          {isThemeExpanded && (
            <View style={[styles.expandedContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
              <ThemeOption label="Light Mode" value="light" />
              <ThemeOption label="Dark Mode" value="dark" />
              <ThemeOption label="System Default" value="system" isLast={true} />
            </View>
          )}
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        <Card style={styles.cardContainer}>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.lastRow}>
            <TouchableOpacity style={styles.optionRow}>
              <Text style={[styles.optionText, { color: colors.text }]}>Terms of Use</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
    marginTop: SPACING.lg,
  },
  cardContainer: {
    padding: 0,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  optionText: {
    ...TYPOGRAPHY.body1,
  },
  subOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingLeft: SPACING.xl * 1.5,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: SPACING.md,
  },
  currentValueText: {
    ...TYPOGRAPHY.body2,
    marginRight: SPACING.sm,
  },
  expandedContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
