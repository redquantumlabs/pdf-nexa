import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer } from '../components/ScreenContainer';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { PdfFile } from '../types';

export const PdfReaderScreen = () => {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  const file: PdfFile = route.params?.file;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  if (!file) {
    return (
      <ScreenContainer>
        <View style={styles.centerContent}>
          <Text style={{ color: colors.error }}>No PDF file provided.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noSafeArea>
      {/* Custom Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {file.name}
        </Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="more-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.pdfContainer}>
        {error ? (
          <View style={styles.centerContent}>
            <Icon name="alert-triangle" size={48} color={colors.error} />
            <Text style={{ color: colors.error, marginTop: SPACING.md }}>{error}</Text>
          </View>
        ) : (
          <Pdf
            source={{ uri: file.uri }}
            onLoadComplete={(numberOfPages) => {
              setTotalPages(numberOfPages);
            }}
            onPageChanged={(page) => {
              setCurrentPage(page);
            }}
            onError={(err) => {
              console.error(err);
              setError("Failed to load PDF document.");
            }}
            style={styles.pdf}
            renderActivityIndicator={() => <ActivityIndicator size="large" color={colors.primary} />}
          />
        )}
      </View>

      {/* Floating Page Indicator */}
      {totalPages > 0 && !error && (
        <View style={[styles.pageIndicator, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text }}>{currentPage} / {totalPages}</Text>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
  },
  title: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    flex: 1,
    marginLeft: SPACING.md,
  },
  iconButton: {
    padding: SPACING.sm,
  },
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: SPACING.xl,
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});
