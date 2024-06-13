import React, { useState, useEffect, useContext } from 'react';
import { Image, View } from 'react-native';
import styles from './profileAfter'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const picture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs6SXBiscMksrAbCit__F5GntSP9nC3p0_eg&usqp=CAU';

const ProfileImage = () => {
    const [profile, setProfile] = useState('');
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const getDataFromDatabase = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://10.9.31.61:5003/api/users', {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            
            setProfile(response.data.profile);

        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getDataFromDatabase();
    }, []);

    return (
            <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
                <Image source={{ uri: profile ? profile : picture}} style={styles.enlargedImage}/>
            </View>
    );
}

export default ProfileImage;
