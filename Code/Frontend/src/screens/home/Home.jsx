import React, { useContext } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import reusable from '../../components/Reusable/reusable.style';
import { HeightSpacer, ReusableText } from '../../components';
import { TEXT, COLORS, SIZES } from '../../constants/theme'
import { AntDesign } from "@expo/vector-icons"
import styles from './home.style';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const Home = ({navigation}) => {

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
         <ScrollView style={[reusable.container, {backgroundColor: currentTheme.background}]}>
         <View>
            <View style={reusable.rowWithSpace('space-between')}>
               <ReusableText
                  text={'Hi, User!'}
                  family={'regular'}
                  size={TEXT.large}
                  color={currentTheme.color}
               />

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

         </View>
         </ScrollView>
      </SafeAreaView>
   );
}

export default Home


