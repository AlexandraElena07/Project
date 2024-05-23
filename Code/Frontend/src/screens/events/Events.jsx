import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const Events = () => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    return (
        <SafeAreaView style={{ flex: 1,  backgroundColor: currentTheme.background}}>
            <ScrollView style={ { backgroundColor: currentTheme.background }}>
                <Text style={{ color: currentTheme.color}}>Events</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Events;
 