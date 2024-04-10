import React from 'react';
import { View, Image } from 'react-native';
import styles from './slides.style'
import { HeightSpacer, ReusableBtn, ReusableText } from '../index';
import { COLORS, SIZES } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

 const Slides = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View>
      <Image source={item.image} style={styles.image}/>
        <View style={styles.stack}>
           <ReusableText
            text={item.title}
            family={'semiboldIt'}
            size={SIZES.xLarge}
            color={COLORS.white}
           />

           <HeightSpacer height={20} />

           <ReusableBtn
            onPress={() => navigation.navigate('Bottom')}
            btnText={"Get Started"}
            width={(SIZES.width - 50)/2.2}
            backgroundColor={COLORS.red}
            borderColor={COLORS.red}
            borderWidth={0}
            textColor={COLORS.white}
           />

        </View>
    </View>
  );
};

export default Slides;
