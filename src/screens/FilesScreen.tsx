import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../constants/theme';

export const FilesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const handlePickFile = async () => {
    try {
      const [res] = await pick({
        type: [types.pdf],
      });
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

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Files</Text>
        <View style={styles.headerActions}>
          <Icon name="search" size={24} color={colors.text} style={styles.icon} />
          <Icon name="filter" size={24} color={colors.text} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.emptyStateContainer}>
          <Icon name="file" size={64} color={colors.border} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No PDF files yet</Text>
          <Text style={[styles.emptyStateSub, { color: colors.textSecondary }]}>
            Open or import a PDF to get started.
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handlePickFile}
      >
        <Icon name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: SPACING.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateContainer: {
    alignItems: 'center',
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  emptyStateSub: {
    ...TYPOGRAPHY.body1,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  }
});
