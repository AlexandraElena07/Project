import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from 'react'
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import ReusableText from "./ReusableText";
import WidthSpacer from "./WidthSpacer";
import reusable from "./reusable.style";
import { MaterialIcons } from '@expo/vector-icons';

const ProfileTile = ({onPress, title, icon}) => {
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
             <View style={reusable.rowWithSpace('space-between')}>
                <View style={reusable.rowWithSpace('flex-start')}>
                    <MaterialIcons name={icon} size={SIZES.medium}/>
                    
                    <WidthSpacer width={20}/>

                    <ReusableText
                        text={title}
                        family={''}
                        size={SIZES.medium}
                        color={COLORS.black}
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
        backgroundColor: COLORS.white,
        borderRadius: 0,
    }
})