import React, { useCallback, useState, useEffect, useContext } from 'react';
import { useFonts } from 'expo-font';
import * as Splashscreen from "expo-splash-screen";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Onboarding, Search, UpdateProfile, Contact, ProfileImage, CountyDetails, AboutCounty, PlaceDetails, Favorites, Hotels, HotelDetails, EventDetails, Home, Location, Events, Profile, ProfileAfterLogin, TouristAttraction } from './src/screens';
import { DefaultTheme } from 'react-native-paper';
import ThemeContext, { ThemeProvider } from './src/constants/themeContext';
import themeDark from './src/constants/themeDark';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarStyle = {
    padding: 5,
    height: 75,
    position: "regular"
};

const HomeStack = () => {
    const userTheme = useContext(ThemeContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={Home} />
            <Stack.Screen name="CountyDetails" component={CountyDetails} options={({ route }) => ({
                headerShown: true,
                headerBackTitle: 'Back',
                title: route.params && route.params.item ? route.params.item.county : 'County',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader }
            })} />
            <Stack.Screen name="AboutCounty" component={AboutCounty} options={({ route }) => ({
                headerShown: true,
                headerBackTitle: 'Back',
                title: 'Discover ' + (route.params && route.params.item ? route.params.item.county : 'County') + ' County',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background, headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader }
            })} />
            <Stack.Screen name="TouristAttraction" component={TouristAttraction} options={{
                headerShown: true,
                headerBackTitle: 'Back',
                title: 'Tourist Attraction',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader },
                headerTitleStyle: { fontWeight: 'bold' }
            }} />
            <Stack.Screen name="PlaceDetails" component={PlaceDetails} options={({ route }) => {
                return {
                    headerShown: true,
                    headerBackTitle: 'Back',
                    title: route.params && route.params.title ? route.params.title : 'Default Place Title',
                    headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                    headerStyle: {
                        backgroundColor: userTheme === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                };
            }} />
            <Stack.Screen name="HotelDetails" component={HotelDetails} options={({ route }) => {
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
            <Stack.Screen name="Hotels" component={Hotels} options={{
                headerShown: true,
                headerBackTitle: 'Back',
                title: 'Accommodation',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader },
                headerTitleStyle: { fontWeight: 'bold' }
            }} />

        </Stack.Navigator>
    );
};

const ProfileStack = () => {
    const userTheme = useContext(ThemeContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileAfterLogin" component={ProfileAfterLogin} />
            <Stack.Screen name="ProfileImage" component={ProfileImage} options={{
                headerShown: true,
                headerBackTitle: 'Back',
                title: ' ',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader }
            }} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{
                headerShown: true,
                headerBackTitle: 'Back',
                title: 'Update Profile',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                headerStyle: { backgroundColor: themeDark === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader }
            }} />
            <Stack.Screen name="Contact" component={Contact} options={{
                headerShown: true,
                headerBackTitle: 'Back',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                headerStyle: { backgroundColor: userTheme === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader },
                headerTitleStyle: { fontWeight: 'bold' }
            }} />
            <Stack.Screen name="Favorites" component={Favorites} options={{
                headerShown: true,
                headerBackTitle: 'Back',
                headerTintColor: userTheme === 'dark' ? themeDark.dark.background : themeDark.light.background,
                headerStyle: { backgroundColor: userTheme === 'dark' ? themeDark.dark.backgroundHeader : themeDark.light.backgroundHeader },
                headerTitleStyle: { fontWeight: 'bold' }
            }} />
        </Stack.Navigator>
    );
};

const LocationStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LocationScreen" component={Location} />
    </Stack.Navigator>
);

const EventsStack = () => {
    const userTheme = useContext(ThemeContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EventsScreen" component={Events} />
            <Stack.Screen name="EventDetails" component={EventDetails} options={{
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
    );
}

const BottomTabNavigation = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setIsAuthenticated(!!token);
            } catch (error) {
                console.error('Eroare la verificarea autentificării:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuthentication();
    }, []);

    return (
        <Tab.Navigator
            initialRouteName='Home'
            tabBarHideKeyBoard={true}
            screenOptions={{ headerShown: false, tabBarStyle }}
        >
            <Tab.Screen name='Home' component={HomeStack} options={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.red,
                tabBarInactiveTintColor: COLORS.inactiveIcon,
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "home" : "home-outline"}
                        color={focused ? COLORS.red : COLORS.inactiveIcon}
                        size={26}
                    />
                ),
            }} />

            <Tab.Screen name='Location' component={LocationStack} options={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.red,
                tabBarInactiveTintColor: COLORS.inactiveIcon,
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "location" : "location-outline"}
                        color={focused ? COLORS.red : COLORS.inactiveIcon}
                        size={26}
                    />
                ),
            }} />

            <Tab.Screen name='Events' component={EventsStack} options={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.red,
                tabBarInactiveTintColor: COLORS.inactiveIcon,
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "calendar" : "calendar-outline"}
                        color={focused ? COLORS.red : COLORS.inactiveIcon}
                        size={26}
                    />
                ),
            }} />

            <Tab.Screen name='Profile' component={isAuthenticated ? ProfileStack : Profile} options={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.red,
                tabBarInactiveTintColor: COLORS.inactiveIcon,
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "person" : "person-outline"}
                        color={focused ? COLORS.red : COLORS.inactiveIcon}
                        size={26}
                    />
                ),
            }} />
        </Tab.Navigator>
    );
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
                        <NavigationContainer theme={userTheme === 'dark' ? DarkTheme : DefaultTheme}>
                            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
                                <Stack.Screen name='Onboard' component={Onboarding} />
                                <Stack.Screen name='Bottom' component={BottomTabNavigation} />
                                <Stack.Screen name='Search' component={Search} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </GestureHandlerRootView>
                )}
            </ThemeContext.Consumer>
        </ThemeProvider>
    );
}

