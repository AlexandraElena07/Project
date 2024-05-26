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
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const response = await axios.get('http://10.9.31.61:5003/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
  
  
      if (!response.data || !response.data.favorites) {
        console.error('Favorites data is missing or undefined');
        setGroupedFavorites([]);
        return;
      }
  
      const favoritesData = response.data.favorites || [];
  
      const detailedFavorites = await Promise.all(favoritesData.map(async (fav) => {
        //console.log('Processing favorite:', fav);
        try {
          const getTypeUrl = (type) => {
            if (type.toLowerCase() === 'county') return 'counties';
            return `${type.toLowerCase()}s`;
          };
      
          const res = await axios.get(`http://10.9.31.61:5003/api/${getTypeUrl(fav.type)}/${fav._id}`, {
            timeout: 10000
          });
      
          //console.log(`Details for ${fav.type}`, res.data);
      
          if (!res.data) return null;
          
          let details;
          let customTitle;
      
          switch(fav.type) {
            case 'County':
              details = res.data;
              customTitle = 'About County';
              break;
            case 'Place':
              details = res.data.place || res.data;
              customTitle = 'Tourist Attraction';
              break;
            case 'Hotel':
              details = res.data.hotel || res.data;
              customTitle = 'Accommodation';
              break;
            default:
              return null;
          }
          // Attach customTitle to the object returned
          return details ? { ...fav, details, customTitle } : null;
        } catch (error) {
          console.error(`Failed to fetch details for ${fav.type.toLowerCase()}: ${error}`);
          return null;
        }
      }));

      const filteredDetailedFavorites = detailedFavorites.filter(fav => fav !== null);
  
      
      const groupedData = ['County', 'Place', 'Hotel'].map(type => {
        const sectionData = filteredDetailedFavorites.filter(item => item.type === type);
        if (sectionData.length > 0) {
          const title = sectionData[0].customTitle; // Use the customTitle from the first item of each type
          return { title, data: sectionData };
        }
        return null;
      }).filter(section => section !== null);
      
      
      //console.log('Grouped data:', groupedData);
      setGroupedFavorites(groupedData);

      if (!groupedFavorites.length) {
        return <Text>No favorites to display.</Text>;
      }

      //console.log('Grouped data before formatting:', groupedData);
      //const formattedGroupedData = getFormattedData(groupedData);
      //console.log('Formatted grouped data:', formattedGroupedData);
      
  
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Failed to fetch favorites.');
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
    } else if (item.type === 'Hotel') {
      try {
        const response = await axios.get(`http://10.9.31.61:5003/api/hotels/${item._id}`);

        if (response.data.hotel) {
          navigation.navigate('HotelDetails', {itemId: item._id});
        } else {
          console.error('Hotel not found in the response');
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
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
        console.error('Error fetching hotel details:', error);
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
        itemId: itemId,  
        itemType: itemType  
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
    if (item.type === 'County') {
      return (
        item.isEmpty ? (
          <View style={styles.emptyCard}></View>
        ) : (
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
        ));

    } else if (item.type === 'Place') {
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
    } else if (item.type === 'Hotel') {
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
      showsVerticalScrollIndicator={false}
    />
  );
  
    return (
      <View style={[styles.container, {backgroundColor: currentTheme.background}]}>
        <SectionList
          sections={groupedFavorites}
          keyExtractor={(item, index) => item._id + index}
          renderItem={() => null}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.header, {color: currentTheme.color}]}>{title}</Text>
          )}

          renderSectionFooter={({ section }) => renderSection({ section })}
          showsVerticalScrollIndicator={false}
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
