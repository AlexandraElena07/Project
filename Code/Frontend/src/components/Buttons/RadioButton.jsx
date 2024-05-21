import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const RadioButton = ({ selected, onPress }) => {
    return (
        <TouchableOpacity style={styles.radioButton} onPress={onPress}>
            {selected && <View style={styles.radioButtonIcon} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioButton: {
        height: 15,
        width: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.grey,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    radioButtonIcon: {
        height: 15,
        width: 15,
        borderRadius: 12,
        backgroundColor: COLORS.grey,
    },
});

export default RadioButton;
