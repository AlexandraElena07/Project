import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TEXT } from '../../constants/theme';


const DescriptionText = ({lines, text, color, size}) => {

    return (
       <Text numberOfLines={lines} style={styles.description(color, size)}>{text}</Text>
    );
}

export default DescriptionText;

const styles = StyleSheet.create({
    description: (color, size) => ({
        color: color,
        paddingVertical: 10,
        fontFamily: 'regular2',
        textAlign: "justify",
        fontSize: size
    })


})
 