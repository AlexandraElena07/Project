import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Profile, Events, Location, ProfileAfterLogin } from '../screens';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthTab from './AuthTab';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const tabBarStyle = {
    padding: 5,
    height: 75,
    position: "regular"
};

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
      headerShown={false}
      BarStyle={{paddingBottom:48}}
    >
      <Tab.Screen name='Home' component={Home} options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.inactiveIcon,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"}
              color={focused ? COLORS.red : COLORS.inactiveIcon}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen name='Location' component={Location} options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.inactiveIcon,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "location" : "location-outline"}
              color={focused ? COLORS.red : COLORS.inactiveIcon}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen name='Events' component={Events} options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.inactiveIcon,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"}
              color={focused ? COLORS.red : COLORS.inactiveIcon}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen name='Profile' component={isAuthenticated ? ProfileAfterLogin : AuthTab}  options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.inactiveIcon,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"}
              color={focused ? COLORS.red : COLORS.inactiveIcon}
              size={26}
            />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
