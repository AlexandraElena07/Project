import React from 'react';
import { StyleSheet, Image } from 'react-native';

const NetworkImage = ({source, width, height, radius, resizeMode}) => {
 
   return (
    <Image
        source={{uri:source}}
        style={styles.image(width, height, radius, resizeMode)}
    />
   );
}

export default NetworkImage

const styles = StyleSheet.create({
    image: (width, height, radius, resizeMode) => ({
        width: width,
        height: height,
        borderRadius: radius,
        resizeMode: resizeMode

    })
})
