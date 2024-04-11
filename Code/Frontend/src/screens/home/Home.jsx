import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import reusable from '../../components/Reusable/reusable.style';
import { HeightSpacer, ReusableText } from '../../components';
import { TEXT, COLORS, SIZES } from '../../constants/theme'
import { AntDesign } from "@expo/vector-icons"
import styles from './home.style';

const Home = ({navigation}) => {
  return (
      <SafeAreaView style={reusable.container}>
        <View>
         <View style={reusable.rowWithSpace('space-between')}>
            <ReusableText
               text={'Hi, User!'}
               family={'regular'}
               size={TEXT.large}
               color={COLORS.black}
            />

            <TouchableOpacity 
               style={styles.box}
               onPress={() => navigation.navigate('Search')}>
               <AntDesign name="search1" size={26} color={COLORS.black} />
            </TouchableOpacity>
         </View>

         <HeightSpacer height={SIZES.large}/>

         <ReusableText
               text={'Places'}
               family={'medium'}
               size={TEXT.large}
               color={COLORS.black}
         />

        </View>
      </SafeAreaView>
  );
}

export default Home


