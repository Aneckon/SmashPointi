import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabNavigator} from './tabs';
import {EditProfileScreen} from '../screens/edit-profile';
import CreateGameScreen from '../screens/create-game';
import {CourtDetailsScreen} from '../screens/details';
import {HistoryScreen} from '../screens/history';

export type RootStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  CreateGame: undefined;
  CourtDetails: {courtId: string};
  GameHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CreateGame" component={CreateGameScreen} />
      <Stack.Screen name="CourtDetails" component={CourtDetailsScreen} />
      <Stack.Screen name="GameHistory" component={HistoryScreen} />
    </Stack.Navigator>
  );
};
