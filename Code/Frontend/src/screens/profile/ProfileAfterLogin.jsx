import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './profileAfter';
import * as Updates from 'expo-updates';
import { COLORS, SIZES } from '../../constants/theme';
import { HeightSpacer, ReusableText, WidthSpacer, ReusableBtn } from '../../components/index';
import { MaterialIcons } from '@expo/vector-icons';
import { ProfileTile } from "../../components"
import axios from 'axios';
import reusable from "../../components/Reusable/reusable.style";

const PROFILE_PICTURE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&usqp=CAU';

const ProfileAfterLogin = ({route}) => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigation = useNavigation();

    const getDataFromDatabase = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get('http://10.9.31.61:5003/api/users', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUsername(response.data.username);
          setEmail(response.data.email);
          setProfile(response.data.profile);
        
          setIsAuthenticated(true);
          setResponseData(response.data);

        } catch (error) {
          console.error('Error fetching username:', error);
          if (error.response && error.response.status === 403) {
            Alert.alert('Error', 'Authentication failed. Please login again.');
            handleLogout(); 
          } else {
            Alert.alert('Error', 'An error occurred while fetching username.');
          }
        }
      };
    
    useEffect(() => {
        getDataFromDatabase();
    }, []);

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

    const handleDeleteAccount = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete('http://10.9.31.61:5003/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            });

        await AsyncStorage.removeItem('token');
      
        Alert.alert('Success', response.data.message, () => {
           setTimeout(async () => {
                try {
                    await Updates.reloadAsync();
                    setLoading(true);
                } catch (error) {
                    console.error('Reloading failed:', error.message);
                }
            }, 2000);
        });

        

        } catch (error) {
            Alert.alert('Error', 'An error occurred while deleting your account. Please try again later.');
            console.error('Error:', error);
        }
    };
    
    
    return (
        loading ? ( 
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={SIZES.xxLarge} color={COLORS.darkGrey} />
            </View>
        ) : (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.profile}>
                        <TouchableOpacity>
                            <View style={styles.profileAvatarWrapper}>
                                <Image
                                    alt="Profile picture"
                                    source={{ uri: profile ? profile : PROFILE_PICTURE }}
                                    style={styles.profileAvatar}
                                />
                            </View>
                        </TouchableOpacity>

                        <HeightSpacer height={10} />

                        <View style={styles.username}>
                            <ReusableText
                                text={username}
                                family={'medium'}
                                size={SIZES.large}
                                color={COLORS.black}
                            />
                            <WidthSpacer width={10}/>
                            <MaterialIcons onPress={() => navigation.navigate('UpdateProfile', {data: responseData})} name="arrow-forward-ios" size={SIZES.medium} color={COLORS.black} />
                        </View>

                        <HeightSpacer height={10} />

                    </View>

                    <View style={styles.option}>
                        <ReusableText
                            text={'My Account'}
                            family={'semibold'}
                            size={SIZES.medium}
                            color={COLORS.black}
                            />

                    </View>

                    <View>
                        <ProfileTile title={"Change personal information"} icon={'person'} onPress={() => navigation.navigate('UpdateProfile', {data: responseData})}/>
                        <HeightSpacer height={2} />
                        <ProfileTile title={"Delete your account"} icon={'delete'} onPress={() => setModalVisible(true)}/>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                            setModalVisible(!modalVisible);
                            }}>
                            
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>

                                    <Text style={styles.modalText}>Delete your account and personal info</Text>

                                    <Text style={styles.textStyle}>Deleting your account is a permanent action and will result in the loss of access to all features of this app. Your saved places, favorite lists, followed pages, and personal information will be permanently removed.</Text>

                                    <View style={styles.profile}>
                                        <View style={styles.profileAvatarWrapper}>
                                            <Image
                                                alt="Profile picture"
                                                source={{ uri: profile ? profile : PROFILE_PICTURE }}
                                                style={styles.profileAvatarDelete}
                                            />
                                        </View>
                                        <HeightSpacer height={10} />
                                        <View style={styles.email}>
                                            <ReusableText
                                                text={email}
                                                family={'medium'}
                                                size={SIZES.small}
                                                color={COLORS.darkGrey}
                                            />                  
                                        </View>
                                        <HeightSpacer height={10} />
                                    </View>

                                    <Text style={styles.textStyle}>If you wish to proceed with deleting your account, please click the DELETE button below.</Text>

                                    <Text style={styles.textStyle}>If you have changed your mind, click CANCEL.</Text>
                                    
                                    <HeightSpacer height={150} />
                                    
                                    <View style={reusable.rowWithSpace('space-between')}>
                                        <View style={reusable.rowWithSpace('flex-start')}>

                                            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                                                <Text style={styles.buttonTextDelete}>Delete</Text>
                                            </TouchableOpacity>

                                            <WidthSpacer width={35}/>

                                            <TouchableOpacity style={styles.buttonCancel} onPress={() => setModalVisible(!modalVisible)}>
                                                <Text style={styles.buttonTextCancel}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>


                    </View>

                    <HeightSpacer height={20} />

                    <View style={styles.option}>
                        <ReusableText
                            text={'Preferences'}
                            family={'semibold'}
                            size={SIZES.medium}
                            color={COLORS.black}
                            />

                    </View>

                    <View>
                        <ProfileTile title={"Language"} icon={'flag'}/>
                        <HeightSpacer height={2} />
                        <ProfileTile title={"Dark mode"} icon={'dark-mode'} />
                    </View>

                    <HeightSpacer height={20} />

                    <View style={styles.option}>
                        <ReusableText
                            text={'About App'}
                            family={'semibold'}
                            size={SIZES.medium}
                            color={COLORS.black}
                            />

                    </View>

                    <View>
                        <ProfileTile title={"About Us"} icon={'info'} />
                        <HeightSpacer height={2} />
                        <ProfileTile title={"Contact Us"} icon={'contact-page'} />   
                    </View>

                    <HeightSpacer height={45} />

                    <View style={styles.profile}>
                        <ReusableBtn
                            onPress={handleLogout}
                            btnText={"Sign Out"}
                            width={(SIZES.width - 50)/2.2}
                            backgroundColor={COLORS.white}
                            borderColor={COLORS.red}
                            borderWidth={1}
                            textColor={COLORS.red}
                        />

                        <HeightSpacer height={15} />

                        <ReusableText
                            text={'Authenticated as ' + email}
                            family={'regular'}
                            size={SIZES.small}
                            color={COLORS.black}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    );
}

export default ProfileAfterLogin;