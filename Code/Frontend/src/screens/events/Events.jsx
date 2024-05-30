import React, { useContext, useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, VirtualizedList, TouchableOpacity, Linking } from 'react-native';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import { NetworkImage, HeightSpacer, ReusableText, WidthSpacer } from '../../components';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'
import reusable from '../../components/Reusable/reusable.style';
import { useNavigation } from '@react-navigation/native';

const Events = () => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const navigation = useNavigation();

    const [events, setEvents] = useState([]);
    const [counties, setCounties] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState('663d27e1f574f329fe84ed5d');
    const [eventCounty, setEventCounties] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);

    const getEventsFromDatabase = async () => {
        try {
            const response = await axios.get('http://10.9.31.61:5003/api/events');
            let events = response.data.events;
    
            events = events.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    
            await Promise.all(events.map(async (event) => {
                const res = await axios.get(`http://10.9.31.61:5003/api/eventCounty/byEvent/${event._id}`);
                event.eventCounties = res.data; 
            }));
    
            setEvents(events);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const getCountiesFromDatabase = async () => {
        try {
            const response = await axios.get('http://10.9.31.61:5003/api/counties');
            setCounties(response.data.counties);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getEventsFromDatabase();
        getCountiesFromDatabase();
    }, []);

    const handleCountySelection = (countyId) => {
        setSelectedCounty(countyId);
    };

    const filteredEvents = selectedCounty ? events.filter(event => event.county_id === selectedCounty) : events;

    const combinedData = [{ type: 'header', data: counties }, { type: 'eventTitle', data: { title: 'EVENTS' } }, ...filteredEvents.map(e => ({ type: 'event', data: e }))];

    const handleSitePress = async (url) => {
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert(`Can't open this URL: ${url}`);
        }
    }; 

      
    const renderItem = ({ item }) => {
        if (item.type === 'header') { 
            return (
                <FlatList
                    data={item.data}
                    horizontal
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                    <View style={{margin: SIZES.medium}}>
                        <TouchableOpacity onPress={() => handleCountySelection(item._id)}>
                            <View style={reusable.rowWithSpace('space-between')}>
                                <View style={reusable.rowWithSpace('flex-start')}>
                                    <MaterialIcons name={selectedCounty === item._id ? 'radio-button-checked' : 'radio-button-unchecked'} color={currentTheme.color}/>
                                    <WidthSpacer width={10}/>
                                    <ReusableText
                                        text={item.county}
                                        family={'medium'}
                                        size={TEXT.small}
                                        color={currentTheme.color}
                                        align={"center"}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>

                       
                    </View>
                    )}
                />
            );
        } else if (item.type === 'eventTitle') {
            return (
                <View style={{ marginVertical: SIZES.medium }}>
                    <HeightSpacer height={40}/>
                    <Text style={{
                        fontSize: TEXT.xLarge,
                        color: currentTheme.color,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>{item.data.title}</Text>
                    <HeightSpacer height={20}/>
                </View>
            );
        } else if (item.type === 'event') {
            return (
                <View style={{margin: 20}}>
                    <NetworkImage source={item.data.imageUrl} width={"100%"} height={210} radius={12} resizeMode={'cover'}/>
                    <HeightSpacer height={15}/>
                    <ReusableText
                        text={`${item.data.title} ${item.data.county_name} from ${new Date(item.data.start_date).toLocaleDateString()} to ${new Date(item.data.end_date).toLocaleDateString()}`}
                        family={'regular'}
                        size={TEXT.medium}
                        color={currentTheme.color}
                    />
                    <HeightSpacer height={10}/>
                    {item.data.eventCounties && item.data.eventCounties.length > 0 && (
                        <View key={item.data.eventCounties[0]._id}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {item.data.eventCounties[1].title && (
                                    <Text style={{ color: currentTheme.color, fontSize: 16, lineHeight: 25 }}>
                                        {`"${item.data.eventCounties[1].title}" `}
                                    </Text>
                                )}
                                {item.data.eventCounties[1].date && (
                                    <Text style={{ color: currentTheme.color, fontSize: 16, lineHeight: 25 }}>
                                        {`on ${new Date(item.data.eventCounties[1].date).toLocaleDateString()} `}
                                    </Text>
                                )}
                                {item.data.eventCounties[1].time && (
                                    <Text style={{ color: currentTheme.color, fontSize: 16, lineHeight: 25 }}>
                                        {`at ${item.data.eventCounties[1].time} `}
                                    </Text>
                                )}
                                {item.data.eventCounties[1].description && (
                                <Text style={{ color: currentTheme.color, fontSize: 16, lineHeight: 25 }}>
                                    {'Details: '}
                                </Text>                                
                                )}
                                {item.data.eventCounties[1].description && (
                                    <TouchableOpacity onPress={() => handleSitePress(item.data.eventCounties[0].description)}>
                                        <Text style={{ color: currentTheme.phone, fontSize: 16, lineHeight: 25, textDecorationLine: 'underline' }}>
                                            {`${item.data.eventCounties[1].title.slice(0, 5)}... `}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {item.data.eventCounties[1].location && (
                                    <Text style={{ color: currentTheme.color, fontSize: 16, lineHeight: 25 }}>
                                        {` -> ${item.data.eventCounties[1].location}`}
                                    </Text>
                                )}
                            </View>
                            <HeightSpacer height={20}/>
                        </View>
                    )}


                    <TouchableOpacity
                                
                                onPress={() =>  navigation.navigate('EventDetails',  item.data._id )}>

                                <View style={reusable.rowWithSpace('space-between')}>
                                    <View style={reusable.rowWithSpace('flex-start')}>
                                            
                                            
                                                <ReusableText
                                                    text={'Read More'}
                                                    family={''}
                                                    size={TEXT.medium}
                                                    color={COLORS.red}
                                                />

                                                <WidthSpacer width={5}/>

                                                <MaterialIcons name={'read-more'} color={COLORS.red} size={TEXT.medium}/>
                                            
                                    </View>
                                </View>
                                

                            </TouchableOpacity>
                </View>
            );
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background}}>
            <FlatList
                data={combinedData}
                keyExtractor={(item, index) => item.type + index}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

export default Events;
