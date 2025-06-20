import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {MainNavigator} from './navigation/main';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>

        <MainNavigator />

    </SafeAreaProvider>
  );
}

export default App;
