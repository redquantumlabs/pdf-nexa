import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { PdfReaderScreen } from '../screens/PdfReaderScreen';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { colors, theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          }
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PdfReader" 
          component={PdfReaderScreen} 
          options={{ title: 'Reader' }}
        />
        {/* Add more stack screens for tools here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
