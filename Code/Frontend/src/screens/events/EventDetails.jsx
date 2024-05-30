import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, FlatList, Linking, TouchableOpacity } from 'react-native';
import themeContext from '../../constants/themeContext';
import reusable from '../../components/Reusable/reusable.style';
import themeDark from '../../constants/themeDark';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'
import { SIZES, TEXT } from '../../constants/theme';

const EventDetails = () => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;
 
    const route = useRoute();
    const eventId = route.params;
 
    const [data, setData] = useState([]);
 
    const getDataFromDatabase = async () => {
     try {
         const eventsResponse = await axios.get(`http://10.9.31.61:5003/api/eventCounty/byEvent/${eventId}`);
         const exhibitionsResponse = await axios.get(`http://10.9.31.61:5003/api/exhibitionCounty/byEvent/${eventId}`);
 
         const eventsData = eventsResponse.data
           .map(event => ({ ...event, type: 'event' }))
           .sort((a, b) => new Date(b.date) - new Date(a.date));
 
         const exhibitionsData = exhibitionsResponse.data
           .map(exhibition => ({ ...exhibition, type: 'exhibition' }))
           .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
 
         setData([
             { title: 'Events', data: eventsData, type: 'header' },
             ...eventsData,
             { title: 'Exhibitions', data: exhibitionsData, type: 'header' },
             ...exhibitionsData
         ]);        
        
     } catch (error) {
         console.error('Error:', error);
     }
    };
 
    useEffect(() => {
         getDataFromDatabase();
     }, []);
 
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
             return <Text style={{color: currentTheme.color, marginTop: 35, fontSize: 26, fontFamily: 'bold'}}>{item.title}</Text>;
         } else if (item.type === 'event') {
             return renderEventItem(item);
         } else if (item.type === 'exhibition') {
             return renderExhibitionItem(item);
         }
     };
 
     const renderEventItem = item => (
         <View style={styles.container}>
             <MaterialIcons name='circle' size={14} color={currentTheme.color} style={{ marginRight: 5, marginTop: 4 }} />
             <View style={styles.content}>
                 <Text style={[styles.title, {color: currentTheme.color}]}>"{item.title}"</Text>
                 <Text style={{color: currentTheme.color}}>({new Date(item.date).toLocaleDateString()}) - {item.location}, hours {item.timestart} - {item.timeend}</Text>
                 {item.description && (
                    <View style={reusable.rowWithSpace('flex-start')}> 
                        <Text style={[ {color: currentTheme.color}]}>Details: </Text>
                        <TouchableOpacity onPress={() => handleSitePress(item.description)}>
                            <Text style={[ {color: currentTheme.phone}]}>{item.title.slice(0, 10)}... </Text>
                        </TouchableOpacity>
                    </View>
                 )}
             </View>
         </View>
     );
 
     const renderExhibitionItem = item => (
         <View style={styles.container}>
             <MaterialIcons name='circle' size={14} color={currentTheme.color} style={{ marginRight: 5, marginTop: 4 }} />
             <View style={styles.content}>
                 <Text style={[styles.title, {color: currentTheme.color}]}>"{item.title}"</Text>
                 <Text style={{color: currentTheme.color}}>({new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}) - {item.location}</Text>
                 {item.description && (
                    <View style={reusable.rowWithSpace('flex-start')}> 
                        <Text style={[ {color: currentTheme.color}]}>Details: </Text>
                        <TouchableOpacity onPress={() => handleSitePress(item.description)}>
                            <Text style={[ {color: currentTheme.phone,}]}>{item.title.slice(0, 10)}... </Text>
                        </TouchableOpacity>
                    </View>
                 )}
             </View>
         </View>
     );
 
     return (
         <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
             <View style={[reusable.container, { backgroundColor: currentTheme.background }]}>
                 <FlatList
                     data={data}
                     keyExtractor={item => item._id ? item._id.toString() : `item-${Math.random()}`} // Ajustare pentru a asigura chei unice
                     renderItem={renderItem}
                     showsVerticalScrollIndicator={false}
                 />
             </View>
         </SafeAreaView>
     );
 };
 
 export default EventDetails;

 
const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 10
    },
    bullet: {
      fontSize: 14,
      marginRight: 5,
      marginTop: 4
    },
    content: {
      flex: 1
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16
    },
  });
