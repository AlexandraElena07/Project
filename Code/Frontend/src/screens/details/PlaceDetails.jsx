import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, FlatList, Image, Linking, TouchableOpacity, Modal, Alert, Share, TextInput } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import { useRoute } from '@react-navigation/native'
import axios from 'axios';
import { AppBar,  ReusableText, RadioButton, TopBar, HeightSpacer, WidthSpacer, Tiles, DescriptionText, } from '../../components';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, {Marker} from 'react-native-maps'
import * as Location from 'expo-location'
//import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaceDetails = () => {
   

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   navigation = useNavigation();

   const route = useRoute();
   const id = route.params;

   const [place, setPlaces] = useState(null)
   const [activeTab, setActiveTab] = useState('History');
   const topRef = useRef();
   const thumbRef = useRef();
   const [activeIndex, setActiveIndex] = useState(0);
   const [modalVisible, setModalVisible] = useState(false);
   const [rating, setRating] = useState(0);
   const [review, setReview] = useState('');
   const [averageRating, setAverageRating] = useState(0);
   const [isFavorite, setIsFavorite] = useState(false);

   const [mapRegion, setMapRegion] = useState({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
   });

   const [mapMyRegion, setMapMyRegion] = useState({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
   })

   const scrollToActiveIndex = (index) => {
      setActiveIndex(index);
      topRef.current.scrollToOffset({
         offset: index * SIZES.width,
         animated: true,
      });
   }

   const getDataFromDatabase = async () => {
    try {
        
        const response = await axios.get(`http://10.9.31.61:5003/api/places/${id}`);
        const placeData = response.data.place;
        setPlaces(placeData);
        setAverageRating(response.data.averageRating);

        setMapRegion({
         latitude: placeData.latitude,
         longitude: placeData.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421,
      });

    } catch (error) {
        console.error('Error:', error);
    }

   };

   const userLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();

      if(status !== 'granted') {
         setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      setMapMyRegion({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421,
      });
   }

   const [ userId, setUserId ] = useState();
   const [ profileImage, setProfileImage ] = useState();
   const getUser = async () => {
      try {
          const token = await AsyncStorage.getItem('token');
          
          if (!token) {
              console.log('User not authenticated.');
              return;
          }
  
          const response = await axios.get('http://10.9.31.61:5003/api/users', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          setUserId(response.data.id);
          setProfileImage(response.data.profile);
  
      } catch (error) {
          console.error('Error fetching user ID:', error);
          Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      }
  };
  

   useEffect(() => {
      getDataFromDatabase();
      userLocation();
      getUser();
      checkIfFavorite();
  }, [id]);

  const handleCallPress = () => {
   const phoneUrl = `tel:${place.phone}`;
   Linking.openURL(phoneUrl);
  }

  const openGoogleMaps = () => {
   const origin = 'My+Location'; 
   const destination = place.adress; 
   const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
   Linking.openURL(url);
};

const handleStarPress = (star) => {
   setRating(star);
};

const handleModalClose = () => {
   setReview('');
   setRating(0);
   setModalVisible(false);
};

const handleSubmit = async () => {
   try {
       const token = await AsyncStorage.getItem('token');
       if (!token) {
           Alert.alert('Error', 'You need to be logged in to submit a review.');
           return;
       }

       const authResponse = await axios.get('http://10.9.31.61:5003/api/check', {
           headers: {
               Authorization: `Bearer ${token}`
           }
       });

       const response = await axios.post(`http://10.9.31.61:5003/api/places/addReview/${id}`, {
           username: authResponse.data.username,
           profile: profileImage,
           rating,
           reviewText: review
       }, {
           headers: {
               Authorization: `Bearer ${token}`
           }
       });

       if (response.data.status) {
           Alert.alert('Success', 'Review added successfully!');
           handleModalClose();

           getDataFromDatabase();
           
       } else {
           Alert.alert('Error', 'Failed to add review.');
       }

   } catch (error) {
       console.error('Error:', error);
       Alert.alert('Error', 'Something went wrong. Please try again later.');
   }
};

const renderStars = (rating) => {
   const stars = [];
   for (let i = 1; i <= 5; i++) {
       stars.push(
           <MaterialIcons
               key={i}
               name={i <= rating ? 'star' : 'star-outline'}
               size={20}
               color={i <= rating ? COLORS.yellow : COLORS.grey}
           />
       );
   }
   return stars;
};

const handleShare = async () => {
   try {
     const result = await Share.share({
       message: `Check out this place: ${place.title} - ${place.description}\n\nView more at: exp://10.9.31.61:8081/--/roexplorer://${place.title}/${id}`,
     });

   } catch (error) {
     alert(error.message);
   }
 };

 const formatDate = (dateString) => {
   if (!dateString) return ''; 
   const date = new Date(dateString);
   return date.toLocaleDateString(undefined, {
       day: '2-digit',
       month: 'long',
       year: 'numeric'
   });
};

const checkIfFavorite = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          
          if (!token) {
            console.log('User not authenticated');
            return; 
          }
     
          const response = await axios.get('http://10.9.31.61:5003/api/users/favorites', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
     
          const isFav = response.data.favorites.some(fav => fav._id === id && fav.type === 'Place');
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
     };


     const handleAddToFavorites = async (itemId, itemType, countyId) => {
      try {
        const token = await AsyncStorage.getItem('token');
        const endpoint = isFavorite ? 'removeFromFavorites' : 'addToFavorites';
   
        if (!token) {
         Alert.alert('Error', 'You need to be logged in to add to favorite list.');
         return;
     }
   
      const authResponse = await axios.get('http://10.9.31.61:5003/api/check', {
            headers: {
               Authorization: `Bearer ${token}`
            }
      });
   
        const response = await axios.post(`http://10.9.31.61:5003/api/users/${endpoint}`, {
          userId: authResponse.data.userId, 
          itemId,
          itemType,
          countyId: countyId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
   
       if (response.status === 200) {
         setIsFavorite(!isFavorite);
       } else {
         Alert.alert('Error', 'Failed to update favorite status.');
       }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    };

  const renderContent = () => {
      switch(activeTab) {
         case 'Contact':
            return (
            <View style={[ {backgroundColor: currentTheme.background}]}>
               
                  {place.program && (
                     <>
                        <Tiles title={"Program: " + place.program} icon={'schedule'} />
                        <HeightSpacer height={10} />
                     </>
                  )}

               {place.phone && (
                  <>
                     <View style={reusable.rowWithSpace('space-between')}>
                        <View style={reusable.rowWithSpace('flex-start')}>
                                 <Tiles title={"Phone number: "} icon={'phone'}/>
                                 <TouchableOpacity onPress={handleCallPress}>
                                    <ReusableText
                                       text={place.phone}
                                       family={''}
                                       size={TEXT.medium}
                                       color={currentTheme.phone}
                                    />
                                 </TouchableOpacity>
                        </View>
                     </View>
                     <HeightSpacer height={10} />
                  </>
               )}

                  {place.price && (
                     <>
                        <Tiles title={"Ticket price: " + place.price} icon={'info-outline'}/>
                        <HeightSpacer height={10} />
                     </>
                  )}
                  
                  {place.adress && (
                     <>
                     <View style={styles.content}>
                           <View style={reusable.rowWithSpace('space-between')}>
                              <View style={reusable.rowWithSpace('flex-start')}>
                                       <Tiles title={"Address: "} icon={'near-me'}/>
                                       <TouchableOpacity onPress={openGoogleMaps}>
                                          <ReusableText
                                             text={place.adress}
                                             family={''}
                                             size={TEXT.medium}
                                             color={currentTheme.phone}
                                          />
                                       </TouchableOpacity>
                              </View>
                           </View>
                           <HeightSpacer height={10} />
                           </View>
                     </>
                  )}

                  
                  <HeightSpacer height={25}/>

                  <View>
                  <MapView style={styles.map} region={mapRegion}>
                     <Marker coordinate={mapRegion} title={place.title}/>
                     <Marker coordinate={mapMyRegion} title="My Location"/>
                  </MapView>

                  <TouchableOpacity style={styles.directionsButton} onPress={openGoogleMaps}>
                        <MaterialIcons name="directions" size={34} color="white" />
                  </TouchableOpacity>

                  </View>

                     <HeightSpacer height={40}/>

               </View>
            )
         case 'History':
            return <DescriptionText text={place.description} color={currentTheme.color} size={TEXT.medium}/>
         case 'Rating':
            return (
               <View style={[ {backgroundColor: currentTheme.background}]}>
                  <View style={reusable.rowWithSpace('space-between')}>
                     <View style={reusable.rowWithSpace('flex-start')}>
                        <ReusableText
                              text={'Reviews'}
                              family={'semibold'}
                              size={TEXT.medium}
                              color={currentTheme.color}
                        />

                        <WidthSpacer width={130} />
                        <View style={styles.modalContainer}>
                              <TouchableOpacity onPress={() => setModalVisible(true)}>
                                 <Tiles title={"Write a review"} icon={'note-alt'} />
                              </TouchableOpacity>
                                 <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                          setModalVisible(!modalVisible);
                                    }}>
                                    <View style={styles.modalBackground}>
                                          <View style={[styles.modalView, {backgroundColor: currentTheme.background}]}>
                                             <View style={styles.modalCenter}>
                                                <ReusableText
                                                      text={'Reviews'}
                                                      family={'semibold'}
                                                      size={TEXT.medium}
                                                      color={currentTheme.color}
                                                />

                                                <View style={styles.starsContainer}>
                                                   {[1, 2, 3, 4, 5].map(star => (
                                                      <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                                         <MaterialIcons
                                                            name={star <= rating ? 'star' : 'star-outline'}
                                                            size={40}
                                                            color={COLORS.yellow}
                                                         />
                                                      </TouchableOpacity>
                                                   ))}
                                                </View>
                                             </View>

                                             <ReusableText
                                                   text={'Add your comment:'}
                                                   family={'semibold'}
                                                   size={TEXT.small}
                                                   color={currentTheme.color}
                                             />

                                             <HeightSpacer height={10}/>
         
                                         

                                             <TextInput                     
                                                placeholder='Enter your review comment'
                                                placeholderTextColor={currentTheme.color}
                                                autoCorrect={false}
                                                style={styles.input}
                                                multiline={true}
                                                returnKeyType='done'
                                                backgroundColor={currentTheme.background}
                                                color={currentTheme.color}
                                                value={review}
                                                onChangeText={text => setReview(text)}
                                             />

                                             <HeightSpacer height={25}/>

                                             <View style={reusable.rowWithSpace('space-between')}>
                                                <View style={reusable.rowWithSpace('flex-start')}>

                                                   <TouchableOpacity style={styles.deleteButton} onPress={() => handleSubmit()}>
                                                         <Text style={styles.buttonTextDelete}>Submit</Text>
                                                   </TouchableOpacity>

                                                   <WidthSpacer width={35}/>

                                                   <TouchableOpacity style={styles.buttonCancel} onPress={()=> handleModalClose()}>
                                                         <Text style={styles.buttonTextCancel}>Cancel</Text>
                                                   </TouchableOpacity>
                                                </View>
                                             </View>
                                          </View>
                                    </View>
                                 </Modal>

                              
                        </View>
                     </View>
                  </View>
                  <HeightSpacer height={10}/>
                  <View style={[styles.reviewContainer, {backgroundColor: currentTheme.background}]}> 
                     {place.reviews.length > 0 ? (
                        place.reviews.map((review, index) => (
                           <View key={index} style={styles.reviewItem}>
                              <View style={styles.reviewHeader}>
                                 <View style={{flexDirection: 'row'}}>
                                    <View style={styles.profileAvatarWrapper}>
                                          <Image
                                             alt="Profile picture"
                                             source={{ uri: review.profile }}
                                             style={styles.profileAvatarDelete}
                                          />
                                    </View>
                                    <Text style={[styles.reviewUsername, {color: currentTheme.color}]}>{review.username}</Text>
                                 </View>
                                 
                                 <View style={styles.starsContainer}>
                                    {renderStars(review.rating)}
                                 </View>
                              </View>
                              <Text style={[styles.reviewText, {color: currentTheme.color}]}>{review.reviewText}</Text>
                              <Text style={[styles.reviewDate, {color: currentTheme.color}]}>{formatDate(review.date)}</Text>
                           </View>
                        ))
                     ) : (
                        <Text style={[styles.noReviews, {color: currentTheme.color}]}>No reviews yet.</Text>
                     )}
                  </View>
                  
               </View>
            
            )
         default:
            return null;
      }
};

  return (
   <View style={[ {backgroundColor: currentTheme.background}]}>
   <ScrollView showsVerticalScrollIndicator={false} style={[ {backgroundColor: currentTheme.background}]}>
      {place && (
           <View>
            <View>
              <FlatList
                 ref={topRef}
                 data={place.imageUrls}
                 keyExtractor={(url, index) => index.toString()}
                 horizontal
                 pagingEnabled
                 showsHorizontalScrollIndicator={false}
                 onMomentumScrollEnd={ev => {
                    scrollToActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / SIZES.width))
                 }}
                 renderItem={({ item: url }) => (
                    <View style={styles.imageContainer}>
                       <Image source={{ uri: url }} style={styles.image} />
                    </View>
                 )}
              />

                  <FlatList
                     data={place.imageUrls}
                     keyExtractor={(url, index) => index.toString()}
                     style={{ position: 'absolute', bottom: 10, left: (SIZES.width-45)/2 }}
                     showsHorizontalScrollIndicator={false}
                     horizontal
                     renderItem={({ item: url, index }) => (
                        <View>
                        <RadioButton
                           selected={activeIndex === index}
                           onPress={() => scrollToActiveIndex(index)}
                        />
                        </View>
                     )}
                  />

              <AppBar
                 top={45}
                 left={5}
                 right={5}
                 icon={"arrow-back-ios"}
                 icon1={isFavorite ? "favorite" : "favorite-outline"}
                 color1={COLORS.grey}
                 color4={COLORS.red}
                 icon2={"ios-share"}
                 color2={COLORS.grey}
                 onPress={() => navigation.goBack()}
                 onPress1={()=> handleAddToFavorites(place._id, 'Place')}
                 onPress2={() => handleShare()}
              />

            </View>

            <HeightSpacer height={25}/>

            <View style={{marginHorizontal: 20, borderRadius: 20 }}>
            <ReusableText
                 text={place.title}
                 family={'extralightIt'}
                 color={currentTheme.color}
                 size={TEXT.xLarge}
              />

            <HeightSpacer height={5}/>

            <View style={reusable.rowWithSpace('space-between')}>
               <View style={reusable.rowWithSpace('flex-start')}>
                     <MaterialIcons name="place" size={SIZES.medium} color={currentTheme.color}/>
                              
                     <WidthSpacer width={5}/>

                        <ReusableText
                              text={place.location}
                              family={''}
                              size={SIZES.medium}
                              color={currentTheme.color}
                       />
               </View>    
            </View>
            
            <HeightSpacer height={20}/>

            <TopBar activeTab={activeTab} setActiveTab={setActiveTab}  averageRating={averageRating}/>

               <View style={[ styles.contentContainer, {backgroundColor: currentTheme.background}]}>
                  {renderContent()}
                  <HeightSpacer height={275}/>
               </View>
            </View>
           </View>
           
           
      )}
   </ScrollView>
</View>
 );
}

