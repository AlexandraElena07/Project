import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import { useRoute } from '@react-navigation/native'
import { DescriptionText, HeightSpacer, NetworkImage, ReusableText } from '../../components/index';
import axios from 'axios';
import AppBar from '../../components/Reusable/AppBar';
import { COLORS, TEXT, SIZES } from '../../constants/theme';

const CountyDetails = ({navigation}) => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const route = useRoute();
    const {item} = route.params;

    const [counties, setCounties] = useState([]);

    return (
        <ScrollView style={[styles.container, { backgroundColor: currentTheme.background}]}>
            <NetworkImage source={item.imageUrl} width={"100%"} height={200} radius={0} resizeMode={'cover'}/>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AboutCounty', {item})}>
                    <Text style={styles.text}>Discover {item.county} County</Text>
                </TouchableOpacity>
            </View>

                    <View style={{alignContent:'center'}}></View>
                
        </ScrollView>
    );
}

export default CountyDetails;

const styles = StyleSheet.create ({
    container: {
        flex: 1
    },
    overlay: {
        position: 'absolute',
        bottom: 0, 
        left: 0,
        right: 0,
        alignItems: 'center',
      },
    button: {
        backgroundColor: COLORS.white,
        paddingVertical:5,
        paddingHorizontal: 20,
        borderRadius: 50,
        minWidth: 60, 
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start', 
        marginVertical: 10, 
        marginHorizontal: 10,
        opacity: .6, 
      },
      text: {
        color: COLORS.black,
        textAlign: 'center',
        fontSize: TEXT.small,
        fontFamily: 'bold'
      },
})
 