import React, { useState, useRef } from 'react';
import { ScrollView, View, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import RadioButton from '../../components/Buttons/RadioButton';

const { width } = Dimensions.get('window');

const ImageCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(scrollPosition / width);
    setActiveIndex(currentIndex);
  };

  const handleIndicatorPress = (index) => {
    setActiveIndex(index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <RadioButton
            key={index}
            selected={index === activeIndex}
            onPress={() => handleIndicatorPress(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 270,
  },
  image: {
    width: width,
    height: 270,
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
});

export default ImageCarousel;
