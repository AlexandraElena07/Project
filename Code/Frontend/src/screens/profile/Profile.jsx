import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import reusable from '../../components/Reusable/reusable.style';
import { HeightSpacer, ReusableBtn, ReusableText } from '../../components';
import { TEXT, COLORS, SIZES } from '../../constants/theme'
import styles from './profile.style';

const Profile = ({navigation}) => {
  return (
   <View style={styles.container}>
      
           <ReusableText
            text={'ROExplorer'}
            family={'semiboldIt'}
            size={SIZES.xLarge}
            color={COLORS.red}
           />
      
     <Image source={require('../../../assets/images/profile1.png')} style={styles.image} /> 

     <HeightSpacer height={30} />

     <ReusableBtn
            onPress={() => navigation.navigate('LogIn')}
            btnText={"Log in"}
            width={(SIZES.width - 50)}
            backgroundColor={COLORS.red}
            borderColor={COLORS.red}
            borderWidth={0}
            textColor={COLORS.white}
      />

      <HeightSpacer height={30} />

      <ReusableBtn
            onPress={() => navigation.navigate('Registration')}
            btnText={"Create new account"}
            width={(SIZES.width - 50)}
            backgroundColor={COLORS.transparency}
            borderColor={COLORS.red}
            borderWidth={2}
            textColor={COLORS.red}
      />

      
</View>
  );
}

export default Profile

