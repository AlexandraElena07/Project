import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';

const Location = () => {

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
         <ScrollView contentContainerStyle={[reusable.container, {backgroundColor: currentTheme.background}]}>
            <View>
               <Text>Location</Text>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

export default Location

const style = StyleSheet.create({})
