import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from 'react'
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import ReusableText from "../Reusable/ReusableText";
import WidthSpacer from "../Reusable/WidthSpacer";
import reusable from "../Reusable/reusable.style";
import { MaterialIcons } from '@expo/vector-icons';
import themeContext from "../../constants/themeContext";
import themeDark from "../../constants/themeDark";

const ProfileTile = ({ onPress, title, icon }) => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={reusable.rowWithSpace('space-between')}>
                <View style={reusable.rowWithSpace('flex-start')}>
                    <MaterialIcons name={icon} size={SIZES.medium} color={currentTheme.color} />

                    <WidthSpacer width={20} />

                    <ReusableText
                        text={title}
                        family={''}
                        size={SIZES.medium}
                        color={currentTheme.color}
                    />

                </View>

            </View>

        </TouchableOpacity>
    )
}

export default ProfileTile

const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: SIZES.width,
        borderRadius: 0,
    }
})