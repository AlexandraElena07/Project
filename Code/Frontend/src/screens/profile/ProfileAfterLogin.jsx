import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import styles from './profileAfter';
import * as Updates from 'expo-updates';
import { COLORS, SIZES } from '../../constants/theme';

const PROFILE_PICTURE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmPODrFKZohmZmcH1KcBTuWHdd7SdPFp1RIw&usqp=CAU';

const ProfileAfterLogin = () => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        await AsyncStorage.removeItem('token');
        
        setLoading(true); 

        try {
            await Updates.reloadAsync();
        } catch (error) {
            console.error('Reloading failed:', error.message);
            setLoading(false);
        }
    };
    
    return (
        loading ? ( 
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={SIZES.xxLarge} color={COLORS.darkGrey} />
            </View>
    ) : (<SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profile}>
                    <TouchableOpacity onPress={() => { }}>
                        <View style={styles.profileAvatarWrapper}>
                            <Image
                                alt="Profile picture"
                                source={{ uri: PROFILE_PICTURE }}
                                style={styles.profileAvatar}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Deconectare</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>)
    
    );
}

export default ProfileAfterLogin;
