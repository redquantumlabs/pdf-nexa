import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { rotatePages } from '../services/pdf/rotatePages';

export const RotatePagesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [pagesInput, setPagesInput] = useState('1'); // comma separated
  const [angle, setAngle] = useState<number>(90);
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

  const handleRotate = async () => {
    if (!selectedFile) return;
    
    // Parse pages (1-indexed to 0-indexed)
    const indices = pagesInput.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(n => !isNaN(n) && n >= 0);
    
    if (indices.length === 0) {
      Alert.alert('Invalid Input', 'Please enter valid page numbers separated by commas.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const outputUri = await rotatePages(selectedFile.uri, indices, angle, 'Rotated_Document.pdf');
      
      navigation.replace('PdfReader', { 
        file: { id: outputUri, uri: outputUri, name: 'Rotated_Document.pdf', size: 0 } 
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to rotate pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const AngleButton = ({ val, label }: { val: number, label: string }) => (
    <Button 
      title={label} 
      variant={angle === val ? 'primary' : 'outline'} 
      onPress={() => setAngle(val)} 
      style={styles.angleBtn} 
    />
  );

  return (
    <ScreenContainer>
      <View style={[styles.headerContainer, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Rotate Pages</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Rotate specific pages in a PDF document.
        </Text>
      </View>
      
      <View style={styles.container}>
        
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            {!selectedFile ? (
              <Button title="Select PDF" onPress={handleSelectFile} variant="outline" />
            ) : (
              <View>
                <Text style={[styles.fileName, { color: colors.primary }]} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Button title="Change File" onPress={handleSelectFile} variant="secondary" style={styles.changeBtn} />
                
                <Text style={[styles.label, { color: colors.text }]}>Pages to Rotate (comma-separated):</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  keyboardType="numbers-and-punctuation"
                  value={pagesInput}
                  onChangeText={setPagesInput}
                  placeholder="e.g. 1, 3, 5"
                  placeholderTextColor={colors.textSecondary}
                />
                
                <Text style={[styles.label, { color: colors.text, marginTop: SPACING.xl }]}>Rotation Angle:</Text>
                <View style={styles.angleContainer}>
                  <AngleButton val={90} label="90° CW" />
                  <AngleButton val={180} label="180°" />
                  <AngleButton val={270} label="90° CCW" />
                </View>
              </View>
            )}
          </Card>
        </ScrollView>

        <View style={[
          styles.footer, 
          { 
            borderTopColor: colors.border, 
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, SPACING.lg)
          }
        ]}>
          <Button 
            title={isProcessing ? "Processing..." : "Rotate PDF"} 
            onPress={handleRotate} 
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
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  title: { ...TYPOGRAPHY.h2 },
  subtitle: { ...TYPOGRAPHY.body2, marginTop: SPACING.xs },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  card: { padding: SPACING.lg },
  fileName: { ...TYPOGRAPHY.body1, fontWeight: 'bold', marginBottom: SPACING.sm, textAlign: 'center' },
  changeBtn: { marginBottom: SPACING.xl },
  label: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.sm },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    ...TYPOGRAPHY.body1,
  },
  angleContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  angleBtn: { flex: 1, marginHorizontal: 4, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.xs },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.lg,
    borderTopWidth: 1,
  }
});
