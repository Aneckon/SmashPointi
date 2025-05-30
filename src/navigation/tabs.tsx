import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/home-screen';
import {CourtsScreen} from '../screens/courts';
import {SettingsScreen} from '../screens/settings';
import MyGamesScreen from '../screens/my-games';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/colors';
import {HomeIcon} from '../assets/svg/home';
import {HomeActiveIcon} from '../assets/svg/home-active';
import {GameIcon} from '../assets/svg/game';
import {GameActiveIcon} from '../assets/svg/game-active-icon';
import {SettingsIcon} from '../assets/svg/settings-icon';
import {SettingsActiveIcon} from '../assets/svg/settings-active-icon';
import {CourtsIcon} from '../assets/svg/courts';
import {CourtsActiveIcon} from '../assets/svg/courts-active';

export type TabParamList = {
  Home: undefined;
  Courts: undefined;
  Games: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabIcon = (
  IconDisabledComponent: React.ElementType,
  IconComponent: React.ElementType,
  label: string,
  focused: boolean,
) => (
  <View style={styles.container}>
    {focused ? <IconComponent /> : <IconDisabledComponent />}
    <Text
      style={[styles.label, {color: focused ? '#21706A' : COLORS.greyPrimary}]}>
      {label}
    </Text>
  </View>
);

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderTabIcon(HomeIcon, HomeActiveIcon, 'Me', focused),
        }}
      />
      <Tab.Screen
        name="Courts"
        component={CourtsScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderTabIcon(CourtsIcon, CourtsActiveIcon, 'Courts', focused),
        }}
      />
      <Tab.Screen
        name="Games"
        component={MyGamesScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderTabIcon(GameIcon, GameActiveIcon, 'Games', focused),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderTabIcon(
              SettingsIcon,
              SettingsActiveIcon,
              'Settings',
              focused,
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    height: 100,
    paddingTop: 20,
    backgroundColor: '#1A1A1A',
    borderTopColor: '#2A2A2A',
    borderTopWidth: 1,
  },
});
