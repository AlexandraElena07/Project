import { Wiew, Text } from 'react-native'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Profile, Favorite, Location } from '../screens';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const tabBarStyle = {
    padding: 5,
    height: 75,
    position: "regular"
};

const BottomTabNavigation = () => {
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

      <Tab.Screen name='Profile' component={Profile} options={{
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
