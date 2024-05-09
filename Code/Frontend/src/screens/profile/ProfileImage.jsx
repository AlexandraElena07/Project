import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import styles from './profileAfter'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const picture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQha5fuRV9s_zsvk3v-VERQ-KZbe76mE6xGMw&usqp=CAU';

const ProfileImage = () => {
    const [profile, setProfile] = useState('');

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
            <View>
                <Image source={{ uri: profile ? profile : picture}} style={styles.enlargedImage}/>
            </View>
    );
}

export default ProfileImage;
