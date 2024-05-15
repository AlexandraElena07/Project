import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import { useRoute } from '@react-navigation/native'
import axios from 'axios';
import { ReusableText } from '../../components';

const PlaceDetails = () => {

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   const route = useRoute();
   const id = route.params;

   console.log(id);

   const [place, setPlaces] = useState(null)

   const getDataFromDatabase = async () => {
    try {
        
        const response = await axios.get(`http://10.9.31.61:5003/api/places/${id}`);
        setPlaces(response.data.place);

    } catch (error) {
        console.error('Error:', error);
    }

   };

   useEffect(() => {
      getDataFromDatabase();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
       <ScrollView contentContainerStyle={[reusable.container, {backgroundColor: currentTheme.background}]}>
          <View>

          

             {place && (

                <ReusableText
                text={'About ' + place.title}
                family={'bold'}
                color={currentTheme.color}/>
             )}
          </View>
       </ScrollView>
    </SafeAreaView>
 );
}

export default PlaceDetails

const style = StyleSheet.create({})
