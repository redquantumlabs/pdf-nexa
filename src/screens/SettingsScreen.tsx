import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

export const SettingsScreen = () => {
  const { colors, themeType, setThemeType } = useTheme();

  const ThemeOption = ({ label, value }: { label: string, value: ThemeType }) => {
    const isSelected = themeType === value;
    return (
      <TouchableOpacity 
        style={[styles.optionRow, { borderBottomColor: colors.border }]} 
        onPress={() => setThemeType(value)}
      >
        <Text style={[styles.optionText, { color: colors.text }]}>{label}</Text>
        {isSelected && <Icon name="check" size={20} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <Card style={styles.cardContainer}>
          <ThemeOption label="Light Mode" value="light" />
          <ThemeOption label="Dark Mode" value="dark" />
          <View style={styles.lastRow}>
             <ThemeOption label="System Default" value="system" />
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        <Card style={styles.cardContainer}>
          <View style={[styles.optionRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>Version</Text>
            <Text style={{ color: colors.textSecondary }}>1.0.0</Text>
          </View>
          <View style={[styles.optionRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.lastRow}>
            <View style={styles.optionRow}>
              <Text style={[styles.optionText, { color: colors.text }]}>Terms of Use</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
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
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xl,
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
  }
});
