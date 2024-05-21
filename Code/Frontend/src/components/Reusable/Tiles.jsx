import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {useContext} from 'react'
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import ReusableText from "./ReusableText";
import WidthSpacer from "./WidthSpacer";
import reusable from "./reusable.style";
import { MaterialIcons } from '@expo/vector-icons';
import themeContext from "../../constants/themeContext";
import themeDark from "../../constants/themeDark";

const Tiles = ({ title, icon}) => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    return(
        
             <View style={reusable.rowWithSpace('space-between')}>
                <View style={reusable.rowWithSpace('flex-start')}>
                    <MaterialIcons name={icon} size={TEXT.medium} color={currentTheme.color}/>
                    
                    <WidthSpacer width={5}/>

                    <ReusableText
                        text={title}
                        family={''}
                        size={TEXT.medium}
                        color={currentTheme.color}
                    />

            </View>
            
            </View>
            
        
    )
}

export default Tiles

const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: SIZES.width,
        borderRadius: 0,
    }
})