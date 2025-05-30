import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/home-screen';
import {CourtsScreen} from '../screens/courts';
import {SettingsScreen} from '../screens/settings';
import MyGamesScreen from '../screens/my-games';

export type TabParamList = {
  Home: undefined;
  Courts: undefined;
  Games: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courts" component={CourtsScreen} />
      <Tab.Screen name="Games" component={MyGamesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
