import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { pick, types } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { mergePdfs } from '../services/pdf/mergePdf';

export const MergePdfScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleAddFiles = async () => {
    try {
      const res = await pick({
        type: [types.pdf],
        allowMultiSelection: true,
      });
      setSelectedFiles((prev) => [...prev, ...res]);
    } catch (err) {
      console.log('User cancelled or error picking files', err);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newFiles = [...selectedFiles];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setSelectedFiles(newFiles);
    } else if (direction === 'down' && index < selectedFiles.length - 1) {
      const newFiles = [...selectedFiles];
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
      setSelectedFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      Alert.alert('Not enough files', 'Please select at least 2 files to merge.');
      return;
    }
    
    setIsMerging(true);
    try {
      const uris = selectedFiles.map(f => f.uri);
      const outputUri = await mergePdfs(uris, 'Merged_Document.pdf');
      
      // Navigate to reader
      navigation.replace('PdfReader', { 
        file: { id: outputUri, uri: outputUri, name: 'Merged_Document.pdf', size: 0 } 
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to merge files.');
    } finally {
      setIsMerging(false);
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <View style={[styles.fileRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.fileInfo}>
        <Icon name="file-text" size={24} color={colors.primary} />
        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
          {item.name || `Document ${index + 1}`}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => moveFile(index, 'up')} disabled={index === 0} style={styles.actionBtn}>
          <Icon name="arrow-up" size={20} color={index === 0 ? colors.border : colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => moveFile(index, 'down')} disabled={index === selectedFiles.length - 1} style={styles.actionBtn}>
          <Icon name="arrow-down" size={20} color={index === selectedFiles.length - 1 ? colors.border : colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFile(index)} style={styles.actionBtn}>
          <Icon name="x" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={[styles.headerContainer, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Merge PDF</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Add files and reorder them before merging.
        </Text>
      </View>
      
      <View style={styles.container}>
        
        <FlatList
          data={selectedFiles}
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="layers" size={48} color={colors.border} />
              <Text style={{ color: colors.textSecondary, marginTop: SPACING.md }}>No files selected.</Text>
            </View>
          }
        />

        <View style={[
          styles.footer, 
          { 
            borderTopColor: colors.border, 
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, SPACING.lg) 
          }
        ]}>
          <Button 
            title="+ Add Files" 
            variant="outline" 
            onPress={handleAddFiles} 
            style={styles.addBtn} 
          />
          <Button 
            title={isMerging ? "Merging..." : "Merge PDFs"} 
            onPress={handleMerge} 
            isLoading={isMerging}
            disabled={selectedFiles.length < 2 || isMerging} 
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  title: { ...TYPOGRAPHY.h2 },
  subtitle: { ...TYPOGRAPHY.body2, marginTop: SPACING.xs },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
  },
  fileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fileName: { ...TYPOGRAPHY.body2, marginLeft: SPACING.sm, flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: SPACING.xs, marginLeft: SPACING.xs },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.lg,
    borderTopWidth: 1,
  },
  addBtn: { marginBottom: SPACING.sm }
});
