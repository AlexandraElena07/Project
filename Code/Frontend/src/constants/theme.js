import { Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

const COLORS = {
    blue: "#4285f4",
    rose: "#ED0202",
    red: "#B50404",
    green: "#449282",
    white: "#FBFBFB",
    grey: "#d9d7d7",
    transparency: "",
    darkGrey:"#4A4949",
    lightBlue: "#1877F2",
    dark: "#1e1e1e",
    inactiveIcon: "#666262"
};

const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 34,
    xxLarge: 44,
    height,
    width
}

const TEXT = {
    xSmall: 10,
    small: 14,
    medium: 16,
    large: 20,
    xLarge: 28,
    xxLarge: 44
}

const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    large: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 10,
    },
};

export { COLORS, SIZES, TEXT, SHADOWS };