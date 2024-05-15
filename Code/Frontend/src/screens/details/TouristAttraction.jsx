import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

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

            // Creează un obiect care să conțină atracțiile turistice pentru fiecare categorie
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


   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>

<View>
                <TouchableOpacity onPress={() => handleCategoryPress('All')}>
                    <Text>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryPress('monument')}>
                    <Text>Historical Monument</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryPress('museum')}>
                    <Text>Museum</Text>
                </TouchableOpacity>
                {/* Alte butoane pentru alte categorii */}
            </View>

               
           
      
    <View>
    {placesByCategory[selectedCategory] && (
                <FlatList
                    data={placesByCategory[selectedCategory]}
                    numColumns={2}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <View style={styles.container}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.card}>
                            <TouchableOpacity onPress={() => addToFavorites(item._id)} style={styles.favoriteButton}>
                                <Text>Favorite</Text>
                            </TouchableOpacity>
                            <Image source={{ uri: item.imageUrl }} style={styles.image} />
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                        {index === placesByCategory[selectedCategory].length - 1 && (
                <View style={styles.emptyCard}></View>
            )}
                        </View>
                        </View>
                    )}


                />
            )}
       </View>

      </SafeAreaView>
   );
}

export default TouristAttraction

const styles = StyleSheet.create({
    container: {
        flex: 1
      },
      card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 10,
      },
      favoriteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 1,
      },
      emptyCard: {
        flex: 1,
        margin: 8,  
    },
})



