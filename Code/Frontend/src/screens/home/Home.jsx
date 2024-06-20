import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, VirtualizedList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import reusable from '../../components/Reusable/reusable.style';
import { HeightSpacer, ReusableText, NetworkImage, WidthSpacer } from '../../components';
import { TEXT, COLORS, SIZES } from '../../constants/theme'
import { AntDesign } from "@expo/vector-icons"
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'

const Home = () => {

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   const navigation = useNavigation();

   const [counties, setCounties] = useState([]);
   const [topPlaces, setTopPlaces] = useState([]);
   const [topHotels, setTopHotels] = useState([]);

   const getDataFromDatabase = async () => {
      try {
         const countiesResponse = await axios.get('http://10.9.31.61:5003/api/counties');
         setCounties(countiesResponse.data.counties);

         const topPlacesResponse = await axios.get('http://10.9.31.61:5003/api/places/topPlaces');
         setTopPlaces(topPlacesResponse.data);

         const topHotelsResponse = await axios.get('http://10.9.31.61:5003/api/hotels/topHotels');
         setTopHotels(topHotelsResponse.data);

      } catch (error) {
         console.error('Error:', error);
      }
   };

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         getDataFromDatabase();
      });

      return unsubscribe;
   }, [navigation]);

   const renderStars = (numStars) => (
      Array.from({ length: numStars }, (_, index) => (
         <MaterialIcons
            key={index}
            name="star"
            size={15}
            color={COLORS.yellow}
         />
      ))
   );


   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
         <ScrollView showsVerticalScrollIndicator={false} style={[reusable.container, { backgroundColor: currentTheme.background }]}>
            <View>
               <View style={reusable.rowWithSpace('space-between')}>
                  {userTheme === 'dark' ? (
                     <Image
                        source={require('../../../assets/images/logo3White.png')}
                        style={{ resizeMode: 'contain', width: 140, height: 65, marginLeft: -3 }}
                     />
                  ) : (
                     <Image
                        source={require('../../../assets/images/logo3.png')}
                        style={{ resizeMode: 'contain', width: 140, height: 65, marginLeft: -8 }}
                     />
                  )}

                  <TouchableOpacity
                     onPress={() => navigation.navigate('Search')}>
                     <AntDesign name="search1" size={26} color={currentTheme.color} />
                  </TouchableOpacity>
               </View>

               <HeightSpacer height={SIZES.large} />

               <ReusableText
                  text={'Places'}
                  family={'medium'}
                  size={TEXT.large}
                  color={currentTheme.color}
               />

               <View>
                  <HeightSpacer height={20} />

                  <VirtualizedList
                     data={counties}
                     horizontal
                     keyExtractor={(item) => item._id}
                     showsHorizontalScrollIndicator={false}
                     getItemCount={(data) => data.length}
                     getItem={(data, index) => data[index]}
                     renderItem={({ item, index }) => (
                        <View style={{ marginRight: SIZES.medium }}>
                           <TouchableOpacity onPress={() => navigation.navigate('CountyDetails', { item })}>
                              <View>
                                 <NetworkImage source={item.imageUrl} width={90} height={90} radius={12} resizeMode={'cover'} />

                                 <HeightSpacer height={3} />

                                 <ReusableText
                                    text={item.county}
                                    family={'medium'}
                                    size={TEXT.small}
                                    color={currentTheme.color}
                                    align={"center"}
                                 />
                              </View>
                           </TouchableOpacity>
                        </View>
                     )}
                  />

                  <HeightSpacer height={35} />

                  <ReusableText
                     text={'Recommendation'}
                     family={'medium'}
                     size={TEXT.large}
                     color={currentTheme.color}
                  />

                  <HeightSpacer height={20} />

                  <VirtualizedList
                     data={topPlaces}
                     horizontal
                     keyExtractor={(item) => item._id}
                     showsHorizontalScrollIndicator={false}
                     getItemCount={(data) => data.length}
                     getItem={(data, index) => data[index]}
                     renderItem={({ item, index }) => (
                        <View style={{ marginRight: SIZES.medium }}>
                           <TouchableOpacity style={[styles.touristContainer, { backgroundColor: currentTheme.backgroundTiles }]} onPress={() => navigation.navigate('PlaceDetails', item._id)}>
                              <View style={reusable.rowWithSpace('flex-start')}>
                                 <NetworkImage source={item.imageUrls[0]} width={80} height={80} radius={12} />
                                 <WidthSpacer width={15} />
                                 <View>
                                    <ReusableText
                                       text={item.title}
                                       family={'medium'}
                                       size={SIZES.medium}
                                       color={currentTheme.color}
                                    />
                                    <HeightSpacer height={6} />
                                    <ReusableText
                                       text={item.location}
                                       family={'medium'}
                                       size={14}
                                       color={currentTheme.color}
                                    />
                                    <HeightSpacer height={12} />
                                    <View style={reusable.rowWithSpace('flex-start')}>
                                       <MaterialIcons name='star' size={15} color={COLORS.yellow} />
                                       <WidthSpacer width={5} />
                                       <ReusableText
                                          text={item.averageRating.toFixed(1)}
                                          family={'medium'}
                                          size={15}
                                          color={currentTheme.color}
                                       />
                                       <WidthSpacer width={5} />
                                       <ReusableText
                                          text={`(${item.reviews.length} Reviews)`}
                                          family={'medium'}
                                          size={14}
                                          color={currentTheme.color}
                                       />
                                    </View>
                                 </View>
                              </View>
                           </TouchableOpacity>
                        </View>
                     )} />

                  <HeightSpacer height={35} />

                  <ReusableText
                     text={'Best Accommodation'}
                     family={'medium'}
                     size={TEXT.large}
                     color={currentTheme.color}
                  />

                  <HeightSpacer height={20} />

                  <VirtualizedList
                     data={topHotels}
                     horizontal
                     keyExtractor={(item) => item._id}
                     contentContainerStyle={{ columnGap: SIZES.medium }}
                     showsHorizontalScrollIndicator={false}
                     getItemCount={(data) => data.length}
                     getItem={(data, index) => data[index]}
                     renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.hotelContainer, { backgroundColor: currentTheme.backgroundTiles }]} onPress={() => navigation.navigate('HotelDetails', item._id)}>
                           <View style={{ alignItems: 'center' }}>
                              <View style={{ position: 'relative' }}>
                                 <NetworkImage source={item.imageUrls[0]} width={170} height={170} radius={12} />
                                 <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                    <View style={reusable.rowWithSpace('flex-start')}>
                                       {renderStars(item.star)}
                                    </View>
                                 </View>
                                 <HeightSpacer height={10} />
                              </View>
                           </View>

                           <View>

                              <ReusableText
                                 text={item.title}
                                 family={'medium'}
                                 size={SIZES.medium}
                                 color={currentTheme.color}
                              />

                              <HeightSpacer height={6} />

                              <ReusableText
                                 text={item.location}
                                 family={'medium'}
                                 size={14}
                                 color={currentTheme.color}
                              />

                              <HeightSpacer height={12} />

                              <View style={reusable.rowWithSpace('flex-start')}>
                                 <MaterialIcons name='star' size={15} color={COLORS.yellow} />

                                 <WidthSpacer width={5} />
                                 <ReusableText
                                    text={item.averageRating.toFixed(1)}
                                    family={'medium'}
                                    size={15}
                                    color={currentTheme.color}
                                 />
                                 <WidthSpacer width={5} />
                                 <ReusableText
                                    text={`(${item.reviews.length} Reviews)`}
                                    family={'medium'}
                                    size={14}
                                    color={currentTheme.color}
                                 />

                              </View>

                           </View>

                        </TouchableOpacity>

                     )}
                  />

               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

export default Home

const styles = StyleSheet.create({
   touristContainer: {
      padding: 10,
      borderRadius: 12
   },
   hotelContainer: {
      padding: 10,
      borderRadius: 12,
      width: 190,
   },
})


