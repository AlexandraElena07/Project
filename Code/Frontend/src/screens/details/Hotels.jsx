import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, ActionSheetIOS } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native'; // Added useNavigation hook
import axios from 'axios';
import { HeightSpacer, NetworkImage, ReusableText, WidthSpacer } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

const Hotels = () => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;
    const navigation = useNavigation(); // Initialize navigation

    const route = useRoute();
    const { item } = route.params;

    const [hotels, setHotels] = useState([]);
    const [hotelsByCategory, setHotelsByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [destructiveButtonIndex, setDestructiveButtonIndex] = useState('all');
    const options = ['All', 'Hostel', 'Hotel', 'Pension', 'Villa', 'Cancel'];

    const getDataFromDatabase = async () => {
        try {
            const response = await axios.get(`http://10.9.31.61:5003/api/hotels/byCounty/${item._id}`);
            const fetchedHotels = response.data.hotels;

            const categories = [...new Set(fetchedHotels.map(hotel => hotel.category))];
            const hotelsByCategory = {};
            categories.forEach(category => {
                hotelsByCategory[category] = fetchedHotels.filter(hotel => hotel.category === category);
            });

            hotelsByCategory['all'] = fetchedHotels;
            setHotelsByCategory(hotelsByCategory);
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

    const handleActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: options,
            cancelButtonIndex: options.length - 1,
            destructiveButtonIndex: destructiveButtonIndex !== null ? destructiveButtonIndex : undefined,
            title: 'Choose the accommodation category',
        },
            (buttonIndex) => {
                if (buttonIndex !== options.length - 1) {
                    const categorySelected = options[buttonIndex];
                    setSelectedCategory(categorySelected.toLowerCase());
                    setDestructiveButtonIndex(buttonIndex);
                }
            });
    };

    const filteredHotels = selectedCategory === 'All' ? hotels : hotelsByCategory[selectedCategory] || [];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ marginHorizontal: 20 }}>

                <ScrollView horizontal={true} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={false}>

                    <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.backgroundSelectedButton }]} onPress={handleActionSheet}>
                        <View style={reusable.rowWithSpace('flex-start')}>
                            <MaterialIcons name={'tune'} size={16} />
                            <WidthSpacer width={5} />
                            <Text style={[styles.text, { color: currentTheme.textSelectedButton }]}>Filter</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                <FlatList
                    data={filteredHotels}
                    numColumns={2}
                    ListFooterComponent={<View style={styles.footerSpace} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        item.isEmpty ? (
                            <View style={styles.emptyCard}></View>
                        ) : (
                            <TouchableOpacity style={[styles.hotelContainer, { backgroundColor: currentTheme.backgroundTiles }]} onPress={() => navigation.navigate('HotelDetails', item._id)}>
                                <View style={{ alignItems: 'center', }}>
                                    <View style={{ position: 'relative' }}>
                                        <NetworkImage source={item.imageUrls[0]} width={140} height={120} radius={12} />
                                        <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                            <View style={reusable.rowWithSpace('flex-start')}>
                                                {renderStars(item.star)}
                                            </View>

                                        </View>
                                        <HeightSpacer height={10} />
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


                                    <View style={reusable.rowWithSpace('flex-start')}>
                                        <MaterialIcons name='place' size={15} />

                                        <WidthSpacer width={5} />

                                        <ReusableText
                                            text={item.location}
                                            family={'small'}
                                            size={14}
                                            color={currentTheme.color}
                                        />
                                    </View>

                                    <HeightSpacer height={2} />

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
                        )
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default Hotels;

const styles = StyleSheet.create({
    scrollView: {
        paddingVertical: 5,
        margin: 5
    },
    button: {
        padding: 8,
        borderRadius: 12
    },
    text: {
        fontSize: 16,
        margin: 2,
    },
    hotelContainer: {
        padding: 10,
        borderRadius: 12,
        width: 170,
        marginRight: 10,
        marginTop: 10
    },
    footerSpace: {
        height: 100,
    },
    emptyCard: {
        flex: 1,
        margin: 8,
    },
});
