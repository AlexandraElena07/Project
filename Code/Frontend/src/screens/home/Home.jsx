import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, VirtualizedList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import reusable from '../../components/Reusable/reusable.style';
import { HeightSpacer, ReusableText, NetworkImage } from '../../components';
import { TEXT, COLORS, SIZES } from '../../constants/theme'
import { AntDesign } from "@expo/vector-icons"
import styles from './home.style';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Home = () => {

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   const navigation = useNavigation();

   const [counties, setCounties] = useState([]);

   const getDataFromDatabase = async () => {
    try {
        
        const response = await axios.get('http://10.9.31.61:5003/api/getcounty');
        setCounties(response.data.counties);

    } catch (error) {
        console.error('Error:', error);
    }

   };

   useEffect(() => {
      getDataFromDatabase();
  }, []);

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
         <ScrollView style={[reusable.container, {backgroundColor: currentTheme.background}]}>
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

               <HeightSpacer height={SIZES.large}/>

               <ReusableText
                     text={'Places'}
                     family={'medium'}
                     size={TEXT.large}
                     color={currentTheme.color}
               />

               <View>
                  <HeightSpacer height={20}/>

                  <VirtualizedList
                     data={counties}
                     horizontal
                     keyExtractor={(item) => item._id}
                     showsHorizontalScrollIndicator={false}
                     getItemCount={(data) => data.length}
                     getItem={(data, index)=>data[index]}
                     renderItem={({item, index}) => (
                        <View style={{marginRight:SIZES.medium}}>
                           <TouchableOpacity onPress={() => navigation.navigate('CountyDetails', {item})}>
                              <View>
                                 <NetworkImage source={item.imageUrl} width={90} height={90} radius={12} resizeMode={'cover'}/>

                                 <HeightSpacer height={3}/>

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

                  <HeightSpacer height={35}/>

                  <ReusableText
                     text={'Recommandation'}
                     family={'medium'}
                     size={TEXT.large}
                     color={currentTheme.color}
                  />

               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

export default Home


