import { Wiew, Text } from 'react-native'
import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Profile, Favorite, Location, ProfileAfterLogin } from '../screens';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      activeColor='#EB6A58'
      tabBarHideKeyBoard={true}
      headerShown={false}
      inactiveColor='#3e2465'
      BarStyle={{paddingBottom:48}}
    >
      <Tab.Screen name='Home' component={Home} options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#B50A04",
          tabBarInactiveTintColor: "#666262",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"}
              color={focused ? '#B50A04' : '#666262'}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen name='Location' component={Location} options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#B50A04",
          tabBarInactiveTintColor: "#666262",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "location" : "location-outline"}
              color={focused ? '#B50A04' : '#666262'}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen name='Favorite' component={Favorite} options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#B50A04",
          tabBarInactiveTintColor: "#666262",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "heart" : "heart-outline"}
              color={focused ? '#B50A04' : '#666262'}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen name='Profile' component={isAuthenticated ? ProfileAfterLogin : Profile}  options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#B50A04",
          tabBarInactiveTintColor: "#666262",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"}
              color={focused ? '#B50A04' : '#666262'}
              size={26}
            />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
