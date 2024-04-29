import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import styles from './updateProfile.style';
import { HeightSpacer, ReusableText, WidthSpacer, ReusableBtn } from '../../components';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import reusable from "../../components/Reusable/reusable.style";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as Updates from 'expo-updates';

const PROFILE_PICTURE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&usqp=CAU';

const UpdateProfile = () => {
    const navigation = useNavigation();
    const [profile, setProfile] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const route = useRoute();

    let result = {};

    const takePhoto = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if(!result.canceled){
                await saveImage(result.assets[0].uri);
            }
        } catch (error){
            alert("Error uploading image " + error.message);
        }
    }

    const selectImage = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                await saveImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error uploading image " + error.message);
        }
    };

    const saveImage = async (profile) => {
        try {
            setProfile(profile);
            
        } catch (error) {
            throw(error)
        }
    }

    const removeImage = async () => {
        try {
            saveImage(null);
        } catch ({message}){
            Alert.alert(message)
        }
    }    

    useEffect(() => {
        const responseData = route.params.data;
        setUsername(responseData.username);
        setEmail(responseData.email); 
        setProfile(responseData.profile);
    }, [route.params.data])


    const updateProfile = async () => {
        const formData = {
            username: username,
            email: email,
            profile: profile
        }
    
        try {
            const response = await axios.post('http://192.168.0.105:5003/api/update', formData);
    
            if (response.data.status === true) {
                console.log('Profil actualizat cu succes!');
                
                Alert.alert('Success', response.data.message, () => {
                    setTimeout(async () => {
                       try {
                         await Updates.reloadAsync();
                       } catch (error) {
                         console.error('Reloading failed:', error.message);
                       }
                     }, 2000);
                  });

            } else {
                console.error('Eroare la actualizarea profilului:', response.data.message);
                Alert.alert('Error', 'Failed to update profile');
            }
    
        } catch (error) {
            console.error('Eroare la actualizarea profilului:', error);
            Alert.alert('Error', 'An error occurred while updating profile');
        }   

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
            <View>
                <ReusableText
                    text={'Change your personal data'}
                    family={''}
                    size={TEXT.xLarge}
                    color={COLORS.black}
                />

                <HeightSpacer height={30}/>

                <ReusableText
                    text={'Profile Photo'}
                    family={'semibold'}
                    size={TEXT.large}
                    color={COLORS.black}
                />

                <HeightSpacer height={20}/>

                <View style={reusable.rowWithSpace('space-between')}>
                    <View style={reusable.rowWithSpace('flex-start')}>
                        <TouchableOpacity onPress={() => takePhoto()}>
                                <View style={styles.profileAvatarWrapper}>
                                
                                    <Image
                                        alt="Profile picture"
                                        source={{ uri: profile ? profile : PROFILE_PICTURE }}
                                        style={styles.profileAvatar}
                                    />
                                    
                                    <TouchableOpacity style={styles.cameraIconContainer} onPress={takePhoto}>
                                        <MaterialIcons name="photo-camera" style={styles.cameraIcon} />
                                    </TouchableOpacity>
                                    
                                </View>
                            </TouchableOpacity>
                            
                        <WidthSpacer width={20}/>
                        
                        <View>
                            <TouchableOpacity style={styles.buttonAdd} onPress={selectImage}>
                                <MaterialIcons name="edit" size={SIZES.medium} color={COLORS.blue} marginRight={5} />
                                <Text style={styles.buttonTextAdd}>Change picture</Text>
                            </TouchableOpacity>

                            <HeightSpacer height={15}/>

                            <TouchableOpacity style={styles.buttonRemove} onPress={removeImage}>
                                <MaterialIcons name="delete" size={SIZES.medium} color={COLORS.red} marginRight={5} />
                                <Text style={styles.buttonTextRemove}>Remove picture</Text>
                            </TouchableOpacity>
                        </View>
                            
                    </View>

                    

                </View>

            </View>

            <HeightSpacer height={15}/>

            <Text style = {{color:COLORS.darkGrey}}>JPG or PNG format. </Text>
            <Text style = {{color:COLORS.darkGrey}}>Picture layout: square. </Text>

            <HeightSpacer height={35}/>

            <ReusableText
                    text={'Personal Data'}
                    family={'semibold'}
                    size={TEXT.large}
                    color={COLORS.black}
            />

            <HeightSpacer height={20}/>

            <ReusableText
                text={'Username:'}
                family={''}
                size={TEXT.medium}
                color={COLORS.darkGrey}
            />

            <HeightSpacer height={5}/>

            <TextInput                     
                placeholder='Enter your username'
                autoCapitalize='none'
                autoCorrect={false}
                style={styles.input}
                defaultValue={username}
                onChangeText={(text) => setUsername(text)}               
            />

            <HeightSpacer height={10}/>

            <ReusableText
                text={'Email:'}
                family={''}
                size={TEXT.medium}
                color={COLORS.darkGrey}
            />

            <HeightSpacer height={5}/>

            <TextInput                     
                placeholder='Enter your email'
                autoCapitalize='none'
                autoCorrect={false}
                style={styles.inputEmail}
                defaultValue={email}
                editable={false}
            />
            <HeightSpacer height={55}/>

            <View style={{alignItems: 'center'}}>
                <ReusableBtn
                                onPress={() => updateProfile()}
                                btnText={"Update Profile"}
                                width={(SIZES.width - 50)/2}
                                backgroundColor={COLORS.white}
                                borderColor={COLORS.blue}
                                borderWidth={2}
                                textColor={COLORS.blue}
                />
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UpdateProfile