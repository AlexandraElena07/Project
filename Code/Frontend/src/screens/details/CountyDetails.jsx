import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, VirtualizedList } from 'react-native';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import { useRoute } from '@react-navigation/native'
import { Attractions, DescriptionText, HeightSpacer, NetworkImage, ReusableText, ReusableTile, WidthSpacer } from '../../components/index';
import axios from 'axios';
import AppBar from '../../components/Reusable/AppBar';
import { COLORS, TEXT, SIZES } from '../../constants/theme';
import reusable from '../../components/Reusable/reusable.style';
import { MaterialIcons } from '@expo/vector-icons'

const CountyDetails = ({ navigation }) => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const route = useRoute();
    const { item } = route.params;

    const [places, setPlaces] = useState([]);
    const [hotels, setHotels] = useState([]);

    const getDataFromDatabase = async () => {
        try {
            const responsePlaces = await axios.get(`http://10.9.31.61:5003/api/places/byCounty/${item._id}`);

            let fetchedPlaces = [...responsePlaces.data.places];
            fetchedPlaces.sort((a, b) => b.averageRating - a.averageRating);

            const filteredPlaces = fetchedPlaces.slice(0, 4);
            setPlaces(filteredPlaces);

            const responseHotels = await axios.get(`http://10.9.31.61:5003/api/hotels/byCounty/${item._id}`);

            let fetchedHotels = [...responseHotels.data.hotels];
            fetchedHotels.sort((a, b) => b.averageRating - a.averageRating);

            const filteredHotels = fetchedHotels.slice(0, 4);
            setHotels(filteredHotels);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataFromDatabase();
        });
        return unsubscribe;
    }, [navigation]);

    const renderStars = (numStars) => (
        Array.from({ length: numStars }, (_, index) => (
            <MaterialIcons
                key={index}
                name="star"
                size={15}
                color={COLORS.yellow}
            />
        ))
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View>
                <NetworkImage source={item.imageUrl} width={"100%"} height={200} radius={0} resizeMode={'cover'} />
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AboutCounty', { item })}>
                        <Text style={styles.text}>Discover {item.county} County</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={reusable.container}>
                <HeightSpacer height={35} />

                <View style={[reusable.rowWithSpace('space-between'), { paddingBottom: 20 }]}>
                    <ReusableText
                        text={'Tourist Attractions'}
                        family={'medium'}
                        size={TEXT.large}
                        color={currentTheme.color}
                    />

                    <TouchableOpacity onPress={() => navigation.navigate('TouristAttraction', { item })}>
                        <MaterialIcons
                            name="list"
                            size={TEXT.xLarge}
                            color={currentTheme.color}
                        />
                    </TouchableOpacity>
                </View>

                <VirtualizedList
                    data={places}
                    horizontal
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ columnGap: SIZES.medium }}
                    showsHorizontalScrollIndicator={false}
                    getItemCount={(data) => data.length}
                    getItem={(data, index) => data[index]}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.touristContainer, { backgroundColor: currentTheme.backgroundTiles }]} onPress={() => navigation.navigate('PlaceDetails', item._id)}>
                            <View style={reusable.rowWithSpace('flex-start')}>
                                <NetworkImage source={item.imageUrls[0]} width={80} height={80} radius={12} />
                                <WidthSpacer width={15} />

                                <View>

                                    <ReusableText
                                        text={item.title}
                                        family={'medium'}
                                        size={SIZES.medium}
                                        color={currentTheme.color}
                                    />

                                    <HeightSpacer height={6} />

                                    <ReusableText
                                        text={item.location}
                                        family={'medium'}
                                        size={14}
                                        color={currentTheme.color}
                                    />

                                    <HeightSpacer height={12} />

                                    <View style={reusable.rowWithSpace('flex-start')}>
                                        <MaterialIcons name='star' size={15} color={COLORS.yellow} />

                                        <WidthSpacer width={5} />
                                        <ReusableText
                                            text={item.averageRating.toFixed(1)}
                                            family={'medium'}
                                            size={15}
                                            color={currentTheme.color}
                                        />

                                        <WidthSpacer width={5} />
                                        <ReusableText
                                            text={`(${item.reviews.length} Reviews)`}
                                            family={'medium'}
                                            size={14}
                                            color={currentTheme.color}
                                        />
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={reusable.container}>
                <HeightSpacer height={35} />

                <View style={[reusable.rowWithSpace('space-between'), { paddingBottom: 20 }]}>
                    <ReusableText
                        text={'Accommodation'}
                        family={'medium'}
                        size={TEXT.large}
                        color={currentTheme.color}
                    />

                    <TouchableOpacity onPress={() => navigation.navigate('Hotels', { item })}>
                        <MaterialIcons
                            name="list"
                            size={TEXT.xLarge}
                            color={currentTheme.color}
                        />
                    </TouchableOpacity>
                </View>

                <VirtualizedList
                    data={hotels}
                    horizontal
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ columnGap: SIZES.medium }}
                    showsHorizontalScrollIndicator={false}
                    getItemCount={(data) => data.length}
                    getItem={(data, index) => data[index]}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.hotelContainer, { backgroundColor: currentTheme.backgroundTiles }]} onPress={() => navigation.navigate('HotelDetails', item._id)}>
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ position: 'relative' }}>
                                    <NetworkImage source={item.imageUrls[0]} width={170} height={170} radius={12} />
                                    <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                        <View style={reusable.rowWithSpace('flex-start')}>
                                            {renderStars(item.star)}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View>

                                <ReusableText
                                    text={item.title}
                                    family={'medium'}
                                    size={SIZES.medium}
                                    color={currentTheme.color}
                                />

                                <HeightSpacer height={6} />

                                <ReusableText
                                    text={item.location}
                                    family={'medium'}
                                    size={14}
                                    color={currentTheme.color}
                                />

                                <HeightSpacer height={12} />

                                <View style={reusable.rowWithSpace('flex-start')}>
                                    <MaterialIcons name='star' size={15} color={COLORS.yellow} />

                                    <WidthSpacer width={5} />
                                    <ReusableText
                                        text={item.averageRating.toFixed(1)}
                                        family={'medium'}
                                        size={15}
                                        color={currentTheme.color}
                                    />
                                    <WidthSpacer width={5} />
                                    <ReusableText
                                        text={`(${item.reviews.length} Reviews)`}
                                        family={'medium'}
                                        size={14}
                                        color={currentTheme.color}
                                    />

                                </View>

                            </View>

                        </TouchableOpacity>

                    )}
                />
                <HeightSpacer height={52} />
            </View>


        </ScrollView>
    );
}

export default CountyDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        backgroundColor: COLORS.white,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 50,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginHorizontal: 10,
        opacity: .6,
    },
    text: {
        color: COLORS.black,
        textAlign: 'center',
        fontSize: TEXT.small,
        fontFamily: 'bold'
    },

    touristContainer: {
        padding: 8,
        borderRadius: 12
    },
    hotelContainer: {
        padding: 10,
        borderRadius: 12,
        width: 190
    },


})
