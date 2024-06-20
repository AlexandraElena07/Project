import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, VirtualizedList } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { COLORS, SIZES } from '../../constants/theme';
import { MaterialIcons } from "@expo/vector-icons"
import { NetworkImage, ReusableText, HeightSpacer, WidthSpacer } from '../../components';

const TouristAttraction = () => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const navigation = useNavigation();

    const route = useRoute();
    const { item } = route.params;

    const [places, setPlaces] = useState([]);
    const [placesByCategory, setPlacesByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('All');

    const getDataFromDatabase = async () => {
        try {
            const response = await axios.get(`http://10.9.31.61:5003/api/places/byCounty/${item._id}`);
            setPlaces(response.data.places);

            const fetchedPlaces = response.data.places;

            const categories = [...new Set(fetchedPlaces.map(place => place.category))];

            const placesByCategory = {};
            categories.forEach(category => {
                placesByCategory[category] = fetchedPlaces.filter(place => place.category === category);
            });

            placesByCategory['All'] = fetchedPlaces;

            setPlacesByCategory(placesByCategory);

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

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ marginHorizontal: 20 }}>

                <View>
                    <ScrollView horizontal={true} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.button, selectedCategory === 'All' ? { backgroundColor: currentTheme.backgroundSelectedButton } : { backgroundColor: currentTheme.backgroundTiles }]}
                            onPress={() => handleCategoryPress('All')}>
                            <Text style={[styles.text, selectedCategory === 'All' ? { color: currentTheme.textSelectedButton } : { color: currentTheme.textButton }]}>All Attraction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, selectedCategory === 'monument' ? { backgroundColor: currentTheme.backgroundSelectedButton } : { backgroundColor: currentTheme.backgroundTiles }]}
                            onPress={() => handleCategoryPress('monument')}>
                            <Text style={[styles.text, selectedCategory === 'monument' ? { color: currentTheme.textSelectedButton } : { color: currentTheme.textButton }]}>Historical Monument</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, selectedCategory === 'museum' ? { backgroundColor: currentTheme.backgroundSelectedButton } : { backgroundColor: currentTheme.backgroundTiles }]}
                            onPress={() => handleCategoryPress('museum')}>
                            <Text style={[styles.text, selectedCategory === 'museum' ? { color: currentTheme.textSelectedButton } : { color: currentTheme.textButton }]}>Museum</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, selectedCategory === 'church' ? { backgroundColor: currentTheme.backgroundSelectedButton } : { backgroundColor: currentTheme.backgroundTiles }]}
                            onPress={() => handleCategoryPress('church')}>
                            <Text style={[styles.text, selectedCategory === 'church' ? { color: currentTheme.textSelectedButton } : { color: currentTheme.textButton }]}>Church</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, selectedCategory === 'natural' ? { backgroundColor: currentTheme.backgroundSelectedButton } : { backgroundColor: currentTheme.backgroundTiles }]}
                            onPress={() => handleCategoryPress('natural')}>
                            <Text style={[styles.text, selectedCategory === 'natural' ? { color: currentTheme.textSelectedButton } : { color: currentTheme.textButton }]}>Natural Attraction</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <View>
                    {placesByCategory[selectedCategory] && (
                        <VirtualizedList
                            data={placesByCategory[selectedCategory]}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={<View style={styles.footerSpace} />}
                            getItemCount={(data) => data.length}
                            getItem={(data, index) => data[index]}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={[styles.cardContainer, { backgroundColor: currentTheme.backgroundTiles }]} onPress={() => navigation.navigate('PlaceDetails', item._id)}>
                                    <View style={reusable.rowWithSpace('flex-start')}>
                                        <NetworkImage source={item.imageUrls[0]} width={80} height={80} radius={12} />

                                        <WidthSpacer width={15} />

                                        <View style={{ width: 290 }}>
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
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

export default TouristAttraction

const styles = StyleSheet.create({
    cardContainer: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
        width: 353
    },
    scrollView: {
        paddingVertical: 20,
    },
    button: {
        marginRight: 10,
        padding: 7,
        borderRadius: 12,
    },
    selectedButton: {
        backgroundColor: COLORS.grey
    },
    text: {
        fontSize: 16,
    },
    footerSpace: {
        height: 160
    }
})
