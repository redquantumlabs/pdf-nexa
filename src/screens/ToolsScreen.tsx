import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useTheme } from '../context/ThemeContext';

export const ToolsScreen = () => {
  const { colors } = useTheme();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Tools Screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
