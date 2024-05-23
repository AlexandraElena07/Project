import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import themeDark from '../../constants/themeDark';
import themeContext from '../../constants/themeContext';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'
import { Alert } from 'react-native';


const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [groupedFavorites, setGroupedFavorites] = useState([]);
  const [counties, setCounties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState();

  const userTheme = useContext(themeContext);
  const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

  useEffect(() => {
    fetchFavorites();
    getUser();
    getFormattedData();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://10.9.31.61:5003/api/users/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000 // Ajustează timpul de așteptare (în milisecunde)
      });
  
      const favoritesData = response.data.favorites;
  
      // Preluăm detaliile fiecărui item
      const detailedFavorites = await Promise.all(favoritesData.map(async (fav) => {
        if (fav.type === 'Place') {
          const placeResponse = await axios.get(`http://10.9.31.61:5003/api/places/${fav._id}`, {
            timeout: 10000
          });
          if (placeResponse.data.place) {
            return { ...fav, details: placeResponse.data.place };
          }
        } else if (fav.type === 'County') {
          const countyResponse = await axios.get(`http://10.9.31.61:5003/api/counties/${fav._id}`, {
            timeout: 10000
          });
          if (countyResponse.data) {
            return { ...fav, details: countyResponse.data }; // Utilizăm întreg răspunsul pentru county
          }
        }
        return null;
      }));
  
      const filteredDetailedFavorites = detailedFavorites.filter(fav => fav !== null);
      setFavorites(filteredDetailedFavorites);
  
      const groupedData = [
        {
          title: 'Tourist Attraction',
          data: filteredDetailedFavorites.filter(item => item.type === 'Place')
        },
        {
          title: 'County Details',
          data: filteredDetailedFavorites.filter(item => item.type === 'County')
        }
      ];
  
      const filteredGroupedData = groupedData.filter(section => section.data.length > 0);
  
      setGroupedFavorites(filteredGroupedData);
  
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };
  

  const navigateToItem = async (item) => {
    
    if (item.type === 'Place') {
      try {
        const response = await axios.get(`http://10.9.31.61:5003/api/places/${item._id}`);
        if (response.data.place) {
          navigation.navigate('PlaceDetails',  item._id);
        } else {
          console.error('Place not found in the response');
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    } else if (item.type === 'County') {
      try {
        const response = await axios.get(`http://10.9.31.61:5003/api/counties/${item._id}`);

        if (response.data.county) {
          navigation.navigate('AboutCounty', { item: response.data });
        } else {
          console.error('County not found in the response');
        }
      } catch (error) {
        console.error('Error fetching county details:', error);
      }
    }
  };

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://10.9.31.61:5003/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching id:', error);
    }
  };

  const removeFromFavorites = async (itemId, itemType) => {
    try {
      const token = await AsyncStorage.getItem('token');
    
      const response = await axios.post('http://10.9.31.61:5003/api/users/removeFromFavorites', {
        userId: userId,
        itemId: itemId,  // Corectat pentru a folosi parametrul funcției
        itemType: itemType  // Adăugat itemType ca parametru necesar pentru API
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      if (response.status === 200) {
        setIsFavorite(current => !current); 
        fetchFavorites();
      } else {
        Alert.alert('Error', 'Failed to update favorite status.');
      }
    } catch (error) {
      console.error('Error on removing from favorites:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  
  const getFormattedData = (data) => {
    if (!data) {
      return []; 
    }
  
    if (data.length % 2 !== 0) {
      return [...data, { _id: 'empty', isEmpty: true, type: 'Empty' }];
    }
    return data;
  };
  


 const renderFavorite = ({ item }) => {
  const getContent = () => {
  if (item.type === 'Place') {
      return (
        item.isEmpty ? (
          <View style={styles.emptyCard}></View>
        ) : (
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.details.imageUrls[0] }} style={styles.image} />
            <TouchableOpacity style={styles.box} onPress={() => removeFromFavorites(item._id, item.type)}>
              <MaterialIcons name="favorite" size={26} color={COLORS.red} />
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: currentTheme.backgroundTiles, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <Text style={[styles.title, { color: currentTheme.textButton }]}>{item.details.title}</Text>
          </View>
        </View>)
      );
    } else if (item.type === 'County') {
      return (
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.details.imageUrl }} style={styles.image} />
            <TouchableOpacity style={styles.box} onPress={() => removeFromFavorites(item._id, item.type)}>
              <MaterialIcons name="favorite" size={25} color={COLORS.red} />
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: currentTheme.backgroundTiles, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <Text style={[styles.title, { color: currentTheme.textButton }]}>{item.details.county}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => navigateToItem(item)}>
      {getContent()}
    </TouchableOpacity>
  );
};



  const renderSection = ({ section }) => (
    <FlatList
      data={getFormattedData(section.data)}
      renderItem={renderFavorite}
      keyExtractor={(item, index) => item._id + index}
      numColumns={2}
      contentContainerStyle={styles.sectionContent}
      ListFooterComponent={<View style={styles.footerSpace} />}
    />
  );
  
    return (
      <View style={[styles.container, {backgroundColor: currentTheme.background}]}>
        <SectionList
          sections={getFormattedData(groupedFavorites)}
          keyExtractor={(item, index) => item._id + index}
          renderItem={() => null}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.header, {color: currentTheme.color}]}>{title}</Text>
          )}

          renderSectionFooter={({ section }) => renderSection({ section })}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    height: 200,
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
    height: 180,
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
    opacity: .7
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
  footerSpace: {
    height: 100
  }

});

export default FavoriteScreen;
