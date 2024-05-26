import React from 'react';
import { ScrollView, View, Image, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const ImageCarousel = ({ images }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}  // Folosește direct imageUrl ca uri
            style={styles.image}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  }
});

export default ImageCarousel;
