import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { HomeScreen } from '../screens/HomeScreen';
import { FilesScreen } from '../screens/FilesScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Files" 
        component={FilesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="folder" color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Tools" 
        component={ToolsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="grid" color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="settings" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
