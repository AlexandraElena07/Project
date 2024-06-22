import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, FlatList, Image, Modal, Dimensions, Animated } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import themeDark from '../../constants/themeDark';
import themeContext from '../../constants/themeContext';
import { MaterialIcons } from '@expo/vector-icons'
import { Alert } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FavoriteScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [groupedFavorites, setGroupedFavorites] = useState([]);
    const [counties, setCounties] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userId, setUserId] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(screenWidth)).current;
    const [selectedCounty, setSelectedCounty] = useState(null);

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const [initialGroupedFavorites, setInitialGroupedFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
        fetchCounties();
        getUser();
    }, []);

    useEffect(() => {
        if (groupedFavorites.length > 0 && initialGroupedFavorites.length === 0) {
            setInitialGroupedFavorites(groupedFavorites);
        }
    }, [groupedFavorites]);

    const fetchCounties = async () => {
        try {
            const response = await axios.get('http://10.9.31.61:5003/api/counties');
            setCounties(response.data.counties);
        } catch (error) {
            console.error('Error fetching counties:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.get('http://10.9.31.61:5003/api/users/favorites', {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });

            if (!response.data || !response.data.favorites) {
                console.error('Favorites data is missing or undefined');
                setGroupedFavorites([]);
                return;
            }

            const favoritesData = response.data.favorites || [];

            const detailedFavorites = await Promise.all(favoritesData.map(async (fav) => {
                if (!fav.details) return null;

                let customTitle;
                if (fav.type === 'County') {
                    customTitle = 'About County';
                } else if (fav.type === 'Place') {
                    customTitle = 'Tourist Attraction';
                } else {
                    customTitle = 'Accommodation';
                }

                return { ...fav, customTitle };
            }));

            const filteredDetailedFavorites = detailedFavorites.filter(fav => fav !== null);

            const groupedData = ['County', 'Place', 'Hotel'].map(type => {
                const sectionData = filteredDetailedFavorites.filter(item => item.type === type);
                if (sectionData.length > 0) {
                    const title = sectionData[0].customTitle;
                    return { title, data: sectionData };
                }
                return null;
            }).filter(section => section !== null);

            setInitialGroupedFavorites(groupedData);

            if (selectedCounty) {
                const filteredFavorites = groupedData.map(section => {
                    const filteredData = section.data.filter(fav => {
                        const favCountyIdStr = fav.countyId ? fav.countyId.toString() : null;
                        return favCountyIdStr === selectedCounty;
                    });

                    return {
                        ...section,
                        data: filteredData
                    };
                }).filter(section => section.data.length > 0);

                setGroupedFavorites(filteredFavorites);
            } else {
                setGroupedFavorites(groupedData);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            Alert.alert('Error', 'Failed to fetch favorites.');
        }
    };


    const navigateToItem = async (item) => {
        if (item.type === 'Place') {
            try {
                const response = await axios.get(`http://10.9.31.61:5003/api/places/${item._id}`);
                if (response.data.place) {
                    navigation.navigate('PlaceDetails', item._id);
                } else {
                    console.error('Place not found in the response');
                }
            } catch (error) {
                console.error('Error fetching place details:', error);
            }
        } else if (item.type === 'Hotel') {
            try {
                const response = await axios.get(`http://10.9.31.61:5003/api/hotels/${item._id}`);

                if (response.data.hotel) {
                    navigation.navigate('HotelDetails', item._id);
                } else {
                    console.error('Hotel not found in the response');
                }
            } catch (error) {
                console.error('Error fetching hotel details:', error);
            }
        } else if (item.type === 'County') {
            try {
                const response = await axios.get(`http://10.9.31.61:5003/api/counties/${item._id}`);

                if (response.data.county) {
                    navigation.navigate('AboutCounty', { item: response.data });
                } else {
                    console.error('County not found in the response');
                }
            } catch (error) {
                console.error('Error fetching county details:', error);
            }
        }
    };

    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://10.9.31.61:5003/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserId(response.data.id);
        } catch (error) {
            console.error('Error fetching id:', error);
        }
    };

    const removeFromFavorites = async (itemId, itemType) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.post('http://10.9.31.61:5003/api/users/removeFromFavorites', {
                userId: userId,
                itemId: itemId,
                itemType: itemType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setIsFavorite(current => !current);
                const updatedFavorites = initialGroupedFavorites.map(section => ({
                    ...section,
                    data: section.data.filter(fav => fav._id !== itemId || fav.type !== itemType)
                })).filter(section => section.data.length > 0);

                setInitialGroupedFavorites(updatedFavorites);

                if (selectedCounty) {
                    const filteredFavorites = updatedFavorites.map(section => {
                        const filteredData = section.data.filter(fav => {
                            const favCountyIdStr = fav.countyId ? fav.countyId.toString() : null;
                            return favCountyIdStr === selectedCounty;
                        });

                        return {
                            ...section,
                            data: filteredData
                        };
                    }).filter(section => section.data.length > 0);

                    setGroupedFavorites(filteredFavorites);
                } else {
                    setGroupedFavorites(updatedFavorites);
                }
            } else {
                Alert.alert('Error', 'Failed to update favorite status.');
            }
        } catch (error) {
            console.error('Error on removing from favorites:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };


    const getFormattedData = (data) => {
        if (!data) {
            return [];
        }

        if (data.length % 2 !== 0) {
            return [...data, { _id: 'empty', isEmpty: true, itemType: 'Empty' }];
        }
        return data;
    };

    const openModal = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setModalVisible(false);
        });
    };

    const renderFavorite = ({ item, index }) => {
        const getContent = () => {
            if (item.type === 'County') {
                return (
                    item.isEmpty ? (
                        <View style={styles.emptyCard}></View>
                    ) : (
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.details.imageUrl }} style={styles.image} />
                                <TouchableOpacity style={styles.box} onPress={() => removeFromFavorites(item._id, item.type)}>
                                    <MaterialIcons name="favorite" size={25} color={COLORS.red} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: currentTheme.backgroundTiles, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                <Text style={[styles.title, { color: currentTheme.textButton }]}>{item.details.county}</Text>
                            </View>
                        </View>
                    )
                );
            } else if (item.type === 'Place') {
                return (
                    item.isEmpty ? (
                        <View style={styles.emptyCard}></View>
                    ) : (
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.details.imageUrls[0] }} style={styles.image} />
                                <TouchableOpacity style={styles.box} onPress={() => removeFromFavorites(item._id, item.type)}>
                                    <MaterialIcons name="favorite" size={26} color={COLORS.red} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: currentTheme.backgroundTiles, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                <Text style={[styles.title, { color: currentTheme.textButton }]}>{item.details.title}</Text>
                            </View>
                        </View>
                    )
                );
            } else if (item.type === 'Hotel') {
                return (
                    item.isEmpty ? (
                        <View style={styles.emptyCard}></View>
                    ) : (
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.details.imageUrls[0] }} style={styles.image} />
                                <TouchableOpacity style={styles.box} onPress={() => removeFromFavorites(item._id, item.type)}>
                                    <MaterialIcons name="favorite" size={26} color={COLORS.red} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: currentTheme.backgroundTiles, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                <Text style={[styles.title, { color: currentTheme.textButton }]}>{item.details.title}</Text>
                            </View>
                        </View>
                    )
                );
            }
        };

        return (
            <TouchableOpacity style={styles.cardContainer} onPress={() => navigateToItem(item)}>
                {getContent()}
            </TouchableOpacity>
        );
    };

    const renderSection = ({ section }) => (
        <FlatList
            data={getFormattedData(section.data)}
            renderItem={renderFavorite}
            keyExtractor={(item, index) => `${item._id}_${item.type}_${index}`} // Cheie unică
            numColumns={2}
            contentContainerStyle={styles.sectionContent}
            ListFooterComponent={<View style={styles.footerSpace} />}
            showsVerticalScrollIndicator={false}
        />
    );

    const handleCountySelect = async (county) => {
        try {
            const countyIdStr = county._id.toString();
            setSelectedCounty(countyIdStr); // Track the selected county

            const filteredFavorites = initialGroupedFavorites.map(section => {
                const filteredData = section.data.filter(fav => {
                    const favCountyIdStr = fav.countyId ? fav.countyId.toString() : null;
                    return favCountyIdStr === countyIdStr;
                });

                return {
                    ...section,
                    data: filteredData
                };
            }).filter(section => section.data.length > 0);

            setGroupedFavorites(filteredFavorites);
            closeModal();
        } catch (error) {
            console.error('Error filtering by county:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <TouchableOpacity onPress={openModal} style={styles.filterButton}>
                <MaterialIcons name="filter-list" size={24} color={currentTheme.color} />
            </TouchableOpacity>
            <SectionList
                sections={groupedFavorites}
                keyExtractor={(item, index) => `${item._id}_${item.type}_${index}`} // Cheie unică
                renderItem={() => null}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={[styles.header, { color: currentTheme.color }]}>{title}</Text>
                )}
                renderSectionFooter={({ section }) => renderSection({ section })}
                showsVerticalScrollIndicator={false}
            />
            {modalVisible && (
                <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={[styles.modalContent, { backgroundColor: currentTheme.background }]}>
                        <Text style={[styles.modalTitle, { color: currentTheme.color }]}>Select County</Text>
                        <FlatList
                            data={counties}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleCountySelect(item)}>
                                    <Text style={[styles.modalItem, { color: currentTheme.color }]}>{item.county}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                            <Text style={[styles.modalCloseButtonText, { color: currentTheme.color }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    filterButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 10,
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 5,
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    box: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.grey,
        width: 35,
        height: 35,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 10,
    },
    emptyCard: {
        flex: 1,
        margin: 8,
    },
    footerSpace: {
        height: 10,
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: screenWidth * 0.75,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalItem: {
        padding: 10,
        fontSize: 18,
    },
    modalCloseButton: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 20
    },
    modalCloseButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FavoriteScreen;
