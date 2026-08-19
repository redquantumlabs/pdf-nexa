import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const handleOpenPdf = async () => {
    try {
      const [res] = await pick({
        type: [types.pdf],
      });
      // Navigate to PdfReader with the selected file
      navigation.navigate('PdfReader', { 
        file: {
          id: res.uri,
          uri: res.uri,
          name: res.name || 'document.pdf',
          size: res.size || 0
        }
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('Error picking document:', err);
      }
    }
  };

  const quickActions = [
    { icon: 'file-plus', title: 'Open PDF', onPress: handleOpenPdf },
    { icon: 'layers', title: 'Merge PDF', onPress: () => navigation.navigate('Tools') },
    { icon: 'scissors', title: 'Split PDF', onPress: () => navigation.navigate('Tools') },
    { icon: 'image', title: 'Images to PDF', onPress: () => navigation.navigate('Tools') },
  ];

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="file-text" size={32} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>PDFNexa</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <Card key={index} style={styles.actionCard} onPress={action.onPress}>
              <View style={[styles.iconWrapper, { backgroundColor: colors.background }]}>
                <Icon name={action.icon} size={28} color={colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
            </Card>
          ))}
        </View>

        {/* Recent Files */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Files</Text>
        
        {/* Empty State for Recent Files */}
        <Card style={styles.emptyStateCard}>
          <Icon name="file" size={48} color={colors.border} />
          <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>No recent documents</Text>
          <Text style={[styles.emptyStateSub, { color: colors.textSecondary }]}>Open a PDF to see it here.</Text>
        </Card>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginLeft: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  actionCard: {
    width: '48%',
    marginBottom: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'transparent', // Overridden by theme usually
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  emptyStateSub: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  }
});
