import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import reusable from "./reusable.style";
import { MaterialIcons } from "@expo/vector-icons"
import ReusableText from "./ReusableText";
import { COLORS, SIZES, TEXT } from "../../constants/theme"
import WidthSpacer from "./WidthSpacer";


const AppBar = ({color, title, color1, icon, onPress, onPress1, color2, icon2, onPress2, top, left, right}) => {
    return(
        <View style={styles.overlay(top, left, right)}>
            <View style={reusable.rowWithSpace("space-between")}>
            <View>
                <TouchableOpacity style={styles.box(color)} onPress={onPress}>
                    <MaterialIcons name="arrow-back-ios" size={26} color={COLORS.white}/>
                </TouchableOpacity>
            </View>

            <View>
                <ReusableText
                    text={title}
                    family={"medium"}
                    size={TEXT.xLarge}
                    color={COLORS.white}
                />
            </View>
            <View style={reusable.rowWithSpace("space-between")}>
                <TouchableOpacity style={styles.box1(color1)} onPress={onPress1}>
                    <MaterialIcons name={icon} size={26}/>
                </TouchableOpacity>

                <WidthSpacer width={5}/>

                <TouchableOpacity style={styles.box2(color2)} onPress={onPress2}>
                    <MaterialIcons name={icon2} size={26}/>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AppBar;

const styles = StyleSheet.create({
    overlay: (top, left, right) => ({
        position: "absolute",
        top: top,
        left: left,
        right: right,
        justifyContent: "center",
    }),

    box: (color) => ({
        backgroundColor:color,
        width: 35,
        height: 35,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5
    }),
    box1: (color1) => ({
        backgroundColor:color1,
        width: 35,
        height: 35,
        borderRadius: 99,
        alignItems: "center",
        justifyContent: "center",
        opacity: .5
        }),
    box2: (color2) => ({
        backgroundColor:color2,
        width: 35,
        height: 35,
        borderRadius: 99,
        alignItems: "center",
        justifyContent: "center",
        opacity: .5,
        marginRight: 5
        }),
})