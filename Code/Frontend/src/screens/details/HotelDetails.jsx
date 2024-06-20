import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, Linking, TouchableOpacity, StyleSheet, Modal, Alert, Share, TextInput } from 'react-native';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import { BottomButtons, HeightSpacer, ImageCarousel, ReusableText, Tiles, TopBarHotel, WidthSpacer, AppBar } from '../../components';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons'
import reusable from '../../components/Reusable/reusable.style';
import * as MailComposer from 'expo-mail-composer';
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage';

const HotelDetails = () => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const route = useRoute();
    const id = route.params;

    const [activeTab, setActiveTab] = useState('CONTACT');
    const navigation = useNavigation();

    const [hotel, setHotels] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const [mapRegion, setMapRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [mapMyRegion, setMapMyRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const [countyId, setCountyId] = useState();
    const getDataFromDatabase = async () => {
        try {

            const response = await axios.get(`http://10.9.31.61:5003/api/hotels/${id}`);
            const hotelData = response.data.hotel;

            setCountyId(hotelData.county_id);
            setHotels(hotelData);

            navigation.setOptions({
                title: response.data.hotel.title,
                headerBackTitle: 'Back'
            });

            setMapRegion({
                latitude: hotelData.latitude,
                longitude: hotelData.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            setAverageRating(response.data.averageRating);

        } catch (error) {
            console.error('Error:', error);
        }

    };

    const renderStarsOfHotel = (numStars) => (
        Array.from({ length: numStars }, (_, index) => (
            <MaterialIcons
                key={index}
                name="star"
                size={TEXT.xLarge}
                color={COLORS.yellow}
            />
        ))
    );

    const handleCallPress = () => {
        const phoneUrl = `tel:${hotel.phone}`;
        Linking.openURL(phoneUrl);
    }

    const sendEmail = async () => {
        try {
            await MailComposer.composeAsync({
                recipients: [hotel.mail]
            });
        } catch (error) {
            console.error('Eroare la compunerea emailului:', error);
        }
    }

    const handleSitePress = async (url) => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Can't open this URL: ${url}`);
        }
    };

    const openGoogleMaps = () => {
        const origin = 'My+Location';
        const destination = hotel.adress;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        Linking.openURL(url);
    };

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        setMapMyRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    }

    const [userId, setUserId] = useState();
    const [profileImage, setProfileImage] = useState();
    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.log('User not authenticated.');
                return;
            }

            const response = await axios.get('http://10.9.31.61:5003/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserId(response.data.id);
            setProfileImage(response.data.profile);

        } catch (error) {
            console.error('Error fetching user ID:', error);
            Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
        }
    };


    useEffect(() => {
        getDataFromDatabase();
        userLocation();
        getUser();
        checkIfFavorite();
    }, [id, navigation]);

    const handleStarPress = (star) => {
        setRating(star);  // Actualizăm ratingul direct
    };


    const handleModalClose = () => {
        setModalVisible(false);
        setReview('');
        setRating(0);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <MaterialIcons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={20}
                    color={i <= rating ? COLORS.yellow : COLORS.grey}
                />
            );
        }
        return stars;
    };


    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You need to be logged in to submit a review.');
                return;
            }

            const authResponse = await axios.get('http://10.9.31.61:5003/api/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const response = await axios.post(`http://10.9.31.61:5003/api/hotels/addReview/${id}`, {
                username: authResponse.data.username,
                profile: profileImage,
                rating,
                reviewText: review
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status) {
                Alert.alert('Success', 'Review added successfully!');
                handleModalClose();

                getDataFromDatabase();

            } else {
                Alert.alert('Error', 'Failed to add review.');
            }

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    const checkIfFavorite = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.log('User not authenticated');
                return;
            }

            const response = await axios.get('http://10.9.31.61:5003/api/users/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const isFav = response.data.favorites.some(fav => fav._id === id && fav.type === 'Hotel');
            setIsFavorite(isFav);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };


    const handleAddToFavorites = async (itemId, itemType, countyId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const endpoint = isFavorite ? 'removeFromFavorites' : 'addToFavorites';

            if (!token) {
                Alert.alert('Error', 'You need to be logged in to add to favorite list.');
                return;
            }

            const authResponse = await axios.get('http://10.9.31.61:5003/api/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const response = await axios.post(`http://10.9.31.61:5003/api/users/${endpoint}`, {
                userId: authResponse.data.userId,
                itemId,
                itemType,
                countyId: countyId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setIsFavorite(!isFavorite);
            } else {
                Alert.alert('Error', 'Failed to update favorite status.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this place: ${hotel.title} - ${hotel.location}\n\nView more at: exp://10.9.31.61:8081/--/roexplorer://${hotel.title}/${id}`,
            });

        } catch (error) {
            alert(error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };



    const renderContent = () => {
        switch (activeTab) {
            case 'CONTACT':
                return (
                    <View>
                        <View>
                            {hotel && <ImageCarousel images={hotel.imageUrls} />}
                        </View>
                        {hotel && (
                            <AppBar
                                top={5}
                                right={5}
                                icon1={isFavorite ? "favorite" : "favorite-outline"}
                                color1={COLORS.grey}
                                color4={COLORS.red}
                                icon2={"ios-share"}
                                color2={COLORS.grey}
                                onPress1={() => handleAddToFavorites(hotel._id, 'Hotel')}
                                onPress2={() => handleShare()}
                            />)}

                        <View style={[styles.contentContainer, { backgroundColor: currentTheme.background, marginTop: 20 }]}>


                            {hotel && (
                                <View style={reusable.container}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={{ flex: 1, marginRight: 20 }}>
                                            <ReusableText
                                                text={hotel.title}
                                                family={'bold'}
                                                color={currentTheme.color}
                                                size={24}
                                            />
                                        </View>

                                        {renderStarsOfHotel(hotel.star)}
                                    </View>


                                    <HeightSpacer height={5} />

                                    <View style={reusable.rowWithSpace('space-between')}>
                                        <View style={reusable.rowWithSpace('flex-start')}>
                                            <MaterialIcons name="place" size={SIZES.medium} color={currentTheme.color} />

                                            <WidthSpacer width={5} />

                                            <ReusableText
                                                text={hotel.location}
                                                family={''}
                                                size={SIZES.medium}
                                                color={currentTheme.color}
                                            />
                                        </View>
                                    </View>

                                    <HeightSpacer height={30} />

                                    <ReusableText
                                        text={'Contact Data'}
                                        family={'regular'}
                                        color={currentTheme.color}
                                        size={TEXT.large}
                                    />

                                    <HeightSpacer height={20} />

                                    {hotel.phone && (
                                        <>
                                            <View style={reusable.rowWithSpace('space-between')}>
                                                <View style={reusable.rowWithSpace('flex-start')}>
                                                    <Tiles title={" "} icon={'phone'} />
                                                    <TouchableOpacity onPress={handleCallPress}>
                                                        <ReusableText
                                                            text={hotel.phone}
                                                            family={''}
                                                            size={TEXT.medium}
                                                            color={currentTheme.phone}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <HeightSpacer height={10} />
                                        </>
                                    )}

                                    {hotel.mail && (
                                        <>
                                            <View style={reusable.rowWithSpace('space-between')}>
                                                <View style={reusable.rowWithSpace('flex-start')}>
                                                    <Tiles title={" "} icon={'mail'} />
                                                    <TouchableOpacity onPress={sendEmail}>
                                                        <ReusableText
                                                            text={hotel.mail}
                                                            family={''}
                                                            size={TEXT.medium}
                                                            color={currentTheme.phone}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <HeightSpacer height={10} />
                                        </>
                                    )}

                                    {hotel.website && (
                                        <>
                                            <View style={reusable.rowWithSpace('space-between')}>
                                                <View style={reusable.rowWithSpace('flex-start')}>
                                                    <Tiles title={" "} icon={'link'} />
                                                    <TouchableOpacity onPress={() => handleSitePress(hotel.website)}>
                                                        <ReusableText
                                                            text={hotel.website}
                                                            family={''}
                                                            size={TEXT.medium}
                                                            color={currentTheme.phone}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <HeightSpacer height={10} />
                                        </>
                                    )}

                                    {hotel.bookingsite && (
                                        <>
                                            <View style={reusable.rowWithSpace('space-between')}>
                                                <View style={reusable.rowWithSpace('flex-start')}>
                                                    <Tiles title={" "} icon={'explore'} />
                                                    <TouchableOpacity onPress={() => handleSitePress(hotel.bookingsite)}>
                                                        <ReusableText
                                                            text={'booking.com'}
                                                            family={''}
                                                            size={TEXT.medium}
                                                            color={currentTheme.phone}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <HeightSpacer height={10} />
                                        </>
                                    )}

                                    {hotel.adress && (
                                        <>
                                            <View style={reusable.rowWithSpace('space-between')}>
                                                <View style={reusable.rowWithSpace('flex-start')}>
                                                    <Tiles title={" "} icon={'near-me'} />
                                                    <TouchableOpacity onPress={openGoogleMaps}>
                                                        <ReusableText
                                                            text={hotel.adress}
                                                            family={''}
                                                            size={TEXT.medium}
                                                            color={currentTheme.phone}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <HeightSpacer height={10} />
                                        </>
                                    )}

                                    <View>
                                        <MapView style={styles.map} region={mapRegion}>
                                            <Marker coordinate={mapRegion} title={hotel.title + ' ' + capitalizeFirstLetter(hotel.category)} />
                                            <Marker coordinate={mapMyRegion} title="My Location" />
                                        </MapView>

                                        <TouchableOpacity style={styles.directionsButton} onPress={openGoogleMaps}>
                                            <MaterialIcons name="directions" size={34} color="white" />
                                        </TouchableOpacity>

                                    </View>

                                    <HeightSpacer height={40} />
                                </View>
                            )}
                        </View>
                    </View>
                )
            case 'RATING':
                return (
                    <View style={[{ backgroundColor: currentTheme.background, padding: 20 }]}>
                        <View style={reusable.rowWithSpace('space-between')}>
                            <View style={reusable.rowWithSpace('flex-start')}>
                                <ReusableText
                                    text={'Reviews'}
                                    family={'semibold'}
                                    size={TEXT.medium}
                                    color={currentTheme.color}
                                />

                                <WidthSpacer width={130} />
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                                        <Tiles title={"Write a review"} icon={'note-alt'} />
                                    </TouchableOpacity>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={modalVisible}
                                        onRequestClose={() => {
                                            setModalVisible(!modalVisible);
                                        }}>
                                        <View style={styles.modalBackground}>
                                            <View style={[styles.modalView, { backgroundColor: currentTheme.background }]}>
                                                <View style={styles.modalCenter}>
                                                    <ReusableText
                                                        text={'Reviews'}
                                                        family={'semibold'}
                                                        size={TEXT.medium}
                                                        color={currentTheme.color}
                                                    />

                                                    <View style={styles.starsContainer}>
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                                                <MaterialIcons
                                                                    name={star <= rating ? 'star' : 'star-outline'}
                                                                    size={40}
                                                                    color={COLORS.yellow}
                                                                />
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                </View>

                                                <ReusableText
                                                    text={'Add your comment:'}
                                                    family={'semibold'}
                                                    size={TEXT.small}
                                                    color={currentTheme.color}
                                                />

                                                <HeightSpacer height={10} />

                                                <TextInput
                                                    placeholder='Enter your review comment'
                                                    placeholderTextColor={currentTheme.color}
                                                    autoCorrect={false}
                                                    style={styles.input}
                                                    multiline={true}
                                                    returnKeyType='done'
                                                    backgroundColor={currentTheme.background}
                                                    color={currentTheme.color}
                                                    value={review}
                                                    onChangeText={text => setReview(text)}
                                                />

                                                <HeightSpacer height={25} />

                                                <View style={reusable.rowWithSpace('space-between')}>
                                                    <View style={reusable.rowWithSpace('flex-start')}>

                                                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleSubmit()}>
                                                            <Text style={styles.buttonTextDelete}>Submit</Text>
                                                        </TouchableOpacity>

                                                        <WidthSpacer width={35} />

                                                        <TouchableOpacity style={styles.buttonCancel} onPress={() => handleModalClose()}>
                                                            <Text style={styles.buttonTextCancel}>Cancel</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            </View>
                        </View>
                        <HeightSpacer height={10} />
                        <View style={[styles.reviewContainer, { backgroundColor: currentTheme.background }]}>
                            {hotel.reviews.length > 0 ? (
                                hotel.reviews.map((review, index) => (
                                    <View key={index} style={styles.reviewItem}>
                                        <View style={styles.reviewHeader}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={styles.profileAvatarWrapper}>
                                                    <Image
                                                        alt="Profile picture"
                                                        source={{ uri: review.profile }}
                                                        style={styles.profileAvatarDelete}
                                                    />
                                                </View>
                                                <Text style={[styles.reviewUsername, { color: currentTheme.color }]}>{review.username}</Text>
                                            </View>

                                            <View style={styles.starsContainer}>
                                                {renderStars(review.rating)}
                                            </View>
                                        </View>
                                        <Text style={[styles.reviewText, { color: currentTheme.color }]}>{review.reviewText}</Text>
                                        <Text style={[styles.reviewDate, { color: currentTheme.color }]}>{formatDate(review.date)}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={[styles.noReviews, { color: currentTheme.color }]}>No reviews yet.</Text>
                            )}
                        </View>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <TopBarHotel activeTab={activeTab} setActiveTab={setActiveTab} averageRating={averageRating} />
            <ScrollView showsVerticalScrollIndicator={false} style={[{ backgroundColor: currentTheme.background }]}>
                {renderContent()}
                <HeightSpacer height={20} />
            </ScrollView>

        </SafeAreaView>
    );
};

export default HotelDetails;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        marginHorizontal: 5
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10
    },
    map: {
        height: 200
    },
    content: {
        flex: 1,
        margin: 20
    },
    directionsButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 5,
    },
    modalContainer: {
        flexDirection: 'row',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCenter: {
        alignItems: 'center'
    },
    modalView: {
        width: '80%',
        margin: 20,
        borderRadius: 20,
        padding: 35,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeText: {
        marginTop: 15,
        color: COLORS.primary,
        fontWeight: 'bold',
    },

    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 9,
        borderColor: COLORS.grey,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: SIZES.medium,
        marginBottom: 10,
        height: 120
    },
    deleteButton: {
        flexDirection: 'row',
        height: 34,
        width: 105,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextDelete: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonCancel: {
        flexDirection: 'row',
        height: 34,
        width: 105,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextCancel: {
        color: COLORS.red,
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewContainer: {
        padding: 0,
        backgroundColor: COLORS.white,
    },
    reviewItem: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewUsername: {
        fontWeight: 'bold',
        marginLeft: 5,
        marginTop: 5
    },
    starsContainer: {
        flexDirection: 'row',
    },
    reviewText: {
        marginTop: 5,
    },
    reviewDate: {
        marginTop: 5,
        textAlign: 'right'
    },
    noReviews: {
        textAlign: 'center',
        marginTop: 10,
        color: COLORS.grey,
    },
    profileAvatarWrapper: {
        position: 'relative',
    },
    profileAvatarDelete: {
        width: 30,
        height: 30,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: COLORS.white
    },
})
