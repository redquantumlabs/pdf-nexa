import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

export const ToolsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const tools = [
    { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDF files', icon: 'layers', route: 'MergePdf' },
    { id: 'split', title: 'Split PDF', desc: 'Extract pages from a PDF', icon: 'scissors', route: 'SplitPdf' },
    { id: 'rotate', title: 'Rotate Pages', desc: 'Rotate specific pages', icon: 'rotate-cw', route: 'RotatePages' },
    // More tools can be added easily here
  ];

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tools</Text>
        
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ORGANIZE</Text>
        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <Card 
              key={tool.id} 
              style={styles.toolCard} 
              onPress={() => navigation.navigate(tool.route)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.background }]}>
                <Icon name={tool.icon} size={28} color={colors.primary} />
              </View>
              <Text style={[styles.toolTitle, { color: colors.text }]}>{tool.title}</Text>
              <Text style={[styles.toolDesc, { color: colors.textSecondary }]}>{tool.desc}</Text>
            </Card>
          ))}
        </View>
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
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  toolTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  toolDesc: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  }
});
