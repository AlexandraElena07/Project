import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, ActionSheetIOS, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './profileAfter';
import * as Updates from 'expo-updates';
import { COLORS, SIZES } from '../../constants/theme';
import { HeightSpacer, ReusableText, WidthSpacer, ReusableBtn, AppBar } from '../../components/index';
import { MaterialIcons } from '@expo/vector-icons';
import { ProfileTile } from "../../components"
import axios from 'axios';
import reusable from "../../components/Reusable/reusable.style";
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const PROFILE_PICTURE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&usqp=CAU';

const ProfileAfterLogin = () => {

    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleAbout, setModalVisibleAbout] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [destructiveButtonIndex, setDestructiveButtonIndex] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const navigation = useNavigation();

    const options = ['On', 'Off', 'System', 'Cancel'];

    const deviceTheme = useColorScheme();


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
        const unsubscribe = navigation.addListener('focus', () => {
            getDataFromDatabase();
        });

        return unsubscribe;
    }, [navigation]);

    const handleLogout = async () => {
        const token = await AsyncStorage.getItem('token');
        //console.log(token)
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
                }, 1000);
            });
        } catch (error) {
            Alert.alert('Error', 'An error occurred while deleting your account. Please try again later.');
            console.error('Error:', error);
        }
    };

    const handleActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: options,
                cancelButtonIndex: options.length - 1,
                destructiveButtonIndex: destructiveButtonIndex !== null ? destructiveButtonIndex : undefined,
                title: 'Dark Mode'
            },
            (index) => handleOptionPress(index)
        );
    };

    const handleOptionPress = (index) => {
        if (index === options.length - 1) return;
        setSelectedOption(index);


        if (options[index] === 'On' || options[index] === 'Off' || options[index] === 'System') {
            setDestructiveButtonIndex(index);
        } else {
            setDestructiveButtonIndex(null);
        }

        if (options[index] === 'On') {
            updateThemeOption('dark', username);
        } else if (options[index] === 'Off') {
            updateThemeOption('light', username);
        } else if (options[index] === 'System') {
            updateThemeOption(deviceTheme, username);
        }

        switch (index) {
            case 0:
                setDarkMode(true);
                break;
            case 1:
                setDarkMode(false);
                break;
            case 2:
                if (deviceTheme === 'dark') {
                    setDarkMode(true)
                } else {
                    setDarkMode(false)
                }
                break;
            default:
                break;
        }

    };

    const updateThemeOption = async (selectedOption, username) => {
        try {
            const response = await axios.post('http://10.9.31.61:5003/api/saveTheme', { username: username, theme: selectedOption });

            if (response.data.status) {
                //console.log('Tema a fost salvată cu succes în baza de date.');
                await Updates.reloadAsync();
                setLoading(true);
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while updating theme. Please try again later.');
            console.error('Error:', error);
        }
    };


    return (
        loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={COLORS.darkGrey} />
            </View>
        ) : (
            <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container, { backgroundColor: currentTheme.background }]}>
                    <View style={styles.profile}>
                        <TouchableOpacity onPress={() => navigation.navigate('ProfileImage')}>
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
                                color={currentTheme.color}
                            />
                            <WidthSpacer width={10} />
                            <MaterialIcons
                                onPress={() => navigation.navigate('UpdateProfile', { data: responseData })}
                                name="arrow-forward-ios" size={SIZES.medium} color={currentTheme.color} />
                        </View>

                        <HeightSpacer height={25} />

                    </View>

                    <View style={styles.option}>
                        <ReusableText
                            text={'My Account'}
                            family={'semibold'}
                            size={SIZES.medium}
                            color={currentTheme.color}
                        />
                    </View>

                    <View>
                        <ProfileTile title={"Favorites"} icon={'favorite'} onPress={() => navigation.navigate('Favorites')} />
                        <ProfileTile title={"Change personal information"} icon={'person'} onPress={() => navigation.navigate('UpdateProfile', { data: responseData })} />
                        <HeightSpacer height={2} />
                        <ProfileTile title={"Delete your account"} icon={'delete'} onPress={() => setModalVisible(true)} />

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}>

                            <View style={[styles.centeredView, { backgroundColor: currentTheme.background }]}>
                                <View style={[styles.modalView, { backgroundColor: currentTheme.background }]}>

                                    <Text style={[styles.modalText, { color: currentTheme.color }]}>Delete your account and personal info</Text>

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

                                            <WidthSpacer width={35} />

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
                            color={currentTheme.color}
                        />

                    </View>

                    <View>
                        <ProfileTile title={"Dark mode"} icon={'dark-mode'} onPress={handleActionSheet} />
                    </View>

                    <HeightSpacer height={20} />

                    <View style={styles.option}>
                        <ReusableText
                            text={'About App'}
                            family={'semibold'}
                            size={SIZES.medium}
                            color={currentTheme.color}
                        />

                    </View>

                    <View>
                        <ProfileTile title={"About Us"} icon={'info'} onPress={() => setModalVisibleAbout(true)} />

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisibleAbout}
                            onRequestClose={() => {
                                setModalVisible(!modalVisibleAbout);
                            }}>

                            <View style={styles.centeredView}>
                                <View style={[styles.modalViewAbout, { backgroundColor: currentTheme.background }]}>
                                    <View style={[styles.centerView, { backgroundColor: currentTheme.background }]}>
                                        {userTheme === 'dark' ? (
                                            <Image
                                                source={require('../../../assets/images/logo2White.png')}
                                                style={styles.image}
                                            />
                                        ) : (
                                            <Image
                                                source={require('../../../assets/images/logo2.png')}
                                                style={styles.image}
                                            />
                                        )}
                                    </View>

                                    <HeightSpacer height={50} />

                                    <Text style={[styles.textStyleAbout, { color: currentTheme.color }]}>RoExplorer is an application designed to promote Romania and to facilitate trip planning for tourists.</Text>

                                    <HeightSpacer height={25} />

                                    <Text style={[styles.textStyleAbout, { color: currentTheme.color }]}>The platform provides all the necessary information for tourists: Tourist attractions, Map of locations near the user, Museums, Tourist Circuits, Recommendations section, ideas for Leisure Time, Accommodations and Restaurants and Useful Information.</Text>

                                    <HeightSpacer height={100} />

                                    <View style={[styles.centerView, { backgroundColor: currentTheme.background }]}>
                                        <TouchableOpacity style={styles.buttonCancel} onPress={() => setModalVisibleAbout(!modalVisibleAbout)}>
                                            <Text style={styles.buttonTextCancel}>Cancel</Text>
                                        </TouchableOpacity>
                                        <HeightSpacer height={25} />
                                    </View>

                                </View>
                            </View>


                        </Modal>

                        <HeightSpacer height={2} />
                        <ProfileTile title={"Contact Us"} icon={'contact-page'} onPress={() => navigation.navigate('Contact', { data: responseData })} />
                    </View>

                    <HeightSpacer height={25} />

                    <View style={styles.profile}>
                        <ReusableBtn
                            onPress={handleLogout}
                            btnText={"Sign Out"}
                            width={(SIZES.width - 50) / 2.2}
                            backgroundColor={COLORS.red}
                            borderColor={COLORS.red}
                            borderWidth={1}
                            textColor={COLORS.white}
                        />

                        <HeightSpacer height={18} />

                        <ReusableText
                            text={'Authenticated as ' + email}
                            family={'regular'}
                            size={SIZES.small}
                            color={currentTheme.color}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    );
}

export default ProfileAfterLogin;