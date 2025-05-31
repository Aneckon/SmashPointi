import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabNavigator} from './tabs';
import {EditProfileScreen} from '../screens/edit-profile';
import CreateGameScreen from '../screens/create-game';
import {CourtDetailsScreen} from '../screens/details';
import {HistoryScreen} from '../screens/history';
import {WelcomeScreen} from '../screens/welcome';
import {AnnouncementDetailsScreen} from '../screens/announcement-details-screen';
import {Announcement} from '../data/announcement';
import {GameDetailsScreen} from '../screens/game-details';

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  EditProfile: undefined;
  CreateGame: undefined;
  CourtDetails: {courtId: string};
  GameHistory: undefined;
  AnnouncementDetails: {announcement: Announcement};
  GameDetails: {gameId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CreateGame" component={CreateGameScreen} />
      <Stack.Screen name="CourtDetails" component={CourtDetailsScreen} />
      <Stack.Screen name="GameHistory" component={HistoryScreen} />
      <Stack.Screen
        name="AnnouncementDetails"
        component={AnnouncementDetailsScreen}
      />
      <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
    </Stack.Navigator>
  );
};
