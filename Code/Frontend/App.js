import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useFonts} from 'expo-font'
import * as Splashscreen from "expo-splash-screen"
import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Onboarding, Search, SignIn, LogIn } from './src/screens';
import  BottomTabNavigation  from './src/navigation/BottomTabNavigation'

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/regular.otf'),
    bold: require('./assets/fonts/bold.otf'),
    semibold: require('./assets/fonts/semibold.otf'),
    semiboldIt: require('./assets/fonts/semiboldIt.otf'),
    extralight: require('./assets/fonts/extralight.otf'),
    extralightIt: require('./assets/fonts/extralightIt.otf'),
    medium: require('./assets/fonts/medium.otf'),
    mediumIt: require('./assets/fonts/mediumIt.otf'),
    italic: require('./assets/fonts/italic.otf'),
    black: require('./assets/fonts/black.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if(fontsLoaded) {
      await Splashscreen.hideAsync();
    }
  }, [fontsLoaded]);

  if(!fontsLoaded) {
    return null;
  }

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Onboard' component={Onboarding} options={{headerShown: false}}/>
          <Stack.Screen name='Bottom' component={BottomTabNavigation} options={{headerShown: false}}/>
          <Stack.Screen name='Search' component={Search} options={{headerShown: false}}/>
          <Stack.Screen name='SignIn' component={SignIn} options={{headerShown: false}}/>
          <Stack.Screen name='LogIn' component={LogIn} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}


