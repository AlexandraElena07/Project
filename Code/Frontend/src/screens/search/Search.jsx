import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, TextInput, FlatList, Text, TouchableOpacity, Button, StyleSheet, View, Image, Keyboard } from 'react-native';
import axios from 'axios';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import { useNavigation } from '@react-navigation/native';
import reusable from '../../components/Reusable/reusable.style';
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../constants/theme';

function SearchBar() {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        if (query.length > 2) {
            fetchSuggestions();
            setResults([]);
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(`http://10.9.31.61:5003/api/search/suggest?query=${query}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://10.9.31.61:5003/api/search?query=${query}`);
            setResults(response.data);
            setSuggestions([]);
            Keyboard.dismiss();
        } catch (error) {
            console.error('Failed to search:', error);
        }
    };

    const handleQueryChange = (text) => {
        setQuery(text);
        if (!text) {
            setResults([]);
        }
    };

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: currentTheme.background }]}>
            <View style={[reusable.container, { backgroundColor: currentTheme.background }]}>
                <View style={[reusable.rowWithSpace('flex-start'), { position: 'relative' }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={SIZES.large} color={currentTheme.color} />
                    </TouchableOpacity>
                    <TextInput
                        value={query}
                        onChangeText={handleQueryChange}
                        placeholder="Search for attraction or accommodation"
                        placeholderTextColor={currentTheme.backgroundSelectedButton}
                        style={[styles.input, { backgroundColor: currentTheme.backgroundTextInput }]}
                        color={currentTheme.color}
                    />
                </View>
                <Button title="Search" color={COLORS.red} onPress={handleSearch} />
                {suggestions.length > 0 && (
                    <FlatList
                        data={suggestions}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                            <View style={[reusable.rowWithSpace('flex-start'), { position: 'relative' }]}>
                                <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
                                <TouchableOpacity onPress={() => {
                                    const screenName = item.type === 'accommodation' ? 'HotelDetails' : 'PlaceDetails';
                                    navigation.navigate(screenName, item._id);
                                }}>
                                    <Text style={[styles.text, { color: currentTheme.color }]}>{item.title}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                {suggestions.length === 0 && results.length > 0 && (
                    <FlatList
                        data={results}
                        keyExtractor={item => item._id.toString()}
                        renderItem={({ item }) => (
                            <View style={[reusable.rowWithSpace('flex-start'), { position: 'relative' }]}>
                                <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
                                <TouchableOpacity onPress={() => {
                                    const screenName = item.type === 'accommodation' ? 'HotelDetails' : 'PlaceDetails';
                                    navigation.navigate(screenName, item._id);
                                }}>
                                    <Text style={[styles.text, { color: currentTheme.color }]}>{item.title}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderRadius: 99,
        padding: 10,
        margin: 6,
        flex: 1
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 99,
        marginRight: 5
    },
    text: {
        padding: 10,
        flex: 1,
        flexWrap: 'wrap'
    }
})
