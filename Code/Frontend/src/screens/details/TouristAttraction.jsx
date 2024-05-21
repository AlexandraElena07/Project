import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { COLORS } from '../../constants/theme';
import { MaterialIcons } from "@expo/vector-icons"

const TouristAttraction = () => {

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   const navigation = useNavigation();

   const route = useRoute();
   const {item} = route.params;

   const [places, setPlaces] = useState([]);
   const [placesByCategory, setPlacesByCategory] = useState({});
   const [selectedCategory, setSelectedCategory] = useState('All');

    const getDataFromDatabase = async () => {
       try {
           
           const response = await axios.get(`http://10.9.31.61:5003/api/places/byCounty/${item._id}`);
           setPlaces(response.data.places);

           const fetchedPlaces = response.data.places;

           const categories = [...new Set(fetchedPlaces.map(place => place.category))];

            const placesByCategory = {};
            categories.forEach(category => {
                placesByCategory[category] = fetchedPlaces.filter(place => place.category === category);
            });

            placesByCategory['All'] = fetchedPlaces;

            setPlacesByCategory(placesByCategory);

   
       } catch (error) {
           console.error('Error:', error);
       }
   
      };
   
      useEffect(() => {
         getDataFromDatabase();
     }, []);

     const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

  const addToFavorites = (id) => {
    console.log(`Added to favorites: ${id}`);
  };

  const getFormattedData = (data) => {
    if (data.length % 2 !== 0) {
       return [...data, { _id: 'empty', isEmpty: true }];
    }
    return data;
 };

   return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <View style={{marginHorizontal: 20}}>
        
        <View>
          <ScrollView horizontal={true} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.button, selectedCategory === 'All' ? {backgroundColor: currentTheme.backgroundSelectedButton} : {backgroundColor: currentTheme.backgroundTiles}]} onPress={() => handleCategoryPress('All')}>
              <Text style={[styles.text, selectedCategory === 'All' ? {color: currentTheme.textSelectedButton} : {color: currentTheme.textButton}]}>All Attraction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, selectedCategory === 'monument' ? {backgroundColor: currentTheme.backgroundSelectedButton} : {backgroundColor: currentTheme.backgroundTiles}]}  onPress={() => handleCategoryPress('monument')}>
              <Text style={[styles.text, selectedCategory === 'monument' ? {color: currentTheme.textSelectedButton} : {color: currentTheme.textButton}]}>Historical Monument</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, selectedCategory === 'museum' ? {backgroundColor: currentTheme.backgroundSelectedButton} : {backgroundColor: currentTheme.backgroundTiles}]}  onPress={() => handleCategoryPress('museum')}>
              <Text style={[styles.text, selectedCategory === 'museum' ? {color: currentTheme.textSelectedButton} : {color: currentTheme.textButton}]}>Museum</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, selectedCategory === 'church' ? {backgroundColor: currentTheme.backgroundSelectedButton} : {backgroundColor: currentTheme.backgroundTiles}]}  onPress={() => handleCategoryPress('church')}>
              <Text style={[styles.text, selectedCategory === 'church' ? {color: currentTheme.textSelectedButton} : {color: currentTheme.textButton}]}>Church</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, selectedCategory === 'natural' ? {backgroundColor: currentTheme.backgroundSelectedButton} : {backgroundColor: currentTheme.backgroundTiles}]}  onPress={() => handleCategoryPress('natural')}>
              <Text style={[styles.text, selectedCategory === 'natural' ? {color: currentTheme.textSelectedButton} : {color: currentTheme.textButton}]}>Natural Attraction</Text>
            </TouchableOpacity>          
          </ScrollView>
        </View>      
            
        <View>
          {placesByCategory[selectedCategory] && (
            <FlatList
                  data={getFormattedData(placesByCategory[selectedCategory])}
                  numColumns={2}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item, index }) => (
                    item.isEmpty ? (
                      <View style={styles.emptyCard}></View>
                    ) : (
                      <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('PlaceDetails', item._id)}>
                        <View style={styles.card}>
                          <View style={styles.imageContainer}>
                            <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
                            <TouchableOpacity style={styles.box} onPress={() => addToFavorites(item._id)}>
                              <MaterialIcons name="favorite-outline" size={26} color="black" />
                            </TouchableOpacity>
                          </View>
                          <View style={{ backgroundColor: currentTheme.backgroundTiles, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                            <Text style={[styles.title, { color: currentTheme.textButton }]}>{item.title}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  )}
              />
            )}
        </View>
      </View>
    </SafeAreaView>
   );
}

export default TouristAttraction

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
      },
    cardContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      flex: 1,
      margin: 5,
      height: 180,
      backgroundColor: '#fff',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    imageContainer: {
      flex: 1,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: 150,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },

    box: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: COLORS.grey,
      width: 35,
      height: 35,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      margin: 10,
    },
    emptyCard: {
      flex: 1,
      margin: 8,  
    },
    scrollView: {
      paddingVertical: 20,
    },
    scrollViewContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      marginRight: 10, 
      padding: 7, 
      borderRadius: 12, 
    },
    selectedButton: {
      backgroundColor: COLORS.grey
    },
    text: {
      fontSize: 16, 
    },
})



