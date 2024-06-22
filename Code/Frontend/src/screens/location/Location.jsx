import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Alert, Modal, Linking } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { HeightSpacer, NetworkImage, ReusableText, WidthSpacer } from '../../components';
import { getDistance } from 'geolib';
import { MaterialIcons } from '@expo/vector-icons'

const LocationPage = () => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [place, setPlace] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [hotel, setHotel] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const [mapRegion, setMapRegion] = useState({
        latitude: 45.9432,
        longitude: 24.9668,
        latitudeDelta: 10,
        longitudeDelta: 10,
    });

    const [mapMyRegion, setMapMyRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

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

    const placeLocation = async () => {
        try {
            const response = await axios.get(`http://10.9.31.61:5003/api/places`);
            const placeData = response.data.places;
            setPlace(placeData);

            //console.log(placeData)

        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'Failed to get place location. Please try again later.');
        }
    };

    const hotelLocation = async () => {
        try {
            const response = await axios.get(`http://10.9.31.61:5003/api/hotels`);
            const hotelData = response.data.hotels;
            setHotel(hotelData);

            //console.log(hotelData)

        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'Failed to get hotel location. Please try again later.');
        }
    };

    const handlePressPlace = (place) => {
        setModalVisible(true);

        const distance = getDistance(
            { latitude: mapMyRegion.latitude, longitude: mapMyRegion.longitude },
            { latitude: place.latitude, longitude: place.longitude }
        );

        const distanceInKm = (distance / 1000).toFixed(2);

        setSelectedPlace({ ...place, distance: distanceInKm });
    };

    const handlePressHotel = (hotel) => {
        //console.log('Marker pressed:', hotel); 
        setModalVisible(true);

        //console.log('Selected hotel',selectedHotel);

        const distance = getDistance(
            { latitude: mapMyRegion.latitude, longitude: mapMyRegion.longitude },
            { latitude: hotel.latitude, longitude: hotel.longitude }
        );

        // Convert distance from meters to kilometers
        const distanceInKm = (distance / 1000).toFixed(2);

        //console.log(distanceInKm);

        setSelectedHotel({ ...hotel, distance: distanceInKm });
    };


    const handleNavigatePlace = () => {
        if (selectedPlace) {
            navigation.navigate('PlaceDetails', selectedPlace._id);
        }
        setModalVisible(false)
    };

    const handleNavigateHotel = () => {
        if (selectedHotel) {
            navigation.navigate('HotelDetails', selectedHotel._id);
        }
        setModalVisible(false)
    };

    const openGoogleMapsForPlace = () => {
        const origin = 'My+Location';
        const destination = selectedPlace.adress;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        Linking.openURL(url);
    };

    const openGoogleMapsForHotel = () => {
        const origin = 'My+Location';
        const destination = selectedHotel.adress;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        Linking.openURL(url);
    };

    useEffect(() => {
        userLocation();
        placeLocation();
        hotelLocation();
    }, []);

    return (
        <>
            <MapView style={{ flex: 1 }} >
                <Marker coordinate={mapMyRegion} title="My Location" />
                {place.map(place => (
                    <Marker
                        key={place._id}
                        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                        title={place.title}
                        onPress={() => handlePressPlace(place)}
                    >
                        <Image
                            source={require('../../../assets/images/placePin.png')}
                            style={{ width: 45, height: 45 }}
                        />
                    </Marker>
                ))}

                {hotel.map(hotel => (
                    <Marker
                        key={hotel._id}
                        coordinate={{ latitude: hotel.latitude, longitude: hotel.longitude }}
                        title={hotel.title}
                        onPress={() => handlePressHotel(hotel)} >

                        <TouchableOpacity onPress={() => handlePressHotel(hotel)}>
                            <Image
                                source={require('../../../assets/images/hotelPin.png')}
                                style={{ width: 45, height: 45 }}
                            />

                        </TouchableOpacity>
                    </Marker>
                ))}
            </MapView>
            {(selectedPlace || selectedHotel) && (

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <TouchableOpacity
                        style={styles.outerModal}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}>

                        <TouchableOpacity
                            style={[styles.innerModal, { backgroundColor: currentTheme.background }]}
                            activeOpacity={1}
                            onPress={selectedHotel ? handleNavigateHotel : handleNavigatePlace}
                        >
                            <View style={reusable.rowWithSpace('space-between')}>
                                <View style={reusable.rowWithSpace('flex-start')}>

                                    <NetworkImage source={selectedHotel ? selectedHotel.imageUrls[0] : selectedPlace.imageUrls[0]} width={85} height={85} radius={12} />

                                    <WidthSpacer width={10} />

                                    <View style={{ width: '75%' }}>
                                        <ReusableText
                                            text={selectedHotel ? selectedHotel.title : selectedPlace.title}
                                            family={'bold'}
                                            color={currentTheme.color}
                                            size={TEXT.medium}
                                        />
                                        <HeightSpacer height={10} />
                                        <ReusableText
                                            text={selectedHotel ? selectedHotel.category.toUpperCase() : selectedPlace.category.toUpperCase()}
                                            family={'light'}
                                            color={currentTheme.color}
                                            size={TEXT.small}
                                        />
                                        <HeightSpacer height={10} />
                                        <ReusableText
                                            text={selectedHotel ? `Distance: ${selectedHotel.distance} km` : `Distance: ${selectedPlace.distance} km`}
                                            family={'regular'}
                                            color={currentTheme.color}
                                            size={TEXT.small}
                                        />
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.directionsButton} onPress={selectedHotel ? openGoogleMapsForHotel : openGoogleMapsForPlace}>
                                <MaterialIcons name="directions" size={34} color={currentTheme.color} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}

        </>
    );
}

export default LocationPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    outerModal: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: SIZES.width - 30,
        marginBottom: 30,
        margin: 15
    },
    innerModal: {
        padding: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
        borderRadius: 10
    },
    directionsButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 5,
    },
})
