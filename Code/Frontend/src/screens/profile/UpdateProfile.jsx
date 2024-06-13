import React, { useState, useEffect, useContext } from 'react';
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
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const PROFILE_PICTURE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&usqp=CAU';

const UpdateProfile = () => {
    const navigation = useNavigation();
    const [profile, setProfile] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const route = useRoute();

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    //let result = {};

    useEffect(() => {
        const responseData = route.params.data;
        setUsername(responseData.username);
        setEmail(responseData.email); 
        setProfile(responseData.profile);
    }, [route.params.data])

    const handleImagePicked = async (pickerResult) => {
        if (pickerResult.cancelled || !pickerResult.assets) {
            console.log('No image selected or operation cancelled.');
            return;
        }
    
        const imageInfo = pickerResult.assets[0];
        const localUri = imageInfo.uri;
        const filename = localUri.split('/').pop();
        const type = imageInfo.mimeType || 'image/jpeg';
    
        const formData = new FormData();
        formData.append('profile', {
            uri: localUri,
            name: filename,
            type: type
        });
    
        formData.append('username', username); 
        formData.append('email', email);
    
        try {
            const response = await axios.post('http://10.9.31.61:5003/api/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (response.data.status) {
                setProfile(response.data.user.profile);
                Alert.alert('Success', 'Image uploaded successfully!');
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert('Error', error.message || 'Failed to upload image');
        }
    };    
    
    

    const takePhoto = async () => {
        const permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissions.granted) {
            alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        await handleImagePicked(result);
    };

    const selectImage = async () => {
        const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissions.granted) {
            alert('Permission to access gallery is required!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        await handleImagePicked(result);
        
    };
    
    const removeImage = async () => {
        try {
            const response = await axios.post('http://10.9.31.61:5003/api/update', {
                username,
                email,
                profile: PROFILE_PICTURE,
            });
    
            if (response.data.status) {
                setProfile(PROFILE_PICTURE);
                Alert.alert('Success', 'Profile picture removed successfully!');
            } else {
                throw new Error('Failed to remove profile picture');
            }
        } catch (error) {
            console.error("Error removing profile picture:", error);
            Alert.alert('Error', error.message || 'Failed to remove profile picture');
        }
    };
    
      
    const updateProfile = async () => {
        try {
            const formData = { username, email, profile };
            const response = await axios.post('http://10.9.31.61:5003/api/update', formData);
            if (response.data.status) {
                await Updates.reloadAsync(); 
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'An error occurred while updating profile');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <ScrollView contentContainerStyle={[styles.container, {backgroundColor: currentTheme.background}]}>
                <View>
                    <ReusableText
                        text={'Change your personal data'}
                        family={''}
                        size={TEXT.xLarge}
                        color={currentTheme.color}
                    />

                    <HeightSpacer height={30}/>

                    <ReusableText
                        text={'Profile Photo'}
                        family={'semibold'}
                        size={TEXT.large}
                        color={currentTheme.color}
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

                <Text style = {{color:currentTheme.color}}>JPG or PNG format. </Text>
                <Text style = {{color:currentTheme.color}}>Picture layout: square. </Text>

                <HeightSpacer height={35}/>

                <ReusableText
                    text={'Personal Data'}
                    family={'semibold'}
                    size={TEXT.large}
                    color={currentTheme.color}
                />

                <HeightSpacer height={20}/>

                <ReusableText
                    text={'Username:'}
                    family={''}
                    size={TEXT.medium}
                    color={currentTheme.color}
                />

                <HeightSpacer height={5}/>

                <TextInput                     
                    placeholder='Enter your username'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={styles.input}
                    defaultValue={username}
                    onChangeText={(text) => setUsername(text)}
                    color={currentTheme.color}           
                />

                <HeightSpacer height={10}/>

                <ReusableText
                    text={'Email:'}
                    family={''}
                    size={TEXT.medium}
                    color={currentTheme.color}
                />

                <HeightSpacer height={5}/>

                <TextInput                     
                    placeholder='Enter your email'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={styles.inputEmail}
                    defaultValue={email}
                    editable={false}
                    backgroundColor={currentTheme.backgroundTextInput}
                    color={currentTheme.color}
                />
                <HeightSpacer height={55}/>

                <View style={{alignItems: 'center'}}>
                    <ReusableBtn
                        onPress={() => updateProfile()}
                        btnText={"Update Profile"}
                        width={(SIZES.width - 50)/2}
                        backgroundColor={currentTheme.backgroundButton}
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