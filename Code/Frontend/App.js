import React, { useState, useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as Splashscreen from "expo-splash-screen";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Onboarding, Search, UpdateProfile, Contact, ProfileImage, CountyDetails, AboutCounty} from './src/screens';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { DefaultTheme } from 'react-native-paper';
import ThemeContext, { ThemeProvider } from './src/constants/themeContext';
import 'react-native-reanimated'
import axios from 'axios';

import themeDark from './src/constants/themeDark'

const Stack = createNativeStackNavigator();

export default function App() {

  const [counties, setCounties] = useState([]);

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
    if (fontsLoaded) {
        await Splashscreen.hideAsync();
    }
}, [fontsLoaded]);

  const getDataFromDatabase = async () => {
    try {
      const response = await axios.get('http://10.9.31.61:5003/api/getcounty');
      setCounties(response.data.counties);
    } catch (error) {
      console.error('Error fetching data from database:', error);
    }
  };

  useEffect(() => {
    getDataFromDatabase();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {userTheme => (
          <NavigationContainer theme={userTheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator>
              <Stack.Screen name='Onboard' component={Onboarding} options={{ headerShown: false }} />
              <Stack.Screen name='Bottom' component={BottomTabNavigation} options={{ headerShown: false }} />
              <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
              <Stack.Screen name='ProfileImage' component={ProfileImage} options={{ headerShown: false}} />
              <Stack.Screen name='UpdateProfile' component={UpdateProfile} options={{ headerShown: true, headerBackTitle: 'Back', title: 'Update Profile', headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader } }} />
              <Stack.Screen name='Contact' component={Contact} options={{ headerShown: true, headerBackTitle: 'Back', title: 'Contact Us', headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader } }} />
              <Stack.Screen 
                name='CountyDetails' 
                component={CountyDetails} 
                options={({ route }) => ({
                  headerShown: true, 
                  headerBackTitle: 'Back', 
                  title: route.params && route.params.item ? route.params.item.county : 'County',
                  headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader } 
              })} />
              <Stack.Screen 
                name='AboutCounty' 
                component={AboutCounty} 
                options={({ route }) => ({
                  headerShown: true, 
                  headerBackTitle: 'Back', 
                  title: 'Discover ' + (route.params && route.params.item ? route.params.item.county : 'County') + ' County',
                  headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader } 
              })} />
              
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
