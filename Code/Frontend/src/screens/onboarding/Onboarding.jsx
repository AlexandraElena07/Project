import { SafeAreaView, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import Slides from '../../components/Onboard/Slides';

const Onboarding = () => {
    const slides = [
        {
            id: 1,
            image: require('../../../assets/images/background.jpg'),
            title: "Find the perfect place to visit"
        },
        {
            id: 2,
            image: require('../../../assets/images/2.jpg'),
            title: "Discover Romania"
        }
    ]
  return (
    <FlatList 
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Slides item={item}/>}

    />
  );
}

export default Onboarding
