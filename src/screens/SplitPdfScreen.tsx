import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { splitPdf } from '../services/pdf/splitPdf';

export const SplitPdfScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectFile = async () => {
    try {
      const [res] = await pick({ type: [types.pdf] });
      setSelectedFile(res);
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('Error picking document:', err);
      }
    }
  };

  const handleSplit = async () => {
    if (!selectedFile) return;
    
    const start = parseInt(startPage, 10);
    const end = parseInt(endPage, 10);
    
    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      Alert.alert('Invalid Range', 'Please enter a valid page range.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const outputUri = await splitPdf(selectedFile.uri, [{ start, end }], 'Split_Document.pdf');
      
      navigation.replace('PdfReader', { 
        file: { id: outputUri, uri: outputUri, name: 'Split_Document.pdf', size: 0 } 
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Split PDF</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Extract specific pages into a new document.
        </Text>
        
        <View style={styles.content}>
          <Card style={styles.card}>
            {!selectedFile ? (
              <Button title="Select PDF" onPress={handleSelectFile} variant="outline" />
            ) : (
              <View>
                <Text style={[styles.fileName, { color: colors.primary }]} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Button title="Change File" onPress={handleSelectFile} variant="secondary" style={styles.changeBtn} />
                
                <Text style={[styles.label, { color: colors.text }]}>Page Range (e.g. 1 to 5):</Text>
                <View style={styles.rangeInputContainer}>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    keyboardType="number-pad"
                    value={startPage}
                    onChangeText={setStartPage}
                    placeholder="Start"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Text style={[styles.toText, { color: colors.text }]}>to</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    keyboardType="number-pad"
                    value={endPage}
                    onChangeText={setEndPage}
                    placeholder="End"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>
            )}
          </Card>
        </View>

        <View style={[
          styles.footer, 
          { 
            borderTopColor: colors.border, 
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, SPACING.lg)
          }
        ]}>
          <Button 
            title={isProcessing ? "Processing..." : "Split PDF"} 
            onPress={handleSplit} 
            isLoading={isProcessing}
            disabled={!selectedFile || isProcessing} 
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { ...TYPOGRAPHY.h2, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  subtitle: { ...TYPOGRAPHY.body2, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  content: { padding: SPACING.lg },
  card: { padding: SPACING.lg },
  fileName: { ...TYPOGRAPHY.body1, fontWeight: 'bold', marginBottom: SPACING.sm, textAlign: 'center' },
  changeBtn: { marginBottom: SPACING.xl },
  label: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.sm },
  rangeInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    width: 80,
    textAlign: 'center',
    ...TYPOGRAPHY.body1,
  },
  toText: { marginHorizontal: SPACING.md, ...TYPOGRAPHY.body1 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.lg,
    borderTopWidth: 1,
  }
});
