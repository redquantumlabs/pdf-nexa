import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  noSafeArea?: boolean;
}

export const ScreenContainer: React.FC<Props> = ({ children, style, noSafeArea = false }) => {
  const { colors, theme } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    style
  ];

  if (noSafeArea) {
    return (
      <View style={containerStyle}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'bottom']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