export default PlaceDetails

const styles = StyleSheet.create({
   container: {
      alignItems: 'center'
   },
   imageContainer: {
      width: SIZES.width,
  },
  image: {
      width: '100%',
      height: 320,
      resizeMode: 'cover'
  },
  contentContainer: {
      flex: 1,
      padding: 10,
  },
  content: {
      flex: 1,
      marginRight: 150
  },
  map: {
      width: SIZES.width-50,
      height: 200
  },
  directionsButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: COLORS.primary,
      padding: 5,
   },
   modalContainer: {
      flexDirection: 'row',
   },
   modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
   },
   modalCenter: {
      alignItems: 'center'
   },
   modalView: {
      width: '80%', 
      margin: 20,
      borderRadius: 20,
      padding: 35,
      
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
   closeText: {
      marginTop: 15,
      color: COLORS.primary,
      fontWeight: 'bold',
   },

   starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20,
  },
  input: {
      borderWidth: 1,
      borderRadius: 9,
      borderColor: COLORS.grey,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: SIZES.medium,
      marginBottom: 10,
      height: 120
   },
   deleteButton: {
      flexDirection: 'row',
      height: 34,
      width: 105,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: COLORS.blue,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonTextDelete: {
      color: COLORS.blue,
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonCancel: {
      flexDirection: 'row',
      height: 34,
      width: 105,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: COLORS.red,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonTextCancel: {
      color: COLORS.red,
      fontSize: 16,
      fontWeight: 'bold',
    },
    reviewContainer: {
      padding: 0,
      backgroundColor: COLORS.white,
  },
   reviewItem: {
      borderWidth: 1,
      borderColor: COLORS.grey,
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
   },
   reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   reviewUsername: {
      fontWeight: 'bold',
      marginLeft: 5,
      marginTop: 5
   },
   starsContainer: {
      flexDirection: 'row',
   },
   reviewText: {
      marginTop: 5,
   },
   reviewDate: {
      marginTop: 5,
      textAlign: 'right'
   },
   noReviews: {
      textAlign: 'center',
      marginTop: 10,
      color: COLORS.grey,
   },
   profileAvatarWrapper: {
      position: 'relative',
  },
  profileAvatarDelete: {
      width: 30,
      height: 30,
      borderRadius: 9999,
      borderWidth: 2,
      borderColor: COLORS.white
    },
})

