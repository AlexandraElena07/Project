import React, { useContext, useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import { useRoute } from '@react-navigation/native';
import { DescriptionText, NetworkImage, HeightSpacer, BottomButtons, ReusableText } from '../../components/index';
import { SIZES, TEXT, COLORS } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe'

const AboutCounty = () => {
   const navigation = useNavigation();

   const userTheme = useContext(themeContext);
   const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

   const [playing, setPlaying] = useState(false);

   

   const route = useRoute();
    const {item} = route.params;

    const handlePressFavorite = () => {
        // logica pentru adăugarea la favorite
        console.log('Adăugat la favorite');
      };
    
      const handlePressShare = () => {
        // logica pentru partajare
        console.log('Partajat');
      };

      const onStateChange = useCallback((state) => {
        if (state === "ended") {
          setPlaying(false);
        }
      }, []);
      

   return (
    <View style={styles.container}>
        <ScrollView style={[ { backgroundColor: currentTheme.background}]}>
            <NetworkImage source={item.imageUrl} width={"100%"} height={260} radius={0} resizeMode={'cover'}/>

            <View style={styles.description}>

            <HeightSpacer height={SIZES.small}/>

            <ReusableText
                text={'About ' + item.county + ' County'}
                family={'bold'}
                size={TEXT.large}
                color={currentTheme.color}
            />

            <HeightSpacer height={SIZES.small}/>

            <DescriptionText text={item.description} color={currentTheme.color} colorButton={currentTheme.color} size={TEXT.medium}/>

            <HeightSpacer height={SIZES.small}/>

            <View style={{alignContent:'center'}}></View>

            <YoutubePlayer
                height={300}
                play={false}
                videoId={item.videoId}
                onChangeState={onStateChange}
                />
            <View/>
            </View>
        </ScrollView>

        <View>
            <BottomButtons
                onPressFavorite={handlePressFavorite}
                onPressShare={handlePressShare}
            />
        </View>
    </View>
      
   );
}

export default AboutCounty

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    description: {
        marginHorizontal: 20,
        paddingTop: 20
    }
})
