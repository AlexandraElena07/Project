import React, { useState, useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as Splashscreen from "expo-splash-screen";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Onboarding, Search, UpdateProfile, Contact, ProfileImage, CountyDetails, AboutCounty, TouristAttraction, PlaceDetails, Favorites, Hotels, HotelDetails, EventDetails } from './src/screens';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { DefaultTheme } from 'react-native-paper';
import ThemeContext, { ThemeProvider } from './src/constants/themeContext';
import axios from 'axios';
import themeDark from './src/constants/themeDark';
import * as Linking from "expo-linking";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix, "roexplorer://"],
  config: {
    screens: {
      PlaceDetails: "place/:placeId",
      AboutCounty: "county/:countyId",
      Favorites: "favorites"
    },
  },
};

export default function App() {

  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/regular.otf'),
    bold: require('./assets/fonts/bold.otf'),
    boldIt: require('./assets/fonts/boldIt.otf'),
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

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {userTheme => (
          <GestureHandlerRootView style={{ flex: 1 }}> 
          <NavigationContainer linking={linking} theme={userTheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
              <Stack.Screen name='Onboard' component={Onboarding} options={{ headerShown: false }} />
              <Stack.Screen name='Bottom' component={BottomTabNavigation} options={{ headerShown: false }} />
              <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
              <Stack.Screen name='ProfileImage' component={ProfileImage} options={{ headerShown: true, headerBackTitle: 'Back', title: '', headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader } }} />
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

              <Stack.Screen name='TouristAttraction' component={TouristAttraction} options={{ headerShown: true, headerBackTitle: 'Back', title: 'Tourist Attraction', headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader },  headerTitleStyle: {fontWeight: 'bold'} }} />
              <Stack.Screen name='PlaceDetails' component={PlaceDetails} options={{ headerShown: false }} />
              <Stack.Screen name='Favorites' component={Favorites} options={{ headerShown: true, headerBackTitle: 'Back', headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader }, headerTitleStyle: {fontWeight: 'bold'} }} />
              <Stack.Screen name='Hotels' component={Hotels} options={{ headerShown: true, headerBackTitle: 'Back', title: 'Accommodation', headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader }, headerTitleStyle: {fontWeight: 'bold'} }} />
              <Stack.Screen
                  name='HotelDetails'
                  component={HotelDetails}
                  options={({ route }) => {
                    
                    return {
                      headerShown: true,
                      headerBackTitle: 'Back',
                      title: route.params && route.params.title ? route.params.title : 'Default Hotel Title',
                      headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                      headerStyle: {
                        backgroundColor: userTheme === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader
                      },
                      headerTitleStyle: {
                        fontWeight: 'bold'
                      }
                    };
                  }}
                />

                <Stack.Screen
                  name='EventDetails'
                  component={EventDetails}
                  options={{
                      headerShown: true,
                      headerBackTitle: 'Back',
                      title: 'Events',
                      headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                      headerStyle: {
                        backgroundColor: userTheme === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader
                      },
                      headerTitleStyle: {
                        fontWeight: 'bold'
                      }
                    
                  }}
                />

            </Stack.Navigator>
          </NavigationContainer>
          </GestureHandlerRootView>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
